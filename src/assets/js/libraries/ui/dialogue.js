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
		version:'0.0.1',
		nameSpace:Bill.eventNameSpace + '.dialogue',
		options:{
			animSpeed:400,
			type:'alert',
			msg:null,
			value:null,
			callback:null,
			buttons:[],
			dialogueID:'dialoguePopup'
		},
		buttonTemplate:{
			label:'button',
			value:true,
			'class':''
		},
		queue:[],
		active:false,
		init:function(scope, method, options){
			this.scope = scope || this.scope;

			if(typeof method === 'object'){
				// method is actually options
				if(!method.noHandle){
					// don't save options if using noHandle
					$.extend(true, this.options, method);
				}
			}else if(typeof method === 'string'){
				// call the method and return
				return this[method].call(this, options);
			}

			if(method.noHandle){
				// noHandle has been defined - this means that we don't attach the event handlers.
				// instead we just throw out the dialogues immediately

				// output the dialogue
				this.doDialogue(method);
				return;
			}else if(!this.options.init){
				this.on();
			}

			return this.options.init;
		},
		/**
		 * Activates the plugin
		 */
		on:function(){
			var lib = this,
				$scope = $(this.scope);

			/**
			 * Add the dialogue click handler
			 */
			$scope.on('click' + this.nameSpace, '[data-dialogue]', function(e){
				e.preventDefault();

				var $btn = $(this),
					availableData = ['msg', 'type', 'value', 'placeholder'],
					options = {};

				// loop through and check if any custom data attributes have been defined for this dialogue
				$.each(availableData, function(i, attr){
					if($btn.attr('data-' + attr)){
						options[attr] = $btn.attr('data-' + attr);
					}
				});

				lib.doDialogue($.extend({}, lib.options, options));
			});

			if(lib.options.auto){
				// we need to auto-fire the dialogue
				$scope.find('[data-dialogue]').click();
			}else{
				// loop through each dialogue, that is set to auto, and trigger the dialogue
				$scope.find('[data-dialogue][data-auto]').click();
			}

			this.options.init = true;
		},
		/**
		 * De-activates the plugin
		 */
		off:function(){
			// clear the queue
			this.queue = [];
			// remove the click handler
			$(this.scope).off(this.nameSpace);
			$(window).off(this.nameSpace);
		},
		doDialogue:function(options){
			if(this.active){
				// dialogue already exists - add this to the queue
				this.queue.push(options);

				return true;
			}else if(!options.msg){
				// no message defined - we can't continue

				if($.isFunction(options.callback)){
					// we have a callback - trigger it, with a return value of null
					options.callback.apply(window, [options.type, null, null]);
				}

				return false;
			}


			// if we're here, then all is okay and we can create the alert box
			this.active = true;

			var lib = this,
				dialogueBox = $('<div id="' + this.options.dialogueID + '" class="dialogueBox float">' +	// the pop-up box
					'<div class="content"></div>' +
					'<div class="buttons"></div>' +
				'</div>'),
				overlay = $('#dialogueOverlay'),													// the overlay
				content = '',																		// the dialogue content
				buttonBox = dialogueBox.children('.buttons'),										// the button container
				buttonHTML = '';																	// the markup for outputting the buttons

			// if the overlay doesn't already exist, create it
			overlay = overlay.length ? overlay : $('<div id="dialogueOverlay"></div>');

			switch(options.type.toLowerCase()){
				case 'confirm':
					// confirmation dialogue
					dialogueBox.addClass('confirmation');
					content = '<p>' + options.msg + '</p>';

					options.buttons = [
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
					content = '<p>' + options.msg + '</p>' +
								'<input type="text" name="value" value="' + (options.value || '') + '"' + (options.placeholder ? ' placeholder="' + options.placeholder + '"' : '') + '>';

					options.buttons = [
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
					content = '<p>' + options.msg + '</p>';

					options.buttons = [
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
					content = '<p>' + options.msg + '</p>' +
								(options.val ? '<input type="text" name="value" value="' + (options.value || '') + '"' + (options.placeholder ? ' placeholder="' + options.placeholder + '"' : '') + '>' : '');

					// loop through the buttons and ensure that they contain the correct data
					$.each(options.buttons, function(i, button){
						options.buttons[i] = $.extend({}, lib.buttonTemplate, button);
					});
				break;
			}

			// add the content to the pop-up
			dialogueBox.children('.content').html(content);

			// add any buttons to the pop-up
			$.each(options.buttons, function(){
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
				.fadeIn(options.animSpeed);

			// add the overlay
			overlay.appendTo('body').stop(true, true).hide().fadeIn(options.animSpeed/2);

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
				dialogueBox.stop(true, true).fadeOut(options.animSpeed, function(){
					dialogueBox.remove();

					// check the queue for our next dialogue
					if(lib.queue.length > 0){
						// next dialogue specified - trigger it
						lib.doDialogue(lib.queue.shift());
					}
				});

				// hide and remove the overlay
				overlay.fadeOut(options.animSpeed/2, function(){
					overlay.remove();
				});

				lib.active = false;

				// fire the callback function
				if($.isFunction(options.callback)){
					var btnVal = $(this).val(),
						inputVal = dialogueBox.find('> .content input[type=text][name=value]').val() || null;
					btnVal = (btnVal == 'true') ? true : ((btnVal == 'false') ? false : ((btnVal == 'null') ? null : btnVal));

					options.callback.apply(window, [options.type, btnVal, inputVal]);
				}
			});
		}
	};
})(jQuery, window, document);