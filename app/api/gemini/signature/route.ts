import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { name, styles, vibe } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: "Invalid name provided." }, { status: 400 });
    }

    const vibeText = vibe && vibe !== "Any" 
      ? `The user requested specifically a "${vibe}" vibe for their signatures.`
      : '';

    const prompt = `
Generate ${styles.length} unique, professional handwritten signature designs for the name "${name}".
Each signature must be creative, stylish and look like real human signatures, not simple font text.

Requirements:
- Use the letters of "${name}" clearly but in a creative way.
- Add stylish loops, flourishes, underlines, tail strokes.
- Mix big initials, connections, and artistic elements.
- Make each signature DIFFERENT from the others.
- Real handwritten look, natural pen flow, varying sizes. 
- IMPORTANT: Include dramatic loops, sweeping underlines, messy connecting strokes, overlapping paths, and artistic flair to make it look authentically drawn by a human hand quickly. 
- Avoid plain font-style signatures completely. Do NOT make it look like a standard cursive font. It should look like an established executive's rapid signature.
- Return clean SVG paths only (no background, no boxes, no explanation).

${vibeText}

The signature will be rendered inside an SVG with viewBox="0 0 500 200". 
Provide an array of paths for each style. Each path should be a clean SVG 'd' string (M, L, C, Q, S curves).
'isStroke' should be true if it's a line that needs to be stroked, or false if it's a filled shape. For handwriting, ALMOST ALL should be stroked paths! 
Set 'transform' to center it properly within the 500x200 canvas if needed, else empty string.
Set 'strokeWidth' between 1.5 and 4 depending on the style.

For each of the following categorical styles, generate a distinct signature profile:
${JSON.stringify(styles, null, 2)}
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        results: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              description: { type: Type.STRING },
              professionalismScore: { type: Type.INTEGER },
              uniquenessScore: { type: Type.INTEGER },
              recommendation: { type: Type.STRING },
              svgData: {
                type: Type.OBJECT,
                properties: {
                  paths: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        d: { type: Type.STRING },
                        isStroke: { type: Type.BOOLEAN }
                      },
                      required: ["d", "isStroke"]
                    }
                  },
                  transform: { type: Type.STRING },
                  strokeWidth: { type: Type.NUMBER }
                },
                required: ["paths", "transform", "strokeWidth"]
              }
            },
            required: ["id", "description", "professionalismScore", "uniquenessScore", "recommendation", "svgData"]
          }
        }
      },
      required: ["results"]
    };

    let aiData: any = null;
    let fallbackError: string = "Failed to generate AI data.";
    try {
      const aiClient = getAI();
      const apiCall = aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.9,
        }
      }).catch(err => {
        console.error("GenAI background error:", err?.message, err);
        fallbackError = "GenAI err: " + (err?.message || 'unknown');
        return null;
      });
      
      let timeoutId: NodeJS.Timeout | null = null;
      const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error("Timeout Exceeded")), 38000);
      });

      const response = await Promise.race([apiCall, timeout]) as any;
      if (timeoutId) clearTimeout(timeoutId);
      
      if (response && response.text) {
        aiData = JSON.parse(response.text);
      }
    } catch (err: any) {
      console.error("GenAI Generation Error or Timeout:", err?.message || err);
      return NextResponse.json({ error: "Threw err: " + err?.message }, { status: 500 });
    }

    if (!aiData || !aiData.results) {
       console.log("No ai data. fallbackError:", fallbackError);
       return NextResponse.json({ error: fallbackError }, { status: 500 });
    }

    return NextResponse.json({ results: aiData.results });

  } catch (error: any) {
    console.error("Signature Generation Error Outer Level:", error);
    return NextResponse.json({ error: error.message || "Failed to generate styles" }, { status: 500 });
  }
}
