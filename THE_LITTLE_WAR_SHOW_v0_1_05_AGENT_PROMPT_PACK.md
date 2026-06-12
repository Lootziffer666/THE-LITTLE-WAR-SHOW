# THE LITTLE WAR SHOW - Agent & Fable Prompt Pack v0.1

**Datum:** 2026-06-12  
**Zweck:** Copy-sichere Prompts für Fable/Agenten. Die Prompts sind bewusst klar gerahmt, damit das Konzept nicht als Gewaltverherrlichung missverstanden wird.

---

## 1. Master-Frame für Agenten

Nutze diesen Block als Vorlauf für alle weiteren Prompts.

```text
You are helping build a tiny vertical slice for a satirical anti-authoritarian stage-theatre tactics game.

The game is explicitly not a realistic war simulation and does not glorify violence, fascism, militarism, or real-world suffering. The target of the satire is propaganda, bureaucracy, command culture, heroic posing, authoritarian aesthetics, and the absurd machinery of power.

The visual frame is an amateur/children's theatre production. Human performers are never harmed. Physical destruction only affects puppets, costumes, props, marionette shells, UI-requisites, stage machinery, and symbolic war-machine roles.

Core visual hierarchy:
- The stage is a simple 3D theatre space.
- Human performers should feel embodied and 3D, using more fluid animation.
- Puppets, enemies, scenery, props, and war-machine figures are flat 2D cutouts placed inside the 3D stage.
- UI elements are physical stage props hanging on strings.
- Mission briefing is projected by an overhead projector onto a screen on the 3D stage.
- Do not use a conventional HUD or world map.

Tone: handmade, theatrical, darkly funny, anti-authoritarian, never contemptuous toward victims.
```

---

## 2. Vertical Slice Prompt

```text
Build a tiny vertical slice for the game "The Little War Show".

Scene title: Act I - The Bridge Nobody Needed.

Required elements:
1. A simple 3D theatre stage with curtain, stage floor, overhead projector, projection screen, hanging strings, and visible stage machinery.
2. A mission briefing projected by an overhead projector onto the stage screen. The briefing should look like a bad acetate transparency: crooked arrows, stamps, handwritten corrections, and bureaucratic mission language.
3. A 2D cardboard bridge and 2D scenery placed inside the 3D stage.
4. One human performer who feels more embodied/3D and moves more fluidly.
5. One puppet enemy / war-machine figure made from flat 2D cutout parts, visibly controlled by strings.
6. A grenade counter shown as physical grenade props hanging on strings, not as a HUD number.
7. A stagehand mistake: the stagehand briefly falls asleep or misses a cue, causing the grenade counter to update late.
8. A spotlight that can accidentally or deliberately redirect attention.
9. A puppet-destruction gag where a grenade bounces back and destroys only the puppet/prop body.
10. A short slow-motion "Dumbality - Pacifism wins" style moment, but keep it theatrical and puppet-based.
11. One moment where the human performer briefly gains strings, showing moral/control pressure.
12. A bitter post-mission report projected on the screen.

Keep the scope tiny. Do not add campaign systems, multiplayer, tech trees, realistic gore, realistic soldiers, or a conventional strategy map.
```

---

## 3. Style Correction Prompt

Nutze diesen Prompt, wenn Fable zu generisch, zu realistisch oder zu klassisch wirkt.

```text
Revise the prototype to better match the core concept.

Remove any conventional videogame HUD, minimap, strategy map, military UI, or realistic battlefield framing.

Make the entire experience feel like a stage performance:
- UI values must be stage props hanging on strings.
- The mission screen must be an overhead projector briefing on a stage screen.
- The level must feel like a small theatre set, not an outdoor battlefield.
- Puppets and scenery must be flat 2D cutouts in a 3D theatre space.
- Human performers must look/feel more embodied than puppets.
- Puppet destruction must affect only puppets, costumes, props, or symbolic role shells.
- Human performers and childlike stagehands must remain unharmed.

Increase the handmade World-of-Goo / Human-Resource-Machine charm: crooked props, botched cues, whispered stage directions, forgotten lines, and a production that keeps going wrong.
```

---

## 4. Safety Correction Prompt

Nutze diesen Prompt, wenn der Build in falsche Richtung kippt.

```text
Correct the concept framing immediately.

This is not a game about making war cool or realistic. It is an anti-authoritarian stage satire about humiliating the war machine.

Do not show realistic harm to humans or children. Do not use victims as punchlines. Do not make fascist or militaristic imagery look aspirational or cool.

All physical destruction must apply only to puppets, props, costumes, marionette shells, stage machinery, UI-requisites, or symbolic war-machine roles.

The humor should target propaganda, command culture, bureaucracy, heroic posing, authoritarian aesthetics, and systems that turn people into roles.

Keep the scene theatrical, handmade, absurd, and puppet-based.
```

---

## 5. Copywriter Prompt

```text
Write short mission-briefing and post-mission copy for "The Little War Show".

Tone:
- darkly funny
- bureaucratic
- anti-authoritarian
- absurd
- bitter but not contemptuous
- never mocking victims
- like a bad military briefing performed in an amateur theatre production

Targets of satire:
- propaganda
- command culture
- heroic posing
- bureaucracy
- strategic euphemisms
- authoritarian self-importance

Do not glorify war. Do not make real suffering the joke.

Write:
1. three overhead-projector briefing lines for a bridge mission
2. three stage-direction whispers that go wrong
3. three post-mission reports that make failure sound official
4. three short "Dumbality"-style failure awards where violence backfires against the puppet war-machine
```

---

## 6. Gate-Check Prompt

```text
Audit this build/design against the concept rules for "The Little War Show".

Check for:
1. Stage instead of battlefield
2. Overhead projector instead of strategy map
3. UI as physical props
4. 3D/embodied performers vs 2D/cutout puppets
5. Human performers protected
6. Puppet/prop-only destruction
7. Satire aimed at power systems, not victims
8. Show-Must-Go-Wrong events with gameplay consequences
9. Handmade World-of-Goo / Human-Resource-Machine charm
10. Scope discipline: tiny vertical slice, no feature bloat

Return:
- Stable: what works
- Adapting: what breaks the concept
- Act Now: the three highest-impact fixes
```

---

## 7. Perchance Puppet Prompt Skeleton

```text
single flat 2D cutout marionette puppet, handmade theatre prop, satirical authoritarian war-machine figure, exaggerated uniform silhouette, visible joints, separate limbs, cardboard texture, strings, slightly ugly charming handmade look, darkly funny, puppet theatre, no realistic human injury, full body, transparent background if possible, isolated character, no other characters
```

Use one figure per generation. Save seed and prompt.

---

## 8. Negative Prompt Ideas

```text
realistic war photography, realistic gore, real children harmed, military simulation, heroic soldier fantasy, cinematic battlefield realism, propaganda poster glorification, ultra realistic anatomy, crowds, multiple characters, photorealistic blood, modern shooter HUD, minimap, tactical military UI
```

---

## 9. One-Line Public Pitch

```text
The Little War Show is an anti-authoritarian stage-tactics game where a cute theatre production tries to perform war, but propaganda, puppets, bad orders, and broken stage machinery keep humiliating the whole machine.
```
