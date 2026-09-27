const PRODUCTS_URL = 'products.json';
const ACTIVE_TAB_CLASS = 'tab--active';

const tabsContainer = document.querySelector('.menu__tabs');
const tabs = [...document.querySelectorAll('.menu__tabs .tab')];
const grid = document.querySelector('.menu__grid');
const cardTemplate = document.getElementById('card-template');

let products = [];

async function loadProducts() {
  const response = await fetch(PRODUCTS_URL);

  if (!response.ok) {
    throw new Error(`Failed to load products: ${response.status}`);
  }

  return response.json();
}

function createCard(product) {
  const item = cardTemplate.content.firstElementChild.cloneNode(true);
  const image = item.querySelector('.card__image');

  image.src = product.image;
  image.alt = product.name;
  item.querySelector('.card__title').textContent = product.name;
  item.querySelector('.card__description').textContent = product.description;
  item.querySelector('.card__price').textContent = `$${product.price}`;

  return item;
}

function renderCards(category) {
  const cards = products
    .filter((product) => product.category === category)
    .map(createCard);

  grid.replaceChildren(...cards);
}

function setActiveTab(activeTab) {
  tabs.forEach((tab) => {
    const isActive = tab === activeTab;

    tab.classList.toggle(ACTIVE_TAB_CLASS, isActive);
    tab.setAttribute('aria-pressed', String(isActive));
  });

  renderCards(activeTab.dataset.category);
}

function showLoadError() {
  const message = document.createElement('li');

  message.className = 'menu__message';
  message.textContent = 'Sorry, the menu is unavailable right now. Please try again later.';
  grid.replaceChildren(message);
}

async function initCatalog() {
  if (!tabsContainer || !grid || !cardTemplate || tabs.length === 0) {
    return;
  }

  try {
    products = await loadProducts();
  } catch (error) {
    console.error(error);
    showLoadError();
    return;
  }

  tabsContainer.addEventListener('click', (event) => {
    const tab = event.target.closest('.tab');

    if (tab && !tab.classList.contains(ACTIVE_TAB_CLASS)) {
      setActiveTab(tab);
    }
  });

  setActiveTab(tabs[0]);
}

initCatalog();
