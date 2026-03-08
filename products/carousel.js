

// carousel functionality

const slider = document.getElementById("brandSlider");
const leftBtn = document.querySelector(".prev");
const rightBtn = document.querySelector(".next");

rightBtn.onclick = () => {
    slider.scrollBy({ left: 300, behavior: "smooth" });
};

leftBtn.onclick = () => {
    slider.scrollBy({ left: -300, behavior: "smooth" });
};

