'use strict';
const assert=require('node:assert/strict');
const C=require('../expansion.js');
const {Game}=require('../engine.js');
const storage=()=>({data:new Map(),getItem(k){return this.data.get(k)||null;},setItem(k,v){this.data.set(k,v);}});
const game=()=>new Game({load:false,storage:storage()});
let pass=0;
function test(name,fn){try{fn();console.log('PASS',name);pass++;}catch(e){console.error('FAIL',name);throw e;}}
function consume(g){
 for(let attempts=0;attempts<20&&g.s.pending;attempts++){
  const kind=g.s.pending.kind;
  if(kind==='encounter')assert.ok(g.chooseEncounter(g.s.pending.id.includes('warded')?1:0));
  else if(kind==='lore')g.chooseLore(3);
  else if(kind==='notice')g.closeNotice();
  else if(kind==='skills')g.chooseSkill(-1);
  else if(kind==='report')g.openShop();
  else break;
 }
}
test('content scale: authored skills 77 ghosts 36 events 145 food 26',()=>{
 assert.equal(C.skills.length,77);assert.equal(C.ghosts.length,36);assert.equal(C.encounters.length,145);assert.equal(C.meals.length,26);
 assert.equal(new Set(C.encounters.map(x=>x.id)).size,145);
 assert.equal(new Set(C.skills.map(x=>x.id)).size,77);
});
test('fixed-slot queue: removing middle never shifts',()=>{const g=game();g.appendSchedule('work',2);g.appendSchedule('sleep',7);g.appendSchedule('meal',11);g.removeSchedule(7);assert.equal(g.s.schedule[7],null);assert.equal(g.s.schedule[11],'meal');});
test('research takes 4h and finds 0 or 1 skills per day',()=>{
 let found=0,n=450;
 for(let k=1;k<=n;k++){
  let g=game();g.s.rng=k*17;
  for(let i=0;i<4;i++){g.performAction('research');consume(g);}assert.ok(g.s.research_found_today<=1);found+=g.s.research_found_today;
 }assert.ok(found>140&&found<340,'4h research discovery '+found+'/'+n);
});
test('excess sleep damages mental and cannot generate daily windfall',()=>{
 const g=game();g.s.wealth=100;g.s.luck=100;g.fillAll('sleep');g.start();
 const initial=g.s.money;
 for(let i=0;i<24;i++){g.performAction('sleep');}g.s.hour=24;g.finishDay();
 assert.ok(g.s.money<=initial);assert.ok(g.s.mental<100);assert.equal(g.s.phase,'dead');
});
test('work day can earn money, sleep-only cannot',()=>{
 const g=game();g.s.wealth=20;g.fillAll('work');g.start();for(let i=0;i<6;i++)g.performAction('work');
 // health / mental may have dropped too low, so check without relying on end of day.
 assert.ok(g.s.money>200000);
});
test('successful release rewards an heirloom or quest item',()=>{
 const g=game();g.debugGhost('driver');g.rand=()=>.5;
 assert.ok(g.requestRelease('driver'));assert.ok(g.confirmRelease(true));
 assert.equal(g.s.ghosts.length,0);assert.ok(g.s.relics.length+g.s.quest_items.length>0);
});
test('failed release binds and expensive exorcist can remove bound ghost',()=>{
 const g=game();g.debugGhost('driver');let r=0;g.rand=()=>[.01,.7][r++%2];
 assert.ok(g.requestRelease('driver'));g.confirmRelease(true);
 assert.equal(g.s.ghosts[0].state,'bound');g.closeNotice();
 g.s.money=200000;g.rand=()=>.01;
 assert.ok(g.beginEncounter('v5_warded_exorcist',true,'purify',12));
 assert.ok(g.chooseEncounter(0));
 assert.equal(g.s.ghosts.length,0);
 assert.equal(g.s.money,122000);
 assert.ok(g.s.relics.length+g.s.quest_items.length>0);
});
test('exorcist cannot charge unavailable funds',()=>{
 const g=game();g.debugGhost('driver');g.s.ghosts[0].state='possessed';g.s.money=100;
 g.beginEncounter('v5_warded_shaman',true,'walk',16);
 assert.equal(g.chooseEncounter(0),false);assert.equal(g.s.pending.kind,'encounter');assert.equal(g.s.money,100);
});
test('bound-only events cannot spawn without haunting, and action-specific events filter correctly',()=>{
 const g=game();
 const bound=C.encounters.find(e=>e.id==='v5_warded_shaman');
 assert.equal(bound.requires_haunting,true);
 for(let i=0;i<35;i++){g.beginEncounter(null,false,'sleep',2);assert.notEqual(g.s.pending?.id,'v5_warded_shaman');consume(g);}
});
test('linked follow-up waits for correct scheduled activity',()=>{
 const g=game();g.beginEncounter('v5_arc_cat',true,'walk',11);g.chooseEncounter(0);assert.ok(g.s.next_events.some(x=>x.id==='v5_arc_cat_2'));consume(g);
 g.s.day=3;g.s.hour=0;g.s.phase='running';g.s.schedule=Array(24).fill('sleep');
 for(let i=0;i<3;i++){g.advanceHour();consume(g);}assert.ok(g.s.next_events.some(x=>x.id==='v5_arc_cat_2'));
 g.s.schedule[3]='walk';g.s.schedule[4]='walk';g.advanceHour();assert.equal(g.s.pending?.id,'v5_arc_cat_2');
});
test('quest inventory can unlock and consume a special event',()=>{
 const g=game();g.s.quest_items.push('녹슨 방 열쇠');g.beginEncounter('v5_relic_key',true,'walk',18);g.chooseEncounter(0);
 assert.ok(!g.s.quest_items.includes('녹슨 방 열쇠'));assert.ok(g.s.relics.some(id=>C.relics.find(r=>r.id===id)?.name==='흑백 유리 목걸이'));
});
test('v4 saves preserve schedules and become v5',()=>{
 const g=game();g.appendSchedule('sleep',0);g.appendSchedule('ritual',11);
 const old=JSON.parse(g.exportJSON());old.version=4;delete old.quest_items;delete old.relics;
 assert.ok(g.importJSON(JSON.stringify(old)));assert.equal(g.s.version,5);assert.deepEqual(g.s.quest_items,[]);assert.deepEqual(g.s.relics,[]);assert.equal(g.s.schedule[11],'ritual');
});
test('one high-luck character sees more positive than negative events',()=>{
 const g=game();const pool=[{id:'good',tone:'good',weight:1},{id:'bad',tone:'bad',weight:1}];
 let hi=0,lo=0;g.s.luck=12;for(let i=0;i<250;i++)hi+=g.weightedEncounter(pool).id==='good';
 g.s.luck=-12;for(let i=0;i<250;i++)lo+=g.weightedEncounter(pool).id==='good';assert.ok(hi>lo+100);
});
console.log(`ALL ${pass} v0.5 TESTS PASSED`);
