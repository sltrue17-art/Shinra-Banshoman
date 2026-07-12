"""Static game data: names, locations, jobs, education tracks."""

FIRST_NAMES_MALE = [
    "James", "Liam", "Noah", "Oliver", "Elijah", "Mateo", "Hiroshi",
    "Ahmed", "Diego", "Ivan", "Kwame", "Ravi", "Marcus", "Felix",
]

FIRST_NAMES_FEMALE = [
    "Olivia", "Emma", "Amara", "Sophia", "Yuki", "Fatima", "Isabella",
    "Nadia", "Priya", "Chloe", "Ingrid", "Zara", "Rosa", "Maeve",
]

LAST_NAMES = [
    "Smith", "Garcia", "Kim", "Okafor", "Tanaka", "Muller", "Rossi",
    "Novak", "Silva", "Patel", "Johansson", "Dubois", "O'Brien", "Costa",
]

LOCATIONS = [
    "New York, USA", "Tokyo, Japan", "Lagos, Nigeria", "London, UK",
    "Sao Paulo, Brazil", "Mumbai, India", "Berlin, Germany",
    "Sydney, Australia", "Toronto, Canada", "Seoul, South Korea",
]

PARENT_JOBS = [
    "Teacher", "Mechanic", "Nurse", "Accountant", "Chef", "Farmer",
    "Software Developer", "Shop Owner", "Police Officer", "Artist",
    "Bus Driver", "Doctor", "Electrician", "Waiter",
]

# Education tracks: (key, label, min_age, min_smarts, cost, years, smarts_gain)
EDUCATION_TRACKS = {
    "high_school": {
        "label": "High School Diploma",
        "min_age": 14,
        "min_smarts": 0,
        "cost": 0,
        "smarts_gain": 10,
        "requires": None,
    },
    "community_college": {
        "label": "Community College",
        "min_age": 18,
        "min_smarts": 30,
        "cost": 5_000,
        "smarts_gain": 12,
        "requires": "high_school",
    },
    "university": {
        "label": "University Degree",
        "min_age": 18,
        "min_smarts": 50,
        "cost": 25_000,
        "smarts_gain": 20,
        "requires": "high_school",
    },
    "graduate_school": {
        "label": "Graduate School",
        "min_age": 22,
        "min_smarts": 70,
        "cost": 40_000,
        "smarts_gain": 25,
        "requires": "university",
    },
}

# Jobs: prerequisites are checked dynamically against the player.
JOBS = [
    {"title": "Fast Food Worker", "salary": 18_000, "min_age": 16,
     "min_smarts": 0, "min_looks": 0, "education": None},
    {"title": "Retail Cashier", "salary": 22_000, "min_age": 16,
     "min_smarts": 10, "min_looks": 0, "education": None},
    {"title": "Delivery Driver", "salary": 30_000, "min_age": 18,
     "min_smarts": 15, "min_looks": 0, "education": None},
    {"title": "Office Clerk", "salary": 38_000, "min_age": 18,
     "min_smarts": 30, "min_looks": 0, "education": "high_school"},
    {"title": "Fitness Model", "salary": 55_000, "min_age": 18,
     "min_smarts": 0, "min_looks": 75, "education": None},
    {"title": "Electrician", "salary": 60_000, "min_age": 20,
     "min_smarts": 45, "min_looks": 0, "education": "high_school"},
    {"title": "Teacher", "salary": 52_000, "min_age": 22,
     "min_smarts": 55, "min_looks": 0, "education": "university"},
    {"title": "Software Developer", "salary": 95_000, "min_age": 21,
     "min_smarts": 70, "min_looks": 0, "education": "university"},
    {"title": "Lawyer", "salary": 120_000, "min_age": 25,
     "min_smarts": 80, "min_looks": 0, "education": "graduate_school"},
    {"title": "Surgeon", "salary": 250_000, "min_age": 28,
     "min_smarts": 90, "min_looks": 0, "education": "graduate_school"},
]

CRIMES = [
    {"name": "Shoplift", "payout": (50, 400), "catch_chance": 0.30,
     "prison_years": 1},
    {"name": "Pickpocket", "payout": (100, 800), "catch_chance": 0.35,
     "prison_years": 1},
    {"name": "Burglary", "payout": (1_000, 8_000), "catch_chance": 0.45,
     "prison_years": 3},
    {"name": "Bank Robbery", "payout": (20_000, 150_000), "catch_chance": 0.65,
     "prison_years": 8},
]
