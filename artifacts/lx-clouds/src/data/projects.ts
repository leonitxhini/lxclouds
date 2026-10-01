export type ShotRef = { file: string; kind: "desktop" | "mobile" };

/** Language-independent facts about a project. All copy lives in src/i18n. */
export type Project = {
  slug: string;
  index: string;
  name: string;
  url: string;
  domain: string;
  type: "product" | "client";
  brand: {
    color: string;
    /** Backdrop behind the framed screenshots. */
    backdrop: string;
    /** Whether the site itself is dark – switches frame chrome and logo plate. */
    dark: boolean;
    icon: string;
    logo: { src: string; width: number; height: number };
  };
  cover: ShotRef;
  coverMobile: ShotRef;
  gallery: ShotRef[];
  stack: string[];
};

const d = (file: string): ShotRef => ({ file, kind: "desktop" });
const m = (file: string): ShotRef => ({ file, kind: "mobile" });

export const projects: Project[] = [
  {
    slug: "zgjedhplus",
    index: "01",
    name: "ZgjedhPlus",
    url: "https://zgjedhplus.com",
    domain: "zgjedhplus.com",
    type: "product",
    brand: {
      color: "#5B45F4",
      backdrop: "linear-gradient(135deg, #ECEBFF 0%, #E4F4F4 100%)",
      dark: false,
      icon: "/work/zgjedhplus/icon.webp",
      logo: { src: "/work/zgjedhplus/logo.webp", width: 400, height: 89 },
    },
    cover: d("home"),
    coverMobile: m("home-mobile"),
    gallery: [d("home"), d("search"), d("product"), d("history"), m("home-mobile"), m("product-mobile"), m("search-mobile")],
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Swift (iOS)", "Cloudflare"],
  },
  {
    slug: "framenotion",
    index: "02",
    name: "FrameNotion",
    url: "https://framenotion.com",
    domain: "framenotion.com",
    type: "product",
    brand: {
      color: "#F4511E",
      backdrop: "linear-gradient(135deg, #FBEFE7 0%, #F6EAF0 100%)",
      dark: false,
      icon: "/work/framenotion/icon.webp",
      logo: { src: "/work/framenotion/logo.webp", width: 420, height: 78 },
    },
    cover: d("home"),
    coverMobile: m("home-mobile"),
    gallery: [d("home"), d("workflow"), d("examples"), d("features"), m("home-mobile"), m("examples-mobile")],
    stack: ["Next.js", "React", "TypeScript", "Remotion", "Claude API", "Stripe"],
  },
  {
    slug: "rron-rent-a-car",
    index: "03",
    name: "RRON Rent a Car",
    url: "https://rentacarron.com",
    domain: "rentacarron.com",
    type: "client",
    brand: {
      color: "#2F6BFF",
      backdrop: "linear-gradient(135deg, #0C0E16 0%, #151A2B 100%)",
      dark: true,
      icon: "/work/rron-rent-a-car/logo.webp",
      logo: { src: "/work/rron-rent-a-car/logo.webp", width: 256, height: 256 },
    },
    cover: d("home"),
    coverMobile: m("home-mobile"),
    gallery: [d("home"), d("fleet-cards"), d("fleet"), m("home-mobile"), m("fleet-mobile")],
    stack: ["React", "TypeScript", "Tailwind CSS", "Cloudflare Pages", "Cloudflare D1"],
  },
  {
    slug: "subtoapi",
    index: "04",
    name: "SubToAPI",
    url: "https://subtoapi.app",
    domain: "subtoapi.app",
    type: "product",
    brand: {
      color: "#5B4FE9",
      backdrop: "linear-gradient(135deg, #ECEBFF 0%, #F1EEFB 100%)",
      dark: false,
      icon: "/work/subtoapi/icon.webp",
      logo: { src: "/work/subtoapi/icon.webp", width: 128, height: 128 },
    },
    cover: d("home"),
    coverMobile: m("home-mobile"),
    gallery: [d("home"), d("docs"), d("api-reference"), d("pricing"), m("home-mobile")],
    stack: ["Next.js", "React", "TypeScript", "Cloudflare", "Stripe"],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Path of a screenshot in /public; `small` picks the half-size file used in cards and collages. */
export const shotSrc = (project: Project, shot: ShotRef, small?: boolean) =>
  `/work/${project.slug}/${shot.file}${small ? "-sm" : ""}.webp`;
