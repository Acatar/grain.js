/* ========================================================================
 * grain.js: grain.reflection.js
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

(function ($, window, grain) {
    (function (factory) {                                               // The factory: support module loading scenarios, such as require.js
        if (typeof define === 'function' && define.amd) {               // If a module loader, such as require.js, is present
            return define('grain.reflection', ['jquery', 'grain'], factory); // Define and return the anonymous AMD module
        } 
        else {                                                          // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                         // If grain is undefined
                window.grain = function () { return $.extend(true, {}, grain); }; // Create the namespace
            }

            return factory($, grain, grain.reflection);              // Add this module as a global variable, and return it
        }
    })(function($, grain, $ref) {
        $ref = $ref || grain.reflection || {};
        
        // Find a function in the window, by fully qualified name, or turn the code into a function
        // Returns an anonymous function otherwise. if paramNameArray is not null, they are added to the function as parameters
        // code [function] or [string]: the fully qualified name for the function, or a function itself
        // paramNameArray [String Array]: the parameters to be added to the anonymous function, if the function doesn't exist in this window
        $ref.findFunction = function (fullyQualifiedName, paramNameArray) {
            return $ref.findOrGenerateFunction(fullyQualifiedName, paramNameArray);
        }

        // Find a function in the window, by fully qualified name, or generate a function with the code that is passed in as the code parameter
        // Returns an anonymous function otherwise. if paramNameArray is not null, they are added to the function as parameters
        // code [function] or [string]: the fully qualified name for the function, or a function itself
        // paramNameArray [String Array]: the parameters to be added to the anonymous function, if the function doesn't exist in this window
        $ref.findOrGenerateFunction = function (code, paramNameArray) {
            if (typeof (code) === "function")                   // if the code is already in function form (i.e. it's not a string)
                return code;                                    // return it

            var fn = window, parts = (code || "").split(".");   // otherwise, set a fn property to the value of the code (assume it's a string)
            while (fn && parts.length) {
                fn = fn[parts.shift()];
            }
            if (typeof (fn) === "function")                     // if the code turns out to be a function, return it
                return fn;

            if ((typeof (code) === "string") && paramNameArray) {
                                                                // otherwise, return an anonymous function with the supplied argNames
                // e.g. FindOrGenerateFunction("return a + b;", ["a", "b"]) 
                // will return Function.constructor.apply(null, ["a", "b", "return a + b;"]);
                paramNameArray.push(code);
                return Function.constructor.apply(null, paramNameArray);
            }
            else if (typeof (code) === "string") {
                return new Function(code);
            }

            return Function.constructor;                        // we really struck out, return an anonymous function
        };

        // Find an object in the window, by fully qualified name, or parse the code that is passed in as the code parameter
        // Returns an empty object otherwise.
        // fullyQualifiedName [object] or [string]: the fully qualified name for the object, or an object itself
        $ref.findObject = function (fullyQualifiedName) {
            return $ref.findOrParseObject(fullyQualifiedName);
        }

        // Find an object in the window, by fully qualified name, or parse the code that is passed in as the code parameter
        // Returns an empty object otherwise.
        // code [object] or [string]: the fully qualified name for the object, or an object itself
        $ref.findOrParseObject = function (code, returnDefault) {
            if (typeof (code) === 'object')                     // if the code is already in object form (i.e. it's not a string)
                return code;                                    // return it
                                                                // otherwise, set an obj property to the value of the fullyQualifiedName (assume it's a string)
            var obj = window, parts = (code || "").split(".");
            while (obj && parts.length) {
                obj = obj[parts.shift()];
            }

            if (typeof (obj) === 'object' 
                || typeof (obj) === 'string'
                || typeof (obj) === 'function')                 // if the obj turns out to be an object, function or string, return it
                return obj;

            try {                                               // maybe the fullyQualifiedName is actually JSON, try to parse it
                return $.parseJSON(code);
            }
            catch (e) {
                if(returnDefault || returnDefault === undefined)
                    return {};                                      // we struck out, return an empty object
                return null;
            }
        }        


        // getProperties, getAllFunctions getOwnFunctions and inspired by: http://www.htmlgoodies.com/tutorials/web_graphics/object-reflection-in-javascript.html
        $ref.getProperties = function(obj) {
            var properties = [];
            for (var prop in obj) {
                if (typeof obj[prop] != 'function') {
                    properties.push(prop);
                }
            }
            return properties;            
        }

        $ref.getAllFunctions = function(obj) {
            var methods = [];
            for (var method in obj) {
                if (typeof obj[method] == 'function') {
                    methods.push(method);
                }
            }
            return methods;            
        }

        $ref.getOwnFunctions = function(obj) {
            var methods = [];
            for (var method in obj) {
                if (typeof obj[method] == 'function'
                   && obj.hasOwnProperty(method)) {
                    methods.push(method);
                }
            }
            return methods;            
        }

        $.extend({
            findFunction: $ref.findFunction,
            findObject: $ref.findObject
        });

        return $ref;      
    });
})(window.jQuery, window, window.grain);