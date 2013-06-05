/**
 * Bill.cookieNotice
 *
 * Checks if the browser supports cookies.
 * If not, a message is displayed to the user.
 */
;(function($, window, document, undefined){
	"use strict";

	Bill.libs.cookieNotice = {
		name:'Cookie Notice',
		version:'0.1.0',
		options:{
			animSpeed:600,
			message:'<p>' +
						'Your browser is blocking cookies. This website requires the use of cookies to work correctly.' +
					'</p>',
			infoURL:'http://www.whatarecookies.com/',
			closable:true,
			selectorID:'cookieNotice',
			enabled:true
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

			this.on();

			return true;
		},
		/**
		 * Activates the library
		 */
		on:function(){
			if(!this.cookiesEnabled() && !$('#' + this.options.selectorID).length){
				$('<div id="' + this.options.selectorID + '" class="notice info fixed" data-notice>' +
					'<div class="container constrain">' +
						'<div class="row">' +
							'<div class="column ' + (this.options.infoURL ? 'eight' : 'twelve') + '">' +
								this.options.message +
							'</div>' +
							(
							this.options.infoURL ?
								'<div class="column four">' +
									'<a href="' + this.options.infoURL + '" title="Find out more about cookies" target="_blank" class="button">Find out more</a>' +
								'</div>'
								:
								''
							) +
						'</div>' +
					'</div>' +
					(this.options.closable ? '<a href="#close" class="closeBtn">X</a>' : '') +
				'</div>')
					// add the notice and slide it into view
					.prependTo('body').hide().slideDown(this.options.animSpeed);
			}
		},
		/**
		 * De-activates the library
		 */
		off:function(){
			$('#' + this.options.selectorID).remove();
		},
		/**
		 * Checks if cookies are enabled, in the browser.
		 * Returns true if they are, otherwise false
		 *
		 * @returns {boolean}
		 */
		cookiesEnabled:function(){
			if(typeof this.options.supported !== 'boolean'){
				// base check for cookie functionality
				this.options.enabled = !!navigator.cookieEnabled;

				if(!this.options.enabled){
					// base check failed - try setting a cookie
					var cookieName = 'cookieTest';	// test cookie name

					document.cookie = cookieName;
					// check if the cookie was set
					this.options.enabled = (document.cookie.indexOf(cookieName) != -1);
				}
			}

			return this.options.enabled;
		}
	};
})(jQuery, window, document);