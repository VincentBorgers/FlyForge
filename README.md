# FlyForge Studio

**FlyForge Studio** is een uitgebreide open-source flyer design tool/editor voor desktop en web.

## Functies
- Multi-canvas presets (A4, A5, Instagram, Poster).
- Template starters:
  - Sale template
  - Event template
- Elementen toevoegen:
  - Tekst
  - Vlakken
  - Cirkels
  - Afbeeldingen uploaden
- Layer bewerking:
  - Slepen en positioneren
  - Dupliceer layer
  - Naar voren / naar achteren
  - Verwijderen
- Eigenschappenpaneel per layer:
  - Positie, rotatie, opacity
  - Kleur
  - Afmetingen
  - Radius / corner radius
  - Tekstinhoud en fontgrootte
- Ontwerphelpers:
  - Grid overlay aan/uit
  - Center X / Center Y voor geselecteerde layer
  - Zoom controls
- Projectflow:
  - Export PNG/JPG
  - Opslaan/Openen als JSON project
  - Undo/Redo geschiedenis
- Software info in app via **Info** knop inclusief directe licentie-weergave.

## Installatie (development)

### Vereisten
- Node.js 20+
- npm 10+

### Web starten
```bash
npm install
npm run dev
```

### Desktop starten
```bash
npm run desktop
```

## Windows installer (.exe)

### Lokaal op Windows bouwen
```bash
npm install
npm run dist:win
```

Output komt in `release/` als NSIS installer (`.exe`).

### Automatisch via GitHub Actions
De workflow `.github/workflows/windows-installer.yml` bouwt automatisch een Windows installer:
- handmatig via `workflow_dispatch`
- of bij tag push (`v*`)

Artifacts zijn daarna te downloaden uit de workflow-run.

## Eigen branding / app icon instellen
Plaats je icon bestanden in `buildResources/`:
- `buildResources/icon.ico` voor Windows
- `buildResources/icon.icns` voor macOS
- `buildResources/icon.png` voor Linux

De paden staan al ingesteld in `package.json`, dus je hoeft alleen de bestanden toe te voegen.

## Projectstructuur
- `src/App.tsx` — editor, templates, tooling, info/licentie modal
- `src/components/KonvaImage.tsx` — image layer rendering
- `src/types.ts` — type definities
- `src/styles/app.css` — UI styling
- `electron/main.cjs` — Electron desktop bootstrap
- `.github/workflows/windows-installer.yml` — CI Windows installer build
- `buildResources/README.md` — branding asset uitleg

## License
MIT — zie `LICENSE`.

## Contributor
Zie `CONTRIBUTORS.md`.
