/* ========================================================================
 * grain.js: grain.array.js
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
            return define('grain.array', ['jquery', 'grain'], factory); // Define and return the anonymous AMD module
        } 
        else {                                                          // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                         // If grain is undefined
                window.grain = function () { return $.extend(true, {}, grain); }; // Create the namespace
            }

            return factory($, grain, grain.array);              // Add this module as a global variable, and return it
        }
    })(function($, grain, $arr) {
        $arr = $arr || grain.array || {};
        
        $arr.merge = function (array1, array2) {
            if(arguments.length == 0)
                return null;

            if(array1 != null && array2 == null)
                return array1;

            if(array1 == null && array2 != null)
                return array2;

            array1.push.apply(array1, array2);
            return array1;
        }

        return $arr;      
    });
})(window.jQuery, window, window.grain);