# Welcome — and congrats on making it to the technical interview!

You’ll be building with TypeScript, Next.js (App Router), and RESTful APIs. Follow good practices, keep things typed, and lean on the provided styles/state patterns.

## Clone and run locally

```bash
git clone <REPO_URL> technical-interview
cd technical-interview
git branch <your name>
git switch <your name>
npm install
npm run dev
# visit http://localhost:3000
```

## Project scripts

- `npm run dev` — start the dev server
- `npm run lint` — lint the project
- `npm run build` — production build
- `npm run start` — run the built app

## Custom style references (cheat sheet)

Use these shared classes/tokens to keep styling consistent and avoid ad-hoc CSS:

- Containers: `hero` (top-of-page, gradient intro), `panel` (primary card for sections), `card` (small nested items like Pokemon or stats)
- Layout helpers: `responsive-grid` (auto-fit columns for cards), `table-scroll` (wrap tables to allow horizontal scroll on small screens)
- Typography accents: `eyebrow` (tiny all-caps label above headings), text utilities `text-surface-*` for consistent color ramps
- Buttons: base `btn` plus variants `btn-primary` (high emphasis), `btn-ghost` (low emphasis), `btn-link` (inline actions)
- Chips: `pill`, `pill-soft` (primary background), `pill-outline` (subtle), `pill-primary` (use on hero/actions)
- Inputs: `input` (rounded, focus ring, default padding)
- Surfaces/colors: CSS vars `--color-surface-*`, `--color-primary` and the gradient `body` background; lean on these instead of hardcoded hex values

### Quick rendered-style examples

These snippets show how the classes look when applied:

```tsx
<section className="panel">
  <p className="eyebrow">Sample Panel</p>
  <h3 className="text-surface-900">Panels + cards</h3>
  <div className="responsive-grid" style={{ marginTop: "1rem" }}>
    <article className="card">
      <span className="pill pill-soft">Tag</span>
      <p className="text-surface-500">
        Cards have soft borders and light shadow.
      </p>
      <button className="btn btn-primary" type="button">
        Primary
      </button>
    </article>
    <article className="card">
      <span className="pill pill-outline">Outline</span>
      <p className="text-surface-500">
        Outline pills and ghost buttons are low-emphasis.
      </p>
      <button className="btn btn-ghost" type="button">
        Ghost
      </button>
    </article>
  </div>
</section>
```

```tsx
<div className="hero">
  <p className="eyebrow">Hero</p>
  <h2 className="text-surface-900">Gradient hero with rounded corners</h2>
  <p className="text-surface-500">
    Use for top-of-page intros; text stays legible on the gradient background.
  </p>
  <div className="flex gap-2">
    <span className="pill pill-primary">Primary pill</span>
    <span className="pill pill-outline">Outline pill</span>
  </div>
</div>
```

```tsx
<div className="table-scroll">
  <table className="min-w-full divide-y divide-surface-200 text-sm">
    <thead className="bg-surface-50 uppercase text-xs text-surface-500">
      <tr>
        <th className="px-4 py-3 text-left">Header</th>
        <th className="px-4 py-3 text-right">Value</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-surface-100">
      <tr className="hover:bg-surface-50">
        <td className="px-4 py-3">Row</td>
        <td className="px-4 py-3 text-right">123</td>
      </tr>
    </tbody>
  </table>
</div>
```

## What to expect (very high level)

- Phase 1: fetch and troubleshoot list data, add to deck
- Phase 2: manage deck state, table/search/sort behaviors
- All state client-side; API calls proxied through Next route `/api/pokemon`
