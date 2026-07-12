# LearnerHours

**Software Engineering — Year 12 HSC, Assessment Task 2 (2025)**
*"Programming for the Web"*

An installable, offline-capable Progressive Web App for logging L-plate
driving hours — built out from a given base PWA into a fully-featured,
secured client-only app: no backend, no server, everything lives in the
browser.

**[Launch the app ↗](https://w1llim.github.io/portfolio/projects/software-engineering/year-12/task-2/pwa/)**

## What it does

Register a local account, log in, and record driving sessions (date,
start/end time, description). Sessions can be edited, deleted, searched,
filtered and sorted, with running totals of hours logged. Installable to
a home screen like a native app, and still usable offline once the
service worker has cached the app shell.

## Security

- Passwords are never stored in plaintext — hashed with SHA-256 via
  `crypto.subtle` before touching `localStorage`.
- User-entered text (session descriptions) is sanitised through
  [DOMPurify](https://github.com/cure53/DOMPurify) before being rendered,
  preventing stored XSS.
- Password policy enforced client-side (8+ characters, upper/lowercase,
  a digit) at registration.
- Report documents an OWASP ZAP scan pass and the risks it surfaced.

## Engineering notes

- **`app.js`** is the production build actually wired into `index.html`;
  **`app_large.js`** is the original, fully commented development source
  kept alongside it for readability (same split for the CSS/service
  worker pairs).
- The service worker caches the app shell (`index.html`, `style.css`,
  `app.js`, the manifest) so the app keeps working offline after first
  load, and takes over cleanly on activate (clears stale cache versions).
- Deployment note: the original `sw.js` cache list and the manifest's
  `start_url` used root-absolute paths (`/index.html`, `/`), which broke
  once hosted at a nested path rather than a domain root. Changed to
  relative paths (`./index.html`, `./`) so the service worker and install
  prompt resolve correctly wherever it's deployed — the only change made
  outside of the original submission, purely to make it live-hostable.

## Files

- [`Software Engineering Task 2 Journal - William Lam.pdf`](Software%20Engineering%20Task%202%20Journal%20-%20William%20Lam.pdf) — dated build journal
- [`William Lam Project Report.pdf`](William%20Lam%20Project%20Report.pdf) — full report: every feature added, browser/device compatibility testing, security measures, load-time optimisation, and a reflection
- [`pwa/`](pwa) — the deployed app source (`index.html`, `app.js`, `style.css`, `sw.js`, manifest, icons)
