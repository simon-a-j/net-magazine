// If service workers are available in the browser, register our service worker.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js', {scope: './'}).then(registration => {
      console.log("Successfully registered service worker.");
    }, function(error) {
      console.log("Error registering service worker: " + error);
    });
  });
}

// Import template content and inject it into the document.
var template_import = document.getElementById('template-import').import;
var template = template_import.getElementById('status-template');
document.getElementById("connection-status").appendChild(template.content.cloneNode(true));
