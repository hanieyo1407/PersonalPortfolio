# Personal Portfolio — Yohane H. Maluwa

A personal portfolio website built with **plain HTML5, CSS3 and vanilla JavaScript** —
no frameworks, no build tools. Created for the *Multimedia Tools and Their Application*
assignment and hosted with **GitHub Pages**.

The design follows an editorial, awards-site direction: typography first, a monochrome
canvas with a single lime accent, numbered index rows, marquees, magnetic buttons and a
custom cursor — all hand-coded.

- **Student:** Yohane H. Maluwa (24311351028)
- **Programme:** BSc Computer Science, DMI-St. John the Baptist University
- **Live site:** `https://hanieyo1407.github.io/personal-portfolio/`
- **GitHub:** https://github.com/hanieyo1407

---

## Pages

| Page               | File             | What it shows                                                                 |
|--------------------|------------------|-------------------------------------------------------------------------------|
| Home               | `index.html`     | Name, welcome message, photo, programme, professional interests, CTAs          |
| About              | `about.html`     | Introduction, education table, skills lists, hobbies, career aspirations, contacts |
| Projects           | `projects.html`  | 7 projects (BEAN featured first) each with description, problem, tech and GitHub link |
| Animated Concepts  | `animations.html`| Live demos of 5 animation techniques used on the site                          |

## Project Structure

```
PersonalPortfolio/
├── index.html          ← Home page (main page)
├── about.html          ← About me
├── projects.html       ← My projects
├── animations.html     ← Animated concepts demos
├── css/
│   └── style.css       ← All styling (external stylesheet)
├── js/
│   └── script.js       ← All behaviour (vanilla JavaScript)
├── images/
│   ├── profile.jpg     ← My photo (hero)
│   ├── background.jpg  ← Decorative background
│   ├── stratec.jpg …   ← Project screenshots (placeholders — replace)
│   └── bean/           ← BEAN brand identity assets (Assignment 1)
└── README.md           ← This file
```

## Assignment Requirements Checklist

- [x] Four pages linked by a shared navigation bar (Home / About / Projects / Animated Concepts)
- [x] Semantic HTML5: `header`, `nav`, `main`, `section`, `article`, `footer`, `table`, lists
- [x] Text formatting: `h1`–`h6`, `p`, `strong`, `em`, `u`, `br`, `hr`, `code`, `caption`
- [x] Education shown in an HTML `<table>` (About page)
- [x] More than 5 skills in **unordered** and **ordered** lists (About page)
- [x] At least one image used as a **clickable hyperlink** (BEAN billboard on Projects page)
- [x] Internal links (between pages), external links (GitHub, LinkedIn) and `mailto:` links
- [x] External CSS: colors, fonts, spacing, borders, **flexbox & grid**, hover effects,
      transitions, keyframe animations, responsive breakpoints
- [x] JavaScript animations: **typing effect**, **hover effects**, **animated background**,
      **animated skill bars**, **scroll reveals**
- [x] Projects: each lists title, description, problem solved, technologies, image and GitHub link
- [x] Responsive design for mobile, tablet and desktop
- [x] Respects `prefers-reduced-motion` for accessibility

## Animation & Interaction Techniques Used

Beyond the five required concepts (demonstrated live on `animations.html`),
the site uses hand-written motion throughout:

1. **Typing effect** — phrases live in a `data-typing` attribute; JavaScript types,
   holds, deletes and cycles (`js/script.js`).
2. **Hover effects** — CSS `:hover` + `transition`: index rows wipe to ink, cards
   lift, logos de-grayscale, underline slides.
3. **Animated background** — a hairline grid drifts via `background-position`
   keyframes; lime pulses orbit on an `@keyframes orbit` path.
4. **Animated skill bars** — bars fill to their `data-skill` percentage when
   scrolled into view (`IntersectionObserver` + CSS transition).
5. **Scroll reveals** — `.reveal` elements fade/rise via one `IntersectionObserver`,
   staggered with a `--d` CSS variable.
6. **Char-split headings** — giant headlines are split into `<span class="ch">`
   letters that rise into place with a per-character delay.
7. **Infinite marquee** — a duplicated track translated -50% on a loop.
8. **Custom cursor** — a dot tracks the pointer; a ring trails it with lerp easing
   and grows over interactive elements (desktop only).
9. **Cursor-following project preview** — hovering a project row makes its image
   trail the cursor.
10. **Magnetic buttons** — buttons lean toward the cursor and spring back.
11. **Expandable project rows** — accordion via `grid-template-rows: 0fr → 1fr`.
12. **Fullscreen mobile menu** — links stagger up inside a dark overlay.

## How to Run Locally

Just open `index.html` in any browser — no server or installation required.

Or serve it locally (recommended, mirrors GitHub Pages):

```bash
cd PersonalPortfolio
python3 -m http.server 8000
# then visit http://localhost:8000
```

## How to Publish on GitHub Pages

1. Create a new public repository on GitHub named **`personal-portfolio`**.
2. Upload/push everything inside this `PersonalPortfolio/` folder to that repository
   (so `index.html` sits at the repository root).
3. In the repository: **Settings → Pages**.
4. Under *Source*, choose **Deploy from a branch**, select **main** and **/(root)**, then Save.
5. Wait 1–2 minutes — the site goes live at
   `https://<your-username>.github.io/personal-portfolio/`.

## Customisation Notes

- Replace the placeholder project screenshots (`images/*.jpg`) with real captures.
- Each project card's GitHub button currently points to my GitHub profile —
  swap in each project's own repository URL as those repositories are published
  (each is marked with a `<!-- TODO -->` comment in `projects.html`).
- Colors and fonts are defined once as CSS variables at the top of `css/style.css`.
- Fonts are loaded from Google Fonts (Inter Tight + Space Mono) with system
  fallbacks — the site still renders fine offline.
