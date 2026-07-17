---
name: verify
description: Build/launch/drive recipe for verifying changes to this static portfolio site
---

# Verifying changes to this site

Static site, no build step. Pages: `index.html` (hero + interactive terminal),
`ops.html` (interactive lab modules), `blog.html`, `404.html`.

## Launch

```bash
python3 -m http.server 8901 &   # serve from the repo root
```

## Drive (headless Chromium via Playwright)

Chromium is pre-installed; launch with
`chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })` — do not run
`playwright install`.

Gotchas learned the hard way:

- The hero terminal (`#termShell`) floats forever (`animation:float`), so
  Playwright clicks time out on stability — use `{ force: true }`.
- To type into the terminal, wait for boot to finish first:
  `page.waitForFunction(() => document.querySelector('#terminal .caret'))`,
  click `#termShell`, then use `page.keyboard`.
- Most content is `.reveal` elements faded in by IntersectionObserver — wait
  ~2-3s after navigation before screenshotting or the page looks empty.
- `html{scroll-behavior:smooth}` makes `scrollIntoView` async; set
  `document.documentElement.style.scrollBehavior='auto'` before programmatic
  scrolling.
- Google Fonts requests fail in the sandbox (proxy) — the resulting console
  errors are environmental, not regressions.

## Theme

Dark is default; light mode is toggled via `#themeToggle` in the header or the
terminal commands `theme light|dark|toggle`. Choice persists in
`localStorage.theme` and is applied pre-paint by a head script setting
`data-theme` on `<html>`. The slipspace section (index) and `#netCanvas` (ops)
intentionally stay dark in light mode.
