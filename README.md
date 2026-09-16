# beyondbob.remakeday.com

**REMAKE DAY · BeyondBob 팀 개발 허브** — 기획 · 14일 일정 · 팀원별 칸반 · 데브로그.

> 서비스 오픈: **2026-09-16 (수)** · 애플리케이션 레포: [remakeday/com.remakeday](https://github.com/remakeday/com.remakeday)

## 팀원이 알아야 할 것 두 가지

### 1. 내 카드 상태 바꾸기

`_data/kanban/<내이름>.yml` 에서 `status` 한 줄만 고치고 push 합니다.

| 이름 | 파일 |
|---|---|
| 류준 (PM) | `_data/kanban/ryujun.yml` |
| 장민석 (백엔드·AI) | `_data/kanban/minseok.yml` |
| 신채연 (AI·백엔드) | `_data/kanban/chaeyeon.yml` |
| 이은상 (Flutter) | `_data/kanban/eunsang.yml` |
| 김충식 (프론트엔드) | `_data/kanban/chungsik.yml` |

`todo` → `doing` → `review` 까지가 담당자, **`done` 은 PM 만** 붙입니다.

### 2. 데브로그 쓰기

`_posts/YYYY-MM-DD-제목.md` 파일을 만들고 push 합니다.

```markdown
---
title: "글 제목"
author: minseok
tags: [백엔드]
---
```

자세한 내용은 사이트의 [이 사이트 사용법](https://blog.remakeday.com/pm/jekyll-guide/) 참고.

## 로컬 실행

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

Ruby 없이 YAML 만 고쳐 push 해도 됩니다. 빌드가 실패하면 사이트는 이전 버전이 유지됩니다.

## 구조

```
_config.yml            사이트 설정 · 데드라인 등 프로젝트 상수
_data/
  team.yml             팀 프로필
  nav.yml              왼쪽 메뉴
  schedule.yml         14일 캘린더 (날짜 · 관문)
  kanban/*.yml         ← 팀원이 만지는 유일한 곳 (총 205건)
_plan/                 기획 문서 10편
pm/                    PM 운영 문서 (매뉴얼 · 인프라 런북 · 리뷰 사이클 · 체크리스트)
_posts/                데브로그
_layouts/ _includes/   화면 틀
assets/                스타일 · 스크립트
```

## 배포

`main` push → GitHub Actions (`.github/workflows/jekyll.yml`) → GitHub Pages.
저장소 설정에서 **Settings → Pages → Source 를 "GitHub Actions"** 로 지정해야 합니다.

## 반영이 필요한 항목

- `REMAKE_DAY_기획서_v6.md` — 각 기획 문서의 「기획서 v6 대조」 항목
- 컨셉 화면 기록 (`.mov`) — 디자인 토큰 (`_plan/design.md`)
