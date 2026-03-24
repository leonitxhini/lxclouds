import { useQuery } from "@tanstack/react-query";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: "Web Apps" | "Websites" | "Landing Pages";
  tags: string[];
  imageUrl: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A high-performance modern storefront built for global scale.",
    category: "Web Apps",
    tags: ["React", "Node.js", "PostgreSQL"],
    imageUrl: "https://placehold.co/600x400/0F1A0F/00C46A?text=E-Commerce+Platform",
  },
  {
    id: "2",
    title: "Analytics Dashboard",
    description: "Real-time data visualization and user metrics tracking.",
    category: "Web Apps",
    tags: ["Vue", "D3.js", "Firebase"],
    imageUrl: "https://placehold.co/600x400/0F1A0F/00C46A?text=Analytics+Dashboard",
  },
  {
    id: "3",
    title: "Restaurant Website",
    description: "Elegant showcase and booking system for fine dining.",
    category: "Websites",
    tags: ["React", "Framer Motion"],
    imageUrl: "https://placehold.co/600x400/0F1A0F/00C46A?text=Restaurant+Website",
  },
  {
    id: "4",
    title: "Creative Portfolio",
    description: "Minimalist landing page for a boutique creative agency.",
    category: "Landing Pages",
    tags: ["React", "Tailwind"],
    imageUrl: "https://placehold.co/600x400/0F1A0F/00C46A?text=Creative+Portfolio",
  },
  {
    id: "5",
    title: "SaaS Launch Page",
    description: "High-converting marketing site for a B2B SaaS startup.",
    category: "Landing Pages",
    tags: ["Next.js", "Stripe"],
    imageUrl: "https://placehold.co/600x400/0F1A0F/00C46A?text=SaaS+Launch+Page",
  },
  {
    id: "6",
    title: "Fitness App Tracker",
    description: "Mobile-first workout and nutrition logging application.",
    category: "Web Apps",
    tags: ["React Native", "GraphQL"],
    imageUrl: "https://placehold.co/600x400/0F1A0F/00C46A?text=Fitness+App",
  }
];

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      // Simulate network request for data fetching
      await new Promise(resolve => setTimeout(resolve, 600));
      return MOCK_PROJECTS;
    }
  });
}
