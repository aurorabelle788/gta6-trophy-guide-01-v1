# Vice Ledger — GTA VI Trophy Guide & Tracker

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/aurorabelle788/gta6-trophy-guide-01-v1/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/aurorabelle788/gta6-trophy-guide-01-v1/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline web app that guides and tracks all 55 PlayStation 5 trophies of
Grand Theft Auto VI: a checklist saved in the browser (localStorage) with
export/import, filters by grade and kind (story, missable, collectibles,
activities), a spoiler setting that hides story trophies until earned, a
platinum roadmap built from the official descriptions, a missables page, and
a guide to every trophy in this entry's own words, each citing its sources
(Exophase for the official name, description and grade; PSNProfiles for PSN
counts and targets).

Where a place or step is not pinned down by the official description, the
guide says so plainly instead of inventing it. No Rockstar logo or official
artwork; the look is our own. No network requests — every file the app loads
lives under `app/`.

## Run it

```sh
node serve.mjs   # serves app/ at http://localhost:8080
```

Or serve `app/` with any static file server and open `index.html`.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, stdlib only) copies `app/` and `screenshots/` to the
output directory and writes `dossier.json` with `buildDossier` from
`vendor/makefun-frontend.ts` (the kit's library, copied verbatim).
