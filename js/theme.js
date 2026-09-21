const THEME_KEY = 'theme';
const root = document.documentElement;

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // localStorage is unavailable (e.g. private mode) — the theme still switches for this page
  }
}

function applyTheme(theme) {
  root.dataset.theme = theme;
}

applyTheme(getSavedTheme() === 'dark' ? 'dark' : 'light');

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');

  if (!toggle) {
    return;
  }

  toggle.checked = root.dataset.theme === 'dark';

  toggle.addEventListener('change', () => {
    const theme = toggle.checked ? 'dark' : 'light';

    applyTheme(theme);
    saveTheme(theme);
  });
});
