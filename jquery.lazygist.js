/**
 * Lazygist v0.1
 *
 * a jQuery plugin that will lazy load your gists.
 *
 * since jQuery 1.7.2
 * https://github.com/tammo/jquery-lazy-gist
 *
 * Copyright, Tammo Pape
 * http://www.tammopape.de
 *
 * Licensed under the MIT license.
 */

(function( $ ){

	var options;
	
	// will be temporarily replaced
	var originwrite = document.write;
	
	// stylesheet urls found in document.write calls
	// they are cached to write them once to the document,
	// not three times for three gists
	var stylesheets = [];
	
	// if lock has elements, there are write functions active
	// this is used to restore the origin document.write function after all
	var lock_stack = [];

	var methods = {
		
		/**
		 * Standard init function
		 * No magic here
		 */
		init : function( options_input ){
		
			// default options are default
			options = $.extend({
				
				// add the ?file parameter to set a filename correctly
				'url_template' : 'https://gist.github.com/{id}.js?file={file}',
				
				// if these are strings, the attributes will be read from the element
				'id' : 'data-id',
				'file' : 'data-file'
			}, options_input);
		
			return this.lazygist('load');
		},
		
		/**
		 * Load the gists
		 */
		load : function() {
			// (!) replace origin document.write function
			//
			// iterate over gist anchors
			// (1) collect html by injecting script elements
			// (2) append the gist-iframe through the new document.write func (see _write)
			
			document.write = methods['_write'];
			
			return this.filter('[data-id]').each(function(){
				// (1)
				// there will be a _write call soon, so dont restore origin write
				lock_stack.push(true);
				
				// todo: better checks
				var id = $(this).attr(options.id);
				var file = $(this).attr(options.file);
				
				if ( id != undefined ) {
					
					var src = options.url_template.replace(/{id}/g, id).replace(/{file}/g, file);
					
					// (2)
					$.getScript(src);
					
					// here we think, that there will always be a succesfull ajax call,
					// that will restore the origin write function (see _write) in the end
					//
					// but we should take care of errors (todo)
				}
			});
		},
		
		/**
		 * Special document.write function
		 *
		 * Filters the css file from github.com to add it to the head - once -
		 *
		 * Will replace itself after getting things done. This happens
		 * to keep flexibility with other scripts as high as possible
		 * (create a ticket if it messes things up!)
		 */
		_write : function( content ) {
			
			if( content.indexOf( 'rel="stylesheet"' ) != -1 ) {
				var href = /href="(.*github.com.*.css)"/g.exec(content);
				
				if ( $.inArray(href[1], stylesheets) == -1 ) {
							
					$('head').append(content);
					stylesheets.push(href[1]);
				}
				
			} else if( content.indexOf( 'id="gist' ) != -1 ) {
				var id = /gist-([\d]{1,})/g.exec(content);
				
				$('.gist_here[data-id=' + id[1] + ']').append(content);
			
			
				// i am done with this _write func, release
				var popped = lock_stack.pop();
				
				if(popped === undefined) {
					// it is the last _write call
					document.write = originwrite;
				}
				
			} else {
				// this is a fallback for interoperability
				originwrite.apply( this, arguments );
			}
		}
	};

	// method invocation - from jQuery.com
	$.fn.lazygist = function( method ) {
	
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.lazygist' );
		}    
	};

})(jQuery);