import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAI(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not configured");
  return new OpenAI({ apiKey: key });
}

const SYSTEM_PROMPT = `You are a scientific illustration AI assistant. When generating images, create clean, professional, publication-ready scientific figures suitable for academic papers and presentations. Use clear labels, consistent color schemes, and high contrast. Style: modern scientific illustration with clean lines, minimal decoration, white or light background, and professional typography.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, style, size } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return NextResponse.json({ error: "Please provide a descriptive prompt (at least 5 characters)." }, { status: 400 });
    }

    const openai = getOpenAI();

    // Build the enhanced prompt
    const styleMap: Record<string, string> = {
      "scientific": "Clean scientific illustration style, publication-ready, white background, professional labels and annotations, high contrast, suitable for academic journal.",
      "diagram": "Technical diagram style, clean vector-like lines, labeled components, flowchart arrows, white background, professional scientific diagram.",
      "microscopy": "Scientific microscopy illustration style, cellular structures, organelles, cross-sections, professional biological illustration with labels.",
      "molecular": "Molecular biology illustration, protein structures, DNA/RNA, molecular pathways, clean scientific style with professional annotations.",
      "clinical": "Clinical/medical illustration style, anatomical accuracy, clean professional medical figure, suitable for clinical paper.",
      "graphical-abstract": "Graphical abstract style for journal cover, clean modern scientific illustration, key findings visualized, professional and eye-catching.",
    };

    const styleGuide = styleMap[style] || styleMap["scientific"];
    const enhancedPrompt = `${SYSTEM_PROMPT}\n\nStyle: ${styleGuide}\n\nUser request: ${prompt}`;

    const sizeMap: Record<string, "1024x1024" | "1792x1024" | "1024x1792"> = {
      "square": "1024x1024",
      "landscape": "1792x1024",
      "portrait": "1024x1792",
    };

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: sizeMap[size] || "1024x1024",
      quality: "hd",
      style: "natural",
    });

    const imageUrl = response.data?.[0]?.url;
    const revisedPrompt = response.data?.[0]?.revised_prompt;

    if (!imageUrl) {
      return NextResponse.json({ error: "Failed to generate image." }, { status: 500 });
    }

    return NextResponse.json({
      imageUrl,
      revisedPrompt,
      model: "dall-e-3",
      size: sizeMap[size] || "1024x1024",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Figure generation error:", message);

    if (message.includes("OPENAI_API_KEY")) {
      return NextResponse.json({ error: "OpenAI API key not configured. Add OPENAI_API_KEY to environment variables." }, { status: 503 });
    }
    if (message.includes("billing") || message.includes("quota")) {
      return NextResponse.json({ error: "OpenAI API quota exceeded. Check your billing settings." }, { status: 429 });
    }
    if (message.includes("content_policy")) {
      return NextResponse.json({ error: "Content policy violation. Please modify your prompt." }, { status: 400 });
    }

    return NextResponse.json({ error: `Generation failed: ${message}` }, { status: 500 });
  }
}
