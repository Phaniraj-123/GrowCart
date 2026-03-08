// scroll animation section
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

document.querySelectorAll("section").forEach(section => {
  observer.observe(section);
});



// menu toggle button

function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('show');
}

