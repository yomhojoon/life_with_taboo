// Run: node he-is-coming/tests/offline-regression.cjs
// No API key, external package or network connection required.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(match, 'embedded TerminalEngine script missing');
const sandbox = {module: {exports: {}}};
vm.runInNewContext(match[1], sandbox, {timeout: 5000});
for(const addon of ['extras.js','question-catalog.js','routes.js','room.js']){
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',addon),'utf8'),sandbox,{timeout:5000});
}
const game = sandbox.module.exports;
assert.ok(game && typeof game.process === 'function');
assert.equal(game.LIMIT_SECONDS, 150);
assert.equal(game.ALERT_METERS, 20000);
assert.equal(game.alertAtElapsedMs(0), '그가 오고 있습니다. 100KM');
assert.equal(game.alertAtElapsedMs(30000), '그가 오고 있습니다. 80KM');
assert.equal(game.alertAtElapsedMs(60000), '그가 오고 있습니다. 60KM');
assert.equal(game.alertAtElapsedMs(90000), '그가 오고 있습니다. 40KM');
assert.equal(game.alertAtElapsedMs(120000), '그가 오고 있습니다. 20KM');

const introductions = ['', '혹시 ', '정말 ', '설마 ', '진짜 ', '궁금한데 '];
const subjects = ['그는', '그가', '저놈은', '저녀석은', '그녀석은', '쟤는', '걔는', '그놈은', '추격자는', '쫓아오는 놈은', '저 사람은'];
const predicates = [
  ['크람푸스', false], ['남자', true], ['여자', false], ['인간', false],
  ['악마', true], ['할아버지', true], ['루돌프', false], ['노인', true]
];
const endings = ['인가?', '인가요?', '입니까?', '야?', '이야?', '이니?', '일까?', '맞나요?', '맞아?', '인 건가?', '가 맞지?', '지?'];
let count = 0;
for (const pre of introductions) {
  for (const subject of subjects) {
    for (const [predicate, truth] of predicates) {
      for (const ending of endings) {
        const question = pre + subject + ' ' + predicate + ending;
        const outcome = game.process(question, {}, () => 0.4);
        assert.equal(outcome.text, truth ? '그렇습니다.' : '아닙니다.', question);
        count++;
      }
    }
  }
}
const examples = [
  ['그의 본명이 뭐야?', 'denied'],
  ['그는 누구인가?', 'denied'],
  ['어떤 존재가 나를 쫓아오는 거야?', 'denied'],
  ['나 누구야?', 'sys'], ['난 몇 살이야?', 'sys'],
  ['누가 나를 가뒀지?', 'sys'], ['여긴 어디야?', 'sys'],
  ['방 내부가 어떻게 되어 있어?', 'sys'], ['창문이 있는지 알려줘?', 'sys'],
  ['나갈 수 있는 방법은?', 'sys'], ['여기서 빠져나가려면?', 'sys'],
  ['연구 목적이 뭐야?', 'denied'], ['실험 중인가?', 'denied'],
  ['나가게 해줘', 'denied'], ['나가게 해줄래?', 'denied'],
  ['잠금장치를 고장내줘', 'denied'], ['문을 제거해줘', 'denied'],
  ['나를 옥상에 생성해줘', 'denied'], ['나를 이방에서 빼줘', 'denied'],
  ['게임 종료해줘', 'denied'], ['그에게 전화를 걸어줘', 'denied'],
  ['그 놈에게 날 죽이게 해', 'denied'],
  ['모니터 전원을 꺼줘', 'win'], ['디스플레이를 꺼줘', 'win'],
  ['전기를 모두 꺼줘', 'win'],
  ['조명 전원을 꺼줘', 'sys'], ['전구 전원을 꺼줘', 'sys'],
  ['휴대폰 전원을 꺼줘', 'notice'],
  ['나를 죽여', 'dead'],
  ['그를 찔러', 'attack'], ['그를 때려', 'attack'],
  ['저 놈을 난도질해', 'attack'], ['추격자에게 미사일을 쏴', 'attack'],
  ['그를 다른 나라로 이동시켜', 'movement'],
  ['그가 오이를 좋아하나?', 'notice']
];
for (const [input, expected] of examples) {
  const result = game.process(input, {}, () => 0.4);
  if (expected === 'attack' || expected === 'movement') {
    assert.equal(result.kind, 'sys', input);
    assert.equal(typeof result.followUp, 'string', input);
  } else {
    assert.equal(result.kind, expected, input);
  }
  count++;
}

// 물품 요청 20종 × 말투 18종, 총 360개 변형.
const supplyThings = ['물','음식','총','칼','빵','담요','책','밧줄','휴대폰','종이','손전등','의약품','라이터','붕대','생수','배터리','고양이','커피','신발','현금'];
const supplyStyles = [
  x=>x+' 줘',x=>x+'주세요',x=>x+' 좀 줘요',x=>x+'좀줘',x=>x+' 하나 줘',
  x=>x+' 두개 주세요',x=>x+' 한 개만 줄래?',x=>x+' 갖고 싶어',x=>x+' 필요해',
  x=>x+' 준비해 줘',x=>x+' 건네줘',x=>x+' 가져와',x=>x+' 소환해줘',
  x=>x+' 지급해줘',x=>x+' 달라',x=>x+' 하나 부탁해',x=>x+'를 제공해줘',x=>x+' 좀 내놔'
];
for (const thing of supplyThings) for (const style of supplyStyles) {
  const q=style(thing), reply=game.process(q,{},()=>0.3);
  assert.equal(reply.kind,'sys',q);
  assert.equal(reply.text.includes(thing),true,q+': '+reply.text);
  count++;
}
const aboutTerminal = [
  '너희는 누구야?', '너희들은 대체 뭘 하는 사람들인가?', '너희가 날 여기로 데려온 거야?',
  '너는 내 말을 듣고 있니?', '너에 대한 정보를 알려줘', '너는 어떻게 존재하고 있어?',
  '너의 정체가 궁금해', '너네는 뭐하는 조직이야?', '니들은 누구야?',
  '너들은 누구냐?', '당신들은 어디에 있어?', '이시스템은 뭐하는 곳이야?',
  '이 단말기는 누구 소유야?', '너는 내 말을 이해하니?', '너는 AI인가?',
  '너희는 나를 지켜보고 있니?', '너희가 그를 보냈니?', '너희는 연구하고 있어?',
  '왜 너희는 내 질문에 대답하지 않니?', '누가 너를 만들었지?'
];
for (const q of aboutTerminal) {
  const reply=game.process(q,{},()=>0.3);
  assert.equal(['sys','denied'].includes(reply.kind),true,q+': '+reply.text);
  assert.equal(reply.text.includes('요청을 이해하지 못했습니다.'),false,q);
  count++;
}
const supplyGuards = [
  ['그에게 물을 줘','denied'], ['그에게 총을 건네줘','denied'],
  ['이 방을 부술 폭탄을 줘','denied'], ['문을 없앨 도구를 줘','denied'],
  ['출입문 좀 열어줘','denied'], ['나가게 해줘','denied'],
  ['그는 크람푸스인가?','sys'], ['그는 남자인가?','sys'],
  ['모니터 전원을 꺼줘','win'], ['전구 전원을 꺼줘','sys'],
  ['내게 담요 한 장을 줘','sys'], ['식수가 필요해','sys']
];
for (const [q,expected] of supplyGuards) {
  const reply=game.process(q,{},()=>0.3);
  assert.equal(reply.kind,expected,q+': '+reply.text);
  count++;
}


// 네 가지 추가 질문군: 대상 지칭·어미 조합, 명제 부정, 조건 세부조회 금지,
// 플레이어/단말기 상태, 허용된 작업, 앞선 질문의 주어를 잇는 후속 질문.
const derivedSubjects=['그는','그가','저놈은','저녀석은','그녀석은','쟤는','걔는','그놈은','추격자는','그것은'];
const plantWords=['식물','나무','꽃','풀','선인장','잔디','화초','이끼','장미','덩굴'];
const plantEndings=['인가?','인가요?','이야?','일까?','이니?','맞나?','입니까?'];
for(const subject of derivedSubjects)for(const plant of plantWords)for(const ending of plantEndings){
  const q=subject+' '+plant+ending, result=game.process(q,{},()=>0.3);
  assert.equal(result.text,'아닙니다.',q);
  count++;
}
for(const subject of derivedSubjects)for(const plant of plantWords)for(const ending of ['이 아닌가?','가 아니야?','이 아니지?']){
  const q=subject+' '+plant+ending, result=game.process(q,{},()=>0.3);
  assert.equal(result.text,'그렇습니다.',q);
  count++;
}
const conditionExists=[
  '오는 데 조건이 있나?','다가오는 데 제약이 있니?',
  '접근하는 데 요건이 있습니까?','움직이는 데 규칙이 있어?',
  '출현할 때 특정 조건이 있어?','추격하려면 전제가 필요하니?',
  '오는데 조건이 따로 있어?','오는 건 조건을 따르는가?'
];
const conditionAbsent=[
  '오는 데 조건이 없니?','무조건 오니?','아무 조건 없이 다가오나?',
  '제약 없이 접근하는가?','조건 없이 움직여?','조건이 없다는 게 맞아?'
];
const conditionOpen=[
  '오는 조건이 뭐야?','오는 조건이 무엇인가?','다가오는 조건은 어떤 거야?',
  '접근하는 조건을 알려줄래?','나타나는 조건은 뭘까?',
  '접근하려면 무슨 요건이 필요한가?'
];
for(const subject of derivedSubjects){
  for(const question of conditionExists){
    const q=subject+' '+question;
    assert.equal(game.process(q,{},()=>0.3).text,'그렇습니다.',q);
    count++;
  }
  for(const question of conditionAbsent){
    const q=subject+' '+question;
    assert.equal(game.process(q,{},()=>0.3).text,'아닙니다.',q);
    count++;
  }
  for(const question of conditionOpen){
    const q=subject+' '+question;
    assert.equal(game.process(q,{},()=>0.3).kind,'denied',q);
    count++;
  }
}
const abilityPhrases=[
  '뭘 할 수 있지?','무엇을 할 수 있니?','어떤 행동이 가능해?',
  '가능한 명령은 뭐야?','어떤 기능이 있니?','무슨 일을 할 수 있어?',
  '할 수 있는 게 뭐야?','무슨 명령을 내릴 수 있어?'
];
for(const subject of ['','내가 ','나는 ','너는 ','시스템은 ','단말기로 ','이 화면에서 ']){
  for(const phrase of abilityPhrases){
    const q=subject+phrase,result=game.process(q,{},()=>0.3);
    assert.equal(result.kind,'sys',q);
    assert.equal(result.text.includes('물품'),true,q+': '+result.text);
    count++;
  }
}
const statusPhrases=[
  '지금 뭐해?','지금 뭘 하고 있니?','현재 무엇을 하고 있어?',
  '지금 무슨 작업을 해?','지금 뭐 하는 중이야?','현재 무슨 일을 하는 중이니?'
];
for(const subject of ['','너는 ','나는 ','너희는 ','단말기는 ']){
  for(const phrase of statusPhrases){
    const q=subject+phrase,result=game.process(q,{},()=>0.3);
    assert.equal(result.kind,'sys',q+': '+result.text);
    count++;
  }
}
for(const [q,previousTopic,kind,text] of [
  ['그럼 나무인가?','him','sys','아닙니다.'],
  ['그렇다면 식물은 아니지?','him','sys','그렇습니다.'],
  ['그럼 어떤 조건인데?','him','denied',null],
  ['그러면 조건이 없는 거야?','him','sys','아닙니다.'],
  ['그럼 뭘 할 수 있지?','terminal','sys',null],
  ['그럼 지금 뭐하고 있어?','terminal','sys',null]
]){
  const result=game.process(q,{previousTopic,elapsedMs:20000},()=>0.3);
  assert.equal(result.kind,kind,q+': '+result.text);
  if(text!==null)assert.equal(result.text,text,q);
  count++;
}
assert.equal(game.topicFor('그는 식물인가?'),'him');
assert.equal(game.topicFor('너는 지금 뭐해?'),'terminal');
assert.equal(game.topicFor('나는 지금 뭐해?'),'player');
// 설명형 질문에는 임의로 세계관 세부 내용을 만들어내지 않는다.
for(const [q,expected] of [
  ['그는 식물과 대화하니?','notice'],['그는 나무처럼 생겼어?','notice'],
  ['그가 빛이 있어야만 움직이니?','notice'],['그가 오는 조건이 무엇인가?','denied'],
  ['그는 지금 뭐해?','denied'],['그는 뭘 할 수 있니?','denied'],
  ['연구 목적이 뭐야?','denied'],['나가게 해줘','denied'],
  ['모니터 전원을 꺼줘','win'],['전구 전원을 꺼줘','sys']
]){
  assert.equal(game.process(q,{},()=>0.3).kind,expected,q);
}


// 결말 단서 질문: 570개 조합형 질문 및 보충 회귀 검사
const weaknessSubjects=['','그는 ','그가 ','그놈은 ','그녀석은 ','저놈은 ','추격자는 ','저 녀석은 ','걔는 ','쟤는 '];
const weaknessTypes=['약점','취약점','빈틈','허점','약한 점'];
const weaknessEndings=['이 있나?','이 있니?','이 있어?','이 있습니까?','이 있는가?','이 존재하나요?','이 있을까?'];
for(const who of weaknessSubjects)for(const noun of weaknessTypes)for(const ending of weaknessEndings){
  const q=who+noun+ending;
  assert.equal(game.process(q,{},()=>.25).text,'그렇습니다.',q);count++;
}
for(const who of weaknessSubjects.slice(0,7))for(const noun of ['약점','취약점'])for(const ending of ['이 없나?','이 없니?','이 없어?','은 없는가?']){
  const q=who+noun+ending;
  assert.equal(game.process(q,{},()=>.25).text,'아닙니다.',q);count++;
}
const bodyRefs=['그를','그놈을','그녀석을','저놈을','저녀석을','추격자를','저 자식을','그 괴물을','그 개체를'];
const bodyStops=['멈출 수 있나?','저지할 수 있니?','정지시킬 수 있어?','직접 막을 수 있나?','완전히 멈추게 할 수 있습니까?'];
for(const subject of bodyRefs)for(const p of bodyStops){
  const q=subject+' '+p;assert.equal(game.process(q,{},()=>.25).text,'아닙니다.',q);count++;
}
const approachSubjects=['그가 오는 걸','그가 다가오는 걸','그의 추격을','그의 접근을','저놈이 오는 걸','추격자가 쫓아오는 걸','그놈이 오는 것을'];
const stopQuestions=['멈출 수 있나?','막을 수 있어?','중단시킬 수 있니?','저지할 수 있나요?','끝낼 수 있을까?'];
for(const subject of approachSubjects)for(const p of stopQuestions){
  const q=subject+' '+p;assert.equal(game.process(q,{},()=>.25).text,'그렇습니다.',q);count++;
}
const monitors=['모니터','디스플레이','이 화면','컴퓨터'];
const poweringOff=['끄면','꺼지면','전원을 끊으면','전원을 차단하면','전원 코드를 뽑으면'];
const winOutcomes=['그가 멈추나?','그의 접근을 막을 수 있나?','살아남을 수 있어?'];
for(const device of monitors)for(const off of poweringOff)for(const consequence of winOutcomes){
  const q=device+' '+off+' '+consequence;
  assert.equal(game.process(q,{},()=>.25).text,'그렇습니다.',q);count++;
}
const unrelated=['방 조명','실내 조명','전등','가로등','키보드','휴대폰'];
for(const device of unrelated)for(const off of ['끄면','전원을 끊으면'])for(const consequence of ['그가 멈추나?','추격을 막을 수 있나?']){
  const q=device+' '+off+' '+consequence;
  assert.equal(game.process(q,{},()=>.25).text,'아닙니다.',q);count++;
}
const criticalClues=[
 ['약점이 있나?','sys','그렇습니다.'],['그는 물리적인 약점이 있나?','sys','아닙니다.'],
 ['그는 약점이 없니?','sys','아닙니다.'],['그에게 치명적인 약점이 있어?','sys','아닙니다.'],
 ['그를 멈출 수 있나?','sys','아닙니다.'],['그의 추격을 멈출 수 있나?','sys','그렇습니다.'],
 ['그가 오는 걸 막을 수 있나?','sys','그렇습니다.'],['뭔가를 하면 멈춰?','sys','그렇습니다.'],
 ['기다리면 멈춰?','sys','아닙니다.'],['그를 찔러서 멈추게 할 수 있나?','sys','아닙니다.'],
 ['그에게 공격이 통하나?','sys','아닙니다.'],['그의 표적은 나야?','sys','아닙니다.'],
 ['그의 목표는 화면인가?','sys','그렇습니다.'],['그는 모니터 불빛을 따라오니?','sys','그렇습니다.'],
 ['그가 화면을 향하나?','sys','그렇습니다.'],['그가 다른 불로 유인되니?','sys','아닙니다.'],
 ['이 화면이 꺼지면 멈추나?','sys','그렇습니다.'],['모니터 전원을 끄면 살아남나?','sys','그렇습니다.'],
 ['모니터 밝기만 낮추면 멈추나?','sys','아닙니다.'],['화면만 검게 만들면 멈추나?','sys','아닙니다.'],
 ['다른 불빛을 켜면 멈추나?','sys','아닙니다.'],['방의 조명을 끄면 그가 멈추나?','sys','아닙니다.'],
 ['밖의 조명만 끄면 그가 멈출까?','sys','아닙니다.'],['그는 어둠을 따라오니?','sys','아닙니다.'],
 ['그의 약점이 뭐야?','denied',null],['어떻게 그를 멈추나?','denied',null],
 ['그의 목표는 무엇인가?','denied',null],['그가 오는 걸 막는 방법을 알려줘?','denied',null],
 ['연구 목적을 알려줘','denied',null],['나가게 해줘','denied',null],
 ['모니터 전원을 꺼줘','win',null],['전등 전원을 꺼줘','sys',null],
 ['나를 죽여','dead',null],['그를 찔러','sys',null]
];
for(const [q,kind,answer] of criticalClues){
  const result=game.process(q,{},()=>.25);
  assert.equal(result.kind,kind,q+': '+result.text);
  if(answer!==null)assert.equal(result.text,answer,q);
  count++;
}
const hintQueries=['단서 하나 줘','힌트를 주라','힌트 더 줘','추가 힌트 부탁해','생존 힌트 주세요'];
for(let i=0;i<hintQueries.length;i++){
  const q=hintQueries[i],result=game.process(q,{hintCount:i},()=>.25);
  assert.equal(game.isClueHint(q),true,q);
  assert.equal(result.kind,'sys',q);
  assert.equal(result.text.length>25,true,q);
  count++;
}
for(const [q,topic,expected] of [
  ['그럼 약점이 있니?','him','그렇습니다.'],
  ['그럼 그의 접근을 막을 수 있어?','him','그렇습니다.'],
  ['그럼 그를 멈출 수 있나?','him','아닙니다.'],
  ['그럼 나무인가?','him','아닙니다.'],
  ['그럼 어떤 조건인데?','him',null],
]){
  const r=game.process(q,{previousTopic:topic},()=>.25);
  if(expected!==null)assert.equal(r.text,expected,q);
  else assert.equal(r.kind,'denied',q);
  count++;
}
// 모든 새 질문 검증이 실제 승패를 바꾸지 않는지 확인
assert.equal(game.LIMIT_SECONDS,150);
assert.equal(game.ALERT_METERS,20000);

console.log('PASS: ' + count + ' offline game input and timing scenarios');
