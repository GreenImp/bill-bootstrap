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
			val:null,
			callback:null,
			buttons:[]
		},
		buttonTemplate:{
			label:'button',
			value:true,
			'class':''
		},
		queue:[],
		dialogueID:'dialoguePopup',
		init:function(scope, method, options){
			this.scope = scope || this.scope;

			var lib = this,
				$elm = $(this.scope),
				data = $.extend($elm.data(this.nameSpace) || {}, this.options);

			if(typeof method === 'object'){
				// method is actually options
				$.extend(data, method);
			}else{
				$.extend(data, options);
			}

			// only continue if the functionality hasn't already been initialised
			if(!data.init){
				if(data.msg){
					// store the options in the element data
					data.init = true;
					$elm.data(this.nameSpace, data);

					if($(this.dialogueID).length > 0){
						// dialogue already exists - add this to the queue
						this.queue.push(data);

						return data.init;
					}

					var dialogueBox = $('<div id="' + this.dialogueID + '" class="dialogueBox float">' +								// the pop-up box
											'<div class="content"></div>' +
											'<div class="buttons"></div>' +
										'</div>'),
						overlay = ($('#dialogueOverlay').length > 0) ? $('#dialogueOverlay') : $('<div id="dialogueOverlay"></div>'),	// the overlay
						content = '',																									// the dialogue content
						buttonBox = dialogueBox.children('.buttons'),																	// the button container
						buttonHTML = '';																								// the markup for outputting the buttons

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
									'<input type="text" name="value" value="' + (data.val || '') + '">';

							data.buttons = [
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
									(data.val ? '<input type="text" name="value" value="' + (data.val || '') + '">' : '');

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
						buttonHTML += '<button type="button" value="' + this.value + '" class="' + (this['class'] || '') + '">' + this.label + '</button>';
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
						dialogueBox.stop(true, true).fadeOut(data.animSpeed, function(){
							dialogueBox.remove();

							// check the queue for our next dialogue
							if(lib.queue.length > 0){
								// next dialogue specified - trigger it
								$('body').bill('dialogue', lib.queue.shift());
							}
						});
						// hide and remove the overlay
						overlay.fadeOut(data.animSpeed/2, function(){
							overlay.remove();
						});

						// fire the callback function
						if($.isFunction(data.callback)){
							var value = null;
							if(data.type == 'prompt'){
								// we're on a prompt dialogue - check for inputted value
								value = ($(this).val() != 'null') ? dialogueBox.find('> .content input[type=text][name=value]').val() || null : null;
							}else{
								// normal pop-up - get the button value
								value = $(this).val();
								value = (value == 'true') ? true : ((value == 'false') ? false : ((value == 'null') ? null : value));
							}

							data.callback.apply(window, [value]);
						}
					});

					this.on();
				}else if($.isFunction(data.callback)){
					// no message defined, but we have a callback
					// trigger the callback function, with a return value of null
					callback.apply(window, [null]);
				}
			}else{
				// store the options in the element data
				$elm.data(this.nameSpace, data);
			}

			return data.init;
		},
		/**
		 * Activates the plugin
		 */
		on:function(){}
	};
})(jQuery, window, document);