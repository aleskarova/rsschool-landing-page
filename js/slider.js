const SWIPE_THRESHOLD = 50;
const ACTIVE_CONTROL_CLASS = 'slider-control--active';

function initSlider(root) {
  const track = root.querySelector('.slider__track');
  const viewport = root.querySelector('.slider__viewport');
  const slides = [...root.querySelectorAll('.slide')];
  const controls = [...root.closest('.container').querySelectorAll('.slider-control')];
  const prevButton = root.querySelector('.slider__arrow--prev');
  const nextButton = root.querySelector('.slider__arrow--next');

  let currentIndex = 0;
  let swipeStartX = null;

  function goTo(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(${-currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', String(i !== currentIndex));
    });

    controls.forEach((control, i) => {
      const isActive = i === currentIndex;

      control.classList.toggle(ACTIVE_CONTROL_CLASS, isActive);

      if (isActive) {
        control.setAttribute('aria-current', 'true');
      } else {
        control.removeAttribute('aria-current');
      }
    });
  }

  prevButton.addEventListener('click', () => goTo(currentIndex - 1));
  nextButton.addEventListener('click', () => goTo(currentIndex + 1));

  controls.forEach((control, i) => {
    control.addEventListener('click', () => goTo(i));
  });

  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') {
      swipeStartX = event.clientX;
    }
  });

  viewport.addEventListener('pointerup', (event) => {
    if (swipeStartX === null) {
      return;
    }

    const deltaX = event.clientX - swipeStartX;
    swipeStartX = null;

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      goTo(deltaX < 0 ? currentIndex + 1 : currentIndex - 1);
    }
  });

  viewport.addEventListener('pointercancel', () => {
    swipeStartX = null;
  });

  goTo(0);
}

document.querySelectorAll('.slider').forEach(initSlider);
