document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('htmx:beforeRequest', function(evt) {
    const token = localStorage.getItem('firebase_id_token');
    if (token && evt.detail.xhr) {
      evt.detail.xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  });
  document.body.addEventListener('htmx:beforeRequest', function() {
    document.body.classList.add('htmx-request');
  });
  document.body.addEventListener('htmx:afterRequest', function() {
    document.body.classList.remove('htmx-request');
  });
});
