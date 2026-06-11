import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const responseSchema = {
  type: Type.ARRAY,
  description: "A list of 10 signature style analyses, one for each provided font ID.",
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.INTEGER, description: "The ID of the font style." },
      description: { type: Type.STRING, description: "A highly descriptive, creative analysis of what this signature style says about the person based on their name." },
      professionalismScore: { type: Type.INTEGER, description: "A score from 1 to 100 rating how professional this style looks for this specific name." },
      uniquenessScore: { type: Type.INTEGER, description: "A score from 1 to 100 rating how unique and distinct this style looks." },
      recommendation: { type: Type.STRING, description: "A short recommendation on where to best use this signature (e.g., 'Best for legal documents', 'Great for personal emails')." }
    },
    required: ["id", "description", "professionalismScore", "uniquenessScore", "recommendation"]
  }
};

const prompt = `Analyze the name "Alex" and generate a signature profile for each of the following font styles.
    Font styles to analyze:
    ${JSON.stringify([{id: 1, label: 'Casual'}], null, 2)}`;

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });
    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}
run();
