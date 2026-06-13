---
name: m1-step-03-performer
description: Milestone 1, Schritt 03 — den steuerbaren Darsteller (Kind) als beleuchteten, billboardeten Sprite3D mit Bodenkontakt und weichem Schlagschatten bauen; Bewegung per WASD/Gamepad. Performer.gd + PlaceholderTextures.gd. Zuerst godot-step-protocol aufrufen.
---

# M1 · Schritt 03 — Steuerbarer Performer (3D-Körper)

> Zuerst `godot-step-protocol`. Technik: `docs/GODOT_CONVENTIONS.md` §6,§7,§10. Kontrast-Gegenstück: Schritt 04.

## Objective
Ein verkörpert wirkender, steuerbarer Darsteller: billboardeter `Sprite3D`, beleuchtet, mit Füßen am Boden und weichem Schlagschatten, bewegbar per Tastatur+Gamepad.

## Preconditions / depends-on
Schritt 02 🟢 (Licht/Kamera vorhanden, sonst kein Schatten/Look prüfbar).

## Definition of Done + Quality Bar
- `PlaceholderTextures.performer_tex()` erzeugt prozedural eine klare Kind-/Mensch-Silhouette (transparent, on-palette) — **kein** Referenz-PNG.
- `Performer/Sprite` = `Sprite3D` mit `performer_billboard`-Material (beleuchtet, BILLBOARD_Y, Alpha-Scissor, Linear+Mipmaps), `cast_shadow = ON`, Fuß-Pivot (`centered=false`, `offset=(-w/2,0)`), Eltern auf `y=0`.
- **Bodenkontakt gelöst:** Füße berühren auch am schrägen Kamerawinkel den Boden; Schatten entsteht am Kontaktpunkt. Falls reines Y-Billboard abhebt/clippt → Tiefen-Offset-Shader oder Pivot/`pixel_size` tunen (Konventionen §7).
- Bewegung in `_physics_process` via `Input.get_vector("move_left","move_right","move_forward","move_back")` auf XZ; Bewegungsgrenzen (`@export AABB`/Min-Max) clampen auf die Bühne; leichtes „menschliches" Wippen.
- **Quality Bar:** Der Darsteller wirkt verkörpert (Schatten, flüssige Bewegung), läuft mit WASD **und** Gamepad, verlässt die Bühne nicht, Füße kleben nicht in der Luft.

## Exact procedure
1. `scripts/PlaceholderTextures.gd` (static helper) mit `performer_tex() -> ImageTexture` via `Image.create()` + Pixel-Zeichnung (Silhouette, Helm-Andeutung, on-palette).
2. Input-Events binden: in `StageBootstrap._register_input()` `InputMap.action_add_event` für move_* (WASD + linker Stick + D-Pad).
3. `scripts/Performer.gd` (`extends Node3D`): baut `Sprite` als `Sprite3D` mit dem Material (aus `assets/materials/performer_billboard.tres`, dupliziert, Textur gesetzt); Bewegung + Clamp + Wippen.
4. In `StageBootstrap` `Performer` instanzieren, auf die Bühne setzen.
5. Bodenkontakt verifizieren/tunen. Statisch prüfen; committen; CI grün.

## Files touched
`scripts/PlaceholderTextures.gd` (neu), `scripts/Performer.gd` (neu), `scripts/StageBootstrap.gd` (Instanzierung + Input), ggf. `assets/materials/performer_billboard.tres`.

## Ready-to-paste Agent-Prompt
> Baue den steuerbaren Darsteller für „The Little War Show" (`docs/GODOT_CONVENTIONS.md` §6/§7/§10). **Sicherheit zuerst:** der Darsteller ist ein Kind/Mensch und wird NIE Opfer von Gewalt; hier nur Bewegung, kein Schaden. (a) `scripts/PlaceholderTextures.gd` mit `performer_tex() -> ImageTexture`: prozedurale, klar als Kind/Mensch lesbare Silhouette, transparent, on-palette — **kein** Referenz-PNG. (b) `scripts/Performer.gd` (`extends Node3D`): `Sprite` als `Sprite3D` mit beleuchtetem Material (BILLBOARD_Y, Alpha-Scissor, Linear+Mipmaps, `cast_shadow ON`), Fuß-Pivot (`centered=false`, `offset=(-w/2,0)`), Eltern y=0; **Bodenkontakt** sicherstellen (Füße am Boden auch am schrägen Winkel; bei Bedarf Tiefen-Offset-Shader oder Pivot/`pixel_size` tunen). Bewegung in `_physics_process` via `Input.get_vector(...)` (WASD+Stick+D-Pad, in `StageBootstrap._register_input()` per `InputMap.action_add_event` gebunden), Bühnen-Clamp als `@export`, leichtes Wippen. (c) In `StageBootstrap` instanzieren. API gegen Godot 4.3 prüfen (Sprite3D-Enums, InputMap). Abschluss: `tone-safety-gate`, `/code-review`, `docs/PROGRESS.md` Step 03, Commit „m1-step-03: add controllable performer billboard with ground shadow", Push.

## Verification
- **Statisch:** Material-/Enum-Namen 4.3; `Input.get_vector`-Aktionen existieren; Skripte parsen.
- **CI:** grün.
- **Windows:** F5 → Darsteller steht mit weichem Schatten am Boden, läuft mit WASD und Gamepad, bleibt auf der Bühne, Füße am Boden.

## Tone/Safety-Gate
`tone-safety-gate` — Darsteller verkörpert/menschlich; keinerlei Schadensmechanik.

## Commit-Protokoll
`m1-step-03: add controllable performer billboard with ground shadow` → Push.

## Anti-Patterns / Red Flags
Referenz-PNG als Textur · unbeleuchtet/ohne Schatten (verwechselbar mit Puppe) · Füße schweben/clippen · HP-/Schadenszustand · Puppe/UI vorgreifen · 3.x-API.
