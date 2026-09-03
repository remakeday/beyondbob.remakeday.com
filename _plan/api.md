---
title: "API 계약"
slug: api
owner: minseok
due: "2026-09-04"
state: p0
state_label: "9/04 발행"
eyebrow: "기획 05"
description: "웹·앱이 같은 계약을 봅니다. 이 문서가 나오는 순간 3인이 병렬로 달릴 수 있습니다."
---

<div class="callout callout--ok">
  <div class="callout__title">이 문서가 일정의 분기점입니다</div>
  <p>계약이 나오기 전까지 김충식·이은상은 <strong>화면 껍데기밖에 못 만듭니다.</strong>
  그래서 9/04 발행이 MUST 입니다. 완벽하지 않아도 됩니다 — <strong>바뀔 수 있다는 걸 알리고 일단 내는 게</strong> 낫습니다.</p>
</div>

## 기본 규약

| 항목 | 값 |
|---|---|
| Base URL (local) | `http://localhost:8300` |
| Base URL (stg / prod) | `https://api-stg.…` / `https://api.…` (9/04 확정) |
| 버전 | 경로에 포함 — `/api/v1/...` |
| 인증 | `Authorization: Bearer <access_token>` |
| 요청/응답 | `application/json; charset=utf-8` |
| 스트리밍 | `text/event-stream` (SSE) |
| 시각 포맷 | ISO 8601 UTC — `2026-09-16T12:00:00Z` |
| 식별자 | 응답에는 항상 `public_id` (UUID). 내부 정수 `id` 는 노출 금지 |
| 네이밍 | 경로·필드 모두 `snake_case` |

## 응답 형태

성공은 **자원 그 자체**를, 실패는 **항상 같은 껍데기**를 돌려줍니다.

```jsonc
// 200 단건
{ "public_id": "…", "name": "…", "created_at": "2026-09-05T02:11:00Z" }

// 200 목록 — 커서 페이지네이션
{
  "items": [ … ],
  "next_cursor": "eyJpZCI6MTIzfQ",   // 없으면 null = 마지막 페이지
  "has_more": true
}

// 4xx / 5xx — 형태가 절대 안 바뀐다
{
  "error": {
    "code": "AUTH_TOKEN_EXPIRED",     // 클라이언트가 분기하는 값
    "message": "로그인이 만료되었습니다.",  // 사용자에게 그대로 보여도 되는 문장
    "detail": { "field": "email" }    // 폼 에러 등 부가 정보. 없으면 null
  }
}
```

<div class="callout">
  <div class="callout__title">클라이언트는 <code>message</code> 로 분기하지 않는다</div>
  <p>분기는 <strong>항상 <code>code</code></strong> 로 합니다. <code>message</code> 는 문구가 언제든 바뀌기 때문입니다.
  이 규칙 하나가 “서버에서 문구 고쳤더니 앱이 깨졌다” 를 막아줍니다.</p>
</div>

## 에러 코드

| code | HTTP | 클라이언트가 할 일 |
|---|---|---|
| `VALIDATION_FAILED` | 400 | `detail.field` 아래에 폼 에러 표시 |
| `AUTH_REQUIRED` | 401 | 로그인 화면으로 |
| `AUTH_TOKEN_EXPIRED` | 401 | refresh 시도 → 실패 시 로그인 화면 |
| `PERMISSION_DENIED` | 403 | “권한이 없습니다” 표시, 이동 없음 |
| `NOT_FOUND` | 404 | 빈 상태 화면 |
| `CONFLICT` | 409 | 중복 안내 (이메일 중복 등) |
| `RATE_LIMITED` | 429 | 잠시 후 재시도 안내 |
| `AI_UNAVAILABLE` | 503 | AI 기능만 비활성화, 나머지는 정상 동작 |
| `INTERNAL_ERROR` | 500 | 일반 오류 화면 + 재시도 버튼 |

## 엔드포인트 (v1 초안)

### 인증 — 장민석 · D-11(9/05)

| 메서드 | 경로 | 설명 |
|---|---|---|
| `POST` | `/api/v1/auth/signup` | 회원가입 |
| `POST` | `/api/v1/auth/login` | 로그인 → `access_token` + `refresh_token` |
| `POST` | `/api/v1/auth/refresh` | 토큰 갱신 |
| `POST` | `/api/v1/auth/logout` | refresh 토큰 폐기 |
| `GET`  | `/api/v1/auth/myself` | **배선 검증용.** 하드코딩 응답 |

### 프로필 — 장민석 · D-10(9/06)

| 메서드 | 경로 | 설명 |
|---|---|---|
| `GET`   | `/api/v1/profiles/me` | 내 프로필 |
| `PATCH` | `/api/v1/profiles/me` | 수정 (본인만) |

### 파일 — 장민석 · D-8(9/08)

| 메서드 | 경로 | 설명 |
|---|---|---|
| `POST` | `/api/v1/files` | 업로드 (multipart) → `public_id` + `url` |

### AI 에이전트 — 신채연 · D-11 ~ D-8

| 메서드 | 경로 | 설명 |
|---|---|---|
| `GET`  | `/api/v1/conversations` | 내 대화 목록 |
| `POST` | `/api/v1/conversations` | 새 대화 생성 |
| `GET`  | `/api/v1/conversations/{id}/messages` | 대화 복원 |
| `POST` | `/api/v1/conversations/{id}/messages` | **SSE 스트리밍 응답** |

### 도메인 — 장민석 · D-10 ~ D-9

| 메서드 | 경로 | 설명 |
|---|---|---|
| `GET/POST` | `/api/v1/{domain}` | 목록 · 생성 |
| `GET/PATCH/DELETE` | `/api/v1/{domain}/{public_id}` | 상세 · 수정 · 삭제 |

> `{domain}` 실제 이름은 <a href="{{ '/plan/data/' | relative_url }}">04 ERD</a> 확정과 함께 결정됩니다.

## SSE 이벤트 계약

AI 응답 스트리밍은 웹·앱이 **동일한 이벤트 타입**을 받습니다. (AI-14 에서 3인 합의)

```
event: delta
data: {"text": "안녕"}

event: tool
data: {"name": "search_items", "status": "running"}

event: done
data: {"message_public_id": "…", "tokens": 412}

event: error
data: {"code": "AI_UNAVAILABLE", "message": "잠시 후 다시 시도해 주세요."}
```

<div class="callout callout--warn">
  <div class="callout__title">스트리밍은 항상 종료 이벤트를 보낸다</div>
  <p><code>done</code> 또는 <code>error</code> 없이 연결이 끊기면 클라이언트는 영원히 로딩 상태로 남습니다.
  서버는 어떤 경로로 끝나든 둘 중 하나를 반드시 내보내고, 클라이언트도 <strong>자체 타임아웃</strong>을 겁니다.</p>
</div>

## 계약 변경 절차

1. 변경이 필요하면 **먼저 이 문서와 OpenAPI 를 고친다.** 코드가 먼저 나가면 클라이언트가 모른다.
2. 팀 채널에 `[API 변경]` 으로 공지 — 무엇이, 언제부터, 클라이언트가 뭘 해야 하는지.
3. 9/11(D-5) Feature Freeze 이후에는 **PM 승인 없이 변경 불가.**

## 기획서 v6 대조

- [ ] 기획서의 화면별 필요 데이터 → 엔드포인트 매핑 (빠진 API 없는지)
- [ ] 도메인 엔드포인트 실제 경로명 확정
- [ ] 검색·필터 조건 확정 (목록 API 쿼리 파라미터)
- [ ] 외부 연동 API 유무 확인

## 결정 로그

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-09-03 | 에러 응답 껍데기 고정 + `code` 기반 분기 | 문구 변경이 클라이언트를 깨뜨리지 않게 |
| 2026-09-03 | 목록은 커서 페이지네이션 | offset 은 데이터가 늘면 뒤 페이지가 느려지고 중복/누락이 생김 |
| 2026-09-03 | SSE 는 `done`/`error` 필수 종료 | 무한 로딩은 오픈 당일 가장 흔한 사고 |
