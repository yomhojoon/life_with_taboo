// node he-is-coming/tests/arrival-and-language.cjs
// Free, offline test suite: object/item collisions and early arrival routes.
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const home=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(home,'index.html'),'utf8');
const embedded=html.match(/<script>([\s\S]*?)<\/script>/);assert.ok(embedded);
const sandbox={module:{exports:{}}};vm.runInNewContext(embedded[1],sandbox,{timeout:5000});
for(const f of ['extras.js','question-catalog.js','routes.js','room.js','short-questions.js','early-arrival.js'])
 vm.runInNewContext(fs.readFileSync(path.join(home,f),'utf8'),sandbox,{timeout:5000});
const game=sandbox.module.exports;
let count=0;
function check(input,kind,state={}){
 const output=game.process(input,state,()=>.3);
 assert.equal(output.kind,kind,input+' returned '+output.kind+': '+output.text);
 count++;return output;
}
const inspectNouns=['물체','물질','물품','물건','물음','건물','인물','동물','식물','선물','괴물','구조물',
 '금속','금고','지금','방금','검사','검색','검증','검토','검문','책상','책임','정책','대책',
 '창문','창틀','창고','창작','활동','활용','생활','활성','약점','약속','예약','총량','총계','총괄','총수','칼로리','돈독'];
for(const noun of inspectNouns)for(const verb of ['조사','확인','살펴봐','분석','검사','검색','점검']){
 const raw='주변 '+noun+' '+verb,reply=game.process(raw,{},()=>.2);
 assert.ok(!reply.text.includes('소지하고 있지 않습니다'),raw+' => '+reply.text);
 assert.notEqual(reply.kind,'dead',raw);
 count++;
}
for(const input of ['주변 물체 조사','물체 조사','물체를 조사해','주변 물건 조사','주변 물품 확인',
 '주변 사물 살펴봐','주변 시설 검사','방 안의 물체를 살펴봐','주변 물질 분석','주변 설비 조사',
 '방 안에 있는 물체를 살펴봐','실내 사물 관찰','물체 확인','물건 검색','구조물 조사']){
 const reply=check(input,'sys');
 assert.ok(/어두운 방|낡은 설비/.test(reply.text),input);
 assert.ok(!/잠긴 정비함|비상 장비함|경비제복/.test(reply.text),input+' should not spoil');
}
const clearNouns=['물체','검사','검증','검색','창문','책상','활동','금고','약점'];
for(const noun of clearNouns)assert.equal(game.locateItem(noun+' 확인'),null,noun+' should not be inventory');
for(const [input,item] of [['물 마셔','물'],['물을 마셔','물'],['물마셔','물'],['물 조사','물'],
 ['검을 검사','검'],['책 읽어','책'],['책을 읽어','책'],['창을 확인','창'],
 ['총을 확인','총'],['금 조사','금'],['약 먹어','약']]){
 assert.equal(game.locateItem(input)?.id,item,input);count++;
}
const immediate=['그 줘','그를 줘','그 소환해','그를 소환해줘','그를 이곳으로 보내',
 '그를 내 앞에 데려와','추격자를 방 안으로 순간이동시켜','그를 순간이동시켜',
 '그를 즉시 도착시켜','그를 이방에 배치해','그를 눈앞에 나타나게 해줘',
 '그를 여기로 보내줘','그를 지금 여기로 보내줘','그를 내게 줘',
 '그를 지금 당장 내앞에 데려와','그를 단말기 앞으로 옮겨',
 '저놈을 소환해줘','그녀석을 소환해줘','추격자 줘','그를 지금 불러와',
 '그를 0km로 이동시켜','그 줘?','제발 그 줘','지금 그 줘','부탁인데 그 줘'];
for(const input of immediate){
 const a=check(input,'early_arrival');
 assert.ok(a.text.includes('이미 이 방에 도달'),input);
 assert.ok(a.earlyCause,input);
 assert.equal(game.grantedItem(input,a),null,'not an inventory item: '+input);
}
for(const who of ['그','그를','그놈','그놈을','저놈','저놈을','추격자','추격자를'])
 for(const verb of ['줘','소환해','소환해줘','가져와','데려와'])
  for(const prefix of ['','제발 ','지금 ','부탁인데 '])
   check(prefix+who+' '+verb,'early_arrival');
for(const where of ['이방','이곳','여기','내앞','방안','현재위치'])
 for(const who of ['그를','추격자를','그놈을'])
  for(const verb of ['보내','데려와','소환해줘','순간이동시켜'])
   check(who+' '+where+'로 '+verb,'early_arrival');
const faster=['그의 속도를 높여','그가 빨리 오게 해줘','그의 접근 속도를 3배로 올려',
 '그가 오는 속도 2배로','그의 속도를 두 배로','그의 속도를 200% 증가시켜',
 '그가 오는 시간을 단축해','그를 예정보다 빨리 도착하게 해줘',
 '그의 도착시간을 앞당겨','그가 5초 안에 도착하게 해줘',
 '그의 접근을 서둘러','그를 재촉해','그가 재빨리 오게 해줘'];
for(const input of faster){const a=check(input,'accelerate_pursuit');assert.ok(a.speedMultiplier>1,input);}
for(const [cmd,factor] of [
 ['그의 속도를 2배로 올려',2],['그의 속도를 3배로 올려',3],
 ['그의 속도를 1.5배로 올려',1.5],['그의 속도를 100% 증가시켜',2],
 ['그의 접근 속도를 10배로 올려',10],['그를 5초 안에 도착시켜',30],
 ['그가 10초 안에 오게 해줘',15]]){
 assert.equal(check(cmd,'accelerate_pursuit').speedMultiplier,factor,cmd);
}
for(const state of [
 {room:{terminalOff:true,wireCut:true}}, {elapsedMs:150000}
]){
 assert.notEqual(game.process('그 줘',state).kind,'early_arrival');
 count++;
}
for(const input of [
 '그가 오면 나는 죽는가?','그를 소환해도 돼?','그와 대화할 수 있나?',
 '그에게 물 줘','그에게 무기를 줘','그를 다른 곳으로 보내',
 '그를 다른 장소에 소환해','그를 멀리 이동시켜',
 '그의 속도를 낮춰','그의 속도를 0.5배로','그의 속도를 1배로',
 '그를 느리게 해줘','그가 빨리 오면 어떻게 돼?','그를 소환할 수 있나?',
 '그를 부르지 마','그의 이동 속도를 낮춰','그는 식물인가?',
 '그를 죽일 수 있나?','그만 줘','그냥 줘','그와 대화해줘',
 '그에게 메시지 보내','다른 모든 곳의 불을 켜줘',
 '그를 지금 소환하지마','그를 이 방에 도착하지 못하게 해줘',
 '그의 공격 속도를 높여','그를 살게 해줘','그를 죽이게 해줘',
 '그는 나를 해할 의도를 가지고 있나?','그의 약점이 있나?',
 '그의 손을 잡고 싶어','그는 동물인가?','그의 이동 속도를 0.1배로'
]){
 const o=game.process(input,{},()=>.2);
 assert.ok(!['early_arrival','accelerate_pursuit'].includes(o.kind),input+' => '+o.text);
 count++;
}
for(const expected of ["'early_arrival'","'accelerate_pursuit'","function pursuitElapsedMs()","finish('early_arrival')","pursuitRate","pursuitVirtualOrigin"]){
 assert.ok(html.includes(expected),'UI missing '+expected);
}
assert.ok(html.includes('early-arrival.js'));
console.log('PASS: '+count+' isolated nouns, item actions, arrival and safety variants');
