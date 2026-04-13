import { useQuery } from "@tanstack/react-query";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: "Web Apps" | "Websites" | "Landing Pages";
  tags: string[];
  imageUrl: string;
  url: string;
}

const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Lonorix",
    description: "AI-powered album cover creator — helping musicians generate stunning covers in seconds.",
    category: "Web Apps",
    tags: ["AI", "React", "Music", "SaaS"],
    imageUrl: "/project-lonorix.png",
    url: "https://lonorix.com",
  },
  {
    id: "2",
    title: "ZgjedhPlus",
    description: "Price comparison platform for Kosovo — find the best deals on phones, laptops, and gaming gear instantly.",
    category: "Web Apps",
    tags: ["E-commerce", "React", "Kosovo", "Comparison"],
    imageUrl: "/project-zgjedhplus.png",
    url: "https://zgjedhplus.com",
  },
  {
    id: "3",
    title: "Rent a Car Ron",
    description: "Professional car rental platform with seamless booking and a clean vehicle catalogue.",
    category: "Websites",
    tags: ["Car Rental", "Booking", "React"],
    imageUrl: "/project-rentacarron.png",
    url: "https://rentacarron.com",
  },
  {
    id: "4",
    title: "Luxuria Hotels",
    description: "Premium hotel booking experience with immersive room previews, instant reservations, and concierge chat.",
    category: "Websites",
    tags: ["Hospitality", "Booking", "Luxury", "Next.js"],
    imageUrl: "https://api.microlink.io?url=https://www.aman.com&screenshot=true&meta=false&embed=screenshot.url",
    url: "#",
  },
  {
    id: "5",
    title: "NexaPay",
    description: "Real-time fintech analytics dashboard with live charts, transaction monitoring, and smart reporting.",
    category: "Web Apps",
    tags: ["FinTech", "Dashboard", "Charts", "TypeScript"],
    imageUrl: "https://api.microlink.io?url=https://stripe.com&screenshot=true&meta=false&embed=screenshot.url",
    url: "#",
  },
  {
    id: "6",
    title: "Bloom Boutique",
    description: "Minimalist luxury e-commerce store with editorial product pages, smooth animations, and one-click checkout.",
    category: "Websites",
    tags: ["E-commerce", "Fashion", "Shopify", "UI/UX"],
    imageUrl: "https://api.microlink.io?url=https://www.ssense.com&screenshot=true&meta=false&embed=screenshot.url",
    url: "#",
  },
];

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      return PROJECTS;
    }
  });
}
