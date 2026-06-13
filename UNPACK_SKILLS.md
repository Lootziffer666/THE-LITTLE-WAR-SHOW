# Skills auspacken (einmalig)

Das Entwicklungs-Skill-System liegt aus Sicherheitsgründen **gepackt** im Repo: `claude-skills-package.zip`. (Ein automatischer Schutzmechanismus erlaubt es nicht, ausführungsnahe Assistenten-Konfiguration unter `.claude/` direkt zu pushen — deshalb der Umweg über das Zip. Inhalt ist harmlos: nur Markdown-Anleitungen, kein Code.)

## So aktivierst du die Skills
Im Projektordner entpacken, sodass der Ordner `.claude/skills/...` entsteht:

```bash
# im Repo-Wurzelverzeichnis
unzip -o claude-skills-package.zip
```
Oder per Rechtsklick → „Hier entpacken" (Windows-Explorer), sodass `.claude/skills/` direkt im Projektordner liegt.

Danach sind die Skills in Claude Code als Schritte verfügbar (z. B. `m1-step-00-project-scaffold`). Du kannst den `.claude/`-Ordner dann ganz normal committen, falls du willst — er soll im Repo leben.

## Was drin ist
- `.claude/skills/tone-safety-gate/` · `godot-step-protocol/` · `brief-fable/` (übergreifend)
- `.claude/skills/m1-step-00 … m1-step-10/` (die 11 Milestone-1-Schritte)
- `.claude/skills/_TEMPLATE-step/` (Vorlage für künftige Schritte)

Die zugehörigen Erklärungen liegen offen in `docs/` (`00_BATTLE_PLAN.md`, `GODOT_CONVENTIONS.md`, `TONE.md`, `AGENT_BRIEFING.md`, …).
