import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

function getEnv(name: string) {
  const val = process.env[name]
  if (!val) throw new Error(`Missing environment variable: ${name}`)
  return val
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name: string = body?.name?.toString().trim()
    const email: string = body?.email?.toString().trim()
    const message: string = body?.message?.toString().trim()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    const host = getEnv("SMTP_HOST")
    const port = Number(getEnv("SMTP_PORT"))
    const user = getEnv("SMTP_USER")
    const pass = getEnv("SMTP_PASS")
    const to = getEnv("CONTACT_TO_EMAIL")
    const from = process.env.SMTP_FROM_EMAIL || user

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: `New message from ${name} via Portfolio Contact Form`,
      text: `From: ${name} <${email}>
\nMessage:\n${message}`,
      html: `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
          <h2 style="margin:0 0 12px;">New Contact Form Message</h2>
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    const message = err?.message || "Failed to send email"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}