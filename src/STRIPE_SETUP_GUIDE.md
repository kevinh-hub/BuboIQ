# Stripe Setup Guide for BuboIQ

This guide walks you through setting up Stripe products, prices, and webhooks for the BuboIQ billing system.

## Prerequisites

- Stripe account (test mode for development, live mode for production)
- Supabase project with edge functions deployed
- Access to Stripe Dashboard

## Step 1: Create Stripe Products

### Core Subscription Plans

#### 1. Starter Plan
1. Go to Stripe Dashboard → Products → **Create product**
2. Fill in details:
   - **Name**: BuboIQ Starter
   - **Description**: Perfect for small teams getting started with IT intelligence
   - **Pricing model**: Recurring
   - **Price**: $39.00 USD
   - **Billing period**: Monthly
   - **Currency**: USD
3. Click **Save product**
4. Copy the **Price ID** (starts with `price_`) to `.env` as `VITE_STRIPE_PRICE_STARTER`

#### 2. Pro Plan
1. Go to Stripe Dashboard → Products → **Create product**
2. Fill in details:
   - **Name**: BuboIQ Pro
   - **Description**: Advanced features for growing IT operations
   - **Pricing model**: Recurring
   - **Price**: $149.00 USD
   - **Billing period**: Monthly
   - **Currency**: USD
3. Click **Save product**
4. Copy the **Price ID** to `.env` as `VITE_STRIPE_PRICE_PRO`

#### 3. Team Plan
1. Go to Stripe Dashboard → Products → **Create product**
2. Fill in details:
   - **Name**: BuboIQ Team
   - **Description**: Enterprise-grade intelligence for large organizations
   - **Pricing model**: Recurring
   - **Price**: $349.00 USD
   - **Billing period**: Monthly
   - **Currency**: USD
3. Click **Save product**
4. Copy the **Price ID** to `.env` as `VITE_STRIPE_PRICE_TEAM`

### Add-On Products

#### 1. Security & Compliance Add-On
1. Go to Stripe Dashboard → Products → **Create product**
2. Fill in details:
   - **Name**: Security & Compliance Add-On
   - **Description**: Compliance dashboards, policy templates, evidence packs
   - **Pricing model**: Recurring
   - **Price**: $129.00 USD
   - **Billing period**: Monthly
   - **Currency**: USD
3. Click **Save product**
4. Copy the **Price ID** to `.env` as `VITE_STRIPE_PRICE_ADDON_SECURITY`

#### 2. DR/Backup Add-On
1. Go to Stripe Dashboard → Products → **Create product**
2. Fill in details:
   - **Name**: DR/Backup Add-On
   - **Description**: Backup jobs, partner storage hooks, snapshots
   - **Pricing model**: Recurring
   - **Price**: $99.00 USD
   - **Billing period**: Monthly
   - **Currency**: USD
3. Click **Save product**
4. Copy the **Price ID** to `.env` as `VITE_STRIPE_PRICE_ADDON_DR`

#### 3. Remote/Zero-Trust Add-On
1. Go to Stripe Dashboard → Products → **Create product**
2. Fill in details:
   - **Name**: Remote/Zero-Trust Add-On
   - **Description**: Connect policies, MFA, posture, session recording
   - **Pricing model**: Recurring
   - **Price**: $79.00 USD
   - **Billing period**: Monthly
   - **Currency**: USD
3. Click **Save product**
4. Copy the **Price ID** to `.env` as `VITE_STRIPE_PRICE_ADDON_REMOTE`

## Step 2: Set Up Annual Pricing (Optional)

For each product, you can add an annual pricing option with a discount:

1. Go to the product page
2. Click **Add another price**
3. Set:
   - **Price**: (Monthly price × 12 × 0.85) / 12
   - **Billing period**: Monthly
   - **Trial period**: None
4. Update the price ID in your code to use the annual price when `isAnnual` is selected

## Step 3: Configure Stripe Webhooks

### Create Webhook Endpoint

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Fill in details:
   - **Endpoint URL**: `https://[YOUR_PROJECT_ID].supabase.co/functions/v1/stripe-webhook`
   - **Description**: BuboIQ subscription webhooks
4. Click **Select events** and choose:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
5. Click **Add events**
6. Click **Add endpoint**
7. Click **Reveal** on the **Signing secret** and copy it to `.env` as `STRIPE_WEBHOOK_SECRET`

### Test Webhook (Development)

For local testing, use Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local Supabase function
stripe listen --forward-to https://[YOUR_PROJECT_ID].supabase.co/functions/v1/stripe-webhook
```

## Step 4: Enable Customer Portal

1. Go to Stripe Dashboard → **Settings** → **Billing**
2. Scroll to **Customer portal**
3. Click **Activate** or **Configure**
4. Configure settings:
   - **Functionality**:
     - ✅ Update payment method
     - ✅ Update billing information
     - ✅ View invoices
     - ✅ Cancel subscriptions (with option to cancel at period end)
   - **Business information**:
     - **Business name**: BuboIQ
     - **Support email**: support@buboiq.com
     - **Privacy policy URL**: https://buboiq.com/privacy
     - **Terms of service URL**: https://buboiq.com/terms
5. Click **Save**

## Step 5: Configure Payment Settings

### Payment Methods

1. Go to Stripe Dashboard → **Settings** → **Payment methods**
2. Enable:
   - ✅ Cards (Visa, Mastercard, Amex, Discover)
   - ✅ Link (optional - for faster checkout)
   - ✅ ACH (optional - for US customers)

### Tax Settings (Optional)

1. Go to Stripe Dashboard → **Settings** → **Tax**
2. Enable **Stripe Tax** if you need automatic tax calculation
3. Configure tax settings based on your business requirements

## Step 6: Test the Integration

### Test Mode

1. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Requires authentication**: `4000 0025 0000 3155`
2. Use any future expiration date (e.g., `12/34`)
3. Use any 3-digit CVC (e.g., `123`)
4. Use any 5-digit ZIP code (e.g., `12345`)

### Test Workflow

1. Navigate to pricing page
2. Click "Choose Starter"
3. Fill in test card details
4. Complete checkout
5. Verify:
   - ✅ Subscription created in Stripe
   - ✅ Webhook received by your function
   - ✅ Org tier updated in database
   - ✅ Success page displays

### Test Add-Ons

1. Navigate to Settings → Billing
2. Click "Add" on any add-on
3. Complete checkout
4. Verify:
   - ✅ Add-on subscription created
   - ✅ Org addons field updated
   - ✅ "Included" badge shows

### Test Cancellation

1. Open billing portal
2. Click "Cancel subscription"
3. Verify:
   - ✅ Subscription marked for cancellation
   - ✅ Webhook received
   - ✅ Org status updated
   - ✅ Access continues until period end

## Step 7: Go Live

### Pre-Launch Checklist

- [ ] All products created in **Live Mode**
- [ ] All price IDs updated in production `.env`
- [ ] Webhook endpoint pointing to production URL
- [ ] Webhook signing secret from Live Mode
- [ ] Customer portal configured
- [ ] Payment methods enabled
- [ ] Business information complete
- [ ] Legal pages linked (Privacy, Terms)

### Switch to Live Mode

1. Toggle to **Live Mode** in Stripe Dashboard
2. Recreate all products with production pricing
3. Update all environment variables with live keys:
   ```bash
   STRIPE_SECRET_KEY=sk_live_...
   VITE_STRIPE_PRICE_STARTER=price_live_...
   VITE_STRIPE_PRICE_PRO=price_live_...
   VITE_STRIPE_PRICE_TEAM=price_live_...
   VITE_STRIPE_PRICE_ADDON_SECURITY=price_live_...
   VITE_STRIPE_PRICE_ADDON_DR=price_live_...
   VITE_STRIPE_PRICE_ADDON_REMOTE=price_live_...
   STRIPE_WEBHOOK_SECRET=whsec_live_...
   ```
4. Deploy updated environment variables
5. Test with real card (small amount)
6. Refund test transaction

## Pricing Summary

| Product | Price | Type |
|---------|-------|------|
| Starter | $39/mo | Core Plan |
| Pro | $149/mo | Core Plan |
| Team | $349/mo | Core Plan |
| Security & Compliance | $129/mo | Add-On |
| DR/Backup | $99/mo | Add-On |
| Remote/Zero-Trust | $79/mo | Add-On |

## Environment Variables Reference

```bash
# Core Plans
VITE_STRIPE_PRICE_STARTER=price_...
VITE_STRIPE_PRICE_PRO=price_...
VITE_STRIPE_PRICE_TEAM=price_...

# Add-Ons
VITE_STRIPE_PRICE_ADDON_SECURITY=price_...
VITE_STRIPE_PRICE_ADDON_DR=price_...
VITE_STRIPE_PRICE_ADDON_REMOTE=price_...

# Stripe Keys
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Pricing Config
VITE_ANNUAL_FACTOR=0.85
```

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL is correct
2. Verify endpoint is deployed and accessible
3. Check Stripe webhook logs for delivery attempts
4. Ensure signing secret matches

### Checkout Session Not Creating

1. Check Supabase function logs
2. Verify price IDs are correct
3. Ensure STRIPE_SECRET_KEY is set
4. Test with Stripe test mode first

### Tier Not Updating After Payment

1. Check webhook received `checkout.session.completed` event
2. Verify webhook signature validation passed
3. Check database logs for update errors
4. Ensure org_id is being passed correctly

### Customer Portal Not Opening

1. Verify customer portal is activated
2. Check stripe_customer_id exists in database
3. Ensure portal function has correct permissions
4. Check Supabase function logs

## Support

For Stripe-related issues:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- BuboIQ Support: support@buboiq.com

---

**Last Updated**: September 30, 2025
**Version**: 1.0.0