import {DEMO_START,DEMO_TODAY,shiftDate} from "./analytics";
export type DateRange={from:string;to:string};
export function datePresets(today=DEMO_TODAY,minimum=DEMO_START){
 const day=new Date(today+"T00:00:00Z"),monday=shiftDate(today,-((day.getUTCDay()+6)%7));
 const month=today.slice(0,7)+"-01",lastMonthEnd=shiftDate(month,-1),lastMonth=lastMonthEnd.slice(0,7)+"-01";
 return [
  {id:"today",en:"Today",zh:"今天",from:today,to:today},
  {id:"yesterday",en:"Yesterday",zh:"昨天",from:shiftDate(today,-1),to:shiftDate(today,-1)},
  {id:"this-week",en:"This week",zh:"本週",from:monday,to:today},
  {id:"last-week",en:"Last week",zh:"上週",from:shiftDate(monday,-7),to:shiftDate(monday,-1)},
  {id:"last-7",en:"Last 7 days",zh:"近 7 天",from:shiftDate(today,-6),to:today},
  {id:"last-30",en:"Last 30 days",zh:"近 30 天",from:shiftDate(today,-29),to:today},
  {id:"this-month",en:"This month",zh:"本月",from:month,to:today},
  {id:"last-month",en:"Last month",zh:"上月",from:lastMonth,to:lastMonthEnd},
  {id:"all",en:"All dates",zh:"全部日期",from:minimum,to:today},
 ].filter(p=>p.to>=minimum).map(p=>({...p,from:p.from<minimum?minimum:p.from}));
}
