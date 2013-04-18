/**
 * Adds accordion functionality
 *
 * @return {*}
 */
methods.accordion = function(userOptions){
	var defaultOptions = {
		animSpeed:200,
		animType:'slide',
		collapsible:false,
		accordion:true
	};
	var options = $.extend(defaultOptions, userOptions);

	// loop through each element and add the accordion functionality
	// return 'this' to allow chain-ability
	return this.each(function(){
		var accordion = $(this),			// the accordion element
			data = accordion.data('bill');	// the accordion data

		// only add the accordion if it hasn't already been initiated on the object
		if(!data || !data.accordion){
			// get the accordion element type
			var type = accordion.prop('tagName').toUpperCase(),
				titles = null,
				panes = null;

			if(type == 'DL'){
				// for dl elements we look for `> dt` (for titles) and `> dd` (for panes)
				// we ignore `.title` and `.pane` classes, as dl elements already define their own title and data
				titles = accordion.children('dt');

				if(titles.length == 0){
					// no titles found - end the element loop
					$.error('No title elements found on bill.accordion object');
					return this;
				}

				// find the panes
				// loop through each title and find the next sibling
				// this will stop it from matching too many objects, as panes
				titles.each(function(){
					// add the pane to the list
					var pane = $(this).next('dd').addClass('pane');
					panes = (panes == null) ? pane : panes.add(pane);
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
				titles = accordion.find('> ' + queryPrefixTitle + '.title');
				if(titles.length == 0){
					// no titles found - check for h{1-6} elements

					// loop through until we find a heading tag - this gives us the highest number headers
					for(var i = 1; i <= 6; i++){
						titles = accordion.find('> ' + queryPrefixTitle + 'h' + i);
						if(titles.length > 0){
							// heading found - end the loop
							i = 7;
						}
					}

					if(titles.length == 0){
						// still no titles found - end the element loop
						$.error('No title elements found on bill.accordion object');
						return this;
					}
				}


				// find the panes
				// loop through each title
				titles.each(function(){
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
					panes = (panes == null) ? pane : panes.add(pane);
				});
			}

			// set the accordion data
			accordion.data('bill', $.extend(data || {}, {accordion:options}));

			// hide all of the panes
			panes.hide();

			/**
			 * Adds the click handler for title elements
			 */
			titles
					.addClass('title')			// ensure that the titles have the `title` class
					.on('click', function(e){	// add the click event for displaying panes
						// stop the default click event
						e.preventDefault();

						var title = $(this),						// the title element
							pane = panes.eq(titles.index(title));	// the corresponding pane element

						// stop any active animation
						panes.stop(true, true);

						if(title.hasClass('active')){
							// panel is already active - collapse, if we are allowed
							if(options.collapsible){
								// remove the active class from the title
								title.removeClass('active');

								if(options.animType){
									// animate
									switch(options.animType){
										case 'fade':
											pane.fadeOut(options.animSpeed);
										break;
										default:
											pane.slideUp(options.animSpeed);
										break;
									}
								}else{
									// no animation - just hide
									pane.hide();
								}
							}
						}else{
							// panel not active
							if(options.accordion){
								// this is a true accordion - remove active class on all titles
								titles.removeClass('active');
							}
							// add the active class to the current title
							title.addClass('active');

							if(options.animType){
								switch(options.animType){
									// animate
									case 'fade':
										if(options.accordion){
											// true accordion - hide the other panes
											// we don't fade them out, otherwise it conflicts with
											// the position of the active pane
											panes.hide();
										}
										pane.fadeIn(options.animSpeed);
									break;
									default:
										if(options.accordion){
											// true accordion - hide the other panes
											panes.not(pane).slideUp(options.animSpeed);
										}
										pane.slideDown(options.animSpeed);
									break;
								}
							}else{
								// no animation - just show
								panes.hide();
								pane.show();
							}
						}
					});

			// if accordion is not collapsible, we must always have one pane open
			// trigger the click event on the first element
			if(!options.collapsible){
				var animType = options.animType,					// the current animation type
					activeTitle = titles.filter('.active:first');	// check for a button with class 'active'
				// if no tab buttons have a class of active, just go with the first tab
				activeTitle = !activeTitle.length ? titles.first() : activeTitle;

				// set no anim type, so that the tab appears immediately
				options.animType = null;

				// trigger the click event
				activeTitle.triggerHandler('click');

				// reset the animation type
				options.animType = animType;
			}
		}else if(userOptions){
			// accordion already exists, but options have been updated
			accordion.data('bill', $.extend(data || {}, {accordion:options}));
		}
	});
};

// call the accordion functionality
$('.accordion').bill('accordion');