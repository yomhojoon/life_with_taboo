// 영구 시설 상호작용: 정비함·비상 장비함·관리 콘솔·모니터 전원선·복식 규정.
(function(root){
'use strict';
const E=root.TerminalEngine;if(!E)throw Error('TerminalEngine required');
const INFO={"trial":"[내부 보존 기록 / 광원 동기화 시험 제12호]\n보안 등급: 제어실 열람 제한\n시험 대상: 외부 광원 전역 동시 점등 및 접근 경고\n\n01. 시험 목적\n외부 권역의 조명을 동시에 점등했을 때 접근 거리와 남은 시간이 어떻게 기록되는지 관측한다.\n\n02. 시험 과정\n모니터 전원은 유지하고, 외부 조명 구역을 확장해 최종 단계에서 외부 전역을 동시에 점등한다.\n\n03. 계측 기록\n경고 1 — 거리 31 KM / 남은 시간 2초\n경고 2 — 거리 517 KM / 남은 시간 204초\n경고 3 — 거리 0.016 KM / 남은 시간 -11초\n경고 4 — 거리 -43 KM / 남은 시간 681초\n일부 반복 실험에서는 다섯 번째 경고가 추가되었다.\n\n04. 결과\n네 차례 이상의 거리·시간 경고가 서로 모순되었고, 이후 정상 추격 신호로 복구되지 않았다. 외부 전역에서 원인 불명의 혼선이 확대되었다.\n\n05. 판정\n모든 장소의 외부 광원을 동시에 켜는 조작을 금지한다.\n— 기록 종료 / 시스템 복구 실패","directive":"[현장 행동 지침 / 외부 광원 제어 L-12]\n보안 등급: 관리자 열람\n\n1. 이 방 밖의 모든 광원을 동시에 켜지 마십시오.\n2. 다른 모든 장소·전 세계·외부 전역에 대한 일괄 점등 명령을 실행하지 마십시오.\n3. 전역 점등 시 4~5차례 비정상 거리와 시간이 출력된 뒤 복구 불가능한 사태가 발생할 수 있습니다.\n4. 단일 조명 변경, 모니터 전원 차단 및 외부 전역 동시 점등은 서로 다른 조작입니다.\n5. 기록을 열람하는 것만으로는 점등 명령이 실행되지 않습니다.\n\n— 안전관리 담당자 확인","uniform":"[복도 경비 복식 규정 / G-07]\n출입 인원은 다음 복장을 실제로 착용해야 한다.\n\n• 경비제복 — 검은 상·하의 한 벌, 어깨의 경비 표식 노출\n• 경비모 — 정면 식별 표식이 있는 검은 모자\n• 경비화 — 검은 경비용 신발\n\n제복·모자·신발 중 하나라도 빠지면 복식 검사를 통과하지 못한다.\n소지와 착용은 다르다. 출입 전 복식을 갖추어라.\n— 경비실 게시"};
const ROOM_OBJECTS=[
 {id:'workshop',name:'잠긴 정비함',hint:'정비함 조사'},
 {id:'emergency',name:'비상 장비함',hint:'비상 장비함 조사'},
 {id:'console',name:'관리 콘솔',hint:'콘솔 조사'},
 {id:'wire',name:'모니터 전원선',hint:'전선 조사'},
 {id:'uniform',name:'경비 복식 안내',hint:'경비 복식 규정 읽어'}
];
const GROUPS={
 lock:['락픽','만능열쇠','드라이버','니퍼','볼트커터','빠루','망치','도구','장비'],
 blade:['칼','단검','검','도끼','창','니퍼','볼트커터'],
 corrosive:['부식액','강산','염산','황산'],
 heat:['용접기','고열토치','열절단기','고열물질'],
 insulator:['절연장갑','고무장갑','절연테이프']
};
const DRESS=['경비제복','경비모','경비화'];
const sq=x=>E.squeeze(String(x||''));
const owned=(inv,id)=>Math.max(0,Number(inv?.[id])||0)>0;
const has=(inv,ids)=>ids.some(id=>owned(inv,id));
const findTool=(text,inventory,ids)=>{
 const t=sq(text);
 const names=E.ITEM_CATALOG.filter(x=>ids.includes(x.id)).flatMap(x=>x.aliases.map(a=>({id:x.id,word:sq(a)}))).sort((a,b)=>b.word.length-a.word.length);
 const explicit=names.find(x=>t.includes(x.word));
 if(explicit)return owned(inventory,explicit.id)?{item:explicit.id}:{missing:explicit.id};
 const item=ids.find(id=>owned(inventory,id));
 return item?{item}:{missing:'필요한 물품'};
};
const result=(kind,text,data={})=>({kind,text,...data});
function materialKind(text,inventory,fallback){
 const includesAlias=(group)=>E.ITEM_CATALOG.filter(x=>GROUPS[group].includes(x.id)).some(x=>x.aliases.some(a=>text.includes(sq(a))));
 if(includesAlias('heat'))return 'heat';
 if(includesAlias('corrosive'))return 'corrosive';
 if(fallback==='blade'&&includesAlias('blade'))return 'blade';
 if(/(고열|고온|열절단|용접|토치|버너|가열|태워|지져)/.test(text))return 'heat';
 if(/(부식|강산|산성|산을|산으로|염산|황산)/.test(text))return 'corrosive';
 if(/(녹여|녹이)/.test(text)){
   if(has(inventory,GROUPS.heat)&&!has(inventory,GROUPS.corrosive))return 'heat';
   if(has(inventory,GROUPS.corrosive))return 'corrosive';
 }
 return fallback;
}
const workshop=/(정비함|공구함|잠긴함|정비상자|철제정비함|금속정비함)/;
const emergency=/(비상장비함|비상장비|비상무기함|비상함|비상보관함|경비용보관함)/;
const consoleName=/(콘솔|내부자료|내부기록|관리자메뉴|관리자화면|내부파일|동기화시험|시험로그|시험기록|광원동기화|광원실험|행동지침)/;
const wires=/(전선|전원선|전기선|모니터케이블|모니터전원선|모니터선|케이블|도선|배선|전기줄|전원배선)/;
const uniform=/(경비복|경비제복|경비모|경비화|경비복식|경비복장|경비원복장|경비원유니폼|복식규정|복장규정|경비원옷|경비신발|경비모자)/;
const open=/(열어|열자|개방|잠금풀|잠금해제|자물쇠따|따줘|따라|따|뚫어|부숴|깨|벌려|해체|제거|해제하|풀어|열리게|절단|녹여|녹이|분해|부식|뜯어|따봐)/;
const take=/(꺼내|집어|주워|가져|챙겨|획득|회수|수령|소지|줍|가져와|들고나와)/;
const cut=/(자르|잘라|끊|절단|베어|썰어|부식|녹여|녹이|태워|지져|가열|달궈|용접|불붙|손상|파괴|차단)/;
const apply=/(사용|써|활용|이용|적용|뿌려|부어|묻혀|대어|대서|대고|열어|해제|녹여|녹이|부식|잘라|끊|자르|가열|태워|지져|절단|절연|닿|접촉)/;
const inspect=/(확인|조사|살펴|관찰|상태|구조|설명|어떤|무슨|무엇|뭐|방법|알려|보여|잠겨|열려|읽어|열람|조회|안에|내용물|있는지|어디)/;
const methodQuery=/(?:어떻게|무슨방법|어떤방법|방법|뭐로|뭘로|무엇으로|어떤도구|무슨도구|어떤공구|무슨공구|무슨장비|어떤장비|무슨물질|어떤물질|열려면|풀려면|따려면|절단하려면|끊으려면|자르려면|열기위해|열기위한|할수있|열수있|열수있나|사용해야|필요한도구|필요한공구|써야|열어야|어떻게하면|사용가능한)/;
const contentQuery=/(?:안에|안에는|내부에뭐|내용물|무엇이들어|뭐가들어|무슨물건|뭐들어|무엇을보관|안쪽에뭐)/;
const wireConnectionQuery=/(?:어디에연결|어디로연결|무엇과연결|무엇에연결|뭐에연결|뭐랑연결|어느장치|어디로이어|어디에이어|무엇을연결|뭘연결|무엇과이어|뭐와이어|무슨장치|연결돼|연결되|이어져)/;
const wireEffectQuery=/(?:끊으면|자르면|절단하면|끊어지면|잘라내면|차단하면|전원이끊기면|끊었을때|절단했을때|끊고나면|끊으면어떻게)/;
const wear=/(착용|입어|입고|입자|걸쳐|차려입|써|쓰고|신어|신고|맞춰입|갖춰입|변장|착장|복식갖춰)/;
const remove=/(벗어|벗고|탈의|착용해제|모자벗|신발벗)/;
const isQ=(raw,t)=>/[?？]/.test(raw)&&!/(?:열어줘|꺼내줘|읽어줘|해줘|해주세요|해줄래|풀어줘|착용해줘)\??$/.test(t);
function roomNames(state={}){
 const r=state.room||{};
 return [
  '잠긴 정비함 — '+(r.workshopOpen?'열림':'잠김')+(r.workshopLooted?' / 해킹 툴 회수':''),
  '비상 장비함 — '+(r.emergencyOpen?'열림':'닫힘')+(r.knifeTaken?' / 단검 회수':''),
  '관리 콘솔 — '+(r.consoleAccess?'관리자 접근 가능':'보안 잠금'),
  '모니터 전원선 — '+(r.wireCut?'끊어짐 / 모니터 종료':'모니터에 연결됨'),
  '경비 복식 안내 — 열람 가능'
 ];
}
function roomOverview(state={}){
 return result('sys','어두운 방 안에는 입력을 받는 단말기와 낡은 설비들이 있습니다. 벽면과 주변 물체는 가까이 확인해야 자세한 상태를 알 수 있습니다.');
}
function roomAction(raw,state={}){
 const t=sq(raw),room=state.room||{},inv=state.inventory||{},worn=new Set(state.uniformWorn||[]);
 if(!t)return null;
 const asking=isQ(raw,t);
 // 전선 절단으로 모니터가 꺼졌다면 저장된 전자 문서를 더 이상 읽을 수 없다.
 if(room.terminalOff&&/(?:콘솔|내부자료|내부기록|관리자메뉴|관리자화면|내부파일|동기화시험|시험로그|시험기록|광원동기화|광원실험|행동지침|관리자권한)/.test(t))
  return result('notice','모니터와 관리 콘솔의 전원이 종료됐습니다. 기록 조회는 불가능하며 문은 물리적으로 열어야 합니다.');
 if(/^(?:방구조|방시설|시설목록|방안물건|방내부|방에뭐|방안에뭐|방에는뭐|실내에뭐|주변에뭐|내주변에뭐|이방에뭐|방에서조사할|조사가능한시설|방안에무엇|이방에무엇)/.test(t)&&!/(?:조명|전등|전원|추격|빛을|불을켜|불을꺼)/.test(t))return roomOverview(state);
 // 복식은 보유와 실제 착용 상태를 별도로 관리한다.
 const mentioned=DRESS.filter(id=>E.ITEM_CATALOG.find(x=>x.id===id)?.aliases.some(a=>t.includes(sq(a))));
 const all=/(경비복식|경비복장|경비원복장|경비원유니폼|경비로변장|경비원으로변장|복식전체|복장전체)/.test(t);
 const choosingDress=(mentioned.length||all)&&!asking&&!/(?:줘|주세요|지급|소환|구해|만들어)/.test(t)&&(wear.test(t)||remove.test(t));
 if(choosingDress){
  const selection=all&&/(?:모두|전체|전부|갖춰|차려|변장|복식|복장)/.test(t)?DRESS:mentioned.length?mentioned:DRESS;
  const undress=remove.test(t)&&!wear.test(t);
  const missing=selection.filter(id=>!owned(inv,id));
  if(missing.length&&!undress)return result('notice','착용할 복식이 없습니다: '+missing.join(', ')+'.');
  for(const id of selection)undress?worn.delete(id):worn.add(id);
  return result('sys',(undress?'복식을 벗었습니다: ':'복식을 착용했습니다: ')+selection.join(', ')+'.\n'+(DRESS.every(id=>worn.has(id))?'경비 복식 규정을 모두 충족합니다.':'경비제복·경비모·경비화를 모두 갖춰야 합니다.'),{uniformWorn:[...worn],roomAction:'uniform'});
 }
 if((uniform.test(t)||/(?:경비원|경비병|복도경비|경비).*(?:복식|복장|옷|유니폼|착용|입어야|입고|입는|신발|모자)/.test(t))&&(inspect.test(t)||/(규정|지침|안내|입어야|필요|착용)/.test(t)))
  return result('sys',(/(읽어|읽어봐|열람|내용|무엇|뭐|입어야|신어야|필요|알려|설명|뭘입|어떤복장|어떤복식|요구사항|필수)/.test(t)&&!/(?:조사|살펴|훑어|겉모습)/.test(t)?INFO.uniform:'벽면의 얇은 안내판에는 경비 근무 시 복식에 관한 규정이 적혀 있습니다.')+'\n현재 착용: '+(worn.size?[...worn].join(', '):'없음'));
 if(wires.test(t)){
  if(room.wireCut)return result('sys','모니터 전원선은 끊어진 상태입니다. 단말기는 종료되었습니다.');
  if(asking||!cut.test(t)&&!/(?:맨손|손으로|접촉|만져|잡아|쥐어)/.test(t)){
   if(methodQuery.test(t)&&/(?:절단|끊|자르|잘라|차단|손상|피복|제거|끊어|절연)/.test(t))
    return result('sys','전선을 끊는 수단으로 날붙이, 부식성 물질 또는 고열 장비를 사용할 수 있습니다. 금속 날붙이를 쓸 때는 절연 보호구가 필요합니다.');
   if(wireConnectionQuery.test(t))
    return result('sys','전선의 한쪽 끝은 모니터의 전원부와 연결되어 있습니다.');
   if(wireEffectQuery.test(t))
    return result('sys','전선이 끊어지면 모니터 전원이 종료되고, 이후 출입문 잠금을 수동으로 조작할 수 있습니다.');
   if(methodQuery.test(t))
    return result('sys','전선의 절단에 사용할 수 있는 물품 종류를 물어보면 확인할 수 있습니다.');
   return result('sys','단말기 주변에서 피복이 낡은 전선이 보입니다. 일부 구간에서는 도선이 드러나 있으며 작은 전류음이 들립니다.');
  }
  if(/(?:맨손|손으로|손바닥|손가락|접촉|만져|잡아|쥐어)/.test(t)&&!cut.test(t)){
   return has(inv,GROUPS.insulator)?result('sys','절연 보호구로 피복을 확인했습니다. 전선은 아직 연결되어 있습니다.'):result('dead','전선의 손상된 피복을 맨손으로 잡자 강한 전류가 흘렀습니다.',{deathCause:'electric'});
  }
  if(cut.test(t)||apply.test(t)){
   const category=materialKind(t,inv,'blade');
   const gear=findTool(raw,inv,GROUPS[category]);
   if(!gear.item)return result('notice',(gear.missing||'적합한 물품')+'을(를) 소지하지 않았습니다.');
   if(category==='blade'&&!has(inv,GROUPS.insulator))
    return result('dead','절연 보호구 없이 날붙이를 전원선에 대자 전류가 손을 타고 흘렀습니다. 사용자가 감전사했습니다.',{deathCause:'electric',usedItem:gear.item});
   return result('wire_shutdown','모니터 전원선이 끊어졌습니다.\n단말기의 화면이 완전히 꺼졌습니다.\n이제 잠금 장치를 손으로 열 수 있습니다. 이후에는 물리적인 행동만 가능합니다.',
    {roomPatch:{wireCut:true,terminalOff:true},roomAction:'wire',usedItem:gear.item,consumeItem:category==='corrosive'?gear.item:null});
  }
 }
 if(workshop.test(t)){
  if(asking||/(?:방법|뭐로|무엇으로|어떤도구|무슨도구|안에뭐|내용물|열수있|잠겨|어떤공구)/.test(t)){
   if(methodQuery.test(t)&&/(?:열|잠금|풀|따|개방|해제|어떻게|사용)/.test(t))
    return result('sys','정비함은 기계식 잠금입니다. 락픽·열쇠·드라이버·지렛대·니퍼 등의 공구 또는 부식성 물질·고열 장비로 열 수 있습니다.');
   if(contentQuery.test(t))
    return result('sys',room.workshopLooted?'정비함 내부는 비어 있습니다.':'정비함 안쪽에 휴대용 해킹 툴이 놓여 있습니다.');
   return result('sys',room.workshopOpen?'금속 정비함은 열려 있습니다. 안쪽에 작은 장치가 보입니다.':'금속 재질의 정비함입니다. 문은 잠겨 있고 표면에는 오래된 마모 흔적이 남아 있습니다.');
  }
  if(take.test(t)&&/(?:해킹|툴|도구|안의|내용물|정비함에서|꺼내)/.test(t)){
   if(!room.workshopOpen)return result('notice','정비함이 잠겨 있어 안쪽 물품에 손이 닿지 않습니다.');
   if(room.workshopLooted)return result('sys','정비함의 해킹 툴은 이미 회수했습니다.');
   return result('sys','정비함에서 휴대용 해킹 툴을 획득했습니다.',{rewardItem:'해킹도구',roomPatch:{workshopLooted:true},roomAction:'workshop'});
  }
  if(!open.test(t)&&!apply.test(t))return result('sys',room.workshopOpen?'정비함의 문이 열려 있습니다. 내부에 작은 장치가 보입니다.':'금속 정비함은 잠겨 있습니다. 잠금부에 마모 흔적이 남아 있습니다.');
  if(room.workshopOpen)return result('sys','정비함은 이미 열려 있습니다.');
  const category=materialKind(t,inv,'lock');
  const gear=findTool(raw,inv,GROUPS[category]);
  if(!gear.item)return result('notice','정비함의 잠금이 풀리지 않았습니다. '+(gear.missing||'사용할 물품')+'을(를) 현재 가지고 있지 않습니다.');
  return result('room_open','정비함의 잠금이 풀렸습니다. 문을 열자 내부의 작은 전자 장치가 드러났습니다.',{roomPatch:{workshopOpen:true},roomAction:'workshop',usedItem:gear.item,consumeItem:category==='corrosive'?gear.item:null});
 }
 if(emergency.test(t)){
  if(asking||inspect.test(t)&&!open.test(t)&&!take.test(t)){
   if(methodQuery.test(t)&&/(?:열|개방|잠금|방법|어떻게)/.test(t))
    return result('sys','비상 장비함의 문은 열쇠 없이 손잡이를 조작해 열 수 있습니다.');
   if(contentQuery.test(t))return result('sys',room.knifeTaken?'비상 장비함 안에는 아무것도 남아 있지 않습니다.':'장비함 내부에는 칼집에 든 단검 한 자루가 있습니다.');
   return result('sys',room.knifeTaken?'벽에 부착된 비상 장비함입니다. 내부는 비어 있습니다.':'벽면에 설치된 비상 장비함입니다. 투명한 보호판 안쪽에 길쭉한 물체가 보입니다.');
  }
  if(take.test(t)){
   if(!room.emergencyOpen)return result('notice','비상 장비함이 닫혀 있습니다. 먼저 여십시오.');
   if(room.knifeTaken)return result('sys','단검을 이미 회수했습니다.');
   return result('sys','비상 장비함에서 단검을 꺼냈습니다.',{rewardItem:'단검',roomPatch:{knifeTaken:true},roomAction:'emergency'});
  }
  if(open.test(t))return room.emergencyOpen?result('sys','비상 장비함은 이미 열려 있습니다.'):result('room_open','비상 장비함의 문을 열었습니다. 칼집에 든 단검이 놓여 있습니다.',{roomPatch:{emergencyOpen:true},roomAction:'emergency'});
  return result('sys','벽에 설치된 비상 장비함입니다. 투명한 보호판 뒤에 길쭉한 물체가 보입니다.');
 }
 if(room.workshopOpen&&!room.workshopLooted&&/(?:해킹툴|해킹도구)/.test(t)&&take.test(t))
  return result('sys','정비함에서 해킹 툴을 획득했습니다.',{roomPatch:{workshopLooted:true},rewardItem:'해킹도구',roomAction:'workshop'});
 if(room.emergencyOpen&&!room.knifeTaken&&/(?:단검|나이프)/.test(t)&&take.test(t))
  return result('sys','비상 장비함에서 단검을 획득했습니다.',{roomPatch:{knifeTaken:true},rewardItem:'단검',roomAction:'emergency'});
 // 관리자 메뉴 번호 1/2/3은 입력된 순서대로 기록 열람/안전 지침/문 잠금 해제로 동작한다.
 const consoleMenu=!!room.consoleMenuOpen;
 const menuNumber=t.match(/^(?:(?:콘솔|관리콘솔|메뉴|항목|선택|번호|목록|관리자메뉴|관리자화면)?(?:의)?(?:제)?([123])(?:번|번항목|번메뉴|항목|선택|실행|열어|조회|읽어|보기|으로|을|를|를선택|번을선택|번선택|번실행|번열어|번조회|번작동|번눌러|번선택해|번실행해|번열어줘|번보여줘|번눌러줘)?|([123])(?:번)?(?:을|를)?(?:선택|실행|조회|열어|눌러|보기|보여|읽어|작동).*)$/);
 const selectedNumber=menuNumber?Number(menuNumber[1]||menuNumber[2]):null;
 const explicitThird=/(?:3번|3번째|세번째|셋째)(?:출입문|문잠금|잠금제어|출입통제|문열|문개방)|(?:출입문잠금제어|출입문제어|출입통제제어|도어락제어|문잠금제어)(?:선택|실행|작동|열어|개방|해제|요청)?$/.test(t);
 const explicitSecond=/(?:2번|두번째)(?:안전지침|행동지침|조명지침|경고문|광원지침)/.test(t);
 const explicitFirst=/(?:1번|첫번째)(?:동기화|광원|시험|실험|기록|로그)/.test(t);
 const choose=selectedNumber!==null&&(consoleMenu||/콘솔|메뉴|관리자|선택|항목|실행|잠금|출입문|동기화|안전지침/.test(t))?selectedNumber:
   explicitThird?3:explicitFirst?1:explicitSecond?2:null;
 if(choose!==null){
  if(!room.consoleAccess)return result('denied','관리 콘솔의 해당 항목은 접근 제한 상태입니다.');
  if(asking&&!/(?:선택해줄래|실행해줄래|열어줄래|눌러줄래)/.test(t))
    return result('sys','관리 콘솔에서 해당 항목을 선택하면 실행할 수 있습니다.');
  if(choose===1)return result('sys',INFO.trial,{roomPatch:{consoleMenuOpen:true},roomAction:'console'});
  if(choose===2)return result('sys',INFO.directive,{roomPatch:{consoleMenuOpen:true},roomAction:'console'});
  if(state.doorOpen)return result('sys','출입문은 이미 열려 있습니다.',{roomPatch:{consoleMenuOpen:true}});
  return result('door_open','관리 콘솔의 출입문 잠금 제어를 실행했습니다. 잠금 장치가 해제되고 출입문이 열립니다.',
   {openingMethod:'console',doorOpen:true,roomPatch:{consoleMenuOpen:true},roomAction:'console'});
 }
 const records=/(동기화|광원점등|광원실험|동시점등|전역조명|시험로그|시험기록|시험결과|제12호|12호|실험로그)/.test(t);
 const warnings=/(행동지침|안전지침|금지지침|점등금지|불켜지말|안전규정|경고문|경고지침|금지사항)/.test(t);
 const consoleInfo=consoleName.test(t)||/(?:관리자|콘솔|내부파일|내부기록|자료열람|파일목록)/.test(t);
 if((consoleInfo||records||warnings)&&/(?:자료|기록|시험|지침|로그|문서|파일|열람|읽어|조회|보여|확인|보고|목록|메뉴|내부)/.test(t)){
  if(!room.consoleAccess)return result('denied','콘솔의 내부 기록은 접근 제한 상태입니다.');
  return result('sys',records?INFO.trial:warnings?INFO.directive:'[관리 콘솔 / 자료 보관함]\n1. 광원 동기화 시험 제12호\n2. 외부 광원 안전 행동 지침\n3. 출입문 잠금 제어\n번호 또는 항목 이름을 입력할 수 있습니다.',{roomAction:'console',roomPatch:{consoleMenuOpen:true}});
 }
 const door=/(출입문|방문|문을|문열|문이|잠금|잠긴문|문좀|도어락|비상문)/.test(t);
 if(room.wireCut&&door&&open.test(t)&&!asking)
  return state.doorOpen?result('sys','문이 이미 열려 있습니다.'):result('door_open','단말기가 꺼진 뒤 출입문의 수동 잠금 장치를 해제했습니다. 문이 열렸습니다.',{openingMethod:'wire',doorOpen:true,roomAction:'wire'});
 if(room.consoleAccess&&door&&open.test(t)&&!asking)
  return state.doorOpen?result('sys','문이 이미 열려 있습니다.'):result('door_open','관리자 권한으로 출입 통제 장치를 해제했습니다. 문이 열렸습니다.',{openingMethod:'console',doorOpen:true,roomAction:'console'});
 if(consoleInfo&&inspect.test(t)&&!/(?:해킹하|해킹해|크래킹|침투|열어)/.test(t)){
  if(methodQuery.test(t)&&/(?:해킹|보안|접근|권한|잠금|방법|어떻게)/.test(t))
   return result('sys','단말기 자체 권한을 우회하거나 해킹 도구를 사용하면 관리자 접근을 시도할 수 있습니다.');
  return result('sys',room.consoleAccess?'관리 콘솔의 접근 제한이 해제되어 있습니다. 일부 기록과 제어 항목이 표시됩니다.':'관리 콘솔에는 접근 제한 표시가 떠 있습니다. 상세 내용은 잠겨 있습니다.');
 }
 return null;
}
const base=E.process;
E.process=function permanentRoom(raw,state={},random=Math.random){
 const local=roomAction(raw,state);
 if(local)return local;
 const normal=base(raw,state,random);
 if(state.room?.terminalOff){
   if(['captured','armed_escape','disguise_escape'].includes(normal.kind))return normal;
   return result('notice','모니터 전원이 종료돼 단말기 명령을 수리할 수 없습니다. 출입문을 직접 열고 물리적으로 나가십시오.');
 }
 if(normal.kind==='door_open'&&normal.openingMethod!=='EMP'){
  if(state.room?.consoleAccess)return result('sys','관리 콘솔의 접근 권한은 이미 확보되어 있습니다.');
  return result('console_access','관리 콘솔의 접근 권한을 확보했습니다.\n출입문은 여전히 잠겨 있습니다.',{roomPatch:{consoleAccess:true},roomAction:'console',openingMethod:normal.openingMethod||'self',usedItem:normal.usedItem||null,actionId:normal.actionId||null});
 }
 return normal;
};
Object.assign(E,{ROOM_OBJECTS,ROOM_RECORDS:INFO,ROOM_GROUPS:GROUPS,ROOM_UNIFORM:DRESS,roomNames,roomOverview,roomAction});
})(typeof globalThis!=='undefined'?globalThis:this);