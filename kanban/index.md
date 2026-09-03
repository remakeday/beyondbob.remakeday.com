---
layout: default
title: 전체 칸반
permalink: /kanban/
section: kanban
description: 5인 전원의 업무를 한 화면에서 봅니다. 개인 보드는 각 팀원 페이지에서 확인합니다.
---
{%- assign ALL = "" | split: "" -%}
{%- for m in site.data.team -%}{%- assign ALL = ALL | concat: site.data.kanban[m.key].tasks -%}{%- endfor -%}
<div class="container">
  <header class="page-head">
    <div class="page-head__eyebrow">실행</div>
    <h1>전체 칸반</h1>
    <p>{{ page.description }}</p>
  </header>

  <div class="content">
    <div class="card" style="margin-bottom:24px">
      <div class="card__title">전체 진행 현황 ({{ ALL | size }}건)</div>
      {% include progress.html tasks=ALL %}
    </div>

    <h2 id="보드-읽는-법">보드 읽는 법</h2>
    <table>
      <thead><tr><th>상태</th><th>뜻</th><th>누가 바꾸나</th></tr></thead>
      <tbody>
        <tr><td><code>todo</code></td><td>아직 시작 전</td><td>담당자</td></tr>
        <tr><td><code>doing</code></td><td>오늘 붙잡고 있는 일. 1인당 동시 2건까지</td><td>담당자</td></tr>
        <tr><td><code>review</code></td><td>완료 기준을 채웠고 <strong>PM 확인 대기</strong></td><td>담당자</td></tr>
        <tr><td><code>done</code></td><td>PM이 완료 기준 충족을 확인함</td><td><strong>PM만</strong></td></tr>
      </tbody>
    </table>
    <div class="callout">
      <div class="callout__title">규칙</div>
      <p><code>done</code> 은 담당자가 직접 붙이지 않습니다. 담당자는 <code>review</code> 까지만 올리고,
      PM이 <a href="{{ '/pm/review/' | relative_url }}">리뷰 사이클</a>에서 확인한 뒤 <code>done</code> 으로 내립니다.
      이게 “팀원이 한 업무를 PM이 확인하고 숙지한다”는 절차의 실체입니다.</p>
    </div>

    <h2 id="팀원별-보드">팀원별 보드</h2>
    {% for m in site.data.team %}
      {% assign _t = site.data.kanban[m.key].tasks %}
      <h3 id="{{ m.key }}" style="display:flex;align-items:center;gap:10px">
        <span class="avatar avatar--sm" style="background:{{ m.color }}">{{ m.initial }}</span>
        {{ m.name }} <span style="font-size:13px;color:var(--text-3);font-weight:400">{{ m.role }} · {{ _t | size }}건</span>
        <a href="{{ '/kanban/' | append: m.key | append: '/' | relative_url }}" style="margin-left:auto;font-size:12.5px">개인 보드 →</a>
      </h3>
      {% include progress.html tasks=_t %}
      {% include kanban-board.html tasks=_t %}
    {% endfor %}
  </div>
</div>
