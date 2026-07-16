/* Lord Kinfauns — site interactions (vanilla, no jQuery).
   Original design preserved. Adds load/scroll animations and a
   smoother, rAF-throttled parallax. read-more · mobile menu ·
   image fade-in · scroll reveal · parallax — reduced-motion aware. */
(function () {
  'use strict';
  var doc = document;
  doc.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  /* ---- Read more / less (animated via .collapsed) ---- */
  each(doc.querySelectorAll('.fulltext'), function (ft) {
    ft.removeAttribute('hidden');
    ft.classList.add('collapsed');
  });
  each(doc.querySelectorAll('.toggle-content'), function (btn) {
    btn.removeAttribute('hidden');
    btn.addEventListener('click', function () {
      var ft = btn.parentElement.querySelector('.fulltext');
      if (!ft) return;
      var label = btn.querySelector('.text');
      var collapsed = ft.classList.toggle('collapsed');
      if (label) label.innerText = collapsed ? '...Read More' : '...Read Less';
      btn.setAttribute('aria-expanded', String(!collapsed));
    });
  });

  /* ---- Mobile menu ---- */
  var menuBtn = doc.getElementById('inv-nav-main-btn');
  var menu = doc.getElementById('inv-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      menuBtn.classList.toggle('is-active');
      menu.classList.toggle('menu-show');
    });
  }

  /* ---- Image fade-in on load (opt in only now that JS is running) ---- */
  doc.documentElement.classList.add('img-fade');
  each(doc.querySelectorAll('article img'), function (img) {
    if (img.complete && img.naturalWidth) {
      img.classList.add('img-loaded');
    } else {
      img.addEventListener('load', function () { img.classList.add('img-loaded'); });
      img.addEventListener('error', function () { img.classList.add('img-loaded'); });
    }
  });

  /* ---- Scroll reveal for timeline entries + prose articles ---- */
  var revealEls = doc.querySelectorAll('.timeline, article.about, article.info');
  if ('IntersectionObserver' in window && !reduce && revealEls.length) {
    each(revealEls, function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    each(revealEls, function (el) { io.observe(el); });
  }

  /* ---- Parallax (rAF-throttled, passive, skipped under reduced-motion) ---- */
  if (!reduce) {
    var layers = doc.querySelectorAll("[data-type='parallax']");
    if (layers.length) {
      var tick = false;
      var onScroll = function () {
        if (tick) return;
        tick = true;
        requestAnimationFrame(function () {
          var y = window.pageYOffset;
          for (var i = 0; i < layers.length; i++) {
            var d = parseFloat(layers[i].getAttribute('data-depth')) || 0;
            layers[i].style.transform = 'translate3d(0,' + (-(y * d)) + 'px,0)';
          }
          tick = false;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }
})();
