/**
 * Adds accordion functionality
 *
 * @return {*}
 */
methods.navigation = function(){
	var animSpeed = 200;

	// loop through each element and add the navigation functionality
	// return 'this' to allow chain-ability
	return this.each(function(){
		var $nav = $(this);

		// loop through all of the li elements and check if they have children
		$nav.addClass('dynamic').wrapInner('<div class="inner"></div>').find('.inner > ul').find('li').each(function(){
					var $item = $(this),					// the li element
						$children = $item.children('ul');	// any child ul elements
					if($children.length){
						// the item has sub-navigation
						$item.addClass('hasSub');	// apply hasSub class

						// add a back button to the sub-nav (used for small screens)
						$children.each(function(){
							var $child = $(this);
							if(!$child.children('.backBtn:first').length){
								$child.prepend('<li class="backBtn">' + ($nav.attr('data-text-back') || 'Back') + '</li>');
							}
						});
					}
				});
		var $inner = $nav.children('.inner:first');

		/**
		 * Add click handler for showing sub navigation on smaller screens
		 */
		$nav.find('.hasSub').on('click', function(e){
			// get the screen size
			var viewport = $.viewport() || null;

			if(viewport && (viewport.width <= 767)){
				// we're on a small screen

				// check the clicked element - ensure that it's not a child of hasSub
				var target = $(e.target);
				if(target.hasClass('hasSub') || ((target.prop('tagName').toUpperCase() != 'UL') && target.parent().hasClass('hasSub'))){
					// we're on an actual hasSub element
					$inner.stop(true, true).animate({left:'-=' + parseFloat($nav.innerWidth())}, animSpeed);
					e.preventDefault();
				}
			}
			e.stopPropagation();
		});

		$nav.find('.backBtn').on('click', function(e){
			// get the screen size
			var viewport = $.viewport() || null;

			if(viewport && (viewport.width <= 767)){
				// we're on a small screen
				$inner.stop(true, true).animate({left:'+=' + parseFloat($nav.innerWidth())}, animSpeed);

				e.preventDefault();
			}
			e.stopPropagation();
		});


		$(window).on('resize', function(){
			var viewport = $.viewport() || null;

			if(viewport && (viewport.width <= 767)){
				$nav.height($inner.outerHeight());
			}else{
				$nav.removeAttr('style');
				$inner.removeAttr('style');
			}
		});
	});
};

// call the accordion functionality
$('.nav').bill('navigation');