/**
 * Adds accordion functionality
 *
 * @return {*}
 */
methods.tabs = function(userOptions){
	var defaultOptions = {
		animSpeed:200,
		animType:'fade'
	};
	var options = $.extend(defaultOptions, userOptions);

	// loop through each element and add the tab functionality
	// return 'this' to allow chain-ability
	return this.each(function(){
		var tabs = $(this),				// the tab element
			data = tabs.data('bill');	// the tab data

		// only add the accordion if it hasn't already been initiated on the object
		if(!data || !data.tabs){
			// get the tab elements
			var tabBtns = tabs.children(':first'),
				panes = null;

			if(tabBtns.get(0).nodeName == 'UL'){
				// first element is a list - we assume it's a list of tab links
				// get a list of the panes
				panes = tabs.children().not(tabBtns);
			}else{
				// first element isn't a list - assume that tab titles will come from within the content

				var tabHtml = '<ul>';

				// loop through each tabs child and get their headers
				tabs.children().each(function(i){
					// find the first heading element
					var pane = $(this),																					// the tab pane
						id = pane.prop('id') || 'tab-' + (new Date().getTime()) + '-' + Math.floor(Math.random()*1000),	// the pane ID
						header = $(this).children('h1,h2,h3,h4,h5,h6').first(),											// the header element
						label = (header.length > 0) ? header.text() : pane.attr('data-label') || 'Tab ' + (i+1);

					// ensure that the pane has an ID
					pane.prop('id', id);
					panes = (panes == null) ? pane : panes.add(pane);

					// define the tab text - if no header is found, use a placeholder
					tabHtml += '<li>' +
									'<a href="#' + id + '">' + label + '</a>' +
							'</li>';
				});

				tabHtml += '</ul>';
				tabBtns = $(tabHtml).prependTo(tabs);
			}

			if(tabBtns && (tabBtns.length > 0)){
				// tab buttons exist

				// get the link elements
				tabBtns = tabBtns.find('> li > a');


				// add the click handler, to show panes
				tabBtns.on('click', function(e){
					var tab = $(this),							// the tab element
						pane = panes.filter(tab.attr('href'));	// the corresponding pane element

					// stop any active animation
					panes.stop(true, true);

					// remove active class on all tabs
					tabBtns.removeClass('active');
					// add the active class to the current title
					tab.addClass('active');

					if(options.animType){
						switch(options.animType){
							// animate
							case 'slide':
								panes.not(pane).slideUp(options.animSpeed);
								pane.slideDown(options.animSpeed);
							break;
							default:
								panes.hide();
								pane.fadeIn(options.animSpeed);
							break;
						}
					}else{
						// no animation - just show
						panes.hide();
						pane.show();
					}

					// stop the default click event
					e.preventDefault();
				});


				// show an active tab
				var animType = options.animType,					// the current animation type
					activeBtn = tabBtns.filter('.active:first');	// check for a button with class 'active'
				// if no tab buttons have a class of active, just go with the first tab
				activeBtn = (activeBtn.length == 0) ? tabBtns.first() : activeBtn;

				// set no anim type, so that the tab appears immediately
				options.animType = null;

				// trigger the click event
				activeBtn.triggerHandler('click');

				// reset the animation type
				options.animType = animType;
			}
		}else if(userOptions){
			// accordion already exists, but options have been updated
			tabs.data('bill', $.extend(data || {}, {tabs:options}));
		}
	});
};

// call the accordion functionality
$('.tabs').bill('tabs');