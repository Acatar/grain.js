// inspired by: http://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
grain.tabEvents = { init: function(window, document) {
    var hidden = "hidden",
        handlers = [],
        onchange,
        addHandler;

    onchange = function (evt) {
        var v = 'visible', h = 'hidden',
            evtMap = { 
                focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h 
            };

        evt = evt || window.event;
        
        for (var i in handlers) {
            var _handler = handlers[i];

            if (evt.type in evtMap)
                _handler.call(null, evtMap[evt.type]);
            else        
                _handler.call(null, this[hidden] ? "hidden" : "visible");
        }
    };

    addHandler = function(callback) {
        if(typeof(callback) !== 'function')
            throw Error('tab event handlers must be functions that accept a single argument.');

        handlers.push(callback);
    };

    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    else if ('onfocusin' in document)
        document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange; 

    return {
        addHandler: addHandler
    };   
}};