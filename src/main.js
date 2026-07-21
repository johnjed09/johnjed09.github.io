import "./stylesheets/main.scss";

/* ==========================================================================
   1. FLOATING NAVIGATION DOCK
   ========================================================================== */
const floatingButton = document.querySelector(".floating-dock");

if (floatingButton) {
  window.addEventListener("scroll", () => {
    const isScrolled =
      document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
    floatingButton.style.display = isScrolled ? "block" : "none";
  });
}

/* ==========================================================================
   2. SMOOTH SCROLL BUTTONS
   ========================================================================== */
document.querySelectorAll(".btnNextSection").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const targetSection = document.querySelector(button.dataset.target);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ==========================================================================
   3. DOM-DEPENDENT INITIALIZATIONS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initContactCopyLinks();
  initMainCarousel();
  initGalleryModalAndDrag();
  initCardsTrackCarousel();
});

/* --------------------------------------------------------------------------
   Contact Links Tooltip & Copy Logic
   -------------------------------------------------------------------------- */
function initContactCopyLinks() {
  const linksContainer = document.querySelector(".copy-paste__links");
  if (!linksContainer) return;

  linksContainer.addEventListener("click", async (e) => {
    const card = e.target.closest("[data-copy-value], a.contact-card");
    if (!card) return;

    const tooltipText = card.closest(".tooltip")?.querySelector(".tooltiptext");
    const copyValue = card.getAttribute("data-copy-value");

    if (copyValue) {
      try {
        await navigator.clipboard.writeText(copyValue);
        if (tooltipText) tooltipText.textContent = "Copied to clipboard!";
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
      return;
    }

    if (card.tagName === "A" && card.hasAttribute("href") && tooltipText) {
      tooltipText.textContent = "Opening link...";
    }
  });

  linksContainer.querySelectorAll(".tooltip").forEach((tooltip) => {
    tooltip.addEventListener("mouseleave", () => {
      const tooltipText = tooltip.querySelector(".tooltiptext");
      if (!tooltipText) return;

      if (tooltip.querySelector("[data-copy-value]")) {
        tooltipText.textContent = "Copy to clipboard";
      } else if (tooltip.querySelector("a.contact-card")) {
        tooltipText.textContent = "Open in new tab";
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Main Project Carousel
   -------------------------------------------------------------------------- */
function initMainCarousel() {
  const track = document.querySelector(".projects__track");
  const nextButton = document.querySelector(".carousel-button.next");
  const prevButton = document.querySelector(".carousel-button.prev");
  const indicatorsContainer = document.querySelector(".carousel-indicators");

  if (!track || !nextButton || !prevButton || !indicatorsContainer) return;

  const cards = Array.from(track.children);
  const indicators = Array.from(indicatorsContainer.children);
  let currentIndex = 0;

  const moveToSlide = (index) => {
    currentIndex = Math.max(0, Math.min(index, cards.length - 1));
    track.style.transform = `translateX(${-100 * currentIndex}%)`;

    indicators.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });

    const isFirst = currentIndex === 0;
    prevButton.style.opacity = isFirst ? "0.3" : "1";
    prevButton.style.pointerEvents = isFirst ? "none" : "auto";

    const isLast = currentIndex === cards.length - 1;
    nextButton.style.opacity = isLast ? "0.3" : "1";
    nextButton.style.pointerEvents = isLast ? "none" : "auto";
  };

  nextButton.addEventListener("click", () => {
    if (currentIndex < cards.length - 1) moveToSlide(currentIndex + 1);
  });

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) moveToSlide(currentIndex - 1);
  });

  indicatorsContainer.addEventListener("click", (e) => {
    const targetDot = e.target.closest(".indicator");
    if (targetDot) moveToSlide(indicators.indexOf(targetDot));
  });

  let touchStartX = 0;

  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  track.addEventListener(
    "touchend",
    (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < cards.length - 1)
          moveToSlide(currentIndex + 1);
        else if (diff < 0 && currentIndex > 0) moveToSlide(currentIndex - 1);
      }
    },
    { passive: true },
  );

  moveToSlide(0);
}

/* --------------------------------------------------------------------------
   Image Zoom Modal & Gallery Dragging
   -------------------------------------------------------------------------- */
function initGalleryModalAndDrag() {
  const modal = document.createElement("div");
  modal.className = "gallery-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <button class="gallery-modal__close" aria-label="Close zoomed image">
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <path fill="none" stroke-width="2.5" stroke-linecap="round" d="M8 8l8 8M16 8l-8 8"/>
      </svg>
    </button>
    <img class="gallery-modal__content" src="" alt="Zoomed preview" />
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector(".gallery-modal__content");
  const closeModalBtn = modal.querySelector(".gallery-modal__close");

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    setTimeout(() => {
      modalImg.src = "";
    }, 250);
  };

  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });

  document.querySelectorAll(".card__gallery").forEach((gallery) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let mouseDownX = 0;
    let mouseDownY = 0;

    gallery.querySelectorAll("img").forEach((img) => {
      img.addEventListener("dragstart", (e) => e.preventDefault());

      img.addEventListener("click", (e) => {
        const deltaX = Math.abs(e.pageX - mouseDownX);
        const deltaY = Math.abs(e.pageY - mouseDownY);

        if (deltaX > 5 || deltaY > 5) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
      });
    });

    gallery.addEventListener("mousedown", (e) => {
      isDown = true;
      gallery.classList.add("active-drag");
      mouseDownX = e.pageX;
      mouseDownY = e.pageY;
      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
      gallery.style.scrollSnapType = "none";
      gallery.style.scrollBehavior = "auto";
    });

    const resetDragState = () => {
      if (!isDown) return;
      isDown = false;
      gallery.classList.remove("active-drag");
      gallery.style.scrollSnapType = "x mandatory";
      gallery.style.scrollBehavior = "smooth";
    };

    gallery.addEventListener("mouseleave", resetDragState);
    gallery.addEventListener("mouseup", resetDragState);

    gallery.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - gallery.offsetLeft;
      gallery.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    ["pointerdown", "pointermove", "pointerup"].forEach((evt) => {
      gallery.addEventListener(evt, (e) => e.stopPropagation(), {
        passive: true,
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Responsive Cards Track Carousel
   -------------------------------------------------------------------------- */
function initCardsTrackCarousel() {
  const maskContainer = document.querySelector(".cards");
  const track = document.querySelector(".cards__track");
  const prevButton = document.querySelector(".carousel-button.prev");
  const nextButton = document.querySelector(".carousel-button.next");
  const cards = document.querySelectorAll(".card");

  if (
    !track ||
    !prevButton ||
    !nextButton ||
    !maskContainer ||
    cards.length === 0
  )
    return;

  let currentIndex = 0;
  let isCarouselEnabled = true;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  function evaluateCarouselState() {
    track.style.transform = "none";
    const isOverflowing = track.scrollWidth > maskContainer.clientWidth;

    if (!isOverflowing) {
      isCarouselEnabled = false;
      currentIndex = 0;
      prevTranslate = 0;
      currentTranslate = 0;
      prevButton.style.display = "none";
      nextButton.style.display = "none";
      maskContainer.classList.add("carousel-disabled");
    } else {
      isCarouselEnabled = true;
      prevButton.style.display = "";
      nextButton.style.display = "";
      maskContainer.classList.remove("carousel-disabled");
      updateSliderPosition();
    }
  }

  function getShiftAmount() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    return cardWidth + gap;
  }

  function getMaxIndex() {
    return window.innerWidth >= 768 && window.innerWidth < 1024
      ? cards.length - 2
      : cards.length - 1;
  }

  function updateSliderPosition() {
    if (!isCarouselEnabled) {
      track.style.transform = "none";
      return;
    }
    currentTranslate = -currentIndex * getShiftAmount();
    prevTranslate = currentTranslate;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  nextButton.addEventListener("click", () => {
    if (!isCarouselEnabled) return;
    currentIndex = currentIndex < getMaxIndex() ? currentIndex + 1 : 0;
    updateSliderPosition();
  });

  prevButton.addEventListener("click", () => {
    if (!isCarouselEnabled) return;
    currentIndex = currentIndex > 0 ? currentIndex - 1 : getMaxIndex();
    updateSliderPosition();
  });

  track.addEventListener("pointerdown", (e) => {
    if (!isCarouselEnabled || e.target.closest("summary")) return;
    isDragging = true;
    startX = e.clientX;
    track.style.transition = "none";
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener("pointermove", (e) => {
    if (!isDragging || !isCarouselEnabled || window.innerWidth < 768) return;
    currentTranslate = prevTranslate + (e.clientX - startX);
    track.style.transform = `translateX(${currentTranslate}px)`;
  });

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.releasePointerCapture(e.pointerId);
    track.style.transition =
      "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    if (window.innerWidth >= 768 && isCarouselEnabled) {
      const movedBy = currentTranslate - prevTranslate;
      if (movedBy < -50 && currentIndex < getMaxIndex()) currentIndex++;
      else if (movedBy > 50 && currentIndex > 0) currentIndex--;
    }

    updateSliderPosition();
  };

  track.addEventListener("pointerup", handlePointerUp);
  track.addEventListener("pointercancel", () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition =
      "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    updateSliderPosition();
  });

  evaluateCarouselState();

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(evaluateCarouselState, 100);
  });
}
