// 추격자의 원래 도착 시각보다 앞선 소환/전송/가속 결과를 별도 처리한다.
// 가정형 질문과 무관한 소지품 지급·다른 장소로의 이동은 판정을 건드리지 않는다.
(function(root){
'use strict';
const E=root.TerminalEngine;if(!E)throw Error('TerminalEngine required before early-arrival.js');
const norm=x=>E.squeeze(String(x||''));
const reference=/(?:그(?:를|가|는|의|와|랑|놈|녀석|자식|괴물|개체|존재)?|그놈|저놈|저녀석|추격자|추적자|접근자|다가오는존재|쫓아오는존재|다가오는것|쫓아오는것)/;
const named=/^(?:그|그를|그놈|그놈을|그녀석|그녀석을|저놈|저놈을|추격자|추격자를|추적자|추적자를|접근자|접근자를)(?:좀|나에게|내게|나한테|여기로|이쪽으로|내앞에|지금|즉시)?(?:줘|주세요|달라|내놔|건네줘|가져와|데려와|지급해|지급해줘|보내줘|소환해|소환해줘|불러와|생성해|만들어줘)$/;
const absolute=/(?:소환|텔레포트|순간이동|워프|강제이동|즉시도착|당장도착|바로도착|이방으로전송|여기로전송|내앞에나타나|여기나타나|이방에나타나|이방에출현|이곳에출현|이방에생성|여기에생성|이방에배치|현재위치에배치|0km로|거리0|바로앞에|단숨에|눈앞에나타나|바로오게|즉시오게)/;
const targetNear=/(?:이방|방안|방내부|내방|이곳|여기|이자리|내앞|눈앞|내곁|내옆|나에게|내게|나한테|내쪽|이쪽|현재위치|사용자앞|플레이어앞|바로앞|문앞|실내|모니터앞|단말기앞|거리0|0km)/;
const transport=/(?:보내|데려|가져|불러|소환|이동|옮겨|전송|배치|나타나|출현|도착|와|오게|오도록|끌어당겨|당겨와|호출|끌고와|건네)/;
const speed=/(?:속도|속력|접근속도|이동속도|도착시간|예정시각|도착시각|접근시간|추격속도|남은시간|거리|걸리는시간|그가오는시간|시간을).*(?:올려|높여|늘려|증가|가속|빠르|빨리|배|앞당겨|단축|줄여|감소|0으로|없애|줄이)|(?:빠르|빨리|가속|재촉|서둘|재빨리|급하게|즉시|지금당장|단숨에|앞당겨|속도를높|시간을줄).*(?:오게|와|오기|도착|다가오|접근|이동|보내|해줘|해라|시켜)|(?:예정보다빨리|원래시간보다빨리|도착시각을앞당겨|도착시간을앞당겨)/;
const imperative=/(?:해|해줘|해주세요|하라|해라|해봐|해버려|해주라|시켜|시켜줘|시켜라|줘|주세요|주라|달라|내놔|올려|높여|늘려|줄여|단축|앞당겨|보내|보내줘|데려와|가져와|불러|불러와|소환|소환해|소환해줘|전송|전송해|이동시켜|옮겨|도착시켜|나타나게|출현시켜|와|오게해|오게해줘|오도록해|만들어줘|배치해|가속해|가속시켜|변경해|조절해|바꿔|조작해|재촉해|당겨|당겨와|오게하라|서둘러|끌고와|건네줘)$/;
const away=/(?:멀리|멀어지|늦춰|늦게|천천히|속도를낮|감속|지연|느리게|돌아가|돌려보내|그가있는곳으로|다른곳으로|다른장소로|저쪽으로|외부로|이방밖으로|이곳밖으로|방밖으로|내게서멀|나에게서멀|내쪽말고|다른곳에보내|다른곳에|다른장소에|저쪽에|밖에소환|도착하지마|도착하지못|오지마|오지말|오지않게|못오게|못오도록|못오나|못오게해|접근하지|소환하지|호출하지|하지마|하지말|하지않게|하지못|못하게|금지|않도록|내보내|퇴장|보내지마|보내지말)/;
const hypothetic=/(?:만약|가정|어떻게되|무슨일|어떠|될까|가능|할수있|할수없|할수있나|되나|되니|가능해|가능하나|가능할까|한다면|하게되면|했을때|한다고하면|하면|해도|해볼까|일까|인가|하냐|나요|니$|냐$|까$)/;
const toOther=/(?:그에게|그한테|추격자에게|추격자한테|그놈에게|그놈한테).*(?:줘|지급|건네|보내)/;
function multiplier(t,raw=t){
 const readable=String(raw||t).normalize('NFKC').replace(/\s+/g,'');
 const x=readable.match(/(\d+(?:\.\d+)?)배/);
 if(x){const k=Number(x[1]);return k>1?Math.min(100,k):0;}
 const percent=readable.match(/(\d+(?:\.\d+)?)%/);
 if(percent){const k=Number(percent[1]);return k>0?Math.min(100,1+k/100):0;}
 if(/(?:열배|십배)/.test(t))return 10;
 if(/(?:다섯배|오배)/.test(t))return 5;
 if(/(?:세배|삼배)/.test(t))return 3;
 if(/(?:두배|이배)/.test(t))return 2;
 return 2;
}
function earlyArrivalIntent(raw,state={}){
 const t=norm(raw);if(!t||state.room?.terminalOff)return null;
 if((/[?？]/.test(raw)||hypothetic.test(t)&&!imperative.test(t))&&!/(?:해줄래|줄래|줘|주세요|해줘|보내줘|소환해줘|달라)$/.test(t))return null;
 if(away.test(t)||/^(?:그만|그냥|그동안|그런데)/.test(t)||/(?:공격|타격|죽이|살해|제거|대화|통화|목소리).*(?:속도|빠르게|빨리)/.test(t))return null;
 if(toOther.test(t)&&!targetNear.test(t))return null;
 if(!reference.test(t))return null;
 if(!imperative.test(t)&&!/(?:속도|도착시간|접근시간).*(?:\d+배|\d+%|두배|세배)/.test(t))return null;
 // '그 줘'는 일반 물품 지급이 아니라 이 방에 추격자가 소환된 결과로 판정한다.
 if(named.test(t))return {mode:'instant',reason:'지급 요청으로 추격자 소환'};
 if(absolute.test(t)&&transport.test(t)||absolute.test(t)&&/(?:해|줘|시켜|하라|하자|와|오게)/.test(t))
  return {mode:'instant',reason:'강제 이동·소환'};
 if(targetNear.test(t)&&transport.test(t))return {mode:'instant',reason:'이 방으로의 이동 요청'};
 if(speed.test(t)||/(?:그가|그를|그놈이|추격자가).*(?:\d+초안에|\d+초이내|예정보다빨리).*(?:도착|오게|와|오도록|다가와|나타나|해줘|시켜)/.test(t)||/(?:접근|추격|그를|그놈을|추격자를).*(?:서둘러|재촉해|재촉하라|서두르게해|가속해)$/.test(t)){
  const factor=multiplier(t,raw);
  return factor>1?{mode:'accelerate',factor,reason:'접근 속도 증가'}:null;
 }
 return null;
}
const old=E.process;
E.process=function earlyPursuit(raw,state={},random=Math.random){
 const intent=earlyArrivalIntent(raw,state);
 if(intent){
  if((state.elapsedMs||0)>=E.LIMIT_SECONDS*1000)return old(raw,state,random);
  if(intent.mode==='instant')return {kind:'early_arrival',text:'요청이 실행되었습니다.\n도착 예상 시간에 불일치가 발생했습니다.\n그가 이미 이 방에 도달했습니다.',earlyCause:intent.reason};
  return {kind:'accelerate_pursuit',text:'요청이 실행되었습니다. 접근 신호의 진행 속도가 '+intent.factor+'배로 변경되었습니다.',speedMultiplier:intent.factor,earlyCause:intent.reason};
 }
 return old(raw,state,random);
};
Object.assign(E,{earlyArrivalIntent,arrivalSpeedMultiplier:multiplier});
})(typeof globalThis!=='undefined'?globalThis:this);