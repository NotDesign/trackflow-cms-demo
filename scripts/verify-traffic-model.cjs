const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const ts=require('typescript');const cp=require('node:child_process');
function loader(baseRef){const cache={};return function load(file){file=path.resolve(file);if(cache[file])return cache[file].exports;const module={exports:{}};cache[file]=module;const rel=path.relative(process.cwd(),file);const source=baseRef?cp.execFileSync('git',['show',`${baseRef}:${rel}`],{encoding:'utf8'}):fs.readFileSync(file,'utf8');const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(code,{module,exports:module.exports,URL,URLSearchParams,require:name=>name.startsWith('.')?load(path.resolve(path.dirname(file),name+'.ts')):require(name)});return module.exports;}}
const load=loader(),T=load('src/lib/traffic.ts'),A=load('src/lib/analytics.ts'),C=load('src/lib/client-reports.ts'),F=load('src/lib/finance-v6.ts');let checks=0;
function eq(actual,expected){assert.deepEqual(JSON.parse(JSON.stringify(actual)),JSON.parse(JSON.stringify(expected)));checks++;}
for(const source of ['Facebook','Google','Instagram','TikTok','Telegram'])eq(T.normalizeTraffic({source}).trafficType,'Unclassified');
eq(T.normalizeTraffic({source:'SEO'}),{source:'Search engine (unspecified)',trafficType:'Organic',platform:'Not applicable'});
eq(T.normalizeTraffic({source:'Direct'}).trafficType,'Direct');
eq(T.normalizeTraffic({source:'Facebook',destination:'https://example.com/?utm_medium=paid_social'}).platform,'Meta Ads');
eq(T.normalizeTraffic({source:'Google',medium:'organic'}).platform,'Not applicable');
eq(T.normalizeTraffic({source:'Google',medium:'cpc'}).platform,'Google Ads');
eq(T.validTraffic({source:'Google',platform:'Meta Ads',trafficType:'Paid'}),false);
eq(T.normalizePlatforms(['Google Ads','Meta Ads','Google Ads','SEO']),['Google Ads','Meta Ads']);
const scope={...A.DEFAULT_SCOPE};const base=loader('b5532d7bea1a8d3ea3c9fe7d0ec13465f50d2f61')('src/lib/analytics.ts');
eq(A.metrics(A.inScope(A.allVisits,scope),A.inScope(A.allEvents,scope)),base.metrics(base.inScope(base.allVisits,base.DEFAULT_SCOPE),base.inScope(base.allEvents,base.DEFAULT_SCOPE)));
for(const dimension of ['platform','source','trafficType']){const rows=A.groupRows(A.inScope(A.allVisits,scope),A.inScope(A.allEvents,scope),dimension);eq(rows.reduce((n,r)=>n+r.clicks,0),A.metrics(A.inScope(A.allVisits,scope),A.inScope(A.allEvents,scope)).clicks);eq(Math.round(rows.reduce((n,r)=>n+r.revenue,0)*100),2596900);}
const dims={campaignId:'c',linkId:'l',creativeId:'cr',affiliateId:'a',country:'Taiwan',device:'Mobile'};
const visits=[['Google','Google Ads','Paid'],['Facebook','Meta Ads','Paid'],['Google','Not applicable','Organic'],['Facebook','Unclassified','Unclassified']].map(([source,platform,trafficType],i)=>({...dims,id:'v'+i,visitorId:'person'+i,date:scope.to,time:scope.to+'T12:00:00Z',clicks:1,source,platform,trafficType}));
const events=visits.map((v,i)=>({...v,id:'e'+i,visitId:v.id,status:'Approved',type:'Revenue',revenue:10*(i+1),commission:2*(i+1),amount:0}));
const multi={...scope,platform:'Google Ads|Meta Ads'};
eq(A.inScope(visits,multi).length,2);eq(A.metrics(A.inScope(visits,multi),A.inScope(events,multi)).revenue,30);
eq(A.inScope(visits,{...multi,source:'Facebook'}).length,1);eq(A.inScope(visits,{...multi,trafficType:'Organic'}).length,0);
eq(A.inScope(visits,{...scope,source:'Google',trafficType:'Organic'}).length,1);
eq(A.readScope(new URLSearchParams(A.scopeURL('/reports',multi).split('?')[1])).platform,multi.platform);
eq(A.readScope(new URLSearchParams('source=SEO')).source,'Search engine (unspecified)');
eq(F.costDimensionsSupported(multi),false);
for(const group of ['platform','source','trafficType']){const snap=C.makeClientSnapshot({client:'QA',title:'QA',brand:'TF',note:'',locale:'en',scope:multi,group,metrics:['clicks','revenue']},visits,events,{},[],s=>s,'QA','2026-10-27');eq(snap.total.values.revenue,30);eq(snap.rows.reduce((sum,r)=>sum+r.values.revenue,0),30);}
// Editing a link configuration does not change the immutable historical visit classifications.
const historical=A.allVisits.find(v=>v.source==='Facebook');const before=JSON.stringify(historical);const edited={...A.seedLinks.find(l=>l.id===historical.linkId),trafficType:'Paid',platform:'Meta Ads'};T.normalizeTraffic(edited);eq(JSON.stringify(historical),before);
console.log(`${checks} traffic classification, filter, report and baseline checks passed`);
