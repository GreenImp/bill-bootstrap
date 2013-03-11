/**
 * Adds accordion functionality
 *
 * @return {*}
 */
methods.tabs = function(userOptions){
	var defaultOptions = {
		animSpeed:200,
		animType:'fade'
	};
	var options = $.extend(defaultOptions, userOptions);

	// loop through each element and add the tab functionality
	// return 'this' to allow chain-ability
	return this.each(function(){
		var tabs = $(this),				// the tab element
			data = tabs.data('bill');	// the tab data

		// only add the accordion if it hasn't already been initiated on the object
		if(!data || !data.tabs){
			// get the tab elements
			var tabBtns = tabs.children(':first');
			if(tabBtns.get(0).nodeName == 'UL'){
				// first element is a list - we assume it's a list of tab links
			}
		}else if(userOptions){
			// accordion already exists, but options have been updated
			tabs.data('bill', $.extend(data || {}, {tabs:options}));
		}
	});
};

// call the accordion functionality
$('.tabs').bill('tabs');