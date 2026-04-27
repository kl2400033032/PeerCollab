const THEME_KEY = 'peercollab_theme';
const TOKEN_KEY = 'peercollab_token';
const USER_KEY = 'peercollab_user';

export function clearLegacyAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function saveAuthSession(token, user) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
}

export function clearStoredAuth() {
  clearLegacyAuth();
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}
