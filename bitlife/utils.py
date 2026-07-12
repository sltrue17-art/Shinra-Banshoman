"""Input helpers and small utilities shared across modules."""


def clamp(value, low=0, high=100):
    """Clamp a numeric value into [low, high]."""
    return max(low, min(high, value))


def prompt(text=""):
    """Read a line from the user; treat EOF/Ctrl+C as a 'quit' signal."""
    try:
        return input(text).strip()
    except (EOFError, KeyboardInterrupt):
        print()
        return "quit"


def prompt_choice(options, allow_back=True):
    """Show a numbered menu and return the chosen index, or None for back.

    `options` is a list of display strings. Re-prompts on invalid input.
    """
    for i, option in enumerate(options, start=1):
        print(f"  {i}. {option}")
    if allow_back:
        print("  0. Back")

    while True:
        raw = prompt("> ")
        if raw == "quit":
            return None
        if allow_back and raw == "0":
            return None
        try:
            index = int(raw)
        except ValueError:
            print("Please enter a number from the menu.")
            continue
        if 1 <= index <= len(options):
            return index - 1
        print("Please enter a number from the menu.")


def money(amount):
    """Format an amount as currency."""
    return f"${amount:,.0f}"


def stat_bar(value, width=20):
    """Render a stat as a text progress bar, e.g. [########----------] 40%."""
    filled = int(round(clamp(value) / 100 * width))
    return f"[{'#' * filled}{'-' * (width - filled)}] {value}%"
