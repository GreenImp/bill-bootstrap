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
			animSpeed:200
		},
		init:function(scope, method, options){
			this.scope = scope || this.scope;

			var $elm = $(this.scope),
				data = $.extend($elm.data(this.nameSpace) || {}, this.options);

			if(typeof method === 'object'){
				// method is actually options
				$.extend(data, method);
			}else{
				$.extend(data, options);
			}

			// only continue if the functionality hasn't already been initialised
			if(!data.init){
				// wrap the contents with the 'inner' container
				$elm.wrapInner('<div class="inner">');

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
									if(!$child.children('.backBtn:first').length){
										$child.prepend('<li class="backBtn">' + ($elm.attr('data-text-back') || 'Back') + '</li>');
									}
								});
							}
						});

				// store the options in the element data
				data.init = true;
				$elm.data(this.nameSpace, data);

				this.on();
			}else{
				// store the options in the element data
				$elm.data(this.nameSpace, data);
			}

			return data.init;
		},
		/**
		 * Activates the plugin
		 */
		on:function(){
			var lib = this,
				$elm = $(this.scope),
				$inner = $elm.children('div.inner:first'),
				$top = $elm.children('div.top:first');

			// add dynamic class, so that we can style appropriately
			$elm.addClass('dynamic');

			/**
			 * Add click handler for showing sub navigation on small screens
			 */
			$inner.find('li.hasSub').on('click' + this.nameSpace + ' swipeleft' + this.nameSpace, function(e){
				// get the screen size
				var data = $elm.data(lib.nameSpace);

				if($.viewport.isSmall() && !$elm.data('animating')){
					// we're on a small screen

					// check the clicked element - ensure that it's not a child of hasSub
					var target = $(e.target);
					if(target.hasClass('hasSub') || ((target.prop('tagName').toUpperCase() != 'UL') && target.parent().hasClass('hasSub'))){
						// we're on an actual hasSub element

						var $parent = $(this),						// get the holder li element
							$subs = $parent.children('ul').show();	// get the sub nav and show it
						// ensure that we have a sub nav
						if($subs.length){
							$elm.data('animating', true);

							$inner.find('li.active').removeClass('active');
							$parent.addClass('active');

							// set the nav container height to that of the sub navs
							$elm.height(lib.getHeight($subs, $top));

							// slide the sub nav into view
							var offset = (((parseFloat($inner.css('left')) / $elm.width()) * 100) - 100) + '%';
							$inner.stop(true, true).animate({left:offset}, data.animSpeed, function(){
								$elm.data('animating', false);
							});
						}
					}
				}

				e.stopPropagation();
			});

			/**
			 * Add click handler for slide back up the nav hierarchy, on small screens
			 */
			$inner.find('li.backBtn').on('click' + this.nameSpace + ' swiperight' + this.nameSpace, function(e){
				// get the screen size
				var data = $elm.data(lib.nameSpace);

				if($.viewport.isSmall() && !$elm.data('animating')){
					// we're on a small screen

					var $parent = $(this).parents('.hasSub:first');

					$elm.data('animating', true);

					$inner.find('li.active').removeClass('active');
					$parent.parents('li.hasSub').addClass('active');

					// set the nav container height to that of the parent nav's parent (so we show all of it's siblings too)
					$elm.height(lib.getHeight($parent.parent('ul').parent().children('ul'), $top));

					// slide the nav back to show the parent
					var offset = (((parseFloat($inner.css('left')) / $elm.width()) * 100) + 100);
					offset = (offset > 0) ? 0 : offset + '%';
					$inner.stop(true, true).animate({left:offset}, data.animSpeed, function(){
						// hide the children (this stops them overlapping
						$parent.children('ul').hide();

						$elm.data('animating', false);
					});
				}

				e.stopPropagation();
			});

			/**
			 * Click handler for the menu show/hide button
			 */
			$top.children('span.menuBtn').on('click' + this.nameSpace, function(e){
				// get the screen size
				var data = $elm.data(lib.nameSpace);

				if($.viewport.isSmall()){
					// we're on a small screen
					if($elm.hasClass('active')){
						// nav is visible - hide it
						$elm.removeClass('active').height('auto');
						$inner.stop(true, true).slideUp(data.animSpeed);
					}else{
						// nav is hidden - show it
						$elm.addClass('active').height('auto');
						$inner.stop(true, true).css('left', 0).slideDown(data.animSpeed);
					}
				}

				e.preventDefault();
			});

			/**
			 * Ensure that the nav container is
			 * the correct height on small screens
			 */
			$(window).on('ready' + this.nameSpace + ' resize' + this.nameSpace, function(){
				if($.viewport.isSmall()){
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
		},
		/**
		 * De-activates the plugin
		 */
		off:function(){
			var $elm = $(this.scope).removeClass('dynamic active').removeAttr('style'),
				$inner = $elm.children('div.inner:first').removeAttr('style');

			$inner.find('ul').removeAttr('style');

			$inner.find('li.hasSub').off(this.nameSpace);
			$inner.find('li.backBtn').off(this.nameSpace);

			$elm.children('div.top:first').children('span.menuBtn').off(this.nameSpace);

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