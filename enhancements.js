// Дополнительные улучшения без сборки
document.querySelectorAll('button:not([type])').forEach(b=>b.type='button');
document.querySelectorAll('[data-max]').forEach(b=>b.setAttribute('aria-label','Написать в MAX'));
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>{try{const u=new URL(a.href);u.searchParams.set('utm_source','site');u.searchParams.set('utm_medium','whatsapp');u.searchParams.set('utm_campaign','ravda');u.searchParams.set('utm_content',a.closest('section')?.id||'general');a.href=u.toString()}catch(e){}});
const toTop=document.createElement('button');toTop.id='to-top';toTop.type='button';toTop.textContent='↑';toTop.setAttribute('aria-label','Наверх');Object.assign(toTop.style,{position:'fixed',right:'18px',bottom:'90px',zIndex:'50',borderRadius:'50%',width:'48px',height:'48px',background:'#194d40',color:'white',border:'none',cursor:'pointer',display:'none'});document.body.append(toTop);const updateTop=()=>{toTop.style.display=scrollY>600?'block':'none'};window.addEventListener('scroll',updateTop,{passive:true});updateTop();toTop.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
// Дополнительные ролики подключаются автоматически после загрузки файлов в assets.
(async()=>{
 const files=[{name:'intro-ravda.mp4',title:'Почувствуйте атмосферу RAVDA',intro:true},{name:'ravda-moments.mp4',title:'Тёплые моменты нашего сада'},{name:'ravda-care.mp4',title:'Забота в каждом дне'},{name:'ravda-day.mp4',title:'Один день в RAVDA'}];
 const gallery=document.querySelector('.life-gallery');
 for(const item of files){
  const path='assets/'+item.name;// Файлы подтверждены в репозитории; не блокируем показ из-за HEAD/Content-Type.
  if(item.intro){
   const video=document.querySelector('#intro-video');if(video){video.src=path;video.load();const title=document.querySelector('#intro-trigger strong');if(title)title.textContent=item.title;const time=document.querySelector('#intro-time');if(time)time.textContent='0:00 / 0:13';}
   continue;
  }
  if(!gallery)continue;
  const button=document.createElement('button');button.type='button';button.className='memory-card memory-small reveal visible';button.innerHTML='<span class="extra-video-play" aria-hidden="true">▶</span><span class="extra-video-title"></span><span class="extra-video-subtitle">Смотреть видео ↗</span>';button.querySelector('.extra-video-title').textContent=item.title;button.addEventListener('click',()=>{
   const dialog=document.querySelector('#media-dialog'),content=document.querySelector('#media-content');if(!dialog||!content)return;
   const video=document.createElement('video');video.src=path;video.controls=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label',item.title);content.replaceChildren(video);document.querySelector('#media-caption').textContent=item.title;dialog.showModal();video.play().catch(()=>{});
  });gallery.append(button);
 }
})();
