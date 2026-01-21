import { GoogleGenAI } from "@google/genai";

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) return false;
  
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Make a minimal request to validate the key
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'ping',
    });
    return true;
  } catch (error) {
    console.error("API Key Validation Failed:", error);
    return false;
  }
};

export const generateAIContent = async (apiKey: string, prompt: string, currentContent: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Using gemini-3-flash-preview for speed and efficiency in text editing tasks
  const model = 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [
            { text: `You are an expert Markdown editor. User wants you to perform the following task: "${prompt}".\n\nHere is the current markdown content:\n---\n${currentContent}\n---\n\nReturn ONLY the updated markdown content. Do not include markdown code fences (like \`\`\`markdown) unless the user explicitly asks for a code block inside the text. Just return the raw markdown string.` }
          ]
        }
      ]
    });

    return response.text || currentContent;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};