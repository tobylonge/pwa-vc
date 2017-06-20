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
	window.app.comps.homePage = {
		config: {
			homePage: {}
		},
		init:function(){
			// Contains the initialization code.
			var self = this,
					cf = this.config,
					opts = cf.homePage;

			opts.$container = $('[' + self.attr_name('homePage') + ']');
			// opts.$containerPreloader = $('[' + self.attr_name('preloader') + ']');

			if(!opts.$container.length)return false;
			// if(!opts.$containerPreloader.length)return false;

			// Code begins here...

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.homePage,
					win = $(window);

					// win.load(function(){
					// 	opts.$containerPreloader.fadeOut('slow',function(){
					// 		$(this).remove();
					// 	});
					// });
		}
	};
}(jQuery, window, document));
