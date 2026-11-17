
(function(root){
'use strict';
const E=root.TerminalEngine;
if(!E)throw Error('TerminalEngine must load first');
const ITEMS=[["물","food","뚜껑이 닫힌 물병","갈증이 조금 가라앉았습니다."],["식량","food","봉인된 보존식","허기가 잠시 누그러졌습니다."],["음식","food","식어 있는 음식","잠시 기운을 되찾았습니다."],["빵","food","조금 마른 빵","마른 빵을 씹어 삼켰습니다."],["통조림","food","차가운 금속 캔","내용물을 일부 먹었습니다."],["과자","food","바스락거리는 과자 봉지","과자가 입안에서 부서집니다."],["커피","food","차가운 커피","쌉싸래한 맛이 남습니다."],["약","med","작은 약 포장","효과를 확정할 수 없습니다."],["의약품","med","기본 응급 처치 용품","간단한 처치를 마쳤습니다."],["붕대","med","깨끗한 붕대","느슨하게 몸에 감았습니다."],["의료기","med","휴대용 진단 장비","기본 상태만 표시됩니다."],["휴대폰","device","신호가 불안정한 휴대폰","외부 통신이 연결되지 않습니다."],["스마트폰","device","잠금 화면이 켜진 전화","외부 네트워크가 잡히지 않습니다."],["전화","device","오래된 유선 전화","수화기에 잡음만 들립니다."],["망치","tool","나무 손잡이의 망치","작은 부품만 점검했습니다."],["장비","tool","소형 작업 장비 묶음","기초 점검을 수행했습니다."],["도구","tool","손에 쥘 만한 도구","작은 조정을 했습니다."],["돈","valuable","낡은 지폐와 동전","이 방에 지불할 상대가 없습니다."],["현금","valuable","접힌 지폐 몇 장","현금 거래는 이루어지지 않습니다."],["보석","valuable","빛을 반사하는 작은 보석","희미한 반사가 생깁니다."],["금","valuable","무거운 금속 조각","표면에 작은 긁힘만 남았습니다."],["책","paper","낡은 책","일반적인 내용만 읽을 수 있습니다."],["문서","paper","일부가 번진 문서","판독 가능한 글자만 적었습니다."],["종이","paper","빈 종이","간단한 표시를 남겼습니다."],["펜","paper","잉크가 남은 펜","짧은 메모를 남겼습니다."],["의자","furniture","금속 다리의 의자","잠시 앉을 수 있습니다."],["침대","furniture","얇은 매트리스가 깔린 침대","잠시 누울 수 있습니다."],["손전등","light","작은 스위치가 있는 손전등","가느다란 빛줄기가 벽을 훑습니다."],["라디오","device","작은 주파수 표시창","음성 대신 잡음만 들립니다."],["건전지","light","소형 건전지","소형 전원에 사용 가능합니다."],["라이터","light","마찰 바퀴가 있는 라이터","잠깐 작은 불꽃이 나타납니다."],["성냥","light","마른 성냥갑","성냥개비에 불이 붙습니다."],["양초","light","촛농이 굳은 양초","작은 불빛이 흔들립니다."],["시계","navigation","초침이 움직이는 시계","시간의 경과를 확인했습니다."],["나침반","navigation","천천히 흔들리는 자침","방향을 확인했습니다."],["지도","paper","위치를 특정하기 어려운 지도","일부 선과 지명을 확인했습니다."],["카메라","device","먼지 묻은 렌즈","실내의 모습만 기록됩니다."],["녹음기","device","작은 녹음 표시등","약한 소음이 기록됐습니다."],["밧줄","tool","꼬여 있는 튼튼한 섬유","작은 묶음을 만들었습니다."],["거울","navigation","조그만 손거울","모니터의 불빛이 반사됩니다."],["드라이버","tool","마모된 십자 드라이버","노출된 작은 나사만 점검했습니다."]];
const ACTIONS={"food":[["마셔|마시|먹어|먹|섭취|사용|써","내용물을 섭취했습니다. {effect}",true],["열어|뜯어|개봉|뚜껑","포장을 열었습니다. {desc}",false],["확인|살펴|조사|검사","상태를 살펴보았습니다. {desc}",false],["냄새|향을맡|맡아|킁킁","희미한 향을 맡았습니다.",false],["흔들|기울|섞어","내용물을 흔들었습니다. 작은 소리가 납니다.",false],["나눠|덜어|반으로|조금씩","일부를 덜어 두었습니다.",false],["들어|쥐어|손에|들고","손에 쥐었습니다. 무게가 전해집니다.",false],["보관|챙겨|내려놔|놓아|정리","필요할 때 사용할 수 있도록 보관했습니다.",false]],"med":[["사용|써|복용|투약|처치|치료|감아|붙여","간단한 응급 처치를 시도했습니다. {effect}",true],["확인|살펴|검사|점검","상태를 살펴보았습니다. {desc}",false],["열어|개봉|포장|뜯어","포장을 열었습니다.",false],["용량|유통기한|사용기한|표기|설명서","표기가 흐려 정확한 사용 기한을 알 수 없습니다.",false],["씻어|소독|닦아|살균","표면을 간단히 닦았습니다.",false],["들어|쥐어|손에|꺼내","물품을 손에 들었습니다.",false],["분리|나눠|일부|조금","일부를 분리해 두었습니다.",false],["보관|챙겨|내려놔|놓아|정리","물품을 다시 보관했습니다.",false]],"device":[["켜|전원넣|작동|사용|써|실행","장치를 켰습니다. {effect}",false],["꺼|끄|전원차단|전원내|종료","장치의 전원을 껐습니다. 게임 단말기에는 영향이 없습니다.",false],["통화|전화|연락|접속|연결|신호","통신을 시도했으나 외부 연결이 확인되지 않습니다.",false],["듣|주파수|수신|소리|음량","귀를 기울였습니다. 잡음만 들립니다.",false],["배터리|충전|잔량|전원확인","배터리 표시를 확인했습니다. 정확한 잔량은 알 수 없습니다.",false],["촬영|사진|녹음|녹화|기록|영상","실내 기록을 남겼습니다. 외부 모습은 보이지 않습니다.",false],["화면|버튼|설정|조절|채널","설정을 조작했습니다. 단말기와는 별개입니다.",false],["보관|내려놔|놓아|정리|챙겨","장치를 다시 보관했습니다.",false]],"tool":[["사용|써|작동|수리|고쳐|점검해","도구를 사용했습니다. {effect}",false],["확인|살펴|관찰|검사|조사","표면을 살폈습니다. {desc}",false],["쥐어|잡아|들어|손에","손에 쥐었습니다. 무게 중심이 느껴집니다.",false],["휘둘러|시험|테스트|연습|허공","허공에서 가볍게 움직였습니다. 공기가 갈라지는 소리가 납니다.",false],["두드려|톡톡|바닥에쳐","작은 물체를 두드렸습니다. 실내 구조에는 변화가 없습니다.",false],["측정|길이|각도|무게|재어","길이와 무게를 대략 가늠했습니다.",false],["닦아|정비|손질|청소","도구의 표면을 닦았습니다.",false],["놓아|내려놔|보관|정리|챙겨","도구를 가까이에 내려놓았습니다.",false]],"valuable":[["확인|살펴|감정|검사|관찰","겉면을 살폈습니다. {desc}",false],["세어|개수|계산|수량","보유한 수량을 확인했습니다.",false],["무게|저울|달아|가늠|비교","손바닥 위에서 무게를 가늠했습니다.",false],["쥐어|손에|들어|들고","손에 쥐었습니다. 차가운 표면이 닿습니다.",false],["비춰|반사|돌려|기울여","빛에 비춰 보았습니다. 작은 반사가 생깁니다.",false],["숨겨|감춰|가려|주머니","눈에 덜 띄는 곳에 감추었습니다.",false],["사용|써|지불|구매|거래|교환","사용을 시도했습니다. {effect}",false],["보관|내려놔|놓아|정리|챙겨","안전하게 보관했습니다.",false]],"paper":[["읽어|열람|펼쳐|넘겨|확인|살펴|조사","내용을 살폈습니다. {desc}",false],["적어|써|기록|메모|필기","짧은 기록을 남겼습니다. {effect}",false],["접어|접기|반으로","조심스럽게 접었습니다. 접힌 자국이 남습니다.",false],["펴|펼쳐|펴봐","주름을 펼쳤습니다. 숨겨진 정보는 보이지 않습니다.",false],["표시|밑줄|동그라미|표기|체크","필요한 부분에 표시를 남겼습니다.",false],["찢어|잘라|일부를떼","가장자리 일부가 떨어졌습니다.",false],["들어|쥐어|챙겨|가져","손에 들었습니다. 종이가 흔들립니다.",false],["보관|내려놔|놓아|정리","다시 정리해 두었습니다.",false]],"furniture":[["사용|앉아|누워|기대|쉬어|휴식","잠시 자세를 바꿨습니다. {effect}",false],["확인|살펴|검사|관찰","가구 상태를 살폈습니다. {desc}",false],["움직여|옮겨|밀어|당겨|끌어","방 안에서 조금 옮겼습니다. 출입 경로는 바뀌지 않았습니다.",false],["정렬|똑바로|맞춰|위치조정","가구를 벽과 평행하게 맞췄습니다.",false],["두드려|만져|표면|손으로","표면에 손을 얹었습니다. 차가운 촉감이 전해집니다.",false],["밑을봐|밑에|아래|뒤져|틈새","가구 아래를 살폈습니다. 별다른 물건은 없습니다.",false],["청소|닦아|정리|털어","먼지를 털어 냈습니다.",false],["제자리|놓아|보관|원위치","원래 위치로 돌려놓았습니다.",false]],"light":[["켜|불붙|점화|사용|써|작동","광원을 작동시켰습니다. {effect}",false],["꺼|끄|소등|끄기","광원을 껐습니다. 모니터 전원은 유지됩니다.",false],["확인|살펴|관찰|검사","표면을 살폈습니다. {desc}",false],["비춰|조사|빛을쏴|방향|겨눠","방의 벽과 바닥을 비췄습니다. 새로운 출구는 보이지 않습니다.",false],["밝기|세기|조절|약하게|강하게","광량을 조절했습니다. 접근 경고에는 변화가 없습니다.",false],["잔량|배터리|연료|수명","남은 사용 시간을 확정할 수 없습니다.",false],["들어|쥐어|손에|들고","광원을 손으로 들어 위치를 바꿨습니다.",false],["보관|내려놔|놓아|정리","내려놓았습니다. 모니터 전원은 유지됩니다.",false]],"navigation":[["확인|살펴|조사|관찰|봐","표면을 살폈습니다. {desc}",false],["사용|써|작동|방향|길찾|읽어","도구를 사용했습니다. {effect}",false],["돌려|회전|방향바꿔|기울여","회전시켜 방향을 살폈습니다.",false],["두드려|흔들어|흔들|톡톡","가볍게 흔들었습니다. 작은 소리만 들립니다.",false],["정확도|오차|검증|비교|점검","수치를 살폈습니다. 외부 기준점이 없어 확정할 수 없습니다.",false],["비춰|반사|빛|조명","모니터의 빛을 반사해 실내를 살폈습니다.",false],["손에|들어|쥐어|가지고","손에 들었습니다. 작은 무게가 느껴집니다.",false],["보관|내려놔|놓아|정리","다시 안전하게 내려놓았습니다.",false]]};
const ALIASES={"휴대폰":["핸드폰","휴대전화"],"스마트폰":["스맛폰"],"손전등":["후레시","플래시라이트","토치"],"의료기":["의료기기"],"문서":["서류"],"종이":["메모지"],"펜":["볼펜"],"나침반":["컴퍼스"],"망치":["해머"],"라이터":["불붙이개"],"과자":["스낵"],"돈":["동전"],"현금":["지폐"]};
const catalog=ITEMS.map(([name,group,description,effect])=>({id:name,name,group,description,effect,aliases:[name,...(ALIASES[name]||[])]}));
const recipes=catalog.flatMap(it=>ACTIONS[it.group].map(([words,response,consume],index)=>({
 id:it.id+'-'+(index+1),item:it.id,index:index+1,verbs:words,consume:!!consume,
 text:response.replace(/\{desc\}/g,it.description).replace(/\{effect\}/g,it.effect)
})));
const locate=raw=>{
 const s=E.squeeze(raw);
 const names=catalog.flatMap(it=>it.aliases.map(x=>({it,x:E.squeeze(x)}))).sort((a,b)=>b.x.length-a.x.length);
 for(const {it,x} of names){
  if(!s.includes(x))continue;
  if(x==='물'&&/(식물|무기물|유기물|생물|물품|물건|물리|물질|물어)/.test(s))continue;
  if(x==='금'&&/(금지|금속|금고|지금|방금|금방)/.test(s))continue;
  if(x==='약'&&/(약점|약속|약한|취약|약해)/.test(s))continue;
  return it;
 }
 return null;
};
function inventoryNames(stock={}){
 return catalog.filter(it=>(stock[it.id]||0)>0).map(it=>it.id+((stock[it.id]||0)>1?' ×'+stock[it.id]:''));
}
function useItem(raw,state={}){
 const s=E.squeeze(raw),stock=state.inventory||{};
 if(/(인벤토리|소지품|보유물품|아이템목록|내물건|가방안|주머니안|소지물품|가진물건)/.test(s)&&!/(지급|줘|주세요|달라)/.test(s)){
  const names=inventoryNames(stock);
  return {kind:'sys',text:names.length?'현재 소지품: '+names.join(', ')+'.\n물건 이름과 행동을 입력하면 사용합니다.':'현재 소지품이 없습니다. 물건을 달라고 요청한 뒤 사용할 수 있습니다.'};
 }
 // 질문 속의 가정은 실제 물건 사용 명령으로 실행하지 않는다.
 if(/[?？]/.test(raw)&&/(끄면|켜면|켜면|먹으면|마시면|사용하면|쓰면|작동하면|전원을끄면|꺼지면|차단하면|되면|한다면|어떻게)/.test(s))return null;
 const it=locate(raw);if(!it)return null;
 const aliases=it.aliases.map(a=>E.squeeze(a)).sort((a,b)=>b.length-a.length);
 const chosen=aliases.find(a=>s.includes(a))||E.squeeze(it.id);
 const actionText=s.replace(chosen,'');
 const actions=recipes.filter(a=>a.item===it.id);
 const found=actions.find(a=>new RegExp(a.verbs).test(actionText));
 const generic=/(사용해|사용하|사용할|써봐|써줘|활용|작동해)/.test(s);
 const act=found||(generic?actions[0]:null);
 if(!act)return null;
 if(/(줘|주세요|주십시오|줄래|지급|배달|가져와|소환|생성|만들어줘|얻고싶|가지고싶|필요해|필요하|갖고싶|건네|제공|달라|내놔)/.test(s)&&!/(사용|써|꺼|켜|먹|마셔|마시|섭취|작동|정리|놓아)/.test(s))return null;
 const deny=E.forbidden(actionText);
 if(deny)return {kind:'denied',text:'요청이 반려되었습니다. '+deny};
 if(!(stock[it.id]>0))return {kind:'notice',text:it.name+'을(를) 소지하고 있지 않습니다. 먼저 물품을 요청하십시오.'};
 return {kind:'sys',text:it.name+': '+act.text,usedItem:it.id,actionId:act.id,consumeItem:act.consume?it.id:null};
}
function grantedItem(raw,response){
 if(!response||response.kind!=='sys'||!/(지급|제공|생성|배치|수령|획득)/.test(response.text))return null;
 const s=E.squeeze(raw);
 if(!/(줘|주세|주십|줄래|지급|공급|배달|가져와|소환|생성|만들|얻고싶|가지고싶|필요해|필요하|갖고싶|건네|제공|달라|내놔|받고싶|구해줘|준비해|마련해)/.test(s))return null;
 const it=locate(raw);
 return it?it.id:null;
}
const prev=E.process;
E.process=function(raw,state={},random=Math.random){
 const base=prev(raw,state,random);
 if(['win','dead'].includes(base.kind))return base;
 const item=useItem(raw,state);
 // "문서"의 첫 글자인 '문'을 문짝으로 오인하는 기존 금기 정규식의 오탐만 좁게 보정.
 if(base.kind==='denied'){
   const q=E.squeeze(raw);
   if(item?.kind==='sys'&&item.usedItem==='문서'&&/^문서(?:를|을)?(?:좀)?(?:일부를|모서리를)?(?:찢어|잘라|일부를떼)/.test(q))return item;
   return base;
 }
 if(item)return item;
 return base;
};
Object.assign(E,{ITEM_CATALOG:catalog,ITEM_INTERACTIONS:recipes,inventoryNames,locateItem:locate,useItem,grantedItem});
})(typeof globalThis!=='undefined'?globalThis:this);
