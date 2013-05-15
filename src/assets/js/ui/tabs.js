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
			animSpeed:200,
			animType:'show'
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
				data.tabBtns = null;
				data.panes = null;

				if($elm.get(0).nodeName == 'DL'){
					// the tab element is a definition list
					data.panes = $elm.children('dd');
					data.tabBtns = $elm.children('dt');

					// loop through and ensure that all of them contain links
					data.tabBtns.each(function(){
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

					$elm.prepend(data.tabBtns);
				}else{
					data.tabBtns = $elm.children(':first');
					var firstType = data.tabBtns.get(0).nodeName;

					if(firstType == 'UL'){
						// first element is a list - we assume it's a list of tab links
						// get a list of the panes
						data.panes = $elm.children().not(data.tabBtns);
						data.tabBtns = data.tabBtns.children('li');
					}else{
						// first element isn't a list - assume that tab titles will come from within the content
						var tabHtml = '<ul>';

						// loop through each tabs child and get their headers
						$elm.children().each(function(i){
							// find the first heading element
							var pane = $(this),																						// the tab pane
									id = pane.prop('id') || 'tab-' + (new Date().getTime()) + '-' + Math.floor(Math.random()*10000),	// the pane ID
									header = $(this).children('h1,h2,h3,h4,h5,h6').first(),												// the header element
									label = (header.length > 0) ? header.text() : pane.attr('data-label') || 'Tab ' + (i+1);

							// ensure that the pane has an ID
							pane.prop('id', id);
							data.panes = (data.panes == null) ? pane : data.panes.add(pane);

							// define the tab text - if no header is found, use a placeholder
							tabHtml += '<li>' +
									'<a href="#' + id + '">' + label + '</a>' +
									'</li>';
						});

						tabHtml += '</ul>';
						data.tabBtns = $(tabHtml).prependTo($elm).children('li');
					}
				}

				if(data.tabBtns && (data.tabBtns.length > 0)){
					// tab buttons exist

					// add a class of 'pane' to all of the panes
					data.panes.addClass('pane');
					data.tabBtns.addClass('tab');

					// get the link elements
					data.tabBtns = data.tabBtns.find('a');

					// store the options in the element data
					data.init = true;
					$elm.data(this.nameSpace, data);

					this.on();
				}
			}else{
				// store the options in the element data
				$elm.data(this.nameSpace, data);
			}

			return data.init;
		},
		on:function(){
			var data = $(this.scope).data(this.nameSpace);

			// add the click handler, to show panes
			data.tabBtns.on('click' + this.nameSpace, function(e){
				var tab = $(this),								// the tab element
					pane = data.panes.filter(tab.attr('href'));	// the corresponding pane element

				// stop any active animation
				data.panes.stop(true, true);

				// remove active class on all tabs
				data.tabBtns.removeClass('active');
				// add the active class to the current title
				tab.addClass('active');

				if(data.animType && (data.animType != 'show')){
					switch(data.animType){
						// animate
						case 'slide':
							data.panes.not(pane).slideUp(data.animSpeed);
							pane.slideDown(data.animSpeed);
						break;
						case 'fade':
							data.panes.hide();
							pane.fadeIn(data.animSpeed);
						break;
						default:
							// no recognised animation - just show
							data.panes.hide();
							pane.show();
						break;
					}
				}else{
					// no animation - just show
					data.panes.hide();
					pane.show();
				}

				// stop the default click event
				e.preventDefault();
			});

			// show an active tab
			var animType = data.animType,	// the current animation type
				// check for an active button
				// if a hash has been defined, check for a button matching it,
				// otherwise look for a button with class 'active'
				activeBtn = location.hash ?
							$(data.tabBtns.filter('[href="' + location.hash + '"]:first')[0] || data.tabBtns.filter('.active:first')[0])
							:
							data.tabBtns.filter('.active:first');
			// if no tab buttons have a class of active, just go with the first tab
			activeBtn = (activeBtn.length == 0) ? data.tabBtns.first() : activeBtn;

			// set no anim type, so that the tab appears immediately
			data.animType = null;

			// trigger the click event
			activeBtn.triggerHandler('click' + this.nameSpace);

			// reset the animation type
			data.animType = animType;
		},
		off:function(){
			var data = $(this.scope).data(this.nameSpace).tabBtns.off('click' + this.nameSpace);
		}
	};
})(jQuery, window, document);