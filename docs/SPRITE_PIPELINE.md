# Sprite-Pipeline — von Referenz zu Asset

## Stand (geändert): echte Freisteller ab M1
Der Auftraggeber hat die vier Referenz-Sheets per KI **grob freigestellt** und als einzelne
Pose-PNGs geliefert. Diese liegen importierbar unter `assets/sprites/` (Umzug aus dem
ursprünglichen `Sprites/`-Ordner). Damit nutzt **bereits M1 die echte Optik** statt der
ursprünglich geplanten rein prozeduralen Platzhalter.

```
assets/sprites/girl/    35 Posen  (deutsch benannt)  → M1-Darsteller (steuerbar)
assets/sprites/puppet1/ 35 Posen  (gleiches Schema)  → M1-Puppe (zerlegbar)
assets/sprites/boy/     27 Posen  (englisch benannt)  → reserviert für M2
```

Eigenschaften: einzeln freigestellt, transparent, je ~15–75 KB. Die Freistellung ist
**bewusst grob** (raue Kanten, evtl. Halo). Das ist für M1 akzeptabel und wird kaschiert
(s. u.); der saubere Cleanup ist M3.

## Wie die groben Kanten in M1 sauber wirken
- **Alpha-Scissor** (`ALPHA_CUT_DISCARD`, Schwelle ~0.5) auf beiden Figuren-Materialien
  (Konventionen §6/§8): harte Cutout-Kante, kein halbtransparenter Fransen-Halo, korrektes
  Tiefen-Sorting. Genau dafür ist Scissor ideal bei rauen Freistellern.
- **Import:** Filter **An**, Mipmaps **An**, Fix Alpha Border **An** (verhindert dunklen Rand
  an der Alpha-Kante). Kein `.gdignore` auf `assets/sprites/` — diese PNGs **sollen** importiert werden.
- **Linear-Filter + Mipmaps** (painterly, nicht Pixel-Art) gegen Diorama-Flimmern.

## Animation in M1 (SpriteFrames in Code)
`scripts/SpriteLibrary.gd` baut **zur Laufzeit** `SpriteFrames` aus den semantisch benannten
Dateien (Aufbau-in-Code-Vertrag, Konventionen §3). M1-Auswahl pro Figur:

| Figur | Animation | Quell-Frames |
|---|---|---|
| girl (Darsteller) | `idle` | `03_haltung_ausruhen` (+ dezentes Wippen) |
| girl | `walk` | `04…08_geh_zyklus` (5) |
| girl | `run` | `09…13_lauf_zyklus` (5) |
| girl | `play_dead` (Tot-Spielen) | `34_gefallen` |
| girl | `react_splatter` | `31_schock` → `33_trauer`/`30_wut` → zurück |
| girl | `stumble` | `35_panik` / `31_schock` |
| puppet1 (Puppe) | `idle_stiff` (gestuft) | `01_waffenhaltung_01` (+ `03_haltung_ausruhen`) |
| puppet1 | `dismantle` | `31_schock` → `32_verwundet` → `34_gefallen` |

Combat-Posen (`feuer_*`, `granatenwurf_*`, `zielen_*`) bleiben in M1 **ungenutzt** — sie
gehören zur „Krieg spielen"-Mechanik (M2). `boy` wird in M2 ergänzt.

## Sicherheits-Leitplanke (verbindlich, `docs/TONE.md` §0)
Die Pose-Namen enthalten Kampf-/Schadensbegriffe (`damage`, `death`, `verwundet`,
`gefallen`). Beim **Darsteller** (girl/boy) werden Frames wie `34_gefallen`/`32_verwundet`
**ausschließlich als theatralisches Tot-Spielen / Slapstick** verwendet — rein kosmetisch,
mit Auto-Recovery, **nie** als Gewaltopfer-/Kriegsopfer-Ästhetik. Für **puppet1** bedeuten
dieselben Frames reale Zerlegung (erlaubt). Beim Einbinden **visuell prüfen**: kein
eingebrannter Beschriftungstext, kein blut-realistischer Look — sonst Frame maskieren/ersetzen.

## Prozedurale Platzhalter — nur noch Fallback
`scripts/PlaceholderTextures.gd` bleibt für (a) fehlende Assets und (b) Dinge **ohne** echtes
Asset: das **Filzherz** (Prop-UI, Schritt 07) und die **Projektor-Folie** (Schritt 08, via `Label3D`).

## Sauberer Pfad (M3, auf Windows mit Bildwerkzeugen)
1. Pro genutzter Pose die **Kante sauber** nachziehen (Halo entfernen, knapper transparenter
   Beschnitt, konsistente Fußlinie), evtl. Restbeschriftung entfernen.
2. **Namens-Normalisierung** (boy englisch ↔ girl/puppet deutsch) auf ein gemeinsames Schema.
3. Re-Import (Filter/Mipmaps/Fix-Alpha-Border An), `.import` committen; Herkunft je Asset
   dokumentieren (Production-Pipeline §5/§9).
4. Volle Animations-Sets (auch Combat) für die jeweilige Nummer freischalten.

## Qualitäts-Regeln für Sprites
- Painterly, **nicht** Pixel-Art → Linear-Filter + Mipmaps (Konventionen §7).
- Darsteller: lesbar als Kind/Mensch, beleuchtet, wirft Schatten. Puppe: flacher **Cutout**,
  unshaded, kein Schatten, an Schnüren, bewusst steif. Der Kontrast ist Pflicht, nicht Stil.
- **Niemals** eingebrannten Beschriftungstext im finalen Asset.
