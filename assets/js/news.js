async function init(){
 let data;try{data=await(await fetch('data/news.json')).json()}catch{return}
 const editions=(data.editions||[]).slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 let current=editions.find(e=>e.id===data.currentEdition)||editions[0],activeEdition=current,activeStories=[],activeIndex=0;
 const latest=document.getElementById('latest'),archive=document.getElementById('archive');
 const modal=document.getElementById('storyModal'),modalContent=document.getElementById('modalContent');
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safeUrl=x=>{try{const u=new URL(x,location.href);return ['http:','https:'].includes(u.protocol)?u.href:'#'}catch{return '#'}};
 const imageMarkup=s=>{let src=s.image?safeUrl(s.image):'';return src&&src!=='#'?`<img src="${src}" alt="" loading="lazy" onerror="this.parentElement.classList.add('no-image');this.remove()">`:`<div class="thumb-art"><span>${esc((s.category||'SECURITY').toUpperCase())}</span><b>⌁</b><i>FIELD NOTE</i></div>`};
 function renderEdition(e){
  if(!e||!latest)return;activeEdition=e;activeStories=(e.stories||[]).slice(0,5);
  latest.innerHTML=`<div class="edition-head"><div><span class="section-kicker">${esc(e.date||'')}</span><h2>${esc(e.title||'Security briefing')}</h2></div><span class="edition-count">${activeStories.length} / 5 STORIES</span></div>`+
   (activeStories.length?`<div class="storygrid">${activeStories.map((s,i)=>`<button class="storycard" type="button" data-story-index="${i}" aria-label="Open ${esc(s.title)}"><div class="story-thumb">${imageMarkup(s)}</div><div class="story-card-copy"><small>${esc(s.category||'SECURITY')} · ${esc(s.date||e.date||'')}</small><h3>${esc(s.title||'Untitled incident')}</h3><span class="card-open">OPEN FIELD NOTE <b>↗</b></span></div></button>`).join('')}</div>`:`<div class="empty"><h2>No stories in this edition yet.</h2><p>Add up to five researched stories to this edition in data/news.json.</p></div>`);
  latest.querySelectorAll('[data-story-index]').forEach(b=>b.addEventListener('click',()=>openStory(Number(b.dataset.storyIndex))));
 }
 function renderArchive(){
  if(!archive)return;const old=editions.filter(e=>!current||e.id!==current.id);
  archive.innerHTML=old.length?`<div class="archive-list">${old.map(e=>`<button type="button" class="archive-item ${activeEdition&&activeEdition.id===e.id?'selected':''}" data-edition="${esc(e.id)}"><span><small>${esc(e.date||'')}</small><strong>${esc(e.title||'Security edition')}</strong></span><span class="archive-arrow">↗</span></button>`).join('')}</div>`:'<p class="archive-empty">Older editions will appear here as you publish them.</p>';
  archive.querySelectorAll('[data-edition]').forEach(b=>b.addEventListener('click',()=>{const e=editions.find(x=>x.id===b.dataset.edition);if(e){renderEdition(e);renderArchive();document.getElementById('latest')?.scrollIntoView({behavior:'smooth',block:'start'})}}));
 }
 function openStory(i){if(!activeStories.length)return;activeIndex=(i+activeStories.length)%activeStories.length;renderModal();modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');modal.querySelector('.modal-close')?.focus()}
 function renderModal(){
  const s=activeStories[activeIndex],e=activeEdition;if(!s||!modalContent)return;
  const source=s.sourceUrl?`<a class="source-link" href="${safeUrl(s.sourceUrl)}" target="_blank" rel="noopener">${esc(s.sourceName||'Original source')} ↗</a>`:'<span class="source-missing">Source link not added</span>';
  const chain=(s.attackChain||[]).map((x,i)=>`<article class="analysis-step"><span class="step-number">${String(i+1).padStart(2,'0')}</span><div><h4>${esc(x.stage)}</h4><p>${esc(x.description)}</p></div></article>`).join('');
  const timeline=(s.timeline||[]).map(x=>`<article class="timeline-event"><time>${esc(x.date)}</time><p>${esc(x.event)}</p></article>`).join('');
  const lessons=(s.observations?.lessons||[]).map(x=>`<li>${esc(x)}</li>`).join('');
  const recommendations=(s.observations?.recommendations||[]).map(x=>`<li>${esc(x)}</li>`).join('');
  modalContent.innerHTML=`<div class="modal-topline"><span>${esc(s.category||'SECURITY')}</span><span>${esc(s.date||e.date||'')}</span></div><div class="modal-image">${imageMarkup(s)}</div><h2 id="modalTitle">${esc(s.title||'Untitled incident')}</h2><div class="modal-body">
  <section><small>01 / INCIDENT SUMMARY</small><p>${esc(s.summary||'Summary not added.')}</p></section>
  <section><small>02 / ATTACK CHAIN</small><div class="attack-chain">${chain||'<p>Attack chain details not added.</p>'}</div></section>
  <section><small>03 / INCIDENT TIMELINE</small><div class="incident-timeline">${timeline||'<p>Timeline details not added.</p>'}</div></section>
  <section><small>04 / IMPACT</small><p>${esc(s.impact||'Impact details not added.')}</p></section>
  <section><small>05 / ORGANIZATIONAL RESPONSE</small><p>${esc(s.response||'Response details not added.')}</p></section>
  <section><small>06 / ROOT CAUSE</small><p>${esc(s.rootCause||'Root cause not publicly confirmed.')}</p></section>
  <section class="observations-panel"><small>07 / MY OBSERVATIONS</small><h3>Lessons learned</h3><ul>${lessons||'<li>Lessons not added yet.</li>'}</ul><h3>Recommendations</h3><ul>${recommendations||'<li>Recommendations not added yet.</li>'}</ul></section>
  <section class="source-row"><small>ORIGINAL SOURCE</small>${source}</section></div>
  <div class="modal-navigation"><button type="button" class="nav-story" data-prev ${activeIndex===0?'disabled':''}>← Previous</button><span>${activeIndex+1} <i>/</i> ${activeStories.length}</span><button type="button" class="nav-story next" data-next ${activeIndex===activeStories.length-1?'disabled':''}>Next story →</button></div>`;
  modalContent.querySelector('[data-prev]')?.addEventListener('click',()=>{activeIndex--;renderModal()});
  modalContent.querySelector('[data-next]')?.addEventListener('click',()=>{activeIndex++;renderModal()});
 }
 function closeModal(){modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}
 modal?.querySelectorAll('[data-close-story]').forEach(x=>x.addEventListener('click',closeModal));
 document.addEventListener('keydown',e=>{if(!modal?.classList.contains('open'))return;if(e.key==='Escape')closeModal();if(e.key==='ArrowRight'&&activeIndex<activeStories.length-1){activeIndex++;renderModal()}if(e.key==='ArrowLeft'&&activeIndex>0){activeIndex--;renderModal()}});
 if(latest){if(current)renderEdition(current);else latest.innerHTML='<div class="empty"><h2>Your journal starts here.</h2><p>Add up to five researched stories to data/news.json. No fabricated news has been added.</p></div>'}
 renderArchive();
 const detail=document.getElementById('story');
 if(detail){const q=new URLSearchParams(location.search),e=editions.find(x=>x.id===q.get('edition')),s=e&&(e.stories||[]).find(x=>x.slug===q.get('story'));if(!s){detail.innerHTML='<h2>Story not found</h2>';return}const chain=(s.attackChain||[]).map(x=>`<article class="analysis-step"><h3>${esc(x.stage)}</h3><p>${esc(x.description)}</p></article>`).join('');const timeline=(s.timeline||[]).map(x=>`<article class="timeline-event"><time>${esc(x.date)}</time><p>${esc(x.event)}</p></article>`).join('');const lessons=(s.observations?.lessons||[]).map(x=>`<li>${esc(x)}</li>`).join('');const recs=(s.observations?.recommendations||[]).map(x=>`<li>${esc(x)}</li>`).join('');detail.innerHTML=`<small>${esc(s.category)} · ${esc(s.date||e.date)}</small><h1>${esc(s.title)}</h1>${imageMarkup(s)}<section class="detail"><h2>Incident summary</h2><p>${esc(s.summary)}</p></section><section class="detail"><h2>Attack chain</h2>${chain}</section><section class="detail"><h2>Timeline</h2>${timeline}</section><section class="detail"><h2>Impact</h2><p>${esc(s.impact||'Not publicly confirmed.')}</p></section><section class="detail"><h2>Response</h2><p>${esc(s.response||'Not publicly confirmed.')}</p></section><section class="detail"><h2>Root cause</h2><p>${esc(s.rootCause||'Not publicly confirmed.')}</p></section><section class="detail"><h2>My observations — Lessons learned</h2><ul>${lessons}</ul><h2>Recommendations</h2><ul>${recs}</ul></section><section class="detail"><h2>Original source</h2><a href="${safeUrl(s.sourceUrl)}" target="_blank" rel="noopener">${esc(s.sourceName||'Read source')} ↗</a></section>`}
}
init();
