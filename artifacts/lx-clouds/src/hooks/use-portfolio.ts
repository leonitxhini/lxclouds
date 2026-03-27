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
];

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      return PROJECTS;
    }
  });
}
