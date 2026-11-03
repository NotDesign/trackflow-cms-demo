import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {datePresets}=await server.ssrLoadModule('/src/lib/date-presets.ts');
 const expected={today:['2026-10-16','2026-10-16'],yesterday:['2026-10-15','2026-10-15'],'this-week':['2026-10-12','2026-10-16'],'last-week':['2026-10-05','2026-10-11'],'last-7':['2026-10-10','2026-10-16'],'last-30':['2026-09-17','2026-10-16'],'this-month':['2026-10-01','2026-10-16'],'last-month':['2026-09-01','2026-09-30'],all:['2026-08-18','2026-10-16']};
 for(const p of datePresets())assert.deepEqual([p.from,p.to],expected[p.id],p.id);
 assert.deepEqual(datePresets('2024-03-01','2024-01-01').find(p=>p.id==='last-month').to,'2024-02-29');
 assert.deepEqual(datePresets('2027-01-01','2026-01-01').find(p=>p.id==='last-month').from,'2026-12-01');
 assert.deepEqual(datePresets('2027-01-03','2026-01-01').find(p=>p.id==='this-week').from,'2026-12-28');
 for(const p of datePresets('2026-08-18','2026-08-18')){assert(p.from>='2026-08-18');assert(p.to>='2026-08-18');assert(p.from<=p.to)}
 console.log('Date presets passed: demo ranges, Monday weeks, leap month, year rollover, lower data bound.');
}finally{await server.close()}
