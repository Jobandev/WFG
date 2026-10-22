(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const nav=document.querySelector('.nav');
 document.getElementById('year').textContent=new Date().getFullYear();
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});
  document.body.classList.add('motion-ready');
  document.querySelectorAll('.reveal').forEach(el=>{if(el.parentElement.matches('.service-grid,.division-grid,.culture-grid'))el.style.setProperty('--delay',([...el.parentElement.children].indexOf(el)*85)+'ms');observer.observe(el);});
 }
 const sculpture=document.querySelector('.sculpture');let frame=0;
 function update(){frame=0;nav.classList.toggle('scrolled',scrollY>35);const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--progress',max>0?Math.max(0,Math.min(1,scrollY/max)):0);if(sculpture&&sculpture.getBoundingClientRect().bottom>0)sculpture.style.setProperty('--sculpture-y',reduced.matches||innerWidth<701?'0px':Math.min(scrollY*.06,40)+'px');}
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('load',schedule);reduced.addEventListener('change',schedule);update();
 const gallery=document.querySelector('.photo-carousel');
 if(gallery){
  const track=gallery.querySelector('.gallery-track'),pause=gallery.querySelector('[data-gallery="pause"]');
  let paused=reduced.matches,timer;
  function step(direction){
   const end=track.scrollWidth-track.clientWidth;
   const photo=track.querySelector('img');
   const stride=photo.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);
   const left=direction>0&&track.scrollLeft>=end-2?0:direction<0&&track.scrollLeft<=2?end:track.scrollLeft+direction*stride;
   track.scrollTo({left,behavior:reduced.matches?'instant':'smooth'});
  }
  function sync(){
   clearInterval(timer);pause.textContent=paused?'Play slideshow':'Pause slideshow';pause.setAttribute('aria-pressed',String(paused));
   if(!paused&&!document.hidden)timer=setInterval(()=>step(1),5500);
  }
  gallery.querySelector('[data-gallery="prev"]').addEventListener('click',()=>step(-1));
  gallery.querySelector('[data-gallery="next"]').addEventListener('click',()=>step(1));
  pause.addEventListener('click',()=>{paused=!paused;if(!paused)step(1);sync();});
  track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();step(e.key==='ArrowRight'?1:-1);}});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});sync();
 }
})();
