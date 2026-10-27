import type {AgentTask,TaskStatus} from "./agents-v8";
export type AgentHomeView="campaigns"|"progress"|"revision"|"complete";
export function homeTaskView(status:TaskStatus):Exclude<AgentHomeView,"campaigns">{return status==="Changes requested"?"revision":status==="Approved"?"complete":"progress"}
export function submissionSnapshot(task:AgentTask){const submitted=task.history.filter(h=>h.status==="Submitted").at(-1),returned=task.history.filter(h=>h.status==="Changes requested").at(-1),review=task.history.filter(h=>h.status==="Approved"||h.status==="Changes requested").at(-1);return {submittedAt:submitted?.at||"",submittedNote:submitted?.note||"",submittedBy:submitted?.actor||"",returnReason:returned?.note||"",reviewedAt:review?.at||"",reviewedBy:review?.actor||""}}
export function inboxTasks(tasks:readonly AgentTask[]){return tasks.filter(t=>t.history.some(h=>h.status==="Submitted")).map(task=>({...task,...submissionSnapshot(task)}))}
