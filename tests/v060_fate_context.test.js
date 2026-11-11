'use strict';
const assert=require('node:assert/strict');
const C=require('../expansion.js');
const {Game}=require('../engine.js');
const e=C.encounters.find(x=>x.id==='v059_fate_paper');
for(const [d,p] of [[0,0],[1,.11],[2,.17],[4,.29],[10,.45]]){const g=new Game({load:false,storage:null});g.s.doom=d;assert(Math.abs(g.fateCostChance(e,d)-p)<1e-9);}
for(const action of C.actions.map(x=>x.id)){const g=new Game({load:false,storage:null});g.s.doom=4;assert(!g.fateAtmosphere(3,action).includes('눈앞의 사람은'));}
const cat=C.encounters.find(x=>x.requires_skill==='meow');assert(cat);const g=new Game({load:false,storage:null});g.s.doom=4;g.s.phase='running';assert.equal(g.fateCostChance(cat,4),0);g.beginEncounter(cat.id,true,'research',8);assert.equal(g.s.scene.body,cat.body);
console.log('PASS v0.5.10 fate chance and context');
