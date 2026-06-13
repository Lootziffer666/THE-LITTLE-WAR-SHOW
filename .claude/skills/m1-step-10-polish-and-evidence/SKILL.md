---
name: m1-step-10-polish-and-evidence
description: Milestone 1, Schritt 10 — Feinschliff (DoF/Bloom/MSAA, Kontrast-Redundanz, Bühnenreste) und Evidence. Den 60-Sekunden-Erfolgstest aus der Vertical-Slice-Spec bestehen und WINDOWS_RUN final machen. Abschluss von M1. Zuerst godot-step-protocol aufrufen.
---

# M1 · Schritt 10 — Politur & Evidence (M1-Abnahme)

> Zuerst `godot-step-protocol`. Abnahme-Maßstab: Vertical-Slice §8 (60-Sekunden-Test).

## Objective
Den Look und die Lesbarkeit final tunen, kleine Bühnenreste ergänzen, und M1 mit echtem Beweis abnehmen.

## Preconditions / depends-on
Schritt 09 🟢 (durchlaufende Show).

## Definition of Done + Quality Bar
- Feinschliff: DoF/Bloom/MSAA dezent ausbalanciert (nicht matschig/überstrahlt); Performer-vs-Puppe-Kontrast nochmals geschärft (Schatten/Steifheit/Schnüre/Bewegung — mehrfach redundant, falls subtil); kleine **Bühnenreste** nach der Zerlegung (Pappsplitter, Ketchup-Klecks, schlaffe Schnur bleiben kurz liegen — Concept-Bibel §8).
- `docs/WINDOWS_RUN.md` „Was du sehen sollst" final geprüft; `docs/PROGRESS.md` alle M1-Schritte 🟢 mit Evidence.
- **Quality Bar (Abnahme):** Ein Betrachter versteht nach **60 Sekunden ohne Anleitung**: Bühne statt Schlachtfeld; UI gehört zur Aufführung; Puppen = Kriegsmaschine; Darsteller menschlich & **nie Gewaltopfer**; die Bühne kann das System sabotieren; Humor trifft Autorität, nicht Opfer. **Echte Evidence** (Screenshot/Clip + Godot-Version) liegt vor.

## Exact procedure
1. Werte feintunen (Kamera/DoF/Glow/Adjustments) — konservativ.
2. Kontrast-Redundanz prüfen/erhöhen, falls Performer/Puppe nicht **sofort** unterscheidbar.
3. Kleine Bühnenreste nach Zerlegung ergänzen (kurze Verweildauer).
4. 60-s-Test selbst durchgehen (Vertical-Slice §7 Kontrollfragen). Evidence erfassen/anfordern.
5. `PROGRESS.md`/`WINDOWS_RUN.md` finalisieren. Committen; CI grün.

## Files touched
`scripts/StageBootstrap.gd` u. a. (Tuning, Reste), `docs/WINDOWS_RUN.md`, `docs/PROGRESS.md`.

## Ready-to-paste Agent-Prompt
> Politur & Abnahme für Milestone 1 (Maßstab: `THE_LITTLE_WAR_SHOW_v0_1_02_VERTICAL_SLICE_ACT_I_BRIDGE.md` §7/§8). **Sicherheit unverändert:** Kinder nie Gewaltopfer, Ketchup=Farbe, nur Puppen zerlegt. (a) DoF/Bloom/MSAA dezent ausbalancieren (nicht matschig/überstrahlt). (b) Performer-vs-Puppe-Kontrast schärfen, falls nicht **sofort** unterscheidbar (Schatten/Steifheit/Schnüre/Bewegung redundant). (c) Kleine **Bühnenreste** nach der Zerlegung (Pappsplitter, Ketchup-Klecks, schlaffe Schnur kurz liegen lassen). (d) Gehe die §7-Kontrollfragen durch; erfasse/fordere Evidence (Screenshot/Clip + Godot-Version) an; finalisiere `docs/WINDOWS_RUN.md` und setze in `docs/PROGRESS.md` alle M1-Schritte auf 🟢 mit Evidence. Ziel: der 60-Sekunden-Erfolgstest besteht. API gegen Godot 4.3 prüfen. Abschluss: `tone-safety-gate` (vollständig), `/code-review`, Commit „m1-step-10: polish, stage residue and M1 evidence", Push.

## Verification
- **Statisch:** keine Tech-Schuld/auskommentierter Code; Skripte parsen.
- **CI:** grün.
- **Windows:** F5 → der 60-s-Test besteht (alle §7-Kontrollfragen JA); Evidence liegt vor und ist in `PROGRESS.md` verlinkt.

## Tone/Safety-Gate
`tone-safety-gate` — vollständige Checkliste als Teil der M1-Abnahme.

## Commit-Protokoll
`m1-step-10: polish, stage residue and M1 evidence` → Push.

## Anti-Patterns / Red Flags
„Grün" ohne echte Evidence · Politur, die ein Kill-Kriterium aus §7 reißt · Scope-Creep Richtung M2-Mechaniken · überzogene Effekte · Bühnenreste, die das Bild zumüllen.
