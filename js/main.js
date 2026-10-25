/* =========================================================
   Begzod — portfolio skriptlari
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- AOS (Animate On Scroll) ---------- */
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 70,
      disable: reduceMotion,
    });
    // Rasmlar yuklangach pozitsiyalarni qayta hisoblash
    window.addEventListener("load", () => AOS.refresh());
  } else {
    // CDN ishlamasa ham kontent ko'rinib tursin
    document.querySelectorAll("[data-aos]").forEach((el) => el.removeAttribute("data-aos"));
  }

  /* ---------- Header + scroll progress ---------- */
  const header = document.getElementById("header");
  const progressBar = document.getElementById("progressBar");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 10);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobil menyu ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Menyuni yopish" : "Menyuni ochish");
  }
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      burger.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120) setMenu(false);
  });

  /* ---------- Faol bo'limni menyuda belgilash ---------- */
  const links = Array.from(document.querySelectorAll(".nav__link"));
  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === id));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Rasm yuklanmasa — zaxira ko'rinish ---------- */
  document.querySelectorAll(".polaroid__photo img").forEach((img) => {
    const markMissing = () => img.parentElement.classList.add("is-missing");
    if (img.complete && img.naturalWidth === 0) markMissing();
    img.addEventListener("error", markMissing);
  });

  /* ---------- Lightbox (rasmni kattalashtirish) ---------- */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCaption = document.getElementById("lightboxCaption");
  const btnClose = lightbox.querySelector(".lightbox__close");
  const btnPrev = lightbox.querySelector(".lightbox__nav--prev");
  const btnNext = lightbox.querySelector(".lightbox__nav--next");

  let group = [];
  let index = 0;
  let lastFocus = null;

  function show(i) {
    index = (i + group.length) % group.length;
    const img = group[index];
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = img.dataset.caption || img.alt;
    const single = group.length < 2;
    btnPrev.hidden = single;
    btnNext.hidden = single;
  }

  function open(img) {
    if (img.parentElement.classList.contains("is-missing")) return;
    const name = img.dataset.lightbox;
    group = Array.from(document.querySelectorAll('[data-lightbox="' + name + '"]')).filter(
      (el) => !el.parentElement.classList.contains("is-missing")
    );
    lastFocus = document.activeElement;
    show(group.indexOf(img));
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    btnClose.focus();
  }

  function close() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { lightbox.hidden = true; }, reduceMotion ? 0 : 300);
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll("[data-lightbox]").forEach((img) => {
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.addEventListener("click", () => open(img));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(img);
      }
    });
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => show(index - 1));
  btnNext.addEventListener("click", () => show(index + 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft" && group.length > 1) show(index - 1);
    if (e.key === "ArrowRight" && group.length > 1) show(index + 1);
  });

  /* ---------- Yil ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
