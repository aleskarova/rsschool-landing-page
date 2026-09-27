const LOCK_CLASS = 'is-scroll-locked';
const lockOwners = new Set();

export function lockScroll(owner) {
  if (lockOwners.size === 0) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.classList.add(LOCK_CLASS);
  }

  lockOwners.add(owner);
}

export function unlockScroll(owner) {
  lockOwners.delete(owner);

  if (lockOwners.size === 0) {
    document.body.classList.remove(LOCK_CLASS);
    document.body.style.paddingRight = '';
  }
}
