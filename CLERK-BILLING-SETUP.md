# Clerk Billing Setup Guide

## Overview

You're already using Clerk for authentication, and Clerk Billing makes monetization simple by handling payments through Stripe without you needing to manage Stripe directly.

**Benefits**:
- ✅ No Stripe integration code needed
- ✅ Clerk handles subscription management
- ✅ Built-in pricing table component
- ✅ Automatic quota updates via metadata
- ✅ Webhook handling simplified

---

## Current Implementation Status

### ✅ Already Implemented

Your quota system is already set up to work with Clerk Billing:

**File**: `lib/generation-quota.ts`
```typescript
export function getMonthlyGenerationLimit(has: SessionAuthObject["has"]): number {
  if (has({ plan: BILLING_PLAN_KEYS.studio })) {
    return MONTHLY_GENERATION_LIMITS.studio; // 175
  }
  if (has({ plan: BILLING_PLAN_KEYS.pro })) {
    return MONTHLY_GENERATION_LIMITS.pro; // 75
  }
  return MONTHLY_GENERATION_LIMITS.free; // 3
}
```

This uses Clerk's `has()` function to check the user's plan, which Clerk Billing automatically manages!

---

## Setup Steps

### Step 1: Enable Clerk Billing (5 minutes)

1. Go to your Clerk Dashboard: dashboard.clerk.com
2. Navigate to **Billing** in the sidebar
3. Click **Enable Billing**
4. Connect your Stripe account (or create one)

### Step 2: Create Pricing Plans (10 minutes)

In Clerk Dashboard → Billing → Plans:

**Free Plan**:
- Name: `Free`
- Price: $0/month
- Plan ID: `free` (must match `BILLING_PLAN_KEYS.free`)
- Features:
  - 3 generations per month
  - All 6 art styles
  - Basic support

**Pro Plan**:
- Name: `Pro`
- Price: $19/month
- Plan ID: `pro` (must match `BILLING_PLAN_KEYS.pro`)
- Features:
  - 75 generations per month
  - All 6 art styles
  - Priority support
  - Commercial use

**Studio Plan**:
- Name: `Studio`
- Price: $49/month
- Plan ID: `studio` (must match `BILLING_PLAN_KEYS.studio`)
- Features:
  - 175 generations per month
  - All 6 art styles
  - Priority support
  - Commercial use
  - Early access to new features

### Step 3: Add Pricing Table to Your App (Already Done! ✅)

You're already using `<PricingTable />` from Clerk in your pricing section:

**File**: `components/PricingSection.tsx`
```typescript
import { PricingTable } from "@clerk/nextjs";

export function PricingSection() {
  return (
    <section>
      <PricingTable />
    </section>
  );
}
```

**Customization** (optional):
```typescript
<PricingTable
  appearance={{
    elements: {
      // Customize colors to match your brand
      card: "bg-card border-border",
      button: "bg-primary text-primary-foreground",
    },
  }}
/>
```

### Step 4: Configure Webhooks (15 minutes)

Clerk automatically sends webhooks when subscriptions change. You need to handle these to update your database.

**Create webhook handler**:

**File**: `app/api/webhooks/clerk/route.ts`
```typescript
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  // Get webhook secret from Clerk Dashboard
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  // Handle events
  const eventType = evt.type;

  switch (eventType) {
    case "user.created":
      // New user signed up
      console.log("New user:", evt.data.id);
      // Optionally: Send welcome email
      break;

    case "user.updated":
      // User updated their profile or subscription
      console.log("User updated:", evt.data.id);
      // The quota system automatically reads from Clerk metadata
      // No action needed - it just works!
      break;

    case "subscription.created":
      // User subscribed to a plan
      console.log("Subscription created:", evt.data);
      // Optionally: Send thank you email
      break;

    case "subscription.updated":
      // Subscription changed (upgrade/downgrade)
      console.log("Subscription updated:", evt.data);
      // Optionally: Send confirmation email
      break;

    case "subscription.deleted":
      // User cancelled subscription
      console.log("Subscription cancelled:", evt.data);
      // Optionally: Send cancellation email
      break;

    default:
      console.log("Unhandled event type:", eventType);
  }

  return new Response("Webhook processed", { status: 200 });
}
```

**Add to environment variables**:
```bash
CLERK_WEBHOOK_SECRET=whsec_...
```

**Get webhook secret**:
1. Clerk Dashboard → Webhooks
2. Click **Add Endpoint**
3. URL: `https://yourdomain.com/api/webhooks/clerk`
4. Events: Select all `user.*` and `subscription.*` events
5. Copy the signing secret

### Step 5: Install Dependencies

```bash
npm install svix
```

---

## How It Works

### User Flow

```
1. USER VISITS PRICING PAGE
   ↓
2. CLICKS "UPGRADE TO PRO"
   ↓
3. CLERK SHOWS CHECKOUT MODAL
   - Powered by Stripe
   - Secure payment form
   - No redirect needed
   ↓
4. USER ENTERS PAYMENT INFO
   ↓
5. STRIPE PROCESSES PAYMENT
   ↓
6. CLERK UPDATES USER METADATA
   - Sets plan: "pro"
   - Updates subscription status
   ↓
7. WEBHOOK FIRES
   - Your app receives notification
   - Optionally send confirmation email
   ↓
8. USER REDIRECTED TO STUDIO
   - Quota automatically updated
   - has({ plan: "pro" }) returns true
   - User gets 75 generations/month
```

### Quota Check Flow

```
1. USER CLICKS "GENERATE"
   ↓
2. API ROUTE: /api/generate-image
   ↓
3. GET USER'S PLAN
   const { has } = await auth();
   const limit = getMonthlyGenerationLimit(has);
   ↓
4. CHECK QUOTA
   const used = await countGenerationsSince(userId, utcMonthStart());
   if (used >= limit) return 429; // Quota exceeded
   ↓
5. GENERATE IMAGE
   ↓
6. INCREMENT USAGE
   await createGeneration({ ... });
```

**Key Point**: The `has({ plan: "pro" })` function automatically reads from Clerk's metadata, which Clerk Billing updates when subscriptions change. You don't need to manage this!

---

## Testing

### Test Mode (Use This First)

1. Clerk Dashboard → Billing → Settings
2. Enable **Test Mode**
3. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

### Test Flow

1. Create test user account
2. Go to pricing page
3. Click "Upgrade to Pro"
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Verify:
   - User metadata updated (Clerk Dashboard)
   - Quota increased to 75
   - Webhook received (check logs)

### Production Mode

1. Verify everything works in test mode
2. Clerk Dashboard → Billing → Settings
3. Switch to **Production Mode**
4. Update Stripe to live mode
5. Test with real card (small amount)
6. Monitor for issues

---

## Customization

### Custom Pricing Page

If you want more control than `<PricingTable />`:

```typescript
import { useUser } from "@clerk/nextjs";

export function CustomPricingSection() {
  const { user } = useUser();

  const handleUpgrade = async (planId: string) => {
    // Clerk handles the checkout flow
    await user?.update({
      publicMetadata: {
        requestedPlan: planId,
      },
    });

    // Redirect to Clerk's checkout
    window.location.href = `/api/clerk/checkout?plan=${planId}`;
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <PricingCard
        name="Free"
        price="$0"
        features={["3 generations/month"]}
        onSelect={() => handleUpgrade("free")}
      />
      <PricingCard
        name="Pro"
        price="$19"
        features={["75 generations/month"]}
        onSelect={() => handleUpgrade("pro")}
      />
      <PricingCard
        name="Studio"
        price="$49"
        features={["175 generations/month"]}
        onSelect={() => handleUpgrade("studio")}
      />
    </div>
  );
}
```

### Custom Appearance

Match Clerk's UI to your brand:

**File**: `lib/clerk-pricing-appearance.ts` (already exists!)
```typescript
export const clerkPricingAppearance = {
  elements: {
    card: "bg-card border-border rounded-3xl",
    button: "bg-primary text-primary-foreground hover:bg-primary/90",
    badge: "bg-accent text-accent-foreground",
  },
  variables: {
    colorPrimary: "hsl(var(--primary))",
    colorBackground: "hsl(var(--background))",
    colorText: "hsl(var(--foreground))",
  },
};
```

Use it:
```typescript
<PricingTable appearance={clerkPricingAppearance} />
```

---

## Subscription Management

### User Portal

Clerk provides a built-in user portal for subscription management:

```typescript
import { UserButton } from "@clerk/nextjs";

// In your header/nav
<UserButton
  appearance={{
    elements: {
      userButtonAvatarBox: "w-10 h-10",
    },
  }}
  afterSignOutUrl="/"
>
  <UserButton.MenuItems>
    <UserButton.Link
      label="Manage Subscription"
      labelIcon={<CreditCard />}
      href="/api/clerk/billing-portal"
    />
  </UserButton.MenuItems>
</UserButton>
```

Users can:
- View current plan
- Upgrade/downgrade
- Update payment method
- View invoices
- Cancel subscription

### Programmatic Access

Check subscription status in your code:

```typescript
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, has } = await auth();

  const subscription = {
    plan: has({ plan: "studio" })
      ? "studio"
      : has({ plan: "pro" })
        ? "pro"
        : "free",
    isActive: has({ plan: "pro" }) || has({ plan: "studio" }),
  };

  return Response.json(subscription);
}
```

---

## Email Notifications

### Recommended: Resend Integration

Send transactional emails for subscription events:

```bash
npm install resend
```

**File**: `lib/email.ts`
```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: "ImageGen AI <hello@imagegen.ai>",
    to: email,
    subject: "Welcome to ImageGen AI!",
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thanks for signing up. You have 3 free generations to get started.</p>
      <a href="https://imagegen.ai/studio">Start Creating →</a>
    `,
  });
}

export async function sendSubscriptionConfirmation(
  email: string,
  plan: string,
) {
  await resend.emails.send({
    from: "ImageGen AI <billing@imagegen.ai>",
    to: email,
    subject: `Welcome to ${plan} Plan!`,
    html: `
      <h1>Subscription Confirmed</h1>
      <p>You're now on the ${plan} plan.</p>
      <p>Your new quota: ${plan === "pro" ? "75" : "175"} generations/month</p>
    `,
  });
}
```

**Use in webhook**:
```typescript
case "subscription.created":
  await sendSubscriptionConfirmation(
    evt.data.email_addresses[0].email_address,
    evt.data.public_metadata.plan
  );
  break;
```

---

## Monitoring

### Clerk Dashboard

Monitor subscriptions:
1. Clerk Dashboard → Billing
2. View:
   - Active subscriptions
   - Revenue (MRR)
   - Churn rate
   - Failed payments

### Stripe Dashboard

Detailed payment info:
1. Stripe Dashboard: dashboard.stripe.com
2. View:
   - Successful payments
   - Failed payments
   - Refunds
   - Disputes

### Your Analytics

Track conversions:
```typescript
// In your analytics
trackEvent("subscription_created", {
  plan: "pro",
  value: 19,
  currency: "USD",
});
```

---

## Common Issues

### "Quota not updating after payment"

**Solution**: Check webhook is firing
```bash
# Test webhook locally
clerk webhooks test --endpoint http://localhost:3000/api/webhooks/clerk
```

### "User still on free plan after payment"

**Solution**: Verify plan IDs match
- Clerk Dashboard plan ID: `pro`
- Your code: `BILLING_PLAN_KEYS.pro = "pro"`
- Must be exact match (case-sensitive)

### "Webhook verification failed"

**Solution**: Check webhook secret
```bash
# .env
CLERK_WEBHOOK_SECRET=whsec_...  # Must match Clerk Dashboard
```

### "Payment succeeded but user can't generate"

**Solution**: Clear user session
```typescript
// Force session refresh
await clerkClient.users.updateUser(userId, {
  publicMetadata: { lastSync: Date.now() },
});
```

---

## Pricing Strategy

### Recommended Pricing

Based on your costs and market research:

**Free Tier**:
- Price: $0
- Quota: 3 generations
- Purpose: Lead generation, viral growth
- Cost: ~$0.30/user (OpenAI API)

**Pro Tier** (Sweet Spot):
- Price: $19/month
- Quota: 75 generations
- Purpose: Main revenue driver
- Cost: ~$7.50/user (OpenAI API)
- Profit: ~$11.50/user/month

**Studio Tier**:
- Price: $49/month
- Quota: 175 generations
- Purpose: Power users, higher LTV
- Cost: ~$17.50/user (OpenAI API)
- Profit: ~$31.50/user/month

### Pricing Psychology

**Anchoring**: Studio plan makes Pro look affordable
**Value Ladder**: Clear progression (3 → 75 → 175)
**Sweet Spot**: Most users choose middle option (Pro)

### Discounts

**Launch Discount** (First 100 customers):
```
Pro: $19 → $15/month (21% off)
Studio: $49 → $39/month (20% off)
```

**Annual Discount** (Save 2 months):
```
Pro: $228/year → $190/year (17% off)
Studio: $588/year → $490/year (17% off)
```

---

## Revenue Projections

### Conservative (Month 3)
- 500 free users
- 25 Pro subscribers = $475/month
- 5 Studio subscribers = $245/month
- **MRR**: $720/month

### Moderate (Month 6)
- 2,000 free users
- 100 Pro subscribers = $1,900/month
- 20 Studio subscribers = $980/month
- **MRR**: $2,880/month

### Optimistic (Month 12)
- 10,000 free users
- 500 Pro subscribers = $9,500/month
- 100 Studio subscribers = $4,900/month
- **MRR**: $14,400/month

---

## Next Steps

1. **Enable Clerk Billing** (5 min)
   - Dashboard → Billing → Enable

2. **Create Plans** (10 min)
   - Free, Pro, Studio

3. **Add Webhook Handler** (15 min)
   - Create `/api/webhooks/clerk/route.ts`
   - Add `CLERK_WEBHOOK_SECRET` to `.env`

4. **Test in Test Mode** (30 min)
   - Use test card
   - Verify quota updates
   - Check webhook logs

5. **Go Live** (5 min)
   - Switch to production mode
   - Test with real card
   - Monitor for issues

**Total Time**: ~1 hour

---

## Resources

- Clerk Billing Docs: clerk.com/docs/billing
- Stripe Test Cards: stripe.com/docs/testing
- Webhook Testing: clerk.com/docs/webhooks
- Pricing Strategy: stripe.com/guides/pricing

---

**You're almost ready to start making money! 🚀**

The hard part (authentication, quota system) is already done. Just enable Clerk Billing and you're good to go!
