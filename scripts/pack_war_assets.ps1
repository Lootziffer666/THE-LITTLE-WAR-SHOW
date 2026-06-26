#Requires -Version 5.1
<#
.SYNOPSIS
    Packages war-relevant PC assets into the-little-war-show project.

.DESCRIPTION
    Liest den Root-Pfad der Asset-Sammlung automatisch aus treekram.txt
    (oder via -SourceRoot) und kopiert kriegsrelevante Ordner
    (Charaktere, Feinde, SFX, Voice, HUD, Items, Hintergründe) nach
    <Projekt>/assets/from_pc/ — überspringt dabei Dateitypen, die in
    Godot nicht benötigt werden (SVG, SWF, Construct-Projekte) sowie
    Packs, die bereits im GAIME-Repo gespiegelt sind.

.PARAMETER SourceRoot
    Pfad zum Wurzelordner deiner Kenney-Asset-Sammlung.
    Wird automatisch aus treekram.txt ermittelt, wenn weggelassen.

.PARAMETER DestRoot
    Zielverzeichnis. Standard: <Projektroot>\assets\from_pc

.PARAMETER TreeFile
    Pfad zur treekram.txt. Standard: sucht im GAIME-Repo-Geschwisterordner.

.PARAMETER DryRun
    Zeigt, welche Ordner kopiert würden — ohne tatsächlich zu kopieren.

.EXAMPLE
    .\pack_war_assets.ps1 -DryRun
    .\pack_war_assets.ps1 -SourceRoot "D:\Kenney" -DestRoot "C:\projects\tlws\assets\from_pc"
#>
[CmdletBinding()]
param(
    [string]$SourceRoot = "",
    [string]$DestRoot   = "",
    [string]$TreeFile   = "",
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ── Pfade ────────────────────────────────────────────────────────────────────
$ScriptDir   = Split-Path $MyInvocation.MyCommand.Path -Parent
$ProjectRoot = (Resolve-Path (Join-Path $ScriptDir "..")).Path

if (!$DestRoot) {
    $DestRoot = Join-Path $ProjectRoot "assets\from_pc"
}

if (!$TreeFile) {
    $candidates = @(
        (Join-Path $ProjectRoot "..\gaime\treekram.txt"),
        (Join-Path $ProjectRoot "..\GAIME\treekram.txt"),
        (Join-Path $ProjectRoot "..\..\gaime\treekram.txt"),
        (Join-Path $ProjectRoot "treekram.txt")
    )
    foreach ($c in $candidates) {
        try {
            if (Test-Path $c) { $TreeFile = (Resolve-Path $c).Path; break }
        } catch { }
    }
}

# ── Root aus treekram.txt ermitteln ───────────────────────────────────────────
function Resolve-SourceRoot {
    param([string]$File)
    if (!(Test-Path $File)) { return $null }

    $head = Get-Content $File -TotalCount 30

    # Format 1: "dir /s /b" — jede Zeile ist ein vollständiger Pfad
    $absLine = $head | Where-Object { $_ -match '^[A-Za-z]:\\' } | Select-Object -First 1
    if ($absLine) {
        $parts = $absLine.Trim() -split '\\'
        for ($i = $parts.Count; $i -ge 2; $i--) {
            $candidate = ($parts[0..($i - 1)] -join '\\')
            if (Test-Path $candidate -PathType Container) { return $candidate }
        }
    }

    # Format 2: "tree /F /A" — Root-Pfad erscheint auf eigener Zeile ohne Baumzeichen
    foreach ($line in $head) {
        $t = $line.Trim()
        if ($t -match '^[A-Za-z]:\\' -and $t -notmatch '[|+\\]{2}') {
            if (Test-Path $t -PathType Container) { return $t }
        }
    }

    return $null
}

if (!$SourceRoot -and $TreeFile) {
    $detected = Resolve-SourceRoot -File $TreeFile
    if ($detected) {
        $SourceRoot = $detected
        Write-Host "Auto-detected source root: $SourceRoot"
    }
}

if (!$SourceRoot) {
    $SourceRoot = Read-Host "Pfad zum Asset-Ordner (Root aus treekram.txt)"
}

if (!(Test-Path $SourceRoot)) {
    Write-Error "Source root nicht gefunden: $SourceRoot"
    exit 1
}

# ── Ordner EINSCHLIESSEN (Muster gegen direkte Kindordner-Namen) ──────────────
# Entspricht der Struktur des Kenney Game Art Bundle aus treekram.txt
$INCLUDE = @(
    "Human Character*",       # 8 animierte menschliche Figuren
    "Female Adventurer*",     # Kämpferin, modulare Posen
    "Female Person*",         # Zivilperson-Sprites
    "Male Character*",        # Männliche Figuren mit Animationen
    "Alien Sprite*",          # Animierte Sprites — Einheitenvielfalt
    "Enemy Sprite*",          # 30+ Gegner-Typen
    "Extra Animation*",       # Zusätzliche Spritesheets + XML-Daten
    "Item Pack*",             # Flaggen, Bomben, Sterne, Schalter
    "Base Pack*",             # Terrain: Gras/Sand/Schnee/Stein
    "Background*",            # Hintergrundschichten (Himmel, Berge, Wald)
    "*Soundeffect*",          # Explosionen, Schritte, Kampf, Laser
    "*Sound Effect*",
    "*SFX*",
    "Voice Line*",            # M/F: Zahlen, Spielmodi, Runden-Ansagen
    "Voice*",
    "HUD*",                   # Herzen, Spieler-Indikatoren, Zahlen 0-9
    "Flair*",                 # Controller-Icons, Pfeile, Checkmarks
    "Overlay*",
    "*Jingle*",               # 8-Bit-Siegesjingles, Marsch-Varianten
    "*Musik*",
    "*Music*",
    "Lighting*",              # Lichteffekte (Projektoren, Scheinwerfer)
    "Effect*"
)

# ── Ordner ÜBERSPRINGEN (bereits in GAIME oder irrelevant) ───────────────────
$SKIP = @(
    "Candy*",                 # Candy-Theme, falsches Flair
    "Vector*",                # SVG-Quellen, in Godot nicht nötig
    "*Construct*",            # Game-Engine-Projektdateien
    "kenney_tiny-battle*",    # bereits in GAIME
    "kenney_top-down-tank*",
    "kenney_desert-shooter*",
    "kenney_shooting-gallery*",
    "kenney_mini-arena*",
    "kenney_monochrome-pirate*",
    "kenney_pixel-shmup*",
    "kenney_tappy-plane*",
    "kenney_ranks-pack*",
    "kenney_medals*",
    "kenney_smoke-particle*",
    "kenney_splat-pack*",
    "kenney_boardgame-pack*",
    "kenney_hexagon*",
    "kenney_isometric*",
    "kenney_rpg-base*",
    "kenney_roguelike*",
    "kenney_pixel-platformer*",
    "kenney_platformer-art*",
    "kenney_1-bit*"
)

# ── Dateierweiterungen kopieren ───────────────────────────────────────────────
# SVG, SWF, CAPX, C3P werden bewusst ausgelassen — nur Godot-kompatible Formate
$COPY_EXT = [System.Collections.Generic.HashSet[string]]::new(
    [string[]]@(".png",".jpg",".jpeg",".gif",".bmp",
                ".wav",".ogg",".mp3",
                ".xml",".json",".tsx",".tmx",".atlas"),
    [System.StringComparer]::OrdinalIgnoreCase
)

# ── Passende Unterordner finden ───────────────────────────────────────────────
$allDirs  = Get-ChildItem -Path $SourceRoot -Directory | Sort-Object Name
$selected = [System.Collections.Generic.List[System.IO.DirectoryInfo]]::new()

foreach ($dir in $allDirs) {
    $name = $dir.Name

    $doSkip = $false
    foreach ($p in $SKIP) { if ($name -ilike $p) { $doSkip = $true; break } }
    if ($doSkip) { continue }

    foreach ($p in $INCLUDE) {
        if ($name -ilike $p) { $selected.Add($dir); break }
    }
}

# ── Zusammenfassung ───────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗"
Write-Host "║      pack_war_assets.ps1 — The Little War Show          ║"
Write-Host "╚══════════════════════════════════════════════════════════╝"
Write-Host ""
Write-Host "  Quelle : $SourceRoot"
Write-Host "  Ziel   : $DestRoot"
Write-Host "  Modus  : $(if ($DryRun) { 'DRY RUN (nichts wird kopiert)' } else { 'LIVE' })"
Write-Host ""

if ($selected.Count -eq 0) {
    Write-Host "  Keine passenden Ordner gefunden."
    Write-Host "  Tipp: -SourceRoot prüfen oder INCLUDE-Patterns im Script anpassen."
    exit 0
}

Write-Host "  Ausgewählt ($($selected.Count) Ordner):"
foreach ($d in $selected) {
    $count = @(Get-ChildItem $d.FullName -Recurse -File |
               Where-Object { $COPY_EXT.Contains($_.Extension) }).Count
    Write-Host "    [+] $($d.Name.PadRight(32)) $count Dateien"
}

$skippedDirs = @($allDirs | Where-Object { $selected.FullName -notcontains $_.FullName })
Write-Host ""
Write-Host "  Übersprungen ($($skippedDirs.Count) Ordner — bereits in GAIME oder irrelevant):"
foreach ($d in $skippedDirs) {
    Write-Host "    [-] $($d.Name)"
}

if ($DryRun) {
    Write-Host ""
    Write-Host "  [DRY RUN abgeschlossen] — erneut ohne -DryRun ausführen, um zu kopieren."
    exit 0
}

# ── Bestätigung ───────────────────────────────────────────────────────────────
Write-Host ""
$confirm = Read-Host "  Alle Dateien nach '$DestRoot' kopieren? (j/N)"
if ($confirm -ine "j") {
    Write-Host "  Abgebrochen."
    exit 0
}

# ── Kopieren ──────────────────────────────────────────────────────────────────
$totalCopied  = 0
$totalSkipped = 0
$totalBytes   = [long]0

if (!(Test-Path $DestRoot)) {
    New-Item -ItemType Directory -Force $DestRoot | Out-Null
}

foreach ($dir in $selected) {
    $destDir = Join-Path $DestRoot $dir.Name
    $files   = Get-ChildItem -Path $dir.FullName -Recurse -File

    foreach ($f in $files) {
        if ($COPY_EXT.Contains($f.Extension)) {
            $relPath    = $f.FullName.Substring($dir.FullName.Length)
            $dest       = Join-Path $destDir $relPath
            $destParent = Split-Path $dest -Parent

            if (!(Test-Path $destParent)) {
                New-Item -ItemType Directory -Force $destParent | Out-Null
            }

            Copy-Item $f.FullName -Destination $dest -Force
            $totalCopied++
            $totalBytes += $f.Length
        } else {
            $totalSkipped++
        }
    }

    Write-Host "  OK  $($dir.Name)"
}

$totalMB = [Math]::Round($totalBytes / 1MB, 1)
Write-Host ""
Write-Host "  Fertig!"
Write-Host "  Kopiert : $totalCopied Dateien ($totalMB MB)"
Write-Host "  Skippt  : $totalSkipped Dateien (falsche Extension)"
Write-Host "  Ziel    : $DestRoot"
Write-Host ""
Write-Host "  Nächste Schritte:"
Write-Host "  1. Godot öffnen → Assets aus 'assets/from_pc/' importieren"
Write-Host "  2. Docs lesen:  docs/SPRITE_PIPELINE.md"
Write-Host "  3. Kriegsrelevante Assets in 'assets/war/' sortieren"
