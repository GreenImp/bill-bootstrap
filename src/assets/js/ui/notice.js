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

			var lib = this,
				$elm = $(this.scope),
				data = $.extend($elm.data(this.nameSpace) || {}, this.options);

			if(typeof method === 'object'){
				// method is actually options
				$.extend(data, method);
			}else{
				$.extend(data, options);
			}

			// only continue if the functionality hasn't already been initialised
			if(!data.init){
				data.init = true;

				$elm
					// mark the notice as closable
					.addClass('closable')
					// store the options in the element data
					.data(this.nameSpace, data);

				$('<a href="#close" title="Close notice" class="closeBtn">X</a>').appendTo($elm);

				this.on();
			}else{
				// store the options in the element data
				$elm.data(this.nameSpace, data);
			}

			return data.init;
		},
		/**
		 * Activates the plugin
		 */
		on:function(){
			var lib = this,
				$elm = $(this.scope);

			$elm.find('a.closeBtn').on('click' + this.nameSpace, function(e){
				e.preventDefault();

				var options = $elm.data(lib.nameSpace);

				if($elm.hasClass('fixed')){
					$elm.slideUp(options.animSpeed, function(){
						$elm.remove();
					});
				}else{
					$elm.fadeOut(options.animSpeed, function(){
						$elm.remove();
					});
				}
			});
		},
		/**
		 * De-activates the plugin
		 */
		off:function(){
			$(this.scope).find('a.closeBtn').off('click' + this.nameSpace);
		}
	};
})(jQuery, window, document);