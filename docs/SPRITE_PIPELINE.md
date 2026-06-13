# Sprite-Pipeline — von Referenz zu sauberem Asset

## Warum dieser Umweg
Die vier Referenz-PNGs in `/reference` sind **Art-Direction**, keine fertigen Assets: painterly gerendert, mit **eingebrannten deutschen/englischen Beschriftungen** und **uneinheitlichem Raster**. Sie lassen sich **nicht** sauber per `region_rect` zerschneiden, und eingebrannter Militär-Beschriftungstext im Spiel wäre zudem ein Ton-Problem. Außerdem fehlen im Build-Container Bildwerkzeuge (kein PIL/ImageMagick).

**Deshalb in M1: prozedurale Platzhalter** (in `scripts/PlaceholderTextures.gd` zur Laufzeit erzeugt) — silhouetten- und palettenkorrekt, transparenter Hintergrund, sofortiger Performer-vs-Puppe-Kontrast, null Import-Risiko.

## Der saubere Pfad (M3, auf Windows mit Bildwerkzeugen)
1. **Ein sauberes Standbild pro Figur** aus dem jeweiligen Sheet zuschneiden (z. B. „Idle/Haltung Frame 1"), **Beschriftungstext entfernen**, als enges **transparentes PNG** exportieren: `assets/sprites/performer_idle.png`, `assets/sprites/puppet_idle.png`. (Editor wie Krita/Photoshop, oder kleines Python+PIL-Skript.)
2. In Godot importieren mit **Filter: An**, **Mipmaps: An**, **Fix Alpha Border: An**; die erzeugte `.import`-Datei committen.
3. In `Performer.gd`/`Puppet.gd` **eine Zeile** tauschen: `PlaceholderTextures.performer_tex()` → `load("res://assets/sprites/performer_idle.png")`. (Die Platzhalter-Quelle ist zentralisiert, damit genau dieser Einzeiler reicht.)
4. **Später (Animation):** die vollen, uneinheitlichen Sheets in Einzel-Posen schneiden → `SpriteFrames` → `AnimatedSprite3D` (Performer: Idle/Walk flüssig; Puppe: steifes Idle/Zittern). Herkunft (Perchance-Seed/Prompt, Mixamo-Clip) je Asset dokumentieren — Production-Pipeline §5/§9.

## Qualitäts-Regeln für echte Sprites
- Painterly, **nicht** Pixel-Art → Linear-Filter + Mipmaps (Konventionen §7).
- Transparenter, knapper Beschnitt; konsistente Fußlinie (Pivot unten).
- Performer: lesbar als Kind/Mensch, flüssig animierbar. Puppe: erkennbar **Cutout** mit Gelenk-Lücken, bewusst steif. Der Kontrast ist Pflicht, nicht Stil.
- **Niemals** eingebrannten Beschriftungstext im finalen Asset.
