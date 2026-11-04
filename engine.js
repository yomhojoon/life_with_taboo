(function (root) {
  'use strict';
  const C = root.YG_CONTENT || (typeof require === 'function' ? require('./data.js') : null);
  const SAVE_KEY = 'yeonmyeong_web_save_v5';
  const LEGACY_SAVE_KEY = 'yeonmyeong_web_save_v4';
  const OLD_SAVE_KEY = 'yeonmyeong_web_save_v2';
  const STAT_LABELS = { money:'자금', health:'건강', mental:'정신력', spirit:'신기', luck:'행운', wealth:'재물운', bond:'인연운', omen:'영감운', clues:'강령 단서', max_mental:'정신력 최대치' };
  const GRADE_PRICES = [12000, 42000, 95000, 185000];
  const byId = (items, id) => items.find(x => x.id === id);
  const bounded = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const moneyText = n => Math.round(n).toLocaleString('ko-KR');
  const copy = obj => JSON.parse(JSON.stringify(obj));

  function safeStorage() {
    try { return typeof localStorage === 'undefined' ? null : localStorage; }
    catch (_e) { return null; }
  }
  class Game {
    constructor(opts={}) {
      this.storage = opts.storage === undefined ? safeStorage() : opts.storage;
      this.storageError = !this.storage;
      this.s = this.initialState();
      if (opts.load !== false) this.load();
    }
    initialState() {
      return {
        version:5, rng: 246813579, day:1, hour:0, phase:'planning', death_reason:'',
        money:200000, health:100, mental:100, mental_max:100, spirit:0,
        luck:0, wealth:0, bond:0, omen:0, clues:0, meal_index:1,
        schedule: Array(24).fill(null), owned_skills:[], ghosts:[], relics:[], quest_items:[], delayed:[], unpaid_days:0,
        wish_spent:[], logs:['01일 00시 · 새벽. 오늘을 위한 24시간의 빈 일정 큐를 열었다.'],
        pending:null, sleep_today:0, day_start:{money:200000, health:100, mental:100, spirit:0},
        last_encounter:'', milestones:[], event_history:[], event_count_day:0, next_events:[],
        research_found_today:0, research_attempts_today:0, release_wards:0, release_rewards:0,
        scene:{title:'불 꺼진 방',body:'아직 오늘의 첫 시간을 시작하지 않았다. 벽 너머로 평범한 하루의 소리가 들린다.',action:'rest',hour:0,day:1},
        scene_history:[]
      };
    }
    reset() { this.s=this.initialState(); this.save(); }
    presetSchedule(preset) {
      const list=[];
      for (let i=0;i<24;i++) {
        let a;
        if (preset==='safe') a=i<8?'sleep':i===8||i===19?'meal':i<16?'work':i<18?'research':i===18||i===20?'purify':'rest';
        else if (preset==='risky') a=i<6?'sleep':i===6||i===18?'meal':i<11?'work':i<16?'research':i<20?'ritual':i<22?'purify':'rest';
        else a=i<7?'sleep':i===7||i===12?'meal':i<16?'work':i<19?'research':i===20?'ritual':i===22?'walk':'rest';
        list.push(a);
      }
      return list;
    }
    canEditSchedule() { return this.s.phase==='planning' && !this.s.pending; }
    filledSlots() { return this.s.schedule.filter(x=>x!==null).length; }
    firstEmptySlot() { return this.s.schedule.indexOf(null); }
    setPreset(p) {
      if(!this.canEditSchedule()||!['balanced','safe','risky'].includes(p))return false;
      this.s.schedule=this.presetSchedule(p);this.save();return true;
    }
    // Fixed time slots: removing the middle item never shifts surrounding hours.
    appendSchedule(a,preferred=null) {
      if(!this.canEditSchedule()||!byId(C.actions,a))return false;
      const i=preferred===null?this.firstEmptySlot():preferred;
      if(!Number.isInteger(i)||i<0||i>=24||this.s.schedule[i]!==null)return false;
      this.s.schedule[i]=a;this.save();return true;
    }
    removeSchedule(i) {
      if(!this.canEditSchedule()||!Number.isInteger(i)||i<0||i>=24||this.s.schedule[i]===null)return false;
      this.s.schedule[i]=null;this.save();return true;
    }
    clearSchedule() {
      if(!this.canEditSchedule())return false;
      this.s.schedule=Array(24).fill(null);this.save();return true;
    }
    fillRemaining(a) {
      if(!this.canEditSchedule()||!byId(C.actions,a))return false;
      if(this.filledSlots()>=24)return false;
      this.s.schedule=this.s.schedule.map(x=>x===null?a:x);this.save();return true;
    }
    // Retained as a utility for old test scenarios; the UI only uses fillRemaining.
    fillAll(a) { if(!this.canEditSchedule()||!byId(C.actions,a))return false;this.s.schedule.fill(a);this.save();return true; }
    setMeal(i) { if(this.s.phase!=='planning'||this.s.pending||!Number.isInteger(i)||i<0||i>=C.meals.length) return false; this.s.meal_index=i;this.save();return true; }
    countSchedule() { return C.actions.map(a=>({...a,count:this.s.schedule.filter(x=>x===a.id).length})); }
    snapshot() { const s=this.s;return {money:s.money,health:s.health,mental:s.mental,spirit:s.spirit,luck:s.luck,wealth:s.wealth,bond:s.bond,omen:s.omen}; }
    rand() { let x=this.s.rng|0; x^=x<<13; x^=x>>>17; x^=x<<5; this.s.rng=x>>>0 || 1;return this.s.rng/4294967296; }
    randInt(a,b) { return a+Math.floor(this.rand()*(b-a+1)); }
    takeRandom(a) { return a[this.randInt(0,a.length-1)]; }
    log(t) { this.s.logs.unshift(`${String(this.s.day).padStart(2,'0')}일 ${String(Math.min(this.s.hour,24)).padStart(2,'0')}시 · ${t}`);if(this.s.logs.length>160)this.s.logs.length=160; }
    effectsText(o) { const es=Object.entries(o||{}).map(([k,v])=>`${STAT_LABELS[k]||k} ${v>=0?'+':'−'}${k==='money'?moneyText(Math.abs(v))+'원':Math.abs(v)}`);return es.length?es.join(' / '):'변화 없음'; }
    apply(o) {
      const s=this.s;
      for (const [key, raw] of Object.entries(o||{})) {
        const n=Number(raw);
        if(!Number.isFinite(n))continue;
        if(key==='money')s.money=Math.max(0,s.money+n);
        else if(key==='health')s.health=bounded(s.health+n,0,100);
        else if(key==='mental')s.mental=bounded(s.mental+n,0,s.mental_max);
        else if(key==='spirit')s.spirit=Math.max(0,s.spirit+n);
        else if(key==='max_mental')s.mental_max=Math.max(1,s.mental_max+n);
        else if(['luck','wealth','bond','omen'].includes(key))s[key]+=n;
        else if(key==='clues')s.clues=Math.max(0,s.clues+n);
      }
      s.mental=bounded(s.mental,0,s.mental_max);
      this.checkDeath();
    }
    checkDeath() {
      const s=this.s;
      if(s.phase==='dead')return true;
      s.death_reason = s.health<=0?'건강이 0이 되었다. 육체가 더 이상 버티지 못한다.':
        s.mental<=0?'정신력이 0이 되었다. 자신의 목소리를 구분할 수 없다.':
        s.spirit>=100?'신기가 100에 도달했다. 불러들인 것들에게 삼켜졌다.':'';
      if(s.death_reason){s.phase='dead';s.pending=null;this.log('사망 · '+s.death_reason);this.save();return true;}
      return false;
    }
    bonuses() {
      const result={};
      for(const id of this.s.owned_skills) this.mergeBonus(result,(byId(C.skills,id)||{}).bonus);
      for(const x of this.s.ghosts) this.mergeBonus(result,(byId(C.ghosts,x.id)||{}).bonus);
      for(const id of this.s.relics||[]) this.mergeBonus(result,(byId(C.relics||[],id)||{}).bonus);
      return result;
    }
    mergeBonus(target,source) { for(const [k,v] of Object.entries(source||{})) target[k]=(target[k]||0)+v; }
    ritualChance() { const s=this.s;return bounded(.24+s.spirit*.0055+s.clues*.05+s.omen*.018+(this.bonuses().ritual_bonus||0)/100,.05,.91); }
    releaseRisk() { return bounded(.07+this.s.spirit*.007-(this.s.release_wards>0?.13:0),.02,.82); }
    start() { if(!this.canEditSchedule()||this.filledSlots()!==24)return false;this.s.phase='running';this.log('일정 실행. 오늘의 운세가 움직이기 시작했다.');this.save();return true; }
    advanceHour() {
      const s=this.s;
      if(s.phase!=='running'||s.pending)return false;
      if(s.hour>=24){this.finishDay();return true;}
      const h=s.hour, action=s.schedule[h];s.hour++;
      const name=(byId(C.actions,action)||{}).name||'빈 시간';
      const hourText=this.hourFlavor(action,h);
      s.scene={title:`${String(h).padStart(2,'0')}:00 · ${name}`,body:hourText,action,hour:h,day:s.day};
      s.scene_history.unshift({day:s.day,hour:h,action,text:hourText});
      if(s.scene_history.length>36)s.scene_history.length=36;
      this.performAction(action);
      if(s.phase==='dead'){this.save();return true;}
      if(!s.pending){
        const due=s.next_events.findIndex(q=>{const e=byId(C.encounters,q.id);return e&&(q.day<s.day||(q.day===s.day&&q.hour<=s.hour))&&(!e.actions||e.actions.includes(action));});
        if(due>=0){const e=s.next_events.splice(due,1)[0];this.beginEncounter(e.id,true,action,h);}
        else if(s.event_count_day<7){
          const baseChance=action==='sleep'?.025:action==='ritual'?.31:action==='research'?.28:action==='purify'?.24:action==='walk'?.32:.21;
          if(this.rand()<baseChance)this.beginEncounter(null,false,action,h);
        }
      }
      if(s.hour>=24&&!s.pending&&s.phase==='running')this.finishDay();
      this.save();return true;
    }
    hourFlavor(action,h){
      const period=h<5?'새벽':h<11?'아침':h<16?'낮':h<20?'해질녘':'밤';
      const choices={
        sleep:['이불을 당기자 바깥 소리가 조금 멀어진다.','창가로 희미한 빛이 스민다. 꿈은 자세히 기억나지 않는다.','오랜만에 깊고 조용한 잠에 빠져든다.'],
        rest:['잠깐 앉아 호흡을 고른다. 시간이 느리게 흐른다.','식어 가는 차 옆에서 휴대전화를 내려놓는다.','아무 일도 하지 않는 시간이 뜻밖에 소중하다.'],
        work:['알바 시간. 점포의 형광등이 켜지고 손님들이 오간다.','해야 할 일을 하나씩 해낸다. 일상은 일정한 리듬을 지닌다.','계산대 앞의 사람이 잔돈을 세는 동안 잠시 숨을 고른다.'],
        meal:['오늘의 한 끼를 준비한다. 뜨거운 김이 오른다.','평범한 식사는 몸을 조금씩 회복시킨다.','젓가락을 내려놓자 멀리서 자동차 소리가 들린다.'],
        research:['브라우저 창을 연다. 게시판과 오래된 기록들이 화면을 채운다.','검색어를 바꾸며 자료를 대조한다. 유효한 기록은 드물다.','오래된 글을 따라 들어갔지만 링크 대부분이 끊겨 있다.'],
        ritual:['천천히 강령진을 정돈한다. 방의 공기가 달라진다.','촛불을 켜고 이름을 조용히 발음한다.','대답은 기다린다고 반드시 돌아오는 것이 아니다.'],
        walk:['골목을 따라 걷는다. 사람마다 다른 방향으로 서둘러 간다.','건널목 신호를 기다리며 바람을 맞는다.','다른 집의 식탁과 가게의 불빛이 스쳐 간다.'],
        purify:['소금과 향을 정돈한다. 쓴 냄새가 천천히 퍼진다.','물에 손을 씻고 기도문을 다시 읽는다.','방 안에 남은 기운을 하나씩 떨쳐 내려고 한다.']
      };
      const lines=choices[action]||['잠시 시간이 흘러간다.'];
      return `${period}. ${lines[(h+this.s.day)%lines.length]}`;
    }
    performAction(action) {
      const s=this.s,b=this.bonuses();
      switch(action){
        case 'sleep':s.sleep_today++;this.apply({health:4+(b.sleep_extra||0),mental:s.sleep_today>=12?-4:2});break;
        case 'rest':this.apply({mental:7+(b.rest_extra||0),spirit:-1});break;
        case 'work':{
          const base=12000+(b.job_extra||0),pay=Math.max(1000,Math.round(base*(1+bounded(s.wealth*.007,-.30,.60))));
          this.apply(this.rand()<.5?{money:pay,health:-4}:{money:pay,mental:-5});
          this.log(`아르바이트. 자금 +${moneyText(pay)}원.`);break;
        }
        case 'meal':{
          const food=C.meals[s.meal_index];
          if(s.money>=food.price){this.apply({money:-food.price,health:food.health+(b.meal_health||0),mental:food.mental+(b.meal_mental||0),spirit:food.spirit});this.log(`${food.name} 주문. −${moneyText(food.price)}원.`);}
          else{this.apply({health:-4,mental:-3});this.log('잔액 부족. 식사를 거른다.');}
          break;
        }
        case 'research':{
          s.research_attempts_today++;
          this.apply({mental:-3,health:-1});if(s.phase==='dead')break;
          const skillChance=s.research_found_today>=1?0:bounded(.19+(b.study_extra||0)*.003+s.omen*.005,.05,.35);
          const r=this.rand();
          if(r<skillChance){
            const ids=this.drawSkills(this.randInt(1,4));
            s.research_found_today++;
            if(ids.length){s.pending={kind:'skills',source:'research',ids};s.scene.action='monitor';s.scene.body='검색 중 원문이 일부 복구되었다. 오늘 발견할 수 있는 유일한 문자 후보들이다. 하나만 기억할 수 있다.';this.log('인터넷 조사 · 문자 후보 발견 (오늘 1회 제한).');}
            else{this.apply({clues:1});s.scene.body='이미 본 문자뿐이다. 강령 단서 하나를 다시 정리했다.';}
          }else if(r<skillChance+.22){
            s.pending={kind:'lore'};s.scene.action='monitor';s.scene.body='해방 의식에 관한 글을 찾았다. 글쓴이는 위험을 감수하고 자신을 정화하는 방법까지 남겼다.';
            this.log('인터넷 조사 · 해방 관련 자료 발견.');
          }else if(r<skillChance+.17+.22){
            this.apply({clues:1});s.scene.body='기록에서 유효한 강령 단서를 하나 얻었다. 아직 문자의 원문은 찾지 못했다.';
            this.log('인터넷 조사 · 강령 단서 +1.');
          }else{
            const bad=this.rand()<bounded(.16-s.luck*.013,.05,.48);
            if(bad){this.apply({mental:-2,spirit:2});s.scene.body='허위 자료를 따라갔다. 광고창을 닫자 귀에서 오래된 소음이 남는다. (정신력 −2, 신기 +2)';}
            else{s.scene.body='검색 결과를 몇 번이나 넘겼지만 건질 만한 자료가 없다. 오늘의 조사는 아무 성과가 없었다.';}
            this.log('인터넷 조사 · 실패. 새로운 정보를 얻지 못했다.');
          }
          break;
        }
        case 'ritual':this.performRitual();break;
        case 'walk':{
          this.apply({mental:4,spirit:-2});
          if(this.rand()<bounded(.12+s.bond*.02+s.luck*.006,.02,.38)){this.apply({bond:1});this.log('산책 중 아는 사람을 만났다. 인연운 +1.');}
          break;
        }
        case 'purify':{
          if(s.money>=15000){this.apply({money:-15000,spirit:-7-(b.purify_extra||0),mental:-2,health:-1});this.log('소금과 향을 태웠다. 신기 정화 −15,000원.');}
          else{this.apply({mental:-3});this.log('정화 비용이 부족하다.');}
          break;
        }
      }
    }
    performRitual() {
      const s=this.s;this.apply({mental:-5});if(s.phase==='dead')return;
      const chance=this.ritualChance();
      if(this.rand()<chance){
        const available=C.ghosts.filter(g=>!s.ghosts.some(x=>x.id===g.id));
        if(!available.length){this.apply({spirit:6});s.pending={kind:'notice',title:'텅 빈 강령진',body:'이미 모든 유령을 받아들였다. 더는 응답하는 목소리가 없다.'};}
        else{const g=this.takeRandom(available);s.ghosts.push({id:g.id,state:'active'});this.apply({spirit:10});if(s.phase==='dead')return;
          this.log(`강령 성공 · ${g.name}이(가) 깃들었다.`);
          s.scene.action='ghost';s.scene.tone='ghost';s.scene.title=`강령 성공 · ${g.name}`;s.scene.body=g.story;s.pending={kind:'notice',title:`강령 성공 · ${g.name}`,body:`${g.story}\n\n${g.desc}`};}
      }else{
        this.apply({mental:-6,spirit:6});if(s.phase==='dead')return;
        this.log(`강령 실패 · 성공 확률 ${Math.round(chance*100)}%.`);
        s.pending={kind:'notice',title:'강령 실패',body:`아무도 응답하지 않았다. 하지만 방은 조금 좁아졌다.\n\n정신력 −11(시도 비용 포함), 신기 +6\n시도 당시 성공 확률 ${Math.round(chance*100)}%`};
      }
    }
    drawSkills(n) {
      const candidate=C.skills.filter(x=>!this.s.owned_skills.includes(x.id)),chosen=[];
      while(chosen.length<n&&candidate.length){
        const r=this.rand();let grade=r<.045+Math.min(this.s.day*.003,.035)?3:r<.20+Math.min(this.s.day*.006,.08)?2:r<.56?1:0;
        const pool=candidate.filter(x=>x.grade===grade);
        const selected=this.takeRandom(pool.length?pool:candidate);
        chosen.push(selected.id);candidate.splice(candidate.indexOf(selected),1);
      }
      return chosen;
    }
    beginEncounter(id=null,forced=false,action=null,hour=null) {
      if(this.s.pending||this.s.phase==='dead')return false;
      const h=hour===null?Math.max(0,this.s.hour-1):hour;
      const allowed=e=>{
        if(forced)return true;
        if(e.chain_followup)return false;
        if(e.id===this.s.last_encounter||e.id===this.s.event_history[1])return false;
        if(e.id.includes('_return')||['umbrella_cafe','coworker_help','coworker_dinner','book_pickup','book_last','cat_again','wallet_thanks'].includes(e.id))return false;
        if(e.actions&&(!action||!e.actions.includes(action)))return false;
        if(!e.actions&&action==='sleep')return false;
        if(e.requires_haunting&&!this.s.ghosts.some(g=>g.state!=='active'))return false;
        if(e.requires_item&&!(this.s.quest_items||[]).includes(e.requires_item))return false;
        if(e.hours){const [start,end]=e.hours;if(start<=end? h<start||h>end : h<start&&h>end)return false;}
        return true;
      };
      const item=id?byId(C.encounters,id):this.weightedEncounter(C.encounters.filter(allowed));
      if(!item)return false;
      this.s.last_encounter=item.id;
      this.s.event_history.unshift(item.id);this.s.event_history.length=Math.min(4,this.s.event_history.length);
      this.s.event_count_day++;
      this.s.pending={kind:'encounter',id:item.id};
      this.s.scene={title:item.title,body:item.body,action:item.scene||action||'rest',hour:h,day:this.s.day,tone:item.tone||'strange'};
      this.log(`일상 사건 · ${item.title}`);this.save();return true;
    }
    weightedEncounter(pool){
      if(!pool.length)return null;
      if(!pool.length)return null;
      const luck=this.s.luck;
      const weights=pool.map(e=>{
        const tone=e.tone||'strange';
        const factor=tone==='good'?bounded(1+luck*.11,.2,3.0):tone==='bad'?bounded(1-luck*.11,.2,3.0):1;
        return (e.weight|| (tone==='strange'?.65:1))*factor;
      });
      let r=this.rand()*weights.reduce((a,b)=>a+b,0);
      for(let i=0;i<pool.length;i++){r-=weights[i];if(r<0)return pool[i];}
      return pool[pool.length-1];
    }
    chooseEncounter(index) {
      const s=this.s;if(s.pending?.kind!=='encounter')return false;
      const evt=byId(C.encounters,s.pending.id),op=evt?.options[index];if(!op)return false;
      let text=op.text||'',fx=op.fx||{};
      if(op.exorcise){
        const {cost,chance}=op.exorcise;
        if(s.money<cost)return false;
        const imprisoned=s.ghosts.filter(g=>g.state!=='active');
        if(!imprisoned.length)return false;
        const g=this.takeRandom(imprisoned),name=byId(C.ghosts,g.id).name;
        this.apply({money:-cost,mental:-5});
        if(s.phase==='dead')return true;
        if(this.rand()<bounded(chance+s.omen*.006,.5,.97)){
          s.ghosts.splice(s.ghosts.indexOf(g),1);
          this.apply({spirit:-13,mental:9});
          text=`${name}의 빙의/지박이 해제되었다. 더는 방 안에서 기척이 느껴지지 않는다.`;
          this.grantReleaseReward();
        }else{this.apply({spirit:7,mental:-9});text=`${name}을(를) 몰아내려 했지만 의식이 거칠게 실패했다.`;}
        fx={};
      }
      if(typeof op.chance==='number'){
        const chance=bounded(op.chance+s.luck*.015+s.omen*.01+s.bond*.003,.08,.90);
        const good=this.rand()<chance;text=good?op.good:op.bad;fx=good?op.good_fx:op.bad_fx;
      }
      s.pending=null;
      if(op.consume_item){const i=s.quest_items.indexOf(op.consume_item);if(i>=0)s.quest_items.splice(i,1);}
      if(op.relic){const item=(C.relics||[]).find(r=>r.name===op.relic);if(item&&!s.relics.includes(item.id)){s.relics.push(item.id);text+=' '+item.name+'을(를) 얻었다.';}}
      if(op.item&&!s.quest_items.includes(op.item)){s.quest_items.push(op.item);text+=' '+op.item+'을(를) 얻었다.';}
      if(op.ward){s.release_wards=Math.min(3,s.release_wards+op.ward);text+=' (해방 보호 매듭 +1)';}
      if(op.follow){
        const hours=(op.follow_days||0)*24+(op.follow_hours||0);
        const due=(s.day-1)*24+s.hour+Math.max(1,hours);
        s.next_events.push({id:op.follow,day:Math.floor(due/24)+1,hour:due%24});
        text+=' 이어질 이야기가 남았다.';
      }
      this.apply(fx);
      if(s.phase!=='dead'){
        s.scene.body=text;
        this.log(text+' · '+this.effectsText(fx));
        s.pending={kind:'notice',title:'선택의 결과',body:text+'\n\n'+this.effectsText(fx)};
      }
      this.save();return true;
    }
    chooseLore(i){
      const s=this.s;if(s.pending?.kind!=='lore'||!Number.isInteger(i)||i<0||i>3)return false;
      const results=[
        {text:'읽은 정화 문장을 따라 적자 방 안의 기운이 잠잠해진다.',fx:{spirit:-7,mental:-5,money:-3000}},
        {text:'해방 매듭법을 기록했다. 다음 해방 시도에서 실패 위험을 13%p 낮출 수 있다.',fx:{mental:-4},ward:1},
        {text:'해방의 배열을 거꾸로 읽자 강령진의 구조를 이해했다.',fx:{clues:1,spirit:2}},
        {text:'위험한 의식이라고 판단해 창을 닫았다.',fx:{}}
      ];
      const q=results[i];s.pending=null;if(q.ward)s.release_wards=Math.min(3,s.release_wards+1);
      this.apply(q.fx);
      if(s.phase!=='dead'){s.scene.body=q.text;s.pending={kind:'notice',title:'해방 자료의 기록',body:q.text+'\n\n'+this.effectsText(q.fx)};}
      this.log(q.text);this.save();return true;
    }
    acquireSkill(id,source) {
      const s=this.s,x=byId(C.skills,id);if(!x||s.owned_skills.includes(id))return false;
      const price=source==='shop'?GRADE_PRICES[x.grade]:0;if(s.money<price)return false;
      if(price)this.apply({money:-price});s.owned_skills.push(id);this.apply(x.gain||{});
      if(x.delay)s.delayed.push({day:s.day+1,effects:copy(x.delay),name:x.name});
      this.log(`문자스킬 습득 · ${x.name}${price?' (−'+moneyText(price)+'원)':''}.`);this.save();return true;
    }
    chooseSkill(i) {
      const s=this.s,p=s.pending;if(p?.kind!=='skills')return false;
      if(i!==-1){if(!Number.isInteger(i)||!p.ids[i]||!this.acquireSkill(p.ids[i],p.source))return false;}
      s.pending=null;
      if(s.phase==='night')this.nextDay();else this.checkDeath();
      this.save();return true;
    }
    requestRemoveSkill(id) {
      if(this.s.phase!=='planning'||this.s.pending||!this.s.owned_skills.includes(id))return false;
      this.s.pending={kind:'remove-skill',id};this.save();return true;
    }
    confirmRemoveSkill(yes) {
      const s=this.s,p=s.pending;
      if(p?.kind!=='remove-skill')return false;
      const skill=byId(C.skills,p.id);s.pending=null;
      if(yes&&skill&&s.owned_skills.includes(p.id)) {
        s.owned_skills.splice(s.owned_skills.indexOf(p.id),1);
        if(skill.gain?.max_mental)this.apply({max_mental:-skill.gain.max_mental});
        this.log(`문자스킬 해제 · ${skill.name}. 지속 효과 종료.`);
      }
      this.save();return true;
    }
    requestRelease(id) {
      if(this.s.phase!=='planning'||this.s.pending||!this.s.ghosts.some(g=>g.id===id&&g.state==='active'))return false;
      this.s.pending={kind:'release',id};this.save();return true;
    }
    confirmRelease(yes) {
      const s=this.s,p=s.pending;if(p?.kind!=='release')return false;
      const g=s.ghosts.find(g=>g.id===p.id&&g.state==='active');s.pending=null;if(!yes||!g){this.save();return true;}
      const name=byId(C.ghosts,g.id).name,risk=this.releaseRisk();
      if(s.release_wards>0){s.release_wards--;this.log('해방 보호 매듭 1개 사용.');}
      this.apply({mental:-5});if(s.phase==='dead')return true;
      if(this.rand()<risk){
        if(this.rand()<.48){g.state='possessed';s.pending={kind:'notice',title:'해방 실패 · 빙의',body:`${name}이(가) 몸 안에 정착했다. 제거 불가.\n\n기존 패널티에 매일 정신력 −2, 신기 +1이 추가된다.`};}
        else {g.state='bound';s.pending={kind:'notice',title:'해방 실패 · 지박',body:`${name}이(가) 이 장소에 묶였다. 생존하는 동안 제거할 수 없다.`};}
        this.log(`해방 실패 · ${name} ${g.state==='possessed'?'빙의':'지박'}.`);
      }else{
        s.ghosts.splice(s.ghosts.indexOf(g),1);this.apply({spirit:-8,mental:4});
        const reward=this.grantReleaseReward();
        s.scene.action='ghost';s.scene.tone='release';
        s.pending={kind:'notice',title:'해방 성공',body:`${name}을(를) 떠나보냈다.\n신기 −8, 정신력 +4.\n${reward}`};this.log(`해방 성공 · ${name}. ${reward}`);
      }
      this.save();return true;
    }
    grantReleaseReward(){
      const s=this.s, relics=(C.relics||[]).filter(x=>!s.relics.includes(x.id));
      const unowned=(C.questItems||[]).filter(x=>!s.quest_items.includes(x));
      if(relics.length&&(this.rand()<.65||!unowned.length)){
        const r=this.takeRandom(relics);s.relics.push(r.id);return `유품 획득 · ${r.name} (${r.desc})`;
      }
      if(unowned.length){const name=this.takeRandom(unowned);s.quest_items.push(name);return `퀘스트 물품 획득 · ${name}`;}
      this.apply({money:14000});return '남겨진 봉투에서 자금 14,000원을 얻었다.';
    }
    requestWish(){const s=this.s;if(s.phase!=='planning'||s.pending||!s.owned_skills.includes('clown')||s.wish_spent.includes('clown'))return false;s.pending={kind:'wish'};this.save();return true;}
    grantWish(i){const s=this.s;if(s.pending?.kind!=='wish'||s.wish_spent.includes('clown')||i<0||i>2)return false;s.pending=null;s.wish_spent.push('clown');const fx=[{money:80000},{health:35},{mental:40}][i];this.apply(fx);if(s.phase!=='dead'){this.log('노란어릿광대 소원 · '+this.effectsText(fx));s.pending={kind:'notice',title:'소원은 한 번뿐',body:this.effectsText(fx)+'\n\n남은 소원: 0/1'};}this.save();return true;}
    finishDay() {
      const s=this.s;if(s.phase!=='running')return false;
      s.pending=null;let sleepNote=`수면 ${s.sleep_today}시간`;
      if(s.sleep_today<=4){const n=22+(4-s.sleep_today)*3;this.apply({health:-n,mental:-8,spirit:11});sleepNote+=` · 심각한 수면 부족! 건강 −${n}, 정신력 −8, 신기 +11`;}
      else if(s.sleep_today<=6){this.apply({health:-5});sleepNote+=' · 피로 누적: 건강 −5';}
      else if(s.sleep_today>=12){const penalty=24+(s.sleep_today-11)*7;this.apply({mental:-penalty});sleepNote+=` · 과수면: 정신력 −${penalty}`;}
      else sleepNote+=' · 충분한 수면';
      this.log(sleepNote);if(s.phase==='dead')return true;
      for(const id of s.owned_skills){const x=byId(C.skills,id);this.apply(x?.daily);if(s.phase==='dead')return true;}
      for(const g of s.ghosts){const x=byId(C.ghosts,g.id);this.apply(x?.daily);if(s.phase==='dead')return true;if(g.state==='possessed'){this.apply({mental:-2,spirit:1});if(s.phase==='dead')return true;}}
      for(const id of s.relics||[]){this.apply(byId(C.relics||[],id)?.daily);if(s.phase==='dead')return true;}
      const paid=Math.min(18000,s.money);this.apply({money:-18000});
      if(paid<18000){s.unpaid_days=(s.unpaid_days||0)+1;this.apply({health:-Math.min(72,6+10*s.unpaid_days),mental:-Math.min(25,2+3*s.unpaid_days)});this.log('체납 · 생활비를 충당하지 못했다.');}
      else s.unpaid_days=0;
      this.log('생활비 · −18,000원. 패시브 일일 정산 완료.');
      if(s.phase==='dead')return true;
      const r=this.rand(),k=s.wealth+s.luck;
      const fortuneEligible=s.sleep_today<12&&s.schedule.some(a=>['work','walk','meal','research','purify'].includes(a));
      if(fortuneEligible&&k>0&&r<bounded(.16+k*.012,.05,.72)){const v=7000+this.randInt(0,21000);this.apply({money:v});this.log(`재물운 발동 · 우연한 횡재 +${moneyText(v)}원.`);}
      else if(fortuneEligible&&k<0&&r<bounded(-k*.055,0,.65)){this.apply({money:-12000,mental:-3});this.log('불운 · 생활 물품 파손 −12,000원, 정신력 −3.');}
      if(s.phase==='dead')return true;
      s.phase='night';s.scene={title:'하루의 끝',body:'오늘의 일정을 모두 마쳤다. 거리의 불빛이 하나둘 줄어든다.',action:'home',hour:23,day:s.day};if([3,7,14].includes(s.day)){this.log(`생존 이정표 · ${s.day}일.`);s.milestones.push(s.day);}
      const d=s.day_start;
      const delta=(key,unit='')=>`${s[key]-d[key]>=0?'+':'−'}${moneyText(Math.abs(s[key]-d[key]))}${unit}`;
      s.pending={kind:'report',title:`${String(s.day).padStart(2,'0')}일차 · 심야 결산`,body:`오늘의 24시간이 끝났다.\n\n${sleepNote}\n\n자금 ${moneyText(s.money)}원 (${delta('money','원')})\n건강 ${s.health} (${delta('health')})\n정신력 ${s.mental} (${delta('mental')})\n신기 ${s.spirit} (${delta('spirit')})${s.day===7?'\n\n★ 1차 목표 달성! 7일간 살아남았다. 계속 생존할 수 있다.':''}`};
      this.save();return true;
    }
    openShop() {const s=this.s;if(s.phase!=='night'||s.pending?.kind!=='report')return false;const ids=this.drawSkills(this.randInt(2,4));s.pending=null;s.scene={title:'경계의 상점',body:'모니터가 꺼지지 않는다. 판매 목록은 창을 닫으면 다시 열리지 않는다.',action:'monitor',hour:0,day:s.day};if(ids.length)s.pending={kind:'skills',source:'shop',ids};else this.nextDay();this.save();return true;}
    nextDay() {
      const s=this.s;if(s.phase!=='night')return false;
      s.day++;s.hour=0;s.sleep_today=0;s.phase='planning';s.pending=null;s.research_found_today=0;s.research_attempts_today=0;s.event_count_day=0;
      s.scene={title:'새로운 아침',body:'24시간이 다시 시작된다. 어제의 선택은 오늘의 생활에 조금씩 남아 있다.',action:'home',hour:6,day:s.day};
      const later=[];
      for(const queued of s.delayed){if(queued.day<=s.day){this.apply(queued.effects);this.log(`지연 효과 · ${queued.name}: ${this.effectsText(queued.effects)}`);}else later.push(queued);}
      s.delayed=later;s.day_start=this.snapshot();
      if(s.phase!=='dead')this.log('새로운 하루. 이전 일정이 유지된다. 다시 편성할 수 있다.');
      this.save();return true;
    }
    closeNotice(){if(this.s.pending?.kind!=='notice')return false;this.s.pending=null;if(this.s.phase==='running'&&this.s.hour>=24)this.finishDay();this.save();return true;}
    debugChange(key, amount) {if(!Object.hasOwn(STAT_LABELS,key)||this.s.phase==='dead')return false;this.apply({[key]:amount});this.log(`[테스트] ${STAT_LABELS[key]} ${amount>=0?'+':''}${amount}`);this.save();return true;}
    debugSkill(id) {if(this.s.phase==='dead')return false;const ok=this.acquireSkill(id,'research');return ok;}
    debugGhost(id) {if(this.s.phase==='dead'||!byId(C.ghosts,id)||this.s.ghosts.some(g=>g.id===id))return false;this.s.ghosts.push({id,state:'active'});this.log('[테스트] 유령 추가 · '+byId(C.ghosts,id).name);this.save();return true;}
    debugClearPending() {if(!this.s.pending)return false;if(this.s.pending.kind==='skills')return this.chooseSkill(-1);if(this.s.pending.kind==='notice')return this.closeNotice();if(this.s.pending.kind==='report')return this.openShop();if(this.s.pending.kind==='release')return this.confirmRelease(false);return false;}
    save() {if(!this.storage)return false;try{this.storage.setItem(SAVE_KEY,JSON.stringify(this.s));this.storageError=false;return true;}catch(e){this.storageError=true;return false;}}
    load() {if(!this.storage)return false;try{const raw=this.storage.getItem(SAVE_KEY)||this.storage.getItem(LEGACY_SAVE_KEY)||this.storage.getItem(OLD_SAVE_KEY);if(!raw)return false;return this.importJSON(raw,true);}catch(e){this.storageError=true;return false;}}
    exportJSON() {return JSON.stringify(this.s,null,2);}
    importJSON(raw, persist=true) {
      let x;
      try{x=JSON.parse(raw);}catch(e){return false;}
      if(!x||![2,4,5].includes(x.version)||!Array.isArray(x.schedule)||x.schedule.length!==24||!x.schedule.every(id=>id===null||byId(C.actions,id))||
         (x.phase!=='planning'&&x.schedule.includes(null))||
         !['planning','running','night','dead'].includes(x.phase)||!Number.isInteger(x.day)||x.day<1||x.day>99999||
         !Number.isInteger(x.hour)||x.hour<0||x.hour>24||!Array.isArray(x.owned_skills)||
         !x.owned_skills.every(id=>byId(C.skills,id))||!Array.isArray(x.ghosts)||
         !x.ghosts.every(g=>byId(C.ghosts,g?.id)&&['active','bound','possessed'].includes(g.state))||
         !Number.isFinite(x.rng)||!Array.isArray(x.logs)||!Array.isArray(x.delayed)||
         !['money','health','mental','mental_max','spirit','luck','wealth','bond','omen','clues'].every(k=>Number.isFinite(x[k]))||
         !Number.isInteger(x.meal_index)||x.meal_index<0||x.meal_index>=C.meals.length||
         (x.pending!==null&&typeof x.pending!=='object'))return false;
      // Save format is intentionally JSON-editable for development, with validation of essential fields.
      const fresh=this.initialState();
      const migrated={...fresh,...copy(x),version:5};
      // Older saves had no scene or research/branching counters.
      for(const k of ['relics','quest_items','event_history','next_events','scene_history'])if(!Array.isArray(migrated[k]))migrated[k]=[];
      for(const k of ['research_found_today','research_attempts_today','release_wards','event_count_day'])if(!Number.isFinite(migrated[k]))migrated[k]=0;
      if(!Number.isInteger(migrated.unpaid_days))migrated.unpaid_days=0;
      if(!migrated.scene||typeof migrated.scene!=='object')migrated.scene=fresh.scene;
      this.s=migrated;if(persist)this.save();return true;
    }
  }
  root.YGEngine={Game,CONTENT:C,SAVE_KEY,STAT_LABELS,GRADE_PRICES,moneyText};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.YGEngine;
})(typeof window!=='undefined'?window:globalThis);
