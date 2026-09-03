---
layout: default
title: 데브로그
permalink: /devlog/
description: 그날 무엇을 왜 그렇게 결정했는지 남기는 기록. 팀원 각자가 담당 영역 기준으로 씁니다.
---
<div class="container">
  <header class="page-head">
    <div class="page-head__eyebrow">기록</div>
    <h1>데브로그</h1>
    <p>{{ page.description }}</p>
  </header>
  <div class="content">
    <div class="callout">
      <div class="callout__title">쓰는 법</div>
      <p><code>_posts/YYYY-MM-DD-제목.md</code> 파일을 만들고 앞머리에
      <code>title</code>, <code>author</code>(팀 프로필 key), <code>tags</code> 를 넣으면 됩니다.
      자세한 절차는 <a href="{{ '/pm/jekyll-guide/' | relative_url }}">이 사이트 사용법</a>에 있습니다.</p>
    </div>
    {% for post in site.posts %}
      <a class="post-item" href="{{ post.url | relative_url }}">
        <div class="post-item__meta">
          {{ post.date | date: "%Y-%m-%d" }}
          {%- if post.author %}{% assign _a = site.data.team | where: "key", post.author | first %} · {{ _a.name }} ({{ _a.role }}){% endif %}
        </div>
        <div class="post-item__t">{{ post.title }}</div>
        <div class="post-item__x">{{ post.excerpt | strip_html | truncate: 140 }}</div>
      </a>
    {% endfor %}
  </div>
</div>
