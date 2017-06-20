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
	window.app.comps.buttonRipple = {
		config: {
			buttonRipple: {}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.buttonRipple;

			opts.$container = $('.js-ripple');

			if(!opts.$container.length)return false;

			// Code begins here...

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.buttonRipple;


					opts.$container.on('click', function(e) {

						var $this = $(this);
						var $offset = $this.parent().offset();
						var $circle = $this.find('.c-ripple__circle');

						var x = e.pageX - $offset.left;
						var y = e.pageY - $offset.top;

						$circle.css({
							top: y + 'px',
							left: x + 'px'
						});

						$this.addClass('is-active');

					});

					opts.$container.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
						$(this).removeClass('is-active');
					});
		}
	};
}(jQuery, window, document));
