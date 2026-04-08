# Image Generation SaaS - Application Flow Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [User Journey](#user-journey)
4. [Image Upload Flow](#image-upload-flow)
5. [Image Generation Flow](#image-generation-flow)
6. [Quota Management](#quota-management)
7. [Database Schema](#database-schema)
8. [Key Components](#key-components)
9. [API Routes](#api-routes)
10. [State Management](#state-management)

---

## Architecture Overview

This is a Next.js 16 application built with:
- **Frontend**: React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Next.js API Routes (App Router)
- **Authentication**: Clerk
- **Database**: PostgreSQL with Drizzle ORM
- **Image Storage**: ImageKit CDN
- **AI Generation**: OpenAI DALL-E (via Vercel AI SDK)
- **Monitoring**: Sentry
- **Styling**: Motion (Framer Motion), custom design system

### Tech Stack
```
┌─────────────────────────────────────────┐
│           Next.js 16 (App Router)       │
├─────────────────────────────────────────┤
│  Frontend          │  Backend           │
│  - React 19        │  - API Routes      │
│  - TypeScript      │  - Server Actions  │
│  - Tailwind CSS 4  │  - Middleware      │
│  - shadcn/ui       │                    │
├────────────────────┼────────────────────┤
│  Authentication    │  Database          │
│  - Clerk           │  - PostgreSQL      │
│                    │  - Drizzle ORM     │
├────────────────────┼────────────────────┤
│  Image Storage     │  AI Generation     │
│  - ImageKit CDN    │  - OpenAI DALL-E   │
│                    │  - Vercel AI SDK   │
└────────────────────┴────────────────────┘
```

---

## Authentication & Authorization

### Clerk Integration

**Authentication Provider**: Clerk handles all user authentication
- Sign up / Sign in flows
- Session management
- User profile management
- OAuth providers support

**Authorization Levels**:
```typescript
// Billing plans with generation limits
const BILLING_PLAN_KEYS = {
  free: "free",    // 3 generations/month
  pro: "pro",      // 75 generations/month
  studio: "studio" // 175 generations/month
}
```

**Protected Routes**:
- `/studio` - Protected by Clerk middleware in `proxy.ts`
- API routes check `auth()` for valid `userId`

**Middleware Flow** (`proxy.ts`):
```typescript
// Protects /studio routes
const isProtectedRoute = createRouteMatcher(['/studio(.*)']);

clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
```

---

## User Journey

### 1. Landing Page (`app/page.tsx`)
```
User visits homepage
  ↓
Views marketing sections:
  - Hero with animated background
  - How It Works section
  - Gallery Showcase
  - Testimonials
  - Pricing tiers
  - Footer
  ↓
Clicks "Get Started" or "Try Studio"
  ↓
Redirected to /studio (requires auth)
```

### 2. Studio Page (`app/studio/page.tsx`)
```
User authenticated via Clerk
  ↓
Server-side data fetching:
  - Load user's generation history
  - Calculate quota (limit, used, remaining)
  ↓
Render StudioWorkbench with:
  - initialHistory: past generations
  - initialQuota: monthly limits
  - clerkUserId: for API calls
```

---

## Image Upload Flow

### Step-by-Step Process

```
┌─────────────────────────────────────────────────────────┐
│ 1. USER SELECTS IMAGE FILE                              │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 2. FILE STORED IN LOCAL STATE                           │
│    - File object stored in React state                  │
│    - Preview generated via URL.createObjectURL()        │
│    - Displayed in preview panel                         │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 3. USER CLICKS "GENERATE"                               │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 4. GET IMAGEKIT AUTH PARAMS                             │
│    GET /api/upload                                      │
│    Returns: { token, expire, signature, publicKey }    │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 5. UPLOAD TO IMAGEKIT                                   │
│    - Client-side upload using @imagekit/next           │
│    - File uploaded to: /users/{userId}/uploads/         │
│    - Returns CDN URL                                    │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 6. STORE UPLOAD RESULT                                  │
│    uploadedSource = {                                   │
│      imageUrl: "https://ik.imagekit.io/...",           │
│      originalFileName: "photo.jpg",                     │
│      sourceMimeType: "image/jpeg"                       │
│    }                                                    │
└─────────────────────────────────────────────────────────┘
```

### Upload API Route (`/api/upload`)

**Purpose**: Generate secure upload credentials for ImageKit

```typescript
// GET /api/upload
export async function GET() {
  // 1. Verify user is authenticated
  const { userId } = await auth();
  if (!userId) return 401;
  
  // 2. Generate ImageKit upload auth params
  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  });
  
  // 3. Return credentials to client
  return { token, expire, signature, publicKey };
}
```

**Security**: 
- Server-side only (private key never exposed)
- Time-limited tokens
- User-specific folder paths

---

## Image Generation Flow

### Complete Generation Pipeline

```
┌──────────────────────────────────────────────────────────────┐
│ 1. USER SUBMITS GENERATION REQUEST                           │
│    - Source image uploaded to ImageKit                       │
│    - Style preset selected (e.g., "Storybook 3D")           │
│    - AI model selected (e.g., "gpt-4o-2024-08-06")          │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. POST /api/generate-image                                  │
│    Request body: {                                           │
│      sourceImageUrl: "https://ik.imagekit.io/...",         │
│      sourceMimeType: "image/jpeg",                          │
│      originalFileName: "photo.jpg",                         │
│      styleSlug: "storybook-3d",                             │
│      model: "gpt-4o-2024-08-06"                             │
│    }                                                         │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. AUTHENTICATION CHECK                                      │
│    - Verify userId from Clerk                                │
│    - Get user's billing plan (free/pro/studio)              │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. QUOTA VALIDATION                                          │
│    - Count generations this month                            │
│    - Check against plan limit                                │
│    - Return 429 if quota exceeded                            │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. INPUT VALIDATION                                          │
│    - Verify source image URL exists                          │
│    - Check MIME type (jpg/png/webp only)                    │
│    - Validate style preset exists                            │
│    - Verify model is supported                               │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. FETCH SOURCE IMAGE                                        │
│    - Download image from ImageKit CDN                        │
│    - Convert to Buffer for processing                        │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 7. INFER IMAGE SIZE                                          │
│    - Use Sharp to read image metadata                        │
│    - Calculate aspect ratio                                  │
│    - Determine OpenAI size parameter:                        │
│      • aspectRatio > 1.08 → "1536x1024" (landscape)         │
│      • aspectRatio < 0.92 → "1024x1536" (portrait)          │
│      • else → "1024x1024" (square)                          │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 8. BUILD AI PROMPT                                           │
│    - Get style preset prompt                                 │
│    - Add constraints:                                        │
│      "Do not add extra people, extra limbs,                 │
│       duplicate subjects, or change camera angle"           │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 9. CALL OPENAI API (via Vercel AI SDK)                      │
│    - Wrapped in Sentry span for monitoring                   │
│    - Parameters:                                             │
│      • model: selected OpenAI model                          │
│      • prompt: { images: [buffer], text: prompt }           │
│      • size: inferred size                                   │
│      • providerOptions:                                      │
│        - input_fidelity: "high"                             │
│        - quality: "medium"                                   │
│        - output_format: "png"                               │
│        - user: userId (for OpenAI tracking)                 │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 10. RECEIVE GENERATED IMAGE                                  │
│     - Base64 encoded PNG                                     │
│     - Usage metrics (tokens)                                 │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 11. UPLOAD RESULT TO IMAGEKIT                                │
│     - Convert base64 to Buffer                               │
│     - Upload to: /users/{userId}/results/                    │
│     - Filename: {styleSlug}-result.png                       │
│     - Returns CDN URL                                        │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 12. SAVE TO DATABASE                                         │
│     INSERT INTO generations:                                 │
│     - id: UUID (auto-generated)                              │
│     - clerkUserId                                            │
│     - originalFileName                                       │
│     - sourceImageUrl                                         │
│     - resultImageUrl                                         │
│     - styleSlug, styleLabel                                  │
│     - model                                                  │
│     - promptUsed                                             │
│     - createdAt (auto-generated)                             │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 13. RETURN RESPONSE TO CLIENT                                │
│     {                                                        │
│       imageBase64: "...",                                    │
│       mimeType: "image/png",                                 │
│       promptUsed: "...",                                     │
│       style: { slug, label },                                │
│       model: "...",                                          │
│       savedGeneration: { ...dbRecord }                       │
│     }                                                        │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 14. CLIENT UPDATES UI                                        │
│     - Display generated image                                │
│     - Add to history list                                    │
│     - Update quota (used + 1, remaining - 1)                │
│     - Log success to Sentry                                  │
└──────────────────────────────────────────────────────────────┘
```

### Error Handling

```typescript
// Quota exceeded
if (usedThisMonth >= monthlyLimit) {
  return {
    error: "Monthly generation limit reached",
    code: "QUOTA_EXCEEDED",
    limit, used
  } // 429 status
}

// API errors
catch (APICallError) {
  return { error: error.message } // OpenAI API error
}

catch (NoImageGeneratedError) {
  return { error: "Model did not return an image" } // 502
}

catch (error) {
  return { error: "Generation failed" } // 500
}
```

---

## Quota Management

### Billing Plans & Limits

```typescript
const MONTHLY_GENERATION_LIMITS = {
  free: 3,      // Free tier
  pro: 75,      // Pro subscription
  studio: 175   // Studio subscription
}
```

### Quota Calculation Flow

```
┌─────────────────────────────────────────┐
│ 1. Get user's billing plan from Clerk  │
│    has({ plan: "pro" }) → true/false   │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 2. Determine monthly limit              │
│    getMonthlyGenerationLimit(has)       │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 3. Count generations this month         │
│    SELECT COUNT(*) FROM generations     │
│    WHERE clerkUserId = ?                │
│    AND createdAt >= utcMonthStart()     │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 4. Calculate remaining                  │
│    remaining = limit - used             │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│ 5. Return quota snapshot                │
│    { limit, used, remaining }           │
└─────────────────────────────────────────┘
```

### Month Start Calculation

```typescript
// Returns first day of current month at 00:00:00 UTC
function utcMonthStart() {
  const n = new Date();
  return new Date(Date.UTC(
    n.getUTCFullYear(),
    n.getUTCMonth(),
    1, 0, 0, 0, 0
  ));
}
```

**Why UTC?**: Ensures consistent quota resets regardless of user timezone

---

## Database Schema

### Generations Table

```sql
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  original_file_name TEXT,
  source_image_url TEXT NOT NULL,
  result_image_url TEXT NOT NULL,
  style_slug TEXT NOT NULL,
  style_label TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_used TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_generations_user_date 
  ON generations(clerk_user_id, created_at DESC);
```

### Drizzle Schema (`db/schema.ts`)

```typescript
export const generations = pgTable("generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull(),
  originalFileName: text("original_file_name"),
  sourceImageUrl: text("source_image_url").notNull(),
  resultImageUrl: text("result_image_url").notNull(),
  styleSlug: text("style_slug").notNull(),
  styleLabel: text("style_label").notNull(),
  model: text("model").notNull(),
  promptUsed: text("prompt_used").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Database Operations (`db/generations.ts`)

```typescript
// Count generations since a date
countGenerationsSince(userId, since: Date)
  → SELECT COUNT(*) WHERE userId AND createdAt >= since

// List user's generation history
listUserGenerationSummaries(userId)
  → SELECT * WHERE userId ORDER BY createdAt DESC

// Create new generation record
createGeneration(input)
  → INSERT INTO generations RETURNING *
```

---

## Key Components

### 1. StudioWorkbench (`components/studio/workbench.tsx`)

**Purpose**: Main container for the studio interface

```typescript
<StudioWorkbenchProvider>
  <form onSubmit={handleSubmit}>
    <StudioControlsPanel />  // Left side: upload, style, model
    <StudioPreviewPanel />   // Right side: preview, result
    <HistoryPreviewDialog /> // Modal for viewing history
  </form>
</StudioWorkbenchProvider>
```

### 2. StudioWorkbenchContext (`components/context/StudioWorkbenchContext.tsx`)

**Purpose**: Centralized state management for studio

**State**:
```typescript
{
  // File management
  file: File | null,
  sourcePreview: string | null,
  uploadedSource: UploadedSource | null,
  
  // Generation state
  result: GenerationResult | null,
  resultPreview: string | null,
  isLoading: boolean,
  error: string | null,
  
  // User data
  history: GenerationHistorySummaryItem[],
  quota: GenerationQuotaSnapshot,
  
  // UI state
  selectedStyle: string,
  selectedModel: OpenAiImageModel,
  viewedHistoryItem: GenerationHistorySummaryItem | null,
}
```

**Key Methods**:
- `handleSubmit()` - Orchestrates upload + generation
- `replaceFile()` - Updates selected file
- `selectStyle()` - Changes style preset
- `selectModel()` - Changes AI model
- `openHistoryPreview()` - Views past generation
- `closeHistoryPreview()` - Closes modal

### 3. ControlsPanel (`components/studio/controls-panel.tsx`)

**Features**:
- File upload dropzone
- Style preset selector (6 presets)
- AI model selector
- Quota display
- Generate button

### 4. PreviewPanel (`components/studio/preview-panel.tsx`)

**Features**:
- Source image preview
- Generated result preview
- Download button
- History grid (past generations)

---

## API Routes

### `/api/upload` (GET)

**Purpose**: Generate ImageKit upload credentials

**Flow**:
```
Client → GET /api/upload
         ↓
      Check auth
         ↓
   Generate ImageKit auth params
         ↓
      Return credentials
```

**Response**:
```json
{
  "token": "...",
  "expire": 1234567890,
  "signature": "...",
  "publicKey": "..."
}
```

### `/api/generate-image` (POST)

**Purpose**: Generate AI-styled image

**Request**:
```json
{
  "sourceImageUrl": "https://...",
  "sourceMimeType": "image/jpeg",
  "originalFileName": "photo.jpg",
  "styleSlug": "storybook-3d",
  "model": "gpt-4o-2024-08-06"
}
```

**Response** (Success):
```json
{
  "imageBase64": "iVBORw0KGgo...",
  "mimeType": "image/png",
  "promptUsed": "Transform the uploaded image...",
  "style": {
    "slug": "storybook-3d",
    "label": "Storybook 3D"
  },
  "model": "gpt-4o-2024-08-06",
  "savedGeneration": {
    "id": "uuid",
    "clerkUserId": "user_...",
    "sourceImageUrl": "https://...",
    "resultImageUrl": "https://...",
    "createdAt": "2024-03-15T10:30:00Z",
    ...
  }
}
```

**Response** (Quota Exceeded):
```json
{
  "error": "Monthly generation limit reached (3 images)...",
  "code": "QUOTA_EXCEEDED",
  "limit": 3,
  "used": 3
}
```

---

## State Management

### Client-Side State Flow

```
┌─────────────────────────────────────────┐
│ StudioWorkbenchContext                  │
│ (React Context + useState)              │
├─────────────────────────────────────────┤
│ • file: File | null                     │
│ • uploadedSource: UploadedSource | null │
│ • result: GenerationResult | null       │
│ • history: GenerationHistorySummaryItem[]│
│ • quota: GenerationQuotaSnapshot        │
│ • isLoading: boolean                    │
│ • error: string | null                  │
└─────────────────────────────────────────┘
           ↓ provides to
┌─────────────────────────────────────────┐
│ useStudioWorkbench() hook               │
│ (consumed by child components)          │
└─────────────────────────────────────────┘
           ↓ used by
┌─────────────────────────────────────────┐
│ • StudioControlsPanel                   │
│ • StudioPreviewPanel                    │
│ • HistoryPreviewDialog                  │
└─────────────────────────────────────────┘
```

### State Updates

**File Selection**:
```typescript
replaceFile(file)
  → setFile(file)
  → setUploadedSource(null)  // Clear previous upload
  → setResult(null)           // Clear previous result
  → setError(null)            // Clear errors
```

**Generation Success**:
```typescript
handleSubmit() success
  → setResult(generationResult)
  → setHistory([newGen, ...oldHistory])
  → setQuota({ used: used + 1, remaining: remaining - 1 })
  → setIsLoading(false)
```

**Generation Error**:
```typescript
handleSubmit() error
  → setResult(null)
  → setError(errorMessage)
  → setIsLoading(false)
  → (optionally update quota if quota exceeded)
```

---

## Style Presets

### Available Styles

```typescript
const stylePresets = [
  {
    slug: "storybook-3d",
    label: "Storybook 3D",
    description: "Soft cinematic lighting with polished 3D storybook detail",
    prompt: "Transform into premium storybook-inspired 3D illustration..."
  },
  {
    slug: "anime-cel",
    label: "Anime Cel",
    description: "Clean cel shading with expressive color",
    prompt: "Restyle as high-end anime cel art..."
  },
  {
    slug: "clay-render",
    label: "Clay Render",
    description: "Handcrafted clay texture with sculpted forms",
    prompt: "Turn into handcrafted clay-render scene..."
  },
  {
    slug: "pixart",
    label: "Pixart",
    description: "Bright family-animation styling with polished 3D charm",
    prompt: "Transform into premium family-animation-inspired 3D..."
  },
  {
    slug: "voxel-block",
    label: "Voxel Block",
    description: "Chunky block-built styling with playful forms",
    prompt: "Transform into premium voxel block-world illustration..."
  },
  {
    slug: "marble-sculpture",
    label: "Marble Sculpture",
    description: "Elegant carved-stone portraiture with refined texture",
    prompt: "Transform into refined marble sculpture portrait..."
  }
];
```

### Prompt Engineering

Each style preset includes:
1. **Base prompt**: Describes the desired artistic style
2. **Preservation instructions**: Maintain subject identity, pose, framing
3. **Constraints**: Added to all prompts to prevent unwanted changes

```typescript
const finalPrompt = [
  preset.prompt,
  "Do not add extra people, extra limbs, duplicate subjects, " +
  "or change the overall camera angle."
].join("\n\n");
```

---

## Environment Variables

### Required Variables

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# ImageKit CDN
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...

# OpenAI
OPEN_AI_API_KEY=sk-proj-...

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Sentry (optional)
SENTRY_AUTH_TOKEN=...
```

---

## Deployment Checklist

### Database Setup
1. Create PostgreSQL database
2. Set `DATABASE_URL` environment variable
3. Run `npm run db:push` to create tables

### External Services
1. **Clerk**: Configure application, add redirect URLs
2. **ImageKit**: Create account, get API keys
3. **OpenAI**: Create API key with billing enabled
4. **Sentry**: Create project, get DSN

### Build & Deploy
```bash
npm install
npm run build
npm start
```

---

## Performance Optimizations

### Image Processing
- **Sharp**: Fast image metadata reading
- **Aspect ratio detection**: Optimizes OpenAI API usage
- **Buffer handling**: Efficient memory usage

### Caching
- **ImageKit CDN**: Global edge caching for images
- **Next.js**: Static page caching where possible

### Database
- **Indexes**: On `(clerkUserId, createdAt)` for fast queries
- **Connection pooling**: Via Drizzle ORM

---

## Security Considerations

### Authentication
- All API routes verify `userId` from Clerk
- Protected routes use middleware
- Session-based authentication

### API Keys
- Private keys never exposed to client
- Server-side only operations
- Environment variable management

### Image Upload
- Time-limited upload tokens
- User-specific folder isolation
- MIME type validation
- File size limits (via ImageKit)

### Rate Limiting
- Monthly quota enforcement
- Per-user generation tracking
- Graceful quota exceeded handling

---

## Monitoring & Logging

### Sentry Integration

**Tracked Events**:
```typescript
// Upload auth issued
Sentry.logger.info("imagekit.upload_auth_issued");

// Generation completed
Sentry.logger.info("generation.completed", {
  generationId, styleSlug, model
});

// Quota exceeded
Sentry.logger.warn("generation.quota_exceeded", {
  limit, used
});

// Generation succeeded (client)
Sentry.logger.info("studio.generation_succeeded", {
  styleSlug, model
});
```

**Performance Monitoring**:
```typescript
// Wrap OpenAI calls in Sentry spans
Sentry.startSpan({
  name: `image edit ${model}`,
  op: "gen_ai.request",
  attributes: {
    "gen_ai.request.model": model,
    "gen_ai.usage.input_tokens": inputTokens,
    "gen_ai.usage.output_tokens": outputTokens,
  }
}, async () => {
  // OpenAI API call
});
```

---

## Future Enhancements

### Potential Features
- [ ] Batch generation (multiple images at once)
- [ ] Custom style training
- [ ] Image-to-image variations
- [ ] Advanced editing tools (inpainting, outpainting)
- [ ] Social sharing features
- [ ] Generation templates/presets
- [ ] API access for developers
- [ ] Webhook notifications
- [ ] Team collaboration features
- [ ] Generation analytics dashboard

---

## Troubleshooting

### Common Issues

**"Unauthorized" error**:
- Check Clerk configuration
- Verify environment variables
- Clear cookies and re-authenticate

**"Quota exceeded"**:
- Check current plan limits
- Verify database connection
- Check `utcMonthStart()` calculation

**"Upload failed"**:
- Verify ImageKit credentials
- Check file size limits
- Validate MIME type

**"Generation failed"**:
- Check OpenAI API key
- Verify API quota/billing
- Check image format compatibility
- Review Sentry logs for details

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio

# Linting
npm run lint
```

---

**Last Updated**: 2024
**Version**: 1.0.0
