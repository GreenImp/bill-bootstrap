/**
 * Author: GreenImp Web
 * Date Created: 27/01/13 01:42
 */

(function($, window, document){
	$.fn.browserNotice = function(){
		var noticeBox = $('<div id="browserNotice">' +
			'<p>It looks like you\'re using an outdated web browser.</p>' +
			'<a href="http://browsehappy.com/" title="Upgrade your browser at Browse Happy">Find out more</a>' +
		'</div>');
		$('body').prepend(noticeBox);
		noticeBox.hide().slideDown(200);

		return this;
	};
})(jQuery, window, document);