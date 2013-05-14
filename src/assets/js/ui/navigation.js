/**
 * Adds accordion functionality
 *
 * @return {*}
 */
;methods.navigation = function(){
	'use strict';

	var animSpeed = 200,
		getHeight = function($elm, $top){
			var height = 0;
			// loop through all ul elements at the same level and calculate their height
			$elm.each(function(){
				height += $(this).outerHeight(true);
			});
			return height ? height + $top.outerHeight() : 'auto';
		};

	// loop through each element and add the navigation functionality
	// return 'this' to allow chain-ability
	return this.each(function(){
		var $nav = $(this),
			$top = $('<div class="top">' +
						'<span class="menuBtn">Menu</span>' +
					'</div>');

		// loop through all of the li elements and check if they have children
		$nav
			.addClass('dynamic')
			.wrapInner('<div class="inner">');

		// get the 'inner' element
		var $inner = $nav.children('.inner:first');

		// build the top bar and add it to the nav
		$top.append($inner.children('.title')).prependTo($nav);

		// loop through each li element
		$inner.find('li')
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

		/**
		 * Add click handler for showing sub navigation on small screens
		 */
		$inner.find('li.hasSub').on('click swipeleft', function(e){
			// get the screen size
			var viewport = $.viewport() || null;

			if(viewport && (viewport.width <= 767) && !$nav.data('animating')){
				// we're on a small screen

				// check the clicked element - ensure that it's not a child of hasSub
				var target = $(e.target);
				if(target.hasClass('hasSub') || ((target.prop('tagName').toUpperCase() != 'UL') && target.parent().hasClass('hasSub'))){
					// we're on an actual hasSub element

					var $parent = $(this),						// get the holder li element
						$subs = $parent.children('ul').show();	// get the sub nav and show it
					// ensure that we have a sub nav
					if($subs.length){
						$nav.data('animating', true);

						$inner.find('li.active').removeClass('active');
						$parent.addClass('active');

						// set the nav container height to that of the sub navs
						$nav.height(getHeight($subs, $top));

						// slide the sub nav into view
						var offset = (((parseFloat($inner.css('left')) / $nav.width()) * 100) - 100) + '%';
						$inner.stop(true, true).animate({left:offset}, animSpeed, function(){
							$nav.data('animating', false);
						});

						e.preventDefault();
					}
				}
			}
			e.stopPropagation();
		});

		/**
		 * Add click handler for slide back up the nav hierarchy, on small screens
		 */
		$inner.find('li.backBtn').on('click swiperight', function(e){
			// get the screen size
			var viewport = $.viewport() || null;

			if(viewport && (viewport.width <= 767) && !$nav.data('animating')){
				// we're on a small screen

				var $parent = $(this).parents('.hasSub:first');

				$nav.data('animating', true);

				$inner.find('li.active').removeClass('active');
				$parent.parents('li.hasSub').addClass('active');

				// set the nav container height to that of the parent nav's parent (so we show all of it's siblings too)
				$nav.height(getHeight($parent.parent('ul').parent().children('ul'), $top));

				// slide the nav back to show the parent
				//var offset = parseFloat($inner.css('left')) + parseFloat($nav.innerWidth());
				var offset = (((parseFloat($inner.css('left')) / $nav.width()) * 100) + 100);
				offset = (offset > 0) ? 0 : offset + '%';
				$inner.stop(true, true).animate({left:offset}, animSpeed, function(){
					// hide the children (this stops them overlapping
					$parent.children('ul').hide();

					$nav.data('animating', false);
				});

				e.preventDefault();
			}
			e.stopPropagation();
		});

		/**
		 * Click handler for the menu show/hide button
		 */
		$top.children('span.menuBtn').on('click', function(){
			// get the screen size
			var viewport = $.viewport() || null;

			if(viewport && (viewport.width <= 767)){
				// we're on a small screen
				if($nav.hasClass('active')){
					// nav is visible - hide it
					$nav.removeClass('active').height('auto');
					$inner.stop(true, true).slideUp(animSpeed);
				}else{
					// nav is hidden - show it
					$nav.addClass('active').height('auto');
					$inner.stop(true, true).css('left', 0).slideDown(animSpeed);
				}
			}
		});

		/**
		 * Ensure that the nav container is
		 * the correct height on small screens
		 */
		$(window).on('ready resize', function(){
			var viewport = $.viewport() || null;

			if(viewport && (viewport.width <= 767)){
				// we're on a small screen

				// if nav is not active, hide the inner container
				if($nav.hasClass('active')){
					$inner.show();

					// define a fixed height on the nav
					$nav.height(getHeight($inner.find('li.active:first').children('ul'), $top));
				}else{
					$inner.hide();
					console.log($top.outerHeight());
					$nav.height('auto');
				}
			}else{
				// we're not on a small screen - remove any style attributes
				$nav.removeAttr('style').removeClass('active');
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