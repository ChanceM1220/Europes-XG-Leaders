# Tableau workbook and verification

The completed [Europe xG Leaders dashboard](https://public.tableau.com/app/profile/chance.moore/viz/EuropexGLeaders-ChanceMoore/EuropexGLeaders#1) uses the same team_seasons.csv as this website. Published and checked October 25, 2026.

## Scope

Question: Which team leads Europe's top five domestic leagues in xG per game and average xG per season? One row is one team in one completed league season, 2021–22 through 2025–26. Author: Chance Moore. Default population: clubs present in every selected season.

## Native workbook

Three sheets: Summary measures, Team xG per game, and Average team xG per season. Both rankings show the ten highest eligible teams and use labeled horizontal bars. The dashboard includes the question, row definition, period, author, source and a sentence reporting the default five-season finding.

League, Season and Team are shared filters applied to All Using This Data Source. League and Season are context filters. Include team is filtered to True on every sheet. Team remains an ordinary filter so eligibility is computed for the selected season/league scope. All quick filters default to All.

Tableau displays imported CSV names with spaces: Team_ID becomes Team ID, Total_xG becomes Total xG, and Matches_Played becomes Matches Played.

## Calculated fields

- xG per game: `SUM([Total xG]) / SUM([Matches Played])`
- Average xG per season: `SUM([Total xG]) / COUNTD([Season])`
- Highest team xG per game: `MAX({ FIXED [Team ID] : SUM([Total xG]) / SUM([Matches Played]) })`
- Highest team average xG per season: `MAX({ FIXED [Team ID] : SUM([Total xG]) / COUNTD([Season]) })`
- Teams compared: `COUNTD([Team ID])`
- Team-season records included: `COUNT([Season])`
- Include team: `{ FIXED [Team ID] : COUNTD([Season]) } = { FIXED : COUNTD([Season]) }`
- Top ten displayed teams: `INDEX() <= 10`

Summary measures uses Measure Names on Rows and Measure Values on Text, restricted to the four named summary measures. Show two decimals for the first two and zero for counts. The local Measure Names filter stays on the summary sheet.

Rankings use Team on Rows and the appropriate aggregate measure on Columns. Sort descending by that sheet's measure, show labels and fit Entire View. Add Top ten displayed teams=True locally, computed down Team. This is a display filter; never apply it to the summary sheet or globally.

## Independently observed agreement

Order: highest team xG/game; highest team average xG/season; teams compared; team-season rows.

- All five leagues and seasons: 2.82; 95.85; 64; 320. Bayern Munich leads both rankings.
- Premier League, all five seasons: 2.26; 85.82; 14; 70. Liverpool leads both rankings.
- All leagues, 2024–25 only: 3.05; 103.63; 96; 96. Paris Saint Germain leads both rankings.

These results were observed in native Tableau, with all three sheets responding to the same filters. Defaults were restored before publishing and checked again on the saved public view. Website calculations also passed independent Python reconciliation across 180 filter combinations.

The website navigation and agreement table link to the published Tableau dashboard. config.json records the observed default values; its comparison allows only display-rounding differences. Both tools use a frozen snapshot, not a live database synchronization. Changing a filter on one tool does not automatically change the other; select equivalent filters when comparing.

The website additionally supports a full-coverage-off option, trend charts, a table and filtered CSV export. Tableau keeps full selected-period coverage enabled. These optional website controls are outside the shared default comparison.

## Rubric status

Complete: same CSV and definitions; title, rows and period; author; four matching labels and numbers; shared controls affecting multiple sheets; one-sentence finding; published Tableau Public dashboard; website agreement table and Tableau link.

Published public repository: https://github.com/ChanceM1220/Europes-XG-Leaders. Published GitHub Pages website: https://chancem1220.github.io/Europes-XG-Leaders/. SUBMISSION.md contains all four required lines.

## Official documentation

- [FIXED expressions and filters](https://help.tableau.com/current/pro/desktop/en-us/calculations_calculatedfields_lod_filters.htm)
- [Filters shared across worksheets](https://help.tableau.com/current/pro/desktop/en-gb/filtering_global.htm)
