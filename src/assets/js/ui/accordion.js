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
			var titles = accordion.find('.title'),	// get the titles
				panes = null;						// hold a reference to the panes

			if(titles.length == 0){
				// no elements with class 'title' defined
				// loop through until we find a heading tag
				for(var i = 1; i <= 6; i++){
					titles = accordion.find('h' + i);
					if(titles.length > 0){
						i = 7;
					}
				}

				if(titles.length == 0){
					// still no titles found - end the element loop
					$.error('No title elements found on bill.accordion object');
					return this;
				}
			}

			// loop through each title and fine it's content pane
			titles.each(function(){
				var title = $(this),
					pane = title.next('.content');
				if(pane.length == 0){
					pane = title.next();

					if(pane.length == 0){
						// no pane found - end the title loop
						return false;
					}
				}

				// add the pane to the list
				panes = (panes == null) ? pane : panes.add(pane);
			});

			if(!panes || (panes.length != titles.length)){
				// number of panes doesn't match the number of titles
				$.error('Number of content panes doesn\'t match title count on bill.accordion object');
				return this;
			}

			// set the accordion data
			accordion.data('bill', $.extend(data || {}, {accordion:options}));

			// hide all of the panes
			panes.addClass('content').hide();

			/**
			 * Adds the click handler for title elements
			 */
			titles.addClass('title').on('click', function(){
				var title = $(this),
					pane = $(panes.get(titles.index(title)));

				// stop any active animation
				pane.stop(true, true);

				if(title.hasClass('active')){
					// panel is already active
					if(options.collapsible){
						title.removeClass('active');

						if(options.animType){
							switch(options.animType){
								case 'fade':
									pane.fadeOut(options.animSpeed);
								break;
								default:
									pane.slideUp(options.animSpeed);
								break;
							}
						}else{
							pane.hide();
						}
					}
				}else{
					// panel not active
					if(options.accordion){
						titles.removeClass('active');
					}
					title.addClass('active');

					if(options.animType){
						switch(options.animType){
							case 'fade':
								if(options.accordion){
									panes.hide();
								}
								pane.fadeIn(options.animSpeed);
							break;
							default:
								if(options.accordion){
									panes.not(pane).slideUp(options.animSpeed);
								}
								pane.slideDown(options.animSpeed);
							break;
						}
					}else{
						pane.show();
					}
				}

				return false;
			});
		}else if(userOptions){
			// accordion already exists, but options have been updated
			accordion.data('bill', $.extend(data || {}, {accordion:options}));
		}
	});
};

// call the accordion functionality
$('.accordion').bill('accordion');