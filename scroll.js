// Move closer to the same sculpture as the sections pass in front of it.
const sculpture = document.querySelector('.sculpture');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0;

function updateSculpture() {
  frame = 0;
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  const progress = distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
  sculpture.style.setProperty('--art-scale', (1 + progress * 0.16).toFixed(4));
}

function scheduleUpdate() {
  if (!frame && !reducedMotion.matches) frame = requestAnimationFrame(updateSculpture);
}

window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
reducedMotion.addEventListener('change', scheduleUpdate);
scheduleUpdate();
