/**
 * Bill.accordion
 *
 * Adds accordion functionality
 */
;(function($, window, document, undefined){
	"use strict";

	Bill.libs.accordion = {
		name:'Accordion',
		version:'0.1.0',
		nameSpace:Bill.eventNameSpace + '.accordion',
		options:{
			animSpeed:200,
			animType:'slide',
			collapsible:false,
			accordion:true,
			titleSelector:'title',
			paneSelector:'pane'
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

				$(this.scope).find('[data-accordion]').each(function(){
					var $elm = $(this),
						type = $elm.prop('tagName').toUpperCase(),	// get the 6accordion element type
						$titles,
						$panes;

					if(type == 'DL'){
						// for dl elements we look for `> dt` (for titles) and `> dd` (for panes)
						// we ignore `.title` and `.pane` classes, as dl elements already define their own title and data
						$titles = $elm.children('dt');

						if(!$titles.length){
							// no titles found
							Bill.error({
								name:lib.name,
								message:'No title elements found on bill.accordion object',
								file:'accordion.js',
								line:54
							});
							return;
						}

						// find the panes
						// loop through each title and find the next sibling
						// this will stop it from matching too many objects, as panes
						$titles.each(function(){
							var $pane = $(this).next('dd').addClass(lib.options.paneSelector);
							// add the pane to the list
							$panes = $panes ? $panes.add($pane) : $pane;
						});
					}else{
						var queryPrefixTitle = '',
							queryPrefixPane = '';

						if((type == 'UL') || (type == 'OL')){
							// for ul/ol elements, we look for `> li > .title/.pane` elements
							// add a title prefix to match within the direct li child
							queryPrefixTitle = 'li > ';
						}

						// we look for `> .title/.pane`
						// if none found, look for `> h{1-6}` (for titles) and direct sibling (for panes)
						$titles = $elm.find('> ' + queryPrefixTitle + '.' + lib.options.titleSelector);
						if(!$titles.length){
							// no titles found - check for h{1-6} elements

							// loop through until we find a heading tag - this gives us the highest number headers
							for(var i = 1; i <= 6; i++){
								$titles = $elm.find('> ' + queryPrefixTitle + 'h' + i);
								if($titles.length){
									// heading found - end the loop
									i = 7;
								}
							}

							if(!$titles.length){
								// still no titles found - end the element loop
								Bill.error({
									name:lib.name,
									message:'No title elements found on bill.accordion object',
									file:'accordion.js',
									line:98
								});
								return false;
							}
						}


						// find the panes
						// loop through each title
						$titles.each(function(){
							// add the pane to the list.
							// For the pane, we only match the element if it:
							// Has a class of `pane` or is a specific element type
							// and doesn't have a class of title
							var $pane = $(this)
								.next(
									queryPrefixPane + '.pane, ' +
										queryPrefixPane + 'div:not(.title), ' +
										queryPrefixPane + 'article:not(.title), ' +
										queryPrefixPane + 'section:not(.title), ' +
										queryPrefixPane + 'aside:not(.title)'
								)
								.addClass(lib.options.paneSelector);
							// add the pane to the list
							$panes = $panes ? $panes.add($pane) : $pane;
						});
					}

					$titles.addClass(lib.options.titleSelector);	// ensure that the titles have the `title` class

					if($panes && $panes.length){
						$panes.hide();	// hide all of the panes

						// if accordion is not collapsible, we must always have one pane open
						// trigger the click event on the first element
						if(!lib.options.collapsible){
							var animType = lib.options.animType,				// the current animation type
								activeTitle = $titles.filter('.active:first');	// check for a button with class 'active'
							// if no tab buttons have a class of active, just go with the first tab
							activeTitle = !activeTitle.length ? $titles.first() : activeTitle;

							// set no animation type, so that the tab appears immediately
							lib.options.animType = null;

							// trigger the click event
							activeTitle.click();

							// reset the animation type
							lib.options.animType = animType;
						}
					}
				});

				this.options.init = true;
			}

			return this.options.init;
		},
		/**
		 * Activates the plugin
		 */
		on:function(){
			var lib = this;

			/**
			 * Adds the click handler for title elements
			 */
			$(this.scope).on('click' + this.nameSpace, '[data-accordion] .' + lib.options.titleSelector, function(e){
				var $title = $(this),											// the title element
					$container = $title.closest('[data-accordion]'),			// the container element
					$pane = $title.next('.' + lib.options.paneSelector);		// the corresponding pane element

				// check for a callback on the click event
				if(typeof lib.options.onClick === 'function'){
					// a callback function has been defined
					if(false === lib.options.onClick.call(lib.scope, $title, $container)){
						// callback function returned false - end the event
						e.preventDefault();
						return false;
					}
				}

				if($title.hasClass('active')){
					// panel is already active - collapse, if we are allowed

					$pane.stop(true, true).show();

					if(lib.options.collapsible){
						// remove the active class from the title
						$title.removeClass('active');

						switch(lib.options.animType || 'show'){
							// animate
							case 'fade':
								$pane.fadeOut(lib.options.animSpeed);
							break;
							case 'slide':
								$pane.slideUp(lib.options.animSpeed);
							break;
							default:
								// no animation - just hide
								$pane.hide();
							break;
						}
					}
				}else{
					// panel not active

					// get a list of all the panes (and stop any animations)
					var $panes = $container.find('.' + lib.options.paneSelector).stop(true, true);

					if(lib.options.accordion){
						// this is a true accordion - remove active class on all titles
						$container.find('.' + lib.options.titleSelector).removeClass('active');
					}
					// add the active class to the current title
					$title.addClass('active');

					switch(lib.options.animType || 'show'){
						// animate
						case 'fade':
							if(lib.options.accordion){
								// true accordion - hide the other panes
								// we don't fade them out, otherwise it conflicts with
								// the position of the active pane
								$panes.hide();
							}
							$pane.fadeIn(lib.options.animSpeed);
						break;
						case 'slide':
							if(lib.options.accordion){
								// true accordion - hide the other panes
								$panes.not($pane).slideUp(lib.options.animSpeed);
							}
							$pane.slideDown(lib.options.animSpeed);
						break;
						default:
							// no animation - just show
							$panes.hide();
							$pane.show();
						break;
					}
				}

				// stop the default click event
				e.preventDefault();
			});
		},
		/**
		 * De-activates the plugin
		 */
		off:function(){
			$(this.scope).off(this.nameSpace);
		}
	};
})(jQuery, window, document);