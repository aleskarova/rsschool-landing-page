import { lockScroll, unlockScroll } from './utils/scroll-lock.js';

const ACTIVE_TAB_CLASS = 'tab--active';

const modal = document.querySelector('.modal');
const imageBox = modal?.querySelector('.modal__image-box');
const title = modal?.querySelector('.modal__title');
const text = modal?.querySelector('.modal__text');
const sizeTabs = modal?.querySelector('[data-option="size"]');
const additiveTabs = modal?.querySelector('[data-option="additives"]');
const price = modal?.querySelector('.modal__price');
const closeButton = modal?.querySelector('.modal__close');

const selection = {
  product: null,
  sizeKey: null,
  additives: new Set(),
};

function toCents(value) {
  return Math.round(Number.parseFloat(value) * 100);
}

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function getTotalCents() {
  const { product, sizeKey, additives } = selection;
  const sizeCents = toCents(product.sizes[sizeKey]['add-price']);
  const additivesCents = [...additives].reduce(
    (sum, index) => sum + toCents(product.additives[index]['add-price']),
    0,
  );

  return toCents(product.price) + sizeCents + additivesCents;
}

function setTabActive(tab, isActive) {
  tab.classList.toggle(ACTIVE_TAB_CLASS, isActive);
  tab.setAttribute('aria-pressed', String(isActive));
}

function updatePrice() {
  price.textContent = formatPrice(getTotalCents());
}

function getImage() {
  let image = imageBox.querySelector('.modal__image');

  if (!image) {
    image = document.createElement('img');
    image.className = 'modal__image';
    image.width = 340;
    image.height = 340;
    imageBox.append(image);
  }

  return image;
}

function createTab(iconText, label, isActive) {
  const tab = document.createElement('button');
  const icon = document.createElement('span');

  tab.type = 'button';
  tab.className = 'tab';
  setTabActive(tab, isActive);
  icon.className = 'tab__icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = iconText;
  tab.append(icon, label);

  return tab;
}

function renderProduct(product) {
  const sizes = Object.entries(product.sizes);

  selection.product = product;
  selection.sizeKey = sizes[0][0];
  selection.additives.clear();

  const image = getImage();

  image.src = product.image;
  image.alt = product.name;
  title.textContent = product.name;
  text.textContent = product.description;

  sizeTabs.replaceChildren(
    ...sizes.map(([key, { size }]) => {
      const tab = createTab(key.toUpperCase(), size, key === selection.sizeKey);

      tab.dataset.size = key;

      return tab;
    }),
  );
  additiveTabs.replaceChildren(
    ...product.additives.map(({ name }, index) => {
      const tab = createTab(String(index + 1), name, false);

      tab.dataset.additive = String(index);

      return tab;
    }),
  );

  updatePrice();
}

function selectSize(event) {
  const tab = event.target.closest('[data-size]');

  if (!tab || tab.dataset.size === selection.sizeKey) {
    return;
  }

  selection.sizeKey = tab.dataset.size;
  sizeTabs.querySelectorAll('[data-size]').forEach((sizeTab) => {
    setTabActive(sizeTab, sizeTab === tab);
  });
  updatePrice();
}

function toggleAdditive(event) {
  const tab = event.target.closest('[data-additive]');

  if (!tab) {
    return;
  }

  const index = Number(tab.dataset.additive);
  const isActive = !selection.additives.has(index);

  if (isActive) {
    selection.additives.add(index);
  } else {
    selection.additives.delete(index);
  }

  setTabActive(tab, isActive);
  updatePrice();
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
  sizeTabs.addEventListener('click', selectSize);
  additiveTabs.addEventListener('click', toggleAdditive);
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
