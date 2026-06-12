# THE LITTLE WAR SHOW - Production & Asset Pipeline v0.1

**Datum:** 2026-06-12  
**Zweck:** Produktionslogik für einen schnellen, kontrollierten Prototypen mit Fable/Agenten, Mixamo, Perchance und klarer Hybrid-Ästhetik.

---

## 1. Grundsatz

Die Aufgabe ist nicht mehr klassisch „Kann man das bauen?“. Mit Fable/Agenten ist vieles in Minuten möglich.

Die eigentliche Aufgabe lautet:

> Versteht der Build den Kern - oder produziert er nur eine hübsche falsche Version?

Fable ist Bühnencrew. Der Nutzer ist Regie. ChatGPT/Gatekeeper ist Dramaturgie, Gedächtnis und Konzeptprüfung.

---

## 2. Tool-Rollen

| Tool / Quelle | Rolle |
|---|---|
| Fable / Agenten | schneller spielbarer Prototyp, Iteration, Szene aufbauen |
| Mixamo | flüssigere humanoide Animationen für Darsteller/Performer |
| Perchance | Varianten für Puppen, Propagandafiguren, Requisiten, Cutout-States, Mood/Asset-Exploration |
| ElevenLabs | kommerzielle Voice-Lines nur über Paid-Plan und ohne fremde Stimmen/Imitationen |
| GitHub | SSOT, Build-Artefakte, Evidence, Agentenübergabe |
| ChatGPT | Konzeptkonsolidierung, Prompt-Gates, Safety-/Tone-Check, Dokumentation |

---

## 3. Darstellungs- und Animationshierarchie

| Ebene | Asset-/Animationspipeline |
|---|---|
| Bühne | einfacher 3D-Raum, wiederverwendbar |
| Darsteller | Mixamo oder ähnlich, humanoid, flüssiger, körperlicher |
| Puppen | 2D-Cutouts, Perchance-Varianten, rigged, steif, zerlegbar |
| Bühnenbild | 2D-Kulissen in 3D positioniert |
| UI-Requisiten | 2D/3D-Props an Fäden, einfache Physik |
| Projektor/Folien | 2D-Texturen/Planes auf Leinwand |
| Stagehands | kleine Darsteller/Performer, einfache Loops, sichtbare Bühnenfehler |

---

## 4. Mixamo-Einsatz

Mixamo ist für die Performer-Schicht gedacht:

- Darsteller betreten Bühne
- Stagehands laufen, stolpern, reagieren
- kindlich codierte Performer wirken körperlicher
- Regie-/Souffleurmomente können mit kleinen Bewegungsloops arbeiten

Mixamo nicht roh lassen:

- Timing komischer machen
- Posen theatralisch brechen
- Geschwindigkeit anpassen
- kleine Pausen einbauen
- Übergänge bewusst unsauber/handgemacht wirken lassen

Wichtig:

> Puppen dürfen nicht dieselbe flüssige Mixamo-Qualität bekommen. Sonst verliert der Darsteller/Puppen-Kontrast seine Bedeutung.

---

## 5. Perchance-Einsatz

Perchance ist besonders stark für Puppen und Cutout-Varianten, wenn eine Figur einzeln erzeugt wird und Seed-Varianten nur minimale Pose-/Detailänderungen erzeugen.

Nutzung:

- eine Figur pro Generierung
- Seed/Prompt dokumentieren
- 4-8 kohärente Varianten je Puppe erzeugen
- freistellen
- in Körperteile schneiden
- als Cutout riggen
- Varianten als Idle-/Damage-/Expression-States nutzen

Nicht nutzen für:

- komplexe Mehrfiguren-Szenen ohne Kontrolle
- finale kommerzielle Assets ohne Lizenzprüfung
- Darsteller-Animationen, die bewusst menschlich wirken sollen

Perchance-Pipeline für Puppen:

1. Prompt für einzelne Marionette/Puppe
2. Seed speichern
3. Varianten generieren
4. beste Variante als Basis wählen
5. Kopf, Torso, Arme, Beine, Requisiten trennen
6. Cutout-Rig bauen
7. Varianten für Jitter, Idle, Damage, „zerlegt“ nutzen

---

## 6. Fable-Workflow

### Runde 1 - Tiny Build

Prompt erzeugt eine winzige 3D-Bühne mit einer Szene.

### Runde 2 - Konzeptbruch-Liste

Prüfen:

- Bühne statt Schlachtfeld?
- Overhead statt Map?
- UI als Requisite?
- Darsteller vs. Puppen erkennbar?
- Puppenzerlegung statt Darstellerverletzung?
- Bühnenpanne mit Gameplay-Folge?
- Copy bitter, aber nicht verachtend?

### Runde 3 - Harte Korrektur

Nicht „mach besser“, sondern konkrete Regeln:

- klassisches HUD entfernen
- Map-Screen entfernen
- Puppen flacher/steifer machen
- Darsteller körperlicher machen
- UI als hängende Requisite bauen
- Kinder/Darsteller geschützt halten
- Stagehand-Fehler mechanisch machen

### Runde 4 - SSOT einfrieren

Sobald es klickt, Regeln sichern und nicht weiter wild aufblasen.

---

## 7. Dateistruktur-Vorschlag

```text
/the-little-war-show
  /docs
    THE_LITTLE_WAR_SHOW_CONCEPT_BIBLE.md
    THE_LITTLE_WAR_SHOW_VERTICAL_SLICE_ACT_I_BRIDGE.md
    THE_LITTLE_WAR_SHOW_TONE_SAFETY_BIBLE.md
    THE_LITTLE_WAR_SHOW_AGENT_PROMPT_PACK.md
    THE_LITTLE_WAR_SHOW_PRODUCTION_PIPELINE.md
  /prototype
    /stage
    /performers
    /puppets
    /props
    /ui_requisites
    /briefing_projector
  /evidence
    /screenshots
    /build_logs
    /test_notes
  /assets_sources
    /perchance_seeds
    /mixamo_exports
    /voice_exports
```

---

## 8. Evidence-Regel

Kein grüner Status ohne Beweis.

Für jeden relevanten Build sichern:

- Screenshot oder kurzer Clip
- Build-Log
- Tool/Prompt-Version
- bekannte Brüche
- nächste Korrektur
- Lizenz-/Asset-Quelle, wenn relevant

---

## 9. Lizenz-/Rechte-Hinweise

### ElevenLabs

Nur final verwenden, wenn:

- Paid Plan aktiv
- keine Free-Plan-Audiofiles im Release
- keine fremden Stimmen / Promi-Imitationen / historischen Figuren imitieren
- Exportdatum, Text, Voice und Plan dokumentiert werden

### Mixamo

Für kommerzielle Spiele grundsätzlich geeignet, aber Rohassets nicht als Asset-Pack weiterverkaufen. Nutzung als Spielanimation ist der relevante Pfad.

### Perchance

Für Prototypen hervorragend. Für kommerzielle finale Assets Lizenzlage des jeweiligen Generators/Modells prüfen und dokumentieren.

---

## 10. Prompt-Gate vor jedem Fable-Lauf

Jeder Fable-Prompt muss enthalten:

- anti-war / anti-authoritarian framing
- no realistic war simulation
- human performers are never harmed
- destruction only affects puppets, props, costumes, symbolic roles and stage machinery
- stage is 3D
- performers feel 3D and embodied
- puppets/scenery are 2D cutouts
- UI is physical stage props
- mission briefing is overhead projection
- scope tiny

---

## 11. Erster technischer Meilenstein

Ein 60-Sekunden-Prototyp:

1. Bühne sichtbar
2. Projektor-Briefing
3. Kulisse fährt rein
4. Darsteller betritt Bühne
5. Puppe bewegt sich steif
6. Granaten hängen als UI
7. Stagehand pennt
8. Dumbality passiert
9. Darsteller bekommt kurz Fäden
10. Nachbericht erscheint

Wenn das funktioniert, existiert der Kern.
