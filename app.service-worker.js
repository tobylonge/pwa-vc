
    importScripts('sw-toolbox.js');

    const precacheFiles = [
        //html files

        'new-mobile/index.html'
    ];

    //Adding the default caching strategy:
    //- networkOnly – only fetch from network
    //- cacheOnly – only fetch from cache
    //- fastest – fetch from both, and respond with whichever comes first
    //- networkFirst – fetch from network, if that fails, fetch from cache
    //- cacheFirst – fetch from cache, but also fetch from network and update cache

    toolbox.options.debug = true;

    //The route for other HTML files
    // toolbox.router.get('new-mobile/(.*)', self.toolbox.cacheFirst, {
    //     cache: {
    //         name: 'html'
    //     }
    // })
    toolbox.router.default = toolbox.fastest;

    // Precache the files
    toolbox.precache(precacheFiles);
    // Ensure that our service worker takes control of the page as soon as possible.
    self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

