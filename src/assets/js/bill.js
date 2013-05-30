/**
 * Author: GreenImp Web
 * Date Created: 27/01/13 01:42
 */

if(typeof jQuery === 'undefined'){
	// jQuery is not defined
	throw new TypeError('jQuery is not defined', 'bill.js', 8);
}

(function($, window, document, undefined){
	'use strict';

	/**
	 * Base Bill Framework
	 */
	window.Bill = {
		name:'Bill-bootstrap',	// framework name
		version:'0.1.0',		// version number
		eventNameSpace:'.bill',	// namespace used for events
		libs:{},				// list of available libraries
		extensions:{},			// list of available plugins
		log:{},
		/**
		 * Initialises the Framework
		 *
		 * @param scope
		 * @param libraries
		 * @param method
		 * @param options
		 */
		init:function(scope, libraries, method, options){
			var libResponse = [],	// list of library load responses
				args = [			// list of arguments to apply to libraries
					scope, method, options
				];

			// set global scope (used in the libraries)
			this.scope = scope || this.scope;

			if(libraries && (typeof libraries === 'string')){
				// split the libraries by space (to get each supplied library) and loop through them
				$.each(libraries.split(' '), function(i, lib){
					// add the library to the list
					libResponse.push(Bill.initLibrary(lib, args));
				});
			}else{
				// no libraries specified - load them all
				$.each(this.libs, function(name, lib){
					// add the library to the list
					libResponse.push(Bill.initLibrary(name, args));
				});

				if(typeof libraries === 'function'){
					// if the first argument is actually a callback (not library),
					// add to the arguments list
					args.unshift(libraries);
				}
			}

			// TODO - check responses
			console.log(this.log);
		},
		/**
		 * Initialises the given library
		 *
		 * @param lib
		 * @param args
		 * @returns {*}
		 */
		initLibrary:function(lib, args){
			return this.catchLib(function(){
				// check if the library exists
				if(this.libs.hasOwnProperty(lib)){
					// define the correct library scope
					this.libs[lib].scope = this.scope;

					// initialise the library and return
					return this.libs[lib].init.apply(this.libs[lib], args);
				}
			}.bind(this), lib);
		},
		/**
		 * Error handling for library loading
		 *
		 * @param func
		 * @param lib
		 * @returns {*}
		 */
		catchLib:function(func, lib){
			try{
				return func();
			}catch(e){
				return this.error({
					name:lib,
					message:'could not be initialized',
					file:'bill.js',
					line:97,
					e:e
				});
			}
		},
		error:function(e){
			// build the message
			var msg = e.name + ' ' + e.message +
						(e.e ? '; ' + e.e.name + ' ' + e.e.message : '') +
						(e.file ? '; ' + e.file + (e.line ? ' - ' + e.line : '') : '');

			// add the message to the log
			this.log.error = this.log.error || [];
			this.log.error.push(msg);

			// return the message
			return msg;
		},
		/**
		 * De-activates plugins
		 */
		off:function(){
			$(this.scope).off(this.eventNameSpace);
			$(window).off(this.eventNameSpace);
			$(document).off(this.eventNameSpace);
		}
	};

	/**
	 * Define Bill jQuery plugin
	 * @returns {*}
	 */
	$.fn.bill = function(){
		// get the arguments
		var args = Array.prototype.slice.call(arguments, 0);

		// loop through each element and apply Bill
		// return this, to retain chain-ability
		return this.each(function(){
			Bill.init.apply(Bill, [this].concat(args));
			return this;
		});
	};
})(jQuery, window, document);

/**
 * Basic functionality
 */
/*> base/basic.js */


/**
 * Libraries
 */
/*> libraries/base/browserNotice.js */
/*> libraries/base/cookieNotice.js */

// UI functionality
/*> libraries/ui/accordion.js */
/*> libraries/ui/dialogue.js */
/*> libraries/ui/modal.js */
/*> libraries/ui/navigation.js */
/*> libraries/ui/notice.js */
/*> libraries/ui/slider.js */
/*> libraries/ui/tabs.js */


/**
 * Extensions
 */
/*> extensions/querystring.js */
/*> extensions/viewport.js */
