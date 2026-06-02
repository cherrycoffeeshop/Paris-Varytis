# Paris Varytis — personal website

A one-page bilingual (Greek / English) biographical & tutoring site for **Paris Varytis, PhD in
Theoretical Physics**. Built with **vanilla HTML + CSS + JavaScript** — no framework, no build step,
no dependencies (other than Google Fonts loaded via `<link>`). It opens by double-clicking
`index.html` and is ready to deploy on **GitHub Pages from the repository root**.

---

## ⚠️ Before launch — fill in these placeholders

Open the project and search (grep) for `{{` — every spot the client must complete is marked with a
`{{PLACEHOLDER}}`. **Do not reuse the CV's Berlin-era 2020 contact details — they are outdated.**

| Placeholder | Where | What to put |
|---|---|---|
| `{{EMAIL}}` | `index.html` (hero email link, contact list, contact form `data-email`) | Paris's current email |
| `{{PHONE}}` | `index.html` (contact list `tel:` + text) | Paris's current phone |
| `{{AREA}}` | `index.html` (contact "Area / Περιοχή") | City/area served for in-person lessons (confirm Athens) |
| `{{INSTAGRAM}}` | `index.html` (hero socials) | Paris's own Instagram URL — or delete the link |
| `{{LINKEDIN}}` | `index.html` (hero socials) | Paris's own LinkedIn URL — or delete the link |
| `{{DOMAIN}}` | `index.html` `<meta property="og:image">` comment | Final domain, to make the social-share image an absolute URL (optional) |
| `{{SCHOLARSHIP_1}}`–`{{SCHOLARSHIP_3}}` | `index.html` (Scholarships card) | Name of each scholarship / institution / award a student won (rows are duplicatable — add or remove `<div>`s) |
| `{{SCHOLARSHIP_1_DETAIL}}`–`{{SCHOLARSHIP_3_DETAIL}}` | `index.html` (Scholarships card) | Short detail per scholarship — e.g. student initials, year, field, university |

Quick find on macOS/Linux:

```bash
grep -rn "{{" index.html
```

> The **Abakas** details (address, phone `21 0806 2190`, `@avakas.official`, `abakasmarousi.gr`) are
> the tutoring center's real public info and are intentionally hard-coded — they are **not**
> placeholders. Paris is framed throughout as a **teaching tutor at Abakas, not its owner**.

---

## Run locally

- **Easiest:** double-click `index.html` (it works straight from `file://`).
- **Recommended (matches production):** serve over HTTP from this folder:

  ```bash
  python3 -m http.server 8000
  # then open http://localhost:8000
  ```

No installation, bundling or npm is required.

---

## Deploy on GitHub Pages (from repo root)

1. Create a **public** GitHub repository and push the **contents of this folder to the repo root**
   (so `index.html`, `styles.css`, `app.js`, `imges/`, `Varytis-CVblack.pdf`, `favicon.*` all sit at
   the top level — no subfolder).
2. In the repo: **Settings → Pages → Build and deployment → Source: _Deploy from a branch_**.
3. Choose branch **`main`** and folder **`/ (root)`**, then **Save**.
4. Wait ~1 minute; the site goes live at `https://<user>.github.io/<repo>/`.

All paths are **relative**, so it works at the repo root with no base-path changes. To use a custom
domain, add it under Settings → Pages (a `CNAME` file is created for you — none is included here).

---

## What's inside

```
index.html              One page: Hero · About · Lessons · Philosophy · Credentials · Abakas · Scholarships · Contact
styles.css              "Slate Teal" academic design system (CSS variables)
app.js                  Language toggle, mobile nav, active-link on scroll, scroll-reveal, contact→mailto
favicon.svg             "PV" monogram (primary icon)
favicon.ico             Raster fallback (16/32/48)
apple-touch-icon.png    iOS home-screen icon (180×180)
imges/                  Photos (hero, teaching, students) — already optimized; two are .webp
carousel/               Gallery photos for the Contact-section carousel (01.webp, 02.jpeg, …)
Varytis-CVblack.pdf     Linked by the "Download CV" buttons
```

### Notes for editing

- **Language:** Greek is the default; an **EL/EN** toggle (nav + footer) swaps every section and is
  remembered in `localStorage`. Localized text lives in paired `.lang-el` / `.lang-en` elements.
- **Greek copy is verbatim** from the client brief (About §6a, Hero §6c). Do **not** translate or
  reword the Greek — ship it as written.
- **Testimonials** are shown in their original English in both languages (authentic attributed
  quotes from the PhD reviewer, Prof. Dr. Kurt Busch, and Humboldt M.Sc. students).
- **Publications:** the brief gives the count ("10") but no titles, so it's shown as a credential
  metric, not a list. If real titles are provided later, they can be added to the Credentials section.
- **Contact form** has no backend (static hosting): on submit it composes a `mailto:` and opens the
  visitor's email app. The direct email/phone links are the fallback.
- **Fonts:** GFS Didot (headings — a Greek Font Society Didone) + IBM Plex Sans (body), via Google
  Fonts. Both include Greek glyphs. Remove the `<link>` and the `--font-*` values fall back to system
  serif/sans if you ever need a fully offline build.
- **Images:** the hero is `imges/pro-vis54TW7.jpeg` (Paris at the whiteboard). All `<img>` tags carry
  intrinsic `width`/`height` to prevent layout shift; non-hero images are lazy-loaded.
- **Carousel (Contact section):** photos live in the `carousel/` folder named `01`, `02`, `03`… —
  the number sets the display order; supported formats are `.jpg`, `.jpeg`, `.png`, `.webp`. They're
  detected automatically when the page loads, so to **add** a photo drop in the next number and to
  **remove** one delete its file — **no code edits**. Keep the numbering sequential (a run of 3+
  missing numbers stops detection). Each photo opens **fullscreen** (click it, or the ⤢ button); in
  fullscreen, **← / →** keys navigate and **Esc** closes; the carousel also auto-advances every 4 s (pausing on hover and while fullscreen is open). Works both from `file://` and GitHub Pages.
- **Student comments (testimonials):** the scrolling line under the gallery is built from
  `<li class="ticker-item">` blocks in the **Testimonials** `<section>` of `index.html` — currently
  **placeholder** reviews to replace. Each is bilingual (`.lang-el` / `.lang-en`); add or remove items
  freely and the line is cloned automatically for a seamless loop (steady ~40 px/s, pauses on hover,
  static under the OS "reduce motion" setting).

### Accessibility

Semantic landmarks, a skip-to-content link, dynamic `lang` attribute, alt text on every image,
ARIA labels on icon buttons, full keyboard navigation, visible focus rings, WCAG-AA color contrast,
and `prefers-reduced-motion` support are all built in.
