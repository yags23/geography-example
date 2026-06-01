# Australia Population Quest

A single-page React and Tailwind classroom geography game based on Australia's state and territory population patterns.

## Run locally

From this folder:

```sh
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Update population data

Edit `src/data.js`.

The population values are in the `states` array. Update each `population` field, then update:

- `populationReferenceDate`
- `nationalPopulation`
- `populationSource`
- `populationSourceUrl`
- `sourceRelease`

The app recalculates population density from `population / areaKm2`.

## Current sources

- Australian Bureau of Statistics, National, state and territory population, September 2025
- Geoscience Australia, Area of Australia - States and Territories
