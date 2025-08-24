// ...new code...
const articles = [
  {id:1, title:"Методика подготовки к контрольной по математике", desc:"Пошаговая инструкция и примеры заданий."},
  {id:2, title:"Интерактивные методики на уроках истории", desc:"Как вовлечь класс и сделать материал живым."},
  {id:3, title:"Работа с одарёнными учениками", desc:"Рекомендации и планы занятий."},
  {id:4, title:"Организация групповых проектов", desc:"Инструменты и оценивание."}
];

function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

function renderArticles(filter=""){
  const list = qs('#articles-list');
  if(!list) return;
  list.innerHTML = '';
  const matches = articles.filter(a => (a.title + a.desc).toLowerCase().includes(filter.toLowerCase()));
  if(matches.length === 0){
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.innerHTML = `<h4>Нет результатов</h4><p class="muted">Попробуйте другой запрос.</p>`;
    list.appendChild(empty);
    return;
  }
  matches.forEach(a=>{
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `<h4>${a.title}</h4><p>${a.desc}</p><div style="margin-top:10px;"><a class="primary-btn" href="articles.html">Читать</a></div>`;
    list.appendChild(el);
  });
}

/* Navigation: show panels with smooth transitions and pressed button visual */
function showPanel(target){
  const panels = {
    home: qs('#home-panel'),
    about: qs('#about-panel'),
    contacts: qs('#contacts-panel')
  };
  Object.keys(panels).forEach(k=>{
    const el = panels[k];
    if(k === target){
      el.classList.remove('hidden');
      el.classList.add('show');
      el.setAttribute('aria-hidden','false');
    } else {
      el.classList.remove('show');
      el.classList.add('hidden');
      el.setAttribute('aria-hidden','true');
      // small timeout to allow transition (CSS uses display toggling; keep simple)
      setTimeout(()=>{ if(el.classList.contains('hidden')) el.style.display = 'none'; }, 300);
    }
  });

  // update pressed state on nav buttons
  qsa('.nav-btn').forEach(b=>{
    if(b.dataset.target === target){
      b.classList.add('pressed');
      // simple pressed state momentary animation
      setTimeout(()=>b.classList.remove('pressed'), 250);
    } else {
      b.classList.remove('pressed');
    }
  });

  // ensure visible panel display reset
  const visible = panels[target];
  visible.style.display = 'block';
  requestAnimationFrame(()=> visible.classList.add('show'));
}

/* Wire up nav and jump links */
document.addEventListener('DOMContentLoaded',()=>{
  renderArticles();

  // show home by default
  showPanel('home');

  // mobile menu toggle
  const menuBtn = qs('#menu-toggle');
  const mainNav = qs('.main-nav');
  if(menuBtn && mainNav){
    menuBtn.addEventListener('click', ()=>{
      const open = mainNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close mobile menu after selecting an item for better UX on small screens
    qsa('.nav-btn').forEach(b=> b.addEventListener('click', ()=>{ if(window.innerWidth <= 760) mainNav.classList.remove('open'); }));
  }

  qsa('.nav-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const t = btn.dataset.target;
      showPanel(t);
    });
  });

  qsa('.jump').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const target = a.dataset.target;
      if(target) showPanel(target);
      window.location.hash = `#${target}-panel`;
    });
  });

  // Theme toggle with persistence
  const themeBtn = qs('#theme-toggle');
  const root = document.body;
  function applyTheme(t){
    if(t === 'dark'){ root.classList.add('dark'); root.classList.remove('light'); themeBtn.setAttribute('aria-pressed','true'); }
    else { root.classList.remove('dark'); root.classList.add('light'); themeBtn.setAttribute('aria-pressed','false'); }
    localStorage.setItem('eduhub_theme', t);
  }
  const stored = localStorage.getItem('eduhub_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(stored);
  themeBtn.addEventListener('click', ()=>{
    const next = root.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
  });

  // accessible keyboard shortcuts: press 1->home, 2->about, 3->contacts
  document.addEventListener('keydown', (e)=>{
    if(document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
    if(e.key === '1') showPanel('home');
    if(e.key === '2') showPanel('about');
    if(e.key === '3') showPanel('contacts');
  });
});