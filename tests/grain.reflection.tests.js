/// <reference path="../grainjs/grain.Url.js"/>
/// <reference path="../QUnit/qunit.js"/>
/// <reference path="../grainjs/grain.Reflection.js"/>

$(function () {
    module("grain.reflection", {
        setup: function () {

        },
        teardown: function () {
            // clean up after each test
        }
    });

    var _testObj = {
        TestProp1: "This is a test property - 1",
        TestProp2: "This is a test property - 2",
        TestFunc1: function () { return "This is a test function - 1" },
        TestFunc2: function () { return "This is a test function - 2" },
        TestFunc3: function () { return "This is a test function - 3" }
    };
    var $refl = grain.reflection;
    
    // todo test findfunction and findObject functions

    test('GetProperties Tests', function () {
        strictEqual($refl.getProperties(_testObj).length, 2, "should return correct number of properties in the object");
        equal($refl.getProperties(_testObj), "TestProp1,TestProp2", "should return the names of the propeties");
        strictEqual($refl.getProperties(_testObj)[0], "TestProp1", "should return the first property in the object");
    });

    test('GetAllMethods Tests', function () {
        strictEqual($refl.getAllFunctions(_testObj).length, 3, "should return correct number of methods in the object");
        equal($refl.getAllFunctions(_testObj), "TestFunc1,TestFunc2,TestFunc3", "should return the names of the propeties");
        strictEqual($refl.getAllFunctions(_testObj)[2], "TestFunc3", "should return the third method in the object");
    });
});