# EDS Best Practices Used in This Project

This file documents the Edge Delivery Services (EDS) / AEM Universal Editor conventions
applied while building the Riverstone Community Alliance demo site, and where to find
each one in this repo.

## 1. Content model: Sections → Blocks → Core Components

Every page is authored as a stack of `section`s (`models/_section.json`). Each section holds
either:
- **Core components** (Text, Title, Image, Button) — no code required, provided by the
  `core/franklin` component library.
- **Custom blocks** — reusable, self-contained components with their own markup contract,
  CSS and JS (`blocks/<name>/`).

Mixing both in the same page (see the Riverstone site's Intro section — plain Title + Text,
no block) keeps the authoring surface as light as possible: only build a block when the
default components can't express the layout or behavior needed.

## 2. Block contract: one folder, three files

Each block lives in `blocks/<blockname>/`:
- `<blockname>.js` — exports a single `decorate(block)` function that transforms the
  author-supplied DOM into its final markup. See `blocks/accordion/accordion.js` and
  `blocks/hero/hero.js` for the pattern.
- `<blockname>.css` — all selectors scoped under `.<blockname>` so blocks never leak style
  into the rest of the page (`blocks/cards/cards.css`, `blocks/accordion/accordion.css`).
- `_<blockname>.json` — the Universal Editor component definition + model + filter for that
  block, merged into the aggregate `component-*.json` files via `npm run build:json`.

The initial (author-facing) DOM structure is treated as a contract: block JS must
tolerate authors omitting or reordering fields rather than assuming the shape.

## 3. Progressive/native interactivity over custom JS

The new **Accordion** block (`blocks/accordion/`) uses native `<details>`/`<summary>`
elements instead of a hand-rolled expand/collapse widget. This gets keyboard operability,
screen-reader semantics, and print-friendly behavior for free, with `accordion.js` doing only
DOM restructuring — no click handlers, no ARIA plumbing.

## 4. CSS scoping and mobile-first responsive rules

Per `AGENTS.md`, every block's CSS is scoped to `.<blockname> ...` (never bare class names
like `.item-list`), and breakpoints are added with `min-width` media queries at the
600px/900px/1200px tiers, mobile-first. Example: `blocks/accordion/accordion.css` defines
compact padding by default and increases it at `(width >= 600px)`.

`{blockname}-container` / `{blockname}-wrapper` classes are reserved for the section/wrapper
elements EDS generates automatically and are intentionally not reused as custom class names
inside the block itself.

## 5. Linting as the enforcement mechanism

- `npm run lint:js` runs ESLint (Airbnb config) across all JS.
- `npm run lint:css` runs Stylelint (standard config) across all block and global CSS.
- `npm run build:json` regenerates the aggregate `component-definition.json`,
  `component-models.json`, `component-filters.json` from the per-block `_*.json` partials,
  and CI/lint checks that those aggregates stay in sync with the partials
  (`eslint-plugin-xwalk` rules).

Both were run and passed clean before the accordion block and its model were pushed.

## 6. Real DAM assets, no unmanaged image URLs

Every image referenced from page content is a proper DAM asset under
`/content/dam/eds-button-demo/`, imported via the asset pipeline (so AEM/EDS can generate
responsive renditions) rather than hot-linking external URLs directly into authored content.
The Hero and Card blocks reference these assets by DAM path (`image@reference` model field),
never a raw external URL.

## 7. Section-level variation over one-off CSS

The CTA section on the homepage uses the section model's built-in `style: highlight`
option (`models/_section.json`) to get a visually distinct call-to-action band, instead of
introducing a bespoke class or block just to change a background color.

## 8. When to reach for a block vs. a core component

The homepage's "One Action, Two Ways to Build It" section puts this side by side on purpose:
a plain core **Button** component (`core/franklin/components/button`) does a simple navigation
link with zero authored JS/CSS, while the **Action Button** block (`blocks/action-button/`)
wraps the same visual affordance with client-side state — a loading label, a disabled state
during the async action, and a temporary "Copied!" confirmation
(`blocks/action-button/action-button.js`).

The deciding question is always "does this click need to *do* something in the page, or just
*go* somewhere?" Navigation stays a core Button; in-page behavior (copy-to-clipboard,
add-to-cart, anything stateful) justifies the extra block. Reaching for a block by default —
even for a plain link — adds JS/CSS weight and an authoring model with no real benefit.

## 9. Editorial content stays outcome-focused, not template-y

Copy for services/programs is written to reflect the actual organization instead of using
boilerplate SaaS placeholder text — this matters for a client demo because prospective
authors and stakeholders judge blocks by how naturally they hold real content, not lorem
ipsum.
