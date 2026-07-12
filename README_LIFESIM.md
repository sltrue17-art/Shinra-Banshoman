# Terminal Life Sim

A BitLife-inspired, text-based life simulator that runs entirely in the
terminal. Live from age 0 to death: study, work, fall in love, commit
crimes (and do the time), and try to keep your stats up along the way.

## Run it

```bash
python3 main.py
```

No dependencies beyond the Python 3 standard library.

## How to play

You're born as a random baby with random parents, a random birthplace,
and random starting stats. Then it's up to you:

| Command   | What it does |
|-----------|--------------|
| `age`     | Live through one year — random weighted life events fire and stats change |
| `actions` | Open the Actions menu: Education, Jobs, Relationships, Crime, Medical Care |
| `stats`   | Show your full character sheet |
| `save`    | Save your life to `savegame.json` |
| `load`    | Load the saved life |
| `help`    | Show the command list |
| `quit`    | Save and exit |

The game autosaves every year, and offers to resume your saved life on
startup. Options in the action menus are dynamically locked or unlocked
based on your age, smarts, looks, money, and education — locked options
tell you exactly what you're missing.

## Project layout

```
main.py                  Entry point and game loop
bitlife/
  player.py              Player class: stats, family, career, serialization
  events.py              Weighted random yearly life events
  actions.py             Education / Jobs / Relationships / Crime / Medical menus
  save_manager.py        JSON save/load with error handling
  data.py                Names, locations, jobs, education tracks, crimes
  utils.py               Input helpers, stat bars, currency formatting
```
