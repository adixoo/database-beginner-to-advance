# learndb

A free site for learning about databases, live at [database.adibitz.com](https://database.adibitz.com). It has two paths: **Beginner**, for people new to databases, and **Advanced**, which goes underneath SQL into storage, indexes, query execution, transactions and distributed databases. Topics are taught with SVG graphics, handwritten notes and SQL examples you can run.

Built with [Astro](https://astro.build), MDX, Tailwind CSS and a little React, and deployed on Vercel.

## Getting started

Needs Node.js 22.23.4 or later.

```sh
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

## Commands

| Command             | What it does                                         |
| :------------------ | :--------------------------------------------------- |
| `npm run dev`       | Start the dev server at `localhost:4321`             |
| `npm run build`     | Build the site into `./dist/`                        |
| `npm run preview`   | Preview the build locally                            |
| `npm run check`     | Type-check Astro, TypeScript and content             |
| `npm run lint`      | Lint with ESLint (`lint:fix` to fix what it can)     |
| `npm run format`    | Format with Prettier (`format:check` only checks)    |
| `npm run changeset` | Describe a change for the next release               |
| `npm run version`   | Turn pending changesets into a version and changelog |

## Project structure

```text
src/
├── content/topics/     One .mdx file per topic, in beginner/ or advanced/
├── content.config.ts   The topic frontmatter schema
├── config/             Site name, levels and paths (site.ts), theme colours (theme.ts)
├── pages/              Home, level and topic pages, 404, share images (og/), sitemap, robots.txt, favicons
├── layouts/            Page layouts
├── components/
│   ├── graphics/       The SVG graphics used inside topics
│   ├── markdown/       Components that replace Markdown elements (tables)
│   └── ui/             shadcn/ui components
├── scripts/            Client-side scripts: menu, topics drawer, table of contents, back to top
│   └── canvas/         The hand-drawn canvas doodles on the home page
├── lib/                Topic loading, SEO, share images, favicon generation
└── styles/global.css   Tailwind setup and design tokens
```

## Adding a topic

Create `src/content/topics/<level>/<slug>.mdx`, where `<level>` is `beginner` or `advanced`. The file name becomes the URL, `/<level>/<slug>`.

```mdx
---
title: How rows are stored
description: One sentence, used as the page's meta description.
level: advanced
order: 1
---

import RowToBytes from '@/components/graphics/RowToBytes.astro';

Your content here.

<RowToBytes />
```

`order` sets the topic's position in the sidebar, lowest first. A topic's share image is generated at build time, so it needs nothing extra.

## Graphics

Each graphic is an Astro component in `src/components/graphics/` that renders one SVG with a `<title>` and `<desc>` for screen readers. Graphics that show the same course tables read them from shared data files (`query-posts-data.ts`, `constraint-tables.ts`, `join-tables.ts`) so every picture shows the same rows. Colours, type and the hand-drawn annotation style follow [DESIGN.md](DESIGN.md).

## Releases

Versions and [CHANGELOG.md](CHANGELOG.md) are managed with [Changesets](https://github.com/changesets/changesets). Run `npm run changeset` to describe a change, then `npm run version` to apply the pending changesets.
