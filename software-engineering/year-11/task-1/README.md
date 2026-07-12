# Math Quest

**Software Engineering — Year 11, Assessment Task 1 (2025)**

A command-line arithmetic quiz game built in Python. The player answers a run of
increasingly involved maths questions to defeat the "Math Inquisitor," with a
lives/streak system, a bonus power-up, and persistent score tracking between runs.

## How it works

- **Lives & streak** — the player starts with 5 lives. A wrong answer costs a life
  and resets the answer streak; the run ends when lives hit 0.
- **Round structure** — 7 standard questions (arithmetic, order of operations,
  powers) followed by a 3-question boss fight with harder expressions.
- **Streak rewards** — a streak of 2 grants an extra life; a streak of 5 unlocks a
  one-time "calculator" that auto-answers a boss question.
- **Input validation** — every answer prompt is wrapped in a `try/except` so
  non-numeric input doesn't crash the game.
- **Persistence** — each completed run appends the player's username, final
  streak, remaining lives, and finish time to `statistics.txt`, and previous
  scores are shown on startup.
- **Timing** — `time.time()` brackets the run to report a completion time once
  the boss fight is cleared.

## Files

- [`William Lam_Assessment Task 1.py`](William%20Lam_Assessment%20Task%201.py) — full source
- [`William Lam Software Engineering Task 1 2025.pdf`](William%20Lam%20Software%20Engineering%20Task%201%202025.pdf) — assessment documentation

## Run it

```
python "William Lam_Assessment Task 1.py"
```

Requires Python 3. Creates/appends to `statistics.txt` in the working directory.
