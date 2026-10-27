import {useMemo,useSyncExternalStore,forwardRef,type AnchorHTMLAttributes,type MouseEvent} from "react";
const routeSnapshot=()=>window.location.hash.startsWith("#/")?window.location.hash.slice(1):"/overview"+window.location.search;
const subscribe=(listener:()=>void)=>{window.addEventListener("popstate",listener);window.addEventListener("hashchange",listener);return()=>{window.removeEventListener("popstate",listener);window.removeEventListener("hashchange",listener)}};
const useRoute=()=>useSyncExternalStore(subscribe,routeSnapshot,()=>"/overview");
export const usePathname=()=>useRoute().split("?")[0];
export function useSearchParams(){const route=useRoute();return useMemo(()=>new URLSearchParams(route.split("?")[1]||""),[route])}
function navigate(href:string,replace=false,options?:{scroll?:boolean}){const url=new URL(href,window.location.origin);if(url.origin!==window.location.origin){window.location.assign(href);return}window.history[replace?"replaceState":"pushState"](null,"",`${import.meta.env.BASE_URL}#${url.pathname}${url.search}`);window.dispatchEvent(new PopStateEvent("popstate"));if(options?.scroll!==false)window.scrollTo(0,0)}
const router={push:(href:string,options?:{scroll?:boolean})=>navigate(href,false,options),replace:(href:string,options?:{scroll?:boolean})=>navigate(href,true,options),back:()=>history.back(),forward:()=>history.forward(),prefetch:()=>{},refresh:()=>location.reload()};
export function useRouter(){return router}
export const Link=forwardRef<HTMLAnchorElement,AnchorHTMLAttributes<HTMLAnchorElement>&{href:string}>(({href,onClick,...props},ref)=><a {...props} ref={ref} href={href.startsWith("/")?`${import.meta.env.BASE_URL}#${href}`:href} onClick={(event:MouseEvent<HTMLAnchorElement>)=>{onClick?.(event);if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||props.target==="_blank"||!href.startsWith("/"))return;event.preventDefault();navigate(href)}}/>);
export default Link;
