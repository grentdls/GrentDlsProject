# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are game studios, hiring managers, producers, and collaborators evaluating Shi Zechang's game design, combat design, systems design, and technical design work.

## Product Purpose

This is a living portfolio and resume site for showing real game projects, design documents, production experience, contact details, and playable or downloadable evidence. Success means a visitor can understand the designer's focus quickly, inspect evidence, and reach him without friction.

## Positioning

The portfolio connects design reasoning to runnable or inspectable evidence. It is not only a project list: it shows how a combat or system decision becomes a rule, prototype, document, and player-facing result.

## Operating Context

Visitors browse the site on desktop or mobile, open project archives, search document catalogs, read Markdown evidence, download the resume, and use selected playable builds or interactive prototypes.

## Capabilities and Constraints

- Preserve the existing single-page route and anchor IDs.
- Preserve factual resume content, contact details, project names, document links, and existing project archive behavior.
- Keep the site deployable as a static Next.js export to Netlify.
- Add a lightweight browser interaction that works with pointer, keyboard, touch, and reduced-motion preferences.
- Avoid inventing employment claims, project metrics, or downloadable builds.

## Brand Commitments

- Existing name: 游戏设计档案 / GD Game Design Archive.
- Voice: concrete, evidence-led, and focused on game design decisions.
- Existing visual assets in `public/media/` are authoritative project imagery.
- The resume PDF at `public/resume/shi-zechang-battle-designer.pdf` remains the canonical downloadable resume.

## Evidence on Hand

- `app/portfolio.tsx` contains project, timeline, capability, document, resume, and contact content.
- `public/media/` contains hero, project, and archive imagery.
- `public/data/document-catalog.json` and `public/data/documents/` contain the document archive.
- The resume PDF contains employment, education, skills, and contact information.

## Product Principles

1. Show the reasoning behind the work, not only the final surface.
2. Keep the first visit legible for a recruiter scanning under time pressure.
3. Let experiments be playable without hiding the portfolio's evidence.
4. Make every interaction reversible, keyboard-accessible, and mobile-aware.

## Accessibility & Inclusion

The web surface must support keyboard focus, visible focus states, touch input, readable contrast, semantic labels, and `prefers-reduced-motion` fallbacks.
