---
name: godot-step-protocol
description: Universelle Pro-Schritt-Prozedur für die Godot-Entwicklung von "The Little War Show". Bei JEDEM Entwicklungsschritt zuerst aufrufen. Erzwingt: Konventionen lesen, Godot-4.3-API via Context7 gegenprüfen, im Aufbau-in-Code-Muster umsetzen, statisch prüfen, Code-Review + Ton-Gate, ein Schritt = ein Commit, CI abwarten, PROGRESS.md fortschreiben.
---

# Godot-Schritt-Protokoll (universell)

**Wann:** Zu Beginn **jedes** Schritt-Skills (`m1-step-NN-*`, später `m2-*` …). Stellt sicher, dass jeder Schritt die gleiche hohe Latte trifft. Verbindlich: `docs/GODOT_CONVENTIONS.md` (Technik), `docs/TONE.md` (Sicherheit, schlägt alles), `docs/00_BATTLE_PLAN.md` (Qualitäts-Doktrin).

## Prime-Direktive
Ein Schritt = **ein Belang** = **ein Commit** = ein CI-geprüfter, sichtbarer Zugewinn. Keine Tech-Schuld. Im Zweifel kleiner schneiden.

## Ablauf (strikt in Reihenfolge)
1. **Verankern.** Die konkrete Schritt-`SKILL.md` lesen (Ziel, Preconditions, DoD, Files, Prompt, Anti-Patterns). Prüfen, dass die Preconditions (Vorschritte 🟢 in `docs/PROGRESS.md`) erfüllt sind. Wenn nicht → erst dort weiter.
2. **Sicherheit voran.** `tone-safety-gate` öffnen und die Kernregel präsent halten — sie rahmt jede Entscheidung.
3. **API gegenprüfen.** Jede verwendete Godot-Klasse/Enum/Methode gegen **Godot 4.3** via Context7 (`/godotengine/godot`) bestätigen. 3.x-Idiome verboten (Konventionen §15).
4. **Umsetzen.** Im **Aufbau-in-Code-Muster** (Konventionen §3): minimale `.tscn`, Logik in GDScript. Sinnvolle Startwerte als `@export` tunebar. Nur die im Schritt-Skill genannten Dateien anfassen.
5. **Statisch prüfen.** Klammer-/Pfad-/Signal-Konsistenz; `project.godot`-Aktionen referenziert; `Main.tscn` minimal & gültig; keine 3.x-API. Falls ein Godot-Binary verfügbar ist (Session-Hook), zusätzlich `godot --headless --path . --quit-after 2 --editor` und auf `SCRIPT ERROR`/`Parse Error` im Log achten.
6. **Review + Gate.** `/code-review` (high effort) ausführen, Funde beheben. Dann `tone-safety-gate`-Checkliste — **alle JA**.
7. **Commit.** Format `m1-step-NN: <kurze Tat>` (Konventionen §13). Genau dieser eine Schritt. Push `git push -u origin claude/practical-lovelace-vz59lr` (bei Netzfehlern bis 4× Backoff). **Keine PR ohne ausdrückliche Aufforderung.**
8. **CI abwarten.** Push triggert `.github/workflows/godot-validate.yml`. Rot → diagnostizieren und im selben Schritt fixen, bis grün. Grün ist Teil der Definition of Done.
9. **Buch führen.** `docs/PROGRESS.md`: Status auf 🟢 (oder 🟡/🔴), was statisch geprüft wurde, CI-Ergebnis, und was auf Windows sichtbar sein muss. Kein „grün" ohne Beweis.
10. **Stop.** Nicht in den nächsten Schritt überlaufen. Ein Schritt, ein Commit, fertig.

## Wenn etwas unklar/mehrdeutig ist
Nicht raten und nicht den Scope aufblähen. Kleinste sinnvolle Interpretation wählen, im Schritt-Skill/PROGRESS notieren — oder beim Auftraggeber rückfragen, wenn die Entscheidung das Spielgefühl/den Ton berührt.
