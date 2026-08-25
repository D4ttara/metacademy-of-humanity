(() => {
  const canonicalShareUrl = () => document.querySelector('link[rel="canonical"]')?.href || location.href.split('#')[0];
  const meta = name => document.querySelector(`meta[name="${name}"]`)?.content || '';
  const description = () => meta('description') || document.querySelector('.lede')?.textContent?.trim() || '';
  const pageTitle = () => meta('citation_title') || document.querySelector('h1')?.textContent?.trim() || document.title;
  const shareCard = () => [pageTitle(), description(), canonicalShareUrl()].filter(Boolean).join('\n\n');
  const citation = () => {
    const author=meta('citation_author') || 'Ievgen Karogod';
    const title=meta('citation_title') || pageTitle();
    const date=meta('citation_publication_date') || '2026';
    const year=(date.match(/(?:19|20)\d{2}/)||['2026'])[0];
    const report=meta('citation_technical_report_number');
    const institution=meta('citation_technical_report_institution') || 'MET[Ȧ]CADEMY OF HUMANITY';
    return `${author}. (${year}). ${title}. ${report ? report + '. ' : ''}${institution}. ${canonicalShareUrl()}`;
  };
  const copyText = async text => {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    const area=document.createElement('textarea');
    area.value=text; area.setAttribute('readonly',''); area.style.position='fixed'; area.style.opacity='0';
    document.body.append(area); area.select(); document.execCommand('copy'); area.remove();
  };
  const uk=document.documentElement.lang==='uk';
  const flash=(button,text,ms=1800)=>{const original=button.textContent;button.textContent=text;button.setAttribute('aria-label',text);setTimeout(()=>{button.textContent=original;button.setAttribute('aria-label',original);},ms);};
  document.querySelectorAll('[data-ai-reader-lab]').forEach(lab => {
    const prompt=lab.querySelector('[data-ai-prompt]');
    const copy=lab.querySelector('[data-copy-ai-prompt]');
    const cite=lab.querySelector('[data-copy-citation]');
    const share=lab.querySelector('[data-share-reader]');
    if(copy && prompt){
      copy.addEventListener('click', async () => {
        const text=prompt.textContent.replaceAll('{URL}',canonicalShareUrl());
        try { await copyText(text); flash(copy,uk?'Промпт скопійовано ✓':'Prompt copied ✓'); }
        catch { flash(copy,uk?'Не вдалося скопіювати':'Copy failed'); }
      });
    }
    if(cite){
      cite.addEventListener('click', async () => {
        try { await copyText(citation()); flash(cite,uk?'Цитату скопійовано ✓':'Citation copied ✓'); }
        catch { flash(cite,uk?'Не вдалося скопіювати':'Copy failed'); }
      });
    }
    if(share){
      share.addEventListener('click', async () => {
        try {
          if(navigator.share) await navigator.share({title:pageTitle(),text:description(),url:canonicalShareUrl()});
          else { await copyText(shareCard()); flash(share,uk?'Картку скопійовано ✓':'Share card copied ✓'); }
        } catch(error) {
          if(error?.name!=='AbortError') flash(share,uk?'Не вдалося':'Share failed');
        }
      });
    }
  });
})();
