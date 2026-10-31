import "./northwind.css";
import HideChrome from "./HideChrome";

export const metadata = {
  title: "Northwind – Digital Products That Drive Real Impact",
  description: "Webflow → Next.js port test (Boldly-Claude-Test · Northwind page).",
};

// Ported verbatim from the Webflow "Northwind" page. Structure mirrors the
// Webflow element tree; styling comes from app/webflow-test/northwind.css.
export default function WebflowTestPage() {
  const services = [
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <rect x="3" y="3" width="8" height="8" rx="1" fill="#2b6cb0" />
          <rect x="13" y="3" width="8" height="8" rx="1" fill="#2b6cb0" opacity="0.4" />
          <rect x="3" y="13" width="8" height="8" rx="1" fill="#2b6cb0" opacity="0.4" />
          <rect x="13" y="13" width="8" height="8" rx="1" fill="#2b6cb0" opacity="0.2" />
        </svg>
      ),
      combo: "",
      name: "Product Strategy",
      text: "We align business goals with user needs and market opportunity.",
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" stroke="#2b6cb0" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" fill="#2b6cb0" opacity="0.4" />
          <path d="M4 12h16M12 4v16" stroke="#2b6cb0" strokeWidth="1" opacity="0.4" />
        </svg>
      ),
      combo: "inline-div-0",
      name: "Experience Design",
      text: "We craft intuitive, engaging experiences that put users first.",
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M8 6l-4 6 4 6M16 6l4 6-4 6" stroke="#2b6cb0" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M13 4l-2 16" stroke="#2b6cb0" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      ),
      combo: "inline-div-1",
      name: "Engineering",
      text: "We build scalable, high-performance products with clean, maintainable code.",
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M3 17l6-6 4 4 8-8" stroke="#2b6cb0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="19" cy="7" r="2" fill="#2b6cb0" opacity="0.5" />
        </svg>
      ),
      combo: "inline-div-2",
      name: "Growth & Iteration",
      text: "We help you scale with data-driven insights and continuous improvement.",
    },
  ];

  const work = [
    { label: "Fintech", preview: "Modern investing, simplified.", client: "Ramp", services: "Product Design, Strategy" },
    { label: "HR Tech", preview: "The payroll platform for global teams", client: "Deel", services: "Product Design, Engineering" },
    { label: "Security", preview: "Ship better code, faster", client: "Vanta", services: "Engineering, Product Design" },
  ];

  return (
    <div className="nw-page">
      {/* Fonts used by the Webflow design */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=DM+Serif+Display:ital@0;1&display=swap"
      />
      <HideChrome />

      {/* Nav */}
      <nav className="nw-nav">
        <div className="nw-nav-inner">
          <div className="nw-logo">
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
              <path d="M0 0L5.5 9L0 18H4L9.5 9L4 0H0Z" fill="white" />
              <path d="M7 0L12.5 9L7 18H11L16.5 9L11 0H7Z" fill="white" opacity="0.6" />
            </svg>
            <span>NORTHWIND</span>
          </div>
          <div className="nw-nav-links">
            <a href="#">Work</a>
            <a href="#">Services</a>
            <a href="#">About</a>
            <a href="#">Insights</a>
            <a href="#">Careers</a>
          </div>
          <a href="#" className="nw-nav-cta">Let&apos;s talk →</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="nw-hero">
        <div className="nw-hero-glow" />
        <div className="nw-hero-inner">
          <div className="nw-hero-left">
            <h1 className="nw-hero-h1">
              Digital products<br />that drive real <em>impact.</em>
            </h1>
            <p className="nw-hero-sub">
              We help ambitious companies turn complexity into intuitive digital experiences.
            </p>
            <a href="#" className="nw-hero-btn">See our work →</a>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <div className="nw-trusted">
        <div className="nw-trusted-inner">
          <span className="nw-trusted-label">Trusted by</span>
          <div className="nw-trusted-logos">
            <span>verizon√</span>
            <span>_zapier</span>
            <span>deel.</span>
            <span>ramp ↗</span>
            <span>Vanta</span>
            <span>▲ Lucid</span>
          </div>
        </div>
      </div>

      {/* Services */}
      <section className="nw-services">
        <div className="nw-services-inner">
          <div>
            <p className="nw-eyebrow">What We Do</p>
            <h2 className="nw-services-h2">End-to-end digital product partner.</h2>
            <p className="nw-services-desc">
              From strategy to scale, we partner with you at every step to build products your
              users love and your business needs.
            </p>
          </div>
          <div className="nw-services-grid">
            {services.map((s) => (
              <div key={s.name} className="nw-service-item">
                <div className={`nw-service-icon ${s.combo}`.trim()}>{s.icon}</div>
                <p className="nw-service-name">{s.name}</p>
                <p className="nw-service-text">{s.text}</p>
                <a href="#" className="nw-service-link">Learn more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work */}
      <section className="nw-work">
        <div className="nw-work-inner">
          <div className="nw-work-header">
            <div>
              <p className="nw-eyebrow">Featured Work</p>
              <h2 className="nw-work-h2">Real projects.<br />Real results.</h2>
            </div>
            <a href="#" className="nw-view-all">View all work →</a>
          </div>
          <div className="nw-work-grid">
            {work.map((w) => (
              <a key={w.client} href="#" className="nw-work-card">
                <div className="nw-card-dots">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} />
                  ))}
                </div>
                <div className="nw-card-label-row">
                  <span className="nw-card-label">{w.label}</span>
                </div>
                <p className="nw-card-preview">{w.preview}</p>
                <div className="nw-card-meta">
                  <div>
                    <p className="nw-card-client">{w.client}</p>
                    <p className="nw-card-services">{w.services}</p>
                  </div>
                  <span className="nw-card-arrow">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="nw-about">
        <div className="nw-about-inner">
          <div>
            <p className="nw-eyebrow">About Us</p>
            <h2 className="nw-about-h2">We&apos;re builders, designers, and problem solvers.</h2>
            <a href="#" className="nw-about-link">More about us →</a>
          </div>
          <div>
            <p className="nw-about-copy">
              We believe the best digital products are born from clarity, collaboration, and a
              relentless focus on the user.
            </p>
          </div>
          <div className="nw-about-stats">
            <div className="nw-stat-block">
              <div className="nw-stat-num">12+</div>
              <div className="nw-stat-label">Years in business</div>
            </div>
            <div className="nw-stat-block">
              <div className="nw-stat-num">80+</div>
              <div className="nw-stat-label">Products launched</div>
            </div>
            <div className="nw-stat-block">
              <div className="nw-stat-num">40+</div>
              <div className="nw-stat-label">Expert teammates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="nw-footer">
        <div className="nw-footer-inner">
          <span className="nw-footer-logo">// NORTHWIND</span>
          <p className="nw-footer-copy">© 2026 Northwind. All rights reserved.</p>
          <div className="nw-footer-links">
            <a href="#">Work</a>
            <a href="#">Services</a>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
