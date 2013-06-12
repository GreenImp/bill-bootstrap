/**
 * Bill.browserNotice
 *
 * Checks if the current browser is supported.
 * If not, a message is displayed to the user,
 * to alert them that they are using an out-dated
 * browser.
 *
 * Yes, browser sniffing is BAD, but sometimes you
 * seriously, just don't want to provide support
 * for a certain browser (IE 8<, for example).
 *
 * 'options' contains a list of browsers and the
 * earliest supported version number.
 * By default, ie support is set to 9.
 * All others have full support.
 */
;(function($, window, document, undefined){
	"use strict";

	Bill.libs.browserNotice = {
		name:'Browser Notice',
		version:'0.1.0',
		options:{
			browsers:{
				ie:9,
				ff:null,
				chrome:null,
				safari:null,
				opera:null
			},
			animSpeed:600,
			message:'<p>It looks like you\'re using an outdated web browser. We don\'t support old browsers, as they have limited features and security issues.</p>' +
					'<p>You should consider upgrading.</p>',
			infoURL:'http://browsehappy.com/',
			closable:false,
			selectorID:'browserNotice'
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
			// only continue if the browser is not supported and the notice doesn't already exist
			if(!this.browserSupported() && !$('#' + this.selectorID).length){
				// browser not supported

				// build the browser notice
				$('<div id="' + this.options.selectorID + '" class="notice info fixed" data-notice>' +
					'<div class="container constrain">' +
						'<div class="row">' +
							'<div class="column ' + (this.options.infoURL ? 'eight' : 'twelve') + '">' +
								this.options.message +
							'</div>' +
							(
							this.options.infoURL ?
								'<div class="column four">' +
									'<a href="' + this.options.infoURL + '" title="Upgrade your browser" target="_blank" class="button">Find out more</a>' +
								'</div>'
								:
								''
							) +
						'</div>' +
					'</div>' +
					(this.options.closable ? '<a href="#close" class="closeBtn">X</a>' : '') +
				'</div>')
					// add the notice and slide it into view
					.prependTo('body')
					.hide()
					.slideDown(this.options.animSpeed);
			}
		},
		/**
		 * De-activates the library
		 */
		off:function(){
			$('#' + this.selectorID).remove();
		},
		/**
		 * Checks if the current browser is supported
		 * @returns {boolean}
		 */
		browserSupported:function(){
			if(typeof this.options.supported !== 'boolean'){
				var userAgent = navigator.userAgent,
					browsers = this.options.browsers;
				if(browsers.ie && !isNaN(browsers.ie) && (/MSIE (\d+\.\d+);/.test(userAgent))){
					// browser is IE
					if(parseFloat(RegExp.$1) < parseFloat(browsers.ie)){
						// version not supported
						this.options.supported = false;
					}
				}else if(browsers.ff && !isNaN(browsers.ff) && (/Firefox[\/\s](\d+\.\d+)/.test(userAgent))){
					// browser is Firefox
					if(parseFloat(RegExp.$1) < parseFloat(browsers.ff)){
						// version not supported
						this.options.supported = false;
					}
				}else if(browsers.chrome && !isNaN(browsers.chrome) && (/Chrome[\/\s](\d+\.\d+)/.test(userAgent))){
					// browser is Chrome
					if(parseFloat(RegExp.$1) < parseFloat(browsers.chrome)){
						// version not supported
						this.options.supported = false;
					}
				}else if(browsers.safari && !isNaN(browsers.safari) && (/Version[\/\s](\d+\.\d+)(.\d+)*\s+Safari/.test(userAgent))){
					// browser is Safari
					if(parseFloat(RegExp.$1) < parseFloat(browsers.safari)){
						// version not supported
						this.options.supported = false;
					}
				}else if(browsers.opera && !isNaN(browsers.opera) && (/Opera.*?Version[\/\s](\d+\.\d+)/.test(userAgent))){
					// browser is Opera
					if(parseFloat(RegExp.$1) < parseFloat(browsers.opera)){
						// version not supported
						this.options.supported = false;
					}
				}else{
					this.options.supported = true;
				}
			}

			return this.options.supported;
		}
	};
})(jQuery, window, document);