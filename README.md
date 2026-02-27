# FlyForge Studio

**FlyForge Studio** is een complete open-source flyer design tool/editor voor PC, gemaakt voor **Vincent Borgers**.

## Waarom deze naam?
De naam combineert:
- **Fly**er ontwerp
- **Forge** = iets bouwen/smeden van idee tot eindresultaat
- **Studio** = professionele werkruimte

## Functies
- Canvas editor met presets (A4, A5, Instagram).
- Elementen toevoegen:
  - Tekst
  - Vlakken
  - Cirkels
  - Afbeeldingen uploaden
- Slepen en positioneren van alle lagen.
- Rechter eigenschappenkolom voor fijne controle (kleur, rotatie, opacity, afmetingen, tekstinhoud).
- Laagvolgorde aanpassen (naar voren/achteren).
- Undo / Redo geschiedenis.
- Exporteren naar PNG of JPG.
- Project opslaan als JSON en later opnieuw openen.
- Desktopmodus via Electron.

## Installatie (development)

### 1) Vereisten
- Node.js 20+
- npm 10+

### 2) Project starten (web)
```bash
npm install
npm run dev
```
Open daarna: `http://localhost:5173`

### 3) Desktop app starten (lokale software)
```bash
npm run desktop
```

---

## ✅ Echte Windows software met installer (.exe)
Je kunt van FlyForge Studio een **echte Windows installer** maken (NSIS), zodat gebruikers de app normaal op Windows kunnen installeren.

### Optie A — lokaal builden op Windows
Doe dit op een Windows-pc:

```bash
npm install
npm run dist:win
```

Daarna staat in `release/` een installer zoals:
- `FlyForge Studio-Setup-1.0.0.exe`

Deze installer:
- maakt startmenu-snelkoppeling
- kan desktop-snelkoppeling maken
- laat installatiemap kiezen
- installeert als normale Windows-app

### Optie B — automatisch via GitHub Actions
In deze repo staat een workflow: `.github/workflows/windows-installer.yml`.

Die bouwt automatisch een Windows installer wanneer je:
- handmatig start via **workflow_dispatch**, of
- een tag pusht zoals `v1.0.0`

De installer wordt als artifact geüpload en kan direct gedownload worden.

## Overige builds
```bash
npm run dist:desktop
```
Bouwt standaard electron-builder targets (waaronder Windows NSIS volgens config).

## Projectstructuur
- `src/App.tsx` — hoofdeditor + business logic
- `src/components/KonvaImage.tsx` — image layer component
- `src/types.ts` — type definities van document en lagen
- `src/styles/app.css` — editor styling
- `electron/main.cjs` — desktop window bootstrap
- `.github/workflows/windows-installer.yml` — automatische Windows installer build

## Open-source licentie
Dit project is open source onder de **MIT License** met copyright op naam van **Vincent Borgers**.
Zie `LICENSE`.
