(function () {
  "use strict";

  // ----- AOS init -----
  AOS.init({ duration: 700, once: true, offset: 80 });

  // ----- Nickname (from config) -----
  const nickname = (typeof CONFIG !== "undefined" && CONFIG.partnerNickname) ? CONFIG.partnerNickname : "P";
  document.querySelectorAll(".nickname").forEach(function (el) {
    el.textContent = nickname;
  });

  // ----- Site Survey year -----
  const surveyEl = document.querySelector(".subtitle");
  if (surveyEl && typeof CONFIG !== "undefined") {
    surveyEl.textContent = "Site Survey: " + CONFIG.siteSurveyYear;
  }

  // ----- Happy days (relationship) counter -----
  function getRelationshipDuration(startDate) {
    const start = new Date(startDate + "T00:00:00");
    const now = new Date();
    if (now < start) return null;
    let d = new Date(start.getTime());
    let years = 0, months = 0;
    while (new Date(d.getFullYear() + 1, d.getMonth(), d.getDate()) <= now) {
      years++;
      d.setFullYear(d.getFullYear() + 1);
    }
    while (new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()) <= now) {
      months++;
      d.setMonth(d.getMonth() + 1);
    }
    const days = Math.max(0, Math.floor((now - d) / 86400000));
    const secs = Math.floor((now - start) / 1000);
    const hours = Math.floor((secs % 86400) / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    return { years, months, days, hours, mins, secs: secs % 60 };
  }
  function updateHappyDaysCounter() {
    if (typeof CONFIG === "undefined" || !CONFIG.relationshipStartDate) return;
    const d = getRelationshipDuration(CONFIG.relationshipStartDate);
    if (!d) return;
    const set = function (id, val) { const el = document.getElementById(id); if (el) el.textContent = val; };
    set("rd-years", d.years);
    set("rd-months", d.months);
    set("rd-days", d.days);
    set("rd-hours", String(d.hours).padStart(2, "0"));
    set("rd-mins", String(d.mins).padStart(2, "0"));
    set("rd-secs", String(d.secs).padStart(2, "0"));
  }
  updateHappyDaysCounter();
  setInterval(updateHappyDaysCounter, 1000);

  // ----- Time since Pune counter -----
  function updatePuneCounter() {
    if (typeof CONFIG === "undefined" || !CONFIG.puneMoveDate) return;
    const move = new Date(CONFIG.puneMoveDate + "T00:00:00");
    const now = new Date();
    const diff = Math.max(0, Math.floor((now - move) / 1000));

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    const secs = diff % 60;

    const dEl = document.getElementById("days");
    const hEl = document.getElementById("hours");
    const mEl = document.getElementById("mins");
    const sEl = document.getElementById("secs");
    if (dEl) dEl.textContent = String(days).padStart(2, "0");
    if (hEl) hEl.textContent = String(hours).padStart(2, "0");
    if (mEl) mEl.textContent = String(mins).padStart(2, "0");
    if (sEl) sEl.textContent = String(secs).padStart(2, "0");
  }
  updatePuneCounter();
  setInterval(updatePuneCounter, 15000);

  // ----- Distance countdown (720 → 0) -----
  const DISTANCE_COOLDOWN_MS = 60 * 1000; // once per minute
  let distanceLastRun = 0;

  function runDistanceCounter() {
    const total = (typeof CONFIG !== "undefined" && CONFIG.distanceKm) ? CONFIG.distanceKm : 720;
    const el = document.getElementById("distance-num");
    const msgEl = document.getElementById("distance-msg");
    if (!el || !msgEl) return;

    // Reset message state for re-run
    msgEl.textContent = "Closing the gap...";
    msgEl.classList.remove("welcome");
    el.textContent = total;

    const duration = 4000;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - t, 2);
      const value = Math.round(total * (1 - easeOut));
      el.textContent = value;
      if (value <= 0) {
        msgEl.textContent = "Distance closed. Closeness Increased.";
        msgEl.classList.add("welcome");
        return;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function tryRunDistanceOnHover() {
    const now = Date.now();
    if (now - distanceLastRun < DISTANCE_COOLDOWN_MS) return;
    distanceLastRun = now;
    runDistanceCounter();
  }

  // Run when merge section is in view (first time)
  const mergeSection = document.getElementById("merge");
  if (mergeSection) {
    const observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          runDistanceCounter();
          distanceLastRun = Date.now();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(mergeSection);
  }

  // Hover on Distance Calculator: restart countdown (throttled to once per minute)
  const distanceCalcEl = document.querySelector(".distance-calc");
  if (distanceCalcEl) {
    distanceCalcEl.addEventListener("mouseenter", tryRunDistanceOnHover);
    distanceCalcEl.style.cursor = "pointer";
  }

  // ----- Map: Nagpur → Pune -----
  function initMap() {
    const container = document.getElementById("map");
    if (!container) return;

    // Nagpur 21.1458, 79.0882 | Pune 18.5204, 73.8567
    const nagpur = [21.1458, 79.0882];
    const pune = [18.5204, 73.8567];
    const center = [(nagpur[0] + pune[0]) / 2, (nagpur[1] + pune[1]) / 2];

    const map = L.map("map", {
      center: center,
      zoom: 5,
      zoomControl: true
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap, CartoDB"
    }).addTo(map);

    const line = L.polyline([nagpur, pune], {
      color: "#e8f0ff",
      weight: 3,
      opacity: 0.9,
      dashArray: "8,8"
    }).addTo(map);

    L.marker(nagpur).addTo(map).bindPopup("Nagpur");
    L.marker(pune).addTo(map).bindPopup("Pune");

    map.fitBounds(line.getBounds(), { padding: [40, 40] });
  }

  if (typeof L !== "undefined") {
    initMap();
  } else {
    window.addEventListener("load", initMap);
  }

  // ----- Gallery: load from photos/pune/ -----
  function loadGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    const base = (typeof CONFIG !== "undefined" && CONFIG.photos && CONFIG.photos.pune)
      ? CONFIG.photos.pune
      : "photos/pune/";
    const images = (typeof CONFIG !== "undefined" && CONFIG.galleryImages && CONFIG.galleryImages.length)
      ? CONFIG.galleryImages
      : ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"];

    images.forEach(function (name) {
      const img = new Image();
      const src = base + name;
      img.onload = function () {
        const div = document.createElement("div");
        div.className = "gallery-item";
        img.alt = "Memory";
        div.appendChild(img);
        grid.appendChild(div);
      };
      img.onerror = function () { /* skip missing */ };
      img.src = src;
    });

    // If no images defined or none load, show placeholder
    setTimeout(function () {
      if (grid.children.length === 0) {
        const placeholder = document.createElement("div");
        placeholder.className = "photo-placeholder";
        placeholder.style.gridColumn = "1 / -1";
        placeholder.innerHTML = "Add photos to <strong>photos/pune/</strong> (e.g. 1.jpg, 2.jpg)";
        grid.appendChild(placeholder);
      }
    }, 500);
  }
  loadGallery();

  // ----- College photo -----
  function loadCollegePhoto() {
    const placeholder = document.querySelector(".commit-photo");
    if (!placeholder) return;
    const src = (typeof CONFIG !== "undefined" && CONFIG.photos && CONFIG.photos.college)
      ? CONFIG.photos.college
      : "photos/college.jpg";
    const img = new Image();
    img.onload = function () {
      placeholder.innerHTML = "";
      placeholder.appendChild(img);
    };
    img.alt = "College";
    img.src = src;
  }
  loadCollegePhoto();
})();
