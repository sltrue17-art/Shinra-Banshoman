"""The Player class: stats, family, career, and serialization."""

import random

from bitlife import data
from bitlife.utils import clamp, money, stat_bar

MAX_AGE = 105


class Player:
    """A single life being simulated."""

    def __init__(self):
        self.name = ""
        self.gender = ""
        self.age = 0
        self.location = ""
        self.happiness = 50
        self.health = 50
        self.smarts = 50
        self.looks = 50
        self.bank_balance = 0
        self.parents = []          # list of {"name", "job", "relation"}
        self.education = []        # completed track keys, e.g. ["high_school"]
        self.enrolled_in = None    # track key currently studying, or None
        self.job = None            # dict from data.JOBS, or None
        self.partner = None        # {"name", "years"} or None
        self.criminal_record = 0   # number of convictions
        self.prison_years_left = 0
        self.alive = True
        self.cause_of_death = None

    # ------------------------------------------------------------------
    # Creation
    # ------------------------------------------------------------------
    @classmethod
    def generate(cls):
        """Randomly generate a newborn: parents, birthplace, starting stats."""
        player = cls()
        player.gender = random.choice(["male", "female"])
        first_pool = (data.FIRST_NAMES_MALE if player.gender == "male"
                      else data.FIRST_NAMES_FEMALE)
        last_name = random.choice(data.LAST_NAMES)
        player.name = f"{random.choice(first_pool)} {last_name}"
        player.location = random.choice(data.LOCATIONS)

        player.parents = [
            {"relation": "Mother",
             "name": f"{random.choice(data.FIRST_NAMES_FEMALE)} {last_name}",
             "job": random.choice(data.PARENT_JOBS)},
            {"relation": "Father",
             "name": f"{random.choice(data.FIRST_NAMES_MALE)} {last_name}",
             "job": random.choice(data.PARENT_JOBS)},
        ]

        player.happiness = random.randint(40, 90)
        player.health = random.randint(50, 100)
        player.smarts = random.randint(20, 90)
        player.looks = random.randint(20, 90)
        player.bank_balance = 0
        return player

    # ------------------------------------------------------------------
    # Stats
    # ------------------------------------------------------------------
    def adjust(self, stat, delta):
        """Change a 0-100 stat by delta, clamped."""
        setattr(self, stat, clamp(getattr(self, stat) + delta))

    def earn(self, amount):
        self.bank_balance += amount

    def spend(self, amount):
        """Try to spend money; return False if the player can't afford it."""
        if amount > self.bank_balance:
            return False
        self.bank_balance -= amount
        return True

    def has_education(self, track_key):
        return track_key is None or track_key in self.education

    def die(self, cause):
        self.alive = False
        self.cause_of_death = cause
        self.job = None
        self.enrolled_in = None

    # ------------------------------------------------------------------
    # Yearly upkeep (called by the game loop on 'age')
    # ------------------------------------------------------------------
    def yearly_update(self):
        """Salary, study progress, prison time, and natural aging."""
        messages = []
        self.age += 1

        if self.prison_years_left > 0:
            self.prison_years_left -= 1
            self.adjust("happiness", -8)
            if self.prison_years_left == 0:
                messages.append("You were released from prison.")
            else:
                messages.append(
                    f"You spent the year in prison "
                    f"({self.prison_years_left} year(s) left).")
            return messages

        if self.job:
            self.earn(self.job["salary"])
            messages.append(
                f"You earned {money(self.job['salary'])} as a "
                f"{self.job['title']}.")

        if self.enrolled_in:
            track = data.EDUCATION_TRACKS[self.enrolled_in]
            self.education.append(self.enrolled_in)
            self.adjust("smarts", track["smarts_gain"])
            messages.append(f"You completed {track['label']}! "
                            f"(+{track['smarts_gain']} smarts)")
            self.enrolled_in = None

        if self.partner:
            self.partner["years"] += 1
            self.adjust("happiness", 2)

        # Natural decline in later life.
        if self.age > 45:
            self.adjust("health", -random.randint(1, 3))
        if self.age > 60:
            self.adjust("looks", -random.randint(1, 3))

        # Mortality: health failure or old age.
        if self.health <= 0:
            self.die("health failure")
        elif self.age >= MAX_AGE:
            self.die("extreme old age")
        elif self.age > 70:
            death_chance = (self.age - 70) * 0.015 + (50 - self.health) * 0.002
            if random.random() < max(0.0, death_chance):
                self.die("old age")

        return messages

    # ------------------------------------------------------------------
    # Display
    # ------------------------------------------------------------------
    def summary(self):
        lines = [
            f"\n=== {self.name} ({self.gender}), age {self.age} ===",
            f"Location:  {self.location}",
            f"Happiness: {stat_bar(self.happiness)}",
            f"Health:    {stat_bar(self.health)}",
            f"Smarts:    {stat_bar(self.smarts)}",
            f"Looks:     {stat_bar(self.looks)}",
            f"Bank:      {money(self.bank_balance)}",
        ]
        for parent in self.parents:
            lines.append(f"{parent['relation']}: {parent['name']} "
                         f"({parent['job']})")
        if self.job:
            lines.append(f"Job:       {self.job['title']} "
                         f"({money(self.job['salary'])}/yr)")
        if self.enrolled_in:
            lines.append(
                f"Studying:  "
                f"{data.EDUCATION_TRACKS[self.enrolled_in]['label']}")
        if self.education:
            labels = [data.EDUCATION_TRACKS[key]["label"]
                      for key in self.education]
            lines.append(f"Education: {', '.join(labels)}")
        if self.partner:
            lines.append(f"Partner:   {self.partner['name']} "
                         f"({self.partner['years']} year(s) together)")
        if self.criminal_record:
            lines.append(f"Criminal record: {self.criminal_record} "
                         f"conviction(s)")
        if self.prison_years_left:
            lines.append(f"IN PRISON: {self.prison_years_left} year(s) left")
        return "\n".join(lines)

    # ------------------------------------------------------------------
    # Serialization
    # ------------------------------------------------------------------
    def to_dict(self):
        return {
            "name": self.name,
            "gender": self.gender,
            "age": self.age,
            "location": self.location,
            "happiness": self.happiness,
            "health": self.health,
            "smarts": self.smarts,
            "looks": self.looks,
            "bank_balance": self.bank_balance,
            "parents": self.parents,
            "education": self.education,
            "enrolled_in": self.enrolled_in,
            "job": self.job,
            "partner": self.partner,
            "criminal_record": self.criminal_record,
            "prison_years_left": self.prison_years_left,
            "alive": self.alive,
            "cause_of_death": self.cause_of_death,
        }

    @classmethod
    def from_dict(cls, payload):
        player = cls()
        for key, value in payload.items():
            if hasattr(player, key):
                setattr(player, key, value)
        return player
