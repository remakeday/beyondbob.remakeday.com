---
layout: page
title: "이 사이트 사용법"
permalink: /pm/jekyll-guide/
owner: ryujun
eyebrow: "시작하기"
section: pm
description: "팀원이 알아야 할 것은 두 가지뿐입니다 — 내 카드 상태 바꾸기, 데브로그 쓰기."
---

## 5분 안에 알아야 할 것

<div class="grid grid--2" style="margin:16px 0 26px">
  <div class="card">
    <div class="card__title">① 내 카드 상태 바꾸기</div>
    <p style="font-size:13.5px;color:var(--text-2);margin:0">
      <code>_data/kanban/&lt;내이름&gt;.yml</code> 에서 <code>status</code> 한 줄을 고치고 push.
      <strong><code>done</code> 은 붙이지 않습니다</strong> — <code>review</code> 까지만.
    </p>
  </div>
  <div class="card">
    <div class="card__title">② 데브로그 쓰기</div>
    <p style="font-size:13.5px;color:var(--text-2);margin:0">
      <code>_posts/YYYY-MM-DD-제목.md</code> 파일을 만들고 push. 끝입니다.
    </p>
  </div>
</div>

나머지(기획 문서 · 일정 · 팀 정보)는 **PM 이 관리**합니다. 읽기만 하면 됩니다.

## 로컬에서 열어보기

고치기 전에 눈으로 확인하고 싶을 때만 필요합니다. **안 해도 됩니다** — push 하면 자동 배포됩니다.

```bash
git clone https://github.com/remakeday/beyondbob.remakeday.com.git
cd beyondbob.remakeday.com

bundle install          # 최초 1회
bundle exec jekyll serve # → http://localhost:4000
```

Ruby 가 없으면 설치가 번거로우니, **그냥 YAML 만 고쳐서 push** 해도 됩니다.
빌드가 깨지면 GitHub Actions 가 실패 알림을 보내고, 사이트는 이전 버전이 그대로 유지됩니다.

## 내 카드 상태 바꾸기

파일은 팀원별로 하나입니다.

| 이름 | 파일 |
|---|---|
| 류준 | `_data/kanban/ryujun.yml` |
| 장민석 | `_data/kanban/minseok.yml` |
| 신채연 | `_data/kanban/chaeyeon.yml` |
| 이은상 | `_data/kanban/eunsang.yml` |
| 김충식 | `_data/kanban/chungsik.yml` |

`status` 값만 바꾸면 됩니다.

```yaml
- { id: BE-09, date: "2026-09-05", status: doing, priority: P0, tags: [도메인],
    title: "발화 예산 소모 · 차단 · 회복",
    dod: "예산 소진 시 BUDGET_EXHAUSTED, 루프 스킵 시 회복, 하한 3 유지",
    output: "예산 규칙" }
#                    ↑ 여기만 고친다
```

| 값 | 언제 |
|---|---|
| `todo` | 아직 시작 전 (기본값) |
| `doing` | 지금 붙잡고 있다. **동시에 2건까지** |
| `review` | 완료 기준(`dod`)을 채웠다. **팀장 확인 요청** |
| `done` | ✋ **팀장만 씁니다.** 직접 붙이지 마세요 |

매일 23:00 개발 저장소(com.remakeday)의 자동 동기화가 일지·커밋 근거로 상태를 **앞으로만** 올립니다. 근거가 확인된 카드는 `done` 까지 올라갈 수 있고, 사람이 올려둔 상태는 내리지 않습니다. 바뀐 칸반 파일만 자동으로 커밋·푸시합니다.

```bash
git add _data/kanban/minseok.yml
git commit -m "kanban: BE-07 review 요청"
git push
```

<div class="callout">
  <div class="callout__title">왜 <code>done</code> 을 직접 안 붙이나</div>
  <p>완료 기준의 해석이 사람마다 갈리기 때문입니다.
  PM 이 카드의 <code>dod</code> 하나로 판정하면 그 차이가 사라집니다.
  자세한 이유는 <a href="{{ '/pm/review/' | relative_url }}">리뷰 &amp; 숙지 사이클</a>에 있습니다.</p>
</div>

### 카드 추가하기

일을 하다 보면 계획에 없던 게 나옵니다. 그럴 땐 카드를 **추가**하세요 (지우지 말고).

```yaml
- { id: BE-43, date: "2026-09-08", status: doing, priority: P1, tags: [도구],
    title: "탐문 예산 초과 시 호출 거부",
    dod: "NPC 하루 2회 초과 호출이 실행 전에 거부되고 로그에 남는다",
    output: "도구 하네스" }
```

- `id` — 내 접두사(`PM`/`BE`/`AI`/`APP`/`FE`) + 다음 번호
- `date` — **오늘 날짜**. 예정일이 아니라 실제로 하는 날
- `priority` — `P0`(오늘 못 끝내면 남이 막힘) / `P1`(중요) / `P2`(나중에)
- `dod` — **다른 사람이 읽고 판정할 수 있게** 쓴다. “로그인 구현” ✗ → “스테이징에서 실계정 로그인 성공” ○

### 못 끝냈을 때

<div class="callout callout--warn">
  <div class="callout__title">날짜를 미루지 마세요</div>
  <p>오늘 못 끝낸 카드의 <code>date</code> 를 내일로 바꾸면 <strong>지연이 사라져 보입니다.</strong>
  날짜는 그대로 두고 상태만 <code>doing</code> 으로 두세요. 저녁 리뷰에서 PM 이 판단합니다.</p>
</div>

## 데브로그 쓰기

`_posts/` 에 파일 하나 만들면 끝입니다. 파일명은 **반드시** `YYYY-MM-DD-제목.md` 형식.

```markdown
---
title: "인증 토큰 갱신을 어떻게 처리할지"
author: minseok        # ryujun · minseok · chaeyeon · eunsang · chungsik
tags: [백엔드, 인증]
---

## 상황

액세스 토큰이 만료됐을 때 앱과 웹이 각자 다르게 처리하고 있었다.

## 결정

401 + `AUTH_TOKEN_EXPIRED` 를 받으면 클라이언트가 refresh 를 한 번 시도하고,
실패하면 로그인 화면으로 보낸다. 재시도는 1회로 제한한다.

## 이유

무한 재시도를 걸면 서버가 죽었을 때 클라이언트가 요청을 폭주시킨다.
```

`author` 는 <a href="{{ '/kanban/' | relative_url }}">팀 프로필</a>의 key 를 씁니다. 넣으면 이름·역할이 자동으로 붙습니다.

### 무엇을 쓰나

**결정과 이유**를 씁니다. 작업 일지가 아닙니다.

| 쓸 것 | 안 써도 되는 것 |
|---|---|
| 왜 A 대신 B 를 골랐는지 | 오늘 몇 시간 일했는지 |
| 남이 알아야 할 계약·규약 변경 | 커밋 목록 (git 에 이미 있음) |
| 하루 넘게 막혔던 문제와 해결 | 잘 된 일의 나열 |
| 다음 사람이 밟을 함정 | |

## 자주 겪는 문제

| 증상 | 원인 | 해결 |
|---|---|---|
| push 했는데 사이트가 그대로 | 빌드 실패 | 레포 Actions 탭에서 로그 확인 |
| 카드가 안 보임 | YAML 문법 오류 (들여쓰기·따옴표) | 아래 검증 명령 |
| 글이 목록에 없음 | 파일명 날짜 형식 오류 | `2026-09-05-제목.md` 형태인지 |
| 날짜가 하루 밀려 보임 | 타임존 | `_config.yml` 의 `timezone: Asia/Seoul` 확인 |

### YAML 이 맞는지 확인

```bash
ruby -ryaml -e 'p YAML.load_file("_data/kanban/minseok.yml")["tasks"].size'
```

숫자가 나오면 정상입니다. 오류가 나면 대개 **들여쓰기**이거나, 값에 콜론(`:`)이 들어갔는데 따옴표를 안 씌운 경우입니다.

## 사이트 구조 (PM 용)

```
_config.yml              사이트 설정 · 프로젝트 상수(데드라인 등)
_data/
  team.yml               팀 프로필 — 이름·역할·색·담당 영역
  nav.yml                왼쪽 메뉴
  schedule.yml           14일 캘린더 — 날짜·관문(Gate)
  kanban/*.yml           ← 팀원이 만지는 유일한 곳
_plan/                   기획 문서 10편
pm/                      PM 운영 문서
_posts/                  데브로그
_layouts/ _includes/     화면 틀 (팀장만)
assets/css/style.scss    스타일 (팀장만)
```

**날짜를 바꾸려면** `_config.yml` 의 `project.deadline` 과 `_data/schedule.yml` 을 함께 고칩니다.
D-day, 타임라인, 대시보드가 전부 이 값을 참조합니다.
