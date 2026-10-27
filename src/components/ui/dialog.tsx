"use client";
import { Localize } from "@/components/localization";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "./button";
export function Dialog({ open, onOpenChange, title, description, children, drawer = false, className = "" }: { open: boolean; onOpenChange: (value: boolean) => void; title: string; description?: string; children: React.ReactNode; drawer?: boolean; className?: string }) {
const descriptionId=React.useId();
const standardLayout=!className.split(" ").some(name=>["cms-bot-dialog","cms-mobile-navigation"].includes(name));
return <Localize><DialogPrimitive.Root open={open} onOpenChange={onOpenChange}><DialogPrimitive.Portal><DialogPrimitive.Overlay className="dialog-overlay" /><DialogPrimitive.Content className={(drawer ? "dialog-content drawer" : "dialog-content")+(standardLayout?" dialog-standard":"")+" "+className} aria-describedby={description ? descriptionId : undefined}><div className="dialog-heading"><div><DialogPrimitive.Title>{title}</DialogPrimitive.Title>{description && <DialogPrimitive.Description id={descriptionId}>{description}</DialogPrimitive.Description>}</div><DialogPrimitive.Close asChild><Button variant="ghost" size="icon" aria-label="Close dialog"><X size={18}/></Button></DialogPrimitive.Close></div>{standardLayout?<div className="dialog-body">{children}</div>:children}</DialogPrimitive.Content></DialogPrimitive.Portal></DialogPrimitive.Root></Localize>;
}
