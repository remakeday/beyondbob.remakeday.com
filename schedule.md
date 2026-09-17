---
layout: default
title: 14일 타임라인
permalink: /schedule/
description: 킥오프부터 서비스 오픈까지 14일. 하루마다 관문(Gate)이 있고, 관문을 못 넘기면 그날 저녁 범위를 조정합니다.
---
{%- assign TODAY = site.time | date: "%Y-%m-%d" -%}
<div class="container">
  <header class="page-head">
    <div class="page-head__eyebrow">실행</div>
    <h1>14일 타임라인</h1>
    <p>{{ page.description }}</p>
  </header>

  <div class="content">
    <h2 id="단계">4단계 구성</h2>
    <table>
      <thead><tr><th>단계</th><th>기간</th><th>이 단계가 끝나면</th></tr></thead>
      <tbody>
        <tr><td><strong>설계</strong></td><td>9/03 – 9/04 (2일)</td><td>ERD·API 계약이 얼어붙어 5인이 병렬로 달릴 수 있다</td></tr>
        <tr><td><strong>구현</strong></td><td>9/05 – 9/10 (6일)</td><td>MUST 범위 기능이 전부 코드로 존재한다</td></tr>
        <tr><td><strong>안정화</strong></td><td>9/11 – 9/13 (3일)</td><td>P0/P1 버그 0건, 성능·보안·스토어 통과</td></tr>
        <tr><td><strong>릴리스</strong></td><td>9/14 – 9/16 (3일)</td><td>프로덕션에서 서비스가 돌아간다</td></tr>
      </tbody>
    </table>

    <div class="callout callout--danger">
      <div class="callout__title">날짜는 못 밀고, 범위는 민다</div>
      <p>9/16 은 고정입니다. D-7(9/09) 알파 시연에서 남은 분량이 감당 안 되면
      그날 저녁 팀장이 <a href="{{ '/plan/scope/' | relative_url }}">범위 문서</a>에서 SHOULD 이하를 잘라냅니다.
      개인이 혼자 야근으로 메우는 방식은 금지합니다 — 어디가 늦는지 안 보이게 되기 때문입니다.</p>
    </div>

    <h2 id="일자별">일자별 계획</h2>
    {% for d in site.data.schedule %}
      {% assign _n = 0 %}
      <div class="tl-day"{% if d.date == TODAY %} style="border-color:var(--accent)"{% endif %}>
        <div class="tl-day__head">
          <span class="tl-day__dday">{{ d.dday }}</span>
          <span class="tl-day__date">{{ d.date }} ({{ d.dow }})</span>
          <span class="tl-day__theme">{{ d.theme }}</span>
          <span class="pill" style="margin-left:auto">{{ d.phase }}</span>
          {% if d.date == TODAY %}<span class="pill pill--accent">오늘</span>{% endif %}
        </div>
        <div class="tl-day__body">
          <div class="tl-gate"><b>당일 관문 · GATE</b><br>{{ d.gate }}</div>
          <p style="font-size:13px;color:var(--text-3);margin:-4px 0 12px">{{ d.note }}</p>
          {% for m in site.data.team %}
            {% assign _mt = site.data.kanban[m.key].tasks | where: "date", d.date %}
            {% if _mt.size > 0 %}
            <div class="tl-mem">
              <div class="tl-mem__head">
                <span class="avatar avatar--sm" style="background:{{ m.color }}">{{ m.initial }}</span>
                <span class="tl-mem__name">{{ m.name }}</span>
                <span style="font-size:12px;color:var(--text-3)">{{ m.role }}</span>
                <span class="pill" style="margin-left:auto">{{ _mt.size }}건</span>
              </div>
              <ul>
                {% for t in _mt %}
                <li>
                  <a class="mono" href="{{ '/kanban/' | append: m.key | append: '/' | relative_url }}#{{ t.id }}">{{ t.id }}</a>
                  <span class="pill pill--{{ t.priority | downcase }}">{{ t.priority }}</span>
                  <b>{{ t.title }}</b><br>
                  <span style="color:var(--text-3);font-size:12.5px">완료 기준 · {{ t.dod }}</span>
                </li>
                {% endfor %}
              </ul>
            </div>
            {% endif %}
          {% endfor %}
        </div>
      </div>
    {% endfor %}
  </div>
</div>
