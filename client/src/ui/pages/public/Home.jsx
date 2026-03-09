import { ArrowRight, BarChart3, CalendarClock, CheckCircle2, ChevronDown, CreditCard, Dumbbell, Menu, QrCode, ShieldCheck, Sparkles, Users } from "lucide-react"
import { Link } from "react-router-dom"
import Button from "../../components/Button.jsx"
import Reveal from "../../components/Reveal.jsx"
import heroIllustration from "../../../assets/landing/hero-illustration.svg"
import dashboardPreview from "../../../assets/landing/dashboard-preview.svg"

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="glass-panel group rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/30 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-700 transition duration-300 group-hover:scale-105 dark:bg-neon/15 dark:text-neon">
          <span className="transition duration-300 group-hover:rotate-3">{icon}</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold sm:text-lg">{title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  )
}

const BenefitList = ({ title, items }) => {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      <h3 className="font-display text-base font-semibold sm:text-lg">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600 dark:bg-neon" />
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Home() {
  const features = [
    {
      icon: <ShieldCheck size={20} />,
      title: "Role-based access control",
      description: "Super admin, admin, trainer, and member experiences - each with the right permissions."
    },
    {
      icon: <Users size={20} />,
      title: "Members & trainers in one place",
      description: "Manage profiles, memberships, attendance, and progress without spreadsheets."
    },
    {
      icon: <CreditCard size={20} />,
      title: "Plans, payments, and invoices",
      description: "Track renewals, collections, and revenue with a clean payments workflow."
    },
    {
      icon: <QrCode size={20} />,
      title: "Attendance that scales",
      description: "Simple attendance flow today, with room for QR / kiosk check-in workflows."
    },
    {
      icon: <Dumbbell size={20} />,
      title: "Workout & diet programming",
      description: "Deliver training and nutrition plans to members, guided by trainers."
    },
    {
      icon: <BarChart3 size={20} />,
      title: "Reports and insights",
      description: "Understand retention, attendance, and revenue trends with actionable dashboards."
    }
  ]

  return (
    <div className="page-shell">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-carbon/70">

<div className="mx-auto max-w-6xl px-4 sm:px-6">
  <div className="flex h-16 items-center justify-between">

    {/* Logo */}
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-700 dark:bg-neon/15 dark:text-neon">
        <Dumbbell size={18} />
      </div>

      <div className="leading-tight">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
          Gym SaaS
        </p>
        <p className="font-display text-sm sm:text-base font-semibold">
          Atlas Gym OS
        </p>
      </div>
    </div>

    {/* Desktop Nav */}
    <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
      <a href="#features" className="hover:text-slate-900 dark:hover:text-white">Features</a>
      <a href="#benefits" className="hover:text-slate-900 dark:hover:text-white">Benefits</a>
      <a href="#preview" className="hover:text-slate-900 dark:hover:text-white">Preview</a>
      <a href="#why-us" className="hover:text-slate-900 dark:hover:text-white">Why us</a>
      <a href="#about" className="hover:text-slate-900 dark:hover:text-white">About</a>
    </nav>

    {/* Desktop Buttons */}
    <div className="hidden md:flex items-center gap-2">
      <Link to="/login">
        <Button variant="secondary">Sign in</Button>
      </Link>

      <Link to="/register">
        <Button className="inline-flex items-center gap-2">
          Get started <ArrowRight size={16}/>
        </Button>
      </Link>
    </div>

    {/* Mobile Menu */}
    <details className="relative md:hidden">
      <summary className="list-none cursor-pointer rounded-xl border border-slate-300 bg-slate-100 p-2 dark:border-slate-800 dark:bg-slate-900/60">
        <Menu size={18}/>
      </summary>

      <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-carbon">

        {/* Links */}
        <div className="flex flex-col gap-2 text-sm">
          <a href="#features" className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900">Features</a>
          <a href="#benefits" className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900">Benefits</a>
          <a href="#preview" className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900">Preview</a>
          <a href="#why-us" className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900">Why us</a>
          <a href="#about" className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900">About</a>
          <a href="#demo" className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900">Demo</a>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-2">

          <Link to="/login">
            <Button variant="secondary" className="w-full">
              Sign in
            </Button>
          </Link>

          <Link to="/register">
            <Button className="w-full flex items-center justify-center gap-2">
              Get started
              <ArrowRight size={16}/>
            </Button>
          </Link>

        </div>

      </div>
    </details>

  </div>
</div>

</header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-sky-600/10 blur-3xl dark:bg-neon/10" />
            <div className="absolute -right-20 top-28 h-80 w-80 rounded-full bg-sky-600/10 blur-3xl dark:bg-neon/10" />
            <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sunrise/10 blur-3xl dark:bg-sunrise/10" />
          </div>

          <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-carbon/70 dark:text-slate-200">
                <span className="h-2 w-2 rounded-full bg-sky-600 dark:bg-neon" />
                Role-aware gym management for modern teams
              </div>
              <h1 className="mt-5 animate-fade-up font-display text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl" style={{ animationDelay: "80ms" }}>
                Run your gym with clarity, control, and consistency.
              </h1>
              <p className="mt-5 animate-fade-up max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg" style={{ animationDelay: "140ms" }}>
                Atlas Gym OS helps you manage memberships, attendance, payments, and programs — with separate
                dashboards for super admin, gym admins, trainers, and members.
              </p>

              <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-3" style={{ animationDelay: "200ms" }}>
                <Link to="/register">
                  <Button className="inline-flex items-center gap-2">
                    Create your workspace <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary">I already have an account</Button>
                </Link>
                <a href="#demo" className="text-sm font-semibold text-sky-700 hover:underline dark:text-neon">
                  View demo credentials
                </a>
              </div>

              <div className="mt-10 grid animate-fade-up gap-3 sm:grid-cols-3" style={{ animationDelay: "260ms" }}>
                {[
                  { label: "Super admin", value: "Multi-gym control" },
                  { label: "Owners/Admin", value: "Revenue + operations" },
                  { label: "Trainers/Members", value: "Programs + progress" }
                ].map((stat) => (
                  <div key={stat.label} className="glass-panel rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel relative animate-fade-in overflow-hidden rounded-3xl p-6 sm:p-8" style={{ animationDelay: "120ms" }}>
              <img
                src={heroIllustration}
                alt="Gym management illustration"
                className="pointer-events-none absolute -right-16 -top-10 w-[26rem] max-w-none opacity-70 dark:opacity-60 sm:-right-20 sm:-top-14 sm:w-[30rem] animate-float-soft"
              />

              <div className="relative flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                  Quick start
                </p>
                <div className="flex items-center gap-2 rounded-full bg-sky-600/10 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-neon/15 dark:text-neon">
                  <CalendarClock size={14} />
                  Setup in minutes
                </div>
              </div>
              <h2 className="relative mt-4 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                Everything your gym needs — without the clutter.
              </h2>
              <p className="relative mt-3 text-sm text-slate-600 dark:text-slate-300">
                Keep operations tight, give trainers the tools they need, and let members stay engaged.
              </p>
              <div className="relative mt-7 grid gap-3">
                {[
                  "Create membership plans and manage renewals",
                  "Capture attendance and track member consistency",
                  "Assign workout and diet plans with trainer oversight",
                  "View payments and performance reports"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600 dark:bg-neon" />
                    <span className="text-sm text-slate-700 dark:text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
              <div className="relative mt-8 flex flex-wrap gap-3">
                <Link to="/login" className="flex-1 sm:flex-none">
                  <Button className="w-full">Sign in</Button>
                </Link>
                <Link to="/register" className="flex-1 sm:flex-none">
                  <Button variant="secondary" className="w-full">
                    Create account
                  </Button>
                </Link>
              </div>
              <p className="relative mt-5 text-xs text-slate-500 dark:text-slate-400">
                Super admin accounts manage multiple gyms and onboard new locations.
              </p>
            </div>
          </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Features
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Built for operators and teams.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                A focused set of workflows that cover the daily reality of running a gym — with clean, modern UI.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delayMs={index * 60}>
                <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="benefits" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <Reveal className="h-full">
              <div className="glass-panel h-full rounded-3xl p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Benefits
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Less admin work. More member results.
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Replace scattered tools with one system that supports every role — and scales from one gym to many.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {[
                  "Reduce manual follow-ups with clear renewals and payments.",
                  "Improve retention with consistent tracking and engagement.",
                  "Give trainers a structured workflow for workouts and diets.",
                  "Stay audit-ready with attendance and reporting history."
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600 dark:bg-neon" />
                    <span className="min-w-0">{item}</span>
                  </div>
                ))}
              </div>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal delayMs={80}>
                <BenefitList
                  title="For gym owners / admins"
                  items={[
                    "Centralize memberships, plans, attendance, and payments.",
                    "See revenue trends and collections at a glance.",
                    "Manage trainers and members with role permissions."
                  ]}
                />
              </Reveal>
              <Reveal delayMs={140}>
                <BenefitList
                  title="For trainers"
                  items={[
                    "Assign workouts and diet plans with consistency.",
                    "Track member participation and progress.",
                    "Spend less time on admin and more time coaching."
                  ]}
                />
              </Reveal>
              <div className="sm:col-span-2">
                <Reveal delayMs={200}>
                  <BenefitList
                    title="For members"
                    items={[
                      "View assigned workouts and nutrition plans anytime.",
                      "Track attendance and progress over time.",
                      "Stay accountable with a clear routine."
                    ]}
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section id="preview" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal>
              <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Product preview
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                A dashboard that feels calm — even on busy days.
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Designed to be readable, role-aware, and fast. The UI stays consistent across admin, trainer, and member
                views.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {[
                  "Quick access to daily actions: attendance, payments, plans, reports",
                  "Clear separation of roles and permissions",
                  "Modern responsive layout for desktop and mobile"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 text-sky-700 dark:text-neon" size={18} />
                    <span className="min-w-0">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register">
                  <Button className="inline-flex items-center gap-2">
                    Get started <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary">Sign in</Button>
                </Link>
              </div>
              </div>
            </Reveal>

            <Reveal delayMs={120} className="relative">
              <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-r from-sky-600/10 via-transparent to-sunrise/10 blur-2xl dark:from-neon/10 dark:to-sunrise/10" />
              <div className="glass-panel relative overflow-hidden rounded-3xl p-3 sm:p-4">
                <img
                  src={dashboardPreview}
                  alt="Atlas Gym OS dashboard preview"
                  className="animate-fade-in w-full rounded-2xl border border-slate-200/70 bg-slate-950/30 object-cover dark:border-slate-800/70"
                  style={{ animationDelay: "120ms" }}
                  loading="lazy"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-4 left-6 hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur-xl dark:border-slate-800 dark:bg-carbon/70 dark:text-slate-200 sm:inline-flex">
                <Sparkles size={14} className="text-sky-700 dark:text-neon" />
                Clean, modern UI
              </div>
            </Reveal>
          </div>
        </section>

        <section id="why-us" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20">
          <Reveal>
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
                <div className="lg:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                  Why choose us
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                  Clean workflows that scale.
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  Built for multi-role teams with a product-first UI. No over-complicated setup, no noisy modules.
                </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                  {[
                  {
                    title: "Role-first product design",
                    description: "Each role sees what matters — admins run ops, trainers coach, members follow programs."
                  },
                  {
                    title: "Fast onboarding",
                    description: "Start with membership plans, import your members, and begin tracking immediately."
                  },
                  {
                    title: "Modern, mobile-friendly UI",
                    description: "Responsive layouts that work on desktops, tablets, and phones."
                  },
                  {
                    title: "Expandable foundation",
                    description: "Structured to add QR check-in, payment gateways, or notifications as you grow."
                  }
                  ].map((item, index) => (
                    <Reveal key={item.title} delayMs={index * 70} className="h-full">
                      <div className="h-full rounded-2xl border border-slate-200 bg-white/50 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/70 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900/55">
                        <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="demo" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal>
              <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Demo credentials</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Use these seeded accounts to explore the role-based dashboards.
              </p>
              <div className="mt-6 grid gap-3 text-sm">
                {[
                  { label: "Super admin", value: "owner@gym.local / Owner@123" },
                  { label: "Admin", value: "admin@gym.local / Admin@123" },
                  { label: "Trainer", value: "trainer@gym.local / Trainer@123" },
                  { label: "Member", value: "member@gym.local / Member@123" }
                ].map((row) => (
                  <div key={row.label} className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                      {row.label}
                    </span>
                    <span className="font-mono text-xs text-slate-700 dark:text-slate-200 sm:text-sm">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link to="/login">
                  <Button className="inline-flex items-center gap-2">
                    Sign in to demo <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
              </div>
            </Reveal>

            <Reveal delayMs={120}>
              <div id="about" className="glass-panel scroll-mt-24 rounded-3xl p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                About
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                A gym OS built for the real world.
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                From renewals to trainer programming, Atlas Gym OS focuses on the everyday workflows that keep a gym
                running. It&apos;s designed to be simple on day one and ready for deeper automation as you grow.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Owners", value: "Operational visibility" },
                  { label: "Teams", value: "Structured routines" },
                  { label: "Members", value: "Better accountability" },
                  { label: "Brands", value: "Multi-gym scale" }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/register" className="flex-1 sm:flex-none">
                  <Button className="w-full">Get started</Button>
                </Link>
                <Link to="/login" className="flex-1 sm:flex-none">
                  <Button variant="secondary" className="w-full">
                    Sign in
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Need onboarding help? Ask for a guided setup and we&apos;ll tailor the workflows to your gym.
              </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
          <Reveal>
            <div className="rounded-3xl bg-gradient-to-r from-sky-600/10 via-sky-600/5 to-transparent p-6 dark:from-neon/15 dark:via-neon/5 sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                  Ready to simplify your gym operations?
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  Start with the essentials today. Expand into QR check-in, gateway payments, and automated follow-ups
                  when you&apos;re ready.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button className="w-full">Create account</Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="secondary" className="w-full">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-slate-200/70 py-10 dark:border-slate-800/70">
        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="font-display font-semibold text-slate-900 dark:text-white">Atlas Gym OS</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Built for super admins, gym owners, trainers, and members.
            </p>
          </div>
        </Reveal>
      </footer>
    </div>
  )
}
