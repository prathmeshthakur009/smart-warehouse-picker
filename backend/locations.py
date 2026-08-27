from warehouse_graph import BinLocation


# ==========================================
# FULL BIN ADDRESS -> COORDINATE ENGINE
# ==========================================
#
# Supported address formats:
#
# A3-04-06-C
# CR-01-02-A
# FR-02-01-B
# FO-03-04-C
#
# These coordinates are DEMO coordinates.
# Real warehouse measurements can replace them later.
# ==========================================


ZONE_CONFIG = {
    "A": {
        "zone": "AMBIENT",
        "base_x": 5,
        "base_y": 5,
    },
    "CR": {
        "zone": "COLD_ROOM",
        "base_x": 20,
        "base_y": 10,
    },
    "FR": {
        "zone": "FRESH",
        "base_x": 30,
        "base_y": 25,
    },
    "FO": {
        "zone": "FROZEN",
        "base_x": 40,
        "base_y": 35,
    },
}


def _parse_address(address: str):
    """
    Converts:

    A3-04-06-C
    into:

    prefix = A
    aisle = 3
    rack = 4
    shelf = 6
    side = C
    """

    parts = address.strip().upper().split("-")

    if len(parts) != 4:
        raise ValueError(
            f"Invalid bin address format: {address}"
        )

    prefix = parts[0]
    rack = int(parts[1])
    shelf = int(parts[2])
    side = parts[3]

    # A3 -> prefix A + aisle 3
    if prefix.startswith("A") and len(prefix) > 1:
        zone_prefix = "A"
        aisle = int(prefix[1:])

    elif prefix in {"CR", "FR", "FO"}:
        zone_prefix = prefix
        aisle = 1

    else:
        raise ValueError(
            f"Unknown warehouse zone: {prefix}"
        )

    return (
        zone_prefix,
        aisle,
        rack,
        shelf,
        side,
    )


def get_location(item_code: str) -> BinLocation:
    """
    Converts a full bin address into a BinLocation.

    Example:

    A3-04-06-C
    ->
    zone = AMBIENT
    x/y/z = demo warehouse coordinates
    """

    address = item_code.strip().upper()

    (
        zone_prefix,
        aisle,
        rack,
        shelf,
        side,
    ) = _parse_address(address)

    config = ZONE_CONFIG[zone_prefix]

    # --------------------------------------
    # DEMO COORDINATE CALCULATION
    # --------------------------------------

    x = (
        config["base_x"]
        + aisle * 2
        + rack * 0.5
    )

    y = (
        config["base_y"]
        + rack * 2
        + shelf * 0.5
    )

    # Shelf height
    z = shelf * 0.5

    # Side C slightly shifts the position
    if side == "B":
        x += 0.3

    elif side == "C":
        x += 0.6

    return BinLocation(
        location_id=address,
        zone=config["zone"],
        x=round(x, 2),
        y=round(y, 2),
        z=round(z, 2),
    )


# ==========================================
# TEST
# ==========================================

if __name__ == "__main__":

    test_addresses = [
        "A3-04-06-C",
        "CR-01-01-A",
        "FR-02-01-B",
        "FO-03-01-C",
    ]

    print("\n========== BIN LOCATION TEST ==========")

    for address in test_addresses:

        location = get_location(address)

        print(
            f"{location.location_id}"
            f" | Zone: {location.zone}"
            f" | X: {location.x}"
            f" | Y: {location.y}"
            f" | Z: {location.z}"
        )