import json
from pathlib import Path
root=Path(__file__).parent
skills=[]
def skill(name, grade, gain=None, daily=None, bonus=None, delay=None):
 i=len(skills)+1; x=dict(id=f'v5_sk_{i:02}',name=name,grade=grade)
 for k,v in [('gain',gain),('daily',daily),('bonus',bonus),('delay',delay)]:
  if v:x[k]=v
 def eff(o):
  labels={'money':'자금','health':'건강','mental':'정신력','spirit':'신기','luck':'행운','wealth':'재물운','bond':'인연운','omen':'영감운','clues':'강령 단서','max_mental':'정신력 최대치','job_extra':'알바 수입','sleep_extra':'수면 건강 회복','study_extra':'조사 숙련','purify_extra':'정화 효율','meal_health':'식사 건강 회복','meal_mental':'식사 정신 회복','rest_extra':'휴식 회복','ritual_bonus':'강령 성공률'}
  return ', '.join(f'{labels.get(k,k)} {"+" if v>0 else ""}{v}' for k,v in o.items())
 parts=[]
 for k,v in [('gain',gain),('daily',daily),('bonus',bonus),('delay',delay)]:
  if v:parts.append(('습득 시 ' if k=='gain' else '매일 ' if k=='daily' else '지속 ' if k=='bonus' else '다음 날 ')+eff(v))
 x['desc']='. '.join(parts)+'.';skills.append(x)
# 0 등급
skill('버스 창에 비친 빛',0,{'mental':3,'luck':1},{'health':-1})
skill('두 번 접은 영수증',0,{'money':9000,'wealth':1},{'mental':-1})
skill('얕은 물에 쓴 이름',0,{'spirit':-3},{'mental':-1})
skill('부러진 연필심',0,{'omen':1},{'health':-1})
skill('서랍 밑의 오원',0,{'money':5000},{'wealth':1,'mental':-1})
skill('거꾸로 맨 매듭',0,{'luck':2},{'spirit':1})
skill('손바닥의 성냥갑',0,{'mental':5},{'health':-1})
skill('작은 창문 네 개',0,{'health':4},{'mental':-1})
skill('노란 점선 한 줄',0,{'bond':1},{'money':-700})
skill('덜 마른 수건',0,{'mental':2},{'spirit':-1,'health':-1})
skill('침대 밑의 동전',0,{'wealth':2},{'mental':-2})
skill('녹색 문고리',0,{'clues':1},{'spirit':1})
skill('빈 초인종',0,{'bond':2},{'luck':-1})
skill('어젯밤의 달력',0,{'mental':7},{'mental':-1},delay={'luck':1})
# 1 등급
skill('낡은 회중시계',1,{'luck':2},{'mental':-2}, {'rest_extra':2})
skill('차가운 빗물받이',1,{'spirit':-6},{'health':-2}, {'purify_extra':2})
skill('문지방의 소금',1,{'mental':10},{'money':-1800}, {'purify_extra':1})
skill('끝나지 않는 점호',1,{'money':12000},{'health':-3}, {'job_extra':3000})
skill('도시의 낮은 울음',1,{'omen':2},{'mental':-3})
skill('여섯 번째 우편함',1,{'bond':3},{'spirit':1,'mental':-2})
skill('접힌 처방전',1,{'health':12},{'money':-3000})
skill('손끝으로 읽는 지도',1,{'clues':2},{'mental':-3}, {'study_extra':3})
skill('마른 국화 한 송이',1,{'luck':3},{'health':-2})
skill('재봉틀의 검은 실',1,{'wealth':2},{'spirit':1}, {'job_extra':3500})
skill('반쯤 닫힌 커튼',1,{'mental':15},{'health':-2}, {'sleep_extra':1})
skill('눈감은 교통신호',1,{'luck':2},{'wealth':-1}, {'rest_extra':3})
skill('유리컵 속의 종이',1,{'spirit':-8},{'mental':-4})
skill('오래된 야간 통행증',1,{'wealth':3},{'luck':-2,'health':-1})
skill('문틈의 회색 깃털',1,{'omen':3},{'spirit':2})
skill('끊어진 전화선',1,{'mental':5},{'luck':-1}, {'ritual_bonus':7})
# 2 등급
skill('이름 없는 저금통',2,{'money':30000},{'mental':-4}, {'job_extra':7500})
skill('새벽의 이중 장부',2,{'wealth':5},{'luck':-3,'spirit':1})
skill('열리지 않는 사물함',2,{'max_mental':10},{'health':-4,'spirit':1})
skill('역순으로 흐른 강',2,{'spirit':-12},{'mental':-6}, {'purify_extra':4})
skill('흐릿한 가족사진',2,{'bond':5},{'mental':-4,'spirit':2})
skill('매장된 버스 노선',2,{'luck':5},{'health':-4}, {'job_extra':6500})
skill('빈 의자의 주인',2,{'mental':25},{'mental':-6,'spirit':2})
skill('소리가 나지 않는 종',2,{'clues':4},{'spirit':2,'health':-3})
skill('열두 장의 흑백 사진',2,{'omen':4},{'mental':-4}, {'study_extra':6})
skill('묻힌 계좌번호',2,{'money':50000},{'mental':-8,'luck':-2})
skill('식탁의 네 번째 접시',2,{'max_mental':12},{'spirit':3}, {'meal_mental':4})
skill('아직 켜진 장례식장',2,{'health':20},{'health':-5,'spirit':2}, {'rest_extra':5})
skill('밤거울의 반사광',2,{'luck':3,'omen':3},{'mental':-5})
skill('바닥에 놓인 발자국',2,{'clues':3},{'spirit':3}, {'ritual_bonus':12})
# 3 등급
skill('죽은 사람이 낸 월세',3,{'money':100000},{'mental':-14,'health':-5,'spirit':3})
skill('그 누구의 첫 번째 숨',3,{'health':40},{'mental':-12,'spirit':4}, {'sleep_extra':3})
skill('동공 안의 빈 방',3,{'max_mental':25},{'health':-7,'spirit':5})
skill('새벽 네 시의 공문',3,{'wealth':10},{'luck':-6,'mental':-10})
skill('끝내 지우지 않은 이름',3,{'spirit':-25},{'health':-12,'mental':-7}, {'purify_extra':8})
skill('백 번째 부재중 전화',3,{'clues':8},{'spirit':5,'mental':-12}, {'ritual_bonus':18})
skill('전등 아래의 검은 눈',3,{'omen':8},{'health':-6,'spirit':6})
skill('내일의 가계부',3,{'money':70000,'luck':5},{'mental':-15,'spirit':4}, {'job_extra':12000})
skill('정오에 닫는 지하실',3,{'health':30,'mental':25},{'luck':-5,'spirit':8})
skill('우물 바닥의 두 번째 하늘',3,{'spirit':-18,'mental':30},{'health':-8,'wealth':-3})
skill('마지막 종점의 승차권',3,{'money':120000},{'mental':-18,'spirit':5,'bond':-3})
skill('아무것도 적지 않은 유언장',3,{'max_mental':30},{'health':-10,'mental':-10,'spirit':6})

ghosts=[]
def ghost(name,story,bonus,daily):
 i=len(ghosts)+1;x={'id':f'v5_gh_{i:02}','name':name,'story':story,'bonus':bonus,'daily':daily}
 labels={'money':'자금','health':'건강','mental':'정신력','spirit':'신기','luck':'행운','wealth':'재물운','bond':'인연운','omen':'영감운','job_extra':'알바 수입','rest_extra':'휴식 정신력 회복','study_extra':'조사 숙련','ritual_bonus':'강령 성공률','purify_extra':'정화 효율','sleep_extra':'수면 건강 회복','meal_health':'식사 건강 회복','meal_mental':'식사 정신력 회복'}
 def f(d):return ', '.join(f'{labels.get(k,k)} {v:+}' for k,v in d.items())
 x['desc']='지속 '+f(bonus)+'. 매일 '+f(daily)+'.';ghosts.append(x)
ghost('빈 방의 하숙생','빨래를 걷지 못하고 매일 같은 창을 바라본다.',{'rest_extra':8},{'mental':-8,'health':-3,'spirit':2})
ghost('교차로의 택시 기사','목적지를 묻기 전에 미터기를 켠다.',{'job_extra':22000},{'mental':-10,'health':-2,'spirit':4})
ghost('초등학교의 당직자','누구도 듣지 않는 출석을 매일 부른다.',{'study_extra':11},{'mental':-7,'spirit':3,'luck':-1})
ghost('세탁소의 여자','돌아오지 않은 교복을 아직 다리고 있다.',{'meal_health':9},{'health':-6,'mental':-5,'spirit':2})
ghost('지하주차장의 관리인','경비실에 누가 지나갈 때마다 손을 든다.',{'job_extra':17000,'rest_extra':3},{'health':-7,'mental':-7,'spirit':3})
ghost('전파를 타는 어린아이','목소리만 남아 끊임없이 전화벨을 울린다.',{'ritual_bonus':23},{'mental':-11,'health':-4,'spirit':5})
ghost('종이배를 접는 노인','물길을 따라 모든 이름이 흘러간다고 말한다.',{'purify_extra':11},{'health':-8,'mental':-3,'spirit':3})
ghost('야간 약국의 약사','포장지가 없는 약을 하나씩 헤아린다.',{'sleep_extra':5},{'health':-4,'mental':-9,'spirit':4})
ghost('낡은 복도의 안내원','열쇠구멍을 통해 절대 들어가지 말라고 웃는다.',{'study_extra':9,'ritual_bonus':7},{'mental':-9,'spirit':5})
ghost('흰 가운을 입은 남자','진료기록에 없는 환자를 부르고 있다.',{'meal_health':11},{'health':-7,'mental':-7,'spirit':3})
ghost('촬영되지 않은 사진사','비어 있는 곳을 향해 셔터를 누른다.',{'ritual_bonus':18},{'mental':-8,'spirit':5,'luck':-1})
ghost('가로등 아래의 배달원','배달완료 문자가 새벽마다 온다.',{'job_extra':26000},{'health':-12,'mental':-5,'spirit':3})
ghost('우편번호가 없는 집배원','없는 동네의 편지를 매일 배달한다.',{'study_extra':14},{'health':-6,'mental':-11,'spirit':3})
ghost('창문 닦는 청소부','밖에서는 안이 보이지 않는다고 한다.',{'purify_extra':13},{'mental':-11,'spirit':4,'luck':-1})
ghost('어린이집의 원장','그림 속 사람들의 이름을 전부 기억한다.',{'meal_mental':8},{'health':-4,'mental':-12,'spirit':4})
ghost('새벽 경비초소의 신병','교대자가 오지 않아 아직 철야 중이다.',{'job_extra':12000,'rest_extra':6},{'mental':-14,'health':-7,'spirit':3})
ghost('지하역의 노숙자','마지막 열차가 몇 년 늦었다고 투덜거린다.',{'sleep_extra':8},{'mental':-16,'spirit':6})
ghost('발신자 없는 상담원','매번 다른 목소리로 안부를 묻는다.',{'study_extra':16,'ritual_bonus':8},{'health':-8,'mental':-12,'spirit':5})
ghost('냉동창고의 정육점 주인','저울에 올라온 무게를 세는 일을 멈추지 못한다.',{'meal_health':13},{'mental':-17,'health':-6,'spirit':4})
ghost('분실물 센터의 직원','찾으러 오는 사람이 없는 물건을 보관한다.',{'rest_extra':10},{'mental':-13,'luck':-2,'spirit':5})
ghost('엘리베이터의 노부인','층 버튼을 누르지 않고도 맨 위에서 내려온다.',{'ritual_bonus':29},{'health':-9,'mental':-12,'spirit':6})
ghost('시외버스의 검표원','표를 찢고도 다시 돌려준다.',{'job_extra':34000},{'health':-11,'mental':-12,'spirit':6})
ghost('고장 난 시계의 장인','초침이 멈춘 시간의 값을 계산한다.',{'study_extra':20},{'mental':-16,'spirit':6})
ghost('사라진 등산객','발견 당시 발자국이 하나도 없었다.',{'purify_extra':14,'sleep_extra':3},{'health':-12,'mental':-9,'spirit':6})
ghost('버려진 공장의 사장','가동 중인 기계가 하나 더 있다고 주장한다.',{'job_extra':38000},{'health':-15,'mental':-14,'spirit':7})
ghost('익명의 장의사','누구도 주문하지 않은 관을 미리 만든다.',{'ritual_bonus':32,'study_extra':9},{'health':-15,'mental':-18,'spirit':8})
ghost('보이지 않는 동거인','냉장고의 음식이 두 사람분씩 사라진다.',{'rest_extra':13,'meal_mental':7},{'health':-11,'mental':-19,'spirit':8})

meals=[
 ('삼각김밥과 생수',3600,1,0,0),('컵라면',4200,1,3,0),('죽 한 그릇',9500,5,2,0),('계란 토스트',6500,3,4,0),('김치찌개',12500,7,2,0),('샐러드 도시락',13500,8,0,0),('냉동 볶음밥',6500,3,2,0),('분식 세트',9500,4,6,0),('갈비탕',19000,10,3,0),('회덮밥',16000,7,5,0),('커피와 빵',8700,1,7,0),('냉장고 남은 반찬',2500,0,1,0),('한정식 배달',31000,13,7,0),('비상식량 통조림',6500,2,1,0),('사찰식 채식',23000,8,4,-1),('새벽 편의점 핫바',4300,2,3,0),('장어구이 정식',40000,16,8,0),('늦은 밤 치킨',22500,6,11,1),('과일과 요거트',11800,7,4,0),('라면과 달걀',5100,3,2,0),('쌀국수',13500,8,6,0),('손수 만든 미역국',11500,9,3,-1)]
mealObjs=[dict(name=n,price=p,health=h,mental=m,spirit=s) for n,p,h,m,s in meals]

# Compact, hand-authored hour/action-dependent events with both everyday and costly consequences.
# action | tone | title | setting | choice A | delta A | choice B | delta B
E={
'work':[
 ('bad','불량 계산대','장부의 숫자가 맞지 않는다. 점장은 손실부터 계산한다.','내 돈으로 메운다',{'money':-17000,'mental':-2},'점장과 확인한다',{'mental':-7,'bond':-1}),
 ('good','손님이 두고 간 팁','늦은 손님이 잔돈을 받지 않고 나간다.','돌려주려 뛰어나간다',{'bond':2,'luck':1},'팁으로 남긴다',{'money':8000}),
 ('bad','예고 없는 연장 근무','마감 시간에도 손님이 줄지 않는다.','마지막까지 돕는다',{'health':-6,'mental':-4,'money':14000},'정시에 퇴근한다',{'bond':-2,'mental':-2}),
 ('bad','미끄러운 창고 바닥','박스를 옮기다 물기 있는 바닥에서 미끄러졌다.','병원에 간다',{'money':-27000,'health':5},'참고 일한다',{'health':-13,'money':9000}),
 ('good','점심 도시락','직원이 반찬을 조금 더 챙겨 주었다.','함께 먹는다',{'health':5,'mental':3,'bond':1},'퇴근 후 먹는다',{'health':3}),
 ('bad','재고 조사','분실된 재고의 책임을 서로에게 떠넘긴다.','오래 남아 확인한다',{'health':-3,'mental':-6,'money':9000},'일단 물러난다',{'bond':-2,'luck':-1}),
 ('neutral','새로 온 동료','새 직원은 웃으며 일의 순서를 묻는다.','차근차근 알려준다',{'mental':-2,'bond':2},'매뉴얼을 건넨다',{'bond':1}),
 ('bad','결근자 대신 교대','점장에게 급한 연락이 왔다.','추가 수당을 받는다',{'money':18000,'health':-8},'오늘은 어렵다고 한다',{'bond':-1}),
 ('good','가게 앞의 분실물','카운터 아래에 오래된 지갑이 끼어 있다.','보관함에 둔다',{'bond':2,'luck':1},'무시한다',{'mental':-2}),
 ('bad','가벼운 감전','오래된 커피 기계에서 파란 불꽃이 튄다.','수리를 요청한다',{'money':-4000,'health':-2},'그냥 사용한다',{'health':-11,'mental':-3}),
 ('bad','주문 실수','서로 다른 주문이 한 번에 밀려들었다.','차액을 변상한다',{'money':-13000},'손님을 설득한다',{'mental':-9,'bond':-1}),
 ('good','단골의 소개','단골이 주말 단기 알바를 알려 준다.','연락처를 받는다',{'bond':2,'wealth':1},'관심 없다고 한다',{'mental':1})],
'meal':[
 ('bad','식은 배달','배달된 음식이 문 앞에서 한참을 식었다.','다시 주문한다',{'money':-16000,'health':5},'그냥 먹는다',{'health':-5,'mental':-2}),
 ('good','서비스 군만두','배달봉투 안에 주문하지 않은 작은 종이봉투가 있다.','음식을 먹는다',{'health':3,'mental':4},'배달원에게 연락한다',{'bond':1,'mental':2}),
 ('bad','상한 우유','우유는 유통기한이 지나 있지 않지만 냄새가 이상하다.','버리고 새로 산다',{'money':-6500},'아깝지만 마신다',{'health':-11}),
 ('neutral','편의점의 침묵','옆자리 손님이 같은 도시락을 고른다.','자리를 양보한다',{'bond':1,'mental':1},'혼자 먹는다',{'mental':2}),
 ('bad','닫힌 분식집','퇴근길에 들른 식당의 셔터가 내려와 있다.','다른 곳을 찾는다',{'money':-6000,'mental':1},'먹지 않고 돌아온다',{'health':-5,'mental':-2}),
 ('good','어머니의 반찬','냉장고 맨 아래에 익숙한 반찬통 하나가 있다.','조금 데워 먹는다',{'health':4,'mental':5},'내일로 남긴다',{'mental':1}),
 ('bad','배달 결제 오류','앱에는 두 번 결제가 찍혔다.','환불을 요청한다',{'mental':-4,'money':-3000},'그냥 넘어간다',{'money':-17000}),
 ('good','뜨거운 국물','추운 날 국물 한 숟가락이 속을 데운다.','천천히 마신다',{'health':4,'mental':4},'서둘러 먹는다',{'health':3}),
 ('bad','찢어진 포장','배달 봉투에 있던 국물이 바닥까지 흘렀다.','바닥을 닦고 다시 산다',{'money':-14000,'mental':-3},'남은 음식을 먹는다',{'health':-6}),
 ('neutral','낯선 합석','식당의 자리가 모자라 낯선 사람이 앞에 앉았다.','말을 걸어 본다',{'bond':1,'mental':-1},'조용히 식사한다',{'mental':2})],
'walk':[
 ('bad','꺼진 횡단보도','신호등이 꺼지고 차량들이 느리게 지나간다.','멀리 돌아간다',{'health':-2,'mental':-2},'급하게 건넌다',{'health':-9,'luck':-1}),
 ('good','길고양이의 기지개','문 아래 고양이 한 마리가 잠을 깼다.','가만히 쓰다듬는다',{'mental':6,'bond':1},'멀리서 지켜본다',{'mental':3}),
 ('bad','자전거와 접촉','좁은 골목에서 배달 자전거가 손목을 스친다.','의원에 다녀온다',{'money':-19000,'health':2},'문지르고 끝낸다',{'health':-8}),
 ('good','바람 빠진 풍선','벤치 아래 흰 풍선 하나가 천천히 움직인다.','아이에게 돌려준다',{'bond':2,'luck':1},'그냥 지나간다',{'mental':1}),
 ('neutral','동네 게시판','오래된 구인 광고를 본다.','전화번호를 적는다',{'wealth':1,'mental':-1},'동네 소식만 읽는다',{'mental':2}),
 ('bad','나쁜 날씨','갑자기 비가 쏟아져 옷이 다 젖었다.','우산을 산다',{'money':-13500},'그냥 걸어간다',{'health':-7,'mental':-3}),
 ('good','길가의 꽃집','점원이 시들어 가는 꽃 한 송이를 무료로 건넨다.','꽃을 받는다',{'mental':5,'luck':1},'사양한다',{'bond':1}),
 ('bad','찢어진 운동화','신발 밑창이 갈라졌다.','수선점을 찾는다',{'money':-17000,'health':1},'테이프로 붙인다',{'health':-4}),
 ('good','동네 약수터','사람들이 차분히 줄을 서서 물을 담는다.','물을 마신다',{'health':4,'mental':2},'벤치에 앉는다',{'mental':5}),
 ('bad','낯선 길','익숙한 골목이 끝나지 않고 길게 이어진다.','지도 앱을 연다',{'mental':-4,'spirit':1},'길 끝까지 간다',{'mental':-8,'spirit':4})],
'research':[
 ('bad','소멸된 블로그','찾던 블로그의 글은 전부 삭제되어 있다.','캐시를 살핀다',{'mental':-5,'clues':1},'미련 없이 닫는다',{'mental':1}),
 ('bad','유료 복구 프로그램','오래된 게시글을 복구하려면 결제가 필요하다는 창이 뜬다.','정식 이용권을 구매한다',{'money':-21000,'clues':1},'불법 경로를 찾는다',{'mental':-8,'spirit':3}),
 ('good','익명 제보','낯선 이용자가 관련 자료를 보내 주겠다고 한다.','답장을 보낸다',{'bond':1,'clues':1},'파일을 삭제한다',{'mental':2}),
 ('neutral','공공 도서관 기록','전자도서관에 오래된 지역지의 목차가 남아 있다.','연도를 추적한다',{'clues':2,'mental':-2},'목차만 기록한다',{'clues':1}),
 ('bad','유출된 개인정보','낯선 파일 안에 자신의 주소가 적혀 있다.','파일을 파기한다',{'mental':-4,'spirit':-1},'끝까지 열어본다',{'mental':-9,'spirit':5}),
 ('good','한밤의 댓글','삭제된 글 아래 늦은 답글 하나가 달려 있다.','대화를 시도한다',{'clues':2,'bond':1},'원문을 저장한다',{'clues':1}),
 ('bad','피싱 창','방금 열어 본 페이지가 카드번호를 요구한다.','즉시 창을 닫는다',{'mental':-2},'안내를 따른다',{'money':-25000,'mental':-4}),
 ('neutral','오래된 신문 광고','도시 개발 이전의 지도가 이미지로 올라와 있다.','인쇄한다',{'money':-2500,'clues':2},'메모한다',{'clues':1}),
 ('bad','터진 노트북 충전기','멀티탭에서 탁 하는 소리와 함께 연기가 난다.','충전기를 교체한다',{'money':-33000,'health':-1},'그대로 둔다',{'health':-12,'mental':-4}),
 ('good','잊힌 문자 사전','작은 문헌에 동일한 기호의 여러 표기가 기록되어 있다.','원문을 대조한다',{'clues':2,'omen':1},'마음을 가라앉힌다',{'mental':4})],
'ritual':[
 ('bad','꺼진 촛불','강령진 한가운데의 불꽃이 미동 없이 사라졌다.','다시 불을 붙인다',{'spirit':3,'mental':-5},'의식을 중단한다',{'spirit':-2,'mental':-2}),
 ('bad','알 수 없는 발자국','마른 바닥에 젖은 발자국이 하나씩 생긴다.','문을 연다',{'health':-6,'spirit':5},'눈을 감고 센다',{'mental':-8,'spirit':2}),
 ('neutral','반대로 도는 시계','초침이 한 칸씩 거꾸로 움직인다.','시간을 적는다',{'clues':2,'spirit':3},'배터리를 뺀다',{'mental':2}),
 ('bad','거울 속의 옆얼굴','거울 가장자리에 모르는 사람의 옆얼굴이 스친다.','거울을 덮는다',{'money':-4000,'spirit':-2},'이름을 부른다',{'spirit':8,'mental':-7}),
 ('good','잠깐의 고요','강령진의 소음이 일순간 멎는다.','기록을 남긴다',{'clues':2},'조금 쉰다',{'mental':5}),
 ('bad','금속성 웃음','냄비 뚜껑 안쪽에서 잔잔한 웃음이 난다.','소금을 뿌린다',{'money':-6000,'spirit':-3},'소리에 귀를 기울인다',{'mental':-11,'spirit':5}),
 ('bad','의식의 역류','잘못 쓴 기호 하나가 새까맣게 타들어 간다.','기호를 지운다',{'mental':-4,'spirit':-2},'끝까지 버틴다',{'health':-9,'mental':-5,'spirit':6}),
 ('neutral','미완의 이름','강령 중 누군가의 이름 마지막 글자만 들렸다.','기록해 둔다',{'clues':2,'mental':-3},'잊으려 한다',{'mental':2}),
 ('bad','자기 목소리의 답장','세 번 부른 이름이 자신의 목소리로 되돌아왔다.','즉시 중단한다',{'mental':-4,'spirit':1},'네 번째 이름을 부른다',{'spirit':10,'health':-7})],
'purify':[
 ('good','따뜻한 재','향의 재가 바람 없이 제자리에 떨어진다.','차분히 기다린다',{'spirit':-4,'mental':2},'남은 재를 모은다',{'clues':1}),
 ('bad','끊어진 염주','낡은 염주가 바닥에 흩어진다.','새 염주를 산다',{'money':-18000,'spirit':-3},'그냥 사용한다',{'spirit':5,'mental':-4}),
 ('bad','이름이 적힌 부적','부적을 뒤집자 자신의 이름이 적혀 있다.','불에 태운다',{'spirit':-5,'health':-3},'보관한다',{'clues':1,'spirit':6}),
 ('good','고운 소금','도자기에 소금을 덜자 숨소리가 또렷해진다.','문턱에 뿌린다',{'spirit':-4,'money':-3000},'작은 병에 담는다',{'mental':4}),
 ('bad','젖은 제문','정성 들여 적은 종이가 물에 젖어 번졌다.','다시 준비한다',{'money':-9000,'mental':-3},'대강 읽는다',{'spirit':4,'mental':-5}),
 ('neutral','정오의 향내','창이 열린 사이 향내가 바깥으로 흘러나간다.','바람을 막는다',{'spirit':-2},'창을 더 연다',{'mental':3}),
 ('bad','다 쓴 소금','소금이 바닥나 정화가 불완전하다.','급히 사 온다',{'money':-17000,'spirit':-2},'오늘은 포기한다',{'spirit':3,'mental':-2}),
 ('good','작은 평안','방 안에 오래 머물던 차가운 기운이 덜하다.','조금 더 정돈한다',{'spirit':-5,'mental':-2},'그냥 쉬어 간다',{'mental':5})],
'rest':[
 ('good','햇볕 드는 의자','잠깐 들어온 빛이 낡은 의자 끝에 걸친다.','창가에 앉는다',{'mental':5},'낮잠을 잔다',{'health':3,'mental':2}),
 ('bad','고장 난 수도꼭지','싱크대 아래에서 물이 조금씩 새어 나온다.','수리 기사를 부른다',{'money':-33000},'수건으로 막는다',{'mental':-6,'health':-2}),
 ('good','친구의 안부','전화기에 이름을 아는 사람이 떠 있다.','통화를 한다',{'mental':7,'bond':1},'문자로 답한다',{'mental':3}),
 ('bad','지나치게 쌓인 청구서','문틈으로 공과금 고지서가 밀려 들어온다.','밀린 돈을 낸다',{'money':-26000,'mental':2},'안 보이는 곳에 넣는다',{'mental':-6,'luck':-1}),
 ('neutral','거실의 낡은 라디오','주파수를 돌리자 오래된 노래가 짧게 흐른다.','조용히 듣는다',{'mental':4},'전원을 끈다',{'mental':2}),
 ('bad','전등이 나간 화장실','형광등이 몇 번 깜박이다 꺼진다.','전구를 교체한다',{'money':-11000,'mental':1},'그냥 둔다',{'mental':-5,'spirit':1}),
 ('good','늦잠 자는 이웃','복도에서 누군가 웃으며 쓰레기 봉투를 건넨다.','도움을 준다',{'bond':2,'mental':2},'고개만 끄덕인다',{'mental':2}),
 ('bad','집 앞의 소음','밤새 공사 소리가 들려온다.','관리실에 항의한다',{'mental':-4,'bond':-1},'참고 있는다',{'mental':-7,'health':-2}),
 ('neutral','빈 찻잔','식탁에 있던 찻잔을 한 번 더 닦는다.','차를 마신다',{'mental':4},'방을 정리한다',{'health':2})],
'sleep':[
 ('bad','밤의 악몽','한밤중 잠에서 깨자 손이 심하게 떨렸다.','물을 마시고 다시 잔다',{'mental':-5,'health':1},'불을 켜 둔다',{'mental':-2,'money':-1000}),
 ('bad','윗집의 쿵 소리','새벽에 무언가 바닥을 끄는 소리가 난다.','귀마개를 낀다',{'mental':-3},'확인하러 나간다',{'mental':-7,'spirit':2}),
 ('good','오랜만의 무몽','아무 꿈도 꾸지 않은 것만 같다.','잠을 유지한다',{'health':3},'일어나 스트레칭한다',{'health':2,'mental':2}),
 ('bad','틀어진 베개','아침에 목을 잘 움직일 수 없다.','마사지한다',{'money':-4000,'health':2},'그냥 참는다',{'health':-6}),
 ('neutral','창틈의 새소리','바깥에서 새 몇 마리가 우는 소리가 들린다.','한동안 듣는다',{'mental':2},'이불을 덮는다',{'health':2}),
 ('bad','차가운 꿈','이불 속에서도 자꾸 추위가 느껴진다.','보일러를 높인다',{'money':-9000,'health':2},'그냥 견딘다',{'health':-5,'mental':-3})]
}
events=[]
for action, rows in E.items():
 for i,(tone,title,body,a,fx,b,fx2) in enumerate(rows,1):
  events.append(dict(id=f'v5_{action}_{i:02}',title=title,body=body,tone=tone,scene={'work':'store','meal':'meal','walk':'street','research':'research','ritual':'ritual','purify':'purify','rest':'rest','sleep':'sleep'}[action],actions=[action],weight=(1.3 if tone=='bad' else .85),options=[dict(label=a,text=f'{title}. {a}.',fx=fx),dict(label=b,text=f'{title}. {b}.',fx=fx2)]))
# Short narrative arcs. Every follow-up is tied to one or more applicable schedules.
arcs=[
 ('postoffice','도착하지 않은 편지','현관 앞에 수신인 없는 편지봉투가 놓여 있다.',['rest','walk'],'봉투를 챙긴다','바로 버린다',{'mental':-2},{'luck':-1},'postoffice_2',1,'store'),
 ('postoffice_2','분실된 주소','봉투 안의 주소는 몇 년 전 지도에서 사라진 곳이다.',['research','walk'],'주소를 찾아본다','그만 추적한다',{'clues':2,'mental':-4},{'mental':3},'postoffice_3',1,'research'),
 ('postoffice_3','돌아온 답장','빈 우편함에서 사흘 전 보낸 적 없는 답장이 나온다.',['rest','walk'],'편지를 소각한다','기록으로 남긴다',{'spirit':-6,'mental':-3},{'clues':2,'spirit':3},None,0,'home'),
 ('night_clinic','심야 의원의 전화','건강검진 예약을 한 적이 없는데 확인 전화가 왔다.',['rest','work'],'진료 시간을 잡는다','전화를 끊는다',{'mental':-2},{'mental':1},'night_clinic_2',1,'home'),
 ('night_clinic_2','일반 진료','낡은 건물 안 의사는 한참 동안 맥박을 잰다.',['walk','purify'],'검사비를 지불한다','검사를 거절한다',{'money':-45000,'health':17,'spirit':-4},{'mental':-6},'night_clinic_3',1,'street'),
 ('night_clinic_3','진료 기록','문자로 전송된 진료 기록에 낯선 이름이 적혀 있다.',['research','rest'],'기록을 보관한다','삭제한다',{'clues':2,'spirit':2},{'spirit':-3},None,0,'research'),
 ('arc_cat','빗길의 고양이','길고양이가 빗속 창고 앞에서 울고 있다.',['walk'],'고양이에게 먹을 것을 준다','지나간다',{'money':-4500,'bond':2},{'mental':-1},'arc_cat_2',1,'street'),
 ('arc_cat_2','낮은 담장의 방문객','어제 보았던 고양이가 같은 자리에서 기다린다.',['walk','meal'],'조용히 인사한다','밥그릇을 채운다',{'mental':6,'luck':1},{'money':-4000,'bond':3},'arc_cat_3',1,'park'),
 ('arc_cat_3','작은 종이쪽지','고양이 목걸이에 접힌 종이가 매달려 있다.',['walk','research'],'종이를 펼친다','목걸이를 그대로 둔다',{'clues':2,'spirit':1},{'mental':3},None,0,'park'),
 ('arc_book','헌책방의 휴업 공고','동네 중고서점에 마지막 영업일이 적혀 있다.',['walk','research'],'문 닫기 전에 들른다','그냥 지나친다',{'money':-15000,'clues':1},{'mental':2},'arc_book_2',1,'store'),
 ('arc_book_2','책갈피에 남은 이름','서점 주인은 오래된 책을 포장하다가 멈춘다.',['research','walk'],'책갈피를 받는다','돌려드린다',{'clues':2,'spirit':2},{'bond':2},'arc_book_3',1,'store'),
 ('arc_book_3','마지막 페이지','책의 마지막 페이지에 정화 절차가 적혀 있다.',['research','purify'],'절차를 따른다','책을 덮는다',{'spirit':-8,'mental':-4},{'mental':3},None,0,'research'),
 ('arc_friend','읽지 않은 문자','오래된 친구가 지금도 이 동네에 사느냐고 물었다.',['rest','walk'],'곧바로 답한다','내일 답한다',{'bond':2},{'mental':1},'arc_friend_2',1,'home'),
 ('arc_friend_2','조용한 커피숍','친구는 얼굴이 너무 안 좋아 보인다며 걱정한다.',['meal','walk'],'사정을 조금 털어놓는다','별일 아니라고 한다',{'bond':3,'mental':5},{'bond':-1,'mental':-2},'arc_friend_3',2,'cafe'),
 ('arc_friend_3','오래된 인연의 도움','친구가 병원과 전문가 연락처가 적힌 종이를 건넨다.',['rest','research'],'도움을 받아들인다','혼자 해결한다',{'mental':8,'spirit':-4},{'clues':1,'mental':-2},None,0,'home'),
 ('arc_shrine','아파트의 작은 제단','산책길 담벼락 안에 오래된 향로가 놓여 있다.',['walk','purify'],'향을 바친다','향로만 살핀다',{'money':-7000,'spirit':-3},{'clues':2,'spirit':2},'arc_shrine_2',1,'street'),
 ('arc_shrine_2','새벽 관리인의 경고','관리인은 향로를 건드리지 말라고 한다.',['work','walk'],'설명을 듣는다','그냥 떠난다',{'clues':2,'mental':-3},{'mental':2},'arc_shrine_3',1,'store'),
 ('arc_shrine_3','제단 아래의 열쇠','향로 옆에서 녹슨 열쇠가 나왔다.',['purify','research'],'보관한다','향로 아래에 둔다',{'clues':3,'spirit':4},{'spirit':-5,'mental':-1},None,0,'ritual'),
 ('arc_rain','우산 가게의 영수증','계산대에서 받은 영수증에 주문하지 않은 우산이 찍혀 있다.',['walk','meal'],'직원에게 묻는다','가게를 떠난다',{'bond':1,'money':-3000},{'mental':-2},'arc_rain_2',1,'store'),
 ('arc_rain_2','분실된 우산의 주인','가게에서 오늘도 같은 물건을 찾는 사람이 있었다.',['walk','work'],'우산을 찾아준다','그냥 지나친다',{'luck':2,'bond':2},{'luck':-1},None,0,'street'),
 ('arc_work','퇴직한 직원의 사물함','버려진 사물함에 오늘 날짜가 적혀 있다.',['work'],'사물함을 잠근다','관리자에게 신고한다',{'mental':-3,'spirit':1},{'bond':2},'arc_work_2',1,'store'),
 ('arc_work_2','사물함 안의 손목시계','일하던 자리 아래에서 멈춘 시계가 발견된다.',['work','research'],'시계를 확인한다','주인에게 돌려준다',{'clues':2,'spirit':3},{'bond':2,'luck':1},'arc_work_3',1,'store'),
 ('arc_work_3','돌아온 직원','퇴직한 직원이 여전히 누군가 사물함을 쓴다며 불평한다.',['work'],'사과하고 정리한다','사물함을 잠가 둔다',{'bond':2,'mental':3},{'mental':-4},None,0,'store')]
for idx,(name,title,body,acts,ch_a,ch_b,fxa,fxb,follow,delay,scene) in enumerate(arcs):
 options=[dict(label=ch_a,text=f'{title}. {ch_a}.',fx=fxa),dict(label=ch_b,text=f'{title}. {ch_b}.',fx=fxb)]
 if follow:options[0].update(follow='v5_'+follow,follow_days=delay)
 events.append(dict(id='v5_'+name,title=title,body=body,tone='strange',scene=scene,actions=acts,chain_followup=(idx>0 and name.endswith(('_2','_3'))),options=options,weight=.65))

# Haunting-only encounters; exorcist and shaman are actual expensive high-success releases.
for name,title,body,action,cost,prob in [
 ('warded_exorcist','퇴마사의 방문','낯선 퇴마사가 묻는다. "가족 중 누가 늘 여기에 계시죠?"',['purify','research','rest'],78000,.84),
 ('warded_shaman','무당의 문턱','무당이 문 앞에 소금을 뿌리며 방 안을 오래 바라본다.',['walk','purify'],120000,.92),
 ('warded_clinic','성당의 안내자','오랜 기도 소리가 들리는 작은 예배실. 안내자가 조용히 의식을 제안한다.',['walk','purify','research'],58000,.78),
 ('warded_broker','불법 제령 광고','게시판의 익명 업자가 지박령 제거를 약속한다. 선금이 비싸다.',['research'],45000,.66)]:
 events.append(dict(id='v5_'+name,title=title,body=body,tone='strange',scene='shaman' if 'shaman' in name else 'ritual',actions=action,requires_haunting=True,weight=2.8,options=[dict(label=f'의식을 맡긴다 · {cost:,}원',text='퇴마 비용을 치르고 의식을 맡긴다.',exorcise=dict(cost=cost,chance=prob)),dict(label='나중에 다시 찾아오기로 한다',text='지금은 방에서 돌아서기로 한다.',fx={'mental':-2})]))
# Haunting consequence encounters
for i,(title,body,act,fxa,fxb) in enumerate([
 ('거울의 두 번째 호흡','기척이 없는데 욕실 거울에 김이 서린다.',['rest','purify'],{'spirit':-2,'mental':-4},{'spirit':5,'mental':-7}),
 ('잠든 팔의 멍','잠에서 깬 팔에 검게 멍이 들어 있다.',['sleep'],{'health':-5,'mental':-3},{'health':-12,'spirit':4}),
 ('저절로 열린 창고','일하는 곳의 창고 문이 스스로 닫힌다.',['work'],{'mental':-5},{'health':-6,'spirit':4}),
 ('구독하지 않은 채널','화면에 자기 방에서 촬영된 영상이 자동 재생된다.',['research'],{'mental':-8,'spirit':-1},{'spirit':7,'mental':-8}),
 ('빈 접시의 무게','밥을 먹으려던 자리에 접시 하나가 더 놓인다.',['meal'],{'mental':-5},{'spirit':5,'health':-4}),
 ('길 위의 그림자','가로등 아래 그림자가 두 개로 갈라진다.',['walk'],{'mental':-7},{'spirit':6,'health':-5}),
 ('뒤집힌 부적','정화 중 손을 떼자 부적이 뒤집혀 있다.',['purify'],{'spirit':-3,'mental':-5},{'spirit':8,'mental':-4})]):
 events.append(dict(id=f'v5_haunt_{i:02}',title=title,body=body,tone='bad',scene=act[0],actions=act,requires_haunting=True,weight=1.6,options=[dict(label='침착하게 버틴다',fx=fxa,text='한동안 숨을 고르고 기척이 지나가길 기다렸다.'),dict(label='직접 확인한다',fx=fxb,text='기척의 근원을 확인하려 다가갔다.')]))

# Last two narrative branches unlocked by special inventory (set on successful release)
events += [
 dict(id='v5_relic_notebook',title='빈 노트의 첫 문장',body='해방 후 얻은 노트 첫 장에 작은 주소가 저절로 나타났다.',tone='strange',scene='research',actions=['research','rest'],requires_item='명부의 빈 페이지',options=[dict(label='주소를 적어 둔다',text='주소는 도시에서 사라진 행정구역으로 이어졌다.',fx={'clues':3,'spirit':2},consume_item='명부의 빈 페이지',relic='먹지 않는 연필'),dict(label='그대로 덮는다',text='노트를 서랍 깊은 곳에 넣었다.',fx={'mental':2})]),
 dict(id='v5_relic_key',title='열쇠가 맞는 자물쇠',body='낡은 철문에 열쇠 구멍 하나가 남아 있다.',tone='strange',scene='street',actions=['walk','purify'],requires_item='녹슨 방 열쇠',options=[dict(label='문을 연다',text='문 너머에는 작은 목걸이가 놓여 있었다.',fx={'mental':-3,'spirit':-4},consume_item='녹슨 방 열쇠',relic='흑백 유리 목걸이'),dict(label='다시 돌아선다',text='아직 문을 열 때가 아닌 것 같다.',fx={'mental':2})])
]

relics=[
 {'id':'r01','name':'먹지 않는 연필','desc':'조사 숙련 +3. 매일 정신력 -1.','bonus':{'study_extra':3},'daily':{'mental':-1}},
 {'id':'r02','name':'흑백 유리 목걸이','desc':'정화 효율 +3. 매일 건강 -1.','bonus':{'purify_extra':3},'daily':{'health':-1}},
 {'id':'r03','name':'고요한 염주','desc':'정화 효율 +2. 매일 신기 -1.','bonus':{'purify_extra':2},'daily':{'spirit':-1}},
 {'id':'r04','name':'자정의 손목시계','desc':'휴식 회복 +3. 매일 정신력 -2.','bonus':{'rest_extra':3},'daily':{'mental':-2}},
 {'id':'r05','name':'세 번째 현관 열쇠','desc':'아르바이트 수입 +4,000원. 매일 신기 +1.','bonus':{'job_extra':4000},'daily':{'spirit':1}},
 {'id':'r06','name':'접힌 흰 손수건','desc':'식사 건강 회복 +3. 매일 자금 -1,000원.','bonus':{'meal_health':3},'daily':{'money':-1000}},
 {'id':'r07','name':'깨진 소형 거울','desc':'강령 성공률 +4%. 매일 신기 +1.','bonus':{'ritual_bonus':4},'daily':{'spirit':1}},
 {'id':'r08','name':'말 없는 방울','desc':'수면 건강 회복 +1. 매일 정신력 -1.','bonus':{'sleep_extra':1},'daily':{'mental':-1}}
]
items=['명부의 빈 페이지','녹슨 방 열쇠','검은 봉투','낯선 사진','정화사 연락처','유리병 속 흙','주인 없는 승차권','마른 국화 리본']
# publish as a simple extension, loaded after base data and before engine
out='''// Yeonmyeong v0.5: authored content extension, offline-only\n(function(root){\n "use strict";\n const C=root.YG_CONTENT||(typeof require==='function'?require('./data.js'):null);\n const ext=EXT;\n for(const key of ['skills','ghosts','meals','encounters']){const known=new Set(C[key].map(x=>x.id||x.name));for(const obj of ext[key]){const id=obj.id||obj.name;if(!known.has(id)){C[key].push(obj);known.add(id);}}}\n C.relics=ext.relics;C.questItems=ext.questItems;\n if(typeof module!=='undefined'&&module.exports)module.exports=C;\n})(typeof window!=='undefined'?window:globalThis);'''
EXT={'skills':skills,'ghosts':ghosts,'meals':mealObjs,'encounters':events,'relics':relics,'questItems':items}
(root/'expansion.js').write_text(out.replace('EXT',json.dumps(EXT,ensure_ascii=False,separators=(',',':')),1),encoding='utf-8')
print('added',[(k,len(v)) for k,v in EXT.items()])
