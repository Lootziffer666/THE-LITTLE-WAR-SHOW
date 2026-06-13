# THE LITTLE WAR SHOW - Vertical Slice Plan v0.1

**Datum:** 2026-06-12  
**Slice:** Akt I - Die Brücke, die niemand brauchte  
**Ziel:** Den Kern beweisen: Bühne, Overhead-Briefing, UI-Requisiten, Darsteller/Puppen-Kontrast, Bühnenpanne, Puppenzerlegung, Fäden-Kippmoment, bitterer Nachbericht.

---

## 1. Scope-Satz

Dieser Vertical Slice beweist nicht das ganze Spiel. Er beweist nur diese Frage:

> Kann eine kleine Bühne Krieg als kaputte Aufführung spielbar machen?

Wenn dieser Slice nicht funktioniert, retten weitere Features nichts. Wenn er funktioniert, ist der Konzeptkern lebendig.

---

## 2. Harte Nicht-Ziele

Für den ersten Slice ausdrücklich **nicht** bauen:

- keine historische Kampagne
- kein Multiplayer
- kein Tech-Tree
- keine große Weltkarte
- keine komplexe Fraktionssimulation
- keine 20 Waffen
- kein Boss-System
- keine Lore-Bibel
- kein realistisches Kriegssystem
- kein klassischer HUD
- keine „kleinen Figuren auf Karte“-Strategieansicht

---

## 3. Pflichtbestandteile

Der Slice enthält genau diese Kernbausteine:

1. 3D-Bühne als physischer Raum
2. Overhead-Projektor-Briefing auf Bühnenleinwand
3. 2D-Bühnenbild im 3D-Raum
4. ein 3D oder 3D-wirkender Darsteller
5. eine 2D-Puppe als Gegner/Systemkörper
6. Granaten als hängende UI-Requisite
7. Stagehand-/Kind-Fehler: Granatenzähler pennt oder reagiert verspätet
8. Scheinwerfer als Ablenkungs-/Aufmerksamkeitsmechanik
9. eine Puppet-Dumbality
10. ein Darsteller bekommt kurz Fäden
11. bitterer Nachbericht
12. kleine Rückstände auf der Bühne

---

## 4. Szene: Die Brücke, die niemand brauchte

### Bühnenbild

- kleine Theaterbühne
- schwarzer oder dunkler Bühnenraum
- roter/abgenutzter Vorhang
- Leinwand hinten
- Overhead-Projektor links oder vorne
- flache Pappbrücke
- flacher Pappfluss
- zwei/drei Pappbäume
- Hänge-UI links: Granaten
- Hänge-UI rechts: Herzen oder Moralbanner
- sichtbare Fäden über Marionette

### Stimmung

Handgemacht, leicht schief, clever, bitter-komisch. Mehr World of Goo / Human Resource Machine als realistisches Kriegsspiel.

---

## 5. Ablauf

### Phase 1 - Briefing

Overhead-Projektor springt an. Folie liegt leicht schief.

Leinwand zeigt:

- Brücke
- Pfeile
- Stempel „DRINGEND“
- handschriftliche Korrektur
- vielleicht Kaffeefleck auf strategischem Ziel

Briefing-Copy:

> Ziel: Die Brücke sichern, bevor jemand bemerkt, dass wir sie gestern bereits gesprengt haben.

Spieler markiert oder bestätigt den Befehl direkt auf der Projektionsfolie.

### Phase 2 - Bühnenwechsel

Kulisse fährt herein. Projektorlicht bleibt kurz sichtbar und wirft Schatten. Der Wechsel darf quietschen, haken oder etwas zu spät kommen.

### Phase 3 - Einführung Darsteller/Puppe

Ein Darsteller betritt die Bühne mit flüssigerer, menschlicher Bewegung. Eine Marionettenpuppe erscheint steifer, flacher, frontaler.

Regieflüstern:

> Noch nicht salutieren. Noch nicht. Nein, jetzt ist auch egal.

### Phase 4 - Interaktion

Der Spieler kann:

- Darsteller bewegen
- Scheinwerfer umlenken
- Granate einsetzen
- Deckung/Requisite nutzen
- Puppe zum Fehlverhalten bringen

### Phase 5 - Stagehand-Fehler

Ein Kind/Stagehand bedient den Granatenzähler. Es pennt kurz ein oder zieht nicht rechtzeitig an der Schnur.

Effekt:

- Granatenanzeige wird verspätet reduziert
- für wenige Sekunden wirkt es, als sei eine Granate „gratis“
- Bühne reagiert komisch: Requisite hängt noch da, obwohl sie gerade geworfen wurde

### Phase 6 - Dumbality

Puppe wirft Granate. Granate prallt an der Brücke, an einem Schild oder an einer Requisite ab. Sie landet vor der Puppe.

Pause.

Alle Köpfe drehen sich.

Explosion. Zeitlupe. Falsches X-Ray. Off-Stimme:

> Dumbality. Pacifism wins.

Wichtig: Zerlegt wird die Puppe / Rollenhülle, nicht ein Darsteller.

### Phase 7 - Fäden-Kippmoment

Ein Darsteller folgt einem absurden Befehl zu hart oder lässt sich von Rache/Angst kurz erfassen. Dünne Fäden erscheinen. Die Animation wird kurz steifer, frontaler, weniger menschlich.

Nach kurzer Irritation können die Fäden reißen oder für spätere Szenen als Warnzeichen bleiben.

### Phase 8 - Nachbericht

Overhead-Projektor oder Frontzeitungsblatt zeigt:

> Einsatz erfolgreich.  
> Die Brücke wurde vollständig neutralisiert.  
> Ihre strategische Bedeutung wurde kurz darauf neu bewertet.

---

## 6. Show-Must-Go-Wrong-Regeln

Pannen dürfen den Ablauf verändern, aber nie das Spiel leeren.

Erlaubte Pannenklassen:

| Klasse | Wirkung |
|---|---|
| Skip | Begegnung fällt aus, Ersatzfolge tritt ein |
| Delay | Ereignis kommt verspätet |
| Miscast | falsche Figur übernimmt Rolle |
| Prop Failure | Requisite/UI funktioniert falsch |
| Overacting | Figur übertreibt, wird anfälliger/gefährlicher |

**Goldregel:**

> Eine Panne darf den Plan brechen, aber nie das Spiel leeren.

---

## 7. Kontrollfragen nach dem ersten Build

Nach jedem Fable-/Agenten-Build prüfen:

| Prüffrage | Kill-Kriterium |
|---|---|
| Fühlt es sich wie Bühne statt Schlachtfeld an? | Wenn nein: zurückbauen |
| Ist das Briefing Teil der Bühne? | Wenn nein: Map/HUD entfernen |
| Sind Darsteller und Puppen sofort unterscheidbar? | Wenn nein: Animationskontrast erhöhen |
| Ist UI physisch? | Wenn nein: HUD durch Requisiten ersetzen |
| Treffen harte Effekte nur Puppen/Rollen/Requisiten? | Wenn nein: sofort korrigieren |
| Ist der Humor bitter, aber nicht verachtend? | Wenn nein: Copy neu schreiben |
| Entsteht Spielwert aus Bühnenpannen? | Wenn nein: Pannen mechanisch machen |

---

## 8. Minimaler Erfolg

Der Slice ist erfolgreich, wenn ein Betrachter nach 60 Sekunden versteht:

- Das ist eine Bühne.
- Das ist kein realistisches Kriegsspiel.
- Die UI gehört zur Aufführung.
- Puppen sind Kriegsmaschine/Rollen.
- Darsteller sind menschlicher.
- Die Bühne kann das System sabotieren.
- Der Humor trifft Autorität, nicht Opfer.

---

## 9. Mini-Backlog nach erfolgreichem Slice

Erst nach erfolgreichem Slice prüfen:

- zweite Pannenklasse
- zweiter Bühnenort
- ein ausfallender Bosskampf
- eine Propaganda-Parade
- mehrere Nachbericht-Varianten
- einfache Rivalitätslogik
- lokale 2-Spieler-Testvariante
