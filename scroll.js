const entrance = document.querySelector('.entrance');
const stage = document.querySelector('.stage');
const doors = document.querySelector('.doors');
const cue = document.querySelector('.open-cue');
const directory = document.querySelector('.directory');
const industryStop = document.querySelector('.industry-stop');
const bubbles = Array.from(directory.querySelectorAll('li'));
const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
let frame = 0;
let lastProgress;

function progressBetween(value, start, end) {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

function paintEntrance() {
  frame = 0;
  const top = entrance.getBoundingClientRect().top;
  document.body.classList.toggle('inside', -top >= entrance.offsetHeight - 70);
  if (!motion.matches) return;

  const travel = Math.max(1, entrance.offsetHeight - stage.offsetHeight);
  const progress = Math.max(0, Math.min(1, -top / travel));
  if (progress === lastProgress) return;
  lastProgress = progress;
  const opening = progressBetween(progress, .02, .66);
  const walkThrough = stage.clientWidth / doors.offsetWidth * 1.06;
  const reveal = progressBetween(progress, .66, .86);
  const cueFade = progressBetween(progress, 0, .14);
  stage.style.setProperty('--turn', (opening * 104).toFixed(2) + 'deg');
  stage.style.setProperty('--court-scale', (1 + opening * .075).toFixed(4));
  stage.style.setProperty('--gate-light', (1 - opening).toFixed(3));
  stage.style.setProperty('--entry-scale', (1 + (walkThrough - 1) * opening).toFixed(4));
  stage.style.setProperty('--door-shadow', (opening * .44).toFixed(3));
  stage.style.setProperty('--inscription', (1 - progressBetween(progress, .10, .40)).toFixed(3));
  stage.style.setProperty('--cue-opacity', (1 - cueFade).toFixed(3));
  stage.style.setProperty('--directory-opacity', reveal.toFixed(3));
  stage.style.setProperty('--directory-rise', (24 * (1 - reveal)).toFixed(1) + 'px');
  for (const [index, bubble] of bubbles.entries()) {
    const start = .66 + index * .02;
    const arrival = progressBetween(progress, start, start + .14);
    bubble.style.setProperty('--arrival', arrival.toFixed(3));
    bubble.style.setProperty('--rise', ((1 - arrival) * 18).toFixed(1) + 'px');
  }
  cue.inert = cueFade === 1;
  directory.inert = reveal < .5;
}

function schedulePaint() {
  if (!frame) frame = requestAnimationFrame(paintEntrance);
}

function syncMotion() {
  if (motion.matches) entrance.prepend(industryStop);
  else directory.before(industryStop);
  document.documentElement.classList.toggle('animated', motion.matches);
  lastProgress = undefined;
  stage.removeAttribute('style');
  cue.inert = false;
  directory.inert = false;
  paintEntrance();
}

syncMotion();
window.addEventListener('scroll', schedulePaint, {passive: true});
window.addEventListener('resize', () => {
  lastProgress = undefined;
  schedulePaint();
});
window.addEventListener('pageshow', schedulePaint);
motion.addEventListener('change', syncMotion);
