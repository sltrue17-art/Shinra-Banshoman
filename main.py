#!/usr/bin/env python3
"""Entry point and game loop for the BitLife-inspired life simulator.

Run with:  python3 main.py
"""

from bitlife import save_manager
from bitlife.actions import actions_menu
from bitlife.events import trigger_random_events
from bitlife.player import Player
from bitlife.utils import money, prompt

BANNER = r"""
==============================================
   T E R M I N A L   L I F E   S I M
   a BitLife-inspired text adventure
==============================================
"""

HELP_TEXT = """
Commands:
  age      - live through one year (events happen, stats change)
  actions  - open the Actions menu (Education, Jobs, Relationships,
             Crime, Medical Care)
  stats    - show your full character sheet
  save     - save your life to savegame.json
  load     - load the saved life from savegame.json
  help     - show this help
  quit     - save and exit
"""


def new_life():
    """Generate a newborn and announce the birth."""
    player = Player.generate()
    print(f"\nA new life begins in {player.location}!")
    print(f"You are {player.name}, a baby {player.gender}.")
    for parent in player.parents:
        print(f"  {parent['relation']}: {parent['name']}, "
              f"a {parent['job']}.")
    print(player.summary())
    return player


def start_player():
    """Offer to resume a saved life, otherwise generate a new one."""
    saved = save_manager.load_game()
    if saved and saved.alive:
        answer = prompt(
            f"Found a saved life: {saved.name}, age {saved.age}. "
            f"Continue it? (y/n) > ").lower()
        if answer.startswith("y"):
            print(saved.summary())
            return saved
    return new_life()


def age_up(player):
    """Advance one year: upkeep, weighted random events, death check."""
    print(f"\n----- Age {player.age + 1} -----")
    for message in player.yearly_update():
        print(f"* {message}")
    if player.alive:
        for message in trigger_random_events(player):
            print(f"* {message}")
    if player.health <= 0 and player.alive:
        player.die("health failure")

    if not player.alive:
        print(f"\nYou died at age {player.age} of {player.cause_of_death}.")
        print(f"You leave behind {money(player.bank_balance)}.")
        save_manager.delete_save()
    else:
        save_manager.save_game(player)  # autosave each year


def main():
    print(BANNER)
    print(HELP_TEXT)
    player = start_player()

    while True:
        if not player.alive:
            answer = prompt("\nStart a new life? (y/n) > ").lower()
            if answer.startswith("y"):
                player = new_life()
                continue
            print("Thanks for playing!")
            break

        command = prompt("\n(age/actions/stats/save/load/help/quit) > ")
        command = command.lower()

        if command == "age":
            age_up(player)
        elif command == "actions":
            actions_menu(player)
        elif command == "stats":
            print(player.summary())
        elif command == "save":
            if save_manager.save_game(player):
                print("Game saved.")
        elif command == "load":
            loaded = save_manager.load_game()
            if loaded:
                player = loaded
                print(f"Loaded {player.name}, age {player.age}.")
                print(player.summary())
            else:
                print("No valid save file found.")
        elif command == "help":
            print(HELP_TEXT)
        elif command in ("quit", "exit", "q"):
            if player.alive:
                save_manager.save_game(player)
                print("Life saved. See you next time!")
            else:
                print("Thanks for playing!")
            break
        elif command == "":
            continue
        else:
            print(f"Unknown command: '{command}'. Type 'help' for options.")


if __name__ == "__main__":
    main()
