"use client";
import {useContext,type ReactNode} from "react";
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
  return <Localize><div className={`cms-info-card${accent?" cms-info-card-accent":""} ${className}`}>
    <div className="cms-info-heading"><div className="cms-info-label">{label}{onClick&&<ArrowUpRight size={14} aria-hidden="true"/>}</div><MetricIcon name={iconName}/></div>
    {onClick?<button className="cms-info-value cms-info-value-link" onClick={onClick} disabled={disabled} aria-label={actionLabel}>{value}</button>:<div className="cms-info-value">{value}</div>}
    {detail&&<div className="cms-info-detail">{detail}</div>}
    {children}
  </div></Localize>;
}
