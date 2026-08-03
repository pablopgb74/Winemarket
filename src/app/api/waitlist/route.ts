// src/app/api/waitlist/route.ts
import { resend } from "@/lib/resend"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const waitlistSchema = z.object({
  email: z.string().email("Email inválido"),
  type: z.enum(["customer", "sommelier"]),
  name: z.string().optional(),
  instagram: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validation = waitlistSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validation.error.flatten() }, { status: 400 })
    }

    const { email, type, name, instagram, message } = validation.data

    // Email a ti (notificación)
    await resend.emails.send({
      from: "Wine Marketplace <onboarding@resend.dev>",
      to: "pablopgb.ar@gmail.com",
      subject: `🍷 Nueva inscripción: ${type === "customer" ? "Cliente" : "Sommelier"}`,
      html: `
        <h2>Nueva inscripción en waitlist</h2>
        <p><strong>Tipo:</strong> ${type === "customer" ? "🍷 Cliente" : "🎓 Sommelier"}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${name ? `<p><strong>Nombre:</strong> ${name}</p>` : ""}
        ${instagram ? `<p><strong>Instagram:</strong> @${instagram}</p>` : ""}
        ${message ? `<p><strong>Mensaje:</strong> ${message}</p>` : ""}
        <hr>
        <p><small>Fecha: ${new Date().toLocaleString()}</small></p>
      `,
    })

    // Email de confirmación al usuario
    const userSubject = type === "customer" 
      ? "¡Gracias por unirte a Wine Marketplace! 🍷"
      : "¡Bienvenido sommelier! 🎓"

    const userHtml = type === "customer"
      ? `
        <h1>¡Gracias por unirte a Wine Marketplace! 🍷</h1>
        <p>Te avisaremos cuando lancemos las primeras cajas curadas por sommeliers de clase mundial.</p>
        <p>Mientras tanto, síguenos en Instagram para novedades.</p>
        <p>Salud,<br>El equipo de Wine Marketplace</p>
      `
      : `
        <h1>¡Bienvenido a Wine Marketplace, ${name || "sommelier"}! 🎓</h1>
        <p>Nos encanta que quieras compartir tus selecciones con nuestra comunidad.</p>
        <p>Te contactaremos pronto para contarte cómo funciona: comisión transparente, wallet propia, liquidación bi-mensual.</p>
        <p>Salud,<br>El equipo de Wine Marketplace</p>
      `

    await resend.emails.send({
      from: "Wine Marketplace <onboarding@resend.dev>",
      to: email,
      subject: userSubject,
      html: userHtml,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Waitlist error:", error)
    return NextResponse.json({ error: "Error al procesar" }, { status: 500 })
  }
}