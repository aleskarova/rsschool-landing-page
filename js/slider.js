const SWIPE_THRESHOLD = 50;
const ACTIVE_CONTROL_CLASS = 'slider-control--active';

function createClone(slide) {
  const clone = slide.cloneNode(true);

  clone.setAttribute('aria-hidden', 'true');
  clone.inert = true;

  return clone;
}

function initSlider(root) {
  const track = root.querySelector('.slider__track');
  const viewport = root.querySelector('.slider__viewport');
  const slides = [...root.querySelectorAll('.slide')];
  const controls = [...root.closest('.container').querySelectorAll('.slider-control')];
  const prevButton = root.querySelector('.slider__arrow--prev');
  const nextButton = root.querySelector('.slider__arrow--next');

  const firstClone = createClone(slides[0]);
  const lastClone = createClone(slides[slides.length - 1]);

  track.prepend(lastClone);
  track.append(firstClone);

  // Track positions: 0 — clone of the last slide, 1..n — real slides, n + 1 — clone of the first slide
  let position = 1;
  let swipeStartX = null;

  function getActiveIndex() {
    return (position - 1 + slides.length) % slides.length;
  }

  function setPosition(nextPosition, animate) {
    position = nextPosition;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translateX(${-position * 100}%)`;

    if (!animate) {
      track.getBoundingClientRect();
      track.style.transition = '';
    }
  }

  function jumpFromClone() {
    if (position === 0) {
      setPosition(slides.length, false);
    } else if (position === slides.length + 1) {
      setPosition(1, false);
    }
  }

  function updateState() {
    const activeIndex = getActiveIndex();

    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', String(i !== activeIndex));
    });

    controls.forEach((control, i) => {
      const isActive = i === activeIndex;

      control.classList.toggle(ACTIVE_CONTROL_CLASS, isActive);

      if (isActive) {
        control.setAttribute('aria-current', 'true');
      } else {
        control.removeAttribute('aria-current');
      }
    });
  }

  function move(step) {
    jumpFromClone();
    setPosition(position + step, true);
    updateState();
  }

  function goTo(index) {
    jumpFromClone();
    setPosition(index + 1, true);
    updateState();
  }

  track.addEventListener('transitionend', (event) => {
    if (event.target === track && event.propertyName === 'transform') {
      jumpFromClone();
    }
  });

  prevButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));

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
      move(deltaX < 0 ? 1 : -1);
    }
  });

  viewport.addEventListener('pointercancel', () => {
    swipeStartX = null;
  });

  setPosition(position, false);
  updateState();
}

document.querySelectorAll('.slider').forEach(initSlider);
