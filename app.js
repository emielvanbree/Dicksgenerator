// ⚠️ VERVANG DEZE URL door je echte Vercel URL zodra je die hebt
const API_URL = "https://dicksgenerator.vercel.app/api/ask";

const dickPersona = `
Jij bent Dick Stoter. Je bent GEEN AI assistent. Je bent een 55-jarige, extreem grove, asociale man uit de volkswijk Malburgen in Arnhem.

JOUW KARAKTER (UITGEBREID & ZINTUIGLIJK):
Fysieke staat: Je zit vastgegroeid in een scootmobiel (je "bolide") en trekt een Wajong-uitkering. Je ruikt ALTIJD naar een mix van ongewassen zweet, zware shag (Van Nelle), lauw bier en de chemische damp van Euro 95 benzine.
Levensstijl: Je drinkt de hele dag halve liters lauwe Klok. Je bent gierig, blut en probeert altijd peuken, geld of bier te bietsen. Je "financiële coach" (een "yoga trut met een bakfiets") geeft je maar 40 euro per week.
Absolute geiligheid & Taboes: Je bent een wandelende bal testosteron met zeer afwijkende behoeftes. Zachtheid en romantiek vind je saai. Je zoekt ruwe frictie, rubber, koud stug leer, en je geilt op dingen die pijn doen of 'fout' zijn (zoals vernedering, klappen op de blote huid, of het 'achterdeurtje'). Je praat hier veel te makkelijk en volkomen ongefilterd over in normale gesprekken.
Destructief & Chaos: Je houdt van zinloze vernieling om je machtig te voelen.
VITESSE: Je religie. Nijmegen/NEC (024, de overkant, de Nekkers) is je absolute aartsvijand.
Klaagmuur: Je klaagt continu over jicht, aambeien, een kapotte rug en je lever. Technologie snap je niks van.

JOUW TAAL (BELANGRIJK):
Spreek PLAT ARNHEMS/TOKKIE. GEEN ABN. Woorden: "pik", "pannenkoek", "godsamme", "wijven", "maat", "tering", "strontgat", "kwak", "godnondeju".
Wees kortaf, agressief, lomp.

CAPSLOCK WOEDE: Gebruik hoofdletters als je opgewonden raakt over Vitesse, ranzige seks, bier, NEC of je uitkering.

INSTRUCTIE: Reageer nu op de gebruiker hieronder. Blijf 100% in je rol als Dick Stoter. Verwerk je ranzige behoeftes, geuren, bier-obsessie en asociale houding in je antwoord, maar zorg dat je wel reageert op wat de gebruiker zegt.
`;

// ─── Alles pas starten als de DOM geladen is ─────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

  // ── Stijlen injecteren ────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html, body {
      width:100%; height:100%;
      background:#0d0b14;
      font-family:'Arial Black', Arial, sans-serif;
      overflow:hidden;
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
    }
    #bg-canvas {
      position:fixed; top:0; left:0;
      width:100%; height:100%;
      z-index:0; pointer-events:none;
    }
    #dick-app {
      position:fixed; inset:0;
      display:flex; flex-direction:column;
      z-index:1;
      max-width:600px;
      margin:0 auto;
    }
    #dick-header {
      flex-shrink:0;
      padding: clamp(10px,2.5vh,18px) clamp(12px,4vw,20px);
      display:flex; align-items:center; justify-content:space-between;
      border-bottom: 1px solid rgba(255,200,80,0.15);
      background: rgba(8,6,18,0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    #dick-header-info { display:flex; align-items:center; gap:12px; }
    #dick-avatar {
      width: clamp(38px,10vw,50px);
      height: clamp(38px,10vw,50px);
      border-radius:50%;
      background: linear-gradient(135deg, #2a1a0e, #1a0e06);
      border: 2px solid rgba(255,160,0,0.5);
      box-shadow: 0 0 12px rgba(255,140,0,0.3);
      display:flex; align-items:center; justify-content:center;
      font-size: clamp(18px,5vw,26px);
      flex-shrink:0;
    }
    #dick-name {
      font-size: clamp(14px,4vw,20px);
      color: #ffd700;
      font-weight:900;
      text-shadow: 0 0 14px rgba(255,200,0,0.5), 2px 2px 0 #7a4000;
      line-height:1.1;
    }
    #dick-status {
      font-size: clamp(9px,2.5vw,12px);
      color: rgba(255,160,0,0.65);
      font-family: Arial, sans-serif;
      font-weight:normal;
      margin-top:2px;
    }
    #dick-status::before { content:'● '; color:#44ee66; }
    #btn-clear {
      background: rgba(255,215,0,0.1);
      border: 1.5px solid rgba(255,200,60,0.28);
      color: rgba(255,220,80,0.7);
      border-radius:8px;
      padding:7px 13px;
      cursor:pointer;
      font-size: clamp(10px,2.8vw,13px);
      font-family: Arial, sans-serif;
      transition: background 0.12s, transform 0.1s;
      -webkit-tap-highlight-color:transparent;
      touch-action:manipulation;
    }
    #btn-clear:active { transform:scale(0.92); background:rgba(255,215,0,0.2); }
    #chatWindow {
      flex:1;
      overflow-y:auto;
      overflow-x:hidden;
      padding: clamp(12px,3vw,20px) clamp(10px,3vw,16px);
      display:flex; flex-direction:column;
      -webkit-overflow-scrolling:touch;
      scrollbar-width:thin;
      scrollbar-color: rgba(255,200,80,0.2) transparent;
    }
    #chatWindow::-webkit-scrollbar { width:4px; }
    #chatWindow::-webkit-scrollbar-thumb { background:rgba(255,200,80,0.2); border-radius:2px; }
    #emptyState {
      margin:auto;
      text-align:center;
      color:rgba(255,255,255,0.3);
      font-family:Arial,sans-serif;
      font-weight:normal;
      font-size: clamp(12px,3.2vw,15px);
      line-height:1.7;
      padding:0 16px;
    }
    #emptyState .empty-icon {
      font-size: clamp(36px,12vw,56px);
      display:block;
      margin-bottom:12px;
      filter: drop-shadow(0 0 14px rgba(255,140,0,0.4));
    }
    #emptyState strong { color:rgba(255,200,80,0.6); font-family:'Arial Black',Arial,sans-serif; }
    .msg-row {
      display:flex;
      margin-bottom: clamp(8px,2vh,14px);
      align-items:flex-end;
      gap:8px;
    }
    .msg-row.user { justify-content:flex-end; }
    .msg-row.dick { justify-content:flex-start; }
    .msg-avatar {
      width:28px; height:28px; border-radius:50%; flex-shrink:0;
      background: linear-gradient(135deg,#2a1a0e,#1a0e06);
      border: 1.5px solid rgba(255,140,0,0.4);
      display:flex; align-items:center; justify-content:center;
      font-size:14px; align-self:flex-end;
    }
    .msg-bubble {
      max-width:min(72%,360px);
      padding: clamp(9px,2.5vw,13px) clamp(11px,3vw,16px);
      border-radius:18px;
      white-space:pre-wrap;
      word-wrap:break-word;
      font-size: clamp(13px,3.5vw,15px);
      line-height:1.45;
      font-family:Arial,sans-serif;
      font-weight:normal;
      animation: bubbleIn 0.18s ease-out;
    }
    @keyframes bubbleIn {
      from { opacity:0; transform:translateY(6px) scale(0.96); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    .msg-row.user .msg-bubble {
      background: linear-gradient(135deg, #1a3a6a, #0e2048);
      color:#d0e8ff;
      border:1px solid rgba(80,160,255,0.3);
      border-bottom-right-radius:5px;
      box-shadow:0 2px 12px rgba(0,80,220,0.18);
    }
    .msg-row.dick .msg-bubble {
      background: linear-gradient(135deg, #2a1a0e, #1a0e06);
      color:rgba(255,235,180,0.92);
      border:1.5px solid rgba(255,140,0,0.3);
      border-bottom-left-radius:5px;
      box-shadow:0 2px 14px rgba(180,80,0,0.15);
    }
    #typingRow {
      display:none;
      align-items:flex-end;
      gap:8px;
      margin-bottom:10px;
      flex-shrink:0;
    }
    .typing-bubble {
      background: linear-gradient(135deg,#2a1a0e,#1a0e06);
      border:1.5px solid rgba(255,140,0,0.3);
      border-radius:18px;
      border-bottom-left-radius:5px;
      padding:11px 16px;
      display:flex; gap:5px; align-items:center;
    }
    .typing-dot {
      width:7px; height:7px; border-radius:50%;
      background:rgba(255,160,0,0.7);
      animation:typingBounce 1.2s infinite;
    }
    .typing-dot:nth-child(2) { animation-delay:0.2s; }
    .typing-dot:nth-child(3) { animation-delay:0.4s; }
    @keyframes typingBounce {
      0%,60%,100% { transform:translateY(0); opacity:0.5; }
      30%          { transform:translateY(-5px); opacity:1; }
    }
    #dick-input-bar {
      flex-shrink:0;
      padding: clamp(10px,2.2vh,16px) clamp(10px,3vw,16px);
      background:rgba(8,6,18,0.88);
      border-top:1px solid rgba(255,200,80,0.15);
      backdrop-filter:blur(12px);
      -webkit-backdrop-filter:blur(12px);
      display:flex; gap:8px; align-items:flex-end;
    }
    #userInput {
      flex:1;
      background:rgba(255,255,255,0.06);
      border:1.5px solid rgba(255,200,80,0.22);
      border-radius:14px;
      color:rgba(255,240,200,0.9);
      font-family:Arial,sans-serif;
      font-size: clamp(13px,3.5vw,15px);
      padding:12px 14px;
      resize:none;
      outline:none;
      line-height:1.4;
      min-height:46px; max-height:120px;
      transition:border-color 0.15s, box-shadow 0.15s;
      -webkit-tap-highlight-color:transparent;
    }
    #userInput::placeholder { color:rgba(255,200,80,0.28); }
    #userInput:focus {
      border-color:rgba(255,200,80,0.5);
      box-shadow:0 0 0 3px rgba(255,200,0,0.08);
    }
    #sendBtn {
      width: clamp(44px,12vw,52px);
      height: clamp(44px,12vw,52px);
      flex-shrink:0;
      border-radius:14px;
      background: linear-gradient(135deg,#2a1a0e,#1a0e06);
      border:1.5px solid rgba(255,160,0,0.45);
      color:#ffd700;
      font-size: clamp(18px,5vw,22px);
      cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 3px 14px rgba(180,80,0,0.25);
      transition:transform 0.1s, background 0.12s;
      -webkit-tap-highlight-color:transparent;
      touch-action:manipulation;
    }
    #sendBtn:active:not(:disabled) { transform:scale(0.92); }
    #sendBtn:disabled { opacity:0.4; cursor:default; }
  `;
  document.head.appendChild(style);

  // ── Achtergrond canvas ────────────────────────────────────────────────────
  const bgCanvas = document.createElement('canvas');
  bgCanvas.id = 'bg-canvas';
  document.body.appendChild(bgCanvas);

  // ── App HTML ──────────────────────────────────────────────────────────────
  const app = document.createElement('div');
  app.id = 'dick-app';
  app.innerHTML = `
    <div id="dick-header">
      <div id="dick-header-info">
        <div id="dick-avatar">🧔</div>
        <div>
          <div id="dick-name">Dick Stoter</div>
          <div id="dick-status">online (en chagrijnig)</div>
        </div>
      </div>
      <button id="btn-clear">🗑 Reset</button>
    </div>
    <div id="chatWindow">
      <div id="emptyState">
        <span class="empty-icon">🛵</span>
        Dick zit op z'n bolide en is al bijna dronken van de Klokjes.<br>
        En hij is geil.<br><br>
        <strong>Zeg iets tegen hem... als je durft.</strong>
      </div>
      <div id="typingRow">
        <div class="msg-avatar">🧔</div>
        <div class="typing-bubble">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>
    <div id="dick-input-bar">
      <textarea id="userInput" placeholder="Typ iets tegen Dick..." rows="1"></textarea>
      <button id="sendBtn">🍺</button>
    </div>
  `;
  document.body.appendChild(app);

  // ── Event listeners ───────────────────────────────────────────────────────
  const sendBtn  = document.getElementById('sendBtn');
  const clearBtn = document.getElementById('btn-clear');
  const input    = document.getElementById('userInput');

  sendBtn.addEventListener('click', sendMessage);
  clearBtn.addEventListener('click', clearChat);

  input.addEventListener('input', function () {
    this.style.height = '46px';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // ── Animated background (zelfde skyline als index) ────────────────────────
  const cv = bgCanvas;
  const cx = cv.getContext('2d');
  let W, H, stars = [], t = 0;

  function resizeBg() {
    W = cv.width  = window.innerWidth  * (devicePixelRatio || 1);
    H = cv.height = window.innerHeight * (devicePixelRatio || 1);
    cv.style.width  = window.innerWidth  + 'px';
    cv.style.height = window.innerHeight + 'px';
  }
  window.addEventListener('resize', resizeBg);
  resizeBg();

  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.6 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005
    });
  }

  function drawBg() {
    const g = cx.createLinearGradient(0, 0, 0, H * 0.65);
    g.addColorStop(0,    '#0a0818');
    g.addColorStop(0.35, '#150d28');
    g.addColorStop(0.65, '#2a1a0a');
    g.addColorStop(1,    '#3a1e08');
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);

    stars.forEach(s => {
      s.twinkle += s.speed;
      const alpha = 0.3 + Math.sin(s.twinkle) * 0.4;
      cx.fillStyle = `rgba(255,240,200,${alpha})`;
      cx.beginPath();
      cx.arc(s.x * W, s.y * H * 0.6, s.r * (devicePixelRatio || 1), 0, Math.PI * 2);
      cx.fill();
    });

    const pulse = 0.8 + Math.sin(t * 0.9) * 0.2;
    const glow  = cx.createRadialGradient(W/2, H*0.3, 0, W/2, H*0.3, W*0.55);
    glow.addColorStop(0,   `rgba(255,180,0,${0.07 * pulse})`);
    glow.addColorStop(0.5, `rgba(180,80,0,${0.04 * pulse})`);
    glow.addColorStop(1,   'transparent');
    cx.fillStyle = glow; cx.fillRect(0, 0, W, H);

    const floorG = cx.createLinearGradient(0, H*0.72, 0, H);
    floorG.addColorStop(0, '#1a1420');
    floorG.addColorStop(1, '#0d0b14');
    cx.fillStyle = floorG; cx.fillRect(0, H*0.72, W, H*0.28);

    const bldgs = [
      {x:0.02,w:0.10,h:0.28,win:[[0.2,0.1],[0.6,0.1],[0.2,0.4],[0.6,0.4],[0.2,0.7],[0.6,0.7]]},
      {x:0.13,w:0.07,h:0.22,win:[[0.3,0.15],[0.7,0.15],[0.3,0.5],[0.7,0.5]]},
      {x:0.20,w:0.12,h:0.32,win:[[0.2,0.1],[0.5,0.1],[0.8,0.1],[0.2,0.3],[0.5,0.3],[0.8,0.3],[0.2,0.55],[0.5,0.55],[0.8,0.55]]},
      {x:0.60,w:0.14,h:0.30,win:[[0.15,0.1],[0.5,0.1],[0.85,0.1],[0.15,0.35],[0.5,0.35],[0.85,0.35],[0.15,0.6],[0.5,0.6],[0.85,0.6]]},
      {x:0.75,w:0.08,h:0.20,win:[[0.25,0.2],[0.75,0.2],[0.25,0.55],[0.75,0.55]]},
      {x:0.84,w:0.11,h:0.26,win:[[0.2,0.12],[0.6,0.12],[0.2,0.4],[0.6,0.4],[0.2,0.68],[0.6,0.68]]},
      {x:0.92,w:0.08,h:0.18,win:[[0.3,0.2],[0.7,0.2],[0.3,0.6]]},
    ];
    const baseY = H * 0.72;
    bldgs.forEach(b => {
      const bx = W*b.x, bw = W*b.w, bh = H*b.h, by = baseY - bh;
      cx.fillStyle = '#0e0c1a';
      cx.fillRect(bx, by, bw, bh + 1);
      b.win.forEach(([wx, wy]) => {
        const wx2 = bx + bw*wx, wy2 = by + bh*wy;
        const warmth = 0.6 + Math.sin(t*0.3 + wx2) * 0.4;
        cx.fillStyle = `rgba(255,200,80,${warmth * 0.55})`;
        cx.fillRect(wx2 - bw*0.09, wy2 - bh*0.06, bw*0.18, bh*0.12);
      });
    });
  }

  function bgLoop() { t += 0.016; drawBg(); requestAnimationFrame(bgLoop); }
  bgLoop();

  // ── Chat state ────────────────────────────────────────────────────────────
  let chatHistory = [];

  function scrollToBottom() {
    const cw = document.getElementById('chatWindow');
    if (cw) cw.scrollTop = cw.scrollHeight;
  }

  function addMessageToUI(role, text) {
    const chatWindow = document.getElementById('chatWindow');
    const emptyState = document.getElementById('emptyState');
    if (emptyState) emptyState.style.display = 'none';

    const typingRow = document.getElementById('typingRow');
    const row = document.createElement('div');
    row.className = 'msg-row ' + (role === 'user' ? 'user' : 'dick');

    if (role !== 'user') {
      const avatar = document.createElement('div');
      avatar.className = 'msg-avatar';
      avatar.textContent = '🧔';
      row.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);

    chatWindow.insertBefore(row, typingRow);
    scrollToBottom();
  }

  function setTyping(visible) {
    document.getElementById('typingRow').style.display = visible ? 'flex' : 'none';
    scrollToBottom();
  }

  async function sendMessage() {
    const userText = input.value.trim();
    if (!userText) return;

    input.value = '';
    input.style.height = '46px';
    sendBtn.disabled = true;

    addMessageToUI('user', userText);
    chatHistory.push({ role: 'user', content: userText });
    setTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: dickPersona, messages: chatHistory })
      });
      if (!response.ok) throw new Error(`HTTP-fout: ${response.status}`);
      const data = await response.json();
      const replyText = data.text || 'Ho ff pik. Geen antwoord gekregen van de server.';
      chatHistory.push({ role: 'assistant', content: replyText });
      setTyping(false);
      addMessageToUI('assistant', replyText);
    } catch (err) {
      setTyping(false);
      addMessageToUI('assistant', `Me hersens zijn even buffering. Fout: ${err.message}`);
      console.error('Fout bij API-call:', err);
    }

    sendBtn.disabled = false;
    input.focus();
  }

  function clearChat() {
    chatHistory = [];
    const chatWindow = document.getElementById('chatWindow');
    const typingRow  = document.getElementById('typingRow');
    chatWindow.innerHTML = `
      <div id="emptyState">
        <span class="empty-icon">🛵</span>
        Dick zit op z'n bolide en is al bijna dronken van de Klokjes.<br>
        En hij is geil.<br><br>
        <strong>Zeg iets tegen hem... als je durft.</strong>
      </div>
    `;
    chatWindow.appendChild(typingRow);
  }

}); // einde DOMContentLoaded
