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
    description: "A modern web project crafted for performance, clarity, and a seamless user experience.",
    category: "Websites",
    tags: ["React", "Tailwind", "Vite"],
    imageUrl: "https://image.thum.io/get/width/600/crop/400/https://lonorix.com",
    url: "https://lonorix.com",
  },
  {
    id: "2",
    title: "Zgjedhja",
    description: "Vergleichsportal für Kosovo & Albanien — hilft Nutzern, die besten Angebote schnell zu finden.",
    category: "Web Apps",
    tags: ["Vergleichsportal", "React", "Kosovo", "Albanien"],
    imageUrl: "https://image.thum.io/get/width/600/crop/400/https://zgjedhja.com",
    url: "https://zgjedhja.com",
  },
  {
    id: "3",
    title: "Rent a Car Ron",
    description: "Professionelle Autovermietungs-Plattform mit einfacher Buchung und übersichtlichem Fahrzeugkatalog.",
    category: "Websites",
    tags: ["Autovermietung", "Booking", "React"],
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
