/**
 * Bill.modal
 *
 * Shows modal dialogue boxes
 */

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
			ajax:{},
			swf:{
				quality:'high'
			}
		},
		overlay:null,
		modal:null,
		modalContent:null,
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
				if(this.options.modal){
					// true modal
					this.options.overlayShow = true;
					this.options.hideOnOverlayClick = false;
					this.options.hideOnContentClick = false;
					this.options.showCloseButton= true;
				}

				// build the modal elements and add them to the page
				this.overlay = $('<div id="modalOverlay"></div>').appendTo('body');
				this.modal = $('<section id="modalWrapper" tabindex="-1">' +
					'<div class="inner">' +
						'<header id="modalLabel"></header>' +

						'<div id="modalContent"></div>' +
					'</div>' +

					'<div class="controls">' +
						'<a href="#" title="Previous" class="page prev">Prev</a>' +
						'<a href="#" title="Next" class="page next">Next</a>' +
					'</div>' +

					'<a href="#" title="Close" id="modalClose" class="closeBtn">Close</a>' +
				'</section>').appendTo('body');

				this.modalContent = $('#modalContent');

				this.on();
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
			$(this.scope).on('click' + this.nameSpace, '[data-modal]', function(e){
				e.preventDefault();

				if(lib.__isBusy()){
					// modal already busy - return
					return false;
				}

				// flag modal as busy
				lib.__setBusy();

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
				title = lib.options.title || $link.attr('data-title') || $link.attr('title') || $link.attr('alt');

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
						var $obj = $(url);
						if(true === $obj.parent().is('#modalContent')){
							// content is already in the modal
							lib.busy = false;
							return;
						}

						// TODO - store previous location, so we can put it back where it belongs when modal is closed
						lib.__setIdle();
						lib.show($obj, type);
					break;
					case 'ajax':
						var ajaxLoader = $.ajax($.extend({}, lib.options.ajax, {
							url:url,
							data:lib.options.ajax.data || {},
							error:function(XMLHttpRequest, textStatus, errorThrown){
								if(XMLHttpRequest.status > 0){
									// TODO - throw error
									lib.__setIdle();
								}
							},
							success:function(data, textStatus, XMLHttpRequest){
								// get the XMLHttp request object
								var o = typeof XMLHttpRequest == 'object' ? XMLHttpRequest : ajaxLoader;

								// check the status
								if(o.status == 200){
									// check if a callback function has been defined
									if(typeof lib.options.ajax.onSuccess == 'function'){
										var r = lib.options.ajax.onSuccess.call(lib.scope, url, data, textStatus, XMLHttpRequest);

										if(false === r){
											// callback function returned false
											return false;
										}else if((typeof r == 'string') || (typeof r == 'object')){
											data = r;
										}
									}

									lib.__setIdle();
									lib.show(data, type);
								}else{
									// status not 200 - okay
									// TODO - throw error
									lib.__setIdle();
								}
							}
						}));
					break;
					case 'swf':
						content = '<object type="application/x-shockwave-flash" data="' + url + '" width="100%" height="100%">' +
							'<param name="movie" value="' + url + '" />';
						$.each(lib.options.swf, function(name, val){
							content += '<param name="' + name + '" value="' + val + '" />';
						});
						content += '</object>';

						lib.__setIdle();
						lib.show(content, type);
					break;
					case 'image':
						lib.show(
							lib.__loadImage(
								url,
								title,
								function(){
									lib.__setIdle();
								},
								function(e){
									// TODO - throw error
									lib.__setIdle();
								}
							), type
						);
					break;
					case 'iframe':
						lib.__setIdle();
						lib.show('<iframe src="' + url + '"></iframe>', type);
					break;
					// video and audio currently not supported
					case 'video':
					case 'audio':
						return false;
					break;
					default:
						// default is html
						lib.__setIdle();
						lib.show(content, type);
					break;
				}
			});

			$('#modalClose' + (this.options.hideOnOverlayClick ? ', #modalOverlay' : '')).on('click' + this.nameSpace, function(e){
				e.preventDefault();
				lib.close();
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
		},

		__setBusy:function(){
			this.busy = true;
			this.modal.addClass('loading');
		},
		__setIdle:function(){
			this.busy = false;
			this.modal.removeClass('loading');
		},
		__isBusy:function(){
			return !!this.busy;
		},
		__addContent:function(content){
			this.modalContent.empty().append(content);
		},
		__loadImage:function(src, title, load, error){
			var $img = $('<img alt="' + (title || 'Image') + '">');

			if(typeof load == 'function'){
				// image has an on load callback
				$img.on('load' + this.nameSpace, load);
			}

			if(typeof error == 'function'){
				// image has an on error callback
				$img.on('error' + this.nameSpace, error);
			}

			// set the image src and return the image
			return $img.attr('src', src);
		},
		__setType:function(type){
			this.modal.removeClass('image inline html ajax swf iframe video audio').addClass(type);
		},
		show:function(content, type){
			if(content){
				this.__addContent(content);
			}

			if(type){
				this.__setType(type);
			}

			this.overlay.addClass('visible');
			this.modal.addClass('visible');
		},
		close:function(){
			this.__setIdle();
			this.overlay.removeClass('visible');
			this.modal.removeClass('visible');
			this.modalContent.empty();
		}
	};
})(jQuery, window, document);