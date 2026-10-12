# amita_portfolio

@AGENTS.md

Personal portfolio for Amita Hendre (Graphic & UI/UX Designer). Stack: **Next.js 16 (App Router, Cache Components) + React 19 + TypeScript + CSS Modules**.

The site is a design-file canvas: a splash screen, then a pannable/zoomable world of artboards (Work · About Me · Contact) with Figma-like chrome. Below 900px it falls back to a single-column page. The design hand-off lives in `Copy Form/` (git-ignored, reference only — copy what you need into `src/` or `public/`).

## Layout of `src/`

- `content/` — the single source of truth for all copy and data. Views and the layers panel are derived from it; never hard-code copy in components.
- `components/ui/` — server-safe primitives (Artboard, Frame, Pill, Avatar markup).
- `components/views/` — Server Components that render each view's artboards.
- `components/canvas/` — the one client engine (camera, tools, drawing, chrome). Camera state lives in refs and is applied imperatively; React only re-renders on discrete state changes.
- `components/splash/`, `components/guide/` — client islands, lazily loaded where possible.
- `lib/` — framework-free helpers (shared rAF loop, pointer tracker, curtain transition).

## Architecture principles

- **Server Components by default.** Add `"use client"` only at the leaf that needs state, effects, or browser APIs. Never mark a layout or page as a client component just to use one interactive widget.
- **Ship minimal JS.** Prefer static rendering; content pages should be fully static. Lazy-load heavy, below-the-fold, or interaction-only UI with `next/dynamic`.
- **Fetch on the server, in parallel.** Start independent fetches together (`Promise.all`); never create request waterfalls across `await`s or nested components.
- **Use the framework primitives:** `next/image` (explicit sizes, `priority` only on the LCP image), `next/font` (self-hosted, no layout shift), `next/link`, Metadata API for SEO.
- **Composition over configuration.** Use compound components and `children` instead of boolean-prop sprawl (see `vercel-composition-patterns`).
- **Feature-based folders.** Shared primitives in `components/ui`, section/feature components co-located with their route, pure helpers in `lib/`.
- **Performance budget:** LCP < 2.5s, INP < 200ms, CLS < 0.1 on mid-tier mobile. Check bundle impact before adding a dependency.
- **Accessibility is not optional:** semantic HTML, visible focus, keyboard reachable, `prefers-reduced-motion` respected for all animation.

## Project skills (`.claude/skills/`)

| Skill | Use when |
|---|---|
| `vercel-react-best-practices` | Writing/reviewing any React or Next.js code (waterfalls, bundle size, re-renders, RSC) |
| `vercel-composition-patterns` | Designing component APIs, compound components, context providers |
| `frontend-design` | Building or restyling UI — aesthetic direction, typography, non-generic look |
| `web-design-guidelines` | Auditing UI/UX/accessibility against Vercel's Web Interface Guidelines |
| `vercel-react-view-transitions` | Page/route transitions and shared-element animations |
| `next-bundle-optimizer` | Shrinking client bundles / slow route startup |
| `next-cache-components-*` | Adopting and tuning Cache Components |
| `next-partial-prefetching-*` | Adopting and tuning Partial Prefetching for instant navigations |
| `next-dev-loop` | Verifying a change actually works in the running dev server |

Sources (vendored, update by re-copying): `vercel-labs/agent-skills`, `vercel/next.js` `skills/`, `anthropics/skills`.

## Workflow

- Before declaring UI work done, run `npm run lint`, `npm run build`, and verify in the browser.
- Keep commits small and focused.
