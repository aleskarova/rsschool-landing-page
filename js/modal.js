import { lockScroll, unlockScroll } from './utils/scroll-lock.js';

const ACTIVE_TAB_CLASS = 'tab--active';

const modal = document.querySelector('.modal');
const image = modal?.querySelector('.modal__image');
const title = modal?.querySelector('.modal__title');
const text = modal?.querySelector('.modal__text');
const sizeTabs = modal?.querySelector('[data-option="size"]');
const additiveTabs = modal?.querySelector('[data-option="additives"]');
const price = modal?.querySelector('.modal__price');
const closeButton = modal?.querySelector('.modal__close');

function createTab(iconText, label, isActive) {
  const tab = document.createElement('button');
  const icon = document.createElement('span');

  tab.type = 'button';
  tab.className = 'tab';
  tab.classList.toggle(ACTIVE_TAB_CLASS, isActive);
  tab.setAttribute('aria-pressed', String(isActive));
  icon.className = 'tab__icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = iconText;
  tab.append(icon, label);

  return tab;
}

function renderProduct(product) {
  const sizes = Object.entries(product.sizes);

  image.src = product.image;
  image.alt = product.name;
  title.textContent = product.name;
  text.textContent = product.description;

  sizeTabs.replaceChildren(
    ...sizes.map(([key, { size }], i) => createTab(key.toUpperCase(), size, i === 0)),
  );
  additiveTabs.replaceChildren(
    ...product.additives.map(({ name }, i) => createTab(String(i + 1), name, false)),
  );

  price.textContent = `$${product.price}`;
}

export function openModal(product) {
  if (!modal || modal.open) {
    return;
  }

  renderProduct(product);
  lockScroll('modal');
  modal.showModal();
}

function closeModal() {
  modal.close();
}

if (modal) {
  closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  modal.addEventListener('close', () => {
    unlockScroll('modal');
  });
}
