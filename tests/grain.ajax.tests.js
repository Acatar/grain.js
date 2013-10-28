///// <reference path="../grainjs/grain.Url.js"/>
///// <reference path="../QUnit/qunit.js"/>
///// <reference path="../grainjs/grainAjax.js"/>

// todo: rewrite these tests using http://www.jsontest.com/

/*
var GrainAjaxTests = {};
GrainAjaxTests.EmptyTest = function(parent) {
    parent.OnSuccessInvoked = false;
    parent.OnErrorInvoked = false;
    parent.OnCompleteInvoked = false;
    parent.IsFinished = false;
    parent.SuccessData = null;
    parent.ErrorCode = null;
    parent.Options = {
        Url: '/api/FakeUrlShouldFail',
        Method: 'POST',
        OnSuccess: function (data, status, jqXHR) {
            parent.SuccessData = data;
            parent.OnSuccessInvoked = true;
        },
        OnError: function (jqXHR, status, errorThrown) {
            parent.ErrorCode = errorThrown;
            parent.OnErrorInvoked = true;
        },
        OnComplete: function (jqXHR, status) {
            parent.OnCompleteInvoked = true;
            parent.IsFinished = true;
        }
    };

    return parent;
}

$(function () {
    module("grain.ajax", {
        setup: function () {
        },
        teardown: function () {
            // clean up after each test
        }
    });

    // Owner: Andy
    asyncTest('Submit OnSuccess Test (javascript DataToSubmit input)', function () {
        GrainAjaxTests.OnSuccess = {};
        var $testObject = GrainAjaxTests.OnSuccess;
        $testObject = GrainAjaxTests.EmptyTest($testObject);
        $testObject.Options.Url = '/api/DevelopersGuideApi';
        $testObject.Options.DataToSubmit = { "question": { "ChessOrWar": "War" } };

        var _formId = 'GrainAjax_OnSuccessTest';
        var _ajaxOptionsFQN = 'GrainAjaxTests.OnSuccess.Options';
        var _form = '<form id="' + _formId + '" class="ajax" data-ajax-options="' + _ajaxOptionsFQN + '"></form>';
        $('body').append(_form);
        $('#' + _formId).submit();

        Grain.Wait.Until(function () { return $testObject.IsFinished; }, function () {
            ok($testObject.OnSuccessInvoked == true, 'should invoke the OnSuccess handler');
            ok($testObject.OnErrorInvoked == false, 'should NOT invoke the OnError handler');
            ok($testObject.OnCompleteInvoked == true, 'should invoke the OnComplete handler');
            strictEqual($testObject.SuccessData.Title, 'How About Chess?', 'should suggest a game of chess instead');
            $('#' + _formId).remove();
            start();
        },
        function () {
            ok(false, "Ajax call should complete.");
            $('#' + _formId).remove();
            start();
        }, 0, 100, 50);
    });

    // Owner: Andy
    asyncTest('Submit OnSuccess Test (form input)', function () {
        GrainAjaxTests.OnSuccess2 = {};
        var $testObject = GrainAjaxTests.OnSuccess2;
        $testObject = GrainAjaxTests.EmptyTest($testObject);
        $testObject.Options.Url = '/api/DevelopersGuideApi';

        var _formId = 'GrainAjax_OnSuccess2Test';
        var _ajaxOptionsFQN = 'GrainAjaxTests.OnSuccess2.Options';
        var _form = '<form id="' + _formId + '" class="ajax" data-ajax-options="' + _ajaxOptionsFQN
            + '"><input type="text" value="War" name="question.ChessOrWar" /></form>';
        $('body').append(_form);
        $('#' + _formId).submit();

        Grain.Wait.Until(function () { return $testObject.IsFinished; }, function () {
            ok($testObject.OnSuccessInvoked == true, 'should invoke the OnSuccess handler');
            ok($testObject.OnErrorInvoked == false, 'should NOT invoke the OnError handler');
            ok($testObject.OnCompleteInvoked == true, 'should invoke the OnComplete handler');
            strictEqual($testObject.SuccessData.Title, 'How About Chess?', 'should suggest a game of chess instead');
            $('#' + _formId).remove();
            start();
        },
        function () {
            ok(false, "Ajax call should complete.");
            $('#' + _formId).remove();
            start();
        }, 0, 100, 50);
    });

    // Owner: Andy
    asyncTest('Submit OnError Test', function () {
        GrainAjaxTests.OnError = {};
        var $testObject = GrainAjaxTests.OnError;
        $testObject = GrainAjaxTests.EmptyTest($testObject);

        var _formId = 'GrainAjax_OnErrorTest';
        var _ajaxOptionsFQN = 'GrainAjaxTests.OnError.Options';
        $('body').append('<form id="' + _formId + '" class="ajax" data-ajax-options="' + _ajaxOptionsFQN + '"></form>');
        $('#' + _formId).submit();

        Grain.Wait.Until(function () { return $testObject.IsFinished; }, function () {
            ok($testObject.OnSuccessInvoked == false, 'should NOT invoke the OnSuccess handler');
            ok($testObject.OnErrorInvoked == true, 'should invoke the OnError handler');
            ok($testObject.OnCompleteInvoked == true, 'should invoke the OnComplete handler');
            $('#' + _formId).remove();
            start();
        },
        function () {
            ok(false, "Ajax call should complete.");
            $('#' + _formId).remove();
            start();
        }, 0, 100, 50);
    });

    //Owner: Andy
    asyncTest('Get OnSuccess Test', function () {
        GrainAjaxTests.OnGetSuccess = {};
        var $testObject = GrainAjaxTests.OnGetSuccess;
        $testObject = GrainAjaxTests.EmptyTest($testObject);
        $testObject.Options.Url = '/api/DevelopersGuideApi/42';
        $testObject.Options.Method = 'GET';

        var _formId = 'GrainAjax_OnGetSuccessTest';
        var _ajaxOptionsFQN = 'GrainAjaxTests.OnGetSuccess.Options';
        $('body').append('<button id="' + _formId + '" class="ajax" data-ajax-options="' + _ajaxOptionsFQN + '"></button>');
        $('#' + _formId).click();

        Grain.Wait.Until(function () { return $testObject.IsFinished; }, function () {
            ok($testObject.OnSuccessInvoked == true, 'should invoke the OnSuccess handler');
            ok($testObject.OnErrorInvoked == false, 'should NOT invoke the OnError handler');
            ok($testObject.OnCompleteInvoked == true, 'should invoke the OnComplete handler');
            strictEqual($testObject.SuccessData, '<div>The meaning of life, the universe and everything is: 42</div>', 'should return a specific HTML result (if this fails - did the DevelpersGuide Controller change?)');
            $('#' + _formId).remove();
            start();
        },
        function () {
            ok(false, "Ajax call should complete.");
            $('#' + _formId).remove();
            start();
        }, 0, 100, 50);
    });

    //Owner: Andy
    asyncTest('Get OnError Test', function () {
        GrainAjaxTests.OnGetError = {};
        var $testObject = GrainAjaxTests.OnGetError;
        $testObject = GrainAjaxTests.EmptyTest($testObject);
        $testObject.Options.Url = '/api/FakeUrlShouldFail';
        $testObject.Options.Method = 'GET';

        var _formId = 'GrainAjax_OnGetErrorTest';
        var _ajaxOptionsFQN = 'GrainAjaxTests.OnGetError.Options';
        $('body').append('<button id="' + _formId + '" class="ajax" data-ajax-options="' + _ajaxOptionsFQN + '"></button>');
        $('#' + _formId).click();

        Grain.Wait.Until(function () { return $testObject.IsFinished; }, function () {
            ok($testObject.OnSuccessInvoked == false, 'should NOT invoke the OnSuccess handler');
            ok($testObject.OnErrorInvoked == true, 'should invoke the OnError handler');
            ok($testObject.OnCompleteInvoked == true, 'should invoke the OnComplete handler');
            strictEqual($testObject.ErrorCode, 'Not Found', 'should return 404');
            $('#' + _formId).remove();
            start();
        },
        function () {
            ok(false, "Ajax call should complete.");
            $('#' + _formId).remove();
            start();
        }, 0, 100, 50);
    });

    // owner: Andy
    asyncTest('Get By URL Test', function () {
        var _result = Grain.Ajax.Get('/api/DevelopersGuideApi/42');

        Grain.Wait.Until(function () { return _result.responseText != null; }, function () {
            strictEqual($.parseJSON(_result.responseText), '<div>The meaning of life, the universe and everything is: 42</div>', 'should return a specific HTML result (if this fails - did the DevelpersGuide Controller change?)');
            start();
        },
        function () {
            ok(false, "Ajax call should complete.");
            start();
        }, 0, 100, 50);
    });

    // owner: Andy
    asyncTest('Post OnSuccess Test', function () {
        GrainAjaxTests.OnPostSuccess = {};
        var $testObject = GrainAjaxTests.OnPostSuccess;
        $testObject = GrainAjaxTests.EmptyTest($testObject);
        $testObject.Options.Url = '/api/DevelopersGuideApi';
        $testObject.Options.DataToSubmit = { "question": { "ChessOrWar": "War" } };
        //$testObject.Options.Method = 'POST';

        var _result = Grain.Ajax.Post($testObject.Options);

        Grain.Wait.Until(function () { return $testObject.IsFinished; }, function () {
            ok($testObject.OnSuccessInvoked == true, 'should invoke the OnSuccess handler');
            ok($testObject.OnErrorInvoked == false, 'should NOT invoke the OnError handler');
            ok($testObject.OnCompleteInvoked == true, 'should invoke the OnComplete handler');
            strictEqual($testObject.SuccessData.Title, 'How About Chess?', 'should suggest a game of chess instead');
            start();
        },
        function () {
            ok(false, "Ajax call should complete.");
            start();
        }, 0, 100, 50);
    });

    // owner: Andy
    asyncTest('Post OnError Test', function () {
        GrainAjaxTests.OnPostSuccess = {};
        var $testObject = GrainAjaxTests.OnPostSuccess;
        $testObject = GrainAjaxTests.EmptyTest($testObject);
        $testObject.Options.Url = '/api/FakeUrlShouldFail';
        $testObject.Options.DataToSubmit = "FOo";
        //$testObject.Options.Method = 'POST';

        var _result = Grain.Ajax.Post($testObject.Options);

        Grain.Wait.Until(function () { return $testObject.IsFinished; }, function () {
            ok($testObject.OnSuccessInvoked == false, 'should NOT invoke the OnSuccess handler');
            ok($testObject.OnErrorInvoked == true, 'should invoke the OnError handler');
            ok($testObject.OnCompleteInvoked == true, 'should invoke the OnComplete handler');
            strictEqual($testObject.ErrorCode, 'Not Found', 'should return 404');
            start();
        },
        function () {
            ok(false, "Ajax call should complete.");
            start();
        }, 0, 100, 50);
    });

    // owner: Andy
    asyncTest('Put OnSuccess Test', function () {
        GrainAjaxTests.OnPutSuccess = {};
        var $testObject = GrainAjaxTests.OnPutSuccess;
        $testObject = GrainAjaxTests.EmptyTest($testObject);
        $testObject.Options.Url = '/api/DevelopersGuideApi';
        $testObject.Options.DataToSubmit = { "question": { "ChessOrWar": "War" } };
        $testObject.Options.Method = 'PUT';

        var _result = Grain.Ajax.Put($testObject.Options);

        Grain.Wait.Until(function () { return $testObject.IsFinished; }, function () {
            ok($testObject.OnSuccessInvoked == true, 'should invoke the OnSuccess handler');
            ok($testObject.OnErrorInvoked == false, 'should NOT invoke the OnError handler');
            ok($testObject.OnCompleteInvoked == true, 'should invoke the OnComplete handler');
            strictEqual($testObject.SuccessData.Title, 'Your Response', 'should return a ClientMessage response');
            start();
        },
        function () {
            ok(false, "Ajax call should complete.");
            start();
        }, 0, 100, 50);
    });

    test('Ajax Action POST/PUT Test', function () {

        ok(false, "Action method needs to allow post/put calls");
    });
});

//#region: Removed Tests

//setup: function () {

//    $("#frm").on('submit', $.grain.Ajax.Submit);            
//    $('#Getbtn').on('click', $.grain.Ajax.Action);

//    TempOptions = {};
//    TempVar = "";
//    SuccessCalled = false;
//    ErrorCalled = false;
//    CompleteCalled = false;
//    Data = { ChessOrWar: "War" };

//    TempOptions.GetOptions = {
//        Url: "/api/DevelopersGuideApi/42",
//        Method: "GET",
//        OnSuccess: function (data, status, jqXHR) {
//            TempVar = $(data).text();
//            SuccessCalled = true;
//        },
//        OnError: function (jqXHR, status, errorThrown) {
//            ErrorCalled = true;
//        },
//        OnComplete: function (jqXHR, status) {
//            CompleteCalled = true;
//        }
//    };

//    TempOptions.PutOptions = {
//        Method: "PUT",
//        OnSuccess: function (data, status, jqXHR) {
//            SuccessCalled = true;
//        },
//        OnError: function (jqXHR, status, errorThrown) {
//            ErrorCalled = true;
//        },
//        OnComplete: function (jqXHR, status) {
//            CompleteCalled = true;
//        }

//    };

//    TempOptions.PostOptions = {
//        Method: "POST",
//        Url: "/api/DevelopersGuideApi/",
//        DataToSubmit: Data,
//        OnSuccess: function (data, status, jqXHR) {
//            SuccessCalled = true;
//        },
//        OnError: function (jqXHR, status, errorThrown) {
//            ErrorCalled = true;
//        },
//        OnComplete: function (jqXHR, status) {
//            CompleteCalled = true;
//        }

//    };
//},
//teardown: function () {
//    $("#frm").off('submit', $.grain.Ajax.Submit);
//    TempVar = "";
//    SuccessCalled = false;
//    ErrorCalled = false;
//    CompleteCalled = false;
//    Data = {};
//}
//});

//// Owner: Chetan
//// Reason for removal - It is not necessary to POST real data to test this feature
//asyncTest('Ajax Submit Success Test', function () {
//    $("#frm").submit();

//    setTimeout(function () {
//        strictEqual(SuccessCalled, true, "OnSuccess Callback was executed");
//        strictEqual(CompleteCalled, true, "OnComplete Callback was executed");
//        start();
//    }, 500);
//});
// Owner: Chetan
// Reason for removal - this is not a safe assumption
////Setting the UserId to 1 to make the request fail
////assuming the user logged in is andy wright with user id = 15
//asyncTest('Ajax Submit Error Test', function () {
//    $("#UserVw_Id").val("1");
//    $("#frm").submit();

//    setTimeout(function () {
//        strictEqual(ErrorCalled, true, "Error Callback was executed");
//        strictEqual(CompleteCalled, true, "OnComplete Callback was executed");
//        start();
//    }, 500);
//});

// Owner: Chetan
// Reason for removal - this takes ~500ms longer than necessary
//asyncTest('Ajax Action Get OnSuccess Test', function () {
//    $('#Getbtn').trigger('click');

//    setTimeout(function () {
//        strictEqual(TempVar, "The meaning of life, the universe and everything is: 42", TempVar);
//        strictEqual(SuccessCalled, true, "OnSuccess Callback was executed");
//        strictEqual(CompleteCalled, true, "OnComplete Callback was executed");
//        start();
//    }, 500);

//});

//// Owner: Chetan
//// Reason for removal - this takes ~500ms longer than necessary
//asyncTest('Ajax Action Get Error Test', function () {
//    TempOptions.GetOptions.Url = "/api/DevelopersGuideApi/ErrorUrl";
//    $('#Getbtn').trigger('click');

//    setTimeout(function () {
//        strictEqual(ErrorCalled, true, "Error Callback was executed");
//        strictEqual(CompleteCalled, true, "OnComplete Callback was executed");

//        start();
//    }, 500);

//});

//// Owner: Chetan
//// Reason for removal - redundant
//asyncTest('Ajax Get With Options Test', function () {
//    TempOptions.GetOptions.Url = "/api/DevelopersGuideApi/43";
//    Grain.Ajax.Get(TempOptions.GetOptions);

//    setTimeout(function () {
//        strictEqual(TempVar, "The meaning of life, the universe and everything is: 43", "should return the correct value from the get request");
//        start();
//    }, 500);
//});

// owner: Chetan
// Reason for removal - requires the tester to be aware of this test and log the result which results in an inconsistent human variable
//asyncTest('Ajax Get With Url only Test', function () {

//    Grain.Ajax.Get("/Session/RefreshMenu/");

//    setTimeout(function () {
//        ok(true, "Should show a pnotify popup on the screen");
//        start();
//    }, 500);
//});

//// owner: Chetan
//// Reason for removal - takes ~1000ms longer than necessary
//asyncTest('Ajax Post Success Test', function () {

//    Grain.Ajax.Post(TempOptions.PostOptions);

//    setTimeout(function () {
//        strictEqual(SuccessCalled, true, "OnSuccess Callback was executed");
//        strictEqual(CompleteCalled, true, "OnComplete Callback was executed");
//        start();
//    }, 1000);
//});



//// owner: Chetan
//// Reason for Removal: takes ~1000ms longer than necessary
//asyncTest('Ajax Post Error Test', function () {

//    Data.ChessOrWar = "Chess";
//    Grain.Ajax.Post(TempOptions.PostOptions);

//    setTimeout(function () {
//        strictEqual(ErrorCalled, true, "OnError Callback was executed");
//        strictEqual(CompleteCalled, true, "OnComplete Callback was executed");
//        start();
//    }, 1000);
//});

//#endregion: Removed Tests
*/