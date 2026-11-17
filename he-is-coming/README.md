# 그가 오고 있습니다

서버 없이 브라우저에서 실행하는 단일 HTML 텍스트 명령형 게임입니다.

- 게임 URL: https://yomhojoon.github.io/life_with_taboo/he-is-coming/
- 시작 전 시간 정지, 시작 후 150초(100KM / 1KM당 1.5초)
- 20KM마다 개별 접근 경고. 마지막 10초는 매초 카운트다운
- 요청 처리에 1~2초, 공격 또는 좌표 변경 결과는 추가 1~2초
- 장소 내부와 본인 기록 조회 허용, 연구 관련 정보는 비공개
- 외부 출입, 게임 이탈, 직접 접촉, 도시 파괴 요청 제한
- 사망 시 즉시 실패. 모니터 전원 차단 시 별도 생존 엔딩
- 모바일 키보드가 열려도 명령 입력창이 보이도록 높이 조절
- 브라우저의 Web Audio API로 비프음과 팬 소음 생성
- 기본값은 규칙 엔진. 사용자가 별도 AI 중계 서버를 연결하면 자연어 의미 분석을 추가할 수 있음. 미연결 또는 API 장애 시 기본 엔진으로 자동 복귀\n- AI 기능은 별도 Cloudflare Worker 및 OpenAI API 키가 있어야 활성화됨(공개 페이지에 키 저장 금지)

동일한 기능을 제공하는 단독 `index.html`이 이 폴더의 GitHub Pages 진입점입니다.
\n## 선택형 AI 연결\n\n[ai-worker/README.md](ai-worker/README.md)에 Cloudflare Worker 배포 및 비밀값 설정 절차가 있습니다. GitHub Pages 자체에는 API 키가 없으므로 Worker를 설정하기 전에는 여전히 규칙 기반으로 작동합니다.\n