import tkinter as tk
import math

WIDTH, HEIGHT = 800, 600
BG_COLOR = "#b2c88e"
TRADER_COLOR = "#A8A7A2"
PLAYER_COLOR = "orange"
APPLE_COLOR = "#D5402D"

root = tk.Tk()
root.title("Trading Hub RPG")

canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg=BG_COLOR)
canvas.pack()

# ---- Player ----
player_gold = 10
player_x = 400
player_y = 350
player_apples = 0

player_id = canvas.create_rectangle(player_x-20, player_y-20, player_x+20, player_y+20, fill=PLAYER_COLOR)

# ---- Trader ----
trader_stock = 5
trader_x = 250
trader_y = 200

canvas.create_rectangle(trader_x-60, trader_y-40, trader_x+65, trader_y+40, fill=TRADER_COLOR)

# ---- UI text ----
info = canvas.create_text(10, 10, anchor="nw", font=("Arial", 12), fill="black")

def update_ui():
    canvas.itemconfig(info, text=(f"WASD: Move, E: Trade \nPlayer Gold: {player_gold} | Apples: {player_apples}"))

# ---- Draw trader stock ----
def draw_trader_items():
    canvas.delete("items")

    for i in range(trader_stock):
        col = i % 5
        row = i // 5
        x, y = trader_x, trader_y # rename variables for shortness
        canvas.create_oval(x - 40 + col * 18, y - 5 + row * 10, x - 25 + col * 18, y + 10 + row * 10, fill=APPLE_COLOR, tags="items")

# ---- Movement ----
def move(dx, dy):
    global player_x, player_y
    player_x += dx
    player_y += dy
    canvas.move(player_id, dx, dy)

def keypress(event):
    if event.keysym == "w": move(0, -10)
    elif event.keysym == "s": move(0, 10)
    elif event.keysym == "a": move(-10, 0)
    elif event.keysym == "d": move(10, 0)
    elif event.keysym == "e":
      dist = math.hypot(player_x - trader_x, player_y - trader_y)
      if dist < 100:
          buy()
          return
      root.title("No trader nearby")

# ---- Interaction ----
def buy():
    global trader_stock, player_gold, player_apples
    root.title("Trading is not implemented yet!")
    price = 1
    # Complete the trade logic below. 
    # Keep the lines "update_ui" and "draw_trader_items" at the end of the function 
    # - they help to update the screen when inventory is changed.

    update_ui()
    draw_trader_items()

# ---- Init ----
update_ui()
draw_trader_items()
root.bind("<Key>", keypress)

root.mainloop()
