# Prompt for the design agent

> Copy everything below the line into a fresh Claude Code session opened **inside the
> `paris-site/` folder**. It references `CLIENT-BRIEF.md`, which must be in the same folder.

---

You are building a personal **biographical / portfolio website** for **Paris Varytis**, a PhD
in Theoretical Physics who teaches Physics & Mathematics. The site's job is to present *him*
(his story, credentials, teaching) and convert visitors into private-tutoring students.

## Source of truth
Read **`CLIENT-BRIEF.md`** in this folder FIRST. It contains all content, copy (Greek +
English, marked verbatim), credentials, quotes, the Abakas info, the asset list, and a
`TO VERIFY` section. Do not invent facts. Specifically:
- **Do NOT invent contact details.** The CV's phone/email/address are outdated (Berlin, 2020).
  Leave clearly-marked placeholders (e.g. `{{PHONE}}`, `{{EMAIL}}`) wherever real contact info
  is needed, and list them at the top of the README so the client can fill them in.
- **Paris is a teacher at Abakas, NOT the owner.** Never word it as ownership.
- **Do NOT translate the Greek website copy** in the brief — ship it verbatim.

## Tech constraints (hard requirements)
- **Vanilla only: HTML + CSS + JavaScript.** No frameworks, no React/Vue, no Tailwind, no
  build step, no bundler, no npm, no TypeScript. Plain `.html`, `.css`, `.js`.
- Must run by just opening `index.html` in a browser (use **relative paths** everywhere).
- **Deploy target: GitHub Pages from a public repo, served from the repo root.** So all final
  files (`index.html`, `styles.css`, `app.js`, `imges/`, the CV pdf, favicon) live at the root
  of `paris-site/`. No subfolder/base-path assumptions. Do not add a `CNAME` file unless asked.
- No external runtime dependencies. You may use Google Fonts via `<link>`, but otherwise keep
  assets local. No analytics, no trackers.
- Keep it accessible: semantic HTML, `lang` attribute, alt text, aria labels, keyboard-navigable,
  a "skip to content" link, visible focus states, good color contrast.
- Responsive (mobile-first), fast, no layout shift. Lazy-load images; serve `.webp` where present.

## Structure & interaction model — match `../mine/` in *form*, not in *style*
The developer's own site lives at `../mine/` (vanilla HTML/CSS/JS). **Mirror its information
architecture and interaction patterns**, then re-skin with a different, more formal aesthetic.
What to reuse conceptually from `mine/`:
- A fixed **navbar** with logo + section anchor links + a mobile **hamburger toggle**.
- A strong **hero** (name, title, tagline, primary CTA, secondary CTA, social links, a visual).
- Section-by-section single page with an **active-link highlight on scroll**, **smooth scroll**,
  and tasteful **scroll-reveal animations** (IntersectionObserver), like `mine/app.js`.
- A **"Download CV"** button (links to `Varytis-CVblack.pdf`).
- Clean section rhythm, a footer, favicon set.
- Optionally a second page (like `mine/projects.html`) — here it could be **"Publications"** or
  **"Credentials"** if the single page gets too long; otherwise keep it one page.

Read `../mine/index.html`, `../mine/styles.css`, and `../mine/app.js` to absorb the patterns
(CSS-variable theming, the nav/hero/section components, the JS for scroll/active-nav/animations).
**Do not copy its dark "developer" theme or the code-window hero visual.**

## Suggested sections (from the brief)
1. Hero — name, "PhD in Theoretical Physics", tagline, CTA "Book a trial lesson" + "Download CV",
   portrait (`imges/pro-lSxCds47.webp` if converted, else `.jpeg`).
2. About — bio (verbatim Greek 6a / English 6b), education, Humboldt / Max Born.
3. Services — Physics · Mathematics · University-level; online & in person.
4. Teaching philosophy.
5. Credentials — 10 publications, the three quotes (section 3 of brief), Humboldt, technical depth.
6. Abakas — "I teach at Abakas, Maroussi" + map/location + link to abakasmarousi.gr.
7. Contact — form (or mailto), social, area served. Use `{{PLACEHOLDERS}}` for unknown details.
8. Footer.

## Design direction — SERIOUS, FORMAL, ACADEMIC (the key difference from `mine/`)
- Tone: premium, scientific, trustworthy, mentor-like. Quiet confidence, not flashy.
- Prefer a **light, editorial palette** (off-white/paper backgrounds, deep navy/charcoal text,
  one restrained accent — e.g. a deep blue or muted academic tone). Avoid neon/dark-hacker vibes.
- Typography: a refined serif for headings (academic feel) + a clean sans for body, OR a single
  elegant sans used with great hierarchy. Generous whitespace, strong type scale.
- Subtle scientific motifs allowed but understated (thin rules, grid, faint formula/graph texture).
- Animations: minimal and elegant (gentle fades/reveals). No bouncy/playful effects.

## Bilingual
The site is **Greek (primary) + English**. Implement a simple **EL/EN language switch** (plain
JS toggling `data-lang` / showing-hiding localized blocks, or two sets of text — your call, keep
it vanilla and dependency-free). All sections need both languages; the brief provides EL+EN for
hero and About — produce the rest in the same register, but never alter the verbatim Greek.

## Images
Use files from `imges/` (see the brief's asset table for what each shows and where to place it).
Two were converted to `.webp` (`pro-2HoKa5eF.webp`, `pro-Wlp2jafN.webp`); the rest are `.jpeg`.
Add width/height attributes to avoid layout shift; provide meaningful alt text.

## Deliverables
- `index.html` (+ optional second page), `styles.css`, `app.js` at the repo root.
- A favicon (you may generate a simple SVG monogram, e.g. "PV").
- A short `README.md` documenting: how to run locally, how to deploy on GitHub Pages
  (Settings → Pages → deploy from branch `main`, root), and a **checklist of the
  `{{PLACEHOLDER}}` values the client must fill in** (phone, email, city, his own socials).

## Acceptance criteria
- Opens correctly by double-clicking `index.html`; works the same when served from GitHub Pages root.
- No console errors; no external JS/CSS deps beyond optional Google Fonts.
- Fully responsive; passes basic a11y (labels, contrast, keyboard nav).
- Distinctly more formal/academic than `../mine/`, while reusing its structure & interactions.
- No fabricated contact info; Abakas framed as employer/affiliation, not owned; Greek copy verbatim.
