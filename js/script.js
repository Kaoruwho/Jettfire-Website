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

let currentHeroImage = 0;

if (heroImageSlides.length > 1) {
  setInterval(() => {
    heroImageSlides[currentHeroImage].classList.remove("active");

    currentHeroImage =
      (currentHeroImage + 1) % heroImageSlides.length;

    heroImageSlides[currentHeroImage].classList.add("active");
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

  /* Display selected image */
  function showImage(index) {
    currentIndex = (index + projects.length) % projects.length;

    const project = projects[currentIndex];
    const image = project.querySelector("img");

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;

    lightboxTitle.textContent = project.dataset.title || "";
    lightboxCategory.textContent = project.dataset.category || "";

    lightboxCounter.textContent =
      `${currentIndex + 1} / ${projects.length}`;
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
  projects.forEach((project, index) => {
    project.addEventListener("click", () => {
      openLightbox(index);
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

const quoteForm = document.getElementById("quoteForm");
const formStatus = document.getElementById("formStatus");

if (quoteForm && formStatus) {
  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = quoteForm.querySelector(
      'button[type="submit"]'
    );

    // Prevent duplicate submissions
    submitButton.disabled = true;
    submitButton.textContent = "Sending request...";

    formStatus.textContent = "";
    formStatus.className = "form-status";

    try {
      const response = await fetch(quoteForm.action, {
        method: "POST",
        body: new FormData(quoteForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        formStatus.textContent =
          "Your quotation request has been sent successfully! " +
          "Our team will review your inquiry.";

        formStatus.classList.add("success");

        quoteForm.reset();
      } else {
        throw new Error("Form submission failed.");
      }

    } catch (error) {
      formStatus.textContent =
        "We couldn't send your request right now. " +
        "Please try again or email us directly at " +
        "jettfireprinting@gmail.com.";

      formStatus.classList.add("error");

      console.error("Formspree error:", error);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML =
        'Send Quotation Request <span>↗</span>';
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