/**
 * Bill.extensions.viewport
 *
 * Returns the viewport size and allows checking
 * whether the screen is small, medium or large
 */
;(function($, window, document, undefined){
	"use strict";

	Bill.extensions.viewport = {
		width:function(){
			return Math.max($(window).innerWidth(), window.innerWidth);
		},
		height:function(){
			return Math.max($(window).innerHeight(), window.innerHeight);
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
	}
})(jQuery, window, document);