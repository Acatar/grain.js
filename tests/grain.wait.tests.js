/// <reference path="../grainjs/grain.Url.js"/>
/// <reference path="../QUnit/qunit.js"/>
/// <reference path="../grainjs/grain.js"/>

$(function () {
    module("grain.wait", {
        setup: function () {
        },
        teardown: function () {
            // clean up after each test
        }
    });

    var $wait = grain.wait;

    // Owner: Andy
    asyncTest('grain.Wait.Once Test', function () {
        var _startTime = new Date().getTime();
        var _elapsed = _startTime;
        var _num = 0;

        $wait.once(function () {
            _elapsed = new Date().getTime() - _startTime;
            _num++;
            ok(_elapsed >= 40 && _elapsed < 200, "should wait ~40 ms to execute the function");
            ok(_num == 1, "should wait only once");
            start();
        });
    });

    // Owner: Andy
    asyncTest('grain.Wait.Once with interval Test', function () {
        var _startTime = new Date().getTime();
        var _elapsed = _startTime;
        var _num = 0;

        _startTime = new Date().getTime();
        _elapsed = _startTime;

        $wait.once(function () {
            _elapsed = new Date().getTime() - _startTime;
            _num++;
            ok(_elapsed >= 250 && _elapsed < 400, "should wait ~250 ms to execute the function");
            ok(_num == 1, "should wait only once");
            start();
        }, 250);
    });

    // Owner: Andy
    asyncTest('grain.Wait.When Test', function () {
        var _startTime = new Date().getTime();
        var _elapsed = _startTime;
        var _interval = 40;
        var _exptectedElapsedTime = 0;
        var _marginOfError = 40;
        var _results = new Array();
        
        $wait.when(function () {
            _elapsed = new Date().getTime() - _startTime;
            _results.push({ expectedElapsedTime: _exptectedElapsedTime, actualElapsedTime: _elapsed, marginOfError: _marginOfError });
            _exptectedElapsedTime = _exptectedElapsedTime + _interval;
            _marginOfError = _marginOfError + _interval;
        });

        $wait.until(function () { return _results.length == 2 }, function () {
            for (var i = 0; i < 2; i++) {
                var _result = _results[i];
                var _elapsedTimeIsOk = _result.actualElapsedTime >= _result.expectedElapsedTime && _result.actualElapsedTime < _result.marginOfError;
                ok(_elapsedTimeIsOk, "should wait ~40 ms intervals  betwen executions");
            }
            start();
        }, function () { });

        stop();
        $wait.until(function () { return _results.length == 3 }, function () {
            ok(false, "should attempt exection twice");
            start();
        }, function () {
            ok(true, "should attempt exection twice");
            start();
        });
    });

    // Owner: Andy
    asyncTest('grain.Wait.Until number of executions Test', function () {
        var _results = new Array();
        _getResultsArrayForUntilTests(1, _results);

        $wait.until(function () { return _results.length == 11 }, function () {
            console.info('The expected number of executions was 10, but the actual result was: ' + _results.length);
            ok(false, "should attempt exection ten times");
            start();
        }, function () {
            ok(true, "should attempt exection ten times");
            start();
        });
    });

    // Owner: Andy
    asyncTest('grain.Wait.Until onGaveUp Test', function () {
        $wait.until(function () { return false; }, function () {
            /* on success */
            ok(false, 'The onGaveUp, and not the then, function should execute');
            start();
        }, function () {
            ok(true, 'The onGaveUp, and not the then, function should execute');
            start();
        }, 0, 1, 1);
    });

    // Owner: Andy
    asyncTest('grain.Wait.Until then Test', function () {
        $wait.until(function () { return true; }, function () {
            /* on success */
            ok(true, 'The then, and not the onGaveUp, function should execute');
            start();
        }, function () {
            ok(false, 'The then, and not the onGaveUp, function should execute');
            start();
        }, 0, 10, 1);
    });

    //// Owner: Andy
    //asyncTest('grain.Wait.Until Test', function () {
    //    var _results = new Array();
    //    _getResultsArrayForUntilTests(40, _results);

    //    $wait.Until(function () { return _results.length == 10 }, function () {
    //        for (var i = 0; i < 10; i++) {
    //            var _result = _results[i];
    //            var _elapsedTimeIsOk = _result.actualElapsedTime >= _result.expectedElapsedTime && _result.actualElapsedTime < _result.upperMarginOfError;

    //            if (!_elapsedTimeIsOk) {
    //                console.info(_result.actualElapsedTime + ' should be >= ' + _result.expectedElapsedTime);
    //                console.info(_result.actualElapsedTime + ' should be < ' + _result.upperMarginOfError);
    //            }

    //            ok(_elapsedTimeIsOk, "should wait ~40 ms intervals  betwen executions");
    //        }
    //        start();
    //    }, function () { });
    //});

    // Owner: Andy
    asyncTest('grain.Wait.Until with interval Test', function () {
        var _results = new Array();
        _getResultsArrayForUntilTests(10, _results);

        $wait.until(function () { return _results.length == 10 }, function () {
            //console.info(_results);
            for (var i = 0; i < 10; i++) {
                var _result = _results[i];
                var _elapsedTimeIsOk = _result.actualElapsedTime >= _result.expectedElapsedTime && _result.actualElapsedTime < _result.upperMarginOfError;

                if (!_elapsedTimeIsOk) {
                    console.info(_result.actualElapsedTime + ' should be >= ' + _result.expectedElapsedTime);
                    console.info(_result.actualElapsedTime + ' should be < ' + _result.upperMarginOfError);
                }

                ok(_elapsedTimeIsOk, "should wait ~10 ms intervals  betwen executions");
            }
            start();
        }, function () { });
    });

    var _getResultsArrayForUntilTests = function (interval, out_ResultsArray) {
        var _startTime = new Date().getTime();
        var _elapsed = _startTime;
        var _numberOfTries = 0;
        var _interval = interval;
        var _exptectedElapsedTime = 0;
        var _marginOfError = interval;
        //var _results = new Array();

        $wait.until(function () {
            _elapsed = new Date().getTime() - _startTime;
            out_ResultsArray.push({ expectedElapsedTime: _exptectedElapsedTime, actualElapsedTime: _elapsed, upperMarginOfError: _marginOfError });
            _exptectedElapsedTime = _elapsed + _interval;
            _marginOfError = _elapsed + (_interval * 3);

            _numberOfTries++;
            return false;
        }, function () { /* on success */ }, function () { /*on gave up*/ }, 0, 10, interval);
    }

    //Commented this test out.
    //It goes into an infinite loop.
    //Wait.When will serve the purpose of infinite wait with out going into a loop

    //test('Grain Wait KeepTrying Test', function () {

    //    stop();
    //    IncrementLimit = 25;

    //    $wait.KeepTrying(IsTrueFunc, ThenFunc);


    //    setTimeout(function () {
    //        equal(TempVar1, "This is a test", 'wait untill operation gave up successfully');
    //        console.log("equality checked");
    //        TempVar1 = "";
    //        TempCounter = 0;
    //        start();
    //    }, 1500);

    //});    

});