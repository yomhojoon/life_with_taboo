(function(){
'use strict';
const { Game, CONTENT:C, GRADE_PRICES, skillPrice, STAT_LABELS, moneyText }=window.YGEngine;
const game=new Game();
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const pct=x=>Math.round(x*100);
const whole=x=>Math.round(Number(x)||0).toLocaleString('ko-KR');
const actionIcons={sleep:'▤',rest:'□',work:'▣',meal:'◯',research:'⌕',ritual:'✳',walk:'↟',purify:'◇'};
const phaseName={planning:'일정 편성',running:'하루 진행',night:'심야 상점',dead:'사망'};
const statCfg=[
  ['money','자금','₩','원','#fff'],['health','건강','♡','','#fff'],
  ['mental','정신력','◉','','#fff'],['spirit','신기','✳','','#fff'],
  ['luck','행운','✦','','#fff'],['clues','강령 단서','⌕','','#fff']
];
let tab='skills',autoMode=false,autoTimer=null,queueTarget=null,lastModalKey='',toastTimeout=null;

function toast(message){const e=$('toast');e.textContent=message;e.hidden=false;if(toastTimeout)clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>e.hidden=true,2800);}
function init(){
  $('mealChoice').innerHTML=C.meals.map((m,i)=>`<option value="${i}">${esc(m.name)} · ${moneyText(m.price)}원 / 체력 +${Math.round(m.health*.85)} 정신 +${Math.round(m.mental*.85)}${m.spirit?' 신기 +'+m.spirit:''}</option>`).join('');
  $('queueFillAction').innerHTML=C.actions.map(a=>`<option value="${esc(a.id)}">${esc(a.name)}</option>`).join('');
  $('queueFillAction').value='sleep';
  $('debugStat').innerHTML=Object.entries(STAT_LABELS).map(([key,label])=>`<option value="${esc(key)}">${esc(label)}</option>`).join('');
  $('debugSkill').innerHTML=C.skills.map(x=>`<option value="${esc(x.id)}">${x.grade}등급 · ${esc(x.name)}</option>`).join('');
  $('debugGhost').innerHTML=C.ghosts.map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
  $('debugEncounter').innerHTML=C.encounters.map(x=>`<option value="${esc(x.id)}">${esc(x.title)}</option>`).join('');
  $('importFile').addEventListener('change',async(e)=>{const file=e.target.files?.[0];if(!file)return;try{const ok=game.importJSON(await file.text());if(!ok)throw Error('형식이 맞지 않습니다');autoMode=false;tab='skills';render();toast('저장 데이터를 복원했습니다.');}catch(err){toast('불러오기 실패: '+err.message);}e.target.value='';});
  document.addEventListener('click',clickHandler);
  document.addEventListener('change',e=>{if(e.target.id==='mealChoice'){if(game.setMeal(Number(e.target.value))){render();toast('식사 메뉴를 변경했습니다.');}}});
  // One click adds one hour. Optional blank slot selection stays within the schedule, never attached to the cursor.
  document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.target.matches('input,select,textarea,button')||game.s.pending||!$('debugDrawer').hidden)return;const index=Number(e.key)-1;if(index>=0&&index<8&&e.key.length===1&&game.appendSchedule(C.actions[index].id,queueTarget)){queueTarget=null;render();}});
  render();
}
function haltAuto(){autoMode=false;if(autoTimer){clearTimeout(autoTimer);autoTimer=null;}}

function clickHandler(e){const b=e.target.closest('[data-cmd]');if(!b||b.disabled)return;const cmd=b.dataset.cmd,v=b.dataset.value;const s=game.s;
  switch(cmd){
    case 'queue-add':if(game.appendSchedule(v,queueTarget)){queueTarget=null;render();}else toast('24시간 일정이 가득 찼거나 현재 편집할 수 없습니다.');return;
    case 'queue-target':queueTarget=Number(v);renderSchedule();return;
    case 'queue-remove':if(game.removeSchedule(Number(v))){queueTarget=Number(v);render();}return;
    case 'clear-queue':if(game.clearSchedule()){queueTarget=null;toast('24시간 일정을 모두 비웠습니다.');}break;
    case 'fill-remaining':if(game.fillRemaining($('queueFillAction').value)){queueTarget=null;toast('모든 빈 시간에 행동을 배치했습니다.');}else toast('채울 빈 시간이 없습니다.');break;
    case 'preset':if(game.setPreset(v)){queueTarget=null;toast('일정이 '+({balanced:'균형형',safe:'생존형',risky:'강령형'}[v])+'으로 변경되었습니다.');}break;
    case 'step':haltAuto();if(s.phase==='planning'&&!game.start()){toast('24시간을 모두 편성해야 진행할 수 있습니다.');return;}game.advanceHour();break;
    case 'auto':if(autoMode){haltAuto();render();return;}if(s.phase==='planning'&&!game.start()){toast('24시간을 모두 편성해야 진행할 수 있습니다.');return;}autoMode=true;runAuto();return;
    case 'pause':haltAuto();render();return;
    case 'tab':tab=v;renderTabs();return;
    case 'release':if(game.requestRelease(v))haltAuto();else toast('지금은 해방할 수 없습니다.');break;
    case 'remove-skill':if(game.requestRemoveSkill(v))haltAuto();else toast('지금은 문자를 해제할 수 없습니다.');break;
    case 'confirm-remove-skill':game.confirmRemoveSkill(v==='yes');break;
    case 'wish':game.requestWish();break;
    case 'event-choice':game.chooseEncounter(Number(v));break;
    case 'lore-choice':game.chooseLore(Number(v));break;
    case 'skill-choice':if(!game.chooseSkill(Number(v)))toast('선택할 수 없습니다. 돈이 충분한지 확인하세요.');break;
    case 'close-notice':game.closeNotice();break;
    case 'open-shop':game.openShop();autoMode=false;break;
    case 'confirm-release':game.confirmRelease(v==='yes');break;
    case 'wish-choice':game.grantWish(Number(v));break;
    case 'new-game':if(confirm('현재의 모든 진행과 보유 효과를 삭제하고 처음부터 시작하시겠습니까?\n저장 파일을 먼저 내보내면 나중에 복원할 수 있습니다.')){game.reset();haltAuto();queueTarget=null;tab='skills';$('debugDrawer').hidden=true;toast('새로운 게임을 시작합니다.');}break;
    case 'export':downloadSave();return;
    case 'import':$('importFile').click();return;
    case 'debug':$('debugDrawer').hidden=!$('debugDrawer').hidden;renderDebug();return;
    case 'stat-plus':game.debugChange($('debugStat').value,10);break;
    case 'stat-minus':game.debugChange($('debugStat').value,-10);break;
    case 'grant-skill':if(!game.debugSkill($('debugSkill').value))toast('이미 보유 중이거나 추가할 수 없습니다.');break;
    case 'grant-ghost':if(!game.debugGhost($('debugGhost').value))toast('이미 보유 중이거나 추가할 수 없습니다.');break;
    case 'force-event':if(game.beginEncounter($('debugEncounter').value)){$('debugDrawer').hidden=true;autoMode=false;}else toast('다른 선택 창이 열린 상태에서는 사용할 수 없습니다.');break;
    case 'debug-clue':game.debugChange('clues',3);break;
    case 'debug-money':game.debugChange('money',100000);break;
    case 'debug-spirit':game.debugChange('spirit',20);break;
    case 'copy-json':copySave();return;
    case 'restart':if(confirm('처음부터 다시 시작합니까?')){game.reset();haltAuto();queueTarget=null;tab='skills';}break;
    default:return;
  }
  render();if(autoMode&&game.s.phase==='running'&&!game.s.pending)runAuto();
}
function runAuto(){
 if(!autoMode||autoTimer||game.s.phase!=='running'||game.s.pending){render();return;}
 // Real clock-like pacing: one visible hour every 720ms, pausing for each choice.
 autoTimer=setTimeout(()=>{
   autoTimer=null;if(!autoMode||game.s.phase!=='running'||game.s.pending)return;
   game.advanceHour();render();
   if(game.s.phase!=='running')haltAuto();
   else if(autoMode&&!game.s.pending)runAuto();
 },720);
 render();
}
function downloadSave(){const blob=new Blob([game.exportJSON()],{type:'application/json;charset=utf-8'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=`yeonmyeong_day${game.s.day}_save.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),500);toast('JSON 세이브 파일을 내보냈습니다.');}
async function copySave(){try{await navigator.clipboard.writeText(game.exportJSON());toast('상태 JSON을 클립보드에 복사했습니다.');}catch{toast('클립보드가 차단되어 있습니다. 저장 내보내기를 이용하세요.');}}
function render(){
  const s=game.s;
  $('dayNumber').textContent=String(s.day).padStart(2,'0');$('phaseBadge').textContent=phaseName[s.phase]||s.phase;
  $('clockLabel').textContent=`${String(s.hour).padStart(2,'0')}:00`;
  $('dayProgressLabel').textContent=`${s.hour} / 24시간 경과`;
  $('dayProgress').style.width=(s.hour/24*100)+'%';
  $('saveIndicator').innerHTML=`<span class="led ${game.storageError?'error':''}"></span>${game.storageError?'로컬 저장 불가':'로컬 자동 저장'}`;
  renderStats();renderFortunes();renderBrushes();renderSchedule();renderCounts();renderRisk();renderTabs();renderControl();renderStage();renderModal();renderDebug();
}
function renderStats(){const s=game.s;const html=statCfg.map(([key,name,icon,unit,color])=>{
  let val=s[key],critical=(key==='health'&&val<=20)||(key==='mental'&&val<=20)||(key==='spirit'&&val>=80);
  const amount=key==='money'?moneyText(val):whole(val);
  const upper=key==='mental'?s.mental_max:key==='money'?350000:key==='health'||key==='spirit'?100:key==='luck'?30:8;
  const percentage=Math.round(Math.max(0,Math.min(100,val/upper*100)));
  return `<article class="stat-card ${critical?'critical':''}"><div class="stat-head"><span>${esc(name)}</span><span class="stat-icon">${esc(icon)}</span></div><div class="stat-value">${esc(amount)}<span class="stat-suffix">${unit}</span>${key==='mental'?`<span class="stat-suffix">/ ${whole(s.mental_max)}</span>`:''}</div><div class="stat-track"><div style="width:${percentage}%;background:${color}"></div></div></article>`;}).join('');$('stats').innerHTML=html;}
function renderFortunes(){const s=game.s;const fortune=[['재물운',s.wealth],['인연운',s.bond],['영감운',s.omen]];
 $('fortuneStrip').innerHTML=`<div class="fortune-left"><span class="fortune-title">운세</span>${fortune.map(([name,value])=>`<div class="fortune-stat">${name} <strong class="${value<0?'minus':''}">${value>0?'+':''}${whole(value)}</strong></div>`).join('')}</div>`;}
function renderBrushes(){const edit=game.canEditSchedule(),full=game.filledSlots()>=24;
 $('brushGrid').innerHTML=C.actions.map((a,i)=>`<button type="button" class="brush" data-cmd="queue-add" data-value="${a.id}" style="--action-color:${a.color}" title="1시간 추가" ${!edit||full?'disabled':''}><span class="brush-emoji">${actionIcons[a.id]}</span><span class="brush-info"><strong>${esc(a.short)}</strong></span><span class="brush-add" aria-hidden="true">＋</span></button>`).join('');
}
function renderSchedule(){const s=game.s,editable=game.canEditSchedule(),filled=game.filledSlots(),grid=$('hourGrid'),oldScroll=grid.scrollTop,empty=game.firstEmptySlot();
 grid.innerHTML=s.schedule.map((id,h)=>{
   const a=id!==null?C.actions.find(x=>x.id===id):null,done=s.phase!=='planning'&&h<s.hour,now=s.phase==='running'&&h===s.hour;
   const time=`${String(h).padStart(2,'0')}:00`;
   if(!a)return `<button class="queue-slot empty ${h===empty?'queue-next':''} ${queueTarget===h?'targeted':''} ${now?'now':''}" type="button" data-cmd="queue-target" data-value="${h}" title="${time}: 선택하면 다음 클릭이 이 자리를 채웁니다" ${!editable?'disabled':''}><span class="queue-time">${time}</span><span class="queue-content"><span class="queue-empty-symbol">${queueTarget===h?'◉':'＋'}</span>${queueTarget===h?'선택된 빈 시간':'빈 시간'}</span><span class="queue-trailing">${queueTarget===h?'입력 대기':'＋ 지정'}</span></button>`;
   return `<button type="button" class="queue-slot filled ${done?'done':''} ${now?'now':''}" data-cmd="queue-remove" data-value="${h}" style="--action-color:${a.color}" title="${time} ${esc(a.name)} · 클릭하면 그 칸만 비워집니다" aria-label="${time} ${esc(a.name)} 일정 제거" ${!editable?'disabled':''}><span class="queue-time">${time}</span><span class="queue-content"><span class="queue-action-icon">${actionIcons[id]}</span><strong>${esc(a.short)}</strong></span><span class="queue-trailing">${editable?'× 비우기':done?'완료':'예정'}</span></button>`;
 }).join('');
 grid.scrollTop=oldScroll;
 $('scheduleEditStatus').textContent=`${filled} / 24시간 ${editable?'편성':'확정'}${editable&&filled<24?' · '+(24-filled)+'칸 비어 있음':''}`;
 $('mealChoice').value=String(s.meal_index);$('mealChoice').disabled=!editable;
 $('queueFillAction').disabled=!editable||filled>=24;
 document.querySelectorAll('[data-cmd="preset"],[data-cmd="clear-queue"]').forEach(b=>b.disabled=!editable);
 document.querySelectorAll('[data-cmd="fill-remaining"]').forEach(b=>b.disabled=!editable||filled>=24);
}
function renderCounts(){const s=game.s;const totals=game.countSchedule().filter(x=>x.count>0),sleep=totals.find(x=>x.id==='sleep')?.count||0;
 $('scheduleFooter').innerHTML=totals.map(x=>`<span class="schedule-summary ${x.id==='sleep'&&x.count<=4?'warn':''}">${esc(x.short)} <strong>${x.count}h</strong></span>`).join('')+(game.filledSlots()<24?`<span class="schedule-summary warn">${24-game.filledSlots()}시간 미편성 · 진행 불가</span>`:sleep<=4?'<span class="schedule-summary warn">수면 ${sleep}h</span>':'');}
function renderRisk(){const s=game.s,r=pct(game.ritualChance()),q=pct(game.releaseRisk());
 $('inventoryPeek').innerHTML=`<div>${(s.relics||[]).length}개의 유품</div><div>${(s.quest_items||[]).length}개의 남겨진 단서</div><div>${s.ghosts.filter(g=>g.state!=='active').length}개의 묶인 목소리</div>`;
 $('tabSkillNum').textContent=s.owned_skills.length;$('tabGhostNum').textContent=s.ghosts.length;$('tabRelicNum').textContent=(s.relics||[]).length+(s.quest_items||[]).length;}
function effectStats(fx){
 const labels={money:'자금',health:'건강',mental:'정신력',spirit:'신기',luck:'행운',wealth:'재물운',bond:'인연운',omen:'영감운',clues:'강령 단서',max_mental:'정신력 최대치'};
 return Object.entries(fx||{}).filter(([,v])=>v!==0).map(([k,v])=>k==='doom'?(v>0?'불길한 운명 증가':'불길한 운명 약화'):`${labels[k]||k} ${v>=0?'+':'−'}${whole(Math.abs(v))}${k==='money'?'원':''}`).join(' · ');
}
const bonusLabels={job_extra:'알바 급여 계산치',sleep_extra:'수면 시 건강',rest_extra:'휴식 시 정신력',study_extra:'조사 발견 보정',ritual_bonus:'강령 성공률',purify_extra:'정화 시 신기 감소',meal_health:'식사 시 건강',meal_mental:'식사 시 정신력'};
function effectBonus(bonus){return Object.entries(bonus||{}).filter(([,v])=>v!==0).map(([k,v])=>`${bonusLabels[k]||k} ${v>=0?'+':'−'}${whole(Math.abs(v))}${k==='job_extra'?'원':k==='ritual_bonus'?'%p':''}`).join(' · ');}
function passiveDetails(x){
 // An intentionally hidden skill stays hidden in all player-facing descriptions.
 if(x.id==='meow')return ['야옹야옹'];
 const out=[];
 if(x.daily&&Object.keys(x.daily).length)out.push('매일 '+effectStats(x.daily));
 if(x.bonus&&Object.keys(x.bonus).length)out.push('지속 '+effectBonus(x.bonus));
 const sp=x.special||{};
 if(sp.remove_bonus)out.push(`문자 해제 성공률 +${pct(sp.remove_bonus)}%p`);
 if(sp.remove_scale_money)out.push(`문자 해제 성공 시 자금 보상(성공 누적에 비례)`);
 for(const key of ['on_work','on_meal','on_research_failure','on_other_removed']){
   const title={on_work:'알바 시',on_meal:'식사 시',on_research_failure:'조사 실패 시',on_other_removed:'다른 문자 해제 성공 시'}[key];
   if(sp[key])out.push(`${title} ${effectStats(sp[key])}`);
 }
 for(const rule of sp.conditional_daily||[])out.push(`조건부 · ${rule.text||effectStats(rule.fx)}`);
 return out.length?out:['일일·지속 효과 없음'];
}
function renderActiveEffects(s){
 const owned=[
  ['문자스킬',s.owned_skills.map(id=>C.skills.find(x=>x.id===id)).filter(Boolean)],
  ['유령',s.ghosts.map(g=>({item:C.ghosts.find(x=>x.id===g.id),state:g.state})).filter(x=>x.item)],
  ['유품',(s.relics||[]).map(id=>C.relics.find(x=>x.id===id)).filter(Boolean)]
 ];
 const daily={};
 for(const [title,items] of owned){for(const entry of items){const x=entry.item||entry;if(x.id==='meow')continue;for(const [key,val] of Object.entries(x.daily||{}))daily[key]=(daily[key]||0)+val;
 if(title==='유령'&&entry.state==='possessed'){daily.mental=(daily.mental||0)-2;daily.spirit=(daily.spirit||0)+1;}
 }}
 const summary=effectStats(daily)||'기본 일일 효과 없음';
 let html=`<div class="effect-overview"><div class="effect-headline">현재 적용 효과</div><p>매일 정산 · ${esc(summary)}</p><small>일정 결과와 조건부 효과는 별도입니다. 정화 보너스는 합산 +6까지 적용됩니다. 알바 계산치는 22% 반영하며 상한이 있습니다.${s.owned_skills.includes('meow')?' 일부 효과는 알 수 없습니다.':''}</small></div>`;
 const companions=s.ghosts.filter(g=>g.state==='active').length;
 if(companions>0){const regen=s.spirit>=30?Math.min(12,4+Math.floor(s.spirit/15)+Math.min(companions*2,4)):0;html+=`<div class="effect-overview"><strong>유령과의 공명</strong><p>신기 30 이상이면 매일 정신력 회복${regen?' · 현재 +'+whole(regen):' · 현재 조건 미충족'}</p></div>`;}
 for(const [title,entries] of owned){
  html+=`<section class="effect-section"><h3>${title} <span>${entries.length}</span></h3>`;
  if(!entries.length)html+='<p class="effect-muted">적용 중인 항목 없음</p>';
  for(const entry of entries){const x=entry.item||entry;const details=passiveDetails(x);
   if(title==='유령'&&entry.state==='possessed')details.push('빙의 · 매일 정신력 −2, 신기 +1');
   html+=`<article class="effect-line"><strong>${esc(x.name)}</strong>${title==='유령'?`<small>${entry.state==='active'?'활성':entry.state==='bound'?'지박':'빙의'}</small>`:''}<p>${esc(details.join(' / '))}</p></article>`;
  }
  html+='</section>';
 }
 if((s.quest_items||[]).length)html+=`<div class="effect-quests">보유 단서 · ${esc(s.quest_items.join(', '))}</div>`;
 return html;
}
function renderTabs(){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.value===tab));
 const s=game.s,empty=(glyph,title,desc)=>`<div class="empty-state"><span class="empty-symbol">${glyph}</span><strong>${title}</strong><p>${desc}</p></div>`;
 let html='';
 if(tab==='effects'){html=renderActiveEffects(s);}
 else if(tab==='skills'){
   html=s.owned_skills.length?s.owned_skills.map(id=>{const x=C.skills.find(x=>x.id===id);if(!x)return '';return `<article class="archive-item"><div class="archive-top"><strong>${esc(x.name)}</strong><span class="grade-badge grade-${x.grade}">${x.grade}등급</span></div><p>${esc(x.desc)}</p><div class="archive-bottom">${x.wish?`<small>소원 ${s.wish_spent.includes('clown')?'0':'1'} / 1</small>`:''}<div style="display:flex;gap:6px">${x.wish?`<button class="button tiny secondary" data-cmd="wish" ${s.phase!=='planning'||s.pending||s.wish_spent.includes('clown')?'disabled':''}>소원 빌기</button>`:''}<button class="button ghost tiny" data-cmd="remove-skill" data-value="${id}" ${!['planning','running'].includes(s.phase)||s.management_backup||s.remove_attempts_today>=3||x.locked?'disabled':''}>${x.locked?'해제 불가':'해제' }</button></div></div></article>`;}).join(''):empty('✦','아직 배운 문자가 없습니다.','');
 }else if(tab==='ghosts'){
   html=s.ghosts.length?s.ghosts.map(g=>{const x=C.ghosts.find(x=>x.id===g.id);if(!x)return '';const state=g.state==='active'?'해방 가능':g.state==='bound'?'지박':'빙의';return `<article class="archive-item ghost-entry"><img class="ghost-portrait" src="${(window.YG_ART_DATA&&window.YG_ART_DATA.ghost)||'assets/ghost.png'}" alt="${esc(x.name)} 초상화" loading="lazy"><div class="ghost-entry-body"><div class="archive-top"><strong>${esc(x.name)}</strong><span class="ghost-state ${g.state!=='active'?'locked':''}">${state}</span></div><p class="archive-story">${esc(x.story)}</p><p>${esc(x.desc)}</p><div class="archive-bottom">${g.state==='possessed'?'<small>매일 정신력 −2, 신기 +1</small>':''}<button class="button ghost tiny" data-cmd="release" data-value="${g.id}" ${g.state!=='active'||!['planning','running'].includes(s.phase)||s.management_backup?'disabled':''}>해방 시도</button></div></div></article>`;}).join(''):empty('☽','아직 받아들인 귀신이 없습니다.','');
 }else if(tab==='relics'){
   html=(s.relics||[]).map(id=>{const r=(C.relics||[]).find(x=>x.id===id);return r?`<article class="archive-item"><div class="archive-top"><strong>${esc(r.name)}</strong><span class="grade-badge">유품</span></div><p>${esc(r.desc)}</p></article>`:'';}).join('')+(s.quest_items||[]).map(name=>`<article class="archive-item"><div class="archive-top"><strong>${esc(name)}</strong><span class="grade-badge">단서</span></div></article>`).join('');
   if(!html)html=empty('□','남겨진 물건이 없습니다.','');
 }else if(tab==='logs'){
   html=(s.logs.length?s.logs:[]).map(x=>`<div class="log-item">${esc(x)}</div>`).join('')||empty('☷','아직 기록이 없습니다.','일정을 진행하면 기록이 쌓입니다.');

 }
 $('tabContent').innerHTML=html;
}
function renderControl(){const s=game.s;
 const title={planning:'오늘을 시작할 준비',running:'오늘의 일정 진행 중',night:'오늘의 결산 완료',dead:'연명 종료'}[s.phase];
 $('executionHeading').textContent=title;
 const blocked=s.phase==='dead'||s.phase==='night'||Boolean(s.pending)||(s.phase==='planning'&&game.filledSlots()<24);
 $('stepButton').disabled=blocked;
 $('autoButton').disabled=autoMode?false:blocked;
 $('autoButton').innerHTML=autoMode?'<span>Ⅱ</span> 일시정지':s.phase==='running'?'<span>▶</span> 이어서 자동 진행':'<span>▶</span> 하루 자동 진행';
 $('autoButton').classList.toggle('secondary',autoMode);$('autoButton').classList.toggle('primary',!autoMode);
}
function renderStage(){
 const s=game.s,scene=s.scene||{}, h=scene.hour??Math.max(0,s.hour-1);
 const period=h<5?'깊은 새벽':h<9?'아침':h<13?'늦은 오전':h<17?'오후':h<20?'저녁':'밤';
 $('stageClock').textContent=`DAY ${String(s.day).padStart(2,'0')}  ·  ${String(Math.max(0,Math.min(23,h))).padStart(2,'0')}:00`;
 $('stagePeriod').textContent=period;
 $('sceneTitle').textContent=scene.title||'조용한 방';
 $('sceneBody').textContent=scene.body||'오늘 하루의 일정을 기다린다.';
 $('scenePlace').textContent=(s.pending?.kind==='encounter'?'특별한 사건 · ':'')+({sleep:'침실',rest:'거실',work:'아르바이트',meal:'식탁',research:'컴퓨터 앞',desk:'컴퓨터 앞',monitor:'모니터',shop:'심야 상점',ghost:'강령진',shaman:'퇴마 의식',ritual:'강령진',walk:'골목길',purify:'정화 의식',park:'산책로',street:'거리',home:'집',cafe:'카페',store:'가게'}[scene.action]||'어딘가');
 $('stageStatus').textContent=s.pending?'선택 대기':s.phase==='running'?'시간 경과 중':s.phase==='planning'?'오늘의 계획':'하루의 끝';
 $('stageStatus').classList.toggle('urgent',Boolean(s.pending));
 $('sceneRecap').innerHTML=(s.scene_history||[]).slice(0,3).map(x=>`<div><span>${String(x.hour).padStart(2,'0')}:00</span><strong>${esc((C.actions.find(a=>a.id===x.action)||{}).short||x.action)}</strong><small>${esc(x.text)}</small></div>`).join('');
 if(window.YGPixel)window.YGPixel.draw(s);
}
function modalChoices(options){return `<div class="modal-choices">${options.join('')}</div>`;}
function modalFrame(kicker,title,intro,inner,bottom=''){
 return `<div class="modal-kicker">${esc(kicker)}</div>${title?`<h2 id="modalTitle">${esc(title)}</h2>`:''}${intro?`<p class="modal-intro">${esc(intro)}</p>`:''}${inner||''}${bottom?`<div class="modal-bottom">${bottom}</div>`:''}`;
}
function renderModal(){const s=game.s,p=s.pending,overlay=$('modalOverlay');overlay.hidden=true;
 const management=Boolean(s.management_backup);overlay.hidden=!management;const target=management?$('modalCard'):$('storyChoices');if(!p&&s.phase!=='dead'){lastModalKey='';target.innerHTML='';return;}
 let html='',kind=s.phase==='dead'?'dead':p.kind;
 if(kind==='dead'){
   html=modalFrame('END OF LIFE · '+s.day+'일차','연명에 실패했다',s.death_reason,`<div class="modal-end">당신은 ${s.day}일차 ${s.hour}시까지 살아남았다.\n어떤 목소리들은 여전히 방 안에 남아 있다.</div>`,`<span class="modal-hint">다음 시도에서 일정을 바꾸거나 실험해 보세요.</span><button class="button danger" data-cmd="restart">새 삶 시작하기</button>`);
 }else if(kind==='encounter'){
   const item=C.encounters.find(x=>x.id===p.id);if(!item){target.innerHTML='';return;}
   const cards=item.options.map((x,i)=>{const noMoney=Boolean(x.minimum_money&&s.money<x.minimum_money),noSpirit=Boolean(x.minimum_spirit&&s.spirit<x.minimum_spirit);return `<button class="choice-card" data-cmd="event-choice" data-value="${i}" ${noMoney||noSpirit?'disabled':''}><div class="choice-head"><strong>${esc(x.label)}</strong><span class="choice-title">${noMoney?'잔액 부족':noSpirit?'신기 '+whole(x.minimum_spirit)+' 필요':'선택 '+(i+1)}</span></div></button>`;});
   html=modalFrame('CHOOSE / 이 순간의 선택','','',modalChoices(cards),'');
 }else if(kind==='skills'){
   const shop=p.source==='shop';const options=p.ids.map((id,i)=>{const x=C.skills.find(x=>x.id===id);if(!x)return '';const price=skillPrice(x),afford=!shop||s.money>=price;return `<button class="choice-card" data-cmd="skill-choice" data-value="${i}" ${afford?'':'disabled'}><div class="choice-head"><strong>${esc(x.name)}</strong><span class="grade-badge grade-${x.grade}">${x.grade}등급</span></div><div class="choice-description">${esc(x.desc)}</div><div class="choice-cost">${shop?moneyText(price)+'원'+(afford?'':' · 잔액 부족'):'무료로 습득'}</div></button>`;});
   html=modalFrame(shop?'MIDNIGHT SHOP / 하루 사이의 상점':'ARCHIVED FORMULA / 발견한 문자',shop?'경계의 상점':'잊힌 글귀를 발견했다',shop?'새벽과 아침 사이에만 열리는 상점. 판매자는 끝내 얼굴을 보여주지 않는다.':'검색 기록에 알 수 없는 글귀가 남았다. 기억할 수 있는 문자는 단 하나뿐이다.',modalChoices(options),`<button class="button secondary" data-cmd="skill-choice" data-value="-1">선택하지 않고 지나가기</button>`);
 }else if(kind==='lore'){
   const opts=[['정화 문장을 따라 적는다','정신력 −5, 자금 −3,000원, 신기 −7'],['해방을 돕는 부적 제작법을 기록한다','정신력 −4, 다음 해방 시 실패 위험 13%p 감소'],['강령 단서로 활용한다','강령 단서 +1, 신기 +2'],['조사를 종료한다','추가 효과 없음']];
   html=modalFrame('RESEARCH / 해방과 제령','해방에 관한 기록','검증되지 않은 게시글 속에서 실제 의식의 순서를 찾아냈다. 어떤 부분을 기록할 것인가?',modalChoices(opts.map(([name,desc],i)=>`<button class="choice-card" data-cmd="lore-choice" data-value="${i}"><div class="choice-head"><strong>${name}</strong><span class="choice-title">선택 ${i+1}</span></div><div class="choice-description">${desc}</div></button>`)));
 }else if(kind==='notice'){
   html=modalFrame('SEANCE LOG / 결과',p.title,p.body,'',`<button class="button primary" data-cmd="close-notice">계속하기</button>`);
 }else if(kind==='report'){
   html=modalFrame('CLOSING REPORT / 하루의 끝',p.title,p.body,'',`<button class="button primary" data-cmd="open-shop">계속하기</button>`);
 }else if(kind==='remove-skill'){
   const x=C.skills.find(x=>x.id===p.id);
   html=modalFrame('ERASE THE WORD / 문자 해제','이 글귀를 지울 것인가?',`${x?.name||'문자스킬'}\n\n남은 제거 시도 ${3-s.remove_attempts_today}회. 성공률 ${Math.round(game.removalChance(x)*100)}%. 실패해도 횟수는 소모됩니다. 해제 후 일일 효과와 지속 보너스가 종료되지만 획득 당시의 즉시 효과는 남습니다.${x?.gain?.max_mental?' 정신력 최대치 증가 효과는 함께 사라집니다.':''}`,'',`<button class="button ghost" data-cmd="confirm-remove-skill" data-value="no">취소</button><button class="button danger" data-cmd="confirm-remove-skill" data-value="yes">문자 해제</button>`);
 }else if(kind==='release'){
   const x=C.ghosts.find(x=>x.id===p.id),risk=pct(game.releaseRisk());
   html=modalFrame('RELEASE RITUAL / 해방','이 목소리를 내보내겠는가?',`${x?.name||'귀신'}\n\n성공하면 유령의 보너스와 부작용이 모두 사라지고 신기 −8, 정신력 +4가 적용된다. 시도 자체에 정신력 5가 소모된다.`,`<div class="modal-end">현재 해방 실패 확률 ${risk}%\n실패하면 지박 또는 빙의되어 생존하는 동안 제거할 수 없다.</div>`,`<button class="button ghost" data-cmd="confirm-release" data-value="no">취소</button><button class="button danger" data-cmd="confirm-release" data-value="yes">위험을 감수한다</button>`);
 }else if(kind==='wish'){
   const options=[['돈을 얻는다','주머니에서 처음 보는 지폐가 나온다.'],['건강을 회복한다','몸에서 오래된 상처가 사라진다.'],['정신력을 회복한다','방 안의 목소리가 잠시 멎는다.']];
   html=modalFrame('ONCE ONLY / 노란어릿광대','소원을 하나 말해', '어릿광대가 웃으며 손가락 하나를 편다. 이미 한 번 입 밖으로 낸 소원은 되돌릴 수 없다.',modalChoices(options.map(([name,desc],i)=>`<button class="choice-card" data-cmd="wish-choice" data-value="${i}"><div class="choice-head"><strong>${name}</strong></div><div class="choice-description">${desc}</div></button>`)),`<span class="modal-hint">소원은 게임 내 단 한 번 사용할 수 있습니다.</span>`);
 }
 target.innerHTML=html;
 const key=JSON.stringify([kind,p?.id,p?.source,p?.title,s.day,s.hour]);if(key!==lastModalKey){lastModalKey=key;}

}
function renderDebug(){if($('debugDrawer').hidden)return;const s=game.s;$('debugInfo').textContent=`DAY ${s.day} · ${phaseName[s.phase]} · ${s.hour}:00\n강령 성공률 ${pct(game.ritualChance())}% / 해방 위험 ${pct(game.releaseRisk())}%\nRNG 시드 ${s.rng} (세이브에 보관)\n자동 저장 ${game.storageError?'불가':'정상'} · 문자스킬 ${s.owned_skills.length}개 · 유령 ${s.ghosts.length}구`;
}
init();
window.YG_APP={game,render,runAuto};
})();
