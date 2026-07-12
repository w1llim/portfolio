# Smart Garage

**Software Engineering — Year 11, Assessment Task 2 (2025)**

A two-microcontroller mechatronics system: a handheld remote and a garage unit
talk over radio to automate opening/closing a garage door, turning on lights
when a car enters, and stopping the car with an ultrasonic proximity beep —
with a manual override for when the automation misbehaves.

## How it works

Two BBC micro:bits, paired over `radio` (group 2):

- **Remote control** — battery-powered (2× AAA). Button A sends `ENTER`,
  button B sends `LEAVE`, each with a confirmation scroll on the LED display.
- **Garage unit** — powered via a Bitmaker expansion board off a 2000mAh power
  bank. Listens for radio messages and drives the rest of the system:
  - **`EnterGarage()`** — opens the door (servo), turns the lights blue
    (neopixels), polls the ultrasonic sensor as the car approaches, beeps a
    warning once it's too close, then closes the door.
  - **`LeaveGarage()`** — opens the door, watches the ultrasonic reading until
    the car has cleared the sensor, beeps, then closes the door and kills the
    lights.
  - **Manual mode** — triggered by touching the logo pin. The rotary sensor
    becomes a knob (`Turning Angle = RotaryValue × (open−close)/1021 + close`)
    for directly driving the servo, with an "M" shown on the LED matrix and
    green lights signalling the mode is active. Exists as a fallback for when
    the ultrasonic sensor misbehaves (it did — see Evaluation).
  - **Button A / B** on the garage unit double as manual toggles for the
    lights and door outside of the enter/leave sequences.

## Components

2× micro:bit · ultrasonic sensor · Bitmaker expansion board · servo · rotary
sensor · neopixels · 2× battery packs

## Evaluation (from the folio)

All 12 functional and non-functional criteria passed. Noted limitations: the
frame was cramped for the number of sensors/actuators fitted, and the
ultrasonic sensor would intermittently buzz and needed a board reset to
clear — a big part of why manual mode exists as a fallback.

## Files

- [`William Lam Remote Control Code.hex`](William%20Lam%20Remote%20Control%20Code.hex) — compiled firmware for the remote
- [`William Lam Garage Controller Code.hex`](William%20Lam%20Garage%20Controller%20Code.hex) — compiled firmware for the garage unit
- [`William Lam Software Engineering Task 2 Folio.pdf`](William%20Lam%20Software%20Engineering%20Task%202%20Folio.pdf) — full folio: requirements, specifications, wiring diagram, design, dev journal, pseudocode and evaluation

## Video

Demo video pending — being compressed for upload.

> `.hex` files are compiled MicroPython/MakeCode output for the micro:bit, not
> human-readable source; the pseudocode in the folio documents the actual logic.
