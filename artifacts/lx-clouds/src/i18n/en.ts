export type ProjectCopy = {
  /** Short label used on cards. */
  tag: string;
  category: string;
  /** One line, used on cards. */
  blurb: string;
  /** One or two sentences, used on showcases and as meta description. */
  summary: string;
  /** What the project shows a prospective client – written to them, not about the product. */
  forYou: string;
  role: string;
  overview: string[];
  problem: string;
  objective: string;
  contribution: string[];
  approach: { title: string; body: string }[];
  features: { title: string; body: string }[];
  /** Caption per screenshot file. */
  captions: Record<string, string>;
  results: { value: string; label: string }[];
  resultsNote: string;
  /** Assets that could not be captured from the public site. */
  missing?: string;
};

export const en = {
  meta: {
    homeTitle: "Leonit Xhini — Independent Developer & Digital Product Builder",
    homeDescription:
      "Websites, mobile apps, AI products and custom software for small businesses and companies digitising their systems — designed and developed from the first concept to the finished experience.",
    workTitle: "Selected Work — Leonit Xhini",
    workDescription:
      "Four projects designed and built end to end: ZgjedhPlus, FrameNotion, RRON Rent a Car and SubToAPI — three independent products and one client website.",
    caseTitle: (name: string) => `${name} — Case Study — Leonit Xhini`,
    notFoundTitle: "Page not found — Leonit Xhini",
    notFoundDescription: "This page does not exist.",
  },

  common: {
    role: "Independent Digital Product Developer",
    skip: "Skip to content",
    typeProduct: "Independent Product",
    typeClient: "Client Project",
    viewCase: "View case study",
    close: "Close",
  },

  nav: {
    main: "Main",
    work: "Work",
    services: "Services",
    about: "About",
    contact: "Contact",
    email: "Email",
    viewProjects: "View Projects",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
    emailMe: "Email me",
    language: "Language",
  },

  hero: {
    eyebrow: "Independent Developer & Digital Product Builder",
    title1: "Digital products",
    title2: "that stand out.",
    sub: "Websites, applications and scalable digital products — designed and developed from the first concept to the finished experience.",
    talk: "Let's talk",
    viewWork: "View my work",
    cardsLabel: "What I do",
    more: "Show details",
    less: "Hide details",
    cards: [
      {
        title: "From ideas",
        body: "Turn ideas into real products.",
        more: ["Concept and product scope", "Clickable prototype", "A clear path to launch"],
      },
      {
        title: "Development",
        body: "Modern, scalable and reliable.",
        more: ["React, Next.js, TypeScript", "APIs, databases, cloud", "iOS and Android apps"],
      },
      {
        title: "Design",
        body: "Clean, modern and conversion-focused.",
        more: ["UI and UX design", "Brand and design system", "Responsive from the start"],
      },
      {
        title: "Real impact",
        body: "Products people actually use.",
        more: ["Top 10 apps in Kosovo", "#1 on Google for a client", "200 visitors a day"],
      },
    ],
    pillars: [
      { title: "Design", body: "Modern & clean" },
      { title: "Develop", body: "Scalable & reliable" },
      { title: "Build", body: "Real products" },
      { title: "Grow", body: "From idea to launch" },
    ],
    available: "Available for freelance, client work, and product collaborations",
    together: "Let's build together",
    scroll: "Scroll to selected work",
    builtLabel: "Products I built",
  },

  work: {
    eyebrow: "Selected work",
    title: "Featured projects.",
    viewAll: "View all projects",
    filterLabel: "Filter projects",
    filters: { all: "All", product: "Own products", client: "Client work" },
    pageTitle1: "Real products.",
    pageTitle2: "Built end to end.",
    pageSub:
      "Three products of my own and one website for a client — each designed, developed and shipped by me. Every screen on these pages is taken from the live site.",
  },

  process: {
    title: "From idea to launch — fast.",
    sub: "I combine design, development, and product thinking to turn ideas into real, working products.",
    stages: [
      {
        title: "Design",
        body: "Understand the idea, sketch concepts and design a clean, modern experience.",
        chips: ["Concept", "Wireframes", "UI design"],
      },
      {
        title: "Build",
        body: "Develop with modern technologies, focused on performance and scalability.",
        chips: ["Frontend", "Backend", "Integrations"],
      },
      {
        title: "Refine",
        body: "Test, iterate and polish every detail until it feels right.",
        chips: ["Responsive", "Performance", "Accessibility"],
      },
      {
        title: "Launch",
        body: "Ship to the real world and keep improving with real feedback.",
        chips: ["Deployment", "Monitoring", "Iteration"],
      },
    ],
    checklist: ["Ideas", "Design", "Development", "Launch"],
    note: ["Real products.", "Real results."],
    statLabel: "live",
    statBody: (shops: string) => `products across ${shops} shops`,
    statValue: "1.3M+",
    hint: "Keep scrolling",
    step: (n: number, total: number) => `Step ${n} of ${total}`,
  },

  services: {
    title: "What I can help you with.",
    sub: "End-to-end support, from idea to launch and beyond.",
    seenIn: "Seen in",
    includes: "Includes",
    items: [
      {
        title: "Web Design & Development",
        body: "Modern, responsive websites that look sharp, load fast and convert.",
        points: ["Company and product websites", "Landing pages", "SEO and performance", "Content you can edit yourself"],
      },
      {
        title: "Mobile Apps",
        body: "Apps for iPhone and Android, designed and built alongside the web product.",
        points: ["App design", "Native development", "App Store release", "One backend for web and app"],
      },
      {
        title: "AI & Automation",
        body: "AI features and automated workflows that take over repetitive work.",
        points: ["AI assistants and chat", "Content and media generation", "Workflow automation", "LLM integrations"],
      },
      {
        title: "Custom Software / SaaS",
        body: "Web applications and SaaS platforms, from the data model to billing.",
        points: ["Dashboards and internal tools", "Accounts, roles and teams", "Subscriptions and payments", "APIs and integrations"],
      },
      {
        title: "Full Service",
        body: "One partner from the first concept to launch — and for everything after.",
        points: ["Strategy and concept", "Design and development", "Hosting and deployment", "Maintenance and growth"],
      },
    ],
  },

  results: {
    eyebrow: "Results",
    title: "Proof, not promises.",
    sub: "What the work has led to so far.",
    items: [
      { value: "Top 10", label: "apps in Kosovo", note: "ZgjedhPlus — website and iPhone app from one hand." },
      { value: "#1", label: "on Google", note: "RRON Rent a Car — with considerably more customers since." },
      { value: "200", label: "visitors a day", note: "FrameNotion, from its own analytics." },
      { value: "100", label: "SEO score in Lighthouse", note: "On ZgjedhPlus, FrameNotion and SubToAPI — so the product gets found." },
      { value: "8,000+", label: "visitors a month", note: "ZgjedhPlus — 2.5 times as many as the month before." },
      { value: "1", label: "contact person", note: "Concept, design, development and launch — no handovers in between." },
    ],
  },

  clients: {
    eyebrow: "Who I work with",
    title: "For businesses that want to move.",
    items: [
      {
        title: "Small and new businesses",
        body: "You need a professional presence and a product that works from day one — without hiring a whole team.",
        points: ["A website or first product, ready to launch", "One person to talk to, clear scope", "Room to grow after launch"],
      },
      {
        title: "Companies digitising their systems",
        body: "You run on spreadsheets, paper or tools that no longer fit. I turn those processes into software your team actually uses.",
        points: ["Analysis of the existing process", "Custom software and dashboards", "Automation and AI where it helps"],
      },
    ],
    cta: "Start a project",
  },

  about: {
    statement:
      "Independent by choice. End-to-end by design. I build my own products and deliver client projects — with direct communication, full ownership and one person responsible from concept to deployment.",
    title: ["Built across products", "and client work."],
    body: "I work across my own products and client projects, combining strong UI, technical execution, and product thinking to create digital experiences that make an impact.",
    tiles: ["Featured Projects", "End-to-End Product Work", "Design + Development"],
    languages: "I work in English, German and Albanian.",
  },

  cta: {
    title: "Let's build something that stands out.",
    sub: "Have a project in mind or just want to say hi? I'm always open to new opportunities.",
    email: "Email me",
    work: "View my work",
    marquee: ["Web Design", "Mobile Apps", "AI & Automation", "Custom Software", "SaaS", "Full Service"],
  },

  footer: {
    selectedWork: "Selected Work",
    contact: "Contact",
    start: "Start a conversation",
  },

  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your project.",
    sub: "Tell me what you have in mind. The message goes straight to my inbox.",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@company.com",
    message: "What would you like to build?",
    messagePlaceholder: "A few lines about the project, timing and what you need help with.",
    send: "Send message",
    sending: "Sending…",
    sentTitle: "Message sent.",
    sentBody: "Thank you — I'll get back to you by email.",
    error: "That didn't go through. Please try again, or write to",
    subject: "Project enquiry",
  },

  caseStudy: {
    allWork: "All work",
    category: "Category",
    role: "Role",
    stack: "Stack",
    live: "Live",
    overview: "Overview",
    overviewTitle: (name: string) => `What ${name} is.`,
    problemLabel: "Problem & objective",
    problemTitle: "Where it started, and what it had to do.",
    problem: "The problem",
    objective: "The objective",
    contributionLabel: "My contribution",
    contributionTitleProduct: "What I did, from first idea to live product.",
    contributionTitleClient: "What I did for the client.",
    approachLabel: "Design & technical approach",
    approachTitle: "How it was put together.",
    featuresLabel: "Key functionality",
    featuresTitle: "What it does.",
    showcaseLabel: "Visual showcase",
    showcaseTitle: "The real thing.",
    showcaseNote: (domain: string) => `Unedited screens from ${domain}, captured from the live site.`,
    notShown: "Not shown",
    resultsLabel: "Results",
    resultsTitle: "In numbers.",
    resultsTitleNone: "Live and in use.",
    visit: (domain: string) => `Visit ${domain}`,
    forYou: "What this means for your project",
    next: "Next project",
  },

  notFound: {
    title: "This page doesn't exist.",
    body: "The link may be old, or the address was mistyped.",
    back: "Back to the start",
  },

  projects: {
    zgjedhplus: {
      tag: "Marketplace / Price Comparison",
      category: "Marketplace / Price Comparison",
      blurb: "A marketplace with its own iPhone app — from an idea to the Top 10 in Kosovo.",
      summary:
        "The price comparison platform for Kosovo and Albania: more than 1.3 million products from 229 shops in one search — with price history, price alerts and its own iPhone app.",
      forYou:
        "Need a platform, a marketplace or an app? This is how far one person can take an idea: website, backend and iPhone app from a single hand — all the way into the Top 10 apps of a country.",
      role: "Concept, design, development and operations",
      overview: [
        "ZgjedhPlus is a price comparison platform for Kosovo and Albania. It brings the offers of local online shops into one searchable catalogue, so shoppers can see who sells a product, what it costs at each shop and how that price has moved.",
        "It is my own product: I shaped the concept, designed the interface and built the platform end to end — the website, the data behind it and the iOS app.",
      ],
      problem:
        "Online shopping in Kosovo and Albania is spread across hundreds of separate shops with no shared catalogue. Comparing a single product means opening tab after tab, and still not knowing whether today's price is a good one.",
      objective:
        "Build one consumer-facing place that answers three questions quickly: where can I buy it, what does it cost at each shop, and is now a good time to buy.",
      contribution: [
        "Product concept and direction",
        "Brand, UI and UX design",
        "Frontend and backend development",
        "Catalogue and price data pipeline",
        "iOS app",
        "Deployment and day-to-day operations",
      ],
      approach: [
        {
          title: "Search comes first",
          body: "The home page leads with one search field and the most requested categories. Everything else — travel, plans, loans, insurance — sits one level below, so the core promise stays obvious.",
        },
        {
          title: "One product, many shops",
          body: "Listings from different shops are matched to a single product page. Offers sit side by side with price, availability and a direct link to the shop.",
        },
        {
          title: "Price over time",
          body: "Every product page keeps a price history with the lowest, average and highest price of the period. A price alert turns that history into something a shopper can act on.",
        },
        {
          title: "Built for a large catalogue",
          body: "With more than a million listed products, list and product pages are prepared ahead of time and cached, so browsing stays fast on a phone connection.",
        },
      ],
      features: [
        { title: "Product discovery", body: "Search, categories, brands and shop pages across the full catalogue." },
        { title: "Price comparison", body: "All offers for a product in one view, sorted by price." },
        { title: "Price history", body: "A chart per product with lowest, average and highest price." },
        { title: "Price alerts & watchlist", body: "Get notified when a product drops to the price you want." },
        { title: "ZgjedhAI assistant", body: "An AI assistant that answers shopping questions with live catalogue data." },
        { title: "More than products", body: "Comparison of flights, hotels, car rental, eSIMs, mobile and internet plans, loans and insurance." },
      ],
      captions: {
        home: "Home — search, categories and service verticals",
        search: "Search results with the lowest price per product",
        product: "Product page — the best offer and the other shops side by side",
        history: "Price history with a price alert on the chart",
        "home-mobile": "Home on mobile",
        "product-mobile": "Product page on mobile",
        "search-mobile": "Search on mobile",
      },
      results: [
        { value: "Top 10", label: "apps in Kosovo" },
        { value: "8,000+", label: "visitors a month" },
        { value: "2.5×", label: "more visitors within one month" },
        { value: "2", label: "platforms: website and iPhone app" },
      ],
      resultsNote:
        "Visitor figures from the platform's own analytics, bots excluded: 8,240 visitors in the 30 days to 1 October 2026, and September had 2.5 times as many as August. App ranking as reported by me.",
    },
    framenotion: {
      tag: "AI / Creative SaaS",
      category: "AI / Creative Automation",
      blurb: "An AI product that turns a link into a finished video ad.",
      summary:
        "An AI platform that turns any product link into a finished 30-second video ad — written, voiced, scored and rendered in minutes instead of days.",
      forYou:
        "Want AI inside your product? Here it does real work: it reads a page, writes the ad and renders the video — with accounts and online payment built around it.",
      role: "Concept, design and development",
      overview: [
        "FrameNotion turns a product link into a short vertical ad video. You paste a URL; the platform reads the page, writes a custom motion ad for it and renders a finished video with voiceover and music.",
        "It is my own product. I designed the brand and the interface and built the generation pipeline behind it.",
      ],
      problem:
        "Short-form video ads are slow and expensive to produce for small brands. Template tools are faster, but the result looks like a template.",
      objective:
        "Take a single input — a product link — and return a finished, custom ad without an editing timeline in between.",
      contribution: [
        "Product concept",
        "Brand and landing page design",
        "Application interface",
        "AI pipeline: page analysis, script and scene design",
        "Video rendering",
        "Accounts and billing",
      ],
      approach: [
        {
          title: "One input",
          body: "The whole product is built around one field. Logo, style, voice and music can be set afterwards, or left on Auto.",
        },
        {
          title: "Written, not templated",
          body: "Each ad is generated as its own motion design: scenes, components and timing are written for the product on the page instead of being poured into a fixed layout.",
        },
        {
          title: "Rendered as real video",
          body: "The output is an MP4 with sound, ready for vertical feeds, with further aspect ratios for other placements.",
        },
        {
          title: "Show the output",
          body: "The landing page leads with ads the product actually generated, rendered untouched, so visitors judge the result instead of a promise.",
        },
      ],
      features: [
        { title: "Link analysis", body: "Reads the product page for audience, problem, benefit and offer." },
        { title: "Custom motion ad", body: "Hook, story and motion design generated per product." },
        { title: "Voiceover & music", body: "Narration and soundtrack are part of the render." },
        { title: "Multiple formats", body: "9:16, 4:5, 1:1 and 16:9 from the same ad." },
        { title: "Examples gallery", body: "Generated ads with their brief, angle and timeline." },
        { title: "Plans and packs", body: "Subscriptions and one-off packs with checkout by Stripe." },
      ],
      captions: {
        home: "Landing page — one field for the product link",
        workflow: "The workflow: paste a link, the ad is created, download and post",
        examples: "Example ads, each generated from a single link",
        features: "Features — how a link becomes an ad",
        "home-mobile": "Landing page on mobile",
        "examples-mobile": "Examples on mobile",
      },
      results: [
        { value: "200", label: "visitors a day" },
        { value: "100", label: "SEO score in Lighthouse" },
        { value: "3", label: "subscription plans with online payment" },
        { value: "AI", label: "writes, voices and renders the ad itself" },
      ],
      resultsNote:
        "Visitor figure from the product's own analytics. Lighthouse measured on the live site in October 2026, mobile and desktop.",
      missing:
        "The editor and account dashboard sit behind the login and are not shown here. All screens above are from the public site.",
    },
    "rron-rent-a-car": {
      tag: "Client Project",
      category: "Automotive / Website Development",
      blurb: "A rental website that ranks #1 on Google and brings in bookings.",
      summary:
        "The website of a car rental company in Kosovo: the fleet presented like a premium brand, a booking request in a few taps — and first place on Google.",
      forYou:
        "Need a website that brings customers? This one ranks first on Google, turns visitors into booking requests on WhatsApp — and the owner keeps cars and prices up to date himself.",
      role: "Design and development for the client",
      overview: [
        "RRON Rent a Car is a vehicle rental company in Kosovo. I designed and built their website: a dark, premium presentation of the fleet with a booking flow that ends where the business already talks to its customers — on WhatsApp.",
        "This is client work. The brief, the brand and the fleet are the client's; design, development and deployment are mine.",
      ],
      problem:
        "Renting a car is decided in a few minutes, mostly on a phone: which cars are there, what do they cost per day, and how do I book. The site had to answer that without making anyone search for it.",
      objective:
        "Present the fleet with the polish the brand stands for, and make a booking request as short as possible.",
      contribution: [
        "Website design in the client's visual identity",
        "Responsive frontend development",
        "Fleet presentation and filtering",
        "Booking request and contact flow",
        "English and Albanian versions",
        "Hosting, deployment and SEO",
      ],
      approach: [
        {
          title: "The booking bar is the hero",
          body: "Pick-up, drop-off and dates sit directly on the first screen. A visitor can start a request before scrolling.",
        },
        {
          title: "Cars shown like products",
          body: "Each vehicle has a clean card with its key facts and daily rate. The fleet page adds categories, sorting and an availability check for chosen dates.",
        },
        {
          title: "Requests land on WhatsApp",
          body: "The client handles bookings in WhatsApp, so the flow hands over there with the details already filled in instead of introducing a new inbox.",
        },
        {
          title: "Managed by the client",
          body: "Vehicles, prices and availability are maintained through an admin area, so the fleet stays current without a developer.",
        },
      ],
      features: [
        { title: "Fleet overview", body: "Vehicle cards with transmission, fuel, seats and daily rate." },
        { title: "Categories & sorting", body: "Economy, compact, premium and luxury, sortable by price." },
        { title: "Availability check", body: "Filter the fleet by pick-up and drop-off date." },
        { title: "Booking request", body: "A short form that hands over to WhatsApp." },
        { title: "Locations", body: "Pick-up points including the airport, shown with their details." },
        { title: "Two languages", body: "English and Albanian, switchable from the header." },
      ],
      captions: {
        home: "Home — brand hero with the booking bar",
        "fleet-cards": "Fleet preview with daily rate and booking button",
        fleet: "Fleet page — availability check, categories and sorting",
        "home-mobile": "Home on mobile",
        "fleet-mobile": "Fleet on mobile",
      },
      results: [
        { value: "#1", label: "on Google" },
        { value: "24/7", label: "booking requests, straight to WhatsApp" },
        { value: "2", label: "languages for locals and visitors" },
        { value: "0", label: "developers needed to update cars and prices" },
      ],
      resultsNote:
        "Since launch the website ranks first on Google, and the business has seen considerably more customers.",
    },
    subtoapi: {
      tag: "Developer SaaS",
      category: "Developer Tools / SaaS",
      blurb: "A complete SaaS: subscriptions, team accounts, dashboard and API.",
      summary:
        "A developer platform that connects supported Claude access to applications through an API — keys, playground, usage monitoring and team seats in one dashboard.",
      forYou:
        "Planning a software product of your own? Subscriptions, team accounts, a dashboard, a public API and the documentation: every part a paid SaaS needs, built and running.",
      role: "Concept, design and development",
      overview: [
        "SubToAPI is a developer platform that connects supported Claude access to applications through an API interface. Developers connect once, create application API keys, send requests from a playground and see usage metadata for every response.",
        "It is my own product: one dashboard, a public API and the documentation around it, designed and built as a single system.",
      ],
      problem:
        "Calling a model from your own applications needs more than an endpoint: keys per application, a way to test requests, visibility into usage and access for the rest of the team.",
      objective:
        "Give developers one control panel for that — connect, create keys, test and monitor — with documentation that gets a first request working in minutes.",
      contribution: [
        "Product concept",
        "Brand and marketing site",
        "Dashboard design and development",
        "Public API and key management",
        "Developer documentation",
        "Subscriptions and team seats",
      ],
      approach: [
        {
          title: "Status at a glance",
          body: "The dashboard opens on the connection state and the latest request figures, because that is the first thing a developer checks.",
        },
        {
          title: "A playground that sends real requests",
          body: "Single messages or full conversations with tools can be tried in the browser — the same requests an application would make.",
        },
        {
          title: "Usage as metadata",
          body: "Tokens, latency, status and request IDs are returned with each response and collected per key, so usage can be traced from metadata rather than from prompt content.",
        },
        {
          title: "Docs as part of the product",
          body: "Quickstart, endpoint reference, streaming and tool use are written alongside the API and share the design of the dashboard.",
        },
      ],
      features: [
        { title: "Dashboard", body: "Connection status and request overview in one place." },
        { title: "API key management", body: "Application keys, created and revoked from the dashboard." },
        { title: "Playground", body: "Send real requests and inspect the response." },
        { title: "Usage monitoring", body: "Tokens, latency and status for every request." },
        { title: "Team access", body: "Seats and roles for colleagues." },
        { title: "Documentation", body: "Quickstart, messages, streaming and tool use." },
      ],
      captions: {
        home: "Landing page with the dashboard preview",
        docs: "Documentation — quickstart",
        "api-reference": "API reference for the messages endpoint",
        pricing: "Pricing",
        "home-mobile": "Landing page on mobile",
      },
      results: [
        { value: "5 min", label: "to the first API call" },
        { value: "4×100", label: "Lighthouse scores on desktop" },
        { value: "3", label: "subscription plans with online payment" },
        { value: "Teams", label: "accounts, roles and seats built in" },
      ],
      resultsNote:
        "The quickstart is built to get a first request working in five minutes. Lighthouse measured on the live site in October 2026: 100 in performance, accessibility, best practices and SEO on desktop.",
      missing:
        "The signed-in dashboard, API key management, playground and usage views require an account and are not shown as screenshots. The dashboard visible above is the product's own preview on its landing page.",
    },
  } satisfies Record<string, ProjectCopy> as Record<string, ProjectCopy>,
};

export type Dict = typeof en;
