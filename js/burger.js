import { lockScroll, unlockScroll } from './utils/scroll-lock.js';

const OPEN_CLASS = 'header--menu-open';
const desktopQuery = window.matchMedia('(min-width: 769px)');

const header = document.querySelector('.header');
const button = header?.querySelector('.header__burger');
const nav = header?.querySelector('.nav');

function isOpen() {
  return header.classList.contains(OPEN_CLASS);
}

function openMenu() {
  header.classList.add(OPEN_CLASS);
  button.setAttribute('aria-expanded', 'true');
  button.setAttribute('aria-label', 'Close menu');
  lockScroll('burger');
}

function closeMenu() {
  if (!isOpen()) {
    return;
  }

  header.classList.remove(OPEN_CLASS);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Open menu');
  unlockScroll('burger');
}

if (header && button && nav) {
  button.addEventListener('click', () => {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      closeMenu();
      button.focus();
    }
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) {
      closeMenu();
    }
  });
}
