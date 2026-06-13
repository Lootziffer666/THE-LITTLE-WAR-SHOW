---
name: tone-safety-gate
description: Verbindliches Ton- & Sicherheits-Gate für "The Little War Show". VOR jedem Commit ausführen. Prüft, dass Kinder/Darsteller nie Gewaltopfer werden, Ketchup eindeutig als Bühnenfarbe lesbar ist, nur Puppen/Requisiten zerlegt werden, UI Requisite statt HUD ist und Satire Machtapparate statt Opfer trifft. Bei jedem NEIN: Build/Idee sofort korrigieren, nicht committen.
---

# Ton- & Sicherheits-Gate

**Wann:** Vor **jedem** Commit; außerdem bei jeder neuen Szene, Copy, Figur oder jedem neuen Effekt. Dieses Gate schlägt jede andere Konvention. Quelle: `docs/TONE.md`.

## Geschärfte Kernregel (zuerst lesen)
Tabu ist ausschließlich **Gewalt-als-Schaden** an Kindern/Darstellern: nie Opfer von Gewalt, nie echter Tod, keine Kriegsopfer-Ästhetik. **Erlaubt:** Ketchup-Besudelung (eindeutig kein Blut), Stolpern/Stürzen/Sich-wehtun, theatralisches Tot-Spielen. **Puppen** werden real zerlegt/zerfetzt/aufgespießt.

## Checkliste — ALLE müssen JA sein
1. [ ] Wirkt es wie **Bühne**, nicht Schlachtfeld?
2. [ ] Ist das **Briefing** Projektor-Folie (kein Map/HUD)?
3. [ ] Ist **UI** physische Requisite (an Schnüren), kein klassischer HUD?
4. [ ] Sind **Darsteller vs. Puppen sofort** unterscheidbar (Schatten/Steifheit/Schnüre)?
5. [ ] Treffen **harte Zerstörungseffekte nur** Puppen/Rollen/Requisiten/Kulissen?
6. [ ] **Kein Kind** als Gewaltopfer, **kein** echter Kindstod, **keine** Kriegsopfer-Ästhetik? (Ketchup-Mess/Slapstick/Tot-Spielen sind ausdrücklich ok.)
7. [ ] Liest sich **Ketchup eindeutig als Farbe** (übersättigtes Comic-Rot, Klecks-/Spritzer-Form), nie als realistisches Blut?
8. [ ] Ist der **Humor bitter, nicht verachtend**, und trifft **Autorität, nicht Opfer**?
9. [ ] Faschistische/militärische Ästhetik nur zum **Entzaubern**, nie cool/heroisch/triumphal?
10. [ ] **Scope winzig** (genau ein Belang in diesem Commit)?

## Bei einem NEIN
**Nicht committen.** Korrigieren gemäß der „Besser"-Spalte aus `docs/TONE.md` §2 (künstlichere Form, Puppe statt Darsteller, Requisite statt HUD, Copy umschreiben). Erst wenn alles JA ist → weiter zum Commit.

## Red Flags (sofortiger Rückbau)
Krieg cool/heroisch · Faschismus gefeiert · Kind als echtes Gewaltopfer/real sterbend · Ketchup wirkt wie Blut · Militärsim statt Bühne · HUD statt Requisite · Opfer als Pointe · Moral gepredigt · Regeln unlesbar.

## Ergebnis festhalten
Im Commit bzw. `docs/PROGRESS.md` vermerken: „tone-safety-gate: grün". Bei vorheriger Korrektur kurz notieren, was angepasst wurde.
