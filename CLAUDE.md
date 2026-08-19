# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

William Lam's personal portfolio site — a hand-written static site published
as a **GitHub Pages project site** at `https://w1llim.github.io/portfolio/`.
It is a Year 12 / HSC 2026 portfolio: cadets, white crane kung fu, coursework,
and a cybersecurity-themed interactive "Ops Lab".

There is **no build step, no bundler, no package manager, and no dependencies.**
Every page is a single self-contained `.html` file with its CSS in a `<style>`
block and its JS in a `<script>` block at the bottom. Do not introduce a build
pipeline, a framework, or an `npm` install unless explicitly asked.

## Layout

| URL       | File               | Contents                                       |
| --------- | ------------------ | ---------------------------------------------- |
| `/`       | `index.html`       | hero, mission, coursework, command, kung fu, major works, projects, timeline, toolkit, contact + docked terminal |
| `/ops/`   | `ops/index.html`   | Ops Lab — 5 stages of interactive security tools |
| `/blog/`  | `blog/index.html`  | field notes (currently placeholder post cards)  |
| —         | `404.html`         | GitHub Pages 404 handler, standalone styles     |

Supporting files: `robots.txt`, `sitemap.xml`, `assets/og-image.png`,
`projects/` (coursework artifacts — PDFs, `.pkt`, `.accdb`, `.xlsx`, plus
per-task `README.md` files), `.claude/` (skills + `launch.json`).

`projects/` is a document archive, not site code — the binaries there are
submitted schoolwork. Leave them alone unless the task is about them.

## Conventions that matter

**Clean URLs.** Extensionless paths come from directory `index.html` files.
Internal page-to-page links are always relative (`ops/`, `../`, `../blog/`)
so the site works both under the `/portfolio/` subpath and at a domain root.
The absolute `https://w1llim.github.io/portfolio/` prefix appears **only** in
canonical/OG/JSON-LD/sitemap/robots URLs and in `404.html`'s uplink — never in
a link between pages. Adding a page means adding a directory with an
`index.html`, plus a `sitemap.xml` entry.

**Theme.** Dark is the default; light mode is opt-in. Colours come from CSS
custom properties on `:root` (`--bark`, `--kraft`, `--phos`, `--threat`,
`--moss`, `--olive`, …), overridden under `html[data-theme="light"]`. Several
are also exposed as raw RGB channels (`--kraft-rgb`, `--phos-rgb`, …) so
translucent layers can reuse the same alphas in both themes. **Never hard-code
a hex colour in new markup** — use a variable, and check the light theme.

The choice persists in `localStorage.theme` and is applied pre-paint by a small
inline `<head>` script that sets `data-theme` on `<html>` (this is duplicated in
each page, including `404.html`, to avoid a flash of the wrong theme). Toggled
via `#themeToggle` in the header (present on every page) or the terminal
command `theme light|dark|toggle` (currently implemented in the index terminal
only — the ops terminal has no `theme` command yet). The slipspace section on the index and `#netCanvas`
on ops deliberately stay dark in light mode; `<meta name="theme-color">` is
updated in JS alongside the toggle.

**Terminal.** Both `index.html` and `ops/index.html` carry the same docked
terminal (`#termShell` / `#terminal`), with command tables defined near the
bottom of each file: `SHELL` (command → output lines), `SECTIONS` (`cd <name>`
→ element id), `STAGES` (`cd ops-lab/<stage>` → ops stage id), `FASTFETCH`,
`PROJECTS`, `MAJORWORKS`. Supports minimise, fullscreen (`⛶` / `fullscreen` /
`esc`), and cross-page `cd`. **The two copies must stay in sync** — a command
added to one page should be added to the other, and `help` / `ls` output kept
consistent.

**Reveal animations.** Most content uses `.reveal` (plus `.d1`/`.d2`/`.d3`
stagger classes) faded in by an IntersectionObserver. Headings use
`data-scramble-scroll` for the text-scramble effect. Both honour
`prefers-reduced-motion`.

**Ops Lab stages.** `ops/index.html` is organised into five anchored stages —
`#stage-observe`, `#stage-extract`, `#stage-decode`, `#stage-crypto`,
`#stage-synthesize` — each holding `.panel` cards titled in their `.term-bar`
(`xxd + strings`, `exiftool --scan`, `stego --lsb`, `qr --decode`,
`xor --brute`, `caesar`, `subst --keyed`, `vigenere --crack`, `sha256 --avalanche`,
`hashid`, `passwd --audit`, `rsa --toy`, `jwt --decode`, `date --epoch`,
`uuid --inspect`, `diff --compare`, the Magic Decoder, grep, and more).
Tools pipe their stdout into the stage-05 synthesize tools via the `Pipe`
module. Everything runs **client-side only** — no network calls, no uploads;
dropped files never leave the browser. Keep it that way.

The `freq --analyze` panel's auto-solver carries a compiled English model: the
676-character `BIGRAM` table (26×26 letter-pair scores, `charCode − 33`, built
offline from word-frequency data) and the `COMMON` word list. Both are
generated constants — retune the solver, not the numbers, and keep the table
free of `'` and `\` so it stays a plain single-quoted literal.

**Style.** Compact hand-written HTML/CSS/JS: 2-space indent, single quotes in
JS, `const`/`let`, IIFE modules (`const Pipe = (function(){…})()`) for anything
with private state, lowercase-terminal voice in UI copy, and short `/* … */`
comments explaining *why*. Match the surrounding code rather than reformatting
it. Accessibility is maintained deliberately — keep `aria-label`,
`aria-pressed`, `role`, and `aria-live` attributes intact on interactive
elements.

## Running and verifying

No build. Serve the repo root over HTTP (relative links and `fetch` need a real
origin — don't open files with `file://`):

```bash
python3 -m http.server 8901
```

`.claude/launch.json` defines the same thing on port 8137.

For browser-driven verification, see the **`verify` skill**
(`.claude/skills/verify/SKILL.md`) — it documents the Playwright recipe and the
gotchas (the floating hero terminal needs `{ force: true }` clicks, wait for
`.reveal` elements before screenshotting, disable smooth scrolling before
programmatic scrolls, and Google Fonts failing behind the sandbox proxy is
environmental, not a regression).

After changing shared UI (nav, terminal, theme), check **all four** pages —
index, ops, blog, 404 — in both themes, since the code is duplicated per page.

## Git

Default branch is `main`. Commit messages are short, imperative, sentence-case
descriptions of the change ("Add light mode with header toggle and terminal
commands", "Drop .html from the site's URLs"). No prefixes or issue tags.
