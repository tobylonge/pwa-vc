
    importScripts('sw-toolbox.js');

    const precacheFiles = [
        //html files

        'new-mobile/',
        'new-mobile/index.html',
        'new-mobile/product-details.html',
        'new-mobile/product-listing.html',
        'new-mobile/signup.html',
        'new-mobile/business-details.html',
        'new-mobile/business-list.html',
        'new-mobile/businesslist-page.html',
        'new-mobile/business-listing.html',
        'new-mobile/login.html',
        'new-mobile/checkout.html',
        'new-mobile/cart.html',
        'new-mobile/user-settings.html',
        'new-mobile/cart-empty.html',
        'new-mobile/add-photo.html',
        'new-mobile/all-photos.html',
        'new-mobile/all-reviews.html',

        //css files
        'css/new-mobile/core.css',
        'css/new-mobile/pages/lite-home-base.css',

        //js files
        'app.js',
        'toast.js',
        'offline.js',
				'manifest.json',
        'js/vendor/custom.modernizr.js',
        'js/min/app-nmobile.min.js',
        'js/vendor/jquery-1.10.2.min.js',
				'js/vendor/OneSignalSDK.js',

        //img files
        'img/vconnect-logo-desktop-white.png',
				'img/vconnect-logo-desktop.png',
				'img/new-mobile/4.jpg',
        'img/new-mobile/svg/list.svg',
        'img/new-mobile/svg/business-1.svg',
        'img/new-mobile/svg/bcategory.svg',
        'img/new-mobile/svg/product.svg',
        'img/new-mobile/svg/owner-1.svg',
				'img/new-mobile/svg/icon-arrow-1.svg',
				'img/new-mobile/svg/contact.svg',
        // 'font/vc-icon.woff2?14161380',
        'img/new-mobile/mkitchen-dining.jpg',
        'img/new-mobile/mhome-needs.jpg',
        'img/new-mobile/mlifestyle.jpg',
        'img/new-mobile/melectronics.jpg',
				'img/new-mobile/mHome-consumables.jpg',
        'img/new-mobile/about/1.png',
        'img/new-mobile/about/2.png',
        'img/new-mobile/about/3.png',
				'img/pencil-banner.jpg',
        'img/home_footer_ad.jpg'
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

