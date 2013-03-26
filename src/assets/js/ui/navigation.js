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
						$children.prepend('<li class="backBtn">Back</li>');
					}
				});

		/**
		 * Add click handler for showing sub navigation on smaller screens
		 */
		$nav.find('.hasSub').on('click', function(e){
			// get the screen size
			var viewport = $.viewport() || null;

			if(viewport && (viewport.width <= 767)){
				// we're on a small screen
				$nav.children('.inner').stop(true, true).animate({left: '-100%'}, animSpeed);

				e.preventDefault();
			}
		});

		$nav.find('.backBtn').on('click', function(e){
			// get the screen size
			var viewport = $.viewport() || null;

			if(viewport && (viewport.width <= 767)){
				// we're on a small screen
				$nav.children('.inner').stop(true, true).animate({left: 0}, animSpeed);

				e.preventDefault();
			}
		});
	});
};

// call the accordion functionality
$('.nav').bill('navigation');