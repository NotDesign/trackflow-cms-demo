export type RenderKit={
 e:(value:string)=>string;
 pic:(value:string,alt:string,cls?:string,eager?:boolean)=>string;
 link:(label?:string)=>string;
 storeBadges:()=>string;
 art:(value:string|undefined,alt:string,cls?:string)=>string;
 phone:(value:string|undefined,alt:string)=>string;
 target:string;
};
