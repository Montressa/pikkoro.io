let deferredPrompt;

// Service Worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}

// Function to show custom install prompt
const showInstallPrompt = () => {
  if (deferredPrompt) {
    // Customize the text for the prompt
    const promptOptions = {
      userVisibleOnly: true,
      applicationServerKey: null,
      title: 'Get Piccolo',
      body: 'Click "Add to Homescreen" or "Install" to get Piccolo.',
      icon: '/icon.png'
    };

    deferredPrompt.prompt(promptOptions);
    
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
        // Redirect the user to the PWA if they dismissed the prompt
        window.location.href = '/index.html';
      }
      deferredPrompt = null;
    });
  }
};

// Prompt users to add to homescreen
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;

  // Show a custom install prompt
  showInstallPrompt();
});
