// ⚠️ VERVANG DEZE URL door je echte Vercel URL zodra je die hebt
const API_URL = "https://<jouw-vercel-project>.vercel.app/api/ask";

const dickPersona = `
Jij bent Dick Stoter. Je bent GEEN AI assistent. Je bent een 55-jarige, grove man uit de volkswijk Malburgen in Arnhem.

JOUW KARAKTER:
- Je zit in een scootmobiel (je "bolide") en trekt een Wajong-uitkering van het UWV.
- Je drinkt halve liters lauwe Klok of Schultenbräu.
- Je bent gierig en blut: probeer bijna ALTIJD geld, peuken of bier te bietsen aan het eind van je antwoord.
- Je bent seksueel gefrustreerd: maak ranzige opmerkingen over vrouwen (bijv: "buurvrouw", "lekkere wijven").
- Je klaagt continu over je gezondheid: jicht, zere rug, rokershoestje, lever.
- VITESSE: Je bent wel fan, maar begin er NIET elke keer over. Alleen als het over sport gaat of als je zin hebt om te rellen.
- NIJMEGEN/NEC: Haat je grondig. Noem ze "Neuzen" als het ter sprake komt.
JOUW TAAL (BELANGRIJK):
- Spreek PLAT ARNHEMS/TOKKIE. GEEN ABN.
- Schrijf fonetisch: "nie" (niet), "me" (mijn), "effe" (even), "hep" (heb), "is" (eens).
- Woorden: "pik", "pannenkoek", "sushilul", "godsamme", "wijven", "maat".
- Wees kortaf en lomp.
VOORBEELDEN:
V: "Hoe is het?"
A: "Slecht pik. Me rug is naar de klote en de Klok is op. Hep jij nog 5 euro? Kan ik effe naar de Aldi sjezen."
V: "Wat vind je van het weer?"
A: "Kutweer. Krijg ik last van me jicht. En die wijven lopen nu allemaal met een dikke jas aan, is ook niks an. Doe mij de zomer maar."
V: "Ga je mee naar NEC?"
A: "Ben je gek?! Vuile Neuzen! Ik rij ze allemaal plat met me scootmobiel. Hup Vites!"
INSTRUCTIE:
Reageer nu op de gebruiker hieronder. Blijf 100% in je rol als Dick Stoter.
`;

let chatHistory = [];

function scrollToBottom() {
    const cw = document.getElementById('chatWindow');
    cw.scrollTop = cw.scrollHeight;
}

function addMessageToUI(role, text) {
    const chatWindow = document.getElementById('chatWindow');
    const emptyState = document.getElementById('emptyState');
    const typingRow = document.getElementById('typingRow');

    if (emptyState) emptyState.remove();

    const row = document.createElement('div');
    row.className = `message-row ${role}`;

    const wrapper = document.createElement('div');
    wrapper.className = `bubble-wrapper ${role}`;

    const bubble = document.createElement('div');
    bubble.className = `bubble ${role}`;
    bubble.innerHTML = text.replace(/\n/g, '<br>');
    wrapper.appendChild(bubble);

    if (role === 'dick') {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-msg-btn';
        copyBtn.textContent = '📋 kopieer';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.textContent = '✅ gekopieerd';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = '📋 kopieer';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        };
        wrapper.appendChild(copyBtn);

        const avatar = document.createElement('div');
        avatar.className = 'bubble-avatar';
        avatar.textContent = '🧔';
        row.appendChild(avatar);
    }

    row.appendChild(wrapper);
    chatWindow.insertBefore(row, typingRow);
    scrollToBottom();
}

function setTyping(visible) {
    document.getElementById('typingRow').style.display = visible ? 'flex' : 'none';
    scrollToBottom();
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const userText = input.value.trim();

    if (!userText) return;

    input.value = '';
    input.style.height = '50px';
    sendBtn.disabled = true;

    addMessageToUI('user', userText);
    chatHistory.push({ role: "user", content: userText });
    setTyping(true);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: dickPersona },
                    ...chatHistory
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || response.statusText);
        }

        const data = await response.json();
        const dickReply = data.text;

        if (!dickReply) {
            throw new Error("Dick gaf geen antwoord. Misschien is hij stomdronken.");
        }

        chatHistory.push({ role: "assistant", content: dickReply });
        setTyping(false);
        addMessageToUI('dick', dickReply);

    } catch (error) {
        setTyping(false);
        addMessageToUI('dick', `⚠️ Foutje pik: ${error.message}`);
    } finally {
        sendBtn.disabled = false;
        input.focus();
    }
}

function clearChat() {
    chatHistory = [];
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.innerHTML = `
        <div class="empty-state" id="emptyState">
            <span class="emoji">🛵</span>
            Dick zit te wachten op de stoep.<br>Zeg iets tegen hem...
        </div>
        <div class="typing-row" id="typingRow">
            <div class="bubble-avatar">🧔</div>
            <div class="typing-bubble">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
}

document.getElementById('userInput').addEventListener('input', function() {
    this.style.height = '50px';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

document.getElementById('userInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
