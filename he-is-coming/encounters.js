
(function(root){
'use strict';
const E=root.TerminalEngine;if(!E)throw Error('TerminalEngine required');
const data=[["무전 잡음","어디선가 짧은 전파음이 들립니다.",["주파수확인|라디오확인|들어|조사","잡음을 들었지만 단어를 분간하지 못했습니다.",null],["무시|그대로|기다려","잡음이 사라졌습니다.",null]],["발걸음","문 바깥에서 두 번의 무거운 소리가 들립니다.",["귀기울여|들어|확인","소리는 다시 들리지 않습니다.",null],["무시|가만히|기다려","방 안이 다시 조용해졌습니다.",null]],["낡은 종이","천장 부근에서 작은 종이 조각이 떨어집니다.",["주워|줍|집어","글씨 없는 종이 조각을 주웠습니다.","종이"],["살펴|확인|조사","종이에는 희미한 선만 보입니다.",null]],["어두운 반사","구석에서 작은 빛 반사가 스쳐갑니다.",["살펴|확인|비춰","금속 조각이 빛을 반사한 흔적이 보입니다.",null],["무시|기다려|그대로","반사는 잠시 뒤 사라집니다.",null]],["전류음","단말기 내부에서 전류음이 달라집니다.",["점검|진단|상태확인","단말기는 정상 작동 중입니다. 추격은 계속됩니다.",null],["무시|기다려|그대로","팬 소음이 원래대로 돌아옵니다.",null]],["문틈 그림자","문 아래로 얇은 그림자가 지나갑니다.",["살펴|확인|조사","문 밖의 상황은 확인할 수 없습니다.",null],["무시|가만히|기다려","그림자가 사라집니다.",null]],["물방울","천장 부근에서 물방울 소리가 들립니다.",["소리확인|확인|살펴|듣","누수 흔적은 보이지 않습니다.",null],["무시|기다려|가만히","소리는 곧 멎었습니다.",null]],["떨리는 키","키보드 키 하나가 스스로 떨리는 듯합니다.",["키보드점검|점검|확인|닦아","키보드는 정상적으로 반응합니다.",null],["무시|그대로|기다려","떨림이 멈췄습니다.",null]],["쇳소리","어두운 곳에서 작은 쇳소리가 울립니다.",["확인|살펴|소리들어","금속 부품 하나가 굴러온 것을 발견했습니다.",null],["무시|기다려|그대로","울림이 멈췄습니다.",null]],["차가운 공기","갑자기 방 안이 싸늘해집니다.",["주변확인|온도확인|확인","온도계는 없지만 차가운 기운은 분명합니다.",null],["기다려|무시|가만히","차가운 감각이 옅어집니다.",null]],["약한 진동","발밑에서 가벼운 진동이 느껴집니다.",["바닥확인|점검|살펴|확인","새로운 균열이나 통로는 발견되지 않았습니다.",null],["무시|그대로|기다려","진동이 사라집니다.",null]],["타이핑 오류","입력하지 않은 글자가 나타난 듯합니다.",["입력확인|키보드점검|검사","입력창에는 아무 글자도 추가되지 않았습니다.",null],["무시|기다려|그대로","화면은 정상으로 돌아옵니다.",null]],["벽의 마찰음","벽 건너편에서 희미한 긁는 소리가 들립니다.",["벽확인|살펴|조사","벽에는 새 흔적이 없습니다.",null],["무시|그대로|기다려","마찰음이 먼 곳으로 사라집니다.",null]],["정적","기계음이 한순간 끊긴 듯합니다.",["단말기점검|점검|상태확인","전원은 끊기지 않았습니다.",null],["기다려|무시|그대로","기계음이 곧 돌아옵니다.",null]],["먼 울림","먼 곳에서 둔탁한 울림이 한 번 들립니다.",["귀기울여|듣|확인","추격 경고의 거리에는 변화가 없습니다.",null],["무시|가만히|기다려","울림은 반복되지 않습니다.",null]],["진동하는 기기","전화기 진동과 비슷한 소리가 들립니다.",["전화확인|확인|살펴","주변에서 연결 가능한 전화기는 확인되지 않습니다.",null],["무시|기다려|그대로","진동 소리가 사라집니다.",null]],["종이 뭉치","모니터 아래에서 접힌 종이가 미끄러져 나옵니다.",["주워|펴|읽어","안에는 작은 빈 칸 몇 개만 남아 있습니다.","종이"],["무시|그대로|기다려","종이는 바닥에 남았습니다.",null]],["작은 전지","발밑에서 둥근 금속 소리가 들립니다.",["주워|집어|확인","건전지가 떨어져 있었습니다.","건전지"],["무시|기다려|그대로","둥근 물체가 어두운 곳으로 굴러갑니다.",null]]];
const ENCOUNTERS=data.map((e,i)=>({id:i,name:e[0],text:e[1],
 options:e.slice(2).map(([verbs,response,reward])=>({verbs,response,reward}))}));
function drawEncounter(random=Math.random,exclude=-1){
 let index=Math.min(ENCOUNTERS.length-1,Math.floor(Math.max(0,random())*ENCOUNTERS.length));
 if(index===exclude)index=(index+1)%ENCOUNTERS.length;
 const event=ENCOUNTERS[index];
 const choices=event.options.map(o=>o.verbs.split('|')[0]).join(' / ');
 return {id:event.id,name:event.name,text:'[돌발] '+event.text+'\n선택: '+choices+' (또는 무시)'};
}
function resolveEncounter(raw,active){
 if(!active)return null;
 const event=ENCOUNTERS[active.id];if(!event)return null;
 const s=E.squeeze(raw);
 if(/(?:모니터|디스플레이|화면|컴퓨터).*(?:꺼|끄|차단|전원)|(?:나가|탈출|다른차원|죽여|공격|그를)/.test(s))return null;
 const choice=event.options.find(o=>new RegExp(o.verbs).test(s));
 if(!choice&&!/(무시|넘겨|신경안써|그대로|가만히)/.test(s))return null;
 const selected=choice||{response:'돌발 상황을 무시했습니다. 주변은 다시 조용해집니다.',reward:null};
 return {kind:'sys',text:'돌발 상황 처리: '+selected.response,resolvedEncounter:true,
  encounterReward:selected.reward||null};
}
Object.assign(E,{ENCOUNTERS,drawEncounter,resolveEncounter});
})(typeof globalThis!=='undefined'?globalThis:this);
