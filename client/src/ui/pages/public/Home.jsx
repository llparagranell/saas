import { useEffect, useMemo, useState } from "react";

// ─── Icons (inline SVGs to avoid dependencies) ───────────────────────────────
const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IconStar = ({ filled = true }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? "#FACC15" : "none"} stroke="#FACC15" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);
const IconMenu = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const IconX = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconArrow = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);
const IconTrendUp = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconDumbbell = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);
const IconFire = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2Z" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Home", "Features", "Pricing", "Blog", "Contact"];
const API_BASE = import.meta.env.VITE_API_URL || "";

const FEATURES = [
  { icon: <IconTrendUp />, color: "bg-lime-400", title: "Track Revenue", desc: "Monitor your gym's financial performance with detailed revenue analytics and real-time reporting tools." },
  { icon: <IconUsers />, color: "bg-orange-400", title: "Manage Members", desc: "Track member attendance, manage memberships, and keep complete member profiles all in one place." },
  { icon: <IconCalendar />, color: "bg-blue-400", title: "Class Scheduling", desc: "Create and manage class schedules, handle bookings, and send automated reminders to members." },
  { icon: <IconDumbbell />, color: "bg-purple-400", title: "Trainer Management", desc: "Assign trainers to members, track performance metrics, and manage trainer schedules efficiently." },
];

const GYM_CARDS = [
  { title: "Member Status", desc: "Get complete visibility into your membership base. Monitor active, inactive, and trial memberships in real-time.", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80" },
  { title: "Trainer Hub", desc: "Centralize all trainer operations and communications in one powerful hub for better performance.", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80" },
  { title: "Income Tracker", desc: "Track your income streams, monitor expenses and get clear financial insights to grow your gym.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80" },
];

const TRAINERS = [
  { name: "King Zarqs", specialty: "Strength & Conditioning", exp: "8 yrs", clients: "120+", rating: 4.9, img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=300&q=80" },
  { name: "Larry Rope", specialty: "CrossFit & HIIT", exp: "6 yrs", clients: "95+", rating: 4.8, img: "https://images.unsplash.com/photo-1583500178450-e59e4309b57b?w=300&q=80" },
  { name: "Doez Pon", specialty: "Yoga & Flexibility", exp: "10 yrs", clients: "150+", rating: 5.0, img: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=300&q=80" },
  { name: "Max Strong", specialty: "Powerlifting", exp: "12 yrs", clients: "80+", rating: 4.7, img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80" },
  { name: "John Matai", specialty: "Boxing & MMA", exp: "9 yrs", clients: "60+", rating: 4.9, img: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=300&q=80" },
  { name: "Jake Flex", specialty: "Bodybuilding", exp: "7 yrs", clients: "110+", rating: 4.6, img: "https://images.unsplash.com/photo-1618886487661-4c56e8bfca40?w=300&q=80" },
];

const CATEGORIES = [
  { label: "Boxing", emoji: "🥊", color: "bg-red-500/20 text-red-400" },
  { label: "Yoga", emoji: "🧘", color: "bg-purple-500/20 text-purple-400" },
  { label: "Cardio", emoji: "🏃", color: "bg-blue-500/20 text-blue-400" },
  { label: "Strength Training", emoji: "🏋️", color: "bg-lime-500/20 text-lime-400" },
  { label: "CrossFit", emoji: "⚡", color: "bg-yellow-500/20 text-yellow-400" },
  { label: "Cycling", emoji: "🚴", color: "bg-cyan-500/20 text-cyan-400" },
  { label: "Martial Arts", emoji: "🥋", color: "bg-orange-500/20 text-orange-400" },
  { label: "Zumba", emoji: "💃", color: "bg-pink-500/20 text-pink-400" },
  { label: "Swimming", emoji: "🏊", color: "bg-teal-500/20 text-teal-400" },
  { label: "Running", emoji: "👟", color: "bg-green-500/20 text-green-400" },
];

const TESTIMONIALS = [
  { name: "Davis Garcia", role: "Gym Owner", text: "I've seen massive improvements in my gym's performance thanks to this tool. Couldn't ask for more!", rating: 5, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80" },
  { name: "Maria Santos", role: "Fitness Trainer", text: "The trainers are dedicated and professional. The member management module is fantastic!", rating: 4, img: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&q=80" },
  { name: "Brad Lee", role: "Member", text: "Excellent trainers, fantastic customer service! Couldn't ask for more from a fitness platform.", rating: 5, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80" },
  { name: "Salma Hassan", role: "Gym Manager", text: "Great results from dedicated trainers! Revenue tracking alone was worth every penny spent.", rating: 5, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80" },
  { name: "James Kim", role: "PT Coach", text: "The scheduling feature has completely transformed how I manage my clients day-to-day.", rating: 4, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80" },
  { name: "Rachel Moon", role: "Gym Owner", text: "We've transformed our member retention significantly. The analytics are incredibly detailed.", rating: 5, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80" },
  { name: "Ditto Paul", role: "Trainer", text: "An outstanding trainer who truly understands client needs. The app makes tracking effortless.", rating: 5, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80" },
  { name: "Jaqueline M.", role: "Member", text: "The morning makes class scheduling ridiculously easy. I never miss a session anymore.", rating: 4, img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&q=80" },
  { name: "Tom Richards", role: "Gym Owner", text: "The income tracker has given me a clear view of exactly where every dollar in my gym is going.", rating: 5, img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80" },
];

const PLANS = [
  {
    name: "Free Plan", price: "$0", period: "", badge: null, color: "border-zinc-700",
    btnClass: "bg-zinc-800 hover:bg-zinc-700 text-white", btnText: "Get Started",
    features: ["Up to 50 members", "Basic analytics", "1 trainer account", "Email support", "Class scheduling"],
  },
  {
    name: "Pro Plan", price: "$49", period: "/mo", badge: "Most Popular", color: "border-lime-400",
    btnClass: "bg-lime-400 hover:bg-lime-300 text-black font-bold", btnText: "Get Started",
    features: ["Unlimited members", "Advanced analytics", "10 trainer accounts", "Priority support", "Custom branding", "Revenue tracking", "Mobile app access"],
  },
  {
    name: "Enterprise Plan", price: "Custom", period: "", badge: null, color: "border-zinc-700",
    btnClass: "bg-zinc-800 hover:bg-zinc-700 text-white", btnText: "Let's Talk",
    features: ["Unlimited everything", "Dedicated account manager", "Custom integrations", "White-label solution", "API access", "SLA guarantee", "On-site training"],
  },
];

const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
  "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80",
  "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&q=80",
];

const BRANDS = ["LA FITNESS", "FITNESS", "ANYTIME", "GOLD'S", "24 HOUR", "PLANET FITNESS"];

const FOOTER_COLS = [
  { title: "Company", links: ["About Us", "Careers", "Press", "Blog", "Contact"] },
  { title: "All Features", links: ["Revenue Tracking", "Member Management", "Class Scheduling", "Trainer Tools", "Analytics"] },
  { title: "Resources", links: ["Documentation", "API Reference", "Help Center", "Community", "Status"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"] },
  { title: "Login", links: ["Sign In", "Sign Up", "Dashboard", "Forgot Password"] },
];

// ─── Star Rating Component ────────────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <IconStar key={s} filled={s <= Math.round(rating)} />
      ))}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800">
      {/* announcement bar */}
      <div className="bg-lime-400 text-black text-xs text-center py-1.5 font-semibold tracking-wide">
        🎉 New Feature: Just Launched! Explore the Latest in Gym Management Tools — <span className="underline cursor-pointer">Discover Now →</span>
      </div>
      <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-lime-400 rounded flex items-center justify-center">
            <span className="text-black font-black text-xs">G</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">go.Jim</span>
        </div>
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <li key={l}>
              <a href="#" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">{l}</a>
            </li>
          ))}
        </ul>
        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-zinc-300 hover:text-white text-sm font-medium transition-colors">Login</a>
          <a href="#" className="bg-lime-400 hover:bg-lime-300 text-black text-sm font-bold px-4 py-2 rounded-lg transition-colors">Get Started</a>
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <IconX /> : <IconMenu />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden bg-black border-t border-zinc-800 px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <a key={l} href="#" className="text-zinc-300 hover:text-white text-sm">{l}</a>
          ))}
          <a href="#" className="bg-lime-400 text-black text-sm font-bold px-4 py-2 rounded-lg text-center">Get Started</a>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative bg-black min-h-screen flex flex-col items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* bg glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-zinc-400 text-xs font-medium">The #1 Gym Management Platform</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6">
          Simplify Your<br />
          <span className="text-lime-400">Fitness Business</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
          Boost efficiency and increase gym profitability with our all-in-one gym management dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#" className="bg-lime-400 hover:bg-lime-300 text-black font-bold px-8 py-3.5 rounded-xl text-base transition-all hover:scale-105 shadow-lg shadow-lime-400/20">
            Discover a Demo
          </a>
          <a href="#" className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors border border-zinc-700">
            Learn More
          </a>
        </div>
      </div>

      {/* Dashboard Mockup */}
      <div className="relative z-10 mt-16 max-w-5xl mx-auto px-4 w-full">
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl">
          {/* top bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800 border-b border-zinc-700">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="flex-1 mx-4 bg-zinc-900 rounded-md h-6 flex items-center px-3">
              <span className="text-zinc-500 text-xs">app.go-jim.com/dashboard</span>
            </div>
          </div>
          <div className="grid grid-cols-12 min-h-64">
            {/* sidebar */}
            <div className="col-span-2 bg-zinc-950 border-r border-zinc-800 p-3 hidden md:flex flex-col gap-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-5 h-5 bg-lime-400 rounded" />
                <span className="text-white text-xs font-bold">go.Jim</span>
              </div>
              {["Dashboard","Members","Trainers","Classes","Revenue","Settings"].map(item => (
                <div key={item} className={`text-xs px-2 py-1.5 rounded cursor-pointer ${item === "Dashboard" ? "bg-lime-400/20 text-lime-400" : "text-zinc-500 hover:text-zinc-300"}`}>{item}</div>
              ))}
            </div>
            {/* main content */}
            <div className="col-span-12 md:col-span-10 p-4 grid grid-cols-3 gap-3">
              {/* stats */}
              <div className="col-span-3 grid grid-cols-4 gap-2">
                {[
                  { label: "Total Members", val: "2,847", change: "+12%", color: "text-lime-400" },
                  { label: "Monthly Revenue", val: "$48,290", change: "+8.3%", color: "text-lime-400" },
                  { label: "Active Classes", val: "34", change: "+5", color: "text-lime-400" },
                  { label: "Trainers", val: "18", change: "+2", color: "text-lime-400" },
                ].map(s => (
                  <div key={s.label} className="bg-zinc-800 rounded-xl p-3">
                    <p className="text-zinc-500 text-xs mb-1">{s.label}</p>
                    <p className="text-white font-bold text-sm">{s.val}</p>
                    <p className={`text-xs font-semibold ${s.color}`}>{s.change}</p>
                  </div>
                ))}
              </div>
              {/* chart area */}
              <div className="col-span-2 bg-zinc-800 rounded-xl p-3">
                <p className="text-zinc-400 text-xs mb-2 font-semibold">Revenue Analytics</p>
                <div className="flex items-end gap-1.5 h-20">
                  {[40,65,45,80,60,90,70,85,55,75,95,100].map((h,i) => (
                    <div key={i} className="flex-1 rounded-sm" style={{height:`${h}%`, background: i === 11 ? "#a3e635" : i > 7 ? "#3f6212" : "#27272a"}} />
                  ))}
                </div>
              </div>
              {/* member cards */}
              <div className="col-span-1 bg-zinc-800 rounded-xl p-3 flex flex-col gap-2">
                <p className="text-zinc-400 text-xs font-semibold">Personal Trainers</p>
                {[
                  { name: "King Z.", img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=40&q=80" },
                  { name: "Larry R.", img: "https://images.unsplash.com/photo-1583500178450-e59e4309b57b?w=40&q=80" },
                ].map(t => (
                  <div key={t.name} className="flex items-center gap-2">
                    <img src={t.img} alt={t.name} className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-zinc-300 text-xs">{t.name}</span>
                    <span className="ml-auto text-lime-400 text-xs">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand logos */}
      <div className="relative z-10 mt-16 w-full max-w-4xl mx-auto px-4">
        <p className="text-center text-zinc-600 text-xs uppercase tracking-widest mb-6 font-semibold">Trusted by leading fitness brands</p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
          {BRANDS.map(b => (
            <span key={b} className="text-zinc-400 font-black text-sm tracking-widest">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section className="bg-black py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Optimize Your <span className="text-lime-400">Gym Operations</span></h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Our platform gives you everything needed for tracking revenue, managing members, scheduling classes, and managing trainers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-lime-400/40 transition-all group cursor-pointer">
              <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center text-black mb-5 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              <div className="mt-5 flex items-center gap-1 text-lime-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <IconArrow />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Boost Section ────────────────────────────────────────────────────────────
function Boost() {
  return (
    <section className="bg-zinc-950 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Boost Your Gym's <span className="text-lime-400">Success</span></h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Tools and features to keep your fitness business running smoothly and profitably.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GYM_CARDS.map((c) => (
            <div key={c.title} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-lime-400/30 transition-all group cursor-pointer">
              <div className="relative h-44 overflow-hidden">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold text-xl mb-2">{c.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-4">{c.desc}</p>
                <a href="#" className="text-lime-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Learn More <IconArrow />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trainers ─────────────────────────────────────────────────────────────────
function Trainers() {
  return (
    <section className="bg-black py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Find a <span className="text-lime-400">Trainer</span></h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Our certified trainers are here to guide you, offering expertise and dedication to help you achieve your fitness goals.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRAINERS.map((t) => (
            <div key={t.name} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex gap-4 hover:border-lime-400/40 transition-all group cursor-pointer">
              <div className="relative">
                <img src={t.img} alt={t.name} className="w-20 h-24 object-cover rounded-xl" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-lime-400 rounded-full flex items-center justify-center">
                  <IconCheck />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-base">{t.name}</h3>
                <p className="text-zinc-500 text-xs mb-2">{t.specialty}</p>
                <StarRating rating={t.rating} />
                <div className="flex gap-3 mt-2">
                  <div className="bg-zinc-800 rounded-lg px-2 py-1">
                    <p className="text-zinc-500 text-xs">Exp</p>
                    <p className="text-white text-xs font-bold">{t.exp}</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg px-2 py-1">
                    <p className="text-zinc-500 text-xs">Clients</p>
                    <p className="text-white text-xs font-bold">{t.clients}</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg px-2 py-1">
                    <p className="text-zinc-500 text-xs">Rating</p>
                    <p className="text-lime-400 text-xs font-bold">{t.rating}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a href="#" className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105">
            View All Trainers <IconArrow />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Workout Categories ───────────────────────────────────────────────────────
function WorkoutCategories() {
  return (
    <section className="bg-zinc-950 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Workout <span className="text-lime-400">Categories</span></h2>
          <p className="text-zinc-400 max-w-xl mx-auto">From intense cardio to calming yoga, discover programs designed to meet any fitness goal.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map((c) => (
            <div key={c.label} className={`${c.color} rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-transform border border-current/10`}>
              <span className="text-3xl">{c.emoji}</span>
              <span className="text-sm font-semibold text-center">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="bg-black py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">What Our <span className="text-lime-400">Clients Say</span></h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Real gym owners and trainers share how our platform transformed their fitness business operations.</p>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 break-inside-avoid hover:border-lime-400/30 transition-colors">
              <StarRating rating={t.rating} />
              <p className="text-zinc-300 text-sm leading-relaxed mt-3 mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.img} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-zinc-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function Pricing({ plans = [], loading = false, error = "" }) {
  const pricingPlans = useMemo(() => {
    if (!Array.isArray(plans) || plans.length === 0) return PLANS;

    const sorted = [...plans].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    const popularIndex = sorted.length >= 3 ? 1 : -1;

    return sorted.slice(0, 3).map((plan, idx) => {
      const isPopular = idx === popularIndex;
      const period = plan.durationMonths === 1 ? "/mo" : `/${plan.durationMonths} mo`;

      return {
        name: plan.name,
        price: typeof plan.price === "number" ? `$${plan.price}` : "$0",
        period,
        badge: isPopular ? "Most Popular" : null,
        color: isPopular ? "border-lime-400" : "border-zinc-700",
        btnClass: isPopular
          ? "bg-lime-400 hover:bg-lime-300 text-black font-bold"
          : "bg-zinc-800 hover:bg-zinc-700 text-white",
        btnText: "Get Started",
        features: plan.description
          ? [plan.description, "Member management", "Scheduling", "Analytics"]
          : ["Member management", "Scheduling", "Analytics"]
      };
    });
  }, [plans]);

  return (
    <section className="bg-zinc-950 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Easy For Your <span className="text-lime-400">Bank Account</span></h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Our flexible pricing plans give you access to the features you need without breaking the bank.</p>
          {loading && <p className="text-zinc-500 text-sm mt-4">Loading pricing from server…</p>}
          {!loading && error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pricingPlans.map((p) => (
            <div key={p.name} className={`relative bg-zinc-900 border-2 ${p.color} rounded-2xl p-7 flex flex-col ${p.badge ? "scale-100 md:scale-105 shadow-xl shadow-lime-400/10" : ""}`}>
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-lime-400 text-black text-xs font-black px-4 py-1 rounded-full">
                  {p.badge}
                </div>
              )}
              <div className="mb-6">
                {p.name === "Pro Plan" && <span className="text-2xl mr-1">⭐⭐⭐</span>}
                <h3 className="text-white font-bold text-xl mt-1">{p.name}</h3>
                <div className="flex items-end gap-1 mt-3">
                  <span className="text-4xl font-black text-white">{p.price}</span>
                  {p.period && <span className="text-zinc-500 text-sm mb-1">{p.period}</span>}
                </div>
              </div>
              <ul className="flex-1 space-y-2.5 mb-7">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-zinc-300 text-sm">
                    <span className="w-5 h-5 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center flex-shrink-0"><IconCheck /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#" className={`${p.btnClass} text-center py-3 rounded-xl font-semibold transition-all hover:scale-105`}>{p.btnText}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
function Gallery() {
  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {GALLERY_IMGS.map((src, i) => (
            <div key={i} className={`overflow-hidden rounded-xl ${i === 0 || i === 4 ? "row-span-2" : ""}`} style={{height: (i === 0 || i === 4) ? "280px" : "134px"}}>
              <img src={src} alt={`Gallery ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="bg-zinc-950 py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center gap-1 text-3xl mb-4">
          🔥🔥🔥
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          Ready to <span className="text-lime-400">Get Started</span>
        </h2>
        <p className="text-zinc-400 mb-8 text-lg">Take control of your gym's potential with our powerful all-in-one management platform.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#" className="bg-lime-400 hover:bg-lime-300 text-black font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-lime-400/20">
            Discover a Demo
          </a>
          <a href="#" className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-3.5 rounded-xl border border-zinc-700 transition-colors">
            Book a Demo
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-lime-400 rounded flex items-center justify-center">
                <span className="text-black font-black text-xs">G</span>
              </div>
              <span className="text-white font-bold text-lg">go.Jim</span>
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed">The all-in-one gym management platform for modern fitness businesses.</p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-zinc-600 hover:text-zinc-300 text-xs transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-zinc-700 text-xs">© 2024 go.Jim. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(l => (
              <a key={l} href="#" className="text-zinc-700 hover:text-zinc-500 text-xs transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [homePlans, setHomePlans] = useState([]);
  const [homeLoading, setHomeLoading] = useState(false);
  const [homeError, setHomeError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setHomeLoading(true);
      setHomeError("");

      try {
        const res = await fetch(`${API_BASE}/api/public/home`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (cancelled) return;

        setHomePlans(Array.isArray(data?.plans) ? data.plans : []);
      } catch (e) {
        if (!cancelled) setHomeError("Could not load live pricing. Showing default plans.");
      } finally {
        if (!cancelled) setHomeLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Boost />
      <Trainers />
      <WorkoutCategories />
      <Testimonials />
      <Pricing plans={homePlans} loading={homeLoading} error={homeError} />
      <Gallery />
      <CTA />
      <Footer />
    </div>
  );
}
