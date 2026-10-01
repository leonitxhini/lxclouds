import { Link } from "wouter";
import { usePage } from "@/hooks/use-page";
import { useT } from "@/i18n";

export default function NotFound() {
  const t = useT();
  usePage({ title: t.meta.notFoundTitle, description: t.meta.notFoundDescription, path: "/404" });
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center pt-[68px] text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-[40px] font-semibold tracking-[-0.03em]">{t.notFound.title}</h1>
      <p className="mt-2 text-muted">{t.notFound.body}</p>
      <Link href="/" className="mt-6 text-accent-ink underline underline-offset-4">
        {t.notFound.back}
      </Link>
    </section>
  );
}
