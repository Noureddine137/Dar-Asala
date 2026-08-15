import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(1).max(4000),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all fields with a valid email." }, { status: 400 });
  }

  const { name, email, message } = parsed.data;

  if (process.env.RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Dar Asala <no-reply@darasala.example>",
        to: "hello@darasala.example",
        reply_to: email,
        subject: `New contact form message from ${name}`,
        text: message,
      }),
    }).catch((err) => console.error("Failed to send contact email:", err));
  } else {
    console.log("[contact] RESEND_API_KEY not configured — message logged only:", { name, email, message });
  }

  return NextResponse.json({ ok: true });
}
