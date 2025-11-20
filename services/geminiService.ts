import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 
// Note: In a real environment, ensure this is set. 
// For this demo, we will fallback to mock responses if API key is missing or fails to avoid breaking the UI.

let ai: GoogleGenAI | null = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.warn("Failed to initialize Gemini Client", e);
}

export const getChatResponse = async (message: string, context?: string): Promise<string> => {
  if (!ai) {
    // Fallback mock response for demo purposes if no API key
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency
    return "I've analyzed your input. Based on your current vitals and history, I recommend maintaining your current hydration levels. Would you like me to schedule a reminder for your next medication?";
  }

  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model,
      contents: `System: You are HashCare AI, a helpful, empathetic, and professional medical health assistant.
      Context: ${context || 'User is a 45-year-old patient with mild hypertension.'}
      User: ${message}`,
    });
    return response.text || "I'm having trouble processing that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently offline. Please check your internet connection or API configuration.";
  }
};

export const getDailyTip = async (): Promise<string> => {
    if (!ai) {
        return "Drink at least 8 glasses of water today to improve kidney function.";
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Give me a short, single sentence health tip for a dashboard.",
        });
        return response.text || "Stay active and hydrated!";
    } catch (e) {
        return "Take a deep breath and relax for 5 minutes.";
    }
}