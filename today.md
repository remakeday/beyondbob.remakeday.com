---
layout: default
title: 오늘 할 일
permalink: /today/
description: 빌드 시점(KST) 날짜에 해당하는 업무만 모아서 보여줍니다.
---
{%- assign TODAY = site.time | date: "%Y-%m-%d" -%}
{%- assign D = site.data.schedule | where: "date", TODAY | first -%}
<div class="container">
  <header class="page-head">
    <div class="page-head__eyebrow">실행</div>
    <h1>오늘 할 일 · {{ TODAY }}</h1>
    <p>{{ page.description }}</p>
  </header>
  <div class="content">
    {% if D %}
      <div class="dday">
        <div class="dday__big">{{ D.dday }}</div>
        <div class="dday__meta">
          <strong>{{ D.theme }}</strong>
          <span>{{ D.date }} ({{ D.dow }}) · {{ D.phase }} 단계</span>
        </div>
      </div>
      <div class="tl-gate"><b>당일 관문 · GATE</b><br>{{ D.gate }}</div>
      <p style="color:var(--text-2)">{{ D.note }}</p>

      {% for m in site.data.team %}
        {% assign _mt = site.data.kanban[m.key].tasks | where: "date", TODAY %}
        {% if _mt.size > 0 %}
          <h2 id="{{ m.key }}" style="display:flex;align-items:center;gap:10px">
            <span class="avatar avatar--sm" style="background:{{ m.color }}">{{ m.initial }}</span>
            {{ m.name }}
            <span style="font-size:13px;color:var(--text-3);font-weight:400">{{ m.role }} · {{ _mt.size }}건</span>
          </h2>
          {% include kanban-board.html tasks=_mt %}
        {% endif %}
      {% endfor %}
    {% else %}
      <div class="callout callout--warn">
        <div class="callout__title">오늘({{ TODAY }})은 14일 캘린더 밖입니다</div>
        <p>기간은 {{ site.project.kickoff }} ~ {{ site.project.deadline }} 입니다.
        <a href="{{ '/schedule/' | relative_url }}">14일 타임라인</a>에서 전체 일정을 확인하세요.</p>
      </div>
    {% endif %}
    <div class="callout">
      <div class="callout__title">참고</div>
      <p>이 페이지는 <strong>사이트가 빌드된 시점</strong>의 날짜를 씁니다.
      매일 아침 PM이 커밋을 밀면 자동 재빌드되어 갱신됩니다(GitHub Actions).</p>
    </div>
  </div>
</div>
