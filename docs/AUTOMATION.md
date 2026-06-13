# Automatik — einfach erklärt

Diese Datei erklärt in Alltagssprache, welche Hintergrund-Helfer das Projekt absichern, was sie für dich tun, woran du Erfolg/Fehler erkennst, und wie du sie an-/ausschaltest. Nichts davon schreibt Spiel-Code; es sind reine Schutz- und Komfort-Helfer.

---

## 1. CI — automatische Prüfung bei jedem Hochladen ✅ aktiv
**Datei:** `.github/workflows/godot-validate.yml` (liegt schon im Repo, läuft automatisch).
**Was sie tut:** Jedes Mal, wenn Änderungen zu GitHub gepusht werden, startet GitHub im Hintergrund Godot 4.3 und prüft, ob das Projekt fehlerfrei lädt und keine kaputten Skripte enthält.
**Woran du es siehst:** Auf der GitHub-Seite des Branches/Commits ein **grünes Häkchen** (alles ok) oder ein **rotes X** (etwas ist kaputt — dann wird es repariert, **bevor** Fehler sich stapeln). Solange es noch kein `project.godot` gibt (jetzt, Planungsphase), läuft sie „leer grün".
**Das ist das wichtigste Sicherheitsnetz gegen game-breaking Bugs — und du musst nichts dafür tun.**

---

## 2. Zwei optionale Komfort-Helfer — bewusst von dir zu aktivieren
Du hattest „volle Automatik" gewählt. Dazu gehören zwei rein **optionale** lokale Komfort-Helfer. Mein Assistenten-System hat verhindert, dass ich sie automatisch anlege — Konfiguration, die das Verhalten des Assistenten ändert, soll nur auf deine **ausdrückliche, bewusste** Zustimmung hin entstehen. Diese Schutzregel hat korrekt gegriffen. Die CI (Abschnitt 1) ist das eigentliche, verlässliche Gate; diese beiden Helfer sind nur Bequemlichkeit:

- **Weniger Routine-Rückfragen:** Tippe in Claude Code **`/permissions`** und erlaube dort die sicheren Routinebefehle (Git-Status/Diff/Log/Commit/Push, Datei-Auflistung). Der eingebaute Weg lässt dich jede Regel einzeln bestätigen.
- **Godot-Prüfung schon während der Arbeit am Assistenten** (statt erst auf deinem PC): Sage mir bei Bedarf ausdrücklich Bescheid; ich richte es dann ein, und du bestätigst die dabei erscheinende Sicherheits-Rückfrage. So entsteht solche Konfiguration nur mit deinem echten Klick.

Beides ist jederzeit wieder entfernbar (sichtbare Einträge, keine „Magie").

---

## 3. Code-Review-Gate 🔁 Teil jedes Schritts
Vor jedem Commit läuft `/code-review` (hohe Stufe) plus das `tone-safety-gate`. Das ist im Schritt-Protokoll (`.claude/skills/godot-step-protocol/SKILL.md`) verankert — Qualität & Sicherheit werden bei **jedem** Schritt geprüft, nicht nur am Ende.

---

## 4. Abschalten / Rückgängig
- **CI aus:** Datei `.github/workflows/godot-validate.yml` löschen oder umbenennen.
- **Hook/Freigaben aus:** den jeweiligen Block aus `.claude/settings.json` entfernen (oder die Datei löschen).
Nichts davon ist „Magie" — alles sind sichtbare Dateien im Repo, die du jederzeit ändern kannst.
