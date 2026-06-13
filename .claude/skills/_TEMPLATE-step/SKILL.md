---
name: _TEMPLATE-step
description: VORLAGE (nicht ausführen) — Kopiere diesen Ordner zu .claude/skills/<mN-step-NN-kurzname>/ und fülle alle Felder, um einen neuen atomaren Entwicklungsschritt für "The Little War Show" zu definieren. Hält die einheitliche 11-Punkte-Struktur und die hohe Qualitätslatte ein.
---

# MN · Schritt NN — <Titel>

> Vorlage. Beim Anlegen eines echten Schritts: Ordner kopieren, umbenennen (`mN-step-NN-kurzname`), `name`/`description` im Frontmatter anpassen, alle `<…>` ersetzen, diesen Hinweis löschen. **Genau ein Belang pro Schritt.**
> Zuerst immer `godot-step-protocol`. Sicherheit: `tone-safety-gate`/`docs/TONE.md`. Technik: `docs/GODOT_CONVENTIONS.md`.

## Objective
<Ein Satz: was dieser Schritt — und nur dieser — erreicht.>

## Preconditions / depends-on
<Welche Vorschritte müssen 🟢 sein? Welche Knoten/Skripte existieren bereits?>

## Definition of Done + Quality Bar
- <Konkrete, testbare Ergebnisse — nicht „funktioniert", sondern messbare Wirkung.>
- **Quality Bar:** <Der gewollte Eindruck entsteht ohne Erklärung; keine Tech-Schuld; Gate grün; CI grün.>

## Exact procedure
1. <Atomare, nummerierte Schritte.>
2. … (statisch prüfen; committen; CI grün abwarten.)

## Files touched
<Explizite Pfade. Nur diese anfassen.>

## Ready-to-paste Agent-Prompt
> <Selbstständiger Brief nach Schablone aus `docs/AGENT_BRIEFING.md` §5 bzw. via `brief-fable`: Sicherheits-Präambel zuerst, genau ein Belang, Aufbau-in-Code, API-Gegenprüfung, testbare DoF, explizite Verbote, Abschluss mit Gate/Review/PROGRESS/Commit/Push.>

## Verification
- **Statisch:** <was im Container/Code prüfbar ist>
- **CI:** grün.
- **Windows:** <was nach F5 konkret sichtbar/bedienbar sein muss>

## Tone/Safety-Gate
`tone-safety-gate` — <welche Checklistenpunkte hier besonders kritisch sind>.

## Commit-Protokoll
`mN-step-NN: <kurze Tat>` → Push `claude/practical-lovelace-vz59lr`.

## Anti-Patterns / Red Flags
<Schritt-spezifische Fallen + relevante universelle aus `docs/AGENT_BRIEFING.md` §3.>
