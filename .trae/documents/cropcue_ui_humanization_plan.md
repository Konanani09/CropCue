# CropCue UI Humanization & Cleanup Implementation Plan

## Repository Research

### Current Issues Identified

1. **"Step 1 / Step 2" Naming Everywhere**: The entire UI uses numbered-step terminology (e.g., "1 · Test Soil", "Step 1 of 5", "STEP 1" tag badges, numbered nav items, numbered step cards with step-number badges). This feels robotic and workflow-like instead of app-like.

2. **Emojis Used Instead of Icons**: Many UI elements use emoji characters (🌱, 🌧, 🌽, 🎃, 🥬, 🫘, 🌾, 🌦️, 🚜, 🤏, ✅, 💧, ⚠️, 🛒, 📝) instead of Lucide vector icons. This is inconsistent with the icon system already in use throughout (lucide-react is already installed and used for navigation).

3. **Language Dropdown Is Unattractive**: The `lang-pill` in [AppLayout.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/components/AppLayout.tsx#L72-L83) uses a native browser `<select>` element. Native select dropdowns cannot be styled consistently and clash with the app's design language.

4. **Weather Shown As Raw Data (But We Only Need It For AI Context)**:
   - There is a full Weather page route at `/weather` showing a big-gradient today card, 5-day tiles with icons, and summary tiles.
   - The user explicitly wants weather **not shown on UI** directly, but **consumed by AI/recommendations** to produce human advice such as:
     - "Rainfall is coming Oct 11–12 — hold planting, then plant 2 days after the last shower so your seeds don't wash away."
     - "Tuesday is hot and dry — if moisture drops below 30% for 2 days, run a light irrigation."
   - Translation: remove the standalone Weather page, stop showing raw temp/rain tiles, and fold weather-informed insights into Dashboard, Crops, and Planting Plan pages as contextual tips.

5. **App Feels Robotic / Not Humanized**:
   - Step-based framing, numeric badges, overly structured crumbs.
   - Hard-coded English strings scattered across components (not all copy flows through `i18n`).
   - Terse "OK/not OK" style banners instead of conversational guidance.
   - Recommendations in the server (`/api/recommendations/crops` and `/api/planting-plan`) do reference weather but can be made richer with specific day-level guidance.

6. **Other Small Issues**:
   - [SoilInsights.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/pages/SoilInsights.tsx) line 148, 171-178, 182, 209-210, 235 contain hard-coded English that should be translation keys.
   - [Weather.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/pages/Weather.tsx) lines 74-76, 124-126, 167, 170-172 contain hard-coded English.
   - [Dashboard.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/pages/Dashboard.tsx) line 80 has hard-coded English.
   - [PlantingPlan.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/pages/PlantingPlan.tsx) line 35 has hard-coded English.
   - Brand logo in sidebar is an emoji 🌱.

### Architecture Notes
- **Stack**: Vite + React 18 + React Router v6 + TypeScript + Express backend (`server/index.ts`).
- **Icons**: `lucide-react` already installed and used for navigation (Home, Droplets, CloudRain, Sprout, CalendarDays, History, MapPin, Globe, etc.). We will exclusively use additional Lucide icons to replace all emojis.
- **Translations**: Central i18n provider in [i18n.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/i18n.tsx) with 6 languages (en, nso, ts, ve, zu, af). Every visible string must go through `t()`.
- **Styles**: Single stylesheet [global.css](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/styles/global.css) using semantic CSS variables for colors (`--color-leaf-*`, `--color-soil-*`, `--color-sun-*`, `--color-sky-*`, `--color-neutral-*`).

---

## Files and Modules

| File | Expected Change |
|---|---|
| [src/i18n.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/i18n.tsx) | Remove all `1 ·`, `2 ·`, `STEP 1` / `Step 1 of 5` numbering from nav, titles, crumbs, tag strings. Add new humanized labels for navigation, headers, section titles, weather-contextual advice, and previously-hard-coded UI strings. Add translation keys for language picker labels, crop icons fallback labels, sensor UI labels, etc. Apply across all 6 languages. |
| [src/App.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/App.tsx) | Remove `/weather` route. |
| [src/components/AppLayout.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/components/AppLayout.tsx) | (a) Remove weather nav entry (or optionally reorder remaining). (b) Replace emoji `🌱` brand logo with Lucide `Sprout` icon. (c) Replace native `<select>` language dropdown with a custom-styled popover dropdown using `<div>` buttons and a small state toggle. |
| [src/pages/Dashboard.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/pages/Dashboard.tsx) | (a) Replace numbered `STEP` cards with feature/action cards (no step number badge, no step tag text). (b) Replace `🌧` rain emoji with `CloudRain` lucide icon. (c) Remove weather big-tile (the Sun/Temp tile) — we keep soil + sensor tiles. Weather context moves into a new contextual AI tip banner that pulls in specific rain-day guidance. (d) Humanize the "next step" banner to feel like a friendly next action, not "STEP 1 —". |
| [src/pages/SoilInsights.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/pages/SoilInsights.tsx) | Move all hard-coded English ("sensors", "Battery", "Signal", "Zone", "Updated", "Reads", "Interpretation", "Green = good · Orange = fix it.", "Waiting for readings…") into i18n keys. No structural changes otherwise. |
| [src/pages/CropRecommendations.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/pages/CropRecommendations.tsx) | (a) Replace crop emoji map with Lucide icons (use a `CropIcon` helper that renders `EarOfCorn`/`Pumpkin`/`LeafyGreen`/`Bean` variants, falling back to `Sprout`). (b) Replace header `🌾` with `Wheat`/`Sprout` icon + colored tile. (c) Replace `⚠️` caveat emoji with `AlertTriangle` lucide icon. (d) Add a weather-informed contextual insight banner at the top that tells the user how the forecast affects their crop choices (e.g. "Rain expected Oct 11–12 — hold planting maize until Oct 14, so seeds don't wash away"). (e) Remove `#1 ·`, `#2 ·`, `#3 ·` numeric rank prefixes from crop headings. |
| [src/pages/PlantingPlan.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/pages/PlantingPlan.tsx) | (a) Replace `emojiFor()` with `cropIconFor()` returning Lucide icons. (b) Enhance plan note display to embed weather context from the forecast (use the weather fetch inside this component to build tips like "Aim to plant 2 days after Oct 11–12 rain settles"). (c) Move hard-coded English to i18n. |
| [src/pages/FarmRecords.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/pages/FarmRecords.tsx) | (a) Replace `CROP_EMOJI` map with icon map (same icons as Crops page). (b) Replace `🛒` yield icon with lucide `Scale`/`Package`. (c) Replace `📝` notes icon with lucide `FileText`/`StickyNote`. |
| [src/pages/Weather.tsx](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/pages/Weather.tsx) | **Delete** — weather is now background context only. |
| [server/index.ts](file:///c:/Users/masha/OneDrive/Documents/CropCue/server/index.ts) | (a) Improve `/api/recommendations/crops` to include a `weatherContext` field summarizing how the forecast drove the recommendation (e.g., "Rain 11–12 Oct; hold planting 2 days after last rain"). (b) Improve `/api/planting-plan` so each step's `note` integrates weather-specific day references ("plant 2 days after Oct 11–12 rain") using the hard-coded forecast data. Do NOT remove `/api/weather/forecast` endpoint — frontend still calls it to power contextual banners and the planting-plan logic. |
| [src/styles/global.css](file:///c:/Users/masha/OneDrive/Documents/CropCue/src/styles/global.css) | (a) Remove / adjust step-card `.step-number`, `.step-tag` specific styling that shows the big numeric badge. (b) Add styles for a custom language dropdown: `.lang-dropdown-wrapper`, `.lang-dropdown-trigger`, `.lang-menu`, `.lang-menu-item`, `.lang-menu-item.active`, open/hover states. (c) Add styles for a contextual "insight banner" component reusable on Dashboard/Crops/Plan — matching app tokens. (d) Minor: rename crop-emoji class to `crop-icon` (still an icon tile shape; we keep the same sizing). (e) Remove/adjust `.weather-tiles`, `.weather-tile`, and the weather gradient card if referenced from dashboard/crops. |

---

## Implementation Steps (dependency order)

1. **Clean up i18n text (no step numbering)**
   - Rewrite all navigation labels, header titles, breadcrumbs, and dashboard step tag/title/body strings in `i18n.tsx` to remove `1 ·`, `Step 1 of 5`, `STEP 1` etc. Humanize them:
     - Nav: `Home`, `Soil Health`, `Crop Advice`, `Planting Plan`, `Farm Records`
     - Titles: `Your soil at a glance`, `Crops that love your field right now`, `Your planting schedule`, etc.
     - Crumbs: `Dashboard · Field A · Limpopo` → keep but remove "Step X of 5" prefixes.
     - Dashboard section title: `5 simple steps…` → reword to something like `Everything you need to grow well` or `Your farming toolkit`.
   - Add new i18n keys for:
     - Weather insight banner templates (rain soon / good window / too hot)
     - Language selector (`select_language`, `language_options`)
     - Sensor section hard-coded labels (Battery, Signal, Zone, Updated, Reads, Interpretation, Legend, Empty)
     - Crop icon alt text / fallback labels per crop name
     - Records page yield/notes icon labels

2. **Replace emojis with lucide icons (components + styles)**
   - Build a shared helper `cropIconFor(name: string): LucideIcon` and use it on `CropRecommendations`, `PlantingPlan`, `FarmRecords`.
   - Replace `🌱` brand logo with `Sprout` icon (size 22, same styling).
   - Replace dashboard footer rain `🌧 mm` with `CloudRain` icon.
   - Replace crops header `🌾` with `Sprout` + a colored tile.
   - Replace caveat `⚠️` with `AlertTriangle` icon, aligned.
   - Replace records yield `🛒` with `Package` and notes `📝` with `StickyNote`.
   - Remove `weatherEmojiChar()` usage entirely (Weather page goes away).
   - In `Weather` tiles the 5-day view goes away, so `💧` disappears with it.
   - In CSS, rename `.crop-emoji` selector to `.crop-icon` for consistency.

3. **Redesign language dropdown (no native `<select>`)**
   - In `AppLayout.tsx`, build a small custom dropdown:
     - State: `langOpen: boolean`, toggle via the Globe trigger pill.
     - On click, render a `.lang-menu` positioned absolutely (or use fixed + portal if tricky; simple absolute is ok here, header is sticky-top and the menu can overflow below).
     - Each item renders: language code + label, active item highlighted with leaf bg + check mark.
     - Click outside closes (use `useEffect` on document click or a simple ref).
   - In `global.css`, add `.lang-pill` trigger styles (keep it pill-like with globe). Add `.lang-menu` with card appearance (white, shadow, rounded-xl, padding), `.lang-menu-item` hover/active states.

4. **Remove standalone Weather route + fold weather context into AI-style banners**
   - Delete `Weather.tsx` page file.
   - In `App.tsx`, remove the `/weather` Route.
   - In `AppLayout.tsx` `NAV` array, remove the `CloudRain` weather entry. Adjust `TITLES` accordingly.
   - Dashboard: Remove the weather big-tile (Sun / tempMax). Replace with a new **"What the sky is telling us"** / insight banner component that:
     - Fetches `/api/weather/forecast` (still required)
     - Renders human guidance:
       - If any day has rainfall ≥ 10mm → "Heavy rain coming Oct 11–12. Do not plant 1 day before rain — seeds wash out. Plant 2 days after the last shower."
       - If sunny streak → "Next 5 days look mostly sunny and warm — a good window to plant. Water lightly if soil moisture drops below 35%."
       - Use i18n templates + format the actual days/dates.
   - CropRecommendations: Same insight banner above the crops grid (can reuse component). Also server now returns `weatherContext` per rec to weave into `why`.
   - PlantingPlan: Already fetches plan; add a small banner at the top using the forecast to reinforce plan notes (e.g., "Week of Oct 26 lines up perfectly with the 2-day post-rain window we recommended.").

5. **Humanize copy + eliminate remaining hard-coded strings**
   - `SoilInsights.tsx` — every hard-coded English phrase gets a new key in i18n and all 6 languages. Legend: `Green = good · Orange = fix it` → translate & reword to friendlier "Green = looking great · Orange = a little attention needed".
   - `PlantingPlan.tsx` line 35 "Follow the weeks in order." → `t()` key.
   - Dashboard "next-banner" references step1_tag — change it to a friendlier prompt like "Start with your soil" / "First up: check your soil health".
   - Step cards on dashboard: remove number `.step-number` badge, remove `step-tag` "STEP X" line. Re-layout so the icon, title, body, and CTA feel like 5 feature cards. Update `.steps-grid` cards styling to suit.
   - Make the crop recommendations remove the rank numbers (`#1 · Maize…` → just `Maize (White Corn)`).

6. **Server: enrich recommendations & planting plan with weather-aware copy**
   - In `/api/recommendations/crops`, add a top-level `weatherContext` string (already computed from the same hard-coded 5-day data) and optionally per-crop `weatherNotes`.
   - In `/api/planting-plan`, make the `note` fields explicitly tie to days from the hard-coded forecast where applicable:
     - Week 2 (plant maize): note already says "2 days after Oct 11–12 rain settles" → keep; generalize through code.
     - Add a planting plan-level guidance sentence.
   - Keep `/api/weather/forecast` endpoint exactly as is — the UI consumes it for the insight banners.

7. **Update CSS classes / clean up orphaned weather styles**
   - In `global.css`:
     - Remove `.step-number`, `.step-tag` (or repurpose `.step-tag` to be an accent label if we want a category tag).
     - Rename `.crop-emoji` → `.crop-icon` (and in JSX).
     - Remove `.weather-tiles` / `.weather-tile` styles.
     - Add custom language dropdown styles.
     - Add `.insight-banner` styles (leaf/sun/sky variants) for reusable AI-style tip cards.
     - Adjust `.steps-grid` cards to be feature cards without numeric offset.

8. **Verify diagnostics & run app to check**
   - Type check via `npx tsc --noEmit` (or project `typecheck` script if any).
   - Check diagnostics in VS Code via GetDiagnostics.
   - Start dev server (`npm run dev`) and confirm:
     - Navigation has no step numbers, no weather entry.
     - All icons are Lucide (no emojis).
     - Language dropdown is custom-styled and functional.
     - Weather insight banners appear on Dashboard/Crops/Plan using actual forecast dates.
     - No route to /weather (404 or redirects to home via missing route).
     - All 6 language translations render without falling back to raw keys.

---

## Dependencies and Considerations

- **lucide-react**: Already a dependency (imported from AppLayout, Dashboard, etc.). We will use additional icons:
  - Crop substitutes: `Sprout`, `EarOfCorn` (if available), `Leaf`, `LeafyGreen` (if available), `Pumpkin` (if available), `CircleDot`/`CircleDashed` as fallbacks.
  - Yield/records: `Package`, `Scale`, `StickyNote`, `FileText`.
  - Insights banners: `Lightbulb`, `AlertTriangle`, `CloudRain`, `CloudSun`, `Sprout`, `Info`.
  - If any specific crop icon is missing in lucide, we fall back to `Sprout` (which is guaranteed present).
- **Existing API routes**: Keep `/api/weather/forecast` — it is still consumed internally by Dashboard / Crops / Plan for weather-aware banners, even though the Weather page is gone.
- **Translations must apply to all 6 languages**: When adding new keys in `i18n.tsx`, we add them in all 6 dicts (en, nso, ts, ve, zu, af). For new languages we don't have a native speaker, we translate the concept clearly and keep consistent with the style already present in each language block.
- **Accessibility**: Custom language dropdown must be keyboard friendly. Add basic focus states; native select was bad for accessibility of options, custom buttons with `role="listbox"` / `role="option"` is better.
- **Z-index / layout**: Sticky app header renders the language menu — ensure `.lang-menu` has `z-index` above the header.

---

## Validation

1. **TypeScript diagnostics**: `npx tsc --noEmit` (or `GetDiagnostics`) must pass with 0 errors.
2. **Build**: `npm run build` should succeed.
3. **Manual checklist (in browser)**:
   - [ ] Sidebar nav contains **5 items**, none prefixed with `1 ·`, no `CloudRain` / weather.
   - [ ] Sidebar brand logo is `Sprout` icon, not `🌱`.
   - [ ] Header breadcrumbs never say "Step X of 5".
   - [ ] Dashboard feature cards: no numeric badge in top-left, no "STEP X" uppercase tag. At least one banner contains an AI-style insight with specific forecast dates and rain guidance.
   - [ ] Soil page labels ("Battery", "Zone", "Reads", legend, empty state) are all translated via `t()`.
   - [ ] Crops page: 3 tiles with icons (not 🌽/🎃/🥬/🫘). No `#1 ·` prefix. Above crops there is a weather-aware insight banner with specific days. Caveat uses `AlertTriangle` icon not `⚠️`.
   - [ ] Planting plan uses vector crop icons not emojis. Plan notes reference actual rain days / planting windows aligned to forecast. Top banner is humanized.
   - [ ] Records page uses icons not emojis for crops, yield, notes.
   - [ ] Language dropdown: clicking Globe pill opens a styled card menu. Items highlight on hover/active. Selecting Sepedi actually changes the language. Menu closes on outside click.
   - [ ] Visiting `/weather` in the URL bar → there is no route (blank Outlet content or handled via 404 — acceptable since we removed the route).
   - [ ] Switching between all 6 languages → every newly added key resolves (no raw `snake_case_key` text visible).

---

## Risks

| Risk | Handling / Fallback |
|---|---|
| Missing Lucide icons (e.g. `EarOfCorn`, `Pumpkin`, `LeafyGreen`) | Always fall back to `Sprout` for crop icons, `Package` for yield, `StickyNote` for notes. Use `Read` tool to check what icons are imported across the app — only use icons that definitely exist in the installed version, or stick to well-known ones like `Sprout`, `Leaf`, `CircleDot`. |
| Custom language dropdown is not accessible / closes wrongly | Keep it simple: absolute positioned div inside header-actions, click-outside via document `mousedown` listener, active item shows checkmark. If bugs appear, at minimum: keep the pill but replace native select with 3 radio-like buttons in a popover that have better styling. |
| Weather banner logic shows wrong dates / bad data types | Pull dates directly from `ForecastDay[]` and format with `toLocaleDateString` like the existing Weather page did. Compute which days have heavy rain, pick min/max, concatenate into a sentence via i18n templates. |
| i18n translation quality for 5 non-English languages is not perfect | Keep style consistent with existing phrases in each block. The user asked to humanize the app in general — clear, friendly text in each language is the goal; we don't need native-speaker-perfect on first pass. |
| Deleting Weather.tsx and removing its route might leave a dangling nav reference in some edge path | Verify `NAV` array and `TITLES` record are in sync. Dashboard step cards no longer link `/weather`. |
| Renaming `.crop-emoji` → `.crop-icon` breaks existing tile sizes | Apply same CSS rules to `.crop-icon` selector. In JSX change class name in all 3 places (CropRecommendations crop tile top-left header icon, main crop-emoji div, records crop-line). |
