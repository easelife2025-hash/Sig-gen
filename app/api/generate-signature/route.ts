import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { details, style } = await req.json();

    const prompt = `
      You are an expert web designer specializing in email signatures.
      Create a visually stunning, responsive, and professional HTML email signature.
      
      User Details:
      - Name: ${details.name || 'John Doe'}
      - Title: ${details.title || 'Professional'}
      - Company: ${details.company || ''}
      - Phone: ${details.phone || ''}
      - Email: ${details.email || ''}
      - Website: ${details.website || ''}
      - Profile Image URL: ${details.photoUrl || ''}
      - Primary Color: ${details.color || '#000000'}

      Selected Style: ${style || 'Modern Glassmorphism'}

      Requirements:
      - Output ONLY valid, clean HTML code wrapped in a single <div> container.
      - Use ONLY inline CSS styles (no <style> tags).
      - Do NOT output any markdown blocks or formatting (e.g. \`\`\`html).
      - Ensure the layout is a standard email signature structure (e.g., photo on left, details on right, or clean vertical stack) matching the 'Selected Style' requested.
      - Make it look premium, modern, and aligned perfectly.
      - Only include the fields that are provided above.
      - Do not include random content, wrap the output purely in the HTML elements.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let html = response.text || "";
    // Clean up possible markdown wrapping from the model
    if (html.startsWith("\`\`\`html")) {
      html = html.replace(/^\`\`\`html\n?/, "");
    }
    if (html.startsWith("\`\`\`")) {
      html = html.replace(/^\`\`\`\n?/, "");
    }
    html = html.replace(/\n?\`\`\`$/, "");
    
    return NextResponse.json({ signatureHtml: html.trim() });
  } catch (error: any) {
    console.error("Error generating signature:", error);
    return NextResponse.json(
      { error: "Failed to generate signature." },
      { status: 500 }
    );
  }
}
