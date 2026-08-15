"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/widgets/Logo";
import { 
  Users, Target, Shield, Compass, Calendar, Sparkles, Heart, Rocket, 
  CheckCircle, Zap, Star, BarChart3, LayoutDashboard, BrainCircuit,
  Lightbulb, Activity, Globe
} from "lucide-react";

export default function AboutUsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rect = container.getBoundingClientRect();
    let width = rect.width || 400;
    let height = rect.height || 400;

    const centerX = width / 2;
    const centerY = height / 2;
    const centerRadius = 85; 

    const radius = 24; 
    const particles = [
      { id: 0, x: 60, y: 60, vx: 1.8, vy: 1.4 },
      { id: 1, x: width - 60, y: 60, vx: -1.4, vy: 1.8 },
      { id: 2, x: 60, y: height - 60, vx: 1.6, vy: -1.6 },
      { id: 3, x: width - 60, y: height - 60, vx: -1.8, vy: -1.2 },
      { id: 4, x: 60, y: centerY, vx: 1.5, vy: -1.5 },
      { id: 5, x: width - 60, y: centerY, vx: -1.6, vy: 1.6 }
    ];

    let animationFrameId: number;

    const handleResize = () => {
      if (container) {
        rect = container.getBoundingClientRect();
        width = rect.width || 400;
        height = rect.height || 400;
      }
    };
    window.addEventListener("resize", handleResize);

    const updatePhysics = () => {
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x - radius < 0) {
          p.x = radius;
          p.vx = -p.vx;
        } else if (p.x + radius > width) {
          p.x = width - radius;
          p.vx = -p.vx;
        }

        if (p.y - radius < 0) {
          p.y = radius;
          p.vy = -p.vy;
        } else if (p.y + radius > height) {
          p.y = height - radius;
          p.vy = -p.vy;
        }

        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = radius + centerRadius;

        if (dist < minDist) {
          const nx = dx / dist;
          const ny = dy / dist;

          p.x = centerX + nx * minDist;
          p.y = centerY + ny * minDist;

          const dot = p.vx * nx + p.vy * ny;
          p.vx = p.vx - 2 * dot * nx;
          p.vy = p.vy - 2 * dot * ny;
        }
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = radius * 2;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            p1.x -= nx * (overlap / 2);
            p1.y -= ny * (overlap / 2);
            p2.x += nx * (overlap / 2);
            p2.y += ny * (overlap / 2);

            const kx = p1.vx - p2.vx;
            const ky = p1.vy - p2.vy;
            const p = nx * kx + ny * ky;

            p1.vx -= p * nx;
            p1.vy -= p * ny;
            p2.vx += p * nx;
            p2.vy += p * ny;
          }
        }
      }

      particles.forEach(p => {
        const el = document.getElementById(`particle-${p.id}`);
        if (el) {
          el.style.transform = `translate(${p.x - radius}px, ${p.y - radius}px)`;
        }
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-6px); }
        }
        .animate-float-center { animation: float-slow 4s ease-in-out infinite; }
      `}</style>
      <main className="flex w-full max-w-5xl flex-col gap-12 px-8 py-20 sm:px-14">
        
        <section className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6 text-left">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black shadow-sm">
              <Sparkles className="h-4 w-4" /> About EventX
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-black sm:text-5xl lg:text-6xl">
              What is EventX?
            </h1>
            <p className="text-base leading-7 text-black/70 text-justify">
              EventX is a modern, centralized web-based University Event Management System designed to revolutionize how universities organize and manage events. We bring together administrators, organizers, and participants on a single unified platform.
            </p>
            <div className="mt-4 flex gap-4">
              <Link
                href="/discover-events"
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-black/85 hover:scale-105"
              >
                Explore Platform
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div 
              ref={containerRef}
              className="relative w-full max-w-md aspect-square overflow-hidden rounded-[2.5rem] border border-black/10 bg-white/40 shadow-sm backdrop-blur-xs flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:20px_20px] opacity-75" />
              
              <div className="absolute h-56 w-56 rounded-full bg-linear-to-tr from-[#f7efe2]/50 via-white/20 to-[#e5f4ff]/50 blur-3xl opacity-80" />

              <div className="absolute top-1/2 left-1/2 z-10 p-6 w-[150px] rounded-[2rem] border border-black/10 bg-white shadow-xl flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105 duration-500 group animate-float-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-black/5 shadow-inner">
                  <Logo className="h-8 w-8" />
                </div>
                <span className="text-xs font-bold tracking-wider text-black">EventX Core</span>
                <span className="text-[9px] uppercase tracking-widest text-black/40">Centralized System</span>
              </div>

              {[
                { Icon: Users, id: 0 },
                { Icon: Calendar, id: 1 },
                { Icon: Target, id: 2 },
                { Icon: Shield, id: 3 },
                { Icon: BrainCircuit, id: 4 },
                { Icon: Rocket, id: 5 }
              ].map((item, index) => (
                <div 
                  key={index}
                  id={`particle-${item.id}`}
                  className="absolute p-3 rounded-2xl border border-black/10 bg-white/95 shadow-md flex items-center justify-center cursor-pointer transition-shadow hover:shadow-lg select-none"
                  style={{
                    width: "48px",
                    height: "48px",
                    left: "0px",
                    top: "0px",
                    transform: "translate(0px, 0px)"
                  }}
                >
                  <item.Icon className="h-5 w-5 text-black/70" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="group rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.1)] backdrop-blur-md flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 text-black border border-black/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:bg-white group-hover:-translate-y-0.5">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-black tracking-tight">Who We Are</h2>
            <p className="text-base leading-7 text-black/70 text-justify">
              EventX is built for modern universities. We streamline the entire event workflow from planning to execution and analysis, eliminating the chaos of scattered tools like spreadsheets and temporary websites.
            </p>
          </section>

          <section className="group rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.1)] backdrop-blur-md flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 text-black border border-black/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:bg-white group-hover:-translate-y-0.5">
              <Compass className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-black tracking-tight">Our Story</h2>
            <p className="text-base leading-7 text-black/70 text-justify">
              We observed the pain points of fragmented event management. Our team recognized the need for a comprehensive, reusable solution. Today, EventX transforms how universities handle their event ecosystem.
            </p>
          </section>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="group rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.1)] backdrop-blur-md flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg sm:p-10">
            <div className="flex flex-col gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 text-black border border-black/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:bg-white group-hover:-translate-y-0.5">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-black">Our Mission</h3>
              <p className="text-base leading-7 text-black/70 text-justify">
                To empower universities with an intelligent, scalable platform that streamlines coordination, enhances engagement, and enables data-driven decision-making.
              </p>
            </div>
          </section>

          <section className="group rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.1)] backdrop-blur-md flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg sm:p-10">
            <div className="flex flex-col gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 text-black border border-black/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:bg-white group-hover:-translate-y-0.5">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-black">Our Vision</h3>
              <p className="text-base leading-7 text-black/70 text-justify">
                To become the trusted centerpiece of university event management globally, where events are seamlessly created, executed, and analyzed through a single system.
              </p>
            </div>
          </section>
        </div>

        <section className="flex flex-col gap-8">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">What We Offer</h2>
            <p className="mt-3 text-sm leading-6 text-black/60">The core pillars of our event management solution.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: LayoutDashboard, title: "Event Planning", desc: "Create and manage events with venue, date, capacity, and custom forms." },
              { icon: Users, title: "Participant Management", desc: "Handle registrations efficiently with role-based access and waitlists." },
              { icon: Calendar, title: "Smart Ticketing", desc: "Generate QR digital tickets via email for quick check-in verification." },
              { icon: CheckCircle, title: "Attendance Tracking", desc: "Scan QR codes for real-time, accurate attendance records on the go." },
              { icon: Target, title: "Team Coordination", desc: "Assign tasks and track organizing team progress seamlessly." },
              { icon: BrainCircuit, title: "Feedback & Analytics", desc: "Collect ratings with AI sentiment analysis and detailed reports." },
            ].map((feature, i) => (
              <div key={i} className="group rounded-3xl border border-black/10 bg-white/60 p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black border border-black/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:bg-white group-hover:-translate-y-0.5">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h4 className="mb-2 text-base font-semibold text-black">{feature.title}</h4>
                <p className="text-sm leading-6 text-black/70 text-justify">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.1)] backdrop-blur-md sm:p-12">
          <div className="flex flex-col gap-10">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">Why Choose EventX</h2>
              <p className="mt-2 text-sm text-black/60">Designed to be simple, robust, and reliable.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {[
                { icon: Shield, title: "Centralized Platform", desc: "Stop using multiple tools. Manage everything in one unified dashboard." },
                { icon: Zap, title: "Automated Workflows", desc: "Reduce manual effort with automated registrations and notifications." },
                { icon: Activity, title: "Scalable Solution", desc: "Designed to handle unlimited events without performance degradation." },
                { icon: Users, title: "Role-Based Access", desc: "Secure permission management ensures each user sees only what they need." }
              ].map((reason, i) => (
                <div key={i} className="group flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 text-black border border-black/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:bg-white group-hover:-translate-y-0.5">
                    <reason.icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-base font-semibold text-black">{reason.title}</h4>
                    <p className="text-sm leading-6 text-black/60 text-justify">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.1)] backdrop-blur-md sm:p-12">
          <div className="flex flex-col gap-10">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">Core Features</h2>
              <p className="mt-2 text-sm text-black/60">Capabilities that power your events seamlessly.</p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { title: "Centralized Event Management", desc: "Create and manage all events from a single dashboard." },
                { title: "QR-Based Ticketing", desc: "Instant digital tickets to reduce printing costs." },
                { title: "Capacity Management", desc: "Handle high-demand events with automated waitlists." },
                { title: "AI Sentiment Analysis", desc: "Understand satisfaction through intelligent feedback classification." },
                { title: "Team Collaboration", desc: "Assign roles and track organizing team progress in real-time." },
                { title: "Google Calendar Sync", desc: "Seamless integration for participants to manage schedules." }
              ].map((feature, i) => (
                <div key={i} className="group flex gap-4 rounded-2xl border border-black/10 bg-white/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <CheckCircle className="h-5 w-5 shrink-0 text-black/40 mt-0.5 transition-all duration-300 group-hover:scale-110 group-hover:text-black" />
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-semibold text-black">{feature.title}</h4>
                    <p className="text-xs leading-5 text-black/60 text-justify">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">Our Values</h2>
            <p className="mt-3 text-sm leading-6 text-black/60">Principles that guide our platform development.</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Star, title: "Excellence", desc: "Delivering high-quality solutions." },
              { icon: Zap, title: "Efficiency", desc: "Automating to save time & effort." },
              { icon: Heart, title: "User-Centric", desc: "Building intuitive, accessible UI." },
              { icon: Lightbulb, title: "Innovation", desc: "Improving with AI and modern tech." },
              { icon: Shield, title: "Reliability", desc: "24/7 availability & data security." },
              { icon: Users, title: "Collaboration", desc: "Fostering teamwork effortlessly." },
            ].map((value, i) => (
              <div key={i} className="group flex flex-col gap-3 rounded-3xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black border border-black/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:bg-white group-hover:-translate-y-0.5">
                  <value.icon className="h-5 w-5" />
                </div>
                <h4 className="text-base font-semibold text-black">{value.title}</h4>
                <p className="text-sm leading-6 text-black/70 text-justify">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white/80 p-10 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.1)] backdrop-blur-md sm:p-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">EventX by the Numbers</h2>
          </div>
          <div className="grid gap-10 text-center sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
            <div className="flex flex-col gap-2 sm:px-6">
              <span className="text-4xl font-semibold tracking-tight text-black">5</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-black/60">User Roles</span>
              <p className="mt-2 text-xs leading-5 text-black/50 text-justify">Admin, Organizer, Coordinator, Team Member, Participant.</p>
            </div>
            <div className="flex flex-col gap-2 pt-10 sm:px-6 sm:pt-0">
              <span className="text-4xl font-semibold tracking-tight text-black">10+</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-black/60">Core Modules</span>
              <p className="mt-2 text-xs leading-5 text-black/50 text-justify">Comprehensive features for every aspect of events.</p>
            </div>
            <div className="flex flex-col gap-2 pt-10 sm:px-6 sm:pt-0">
              <span className="text-4xl font-semibold tracking-tight text-black">24/7</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-black/60">Analytics</span>
              <p className="mt-2 text-xs leading-5 text-black/50 text-justify">Instant insights into attendance and engagement.</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-black p-8 text-white sm:flex-row sm:p-10">
          <div className="flex flex-col gap-2 text-center sm:text-left max-w-xl">
            <h3 className="text-xl font-semibold sm:text-2xl">Get Started Today</h3>
            <p className="text-sm leading-6 text-white/70 text-justify">
              EventX is built for universities that demand efficiency and transparency. Experience the future of event management.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <Link
              href="/discover-events"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90"
            >
              Explore Events
            </Link>
            <Link
              href="/event/create"
              className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Create an Event
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
