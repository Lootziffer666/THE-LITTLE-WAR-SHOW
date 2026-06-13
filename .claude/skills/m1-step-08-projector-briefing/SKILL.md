---
name: m1-step-08-projector-briefing
description: Milestone 1, Schritt 08 — das Overhead-Projektor-Briefing auf der Rückleinwand: eine schief projizierte Folie mit Briefing-Copy und bitterem Nachbericht (wörtlich aus der Doku), leicht flackernd. ProjectorSlide.gd. Kein Map-Screen. Zuerst godot-step-protocol aufrufen.
---

# M1 · Schritt 08 — Projektor-Briefing (statt Map)

> Zuerst `godot-step-protocol`. Prinzip: Concept-Bibel §11 Kern-Loop; Vertical-Slice §5. Copy **wörtlich** aus der Doku.

## Objective
Das Briefing erscheint als schief projizierte Overhead-Folie auf der Rückleinwand — Strategie als schlechte Präsentation, nie als Map/HUD.

## Preconditions / depends-on
Schritt 01 🟢 (`BackdropScreen`) und Schritt 02 🟢 (Look).

## Definition of Done + Quality Bar
- `scripts/ProjectorSlide.gd` (`extends Node3D`): `SlideQuad` (`MeshInstance3D`, leicht **gedreht/schief**, emissiv/additiv → wirkt projiziert) vor/auf dem `BackdropScreen`; Text via `Label3D` als Kind.
- `show_briefing()`: Brücken-Briefing **wörtlich**: „Ziel: Die Brücke sichern, bevor jemand bemerkt, dass wir sie gestern bereits gesprengt haben." (+ Andeutung von Stempel „DRINGEND"/Handschrift).
- `show_report()`: Nachbericht **wörtlich**: „Einsatz erfolgreich. Die Brücke wurde vollständig neutralisiert. Ihre strategische Bedeutung wurde kurz darauf neu bewertet."
- `jitter()`: dezentes Flackern/Mikro-Wackeln („schlechter Projektor").
- **Quality Bar:** Liest sich eindeutig als **Projektor-Folie auf der Bühne** (schief, projiziert, leicht flackernd) — nicht als sauberer UI-/Map-Screen. Copy trifft den bitter-bürokratischen Ton.

## Exact procedure
1. `PlaceholderTextures.slide_bg_tex()` (heller Folienhintergrund, leicht „acetat") optional.
2. `scripts/ProjectorSlide.gd`: `SlideQuad` schief vor dem Backdrop; `Label3D` für Text; `show_briefing()/show_report()/jitter()`.
3. In `StageBootstrap` instanzieren; vorerst `show_briefing()` beim Start (Timeline final in Schritt 09).
4. Prüfen: Projektor-Charakter, korrekte Copy. Committen; CI grün.

## Files touched
`scripts/ProjectorSlide.gd` (neu), ggf. `scripts/PlaceholderTextures.gd` (erweitert), `scripts/StageBootstrap.gd` (Instanzierung).

## Ready-to-paste Agent-Prompt
> Baue das Overhead-Projektor-Briefing (Concept-Bibel §11, Vertical-Slice §5). **Sicherheit:** Briefing ist Bühnen-Requisite, **kein** Map/HUD. `scripts/ProjectorSlide.gd` (`extends Node3D`): `SlideQuad` (`MeshInstance3D`, **leicht schief gedreht**, emissiv/additiv, damit es projiziert wirkt) vor dem `BackdropScreen`; Text via `Label3D`. `show_briefing()` zeigt **wörtlich**: „Ziel: Die Brücke sichern, bevor jemand bemerkt, dass wir sie gestern bereits gesprengt haben." (mit angedeutetem Stempel „DRINGEND"/Handschrift). `show_report()` zeigt **wörtlich**: „Einsatz erfolgreich. Die Brücke wurde vollständig neutralisiert. Ihre strategische Bedeutung wurde kurz darauf neu bewertet." `jitter()` für dezentes Flackern. In `StageBootstrap` instanzieren, beim Start `show_briefing()`. Ziel: wirkt wie schiefe Projektor-Folie, nicht wie sauberer UI-Screen; Copy bitter-bürokratisch. API gegen Godot 4.3 prüfen (Label3D, emissive Material). Abschluss: `tone-safety-gate` (Punkt 2 Projektor statt Map; Punkt 8 Humor trifft Autorität), `/code-review`, `docs/PROGRESS.md` Step 08, Commit „m1-step-08: crooked overhead projector briefing and report", Push.

## Verification
- **Statisch:** Copy exakt wie Doku; Quad schief/emissiv; Skript parst.
- **CI:** grün.
- **Windows:** F5 → schiefe, leicht flackernde Folie mit Briefing-Text; `show_report()` zeigt den bitteren Nachbericht.

## Tone/Safety-Gate
`tone-safety-gate` — Punkt 2 (Projektor statt Map) und Punkt 8 (Humor trifft Autorität).

## Commit-Protokoll
`m1-step-08: crooked overhead projector briefing and report` → Push.

## Anti-Patterns / Red Flags
Sauberer UI-/Map-Screen statt Folie · gerade/perfekt statt schief · Copy umformuliert/verharmlost oder zynisch gegen Opfer · echte Karteninteraktion · Timeline hier final orchestrieren (gehört in 09).
