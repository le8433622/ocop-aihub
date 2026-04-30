# Environment Variables

## Required Variables

### Database
- `DATABASE_URL` - PostgreSQL connection string (Supabase)

### Supabase
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key

### Authentication
- `JWT_SECRET` - Secret for JWT token generation

### AI Provider
- `NVAPI_TOKEN` - NVIDIA API token for AIHub

## Optional Variables

### Email (Resend)
- `RESEND_API_KEY` - Resend API key for sending emails

### Payments (Stripe)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

### App Configuration
- `NEXT_PUBLIC_APP_URL` - Public URL of the app (default: https://ocop-aihub.vercel.app)

## Setup in Vercel

```bash
vercel env add DATABASE_URL
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add JWT_SECRET
vercel env add NVAPI_TOKEN
vercel env add RESEND_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_APP_URL
```

## Supabase Storage

Create a storage bucket named `product-images` in Supabase dashboard for product image uploads.