/* ========================================================================
 * grain.js: grain.cache.js
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

(function ($, window, grain, gdate, cookies) {
    (function (factory) {                                               // The factory: support module loading scenarios, such as require.js
        if (typeof define === 'function' && define.amd) {               // If a module loader, such as require.js, is present
            return define('grain.cache', ['jquery', 'grain', 'grain.date', 'cookies'], factory); // Define and return the anonymous AMD module
        } 
        else {                                                          // Otherwise, if a module loader is NOT present
            if (typeof grain === 'undefined') {                         // If grain is undefined
                window.grain = function () { return $.extend(true, {}, grain); }; // Create the namespace
            }

            return factory($, grain, gdate, cookies);      // Add this module as a global variable, and return it
        }
    })(function($, grain, gdate, cookies) {
        if(!JSON)
            throw new Error("This browser doesn't support JSON.  Please update your browser, or find a better browser, like Google Chrome.");

        //#region Internal
        
        var internalDef = function() {
            var $self = {};

            $self.defaultWhenValNotFound = null;
            $self.provider = null;

            // Gets the Cache Object from the Cache
            // { Value: [NullableObject], Expiration: [NullableDate] }
            $self.get = function(key) {
                if ($self.provider.exists(key)) {
                    var _cachedValue = $self.provider.get(key);

                    if (_cachedValue.expiration != null && new Date(_cachedValue.expiration) <= new Date() /*now*/) {
                        $self.provider.remove(key);
                        return $self.defaultWhenValNotFound;
                    }
                    else {
                        return _cachedValue;
                    }
                }
                else return $self.defaultWhenValNotFound;
            }

            // Gets the value of a cached object from the Cache
            $self.getValue = function(key) {
                var _cachedValue = $self.get(key);
                return _cachedValue ? _cachedValue.value : $self.defaultWhenValNotFound;
            }

            $self.makeValidExpirationTime = function(durationOrDateOfExpiration) {
                try {
                    if (typeof (durationOrDateOfExpiration) == 'number') {
                        return new Date().addMinutes(durationOrDateOfExpiration);
                    }
                    else if (typeof (durationOrDateOfExpiration) == 'object') {
                        return new Date(durationOrDateOfExpiration);
                    }
                    else return null;
                }
                catch(x) { return null; }
            } 

            return $self;             
        }

        //#endregion Internal

        var $providers = function() { return $.extend(true, {}, $providers); };

        // Takes some inspiration from CacheJs, but is different enough, it is hardly a derivitive work

        //#region Cache Providers

        // PageRepository: an arrayStore - the default Cache storage
        $providers.pageRepository = function () {
            var _repository = new Array();

            var $self = {
                name: 'PageRepository',
                exists: function (key) {
                    return (typeof _repository[key] != "undefined");
                },
                get: function (key) {
                    return _repository[key];
                },
                set: function (key, val) {
                    _repository[key] = val;
                },
                remove: function (key) {
                    delete _repository[key];
                },
                clear: function () {
                    _repository = new Array();
                }
            };

            return $self;
        };

        // Uses HTML5 localStorage, if it exists, otherwise degrades to a PageRepository
        // @groupName: string: the prefix to use for keys in this repository
        // @degradeToCookieRepository: bool: when true, and localstorage is not supported, degrades to a CookieRepository, otherwise degrades to a PageRepository
        $providers.localStorageRepository = function (groupName, degradeToCookieRepository) {
            var prefix = groupName && typeof groupName === 'string' ? groupName + '.' : "localRepo.";                  // If you modify this prefix, the entire cache will be ignored in favor of a new cache
            var getKey = function (key) {
                return prefix + key;
            }

            var $self = {
                name: 'LocalStorageRepository',
                exists: function (key) {
                    return (localStorage.getItem(getKey(key)) != null);
                },
                get: function (key) {
                    if (!$self.exists(key)) {
                        return undefined;
                    } else {
                        return JSON.parse(localStorage.getItem(getKey(key)));
                    }
                },
                set: function (key, val) {
                    if (val === undefined) {
                        $self.remove(key);
                    } else {
                        localStorage.setItem(getKey(key), JSON.stringify(val));
                    }
                },
                remove: function (key) {
                    localStorage.removeItem(getKey(key));
                },
                clear: function () {
                    localStorage.clear();
                },
                removeGroup: function (groupName) {
                    var _expression;
                    var _count = 0;

                    if (groupName != null) {
                        _expression = new RegExp('^(' + prefix + groupName + ')');
                    }
                    else {
                        _expression = new RegExp('^(' + prefix + ')');
                    }

                    Object.keys(localStorage).forEach(function (key) {
                        var _isMatch = _expression.test(key);
                        if (_isMatch) { //if (/^(todo-)|(note-)/.test(key)) {
                            localStorage.removeItem(key);
                            _count++;
                        }
                    });

                    return _count;
                }
            };

            if (window.localStorage && window.localStorage.getItem && window.localStorage.setItem && window.localStorage.removeItem && window.localStorage.clear) {
                return $self;
            }
            else if (degradeToCookieRepository) {
                // localStorage not supported on this browser; degrade to arrayStore.
                console.info('cache degraded to cookieRepository');
                return $providers.cookieRepository();
            }
            else {
                // localStorage not supported on this browser; degrade to arrayStore.
                console.info('cache degraded to pageRepository');
                return $providers.pageRepository();
            }
        }; 

        // Uses a cookie to store data. If cookies are not supported, degrades to a PageRepository.
        // (Warning) Use sparingly: there are a limited number of cookies per domain, and cookies are limited in their length (size)
        // uses cookie functions from http://www.quirksmode.org/js/cookies.html
        $providers.cookieRepository = function (groupName) {
            if(typeof cookies === 'undefined') {
                // cookieStorage not included in this deployment; degrade to pageRepository.
                console.log('cache degraded to pageRepository');
                return $providers.PageRepository();
            }

            var prefix = groupName && typeof groupName === 'string' ? groupName + '.' : "cookieRepo.";                  // If you modify this prefix, the entire cache will be ignored in favor of a new cache
            var getKey = function (key) {
                return prefix + key;
            }

            var $self = {
                name: 'CookieRepository',
                exists: function (key) {
                    return ((cookies.get(getKey(key)) !== undefined));
                },
                get: function (key) {
                    if (!$self.exists(key)) {
                        return undefined;
                    } else {
                        return JSON.parse(cookies.get(getKey(key)));
                    }
                },
                set: function (key, val) {
                    if (val === undefined) {
                        $self.remove(key);
                    } else {
                        cookies.set(getKey(key), JSON.stringify(val)); //, { secure: true });
                    }
                },
                remove: function (key) {
                    cookies.set(getKey(key), undefined);
                },
                clear: function () {
                    $self.removeGroup(prefix);
                },
                removeGroup: function (groupName) {
                    var _expression;
                    var _count = 0;

                    if (groupName != null) {
                        _expression = new RegExp('^(' + prefix + groupName + ')');
                    }
                    else {
                        _expression = new RegExp('^(' + prefix + ')');
                    }

                    Object.keys(cookies._getCookieObjectFromString(cookies._document.cookie)).forEach(function (key) {
                        var _isMatch = _expression.test(key);
                        if (_isMatch) { //if (/^(todo-)|(note-)/.test(key)) {
                            $self.remove(key);
                            _count++;
                        }
                    });

                    return _count;
                }
            };

            if (cookies.enabled) {
                return $self;
            } else {
                // localStorage not supported on this browser; degrade to arrayStore.
                console.log('cache degraded to PageRepository');
                return $providers.PageRepository();
            }
        };               

        //#endregion Cache Providers

        //#region Cache

        var cacheDef = function (options, $internal) {

            var $self = {};

            // Sets the storage object to use.
            // On invalid store being passed, current store is not affected.
            // @param new_store $internal.provider.
            // @return boolean true if new_store implements the required methods and was set to this cache's $internal.provider. else false
            $self.setProvider = function (newProvider) {
                //if (typeof(newProvider) === 'function') {
                //    newProvider = newProvider();
                //}
                return setProvider(newProvider);
            }

            // Helper for SetProvider - expectes newProvider to be of type, object
            var setProvider = function (newProvider) {
                if (typeof (newProvider) === 'object') {
                    if (newProvider.get && newProvider.set && newProvider.remove && newProvider.exists && newProvider.clear) {
                        $internal.provider = newProvider;
                        return $internal.provider;
                    } else {
                        $internal.provider = new $providers.localStorageRepository();
                        return $internal.provider;
                    }
                }
                else {
                    $internal.provider = new $providers.localStorageRepository();
                    return $internal.provider;
                }
            }

            // Gets the current storage provider
            $self.getProvider = function () {
                return $internal.provider;
            }

            // Returns true if cache contains the key, else false
            // @param key string the key to search for
            // @return boolean
            $self.exists = function (key) {
                return $internal.provider.exists(key);
            };

            // Removes a key from the cache
            // @param key string the key to remove for
            // @return boolean
            $self.remove = function (key) {
                $internal.provider.remove(key);
                return $internal.provider.exists(key);
            };

            // Removes any key, that belongs to a given group, from the cache
            // @param groupName string the groupName to remove for
            // @return int: the number of records removed. -1 indicates that the provider does not support this feature
            $self.removeGroup = function (groupName) {
                if ($internal.provider.removeGroup) {
                    return $internal.provider.removeGroup(groupName);
                }
                return -1;
            };

            // Clears the entire cache
            $self.clear = function () {
                return $internal.provider.clear();
            }

            // Gets a value from the cache
            // @param key string. The key to fetch
            // @return mixed or NULL if no such key
            $self.get = function (key) {
                return $internal.getValue(key);
            };

            /**
            * Sets a value in the cache, returns true on sucess, false on failure.
            * @param key string. the name of this cache object
            * @param val mixed. the value to return when querying against this key value
            * @param durationOrDateOfExpiration: minutes as an int or RFC1123 date, optional. If not set and is a new key, or set to false, this key never expires
            *                       If not set and is pre-existing key, no change is made to expiry date
            *                       If set to date, key expires on that date.
            *                       If set to int, key expires n minutes from now
            */
            $self.set = function (key, val, durationOrDateOfExpiration) {
                var _expiration;

                if ($internal.provider.exists(key)) {                           // key already exists, update it and set the expiration if durationOrDateOfExpiration is defined, 
                                                                                // otherwise, keep the Expiration set to what it is already set to, in the cache.
                    _expiration = typeof (durationOrDateOfExpiration) != "undefined" ? 
                        $internal.makeValidExpirationTime(durationOrDateOfExpiration) 
                        : $internal.provider.get(key).expiration;
                }
                else {                                                          // key did not exist; create it
                    _expiration = $internal.makeValidExpirationTime(durationOrDateOfExpiration);
                }

                $internal.provider.set(key, {                                        
                    "value": val,
                    "expiration": _expiration
                });

                return $internal.getValue(key);
            };

            // Gets the expiry date for given key
            // @param key string. The key to get
            // @return mixed, value for key or NULL if no such key
            $self.getExpiration = function (key) {
                var _cachedValue = $internal.get(key);

                if (!_cachedValue)
                    return null;

                if (_cachedValue && _cachedValue.expiration != null && _cachedValue.expiration != false)
                    return new Date(_cachedValue.expiration);

                return false;
            };

            // Sets the expiry date for given key
            // @param key string. The key to set
            // @param durationOrDateOfExpiration: minutes as an int or RFC1123 date, optional. If not set and is a new key, or set to false, this key never expires
            //                       If not set and is pre-existing key, no change is made to expiry date
            //                       If set to date, key expires on that date.
            //                       If set to int, key expires n minutes from now
            // @return mixed, value for key or NULL if no such key
            $self.setExpiration = function (key, durationOrDateOfExpiration) {
                if ($internal.provider.exists(key)) {
                    return $self.set(key, $internal.getValue(key), durationOrDateOfExpiration);
                }

                return null;
            };      

            // set the $internal.provider
            if (options != undefined) {
                $self.setProvider(options.cacheProvider || options.CacheProvider)
            }
            else {
                $self.setProvider()
            }

            return $self;
        }

        //#endregion Cache


        var $this = grain.cache = function(options) { return cacheDef(options, internalDef()); };
        $this.cacheProviders = grain.cacheProviders = $providers();
        return $this;      
    });
})( window.jQuery, 
    window, 
    window.grain, 
    window.grain !== undefined && window.grain.date !== undefined ? window.grain.date : undefined,
    window.Cookies);