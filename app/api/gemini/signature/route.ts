import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Set maximum duration for Vercel/serverless environments

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

const fallbackPaths = [
  "M 50 120 C 30 40, 80 180, 120 100 S 160 80, 200 120 Q 220 140, 240 100 C 260 60, 280 150, 320 110 S 360 80, 400 120 Q 420 140, 450 100 C 470 70, 480 130, 490 110",
  "M 60 110 C 40 50, 20 170, 100 130 S 140 90, 180 110 Q 200 120, 220 100 C 240 80, 260 140, 300 120 S 340 90, 380 110 Q 400 120, 430 90 C 450 60, 470 120, 480 100",
  "M 70 130 C 50 30, 10 190, 130 110 S 160 100, 190 120 Q 210 130, 230 110 C 250 90, 270 140, 300 120 S 330 100, 360 130 Q 380 140, 400 110 C 420 80, 440 150, 460 100",
  "M 55 105 C 25 60, 45 160, 115 125 S 155 85, 195 105 Q 215 115, 235 95 C 255 75, 275 135, 315 115 S 355 85, 395 105 Q 415 115, 445 85 C 465 55, 485 145, 495 125",
  "M 45 115 C 25 35, 75 185, 115 95 S 155 75, 195 115 Q 215 135, 235 95 C 255 55, 275 145, 315 105 S 355 75, 395 115 Q 415 135, 445 95 C 465 65, 485 125, 495 105",
  "M 65 125 C 35 70, 55 170, 125 105 S 165 95, 205 125 Q 225 135, 245 115 C 265 95, 285 155, 325 125 S 365 95, 405 115 Q 425 125, 455 95 C 475 65, 490 130, 498 110",
  "M 50 130 C 20 60, 80 20, 120 100 S 160 140, 200 100 Q 220 80, 240 120 C 260 160, 280 70, 320 110 S 360 150, 400 90 Q 420 70, 450 110 C 470 140, 480 80, 490 120",
  "M 40 110 C 20 70, 30 150, 90 120 S 130 90, 170 110 Q 190 120, 210 100 C 230 80, 250 140, 290 120 S 330 90, 370 110 Q 390 120, 420 90 C 440 60, 460 130, 490 100"
];

export async function POST(req: NextRequest) {
  try {
    const { name, styles, vibe } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: "Invalid name provided." }, { status: 400 });
    }

    const aiClient = getAI();

    const vibeText = vibe && vibe !== "Any" 
      ? `The user requested specifically a "${vibe}" vibe for their signatures.`
      : '';

    const prompt = `
      Create exactly ${styles?.length || 8} highly realistic handwritten signature SVG path strings \`d\` attribute for the name "${name}".
      ${vibeText}
      
      For each of the following categorical styles, generate a distinct, authentic signature. DO NOT just output a generic wave.
      Use cursive, capitalized first letters, varying heights, realistic pen squiggles, flourishes, and loops.
      Ensure the path perfectly fits inside a 500x200 viewBox space.
      
      Output real SVG path \`d\` strings (M ..., C ..., S ..., Q ...) matching the requested style name.
      Keep description to 1 concise sentence.

      Categories:
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
              svgPathData: { type: Type.STRING, description: "The raw SVG path string commands" },
              professionalismScore: { type: Type.INTEGER },
              uniquenessScore: { type: Type.INTEGER },
              recommendation: { type: Type.STRING },
            },
            required: ["id", "description", "svgPathData", "professionalismScore", "uniquenessScore", "recommendation"]
          }
        }
      },
      required: ["results"]
    };

    let response;
    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      // 25 second timeout for the API call to ensure we don't hit serverless timeouts
      const apiCall = aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.8,
          topK: 40,
        }
      });
      
      const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error("Timeout Exceeded")), 25000);
      });

      response = await Promise.race([apiCall, timeout]) as any;
      if (timeoutId) clearTimeout(timeoutId);
    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error("GenAI Generation Error or Timeout:", err?.message || err);
    }

    if (!response || !response.text) {
      // Fallback response for graceful degradation
      const fallbackResults = styles.map((f: any, idx: number) => ({
        id: f.id,
        description: `A ${vibe !== "Any" ? vibe.toLowerCase() : "stylish"} take on ${name}, utilizing a natural cursive flow.`,
        svgPathData: fallbackPaths[idx % fallbackPaths.length],
        professionalismScore: vibe === "Professional" ? 95 : Math.floor(Math.random() * 30) + 60,
        uniquenessScore: Math.floor(Math.random() * 30) + 60,
        recommendation: `Great for ${vibe !== "Any" ? vibe.toLowerCase() : "everyday"} correspondence and digital signatures.`
      }));
      return NextResponse.json({ results: fallbackResults });
    }

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Signature Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate styles" }, { status: 500 });
  }
}
