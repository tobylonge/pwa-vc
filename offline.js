
(function () {
    'use strict';

    //   var header = document.querySelector('header');
    //   var menuHeader = document.querySelector('.menu__header');
    var body = document.querySelector('body');

    //After DOM Loaded
    document.addEventListener('DOMContentLoaded', function (event) {
        //On initial load to check connectivity
				console.log('DOMContentLoaded');
        updateNetworkStatus();

        // if (!navigator.onLine) {
        //     updateNetworkStatus();
        // }

        window.addEventListener('online', updateNetworkStatus, false);
        window.addEventListener('offline', updateNetworkStatus, false);
    });

    //To update network status
    function updateNetworkStatus() {
        if (navigator.onLine) {
            // header.classList.remove('app__offline');
            // menuHeader.style.background = '#1E88E5';
						hideToast();
						body.style.filter = 'inherit';
						// body.style.filter = 'grayscale(0)';
        }
        else {
            toast('You are now offline..');
            body.style.filter = 'grayscale()';
            // header.classList.add('app__offline');
            // menuHeader.style.background = '#9E9E9E';
        }
    }
})();
