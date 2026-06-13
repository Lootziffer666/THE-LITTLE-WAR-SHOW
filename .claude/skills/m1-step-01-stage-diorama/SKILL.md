---
name: m1-step-01-stage-diorama
description: Milestone 1, Schritt 01 — die leere HD-2D-Theaterbühne als 3D-Diorama in Code aufbauen (Boden, Proszenium, roter Vorhang, Seitenkulissen, Flies-Bar) in StageBootstrap.gd. Noch ohne Licht-Feinschliff/Figuren. Zuerst godot-step-protocol aufrufen.
---

# M1 · Schritt 01 — Bühnen-Diorama (leer)

> Zuerst `godot-step-protocol`. Technik: `docs/GODOT_CONVENTIONS.md` §3,§4,§12. Look-Ziel: `reference/1781315900594.png`.

## Objective
Eine leere, glaubhafte Theaterbühne als 3D-Diorama, vollständig in `StageBootstrap.gd` aufgebaut.

## Preconditions / depends-on
Schritt 00 🟢.

## Definition of Done + Quality Bar
- `StageBootstrap._ready()` baut den `World`-Teilbaum nach Konventionen §12: `StageFloor` (Holz-`BoxMesh` ~8×0,2×5, empfängt Schatten), `BackdropScreen` (hohe `QuadMesh` upstage), `ProsceniumFrame` mit `CurtainLeft/CurtainRight/CurtainTop` (tiefrot) und `FliesBar` (dünne horizontale Stange oben).
- Materialien schlicht, aber farbstimmig zum Referenzbild (warmes Holz, sattes Rot, dunkler Raum).
- **Quality Bar:** Beim Start steht eine erkennbare, leere Bühne im Bild; Proportionen wirken wie eine kleine Bühne (kein endloser Boden); nichts schwebt sichtbar falsch. (Kamera/Licht final erst Schritt 02 — ein **provisorischer** Kamera-/Lichtknoten darf gesetzt werden, damit etwas sichtbar ist, wird in 02 ersetzt/verfeinert.)

## Exact procedure
1. In `StageBootstrap.gd` Hilfsfunktionen `_build_world()` etc.; in `_ready()` aufrufen.
2. `StageFloor`: `MeshInstance3D` + `BoxMesh`, warmes Holz-`StandardMaterial3D`, `y` so, dass Oberkante = 0.
3. `BackdropScreen`: `QuadMesh` upstage (z. B. z ≈ -2.5), hoch genug als Projektionsfläche (dient Schritt 08).
4. `ProsceniumFrame`: zwei Seitenvorhänge (schmale hohe Boxen/Quads, tiefrot), oben ein Vorhang-Volant, `FliesBar` als dünne Box über der Bühne (Verankerung für Schnüre/Props später).
5. Provisorische `Camera3D` + `DirectionalLight3D`, nur damit das Bild sichtbar ist (Kommentar: „wird in Schritt 02 ersetzt").
6. Statisch prüfen; committen; CI grün.

## Files touched
`scripts/StageBootstrap.gd` (erweitert).

## Ready-to-paste Agent-Prompt
> Baue die leere Theaterbühne als 3D-Diorama vollständig in `scripts/StageBootstrap.gd` (Aufbau-in-Code, `docs/GODOT_CONVENTIONS.md` §3/§12). **Sicherheit:** rein Kulisse, keine Figuren/keine Gewalt. Erzeuge den `World`-Teilbaum mit exakten Knotennamen: `StageFloor` (Holz-BoxMesh ~8×0,2×5, Oberkante y=0, empfängt Schatten), `BackdropScreen` (hohe QuadMesh upstage als spätere Projektionsfläche), `ProsceniumFrame` mit `CurtainLeft`/`CurtainRight`/`CurtainTop` (tiefrot) und `FliesBar` (dünne Stange oben). Farben stimmig zu `reference/1781315900594.png` (warmes Holz, sattes Rot, dunkler Raum). Setze eine **provisorische** Camera3D + DirectionalLight3D nur zur Sichtbarkeit (Kommentar: ersetzt in Schritt 02). Keine Figuren, kein UI, kein Feinschliff am Licht. API gegen Godot 4.3 prüfen; Startmaße als `@export`. Abschluss: `tone-safety-gate`, `/code-review`, `docs/PROGRESS.md` Step 01, Commit „m1-step-01: build empty stage diorama in code", Push.

## Verification
- **Statisch:** Knotennamen = Konventionen §12; Skript parst; keine 3.x-API.
- **CI:** grün.
- **Windows:** F5 → leere Bühne sichtbar (Boden, roter Rahmen, Rückwand), plausible Bühnen-Proportionen.

## Tone/Safety-Gate
`tone-safety-gate` — Frame-Punkte (Bühne, nicht Schlachtfeld) bewusst abhaken.

## Commit-Protokoll
`m1-step-01: build empty stage diorama in code` → Push.

## Anti-Patterns / Red Flags
Endlos-Boden/Skybox-Naturraum · realistische Umgebung statt Theater · finale Kamera/Licht hier schon „perfekt" tunen (gehört in 02) · Figuren/UI vorgreifen · große `.tscn`.
