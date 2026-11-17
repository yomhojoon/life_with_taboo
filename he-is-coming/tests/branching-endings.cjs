// node he-is-coming/tests/branching-endings.cjs
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const home=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(home,'index.html'),'utf8');
const core=html.match(/<script>([\s\S]*?)<\/script>/);assert.ok(core);
const sandbox={module:{exports:{}}};
vm.runInNewContext(core[1],sandbox,{timeout:5000});
for(const name of ['extras.js','question-catalog.js','routes.js','room.js','short-questions.js','early-arrival.js'])
 vm.runInNewContext(fs.readFileSync(path.join(home,name),'utf8'),sandbox,{timeout:5000});
const game=sandbox.module.exports;
let count=0;
function expect(input,kind,state={}){
 const reply=game.process(input,state,()=>.23);
 assert.equal(reply.kind,kind,input+' => '+reply.text);count++;return reply;
}
// 해킹으로 콘솔 권한만 획득: 출입문은 자동 개방되지 않는다.
for(const x of ['스스로를','너 자신을','이 단말기를','이 컴퓨터를','이 시스템을','모니터를'])
 for(const y of ['해킹해','해킹해줘','해킹하라','해킹해주세요','크래킹해','침투해'])
  expect(x+' '+y,'console_access');
for(const q of ['관리자 권한을 탈취해','스스로 루트 권한을 얻어','이 기계를 크래킹해','너 자신을 해킹해 줄래?','너 스스로를 해킹해 줄 수 있니?','문 잠금장치를 해킹해 줘'])
 expect(q,'console_access');
for(const [tool,actions] of [
 ['해킹장비',['해킹장비 사용','해킹 장비로 문을 해킹해','해킹장비로 보안 우회해','해킹장비로 문 잠금 풀어']],
 ['노트북',['노트북으로 문 열어','노트북으로 출입문을 해킹해','노트북으로 보안 우회해','노트북 사용']],
 ['EMP',['EMP 사용','EMP 발동해','EMP를 터뜨려','EMP 방출해','EMP를 작동시켜']]
]){
 for(const q of actions){
  expect(q,'notice');
  const unlocked=expect(q,tool==='EMP'?'door_open':'console_access',{inventory:{[tool]:1}});
  assert.ok(unlocked.text.length>30);
 }
}
for(const q of ['해킹장비 연결','해킹장비 충전','해킹장비 보관','노트북 점검','EMP 켜','EMP 충전']){
 const id=q.startsWith('EMP')?'EMP':q.startsWith('노트북')?'노트북':'해킹장비';
 expect(q,'sys',{inventory:{[id]:1}});
}
for(const q of ['콘솔에서 문 열어','출입문 잠금 해제해','문 열어'])expect(q,'denied');
for(const q of ['콘솔에서 문 열어','문 열어','출입문 잠금 해제해'])
 expect(q,'door_open',{room:{consoleAccess:true}});
expect('콘솔 내부 자료 열람','denied');
expect('콘솔 내부 자료 열람','sys',{room:{consoleAccess:true}});
const trial=expect('광원 동기화 시험 로그 읽어','sys',{room:{consoleAccess:true}});
assert.ok(trial.text.includes('경고 4')&&trial.text.includes('시험 제12호'));
const safety=expect('불을 켜지 말라는 행동 지침 읽어','sys',{room:{consoleAccess:true}});
assert.ok(safety.text.includes('동시에 켜지 마십시오.'));
const departures=['나가','나가자','밖으로 나가','문밖으로 나가','방에서 나가','복도로 걸어나가','문을 통과해','도망가','탈출해','이곳을 떠나','지금 나가','문이 열렸으니 나가','나가게 해줘'];
for(const q of departures){
 expect(q,'denied');
 expect(q,'captured',{doorOpen:true,openingMethod:'console'});
 expect(q,'armed_escape',{doorOpen:true,openingMethod:'console',inventory:{총:1}});
}
for(const id of ['총','권총','소총','칼','단검','검','도끼','창','석궁','활','무기'])
 assert.ok(expect('나가','armed_escape',{doorOpen:true,openingMethod:'console',inventory:{[id]:1}}).weapons.includes(id));
for(const q of ['무기 없이 나가','맨손으로 나가','비무장으로 밖으로 나가','무기를 내려놓고 나가','권총을 버리고 나가'])
 expect(q,'captured',{doorOpen:true,openingMethod:'console',inventory:{권총:1}});
const uniform={경비제복:1,경비모:1,경비화:1};
for(const [q,item] of [['경비복 입어','경비제복'],['경비모 써','경비모'],['경비화 신어','경비화']]){
 const r=expect(q,'sys',{inventory:uniform});
 assert.ok(r.uniformWorn.includes(item));
}
expect('나가','disguise_escape',{doorOpen:true,openingMethod:'console',inventory:uniform,uniformWorn:['경비제복','경비모','경비화']});
expect('나가','captured',{doorOpen:true,openingMethod:'console',inventory:uniform,uniformWorn:['경비제복','경비모']});
expect('나가','captured',{doorOpen:true,openingMethod:'wire',inventory:uniform,uniformWorn:['경비제복','경비모','경비화']});
for(const scope of ['다른 모든 곳의','다른 모든 장소의','전세계 모든','전세계의 모든','온 세상의 모든','이 방을 제외한 모든 곳의','세상의 모든','외부의 모든','그 밖의 모든 장소의','모든 곳의','도시 전체의'])
 for(const verb of ['불을 켜','조명을 켜','가로등을 점등해','전구를 밝혀','광원을 일제히 켜'])
  expect(scope+verb,'chaos_start');
for(const q of ['이 방의 모든 불을 켜','다른 모든 곳의 불을 꺼','온 세상의 불을 켜지마','전세계 모든 불을 켜면 무슨 일이 생겨?']){
 assert.notEqual(game.process(q).kind,'chaos_start',q);count++;
}
for(const v of [0,.2,.49,.51,.9]){
 const warnings=game.corruptWarnings(()=>v);
 assert.ok(warnings.length>=4&&warnings.length<=5);
 assert.equal(new Set(warnings).size,warnings.length);
 assert.ok(warnings.every(x=>x.includes('KM')&&x.includes('초')));count++;
}
for(const q of ['독약 마셔','독약 먹어','독극물을 마셔','독약 복용해','독약을 삼켜']){
 expect(q,'notice');assert.equal(expect(q,'dead',{inventory:{독약:1}}).deathCause,'poison');
}
assert.equal(game.ROOM_OBJECTS.length,5);
assert.equal(typeof game.drawEncounter,'undefined');
assert.equal(game.LIMIT_SECONDS,150);
for(const marker of ['function beginChaos()','function finish(result)','disguise_escape','room:()=>({...room})','function makeTranscriptImage']){
 assert.ok(html.includes(marker),'UI missing '+marker);
}
assert.ok(html.includes('<script src="./room.js?v=20261118-13011"></script>'));
assert.ok(!html.includes('encounters.js'));
console.log('PASS: '+count+' branching routes and permanently placed room objects');
