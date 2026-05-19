import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, city } = await req.json()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }
  if (!city || !city.trim()) {
    return NextResponse.json({ error: 'City required' }, { status: 400 })
  }

  try {
    const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, city }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Loops error:', res.status, text)
      return NextResponse.json({ error: 'Failed to add contact' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Loops request failed:', err)
    return NextResponse.json({ error: 'Network error' }, { status: 500 })
  }
}
