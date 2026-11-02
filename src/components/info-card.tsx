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
  const valueRef=useRef<HTMLSpanElement>(null);
  useLayoutEffect(()=>{
    const content=valueRef.current,box=content?.parentElement;if(!content||!box)return;
    let frame=0,disposed=false;
    const fit=()=>{if(disposed)return;box.style.removeProperty("--info-value-fit");const base=parseFloat(getComputedStyle(box).fontSize),width=content.getBoundingClientRect().width,available=box.clientWidth;if(width>available&&available>0)box.style.setProperty("--info-value-fit",`${base*available/width}px`)};
    const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(fit)};
    fit();const resize=new ResizeObserver(schedule);resize.observe(box);
    const text=new MutationObserver(schedule);text.observe(content,{childList:true,subtree:true,characterData:true});
    const scale=new MutationObserver(schedule);scale.observe(document.documentElement,{attributes:true,attributeFilter:["style","data-text-size"]});
    document.fonts.ready.then(schedule);document.fonts.addEventListener("loadingdone",schedule);
    return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();text.disconnect();scale.disconnect();document.fonts.removeEventListener("loadingdone",schedule)};
  },[value]);
  const fittedValue=<span className="cms-info-value-content" ref={valueRef}>{value}</span>;
  return <Localize><div className={`cms-info-card${accent?" cms-info-card-accent":""} ${className}`}>
    <div className="cms-info-heading"><div className="cms-info-label">{label}{onClick&&<ArrowUpRight size={14} aria-hidden="true"/>}</div><MetricIcon name={iconName}/></div>
    {onClick?<button className="cms-info-value cms-info-value-link" onClick={onClick} disabled={disabled} aria-label={actionLabel}>{fittedValue}</button>:<div className="cms-info-value">{fittedValue}</div>}
    {detail&&<div className="cms-info-detail">{detail}</div>}
    {children}
  </div></Localize>;
}
