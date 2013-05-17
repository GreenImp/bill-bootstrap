/**
 * Bill.notice
 *
 * Adds ability to close notices
 */
;(function($, window, document, undefined){
	"use strict";

	Bill.libs.notice = {
		name:'Notice',
		version:'0.1.0',
		nameSpace:Bill.eventNameSpace + '.notice',
		options:{
			animSpeed:400
		},
		init:function(scope, method, options){
			this.scope = scope || this.scope;

			if(typeof method === 'object'){
				// method is actually options
				$.extend(true, this.options, method);
			}else if (typeof method === 'string'){
				// call the method and return
				return this[method].call(this, options);
			}

			if(!this.options.init){
				this.on();
			}

			return this.options.init;
		},
		/**
		 * Activates the plugin
		 */
		on:function(){
			var lib = this;

			/**
			 * Add click handler for notice close buttons
			 */
			$(this.scope).on('click' + this.nameSpace, '[data-notice] a.closeBtn', function(e){
				e.preventDefault();

				// get the notice
				var $elm = $(this).closest('[data-notice]');
				if($elm.hasClass('fixed')){
					// this is a fixed notice - slide it up
					$elm.slideUp(lib.options.animSpeed, function(){
						$elm.remove();
					});
				}else{
					// this is a normal notice - fade it out
					$elm.fadeOut(lib.options.animSpeed, function(){
						$elm.remove();
					});
				}
			});

			this.options.init = true;
		},
		/**
		 * De-activates the plugin
		 */
		off:function(){
			$(this.scope).off(this.nameSpace);
		}
	};
})(jQuery, window, document);