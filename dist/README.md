# Europe's xG Leaders

A report and browser-calculated dashboard by **Chance Moore** for FINN 43303, Project B, University of Arkansas.

## Four project definitions

- **Question:** Which team in Europe's top five soccer leagues generated the highest xG per game and average total xG per season over five completed seasons?
- **Reader:** A club performance analyst benchmarking attacking chance creation.
- **Rows counted:** One team in one completed domestic league season. The default comparison includes only teams present in every selected season.
- **Period:** 2021–22 through 2025–26.

## Data and findings

Source: [Understat](https://understat.com/). The CSV aggregates match-level xG for the Premier League, La Liga, Bundesliga, Serie A and Ligue 1. Source URLs are included on each data row and all 25 league-season pages are listed in metadata.json. The snapshot was retrieved October 25, 2026.

The file has 484 records, 130 distinct teams and five seasons. The balanced five-season comparison has 64 teams and 320 records. Bayern Munich leads both five-season rankings: 479.2510406 xG across 170 games, or 2.8191237682352943 xG per game and 95.85020812 xG per season. The report rounds to 2.82 and 95.85.

The other 164 rows remain in the source file and are available with a shorter period or with full-period coverage disabled. No missing xG is filled with zero. Cup games and European competitions are outside the scope. The dataset is a frozen snapshot, not a live feed. All data use Understat's model; opponent and league difficulty are not adjusted.

## Definitions shared by website and Tableau

1. Highest team xG per game = maximum team SUM(Total_xG) / SUM(Matches_Played).
2. Highest team average xG per season = maximum team SUM(Total_xG) / COUNTD(Season).
3. Teams compared = distinct Team_ID values after filters and eligibility.
4. Team-season records included = row count after filters and eligibility.

Default filters: all seasons, all leagues, all teams, Require full period on. Each included team must appear in each selected season. Disabling coverage uses observed seasons for each team's season-average denominator. Rates combine numerators and denominators; they are not averages of rounded rates. Results are rounded only at display. Ties use alphabetical team names as a stable display order.

## File inventory

- `dist/index.html`: report with an answer, recommendation, four summary cards, three findings and charts, methodology and Tableau agreement table.
- `dist/dashboard.html`: interactive dashboard with season, league and team filters; coverage control; measure toggle; charts; sortable table; filtered CSV export; shareable URL filters.
- `dist/styles.css`: shared visual design and responsive layouts. Optional Google Fonts have local sans-serif fallbacks.
- `dist/analytics.js`: pure CSV parsing, filtering, aggregation and summary functions shared by both pages and verification.
- `dist/app.js`: DOM rendering, SVG charts, controls, agreement-table rendering and data loading. No external chart library or analytics tracking.
- `dist/data/team_seasons.csv`: the exact 484-row source file, also used in Tableau.
- `dist/data/metadata.json`: snapshot time, coverage and 25 source URLs.
- `dist/config.json`: author, publishing URLs and independently observed Tableau agreement values.
- `dist/tableau-guide.html`: readable step-by-step Tableau instructions.
- `dist/TABLEAU_GUIDE.md`: downloadable version of those instructions.
- `dist/README.md`: published copy of this file.
- `dist/SUBMISSION.md`: four-line submission template; do not submit while any URL is pending.
- `scripts/fetch_data.py`: reproducible Understat extraction using the public data endpoint used by the league pages.
- `scripts/verify.mjs`: calculation and data-integrity verification.
- `.openai/hosting.json`: Sites hosting configuration; excluded from the separate GitHub export.
- `.gitignore`: local caches, dependencies and archives.
- `.github/workflows/pages.yml`: GitHub Pages deployment workflow when the public repository is created.

## Run locally

From `dist`, run a standard static HTTP server such as `python -m http.server 8000`, then visit http://localhost:8000. Do not open the HTML as file://, because the dashboard fetches its CSV in the browser. No npm installation or build step is needed.

## Refresh and verify

From the project root, run `python scripts/fetch_data.py`, then `node scripts/verify.mjs`. The fetch script uses https://understat.com/getLeagueData/{league}/{season_start_year}, matching the endpoint used by Understat's own league pages. A refreshed snapshot can change results and requires rechecking the report, Tableau and agreement table before republishing.

## GitHub Pages

The public repository uses a GitHub Actions workflow that publishes only `dist/`. Enable GitHub Pages with GitHub Actions as its source. All asset and data paths are relative, so they work on a repository subpath. The private Sites preview is an additional working copy and does not substitute for the rubric's public GitHub Pages requirement.

## Tableau and agreement status

The independently built [Tableau Public dashboard](https://public.tableau.com/app/profile/chance.moore/viz/EuropexGLeaders-ChanceMoore/EuropexGLeaders#1) is published. It uses the same 484-row CSV, calculated fields, three sheets, shared League/Season/Team filters and full-selected-period eligibility. League and Season are context filters, so FIXED calculations respond to the selected scope. Top-ten table-calculation filters affect ranking displays only, not the summary population.

Native Tableau results were observed on October 25, 2026: default 2.82 xG/game, 95.85 average xG/season, 64 teams and 320 rows; Premier League 2.26, 85.82, 14 and 70; 2024–25 only 3.05, 103.63, 96 and 96. All three sheets changed together. Defaults were restored before publication. The website agreement table records those independently observed default values.

Tableau imports CSV underscores as spaces in display names: `Team_ID` becomes `[Team ID]`, `Total_xG` becomes `[Total xG]`, and `Matches_Played` becomes `[Matches Played]`. Use the displayed names in its calculation editor. The published workbook is the authoritative Tableau result; the build guide remains available for reproduction.

Public repository: https://github.com/ChanceM1220/Europes-XG-Leaders. GitHub Pages deployment is being verified before submission.

Official Tableau references: [FIXED LOD and filters](https://help.tableau.com/current/pro/desktop/en-us/calculations_calculatedfields_lod_filters.htm), [shared filters](https://help.tableau.com/current/pro/desktop/en-gb/filtering_global.htm).

## Attribution

Underlying football statistics and xG model: Understat. This is an independent student analysis and is not affiliated with Understat, a league or a club. The project publishes team-level aggregates, not private individual information. Retain source attribution when reusing the dataset.
