import "./stylesheets/main.scss";

// Show floating button when scrolling down.
let floatingButton = document.getElementsByClassName("floating-dock")[0];
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    floatingButton.style.display = "block";
  } else {
    floatingButton.style.display = "none";
  }
}

// Add eventlisteners for contact-me images.
const imgLinks = document.getElementsByClassName("copy-paste__links")[0];
if (imgLinks) {
  for (var i = 0; i < imgLinks.childElementCount; i++) {
    var img = imgLinks.getElementsByTagName("img")[i];

    img.addEventListener("click", copyLinkFromImg);

    img.addEventListener("mouseout", function () {
      var tooltip = document.getElementById("myTooltip");
      if (tooltip) tooltip.innerHTML = "Copy to clipboard";
    });
  }
}

// Copy contact details from img to clipboard
function copyLinkFromImg() {
  var imgDesc = this.getAttribute("longdesc");

  var dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.setAttribute("id", "dummy_id");
  document.getElementById("dummy_id").value = imgDesc;
  dummy.select();
  document.execCommand("copy");

  for (var i = 0; i < imgLinks.childElementCount; i++) {
    var img = imgLinks.getElementsByTagName("img")[i];
    var toolTip = img.previousElementSibling;

    if (img === this && toolTip) toolTip.innerHTML = "Copied to clipboard.";
  }

  document.body.removeChild(dummy);
}

// Scroll to each section of the page
const scrollButtons = document.querySelectorAll(".btnNextSection");
scrollButtons.forEach((button) =>
  button.addEventListener("click", function (event) {
    event.preventDefault();

    const targetSelector = this.dataset.target || this.getAttribute("data");
    const targetSection = document.querySelector(targetSelector);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }),
);

// --- INITIALIZE CAROUSEL AND MODAL COMPONENTS ON RUNTIME ---
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. MAIN CAROUSEL LOGIC (CARD-TO-CARD SLIDER)
  // ==========================================
  const track = document.querySelector(".projects__track");
  const nextButton = document.querySelector(".carousel-button.next");
  const prevButton = document.querySelector(".carousel-button.prev");
  const indicatorsContainer = document.querySelector(".carousel-indicators");

  if (track && nextButton && prevButton && indicatorsContainer) {
    const cards = Array.from(track.children);
    const indicators = Array.from(indicatorsContainer.children);
    let currentIndex = 0;

    const moveToSlide = (index) => {
      if (index < 0) index = 0;
      if (index >= cards.length) index = cards.length - 1;

      currentIndex = index;

      // Translate track horizontally based on current card percentage
      track.style.transform = `translateX(${-100 * currentIndex}%)`;

      // Update Pagination Indicator Active States
      indicators.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });

      // UX Optimization: Fade out nav buttons at extreme positions
      prevButton.style.opacity = currentIndex === 0 ? "0.3" : "1";
      prevButton.style.pointerEvents = currentIndex === 0 ? "none" : "auto";

      nextButton.style.opacity =
        currentIndex === cards.length - 1 ? "0.3" : "1";
      nextButton.style.pointerEvents =
        currentIndex === cards.length - 1 ? "none" : "auto";
    };

    // Click Handlers
    nextButton.addEventListener("click", () => {
      if (currentIndex < cards.length - 1) moveToSlide(currentIndex + 1);
    });

    prevButton.addEventListener("click", () => {
      if (currentIndex > 0) moveToSlide(currentIndex - 1);
    });

    indicatorsContainer.addEventListener("click", (e) => {
      const targetDot = e.target.closest(".indicator");
      if (!targetDot) return;
      moveToSlide(indicators.indexOf(targetDot));
    });

    // Mobile Outer Swipe Support (Left/Right Card Dragging)
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

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
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0 && currentIndex < cards.length - 1) {
            moveToSlide(currentIndex + 1); // Swiped Left
          } else if (diff < 0 && currentIndex > 0) {
            moveToSlide(currentIndex - 1); // Swiped Right
          }
        }
      },
      { passive: true },
    );

    // Enforce initial starting position context
    moveToSlide(0);
  }

  // ==========================================
  // 2. MOBILE-FIRST ZOOM MODAL LAYER LOGIC
  // ==========================================
  const modal = document.createElement("div");
  modal.className = "gallery-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <button class="gallery-modal__close" aria-label="Close zoomed image">
      <svg viewBox="0 0 24 24">
        <!-- Background circle: Transparent inside JS; filled using SASS variable colors -->
        <circle cx="12" cy="12" r="10"/>
        <!-- Cross lines: Styled cleanly with uniform caps -->
        <path fill="none" stroke-width="2.5" stroke-linecap="round" d="M8 8l8 8M16 8l-8 8"/>
      </svg>
    </button>
    <img class="gallery-modal__content" src="" alt="Zoomed preview" />
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector(".gallery-modal__content");
  const closeModalBtn = modal.querySelector(".gallery-modal__close");

  // Catch clicks bubble-up from inner nested photo tracks
  document.querySelectorAll(".card__gallery").forEach((gallery) => {
    gallery.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG") {
        modalImg.src = e.target.src;
        modalImg.alt = e.target.alt;
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        // Prevent system background scrolling behavior on main document layers
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
      }
    });
  });

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
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const galleries = document.querySelectorAll(".card__gallery");
  const modal = document.querySelector(".gallery-modal");
  const modalImg = document.querySelector(".gallery-modal__content");

  galleries.forEach((gallery) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Coordinates to track click vs. drag
    let mouseDownX = 0;
    let mouseDownY = 0;

    gallery.querySelectorAll("img").forEach((img) => {
      // Prevent browser default ghost-image drag behavior
      img.addEventListener("dragstart", (e) => e.preventDefault());

      // Zoom Modal Trigger (strictly on image click)
      img.addEventListener("click", (e) => {
        const deltaX = Math.abs(e.pageX - mouseDownX);
        const deltaY = Math.abs(e.pageY - mouseDownY);

        // If the user dragged more than 5px, it's a swipe. Cancel the zoom.
        if (deltaX > 5 || deltaY > 5) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // Genuine click: open the zoom modal
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.classList.add("active");
      });
    });

    gallery.addEventListener("mousedown", (e) => {
      isDown = true;
      gallery.classList.add("active-drag");

      // Store initial click positions
      mouseDownX = e.pageX;
      mouseDownY = e.pageY;

      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;

      gallery.style.scrollSnapType = "none";
      gallery.style.scrollBehavior = "auto";
    });

    gallery.addEventListener("mouseleave", () => {
      if (!isDown) return;
      isDown = false;
      gallery.style.scrollSnapType = "x mandatory";
    });

    gallery.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;
      gallery.style.scrollSnapType = "x mandatory";
      gallery.style.scrollBehavior = "smooth";
    });

    gallery.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - gallery.offsetLeft;
      const walk = (x - startX) * 1.5;
      gallery.scrollLeft = scrollLeft - walk;
    });

    gallery.addEventListener(
      "pointerdown",
      (e) => {
        e.stopPropagation();
      },
      { passive: true },
    );

    gallery.addEventListener(
      "pointermove",
      (e) => {
        e.stopPropagation();
      },
      { passive: true },
    );

    gallery.addEventListener(
      "pointerup",
      (e) => {
        e.stopPropagation();
      },
      { passive: true },
    );
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const maskContainer = document.querySelector(".cards");
  const track = document.querySelector(".cards__track");
  const prevButton = document.querySelector(".carousel-button.prev");
  const nextButton = document.querySelector(".carousel-button.next");
  const cards = document.querySelectorAll(".card");

  if (!track || !prevButton || !nextButton || cards.length === 0) return;

  let currentIndex = 0;
  let isCarouselEnabled = true;

  // Dragging / Swiping State Variables
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  // Evaluates layout sizes to determine if the track overflows the viewing viewport mask
  function evaluateCarouselState() {
    if (!maskContainer || !track) return;

    // Temporarily clear inline styles to get natural architectural measurements
    track.style.transform = "none";

    const isOverflowing = track.scrollWidth > maskContainer.clientWidth;

    if (!isOverflowing) {
      isCarouselEnabled = false;
      currentIndex = 0;
      prevTranslate = 0;
      currentTranslate = 0;

      prevButton.style.display = "none";
      nextButton.style.display = "none";
      if (maskContainer) maskContainer.classList.add("carousel-disabled");
    } else {
      isCarouselEnabled = true;
      prevButton.style.display = "";
      nextButton.style.display = "";
      if (maskContainer) maskContainer.classList.remove("carousel-disabled");
      updateSliderPosition();
    }
  }

  // Calculate the shift amount dynamically based on layout styles
  function getShiftAmount() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const computedStyle = window.getComputedStyle(track);
    const gap = parseFloat(computedStyle.gap) || 0;
    return cardWidth + gap;
  }

  function getMaxIndex() {
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    return isTablet ? cards.length - 2 : cards.length - 1;
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

  // Button Listeners
  nextButton.addEventListener("click", () => {
    if (!isCarouselEnabled) return;
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateSliderPosition();
  });

  prevButton.addEventListener("click", () => {
    if (!isCarouselEnabled) return;
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = getMaxIndex();
    }
    updateSliderPosition();
  });

  // DRAG & SWIPE LOGIC

  // 1. Pointer Down (Touch start / Click start)
  track.addEventListener("pointerdown", (e) => {
    if (!isCarouselEnabled || e.target.closest("summary")) {
      return;
    }

    isDragging = true;
    startX = e.clientX;

    track.style.transition = "none";
    track.setPointerCapture(e.pointerId);
  });

  // 2. Pointer Move (Dragging)
  track.addEventListener("pointermove", (e) => {
    if (!isDragging || !isCarouselEnabled) return;

    if (window.innerWidth < 768) return;

    const currentX = e.clientX;
    const diffX = currentX - startX;

    currentTranslate = prevTranslate + diffX;
    track.style.transform = `translateX(${currentTranslate}px)`;
  });

  // 3. Pointer Up (Release finger / mouse)
  track.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.releasePointerCapture(e.pointerId);

    track.style.transition =
      "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    if (window.innerWidth < 768 || !isCarouselEnabled) {
      return;
    }

    const movedBy = currentTranslate - prevTranslate;
    const swipeThreshold = 50;

    if (movedBy < -swipeThreshold && currentIndex < getMaxIndex()) {
      currentIndex++;
    } else if (movedBy > swipeThreshold && currentIndex > 0) {
      currentIndex--;
    }

    updateSliderPosition();
  });

  // Handle fallback cancellations (e.g., cursor leaves window midway)
  track.addEventListener("pointercancel", () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition =
      "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    updateSliderPosition();
  });

  // Initial runtime verification execution
  evaluateCarouselState();

  // Resize window observer
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      evaluateCarouselState();
    }, 100);
  });
});
