/**
 * Copyright GreenImp Web - greenimp.co.uk
 *
 * Author: GreenImp Web
 * Date Created: 24/02/13 01:24
 */


/*> jquery.fancybox-1.3.4_patch.js */
methods.modal = $.fn.fancybox;

// call the modal functionality
$('.modal').bill('modal', {
	cyclic:true,
	titlePosition:'float'
});