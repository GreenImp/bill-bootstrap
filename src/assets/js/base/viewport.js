/**
 * Bill.viewport
 *
 * Returns viewport information
 */
;(function($, window, document, undefined){
	"use strict";

	Bill.libs.viewport = {
		name:'Viewport',
		version:'0.1.0',
		window:null,
		init:function(scope, method, options){
			this.window = $(window);

			return true;
		},
		width:function(){
			return Math.max(this.window.innerWidth(), window.innerWidth);
		},
		height:function(){
			return Math.max(this.window.innerHeight(), window.innerHeight);
		},
		size:function(){
			return {
				width:this.width(),
				height:this.height()
			};
		},
		isSmall:function(){
			return this.width() <= 767;
		},
		isMedium:function(){
			var width = this.width();
			return (width > 767) && (width < 980);
		},
		isLarge:function(){
			return this.width() >= 980;
		}
	};
})(jQuery, window, document);