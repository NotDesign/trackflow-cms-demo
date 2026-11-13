"use client";
import {createContext,useEffect,useLayoutEffect,useRef,useState,type CSSProperties,type ReactNode} from "react";
import {ChevronLeft,ChevronRight,Pause,Play} from "lucide-react";
import {useLocale} from "./localization";

export const InfoGridContext=createContext(false);
const focusable='button,a[href],input,select,textarea,[tabindex]';
const modulo=(value:number,span:number)=>((value%span)+span)%span;

type ScrollAnimation={from:number;distance:number;started:number};
export function InfoCarousel({children,className=""}:{children:ReactNode;className?:string}){
 const {locale}=useLocale(),zh=locale==="zh-TW";
 const viewport=useRef<HTMLDivElement>(null),grid=useRef<HTMLDivElement>(null),track=useRef<HTMLDivElement>(null);
 const [count,setCount]=useState(0),[overflow,setOverflow]=useState(false),[playing,setPlaying]=useState(true);
 const state=useRef({hover:false,focus:false,drag:false,until:0,startX:0,startScroll:0,moved:false});
 const scroll=useRef({span:0,offset:0,applied:0,animation:null as ScrollAnimation|null});

 // Three identical bands keep the viewport filled while its position is rebased
 // by exactly one band. Only the middle band participates in keyboard navigation.
 const writePosition=(offset:number)=>{
  const v=viewport.current;if(!v)return;
  const s=scroll.current;
  const next=s.span?s.span+modulo(offset-s.span,s.span):offset;
  v.scrollLeft=next;s.offset=next;s.applied=v.scrollLeft;
 };
 useLayoutEffect(()=>{
  const v=viewport.current,g=grid.current,t=track.current;if(!v||!g||!t)return;
  const observed=new Set<Element>();
  const measure=()=>{
   const cards=[...g.querySelectorAll('.cms-info-card')];
   for(const card of cards)if(!observed.has(card)){observed.add(card);resize.observe(card)}
   for(const card of observed)if(!g.contains(card)){resize.unobserve(card);observed.delete(card)}
   const width=g.getBoundingClientRect().width;
   const needsLoop=cards.length>1&&width>v.clientWidth+2;
   setCount(cards.length);setOverflow(needsLoop);
   // Duplicated controls remain pointer-operable, without duplicate Tab stops.
   for(const copy of t.querySelectorAll('[data-carousel-copy]')){
    for(const control of copy.querySelectorAll<HTMLElement>(focusable))control.tabIndex=-1;
   }
   if(overflow&&needsLoop){
    const span=width+parseFloat(getComputedStyle(t).columnGap||'0');
    if(Math.abs(span-scroll.current.span)>.5){
     const phase=scroll.current.span?modulo(scroll.current.offset-scroll.current.span,scroll.current.span)/scroll.current.span:0;
     scroll.current.span=span;scroll.current.animation=null;
     writePosition(span*(1+phase));
    }
   }else if(scroll.current.span){
    scroll.current.span=0;scroll.current.animation=null;writePosition(0);
   }
  };
  const resize=new ResizeObserver(measure),mutation=new MutationObserver(measure);
  resize.observe(v);resize.observe(g);mutation.observe(t,{childList:true,subtree:true});measure();
  return()=>{resize.disconnect();mutation.disconnect()};
 },[overflow]);

 useEffect(()=>{
  if(!overflow)return;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,last=0;
  const tick=(now:number)=>{
   const elapsed=last?Math.min(now-last,50):0;last=now;
   const s=state.current,m=scroll.current;
   if(m.animation){
    const animation=m.animation,t=Math.min((now-animation.started)/360,1);
    writePosition(animation.from+animation.distance*(1-Math.pow(1-t,3)));
    if(t===1)m.animation=null;
   }else if(playing&&!motion.matches&&!document.hidden&&!s.hover&&!s.focus&&!s.drag&&now>s.until){
    writePosition(m.offset+elapsed*.016);
   }
   frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[overflow,playing]);

 const syncScroll=()=>{
  const v=viewport.current;if(!v)return;
  const m=scroll.current,raw=v.scrollLeft;
  // Ignore our own rounded scroll events, retaining subpixel animation progress.
  if(Math.abs(raw-m.applied)<=.5)return;
  m.animation=null;
  const next=m.span?m.span+modulo(raw-m.span,m.span):raw;
  if(Math.abs(next-raw)>.5){
   v.scrollLeft=next;
   if(state.current.drag)state.current.startScroll+=next-raw;
  }
  m.offset=next;m.applied=v.scrollLeft;
 };
 const step=(direction:number)=>{
  const v=viewport.current;if(!v)return;
  state.current.until=performance.now()+6000;
  const distance=direction*v.clientWidth*.8;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)writePosition(scroll.current.offset+distance);
  else scroll.current.animation={from:scroll.current.offset,distance,started:performance.now()};
 };
 const visible=Math.max(1,Math.min(count||6,6));
 const copy=(key:string)=><div key={key} className={`cms-info-grid ${className}`} data-carousel-copy="" aria-hidden="true"
  onMouseDownCapture={e=>{if((e.target as Element).closest(focusable))e.preventDefault()}}
  onFocusCapture={e=>{
   const controls=[...e.currentTarget.querySelectorAll<HTMLElement>(focusable)];
   const index=controls.indexOf(e.target as HTMLElement);
   grid.current?.querySelectorAll<HTMLElement>(focusable)[index]?.focus({preventScroll:true});
  }}>{children}</div>;
 return <InfoGridContext.Provider value>
  <div className="cms-info-carousel" style={{'--metric-card-width':`max(calc(200px * var(--text-scale,1)), calc((100cqi - ${(visible-1)*12}px) / ${visible}))`} as CSSProperties}
   onMouseEnter={()=>state.current.hover=true} onMouseLeave={()=>state.current.hover=false}
   onFocusCapture={e=>state.current.focus=(e.target as Element).matches(':focus-visible')}
   onKeyDownCapture={()=>state.current.focus=true}
   onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))state.current.focus=false}}>
   {overflow&&<div className="cms-info-carousel-controls">
    <button type="button" aria-label={zh?'向左查看摘要卡':'Previous summary cards'} onClick={()=>step(-1)}><ChevronLeft size={15}/></button>
    <button type="button" aria-label={playing?(zh?'暫停摘要卡移動':'Pause summary cards'):(zh?'開始摘要卡移動':'Play summary cards')} aria-pressed={!playing} onClick={()=>setPlaying(v=>!v)}>{playing?<Pause size={13}/>:<Play size={13}/>}</button>
    <button type="button" aria-label={zh?'向右查看摘要卡':'Next summary cards'} onClick={()=>step(1)}><ChevronRight size={15}/></button>
   </div>}
   <div className="cms-info-carousel-viewport" ref={viewport} role="region" aria-label={zh?'指標摘要，可左右捲動':'Summary metrics, scroll horizontally'} tabIndex={0}
    onScroll={syncScroll}
    onWheel={()=>{state.current.until=performance.now()+4000;scroll.current.animation=null}}
    onKeyDown={e=>{if(e.target===e.currentTarget&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();step(e.key==='ArrowRight'?1:-1)}}}
    onPointerDown={e=>{
     state.current.until=performance.now()+5000;state.current.moved=false;scroll.current.animation=null;
     if(e.pointerType==='mouse'&&!(e.target as Element).closest('button,a,input,[role=slider]')){
      state.current.drag=true;state.current.startX=e.clientX;state.current.startScroll=e.currentTarget.scrollLeft;e.currentTarget.setPointerCapture(e.pointerId);
     }
    }}
    onPointerMove={e=>{
     if(state.current.drag){
      const delta=e.clientX-state.current.startX;if(Math.abs(delta)>4)state.current.moved=true;
      writePosition(state.current.startScroll-delta);
     }
    }}
    onPointerUp={e=>{state.current.drag=false;state.current.until=performance.now()+5000;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}}
    onPointerCancel={()=>state.current.drag=false}
    onClickCapture={e=>{if(state.current.moved){e.preventDefault();e.stopPropagation();state.current.moved=false}}}>
    <div ref={track} className="cms-info-carousel-track">
     {overflow&&copy('before')}
     <div ref={grid} className={`cms-info-grid ${className}`}>{children}</div>
     {overflow&&copy('after')}
    </div>
   </div>
  </div>
 </InfoGridContext.Provider>;
}
