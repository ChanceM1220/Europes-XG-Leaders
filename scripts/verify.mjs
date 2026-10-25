import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),XG=require('../dist/analytics.js');
const rows=XG.parseCSV(fs.readFileSync(new URL('../dist/data/team_seasons.csv',import.meta.url),'utf8'));
assert.equal(rows.length,484);assert.equal(new Set(rows.map(r=>r.Team_ID)).size,130);
assert.equal(new Set(rows.map(r=>r.Season)).size,5);
assert.equal(new Set(rows.map(r=>r.Team_ID+':'+r.Season)).size,484);
for(const r of rows){assert(Number.isFinite(r.Total_xG)&&r.Total_xG>=0);assert([34,38].includes(r.Matches_Played));assert(Number.isInteger(r.Goals)&&r.Goals>=0);assert(r.Source_URL.startsWith('https://understat.com/league/'));}
for(const league of new Set(rows.map(r=>r.League)))for(const season of XG.SEASONS){const rs=rows.filter(r=>r.League===league&&r.Season===season);assert(rs.length===18||rs.length===20);assert.equal(rs.reduce((s,r)=>s+r.Goals,0)%1,0);assert(Math.abs(rs.reduce((s,r)=>s+r.Total_xG-r.Total_xGA,0))<.001,'League total xG must reconcile to total xGA');}
const s=XG.summary(XG.filter(rows));assert.equal(s.rate.team,'Bayern Munich');assert.equal(s.season.team,'Bayern Munich');assert(Math.abs(s.values[0]-2.8191237682352943)<1e-10);assert(Math.abs(s.values[1]-95.85020812)<1e-8);assert.equal(s.values[2],64);assert.equal(s.values[3],320);
assert.equal(XG.summary(XG.filter(rows,{complete:false})).values[3],484);
assert.equal(XG.summary(XG.filter(rows,{team:'no such team'})).values[0],null);
assert.equal(XG.summary(XG.filter(rows,{team:'Liverpool'})).values[3],5);
assert.equal(XG.summary(XG.filter(rows,{league:'Premier League'})).values[2],14);
const psg=XG.aggregate(XG.filter(rows,{team:'Paris Saint Germain'}))[0];assert.equal(psg.matches,178);assert(Math.abs(psg.perGame-420.637759/178)<1e-10,'Rate must use total games despite Ligue 1 schedule change');
const cases=[];for(let a=0;a<5;a++)for(let b=a;b<5;b++)for(const league of ['all',...new Set(rows.map(r=>r.League))])for(const complete of [true,false]){const opts={seasons:XG.SEASONS.slice(a,b+1),league,complete};const selected=XG.filter(rows,opts),ss=XG.summary(selected);assert.equal(selected.length,ss.teams.reduce((n,t)=>n+t.rows.length,0));if(complete)assert(ss.teams.every(t=>t.seasonCount===opts.seasons.length));cases.push({opts,values:ss.values});}
// Python independently groups the CSV to cross-check every season/league/coverage combination.
const {spawnSync}=await import('node:child_process');
const py=spawnSync('python',['-c',`import csv,json,sys,collections
rows=list(csv.DictReader(open('dist/data/team_seasons.csv')))
cases=json.load(sys.stdin)
for c in cases:
 o=c['opts'];rs=[r for r in rows if r['Season'] in o['seasons'] and (o['league']=='all' or r['League']==o['league'])]
 groups=collections.defaultdict(list)
 for r in rs:groups[r['Team_ID']].append(r)
 if o['complete']:groups={k:g for k,g in groups.items() if len(set(r['Season'] for r in g))==len(o['seasons'])}
 rate=[sum(float(r['Total_xG']) for r in g)/sum(int(r['Matches_Played']) for r in g) for g in groups.values()]
 season=[sum(float(r['Total_xG']) for r in g)/len(set(r['Season'] for r in g)) for g in groups.values()]
 actual=[max(rate) if rate else None,max(season) if season else None,len(groups),sum(len(g) for g in groups.values())]
 for a,b in zip(actual,c['values']):assert (a is None and b is None) or abs(a-b)<1e-7,(o,actual,c['values'])
print('Independent Python reconciliation passed for',len(cases),'filter combinations.')`],{cwd:new URL('..',import.meta.url),input:JSON.stringify(cases),encoding:'utf8'});
assert.equal(py.status,0,py.stderr);console.log(py.stdout.trim());
for(const f of ['index.html','dashboard.html','tableau-guide.html','README.md','TABLEAU_GUIDE.md','SUBMISSION.md','config.json','styles.css','app.js','analytics.js','data/metadata.json'])assert(fs.existsSync(new URL('../dist/'+f,import.meta.url)),f);
console.log('Verified: complete source coverage; unique team-season keys; xG/xGA reconciliation; both leaders; 64 eligible teams; 320 default records; empty results; weighted Ligue 1 rates; required files.');
