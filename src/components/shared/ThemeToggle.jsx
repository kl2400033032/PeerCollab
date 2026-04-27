function ThemeToggle({ theme, onToggle }) {
  return (
    <button type="button" className="btn btn-theme-toggle btn-sm" onClick={onToggle}>
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}

export default ThemeToggle;
