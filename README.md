# Dielňa — dielenský pomocník

Jedna webová appka (PWA) pre stolára: výpočty, ktoré treba v dielni, na mobile aj na PC.
Spája doterajšie appky **Rozteč políc** a **Šuflikátor** a pripravuje miesto pre ďalšie nástroje.

| Nástroj | Stav |
|---|---|
| Rozteč políc | hotové (dávka 2) — výpočet, nákres, tabuľka, PDF |
| Šuplíky (Hettich Atira EB10.5) | presúva sa (dávka 3) |
| Dvere a pánty, Plynové piesty, 32 mm raster | pripravujeme |

## Čo už funguje (dávka 1)

- domovská obrazovka s dlaždicami nástrojov,
- svetlá / tmavá téma (predvolene podľa telefónu) a akcent teal / cyan / indigo,
- spoločné nastavenia: hrúbka materiálu (18 mm) a zaokrúhlenie (0,5 mm), uložené v telefóne (`localStorage`),
- register nástrojov, testy (Vitest) a CI (testy + build pri každom pushi).

## Rozteč políc (dávka 2)

- zadanie: vonkajšia/vnútorná výška, hrúbka (predvolená zo spoločných nastavení), počet políc; „Viac“: rýchle hrúbky, výšky od dna/spodnej hrany, zaokrúhlenie,
- na mobile sa zadanie, výsledok aj nákres zmestia na jednu obrazovku, pod nimi tabuľka výšok,
- **Stiahnuť PDF** — skutočný vektorový PDF súbor (jsPDF): nákres čiarami, tabuľka, slovenská diakritika cez vložené písmo Inter. Knižnica sa načíta až pri kliknutí.
- nákres je zoznam tvarov (`core/draw/shapes.ts`), ktorý sa kreslí do SVG aj do PDF — jeden kód, rovnaký výsledok.

## Spustenie

Potrebuješ Node.js 20+ a npm.

```bash
npm ci
npm run dev       # vývoj
npm test          # testy
npm run build     # produkčná verzia do dist/
npm run preview   # lokálne zobrazenie buildu
```

## Štruktúra

```
src/
  App.tsx            router (/, /nastavenia, cesty nástrojov)
  shell/             domov, nastavenia, horná lišta, stránka nástroja, ErrorBoundary
  core/              nastavenia, téma, úložisko, formátovanie mm, register nástrojov, typy
  ui/                spoločné komponenty a ikony
  modules/<id>/      jeden priečinok = jeden nástroj
  styles/index.css   farebné tokeny (svetlá/tmavá) + Tailwind
```

## Ako pridať nový nástroj

1. Vytvor `src/modules/<id>/` s týmito súbormi:
   - `meta.tsx` — názov, ikona, cesta, `status: 'ready' | 'soon'`, `load: () => import('./View')`
   - `calc.ts` — **čistý** výpočet (bez Reactu a localStorage) + `calc.test.ts`
   - `Drawing.tsx` — nákres z výsledku
   - `View.tsx` — obrazovka nástroja
2. Pridaj meta do `src/core/registry.ts`. Dlaždica a cesta sa objavia samé.
3. Ukladaj do kľúča `dielna:<id>:v1` (pomocníci v `core/storage.ts`).

Pravidlá: počíta sa presne, zaokrúhľuje sa iba pri zobrazení (`core/format.ts`). Hrúbku a zaokrúhlenie ber zo spoločných nastavení (`useSettings()`).

## Úložisko

| Kľúč | Obsah |
|---|---|
| `dielna:shared:v1` | hrúbka, zaokrúhlenie, téma, akcent |
| `dielna:<nástroj>:v1` | posledné zadanie nástroja |

## Hosting

Firebase Hosting, projekt `suflikator-v1-n` (rovnaká adresa ako doterajší Šuflikátor).
`firebase.json` je pripravený (SPA, cache hlavičky), **nasadenie zatiaľ nie je zapnuté**.
