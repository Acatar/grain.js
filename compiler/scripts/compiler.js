(function ($, window, ko) {
    (function (factory) {                                              	// The factory: support module loading scenarios, such as require.js
        if (typeof define === 'function' && define.amd) {               // If a module loader, such as require.js, is present
            return define('compiler', ['jquery', 'knockout'], factory);	// Define and return the anonymous AMD module
        } 
        else {                                                        	// Otherwise, if a module loader is NOT present
			if (typeof grain === 'undefined') {							// If grain is undefined
        		window.grain = {};        								// Create the namespace
        	}

            return window.grain.compiler = factory($, ko);              // Add this module as a global variable, and return it
        }
    })(function($, ko) {
		var version = '1.1.0';

		var viewModel = {
			path: '/source/',
			modules: ko.observableArray(),
			addModule: function(data) {
				this.modules.push(new module(data));
			}		
		}

		var module = function(data) {
			var $this = this;
			$this.jsFile = ko.observable(data.jsFile);
			$this.dependencies = ko.observableArray(data.dependencies);

			$this.dependencyString = ko.computed(function() {
				var _dep = $this.dependencies();
				return _dep != null ? _dep.toString() : '';
			}, $this);

			return $this;
		}

		var minifiedOptions = {
			//code_url: '',
			compilation_level: 'SIMPLE_OPTIMIZATIONS',
			output_format: 'text',
			output_info: 'compiled_code',
			output_file_name: 'grain.' + version + '.min.js'
		}

		var debugOptions = $.extend({}, minifiedOptions);
		debugOptions.compilation_level = 'WHITESPACE_ONLY';
		debugOptions.formatting = 'pretty_print,print_input_delimiter';
		debugOptions.output_file_name = 'grain.' + version + '.js';

		var init = function() {
			viewModel.addModule({ jsFile: 'grain.js', dependencies: null });
			viewModel.addModule({ jsFile: 'grain.string.js', dependencies: ['grain.js'] });
			viewModel.addModule({ jsFile: 'grain.date.js', dependencies: ['grain.js'] });
			viewModel.addModule({ jsFile: 'grain.reflection.js', dependencies: ['grain.js'] });
			viewModel.addModule({ jsFile: 'grain.ajax.js', dependencies: ['grain.js', 'grain.string.js', 'grain.reflection.js'] });
			viewModel.addModule({ jsFile: 'grain.cache.js', dependencies: ['grain.js', 'grain.string.js', 'grain.reflection.js'] });
			viewModel.addModule({ jsFile: 'grain.formSubmitEvents.js', dependencies: ['grain.js', 'grain.string.js', 'grain.reflection.js', 'grain.ajax.js'] });
			viewModel.addModule({ jsFile: 'grain.queryString.js', dependencies: ['grain.js'] });
			viewModel.addModule({ jsFile: 'grain.url.js', dependencies: ['grain.js'] });
			viewModel.addModule({ jsFile: 'grain.wizard.js', dependencies: ['grain.js'] });
		}

		var $compiler = {};

		$compiler.init = function(options) {
			init();
			ko.applyBindings(viewModel, $('#moduleOptions')[0]);
		}

		$compiler.compile = function(minify) {
			var _options = minify ? minifiedOptions : debugOptions;
			var _serialized = JSON.stringify(_options);

			// todo minify the lib
		}

		return $compiler;
	});
})(window.jQuery, window, window.ko);