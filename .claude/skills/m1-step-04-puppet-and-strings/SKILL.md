---
name: m1-step-04-puppet-and-strings
description: Milestone 1, Schritt 04 — die Gegner-Puppe als flachen, unbeleuchteten 2D-Cutout an sichtbaren Schnüren bauen, steif animiert, sofort vom Darsteller unterscheidbar. Puppet.gd + StageStrings.gd. Noch ohne Zerlegen (Schritt 05). Zuerst godot-step-protocol aufrufen.
---

# M1 · Schritt 04 — Puppe & Schnüre (2D-Rolle)

> Zuerst `godot-step-protocol`. Technik: `docs/GODOT_CONVENTIONS.md` §6,§7,§8,§11. Kontrast-Gegenstück: Schritt 03.

## Objective
Die Kriegsmaschinen-Puppe als flacher, unbeleuchteter Cutout an sichtbaren Schnüren — steif, frontal, sofort als „Rolle/Ding" vom menschlichen Darsteller unterscheidbar.

## Preconditions / depends-on
Schritt 02 🟢 (Look). Ideal nach/parallel zu Schritt 03 (Kontrast direkt prüfbar).

## Definition of Done + Quality Bar
- `PlaceholderTextures.puppet_tex()` erzeugt eine **steifere, grauere, eckige** Cutout-Silhouette mit sichtbaren Gelenk-Lücken — klar anders als der Performer.
- `Puppet/Cutout` = `Sprite3D` mit `puppet_flat`-Material (**unshaded**, Billboard **disabled**, Alpha-Scissor, Linear+Mipmaps), `cast_shadow = OFF`.
- `Puppet/Strings` via `StageStrings.gd`: 3–4 dünne, faint-off-white, unshaded `BILLBOARD_Y`-Quads von der `FliesBar` zu Cutout-„Gelenken".
- Steifes Idle: kleines, **gestuftes** (diskretes) Zittern/Schwanken — bewusst nicht flüssig (Kontrast zum Performer-Wippen).
- **Quality Bar:** Ein Betrachter erkennt **sofort** (ohne Erklärung), dass Puppe und Darsteller verschiedene „Arten Ding" sind — über Schatten-Abwesenheit, Steifheit, Schnüre, Flachheit. Schnüre verschwinden nicht kantenweise.

## Exact procedure
1. `PlaceholderTextures.puppet_tex()` ergänzen.
2. `scripts/StageStrings.gd` (`extends Node3D`): `make_string(from, to) -> MeshInstance3D` (dünnes Quad/Box, BILLBOARD_Y, unshaded, faint), `go_slack()` (für Schritt 05).
3. `scripts/Puppet.gd` (`extends Node3D`): `Cutout` als `Sprite3D` (Material aus `puppet_flat.tres`, dupliziert, Textur gesetzt), `Strings` aufbauen (oben an FliesBar), gestuftes Idle in `_process`.
4. In `StageBootstrap` `Puppet` instanzieren, neben den Performer stellen.
5. Kontrast visuell prüfen. Statisch prüfen; committen; CI grün.

## Files touched
`scripts/PlaceholderTextures.gd` (erweitert), `scripts/StageStrings.gd` (neu), `scripts/Puppet.gd` (neu), `scripts/StageBootstrap.gd` (Instanzierung), ggf. `assets/materials/puppet_flat.tres`.

## Ready-to-paste Agent-Prompt
> Baue die Gegner-Puppe als flachen 2D-Cutout an Schnüren (`docs/GODOT_CONVENTIONS.md` §6/§7/§8/§11). **Sicherheit:** Puppe = Kriegsmaschine/Rolle, darf (ab Schritt 05) real zerlegt werden; in diesem Schritt nur Idle. (a) `PlaceholderTextures.puppet_tex()`: steifere, grauere, eckige Cutout-Silhouette mit Gelenk-Lücken — klar anders als der Performer, prozedural, transparent. (b) `scripts/StageStrings.gd`: `make_string(from,to)->MeshInstance3D` (dünnes BILLBOARD_Y-Quad, unshaded, faint off-white, kein Schatten), `go_slack()` (für später). (c) `scripts/Puppet.gd` (`extends Node3D`): `Cutout` als `Sprite3D` mit **unshaded** Material (Billboard disabled, Alpha-Scissor, Linear+Mipmaps, `cast_shadow OFF`), `Strings` von der `FliesBar` zu Gelenkpunkten, gestuftes/steifes Idle-Zittern in `_process` (bewusst nicht flüssig). (d) In `StageBootstrap` neben den Performer instanzieren. Ziel: Performer vs. Puppe **sofort** unterscheidbar. API gegen Godot 4.3 prüfen. Abschluss: `tone-safety-gate`, `/code-review`, `docs/PROGRESS.md` Step 04, Commit „m1-step-04: add flat 2D puppet on visible strings", Push.

## Verification
- **Statisch:** unshaded/no-shadow gesetzt; Schnur-Quads BILLBOARD_Y; Skripte parsen.
- **CI:** grün.
- **Windows:** F5 → Puppe steht steif, flach, ohne Schatten, an sichtbaren Schnüren; Kontrast zum Performer ist auf einen Blick klar.

## Tone/Safety-Gate
`tone-safety-gate` — Punkt 4 (sofortige Unterscheidbarkeit) muss klar JA sein.

## Commit-Protokoll
`m1-step-04: add flat 2D puppet on visible strings` → Push.

## Anti-Patterns / Red Flags
Puppe beleuchtet/mit Schatten (verwechselbar) · flüssige/menschliche Animation · keine Schnüre · Schnüre verschwinden kantenweise · Zerlegen hier schon einbauen (gehört in 05).
