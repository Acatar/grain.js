/**
* grain.js v1.1.0 by &y
* Copyright 2013 Acatar, LLC
* http://www.apache.org/licenses/LICENSE-2.0
*/

/* ========================================================================
 * grain.js v1.1.0
 * http://...
 * ========================================================================
 * Copyright 2013 Acatar, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */

(function ($, window) {
    (function (factory) {                                                           // The factory: support module loading scenarios, such as require.js
        if (typeof define === 'function' && define.amd) {                           // If a module loader, such as require.js, is present
            return define('grain', ['jquery'], factory);                            // Define and return the anonymous AMD module
        } 
        else {                                                                      // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                                     // If grain is undefined
                window.grain = function () { return $.extend(true, {}, window.grain); };   // Create the namespace
            }

            return factory($, window.grain);                                        // Add this module as a global variable, and return it
        }
    })(function($, $grain) {

        if ($ === undefined) { throw new Error("grain requires jQuery") }

        /*  the constructor pattern we use allows extension of the global grain, 
        *   as well as cloning grain by using the constructor:
        *   
        *   var foo = function() { return $.extend(true, {}, foo); }
        *       can be extended like this:
        *           foo.bar = 'hello world';
        *       and can be cloned like this:
        *           var newFoo = new foo();
        *
        *   newFoo will include all of the properties and functions that existed on foo, at the time of cloning, 
        *   but is a fork of foo for any further definition.
        *   
        *   This becomes particularly useful for features like grain.cache.  You can create multiple instances of 
        *   grain.cache, using different cache providers, to give data different state rules (i.e. foo exists beyond this page load, but bar does not).
        */

        $grain = $grain || function() { return $.extend(true, {}, $grain); };

        // module registration
        // ================================================================
        // for loading without amd, all modules are registered and then extended by their definitions, to 
        // support dependencies between modules that may have not loaded yet.


        $grain.string = function() { return $.extend(true, {}, $grain.string); };
        $grain.date = function() { return $.extend(true, {}, $grain.date); };
        $grain.array = function() { return $.extend(true, {}, $grain.array); };
        $grain.reflection = function() { return $.extend(true, {}, $grain.reflection); };
        $grain.wait = function() { return $.extend(true, {}, $grain.wait); };

        $grain.ajax = function() { return $.extend(true, {}, $grain.ajax); };
        $grain.cache = function(options) { var _cache = $.extend(true, {}, $grain.cache, options); if(_cache.init) { _cache.init(options); } return _cache; };
        $grain.formSubmitEvents = function() { return $.extend(true, {}, $grain.formSubmitEvents); };
        $grain.queryString = function() { return $.extend(true, {}, $grain.queryString); };
        $grain.uri = function() { return $.extend(true, {}, $grain.url); };
        $grain.wizard = function() { return $.extend(true, {}, $grain.wizard); };   


        // jQuery extensions
        // ================================================================        

        $.extend({
            // Returns the current jQuery version
            version: function () {
                return $().jquery;
            },
            getFocusedElement: function () {
                var _el;
                $(":input").focus(function () {
                    _el = this;
                });
                return _el;
            }
        });

        // Returns true if an element exists, otherwise false
        // $('#primary_content').exists();
        $.fn.exists = function () {
            return this.length > 0;
        };

        // If the style attribute for an element doesn't already exist, adds a style attribute with the given style css, 
        // otherwise appends the existing style css with the given css.
        // example: $('#primary_content').appendStyle('color: red;');
        $.fn.appendStyle = function (style) {
            var _existingStyle = this.attr('style') != undefined ? this.attr('style') : '';
            return this.attr('style', _existingStyle + style);
        };  

        window.grain = $.grain = $grain;
        return $grain;      
    });
})(window.jQuery, window);