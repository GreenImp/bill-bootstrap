/**
 * Adds tooltip functionality
 *
 * @return {*}
 */
methods.tooltip = function(userOptions){
	// loop through each element and set the
	// data-tooltip attribute to the element's title.
	// If data-tooltip is already defined, it is left as-is
	return this.each(function(){
		var elm = $(this);

		if(elm.removeAttr('title')){
			if(!elm.attr('data-tooltip')){
				elm.attr('data-tooltip', elm.attr('title'));
			}
			elm.removeAttr('title');
		}
	});
};

// call the accordion functionality
$('.tooltip[title]').bill('tooltip');