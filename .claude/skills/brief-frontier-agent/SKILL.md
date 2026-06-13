---
name: brief-frontier-agent
description: Erzeugt aus einem Schritt-Skill den optimalen, selbstständigen Brief-Prompt für einen ausführenden KI-Agenten (capability-bewusst, modell- und anbieterneutral) für "The Little War Show". Nutzen, wenn ein Schritt an einen Agenten/Subagenten delegiert oder ein Prompt zum Einfügen gebraucht wird. Verankert Sicherheits-Präambel, atomaren Scope, testbare DoD, verbotene Anti-Patterns und Evidence-Pflicht.
---

# Brief-Generator (capability-bewusst)

**Wann:** Wenn ein Schritt an einen Agenten delegiert wird oder du einen fertigen Prompt brauchst. Grundlage: `docs/AGENT_BRIEFING.md`. Jeder Schritt-Skill enthält bereits einen fertigen Prompt — dieser Skill schneidet ihn auf Modell/Lage zu oder erzeugt ihn neu.

## Die sechs Prinzipien (kurz)
Atomarer Scope · vollständiger Kontext zuerst · **Sicherheits-Präambel oben** · testbare Definition of Done · Anti-Patterns explizit verbieten · Evidence verlangen.

## Capability-Zuschnitt
- **Frontier-/Top-tier Coding-Agent:** Dichten, vollständigen Kontext geben (auch das „Warum"/die Zielwirkung & den Ton); Urteilsspielraum erlaubt („sinnvolle Startwerte, als `@export` tunebar"); aktiv Selbst-Review (`/code-review`) und API-Gegenprüfung (Context7) einfordern. Sicherheitsregeln + Aufbau-in-Code-Muster bleiben **wörtlich & nicht verhandelbar**.
- **Standard Coding-Agent:** Gleicher Brief, kleinere Schritte, konkretere Werte, weniger offener Spielraum.
- **Small-/Fast-Agent:** Zusätzlich Belange minimieren, jeden Akzeptanzpunkt explizit machen.
- **Immer:** Gepinnte Godot-Version nennen; nie annehmen, das Modell kenne die aktuelle API.

## Schablone (füllen aus dem Schritt-Skill)
```
ROLLE & RAHMEN — Atomarer Schritt von „The Little War Show“ (anti-autoritäres HD-2D-
Bühnen-Taktikspiel, Godot 4.3 / Forward+, Windows). Lies zuerst: docs/TONE.md,
docs/GODOT_CONVENTIONS.md, .claude/skills/<STEP>/SKILL.md.

SICHERHEIT (zuerst, nicht verhandelbar) — Kinder/Darsteller werden NIE Opfer von
Gewalt und sterben nie wirklich; Ketchup ist immer eindeutig Bühnenfarbe (nie Blut);
Ketchup-Mess/Slapstick/Tot-Spielen erlaubt. Zerlegt werden nur Puppen/Requisiten/
Kulissen. Kein Map, kein HUD — Briefing per Projektor, UI als Requisite.

AUFGABE (genau ein Belang) — <Tat aus dem Schritt-Skill>

VORGEHEN — Aufbau-in-Code-Muster (Konventionen §3); Material-/Billboard-/Sortier-
Regeln (§6–§8); jede Godot-API gegen 4.3 via Context7 prüfen; Startwerte als @export.

DEFINITION OF DONE (testbar) — <aus dem Schritt-Skill>

VERBOTEN — <schritt-spezifisch> + universell: HUD/Map, Splatter/Gewaltschaden an
Kindern, großes .tscn von Hand, 3.x-API, mehrere Belange, Referenz-PNGs als Textur.

ABSCHLUSS — docs/TONE.md §6 (alle JA), /code-review (high), statischer Check;
docs/PROGRESS.md fortschreiben; Commit „m1-step-NN: <tat>", Push nach
claude/practical-lovelace-vz59lr; CI grün abwarten.
```

## Qualitäts-Selbstcheck des Briefs
Vor dem Absenden prüfen: Enthält der Brief (1) die Sicherheits-Präambel oben? (2) genau einen Belang? (3) testbare DoD? (4) explizite Verbote? (5) Evidence-Forderung? Wenn ein Punkt fehlt → ergänzen, sonst sinkt die Ergebnisqualität.
