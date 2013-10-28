/* ========================================================================
 * grain.js: grain.wait.js
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

(function ($, window, grain, reflection) {
    (function (factory) {                                               // The factory: support module loading scenarios, such as require.js
        if (typeof define === 'function' && define.amd) {               // If a module loader, such as require.js, is present
            return define('grain.wait', ['jquery', 'grain', 'grain.reflection'], factory); // Define and return the anonymous AMD module
        } 
        else {                                                          // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                         // If grain is undefined
                window.grain = function () { return $.extend(true, {}, grain); };                                      // Create the namespace
            }

            return factory($, grain, reflection, grain.wait);   // Add this module as a global variable, and return it
        }
    })(function($, grain, reflection, $wait) {
        
        $wait = $wait || grain.wait || {};
        
        //====================================================================================================================
        // Wait
        //====================================================================================================================
        // Several setTimeout functions
        // inspired by http://fitzgeraldnick.com/weblog/35/
        
        // the interval to wait
        var _interval = $wait.interval = 40;

        // SetTimeout Wrapper
        $wait.once = function (fn, interval) {
            setTimeout(fn, interval != null && !isNaN(interval) ? interval : _interval);
        }

        // Retries only once
        $wait.when = function (isTrue, then, interval) {
            return $wait.until(isTrue, then, function () { /*on gave up*/ }, 0, 2, interval);
        }

        // Retries the number of times you set timesToTry to.
        // example: $.wait.until(function() { return true; }, function() { /* then */ window.console.info('it is true!'); }, function() { /* on gave up */ window.console.info('it was never true'); }, 0, 10);
        // example: $.wait.until(function() { return false; }, function() { /* then */ window.console.info('it is true!'); }, function() { /* on gave up */ window.console.info('it was never true'); }, 0, 10);
        $wait.until = function (isTrue, then, onGaveUp, timesTried, timesToTry, interval) {
            var __interval = interval != null && !isNaN(interval) ? interval : _interval; 

            if (timesTried == null)
                timesTried = 0; // the default timesTried is 0;
            if (timesToTry == null)
                timesToTry = 26;// the default timesToTry is 26, which at a default of 40ms intervals is 1 second;

            if (timesTried == 0) {
                if (reflection.findOrGenerateFunction(isTrue).apply()) {
                    return reflection.findOrGenerateFunction(then).apply();
                } else {
                    $wait.until(isTrue, then, onGaveUp, timesTried + 1, timesToTry, __interval);
                }
            }
            else if (timesTried < timesToTry) {
                $wait.once(function () {
                    if (reflection.findOrGenerateFunction(isTrue).apply()) {
                        return reflection.findOrGenerateFunction(then).apply();
                    } else {
                        $wait.until(isTrue, then, onGaveUp, timesTried + 1, timesToTry, __interval);
                    }
                }, __interval);
            }
            else {
                return reflection.findOrGenerateFunction(onGaveUp).apply();
            }
        }

        $.extend({
            wait: $wait
        });

        return $wait;      
    });
})( window.jQuery, 
    window, 
    window.grain, 
    window.grain !== undefined && window.grain.reflection !== undefined ? window.grain.reflection : undefined);