(function (exports) {
  'use strict';

  var toastContainer = document.querySelector('.toast__container');
  var toastMsg = document.createElement('div');

  //To show notification
  function toast(msg, options) {
    if (!msg) return;
    console.log('msg ', msg);

    options = options || 60000;

    toastMsg.className = 'toast__msg';
    toastMsg.textContent = msg;
    console.log('toastMsg ', toastMsg, 'toastContainer ', toastContainer);

    toastContainer.appendChild(toastMsg);

    //Show toast for 3secs and hide it
    setTimeout(function () {
      toastMsg.classList.add('toast__msg--hide');
    }, options);

    //Remove the element after hiding
    toastMsg.addEventListener('transitionend', function (event) {
      event.target.parentNode.removeChild(event.target);
    });
  }

  function hideToast () {
      toastMsg.classList.add('toast__msg--hide');
      //Remove the element after hiding
      toastMsg.addEventListener('transitionend', function (event) {
        event.target.parentNode.removeChild(event.target);
      });
  }

  exports.toast = toast; //Make this method available in global
  exports.hideToast = hideToast; //Make this method available in global
})(typeof window === 'undefined' ? module.exports : window);
