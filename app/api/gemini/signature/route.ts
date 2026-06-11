import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// We initialize the SDK safely
let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

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

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { name, fonts, vibe } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: "Invalid name provided." }, { status: 400 });
    }

    const aiClient = getAI();

    const vibeText = vibe && vibe !== "Any" 
      ? `The user requested specifically a "${vibe}" vibe for their signatures. Please heavily skew your analysis, score ratings, and recommendations towards this requested vibe.`
      : '';

    const prompt = `
      Analyze the name "${name}" and generate a signature profile for each of the following font styles.
      For each font, provide a creative description of how the signature looks, score its professionalism and uniqueness out of 100, and recommend a use case.
      
      ${vibeText}

      Font styles to analyze:
      ${JSON.stringify(fonts, null, 2)}
    `;

    let response;
    let attempts = 0;
    let lastError: any;

    while (attempts < 3) {
      try {
        response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          }
        });
        break; // Success
      } catch (err: any) {
        lastError = err;
        attempts++;
        const msg = err?.message || "";
        // If it's a 503 or overload, wait and retry.
        if (msg.toLowerCase().includes("high demand") || msg.toLowerCase().includes("503") || msg.toLowerCase().includes("overloaded")) {
          if (attempts < 3) {
            await new Promise(res => setTimeout(res, 2000 * attempts)); // wait 2s, then 4s
            continue;
          }
        }
        throw err; // Not something we can retry, or out of retries
      }
    }

    if (!response) {
      throw lastError || new Error("Failed to generate content.");
    }

    const text = response.text;
    if (!text) {
        throw new Error("Gemini returned an empty response.");
    }

    const json = JSON.parse(text);
    return NextResponse.json({ results: json });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let errorMsg = error.message || "Failed to generate signature analysis.";
    try {
      // Sometimes the underlying SDK throws a JSON string as the error message.
      if (errorMsg.startsWith('{') || errorMsg.startsWith('[')) {
        const parsed = JSON.parse(errorMsg);
        if (parsed.error && parsed.error.message) {
          errorMsg = parsed.error.message;
        } else if (Array.isArray(parsed) && parsed[0] && parsed[0].error && parsed[0].error.message) {
          errorMsg = parsed[0].error.message;
        }
      }
    } catch (e) {
      // Ignore parsing errors
    }

    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
