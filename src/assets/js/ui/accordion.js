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
			accordion:true
		},
		init:function(scope, method, options){
			this.scope = scope || this.scope;

			var lib = this,
				$elm = $(this.scope),
				data = $elm.data(this.nameSpace);

			if(typeof method === 'object'){
				// method is actually options
				$.extend(true, data, method);
			}else{
				$.extend(true, data, options);
			}

			// only continue if the accordion hasn't already been initialised
			console.log(data.init);
			if(!data.init){
				var type = $elm.prop('tagName').toUpperCase();	// get the accordion element type
				data.titles = null;
				data.panes = null;

				if(type == 'DL'){
					// for dl elements we look for `> dt` (for titles) and `> dd` (for panes)
					// we ignore `.title` and `.pane` classes, as dl elements already define their own title and data
					data.titles = $elm.children('dt');

					if(data.titles.length == 0){
						// no titles found - end the element loop
						Bill.error({
							name:this.name,
							message:'No title elements found on bill.accordion object',
							file:'accordion.js',
							line:42
						});
						return false;
					}

					// find the panes
					// loop through each title and find the next sibling
					// this will stop it from matching too many objects, as panes
					data.titles.each(function(){
						// add the pane to the list
						var pane = $(this).next('dd').addClass('pane');
						lib.panes = (lib.panes == null) ? pane : lib.panes.add(pane);
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
					data.titles = $elm.find('> ' + queryPrefixTitle + '.title');
					if(data.titles.length == 0){
						// no titles found - check for h{1-6} elements

						// loop through until we find a heading tag - this gives us the highest number headers
						for(var i = 1; i <= 6; i++){
							data.titles = $elm.find('> ' + queryPrefixTitle + 'h' + i);
							if(data.titles.length > 0){
								// heading found - end the loop
								i = 7;
							}
						}

						if(data.titles.length == 0){
							// still no titles found - end the element loop
							Bill.error({
								name:this.name,
								message:'No title elements found on bill.accordion object',
								file:'accordion.js',
								line:85
							});
							return false;
						}
					}


					// find the panes
					// loop through each title
					data.titles.each(function(){
						// add the pane to the list
						// for the pane, we only match the element if it:
						// Has a class of `pane` or is a specific element type
						// and doesn't have a class of title
						var pane = $(this)
										.next(
											queryPrefixPane + '.pane, ' +
											queryPrefixPane + 'div:not(.title), ' +
											queryPrefixPane + 'article:not(.title), ' +
											queryPrefixPane + 'section:not(.title), ' +
											queryPrefixPane + 'aside:not(.title)'
										)
										.addClass('pane');
						lib.panes = (lib.panes == null) ? pane : lib.panes.add(pane);
					});
				}

				// hide all of the panes
				data.panes.hide();

				this.on();

				data.init = true;
			}

			// store the options in the element data
			$elm.data(this.nameSpace, data);

			return data.init;
		},
		/**
		 * Activates the plugin
		 */
		on:function(){
			var lib = this,
				data = $(this.scope).data(this.nameSpace);

			/**
			 * Adds the click handler for title elements
			 */
			data.titles
					.addClass('title')							// ensure that the titles have the `title` class
					.on('click' + lib.nameSpace, function(e){	// add the click event for displaying panes
						// stop the default click event
						e.preventDefault();

						var title = $(this),								// the title element
							pane = lib.panes.eq(lib.titles.index(title));	// the corresponding pane element

						// stop any active animation
						lib.panes.stop(true, true);

						if(title.hasClass('active')){
							// panel is already active - collapse, if we are allowed
							if(lib.options.collapsible){
								// remove the active class from the title
								title.removeClass('active');

								if(lib.options.animType){
									// animate
									switch(lib.options.animType){
										case 'fade':
											pane.fadeOut(lib.options.animSpeed);
										break;
										default:
											pane.slideUp(lib.options.animSpeed);
										break;
									}
								}else{
									// no animation - just hide
									pane.hide();
								}
							}
						}else{
							// panel not active
							if(lib.options.accordion){
								// this is a true accordion - remove active class on all titles
								lib.titles.removeClass('active');
							}
							// add the active class to the current title
							title.addClass('active');

							if(lib.options.animType){
								switch(lib.options.animType){
									// animate
									case 'fade':
										if(lib.options.accordion){
											// true accordion - hide the other panes
											// we don't fade them out, otherwise it conflicts with
											// the position of the active pane
											lib.panes.hide();
										}
										pane.fadeIn(lib.options.animSpeed);
									break;
									default:
										if(lib.options.accordion){
											// true accordion - hide the other panes
											lib.panes.not(pane).slideUp(lib.options.animSpeed);
										}
										pane.slideDown(lib.options.animSpeed);
									break;
								}
							}else{
								// no animation - just show
								lib.panes.hide();
								pane.show();
							}
						}
					});

			// if accordion is not collapsible, we must always have one pane open
			// trigger the click event on the first element
			if(!data.collapsible){
				var animType = data.animType,						// the current animation type
					activeTitle = data.titles.filter('.active:first');	// check for a button with class 'active'
				// if no tab buttons have a class of active, just go with the first tab
				activeTitle = !activeTitle.length ? data.titles.first() : activeTitle;

				// set no anim type, so that the tab appears immediately
				data.animType = null;

				// trigger the click event
				activeTitle.triggerHandler('click' + this.nameSpace);

				// reset the animation type
				data.animType = animType;
			}
		},
		/**
		 * De-activates the plugin
		 */
		off:function(){
			$(this.scope).data(this.nameSpace).titles.off('click' + this.nameSpace);
		}
	};
})(jQuery, window, document);