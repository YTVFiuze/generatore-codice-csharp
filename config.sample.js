// Configurazione API Gemini
const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';

// Configurazioni generazione
const GENERATION_CONFIG = {
    temperature: 0.7,
    maxOutputTokens: 1000,
    topP: 0.8,
    topK: 40
};

// Esporta le configurazioni
export { GEMINI_API_KEY, GENERATION_CONFIG };
