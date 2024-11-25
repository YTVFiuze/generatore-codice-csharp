import { GEMINI_API_KEY, GENERATION_CONFIG } from './config.js';

// Funzione per generare codice usando l'AI
export async function generateWithAI(prompt) {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY
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
NON includere commenti XML (///). Usa SOLO nomi e commenti in italiano.
Rispondi SOLO con il codice C#, senza spiegazioni o altro testo.`
                    }]
                }],
                generationConfig: {
                    ...GENERATION_CONFIG,
                    temperature: 0.2,
                    topP: 0.8,
                    topK: 40
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error:', errorData);
            throw new Error(`Errore API (${response.status}): ${errorData.error?.message || 'Errore sconosciuto'}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        // Estrai il codice dalla risposta
        let code = '';
        
        try {
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                code = data.candidates[0].content.parts[0].text;
            } else {
                console.warn('Unexpected API response structure:', data);
                throw new Error('Formato risposta API non valido');
            }
        } catch (error) {
            console.error('Error extracting code from response:', error);
            throw new Error('Errore nell\'elaborazione della risposta');
        }
        
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
        console.error('Errore nella generazione:', error);
        throw error;
    }
}

// Funzione per copiare il codice negli appunti
export function copyToClipboard() {
    const generatedCode = document.getElementById('generatedCode').textContent;
    navigator.clipboard.writeText(generatedCode).then(() => {
        const copyFeedback = document.getElementById('copyFeedback');
        copyFeedback.classList.add('show');
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 2000);
    }).catch(err => {
        console.error('Errore durante la copia:', err);
        alert('Non è stato possibile copiare il codice. Per favore, copialo manualmente.');
    });
}
