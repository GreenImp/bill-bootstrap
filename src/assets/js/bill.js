/**
 * Author: GreenImp Web
 * Date Created: 27/01/13 01:42
 */

;(function($, window, document){
	'use strict';

	// list of available methods
	var methods = {
			init:function(options){
				return this;
			}
		},
		onLoad = [];

	/**
	 * Base Bill method
	 *
	 * @param method
	 * @return {*}
	 */
	$.fn.bill = function(method){
		// Method calling logic
		if(methods[method]){
			return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof method === 'object' || !method){
			return methods.init.apply(this, arguments);
		}else{
			$.error('Method ' + method + ' does not exist on bill');
			return this;
		}
	};


	/**
	 * Basic functionality
	 */
	/*> base/basic.js */
	/*> base/browserNotice.js */
	/*> base/cookieNotice.js */

	/**
	 * UI functionality
	 */
	/*> ui/navigation.js */
	/*> ui/notice.js */
	/*> ui/alert.js */
	/*> ui/accordion.js */
	/*> ui/tabs.js */
	/*> ui/modal.js */
	/*> ui/slider.js */

	/**
	 * Run any UI JS that needs to be run on page load
	 */
	if(onLoad.length > 0){
		$(window).on('load', function(){
			$.each(onLoad, function(i, loadF){
				loadF.call(this);
			});
		});
	}
})(jQuery, window, document);