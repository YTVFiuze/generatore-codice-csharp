import fetch from 'node-fetch';

// Funzione serverless per la generazione del codice
export default async function handler(req, res) {
    // Abilita CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Gestisci le richieste OPTIONS (pre-flight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Verifica il metodo della richiesta
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': process.env.GEMINI_API_KEY
            },
            body: JSON.stringify(req.body)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Errore:', error);
        res.status(500).json({ error: 'Errore durante la generazione del codice' });
    }
}
