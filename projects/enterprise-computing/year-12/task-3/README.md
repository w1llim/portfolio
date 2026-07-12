# WAILA — "What Am I Looking At?"

**Enterprise Computing — Year 12 HSC, Assessment Task 3 (2026)**
*Major Work — Enterprise Project*

**[Open the interactive prototype ↗](https://www.figma.com/proto/IQEhEVizCWXGp7NdPjgue8/Assessment-Task-3?node-id=45-394&p=f&t=dvoTw3jTiYhuHMl5-0&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=45%3A394)** ·
**[Watch the demo](https://youtu.be/ecUnVJKIl8w)** (unlisted)

A client-commissioned mobile app concept for an automotive dealership's
workshop: point a phone's camera at a vehicle part, get instant AI
identification with audio feedback, and request stock from the workshop's
parts inventory on the spot — designed end to end from a real client
interview through to a high-fidelity Figma prototype, a supporting
relational database, and a network model of how the request actually
reaches a stock taker.

## The brief

The client is a mechanic at a dealership workshop where mechanics
identify and request vehicle parts from stock takers, who either hand
over on-hand stock or order from suppliers. The client wanted a mobile
tool that could identify parts by camera while working under a car, give
audio feedback so a mechanic's hands never have to leave the job, and
send a part request straight to stock takers — aimed specifically at
*experienced* mechanics, so newer staff still learn to identify parts
without leaning on the app.

## The system

**WAILA** — a camera pointed at a part, an on-device model identifies it,
overlays a description on screen and reads it aloud. Tap the overlay to
see whether the part's in stock; if not, a request auto-sends to stock
takers. Built and iterated in Figma, including a post-draft revision
after client feedback: login switched from username/password to SMS
verification code, and the target audience was narrowed from "all
mechanics" to "experienced mechanics only" — explicitly a support tool,
not a replacement for skill.

## System design

- **Data Flow Diagram** and **system flowchart** modelling the mechanic
  → app → stock taker → supplier chain.
- **5-entity relational schema**: `Users`, `Sessions` (a scanned part
  encounter, including the photo as a BLOB), `Parts`, and two bridge
  tables — `Interactions` (many-to-many between Users and Sessions) and
  `Orders` (many-to-many between Users and Parts). Modelled in Access to
  mirror the data dictionary.
- **Network model** (Cisco Packet Tracer) showing how a request actually
  travels from mechanic to stock taker to supplier.
- **Gantt chart** tracking the project across its milestones.

## Evaluation

**Strengths**: an intentionally linear, low-friction flow (scan → info →
request) that matches how a mechanic actually works.
**Limitations, stated plainly**: this is a high-fidelity prototype, not a
working system — no real backend, no persistence between sessions, no
trained model behind the "AI." It's built to show the client what a final
product could be, not to ship.
**Ethics & impact**: covers Privacy Act 1988 / APP obligations around
storing phone numbers and session photos, the Notifiable Data Breaches
scheme, encrypting part-request traffic in transit, and — the most
interesting risk raised in the folio — that an AI identification aid
handed to newer staff risks quietly substituting for the genuine
workshop expertise it was only ever meant to support.

## Files

- [`William Lam Task 3 Folio.pdf`](William%20Lam%20Task%203%20Folio.pdf) — full folio: problem definition, client interview, system design, DFD/flowchart, schema, ERD, data dictionary, testing, evaluation, social/ethical/legal impact
- [`William Lam - ECOM Task 3 Database.accdb`](William%20Lam%20-%20ECOM%20Task%203%20Database.accdb) — Access database mirroring the data dictionary
- [`William Lam - ECOM Task 3 Cisco.pkt`](William%20Lam%20-%20ECOM%20Task%203%20Cisco.pkt) — network model (open in [Cisco Packet Tracer](https://www.netacad.com/courses/packet-tracer))
- [`William Lam - ECOM Task 3 Gantt Chart.xlsx`](William%20Lam%20-%20ECOM%20Task%203%20Gantt%20Chart.xlsx) — project timeline
