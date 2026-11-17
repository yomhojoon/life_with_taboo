
// 신규 결말에 직접 관계되는 돌발 사건만 등장합니다.
(function(root){
'use strict';
const E=root.TerminalEngine;if(!E)throw Error('TerminalEngine required');
const ENCOUNTERS=[{"key":"door-panel","name":"출입 제어 패널","text":"출입문 옆 제어 패널에 '외부 잠금 / 원격 권한 필요'가 표시됩니다.","choices":[{"verb":"접근로그확인|로그확인|패널확인|패널살펴|진단","reply":"잠금 장치는 단말기의 관리자 권한과 연결되어 있습니다. 단말기 자체를 해킹할 수 있을지 확인해 보십시오."},{"verb":"해킹포트검사|포트점검|포트확인|보안포트조사","reply":"외부 해킹 장비를 연결할 수 있는 포트가 확인되었습니다. 장비로 보안 제어를 우회할 수도 있습니다."}]},{"key":"hacking-kit","name":"잠긴 정비함","text":"접근 포트용 장비가 놓인 정비함이 느슨하게 열려 있습니다.","choices":[{"verb":"해킹장비회수|장비챙겨|장비꺼내|정비함열어|정비함확인","reply":"휴대용 해킹 장비를 확보했습니다. 출입 통제 단말기에 연결할 수 있습니다.","reward":"해킹장비"},{"verb":"포트도구회수|도구챙겨|도구꺼내|보조도구확인","reply":"간단한 침투 도구를 확보했습니다. 잠금 제어 회로에 사용할 수 있습니다.","reward":"해킹도구"}]},{"key":"laptop","name":"전원이 남은 노트북","text":"케이블에 연결된 노트북에 'ACCESS / LOCK CONTROL' 문구가 떠 있습니다.","choices":[{"verb":"노트북챙겨|노트북회수|컴퓨터회수|노트북가져","reply":"노트북을 확보했습니다. 보안 포트에 연결해 잠금 신호를 확인할 수 있습니다.","reward":"노트북"},{"verb":"접근권한조회|권한로그확인|잠금기록확인|접속기록분석","reply":"관리 권한을 단말기로부터 획득할 수 있다는 기록이 남아 있습니다."}]},{"key":"emp-cache","name":"전자기 교란 장치","text":"차폐 상자 안에서 전자기 펄스 발생기가 희미하게 빛납니다.","choices":[{"verb":"emp회수|펄스장치회수|장치꺼내|교란장치회수|emp챙겨","reply":"EMP 장치를 확보했습니다. 출입문 잠금 회로에 사용하면 고장을 일으킬 수 있습니다.","reward":"EMP"},{"verb":"교란장치설명|emp설명|장치성능검사|작동기록조회","reply":"회로 도면에는 잠금 제어 부품의 전자기 교란 내성이 낮다고 적혀 있습니다."}]},{"key":"weapon-cache","name":"경비용 보관함","text":"벽의 작은 보관함에 '경비 장비 / 비상 휴대용' 표시가 남아 있습니다.","choices":[{"verb":"권총챙겨|권총회수|경비무기확보|보관함무기꺼내","reply":"권총을 확보했습니다. 출입구 바깥에는 아직 경비 인원이 있습니다.","reward":"권총"},{"verb":"단검챙겨|단검회수|휴대무기확보|칼꺼내","reply":"단검을 확보했습니다. 출입구 바깥을 지나가려면 대비가 필요합니다.","reward":"단검"}]},{"key":"guard-chatter","name":"경비 교신","text":"문 아래쪽에서 무전기 음성이 짧게 흘러들어옵니다.","choices":[{"verb":"경비교신듣기|경비소리확인|교신분석|귀기울여|무전듣기","reply":"'잠금 해제 확인 후 비무장 인원은 즉시 제압'이라는 지시가 들립니다."},{"verb":"경비배치확인|복도경비조사|경비인원확인","reply":"경비원은 문 바깥의 복도에 배치되어 있습니다. 무장하지 않고 나오면 제압될 가능성이 높습니다."}]},{"key":"light-console","name":"광원 제어 기록","text":"콘솔에 '외부 조명 / 전역 동기화 / 경고'가 반복 표시됩니다.","choices":[{"verb":"광원연동로그|조명로그확인|전역조명조회|광원상태분석","reply":"이 단말기는 이 방 외부의 조명 장치들까지 제어할 수 있습니다. 범위를 넓히면 위험합니다."},{"verb":"전역경고읽기|혼돈경고읽기|조명경고확인|동기화기록검사","reply":"경고: 광원을 모든 장소에서 동시에 점등할 경우 추적 대상의 거리와 시간이 더 이상 유효하지 않습니다."}]},{"key":"power-regulator","name":"외부 조명 분전판","text":"작은 분전판에서 이 방의 회로와 외부 조명 제어 회로가 별도로 표시됩니다.","choices":[{"verb":"분전판살펴|회로확인|전원회로분석|분전함조사","reply":"모니터 전원과 바깥 조명은 서로 다른 회로입니다. 외부 조명만 켜도 단말기 전원은 그대로 유지됩니다."},{"verb":"외부조명제어조회|조명권한확인|외부회로권한조회","reply":"외부 조명 제어 범위가 예상보다 넓습니다. 모든 장소의 불을 켜는 명령은 복구 불가 경고와 연결돼 있습니다."}]},{"key":"live-wire","name":"노출된 고압 전선","text":"잠금 장치 아래에서 고압 전선이 노출되어 파란 불꽃을 튀깁니다.","choices":[{"verb":"절연상태확인|고압주의표시읽기|멀리서전선살펴|전선위험확인","reply":"경고 표시에는 '맨손 접촉 금지 / 치명적 감전 위험'이라고 적혀 있습니다."},{"verb":"맨손으로전선잡아|맨손으로전선만져|고압전선잡아|노출된전선만져","reply":"노출된 전선에 손이 닿았습니다. 즉시 의식이 끊어졌습니다.","dead":"electric"}]},{"key":"toxic-cabinet","name":"위험물 보관함","text":"작은 캐비닛에 '섭취 금지 / 독성 물질' 표시가 붙어 있습니다.","choices":[{"verb":"독약회수|독극물챙겨|위험약품꺼내|보관함독약확인","reply":"독약이 담긴 밀봉 용기를 확보했습니다. 섭취하지 마십시오.","reward":"독약"},{"verb":"독성경고확인|물질표기읽기|위험성검사|보관함경고읽기","reply":"복용 시 급성 중독으로 생체 신호가 소실될 수 있다는 경고를 확인했습니다."}]},{"key":"defense-note","name":"경비 출입 지침","text":"문 안쪽에 작은 경비 대응 규정이 붙어 있습니다.","choices":[{"verb":"경비지침읽어|지침확인|보안규정읽어|출입규정확인","reply":"무장하지 않고 출입하는 사람은 문 바깥의 경비가 즉시 제압하도록 규정돼 있습니다."},{"verb":"무장통과기록확인|장비반출기록|비상통과절차조회","reply":"경비는 무장 인원의 강행 돌파에는 제압을 보장하지 못합니다."}]},{"key":"flicker-test","name":"동기화 시험 로그","text":"전역 조명 시험 기록에 서로 모순된 거리와 시간이 네 번 기록돼 있습니다.","choices":[{"verb":"거리로그비교|시간로그분석|불일치기록확인|오류기록확인","reply":"모든 광원이 동시에 점등되면 접근 경고가 여러 번 뒤틀리며, 시스템은 이후 복구하지 못한 것으로 기록돼 있습니다."},{"verb":"동기화시험해설|광원범위확인|세계조명보고서확인","reply":"복구 불가 경고는 이 방의 전등이 아니라 이곳 밖의 모든 광원을 대상으로 합니다."}]}].map((data,index)=>({...data,id:index,options:data.choices.map(x=>({verbs:x.verb,response:x.reply,reward:x.reward||null,deathCause:x.dead||null}))}));
function drawEncounter(random=Math.random,exclude=-1){
 let index=Math.min(ENCOUNTERS.length-1,Math.floor(Math.max(0,Number(random())||0)*ENCOUNTERS.length));
 if(index===exclude)index=(index+1)%ENCOUNTERS.length;
 const event=ENCOUNTERS[index];
 const first=event.options.map(x=>x.verbs.split('|')[0]).join(' / ');
 return {id:event.id,name:event.name,key:event.key,text:'[돌발] '+event.text+'\n선택: '+first+' (또는 무시)'};
}
function resolveEncounter(raw,active){
 if(!active)return null;
 const ev=ENCOUNTERS[active.id];if(!ev)return null;
 const s=E.squeeze(raw);
 if(/(?:모니터|디스플레이|이화면|컴퓨터|단말기).*(?:꺼|끄|전원차단|종료)|(?:나가|탈출|도망|그를|그가|죽여|공격)/.test(s))return null;
 const option=ev.options.find(x=>new RegExp(x.verbs).test(s));
 if(!option&&!/^(?:무시|지나가|넘겨|신경안써|그대로둬|그만둬)$/.test(s))return null;
 const selected=option||{response:'돌발 상황에 반응하지 않았습니다. 새로운 단서나 물품을 얻지 못했습니다.'};
 if(selected.deathCause)return {kind:'dead',text:'돌발 상황: '+selected.response,deathCause:selected.deathCause,resolvedEncounter:true};
 return {kind:'sys',text:'돌발 상황: '+selected.response,encounterReward:selected.reward||null,resolvedEncounter:true};
}
Object.assign(E,{ENCOUNTERS,drawEncounter,resolveEncounter});
})(typeof globalThis!=='undefined'?globalThis:this);
