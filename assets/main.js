const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
toggle.hidden = false;
document.documentElement.classList.add('js');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = 'Menu +';
  nav.classList.remove('is-open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close −' : 'Menu +';
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); } });
const links = [...nav.querySelectorAll('a')];
const sections = [...document.querySelectorAll('main > section')];
function updateActive() {
  let active = sections[0];
  for (const section of sections) if (section.getBoundingClientRect().top <= 160) active = section;
  for (const link of links) {
    if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
let scheduled = false;
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(() => { updateActive(); scheduled = false; }); }
}, { passive: true });
updateActive();
// Optional original images never leave broken icons or empty frames.
document.querySelectorAll('img[data-src]').forEach(image => {
  image.addEventListener('load', () => { image.parentElement.hidden = false; }, { once: true });
  image.addEventListener('error', () => { image.parentElement.hidden = true; }, { once: true });
  image.src = image.dataset.src;
});
