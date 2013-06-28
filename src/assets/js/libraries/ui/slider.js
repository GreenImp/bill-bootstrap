/**
 * Bill.slider
 *
 * Image slider
 */
/* @depend vendor/jquery.bxslider.js */

;(function($, window, document, undefined){
	"use strict";

	Bill.libs.slider = {
		name:'Slider',
		version:'0.1.0',
		nameSpace:Bill.eventNameSpace + '.slider',
		options:{
			adaptiveHeight:true,
			auto:true,
			autoHover:true
		},
		sliders:[],
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

			// we have to loop through and action each separately, to get a proper reference of them
			$(this.scope).find('[data-slider]').each(function(){
				lib.sliders.push($(this).bxSlider(lib.options));
			});

			this.options.init = true;
		},
		/**
		 * De-activates the library
		 */
		off:function(){
			// loop through the sliders and disable them
			$.each(this.sliders, function(){
				this.destroySlider();
			});

			this.options.init = false;
		}
	};
})(jQuery, window, document);