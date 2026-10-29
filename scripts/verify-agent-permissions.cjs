const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
function load(file, deps={}) {
 const module={exports:{}};
 const output=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(output,{module,exports:module.exports,require:name=>deps[name]});
 return module.exports;
}
const agents=load('src/lib/agents-v8.ts');
const login=load('src/lib/demo-login.ts',{'./agents-v8':agents});
const a={id:'qa-agent',name:'QA',email:'qa@example.com',status:'Active',campaignIds:['c1']};
const task={id:'task',agentId:a.id,campaignId:'c1',status:'Assigned',note:'',history:[]};
let checks=0;
function check(value){assert.equal(Boolean(value),true);checks++;}
check(agents.agentCan(a,'createWork'));
check(agents.canChangeTask(task,a,'agent','Submitted'));
const readOnly={...a,permissions:{createWork:false,editWork:false,submitWork:false}};
check(!agents.agentCan(readOnly,'createWork'));
check(!agents.canChangeTask(task,readOnly,'agent','In progress'));
check(!agents.canChangeTask(task,readOnly,'agent','Submitted'));
check(agents.visibleAgentTasks(readOnly,[task],['c1']).length===1);
const noWork={...a,permissions:{viewWork:false}};
check(!agents.agentCan(noWork,'createWork'));
check(!agents.canChangeTask(task,noWork,'agent','Submitted'));
check(agents.visibleAgentTasks(noWork,[task],['c1']).length===0);
check(!agents.canChangeTask({...task,agentId:'other'},a,'agent','Submitted'));
check(!agents.canChangeTask({...task,campaignId:'other'},a,'agent','Submitted'));
for(const unavailable of [{...a,status:'Disabled'},{...a,deletedAt:'2026-10-27'}]){
 check(!agents.agentCan(unavailable,'viewWork'));
 check(agents.assignedCampaignIds(unavailable,['c1']).length===0);
 check(!agents.canChangeTask(task,unavailable,'agent','Submitted'));
 check(!login.authenticateDemo('agent',a.email,login.DEMO_PASSWORD,[unavailable]));
}
check(agents.canChangeTask({...task,status:'Submitted'},readOnly,'admin','Approved'));
check(agents.transitionTask(task,readOnly,'agent','Submitted','Note','QA','2026-10-27')===null);
check(login.authenticateDemo('agent',a.email,login.DEMO_PASSWORD,[a]).id===a.id);
console.log(`${checks} agent permission and account lifecycle checks passed`);

const parent={...a,id:'parent',campaignIds:['c1']};
const child={...a,id:'child',parentAgentId:'parent',campaignIds:['c1']};
const peer={...a,id:'peer'};
check(agents.agentAvailable(child,[parent,child]));
check(agents.canManageSubagent(parent,child,[parent,child]));
check(!agents.canManageSubagent(peer,child,[parent,child,peer]));
check(!agents.agentCan(child,'manageSubagents'));
check(!agents.agentAvailable(child,[{...parent,status:'Disabled'},child]));
check(!login.authenticateDemo('agent',child.email,login.DEMO_PASSWORD,[{...parent,status:'Disabled'},child]));
check(!!agents.hierarchyError({...child,parentAgentId:child.id},[parent,child]));
check(!!agents.hierarchyError({...peer,parentAgentId:'child'},[parent,child]));
check(!!agents.hierarchyError({...parent,parentAgentId:'peer'},[parent,child,peer]));
check(!!agents.hierarchyError({...child,campaignIds:['other']},[parent,child]));
const bounded=agents.constrainAgentHierarchy([{...parent,permissions:{createWork:false}}, {...child,campaignIds:['c1','other']}])[1];
check(bounded.campaignIds.join()==='c1');
check(!bounded.permissions.createWork&&!bounded.permissions.manageSubagents);
console.log(`${checks} total hierarchy and access boundary checks passed`);
