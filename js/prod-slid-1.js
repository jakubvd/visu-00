document.addEventListener("DOMContentLoaded", function () {
    // Upewnij się, że łapiesz CMS slider wrap
    const sliderWrap = document.querySelector(".home-products_slider-wrap.w-dyn-items");
    if (!sliderWrap) return;

    function getCards() {
        // Pobierz tylko widoczne karty w CMS
        return sliderWrap.querySelectorAll(".home-products_slider-card");
    }
    let cards = getCards();

    const swipeThreshold = 10;
    let currentIndex = 0;
    let cardWidth = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let prevTranslate = 0;
    let currentTranslate = 0;

    function getCardWidth() {
        // Zakładamy że wszystkie mają taki sam width
        cards = getCards(); // aktualizuj jeśli coś się zmieniło
        return cards[0] ? cards[0].offsetWidth : 0;
    }

    function moveSlider(direction) {
        cards = getCards();
        const maxIndex = cards.length - 1;

        if (direction === "left" && currentIndex < maxIndex) {
            currentIndex++;
        } else if (direction === "right" && currentIndex > 0) {
            currentIndex--;
        }
        sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        sliderWrap.style.transition = "transform 0.3s ease-out";
        prevTranslate = -currentIndex * cardWidth;
    }

    function handleStart(e) {
        isDragging = true;
        startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        startY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
        sliderWrap.style.transition = "none";
    }

    function handleMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
        const currentY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;

        const diffX = currentX - startX;
        const diffY = currentY - startY;

        if (Math.abs(diffY) > Math.abs(diffX)) {
            isDragging = false;
            return;
        }

        currentTranslate = prevTranslate + diffX;

        const maxTranslate = -(getCards().length - 1) * cardWidth;
        const minTranslate = 0;
        currentTranslate = Math.max(Math.min(currentTranslate, minTranslate), maxTranslate);

        sliderWrap.style.transform = `translateX(${currentTranslate}px)`;
    }

    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.type.includes("mouse") ? e.clientX : e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (diffX < -swipeThreshold) {
            moveSlider("left");
        } else if (diffX > swipeThreshold) {
            moveSlider("right");
        } else {
            sliderWrap.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
            sliderWrap.style.transition = "transform 0.3s ease-out";
        }
    }

    function handleResize() {
        cardWidth = getCardWidth();
        prevTranslate = -currentIndex * cardWidth;
        sliderWrap.style.transform = `translateX(${prevTranslate}px)`;
        sliderWrap.style.transition = "none";
    }

    function addEventListeners() {
        sliderWrap.addEventListener("mousedown", handleStart);
        sliderWrap.addEventListener("mousemove", handleMove);
        sliderWrap.addEventListener("mouseup", handleEnd);
        sliderWrap.addEventListener("mouseleave", handleEnd);
        sliderWrap.addEventListener("touchstart", handleStart);
        sliderWrap.addEventListener("touchmove", handleMove);
        sliderWrap.addEventListener("touchend", handleEnd);
        window.addEventListener("resize", handleResize);
    }

    function initSlider() {
        cardWidth = getCardWidth();
        sliderWrap.style.transform = `translateX(0)`;
        sliderWrap.style.transition = "none";
        addEventListeners();
    }

    initSlider();
});