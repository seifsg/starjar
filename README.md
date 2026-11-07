# Starjar

Kids tap a chore or good deed they did, a star drops into their jar, and a full jar wins the reward a parent picked.

Installable web app that works offline. Everything stays on the device: no accounts, ads, backend or tracking. English, العربية and Français.

## Run it

Needs Node 22.18 or newer.

```bash
npm ci
npm run dev       # http://localhost:5317
```

```bash
npm run build     # strict type check, then the production build in dist/
npm run preview   # serves dist/ on http://localhost:5318
npm test          # jar and daily-limit rules
```

Add a language: copy `src/i18n/en.ts`, translate it, register it in `src/i18n/index.ts`.

🏭 Built with [AI Software Factory](https://softwarefactory.company/) by Seif
