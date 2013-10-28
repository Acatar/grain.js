///// <reference path="../grainjs/grain.Url.js"/>
///// <reference path="../QUnit/qunit.js"/>
///// <reference path="../grainjs/grain.FormSubmitEvents.js"/>

$(function () {

    module("grain.formSubmitEvents", {
        setup: function () {
            Btn = $("#userFormSubmit");

            BtnHasClass = "";
            BtnIsDisabled = "";
            BtnHasText = "";
            SuccessCalled = false;
            ErrorCalled = false;
            CompleteCalled = false;
            TempOptions = {};

            TempOptions.PostOptions = {
                Method: "POST",
                Url: "/api/DevelopersGuideApi/",
                OnSuccess: function (data, status, jqXHR) {
                    SuccessCalled = true;
                    $.pnotify({ title: "Success", text: "Success", type: "info" })
                },
                OnError: function (jqXHR, status, errorThrown) {
                    ErrorCalled = true;
                },
                OnComplete: function (jqXHR, status) {
                    CompleteCalled = true;
                }

            };
        },
        teardown: function () {
            SuccessCalled = false;
            ErrorCalled = false;
            CompleteCalled = false;
            Btn = null;
        }
    });


// todo: rewrite the ajax call to go against jsontest.org

/*    test('FormSubmitEvents AddSubmitEvents Modal Enter Press Test', function () {
        stop();
        var e = jQuery.Event("keypress");
        e.which = 13;
        $('#chessorwar').trigger(e);

        setTimeout(function () {

            strictEqual(SuccessCalled, true, "OnSuccess Callback was executed");
            strictEqual(CompleteCalled, true, "OnComplete Callback was executed");

            start();

        }, 2000);
    });
*/

    //asyncTest('FormSubmitEvents AddSubmitEvents Button Click Test', function () {
    //    $('#postBtn').trigger('click');

    //    setTimeout(function () {
    //        var HasClassProcessed = $('#postForm').hasClass('acatar-processed');

    //        strictEqual(SuccessCalled, true, "OnSuccess Callback was executed");
    //        strictEqual(CompleteCalled, true, "OnComplete Callback was executed");
    //        strictEqual(HasClassProcessed, true, "acatar-processed class addedd successfully ");

    //        start();

    //    }, 2000);
    //});

    test('FormSubmitEvents State Loading Test', function () {
        Btn.state('loading');
        BtnHasClass = Btn.hasClass('disabled');
        BtnIsDisabled = Btn.attr('disabled') === 'disabled';
        BtnHasText = Btn.text() === 'Saving...';

        ok(BtnHasClass, "should have class 'disabled' added to the button");
        ok(BtnHasText, "should have the button text set correctly");
        ok(BtnIsDisabled, "should have the disabled property");

        Btn.attr('data-loading-msg', '');
        Btn.state('loading');

        //equal(Btn.text(), 'Loading...', "should have the button text set to default 'Loading...'");
    });

    test('FormSubmitEvents State Saving Test', function () {
        Btn.state('saving');
        BtnHasClass = Btn.hasClass('disabled');
        BtnIsDisabled = Btn.attr('disabled') === 'disabled';
        BtnHasText = Btn.text() === 'Saving...';

        ok(BtnHasClass, "should have class 'disabled' added to the button");
        ok(BtnHasText, "should have the button text set correctly");
        ok(BtnIsDisabled, "should have the disabled property");

        Btn.attr('data-loading-msg', '');
        Btn.state('saving');

        //equal(Btn.text(), 'Saving...', "should have the button text set to default 'Saving...'");
    });

    test('FormSubmitEvents State Submitting Test', function () {
        Btn.state('submitting');
        BtnHasClass = Btn.hasClass('disabled');
        BtnIsDisabled = Btn.attr('disabled') === 'disabled';
        BtnHasText = Btn.text() === 'Saving...';

        ok(BtnHasClass, "should have class 'disabled' added to the button");
        ok(BtnHasText, "should have the button text set correctly");
        ok(BtnIsDisabled, "should have the disabled property");

        Btn.attr('data-loading-msg', '');
        Btn.state('saving');

        //equal(Btn.text(), 'Saving...', "should have the button text set to default 'Saving...'");
    });

    test('FormSubmitEvents State Completed Test', function () {
        Btn.state('saving');
        Btn.state('completed');

        BtnHasClass = Btn.hasClass('disabled');
        BtnIsDisabled = Btn.attr('disabled') === 'disabled';
        BtnHasText = Btn.text() === 'Save';

        ok(!BtnHasClass, "should not have class 'disabled' added to the button");
        ok(BtnHasText, "should have the button text set correctly");
        ok(!BtnIsDisabled, "should not have the disabled property");

        Btn.attr('data-completed-msg', '');
        Btn.state('saving');
        Btn.state('completed');

        //equal(Btn.text(), 'Completed', "should have the button text set to default 'Completed'");
    });
});