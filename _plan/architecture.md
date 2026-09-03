---
title: "시스템 아키텍처"
slug: architecture
owner: minseok
due: "2026-09-04"
state: p1
state_label: "확정"
eyebrow: "기획 03"
description: "모듈러 모놀리스 · 헥사고날 · Fractal 11-File Set. 5인이 서로 안 밟히며 병렬로 달리기 위한 구조."
---

## 전체 그림

<pre><code>┌── 클라이언트 ─────────────────────────────┐
│  Flutter 앱 (이은상)      웹 프론트 (김충식) │
│         └────────┬──────────┘               │
└──────────────────│──────────────────────────┘
                   │  같은 API 계약 (OpenAPI)
                   │  HTTPS · JWT · SSE
┌──────────────────▼──────────────────────────┐
│  FastAPI  :8300   모듈러 모놀리스            │
│                                              │
│  apps/            ← Bounded Context 모음     │
│    auth/          인증          (장민석)      │
│    profile/       프로필        (장민석)      │
│    {domain}/      핵심 도메인   (장민석)      │
│    agent/         AI 에이전트   (신채연)      │
│                                              │
│  core/matrix/     ← 전역 인프라               │
│    DB 매니저 · Secret 매니저                  │
│    (apps → core 단방향. 역참조 금지)          │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
   PostgreSQL              LLM Provider
   (+ 벡터 검색)            (신채연 관리)</code></pre>

## 왜 모듈러 모놀리스인가

14일짜리 프로젝트에서 마이크로서비스는 **비용만 내고 이득은 못 받습니다.**
배포 파이프라인이 N배, 로컬 실행이 N배, 장애 추적이 N배가 되는데,
그 대가로 얻는 독립 배포·독립 확장은 오픈 첫 주에 필요하지 않습니다.

대신 **내부는 Bounded Context 단위로 완전히 갈라놓습니다.** 그래서:

- 장민석과 신채연이 각자 다른 `apps/*` 디렉토리에서 작업 → **머지 충돌이 거의 안 난다**
- 나중에 진짜 분리가 필요해지면 BC 하나를 통째로 떼면 됨
- AI가 실수해도 해당 BC 안에서만 망가짐

## 의존성 규칙 — 이것만 지키면 된다

<div class="callout callout--ok">
  <div class="callout__title">단 하나의 규칙</div>
  <p><strong>비즈니스 로직은 인프라를 모른다.</strong> 의존성은 항상 안쪽을 향한다.</p>
</div>

```
Adapter (FastAPI · SQLAlchemy)  →  Application (UseCase)  →  Domain (Entity · VO)
   바깥                                                          안
```

- `domain/`, `app/use_cases/` 에서 **FastAPI · SQLAlchemy import 금지**
- `core/` 는 `apps/` 를 **절대 import 하지 않는다** (한 방향: `apps → core`)
- 외부와의 접점은 전부 **Port**(인터페이스)를 통과한다

## Fractal 11-File Set

**ERD 테이블 1개 = 파일 11개 = 한 사람이 한 번에 맡는 단위.**

```
테이블 {name} 을 만들면 항상 이 11개:

  adapter/inbound/api/v1/{name}_router.py       ← HTTP 진입
  app/ports/input/{name}_use_case.py            ← Driving Port
  app/use_cases/{name}_interactor.py            ← 비즈니스 로직
  app/ports/output/{name}_port.py               ← Driven Port
  adapter/outbound/repositories/{name}_repository.py
  adapter/inbound/api/schemas/{name}_schema.py  ← 요청/응답 스키마
  app/dtos/{name}_dto.py
  adapter/outbound/orms/{name}_orm.py
  domain/entities/{name}_entity.py
  adapter/inbound/mappers/{name}_mapper.py      ← schema ↔ dto
  adapter/outbound/orm_mappers/{name}_orm_mapper.py  ← entity ↔ orm
```

**왜 이렇게까지 하나:** 형태가 항상 같으면 새 테이블을 붙일 때 **생각할 게 없습니다.**
14일 안에 테이블 10개를 만들어야 한다면, 매번 구조를 고민하는 시간이 곧 일정입니다.

### 새 라우터를 만들 때 — myself 부터

실제 비즈니스 로직보다 **먼저** `GET /{prefix}/myself` 를 붙입니다.
DB 없이 하드코딩한 값(`{id, name}`)을 그대로 왕복시키고, 200 이 나오면
`router → use_case → interactor → port → repository` 배선이 살아 있다는 뜻입니다.

> 배선이 틀린 상태에서 비즈니스 로직을 얹으면, 어디가 문제인지 찾는 데 반나절이 갑니다.
> `myself` 는 그 반나절을 5분으로 줄이는 장치입니다.

## 경계 톨게이트

| 경계 | 변환 담당 | 무엇 ↔ 무엇 |
|---|---|---|
| Inbound (Router → Interactor) | `mapper` | `schema` ↔ `dto` |
| Outbound (Repository → DB) | `orm_mapper` | `entity` ↔ `ORM` |

이 두 지점을 넘을 때 반드시 변환합니다. **FastAPI 의 요청 객체나 SQLAlchemy 모델이 UseCase 안으로 들어오면 규칙 위반입니다.**

## 클라이언트 아키텍처

| | 웹 (김충식) | 앱 (이은상) |
|---|---|---|
| 라우팅 | 파일/설정 기반 라우터 | `go_router` |
| 상태 | 서버 상태와 UI 상태 분리 | `Riverpod` |
| API | OpenAPI 계약에서 타입 생성 | 동일 계약 |
| 인증 | 세션 유지 + 자동 갱신 | secure storage + 자동 갱신 |
| 스트리밍 | SSE (`EventSource` 계열) | SSE |
| 디자인 | 디자인 토큰 원본 | 같은 토큰 값을 `ThemeData` 로 |

<div class="callout">
  <div class="callout__title">웹과 앱은 같은 계약을 본다</div>
  <p>클라이언트마다 API 를 따로 만들면 백엔드 1인이 두 배로 일하게 됩니다.
  화면 차이는 클라이언트에서 흡수하고, 서버는 <strong>하나의 계약</strong>만 유지합니다.</p>
</div>

## AI 에이전트의 위치

에이전트는 `apps/agent/` 라는 **또 하나의 Bounded Context** 입니다. 특별 취급하지 않습니다.

- 도메인 데이터가 필요하면 → 다른 BC 가 노출한 **내부 포트**를 호출 (DB 직접 접근 금지)
- LLM 프로바이더는 → `LlmPort` 뒤에 숨긴다. 프로바이더 교체 = 어댑터 교체
- 자세한 내용은 <a href="{{ '/plan/ai/' | relative_url }}">06 AI 에이전트 설계</a>

## 기획서 v6 대조

- [ ] 기획서의 기능이 어느 BC 에 속하는지 매핑 (BC 목록 확정)
- [ ] 외부 연동(결제·지도·소셜 등) 유무 확인 → 있으면 BC 또는 어댑터 추가
- [ ] 실시간성 요구사항 확인 → SSE 로 충분한지, 웹소켓이 필요한지

## 결정 로그

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-09-03 | 모듈러 모놀리스 유지 (마이크로서비스 안 함) | 14일 일정에서 운영 복잡도 대비 이득 없음 |
| 2026-09-03 | 실시간은 SSE 로 통일 (웹소켓 미사용) | 단방향 스트리밍만 필요. 웹·앱 양쪽 구현 부담이 절반 |
| 2026-09-03 | AI 에이전트도 일반 BC 로 취급 | 특별 구조를 만들면 그것만 아무도 못 고치게 됨 |
