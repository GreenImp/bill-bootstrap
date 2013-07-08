/**
 * Bill.tooltip
 *
 * Tooltips
 */

;(function($, window, document, undefined){
	"use strict";

	Bill.libs.tooltip = {
		name:'Tooltip',
		version:'0.1.0',
		nameSpace:Bill.eventNameSpace + '.tooltip',
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
			var lib = this;

			$(this.scope)
					.on('mouseenter', '[data-tooltip]', function(e){
						lib.__addTooltip(this);
					})
					.find('[data-tooltip]').each(function(){
						lib.__addTooltip(this);
					});

			this.options.init = true;
		},
		/**
		 * De-activates the library
		 */
		off:function(){
			$(this.scope).off(this.nameSpace);
		},
		/**
		 * Adds a tooltip to an element
		 *
		 * @param elm
		 * @private
		 */
		__addTooltip:function(elm){
			var $elm = $(elm),								// the element hovered over
				content = $elm.attr('data-tooltip') ||		// tooltip content
							$elm.attr('data-title') ||
							$elm.attr('title');

			// remove the title attribute (if set), to stop it from appearing
			$elm.removeAttr('title');

			if(!$elm.children('.tooltip').length && content){
				// tooltip doesn't exist - create it and add it to the element
				$('<span class="tooltip">' +
						content +
				'</span>').appendTo($elm);
			}
		}
	};
})(jQuery, window, document);