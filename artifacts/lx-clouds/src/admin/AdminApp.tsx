import { CheckSquare, FolderKanban, Images, Inbox, LayoutDashboard, LayoutTemplate, LogOut, Menu, MonitorPlay, Settings, Users, X, type LucideIcon } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, Route, Router, Switch, useLocation } from "wouter";
import { LogoMark } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { api, ApiError, type User } from "./api";
import { DemoEditor } from "./editor/Editor";
import { BoardDetail, Boards } from "./pages/Boards";
import { Clients, ClientDetail } from "./pages/Clients";
import { Dashboard } from "./pages/Dashboard";
import { Demos } from "./pages/Demos";
import { Inquiries, Projects, SettingsPage, Tasks } from "./pages/More";
import { Templates } from "./pages/Templates";
import { Btn, Field, Input, Loading, ToastProvider } from "./ui";

const nav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Übersicht", icon: LayoutDashboard },
  { href: "/kunden", label: "Kunden", icon: Users },
  { href: "/demos", label: "Demos", icon: MonitorPlay },
  { href: "/entwuerfe", label: "Entwürfe", icon: Images },
  { href: "/vorlagen", label: "Vorlagen", icon: LayoutTemplate },
  { href: "/projekte", label: "Projekte", icon: FolderKanban },
  { href: "/aufgaben", label: "Aufgaben", icon: CheckSquare },
  { href: "/anfragen", label: "Anfragen", icon: Inbox },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings },
];

function Login({ onDone }: { onDone: (user: User) => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const { user } = await api<{ user: User }>("/auth/login", { method: "POST", body: { email: form.get("email"), password: form.get("password") } });
      onDone(user);
    } catch (err) {
      setError((err as ApiError).message);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-night px-5 py-10">
      <div className="pointer-events-none fixed inset-0" style={{ background: "radial-gradient(700px 480px at 70% 20%, rgba(104,101,255,0.28), transparent 70%), radial-gradient(600px 420px at 10% 90%, rgba(126,107,255,0.2), transparent 70%)" }} aria-hidden="true" />
      <form onSubmit={submit} className="relative w-full max-w-[400px] rounded-[24px] bg-white p-8 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2.5">
          <LogoMark size={30} />
          <span className="text-[19px] font-semibold tracking-[-0.02em]">LX Studio</span>
        </div>
        <h1 className="mt-7 text-[24px] font-semibold tracking-[-0.025em]">Anmelden</h1>
        <p className="mt-1 text-[14px] text-muted">Kunden, Demos und Projekte an einem Ort.</p>
        <div className="mt-6 space-y-4">
          <Field label="E-Mail">
            <Input name="email" type="email" required autoComplete="username" autoFocus />
          </Field>
          <Field label="Passwort">
            <Input name="password" type="password" required autoComplete="current-password" />
          </Field>
        </div>
        {error && (
          <p role="alert" className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[13.5px] text-red-600">
            {error}
          </p>
        )}
        <Btn type="submit" disabled={busy} className="mt-6 h-11 w-full text-[15px]">
          {busy ? "Prüfe …" : "Anmelden"}
        </Btn>
      </form>
    </div>
  );
}

function Sidebar({ user, onLogout, open, onClose }: { user: User; onLogout: () => void; open: boolean; onClose: () => void }) {
  const [location] = useLocation();
  return (
    <>
      {open && <button type="button" className="fixed inset-0 z-40 bg-ink/40 lg:hidden" onClick={onClose} aria-label="Menü schließen" />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[236px] flex-col bg-night px-3 py-4 text-white transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2.5">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <LogoMark size={26} />
            <span className="text-[17px] font-semibold tracking-[-0.02em]">LX Studio</span>
          </Link>
          <button type="button" className="flex size-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 lg:hidden" onClick={onClose} aria-label="Menü schließen">
            <X className="size-4" />
          </button>
        </div>
        <nav className="mt-7 flex-1 space-y-0.5" aria-label="Studio">
          {nav.map((item) => {
            const active = item.href === "/" ? location === "/" : location.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-[10px] px-3 text-[14px] transition-colors duration-150",
                  active ? "bg-white/[0.12] font-medium text-white" : "text-white/65 hover:bg-white/[0.06] hover:text-white",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-2.5 pt-4">
          <p className="truncate text-[13.5px] font-medium">{user.name}</p>
          <p className="truncate text-[12px] text-white/50">{user.email}</p>
          <div className="mt-3 flex items-center justify-between">
            <a href="/" className="text-[12.5px] text-white/60 hover:text-white">
              Zur Website ↗
            </a>
            <button type="button" onClick={onLogout} className="inline-flex items-center gap-1.5 text-[12.5px] text-white/60 hover:text-white">
              <LogOut className="size-3.5" aria-hidden="true" />
              Abmelden
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function Shell({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [location] = useLocation();
  const [menu, setMenu] = useState(false);

  // the demo editor takes the whole screen
  const editor = /^\/demos\/\d+/.exec(location);
  if (editor) {
    return (
      <Switch>
        <Route path="/demos/:id">{(params) => <DemoEditor key={params.id} id={Number(params.id)} />}</Route>
      </Switch>
    );
  }

  return (
    <div className="min-h-dvh bg-paper">
      <Sidebar user={user} onLogout={onLogout} open={menu} onClose={() => setMenu(false)} />
      <div className="lg:pl-[236px]">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-ink/[0.07] bg-paper/90 px-4 backdrop-blur lg:hidden">
          <button type="button" className="flex size-9 items-center justify-center rounded-lg hover:bg-ink/[0.06]" onClick={() => setMenu(true)} aria-label="Menü öffnen">
            <Menu className="size-5" />
          </button>
          <span className="text-[15px] font-semibold">LX Studio</span>
        </div>
        <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-7 sm:py-8">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/kunden" component={Clients} />
            <Route path="/kunden/:id">{(params) => <ClientDetail key={params.id} id={Number(params.id)} />}</Route>
            <Route path="/demos" component={Demos} />
            <Route path="/entwuerfe" component={Boards} />
            <Route path="/entwuerfe/:id">{(params) => <BoardDetail key={params.id} id={Number(params.id)} />}</Route>
            <Route path="/vorlagen" component={Templates} />
            <Route path="/projekte" component={Projects} />
            <Route path="/aufgaben" component={Tasks} />
            <Route path="/anfragen" component={Inquiries} />
            <Route path="/einstellungen">{() => <SettingsPage user={user} onLogout={onLogout} />}</Route>
            <Route>
              <p className="py-20 text-center text-muted">Diese Seite gibt es nicht.</p>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

/** LX Studio: the private admin area under /admin. */
export default function AdminApp() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    document.title = "LX Studio";
    document.querySelector('meta[name="robots"]')?.remove();
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    api<{ user: User }>("/auth/me")
      .then((r) => setUser(r.user))
      .catch(() => setUser(null));
    return () => robots.remove();
  }, []);

  async function logout() {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }

  if (user === undefined) {
    return (
      <div className="min-h-dvh bg-paper">
        <Loading />
      </div>
    );
  }
  if (user === null) return <Login onDone={setUser} />;

  return (
    <ToastProvider>
      <Router base="/admin">
        <Shell user={user} onLogout={logout} />
      </Router>
    </ToastProvider>
  );
}
