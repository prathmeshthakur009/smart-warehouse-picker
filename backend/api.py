from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from picking_engine import PickingEngine
from products import get_product


# ==========================================
# APP
# ==========================================

app = FastAPI(
    title="Warehouse Picker API",
    version="1.1.0",
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# PICKING ENGINE
# ==========================================

engine = PickingEngine()


# ==========================================
# REQUEST MODELS
# ==========================================

class OrderItem(BaseModel):
    product_name: str
    quantity: int = Field(
        default=1,
        ge=1,
    )


class PickOrderRequest(BaseModel):
    items: List[OrderItem]
    reverse: bool = False


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():
    return {
        "message": "Warehouse Picker API is working!"
    }


# ==========================================
# HEALTH
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "warehouse-picker-api",
    }


# ==========================================
# PICK ORDER
# ==========================================

@app.post("/pick-order")
def pick_order(
    request: PickOrderRequest
):

    # --------------------------------------
    # Empty order
    # --------------------------------------

    if not request.items:
        raise HTTPException(
            status_code=400,
            detail="Order cannot be empty.",
        )


    # --------------------------------------
    # Product names for engine
    # --------------------------------------

    product_names = [
        item.product_name
        for item in request.items
    ]


    # --------------------------------------
    # Generate picking sequence
    # --------------------------------------

    try:

        result = (
            engine.generate_product_picking_sequence(
                product_names,
                reverse_a=request.reverse,
            )
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


    # ======================================
    # NORMALIZE ENGINE RESPONSE
    # ======================================

    picker_items = []
    total_distance = 0


    if isinstance(
        result,
        tuple
    ):

        picker_items = (
            result[0]
            if len(result) > 0
            else []
        )

        total_distance = (
            result[1]
            if len(result) > 1
            else 0
        )


    elif isinstance(
        result,
        dict
    ):

        picker_items = (
            result.get(
                "picker_items",
                []
            )
        )

        total_distance = (
            result.get(
                "total_walking_distance_m",
                result.get(
                    "total_distance",
                    0
                )
            )
        )


    else:

        picker_items = result
        total_distance = 0


    # --------------------------------------
    # Validate picker list
    # --------------------------------------

    if picker_items is None:
        picker_items = []


    if not isinstance(
        picker_items,
        list
    ):

        raise HTTPException(
            status_code=500,
            detail=(
                "Picking engine returned "
                "an invalid picker list."
            ),
        )


    # ======================================
    # QUANTITY MAP BY SKU
    # ======================================
    #
    # This is the important fix.
    #
    # Example:
    # Customer selects:
    # Eveready Ultima × 5
    #
    # products.py:
    # SKU = GEN007
    #
    # Picker engine:
    # product name can be different
    #
    # We still match through SKU.
    # ======================================

    quantity_by_sku = {}


    # ======================================
    # QUANTITY MAP BY EXACT NAME
    # ======================================

    quantity_by_name = {}


    for order_item in request.items:

        requested_quantity = int(
            order_item.quantity
        )

        requested_name = (
            order_item.product_name
            .strip()
            .lower()
        )


        # ----------------------------------
        # Save name mapping
        # ----------------------------------

        quantity_by_name[
            requested_name
        ] = requested_quantity


        # ----------------------------------
        # Resolve product -> SKU
        # ----------------------------------

        try:

            product = get_product(
                order_item.product_name
            )

            quantity_by_sku[
                product.sku
            ] = requested_quantity

        except Exception:
            # Keep exact-name fallback.
            pass


    # ======================================
    # APPLY QUANTITY TO PICKER ITEMS
    # ======================================

    for picker_item in picker_items:

        if not isinstance(
            picker_item,
            dict
        ):
            continue


        # ----------------------------------
        # Read SKU
        # ----------------------------------

        picker_sku = str(
            picker_item.get(
                "sku",
                ""
            )
        ).strip()


        # ----------------------------------
        # Read picker product name
        # ----------------------------------

        picker_name = str(
            picker_item.get(
                "product_name",
                ""
            )
        ).strip().lower()


        matched_quantity = None


        # ----------------------------------
        # 1. BEST MATCH = SKU
        # ----------------------------------

        if picker_sku in quantity_by_sku:

            matched_quantity = (
                quantity_by_sku[
                    picker_sku
                ]
            )


        # ----------------------------------
        # 2. EXACT NAME MATCH
        # ----------------------------------

        elif picker_name in quantity_by_name:

            matched_quantity = (
                quantity_by_name[
                    picker_name
                ]
            )


        # ----------------------------------
        # 3. Resolve picker name -> SKU
        # ----------------------------------

        else:

            try:

                resolved_product = get_product(
                    picker_item.get(
                        "product_name",
                        ""
                    )
                )

                resolved_sku = (
                    resolved_product.sku
                )


                if (
                    resolved_sku
                    in quantity_by_sku
                ):

                    matched_quantity = (
                        quantity_by_sku[
                            resolved_sku
                        ]
                    )

            except Exception:
                matched_quantity = None


        # ----------------------------------
        # 4. SAFE FALLBACK
        # ----------------------------------

        if matched_quantity is None:

            existing_quantity = (
                picker_item.get(
                    "quantity",
                    1
                )
            )

            try:

                matched_quantity = max(
                    1,
                    int(
                        existing_quantity
                    )
                )

            except (
                TypeError,
                ValueError
            ):

                matched_quantity = 1


        # ----------------------------------
        # FINAL QUANTITY
        # ----------------------------------

        picker_item["quantity"] = (
            matched_quantity
        )


    # ======================================
    # CLEAN DISTANCE
    # ======================================

    try:

        clean_distance = round(
            float(
                total_distance or 0
            ),
            1
        )

    except (
        TypeError,
        ValueError
    ):

        clean_distance = 0.0


    # ======================================
    # RESPONSE
    # ======================================

    return {
        "mode": (
            "reverse"
            if request.reverse
            else "default"
        ),

        "picker_items": picker_items,

        "total_walking_distance_m":
            clean_distance,
    }


# ==========================================
# TEST PICK
# ==========================================

@app.get("/test-pick")
def test_pick():

    try:

        result = (
            engine.generate_product_picking_sequence(
                [
                    "bread",
                    "rice",
                    "milk",
                ],
                reverse_a=False,
            )
        )

        return {
            "status": "ok",
            "result": result,
        }

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )