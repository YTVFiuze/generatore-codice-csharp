import fetch from 'node-fetch';

export default async function handler(req, res) {
    console.log('API chiamata con metodo:', req.method);
    
    // Imposta gli header CORS per tutte le risposte
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Origin');

    // Gestisci le richieste OPTIONS
    if (req.method === 'OPTIONS') {
        console.log('Gestione richiesta OPTIONS');
        return res.status(200).end();
    }

    // Verifica il metodo della richiesta
    if (req.method !== 'POST') {
        console.log('Metodo non consentito:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verifica la presenza della chiave API
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY non trovata nelle variabili di ambiente');
            return res.status(500).json({ error: 'Configurazione API mancante' });
        }

        console.log('Preparazione richiesta a Gemini API');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        // Effettua la richiesta a Gemini
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
            },
            body: JSON.stringify(req.body)
        });

        // Gestisci gli errori HTTP
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Errore Gemini API - Status:', response.status);
            console.error('Errore Gemini API - Response:', errorText);
            return res.status(response.status).json({
                error: 'Errore nella chiamata a Gemini API',
                status: response.status,
                details: errorText
            });
        }

        // Processa la risposta
        console.log('Risposta ricevuta da Gemini API');
        const data = await response.json();
        console.log('Risposta processata:', JSON.stringify(data, null, 2));
        
        // Verifica la validità della risposta
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.error('Risposta Gemini non valida:', JSON.stringify(data, null, 2));
            return res.status(500).json({ 
                error: 'Risposta API non valida',
                data: data
            });
        }

        // Invia la risposta
        console.log('Invio risposta al client');
        return res.status(200).json(data);
    } catch (error) {
        // Log dell'errore
        console.error('Errore interno:', error);
        console.error('Stack trace:', error.stack);
        
        // Invia risposta di errore
        return res.status(500).json({
            error: 'Errore durante la generazione del codice',
            message: error.message,
            stack: error.stack
        });
    }
}
