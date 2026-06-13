# Fortschritt — The Little War Show

Lebendes Log. **Pro Schritt fortschreiben:** Status, was statisch geprüft wurde, CI (grün/rot + Link), und — sobald auf Windows getestet — Evidence (Screenshot/Clip) + Godot-Version. Kein „grün" ohne Beweis.

**Status-Legende:** ⬜ offen · 🟡 in Arbeit · 🟢 fertig & verifiziert · 🔴 blockiert/kaputt

## Planungs-Lieferpaket (dieser Stand)
- 🟢 Schlachtplan, Konventionen, Ton-Vertrag, Agent-Briefing, Skills, Automatik erstellt (kein Engine-Code).

## Asset-Integration (geändert: echte Freisteller ab M1)
- 🟢 Plan-/Doku-Änderung: M1 nutzt die grob freigestellten Pose-PNGs (`assets/sprites/{girl,puppet1,boy}/`) statt rein prozeduraler Platzhalter. Details: `docs/SPRITE_PIPELINE.md`.
- **M1-Besetzung:** Mädchen = steuerbarer Darsteller, puppet1 = Puppe; Junge → M2. Animation voll (AnimatedSprite3D/SpriteFrames in Code).
- **Sicherheit:** Darsteller-Frames `gefallen/verwundet` nur als Tot-Spielen/Slapstick (kosmetisch, Auto-Recovery), nie Gewaltopfer; nur puppet1 wird real zerlegt. `tone-safety-gate` Punkt 6.
- **Offen:** Die Schritt-Skills (`.claude/skills/m1-step-00/03/04/05/06`) beschreiben noch prozedurale Platzhalter; die Umsetzung folgt diesem Doku-Stand (Skill-Text wird bei Gelegenheit nachgezogen).
- **`.import`-Hinweis:** Sprite-`.import`-Dateien werden beim ersten Editor-Öffnen / im CI-`--import` erzeugt (Container hat kein Godot-Binary). Erst danach committen.

## Milestone 1 — Fundament + Bühnen-Proof
| # | Schritt | Status | Statisch geprüft | CI | Windows-Evidence |
|---|---|---|---|---|---|
| 00 | project-scaffold | ⬜ | – | – | – |
| 01 | stage-diorama | ⬜ | – | – | – |
| 02 | camera-light-environment | ⬜ | – | – | – |
| 03 | performer | ⬜ | – | – | – |
| 04 | puppet-and-strings | ⬜ | – | – | – |
| 05 | dismantle-and-ketchup | ⬜ | – | – | – |
| 06 | performer-safety-slapstick | ⬜ | – | – | – |
| 07 | prop-ui-string | ⬜ | – | – | – |
| 08 | projector-briefing | ⬜ | – | – | – |
| 09 | show-timeline-restage | ⬜ | – | – | – |
| 10 | polish-and-evidence | ⬜ | – | – | – |

**M1-Abnahme:** ⬜ 60-s-Test bestanden (Betrachter versteht ohne Anleitung: Bühne, nicht Schlachtfeld; UI=Requisite; Puppen=Maschine; Kinder menschlich & nie Gewaltopfer; Humor trifft Autorität).

## Milestone 2+ 
⬜ Noch nicht dekomponiert. Wird per `.claude/skills/_TEMPLATE-step/SKILL.md` in Schritte zerlegt, sobald M1 grün ist.
