import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bug,
  Check,
  ChevronRight,
  KanbanSquare,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";

import { buttonVariants } from "@/components/Button/types";
import { cn } from "@/utils/cn";

interface PlanEntitlement {
  feature: string;
  value: string;
}

interface Plan {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  currency: string;
  billingCycle: "MONTHLY" | "YEARLY";
  entitlements: PlanEntitlement[];
}

async function getPlans(): Promise<Plan[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans`, {
    next: { revalidate: 60 }, // plans rarely change — cache for a minute
  });
  const body = await res.json();
  return body.success ? body.data : [];
}

function humanizeFeature(feature: string) {
  return feature.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// The rotating word in the hero headline — CSS-only animation, see
// .animate-word-cycle in globals.css. Duration there (8s) is divided evenly
// across however many words are listed here.
const ROTATING_WORDS = ["remote", "hybrid", "distributed", "growing"];

const FEATURES = [
  {
    icon: Timer,
    title: "Time Tracking",
    description: "Track hours automatically with idle detection and optional screenshots — no manual timesheets.",
  },
  {
    icon: KanbanSquare,
    title: "Projects & Tasks",
    description: "Plan work with boards, sprints, and dependencies — everything your team needs to ship on time.",
  },
  {
    icon: Bug,
    title: "Bug Tracking & QA",
    description: "Log, assign, and resolve issues alongside your regular tasks — one tool, not five.",
  },
  {
    icon: Users,
    title: "Team & HR",
    description: "Manage people, roles, and attendance without switching to a separate HR system.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "See where time and effort actually go, with reports built for managers, not spreadsheets.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description: "Fine-grained permissions per role, scoped to your organization — built in from day one.",
  },
];

export default async function Home() {
  const plans = await getPlans();
  // No "featured" flag from the backend — the middle tier is the
  // conventional "most popular" pick for a 3-plan pricing table.
  const featuredIndex = Math.floor(plans.length / 2);

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Timer size={18} />
            </span>
            TimeStaff
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
              Login
            </Link>
            <Link href="/register" className={cn(buttonVariants({ variant: "default" }))}>
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-indigo-50/60 via-white to-violet-50/40 px-6 py-24">
        <div
          aria-hidden
          className="absolute -left-32 top-1/2 -z-10 h-120 w-120 -translate-y-1/2 rounded-full bg-indigo-100 opacity-70 blur-3xl"
        />

        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          {/* Left — copy + capture form */}
          <div className="flex flex-col gap-6">
            <Link
              href="#pricing"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-indigo-200"
            >
              <span className="flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white">
                <Sparkles size={12} />
                New
              </span>
              See our plans
              <ChevronRight size={14} className="text-gray-400" />
            </Link>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Workforce platform for{" "}
              <span className="relative inline-block">
                {ROTATING_WORDS.map((word, index) => (
                  <span
                    key={word}
                    style={{ animationDelay: `${index * (8 / ROTATING_WORDS.length)}s` }}
                    className={cn(
                      "animate-word-cycle bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent",
                      index > 0 && "absolute left-0 top-0",
                    )}
                  >
                    {word}
                  </span>
                ))}
              </span>{" "}
              teams
            </h1>

            <p className="max-w-lg text-lg text-gray-500">
              TimeStaff combines time tracking, project management, bug tracking, and HR into a single
              organization-wide workspace — built for teams tired of stitching five tools together.
            </p>

            <form action="/register" method="GET" className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your work email"
                className="h-12 w-full rounded-full border border-gray-300 bg-white px-5 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 sm:max-w-xs"
              />
              <button
                type="submit"
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-full")}
              >
                Create account
                <ArrowRight size={16} />
              </button>
            </form>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-1.5">
                <Check size={15} className="text-indigo-600" /> No credit card required
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={15} className="text-indigo-600" /> Set up in minutes
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={15} className="text-indigo-600" /> Role-based access built in
              </li>
            </ul>
          </div>

          {/* Right — illustrated collage (mock UI cards, no stock imagery) */}
          <div className="relative hidden h-100 lg:block" aria-hidden>
            <div className="absolute right-6 top-4 h-72 w-72 rounded-[2.5rem] bg-linear-to-br from-indigo-500 to-violet-500 opacity-90" />
            <div className="absolute right-24 bottom-0 h-56 w-56 rounded-[2rem] bg-linear-to-br from-orange-300 to-amber-400 opacity-90" />

            {/* Time-tracking mock card */}
            <div className="absolute left-0 top-10 w-56 rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                <span>9:00 am – 4:10 pm</span>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">92%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-11/12 rounded-full bg-linear-to-r from-indigo-500 to-violet-500" />
              </div>
            </div>

            {/* Task/project mock card */}
            <div className="absolute bottom-6 right-0 w-52 rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <KanbanSquare size={14} />
                </span>
                Marketing
              </div>
              <p className="mt-1 text-xs text-gray-500">Customer growth strategies</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span>Today, 8:12</span>
                <span className="flex items-center gap-1 text-green-600">
                  <Check size={12} /> On track
                </span>
              </div>
            </div>

            {/* Mini bar chart */}
            <div className="absolute bottom-24 left-6 flex items-end gap-1.5 rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
              <BarChart3 size={18} className="mr-1 text-indigo-500" />
              {[40, 65, 50, 80, 60].map((h, i) => (
                <div key={i} className="w-2 rounded-full bg-indigo-500" style={{ height: `${h * 0.4}px` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-100 bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Everything your team needs, in one place</h2>
            <p className="mt-3 text-gray-500">
              Stop paying for — and switching between — separate tools for time tracking, project
              management, and HR.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="pricing" className="border-t border-gray-100 bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="mt-3 text-gray-500">Choose a plan when you sign up — you can change it any time.</p>
          </div>

          <div className="mt-14 grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => {
              const isFeatured = index === featuredIndex && plans.length > 1;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-lg",
                    isFeatured ? "border-indigo-600 shadow-md" : "border-gray-200",
                  )}
                >
                  {isFeatured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  {plan.description && <p className="mt-1 text-sm text-gray-500">{plan.description}</p>}

                  <p className="mt-4">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      {plan.currency} {Number(plan.basePrice).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      /{plan.billingCycle === "MONTHLY" ? "month" : "year"}
                    </span>
                  </p>

                  <ul className="mt-6 flex-1 space-y-3 border-t border-gray-100 pt-6">
                    {plan.entitlements
                      .filter((e) => e.value === "true")
                      .map((e) => (
                        <li key={e.feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check size={16} className="shrink-0 text-indigo-600" />
                          {humanizeFeature(e.feature)}
                        </li>
                      ))}
                  </ul>

                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({ variant: isFeatured ? "default" : "outline" }),
                      "mt-8 w-full",
                    )}
                  >
                    Get Started
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-gray-100 bg-indigo-600 px-6 py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to bring your team together?</h2>
          <p className="max-w-lg text-indigo-100">
            Set up your organization in minutes and invite your team the same day.
          </p>
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "bg-white text-indigo-600 hover:bg-indigo-50")}
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 px-6 pb-10 pt-16">
        <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
            <span className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Timer size={18} />
              </span>
              TimeStaff
            </span>
            <p className="max-w-56 text-sm text-gray-500">
              Time tracking, projects, and team management — all in one place.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-gray-900">Product</span>
            <Link href="#features" className="text-sm text-gray-500 hover:text-indigo-600">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-gray-500 hover:text-indigo-600">
              Pricing
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-gray-900">Account</span>
            <Link href="/login" className="text-sm text-gray-500 hover:text-indigo-600">
              Login
            </Link>
            <Link href="/register" className="text-sm text-gray-500 hover:text-indigo-600">
              Create Account
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-gray-900">Get in touch</span>
            <a href="mailto:hello@timestaff.app" className="text-sm text-gray-500 hover:text-indigo-600">
              hello@timestaff.app
            </a>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl border-t border-gray-200 pt-6 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TimeStaff. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
