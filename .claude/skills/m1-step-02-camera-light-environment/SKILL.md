---
name: m1-step-02-camera-light-environment
description: Milestone 1, Schritt 02 — den HD-2D-Theater-Look setzen: Diorama-Kamera (Octopath-Winkel), Key-Spot mit Schatten, warmes Fill, Footlights, WorldEnvironment mit Bloom/Tonemap/warmer Färbung und dezentem Tilt-Shift-DoF. Zuerst godot-step-protocol aufrufen.
---

# M1 · Schritt 02 — Kamera, Licht & Environment (der Look)

> Zuerst `godot-step-protocol`. Technik: `docs/GODOT_CONVENTIONS.md` §9,§10. Look-Ziel: `reference/1781315900594.png`.

## Objective
Der „Miniatur-Theater"-Look entsteht: angewinkelte Diorama-Kamera, theatralische Beleuchtung, warmes Post-Processing mit dezentem Tilt-Shift.

## Preconditions / depends-on
Schritt 01 🟢.

## Definition of Done + Quality Bar
- Provisorische Kamera/Licht aus Schritt 01 ersetzt durch finalen `Lighting`-Teilbaum (`KeySpot` `SpotLight3D` Schatten **ON**; `WarmFill` Schatten **OFF**, niedrig; 2–3 `Footlights` `OmniLight3D` warm/niedrig) und `StageCamera` (hoher 3/4-Diorama-Winkel, Werte als `@export`).
- `WorldEnvironment` → `Environment` in Code: dunkler Hintergrund, niedriges Ambient, **Glow/Bloom** (hohe Schwelle, nur Footlights blühen), **Tonemap = Filmic**, **Adjustments** warm/leicht kontrastreich.
- `CameraAttributesPractical` mit **dezentem DoF** (Near/Far als `@export`) für den Tilt-Shift-Miniatur-Effekt.
- **Quality Bar:** Das Standbild liest sich sofort als „kleine Theaterbühne in warmem Licht", nicht als nüchterne 3D-Szene. DoF ist spürbar, aber **nicht matschig**; Bloom hebt nur die Footlights, überstrahlt nichts. Verarbeitungsreihenfolge beachtet (DoF→Glow→Tonemap→Adjustments).

## Exact procedure
1. Provisorische Kamera/Licht entfernen.
2. `_build_lighting()`: KeySpot (angewinkelt auf die Bühnenmitte, Schatten an, weiche Schattenparameter), WarmFill, Footlights vorne.
3. `_build_environment()`: `Environment` erzeugen, Glow/Tonemap/Adjustments setzen; an `WorldEnvironment` hängen.
4. `_build_camera()`: `StageCamera`, Position/Pitch/FOV als `@export` (Startwerte Konventionen §10); `CameraAttributesPractical` mit DoF anhängen.
5. Werte konservativ tunen (dezent). Statisch prüfen; committen; CI grün.

## Files touched
`scripts/StageBootstrap.gd` (erweitert).

## Ready-to-paste Agent-Prompt
> Setze den HD-2D-Theater-Look in `scripts/StageBootstrap.gd` (`docs/GODOT_CONVENTIONS.md` §9/§10). **Sicherheit:** rein visuell. Ersetze die provisorische Kamera/Licht aus Schritt 01: baue `Lighting` (`KeySpot` SpotLight3D mit weichen Schatten ON, `WarmFill` ohne Schatten/niedrig, 2–3 `Footlights` OmniLight3D warm/niedrig) und `StageCamera` (Camera3D, hoher 3/4-Diorama-Winkel, Position/Pitch/FOV als `@export`, Startwerte aus §10). Baue ein `WorldEnvironment`→`Environment` in Code: dunkler Hintergrund, niedriges Ambient, Glow/Bloom mit hoher Schwelle (nur Footlights blühen), Tonemap Filmic, warme Adjustments. Hänge `CameraAttributesPractical` mit **dezentem** DoF (Near/Far als `@export`) an die Kamera (Tilt-Shift-Miniatur). Halte DoF/Bloom zurückhaltend (nicht matschig/überstrahlt); Reihenfolge DoF→Glow→Tonemap→Adjustments beachten. API gegen Godot 4.3 prüfen (CameraAttributesPractical, Environment-Glow/Tonemap-Enums). Abschluss: `tone-safety-gate`, `/code-review`, `docs/PROGRESS.md` Step 02, Commit „m1-step-02: theatrical camera, lighting and HD-2D post", Push.

## Verification
- **Statisch:** Enum-/Property-Namen gegen 4.3 bestätigt; Skript parst.
- **CI:** grün.
- **Windows:** F5 → warm beleuchtete Miniatur-Bühne; weicher Schatten unter dem Key-Spot sichtbar (auf einem Testobjekt/Boden); dezenter DoF; Footlight-Bloom ohne Überstrahlung.

## Tone/Safety-Gate
`tone-safety-gate` — „wirkt wie Bühne" muss klar JA sein.

## Commit-Protokoll
`m1-step-02: theatrical camera, lighting and HD-2D post` → Push.

## Anti-Patterns / Red Flags
Überzogener Bloom/DoF (Matsch) · kalte/neutrale Lichtstimmung · realistischer Außenlicht-Look · Tonemap/Glow in falscher Reihenfolge gedacht · Kamera ohne Diorama-Winkel (zu frontal/flach).
