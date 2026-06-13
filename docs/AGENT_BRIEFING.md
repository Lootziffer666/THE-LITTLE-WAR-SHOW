# Agent-Briefing — wie ein LLM für dieses Projekt optimal angeleitet wird

**Zweck:** Damit jeder Entwicklungsschritt unabhängig vom Tagesform-Modell die gleiche hohe Latte trifft. Dieses Dokument erklärt die Brief-Prinzipien; der wiederverwendbare Skill `.claude/skills/brief-frontier-agent/SKILL.md` erzeugt daraus den konkreten Prompt pro Schritt.

> Hintergrund für den Auftraggeber: „Briefing" = die Anweisung, die du (oder ich) einem KI-Agenten gibst, bevor er einen Schritt umsetzt. Ein guter Brief entscheidet über 80 % des Ergebnisses. Du musst das nicht selbst schreiben — die Schritt-Skills enthalten je einen fertigen, einfügbaren Brief.

---

## 1. Die sechs Brief-Prinzipien (immer)
1. **Atomarer Scope.** Genau ein Belang. „Baue den steuerbaren Performer" — nicht „baue Performer und Puppe und UI". Ein überladener Brief erzeugt game-breaking Verflechtung.
2. **Kontext zuerst, vollständig.** Den Agenten nicht raten lassen: Engine-Version, Renderer, das Aufbau-in-Code-Muster, die Material-Konventionen, die Zielwirkung. Lieber drei Sätze zu viel als ein fehlender.
3. **Sicherheits-Präambel oben.** Jeder Brief beginnt mit der geschärften Regel aus `TONE.md` (Kinder nie Gewaltopfer; Ketchup=Farbe; Puppen werden zerlegt). Nicht ans Ende — an den Anfang.
4. **Definition of Done + Quality Bar konkret.** Testbar formulieren („Füße berühren den Boden, weicher Schatten am Kontaktpunkt, bewegt sich mit WASD+Gamepad"), nicht „mach es gut".
5. **Anti-Patterns explizit verbieten.** Sag, was NICHT passieren darf (kein HUD, keine Map, kein Splatter an Kindern, keine große `.tscn` von Hand, keine 3.x-API). Modelle vermeiden Fehler zuverlässiger, wenn sie benannt sind.
6. **Evidence verlangen.** Der Brief endet mit: „Zeige, wie du es geprüft hast (statisch + was auf Windows sichtbar sein muss), und schreibe `docs/PROGRESS.md` fort."

## 2. Capability-bewusst briefen
- **Frontier-/Top-tier Coding-Agent:** Verträgt — und belohnt — **dichten, vollständigen Kontext** und mehrschrittiges Denken. Gib ihm das ganze „Warum" (die Zielwirkung der Szene, der Ton), nicht nur das „Was". Urteilsspielraum ist erlaubt („wähle sinnvolle Startwerte und mache sie als `@export` tunebar"), aber **die Sicherheitsregeln und das Aufbau-in-Code-Muster bleiben nicht verhandelbar** und werden wörtlich mitgegeben. Selbst-Review (`/code-review`) und API-Gegenprüfung (Context7) aktiv einfordern.
- **Standard Coding-Agent:** Gleicher Brief, aber **kleinere Schritte** und **expliziter** in den Akzeptanzkriterien; weniger offener Urteilsspielraum, mehr konkrete Werte vorgeben.
- **Small-/Fast-Agent:** Zusätzlich Belange minimieren, jeden Akzeptanzpunkt einzeln benennen und keine impliziten Architekturentscheidungen erwarten.
- **Universell:** Immer die gepinnte Godot-Version nennen; nie annehmen, das Modell „kennt" die aktuelle API — auf Context7-Gegenprüfung bestehen.

## 3. Anti-Patterns, die jeder Brief verbietet
- Klassischer HUD / Map-Screen / „Figuren auf Karte".
- Splatter/Gewaltschaden an Kindern; Ketchup, das wie echtes Blut aussieht.
- Realistischer Kriegs-Look; Faschismus „cool".
- Große `.tscn`/`.tres` von Hand schreiben (statt Aufbau-in-Code).
- Mehrere Belange in einem Schritt; Tech-Schuld/auskommentierter Code.
- Godot-3.x-Idiome (`Spatial`, `yield`, `KinematicBody`, alte `connect`-Signatur).
- Reference-PNGs als Spiel-Textur (sie sind Art-Direction; M1 nutzt prozedurale Platzhalter).

## 4. Gate-Check (vor jedem Commit, im Brief verankert)
„Bevor du committest: gehe die Checkliste in `docs/TONE.md` §6 durch (alle JA), führe `/code-review` (high) aus und behebe Funde, prüfe statisch auf Parse-/Pfadfehler. Erst dann committen mit `m1-step-NN: …` und pushen."

## 5. Wiederverwendbare Brief-Schablone
```
ROLLE & RAHMEN
Du baust einen atomaren Schritt von „The Little War Show“ (anti-autoritäres HD-2D-
Bühnen-Taktikspiel, Godot 4.3 / Forward+, Windows). Lies zuerst: docs/TONE.md,
docs/GODOT_CONVENTIONS.md und die Schritt-Skill .claude/skills/<STEP>/SKILL.md.

SICHERHEIT (nicht verhandelbar, zuerst)
Kinder/Darsteller werden NIE Opfer von Gewalt und sterben nie wirklich; Ketchup ist
immer eindeutig Bühnenfarbe (nie Blut); Ketchup-Mess/Slapstick/Tot-Spielen sind
erlaubt. Zerlegt werden nur Puppen/Requisiten/Kulissen. Keine Map, kein HUD —
Briefing per Projektor, UI als Requisite.

AUFGABE (genau ein Belang)
<eine Tat, z. B. „Baue den steuerbaren Performer-Billboard mit Bodenkontakt“>

VORGEHEN
- Aufbau-in-Code-Muster (Konventionen §3): alles in StageBootstrap/<Skript>.gd,
  keine große .tscn von Hand.
- Verwende die Material-/Billboard-/Sortier-Regeln aus den Konventionen (§6–§8).
- Bestätige jede Godot-API gegen 4.3 via Context7 (/godotengine/godot).
- Sinnvolle Startwerte wählen, als @export tunebar machen.

DEFINITION OF DONE (testbar)
<aus dem Schritt-Skill kopieren>

VERBOTEN
<schritt-spezifische Anti-Patterns + die universellen aus diesem Dokument §3>

ABSCHLUSS
- docs/TONE.md §6 durchgehen (alle JA), /code-review (high), statischer Check.
- docs/PROGRESS.md fortschreiben (Status, Prüfung, was auf Windows sichtbar sein muss).
- Commit „m1-step-NN: <tat>“, Push nach claude/practical-lovelace-vz59lr.
```

## 6. Beispiel (Schritt 03, gekürzt)
> SICHERHEIT … (s. o.) — AUFGABE: Baue in `scripts/Performer.gd` + Anbindung in `StageBootstrap` den steuerbaren Performer als beleuchteten `Sprite3D` (BILLBOARD_Y, Alpha-Scissor, Linear+Mipmaps), Fuß-Pivot auf `y=0`, weicher Schlagschatten unter dem Key-Spot, Bewegung via `Input.get_vector(...)` (WASD+Gamepad), Bewegungsgrenzen als `@export`. **DoD:** Füße berühren den Boden auch am schrägen Kamerawinkel (Tiefen-Offset/Pivot getunt), Schatten am Kontaktpunkt, flüssige menschliche Bewegung. **VERBOTEN:** Puppe/UI in diesem Schritt; großes `.tscn`; 3.x-API. **ABSCHLUSS:** … (s. Schablone).
