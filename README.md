#Portfolio (Dossier Theme)

A single-page, tech-minimal "personnel dossier" style portfolio. Dull-corporate palette,
frosted-glass panels that sharpen into focus as you scroll ("focus-pull" reveal), a subtle
drifting-grain particle layer, and a film-grain texture overlay across the whole page.

## Open it in VS Code

1. Unzip / copy the `portfolio` folder into your project space.
2. Open the folder in VS Code: `File → Open Folder…`
3. Install the **Live Server** extension (Ritwick Dey) if you don't have it.
4. Right-click `index.html` → **Open with Live Server**.

No build step, no dependencies — plain HTML/CSS/JS.

## Folder structure

```
portfolio/
├── index.html              → all page content & structure
├── css/
│   └── style.css           → design tokens, layout, glass/blur, animations
├── js/
│   └── script.js           → scroll reveal, particle grain, nav sync
├── assets/                 → put your real portrait image here
└── documents/              → downloadable files, linked from the page
    ├── Daniel_Njiraini_CV.pdf
    ├── JKUAT_Diploma_Certificate.pdf
    └── CCI_Recommendation_Letter.pdf
```

## Replace the placeholder content

**Portrait image** — the cover section currently shows a line-art placeholder frame.
Drop your photo into `assets/` (e.g. `assets/portrait.jpg`), then in `index.html` swap:

```html
<div class="cover-photo placeholder-image" ...> ... </div>
```

for:

```html
<div class="cover-photo">
  <img src="assets/portrait.jpg" alt="Daniel Murimi Njiraini" style="width:100%;height:100%;object-fit:cover;">
</div>
```

**Downloadable documents** — every "Download" link points at a real file in `documents/`,
each currently a clearly labelled **placeholder PDF** with sample content. Replace the file
at the same path (keep the filename, or update the `href` in `index.html`) with your actual:

- CV → `documents/Daniel_Njiraini_CV.pdf`
- JKUAT diploma certificate / transcript → `documents/JKUAT_Diploma_Certificate.pdf`
- CCI recommendation letter → `documents/CCI_Recommendation_Letter.pdf`

The `download` attribute on each `<a>` tag is what triggers a direct file download instead
of opening in a new tab — that logic is already wired up per element, so dropping in a new
file with the same name is all that's needed.

**References** — the four reference cards in the References section use bracketed placeholders
(`[ Reference Name ]`, `[reference1@example.com]`, etc). Replace these with real, verified
contacts before sending this portfolio to anyone — never publish a reference's details without
their permission.

**Coding language percentages** — in `index.html`, each language bar has a `style="--pct:85%"`
and a matching `<span class="lang-pct">85%</span>` — edit both together.

## Design notes

- **Palette**: near-black charcoal-olive base, dull parchment ink, muted brass accent — a
  restrained "corporate dossier" feel rather than a bright portfolio look.
- **Typography**: Fraunces (display serif) for names/titles, Inter for body copy, IBM Plex Mono
  for labels, tags and data — a classic file-label / ledger feel.
- **Signature interaction**: panels enter blurred and translucent, then sharpen to full clarity
  as they cross into view, paired with a brief grain-texture intensity pulse — like a projector
  pulling focus. Ambient dust particles drift upward continuously and briefly accelerate on scroll.
- Respects `prefers-reduced-motion` — all animation and particles are disabled for users who
  request reduced motion.
