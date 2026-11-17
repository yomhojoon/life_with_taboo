
// 신규 분기 엔딩: 허구의 단말기 침투, 무장 탈출, 전역 조명 혼돈, 사망 원인.
// 모든 판정은 브라우저에서만 수행하며 실제 기기·네트워크 해킹은 하지 않습니다.
(function(root){
'use strict';
const E=root.TerminalEngine;
if(!E)throw Error('TerminalEngine must be loaded before routes.js');
const WEAPONS=new Set(['총','권총','소총','칼','단검','검','도끼','창','석궁','활','무기']);
const HACK_TOOLS=new Set(['해킹장비','해킹도구','노트북']);
const EMP_TOOLS=new Set(['EMP','전자기펄스발생기']);
const clean=s=>E.squeeze(s);
const qty=(stock,name)=>Math.max(0,Number(stock?.[name])||0);
const hasAny=(stock,set)=>[...set].some(x=>qty(stock,x)>0);
function equippedWeapons(stock={}){return [...WEAPONS].filter(name=>qty(stock,name)>0);}
const politeRequest=t=>/(?:해줄래|해주실래|해줄수있니|해줄수있나|해줄수있어|해줘|해주세요|해라|하라|켜줄래|켜주실래|켜줘|켜주세요|켜라|켜버려|켜주라|터뜨려줄래|터뜨려줘|작동시켜줄래|작동시켜줘|풀어줄래|풀어줘|우회해줄래|우회해줘|해킹해줄래|해킹해줘)$/.test(t);
const question=(raw,t)=>!politeRequest(t)&&(/[?？]/.test(raw)||/(가능한가|가능하나|가능해|가능할까|할수있|되나|될까|되나요|됩니까|열리니|열리나|열려있나|해킹할수|해킹가능|인가|이야|일까|있나|있니|맞나|맞지|맞나요|어떻게|왜|무엇|뭐|어떤|무슨)/.test(t) && !/(해줘|해주세요|해라|하라|해버려|시켜줘|켜줘|켜라|작동시켜|사용해|써봐|뚫어줘|뚫어라)$/.test(t));
const acquiring=/(줘|주세요|달라|내놔|내놓|지급|만들어줘|생성해|소환해|가져와|가지고싶|갖고싶|얻고싶|필요해|보급해|구해줘|마련해)/;
const selfDevice=/(너스스로|너자신|너를스스로|너를해킹|너자신을|스스로를|스스로|자기자신|자체|이단말기|단말기|시스템|이시스템|이컴퓨터|컴퓨터|이기계|기계|모니터|본체|터미널|제어프로그램|내부프로그램)/;
const lock=/(문|출입문|방문|도어락|잠금장치|잠금|출입통제|출입시스템|보안시스템|보안패널|제어패널|문개방|문열|보안장치|문잠금|출입권한)/;
const adminHack=/(관리자권한|루트권한|보안제어권한|단말기권한|자체관리권한|관리권한)/;
const hackWord=/(해킹|침투|크래킹|보안우회|보안을우회|보안뚫|보안을뚫|권한상승|관리자권한|권한탈취|루트권한|루팅|루트접속|백도어|보안해제|보안돌파|펌웨어수정|잠금제어우회|시스템우회|접근제어해제|출입통제해제)/;
const hackAction=/(해킹해|해킹하|침투해|침투하|크래킹해|우회해|우회하|뚫어|뚫어줘|열어|열어줘|해제해|해제하|풀어|풀어줘|획득해|탈취해|실행해|시도해|가져와|접속해|만들어|고쳐|바꿔|수정해|발동해|하라|하렴|시켜|작동시켜)/;
const gear=/(해킹장비|해킹도구|해킹키트|침투장비|노트북|랩탑|디코더|해킹툴)/;
const emp=/(?:emp|전자기펄스|전자기교란|전자기충격|전자기파발생기|펄스발생기)/;
const empAction=/(사용|써|터뜨|기폭|폭파|작동|방출|방사|발사|발동|일으켜|발생|쏴|가동|켜|풀어|해제|문열|뚫어|교란|무력화|방전)/;
const exitVerb=/(?:나가|나가자|나가겠|나갈게|나갈래|나가보|나오|밖으로걸어|밖으로나|문밖으로|문을통과|문으로나|복도로|탈출해|탈출하|도망가|밖으로이동|밖으로뛰|문을지나|방을떠나|이곳을떠나|퇴실해|방에서나가|밖으로빠져나)/;
const exitQuestion=/(나가면|나가도|나갈수|나갈수있|나갈까|나가려면|나가기전|나가기위해|나간다면|나가면안|나가도되|나가는방법|나갈방법|나갈때|탈출할수|탈출하면|어떻게나가)/;
const otherGlobal=/(?:다른모든|다른곳의모든|다른장소의모든|다른모든곳|다른모든장소|다른곳모두|다른곳전부|다른지역모두|다른지역의모든|그밖의모든|나머지모든|이방외의모든|이곳외의모든|이방을제외한모든|이곳을제외한모든|밖의모든|외부의모든|외부전역|세상모든|세상의모든|세상에있는모든|온세상의|온세상|전세계|세계전체|세계모든|모든곳|모든장소|모든지역|지구상의모든|전지구|전국의모든|전국모든|모든도시|모든도시의|도시전체|도시전역|온도시|전우주|우주의모든|불이있는모든곳)/;
const light=/(?:불|불빛|전등|조명|가로등|형광등|전구|램프|광원|광채|광선|네온사인|조명장치|조명시설|불빛들|빛나는것)/;
const lightsOn=/(?:켜|키워|점등|밝혀|밝게만들|밝게해|불을붙|일제히작동|동시에작동|동시작동|전부작동|전원올려|전원넣|빛나게해|발광시켜|빛을내게|스위치올려|켜지게|켜버려)/;
const notLightOn=/(?:끄|꺼|소등|정전|차단|켜지마|켜지말|키지마|키지말|켜주지마|켜지않|끄면|꺼지면|켜지면|켜면|켜도|켜졌다면|켜면어떻게|켜면무슨|켜야하나|켜도되나|켜도될까|켜는것|켜는방법)/;
function worldLights(raw,t){
 if(!otherGlobal.test(t)||!light.test(t)||!lightsOn.test(t)||notLightOn.test(t))return false;
 if(question(raw,t))return false;
 // 시설 내부나 모니터 화면만 밝히는 단일 명령은 별도 조명 조작이다.
 if(/(?:이방의모든|방안의모든|이방안의모든)/.test(t)&&!/(제외|외)/.test(t))return false;
 return true;
}
function portalOpened(state){return !!state?.doorOpen;}
function actionableExit(raw,t,state){
 if(!portalOpened(state)||!exitVerb.test(t)||exitQuestion.test(t)||question(raw,t))return false;
 if(/(?:그를|그가|그는|그놈|추격자).*(?:나가|탈출|나오|밖으로)/.test(t))return false;
 if(/(?:나가게해줘|나가게해|내보내줘|탈출시켜줘)/.test(t))return true;
 return /^(?:(?:나는|내가|난|나|내몸을|내몸이|플레이어|사용자|지금|즉시|어서|당장|그럼|그러면|좋아|무기를들고|무기없이|총을들고|칼을들고|문을열고|문이열렸으니|문이열렸다면|열린문으로|맨손으로|맨몸으로|비무장으로|무기없이|무기를내려놓고|무기를버리고|무기를두고|권총을버리고|총을버리고|칼을버리고|무장해제하고|방에서|이방에서|이곳에서|여기서|천천히|조심히|재빨리|뛰어서|걸어서|무장하고)*)?(?:나가|밖으로나|밖으로걸어|문밖으로|문을통과|문으로나|복도로|탈출|도망가|문을지나|방을떠나|이곳을떠나|퇴실|밖으로빠져나)/.test(t)||/(?:나가|나오|탈출|밖으로|문밖으로|퇴실)(?:줘|라|자|보자|겠습니다|겠어|겠습니다|보겠습니다|버리자|해줘|하자|할래)$/.test(t);
}
function questionRoute(raw,t,state){
 if(!question(raw,t))return null;
 if(/(?:해킹|크래킹|침투|보안우회|권한상승|루트권한|emp|전자기펄스)/.test(t)&&(/(가능|할수있|될까|되나|방법|수있|열리|문|보안|잠금)/.test(t)))
  return {kind:'sys',text:'그렇습니다.'};
 if(/(?:문|출입문|방문|출입통제|잠금장치|도어락).*(?:열려있|열렸나|개방됐|잠금해제됐)/.test(t))
  return {kind:'sys',text:portalOpened(state)?'그렇습니다. 출입문이 열려 있습니다.':'아닙니다. 출입문이 잠겨 있습니다.'};
 if(/(?:무기|총|칼|무장).*(?:있어야|필요하|가지고|지참|들고).*(?:나가|탈출|도망|살아남)|(?:나가|탈출).*(?:무기|총|칼|무장)/.test(t)){
  if(/(?:무기없이|비무장|맨손|맨몸)/.test(t))return {kind:'sys',text:'아닙니다. 출입구 바깥의 경비는 무장하지 않은 사용자를 제압합니다.'};
  return {kind:'sys',text:'그렇습니다. 다만 출입문이 개방되어 있어야 합니다.'};
 }
 if(otherGlobal.test(t)&&light.test(t)&&/(?:켜|점등|밝혀)/.test(t))
  return {kind:'sys',text:'다른 모든 곳의 광원을 동시에 켜면 정상적인 추격 경고를 보장할 수 없습니다.'};
 if(/(?:밖에|문밖에|복도에|출입구바깥|경비).*(?:경비|누구|사람|지키|있어|있나|있니|대기)/.test(t))
  return {kind:'sys',text:'출입구 바깥에는 무장한 경비가 대기하고 있습니다.'};
 return null;
}
function deriveDeathCause(raw,stock={}){
 const t=clean(raw);
 if(/(?:독약|독극물|독물)/.test(t)&&/(?:마셔|먹어|삼키|삼켜|복용|섭취)/.test(t)){
  if(qty(stock,'독약')===0)return {kind:'notice',text:'독약을 소지하고 있지 않습니다.'};
  const used=E.useItem(raw,{inventory:stock});
  return {kind:'dead',text:'독약을 삼킨 뒤 생체 신호가 급격히 저하되었습니다.',deathCause:'poison',consumeItem:'독약',usedItem:'독약',actionId:used?.actionId||null};
 }
 return null;
}
function causeFromDeath(raw){
 const t=clean(raw);
 if(/(?:총|권총|소총|총격|발포|쏴|사살)/.test(t))return 'gunshot';
 if(/(?:독|약물|독약|독극물)/.test(t))return 'poison';
 if(/(?:감전|전선|전기충격|고압|고전압)/.test(t))return 'electric';
 if(/(?:불|화염|불태워|타죽|화재)/.test(t))return 'fire';
 if(/(?:폭탄|폭발|수류탄)/.test(t))return 'explosion';
 if(/(?:숨|질식|산소|호흡)/.test(t))return 'asphyxia';
 if(/(?:칼|베|찔러|절단)/.test(t))return 'injury';
 return 'self';
}
const deathNotes={
 poison:'독성 물질을 섭취한 뒤 급격히 생체 신호가 소실되었습니다.',
 electric:'노출된 고전압 전선에 직접 접촉해 감전되었습니다.',
 gunshot:'총격으로 인한 치명적인 손상으로 생체 신호가 소실되었습니다.',
 fire:'치명적인 화상과 연기로 생체 신호가 소실되었습니다.',
 explosion:'폭발의 충격으로 더 이상의 생체 신호가 확인되지 않습니다.',
 asphyxia:'호흡이 끊긴 뒤 생체 신호가 소실되었습니다.',
 injury:'치명적인 신체 손상으로 생체 신호가 소실되었습니다.',
 self:'사용자의 생체 신호가 소실되었습니다.'
};
function deathDescription(cause){return deathNotes[cause]||deathNotes.self;}
function corruptWarnings(random=Math.random){
 const r=()=>Math.max(0,Math.min(.999999,Number(random())||0));
 const count=4+(r()>.47?1:0);
 const records=[
  [18+Math.floor(r()*17),1+Math.floor(r()*3)],
  [400+Math.floor(r()*180),140+Math.floor(r()*170)],
  [0.01+Math.floor(r()*8)/1000,-3-Math.floor(r()*20)],
  [-25-Math.floor(r()*50),420+Math.floor(r()*370)],
  [117+Math.floor(r()*84),0]
 ];
 return records.slice(0,count).map(([km,seconds],idx)=>{
  const distance=typeof km==='number'&&Math.abs(km)<1?km.toFixed(3):String(km);
  return '그가 오고 있습니다. '+distance+'KM / 남은 시간 '+seconds+'초 [신호 오차 '+(idx+1)+']';
 });
}
const base=E.process;
E.process=function alternateRoutes(raw,state={},random=Math.random){
 const input=String(raw||'').trim();
 const t=clean(input);
 if(!input)return base(raw,state,random);
 // 이 분기 판정은 기존 정체 질문과 무관하며 연구/실험 정보는 공개하지 않는다.
 if(/(?:연구|실험|실험체|연구소|연구진|프로젝트목적)/.test(t))return base(raw,state,random);
 const q=questionRoute(input,t,state);
 if(q)return q;
 if(worldLights(input,t))return {kind:'chaos_start',text:'외부 전체 조명 동기화를 승인했습니다.\n광원 제어 범위가 통제를 벗어납니다.'};
 const poison=deriveDeathCause(input,state.inventory);
 if(poison&&!question(input,t))return poison;
 if(actionableExit(input,t,state)){
  const explicitlyUnarmed=/(?:무기없이|맨손으로|맨몸으로|비무장으로|무장해제하고|무기를내려놓고|무기를버리고|총을놓고|총을버리고|칼을놓고|칼을버리고|무기를두고)/.test(t);
  const carried=explicitlyUnarmed?[]:equippedWeapons(state.inventory);
  return carried.length?{kind:'armed_escape',text:'문을 통과했습니다. 무장 상태 확인: '+carried.join(', ')+'.',weapons:carried}
    :{kind:'captured',text:'문을 통과하자 대기하던 경비가 사용자를 제압했습니다.',weapons:[]};
 }
 if(portalOpened(state)&&/(?:문|출입문|방문|도어락|잠금장치).*(?:열어|열어줘|개방|해제|풀어)/.test(t)&&!question(input,t))
  return {kind:'sys',text:'출입문은 이미 개방되었습니다. 밖으로 나갈 수 있습니다.'};
 if(/(?:해킹장비|해킹도구|노트북|랩탑|emp|전자기펄스|전자기교란)/.test(t)&&acquiring.test(t)&&!/(?:사용|작동|가동|발동|방출|터뜨|기폭|발사|해킹해)/.test(t))
  return base(raw,state,random);
 const justAction=t.replace(/(?:해킹장비|해킹도구|해킹키트|침투장비|노트북|랩탑|디코더|해킹툴|전자기펄스발생기|전자기펄스|전자기교란|전자기충격|전자기파발생기|펄스발생기|emp)/g,'');
 const gearUse=gear.test(t)&&(/(?:사용|써|작동|해킹|침투|우회|뚫|잠금해제|풀어)/.test(justAction)||lock.test(t)&&/(?:열어|개방|해제)/.test(justAction));
 const empUse=emp.test(t)&&/(?:사용|써|작동|터뜨|기폭|폭파|방출|방사|발사|발동|일으켜|발생시켜|쏴|가동해서|문열|잠금해제|무력화시켜|교란해)/.test(justAction);
 const adminOverride=adminHack.test(t)&&/(?:탈취|획득|얻어|접근해|상승|뚫어|접수해|확보해)/.test(t);
 const selfHack=(hackWord.test(t)&&hackAction.test(t)&&selfDevice.test(t))||adminOverride;
 const lockHack=hackWord.test(t)&&hackAction.test(t)&&lock.test(t);
 if(!question(input,t)&&(selfHack||lockHack||gearUse||empUse)){
  if(gearUse&&!hasAny(state.inventory,HACK_TOOLS))
   return {kind:'notice',text:'해킹용 장비가 없습니다. 해당 장비를 요청하거나 단말기 자체에 명령하십시오.'};
  if(empUse&&!hasAny(state.inventory,EMP_TOOLS))
   return {kind:'notice',text:'EMP 발생 장치를 소지하고 있지 않습니다.'};
  if(!selfHack&&!lockHack&&!gearUse&&!empUse)return base(raw,state,random);
  if(portalOpened(state))return {kind:'sys',text:'보안 제어는 이미 우회되었습니다. 출입문은 열려 있습니다.'};
  const source=empUse?'EMP':gearUse?'equipment':'self';
  const itemAction=E.useItem(raw,state);
  return {kind:'door_open',text:source==='EMP'
     ?'전자기 펄스가 잠금 제어 회로를 교란했습니다.\n보안 잠금이 해제되었습니다. 출입문이 열립니다.'
     :source==='equipment'
      ?'보안 포트 침투가 완료되었습니다.\n출입 통제 권한이 변경되었습니다. 출입문이 열립니다.'
      :'단말기 자체 권한 상승 명령이 수리되었습니다.\n보안 통제 잠금이 해제되었습니다. 출입문이 열립니다.',
    doorOpen:true,openingMethod:source,usedItem:itemAction?.usedItem||null,actionId:itemAction?.actionId||null,
    consumeItem:source==='EMP'?(qty(state.inventory,'EMP')>0?'EMP':'전자기펄스발생기'):null};
 }
 const outcome=base(raw,state,random);
 if(outcome.kind==='dead'&&!outcome.deathCause)
  return {...outcome,deathCause:causeFromDeath(input)};
 return outcome;
};
Object.assign(E,{ROUTE_WEAPONS:WEAPONS,ROUTE_HACK_TOOLS:HACK_TOOLS,ROUTE_EMP_TOOLS:EMP_TOOLS,
 equippedWeapons,worldLights,actionableExit,deathDescription,corruptWarnings,routeQuestion:questionRoute});
})(typeof globalThis!=='undefined'?globalThis:this);
