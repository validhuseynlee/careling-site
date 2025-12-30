/* Careling: VS Code–friendly vanilla JS router + forms */
(() => {
    "use strict";
  
    const PAGE_MAP = Object.freeze({
      home: "homePage",
      hospitals: "hospitalsPage",
      patients: "patientsPage",
      providers: "providersPage",
      about: "aboutPage",
      contact: "contactPage",
    });
  
    const NAV_OFFSET_PX = 90;
  
    const byId = (id) => document.getElementById(id);
    const qsa = (sel) => Array.from(document.querySelectorAll(sel));
  
    function parseHash() {
      const raw = (location.hash || "#home").replace(/^#/, "");
      const [page, anchor] = raw.split("/");
      return {
        page: PAGE_MAP[page] ? page : "home",
        anchor: anchor || null,
      };
    }
  
    function closeMobileMenu() {
      const navLinks = byId("navLinks");
      const btn = byId("mobileMenuBtn");
      navLinks?.classList.remove("active");
      btn?.setAttribute("aria-expanded", "false");
    }
  
    function toggleMobileMenu() {
      const navLinks = byId("navLinks");
      const btn = byId("mobileMenuBtn");
      if (!navLinks) return;
  
      const open = navLinks.classList.toggle("active");
      btn?.setAttribute("aria-expanded", String(open));
    }
  
    function scrollToAnchor(anchorId) {
      if (!anchorId) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
  
      const target = byId(anchorId);
      if (!target) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
  
      const y = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET_PX;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  
    function setActivePage(pageName, anchorId = null) {
      qsa(".page").forEach((p) => p.classList.remove("active"));
  
      const pageId = PAGE_MAP[pageName] || PAGE_MAP.home;
      const pageEl = byId(pageId);
      if (pageEl) pageEl.classList.add("active");
  
      closeMobileMenu();
      scrollToAnchor(anchorId);
    }
  
    function syncFromUrl() {
      const { page, anchor } = parseHash();
      setActivePage(page, anchor);
    }
  
    function showSuccess(successId, formId) {
      const successEl = byId(successId);
      const formEl = byId(formId);
      if (!successEl || !formEl) return;
  
      successEl.classList.add("show");
      formEl.reset();
  
      setTimeout(() => {
        successEl.classList.remove("show");
      }, 5000);
    }
  
    function bindForm(formId, successId) {
      const form = byId(formId);
      if (!form) return;
  
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        showSuccess(successId, formId);
      });
    }
  
    function interceptHashLinks() {
      document.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
  
        const a = target.closest("a[href^='#']");
        if (!a) return;
  
        const href = a.getAttribute("href");
        if (!href) return;
  
        const raw = href.replace(/^#/, "");
        const [page, anchor] = raw.split("/");
  
        // Only intercept routes we own. Let other hashes behave normally.
        if (!PAGE_MAP[page]) return;
  
        e.preventDefault();
        history.pushState(null, "", href);
        setActivePage(page, anchor || null);
      });
    }
  
    function init() {
      // Mobile menu
      byId("mobileMenuBtn")?.addEventListener("click", toggleMobileMenu);
  
      // Intercept internal links like #providers and #hospitals/hospitalForm
      interceptHashLinks();
  
      // Bind demo forms (no backend yet)
      bindForm("waitlistForm", "waitlistSuccess");
      bindForm("hospitalFormElement", "hospitalSuccess");
      bindForm("patientFormElement", "patientSuccess");
      bindForm("providerFormElement", "providerSuccess");
      bindForm("contactFormElement", "contactSuccess");
  
      // Initial route
      syncFromUrl();
    }
  
    window.addEventListener("DOMContentLoaded", init);
    window.addEventListener("hashchange", syncFromUrl);
  })();
  