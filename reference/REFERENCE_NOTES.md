# Referenz-Material — Notizen

Diese vier PNGs sind **Art-Direction / richtungsweisende Referenz**, **keine** fertigen Spiel-Assets. Sie werden bewusst **nicht** von Godot importiert (siehe `reference/.gdignore`). Echte Sprites entstehen separat — siehe `docs/SPRITE_PIPELINE.md`.

Eigenschaften aller vier: ~843×1264 px, PNG, painterly gerendert, mit **eingebrannten deutschen/englischen Beschriftungen** und **uneinheitlichem Posen-Raster** → nicht sauber slice-bar.

| Datei | Inhalt | Rolle im Spiel |
|---|---|---|
| `1781315520804.png` | „US ARMY MÄDCHEN" — Animations-Sheet (Geh-/Lauf-/Sprint-Zyklen, Granatenwurf) | **Darsteller** (menschlich, verkörpert, flüssig) — die „Guten"/Kinder. |
| `1781315036158.png` | Deutscher Soldat — Posen-Sheet (Idle, Gehen, Angriff, „Tod") | **Darsteller**-Variante. „Tod" = theatralisches Tot-Spielen, nie echter Gewalttod. |
| `1781316496569.png` | „DEUTSCHES SOLDAT (MARIONETTE)" — Zustands-Sheet (Idle, Schaden, „zerlegt") | **Puppe / Kriegsmaschine** (flach, steif, an Schnüren, real zerlegbar) — die „Bösen". |
| `1781315900594.png` | Bühnen-Szenenbild: roter Vorhang, Footlights, Holzboden, bemalter Hintergrund, Hängeschild „COMMUNITY THEATRE / SMALLTOWN USA / THE BATTLE FOR MAIN STREET" | **Look-Ziel** für die 3D-Bühne (Diorama, Beleuchtung, Färbung). |

**Wichtige Lesart:** Die Soldaten-Sheets liefern Haltung/Bewegung/Palette als *Richtung* — der finale Performer ist eindeutig **Kind/Mensch**, die Puppe eindeutig **Cutout an Schnüren**. Der Kontrast (Konventionen §6–§7, `TONE.md` §4) hat Vorrang vor wörtlicher Übernahme der Referenz. Eingebrannter Beschriftungstext landet **nie** im finalen Asset.
