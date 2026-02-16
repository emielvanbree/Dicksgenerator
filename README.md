# Dicks Generator 🛵

Een chatbot met Dick Stoter uit Malburgen, Arnhem. Gebouwd met OpenAI API, gehost op GitHub Pages + Vercel.

## 🚀 Deployment Instructies

### 1. GitHub Repository Setup
```bash
git clone https://github.com/emielvanbree/Dicksgenerator.git
cd Dicksgenerator
```

### 2. Vercel Backend Deployen

1. Ga naar [vercel.com](https://vercel.com)
2. Klik op **New Project**
3. Kies **Import Git Repository** → log in met GitHub
4. Selecteer `emielvanbree/Dicksgenerator`
5. Klik op **Deploy**

Na deployment krijg je een URL zoals: `https://dicksgenerator.vercel.app`

### 3. OpenAI API Key Toevoegen aan Vercel

1. Ga naar je Vercel project → **Settings** → **Environment Variables**
2. Voeg toe:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: je OpenAI API key (begint met `sk-proj-...`)
3. Klik op **Save**

⚠️ **BELANGRIJK**: Zet je API key NOOIT in de code of commit deze naar GitHub!

### 4. Vercel URL Invullen in Frontend

Open `app.js` en vervang:
```javascript
const API_URL = "https://<jouw-vercel-project>.vercel.app/api/ask";
```

Door je echte Vercel URL, bijvoorbeeld:
```javascript
const API_URL = "https://dicksgenerator.vercel.app/api/ask";
```

Commit en push deze wijziging:
```bash
git add app.js
git commit -m "Add Vercel URL"
git push
```

### 5. GitHub Pages Activeren

1. Ga naar je GitHub repo → **Settings** → **Pages**
2. Kies **Source**: Deploy from a branch
3. Kies **Branch**: `main` en folder `/root`
4. Klik op **Save**

Je site is nu live op: `https://emielvanbree.github.io/Dicksgenerator/`

### 6. CORS Beveiliging (Optioneel maar Aanbevolen)

Open `api/ask.js` en vervang:
```javascript
const ALLOWED_ORIGIN = "*";
```

Door je GitHub Pages URL:
```javascript
const ALLOWED_ORIGIN = "https://emielvanbree.github.io";
```

Dit voorkomt dat anderen je Vercel endpoint misbruiken.

## 🔒 Beveiliging

- ✅ API key staat alleen in Vercel environment variables
- ✅ Niet in de code of Git history
- ✅ CORS instellen op je GitHub Pages domein (niet `*`)

## 📁 Bestandsstructuur

```
Dicksgenerator/
├── index.html       # Chatbot UI
├── app.js           # Frontend logic + API calls
├── api/
│   └── ask.js       # Vercel serverless function (OpenAI proxy)
└── README.md        # Deze instructies
```

## 🛠️ Lokaal Testen (Optioneel)

Om lokaal te testen met Vercel CLI:
```bash
npm i -g vercel
vercel dev
```

Zet dan in `app.js`:
```javascript
const API_URL = "http://localhost:3000/api/ask";
```

## ❓ Problemen?

- **CORS error**: Controleer `ALLOWED_ORIGIN` in `api/ask.js`
- **500 error**: Controleer of `OPENAI_API_KEY` staat in Vercel Environment Variables
- **404 error**: Controleer of de URL in `app.js` klopt

## 📝 Licentie

MIT - Doe ermee wat je wilt, pik.
