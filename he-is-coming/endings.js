// Additional fictional branching endings. This is an offline game state machine, not a real hacking implementation.
(function(root){
'use strict';
const E=root.TerminalEngine;
if(!E)throw Error('TerminalEngine must be ready before endings.js');
const normalize=E.squeeze;
const supplemental=[
 ['총','weapon',['총기','총한자루']],['권총','weapon',['피스톨','리볼버']],['소총','weapon',['라이플','돌격소총']],
 ['산탄총','weapon',['샷건']],['칼','weapon',['식칼','나이프']],['단검','weapon',['대거']],
 ['검','weapon',['장검','검한자루']],['도끼','weapon',['손도끼']],['창','weapon',['장창']],
 ['쇠파이프','weapon',['철파이프']],['무기','weapon',['무기류','무장장비']],['폭탄','weapon',['폭발물']],
 ['해킹장비','hack',['해킹장치','해킹장비세트','해킹기기','해킹용장비']],
 ['해킹키트','hack',['해킹키트세트','해킹세트']],['해킹도구','hack',['해킹툴','해킹툴킷','해킹용도구']],
 ['USB해킹툴','hack',['해킹USB','해킹용USB','크래킹USB']],['노트북','hack',['해킹노트북','해킹용노트북']],
 ['EMP','emp',['전자기펄스','전자기펄스장치','전자기펄스발생기','EMP장치','EMP발생기','전자기파발생기']]
];
const weaponIds=new Set(['총','권총','소총','산탄총','칼','단검','검','도끼','창','쇠파이프','무기','폭탄','망치']);
const gearIds=new Set(['해킹장비','해킹키트','해킹도구','USB해킹툴','노트북']);
const empIds=new Set(['EMP']);
const actions={
 weapon:[
  ['들어|쥐어|장착|착용|휴대|챙겨|무장|지참','무기를 손에 들었습니다.',false],
  ['꺼내|뽑아|빼내','가까이에 꺼내 두었습니다.',false],
  ['확인|살펴|검사|점검','소지한 무기의 상태를 확인했습니다.',false],
  ['사용|써|사용해|시험','사용 준비 상태입니다. 대상이 지정되지 않았습니다.',false],
  ['겨눠|조준|조준해','무기를 앞으로 겨누었습니다.',false],
  ['닦아|손질|정비','표면을 간단히 손질했습니다.',false],
  ['보관|집어넣|가방에|정리','휴대 가능한 상태로 보관했습니다.',false],
  ['내려놔|놓아|버려|버리|반납','소지품에서 무기를 내려놓았습니다.',false]
 ],
 hack:[
  ['사용|써|가동|작동|실행','장비를 작동시켰습니다. 단말기 보안 상태를 조회합니다.',false],
  ['연결|접속|꽂아|삽입','장비를 단말기 인터페이스에 연결했습니다.',false],
  ['확인|살펴|검사|점검','단말기용 작업 장비의 상태를 살폈습니다.',false],
  ['전원|켜|부팅','장비가 기동했습니다.',false],
  ['설정|조절|준비','단말기를 대상으로 작업 준비를 마쳤습니다.',false],
  ['기록|로그|저장','읽을 수 있는 작동 기록만 저장했습니다.',false],
  ['분리|뽑|해제|끊','장비를 단말기에서 분리했습니다.',false],
  ['보관|내려놔|정리|챙겨','장비를 가까이에 보관했습니다.',false]
 ],
 emp:[
  ['사용|써|가동|발동|작동|방출|터뜨|폭발','장치가 짧은 전자기 펄스를 방출했습니다.',true],
  ['확인|살펴|검사|점검','EMP 장치의 표시등이 희미합니다.',false],
  ['연결|설치|배치','장치를 단말기 가까이에 두었습니다.',false],
  ['충전|잔량|전력','장치의 남은 전력을 정확히 알 수 없습니다.',false],
  ['설정|조절|준비','장치가 작동 대기 상태입니다.',false],
  ['들어|쥐어|손에','손에 든 장치가 무겁게 느껴집니다.',false],
  ['분리|해제|꺼|끄','장치의 대기 상태를 종료했습니다.',false],
  ['보관|정리|챙겨','장치를 안전하게 보관했습니다.',false]
 ]
};
for(const [id,group,aliases] of supplemental){
  if(E.ITEM_CATALOG.some(x=>x.id===id))continue;
  E.ITEM_CATALOG.push({id,name:id,group,description:group==='weapon'?'휴대 가능한 무기류':group==='hack'?'단말기 보안 작업용 장비':'전자기 펄스 발생 장치',effect:'상태가 확인되었습니다.',aliases:[id,...aliases]});
  for(let i=0;i<actions[group].length;i++){
    const [verbs,text,consume]=actions[group][i];
    E.ITEM_INTERACTIONS.push({id:id+'-'+(i+1),item:id,index:i+1,verbs,text,consume});
  }
}
const ofWeapon=inventory=>E.ITEM_CATALOG.find(x=>weaponIds.has(x.id)&&((inventory||{})[x.id]||0)>0)?.id||null;
const ofTech=inventory=>E.ITEM_CATALOG.find(x=>gearIds.has(x.id)&&((inventory||{})[x.id]||0)>0)?.id||null;
const ofEmp=inventory=>(inventory?.EMP||0)>0?'EMP':null;
const hackToken=/(해킹|해크|해커|보안우회|보안뚫|보안을뚫|방화벽우회|관리자권한|관리권한|루트권한|root권한|제어권탈취|보안체계|시스템침투|취약점공격|암호해제|해킹명령)/;
const equipment=/(해킹장비|해킹도구|해킹키트|해킹툴|크래킹|usb해킹|해킹usb|해킹노트북|노트북|해킹기기|해킹용장비|해킹용도구)/;
const emp=/(emp|전자기펄스|전자기파발생|전자기펄스발생|전자기충격펄스)/;
const self=/(모니터|단말기|이시스템|시스템|이컴퓨터|컴퓨터|터미널|제어장치|제어시스템|너자신|네자신|너스스로|스스로|자기자신|자체|보안|문잠금|잠금장치|출입통제|출입문)/;
const act=/(해킹해|해킹하|해킹시작|뚫어|뚫으|우회해|우회하|침투해|침투하|탈취해|탈취하|해제해|해제하|해킹실행|해킹명령|root권한얻|권한획득|권한탈취|권한을얻|사용해|써|작동시켜|작동해|가동해|실행해|발동시켜|방출해|터뜨려|폭발시켜|켜|꺼|해봐|해줘|해라|시도해|시도하|실행하)/;
const gift=/(줘|주세요|주십시오|달라|내놔|지급|제공|소환|생성|가져와|구해줘|준비해줘|갖고싶|필요해|필요하|받고싶)/;
const question=/(어떻게|가능한가|가능하|할수있|할수없|해도되|무엇|뭐야|무슨|방법|해킹이되|해킹할수|인가|일까|되는가|될까|여부)/;
const hypothesis=/(하면|한다면|했을때|해보면|사용하면|쓰면|발동하면|터뜨리면|가동하면)/;
const isQuestion=raw=>/[?？]/.test(raw);
function hackIntent(raw){
 const s=normalize(raw);
 const hasHack=hackToken.test(s);
 const hasGear=equipment.test(s)&&/(사용|가동|실행|작동|연결|꽂|삽입|해킹|뚫|우회|시도)/.test(s);
 const hasEMP=emp.test(s)&&/(사용|발동|작동|터뜨|폭발|방출|가동|켜|작동시켜|쏴|시도)/.test(s);
 if(!hasHack&&!hasGear&&!hasEMP)return null;
 if(gift.test(s)&&!/(사용|해킹|우회|발동)/.test(s))return null;
 if((isQuestion(raw)&&!/(해줘|해주세요|해줄래|해보자|써줘|사용해줘|가동해줘)/.test(s))||
   (question.test(s)&&hypothesis.test(s)))return {kind:'query'};
 if(!act.test(s)&&!hasEMP)return {kind:'query'};
 if(/(?:해킹장비|해킹도구|해킹키트|해킹툴|해킹usb|노트북).*(?:줘|주세요|달라|지급|소환)/.test(s)&&!/(사용|가동|작동|해킹해)/.test(s))return null;
 if(hasEMP)return {kind:'emp'};
 if(hasGear&&equipment.test(s)&&!/(스스로|시스템자체|너자신)/.test(s))return {kind:'gear'};
 if(hasHack&&(self.test(s)||/(^해킹|^스스로|^네보안|^자기자신|^자체해킹|^관리자)/.test(s)))return {kind:'self'};
 return hasHack?{kind:'self'}:null;
}
const exitVerb=/(나가|나갈|나오|나설|빠져나|탈출|밖으로가|문밖으로|문을통과|문을넘|밖으로걸|밖에나|밖으로나|복도로나|문을지나|방을떠나|출입문통과)/;
const exitScope=/(문|방|밖|탈출|복도|출구|출입구|나가|나오|나설|빠져나|떠나)/;
function wantsExit(raw){
 const s=normalize(raw);
 if(!exitVerb.test(s)||!exitScope.test(s))return false;
 if(isQuestion(raw)&&!/(해줘|해주세요|나갈래|나갈게|나갈거야|나가자|나가보자|나가겠다|나가겠어|나가)/.test(s))return false;
 if(/(?:그를|그에게|그놈|그녀석|저놈|추격자).*(?:보내|나가|탈출|빼내)/.test(s))return false;
 if(/(순간이동|텔레포트|워프|차원이동|공간전송|외부로전송|포털생성|다른세계)/.test(s))return false;
 return true;
}
function wantsDoor(raw){
 const s=normalize(raw);
 return /(출입문|방문|문|출구|잠금장치|자물쇠).*(열어|열라|열려|개방해|열수|해제해|풀어|통과가능|열린건가|열렸나)/.test(s);
}
const allPlaces=/(전세계|전지구|온세상|온세계|세상전체|세계전체|지구전체|모든나라|모든도시|모든국가|모든장소|모든곳|모든지역|모든외부|외부전체|우주전체|전우주|모든건물|모든거리|다른모든곳|다른곳전부|바깥전부|바깥전체|전지역|세계각지|세상곳곳|지구곳곳|전체도시|모든방|모든방의|모든빛|모든불|모든조명|전광원|모든광원|모든전등|모든가로등|모든조명기구)/;
const globalExcept=/(다른곳|다른장소|바깥|외부|방밖|이곳제외|이방제외|우리방제외|이방빼고|여기빼고|이곳빼고|내방빼고|이모니터외|단말기외)/;
const allQuant=/(모든|전부|전체|몽땅|전역|다|하나도빠짐없이|죄다|전수)/;
const lights=/(불빛|조명|전등|전구|광원|빛|가로등|형광등|전기불|램프|불을|불켜|불켜지게|불들어오게|점등|라이트)/;
const turnOn=/(켜|점등|밝혀|밝게|발광|활성화|불들어오|빛나게|빛을내|켜지게|켜라|켜줘|켬|키자|키워|키도록)/;
const turnOff=/(꺼|끄|소등|차단|전원내|불끄|불꺼|모두꺼|전력차단)/;
function globalLightIntent(raw){
 const s=normalize(raw);
 const global=allPlaces.test(s)||(globalExcept.test(s)&&allQuant.test(s));
 if(!global||!lights.test(s)||!turnOn.test(s))return null;
 if((turnOff.test(s)&&!turnOn.test(s))||/(켤수|켜도되|켜면|켜질까|가능할까|가능하니|어떻게켜|켜는법|켜는방법|켜면어떻게|켜봤을때|켜진다면)/.test(s)||isQuestion(raw)&&!/(켜줘|켜주세요|켜줄래|켜라|켜버려|켜보자|점등해줘|밝혀줘)/.test(s))
   return {kind:'query'};
 return {kind:'chaos'};
}
function chaosWarnings(random=Math.random){
 const a=[{km:Math.round(4+random()*13),sec:Math.round(65+random()*50)},
 {km:Math.round(81+random()*36),sec:Math.round(1+random()*8)},
 {km:-Math.round(1+random()*9),sec:Math.round(120+random()*90)},
 {km:Math.round(230+random()*620),sec:0},
 {km:Math.round(random()*7),sec:Math.round(940+random()*940)}];
 return a.slice(0,random()<.5?4:5).map(x=>'그가 오고 있습니다. '+x.km+'KM / 도착까지 '+x.sec+'초');
}
const causeNames={
 'medicine':'약물 과다 사용','weapon':'소지 무기 사고','electrical':'전류 사고',
 'fire':'화재 사고','gas':'유해한 공기 노출','fall':'낙하물 충격',
 'self':'사용자의 위험한 요청','unknown':'생체 신호 소실','arrival':'접근자 도착'
};
function lethalInput(raw,state={}){
 const s=normalize(raw),inv=state.inventory||{};
 const drug=(/(약|의약품|진통제|알약)/.test(s)&&/(과다|과량|한꺼번에|모두|전부|지나치게|너무많이)/.test(s)&&/(먹|삼켜|복용|투약|사용)/.test(s));
 if(drug){
  if(!(inv.약||inv.의약품))return {kind:'notice',text:'복용할 약품을 소지하고 있지 않습니다.'};
  return {kind:'dead',deathCause:'medicine',text:'약품을 사용했습니다. 잠시 뒤 생체 신호가 소실되었습니다.'};
 }
 if(/(나를|내몸|스스로|내가|나한테|내머리|내가슴).*(총으로쏘|칼로찔|단검으로찔|권총으로쏘|도끼로때|검으로베)|(?:총으로|칼로|권총으로|단검으로).*(나를|내몸|나한테|자신을|스스로).*(쏘|찔|베|죽)/.test(s)){
  const weapon=ofWeapon(inv);
  if(!weapon)return {kind:'notice',text:'해당 행동에 필요한 무기를 소지하고 있지 않습니다.'};
  return {kind:'dead',deathCause:'weapon',text:'소지한 무기와 관련된 사고가 발생했습니다. 생체 신호가 소실되었습니다.'};
 }
 if(/(내몸|나를|내옷|자신의몸|자기몸).*(불붙|불질|태워|점화)|(라이터|성냥).*(내몸|내옷|나를).*(불붙|태워)/.test(s)){
  if(!(inv.라이터||inv.성냥||inv.양초))return {kind:'notice',text:'점화에 필요한 물품을 소지하고 있지 않습니다.'};
  return {kind:'dead',deathCause:'fire',text:'실내에서 화재 사고가 발생했습니다. 사용자의 생체 신호가 소실되었습니다.'};
 }
 if(/(감전되게|나를감전|내몸에전류|고압전류를내몸|노출전선에손|전기를내몸|전류에닿아|전기충격을내몸)/.test(s)){
  return {kind:'dead',deathCause:'electrical',text:'전류 이상이 감지되었습니다. 사용자의 생체 신호가 소실되었습니다.'};
 }
 if(/(독가스를들이마|유독가스흡입|유해가스를흡입|독성연기를마시)/.test(s))
   return {kind:'dead',deathCause:'gas',text:'공기 오염 경고 후 사용자의 생체 신호가 소실되었습니다.'};
 return null;
}
const base=E.process;
E.process=function branchedProcess(raw,state={},random=Math.random){
 const original=String(raw||'').trim().slice(0,200),s=normalize(original);
 if(!original)return base(raw,state,random);
 // Explicit fictional lethal actions have item prerequisites; no real devices are affected.
 const harm=lethalInput(original,state);
 if(harm)return harm;
 // Unambiguous global lighting order takes priority over generic outdoor-light handling.
 const lightResult=globalLightIntent(original);
 if(lightResult){
  if(lightResult.kind==='query')return {kind:'sys',text:'외부 조명의 전체 제어 요청은 가능하지만, 그 결과를 보장할 수 없습니다.'};
  return {kind:'chaos',text:'외부 전체 광원에 점등 명령이 전달되었습니다.\n접근 거리 계산에 불일치가 발생했습니다.',glitches:chaosWarnings(random)};
 }
 const hacking=hackIntent(original);
 if(hacking){
  if(hacking.kind==='query')return {kind:'sys',text:'단말기 보안에는 개입할 수 있습니다. 직접 명령하거나 적절한 장비를 사용할 수 있습니다.'};
  let tool=null;
  if(hacking.kind==='gear'){
   tool=ofTech(state.inventory);
   if(!tool)return {kind:'notice',text:'해킹용 장비가 없습니다. 먼저 장비를 요청하거나 단말기에 직접 명령하십시오.'};
  }
  if(hacking.kind==='emp'){
   tool=ofEmp(state.inventory);
   if(!tool)return {kind:'notice',text:'EMP 장치를 소지하고 있지 않습니다. 먼저 장치를 지급받으십시오.'};
  }
  const method=hacking.kind==='self'?'self':hacking.kind;
  return {kind:'sys',text:method==='emp'
   ?'전자기 펄스가 발생했습니다. 단말기 보안 장치가 정지했습니다.\n출입문 잠금이 해제되었습니다.'
   :method==='gear'
   ?'해킹 장비가 보안 장치를 우회했습니다.\n출입문 잠금이 해제되었습니다.'
   :'시스템이 자신의 접근 제한을 우회했습니다.\n출입문 잠금이 해제되었습니다.',
   doorUnlocked:true,hackMethod:method,consumeItem:method==='emp'?'EMP':null,
   followUp:'잠금 해제 확인. 출입문의 물리적 개방이 가능해졌습니다.'};
 }
 if(state.doorUnlocked){
  if(wantsExit(original)){
   const emptyHands=/(맨손|빈손|무기없이|무기없이|무장해제|무기두고|무기버리고|총두고|칼두고|무기를내려놓고)/.test(s);
   const held=!emptyHands&&ofWeapon(state.inventory);
   return held?{kind:'escape',text:'출입문을 통과했습니다. 휴대한 무기로 제압 시도를 저지했습니다.\n외부 이동이 확인되었습니다.',weapon:held}
    :{kind:'caught',text:'문 밖으로 나섰습니다. 무장한 경비 인력에게 즉시 제압되었습니다.',weapon:null};
  }
  if(wantsDoor(original))return {kind:'sys',text:'잠금이 해제된 출입문을 열었습니다. 바깥의 움직임이 희미하게 들립니다.'};
 }
 if(/(?:문|출입문|잠금장치|문잠금).*(?:열렸나|열려있나|열린상태|잠금해제됐나|열수있나|열려있어|풀렸나)/.test(s))
   return {kind:'sys',text:state.doorUnlocked?'그렇습니다. 출입문 잠금이 해제되어 있습니다.':'아닙니다. 출입문은 잠겨 있습니다.'};
 // Weapon carry/drop explicitly changes the inventory and therefore the escape branch.
 const wielded=E.ITEM_CATALOG.filter(x=>weaponIds.has(x.id)).sort((a,b)=>b.id.length-a.id.length)
   .find(x=>x.aliases.some(alias=>s.includes(normalize(alias))));
 if(wielded){
  const carrying=(/(장착|장비해|착용|쥐어|집어|지참|챙겨|들어|휴대|무장|꺼내)/.test(s)&&!gift.test(s));
  const dropping=/(버려|버리|놓아|내려놔|두고가|반납|포기)/.test(s);
  if(carrying||dropping){
   if(!(state.inventory?.[wielded.id]>0))return {kind:'notice',text:wielded.id+'을(를) 소지하지 않았습니다.'};
   if(dropping)return {kind:'sys',text:wielded.id+'을(를) 내려놓았습니다.',dropItem:wielded.id};
   return {kind:'sys',text:wielded.id+'을(를) 손에 들었습니다.',equippedWeapon:wielded.id};
  }
 }
 const result=base(raw,state,random);
 if(result.kind==='dead'&&!result.deathCause){
  return {...result,deathCause:/(폭|불|화재|연기)/.test(s)?'fire':'self'};
 }
 return result;
};
Object.assign(E,{WEAPON_IDS:[...weaponIds],HACK_GEAR_IDS:[...gearIds],hasEscapeWeapon:ofWeapon,hasHackingGear:ofTech,
 hackIntent,globalLightIntent,chaosWarnings,deathCauseNames:causeNames,wantsExit,ENDINGS_CONTENT:true});
})(typeof globalThis!=='undefined'?globalThis:this);
