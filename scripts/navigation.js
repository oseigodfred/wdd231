// Responsive Navigation Menu
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  // Toggle hamburger icon between ☰ and ✕
  if (nav.classList.contains('open')) {
    hamburger.textContent = '✕';
    hamburger.setAttribute('aria-expanded', 'true');
  } else {
    hamburger.textContent = '☰';
    hamburger.setAttribute('aria-expanded', 'false');
  }
});
