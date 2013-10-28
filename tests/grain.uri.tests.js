/// <reference path="../grainjs/grain.Url.js"/>

$(function () {
    module("grain.uri", {
        setup: function () {
            //Get required Url information from the window object.
            //This will be used for testing method calls with no parameters.

            localAbsoluteUri = window.location.origin + window.location.pathname;
            localUri = window.location.href;
            localProtocol = window.location.protocol;            
            localHostName = window.location.hostname;
            localHost = window.location.host;
            localPort = window.location.port;

            localOrigin = (localHost == localHostName) ? (localProtocol + '//' + localHostName) : (localProtocol + '//' + localHost);            
        },
        teardown: function () {
            // clean up after each test
        }
    });
    
    // Owner: Chetan
    test('AbsoluteUriString Tests', function() {
        equal(Grain.Uri.Window.AbsoluteUriString(), localAbsoluteUri, 'should return the current url in the browser without query strings or hashes');
    });

    // Owner: Chetan
    test('GetUri Tests', function () {
        equal(Grain.Uri.GetUri(), localUri, 'should return the complete current url in the browser');
    });

    // Owner: Chetan
    test('GetUriObject Tests', function () {
        _url = document.createElement('a');
        _url.href = "http://www.example.com";

        equal(Grain.Uri.GetUriObject('http://www.example.com').outerHTML, _url.outerHTML, 'should create a new <a> element with the provided Url');
        equal(Grain.Uri.GetUriObject(), null, 'should return nothing as no uri is passed');
    });

    // Owner: Andy
    test('UrlMatchesHost Tests', function () {
        equal(Grain.Uri.Window.UrlMatchesHost('http://google.com'), false, 'should return false when the Url does not match this host');
        equal(Grain.Uri.Window.UrlMatchesHost(Grain.Uri.Window.AbsoluteUriString()), true, 'should return true when the Url matches this host');
    });

    // Owner: Andy
    test('AppendUrl Tests', function () {
        var _url = 'http://localhost:8080/foo/bar/';
        var _pathToAdd = '5';
        var _expected = _url + _pathToAdd;

        equal(Grain.Uri.AppendUrl(_url, _pathToAdd), _expected, 'should leave urls with trailing slash intact and append the path if it doesn\'t begin with a slash');
        equal(Grain.Uri.AppendUrl('http://localhost:8080/foo/bar', _pathToAdd), _expected, 'should append the url with a trailing slash, if it is missing, and then append the path if it doesn\'t begin with a slash');
        equal(Grain.Uri.AppendUrl(_url, '/5'), _expected, 'should leave urls with trailing slash intact and remove the slash at the beginning of the pathToAppend');
        equal(Grain.Uri.AppendUrl(_url, '////5'), _expected, 'should remove all slashes at the begining of pathToAdd');
        equal(Grain.Uri.AppendUrl(_url, '////hello/world/5'), 'http://localhost:8080/foo/bar/hello/world/5', 'should remove all slashes at the begining of pathToAdd, without removing all slashes');
    });

    // Owner: Chetan
    test('AbsolutePath Tests', function () {
        equal(Grain.Uri.AbsolutePath('http://localhost:8656/coursesections/9'), '/coursesections/9', 'should provide the absolute path of the given url');
        equal(Grain.Uri.AbsolutePath('http://www.example.com'), '/', 'should provide the root \'\\\' as the absolute path');
        equal(Grain.Uri.AbsolutePath().toLowerCase(), '/tests/unittests.html', 'should provide the path of the current test file');
    });

    // Owner: Chetan
    test('Origin Tests', function () {
        equal(Grain.Uri.Origin('http://localhost:9999/temp/1'), 'http://localhost:9999', 'should provide the origin of the Url specified');
        equal(Grain.Uri.Origin('http://www.example.com'), 'http://www.example.com', 'should provide the same url as www.example.com does not contain a port number');
        equal(Grain.Uri.Origin(), localOrigin, 'should provide the origin of the local server');
    });

    // Owner: Chetan
    test('Protocol Tests', function () {
        equal(Grain.Uri.Protocol('http://localhost:9999/temp/1'), 'http:', 'should provide the http protocol');
        equal(Grain.Uri.Protocol('https://localhost:9999/temp/1'), 'https:', 'should provide the https protocol');
        equal(Grain.Uri.Protocol(), localProtocol, 'should provide the protocol of the local server');
    });

    // Owner: Chetan
    test('Host Tests', function () {
        equal(Grain.Uri.Host('http://www.example.com:8888'), 'www.example.com:8888', 'should provide the Host of the Url specified');
        equal(Grain.Uri.Host('http://www.example.com'), 'www.example.com', 'should provide the same Url since it does not contain a port number');
        equal(Grain.Uri.Host(), localHost, 'should provide the Host for the local server');
    });

    // Owner: Chetan
    test('HostName Tests', function () {
        equal(Grain.Uri.HostName('http://www.example.com:8888/Temp/1'), 'www.example.com', 'should provide the HostName of the Url specified');
        equal(Grain.Uri.HostName('http://www.example.com'), 'www.example.com', 'should provide the same Url');
        equal(Grain.Uri.HostName(), localHostName, 'should provide the HostName for the local server');
    });
    
    // Owner: Chetan
    test('Port Tests', function () {
        equal(Grain.Uri.Port('http://www.example.com:8888/Temp/1'), '8888', 'should provide the Port of the specified Url');
        equal(Grain.Uri.Port('http://www.example.com/Temp/1'), '', 'should provide nothing since the Url does not have a port');
        equal(Grain.Uri.Port(), localPort, 'should provide the Port for the local server');
    });

    // Owner: Chetan
    test('Hash Tests', function () {
        equal(Grain.Uri.Hash('http://www.example.com/about#exampleinc'), '#exampleinc', 'should provide the hash value');
        equal(Grain.Uri.Hash('http://www.example.com/about#exampleinc/example'), '#exampleinc', 'should provide the hash value by removing everything after the slash');
        equal(Grain.Uri.Hash('http://www.example.com/about#exampleinc?id=example'), '#exampleinc', 'should provide the hash value by removing the query string');
        equal(Grain.Uri.Hash('http://www.example.com'), '', 'should provide nothing as \'http://www.example.com\' does not have any hashes');
        equal(Grain.Uri.Hash(), '', 'should provide nothing as the current local testing path does not have any hashes');
    });
});