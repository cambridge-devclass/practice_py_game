import tkinter as tk
import math

WIDTH, HEIGHT = 900, 650
BG_COLOR = "#b2c88e"
TRADER_COLOR = "#928762"
TRADER_COLOR_OUTLINE = "#B8AC82"

root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg=BG_COLOR)
canvas.pack()

images = {
    "player": tk.PhotoImage(file="assets/player_01_128_3.png"),
    "apple": tk.PhotoImage(file="assets/apple_01_32.png"),
    "dagger": tk.PhotoImage(file="assets/dagger_01_50.png"),
}

player_id = None
info_id = None
item_images = []

def init(player, traders):
    global player_id, info_id
    player_id = canvas.create_image(player["x"], player["y"], image=images["player"])
    info_id = canvas.create_text(10, 10, anchor="nw", font=("Arial", 12), fill="black")
    update_ui(player)
    draw_traders(player, traders)
    draw_trader_items(traders)
    root.title("Trading Hub RPG")

def draw_traders(player, traders):
    canvas.delete("traders")
    near_trader = False
    for t in traders:
        dist = math.hypot(player["x"] - t["x"], player["y"] - t["y"])
        bg_id = canvas.create_rectangle(t["x"]-70, t["y"]-50, t["x"]+70, t["y"]+50, fill=TRADER_COLOR, tags="traders")
        canvas.tag_lower(bg_id)
        if dist < 130:
            near_trader = True
            outline_id = canvas.create_rectangle(t["x"]-80, t["y"]-60, t["x"]+80, t["y"]+60, fill=TRADER_COLOR_OUTLINE, tags="traders")
            canvas.tag_lower(outline_id)
    root.title("Hello traveller" if near_trader else "")

def update_ui(player):
    canvas.itemconfig(info_id, text=f"WASD: Move, E: Trade \nPlayer Gold: {player['gold']} | Apples: {player['apple']} | Daggers: {player['dagger']}")

def draw_trader_items(traders):
    global item_images
    canvas.delete("items")
    item_images = []
    for t in traders:
        img = images[t["type"]]
        for i in range(t["stock"]):
            col = i % 5
            row = i // 5
            x = t["x"] - 40 + col * 20
            y = t["y"] + row * 20
            item_images.append(canvas.create_image(x, y, image=img, tags="items"))

def move(player, traders, dx, dy):
    player["x"] += dx
    player["y"] += dy
    draw_traders(player, traders)
    canvas.move(player_id, dx, dy)
