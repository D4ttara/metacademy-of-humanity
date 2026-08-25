(() => {
  const canonicalShareUrl = () => document.querySelector('link[rel="canonical"]')?.href || location.href.split('#')[0];
  const copyText = async text => {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    const area=document.createElement('textarea');
    area.value=text; area.setAttribute('readonly',''); area.style.position='fixed'; area.style.opacity='0';
    document.body.append(area); area.select(); document.execCommand('copy'); area.remove();
  };
  const uk=document.documentElement.lang==='uk';
  document.querySelectorAll('[data-ai-reader-lab]').forEach(lab => {
    const prompt=lab.querySelector('[data-ai-prompt]');
    const copy=lab.querySelector('[data-copy-ai-prompt]');
    const share=lab.querySelector('[data-share-reader]');
    if(copy && prompt){
      copy.addEventListener('click', async () => {
        const original=copy.textContent;
        const text=prompt.textContent.replaceAll('{URL}',canonicalShareUrl());
        try { await copyText(text); copy.textContent=uk?'Промпт скопійовано ✓':'Prompt copied ✓'; }
        catch { copy.textContent=uk?'Не вдалося скопіювати':'Copy failed'; }
        setTimeout(()=>{ copy.textContent=original; },1800);
      });
    }
    if(share){
      share.addEventListener('click', async () => {
        const original=share.textContent;
        try {
          if(navigator.share) await navigator.share({title:document.title,url:canonicalShareUrl()});
          else { await copyText(canonicalShareUrl()); share.textContent=uk?'Посилання скопійовано ✓':'Link copied ✓'; setTimeout(()=>{share.textContent=original;},1800); }
        } catch(error) {
          if(error?.name!=='AbortError'){ share.textContent=uk?'Не вдалося':'Share failed'; setTimeout(()=>{share.textContent=original;},1800); }
        }
      });
    }
  });
})();
