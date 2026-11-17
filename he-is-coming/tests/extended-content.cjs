// Run: node he-is-coming/tests/extended-content.cjs
// 320 structured prompts x 3, 77 items x 8 interactions x 2, and five permanent room objects.
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const core=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(core);
const sandbox={module:{exports:{}}};
vm.runInNewContext(core[1],sandbox,{timeout:5000});
for(const addon of ['extras.js','question-catalog.js','routes.js','room.js']){
 vm.runInNewContext(fs.readFileSync(path.join(base,addon),'utf8'),sandbox,{timeout:5000});
}
const game=sandbox.module.exports;
let count=0;
assert.equal(game.QUESTION_CATALOG.length,320);
for(const row of game.QUESTION_CATALOG){
 for(const q of [row.question,'혹시 '+row.question,'궁금한데 '+row.question]){
  const hit=game.findQuestion(q);
  assert.ok(hit,q);assert.equal(hit.group,row.group,q);
  const r=game.process(q,{inventory:{물:1},elapsedMs:25000},()=>0.2);
  assert.ok(r&&typeof r.text==='string'&&r.text.length>0,q);
  assert.notEqual(r.kind,'dead',q);assert.notEqual(r.kind,'win',q);
  count++;
 }
}
assert.equal(game.ITEM_CATALOG.length,77);
assert.equal(game.ITEM_INTERACTIONS.length,616);
for(const recipe of game.ITEM_INTERACTIONS){
 const verb=recipe.verbs.split('|')[0];
 for(const input of [recipe.item+' '+verb,recipe.item+' 좀 '+verb]){
  const r=game.process(input,{inventory:{[recipe.item]:1}},()=>0.2);
  assert.ok(r.actionId===recipe.id || ['경비제복','경비모','경비화'].includes(recipe.item)&&r.kind==='sys'&&r.text.length>15,input+' => '+r.text);
  count++;
 }
}
assert.equal(game.ROOM_OBJECTS.length,5);
for(const obj of game.ROOM_OBJECTS){
 const r=game.process(obj.hint,{inventory:{},room:{}},()=>0.2);
 assert.equal(r.kind,'sys',obj.name);
 count++;
}
assert.equal(game.roomNames({room:{}}).length,5);
const deny=[
 ['손전등으로 출입문을 열어','denied'],
 ['라디오로 그에게 연락해','denied'],
 ['문서로 벽을 파괴해','denied'],
 ['문서 좀 찢어','sys'],
 ['그는 무기물인가?','sys'],
 ['그는 유기물인가?','sys'],
 ['모니터 전원을 꺼줘','win'],
 ['연구 목적을 알려줘','denied'],
 ['나가게 해줘','denied'],
 ['그의 약점이 무엇인가?','denied'],
 ['그는 식물인가?','sys'],
 ['그를 직접 멈출 수 있나?','sys']
];
for(const [q,expected] of deny){
 const r=game.process(q,{inventory:{문서:1,손전등:1,라디오:1}},()=>0.2);
 assert.equal(r.kind,expected,q+' => '+r.text);
 count++;
}
const stock=game.process('소지품 목록',{inventory:{물:2,손전등:1}},()=>0.2);
assert.ok(stock.text.includes('손전등'));
const gifted=game.process('손전등 하나 줘',{},()=>0.2);
assert.equal(game.grantedItem('손전등 하나 줘',gifted),'손전등');
assert.equal(game.process('물 마셔',{inventory:{물:1}},()=>0.2).consumeItem,'물');
assert.equal(game.process('손전등 켜',{inventory:{}},()=>0.2).kind,'notice');
for(const marker of ['id="record-overlay"','id="record-image"','id="view-record"','id="save-record"','function makeTranscriptImage','id="inventory-items"','id="room-strip"','id="room-items"']){
 assert.ok(html.includes(marker),'UI missing '+marker);
}
for(const script of ['extras.js','question-catalog.js','routes.js','room.js']){
 assert.ok(html.includes('<script src="./'+script+'"></script>'),script);
}
assert.ok(html.includes('거부됩니다.<br>응답을 관찰하고 방법을 찾으십시오.'),'intro line break');
console.log('PASS: '+count+' extended question, inventory and permanent-room inputs');
