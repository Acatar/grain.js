/// <reference path="../grainjs/grain.Url.js"/>
/// <reference path="../QUnit/qunit.js"/>
/// <reference path="../grainjs/grain.js"/>

$(function () {
    module("Grain.Grain", {
        setup: function () {

            ExpectedFunc = function () { return "This is a test function" }
            ExpectedFuncText = "return \"This is a test function\";";
            TempObject = { Param1: "p1", Param2: "p2" };
        },
        teardown: function () {
            // clean up after each test
        }
    });

    
    test('FindOrGenerateFunction Tests', function () {
        
        strictEqual(Grain.FindOrGenerateFunction("Grain.QueryString.Url"), Grain.QueryString.Url, "should return the function based on fully qualified name");
        strictEqual(Grain.FindOrGenerateFunction(ExpectedFunc), ExpectedFunc, "should return a function when it is passed in as a parameter");
        strictEqual(Grain.FindOrGenerateFunction(ExpectedFuncText)(), "This is a test function", "should return the output of a function whose body has been passed in as a parameter");

        //This fails
        var _newFuncWithArgs = Grain.FindOrGenerateFunction("return a + b;", ["a", "b"]);
        strictEqual(_newFuncWithArgs(2, 3), 5, "should return a new function with the specified body and arguments");

        //Note to self: This is how its supposed to work
        //var temp = Function.constructor.apply(null, ["a", "b", "return a + b;"]);
    });

    test('FindFunction Tests', function () {        
        strictEqual(Grain.FindFunction("Grain.QueryString.Url"), Grain.QueryString.Url, "should return the function based on fully qualified name");
        strictEqual(Grain.FindFunction(ExpectedFunc), ExpectedFunc, "should return a function when it is passed in as a parameter");
        strictEqual(Grain.FindFunction(ExpectedFuncText)(), "This is a test function", "should return the output of a function whose body has been passed in as a parameter");

        //This fails
        var _newFuncWithArgs = Grain.FindFunction("return a + b;", ["a", "b"]);
        strictEqual(_newFuncWithArgs(2, 3), 5, "should return a new function with the specified body and arguments");
    });

    test('FindOrParseObject Tests', function () {
        var _json = " { \"testParam\" : \"testValue\" } ";
        var _expected = { testParam: "testValue" };

        strictEqual(Grain.FindOrParseObject(TempObject), TempObject, "should return the same object when its passed in as a param");
        strictEqual(Grain.FindOrParseObject(window.Grain.Ajax), window.Grain.Ajax, "should return an object based on its fully qualified name");
        strictEqual(Grain.FindOrParseObject("window.Acatar.Constants.CourseIndexOptions"), Acatar.Constants.CourseIndexOptions, "returns the actual object using the fully qualified name (string)");
        strictEqual(Grain.FindOrParseObject("window.Acatar.Constants.CourseIndexOptions.GetUnitUrlPrefix"), "/api/UnitElements/", "returns actual string using the fully qualified name (string)");
        strictEqual(Grain.FindOrParseObject("window.Grain.QueryString.Url"), Grain.QueryString.Url, "returns a function by using the fully qualified name (string)");        
        deepEqual(Grain.FindOrParseObject(_json), _expected, "should return the JSON string encoded as an object");
        deepEqual(Grain.FindOrParseObject("NoSuchMethodOrObjectExists"), {}, "should return an empty object when input is invalid");
        strictEqual(Grain.FindOrParseObject("NoSuchMethodOrObjectExists", false), null, "should return null when invalid parameter is passed and return default is false");
    });

    test('Extension Tests', function () {

        strictEqual($.Version(), "1.9.1", "returns the version of JQuery");
        strictEqual($.Wait, Grain.Wait, "should return the Grain.Wait object");
        strictEqual($.FindFunction, Grain.FindFunction, "should return the Grain.FindFunction object");
        strictEqual(Grain.GetDateRange(new Date("05/30/1987"), 2).EndDate.toString("MM/dd/yyyy"), "06/01/1987", "should return second date with 2 days added");

        //This fails
        strictEqual(Grain.GetDateRange(new Date("05/30/1987")).EndDate.toString("MM/dd/yyyy"), "06/06/1987", "should return second date with 7 days added by default");

        strictEqual(Grain.GetDateRangeAsISOStrings(new Date("05/30/1987"), 7, true).EndDateString, "1987-06-06", "should return end date as a string without time");
        strictEqual(Grain.GetDateRangeAsISOStrings(new Date("05/30/1987"), 7, false).EndDateString, "1987-06-06T04:00:00.000Z", "should return end date as a string with time");
        strictEqual(Grain.GetDateRangeAsISOStrings(new Date("05/30/1987"), 7).EndDateString, "1987-06-06T04:00:00.000Z", "should return end date as a string with time even with the omittime param missing");        
    });
});