const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.navlinks');
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.textContent = open ? '×' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    }));

/* RIGHT-SIDE HERO IMAGE SLIDESHOW */

const heroImageSlides = document.querySelectorAll(
  ".hero-image-slide"
);

const heroProgressBars = document.querySelectorAll(
  ".hero-progress__bar"
);

const heroProgressCounter = document.querySelector(
  ".hero-progress__counter"
);

let currentHeroImage = 0;

function updateHeroProgress(index) {
  heroProgressBars.forEach((bar, barIndex) => {
    bar.classList.remove("is-active");

    if (barIndex === index) {
      // Restart the progress animation
      void bar.offsetWidth;
      bar.classList.add("is-active");
    }
  });

  if (heroProgressCounter) {
    const current = String(index + 1).padStart(2, "0");
    const total = String(heroImageSlides.length).padStart(2, "0");

    heroProgressCounter.textContent = `${current} / ${total}`;
  }
}

if (heroImageSlides.length > 1) {
  updateHeroProgress(currentHeroImage);

  setInterval(() => {
    heroImageSlides[currentHeroImage].classList.remove("active");

    currentHeroImage =
      (currentHeroImage + 1) % heroImageSlides.length;

    heroImageSlides[currentHeroImage].classList.add("active");

    updateHeroProgress(currentHeroImage);
  }, 3500);
}

/* =====================================
   JETTFIRE PORTFOLIO LIGHTBOX
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const projects = document.querySelectorAll(
    ".portfolio-grid .project"
  );

  const lightbox = document.getElementById("portfolioLightbox");

  if (!lightbox || projects.length === 0) {
    console.warn("Portfolio lightbox elements not found.");
    return;
  }

  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCategory = document.getElementById("lightboxCategory");
  const lightboxCounter = document.getElementById("lightboxCounter");

  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  let currentIndex = 0;
  let previousFocus = null;

  function getVisibleProjects() {
    return Array.from(projects).filter(
      (project) => !project.hidden
    );
  }

  /* Display selected image */
  function showImage(index) {
    const visibleProjects = getVisibleProjects();

    if (visibleProjects.length === 0) return;

    currentIndex =
      (index + visibleProjects.length) % visibleProjects.length;

    const project = visibleProjects[currentIndex];
    const image = project.querySelector("img");

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;

    lightboxTitle.textContent = project.dataset.title || "";
    lightboxCategory.textContent = project.dataset.category || "";

    lightboxCounter.textContent =
      `${currentIndex + 1} / ${visibleProjects.length}`;
  }

  /* Open lightbox */
  function openLightbox(index) {
    previousFocus = document.activeElement;
    showImage(index);

    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeBtn.focus();
  }

  /* Close lightbox */
  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (previousFocus) previousFocus.focus();
  }

  /* Click portfolio images */
  projects.forEach((project) => {
    project.addEventListener("click", () => {
      const visibleProjects = getVisibleProjects();
      const index = visibleProjects.indexOf(project);

      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  /* Navigation controls */
  closeBtn.addEventListener("click", closeLightbox);

  prevBtn.addEventListener("click", () => {
    showImage(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    showImage(currentIndex + 1);
  });

  /* Click outside image to close */
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  /* Keyboard navigation */
  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      showImage(currentIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    }

    if (event.key === "Tab") {
      const controls = [closeBtn, prevBtn, nextBtn];
      const index = controls.indexOf(document.activeElement);

      event.preventDefault();

      const nextIndex = event.shiftKey
        ? (index <= 0 ? controls.length - 1 : index - 1)
        : (index + 1) % controls.length;

      controls[nextIndex].focus();
    }
  });

});

/* =====================================
   PORTFOLIO CATEGORY FILTERING
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(
    ".portfolio-filter"
  );

  const projects = document.querySelectorAll(
    ".portfolio-grid .project"
  );

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((filterButton) => {
        const active = filterButton === button;

        filterButton.classList.toggle("is-active", active);
        filterButton.setAttribute("aria-pressed", String(active));
      });

      projects.forEach((project) => {
        const matches =
          selectedFilter === "all" ||
          project.dataset.group === selectedFilter;

        project.hidden = !matches;
      });

      const portfolioGrid = document.querySelector(".portfolio-grid");
      if (portfolioGrid) {
        const isFiltered = selectedFilter !== "all";

        portfolioGrid.classList.toggle("is-filtered", isFiltered);

        projects.forEach((project) => {
          project.classList.remove("is-filter-feature");
        });

        if (isFiltered) {
          const firstVisibleProject = Array.from(projects).find(
            (project) => !project.hidden
          );

          if (firstVisibleProject) {
            firstVisibleProject.classList.add("is-filter-feature");
          }
        }
      }
    });
  });
});

/* =====================================
   JETTFIRE QUOTATION FORM - WEB3FORMS
===================================== */

const quoteForm = document.getElementById("quoteForm");

if (quoteForm) {
  const submitButton = quoteForm.querySelector(
    'button[type="submit"]'
  );

  const statusElement =
    quoteForm.querySelector(".form-status") ||
    document.getElementById("formStatus");

  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!quoteForm.reportValidity()) return;

    submitButton.disabled = true;

    if (statusElement) {
      statusElement.textContent = "Sending your quotation request...";
    }

    try {
      const response = await fetch(quoteForm.action, {
        method: "POST",
        body: new FormData(quoteForm),
        headers: {
          Accept: "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Submission failed");
      }

      if (statusElement) {
        statusElement.textContent =
          "Thank you! Your quotation request has been sent successfully.";
      }

      quoteForm.reset();

    } catch (error) {
      console.error("Web3Forms submission error:", error);

      if (statusElement) {
        statusElement.textContent =
          "Unable to send your request. Please try again.";
      }

    } finally {
      submitButton.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {

  const contactSection = document.querySelector("#contact");
  const mobileQuote = document.querySelector(".mobile-quote");

  if (!contactSection || !mobileQuote) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const isContactVisible = entries[0].isIntersecting;

      mobileQuote.classList.toggle(
        "quote-hidden",
        isContactVisible
      );
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "0px 0px -15% 0px"
    }
  );

  observer.observe(contactSection);

});

/* =====================================
   AUTO-SELECT SERVICE FOR QUOTATION
===================================== */

document.querySelectorAll(".service-card[data-service]")
  .forEach(card => {

    card.addEventListener("click", () => {

      const selectedService = card.dataset.service;
      const serviceDropdown = document.getElementById("service");

      if (!serviceDropdown) return;

      serviceDropdown.value = selectedService;

      serviceDropdown.dispatchEvent(
        new Event("change", { bubbles: true })
      );

    });

  });

  /* =====================================
   SCROLL REVEAL ANIMATIONS
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

  const selectors = [
    ".services .section-head",
    ".service-grid .service-card",
    ".portfolio .section-head",
    ".portfolio-grid .project",
    ".clients-heading",
    ".client-logo-grid .client-logo",
    ".contact-copy",
    ".quote-form"
  ];

  const elements = document.querySelectorAll(
    selectors.join(", ")
  );

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  elements.forEach((element) => {
    element.classList.add("js-reveal");

    if (element.matches(".service-card, .project, .client-logo")) {
      const siblings = Array.from(element.parentElement.children);
      const index = siblings.indexOf(element);

      element.dataset.revealDelay = String(index % 4);
    }

    observer.observe(element);
  });
});

/* =====================================
   QUOTATION DEADLINE DATE
===================================== */

const deadlineInput = document.getElementById("deadline");

if (deadlineInput) {
  const today = new Date();
  const localDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  deadlineInput.min = localDate;
}