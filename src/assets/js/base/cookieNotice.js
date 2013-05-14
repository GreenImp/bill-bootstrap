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
			infoURL:'http://www.whatarecookies.com/',
			closable:false
		},
		init:function(scope, method, options){
			// only continue if cookies aer disabled
			if(!this.cookiesEnabled()){
				this.scope = scope || this.scope;

				// only continue if the cookie notice doesn't exist
				if(!this.options.init || !$('#cookieNotice').length){
					if(typeof method === 'object'){
						// method is actually options
						$.extend(true, this.options, method);
					}else if(typeof method === 'object'){
						$.extend(true, this.options, options);
					}

					$('<div id="cookieNotice" class="notice info fixed">' +
						'<div class="container constrain">' +
							'<div class="row">' +
								'<div class="column ' + (this.options.infoURL ? 'eight' : 'twelve') + '">' +
									'<p>' +
										'Your browser is blocking cookies. This website requires the use of cookies to work correctly.' +
									'</p>' +
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
					'</div>')
							// add the notice and slide it into view
							.prependTo('body').hide().slideDown(this.options.animSpeed);

					this.options.init = true;
				}
			}
		},
		/**
		 * Checks if cookies are enabled, in the browser.
		 * Returns true if they are, otherwise false
		 *
		 * @returns {boolean}
		 */
		cookiesEnabled:function(){
			var cookieName = 'cookieTest',					// test cookie name
				cookieEnabled = !!navigator.cookieEnabled;	// base check for cookie functionality

			if(!cookieEnabled){
				// base check failed - try setting a cookie
				document.cookie = cookieName;
				// check if the cookie was set
				cookieEnabled = (document.cookie.indexOf(cookieName) != -1);
			}

			return cookieEnabled;
		}
	};
})(jQuery, window, document);