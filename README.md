# Wine Marketplace

A two-sided marketplace connecting certified sommeliers with wine lovers through curated monthly wine selections.

## Features

- **For Sommeliers**: Publish monthly curated selections (6 or 12 bottles), earn recurring revenue, build a following
- **For Customers**: Subscribe to sommelier selections, discover new wines, manage deliveries
- **Platform**: Stripe Connect for payments, automated fulfillment, commission sharing

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth v5 (Auth.js) - Email magic links, Google, GitHub
- **Payments**: Stripe Connect (Express)
- **Email**: Resend
- **Deployment**: Vercel
- **UI Components**: Radix UI + custom components

## Project Structure

```
wine-marketplace/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/                   # App Router pages
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth endpoints
│   │   │   └── webhooks/     # Stripe webhooks
│   │   ├── auth/             # Auth pages (signin, error, verify)
│   │   ├── dashboard/        # Protected dashboards
│   │   │   ├── sommelier/    # Sommelier dashboard
│   │   │   ├── customer/     # Customer dashboard
│   │   │   └── admin/        # Admin panel
│   │   ├── selections/       # Public selection browsing
│   │   ├── sommeliers/       # Public sommelier profiles
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Landing page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   └── ui/               # Base UI components
│   ├── lib/
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── prisma.ts         # Prisma client
│   │   ├── stripe.ts         # Stripe client & helpers
│   │   ├── resend.ts         # Resend client & email templates
│   │   ├── utils.ts          # Utility functions
│   │   └── validations.ts    # Zod schemas
│   ├── types/
│   │   ├── next-auth.d.ts    # NextAuth type extensions
│   │   └── stripe.ts         # Stripe types
│   ├── hooks/                # Custom React hooks
│   └── middleware.ts         # Auth middleware
├── .env.example              # Environment template
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- PostgreSQL database (Supabase recommended)
- Stripe account
- Resend account
- Google/GitHub OAuth apps (optional)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd wine-marketplace
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials (see Environment Variables below)

3. **Set up database**
   ```bash
   pnpm db:push
   # or for migrations
   pnpm db:migrate
   ```

4. **Generate Prisma client**
   ```bash
   pnpm db:generate
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   Visit `http://localhost:3000`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) | Yes |
| `NEXTAUTH_SECRET` | Random string (generate: `openssl rand -base64 32`) | Yes |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 for dev) | Yes |
| `RESEND_API_KEY` | Resend API key | Yes |
| `EMAIL_FROM` | Sender email (e.g., noreply@yourdomain.com) | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode) | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (test mode) | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (from `stripe listen`) | For webhooks |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Optional |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | Optional |

### Stripe Connect Setup

1. Create a Stripe account
2. Enable Stripe Connect (Express) in Dashboard
3. Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Select events: `account.updated`, `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`, `payout.*`
5. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

For local development:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Database Schema

Key models:
- **User** - Core authentication (email, role: CUSTOMER/SOMMELIER/ADMIN)
- **Sommelier** - Profile, Stripe Connect account, commission rate
- **Customer** - Profile, referral code, loyalty points
- **Selection** - Monthly curated box (title, description, price, wines)
- **Wine** - Individual wine details
- **Subscription** - Customer ↔ Sommelier/Selection recurring
- **Order** - Individual purchases & subscription renewals
- **Fulfillment** - Packing, labeling, shipping tracking
- **Payout** - Sommelier earnings tracking

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Configure custom domain (MyDomain.com)
5. Deploy

### Database (Supabase)

1. Create Supabase project
2. Enable PostgreSQL
3. Copy connection string to `DATABASE_URL`
4. Run migrations: `pnpm db:migrate` (locally or via CI)

### Email (Resend)

1. Create Resend account
2. Verify domain or use `onboarding@resend.dev` for testing
3. Add API key to `RESEND_API_KEY`
3. Add sender email to `EMAIL_FROM`

## Development Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:push          # Push schema changes (dev)
pnpm db:migrate       # Create & run migrations
pnpm db:studio        # Open Prisma Studio
pnpm db:generate      # Generate Prisma client

# Stripe
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Project Status

### ✅ Completed
- [x] Project structure & configuration
- [x] Prisma schema (complete marketplace models)
- [x] NextAuth v5 setup (Email, Google, GitHub)
- [x] Stripe Connect integration (types, helpers, webhooks)
- [x] Resend email templates (magic link, welcome, orders)
- [x] Landing page with hero, features, stats, CTA
- [x] Auth pages (signin, verify-request, error, onboarding)
- [x] Dashboard layouts (sommelier, customer, admin)
- [x] Public pages (selections, sommeliers)
- [x] Base UI components (Button, Input, Label, Card)

### 🚧 Next Steps
- [ ] Selection detail page with wine list
- [ ] Sommelier profile page with selections
- [ ] Sommelier onboarding flow (profile → Stripe → first selection)
- [ ] Customer subscription management
- [ ] Admin sommelier approval workflow
- [ ] Fulfillment management UI
- [ ] Email notifications for all events
- [ ] Tests (unit, integration, e2e)
- [ ] CI/CD pipeline
- [ ] Production deployment

## License

Private - All rights reserved