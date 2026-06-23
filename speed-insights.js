// Speed Insights initialization for vanilla JavaScript project
// Using inline initialization approach for static HTML deployment

// Initialize the queue
window.si = window.si || function() {
  (window.siq = window.siq || []).push(arguments);
};

// Load the Speed Insights script
(function() {
  const script = document.createElement('script');
  script.src = 'https://va.vercel-scripts.com/v1/speed-insights/script.js';
  script.defer = true;
  document.head.appendChild(script);
})();
