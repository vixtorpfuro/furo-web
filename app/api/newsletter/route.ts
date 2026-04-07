import { NextResponse } from 'next/server'

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!
const MAILCHIMP_DC = process.env.MAILCHIMP_API_KEY?.split('-')[1]

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

  const res = await fetch(
    `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `apikey ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: ['website'],
        merge_fields: {
          FNAME: '',
          LNAME: '',
          PHONE: '',
          MMERGE5: '',
          MMERGE7: '',
          MMERGE8: '',
        },
      }),
    }
  )

  if (res.ok) return NextResponse.json({ ok: true })

  const data = await res.json()
  if (data.title === 'Member Exists') return NextResponse.json({ ok: true })
  return NextResponse.json({ error: data.detail }, { status: 400 })
}