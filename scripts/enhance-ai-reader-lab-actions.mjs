import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
function walk(dir,out=[]){for(const name of readdirSync(dir)){const p=path.posix.join(dir,name);const st=statSync(p);if(st.isDirectory())walk(p,out);else if(name==='index.html')out.push(p);}return out;}
let labs=0,changed=0;
for(const file of walk('documents')){
 let html=readFileSync(file,'utf8');
 if(!html.includes('data-ai-reader-lab=')) continue;
 const uk=/<html[^>]+lang="(?:uk|ua)"/i.test(html)||file.includes('/ua/');
 const n=(html.match(/data-ai-reader-lab="(\d{3})"/)||[])[1]; if(!n) throw new Error(`Lab number missing: ${file}`); labs++;
 let before=html;
 const sectionNeedle=`<section id="ai-reader-lab-${n}" class="ai-reader-lab"`;
 if(html.includes(sectionNeedle)&&!html.includes(`aria-labelledby="ai-reader-title-${n}"`)) html=html.replace(sectionNeedle,`${sectionNeedle} aria-labelledby="ai-reader-title-${n}"`);
 const start=html.indexOf(`id="ai-reader-lab-${n}"`); const end=start>=0?html.indexOf('</section>',start):-1;
 if(start<0||end<0) throw new Error(`Lab bounds missing: ${file}`);
 let block=html.slice(start,end);
 if(!block.includes(`id="ai-reader-title-${n}"`)) block=block.replace('<h2>',`<h2 id="ai-reader-title-${n}">`);
 if(!block.includes('data-copy-citation')){
   const marker=/<button class="button primary" type="button" data-copy-ai-prompt>([^<]+)<\/button>/;
   if(!marker.test(block)) throw new Error(`Prompt button missing: ${file}`);
   const citationLabel=uk?'Копіювати цитату':'Copy citation';
   block=block.replace(marker,(whole,label)=>`<button class="button primary" type="button" data-copy-ai-prompt aria-label="${label}" aria-live="polite">${label}</button><button class="button" type="button" data-copy-citation aria-label="${citationLabel}" aria-live="polite">${citationLabel}</button>`);
 } else block=block.replace(/<button class="button primary" type="button" data-copy-ai-prompt(?![^>]*aria-label)/,m=>`${m} aria-label="${uk?'Копіювати критичний промпт':'Copy critical prompt'}" aria-live="polite"`);
 block=block.replace(/<button class="button" type="button" data-share-reader(?![^>]*aria-label)/,m=>`${m} aria-label="${uk?'Поділитися публікацією':'Share publication'}" aria-live="polite"`);
 block=block.replace(/<pre class="ai-reader-prompt" data-ai-prompt(?![^>]*aria-label)/,m=>`${m} aria-label="${uk?'Критичний промпт для ШІ':'Critical AI reading prompt'}"`);
 html=html.slice(0,start)+block+html.slice(end);
 if(html!==before){writeFileSync(file,html,'utf8');changed++;}
}
console.log(`AI_READER_LAB_ACTIONS_ENHANCE=PASS labs=${labs} changed=${changed} copy_citation=PASS share_card=PASS aria=PASS`);
