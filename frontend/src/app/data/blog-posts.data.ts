export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  date: string; // ISO date
  readingTime: number; // minutes
  excerpt: string;
  content: string[]; // paragraphs
  gradient: string;
  icon: string;
  featured?: boolean;
}

const AUTHOR = 'Darshan Giri Goswami';
const AUTHOR_ROLE = 'Full Stack Developer';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-we-rebuilt-checkout-around-real-inventory',
    title: 'Why We Rebuilt Checkout Around Real Inventory',
    category: 'E-commerce Tips',
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    date: '2026-06-02',
    readingTime: 6,
    excerpt: 'Most demo storefronts fake their cart. We didn\'t — here\'s what changed when stock decrements happen inside a real database transaction.',
    gradient: 'from-sky-500 to-blue-600',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    featured: true,
    content: [
      'Every e-commerce demo eventually faces the same uncomfortable question: what actually happens when two customers try to buy the last unit of the same product at the same time? Most tutorials skip it entirely. We didn\'t want to.',
      'In the current checkout flow, every order is created inside a single Postgres transaction. The server checks stock, decrements it with a conditional update (WHERE stock >= quantity), and only commits the order if every line item succeeds. If a race condition means the item sold out a moment earlier, the whole transaction rolls back and the customer gets a clear, honest "no longer available" response instead of an order that silently can\'t be fulfilled.',
      'This sounds like a small implementation detail, but it changes the entire trust model of the store. A cart total that\'s always backed by real, currently-available stock is the difference between a demo and a system you could actually run a business on.',
      'The same discipline extends to cancellations: when an order is cancelled while it\'s still pending or processing, the reserved stock is added back atomically, in the same transaction as the status change. No cron job sweeping up inconsistencies later — the data is correct the instant the action happens.',
      'We\'d rather ship fewer features and have the ones we do ship be true. That\'s the whole philosophy behind how this checkout was built.',
    ],
  },
  {
    slug: 'jwt-cookies-vs-local-storage',
    title: 'JWT in Cookies vs. localStorage: What We Chose and Why',
    category: 'Security',
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    date: '2026-06-10',
    readingTime: 7,
    excerpt: 'A practical breakdown of the tradeoffs behind storing auth tokens in HTTP-only cookies instead of the browser\'s localStorage.',
    gradient: 'from-indigo-500 to-purple-600',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>',
    content: [
      'Ask ten engineers where to store a JWT and you\'ll get ten opinions. We went with HTTP-only cookies as the primary mechanism, with a bearer-token fallback for API clients — and it\'s worth explaining the reasoning, since it\'s a decision with real security consequences.',
      'A token stored in localStorage is readable by any JavaScript running on the page. That includes your own code, but also any third-party script, any dependency with a supply-chain compromise, and any successful XSS payload. If an attacker can execute a single line of JS, the token — and the session it represents — is theirs.',
      'An HTTP-only cookie is invisible to JavaScript entirely. The browser attaches it to requests automatically, but no script on the page, malicious or otherwise, can read its value. That closes off an entire class of attack.',
      'The tradeoff is CSRF: cookies are sent automatically, including to requests initiated by other sites, unless you defend against it. We mitigate that with strict CORS configuration, SameSite cookie attributes, and origin validation on state-changing requests.',
      'No single mechanism is bulletproof. But defaulting to "the token can\'t be stolen by a script" and layering CSRF protection on top is a stronger starting position than the reverse.',
    ],
  },
  {
    slug: 'building-a-category-mega-menu-that-never-goes-stale',
    title: 'Building a Category Mega-Menu That Never Goes Stale',
    category: 'Web Development',
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    date: '2026-06-18',
    readingTime: 5,
    excerpt: 'How a live API call replaced a hardcoded array of categories — and why "hardcoded navigation" is a bug waiting to happen.',
    gradient: 'from-emerald-500 to-teal-600',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7"/></svg>',
    content: [
      'Early on, the navbar\'s category dropdown was a static list — six category names typed directly into the component. It looked fine in every screenshot and broke the moment the catalog changed.',
      'The fix wasn\'t clever, just correct: the dropdown now calls the same category API the rest of the storefront uses, sorts by product count, and renders whatever categories actually exist in the database at that moment. Add a category in the backend, and it appears in the nav on the next page load — no frontend deploy required.',
      'This is a small example of a bigger principle we try to hold to throughout this codebase: anywhere a UI element represents data, it should be reading that data live, not encoding an assumption about what the data probably looks like. Assumptions expire. APIs don\'t.',
      'It also means the mega-menu automatically handles the empty case, the loading case, and the "24 categories instead of 6" case, without anyone having to remember to update a hardcoded array when the catalog grows.',
    ],
  },
  {
    slug: 'how-we-diagnosed-an-intermittent-blank-homepage',
    title: 'How We Diagnosed an Intermittent Blank Homepage',
    category: 'Web Development',
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    date: '2026-06-25',
    readingTime: 8,
    excerpt: 'A real debugging story: Chrome DevTools, a stopwatch, and the exact moment a scroll-reveal animation quietly broke.',
    gradient: 'from-amber-500 to-orange-600',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
    content: [
      'A report came in: "the homepage sometimes shows nothing, then works after I click." That\'s the worst kind of bug — intermittent, and seemingly fixed by an action that shouldn\'t matter.',
      'The instinct is to assume a backend problem. We checked first: opened the Network tab, watched every request the homepage fires, and confirmed the API was returning data successfully, every time. So the data was fine. The rendering wasn\'t.',
      'The actual cause was a scroll-reveal animation: a single IntersectionObserver, set up once on page load, that queried the DOM for elements to animate in. The catch — it ran on a fixed timer, before some of those elements existed yet, because they were rendered asynchronously after an API call resolved. Anything that rendered after that timer fired was permanently stuck at zero opacity. Present in the DOM. Clickable. Invisible.',
      'The fix was to stop treating "reveal on scroll" as something a parent component orchestrates once, and instead give every element its own observer, created exactly when Angular creates that element — whether that\'s on first paint or three seconds later after a fetch resolves. No more racing a fixed timer against an unpredictable network.',
      'The lesson generalizes: if a bug depends on timing, don\'t patch the timing. Find the place a wrong assumption ("this will exist by then") got baked into the code, and remove the assumption.',
    ],
  },
  {
    slug: 'ai-and-the-next-decade-of-online-shopping',
    title: 'AI and the Next Decade of Online Shopping',
    category: 'AI in E-commerce',
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    date: '2026-07-01',
    readingTime: 6,
    excerpt: 'Recommendation engines, conversational search, and dynamic pricing are moving from novelty to default. Here\'s what\'s actually changing.',
    gradient: 'from-purple-500 to-pink-600',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
    content: [
      'For years, "AI-powered shopping" meant a recommendation widget bolted onto a product page. That\'s changing fast, and it\'s worth separating the genuinely useful shifts from the marketing noise.',
      'The most immediately useful application is search. Traditional keyword search fails the moment a shopper describes what they want in natural language — "a watch for my dad who likes hiking" doesn\'t map cleanly to a SKU title. Semantic search, powered by embeddings rather than exact string matches, closes that gap and is quickly becoming table stakes rather than a differentiator.',
      'Recommendation quality is the second major shift. The naive version — "customers who bought X also bought Y" — is easy to build and easy to get wrong. The systems worth building weigh recency, category affinity, and actual purchase intent, not just co-occurrence in a transaction log.',
      'The area we\'re most cautious about is dynamic pricing. It\'s technically straightforward to adjust prices based on demand signals, but it erodes the transparency that makes a store trustworthy in the first place. Our position: use data to get products in front of the right people, not to charge them differently for the same item.',
      'On this platform specifically, the roadmap includes category- and brand-aware product recommendations as the next concrete step — built on the same real product and order data everything else here already uses, not a black-box add-on.',
    ],
  },
  {
    slug: 'a-practical-guide-to-choosing-the-right-watch-online',
    title: 'A Practical Guide to Choosing the Right Watch Online',
    category: 'Shopping Guides',
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    date: '2026-07-06',
    readingTime: 5,
    excerpt: 'Case size, movement type, and water resistance ratings — a shopper\'s checklist before adding a watch to your cart.',
    gradient: 'from-rose-500 to-red-600',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>',
    content: [
      'Buying a watch online is one of the few purchases where the photo genuinely doesn\'t tell you everything you need to know. Here\'s the checklist worth running through before you check out.',
      'Case size first. A 42–46mm case reads as bold and modern; anything under 38mm leans classic or is sized for a smaller wrist. If you\'re unsure, measure a watch you already own and like, rather than guessing from a product photo where scale is easy to misjudge.',
      'Movement matters more than most buyers realize. Quartz movements are accurate and low-maintenance. Automatic (mechanical) movements need regular wrist time to stay wound but carry a different kind of craftsmanship and, often, price. Neither is "better" — it depends what you\'re optimizing for.',
      'Water resistance ratings are frequently misunderstood. 30m resistance means splash-proof, not swim-proof. If you want to shower or swim with a watch on, look for 100m or higher, clearly stated in the listing.',
      'Finally, check the return window before you buy, not after. A watch is one of the few categories where "it looked different in person" is common and completely reasonable — a fair return policy is part of what you\'re paying for.',
    ],
  },
  {
    slug: 'what-a-rate-limiter-actually-protects-you-from',
    title: 'What a Rate Limiter Actually Protects You From',
    category: 'Security',
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    date: '2026-07-11',
    readingTime: 4,
    excerpt: 'Rate limiting sounds like a checkbox feature until you\'ve watched a login endpoint get hammered by a credential-stuffing script.',
    gradient: 'from-slate-600 to-slate-800',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
    content: [
      'Rate limiting is one of those features that\'s invisible when it\'s working and catastrophic when it\'s missing. Every API route on this platform sits behind one, and it\'s worth explaining what that actually buys you.',
      'The most common threat isn\'t a sophisticated attack — it\'s credential stuffing. An attacker takes a leaked list of email/password pairs from an unrelated breach and fires them at your login endpoint, hoping for password reuse. Without a limiter, that script can attempt thousands of logins per minute against your database.',
      'A rate limit turns that into a non-starter. Cap login attempts per IP over a rolling window, and the economics of the attack collapse — it\'s no longer fast enough to be worth running against your site specifically.',
      'The same protection matters for less obvious routes too: password reset requests, address creation, and review submission are all cheap to abuse if left unlimited, whether the goal is spam, denial of service, or just database bloat.',
      'One practical lesson from building this: the limit needs to be tuned to how the app actually behaves, not a number that feels safe in the abstract. A single storefront page load here fires over a dozen API calls; a limiter tuned for "a handful of requests per user" would have throttled legitimate traffic within seconds of shipping it.',
    ],
  },
  {
    slug: 'from-fake-store-api-to-a-real-database',
    title: 'From a Fake Store API to a Real Database',
    category: 'Technology',
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    date: '2026-07-16',
    readingTime: 6,
    excerpt: 'The migration story: importing 194 real products, 24 categories, and hundreds of reviews from a public API into Postgres — and never looking back.',
    gradient: 'from-cyan-500 to-blue-600',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>',
    content: [
      'This platform started, like a lot of prototypes do, pointed at a public placeholder API for product data. That\'s a fine way to sketch a UI. It\'s a terrible foundation for anything you want to call finished.',
      'The migration wasn\'t just "copy the JSON into a database." It meant designing a real schema — products, categories, brands, images, and reviews as separate related tables — and writing an idempotent import script that could run repeatedly without duplicating data, wrapped in transactions so a failure partway through never left the catalog half-written.',
      'One detail that mattered more than expected: import order. When products are inserted in the order the source API returns them, and later queries sort by "most recently updated," entire categories can end up invisibly clustered at the top of every list simply because they were imported last. We caught this by noticing the homepage\'s "trending" and "deals" sections were suspiciously dominated by a single category, and fixed it by diversifying selection across categories explicitly rather than trusting insertion order to be neutral.',
      'The payoff: every product, price, discount, and review on this site now lives in Postgres, survives a server restart, and reflects real relationships — a review belongs to a real user account, a product belongs to a real category and brand. It\'s slower to build a store this way. It\'s the only way to build one that\'s actually true.',
    ],
  },
  {
    slug: 'cash-on-delivery-in-2026-why-it-still-matters',
    title: 'Cash on Delivery in 2026: Why It Still Matters',
    category: 'E-commerce Tips',
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    date: '2026-07-20',
    readingTime: 4,
    excerpt: 'Digital payments dominate headlines, but COD remains a trust bridge for a huge share of first-time online shoppers.',
    gradient: 'from-teal-500 to-emerald-600',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>',
    content: [
      'It would be easy to assume Cash on Delivery is a relic. It isn\'t. It\'s the default payment method on this platform for a specific, deliberate reason: trust is earned, not assumed.',
      'For a shopper buying from a store for the first time, handing over card details is a bigger ask than it seems from the inside. COD removes that friction entirely — you see the product, you pay when it arrives. That single change measurably increases first-purchase conversion, particularly for higher-value items like watches and electronics.',
      'It\'s not free, operationally. COD orders carry higher return and non-collection risk, and reconciling cash payments against an order ledger requires more careful bookkeeping than a card charge that clears automatically. That complexity is a fair trade for the trust it builds.',
      'The right long-term approach isn\'t choosing COD or digital payments — it\'s offering COD as the low-friction default while making digital checkout fast enough that returning customers choose it on their own, once they\'ve already trusted you once.',
    ],
  },
  {
    slug: 'shipping-a-live-order-tracker-without-a-courier-api',
    title: 'Shipping a Live Order Tracker Without a Courier API',
    category: 'Product Updates',
    author: AUTHOR,
    authorRole: AUTHOR_ROLE,
    date: '2026-07-24',
    readingTime: 5,
    excerpt: 'How we built a real, status-driven 4-stage delivery tracker — Order Placed, Processing, Shipped, Delivered — using only data we actually have.',
    gradient: 'from-blue-500 to-indigo-600',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/></svg>',
    content: [
      'Order tracking is one of those features that\'s easy to fake and obvious when it\'s faked — a progress bar that always shows the same three checkmarks regardless of what actually happened to your order.',
      'We didn\'t have a courier API to integrate with, so the honest option was to build a tracker driven entirely by the order\'s real, stored status: Pending, Processing, Shipped, Delivered, or Cancelled. Each stage in the UI reflects the actual `status` column and the timestamps of when it last changed — nothing decorative, nothing simulated.',
      'A tracking number is generated and stored at the moment an order is placed, and an estimated delivery date is computed from real inputs — whether the order qualified for free shipping and when it was placed — rather than a hardcoded "3-5 days" string repeated on every order regardless of reality.',
      'Cancelled and refunded orders get an explicit banner instead of a misleading progress bar frozen mid-flow, and eligible orders — anything still Pending or Processing — expose a real one-click cancel action that restores stock atomically.',
      'The result looks simple: four dots and a line. But every pixel of it is backed by a real column in a real database, which is the only version of "simple" worth shipping.',
    ],
  },
];

export function getFeaturedPost(): BlogPost {
  return BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
}

export function getOtherPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => !p.featured);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export const BLOG_CATEGORIES = [...new Set(BLOG_POSTS.map((p) => p.category))];
