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
})();
