/**
 * Bill framework
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
		version:'0.0.1',		// version number
		eventNameSpace:'.bill',	// namespace used for events
		libs:{},				// list of available libraries
		exts:{},				// list of available exetensions
		log:{},
		rtl:false,			// return whether the site is RTL (Right To Left)
		/**
		 * Initialises the Framework
		 *
		 * @param scope
		 * @param libraries
		 * @param method
		 * @param options
		 */
		init:function(scope, libraries, method, options){
			var libResponse = [],				// list of library load responses
				dir = $('html').attr('dir');	// stores the html direction (LTR | RTL | BIDI)

			// reset the log
			this.log = {};

			// check RTL
			this.rtl = dir && ((dir == 'rtl') || (dir == 'RTL'));

			// set global scope (used in the libraries)
			this.scope = scope || this.scope;

			if(libraries && (typeof libraries === 'string')){
				if(libraries == 'off'){
					return this.off();
				}

				// split the libraries by space (to get each supplied library) and loop through them
				$.each(libraries.split(' '), function(i, lib){
					// add the library to the list
					libResponse.push(
						Bill.initLibrary(
							lib,
							[
								scope,
								(typeof method === 'object') ? method[lib] || method : method,
								(typeof options === 'object') ? options[lib] || options : options
							]
						)
					);
				});
			}else{
				// no libraries specified - load them all
				$.each(this.libs, function(name, lib){
					// add the library to the list
					libResponse.push(
						Bill.initLibrary(
							name,
							[
								scope,
								(typeof libraries === 'object') ? libraries[name] || libraries : libraries,
								(typeof method === 'object') ? method[name] || method : options
							]
						)
					);
				});

				/*if(typeof libraries === 'function'){
					// if the first argument is actually a callback (not library),
					// add to the arguments list
					args.unshift(libraries);
				}*/
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
			return this.catchLib(
				function(){
					// check if the library exists
					if(this.libs.hasOwnProperty(lib)){
						// define the correct library scope
						this.libs[lib].scope = this.scope;

						// initialise the library and return
						return this.libs[lib].init.apply(this.libs[lib], args);
					}
				}.bind(this),
				lib
			);
		},
		extension:function(ext, method, options){
			return this.catchLib(
				function(){
					// check if the extension exists
					if(this.exts.hasOwnProperty(ext)){
						// initialise the extension and return
						return this.exts[ext].init.call(this.exts[ext], method, options);
					}
				}.bind(this),
				ext
			);
		},
		/**
		 * Error handling for library loading
		 *
		 * @param func
		 * @param name
		 * @returns {*}
		 */
		catchLib:function(func, name){
			try{
				return func();
			}catch(e){
				return this.error({
					name:name,
					message:'could not be initialized',
					file:'bill.js',
					line:136,
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
			var scope = this.scope;

			$(this.scope).off(this.eventNameSpace);
			$(window).off(this.eventNameSpace);
			$(document).off(this.eventNameSpace);

			// loop through the libraries and call their `off` function
			$.each(this.libs, function(name, lib){
				// check if the extension exists
				if(lib.hasOwnProperty('off')){
					lib.off.call(lib, scope);
				}
			});
		},
		isRTL:function(scope){
			return this.rtl || ($(scope).closest('[dir="rtl"], [dir="RTL"]').length > 0);
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