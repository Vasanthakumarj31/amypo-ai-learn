import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Eye,
  MousePointerClick,
  MessageSquareText,
  ArrowRight,
  Code2,
  Terminal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Brain,
    title: "Auto Grading",
    description: "AI-powered evaluation of your HTML, CSS & JS code with instant scoring.",
  },
  {
    icon: Eye,
    title: "Visual Comparison",
    description: "Compare your output with the expected design pixel by pixel.",
  },
  {
    icon: MousePointerClick,
    title: "Interactive Testing",
    description: "DOM, style, and interaction tests validate your code behavior.",
  },
  {
    icon: MessageSquareText,
    title: "AI Feedback",
    description: "Get detailed feedback and suggestions to improve your code.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">AMYPO</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#courses" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Courses
            </a>
            <Link to="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Login
            </Link>
          </nav>

          <Link to="/login">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(hsla(217,33%,22%,0.3)_1px,transparent_1px),linear-gradient(90deg,hsla(217,33%,22%,0.3)_1px,transparent_1px)] bg-[size:64px_64px]" />
        {/* Gradient orbs */}
        <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">AI-Powered Learning Platform</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
              Learn Frontend Development{" "}
              <span className="gradient-text">with AI Evaluation</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Build real webpages. Get instant visual feedback. Master HTML, CSS & JavaScript
              with an AI that grades your code like a senior developer.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 bg-primary px-8 text-primary-foreground shadow-lg hover:bg-primary/90 glow">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="gap-2 border-border px-8 text-foreground hover:bg-secondary">
                  <Terminal className="h-4 w-4" />
                  Student Login
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Code preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-20 max-w-4xl"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
                <span className="ml-4 font-mono text-xs text-muted-foreground">workspace.tsx</span>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed">
                <div className="text-muted-foreground">
                  <span className="text-accent">const</span>{" "}
                  <span className="text-primary">evaluate</span>{" "}
                  <span className="text-muted-foreground">= (</span>
                  <span className="text-warning">code</span>
                  <span className="text-muted-foreground">) =&gt; {"{"}</span>
                </div>
                <div className="ml-4 text-muted-foreground">
                  <span className="text-accent">const</span> result = <span className="text-primary">AI</span>.
                  <span className="text-success">grade</span>(code);
                </div>
                <div className="ml-4 text-muted-foreground">
                  <span className="text-accent">return</span>{" "}
                  <span className="text-foreground">{"{"} score, feedback, tests {"}"}</span>;
                </div>
                <div className="text-muted-foreground">{"};"}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-32">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Everything you need to <span className="gradient-text">master frontend</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              A complete learning environment powered by AI evaluation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses preview */}
      <section id="courses" className="border-t border-border py-32">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Structured <span className="gradient-text">learning paths</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              From basics to advanced — progress at your own pace.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "HTML", color: "text-warning", lessons: 24 },
              { title: "CSS", color: "text-primary", lessons: 30 },
              { title: "JavaScript", color: "text-accent", lessons: 36 },
            ].map((course, i) => (
              <motion.div
                key={course.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-xl border border-border bg-card p-8 text-center"
              >
                <h3 className={`mb-2 text-2xl font-bold ${course.color}`}>{course.title}</h3>
                <p className="text-sm text-muted-foreground">{course.lessons} lessons • 3 levels</p>
                <Link to="/dashboard" className="mt-4 inline-block">
                  <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary">
                    Explore
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Code2 className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">AMYPO</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#courses" className="hover:text-foreground">Courses</a>
            <Link to="/login" className="hover:text-foreground">Login</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 AMYPO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
