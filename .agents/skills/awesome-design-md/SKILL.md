---
name: awesome-design-md
description: Curated collection of 74+ real-world design systems (DESIGN.md) extracted from leading tech companies like Stripe, Linear, Vercel, Supabase, Apple, Raycast, Resend, xAI, etc. Use this skill when the user wants to design, theme, or build a UI inspired by a specific brand or aesthetic (e.g. "hazlo estilo Linear", "diseño tipo Stripe", "estética Supabase", "como Vercel o Raycast"), or needs exact design tokens (colors, typography, radii, spacing, cards).
---

# Awesome DESIGN.md — Design Systems Collection

A curated library of **74+ production design systems** based on the Google Stitch `DESIGN.md` specification. Each file includes precise color hex codes, surface hierarchies, typography scales, button/card variants, border radii, shadows, and design guardrails.

---

## How to Apply a Brand's Design System

When the user requests a page, component, or redesign matching a brand:

1. **Locate the Brand**: Check the catalog below and find the matching directory in `references/<brand>/DESIGN.md`.
2. **Read the Design Tokens**: Use `view_file` to read `references/<brand>/DESIGN.md`.
3. **Extract and Map the System**:
   - **Canvas & Surfaces**: Read `canvas`, `surface-1`, `surface-2`, `hairline` (borders), and `accent`.
   - **Typography**: Check exact font family, weight, `line-height`, and negative `letter-spacing` (tracking).
   - **Components**: Adhere to the button hierarchy (Primary, Secondary, Ghost), card surfaces, and input styles.
   - **Atmosphere & Elevation**: Respect the shadow tokens and light/dark surface layering.
4. **Enforce Do's & Don'ts**: Check Section 7 of that brand's `DESIGN.md` for specific anti-patterns to avoid.

---

## Brand Catalog & References

### 🤖 AI & LLM Platforms
- [**Claude**](./references/claude/DESIGN.md) — Anthropic's warm terracotta accent, clean editorial layout, serif accents.
- [**Cohere**](./references/cohere/DESIGN.md) — Enterprise AI platform, vibrant gradients, data-rich dashboard aesthetic.
- [**ElevenLabs**](./references/elevenlabs/DESIGN.md) — Dark cinematic UI, audio-waveform aesthetics.
- [**Minimax**](./references/minimax/DESIGN.md) — Bold dark interface with neon accents.
- [**Mistral AI**](./references/mistral.ai/DESIGN.md) — French-engineered minimalism, purple-toned, crisp typography.
- [**Ollama**](./references/ollama/DESIGN.md) — Terminal-first, monochrome simplicity.
- [**OpenCode AI**](./references/opencode.ai/DESIGN.md) — Developer-centric dark theme.
- [**Replicate**](./references/replicate/DESIGN.md) — Clean white canvas, code-forward layout.
- [**Runway**](./references/runwayml/DESIGN.md) — Editorial film-festival aesthetic, cinematic dark heroes, paper-white bands.
- [**Together AI**](./references/together.ai/DESIGN.md) — Technical, blueprint-style infrastructure design.
- [**VoltAgent**](./references/voltagent/DESIGN.md) — Void-black canvas, emerald accent, terminal-native.
- [**xAI**](./references/x.ai/DESIGN.md) — Stark monochrome, futuristic minimalism.

### 🛠️ Developer Tools & IDEs
- [**Cursor**](./references/cursor/DESIGN.md) — Sleek dark interface, subtle gradient accents, code-first.
- [**Expo**](./references/expo/DESIGN.md) — Dark theme, tight letter-spacing, mobile developer centric.
- [**Lovable**](./references/lovable/DESIGN.md) — Playful gradients, friendly full-stack dev aesthetic.
- [**Raycast**](./references/raycast/DESIGN.md) — Sleek dark chrome, vibrant red/orange/pink gradient accents.
- [**Superhuman**](./references/superhuman/DESIGN.md) — Premium dark UI, keyboard-first, purple glow.
- [**Vercel**](./references/vercel/DESIGN.md) — Black & white precision, Geist typography, ultra-crisp borders.
- [**Warp**](./references/warp/DESIGN.md) — Modern terminal, IDE-like block-based command UI.

### 🗄️ Backend, Database & DevOps
- [**Supabase**](./references/supabase/DESIGN.md) — Dark emerald theme (`#3ecf8e`), code-first panels, monospace touches.
- [**PostHog**](./references/posthog/DESIGN.md) — Playful retro-tech, developer-friendly dark UI.
- [**Sentry**](./references/sentry/DESIGN.md) — Data-dense monitoring dashboard, pink-purple accent.
- [**ClickHouse**](./references/clickhouse/DESIGN.md) — Yellow-accented, technical documentation style.
- [**Composio**](./references/composio/DESIGN.md) — Modern dark with vibrant integration cards.
- [**HashiCorp**](./references/hashicorp/DESIGN.md) — Enterprise-clean, structural black and white.
- [**MongoDB**](./references/mongodb/DESIGN.md) — Green leaf branding, developer documentation focus.
- [**Sanity**](./references/sanity/DESIGN.md) — Dark-first editorial, 112px display type, IBM Plex Mono accents, coral CTA.

### ⚡ Productivity & SaaS
- [**Linear**](./references/linear.app/DESIGN.md) — Deepest near-black canvas (`#010102`), signature lavender (`#5e6ad2`), hairline borders, negative tracking.
- [**Notion**](./references/notion/DESIGN.md) — Warm paper minimalism, serif headings, soft surfaces.
- [**Resend**](./references/resend/DESIGN.md) — Minimal dark theme, monospace accents, razor-sharp dev aesthetics.
- [**Cal.com**](./references/cal/DESIGN.md) — Clean neutral UI, developer-oriented scheduling simplicity.
- [**Intercom**](./references/intercom/DESIGN.md) — Friendly blue palette, conversational UI patterns.
- [**Mintlify**](./references/mintlify/DESIGN.md) — Documentation platform, clean, green-accented, reading-optimized.
- [**Zapier**](./references/zapier/DESIGN.md) — Warm orange, friendly illustration-driven SaaS.

### 💳 Fintech & Payments
- [**Stripe**](./references/stripe/DESIGN.md) — Signature purple gradients, weight-300 typography, mesh backgrounds, luxury polish.
- [**Wise**](./references/wise/DESIGN.md) — Bright fluorescent green accent, friendly high-contrast clarity.
- [**Revolut**](./references/revolut/DESIGN.md) — Sleek dark interface, gradient cards, fintech precision.
- [**Coinbase**](./references/coinbase/DESIGN.md) — Clean blue identity, trust-focused institutional feel.
- [**Binance**](./references/binance/DESIGN.md) — Binance Yellow on monochrome, trading urgency.
- [**Kraken**](./references/kraken/DESIGN.md) — Purple-accented dark UI, data-dense dashboards.
- [**Mastercard**](./references/mastercard/DESIGN.md) — Warm cream canvas, orbital pill shapes, editorial warmth.

### 🎨 Design & Creative Tools
- [**Figma**](./references/figma/DESIGN.md) — Vibrant multi-color accents, playful yet professional tool interface.
- [**Framer**](./references/framer/DESIGN.md) — Bold black and electric blue, motion-first, design-forward.
- [**Webflow**](./references/webflow/DESIGN.md) — Blue-accented, polished marketing site aesthetic.
- [**Airtable**](./references/airtable/DESIGN.md) — Colorful, friendly, structured data aesthetic.
- [**Clay**](./references/clay/DESIGN.md) — Organic shapes, soft gradients, art-directed layout.
- [**Miro**](./references/miro/DESIGN.md) — Bright yellow accent, infinite canvas aesthetic.

### 📱 Consumer Tech & Media
- [**Apple**](./references/apple/DESIGN.md) — Premium whitespace, SF Pro typography, cinematic product imagery.
- [**Spotify**](./references/spotify/DESIGN.md) — Vibrant green on true dark, bold type, album-art-driven.
- [**Uber**](./references/uber/DESIGN.md) — Bold high-contrast black and white, tight type, urban energy.
- [**The Verge**](./references/theverge/DESIGN.md) — Acid-mint and ultraviolet accents, Manuka display type.
- [**WIRED**](./references/wired/DESIGN.md) — Paper-white broadsheet density, custom serif, ink-blue links.
- [**NVIDIA**](./references/nvidia/DESIGN.md) — Green-black energy, technical power aesthetic.
- [**SpaceX**](./references/spacex/DESIGN.md) — Stark black and white, full-bleed imagery, futuristic.
- [**Pinterest**](./references/pinterest/DESIGN.md) — Red accent, masonry grid, image-first.
- [**PlayStation**](./references/playstation/DESIGN.md) — Three-surface channel layout, cyan hover-scale interaction.

### 🏎️ Automotive & Luxury
- [**Tesla**](./references/tesla/DESIGN.md) — Radical subtraction, cinematic full-viewport photography, Universal Sans.
- [**BMW**](./references/bmw/DESIGN.md) & [**BMW M**](./references/bmw-m/DESIGN.md) — Luxury automotive, dark premium surfaces, M motorsport accents.
- [**Ferrari**](./references/ferrari/DESIGN.md) — Chiaroscuro black-white editorial, Ferrari Red with extreme sparseness.
- [**Lamborghini**](./references/lamborghini/DESIGN.md) — True black cathedral, gold accent, LamboType Neo-Grotesk.
- [**Bugatti**](./references/bugatti/DESIGN.md) — Cinema-black canvas, monochrome austerity, monumental display type.

### 💾 Retro Web (1990s & 2000s)
- [**Dell (1996)**](./references/dell-1996/DESIGN.md) — Catalog-era web, black page frame, flat color-block ribbon cards.
- [**Nintendo (2001)**](./references/nintendo-2001/DESIGN.md) — Y2K console chrome, brushed-periwinkle beveled metal panels, carbon nav glowing amber.
