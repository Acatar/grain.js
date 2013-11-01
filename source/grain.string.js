/* ========================================================================
 * grain.js: grain.string.js
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
            return define('grain.string', ['jquery', 'grain'], factory); // Define and return the anonymous AMD module
        } 
        else {                                                          // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                         // If grain is undefined
                window.grain = function () { return $.extend(true, {}, grain); }; // Create the namespace
            }

            return factory($, grain, grain.string);              // Add this module as a global variable, and return it
        }
    })(function($, grain, $str) {
        
        $str = $str || grain.string || {};
        
        // Format a string with arguments inline.  String extensions following this namespace use this 
        // method and make the following example possible.
        // example: var str2 = "I have 2 friends, {0} and {1}.".Format("Doug", "Jane");
        var _formatInline = function () {
            var _txt = this;

            if(arguments.length == 0)
                return _txt.toString();

            for (var i = 0; i < arguments.length; i++) {
                var exp = new RegExp('\\{' + (i) + '\\}', 'gm');
                _txt = _txt.replace(exp, arguments[i]);
            }
            return _txt;
        }

        // Format a string with arguments String extensions following this namespace use this 
        // method and make the following example possible.
        // example: var str = String.Format("This is {0} story about {0} {1}.", "my", "dog");
        var _formatStatic = function () {
            var _txt = arguments[0];

            if(arguments.length == 1)
                return _txt.toString();

            for (var i = 1; i < arguments.length; i++) {
                var exp = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                _txt = _txt.replace(exp, arguments[i]);
            }
            return _txt;
        }        

        $str.format = function() { return $.extend(true, {}, $str.format); };

        // Conveniance methods to format strings for ID and class selection with jquery and avoid typo's
        $str.jQuerySelectors = $str.format.selectors = {
            id: function () { return '#' + this; }
            , css: function () { return '.' + this; }
        }

        // UNDONE: removes characters that are not appropriate in markup ids
        $str.removePunctuationAndWhitespace = $str.format.removePunctuationAndWhitespace = function (str) {
            str = str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
            return str;
        }

        $str.keep = function (startIndex, endIndex) {
            var _txt = this;
            if(endIndex)
                return _txt.substring(startIndex, endIndex);

            return _txt.substring(startIndex);
        }

        // Conveniance method to remove part of a string, by start and end counts
        $str.remove = function (startIndex, endIndex) {
            var _txt = this.toString(),
                _newTxt = undefined;

            if(!startIndex)
                return _txt;

            if(endIndex) {
                _newTxt = _txt.Keep(0, startIndex);
                _newTxt += _txt.Keep(endIndex, _txt.length);
            }
            else {
                _newTxt = _txt.Keep(startIndex);
            }

            return _newTxt;
        }

        // Conveniance method to replace all instances of a value in a string, with a new value
        $str.replace = function (oldValue, newValue, ignoreCase) {
            var _txt = this;

            if(!oldValue || !newValue)
                return _txt.toString();

            if (ignoreCase) {
                var _exp = new RegExp(oldValue, 'gi');
                return _txt.replace(_exp, newValue);
            }
            else {
                var _exp = new RegExp(oldValue, 'gm');
                return _txt.replace(_exp, newValue);
            }
        }

        // Conveniance method to make a string Title Case
        $str.toTitleCase = function (str) {
            if(!str)
                return null;

            return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        }

        // from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        $str.createGuid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // from http://www.webtoolkit.info/javascript-base64.html
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        // from http://www.webtoolkit.info/javascript-base64.html
        $str.utf8Encode = function () {
            var string = this;
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }
            return utftext;
        }

        // from http://www.webtoolkit.info/javascript-base64.html
        $str.utf8Decode = function () {
            var utftext = this;
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

        // from http://www.webtoolkit.info/javascript-base64.html
        $str.base64Encode = function () {
            var input = this;
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
 
            input = input.Utf8Encode();
 
            while (i < input.length) {
 
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
			    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
 
            }
 
            return output;
        }

        // from http://www.webtoolkit.info/javascript-base64.html
        $str.base64Decode = function () {
            var input = this;
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = output.Utf8Decode();
            return output;
        }

        //====================================================================================================================
        //====================================================================================================================
        // JavaScript String Extensions
        //====================================================================================================================
        //====================================================================================================================

        // Extend String for .NET Format mimic
        if (!String.prototype.Format)                                                   // extend String with the inline Format method
            String.prototype.Format = _formatInline;

        if (!String.Format)                                                            // extend String with the static Format method
            String.Format = _formatStatic;

        // Extend String for ID selectors
        if (!String.prototype.ToIdSelector)                                             // extend String with the inline Format method
            String.prototype.ToIdSelector = $str.jQuerySelectors.id;

        if (!String.ToIdSelector)                                                      // extend String with the static Format method
            String.ToIdSelector = $str.jQuerySelectors.id;


        // Extend String for CSS selectors
        if (!String.prototype.ToCssSelector)                                            // extend String with the inline Format method
            String.prototype.ToCssSelector = $str.jQuerySelectors.css;

        if (!String.ToCssSelector)                                                     // extend String with the static Format method
            String.ToCssSelector = $str.jQuerySelectors.css;

        // Extend String for .NET Remove mimic
        if (!String.prototype.Remove)                                                   // extend String with the inline Remove method
            String.prototype.Remove = $str.remove;

        if (!String.Remove)                                                            // extend String with the static Remove method
            String.Remove = $str.remove;

        // Extend String for .NET Remove mimic
        if (!String.prototype.Keep)                                                     // extend String with the inline Keep method
            String.prototype.Keep = $str.keep;

        if (!String.Keep)                                                               // extend String with the static Keep method
            String.Keep = $str.keep;

        // Extend String for .NET Replace mimic
        if (!String.prototype.Replace)                                                  // extend String with the inline Remove method
            String.prototype.Replace = $str.replace;

        if (!String.Replace)                                                           // extend String with the static Remove method
            String.Replace = $str.replace;

        // Extend String for Base64 Encoding
        if (!String.prototype.Base64Encode)
            String.prototype.Base64Encode = $str.base64Encode;

        if (!String.Base64Encode)
            String.Base64Encode = $str.base64Encode;

        // Extend String for Base64 Decoding
        if (!String.prototype.Base64Decode)
            String.prototype.Base64Decode = $str.base64Decode;

        if (!String.Base64Decode)
            String.Base64Decode = $str.base64Decode;

        // Extend String for Utf8 Encoding
        if (!String.prototype.Utf8Encode)
            String.prototype.Utf8Encode = $str.utf8Encode;

        if (!String.Utf8Encode)
            String.Utf8Encode = $str.utf8Encode;

        // Extend String for Utf8 Decoding
        if (!String.prototype.Utf8Decode)
            String.prototype.Utf8Decode = $str.utf8Decode;

        if (!String.Utf8Decode)
            String.Utf8Decode = $str.utf8Decode;

        return $str;
    });
})(window.jQuery, window, window.grain);