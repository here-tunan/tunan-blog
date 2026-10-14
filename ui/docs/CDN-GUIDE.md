# Adding a CDN to tunan.fun — A Complete Guide

A from-scratch walkthrough of what a CDN is, why this blog needs one, how to set up Cloudflare, and how to verify it's actually working.

Target audience: yourself, six months from now, when you've forgotten what any of this means.

---

## Table of Contents

1. [What a CDN is and why we need one](#1-what-a-cdn-is-and-why-we-need-one)
2. [How CDNs work — the theory](#2-how-cdns-work--the-theory)
3. [The cache lifecycle and `stale-while-revalidate`](#3-the-cache-lifecycle-and-stale-while-revalidate)
4. [Why HTML caching is the point](#4-why-html-caching-is-the-point)
5. [Current state of tunan.fun (baseline)](#5-current-state-of-tunanfun-baseline)
6. [The plan](#6-the-plan)
7. [Step-by-step: Cloudflare setup](#7-step-by-step-cloudflare-setup)
8. [Step-by-step: fixing the `no-store` header](#8-step-by-step-fixing-the-no-store-header)
9. [Step-by-step: caching images](#9-step-by-step-caching-images)
10. [How to test that it works](#10-how-to-test-that-it-works)
11. [What happens when you change content](#11-what-happens-when-you-change-content)
12. [Cache purging playbook](#12-cache-purging-playbook)
13. [The China caveat](#13-the-china-caveat)
14. [Glossary](#14-glossary)

---

## 1. What a CDN is and why we need one

A **CDN (Content Delivery Network)** is a network of servers spread around the world that store cached copies of your website. When a user visits, they get served by the nearest server, not your origin.

### The core problem: distance = time

Data on the internet travels at roughly ⅔ the speed of light through fiber. That's fast, but not instant:

- New York → London: ~70 ms round-trip minimum (physics)
- New York → Shanghai: ~200 ms round-trip minimum
- Each HTTP request needs multiple round-trips: DNS, TCP handshake, TLS handshake, request, response = **5–8 round-trips** before the user sees anything

So a user in Shanghai loading a US-hosted blog waits ~1–1.5 seconds just for network overhead, **before** the server does any actual work. This is called **latency**, and you cannot fix it by buying a bigger internet pipe. You can only fix it by moving the data closer to the user.

### Why tunan.fun specifically needs this

The blog is hosted on a **US server**, but readers are in **both China and the rest of the world**. Every reader currently pays the full transcontinental latency cost on every page load. A CDN eliminates most of it.

---

## 2. How CDNs work — the theory

Two mechanisms working together.

### Mechanism 1 — Anycast routing

Cloudflare has ~300 data centers worldwide, and they all announce the **same IP address** to the internet. This is called **Anycast**. When a user's request goes out, internet routers automatically send it to the topologically nearest Cloudflare data center. No configuration needed — it just works because of how BGP routing works.

- User in Shanghai → hits Hong Kong POP (~40 ms)
- User in Berlin → hits Frankfurt POP (~10 ms)
- User in Virginia → hits Ashburn POP (~5 ms)

### Mechanism 2 — Edge caching

Each Cloudflare data center has a large disk cache. When a request arrives:

```
User → Edge server → Is this URL cached and fresh?
                     ├─ YES: return cached copy immediately (10–50 ms)
                     └─ NO:  fetch from origin, store copy, return to user
                             (first user pays the slow cost; everyone after is fast)
```

The response header `cf-cache-status` tells you which happened:

| Value | Meaning |
|---|---|
| `MISS` | Not in cache, fetched from origin |
| `HIT` | Served from edge cache (goal ✓) |
| `EXPIRED` | Had it but TTL ran out, refetched |
| `BYPASS` | A rule said "don't cache this" |
| `DYNAMIC` | Cloudflare decided the URL looks non-cacheable |
| `REVALIDATED` | Stale copy checked with origin, still valid |

### What makes something cacheable

The CDN decides based on:

1. **File extension** by default: `.jpg`, `.css`, `.js`, `.woff2` → yes. Extensionless URLs like `/blog/hello` → no.
2. **HTTP response headers from the origin server:**
   - `Cache-Control: public, s-maxage=3600` → cache at CDN for 1 hour
   - `Cache-Control: private, no-store` → never cache
3. **Cache Rules configured in the Cloudflare dashboard** (override the above).

**Key insight:** the origin server tells the CDN what's cacheable via headers. The CDN just obeys. This is why we set `Cache-Control` in Next.js.

### The cache key

Cloudflare identifies a cached response by:
`hostname + path + query string`

So `example.com/blog/hello` and `example.com/blog/hello?utm=twitter` are two different cache entries by default.

---

## 3. The cache lifecycle and `stale-while-revalidate`

Given the header:

```
Cache-Control: public, s-maxage=60, stale-while-revalidate=3600
```

- **Fresh window:** 0–60 s (serve from cache, no origin call)
- **Stale-but-usable (SWR) window:** 60–3660 s (serve stale immediately, background-refetch)
- **After 3660 s:** treated as expired, next request is a full MISS

### Timeline example

Say you edit an article on the origin at T=0.

```
T=0s     You edit article on origin. CDN has OLD copy (age = 0s).

T=30s    User A visits.
         → cf-cache-status: HIT
         → Sees OLD content (within 60s fresh window).
         → No origin call.

T=70s    User B visits. Age is 70s (past s-maxage=60, in SWR window).
         → CDN returns OLD content to User B (instant).
         → cf-cache-status: STALE/REVALIDATED
         → In background: CDN fetches NEW content from origin.
         → Background fetch completes at ~T=70.3s. Cache now holds NEW.
         → Timer resets: fresh again for 60s.

T=71s    User C visits.
         → cf-cache-status: HIT
         → Sees NEW content. ✓
```

**Answer to a common question:** yes, the very next visit after the background revalidation completes gets fresh content. The revalidator (User B in this example) is the only one who sees stale.

**Edge case:** if User B refreshes immediately (T=70.1s) before the background fetch finishes, they see stale again. The window is usually 200–500 ms — invisible to real users.

**Important:** revalidation only happens when a user visits. If nobody visits for 500 s after your edit, the first visitor at T=500 s still sees stale, and their visit triggers the refresh.

---

## 4. Why HTML caching is the point

A common misconception: "CDNs cache static files like images and CSS."

Actually, the reason HTML caching matters most for a blog:

- **CSS/JS**: loaded once per site visit and browser-cached for a long time. Caching at CDN helps first-time visitors but has small ongoing impact.
- **HTML**: fetched on **every page navigation**. This is the file that determines TTFB. Caching HTML at the edge is what turns a 1.5-second TTFB into 50 ms.

### Why Cloudflare doesn't cache HTML by default

Cloudflare's default rules cache by file extension: `.css .js .jpg .png .gif .ico .woff2 .pdf .zip .mp4 .svg .webp`. Notice `.html` is not there, and your URLs like `/blog/hello` have no extension at all.

To Cloudflare, an extensionless URL could be:

- ✓ A static blog article (safe to cache)
- ✗ A user dashboard (disaster — user A sees user B's data)
- ✗ A shopping cart (disaster)
- ✗ A login-protected page (disaster)

So the safe default is: **don't cache extensionless URLs unless explicitly told to.**

We tell it in two possible ways:

1. **Origin sends `Cache-Control: public, s-maxage=…`** — Cloudflare respects it and caches.
2. **A Cloudflare Cache Rule** in the dashboard matches the URL pattern and forces caching.

Either works. We'll use option 1 because it's version-controlled in the repo.

### But wait — the content comes from the backend, right?

A common (and correct!) intuition:

> "A blog list page's content is decided by the backend API. If we cache the page, don't we risk showing outdated data?"

Yes — and the answer is a controlled trade-off. Let's walk through it.

#### The naive request flow (SSR, the current state)

Right now every request goes:

```
User → Next.js server → backend API → render HTML → return
       (each user pays the full cost, every time)
```

Every visitor triggers a fresh backend call and a full render. Two users arriving 100 ms apart do the exact same expensive work.

#### What caching actually stores

The cache doesn't store "data". It stores the **entire rendered HTML page** — data fetched, DOM built, CSS classes applied, everything — as a single string. That snapshot is what the CDN serves.

```
Without cache
├─ User A: fetch backend + render (1500 ms)
├─ User B: fetch backend + render (1500 ms)   ← duplicate work
├─ User C: fetch backend + render (1500 ms)   ← duplicate work

With cache (revalidate: 60)
├─ User A: fetch + render (1500 ms) → store snapshot
├─ User B: return snapshot (50 ms)   ← doesn't touch backend
├─ User C: return snapshot (50 ms)   ← doesn't touch backend
...
[60 seconds later]
├─ User E: snapshot stale → fetch + render (1500 ms) → new snapshot
├─ User F: return new snapshot (50 ms)
```

#### When does new content appear?

That's exactly what `revalidate: 60` controls:

```
T=0s     You publish a new article on the backend.
T=0s     Next.js has an OLD snapshot (doesn't know yet).
T=10s    User visits → OLD snapshot (article not visible)
T=30s    User visits → OLD snapshot (article not visible)
T=61s    User visits → snapshot stale, refetch backend, render new HTML, store
T=62s    User visits → NEW snapshot (article visible ✓)
```

**A new article takes at most 60 seconds to appear in the list.** For a blog, that's fine — well within RSS-reader latency and social-share replication delay.

If that's unacceptable, either lower the value (e.g. `revalidate: 10`), or add an explicit purge on publish (Section 12).

#### The three Next.js rendering modes

Understanding these three unlocks the whole design:

| Mode | Trigger | Behavior | Trade-off |
|---|---|---|---|
| **SSR** | `cache: 'no-store'` | Render on every request | Always fresh, always slow |
| **SSG** | default (no options) | Render once at build time | Instant, but stuck stale until rebuild |
| **ISR** | `next: { revalidate: N }` | Render once + auto-refresh every N seconds | Fast + eventually fresh |

The blog is currently on SSR (the slowest). Section 8 switches us to ISR (the balanced default).

Think of ISR as **"SSR with a 60-second auto-cache."**

#### The two-layer cache stack

Once Section 8 is done, cacheable pages get two layers of caching:

```
                    [ Go backend ]
                          ↑
                  (queried only when
                   ISR TTL expires)
                          ↑
                  [ Next.js server (US) ]
                    ISR snapshot cache
                    TTL = revalidate: 60
                          ↑
                  (queried only when
                   edge TTL expires)
                          ↑
            [ Cloudflare, 300 edge POPs ]
                    Edge cache
                    TTL = s-maxage=60
                          ↑
    ┌──────────┬─────────┴─────────┬──────────┐
    │          │                   │          │
 Shanghai    Berlin             New York   Sydney
```

- **Layer 1** (Next.js ISR) controlled by `next: { revalidate: N }` in fetch calls.
- **Layer 2** (Cloudflare edge) controlled by `Cache-Control: s-maxage=N` in `next.config.mjs`.

Use the same number at both layers for consistency: `60` here means "at most 60 s of staleness at any layer."

#### How often does the backend actually get called?

The intuition-vs-math check most people get wrong:

- 1000 visits/day, no cache → backend called ~1000 times
- 1000 visits/day, ISR + CDN with 60 s TTL → backend called **about once per minute at most**, regardless of visitor count

More visitors doesn't mean more backend calls — because 99 %+ hit Cloudflare's cache without ever touching the origin. The origin is only queried when the CDN's edge cache has expired *and* the Next.js snapshot has expired *and* a user actually asks.

For a low-traffic blog, this can mean **10× fewer backend calls than today**, even while serving pages faster.

#### One-line summary

> The backend decides content. The cache decides how often we ask the backend. Right now we ask on every request. We're moving to "ask at most once per minute."

### What about other frameworks?

The exact API differs, but every serious framework has an equivalent to ISR:

| Framework | Static generation | Incremental / on-demand refresh |
|---|---|---|
| **Next.js** (React) | `fetch()` without options; `generateStaticParams` | `next: { revalidate: N }` |
| **Nuxt** (Vue) | `nuxt generate` (full SSG) | **route rules** in `nuxt.config.ts` — `swr: 60`, `isr: 60`, or `cache: { maxAge: 60 }` |
| **SvelteKit** | `prerender = true` in `+page.ts` | `export const config = { isr: { expiration: 60 } }` (on Vercel) |
| **Astro** | default; every page is static | `export const prerender = false` + server output; SSR + edge cache |
| **Remix** | not built-in | `Cache-Control` headers in the `loader` — same shape as `s-maxage` |
| **VitePress / Docusaurus / Hugo / Jekyll** | pure SSG, built to static HTML | rebuild + redeploy |

#### If you were building this in Vue / Nuxt

Nuxt 3's version of `revalidate: 60` lives in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  routeRules: {
    '/blog':          { swr: 60 },              // like ISR: refresh every 60 s
    '/blog/**':       { swr: 3600 },
    '/api/**':        { cors: true, cache: false },
    '/':              { swr: 60 },
  },
})
```

The mental model is identical to what this guide describes for Next.js — only the syntax changes. `s-maxage` and `stale-while-revalidate` at the HTTP layer work exactly the same everywhere; that's why the Cloudflare side of this guide is framework-agnostic.

#### What if it's a plain Vue SPA (no Nuxt)?

Pure client-side Vue (or React with Vite, no SSR) has no HTML to cache meaningfully — every route serves the same `index.html`, and everything happens in the browser after the JS loads. Cloudflare will happily cache that `index.html` plus all the JS bundles (great!), but there's no "backend snapshot" to worry about — data fetching happens client-side, so freshness is decided by the browser's `fetch`, not the CDN.

If SEO matters (search engines seeing article content), you eventually need Nuxt, SSR, or SSG. That's a separate decision from the CDN.

---

## 5. Current state of tunan.fun (baseline)

Live measurement of `https://tunan.fun/zh-CN` from a US machine, before any CDN work:

```
DNS lookup:     3 ms
TCP connect:    3 ms
TLS handshake:  893 ms       ← slow
TTFB:           1560 ms      ← very slow (target: <200 ms)
Total:          1560 ms
```

Response headers:

```
Server: nginx/1.18.0 (Ubuntu)                                              ← direct to origin, no CDN
X-Powered-By: Next.js
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate     ← forbids caching everywhere
```

### Three findings

1. **No CDN in front.** The `Server: nginx` header (not `cloudflare`) proves every request hits the US server directly. No `cf-ray`, no `cf-cache-status`.
2. **Next.js is telling every cache "DO NOT CACHE."** The `no-store` header is the strictest possible refusal. Even after Cloudflare is set up, unless this is fixed, every request will show `cf-cache-status: BYPASS`.
3. **Slow TLS handshake (~900 ms).** TLS negotiates between the user and the US server. With Cloudflare, TLS terminates at the nearest edge (~20–50 ms away), saving ~500–800 ms on the first request alone.

### Why the `no-store` header is there

Next.js applies `no-store` to any page that renders **dynamically** — usually because the page code does something at request-time. In `lib/articles.ts`:

```ts
const response = await fetch(`${API_URL}/article/list`, {
  method: 'POST',
  ...
  cache: 'no-store',      // ← forces the page to be dynamic
});
```

`cache: 'no-store'` on a `fetch()` opts the page out of Next.js's static rendering. Every visitor triggers a fresh call to the Go backend, and the resulting HTML response also carries `no-store`, telling every downstream cache (browser, CDN) to skip it.

Four files currently use this pattern:

- `lib/articles.ts` (blog list — used on homepage and `/blog`)
- `app/[locale]/projects/page.tsx`
- `app/[locale]/about/page.tsx`
- `app/components/home/ProjectsSection.tsx`

The article detail page (`lib/articles.ts:getArticle`) is already fine — it uses `next: { revalidate: 300 }` (5-minute ISR), which is compatible with caching.

---

## 6. The plan

Three phases, in order of impact:

| Phase | What | Impact | Effort |
|---|---|---|---|
| 1 | Put Cloudflare in front of the domain (proxied DNS) | ~40% TTFB reduction globally (TLS termination + static asset caching) | 30 min |
| 2 | Fix `Cache-Control` so HTML pages can be cached | ~80% TTFB reduction on cached pages (goes from 1500 ms to 50 ms) | 1–2 hrs |
| 3 | Optimize images (`next/image` + long-cache headers) | Faster article page loads | later |

Do them in this order. Don't skip phase 1 to jump to phase 2 — you need Cloudflare receiving traffic first, otherwise there's no cache to fill.

---

## 7. Step-by-step: Cloudflare setup

### 7.1 Sign up and add the site

1. Go to https://cloudflare.com and create an account.
2. Dashboard → **Add a site** → enter `tunan.fun`.
3. Choose the **Free plan**.
4. Cloudflare scans existing DNS records from the domain. Verify they match what's in the current registrar (all A/AAAA records pointing to the US server, MX records if using email on the domain, etc.).

### 7.2 Change nameservers at the domain registrar

1. Cloudflare shows two nameservers, e.g. `dana.ns.cloudflare.com` and `rick.ns.cloudflare.com`.
2. Log in to the registrar (wherever `tunan.fun` was purchased).
3. Replace the current nameservers with the two Cloudflare provided.
4. Save.

Propagation takes 5 minutes to 24 hours. Cloudflare will email when the site is active.

### 7.3 Verify DNS records are proxied

In Cloudflare dashboard → **DNS → Records**:

- The A/AAAA record for `@` (root) and `www` should have the **orange cloud** icon ON (Proxied).
- Orange cloud = traffic goes through Cloudflare edge.
- Grey cloud = DNS-only, traffic goes direct to origin (no CDN benefit).

MX and TXT records should stay grey cloud (email/verification records should not be proxied).

### 7.4 SSL/TLS settings

Dashboard → **SSL/TLS → Overview**:

- Encryption mode: **Full (strict)** if the origin already serves HTTPS with a valid cert (nginx currently does).
- If the origin only has HTTP, use **Flexible** temporarily — but plan to install a cert on the origin. **Flexible** is insecure long-term.

Dashboard → **SSL/TLS → Edge Certificates**:

- Enable **Always Use HTTPS** (redirects HTTP → HTTPS at the edge).
- Enable **Automatic HTTPS Rewrites** (fixes mixed-content links).

### 7.5 Verify Cloudflare is in front

From a terminal:

```bash
curl -sI https://tunan.fun/zh-CN | grep -iE "^(server|cf-)"
```

Expected:

```
Server: cloudflare
cf-ray: 8a2b1c...-HKG
cf-cache-status: DYNAMIC        # still "not cached" — normal until phase 2
```

If `Server: cloudflare` is present, phase 1 is done. TTFB should already have dropped noticeably because of TLS termination at the edge.

---

## 8. Step-by-step: fixing the `no-store` header

The goal: the HTML response for cacheable pages should send

```
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
```

instead of `no-store`.

### 8.1 Understand which pages are safe to cache

| Route | Content | Cacheable? | Strategy |
|---|---|---|---|
| `/` and `/[locale]` (homepage) | Article list | Yes, briefly | ISR, 60–300 s |
| `/[locale]/blog` (blog list) | Article list | Yes, briefly | ISR, 60–300 s |
| `/[locale]/blog/[slug]` (article) | Single article | Yes, longer | ISR, 300–3600 s (already using 300 s ✓) |
| `/[locale]/projects` | Project list | Yes, briefly | ISR, 300 s |
| `/[locale]/about` | Mostly static | Yes, longer | ISR, 3600 s |
| `/api/*` | Dynamic API | No | Leave as-is |
| `/admin/*`, `/login/*` | Private | Never | Leave as-is |

"Briefly" here means "long enough to absorb most visitor traffic without hitting the origin, but short enough that new articles appear quickly." One minute is a good default; combine with an explicit purge-on-publish for instant updates.

### 8.2 Replace `cache: 'no-store'` with `revalidate` in fetch calls

For each `fetch()` with `cache: 'no-store'`, decide the freshness need and switch to `next: { revalidate: N }` where N is seconds.

**File: `lib/articles.ts`** (blog list):

```ts
// Before
const response = await fetch(`${API_URL}/article/list`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type, pageSize, pageIndex, languageCode: locale }),
  cache: 'no-store',
});

// After
const response = await fetch(`${API_URL}/article/list`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type, pageSize, pageIndex, languageCode: locale }),
  next: { revalidate: 60 },       // regenerate the page every 60s at most
});
```

Do the same for the three other files. Suggested values:

- `lib/articles.ts` (list): `revalidate: 60`
- `app/[locale]/projects/page.tsx`: `revalidate: 300`
- `app/[locale]/about/page.tsx`: `revalidate: 3600`
- `app/components/home/ProjectsSection.tsx`: `revalidate: 300`

### 8.3 Add explicit `Cache-Control` in `next.config.mjs`

Even with ISR, we should set explicit CDN cache headers so Cloudflare treats the response predictably. Edit `ui/next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      // Article pages: cache at edge 1h, allow stale for 1 day
      {
        source: '/:locale/blog/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      // Blog list, homepage, projects, about: cache briefly
      {
        source: '/:locale(zh-CN|en)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=3600' },
        ],
      },
      {
        source: '/:locale/blog',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=3600' },
        ],
      },
      {
        source: '/:locale/projects',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/:locale/about',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      // Never cache API responses served through Next
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-cache, no-store, max-age=0, must-revalidate' },
        ],
      },
      // Static assets served from /public
      {
        source: '/:path*.:ext(svg|jpg|jpeg|png|webp|avif|gif|ico|woff2|woff|ttf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 8.4 Rebuild and deploy

```bash
cd ui
npm run build
npm run start        # or however the current deploy works (deploy.sh)
```

### 8.5 Verify the headers on the origin

```bash
curl -sI https://tunan.fun/zh-CN/blog | grep -i cache-control
```

Expected:

```
Cache-Control: public, s-maxage=60, stale-while-revalidate=3600
```

Not `no-store` anymore ✓

### 8.6 Verify Cloudflare is caching

Run the same URL twice:

```bash
curl -sI https://tunan.fun/zh-CN/blog | grep -i cf-cache-status
sleep 2
curl -sI https://tunan.fun/zh-CN/blog | grep -i cf-cache-status
```

Expected:

```
cf-cache-status: MISS
cf-cache-status: HIT           ✓
```

If the second is still `MISS` or `DYNAMIC`, something is wrong. Common causes:

- Origin is still sending `no-store` (recheck 8.5).
- Cloudflare is set to Development Mode (dashboard → Caching → Configuration → turn off).
- A Page Rule or Cache Rule is forcing `Bypass`.

---

## 9. Step-by-step: caching images

Article images are the second-biggest contributor to slow page loads.

### 9.1 Use `next/image` for images inside articles

If article Markdown currently renders `<img>` tags via `react-markdown`, add a custom component that swaps them for `next/image`:

```tsx
// In the markdown renderer components
import Image from 'next/image';

const components = {
  img: ({ src, alt }) => (
    <Image
      src={src}
      alt={alt || ''}
      width={800}
      height={600}
      style={{ width: '100%', height: 'auto' }}
      loading="lazy"
    />
  ),
};
```

Benefits:

- Serves WebP/AVIF to modern browsers (30–50% smaller than JPG).
- Generates multiple sizes for different screen widths.
- Lazy-loads below-the-fold images.

### 9.2 The static asset headers in `next.config.mjs` (from 8.3) already handle image caching

Once Cloudflare is in front, image responses from `/public/*` and Next's `/_next/image` are cached with `max-age=31536000, immutable` — Cloudflare caches them at the edge for effectively forever, and browsers cache them locally too.

### 9.3 Optional later: move images to Cloudflare R2

If images grow to many GB and origin bandwidth becomes a cost concern, move them to R2 (Cloudflare's S3-compatible object storage, free 10 GB). Update image URLs to point at the R2 bucket. This offloads bandwidth entirely from the origin.

Do this only if bandwidth becomes a real problem. It's not needed at current scale.

---

## 10. How to test that it works

### 10.1 The `curl` cache-hit test (fastest feedback loop)

```bash
# First request: expect MISS
curl -sI https://tunan.fun/zh-CN/blog/some-article | grep -iE "cf-cache-status|age"

sleep 2

# Second request: expect HIT
curl -sI https://tunan.fun/zh-CN/blog/some-article | grep -iE "cf-cache-status|age"
```

Watch `age` grow across repeated calls — it's how long the current cached copy has been sitting there. When it crosses `s-maxage`, expect `STALE` or `REVALIDATED`, then a reset to near-zero after the background refresh.

### 10.2 Timing test

```bash
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s   Total: %{time_total}s\n" \
  https://tunan.fun/zh-CN/blog/some-article
```

Run twice — the second should be dramatically faster (edge cache HIT).

### 10.3 WebPageTest (multi-region truth)

https://www.webpagetest.org/ — run tests from:

- Virginia, USA (baseline near the origin)
- Frankfurt, Germany (European users)
- Shanghai, China (Chinese users)

Compare **before Cloudflare** and **after Cloudflare + cache fix**. Look at the waterfall — the initial HTML request's TTFB is the number that should drop from ~1500 ms to ~50–200 ms.

### 10.4 PageSpeed Insights

https://pagespeed.web.dev/ — good for the Core Web Vitals score, but note:

- The **field data** section requires enough real Chrome users (28-day window). Small blogs often show "No Data" — this is a stats threshold issue, not a bug.
- The **lab data** should always run. If it doesn't, the URL may be timing out or redirecting oddly.

Try running it on a specific article URL rather than the homepage — often more reliable.

### 10.5 Cloudflare Analytics (the real truth)

Dashboard → **Analytics & Logs → Traffic**:

- **Cached vs. Uncached requests** — the cache hit ratio should climb toward 80%+ once phase 2 is done.
- **Bandwidth saved** — how much traffic never touched the origin.
- **Requests by country** — validates that the site is being served globally.

This is the real-user data. Synthetic tests can lie; this is what actual visitors experience.

### 10.6 The four metrics that matter

| Metric | Meaning | Good target |
|---|---|---|
| TTFB | Time to first byte of HTML | < 200 ms globally |
| LCP | Largest Contentful Paint | < 2.5 s |
| Cache hit ratio | % of requests served from edge | > 80% for a blog |
| Bandwidth to origin | Data the origin sent | Should drop 70–90% |

---

## 11. What happens when you change content

The whole point of caching is that the CDN serves an old copy without asking the origin. So content changes need a strategy.

### Scenario A — Publish a new article

**No problem.** New URL → new cache key. First visitor is a MISS, subsequent visitors are HIT. Article is instantly visible.

But the **article list page** (`/blog`) is cached with the old list. Users may see the outdated list until it revalidates. Two mitigations:

- Short `s-maxage=60` on list pages (max 1 minute of staleness — usually good enough).
- Explicit purge of the list page on publish (see [Section 12](#12-cache-purging-playbook)).

### Scenario B — Edit an existing article

**The URL didn't change, but content did.** CDN still has the old copy.

- With `s-maxage=3600`: worst case 1 hour of staleness.
- Fix: purge that specific URL after saving (Section 12).

### Scenario C — Change site layout (CSS, JS, header, footer)

Next.js content-hashes static filenames on `next build`:

```
Before: /_next/static/chunks/main-abc123.js
After:  /_next/static/chunks/main-xyz789.js
```

The HTML references the new filename. Old files can stay cached forever (which is why we set `max-age=31536000, immutable` on them).

BUT the **HTML page itself** may still be cached with old references. So after a deploy:

- **Best practice:** call **Purge Everything** in Cloudflare after each deploy.
- Cost: every visitor's next request is a MISS. Brief origin traffic spike, but small blog = negligible.

### Scenario D — Dynamic elements (comments, view counts)

Two clean options:

1. **Load them client-side.** Cache the HTML shell; comments/views fetch via a client `fetch()` call to an uncached `/api/*` endpoint. This is modern SPA-style hydration.
2. **Short TTL for those pages.** `s-maxage=60` = at most 1 minute of staleness for view counts. Fine for non-critical dynamic data.

Never do: cache a page that varies per user (e.g., "Welcome back, {username}") without a `Vary` header or per-user cache key. That's the "user A sees user B's data" disaster.

---

## 12. Cache purging playbook

### Manual purge (dashboard)

Cloudflare dashboard → **Caching → Configuration → Purge Cache**:

- **Purge Everything**: nukes all cached content. Use after site-wide changes (design, CSS, layout).
- **Custom Purge**: paste specific URLs. Use after editing/publishing an article.

Both take ~30 seconds to propagate globally.

### API purge (automatable)

Get an API token from Cloudflare dashboard → **My Profile → API Tokens → Create Token → "Zone.Cache Purge"** permission on the `tunan.fun` zone.

Purge specific URLs:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer {API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://tunan.fun/zh-CN/blog/some-article","https://tunan.fun/zh-CN/blog","https://tunan.fun/zh-CN"]}'
```

Purge everything:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer {API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

`ZONE_ID` is on the dashboard's **Overview** tab, right side.

### Suggested integration

The Go backend has an article-publish endpoint. Consider calling the purge API from there after a successful save, purging:

- The specific article URL (both `/zh-CN/blog/{slug}` and `/en/blog/{slug}`)
- The blog list URLs (`/zh-CN/blog`, `/en/blog`)
- The homepage (`/zh-CN`, `/en`)

This gives instant global update on publish, while daily browsing remains cache-fast.

---

## 13. The China caveat

Cloudflare's free plan does **not** have edge nodes inside mainland China. Traffic from China readers routes to Cloudflare's Hong Kong, Tokyo, or LA POPs.

That's still faster than the US origin (~150 ms vs ~250 ms), but not "China-fast." Free is a real improvement; just don't expect miracles for Beijing users.

If Chinese readers grow into the main audience, options:

- **Aliyun CDN** or **Tencent Cloud CDN** — real in-China POPs, but require **ICP filing (备案)** on the domain, which needs a Chinese business entity or resident.
- **Cloudflare China Network** — a paid partnership with Baidu that provides real in-China POPs. Requires ICP filing too.

For now: free Cloudflare gets you 90% of the way. Revisit if analytics show China becoming dominant.

---

## 14. Glossary

- **Anycast** — a routing method where multiple servers share one IP address; the internet automatically routes to the nearest.
- **BGP** — Border Gateway Protocol, how internet routers decide which path packets take.
- **Cache HIT / MISS** — was the response served from cache (HIT) or fetched from origin (MISS)?
- **Cache key** — the identifier the CDN uses to look up cached content. Usually `host + path + query`.
- **CDN** — Content Delivery Network. A geographically distributed cache in front of the origin.
- **Edge** — a Cloudflare data center near users.
- **ICP filing (备案)** — Chinese regulation requiring domain registration for CDN service inside mainland China.
- **ISR** — Incremental Static Regeneration. Next.js's mechanism for regenerating static pages on a timer.
- **Latency** — time delay caused by physical distance; not fixable by more bandwidth.
- **LCP** — Largest Contentful Paint. Time until the main content on a page is visible.
- **Origin** — the source-of-truth server (the US nginx + Next.js box).
- **POP** — Point of Presence. A CDN edge data center.
- **Purge** — force-invalidate cached content.
- **s-maxage** — the `Cache-Control` directive for how long shared caches (CDNs) should keep content fresh. Different from `max-age`, which is for browsers.
- **SSR / SSG / ISR** — Server-Side Rendering / Static Site Generation / Incremental Static Regeneration. Next.js's rendering modes.
- **stale-while-revalidate (SWR)** — a caching pattern where stale content is served immediately while a fresh copy is fetched in the background.
- **TLS** — Transport Layer Security. The encryption layer behind HTTPS. Handshake is expensive; terminating it at the edge saves latency.
- **TTFB** — Time To First Byte. How long the browser waits before receiving the first byte of the response. The metric a CDN most directly improves.
- **TTL** — Time To Live. How long a cached copy is considered fresh.

---

## Quick reference — the whole plan in one glance

```
Phase 1 — Cloudflare in front (30 min)
  1. Sign up on cloudflare.com, add tunan.fun
  2. Change nameservers at the domain registrar
  3. Verify DNS records are proxied (orange cloud on)
  4. SSL/TLS mode: Full (strict)
  5. Verify with:  curl -sI https://tunan.fun | grep -i server
                   → expect "Server: cloudflare"

Phase 2 — Fix caching headers (1–2 hrs)
  1. In lib/articles.ts and 3 other files:
     replace  cache: 'no-store'
     with     next: { revalidate: N }
  2. Add async headers() config in next.config.mjs
  3. Rebuild and deploy
  4. Verify with:  curl -sI URL twice
                   → 1st: cf-cache-status: MISS
                   → 2nd: cf-cache-status: HIT

Phase 3 — Purge on publish (30 min, optional)
  1. Get a Cloudflare API token with Cache Purge scope
  2. In Go backend's article-save handler, call the purge API
  3. Purge: the article URL + list URLs + homepage

Phase 4 — Images (later)
  1. Custom img renderer in react-markdown → next/image
  2. Verify article page LCP improves in WebPageTest
```

## The one-page mental model

> The CDN is a photocopy of the site at every airport in the world.
> When the original changes, the photocopies don't automatically know.
> Either wait for them to expire (TTL), tell them to expire (purge),
> or change the filename so they're forced to refetch (Next.js does
> this for static assets).