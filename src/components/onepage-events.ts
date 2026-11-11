// Keep requests available while the editor chunk is loading.
export const ONE_PAGE_EVENT='trackflow-create-onepage';
let requested=false;
export function openOnePageBuilder(){requested=true;window.dispatchEvent(new Event(ONE_PAGE_EVENT))}
export function consumeOnePageRequest(){const pending=requested;requested=false;return pending}
