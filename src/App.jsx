import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Clock, MapPin, BadgeCheck, Package, Truck, Scissors, Sparkle,
  Phone, Instagram, Mail, DollarSign, Boxes, CreditCard, Users, Star, Gift,
  Search, X, Sun, Moon, ShieldCheck, Flame, ChevronRight, Heart
} from "lucide-react";
import { Card, CardContent } from "./components/ui/card.jsx";
import { Button } from "./components/ui/button.jsx";

const businessName = "Bandzzz Beauty Go";
const brand = {
  tagline: "Beauty, Bandzzz & bundles delivered in 10–30 minutes",
  deliveryWindow: "10–30 minutes",
  campus: "SUNY Brockport",
  phone: "646-748-7040",
  email: "jahnyah721@gmail.com",
  instagram: "@thehairhubbrockport",
  hours: "Mon–Thu 5pm–12am · Fri–Sat 5pm–1am · Sun 4pm–10pm",
};

const productCatalog = [
  {
    name: "Braiding Hair",
    desc: "Pre‑stretched 18–52” in core colors + fashion tones.",
    items: [
      { name: "3X X‑Pression Pre‑Stretched 52\"", price: 6, tag: "Bestseller" },
      { name: "RUWA Water Wave 24\"", price: 7 },
      { name: "Color Add‑On (Ombre)", price: 2 },
    ],
    icon: <Boxes className="w-6 h-6" />,
  },
  {
    name: "Wigs & Bundles",
    desc: "Glueless synthetics + human hair bundles & closures.",
    items: [
      { name: "HD Lace Wig (synthetic)", price: 69, tag: "New" },
      { name: "Human Hair Bundle (10–24\")", price: 39 },
      { name: "Wig Cap / Elastic Band", price: 3 },
    ],
    icon: <Sparkle className="w-6 h-6" />,
  },
  {
    name: "Styling Essentials",
    desc: "Shine ’n Jam, mousse, gels, edge tools, adhesives.",
    items: [
      { name: "Shine ’n Jam 8oz", price: 10, tag: "Campus Fav" },
      { name: "Nairobi / Lottabody Mousse", price: 9 },
      { name: "Got2b Glued / Spray", price: 8 },
    ],
    icon: <Package className="w-6 h-6" />,
  },
  {
    name: "Men’s Grooming",
    desc: "Durags, wave caps/brushes, sponges, beard oils.",
    items: [
      { name: "Silky Durag", price: 6 },
      { name: "Wave Brush / Cap", price: 7 },
      { name: "Beard Oil (argan/castor)", price: 9 },
    ],
    icon: <Users className="w-6 h-6" />,
  },
];

const subscriptions = [
  {
    name: "VIP Delivery Pass",
    price: "$5 / mo",
    perks: ["Unlimited free on‑campus delivery", "Member‑only flash deals"],
    badge: "Most Popular",
  },
  {
    name: "Slay Essentials Box",
    price: "$22 / mo",
    perks: ["Edge control + mousse + mini oil", "Bonnets / lash add‑ons"],
  },
  {
    name: "Kings Grooming Box",
    price: "$18 / mo",
    perks: ["Beard oil + durag + pomade", "Wave brush every 3 mos"],
  },
  {
    name: "Stylist Refill Kit",
    price: "$49 / mo",
    perks: ["Mixed braiding hair (10 pk)", "Mousse, glue, caps"],
  },
];

const stylists = [
  { name: "Braids by Nia", service: "Knotless · Boho · Loc starts", ig: "@braidsbynia.bpt" },
  { name: "Cuts by Dre", service: "Campus fades · Beard trims", ig: "@cutsbydre.bpt" },
  { name: "Kay’s Install Studio", service: "Wig installs · Closures · Frontals", ig: "@kaysinstalls" },
];

const cx = (...cls) => cls.filter(Boolean).join(" ");

export default function App() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.name === item.name);
      if (existing) {
        return prev.map((p) => (p.name === item.name ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setToast({ show: true, text: `${item.name} added to bag` });
  };
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const [cmdOpen, setCmdOpen] = useState(false);
  const [query, setQuery] = useState("");
  const flatItems = useMemo(
    () => productCatalog.flatMap((c) => c.items.map((it) => ({ ...it, category: c.name }))),
    []
  );
  const filtered = flatItems.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));

  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [email, setEmail] = useState("");

  const [toast, setToast] = useState({ show: false, text: "" });
  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast({ show: false, text: "" }), 2000);
    return () => clearTimeout(t);
  }, [toast.show]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const heroStats = useMemo(
    () => [
      { label: "Delivery", value: brand.deliveryWindow, icon: <Clock className="w-4 h-4" /> },
      { label: "On‑campus fee", value: "$0–2.99", icon: <Truck className="w-4 h-4" /> },
      { label: "Area", value: "Dorms + 2mi radius", icon: <MapPin className="w-4 h-4" /> },
      { label: "Hours", value: brand.hours, icon: <BadgeCheck className="w-4 h-4" /> },
    ],
    []
  );

  async function startCheckout() {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
          success_url: window.location.origin + "/?success=1",
          cancel_url: window.location.origin + "/?canceled=1",
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Checkout unavailable");
    } catch (e) {
      alert("Checkout not ready yet. We will DM you a payment link. (" + e.message + ")");
    }
  }

  async function submitVIP() {
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setSubscribeOpen(false);
        setToast({ show: true, text: "VIP invite sent. Check your email." });
      } else throw new Error(data.error || "Subscription unavailable");
    } catch (e) {
      setSubscribeOpen(false);
      alert("Subscription not active yet. We saved your email locally.");
    }
  }

  return (
    <div className={cx("min-h-screen font-sans text-slate-900 dark:text-slate-100", "bg-white dark:bg-slate-950")}>
      {/* Animated background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-rose-300/40 blur-3xl dark:bg-rose-500/30"
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-violet-300/40 blur-3xl dark:bg-violet-600/20"
          animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Announcement + Nav */}
      <div className="backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/40 sticky top-0 z-40">
        <div className="text-center text-xs md:text-sm py-2 bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white">
          <span className="font-semibold">Launch special:</span> Free on‑campus delivery with the <span className="font-semibold">VIP Delivery Pass</span> · Press <kbd className="px-1.5 py-0.5 border mx-1 rounded">⌘K</kbd>/<kbd className="px-1.5 py-0.5 border mx-1 rounded">Ctrl K</kbd> to search
        </div>
        <header className="border-b border-white/10 bg-white/70 dark:bg-slate-950/60 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkle className="w-5 h-5 text-rose-600" />
              <span className="font-extrabold tracking-tight">{businessName}</span>
              <span className="hidden md:inline text-xs text-slate-500 dark:text-slate-400 ml-2">{brand.campus}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button className="rounded-xl" onClick={() => setCmdOpen(true)}><Search className="w-4 h-4 mr-2" /> Search</Button>
              <Button className="rounded-xl" onClick={() => setSubscribeOpen(true)}><Gift className="w-4 h-4 mr-2" /> Subscribe</Button>
              <Button className="rounded-xl" onClick={() => setCartOpen(true)}><ShoppingBag className="w-4 h-4 mr-2" /> Bag ({cart.reduce((s, i) => s + i.qty, 0)})</Button>
              <Button className="rounded-xl" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</Button>
            </div>
          </div>
        </header>
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-6xl mx-auto p-6 lg:p-10 grid lg:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-slate-900/60 border border-rose-200/60 px-3 py-1 text-xs text-rose-700 dark:text-rose-300">
              <Flame className="w-3.5 h-3.5" /> New at {brand.campus}: delivery in {brand.deliveryWindow}
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight">
              Look good fast. <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-fuchsia-600">Bandzzz</span> delivered.
            </h1>
            <p className="mt-3 text-lg md:text-xl text-slate-700 dark:text-slate-300">
              From braids to bundles to beard care — we run your beauty emergency in minutes. On‑demand, on‑campus, on‑time.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="rounded-2xl px-5 py-6 text-base shadow-lg" onClick={() => setCartOpen(true)}>
                <ShoppingBag className="w-4 h-4 mr-2" /> Order now
              </Button>
              <Button variant="secondary" className="rounded-2xl px-5 py-6 text-base" onClick={() => setSubscribeOpen(true)}>
                <Gift className="w-4 h-4 mr-2" /> Join VIP Pass
              </Button>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {heroStats.map((s, idx) => (
                <Card key={idx} className="rounded-2xl shadow-sm bg-white/70 dark:bg-slate-900/50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                      {s.icon}
                      <span>{s.label}</span>
                    </div>
                    <div className="mt-1 font-semibold">{s.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4" /> Secure tap‑to‑pay · Free returns on sealed items (7 days)
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="bg-white/70 dark:bg-slate-900/60 border border-rose-100/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-3">Campus bestsellers</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {productCatalog.slice(0, 2).map((c) => (
                  <Card key={c.name} className="rounded-2xl hover:shadow-md transition">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 font-semibold">
                        {c.icon}
                        <span>{c.name}</span>
                      </div>
                      <ul className="mt-2 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        {c.items.slice(0, 3).map((it) => (
                          <li key={it.name} className="flex justify-between">
                            <span className="flex items-center gap-2">
                              {it.name}
                              {it.tag && (
                                <span className="text-rose-600 dark:text-rose-300 text-[10px] uppercase tracking-wide bg-rose-50 dark:bg-rose-900/40 border border-rose-200/60 rounded px-1 py-0.5">
                                  {it.tag}
                                </span>
                              )}
                            </span>
                            <span className="font-medium">${it.price.toFixed(0)}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">Need something special? DM us on Instagram and we’ll source it same‑day.</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="max-w-6xl mx-auto p-6 lg:p-10">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">Shop by category</h2>
          <div className="text-sm text-slate-600 dark:text-slate-400">Unisex · Full sizes · Campus‑fast</div>
        </div>
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {productCatalog.map((c) => (
            <Card key={c.name} className="rounded-3xl shadow-sm hover:shadow-xl transition bg-white/80 dark:bg-slate-900/60">
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  {c.icon}
                  <div className="font-semibold">{c.name}</div>
                </div>
                <div className="mt-1 text-slate-600 dark:text-slate-300 text-sm">{c.desc}</div>
                <ul className="mt-3 space-y-2 text-sm">
                  {c.items.map((it) => (
                    <li key={it.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {it.name}
                        {it.tag && (
                          <span className="text-[10px] uppercase tracking-wide bg-rose-50 dark:bg-rose-900/40 border border-rose-200/60 rounded px-1 py-0.5 text-rose-600 dark:text-rose-300">
                            {it.tag}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${it.price.toFixed(0)}</span>
                        <Button size="sm" className="rounded-xl" onClick={() => addToCart({ name: it.name, price: it.price })}>
                          Add
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Subscriptions */}
      <section className="bg-rose-50/60 dark:bg-rose-900/10 border-y">
        <div className="max-w-6xl mx-auto p-6 lg:p-10">
          <h2 className="text-2xl md:text-3xl font-bold">Monthly subscriptions</h2>
          <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptions.map((s) => (
              <Card key={s.name} className={`rounded-3xl border ${s.badge ? "ring-2 ring-rose-400" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 font-semibold">
                    <CreditCard className="w-5 h-5" />
                    <span>{s.name}</span>
                    {s.badge && (
                      <span className="ml-auto text-[10px] uppercase tracking-wide bg-rose-50 dark:bg-rose-900/40 border border-rose-200/60 rounded px-1.5 py-0.5 text-rose-700 dark:text-rose-300">
                        {s.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-2xl font-extrabold">{s.price}</div>
                  <ul className="mt-3 text-sm text-slate-700 dark:text-slate-300 space-y-2">
                    {s.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-rose-500" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-4 rounded-xl w-full" onClick={() => setSubscribeOpen(true)}>
                    Choose plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stylist directory + Wholesale CTA */}
      <section className="max-w-6xl mx-auto p-6 lg:p-10">
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold">Campus stylist spotlight</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {stylists.map((s) => (
                <Card key={s.name} className="rounded-3xl hover:shadow-md transition bg-white/80 dark:bg-slate-900/60">
                  <CardContent className="p-5">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-sm text-slate-700 dark:text-slate-300">{s.service}</div>
                    <div className="mt-2 text-sm text-rose-600 dark:text-rose-300">{s.ig}</div>
                    <Button variant="secondary" className="mt-3 rounded-xl">
                      Book via IG
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-rose-50/70 dark:bg-rose-900/10 border border-rose-100/60 dark:border-rose-900/30 rounded-3xl p-6">
            <div className="font-semibold flex items-center gap-2">
              <Scissors className="w-5 h-5" /> Are you a stylist?
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Join our directory and get wholesale pricing plus weekly promos.</p>
            <ul className="mt-3 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-rose-500" /> 10% off stylist bundles
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-rose-500" /> IG shoutouts + features
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-500" /> Same‑day restock delivery
              </li>
            </ul>
            <Button className="mt-4 rounded-xl w-full" onClick={() => window.open("https://forms.gle/YOUR_FORM_ID", "_blank")}>
              Apply for stylist perks
            </Button>
          </div>
        </div>
      </section>

      {/* Wholesale promo */}
      <section className="bg-gradient-to-r from-rose-100 to-fuchsia-100 dark:from-slate-900 dark:to-slate-900/40">
        <div className="max-w-6xl mx-auto p-6 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Wholesale for campus pros</h3>
            <p className="text-slate-700 dark:text-slate-300 mt-1">
              Bulk braiding hair, adhesives, mousse, caps and more delivered same‑day during business hours. Custom kits available.
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="rounded-xl">
              <Boxes className="w-4 h-4 mr-2" /> Request price list
            </Button>
            <Button variant="secondary" className="rounded-xl">
              <Mail className="w-4 h-4 mr-2" /> {brand.email}
            </Button>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="max-w-6xl mx-auto p-6 lg:p-10">
        <h2 className="text-2xl md:text-3xl font-bold">Loved on campus</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-3xl bg-white/80 dark:bg-slate-900/60">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-rose-600">
                  <Heart className="w-4 h-4" /> Verified student
                </div>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  “Ordered Shine ’n Jam at 10:45pm and it pulled up in 12 minutes. Life saver before my 8am install.”
                </p>
                <div className="mt-2 text-xs text-slate-500">— Brockport student</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-rose-50/60 dark:bg-rose-900/10 border-y">
        <div className="max-w-6xl mx-auto p-6 lg:p-10 grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>
            <ul className="mt-4 space-y-3 text-slate-800 dark:text-slate-200">
              <li>
                <strong>1) Order:</strong> Pick items and drop your dorm/apartment + phone.
              </li>
              <li>
                <strong>2) Track:</strong> Get a text with ETA ({brand.deliveryWindow}).
              </li>
              <li>
                <strong>3) Deliver:</strong> We meet you at the lobby/door. Tap‑to‑pay or cash accepted.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Fees & payments</h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              On‑campus delivery from $0–$2.99; off‑campus (≤2 mi) $3.99–$4.99. Apple Pay · Tap to Pay · Cash.
            </p>
            <h3 className="mt-4 text-xl font-semibold">Returns</h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">Sealed items returnable within 7 days; hair/wigs final sale if opened/worn.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <
