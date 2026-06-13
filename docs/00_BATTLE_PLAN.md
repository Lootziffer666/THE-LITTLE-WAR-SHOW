# The Little War Show — Schlachtplan (Master)

**Zweck:** Der eine Plan, der alles steuert. Wer hier oben anfängt, weiß danach: was das Spiel ist, nach welchen Regeln gebaut wird, in welcher Reihenfolge, und wie das Skill-System jeden Schritt absichert.
**Verbindliche Begleiter:** `docs/TONE.md` (Sicherheit, schlägt alles) · `docs/GODOT_CONVENTIONS.md` (Technik) · `docs/AGENT_BRIEFING.md` (wie ein Agent gebrieft wird) · `docs/PROGRESS.md` (Live-Stand).

---

## 1. Vision in drei Sätzen
The Little War Show ist ein anti-autoritäres **Bühnen-Taktikspiel**: eine niedliche Theateraufführung nimmt die Kriegsmaschine aus Propaganda, Befehlen und Heldentheater so lange ernst, bis sie vor Publikum auseinanderfällt. **Kinder spielen Krieg** auf einer 3D-Bühne; die Kriegsmaschine sind flache **2D-Puppen an Schnüren**, die absurd zerlegt werden; die Kinder kommen **nie durch Gewalt zu Schaden** (Ketchup statt Blut, Slapstick, Tot-Spielen). Ton: bitterböse, rührend, urkomisch — Kriegsmaschinerie ad absurdum, nie menschenverachtend.
Look: **HD-2D** (2D-Sprites in 3D-Bühne, wie Octopath Traveler), Ziel-Plattform **Windows**, Engine **Godot 4.3**.

## 2. Qualitäts-Doktrin (die Prime-Direktive)
> **Kleine, hochwertige Schritte mit hoher Messlatte schlagen schnelle Prototypen.**

- **Ein Schritt = ein Belang = ein Commit = ein CI-geprüfter, sichtbarer Zugewinn.** Nie zwei Dinge vermengen.
- **„High quality" ist definiert** (nicht Geschmackssache): (a) erfüllt die schritt-eigene *Definition of Done + Quality Bar*; (b) liest sich auf der Bühne korrekt (der gewollte Eindruck entsteht ohne Erklärung); (c) hinterlässt **keine Tech-Schuld** (kein toter/auskommentierter Code, keine offenen TODOs ohne PROGRESS-Eintrag); (d) besteht `tone-safety-gate`; (e) CI grün.
- **Kein Schritt baut auf ungetestetem Vorschritt.** Erst grün, dann weiter.
- **Lieber kleiner schneiden** als einen Schritt überladen. Zweifel = teilen.

## 3. Roadmap (Milestones)
| MS | Titel | Inhalt | Auflösung |
|---|---|---|---|
| **M1** | **Fundament + Bühnen-Proof** | Lauffähige HD-2D-Bühne, die in ~60 s Look + Kernregeln beweist | **voll** (11 Schritt-Skills) |
| **M2** | Vertical Slice „The Bridge Nobody Needed" | Die 12 Pflicht-Komponenten + Kern-Loop (Briefing→Pannen→Dumbality→Nachbericht) | skizziert → wird vor Start dekomponiert |
| **M3** | Saubere Asset-Pipeline | Echte Sprites/Animationen aus den Referenzen, Audio, Stimme | skizziert |
| **M4** | Zweite Nummer + Pannen-System | „Show Must Go Wrong" als echte Mechanik (Skip/Delay/Miscast/Prop-Failure/Overacting) | skizziert |
| **M5** | Weitere Nummern + Politur + Windows-Build | Verpackung zur echten .exe, Evidence, Release-Hygiene | skizziert |

**Regel:** Eine künftige Nummer/Milestone wird **erst dann** zu Schritt-Skills dekomponiert (per `.claude/skills/_TEMPLATE-step/SKILL.md`), wenn sie an der Reihe ist. Kein spekulatives Vorab-Detail.

## 4. Milestone 1 — Schritte, Reihenfolge, Quality Bar
Jeder Schritt hat eine eigene `.claude/skills/m1-step-NN-*/SKILL.md` mit vollem Detail. Kurzfassung:

| # | Skill | Definition of Done (Quality Bar) |
|---|---|---|
| 00 | `m1-step-00-project-scaffold` | Projekt öffnet in Godot 4.3 fehlerfrei; schwarzes Fenster läuft; Repo aufgeräumt; CI „leer grün". |
| 01 | `m1-step-01-stage-diorama` | Leere Bühne (Boden, Proszenium, Vorhang, Seitenkulissen, Flies-Bar) im korrekten Kamerawinkel. |
| 02 | `m1-step-02-camera-light-environment` | Der „Miniatur-Theater"-Look liest sich (Key-Spot+Schatten, Footlight-Bloom, warme Färbung, dezenter Tilt-Shift-DoF). |
| 03 | `m1-step-03-performer` | Steuerbarer Darsteller (WASD/Gamepad), **Füße am Boden**, weicher Schlagschatten; wirkt verkörpert. |
| 04 | `m1-step-04-puppet-and-strings` | Puppe sofort als „flache Rolle an Schnüren" unterscheidbar (unshaded, kein Schatten, steif). |
| 05 | `m1-step-05-dismantle-and-ketchup` | Tastendruck zerlegt die Puppe komödiantisch; Ketchup liest sich eindeutig als Farbe. |
| 06 | `m1-step-06-performer-safety-slapstick` | Auf der Bühne sichtbar bewiesen: Kind bekommt Ketchup ab/wischt es weg, spielt tot, stolpert — **nie Gewaltopfer**. |
| 07 | `m1-step-07-prop-ui-string` | Filzherz hängt an Schnur, pendelt, reagiert beim Zerlegen (UI = Requisite). |
| 08 | `m1-step-08-projector-briefing` | Schiefe Projektor-Folie zeigt Briefing + bitteren Nachbericht (Copy wörtlich aus Doku). |
| 09 | `m1-step-09-show-timeline-restage` | Die volle ~60-s-Sequenz läuft durch; `R` startet neu. |
| 10 | `m1-step-10-polish-and-evidence` | Besteht den 60-s-Test (Vertical-Slice §8); Screenshot/Clip erfasst; `WINDOWS_RUN.md` final. |

**Abhängigkeitsgraph:** `00 → 01 → 02 → {03, 04} → 05 → 06 → {07, 08} → 09 → 10`
(03 & 04 sowie 07 & 08 sind jeweils unabhängig und dürfen parallel/in beliebiger Reihenfolge.)

**M1-Erfolgskriterium (aus Vertical-Slice §8):** Ein Betrachter versteht nach 60 s ohne Anleitung: *Das ist eine Bühne, kein Schlachtfeld; die UI gehört zur Aufführung; Puppen sind die Kriegsmaschine; Darsteller sind menschlich und kommen nie durch Gewalt zu Schaden; die Bühne kann das System sabotieren; der Humor trifft Autorität, nicht Opfer.*

## 5. Wie das Skill-System die Ausführung steuert
Pro Schritt (Details in `.claude/skills/godot-step-protocol/SKILL.md`):
1. `godot-step-protocol` öffnen → diszipliniert dem Ablauf folgen.
2. Die Schritt-`SKILL.md` lesen (Ziel, DoD, exaktes Vorgehen, fertiger Prompt).
3. API via Context7 (`/godotengine/godot`) gegenprüfen.
4. Umsetzen im Aufbau-in-Code-Muster (Konventionen §3).
5. Statischer Check + `/code-review` (high) → `tone-safety-gate` grün.
6. Commit (`m1-step-NN: …`) → Push → **CI** prüft.
7. `docs/PROGRESS.md` fortschreiben (Status + Evidence).
8. Auf Windows verifizieren (was sichtbar sein muss steht im Schritt-Skill).

## 6. Was wann fertig sein muss (Reihenfolge der Arbeit)
M1 strikt in Schrittfolge (§4). Erst wenn **alle** M1-Schritte grün sind und der 60-s-Test besteht, wird **M2** via Template in Schritte zerlegt. Asset-Pipeline (M3) läuft danach als eigener Strang; bis dahin **prozedurale Platzhalter** (s. `docs/SPRITE_PIPELINE.md`).

## 7. Nicht-Ziele (projektweit, bis ausdrücklich freigegeben)
Keine offene Welt · keine realistische Kriegssimulation · kein klassischer HUD · keine „Figuren-auf-Karte"-Strategieansicht · kein Multiplayer · kein Tech-Tree · keine 20 Waffen · keine Lore-Bibel vorab. Jedes Produktionslimit wird **Stilregel** (Requisiten statt Naturalismus, Pappe statt Komplexität).
