(async function(){
 const track=document.getElementById('reflectionTrack'); if(!track)return;
 const status=document.getElementById('reflectionStatus');
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 try{
   const res=await fetch('reflections.json',{cache:'no-store'}); if(!res.ok)throw Error('Index unavailable');
   const items=await res.json();
   track.innerHTML=items.map((item,i)=>`<article class="ref-card"><div class="ref-icon" aria-hidden="true">${escape(item.emoji||'✨')}</div><div class="ref-date">${escape(item.date)} · ${escape(item.category||'Reflection')}</div><h3>${escape(item.title)}</h3><p>${escape(item.subtitle)}</p><a class="ref-read" href="reflection.html?file=${encodeURIComponent(item.file)}">Read Reflection →</a></article>`).join('');
   status.textContent=items.length?`${items.length} reflections · newest first`:'New reflections are coming soon.';
 }catch(e){status.textContent='Reflections are being prepared. Please visit again soon.';track.innerHTML='';}
 const move=dir=>track.scrollBy({left:dir*(track.querySelector('.ref-card')?.getBoundingClientRect().width||300)+dir*20,behavior:'smooth'});
 document.getElementById('refPrev').addEventListener('click',()=>move(-1));document.getElementById('refNext').addEventListener('click',()=>move(1));
})();
