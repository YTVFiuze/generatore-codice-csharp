import { GEMINI_API_KEY, GENERATION_CONFIG } from './config.js';

// Funzione per generare codice usando l'AI
export async function generateWithAI(prompt) {
    try {
        const response = await fetch('https://generatore-codice-csharp.vercel.app/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Sei un esperto sviluppatore C#. Genera il codice C# in base alla richiesta dell'utente.
Genera solo codice C# valido e compilabile, senza spiegazioni o markdown.

RICHIESTA UTENTE: ${prompt}

REQUISITI:
1. Genera SOLO il codice C# che soddisfa la richiesta
2. Includi gli statement 'using' necessari
3. NON includere commenti XML
4. Usa nomi di variabili, metodi e classi in italiano
5. Usa commenti in italiano per spiegare la logica complessa
6. Il codice deve essere pulito ed efficiente
7. Supporta qualsiasi tipo di codice C# (classi, interfacce, metodi, LINQ, ecc.)
8. Usa commenti // in italiano quando necessario per spiegare la logica

Il codice deve essere pronto per la produzione e seguire le convenzioni C# moderne.
NON includere commenti XML (///). Usa SOLO nomi e commenti in italiano.`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                    topP: 0.8,
                    topK: 40
                }
            })
        });

        if (!response.ok) {
            throw new Error('Errore nella richiesta API');
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
            throw new Error('Risposta API non valida');
        }

        let code = data.candidates[0].content.parts[0].text;
        
        // Rimuovi eventuali markdown code blocks e spazi extra
        code = code.replace(/```c#|```csharp|```/g, '').trim();
        
        // Rimuovi eventuali commenti XML rimasti
        code = code.replace(/\/\/\/.*\n/g, '');
        
        // Verifica che il codice contenga elementi C# validi
        const csharpIndicators = [
            'class ',
            'interface ',
            'struct ',
            'enum ',
            'namespace ',
            'using ',
            'public ',
            'private ',
            'protected ',
            'static ',
            'void ',
            'int ',
            'string ',
            'bool ',
            'var '
        ];
        
        if (!csharpIndicators.some(indicator => code.includes(indicator))) {
            console.warn('Generated code does not contain valid C# indicators:', code);
            throw new Error('Il codice generato non sembra essere C# valido');
        }

        // Se il codice sembra valido, aggiunge intestazione se manca
        if (!code.includes('using System') && !code.includes('namespace')) {
            code = 'using System;\n\n' + code;
        }

        return code;
    } catch (error) {
        console.error('Errore durante la generazione:', error);
        throw error;
    }
}

// Funzione per copiare il codice negli appunti
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Errore durante la copia:', error);
        return false;
    }
}
