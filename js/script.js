

(function () {
  "use strict";


  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = window.matchMedia("(pointer: fine)").matches;
  const DESKTOP = FINE && window.innerWidth > 820;


  const header = document.querySelector(".site-header");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();


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

    
    overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });

    
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  
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
      return; 
    }
    if (!phrases.length) return;

    if (REDUCED) {
      el.textContent = phrases[0]; 
    } else {
      typeLoop(el, phrases);
    }
  });

 
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

    document.querySelectorAll("li.row-item[data-img]").forEach(function (row) {
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


  const pointer = document.querySelector(".cursor-pointer");

  if (pointer && FINE && !REDUCED) {
    document.body.classList.add("has-cursor");

    let shown = false;

    document.addEventListener("mousemove", function (e) {
      // The arrow tip sits at (0,0) inside the SVG, so translating the
      // whole element to the mouse position lands the tip exactly where
      // a native cursor would be — no lag, no easing.
      pointer.style.transform = "translate(" + e.clientX + "px, " + e.clientY + "px)";

      if (!shown) {
        shown = true;
        document.body.classList.add("cursor-active");
      }
    }, { passive: true });

    
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

    
    document.addEventListener("mouseleave", function () {
      document.body.classList.remove("cursor-active");
      active = false;
    });
  }


  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
