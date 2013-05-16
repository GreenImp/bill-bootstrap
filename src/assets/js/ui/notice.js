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


			/*var lib = this,
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

				// store the options in the element data
				$elm.data(this.nameSpace, data);

				this.on();
			}else{
				// store the options in the element data
				$elm.data(this.nameSpace, data);
			}

			return data.init;*/
		},
		/**
		 * Activates the plugin
		 */
		on:function(){
			var lib = this;

			$(this.scope).on('click' + this.nameSpace, '[data-notice] a.closeBtn', function(e){
				e.preventDefault();

				var $elm = $(this).closest('[data-notice]');
				if($elm.hasClass('fixed')){
					$elm.slideUp(lib.options.animSpeed, function(){
						$elm.remove();
					});
				}else{
					$elm.fadeOut(lib.options.animSpeed, function(){
						$elm.remove();
					});
				}
			});

			/*var lib = this,
				$elm = $(this.scope);

			// mark the notice as closable
			$elm.addClass('closable');

			$('<a href="#close" title="Close notice" class="closeBtn">X</a>')
				.appendTo($elm)
				.on('click' + this.nameSpace, function(e){
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
				});*/
		},
		/**
		 * De-activates the plugin
		 */
		off:function(){
			this.scope.off(this.nameSpace);

			/*var $elm = $(this.scope);

			$elm
				.removeClass('closable')
				.children('a.closeBtn:first')
					.remove();*/
		}
	};
})(jQuery, window, document);