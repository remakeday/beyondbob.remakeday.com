---
layout: default
title: 대시보드
description: REMAKE DAY 팀의 14일 릴리스 현황을 한 화면에서 확인합니다.
---
{%- assign DL    = site.project.deadline | append: "T23:59:59+09:00" | date: "%s" | plus: 0 -%}
{%- assign NOW   = site.time | date: "%s" | plus: 0 -%}
{%- assign DLEFT = DL | minus: NOW | divided_by: 86400 -%}
{%- assign TODAY = site.time | date: "%Y-%m-%d" -%}
{%- assign ALL = "" | split: "" -%}
{%- for m in site.data.team -%}
  {%- assign _t = site.data.kanban[m.key].tasks -%}
  {%- assign ALL = ALL | concat: _t -%}
{%- endfor -%}
{%- assign N_ALL  = ALL | size -%}
{%- assign N_DONE = ALL | where: "status", "done" | size -%}
{%- assign N_P0   = ALL | where: "priority", "P0" | size -%}
{%- assign TODAY_TASKS = ALL | where: "date", TODAY -%}
{%- assign TODAY_DAY = site.data.schedule | where: "date", TODAY | first -%}

<div class="container">

  <div class="dday">
    <div class="dday__big" data-dday="{{ site.project.deadline }}">D-{{ DLEFT }}</div>
    <div class="dday__meta">
      <strong>{{ site.project.deadline }} (수) 프로덕션 배포 · 서비스 오픈</strong>
      <span>이 날짜는 고정입니다. 일정이 밀리면 날짜가 아니라 범위를 줄입니다.</span>
    </div>
    <div>
      <span class="pill pill--accent">MUST 범위 사수</span>
      <span class="pill">전체 {{ N_ALL }}건</span>
      <span class="pill pill--p0">P0 {{ N_P0 }}건</span>
    </div>
  </div>

  <div class="callout callout--ok">
    <div class="callout__title">✓ 기획서 v6 반영 완료 (2026-09-03)</div>
    <p>
      기획 문서 10편과 칸반 {{ N_ALL }}건이 <strong>기획서 v6 원문 기준</strong>으로 재작성됐습니다.
      REMAKE DAY 는 <strong>루프물 대화 게임</strong>이고, BeyondBob 은 게임·감사 대응·커리어 대화가 공유하는 <strong>엔진 이름</strong>입니다.
      우선순위는 기획서 12.3 의 <a href="{{ '/plan/scope/' | relative_url }}">절대 방어선 ①~⑤</a> 를 그대로 씁니다 —
      다섯이 없으면 제출하지 않습니다.
      바뀐 내역은 <a href="{{ '/misc/projection/' | relative_url }}#gap">반영 결과표</a>에 남겼습니다.
    </p>
  </div>

  <div class="callout callout--warn">
    <div class="callout__title">기획서를 따르지 않는 항목은 「기간」 하나입니다</div>
    <p>
      기획서 12장은 <strong>3주</strong> 범위이고 우리 데드라인은 <strong>14일</strong>입니다.
      방어선 ①~⑤ 는 지키고 ⑥~⑨ 를 줄여 흡수합니다 (<a href="{{ '/plan/risk/' | relative_url }}">R2</a>).
      또 기획서에 모바일 앱이 없어 이은상이 <strong>노트·인스펙터</strong>로 재배치됐습니다 (<a href="{{ '/plan/risk/' | relative_url }}">R3</a>).
    </p>
  </div>

  <div class="grid grid--4" style="margin-bottom:22px">
    <div class="stat">
      <div class="stat__label">남은 일수</div>
      <div class="stat__value" style="color:var(--warn)">{{ DLEFT }}</div>
      <div class="stat__note">킥오프 {{ site.project.kickoff }} 기준</div>
    </div>
    <div class="stat">
      <div class="stat__label">전체 업무</div>
      <div class="stat__value">{{ N_ALL }}</div>
      <div class="stat__note">5인 × 14일</div>
    </div>
    <div class="stat">
      <div class="stat__label">완료</div>
      <div class="stat__value" style="color:var(--accent)">{{ N_DONE }}</div>
      <div class="stat__note">PM 확인 완료 기준</div>
    </div>
    <div class="stat">
      <div class="stat__label">오늘 할 일</div>
      <div class="stat__value" style="color:var(--info)">{{ TODAY_TASKS | size }}</div>
      <div class="stat__note">{{ TODAY }}</div>
    </div>
  </div>

  <div class="content">

    {% if TODAY_DAY %}
    <h2 id="오늘">오늘 — {{ TODAY_DAY.dday }} · {{ TODAY_DAY.theme }}</h2>
    <div class="tl-gate"><b>당일 관문</b><br>{{ TODAY_DAY.gate }}</div>
    <p style="color:var(--text-2);font-size:13.5px">{{ TODAY_DAY.note }}</p>
    {% for m in site.data.team %}
      {% assign _mt = site.data.kanban[m.key].tasks | where: "date", TODAY %}
      {% if _mt.size > 0 %}
      <div class="tl-mem">
        <div class="tl-mem__head">
          <span class="avatar avatar--sm" style="background:{{ m.color }}">{{ m.initial }}</span>
          <span class="tl-mem__name">{{ m.name }}</span>
          <span class="pill">{{ _mt.size }}건</span>
        </div>
        <ul>
          {% for t in _mt %}
          <li><a class="mono" href="{{ '/kanban/' | append: m.key | append: '/' | relative_url }}#{{ t.id }}">{{ t.id }}</a>
              <span class="pill pill--{{ t.priority | downcase }}">{{ t.priority }}</span> <b>{{ t.title }}</b></li>
          {% endfor %}
        </ul>
      </div>
      {% endif %}
    {% endfor %}
    <p><a href="{{ '/today/' | relative_url }}">→ 오늘 할 일 전체 보기</a></p>
    {% else %}
    <div class="callout">
      <div class="callout__title">오늘은 14일 캘린더 범위 밖입니다</div>
      <p>기간은 {{ site.project.kickoff }} ~ {{ site.project.deadline }} 입니다. <a href="{{ '/schedule/' | relative_url }}">14일 타임라인</a>을 확인하세요.</p>
    </div>
    {% endif %}

    <h2 id="팀-현황">팀 현황</h2>
    <div class="grid grid--2">
      {% for m in site.data.team %}
        {% assign _t = site.data.kanban[m.key].tasks %}
        <a class="card member-card" href="{{ '/kanban/' | append: m.key | append: '/' | relative_url }}">
          <div class="member-row">
            <span class="avatar" style="background:{{ m.color }}">{{ m.initial }}</span>
            <div>
              <div style="font-weight:800">{{ m.name }}</div>
              <div class="member-card__role">{{ m.role }}</div>
            </div>
            <span class="pill" style="margin-left:auto">{{ _t | size }}건</span>
          </div>
          <div class="member-card__scope">{{ m.scope }}</div>
          <div style="margin-top:12px">{% include progress.html tasks=_t %}</div>
        </a>
      {% endfor %}
    </div>

    <h2 id="이-사이트는">이 사이트는 무엇인가</h2>
    <p>
      REMAKE DAY 팀의 <strong>기획 · 일정 · 개인 업무 · 확인 기록</strong>을 한곳에 두는 개발 허브입니다.
      코드는 <a href="{{ site.project.repo_app }}">com.remakeday</a> 에, 그 코드를 왜·언제·누가 만드는지는 여기에 둡니다.
    </p>
    <div class="grid grid--3">
      <div class="card">
        <div class="card__title">① 기획을 먼저 고정한다</div>
        <p style="font-size:13.5px;color:var(--text-2);margin:0">
          <a href="{{ '/plan/' | relative_url }}">기획 목차</a>의 11개 문서가 무엇을 만들지 정의합니다.
          여기 없는 기능은 만들지 않습니다.
        </p>
      </div>
      <div class="card">
        <div class="card__title">② 날짜로 쪼개 배분한다</div>
        <p style="font-size:13.5px;color:var(--text-2);margin:0">
          <a href="{{ '/schedule/' | relative_url }}">14일 타임라인</a>과 개인 칸반이 매일의 관문과 담당을 지정합니다.
        </p>
      </div>
      <div class="card">
        <div class="card__title">③ PM이 매일 확인한다</div>
        <p style="font-size:13.5px;color:var(--text-2);margin:0">
          <a href="{{ '/pm/review/' | relative_url }}">리뷰 &amp; 숙지 사이클</a>에 따라
          하루 두 번 상태를 맞추고 기록을 남깁니다.
        </p>
      </div>
    </div>

    <h2 id="최근-데브로그">최근 데브로그</h2>
    {% for post in site.posts limit: 4 %}
      <a class="post-item" href="{{ post.url | relative_url }}">
        <div class="post-item__meta">{{ post.date | date: "%Y-%m-%d" }}{% if post.author %}{% assign _a = site.data.team | where: "key", post.author | first %} · {{ _a.name }}{% endif %}</div>
        <div class="post-item__t">{{ post.title }}</div>
        <div class="post-item__x">{{ post.excerpt | strip_html | truncate: 110 }}</div>
      </a>
    {% endfor %}
    <p style="margin-top:14px"><a href="{{ '/devlog/' | relative_url }}">→ 전체 데브로그</a></p>

  </div>
</div>
