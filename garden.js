'use strict';
(()=>{
 const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
 const speech=q('#hero-speech'),voice=q('#voice-button');let voiceOn=false,speechTimer;
 const messages=[
 'Привет! Я росток RAVDA. Здесь дети играют, дружат и открывают мир. Давай познакомимся!',
 'У нас небольшие группы: до пятнадцати детей, а в младшей — до десяти. Так легче замечать каждого.',
 'Английский и арабский, творчество, подготовка к школе. Каждый день — маленький шаг к большому открытию.',
 'А ещё у нас полезная еда и настоящие приключения на прогулках. Посмотри фотографии и видео ниже!',
 'Хочешь прийти в гости? Напиши администратору. Мы будем рады познакомиться с вашей семьёй.'
 ];let step=0;
 const gesture=m=>window.dispatchEvent(new CustomEvent('ravda-gesture',{detail:m}));
 function stopSpeech(){clearTimeout(speechTimer);if('speechSynthesis' in window)window.speechSynthesis.cancel();window.dispatchEvent(new CustomEvent('ravda-speaking',{detail:false}));}
 function say(text){speech.textContent=text;speech.classList.remove('speech-bounce');void speech.offsetWidth;speech.classList.add('speech-bounce');stopSpeech();if(!voiceOn)return;const utter=new SpeechSynthesisUtterance(text);utter.lang='ru-RU';utter.rate=.94;utter.pitch=1.08;const available=speechSynthesis.getVoices();const ru=available.find(v=>v.lang.toLowerCase().startsWith('ru'));if(ru)utter.voice=ru;utter.onstart=()=>window.dispatchEvent(new CustomEvent('ravda-speaking',{detail:true}));utter.onend=utter.onerror=()=>window.dispatchEvent(new CustomEvent('ravda-speaking',{detail:false}));speechSynthesis.speak(utter);speechTimer=setTimeout(()=>window.dispatchEvent(new CustomEvent('ravda-speaking',{detail:false})),22000);}
 if(!('speechSynthesis' in window)){voice.disabled=true;voice.textContent='Реплики на экране';}else{voice.addEventListener('click',()=>{voiceOn=!voiceOn;voice.setAttribute('aria-pressed',voiceOn);voice.textContent=voiceOn?'Выключить голос':'Включить голос';if(voiceOn)say(speech.textContent);else stopSpeech();});}
 q('#wave-button').addEventListener('click',()=>{gesture('wave');say('Привет-привет! Рады видеть вас в RAVDA. Давайте расти вместе!');});
 window.addEventListener('ravda-greeting',()=>say('Привет-привет! Я здесь, чтобы показать вам наш маленький большой мир.'));
 q('#tour-button').addEventListener('click',()=>{say(messages[step]);gesture(step===4?'joy':'wave');step=(step+1)%messages.length;q('#tour-button').textContent=step===0?'Расскажи ещё раз':'А что ещё?';});
 const trigger=q('#intro-trigger'),panel=q('#hero-film'),video=q('#intro-video'),play=q('#intro-play'),sound=q('#intro-sound'),progress=q('#intro-progress');let pinned=false;
 const fmt=n=>`${Math.floor((n||0)/60)}:${String(Math.floor((n||0)%60)).padStart(2,'0')}`;
 function openFilm(pin=false){pinned=pinned||pin;stopSpeech();panel.hidden=false;document.body.classList.add('intro-playing');trigger.setAttribute('aria-expanded','true');video.play().catch(()=>{play.textContent='▶';play.setAttribute('aria-label','Воспроизвести');});}
 function closeFilm(){video.pause();video.muted=true;sound.textContent='Включить звук';sound.setAttribute('aria-pressed','false');panel.hidden=true;pinned=false;document.body.classList.remove('intro-playing');trigger.setAttribute('aria-expanded','false');}
 trigger.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'&&!document.body.classList.contains('motion-off'))openFilm();});trigger.addEventListener('click',()=>{openFilm(true);if(matchMedia('(max-width:760px)').matches)panel.scrollIntoView({behavior:document.body.classList.contains('motion-off')?'auto':'smooth',block:'center'});});
 q('.garden-hero').addEventListener('pointerleave',()=>{if(!pinned)closeFilm();});
 q('#close-intro').addEventListener('click',()=>{closeFilm();q('#wave-button').focus();});
 play.addEventListener('click',()=>{pinned=true;if(video.paused)video.play().catch(()=>{});else video.pause();});
 sound.addEventListener('click',()=>{pinned=true;video.muted=!video.muted;sound.textContent=video.muted?'Включить звук':'Выключить звук';sound.setAttribute('aria-pressed',!video.muted);if(video.paused)video.play().catch(()=>{});});
 video.addEventListener('play',()=>{play.textContent='Ⅱ';play.setAttribute('aria-label','Пауза');});video.addEventListener('pause',()=>{play.textContent='▶';play.setAttribute('aria-label','Воспроизвести');});video.addEventListener('loadedmetadata',()=>{if(Number.isFinite(video.duration))progress.max=video.duration;});video.addEventListener('timeupdate',()=>{progress.value=video.currentTime;q('#intro-time').textContent=`${fmt(video.currentTime)} / ${fmt(video.duration||40)}`;});progress.addEventListener('input',()=>{video.currentTime=Number(progress.value);pinned=true;});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)closeFilm();});document.addEventListener('visibilitychange',()=>{if(document.hidden){video.pause();stopSpeech();}});
 new IntersectionObserver(es=>{if(!es[0].isIntersecting&&!panel.hidden)closeFilm();},{threshold:.05}).observe(q('.garden-hero'));
 const track=q('#day-track');q('#day-prev').addEventListener('click',()=>track.scrollBy({left:-track.querySelector('.day-card').offsetWidth-23,behavior:document.body.classList.contains('motion-off')?'auto':'smooth'}));q('#day-next').addEventListener('click',()=>track.scrollBy({left:track.querySelector('.day-card').offsetWidth+23,behavior:document.body.classList.contains('motion-off')?'auto':'smooth'}));
 const guide=q('#garden-guide');let dismissed=false,activeSection='';const tours=[['about','mascot-1.webp','Здесь важно замечать каждого. Даже самое маленькое достижение.'],['learning','mascot-2.webp','А что сегодня откроет ваш малыш? Выберите направление занятий.'],['life','mascot-6.webp','Это наши настоящие приключения! Нажмите на видео.'],['daybook','mascot-3.webp','И для отдыха, и для новых открытий есть своё время.'],['parents','mascot-5.webp','Почитайте, что говорят о садике родители.'],['contact','mascot-4.webp','Давайте знакомиться! Администратор ответит на ваши вопросы.']];
 q('#guide-dismiss').addEventListener('click',()=>{dismissed=true;guide.classList.remove('shown');guide.inert=true;});
 new IntersectionObserver(es=>{for(const e of es){if(!e.isIntersecting||dismissed)continue;const item=tours.find(x=>x[0]===e.target.id);if(item&&activeSection!==item[0]){activeSection=item[0];q('#guide-pose').src='assets/brand/'+item[1];q('#guide-message').textContent=item[2];guide.classList.add('shown');guide.inert=false;}}},{rootMargin:'-15% 0px -45% 0px',threshold:0}).observe(q('#about'));
 const guideObserver=new IntersectionObserver(es=>{for(const e of es){if(!e.isIntersecting||dismissed)continue;const item=tours.find(x=>x[0]===e.target.id);if(item){q('#guide-pose').src='assets/brand/'+item[1];q('#guide-message').textContent=item[2];guide.classList.add('shown');guide.inert=false;}}},{rootMargin:'-15% 0px -45% 0px',threshold:0});tours.slice(1).forEach(x=>guideObserver.observe(q('#'+x[0])));
 new IntersectionObserver(es=>{if(es[0].isIntersecting){guide.classList.remove('shown');guide.inert=true;}},{threshold:.2}).observe(q('.garden-hero'));
})();
