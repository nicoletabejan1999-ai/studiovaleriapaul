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
    var plain = el.hasAttribute("data-plain") || target >= 1000; // pas de séparateur (années)
    var dur = 1600, start = null;
    function fmt(v) {
      if (decimals) return v.toFixed(decimals);
      v = Math.round(v);
      return plain ? String(v) : v.toLocaleString("fr-FR");
    }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased) + suffix;
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

  // Chemins relatifs au document (index.html à la racine)
  var baData = {
    sourcils: { caption: "Sourcils — effet naturel, dense et structuré", after: "assets/img/brows-after.jpg", before: "assets/img/brows-before.jpg" },
    eyeliner: { caption: "Eyeliner — un regard défini et intensifié", after: "assets/img/eyeliner-after.jpg", before: "assets/img/eyeliner-before.jpg" },
    levres: { caption: "Lèvres aquarelle — bouche fraîche, repulpée et uniforme", after: "assets/img/lips-after.jpg", before: "assets/img/lips-before.jpg" }
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

  function applyBa(key) {
    var data = baData[key];
    if (!data) return;
    if (captionEl) captionEl.textContent = data.caption;
    if (afterEl) afterEl.style.backgroundImage = data.after ? "url('" + data.after + "')" : "";
    if (beforeEl) beforeEl.style.backgroundImage = data.before ? "url('" + data.before + "')" : "";
    setPos(50);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("is-active"); });
      tab.classList.add("is-active");
      applyBa(tab.getAttribute("data-ba"));
    });
  });

  // Initialise le comparateur avec l'onglet actif au chargement
  var activeTab = document.querySelector(".ba-tab.is-active") || tabs[0];
  if (activeTab) applyBa(activeTab.getAttribute("data-ba"));

  /* ---------- Témoignage vidéo ---------- */
  var reviewVideo = document.getElementById("reviewVideo");
  var videoPlayer = document.getElementById("videoPlayer");
  var videoPlayBtn = document.getElementById("videoPlayBtn");
  if (reviewVideo && videoPlayer && videoPlayBtn) {
    function toggleVideo() {
      if (reviewVideo.paused) { reviewVideo.play(); }
      else { reviewVideo.pause(); }
    }
    videoPlayBtn.addEventListener("click", function (e) { e.stopPropagation(); toggleVideo(); });
    videoPlayer.addEventListener("click", toggleVideo);
    reviewVideo.addEventListener("play", function () { videoPlayer.classList.add("is-playing"); });
    reviewVideo.addEventListener("pause", function () { videoPlayer.classList.remove("is-playing"); });
    reviewVideo.addEventListener("ended", function () { videoPlayer.classList.remove("is-playing"); reviewVideo.currentTime = 0; });
  }

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
  var WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/18421979/43e6uza/";
  var form = document.getElementById("bookingForm");
  var success = document.getElementById("bookingSuccess");
  if (form) {
    var submitBtn = form.querySelector("button[type=submit]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      ["name", "phone", "email", "studio"].forEach(function (id) {
        var f = document.getElementById(id);
        var empty = f && !f.value.trim();
        var badEmail = f && id === "email" && f.value.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value.trim());
        if (f && (empty || badEmail)) { f.classList.add("is-invalid"); valid = false; }
        else if (f) { f.classList.remove("is-invalid"); }
      });
      if (!valid) return;

      var studioSel = document.getElementById("studio");
      var payload = new URLSearchParams({
        nom: document.getElementById("name").value.trim(),
        telephone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        studio: studioSel.options[studioSel.selectedIndex].text,
        source: "Landing page Studio Valéria Paul",
        date: new Date().toISOString()
      });

      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi…";

      function showSuccess() {
        // Conversion Meta Pixel
        if (typeof fbq === "function") { fbq("track", "Lead"); }
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        submitBtn.textContent = "Demande envoyée ✓";
        form.querySelectorAll("input, select, textarea").forEach(function (el) { el.disabled = true; });
      }
      function showError() {
        submitBtn.disabled = false;
        submitBtn.textContent = "Réessayer";
        if (success) {
          success.hidden = false;
          success.textContent = "Oups, l'envoi a échoué. Vérifiez votre connexion et réessayez, ou contactez-nous directement.";
          success.style.color = "#c0584f";
          success.style.background = "rgba(192,88,79,0.1)";
        }
      }

      // Envoi vers le CRM (Zapier). mode no-cors : la requête part même sans en-têtes CORS.
      fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString()
      }).then(showSuccess).catch(showError);
    });
    form.querySelectorAll("input, select").forEach(function (el) {
      el.addEventListener("input", function () { el.classList.remove("is-invalid"); });
    });
  }
})();
