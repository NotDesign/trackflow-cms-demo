"use client";
import type {ReactNode} from "react";
import {ChevronDown} from "lucide-react";

export function TrackingLinkAdvanced({children}:{children:ReactNode}) {
 return <details className="tracking-link-advanced wide">
  <summary><span>進階設定 <small>短網址與 UTM</small></span><ChevronDown size={16} aria-hidden="true"/></summary>
  <div className="form-grid">{children}</div>
 </details>;
}
