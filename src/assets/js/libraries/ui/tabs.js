/**
 * Bill.tabs
 *
 * Adds tabs functionality
 */
;(function($, window, document, undefined){
	"use strict";

	Bill.libs.tabs = {
		name:'Tabs',
		version:'0.0.1',
		nameSpace:Bill.eventNameSpace + '.tabs',
		options:{
			animSpeed:200,
			animType:'show',
			tabSelector:'tab',
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

				$(this.scope).find('[data-tabs]').each(function(){
					var $elm = $(this),
						$tabs,
						$panes;

					if($elm.get(0).nodeName == 'DL'){
						// the tab element is a definition list
						$tabs = $elm.children('dt');
						$panes = $elm.children('dd');

						// loop through and ensure that all of them contain links
						$tabs.each(function(){
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

						// add the tabs to the container
						$elm.prepend($tabs);
					}else{
						$tabs = $elm.children(':first');
						var firstType = $tabs.get(0).nodeName;

						if(firstType == 'UL'){
							// first element is a list - we assume it's a list of tab links
							// get a list of the panes
							$panes = $elm.children().not($tabs);
							// set the tabs to the li elements
							$tabs = $tabs.children('li');
						}else{
							// first element isn't a list - assume that tab titles will come from within the content
							var tabHtml = '<ul>';

							// loop through each tabs child and get their headers
							$elm.children().each(function(i){
								// find the first heading element
								var $pane = $(this),																					// the tab pane
									id = $pane.prop('id') || 'tab-' + (new Date().getTime()) + '-' + Math.floor(Math.random()*10000),	// the pane ID
									header = $pane.children('h1,h2,h3,h4,h5,h6').first(),												// the header element
									label = header.length ? header.text() : $pane.attr('data-label') || 'Tab ' + (i+1);

								// ensure that the pane has an ID
								$pane.prop('id', id);
								// add the pane to the list
								$panes = $panes ? $panes.add($pane) : $pane;

								// define the tab text
								tabHtml += '<li>' +
												'<a href="#' + id + '">' + label + '</a>' +
											'</li>';
							});

							tabHtml += '</ul>';
							// add the tabs to the container and return the li elements as tabs
							$tabs = $(tabHtml).prependTo($elm).children('li');
						}
					}

					if($tabs && $tabs.length){
						// tab buttons exist

						// add classes to all of the tabs and panes
						$tabs.addClass(lib.options.tabSelector);
						$panes.addClass(lib.options.paneSelector);

						$tabs = $tabs.children('a');

						// show an active tab
						var animType = lib.options.animType,	// the current animation type
							// check for an active button
							// if a hash has been defined, check for a button matching it, otherwise set to null
							activeBtn = location.hash ? $tabs.filter('[href="' + location.hash + '"]:first') : null;

						if(!activeBtn || !activeBtn.length){
							// no active button found, from hash
							activeBtn = $tabs.filter('.active:first');
							activeBtn = !activeBtn.length ? $tabs.first() : activeBtn;
						}

						// set no animation type, so that the tab appears immediately
						lib.options.animType = null;

						// trigger the click event, to show only the active pane
						activeBtn.click();

						// reset the animation type
						lib.options.animType = animType;
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
			 * Adds click handler for tab titles
			 */
			$(this.scope).on('click' + this.nameSpace, '[data-tabs] .' + lib.options.tabSelector + ' a', function(e){
				var $tab = $(this),	// the clicked tab
					$container = $tab.closest('[data-tabs]'),						// the tab/pane container
					$tabs = $container.find('.' + lib.options.tabSelector + ' a'),	// list of tabs
					$panes = $container.find('.' + lib.options.paneSelector),		// list of panes
					$pane = $panes.filter($tab.attr('href'));						// pane the clicked tab corresponds to

				// check for a callback on the click event
				if(typeof lib.options.onClick === 'function'){
					// a callback function has been defined
					if(false === lib.options.onClick.call(lib.scope, $tab, $container)){
						// callback function returned false - end the event
						e.preventDefault();
						return false;
					}
				}

				// stop any active animation
				$panes.stop(true, true);

				// remove active class on all tabs
				$tabs.removeClass('active');
				// add the active class to the current title
				$tab.addClass('active');

				switch(lib.options.animType || 'show'){
					// animate
					case 'slide':
						$panes.not($pane).slideUp(lib.options.animSpeed);
						$pane.slideDown(lib.options.animSpeed);
					break;
					case 'fade':
						$panes.hide();
						$pane.fadeIn(lib.options.animSpeed);
					break;
					default:
						// no recognised (or 'show') animation - just show
						$panes.hide();
						$pane.show();
					break;
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