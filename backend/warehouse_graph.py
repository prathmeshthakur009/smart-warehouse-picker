import math
import networkx as nx
import numpy as np
from pydantic import BaseModel
from typing import List, Tuple


# ==========================================
# 1. DATA MODEL
# ==========================================

class BinLocation(BaseModel):
    location_id: str
    zone: str
    x: float
    y: float
    z: float


# ==========================================
# 2. WAREHOUSE GRAPH ENGINE
# ==========================================

class WarehouseGraphEngine:
    def __init__(self, grid_width_m: int = 50, grid_length_m: int = 50):
        self.grid_width = grid_width_m
        self.grid_length = grid_length_m

        # Warehouse floor represented as a grid
        self.graph = nx.grid_2d_graph(
            grid_width_m,
            grid_length_m
        )

        # Walking from one grid point to the next = 1 meter
        for u, v in self.graph.edges():
            self.graph[u][v]["weight"] = 1.0

    # ==========================================
    # A* HEURISTIC
    # ==========================================

    def manhattan_heuristic(
        self,
        node1: Tuple[int, int],
        node2: Tuple[int, int]
    ) -> float:
        return (
            abs(node1[0] - node2[0])
            + abs(node1[1] - node2[1])
        )

    # ==========================================
    # WALKING DISTANCE
    # ==========================================

    def calculate_walking_distance(
        self,
        loc1: BinLocation,
        loc2: BinLocation
    ) -> float:

        start_node = (
            int(loc1.x),
            int(loc1.y)
        )

        end_node = (
            int(loc2.x),
            int(loc2.y)
        )

        try:
            distance = nx.astar_path_length(
                self.graph,
                source=start_node,
                target=end_node,
                heuristic=self.manhattan_heuristic,
                weight="weight"
            )

            # Height difference penalty
            z_penalty = abs(loc1.z - loc2.z) * 0.5

            return float(distance + z_penalty)

        except nx.NetworkXNoPath:

            # Fallback: straight-line distance
            return math.sqrt(
                (loc1.x - loc2.x) ** 2
                + (loc1.y - loc2.y) ** 2
            )

    # ==========================================
    # DISTANCE MATRIX
    # ==========================================

    def generate_distance_matrix(
        self,
        locations: List[BinLocation]
    ) -> np.ndarray:

        n = len(locations)

        matrix = np.zeros((n, n))

        for i in range(n):
            for j in range(n):

                if i != j:
                    matrix[i][j] = (
                        self.calculate_walking_distance(
                            locations[i],
                            locations[j]
                        )
                    )

        return matrix


# ==========================================
# 3. TEST / DEMO
# ==========================================

if __name__ == "__main__":

    print("===================================")
    print(" SmartPick Warehouse Engine")
    print("===================================\n")

    # Create warehouse engine
    engine = WarehouseGraphEngine(
        grid_width_m=50,
        grid_length_m=50
    )

    # Start position
    start = BinLocation(
        location_id="START",
        zone="START",
        x=0,
        y=0,
        z=0
    )

    # Example warehouse bins
    item_a2 = BinLocation(
        location_id="A2",
        zone="AMBIENT",
        x=10,
        y=15,
        z=1
    )

    item_a5 = BinLocation(
        location_id="A5",
        zone="AMBIENT",
        x=11,
        y=17,
        z=0
    )

    item_a10 = BinLocation(
        location_id="A10",
        zone="AMBIENT",
        x=15,
        y=20,
        z=1
    )

    item_cr = BinLocation(
        location_id="CR",
        zone="COLD_ROOM",
        x=25,
        y=30,
        z=0
    )

    item_fo = BinLocation(
        location_id="FO",
        zone="FROZEN",
        x=35,
        y=35,
        z=0
    )

    item_fr = BinLocation(
        location_id="FR",
        zone="FRESH",
        x=45,
        y=45,
        z=0
    )

    # All items in this demo order
    items = [
        start,
        item_a2,
        item_a5,
        item_a10,
        item_cr,
        item_fo,
        item_fr
    ]

    # ==========================================
    # CALCULATE DISTANCES
    # ==========================================

    print("Calculating walking distances...\n")

    distance_matrix = engine.generate_distance_matrix(items)

    print("Distance Matrix (meters):")
    print(np.round(distance_matrix, 1))

    print("\n===================================")
    print(" Distance Breakdown")
    print("===================================")

    print(
        f"START -> A2: "
        f"{distance_matrix[0][1]:.1f} meters"
    )

    print(
        f"A2 -> A5: "
        f"{distance_matrix[1][2]:.1f} meters"
    )

    print(
        f"A5 -> A10: "
        f"{distance_matrix[2][3]:.1f} meters"
    )

    print(
        f"A10 -> CR: "
        f"{distance_matrix[3][4]:.1f} meters"
    )

    print(
        f"CR -> FO: "
        f"{distance_matrix[4][5]:.1f} meters"
    )

    print(
        f"FO -> FR: "
        f"{distance_matrix[5][6]:.1f} meters"
    )

    print("\n===================================")
    print(" Warehouse Graph Engine is WORKING!")
    print("===================================")