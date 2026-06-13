---
name: m1-step-05-dismantle-and-ketchup
description: Milestone 1, Schritt 05 — die komödiantische Zerlegung der Puppe auf Tastendruck (Pappteile fliegen, Schnüre fallen schlaff, Signal) plus theatralischer Ketchup-Partikel-Burst, der eindeutig als Bühnenfarbe lesbar ist. Puppet.dismantle() + KetchupBurst.gd. Zuerst godot-step-protocol aufrufen.
---

# M1 · Schritt 05 — Zerlegen & Ketchup (asymmetrische Zerstörung)

> Zuerst `godot-step-protocol`. Sicherheit zentral: `docs/TONE.md` §0–§3. Technik: Konventionen §8,§11.

## Objective
Auf Tastendruck zerlegt sich die Puppe komödiantisch; ein roter Ketchup-Burst ploppt, eindeutig als Bühnenfarbe (nie Blut).

## Preconditions / depends-on
Schritt 04 🟢 (Puppe + Schnüre vorhanden).

## Definition of Done + Quality Bar
- Input-Aktion `dismantle` (Leertaste/E + Gamepad-South) gebunden; in `StageBootstrap` abgefragt, ruft `puppet.dismantle()`.
- `Puppet.dismantle()`: (1) `Cutout` verstecken; (2) `DismantleParts` (ein paar Pappteil-`MeshInstance3D`-Quads) einblenden/spawnen und mit Impuls wegschleudern/umklappen; (3) `Strings.go_slack()`; (4) `KetchupBurst.fire(global_position)`; (5) `emit_signal("dismantled")`. **Strikt self-contained** — referenziert nie den Performer.
- `scripts/KetchupBurst.gd` (`GPUParticles3D`): `one_shot`, hohe `explosiveness`, ~40–60 Partikel, kurze Lebensdauer, Aufwärts-+Streu-Velocity, **übersättigtes Comic-Rot**, Klecks-/Konfetti-Form — **kein** realistisches Blut.
- **Quality Bar:** Die Zerlegung ist lesbar komisch (Würdeverlust der Maschine), nicht grausam; Ketchup wirkt unzweifelhaft wie Farbe/Theaterpampe. Der Effekt trifft **nur** die Puppe.

## Exact procedure
1. `dismantle`-Event binden (StageBootstrap._register_input).
2. `scripts/KetchupBurst.gd`: GPUParticles3D in Code konfigurieren (`ParticleProcessMaterial`), `fire(at)`-Methode (`global_position=at; restart(); emitting=true`).
3. `Puppet.dismantle()` implementieren (s. DoD); `signal dismantled` deklarieren; `DismantleParts`-Knoten vorbereiten.
4. In `StageBootstrap`: bei `dismantle`-Action `puppet.dismantle()`; `KetchupBurst` als Knoten vorhanden.
5. Prüfen, dass Ketchup als Farbe liest; nur Puppe betroffen. Committen; CI grün.

## Files touched
`scripts/Puppet.gd` (erweitert), `scripts/KetchupBurst.gd` (neu), `scripts/StageBootstrap.gd` (Input + Verdrahtung).

## Ready-to-paste Agent-Prompt
> Implementiere die komödiantische Zerlegung der Puppe + Ketchup. **Sicherheit zuerst (zentral):** Zerlegt wird NUR die Puppe (Rolle/Maschine); der Effekt darf den Performer nie als Gewaltschaden treffen. Ketchup muss **eindeutig Bühnenfarbe** sein — übersättigtes Comic-Rot, Klecks-/Spritzer-Form, theatralisch — **nie** realistisches Blut. (a) Binde Input-Aktion `dismantle` (Leertaste/E + Gamepad-South) in `StageBootstrap`. (b) `scripts/KetchupBurst.gd` (`GPUParticles3D`): `one_shot`, hohe explosiveness, ~40–60 Partikel, kurze Lifetime, Aufwärts+Streuung, Comic-Rot, Klecks-Quad; Methode `fire(at: Vector3)`. (c) `Puppet.dismantle()`: Cutout verstecken → `DismantleParts` (Pappteil-Quads) mit Impuls wegschleudern/umklappen → `Strings.go_slack()` → `KetchupBurst.fire(global_position)` → `emit_signal("dismantled")`; **referenziere nie den Performer**. (d) In `StageBootstrap` bei `dismantle` `puppet.dismantle()` aufrufen. Ziel: Würdeverlust der Maschine, komisch nicht grausam. API gegen Godot 4.3 prüfen (GPUParticles3D, ParticleProcessMaterial). Abschluss: `tone-safety-gate` (Punkte 5–7 besonders), `/code-review`, `docs/PROGRESS.md` Step 05, Commit „m1-step-05: comedic puppet dismantle with ketchup burst", Push.

## Verification
- **Statisch:** `dismantle`-Aktion existiert; `KetchupBurst.fire` nur aus `Puppet`; Signal verdrahtet; Skripte parsen.
- **CI:** grün.
- **Windows:** F5 → Tastendruck zerlegt die Puppe (Teile fliegen, Schnüre schlaff), roter Ketchup ploppt und liest sich als Farbe; Performer unberührt.

## Tone/Safety-Gate
`tone-safety-gate` — Punkte 5 (nur Puppen), 6 (kein Kind-Gewaltschaden), 7 (Ketchup=Farbe) sind kritisch.

## Commit-Protokoll
`m1-step-05: comedic puppet dismantle with ketchup burst` → Push.

## Anti-Patterns / Red Flags
Ketchup wie realistisches Blut · Effekt trifft/erwähnt den Performer · grausam statt komisch · `dismantle` zerlegt versehentlich Bühne/Props · Slapstick-/Sicherheits-Beats des Performers hier einbauen (gehört in 06).
