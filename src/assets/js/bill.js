/**
 * Author: GreenImp Web
 * Date Created: 27/01/13 01:42
 */

(function($, window, document){
	// list of available methods
	var methods = {
		init:function(options){
			return this;
		}
	};

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
			$.error('Method ' +  method + ' does not exist on bill');
			return this;
		}
	};

/*> browserNotice.js */
/*> ui/alert.js */
/*> ui/accordion.js */
/*> ui/tabs.js */
/*> ui/modal.js */
/*> ui/tooltip.js */
/*> ui/slider.js */
})(jQuery, window, document);