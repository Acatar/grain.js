/* ========================================================================
 * grain.js: grain.formSubmitEvents.js
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
            return define('grain.formSubmitEvents', ['jquery', 'grain'], factory); // Define and return the anonymous AMD module
        } 
        else {                                                          // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                         // If grain is undefined
                window.grain = function () { return $.extend(true, {}, grain); }; // Create the namespace
            }

            return factory($, grain, grain.formSubmitEvents);              // Add this module as a global variable, and return it
        }
    })(function($, grain, $events) {
        /*
        *   Form Submit Events Plugin
        *
        *   Adds a jQuery state function to enhance button behaviours.
        *   Adds save events and enter keyup features to forms that have external submit buttons, using HTML5
        *
        *   HTML5 Attributes:
        *       data-submit-btn: Attribute for form elements. Provides the jQuery selector for the external submit button (i.e. data-submit-btn="#myButton")
        *       data-loading-msg: Attribute for button elements. When the button state is set to "loading" the button text is changed to the value of this attribute
        *       data-completed-msg: Attribute for button elements. When the button state is set to "completed" the button text is changed to the value of this attribute
        */        
        $events = $events || grain.formSubmitEvents || {};
        
        // Get all forms that have the data-submit-btn attribute and wire up the submit events for that form.
        $events.addSubmitEvents = function () {
            $(document).on('click', 'button[data-form-submit], a[data-form-submit]', function (event) {
                var $this = $(this);
                var _form = $($this.attr('data-form-submit'));

                if (_form)
                    $events.onSubmit(_form, $this);

                return $this;
            });

            $('form[data-submit-btn]:not(".acatar-processed")').each(function () {
                var _self = $(this);
                var _modal = _self.parents('.modal').first();
                var _btn = $(_self.attr('data-submit-btn'));

                if (_btn) {                                         // if we find a value for data-submit-btn, add a submit event onclick
                    _btn.on('click', function (e) {
                        $events.onSubmit(_self, _btn);
                    });
                }

                addEnterKeyEventsAndFocusOnFirst(_self, _modal, _btn);
                _self.addClass('acatar-processed');
                return _self; /* maintain chainability */
            });
        }

        // If the window has jquery.validate, or another plugin that reveals the [valid] method, validate the form. 
        // If the form is valid, or if no validate plugin is found, submit the form and set the button state to, "loading".
        $events.onSubmit = function (form, btn) {
            if (form.valid != undefined) {      // if jquery.validate or an equivelant is present, only submit if the form is valid
                if (form.valid()) {
                    if (btn)
                        btn.state('loading');
                    form.submit();
                }
            }
            else {                              // otherwise, submit the form
                if (btn)
                    btn.state('loading');
                form.submit();
            }

            return form;
        }

        // Add keyup events to all of the inputs and textareas for the form, so when the user clicks, "Enter", the form is submitted. 
        // If the form is the child of a modal, focus on the first input, when the modal is shown.
        var addEnterKeyEventsAndFocusOnFirst = function (form, modal, btn) {
            if (form == null)
                return;

            var _isFirstElement = true;

            form.find('input,textarea').each(function () {      // find all children inputs and textareas, focus on the first one, and 

                var _input = $(this);

                if (_isFirstElement) {                          // add a submit event when the user clicks enter while focused on any of them
                    if (modal.length > 0) {
                        modal.on('shown', function () {
                            _input.focus();
                        });
                    }
                    _isFirstElement = false;
                }

                var _inputTagName = _input.prop("tagName");
                _inputTagName = _inputTagName != null ? _inputTagName : 'INPUT';

                if (_inputTagName.toUpperCase() != 'TEXTAREA') {
                    _input.keypress(function (event) {
                        if (!(event.which == 13))                   // enter
                            return true;

                        $events.onSubmit(form, btn);
                        event.preventDefault();
                        return false;
                    });
                }

                //_input.bind('keydown', 'ctrl', function (event) {
                //    if (//!(event.which == 115 && event.ctrlKey)  // ctrl + s
                //            !(event.which == 19)             // cmd + s (mac)
                //            && !(event.which == 83))            // ctrl + s (chrome)
                //        return true;

                //    OnSubmit(form, btn);
                //    event.preventDefault();
                //    return false;
                //});

            });

            return form;
        };        


        // region: EXTENSIONS

        // Toggles the state of a button, to skin it
        // i.e. $('.my_button').state('loading');
        // i.e. $('.my_button').state('completed');
        // Inspired by https://github.com/twitter/bootstrap/issues/471 and https://gist.github.com/pamelafox/1308396
        $.fn.state = function (state) {
            var d = 'disabled';
            return this.each(function () {
                var _self = $(this);
                _self.html(_self.data()[state]);

                if(state == 'loading') {                                // if the state is "loading" disable the element and change the element text, if applicable
                    _self.addClass(d).attr(d, d);

                    var _loadingMsg = _self.attr('data-loading-msg');
                    _loadingMsg = _loadingMsg != null ? _loadingMsg : 'Loading...';
                    _self.text(_loadingMsg);
                }
                else if (state == 'saving' || state == 'submitting') {  // if the state is "saving" or "submitting" disable the element and change the element text, if applicable
                    _self.addClass(d).attr(d, d);

                    var _loadingMsg = _self.attr('data-loading-msg');
                    _loadingMsg = _loadingMsg != null ? _loadingMsg : 'Saving...';
                    _self.text(_loadingMsg);
                }
                else {                                                  // otherwise make sure the element is not in the "loading" state
                    _self.removeClass(d).removeAttr(d);
                }

                if (state == 'completed') {                             // if the state is "completed" enable the element and change the element text, if applicable
                    var _completedMsg = _self.attr('data-completed-msg');
                    _completedMsg = _completedMsg != null ? _completedMsg : 'Completed';
                    _self.text(_completedMsg);
                }
            });
        }

        // endregion: EXTENSIONS

        $(function () { $events.addSubmitEvents(); });

        return $events;      
    });
})(window.jQuery, window, window.grain);