# Godot-Konventionen — The Little War Show

**Status:** verbindlich für **jeden** Entwicklungsschritt. Wenn ein Schritt-Skill und dieses Dokument sich widersprechen, gewinnt dieses Dokument (außer `TONE.md` — Sicherheit schlägt alles).
**Engine-Ziel:** Godot **4.3 stable**, Renderer **Forward+**. (4.4 stable ist erlaubt, wenn explizit gepinnt; nichts hier bricht dadurch.)

> Diese Datei ist recherche-gehärtet (Stand Juni 2026). Quellen am Ende. **Regel:** Vor dem Umsetzen eines Schritts die hier genannten API-Namen gegen die offizielle Godot-4.3-Doku bzw. via Context7 (`/godotengine/godot`) gegenprüfen — die Engine-API ändert Detailnamen zwischen Minor-Versionen.

---

## 1. Prime-Direktive (Technik)
Kleine, hochwertige Schritte. **Ein Schritt = ein Commit = ein CI-geprüfter, sichtbarer Zugewinn.** Niemals zwei Belange in einem Schritt vermengen. Keine Tech-Schuld „für später" hinterlassen: kein toter Code, keine auskommentierten Experimente, keine TODOs ohne Eintrag in `docs/PROGRESS.md`.

## 2. Versions-Pinning
- `application/config/features = PackedStringArray("4.3", "Forward Plus")` in `project.godot`.
- `docs/WINDOWS_RUN.md` nennt die exakte Editor-Version. Editor- und committete `.import`-Dateien müssen aus derselben Version stammen.
- Bei „Projekt öffnet nicht": `.godot/`-Cache löschen, mit der gepinnten Version neu öffnen.

## 3. Authoring-Muster (die wichtigste Regel für KI-/Headless-Arbeit)
**Eine einzige, winzige committete Szene `scenes/Main.tscn`** = `Node3D`-Root namens `Main` mit angehängtem `res://scripts/StageBootstrap.gd`. **Mehr nicht.** Der gesamte Szenenbaum (Geometrie, Licht, Environment, Kamera, Figuren, Props, Projektor) wird **zur Laufzeit in GDScript** in `StageBootstrap._ready()` aufgebaut.
**Warum:** Große `.tscn`/`.tres` blind von Hand zu schreiben (UIDs, `load_steps`, Ressourcen-Verdrahtung) ist die fehleranfälligste Tätigkeit überhaupt. Code ist diff-freundlich, review-bar und im Container statisch prüfbar.
**Einzige Ausnahme committeter Ressourcen:** die zwei Material-`.tres` (s. §6), weil sie *den* Kern-Kontrast tragen. Falls Hand-`.tres` flakey wird, dürfen auch sie in Code erzeugt werden.
**Keine UIDs von Hand schreiben** — Godot vergibt sie beim ersten Öffnen.

## 4. Projekt-/Datei-Layout
```
project.godot, .gitignore, icon.svg
/scenes      Main.tscn
/scripts     *.gd
/assets/sprites  /assets/stage  /assets/materials   (.tres + .gitkeep)
/reference   die 4 Referenz-PNGs + REFERENCE_NOTES.md + .gdignore
/docs        Konzept-/Plan-/Konventions-Dokumente
.github/workflows/godot-validate.yml
.claude/...  (Skills, Hook, settings.json)
```
- **Dateinamen:** Skripte `snake_case.gd`; Szenen/Knoten `PascalCase`; Ressourcen `snake_case.tres`.
- **`reference/.gdignore`** (leere Datei) verhindert, dass Godot die 4 schweren PNGs als Spiel-Texturen importiert.
- **`.gitignore`:** mindestens `.godot/`. **Committen:** `project.godot`, `*.tscn`, `*.gd`, `*.tres`, `*.import`, `*.gdshader`, `icon.svg`.

## 5. `project.godot` — Kern-Einstellungen
- `[application]` `config/name="The Little War Show"`, `run/main_scene="res://scenes/Main.tscn"`, `config/features=PackedStringArray("4.3","Forward Plus")`.
- `[rendering]` `renderer/rendering_method="forward_plus"`; `textures/canvas_textures/default_texture_filter=1` (Linear — **painterly Art, kein Pixel-Art, nie Nearest**); `anti_aliasing/quality/msaa_3d=2` (Alpha-Sprites & dünne Schnur-Quads aliasen sonst); `environment/defaults/default_clear_color=Color(0.02,0.02,0.03,1)` (dunkler Bühnenraum).
- `[display]` `window/size/viewport_width=1920`, `viewport_height=1080`, `window/stretch/mode="canvas_items"`, `aspect="expand"`.
- `[input]` Aktionen **leer** deklarieren, Events im Code binden (s. §10): `move_left/right/forward/back`, `dismantle`, `restage`.

## 6. Materialien — der „3D-Körper vs. 2D-Rolle"-Kontrast
Konzept-Bibel §4: *3D ist Körper, 2D ist Rolle.* Mechanisch umgesetzt über zwei Materialien:
- `assets/materials/performer_billboard.tres` — `StandardMaterial3D`: **beleuchtet** (`shading_mode = Per-Pixel`), `transparency = Alpha Scissor` (`alpha_scissor_threshold ≈ 0.5`), `cull_mode = Disabled`, `billboard = Enabled (Y)`, `texture_filter = Linear w/ Mipmaps`. **Wirft + empfängt Schatten** → verkörpert.
- `assets/materials/puppet_flat.tres` — `StandardMaterial3D`: **unshaded** (`shading_mode = Unshaded`), `transparency = Alpha Scissor`, `billboard = Disabled` (feste flache Frontansicht — eine Marionette „trackt" die Kamera nicht), `texture_filter = Linear w/ Mipmaps`. **Kein Schatten** → flache Rolle.
Allein die **Schatten-Asymmetrie** kommuniziert die Sicherheitsregel, bevor ein Wort fällt.

## 7. HD-2D-Billboarding (recherche-gehärtet)
- **Knoten:** `AnimatedSprite3D` für beide Figuren in M1 (echte Freisteller, animiert — s. `docs/SPRITE_PIPELINE.md`). `SpriteFrames` werden **in Code** aus `assets/sprites/{girl,puppet1}/` über `scripts/SpriteLibrary.gd` gebaut. Material-/Billboard-/Schatten-Verträge (§6) gelten unverändert pro Figur.
- **Sprite-Import:** PNGs unter `assets/sprites/` importieren mit **Filter An, Mipmaps An, Fix Alpha Border An** (kein `.gdignore` hier). Raue KI-Freisteller-Kanten werden über **Alpha-Scissor** (§6/§8) hart geschnitten — kein Fransen-Halo.
- **Performer:** `billboard = BILLBOARD_Y` (giert zur Kamera, kippt nie), beleuchtet, `cast_shadow = ON`.
- **Puppe:** `billboard = DISABLED` (maximal „steifes flaches Pappteil"), unshaded, `cast_shadow = OFF`.
- **Boden-Kontakt (wichtig für Qualität):** Reines Y-Billboard kann am schrägen Diorama-Winkel vom Boden „abheben" oder in Geometrie clippen. Bewährter Fix: ein **Billboard-Shader mit Tiefen-Offset** (Vertex schiebt den Sprite um wenige Welt-Einheiten Richtung Kamera) ODER sorgfältig getunter Fuß-Pivot + `pixel_size`. **Step 03 implementiert und verifiziert den Boden-Kontakt explizit** (Füße berühren den Boden, Schatten entsteht am Kontaktpunkt). Referenz-Technik: godotshaders.com „Depth adjustment for Clipping protection".
- **Fuß-Pivot:** `centered = false`, `offset = Vector2(-w/2, 0)` → Textur-Unterkante = Welt-Ursprung des `Sprite3D`; Eltern-`Node3D` auf `y = 0`. `pixel_size` so wählen, dass die Figur ~1,6 m auf der ~8 m-Bühne misst.
- **Texturfilter:** immer `LINEAR_WITH_MIPMAPS` (verhindert Flimmern am Diorama-Abstand).

## 8. Transparenz & Sortierung (die häufigste HD-2D-Falle)
Godot rendert Transparentes in einem getrennten Pass → Sortier-Probleme bei geblendeten Alpha-Billboards. Regeln:
- **Figuren:** **Alpha-Scissor** (`ALPHA_CUT_DISCARD`, Schwelle ~0,5). Scissor schreibt Tiefe im Prepass → korrektes Sorting, kein Z-Fighting, und passt ohnehin zum harten „Cutout"-Look.
- **Echtes Alpha-Blend** nur dort, wo weiche Kanten nötig sind: **Projektor-Folie** und **Schnur-Antialiasing**. Dort ggf. `render_priority` setzen, falls Sortierung kippt.
- **MSAA 2×** (mind.) gegen Kanten-Aliasing.
- Schnur-Quads `BILLBOARD_Y`, damit sie nie kantenweise verschwinden (s. §11).

## 9. Licht & WorldEnvironment (der Theater-/Diorama-Look)
- **Lichter:** `SpotLight3D` als **Key-Spot** (Schatten **ON**, erzeugt den weichen Schlagschatten des Performers); warmes **Fill** (`DirectionalLight3D` oder `OmniLight3D`, Schatten **OFF**, niedrige Energie); 2–3 **Footlights** (`OmniLight3D`, warm, niedrig, vorne) als Bloom-Quelle.
- **`WorldEnvironment` → `Environment`** (in Code gebaut): Hintergrund ~schwarz; niedriges Ambient; **Glow/Bloom AN** (additiv oder Soft-Light, hohe Schwelle → nur Footlights blühen); **Tonemap = Filmic**; **Adjustments** für warme, leicht kontrastreiche Theaterfärbung.
- **Verarbeitungs-Reihenfolge** (fix in Godot): *DoF → Glow → Tonemap → Adjustments* — danach Parameter wählen.
- **Tilt-Shift / Miniatur:** `CameraAttributesPractical` mit **DoF** (Near/Far) auf der Kamera. Nah-/Fern-Distanzen **dezent** halten (sonst „matschig") und als `@export` im Code anlegen, damit du im Editor feintunen kannst.

## 10. Kamera & Input
- **Kamera:** `Camera3D`, hoher 3/4-Diorama-Winkel (Startwert z. B. Position ~ `(0, 3.2, 6.5)`, Pitch ~ `-22°`), Perspektive ~`45°` (oder leicht orthografisch). Werte als `@export` zum Feintunen.
- **Input:** Aktionen leer in `project.godot`; im Code `if not InputMap.has_action(a): InputMap.add_action(a)` + `InputMap.action_add_event(a, ev)` für Tastatur **und** Gamepad. Bewegung via `Input.get_vector("move_left","move_right","move_forward","move_back")` (Deadzone/Normalisierung gratis).

## 11. Schnüre & hängende Props
Dünne, skalierte `MeshInstance3D`-Quads (oder sehr schmale `BoxMesh`), eine pro Schnur, gebaut in `StageStrings.gd`. `BILLBOARD_Y`, damit nie kantenweise unsichtbar; faint off-white, **unshaded**, kein Schatten (Schnüre gehören zur „Maschinerie"-Ebene). Oben an der Flies-Bar verankert, unten an Puppen-Gelenk bzw. Prop-Oberkante. `go_slack()` lässt sie beim Zerlegen fallen. Props hängen sichtbar an einer Schnur und **pendeln** (Pivot oben), schweben nie frei.

## 12. Szenenbaum-Vertrag
`StageBootstrap` baut (Namen verbindlich): `World/{StageFloor,BackdropScreen,ProsceniumFrame/{CurtainLeft,CurtainRight,CurtainTop,FliesBar}}`, `Lighting/{KeySpot,WarmFill,Footlights}`, `WorldEnvironment`, `StageCamera`, `Performer/Sprite`, `Puppet/{Cutout,Strings,DismantleParts}`, `KetchupBurst`, `PropUI_Heart/{String,Prop}`, `ProjectorSlide/{SlideQuad}`. Signale: `Puppet.dismantled`. Skripte referenzieren Knoten über diese exakten Pfade/Namen.

## 13. Commit-/Branch-Protokoll
- Branch: **`claude/practical-lovelace-vz59lr`** (nie woanders hin pushen ohne ausdrückliche Erlaubnis).
- Ein Schritt = ein Commit. Nachrichtenformat: `m1-step-NN: <kurze Tat>` (z. B. `m1-step-03: add controllable performer billboard with ground shadow`).
- Push: `git push -u origin claude/practical-lovelace-vz59lr`; bei Netzfehlern bis zu 4× mit Backoff (2/4/8/16 s). **Keine PRs ohne ausdrückliche Aufforderung.**
- Modell-IDs/Markennamen gehören **nicht** in Commits, Code-Kommentare oder Repo-Artefakte.

## 14. Evidence-Regel (kein „grün" ohne Beweis)
Jeder Schritt hinterlässt in `docs/PROGRESS.md`: Status, was statisch geprüft wurde, CI-Ergebnis (grün/rot + Link), und — sobald auf Windows getestet — Screenshot/Clip + Editor-Version + bekannte Reste. Production-Pipeline §8.

## 15. API-Verifikations-Regel
Vor jedem Schritt die verwendeten Klassen/Enums gegen Godot-4.3-Doku/Context7 prüfen. Verbotene 3.x-Idiome: `Spatial`→`Node3D`, `KinematicBody`→`CharacterBody3D`, `yield`→`await`, `OS.get_ticks_msec` ok aber `Time.get_ticks_msec` bevorzugen, `connect("sig", self, "m")`→`sig.connect(callable)`. Enum-Namen (`BILLBOARD_Y`, `ALPHA_CUT_DISCARD`, `SHADOW_CASTING_SETTING_ON`) am Stand 4.3 verifizieren.

---

## Quellen (Recherche, Juni 2026)
- [HD-2D — Wikipedia](https://en.wikipedia.org/wiki/HD-2D)
- [Sprite3D Transparency Sorting — Godot Forum](https://forum.godotengine.org/t/sprite3dz-transparency-sorting-issue-and-alternatives-for-this-approach/106885)
- [Depth adjustment for Clipping protection — Godot Shaders](https://godotshaders.com/shader/depth-adjustment-for-clipping-protection/)
- [Billboard Sprite3D (Godot 4.x) — Godot Shaders](https://godotshaders.com/shader-tag/billboard/)
- [Environment-Klasse (Godot 4.3 Docs) — ROKOJORI Labs Mirror](https://rokojori.com/en/labs/godot/docs/4.3/environment-class)
- [WorldEnvironment (Godot 4.3 Docs) — ROKOJORI Labs Mirror](https://rokojori.com/en/labs/godot/docs/4.3/worldenvironment-class)
- [Miniature faking (Tilt-Shift) — Wikipedia](https://en.wikipedia.org/wiki/Miniature_faking)
