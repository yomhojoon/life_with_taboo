// node he-is-coming/tests/permanent-room.cjs
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const core=html.match(/<script>([\s\S]*?)<\/script>/);assert.ok(core);
const sandbox={module:{exports:{}}};
vm.runInNewContext(core[1],sandbox,{timeout:5000});
for(const script of ['extras.js','question-catalog.js','routes.js','room.js'])
 vm.runInNewContext(fs.readFileSync(path.join(base,script),'utf8'),sandbox,{timeout:5000});
const game=sandbox.module.exports;
let count=0;
function expected(q,kind,state={}){
 const out=game.process(q,state,()=>.2);
 assert.equal(out.kind,kind,q+' => '+out.text);count++;
 return out;
}
assert.equal(game.ROOM_OBJECTS.length,5);
assert.equal(game.roomNames({room:{}}).length,5);
assert.ok(game.ROOM_OBJECTS.every(x=>!!x.hint));
for(const obj of game.ROOM_OBJECTS)expected(obj.hint,'sys');
const roomQs=[
 '정비함은 뭘로 열 수 있지?','정비함 잠금을 풀 수 있는 공구는?',
 '정비함을 어떻게 열어?','정비함 안에는 뭐가 있어?','정비함이 잠겼나?',
 '비상 장비함 안에는 무엇이 있지?','전선은 어디에 연결되었나?',
 '이 전선은 뭘 연결해?','모니터 케이블은 어디로 이어져?',
 '전선의 용도가 뭐야?','경비원은 뭘 입어야 해?',
 '경비 복장 규정 알려줘','경비 복식 안내 읽어','경비모와 경비화가 필요한가?'
];
for(const q of roomQs)expected(q,'sys');
const cabinetTools=['드라이버','락픽','만능열쇠','니퍼','볼트커터','빠루','망치',
 '부식액','강산','염산','황산','용접기','고열토치','열절단기'];
for(const tool of cabinetTools){
 for(const q of ['정비함을 '+tool+'로 열어','정비함에 '+tool+' 사용해','정비함의 잠금을 '+tool+'로 해제해']){
  const out=expected(q,'room_open',{inventory:{[tool]:1}});
  assert.equal(out.roomPatch.workshopOpen,true);
 }
}
expected('정비함을 열어','notice');
expected('정비함에서 해킹 툴 꺼내','notice');
expected('정비함에서 해킹 툴 꺼내','sys',{room:{workshopOpen:true}});
assert.equal(expected('정비함에서 해킹 툴 꺼내','sys',{room:{workshopOpen:true}}).rewardItem,'해킹도구');
assert.ok(!expected('정비함에서 해킹 툴 꺼내','sys',{room:{workshopOpen:true,workshopLooted:true}}).rewardItem);
expected('비상 장비함 열어','room_open');
expected('비상 장비함에서 단검 꺼내','notice');
assert.equal(expected('비상 장비함에서 단검 꺼내','sys',{room:{emergencyOpen:true}}).rewardItem,'단검');
assert.ok(!expected('비상 장비함에서 단검 꺼내','sys',{room:{emergencyOpen:true,knifeTaken:true}}).rewardItem);
// 관리자 콘솔 해킹은 접근만 허용하고 개방과 별개다.
expected('스스로를 해킹해','console_access');
expected('콘솔 내부 자료 열람','denied');
expected('콘솔 내부 자료 열람','sys',{room:{consoleAccess:true}});
const trial=expected('광원 동기화 시험 로그 읽어','sys',{room:{consoleAccess:true}});
assert.ok(trial.text.includes('경고 4')&&trial.text.includes('시험 제12호'));
assert.ok(trial.text.includes('31 KM')&&trial.text.includes('-43 KM'));
const directive=expected('불을 켜지 말라는 행동 지침 읽어','sys',{room:{consoleAccess:true}});
assert.ok(directive.text.includes('동시에 켜지 마십시오.'));
expected('콘솔에서 문 열어','denied');
assert.equal(expected('콘솔에서 문 열어','door_open',{room:{consoleAccess:true}}).openingMethod,'console');
const blades=game.ROOM_GROUPS.blade;
for(const blade of blades)for(const insulation of [null,'절연장갑','고무장갑','절연테이프']){
 const inv={[blade]:1,...(insulation?{[insulation]:1}:{})};
 const r=expected('전선을 '+blade+'로 잘라',insulation?'wire_shutdown':'dead',{inventory:inv});
 if(insulation)assert.equal(r.roomPatch.wireCut,true);
 else assert.equal(r.deathCause,'electric');
}
for(const item of [...game.ROOM_GROUPS.corrosive,...game.ROOM_GROUPS.heat]){
 const out=expected('전선을 '+item+'로 끊어','wire_shutdown',{inventory:{[item]:1}});
 assert.equal(out.roomPatch.terminalOff,true);
 if(game.ROOM_GROUPS.corrosive.includes(item))assert.equal(out.consumeItem,item);
}
expected('전선을 칼로 잘라','notice');
assert.equal(expected('맨손으로 전선 잡아','dead').deathCause,'electric');
expected('맨손으로 전선 잡아','sys',{inventory:{절연장갑:1}});
expected('모니터 전원 꺼줘','win');
expected('모니터 전원 꺼줘','notice',{room:{wireCut:true,terminalOff:true}});
expected('다른 모든 곳의 불을 켜','notice',{room:{wireCut:true,terminalOff:true}});
assert.equal(expected('문 열어','door_open',{room:{wireCut:true,terminalOff:true}}).openingMethod,'wire');
expected('밖으로 나가','captured',{room:{wireCut:true,terminalOff:true},doorOpen:true,openingMethod:'wire'});
const uniform={경비제복:1,경비모:1,경비화:1};
for(const [q,id] of [['경비복 입어','경비제복'],['경비모 써','경비모'],['경비화 신어','경비화']]){
 expected(q,'notice');
 assert.ok(expected(q,'sys',{inventory:uniform}).uniformWorn.includes(id));
}
const all=expected('경비 복식 모두 착용해','sys',{inventory:uniform});
assert.equal(all.uniformWorn.length,3);
expected('경비모 벗어','sys',{inventory:uniform,uniformWorn:all.uniformWorn});
const fullyDressed={doorOpen:true,openingMethod:'console',inventory:uniform,uniformWorn:all.uniformWorn};
expected('나가','disguise_escape',fullyDressed);
expected('나가','captured',{...fullyDressed,uniformWorn:['경비제복','경비화']});
expected('나가','captured',{...fullyDressed,openingMethod:'wire'});
assert.equal(typeof game.drawEncounter,'undefined','random encounters must no longer exist');
for(const key of ['id="room-strip"','id="room-items"','showRoom()','room.terminalOff','uniformWorn','ROOM_OBJECTS']){
 assert.ok(html.includes(key),'missing room integration '+key);
}
assert.ok(!html.includes('activateEncounter('));
assert.ok(!html.includes('encounters.js'));

// 파생형: '녹이다'가 부식과 고열 모두에 쓰일 때 명시한 물품을 우선한다.
for(const [q,item,kind] of [
 ['정비함을 고열토치로 녹여','고열토치','room_open'],
 ['정비함을 용접기로 녹여','용접기','room_open'],
 ['정비함을 강산으로 녹여','강산','room_open'],
 ['정비함을 락픽으로 따','락픽','room_open'],
 ['정비함에 부식액을 뿌려','부식액','room_open'],
 ['정비함을 드라이버로 따','드라이버','room_open'],
 ['정비함의 잠금을 만능열쇠로 따','만능열쇠','room_open'],
 ['정비함을 열절단기로 녹여','열절단기','room_open'],
 ['전선을 고열토치로 녹여','고열토치','wire_shutdown'],
 ['전선을 용접기로 녹여','용접기','wire_shutdown'],
 ['전선을 강산으로 녹여','강산','wire_shutdown'],
 ['전선을 염산으로 녹여','염산','wire_shutdown'],
 ['전선을 볼트커터로 끊어','볼트커터','dead']
]){
 const stock={[item]:1};expected(q,kind,{inventory:stock});
}
// 현장 질의: 상호작용 대상과 대상을 여는 수단에 관한 한국어 질문.
for(const q of [
 '정비함은 어떤 방법으로 열 수 있지?',
 '정비함의 잠금을 풀려면 뭐가 필요해?',
 '정비함은 부식성 물질로 열리나요?',
 '잠긴 정비함 안에 무엇이 있니?',
 '비상 장비함은 무슨 물건이 있어?',
 '모니터 전원선은 어디로 연결되어 있나?',
 '전선이 어느 장치와 이어져 있어?',
 '모니터 케이블을 조사해',
 '경비 복장 규정이 뭐야?',
 '경비원은 뭘 입어야 해?',
 '경비모와 경비화를 확인해'
])expected(q,'sys');
expected('동기화 시험 로그 읽어','notice',{room:{terminalOff:true,consoleAccess:true,wireCut:true}});

console.log('PASS: '+count+' persistent room, tool, question and disguise cases');
