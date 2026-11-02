"use client";
import {useContext,useLayoutEffect,useRef,type ReactNode} from "react";
import {InfoCarousel,InfoGridContext} from "./info-carousel";
import {ArrowUpRight} from "lucide-react";
import {MetricIcon} from "./metric-icon";
import {Localize} from "./localization";

export function InfoCardGrid({children,columns=4,className=""}:{children:ReactNode;columns?:number;className?:string}) {
  const nested=useContext(InfoGridContext);
  return nested?<div className="cms-nested-info-grid">{children}</div>:<InfoCarousel className={className}>{children}</InfoCarousel>;
}

export function InfoCard({label,iconName,value,detail,onClick,disabled,actionLabel,accent=false,children,className=""}:{
  label:ReactNode;iconName:string;value:ReactNode;detail?:ReactNode;
  onClick?:()=>void;disabled?:boolean;actionLabel?:string;accent?:boolean;children?:ReactNode;className?:string;
}) {
  const valueRef=useRef<HTMLSpanElement>(null),titleRef=useRef<HTMLSpanElement>(null);
  useLayoutEffect(()=>{
    const valueNode=valueRef.current,titleNode=titleRef.current;if(!valueNode||!titleNode)return;
    let frame=0,disposed=false;
    const fit=()=>{
      if(disposed)return;
      for(const [content,property] of [[valueNode,"--info-value-fit"],[titleNode,"--info-label-fit"]] as const){
        const box=content.parentElement;if(!box)continue;box.style.removeProperty(property);
        const action=box.querySelector(":scope > svg"),available=box.clientWidth-(action?action.getBoundingClientRect().width+6:0);
        if(available<=0)continue;
        // Re-measure because help icons keep their size while the title shrinks.
        for(let i=0;i<5;i++){
          const width=content.getBoundingClientRect().width;if(width<=available)break;
          const font=parseFloat(getComputedStyle(content).fontSize);
          box.style.setProperty(property,`${font*Math.max(.1,available-1)/width}px`);
        }
      }
    };
    const schedule=()=>{if(disposed)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(fit)};
    fit();const resize=new ResizeObserver(schedule);resize.observe(valueNode.parentElement!);resize.observe(titleNode.parentElement!);
    const text=new MutationObserver(schedule);for(const node of [valueNode,titleNode])text.observe(node,{childList:true,subtree:true,characterData:true});
    const scale=new MutationObserver(schedule);scale.observe(document.documentElement,{attributes:true,attributeFilter:["style","data-text-size"]});
    document.fonts.ready.then(schedule);document.fonts.addEventListener("loadingdone",schedule);
    return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();text.disconnect();scale.disconnect();document.fonts.removeEventListener("loadingdone",schedule)};
  },[label,value]);
  const fittedValue=<span className="cms-info-value-content" ref={valueRef}>{value}</span>;
  return <Localize><div className={`cms-info-card${accent?" cms-info-card-accent":""} ${className}`}>
    <div className="cms-info-heading"><div className="cms-info-label"><span className="cms-info-title" ref={titleRef}>{label}</span>{onClick&&<ArrowUpRight size={14} aria-hidden="true"/>}</div><MetricIcon name={iconName}/></div>
    {onClick?<button className="cms-info-value cms-info-value-link" onClick={onClick} disabled={disabled} aria-label={actionLabel}>{fittedValue}</button>:<div className="cms-info-value">{fittedValue}</div>}
    {detail&&<div className="cms-info-detail">{detail}</div>}
    {children}
  </div></Localize>;
}
