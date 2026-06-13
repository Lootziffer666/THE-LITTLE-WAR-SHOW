---
name: m1-step-00-project-scaffold
description: Milestone 1, Schritt 00 — Godot-4.3-Projektgerüst für "The Little War Show" anlegen und Repo aufräumen. project.godot, .gitignore, Ordnerstruktur, Docs/PNGs verschieben, icon, minimale Main.tscn + StageBootstrap-Stub. Ergebnis öffnet fehlerfrei in Godot. Zuerst godot-step-protocol aufrufen.
---

# M1 · Schritt 00 — Projektgerüst & Repo-Aufräumen

> Zuerst `godot-step-protocol`. Sicherheit: `tone-safety-gate`. Technik: `docs/GODOT_CONVENTIONS.md`.

## Objective
Ein lauffähiges, leeres Godot-4.3-Projekt mit sauberer Struktur, das in der Engine fehlerfrei öffnet und ein schwarzes Fenster startet.

## Preconditions / depends-on
Keine (erster Schritt). Branch `claude/practical-lovelace-vz59lr`.

## Definition of Done + Quality Bar
- `project.godot` mit den Kern-Einstellungen aus Konventionen §5 vorhanden; **Forward+**; `4.3`-Feature gepinnt.
- Ordnerstruktur (Konventionen §4) angelegt; leere Ordner mit `.gitkeep`.
- Die 7 bestehenden Markdown-Dokumente liegen via `git mv` in `/docs`; die 4 PNGs via `git mv` in `/reference`; `reference/.gdignore` (leer) vorhanden.
- `scenes/Main.tscn` = `Node3D`-Root „Main" mit `scripts/StageBootstrap.gd`; der Stub baut nur einen leeren Knoten und gibt per `print()` „stage ready" aus.
- `.gitignore` schließt `.godot/` aus; committet werden `.tscn/.gd/.tres/.import/.gdshader/icon.svg`.
- **Quality Bar:** Projekt öffnet in Godot 4.3 ohne Fehler/Warnungen im Output; F5 zeigt schwarzes Fenster; keine verwaisten Pfade.

## Exact procedure
1. `git mv` aller `THE_LITTLE_WAR_SHOW_*.md` nach `docs/`; `git mv` der vier `17813*.png` nach `reference/`. (Die in diesem Planungspaket bereits erstellten `docs/*`-Dateien bleiben.)
2. `reference/.gdignore` (leer) anlegen.
3. Ordner `scenes/`, `scripts/`, `assets/sprites/`, `assets/stage/`, `assets/materials/` anlegen, leere mit `.gitkeep`.
4. `icon.svg` (einfaches Platzhalter-Icon) anlegen; in `project.godot` referenzieren.
5. `project.godot` schreiben (Konventionen §5: application/rendering/display/input). Input-Aktionen **leer** deklarieren.
6. `.gitignore` schreiben (`.godot/`).
7. `scenes/Main.tscn` minimal: `[gd_scene]`, Root `Node3D` „Main", `ext_resource` auf `scripts/StageBootstrap.gd`.
8. `scripts/StageBootstrap.gd`: `extends Node3D`; `func _ready(): print("stage ready")`.
9. Statisch prüfen; committen; CI grün abwarten.

## Files touched
`project.godot`, `.gitignore`, `icon.svg`, `scenes/Main.tscn`, `scripts/StageBootstrap.gd`, `reference/.gdignore`, `assets/**/.gitkeep`; sowie die `git mv`-Verschiebungen.

## Ready-to-paste Agent-Prompt
> Lege das Godot-4.3-Projektgerüst für „The Little War Show" an (Forward+, Windows-Ziel). **Sicherheit zuerst:** keine Inhalte, die Kinder als Gewaltopfer zeigen — hier ohnehin nur Gerüst. Schritte: (a) `git mv` der 7 `THE_LITTLE_WAR_SHOW_*.md` nach `docs/`, der 4 `17813*.png` nach `reference/`; (b) `reference/.gdignore` leer; (c) Ordner scenes/scripts/assets{sprites,stage,materials} mit `.gitkeep`; (d) `project.godot` exakt nach `docs/GODOT_CONVENTIONS.md` §5 (main_scene `res://scenes/Main.tscn`, `forward_plus`, Linear-Filter, MSAA 2, dunkler clear_color, leere Input-Aktionen move_*/dismantle/restage); (e) `.gitignore` mit `.godot/`; (f) minimale `scenes/Main.tscn` (Node3D „Main" + `scripts/StageBootstrap.gd`); (g) `StageBootstrap.gd`: `extends Node3D`, `_ready()` druckt „stage ready". Keine weitere Logik. API gegen Godot 4.3 prüfen. Abschluss: `tone-safety-gate`, `/code-review`, statischer Check, `docs/PROGRESS.md` Step 00 → 🟡/🟢, Commit „m1-step-00: scaffold Godot 4.3 project and tidy repo", Push.

## Verification
- **Statisch:** `project.godot` `config_version=5`, `main_scene` existiert; `Main.tscn` `load_steps` korrekt, Skriptpfad löst auf; `StageBootstrap.gd` parst.
- **CI:** Workflow läuft, importiert Projekt, keine Parse-Fehler → grün.
- **Windows:** Import `project.godot` → F5 → schwarzes Fenster; Output zeigt „stage ready", keine Fehler.

## Tone/Safety-Gate
`tone-safety-gate` — trivial grün (kein Inhalt), trotzdem abhaken.

## Commit-Protokoll
`m1-step-00: scaffold Godot 4.3 project and tidy repo` → Push `claude/practical-lovelace-vz59lr`.

## Anti-Patterns / Red Flags
Große `Main.tscn` von Hand · UIDs von Hand · PNGs als Import (statt `.gdignore`) · Spiel-Logik im Stub · `.godot/` committen · Mobile/Compatibility statt Forward+.
