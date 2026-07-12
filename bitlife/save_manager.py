"""JSON save/load so a life is never lost between sessions."""

import json
import os

from bitlife.player import Player

SAVE_FILE = os.path.join(os.path.dirname(os.path.dirname(
    os.path.abspath(__file__))), "savegame.json")


def save_game(player, path=SAVE_FILE):
    """Write the player to disk. Returns True on success."""
    try:
        with open(path, "w", encoding="utf-8") as handle:
            json.dump(player.to_dict(), handle, indent=2)
        return True
    except OSError as error:
        print(f"Could not save the game: {error}")
        return False


def load_game(path=SAVE_FILE):
    """Load a player from disk. Returns a Player or None."""
    if not os.path.exists(path):
        return None
    try:
        with open(path, "r", encoding="utf-8") as handle:
            payload = json.load(handle)
        return Player.from_dict(payload)
    except (OSError, json.JSONDecodeError, TypeError) as error:
        print(f"Could not load the save file: {error}")
        return None


def delete_save(path=SAVE_FILE):
    """Remove the save file (used when a life ends)."""
    try:
        if os.path.exists(path):
            os.remove(path)
    except OSError:
        pass
