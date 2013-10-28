// grain.cache includes an optional cookie provider that requires Cookies.js to be included. 
// This shim removes that dependency
define('cookies', function () { return null; });
// or if your Cookies.js file is in a different path from grain, use this:
//define('cookies', ['someotherpath/cookies'], function (cookies) { return cookies; });