# Digital U

**Software Engineering — Year 12 HSC, Assessment Task 3 (2026)**
*Major Work — Software Engineering Project*

**[Launch the live site ↗](https://at3-eportfolio-8e30f9.gitlab.io)**

A digital business card. Register an account, fill in a profile with only
the contact details you choose to share, and get a public page at
`/user/<username>` that anyone can view — or reach by tapping an NFC card
against their phone. Built end to end from a client brief through to a
deployed, Supabase-backed single page application running live on the
open web.

## The problem

Paper business cards are wasteful, expensive for small businesses to
print in bulk, and hard-limited in how much they can say by the size of
the card. Networking itself hasn't gone anywhere. Digital U keeps the
tap-and-exchange moment but moves the card itself online: one NFC card
stays with the owner permanently and hands over a URL instead of a
hundred printed cards, with a QR code on the back for phones without NFC.

Aimed at entrepreneurs, small business owners, students and people new to
the workforce.

## The system

A **single page application** in vanilla HTML, CSS and JavaScript — no
framework, no build step — talking directly to **Supabase** (hosted
PostgreSQL plus its authentication service) over HTTPS. There is no
server-side code of my own; the whole front end is static files, which is
what makes it deployable to GitLab Pages as-is.

| File | Role |
|------|------|
| `public/index.html` | The single page shell — navbar, an empty `<main id="app">`, and a toast element. Every route renders into it |
| `public/static/js/app.js` | Route table, client-side router, public profile rendering, user search, HTML escaping |
| `public/static/js/auth.js` | Registration, login, logout, navbar auth state, profile form load/save |
| `public/static/js/supabaseClient.js` | Creates the Supabase client and exposes it to the app |
| `public/static/css/style.css` | All styling, including the mobile layout |
| `public/404.html`, `public/_redirects` | Deep-link recovery, so `/user/<username>` resolves on a static host |

The CSS and JS shipped to the browser are minified; the fully commented
development sources are kept alongside them as the `*_large` files.

Because the page never reloads, `renderRoute()` fires a custom
`route:rendered` event once new HTML is in the DOM — that's how the
navbar, profile form and search box re-initialise themselves after every
navigation.

## Security

The full write-up is in [`P&I.md`](Documentation/03.Producing_and_Implementing/P&I.md).
The short version:

- **XSS** is the headline threat, since the entire point of the site is
  showing one user's typed text to another. Every value written through
  `innerHTML` passes through an escaping function first, and the profile
  title is set with `textContent`, which cannot execute markup at all.
- **SQL injection** — no hand-written SQL exists. Every query goes
  through the Supabase query builder, which sends user input as a
  parameterised value rather than concatenating it into a query string.
- **Passwords** never touch code I wrote. They go straight from the input
  box to Supabase Auth, which bcrypts them into a protected `auth` schema
  the public API key cannot read. The public `profiles` table holds no
  credentials.
- **Broken access control** — the row owner is always taken from the
  authenticated session, never from the form. There is no `user_id`
  field to tamper with, so a save cannot be aimed at someone else's row.
- **Transport** is TLS end to end; GitLab Pages forces HTTPS and outbound
  profile links get an `https://` prefix when the user omits a protocol.
- **Known limitations, stated plainly**: email verification is disabled
  (Supabase's free tier caps built-in email at 2/hour, which blocked
  testing), there's no MFA for the same reason, and the Supabase URL and
  publishable key sit in client code — safe only because Row Level
  Security policies are what actually enforce access.

## How it got built

Agile, sole developer, 13 weeks. The route was not a straight line:

- **Weeks 3–7** — started on Flask, spent a week trialling a migration to
  Next.js for its built-in routing, found it added more complexity than
  value, and reverted. The takeaway logged in the journal at the time was
  knowing when to cut losses on a tool, and to prototype a framework
  switch on a copy before committing the whole project to it.
- **Weeks 7–9** — committed to Flask, got Supabase integrated and
  building out features locally.
- **Week 10** — moved to a client-side SPA. Frozen-Flask was tried first
  for static generation but needed a rebuild on every change; going
  fully client-side removed the server requirement entirely.
- **Weeks 11–13** — profile feature, dead Flask templates deleted,
  testing, bug tracking, deployment.

Client feedback drove real changes — the client found that search only
matched usernames and not display names, which was fixed. Teacher
feedback pushed toward local storage instead of Supabase as lower-risk
for a school project; that was considered and declined, because profiles
needed to be globally reachable for the concept to work at all.

## Running it locally

The SPA has to be *served*, not opened from the file system, or routing
breaks. From the project root:

```bash
java -jar server.jar 8123
```

## Files

- [`Documentation/`](Documentation) — the full folio across four stages:
  - [`I&D.md`](Documentation/01.Identiying_and_Defining/I&D.md) — problem definition, scope and boundaries, audience, constraints, assumptions
  - [`R&P.md`](Documentation/02.Researching_and_Planning/R&P.md) — development approach, social/ethical issues, communication plan, data dictionary, Level 1 DFD
  - [`P&I.md`](Documentation/03.Producing_and_Implementing/P&I.md) — architecture, four algorithms with pseudocode and flowcharts, full security analysis
  - [`T&E.md`](Documentation/04.Testing_and_Evaluating/T&E.md) — test report, feedback and responses, software evaluation
  - Supporting documents: QA checklist, Gantt chart, test report and software evaluation (`.docx` / `.xlsx`)
- [`Journal.md`](Journal.md) — 13 weekly entries: aims, progress, challenges and solutions, reflection
- [`Bibliography.md`](Bibliography.md) — sources
- [`public/`](public) — the deployed site source (SPA shell, router, auth, Supabase client, styling, images)
- [`server.jar`](server.jar) — small local static server for development

The live deployment and its GitLab CI pipeline live in the original
project repository at
[gitlab.com/william.lam8-group/at3_eportfolio](https://gitlab.com/william.lam8-group/at3_eportfolio).

> Note: the only change made to the submitted source in this copy is in
> `P&I.md`, where four links to the `_large` development files were
> repointed from repository-absolute to relative paths so they resolve
> here as well as on GitLab.
