(() => {
  const SITE_PATH='/metacademy-of-humanity';
  const SITE='https://d4ttara.github.io/metacademy-of-humanity';
  const SHOP='https://payhip.com/dattara';
  const REPO='https://github.com/D4ttara/metacademy-of-humanity';
  const uk=document.documentElement.lang?.toLowerCase().startsWith('uk');
  const text=(en,ua)=>uk?ua:en;
  const canonical=()=>document.querySelector('link[rel="canonical"]')?.href || location.href.split('#')[0];

  const copyText=async value=>{
    if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
    const t=document.createElement('textarea');
    t.value=value; t.setAttribute('readonly',''); t.style.position='fixed'; t.style.opacity='0';
    document.body.append(t); t.select(); document.execCommand('copy'); t.remove();
  };
  const flash=(el,message)=>{ const before=el.textContent; el.textContent=message; setTimeout(()=>el.textContent=before,1500); };

  function ensureSkipLink(){
    if(document.querySelector('.skip-link')) return;
    const main=document.querySelector('main'); if(!main) return;
    if(!main.id) main.id='main-content';
    const a=document.createElement('a'); a.className='skip-link'; a.href='#'+main.id; a.textContent=text('Skip to content','До змісту');
    document.body.prepend(a);
  }

  function markActiveNav(){
    const current=new URL(canonical()).pathname.replace(/index\.html$/,'');
    document.querySelectorAll('.nav a[href]').forEach(a=>{
      try{
        const p=new URL(a.href,location.href).pathname.replace(/index\.html$/,'');
        if(p===current || (p!==SITE_PATH+'/' && current.startsWith(p))) a.setAttribute('aria-current','page');
      }catch{}
    });
  }

  function ensureShopLinks(){
    document.querySelectorAll('.nav').forEach(nav=>{
      if(nav.querySelector(`a[href="${SHOP}"]`)) return;
      const a=document.createElement('a'); a.href=SHOP; a.rel='external noopener noreferrer'; a.className='nav-shop'; a.textContent=text('Shop','Магазин');
      const switcher=nav.querySelector('.language-switch'); switcher?nav.insertBefore(a,switcher):nav.append(a);
    });
    document.querySelectorAll('.edition-links').forEach(group=>{
      if(group.querySelector(`a[href="${SHOP}"]`)) return;
      const a=document.createElement('a'); a.href=SHOP; a.rel='external noopener noreferrer'; a.className='button'; a.textContent=text('Shop / full editions','Магазин / повні видання'); group.append(a);
    });
    document.querySelectorAll('footer .wrap').forEach(foot=>{
      if(foot.querySelector(`a[href="${SHOP}"]`)) return;
      const span=document.createElement('span'); span.className='experience-footer-links';
      span.innerHTML=`<a href="${SHOP}" rel="external noopener noreferrer">${text('Shop','Магазин')}</a><a href="${SITE_PATH}/discover/">Discover</a><a href="${SITE_PATH}/feed.xml">RSS</a>`;
      foot.append(span);
    });
  }

  function breadcrumbs(){
    if(document.querySelector('.site-breadcrumbs') || !document.querySelector('.pagehead')) return;
    const canonicalUrl=new URL(canonical());
    const path=canonicalUrl.pathname.replace(/^\/metacademy-of-humanity\/?/,'').replace(/\/$/,'');
    if(!path) return;
    const parts=path.split('/').filter(Boolean);
    const labels={uk:'Українська',documents:text('Documents','Документи'),research:text('Research','Дослідження'),manifesto:text('Manifesto','Маніфест'),manifestos:text('Manifestos','Маніфести'),books:text('Books','Книги'),library:text('Library','Бібліотека'),topics:text('Topics','Теми'),shop:text('Shop','Магазин'),'free-reading':text('Free reading','Безкоштовне читання')};
    const nav=document.createElement('nav'); nav.className='site-breadcrumbs'; nav.setAttribute('aria-label',text('Breadcrumb','Навігаційний шлях'));
    const home=document.createElement('a'); home.href=uk?SITE_PATH+'/uk/':SITE_PATH+'/'; home.textContent=text('Home','Головна'); nav.append(home);
    let acc='';
    parts.forEach((part,i)=>{
      acc+=part+'/';
      const sep=document.createElement('span'); sep.setAttribute('aria-hidden','true'); sep.textContent='›'; nav.append(sep);
      if(i===parts.length-1){ const s=document.createElement('span'); s.textContent=labels[part]||decodeURIComponent(part).replace(/[-_]/g,' '); nav.append(s); }
      else { const a=document.createElement('a'); a.href=SITE_PATH+'/'+acc; a.textContent=labels[part]||decodeURIComponent(part).replace(/[-_]/g,' '); nav.append(a); }
    });
    document.querySelector('.pagehead').after(nav);
  }

  function homeLaunchpad(){
    if(document.querySelector('[data-home-launchpad]')) return;
    const p=new URL(canonical()).pathname;
    const isHome=p===SITE_PATH+'/' || p===SITE_PATH+'/uk/'; if(!isHome) return;
    const hero=document.querySelector('.hero'); if(!hero) return;
    const root=uk?SITE_PATH+'/uk':SITE_PATH;
    const section=document.createElement('section'); section.className='home-launchpad'; section.dataset.homeLaunchpad='v1';
    section.innerHTML=`<div class="wrap launch-grid">
      <a href="${SITE_PATH}/start/"><strong>${text('Start here','Почати тут')}</strong><small>${text('Guided paths through the field','Маршрути крізь поле знань')}</small></a>
      <a href="${root}/updates/"><strong>${text('Latest','Нове')}</strong><small>${text('Recent releases and changes','Останні публікації та зміни')}</small></a>
      <a href="${root}/books/"><strong>${text('Books','Книги')}</strong><small>${text('Literary and long-form work','Літературні та великі тексти')}</small></a>
      <a href="${SHOP}" rel="external noopener noreferrer"><strong>${text('Shop ↗','Магазин ↗')}</strong><small>${text('Full editions by Dattara','Повні видання Dattara')}</small></a>
    </div>`;
    hero.after(section);
  }

  let aiIndexPromise;
  const loadIndex=()=>aiIndexPromise ||= fetch(SITE+'/ai-index.json').then(r=>r.ok?r.json():Promise.reject(new Error('index')));
  function commandPalette(){
    const nav=document.querySelector('.nav'); if(!nav || document.querySelector('[data-command-trigger]')) return;
    const trigger=document.createElement('button'); trigger.type='button'; trigger.className='command-trigger'; trigger.dataset.commandTrigger='v1'; trigger.innerHTML=`<span>${text('Search','Пошук')}</span> <kbd>⌘K</kbd>`;
    const switcher=nav.querySelector('.language-switch'); switcher?nav.insertBefore(trigger,switcher):nav.append(trigger);
    const dialog=document.createElement('dialog'); dialog.className='command-dialog'; dialog.innerHTML=`<div class="command-shell"><div class="command-head"><input type="search" autocomplete="off" placeholder="${text('Search pages, documents, topics…','Шукати сторінки, документи, теми…')}" aria-label="${text('Search site','Пошук по сайту')}"><button class="command-close" type="button" aria-label="${text('Close','Закрити')}">×</button></div><div class="command-results" aria-live="polite"></div></div>`; document.body.append(dialog);
    const input=dialog.querySelector('input'), results=dialog.querySelector('.command-results');
    const render=async()=>{
      const q=input.value.trim().toLowerCase();
      try{
        const data=await loadIndex();
        const entries=(data.entries||[]).filter(e=>!q || `${e.title} ${e.description} ${e.url}`.toLowerCase().includes(q)).slice(0,14);
        results.innerHTML=entries.length?entries.map(e=>`<a class="command-result" href="${e.url}"><strong>${e.title}</strong><small>${e.language?.toUpperCase()||''} · ${e.type||''} · ${e.description||''}</small></a>`).join(''):`<p class="command-empty">${text('Nothing found. Try a broader word.','Нічого не знайдено. Спробуй ширше слово.')}</p>`;
      }catch{ results.innerHTML=`<p class="command-empty">${text('Search index is temporarily unavailable.','Індекс пошуку тимчасово недоступний.')}</p>`; }
    };
    const open=()=>{ dialog.showModal?.(); if(!dialog.open) dialog.setAttribute('open',''); input.focus(); render(); };
    trigger.addEventListener('click',open); dialog.querySelector('.command-close').addEventListener('click',()=>dialog.close?.()); input.addEventListener('input',render);
    dialog.addEventListener('click',e=>{ if(e.target===dialog) dialog.close?.(); });
    addEventListener('keydown',e=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open();} if(e.key==='/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'')){e.preventDefault();open();} });
  }

  function readerRoot(){ return document.querySelector('#read-online, .document-reading, .literary-body, .research-essay-reading'); }
  function citationText(){
    const title=(document.querySelector('h1')?.textContent||document.title).trim();
    const year=(document.querySelector('meta[property="article:published_time"]')?.content||'2026').slice(0,4);
    return `Karogod, Ievgen / Dattara. “${title}.” MET[Ȧ]CADEMY OF HUMANITY, ${year}. ${canonical()}`;
  }

  function readerEnhancements(){
    const article=readerRoot(); if(!article) return;
    const words=(article.innerText||'').trim().split(/\s+/).filter(Boolean).length;
    if(words<120) return;
    const minutes=Math.max(1,Math.round(words/220));
    if(!document.querySelector('.reading-meta-strip')){
      const strip=document.createElement('div'); strip.className='reading-meta-strip'; strip.innerHTML=`<span class="meta-chip">${text('≈ '+minutes+' min read','≈ '+minutes+' хв читання')}</span><span class="meta-chip">${words.toLocaleString(uk?'uk-UA':'en-US')} ${text('words','слів')}</span><span class="meta-chip">${uk?'UA':'EN'}</span>`; article.before(strip);
    }

    const headings=[...article.querySelectorAll('h2,h3')].filter(h=>h.textContent.trim().length>2);
    if(headings.length>=3 && !document.querySelector('.reader-toc')){
      const used=new Set();
      headings.forEach((h,i)=>{ if(!h.id){ let base=h.textContent.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'').slice(0,64)||`section-${i+1}`; let id=base,n=2; while(used.has(id)||document.getElementById(id)) id=`${base}-${n++}`; h.id=id; used.add(id); }});
      const toc=document.createElement('details'); toc.className='reader-toc'; toc.innerHTML=`<summary>${text('On this page','На цій сторінці')}</summary><ol>${headings.map(h=>`<li class="${h.tagName==='H3'?'toc-h3':''}"><a href="#${encodeURIComponent(h.id)}">${h.textContent.trim()}</a></li>`).join('')}</ol>`; article.before(toc);
    }

    if(!document.querySelector('.reading-progress')){
      const progress=document.createElement('div'); progress.className='reading-progress'; progress.setAttribute('aria-hidden','true'); progress.innerHTML='<span></span>'; document.body.append(progress); const bar=progress.firstElementChild;
      const update=()=>{ const rect=article.getBoundingClientRect(); const start=scrollY+rect.top; const total=Math.max(1,article.offsetHeight-innerHeight*.55); const value=Math.min(1,Math.max(0,(scrollY-start+innerHeight*.25)/total)); bar.style.width=(value*100).toFixed(2)+'%'; };
      addEventListener('scroll',update,{passive:true}); addEventListener('resize',update); update();
    }

    if(!document.querySelector('.reader-utility')){
      const bar=document.createElement('div'); bar.className='reader-utility'; const challenge=`${REPO}/issues/new?title=${encodeURIComponent('Challenge: '+(document.querySelector('h1')?.textContent||document.title).trim())}&body=${encodeURIComponent(text('I want to challenge or test a claim on this page:\n\n','Хочу оспорити або перевірити тезу на цій сторінці:\n\n')+canonical()+'\n\n')}`;
      bar.innerHTML=`<div class="wrap"><button type="button" data-util-copy>${text('Copy link','Копіювати')}</button><button type="button" data-util-cite>${text('Cite','Цитувати')}</button><a href="${challenge}" rel="external noopener noreferrer">${text('Challenge','Оспорити')}</a><a href="${REPO}/discussions" rel="external noopener noreferrer">${text('Discuss','Обговорити')}</a><button type="button" data-util-theme>${text('Night','Ніч')}</button><a class="utility-shop" href="${SHOP}" rel="external noopener noreferrer">${text('Shop ↗','Магазин ↗')}</a></div>`;
      const pagehead=document.querySelector('.pagehead'); pagehead?pagehead.after(bar):article.before(bar);
      bar.querySelector('[data-util-copy]').addEventListener('click',async e=>{await copyText(canonical());flash(e.currentTarget,text('Copied ✓','Скопійовано ✓'));});
      bar.querySelector('[data-util-cite]').addEventListener('click',async e=>{await copyText(citationText());flash(e.currentTarget,text('Citation copied ✓','Цитату скопійовано ✓'));});
      bar.querySelector('[data-util-theme]').addEventListener('click',e=>{ const night=document.documentElement.dataset.theme!=='night'; document.documentElement.dataset.theme=night?'night':''; localStorage.setItem('moh-theme',night?'night':'day'); e.currentTarget.textContent=night?text('Day','День'):text('Night','Ніч'); });
    }
  }

  function restoreTheme(){ if(localStorage.getItem('moh-theme')==='night') document.documentElement.dataset.theme='night'; }
  function backToTop(){
    if(document.querySelector('.back-to-top')) return;
    const b=document.createElement('button'); b.type='button'; b.className='back-to-top'; b.setAttribute('aria-label',text('Back to top','Нагору')); b.textContent='↑'; document.body.append(b);
    const update=()=>b.dataset.visible=scrollY>900?'true':'false'; addEventListener('scroll',update,{passive:true}); update(); b.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
  }

  restoreTheme();
  ensureSkipLink();
  ensureShopLinks();
  markActiveNav();
  breadcrumbs();
  homeLaunchpad();
  commandPalette();
  readerEnhancements();
  backToTop();
})();
