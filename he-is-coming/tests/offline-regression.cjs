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
  ['휴대폰 전원을 꺼줘', 'sys'],
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
console.log('PASS: ' + count + ' offline game input and timing scenarios');
