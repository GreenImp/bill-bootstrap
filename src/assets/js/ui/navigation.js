/**
 * Adds accordion functionality
 *
 * @return {*}
 */
methods.navigation = function(){
	// loop through each element and add the navigation functionality
	// return 'this' to allow chain-ability
	return this.each(function(){
		var $nav = $(this);

		// loop through all of the li elements and check if they have children
		$nav.addClass('dynamic').children('ul').find('li').each(function(){
					var $item = $(this);
					if($item.children('ul:first').length){
						// the item has sub-navigation
						$item.addClass('hasSub');
					}
				});
	});
};

// call the accordion functionality
$('.nav').bill('navigation');