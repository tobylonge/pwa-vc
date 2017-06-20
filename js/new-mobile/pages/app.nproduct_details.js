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
	window.app.comps.nproductDetails = {
		config: {
			nproductDetails: {}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.nproductDetails;

			opts.$container = $('[' + self.attr_name('nproduct-details') + ']');
			opts.thumbNailImg = '.js-thumbnail-pd img';
			opts.description = '.js-description';
			opts.showMore = '.js-showmore';

			if(!opts.$container.length)return false;

			// Code begins here...

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.nproductDetails;

					// var h = $(opts.description)[0].scrollHeight;
					opts.$container.off('click.vc.nproductDetails', opts.thumbNailImg).on('click.vc.nproductDetails', opts.thumbNailImg, function(e){
						e.preventDefault();
						var src = $(this).attr('src');
						$('.js-show').attr('src', src);

					});

					// opts.$container.off('click.vc.nproductDetails', opts.showMore).on('click.vc.nproductDetails', opts.showMore, function(e){
					// 	e.preventDefault();
					// 	e.stopPropagation();
					// 	var text = $(this).text();

					// 	if (text === 'VIEW FULL DESCRIPTION') {
					// 		$(opts.description).animate({
					// 			'height': h
					// 		});
					// 		$(this).text("LESS...");
					// 	}
					// 	else if (text === 'LESS...') {
					// 		$(opts.description).animate({
					// 			'height': '100px'
					// 		});
					// 		$(this).text("VIEW FULL DESCRIPTION");
					// 	}

					// });

					// $('#thumbnails img').on('click',function(){
					// 	var src = $(this).attr('src');
					// 	$('#show').attr('src', src);
					// });



					// $('.js-showmore').click(function(e) {
					// 	var text = $(this).text();
					// 	if (text === 'VIEW FULL DESCRIPTION') {
					// 		e.stopPropagation();
					// 		$(opts.description).animate({
					// 			'height': h
					// 		});
					// 		$(this).text("LESS...");
					// 	}
					// 	else if (text === 'LESS...') {
					// 		$(opts.description).animate({
					// 			'height': '100px'
					// 		});
					// 		$(this).text("VIEW FULL DESCRIPTION");
					// 	}
					// });
		}
	};
}(jQuery, window, document));
