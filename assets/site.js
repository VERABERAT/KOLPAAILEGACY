// Kolpa AI studio — language switch, App Store badge fallback, screenshot galleries.
(function () {
  var KEY = 'kolpa-lang';

  function setLanguage(lang) {
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.classList.toggle('hidden', el.getAttribute('data-lang') !== lang);
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.set === lang));
    });
    document.documentElement.lang = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) { /* storage unavailable */ }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* storage unavailable */ }
    var initial = saved || ((navigator.language || '').toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en');
    setLanguage(initial === 'tr' ? 'tr' : 'en');
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { setLanguage(b.dataset.set); });
    });

    // If Apple's badge image can't load, show a plain text button instead.
    document.querySelectorAll('.badge-link img').forEach(function (img) {
      function fallback() {
        var a = img.parentNode;
        a.classList.remove('badge-link');
        a.classList.add('badge-fallback');
        a.textContent = img.getAttribute('data-fallback') || 'Download on the App Store';
      }
      if (img.complete && img.naturalWidth === 0) fallback();
      else img.addEventListener('error', fallback);
    });

    // Galleries: native scroll-snap does the physics; buttons step one screenshot at a time.
    document.querySelectorAll('.gallery').forEach(function (g) {
      var track = g.querySelector('.gallery-track');
      var prev = g.querySelector('[data-dir="-1"]');
      var next = g.querySelector('[data-dir="1"]');
      if (!track || !prev || !next) return;
      function step() {
        var item = track.querySelector('img');
        return item ? item.getBoundingClientRect().width + 20 : 300;
      }
      function update() {
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      }
      [prev, next].forEach(function (b) {
        b.addEventListener('click', function () {
          track.scrollBy({ left: Number(b.dataset.dir) * step(), behavior: 'smooth' });
        });
      });
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  });
})();
