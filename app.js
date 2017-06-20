if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('../app.service-worker.js', { scope: "/pwa-vc/"})
    .then(function(registration){
        console.log('Service worker Registered', registration);
    })
    .catch(function(err){
        console.log('Service Worker failed to Register');
    })
}
