# Enterprise Network & Threat Model

**Enterprise Computing — Year 11 Preliminary, Assessment Task 2 (2025)**
*"Networking Systems and Social Computing" / "Principles of Cybersecurity"*

A full enterprise LAN for a small local business, built and configured end
to end in Cisco Packet Tracer, paired with a threat analysis, risk matrix
and mitigation plan for the network as designed.

## The network

Four departments (IT, Accounting, Sales, Administration) on a tree
topology, gigabit throughout:

- **IT** — the wireless router, core switch, an IoT registration server,
  and a side "Gigabit Switch" branch hosting two personal HTML sites
  (`williamlam.net`, `adampham.com`) carried over from earlier IST
  assignments — added purely to push further into Packet Tracer, not part
  of the brief.
- **Accounting / Sales** — wired desktop PCs plus a wireless access point
  for department laptops (WPA2 Personal, static/DHCP mixed addressing).
- **Administration** — wired PCs, a gateway, and two IoT devices (a smoke
  detector and a webcam) routed through a dedicated IoT server rather than
  connected directly to a switch.
- Every switch runs GigabitEthernet with fiber trunks between
  switches/access points and copper straight-through to end devices.

## Security measures implemented

- **WPA2 Personal/PSK** on all wireless networks, with two IT guest SSIDs
  kept isolated from the private network.
- **Unused switch ports disabled** so nothing can plug into a dead port
  and reach the network.
- **Port security** — MAC addresses locked ("sticky") per port with a
  shutdown violation policy; access points capped to their department's
  expected device count and lock out (manual restart required) if that's
  exceeded.
- **Known gap, documented rather than hidden**: if a *new* device's MAC
  address connects to a port a legitimate device was already using, the
  port stays open — a real vulnerability in this design, called out
  directly in the security overview rather than glossed over.

## Threat analysis → risk matrix → mitigation plan

A structured pass across technical, human and organisational risk
categories (outdated firmware, weak/default passwords, phishing, social
engineering, tailgating, absence of an incident response plan, third-party
vendor access, and more), each scored on a 5×5 likelihood/impact matrix.
Highest-priority ("Very High") risks: phishing, ransomware, weak/default
passwords, missing security policy, and lack of endpoint protection.

The mitigation plan responds directly to that scoring: patch management,
network hardening under the principle of least privilege, MFA, endpoint
protection and encryption on the technical side; mandatory cybersecurity
awareness training and phishing simulations for staff; and policy/vendor
management to close the organisational gaps.

## Build log highlights (from the logbook)

IoT devices initially refused to join the network until realising they
need a gateway rather than a direct switch connection; an early attempt at
AAA authentication was abandoned once it turned out the wireless router
had no CLI to configure it; the whole network was later upgraded from
copper/standard switches to fiber-capable 3650 switches once it became
clear gigabit didn't actually require fiber end-to-end — just
GigabitEthernet. Packet Tracer also crashed once, costing about an hour
of work.

## Files

- [`Documentation - William Lam.pdf`](Documentation%20-%20William%20Lam.pdf) — full folio: logbook, network overview and diagram, security overview, device tables (IPs/MACs/connections per department), threat analysis, risk matrix, mitigation plan
- [`Cisco Network - William Lam.pkt`](Cisco%20Network%20-%20William%20Lam.pkt) — the Packet Tracer project file (open in [Cisco Packet Tracer](https://www.netacad.com/courses/packet-tracer))

## Video

[Watch the demo](https://youtu.be/ayh62CbuKEo) (unlisted)
