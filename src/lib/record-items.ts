export type RecordKind="landing"|"link";
export type RecordItem={id:string;kind:RecordKind;parentId:string;name:string;content:string;note:string;status:"Active"|"Disabled"};
export function recordItemsFor(items:readonly RecordItem[],kind:RecordKind,parentId:string){return items.filter(item=>item.kind===kind&&item.parentId===parentId)}
export function validRecordItems(items:readonly RecordItem[],kind:RecordKind,parentId:string){return items.length<=50&&new Set(items.map(i=>i.id)).size===items.length&&items.every(i=>!!i.id&&i.kind===kind&&i.parentId===parentId&&i.name.trim().length>0&&i.name.trim().length<=80&&i.content.length<=1000&&i.note.length<=500&&["Active","Disabled"].includes(i.status))}
export function replaceRecordItems(current:readonly RecordItem[],kind:RecordKind,parentId:string,next:readonly RecordItem[]){if(!validRecordItems(next,kind,parentId))return null;return [...current.filter(i=>i.kind!==kind||i.parentId!==parentId),...next.map(i=>({...i,name:i.name.trim()}))]}
