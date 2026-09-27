/* ==========================================================================
   Include Technologies — site scripts (vanilla JavaScript, no dependencies)
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const WHATSAPP_NUMBER = "233201466717";
  const EMAIL = "Info@includetechnologies.com";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.querySelector(".site-header");
  const nav = document.getElementById("main-nav");
  const toggle = document.querySelector(".nav-toggle");
  const progress = document.querySelector(".scroll-progress span");
  const backToTop = document.querySelector(".back-to-top");

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      const first = nav.querySelector("a");
      if (first) first.focus();
    }
  }
  if (toggle) {
    toggle.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  }
  if (nav) {
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setNav(false);
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav && nav.classList.contains("is-open")) {
      setNav(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (nav && nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) {
      setNav(false);
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && nav && nav.classList.contains("is-open")) setNav(false);
  });

  /* ---------- Sticky header, progress bar, back-to-top ---------- */
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    if (header && !header.classList.contains("is-solid")) header.classList.toggle("is-scrolled", y > 30);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (backToTop) backToTop.classList.toggle("is-visible", y > 700);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Active navigation link ---------- */
  const navLinks = document.querySelectorAll(".nav-link");
  const sectionIds = Array.from(navLinks).map((a) => a.getAttribute("href")).filter((h) => h && h.startsWith("#"));
  const sections = sectionIds.map((id) => document.querySelector(id)).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => {
            const on = l.getAttribute("href") === "#" + entry.target.id;
            l.classList.toggle("is-active", on);
            if (on) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => activeObserver.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el, i) => {
      // small stagger for siblings in the same group
      const siblings = el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal")) : [];
      const idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx * 80, 400) + "ms";
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll(".counter");
  function runCounter(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { runCounter(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => counterObserver.observe(c));
  }

  /* ---------- Service filter ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".service-card[data-cat]");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filterBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      cards.forEach((card) => {
        card.classList.toggle("is-hidden", f !== "all" && card.dataset.cat !== f);
      });
    });
  });

  /* ---------- Service details (Learn more) ---------- */
  const SERVICES = {
    cctv: {
      icon: "fa-solid fa-video", title: "CCTV cameras", option: "CCTV Cameras",
      desc: "Professional CCTV installation and surveillance solutions designed to improve visibility, monitoring and security for homes and businesses.",
      items: ["Site survey to plan camera positions and coverage", "Indoor and outdoor camera installation", "Recorder (DVR/NVR) setup and storage configuration", "Remote viewing on your phone", "Guidance on using and maintaining the system"]
    },
    cyber: {
      icon: "fa-solid fa-user-lock", title: "Cybersecurity & access control", option: "Cybersecurity & Access Control",
      desc: "Security solutions that help protect systems, data, networks and physical access from unauthorized use.",
      items: ["Review of your current devices, accounts and network", "Firewall, antivirus and secure Wi-Fi configuration", "Account and password protection measures", "Door access control with cards, codes or biometrics", "Practical security awareness for your team"]
    },
    network: {
      icon: "fa-solid fa-network-wired", title: "Home & office network setup", option: "Network Setup",
      desc: "Reliable wired and wireless network setup for homes, offices and business environments.",
      items: ["Network planning for your space and number of users", "Structured cabling and network points", "Router, switch and access point installation", "Wi-Fi coverage for every room or floor", "Printer and shared device configuration"]
    },
    web: {
      icon: "fa-solid fa-code", title: "Website development", option: "Website Development",
      desc: "Modern, responsive and professional websites designed to establish and strengthen your digital presence.",
      items: ["Business websites that work on phones, tablets and computers", "Domain and hosting guidance", "Contact forms and WhatsApp integration", "Basic search engine setup", "Updates and support after launch"]
    },
    m365: {
      icon: "fa-brands fa-microsoft", title: "Microsoft 365 & corporate email setup", option: "Microsoft 365 & Corporate Email",
      desc: "Professional Microsoft 365 and corporate email setup to improve communication, collaboration and productivity.",
      items: ["Email on your own domain (you@yourcompany.com)", "Microsoft 365 account and licence setup", "Outlook, Teams and OneDrive configuration", "Migration of existing email where possible", "Setup on staff computers and phones"]
    },
    zoho: {
      icon: "fa-solid fa-diagram-project", title: "Zoho setups (ERP)", option: "Zoho Setup",
      desc: "Business software setup and configuration using Zoho solutions to support business operations and workflow management.",
      items: ["Understanding your business processes", "Zoho app selection and account setup", "Configuration for sales, inventory, finance or HR workflows", "User roles and permissions", "Team onboarding and guidance"]
    },
    fence: {
      icon: "fa-solid fa-bolt", title: "Electric fence", option: "Electric Fence",
      desc: "Electric fencing solutions designed to provide an additional layer of perimeter security for properties.",
      items: ["Perimeter assessment of your property", "Energizer, wires and insulator installation", "Warning signs and alarm integration", "Testing and handover", "Maintenance and repairs"]
    },
    gates: {
      icon: "fa-solid fa-road-barrier", title: "Automated gates", option: "Automated Gates",
      desc: "Automated gate solutions that combine convenience, access control and modern security.",
      items: ["Sliding and swing gate motor installation", "Remote controls and keypad access", "Safety sensors", "Integration with access control or intercom", "Servicing and repairs"]
    },
    pa: {
      icon: "fa-solid fa-bullhorn", title: "PA systems", option: "PA Systems",
      desc: "Professional public address and audio systems for offices, institutions, events and other environments.",
      items: ["Sound planning for your building or venue", "Speaker, amplifier and microphone installation", "Zoned announcements for different areas", "Background music setup", "Testing and user guidance"]
    },
    computers: {
      icon: "fa-solid fa-desktop", title: "Computer system setups", option: "Computer System Setup",
      desc: "Computer installation, configuration and setup services for personal, office and business environments.",
      items: ["New computer setup and configuration", "Operating system and software installation", "Printer, scanner and peripheral setup", "Data transfer from old devices", "Performance checks and troubleshooting"]
    },
    design: {
      icon: "fa-solid fa-pen-nib", title: "Graphic design", option: "Graphic Design",
      desc: "Professional visual design services for branding, promotional materials, social media and business communication.",
      items: ["Logo and brand identity design", "Flyers, banners and brochures", "Social media graphics", "Business cards and stationery", "Presentation and document design"]
    }
  };

  const dialog = document.getElementById("service-dialog");
  let currentService = null;
  let lastTrigger = null;

  function waLink(text) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  }

  function openService(key, trigger) {
    const s = SERVICES[key];
    if (!s || !dialog) return;
    currentService = s;
    lastTrigger = trigger || null;
    document.getElementById("dialog-icon").innerHTML = '<i class="' + s.icon + '" aria-hidden="true"></i>';
    document.getElementById("dialog-title").textContent = s.title;
    document.getElementById("dialog-desc").textContent = s.desc;
    const list = document.getElementById("dialog-list");
    list.innerHTML = "";
    s.items.forEach((t) => { const li = document.createElement("li"); li.textContent = t; list.appendChild(li); });
    document.getElementById("dialog-whatsapp").href = waLink("Hello Include Technologies, I'd like to ask about " + s.title + ".");
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
  }
  function closeService() {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open");
  }

  document.querySelectorAll(".learn-more").forEach((btn) => {
    btn.addEventListener("click", () => openService(btn.dataset.service, btn));
  });
  document.querySelectorAll("[data-open-service]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("services").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      setTimeout(() => openService(link.dataset.openService, link), reduceMotion ? 0 : 500);
    });
  });
  if (dialog) {
    dialog.querySelector(".dialog-close").addEventListener("click", closeService);
    dialog.addEventListener("click", (e) => { if (e.target === dialog) closeService(); });
    dialog.addEventListener("close", () => { if (lastTrigger) lastTrigger.focus(); });
    document.getElementById("dialog-request").addEventListener("click", () => {
      const select = document.getElementById("service");
      if (select && currentService) select.value = currentService.option;
      lastTrigger = null;
      closeService();
      document.getElementById("contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      setTimeout(() => { const n = document.getElementById("name"); if (n) n.focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  const result = document.getElementById("form-result");

  const rules = {
    name: (v) => v.trim().length >= 2 || "Enter your full name.",
    phone: (v) => {
      const digits = v.replace(/[^\d]/g, "");
      if (!v.trim()) return "Enter a phone number so we can call you back.";
      return (digits.length >= 9 && digits.length <= 15 && /^[+\d\s()-]+$/.test(v.trim())) || "Enter a valid phone number, e.g. 020 146 6717.";
    },
    email: (v) => {
      if (!v.trim()) return "Enter your email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Enter a valid email address, e.g. name@company.com.";
    },
    service: (v) => !!v || "Choose the service you need.",
    message: (v) => v.trim().length >= 10 || "Tell us a little more about what you need (at least 10 characters)."
  };

  function validateField(field) {
    const rule = rules[field.name];
    if (!rule) return true;
    const res = rule(field.value);
    const wrap = field.closest(".field");
    const err = document.getElementById(field.name + "-error");
    if (res === true) {
      wrap.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
      if (err) err.textContent = "";
      return true;
    }
    wrap.classList.add("has-error");
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", field.name + "-error");
    if (err) err.textContent = res;
    return false;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  if (form) {
    Array.from(form.elements).forEach((el) => {
      if (!rules[el.name]) return;
      el.addEventListener("blur", () => { if (el.value) validateField(el); });
      el.addEventListener("input", () => { if (el.closest(".field").classList.contains("has-error")) validateField(el); });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = ["name", "phone", "email", "service", "message"].map((n) => form.elements[n]);
      const valid = fields.map(validateField).every(Boolean);
      if (!valid) {
        result.className = "form-result is-error";
        result.innerHTML = "<strong>Some details need attention.</strong><p>Check the highlighted fields and submit again.</p>";
        const firstBad = fields.find((f) => f.getAttribute("aria-invalid") === "true");
        if (firstBad) firstBad.focus();
        return;
      }

      const data = {
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        service: form.elements.service.value,
        message: form.elements.message.value.trim()
      };

      // Optional backend: set data-endpoint on the form (e.g. a Formspree URL) to send directly.
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error("Request failed");
          result.className = "form-result is-success";
          result.innerHTML = "<strong>Request sent.</strong><p>Thank you, " + escapeHTML(data.name) + ". We will contact you shortly.</p>";
          form.reset();
        } catch (err) {
          showFallback(data, true);
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit request";
        }
        result.focus();
        return;
      }

      showFallback(data, false);
      result.focus();
    });
  }

  // No backend: prepare the request so the visitor can send it with WhatsApp or email.
  function showFallback(data, failed) {
    const text =
      "Hello Include Technologies,\n\n" +
      "Name: " + data.name + "\n" +
      "Phone: " + data.phone + "\n" +
      "Email: " + data.email + "\n" +
      "Service: " + data.service + "\n\n" +
      data.message;
    const subject = "Quote request: " + data.service;
    const mailto = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);

    result.className = failed ? "form-result is-error" : "form-result is-success";
    result.innerHTML =
      "<strong>" + (failed ? "We couldn't send your request automatically." : "Your request is ready to send.") + "</strong>" +
      "<p>Choose how to send it. Your details are already filled in.</p>" +
      '<div class="result-actions">' +
      '<a class="btn btn-whatsapp" target="_blank" rel="noopener" href="' + waLink(text) + '"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Send on WhatsApp</a>' +
      '<a class="btn btn-outline-dark" href="' + mailto + '"><i class="fa-solid fa-envelope" aria-hidden="true"></i> Send by email</a>' +
      "</div>";
  }

  /* ---------- Hero particles (subtle network) ---------- */
  const canvas = document.getElementById("hero-particles");
  if (canvas && canvas.getContext && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, points = [], raf = null, running = true;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(60, (w * h) / 22000));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = dx * dx + dy * dy;
          if (d < 14000) {
            ctx.strokeStyle = "rgba(25,194,214," + (0.14 * (1 - d / 14000)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(91,234,245,.55)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", () => { cancelAnimationFrame(raf); resize(); if (running) draw(); });

    // Pause when the hero is off screen to save battery
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        running = entries[0].isIntersecting;
        cancelAnimationFrame(raf);
        if (running) draw();
      }).observe(canvas);
    }
  }
})();
