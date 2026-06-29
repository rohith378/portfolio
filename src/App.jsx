import { useEffect, useRef, useState } from "react";

/* ── Global Styles ── */
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  body { background: #000; color: #e5e2e1; overflow-x: hidden; overscroll-behavior: none; font-family: 'Inter', sans-serif; }
  .material-symbols-outlined { font-variation-settings: 'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24; user-select: none; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #000; }
  ::-webkit-scrollbar-thumb { background: rgba(183,196,255,0.2); border-radius: 2px; }
  ::selection { background: #b7c4ff; color: #002682; }
  @keyframes bouncearrow {
    0%,100% { transform: translateX(-50%) translateY(-4px); }
    50% { transform: translateX(-50%) translateY(4px); }
  }
  .gpu { will-change: transform, opacity; transform: translateZ(0); }
  img { display: block; max-width: 100%; }


`;

/* ── Data ── */
const PROJECTS = [
  {
    id: "study-buddy", title: "Study Buddy", subtitle: "AI Learning Companion",
    desc: "An intelligent study companion — upload your notes and instantly get AI-generated quizzes, flashcards, summaries, and progress tracking.",
    tags: ["React", "Node.js", "MongoDB", "AI/LLM", "Full Stack"],
    url: "https://study-buddy-seven-sage.vercel.app/", img: "/study-buddy.png",
  },
  {
    id: "resume-builder", title: "Resume Builder", subtitle: "AI-Powered Career Tool",
    desc: "Create ATS-friendly, professional resumes in minutes. AI handles content enhancement, ATS score analysis, and one-click PDF export.",
    tags: ["React", "Node.js", "MongoDB", "AI", "PDF Export"],
    url: "https://resume-ai-eight-tau.vercel.app/", img: "/resume-builder.png",
  },
  {
    id: "token-tracker", title: "Token Tracker", subtitle: "AI Token Analytics Dashboard",
    desc: "Real-time analytics to track every AI token you spend across GPT-4o, Claude, Groq and Gemini — with cost breakdowns and usage insights.",
    tags: ["React", "Node.js", "MongoDB", "Dashboard", "Real-Time"],
    url: "https://tocken-track.vercel.app/", img: "/token-tracker.png",
  },
];

/* ── Reveal Hook ── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Three.js Canvas ── */
function HeroCanvas() {
  const mountRef = useRef(null);
  useEffect(() => {
    const el = mountRef.current; if (!el) return;
    let cleanupFn;
    const init = () => {
      const THREE = window.THREE; if (!THREE || !el) return;
      const w = el.clientWidth || window.innerWidth, h = el.clientHeight || window.innerHeight;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
      camera.position.z = 5;
      const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, powerPreference:"high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
      renderer.setSize(w,h);
      renderer.domElement.style.pointerEvents = "none";
      el.appendChild(renderer.domElement);
      scene.add(new THREE.AmbientLight(0xffffff,0.5));
      const pl1=new THREE.PointLight(0x0052ff,2,100); pl1.position.set(5,5,5); scene.add(pl1);
      const pl2=new THREE.PointLight(0xffffff,1,100); pl2.position.set(-5,-5,5); scene.add(pl2);
      const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(2,0),new THREE.MeshPhongMaterial({color:0x111111,emissive:0x0052ff,emissiveIntensity:0.2,flatShading:true,shininess:100,transparent:true,opacity:0.9}));
      scene.add(mesh);
      const wf=new THREE.Mesh(new THREE.IcosahedronGeometry(2.05,0),new THREE.MeshBasicMaterial({color:0x0052ff,wireframe:true,transparent:true,opacity:0.3}));
      scene.add(wf);
      const pArr=new Float32Array(600); for(let i=0;i<600;i++) pArr[i]=(Math.random()-0.5)*15;
      const pGeo=new THREE.BufferGeometry(); pGeo.setAttribute("position",new THREE.BufferAttribute(pArr,3));
      const pts=new THREE.Points(pGeo,new THREE.PointsMaterial({size:0.02,color:0xffffff,transparent:true,opacity:0.5}));
      scene.add(pts);
      let mx=0,my=0;
      const onMove=e=>{mx=(e.clientX/window.innerWidth-0.5)*0.5;my=(e.clientY/window.innerHeight-0.5)*0.5;};
      window.addEventListener("mousemove",onMove,{passive:true});
      let animId;
      const animate=()=>{ animId=requestAnimationFrame(animate); mesh.rotation.y+=0.004+mx*0.006; mesh.rotation.x+=0.002+my*0.006; wf.rotation.y=mesh.rotation.y; wf.rotation.x=mesh.rotation.x; pts.rotation.y+=0.001; renderer.render(scene,camera); };
      animate();
      const onResize=()=>{ const nw=el.clientWidth||window.innerWidth,nh=el.clientHeight||window.innerHeight; camera.aspect=nw/nh; camera.updateProjectionMatrix(); renderer.setSize(nw,nh); };
      window.addEventListener("resize",onResize,{passive:true});
      cleanupFn=()=>{ cancelAnimationFrame(animId); window.removeEventListener("mousemove",onMove); window.removeEventListener("resize",onResize); renderer.dispose(); if(el.contains(renderer.domElement))el.removeChild(renderer.domElement); };
    };
    if(window.THREE) init();
    else { const s=document.createElement("script"); s.src="https://cdn.jsdelivr.net/npm/three@0.125.0/build/three.min.js"; s.onload=init; document.head.appendChild(s); }
    return ()=>{ if(cleanupFn) cleanupFn(); };
  },[]);
  return <div ref={mountRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} />;
}

/* ── Nav ── */
function Nav() {
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{ const fn=()=>setScrolled(window.scrollY>50); window.addEventListener("scroll",fn,{passive:true}); return()=>window.removeEventListener("scroll",fn); },[]);
  return (
    <nav style={{position:"fixed",top:0,width:"100%",zIndex:50,transition:"background 0.4s,border-color 0.4s",background:scrolled?"rgba(0,0,0,0.92)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"1px solid rgba(255,255,255,0.06)":"1px solid transparent"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 clamp(20px,5vw,64px)",maxWidth:1440,margin:"0 auto",height:76}}>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:700,letterSpacing:"-0.02em"}}>ROHITH<span style={{color:"#b7c4ff"}}>.</span></div>
        <div style={{display:"flex",gap:28,alignItems:"center"}}>
          {[["#about","About"],["#work","Projects"],["#skills","Skills"],["#contact","Contact"]].map(([href,label])=>(
            <a key={href} href={href} style={{fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.12em",textDecoration:"none",color:"rgba(255,255,255,0.5)",transition:"color 0.2s"}}
              onMouseEnter={e=>e.target.style.color="#b7c4ff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.5)"}>{label}</a>
          ))}
        </div>
        <a href="#contact" style={{background:"#b7c4ff",color:"#002682",padding:"8px 20px",fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,textDecoration:"none",borderRadius:2,transition:"background 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="#fff"} onMouseLeave={e=>e.currentTarget.style.background="#b7c4ff"}>
          Hire Me
        </a>
      </div>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  const [lettersVisible,setLettersVisible]=useState(false);
  const [subVisible,setSubVisible]=useState(false);
  const text="HI, I'M ROHITH";
  useEffect(()=>{ const t1=setTimeout(()=>setLettersVisible(true),400); const t2=setTimeout(()=>setSubVisible(true),1200); return()=>{clearTimeout(t1);clearTimeout(t2);}; },[]);
  return (
    <section style={{position:"relative",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"#000"}}>
      <div style={{position:"absolute",inset:0,opacity:0.6,willChange:"transform",transform:"translateZ(0)"}}><HeroCanvas /></div>
      <div style={{position:"relative",zIndex:10,textAlign:"center",padding:"0 24px",maxWidth:860,margin:"0 auto"}}>
        <p className="gpu" style={{fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.4em",color:"#b7c4ff",marginBottom:20,opacity:subVisible?1:0,transform:subVisible?"translateY(0)":"translateY(10px)",transition:"opacity 0.7s,transform 0.7s"}}>
          Fresher · Full Stack Developer · Open to Work
        </p>
        <h1 style={{fontFamily:"Sora,sans-serif",fontWeight:800,lineHeight:1,letterSpacing:"-0.04em",marginBottom:28,fontSize:"clamp(40px,9vw,86px)"}}>
          {text.split("").map((char,i)=>(
            <span key={i} className="gpu" style={{display:"inline-block",opacity:lettersVisible?1:0,transform:lettersVisible?"translateY(0)":"translateY(28px)",transition:`opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${i*35}ms,transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i*35}ms`}}>
              {char===" "?"\u00A0":char}
            </span>
          ))}
        </h1>
        <p className="gpu" style={{color:"rgba(255,255,255,0.5)",fontSize:17,maxWidth:500,margin:"0 auto 40px",lineHeight:1.75,opacity:subVisible?1:0,transform:subVisible?"translateY(0)":"translateY(14px)",transition:"opacity 0.8s ease 0.15s,transform 0.8s ease 0.15s"}}>
          CS final year student who builds full-stack products with AI — from study tools to token analytics dashboards.
        </p>
        <div className="gpu" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",opacity:subVisible?1:0,transform:subVisible?"translateY(0)":"translateY(14px)",transition:"opacity 0.8s ease 0.3s,transform 0.8s ease 0.3s"}}>
          <a href="#work" style={{display:"inline-flex",alignItems:"center",gap:8,background:"#b7c4ff",color:"#002682",padding:"13px 28px",fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,textDecoration:"none",borderRadius:2}}>
            View Projects <span className="material-symbols-outlined" style={{fontSize:16}}>south</span>
          </a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.65)",padding:"13px 28px",fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,textDecoration:"none",borderRadius:2}}>
            View Resume
          </a>
        </div>
      </div>
      <div style={{position:"absolute",bottom:36,left:"50%",opacity:0.2,animation:"bouncearrow 1.5s ease-in-out infinite"}}>
        <span className="material-symbols-outlined" style={{fontSize:30}}>keyboard_double_arrow_down</span>
      </div>
    </section>
  );
}

/* ── About ── */
function About() {
  const [ref,visible]=useReveal(0.1);
  return (
    <section id="about" style={{padding:"120px clamp(20px,5vw,64px)",background:"#080808"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div ref={ref} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:72,alignItems:"center",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(40px)",transition:"opacity 0.9s ease,transform 0.9s ease"}}>
          <div>
            <p style={{fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.4em",color:"#b7c4ff",marginBottom:20}}>About Me</p>
            <h2 style={{fontFamily:"Sora,sans-serif",fontSize:"clamp(26px,3.5vw,40px)",fontWeight:700,lineHeight:1.15,marginBottom:28}}>CS Student Who<br/>Ships Real Products</h2>
            <p style={{color:"rgba(255,255,255,0.55)",fontSize:16,lineHeight:1.85,marginBottom:16}}>
              I'm Rohith, a final year B.Tech Computer Science student at Ramireddy Subbarami Engineering College with a CGPA of <span style={{color:"#b7c4ff",fontWeight:600}}>8.47</span>. While most students study frameworks in theory, I've been building and shipping full-stack AI applications that solve real problems.
            </p>
            <p style={{color:"rgba(255,255,255,0.55)",fontSize:16,lineHeight:1.85,marginBottom:16}}>
              I built an AI-powered study tool, an ATS resume builder, and a token analytics dashboard — all live on Vercel. My stack is the <span style={{color:"#b7c4ff",fontWeight:600}}>MERN Stack</span> with AI integrations using LLM APIs.
            </p>
            <p style={{color:"rgba(255,255,255,0.55)",fontSize:16,lineHeight:1.85,marginBottom:36}}>
              I'm actively looking for <span style={{color:"#b7c4ff",fontWeight:600}}>Full Stack Developer</span> roles where I can contribute from day one, grow fast, and build things that matter.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <a href="mailto:bijivemularohith@gmail.com" style={{display:"inline-flex",alignItems:"center",gap:8,background:"#b7c4ff",color:"#002682",padding:"11px 22px",fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,textDecoration:"none",borderRadius:2}}>
                <span className="material-symbols-outlined" style={{fontSize:16}}>mail</span> Email Me
              </a>
              <a href="https://www.linkedin.com/in/bijivemula-rohith-b91549331/" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,border:"1px solid rgba(183,196,255,0.3)",color:"#b7c4ff",padding:"11px 22px",fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,textDecoration:"none",borderRadius:2}}>
                LinkedIn
              </a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.6)",padding:"11px 22px",fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,textDecoration:"none",borderRadius:2}}>
                <span className="material-symbols-outlined" style={{fontSize:16}}>description</span> View Resume
              </a>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[
              {icon:"school",label:"Education",val:"B.Tech CSE",sub:"CGPA: 8.47 · 2027"},
              {icon:"work",label:"Status",val:"Fresher",sub:"Open to Full Stack Roles"},
              {icon:"rocket_launch",label:"Projects",val:"3 Shipped",sub:"All Deployed & Live"},
              {icon:"location_on",label:"Location",val:"Nellore, AP",sub:"Open to Remote / Relocation"},
            ].map(({icon,label,val,sub})=>(
              <div key={label} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:22}}>
                <span className="material-symbols-outlined" style={{fontSize:22,color:"#b7c4ff",marginBottom:10,display:"block"}}>{icon}</span>
                <div style={{fontFamily:"monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:"rgba(255,255,255,0.28)",marginBottom:5}}>{label}</div>
                <div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:600,marginBottom:3}}>{val}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.32)",lineHeight:1.4}}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Project Card ── */
function ProjectCard({project,index,reverse}) {
  const [ref,visible]=useReveal(0.08);
  const [hov,setHov]=useState(false);
  return (
    <div ref={ref} className="gpu" style={{opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(50px)",transition:`opacity 0.85s ease ${index*0.1}s,transform 0.85s ease ${index*0.1}s`}}>
      <div style={{display:"grid",gridTemplateColumns:reverse?"1fr 1.15fr":"1.15fr 1fr",gap:56,alignItems:"center"}}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
        <div style={{order:reverse?2:1,position:"relative",borderRadius:10,overflow:"hidden",border:"1px solid rgba(255,255,255,0.07)",boxShadow:hov?"0 24px 64px rgba(0,82,255,0.22)":"0 8px 32px rgba(0,0,0,0.5)",transition:"box-shadow 0.4s ease"}}>
          <div style={{transform:hov?"scale(1.03)":"scale(1)",transition:"transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)"}}>
            <img src={project.img} alt={project.title} style={{width:"100%",height:"auto",display:"block"}} />
          </div>
          <div style={{position:"absolute",inset:0,background:"rgba(0,82,255,0.07)",opacity:hov?1:0,transition:"opacity 0.3s",pointerEvents:"none"}} />
        </div>
        <div style={{order:reverse?1:2}}>
          <p style={{fontFamily:"monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.3em",color:"#b7c4ff",marginBottom:12}}>{String(index+1).padStart(2,"0")} / Project</p>
          <h3 style={{fontFamily:"Sora,sans-serif",fontSize:"clamp(22px,2.5vw,30px)",fontWeight:700,marginBottom:6,lineHeight:1.15}}>{project.title}</h3>
          <p style={{fontFamily:"monospace",fontSize:12,color:"rgba(255,255,255,0.32)",marginBottom:16,letterSpacing:"0.05em"}}>{project.subtitle}</p>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:15,lineHeight:1.8,marginBottom:22}}>{project.desc}</p>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:28}}>
            {project.tags.map(t=>(
              <span key={t} style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.1em",padding:"5px 12px",background:"rgba(183,196,255,0.07)",color:"#b7c4ff",borderRadius:999,border:"1px solid rgba(183,196,255,0.14)"}}>{t}</span>
            ))}
          </div>
          <a href={project.url} target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:8,background:hov?"#b7c4ff":"transparent",color:hov?"#002682":"#b7c4ff",border:"1px solid #b7c4ff",padding:"11px 22px",fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,textDecoration:"none",borderRadius:2,transition:"all 0.25s ease"}}>
            Live Demo <span className="material-symbols-outlined" style={{fontSize:16}}>north_east</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Projects ── */
function Projects() {
  const [ref,visible]=useReveal(0.15);
  return (
    <section id="work" style={{padding:"120px clamp(20px,5vw,64px)"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div ref={ref} className="gpu" style={{marginBottom:80,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(30px)",transition:"opacity 0.8s ease,transform 0.8s ease"}}>
          <p style={{fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.4em",color:"#b7c4ff",marginBottom:16}}>Selected Work</p>
          <h2 style={{fontFamily:"Sora,sans-serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,marginBottom:14}}>Projects I've Built<span style={{color:"#b7c4ff"}}>.</span></h2>
          <p style={{color:"rgba(255,255,255,0.4)",fontSize:15,lineHeight:1.7,maxWidth:480}}>Every project is live, deployed, and built from scratch — no templates, no blindly followed tutorials.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:100}}>
          {PROJECTS.map((p,i)=><ProjectCard key={p.id} project={p} index={i} reverse={i%2===1} />)}
        </div>
      </div>
    </section>
  );
}

/* ── Skills ── */
function Skills() {
  const [ref,visible]=useReveal(0.1);
  const skillGroups=[
    {category:"Languages",items:["JavaScript","Java"]},
    {category:"Frontend",items:["React.js","HTML5","CSS3","Tailwind CSS","Framer Motion"]},
    {category:"Backend",items:["Node.js","Express.js","REST APIs","JWT Auth"]},
    {category:"Database",items:["MongoDB"]},
    {category:"Tools",items:["Git","GitHub","Postman","Vercel","Render","VS Code"]},
    {category:"Concepts",items:["DSA","OOP","DBMS","OS","Computer Networks"]},
  ];
  return (
    <section id="skills" style={{padding:"120px clamp(20px,5vw,64px)",background:"#080808"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div ref={ref} className="gpu" style={{marginBottom:56,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(30px)",transition:"opacity 0.8s ease,transform 0.8s ease"}}>
          <p style={{fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.4em",color:"#b7c4ff",marginBottom:16}}>Tech Stack</p>
          <h2 style={{fontFamily:"Sora,sans-serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:700}}>What I Build With<span style={{color:"#b7c4ff"}}>.</span></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
          {skillGroups.map(({category,items},ci)=>{
            const [sref,sv]=useReveal(0.1);
            return (
              <div key={category} ref={sref} className="gpu" style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:24,opacity:sv?1:0,transform:sv?"translateY(0)":"translateY(28px)",transition:`opacity 0.7s ease ${ci*0.08}s,transform 0.7s ease ${ci*0.08}s`}}>
                <div style={{fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.15em",color:"#b7c4ff",marginBottom:18}}>{category}</div>
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  {items.map(item=>(
                    <div key={item} style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:"#b7c4ff",opacity:0.5,flexShrink:0}} />
                      <span style={{fontSize:14,color:"rgba(255,255,255,0.68)",fontWeight:500}}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ── */
function Contact() {
  const [ref,visible]=useReveal(0.15);
  return (
    <section id="contact" style={{padding:"120px clamp(20px,5vw,64px)",textAlign:"center",background:"#080808"}}>
      <div ref={ref} className="gpu" style={{maxWidth:640,margin:"0 auto",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(40px)",transition:"opacity 0.9s ease,transform 0.9s ease"}}>
        <p style={{fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.4em",color:"#b7c4ff",marginBottom:20}}>Get In Touch</p>
        <h2 style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:"clamp(28px,5vw,50px)",lineHeight:1.15,marginBottom:20}}>
          Let's Build Something<br/><span style={{color:"#b7c4ff"}}>Together.</span>
        </h2>
        <p style={{color:"rgba(255,255,255,0.45)",fontSize:16,lineHeight:1.8,marginBottom:44}}>
          I'm actively looking for full stack developer roles. If you have an opportunity or just want to say hi — I'd love to hear from you.
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:56}}>
          <a href="mailto:bijivemularohith@gmail.com" style={{display:"inline-flex",alignItems:"center",gap:10,background:"#b7c4ff",color:"#002682",padding:"14px 24px",fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,textDecoration:"none",borderRadius:2}}>
            <span className="material-symbols-outlined" style={{fontSize:17}}>mail</span> bijivemularohith@gmail.com
          </a>
          <a href="https://wa.me/919014437393" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:10,border:"1px solid rgba(183,196,255,0.4)",color:"#b7c4ff",padding:"14px 24px",fontFamily:"monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,textDecoration:"none",borderRadius:2}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp Me
          </a>
        </div>
        <div style={{display:"flex",gap:24,justifyContent:"center",paddingTop:28,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          {[["GitHub","https://github.com/rohith378"],["LinkedIn","https://www.linkedin.com/in/bijivemula-rohith-b91549331/"]].map(([label,href])=>(
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.3)",textDecoration:"none",textTransform:"uppercase",letterSpacing:"0.12em",transition:"color 0.3s"}}
              onMouseEnter={e=>e.currentTarget.style.color="#b7c4ff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.3)"}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer style={{borderTop:"1px solid rgba(255,255,255,0.05)",background:"#050505",padding:"28px clamp(20px,5vw,64px)"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:14,fontWeight:700}}>ROHITH<span style={{color:"#b7c4ff"}}>.</span></div>
        <div style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.2)"}}>Fresher · Full Stack Developer · Open to Work</div>
        <div style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.15)"}}>© 2025 Rohith</div>
      </div>
    </footer>
  );
}

/* ── App ── */
export default function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}
