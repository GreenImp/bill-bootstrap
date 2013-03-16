/**
 * Copyright GreenImp Web - greenimp.co.uk
 *
 * Author: GreenImp Web
 * Date Created: 16/03/13 18:46:38
 */


/*> jquery.flexslider-min.js */
methods.slider = $.fn.flexslider;

// call the slider functionality
$('.slider').each(function(){
	var slider = $(this);
	slider.addClass('flexslider').bill('slider', {
		animation:slider.hasClass('fade') ? 'fade' : 'slide',
		slideshowSpeed:4000,
		smoothHeight:true
	});
});