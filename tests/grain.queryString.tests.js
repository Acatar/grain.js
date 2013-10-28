/// <reference path="../grainjs/grain.Url.js"/>
/// <reference path="../QUnit/qunit.js"/>
/// <reference path="../grainjs/grain.QueryString.js"/>

$(function () {
    module("grain.queryString", {
        setup: function () {
            /*
                NOTE: Keep the 'Check for Globals' & 'No try-catch' checkboxes unchecked during tests on this page because:
                     1. The set up method introduces globals
                     2. For some tests, we expect only 'testNumber=somenumber' to be part of the query string when the Rerun link is clicked.
                        Checking the globals option introduces an extra query string parameter which will cause some tests to fail
            */

            QueryString = Grain.QueryString;
            ExampleURl = "http://www.example.com";
            ExampleURlWithQueryString = ExampleURl + "?Test1=test1&Test2=test2";
            LocalAbsoluteUri = window.location.origin + window.location.pathname;
            TestNumber = false;

            Params = {
                Test1: "test1",
                Test2: "test2"
            };

            var _windowHref = window.location.href;
            if (_windowHref.indexOf('?') > 0) {

                //Trying to dynamically determine what the test number will be in the query string when the Rerun link is clicked
                var _testNumberIndex = _windowHref.indexOf('testNumber=');
                TestNumber = _windowHref.Remove(0, _testNumberIndex + 11);
            }
        },
        teardown: function () {
            // clean up after each test
        }
    });

    test('UrlFromString Tests', function () {
        //This fails
        strictEqual(QueryString.UrlFromString(ExampleURlWithQueryString), ExampleURl, "should return the url without the query string");

        strictEqual(QueryString.UrlFromString(ExampleURl), ExampleURl, "should return the same url when it doesn't contain any query string")
    });

    test('Url Tests', function () {
        //This will fail if qunit tests are run with any of the checkboxes ('check for globals' or 'no try catch') checked on the test runner page
        //because the UrlFromString method is returning an incorrect result.
        //Once the above method is fixed, this should not fail even if the query string contains parameters
        strictEqual(QueryString.Url(), LocalAbsoluteUri, "should return the url in the browser currently without query string");
    });

    test('GetFromString Tests', function () {
        
        
        var _returnQueryString = QueryString.GetFromString(ExampleURlWithQueryString);
        var _returnQuery = QueryString.GetFromString(ExampleURl);

        deepEqual(_returnQueryString, Params, "should return an object with all the query string parameters");
        strictEqual(_returnQuery, null, "should return null when url does not have a query string");
    });

    test('Get Tests', function () {
        var _expected = { testNumber: TestNumber };

        var moduleParamExists = grain.queryString.getValueByName('module') != null;

        if (TestNumber) {
            deepEqual(QueryString.Get(), {"module": "grain.queryString"}, '');
        }
        else {
            strictEqual(QueryString.Get(), null, "should return null as the testing path url (localhost:8656/dev/jsunittests) has no query string");
        }
    });

    test('GetValueFromStringByName', function () {
        strictEqual(QueryString.GetValueFromStringByName(ExampleURlWithQueryString, "Test1"), "test1", "should return the value of the query string param based on the url and param name specified");
        strictEqual(QueryString.GetValueFromStringByName(ExampleURlWithQueryString, "Test3"), null || undefined, "should return null or undefined if incorrect param name is provided");
        strictEqual(QueryString.GetValueFromStringByName(ExampleURlWithQueryString), null || undefined, "should return null or undefined if only 1 param is passed");
        strictEqual(QueryString.GetValueFromStringByName(), null, "should return null if no params are passed");
    });

    test('GetValueByName Tests', function () {
        //The only way to run this test is to run all tests first 
        //and then click on the rerun link on the test runner page for this particular test
        //which will cause it to add a query string parameter to the url
        
        var moduleParamExists = grain.queryString.getValueByName('module') != '';

        if (moduleParamExists) {
            equal(grain.queryString.getValueByName('module'), 'grain.queryString', "should return the value for query string parameter 'testNumber' from the current url in the browser");
        }
        else {
            ok(true);
        }
    });

    test('AppendFromString Tests', function () {

        strictEqual(QueryString.AppendFromString((ExampleURl + "?Foo=Bar"), Params), "Foo=Bar&Test1=test1&Test2=test2", "should return current query string params appended with new params as a string");
        strictEqual(QueryString.AppendFromString(ExampleURl, Params), "Test1=test1&Test2=test2", "should return a string with query string params from the object passed in when original url does not contain any params");
        strictEqual(QueryString.AppendFromString(ExampleURl), ExampleURl, "should return null or undefined when only 1 param is passed");
        strictEqual(QueryString.AppendFromString(), null, "should return null or undefined when no param is passed");

    });

    test('MergeParametersFromString Tests', function () {
        strictEqual(QueryString.MergeParametersFromString(ExampleURl, Params), ExampleURlWithQueryString, "should return the url with new query string params appended");
        strictEqual(QueryString.MergeParametersFromString((ExampleURl + "?Foo=Bar"), Params), ExampleURl + "?Foo=Bar&Test1=test1&Test2=test2", "should return the url with existing and new query string params");
        strictEqual(QueryString.MergeParametersFromString(ExampleURl), ExampleURl, "should return null or undefined when only 1 param is passed");
        strictEqual(QueryString.MergeParametersFromString(), null, "should return null or undefined when no param is passed");
    });

    test('MergeParameters Tests', function () {

        //This fails
        strictEqual(QueryString.MergeParameters(Params), LocalAbsoluteUri + "?Test1=test1&Test2=test2", "should return the local url appended with the new query string params");
    });

    test('EncodeValue Tests', function () {
        var _uri = "http://w3schools.com/my test.asp?name=ståle&car=saab";

        strictEqual(QueryString.EncodeValue(_uri), "http%3A%2F%2Fw3schools.com%2Fmy%20test.asp%3Fname%3Dst%C3%A5le%26car%3Dsaab", "should return the encoded url");
    });

    test('Append Tests', function () {

        //This fails
        if (TestNumber) {
            strictEqual(QueryString.Append(Params), "Test1=test1&Test2=test2", "should return the new params as a query string");
        }
        else {
            strictEqual(QueryString.Append(Params), "Test1=test1&Test2=test2", "should return the new params as a query string");
        }
    });
    
    



});