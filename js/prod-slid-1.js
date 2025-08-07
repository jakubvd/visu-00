document.addEventListener("DOMContentLoaded", function () {
    // Gap between cards is dynamically pulled from the CSS variable '--_ui-styles---stroke--gap--slider-products' (set in Webflow variable modes/UI).
    // Helper: get gap value from CSS variable, parsing units like px, rem etc.
    function getGap() {
        // We read the computed style of the slider wrapper to get the gap value dynamically.
        const sliderWrap = document.querySelector(".home-products_slider-wrap.w-dyn-items");
        if (!sliderWrap) return 0;
        const style = getComputedStyle(sliderWrap);
        let gapValue = style.getPropertyValue('--_ui-styles---stroke--gap--slider-products').trim();
        if (!gapValue) return 0;
        // Parse the gap value supporting px, rem, em etc.
        // Create a temporary element to parse the value correctly
        const tempEl = document.createElement('div');
        tempEl.style.width = gapValue;
        document.body.appendChild(tempEl);
        const pixels = tempEl.offsetWidth;
        document.body.removeChild(tempEl);
        return pixels;
    }

    // Main slider wrapper (match your CMS collection wrapper)
    const sliderWrap = document.querySelector(".home-products_slider-wrap.w-dyn-items");
    if (!sliderWrap) return;

    // Arrow navigation (Webflow Link Blocks with IDs)
    // Removed hardcoded leftArrow and rightArrow selectors

    // Get all cards in the slider (refreshes each time for accuracy)
    function getCards() {
        return sliderWrap.querySelectorAll(".home-products_slider-card");
    }
    let cards = getCards();

    // Core slider state
    const swipeThreshold = 10;  // Minimum px to trigger swipe
    let currentIndex = 0;       // Index of currently active card group (visible window)
    let cardWidth = 0;          // Width of a single card
    let gap = 0;                // Gap between cards, dynamically read from CSS variable
    let isDragging = false;     // Is swipe active?
    let startX = 0;             // Start X position of swipe
    let startY = 0;             // Start Y position of swipe
    let prevTranslate = 0;      // Previous translate value
    let currentTranslate = 0;   // Current translate during swipe
    let isArrowClick = false;   // Track if navigation was from arrow
    let visibleCardsCount = 1;  // How many cards are visible at once

    // Utility: get card width (assumes all cards same width)
    // Returns card width plus gap (except for last card in row)
    function getCardWidth() {
        cards = getCards(); // Update cards in case DOM changed
        if (!cards[0]) return 0;
        return cards[0].offsetWidth;
    }

    // Helper: count how many cards fit in the viewport at once
    function getVisibleCardsCount() {
        // Assumes the parent of sliderWrap is the viewport (with overflow:hidden)
        const sliderViewport = sliderWrap.parentElement;
        if (!sliderViewport) return 1;
        const viewportWidth = sliderViewport.offsetWidth;
        // Each card occupies cardWidth plus gap except last card
        // We calculate how many cards fit considering gap between cards
        // visibleCardsCount * cardWidth + (visibleCardsCount - 1) * gap <= viewportWidth
        // => visibleCardsCount <= (viewportWidth + gap) / (cardWidth + gap)
        if (cardWidth === 0) return 1;
        return Math.floor((viewportWidth + gap) / (cardWidth + gap)) || 1;
    }

    // Improved: Calculate the max slide index so that the last card is always fully visible (pixel-perfect, no dead zone)
    function getMaxIndex() {
        const sliderViewport = sliderWrap.parentElement;
        if (!sliderViewport) return 0;
        const viewportWidth = sliderViewport.offsetWidth;
        const totalCards = getCards().length;
        const totalCardsWidth = totalCards * cardWidth + (totalCards - 1) * gap;
        const maxTranslate = totalCardsWidth - viewportWidth;
        if (maxTranslate <= 0) return 0;

        // Instead of full card steps, calculate how many pixels you can scroll (so the last card is flush right)
        // This gives the most precise, pixel-perfect maxIndex for all breakpoints.
        return Math.max(0, Math.round(maxTranslate / (cardWidth + gap)));
    }

    // Enable or disable arrows based on current position
    // Now uses premium maxIndex calculation to ensure last card is fully visible before disabling right arrow
    function updateArrows() {
        cards = getCards();
        const maxIndex = getMaxIndex();
        // Update all arrows with data-slider-products-arrow attribute
        const arrows = document.querySelectorAll('[data-slider-products-arrow]');
        arrows.forEach(arrow => {
            if (arrow.classList.contains('is-disabled')) {
                arrow.classList.remove('is-disabled');
            }
        });

        // Disable prev/left arrows if at start
        if (currentIndex === 0) {
            arrows.forEach(arrow => {
                const dir = arrow.getAttribute('data-slider-products-arrow');
                if (dir === 'prev' || dir === 'left') {
                    arrow.classList.add('is-disabled');
                }
            });
        }
        // Disable next/right arrows if at max
        if (currentIndex >= maxIndex) {
            arrows.forEach(arrow => {
                const dir = arrow.getAttribute('data-slider-products-arrow');
                if (dir === 'next' || dir === 'right') {
                    arrow.classList.add('is-disabled');
                }
            });
        }
    }

    // Move the slider to next/previous group (direction: 'left' = next, 'right' = previous)
    // Uses premium maxIndex to prevent overscroll and blank spaces
    function moveSlider(direction) {
        cards = getCards();
        const maxIndex = getMaxIndex();
        if (direction === "left" && currentIndex < maxIndex) {
            currentIndex++;
        } else if (direction === "right" && currentIndex > 0) {
            currentIndex--;
        }
        // Clamp currentIndex so it cannot exceed maxIndex (prevents overscroll/blank)
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        // Use linear for both swipe and arrow (arrow just slightly slower)
        sliderWrap.style.transition = isArrowClick
            ? "transform 0.5s ease-out" // Arrow click: slightly slower
            : "transform 0.4s ease-out"; // Swipe: slightly faster
        isArrowClick = false; // Reset trigger

        // Move slider to the correct position
        // Each step moves cardWidth + gap pixels
        sliderWrap.style.transform = `translateX(${-currentIndex * (cardWidth + gap)}px)`;
        prevTranslate = -currentIndex * (cardWidth + gap);
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

        // Boundaries: no sliding past first/last visible group
        const maxTranslate = -((getCards().length - visibleCardsCount) * (cardWidth + gap));
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
            sliderWrap.style.transform = `translateX(${-currentIndex * (cardWidth + gap)}px)`;
        }
    }

    // Handle window resize: re-calculate card width, gap, visible count and adjust slider position
    function handleResize() {
        cardWidth = getCardWidth();
        gap = getGap();
        visibleCardsCount = getVisibleCardsCount();
        // Clamp currentIndex to valid range after resize using premium maxIndex
        const maxIndex = getMaxIndex();
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        prevTranslate = -currentIndex * (cardWidth + gap);
        sliderWrap.style.transform = `translateX(${prevTranslate}px)`;
        sliderWrap.style.transition = "none";
        updateArrows();
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

        // Arrows are now selected via [data-slider-products-arrow], so you can add arrows anywhere and use data-slider-products-arrow='prev'/'next'.
        const arrows = document.querySelectorAll('[data-slider-products-arrow]');
        arrows.forEach(arrow => {
            arrow.addEventListener('click', function(event) {
                event.preventDefault();
                if (arrow.classList.contains('is-disabled')) return;
                const dir = arrow.getAttribute('data-slider-products-arrow');
                isArrowClick = true;
                if (dir === 'prev' || dir === 'left') {
                    moveSlider("right");
                } else if (dir === 'next' || dir === 'right') {
                    moveSlider("left");
                }
            });
        });
    }

    // Initialize slider: set up, bind listeners, update state
    function initSlider() {
        cardWidth = getCardWidth();
        gap = getGap();
        visibleCardsCount = getVisibleCardsCount();
        sliderWrap.style.transform = `translateX(0)`;
        sliderWrap.style.transition = "none";
        addEventListeners();
        updateArrows();
    }

    // Start!
    initSlider();
});
