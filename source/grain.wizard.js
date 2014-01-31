/* ========================================================================
 * grain.js: grain.wizard.js
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
            return define('grain.wizard', ['jquery', 'grain'], factory);// Define and return the anonymous AMD module
        } 
        else {                                                          // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                         // If grain is undefined
                window.grain = function () { return $.extend(true, {}, grain); }; // Create the namespace
            }

            return factory($, grain, grain.wizard);                     // Add this module as a global variable, and return it
        }
    })(function($, grain, $wiz) {
        $wiz = $wiz || grain.wizard || {};
        
        $wiz.init = function (className) {
            $('.' + className + ':not(:first)').hide();                 // hide all the elements with the indicated class name except the first one.
            $('.' + className + ':first').show();                       // show the first one (in case it starts off hidden)

            $("." + className).click(function (ev) {
                var result = $(ev.target).attr('data-button');
                if (result) {
                    if (result === 'nextButton') {
                        $wiz.next(className);
                        ev.bubbles = false;
                    }
                    else if (result === 'previousButton') {
                        $wiz.previous(className);
                        ev.bubbles = false;
                    }
                }
            });
        };

        var move = function (nextBool, className) {
            var currentNode = $('.' + className + ':visible');          // the object with the indicated class immediately after 
            if (nextBool) {
                var validationFunction = $wiz.validationMethods[currentNode[0].id];
                if ($.isFunction(validationFunction) && !validationFunction()) {
                    return;
                }
                next = currentNode.next("." + className);
            } else {
                next = currentNode.prev('.' + className);
            }

            var prev = $('.' + className + ':visible');                 // the object that has the indicated class that is visible
            var uninitMethod = $wiz.unInitMethods[prev[0].id];          // get the uninit method by element id
            
            if (uninitMethod)                                           // if it's been set, run it and pass the node in to it
                uninitMethod(prev);
            
            prev.hide();                                                // hide the previously visible node
                                                                        // note: this hides the last node even if there isn't a next one
            
            if (next.length == 0) {                                     // if there are no more steps
                var doneMethod = $wiz.doneMethods[className];           // get the done method by class name
                
                if (doneMethod)                                         // if it's been set, run it
                    doneMethod();
            }
            else {
                var initMethod = $wiz.initMethods[next[0].id];          // get the init method by the id of the next element
                if (initMethod)                                         // if it's been set, run it
                    initMethod(next);
                
                next.show();                                            // show the next step in the wizard
            }
        };

        $wiz.next = function (className) { return move(true, className); };
        $wiz.previous = function (className) { return move(false, className); };
        $wiz.doneMethods = [];
        $wiz.initMethods = [];
        $wiz.unInitMethods = [];        
        $wiz.validationMethods = [];

        return $wiz;      
    });
})(window.jQuery, window, window.grain);