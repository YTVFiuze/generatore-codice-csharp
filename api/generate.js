import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Gestisci le richieste OPTIONS (pre-flight)
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', 'https://generatore-codice-csharp-a8vf-i1xeo6acg-lucas-projects-ee259182.vercel.app');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Max-Age', '86400');
        return res.status(200).end();
    }

    // Verifica il metodo della richiesta
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Imposta gli header CORS per le richieste POST
    res.setHeader('Access-Control-Allow-Origin', 'https://generatore-codice-csharp-a8vf-i1xeo6acg-lucas-projects-ee259182.vercel.app');

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
            const errorData = await response.text();
            console.error('Gemini API error:', errorData);
            return res.status(500).json({ 
                error: 'Errore durante la generazione del codice',
                details: errorData
            });
        }
        
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Errore:', error);
        return res.status(500).json({ 
            error: 'Errore durante la generazione del codice',
            details: error.message
        });
    }
}
