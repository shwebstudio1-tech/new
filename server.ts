import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

console.log('Gemini AI Initialized. API Key Present:', !!process.env.GEMINI_API_KEY);

// In-memory server cache for medicine suggestions
interface MedicineSuggestion {
  formula: string;
  manufacturer: string;
  sku: string;
  category: string;
  unit: string;
  shelfLocation: string;
  unitCost: number;
  price: number;
}
const suggestionCache = new Map<string, MedicineSuggestion>();

// Resilient AI caller: starts with gemini-3.1-flash-lite which has available quota
async function withRetry<T>(fn: (model: string) => Promise<T>, maxRetries = 4): Promise<T> {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    const model = models[i % models.length];
    try {
      return await fn(model);
    } catch (error: any) {
      lastError = error;
      const msg = (error?.message || '').toLowerCase();
      const status = error?.status || error?.code;
      console.error(`AI attempt ${i + 1} (${model}) failed:`, msg, 'Status:', status);

      // If quota exhausted (429), immediately switch to next model without delay
      const isQuota = msg.includes('429') || msg.includes('quota') || status === 'RESOURCE_EXHAUSTED' || status === 429;
      if (isQuota && i < maxRetries - 1) {
        console.log(`Model ${model} quota exhausted, switching model immediately...`);
        continue;
      }

      const isRetryable = 
        msg.includes('503') || 
        msg.includes('busy') || 
        msg.includes('unavailable') ||
        msg.includes('not found') ||
        status === 'UNAVAILABLE' || 
        status === 'NOT_FOUND' ||
        status === 503 ||
        status === 404;
      
      if (isRetryable && i < maxRetries - 1) {
        const delay = 800 * (i + 1);
        console.log(`AI retryable error. Retrying in ${delay}ms with ${models[(i + 1) % models.length]}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

app.post('/api/suggest', async (req, res) => {
  const { medicineName } = req.body;
  if (!medicineName || typeof medicineName !== 'string') {
    return res.status(400).json({ error: 'Medicine name is required' });
  }

  const cacheKey = medicineName.trim().toLowerCase();
  if (suggestionCache.has(cacheKey)) {
    console.log('Serving from server cache for:', medicineName);
    return res.json(suggestionCache.get(cacheKey));
  }

  try {
    console.log('Suggesting full data for:', medicineName);
    const response = await withRetry((model) => ai.models.generateContent({
      model: model,
      contents: `Provide complete pharmacy inventory details for medicine/surgical product "${medicineName}" in Pakistan (PKR) retail market context.
Requirements:
- formula: Standard generic molecule or chemical formula (e.g. "Amoxicillin + Clavulanic Acid" or "Paracetamol 500mg")
- manufacturer: The actual pharmaceutical company in Pakistan (e.g. "GSK Pakistan", "Getz Pharma", "Searle", "Abbott Laboratories", "Hilton", "Bayer", "Martin Dow", "Sami", "B. Braun")
- sku: A clean standard SKU code (e.g. "AUG-625", "PAN-500", "FLAG-400", "BRUF-400")
- category: Exactly one of: ["Antibiotic (Rx)", "Analgesic (OTC)", "Cold Chain (Rx)", "Gastroenterology", "Surgical Consumable", "Surgical & Wound", "Antacid", "Protective"]
- unit: Exactly one of: ["boxes", "strips", "pcs", "bottles", "vials", "rolls", "canisters"]
- shelfLocation: A realistic pharmacy rack location (e.g. "Rack A-01", "Rack B-03", "Rack C-02", "Fridge (Cold Chain)")
- unitCost: Estimated wholesale trade/distributor price in PKR (number only)
- price: Official MRP / retail price in PKR (number only)`,
      config: { 
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            formula: { type: Type.STRING, description: 'Generic formula' },
            manufacturer: { type: Type.STRING, description: 'Pharmaceutical company' },
            sku: { type: Type.STRING, description: 'SKU code' },
            category: { type: Type.STRING, description: 'Medical category' },
            unit: { type: Type.STRING, description: 'Packaging unit' },
            shelfLocation: { type: Type.STRING, description: 'Shelf location' },
            unitCost: { type: Type.NUMBER, description: 'Wholesale trade price' },
            price: { type: Type.NUMBER, description: 'Market retail price' }
          },
          required: ['formula', 'manufacturer', 'sku', 'category', 'unit', 'shelfLocation', 'unitCost', 'price']
        }
      }
    }));

    if (!response.text) {
      throw new Error('AI returned an empty response.');
    }

    try {
      const text = response.text || '{}';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      // Ensure numeric prices
      if (typeof parsed.price === 'string') {
        parsed.price = parseFloat(parsed.price.replace(/[^0-9.]/g, '')) || 0;
      }
      if (typeof parsed.unitCost === 'string') {
        parsed.unitCost = parseFloat(parsed.unitCost.replace(/[^0-9.]/g, '')) || 0;
      }
      if (!parsed.unitCost && parsed.price) {
        parsed.unitCost = Math.round(parsed.price * 0.85); // fallback wholesale price
      }
      
      // Save to server cache
      suggestionCache.set(cacheKey, parsed);
      
      res.json(parsed);
    } catch (parseError) {
      console.error('Failed to parse AI JSON:', response.text);
      throw new Error('AI returned malformed data.');
    }
  } catch (error: any) {
    console.error('Gemini Suggest error:', error);
    res.status(500).json({ 
      error: 'AI Suggestion failed', 
      details: error?.message || 'Service unavailable.' 
    });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, history, context } = req.body;
  try {
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text || '' }]
    }));

    const systemPrompt = `You are ZenPharma Store Manager, a fast, concise pharmacy assistant. Answer in PKR context.
Current Store Data:
- Inventory: ${JSON.stringify(context?.inventory || [])}
- Recent Sales: ${JSON.stringify(context?.recentSales || [])}
Use this data to answer accurately about stock levels and sales. Respond in Roman Urdu if the user speaks Roman Urdu.`;

    const stream = await withRetry(async (model) => {
      const chat = ai.chats.create({
        model: model,
        history: formattedHistory,
        config: {
          systemInstruction: systemPrompt
        }
      });
      return await chat.sendMessageStream({ message });
    });
    
    res.setHeader('Content-Type', 'text/plain');
    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    res.end();
  } catch (error: any) {
    console.error('Gemini Chat error:', error);
    res.status(500).send(`Chat error: ${error?.message || 'Service busy'}`);
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}

startServer();
