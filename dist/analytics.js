/* Shared pure calculations: report, dashboard and automated checks use these definitions. */
(function(root){
 'use strict';
 const SEASONS=['2021-22','2022-23','2023-24','2024-25','2025-26'];
 const LABELS=['Highest team xG per game','Highest team average xG per season','Teams compared','Team-season records included'];
 function parseCSV(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v!==''))rows.push(row);row=[];cell='';}else cell+=c;}
  if(cell||row.length){row.push(cell);rows.push(row);}const headers=rows.shift();
  return rows.map(r=>{const o=Object.fromEntries(headers.map((k,i)=>[k,r[i]]));for(const k of ['Season_Start','Matches_Played','Total_xG','Goals','Total_xGA'])o[k]=Number(o[k]);return o;});
 }
 function filter(rows,opts={}){
  const seasons=opts.seasons||SEASONS,league=opts.league||'all',query=(opts.team||'').trim().toLowerCase();
  let selected=rows.filter(r=>seasons.includes(r.Season)&&(league==='all'||r.League===league));
  const coverage=new Map();selected.forEach(r=>{if(!coverage.has(r.Team_ID))coverage.set(r.Team_ID,new Set());coverage.get(r.Team_ID).add(r.Season);});
  if(opts.complete!==false)selected=selected.filter(r=>coverage.get(r.Team_ID).size===seasons.length);
  if(query)selected=selected.filter(r=>r.Team.toLowerCase().includes(query));
  return selected;
 }
 function aggregate(rows){
  const groups=new Map();for(const r of rows){if(!groups.has(r.Team_ID))groups.set(r.Team_ID,{id:r.Team_ID,team:r.Team,league:r.League,xg:0,matches:0,goals:0,seasons:new Set(),rows:[]});const t=groups.get(r.Team_ID);t.xg+=r.Total_xG;t.matches+=r.Matches_Played;t.goals+=r.Goals;t.seasons.add(r.Season);t.rows.push(r);}
  return [...groups.values()].map(t=>({...t,seasonCount:t.seasons.size,perGame:t.matches?t.xg/t.matches:0,perSeason:t.seasons.size?t.xg/t.seasons.size:0}));
 }
 function rank(teams,metric='perGame'){return [...teams].sort((a,b)=>b[metric]-a[metric]||a.team.localeCompare(b.team));}
 function summary(rows){const teams=aggregate(rows),rate=rank(teams,'perGame')[0],season=rank(teams,'perSeason')[0];return {teams,rate,season,values:[rate?.perGame??null,season?.perSeason??null,teams.length,rows.length]};}
 const api={SEASONS,LABELS,parseCSV,filter,aggregate,rank,summary};root.XG=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
