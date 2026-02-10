import tkinter as tk
import math

WIDTH, HEIGHT = 800, 600
BG_COLOR = "#9CAF88"  # sage green
BG_COLOR = "#cae0a6"
BG_COLOR = "#b2c88e"
TRADER_COLOR = "#928762"
TRADER_COLOR_OUTLINE = "#B8AC82"

root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg=BG_COLOR)
canvas.pack()

images = {
    "player": tk.PhotoImage(file="assets/player_01_128.png"),
    "apple": tk.PhotoImage(file="assets/apple_01_32.png"),
    "dagger":  tk.PhotoImage(file="assets/dagger_01_50.png"),
}

# ---- Player ----
player = {
    "x": 400,
    "y": 350,
    "size": 20,
    "gold": 10,
    "apple": 0,
    "dagger": 0
}

player_id = canvas.create_image(player["x"], player["y"], image=images["player"])

# ---- Trader ----
traders = [
    {"type": "apple", "x": 250, "y": 200, "stock": 6},
    {"type": "dagger", "x": 550, "y": 200, "stock": 4}
]

trader_ids = []
def draw_traders():
  canvas.delete("traders")
  for t in traders:
      dist = math.hypot(player["x"] - t["x"], player["y"] - t["y"])
      
      trader_id = canvas.create_rectangle(t["x"]-70, t["y"]-50, t["x"]+70, t["y"]+50, fill=TRADER_COLOR, tags="traders")
      trader_ids.append(trader_id)
      canvas.tag_lower(trader_id) 
      if (dist < 130):
          root.title("Hello traveller")
          trader_id = canvas.create_rectangle(t["x"]-80, t["y"]-60, t["x"]+80, t["y"]+60, fill=TRADER_COLOR_OUTLINE, tags="traders")
          trader_ids.append(trader_id)  
          canvas.tag_lower(trader_id)
          return
      root.title("") 

# ---- UI text ----
info = canvas.create_text(10, 10, anchor="nw", font=("Arial", 12), fill="black")

def update_ui():
    message = f"WASD: Move, E: Trade \nPlayer Gold: {player["gold"]} | Apples: {player["apple"]} | Daggers: {player["dagger"]}"
    canvas.itemconfig(info, text=(message))

# ---- Draw trader stock ----
item_images = []
def draw_trader_items():
    canvas.delete("items")
    for t in traders:
        img = images[t["type"]]

        for i in range(t["stock"]):
            col = i % 5
            row = i // 5
            x = t["x"] - 40 + col * 20
            y = t["y"] + 0 + row * 20
            item_images.append(canvas.create_image(x, y, image=img, tags="items"))

# ---- Movement ----
def move(dx, dy):
    player["x"] += dx
    player["y"] += dy
    draw_traders()
    canvas.move(player_id, dx, dy)            

def keypress(event):
    if event.keysym == "w": move(0, -10)
    elif event.keysym == "s": move(0, 10)
    elif event.keysym == "a": move(-10, 0)
    elif event.keysym == "d": move(10, 0)
    elif event.keysym == "e":
        for t in traders:
            dist = math.hypot(player["x"] - t["x"], player["y"] - t["y"])
            if dist < 130:
                buy(t)
                return
            
        root.title("No trader nearby")

# ---- Interaction ----
def buy(trader):
    price = 1
    root.title("Trading is not implemented yet!")

    # Complete the trade logic below. 
    # Keep the lines "update_ui" and "draw_trader_items" at the end of the function 
    # - they help to update the screen when inventory is changed.

    update_ui()
    draw_trader_items()

# ---- Init ----
update_ui()
draw_traders()
draw_trader_items()
root.title("Trading Hub RPG")
root.bind("<Key>", keypress)

root.mainloop()
