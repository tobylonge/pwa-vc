/**
	See More - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.seemore = {
		config: {
			seemore: {}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.seemore;

			opts.$container = $('[' + self.attr_name('seemore') + ']');
			opts.$itemSeeAll = '.js-see-all';
			opts.$itemSeeLess = '.js-see-less';

			if(!opts.$container.length)return false;

			// Code begins here...

			opts.$container.each(function(index, elem){
				var $el = $(elem),
				seeMore = +$el.attr(self.attr_name('seemore')),
				myStr = $el.text();

				// self.log(seeMore);
				if(myStr.length > seeMore){
					var newStr = myStr.substring(0, seeMore);
					var removedStr = myStr.substring(seeMore, myStr.length);
					$el.empty().text(newStr);
					$el.append('<a href="#" class="js-see-all see-link"><span class="see-dot">...</span> See All</a>');
					$el.append('<span class="more-text hide">' + removedStr + '</span>');
					$el.append('<a href="#" class="js-see-less hide see-link"><span class="see-dot">...</span> See Less</a>');
				}
			});

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.seemore;

				opts.$container.off('click.vc.seemore', opts.$itemSeeAll).on('click.vc.seemore', opts.$itemSeeAll, function(e){
					e.preventDefault();
					self.log('clicked see all');

					var $el = $(this);
					$el.siblings('.more-text').fadeIn();
					$el.siblings('.js-see-less').fadeIn();
					$el.remove();
				});

				opts.$container.off('click.vc.seemore', opts.$itemSeeLess).on('click.vc.seemore', opts.$itemSeeLess, function(e){
					e.preventDefault();
					self.log('clicked see less');
					var $el = $(this);
					$el.empty();
					var seeMoreContainer = $el.closest(opts.$container);
					var myStrText = seeMoreContainer.text();
					var seeLess = +seeMoreContainer.attr(self.attr_name('seemore'));
					$el.remove();
					self.log(seeMoreContainer, myStrText, seeLess);

					if(myStrText.length > seeLess){
						var newStr = myStrText.substring(0, seeLess);
						var removedStr = myStrText.substring(seeLess, myStrText.length);
						seeMoreContainer.empty().text(newStr);
						seeMoreContainer.append('<a href="#" class="js-see-all see-link"><span class="see-dot">...</span> See All</a>');
						seeMoreContainer.append('<span class="more-text hide">' + removedStr + '</span>');
						seeMoreContainer.append('<a href="#" class="js-see-less hide see-link"><span class="see-dot">...</span> See Less</a>');
					}

				});
		}
	};
}(jQuery, window, document));
