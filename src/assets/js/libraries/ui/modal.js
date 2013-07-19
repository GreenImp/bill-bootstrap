/**
 * Bill.modal
 *
 * Shows modal dialogue boxes
 */
/* @depend vendor/jquery.fancybox-1.3.4_patch.js */

;(function($, window, document, undefined){
	"use strict";

	Bill.libs.modal = {
		name:'Modal',
		version:'0.0.1',
		nameSpace:Bill.eventNameSpace + '.modal',
		options:{
			cyclic:true,
			titlePosition:'float',
			handle:'[data-modal]'
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
				this.on();
			}

			return this.options.init;
		},
		/**
		 * Activates the library
		 */
		on:function(){
			$(this.scope).find(this.options.handle).fancybox(this.options);

			this.options.init = true;
		},
		/**
		 * De-activates the library
		 */
		off:function(){}
	};
})(jQuery, window, document);