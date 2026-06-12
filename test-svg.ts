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
                svgPathData: { type: Type.STRING },
              },
              required: ["svgPathData"]
            }
          }
        },
        required: ["results"]
      };
      // let's just get 8 different signature paths and log them
      const response = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Create 8 highly realistic handwritten signature SVG path strings `d` attribute. They should start with a large letter loop, followed by quick cursive squiggles, some loops, and an elegant flourish. Use realistic path commands. The paths MUST fit nicely inside a `viewBox 0 0 500 200`. Just return the raw d string.",
        config: {
          responseMimeType: "application/json",
          responseSchema
        }
      });
      console.log(response.text);
    } catch (e: any) {
      console.error("Failed", e.message);
    }
}
run();
