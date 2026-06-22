const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const year = document.querySelector("#year");
const resumeViewBtn = document.querySelector(".resume-view-btn");
const resumeModal = document.querySelector("#resumeModal");
const resumeFrame = document.querySelector(".resume-preview");
const resumeCloseControls = document.querySelectorAll("[data-close-resume]");
const canvas = document.querySelector("#heroCanvas");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  const linkFile = link.getAttribute("href");
  const currentFile = window.location.pathname.split("/").pop() || "index.html";

  link.classList.toggle("active", linkFile === currentFile);

  link.addEventListener("click", () => {
    siteNav?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

function openResumeModal() {
  if (!resumeViewBtn || !resumeModal || !resumeFrame) return;

  resumeFrame.setAttribute("src", resumeViewBtn.dataset.resume);
  resumeModal.classList.add("open");
  resumeModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeResumeModal() {
  if (!resumeViewBtn || !resumeModal || !resumeFrame) return;

  resumeModal.classList.remove("open");
  resumeModal.setAttribute("aria-hidden", "true");
  resumeFrame.removeAttribute("src");
  document.body.style.overflow = "";
  resumeViewBtn.focus();
}

resumeViewBtn?.addEventListener("click", openResumeModal);

resumeCloseControls.forEach((control) => {
  control.addEventListener("click", closeResumeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && resumeModal?.classList.contains("open")) {
    closeResumeModal();
  }
});

if (canvas) {
  const ctx = canvas.getContext("2d");
  let points = [];

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(canvas.offsetWidth * ratio);
    canvas.height = Math.floor(canvas.offsetHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    createPoints();
  }

  function createPoints() {
    const count = Math.max(38, Math.floor(canvas.offsetWidth / 24));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34,
      r: Math.random() * 2.4 + 1.1
    }));
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    points.forEach((point, index) => {
      point.x += point.vx;
      point.y += point.vy;

      if (point.x < 0 || point.x > canvas.offsetWidth) point.vx *= -1;
      if (point.y < 0 || point.y > canvas.offsetHeight) point.vy *= -1;

      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      ctx.fillStyle = index % 3 === 0 ? "rgba(255, 112, 127, 0.62)" : "rgba(56, 214, 201, 0.54)";
      ctx.fill();

      for (let next = index + 1; next < points.length; next += 1) {
        const other = points[next];
        const distance = Math.hypot(point.x - other.x, point.y - other.y);

        if (distance < 135) {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(232, 240, 255, ${0.12 - distance / 1600})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(drawNetwork);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  drawNetwork();
}
