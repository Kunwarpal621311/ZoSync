/* ── LERP ── */
const lerp=(a,b,t)=>a+(b-a)*t;

/* ── CUSTOM CURSOR ── */
const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
if(window.innerWidth>1024){
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    cur.style.left=mx+'px';cur.style.top=my+'px';
  });
  (function rLoop(){
    rx=lerp(rx,mx,.12);ry=lerp(ry,my,.12);
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(rLoop);
  })();
  document.querySelectorAll('a,button,.svc-card,.acard,.tcard,.chip,.ind-card,.pstep').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.style.width='5px';cur.style.height='5px';ring.style.width='56px';ring.style.height='56px';ring.style.borderColor='rgba(232,51,58,.6)'});
    el.addEventListener('mouseleave',()=>{cur.style.width='12px';cur.style.height='12px';ring.style.width='40px';ring.style.height='40px';ring.style.borderColor='rgba(232,51,58,.4)'});
  });
}

/* ── SCROLL: PROGRESS + NAV ── */
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  document.getElementById('prog').style.width=(window.scrollY/h*100)+'%';
  document.getElementById('nav').classList.toggle('scrolled',window.scrollY>50);
},{ passive:true });

/* ── HAMBURGER / DRAWER ── */
const burger=document.getElementById('burger');
const drawer=document.getElementById('navDrawer');
burger.addEventListener('click',()=>{
  burger.classList.toggle('open');
  drawer.classList.toggle('open');
  document.body.style.overflow=drawer.classList.contains('open')?'hidden':'';
});
document.querySelectorAll('.drawer-link').forEach(a=>{
  a.addEventListener('click',()=>{
    burger.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow='';
  });
});

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    const t=document.querySelector(this.getAttribute('href'));
    if(t){
      e.preventDefault();
      window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-64,behavior:'smooth'});
    }
  });
});

/* ── PARTICLES ── */
const pc=document.getElementById('particles');
for(let i=0;i<16;i++){
  const p=document.createElement('div');
  p.className='particle';
  const s=(Math.random()*3+2)+'px';
  const dur=(Math.random()*12+8);
  p.style.cssText=`left:${Math.random()*100}%;width:${s};height:${s};animation-duration:${dur}s;animation-delay:-${Math.random()*dur}s`;
  pc.appendChild(p);
}

/* ── MOUSE PARALLAX (hero orbs, desktop only) ── */
if(window.innerWidth>1024){
  document.addEventListener('mousemove',e=>{
    const x=(e.clientX/innerWidth-.5)*18,y=(e.clientY/innerHeight-.5)*18;
    const o1=document.querySelector('.o1'),o2=document.querySelector('.o2'),o3=document.querySelector('.o3');
    if(o1)o1.style.transform=`translate(${x*1.2}px,${y*1.2}px)`;
    if(o2)o2.style.transform=`translate(${-x*.8}px,${-y*.8}px)`;
    if(o3)o3.style.transform=`translate(${x*.5}px,${y*.5}px)`;
  });
}

/* ── SCROLL PARALLAX (hero grid) ── */
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  const g=document.querySelector('.hero-grid');
  const b=document.querySelector('.hero-bg');
  if(g)g.style.transform=`translateY(${y*.25}px)`;
  if(b)b.style.transform=`translateY(${y*.12}px)`;
},{ passive:true });

/* ── INTERSECTION OBSERVER ── */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target)}});
},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal,.stag').forEach(el=>obs.observe(el));

/* ── COUNTER ANIMATION ── */
const cobs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){animCount(e.target);cobs.unobserve(e.target)}});
},{threshold:.4});
document.querySelectorAll('[data-count]').forEach(el=>cobs.observe(el));
function animCount(el){
  const target=+el.dataset.count;
  const suf=el.querySelector('span')?el.querySelector('span').outerHTML:'';
  let start=null;
  const step=ts=>{
    if(!start)start=ts;
    const p=Math.min((ts-start)/1600,1);
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
      c.style.animation='acIn .35s ease both';
      d+=20;
    } else {
      c.classList.add('hidden');
    }
  });
}

/* ── FORM ── */
async function submitForm(){
  const f=document.getElementById('fname').value.trim();
  const l=document.getElementById('lname').value.trim();
  const em=document.getElementById('email').value.trim();
  const msg=document.getElementById('message').value.trim();
  const phone=document.getElementById('phone').value.trim();
  const svc=document.getElementById('service').value;
  const ind=document.getElementById('industry').value;

  if(!f||!em||!msg){showToast('Please fill in Name, Email & Message.','⚠️','#c0392b');return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){showToast('Please enter a valid email address.','⚠️','#c0392b');return}
  showToast("Message sent! I'll be in touch within 4–6 hours.",'✅','#1a1a1a');
  ['fname','lname','email','phone','message'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('service').selectedIndex=0;
  document.getElementById('industry').selectedIndex=0;


  const body = `Name: ${f} ${l}
Email: ${em}
Phone: ${phone}
Service: ${svc}
Industry: ${ind}

Message
${msg}
  ---`;

  const emailData = {
        receiverEmail: "atulroy028@gmail.com",
        subject: "New Contact Form Submission from " + f,
        message: body
    };

    try {
        // Pointing to your local Node.js server
        const response = await fetch('https://zosync-backend-ecxcjq90v-kunwarpal621311s-projects.vercel.app/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Email sent successfully:', result);
        } else {
            console.error('Error sending email:', result.error);
            // statusDiv.style.color = "red";
        }

    } catch (error) {
        console.error('Fetch Error:', error);
       
    }

}
function showToast(msg,icon,bg){
  const t=document.getElementById('toast');
  document.getElementById('tmsg').textContent=msg;
  document.getElementById('ticon').textContent=icon;
  t.style.background=bg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),4500);
}