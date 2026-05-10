/* ============================================================
   HALFTONE DOT PHOTO EFFECT
============================================================ */
function renderDots(imgEl, canvas, dotSize, gap, tintR, tintG, tintB) {
  const W = canvas.offsetWidth  || 500;
  const H = canvas.offsetHeight || 650;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Draw image to offscreen canvas once
  const off = document.createElement('canvas');
  off.width = W; off.height = H;
  const octx = off.getContext('2d');

  const iw = imgEl.naturalWidth  || imgEl.width  || W;
  const ih = imgEl.naturalHeight || imgEl.height || H;
  const scale = Math.max(W / iw, H / ih);
  const sw = iw * scale, sh = ih * scale;
  octx.drawImage(imgEl, (W - sw) / 2, (H - sh) / 2, sw, sh);

  // ONE getImageData call for the entire canvas — no per-pixel GPU readbacks
  const imageData = octx.getImageData(0, 0, W, H).data;

  const step = dotSize + gap;
  ctx.clearRect(0, 0, W, H);

  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const px = x + Math.floor(step / 2);
      const py = y + Math.floor(step / 2);

      // Index directly into the flat pixel buffer: (row * width + col) * 4
      const i = (py * W + px) * 4;
      const r0 = imageData[i], g0 = imageData[i+1], b0 = imageData[i+2];

      const lum = (r0 * 0.299 + g0 * 0.587 + b0 * 0.114) / 255;
      const radius = lum * dotSize * 0.9;
      if (radius < 0.5) continue;

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.round(r0*0.2 + tintR*0.8)},${Math.round(g0*0.2 + tintG*0.8)},${Math.round(b0*0.2 + tintB*0.8)},${0.55 + lum * 0.45})`;
      ctx.fill();
    }
  }
}

// hero halftone removed — video covers that section entirely

// setupAbout is defined below with CORS fallback logic

window.addEventListener('load', () => { setupAbout(); });

// Debounced resize — halftone re-render is expensive, don't fire mid-drag
let _resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => { setupAbout(); }, 250);
}, { passive: true });

/* ============================================================
   TERMINAL LOGIC
============================================================ */
const tout = document.getElementById('tout');
const tinp = document.getElementById('tinput');
const PR   = `<span class="tplbl">guest@dara:~ $</span>`;

const DECK = [
  {
    title: "VII · The Chariot",
    icon:  "&#x2694;&#xfe0f;",
    desc:  "Your card. Willpower, focus, victory against all resistance. Drive forward.",
    kw:   "momentum, control, will"
  },
  {
    title: "II · The High Priestess",
    icon:  "&#x1f319;",
    desc:  "Intuition and mystery. The knowledge beneath the data. Trust your inner knowing.",
    kw:   "secret, intuition, depth"
  },
  {
    title: "IX · The Hermit",
    icon:  "&#x1f56f;&#xfe0f;",
    desc:  "Solitary seeking. The guiding light of logic in the dark.",
    kw:   "introspection, logic, solitude"
  },
  {
    title: "XVII · The Star",
    icon:  "&#x2728;",
    desc:  "After the vulnerability, hope and clarity. Renewal and alignment.",
    kw:   "hope, serenity, alignment"
  }
];

const CMDS = {
  help: () => [
    `<span class="tam">Available Commands:</span>`,
    `> whois dara            // profile & philosophy`,
    `> ls projects/          // list all work`,
    `> cat projects/pentest  // security deep dive`,
    `> skills --list         // full tech stack`,
    `> ctf --show            // CTF achievements`,
    `> tarot --pull          // draw a card v2.0`,
    `> sudo hire dara        // [elevated] protocol`,
    `> info                  // system status`,
    `> clear                 // clear terminal`
  ],

  'whois dara': () => [
    `<span class="tam">WHOIS // DARA.CHRISCEN</span>`,
    `<span class="tb">Name:</span>         Dara Chriscen`,
    `<span class="tb">Role:</span>         CS Undergrad // Cybersecurity Enthusiast`,
    `<span class="tb">Focus:</span>        Software Security, Network Forensics, Secure Programming`,
    `<span class="tb">Location:</span>     Jakarta, Indonesia`,
    `<span class="tb">Contact:</span>      darachriscen@gmail.com`,
    `<span class="tb">GitHub:</span>       github.com/levixcen`,
    `<span class="tb">Tarot:</span>        <span class="tg">VII.The_Chariot</span>`
  ],

  'ls projects/': () => [
    `<span class="tb">drwxr-xr-x  projects/</span>`,
    `> pentest/       // Jackal Holidays Mobile Assessment`,
    `> sast-dast/     // Security Scanning Website`,
    `> network/       // Cisco Campus Network Design`,
    `> database/      // ER Diagram & SQL Modeling`,
    `> ai/            // Fish Identifier (Computer Vision)`,
    `> research/      // Federated Learning Z-Score IDS`,
    `> risk/          // Chat App Security Risk Analysis`,
    `> ctf/           // picoCTF Writeups`,
    `> event/         // IT Division Evocation 2025`
  ],

  'cat projects/pentest': () => [
    `<span class="tam">cat projects/pentest</span>`,
    `<span class="tb">Project:</span>   Jackal Holidays Mobile App Security Assessment`,
    `<span class="tb">Type:</span>      Mobile Penetration Test`,
    `<span class="tb">Tools:</span>     Kali Linux, Burp Suite`,
    `<span class="tb">Scope:</span>     Android APK + API layer`,
    `<span class="tb">Findings:</span>  Insecure data storage, improper session mgmt, API exposure`,
    `<span class="tb">Output:</span>    Full pentest report + remediation roadmap`
  ],

  'skills --list': () => [
    `<span class="tam">CAPABILITY_MATRIX // DARA.CHRISCEN</span>`,
    `<span class="tb">Languages:</span>   Python, Bash, C++, JavaScript, SQL, Java, HTML/CSS`,
    `<span class="tb">OS:</span>          Kali Linux, Ubuntu, Windows Server, macOS, VMware`,
    `<span class="tb">Tools:</span>       Wireshark, Burp Suite, FTK Imager, Cisco PT, Docker`,
    `<span class="tb">Concepts:</span>    Forensics, Penetration Testing, Blockchain, Software Security`
  ],

  'ctf --show': () => [
    `<span class="tam">CTF // ACHIEVEMENTS</span>`,
    `<span class="tg">&#x2713;</span> picoCTF participant — multiple challenge solves`,
    `<span class="tg">&#x2713;</span> Categories: Cryptography, Web Exploitation, Rev Eng, Forensics`,
    `<span class="tg">&#x2713;</span> Tools used: Kali, Ghidra, Wireshark`,
    `<span class="tg">&#x2713;</span> Writeups documented for knowledge transfer`
  ],

  'sudo hire dara': () => [
    `<span class="tb">[sudo] password for guest:</span> ***`,
    `<span class="tg">&#x2713; Authentication successful</span>`,
    `<span class="tam">Initiating hire protocol...</span>`,
    `Email:    darachriscen@gmail.com`,
    `LinkedIn: linkedin.com/in/dara-chriscen`,
    `GitHub:   github.com/levixcen`,
    `<span class="tg">Access granted. She will answer.</span>`
  ],

  'tarot --pull': () => {
    const card = DECK[Math.floor(Math.random() * DECK.length)];
    return [
      `<span class="tam">Initiating Tarot Draw Protocol v2.0...</span>`,
      `<span class="tg">&#x2713; Connecting to Intuition Subnet...</span>`,
      `<span class="tg">&#x2713; Shuffling Deck...</span>`,
      `Card drawn: <span class="tb">${card.title}</span>`,
      ``,
      `<div class="tarot-visual">
        <div class="tarot-card" onclick="this.classList.toggle('flipped')">
          <div class="card-face card-back">
            <div class="card-back-icon">?</div>
            <div class="card-back-text">tap<br/>to<br/>reveal</div>
          </div>
          <div class="card-face card-front">
            <div class="card-title">${card.title}</div>
            <div class="card-icon">${card.icon}</div>
            <div class="card-desc">${card.desc}</div>
            <div class="card-kw">[${card.kw}]</div>
          </div>
        </div>
        <div style="font-family:var(--f-body);font-size:12px;color:#777;align-self:center;max-width:160px;">Tap the card to reveal the reading.</div>
      </div>`,
      `<span style="color:rgba(157,0,255,0.45)">// type clear to reset session //</span>`
    ];
  },

  info: () => [
    `Terminal://Tarot v2.01 // Y2K_Cyber_Aesthetic`,
    `// Chariot // Jakarta_DC //`
  ],

  clear: () => { tout.innerHTML = ''; return []; }
};



function addLine(html) {
  const d = document.createElement('div');
  d.className = 'tl';
  d.innerHTML = html;
  tout.appendChild(d);
  tout.scrollTop = tout.scrollHeight;
}

tinp.addEventListener('keypress', e => {
  if (e.key !== 'Enter') return;
  const cmd = tinp.value.trim();
  tinp.value = '';
  addLine(`${PR} <span class="tc">${cmd}</span>`);
  if (!cmd) return;
  const fn = CMDS[cmd.toLowerCase()];
  if (fn) {
    const out = fn();
    if (out && out.length) out.forEach(l => addLine(l));
  } else {
    addLine(`<span style="color:var(--red)">bash: ${cmd}: command not found // Type 'help'</span>`);
  }
});

document.getElementById('terminal').addEventListener('click', () => tinp.focus());

// Navigation Fade-in Logic — RAF throttled
const _nav = document.querySelector('nav');
const _heroEl = document.getElementById('home');
let _navRaf = false;
window.addEventListener('scroll', () => {
  if (_navRaf) return;
  _navRaf = true;
  requestAnimationFrame(() => {
    _navRaf = false;
    if (window.scrollY > _heroEl.offsetHeight * 0.3) {
      _nav.classList.add('visible');
    } else {
      _nav.classList.remove('visible');
    }
  });
}, { passive: true });

// Halftone canvas for About section
// Photo shows by default; canvas draws on top if CORS allows it
function setupAbout() {
  const img = document.getElementById('aboutImg');
  const canvas = document.getElementById('aboutDotCanvas');
  if (!canvas) return;
  const frame = canvas.parentElement;

  function draw() {
    // Display size matches CSS width (260px), internal resolution 2x for sharpness
    const DISPLAY = 260;
    const DPR = 2;
    const W = DISPLAY * DPR;
    const H = Math.round(W * 1.25);
    canvas.width  = W;
    canvas.height = H;
    canvas.style.width  = DISPLAY + 'px';
    canvas.style.height = Math.round(DISPLAY * 1.25) + 'px';
    const ctx = canvas.getContext('2d');

    // Draw image cropped to upper 75% (face area) on offscreen canvas
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const octx = off.getContext('2d');
    const iw = img.naturalWidth  || W;
    const ih = img.naturalHeight || H;
    // Crop: use top 80% of image to focus on face, scale to fill
    const srcH = ih * 0.80;
    const srcScale = Math.max(W / iw, H / srcH);
    const sw = iw * srcScale, sh = srcH * srcScale;
    octx.drawImage(img, 0, 0, iw, srcH, (W - sw) / 2, (H - sh) / 2, sw, sh);

    const data = octx.getImageData(0, 0, W, H).data;

    // Dot size: 3px display = 6px at 2x DPR, gap 2px display = 4px at 2x
    const DOT = 3, GAP = 2, STEP = DOT + GAP;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#050008';
    ctx.fillRect(0, 0, W, H);

    for (let y = 0; y < H; y += STEP) {
      for (let x = 0; x < W; x += STEP) {
        const px = x + Math.floor(STEP / 2);
        const py = y + Math.floor(STEP / 2);
        if (px >= W || py >= H) continue;
        const i = (py * W + px) * 4;
        const r0 = data[i], g0 = data[i+1], b0 = data[i+2];
        const lum = (r0 * 0.299 + g0 * 0.587 + b0 * 0.114) / 255;
        const radius = (0.3 + lum * 0.7) * (DOT / 2);
        if (radius < 0.3) continue;

        // Black and white dots
        const bw = Math.round(255 * lum);
        const a = 0.75 + lum * 0.25;

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${bw},${bw},${bw},${a})`;
        ctx.fill();
      }
    }
  }

  if (img.complete && img.naturalWidth > 0) draw();
  else img.onload = draw;
}