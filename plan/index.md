---
layout: default
title: 기획 목차
permalink: /plan/
section: plan
description: 무엇을 만들지 정의하는 문서 10편. 여기 적히지 않은 기능은 9/16까지 만들지 않습니다.
---
{%- assign DOCS = "overview,scope,architecture,data,api,ai,design,infra,release,risk" | split: "," -%}
<div class="container">
  <header class="page-head">
    <div class="page-head__eyebrow">기획</div>
    <h1>기획 목차</h1>
    <p>{{ page.description }}</p>
  </header>

  <div class="content">

    <h2 id="왜-이-순서인가">왜 이 순서인가</h2>
    <p>
      문서 순서는 <strong>의존성 순서</strong>입니다. 앞 문서가 흔들리면 뒤 문서가 전부 흔들리도록 배치했습니다.
      그래서 <strong>01~05를 9/04까지 얼려버리는 것</strong>이 이 프로젝트에서 가장 중요한 일정 장치입니다.
    </p>
<pre><code>01 서비스 개요   무엇을·누구에게        ← 여기가 바뀌면 전부 다시
   └ 02 범위     이번에 어디까지         ← 9/16 안에 들어갈 것만
       └ 03 아키텍처  어떤 구조로
           └ 04 ERD      데이터가 어떻게 생겼나   ← 9/04 FREEZE
               └ 05 API 계약  프론트·앱이 뭘 받나  ← 9/04 발행 → 병렬 착수 가능
                   ├ 06 AI 에이전트
                   ├ 07 디자인 시스템
                   └ 08 인프라 → 09 QA·릴리스 → 10 리스크</code></pre>

    <div class="callout callout--warn">
      <div class="callout__title">기획서 v6 대조가 남아 있습니다</div>
      <p>
        각 문서 하단에는 <strong>「기획서 v6 대조」</strong> 항목이 있습니다.
        <code>{{ site.project.spec_doc }}</code> 원문을 이 레포 <code>_plan/_source/</code> 에 넣고,
        해당 항목을 채워야 그 문서가 <em>확정</em> 상태가 됩니다.
        확정되지 않은 문서에 기대어 만든 기능은 되돌아올 수 있으니, 착수 전에 반드시 상태를 확인하세요.
      </p>
    </div>

    <h2 id="목차">문서 10편</h2>
    <div class="toc-list">
      {% for slug in DOCS %}
        {% assign doc = site.plan | where: "slug", slug | first %}
        {% if doc %}
          {% assign o = site.data.team | where: "key", doc.owner | first %}
          <a class="toc-item" href="{{ doc.url | relative_url }}">
            <span class="toc-item__no">{{ forloop.index | prepend: '0' | slice: -2, 2 }}</span>
            <span>
              <span class="toc-item__t">{{ doc.title }}</span>
              <span class="pill pill--{{ doc.state | default: 'p1' }}" style="margin-left:8px">{{ doc.state_label | default: "초안" }}</span>
              <div class="toc-item__d">{{ doc.description }}</div>
              <div class="toc-item__m">
                담당 {{ o.name }} ({{ o.role }}) · 확정 기한 {{ doc.due }}
              </div>
            </span>
          </a>
        {% endif %}
      {% endfor %}
    </div>

    <h2 id="문서-규칙">문서 규칙</h2>
    <ul>
      <li><strong>결정만 적는다.</strong> 논의 과정은 데브로그에, 결론은 기획 문서에 둡니다.</li>
      <li><strong>바꿀 때는 이유를 남긴다.</strong> 각 문서 하단 「결정 로그」에 날짜·변경·이유를 한 줄로 추가합니다.</li>
      <li><strong>확정 후 변경은 PM 승인.</strong> 특히 04(ERD)와 05(API)는 9/04 이후 변경 시 마이그레이션·클라이언트 대응이 따라옵니다.</li>
      <li><strong>모르면 비워두지 말고 「미정」이라 쓴다.</strong> 빈칸은 합의된 걸로 착각되지만, 「미정」은 누군가 물어보게 만듭니다.</li>
    </ul>
  </div>
</div>
