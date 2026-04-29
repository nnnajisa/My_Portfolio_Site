/* ═══════════════════════════════════════════
   site.js — new single-page logic
   (global.js handles lamp, stars, burger menu)
═══════════════════════════════════════════ */

/* ── Sync star color transition when lamp toggled on index.html ── */
(function() {
  const mask = document.getElementById('clickMask');
  if (!mask) return;
  mask.addEventListener('click', () => {
    if (typeof isLightMode !== 'undefined') {
      isLightMode = document.body.classList.contains('light-mode');
    }
  });
})();

/* ── Topbar HOME ── */
const topbarHome = document.getElementById('topbarHome');
if (topbarHome) {
  topbarHome.addEventListener('click', e => {
    e.preventDefault();
    const el = document.getElementById('home');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ── Smooth scroll for all #hash links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── Back to top ── */
const backTop = document.getElementById('backTop');
if (backTop) backTop.addEventListener('click', e => { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); });

/* ═══════════════════════════════════════════
   LANGUAGE SWITCHING
═══════════════════════════════════════════ */
const STRINGS = {
  en: {
    'nav-home':    'HOME',
    'nav-work':    'WORK',
    'nav-about':   'ABOUT',
    'nav-contact': 'CONTACT',
    'nav-resume':  'RESUME',
    'home-hi':     "Hi! I'm Najisa!",
    'home-sub':    'Digital Artist · Media & Computational Designer',
    'work-selected': 'Selected Works',
    'more-works':  'More Works',
    'about-p1':    'I am a digital artist and media designer exploring the transient boundaries between computational logic and human sensation.',
    'about-p2':    'Based in New York, my practice involves generative systems, material studies, and interactive environments.',
    'about-p3':    'Materializing the invisible data structures into evocative, tangible experiences.',
    'reach-out':   'reach out!',
    'back-top':    'Back to Top',
    'copyright':   '© 2026 Najisa. All rights reserved.',
    'scroll-down': 'scroll',
  },
  zh: {
    'nav-home':    '主页',
    'nav-work':    '作品',
    'nav-about':   '关于',
    'nav-contact': '联系',
    'nav-resume':  '简历',
    'home-hi':     '嗨！我是 Najisa！',
    'home-sub':    '数字艺术家 · 媒体与计算设计师',
    'work-selected': '精选作品',
    'more-works':  '更多作品',
    'about-p1':    '我是一名数字艺术家和媒体设计师，探索计算逻辑与人类感知之间流动的边界。',
    'about-p2':    '常驻纽约，我的创作涉及生成系统、材料研究与交互环境。',
    'about-p3':    '将不可见的数据结构物化为令人动容的有形体验。',
    'reach-out':   '联系我！',
    'back-top':    '返回顶部',
    'copyright':   '© 2026 Najisa. 版权所有。',
    'scroll-down': '向下滚动',
  },
  ja: {
    'nav-home':    'HOME',
    'nav-work':    '作品',
    'nav-about':   'について',
    'nav-contact': '連絡',
    'nav-resume':  '履歴書',
    'home-hi':     'はじめまして、Najisaです！',
    'home-sub':    'デジタルアーティスト · メディア＆計算デザイナー',
    'work-selected': '選出された作品',
    'more-works':  'もっと見る',
    'about-p1':    '私はデジタルアーティスト・メディアデザイナーとして、計算論理と人間の感覚の境界を探求しています。',
    'about-p2':    'ニューヨークを拠点に、生成システム、素材研究、インタラクティブ環境の制作に取り組んでいます。',
    'about-p3':    '見えないデータ構造を感動的で具体的な体験へと変換しています。',
    'reach-out':   'ご連絡ください！',
    'back-top':    'トップへ',
    'copyright':   '© 2026 Najisa. All rights reserved.',
    'scroll-down': 'スクロール',
  }
};

const LANG_LABELS = { en: 'EN', zh: '中', ja: '日' };
let lang = sessionStorage.getItem('nj-lang') || 'en';

function applyLang(l) {
  lang = l;
  sessionStorage.setItem('nj-lang', l);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (STRINGS[l] && STRINGS[l][key]) el.textContent = STRINGS[l][key];
  });
  const cur = document.getElementById('langCurrent');
  if (cur) cur.textContent = LANG_LABELS[l] || l.toUpperCase();
  document.querySelectorAll('.lang-opt').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.classList.contains('in-view')) el.style.color = '';
  });
}

document.addEventListener('langchange', e => applyLang(e.detail.lang));

applyLang(lang);

/* ═══════════════════════════════════════════
   CURTAIN ANIMATION
═══════════════════════════════════════════ */
const curtain = document.getElementById('curtain');
const about   = document.getElementById('about');
if (curtain && about) {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { curtain.classList.add('raised'); obs.disconnect(); }
  }, { threshold: 0.05 });
  obs.observe(about);
}

/* ═══════════════════════════════════════════
   TEXT REVEAL ON SCROLL
═══════════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ═══════════════════════════════════════════
   SELECTED WORKS GRID
═══════════════════════════════════════════ */
const selGrid = document.getElementById('selGrid');
if (selGrid && typeof worksData !== 'undefined') {
  worksData.slice(0, 4).forEach(work => {
    const card = document.createElement('div');
    card.className = 'sel-card';

    let src = work.thumbnail || '';
    if (!src && work.mediaType === 'image')   src = work.path;
    if (!src && work.mediaType === 'youtube') src = `https://img.youtube.com/vi/${work.path.split('?')[0]}/maxresdefault.jpg`;

    card.innerHTML = `
      <div class="sel-thumb">${src ? `<img src="${src}" alt="${work.name}" loading="lazy">` : ''}</div>
      <div class="sel-type">${work.year} / ${work.category}</div>
      <div class="sel-name">${work.name}</div>
    `;
    const img = card.querySelector('img');
    if (img) {
      img.addEventListener('load', () => img.classList.add('loaded'));
      if (img.complete) img.classList.add('loaded');
    }
    card.addEventListener('click', () => openLightbox(work));
    selGrid.appendChild(card);
  });
}

/* ═══════════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════════ */
function openLightbox(work) {
  const lb  = document.getElementById('lightbox');
  const med = document.getElementById('lbMedia');
  if (!lb || !med) return;
  med.innerHTML = '';
  if (work.link) {
    med.innerHTML = `<iframe src="${work.link}" allowfullscreen></iframe>`;
  } else if (work.mediaType === 'image') {
    med.innerHTML = `<img src="${work.path}" alt="${work.name}">`;
  } else if (work.mediaType === 'pdf') {
    med.innerHTML = `<iframe src="${work.path}"></iframe>`;
  } else {
    const vid = work.path.split('?')[0];
    med.innerHTML = `<iframe src="https://www.youtube.com/embed/${vid}?autoplay=1&rel=0" allow="autoplay;encrypted-media" allowfullscreen></iframe>`;
  }
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb  = document.getElementById('lightbox');
  const med = document.getElementById('lbMedia');
  lb?.classList.remove('active');
  if (med) med.innerHTML = '';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ═══════════════════════════════════════════
   AVATAR → ABOUT PHOTO MORPH
   One element, always visible, just moves.
═══════════════════════════════════════════ */
(function () {
  const morphEl       = document.getElementById('morphAvatar');
  const morphDark     = morphEl?.querySelector('.morph-img-dark');
  const morphLight    = morphEl?.querySelector('.morph-img-light');
  const avatarImgD    = document.querySelector('.avatar-img-dark');
  const avatarImgL    = document.querySelector('.avatar-img-light');
  const avatarWrap    = document.querySelector('.avatar-wrap');
  const frame         = document.querySelector('.photo-frame');
  const about         = document.getElementById('about');
  if (!morphEl || !morphDark || !morphLight || !avatarImgD || !avatarWrap || !frame || !about) return;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t)  { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2; }

  let aDoc = {}, fDoc = {}, aboutAbsTop = 0, rafId = null, morphReady = false;

  function recalc() {
    const sy = window.scrollY;
    const aR = avatarImgD.getBoundingClientRect();
    const fR = frame.getBoundingClientRect();
    aDoc = { top: aR.top + sy, left: aR.left, width: aR.width, height: aR.height };
    fDoc = { top: fR.top + sy, left: fR.left, width: fR.width, height: fR.height };
    aboutAbsTop = about.getBoundingClientRect().top + sy;
  }

  /* Delay until avatar fadeUp animation finishes (~1.5s), then hand off */
  recalc(); /* get aboutAbsTop early for p computation */
  setTimeout(() => {
    recalc(); /* re-read accurate positions after animation */
    /* Hide real images — morphEl is the only visible image from now on */
    avatarImgD.style.cssText = 'opacity:0!important;transition:none!important';
    if (avatarImgL) avatarImgL.style.cssText = 'opacity:0!important;transition:none!important';
    frame.style.opacity = '0';
    morphReady = true;
    update();
  }, 1500);

  window.addEventListener('resize', () => { recalc(); if (morphReady) update(); }, { passive: true });

  function setMorphImages() {
    const isLight = document.body.classList.contains('light-mode');
    morphDark.style.opacity  = isLight ? '0' : '1';
    morphLight.style.opacity = isLight ? '1' : '0';
  }

  function update() {
    rafId = null;
    if (!morphReady) return;

    const scrollY = window.scrollY;
    const viewH   = window.innerHeight;
    const start   = aboutAbsTop - viewH * 0.95;
    const end     = aboutAbsTop - viewH * 0.15;
    const p  = Math.max(0, Math.min(1, (scrollY - start) / (end - start)));
    const ep = easeInOut(p);
    const isLt = document.body.classList.contains('light-mode');

    const fPadLR = 20, fPadT = 20, fPadB = 66;
    const fImgW  = fDoc.width - fPadLR * 2;
    const fImgH  = 230;

    /* Viewport positions — pure math, zero layout reads */
    const aTop = aDoc.top - scrollY, aLeft = aDoc.left;
    const fTop = fDoc.top - scrollY, fLeft = fDoc.left;

    const aCx = aLeft + aDoc.width  / 2;
    const aCy = aTop  + aDoc.height / 2;
    const fCx = fLeft + fPadLR + fImgW / 2;
    const fCy = fTop  + fPadT  + fImgH  / 2;

    const imgW  = lerp(aDoc.width,  fImgW,  ep);
    const imgH  = lerp(aDoc.height, fImgH,  ep);
    const padLR = lerp(0, fPadLR, ep);
    const padT  = lerp(0, fPadT,  ep);
    const padB  = lerp(0, fPadB,  ep);
    const rot   = lerp(0, -2, ep);
    const fa    = ep;

    const cx = lerp(aCx, fCx, ep);
    const cy = lerp(aCy, fCy, ep);

    const offScreen = cy < -300 || cy > viewH + 300;

    setMorphImages();

    morphEl.style.cssText = `
      position:fixed;z-index:200;pointer-events:none;overflow:hidden;
      opacity:${offScreen ? 0 : 1};
      width:${imgW + padLR * 2}px;
      height:${imgH + padT + padB}px;
      left:${cx - padLR - imgW / 2}px;
      top:${cy - padT - imgH / 2}px;
      border-style:solid;
      border-width:${padT}px ${padLR}px ${padB}px ${padLR}px;
      border-color:${isLt ? `rgba(17,17,17,${fa})` : `rgba(255,255,255,${fa})`};
      background:transparent;
      box-shadow:${fa > 0.1 ? `0 8px ${Math.round(32 * fa)}px rgba(0,0,0,${(0.45 * fa).toFixed(2)})` : 'none'};
      transform:rotate(${rot}deg);
    `;
  }

  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
