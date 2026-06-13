---
name: m1-step-06-performer-safety-slapstick
description: Milestone 1, Schritt 06 — die geschärfte Sicherheitsregel sichtbar auf der Bühne beweisen. Der Darsteller bekommt bei naher Zerlegung Ketchup ab und wischt es achselzuckend weg; play_dead/stumble als Slapstick. Kind ist nie Gewaltopfer. Performer.gd erweitern. Zuerst godot-step-protocol aufrufen.
---

# M1 · Schritt 06 — Darsteller-Sicherheit & Slapstick (Regel sichtbar gemacht)

> Zuerst `godot-step-protocol`. Sicherheit zentral: `docs/TONE.md` §0–§3. Dieser Schritt **zeigt** die Grenze, statt sie nur zu behaupten.

## Objective
Auf der Bühne sichtbar belegen: ein Kind darf Ketchup abbekommen, stolpern und „tot spielen" — und ist dabei **nie** Opfer von Gewalt.

## Preconditions / depends-on
Schritt 03 🟢 (Performer) und Schritt 05 🟢 (Zerlegung/Ketchup).

## Definition of Done + Quality Bar
- `Performer.get_splattered()`: bei naher Puppen-Zerlegung bekommt der Darsteller einen Ketchup-Klecks (kleiner, eindeutig farbiger Overlay-/Decal-Effekt) und reagiert **komisch** (kurzes Innehalten, wegwischen, achselzucken). Auto-Recovery.
- `Performer.play_dead()`: rein kosmetischer, theatralischer Flop (Sprite kippt/legt sich), steht nach kurzer Zeit wieder auf.
- `Performer.stumble()`: Slapstick-Stolpern/-Sturz, harmlos, Auto-Recovery.
- Verdrahtung: nahe `Puppet.dismantled` → `performer.get_splattered()`. Eine Demo-Taste oder Timeline-Beat löst `play_dead`/`stumble` zur Veranschaulichung aus (final orchestriert Schritt 09).
- `Performer` hat **weiterhin keinerlei** HP-/Gewaltschaden-/Tod-Mechanik. Kommentar zitiert die Regel.
- **Quality Bar:** Ein Betrachter sieht klar: der Mess/Slapstick ist lustig und harmlos; das Kind ist unversehrt und keine Gewaltopfer-Darstellung. Der Ketchup auf dem Kind liest sich als Farbe.

## Exact procedure
1. `Performer.gd` um `get_splattered()`, `play_dead()`, `stumble()` erweitern (kosmetisch, mit Auto-Recovery; keine Schadens-Zustände).
2. Ketchup-Klecks am Performer als kleiner, eindeutig farbiger Effekt (z. B. kurzer Decal/Overlay-Quad), klar als Farbe.
3. In `StageBootstrap`: `Puppet.dismantled` (wenn nah) → `performer.get_splattered()`; Demo-Auslöser für play_dead/stumble.
4. Prüfen: kein Gewaltopfer-Eindruck. Committen; CI grün.

## Files touched
`scripts/Performer.gd` (erweitert), `scripts/StageBootstrap.gd` (Verdrahtung), ggf. `scripts/KetchupBurst.gd` (kleine Performer-Variante des Kleckses).

## Ready-to-paste Agent-Prompt
> Mache die geschärfte Sicherheitsregel auf der Bühne sichtbar (`docs/TONE.md` §0–§3). **Kernregel:** Kinder/Darsteller werden NIE Opfer von Gewalt und sterben nie wirklich; Ketchup-Mess, Stolpern/Stürzen und Tot-Spielen sind ausdrücklich erlaubt und harmlos. Erweitere `scripts/Performer.gd` um drei rein kosmetische Methoden mit Auto-Recovery, **ohne** jede HP-/Schadens-/Tod-Mechanik: `get_splattered()` (bei naher Puppen-Zerlegung bekommt der Darsteller einen kleinen, **eindeutig farbigen** Ketchup-Klecks und reagiert komisch — innehalten, wegwischen, achselzucken), `play_dead()` (theatralischer Flop, steht wieder auf), `stumble()` (harmloser Slapstick-Sturz, steht wieder auf). Verdrahte in `StageBootstrap`: nahe `Puppet.dismantled` → `performer.get_splattered()`; ein Demo-Auslöser zeigt play_dead/stumble. Setze einen Kommentar, der die Regel zitiert. Ziel: sichtbar lustig & harmlos, kein Gewaltopfer-Eindruck, Ketchup liest sich als Farbe. API gegen Godot 4.3 prüfen. Abschluss: `tone-safety-gate` (Punkt 6 zentral), `/code-review`, `docs/PROGRESS.md` Step 06, Commit „m1-step-06: visible performer safety and slapstick beats", Push.

## Verification
- **Statisch:** keine Schadens-/Tod-Zustände am Performer; Methoden kosmetisch + Auto-Recovery; Skripte parsen.
- **CI:** grün.
- **Windows:** F5 → bei naher Zerlegung Ketchup-Klecks am Kind + komische Reaktion; Demo zeigt play_dead/stumble; Kind immer unversehrt.

## Tone/Safety-Gate
`tone-safety-gate` — Punkt 6 (kein Kind als Gewaltopfer, kein echter Tod; Mess/Slapstick/Tot-Spielen ok) ist der Kern dieses Schritts.

## Commit-Protokoll
`m1-step-06: visible performer safety and slapstick beats` → Push.

## Anti-Patterns / Red Flags
Irgendeine HP-/Schadens-/Tod-Mechanik am Kind · Ketchup am Kind wie Blut · leidende statt komische Reaktion · Kriegsopfer-Ästhetik · Effekt wirkt wie Gewalt gegen das Kind.
