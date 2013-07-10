/**
 * Bill.tooltip
 *
 * Tooltips
 */

;(function($, window, document, undefined){
	"use strict";

	Bill.libs.sidenav = {
		name:'Side Navigation',
		version:'0.1.0',
		nameSpace:Bill.eventNameSpace + '.sidenav',
		options:{},
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
				this.on();
			}

			return this.options.init;
		},
		/**
		 * Activates the library
		 */
		on:function(){
			var lib = this,
				$window = $(window);

			$window.on('scroll' + this.nameSpace + ' load' + this.nameSpace + ' resize' + this.nameSpace, function(){
				$(lib.scope).find('[data-sidenav][data-float]').each(function(){
					var $nav = $(this),						// nav element
						$container = $nav.parent(),			// nav container
						scrollPos = $window.scrollTop(),	// window scroll position
						cOffset = $container.offset().top;	// container offset, from the document

					if((cOffset > scrollPos) || Bill.extension('viewport', 'isSmall')){
						// the top of the container is still in view - no need to do anything
						$nav.removeAttr('style');
					}else{
						// top of container is out of view - place the nav in the correct place
						$nav.css('position', 'fixed');

						var margin = {																					// margin offsets for the nav, taken from the container padding
								top:parseInt($container.css('padding-top')),
								bottom:parseInt($container.css('padding-bottom'))
							},
							height = ($container.height() > 1) ? $container.height() : $container.parent().height(),	// height of container
							maxOffset = ($nav.attr('data-contain') || ($nav.attr('data-contain') !== undefined)) ?		// maximum allowed offset
											cOffset + height - margin.bottom - $nav.outerHeight(true)
										:
											$('body').height();

						// set the css on the nav element
						$nav.css({
							top:(scrollPos > maxOffset - margin.top) ? maxOffset - scrollPos : margin.top,
							width:$container.width()
						});
					}
				});
			});
		},
		/**
		 * De-activates the library
		 */
		off:function(){
			$(window).off(this.nameSpace);
			$(this.scope).off(this.nameSpace);
		}
	};
})(jQuery, window, document);