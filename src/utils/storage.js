const THEME_KEY = 'peercollab_theme';

export function clearLegacyAuth() {
  localStorage.removeItem('peercollab_token');
  localStorage.removeItem('peercollab_user');
  sessionStorage.removeItem('peercollab_token');
  sessionStorage.removeItem('peercollab_user');
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}
