/**
 * Bill.slider
 *
 * Image slider
 */
;(function($, window, document, undefined){
	"use strict";

	Bill.libs.slider = {
		name:'Slider',
		version:'0.1.0',
		nameSpace:Bill.eventNameSpace + '.slider',
		options:{},
		init:function(scope, method, options){
			throw new Error('Slider is unavailable in this release of Bill');

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
			//$(this.scope).find('[data-slider]').addClass('flexslider').flexslider(this.options);

			this.options.init = true;
		},
		/**
		 * De-activates the library
		 */
		off:function(){}
	};
})(jQuery, window, document);