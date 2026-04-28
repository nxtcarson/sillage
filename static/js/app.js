document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('htmx:beforeRequest', function() {
    document.body.classList.add('htmx-request');
  });
  document.body.addEventListener('htmx:afterRequest', function() {
    document.body.classList.remove('htmx-request');
  });

  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
});
