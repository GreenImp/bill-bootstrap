/**
 * Author: GreenImp
 * Date Created: 19/03/2013 10:44
 */

;(function($, window, document, undefined){
	"use strict";

	/**
	 * jQuery extension functions
	 */
	$.extend({
		/**
		 * Adds jQuery function for getting the URL query strings.
		 * If `name` is defined, then it will return that named value
		 *
		 * @param name
		 * @returns {*}
		 */
		getQueryString:function(name){
			return Bill.extension('querystring', name);
		},
		/**
		 * Returns the viewport size
		 *
		 * @returns {{width: number, height: number}}
		 */
		viewport:function(method){
			return Bill.extension('viewport', method);
		}
	});
}(jQuery, window, document));


/**
 * Console failsafe, to stop errors when console is unavailable
 * http://paulirish.com/2008/graceful-degredation-of-your-firebug-specific-code/
 */
if(!('console' in window)){
	var names = [
		'assert',
		'count',
		'debug',
		'dir',
		'dirxml',
		'error',
		'group',
		'groupEnd',
		'info',
		'log',
		'profile',
		'profileEnd',
		'time',
		'timeEnd',
		'trace',
		'warn'
	];
    window.console = {};
    for(var i = 0; i < names.length; i++){
		window.console[names[i]] = function(){};
	}
}




/* ==========================================================================
 * String Functions
 * ========================================================================== */

/**
 * Allows padding of the string.
 * Default pad type is right.
 *
 * @param input
 * @param length
 * @param type
 * @returns {string}
 */
String.prototype.pad = function(input, length, type){
	if((type == 'l') || (type == 'left')){
		// pad left
		return (new Array(length+1).join(input)+this).slice(-length);
	}else{
		// pad type not left - assume right
		return (this+new Array(length+1).join(input)).slice(0,length);
	}
};

/**
 * Left pads the string
 *
 * @param input
 * @param length
 * @returns {string}
 */
String.prototype.lPad = function(input, length){
	return this.pad(input, length, 'l');
};

/**
 * Right pads the string
 *
 * @param input
 * @param length
 * @returns {string}
 */
String.prototype.rPad = function(input, length){
	return this.pad(input, length, 'r');
};


/**
 * Trims the string.
 * Default trim type is both.
 *
 * @param input
 * @param type
 * @returns {string}
 */
String.prototype.trim = function(input, type){
	input = input || '\s';
	type = ((type == 'l') || (type == 'left')) ? 'l' : (((type == 'r') || (type == 'right')) ? 'r' : 'b');

	return this.replace(new RegExp(((type != 'r') ? '^[' + input + ']+' : '') + ((type == 'b') ? '|' : '') + ((type != 'l') ? '[' + input + ']+$' : ''), 'g'), '');
};

/**
 * Left trims the string
 *
 * @param input
 * @returns {string}
 */
String.prototype.lTrim = function(input){
	return this.trim(input, 'l');
};

/**
 * Right trims the string
 *
 * @param input
 * @returns {string}
 */
String.prototype.rTrim = function(input){
	return this.trim(input, 'r');
};



/* ==========================================================================
 * Array Functions
 * ========================================================================== */

/*
 * Array max function,
 * returns the highest number, in the array
 *
 * Used like:
 *
 * `var myArray = [1, 10, 458, 12],
 * 	max = myArray.max();
 * console.log(max); // outputs 458`
 */
Array.prototype.max = function(){
	return Math.max.apply(null, this)
};

/*
 * Array min function,
 * returns the lowest number, in the array
 *
 * Used like:
 *
 * `var myArray = [1, 10, 458, 12],
 * 	min = myArray.min();
 * console.log(min); // outputs 1`
 */
Array.prototype.min = function(){
	return Math.min.apply(null, this)
};

/*
 * Array sum function,
 * returns the sum total of all values, in the array
 *
 * Used like:
 *
 * `var myArray = [1, 10, 458, 12],
 * 	sum = myArray.sum();
 * console.log(sum); // outputs 481`
 */
Array.prototype.sum = function(){
	var length = this.length,
	sum = 0;
	for(var i = 0; i < length; i++){
		sum += parseFloat(this[i]);
	}

	return sum;
};



/* ==========================================================================
 * Object Functions
 * ========================================================================== */

// check if browser supports Object.defineProperty
var hasDefineProperty = (typeof Object.defineProperty == 'function');
try{
	// try and add a property
	Object.defineProperty({}, 'propTest', {});
}catch(e){
	// adding property failed
	hasDefineProperty = false;
}

if(hasDefineProperty){
	/**
	 * Checks if the given object is equal
	 * to (same as) the current object.
	 *
	 * @param obj
	 * @returns {boolean}
	 */
	Object.defineProperty(Object.prototype, 'sameAs', {
		value:function(obj){
			// if objisn't an object return false
			if(typeof obj !== 'object'){
				return false;
			}

			// loop through all values in `this` and check that they exist in obj
			var i;
			for(i in this){
				if(typeof(obj[i])=='undefined'){
					// property doesn't exist in obj
					return false;
				}
			}

			for(i in this){
				if(this[i]){
					switch(typeof this[i]){
						case 'object':
							// property is an object
							if((typeof this[i].sameAs !== 'function') || !this[i].sameAs(obj[i])){
								// object has no comparison function or they are not the same
								return false;
							}
						break;
						case 'function':
								// property is a function
							if(
								typeof(obj[i]) == 'undefined' ||
								(i != 'sameAs' && this[i].toString() != obj[i].toString())
							){
								// property is undefined in obj or functions are not the same (ignoring the comparison function)
								return false;
							}
						break;
						default:
							if(this[i] != obj[i]){
								// properties aren't equal (lazy comparison)
								return false;
							}
						break;
					}
				}else if(obj[i]){
					// property set in obj, but not in `this`
					return false;
				}
			}

			// loop through all values in obj and check that they exist in `this`
			for(i in obj){
				if(typeof(this[i]) == 'undefined'){
					// property doesn't exist in `this`
					return false;
				}
			}

			return true;
		  }
	});
}


/**
 * Allows the basic use of 'bind()' on function calls
 * for browsers that don't natively support it
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
 */
if(!Function.prototype.bind){
	Function.prototype.bind = function(oThis){
		if(typeof this !== 'function'){
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}

		var aArgs = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP = function(){},
			fBound = function(){
				return fToBind.apply(
					this instanceof fNOP && oThis ? this : oThis,
					aArgs.concat(Array.prototype.slice.call(arguments))
				);
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}
