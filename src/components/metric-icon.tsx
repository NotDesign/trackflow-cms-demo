import {Wallet,MousePointer2,Users,UserPlus,Goal,Percent,Coins,TrendingUp,ClipboardCheck,AlertTriangle,Link2,Receipt,CheckCircle2,UserRoundCheck,Clock3} from "lucide-react";
/** R&R card icon scale: 48/28, 36/26 at 1500px, 30/20 on mobile. */
export function MetricIcon({name}:{name:string}){
 const n=name.toLowerCase();
 const [Icon,tone]=/^new visitors$/.test(n)?[UserPlus,"cyan"]:/^returning visitors$/.test(n)?[UserRoundCheck,"violet"]:/session/.test(n)?[Clock3,"amber"]:/epc/.test(n)?[Coins,"cyan"]:/per click/.test(n)?[MousePointer2,"amber"]:/pending|review|awaiting/.test(n)?[ClipboardCheck,"amber"]:/issue|priority/.test(n)?[AlertTriangle,"amber"]:/resolved|settled|active agent/.test(n)?[CheckCircle2,"green"]:/expense|cost/.test(n)?[Receipt,"amber"]:/link/.test(n)?[Link2,"cyan"]:/cvr|rate|completion|epc|per click|to deposit|roi/.test(n)?[Percent,"violet"]:/click/.test(n)?[MousePointer2,"cyan"]:/registration|register/.test(n)?[UserPlus,"cyan"]:/unique|visitor|agent/.test(n)?[Users,"cyan"]:/ftd|deposit/.test(n)?[Goal,"violet"]:/commission|settle/.test(n)?[Coins,"green"]:/net|return/.test(n)?[TrendingUp,"green"]:[Wallet,"green"];
 return <span className={`cms-metric-icon cms-icon-${tone}`} aria-hidden="true"><Icon size={28} strokeWidth={1.7}/></span>
}
