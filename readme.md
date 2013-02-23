# Bill - a front-end HTML/CSS bootstrap

This is a bootstrap for use developing dynamic front-end web applications.

It utilises bits from various different existing bootstraps, CSS resets and other such things (such as .htaccess and robot.txt files) and combines them into something ideal for my own uses.

## Files
### Source
The files under '/src/' are the development 'source' files.

It contains all of the original un-compressed files, such as SASS files.

Any changes to code should be made here first, then ported over to the distribution directory.

### Distribution
The '/dist/' directory contains the actual distribution ready files.
Once source files have ben modified and changes accepted, they will be copied across to their relevant location in the '/dist/' directory.

All SASS files will be pre-compiled into CSS before-hand and js should also be pre-compiled and minified (see pre-compiling section below).


## Testing
The '/test.html' file contains examples of all of the base bill system and basic parts of the UI system, such as form styles, code/pre tags etc.

The '/ui.html' file contains test examples of all of the major UI systems, such as the Accordion


## Pre-Compiling CSS and JS
# CSS
All of the CSS is developed with SASS. Before deployment to the distribution directory, it must be compiled.

This can be done easily, via the command line:

1. Install SASS: `gem install sass`
2. Compress bill: `sass src/assets/scss/bill.scss dist/assets/css/bill.min.css --style compressed`
3. Compress bill UI: `sass src/assets/scss/bill-ui.scss dist/assets/css/bill-ui.min.css --style compressed`

# JS
Although the JS is perfectly valid as separate files, for distribution, we want to compile it all into a single file.

For this, we're using a JS pre-processor aptly called, 'Javascript Preprocessor' (http://js-preprocessor.com/), although it doesn't appear to minify code too, so may be replaced at a later date.

Combining files is as easy as:

1. Install JS Preprocessor first: `gem install jspp`
2. Run the following `jspp src/assets/js/bill.js > dist/assets/js/bill.min.js`