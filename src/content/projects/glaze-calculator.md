Glaze chemistry is not intuitive. Most ceramic artists work from recipes — lists of raw materials with percentage weights — without a clear picture of what oxides those materials contribute or how they interact at temperature.

Unity Molecular Formula (UMF) is the standard analytical tool: it normalises a recipe so the flux oxides sum to 1.0, letting you compare glazes and predict properties like melt temperature, surface texture, and colour response.

## The problem with existing tools

The calculators I found were either desktop-only legacy software or online tools cluttered with features aimed at production studios. I wanted something minimal: paste in a recipe, see the UMF, get a rough colour prediction.

## What it does

- Accepts ingredient names (matched against a database of ~200 common materials) and percentage weights
- Computes the oxide analysis and UMF
- Flags potential issues: high alumina (stiff melt), high boron (possible crawling), low silica (crazing risk)
- Shows a colour swatch based on colourant oxides — iron, cobalt, copper, manganese — using empirical rules from digitalfire.com

## Stack

Built with React and no backend. The material database is a JSON file compiled from public ceramic chemistry references. All calculations run client-side.

## Limitations

Colour prediction is rough. Glaze colour depends on firing atmosphere, clay body, thickness, and kiln cooling rate — none of which a calculator can know. The swatch is a starting point, not a promise.
