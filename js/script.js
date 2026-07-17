/* ==========================================================
   DOSSIER PORTFOLIO — behaviour layer
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initFooterDate();
  initSmoothNav();
  initParticles();
  initScrollReveal();
});

/* ---------- footer date ---------- */
function initFooterDate(){
  const el = document.getElementById("footer-date");
  if(!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString("en-GB", { year:"numeric", month:"long" });
}

/* ---------- nav: smooth scroll + active tab sync ---------- */
function initSmoothNav(){
  const links = document.querySelectorAll(".ledger-link");
  const sections = document.querySelectorAll("[data-section]");

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.target);
      if(target) target.scrollIntoView({ behavior:"smooth", block:"start" });
    });
  });

  document.querySelectorAll("[data-scroll]").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      const target = document.getElementById(el.dataset.scroll);
      if(target) target.scrollIntoView({ behavior:"smooth", block:"start" });
    });
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        links.forEach(l => l.classList.remove("active"));
        const activeLink = document.querySelector(`.ledger-link[data-target="${entry.target.id}"]`);
        if(activeLink) activeLink.classList.add("active");
      }
    });
  }, { rootMargin:"-45% 0px -45% 0px", threshold:0 });

  sections.forEach(s => navObserver.observe(s));
}

/* ---------- scroll reveal: focus-pull panels + grain burst + bars ---------- */
function initScrollReveal(){
  const panels = document.querySelectorAll(".panel");
  const grainBurst = document.querySelector(".grain-svg");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("in-view");

        // trigger skill bar fill if inside this panel
        entry.target.querySelectorAll(".lang-fill").forEach(bar => {
          bar.classList.add("animate");
        });

        // momentary grain intensity burst on transition, like film grain kicking in
        pulseGrain(grainBurst);

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.18, rootMargin:"0px 0px -8% 0px" });

  panels.forEach(p => revealObserver.observe(p));
}

let grainPulseTimeout = null;
function pulseGrain(grainEl){
  if(!grainEl) return;
  grainEl.style.opacity = "0.14";
  grainEl.style.transition = "opacity 0.15s ease-out";
  clearTimeout(grainPulseTimeout);
  grainPulseTimeout = setTimeout(() => {
    grainEl.style.transition = "opacity 1.4s ease-in";
    grainEl.style.opacity = "0.05";
  }, 140);
}


  addInteractivity() {
    const host = this;
    
    // Add focus logic
    host.addEventListener('mouseenter', () => {
      host.classList.remove('blurred');
      host.focus();
    });

    // Add blur logic when mouse leaves
    host.addEventListener('mouseleave', () => {
      // Optional: Add a slight delay or keep it sharp based on preference
      host.classList.add('blurred');
      host.blur();
    });

    // Ensure keyboard accessibility
    host.setAttribute('tabindex', '0');
    host.addEventListener('focus', () => host.classList.remove('blurred'));
    host.addEventListener('blur', () => host.classList.add('blurred'));
  }
}

customElements.define('contact-code-block', ContactCodeBlock);   
/* ---------- ambient dust / grain particles ---------- */
function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  // SVG Elements
  const grainFilter = document.querySelector('#heavyGrainFilter feTurbulence');
  const grainContainer = document.querySelector('.grain-container');

  let width, height, particles;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Configuration ---
  const CONFIG = {
    particleCountBase: 70,
    densityDivider: 22000,
    mouseRadius: 150,      // Radius for repulsion
    connectDistance: 60,   // Max distance to draw lines
    burstForce: 2.5,       // Click explosion strength
    friction: 0.92,        // Speed decay after burst
    grainSmooth: 0.05      // Lower = smoother/slower SVG transition
  };

  // --- State ---
  let mouse = { x: -1000, y: -1000, active: false };
  let scrollBoost = 0;
  
  // SVG Interpolation State
  let svgState = {
    currentFreq: 0.95,
    targetFreq: 0.95,
    currentSeed: 1,
    targetSeed: 1
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticleArray();
  }

  function initParticleArray() {
    const COUNT = reduced ? 0 : Math.min(CONFIG.particleCountBase, Math.floor((width * height) / CONFIG.densityDivider));
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.1 + 0.3,
      baseSpeedY: -(Math.random() * 0.18 + 0.04),
      speedY: 0, // Dynamic speed
      driftX: (Math.random() - 0.5) * 0.12,
      alpha: Math.random() * 0.35 + 0.05,
      flicker: Math.random() * 0.02
    };
  }

  // --- Event Listeners ---

  window.addEventListener("resize", resize);

  // Mouse Tracking for Canvas
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    
    // Clear active state after 1s of no movement
    clearTimeout(mouse.timer);
    mouse.timer = setTimeout(() => { mouse.active = false; }, 1000);
  });

  // SVG Grain Interaction (Smooth Interpolation)
  if(grainContainer) {
    grainContainer.addEventListener('mousemove', (e) => {
      // Update targets based on cursor position
      svgState.targetSeed = Math.floor(Math.random() * 100);
      svgState.targetFreq = 0.85 + (e.clientX / window.innerWidth) * 0.15;
    });
  }

  // Scroll Boost
  window.addEventListener("scroll", () => { scrollBoost = 1.6; }, { passive: true });

  // Click Burst Effect
  window.addEventListener('click', (e) => {
    particles.forEach(p => {
      const dx = p.x - e.clientX;
      const dy = p.y - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 250) {
        const angle = Math.atan2(dy, dx);
        const force = (250 - dist) / 250;
        // Apply explosive velocity
        p.speedY = -Math.sin(angle) * CONFIG.burstForce * force; 
        p.driftX = Math.cos(angle) * CONFIG.burstForce * force;
      }
    });
  });

  // --- Animation Loop ---

  function updateSVG() {
    // Linear Interpolation (Lerp) for smoothness
    svgState.currentFreq += (svgState.targetFreq - svgState.currentFreq) * CONFIG.grainSmooth;
    
    // Seed needs to be integer, so we lerp then round
    svgState.currentSeed += (svgState.targetSeed - svgState.currentSeed) * CONFIG.grainSmooth;
    
    if(grainFilter) {
      grainFilter.setAttribute('baseFrequency', svgState.currentFreq.toFixed(3));
      grainFilter.setAttribute('seed', Math.floor(svgState.currentSeed));
    }
    requestAnimationFrame(updateSVG);
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);

    // Decay scroll boost
    if (scrollBoost > 0) scrollBoost -= 0.02;

    // 1. Update Physics
    particles.forEach(p => {
      // Restore base speed if not bursting
      p.speedY += (p.baseSpeedY * (1 + scrollBoost) - p.speedY) * 0.05;
      p.driftX += ((Math.random() - 0.5) * 0.12 - p.driftX) * 0.05;

      // Mouse Repulsion
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONFIG.mouseRadius) {
          const force = (CONFIG.mouseRadius - distance) / CONFIG.mouseRadius;
          const angle = Math.atan2(dy, dx);
          // Push away
          p.x -= Math.cos(angle) * force * 2.5;
          p.y -= Math.sin(angle) * force * 2.5;
        }
      }

      // Apply Movement
      p.y += p.speedY;
      p.x += p.driftX;

      // Flicker
      p.alpha += (Math.random() - 0.5) * p.flicker;
      p.alpha = Math.max(0.02, Math.min(0.4, p.alpha));

      // Boundaries (Wrap around)
      if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; }
      if (p.x < -4) p.x = width + 4;
      if (p.x > width + 4) p.x = -4;
    });

    // 2. Draw Connections (Optimized: Only if mouse is active to save CPU)
    if (mouse.active) {
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        // Only check particles reasonably close in the array (simple optimization)
        // For heavy optimization, use a spatial grid, but this works for <100 particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          // Fast distance check (squared)
          if (dx*dx + dy*dy < CONFIG.connectDistance * CONFIG.connectDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(199, 180, 140, ${0.15 * (1 - Math.sqrt(dx*dx + dy*dy)/CONFIG.connectDistance)})`;
            ctx.stroke();
          }
        }
      }
    }

    // 3. Draw Particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(199, 180, 140, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(tick);
  }

  // Initialize
  resize();
  if (!reduced) {
    tick();
    updateSVG(); // Start smooth SVG loop
  }
}

// Call on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParticles);
} else {
  initParticles();
}   
