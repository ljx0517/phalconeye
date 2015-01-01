var wijmo;
(function (wijmo) {
    var isExplorerHtml = document.location.pathname.match(/explore\.htm/), amdJs = "../../amd-js", isOnline = document.location.host.match(/wijmo\.com/), widgetExplorerDir = "../Samples/WidgetExplorer", jsDir = widgetExplorerDir + "/js", externalDir = "http://cdn.wijmo.com/external";
    if(isOnline) {
        amdJs = "http://cdn.wijmo.com/amd-js/3.20143.59";
        jsDir = "http://wijmo.com/demo/explore/js/";
    } else if(!isExplorerHtml) {
        amdJs = "../../" + amdJs;
    }
    requirejs.config({
        baseUrl: amdJs,
        paths: {
            "jquery": "jquery-1.11.1.min",
            "jquery-ui": "jquery-ui-1.11.0.custom.min",
            "jquery.ui": "jquery-ui",
            "globalize": "globalize.min",
            "knockout": "knockout-3.1.0",
            "swfobject": "swfobject",
            "swfupload": "swfupload",
            "jquery.bgiframe": "jquery.bgiframe",
            "jquery.cookie": "jquery.cookie",
            "breeze": "breeze.debug",
            "jquery.mousewheel": "jquery.mousewheel.min",
            "amplify": "amplify.store.min",
            "js": jsDir,
            "amplify.core": externalDir + "/amplify.core.min",
            "amplify.store": externalDir + "/amplify.store.min",
            "jquery.cookie": externalDir + "/jquery.cookie",
            "jquery.tmpl": externalDir + "/jquery.tmpl.min"
        },
        shim: {
            chartexport: [
                "wijmo.wijcompositechart"
            ],
            breeze: [
                "q", 
                "jquery"
            ],
            knockout: [
                "jquery"
            ],
            "globalize.cultures": [
                "globalize"
            ],
            "amplify.store": [
                "amplify.core"
            ],
            "amplify": [
                "jquery", 
                "amplify.store"
            ],
            "jquery.cookie": [
                "jquery"
            ],
            "jquery.tmpl": [
                "jquery"
            ]
        }
    });
})(wijmo || (wijmo = {}));
