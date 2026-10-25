"""Refresh the public Understat snapshot. Standard library only; no credentials."""
import concurrent.futures, csv, datetime, gzip, json, pathlib, time, urllib.request
ROOT = pathlib.Path(__file__).resolve().parents[1]
LEAGUES = {'EPL':'Premier League','La_liga':'La Liga','Bundesliga':'Bundesliga','Serie_A':'Serie A','Ligue_1':'Ligue 1'}
YEARS = list(range(2021,2026))
def fetch(item):
    league, year = item
    url = f'https://understat.com/getLeagueData/{league}/{year}'
    for attempt in range(3):
        try:
            req = urllib.request.Request(url,headers={'X-Requested-With':'XMLHttpRequest','Referer':f'https://understat.com/league/{league}/{year}'})
            raw = urllib.request.urlopen(req,timeout=50).read()
            if raw[:2] == b'\x1f\x8b': raw = gzip.decompress(raw)
            data = json.loads(raw)
            rows = []
            for team in data['teams'].values():
                games = team['history']
                assert len(games) in (34,38), (league,year,team['title'],len(games))
                rows.append({'Season':f'{year}-{str(year+1)[2:]}','Season_Start':year,'League':LEAGUES[league], 'Team_ID':str(team['id']),'Team':team['title'],'Matches_Played':len(games),'Total_xG':round(sum(float(g['xG']) for g in games),8),'Goals':sum(int(g['scored']) for g in games),'Total_xGA':round(sum(float(g['xGA']) for g in games),8),'Source_URL':f'https://understat.com/league/{league}/{year}'})
            assert len(rows) in (18,20)
            return rows
        except Exception:
            if attempt == 2: raise
            time.sleep(attempt+1)
jobs = [(l,y) for l in LEAGUES for y in YEARS]
rows = []
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    for result in pool.map(fetch,jobs): rows.extend(result)
rows.sort(key=lambda r:(r['Season_Start'],r['League'],r['Team']))
assert len({(r['Team_ID'],r['Season']) for r in rows}) == len(rows)
assert len({r['Season'] for r in rows}) == 5
assert all(r['Total_xG'] >= 0 for r in rows)
out=ROOT/'dist'/'data';out.mkdir(parents=True,exist_ok=True)
with (out/'team_seasons.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
meta={'source':'Understat','retrieved_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'seasons':[f'{y}-{str(y+1)[2:]}' for y in YEARS],'rows':len(rows),'teams':len({r['Team_ID'] for r in rows}),'leagues':list(LEAGUES.values()),'source_urls':[f'https://understat.com/league/{l}/{y}' for l,y in jobs]}
(out/'metadata.json').write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps(meta,indent=2))
