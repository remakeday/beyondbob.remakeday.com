---
title: "API 계약"
slug: api
owner: minseok
due: "2026-09-04"
state: p0
state_label: "9/04 발행"
eyebrow: "기획 05"
description: "프론트가 화면 5장을 만들 수 있는 최소 계약. 인증이 빠져서 훨씬 단순해졌습니다."
---

<div class="callout callout--ok">
  <div class="callout__title">계약이 나오는 순간이 일정의 분기점입니다</div>
  <p>완벽하지 않아도 됩니다. <strong>바뀔 수 있다는 걸 알리고 일단 내는 게</strong> 낫습니다.</p>
</div>

## 기본 규약

| 항목 | 값 |
|---|---|
| Base URL (local) | `http://localhost:8300` |
| 버전 | `/api/v1/...` |
| **인증** | **없음.** 익명 세션 키를 `X-Session-Key` 헤더로 전달 |
| 요청/응답 | `application/json; charset=utf-8` |
| 스트리밍 | `text/event-stream` (SSE) |
| 시각 | ISO 8601 UTC |
| 식별자 | 응답에는 항상 `public_id` |
| 네이밍 | `snake_case` |

세션 키는 첫 진입 시 서버가 발급하고 클라이언트가 로컬에 보관합니다.
**로그인 화면도, 회원가입도, 토큰 갱신도 없습니다** (12.4).

## 응답 형태

```jsonc
// 실패 — 형태가 절대 안 바뀐다
{ "error": { "code": "BUDGET_EXHAUSTED", "message": "오늘 더 말할 수 없다.", "detail": null } }
```

클라이언트는 **항상 `code` 로 분기**합니다. `message` 는 문구가 바뀝니다.

| code | HTTP | 클라이언트가 할 일 |
|---|---|---|
| `SESSION_REQUIRED` | 401 | 세션 발급 후 재시도 |
| `BUDGET_EXHAUSTED` | 409 | 발화 입력 비활성, 하루 종료 안내 |
| `LOOP_ALREADY_ENDED` | 409 | 아침 화면으로 |
| `VALIDATION_FAILED` | 400 | 입력 오류 표시 |
| `RATE_LIMITED` | 429 | 잠시 후 재시도 |
| `AI_UNAVAILABLE` | 503 | 게임 진행 불가 안내 + 재시도 |
| `INTERNAL_ERROR` | 500 | 오류 화면 + 재시도 |

## 엔드포인트

### 세션 · 루프

| 메서드 | 경로 | 설명 |
|---|---|---|
| `POST` | `/api/v1/sessions` | 익명 세션 발급. `domain` 지정 (`game`·`audit`·`career`) |
| `GET` | `/api/v1/sessions/me` | 배선 검증용. 세션 상태 반환 |
| `POST` | `/api/v1/loops` | 새 루프 시작 → 아침 화면 데이터 |
| `GET` | `/api/v1/loops/{id}` | 루프 상태 (남은 발화 예산, 현재 비트, NPC 목록) |
| `POST` | `/api/v1/loops/{id}/advance` | 다음 비트로 |
| `POST` | `/api/v1/loops/{id}/skip` | **아무 말 없이 루프 흘려보내기** → 예산 회복 (6.1) |

`POST /loops` 응답에 **아침 문장**이 들어갑니다.

```jsonc
{
  "public_id": "…", "loop_no": 3, "utterance_budget": 5,
  "morning": {
    "fixed": "7시 12분. 눈을 뜬다.",      // 항상 동일
    "lines": ["천장이 조금 낮아 보인다."]  // 손상 1층이 여기서 작동
  }
}
```

<div class="callout callout--warn">
  <div class="callout__title">루프 카운터는 화면에 노출하지 않습니다</div>
  <p><code>loop_no</code> 는 계약에 있지만 <strong>UI에 그리지 않습니다.</strong>
  유저가 세게 만들고, 노트가 그 역할을 합니다 (4.9).</p>
</div>

### 발화 — 이 게임의 유일한 행동

| 메서드 | 경로 | 설명 |
|---|---|---|
| `POST` | `/api/v1/loops/{id}/utterances` | **SSE 스트리밍.** 발화 → NPC 판단 → 응답 |

```
event: advice          // 발화 직전 침묵 권고가 떴다면
data: {"recommendation":"침묵","rationale":"최근 3턴 의심도 +14, 신뢰 회복 이벤트 없음","advice_id":"…"}

event: delta
data: {"text":"그래? "}

event: tool
data: {"name":"ask_npc","target":"준","status":"running"}

event: done
data: {"utterance_id":"…","budget_after":3,"npc_visible_state":null}

event: error
data: {"code":"AI_UNAVAILABLE","message":"…"}
```

`npc_visible_state` 는 **항상 `null`** 입니다. 의심도·신뢰도는 유저에게 보이지 않습니다.
인스펙터에서만 열립니다 (8.8).

### 침묵 권고 — 측정 ②

| 메서드 | 경로 | 설명 |
|---|---|---|
| `POST` | `/api/v1/advices/{id}/response` | `accepted` / `ignored` 기록 |

<div class="callout callout--danger">
  <div class="callout__title">무시도 반드시 기록한다</div>
  <p>유저가 권고를 무시하고 발화하면 클라이언트는 <strong>발화 요청 전에</strong> <code>ignored</code> 를 보냅니다.
  이 한 줄이 없으면 11.2의 "옳았는데 무시당한 비율"을 낼 수 없습니다.</p>
</div>

### 노트

| 메서드 | 경로 | 설명 |
|---|---|---|
| `GET` | `/api/v1/sessions/{id}/notes` | 누적 노트 타임라인 |
| `GET` | `/api/v1/sessions/{id}/notes/search?q=` | 자연어 검색 (`search_notes`) |

⑧ 순위이므로 **인터페이스만 먼저 뚫고 구현은 미룹니다.**
초기엔 전량 반환으로 동작시키고, 루프가 쌓이면 임베딩 검색으로 교체합니다.

### 인스펙터 — 판정 로그 개봉

| 메서드 | 경로 | 설명 |
|---|---|---|
| `GET` | `/api/v1/loops/{id}/inspector` | 그 루프의 판정 체인 전체 |
| `GET` | `/api/v1/utterances/{id}/inspector` | 발화 1건의 판정 체인 |

응답은 8.8 출력 구조 그대로입니다 — 의심 판정 → 도구 호출 → 도구 결과 → 불일치 판정 → 신뢰 판정 → 재계획.

<div class="callout">
  <div class="callout__title">전이 도메인에서도 같은 엔드포인트가 열린다</div>
  <p>10.3 시연의 전부가 <strong>"같은 인스펙터가 다른 도메인에서 열리는 장면"</strong>입니다.
  그래서 인스펙터 API는 도메인 중립 필드명을 씁니다 — <code>suspicion</code> 이 아니라
  <code>resistance</code>, <code>trust</code> 가 아니라 <code>rapport</code> 로 매핑되는 계층을 둡니다.</p>
</div>

### 루프 종료 · 엔딩

| 메서드 | 경로 | 설명 |
|---|---|---|
| `POST` | `/api/v1/loops/{id}/end` | Evaluator 판정 → 원인 체인 서술 + 엔딩 타입 |

`ending_type` — `repeat` · `isolation` · `hesitation` · `handover` (7장).

## 계약 변경 절차

1. **먼저 이 문서와 OpenAPI 를 고친다.** 코드가 먼저 나가면 프론트가 모른다
2. 팀 채널에 `[API 변경]` 공지 — 무엇이, 언제부터, 클라이언트가 뭘 해야 하는지
3. D-5(9/11) Feature Freeze 이후에는 **PM 승인 없이 변경 불가**

## 결정 로그

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-09-03 | 인증 엔드포인트 전부 제거, 익명 세션 키로 대체 | 12.4 로그인 없는 즉시 진입 |
| 2026-09-03 | NPC 상태를 응답에서 항상 `null` | 의심도·신뢰도는 유저에게 비노출. 인스펙터에서만 개봉 |
| 2026-09-03 | 권고 무시를 발화 전에 별도 기록 | 무시 로그가 없으면 측정 ②가 성립하지 않음 |
| 2026-09-03 | 인스펙터 필드를 도메인 중립으로 매핑 | 같은 화면이 감사·커리어에서도 열려야 함 (10.3) |
| 2026-09-03 | `search_notes` 는 인터페이스만 선구현 | 12.3 ⑧ — 데모 범위에선 전량 컨텍스트로 충분 |
