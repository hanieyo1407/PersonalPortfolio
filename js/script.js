/* ==========================================================================
   YOHANE H. MALUWA — PORTFOLIO SCRIPTS
   Plain JavaScript. No libraries, no frameworks.

   Modules:
     01  Environment flags (reduced motion, fine pointer)
     02  Sticky header state
     03  Fullscreen menu (mobile)
     04  Char-split headings + reveal
     05  Scroll reveals (.reveal -> .visible)
     06  Typing effect (data-typing)
     07  Animated skill bars (data-skill)
     08  Expandable project rows (accordion)
     09  Cursor-following project preview
     10  Magnetic buttons
     11  Custom cursor (dot + lagging ring)
     12  Footer year
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     01. ENVIRONMENT FLAGS
     Respecting the user's motion preference and input type.
     ------------------------------------------------------------------ */
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = window.matchMedia("(pointer: fine)").matches;
  const DESKTOP = FINE && window.innerWidth > 820;

  /* ------------------------------------------------------------------
     02. STICKY HEADER STATE
     Adds a hairline under the header once the page scrolls.
     ------------------------------------------------------------------ */
  const header = document.querySelector(".site-header");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     03. FULLSCREEN MENU (mobile)
     The hamburger opens a dark overlay; links stagger up via CSS.
     ------------------------------------------------------------------ */
  const toggle = document.querySelector(".nav-toggle");
  const overlay = document.getElementById("menu-overlay");

  function closeMenu() {
    if (!overlay || !toggle) return;
    overlay.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("lock");
  }

  if (toggle && overlay) {
    toggle.addEventListener("click", function () {
      const opening = !overlay.classList.contains("open");
      overlay.classList.toggle("open", opening);
      toggle.classList.toggle("open", opening);
      toggle.setAttribute("aria-expanded", String(opening));
      toggle.setAttribute("aria-label", opening ? "Close menu" : "Open menu");
      document.body.classList.toggle("lock", opening);
    });

    // Close after choosing a page
    overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });

    // Close with Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ------------------------------------------------------------------
     04. CHAR-SPLIT HEADINGS
     Every [data-split] heading has its letters wrapped in <span class="ch">
     with a stagger index (--i). When it scrolls into view we add .in and
     CSS animates each character up into place.
     ------------------------------------------------------------------ */
  function splitChars(el) {
    // Announce the full phrase to screen readers, hide the split spans.
    const text = el.textContent.replace(/\s+/g, " ").trim();
    el.setAttribute("aria-label", text);

    // "Lines" are .line spans if present, otherwise the element itself.
    const lines = el.querySelectorAll(".line");
    const targets = lines.length ? Array.from(lines) : [el];
    let index = 0;

    targets.forEach(function (line) {
      const source = line.textContent;
      line.textContent = "";

      Array.from(source).forEach(function (ch) {
        if (/\s|\u00A0/.test(ch)) {
          // Keep real spaces (and non-breaking spaces) as plain text
          line.appendChild(document.createTextNode(ch === "\u00A0" ? "\u00A0" : " "));
          return;
        }
        const span = document.createElement("span");
        span.className = "ch";
        span.style.setProperty("--i", index);
        span.textContent = ch;
        line.appendChild(span);
        index += 1;
      });
    });
  }

  if (!REDUCED) {
    const splitEls = document.querySelectorAll("[data-split]");
    if ("IntersectionObserver" in window) {
      const splitObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              splitObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      splitEls.forEach(function (el) {
        splitChars(el);
        splitObserver.observe(el);
      });
    } else {
      splitEls.forEach(function (el) {
        el.classList.add("in");
      });
    }
  }

  /* ------------------------------------------------------------------
     05. SCROLL REVEALS
     One observer for every .reveal element on the page. CSS owns the
     transition; JS only flips the class when the element enters view.
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ------------------------------------------------------------------
     06. TYPING EFFECT
     Phrases live in a JSON list inside data-typing. We type a character
     at a time, hold, delete, then move to the next phrase — forever.
     ------------------------------------------------------------------ */
  const TYPE_SPEED = 55;      // ms per character typed
  const DELETE_SPEED = 30;    // ms per character deleted
  const HOLD_TIME = 1600;     // pause when a phrase is complete

  function typeLoop(el, phrases) {
    let phraseIndex = 0;
    let charCount = 0;
    let deleting = false;

    function tick() {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charCount += 1;
        el.textContent = current.slice(0, charCount);

        if (charCount === current.length) {
          deleting = true;
          setTimeout(tick, HOLD_TIME);
        } else {
          setTimeout(tick, TYPE_SPEED + Math.random() * 40);
        }
      } else {
        charCount -= 1;
        el.textContent = current.slice(0, charCount);

        if (charCount === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 400);
        } else {
          setTimeout(tick, DELETE_SPEED);
        }
      }
    }

    tick();
  }

  document.querySelectorAll("[data-typing]").forEach(function (el) {
    let phrases = [];
    try {
      phrases = JSON.parse(el.getAttribute("data-typing"));
    } catch (err) {
      return; // malformed attribute — leave the element empty
    }
    if (!phrases.length) return;

    if (REDUCED) {
      el.textContent = phrases[0]; // calm, static text
    } else {
      typeLoop(el, phrases);
    }
  });

  /* ------------------------------------------------------------------
     07. ANIMATED SKILL BARS
     Each .bar-row carries data-skill="85". When it scrolls into view we
     set the fill width; the CSS transition does the easing for us.
     ------------------------------------------------------------------ */
  const barRows = document.querySelectorAll(".bar-row[data-skill]");

  if ("IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const row = entry.target;
          const fill = row.querySelector(".bar-fill");
          const value = parseInt(row.getAttribute("data-skill"), 10);

          if (fill && !isNaN(value)) {
            fill.style.width = Math.max(0, Math.min(100, value)) + "%";
          }
          row.classList.add("done");
          barObserver.unobserve(row);
        });
      },
      { threshold: 0.4 }
    );
    barRows.forEach(function (row) {
      barObserver.observe(row);
    });
  } else {
    barRows.forEach(function (row) {
      const fill = row.querySelector(".bar-fill");
      if (fill) fill.style.width = row.getAttribute("data-skill") + "%";
      row.classList.add("done");
    });
  }

  /* ------------------------------------------------------------------
     08. EXPANDABLE PROJECT ROWS
     Clicking a row head unfolds the details panel (CSS grid rows animate
     the height). Opening one row folds the others — one story at a time.
     Heads are divs with role="button" so they stay keyboard friendly.
     ------------------------------------------------------------------ */
  const projectRows = document.querySelectorAll(".p-row");

  projectRows.forEach(function (row) {
    const head = row.querySelector(".row-head");
    if (!head) return;

    function setOpen(open) {
      row.classList.toggle("open", open);
      head.setAttribute("aria-expanded", String(open));
    }

    head.addEventListener("click", function () {
      const willOpen = !row.classList.contains("open");

      // Fold every other row first
      projectRows.forEach(function (other) {
        if (other !== row) {
          other.classList.remove("open");
          const otherHead = other.querySelector(".row-head");
          if (otherHead) otherHead.setAttribute("aria-expanded", "false");
        }
      });

      setOpen(willOpen);
    });

    // Keyboard support for the role="button" head
    head.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        head.click();
      }
    });
  });

  /* ------------------------------------------------------------------
     09. CURSOR-FOLLOWING PROJECT PREVIEW (desktop only)
     Hovering a project row head makes a floating image trail the cursor
     with a slight lag (lerp), like a card being carried along.
     ------------------------------------------------------------------ */
  const preview = document.querySelector(".p-preview");

  if (preview && DESKTOP && !REDUCED) {
    const previewImg = preview.querySelector("img");
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;
    let visible = false;

    function followLoop() {
      // Ease 14% of the remaining distance every frame
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      preview.style.left = currentX + "px";
      preview.style.top = currentY + "px";

      if (visible || Math.abs(targetX - currentX) > 0.5) {
        rafId = requestAnimationFrame(followLoop);
      } else {
        rafId = null;
      }
    }

    function startFollow() {
      if (rafId === null) rafId = requestAnimationFrame(followLoop);
    }

    document.querySelectorAll(".p-row").forEach(function (row) {
      const head = row.querySelector(".row-head");

      if (head) {
        head.addEventListener("mouseenter", function () {
          const src = row.getAttribute("data-img");
          if (!src) return;
          if (previewImg.getAttribute("src") !== src) {
            previewImg.setAttribute("src", src);
          }
          visible = true;
          preview.classList.add("show");
          startFollow();
        });

        head.addEventListener("mouseleave", function () {
          visible = false;
          preview.classList.remove("show");
        });
      }
    });

    document.addEventListener("mousemove", function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (visible) startFollow();
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     10. MAGNETIC BUTTONS (desktop only)
     Buttons lean a few pixels toward the cursor and spring back on exit.
     ------------------------------------------------------------------ */
  if (DESKTOP && !REDUCED) {
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        // Move at most ~10% of the button's size toward the cursor
        btn.style.transform =
          "translate(" + relX * 0.18 + "px, " + relY * 0.28 + "px)";
      });

      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------------
     11. CUSTOM CURSOR
     A small dot tracks the pointer exactly; a larger ring trails behind
     with easing and grows over anything interactive. Fine pointers only.
     ------------------------------------------------------------------ */
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (dot && ring && FINE && !REDUCED) {
    document.body.classList.add("has-cursor");

    let mx = -100;
    let my = -100;   // real pointer position
    let rx = -100;
    let ry = -100;   // ring position (lerped)
    let active = false;

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;

      if (!active) {
        active = true;
        rx = mx;
        ry = my;
        document.body.classList.add("cursor-active");
        ringLoop();
      }

      // The dot has no lag at all
      dot.style.transform = "translate(" + mx + "px, " + my + "px)";
    }, { passive: true });

    function ringLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + rx + "px, " + ry + "px)";
      requestAnimationFrame(ringLoop);
    }

    // Grow the ring over interactive elements (event delegation)
    const HOVER_SELECTOR = 'a, button, [role="button"], .hover-demo, input, textarea, select';

    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(HOVER_SELECTOR)) {
        document.body.classList.add("cursor-hover");
      }
    });

    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(HOVER_SELECTOR)) {
        document.body.classList.remove("cursor-hover");
      }
    });

    // Hide the custom cursor when the pointer leaves the window
    document.addEventListener("mouseleave", function () {
      document.body.classList.remove("cursor-active");
      active = false;
    });
  }

  /* ------------------------------------------------------------------
     12. FOOTER YEAR
     Keeps the copyright year honest without a manual edit.
     ------------------------------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
