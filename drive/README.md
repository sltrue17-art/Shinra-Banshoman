# Model 3 City Drive

A first-person driving simulator that runs in a single HTML file. You sit in the
driver's seat of a Tesla Model 3-shaped sedan in a procedurally generated city,
turn the steering wheel with your fingers, and drive it with analogue pedals.

Open `index.html` in any modern browser. There is no build step.

## Controls

| What | How |
| --- | --- |
| Steer | Put a finger (or two, hand-over-hand) on the steering wheel in the cabin and turn it. The rim tracks your grip 1:1 and self-centres when you let go, more strongly the faster you are going. |
| Accelerate / brake | The two pedal panels in the bottom corners. Travel is analogue: how far you slide up is how hard you press. Lift off in D and regen slows the car — one-pedal driving. |
| Select a gear | The P R N D column on the right. D and R only engage below walking pace. |
| Look around | Drag anywhere in the cabin that is not the wheel. The view eases back to straight ahead. |
| Mirrors | The rear-view and both door mirrors are live renders. |
| Indicators / lights / horn / view | `Q` `E` / `L` / `H` / `V` on a keyboard; the horn also has a button. |

Keyboard steering (`A`/`D`) is always available as an accessibility aid.
Keyboard throttle and brake are off by default — the pedals are the control —
and can be switched on under *Setup → Keyboard assist*.

## What is simulated

The vehicle is a planar three-degree-of-freedom body (surge, sway, yaw)
integrated at a fixed 400 Hz, with:

- **Four load-sensitive tyres** using a Pacejka-style magic formula for
  longitudinal and lateral force, combined through a friction ellipse, so a tyre
  that is already cornering hard has less grip left for braking.
- **Weight transfer** — longitudinal from acceleration, lateral from cornering,
  split front/rear by roll stiffness — feeding back into the tyre loads.
- **Wheel spin states**: each wheel has its own rotational inertia, so wheelspin,
  lock-up and slip ratio all emerge rather than being faked.
- **Dual motors** (front and rear, 340 kW combined) with a constant-torque then
  constant-power envelope, plus blended regenerative braking and vehicle hold.
- **ABS, traction control and stability control**, each switchable. Turn stability
  control off and the car will happily oversteer.
- Aerodynamic drag (Cd 0.23), rolling resistance, Ackermann steering geometry,
  a 12:1 rack, body dive/squat/roll on a sprung mass, kerb strikes, and
  impact resolution against buildings, parked cars and traffic.

Wet and rainy weather cut the friction coefficient and lengthen stopping
distances; the road reflects more and the wipers come on.

## The city

Seeded and procedural, so it is the same city every time you load it: a grid of
avenues with kerbs, pavements, lane markings, zebra crossings and stop bars;
towers that get taller toward downtown, with lit windows after dark; street
lights, signal-controlled intersections, trees, hydrants and parked cars.

Traffic drives itself on the lane graph with an intelligent-driver-model
car-following law, obeys the lights, gives way to you, and appears on the
cabin display's live visualisation.

## Files

- `index.html` — the whole simulator: city, car, physics, UI.
- `vendor/three.min.js` — a local copy of three.js r160 so the page also works
  offline. If it is missing the page falls back to a CDN copy.
