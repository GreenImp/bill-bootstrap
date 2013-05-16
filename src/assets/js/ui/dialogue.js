/**
 * Bill.dialogue
 *
 * Replacement for default alert,
 * confirm and prompt dialogues
 */
;(function($, window, document, undefined){
	"use strict";

	Bill.libs.dialogue = {
		name:'Dialogue',
		version:'0.1.0',
		nameSpace:Bill.eventNameSpace + '.dialogue',
		options:{
			animSpeed:400,
			type:'alert',
			msg:null,
			value:null,
			callback:null,
			buttons:[]
		},
		buttonTemplate:{
			label:'button',
			value:true,
			'class':''
		},
		queue:[],
		active:false,
		dialogueID:'dialoguePopup',
		init:function(scope, method, options){
			this.scope = scope || this.scope;

			if(typeof method === 'object'){
				// method is actually options
				$.extend(true, this.options, method);
			}else if (typeof method === 'string'){
				// call the method and return
				return this[method].call(this, options);
			}

			if(!this.options.init){
				this.events();
			}

			return this.options.init;

			/*var lib = this,
				$elm = $(this.scope),
				data = $.extend($elm.data(this.nameSpace) || {}, this.options);

			if(typeof method === 'object'){
				// method is actually options
				$.extend(data, method);
			}else{
				$.extend(data, options);
			}

			if(data.auto){
				// show the dialogue automatically (rather than on-click)

				// store the options in the element data
				$elm.data(this.nameSpace, data);

				// call the dialogue
				this.doDialogue(data);
			}else if(!data.init){
				data.init = true;
				// store the options in the element data
				$elm.data(this.nameSpace, data);

				// add the click handler
				this.on();
			}*/

			return true;
		},
		/**
		 * Activates the plugin
		 */
		on:function(){
			var lib = this,
				$elm = $(this.scope);

			/**
			 * Fire the dialogue on-click
			 */
			$elm.on('click' + lib.nameSpace, function(e){
				e.preventDefault();

				lib.doDialogue($elm.data(lib.nameSpace));
			});
		},
		/**
		 * De-activates the plugin
		 */
		off:function(){
			// clear the queue
			this.queue = [];
			// remove the click handler
			$(this.scope).off(this.nameSpace);
		},
		doDialogue:function(data){
			if(this.active){
				// dialogue already exists - add this to the queue
				this.queue.push(data);

				return true;
			}else if(!data.msg){
				// no message defined - we can't continue

				if($.isFunction(data.callback)){
					// we have a callback - trigger it, with a return value of null
					callback.apply(window, [null, null]);
				}

				return false;
			}


			// if we're here, then all is okay and we can create the alert box
			this.active = true;

			var lib = this,
				dialogueBox = $('<div id="' + this.dialogueID + '" class="dialogueBox float">' +	// the pop-up box
					'<div class="content"></div>' +
					'<div class="buttons"></div>' +
				'</div>'),
				overlay = $('#dialogueOverlay'),													// the overlay
				content = '',																		// the dialogue content
				buttonBox = dialogueBox.children('.buttons'),										// the button container
				buttonHTML = '';																	// the markup for outputting the buttons

			// if the overlay doesn't already exist, create it
			overlay = overlay.length ? overlay : $('<div id="dialogueOverlay"></div>');

			switch(data.type.toLowerCase()){
				case 'confirm':
					// confirmation dialogue
					dialogueBox.addClass('confirmation');
					content = '<p>' + data.msg + '</p>';

					data.buttons = [
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
					content = '<p>' + data.msg + '</p>' +
								'<input type="text" name="value" value="' + (data.value || '') + '"' + (data.placeholder ? ' placeholder="' + data.placeholder + '"' : '') + '>';

					data.buttons = [
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
				case 'alert':
					// alert dialogue
					dialogueBox.addClass('alert');
					content = '<p>' + data.msg + '</p>';

					data.buttons = [
						{
							label:'OK',
							value:true,
							'class':'confirm'
						}
					];
				break;
				default:
					// custom dialogue
					dialogueBox.addClass('custom');
					content = '<p>' + data.msg + '</p>' +
								(data.val ? '<input type="text" name="value" value="' + (data.value || '') + '"' + (data.placeholder ? ' placeholder="' + data.placeholder + '"' : '') + '>' : '');

					// loop through the buttons and ensure that they contain the correct data
					$.each(data.buttons, function(i, button){
						data.buttons[i] = $.extend({}, lib.buttonTemplate, button);
					});
				break;
			}

			// add the content to the pop-up
			dialogueBox.children('.content').html(content);

			// add any buttons to the pop-up
			$.each(data.buttons, function(){
				if(this.label){
					buttonHTML += '<button type="button" value="' + ((this.value === undefined) ? null : this.value) + '" class="' + (this['class'] || '') + '">' + this.label + '</button>';
				}
			});
			buttonBox.append(buttonHTML);


			// add the dialogue and set it's position
			dialogueBox
				.appendTo('body')					// add the dialogue box to the document body
				.css({margin:0, left:0, top:0})		// remove existing margin/positioning
				.css({								// add our own
					left:($(window).width()/2) - (dialogueBox.outerWidth()/2),
					top:($(window).height()/2) - (dialogueBox.outerHeight()/2)
				})
				.hide()
				.fadeIn(data.animSpeed);

			// add the overlay
			overlay.appendTo('body').stop(true, true).hide().fadeIn(data.animSpeed/2);

			/**
			 * re-position the dialogue when the screen size changes
			 */
			$(window).on('resize' + this.nameSpace, function(){
				dialogueBox
					.css({margin:0, left:0, top:0})		// remove existing margin/positioning
					.css({								// add our own
						left:($(window).width()/2) - (dialogueBox.outerWidth()/2),
						top:($(window).height()/2) - (dialogueBox.outerHeight()/2)
					});
			});


			// add click events for the buttons
			buttonBox.children('button').on('click' + this.nameSpace, function(e){
				e.preventDefault();

				// hide the dialogue box and remove it
				dialogueBox.stop(true, true).fadeOut(data.animSpeed, function(){
					dialogueBox.remove();

					// check the queue for our next dialogue
					if(lib.queue.length > 0){
						// next dialogue specified - trigger it
						lib.doDialogue(lib.queue.shift());
					}
				});

				// hide and remove the overlay
				overlay.fadeOut(data.animSpeed/2, function(){
					overlay.remove();
				});

				lib.active = false;

				// fire the callback function
				if($.isFunction(data.callback)){
					var btnVal = $(this).val(),
						inputVal = dialogueBox.find('> .content input[type=text][name=value]').val() || null;
					btnVal = (btnVal == 'true') ? true : ((btnVal == 'false') ? false : ((btnVal == 'null') ? null : btnVal));

					data.callback.apply(window, [btnVal, inputVal]);
				}
			});
		}
	};
})(jQuery, window, document);