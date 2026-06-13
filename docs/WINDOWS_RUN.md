# Auf Windows öffnen, spielen, prüfen

Diese Anleitung ist für **dich** (nicht-technisch ok). Sie wächst mit jedem Schritt; was du sehen sollst, steht zusätzlich im jeweiligen Schritt-Skill.

## Einmalig einrichten
1. **Godot 4.3 stable** laden: https://godotengine.org/download/windows/ → die **Standard**-Version (nicht „.NET/C#", solange wir kein C# nutzen). Es ist eine einzelne `.exe`, keine Installation nötig.
2. Optional **Git für Windows** (https://git-scm.com/download/win), falls du Änderungen selbst holen willst.

## Projekt holen & öffnen
1. Branch holen: in Git `git pull origin claude/practical-lovelace-vz59lr` — oder das Repo als ZIP von GitHub herunterladen und entpacken.
2. Godot starten → **Import** → die Datei **`project.godot`** im Projektordner wählen → **Open**.
3. Beim ersten Öffnen legt Godot einen `.godot/`-Cache an (das ist normal und dauert kurz).
4. **F5** (Play) drücken.

## Was du sehen sollst (Stand wächst pro Schritt)
Maßgeblich ist die „Definition of Done" des zuletzt fertigen Schritts (s. `docs/PROGRESS.md`). Das **M1-Endbild** (nach Schritt 10):
- Dunkler Bühnenraum, roter Proszeniumrahmen/Seitenkulissen, Holzboden, warmes Footlight-Glühen mit dezentem Bloom, leichter Miniatur-Unschärfe-Look, Kamera im Octopath-Diorama-Winkel.
- Eine **schiefe Projektor-Folie** mit dem Brücken-Briefing erscheint hinten.
- Ein **Darsteller** mit weichem Schatten steht am Boden, läuft mit **WASD / Stick / D-Pad**.
- Eine **Puppe** steht steif, flach, ohne Schatten, mit **sichtbaren Schnüren** — klar anderes „Ding".
- Ein **Filzherz an einer Schnur** pendelt seitlich.
- **Leertaste/E (oder Gamepad A)** zerlegt die Puppe komödiantisch; **roter Ketchup** ploppt; bekommt der Darsteller etwas ab, wischt er es weg — **kein Kind kommt durch Gewalt zu Schaden**.
- Ein bitterer **Nachbericht** erscheint; **R** spielt die Szene neu.

## Wenn Play fehlschlägt
- Falsche Godot-Version → 4.3 nutzen.
- `.godot/`-Ordner aus anderer Version → Ordner löschen, neu öffnen.
- Eine fehlende Datei gemeldet → prüfen, ob `git pull` vollständig war.

## Evidence festhalten (bitte pro fertigem Schritt)
Ein **Screenshot** oder kurzer **Clip** + die Godot-Version genügt. Ablegen/notieren, ich verlinke es in `docs/PROGRESS.md`. Das ist unser Beweis „es läuft wirklich", nicht nur „sollte laufen".
