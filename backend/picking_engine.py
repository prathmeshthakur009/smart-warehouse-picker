from typing import List, Tuple

from warehouse_graph import BinLocation, WarehouseGraphEngine
from locations import get_location
from products import get_product


class PickingEngine:
    def __init__(self):
        self.graph_engine = WarehouseGraphEngine()

        # ======================================
        # START LOCATION
        # ======================================

        self.start_location = BinLocation(
            location_id="PICKER_START",
            zone="START",
            x=0,
            y=0,
            z=0,
        )

        # ======================================
        # COUNTER LOCATION
        # ======================================

        self.counter_location = BinLocation(
            location_id="COUNTER",
            zone="COUNTER",
            x=2,
            y=0,
            z=0,
        )

    # ==========================================
    # CHECK A-SERIES BIN
    # ==========================================

    @staticmethod
    def is_a_location(location_id: str) -> bool:
        """
        A-series examples:

        A1-03-01-A
        A4-02-03-C
        A10-08-06-B

        Non-A examples:

        CR-01-01-A
        FO-01-01-A
        FR-02-01-B
        """

        location_id = location_id.strip().upper()

        return location_id.startswith("A")

    # ==========================================
    # FULL A-ADDRESS SORT KEY
    # ==========================================

    @staticmethod
    def extract_a_sort_key(location_id: str):
        """
        Full bin sorting:

        1. Aisle
        2. Rack
        3. Shelf
        4. Side

        Example:

        A5-01-03-A
        A5-01-09-B
        A5-03-02-C
        A5-03-05-A

        Default:

        A5-01-03-A
        A5-01-09-B
        A5-03-02-C
        A5-03-05-A

        Reverse:

        A5-03-05-A
        A5-03-02-C
        A5-01-09-B
        A5-01-03-A
        """

        address = location_id.strip().upper()

        parts = address.split("-")

        # Safety for invalid addresses
        if len(parts) != 4:
            return (
                999999,
                999999,
                999999,
                "Z",
            )

        # ======================================
        # 1. AISLE
        # A5 -> 5
        # A10 -> 10
        # ======================================

        aisle_part = parts[0]

        if aisle_part.startswith("A"):
            try:
                aisle_number = int(
                    aisle_part[1:]
                )
            except ValueError:
                aisle_number = 999999
        else:
            aisle_number = 999999

        # ======================================
        # 2. RACK
        # ======================================

        try:
            rack_number = int(parts[1])
        except ValueError:
            rack_number = 999999

        # ======================================
        # 3. SHELF
        # ======================================

        try:
            shelf_number = int(parts[2])
        except ValueError:
            shelf_number = 999999

        # ======================================
        # 4. SIDE
        # ======================================

        side = parts[3]

        return (
            aisle_number,
            rack_number,
            shelf_number,
            side,
        )

    # ==========================================
    # WALKING DISTANCE
    # ==========================================

    def calculate_distance(
        self,
        location_a: BinLocation,
        location_b: BinLocation,
    ) -> float:

        return self.graph_engine.calculate_walking_distance(
            location_a,
            location_b,
        )

    # ==========================================
    # GET PRODUCT LOCATION
    # ==========================================

    def get_product_location(
        self,
        product_name: str,
    ) -> BinLocation:

        product = get_product(product_name)

        if not product.bin_address:
            raise ValueError(
                f"No bin address assigned to product: "
                f"{product.name}"
            )

        return get_location(
            product.bin_address
        )

    # ==========================================
    # MAIN PICKING SEQUENCE
    # ==========================================

    def generate_product_picking_sequence(
        self,
        product_names: List[str],
        reverse_a: bool = False,
    ) -> Tuple[List[dict], float]:

        picker_items = []

        # ======================================
        # 1. PRODUCT -> LOCATION
        # ======================================

        for product_name in product_names:

            product = get_product(
                product_name
            )

            if not product.bin_address:
                raise ValueError(
                    f"No bin address assigned to product: "
                    f"{product.name}"
                )

            location = get_location(
                product.bin_address
            )

            picker_items.append(
                {
                    "product": product,
                    "location": location,
                }
            )

        if not picker_items:
            return [], 0.0

        # ======================================
        # 2. SPLIT INTO ZONES
        # ======================================

        a_items = []
        cr_items = []
        fo_items = []
        fr_items = []

        for item in picker_items:

            location = item["location"]

            location_id = (
                location.location_id
                .strip()
                .upper()
            )

            zone = (
                location.zone
                .strip()
                .upper()
            )

            # ------------------------------
            # A SERIES
            # ------------------------------

            if self.is_a_location(location_id):

                a_items.append(item)

            # ------------------------------
            # COLD ROOM
            # ------------------------------

            elif zone == "COLD_ROOM":

                cr_items.append(item)

            # ------------------------------
            # FROZEN
            # ------------------------------

            elif zone == "FROZEN":

                fo_items.append(item)

            # ------------------------------
            # FRESH
            # ------------------------------

            elif zone == "FRESH":

                fr_items.append(item)

            # ------------------------------
            # UNKNOWN NON-A
            # Keep safely at end
            # ------------------------------

            else:

                fr_items.append(item)

        # ======================================
        # 3. FULL A ADDRESS SORT
        # ======================================

        a_items.sort(
            key=lambda item:
                self.extract_a_sort_key(
                    item["location"].location_id
                )
        )

        # ======================================
        # 4. REVERSE A-SERIES
        # ======================================

        if reverse_a:
            a_items.reverse()

        # ======================================
        # 5. FINAL ZONE ORDER
        #
        # A -> CR -> FO -> FR
        #
        # CR / FO / FR remain fixed
        # ======================================

        sequence = (
            a_items
            + cr_items
            + fo_items
            + fr_items
        )

        # ======================================
        # 6. WALKING DISTANCE
        # START -> ITEMS
        # ======================================

        total_distance = 0.0

        current_location = (
            self.start_location
        )

        for item in sequence:

            next_location = (
                item["location"]
            )

            total_distance += (
                self.calculate_distance(
                    current_location,
                    next_location,
                )
            )

            current_location = (
                next_location
            )

        # ======================================
        # 7. LAST ITEM -> COUNTER
        # ======================================

        if sequence:

            total_distance += (
                self.calculate_distance(
                    current_location,
                    self.counter_location,
                )
            )

        # ======================================
        # 8. FRONTEND PICKER RESPONSE
        # ======================================

        result = []

        for item in sequence:

            product = item["product"]
            location = item["location"]

            result.append(
                {
                    # --------------------------
                    # PRODUCT ID
                    # --------------------------

                    "sku": product.sku,

                    # --------------------------
                    # DISPLAY NAME
                    # --------------------------

                    "product_name":
                        product.name,

                    # --------------------------
                    # CATEGORY
                    # --------------------------

                    "category":
                        product.category,

                    # --------------------------
                    # SIZE / VARIANT
                    # NEW
                    # --------------------------

                    "size":
                        product.size,

                    # --------------------------
                    # BIN
                    # --------------------------

                    "bin_address":
                        location.location_id,

                    # --------------------------
                    # ZONE
                    # --------------------------

                    "zone":
                        location.zone,

                    # --------------------------
                    # PRODUCT IMAGE
                    # --------------------------

                    "photo":
                        product.photo,

                    # --------------------------
                    # BARCODE
                    # --------------------------

                    "barcode":
                        product.barcode,

                    # --------------------------
                    # COORDINATES
                    # --------------------------

                    "x":
                        location.x,

                    "y":
                        location.y,

                    "z":
                        location.z,
                }
            )

        return (
            result,
            total_distance,
        )


# ==========================================
# NORMAL ROUTE TEST
# ==========================================

def run_normal_route_test():

    engine = PickingEngine()

    order = [
        "bread",
        "cooking oil",
        "rice",
        "sugar",
        "milk",
        "ice cream",
        "frozen peas",
        "lemon",
    ]

    # ======================================
    # DEFAULT
    # ======================================

    print(
        "\n==================================="
    )

    print(
        " DEFAULT ROUTE"
    )

    print(
        "==================================="
    )

    default_sequence, default_distance = (
        engine.generate_product_picking_sequence(
            order,
            reverse_a=False,
        )
    )

    print(
        "\nSTART: PICKER_START"
    )

    for i, item in enumerate(
        default_sequence,
        1,
    ):

        print(
            f"{i}. "
            f"{item['product_name']} "
            f"| Size: {item['size']} "
            f"| Bin: {item['bin_address']} "
            f"| Zone: {item['zone']}"
        )

    print(
        "\nCOUNTER: COUNTER"
    )

    print(
        f"\nTotal walking distance: "
        f"{default_distance:.1f} meters"
    )

    # ======================================
    # REVERSE
    # ======================================

    print(
        "\n==================================="
    )

    print(
        " REVERSE ROUTE"
    )

    print(
        "==================================="
    )

    reverse_sequence, reverse_distance = (
        engine.generate_product_picking_sequence(
            order,
            reverse_a=True,
        )
    )

    print(
        "\nSTART: PICKER_START"
    )

    for i, item in enumerate(
        reverse_sequence,
        1,
    ):

        print(
            f"{i}. "
            f"{item['product_name']} "
            f"| Size: {item['size']} "
            f"| Bin: {item['bin_address']} "
            f"| Zone: {item['zone']}"
        )

    print(
        "\nCOUNTER: COUNTER"
    )

    print(
        f"\nTotal walking distance: "
        f"{reverse_distance:.1f} meters"
    )


# ==========================================
# FULL ADDRESS TEST
# ==========================================

def run_full_address_sort_test():

    print(
        "\n==================================="
    )

    print(
        " FULL A-ADDRESS SORT TEST"
    )

    print(
        "==================================="
    )

    test_addresses = [
        "A5-03-05-A",
        "A5-01-09-B",
        "A5-03-02-C",
        "A5-01-03-A",
    ]

    print(
        "\nORIGINAL ORDER:"
    )

    for address in test_addresses:
        print(address)

    # ======================================
    # DEFAULT
    # ======================================

    default_sorted = sorted(
        test_addresses,
        key=PickingEngine.extract_a_sort_key,
    )

    print(
        "\nDEFAULT SORT:"
    )

    for address in default_sorted:
        print(address)

    # ======================================
    # REVERSE
    # ======================================

    reverse_sorted = list(
        reversed(default_sorted)
    )

    print(
        "\nREVERSE SORT:"
    )

    for address in reverse_sorted:
        print(address)

    # ======================================
    # EXPECTED
    # ======================================

    expected_default = [
        "A5-01-03-A",
        "A5-01-09-B",
        "A5-03-02-C",
        "A5-03-05-A",
    ]

    expected_reverse = [
        "A5-03-05-A",
        "A5-03-02-C",
        "A5-01-09-B",
        "A5-01-03-A",
    ]

    print(
        "\nDEFAULT CHECK:"
    )

    if default_sorted == expected_default:
        print("PASS")
    else:
        print("FAIL")
        print(
            "Expected:",
            expected_default,
        )

    print(
        "\nREVERSE CHECK:"
    )

    if reverse_sorted == expected_reverse:
        print("PASS")
    else:
        print("FAIL")
        print(
            "Expected:",
            expected_reverse,
        )


# ==========================================
# RUN TESTS
# ==========================================

if __name__ == "__main__":

    run_normal_route_test()

    run_full_address_sort_test()