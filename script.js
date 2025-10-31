// Consolidated, minimal script: animated background + 3-step flow
document.addEventListener('DOMContentLoaded', () => {
  // --- background canvas (subtle floating bubbles) ---
  const bg = document.createElement('canvas');
  bg.id = 'bg-canvas'; bg.className = 'bg-canvas';
  bg.style.position = 'fixed'; bg.style.left = '0'; bg.style.top = '0'; bg.style.width = '100%'; bg.style.height = '100%';
  bg.style.zIndex = '0'; bg.style.pointerEvents = 'none';
  document.body.appendChild(bg);
  const g = bg.getContext && bg.getContext('2d');
  function resizeBg(){ bg.width = window.innerWidth; bg.height = window.innerHeight; }
  window.addEventListener('resize', resizeBg); resizeBg();

  const particles = [];
  function spawn(){
    const r = 8 + Math.random()*34;
    particles.push({ x: Math.random()*bg.width, y: bg.height + r + Math.random()*200, r, vx:(Math.random()-0.5)*0.4, vy: - (0.3 + Math.random()*1.1), a: 0.06 + Math.random()*0.28, h: 320 + Math.random()*50 });
  }
  for (let i=0;i<18;i++) spawn();
  let st = 0;
  function drawBg(){ if (!g) return; g.clearRect(0,0,bg.width,bg.height);
    for (let i=particles.length-1;i>=0;i--){ const p = particles[i]; p.x += p.vx; p.y += p.vy; p.a *= 0.999; const grad = g.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r); grad.addColorStop(0, `hsla(${p.h},90%,85%,${Math.min(0.9,p.a)})`); grad.addColorStop(1, `hsla(${p.h},90%,70%,0)`); g.fillStyle = grad; g.beginPath(); g.arc(p.x,p.y,p.r,0,Math.PI*2); g.fill(); if (p.y + p.r < -50 || p.a < 0.01) particles.splice(i,1); }
    st += 1/60; if (st > 0.8){ spawn(); st = 0; }
    requestAnimationFrame(drawBg);
  }
  requestAnimationFrame(drawBg);

  // --- simple three-step flow ---
  const flow = document.getElementById('flow-step');
  const terminated = document.getElementById('terminated');
  if (!flow) return console.warn('No #flow-step found');
  let rionConfirmed = false;

  function showTerminated(){ if (terminated){ flow.classList.add('hidden'); terminated.classList.remove('hidden'); terminated.setAttribute('aria-hidden','false'); } }

  function step1(){
    if (rionConfirmed) return step2();
    flow.dataset.step = '1';
    flow.innerHTML = `
      <h3>Are you Adil Mohammad Rion?</h3>
      <p>Please confirm your identity to continue.</p>
      <div class="controls">
        <button id="yes1" class="btn btn-primary">Yes — I am Rion</button>
        <button id="no1" class="btn btn-ghost">No — I am not</button>
      </div>`;
    document.getElementById('yes1').addEventListener('click', ()=>{ rionConfirmed = true; step2(); });
    document.getElementById('no1').addEventListener('click', showTerminated);
  }

  function step2(){
    flow.dataset.step = '2';
    flow.innerHTML = '';
    const title = document.createElement('h3'); title.textContent = 'Biya kobe korben vaai?';
    const p = document.createElement('p'); p.textContent = 'Do you plan to marry?';
    const wrap = document.createElement('div'); wrap.className = 'controls'; wrap.style.position = 'relative'; wrap.style.height = '70px';
    const yes = document.createElement('button'); yes.className='btn btn-primary'; yes.textContent='Yes — I will';
    const no = document.createElement('button'); no.className='btn btn-ghost'; no.textContent='No — not now';
    no.style.position='absolute'; no.style.left='60%'; no.style.top='12px'; no.setAttribute('tabindex','-1');
    wrap.appendChild(yes); wrap.appendChild(no);
    flow.appendChild(title); flow.appendChild(p); flow.appendChild(wrap);
    yes.addEventListener('click', ()=>{ step3(); });
    function moveNo(){ const rect = wrap.getBoundingClientRect(); const btnRect = no.getBoundingClientRect(); const margin = 8; const maxX = Math.max(0, rect.width - btnRect.width - margin); const maxY = Math.max(0, rect.height - btnRect.height - margin); const x = Math.floor(Math.random() * maxX); const y = Math.floor(Math.random() * maxY); no.style.left = x + 'px'; no.style.top = y + 'px'; }
    no.addEventListener('mouseenter', moveNo); no.addEventListener('touchstart', (e)=>{ e.preventDefault(); moveNo(); }, {passive:false}); no.addEventListener('click', (e)=>{ e.preventDefault(); moveNo(); });
  }

  function step3(){
    flow.dataset.step = '3';
    flow.innerHTML = `
      <h3>Date ta boilla jan, dawat khete ashbo</h3>
      <p>Please pick a date and add a short note (optional).</p>
      <div style="margin-top:12px;text-align:center">
        <input id="dateInput" type="date" style="padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.06)">
      </div>
      <div style="margin-top:10px">
        <textarea id="noteInput" placeholder="Optional note" style="width:100%;min-height:80px;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.06)"></textarea>
      </div>
      <div class="controls" style="margin-top:12px">
        <button id="submitDate" class="btn btn-primary">Submit Date</button>
        <button id="cancelDate" class="btn btn-ghost">Cancel</button>
      </div>`;
    setTimeout(()=>{ document.getElementById('dateInput')?.focus(); }, 80);
    document.getElementById('submitDate').addEventListener('click', ()=>{
      const d = document.getElementById('dateInput').value;
      const note = document.getElementById('noteInput').value.trim();
      if (!d){ alert('Please choose a date'); return; }
      flow.innerHTML = `<p>Thanks — date submitted: <strong>${d}</strong>${note? ' — '+note : ''}</p>`;
      smallConfetti();
    });
    document.getElementById('cancelDate').addEventListener('click', ()=>{ if (rionConfirmed){ flow.innerHTML = `<p>You confirmed already — cannot go back.</p>`; } else step2(); });
  }

  function smallConfetti(){
    const c = document.createElement('canvas'); c.style.position='fixed'; c.style.left='0'; c.style.top='0'; c.style.width='100%'; c.style.height='100%'; c.style.pointerEvents='none'; c.style.zIndex=999; document.body.appendChild(c);
    const cx = c.getContext('2d'); c.width = window.innerWidth; c.height = window.innerHeight; const parts = []; const colors = ['#ff4f81','#ff7ba3','#ffd1d9','#fff176','#90caf9'];
    for (let i=0;i<80;i++){ parts.push({x:Math.random()*c.width,y:Math.random()*c.height/2, vx:(Math.random()-0.5)*6, vy:Math.random()*6+2, r:Math.random()*6+4, color:colors[Math.floor(Math.random()*colors.length)], rot:Math.random()*360}); }
    let t=120; function frame(){ cx.clearRect(0,0,c.width,c.height); parts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=0.08; cx.save(); cx.translate(p.x,p.y); cx.rotate(p.rot*Math.PI/180); cx.fillStyle=p.color; cx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6); cx.restore(); }); t--; if (t>0) requestAnimationFrame(frame); else { cx.clearRect(0,0,c.width,c.height); c.remove(); }} requestAnimationFrame(frame);
  }

  // start
  step1();
});
