const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

// Middleware per il parsing del JSON
app.use(express.json());

// Servi i file statici dalla directory corrente
app.use(express.static('./'));

// Endpoint per la generazione del codice
app.post('/generate', async (req, res) => {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': process.env.GEMINI_API_KEY
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Errore:', error);
        res.status(500).json({ error: 'Errore durante la generazione del codice' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
