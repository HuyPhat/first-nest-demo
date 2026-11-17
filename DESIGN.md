---
name: First Nest Demo
description: A plain, trustworthy web app where every screen reads as clearly as the ADRs behind it.
colors:
  paper: "oklch(0.975 0.006 255)"
  page: "oklch(1 0 0)"
  ink: "oklch(0.22 0.02 260)"
  ink-soft: "oklch(0.48 0.02 260)"
  rule: "oklch(0.89 0.008 260)"
  field-rule: "oklch(0.64 0.02 260)"
  ledger-blue: "oklch(0.45 0.13 258)"
  ledger-blue-deep: "oklch(0.39 0.13 258)"
  on-ledger-blue: "oklch(0.99 0.003 255)"
  alert-red: "oklch(0.48 0.17 25)"
  alert-wash: "oklch(0.96 0.025 25)"
typography:
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5rem"
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25rem"
  button:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: "1.5rem"
  brand:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: "1.25rem"
    letterSpacing: "-0.025em"
rounded:
  md: "6px"
spacing:
  label-gap: "6px"
  field-y: "8px"
  field-x: "12px"
  stack: "20px"
  gutter: "24px"
  section: "32px"
  page-top: "80px"
  page-bottom: "96px"
  page-width: "384px"
components:
  button-primary:
    backgroundColor: "{colors.ledger-blue}"
    textColor: "{colors.on-ledger-blue}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.ledger-blue-deep}"
  input:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  alert:
    backgroundColor: "{colors.alert-wash}"
    textColor: "{colors.alert-red}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  detail-card:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  site-header:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    typography: "{typography.brand}"
    padding: "16px 24px"
---

# Design System: First Nest Demo

## Overview

**Creative North Star: "The Open Ledger"**

The app is an open ledger: flat pages, plain rows, every entry legible at a glance. It exists to show a reviewer that a small auth flow was built deliberately, so the interface carries the same candour as the documented decisions behind it. Nothing is staged. A screen states what happened and what to do, then stops.

The voice is calm, direct and trustworthy. One narrow column of content sits on a quiet tinted page. Hierarchy comes from size, weight and spacing, never from decoration. A single blue marks the one thing you can act on, and the rest is ink on paper.

It rejects three things, all confirmed: the glossy SaaS look (gradients, glows, floating shadowed cards, big hero sections), the default auth-template look (a form centred on a grey backdrop, an invented logo, "Welcome back" copy), and the colourful-shop look (several accent colours, badges, promo banners). The system is meant to grow into a shop without becoming any of these.

**Key Characteristics:**
- Flat: depth comes from a tinted page, a white surface and a 1px rule, never from shadow.
- One accent, used for actions and focus only.
- One typeface, hierarchy by weight and size.
- A single 384px column, generous top and bottom space.
- Light and dark follow the system setting; both are first-class.

## Colors

A restrained palette: cool neutrals tinted toward one deep blue, plus a red kept for errors alone. All values are OKLCH and live as CSS variables in `web/app/globals.css`; the frontmatter holds the light values, and the dark values are listed below.

### Primary
- **Ledger Blue** (`colors.ledger-blue`): the only accent. Fills the primary button and draws the focus outline and the text selection tint (28% mixed with transparent). It never decorates. Its hover step is **Ledger Blue Deep** (`colors.ledger-blue-deep`). Text on it is **On Ledger Blue** (`colors.on-ledger-blue`).

### Neutral
- **Paper** (`colors.paper`): the page background, a cool off-white.
- **Page** (`colors.page`): raised surfaces (header, input, detail card), pure white. It lifts off Paper by tone alone.
- **Ink** (`colors.ink`): body text and headings, a blue-tinted near-black.
- **Ink Soft** (`colors.ink-soft`): secondary text such as the lede and field captions.
- **Rule** (`colors.rule`): the 1px border on non-interactive surfaces (header, detail card), and the loading skeleton fill. Deliberately faint.
- **Field Rule** (`colors.field-rule`): the 1px border of every control that takes input. A step darker than Rule, at least 3:1 against both Page and Paper (3.36 and 3.13 in light, 3.38 and 3.72 in dark).

### Semantic
- **Alert Red** (`colors.alert-red`) on **Alert Wash** (`colors.alert-wash`): error messages only.

### Dark mode (follows `prefers-color-scheme`)
Paper `oklch(0.18 0.012 260)`, Page `oklch(0.225 0.014 260)`, Ink `oklch(0.95 0.006 260)`, Ink Soft `oklch(0.72 0.015 260)`, Rule `oklch(0.33 0.015 260)`, Field Rule `oklch(0.54 0.02 260)`. Ledger Blue becomes a lighter `oklch(0.74 0.12 255)` with hover `oklch(0.8 0.11 255)`, and On Ledger Blue becomes dark `oklch(0.18 0.012 260)`. Alert Red `oklch(0.78 0.13 25)` on Alert Wash `oklch(0.27 0.05 25)`. The accent flips from dark-on-light to light-on-dark, so the button reads the same in both modes.

### Named Rules
**The One Voice Rule.** Ledger Blue is the only accent. It marks what can be acted on and where focus is. If something is blue, it is interactive.

**The Red Is For Errors Rule.** Alert Red appears only when something went wrong. It is never used for emphasis, sale tags or decoration.

**The Control Boundary Rule.** A control's edge must reach 3:1 against what it sits on (WCAG 1.4.11). Decorative hairlines stay faint; anything the User types into uses Field Rule.

**The Tinted Neutral Rule.** Neutrals carry a trace of the accent's hue (255 to 260). Never use pure grey or pure black for text or borders; pure white is reserved for the Page surface.

## Typography

**Display Font:** none. There is no display face.
**Body Font:** Geist (self-hosted through `next/font/google`, with `system-ui, sans-serif` as fallback)
**Label/Mono Font:** none; labels use Geist at a smaller size.

**Character:** Geist is compact, modern and a little technical, and it stays out of the way. One family at several weights gives the hierarchy, so nothing competes with the content.

### Hierarchy
- **Headline** (600, 1.5rem, 2rem line height, -0.025em tracking): the page title, once per page, balanced wrapping.
- **Body** (400, 1rem, 1.5rem): values, field text and the lede under a title (in Ink Soft, balanced wrapping so no single word is left alone on the last line).
- **Label** (500, 0.875rem, 1.25rem): field labels and the caption above a value (the caption in Ink Soft). Error text uses the same size at regular weight.
- **Button** (500, 1rem, 1.5rem): the primary button label.
- **Brand** (600, 0.875rem, -0.025em tracking): the wordmark text "First Nest Demo", in the site header and, where there is no header, as plain text at the top of the page (see Navigation).

### Named Rules
**The One Family Rule.** Geist only. Hierarchy comes from weight (400, 500, 600) and size, not from adding a second face.

**The Quiet Heading Rule.** One headline per page, semibold, never above 1.5rem in this column layout. A heading announces the page, it does not perform.

## Layout

A single centred column, 384px wide (`max-w-sm`), with 24px side gutters, 80px above the content and 96px below. The header uses the same column width so its text lines up with the page below. Content stacks vertically: 20px between form fields, 6px between a label and its field, 32px between a heading block and the content below it.

There is no grid, sidebar or multi-column layout yet, and no breakpoints are defined; the column simply narrows with the viewport. Grow the layout only when the shop needs it, and keep this column as the default for auth and account screens.

The login page has no header. Pages inside the `(app)` route group get the site header; `/login` sits outside it.

### Named Rules
**The One Column Rule.** Forms and detail views live in the 384px column. Do not widen it to fill the screen.

## Elevation & Depth

Flat. The system uses tonal layering and a hairline border instead of shadow. A white Page surface sits on a tinted Paper background, separated by a 1px Rule. No shadows exist anywhere in the code, and no overlays exist yet.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Separate them with tone and a 1px Rule, never with a shadow. If an overlay (menu, dialog) is added later, it may take one very soft shadow, and that decision belongs in this file first.

## Shapes

One radius: 6px (`rounded-md`) on every control, card, message and skeleton. Borders are always 1px: Rule on surfaces, Field Rule on controls. There are no pill shapes, no fully square corners and no mixed radii, so the silhouette stays consistent from the smallest field to the largest card.

### Named Rules
**The One Radius Rule.** 6px everywhere. Do not introduce a second radius for emphasis.

## Components

Character: clear and firm, never showy.

### Buttons
- **Shape:** gently curved (6px).
- **Primary:** Ledger Blue fill, On Ledger Blue label, 10px vertical and 16px horizontal padding, Button type (500). Full width of the form column.
- **Hover:** fill moves to Ledger Blue Deep over 150ms (colour only; no movement, scale or shadow).
- **Disabled / pending:** 60% opacity, and the label changes to say what is happening ("Logging in…").
- **Focus:** the global 2px Ledger Blue outline, offset 2px.
- **Secondary / ghost:** not built yet.

### Inputs / Fields
- **Style:** Page background, 1px Field Rule border, 6px radius, 12px by 8px padding, Body text, Ink Soft placeholder.
- **Label:** wraps the field (a `label` element around the text and input), Label type, 6px gap. A field that carries a control inside it (the password) uses `label` with `for` instead, so the control does not become part of the field's name.
- **Password reveal:** a text button inside the right edge of the password field, reading "Show" or "Hide" (Label type, Ledger Blue, no fill, 6px radius, full field height, 12px side padding). It is the one place Ledger Blue appears as text. The field reserves 64px of right padding so typed text never runs under it. Hover moves the text to Ledger Blue Deep over 150ms; focus uses the global outline. It switches the input between `password` and `text`, keeping the value.
- **Focus:** the global 2px Ledger Blue outline with 2px offset. No custom glow.
- **Error:** the error is shown once, in the alert below the button (see Alert), not on each field. Both fields point at it with `aria-describedby`; they get `aria-invalid` only when the Login was rejected, not for a network or server failure.

### Alert (error message)
- **Style:** Alert Wash background, Alert Red text, Label size, 6px radius, 12px by 8px padding, no border. Rendered with `role="alert"` so it is announced.
- **Position:** directly below the submit button, so showing it moves nothing the User is aiming at.
- **Copy:** three cases, each says what failed and what to do. A rejected Login never reveals which field was wrong ("Invalid email or password."); an unreachable server says so ("Can't reach the server. Check your connection and try again."); anything else blames the system, not the User ("Something went wrong on our side. Try again.").

### Detail card
- **Style:** Page background, 1px Rule border, 6px radius, 16px by 12px padding. A caption (Label type, Ink Soft) above a value (Body, may break long text).
- **Loading:** while the value loads, a 56px-tall pulsing block in Rule colour with a 6px radius takes its place.

### Navigation (site header)
- **Style:** a bar with Page background and a bottom 1px Rule. It holds only the wordmark text "First Nest Demo" (Brand type), aligned to the content column. No links, menu or logo exist yet.
- **Wordmark without a header:** `/login` has no header, so it opens with the same wordmark as plain Brand-type text, 40px above the title. It is the app's name, not a label for the title: no uppercase, no small caps, no rule or accent colour, and it must not be repeated above other headings.
- **Mobile treatment:** none needed yet; it narrows with the column.

## Do's and Don'ts

### Do:
- **Do** keep Ledger Blue for actions and focus only (The One Voice Rule).
- **Do** separate surfaces with the Page/Paper tone difference and a 1px Rule, and outline inputs with Field Rule so their edges meet 3:1.
- **Do** use 6px radius on everything, and 150ms colour-only transitions for state changes.
- **Do** keep a visible 2px focus outline on every interactive element, and announce errors with `role="alert"`.
- **Do** use the glossary's words in copy: User, Registration, Login.
- **Do** design the dark theme alongside the light one; both follow the system setting.

### Don't:
- **Don't** use the glossy SaaS look: no gradients, glows, glass, floating shadowed cards or oversized hero headings.
- **Don't** use the default auth-template look: no form floating on a grey backdrop, no invented logo or brand mark, no "Welcome back" copy.
- **Don't** make it a colourful shop: no second accent colour, no badges, no promo banners, no decorative red.
- **Don't** add a second typeface or a second radius.
- **Don't** use pure grey or pure black for text or borders.
- **Don't** say which field was wrong on a failed Login.
- **Don't** use the words Account, Member, Customer, Sign-up or Sign-in in the interface.
