# The Undocumented Trail

**The Undocumented Trail** is an open-source narrative survival game about families navigating displacement, migration, and uncertain legal systems. It takes inspiration from the resource-management structure of trail games while centering contemporary human journeys, difficult tradeoffs, and the consequences people carry with them.

Play the game at [theundocumentedtrail.org](https://theundocumentedtrail.org).

## About the game

Players choose a family or traveling group and make decisions about routes, shelter, work, health, documents, money, medicine, and trust. The available journeys currently include people traveling from Honduras, Syria, Senegal, Vietnam, and India toward destinations in North America or Europe.

### Why I made this

I developed **The Undocumented Trail** as an Oregon Trail–inspired game because I wanted to create something that shares the struggles faced by undocumented migrants. I do not approach this project with a fixed political position on immigration policy. Instead, I wanted to look at migration through a human lens: compassion from one person to another.

Undocumented migrants are often reduced to statistics, slogans, or political arguments. They are also people carrying fear, hope, responsibility, grief, and love. Their stories deserve to be heard.

The game includes:

- Distinct families, routes, resources, events, and endings
- Guided and detailed planning views that share the same saved journey
- Health, stress, exposure, trust, food, water, medicine, cash, and phone-charge systems
- Short-term work, supply stops, travel incidents, and an in-game social feed
- Persistent decisions, family reactions, character loss, and multiple outcomes
- A first-time tutorial, content settings, automatic local saves, music, and interface sounds

## Content note

The story addresses displacement, exploitation, detention, xenophobia, political rhetoric, sexual violence, dangerous crossings, and the death of family members. These events are presented without graphic imagery, and players can choose reduced-detail descriptions.

The characters and scenarios are fictional composites informed by documented migration experiences. They do not portray specific real people, and no single route represents every migrant's experience.

## Run locally

You will need a current version of [Node.js](https://nodejs.org/).

```bash
npm install
npm run dev
```

The development server will print the local address to open in your browser.

## Test and build

```bash
npm test
npm run build
```

## Project structure

- `src/BeginnerApp.jsx` — the default Guided experience
- `src/App.jsx` — the detailed Planning view
- `src/game.js` — families, events, choices, and game rules
- `src/saveStore.js` — local journey saves and archive
- `public/assets/` — maps, portraits, scenes, and audio
- `tests/` — game, layout, onboarding, sound, save, and hosting checks

## Contributing

Issues and pull requests are welcome at [github.com/thachp/theundocumentedtrail](https://github.com/thachp/theundocumentedtrail). Please preserve the game's humane framing: characters should retain agency and specificity, and difficult events should avoid stereotypes or sensationalism.

## License

Released under the [MIT License](LICENSE).
