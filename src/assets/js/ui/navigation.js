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
		$nav
			.addClass('dynamic')
			.wrapInner('<div class="inner"></div>')
			.find('.inner > ul li')
				.each(function(){
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

					// get the sub nav and show it
					var $subs = $(this).children('ul').show();
					// set the nav container height to that of the sub nav
					$nav.height($subs.outerHeight());
					$nav.height((function(){
						var height = 0;
						$subs.each(function(){
							height += $(this).outerHeight(true);
						});
						return height;
					}));

					// slide the sub nav into view
					$inner.stop(true, true).animate({left:'-=' + parseFloat($nav.innerWidth())}, animSpeed);

					e.preventDefault();
				}
			}
			e.stopPropagation();
		});

		$nav.find('.backBtn').on('click', function(e){
			// get the screen size
			var $parent = $(this).parents('.hasSub:first');
				viewport = $.viewport() || null;

			if(viewport && (viewport.width <= 767)){
				// we're on a small screen

				// set the nav container height to that of the parent nav's parent (so we show all of it's siblings too)
				$nav.height((function(){
					var height = 0;
					// loop through all ul elements at the same level and calculate their height
					$parent.parent('ul').parent().children('ul').each(function(){
						height += $(this).outerHeight(true);
					});
					return height;
				}));

				// slide the nav back to show the parent
				$inner.stop(true, true).animate({left:'+=' + parseFloat($nav.innerWidth())}, animSpeed, function(){
					// hide the children (this stops them overlapping
					$parent.children('ul').hide();
				});

				e.preventDefault();
			}
			e.stopPropagation();
		});

		/**
		 * Ensure that the nav container is
		 * the correct height on small screens
		 */
		$(window).on('ready resize', function(){
			var viewport = $.viewport() || null;

			if(viewport && (viewport.width <= 767)){
				// we're on a small screen - define a fixed height
				$nav.height($inner.outerHeight());
			}else{
				// we're not on a small screen - remove any style attributes
				$nav.removeAttr('style');
				$inner
						.removeAttr('style')
						.find('ul')
							.removeAttr('style');
			}
		});
	});
};

// call the accordion functionality
$('.nav').bill('navigation');