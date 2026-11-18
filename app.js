/* El Código Biológico — interacciones comunes */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PREVIEW = !!window.ECB_PREVIEW;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} }
  };
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const link = page => PREVIEW ? '#' + (page === 'index' ? 'inicio' : page) : page + '.html';

  /* ---------- productos ---------- */
  const PRODUCTS = {
    'curso-introduccion': { name: 'CURSO DE INTRODUCCIÓN A EL CÓDIGO BIOLÓGICO', price: 150, img: 'curso-ecb.jpg' },
    'curso-ecb-1-pago': { name: 'CURSO EL CÓDIGO BIOLÓGICO – 1 PAGO', price: 1800, img: 'curso-ecb.jpg' },
    'curso-ecb-plazos': { name: 'CURSO EL CÓDIGO BIOLÓGICO – PLAZOS', price: 1800, img: 'curso-ecb.jpg' },
    'reflejos-1-pago': { name: 'REFLEJOS PRIMITIVOS DEL LENGUAJE CORPORAL – 1 PAGO', price: 1600, img: 'curso-reflejos.jpg' },
    'reflejos-plazos': { name: 'REFLEJOS PRIMITIVOS DEL LENGUAJE CORPORAL – PLAZOS', price: 1600, img: 'curso-reflejos.jpg' }
  };
  const imgSrc = f => (window.ECB_IMG && window.ECB_IMG[f]) || ('img/' + f);
  const eur = n => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  /* ---------- nav, progreso, parallax ---------- */
  const nav = $('#nav'), prog = $('#progress');
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 60);
    prog.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    if (!reduce && y < innerHeight) $$('.hero-bg,.ph-bg').forEach(b => b.style.translate = `0 ${y * .35}px`);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const menu = $('#menu'), burger = $('#burger');
  const toggleMenu = open => {
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    $$('li a', menu).forEach((a, i) => a.style.transitionDelay = open ? (.25 + i * .05) + 's' : '0s');
  };
  burger.onclick = () => toggleMenu(!menu.classList.contains('open'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  const setActive = page => {
    $$('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === page));
  };

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- tilt, foco, cursor ---------- */
  if (matchMedia('(hover:hover)').matches && !reduce) {
    $$('[data-tilt]').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
      });
      c.addEventListener('mouseleave', () => c.style.transform = '');
    });
    const glow = $('#glow');
    addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
  }
  $$('.prog').forEach(p => p.addEventListener('mousemove', e => {
    const r = p.getBoundingClientRect();
    p.style.setProperty('--mx', (e.clientX - r.left) + 'px'); p.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* ---------- cinta de disciplinas ---------- */
  $$('.marquee .track').forEach(track => {
    const items = $$('.prog .chips li').map(li => li.textContent);
    const html = items.map(t => `<span>${t}</span>`).join('');
    track.innerHTML = html + html;
  });

  /* ---------- testimonios ---------- */
  $$('.slider').forEach(slider => {
    const box = slider.closest('section');
    const slides = $$('.slide', slider), dots = $$('.dots button', box);
    let cur = 0, timer;
    const go = i => {
      cur = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('on', k === cur));
      dots.forEach((d, k) => d.classList.toggle('on', k === cur));
      clearTimeout(timer);
      if (!reduce) timer = setTimeout(() => !slider.classList.contains('paused') && go(cur + 1), 7000);
    };
    $('.prev', box).onclick = () => go(cur - 1);
    $('.next', box).onclick = () => go(cur + 1);
    dots.forEach((d, k) => d.onclick = () => go(k));
    slider.addEventListener('mouseenter', () => { slider.classList.add('paused'); clearTimeout(timer); });
    slider.addEventListener('mouseleave', () => { slider.classList.remove('paused'); go(cur); });
    let sx = 0;
    slider.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    slider.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); });
    go(0);
  });

  /* ---------- formularios (el envío se conecta en el servidor) ---------- */
  $$('.cform').forEach(f => f.addEventListener('submit', e => e.preventDefault()));

  /* ---------- modales: vídeo, YouTube, imágenes ---------- */
  const modal = $('#modal'), mbody = $('#modalBody');
  const openModal = html => { mbody.innerHTML = html; modal.classList.add('open'); };
  const closeModal = () => { modal.classList.remove('open'); setTimeout(() => { if (!modal.classList.contains('open')) mbody.innerHTML = ''; }, 500); };
  $('#modalClose').onclick = closeModal;
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); toggleMenu(false); } });

  $$('[data-video]').forEach(b => b.addEventListener('click', () => {
    openModal(`<div class="mh"><img src="${imgSrc('logoweb-bl.png')}" alt="EL CÓDIGO BIOLÓGICO"></div><video controls autoplay playsinline src="${b.dataset.video}"></video>`);
  }));
  $$('a[data-yt]').forEach(a => a.addEventListener('click', e => {
    if (PREVIEW) return; // en la vista previa se abre YouTube en otra pestaña
    e.preventDefault();
    openModal(`<iframe src="https://www.youtube-nocookie.com/embed/${a.dataset.yt}?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="${a.querySelector('h3').textContent.replace(/"/g, '&quot;')}"></iframe>`);
  }));
  $$('.gallery a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    openModal(`<div class="frame"><img src="${a.querySelector('img').src}" alt=""></div>`);
  }));

  /* ---------- carrito ---------- */
  const getCart = () => store.get('ecb-cart', []).filter(i => PRODUCTS[i.id]);
  const saveCart = c => { store.set('ecb-cart', c); renderBadge(true); renderCart(); };
  const renderBadge = bump => {
    const n = getCart().reduce((s, i) => s + i.qty, 0);
    $$('.cart b').forEach(b => { b.textContent = n; if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); } });
    $$('.cart .sr').forEach(s => s.textContent = 'Elementos De ' + n);
  };
  const toast = $('#toast'); let tt;
  const showToast = name => {
    toast.innerHTML = `<span>“${name}” se ha añadido a tu carrito.</span><a href="${link('carrito')}">Ver carrito</a>`;
    toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 4500);
  };
  $$('.qty').forEach(q => {
    const inp = $('input', q);
    $$('button', q).forEach(b => b.onclick = () => { inp.value = Math.max(1, (+inp.value || 1) + (+b.dataset.d)); });
  });
  $$('form.add-cart').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const id = f.dataset.id, qty = Math.max(1, +(f.querySelector('input')?.value) || 1);
    const c = getCart(); const it = c.find(i => i.id === id);
    it ? it.qty += qty : c.push({ id, qty });
    saveCart(c); showToast(PRODUCTS[id].name);
  }));
  function renderCart() {
    const root = $('#cart-root'); if (!root) return;
    const c = getCart();
    if (!c.length) {
      root.innerHTML = `<div class="empty"><div class="ring-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg></div><p>Tu carrito está vacío.</p><a class="btn" href="${link('inscripcion-cursos')}">Volver a la tienda <span class="arr">${ARROW}</span></a></div>`;
      return;
    }
    let total = 0;
    const rows = c.map(i => {
      const p = PRODUCTS[i.id]; const sub = p.price * i.qty; total += sub;
      return `<tr><td><a class="cart-item" href="${link(i.id)}"><img src="${imgSrc(p.img)}" alt="">${p.name}</a></td><td>${eur(p.price)}</td>
        <td><div class="qty" data-id="${i.id}"><button type="button" data-d="-1" aria-label="-">−</button><input type="number" min="1" value="${i.qty}" aria-label="cantidad"><button type="button" data-d="1" aria-label="+">+</button></div></td>
        <td><strong>${eur(sub)}</strong></td><td><button class="rm" data-rm="${i.id}" aria-label="Eliminar">×</button></td></tr>`;
    }).join('');
    root.innerHTML = `<div class="table-wrap"><table class="cart-table"><thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="cart-total"><span>Total</span><strong>${eur(total)}</strong><a class="btn amber" href="${link('contacto')}">Finalizar compra <span class="arr">${ARROW}</span></a></div>`;
    $$('[data-rm]', root).forEach(b => b.onclick = () => saveCart(getCart().filter(i => i.id !== b.dataset.rm)));
    $$('.qty', root).forEach(q => {
      const upd = v => { const c2 = getCart(); const it = c2.find(i => i.id === q.dataset.id); it.qty = Math.max(1, v); saveCart(c2); };
      $$('button', q).forEach(b => b.onclick = () => upd(+$('input', q).value + (+b.dataset.d)));
      $('input', q).onchange = e => upd(+e.target.value || 1);
    });
  }
  renderBadge(false); renderCart();

  /* ---------- red celular en las cabeceras ---------- */
  $$('canvas.cells').forEach(cv => {
    const ctx = cv.getContext('2d'); let W = 0, H = 0, pts = [], mouse = { x: -999, y: -999 }, running = false;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight; if (!W || !H) return;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, W * H / 16000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 2.2 + .6, h: Math.random() }));
      if (!running) { running = true; draw(); }
    };
    new ResizeObserver(resize).observe(cv);
    const host = cv.parentElement;
    host.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    host.addEventListener('mouseleave', () => mouse.x = mouse.y = -999);
    function draw() {
      if (!cv.clientWidth) { running = false; return; }
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 140 && d > 0) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) { ctx.strokeStyle = `rgba(150,230,220,${(1 - d / 130) * .22})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      for (const p of pts) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.h > .8 ? 'rgba(244,162,89,.9)' : 'rgba(170,240,230,.85)';
        ctx.shadowBlur = 12; ctx.shadowColor = ctx.fillStyle; ctx.fill(); ctx.shadowBlur = 0;
      }
      if (!reduce) requestAnimationFrame(draw); else running = false;
    }
  });

  /* ---------- vista previa: todas las páginas en un solo archivo ---------- */
  if (PREVIEW) {
    const routes = $$('.route');
    const show = () => {
      let id = decodeURIComponent(location.hash.slice(1)) || 'inicio';
      if (!routes.some(r => r.dataset.route === id)) id = 'inicio';
      routes.forEach(r => r.hidden = r.dataset.route !== id);
      const cur = routes.find(r => r.dataset.route === id);
      document.title = cur.dataset.title;
      setActive(cur.dataset.nav || '');
      toggleMenu(false); closeModal();
      scrollTo({ top: 0, behavior: 'instant' });
      $$('.page-hero h1,.page-hero .sub,.crumbs', cur).forEach(el => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });
      onScroll();
    };
    addEventListener('hashchange', show); show();
  } else {
    setActive(document.body.dataset.nav || '');
  }
})();
