// src/lib/resend.ts
import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)
export const emailFrom = process.env.EMAIL_FROM || "Wine Marketplace <noreply@yourdomain.com>"

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  return resend.emails.send({
    from: emailFrom,
    to,
    subject,
    html,
    text,
  })
}

// Email templates
export function magicLinkEmail(url: string, userName?: string) {
  return {
    subject: "Sign in to Wine Marketplace",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: system-ui; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1a1a2e; padding: 40px; border-radius: 12px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 28px;">🍷 Wine Marketplace</h1>
          </div>
          <div style="padding: 40px; background: #fff;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Welcome back${userName ? `, ${userName}` : ""}!</h2>
            <p style="color: #4a4a4a; font-size: 16px;">Click the button below to sign in. This link expires in 24 hours.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${url}" style="background: #8b0000; color: #fff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Sign In to Wine Marketplace</a>
            </div>
            <p style="color: #888; font-size: 14px; text-align: center;">Or copy this link:<br/><a href="${url}" style="color: #8b0000; word-break: break-all;">${url}</a></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #888; font-size: 12px; text-align: center;">If you didn't request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `,
    text: `Welcome back${userName ? `, ${userName}` : ""}! Sign in to Wine Marketplace: ${url}`,
  }
}

export function welcomeEmail(userName: string, role: "CUSTOMER" | "SOMMELIER", dashboardUrl: string) {
  const isSommelier = role === "SOMMELIER"
  return {
    subject: "Welcome to Wine Marketplace! 🍷",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: system-ui; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1a1a2e; padding: 40px; border-radius: 12px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 28px;">🍷 Wine Marketplace</h1>
          </div>
          <div style="padding: 40px; background: #fff;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Welcome to Wine Marketplace, ${userName}!</h2>
            <p style="color: #4a4a4a; font-size: 16px;">${isSommelier
              ? "You're now part of an exclusive community of sommeliers sharing their curated selections with wine lovers worldwide."
              : "Discover hand-picked wine selections from world-class sommeliers, delivered to your door."
            }</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${dashboardUrl}" style="background: #8b0000; color: #fff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">${isSommelier ? "Create Your First Selection" : "Explore Selections"}</a>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function orderConfirmationEmail(params: {
  orderNumber: string
  customerName: string
  sommelierName: string
  selectionTitle: string
  boxSize: "SIX" | "TWELVE"
  totalCents: number
  currency: string
  shipsAt?: Date
  dashboardUrl: string
}) {
  const formatPrice = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: params.currency }).format(cents / 100)
  return {
    subject: `Order Confirmed - ${params.orderNumber} 🍷`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: system-ui; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1a1a2e; padding: 40px; border-radius: 12px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 28px;">🍷 Wine Marketplace</h1>
          </div>
          <div style="padding: 40px; background: #fff;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Order Confirmed!</h2>
            <p style="color: #4a4a4a; font-size: 16px;">Hi ${params.customerName}, your order <strong>#${params.orderNumber}</strong> has been confirmed.</p>
            <div style="background: #f8f8f8; padding: 24px; border-radius: 8px; margin: 24px 0;">
              <h3 style="margin-top: 0; color: #1a1a2e;">${params.selectionTitle}</h3>
              <p style="margin: 8px 0; color: #4a4a4a;">Curated by <strong>${params.sommelierName}</strong></p>
              <p style="margin: 8px 0; color: #4a4a4a;">${params.boxSize} bottle box</p>
              <p style="margin: 8px 0; color: #4a4a4a;"><strong>Total: ${formatPrice(params.totalCents)}</strong></p>
              ${params.shipsAt ? `<p style="margin: 8px 0; color: #4a4a4a;">Estimated ship date: ${params.shipsAt.toLocaleDateString()}</p>` : ""}
            </div>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${params.dashboardUrl}" style="background: #8b0000; color: #fff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">View Order Details</a>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}