import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJournalAnalysis = async (text: string) => {
  if (!text || text.length < 10) return null;
  
  const ai = getAIClient();
  const prompt = `Analyze this journal entry for emotional content, key stressors, and provide a short, supportive psychological insight.
  
  Entry: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative'] },
            emotion: { type: Type.STRING },
            insight: { type: Type.STRING },
            suggestedAction: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis failed", error);
    return null;
  }
};

export const generateMeditationScript = async (mood: string, duration: 'short' | 'long') => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a calm, soothing meditation script for someone feeling "${mood}". 
      Keep it ${duration === 'short' ? 'under 150 words' : 'comprehensive, around 300 words'}. 
      Focus on breathwork and grounding. Output plain text.`,
    });
    return response.text;
  } catch (error) {
    console.error("Meditation generation failed", error);
    return "Take a deep breath. Inhale... Exhale. Focus on your breath.";
  }
};

export const getAffirmation = async (category: string, timeOfDay?: string) => {
  const ai = getAIClient();
  try {
    const timeContext = timeOfDay ? `suitable for the ${timeOfDay}` : '';
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Give me one powerful, short affirmation for ${category} ${timeContext}. 
      No quotes, no preamble, just the affirmation string. 
      Example: "I am worthy of love and respect."`,
    });
    return response.text.trim();
  } catch (error) {
    return "I am capable of handling whatever comes my way.";
  }
};

export const getAffirmationsBatch = async (category: string, count: number = 6) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate ${count} unique, powerful, present-tense affirmations for the category: "${category}". 
      They should be positive, empowering, and short (under 15 words).
      Return a pure JSON array of strings. 
      Example: ["I am a money magnet.", "Wealth flows to me easily."].`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Batch affirmations failed", error);
    return [`I am worthy of ${category}.`, `I embrace ${category} in my life.`, `My connection to ${category} is improving every day.`];
  }
};

export const generateTodoSuggestions = async (goal: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 3 small, actionable todo items to help achieve this goal: "${goal}". 
      Return JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};