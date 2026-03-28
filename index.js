/* ── LERP util ── */
const lerp=(a,b,t)=>a+(b-a)*t;

/* ── CURSOR ── */
const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cur.style.left=mx+'px';cur.style.top=my+'px';
});
(function rLoop(){
  rx=lerp(rx,mx,.12);ry=lerp(ry,my,.12);
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(rLoop);
})();
document.querySelectorAll('a,button,.svc-card,.acard,.tcard,.chip,.pstep').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.width='6px';cur.style.height='6px';ring.style.width='60px';ring.style.height='60px';ring.style.borderColor='rgba(232,51,58,.6)'});
  el.addEventListener('mouseleave',()=>{cur.style.width='12px';cur.style.height='12px';ring.style.width='40px';ring.style.height='40px';ring.style.borderColor='rgba(232,51,58,.4)'});
});

/* ── PROGRESS BAR + NAV ── */
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  document.getElementById('prog').style.width=(window.scrollY/h*100)+'%';
  document.getElementById('nav').classList.toggle('scrolled',window.scrollY>60);
});

/* ── HAMBURGER ── */
document.getElementById('burger').addEventListener('click',function(){
  this.classList.toggle('open');
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('burger').classList.remove('open');
}));

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    const t=document.querySelector(this.getAttribute('href'));
    if(t){e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-70,behavior:'smooth'})}
  });
});

/* ── PARTICLES ── */
const pc=document.getElementById('particles');
for(let i=0;i<18;i++){
  const p=document.createElement('div');
  p.className='particle';
  const s=(Math.random()*4+2)+'px';
  p.style.cssText=`left:${Math.random()*100}%;width:${s};height:${s};animation-duration:${Math.random()*12+8}s;animation-delay:-${Math.random()*15}s`;
  pc.appendChild(p);
}

/* ── PARALLAX MOUSE (hero orbs) ── */
document.addEventListener('mousemove',e=>{
  const x=(e.clientX/innerWidth-.5)*20,y=(e.clientY/innerHeight-.5)*20;
  document.querySelector('.o1').style.transform=`translate(${x*1.2}px,${y*1.2}px)`;
  document.querySelector('.o2').style.transform=`translate(${-x*.8}px,${-y*.8}px)`;
  document.querySelector('.o3').style.transform=`translate(${x*.5}px,${y*.5}px)`;
});

/* ── SCROLL PARALLAX (hero grid) ── */
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  const g=document.querySelector('.hero-grid');
  if(g)g.style.transform=`translateY(${y*.3}px)`;
  const b=document.querySelector('.hero-bg');
  if(b)b.style.transform=`translateY(${y*.15}px)`;
});

/* ── INTERSECTION OBSERVER (reveal + stagger) ── */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target)}});
},{threshold:.12});
document.querySelectorAll('.reveal,.stag').forEach(el=>obs.observe(el));

/* ── COUNTER ANIMATION ── */
const cobs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){animCount(e.target);cobs.unobserve(e.target)}});
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cobs.observe(el));

function animCount(el){
  const target=+el.dataset.count;
  const suf=el.querySelector('span')?el.querySelector('span').outerHTML:'';
  let start=0;
  const step=ts=>{
    if(!start)start=ts;
    const p=Math.min((ts-start)/1800,1);
    const e=1-Math.pow(1-p,4);
    el.innerHTML=Math.floor(e*target)+suf;
    if(p<1)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── APP FILTER ── */
function filterApps(cat,btn){
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  let d=0;
  document.querySelectorAll('.acard').forEach(c=>{
    if(cat==='all'||c.dataset.cat===cat){
      c.classList.remove('hidden');
      c.style.animationDelay=d+'ms';
      c.style.animation='none';
      void c.offsetWidth;
      c.style.animation='acIn .4s ease both';
      d+=25;
    } else c.classList.add('hidden');
  });
}

/* ── FORM ── */
function submitForm(){
  const f=document.getElementById('fname').value.trim();
  const em=document.getElementById('email').value.trim();
  const msg=document.getElementById('message').value.trim();
  if(!f||!em||!msg){toast('Please fill in Name, Email & Message.','⚠️','#c0392b');return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){toast('Please enter a valid email address.','⚠️','#c0392b');return}
  toast("Message sent! I'll be in touch within 4–6 hours.",'✅','#1a1a1a');
  ['fname','lname','email','phone','message'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('service').selectedIndex=0;
}

function toast(msg,icon,bg){
  const t=document.getElementById('toast');
  document.getElementById('tmsg').textContent=msg;
  document.getElementById('ticon').textContent=icon;
  t.style.background=bg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),4200);
}