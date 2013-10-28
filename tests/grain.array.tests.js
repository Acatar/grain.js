/// <reference path="../grainjs/grain.Url.js"/>
/// <reference path="../QUnit/qunit.js"/>
/// <reference path="../grainjs/grain.String.js"/>

$(function () {
    module("grain.array", {
        setup: function () { 

        },
        teardown: function () {
            // clean up after each test
        }
    });

    var $arr = grain.array;    
    
    test('Merge Arrays', function() {
        deepEqual($arr.merge(['foo', 'bar'], ['hello', 'world']),  ["foo", "bar","hello", "world"], 'should return a single array with all of the values from both arrays.');
        deepEqual($arr.merge(['foo', 'bar']),  ["foo", "bar"], 'should return the first array when the second array is null');
        deepEqual($arr.merge(null, ['hello', 'world']),  ["hello", "world"], 'should return the second array when the first array is null.');
        strictEqual($arr.merge(),  null, 'should return null when no arrays are passed in.');
    });    
});