---
title: "데이터 · ERD"
slug: data
owner: minseok
due: "2026-09-04"
state: p0
state_label: "9/04 FREEZE"
eyebrow: "기획 04"
description: "판정 로그가 이 프로젝트의 산출물입니다. 게임 상태보다 로그 설계가 먼저입니다."
---

<div class="callout callout--danger">
  <div class="callout__title">9/04(D-12) 18:00 ERD FREEZE</div>
  <p>이후 변경은 PM 승인 + 마이그레이션 + 클라이언트 대응이 세트로 따라옵니다.</p>
</div>

## 이 ERD의 성격이 다릅니다

일반 서비스라면 데이터는 기능을 뒷받침합니다. 여기서는 **판정 로그 자체가 산출물**입니다.

- 11.1 시스템 검증 12종이 전부 이 테이블들에서 나온다
- 11.2 실사용 데이터, 특히 **침묵 권고 채택률**이 여기서만 측정된다
- 8.8 인스펙터는 이 로그를 그대로 열어 보여주는 화면이다

> 기획서 11.2: 구현 비용은 로그 테이블 하나 수준이며, **초기 설계에 반드시 포함한다.**

## 계정 테이블이 없습니다

<div class="callout callout--warn">
  <div class="callout__title">로그인을 만들지 않습니다</div>
  <p>12.4가 <strong>로그인·설치 없이 즉시 진입</strong>을 요구합니다.
  <code>user</code>·<code>user_profile</code>·<code>refresh_token</code> 은 전부 삭제했습니다.
  대신 <code>session</code> 이 익명 식별자(쿠키/로컬 저장) 하나로 플레이를 묶습니다.</p>
</div>

## 공통 컬럼

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | BIGSERIAL PK | 내부 식별자 |
| `public_id` | UUID UNIQUE | 외부 노출용 |
| `created_at` | TIMESTAMPTZ | 생성 시각 (UTC 저장 · KST 표시) |

로그 성격 테이블은 `updated_at`·`deleted_at` 을 두지 않습니다. **판정 기록은 수정하거나 지우지 않습니다.**

## 테이블

### 세션 · 루프

| 테이블 | 역할 | 주요 컬럼 |
|---|---|---|
| `session` | 익명 플레이 세션 | `anon_key` UNIQUE, `domain`(game·audit·career), `started_at`, `ended_at` |
| `loop` | 루프 1회 | `session_id` FK, `loop_no`, `utterance_budget`, `ended_reason`, `ending_type` |
| `beat` | 하루의 비트 (5개) | `loop_id` FK, `beat_no`, `scene_key` |

`loop.ending_type` 은 7장의 4종 — `repeat` · `isolation`(고립) · `hesitation`(망설임) · `handover`(인계).

### 대화 · 판정

| 테이블 | 역할 | 주요 컬럼 |
|---|---|---|
| `utterance` | 유저 발화 1건 | `loop_id` FK, `beat_id` FK, `target_npc`, `text`, `delivery`(전달량), `exposure`(노출량), `budget_before/after` |
| `npc_state` | 루프 내 NPC 상태 | `loop_id` FK, `npc_key`(minseok·chaeyeon·eunsang), `suspicion`, `trust`, `probe_budget`, `plan_json` |
| `judgement_log` | **판정 1건 = 인스펙터 1줄** | `utterance_id` FK, `npc_key`, `kind`, `delta`, `accumulated`, `threshold`, `reason`, `raw_llm_json` |
| `replan_event` | 재계획 발동 | `loop_id` FK, `npc_key`, `trigger`, `changed`(bool), `before_plan`, `after_plan` |

`judgement_log.kind` — `suspicion` · `trust` · `tool_call` · `tool_result` · `inconsistency` · `replan`.
**8.8 인스펙터 출력이 이 테이블의 한 루프 분량 그대로입니다.**

### 도구

| 테이블 | 역할 | 주요 컬럼 |
|---|---|---|
| `tool_call` | 도구 호출 | `utterance_id` FK, `caller_npc`, `tool_name`, `arguments`, `result`, `side_effect_json`, `latency_ms`, `budget_after` |

<div class="callout">
  <div class="callout__title">부작용을 컬럼으로 남긴다</div>
  <p><code>ask_npc</code> 는 호출 자체가 상태를 바꿉니다 — 이름을 빌린 쪽의 의심도가 오릅니다.
  <code>side_effect_json</code> 이 없으면 "왜 B가 갑자기 의심하지?"의 인과가 끊깁니다.</p>
</div>

### 노트 · 손상

| 테이블 | 역할 | 주요 컬럼 |
|---|---|---|
| `note_entry` | 루프 노트 (자동 기록) | `session_id` FK, `loop_id` FK, `kind`(death_sense·event·dialogue), `text`, `embedding` |
| `world_damage` | **세계 손상 — 리셋되지 않는 유일한 상태** | `session_id` FK, `depth_score`, `layer1_on`, `layer2_on`, `layer3_on`, `updated_at` |
| `damage_event` | 손상 발현 기록 | `session_id` FK, `loop_id` FK, `layer`, `target`, `detail` |

`world_damage.depth_score` 는 **루프 횟수가 아니라 개입 깊이**에 비례합니다 (4.8).
별도 게이지를 만들지 않고 **기존 판정 로그에서 산출**합니다 — 발화 수 · 신뢰도 변화량 · 결정적 발언 여부.

### 침묵 권고 — 측정 ②

| 테이블 | 역할 | 주요 컬럼 |
|---|---|---|
| `advice_log` | 권고 발동 1건 | `loop_id` FK, `beat_id` FK, `fired`(bool), `recommendation`, `rationale`, `state_snapshot_json`, `rationale_shown`(bool) |
| — | 유저 반응 | `user_action`(accepted·ignored·none), `outcome_delta` |

<div class="callout callout--ok">
  <div class="callout__title">이 테이블 하나가 기획서 11.2의 핵심 지표 전부를 담당합니다</div>
  <ul style="margin:6px 0 0">
    <li>권고 수용률 → <code>user_action</code></li>
    <li>발동 빈도별 수용률 곡선 → <code>fired</code> + 시간 분포</li>
    <li>무시 vs 수용 그룹 결과 대조 → <code>outcome_delta</code></li>
    <li><strong>근거 표시 유무별 수용률 (A/B)</strong> → <code>rationale_shown</code></li>
  </ul>
</div>

`rationale_shown` 을 처음부터 넣는 이유는, 나중에 붙이면 **A/B 대조군이 없어져** 11.2의 마지막 행을 측정할 수 없기 때문입니다.

### 하네스 계측

| 테이블 | 역할 | 주요 컬럼 |
|---|---|---|
| `llm_call` | LLM 호출 1건 | `loop_id` FK, `role`(planner·agent·advisor·evaluator), `model`, `schema_ok`, `retry_count`, `tokens_in/out`, `latency_ms`, `cost` |

역할별 **스키마 통과율 · 재시도율**(9.4)이 여기서 나오고, 비용 관리도 겸합니다.

## 관계도

```
session ──1:N── loop ──1:N── beat
   │              ├──1:N── utterance ──1:N── judgement_log
   │              │             └──1:N── tool_call
   │              ├──1:N── npc_state      (루프당 3행: 민석·채연·은상)
   │              ├──1:N── replan_event
   │              ├──1:N── advice_log
   │              └──1:N── llm_call
   ├──1:N── note_entry        ← 루프를 넘어 누적
   ├──1:1── world_damage      ← 리셋되지 않음
   └──1:N── damage_event
```

**리셋 경계가 곧 테이블 경계입니다.** `loop` 아래는 루프마다 새로 생기고,
`session` 직속(`note_entry`·`world_damage`)은 루프를 넘어 살아남습니다. 8.4 메모리 비대칭이 스키마에 그대로 박힙니다.

## 민석 예외는 스키마가 아니라 정책

`npc_state` 는 셋 다 같은 테이블을 씁니다. 차이는 **루프 전이 시 무엇을 이월하는가**뿐입니다.

| NPC | 이월 |
|---|---|
| 채연 · 은상 | 소거 (신뢰 **5% 잔류**) |
| **민석** | **유지** |

> 같은 NPC 인터페이스를 구현하되 **메모리 정책만 다르게 주입**합니다.
> 포트 설계가 제대로 돼 있으면 정책 주입만으로 처리됩니다 — **아키텍처가 서사를 지탱하는 지점**입니다.

## 인덱스

| 테이블 | 인덱스 | 이유 |
|---|---|---|
| `loop` | `(session_id, loop_no)` | 루프 조회 |
| `utterance` | `(loop_id, created_at)` | 대화 복원 |
| `judgement_log` | `(utterance_id)` | 인스펙터 개봉 |
| `note_entry` | `(session_id, loop_id)` + `embedding` 벡터 인덱스 | 노트 축적 · `search_notes` |
| `advice_log` | `(user_action, rationale_shown)` | 11.2 집계 |
| `llm_call` | `(role, model, schema_ok)` | 9.4 하네스 지표 |

## 마이그레이션

- **Alembic.** 리비전 하나 = 변경 하나. `downgrade` 필수 작성
- D-4(9/12) 에 `downgrade` → `upgrade` 왕복 검증
- 오픈 직전에는 **추가만** 하는 마이그레이션 (컬럼 삭제·이름 변경 금지)

## 결정 로그

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-09-03 | 계정 테이블 전부 삭제, 익명 `session` 도입 | 12.4 로그인 없는 즉시 진입 |
| 2026-09-03 | `advice_log.rationale_shown` 을 초기 설계에 포함 | 나중에 붙이면 A/B 대조군이 사라져 11.2 측정 불가 |
| 2026-09-03 | `world_damage` 를 session 직속으로 (loop 아래 아님) | 손상은 리셋되지 않는 유일한 세계 상태 (4.8) |
| 2026-09-03 | 손상 게이지를 별도 관리하지 않고 판정 로그에서 산출 | 4.8 원문. 중복 상태를 만들면 어긋난다 |
| 2026-09-03 | `tool_call.side_effect_json` 필수 | 부작용이 안 남으면 발각의 인과가 끊긴다 |
