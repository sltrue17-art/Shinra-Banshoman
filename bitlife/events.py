"""Random life events fired each year, chosen by a weighted random system.

Each event has a base weight, an eligibility check against the player,
and an apply() that mutates stats and returns a message.
"""

import random

from bitlife.utils import money


class Event:
    def __init__(self, weight, eligible, apply):
        self.weight = weight
        self.eligible = eligible   # player -> bool
        self.apply = apply         # player -> str (message)


def _found_money(player):
    amount = random.randint(5, 200)
    player.earn(amount)
    player.adjust("happiness", 3)
    return f"You found {money(amount)} on the sidewalk. (+3 happiness)"


def _made_friend(player):
    player.adjust("happiness", 6)
    return "You made a great new friend. (+6 happiness)"


def _caught_flu(player):
    player.adjust("health", -8)
    return "You caught a nasty flu. (-8 health)"


def _school_award(player):
    player.adjust("smarts", 5)
    player.adjust("happiness", 4)
    return "You won an academic award at school. (+5 smarts, +4 happiness)"


def _bullied(player):
    player.adjust("happiness", -10)
    return "You were bullied this year. (-10 happiness)"


def _growth_spurt(player):
    player.adjust("looks", 5)
    return "You hit a growth spurt and grew into your features. (+5 looks)"


def _read_books(player):
    player.adjust("smarts", 4)
    return "You spent the year reading everything you could. (+4 smarts)"


def _minor_accident(player):
    cost = random.randint(100, 2_000)
    paid = player.spend(cost)
    player.adjust("health", -12)
    note = f" Medical bills cost {money(cost)}." if paid else \
        " You couldn't afford the medical bills."
    return f"You were hurt in a minor accident. (-12 health){note}"


def _serious_illness(player):
    player.adjust("health", -25)
    player.adjust("happiness", -10)
    return "You developed a serious illness. (-25 health, -10 happiness)"


def _promotion(player):
    raise_amount = int(player.job["salary"] * 0.15)
    player.job = dict(player.job, salary=player.job["salary"] + raise_amount)
    player.adjust("happiness", 8)
    return (f"You were promoted! Salary raised by {money(raise_amount)}. "
            f"(+8 happiness)")


def _laid_off(player):
    title = player.job["title"]
    player.job = None
    player.adjust("happiness", -15)
    return f"You were laid off from your job as a {title}. (-15 happiness)"


def _tax_refund(player):
    amount = random.randint(200, 3_000)
    player.earn(amount)
    return f"You received a surprise tax refund of {money(amount)}."


def _partner_gift(player):
    player.adjust("happiness", 7)
    return (f"{player.partner['name']} surprised you with a "
            f"thoughtful gift. (+7 happiness)")


def _breakup(player):
    name = player.partner["name"]
    player.partner = None
    player.adjust("happiness", -18)
    return f"{name} broke up with you. (-18 happiness)"


def _quiet_year(player):
    return "It was a quiet, uneventful year."


EVENTS = [
    Event(10, lambda p: True, _quiet_year),
    Event(6, lambda p: p.age >= 5, _found_money),
    Event(6, lambda p: True, _made_friend),
    Event(6, lambda p: True, _caught_flu),
    Event(5, lambda p: 6 <= p.age <= 22, _school_award),
    Event(4, lambda p: 6 <= p.age <= 18, _bullied),
    Event(4, lambda p: 11 <= p.age <= 18, _growth_spurt),
    Event(5, lambda p: p.age >= 6, _read_books),
    Event(4, lambda p: p.age >= 10, _minor_accident),
    Event(2, lambda p: p.age >= 30, _serious_illness),
    Event(4, lambda p: p.job is not None, _promotion),
    Event(2, lambda p: p.job is not None, _laid_off),
    Event(3, lambda p: p.job is not None, _tax_refund),
    Event(4, lambda p: p.partner is not None, _partner_gift),
    Event(2, lambda p: p.partner is not None, _breakup),
]


def trigger_random_events(player, count=None):
    """Fire 1-2 weighted random events eligible for this player.

    Returns a list of message strings.
    """
    if player.prison_years_left > 0:
        return []  # life on hold behind bars

    if count is None:
        count = random.choice([1, 1, 2])

    messages = []
    for _ in range(count):
        eligible = [e for e in EVENTS if e.eligible(player)]
        if not eligible:
            break
        chosen = random.choices(
            eligible, weights=[e.weight for e in eligible], k=1)[0]
        messages.append(chosen.apply(player))
        if not player.alive:
            break
    return messages
