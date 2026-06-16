/* =========================================================
   Studio Valeria Paul — Interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Année du footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav : état au scroll + barre de progression ---------- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("scrollProgress");
  var sticky = document.getElementById("stickyCta");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("is-scrolled", y > 40);
    if (sticky) sticky.classList.toggle("is-visible", y > 700);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById("navBurger");
  var mobile = document.getElementById("navMobile");
  if (burger && mobile) {
    burger.addEventListener("click", function () {
      var open = mobile.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Révélations au scroll ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Compteurs animés ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString("fr-FR")) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Comparateur Avant / Après ---------- */
  var slider = document.getElementById("baSlider");
  var beforeEl = document.getElementById("baBefore");
  var handle = document.getElementById("baHandle");
  var captionEl = document.getElementById("baCaption");
  var afterEl = document.getElementById("baAfter");

  var baData = {
    sourcils: { caption: "Sourcils poudrés — effet naturel et structuré", after: "--brows-img", before: "--brows-before" },
    eyeliner: { caption: "Eyeliner — un regard défini et intensifié", after: "--liner-img", before: "--liner-before" },
    levres: { caption: "Lèvres aquarelle — bouche fraîche et repulpée", after: "--lips-img", before: "--lips-before" }
  };

  function setPos(pct) {
    pct = Math.max(0, Math.min(100, pct));
    if (beforeEl) beforeEl.style.width = pct + "%";
    if (handle) handle.style.left = pct + "%";
  }

  if (slider && handle && beforeEl) {
    var frame = slider.querySelector(".ba__frame");
    var dragging = false;

    function moveFromClient(clientX) {
      var rect = frame.getBoundingClientRect();
      setPos(((clientX - rect.left) / rect.width) * 100);
    }
    function startDrag(e) { dragging = true; e.preventDefault(); }
    function endDrag() { dragging = false; }
    function onMove(e) {
      if (!dragging) return;
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      moveFromClient(x);
    }

    handle.addEventListener("mousedown", startDrag);
    handle.addEventListener("touchstart", startDrag, { passive: false });
    frame.addEventListener("mousedown", function (e) { dragging = true; moveFromClient(e.clientX); });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);

    // Accessibilité clavier
    handle.addEventListener("keydown", function (e) {
      var cur = parseFloat(handle.style.left) || 50;
      if (e.key === "ArrowLeft") setPos(cur - 4);
      if (e.key === "ArrowRight") setPos(cur + 4);
    });

    setPos(50);
  }

  /* ---------- Onglets Avant / Après ---------- */
  var tabs = document.querySelectorAll(".ba-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("is-active"); });
      tab.classList.add("is-active");
      var key = tab.getAttribute("data-ba");
      var data = baData[key];
      if (!data) return;
      if (captionEl) captionEl.textContent = data.caption;
      // Bascule les images via variables CSS si disponibles
      var root = getComputedStyle(document.documentElement);
      var afterVar = root.getPropertyValue(data.after);
      var beforeVar = root.getPropertyValue(data.before);
      if (afterEl) afterEl.style.backgroundImage = afterVar && afterVar.trim() ? afterVar : "";
      if (beforeEl) beforeEl.style.backgroundImage = beforeVar && beforeVar.trim() ? beforeVar : "";
      setPos(50);
    });
  });

  /* ---------- Carrousel témoignages ---------- */
  var track = document.getElementById("testiTrack");
  var prev = document.getElementById("testiPrev");
  var next = document.getElementById("testiNext");
  var dotsWrap = document.getElementById("testiDots");

  if (track) {
    var slides = track.children.length;
    var idx = 0, timer = null;

    if (dotsWrap) {
      for (var i = 0; i < slides; i++) {
        var d = document.createElement("button");
        d.setAttribute("aria-label", "Avis " + (i + 1));
        (function (n) { d.addEventListener("click", function () { go(n); restart(); }); })(i);
        dotsWrap.appendChild(d);
      }
    }
    function render() {
      track.style.transform = "translateX(" + (-idx * 100) + "%)";
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (dot, n) {
          dot.classList.toggle("is-active", n === idx);
        });
      }
    }
    function go(n) { idx = (n + slides) % slides; render(); }
    function restart() { if (timer) clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 6000); }

    if (prev) prev.addEventListener("click", function () { go(idx - 1); restart(); });
    if (next) next.addEventListener("click", function () { go(idx + 1); restart(); });
    render();
    restart();
  }

  /* ---------- Formulaire de réservation ---------- */
  var form = document.getElementById("bookingForm");
  var success = document.getElementById("bookingSuccess");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      ["name", "phone", "service"].forEach(function (id) {
        var f = document.getElementById(id);
        if (f && !f.value.trim()) { f.classList.add("is-invalid"); valid = false; }
        else if (f) { f.classList.remove("is-invalid"); }
      });
      if (!valid) return;
      // Démo : pas de back-end. Le studio branchera son outil de réservation ici.
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.querySelector("button[type=submit]").textContent = "Demande envoyée ✓";
      form.querySelectorAll("input, select, textarea").forEach(function (el) { el.disabled = true; });
    });
    form.querySelectorAll("input, select").forEach(function (el) {
      el.addEventListener("input", function () { el.classList.remove("is-invalid"); });
    });
  }
})();
