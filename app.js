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
 if(sculpture){
  let glowFrame=0,pointerX=0,pointerY=0;
  sculpture.addEventListener('pointermove',event=>{
   if(event.pointerType==='touch')return;
   pointerX=event.clientX;pointerY=event.clientY;
   if(!glowFrame)glowFrame=requestAnimationFrame(()=>{
    glowFrame=0;const bounds=sculpture.getBoundingClientRect();
    sculpture.style.setProperty('--glow-x',`${pointerX-bounds.left}px`);
    sculpture.style.setProperty('--glow-y',`${pointerY-bounds.top}px`);
    sculpture.classList.add('cursor-lit');
   });
  });
  function clearGlow(){cancelAnimationFrame(glowFrame);glowFrame=0;sculpture.classList.remove('cursor-lit');}
  sculpture.addEventListener('pointerleave',clearGlow);sculpture.addEventListener('pointercancel',clearGlow);
  window.addEventListener('blur',clearGlow);
 }
 function update(){frame=0;nav.classList.toggle('scrolled',scrollY>35);const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--progress',max>0?Math.max(0,Math.min(1,scrollY/max)):0);if(sculpture&&sculpture.getBoundingClientRect().bottom>0)sculpture.style.setProperty('--sculpture-y',reduced.matches||innerWidth<701?'0px':Math.min(scrollY*.06,40)+'px');}
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('load',schedule);reduced.addEventListener('change',schedule);update();
 const gallery=document.querySelector('.photo-carousel');
 if(gallery){
  const track=gallery.querySelector('.gallery-track'),pause=gallery.querySelector('[data-gallery="pause"]');
  const originals=[...track.querySelectorAll('.gallery-item')];
  originals.forEach(photo=>{const copy=photo.cloneNode(true);copy.querySelector('img').alt='';copy.setAttribute('aria-hidden','true');track.appendChild(copy);});
  let paused=false,animation=0,lastTime=0,position=track.scrollLeft,dragging=false;
  function loopWidth(){return originals.length*(originals[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap));}
  function move(left){const width=loopWidth();position=((left%width)+width)%width;track.scrollLeft=position;}
  function tick(time){
   if(lastTime){
    if(Math.abs(track.scrollLeft-position)>2)position=track.scrollLeft;
    move(position+Math.min(time-lastTime,50)*.032);
   }
   lastTime=time;animation=requestAnimationFrame(tick);
  }
  function sync(){
   cancelAnimationFrame(animation);lastTime=0;
   pause.textContent=paused?'Play slideshow':'Pause slideshow';pause.setAttribute('aria-pressed',String(paused));
   if(!paused&&!dragging&&!document.hidden)animation=requestAnimationFrame(tick);
  }
  function step(direction){move(track.scrollLeft+direction*(originals[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap)));}
  gallery.querySelector('[data-gallery="prev"]').addEventListener('click',()=>step(-1));
  gallery.querySelector('[data-gallery="next"]').addEventListener('click',()=>step(1));
  pause.addEventListener('click',()=>{paused=!paused;sync();});
  track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();step(e.key==='ArrowRight'?1:-1);}});
  track.addEventListener('pointerdown',()=>{dragging=true;sync();});
  function release(){if(dragging){dragging=false;position=track.scrollLeft;sync();}}
  window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);
  window.addEventListener('resize',()=>move(track.scrollLeft));
  document.addEventListener('visibilitychange',sync);sync();
 }
})();
