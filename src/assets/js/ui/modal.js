/**
 * Bill.modal
 *
 * Shows modal dialogue boxes
 */
/*> jquery.fancybox-1.3.4_patch.js */

;(function($, window, document, undefined){
	"use strict";

	Bill.libs.modal = {
		name:'Modal',
		version:'0.1.0',
		options:{
			cyclic:true,
			titlePosition:'float'
		},
		init:function(scope, method, options){
			this.scope = scope || this.scope;

			$(this.scope).fancybox($.extend(this.options, (typeof method === 'object') ? method : options));
		}
	};
})(jQuery, window, document);