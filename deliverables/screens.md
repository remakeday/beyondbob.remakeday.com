---
title: "구현 화면 — 최종 산출물"
permalink: /deliverables/screens/
eyebrow: "산출물 · 촬영 2026-09-18"
description: 목업이 아닙니다. 로컬 실서버에서 한 판(5회차)을 실제로 끝까지 플레이하며 찍은 화면입니다. 진입부터 마지막 밤의 회고까지 플레이 순서대로 싣습니다.
---

<div class="callout">
  <div class="callout__title">촬영 조건</div>
  <p>
  <strong>서버</strong> 로컬 실서버(프런트 Next.js · 백엔드 FastAPI · PostgreSQL). 목데이터나 API 가로채기 없이 실제 요청으로 진행했습니다.<br>
  <strong>모델</strong> 로컬 구성(Core <code>gemma4:12b</code> · NPC <code>kanana1.5:8b</code>)입니다. 제출 구성은 Core Sonnet 5 · NPC Haiku 4.5이고, 화면과 흐름은 같습니다 — <a href="{{ '/misc/llm-orchestration/' | relative_url }}">LLM 구성 (확정)</a>.<br>
  <strong>플레이</strong> 자동 플레이 스크립트가 한 판을 끝까지 진행했습니다. 질문과 밤의 서술은 스크립트가 넣은 일반적인 문장이라 이해도는 0%로 나왔습니다. NPC 대답·신의 답변·규칙 후보·채점은 전부 서버가 실제로 만든 결과입니다.<br>
  <strong>화면</strong> 데스크톱 1280×800. 긴 화면은 필요한 부분만 잘랐습니다.
  </p>
</div>

<div class="callout callout--warn">
  <div class="callout__title">싣지 않은 것</div>
  <p>결말을 짐작하게 하는 4·5회차 밤의 단서, 회고 화면의 4번째 밤 단서(흐리게 처리), 진실 공개 카드(이번 판은 이해도 0%라 열리지 않았습니다), 개발자용 인스펙터 화면은 공개 페이지에 싣지 않습니다.</p>
</div>

<ul class="shot-toc">
  <li><a href="#entry">1. 진입</a></li>
  <li><a href="#morning">2. 아침</a></li>
  <li><a href="#day">3. 낮 — 대화</a></li>
  <li><a href="#night">4. 밤 — 서술과 채점</a></li>
  <li><a href="#doom">5. 멸망</a></li>
  <li><a href="#god">6. 신의 개입</a></li>
  <li><a href="#final">7. 다섯 번째 밤</a></li>
</ul>

## 1. 진입 {#entry}

### 랜딩

<figure class="shot">
  <img src="{{ '/assets/img/screens/01-landing.jpg' | relative_url }}" alt="REMAKE DAY 랜딩 화면. 로고와 두 줄 카피, 로그인·시작 버튼" loading="lazy">
  <figcaption><code>/</code> — 로고 아래 두 줄이 게임 전체의 과제입니다.</figcaption>
</figure>

> 오늘이 지나면 세계는 멸망한다.
> 다섯 번의 하루 안에, 왜 멸망했는지 알아내야 한다.

배경은 진입 화면과 같은 복도 그림입니다. 설치 없이 브라우저에서 바로 시작하고, 구글 계정으로 로그인합니다.

### 플레이 안내

<figure class="shot">
  <img src="{{ '/assets/img/screens/02-entry.jpg' | relative_url }}" alt="진입 화면의 플레이 안내 카드" loading="lazy">
  <figcaption><code>/play</code> 진입 — 시작 전에 규칙을 세 줄로 보여 줍니다.</figcaption>
</figure>

「하루 6장면 · 오늘 대화 8회」, 「한 장면에 인물마다 한 번 질문한다. 장면 이동은 무료이며 대화는 충전되지 않는다」, 「밤에 쓴 글은 다음 밤에도 이어진다」. 자세한 규칙은 접혀 있습니다. 오른쪽 위의 음성·BGM 스위치는 모든 화면에 붙어 있습니다.

### 허들 화면

<div class="shot-pair">
  <figure class="shot">
    <img src="{{ '/assets/img/screens/03-guard-login.jpg' | relative_url }}" alt="로그인이 필요하다는 안내 화면" loading="lazy">
    <figcaption>로그인 없이 <code>/play</code>에 들어오면</figcaption>
  </figure>
  <figure class="shot">
    <img src="{{ '/assets/img/screens/04-guard-daily-limit.jpg' | relative_url }}" alt="오늘은 여기까지라는 안내 화면" loading="lazy">
    <figcaption>오늘 판 수를 다 썼을 때</figcaption>
  </figure>
</div>

과잉 사용 방지 허들에 걸리면 오류 배너 대신 게임 말투의 전용 화면으로 안내합니다. 「로그인이 필요하다. 랜딩에서 구글로 시작해라.」, 「오늘은 여기까지. 내일 다시 시작할 수 있다.」

## 2. 아침 {#morning}

<div class="shot-pair">
  <figure class="shot">
    <img src="{{ '/assets/img/screens/05-morning-day1.jpg' | relative_url }}" alt="1일째 아침 화면" loading="lazy">
    <figcaption>1일째 아침 — 남은 대화 8회</figcaption>
  </figure>
  <figure class="shot">
    <img src="{{ '/assets/img/screens/06-morning-day5.jpg' | relative_url }}" alt="5일째 아침 화면. 오늘 세계에 걸린 규칙 목록이 보인다" loading="lazy">
    <figcaption>5일째 아침 — 남은 대화 4회, 걸어 둔 규칙 목록</figcaption>
  </figure>
</div>

매 회차는 같은 문장 「7시 12분. 눈을 뜬다.」로 시작합니다. 달라지는 것은 그 뒤입니다.

- **대화 예산이 줄어듭니다.** 하루 8회에서 시작해 회차마다 하나씩 줄어 5일째에는 4회입니다
- **어젯밤 건 규칙이 아침에 보입니다.** 5일째 화면에는 1~4일째 밤에 고른 규칙이 「오늘 세계에 걸린 규칙」으로 쌓여 있습니다
- **아침 문장에 한 줄씩 무언가가 붙습니다.** 1일째는 「관리자 방송이 끝나고 배급이 나온다」에서 끝나지만, 5일째에는 「자리가 하나 빈 것 같은데, 아무도 말하지 않는다」가 이어집니다

## 3. 낮 — 대화 {#day}

### 관리자 방송

<figure class="shot">
  <img src="{{ '/assets/img/screens/07-broadcast.jpg' | relative_url }}" alt="관리자 방송 팝업" loading="lazy">
  <figcaption>장면이 바뀔 때 방송이 끼어들면 화면을 덮습니다.</figcaption>
</figure>

방송은 스피커 그림과 함께 화면 전체를 덮고, 음성으로도 나옵니다. 방송이 끝나기 전에는 말할 수 없습니다. 들은 방송은 대화 로그에 남고 단서 기록에도 「발언을 들음」으로 쌓입니다.

### 장면과 인물

<figure class="shot">
  <img src="{{ '/assets/img/screens/08-day-scene.jpg' | relative_url }}" alt="낮 화면. 위에 장면 그림, 아래 왼쪽에 인물 카드 네 장, 오른쪽에 대화 로그와 입력창" loading="lazy">
  <figcaption>기상 — 7:12 · 1/6. 위는 장면, 왼쪽 아래는 인물, 오른쪽 아래는 대화</figcaption>
</figure>

화면 위쪽은 지금 장면의 그림과 서술입니다(「관리자의 방송 아래 네 사람이 배급을 기다린다」). 한 장면에 그림이 여러 장이면 넘겨 볼 수 있습니다. 왼쪽 아래 인물 카드 네 장(채연·민석·은상·준)에는 지금 말을 걸 수 있는지가 붙어 있고, 오른쪽에서 인물끼리 나누는 말이 먼저 흘러갑니다.

### 질문하기

<figure class="shot">
  <img src="{{ '/assets/img/screens/09-day-dialogue.jpg' | relative_url }}" alt="채연에게 질문하고 답을 받은 화면" loading="lazy">
  <figcaption>채연에게 「오늘 아침에 누구 봤어?」 — 「아무도 못 봤어. 아직 아무도 안 일어났었어.」</figcaption>
</figure>

인물을 고르고 한 줄로 묻습니다. 질문 하나에 오늘 대화 1회가 빠지고(8회 → 7회), 이 장면에서는 같은 인물에게 다시 물을 수 없습니다(「이 장면 대화 완료」). NPC 대답은 인물의 성격과 그날 실제로 본 것만으로 만들어집니다. 아이처럼 짧고 쉬운 말투입니다.

### 단서 기록

<figure class="shot">
  <img src="{{ '/assets/img/screens/10-notebook.jpg' | relative_url }}" alt="단서 기록 패널. 장면에서 관찰, 발언을 들음, 이미지에서 관찰 카드들" loading="lazy">
  <figcaption>「단서 기록 열기」 — 기록을 열어도 대화 횟수는 줄지 않습니다.</figcaption>
</figure>

본 것과 들은 것이 자동으로 쌓입니다. 카드마다 출처가 붙습니다 — **장면에서 관찰**, **이미지에서 관찰**, **발언을 들음**. 들은 말에는 「말했다는 사실의 기록이며, 내용의 참 여부는 별도다」라고 적혀 있습니다. 인물의 말이 사실인지는 플레이어가 판단합니다.

### 원숭이손

<figure class="shot">
  <img src="{{ '/assets/img/screens/11-paw.jpg' | relative_url }}" alt="원숭이손 제안 팝업. 받는다와 제안을 거절한다 버튼" loading="lazy">
  <figcaption>「무언가가 굴러왔다.」 — 받으면 도움이 되지만 대가가 따릅니다.</figcaption>
</figure>

낮 사이에 가끔 굴러오는 제안입니다. 「채연: 알고 있는 관찰을 설명한다 — 강제」처럼 세계에 규칙 하나를 거는 대신, 보이지 않는 대가가 붙습니다. 받을지 말지는 플레이어가 고릅니다. 이 판에서는 거절했습니다.

### 하루의 끝

<figure class="shot">
  <img src="{{ '/assets/img/screens/12-day-end.jpg' | relative_url }}" alt="6번째 장면 뒤 밤이 온다 버튼이 나타난 화면" loading="lazy">
  <figcaption>6/6 — 소등 방송 뒤 「밤이 온다」</figcaption>
</figure>

여섯 번째 장면에서 소등 방송이 나오면 인물 카드가 모두 「하루 종료」로 바뀌고 「밤이 온다」 버튼이 나타납니다. 이 판의 1일째에는 단서 기록이 46건 쌓였습니다.

## 4. 밤 — 서술과 채점 {#night}

### 오늘의 이해를 쓴다

<figure class="shot">
  <img src="{{ '/assets/img/screens/13-night.jpg' | relative_url }}" alt="밤 화면. 오늘은 무슨 상황이었나요? 왜 멸망하나요? 질문과 자유 서술 칸" loading="lazy">
  <figcaption>「오늘은 무슨 상황이었나요? 왜 멸망하나요?」</figcaption>
</figure>

밤에는 선택지가 없습니다. 오늘 본 것으로 **왜 세계가 멸망하는지를 자기 말로 씁니다.** 쓴 글은 다음 밤에 그대로 다시 열려 이어 쓸 수 있습니다.

<figure class="shot">
  <img src="{{ '/assets/img/screens/14-night-notes.jpg' | relative_url }}" alt="관찰 기록에서 근거 고르기 패널이 펼쳐진 밤 화면" loading="lazy">
  <figcaption>「관찰 기록에서 근거 고르기」 — 서술을 뒷받침할 기록을 골라 붙입니다.</figcaption>
</figure>

단서 기록을 펼쳐 근거로 쓸 기록을 고를 수 있습니다. 고른 기록은 채점 근거로만 쓰이고, 직접 쓴 글에는 붙지 않습니다.

### 확인

<figure class="shot">
  <img src="{{ '/assets/img/screens/15-confirm.jpg' | relative_url }}" alt="이렇게 이해했는데, 맞아? 주장 목록과 제출 버튼" loading="lazy">
  <figcaption>「이렇게 이해했는데, 맞아?」 — 서술을 주장 단위로 쪼개 되묻습니다.</figcaption>
</figure>

AI가 서술을 문장 단위 주장으로 정리해 보여 줍니다. 해석이 틀렸으면 **한 번** 고칠 수 있고, 세계에 닿는 주장은 최대 8개입니다. AI가 멋대로 해석한 채로 채점되지 않도록, 제출 직전에 사람이 확인하는 단계입니다.

### 채점

<div class="shot-pair">
  <figure class="shot">
    <img src="{{ '/assets/img/screens/16-submitting.jpg' | relative_url }}" alt="하루를 되짚는다 대기 화면. 오늘의 대화가 다시 흘러간다" loading="lazy">
    <figcaption>채점 대기 — 「하루를 되짚는다」</figcaption>
  </figure>
  <figure class="shot">
    <img src="{{ '/assets/img/screens/17-score.jpg' | relative_url }}" alt="1/5번째 밤 상황 이해도 0% 화면" loading="lazy">
    <figcaption>「1/5번째 밤 · 상황 이해도」</figcaption>
  </figure>
</div>

채점을 기다리는 동안 오늘 나눈 대화가 다시 흘러갑니다. 결과는 원인·동기·정체 칸별로 한 줄씩 돌아옵니다(「원인은 비어 있다. 동기는 비어 있다. 정체는 비어 있다.」). 어떤 주장이 세계와 닿지 않았는지 개수도 함께 알려 줍니다.

## 5. 멸망 {#doom}

<figure class="shot">
  <img src="{{ '/assets/img/screens/18-doom.jpg' | relative_url }}" alt="밤. 트럭 소리. 문이 열린다. 문틈으로 빛이 새는 복도" loading="lazy">
  <figcaption>1일째 밤 — 「소독약 냄새. 발 아래 콘크리트가 차다.」</figcaption>
</figure>

이해도와 상관없이 세계는 먼저 멸망합니다. 짧은 문장이 한 줄씩 떠오르고 관리자 목소리가 겹칩니다. 마지막 줄은 **그날 밤의 단서**입니다. 단서는 회차마다 달라서, 다섯 밤을 모으면 멸망의 윤곽이 드러납니다(4·5회차 단서는 결말에 가까워 싣지 않습니다).

## 6. 신의 개입 {#god}

### 세 번의 질문

<figure class="shot">
  <img src="{{ '/assets/img/screens/19-god.jpg' | relative_url }}" alt="신의 개입 화면. 오늘 있었던 일을 세 번 물을 수 있다는 안내와 질문 입력창" loading="lazy">
  <figcaption>「오늘 있었던 일을 세 번 물을 수 있습니다. 그다음, 내일의 규칙 하나를 정하십시오.」</figcaption>
</figure>

멸망한 밤 뒤에만 열리는 화면입니다. 이 목소리는 **오늘 일어난 일만** 알고, 「맞다 · 아니다 · 그건 알 수 없다」로 답합니다.

<figure class="shot">
  <img src="{{ '/assets/img/screens/20-god-answer.jpg' | relative_url }}" alt="오늘 트럭이 왔어? 질문에 맞다와 근거, 다음에 확인할 것을 답한 화면" loading="lazy">
  <figcaption>「오늘 트럭이 왔어?」 — 「맞다.」 답과 근거, 내일 확인할 것</figcaption>
</figure>

답에는 근거가 붙습니다. 공개된 관찰 기록 중 무엇을 근거로 했는지 펼쳐 볼 수 있고(「근거 보기 · 1개」), 다음 날 누구에게 무엇을 물어볼지 방향도 알려 줍니다. 숨겨진 진실이나 결말은 이 답변 모델에 전달하지 않습니다.

### 내일의 규칙

<figure class="shot">
  <img src="{{ '/assets/img/screens/21-god-rules.jpg' | relative_url }}" alt="내일에 규칙 하나를 건다. 규칙 후보 세 개와 직접 쓰기 입력창" loading="lazy">
  <figcaption>「내일에 규칙 하나를 건다.」 — 후보 셋, 또는 직접 쓰기</figcaption>
</figure>

오늘의 관찰에서 규칙 후보를 최대 3개 뽑아 줍니다. 후보마다 **행동**(누가 무엇을 하는지), **이유**(어떤 관찰에서 나왔는지), **확인**(다음 하루에 무엇이 보이면 규칙이 지켜진 것인지), **연결 근거 수**가 붙습니다. 마음에 드는 후보가 없으면 직접 쓰고 「해석 미리보기」로 AI가 어떻게 실행할지 먼저 확인한 뒤 적용합니다.

<figure class="shot">
  <img src="{{ '/assets/img/screens/22-god-applied.jpg' | relative_url }}" alt="세계에 규칙이 걸렸다. 채연: 알고 있는 관찰을 설명한다" loading="lazy">
  <figcaption>「세계에 규칙이 걸렸다.」 — 다음 하루를 준비합니다.</figcaption>
</figure>

## 7. 다섯 번째 밤 {#final}

### 마지막 기록

<figure class="shot">
  <img src="{{ '/assets/img/screens/23-final-clear.jpg' | relative_url }}" alt="다섯 번째 밤, 마지막 기록. 최종 이해도와 상황·정체 칸, 원인 카드" loading="lazy">
  <figcaption>「다섯 번째 밤, 마지막 기록」 — 최종 이해도와 칸별 결과</figcaption>
</figure>

다섯 번째 밤에는 점수와 상관없이 이야기가 끝납니다. 최종 이해도는 **상황(총점 중 70점)**과 **정체(30점)**로 나뉘고, 원인·동기·정체 칸마다 카드가 한 장씩 있습니다. **맞춘 칸만 진실이 열립니다.** 못 맞춘 칸은 「?」로 남고 「이 자리는 아직 비어 있다. 다시 도전하면 밝혀진다.」라고 적힙니다. 이번 판은 0%라 모든 칸이 닫혀 있습니다.

### 회고 — 너의 추리는 이렇게 걸어왔다

<figure class="shot">
  <img src="{{ '/assets/img/screens/24-retrospective.jpg' | relative_url }}" alt="너의 추리는 이렇게 걸어왔다. 하루하루의 기록과 진실과 내 기록" loading="lazy">
  <figcaption>「이 세계의 바깥으로」를 누르면 — 다섯 밤의 추리 여정(4번째 밤 단서는 흐리게 처리)</figcaption>
</figure>

회고는 판이 끝난 뒤에만 열립니다(<code>/harness/{판 ID}</code>로도 다시 볼 수 있습니다).

- **하루하루의 기록**: 밤마다 신이 열어 준 단서와 그날의 이해도
- **진실과 내 기록**: 맞춘 만큼만 열리는 진실 카드
- **아직 비어 있는 자리**: 못 맞춘 칸마다 다음 판에서 무엇을 확인할지 한 줄 안내(예: 「내일 준에게 배급이 어디서 오는지 물어봐라」)
- **개발 데이터**(접힘): 등록한 규칙이 실제로 지켜졌는지, 원숭이손의 대가, 하네스 개입 횟수 같은 시스템 동작 기록. AI가 실제로 어떻게 움직였는지 확인하는 곳입니다

마지막의 「다시 시작」은 지난 판의 칸별 결과를 들고 새 판을 엽니다.
