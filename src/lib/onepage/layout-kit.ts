export type RenderKit={
 e:(value:string)=>string;
 pic:(value:string,alt:string,cls?:string,eager?:boolean)=>string;
 link:(label?:string)=>string;
 storeBadges:()=>string;
 target:string;
};
