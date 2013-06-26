/**
 * Bill.modal
 *
 * Shows modal dialogue boxes
 */
/*> vendor/jquery.fancybox-1.3.4_patch.js */

;(function($, window, document, undefined){
	"use strict";

	Bill.libs.modal = {
		name:'Modal',
		version:'0.1.0',
		nameSpace:Bill.eventNameSpace + '.modal',
		options:{
			width:'auto',				// modal width
			height:'auto',				// modal height
			modal:false,				// modal mode (forces overlay and disables overlay close on click
			overlayShow:true,			// show the overlay
			hideOnOverlayClick:true,	// hide on click of the overlay
			hideOnContentClick:false,	// hide on click of the content
			hideOnEscape:true,			// hide on press of the esc button
			showCloseButton:true,		// show the close button
			swf:{
				quality:'high'
			}
		},
		init:function(scope, method, options){
			this.scope = scope || this.scope;

			if(typeof method === 'object'){
				// method is actually options
				$.extend(true, this.options, method);
			}else if(typeof method === 'string'){
				// call the method and return
				return this[method].call(this, options);
			}

			if(!this.options.init){
				$('body').append(
					'<div id="modalWrapper">' +
						'<div id="modalInner">' +
							'<a href="#" title="Close" id="modalClose" class="closeBtn">Close</a>' +

							'<div class="controls">' +
								'<a href="#" title="Previous" class="page left">Prev</a>' +
								'<a href="#" title="Next" class="page right">Next</a>' +
							'</div>' +
						'</div>' +

						'<div class="caption"></div>' +
					'</div>'
				);

				$('#modalWrapper').hide();

				//this.on();
				this.options.init = true;
			}

			return this.options.init;
		},
		/**
		 * Activates the library
		 */
		on:function(){
			var lib = this;

			/**
			 * Handles click of the modal link
			 */
			$(this.scope).on('click', '[data-modal]', function(e){
				e.preventDefault();

				if(lib.busy){
					return false;
				}

				lib.busy = true;

				var $link = $(this),	// the link object
					url,				// link URL
					title,				// the content title
					type,				// the content type
					content;			// the content

				// check the URL
				url = $link.attr('data-url') || $link.attr('href');
				if(!url || (url == '') || (url == '#') || /^javascript/i.test(url)){
					// no valid URL defined
					return false;
				}

				// get the title
				title = lib.options.title || $link.attr('data-title') || $link.attr('title');

				// check for pre-defined content
				content = lib.options.content || $link.attr('data-content');

				// get the type
				type = lib.options.type || $link.attr('data-type') || (content ? 'html' : null);
				if(!type){
					if(0 === url.indexOf('#')){
						type = 'inline';
					}else if(lib.isImage(url)){
						type = 'image';
					}else if(lib.isVideo(url)){
						type = 'video';
					}else if(lib.isAudio(url)){
						type = 'audio';
					}else if(lib.isSWF(url)){
						type = 'swf';
					}else{
						type = 'ajax';
					}
				}

				if(type == 'inline'){
					// check to ensure that the inline element exists
					var hash = url.substr(url.indexOf('#'));
					if(!hash || (!$(hash).length)){
						// no hash in URL or element doesn't exist
						type = 'ajax';
					}else{
						url = hash;
					}
				}

				// store the type, for future use
				$link.attr('data-type', type);


				// get the final content
				/**
				 * TODO - add support for video/audio (using html5)
				 */
				switch(type){
					case 'inline':
						// check if the content is already in the modal
						if(true === $(url).parent().is('#modalInner')){
							// content is already in the modal
							lib.busy = false;
							return;
						}

						// TODO - add content to modal
					break;
					case 'ajax':
						$.get(url, function(data){
							// TODO - add content to modal
						});
					break;
					case 'swf':
						// TODO - output swf
						content = '<object type="application/x-shockwave-flash" data="' + url + '" width="100%" height="100%">' +
							'<param name="movie" value="' + url + '" />';

						$.each(lib.options.swf, function(name, val){
							content += '<param name="' + name + '" value="' + val + '" />';
						});

						content += '</object>';
					break;
					case 'image':
						// TODO - add image to modal
					break;
					case 'iframe':
						// TODO - add iframe, set URL and add to modal
					break;
					// video and audio currently not supported
					case 'video':
					case 'audio':
					default:
						// default is html
						// TODO - add content to modal
					break;
				}
			});
		},
		/**
		 * De-activates the library
		 */
		off:function(){
			$(this.scope).off(this.nameSpace);
		},
		/**
		 * Takes a string and checks if it is an image name
		 *
		 * Returns true, if it is; false otherwise.
		 *
		 * @param string
		 * @returns {boolean}
		 */
		isImage:function(string){
			return string && /\.(jpe?g|gif|png|bmp|svg)\s*$/i.test(string);
		},
		/**
		 * Takes a string and checks if it is a video file name
		 *
		 * Returns true, if it is; false otherwise.
		 *
		 * @param string
		 * @returns {boolean}
		 */
		isVideo:function(string){
			return string && /\.(mov|mp4|ogg|ogv|webm)/.test(string);
		},
		/**
		 * Takes a string and checks if it is an audio file name
		 *
		 * Returns true, if it is; false otherwise.
		 *
		 * @param string
		 * @returns {boolean}
		 */
		isAudio:function(string){
			return string && /\.(mp3|ogg|wav)/.test(string);
		},
		/**
		 * Takes a string and checks if it is an SWF (flash object) name
		 *
		 * Returns true, if it is; false otherwise.
		 *
		 * @param string
		 * @returns {boolean}
		 */
		isSWF:function(string){
			return string && /\.swf\s*$/i.test(string);
		}
	};
})(jQuery, window, document);