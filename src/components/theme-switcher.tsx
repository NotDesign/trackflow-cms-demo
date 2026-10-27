"use client";
import {Moon,Sun} from "lucide-react";
import {Button} from "./ui/button";
import {useLocale} from "./localization";
export function ThemeSwitcher({theme,onChange,ready}:{theme:"light"|"dark";onChange:(theme:"light"|"dark")=>void;ready:boolean}){
 const {locale}=useLocale(),label=locale==="zh-TW"?(theme==="dark"?"切換淺色模式":"切換深色模式"):(theme==="dark"?"Switch to light mode":"Switch to dark mode");
 return <Button variant="ghost" size="icon" className="theme-switcher" aria-label={label} title={label} aria-pressed={theme==="dark"} disabled={!ready} onClick={()=>onChange(theme==="dark"?"light":"dark")}>{theme==="dark"?<Moon size={19}/>:<Sun size={19}/>}</Button>
}
