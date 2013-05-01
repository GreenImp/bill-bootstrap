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
					'<div class="container constrain">' +
						'<div class="row">' +
							'<div class="column eight">' +
								'<p>' +
									'Your browser is blocking cookies. This website requires the use of cookies to work correctly.' +
								'</p>' +
							'</div>' +
							'<div class="column four">' +
								'<a href="http://www.whatarecookies.com/" title="Find out more about cookies" target="_blank" class="button">Find out more' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>')
	}
};