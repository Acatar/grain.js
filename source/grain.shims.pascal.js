/* ========================================================================
 * grain.js: grain.pascalShim.js
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
            return define('grain.pascalShim', ['jquery', 'grain'], factory); // Define and return the anonymous AMD module
        } 
        else {                                                          // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                         // If grain is undefined
                window.grain = function () { return $.extend(true, {}, grain); }; // Create the namespace
            }

            return factory($, grain);                                   // Add this module as a global variable, and return it
        }
    })(function($, grain) {
        /*
        *   grain.pascalCase adds Pascal Case accessors to all public grain properties and functions.
        *   If you aren't using amd, this must be included after all other grain files
        */

        grain.String = grain.string;
        grain.String.Format = grain.string.format;
        grain.String.Format.Selectors = grain.string.format.selectors;
        grain.String.Format.Selectors.Id = grain.string.format.selectors.id;
        grain.String.Format.Selectors.Css = grain.string.format.selectors.css;
        grain.String.Format.RemovePunctuationAndWhitespace = grain.string.format.removePunctuationAndWhitespace;
        grain.String.Keep = grain.string.keep;
        grain.String.Remove = grain.string.remove;
        grain.String.Replace = grain.string.replace;
        grain.String.ToTitleCase = grain.string.toTitleCase;
        grain.String.CreateGuid = grain.string.createGuid;

        grain.Date = grain.date;
        grain.Date.GetDateRange = grain.date.getDateRange;
        grain.Date.GetDateRangeAsISOStrings = grain.date.getDateRangeAsISOStrings;
        grain.Date.AddMinutes = grain.date.addminutes;
        grain.Date.GetDayOfWeek = grain.date.getDayOfWeek;

        grain.Array = grain.array;
        grain.Array.Merge = grain.array.merge;

        grain.Reflection = grain.reflection;
        grain.FindFunction = grain.reflection.findFunction;
        grain.FindOrGenerateFunction = grain.reflection.findOrGenerateFunction;
        grain.FindObject = grain.reflection.findObject;
        grain.FindOrParseObject = grain.reflection.findOrParseObject;
        $.extend({
            FindFunction: grain.FindFunction,
            FindObject: grain.FindObject
        });        

        grain.Wait = grain.wait;
        grain.Wait.Interval = grain.wait.interval;
        grain.Wait.Once = grain.wait.once;
        grain.Wait.When = grain.wait.when;
        grain.Wait.Until = grain.wait.until;
        $.extend({
            Wait: grain.Wait
        });        

        grain.Ajax = grain.ajax;
        grain.Ajax.Submit = grain.ajax.submit;
        grain.Ajax.Action = grain.ajax.action;
        grain.Ajax.Get = grain.ajax.get;
        grain.Ajax.Post = grain.ajax.post;
        grain.Ajax.Put = grain.ajax.put;
        grain.Ajax.DoDelete = grain.Ajax["Delete"] = grain.ajax["delete"];

        grain.Cache = grain.cache;
        //grain.Cache.SetProvider = grain.cache.setProvider;
        //grain.Cache.GetProvider = grain.cache.getProvider;
        //grain.Cache.Exists = grain.cache.exists;
        //grain.Cache.Remove = grain.cache.remove;
        //grain.Cache.RemoveGroup = grain.cache.removeGroup;
        //grain.Cache.Clear = grain.cache.clear;
        //grain.Cache.Get = grain.cache.get;
        //grain.Cache.Set = grain.cache.set;
        //grain.Cache.GetExpiration = grain.cache.getExpiration;
        //grain.Cache.SetExpiration = grain.cache.setExpiration;

        //grain.Cache.CacheProviders = grain.cacheProviders;
        grain.CacheProviders = grain.cacheProviders;
        grain.CacheProviders.PageRepository = grain.cacheProviders.pageRepository;
        grain.CacheProviders.LocalStorageRepository = grain.cacheProviders.localStorageRepository;
        grain.CacheProviders.CookieRepository = grain.cacheProviders.cookieRepository;     

        grain.FormSubmitEvents = grain.formSubmitEvents;
        grain.FormSubmitEvents.AddSubmitEvents = grain.formSubmitEvents.addSubmitEvents;
        grain.FormSubmitEvents.OnSubmit = grain.formSubmitEvents.onSubmit;

        grain.QueryString = grain.queryString;
        grain.QueryString.Url = grain.queryString.url;
        grain.QueryString.UrlFromString = grain.queryString.urlFromString;
        grain.QueryString.Get = grain.queryString.get;
        grain.QueryString.GetFromString = grain.queryString.getFromString;
        grain.QueryString.GetValueByName = grain.queryString.getValueByName;
        grain.QueryString.GetValueFromStringByName = grain.queryString.getValueFromStringByName;
        grain.QueryString.Append = grain.queryString.append;
        grain.QueryString.AppendFromString = grain.queryString.appendFromString;
        grain.QueryString.MergeParameters = grain.queryString.mergeParameters;
        grain.QueryString.MergeParametersFromString = grain.queryString.mergeParametersFromString;
        grain.QueryString.EncodeValue = grain.queryString.encodeValue;

        grain.Uri = grain.uri;
        grain.Uri.Window = grain.uri.window;
        grain.Uri.Window.AbsoluteUriString = grain.uri.window.absoluteUriString;
        grain.Uri.Window.UrlMatchesHost = grain.uri.window.urlMatchesHost;
        grain.Uri.GetUri = grain.uri.getUri;
        grain.Uri.GetUriObject = grain.uri.getUriObject;
        grain.Uri.AppendUrl = grain.uri.appendUrl;
        grain.Uri.AbsolutePath = grain.uri.absolutePath;
        grain.Uri.Origin = grain.uri.origin;
        grain.Uri.Protocol = grain.uri.protocol;
        grain.Uri.Host = grain.uri.host;
        grain.Uri.HostName = grain.uri.hostName;
        grain.Uri.Port = grain.uri.port;
        grain.Uri.Hash = grain.uri.hash;

        grain.Wizard = grain.wizard;
        grain.Wizard.Init = grain.wizard.init;
        grain.Wizard.Next = grain.wizard.next;
        grain.Wizard.Previous = grain.wizard.previous;
        grain.Wizard.DoneMethods = grain.wizard.doneMethods;
        grain.Wizard.InitMethods = grain.wizard.initMethods;
        grain.Wizard.UnInitMethods = grain.wizard.unInitMethods;

        $.extend({
            // Returns the current jQuery version
            Version: $.version,
            GetFocusedElement: $.getFocusedElement
        });        

        window.Grain = window.grain;
        return grain;
    });
})(window.jQuery, window, window.grain);