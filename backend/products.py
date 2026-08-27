from pydantic import BaseModel


# ==========================================
# PRODUCT MODEL
# ==========================================

class Product(BaseModel):
    sku: str
    name: str
    category: str
    bin_address: str = ""
    zone: str = ""
    photo: str = ""
    barcode: str = ""
    size: str = ""


# ==========================================
# MASTER PRODUCT CATALOG
# ==========================================

PRODUCTS = {

    # ======================================
    # FROZEN / VERY COLD
    # ======================================

    "ice cream": Product(
        sku="FRZ001",
        name="Ice Cream",
        category="FROZEN",
        bin_address="FO-01-01-A",
        zone="FROZEN",
        barcode="890000000001",
    ),

    "frozen french fries": Product(
        sku="FRZ002",
        name="Frozen French Fries",
        category="FROZEN",
        bin_address="FO-01-02-A",
        zone="FROZEN",
        barcode="890000000002",
    ),

    "frozen nuggets": Product(
        sku="FRZ003",
        name="Frozen Nuggets",
        category="FROZEN",
        bin_address="FO-01-03-A",
        zone="FROZEN",
        barcode="890000000003",
    ),

    "frozen peas": Product(
        sku="FRZ004",
        name="Frozen Peas",
        category="FROZEN",
        bin_address="FO-02-01-B",
        zone="FROZEN",
        barcode="890000000004",
    ),

    "frozen corn": Product(
        sku="FRZ005",
        name="Frozen Corn",
        category="FROZEN",
        bin_address="FO-02-02-B",
        zone="FROZEN",
        barcode="890000000005",
    ),

    "frozen samosa": Product(
        sku="FRZ006",
        name="Frozen Samosa",
        category="FROZEN",
        bin_address="FO-02-03-B",
        zone="FROZEN",
        barcode="890000000006",
    ),

    "frozen paratha": Product(
        sku="FRZ007",
        name="Frozen Paratha",
        category="FROZEN",
        bin_address="FO-03-01-C",
        zone="FROZEN",
        barcode="890000000007",
    ),

    # ======================================
    # CHILLED / DAIRY
    # ======================================

    "milk": Product(
        sku="CHL001",
        name="Milk",
        category="CHILLED",
        bin_address="CR-01-01-A",
        zone="COLD_ROOM",
        barcode="890000000008",
    ),

    "curd / dahi": Product(
        sku="CHL002",
        name="Curd / Dahi",
        category="CHILLED",
        bin_address="CR-01-02-A",
        zone="COLD_ROOM",
        barcode="890000000009",
    ),

    "butter": Product(
        sku="CHL003",
        name="Butter",
        category="CHILLED",
        bin_address="CR-01-03-A",
        zone="COLD_ROOM",
        barcode="890000000010",
    ),

    "paneer": Product(
        sku="CHL004",
        name="Paneer",
        category="CHILLED",
        bin_address="CR-02-01-B",
        zone="COLD_ROOM",
        barcode="890000000011",
    ),

    "cheese": Product(
        sku="CHL005",
        name="Cheese",
        category="CHILLED",
        bin_address="CR-02-02-B",
        zone="COLD_ROOM",
        barcode="890000000012",
    ),

    "chocolate": Product(
        sku="CHL006",
        name="Chocolate",
        category="CHILLED",
        bin_address="CR-02-03-B",
        zone="COLD_ROOM",
        barcode="890000000013",
    ),

    "cold drink / soft drink": Product(
        sku="CHL007",
        name="Cold Drink / Soft Drink",
        category="CHILLED",
        bin_address="CR-03-01-C",
        zone="COLD_ROOM",
        barcode="890000000014",
    ),

    "juice": Product(
        sku="CHL008",
        name="Juice",
        category="CHILLED",
        bin_address="CR-03-02-C",
        zone="COLD_ROOM",
        barcode="890000000015",
    ),

    # ======================================
    # FRESH / VEGETABLES
    # ======================================

    "potato": Product(
        sku="FRE001",
        name="Potato",
        category="FRESH",
        bin_address="FR-01-01-A",
        zone="FRESH",
        barcode="890000000016",
    ),

    "onion": Product(
        sku="FRE002",
        name="Onion",
        category="FRESH",
        bin_address="FR-01-02-A",
        zone="FRESH",
        barcode="890000000017",
    ),

    "tomato": Product(
        sku="FRE003",
        name="Tomato",
        category="FRESH",
        bin_address="FR-01-03-A",
        zone="FRESH",
        barcode="890000000018",
    ),

    "lemon": Product(
        sku="FRE004",
        name="Lemon",
        category="FRESH",
        bin_address="FR-02-01-B",
        zone="FRESH",
        barcode="890000000019",
    ),

    "coriander / dhaniya": Product(
        sku="FRE005",
        name="Coriander / Dhaniya",
        category="FRESH",
        bin_address="FR-02-02-B",
        zone="FRESH",
        barcode="890000000020",
    ),

    "green chilli": Product(
        sku="FRE006",
        name="Green Chilli",
        category="FRESH",
        bin_address="FR-02-03-B",
        zone="FRESH",
        barcode="890000000021",
    ),

    "ginger": Product(
        sku="FRE007",
        name="Ginger",
        category="FRESH",
        bin_address="FR-03-01-C",
        zone="FRESH",
        barcode="890000000022",
    ),

    "garlic": Product(
        sku="FRE008",
        name="Garlic",
        category="FRESH",
        bin_address="FR-03-02-C",
        zone="FRESH",
        barcode="890000000023",
    ),

    # ======================================
    # GROCERY
    # ======================================

    "maggi / instant noodles": Product(
        sku="GRC001",
        name="Maggi / Instant Noodles",
        category="GROCERY",
        bin_address="A1-01-01-A",
        zone="AMBIENT",
        barcode="890000000024",
    ),

    "biscuits": Product(
        sku="GRC002",
        name="Biscuits",
        category="GROCERY",
        bin_address="A1-02-01-A",
        zone="AMBIENT",
        barcode="890000000025",
    ),

    "bread": Product(
        sku="GRC003",
        name="Bread",
        category="GROCERY",
        bin_address="A1-03-01-A",
        zone="AMBIENT",
        barcode="890000000026",
    ),

    "cooking oil": Product(
        sku="GRC004",
        name="Cooking Oil",
        category="GROCERY",
        bin_address="A2-01-01-B",
        zone="AMBIENT",
        barcode="890000000027",
    ),

    "wheat flour / atta": Product(
        sku="GRC005",
        name="Wheat Flour / Atta",
        category="GROCERY",
        bin_address="A2-02-01-B",
        zone="AMBIENT",
        barcode="890000000028",
    ),

    "rice": Product(
        sku="GRC006",
        name="Rice",
        category="GROCERY",
        bin_address="A2-03-01-B",
        zone="AMBIENT",
        barcode="890000000029",
    ),

    "sugar": Product(
        sku="GRC007",
        name="Sugar",
        category="GROCERY",
        bin_address="A3-01-01-C",
        zone="AMBIENT",
        barcode="890000000030",
    ),

    "salt": Product(
        sku="GRC008",
        name="Salt",
        category="GROCERY",
        bin_address="A3-02-01-C",
        zone="AMBIENT",
        barcode="890000000031",
    ),

    "tea": Product(
        sku="GRC009",
        name="Tea",
        category="GROCERY",
        bin_address="A3-03-01-C",
        zone="AMBIENT",
        barcode="890000000032",
    ),

    "coffee": Product(
        sku="GRC010",
        name="Coffee",
        category="GROCERY",
        bin_address="A3-04-01-C",
        zone="AMBIENT",
        barcode="890000000033",
    ),

    "chips": Product(
        sku="GRC011",
        name="Chips",
        category="GROCERY",
        bin_address="A4-01-01-A",
        zone="AMBIENT",
        barcode="890000000034",
    ),

    "namkeen": Product(
        sku="GRC012",
        name="Namkeen",
        category="GROCERY",
        bin_address="A4-02-01-A",
        zone="AMBIENT",
        barcode="890000000035",
    ),

    # ======================================
    # GENERAL
    # ======================================

    "lipstick": Product(
        sku="GEN001",
        name="Lipstick",
        category="GENERAL",
        bin_address="A4-03-01-A",
        zone="AMBIENT",
        barcode="890000000036",
    ),

    "water bottle": Product(
        sku="GEN002",
        name="Water Bottle",
        category="GENERAL",
        bin_address="A4-04-01-A",
        zone="AMBIENT",
        barcode="890000000037",
    ),

    "tiffin box": Product(
        sku="GEN003",
        name="Tiffin Box",
        category="GENERAL",
        bin_address="A5-01-01-B",
        zone="AMBIENT",
        barcode="890000000038",
    ),

    # REAL PRODUCT BARCODE
    "mobile stand": Product(
        sku="GEN004",
        name="Mobile Stand",
        category="GENERAL",
        bin_address="A5-02-01-B",
        zone="AMBIENT",
        barcode="8904470006864",
    ),

    "football": Product(
        sku="GEN005",
        name="Football",
        category="GENERAL",
        bin_address="A5-03-01-B",
        zone="AMBIENT",
        barcode="890000000040",
    ),

    "soft toy": Product(
        sku="GEN006",
        name="Soft Toy",
        category="GENERAL",
        bin_address="A5-04-01-B",
        zone="AMBIENT",
        barcode="890000000041",
    ),

    # REAL PRODUCT BARCODE
    # Reusing an existing valid warehouse bin temporarily
    # so the current route graph does not fail on a new node.
    "eveready ultima": Product(
        sku="GEN007",
        name="Eveready Ultima Portable Anti-Mosquito Liquid Vaporiser",
        category="GENERAL",
        bin_address="A5-04-01-B",
        zone="AMBIENT",
        barcode="8901691027371",
        size="1 pc",
    ),
}


# ==========================================
# PRODUCT SEARCH
# ==========================================

def get_product(product_name: str) -> Product:
    key = product_name.strip().lower()

    if key not in PRODUCTS:
        raise ValueError(
            f"Product not found: {product_name}"
        )

    return PRODUCTS[key]


def get_all_products():
    return list(PRODUCTS.values())