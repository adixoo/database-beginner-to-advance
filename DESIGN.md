# Pastel Noir Motion

Grayscale dark, pastel accents, and a hand that points.

A design system for explainer videos on YouTube (16:9) and Instagram (Reels 9:16, feed 4:5), built to be animated with Claude Motion. Scenes sit on a near-black grayscale ladder; six soft pastels carry meaning; DM Sans does the talking, JetBrains Mono shows the code, and Caveat is the presenter's handwriting: it only ever appears next to a hand-drawn arrow, pointing at the thing that matters.

## Using it in Claude Motion

Ask for a video "in the Pastel Noir Motion design system". Every value lives in `tokens.json` (and the generated `tokens.css`): colours, type styles, spacing, radii, plus `duration`, `easing` and `canvas` families for timing and frame sizes. `components/bundle.css` holds the shared helpers (chip, key, hand-drawn stroke, row/wash/draw/write keyframes). Sizes are real pixels on a 1920×1080 frame; see **Formats** for vertical.

## Principles

1. **Gray does the structure, colour does the meaning.** Layout, cards and tables are built from `gray-950` → `gray-100`. A pastel appears only when it says something: winner, warning, step 2, a keyword.
2. **One point per scene.** If the viewer should look at one row, one line or one number, that thing gets the accent, the wash and the arrow. Everything else steps back to `ink-soft`.
3. **The hand points, the type explains.** Caveat notes are short, lowercase, conversational asides with an arrow. Never use Caveat for titles, data or anything the viewer must read precisely.
4. **Calm motion.** Things arrive with `ease-enter`, hold long enough to read, and leave faster than they came. No bouncing text, no spinning.

## Colour

**Grayscale ladder (structure).** `canvas` (`gray-950` #0a0a0b) is every frame's background. Step up one shade per layer: `surface` (`gray-900`) for cards, tables and code windows, `raised` (`gray-850`) for table headers and chips, `gray-800` for zebra rows. `hairline` (`gray-700`) draws every 2px rule. Never skip more than one step between a fill and the fill it sits on; rules and borders (`hairline`, `gray-600`) are exempt.

**Ink.** `ink` (`gray-100`) for titles and the key figures, `ink-soft` (`gray-300`) for everything secondary, `ink-muted` (`gray-400`) for captions, units and code comments. `gray-500` is decorative only (code line numbers, grid dots, guides): it fails text contrast, so never set words in it.

**Pastel accents (meaning).**

| Token | Hex | Means |
|---|---|---|
| `peach` | #ffb3a1 | Chapter eyebrows, numbers in code, first chart series |
| `butter` | #f5e1a4 | Annotation ink (`annotate`), caution |
| `mint` | #a6e3c4 | Good, winner, `positive`, strings |
| `sky` | #a9c9ff | Neutral info, functions, step 1 |
| `lilac` | #cbb6ff | Keywords, highlighted code line |
| `rose` | #f6a8c6 | Bad, slow, `negative` |

Every accent is 10:1 or better on the canvas (rose is the lowest at 10.7:1) and stays above 9.5:1 on `surface` and `raised`. Each has a `-wash` (14% alpha) for highlighted rows, code lines and marker swipes; on a wash keep `ink` or the same accent as text. On a solid pastel fill, text is `on-accent` (`gray-950`).

Rules: at most **three accents in a scene** (plus `annotate`). Syntax colours inside a CodeBlock and the badges of a StepFlow are exempt: they are one system, not separate points. `positive` and `negative` always travel with a glyph (▲ ▼ + −), never colour alone. No gradients: depth comes from the gray steps.

## Typography

| Family | Role | Styles |
|---|---|---|
| DM Sans | Everything spoken: titles, body, tables, stats | `display-xl` 168 → `eyebrow` / `table-head` 20, `stat` 144 |
| Caveat | Annotations beside an arrow, nothing else | `note-xl` 72, `note-lg` 56, `note` 44, `note-sm` 34 |
| JetBrains Mono | Code, file names, keys, step numbers | `code-lg` 30, `code` 24, `code-sm` 20, `code-label` 18 |

- Titles are sentence case: "How caching actually works". `eyebrow` and `table-head` are uppercase with wide tracking.
- `body` (28px) is the smallest running text on a 1080p frame; `caption` (22px) only for sources and units; `eyebrow` and `table-head` (20px) only for short uppercase labels.
- Numbers in tables and stats use `font-variant-numeric: tabular-nums` (`.pn-tnum`) so count-ups don't jitter.
- Caveat is lowercase and short (≤ 28 characters a line, two lines max). Notes are `annotate`-coloured; the only exception is a quieter `note-sm` aside, which may use `ink-muted`.

## Tables

Tables are the system's home turf (see the **DataTable** component).

- Frame: `surface` fill, 2px `hairline` inset border, `radius-sm`. Header row on `raised`, `table-head` in `ink-muted`.
- Rows are 96px tall at 1080p with `space-3` side padding and 2px `hairline` rules. Max 6 rows and 5 columns on 16:9, 4 columns on 9:16.
- Text cells in `table-cell`/`ink-soft`; figures in `table-figure`, tabular. A 14px status dot (`positive` / `caution` / `negative`) may lead a value.
- The row that matters gets an accent `-wash` swiped in behind it, its label in the accent at 600 weight, and one Caveat note with an arrow ending 16–24px outside the table.

## Annotations

The signature gesture: **target → arrow → note → hold.**

- Arrows are single strokes, 6px at 1080p, `annotate`, round caps and joins, with a two-stroke open head. Always curved a little; never a perfect straight line, never a filled triangle.
- The arrow starts at the note and ends 16–24px short of the target. It never crosses text.
- One annotation per scene, two at most (then both arrive in sequence, not together).
- Scribble underline for a payoff word; scribble circle around a single number. Ready-made marks live in **Assets › Annotation**.

## Code

Editor window on `surface` with a `raised` tab bar (three `gray-600` dots, the file name in `code-label`). Line numbers `gray-500`, right-aligned. Syntax: `code-keyword` lilac, `code-fn` sky, `code-string` mint, `code-number` peach, `code-comment` gray-400, `code-punct` gray-300, identifiers `ink`. The line under discussion gets `lilac-wash` with `radius-xs`. Keep to 8 lines at `code-lg`, 16 at `code`.

## Iconography

No icon font. Meaning comes from colour plus a few text glyphs (▲ ▼ → + − ×) set in the surrounding type, from numbered mono badges, and from the hand-drawn marks in `assets/Annotation`. If a scene needs a pictogram, draw it as a 6px single-weight stroke in `ink-soft` to match the annotation hand.

## Voice

Plain, short and specific. Titles state the idea ("Merge sort never has a bad day"), not the topic ("Sorting algorithms"). Numbers always carry units ("840ms", "18 GB"). Caveat notes sound like the presenter leaning in: "this is what users actually feel", "no bad days", lowercase, no full stop.

## Token reference

Values are px on a 1920×1080 frame (they also fit the 1080-wide vertical canvases). Aliases in braces point at another token.

### Colour

| Token | Value | Usage |
|---|---|---|
| `gray-950` | `#0a0a0b` | Canvas. The frame background of every scene, YouTube and Instagram alike. |
| `gray-900` | `#111113` | Surface: cards, code windows, table body. One step up from the canvas. |
| `gray-850` | `#18181b` | Raised: table header row, chips at rest, lower-third bar. |
| `gray-800` | `#212125` | Zebra rows in tables and hovered/active rows before an accent takes over. |
| `gray-700` | `#2e2e33` | Hairline: table row rules, card borders, dividers. 2px at 1080p. |
| `gray-600` | `#45454c` | Strong border and inactive step connectors. Non-text only. |
| `gray-500` | `#6b6b73` | Decorative only: code line numbers, grid dots, safe-zone guides. Fails 4.5:1 as text (3.6:1 on surface), never put words in it. |
| `gray-400` | `#93939b` | Muted text: captions, table units, code comments. 6.2:1 on gray-900. |
| `gray-300` | `#bdbdc4` | Secondary text: subtitles, table cells that are not the point. 10:1 on gray-900. |
| `gray-100` | `#ededf0` | Primary ink: titles, body, key figures. 16:1 on gray-900. |
| `peach` | `#ffb3a1` | Warm accent. Chapter eyebrows, numbers in code, the first series in a chart. |
| `butter` | `#f5e1a4` | Annotation ink: every Caveat note, hand-drawn arrow and scribble. Also caution. |
| `mint` | `#a6e3c4` | Good / winner / string literals. The row the viewer should pick. |
| `sky` | `#a9c9ff` | Neutral info accent: function names, step 1 of a flow, links. |
| `lilac` | `#cbb6ff` | Keywords in code, highlighted code lines, secondary series. |
| `rose` | `#f6a8c6` | Bad / slow / negative delta. Always pair with a ▼ or a minus sign, never colour alone. |
| `peach-wash` | `#ffb3a124` | 14% peach over the canvas: highlighted table rows, code-line highlights, marker swipes. Keep ink text (gray-100) or peach text on it. |
| `butter-wash` | `#f5e1a424` | 14% butter over the canvas: highlighted table rows, code-line highlights, marker swipes. Keep ink text (gray-100) or butter text on it. |
| `mint-wash` | `#a6e3c424` | 14% mint over the canvas: highlighted table rows, code-line highlights, marker swipes. Keep ink text (gray-100) or mint text on it. |
| `sky-wash` | `#a9c9ff24` | 14% sky over the canvas: highlighted table rows, code-line highlights, marker swipes. Keep ink text (gray-100) or sky text on it. |
| `lilac-wash` | `#cbb6ff24` | 14% lilac over the canvas: highlighted table rows, code-line highlights, marker swipes. Keep ink text (gray-100) or lilac text on it. |
| `rose-wash` | `#f6a8c624` | 14% rose over the canvas: highlighted table rows, code-line highlights, marker swipes. Keep ink text (gray-100) or rose text on it. |
| `canvas` | `{gray-950}` | Alias: scene background. |
| `surface` | `{gray-900}` | Alias: card and code-window fill. |
| `raised` | `{gray-850}` | Alias: table header, chips, lower-third bar. |
| `hairline` | `{gray-700}` | Alias: every 2px rule and border. |
| `ink` | `{gray-100}` | Alias: primary text. |
| `ink-body` | `#d0d0d6` | Website only: running text (paragraphs, lists), a step softer than `ink` so long reading doesn't glare. 12.9:1 on gray-950. Headings stay `ink`. |
| `ink-soft` | `{gray-300}` | Alias: secondary text. |
| `ink-muted` | `{gray-400}` | Alias: captions, units, comments. |
| `on-accent` | `{gray-950}` | Text on a solid pastel fill (chips, step badges). 10.7:1 or better on every accent. |
| `annotate` | `{butter}` | Caveat notes, arrows, scribbles. One annotation colour per scene keeps the hand consistent. |
| `positive` | `{mint}` | Up / good / winner. Pair with ▲ or +. |
| `negative` | `{rose}` | Down / bad / loser. Pair with ▼ or −. |
| `caution` | `{butter}` | Trade-offs and 'it depends' cells. |
| `code-keyword` | `{lilac}` | const, async, return, if. |
| `code-string` | `{mint}` | String and template literals. |
| `code-number` | `{peach}` | Numbers and booleans. |
| `code-fn` | `{sky}` | Function and method names. |
| `code-comment` | `{gray-400}` | Comments. Muted but readable at 6.2:1. |
| `code-punct` | `{gray-300}` | Brackets, operators, punctuation. |

### Typography

Font stacks:

- `--font-sans`: `"DM Sans", system-ui, sans-serif`
- `--font-hand`: `Caveat, "Segoe Print", "Bradley Hand", cursive`
- `--font-mono`: `"JetBrains Mono", ui-monospace, Menlo, monospace`

| Style | Group (family) | Size | Line height | Weight | Tracking | Usage |
|---|---|---|---|---|---|---|
| `display-xl` | Display (sans) | 168px | 0.92 | 700 | -0.045em | One idea per scene. Hero word or number on a title card. Max 2 lines at 1920. |
| `display` | Display (sans) | 120px | 0.95 | 700 | -0.035em | Chapter titles. |
| `title` | Display (sans) | 80px | 1.0 | 600 | -0.025em | Scene titles above a table or diagram. |
| `heading` | Display (sans) | 56px | 1.1 | 600 | -0.015em | Card and panel headings. |
| `subhead` | Display (sans) | 40px | 1.25 | 500 | -0.01em | Subtitles under a title, in ink-soft. |
| `body-lg` | Text (sans) | 34px | 1.4 | 400 | 0em | Explainer sentences on screen. Max ~45 characters a line. |
| `body` | Text (sans) | 28px | 1.45 | 400 | 0em | Step descriptions, card body. The smallest running text on a 1080p frame. |
| `caption` | Text (sans) | 22px | 1.35 | 500 | 0.01em | Sources, footnotes, axis labels, in ink-muted. |
| `eyebrow` | Text (sans) | 20px | 1.2 | 600 | 0.14em | Set in uppercase. Chapter labels and section kickers, usually in an accent. |
| `table-head` | Table (sans) | 20px | 1.2 | 600 | 0.08em | Column headers, uppercase, ink-muted on raised. |
| `table-cell` | Table (sans) | 28px | 1.25 | 400 | 0em | Row labels and text cells. |
| `table-figure` | Table (sans) | 30px | 1.2 | 600 | -0.01em | Numbers in cells. Turn on tabular figures (font-variant-numeric: tabular-nums) so columns align while counting up. |
| `stat` | Table (sans) | 144px | 0.9 | 700 | -0.04em | The one big number in a stat callout, in an accent. |
| `note-xl` | Annotation (hand) | 72px | 1.0 | 700 | 0em | One-word shouts next to an arrow. |
| `note-lg` | Annotation (hand) | 56px | 1.05 | 600 | 0em | Default annotation beside a table row or chart point. |
| `note` | Annotation (hand) | 44px | 1.1 | 500 | 0em | Notes on code and diagrams. Max ~28 characters a line. |
| `note-sm` | Annotation (hand) | 34px | 1.15 | 500 | 0em | Asides and footnote-style quips. Smallest Caveat size: below this it stops reading. |
| `code-lg` | Code (mono) | 30px | 1.55 | 400 | 0em | Code that is the subject of the scene, 8 lines max. |
| `code` | Code (mono) | 24px | 1.6 | 400 | 0em | Default code block, up to 16 lines. |
| `code-sm` | Code (mono) | 20px | 1.55 | 400 | 0em | Line numbers, terminal output, dense listings. |
| `code-label` | Code (mono) | 18px | 1.2 | 500 | 0.04em | File-name tabs, keyboard keys, step numbers. |

### Spacing

8px base on the 1920×1080 canvas. On 1080-wide vertical canvases use the same tokens; they are already sized for the 1080 short side.

| Token | Value | Usage |
|---|---|---|
| `space-1` | `8px` | Icon-to-label gap, chip inner gap. |
| `space-2` | `16px` | Keyboard-key padding-x, gap between a figure and its unit. |
| `space-3` | `24px` | Table cell padding-x, code block line gap, chip padding-x. |
| `space-4` | `32px` | Small-card padding, gap between title and subtitle. |
| `space-6` | `48px` | Panel padding (StatCallout, StepFlow cards); gap between stacked cards. |
| `space-8` | `64px` | Gap between a scene title and its table or diagram. |
| `space-12` | `96px` | YouTube action-safe inset left and right. |
| `space-16` | `128px` | Hero breathing room around a single stat or title. |

### Radius

| Token | Value | Usage |
|---|---|---|
| `radius-xs` | `6px` | Code-line highlights, keyboard keys. |
| `radius-sm` | `12px` | Table outer frame, small cards. |
| `radius-md` | `20px` | Cards, code windows, stat panels. |
| `radius-lg` | `32px` | Hero panels, vertical-format cards. |
| `radius-pill` | `999px` | Chips, step badges, lower-third accent tick. |

### Shadow

| Token | Value | Usage |
|---|---|---|
| `shadow-lift` | `0 32px 80px #000000a6` | A card that moves in over the canvas. Shadows barely read on dark, so depth comes mostly from the surface steps. |
| `shadow-ring` | `0 0 0 2px #ededf01f` | Focus ring around the element the voice-over is talking about. |

### Duration

Milliseconds. At 30 fps one frame is ~33ms; at 60 fps ~17ms.

| Token | Value | Usage |
|---|---|---|
| `dur-instant` | `100ms` | 3 frames @30. Colour flips, a cell value swapping. |
| `dur-quick` | `200ms` | 6 frames. Chips popping in, hover-style emphasis. |
| `dur-base` | `400ms` | 12 frames. Default enter for text, rows and cards. |
| `dur-slow` | `700ms` | 21 frames. Wash swipes across a row, camera pushes. |
| `dur-draw` | `600ms` | 18 frames. A hand-drawn arrow drawing on (stroke-dashoffset). |
| `dur-write` | `800ms` | 24 frames. Caveat note revealing left to right after its arrow. |
| `dur-scene` | `1200ms` | 36 frames. Scene-to-scene transition total. |
| `dur-hold` | `2500ms` | Minimum time a finished annotation stays still before anything else moves. |
| `stagger-row` | `70ms` | Delay between table rows, list items, steps. |
| `stagger-char` | `28ms` | Per character when typing code on (≈ 35 chars/second; render at 60 fps). |

### Easing

| Token | Value | Usage |
|---|---|---|
| `ease-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | Everything arriving: rows, titles, cards. Fast out, soft landing. |
| `ease-move` | `cubic-bezier(0.65, 0, 0.35, 1)` | Things already on screen moving or resizing: re-sorting rows, wash swipes, camera moves. |
| `ease-exit` | `cubic-bezier(0.7, 0, 0.84, 0)` | Leaving. Exits run at ~70% of the enter duration. |
| `ease-pop` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Chips, badges, step numbers. Small overshoot; never on text blocks. |
| `ease-draw` | `cubic-bezier(0.45, 0, 0.2, 1)` | Arrow and scribble strokes, so the pen starts deliberately and flicks off. |

### Canvas

Frame sizes and safe zones for YouTube and Instagram.

| Token | Value | Usage |
|---|---|---|
| `yt-width` | `1920px` | YouTube 16:9 landscape width. |
| `yt-height` | `1080px` | YouTube 16:9 landscape height. |
| `yt-safe-x` | `96px` | Keep text 96px from left and right edges on 16:9. |
| `yt-safe-y` | `64px` | Keep text 64px from top; 120px from bottom to clear the player scrubber when paused. |
| `reel-width` | `1080px` | Reels, Shorts, Stories 9:16 width. |
| `reel-height` | `1920px` | Reels, Shorts, Stories 9:16 height. |
| `reel-safe-top` | `250px` | Clear of the account name and audio label. |
| `reel-safe-bottom` | `420px` | Clear of caption, buttons and progress bar. |
| `reel-safe-x` | `72px` | Left inset; keep 160px on the right to clear the like/comment rail. |
| `feed-height` | `1350px` | Instagram 4:5 feed post at 1080 wide. |
| `frame-rate` | `30` | Default fps. Use 60 only for code typing or fast data scrubs. |

## Motion

Timing and easing are tokens (`duration`, `easing` families) so every scene moves the same way. Default frame rate is 30 fps (`frame-rate`).

### Durations

| Token | ms | @30fps | Use |
|---|---|---|---|
| `dur-instant` | 100 | 3 | Colour flips, a value swapping |
| `dur-quick` | 200 | 6 | Chips and badges popping in |
| `dur-base` | 400 | 12 | Default enter for text, rows, cards |
| `dur-slow` | 700 | 21 | Wash swipes, camera pushes |
| `dur-draw` | 600 | 18 | Arrow or scribble drawing on |
| `dur-write` | 800 | 24 | Caveat note revealing |
| `dur-scene` | 1200 | 36 | Whole scene transition |
| `dur-hold` | 2500 | 75 | Minimum stillness after an annotation lands |
| `stagger-row` | 70 | ~2 | Between rows, list items, steps |
| `stagger-char` | 28 | ~1 | Per character when typing code (≈ 1.7 frames @60) |

Exits run at about 70% of their enter duration with `ease-exit`.

### Easing

- `ease-enter` cubic-bezier(0.16, 1, 0.3, 1): anything arriving.
- `ease-move` cubic-bezier(0.65, 0, 0.35, 1): things already on screen moving, re-sorting, washes.
- `ease-exit` cubic-bezier(0.7, 0, 0.84, 0): leaving.
- `ease-pop` cubic-bezier(0.34, 1.56, 0.64, 1): chips, badges, step numbers only. Never on text blocks.
- `ease-draw` cubic-bezier(0.45, 0, 0.2, 1): pen strokes.

### Choreography recipes

**Title card.** Eyebrow chip pops (`dur-quick`, `ease-pop`) → display title rises 24px and fades (`dur-base`, `ease-enter`) → subtitle follows one `stagger-row` later → topic chips stagger in. Hold, then everything exits together.

**Table reveal.** Title in → header row → body rows rise 24px and fade, `stagger-row` apart → hold one beat → the winner row's wash swipes left to right (`dur-slow`, `ease-move`, `transform-origin: left`) and its label turns accent → arrow draws (`dur-draw`) → Caveat note writes (`dur-write`) → hold ≥ `dur-hold`.

**Annotation.** Target settles first; nothing moves while the arrow draws. Arrow: give the path `pathLength="1"`, `stroke-dasharray: 1`, animate `stroke-dashoffset` 1 → 0 with `ease-draw`. Note: once the arrow has finished, animate `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` linearly so it reads like writing. Then hold.

**Code.** Window fades up (`dur-base`). Either type characters at `stagger-char` (render at 60 fps), or reveal line by line at `stagger-row` for longer listings. Highlight wash fades in on the discussed line (`dur-quick`) before its annotation draws.

**Stat.** Panel enters, then the number counts up over `dur-slow` with `ease-enter` (tabular figures), then the delta line fades in with its ▲/▼.

**Scene transition.** `dur-scene` (1200ms) in total: outgoing content exits (`ease-exit`, ~280ms), a 120ms beat of empty canvas, then incoming content enters over the remaining ~800ms (`dur-base` plus its `stagger-row` offsets). No wipes, spins or zoom blurs.

### Don'ts

No bounce on anything but chips, badges and step numbers. Never animate two annotations at once. Don't move the camera while an arrow is drawing. Respect reduced motion in web previews: show final states.

## Formats

All tokens are sized for a 1080px short side, so the same values work on every canvas below; only layout changes.

| Canvas | Size | Safe text area |
|---|---|---|
| YouTube 16:9 | `yt-width` × `yt-height` = 1920×1080 | 96px sides (`yt-safe-x`), 64px top (`yt-safe-y`), 120px bottom for the player scrubber |
| Reels / Shorts / Stories 9:16 | `reel-width` × `reel-height` = 1080×1920 | 250px top (`reel-safe-top`), 420px bottom (`reel-safe-bottom`), 72px left (`reel-safe-x`), 160px right for the like/comment rail |
| Instagram feed 4:5 | 1080 × `feed-height` = 1080×1350 | 64px all round |

### Adapting a 16:9 scene to 9:16

- Stack, don't shrink: side-by-side panels become a vertical stack with `space-6` gaps; step flows run top to bottom with downward connectors.
- Tables drop to 4 columns max; move the least important column to a caption or cut it. Keep 96px rows.
- Titles step down one size when they would break into three lines (`display` → `title`).
- Annotations sit below or above their target rather than beside it; use the down arrow mark.
- Everything important lives in the middle band (y 250–1500). Lower thirds become an upper-middle name card, since the bottom 420px is covered.
- Hold times run ~20% longer on vertical: viewers read on smaller screens.

### Feed 4:5

Treat as a single still or a short loop: one title, one table or stat, one annotation. Cover image for a Reel should still work when cropped to the centre 1080×1350.

## Components

### TitleCard

Chapter opener: wash chip, display title, subtitle, topic chips and a mono chapter counter.

- **Consumer provides:** chapter label, a title of ≤ 2 lines, a one-line subtitle, up to 3 topic chips, and "NN / NN".
- Chip `peach-wash` + `peach` text; title `display` (or `display-xl` for one word); subtitle `subhead` in `ink-soft`; counter `code-label` in `ink-muted` at the bottom-right safe corner.
- Left-aligned at `yt-safe-x`; vertically centred-ish, never centred text.
- **Motion:** chip pops (`ease-pop`), title, subtitle and chips rise at `stagger-row` with `ease-enter`.

### DataTable

Comparison table built for a 1920×1080 frame, with one winning row washed in an accent and pointed at by a Caveat note.

- **Consumer provides:** a title (`title`), optional `eyebrow`, up to 6 rows × 5 columns (4 on 9:16), which row wins, and a note of ≤ 2 short lines.
- **Frame:** `surface`, 2px `hairline` inset, `radius-sm`; header on `raised` with `table-head` in `ink-muted`; rows 96px with `space-3` side padding and 2px `hairline` rules.
- **Cells:** labels `table-cell` / `ink-soft`; values `table-figure` with `.pn-tnum`. Optional 14px status dot: `positive`, `caution`, `negative`; the value text still carries the meaning.
- **Winner:** `{accent}-wash` inset 10px × 12px, `radius-xs`; label in the accent at 600.
- **Motion:** header then rows rise 24px at `stagger-row` (`ease-enter`), wash swipes (`dur-slow`, `ease-move`), arrow draws, note writes, hold `dur-hold`.
- Don't: zebra stripes *and* a wash in one table; more than one washed row; colour-only cells.

### StatCallout

One big number per panel, up to three panels side by side on 16:9 (stacked on 9:16).

- **Consumer provides:** the figure with its unit, a one-line label, and an optional delta.
- Panel: `surface`, `radius-md`, 2px `hairline` inset, `space-6` padding. Kicker `eyebrow` in `ink-muted`; figure `stat` (144px) in one accent; label `subhead`; delta `body` in `positive` (▲) or `negative` (▼), or `ink-muted` for context.
- Each panel gets a different accent only if the numbers are unrelated; related numbers share one.
- **Motion:** panels stagger in, figure counts up over `dur-slow` with tabular figures, delta fades in last.

### Annotation

The system's signature: a Caveat note and a hand-drawn arrow pointing at the one thing the viewer should look at.

- **Consumer provides:** the target element, a note of ≤ 28 characters a line (two lines max), and which side the note sits on.
- Note: `note-lg` (default) or `note-xl` for a one-word shout, colour `annotate`; an optional aside in `note-sm` / `ink-muted`.
- Arrow: 6px `.pn-stroke`, starts at the note, ends 16–24px short of the target, curved, two-stroke open head. Use a mark from Assets › Annotation or draw your own in the same hand. A scribble circle may wrap a single number.
- **Order:** target settles → arrow draws (`dur-draw`, `ease-draw`) → note writes (`dur-write`, linear clip) → hold ≥ `dur-hold`.
- One per scene (two in sequence at most). Never over the target's text; never in Caveat for data.

### Highlight

Inline emphasis inside a title or sentence: marker wash, scribble underline, or a solid tag.

- **Wash** (`{accent}-wash`, `radius-xs`, extends 12px either side) behind a phrase; the phrase turns the accent. Swipes in left→right over `dur-slow`, `ease-move`.
- **Scribble underline** in `annotate`, drawn on with `dur-draw`; for the payoff word.
- **Solid tag** (accent fill, `on-accent` text) for one or two words only.
- At most two marks per sentence, and only one kind of wash colour.

### CodeBlock

Editor window for code on screen, in JetBrains Mono, with one highlighted line and an optional annotation.

- **Consumer provides:** the file name, ≤ 8 lines at `code-lg` (≤ 16 at `code`), and the line under discussion.
- Window: `surface`, `radius-md`, 2px `hairline`; tab bar on `raised` with three 14px `gray-600` dots and `code-label` file name in `ink-soft`.
- Gutter: line numbers `gray-500`, right-aligned, 56px. Highlighted line: `lilac-wash`, `radius-xs`, inset 12px.
- Syntax: `code-keyword`, `code-fn`, `code-string`, `code-number`, `code-comment`, `code-punct`; identifiers `ink`. Syntax colours don't count towards the scene's three-accent limit.
- **Motion:** window fades up `dur-base`; type at `stagger-char` or reveal lines at `stagger-row`; highlight fades in `dur-quick`; then the annotation.

### StepFlow

Numbered steps joined by connectors, for processes and request flows.

- **Consumer provides:** 2–4 steps, each a short heading and ≤ 2 lines of body.
- Card: `surface`, `radius-md`, 2px `hairline`, `space-6` padding. Badge: 56px pill in the step's accent with a mono number in `on-accent`. Heading `heading`, body `body` / `ink-soft`.
- Connectors: 4px `gray-600` strokes with an open chevron, not the hand-drawn arrow (that is reserved for annotations).
- Accents run in a fixed order: `sky`, `butter`, `mint`, `lilac`. Step badges don't count towards the scene's three-accent limit.
- **Motion:** card, connector, card, connector… at `stagger-row` × 2; on 9:16 stack vertically with downward connectors.

### LowerThird

Speaker or source bar for YouTube, sitting on the 120px bottom safe line.

- **Consumer provides:** name, one-line role or context, optional initials or photo, optional chip.
- Bar: `raised`, `radius-md`, 2px `hairline`; 88px avatar disc (accent fill, `on-accent` initials); name at 44px DM Sans 600, role `body` in `ink-soft`; optional wash chip.
- On 9:16 move it to the upper-middle band (the bottom 420px is covered by platform UI).
- **Motion:** slides up 24px and fades in `dur-base`, holds ≥ 4s, exits `ease-exit`.

### Chip

Pill labels for chapters, topics and states, plus keyboard keys.

- **Solid** (`.pn-chip--solid`): accent fill, `on-accent` text — one per scene at most.
- **Wash** (`.pn-chip--wash`): `{accent}-wash` fill, accent text — the default.
- **Outline** (`.pn-chip--outline`): 2px `hairline` inset, `ink-soft` text — neutral.
- **Key** (`.pn-key`): `raised`, `radius-xs`, mono 18px, for shortcuts.
- 48px tall, `space-3` side padding, `radius-pill`, 20px DM Sans 600 uppercase with 0.1em tracking (`.pn-chip`). Set the accent with `--accent` and `--accent-wash` (peach by default). Pops in with `dur-quick`, `ease-pop`.

### SafeZones

Reference for the three canvases and where platform UI covers them.

- Mint dashes mark the text-safe area; rose wash marks areas covered by player or app UI.
- YouTube 1920×1080: 96px sides, 64px top, 120px bottom. Reels/Shorts 1080×1920: 250px top, 420px bottom, 72px left, 160px right rail. Feed 1080×1350: 64px all round.
- Frame sizes and the main insets are tokens in the `canvas` family; the 120px YouTube bottom, 160px Reels right rail and 64px feed inset are fixed values documented in their token descriptions and in Formats.

## Annotation marks

Hand-drawn strokes for the target → arrow → note gesture. Each is a single-weight SVG: stroke `#f5e1a4` (the `butter` / `annotate` token), width 6 at 1080p, round caps and joins, no fill. The ink is baked in; to recolour, change the `stroke` attribute (keep annotations butter unless a scene has a reason).

- `arrow-curve.svg` — default; note below-left, target up-right. Flip horizontally for the other side.
- `arrow-loop.svg` — playful loop for a single big reveal; use sparingly.
- `arrow-straight.svg` — near-straight with a slight wobble, for code lines and table rows.
- `arrow-down.svg` — vertical formats: note above, target below.
- `scribble-underline.svg` — double underline for the payoff word.
- `scribble-circle.svg` — loose open circle around one number.

To animate, inline the SVG, add `pathLength="1"` to each path, and animate `stroke-dashoffset` from 1 to 0 over `dur-draw` with `ease-draw`.

**arrow-curve.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160" width="320" height="160"><g fill="none" stroke="#f5e1a4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 140 C 60 60, 150 22, 286 40"/><path d="M286 40 l-31 13 M286 40 l-27 -21"/></g></svg>
```

**arrow-straight.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" width="300" height="80"><g fill="none" stroke="#f5e1a4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 46 C 90 38, 180 44, 280 36"/><path d="M280 36 l-25 17 M280 36 l-27 -13"/></g></svg>
```

**arrow-down.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 260" width="160" height="260"><g fill="none" stroke="#f5e1a4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M60 14 C 20 80, 130 120, 96 236"/><path d="M96 236 l-8 -31 M96 236 l23 -22"/></g></svg>
```

**arrow-loop.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="360" height="200"><g fill="none" stroke="#f5e1a4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 170 C 90 170, 120 120, 110 90 C 100 55, 60 60, 70 95 C 82 135, 180 150, 330 60"/><path d="M330 60 l-17 30 M330 60 l-34 1"/></g></svg>
```

**scribble-underline.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" width="400" height="60"><g fill="none" stroke="#f5e1a4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 28 C 120 16, 260 20, 390 24"/><path d="M44 46 C 150 36, 270 38, 358 40"/></g></svg>
```

**scribble-circle.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160" width="320" height="160"><g fill="none" stroke="#f5e1a4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M170 18 C 60 14, 14 50, 22 86 C 32 132, 150 150, 240 136 C 300 126, 314 84, 292 54 C 268 22, 190 12, 120 26"/></g></svg>
```

## Shared CSS helpers

`components/bundle.css` — load after the generated token CSS.

```css
/* Pastel Noir Motion — shared helpers for previews and Motion scenes.
   Every colour, size and timing comes from tokens.css. */
html, body { margin: 0; background: var(--canvas); color: var(--ink); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
.eyebrow, .table-head { text-transform: uppercase; }
.pn-hand { font-family: var(--font-hand); color: var(--annotate); }
.pn-mono { font-family: var(--font-mono); }
.pn-tnum { font-variant-numeric: tabular-nums; }

/* Canvas fitting: a true-size stage (1920 wide) scaled to its container */
.pn-fit { position: relative; width: 100%; overflow: hidden; background: var(--canvas); }
.pn-stage { position: absolute; top: 0; left: 0; transform-origin: 0 0; background: var(--canvas); overflow: hidden; }
.pn-abs { position: absolute; }
.pn-ink-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }

/* Chips. Set --accent / --accent-wash on the chip to change its colour. */
.pn-chip { display: inline-flex; align-items: center; gap: var(--space-1); height: 48px; padding: 0 var(--space-3); border-radius: var(--radius-pill); font: 600 20px/1 var(--font-sans); letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; }
.pn-chip--wash { background: var(--accent-wash, var(--peach-wash)); color: var(--accent, var(--peach)); }
.pn-chip--solid { background: var(--accent, var(--peach)); color: var(--on-accent); }
.pn-chip--outline { box-shadow: inset 0 0 0 2px var(--hairline); color: var(--ink-soft); }
.pn-key { display: inline-flex; align-items: center; height: 40px; padding: 0 var(--space-2); border-radius: var(--radius-xs); background: var(--raised); box-shadow: inset 0 -3px 0 var(--hairline); font: 500 18px/1 var(--font-mono); color: var(--ink-soft); }

/* Hand-drawn strokes (annotation ink) */
.pn-stroke { fill: none; stroke: var(--annotate); stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }

/* Choreography loops used by the live previews.
   7s loop: rows enter 0–400ms, wash 1540–2240ms, arrow 2240–2840ms,
   note 2840–3640ms, hold to 6300ms (≥ dur-hold), exit 6300–6580ms. */
.pn-anim .a-row { animation: pn-row 7s var(--ease-enter) infinite both; animation-delay: calc(var(--i, 0) * var(--stagger-row)); }
.pn-anim .a-wash { transform-origin: 0 50%; animation: pn-wash 7s var(--ease-move) infinite both; }
.pn-anim .a-draw { stroke-dasharray: 1; animation: pn-draw 7s var(--ease-draw) infinite both; }
.pn-anim .a-write { animation: pn-write 7s linear infinite both; }
@keyframes pn-row { 0% { opacity: 0; transform: translateY(24px); } 5.7%, 90% { opacity: 1; transform: none; } 94%, 100% { opacity: 0; transform: none; } }
@keyframes pn-wash { 0%, 22% { transform: scaleX(0); } 32%, 90% { transform: scaleX(1); opacity: 1; } 94%, 100% { transform: scaleX(1); opacity: 0; } }
@keyframes pn-draw { 0%, 32% { stroke-dashoffset: 1; opacity: 1; } 40.6%, 90% { stroke-dashoffset: 0; opacity: 1; } 94%, 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes pn-write { 0%, 40.6% { clip-path: inset(0 100% 0 0); opacity: 1; } 52%, 90% { clip-path: inset(0 0 0 0); opacity: 1; } 94%, 100% { clip-path: inset(0 0 0 0); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .pn-anim * { animation: none !important; } }
```
