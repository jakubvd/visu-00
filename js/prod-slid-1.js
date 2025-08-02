document.addEventListener("DOMContentLoaded", function () {
    // Main slider wrapper (match your CMS collection wrapper)
    const sliderWrap = document.querySelector(".home-products_slider-wrap.w-dyn-items");
    if (!sliderWrap) return;

    // Arrow navigation (Webflow Link Blocks with IDs)
    const leftArrow = document.getElementById("p-b-s-a-left");
    const rightArrow = document.getElementById("p-b-s-a-right");

    // Get all cards in the slider (refreshes each time for accuracy)
    function getCards() {
        return sliderWrap.querySelectorAll(".home-products_slider-card");
    }
    let cards = getCards();

    // Core slider state
    const swipeThreshold = 10;  // Minimum px to trigger swipe
    let currentIndex = 0;       // Index of currently active card
    let cardWidth = 0;          // Width of a single card
    let isDragging = false;     // Is swipe active?
    let startX = 0;             // Start X position of swipe
    let startY = 0;             // Start Y position of swipe
    let prevTranslate = 0;      // Previous translate value
    let currentTranslate = 0;   // Current translate during swipe
    let isArrowClick = false;   // Track if navigation was from arrow

    // Utility: get card width (assumes all cards same width)
    function getCardWidth() {
        cards = getCards(); // Update cards in case DOM changed
        return cards[0] ? cards[0].offsetWidth : 0;
    }

    // Enable or disable arrows based on current position
    function updateArrows() {
        const maxIndex = getCards().length - 1;
        if (leftArrow) {
            if (currentIndex === 0) {
                leftArrow.classList.add("is-disabled");
            } else {
                leftArrow.classList.remove("is-disabled");
            }
        }
        if (rightArrow) {
            if (currentIndex === maxIndex) {
                rightArrow.classList.add("is-disabled");
            } else {
                rightArrow.classList.remove("is-disabled");
            }
        }
    }

    // Move the slider to next/previous card (direction: 'left' = next, 'right' = previous)
    function moveSlider(direction) {
        cards = getCards();
        const maxIndex = cards.length - 1;
        if (direction === "left" && currentIndex < maxIndex) {
            currentIndex++;
        } else if (direction === "right" && currentIndex > 0) {
            currentIndex--;
        }
        // Use linear for both swipe and arrow (arrow just slightly slower)
        sliderWrap.style.transition = isArrowClick
            ? "transform 0.5s ease-out" // Arrow click: slightly slower
            : "transform 0.4s ease-out"; // Swipe: slightly faster
        isArrowClick = false; // Reset trigger

        // Move slider to the correct position
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        prevTranslate = -currentIndex * cardWidth;
        updateArrows();
    }

    // Handle start of swipe/drag
    function handleStart(e) {
        isDragging = true;
        startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        startY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
        sliderWrap.style.transition = "none"; // No animation during swipe
    }

    // Handle movement during swipe/drag
    function handleMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        const currentY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;

        // If dragging more vertically, cancel swipe
        const diffX = currentX - startX;
        const diffY = currentY - startY;
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isDragging = false;
            return;
        }

        currentTranslate = prevTranslate + diffX;

        // Boundaries: no sliding past first/last card
        const maxTranslate = -(getCards().length - 1) * cardWidth;
        const minTranslate = 0;
        currentTranslate = Math.max(Math.min(currentTranslate, minTranslate), maxTranslate);

        sliderWrap.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Handle end of swipe/drag (now fixed: no double transition!)
    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.type.includes("mouse") ? e.clientX : e.changedTouches[0].clientX;
        const diffX = endX - startX;

        // Only animate here if NOT triggering slide change:
        if (diffX < -swipeThreshold) {
            moveSlider("left");   // moveSlider handles transition & transform
        } else if (diffX > swipeThreshold) {
            moveSlider("right");  // moveSlider handles transition & transform
        } else {
            // Not enough movement: snap back to current card
            sliderWrap.style.transition = "transform 0.1s ease-out";
            sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        }
    }

    // Handle window resize: re-calculate card width and adjust slider position
    function handleResize() {
        cardWidth = getCardWidth();
        prevTranslate = -currentIndex * cardWidth;
        sliderWrap.style.transform = `translateX(${prevTranslate}px)`;
        sliderWrap.style.transition = "none";
    }

    // Bind all necessary event listeners
    function addEventListeners() {
        // Mouse
        sliderWrap.addEventListener("mousedown", handleStart);
        sliderWrap.addEventListener("mousemove", handleMove);
        sliderWrap.addEventListener("mouseup", handleEnd);
        sliderWrap.addEventListener("mouseleave", handleEnd);
        // Touch
        sliderWrap.addEventListener("touchstart", handleStart);
        sliderWrap.addEventListener("touchmove", handleMove);
        sliderWrap.addEventListener("touchend", handleEnd);
        // Window
        window.addEventListener("resize", handleResize);

        // Arrows (prevent default link action!)
        if (leftArrow) leftArrow.addEventListener("click", function (event) {
            event.preventDefault();
            if (!leftArrow.classList.contains("is-disabled")) {
                isArrowClick = true; // Mark arrow trigger
                moveSlider("right");
            }
        });
        if (rightArrow) rightArrow.addEventListener("click", function (event) {
            event.preventDefault();
            if (!rightArrow.classList.contains("is-disabled")) {
                isArrowClick = true;
                moveSlider("left");
            }
        });
    }

    // Initialize slider: set up, bind listeners, update state
    function initSlider() {
        cardWidth = getCardWidth();
        sliderWrap.style.transform = `translateX(0)`;
        sliderWrap.style.transition = "none";
        addEventListeners();
        updateArrows();
    }

    // Start!
    initSlider();
});
