# Shashwat Goyal — Portfolio

Personal developer portfolio. Built with **Next.js 16 (App Router) + TypeScript + Tailwind v4**, statically prerendered, deployed on Vercel.

## Develop

```bash
npm run dev     # http://localhost:3000
npm run build   # production build (statically prerenders /)
npm run start   # serve the production build
```

## Architecture

- `app/layout.tsx` — SEO metadata, OpenGraph/Twitter card, favicon.
- `app/page.tsx` — composes the section components and loads the animation script.
- `app/globals.css` — the full design system (tokens, glassmorphism, light/dark themes, keyframes).
- `components/*` — one component per section (Hero, Skills, Experience, Project, Stats, Contact, Dock, Backgrounds, Preloader).
- `public/anim.js` — the interactive layer (terminal typing, sweeping code background, scroll-spy dock, count-up stats, theme toggle, reveal-on-scroll). Loaded via `next/script`, so it runs after hydration without blocking first paint.

## Personalize (TODO)

| What | Where |
|---|---|
| **Domain** | `app/layout.tsx` → `const SITE = "https://…"` |
| **Resume PDF** | drop `public/resume.pdf` (dock "Resume" already links to it) |
| **Profile photo** | drop `public/avatar.jpg`, then set `#avatarimg` src in `components/Hero.tsx` |
| **"Book a call" (Cal.com)** | `components/Hero.tsx` — point the button at your `cal.com/<user>` link |
| **TravelX stack chips** | `components/Project.tsx` — confirm DB / AI / auth |

## Deploy to Vercel

```bash
# push to GitHub, then:
npx vercel        # first deploy (links project)
npx vercel --prod # production deploy
```

Or connect the GitHub repo at vercel.com and add your custom domain in the project's **Domains** settings.
