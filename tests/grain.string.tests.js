/// <reference path="../grainjs/grain.Url.js"/>
/// <reference path="../QUnit/qunit.js"/>
/// <reference path="../grainjs/grain.String.js"/>

$(function () {
    module("grain.string", {
        setup: function () { 

        },
        teardown: function () {
            // clean up after each test
        }
    });

    var $str = grain.string;    
    
    test('Format Inline Tests', function() {
        strictEqual("testing {0} this {1} as {2}".Format("if", "works", "expected"), "testing if this works as expected", "should return the expected string");
        strictEqual("testing {0} this {1} as {2}".Format("if", "works"), "testing if this works as {2}", "should return the expected string with out replacing the last {} when one less argument is provided");
        strictEqual("testing {0} this {1} as {2}".Format("if", "works", "expected", "extra"), "testing if this works as expected", "should return the expected string even if an extra param is added");
        strictEqual("testing {0} this {1} as {2} {3}{3}{3}".Format("if", "works", "expected", "!"), "testing if this works as expected !!!", "should return the expected string even after replacing multiple similar arguments");
        equal("testing {0} this {1} as {2}".Format(), "testing {0} this {1} as {2}", "(type independent) should return the same string when no arguments are passed");
        strictEqual("testing {0} this {1} as {2}".Format(), "testing {0} this {1} as {2}", "(type DEPENDENT)should return the same string when no arguments are passed");
    });

    test('Format Static Tests', function () {
        strictEqual(String.Format("testing {0} this {1} as {2}", "if", "works", "expected"), "testing if this works as expected", "should return the expected string");
        strictEqual(String.Format("testing {0} this {1} as {2}", "if", "works"), "testing if this works as {2}", "should return the expected string with out replacing the last {} when one less argument is provided");
        strictEqual(String.Format("testing {0} this {1} as {2}", "if", "works", "expected", "extra"), "testing if this works as expected", "should return the expected string even if an extra param is added");
        strictEqual(String.Format("testing {0} this {1} as {2} {3}{3}{3}","if", "works", "expected", "!"), "testing if this works as expected !!!", "should return the expected string even after replacing multiple similar arguments");        
        strictEqual(String.Format("testing {0} this {1} as {2}"), "testing {0} this {1} as {2}", "should return the same string when no arguments are passed");
        strictEqual(String.Format(), '' || null || undefined, "should return nothing when format takes no arguments");
    });

    test('Format Selector test', function () {
        var _main = "main"

        strictEqual(_main.ToCssSelector(), "." + _main, "should return string prepended with '.'");
        strictEqual(_main.ToIdSelector(), "#" + _main, "should return string prepended with '#'");
        strictEqual("".ToCssSelector(), ".", "should return only '.'");
        strictEqual("".ToIdSelector(), "#", "should return only '#'");
    });

    test('Keep test', function () {
        var _str = "Test123";
        
        strictEqual(_str.Keep(0, 4), "Test", "Should return the substring with the start and end index specified");
        strictEqual(_str.Keep(4, 7), "123", "Should return the substring with the start and end index specified");
        strictEqual(_str.Keep(4), "123", "Should return the substring with only the start index specified");
        strictEqual(_str.Keep(0, 4).Keep(2, 4), "st", "testing chaining for the Keep method");
    });

    test('Remove test', function () {
        var _str = "Test---NewTest";

        strictEqual(_str.Remove(4, 7), "TestNewTest", "should return a string with text removed based in start and end index");        
        strictEqual(_str.Remove(4, 7).Remove(4, 7), "TestTest", "Testing chaining for the Remove method");

        //This fails
        strictEqual(_str.Remove(7), 'NewTest', 'specifing only the start index should remove all chars after the index');
    });

    test('Replace test', function () {        
        var _str = 'TestReplaceMeSuccess';

        strictEqual(_str.Replace("ReplaceMe", " is a "), "Test is a Success", "should return string with some text replaced (case sensitive)");
        strictEqual(_str.Replace("rEpLaCeMe", " is a ", true), "Test is a Success", "should return string with some text replaced (case sensitive)");
        strictEqual(_str.Replace("rEpLaCeMe", " is a ", false), "TestReplaceMeSuccess", "should return same string case sensitive search is performed with varied case input)");

        //This fails
        strictEqual(_str.Replace(), "TestReplaceMeSuccess", 'should return the same string when no parameters are passed');
    });

    test('Title Case test', function () {
        var _str = 'test title case';

        strictEqual($str.toTitleCase(_str), "Test Title Case", "should return title cased string with multiple words");
        strictEqual($str.toTitleCase("test"), "Test", "should return title cased string with just one word");

        //This fails
        strictEqual($str.toTitleCase(), null, "should return nothing if no parameter is passed");
    });

    test('Base64 test', function () {
        var _str = "test string";
        var _strEncoded = "dGVzdCBzdHJpbmc=";
        var _encoded = _str.Base64Encode();
        var _decoded = _encoded.Base64Decode();
        notEqual(_str, _encoded, "encoded string should not equal original string.");
        strictEqual(_strEncoded, _encoded, "encoded string should be encoded.");
        strictEqual(_str, _decoded, "should return same string as initial.");
    });
});