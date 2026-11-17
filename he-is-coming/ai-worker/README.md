# 선택형 AI 의미 해석 연결

이 게임은 기본적으로 규칙 기반으로 실행됩니다. 별도 백엔드에 키를 등록하면 동의어/우회 표현을 AI가 의미 분석할 수 있습니다. 승패·사망·금지 요청은 반드시 게임의 로컬 규칙에서 최종 판단합니다.

## 1. Cloudflare Worker 배포

Node.js가 설치된 환경에서:

```bash
cd ai-worker
npx wrangler login
npx wrangler deploy             # 최초 Worker 생성(아직 AI 비활성)
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put GAME_PRIVATE_FACTS
npx wrangler deploy             # 비밀값 등록 후 최종 배포
```

`GAME_PRIVATE_FACTS`에는 **원본 설정이 아닌 짧은 참·거짓 사실표**만 입력하십시오. 예: `사람인가=false; 불사인가=true; 남성인가=true; 크람푸스인가=false; 빛을 따라가는가=true; 다른 조명으로 유인 가능한가=false` 처럼 플레이어가 예/아니요로 확인해도 되는 정보만 작성합니다. **공개 GitHub 저장소와 HTML, wrangler.jsonc에는 이 내용을 쓰지 마십시오.** 다른 비공개 사실은 따로 추가할 수 있습니다.

`wrangler deploy` 출력에 생성되는 HTTPS 주소(대개 `https://<이름>.<계정>.workers.dev`) 뒤에 `/interpret`를 붙입니다.

## 2. 게임에 연결

배포된 게임 주소 뒤에 Worker 주소를 URL 인코딩하여 전달합니다.

```
https://yomhojoon.github.io/life_with_taboo/he-is-coming/?ai=https%3A%2F%2FYOUR-WORKER.workers.dev%2Finterpret
```

브라우저에는 URL **주소만** 저장됩니다. **API 키를 URL 또는 소스 코드에 적지 마십시오.** 같은 브라우저에서는 다음 접속부터 AI 연결 주소가 유지됩니다. 끄려면 `?ai=off`로 접속합니다. 서버를 배포하지 않았거나 API가 실패하면 기존 규칙 엔진으로 진행합니다.

## 3. 중요한 제한

- GitHub Pages만으로는 비밀 API 키를 안전하게 보관할 수 없습니다.
- 게임이 종료되는 명령·사망 판정·방 탈출 제한은 로컬 엔진이 담당하며 AI는 임의로 승리나 사망을 만들 수 없습니다.
- AI의 의미 분석은 확률적입니다. 완벽하게 정확하거나 모든 요청을 처리한다고 보장할 수 없습니다.
- Worker는 공개 HTTPS 엔드포인트이므로 Origin 허용만으로 인증을 보장하지 않습니다. Cloudflare 요청 제한을 연결하고 OpenAI 프로젝트별 사용 한도도 설정하십시오.
- AI 응답은 1~2초보다 길어질 수 있습니다. 게임 타이머는 항상 실시간으로 계속 진행되며, 네트워크 오류/지연 시 로컬 엔진으로 대체됩니다.
- API 호출에는 별도의 비용이 발생할 수 있습니다.