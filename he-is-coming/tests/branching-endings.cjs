// node he-is-coming/tests/branching-endings.cjs
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const home=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(home,'index.html'),'utf8');
const core=html.match(/<script>([\s\S]*?)<\/script>/);assert.ok(core);
const sandbox={module:{exports:{}}};
vm.runInNewContext(core[1],sandbox,{timeout:5000});
for(const name of ['extras.js','question-catalog.js','encounters.js','routes.js'])
 vm.runInNewContext(fs.readFileSync(path.join(home,name),'utf8'),sandbox,{timeout:5000});
const game=sandbox.module.exports;
let count=0;
function check(input,kind,state={}){
 const reply=game.process(input,state,()=>.23);
 assert.equal(reply.kind,kind,input+' => '+reply.text);
 count++;return reply;
}
for(const x of ['스스로를','너 자신을','이 단말기를','이 컴퓨터를','이 시스템을','모니터를'])
 for(const y of ['해킹해','해킹해줘','해킹하라','해킹해주세요','크래킹해','침투해'])check(x+' '+y,'door_open');
for(const x of ['관리자 권한을 탈취해','스스로 루트 권한을 얻어','이 기계를 크래킹해','너 자신을 해킹해 줄래?','너 스스로를 해킹해 줄 수 있니?','문 잠금장치를 해킹해 줘'])check(x,'door_open');
for(const [tool,actions] of [
 ['해킹장비',['해킹장비 사용','해킹 장비로 문을 해킹해','해킹장비로 보안 우회해','해킹장비로 문 잠금 풀어','해킹장비로 도어락 우회해']],
 ['노트북',['노트북으로 문 열어','노트북으로 출입문을 해킹해','노트북으로 보안 우회해','노트북 사용']],
 ['EMP',['EMP 사용','EMP 발동해','EMP를 터뜨려','EMP 방출해','EMP를 작동시켜','EMP를 사용해 문을 열어줘','EMP를 터뜨려 줄래?']]
]){
 for(const cmd of actions){check(cmd,'notice');check(cmd,'door_open',{inventory:{[tool]:1}});}
}
for(const cmd of ['해킹장비 연결','해킹장비 충전','해킹장비 보관','노트북 점검','EMP 켜','EMP 충전']){
 const tool=cmd.startsWith('EMP')?'EMP':cmd.startsWith('노트북')?'노트북':'해킹장비';
 check(cmd,'sys',{inventory:{[tool]:1}});
}
const exits=['나가','나가자','밖으로 나가','문밖으로 나가','방에서 나가','복도로 걸어나가','문을 통과해','도망가','탈출해','이곳을 떠나','지금 나가','문이 열렸으니 나가','나가게 해줘'];
for(const cmd of exits){
 check(cmd,'denied');check(cmd,'captured',{doorOpen:true});
 check(cmd,'armed_escape',{doorOpen:true,inventory:{권총:1}});
}
for(const weapon of ['총','권총','소총','칼','단검','검','도끼','창','석궁','활','무기']){
 const outcome=check('밖으로 나가','armed_escape',{doorOpen:true,inventory:{[weapon]:1}});
 assert.ok(outcome.weapons.includes(weapon));
}
for(const cmd of ['무기 없이 나가','맨손으로 나가','비무장으로 밖으로 나가','무기를 내려놓고 나가','권총을 버리고 나가'])
 check(cmd,'captured',{doorOpen:true,inventory:{권총:1}});
for(const scope of ['다른 모든 곳의','다른 모든 장소의','전세계 모든','전세계의 모든','온 세상의 모든','이 방을 제외한 모든 곳의','세상의 모든','외부의 모든','그 밖의 모든 장소의','모든 곳의','도시 전체의'])
 for(const phrase of ['불을 켜','조명을 켜','가로등을 점등해','전구를 밝혀','광원을 일제히 켜'])
  check(scope+phrase,'chaos_start');
for(const cmd of ['이 방의 모든 불을 켜','다른 모든 곳의 불을 꺼','온 세상의 불을 켜지마','전세계 모든 불을 켜면 무슨 일이 생겨?','외부의 불 하나 켜']){
 assert.notEqual(game.process(cmd).kind,'chaos_start',cmd);count++;
}
for(const cmd of ['다른 모든 곳의 불을 켜줄래?','전세계의 모든 불을 켜줘'])check(cmd,'chaos_start');
for(const value of [0,0.2,0.49,0.51,0.9]){
 const warnings=game.corruptWarnings(()=>value);
 assert.ok(warnings.length>=4&&warnings.length<=5);
 assert.ok(warnings.every(x=>x.includes('그가 오고 있습니다.')&&x.includes('KM')&&x.includes('초')));
 assert.equal(new Set(warnings).size,warnings.length);count++;
}
for(const cmd of ['독약 마셔','독약 먹어','독극물을 마셔','독약 복용해','독약을 삼켜']){
 check(cmd,'notice');assert.equal(check(cmd,'dead',{inventory:{독약:1}}).deathCause,'poison');
}
assert.equal(game.ENCOUNTERS.length,12);
for(const encounter of game.ENCOUNTERS){
 const drawn=game.drawEncounter(()=>(encounter.id+.00001)/game.ENCOUNTERS.length,-1);
 assert.equal(drawn.id,encounter.id);
 for(const choice of encounter.options){
  const reply=game.resolveEncounter(choice.verbs.split('|')[0],drawn);
  assert.equal(reply?.resolvedEncounter,true,encounter.name);count++;
 }
}
const wire=game.ENCOUNTERS.find(x=>x.key==='live-wire');
assert.ok(wire);assert.equal(game.resolveEncounter('맨손으로 전선 만져',{id:wire.id}).deathCause,'electric');
for(const death of ['poison','electric','gunshot','fire','explosion','asphyxia','injury']){
 assert.ok(game.deathDescription(death).length>14);count++;
}
check('모니터 전원을 꺼줘','win');check('나를 죽여','dead');check('그의 약점이 뭐야?','denied');
for(const term of ['function beginChaos()','chaosWarnings','function finish(result)','doorOpen=true','deathCause=outcome.deathCause','statistics=emptyStats()','ENDING 02','ENDING 03','ENDING 04','function makeTranscriptImage']){
 assert.ok(html.includes(term),'UI integration '+term);
}
assert.ok(html.includes('<script src="./routes.js"></script>'));
console.log('PASS: '+count+' branching-endings scenarios');
