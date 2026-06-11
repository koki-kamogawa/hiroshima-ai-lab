/* HIROSHIMA AI LAB — 下層ページ共通JS（ヘッダー・ハンバーガー・reveal・進捗・光のscrub） */
(function(){
  document.documentElement.classList.add('js');

  /* フェイルセーフ：3秒で必ず全表示 */
  setTimeout(function(){
    document.querySelectorAll('.reveal-up').forEach(function(el){ el.style.opacity='1'; el.style.transform='none'; });
  }, 3000);

  /* ハンバーガー */
  var toggle = document.querySelector('.nav-toggle');
  var overlay = document.querySelector('.nav-overlay');
  if(toggle && overlay){
    toggle.addEventListener('click', function(){
      var open = overlay.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        overlay.classList.remove('is-open');
        toggle.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      });
    });
  }

  /* トップ用：FVを抜けたらヘッダー出現（下層=staticは常時表示なので対象外） */
  var floating = document.querySelector('.site-header--floating');
  if(floating){
    var shown = null;
    var onScroll = function(){
      var s = (window.scrollY || 0) > innerHeight * 0.85;
      if(s !== shown){ shown = s; floating.classList.toggle('is-shown', s); }
    };
    addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var gsapReady = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if(gsapReady && !reduce){
    gsap.registerPlugin(ScrollTrigger);

    if(typeof Lenis !== 'undefined' && window.matchMedia('(hover:hover)').matches){
      var lenis = new Lenis({ lerp:0.1, smoothWheel:true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function(t){ lenis.raf(t*1000); });
      gsap.ticker.lagSmoothing(0);
    }

    ScrollTrigger.batch('.reveal-up', {
      start:'top 88%',
      onEnter:function(els){ gsap.to(els, {opacity:1, y:0, duration:.95, stagger:.09, ease:'power3.out', overwrite:true}); }
    });

    var bar = document.getElementById('progress');
    if(bar) gsap.to(bar, { width:'100%', ease:'none', scrollTrigger:{ start:0, end:'max', scrub:0.3 } });

    if(document.getElementById('llHex')){
      gsap.to('#llHex', { yPercent:42, ease:'none', scrollTrigger:{ start:0, end:'max', scrub:1.2 } });
    }

    addEventListener('load', function(){ ScrollTrigger.refresh(); });
  } else {
    document.querySelectorAll('.reveal-up').forEach(function(el){ el.style.opacity='1'; el.style.transform='none'; });
  }
})();
