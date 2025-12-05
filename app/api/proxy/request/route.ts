import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { method, url, headers, body } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const response = await fetch(url, {
      method,
      headers: headers || {},
      body: body ? JSON.stringify(body) : undefined,
    })

    const responseData = await response.text()
    
    let parsedData
    try {
        parsedData = JSON.parse(responseData)
    } catch {
        parsedData = responseData
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: parsedData,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Request Failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
