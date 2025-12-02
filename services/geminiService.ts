import { GoogleGenAI, Type } from "@google/genai";

// Initialize the client
// Ideally this should be wrapped in a class or context to handle re-init if key changes, 
// but for this scope we stick to the provided pattern.
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

export const getAffirmation = async (category: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Give me one powerful, short daily affirmation for ${category}. No quotes, just the affirmation string.`,
    });
    return response.text;
  } catch (error) {
    return "I am capable of handling whatever comes my way.";
  }
};
