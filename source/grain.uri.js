/* ========================================================================
 * grain.js: grain.uri.js
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
            return define('grain.uri', ['jquery', 'grain'], factory); // Define and return the anonymous AMD module
        } 
        else {                                                          // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                         // If grain is undefined
                window.grain = function () { return $.extend(true, {}, grain); }; // Create the namespace
            }

            return factory($, grain, grain.uri);              // Add this module as a global variable, and return it
        }
    })(function($, grain, $uri) {
        $uri = $uri || grain.uri || {};

        var $win = $uri.window = {};
        
        // i.e. http://localhost:8080/Users/1
        $win.absoluteUriString = function () {
            var _url = window.location.href; //.slice( (window.location.href.indexOf('?') + 1).split('&');
            _url = _url.substring(0, window.location.href.indexOf('?'));

            return window.location.origin + window.location.pathname;
        }
        
        // Checks to see if the url passed in as a paramter has the same hostname as the current page
        // returns true, if the hostnames match, otherwise returns false
        $win.urlMatchesHost = function (url) {
            if (url == undefined || url.trim() == '')
                return false;

            return window.location.hostname == $uri.getUriObject(url).hostname;
        }



        $uri.getUri = function () {
            return $uri.getUriObject(window.location.href);
        }
        
        // Gets a javascript uri object from a uri string
        // adapted from http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
        $uri.getUriObject = function (uri) {
            if (uri == null || uri.trim() == '') {
                return null;
            }

            var _link = document.createElement("a");
            _link.href = uri;
            // IE doesn't populate all link properties when setting .href with a relative URL,
            // however .href will return an absolute URL which then can be used on itself
            // to populate these additional fields.
            if (_link.host == "") {
                _link.href = _link.href;
            }
            return _link;
        }

        // Appends an existing url with the given pathToAdd, ensuring that forward slashes divide the existing url and the pathToAdd
        $uri.appendUrl = function (url, pathToAdd) {
            if (url == null || pathToAdd == null) {
                console.warn('either the url, the pathToAdd, or both were null');
                return false;
            }

            var _url;
            if (typeof (url) == 'string') {         // if the url is of type, string, use that
                _url = url;
            }
            else {                                  // otherwise, make the path relative to root
                _url = '/';
            }

            // make sure there is a trailing slash
            _url = _url.substr(-1) != '/' ? _url + '/' : _url;

            // remove any slashes at the beginning of the pathToAdd
            while (pathToAdd.substring(0, 1) == '/') {
                pathToAdd = pathToAdd.substring(1, pathToAdd.length);
            }

            return _url + pathToAdd;
        }
        
        // Gets the absolute path / pathname
        // i.e. "/MyPath/View/1"
        $uri.absolutePath = function (uri) {
            if(uri != null)
                return $uri.getUriObject(uri).pathname;
            return $uri.getUri().pathname;
        }
        
        // Gets the protocol + the host
        // i.e. "http://localhost:8080"
        $uri.origin = function (uri) {
            if(uri != null)
                return $uri.getUriObject(uri).origin;
            return $uri.getUri().origin;
        }
        
        // i.e. "http:"
        $uri.protocol = function (uri) {
            if(uri != null)
                return $uri.getUriObject(uri).protocol;
            return $uri.getUri().protocol;
        }

        // i.e. "localhost:8080"
        $uri.host = function (uri) {
            if(uri != null)
                return $uri.getUriObject(uri).host;
            return $uri.getUri().host;
        }
        
        // i.e. "localhost"
        $uri.hostName = function (uri) {
            if(uri != null)
                return $uri.getUriObject(uri).hostname;
            return $uri.getUri().hostname;
        }

        // i.e. "8080"
        $uri.port = function (uri) {
            if(uri != null)
                return $uri.getUriObject(uri).port;
            return $uri.getUri().port;
        }

        // i.e. "#hash"
        $uri.hash = function (uri) {
            var _hash;
            
            if (uri != null) {
                _hash = $uri.getUriObject(uri).hash;
            }
            else {
                _hash = $uri.getUri().hash;
            }
            var _split = _hash.split("/"); // remove anything that might come after a slash
            var _split2 = _split[0].split("?"); // remove the query string, if it exists after the hash
            return _split2[0];
        }

        return $uri;      
    });
})(window.jQuery, window, window.grain);