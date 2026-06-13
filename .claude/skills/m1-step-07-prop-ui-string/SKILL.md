---
name: m1-step-07-prop-ui-string
description: Milestone 1, Schritt 07 — ein UI-Element als physische Requisite bauen: ein Filzherz, das an einer Schnur von der Flies-Bar hängt, pendelt und beim Zerlegen der Puppe reagiert. PropUIString.gd. Kein klassischer HUD. Zuerst godot-step-protocol aufrufen.
---

# M1 · Schritt 07 — Prop-UI an der Schnur (UI = Requisite)

> Zuerst `godot-step-protocol`. Technik: Konventionen §11. Prinzip: Concept-Bibel §7 „UI ist Requisite".

## Objective
Ein UI-Element existiert als hängende, pendelnde Bühnen-Requisite (Filzherz) statt als flacher HUD — und reagiert auf das Geschehen.

## Preconditions / depends-on
Schritt 05 🟢 (damit `Puppet.dismantled` zum Reagieren da ist). Look aus Schritt 02.

## Definition of Done + Quality Bar
- `scripts/PropUIString.gd` (`extends Node3D`): baut `String` (dünnes Quad, oben an `FliesBar` verankert) + `Prop` (`Sprite3D` Filzherz, **leicht beleuchtet**, damit es als physisches Objekt liest).
- Pendel-Bewegung: Sinus-Schwingung um den oberen Anker (das Herz schwingt **unter** seiner Schnur, schwebt nie frei).
- `pulse()`/`set_morale(v)`: kleiner Skalen-/Neige-Impuls, ausgelöst bei `Puppet.dismantled`.
- **Quality Bar:** Es liest sich sofort als physische Requisite an einer Schnur (hängt, pendelt, reagiert), **nicht** als HUD-Zahl/-Leiste.

## Exact procedure
1. `PlaceholderTextures.heart_tex()` ergänzen (Filzherz-Silhouette).
2. `scripts/PropUIString.gd`: `String` + `Prop` aufbauen; Pendel in `_process`; `pulse()`.
3. In `StageBootstrap`: `PropUI_Heart` an der Seite instanzieren, oben an `FliesBar`; `Puppet.dismantled` → `pulse()`.
4. Prüfen: hängt/pendelt/reagiert, kein HUD. Committen; CI grün.

## Files touched
`scripts/PlaceholderTextures.gd` (erweitert), `scripts/PropUIString.gd` (neu), `scripts/StageBootstrap.gd` (Instanzierung + Verdrahtung).

## Ready-to-paste Agent-Prompt
> Baue ein UI-Element als **physische Requisite** (`docs/GODOT_CONVENTIONS.md` §11; Prinzip „UI ist Requisite"). **Sicherheit:** rein Bühnenobjekt. (a) `PlaceholderTextures.heart_tex()`: Filzherz-Silhouette, on-palette, transparent. (b) `scripts/PropUIString.gd` (`extends Node3D`): `String` (dünnes Quad, oben an `FliesBar` verankert) + `Prop` (`Sprite3D` Herz, **leicht beleuchtet**, damit es physisch wirkt); Pendel-Schwingung per Sinus um den oberen Anker (hängt darunter, schwebt nie frei); `pulse()` (kleiner Skalen-/Neige-Impuls). (c) In `StageBootstrap` seitlich an der `FliesBar` instanzieren und `Puppet.dismantled` → `pulse()` verdrahten. Ziel: liest sich als hängende, pendelnde Requisite, **kein** HUD. API gegen Godot 4.3 prüfen. Abschluss: `tone-safety-gate` (Punkt 3 UI=Requisite), `/code-review`, `docs/PROGRESS.md` Step 07, Commit „m1-step-07: prop-based UI heart on a swinging string", Push.

## Verification
- **Statisch:** Verankerung an FliesBar; Pendel um oberen Pivot; `pulse` an Signal; Skripte parsen.
- **CI:** grün.
- **Windows:** F5 → Herz hängt an Schnur, pendelt sanft, zuckt beim Zerlegen der Puppe; wirkt physisch, nicht wie HUD.

## Tone/Safety-Gate
`tone-safety-gate` — Punkt 3 (UI physische Requisite, kein HUD) zentral.

## Commit-Protokoll
`m1-step-07: prop-based UI heart on a swinging string` → Push.

## Anti-Patterns / Red Flags
Flacher 2D-HUD/Overlay-Zahl/-Leiste · Herz schwebt frei ohne Schnur/Pivot · Prop unbeleuchtet/flach wie eine Puppe (Verwechslung) · mehrere UI-Elemente auf einmal (Scope).
