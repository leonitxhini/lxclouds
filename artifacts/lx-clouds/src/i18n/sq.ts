import type { Dict } from "./en";

export const sq: Dict = {
  meta: {
    homeTitle: "Leonit Xhini — Zhvillues i pavarur i produkteve digjitale",
    homeDescription:
      "Dizajnoj dhe zhvilloj ueb-faqe, aplikacione mobile, produkte me inteligjencë artificiale dhe softuer të personalizuar për biznese të vogla dhe kompani që digjitalizojnë sistemet e tyre — nga koncepti i parë deri te produkti i përfunduar.",
    workTitle: "Projekte të përzgjedhura — Leonit Xhini",
    workDescription:
      "Katër projekte të dizajnuara dhe të ndërtuara nga fillimi deri në fund: ZgjedhPlus, FrameNotion, RRON Rent a Car dhe SubToAPI — tri produkte të mia dhe një ueb-faqe për klient.",
    caseTitle: (name: string) => `${name} — Studim rasti — Leonit Xhini`,
    notFoundTitle: "Faqja nuk u gjet — Leonit Xhini",
    notFoundDescription: "Kjo faqe nuk ekziston.",
  },

  common: {
    role: "Zhvillues i pavarur i produkteve digjitale",
    skip: "Kalo te përmbajtja",
    typeProduct: "Produkt i imi",
    typeClient: "Projekt për klient",
    viewCase: "Shiko studimin e rastit",
    close: "Mbyll",
  },

  nav: {
    main: "Navigimi kryesor",
    work: "Projektet",
    services: "Shërbimet",
    about: "Rreth meje",
    contact: "Kontakti",
    email: "Email",
    viewProjects: "Shiko projektet",
    openMenu: "Hap menynë",
    closeMenu: "Mbyll menynë",
    menu: "Menyja",
    emailMe: "Më shkruaj",
    language: "Gjuha",
  },

  hero: {
    eyebrow: "Zhvillues i pavarur & ndërtues i produkteve digjitale",
    title1: "Produkte digjitale",
    title2: "që bien në sy.",
    sub: "Ueb-faqe, aplikacione dhe produkte digjitale të shkallëzueshme — të dizajnuara dhe të zhvilluara nga koncepti i parë deri te përvoja e përfunduar.",
    talk: "Le të flasim",
    viewWork: "Shiko punët e mia",
    cardsLabel: "Çfarë bëj",
    more: "Shfaq detajet",
    less: "Fshih detajet",
    cards: [
      {
        title: "Nga ideja",
        body: "Idetë i kthej në produkte reale.",
        more: ["Koncepti dhe fushëveprimi i produktit", "Prototip i klikueshëm", "Rrugë e qartë deri te lansimi"],
      },
      {
        title: "Zhvillim",
        body: "Modern, i shkallëzueshëm dhe i besueshëm.",
        more: ["React, Next.js, TypeScript", "API, baza të dhënash, cloud", "Aplikacione iOS dhe Android"],
      },
      {
        title: "Dizajn",
        body: "I pastër, modern dhe i fokusuar në konvertim.",
        more: ["Dizajn UI dhe UX", "Brend dhe sistem dizajni", "Responsiv që nga fillimi"],
      },
      {
        title: "Ndikim real",
        body: "Produkte që njerëzit i përdorin vërtet.",
        more: ["Top 10 aplikacionet në Kosovë", "Vendi 1 në Google për një klient", "200 vizitorë në ditë"],
      },
    ],
    pillars: [
      { title: "Dizajn", body: "Modern & i pastër" },
      { title: "Zhvillim", body: "I shkallëzueshëm & i besueshëm" },
      { title: "Ndërtim", body: "Produkte reale" },
      { title: "Rritje", body: "Nga ideja te lansimi" },
    ],
    available: "I disponueshëm për punë freelance, projekte për klientë dhe bashkëpunime në produkte",
    together: "Le të ndërtojmë bashkë",
    scroll: "Shko te projektet",
    builtLabel: "Produktet që kam ndërtuar",
  },

  work: {
    eyebrow: "Projekte të përzgjedhura",
    title: "Projektet e mia.",
    viewAll: "Shiko të gjitha projektet",
    filterLabel: "Filtro projektet",
    filters: { all: "Të gjitha", product: "Produktet e mia", client: "Për klientë" },
    pageTitle1: "Produkte reale.",
    pageTitle2: "Të ndërtuara nga A-ja te Zh-ja.",
    pageSub:
      "Tri produkte të mia dhe një ueb-faqe për klient — secila e dizajnuar, e zhvilluar dhe e lansuar nga unë. Çdo pamje në këto faqe është marrë nga faqja reale.",
  },

  process: {
    title: "Nga ideja te lansimi — shpejt.",
    sub: "Bashkoj dizajnin, zhvillimin dhe të menduarit si produkt, që idetë të bëhen produkte reale që funksionojnë.",
    stages: [
      {
        title: "Dizajn",
        body: "Kuptoj idenë, skicoj konceptet dhe dizajnoj një përvojë të pastër e moderne.",
        chips: ["Koncept", "Wireframe", "Dizajn UI"],
      },
      {
        title: "Ndërtim",
        body: "Zhvilloj me teknologji moderne, me fokus te performanca dhe shkallëzimi.",
        chips: ["Frontend", "Backend", "Integrime"],
      },
      {
        title: "Përsosje",
        body: "Testoj, përmirësoj dhe lëmoj çdo detaj derisa të ndihet si duhet.",
        chips: ["Responsiv", "Performancë", "Qasshmëri"],
      },
      {
        title: "Lansim",
        body: "E nxjerr në botën reale dhe vazhdoj ta përmirësoj me reagime të vërteta.",
        chips: ["Publikim", "Monitorim", "Përmirësim"],
      },
    ],
    checklist: ["Ide", "Dizajn", "Zhvillim", "Lansim"],
    note: ["Produkte reale.", "Rezultate reale."],
    statLabel: "live",
    statBody: (shops: string) => `produkte nga ${shops} dyqane`,
    statValue: "1,3 mln+",
    hint: "Vazhdo të lëvizësh poshtë",
    step: (n: number, total: number) => `Hapi ${n} nga ${total}`,
  },

  services: {
    title: "Me çfarë mund të të ndihmoj.",
    sub: "Mbështetje nga ideja deri te lansimi — dhe më tej.",
    seenIn: "E gjen te",
    includes: "Përfshin",
    items: [
      {
        title: "Ueb-dizajn & Zhvillim",
        body: "Ueb-faqe moderne e responsive që duken bukur, hapen shpejt dhe sjellin kërkesa.",
        points: ["Ueb-faqe për kompani dhe produkte", "Landing page", "SEO dhe performancë", "Përmbajtje që e ndryshon vetë"],
      },
      {
        title: "Aplikacione Mobile",
        body: "Aplikacione për iPhone dhe Android, të dizajnuara dhe të ndërtuara krahas produktit në ueb.",
        points: ["Dizajn i aplikacionit", "Zhvillim nativ", "Publikim në App Store", "Një backend për ueb dhe aplikacion"],
      },
      {
        title: "AI & Automatizim",
        body: "Funksione me inteligjencë artificiale dhe procese të automatizuara që marrin përsipër punën e përsëritur.",
        points: ["Asistentë AI dhe chat", "Gjenerim përmbajtjeje dhe mediash", "Automatizim i proceseve", "Integrime me LLM"],
      },
      {
        title: "Softuer i Personalizuar / SaaS",
        body: "Aplikacione ueb dhe platforma SaaS — nga modeli i të dhënave deri te faturimi.",
        points: ["Panele dhe mjete të brendshme", "Llogari, role dhe ekipe", "Abonime dhe pagesa", "API dhe integrime"],
      },
      {
        title: "Shërbim i Plotë",
        body: "Një partner nga koncepti i parë deri te lansimi — dhe për gjithçka më pas.",
        points: ["Strategji dhe koncept", "Dizajn dhe zhvillim", "Hosting dhe publikim", "Mirëmbajtje dhe rritje"],
      },
    ],
  },

  results: {
    eyebrow: "Rezultatet",
    title: "Prova, jo premtime.",
    sub: "Çfarë ka sjellë puna deri tani.",
    items: [
      { value: "Top 10", label: "aplikacionet në Kosovë", note: "ZgjedhPlus — aplikacioni për iPhone." },
      { value: "#1", label: "në Google", note: "RRON Rent a Car — që atëherë dukshëm më shumë klientë." },
      { value: "200", label: "vizitorë në ditë", note: "FrameNotion, sipas statistikave të veta." },
      { value: "1,3 mln+", label: "produkte të krahasuara", note: "Nga 229 dyqane në Kosovë dhe Shqipëri." },
      { value: "5,0", label: "vlerësim në Google", note: "RRON Rent a Car, nga 21 komente." },
      { value: "5,2 mln+", label: "kontrolle çmimesh", note: "Në gjithë katalogun e ZgjedhPlus." },
    ],
  },

  clients: {
    eyebrow: "Me kë punoj",
    title: "Për biznese që duan të ecin përpara.",
    items: [
      {
        title: "Biznese të vogla dhe të reja",
        body: "Të duhet një prezantim profesional dhe një produkt që funksionon që nga dita e parë — pa punësuar një ekip të tërë.",
        points: ["Ueb-faqe ose produkti i parë, gati për lansim", "Një person kontakti, fushëveprim i qartë", "Hapësirë për rritje pas lansimit"],
      },
      {
        title: "Kompani që digjitalizojnë sistemet",
        body: "Punoni me tabela, letra ose mjete që nuk ju përshtaten më. Këto procese i kthej në softuer që ekipi juaj e përdor vërtet.",
        points: ["Analizë e proceseve ekzistuese", "Softuer dhe panele të personalizuara", "Automatizim dhe AI aty ku ndihmon"],
      },
    ],
    cta: "Fillo një projekt",
  },

  about: {
    statement:
      "I pavarur me zgjedhje. Nga fillimi deri në fund, nga një dorë. Ndërtoj produktet e mia dhe realizoj projekte për klientë — me komunikim të drejtpërdrejtë, përgjegjësi të plotë dhe një person përgjegjës nga koncepti deri te publikimi.",
    title: ["Produkte të mia", "dhe projekte për klientë."],
    body: "Punoj në produktet e mia dhe në projekte për klientë, duke bashkuar UI të fortë, realizim teknik dhe të menduarit si produkt, për përvoja digjitale që lënë gjurmë.",
    tiles: ["Projekte të përzgjedhura", "Punë në produkt nga A-ja te Zh-ja", "Dizajn + Zhvillim"],
    languages: "Punoj në shqip, gjermanisht dhe anglisht.",
  },

  cta: {
    title: "Le të ndërtojmë diçka që bie në sy.",
    sub: "Ke një projekt në mendje apo thjesht do të përshëndetesh? Jam gjithmonë i hapur për mundësi të reja.",
    email: "Më shkruaj",
    work: "Shiko punët e mia",
    marquee: ["Ueb-dizajn", "Aplikacione Mobile", "AI & Automatizim", "Softuer i Personalizuar", "SaaS", "Shërbim i Plotë"],
  },

  footer: {
    selectedWork: "Projektet",
    contact: "Kontakti",
    start: "Fillo një bisedë",
  },

  contact: {
    eyebrow: "Kontakti",
    title: "Le të flasim për projektin tënd.",
    sub: "Më trego çfarë ke në mendje. Mesazhi vjen drejt e në emailin tim.",
    name: "Emri",
    namePlaceholder: "Emri yt",
    email: "Email",
    emailPlaceholder: "ti@kompania.com",
    message: "Çfarë dëshiron të ndërtosh?",
    messagePlaceholder: "Disa rreshta për projektin, afatin dhe për çfarë të duhet ndihmë.",
    send: "Dërgo mesazhin",
    sending: "Duke dërguar…",
    sentTitle: "Mesazhi u dërgua.",
    sentBody: "Faleminderit — do të të përgjigjem me email.",
    error: "Nuk u dërgua. Provo përsëri ose shkruaj te",
    subject: "Kërkesë për projekt",
  },

  caseStudy: {
    allWork: "Të gjitha projektet",
    category: "Kategoria",
    role: "Roli",
    stack: "Teknologjia",
    live: "Live",
    overview: "Përmbledhje",
    overviewTitle: (name: string) => `Çfarë është ${name}.`,
    problemLabel: "Problemi & qëllimi",
    problemTitle: "Ku filloi dhe çfarë duhej të arrinte.",
    problem: "Problemi",
    objective: "Qëllimi",
    contributionLabel: "Kontributi im",
    contributionTitleProduct: "Çfarë bëra — nga ideja e parë deri te produkti live.",
    contributionTitleClient: "Çfarë bëra për klientin.",
    approachLabel: "Qasja në dizajn & teknikë",
    approachTitle: "Si u ndërtua.",
    featuresLabel: "Funksionet kryesore",
    featuresTitle: "Çfarë bën.",
    showcaseLabel: "Pamje",
    showcaseTitle: "Ja si duket në të vërtetë.",
    showcaseNote: (domain: string) => `Pamje të paredaktuara nga ${domain}, të marra nga faqja reale.`,
    notShown: "Nuk shfaqet",
    resultsLabel: "Rezultatet",
    resultsTitle: "Në numra.",
    resultsTitleNone: "Live dhe në përdorim.",
    visit: (domain: string) => `Vizito ${domain}`,
    next: "Projekti tjetër",
  },

  notFound: {
    title: "Kjo faqe nuk ekziston.",
    body: "Lidhja mund të jetë e vjetër ose adresa është shkruar gabim.",
    back: "Kthehu në fillim",
  },

  projects: {
    zgjedhplus: {
      tag: "Treg / Krahasim çmimesh",
      category: "Treg / Krahasim çmimesh",
      blurb: "Krahasimi i çmimeve për Kosovë & Shqipëri — 1,3 mln+ produkte nga 229 dyqane.",
      summary:
        "Platforma e krahasimit të çmimeve për Kosovë dhe Shqipëri: më shumë se 1,3 milion produkte nga 229 dyqane në një kërkim — me historik çmimesh, njoftime për çmim dhe aplikacion për iPhone.",
      role: "Koncept, dizajn, zhvillim dhe operim",
      overview: [
        "ZgjedhPlus është platformë për krahasimin e çmimeve në Kosovë dhe Shqipëri. Ajo i mbledh ofertat e dyqaneve online vendore në një katalog të kërkueshëm, që blerësit të shohin kush e shet një produkt, sa kushton në secilin dyqan dhe si ka lëvizur çmimi.",
        "Është produkt i imi: e formësova konceptin, e dizajnova ndërfaqen dhe e ndërtova platformën nga fillimi deri në fund — ueb-faqen, të dhënat pas saj dhe aplikacionin për iOS.",
      ],
      problem:
        "Blerjet online në Kosovë dhe Shqipëri janë të shpërndara në qindra dyqane të veçanta, pa një katalog të përbashkët. Për të krahasuar një produkt duhet hapur skedë pas skede — e prapë nuk e di nëse çmimi i sotëm është i mirë.",
      objective:
        "Të ndërtohet një vend për konsumatorët që u përgjigjet shpejt tri pyetjeve: ku mund ta blej, sa kushton në secilin dyqan dhe a është tani koha e duhur për ta blerë.",
      contribution: [
        "Koncepti dhe drejtimi i produktit",
        "Brendi, dizajni UI dhe UX",
        "Zhvillimi i frontend-it dhe backend-it",
        "Rrjedha e të dhënave për katalogun dhe çmimet",
        "Aplikacioni për iOS",
        "Publikimi dhe operimi i përditshëm",
      ],
      approach: [
        {
          title: "Kërkimi vjen i pari",
          body: "Faqja kryesore fillon me një fushë kërkimi dhe kategoritë më të kërkuara. Gjithçka tjetër — udhëtimet, paketat, kreditë, sigurimet — qëndron një nivel më poshtë, që premtimi kryesor të mbetet i qartë.",
        },
        {
          title: "Një produkt, shumë dyqane",
          body: "Artikujt nga dyqane të ndryshme lidhen me një faqe të vetme produkti. Ofertat qëndrojnë krah për krah, me çmim, disponueshmëri dhe lidhje të drejtpërdrejtë te dyqani.",
        },
        {
          title: "Çmimi me kalimin e kohës",
          body: "Çdo faqe produkti mban historikun e çmimit, me çmimin më të ulët, mesatar dhe më të lartë të periudhës. Njoftimi për çmim e kthen atë historik në diçka mbi të cilën blerësi mund të veprojë.",
        },
        {
          title: "E ndërtuar për katalog të madh",
          body: "Me më shumë se një milion produkte të listuara, faqet e listave dhe të produkteve përgatiten paraprakisht dhe ruhen në cache, që shfletimi të mbetet i shpejtë edhe me internet mobil.",
        },
      ],
      features: [
        { title: "Zbulimi i produkteve", body: "Kërkim, kategori, brende dhe faqe dyqanesh në gjithë katalogun." },
        { title: "Krahasim çmimesh", body: "Të gjitha ofertat për një produkt në një pamje, të renditura sipas çmimit." },
        { title: "Historiku i çmimit", body: "Grafik për çdo produkt me çmimin më të ulët, mesatar dhe më të lartë." },
        { title: "Njoftime për çmim & lista e dëshirave", body: "Njoftohesh kur produkti bie te çmimi që dëshiron." },
        { title: "Asistenti ZgjedhAI", body: "Asistent me AI që u përgjigjet pyetjeve për blerje me të dhëna reale nga katalogu." },
        { title: "Më shumë se produkte", body: "Krahasim i fluturimeve, hoteleve, veturave me qira, eSIM-ve, paketave mobile dhe të internetit, kredive dhe sigurimeve." },
      ],
      captions: {
        home: "Ballina — kërkimi, kategoritë dhe shërbimet",
        search: "Rezultatet e kërkimit me çmimin më të ulët për produkt",
        product: "Faqja e produktit — oferta më e mirë dhe dyqanet e tjera krah për krah",
        history: "Historiku i çmimit me njoftim për çmim në grafik",
        "home-mobile": "Ballina në telefon",
        "product-mobile": "Faqja e produktit në telefon",
        "search-mobile": "Kërkimi në telefon",
      },
      results: [
        { value: "Top 10", label: "aplikacionet në Kosovë" },
        { value: "1,3 mln+", label: "produkte të listuara" },
        { value: "229", label: "dyqane të krahasuara" },
        { value: "5,2 mln+", label: "kontrolle çmimesh" },
      ],
      resultsNote:
        "Shifrat e katalogut sipas zgjedhplus.com, tetor 2026.",
    },
    framenotion: {
      tag: "AI / SaaS kreativ",
      category: "AI / Automatizim kreativ",
      blurb: "Ngjit lidhjen e produktit, merr një video-reklamë 30-sekondëshe të gatshme.",
      summary:
        "Platformë me AI që e kthen çdo lidhje produkti në video-reklamë 30-sekondëshe të gatshme — e shkruar, me zë, me muzikë dhe e renderuar për minuta, jo për ditë.",
      role: "Koncept, dizajn dhe zhvillim",
      overview: [
        "FrameNotion e kthen lidhjen e një produkti në video të shkurtër reklamuese vertikale. Ngjit një URL; platforma e lexon faqen, shkruan për të një reklamë të personalizuar me animacion dhe nxjerr videon e përfunduar me zë dhe muzikë.",
        "Është produkt i imi. E dizajnova brendin dhe ndërfaqen dhe ndërtova rrjedhën e gjenerimit pas saj.",
      ],
      problem:
        "Video-reklamat e shkurtra janë të ngadalta dhe të shtrenjta për t'u prodhuar nga brendet e vogla. Mjetet me shabllone janë më të shpejta, por rezultati duket si shabllon.",
      objective:
        "Nga një hyrje e vetme — lidhja e produktit — të dalë një reklamë e përfunduar dhe e personalizuar, pa pasur nevojë për montazh.",
      contribution: [
        "Koncepti i produktit",
        "Brendi dhe dizajni i landing page",
        "Ndërfaqja e aplikacionit",
        "Rrjedha me AI: analiza e faqes, skenari dhe dizajni i skenave",
        "Renderimi i videos",
        "Llogaritë dhe faturimi",
      ],
      approach: [
        {
          title: "Një hyrje",
          body: "I gjithë produkti është ndërtuar rreth një fushe. Logoja, stili, zëri dhe muzika mund të caktohen më pas, ose të lihen në Auto.",
        },
        {
          title: "E shkruar, jo nga shablloni",
          body: "Çdo reklamë gjenerohet si dizajn i veçantë me animacion: skenat, komponentët dhe ritmi shkruhen për produktin në faqe, në vend që të derdhen në një format të gatshëm.",
        },
        {
          title: "E renderuar si video e vërtetë",
          body: "Rezultati është MP4 me zë, gati për formatet vertikale, me raporte të tjera pamjeje për vendosje të tjera.",
        },
        {
          title: "Trego rezultatin",
          body: "Landing page fillon me reklama që produkti i ka gjeneruar vërtet, të paprekura, që vizitorët ta gjykojnë rezultatin e jo një premtim.",
        },
      ],
      features: [
        { title: "Analiza e lidhjes", body: "Lexon faqen e produktit për audiencën, problemin, përfitimin dhe ofertën." },
        { title: "Reklamë e personalizuar", body: "Hyrja, historia dhe animacioni gjenerohen për çdo produkt." },
        { title: "Zë & muzikë", body: "Narracioni dhe muzika janë pjesë e videos." },
        { title: "Disa formate", body: "9:16, 4:5, 1:1 dhe 16:9 nga e njëjta reklamë." },
        { title: "Galeria e shembujve", body: "Reklama të gjeneruara me përshkrimin, këndvështrimin dhe kohëzgjatjen e tyre." },
        { title: "Plane dhe paketa", body: "Abonime dhe paketa njëherëshe me pagesë përmes Stripe." },
      ],
      captions: {
        home: "Landing page — një fushë për lidhjen e produktit",
        workflow: "Rrjedha: ngjit lidhjen, krijohet reklama, shkarko dhe posto",
        examples: "Reklama shembull, secila e gjeneruar nga një lidhje e vetme",
        features: "Funksionet — si bëhet një lidhje reklamë",
        "home-mobile": "Landing page në telefon",
        "examples-mobile": "Shembujt në telefon",
      },
      results: [
        { value: "200", label: "vizitorë në ditë" },
        { value: "30 s", label: "reklama, të renderuara me zë" },
        { value: "4", label: "formate nga një reklamë" },
        { value: "10", label: "reklama shembull, të paprekura" },
      ],
      resultsNote:
        "Shifra e vizitave nga statistikat e vetë produktit; të tjerat sipas framenotion.com, tetor 2026.",
      missing:
        "Editori dhe paneli i llogarisë janë pas hyrjes me llogari dhe nuk shfaqen këtu. Të gjitha pamjet më lart janë nga faqja publike.",
    },
    "rron-rent-a-car": {
      tag: "Projekt për klient",
      category: "Automobilistikë / Zhvillim ueb-faqeje",
      blurb: "Ueb-faqe premium për vetura me qira — vendi i parë në Google, 5,0 yje.",
      summary:
        "Ueb-faqja e një kompanie veturash me qira në Kosovë: flota e prezantuar si brend premium, kërkesa për rezervim me pak hapa — dhe vendi i parë në Google.",
      role: "Dizajn dhe zhvillim për klientin",
      overview: [
        "RRON Rent a Car është kompani veturash me qira në Kosovë. Unë e dizajnova dhe e ndërtova ueb-faqen e tyre: një prezantim i errët dhe premium i flotës, me rrjedhë rezervimi që përfundon aty ku biznesi tashmë flet me klientët — në WhatsApp.",
        "Kjo është punë për klient. Kërkesa, brendi dhe flota janë të klientit; dizajni, zhvillimi dhe publikimi janë të mitë.",
      ],
      problem:
        "Vetura me qira zgjidhet për pak minuta, kryesisht në telefon: cilat vetura ka, sa kushtojnë në ditë dhe si rezervoj. Faqja duhej t'u përgjigjej këtyre pa e detyruar askënd të kërkojë.",
      objective:
        "Flota të prezantohet me nivelin që e përfaqëson brendin, dhe kërkesa për rezervim të jetë sa më e shkurtër.",
      contribution: [
        "Dizajni i ueb-faqes në identitetin vizual të klientit",
        "Zhvillim responsiv i frontend-it",
        "Prezantimi i flotës me filtra",
        "Kërkesa për rezervim dhe kontakti",
        "Versioni në anglisht dhe shqip",
        "Hosting, publikim dhe SEO",
      ],
      approach: [
        {
          title: "Shiriti i rezervimit është në qendër",
          body: "Marrja, kthimi dhe datat janë drejt në ekranin e parë. Vizitori mund ta nisë kërkesën pa lëvizur poshtë.",
        },
        {
          title: "Veturat të paraqitura si produkte",
          body: "Çdo veturë ka kartelë të pastër me të dhënat kryesore dhe çmimin ditor. Faqja e flotës shton kategoritë, renditjen dhe kontrollin e disponueshmërisë për datat e zgjedhura.",
        },
        {
          title: "Kërkesat arrijnë në WhatsApp",
          body: "Klienti i menaxhon rezervimet në WhatsApp, prandaj rrjedha kalon aty me të dhënat tashmë të plotësuara, në vend që të hapet një kanal i ri.",
        },
        {
          title: "E menaxhuar nga vetë klienti",
          body: "Veturat, çmimet dhe disponueshmëria mirëmbahen përmes një paneli administrimi, kështu flota mbetet e përditësuar pa zhvillues.",
        },
      ],
      features: [
        { title: "Pasqyra e flotës", body: "Kartela veturash me transmisionin, karburantin, ulëset dhe çmimin ditor." },
        { title: "Kategori & renditje", body: "Ekonomike, kompakte, premium dhe luksoze, të renditshme sipas çmimit." },
        { title: "Kontroll i disponueshmërisë", body: "Filtro flotën sipas datës së marrjes dhe kthimit." },
        { title: "Kërkesë për rezervim", body: "Formular i shkurtër që kalon në WhatsApp." },
        { title: "Lokacionet", body: "Pikat e marrjes, përfshirë aeroportin, me të dhënat e tyre." },
        { title: "Dy gjuhë", body: "Anglisht dhe shqip, të ndërrueshme nga kreu i faqes." },
      ],
      captions: {
        home: "Ballina — pamja kryesore me shiritin e rezervimit",
        "fleet-cards": "Parapamje e flotës me çmimin ditor dhe butonin e rezervimit",
        fleet: "Faqja e flotës — disponueshmëria, kategoritë dhe renditja",
        "home-mobile": "Ballina në telefon",
        "fleet-mobile": "Flota në telefon",
      },
      results: [
        { value: "#1", label: "në Google" },
        { value: "5,0", label: "vlerësim në Google nga 21 komente" },
        { value: "16", label: "vetura online" },
        { value: "3", label: "lokacione marrjeje" },
      ],
      resultsNote:
        "Që nga lansimi, ueb-faqja renditet e para në Google dhe biznesi ka dukshëm më shumë klientë. Vlerësimi dhe numri i komenteve nga Google, siç shfaqen në rentacarron.com në tetor 2026.",
    },
    subtoapi: {
      tag: "SaaS për zhvillues",
      category: "Mjete për zhvillues / SaaS",
      blurb: "Paneli i kontrollit mes Claude dhe aplikacioneve të tua.",
      summary:
        "Platformë për zhvillues që e lidh qasjen e mbështetur në Claude me aplikacionet përmes një API — çelësa, playground, monitorim i përdorimit dhe vende për ekip në një panel.",
      role: "Koncept, dizajn dhe zhvillim",
      overview: [
        "SubToAPI është platformë për zhvillues që e lidh qasjen e mbështetur në Claude me aplikacionet përmes një ndërfaqeje API. Zhvilluesit lidhen një herë, krijojnë çelësa API për aplikacionet, dërgojnë kërkesa nga një playground dhe shohin të dhënat e përdorimit për çdo përgjigje.",
        "Është produkt i imi: një panel, një API publike dhe dokumentimi rreth saj, të dizajnuara dhe të ndërtuara si një sistem i vetëm.",
      ],
      problem:
        "Thirrja e një modeli nga aplikacionet e tua kërkon më shumë se një endpoint: çelësa për çdo aplikacion, mënyrë për të testuar kërkesat, pasqyrë të përdorimit dhe qasje për pjesën tjetër të ekipit.",
      objective:
        "Zhvilluesve t'u jepet një panel kontrolli për këtë — lidhu, krijo çelësa, testo dhe monitoro — me dokumentim që e bën kërkesën e parë të funksionojë për pak minuta.",
      contribution: [
        "Koncepti i produktit",
        "Brendi dhe faqja e marketingut",
        "Dizajni dhe zhvillimi i panelit",
        "API publike dhe menaxhimi i çelësave",
        "Dokumentimi për zhvillues",
        "Abonimet dhe vendet për ekip",
      ],
      approach: [
        {
          title: "Gjendja me një shikim",
          body: "Paneli hapet me gjendjen e lidhjes dhe shifrat e kërkesave të fundit, sepse këtë e kontrollon i pari një zhvillues.",
        },
        {
          title: "Playground që dërgon kërkesa reale",
          body: "Mesazhe të vetme ose biseda të plota me mjete mund të provohen në shfletues — të njëjtat kërkesa që do t'i bënte një aplikacion.",
        },
        {
          title: "Përdorimi si metadata",
          body: "Tokenët, vonesa, statusi dhe ID-të e kërkesave kthehen me çdo përgjigje dhe mblidhen për çdo çelës, kështu përdorimi gjurmohet nga metadata e jo nga përmbajtja e prompteve.",
        },
        {
          title: "Dokumentimi si pjesë e produktit",
          body: "Fillimi i shpejtë, referenca e endpoint-eve, streaming dhe përdorimi i mjeteve shkruhen krahas API-së dhe ndajnë dizajnin e panelit.",
        },
      ],
      features: [
        { title: "Paneli", body: "Gjendja e lidhjes dhe pasqyra e kërkesave në një vend." },
        { title: "Menaxhimi i çelësave API", body: "Çelësa për aplikacione, të krijuar dhe të anuluar nga paneli." },
        { title: "Playground", body: "Dërgo kërkesa reale dhe shqyrto përgjigjen." },
        { title: "Monitorimi i përdorimit", body: "Tokenët, vonesa dhe statusi për çdo kërkesë." },
        { title: "Qasje për ekipin", body: "Vende dhe role për kolegët." },
        { title: "Dokumentimi", body: "Fillimi i shpejtë, mesazhet, streaming dhe përdorimi i mjeteve." },
      ],
      captions: {
        home: "Landing page me parapamjen e panelit",
        docs: "Dokumentimi — fillimi i shpejtë",
        "api-reference": "Referenca e API-së për endpoint-in e mesazheve",
        pricing: "Çmimet",
        "home-mobile": "Landing page në telefon",
      },
      results: [
        { value: "3", label: "plane, nga 9 € në muaj" },
        { value: "200", label: "vende në planin më të madh" },
        { value: "1.000", label: "kërkesa në minutë në maksimum" },
        { value: "4", label: "udhëzues API në dokumentim" },
      ],
      resultsNote:
        "Detajet e planeve sipas subtoapi.app, tetor 2026. Shifrat e përdorimit nuk janë publike.",
      missing:
        "Paneli pas hyrjes, menaxhimi i çelësave API, playground-i dhe pamjet e përdorimit kërkojnë llogari dhe nuk shfaqen si pamje ekrani. Paneli që shihet më lart është parapamja e vetë produktit në landing page.",
    },
  },
};
