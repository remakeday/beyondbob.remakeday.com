---
title: "LLM 구성 — Anthropic 단일 벤더 (확정)"
permalink: /misc/llm-orchestration/
eyebrow: "기타 · 확정 2026-09-17"
description: 제출 모델은 Core claude-sonnet-5 + NPC claude-haiku-4-5입니다. 로컬 후보를 전부 평가해 채택한 뒤, 심사 기간 서빙 제약 때문에 외부 API로 옮겼고 같은 러너·같은 게이트로 비열등을 확인했습니다.
---

<div class="callout callout--ok">
  <div class="callout__title">확정 — 2026-09-17 (사용자 확정)</div>
  <p><strong>Core <code>claude-sonnet-5</code> + NPC <code>claude-haiku-4-5</code></strong>, Anthropic 단일 벤더.
  임베딩(채점 RAG)은 계속 Gemini <code>gemini-embedding-001</code>입니다.<br>
  원본: com.remakeday <code>docs/model_evaluation.md</code> 맨 위 「외부 API 전환 결정 — 2026-09-16」 절과 부록 A.19,
  비용은 <code>docs/apiscenario.md</code> 맨 위 「최종 선정」.</p>
</div>

<div class="callout callout--warn">
  <div class="callout__title">이 페이지의 이전 내용(09-03 검토안)은 폐기됐습니다</div>
  <p>09-03에는 「로컬 × 제미나이 하이브리드」를 검토했습니다(역할×캐릭터별 라우팅, 제미나이 키풀, 민석만 로컬).
  실측 결과 제미나이 무료 키는 운영이 안 됐고(아래 탈락 참고), 민석만 과거 대화를 기억하는 메모리 예외도 이후 설계에서 없어져
  그 전제가 남아 있지 않습니다. 검토안 원문은 git 이력에 있습니다.</p>
</div>

## 결론 먼저

| 슬롯 | 맡는 일 | 선정 | 선정 근거 (A.19) |
|---|---|---|---|
| **Core** | 관리자 검사 · 밤 채점 · 신의 질문 · 계획 · 발화 분류 | **claude-sonnet-5** | PCA 0.97 · 극성쌍 O · evaluator 기대 일치 0.71 (n=3). 로컬 gemma4:12b는 0.90 / 0.57 |
| **NPC** | 인물 대화 | **claude-haiku-4-5** | 대화 점검 구조 실패 0 · p50 1.9s · 7세 정책 4/5(로컬 kanana와 같음) · 「방금 들음 vs 기억」 구분이 로컬보다 나음 |

**조합 확인** — 이 구성으로 self-play 5회차 1판 완주: 261.5s, 폴백 0, 크래시 0, NPC 발화 100건 중 메타 누설 0.
planner가 5회차에 한 번 재생성했고 재생성으로 복구했습니다(아래 관찰 항목).

## 왜 외부 API인가 — 품질이 아니라 서빙 제약

로컬 평가(E7 Core · E6 NPC · npc-dialogue-2)는 끝났고 로컬 구성도 채택까지 했습니다: Core `gemma4:12b`(think off), NPC `kanana1.5:8b`.
**그 결정은 유효합니다.** 바뀐 것은 전제입니다. 해커톤은 심사 기간에 실제로 여러 사람이 접속할 수 있는 서비스여야 합니다.

| 제약 | 로컬 구성의 현실 |
|---|---|
| GPU 1장 16 GiB | Core·NPC가 같이 올라가 순차 호출 → **동시 접속 1명**이 상한 |
| 가용성 | 홈서버·홈 회선·정전·재부팅이 곧 장애 |
| 클라우드 GPU | 24 GiB 1장 45일 $1,100~1,600, 그래도 동시 접속은 GPU 1장 |
| 외부 API | 동시 접속은 API 속도 제한까지. 변동비는 [인프라 문서의 비용 절]({{ '/plan/infra/' | relative_url }}#llm-cost) |

> 로컬 후보를 전부 평가해 채택한 뒤, 심사용 서빙 제약에서 외부 API로 전환했고,
> 같은 러너·같은 게이트로 비열등을 확인했다.

외부 후보를 「더 좋아서」 고른 게 아니므로, 측정의 목적은 **로컬 채택 구성이 세운 게이트를 외부 후보가 깨지 않는지**였습니다.
러너·판정 기준·통제 문항은 그대로 두고 모델만 바꿨습니다.

## 탈락

| 후보 | 탈락 이유 |
|---|---|
| Opus 5 (Core) | 품질 우위 없음(eval 0.57, 게이트 경계값) · advisor p95 5.9s로 느림 · 비용 2~3배 |
| Sonnet 5 (NPC) | Haiku와 품질 비슷, 더 느리고 비쌈 · 7세 점검에서 「유저가」 메타 표현 누출 1건 |
| Gemini 무료 키 (NPC) | **하루 20요청 상한.** 80턴 중 14턴만 성공하고 나머지는 429 — 한 판에 NPC 호출이 수십 건이라 운영 불가 |

## 롤백 — 로컬 구성은 남겨 둡니다

어댑터 패턴이라 전환은 `.env`의 provider 두 줄과 모델 이름 두 줄이고 엔진 코드는 바뀌지 않습니다.

| | Core | NPC |
|---|---|---|
| 제출 (09-20 투입) | `anthropic` · `claude-sonnet-5` | `anthropic` · `claude-haiku-4-5` |
| 롤백 · 제출 전 개발 | `ollama` · `gemma4:12b` (think off) | `ollama` · `kanana1.5:8b` |

API 키는 과금 방지를 위해 제출 투입 전까지 `.env`에서 빼 두고, 그 사이 개발·테스트는 로컬로 합니다.

## 운영 관찰 항목

- **advisor p95가 5~7초대에서 흔들립니다.** 지연 게이트(C11) 경계라 표본마다 통과·미달이 갈렸습니다
- **planner `beats` 상한(6)이 강제되지 않습니다.** Anthropic 구조화 출력에서 `maxItems`가 설명 문구로 강등돼, 가끔 7개가 나와 재생성됩니다. 프롬프트 쪽 상한 명시나 응답 후 자르기를 검토 중입니다
- **3턴 망각(7세 정책 항목 3)은 로컬·Anthropic 공통 약점**입니다. 모델을 바꿔도 남았습니다
- 판당 비용은 아직 문자 수 기반 추정입니다. 어댑터가 `response.usage`를 기록하지 않아 실측 정산이 아닙니다

## 결정 로그

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-09-03 | 로컬 × 제미나이 하이브리드 검토안 작성 | 판정 등가성 측정 후 역할별 라우팅 |
| 2026-09-14 | 로컬 채택: Core gemma4:12b · NPC kanana1.5:8b | E7·E6 평가, NPC 상업 라이선스(EXAONE은 연구 전용) |
| 2026-09-16 | 외부 API 전환 결정, Anthropic 평가 실행(A.19) | 심사 기간 서빙 제약 — GPU 1장 동시 접속 1명, 홈서버 가용성 |
| 2026-09-16 | Gemini를 NPC 후보에서 제외 | 무료 키 하루 20요청 상한 |
| 2026-09-17 | **Core Sonnet 5 + NPC Haiku 4.5 확정**, 하이브리드 검토안 폐기 | 게이트 비열등 확인, 조합 self-play 완주. 로컬 구성은 롤백용 유지 |
