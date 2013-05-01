/**
 * Checks if the browser supports cookies.
 * If not, a message is displayed to the user.
 *
 * @param options
 * @return {*}
 */
;methods.cookieNotice = function(){
	var cookiesEnabled = function(){
		var cookieName = 'cookieTest',					// test cookie name
			cookieEnabled = !!navigator.cookieEnabled;	// bas check for cookie functionality

		if(!cookieEnabled){
			// base check failed - try setting a cookie
			document.cookie = cookieName;
			// check if the cookie was set
			cookieEnabled = (document.cookie.indexOf(cookieName) != -1);
		}

		return cookieEnabled;
	};

	if(!cookiesEnabled()){
		// cookies are disabled
		$('body').append('<div id="cookieNotice" class="notice info fixed">' +
					'<p>' +
						'Your browser is blocking cookies. This website requires the use of cookies to work correctly.' +
						'<a href="http://www.whatarecookies.com/" title="Find out more about cookies" target="_blank" class="button">Find out more' +
					'</p>' +
				'</div>')
	}
};