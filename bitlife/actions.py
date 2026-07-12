"""Interactive action menus: Education, Jobs, Relationships, Crime, Medical.

Every option dynamically checks the player's stats/prerequisites and shows
why a locked option is unavailable.
"""

import random

from bitlife import data
from bitlife.utils import money, prompt_choice


def actions_menu(player):
    """Top-level Actions menu. One action per call."""
    if player.prison_years_left > 0:
        print("You're in prison. All you can do is age.")
        return

    print("\n--- Actions ---")
    choice = prompt_choice([
        "Education", "Jobs", "Relationships", "Crime", "Medical Care",
    ])
    handlers = [education_menu, jobs_menu, relationships_menu,
                crime_menu, medical_menu]
    if choice is not None:
        handlers[choice](player)


# ----------------------------------------------------------------------
# Education
# ----------------------------------------------------------------------
def education_menu(player):
    print("\n--- Education ---")
    if player.enrolled_in:
        label = data.EDUCATION_TRACKS[player.enrolled_in]["label"]
        print(f"You're already studying: {label}. Age up to finish.")
        return

    options, keys = [], []
    for key, track in data.EDUCATION_TRACKS.items():
        status = _education_lock_reason(player, key, track)
        cost = money(track["cost"]) if track["cost"] else "free"
        suffix = f" [LOCKED: {status}]" if status else ""
        options.append(f"{track['label']} ({cost}){suffix}")
        keys.append(key)

    choice = prompt_choice(options)
    if choice is None:
        return

    key, track = keys[choice], data.EDUCATION_TRACKS[keys[choice]]
    reason = _education_lock_reason(player, key, track)
    if reason:
        print(f"You can't enroll: {reason}")
        return
    if not player.spend(track["cost"]):
        print(f"You can't afford tuition of {money(track['cost'])}.")
        return
    player.enrolled_in = key
    print(f"Enrolled in {track['label']}! You'll graduate next year.")


def _education_lock_reason(player, key, track):
    if key in player.education:
        return "already completed"
    if player.age < track["min_age"]:
        return f"must be at least {track['min_age']}"
    if player.smarts < track["min_smarts"]:
        return f"needs {track['min_smarts']} smarts (you have {player.smarts})"
    if not player.has_education(track["requires"]):
        return f"requires {data.EDUCATION_TRACKS[track['requires']]['label']}"
    return None


# ----------------------------------------------------------------------
# Jobs
# ----------------------------------------------------------------------
def jobs_menu(player):
    print("\n--- Jobs ---")
    if player.job:
        print(f"Current job: {player.job['title']} "
              f"({money(player.job['salary'])}/yr)")
        choice = prompt_choice(["Look for a new job", "Quit your job"])
        if choice is None:
            return
        if choice == 1:
            print(f"You quit your job as a {player.job['title']}.")
            player.job = None
            player.adjust("happiness", -3)
            return

    options = []
    for job in data.JOBS:
        reason = _job_lock_reason(player, job)
        suffix = f" [LOCKED: {reason}]" if reason else ""
        options.append(
            f"{job['title']} — {money(job['salary'])}/yr{suffix}")

    print("Apply for:")
    choice = prompt_choice(options)
    if choice is None:
        return

    job = data.JOBS[choice]
    reason = _job_lock_reason(player, job)
    if reason:
        print(f"Your application was rejected: {reason}.")
        return
    player.job = dict(job)
    player.adjust("happiness", 5)
    print(f"You got the job! You are now a {job['title']} "
          f"earning {money(job['salary'])}/yr.")


def _job_lock_reason(player, job):
    if player.age < job["min_age"]:
        return f"must be at least {job['min_age']}"
    if player.smarts < job["min_smarts"]:
        return f"needs {job['min_smarts']} smarts (you have {player.smarts})"
    if player.looks < job["min_looks"]:
        return f"needs {job['min_looks']} looks (you have {player.looks})"
    if not player.has_education(job["education"]):
        return f"requires {data.EDUCATION_TRACKS[job['education']]['label']}"
    return None


# ----------------------------------------------------------------------
# Relationships
# ----------------------------------------------------------------------
def relationships_menu(player):
    print("\n--- Relationships ---")
    options = ["Spend time with family"]
    if player.partner:
        options += [f"Go on a date with {player.partner['name']}",
                    f"Break up with {player.partner['name']}"]
    else:
        options.append("Look for a partner")

    choice = prompt_choice(options)
    if choice is None:
        return

    if choice == 0:
        player.adjust("happiness", 5)
        parent = random.choice(player.parents)
        print(f"You spent quality time with {parent['name']}. "
              f"(+5 happiness)")
    elif player.partner and choice == 1:
        cost = 100
        if player.spend(cost):
            player.adjust("happiness", 8)
            print(f"A lovely date with {player.partner['name']}! "
                  f"(-{money(cost)}, +8 happiness)")
        else:
            player.adjust("happiness", 2)
            print("You couldn't afford a fancy date, so you took a "
                  "walk in the park together. (+2 happiness)")
    elif player.partner and choice == 2:
        print(f"You broke up with {player.partner['name']}. "
              f"(-10 happiness)")
        player.partner = None
        player.adjust("happiness", -10)
    else:
        _look_for_partner(player)


def _look_for_partner(player):
    if player.age < 16:
        print("You're too young to date. (must be at least 16)")
        return
    # Charm is a blend of looks and happiness.
    charm = (player.looks + player.happiness) / 200
    if random.random() < 0.3 + charm * 0.5:
        pool = (data.FIRST_NAMES_FEMALE if player.gender == "male"
                else data.FIRST_NAMES_MALE)
        name = f"{random.choice(pool)} {random.choice(data.LAST_NAMES)}"
        player.partner = {"name": name, "years": 0}
        player.adjust("happiness", 12)
        print(f"You hit it off with {name}! You're now a couple. "
              f"(+12 happiness)")
    else:
        player.adjust("happiness", -4)
        print("You put yourself out there but didn't meet anyone "
              "special. (-4 happiness)")


# ----------------------------------------------------------------------
# Crime
# ----------------------------------------------------------------------
def crime_menu(player):
    print("\n--- Crime ---")
    if player.age < 12:
        print("You're too young for a life of crime.")
        return

    options = [
        f"{crime['name']} — potential {money(crime['payout'][0])}-"
        f"{money(crime['payout'][1])}, "
        f"{int(crime['catch_chance'] * 100)}% catch risk"
        for crime in data.CRIMES
    ]
    choice = prompt_choice(options)
    if choice is None:
        return

    crime = data.CRIMES[choice]
    # Smarts reduce the odds of getting caught; a record raises them.
    catch_chance = crime["catch_chance"] - (player.smarts - 50) * 0.002 \
        + player.criminal_record * 0.05

    if random.random() < catch_chance:
        player.criminal_record += 1
        player.prison_years_left = crime["prison_years"]
        player.job = None
        player.adjust("happiness", -20)
        print(f"You were caught! Sentenced to {crime['prison_years']} "
              f"year(s) in prison. You lost your job. (-20 happiness)")
    else:
        payout = random.randint(*crime["payout"])
        player.earn(payout)
        player.adjust("happiness", 5)
        print(f"You got away with it and pocketed {money(payout)}. "
              f"(+5 happiness)")


# ----------------------------------------------------------------------
# Medical Care
# ----------------------------------------------------------------------
def medical_menu(player):
    print("\n--- Medical Care ---")
    treatments = [
        {"label": "Doctor visit", "cost": 200, "health": 10, "looks": 0},
        {"label": "Full hospital treatment", "cost": 5_000, "health": 35,
         "looks": 0},
        {"label": "Therapy (boosts happiness)", "cost": 1_000, "health": 0,
         "looks": 0, "happiness": 15},
        {"label": "Plastic surgery", "cost": 10_000, "health": -5,
         "looks": 20},
    ]
    options = [f"{t['label']} ({money(t['cost'])})" for t in treatments]
    choice = prompt_choice(options)
    if choice is None:
        return

    treatment = treatments[choice]
    if not player.spend(treatment["cost"]):
        print(f"You can't afford that (needs {money(treatment['cost'])}, "
              f"you have {money(player.bank_balance)}).")
        return

    effects = []
    if treatment["health"]:
        player.adjust("health", treatment["health"])
        effects.append(f"{treatment['health']:+d} health")
    if treatment["looks"]:
        player.adjust("looks", treatment["looks"])
        effects.append(f"{treatment['looks']:+d} looks")
    if treatment.get("happiness"):
        player.adjust("happiness", treatment["happiness"])
        effects.append(f"{treatment['happiness']:+d} happiness")
    print(f"{treatment['label']} complete. ({', '.join(effects)})")
