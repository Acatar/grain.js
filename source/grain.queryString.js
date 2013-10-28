/* ========================================================================
 * grain.js: grain.queryString.js
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

(function ($, window, grain, str) {
    (function (factory) {                                               // The factory: support module loading scenarios, such as require.js
        if (typeof define === 'function' && define.amd) {               // If a module loader, such as require.js, is present
            return define('grain.queryString', ['jquery', 'grain', 'grain.string'], factory); // Define and return the anonymous AMD module
        } 
        else {                                                          // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                         // If grain is undefined
                window.grain = function () { return $.extend(true, {}, grain); }; // Create the namespace
            }

            return factory($, grain, grain.queryString);              // Add this module as a global variable, and return it
        }
    })(function($, grain, $qs) {
        $qs = $qs || grain.queryString || {};
        
        // Gets the url portion of the query string
        // $.QueryString.Url();        
        $qs.url = function () {
            return $qs.urlFromString(window.location.href);
        }

        // Gets the url portion of any query string that is passed as a parameter
        // $.QueryString.UrlFromString(); 
        $qs.urlFromString = function (url) {
            if(url.indexOf) {
                var _endIndex = url.indexOf('?');
                if (_endIndex > 0) {
                    return url.Keep(0, _endIndex);
                }
                else {
                    return url;
                }
            }
            return url;
        }

        // Gets the query string as an object
        // $.QueryString.Get();
        $qs.get = function () {
            return $qs.getFromString(window.location.href);
        }

        // Gets the query string from the input parameter; as an object
        // $.QueryString.GetFromString();
        $qs.getFromString = function (url) {
            if(url.indexOf) {
                var _questionIndex = url.indexOf('?');
                if (_questionIndex < 0) {   // if there is no query string return null
                    return null;
                }

                var _parameters = {};
                var _queryString = url.slice(_questionIndex + 1).split('&');

                for (var i = 0; i < _queryString.length; i++) {
                    _parameter = _queryString[i].split('=');
                    _parameters[_parameter[0]] = _parameter[1];
                }
                return _parameters;
            }
            return null;
        }

        // Gets the value of a specific parameter in the query string
        // $.QueryString.GetValueByName('foo');
        $qs.getValueByName = function (name) {
            var qs = $qs.get();
            if (!qs)
                return "";

            return qs[name];
        }

        // Gets the value of a specific parameter in the url parameter
        // $.QueryString.GetValueFromStringByName('foo');
        $qs.getValueFromStringByName = function (url, name) {
            if(url == null && name ==null)
                return null;

            return $qs.getFromString(url)[name];
        }
        // Gets the existing query string and appends it with the parameterObject parameters - returns a string that can be appended to a given URL
        // $.QueryString.Append({ foo: 'bar', hello: 'world' });
        $qs.append = function (parameterObject) {
            return $qs.AppendFromString($qs.url(), parameterObject);
        }

        // Appends the query string from the url parameter with the parameterObject parameters - returns a string that can be appended to a given URL
        // $.QueryString.AppendFromString('https://helloworld.com/mypage.html?bar=foo', { foo: 'bar', hello: 'world' });
        $qs.appendFromString = function (url, parameterObject) {
            if(!url)
                return null;

            if(!parameterObject)
                return url;

            var _queryString = $qs.getFromString(url);
            if (_queryString != null) {
                return $.param(_queryString) + "&" + $.param(parameterObject);
            }
            else {
                return $.param(parameterObject);
            }
        }

        // Gets the existing query string and appends it with the parameterObject parameters - returns a url with query string
        // $.QueryString.MergeParameters({ foo: 'bar', hello: 'world' });
        $qs.mergeParameters = function (parameterObject) {
            return $qs.mergeParametersFromString($qs.url(), parameterObject);
        }

        // Appends the query string from the url parameter with the parameterObject parameters - returns a url concatenated with query string
        // $.QueryString.MergeParametersFromString({ foo: 'bar', hello: 'world' });
        $qs.mergeParametersFromString = function (url, parameterObject) {
            if(!url)
                return null;

            if(url && !parameterObject)
                return url;

            var _url = $qs.urlFromString(url);
            var _parameters = $qs.appendFromString(url, parameterObject);

            if (_parameters != null && _parameters.trim().length > 0) {
                return _url + "?" + _parameters;
            }
            else {
                return _url;
            }
        }
        // encodes special characters that can't be in the query string
        // $.QueryString.EncodeValue('hello world & foo bar ?');
        $qs.encodeValue = function (value) {
            return encodeURIComponent(value);
        }

//, Parameters: {
//        String: function () {
//            return window.location.search;
//        }          
//            , GetKeyValuePairs: function () {
//                var Dictionary = Core.List({});
//                var _parameters = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
//                var _item;

//                for (var i = 0; i < _parameters.length; i++) {
//                    _item = _parameters[i].split('=');
//                    Dictionary.add(_item[0], _item[1]);
//                }

//                return Dictionary.ToJSON();
//            }
//            , GetValueByKey: function (name) {
//                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
//                var regexS = "[\\?&]" + name + "=([^&#]*)";
//                var regex = new RegExp(regexS);
//                var results = regex.exec(window.location.href);

//                if (results == null) {
//                    return "";
//                }
//                else {
//                    return decodeURIComponent(results[1].replace(/\+/g, " "));
//                }
//            }
//            , GetValuesByKey: function (name) {
//                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
//                var regexS = "[\\?&]" + name + "=([^&#]*)";
//                var regex = new RegExp(regexS);
//                var results = regex.exec(window.location.href);

//                if (results == null) {
//                    return "";
//                }
//                else {
//                    return decodeURIComponent(results[1].replace(/\+/g, " "));
//                }
//            }
//            , Add: function (key, val) {
//                var _url = window.location.href;
//                _url += "&" + key + "=" + val;

//                return _url;
//            }
//            , AddArray: function (json) {
//                var _url = Core.Url.AbsoluteUri() + '?';
//                var _parameters = '';
//                //json = { "TAG": "task_status", "START_TIME": "1-5-2011+11:23:59+PM", "END_TIME": "1-12-2011+12:00:00+AM" }

//                $.each(json, function (key, val) {
//                    _parameters += "&" + key + "=" + val;
//                });

//                _parameters = _parameters.substring(1, _parameters.length);

//                return _url + _parameters;
//            }
//} // EO Parameters

        return $qs;      
    });
})(window.jQuery, window, window.grain, window.grain !== undefined && window.grain.string !== undefined ? window.grain.string : undefined);