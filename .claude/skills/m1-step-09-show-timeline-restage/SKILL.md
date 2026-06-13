---
name: m1-step-09-show-timeline-restage
description: Milestone 1, Schritt 09 — die ~60-Sekunden-Show-Sequenz orchestrieren (Licht→Briefing→Steuerung→Zerlegung→Nachbericht) als await-Timeline in StageBootstrap, plus Restage per R-Taste. Bindet alle Vorschritte zur durchgehenden Aufführung zusammen. Zuerst godot-step-protocol aufrufen.
---

# M1 · Schritt 09 — Show-Timeline & Restage

> Zuerst `godot-step-protocol`. Prinzip: Concept-Bibel §11 Kern-Loop. Bindet 01–08 zusammen.

## Objective
Die Einzelteile werden zu einer durchgehenden ~60-Sekunden-Aufführung; `R` startet sie neu.

## Preconditions / depends-on
Schritte 03–08 🟢 (Performer, Puppe, Zerlegung, Sicherheit/Slapstick, Prop-UI, Projektor).

## Definition of Done + Quality Bar
- `StageBootstrap._run_show()`: `await`-getriebene Timeline mit `get_tree().create_timer(...).timeout`: (1) Licht senkt sich/Bühne setzt sich; (2) `ProjectorSlide.show_briefing()` (schief); (3) Performer wird steuerbar / „betritt" die Bühne; (4) Prompt/Beat zum Zerlegen — auf `dismantle` oder nach Timeout `puppet.dismantle()`; nahe → `performer.get_splattered()`, `heart.pulse()`; (5) `ProjectorSlide.show_report()`.
- `restage`-Aktion (`R`) bindet und ruft `_run_show()` neu (Zustand sauber zurücksetzen: Puppe/Cutout/Schnüre/Teile, Performer-Position).
- **Quality Bar:** Die Sequenz läuft ohne Eingriff sauber durch und ergibt in ~60 s den vollständigen Eindruck (Bühne→Briefing→Spiel→Zerlegung→Nachbericht). `R` setzt zuverlässig zurück, ohne Reste/Doppelungen. Pannen brechen nie das Spiel (eine fehlende Eingabe führt per Timeout weiter).

## Exact procedure
1. `restage`-Event binden.
2. `_run_show()` als Coroutine implementieren; Beats per Timer/await; defensive Guards (Knoten existieren).
3. `_reset_show()` für sauberes Zurücksetzen; `R` ruft reset+run.
4. Durchlauf testen; Rücksetzen testen. Committen; CI grün.

## Files touched
`scripts/StageBootstrap.gd` (Timeline + Reset + Input), ggf. kleine Reset-Helfer in `Puppet.gd`/`Performer.gd`.

## Ready-to-paste Agent-Prompt
> Orchestriere die ~60-Sekunden-Aufführung in `scripts/StageBootstrap.gd` als `await`-Timeline (`_run_show()`), die alle Vorschritte verbindet. **Sicherheit:** Reihenfolge/Beats ändern nichts an den Regeln — Kinder nie Gewaltopfer, Ketchup=Farbe, nur Puppen zerlegt. Beats per `get_tree().create_timer(t).timeout`: (1) Licht/Bühne setzt sich; (2) `ProjectorSlide.show_briefing()`; (3) Performer steuerbar; (4) Beat zum Zerlegen — auf `dismantle`-Eingabe oder nach Timeout `puppet.dismantle()`, bei Nähe `performer.get_splattered()` + `heart.pulse()`; (5) `ProjectorSlide.show_report()`. Binde `restage` (R): `_reset_show()` (Puppe/Cutout/Schnüre/Teile zurück, Performer-Position zurück, Folie zurück) + `_run_show()` neu. Defensive Guards, damit eine fehlende Eingabe per Timeout weiterführt (Panne bricht nie das Spiel). API gegen Godot 4.3 prüfen (await/Timer/Signale). Abschluss: `tone-safety-gate`, `/code-review`, `docs/PROGRESS.md` Step 09, Commit „m1-step-09: orchestrate 60s show timeline with restage", Push.

## Verification
- **Statisch:** `await`/Timer korrekt; Reset setzt alle veränderten Knoten zurück; `restage`-Aktion existiert; Skript parst.
- **CI:** grün.
- **Windows:** F5 → vollständige ~60-s-Sequenz läuft ohne Eingriff durch; `R` startet sauber neu (keine Reste/Doppelungen).

## Tone/Safety-Gate
`tone-safety-gate` — vollständige Checkliste (dieser Schritt zeigt erstmals das ganze Bild).

## Commit-Protokoll
`m1-step-09: orchestrate 60s show timeline with restage` → Push.

## Anti-Patterns / Red Flags
Sequenz hängt/blockiert ohne Eingabe (statt Timeout) · Restage lässt Reste/dupliziert Knoten · neue Inhalte/Mechaniken einführen (nur orchestrieren) · Reihenfolge erzeugt Gewaltopfer-Eindruck am Kind.
