/**
 * Author: GreenImp Web
 * Date Created: 27/01/13 01:42
 */

(function($, window, document){
	$.fn.browserNotice = function(){
		var noticeBox = $('<div id="browserNotice">' +
			'<p>It looks like you\'re using an outdated web browser.</p>' +
			'<p>We don\'t support old browsers, as they have limited features and security issues.</p>' +
			'<p>You should consider upgrading your browser.</p>' +
			'<a href="http://browsehappy.com/" title="Upgrade your browser at Browse Happy">Find out more</a>' +
		'</div>');
		$('body').prepend(noticeBox);
		noticeBox.hide().slideDown(200);

		return this;
	};
})(jQuery, window, document);