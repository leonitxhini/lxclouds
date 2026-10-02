import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import { ContactProvider } from "@/components/ContactDialog";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { LocaleProvider, useLocale } from "@/i18n";
import Home from "@/pages/Home";

// everything but the home page loads when it is first visited
const Work = lazy(() => import("@/pages/Work"));
const CaseStudy = lazy(() => import("@/pages/CaseStudy"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AdminApp = lazy(() => import("@/admin/AdminApp"));
const DemoPublic = lazy(() => import("@/pages/DemoPublic"));
const FolioPublic = lazy(() => import("@/pages/FolioPublic"));

function Pages() {
  const [location] = useLocation();
  const { locale, t } = useLocale();

  // the Studio and shared demos are their own screens: no site header, footer or page transitions
  if (location === "/admin" || location.startsWith("/admin/")) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-paper" />}>
        <AdminApp />
      </Suspense>
    );
  }
  const folioSlug = /^\/m\/([a-z0-9-]+)\/?$/.exec(location)?.[1];
  if (folioSlug) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-paper" />}>
        <FolioPublic slug={folioSlug} />
      </Suspense>
    );
  }
  const demoSlug = /^\/d\/([a-z0-9-]+)\/?$/.exec(location)?.[1];
  if (demoSlug) {
    return (
      <Suspense fallback={<div className="min-h-screen" />}>
        <DemoPublic slug={demoSlug} />
      </Suspense>
    );
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        {t.common.skip}
      </a>
      <Nav />
      <AnimatePresence mode="wait" initial={false}>
        {/* keyed by language too, so switching it replays the transition with the new copy */}
        <motion.main
          key={`${locale}${location}`}
          id="main"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* the location is pinned so the outgoing page keeps rendering while it fades */}
          <Suspense fallback={<div className="min-h-screen" />}>
            <Switch location={location}>
              <Route path="/" component={Home} />
              <Route path="/work" component={Work} />
              <Route path="/work/:slug">{(params) => <CaseStudy slug={params.slug} />}</Route>
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <LocaleProvider>
          <ContactProvider>
            <Pages />
          </ContactProvider>
        </LocaleProvider>
      </WouterRouter>
    </MotionConfig>
  );
}
