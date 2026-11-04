(function(root){
"use strict";
const CONTENT = {
  "actions": [
    {
      "id": "sleep",
      "name": "수면",
      "short": "수면",
      "tip": "건강 +4, 정신력 +2 / 하루 4시간 이하 수면 시 큰 패널티",
      "color": "#536a92"
    },
    {
      "id": "rest",
      "name": "휴식",
      "short": "휴식",
      "tip": "정신력 +7, 신기 -1",
      "color": "#538c82"
    },
    {
      "id": "work",
      "name": "아르바이트",
      "short": "알바",
      "tip": "자금 +12,000원 / 건강 또는 정신력 소모",
      "color": "#9d7a59"
    },
    {
      "id": "meal",
      "name": "식사",
      "short": "식사",
      "tip": "선택한 식사를 주문해 건강과 정신력을 회복",
      "color": "#a38454"
    },
    {
      "id": "research",
      "name": "인터넷 조사",
      "short": "조사",
      "tip": "문자스킬 발견, 강령 단서 확보, 이상 사건 발생",
      "color": "#75618e"
    },
    {
      "id": "ritual",
      "name": "강령",
      "short": "강령",
      "tip": "성공 시 강력한 유령 패시브를 획득. 신기와 단서에 따라 성공률 상승",
      "color": "#9a506c"
    },
    {
      "id": "walk",
      "name": "산책",
      "short": "산책",
      "tip": "정신력 +4, 신기 -2 / 인연운을 얻을 수도 있음",
      "color": "#638c6c"
    },
    {
      "id": "purify",
      "name": "정화",
      "short": "정화",
      "tip": "자금 -15,000원, 신기 -7 / 정신력·건강 소폭 소모",
      "color": "#507e91"
    }
  ],
  "meals": [
    {
      "name": "편의점 도시락",
      "price": 8500,
      "health": 3,
      "mental": 1,
      "spirit": 0
    },
    {
      "name": "따뜻한 국밥",
      "price": 15000,
      "health": 6,
      "mental": 3,
      "spirit": 0
    },
    {
      "name": "건강식 정식",
      "price": 25000,
      "health": 9,
      "mental": 2,
      "spirit": 0
    },
    {
      "name": "새벽의 수상한 야식",
      "price": 3500,
      "health": 1,
      "mental": 7,
      "spirit": 2
    }
  ],
  "skills": [
    {
      "id": "rice",
      "name": "쌀 한 되에 좁쌀 서 말",
      "grade": 0,
      "desc": "재물운 +10, 행운 -1. 다음 날 행운 +1.",
      "gain": {
        "wealth": 10,
        "luck": -1
      },
      "delay": {
        "luck": 1
      }
    },
    {
      "id": "snail",
      "name": "다슬기를 담아라",
      "grade": 0,
      "desc": "매일 재물운 +1. 매일 정신력 -1.",
      "daily": {
        "wealth": 1,
        "mental": -1
      }
    },
    {
      "id": "balloon",
      "name": "알록달록 풍선다발",
      "grade": 0,
      "desc": "행운 +1. 정신력 -1.",
      "gain": {
        "luck": 1,
        "mental": -1
      }
    },
    {
      "id": "turtle",
      "name": "도랑치고 거북잡이",
      "grade": 0,
      "desc": "정신력 5 회복 후 정신력 1 감소. (순회복 +4)",
      "gain": {
        "mental": 4
      }
    },
    {
      "id": "princess",
      "name": "상상나라 상상공주",
      "grade": 0,
      "desc": "정신력 최대치 +3. 현재 정신력 -3.",
      "gain": {
        "max_mental": 3,
        "mental": -3
      }
    },
    {
      "id": "clown",
      "name": "노란어릿광대",
      "grade": 0,
      "desc": "소원 1/1. 신기 +1. 소원 사용 시 돈/건강/정신력 중 하나 획득.",
      "gain": {
        "spirit": 1
      },
      "wish": true
    },
    {
      "id": "salt",
      "name": "굵은 소금 세 꼬집",
      "grade": 0,
      "desc": "매일 신기 -1. 매일 자금 -2,000원.",
      "daily": {
        "spirit": -1,
        "money": -2000
      }
    },
    {
      "id": "coin",
      "name": "낡은 동전 던지기",
      "grade": 0,
      "desc": "재물운 +2. 인연운 -1. 아르바이트 시 추가 수입 1,500원.",
      "gain": {
        "wealth": 2,
        "bond": -1
      },
      "bonus": {
        "job_extra": 1500
      }
    },
    {
      "id": "whisper",
      "name": "벽 너머의 속삭임",
      "grade": 1,
      "desc": "조사 시 단서 발견 확률 상승. 매일 정신력 -3.",
      "bonus": {
        "study_extra": 22
      },
      "daily": {
        "mental": -3
      }
    },
    {
      "id": "warm",
      "name": "흰 이불의 무게",
      "grade": 1,
      "desc": "수면마다 건강 +3 추가. 매일 재물운 -1.",
      "bonus": {
        "sleep_extra": 3
      },
      "daily": {
        "wealth": -1
      }
    },
    {
      "id": "receipt",
      "name": "영수증에 적힌 이름",
      "grade": 1,
      "desc": "알바 시 추가 수입 5,000원. 매일 신기 +1.",
      "bonus": {
        "job_extra": 5000
      },
      "daily": {
        "spirit": 1
      }
    },
    {
      "id": "catwalk",
      "name": "고양이가 걷는 방향",
      "grade": 1,
      "desc": "행운 +2, 영감운 +2. 매일 정신력 -2.",
      "gain": {
        "luck": 2,
        "omen": 2
      },
      "daily": {
        "mental": -2
      }
    },
    {
      "id": "red_thread",
      "name": "끊어지지 않는 붉은 실",
      "grade": 1,
      "desc": "인연운 +5. 매일 건강 -2.",
      "gain": {
        "bond": 5
      },
      "daily": {
        "health": -2
      }
    },
    {
      "id": "mirror",
      "name": "새벽 두 시의 거울",
      "grade": 2,
      "desc": "강령 성공률 +17%p. 매일 신기 +3, 정신력 -5.",
      "bonus": {
        "ritual_bonus": 17
      },
      "daily": {
        "spirit": 3,
        "mental": -5
      }
    },
    {
      "id": "paper_money",
      "name": "젖지 않는 지전",
      "grade": 2,
      "desc": "알바 수입 +13,000원. 매일 건강 -6.",
      "bonus": {
        "job_extra": 13000
      },
      "daily": {
        "health": -6
      }
    },
    {
      "id": "blue_moon",
      "name": "푸른 달의 허물",
      "grade": 2,
      "desc": "정화 시 신기 추가 -4. 매일 정신력 -5.",
      "bonus": {
        "purify_extra": 4
      },
      "daily": {
        "mental": -5
      }
    },
    {
      "id": "clock",
      "name": "열세 번째 시계바늘",
      "grade": 2,
      "desc": "휴식 시 정신력 +6 추가. 매일 신기 +2.",
      "bonus": {
        "rest_extra": 6
      },
      "daily": {
        "spirit": 2
      }
    },
    {
      "id": "fortuna",
      "name": "손바닥에 내려앉은 별",
      "grade": 2,
      "desc": "행운 +7, 재물운 +6. 매일 정신력 -4.",
      "gain": {
        "luck": 7,
        "wealth": 6
      },
      "daily": {
        "mental": -4
      }
    },
    {
      "id": "meow",
      "name": "야옹야옹",
      "grade": 3,
      "desc": "야옹야옹",
      "gain": {
        "wealth": 100,
        "mental": 100
      },
      "daily": {
        "mental": -20,
        "luck": -1,
        "spirit": 1
      }
    },
    {
      "id": "eternal",
      "name": "죽지 않는 촛농",
      "grade": 3,
      "desc": "매일 건강 +20. 매일 정신력 -13, 신기 +5.",
      "daily": {
        "health": 20,
        "mental": -13,
        "spirit": 5
      }
    },
    {
      "id": "eclipse",
      "name": "일식의 마지막 문장",
      "grade": 3,
      "desc": "강령 성공률 +28%p. 매일 정신력 -10, 신기 +6.",
      "bonus": {
        "ritual_bonus": 28
      },
      "daily": {
        "mental": -10,
        "spirit": 6
      }
    }
  ],
  "ghosts": [
    {
      "id": "driver",
      "name": "막차의 운전기사",
      "story": "종점이 없는 버스에서 지폐를 세던 기사.",
      "desc": "알바 수입 +18,000원/시간. 매일 정신력 -7, 건강 -3, 신기 +2.",
      "bonus": {
        "job_extra": 18000
      },
      "daily": {
        "mental": -7,
        "health": -3,
        "spirit": 2
      }
    },
    {
      "id": "nurse",
      "name": "흰 복도의 간호사",
      "story": "누군가의 심박수를 대신 듣는 사람.",
      "desc": "수면 시 건강 +8/시간. 매일 정신력 -8, 신기 +3.",
      "bonus": {
        "sleep_extra": 8
      },
      "daily": {
        "mental": -8,
        "spirit": 3
      }
    },
    {
      "id": "typist",
      "name": "삭제된 게시글의 작성자",
      "story": "어느 게시판에도 남지 않은 마지막 댓글.",
      "desc": "조사 단서 획득 확률 크게 상승. 매일 정신력 -9, 신기 +2.",
      "bonus": {
        "study_extra": 38
      },
      "daily": {
        "mental": -9,
        "spirit": 2
      }
    },
    {
      "id": "bride",
      "name": "거울에만 보이는 신부",
      "story": "사진 속에서는 항상 한 명이 더 찍힌다.",
      "desc": "강령 성공률 +26%p. 매일 정신력 -10, 신기 +4.",
      "bonus": {
        "ritual_bonus": 26
      },
      "daily": {
        "mental": -10,
        "spirit": 4
      }
    },
    {
      "id": "cook",
      "name": "식탁 아래의 요리사",
      "story": "밤마다 빈 접시를 세 개씩 차린다.",
      "desc": "식사 회복량 건강 +5, 정신력 +4. 매일 건강 -6, 신기 +2.",
      "bonus": {
        "meal_health": 5,
        "meal_mental": 4
      },
      "daily": {
        "health": -6,
        "spirit": 2
      }
    },
    {
      "id": "porter",
      "name": "새벽의 짐꾼",
      "story": "열쇠가 없는 건물로 짐을 옮긴다.",
      "desc": "매일 자금 +50,000원. 매일 건강 -12, 정신력 -6, 신기 +3.",
      "daily": {
        "money": 50000,
        "health": -12,
        "mental": -6,
        "spirit": 3
      }
    },
    {
      "id": "child",
      "name": "계단을 세는 아이",
      "story": "그 아이의 계단은 열네 번째까지 있다.",
      "desc": "휴식 회복량 +12/시간. 매일 정신력 -6, 신기 +5, 인연운 -2.",
      "bonus": {
        "rest_extra": 12
      },
      "daily": {
        "mental": -6,
        "spirit": 5,
        "bond": -2
      }
    },
    {
      "id": "gardener",
      "name": "무덤지기의 그림자",
      "story": "풀 한 포기를 베면 이름 하나가 지워진다.",
      "desc": "정화 효과 신기 추가 -6. 매일 건강 -8, 정신력 -5.",
      "bonus": {
        "purify_extra": 6
      },
      "daily": {
        "health": -8,
        "mental": -5
      }
    },
    {
      "id": "fortune",
      "name": "마지막 손님",
      "story": "돈을 받고 미래의 실패를 알려준다.",
      "desc": "매일 재물운 +5, 자금 +30,000원. 매일 정신력 -12, 신기 +4.",
      "daily": {
        "wealth": 5,
        "money": 30000,
        "mental": -12,
        "spirit": 4
      }
    }
  ],
  "encounters": [
    {
      "id": "phone",
      "title": "03:17 / 거꾸로 울리는 전화",
      "body": "전화벨이 먼저 끊겼다. 잠시 후, 어제 들었던 목소리가 아직 울리지 않은 전화를 받으라고 속삭인다.",
      "options": [
        {
          "label": "전화를 받는다",
          "good": "대답 대신 의식의 순서가 들려왔다.",
          "bad": "수화기 너머로 당신의 숨소리만 들린다.",
          "chance": 0.58,
          "good_fx": {
            "clues": 1,
            "spirit": 3
          },
          "bad_fx": {
            "mental": -9,
            "spirit": 9
          }
        },
        {
          "label": "전화선을 뽑는다",
          "text": "벨이 멎고 잠시 평온해졌다.",
          "fx": {
            "mental": 3,
            "money": -2500
          }
        }
      ]
    },
    {
      "id": "coin",
      "title": "물기 없는 빗길",
      "body": "비가 내리는 골목. 바닥에 떨어진 동전만 유독 마른 채로 반짝인다.",
      "options": [
        {
          "label": "주워서 주머니에 넣는다",
          "good": "동전이 지폐로 바뀌어 있었다.",
          "bad": "주머니 안에서 물소리가 났다.",
          "chance": 0.67,
          "good_fx": {
            "money": 17000,
            "wealth": 1
          },
          "bad_fx": {
            "spirit": 8,
            "health": -5
          }
        },
        {
          "label": "보지 못한 척 지나간다",
          "text": "발걸음을 재촉하자 등 뒤에서 동전 구르는 소리가 들렸다.",
          "fx": {
            "mental": 3
          }
        }
      ]
    },
    {
      "id": "neighbor",
      "title": "벽을 세 번 두드리는 이웃",
      "body": "옆집은 이미 세 달째 비어 있다. 그래도 벽 너머에서는 규칙적인 박수가 들린다.",
      "options": [
        {
          "label": "같은 박자로 답한다",
          "good": "벽 너머에서 강령 단서를 넘겨주었다.",
          "bad": "손가락 사이에 멍이 생겼다.",
          "chance": 0.48,
          "good_fx": {
            "clues": 1,
            "omen": 2
          },
          "bad_fx": {
            "health": -7,
            "spirit": 6
          }
        },
        {
          "label": "이어폰을 끼고 쉰다",
          "text": "음악은 없었지만 오늘 밤은 조금 조용했다.",
          "fx": {
            "mental": 5
          }
        }
      ]
    },
    {
      "id": "flyer",
      "title": "현관문 아래의 전단지",
      "body": "'거주자의 이름을 적으면 오늘의 액운을 없애드립니다.' 보낸 곳도 연락처도 없다.",
      "options": [
        {
          "label": "이름을 적어 넣는다",
          "good": "낡은 봉투에서 돈이 나왔다.",
          "bad": "전단지에 당신의 얼굴이 찍혔다.",
          "chance": 0.42,
          "good_fx": {
            "money": 28000,
            "luck": 1
          },
          "bad_fx": {
            "spirit": 11,
            "mental": -7
          }
        },
        {
          "label": "전단지를 태운다",
          "text": "재가 흩날리며 작은 소금 결정이 남았다.",
          "fx": {
            "spirit": -3,
            "mental": -2
          }
        }
      ]
    },
    {
      "id": "taxi",
      "title": "목적지를 묻지 않는 택시",
      "body": "퇴근길, 빈 택시가 멈춰 섰다. 기사는 검은 장갑을 낀 채 뒷문만 열어 둔다.",
      "options": [
        {
          "label": "차에 올라탄다",
          "good": "무료로 집에 도착했고, 뒷좌석에 봉투가 놓여 있었다.",
          "bad": "도착한 곳은 내 집인데 시계는 한 시간 전이었다.",
          "chance": 0.6,
          "good_fx": {
            "money": 23000,
            "mental": 4
          },
          "bad_fx": {
            "health": -8,
            "spirit": 7
          }
        },
        {
          "label": "걸어서 돌아간다",
          "text": "길은 길었지만 모퉁이의 가로등은 따뜻했다.",
          "fx": {
            "health": -2,
            "spirit": -2
          }
        }
      ]
    },
    {
      "id": "review",
      "title": "인터넷의 이상한 후기",
      "body": "'이 문구를 끝까지 읽으면 오늘의 공포를 잊습니다.' 별점이 없는 후기다.",
      "options": [
        {
          "label": "끝까지 읽는다",
          "good": "머릿속이 맑아지고 낯선 의식이 떠올랐다.",
          "bad": "끝을 읽은 기억이 없는데 페이지는 끝나 있다.",
          "chance": 0.55,
          "good_fx": {
            "mental": 8,
            "clues": 1
          },
          "bad_fx": {
            "mental": -10,
            "spirit": 5
          }
        },
        {
          "label": "창을 닫는다",
          "text": "화면이 검게 꺼졌다. 어쩐지 안심이 된다.",
          "fx": {
            "mental": 2
          }
        }
      ]
    },
    {
      "id": "receipt",
      "title": "꿈속의 영수증",
      "body": "영수증에 '남은 생애: 잔액 부족'이라 적혀 있다. 서명란에 필체가 이미 새겨져 있다.",
      "options": [
        {
          "label": "서명한다",
          "good": "장부에서 뜻밖의 환급을 받았다.",
          "bad": "금액 대신 낯선 날짜가 떠올랐다.",
          "chance": 0.56,
          "good_fx": {
            "money": 40000,
            "wealth": 2
          },
          "bad_fx": {
            "spirit": 10,
            "mental": -9
          }
        },
        {
          "label": "영수증을 찢는다",
          "text": "종잇조각과 함께 불길한 예감이 흩어졌다.",
          "fx": {
            "mental": 5,
            "money": -5000
          }
        }
      ]
    },
    {
      "id": "door",
      "title": "열쇠구멍 너머의 눈",
      "body": "새벽에 누군가 초인종을 누른다. 문을 열기 전, 분명히 바깥쪽에서 안을 들여다보는 눈이 보였다.",
      "options": [
        {
          "label": "문을 열고 마주한다",
          "good": "문 밖엔 아무도 없지만 부적 한 장이 남아 있었다.",
          "bad": "당신이 문 밖에 서 있었다.",
          "chance": 0.47,
          "good_fx": {
            "spirit": -7,
            "omen": 2
          },
          "bad_fx": {
            "mental": -11,
            "spirit": 8
          }
        },
        {
          "label": "침대 속에 숨어 버틴다",
          "text": "누군가 현관 앞에 오래 서 있다가 사라졌다.",
          "fx": {
            "mental": -3,
            "health": 2
          }
        }
      ]
    },
    {
      "id": "parcel",
      "title": "보낸 사람이 없는 택배",
      "body": "문 앞에 택배가 놓여 있다. 송장에는 보낸 사람도 주소도 없고, 받는 사람 칸에만 당신의 필체가 적혀 있다.",
      "options": [
        {
          "label": "봉투의 봉인을 뜯는다",
          "good": "안에는 오래전 잃어버린 물건과 현금이 들어 있었다.",
          "bad": "상자 깊은 곳에서 누군가 웃었다.",
          "chance": 0.54,
          "good_fx": {
            "money": 25000,
            "mental": 3
          },
          "bad_fx": {
            "mental": -9,
            "spirit": 8
          }
        },
        {
          "label": "경비실에 맡긴다",
          "text": "다음 날 택배는 사라져 있었고 관리인의 표정이 어두워졌다.",
          "fx": {
            "bond": 1,
            "mental": -2
          }
        },
        {
          "label": "불에 태운다",
          "text": "검은 연기가 창문 밖으로 빠져나갔다.",
          "fx": {
            "spirit": -5,
            "health": -3
          }
        }
      ]
    },
    {
      "id": "archive",
      "title": "삭제된 사연함의 열람권",
      "body": "조사를 마치려는 순간 삭제된 게시판의 사연함이 열린다. 아무에게도 말하지 않았던 꿈이 첫 줄에 적혀 있다.",
      "options": [
        {
          "label": "끝까지 읽어 기록한다",
          "good": "사연에 적힌 의식이 단서 두 개로 남았다.",
          "bad": "마지막 문장은 당신의 생각을 지워 버렸다.",
          "chance": 0.48,
          "good_fx": {
            "clues": 2,
            "omen": 1
          },
          "bad_fx": {
            "mental": -12,
            "spirit": 6
          }
        },
        {
          "label": "읽지 않고 삭제한다",
          "text": "그 문장을 영영 보지 않아도 된다.",
          "fx": {
            "mental": 3
          }
        },
        {
          "label": "흰 종이에 제목만 옮긴다",
          "text": "제목만으로도 의식의 흔적이 떠오른다.",
          "fx": {
            "clues": 1,
            "spirit": 3
          }
        }
      ]
    },
    {
      "id": "vending",
      "title": "동전이 들어가지 않는 자판기",
      "body": "막차 정류장의 자판기는 음료 대신 '평온', '우연', '미래'라는 세 글자만 판매한다. 가격 표시는 모두 물음표다.",
      "options": [
        {
          "label": "평온을 고른다",
          "text": "차가운 공기가 가라앉는다. 그러나 돈이 모자랐다.",
          "fx": {
            "money": -7000,
            "mental": 8,
            "spirit": -2
          }
        },
        {
          "label": "우연을 고른다",
          "good": "자판기 밑에서 지폐 묶음을 발견했다.",
          "bad": "집으로 돌아오니 지갑의 카드가 하나 사라져 있었다.",
          "chance": 0.62,
          "good_fx": {
            "money": 32000,
            "luck": 1
          },
          "bad_fx": {
            "money": -12000,
            "luck": -1
          }
        },
        {
          "label": "미래를 고른다",
          "good": "남겨진 낙서가 강령의 다음 순서를 알려 준다.",
          "bad": "유리창 너머에 내일의 당신이 서 있다.",
          "chance": 0.43,
          "good_fx": {
            "clues": 2
          },
          "bad_fx": {
            "spirit": 10,
            "mental": -5
          }
        }
      ]
    },
    {
      "id": "stair",
      "title": "병원에서 사라진 4층",
      "body": "야간 진료를 받으러 왔다. 엘리베이터에는 1, 2, 3, 5층만 있다. 누군가 계단에서 4층으로 가는 법을 알려 준다.",
      "options": [
        {
          "label": "계단을 따라 올라간다",
          "good": "익명의 의사가 당신을 진료했다.",
          "bad": "돌아왔을 때 손목의 맥박이 엇박자로 뛰고 있었다.",
          "chance": 0.49,
          "good_fx": {
            "health": 18,
            "spirit": -2
          },
          "bad_fx": {
            "health": -10,
            "mental": -7
          }
        },
        {
          "label": "병원 로비에서 기다린다",
          "text": "밤을 지새운 끝에 잠시 마음이 편해졌다.",
          "fx": {
            "mental": 4,
            "health": -2
          }
        },
        {
          "label": "벽에 적힌 숫자를 옮겨 적는다",
          "text": "한 장의 종이에 의식의 열쇠가 남았다.",
          "fx": {
            "clues": 1,
            "spirit": 4
          }
        }
      ]
    }
  ]
};
root.YG_CONTENT=CONTENT;
if(typeof module!=="undefined" && module.exports) module.exports=CONTENT;
})(typeof window!=="undefined" ? window : globalThis);

// Everyday life and branching story events. Editable data follows.
(function(root){
  "use strict";
  const extraEncounters = [
  {
    "id": "umbrella",
    "title": "비 오는 횡단보도",
    "body": "아침비가 가늘게 내린다. 우산이 없는 사람이 신호등 옆에서 곤란한 표정으로 서 있다.",
    "scene": "street",
    "tone": "everyday",
    "actions": [
      "walk"
    ],
    "hours": [
      6,
      19
    ],
    "weight": 3,
    "options": [
      {
        "label": "우산을 함께 쓴다",
        "text": "두 사람은 조금 천천히 길을 건넌다. 상대는 다음에 갚겠다고 한다.",
        "fx": {
          "bond": 1,
          "mental": 3
        },
        "follow": "umbrella_return",
        "follow_days": 1
      },
      {
        "label": "여분의 우산을 건넨다",
        "text": "고맙다는 말을 남기고 사람이 빗속으로 사라진다.",
        "fx": {
          "bond": 2,
          "money": -5000
        },
        "follow": "umbrella_return",
        "follow_days": 1
      },
      {
        "label": "혼자 돌아간다",
        "text": "젖은 운동화를 털어내며 집으로 향했다.",
        "fx": {
          "mental": 1
        }
      }
    ]
  },
  {
    "id": "umbrella_return",
    "title": "돌아온 우산 · 두 번째 만남",
    "body": "어제 만난 사람이 편의점 앞에서 당신을 기다리고 있다. 깨끗이 닦은 우산과 작은 종이봉투를 들고 있다.",
    "scene": "store",
    "tone": "everyday",
    "weight": 1,
    "options": [
      {
        "label": "봉투를 받아 연다",
        "text": "갓 구운 빵과 감사 편지가 들어 있다.",
        "fx": {
          "health": 4,
          "mental": 6,
          "bond": 1
        },
        "follow": "umbrella_cafe",
        "follow_hours": 5
      },
      {
        "label": "돌려받은 우산만 챙긴다",
        "text": "그 사람이 웃으며 손을 흔든다.",
        "fx": {
          "mental": 3
        }
      },
      {
        "label": "내가 커피를 산다",
        "text": "잠깐의 대화가 뜻밖에 즐겁다.",
        "fx": {
          "money": -7000,
          "bond": 3
        },
        "follow": "umbrella_cafe",
        "follow_hours": 4
      }
    ]
  },
  {
    "id": "umbrella_cafe",
    "title": "카페 창가의 짧은 안부",
    "body": "카페 창가에 낯익은 얼굴이 보인다. 창밖은 여전히 흐리지만 안쪽은 따뜻하다.",
    "scene": "cafe",
    "tone": "everyday",
    "weight": 1,
    "options": [
      {
        "label": "같이 앉아 수다를 나눈다",
        "text": "별일 아닌 하루를 오래 이야기했다.",
        "fx": {
          "mental": 10,
          "luck": 1,
          "bond": 1
        }
      },
      {
        "label": "인사만 하고 지나간다",
        "text": "서로 가볍게 손을 흔들었다.",
        "fx": {
          "mental": 2
        }
      }
    ]
  },
  {
    "id": "coworker",
    "title": "같이 일하는 사람의 커피",
    "body": "휴게실에서 동료가 캔커피 하나를 건넨다. 오늘 유난히 바빠 보였기 때문이라 한다.",
    "scene": "work",
    "tone": "everyday",
    "actions": [
      "work"
    ],
    "hours": [
      7,
      21
    ],
    "weight": 3,
    "options": [
      {
        "label": "고맙게 받아 마신다",
        "text": "쌓였던 피로가 조금 가신다.",
        "fx": {
          "mental": 5,
          "bond": 1
        },
        "follow": "coworker_help",
        "follow_days": 1
      },
      {
        "label": "내일 내가 사겠다고 한다",
        "text": "뜻밖의 약속이 하나 생긴다.",
        "fx": {
          "bond": 2
        },
        "follow": "coworker_help",
        "follow_days": 1
      },
      {
        "label": "정중히 거절한다",
        "text": "동료가 고개를 끄덕인다.",
        "fx": {
          "health": 1
        }
      }
    ]
  },
  {
    "id": "coworker_help",
    "title": "동료의 부탁 · 다음 날",
    "body": "어제 커피를 건넨 동료가 퇴근 전에 정리할 물건이 있다고 부탁한다. 생각보다 양이 많다.",
    "scene": "work",
    "tone": "everyday",
    "options": [
      {
        "label": "끝까지 도와준다",
        "text": "동료가 고맙다며 수당을 나눈다.",
        "fx": {
          "money": 14000,
          "health": -4,
          "bond": 2
        },
        "follow": "coworker_dinner",
        "follow_hours": 6
      },
      {
        "label": "무리하지 않고 돕는다",
        "text": "둘이 조금 늦게까지 남았지만 무사히 끝났다.",
        "fx": {
          "money": 6000,
          "mental": 2
        },
        "follow": "coworker_dinner",
        "follow_hours": 8
      },
      {
        "label": "오늘은 돌아가겠다고 한다",
        "text": "동료가 사정을 이해한다.",
        "fx": {
          "mental": 2,
          "bond": -1
        }
      }
    ]
  },
  {
    "id": "coworker_dinner",
    "title": "퇴근 후의 작은 식사",
    "body": "동료가 고생했다며 분식집으로 부른다. 우연히 창가 자리에 앉게 되었다.",
    "scene": "meal",
    "tone": "everyday",
    "options": [
      {
        "label": "함께 저녁을 먹는다",
        "text": "따뜻한 국물에 오늘의 피로가 가라앉는다.",
        "fx": {
          "health": 5,
          "mental": 8,
          "bond": 1
        }
      },
      {
        "label": "포장만 부탁한다",
        "text": "집에서 천천히 먹으라는 웃음이 돌아온다.",
        "fx": {
          "health": 4,
          "money": 3000
        }
      }
    ]
  },
  {
    "id": "book_trade",
    "title": "중고서점의 낯선 책갈피",
    "body": "인터넷 조사를 하다가 근처 중고서점이 올린 오래된 자료 목록을 발견했다. 책갈피가 끼워진 책 한 권이 눈에 띈다.",
    "scene": "desk",
    "tone": "strange",
    "actions": [
      "research"
    ],
    "hours": [
      8,
      22
    ],
    "weight": 2,
    "options": [
      {
        "label": "책을 예약한다",
        "text": "예약 확인 문자에 내일의 날짜가 적혀 있다.",
        "fx": {
          "money": -11000,
          "omen": 1
        },
        "follow": "book_pickup",
        "follow_days": 1
      },
      {
        "label": "책갈피 사진만 저장한다",
        "text": "표식 하나를 이해했지만 화면에 잡음이 낀다.",
        "fx": {
          "clues": 1,
          "spirit": 2
        }
      },
      {
        "label": "검색 기록을 닫는다",
        "text": "그날의 조사는 여기까지로 한다.",
        "fx": {
          "mental": 3
        }
      }
    ]
  },
  {
    "id": "book_pickup",
    "title": "중고서점의 방문자 · 다음 장",
    "body": "서점 주인이 예약한 책을 건넨다. 책갈피에는 기이하게도 집 근처 골목 지도가 그려져 있다.",
    "scene": "store",
    "tone": "strange",
    "options": [
      {
        "label": "책갈피를 자세히 살핀다",
        "text": "해방에 쓰이는 매듭 그림을 발견한다.",
        "fx": {
          "mental": -4,
          "clues": 1
        },
        "ward": 1,
        "follow": "book_last",
        "follow_hours": 4
      },
      {
        "label": "지도를 따라가 본다",
        "good": "골목 끝에서 작은 행운을 줍는다.",
        "bad": "골목을 한참 돌다가 기운이 빠진다.",
        "chance": 0.55,
        "good_fx": {
          "money": 18000,
          "luck": 1
        },
        "bad_fx": {
          "health": -5,
          "spirit": 4
        },
        "follow": "book_last",
        "follow_hours": 5
      },
      {
        "label": "책을 반납한다",
        "text": "서점 주인이 말없이 책을 받아 넣는다.",
        "fx": {
          "mental": 2
        }
      }
    ]
  },
  {
    "id": "book_last",
    "title": "지도에 없는 골목 · 마지막 장",
    "body": "책갈피에 그려진 골목이 나타났다. 끝에는 두 갈래 길이 나 있고, 어느 쪽이든 발자국이 있다.",
    "scene": "street",
    "tone": "strange",
    "options": [
      {
        "label": "밝은 길을 따라간다",
        "text": "새로 난 길로 집에 돌아왔다. 지도가 더는 보이지 않는다.",
        "fx": {
          "spirit": -6,
          "mental": 5
        }
      },
      {
        "label": "발자국을 따라간다",
        "good": "제령의 매듭을 풀어내는 법을 기억했다.",
        "bad": "발자국이 자신의 신발 모양이라는 것을 깨닫는다.",
        "chance": 0.58,
        "good_fx": {
          "clues": 2,
          "omen": 1
        },
        "bad_fx": {
          "spirit": 9,
          "mental": -7
        }
      }
    ]
  },
  {
    "id": "lunch_coupon",
    "title": "점심시간의 적립 쿠폰",
    "body": "식당 사장님이 마지막 도장을 찍어 준다. 예전에는 잊어버렸던 쿠폰이다.",
    "scene": "meal",
    "tone": "good",
    "actions": [
      "meal"
    ],
    "hours": [
      10,
      18
    ],
    "weight": 3,
    "options": [
      {
        "label": "무료 반찬을 받는다",
        "text": "반찬이 예상보다 푸짐하다.",
        "fx": {
          "health": 5,
          "mental": 2
        }
      },
      {
        "label": "쿠폰을 다른 사람에게 준다",
        "text": "앞에 서 있던 학생이 환하게 웃는다.",
        "fx": {
          "bond": 2,
          "luck": 1
        }
      }
    ]
  },
  {
    "id": "wrong_order",
    "title": "배달 주문이 바뀌었다",
    "body": "음식을 받았는데 주문한 것과 다른 메뉴다. 배달원도 당황한 눈치다.",
    "scene": "meal",
    "tone": "bad",
    "actions": [
      "meal"
    ],
    "hours": [
      10,
      23
    ],
    "weight": 2,
    "options": [
      {
        "label": "가게에 연락해 해결한다",
        "good": "가게에서 사과하며 작은 쿠폰을 준다.",
        "bad": "다시 주문하는 동안 음식이 식어 버렸다.",
        "chance": 0.65,
        "good_fx": {
          "money": 8000,
          "mental": 2
        },
        "bad_fx": {
          "mental": -5
        }
      },
      {
        "label": "그냥 먹는다",
        "text": "먹을 만했지만 오늘은 입맛이 없었다.",
        "fx": {
          "health": 1,
          "mental": -1
        }
      }
    ]
  },
  {
    "id": "sunset",
    "title": "해질녘의 노을",
    "body": "건물 사이로 해가 천천히 내려앉는다. 사람들의 그림자가 길어지고, 오늘이 그럭저럭 지나가고 있다는 생각이 든다.",
    "scene": "park",
    "tone": "good",
    "actions": [
      "walk",
      "rest"
    ],
    "hours": [
      16,
      20
    ],
    "weight": 3,
    "options": [
      {
        "label": "잠시 멈춰 바라본다",
        "text": "특별한 일은 없었다. 그래서 더 마음이 편해졌다.",
        "fx": {
          "mental": 7,
          "spirit": -1
        }
      },
      {
        "label": "사진을 한 장 남긴다",
        "text": "친구가 사진에 답장을 보내왔다.",
        "fx": {
          "bond": 1,
          "luck": 1
        }
      }
    ]
  },
  {
    "id": "stray_cat",
    "title": "길고양이의 점심",
    "body": "작은 고양이가 가게 앞에 앉아 비닐봉지를 바라본다. 배가 고픈 눈치다.",
    "scene": "park",
    "tone": "everyday",
    "actions": [
      "walk",
      "meal"
    ],
    "hours": [
      7,
      22
    ],
    "weight": 3,
    "options": [
      {
        "label": "가게에서 간식을 사 온다",
        "text": "고양이가 다 먹고 자리를 잡았다.",
        "fx": {
          "money": -3500,
          "mental": 6,
          "bond": 1
        },
        "follow": "cat_again",
        "follow_days": 1
      },
      {
        "label": "손을 흔들고 지나간다",
        "text": "고양이가 한 번 야옹 울었다.",
        "fx": {
          "mental": 2
        }
      }
    ]
  },
  {
    "id": "cat_again",
    "title": "다시 만난 고양이",
    "body": "어제 보았던 고양이가 골목 입구에서 다가온다. 이번에는 작은 열쇠고리 같은 것을 발치에 내려놓는다.",
    "scene": "park",
    "tone": "everyday",
    "options": [
      {
        "label": "열쇠고리를 주워 본다",
        "good": "근처 게시판에 적힌 분실물 주인을 찾아주었다.",
        "bad": "별 물건이 아니었지만 손에 먼지가 묻었다.",
        "chance": 0.65,
        "good_fx": {
          "money": 12000,
          "bond": 2,
          "luck": 1
        },
        "bad_fx": {
          "mental": 1
        }
      },
      {
        "label": "그저 쓰다듬어 준다",
        "text": "고양이는 잠시 무릎 위에서 골골거린다.",
        "fx": {
          "mental": 8,
          "spirit": -2
        }
      }
    ]
  },
  {
    "id": "shift_bonus",
    "title": "뜻밖의 추가 수당",
    "body": "사장님이 바쁜 시간을 도와줘서 고맙다며 작은 봉투를 건넨다.",
    "scene": "work",
    "tone": "good",
    "actions": [
      "work"
    ],
    "hours": [
      8,
      23
    ],
    "weight": 3,
    "options": [
      {
        "label": "감사히 받는다",
        "text": "오늘의 수입이 조금 늘었다.",
        "fx": {
          "money": 17000
        }
      },
      {
        "label": "동료와 나누어 쓴다",
        "text": "다음 교대가 훨씬 편해졌다.",
        "fx": {
          "money": 7000,
          "bond": 2,
          "luck": 1
        }
      }
    ]
  },
  {
    "id": "missed_bus",
    "title": "정류장의 막차",
    "body": "버스가 코앞에서 출발했다. 다음 차까지 꽤 오래 기다려야 한다.",
    "scene": "street",
    "tone": "bad",
    "actions": [
      "work",
      "walk"
    ],
    "hours": [
      18,
      23
    ],
    "weight": 2,
    "options": [
      {
        "label": "택시를 잡는다",
        "text": "돈은 조금 들었지만 무사히 귀가했다.",
        "fx": {
          "money": -12000,
          "mental": 2
        }
      },
      {
        "label": "걸어간다",
        "text": "발은 아팠지만 낯선 동네를 구경했다.",
        "fx": {
          "health": -3,
          "mental": 1,
          "luck": 1
        }
      }
    ]
  },
  {
    "id": "lost_wallet",
    "title": "인도에 떨어진 지갑",
    "body": "모퉁이를 돌자 바닥에 낡은 지갑 하나가 보인다. 안에는 학생증과 영수증 몇 장이 들어 있다.",
    "scene": "street",
    "tone": "everyday",
    "actions": [
      "walk",
      "work"
    ],
    "hours": [
      7,
      22
    ],
    "weight": 2,
    "options": [
      {
        "label": "가까운 파출소에 맡긴다",
        "text": "나중에 주인이 감사 인사를 전한다.",
        "fx": {
          "bond": 2,
          "luck": 1
        },
        "follow": "wallet_thanks",
        "follow_days": 1
      },
      {
        "label": "그대로 두고 간다",
        "text": "뒤따라오던 사람이 지갑을 발견한다.",
        "fx": {
          "mental": -1
        }
      }
    ]
  },
  {
    "id": "wallet_thanks",
    "title": "분실물의 주인 · 후일담",
    "body": "분실한 지갑의 주인이 짧은 감사 메시지와 함께 모바일 상품권을 보냈다.",
    "scene": "desk",
    "tone": "good",
    "options": [
      {
        "label": "상품권을 받는다",
        "text": "서로의 하루가 조금 나아진 것 같다.",
        "fx": {
          "money": 10000,
          "mental": 4
        }
      },
      {
        "label": "고맙다는 말만 전한다",
        "text": "따뜻한 답장을 받았다.",
        "fx": {
          "mental": 7,
          "bond": 1
        }
      }
    ]
  },
  {
    "id": "early_birds",
    "title": "아침 빵집의 향기",
    "body": "문을 열자 갓 구운 빵 냄새가 골목을 채운다. 오늘은 어쩐지 평범한 아침이다.",
    "scene": "store",
    "tone": "good",
    "actions": [
      "meal",
      "walk"
    ],
    "hours": [
      5,
      10
    ],
    "weight": 3,
    "options": [
      {
        "label": "빵 하나를 산다",
        "text": "따뜻한 빵이 예상보다 맛있다.",
        "fx": {
          "money": -4500,
          "mental": 6,
          "health": 2
        }
      },
      {
        "label": "향기만 즐긴다",
        "text": "발걸음이 조금 가벼워졌다.",
        "fx": {
          "mental": 3
        }
      }
    ]
  },
  {
    "id": "quiet_night",
    "title": "창밖의 늦은 불빛",
    "body": "저녁이 깊었다. 옆집의 전등이 켜지고, 멀리서 누군가 웃는 소리가 들린다.",
    "scene": "home",
    "tone": "everyday",
    "actions": [
      "rest",
      "sleep"
    ],
    "hours": [
      20,
      5
    ],
    "weight": 3,
    "options": [
      {
        "label": "창문을 닫고 쉰다",
        "text": "조용히 내일의 일을 생각한다.",
        "fx": {
          "mental": 4,
          "spirit": -1
        }
      },
      {
        "label": "잠깐 바깥을 바라본다",
        "text": "지금도 누군가는 평범하게 살아가고 있다.",
        "fx": {
          "mental": 3,
          "bond": 1
        }
      }
    ]
  },
  {
    "id": "broken_phone",
    "title": "깨진 휴대전화 액정",
    "body": "주머니에서 휴대전화를 꺼내다가 바닥에 떨어뜨렸다. 화면에 거미줄 같은 금이 갔다.",
    "scene": "street",
    "tone": "bad",
    "actions": [
      "walk",
      "work"
    ],
    "hours": [
      6,
      23
    ],
    "weight": 2,
    "options": [
      {
        "label": "수리점을 찾는다",
        "text": "다행히 화면만 교체하면 된다.",
        "fx": {
          "money": -23000,
          "mental": 2
        }
      },
      {
        "label": "그대로 사용한다",
        "text": "문자를 읽을 때마다 눈살이 찌푸려진다.",
        "fx": {
          "mental": -5,
          "luck": -1
        }
      }
    ]
  },
  {
    "id": "overdue_bill",
    "title": "미뤄 둔 공과금",
    "body": "문자 알림이 온다. 잊고 있던 공과금의 납기일이 오늘이다.",
    "scene": "desk",
    "tone": "bad",
    "actions": [
      "rest",
      "research",
      "work"
    ],
    "hours": [
      8,
      22
    ],
    "weight": 2,
    "options": [
      {
        "label": "즉시 납부한다",
        "text": "큰일이 되기 전에 해결했다.",
        "fx": {
          "money": -13000,
          "mental": 2
        }
      },
      {
        "label": "다음에 처리한다",
        "text": "미뤄 둔 일이 머릿속에 남는다.",
        "fx": {
          "mental": -5,
          "luck": -1
        }
      }
    ]
  },
  {
    "id": "strange_broadcast",
    "title": "심야 라디오의 오래된 사연",
    "body": "채널을 돌리다가 오래된 라디오 방송을 찾았다. 진행자는 다정하게 오늘도 살아 있어 줘서 고맙다고 말한다.",
    "scene": "home",
    "tone": "strange",
    "actions": [
      "rest",
      "research"
    ],
    "hours": [
      21,
      5
    ],
    "weight": 2,
    "options": [
      {
        "label": "끝까지 듣는다",
        "good": "마지막 곡은 오래전 좋아했던 음악이었다.",
        "bad": "진행자가 방송 끝에 당신의 이름을 불렀다.",
        "chance": 0.61,
        "good_fx": {
          "mental": 7,
          "omen": 1
        },
        "bad_fx": {
          "spirit": 5,
          "mental": -4
        }
      },
      {
        "label": "채널을 바꾼다",
        "text": "익숙한 뉴스 소리가 흘러나온다.",
        "fx": {
          "mental": 2
        }
      }
    ]
  }
];
  if(root.YG_CONTENT) root.YG_CONTENT.encounters.push(...extraEncounters);
})(typeof window !== "undefined" ? window : globalThis);

