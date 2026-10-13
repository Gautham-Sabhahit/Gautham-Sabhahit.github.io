/* Slide the page up/down when moving between the left-nav sections.
   Going to a section further down the nav slides the page up; going to one
   further up slides it down. The old page slides out here, then the browser
   navigates normally and the new page slides in (see _includes/head.html). */
(function () {
  var SLOTS = [
    /^\/$/,
    /^\/research-interests(\/|$)/,
    /^\/publications?(\/|$)/,
    /^\/cv(\/|\.html|$)/,
    /^\/ml-calculator(\/|\.html|$)/
  ];
  var OUT_MS = 260;

  var shell = document.querySelector('.page-shell');
  if (!shell || !shell.animate) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var leaving = false;

  function slot(path) {
    for (var i = 0; i < SLOTS.length; i++) {
      if (SLOTS[i].test(path)) return i;
    }
    return -1;
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest && e.target.closest('a[href]');
    if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;

    var url = new URL(link.href, location.href);
    if (url.origin !== location.origin || reduceMotion.matches) return;

    var from = slot(location.pathname);
    var to = slot(url.pathname);
    if (from < 0 || to < 0 || from === to) return;

    e.preventDefault();
    if (leaving) return;
    leaving = true;

    var dir = to > from ? 'forward' : 'backward';

    if (link.closest('.side-nav')) {
      Array.prototype.forEach.call(document.querySelectorAll('.side-nav a.is-active'), function (a) {
        a.classList.remove('is-active');
      });
      link.classList.add('is-active');
    }

    var gone = false;
    var go = function () {
      if (gone) return;
      gone = true;
      try {
        sessionStorage.setItem('pageSlide', JSON.stringify({ d: dir, t: Date.now() }));
      } catch (err) {}
      location.href = url.href;
    };

    /* Warm the cache while the slide-out plays so the next page appears quickly. */
    try { fetch(url.href, { credentials: 'same-origin' }); } catch (err) {}

    var shift = (dir === 'forward' ? '-' : '') + '14vh';
    var out = shell.animate(
      [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(' + shift + ')', opacity: 0 }
      ],
      { duration: OUT_MS, easing: 'cubic-bezier(0.4, 0, 0.6, 1)', fill: 'forwards' }
    );
    out.onfinish = go;
    setTimeout(go, OUT_MS + 400);
  });

  /* A page restored from the back/forward cache must not stay faded out. */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      leaving = false;
      shell.getAnimations().forEach(function (a) { a.cancel(); });
    }
  });
})();
