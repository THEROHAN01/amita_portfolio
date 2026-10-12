# Amita Hendre — Portfolio

Portfolio for Amita Hendre, Graphic & UI/UX Designer. On desktop it is a
design-file canvas: a splash screen, then a pannable, zoomable world of
artboards (Work · About Me · Contact) with Figma-style tools. Below 900px it
falls back to a single-column page.

## Stack

Next.js 16 (App Router, Cache Components, static output) · React 19 ·
TypeScript · CSS Modules · `next/font` (Archivo, Oswald) · `next/image` ·
lucide-react.

## Scripts

```bash
npm run dev        # http://localhost:3000
npm run build      # production build (route is fully static)
npm run lint
npm run typecheck
```

## How it is put together

```
src/
  app/              layout (fonts, metadata), page (composition), tokens
  content/          all copy and data — the single source of truth
  components/
    ui/             server primitives: Artboard (compound), metaAttrs, icons
    avatar/         layered 3D avatar + GazeEngine (one loop for all avatars)
    views/          Work / About / Contact artboards — Server Components
    canvas/         the client engine: Camera, reducer, chrome, markup
    splash/         opening screen (client island)
    guide/          narrating avatar (lazy, after the splash)
    mobile/         narrow-screen page (server, CSS-switched)
  lib/              framework-free: shared rAF loop, pointer tracker, curtain
```

Performance choices:

- **Server-first.** Every artboard renders on the server and is passed into
  the client canvas as a prop; no copy or image imports ship in client JS.
  Client components may import only `content/views.ts` and `content/profile.ts`.
- **No re-renders on pan/zoom.** The `Camera` writes one transform and one CSS
  variable (`--inv`) per move; selection chrome counter-scales in CSS.
- **One loop, one set of listeners.** Gaze, splash and guide subscribe to a
  shared `requestAnimationFrame` loop and a ref-counted pointer tracker.
- **Lazy where it can be.** The guide is `next/dynamic` (`ssr: false`) and
  loads after the splash; the splash unmounts entirely once dismissed.
- **Static route.** `ensureStatic = 'navigation'` fails the build if anything
  request-time sneaks onto the page.

## Editing content

Change copy, projects, roles or links in `src/content/*.ts` — the views, the
layers panel, the fit bounds and the mobile page all derive from it. To add a
LinkedIn or Instagram link, set `href`/`display` on the entry in
`src/content/contact.ts`.

The contact form and the canvas "Send to Amita" action open a pre-filled email
draft (there is no mail backend).
