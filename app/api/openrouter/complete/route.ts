import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = "openai/gpt-3.5-turbo", parameters } = await req.json()

    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      )
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://flowforge.app", // Optional, for including your app on openrouter.ai rankings.
        "X-Title": "FlowForge", // Optional. Shows in rankings on openrouter.ai.
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        ...parameters
      }),
    })

    if (!response.ok) {
        const errorData = await response.text();
        return NextResponse.json(
            { error: `OpenRouter API error: ${response.statusText}`, details: errorData },
            { status: response.status }
        )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error("AI Node Execution Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
