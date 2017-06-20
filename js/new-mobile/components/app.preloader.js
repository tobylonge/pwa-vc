/**
	component_name - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.preloader = {
		config: {
			preloader: {}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.preloader,
          win = $(window);
			    // doc = $(document);

			opts.$container = $('[' + self.attr_name('preloader') + ']');
			// opts.$containerPreloaderTimeline = '.js-preloader-timeline';
      // opts.Loader = 'spinner';


			if(!opts.$container.length)return false;

			// Code begins here...


			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.preloader,
          win = $(window),
			    doc = $(document);

          // win.load(function() { // makes sure the whole site is loaded
          //   // $(opts.Loader).fadeOut(); // will first fade out the loading animation
          //   opts.$container.delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
          //   $('body').delay(350).css({
          //     'overflow': 'visible'
          //   });
          // });
					// imageLoaderUrl = $el.attr(self.attr_name('preloader'));
					// opts.$container.css('background-image', 'url(' + imageLoaderUrl + ')');

					win.load(function(){
						opts.$container.fadeOut('slow',function(){
							$(this).remove();
						});
					});




		}
	};
}(jQuery, window, document));
