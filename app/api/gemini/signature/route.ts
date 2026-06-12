import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import opentype from 'opentype.js';

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

const fontUrls = [
  'https://fonts.gstatic.com/s/caveat/v23/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9eIWpZw.woff',
  'https://fonts.gstatic.com/s/dancingscript/v29/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup6.woff',
  'https://fonts.gstatic.com/s/pacifico/v23/FwZY7-Qmy14u9lezJ-6H6M8.woff',
  'https://fonts.gstatic.com/s/satisfy/v22/rP2Hp2yn6lkG50LoCZOIGw.woff',
  'https://fonts.gstatic.com/s/sacramento/v17/buEzpo6gcdjy0EiZMBUG4C0f-w.woff',
  'https://fonts.gstatic.com/s/greatvibes/v21/RWmMoKWR9v4ksMfaWd_JN9XFiaI.woff',
  'https://fonts.gstatic.com/s/allura/v23/9oRPNYsQpS4zjuA_iwgQ.woff',
  'https://fonts.gstatic.com/s/parisienne/v14/E21i_d3kivvAkxhLEVZpQyhwCQ.woff',
  'https://fonts.gstatic.com/s/yellowtail/v25/OZpGg_pnoDtINPfRIlLohlvHxw.woff',
  'https://fonts.gstatic.com/s/alexbrush/v23/SZc83FzrJKuqFbwMKk6EhUXz6w.woff'
];

async function generateSvgPath(url: string, text: string): Promise<string> {
  const maxSize = 450;
  const maxHeight = 150;
  
  try {
    const fontResponse = await fetch(url);
    if (!fontResponse.ok) return '';
    const fontBuffer = await fontResponse.arrayBuffer();
    const font = opentype.parse(fontBuffer);
    
    // Find optimal font size
    let fontSize = 120;
    let path = font.getPath(text, 0, 0, fontSize);
    let bbox = path.getBoundingBox();
    let width = bbox.x2 - bbox.x1;
    let height = bbox.y2 - bbox.y1;
    
    if (width > maxSize || height > maxHeight) {
       const scale = Math.min(maxSize / width, maxHeight / height);
       fontSize = fontSize * scale;
       path = font.getPath(text, 0, 0, fontSize);
       bbox = path.getBoundingBox();
       width = bbox.x2 - bbox.x1;
       height = bbox.y2 - bbox.y1;
    }

    // Center it in a 500x200 canvas
    const startX = (500 - width) / 2 - bbox.x1;
    const startY = (200 - height) / 2 - bbox.y1;
    const finalPath = font.getPath(text, startX, startY, fontSize);
    
    // Custom serialization to avoid NaN issues in opentype.js
    return finalPath.commands.map(cmd => {
        if (cmd.type === 'M') return 'M' + cmd.x + ',' + cmd.y;
        if (cmd.type === 'L') return 'L' + cmd.x + ',' + cmd.y;
        if (cmd.type === 'Q') return 'Q' + cmd.x1 + ',' + cmd.y1 + ' ' + cmd.x + ',' + cmd.y;
        if (cmd.type === 'C') return 'C' + cmd.x1 + ',' + cmd.y1 + ' ' + cmd.x2 + ',' + cmd.y2 + ' ' + cmd.x + ',' + cmd.y;
        if (cmd.type === 'Z') return 'Z';
        return '';
    }).join(' ');
  } catch (e) {
    console.error('Font fetch error', e);
    return '';
  }
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
      We are generating 10 handwritten signature profiles for the name "${name}".
      ${vibeText}
      
      For each of the following categorical styles, generate a distinct, authentic signature profile.
      Provide a highly realistic description. You do NOT need to provide the SVG, just the profile scores and text.
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
              professionalismScore: { type: Type.INTEGER },
              uniquenessScore: { type: Type.INTEGER },
              recommendation: { type: Type.STRING }
            },
            required: ["id", "description", "professionalismScore", "uniquenessScore", "recommendation"]
          }
        }
      },
      required: ["results"]
    };

    let aiData: any = null;
    try {
      const aiClient = getAI();
      const apiCall = aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.8,
        }
      });
      
      let timeoutId: NodeJS.Timeout | null = null;
      const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error("Timeout Exceeded")), 15000);
      });

      const response = await Promise.race([apiCall, timeout]) as any;
      if (timeoutId) clearTimeout(timeoutId);
      
      if (response && response.text) {
        aiData = JSON.parse(response.text);
      }
    } catch (err: any) {
      console.error("GenAI Generation Error or Timeout:", err?.message || err);
    }

    // Generate SVGs
    const finalResults = await Promise.all(styles.map(async (style: any, idx: number) => {
       const aiMatching = aiData?.results?.find((r: any) => r.id === style.id) || {
          id: style.id,
          description: `A ${vibe !== "Any" ? vibe.toLowerCase() : "stylish"} take on ${name}, utilizing a natural cursive flow.`,
          professionalismScore: vibe === "Professional" ? 95 : Math.floor(Math.random() * 30) + 60,
          uniquenessScore: Math.floor(Math.random() * 30) + 60,
          recommendation: `Great for ${vibe !== "Any" ? vibe.toLowerCase() : "everyday"} correspondence and digital signatures.`
       };
       
       const fontUrl = fontUrls[idx % fontUrls.length];
       const svgPathData = await generateSvgPath(fontUrl, name);
       
       return {
         ...aiMatching,
         svgPathData: svgPathData || "M 50 120 C 30 40, 80 180, 120 100 S 160 80, 200 120 Q 220 140, 240 100 C 260 60, 280 150, 320 110 S 360 80, 400 120 Q 420 140, 450 100 C 470 70, 480 130, 490 110"
       };
    }));

    return NextResponse.json({ results: finalResults });

  } catch (error: any) {
    console.error("Signature Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate styles" }, { status: 500 });
  }
}
