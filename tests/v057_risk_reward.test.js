'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const C = require('../expansion.js');
const {Game} = require('../engine.js');
let passed=0;const test=(name,fn)=>{fn();passed++;console.log('PASS',name)};
const game=()=>new Game({load:false,storage:null});
const event=id=>C.encounters.find(x=>x.id===id);

test('catalog counts, unique IDs and no gallery',()=>{
 assert.equal(C.skills.length,77);assert.equal(C.ghosts.length,36);assert.equal(C.relics.length,8);assert.equal(C.encounters.length,170);
 for(const list of [C.skills,C.ghosts,C.relics,C.encounters])assert.equal(new Set(list.map(x=>x.id)).size,list.length);
 assert(!fs.readFileSync(path.join(__dirname,'../index.html'),'utf8').includes('gallery.html'));
});
test('base hourly sources are reduced relative to v056',()=>{
 const g=game();g.performAction('sleep');assert.equal(g.s.health,100);assert.equal(g.s.mental,100);
 const low=game();low.s.health=40;low.s.mental=40;low.performAction('sleep');assert.equal(low.s.health,43);assert.equal(low.s.mental,41);
 const rest=game();rest.s.mental=25;rest.s.spirit=13;rest.performAction('rest');assert.equal(rest.s.mental,31);assert.equal(rest.s.spirit,13);
 const walk=game();walk.s.mental=40;walk.s.spirit=12;walk.rand=()=>.99;walk.performAction('walk');assert.equal(walk.s.mental,43);assert.equal(walk.s.spirit,11);
 const work=game();work.s.money=0;work.rand=()=>0;work.performAction('work');assert.equal(work.s.money,5200);
 const meal=game();meal.s.health=20;meal.s.mental=20;meal.performAction('meal');assert.equal(meal.s.health,23);assert.equal(meal.s.mental,21);
});
test('purification is expensive with strict stacking cap; each bonus is reduced',()=>{
 const g=game();g.s.spirit=60;g.s.health=60;g.s.mental=60;g.performAction('purify');assert.equal(g.s.money,183000);assert.equal(g.s.spirit,56);assert.equal(g.s.mental,57);
 for(const item of [...C.skills,...C.ghosts,...C.relics].filter(x=>x.bonus?.purify_extra))assert(item.bonus.purify_extra<=5);
 const strong=game();strong.s.spirit=60;for(const x of C.skills.filter(x=>x.bonus?.purify_extra))strong.s.owned_skills.push(x.id);
 for(const x of C.ghosts.filter(x=>x.bonus?.purify_extra))strong.s.ghosts.push({id:x.id,state:'active'});
 for(const x of C.relics.filter(x=>x.bonus?.purify_extra))strong.s.relics.push(x.id);
 strong.performAction('purify');assert.equal(strong.s.spirit,50);
 const poor=game();poor.s.money=0;poor.s.spirit=50;poor.performAction('purify');assert.equal(poor.s.spirit,50);
});
test('high spirit permits new decisions with guarded costs',()=>{
 const p=event('phone'),option=p.options.find(x=>x.minimum_spirit===30);
 assert(option);const g=game();assert(g.beginEncounter('phone',true,'research',13));const idx=p.options.indexOf(option);
 assert(!g.chooseEncounter(idx));assert.equal(g.s.pending.id,'phone');
 g.s.spirit=40;assert(g.chooseEncounter(idx));assert.equal(g.s.spirit,30);assert.equal(g.s.clues,2);
});
test('spirit-only events have thresholds and actual choices',()=>{
 for(const [id,min] of [['v057_spirit_ledger',30],['v057_spirit_bell',45],['v057_spirit_toll',60]]){
  const e=event(id);assert.equal(e.min_spirit,min);assert.equal(e.spirit_event,true);
  assert(e.options.some(x=>x.minimum_spirit===min));
 }
 const g=game();g.s.spirit=59;g.s.day=6;g.s.ghostless_check_day=6;
 for(let i=0;i<90;i++) {if(g.s.pending)g.s.pending=null;g.beginEncounter(null,false,'work',16);assert.notEqual(g.s.pending?.id,'v057_spirit_toll');}
});
test('ghostless lethal encounters have safe paid, spirit and dangerous routes',()=>{
 const ids=['v057_unanswered_door','v057_unclaimed_name','v057_empty_room'];
 for(const id of ids){const e=event(id);assert(e.system_event&&e.requires_no_ghost);assert(e.options.some(o=>o.minimum_money));assert(e.options.some(o=>o.minimum_spirit));assert(e.options.some(o=>o.bad_fatal));}
 const g=game();g.s.day=7;g.s.hour=11;g.s.phase='running';g.s.schedule.fill('rest');g.s.mental=80;g.rand=()=>0;
 assert(g.advanceHour());assert.equal(g.s.pending.id,'v057_unanswered_door');assert.equal(g.s.ghostless_check_day,7);
});
test('ghostless failure can actually kill, payment avoids death',()=>{
 const g=game();g.s.day=7;g.s.phase='running';g.s.schedule.fill('rest');g.s.spirit=0;
 assert(g.beginEncounter('v057_unanswered_door',true,'rest',12));g.rand=()=>.99;
 assert(g.chooseEncounter(2));assert.equal(g.s.phase,'dead');assert.match(g.s.death_reason,/유령/);
 const saved=game();saved.s.day=7;saved.s.phase='running';saved.s.schedule.fill('rest');saved.s.money=80000;
 saved.beginEncounter('v057_unanswered_door',true,'rest',12);assert(saved.chooseEncounter(0));assert.equal(saved.s.money,35000);assert.equal(saved.s.phase,'running');
});
test('ghost ownership suppresses ghostless forced threat',()=>{
 const g=game();g.s.day=18;g.s.hour=10;g.s.phase='running';g.s.schedule.fill('rest');g.debugGhost('driver');g.rand=()=>0;
 g.advanceHour();assert(!g.s.pending?.id?.startsWith('v057_'));
});
test('spirit resonance requires a companion and adequate exposure',()=>{
 const base=game();base.s.day=2;base.s.phase='running';base.s.hour=24;base.s.sleep_today=8;base.s.spirit=40;base.s.mental=80;base.s.schedule.fill('rest');base.rand=()=>.99;base.finishDay();assert(!base.s.logs.some(x=>x.includes('유령과의 공명')));
 const g=game();g.s.day=2;g.s.phase='running';g.s.hour=24;g.s.sleep_today=8;g.s.spirit=40;g.s.mental=80;g.s.schedule.fill('rest');g.debugGhost('driver');g.rand=()=>.99;g.finishDay();assert(g.s.logs.some(x=>x.includes('유령과의 공명')));
});
test('all non-meow items have five or fewer individual effects',()=>{
 const count=x=>Object.keys(x.gain||{}).length+Object.keys(x.daily||{}).length+Object.keys(x.bonus||{}).length+Object.keys(x.delay||{}).length+Object.keys(x.special?.on_work||{}).length+Object.keys(x.special?.on_meal||{}).length+Object.keys(x.special?.on_research_failure||{}).length+(x.special?.conditional_daily||[]).reduce((n,r)=>n+Object.keys(r.fx||{}).length,0)+(x.doom_gain?1:0);
 const all=[...C.skills,...C.ghosts,...C.relics];
 for(const x of all)if(x.id!=='meow')assert(count(x)<=5,`${x.id} has ${count(x)} effects`);
 for(const id of ['v5_gh_06','v5_gh_26','v5_gh_27','v5_sk_45','v5_sk_51'])assert(count(all.find(x=>x.id===id))<=4);
 assert.equal(C.skills.find(x=>x.id==='meow').desc,'야옹야옹');
});
test('existing saves migrate without new counter fields',()=>{
 const g=game();const st=JSON.parse(g.exportJSON());delete st.ghostless_check_day;delete st.spirit_benefits_day;
 assert(g.importJSON(JSON.stringify(st),false));assert.equal(g.s.ghostless_check_day,0);assert.equal(g.s.spirit_benefits_day,0);
});

// v0.5.7 verification: two spirits can now meaningfully offset the cost of exposure.
test('high-spirit companion resonance scales but is capped at 20',()=>{
 const g=game();g.s.phase='running';g.s.day=3;g.s.hour=24;g.s.sleep_today=8;g.s.schedule.fill('rest');g.s.spirit=80;g.s.mental=50;g.s.money=200000;
 g.debugGhost('driver');g.debugGhost('nurse');g.rand=()=>.99;
 g.finishDay();
 const hit=g.s.logs.find(x=>x.includes('유령과의 공명'));
 assert(hit && hit.includes('정신력 +17'),hit);
 const none=game();none.s.phase='running';none.s.day=3;none.s.hour=24;none.s.sleep_today=8;none.s.schedule.fill('rest');none.s.spirit=80;none.s.mental=50;none.rand=()=>.99;
 none.finishDay();assert(!none.s.logs.some(x=>x.includes('유령과의 공명')));
});

console.log(`ALL ${passed} v0.5.7 TESTS PASSED`);
