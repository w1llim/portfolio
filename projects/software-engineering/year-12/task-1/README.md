# Case Study: The 2022 Optus Data Breach

**Software Engineering — Year 12 HSC, Assessment Task 1 (2025)**

A written case-study report analysing the 2022 Optus data breach — the
security vulnerabilities that caused it, the CIA-triad principles it
violated, its impact on the company and its 9.8 million affected
customers, and concrete recommendations mapped back to secure coding
practice.

## What happened

On 22 September 2022, attackers exploited a public-facing, unauthenticated
API (`api.optus.com.au`) left exposed after a coding fix was patched on
Optus's primary site but never applied to an unused secondary domain. The
`contactid` field was sequential, so once inside, attackers enumerated
customer records directly — a textbook Insecure Direct Object Reference
(IDOR) attack. What Optus first reported as ~150,000 stolen records turned
out to be 9.8 million, including names, birthdates, and for some
customers, passport and Medicare numbers.

## Analysis

- **Vulnerabilities**: an unauthenticated public API, predictable
  sequential IDs enabling IDOR, and a patch applied to one domain but not
  its unused twin.
- **CIA triad**: confidentiality, authentication and authorisation were
  all breached — no encryption/masking on the data, no identity
  verification on the API, and no role-based access control limiting what
  an anonymous caller could reach. Integrity, availability and
  accountability held up.
- **Regulatory compliance**: found to have failed the Privacy Act 1988
  (per OAIC civil action), while the Notifiable Data Breaches scheme
  obligation was met — Optus disclosed within 24 hours.
- **Impact**: ~AU$1.5B in estimated brand value lost, ~65,000 customers
  (1.1% of the base) left within three months, the CEO resigned, and a
  class action plus regulatory penalty proceedings followed. For
  individuals: a measurable rise in scam calls and identity fraud
  targeting affected customers.

## Recommendations

Close unused domains and endpoints; enforce data masking, encryption and
proper access control for confidentiality; require MFA and strong
authentication on any public-facing API; apply RBAC and the Principle of
Least Privilege for authorisation; and add peer review and penetration
testing to the development process to catch exactly the kind of
patch-one-domain-miss-the-other gap that caused this breach in the first
place — recommendations explicitly mapped back to GDPR's core principles.

## Files

- [`Software Engineering Task 1 - William Lam.pdf`](Software%20Engineering%20Task%201%20-%20William%20Lam.pdf) — full report: introduction, vulnerability analysis, impact assessment, recommendations, bibliography
