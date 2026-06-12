import { GoogleGenAI, Type, Schema } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        results: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              styleName: { type: Type.STRING },
              svg: { type: Type.STRING },
            },
            required: ["styleName", "svg"]
          }
        }
      },
      required: ["results"]
    };
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Create 2 highly realistic, continuous, cursive, abstract handwritten signature SVG code string for the name 'Durvank'. Make it look like a CEO's fast squiggly signature with beautiful pen flow. Generate ONLY standard <svg> starting tag with viewBox 0 0 500 200, containing smooth bezier curves (<path>).",
      config: {
        responseMimeType: "application/json",
        responseSchema
      }
    });
    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}
run();
