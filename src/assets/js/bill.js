/**
 * Author: GreenImp Web
 * Date Created: 27/01/13 01:42
 */

(function($, window, document){
	/**
	 * Checks if the current browser is supported.
	 * If not, a message is displayed to the user,
	 * to alert them that they are using an out-dated
	 * browser.
	 *
	 * 'options' contains a list of browsers and the
	 * earliest supported version number.
	 * By default, ie support is set to 9.
	 * All others have full support.
	 *
	 * @param options
	 * @return {*}
	 */
	$.fn.browserNotice = function(options){
		// list of browsers to check for
		options = $.extend({
			ie:9,
			ff:null,
			chrome:null,
			safari:null,
			opera:null
		}, options);

		// check if the browser is supported or not
		var supported = true,
			userAgent = navigator.userAgent;
		if(options.ie && !isNaN(options.ie) && (/MSIE (\d+\.\d+);/.test(userAgent))){
			// browser is IE
			if(parseFloat(RegExp.$1) < parseFloat(options.ie)){
				// version not supported
				supported = false;
			}
		}else if(options.ff && !isNaN(options.ff) && (/Firefox[\/\s](\d+\.\d+)/.test(userAgent))){
			// browser is Firefox
			if(parseFloat(RegExp.$1) < parseFloat(options.ff)){
				// version not supported
				supported = false;
			}
		}else if(options.chrome && !isNaN(options.chrome) && (/Chrome[\/\s](\d+\.\d+)/.test(userAgent))){
			// browser is Chrome
			if(parseFloat(RegExp.$1) < parseFloat(options.chrome)){
				// version not supported
				supported = false;
			}
		}else if(options.safari && !isNaN(options.safari) && (/Version[\/\s](\d+\.\d+)(.\d+)*\s+Safari/.test(userAgent))){
			// browser is Safari
			if(parseFloat(RegExp.$1) < parseFloat(options.safari)){
				// version not supported
				supported = false;
			}
		}else if(options.opera && !isNaN(options.opera) && (/Opera.*?Version[\/\s](\d+\.\d+)/.test(userAgent))){
			// browser is Opera
			if(parseFloat(RegExp.$1) < parseFloat(options.opera)){
				// version not supported
				supported = false;
			}
		}

		if(!supported){
			// browser not supported
			var animSpeed = 600,
				noticeBox = $('<div id="browserNotice" class="container">' +
				'<div class="row">' +
					'<div class="column eight">' +
						'<p>It looks like you\'re using an outdated web browser. We don\'t support old browsers, as they have limited features and security issues.</p>' +
						'<p>You should consider upgrading.</p>' +
					'</div>' +
					'<div class="column four">' +
						'<a href="http://browsehappy.com/" title="Upgrade your browser at Browse Happy" target="_blank"  class="button">Find out more</a>' +
					'</div>' +
				'</div>' +
			'</div>');

			$('body')
					// add the browser notice
					.prepend(noticeBox)
					// slide the whole page down, by the height of the notice (so page content doesn't get cut off)
					.animate({'padding-top':noticeBox.outerHeight()}, animSpeed);

			// slide the browser notice into view
			noticeBox.hide().slideDown(animSpeed);
		}

		// return 'this' to allow chain-ability
		return this;
	};
})(jQuery, window, document);