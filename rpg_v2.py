import math
from rpg_v2_helpers import root, move, update_ui, draw_trader_items, init

# ---- Player ----
player = {
    "x": 450,
    "y": 400,
    "size": 20,
    "gold": 10,
    "apple": 0,
    "dagger": 0
}

# ---- Traders ----
traders = [
    {"type": "apple", "x": 300, "y": 250, "stock": 6},
    {"type": "dagger", "x": 600, "y": 250, "stock": 4}
]

# ---- Interaction ----
def buy(trader):
    price = 1
    root.title("Trading is not implemented yet!")

    # Complete the trade logic below.
    # Keep the lines "update_ui" and "draw_trader_items" at the end of the function
    # - they help to update the screen when inventory is changed.

    update_ui(player)
    draw_trader_items(traders)


# ---- Controls ----
def keypress(event):
    if event.keysym == "w": move(player, traders, 0, -10)
    elif event.keysym == "s": move(player, traders, 0, 10)
    elif event.keysym == "a": move(player, traders, -10, 0)
    elif event.keysym == "d": move(player, traders, 10, 0)
    elif event.keysym == "e":
        for t in traders:
            dist = math.hypot(player["x"] - t["x"], player["y"] - t["y"])
            if dist < 130:
                buy(t)
                return
        root.title("No trader nearby")

# ---- Init ----
init(player, traders)
root.bind("<Key>", keypress)
root.mainloop()
