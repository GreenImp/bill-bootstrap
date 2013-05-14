;var alertQueue = [];

methods.alert = function(type, msg, val, callback){
	'use strict';

	if(msg){
		callback = $.isFunction(callback) ? callback : ($.isFunction(val) ? val : null);
		val = !$.isFunction(val) ? val : null;

		if($('#alertPopup').length > 0){
			// alert dialogue already exists - add this to the queue
			alertQueue.push({
				type:type,
				msg:msg,
				val:val,
				callback:callback
			});

			return this;
		}

		var dialogueBox = $('<div id="alertPopup" class="alertBox float">' +										// the pop-up box
				'<div class="content"></div>' +
				'<div class="buttons"></div>' +
			'</div>'),
			overlay = ($('#alertOverlay').length > 0) ? $('#alertOverlay') : $('<div id="alertOverlay"></div>'),	// the overlay
			buttonBox = dialogueBox.children('.buttons'),															// the button container
			buttonHtml = '',																						// HTML markup for buttons
			content = '',																							// the pop-up content
			buttons = [],																							// the pop-up buttons
			animSpeed = 400;																						// the animation speed

		// check the pop-up type
		type = type.toLowerCase();
		switch(type){
			case 'confirm':
				// confirmation dialogue
				dialogueBox.addClass('confirmation');
				content = '<p>' + msg + '</p>';

				buttons = [
					{
						label:'cancel',
						value:false,
						'class':'cancel'
					},
					{
						label:'OK',
						value:true,
						'class':'confirm'
					}
				];
			break;
			case 'prompt':
				// prompt dialogue
				dialogueBox.addClass('prompt');
				content = '<p>' + msg + '</p>' +
						'<input type="text" name="value" value="' + (val || '') + '">';

				buttons = [
					{
						label:'cancel',
						value:null,
						'class':'cancel'
					},
					{
						label:'OK',
						value:true,
						'class':'confirm'
					}
				];
			break;
			default:
				// alert dialogue
				dialogueBox.addClass('alert');
				content = '<p>' + msg + '</p>';

				buttons = [
					{
						label:'OK',
						value:true,
						'class':'confirm'
					}
				];
			break;
		}

		// add the content to the pop-up
		dialogueBox.children('.content').html(content);

		// add any buttons to the pop-up
		$.each(buttons, function(){
			buttonHtml += '<button type="button" value="' + this.value + '" class="' + (this['class'] || '') + '">' + this.label + '</button>';
		});
		buttonBox.append(buttonHtml);

		// add the dialogue and set it's position
		dialogueBox
				.appendTo('body')					// add the dialogue box to the document body
				.css({margin:0, left:0, top:0})		// remove existing margin/positioning
				.css({								// add our own
					left:($(window).width()/2) - (dialogueBox.outerWidth()/2),
					top:($(window).height()/2) - (dialogueBox.outerHeight()/2)
				})
				.hide()
				.fadeIn(animSpeed);
		// add the overlay
		overlay.appendTo('body').stop(true, true).hide().fadeIn(animSpeed/2);

		/**
		 * re-position the dialogue when the screen size changes
		 */
		$(window).on('resize', function(){
			dialogueBox
					.css({margin:0, left:0, top:0})		// remove existing margin/positioning
					.css({								// add our own
						left:($(window).width()/2) - (dialogueBox.outerWidth()/2),
						top:($(window).height()/2) - (dialogueBox.outerHeight()/2)
					});
		});


		// add click events for the buttons
		buttonBox.children('button').on('click', function(){
			// hide the dialogue box and remove it
			dialogueBox.stop(true, true).fadeOut(animSpeed, function(){
				dialogueBox.remove();

				// check the alert queue for our next alert
				if(alertQueue.length > 0){
					// next alert specified - trigger it
					var alert = alertQueue.shift();
					$('body').bill('alert', alert.type, alert.msg, alert.val, alert.callback);
				}
			});
			// hide and remove the overlay
			overlay.fadeOut(animSpeed/2, function(){
				overlay.remove();
			});

			// fire the callback function
			if($.isFunction(callback)){
				var value = null;
				if(type == 'prompt'){
					// we're on a prompt dialogue - check for inputted value
					value = ($(this).val() != 'null') ? dialogueBox.find('> .content input[type=text][name=value]').val() || null : null;
				}else{
					// normal pop-up - get the button value
					value = $(this).val();
					value = (value == 'true') ? true : ((value == 'false') ? false : ((value == 'null') ? null : value));
				}

				callback.apply(window, [value]);
			}
		});
	}else if($.isFunction(callback)){
		// no message defined, but we have a callback
		// trigger the callback function, with a return value of null
		callback.apply(window, [null]);
	}

	// return 'this' to allow chain-ability
	return this;
};


/**
 * Overwrites alert functionality
 */
/*window.alert = function(msg, callback){
	return $('body').bill('alert', 'alert', msg, null, callback);
};*/

/**
 * Overwrites confirm functionality
 */
/*window.confirm = function(msg, callback){
	return $('body').bill('alert', 'confirm', msg, null, callback);
};*/

/**
 * Overwrites prompt functionality
 */
/*window.prompt = function(msg, val, callback){
	return $('body').bill('alert', 'prompt', msg, val, null, callback);
};*/