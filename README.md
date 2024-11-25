# Generatore di Codice C#

Un'applicazione web moderna per generare codice C# utilizzando l'intelligenza artificiale di Google Gemini.

## Caratteristiche

- 🤖 Generazione di codice C# tramite AI
- 📝 Interfaccia utente intuitiva
- 🎨 Design moderno e responsive
- 🔄 Copia del codice con un click
- 🇮🇹 Nomi e commenti in italiano

## Tecnologie Utilizzate

- HTML5
- CSS3
- JavaScript (ES6+)
- Google Gemini API
- Express.js (server di sviluppo)

## Installazione

1. Clona il repository:
```bash
git clone https://github.com/tuousername/generatore-codice-csharp.git
cd generatore-codice-csharp
```

2. Installa le dipendenze:
```bash
npm install
```

3. Crea un file `config.js` nella root del progetto con la tua API key di Google Gemini:
```javascript
export const GEMINI_API_KEY = 'la-tua-api-key';
export const GENERATION_CONFIG = {
    maxOutputTokens: 2048,
    temperature: 0.2,
    topP: 0.8,
    topK: 40
};
```

4. Avvia il server di sviluppo:
```bash
npm start
```

5. Apri il browser e vai a `http://localhost:3000`

## Utilizzo

1. Inserisci una descrizione del codice C# che desideri generare
2. Clicca su "Genera Codice"
3. Il codice generato apparirà nella sezione sottostante
4. Usa il pulsante "Copia" per copiare il codice negli appunti

## Contribuire

Sei interessato a contribuire? Fantastico! 
1. Fai un fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa i tuoi cambiamenti (`git commit -m 'Add some AmazingFeature'`)
4. Pusha al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

Distribuito sotto licenza MIT. Vedi `LICENSE` per maggiori informazioni.
