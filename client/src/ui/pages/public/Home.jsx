import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Dumbbell,
  Menu,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom"
import Button from "../../components/Button.jsx"
import Reveal from "../../components/Reveal.jsx"
import heroIllustration from "../../../assets/landing/hero-illustration.svg"
import dashboardPreview from "../../../assets/landing/dashboard-preview.svg"

const FeatureCard = ({ icon, title, description }) => (
  <div className="group flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white/90 hover:shadow-lg hover:shadow-slate-200/60 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900/70 dark:hover:shadow-black/20">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100 transition-transform duration-300 group-hover:scale-105 dark:bg-sky-900/20 dark:text-sky-400 dark:ring-sky-800/40">
      {icon}
    </div>
    <div>
      <h3 className="font-display text-[15px] font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  </div>
)

const RolePill = ({ role, color }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${color}`}>
    {role}
  </span>
)

export default function Home() {
  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (!section) return

    const headerOffset = 76
    const targetTop = section.getBoundingClientRect().top + window.scrollY - headerOffset

    window.history.replaceState(null, "", `#${id}`)
    window.scrollTo({ top: targetTop, behavior: "smooth" })
  }

  const handleNavClick = (event, id) => {
    event.preventDefault()
    scrollToSection(id)
  }

  const features = [
    {
      icon: <ShieldCheck size={18} />,
      title: "Role-based access control",
      description: "Super admin, admin, trainer, and member experiences — each scoped to what they actually need.",
    },
    {
      icon: <Users size={18} />,
      title: "Members & trainers together",
      description: "Profiles, memberships, attendance, and progress in one place. No more spreadsheets.",
    },
    {
      icon: <CreditCard size={18} />,
      title: "Plans, payments & invoices",
      description: "Track renewals, collections, and revenue with a clean, predictable payment workflow.",
    },
    {
      icon: <QrCode size={18} />,
      title: "Attendance that scales",
      description: "Simple check-in flows today, with a solid foundation for QR and kiosk automation.",
    },
    {
      icon: <Dumbbell size={18} />,
      title: "Workout & diet programs",
      description: "Trainers can build and deliver training and nutrition plans directly to members.",
    },
    {
      icon: <BarChart3 size={18} />,
      title: "Reports & insights",
      description: "Understand retention, attendance trends, and revenue at a glance with clean dashboards.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d10]">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-[#0d0d10]/80">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex h-[60px] items-center justify-between gap-6">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white">
                <Dumbbell size={15} />
              </div>
              <span className="font-display text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
                Atlas Gym OS
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {["Features", "Benefits", "Preview", "Why us", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  onClick={(event) => handleNavClick(event, item.toLowerCase().replace(" ", "-"))}
                  className="rounded-lg px-3 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* CTA row */}
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden md:block">
                <Button variant="secondary">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button className="inline-flex items-center gap-1.5 text-sm">
                  Get started <ArrowRight size={14} />
                </Button>
              </Link>

              {/* Mobile hamburger */}
              <details className="relative md:hidden">
                <summary className="list-none cursor-pointer rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                  <Menu size={16} />
                </summary>
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-[#111114]">
                  <div className="flex flex-col gap-0.5 text-sm">
                    {["Features", "Benefits", "Preview", "Why us", "About", "Demo"].map((item) => (
                      <a
                        key={item}
                        href={`#${item.toLowerCase().replace(" ", "-")}`}
                        onClick={(event) => handleNavClick(event, item.toLowerCase().replace(" ", "-"))}
                        className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <Link to="/login">
                      <Button variant="secondary" className="w-full">Sign in</Button>
                    </Link>
                    <Link to="/register">
                      <Button className="w-full">Get started</Button>
                    </Link>
                  </div>
                </div>
              </details>
            </div>

          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pb-16 pt-14 sm:pb-24 sm:pt-20">
          {/* Subtle bg blobs */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-0 h-[480px] w-[480px] rounded-full bg-sky-100/60 blur-[100px] dark:bg-sky-900/20" />
            <div className="absolute -right-24 bottom-0 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[90px] dark:bg-indigo-900/20" />
          </div>

          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            {/* Badge */}
            <Reveal y={8} scaleFrom={0.98} className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
              Role-aware gym management
            </Reveal>

            {/* Two-column hero */}
            <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-start xl:grid-cols-[1fr_460px]">
              {/* Left: copy */}
              <Reveal y={16} x={-10} scaleFrom={0.985} className="max-w-2xl">
                <h1 className="font-display text-[2.4rem] font-bold leading-[1.15] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.2rem]">
                  Run your gym with{" "}
                  <span className="text-sky-600 dark:text-sky-400">clarity</span>{" "}
                  and control.
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                  Atlas Gym OS handles memberships, attendance, payments, and programs — with focused dashboards for
                  every role on your team.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/register">
                    <Button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
                      Create your workspace <ArrowRight size={15} />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" className="px-5 py-2.5 text-sm">
                      I already have an account
                    </Button>
                  </Link>
                </div>

                <a href="#demo" className="mt-4 inline-block text-sm font-medium text-sky-600 hover:underline dark:text-sky-400">
                  View demo credentials →
                </a>

                {/* Role chips */}
                <div className="mt-10 flex flex-wrap gap-2">
                  <RolePill role="Super admin" color="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" />
                  <RolePill role="Gym admin" color="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" />
                  <RolePill role="Trainer" color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" />
                  <RolePill role="Member" color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" />
                </div>
              </Reveal>

              {/* Right: card */}
              <Reveal delayMs={120} y={18} x={12} scaleFrom={0.98} className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/85 dark:shadow-black/30 sm:p-8">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-200">Quick start</p>
                  <div className="flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                    <CalendarClock size={12} />
                    Up in minutes
                  </div>
                </div>

                <h2 className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">
                  Everything you need — nothing you don't.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                  Keep operations tight, give trainers what they need, and keep members engaged.
                </p>

                <ul className="mt-6 space-y-3">
                  {[
                    "Create membership plans and manage renewals",
                    "Capture attendance and track member consistency",
                    "Assign workout and diet plans through trainers",
                    "View payments and performance at a glance",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                      <CheckCircle2 size={15} className="shrink-0 text-sky-500 dark:text-sky-400" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex gap-2.5">
                  <Link to="/login" className="flex-1">
                    <Button className="w-full justify-center text-sm">Sign in</Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button variant="secondary" className="w-full justify-center text-sm">Create account</Button>
                  </Link>
                </div>

                <p className="mt-4 text-xs text-slate-600 dark:text-slate-300">
                  Super admin accounts manage multiple gyms and onboard new locations.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="scroll-mt-20 pb-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal y={14} scaleFrom={0.985}>
              <div className="mb-10 max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">Features</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  Built for operators and teams.
                </h2>
                <p className="mt-3 text-slate-500 dark:text-slate-400">
                  A focused set of workflows covering the daily reality of running a gym — with clean, modern UI.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <Reveal key={feature.title} delayMs={i * 55}>
                  <FeatureCard {...feature} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section id="benefits" className="scroll-mt-20 pb-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid gap-6 lg:grid-cols-5 lg:items-start">

              {/* Left summary — wider */}
              <Reveal className="lg:col-span-3 lg:sticky lg:top-24 self-start" y={12} scaleFrom={0.99}>
                <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-7 dark:border-slate-700/70 dark:bg-slate-900/85 sm:p-9">
                  <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">Benefits</p>
                  <h2 className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    Less admin work.<br />More member results.
                  </h2>
                  <p className="mt-3 text-slate-500 dark:text-slate-300">
                    Replace scattered tools with one system that supports every role — and scales from one gym to many.
                  </p>
                  <ul className="mt-7 space-y-4">
                    {[
                      "Reduce manual follow-ups with clear renewals and payment tracking.",
                      "Improve retention with consistent member engagement and progress visibility.",
                      "Give trainers a structured workflow for workouts and nutrition plans.",
                      "Stay audit-ready with detailed attendance and reporting history.",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-200">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Right mini cards — stacked */}
              <div className="flex flex-col gap-4 lg:col-span-2">
                {[
                  {
                    title: "Gym owners & admins",
                    items: [
                      "Centralize memberships, plans, attendance, and payments",
                      "Revenue trends and collections at a glance",
                      "Manage trainers and members with role permissions",
                    ],
                  },
                  {
                    title: "Trainers",
                    items: [
                      "Assign workouts and diet plans with consistency",
                      "Track member participation and progress",
                      "Spend less time on admin, more time coaching",
                    ],
                  },
                  {
                    title: "Members",
                    items: [
                      "View assigned workouts and nutrition plans anytime",
                      "Track attendance and progress over time",
                      "Stay accountable with a clear routine",
                    ],
                  },
                ].map((card, i) => (
                  <Reveal key={card.title} delayMs={i * 90} y={16} x={10} scaleFrom={0.985}>
                    <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-5 dark:border-slate-700/70 dark:bg-slate-900/85">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-200">{card.title}</p>
                      <ul className="mt-3 space-y-2">
                        {card.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-200">
                            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-300 dark:bg-slate-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── Preview ── */}
        <section id="preview" className="scroll-mt-20 pb-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-center xl:grid-cols-[420px_1fr]">

              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">Product preview</p>
                <h2 className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  A dashboard that stays calm — even on busy days.
                </h2>
                <p className="mt-3 text-slate-500 dark:text-slate-400">
                  Readable, role-aware, and fast. The UI stays consistent whether you're an admin, trainer, or member.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Quick access to attendance, payments, plans, and reports",
                    "Clear separation of roles and permissions",
                    "Responsive layout for desktop and mobile",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={15} className="shrink-0 text-sky-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/register">
                    <Button className="inline-flex items-center gap-2 text-sm">Get started <ArrowRight size={14} /></Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" className="text-sm">Sign in</Button>
                  </Link>
                </div>
              </Reveal>

              <Reveal delayMs={100} className="relative">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 dark:border-white/8 dark:bg-slate-900 dark:shadow-black/40">
                  <img
                    src={dashboardPreview}
                    alt="Atlas Gym OS dashboard"
                    className="w-full object-cover"
                    loading="lazy"
                  />
                  {/* Floating badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-200">
                    <Sparkles size={12} className="text-sky-500" />
                    Clean, modern UI
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* ── Why us ── */}
        <section id="why-us" className="scroll-mt-20 pb-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal y={18} scaleFrom={0.985}>
              <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-7 dark:border-slate-700/70 dark:bg-slate-900/85 sm:p-10">
                <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start xl:grid-cols-[320px_1fr]">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">Why choose us</p>
                    <h2 className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white">
                      Clean workflows that scale.
                    </h2>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
                      Built for multi-role teams with a product-first UI. No bloated modules, no complex setup.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        title: "Role-first product design",
                        description: "Each role sees what matters — admins run ops, trainers coach, members follow plans.",
                      },
                      {
                        title: "Fast onboarding",
                        description: "Start with membership plans, bring in your members, and begin tracking immediately.",
                      },
                      {
                        title: "Mobile-friendly throughout",
                        description: "Responsive layouts that work well on desktops, tablets, and phones.",
                      },
                      {
                        title: "Expandable foundation",
                        description: "Ready to grow into QR check-in, payment gateways, and automated notifications.",
                      },
                    ].map((item, i) => (
                      <Reveal key={item.title} delayMs={i * 65}>
                        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 transition-all duration-200 hover:bg-white hover:shadow-md dark:border-slate-700/70 dark:bg-slate-800/90 dark:hover:bg-slate-800">
                          <h3 className="font-display text-[15px] font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{item.description}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>

                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Demo + About ── */}
        <section id="demo" className="scroll-mt-20 pb-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid gap-6 lg:grid-cols-2">

              {/* Demo credentials */}
              <Reveal y={16} x={-8} scaleFrom={0.985}>
                <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-7 dark:border-slate-700/70 dark:bg-slate-900/85 sm:p-8">
                  <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Demo credentials</h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                    Use these accounts to explore the role-based dashboards.
                  </p>

                  <div className="mt-6 space-y-2.5">
                    {[
                      { label: "Super admin", cred: "owner@gym.local / Owner@123", color: "bg-violet-50 dark:bg-violet-900/35" },
                      { label: "Admin",       cred: "admin@gym.local / Admin@123",   color: "bg-sky-50 dark:bg-sky-900/35" },
                      { label: "Trainer",     cred: "trainer@gym.local / Trainer@123", color: "bg-emerald-50 dark:bg-emerald-900/35" },
                      { label: "Member",      cred: "member@gym.local / Member@123",  color: "bg-amber-50 dark:bg-amber-900/35" },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 ${row.color}`}
                      >
                        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-200 shrink-0">
                          {row.label}
                        </span>
                        <span className="font-mono text-xs text-slate-700 dark:text-slate-100">{row.cred}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Link to="/login">
                      <Button className="inline-flex items-center gap-2 text-sm">
                        Sign in to demo <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Reveal>

              {/* About */}
              <Reveal delayMs={100} y={16} x={8} scaleFrom={0.985}>
                <div id="about" className="scroll-mt-20 rounded-3xl border border-slate-200/80 bg-white/70 p-7 dark:border-slate-700/70 dark:bg-slate-900/85 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">About</p>
                  <h2 className="mt-3 font-display text-xl font-bold text-slate-900 dark:text-white">
                    A gym OS built for the real world.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                    From renewals to trainer programming, Atlas Gym OS focuses on the everyday workflows that keep a gym
                    running — simple on day one, ready for deeper automation as you grow.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      { label: "Owners",  value: "Operational visibility" },
                      { label: "Teams",   value: "Structured routines" },
                      { label: "Members", value: "Better accountability" },
                      { label: "Brands",  value: "Multi-gym scale" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700/70 dark:bg-slate-800/90">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300">{item.label}</p>
                        <p className="mt-1.5 font-display text-base font-bold text-slate-900 dark:text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap gap-2.5">
                    <Link to="/register">
                      <Button className="text-sm">Get started</Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="secondary" className="text-sm">Sign in</Button>
                    </Link>
                  </div>
                  <p className="mt-4 text-xs text-slate-600 dark:text-slate-300">
                    Need onboarding help? Ask for a guided setup tailored to your gym.
                  </p>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal>
              <div className="overflow-hidden rounded-3xl bg-sky-600 px-8 py-12 dark:bg-sky-700 sm:px-12">
                <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      Ready to simplify your gym operations?
                    </h2>
                    <p className="mt-2 text-sky-100 sm:text-lg">
                      Start with the essentials. Add QR check-in, payment gateways, and automations as you grow.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link to="/register">
                      <Button className="bg-white !text-sky-700 hover:bg-sky-50 border-0 text-sm font-semibold">
                        Create account
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button className="border border-white/40 bg-transparent text-white hover:bg-white/10 text-sm">
                        Sign in
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200/60 dark:border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600 text-white">
                <Dumbbell size={13} />
              </div>
              <span className="font-display text-sm font-bold text-slate-900 dark:text-white">Atlas Gym OS</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Built for super admins, gym owners, trainers, and members.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
