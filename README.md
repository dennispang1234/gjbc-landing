# Good Juju Barbell Club — Lead-Gen Landing Page

Static landing page for 1-on-1 personal training leads (free consult + movement assessment).
Separate from the internal GJBC dashboard — pure static HTML/CSS, no backend.

- `index.html` — the landing page (self-contained: embedded CSS + JS)
- `assets/` — logo + hero image (from heygoodjuju.com)
- `vercel.json` — static config; sends `X-Robots-Tag: noindex` so drafts aren't indexed

## Deploy (Vercel)

This deploys as a **static site** — no build step, no framework.

1. Push this repo to GitHub.
2. Vercel → **Add New… → Project** → import the repo.
3. Framework preset: **Other** (static). Leave build/output empty. Deploy.
4. Every branch/PR gets its own preview URL; `main` is production.

## Going live

When ready for the public, remove the `X-Robots-Tag: noindex` header in `vercel.json`
and wire the lead form (see the `TODO` comment near the bottom of `index.html`).
