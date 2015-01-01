module wijmo.explorer {
    var scriptFiles = [
        "../../../../Wijmo/External/jquery-1.11.1.min.js",
        "../../../../Wijmo/External/jquery-ui-1.11.0.custom.min.js",
    // Sample Dependencies
        "../../js/amplify.core.min.js",
        "../../js/amplify.store.min.js",
        "../../../../Wijmo/External/jquery.cookie.js",
        "../../js/jquery.tmpl.min.js",
        "../../../../Wijmo/External/swfobject.js",
        "../../../../Wijmo/External/swfupload.js",

        "../../../../Wijmo/External/jquery.mousewheel.min.js",
        "../../../../Wijmo/External/jquery.bgiframe.js",
        "../../../../Wijmo/External/globalize.min.js",
        "../../../../Wijmo/External/raphael-min.js",
        "../../../../Wijmo/External/q.js",
        "../../../../Wijmo/External/breeze.debug.js",
        "../../../../Wijmo/External/knockout-2.2.1.debug.js",

        "../../../../Wijmo/wijutil/jquery.wijmo.wijutil.js",
        "../../../../Wijmo/wijutil/jquery.wijmo.wijtouchutil.js",
        "../../../../Wijmo/wijutil/jquery.wijmo.wijtouchtransitions.js",
        "../../../../Wijmo/Base/jquery.wijmo.widget.js",
        "../../../../Wijmo/wijcalendar/jquery.wijmo.wijcalendar.js",
        "../../../../Wijmo/wijexpander/jquery.wijmo.wijexpander.js",
        "../../../../Wijmo/wijaccordion/jquery.wijmo.wijaccordion.js",
        "../../../../Wijmo/wijsuperpanel/jquery.wijmo.wijsuperpanel.js",
        "../../../../Wijmo/wijsplitter/jquery.wijmo.wijsplitter.js",
        "../../../../Wijmo/wijslider/jquery.wijmo.wijslider.js",
        "../../../../Wijmo/wijvideo/jquery.wijmo.wijvideo.js",
        "../../../../Wijmo/wijtooltip/jquery.wijmo.wijtooltip.js",
        "../../../../Wijmo/wijmenu/jquery.wijmo.wijmenu.js",
        "../../../../Wijmo/wijcheckbox/jquery.wijmo.wijcheckbox.js",
        "../../../../Wijmo/wijdropdown/jquery.wijmo.wijdropdown.js",
        "../../../../Wijmo/wijradio/jquery.wijmo.wijradio.js",
        "../../../../Wijmo/wijdialog/jquery.wijmo.wijdialog.js",
        "../../../../Wijmo/wijtextbox/jquery.wijmo.wijtextbox.js",
        "../../../../Wijmo/wijlist/jquery.wijmo.wijlist.js",
        "../../../../Wijmo/wijtabs/jquery.wijmo.wijtabs.js",
        "../../../../Wijmo/wijpopup/jquery.wijmo.wijpopup.js",
        "../../../../Wijmo/wijprogressbar/jquery.wijmo.wijprogressbar.js",
        "../../../../Wijmo/wijflipcard/jquery.wijmo.wijflipcard.js",

        "../../../../Wijmo/data/wijmo.data.js",
        "../../../../Wijmo/data/wijmo.data.wijdatasource.js",
        "../../../../Wijmo/data/wijmo.data.ajax.js",
        "../../../../Wijmo/data/wijmo.data.breeze.js",
        "../../../../Wijmo/wijutil/jquery.wijmo.raphael.js",
        "../../../../Wijmo/wijevcal/jquery.wijmo.wijevcal.js",
        "../../../../Wijmo/wijfilter/jquery.wijmo.wijfilter.js",
        "../../../../Wijmo/wijdatepager/jquery.wijmo.wijdatepager.js",
        "../../../../Wijmo/wijdatasource/jquery.wijmo.wijdatasource.js",
        "../../../../Wijmo/wijchart/jquery.wijmo.wijchartcore.js",
        "../../../../Wijmo/wijbarchart/jquery.wijmo.wijbarchart.js",
        "../../../../Wijmo/wijbubblechart/jquery.wijmo.wijbubblechart.js",
        "../../../../Wijmo/wijlinechart/jquery.wijmo.wijlinechart.js",
        "../../../../Wijmo/wijpiechart/jquery.wijmo.wijpiechart.js",
        "../../../../Wijmo/wijscatterchart/jquery.wijmo.wijscatterchart.js",
        "../../../../Wijmo/wijcandlestickchart/jquery.wijmo.wijcandlestickchart.js",
        "../../../../Wijmo/wijcompositechart/jquery.wijmo.wijcompositechart.js",
        "../../../../Wijmo/wijgauge/jquery.wijmo.wijgauge.js",
        "../../../../Wijmo/wijlineargauge/jquery.wijmo.wijlineargauge.js",
        "../../../../Wijmo/wijradialgauge/jquery.wijmo.wijradialgauge.js",
        "../../../../Wijmo/wijcombobox/jquery.wijmo.wijcombobox.js",
        "../../../../Wijmo/wijribbon/jquery.wijmo.wijribbon.js",
        "../../../../Wijmo/wijeditor/jquery.wijmo.wijeditor.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijcharex.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijstringinfo.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijinputcore.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijinpututility.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijinputnumberformat.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijinputnumber.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijinputmaskcore.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijinputmaskformat.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijinputmask.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijinputdateformat.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijinputdate.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijinputtextformat.js",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijinputtext.js",
        "../../../../Wijmo/wijcarousel/jquery.wijmo.wijcarousel.js",
        "../../../../Wijmo/wijupload/jquery.wijmo.wijupload.js",
        "../../../../Wijmo/wijgallery/jquery.wijmo.wijgallery.js",
        "../../../../Wijmo/wijlightbox/jquery.wijmo.wijlightbox.js",
        "../../../../Wijmo/wijpager/jquery.wijmo.wijpager.js",
        "../../../../Wijmo/wijtree/jquery.wijmo.wijtree.js",
        "../../../../Wijmo/wijtreemap/jquery.wijmo.wijtreemap.js",
        "../../../../Wijmo/wijrating/jquery.wijmo.wijrating.js",
        "../../../../Wijmo/wijsparkline/jquery.wijmo.wijsparkline.js",
        "../../../../Wijmo/wijwizard/jquery.wijmo.wijwizard.js",
        "../../../../Wijmo/wijgrid/jquery.wijmo.wijgrid.js",
		"../../../../Wijmo/wijfileexplorer/jquery.wijmo.wijfileexplorer.js",
		"../../../../Wijmo/wijmaps/jquery.wijmo.wijmaps.js",

    //export service
        "../../../../Wijmo/export/exportUtil.js",
        "../../../../Wijmo/export/chartexport.js",
        "../../../../Wijmo/export/gridexport.js",

    // Globalize Cultures
        "../../../../Wijmo/external/cultures/globalize.cultures.js",

    // Knockout and Knockout Integration Library for Wijmo
        "../../../../Wijmo/Interop/knockout.wijmo.js"
    ];

    var cssFiles = [
        "../../../../Wijmo/wijutil/jquery.wijmo.wijutil.css",
        "../../../../Wijmo/wijcalendar/jquery.wijmo.wijcalendar.css",
        "../../../../Wijmo/wijexpander/jquery.wijmo.wijexpander.css",
        "../../../../Wijmo/wijaccordion/jquery.wijmo.wijaccordion.css",
        "../../../../Wijmo/wijfilter/jquery.wijmo.wijfilter.css",
        "../../../../Wijmo/wijsuperpanel/jquery.wijmo.wijsuperpanel.css",
        "../../../../Wijmo/wijsplitter/jquery.wijmo.wijsplitter.css",
        "../../../../Wijmo/wijslider/jquery.wijmo.wijslider.css",
        "../../../../Wijmo/wijtooltip/jquery.wijmo.wijtooltip.css",
        "../../../../Wijmo/wijflipcard/jquery.wijmo.wijflipcard.css",
        "../../../../Wijmo/wijmenu/jquery.wijmo.wijmenu.css",
        "../../../../Wijmo/wijtextbox/jquery.wijmo.wijtextbox.css",
        "../../../../Wijmo/wijdropdown/jquery.wijmo.wijdropdown.css",
        "../../../../Wijmo/wijradio/jquery.wijmo.wijradio.css",
        "../../../../Wijmo/wijcheckbox/jquery.wijmo.wijcheckbox.css",
        "../../../../Wijmo/wijdialog/jquery.wijmo.wijdialog.css",
        "../../../../Wijmo/wijlist/jquery.wijmo.wijlist.css",
        "../../../../Wijmo/wijtabs/jquery.wijmo.wijtabs.css",
        "../../../../Wijmo/wijvideo/jquery.wijmo.wijvideo.css",
        "../../../../Wijmo/wijprogressbar/jquery.wijmo.wijprogressbar.css",
        "../../../../Wijmo/wijevcal/jquery.wijmo.wijevcal.css",
        "../../../../Wijmo/wijdatepager/jquery.wijmo.wijdatepager.css",
        "../../../../Wijmo/wijcarousel/jquery.wijmo.wijcarousel.css",
        "../../../../Wijmo/wijlightbox/jquery.wijmo.wijlightbox.css",
        "../../../../Wijmo/wijgallery/jquery.wijmo.wijgallery.css",
        "../../../../Wijmo/wijtree/jquery.wijmo.wijtree.css",
        "../../../../Wijmo/wijtreemap/jquery.wijmo.wijtreemap.css",
        "../../../../Wijmo/wijpager/jquery.wijmo.wijpager.css",
        "../../../../Wijmo/wijcombobox/jquery.wijmo.wijcombobox.css",
        "../../../../Wijmo/wijinput/jquery.wijmo.wijinput.css",
        "../../../../Wijmo/wijribbon/jquery.wijmo.wijribbon.css",
        "../../../../Wijmo/wijeditor/jquery.wijmo.wijeditor.css",
        "../../../../Wijmo/wijupload/jquery.wijmo.wijupload.css",
        "../../../../Wijmo/wijrating/jquery.wijmo.wijrating.css",
        "../../../../Wijmo/wijsparkline/jquery.wijmo.wijsparkline.css",
        "../../../../Wijmo/wijwizard/jquery.wijmo.wijwizard.css",
        "../../../../Wijmo/wijgrid/jquery.wijmo.wijgrid.css",
		"../../../../Wijmo/wijfileexplorer/jquery.wijmo.wijfileexplorer.css",
		"../../../../Wijmo/wijmaps/jquery.wijmo.wijmaps.css"
    ];

    function addLink(href: string, clazz = "", title = "") {
        var link = <HTMLLinkElement> document.createElement("link");
        link.type = "text/css";
        link.href = href;
        link.rel = "stylesheet";
        link.title = title;
        if (clazz) {
            link.setAttribute("class", clazz);
        }
        document.head.appendChild(link);
    }

    export var allScriptsLoaded = false;
    var allScriptsLoadedHandlers: Function[] = [];
    var loadedScriptCount = 0;
    export function registerScriptLoadHandler(handler: Function) {
        allScriptsLoadedHandlers.push(handler);
    }

    function addScript(src: string) {
        var script = <HTMLScriptElement> document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        script.async = false;
        script.onload = function () {
            loadedScriptCount++;
            allScriptsLoaded = loadedScriptCount == scriptFiles.length;
            if (allScriptsLoaded) {
                for (var j = 0; j < allScriptsLoadedHandlers.length; j++) {
                    allScriptsLoadedHandlers[j]();
                }
            }
        };
        document.head.appendChild(script);
    }

    for (var child = document.head.firstChild; child; child = child.nextSibling) {
        if (child.nodeName.toLowerCase() == "script") {
            var script = <HTMLScriptElement> child;
            script.async = false;
        }
    }

    addLink("http://cdn.wijmo.com/themes/rocket/jquery-wijmo.css", "wijmo-stylesheet-wijmo-theme", "rocket-jqueryui");
    for (var i = 0; i < cssFiles.length; i++) {
        addLink(cssFiles[i]);
    }

    for (var i = 0; i < scriptFiles.length; i++) {
        addScript(scriptFiles[i]);
    }
}

var require = require || function (deps: string[], body: Function) {
    if (!body) return;
    if (wijmo.explorer.allScriptsLoaded) {
        body();
    } else {
        wijmo.explorer.registerScriptLoadHandler(body);
    }
};