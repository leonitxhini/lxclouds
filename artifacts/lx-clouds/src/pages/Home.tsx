import { About } from "@/components/home/About";
import { Clients } from "@/components/home/Clients";
import { Cta } from "@/components/home/Cta";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { Results } from "@/components/home/Results";
import { Services } from "@/components/home/Services";
import { usePage } from "@/hooks/use-page";
import { useT } from "@/i18n";

export default function Home() {
  const t = useT();
  usePage({ title: t.meta.homeTitle, description: t.meta.homeDescription, path: "/" });

  return (
    <>
      <Hero />
      <FeaturedWork />
      <Process />
      <Services />
      <Results />
      <Clients />
      <About />
      <Cta marquee />
    </>
  );
}
