/**
 * Bill.slider
 *
 * Image slider
 */
/*> jquery.flexslider-min.js */

;(function($, window, document, undefined){
	"use strict";

	Bill.libs.slider = {
		name:'Notice',
		version:'0.1.0',
		nameSpace:Bill.eventNameSpace + '.notice',
		options:{
			animation:'slide',
			slideshowSpeed:4000,
			smoothHeight:true
		},
		init:function(scope, method, options){
			this.scope = scope || this.scope;

			var $elm = $(this.scope);
			$elm.addClass('flexslider').flexslider($.extend(this.options, (typeof method === 'object') ? method : options));
		}
	};
})(jQuery, window, document);