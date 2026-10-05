import type { Dict } from "./en";

export const de: Dict = {
  meta: {
    homeTitle: "Leonit Xhini — Unabhängiger Entwickler für digitale Produkte",
    homeDescription:
      "Ich gestalte und entwickle Websites, mobile Apps, KI-Produkte und individuelle Software für kleine Unternehmen und Firmen, die ihre Abläufe digitalisieren – vom ersten Konzept bis zum fertigen Produkt.",
    workTitle: "Ausgewählte Projekte — Leonit Xhini",
    workDescription:
      "Vier Projekte, von Anfang bis Ende gestaltet und entwickelt: ZgjedhPlus, FrameNotion, RRON Rent a Car und SubToAPI – drei eigene Produkte und eine Kunden-Website.",
    caseTitle: (name: string) => `${name} — Case Study — Leonit Xhini`,
    notFoundTitle: "Seite nicht gefunden — Leonit Xhini",
    notFoundDescription: "Diese Seite existiert nicht.",
  },

  common: {
    role: "Unabhängiger Entwickler für digitale Produkte",
    skip: "Zum Inhalt springen",
    typeProduct: "Eigenes Produkt",
    typeClient: "Kundenprojekt",
    viewCase: "Case Study ansehen",
    close: "Schließen",
  },

  nav: {
    main: "Hauptnavigation",
    work: "Projekte",
    designs: "Designs",
    services: "Leistungen",
    about: "Über mich",
    contact: "Kontakt",
    email: "E-Mail",
    viewProjects: "Projekte ansehen",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    menu: "Menü",
    emailMe: "E-Mail schreiben",
    language: "Sprache",
  },

  hero: {
    eyebrow: "Unabhängiger Entwickler für digitale Produkte",
    title1: "Digitale Produkte,",
    title2: "die herausstechen.",
    sub: "Websites, Anwendungen und skalierbare digitale Produkte – gestaltet und entwickelt vom ersten Konzept bis zum fertigen Erlebnis.",
    talk: "Projekt besprechen",
    viewWork: "Projekte ansehen",
    cardsLabel: "Was ich mache",
    more: "Details anzeigen",
    less: "Details ausblenden",
    cards: [
      {
        title: "Von der Idee",
        body: "Aus Ideen werden echte Produkte.",
        more: ["Konzept und Produktumfang", "Klickbarer Prototyp", "Klarer Weg bis zum Launch"],
      },
      {
        title: "Entwicklung",
        body: "Modern, skalierbar und zuverlässig.",
        more: ["React, Next.js, TypeScript", "APIs, Datenbanken, Cloud", "iOS- und Android-Apps"],
      },
      {
        title: "Design",
        body: "Klar, modern und auf Conversion ausgelegt.",
        more: ["UI- und UX-Design", "Marke und Designsystem", "Von Anfang an responsiv"],
      },
      {
        title: "Echte Wirkung",
        body: "Produkte, die wirklich genutzt werden.",
        more: ["Top 10 der Shopping-Apps im Kosovo", "Platz 1 bei Google für einen Kunden", "Live-Produkte mit echten Nutzern"],
      },
    ],
    pillars: [
      { title: "Design", body: "Modern & klar" },
      { title: "Entwicklung", body: "Skalierbar & stabil" },
      { title: "Umsetzung", body: "Echte Produkte" },
      { title: "Wachstum", body: "Von der Idee zum Launch" },
    ],
    available: "Verfügbar für Freelance-Aufträge, Kundenprojekte und Produkt-Kooperationen",
    together: "Gemeinsam starten",
    scroll: "Zu den Projekten scrollen",
    builtLabel: "Produkte, die ich gebaut habe",
  },

  work: {
    eyebrow: "Ausgewählte Projekte",
    title: "Meine Projekte.",
    viewAll: "Alle Projekte ansehen",
    filterLabel: "Projekte filtern",
    filters: { all: "Alle", product: "Eigene Produkte", client: "Kundenprojekte" },
    pageTitle1: "Echte Produkte.",
    pageTitle2: "Komplett aus einer Hand.",
    pageSub:
      "Drei eigene Produkte und eine Website für einen Kunden – jedes von mir gestaltet, entwickelt und live gebracht. Jeder Screenshot auf diesen Seiten stammt von der Live-Seite.",
  },

  designs: {
    eyebrow: "Das bauen wir",
    title: "Für jede Branche das passende Design.",
    text: "Acht Beispiel-Websites zeigen die Richtung – von der Autovermietung bis zur Zahnarztpraxis. Jede ist eine funktionierende Seite mit eigenem Auftritt, kein Bild. Texte, Fotos und Farben werden danach auf Ihr Unternehmen zugeschnitten.",
    open: "Live-Demo öffnen",
    request: "So ein Design anfragen",
    note: "Beispiel-Designs, keine Kundenprojekte.",
    pick: "Branche wählen",
    desktop: "Desktop-Ansicht",
    phone: "Handy-Ansicht",
    items: {
      rental: { name: "Autovermietung", style: "Dunkel und kantig, mit Buchungsleiste und Flotte." },
      restaurant: { name: "Restaurant", style: "Warm und editorial, mit Speisekarte und Reservierung." },
      craft: { name: "Handwerk", style: "Kräftig und klar, mit Vorher-Nachher und Angebotsformular." },
      beauty: { name: "Friseur & Beauty", style: "Weich und luxuriös, mit Preisliste und Terminbuchung." },
      clinic: { name: "Praxis", style: "Hell und ruhig, mit Online-Terminauswahl." },
      realestate: { name: "Immobilien", style: "Architektonisch, mit Objektsuche und Wertermittlung." },
      shop: { name: "Shop", style: "Farbig und verspielt, mit Produkten und Warenkorb." },
      service: { name: "Beratung & Dienstleistung", style: "Hell und gläsern, mit Paketen und Ablauf." },
    },
  },

  process: {
    title: "Von der Idee zum Launch – schnell.",
    sub: "Ich verbinde Design, Entwicklung und Produktdenken, damit aus Ideen echte, funktionierende Produkte werden.",
    stages: [
      {
        title: "Design",
        body: "Die Idee verstehen, Konzepte skizzieren und ein klares, modernes Erlebnis gestalten.",
        chips: ["Konzept", "Wireframes", "UI-Design"],
      },
      {
        title: "Entwicklung",
        body: "Umsetzung mit modernen Technologien – mit Fokus auf Performance und Skalierbarkeit.",
        chips: ["Frontend", "Backend", "Schnittstellen"],
      },
      {
        title: "Feinschliff",
        body: "Testen, verbessern und jedes Detail polieren, bis es sich richtig anfühlt.",
        chips: ["Responsiv", "Performance", "Barrierefreiheit"],
      },
      {
        title: "Launch",
        body: "Live gehen und mit echtem Feedback weiter verbessern.",
        chips: ["Deployment", "Monitoring", "Weiterentwicklung"],
      },
    ],
    checklist: ["Idee", "Design", "Entwicklung", "Launch"],
    note: ["Echte Produkte.", "Echte Ergebnisse."],
    statLabel: "live",
    statBody: "der Shopping-Apps im Kosovo",
    statValue: "Top 10",
    hint: "Weiterscrollen",
    step: (n: number, total: number) => `Schritt ${n} von ${total}`,
  },

  services: {
    title: "Wobei ich helfen kann.",
    sub: "Begleitung von der Idee bis zum Launch – und darüber hinaus.",
    seenIn: "Zu sehen bei",
    includes: "Enthält",
    items: [
      {
        title: "Webdesign & Entwicklung",
        body: "Moderne, responsive Websites, die gut aussehen, schnell laden und Anfragen bringen.",
        points: ["Unternehmens- und Produktwebsites", "Landingpages", "SEO und Performance", "Inhalte selbst pflegbar"],
      },
      {
        title: "Mobile Apps",
        body: "Apps für iPhone und Android, gestaltet und entwickelt passend zum Webprodukt.",
        points: ["App-Design", "Native Entwicklung", "Veröffentlichung im App Store", "Ein Backend für Web und App"],
      },
      {
        title: "KI & Automatisierung",
        body: "KI-Funktionen und automatisierte Abläufe, die wiederkehrende Arbeit übernehmen.",
        points: ["KI-Assistenten und Chat", "Inhalte und Medien generieren", "Abläufe automatisieren", "LLM-Integrationen"],
      },
      {
        title: "Individuelle Software / SaaS",
        body: "Webanwendungen und SaaS-Plattformen – vom Datenmodell bis zur Abrechnung.",
        points: ["Dashboards und interne Tools", "Konten, Rollen und Teams", "Abos und Zahlungen", "APIs und Integrationen"],
      },
      {
        title: "Komplettservice",
        body: "Ein Ansprechpartner vom ersten Konzept bis zum Launch – und für alles danach.",
        points: ["Strategie und Konzept", "Design und Entwicklung", "Hosting und Deployment", "Wartung und Wachstum"],
      },
    ],
  },

  results: {
    eyebrow: "Ergebnisse",
    title: "Belege statt Versprechen.",
    sub: "Was aus der Arbeit bisher geworden ist.",
    items: [
      { value: "Top 10", label: "der Shopping-Apps im Kosovo", note: "ZgjedhPlus – Website und iPhone-App aus einer Hand." },
      { value: "#1", label: "bei Google", note: "RRON Rent a Car – seitdem deutlich mehr Kunden." },
      { value: "1", label: "Ansprechpartner", note: "Konzept, Design, Entwicklung und Launch – ohne Übergaben dazwischen." },
    ],
  },

  clients: {
    eyebrow: "Für wen ich arbeite",
    title: "Für Unternehmen, die vorankommen wollen.",
    items: [
      {
        title: "Kleine und neue Unternehmen",
        body: "Sie brauchen einen professionellen Auftritt und ein Produkt, das vom ersten Tag an funktioniert – ohne ein ganzes Team einzustellen.",
        points: ["Website oder erstes Produkt, bereit zum Start", "Ein Ansprechpartner, klarer Umfang", "Ausbaufähig nach dem Launch"],
      },
      {
        title: "Unternehmen, die ihre Systeme digitalisieren",
        body: "Sie arbeiten mit Tabellen, Papier oder Tools, die nicht mehr passen. Ich mache aus diesen Abläufen Software, die Ihr Team wirklich nutzt.",
        points: ["Analyse der bestehenden Abläufe", "Individuelle Software und Dashboards", "Automatisierung und KI, wo sie hilft"],
      },
    ],
    cta: "Projekt starten",
  },

  about: {
    statement:
      "Unabhängig aus Überzeugung. Von Anfang bis Ende aus einer Hand. Ich baue eigene Produkte und setze Kundenprojekte um – mit direkter Kommunikation, voller Verantwortung und einem Ansprechpartner vom Konzept bis zum Deployment.",
    title: ["Eigene Produkte", "und Kundenprojekte."],
    body: "Ich arbeite an eigenen Produkten und an Kundenprojekten und verbinde starkes UI, saubere technische Umsetzung und Produktdenken zu digitalen Erlebnissen, die etwas bewirken.",
    tiles: ["Ausgewählte Projekte", "Produktarbeit von A bis Z", "Design + Entwicklung"],
    languages: "Ich arbeite auf Deutsch, Englisch und Albanisch.",
  },

  cta: {
    title: "Bauen wir etwas, das heraussticht.",
    sub: "Sie haben ein Projekt im Kopf oder möchten einfach Hallo sagen? Ich bin immer offen für Neues.",
    email: "E-Mail schreiben",
    work: "Projekte ansehen",
    marquee: ["Webdesign", "Mobile Apps", "KI & Automatisierung", "Individuelle Software", "SaaS", "Komplettservice"],
  },

  footer: {
    selectedWork: "Projekte",
    contact: "Kontakt",
    start: "Gespräch beginnen",
  },

  contact: {
    eyebrow: "Kontakt",
    title: "Sprechen wir über Ihr Projekt.",
    sub: "Schreiben Sie mir, was Sie vorhaben. Die Nachricht landet direkt in meinem Postfach.",
    name: "Name",
    namePlaceholder: "Ihr Name",
    email: "E-Mail",
    emailPlaceholder: "sie@firma.de",
    message: "Was möchten Sie umsetzen?",
    messagePlaceholder: "Ein paar Zeilen zum Projekt, zum Zeitrahmen und dazu, wobei Sie Unterstützung brauchen.",
    send: "Nachricht senden",
    sending: "Wird gesendet …",
    sentTitle: "Nachricht gesendet.",
    sentBody: "Vielen Dank – ich melde mich per E-Mail.",
    error: "Das hat nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie an",
    subject: "Projektanfrage",
  },

  caseStudy: {
    allWork: "Alle Projekte",
    category: "Kategorie",
    role: "Rolle",
    stack: "Technologie",
    live: "Live",
    overview: "Überblick",
    overviewTitle: (name: string) => `Was ${name} ist.`,
    problemLabel: "Problem & Ziel",
    problemTitle: "Wo es anfing – und was es leisten sollte.",
    problem: "Das Problem",
    objective: "Das Ziel",
    contributionLabel: "Mein Beitrag",
    contributionTitleProduct: "Was ich gemacht habe – von der ersten Idee bis zum Live-Produkt.",
    contributionTitleClient: "Was ich für den Kunden gemacht habe.",
    approachLabel: "Design & technischer Ansatz",
    approachTitle: "Wie es aufgebaut ist.",
    featuresLabel: "Kernfunktionen",
    featuresTitle: "Was es kann.",
    showcaseLabel: "Einblicke",
    showcaseTitle: "So sieht es wirklich aus.",
    showcaseNote: (domain: string) => `Unbearbeitete Screenshots von ${domain}, direkt von der Live-Seite.`,
    notShown: "Nicht gezeigt",
    resultsLabel: "Ergebnisse",
    resultsTitle: "In Zahlen.",
    resultsTitleNone: "Live und im Einsatz.",
    visit: (domain: string) => `${domain} besuchen`,
    forYou: "Was das für Ihr Projekt heißt",
    next: "Nächstes Projekt",
  },

  notFound: {
    title: "Diese Seite gibt es nicht.",
    body: "Der Link ist vielleicht veraltet oder die Adresse hat einen Tippfehler.",
    back: "Zurück zur Startseite",
  },

  projects: {
    zgjedhplus: {
      tag: "Marktplatz / Preisvergleich",
      category: "Marktplatz / Preisvergleich",
      blurb: "Ein Marktplatz mit eigener iPhone-App – von der Idee in die Top 10 im Kosovo.",
      summary:
        "Die Preisvergleichsplattform für Kosovo und Albanien: die Angebote der Onlineshops beider Länder in einer Suche – mit Preisverlauf, Preisalarm und eigener iPhone-App.",
      forYou:
        "Sie brauchen eine Plattform, einen Marktplatz oder eine App? So weit kann eine Person eine Idee bringen: Website, Backend und iPhone-App aus einer Hand – bis in die Top 10 der Apps eines Landes.",
      role: "Konzept, Design, Entwicklung und Betrieb",
      overview: [
        "ZgjedhPlus ist eine Preisvergleichsplattform für Kosovo und Albanien. Sie bündelt die Angebote lokaler Onlineshops in einem durchsuchbaren Katalog: Käufer sehen, wer ein Produkt verkauft, was es in jedem Shop kostet und wie sich der Preis entwickelt hat.",
        "Es ist mein eigenes Produkt: Ich habe das Konzept entwickelt, die Oberfläche gestaltet und die Plattform komplett gebaut – die Website, die Daten dahinter und die iOS-App.",
      ],
      problem:
        "Onlineshopping im Kosovo und in Albanien verteilt sich auf Hunderte einzelne Shops ohne gemeinsamen Katalog. Wer ein Produkt vergleichen will, öffnet Tab um Tab – und weiß am Ende trotzdem nicht, ob der heutige Preis gut ist.",
      objective:
        "Einen Ort für Verbraucher schaffen, der drei Fragen schnell beantwortet: Wo bekomme ich es, was kostet es in welchem Shop, und ist jetzt ein guter Zeitpunkt zum Kaufen?",
      contribution: [
        "Produktkonzept und Ausrichtung",
        "Marke, UI- und UX-Design",
        "Frontend- und Backend-Entwicklung",
        "Datenpipeline für Katalog und Preise",
        "iOS-App",
        "Deployment und laufender Betrieb",
      ],
      approach: [
        {
          title: "Die Suche steht vorn",
          body: "Die Startseite beginnt mit einem Suchfeld und den gefragtesten Kategorien. Alles Weitere – Reisen, Tarife, Kredite, Versicherungen – liegt eine Ebene darunter, damit das Kernversprechen klar bleibt.",
        },
        {
          title: "Ein Produkt, viele Shops",
          body: "Einträge aus verschiedenen Shops werden einer gemeinsamen Produktseite zugeordnet. Die Angebote stehen nebeneinander – mit Preis, Verfügbarkeit und direktem Link zum Shop.",
        },
        {
          title: "Der Preis im Zeitverlauf",
          body: "Jede Produktseite führt einen Preisverlauf mit dem niedrigsten, durchschnittlichen und höchsten Preis des Zeitraums. Ein Preisalarm macht daraus etwas, womit Käufer handeln können.",
        },
        {
          title: "Gebaut für einen großen Katalog",
          body: "Bei einem so großen Katalog werden Listen- und Produktseiten vorab aufbereitet und gecacht, damit das Stöbern auch mit Mobilfunkverbindung schnell bleibt.",
        },
      ],
      features: [
        { title: "Produkte entdecken", body: "Suche, Kategorien, Marken und Shop-Seiten über den gesamten Katalog." },
        { title: "Preisvergleich", body: "Alle Angebote zu einem Produkt in einer Ansicht, nach Preis sortiert." },
        { title: "Preisverlauf", body: "Ein Diagramm pro Produkt mit niedrigstem, durchschnittlichem und höchstem Preis." },
        { title: "Preisalarm & Merkliste", body: "Benachrichtigung, sobald ein Produkt den Wunschpreis erreicht." },
        { title: "ZgjedhAI-Assistent", body: "Ein KI-Assistent, der Einkaufsfragen mit Live-Daten aus dem Katalog beantwortet." },
        { title: "Mehr als Produkte", body: "Vergleich von Flügen, Hotels, Mietwagen, eSIMs, Mobilfunk- und Internettarifen, Krediten und Versicherungen." },
      ],
      captions: {
        home: "Startseite – Suche, Kategorien und Themenbereiche",
        search: "Suchergebnisse mit dem günstigsten Preis je Produkt",
        product: "Produktseite – das beste Angebot und die anderen Shops nebeneinander",
        history: "Preisverlauf mit Preisalarm im Diagramm",
        "home-mobile": "Startseite mobil",
        "product-mobile": "Produktseite mobil",
        "search-mobile": "Suche mobil",
      },
      results: [
        { value: "Top 10", label: "der Shopping-Apps im Kosovo" },
      ],
      resultsNote:
        "App-Platzierung in der Kategorie Shopping im Kosovo.",
    },
    framenotion: {
      tag: "KI / Creative SaaS",
      category: "KI / kreative Automatisierung",
      blurb: "Ein KI-Produkt, das aus einem Link eine fertige Video-Ad macht.",
      summary:
        "Eine KI-Plattform, die aus jedem Produktlink eine fertige 30-Sekunden-Video-Ad macht – geschrieben, vertont, mit Musik unterlegt und in Minuten statt Tagen gerendert.",
      forYou:
        "Sie wollen KI in Ihrem Produkt? Hier leistet sie echte Arbeit: Sie liest eine Seite, schreibt die Ad und rendert das Video – mit Konten und Online-Zahlung drumherum.",
      role: "Konzept, Design und Entwicklung",
      overview: [
        "FrameNotion macht aus einem Produktlink ein kurzes Werbevideo im Hochformat. Man fügt eine URL ein; die Plattform liest die Seite, schreibt dafür eine individuelle Motion-Ad und rendert ein fertiges Video mit Sprecherstimme und Musik.",
        "Es ist mein eigenes Produkt. Ich habe Marke und Oberfläche gestaltet und die Generierungs-Pipeline dahinter gebaut.",
      ],
      problem:
        "Kurze Video-Ads sind für kleine Marken langsam und teuer in der Produktion. Template-Tools sind schneller – aber das Ergebnis sieht nach Template aus.",
      objective:
        "Aus einer einzigen Eingabe – einem Produktlink – eine fertige, individuelle Ad machen, ohne Schnitt-Timeline dazwischen.",
      contribution: [
        "Produktkonzept",
        "Marke und Landingpage-Design",
        "Oberfläche der Anwendung",
        "KI-Pipeline: Seitenanalyse, Skript und Szenendesign",
        "Video-Rendering",
        "Konten und Abrechnung",
      ],
      approach: [
        {
          title: "Eine Eingabe",
          body: "Das ganze Produkt ist um ein einziges Feld gebaut. Logo, Stil, Stimme und Musik lassen sich danach festlegen – oder bleiben auf Auto.",
        },
        {
          title: "Geschrieben, nicht aus der Vorlage",
          body: "Jede Ad entsteht als eigenes Motion-Design: Szenen, Komponenten und Timing werden für das Produkt auf der Seite geschrieben, statt in ein festes Layout gegossen zu werden.",
        },
        {
          title: "Als echtes Video gerendert",
          body: "Das Ergebnis ist ein MP4 mit Ton, fertig für vertikale Feeds – mit weiteren Seitenverhältnissen für andere Platzierungen.",
        },
        {
          title: "Das Ergebnis zeigen",
          body: "Die Landingpage beginnt mit Ads, die das Produkt wirklich erzeugt hat, unverändert gerendert. Besucher beurteilen das Ergebnis statt eines Versprechens.",
        },
      ],
      features: [
        { title: "Link-Analyse", body: "Liest die Produktseite nach Zielgruppe, Problem, Nutzen und Angebot." },
        { title: "Individuelle Motion-Ad", body: "Hook, Story und Motion-Design werden pro Produkt erzeugt." },
        { title: "Sprecherstimme & Musik", body: "Stimme und Soundtrack sind Teil des Renderings." },
        { title: "Mehrere Formate", body: "9:16, 4:5, 1:1 und 16:9 aus derselben Ad." },
        { title: "Beispiel-Galerie", body: "Erzeugte Ads mit Briefing, Ansatz und Timeline." },
        { title: "Abos und Pakete", body: "Abonnements und Einmalpakete mit Checkout über Stripe." },
      ],
      captions: {
        home: "Landingpage – ein Feld für den Produktlink",
        workflow: "Der Ablauf: Link einfügen, Ad wird erstellt, herunterladen und posten",
        examples: "Beispiel-Ads, jede aus einem einzigen Link erzeugt",
        features: "Funktionen – wie aus einem Link eine Ad wird",
        "home-mobile": "Landingpage mobil",
        "examples-mobile": "Beispiele mobil",
      },
      results: [],
      resultsNote: "",
      missing:
        "Editor und Konto-Dashboard liegen hinter dem Login und werden hier nicht gezeigt. Alle Screenshots oben stammen von der öffentlichen Seite.",
    },
    "rron-rent-a-car": {
      tag: "Kundenprojekt",
      category: "Automotive / Website-Entwicklung",
      blurb: "Eine Mietwagen-Website, die bei Google auf Platz 1 steht und Buchungen bringt.",
      summary:
        "Die Website einer Autovermietung im Kosovo: die Flotte präsentiert wie eine Premium-Marke, die Buchungsanfrage in wenigen Schritten – und Platz 1 bei Google.",
      forYou:
        "Sie brauchen eine Website, die Kunden bringt? Diese steht bei Google auf Platz 1, macht aus Besuchern Buchungsanfragen auf WhatsApp – und der Inhaber pflegt Autos und Preise selbst.",
      role: "Design und Entwicklung für den Kunden",
      overview: [
        "RRON Rent a Car ist eine Autovermietung im Kosovo. Ich habe ihre Website gestaltet und gebaut: eine dunkle, hochwertige Präsentation der Flotte mit einem Buchungsablauf, der dort endet, wo das Unternehmen ohnehin mit seinen Kunden spricht – auf WhatsApp.",
        "Das ist eine Kundenarbeit. Auftrag, Marke und Flotte gehören dem Kunden; Design, Entwicklung und Deployment stammen von mir.",
      ],
      problem:
        "Ein Mietwagen wird in wenigen Minuten entschieden, meist am Handy: Welche Autos gibt es, was kosten sie pro Tag, und wie buche ich? Die Website musste das beantworten, ohne dass jemand suchen muss.",
      objective:
        "Die Flotte so hochwertig zeigen, wie es zur Marke passt – und den Weg zur Buchungsanfrage so kurz wie möglich machen.",
      contribution: [
        "Website-Design im Erscheinungsbild des Kunden",
        "Responsive Frontend-Entwicklung",
        "Flottenpräsentation mit Filtern",
        "Buchungsanfrage und Kontaktweg",
        "Englische und albanische Version",
        "Hosting, Deployment und SEO",
      ],
      approach: [
        {
          title: "Die Buchungsleiste ist der Hero",
          body: "Abholung, Rückgabe und Zeitraum stehen direkt auf dem ersten Bildschirm. Besucher können eine Anfrage starten, ohne zu scrollen.",
        },
        {
          title: "Autos wie Produkte gezeigt",
          body: "Jedes Fahrzeug hat eine klare Karte mit den wichtigsten Daten und dem Tagespreis. Die Flottenseite ergänzt Kategorien, Sortierung und eine Verfügbarkeitsprüfung für den gewählten Zeitraum.",
        },
        {
          title: "Anfragen landen auf WhatsApp",
          body: "Der Kunde wickelt Buchungen über WhatsApp ab. Der Ablauf übergibt deshalb dorthin – mit bereits ausgefüllten Angaben, statt ein neues Postfach einzuführen.",
        },
        {
          title: "Vom Kunden selbst gepflegt",
          body: "Fahrzeuge, Preise und Verfügbarkeit werden über einen Admin-Bereich gepflegt. Die Flotte bleibt aktuell, ohne dass ein Entwickler nötig ist.",
        },
      ],
      features: [
        { title: "Flottenübersicht", body: "Fahrzeugkarten mit Getriebe, Kraftstoff, Sitzen und Tagespreis." },
        { title: "Kategorien & Sortierung", body: "Economy, Kompakt, Premium und Luxus, sortierbar nach Preis." },
        { title: "Verfügbarkeit prüfen", body: "Flotte nach Abhol- und Rückgabedatum filtern." },
        { title: "Buchungsanfrage", body: "Ein kurzes Formular, das an WhatsApp übergibt." },
        { title: "Standorte", body: "Abholorte inklusive Flughafen, mit allen Angaben." },
        { title: "Zwei Sprachen", body: "Englisch und Albanisch, umschaltbar im Kopfbereich." },
      ],
      captions: {
        home: "Startseite – Marken-Hero mit Buchungsleiste",
        "fleet-cards": "Flotten-Vorschau mit Tagespreis und Buchungsbutton",
        fleet: "Flottenseite – Verfügbarkeit, Kategorien und Sortierung",
        "home-mobile": "Startseite mobil",
        "fleet-mobile": "Flotte mobil",
      },
      results: [{ value: "#1", label: "bei Google" }],
      resultsNote:
        "Seit dem Launch steht die Website bei Google auf Platz 1, und das Unternehmen hat deutlich mehr Kunden.",
    },
    subtoapi: {
      tag: "Developer SaaS",
      category: "Entwickler-Tools / SaaS",
      blurb: "Ein komplettes SaaS: Abos, Team-Konten, Dashboard und API.",
      summary:
        "Eine Entwicklerplattform, die unterstützten Claude-Zugang über eine API mit Anwendungen verbindet – Schlüssel, Playground, Nutzungsübersicht und Team-Plätze in einem Dashboard.",
      forYou:
        "Sie planen ein eigenes Softwareprodukt? Abos, Team-Konten, ein Dashboard, eine öffentliche API und die Dokumentation: alles, was ein bezahltes SaaS braucht – gebaut und im Betrieb.",
      role: "Konzept, Design und Entwicklung",
      overview: [
        "SubToAPI ist eine Entwicklerplattform, die unterstützten Claude-Zugang über eine API-Schnittstelle mit Anwendungen verbindet. Entwickler verbinden einmal, erstellen API-Schlüssel für ihre Anwendungen, senden Anfragen aus einem Playground und sehen Nutzungsdaten zu jeder Antwort.",
        "Es ist mein eigenes Produkt: ein Dashboard, eine öffentliche API und die Dokumentation dazu – als ein System gestaltet und gebaut.",
      ],
      problem:
        "Wer ein Modell aus eigenen Anwendungen aufruft, braucht mehr als einen Endpunkt: Schlüssel je Anwendung, eine Möglichkeit zum Testen, Einblick in die Nutzung und Zugang für das restliche Team.",
      objective:
        "Entwicklern dafür eine Schaltzentrale geben – verbinden, Schlüssel erstellen, testen, überwachen – mit einer Dokumentation, die die erste Anfrage in Minuten zum Laufen bringt.",
      contribution: [
        "Produktkonzept",
        "Marke und Marketing-Website",
        "Design und Entwicklung des Dashboards",
        "Öffentliche API und Schlüsselverwaltung",
        "Entwicklerdokumentation",
        "Abos und Team-Plätze",
      ],
      approach: [
        {
          title: "Status auf einen Blick",
          body: "Das Dashboard öffnet mit dem Verbindungsstatus und den letzten Anfragezahlen – denn das prüft ein Entwickler zuerst.",
        },
        {
          title: "Ein Playground mit echten Anfragen",
          body: "Einzelne Nachrichten oder ganze Unterhaltungen mit Tools lassen sich im Browser ausprobieren – dieselben Anfragen, die eine Anwendung senden würde.",
        },
        {
          title: "Nutzung als Metadaten",
          body: "Tokens, Latenz, Status und Request-IDs kommen mit jeder Antwort zurück und werden je Schlüssel gesammelt. So lässt sich die Nutzung über Metadaten nachvollziehen statt über Prompt-Inhalte.",
        },
        {
          title: "Dokumentation als Teil des Produkts",
          body: "Quickstart, Endpunkt-Referenz, Streaming und Tool-Nutzung entstehen zusammen mit der API und teilen das Design des Dashboards.",
        },
      ],
      features: [
        { title: "Dashboard", body: "Verbindungsstatus und Anfrageübersicht an einem Ort." },
        { title: "API-Schlüssel verwalten", body: "Anwendungsschlüssel im Dashboard erstellen und widerrufen." },
        { title: "Playground", body: "Echte Anfragen senden und die Antwort prüfen." },
        { title: "Nutzung überwachen", body: "Tokens, Latenz und Status zu jeder Anfrage." },
        { title: "Team-Zugang", body: "Plätze und Rollen für Kolleginnen und Kollegen." },
        { title: "Dokumentation", body: "Quickstart, Messages, Streaming und Tool-Nutzung." },
      ],
      captions: {
        home: "Landingpage mit Dashboard-Vorschau",
        docs: "Dokumentation – Quickstart",
        "api-reference": "API-Referenz für den Messages-Endpunkt",
        pricing: "Preise",
        "home-mobile": "Landingpage mobil",
      },
      results: [],
      resultsNote: "",
      missing:
        "Das Dashboard nach dem Login, die Schlüsselverwaltung, der Playground und die Nutzungsansichten erfordern ein Konto und werden nicht als Screenshots gezeigt. Das oben sichtbare Dashboard ist die produkteigene Vorschau auf der Landingpage.",
    },
  },
};
