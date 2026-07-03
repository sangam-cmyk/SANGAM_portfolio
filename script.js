// duplicate marquees for seamless loop
for(const id of ['mq','lt1','lt2']){const el=document.getElementById(id);if(el)el.innerHTML+=el.innerHTML;}

// mobile menu
const menuBtn=document.getElementById('menuBtn'),navList=document.getElementById('navList');
if(menuBtn&&navList){
  menuBtn.addEventListener('click',()=>{
    const open=navList.classList.toggle('mobile-open');
    menuBtn.classList.toggle('open',open);
    menuBtn.setAttribute('aria-expanded',open?'true':'false');
    document.body.style.overflow=open?'hidden':'';
  });
  navList.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    navList.classList.remove('mobile-open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
  }));
  addEventListener('resize',()=>{
    if(innerWidth>880){
      navList.classList.remove('mobile-open');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded','false');
      document.body.style.overflow='';
    }
  });
}

// scroll progress + nav shrink
const prog=document.getElementById('progress'),nav=document.getElementById('nav');
const isSmallScreen=()=>innerWidth<=900;
let ticking=false;
function onScroll(){
  const h=document.documentElement;
  const p=h.scrollTop/(h.scrollHeight-h.clientHeight);
  prog.style.width=(p*100)+'%';
  nav.classList.toggle('tight',h.scrollTop>60);
  // hero parallax (skipped on small screens for smoother scrolling)
  const par=document.querySelector('[data-parallax]');
  if(par&&!isSmallScreen()&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    par.style.transform='translate3d(0,'+(h.scrollTop*parseFloat(par.dataset.parallax))+'px,0) scale(1.08)';
  }
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScroll);ticking=true}},{passive:true});
onScroll();

// reveals
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv,.stagger').forEach(el=>io.observe(el));

// counter
const counter=document.querySelector('[data-count]');
if(counter){
  const target=+counter.dataset.count;
  const cio=new IntersectionObserver(es=>{
    if(!es[0].isIntersecting)return;cio.disconnect();
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){counter.textContent='+'+target+'%';return}
    const t0=performance.now(),dur=1400;
    const step=t=>{const p=Math.min((t-t0)/dur,1);const eased=1-Math.pow(1-p,3);
      counter.textContent='+'+Math.round(target*eased)+'%';
      if(p<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);
  },{threshold:.5});
  cio.observe(counter);
}