/**
 * Author: leelangley
 * Date Created: 19/03/2013 10:44
 */

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
		var queryString = window.location.search.substr(1);
		if(!queryString){
			// no query string
			return name ? null : {};
		}

		// check for a cached query string
		var cache = $(window).data('queryString');
		cache = $.extend(cache, {}); // ensure that the cache is an object

		if(!cache[queryString]){
			// no cache exists for the current query string

			// get the query string and split by &
			var queryVars = queryString.split('&'),
				arrayCheck = /^([^\[]+)((\[[^\]]*\])+)$/,
				arrayKeyCheck = /\[[^\]]*\]/g;

			// the query string variable
			cache[queryString] = {};

			// loop through each key=>value pair
			for(var i = 0; i < queryVars.length; i++){
				if(queryVars[i]){
					var variable = queryVars[i].split('='),
						key = decodeURIComponent(variable[0]),
						value = (typeof variable[1] == 'string') ? decodeURIComponent(variable[1].replace(/\+/g, ' ')) : undefined;

					// check if the key is an array
					if(arrayCheck.test(key)){
						// key is an array
						key = RegExp.$1;	// the key

						// ensure that they key is initialised as a variable of the cache
						cache[queryString][key] = cache[queryString][key] || {length: 0};

						var arrayNames = '',							// string of previous array key names
							arrays = RegExp.$2.match(arrayKeyCheck),	// list of array key names
							arrayLen = arrays.length;					// count of array key names
						// loop through the array key names and create the variables
						$.each(arrays, function(i, subKey){
							// determine the key name - if it is a string, we use it, if it is empty we calculate the numeric number, from the current array length
							subKey = (subKey && (subKey != '[]')) ? '"' + subKey.replace(/\[|\]/g, '') + '"' : eval('cache[queryString][key]' + arrayNames + '.length');

							// create the variable - I KNOW that using eval is horrible, but it's the best solution I could come up with quickly.
							eval('cache[queryString][key]' + arrayNames + '[' + subKey + '] = cache[queryString][key]' + arrayNames + '[' + subKey + '] || ' + ((i+1 == arrayLen) ? 'value' : '[]'));

							// add the array key to the list
							arrayNames += !isNaN(subKey) ? '' : '[' + subKey + ']';
						});

						//cache[queryString][key][RegExp.$2 ? RegExp.$2 : cache[queryString][key].length] = value;
						cache[queryString][key].length++;
					}else{
						cache[queryString][key] = value;
					}
				}
			}

			// cache the result
			$(window).data('queryString', cache);
		}

		return name ? cache[queryString][name] : cache[queryString];
	},
	/**
	 * Returns the viewport size
	 *
	 * @returns {{width: number, height: number}}
	 */
	viewport:function(){
		var $window = $(window);

		return {
			width:Math.max($window.innerWidth(), window.innerWidth),
			height:Math.max($window.innerHeight(), window.innerHeight)
		}
	}
});



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

if(typeof Object.defineProperty == 'function'){
	/**
	 * Checks if the given object is equal
	 * to (same as) the current object.
	 *
	 * @param obj
	 * @returns {boolean}
	 */
	Object.defineProperty(Object.prototype, 'equals', {
		value:function(obj){
			var i;
			for(i in this){
				if(typeof(obj[i])=='undefined'){
					return false;
				}
			}

			for(i in this){
				if(this[i]){
					switch(typeof(this[i])){
						case 'object':
							if(!this[i].equals(obj[i])){
								return false;
							}
						break;
						case 'function':
							if(
								typeof(obj[i]) == 'undefined' ||
								(i != 'equals' && this[i].toString() != obj[i].toString())
							){
								return false;
							}
						break;
						default:
							if(this[i] != obj[i]){
								return false;
							}
						break;
					}
				}else{
					if (obj[i])
					return false;
				}
			}

			for(i in obj){
				if(typeof(this[i]) == 'undefined'){
					return false;
				}
			}

			return true;
		  }
	});
}