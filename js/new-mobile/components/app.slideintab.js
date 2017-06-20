/**
	slideInTabs - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.slideTab = {
		config: {
			slideslideTab: {}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.slideTab;

			opts.$container = $('[' + self.attr_name('slideInTabs') + ']');


			if(!opts.$container.length)return false;

			// Code begins here...

			// opts.$slideInContainer = $('[' + self.attr_name('slideInContainer') + ']');
			opts.$slideTabItem = '[' + self.attr_name('slidetabUrl') + ']';
			opts.$slideTabContent = $('[' + self.attr_name('slidetabContent') + ']');
			opts.$slideTabBack = '[' + self.attr_name('slideback') + ']';

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.slideTab;



			opts.$container.off('click', opts.$slideTabItem).on('click', opts.$slideTabItem, function(e){
				self.log('Tab item clicked');

				//Save the location of this click
				opts.scroll = $(window).scrollTop();
				self.log(opts.scroll, 'position');


				$(this).closest(opts.$container).addClass('slide-tabs-inactive').removeClass('slide-tabs-active');

				// Scroll to view
				// $('html, body').animate({
        //   scrollTop: 500
        // }, 600);


				opts.$tabToshow = $(this).attr('data-vc-slidetabUrl');
				$('[data-vc-slidetabContent =' + opts.$tabToshow + ']').addClass('slide-tabs-active').removeClass('slide-tabs-inactive');

			});

			// opts.$slideTabBack.off('click.vc.slideInTabs').on('click.vc.slideInTabs', function(e){
			opts.$slideTabContent.off('click', opts.$slideTabBack).on('click', opts.$slideTabBack , function(e){
				// e.preventDefault();

				$(this).closest(opts.$slideTabContent).removeClass('slide-tabs-active').addClass('hide');
				$(this).closest(opts.$slideTabContent).parent().find(opts.$container).removeClass('slide-tabs-inactive').addClass('slide-tabs-active').delay(1000);

				//Go to the location it was initially before click
				$(window).scrollTop(opts.scroll);

			});
		}
	};
}(jQuery, window, document));
