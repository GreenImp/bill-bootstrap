/**
 * Bill.tabs
 *
 * Adds tabs functionality
 */
;(function($, window, document, undefined){
	"use strict";

	Bill.libs.tabs = {
		name:'Tabs',
		version:'0.1.0',
		nameSpace:Bill.eventNameSpace + '.tabs',
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
				if($elm.get(0).nodeName == 'DL'){
					// the tab element is a definition list
					panes = $elm.children('dd');
					tabBtns = $elm.children('dt');

					// loop through and ensure that all of them contain links
					tabBtns.each(function(){
						var btn = $(this);
						if(btn.children('a:first').length == 0){
							// dd contains no link
							var pane = btn.next('dd:first'),																		// the tab pane
								id = pane.prop('id') || 'tab-' + (new Date().getTime()) + '-' + Math.floor(Math.random()*10000);	// the pane ID
							// wrap the dt contents in the link (wrapinner doesn't always work here)
							btn.html('<a href="#' + id + '">' + btn.text() + '</a>');
							// assign the ID to the pane
							pane.prop('id', id);
						}
					});

					$elm.prepend(tabBtns);
				}

				// store the options in the element data
				data.init = true;
				$elm.data(this.nameSpace, data);
			}else{
				// store the options in the element data
				$elm.data(this.nameSpace, data);
			}

			return data.init;
		}
	};
})(jQuery, window, document);


;methods.tabs = function(userOptions){
	'use strict';

	var defaultOptions = {
		animSpeed:200
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
			var tabBtns = null,	// the tab buttons
				panes = null;	// the tab panes

			// set the accordion data
			tabs.data('bill', $.extend(data || {}, {tabs:options}));

			if(tabs.get(0).nodeName == 'DL'){
				// the tab element is a definition list
				panes = tabs.children('dd');
				tabBtns = tabs.children('dt');

				// loop through and ensure that all of them contain links
				tabBtns.each(function(){
					var btn = $(this);
					if(btn.children('a:first').length == 0){
						// dd contains no link
						var pane = btn.next('dd:first'),																		// the tab pane
							id = pane.prop('id') || 'tab-' + (new Date().getTime()) + '-' + Math.floor(Math.random()*10000);	// the pane ID
						// wrap the dt contents in the link (wrapinner doesn't always work here)
						btn.html('<a href="#' + id + '">' + btn.text() + '</a>');
						// assign the ID to the pane
						pane.prop('id', id);
					}
				});

				tabs.prepend(tabBtns);
			}else{
				tabBtns = tabs.children(':first');
				var firstType = tabBtns.get(0).nodeName;

				if(firstType == 'UL'){
					// first element is a list - we assume it's a list of tab links
					// get a list of the panes
					panes = tabs.children().not(tabBtns);
					tabBtns = tabBtns.children('li');
				}else{
					// first element isn't a list - assume that tab titles will come from within the content
					var tabHtml = '<ul>';

					// loop through each tabs child and get their headers
					tabs.children().each(function(i){
						// find the first heading element
						var pane = $(this),																						// the tab pane
								id = pane.prop('id') || 'tab-' + (new Date().getTime()) + '-' + Math.floor(Math.random()*10000),	// the pane ID
								header = $(this).children('h1,h2,h3,h4,h5,h6').first(),												// the header element
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
					tabBtns = $(tabHtml).prependTo(tabs).children('li');
				}
			}


			if(tabBtns && (tabBtns.length > 0)){
				// tab buttons exist

				// add a class of 'pane' to all of the panes
				panes.addClass('pane');
				tabBtns.addClass('tab');

				// get the link elements
				tabBtns = tabBtns.find('a');


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
				var animType = options.animType,	// the current animation type
					// check for an active button
					// if a hash has been defined, check for a button matching it,
					// otherwise look for a button with class 'active'
					activeBtn = location.hash ?
								$(tabBtns.filter('[href="' + location.hash + '"]:first')[0] || tabBtns.filter('.active:first')[0])
								:
								tabBtns.filter('.active:first');
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