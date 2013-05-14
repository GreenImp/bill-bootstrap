/**
 * Adds accordion functionality
 *
 * @return {*}
 */
;methods.notice = function(userOptions){
	'use strict';

	var defaultOptions = {
		animSpeed:400
	};
	var options = $.extend(defaultOptions, userOptions);

	// loop through each element and add the functionality
	// return 'this' to allow chain-ability
	return this.each(function(){
		var $elm = $(this),				// the tab element
			data = $elm.data('bill');	// the tab data

		// only add the functionality if it hasn't already been initiated on the object
		if(!data || !data.notice){
			// set the option data
			$elm
				.addClass('closable')
				.data('bill', $.extend(data || {}, {notice:options}));

			$('<a href="#close" title="Close notice" class="closeBtn">X</a>').appendTo($elm).on('click', function(e){
				e.preventDefault();

				var $notice = $(this).parent('.notice').stop(true, true),
					options = $notice.data('bill').notice;

				if($notice.hasClass('fixed')){
					$notice.slideUp(options.animSpeed, function(){
						$notice.remove();
					});
				}else{
					$notice.fadeOut(options.animSpeed, function(){
						$notice.remove();
					});
				}
			});
		}else{
			// functionality already exists, but options have been updated
			$elm.data('bill', $.extend(data || {}, {notice:options}));
		}
	});
};

// call the accordion functionality
$('.notice[data-close="1"], .notice[data-close="true"], .notice[data-close="yes"]').bill('notice');