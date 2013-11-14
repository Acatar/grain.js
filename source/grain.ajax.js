/* ========================================================================
 * grain.js: grain.ajax.js
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
    (function (factory) {                                               // The factory: s$internalport module loading scenarios, such as require.js
        if (typeof define === 'function' && define.amd) {               // If a module loader, such as require.js, is present
            return define('grain.ajax', ['jquery', 'grain', 'grain.reflection'], factory);  // Define and return the anonymous AMD module
        } 
        else {                                                          // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                         // If grain is undefined
                window.grain = function () { return $.extend(true, {}, grain); }; // Create the namespace
            }

            return factory($, grain, reflection, grain.ajax);           // Add this module as a global variable, and return it
        }
    })(function($, grain, reflection, $ajax) {
        $ajax = $ajax || grain.ajax || {};
        var $internal = function() { return $.extend(true, {}, $internal); };
        
        // Access to the internal ajax class accross Grain files (Open/Closed Principle)
        $ajax._internal = $internal;

        //#region public accessors

        // Disables the buttons to keep requests from multiplying, 
        // generates an ajax request, and executes the appropriate callbacks
        // returns the jqXHR object, which is a s$internalerset of the XMLHTTPRequest object. For more information, see http://api.jquery.com/jQuery.ajax/#jqXHR
        $ajax.submit = function (event) {
            // params: event, element, btn, urlDefault
            var _btn = $($(this).attr('data-submit-btn'));
            if(_btn.length < 1)
                _btn = $(this).find('input[type=submit],button[type=submit]');

            return $internal.sendRequest(event, $(this), _btn, $(this).attr('action'));
        }

        // Disables the buttons to keep requests from multiplying, 
        // generates an ajax request, and executes the appropriate callbacks
        // returns the jqXHR object, which is a s$internalerset of the XMLHTTPRequest object. For more information, see http://api.jquery.com/jQuery.ajax/#jqXHR
        $ajax.action = function (event) {
            // params: event, element, btn, urlDefault
            return $internal.sendRequest(event, $(this), $(this), $(this).attr('href'));
        }

        // generates an ajax GET request
        // param - optionsOrUrl: a URL or the JSON options object
        // returns the jqXHR object, which is a s$internalerset of the XMLHTTPRequest object. For more information, see http://api.jquery.com/jQuery.ajax/#jqXHR
        $ajax.get = function (optionsOrUrl) {
            if (typeof(optionsOrUrl) === "string") {
                var _options = $internal.defaultOptions;
                _options.url = optionsOrUrl;
                return $internal.getRequest(_options);
            }
            return $internal.getRequest(optionsOrUrl);
        }

        // generates an ajax POST request
        // param - options: the JSON options object
        // returns the jqXHR object, which is a s$internalerset of the XMLHTTPRequest object. For more information, see http://api.jquery.com/jQuery.ajax/#jqXHR
        $ajax.post = function (options) {
            if (typeof (options) != 'object')
                throw new Error("The options must be a JSON object.");

            options.method = options.method != undefined ? options.method : 'POST';
            return $internal.getRequest(options);
        }

        // generates an ajax PUT request
        // param - options: the JSON options object
        // returns the jqXHR object, which is a s$internalerset of the XMLHTTPRequest object. For more information, see http://api.jquery.com/jQuery.ajax/#jqXHR
        $ajax.put = function (options) {
            options.method = options.method != undefined ? options.method : 'PUT';
            return $ajax.post(options);
        }

        // generates an ajax DELETE request
        // param - options: the JSON options object
        // returns the jqXHR object, which is a s$internalerset of the XMLHTTPRequest object. For more information, see http://api.jquery.com/jQuery.ajax/#jqXHR
        $ajax.doDelete = $ajax["delete"] = function (options) {  // ajax.delete is invalid in older version of javascript
            options.method = options.method != undefined ? options.method : 'DELETE';
            return $ajax.post(options);
        }

        //#endregion public accessors

        //#region internal methods

        // Disables the buttons to keep requests from multiplying, 
        // generates an ajax request, and executes the appropriate callbacks
        // param - event: the event object [href="http://api.jquery.com/category/event-object/"] is passed in by jQuery
        // param - element: the element from the event (i.e. form, a, button)
        // param - btn: the element that should be treated as the button (i.e. form submit, a, button)
        // param - urlDefault: the url to use if the Url parameter isn't set in the options
        // returns the jqXHR object, which is a s$internalerset of the XMLHTTPRequest object. For more information, see http://api.jquery.com/jQuery.ajax/#jqXHR
        $internal.sendRequest = function (event, element, btn, urlDefault) {
            var self = element instanceof $ ? element : $(element),
                _btn = btn,
                jqXHRResult = null;

            var options = self.attr('data-ajax-options');
            var _options = $internal.mergeOptions(reflection.findObject(options), self.attr('action'), self.attr('data-action'));

            $internal.validateOptions(_options);          

            _btn.attr('disabled', 'disabled');
            event.preventDefault();
            
            // a soft reference to plugins, such as jquery.validate is checked here, and used if it exists.
            if (self.prop("tagName").toLowerCase() == 'form' && self.valid != undefined && self.valid() == false)
                return;

            return $.ajax($internal.getjQueryAjaxOptions(_options, _options.dataToSubmit || self.serialize(), urlDefault))
                .done(function (data, status, jqXHR) {
                    $internal.onSuccess(data, status, jqXHR, _options);
                }) // success
                .fail(function (jqXHR, status, errorThrown) {
                    console.error(jqXHR);
                    $(_btn).state('completed');
                    $internal.onError(jqXHR, status, errorThrown, _options);
                }) // error
                .always(function (jqXHR, status) {
                    $(_btn).state('completed');
                    $internal.onComplete(jqXHR, status, _options);
                }); // complete
                //.then(function(data, textStatus, jqXHR) {}, function(jqXHR, textStatus, errorThrown) {}
        }

        // returns the jqXHR object, which is a s$internalerset of the XMLHTTPRequest object. For more information, see http://api.jquery.com/jQuery.ajax/#jqXHR
        $internal.getRequest = function (options) {
            var jqXHRResult = null,
                _options = $internal.mergeOptions(options);

            $internal.validateOptions(_options);

            return $.ajax($internal.getjQueryAjaxOptions(_options))
                .done(function (data, status, jqXHR) {
                    $internal.onSuccess(data, status, jqXHR, _options);
                }) // success
                .fail(function (jqXHR, status, errorThrown) {
                    console.error(jqXHR);
                    $internal.onError(jqXHR, status, errorThrown, _options);
                }) // error
                .always(function (jqXHR, status) {
                    $internal.onComplete(jqXHR, status, _options);
                }); // complete
                //.then(function(data, textStatus, jqXHR) {}, function(jqXHR, textStatus, errorThrown) {}
        } 

        $internal.validateOptions = function(options) {
            if (options.url == null)
                throw new Error("A url must be provided for an ajax request.");  

            // todo: do we need to require any other options?           
        }

        $internal.beforeSend = function (jqXHR, options) {
            if (options.beforeSend)
                reflection.findFunction(options.beforeSend, ["jqXHR"]).apply(this, arguments);
        }

        $internal.onSuccess = function (data, status, jqXHR, options) {
            if (options.replaceSelector)
                $(options.replaceSelector).replaceWith(data);

            if (options.insertSelector)
                $(options.insertSelector).html(data);

            if (options.appendSelector)
                $(options.appendSelector).append(data);

            if (options.prependSelector)
                $(options.prependSelector).prepend(data);

            if (options.afterSelector)
                $(options.afterSelector).after(data);

            if (options.beforeSelector)
                $(options.beforeSelector).before(data);

            if (options.onSuccess)
                reflection.findFunction(options.onSuccess, ["data", "status", "jqXHR"]).apply(this, arguments);
        }

        $internal.onComplete = function (jqXHR, status, options) {
            if (options.onComplete)
                reflection.findFunction(options.onComplete, ["jqXHR", "status"]).apply(this, arguments);
        }

        $internal.onError = function (jqXHR, status, errorThrown, options) {
            if (options.onError)
                reflection.findFunction(options.onError, ["jqXHR", "status", "errorThrown"]).apply(this, arguments);
        }

        $internal.defaultOptions = {
            url: null,
            returnType: 'json', // jQuery.ajax.dataType 
            dataToSubmit: null, // jQuery.ajax.data 
            submitDataType: 'application/x-www-form-urlencoded; charset=UTF-8', // jQuery.ajax.contentType // application/json; charset=UTF-8
            method: 'GET',
            cache: function () {    // if the request method is GET or HEAD, set cache to false, otherwise, set it to null to use the jQuery defaults
                return this.method == 'GET' || this.method == 'HEAD' ? false : null;
            },
            replaceSelector: null,
            insertSelector: null,
            appendSelector: null,
            prependSelector: null,
            beforeSelector: null,
            afterSelector: null,
            beforeSend: null,
            onSuccess: function (data, status, jqXHR) {
                if($.pnotify) {
                    $.pnotify({ title: data.Title, text: data.Message, type: data.TypeString });
                }
                else {
                    alert(data.Message);
                }
            },
            onError: function (jqXHR, status, errorThrown) {
                var data = $.parseJSON(jqXHR.responseText);

                if($.pnotify) {
                    $.pnotify({ title: data.Title, text: data.Message, type: data.TypeString });
                }
                else {
                    alert(data.Message);
                }
            },
            onComplete: null
        }  

        $internal.mergeOptions = function (options, formAction, html5Action) {
            return {
                url:                options.url ||              options.Url || formAction || html5Action || $internal.defaultOptions.url,
                returnType:         options.returnType ||       options.ReturnType || options.DataType || $internal.defaultOptions.returnType,
                dataToSubmit:       options.dataToSubmit ||     options.DataToSubmit ||     $internal.defaultOptions.dataToSubmit,
                submitDataType:     options.submitDataType ||   options.SubmitDataType ||   $internal.defaultOptions.submitDataType,
                method:             options.method ||           options.Method ||           $internal.defaultOptions.method,
                cache:              options.cache ||            options.Cache ||            $internal.defaultOptions.cache,
                replaceSelector:    options.replaceSelector ||  options.ReplaceSelector ||  $internal.defaultOptions.replaceSelector,
                insertSelector:     options.insertSelector ||   options.InsertSelector ||   $internal.defaultOptions.insertSelector,
                appendSelector:     options.appendSelector ||   options.AppendSelector ||   $internal.defaultOptions.appendSelector,
                prependSelector:    options.prependSelector ||  options.PrependSelector ||  $internal.defaultOptions.prependSelector,
                beforeSelector:     options.beforeSelector ||   options.BeforeSelector ||   $internal.defaultOptions.beforeSelector,
                afterSelector:      options.afterSelector ||    options.AfterSelector ||    $internal.defaultOptions.afterSelector,
                beforeSend:         options.beforeSend ||       options.BeforeSend ||       $internal.defaultOptions.beforeSend,
                onSuccess:          options.onSuccess ||        options.OnSuccess ||        $internal.defaultOptions.onSuccess,
                onError:            options.onError ||          options.OnError ||          $internal.defaultOptions.onError,
                onComplete:         options.onComplete ||       options.OnComplete ||       $internal.defaultOptions.onComplete                
            };
        }

        $internal.getjQueryAjaxOptions = function(options, data, urlDefault) {
            return {
                url: options.url || urlDefault,
                type: options.method,
                data: data || options.dataToSubmit,
                dataType: options.returnType,
                contentType: options.submitDataType,
                beforeSend: function (jqXHR) {
                    $internal.beforeSend(jqXHR, options);
                },
                cache: options.cache
            }
        }

        //#endregion internal methods

        // Add events to forms, links and buttons that have the "ajax" class
        $(function () {
            $(document).on('submit', 'form.ajax', $ajax.submit);
            $(document).on('click', 'a.ajax, button.ajax', $ajax.action);
            //$('body').on('click', 'a[data-cancel-closest]', $.grain.Ajax.Cancel)
        });        

        return $ajax;      
    });
})( window.jQuery, 
    window, 
    window.grain, 
    window.grain !== undefined && window.grain.reflection !== undefined ? window.grain.reflection : undefined);