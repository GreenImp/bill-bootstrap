methods.alert = function(type, msg, val, callback){
	if(msg){
		var dialogueBox = $('<div id="popUp">' +	// the pop-up box
				'<div class="content"></div>' +
				'<div class="buttons"></div>' +
			'</div>'),
			content = '',							// the pop-up content
			buttons = [];							// the pop-up buttons

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
						class:'cancel'
					},
					{
						label:'OK',
						value:true,
						class:'confirm'
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
						class:'cancel'
					},
					{
						label:'OK',
						value:true,
						class:'confirm'
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
						class:'confirm'
					}
				];
			break;
		}

		// add the content to the pop-up
		dialogueBox.children('.content').html(content);

		// add any buttons to the pop-up
		var buttonBox = dialogueBox.children('.buttons');
		$.each(buttons, function(){
			buttonBox.append('<button type="button" value="' + this.value + '" class="' + (this.class || '') + '">' + this.label + '</button>');
		});

		// add click events for the buttons
		buttonBox.children('button').on('click', function(){
			// hide the dialogue box and remove it
			dialogueBox.stop(true, true).fadeOut(function(){
				dialogueBox.remove();
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

		// add the dialogue box to the document body
		dialogueBox.appendTo('body');
	}else{
		// no message defined

		if($.isFunction(callback)){
			// trigger the callback function, with a value of null
			callback.apply(window, [null]);
		}else{
			// no callback function, just return null
			return null;
		}
	}
};


/**
 * Overwrites alert functionality
 */
window.alert = function(msg, callback){
	return $('body').bill('alert', 'alert', msg, null, callback);
};

/**
 * Overwrites confirm functionality
 */
window.confirm = function(msg, callback){
	return $('body').bill('alert', 'confirm', msg, null, callback);
};

/**
 * Overwrites prompt functionality
 */
window.prompt = function(msg, val, callback){
	return $('body').bill('alert', 'prompt', msg, val, null, callback);
};