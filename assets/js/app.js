// 모바일 사이드바 토글
document.addEventListener('click', function (e) {
  var btn = e.target.closest('[data-menu-toggle]');
  if (btn) { document.body.classList.toggle('nav-open'); return; }
  if (document.body.classList.contains('nav-open') && !e.target.closest('#sidebar')) {
    document.body.classList.remove('nav-open');
  }
});

// D-day 실시간 보정 (빌드 시점과 열람 시점 차이를 줄인다)
(function () {
  var el = document.querySelector('[data-dday]');
  if (!el) return;
  var deadline = new Date(el.getAttribute('data-dday') + 'T23:59:59+09:00');
  var left = Math.ceil((deadline - new Date()) / 86400000);
  el.textContent = left > 0 ? 'D-' + left : (left === 0 ? 'D-DAY' : 'D+' + Math.abs(left));
})();
