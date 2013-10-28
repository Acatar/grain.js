/**
* grain.js v1.1.0 by &y
* Copyright 2013 Acatar, LLC
* http://www.apache.org/licenses/LICENSE-2.0
*/


/* ========================================================================
 * grain.js: grain.date.js v1.1.0
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
            return define('grain.date', ['jquery', 'grain'], factory); // Define and return the anonymous AMD module
        } 
        else {                                                          // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                         // If grain is undefined
                window.grain = function () { return $.extend(true, {}, grain); }; // Create the namespace
            }

            return factory($, grain, grain.date);              // Add this module as a global variable, and return it
        }
    })(function($, grain, $date) {
        $date = $date || grain.date || {};
        
        $date.getDateRange = function (date, duration) {
            var _duration = duration != null && !isNaN(duration) ? parseInt(duration) : 7;

            var _startDate = new Date(date);
            var _endDate = new Date(date.setDate(date.getDate() + _duration));

            return { StartDate: _startDate, EndDate: _endDate };
        }

        $date.getDateRangeAsISOStrings = function (date, duration, omitTime) {
            var _dateRange = Grain.GetDateRange(date, duration);

            var _startDateString = _dateRange.StartDate.toISOString();
            var _endDateString = _dateRange.EndDate.toISOString();

            if (omitTime) {
                _startDateString = _startDateString.Remove(_startDateString.indexOf('T'), _startDateString.length);
                _endDateString = _endDateString.Remove(_endDateString.indexOf('T'), _endDateString.length);
            }

            return { StartDateString: _startDateString, EndDateString: _endDateString, NewDate: date };
        }

        $date.addMinutes = function (date, minutes) {
            if (typeof (minutes) == 'number') {
                return new Date(date.getTime() + minutes * 60000);
            }
            else if (typeof (minutes) == 'string') {
                return new Date(date.getTime() + parseInt(minutes) * 60000);
            }
            else return date;
        }

        var _addMinutesInline = function (minutes) {
            return $date.addMinutes(this, minutes);
        }

        $date.getDayOfWeek = function (date) {
            var weekdays = new Array(7);
            weekdays[0] = "Sunday";
            weekdays[1] = "Monday";
            weekdays[2] = "Tuesday";
            weekdays[3] = "Wednesday";
            weekdays[4] = "Thursday";
            weekdays[5] = "Friday";
            weekdays[6] = "Saturday";

            if (typeof (date) == 'string')
                date = new Date(date);

            return weekdays[date.getDay()];
        }

        var _getDayOfWeekInline = function () {
            return $date.GetDayOfWeek(this);
        }


        if (!Date.prototype.AddMinutes)                                                   // extend String with the inline Format method
            Date.prototype.AddMinutes = _addMinutesInline;

        if (!Date.prototype.addMinutes)                                                   // extend String with the inline Format method
            Date.prototype.addMinutes = _addMinutesInline;

        if (!Date.prototype.getDayOfWeek)
            Date.prototype.getDayOfWeek = _getDayOfWeekInline;

        return $date;      
    });
})(window.jQuery, window, window.grain);