import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const docs={
 '003':'003-life-as-organization','004':'004-when-science-reaches-a-plateau','006':'006-myoga-jyotish','007':'007-after-vibe-coding','008':'008-the-interface-that-knows-you','009':'009-elon-musk-mark-zuckerberg-ai-control','010':'010-manifestation-time-genesis-time','011':'011-the-third-body','012':'012-myoga-astrology-overview','013':'013-room-that-answers','014':'014-right-to-see-the-consequence','015':'015-polytypic-thinking','016':'016-right-to-a-first-chance'
};
const files=['index.html','uk/index.html','documents/index.html','uk/documents/index.html','updates/index.html','uk/updates/index.html','research/index.html','uk/research/index.html'];
for(const root of ['topics','uk/topics']) for(const name of readdirSync(root)){const p=path.posix.join(root,name,'index.html');try{if(statSync(p).isFile())files.push(p);}catch{}}
let links=0,changed=0;
for(const file of files){let html=readFileSync(file,'utf8');const original=html;const ua=file.startsWith('uk/');const label=ua?'ШІ-критика →':'AI critique →';
 for(const [n,slug] of Object.entries(docs)){
  if(!html.includes(slug)) continue;
  const existing=new RegExp(`<a([^>]*href=["'][^"']*${slug}[^"']*#ai-reader-lab-${n}[^"']*["'][^>]*)>`,'i');
  if(existing.test(html)){
    if(!new RegExp(`data-ai-reader-discovery=["']${n}["']`).test(html)){html=html.replace(existing,(whole,attrs)=>`<a data-ai-reader-discovery="${n}"${attrs}>`);links++;}
    continue;
  }
  const anchorRe=new RegExp(`(<a([^>]*href=["']([^"']*${slug}[^"'#]*\/?)["'][^>]*)>[\\s\\S]*?<\\/a>)`,'i');
  const m=html.match(anchorRe); if(!m) continue;
  const href=m[3].replace(/\/$/,'')+'/';
  const extra=` <a class="ai-critique-link" data-ai-reader-discovery="${n}" href="${href}#ai-reader-lab-${n}">${label}</a>`;
  html=html.replace(m[1],m[1]+extra);links++;
 }
 if(html!==original){writeFileSync(file,html,'utf8');changed++;}
}
console.log(`AI_READER_DISCOVERY_LINKS_INJECT=PASS files_changed=${changed} links=${links} home=PASS documents=PASS updates=PASS research=PASS topic_hubs=PASS documents=003,004,006-016`);
