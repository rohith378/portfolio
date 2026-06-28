import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Data ──────────────────────────────────────────── */
const PROJECTS = [
  {
    id: "study-buddy",
    title: "STUDY BUDDY",
    desc: "An intelligent study companion that helps students learn smarter — adaptive quizzes, auto-summaries, and progress tracking in one place.",
    tags: ["AI POWERED", "LEARNING TOOL", "WEB APP"],
    url: "https://study-buddy-seven-sage.vercel.app/",
    icon: "school",
    bg: "linear-gradient(135deg,#0a0a1a 0%,#0d1b3e 50%,#0a0a1a 100%)",
    gradient: "radial-gradient(ellipse at 30% 40%,rgba(0,82,255,0.35) 0%,transparent 60%),radial-gradient(ellipse at 70% 70%,rgba(183,196,255,0.18) 0%,transparent 55%)",
    orbs: [
      { w: 200, h: 200, bg: "rgba(0,82,255,0.4)", style: { top: "20%", left: "10%" } },
      { w: 120, h: 120, bg: "rgba(183,196,255,0.2)", style: { bottom: "15%", right: "20%" } },
    ],
    colSpan: "md:col-span-7",
    aspect: "aspect-video",
    comingSoon: false,
  },
  {
    id: "resume-builder",
    title: "RESUME BUILDER",
    desc: "A drag-and-drop resume builder with live preview, multiple templates, and one-click PDF export.",
    tags: ["FULL STACK", "PDF EXPORT"],
    url: "https://resume-ai-eight-tau.vercel.app/",
    icon: "description",
    bg: "linear-gradient(135deg,#050510 0%,#0e1020 50%,#050510 100%)",
    gradient: "radial-gradient(ellipse at 60% 30%,rgba(0,82,255,0.28) 0%,transparent 60%),radial-gradient(ellipse at 20% 80%,rgba(183,196,255,0.12) 0%,transparent 55%)",
    orbs: [
      { w: 180, h: 180, bg: "rgba(0,82,255,0.38)", style: { top: "25%", right: "15%" } },
      { w: 100, h: 100, bg: "rgba(183,196,255,0.15)", style: { bottom: "20%", left: "10%" } },
    ],
    colSpan: "md:col-span-5",
    aspect: "aspect-[4/5]",
    offsetTop: true,
    comingSoon: false,
  },
  {
    id: "token-tracker",
    title: "TOKEN TRACKER",
    desc: "A live cryptocurrency portfolio dashboard tracking token prices, P&L, and allocation in real time — clean, fast, minimal.",
    tags: ["WEB3", "REAL-TIME DATA", "DASHBOARD"],
    url: null,
    icon: "currency_bitcoin",
    bg: "linear-gradient(135deg,#080812 0%,#111130 50%,#080812 100%)",
    gradient: "radial-gradient(ellipse at 50% 50%,rgba(0,82,255,0.38) 0%,transparent 65%),radial-gradient(ellipse at 80% 20%,rgba(183,196,255,0.22) 0%,transparent 50%)",
    orbs: [
      { w: 350, h: 350, bg: "rgba(0,82,255,0.28)", style: { top: "50%", left: "50%", transform: "translate(-50%,-50%)" } },
      { w: 150, h: 150, bg: "rgba(183,196,255,0.2)", style: { top: "10%", right: "10%" } },
      { w: 100, h: 100, bg: "rgba(0,82,255,0.4)", style: { bottom: "15%", left: "5%" } },
    ],
    colSpan: "md:col-span-12",
    fixedH: true,
    comingSoon: true,
  },
];

const SKILLS = [
  { label: "FRONTEND", icon: "code", desc: "React, Next.js, Tailwind CSS — building fast, accessible, and polished interfaces users love." },
  { label: "BACKEND & APIs", icon: "storage", desc: "Node.js, Python, REST APIs — from database design to scalable server-side logic." },
  { label: "AI INTEGRATION", icon: "psychology", desc: "LLMs, embeddings, and smart automation — bringing intelligence into everyday products." },
];

const NAV_LINKS = [
  { href: "#work", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

const FOOTER_LINKS = [
  { label: "GitHub", href: "https://github.com/rohith378" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/bijivemula-rohith-b91549331/" },
  { label: "WhatsApp", href: "https://wa.me/919014437393" },
];

/* ─── Scroll Reveal Hook ────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Three.js Canvas ───────────────────────────────── */
function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const loadThree = () => {
      if (window.THREE) { initScene(); return; }
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/three@0.125.0/build/three.min.js";
      s.onload = initScene;
      document.head.appendChild(s);
    };

    let animId;

    const initScene = () => {
      const THREE = window.THREE;
      if (!THREE || !el) return;

      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      el.appendChild(renderer.domElement);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const pl1 = new THREE.PointLight(0x0052ff, 2, 100);
      pl1.position.set(5, 5, 5);
      scene.add(pl1);
      const pl2 = new THREE.PointLight(0xffffff, 1, 100);
      pl2.position.set(-5, -5, 5);
      scene.add(pl2);

      // Crystal mesh
      const mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2, 0),
        new THREE.MeshPhongMaterial({
          color: 0x111111, emissive: 0x0052ff, emissiveIntensity: 0.2,
          flatShading: true, shininess: 100, transparent: true, opacity: 0.9,
        })
      );
      scene.add(mesh);

      // Wireframe
      const wf = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.05, 0),
        new THREE.MeshBasicMaterial({ color: 0x0052ff, wireframe: true, transparent: true, opacity: 0.3 })
      );
      scene.add(wf);

      // Particles
      const pArr = new Float32Array(600);
      for (let i = 0; i < 600; i++) pArr[i] = (Math.random() - 0.5) * 15;
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
      const pts = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({ size: 0.02, color: 0xffffff, transparent: true, opacity: 0.5 })
      );
      scene.add(pts);

      // Mouse tracking
      let mx = 0, my = 0;
      const onMove = (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 0.5;
        my = (e.clientY / window.innerHeight - 0.5) * 0.5;
      };
      window.addEventListener("mousemove", onMove);

      const animate = () => {
        animId = requestAnimationFrame(animate);
        mesh.rotation.y += 0.004 + mx * 0.008;
        mesh.rotation.x += 0.002 + my * 0.008;
        wf.rotation.y = mesh.rotation.y;
        wf.rotation.x = mesh.rotation.x;
        pts.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        const nw = el.clientWidth || window.innerWidth;
        const nh = el.clientHeight || window.innerHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener("resize", onResize);

      el._cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    };

    loadThree();
    return () => { if (el._cleanup) el._cleanup(); };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

/* ─── Project Visual ────────────────────────────────── */
function ProjectVisual({ project }) {
  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center"
      style={{ background: project.bg }}>
      {/* Grid lines */}
      <div className="absolute inset-0" style={{
        backgroundImage:
          "linear-gradient(rgba(183,196,255,0.04) 1px,transparent 1px)," +
          "linear-gradient(90deg,rgba(183,196,255,0.04) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: project.gradient }} />
      {/* Orbs */}
      {project.orbs.map((o, i) => (
        <div key={i} className="absolute rounded-full"
          style={{ width: o.w, height: o.h, background: o.bg, filter: "blur(40px)", ...o.style }} />
      ))}
      {/* Icon */}
      <span className="material-symbols-outlined relative z-10 select-none"
        style={{ fontSize: project.fixedH ? 120 : 80, opacity: 0.15, filter: "blur(1px)", color: "#b7c4ff" }}>
        {project.icon}
      </span>
      {/* Bottom label */}
      <div className="absolute bottom-7 left-7 z-10 font-mono text-[11px] tracking-[0.22em] uppercase select-none"
        style={{ color: "rgba(183,196,255,0.45)" }}>
        {project.title}
      </div>
    </div>
  );
}

/* ─── Project Card ──────────────────────────────────── */
function ProjectCard({ project, index }) {
  const [ref, visible] = useReveal(0.08);
  const Wrapper = project.url ? "a" : "div";
  const wrapperProps = project.url
    ? { href: project.url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <div
      ref={ref}
      className={`${project.colSpan} ${project.offsetTop ? "md:mt-32" : ""} ${project.fixedH ? "mt-12" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(48px)",
        transition: `opacity 0.85s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s, transform 0.85s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s`,
      }}
    >
      <Wrapper {...wrapperProps} className={`group block ${project.url ? "cursor-pointer" : "cursor-default"}`}>
        {/* Visual */}
        <div
          className={`relative mb-6 overflow-hidden border border-white/5 ${project.aspect || ""} ${project.fixedH ? "h-[460px]" : ""}`}
          style={{ borderRadius: 3 }}
        >
          <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
            <ProjectVisual project={project} />
          </div>
          {project.comingSoon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase border border-[#b7c4ff]/40 text-[#b7c4ff] px-5 py-2 rounded-sm">
                Coming Soon
              </span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3
              className="font-['Sora'] text-[26px] font-semibold leading-tight mb-3 transition-colors duration-300"
              style={{ color: "inherit" }}
            >
              {project.title}
            </h3>
            <div className="flex gap-2 flex-wrap mb-3">
              {project.tags.map((t) => (
                <span key={t} className="font-mono text-[10px] tracking-[0.1em] px-3 py-1 bg-white/5 text-white/50 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <p className="text-white/45 text-[15px] leading-relaxed max-w-lg">{project.desc}</p>
          </div>
          {project.url ? (
            <span className="material-symbols-outlined text-[36px] text-white/25 group-hover:text-[#b7c4ff] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0 mt-1">
              north_east
            </span>
          ) : (
            <span className="material-symbols-outlined text-[36px] text-white/15 shrink-0 mt-1">schedule</span>
          )}
        </div>
      </Wrapper>
    </div>
  );
}

/* ─── Skill Row ─────────────────────────────────────── */
function SkillRow({ skill, index }) {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useReveal(0.1);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="py-12 border-b transition-colors duration-300 cursor-default"
      style={{
        borderBottomColor: hovered ? "#b7c4ff" : "rgba(255,255,255,0.06)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s, border-color 0.3s`,
      }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono text-[11px] tracking-[0.15em] text-[#b7c4ff]">0{index + 1}</span>
        <span
          className="material-symbols-outlined transition-all duration-300"
          style={{ color: "#b7c4ff", opacity: hovered ? 1 : 0 }}
        >
          {skill.icon}
        </span>
      </div>
      <h3
        className="font-['Sora'] text-[28px] font-semibold transition-transform duration-300"
        style={{ transform: hovered ? "translateX(16px)" : "translateX(0)" }}
      >
        {skill.label}
      </h3>
      <p
        className="text-white/45 text-[15px] leading-relaxed mt-3 max-w-md transition-all duration-500"
        style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(6px)" }}
      >
        {skill.desc}
      </p>
    </div>
  );
}

/* ─── Nav ───────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(0,0,0,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="flex justify-between items-center px-6 md:px-16 max-w-[1440px] mx-auto h-20">
        <div className="font-['Sora'] text-xl font-bold tracking-tight">ROHITH</div>
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(({ href, label }, i) => (
            <a
              key={href}
              href={href}
              className="font-mono text-[11px] uppercase tracking-widest transition-colors duration-200"
              style={
                i === 0
                  ? { color: "#b7c4ff", borderBottom: "1px solid #b7c4ff", paddingBottom: 2 }
                  : { color: "rgba(255,255,255,0.45)" }
              }
              onMouseEnter={(e) => { if (i !== 0) e.target.style.color = "#b7c4ff"; }}
              onMouseLeave={(e) => { if (i !== 0) e.target.style.color = "rgba(255,255,255,0.45)"; }}
            >
              {label}
            </a>
          ))}
        </div>
        <a
          href="mailto:bijivemularohith@gmail.com"
          className="bg-[#b7c4ff] text-[#002682] px-5 py-2 font-mono text-[11px] uppercase tracking-widest font-bold hover:bg-white transition-colors duration-200 rounded-sm"
        >
          Hire Me
        </a>
      </div>
    </nav>
  );
}

/* ─── Hero ──────────────────────────────────────────── */
function Hero() {
  const [lettersVisible, setLettersVisible] = useState(false);
  const [subVisible, setSubVisible] = useState(false);
  const text = "HI, I'M ROHITH";

  useEffect(() => {
    const t1 = setTimeout(() => setLettersVisible(true), 400);
    const t2 = setTimeout(() => setSubVisible(true), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-65">
        <HeroCanvas />
      </div>

      <div className="relative z-10 text-center px-6 md:px-16 max-w-5xl mx-auto">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#b7c4ff] mb-6 transition-all duration-700"
          style={{ opacity: subVisible ? 1 : 0, transform: subVisible ? "translateY(0)" : "translateY(10px)" }}
        >
          Full Stack Developer
        </p>

        <h1 className="font-['Sora'] font-bold leading-none tracking-tight mb-8 select-none"
          style={{ fontSize: "clamp(42px,9vw,88px)" }}>
          {text.split("").map((char, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                opacity: lettersVisible ? 1 : 0,
                transform: lettersVisible ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 38}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 38}ms`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <p
          className="text-white/45 text-lg max-w-xl mx-auto mb-12 leading-relaxed"
          style={{
            opacity: subVisible ? 1 : 0,
            transform: subVisible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s",
          }}
        >
          Building products that matter — from smart study tools to DeFi dashboards.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{
            opacity: subVisible ? 1 : 0,
            transform: subVisible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
          }}
        >
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-3 bg-[#b7c4ff] text-[#002682] px-8 py-4 font-mono text-[11px] uppercase tracking-widest font-bold hover:bg-white transition-colors duration-200 rounded-sm"
          >
            View Projects
            <span className="material-symbols-outlined text-[18px]">south</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-3 border border-white/20 text-white/70 px-8 py-4 font-mono text-[11px] uppercase tracking-widest font-bold hover:border-[#b7c4ff] hover:text-[#b7c4ff] transition-all duration-200 rounded-sm"
          >
            Get in Touch
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-25 animate-bounce">
        <span className="material-symbols-outlined text-3xl">keyboard_double_arrow_down</span>
      </div>
    </section>
  );
}

/* ─── Projects ──────────────────────────────────────── */
function Projects() {
  const [titleRef, titleVisible] = useReveal(0.2);

  return (
    <section id="work" className="py-40 px-6 md:px-16 max-w-[1440px] mx-auto">
      <div
        ref={titleRef}
        className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8"
        style={{
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <h2 className="font-['Sora'] font-semibold" style={{ fontSize: "clamp(28px,4vw,40px)" }}>
          SELECTED PROJECTS<span style={{ color: "#b7c4ff" }}>.</span>
        </h2>
        <p className="text-white/40 text-[15px] leading-relaxed max-w-md">
          Three projects built from scratch — each solving a real problem with clean code and thoughtful UX.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ─── Skills ────────────────────────────────────────── */
function Skills() {
  const [titleRef, titleVisible] = useReveal(0.2);

  return (
    <section id="skills" className="py-40" style={{ background: "#080808" }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div
            ref={titleRef}
            style={{
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <h2
              className="font-['Sora'] font-semibold md:sticky md:top-32"
              style={{ fontSize: "clamp(28px,4vw,40px)" }}
            >
              WHAT I<br />BUILD WITH
            </h2>
          </div>
          <div>
            {SKILLS.map((s, i) => (
              <SkillRow key={s.label} skill={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ───────────────────────────────────────── */
function Contact() {
  const [ref, visible] = useReveal(0.2);

  return (
    <section id="contact" className="py-40 px-6 md:px-16 text-center">
      <div
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-[#b7c4ff] mb-6">
          Let's Build Something
        </p>
        <h2
          className="font-['Sora'] font-bold mb-6 leading-tight"
          style={{ fontSize: "clamp(28px,5vw,56px)" }}
        >
          Have a project in mind?<br />I'd love to hear about it.
        </h2>
        <p className="text-white/40 text-lg max-w-lg mx-auto mb-12 leading-relaxed">
          Reach out via email or WhatsApp — I'm always open to interesting work and collaborations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <a
            href="mailto:bijivemularohith@gmail.com"
            className="inline-flex items-center justify-center gap-3 bg-[#b7c4ff] text-[#002682] px-8 py-4 font-mono text-[11px] uppercase tracking-widest font-bold hover:bg-white transition-all duration-200 rounded-sm"
          >
            <span className="material-symbols-outlined text-[18px]">mail</span>
            bijivemularohith@gmail.com
          </a>
          <a
            href="https://wa.me/919014437393"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 border border-[#b7c4ff]/40 text-[#b7c4ff] px-8 py-4 font-mono text-[11px] uppercase tracking-widest font-bold hover:bg-[#b7c4ff] hover:text-[#002682] transition-all duration-200 rounded-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp Me
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          {[["Based In", "INDIA"], ["Status", "OPEN TO WORK"], ["Focus", "FULL STACK"], ["Projects", "3 SHIPPED"]].map(
            ([label, val]) => (
              <div key={label} className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-widest text-white/25 uppercase">{label}</span>
                <span className="font-['Sora'] text-[15px] font-medium">{val}</span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t py-10 px-6 md:px-16" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#080808" }}>
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-['Sora'] text-sm font-bold tracking-widest">ROHITH</div>
        <div className="flex gap-8">
          {FOOTER_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-white/30 hover:text-[#b7c4ff] transition-colors duration-300 uppercase tracking-widest"
            >
              {label}
            </a>
          ))}
        </div>
        <div className="font-mono text-[11px] text-white/20">© 2025 ROHITH</div>
      </div>
    </footer>
  );
}

/* ─── App ───────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}
