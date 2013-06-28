/**
 * Bill.navigation
 *
 * Handles navigation menus
 */
;(function($, window, document, undefined){
	"use strict";

	Bill.libs.navigation = {
		name:'Navigation',
		version:'0.1.0',
		nameSpace:Bill.eventNameSpace + '.navigation',
		options:{
			animSpeed:200,
			backButton:'Back'
		},
		init:function(scope, method, options){
			this.scope = scope || this.scope;

			if(typeof method === 'object'){
				// method is actually options
				$.extend(true, this.options, method);
			}else if(typeof method === 'string'){
				// call the method and return
				return this[method].call(this, options);
			}

			if(!this.options.init){
				var lib = this;

				this.on();

				$(this.scope).find('[data-nav]').each(function(){
					var $elm = $(this);

					// wrap the contents with the 'inner' container
					$elm.addClass('dynamic').wrapInner('<div class="inner">');

					var $inner = $elm.children('div.inner:first'),	// get the 'inner' element
						$top = $('<div class="top">' +				// build the top bar
									'<span class="menuBtn">Menu</span>' +
								'</div>');

					// add the top bar to the nav to the nav
					$top.append($inner.children('.title')).prependTo($elm);

					// loop through all of the li elements and check if they have children
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
										if(!$child.children('.backBtn').length){
											$child.prepend('<li class="backBtn">' + ($elm.attr('data-text-back') || lib.options.backButton) + '</li>');
										}
									});
								}
							});
				});

				this.options.init = true;
			}

			return this.options.init;
		},
		/**
		 * Activates the plugin
		 */
		on:function(){
			var lib = this,
				$scope = $(this.scope);

			/**
			 * Handles click/swipes on elements that have sub navigation
			 */
			$scope.on('click' + this.nameSpace + ' swipeleft' + this.nameSpace, '[data-nav] li.hasSub', function(e){
				if(Bill.extension('viewport', 'isSmall') && !lib.animating){
					// we're on a small screen

					// check the clicked element - ensure that it's not a child of hasSub
					var $target = $(e.target);	// the click target
					if($target.hasClass('hasSub') || (($target.prop('tagName').toUpperCase() != 'UL') && $target.parent().hasClass('hasSub'))){
						// we're on an actual hasSub element

						var $parent = $(this),							// get the holder li element
							$subs = $parent.children('ul').show(),		// get the sub nav and show it
							$elm = $parent.closest('[data-nav]'),		// the nav element
							$inner = $elm.children('div.inner:first'),	// the nav inner
							$top = $elm.children('div.top:first'),		// the nav top
							isRTL = Bill.isRTL($elm);					// flag - whether the nav is in RTL mode

						// ensure that we have a sub nav
						if($subs.length){
							lib.animating = true;

							$inner.find('li.active').removeClass('active');
							$parent.addClass('active');

							// set the nav container height to that of the sub navs
							$elm.height(lib.getHeight($subs, $top));

							// get the current offset
							var offset = $inner.css(isRTL ? 'right' : 'left');
							// ensure that the offset is in percent (some browsers return pixel) then decrement
							offset = ((/%$/.test(offset) ? parseFloat(offset) : (parseFloat(offset) / $elm.width()) * 100) - 100) + '%';

							// slide the sub nav into view
							$inner.stop(true, true).animate(isRTL ? {right:offset} : {left:offset}, lib.options.animSpeed, function(){
								lib.animating = false;
							});

							e.preventDefault();
						}
					}
				}

				e.stopPropagation();
			});

			/**
			 * Handles clicks/swipes on navigation back buttons
			 */
			$scope.on('click' + this.nameSpace + ' swiperight' + this.nameSpace, '[data-nav] li.backBtn', function(e){
				if(Bill.extension('viewport', 'isSmall') && !lib.animating){
					// we're on a small screen

					var $parent = $(this).closest('li.hasSub'),		// get the holder li element
						$elm = $parent.closest('[data-nav]'),		// the nav element
						$inner = $elm.children('div.inner:first'),	// the nav inner
						$top = $elm.children('div.top:first'),		// the nav top
						isRTL = Bill.isRTL($elm);					// flag - whether the nav is in RTL mode

					lib.animating = true;

					$parent.removeClass('active');
					$parent.closest('li.hasSub').addClass('active');

					// set the nav container height to that of the parent nav's parent (so we show all of it's siblings too)
					$elm.height(lib.getHeight($parent.parent('ul').parent().children('ul'), $top));

					// get the current offset
					var offset = $inner.css(isRTL ? 'right' : 'left');
					// ensure that the offset is in percent (some browsers return pixel) then increment
					offset = ((/%$/.test(offset) ? parseFloat(offset) : (parseFloat(offset) / $elm.width()) * 100) + 100) + '%';

					// slide the nav back to show the parent
					$inner.stop(true, true).animate(isRTL ? {right:offset} : {left:offset}, lib.options.animSpeed, function(){
						// hide the children (this stops them overlapping
						$parent.children('ul').hide();

						lib.animating = false;
					});

					e.preventDefault();
				}

				e.stopPropagation();
			});

			/**
			 * Click handler for the menu show/hide button
			 */
			$scope.on('click' + this.nameSpace, '[data-nav] > div.top span.menuBtn', function(e){
				var isSmall = Bill.extension('viewport', 'isSmall');

				if(typeof lib.options.menuOnClick === 'function'){
					// a callback function has been defined for the menu button click
					if(false === lib.options.menuOnClick.call(lib.scope,isSmall)){
						// callback function returned false - end the event
						e.preventDefault();
						return false;
					}
				}

				if(isSmall){
					// we're on a small screen

					var $elm = $(this).closest('[data-nav]'),
						$inner = $elm.children('div.inner:first'),
						isRTL = Bill.isRTL($elm);					// flag - whether the nav is in RTL mode

					if($elm.hasClass('active')){
						// nav is visible - hide it
						$elm.removeClass('active').height('auto');
						$inner.stop(true, true).slideUp(lib.options.animSpeed, function(){
							if(typeof lib.options.menuOnClickEnd === 'function'){
								// a callback function has been defined for the menu button click
								lib.options.menuOnClickEnd.call(lib.scope, $elm);
							}
						});
					}else{
						// nav is hidden - show it
						$elm.addClass('active').height('auto');
						$inner.stop(true, true).css(isRTL ? 'right' : 'left', 0).slideDown(lib.options.animSpeed, function(){
							if(typeof lib.options.menuOnClickEnd === 'function'){
								// a callback function has been defined for the menu button click
								lib.options.menuOnClickEnd.call(lib.scope, $elm);
							}
						});
					}
				}

				e.preventDefault();
			});

			/**
			 * Ensure that the nav container is
			 * the correct height on small screens
			 */
			$(window).on('ready' + this.nameSpace + ' resize' + this.nameSpace, function(){
				var isSmall = Bill.extension('viewport', 'isSmall');
				$('[data-nav]').each(function(){
					var $elm = $(this),
						$top = $elm.children('div.top:first'),
						$inner = $elm.children('div.inner:first');

					if(isSmall){
						// we're on a small screen

						// if nav is not active, hide the inner container
						if($elm.hasClass('active')){
							$inner.show();

							// define a fixed height on the nav
							$elm.height(lib.getHeight($inner.find('li.active:first').children('ul'), $top));
						}else{
							$inner.hide();
							$elm.height('auto');
						}
					}else{
						// we're not on a small screen - remove any style attributes
						$elm.removeAttr('style').removeClass('active');
						$inner
							.removeAttr('style')
							.find('ul')
								.removeAttr('style');
					}
				});
			});
		},
		/**
		 * De-activates the plugin
		 */
		off:function(){
			$(this.scope).off(this.nameSpace);
			$(window).off(this.nameSpace);
		},
		/**
		 * Returns the height of the element,
		 * including the height of $top
		 *
		 * @param $elm
		 * @param $top
		 * @returns {number}
		 */
		getHeight:function($elm, $top){
			var height = 0;
			// loop through all ul elements at the same level and calculate their height
			$elm.each(function(){
				height += $(this).outerHeight(true);
			});

			return height ? height + ($top.outerHeight() || 0) : 'auto';
		}
	};
})(jQuery, window, document);