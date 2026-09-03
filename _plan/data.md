---
title: "데이터 · ERD"
slug: data
owner: minseok
due: "2026-09-04"
state: p0
state_label: "9/04 FREEZE"
eyebrow: "기획 04"
description: "테이블 1개 = Fractal 11-File Set 1벌. 9/04 에 얼리고, 이후 변경은 마이그레이션을 동반합니다."
---

<div class="callout callout--danger">
  <div class="callout__title">9/04(D-12) 18:00 ERD FREEZE</div>
  <p>이 시점 이후 스키마 변경은 <strong>PM 승인 + 마이그레이션 + 클라이언트 대응</strong>이 세트로 따라옵니다.
  프리즈 전에 최대한 의심하고, 프리즈 후에는 최대한 참으세요.</p>
</div>

## 설계 규칙

### 정규화
- 모든 테이블은 **1NF → 2NF → 3NF** 순서로 정규화한다.
- 역정규화는 **명시적 근거가 있을 때만** 허용한다 (근거를 이 문서 하단에 기록).
- 근거 없는 역정규화는 금지.

### 연결
- 모든 테이블은 **노드-엣지로 연결**되어야 한다.
- **고립된 테이블은 설계 오류**로 간주한다. 어디에도 안 붙는 테이블이 생겼다면 모델링이 틀린 것이다.
- 테이블 간 관계는 Repository 레이어에서 JOIN 또는 ID 참조로 구현한다.

### Fractal 대응
- **테이블 1개 = <a href="{{ '/plan/architecture/' | relative_url }}">11-File Set</a> 1벌 = AI/사람 위임 단위 1개**
- 하나의 Router 는 **하나의 테이블만** 담당한다. 이게 SRP 의 실체다.

## 공통 컬럼 규약

모든 테이블이 갖는 컬럼입니다. 예외를 만들지 않습니다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | BIGSERIAL PK | 내부 식별자 |
| `public_id` | UUID UNIQUE | 외부 노출용. **API 응답에는 `id` 대신 이걸 쓴다** |
| `created_at` | TIMESTAMPTZ | 생성 시각 (UTC 저장, 표시 시 KST 변환) |
| `updated_at` | TIMESTAMPTZ | 수정 시각 |
| `deleted_at` | TIMESTAMPTZ NULL | 소프트 삭제. NULL 이면 살아 있음 |

<div class="callout">
  <div class="callout__title">왜 <code>public_id</code> 를 따로 두나</div>
  <p>연속된 정수 <code>id</code> 를 URL 에 노출하면 남의 데이터 개수와 순서가 새어 나가고,
  주소창의 숫자를 바꿔보는 것만으로 접근 시도가 가능해집니다. 나중에 바꾸려면 전 클라이언트를 고쳐야 하니 처음부터 나눕니다.</p>
</div>

## 테이블 목록 (초안)

<div class="callout callout--warn">
  <div class="callout__title">도메인 테이블은 기획서 대조가 필요합니다</div>
  <p>아래에서 <strong>기반 테이블</strong>(인증·프로필·파일·AI)은 기획과 무관하게 확정입니다.
  <strong>도메인 테이블</strong>은 자리만 잡아둔 것이며, 이름과 컬럼은 기획서 v6 대조 후 확정합니다.</p>
</div>

### 기반 — 확정

| 테이블 | 역할 | 주요 컬럼 | 담당 |
|---|---|---|---|
| `user` | 계정 | `email` UNIQUE, `password_hash`, `status` | 장민석 |
| `user_profile` | 프로필 | `user_id` FK, `nickname`, `avatar_file_id` FK | 장민석 |
| `refresh_token` | 토큰 갱신 | `user_id` FK, `token_hash`, `expires_at`, `revoked_at` | 장민석 |
| `file` | 업로드 파일 | `owner_user_id` FK, `path`, `mime`, `size` | 장민석 |
| `conversation` | AI 대화 세션 | `user_id` FK, `title`, `last_message_at` | 신채연 |
| `message` | 대화 메시지 | `conversation_id` FK, `role`, `content`, `token_in`, `token_out` | 신채연 |
| `tool_call` | 툴 호출 기록 | `message_id` FK, `tool_name`, `arguments`, `result`, `latency_ms` | 신채연 |
| `llm_usage` | 비용 집계 | `user_id` FK, `model`, `tokens`, `cost`, `occurred_at` | 신채연 |

### 도메인 — 기획서 대조 필요

| 테이블 | 역할 | 상태 |
|---|---|---|
| `{domain_main}` | 핵심 리소스 #1 (MUST M3) | **이름 미정** |
| `{domain_sub}` | 핵심 리소스 #2, #1과 관계 (MUST M4) | **이름 미정** |
| `{domain_tag}` | 분류/태그 (필요 시) | 미정 |

## 관계도 (기반 부분)

<pre><code>user ──1:1── user_profile ──N:1── file
 │
 ├──1:N── refresh_token
 ├──1:N── file (owner)
 ├──1:N── conversation ──1:N── message ──1:N── tool_call
 └──1:N── llm_usage

user ──1:N── {domain_main} ──1:N── {domain_sub}
                  └──N:1── file</code></pre>

## 인덱스 계획

목록 조회가 느려지는 건 대부분 인덱스가 없어서입니다. **처음부터 걸어둡니다.**

| 테이블 | 인덱스 | 이유 |
|---|---|---|
| `user` | `email` UNIQUE | 로그인 조회 |
| `refresh_token` | `(user_id, expires_at)` | 갱신 시 유효 토큰 탐색 |
| `conversation` | `(user_id, last_message_at DESC)` | 내 대화 목록 정렬 |
| `message` | `(conversation_id, created_at)` | 대화 복원 |
| `llm_usage` | `(user_id, occurred_at)` | 일자별 비용 집계 |
| 모든 테이블 | `deleted_at` 부분 인덱스 | 소프트 삭제 필터 |

## 마이그레이션

- 도구: **Alembic**. 스키마 변경은 반드시 리비전 파일로 남긴다.
- 리비전 하나 = 변경 하나. 여러 변경을 한 리비전에 몰지 않는다.
- **`downgrade` 를 반드시 작성한다.** 롤백 못 하는 마이그레이션은 배포 전날 공포의 근원이 된다.
- D-4(9/12) 에 `downgrade` → `upgrade` 왕복을 실제로 검증한다 (BE-29).

## 기획서 v6 대조

- [ ] 도메인 테이블 3종의 실제 이름·컬럼 확정
- [ ] 기획서의 화면에 나오는 모든 데이터 항목이 어느 테이블에 있는지 매핑
- [ ] 고립 테이블 0개 확인
- [ ] 역정규화가 필요한 지점이 있는지 판단 (있다면 근거를 아래 로그에)

## 결정 로그

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-09-03 | `public_id`(UUID) 를 외부 노출용으로 분리 | 순번 노출·순회 접근 차단. 나중에 바꾸면 전 클라이언트 수정 |
| 2026-09-03 | 소프트 삭제(`deleted_at`) 기본 채택 | 14일 안에 실수로 지운 데이터를 복구할 수단이 필요 |
| 2026-09-03 | 시각은 UTC 저장 · KST 표시 | 앱/웹/서버 타임존이 섞이면 오픈 당일 재현 안 되는 버그가 난다 |
