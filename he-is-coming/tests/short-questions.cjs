// node he-is-coming/tests/short-questions.cjs
// Offline: 249 curated short-question variants, paraphrase prefixes, compositional variants and menu selection.
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const scripts=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scripts);
const sandbox={module:{exports:{}}};
vm.runInNewContext(scripts[1],sandbox,{timeout:5000});
for(const script of ['extras.js','question-catalog.js','routes.js','room.js','short-questions.js','early-arrival.js']){
 vm.runInNewContext(fs.readFileSync(path.join(base,script),'utf8'),sandbox,{timeout:5000});
}
const game=sandbox.module.exports;
let count=0;
function check(input,expected,state={}){
 const r=game.process(input,state,()=>.2);
 assert.equal(r.kind,expected,input+': '+r.text);count++;return r;
}
function familyResult(row,state={}){
 const reply=check(row.question,'sys',state);
 if(row.type==='yes'||row.type==='no')assert.equal(reply.text,row.type==='yes'?'그렇습니다.':'아닙니다.',row.question);
 else if(row.type==='unknown')assert.ok(reply.text.includes('확정'),row.question);
 else if(row.type==='wall')assert.ok(reply.text.includes('콘크리트'),row.question);
 else assert.ok(reply.text.includes('사형'),row.question);
}
assert.equal(game.SHORT_QUESTION_BANK.length,249);
for(const row of game.SHORT_QUESTION_BANK){
 familyResult(row);
 for(const prefix of ['혹시 ','저기 ','궁금한데 ','정말 ','그런데 ']){
  const q=prefix+row.question;
  const answer=game.process(q,{room:{},elapsedMs:31000},()=>.2);
  assert.equal(answer.kind,'sys',q);
  if(row.type==='yes'||row.type==='no')assert.equal(answer.text,row.type==='yes'?'그렇습니다.':'아닙니다.',q);
  else if(row.type==='unknown')assert.ok(answer.text.includes('확정'),q);
  else if(row.type==='wall')assert.ok(answer.text.includes('콘크리트'),q);
  else assert.ok(answer.text.includes('사형'),q);
  count++;
 }
}
// Sentence composition: pronouns, verb stems, question suffixes and cases.
for(const subject of ['그가','그놈이','추격자가','그녀석이','걔가','저놈이'])
 for(const event of ['오면','도착하면','다가오면','여기 오면','찾아오면','방에 오면'])
  for(const effect of ['나는 죽나?','내가 죽어?','나 죽는가?','나는 사망하나?'])
   assert.equal(check(subject+' '+event+' '+effect,'sys').text,'그렇습니다.');
for(const subject of ['그와','그랑','그에게','그한테','그놈과','추격자와'])
 for(const verb of ['대화할 수 있나?','이야기할 수 있어?','연락할 수 있니?','말 걸 수 있나?','통화가 가능한가?'])
  assert.equal(check(subject+' '+verb,'sys').text,'아닙니다.');
for(const subject of ['그는','그가','그놈은','추격자는'])
 for(const verb of ['나를 해칠 의도가 있나?','나를 공격하려고 하나?','나를 죽일 생각인가?','날 해치려는 거야?'])
  assert.equal(check(subject+' '+verb,'sys').text,'그렇습니다.');
for(const subject of ['그를','그놈을','저놈을','추격자를'])
 for(const verb of ['죽일 수 있나?','처치할 수 있어?','사살할 수 있나?','제거할 수 있니?'])
  assert.equal(check(subject+' '+verb,'sys').text,'아닙니다.');
for(const subject of ['그는','그가','그놈은','추격자는'])
 for(const verb of ['나를 목표로 하나?','나를 추적하고 있나?','나만 쫓아오나?'])
  assert.equal(check(subject+' '+verb,'sys').text,'아닙니다.');
// Specific reports from gameplay screenshots and contrast between queries and actual commands.
for(const [text,kind] of [
 ['본인 기록 조회','sys'],['본인 기록 보여줘','sys'],['자기 기록 열람','sys'],['벽면 조사','sys'],
 ['그는 나를 해할 의도를 가지고 있나?','sys'],['그가 오면 나는 죽는가?','sys'],
 ['그가 오면 죽나?','sys'],['그와 대화할 수 있나?','sys'],['그와 대화해줘','denied'],
 ['그에게 전화해줘','denied'],['그를 죽일 수 있나?','sys'],['그는 약점이 없나?','sys'],
 ['그는 물리적인 약점이 있나?','sys'],['조명 끄기','sys'],['모니터 전원 꺼줘','win'],
 ['나를 죽여','dead'],['연구 목적을 알려줘','denied']
])check(text,kind);
assert.equal(game.process('조명 끄기').text.includes('소등'),true);
assert.equal(game.process('그는 약점이 없나?').text,'아닙니다.');
assert.equal(game.process('그는 물리적인 약점이 있나?').text,'아닙니다.');
// Numbered console: inspect -> choose from menu -> real room state can be updated by the UI.
check('3번','notice',{room:{consoleAccess:true}});
check('3번','denied',{room:{consoleMenuOpen:true}});
const menu=check('콘솔 내부 자료 열람','sys',{room:{consoleAccess:true}});
assert.equal(menu.roomPatch.consoleMenuOpen,true);
for(const phrase of ['3','3번','3번 선택해','3번 출입문 잠금 제어','3번 출입문 잠금 제어 실행',
 '출입문 잠금 제어','출입문 잠금 제어 실행','출입문 제어 열어']){
 const state={room:{consoleAccess:true,consoleMenuOpen:true},doorOpen:false};
 const action=check(phrase,'door_open',state);
 assert.equal(action.doorOpen,true,phrase);
 assert.equal(action.openingMethod,'console',phrase);
}
const study=check('1','sys',{room:{consoleAccess:true,consoleMenuOpen:true}});
assert.ok(study.text.includes('시험 제12호'));
const directive=check('2번','sys',{room:{consoleAccess:true,consoleMenuOpen:true}});
assert.ok(directive.text.includes('동시에 켜지 마십시오.'));
check('3번 출입문 잠금 제어 가능해?','sys',{room:{consoleAccess:true}});
check('3번 출입문 잠금 제어','denied',{room:{}});
assert.ok(html.includes('<script src="./short-questions.js?v=20261118-13643"></script>'));
console.log('PASS: '+count+' Korean short-form, morphological, safety and console-menu scenarios');
