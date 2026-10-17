import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

// Keep the global scroll lock and the root Lenis instance in sync.
// Route transitions and preloaders both use this shared helper.
export function setScrollLockLenis(instance) {
  lenisInstance = instance ?? null;
}

export function disableScroll() {
  const scrollY = window.scrollY;

  // Stop Lenis before fixing the document. Otherwise its ticker can keep writing
  // an old scroll target while the body is locked and leave ScrollTrigger out of sync.
  lenisInstance?.stop();

  document.body.style.top = `-${scrollY}px`;
  document.documentElement.style.top = `-${scrollY}px`;
  document.body.classList.add('scroll-lock');
  document.documentElement.classList.add('scroll-lock');

  ScrollTrigger.refresh();
}

export function enableScroll() {
  document.documentElement.style.top = '';
  document.body.style.top = '';
  document.body.classList.remove('scroll-lock');
  document.documentElement.classList.remove('scroll-lock');

  if (lenisInstance) {
    // Reset Lenis' internal animated/target scroll as well as the native page.
    // Force permits the immediate reset while Lenis is stopped.
    lenisInstance.scrollTo(0, { immediate: true, force: true });
    lenisInstance.start();
    return;
  }

  window.scrollTo(0, 0);
}
