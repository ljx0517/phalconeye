var require = require || function (deps, body) {
    body();
};

var expVM;

require(["wijmo.wijutil", "wijmo.wijsuperpanel", "wijmo.wijdialog", "wijmo.wijdropdown", "wijmo.wijtabs", "knockout.wijmo",
    "amplify", "jquery.cookie", "js/ControlList", "js/native.history"], function () {

    // Widget Explorer ViewModel and initialization
    function explorerVM() {
        var self = this;
        self.theme = ko.observable("http://cdn.wijmo.com/themes/aristo/jquery-wijmo.css");
        self.title = ko.observable("Welcome");
        self.info = ko.observable("");
        self.mode = ko.observable("home"); //modes are home, widgets, sample
        self.setMode = function (newMode) {
            if (newMode === 'home') {
                History.pushState({ showall: false }, 'Welcome', "?showall=false");
            } else if (newMode === 'widgets') {
                // Destroy wijupload here in order to prevent SWFUpload JS Error when open another widget sample.
                var wijmoUploads = $.find(".wijmo-wijupload");
                if (wijmoUploads.length > 0) {
                    $.each(wijmoUploads, function (idx, upload) {
                        var $upload = $(upload);
                        if ($upload.data("wijmo-wijupload")) {
                            $upload.wijupload("destroy");
                        }
                    });
                }

                History.pushState({ showall: true }, 'Widgets', "?showall=true");
            }
        };

        self.widgetListObject = ControlList;
        //build array based on ControlList data
        self.widgetList = function () {
            var widgets = [];
            for (var propertyName in self.widgetListObject) {
                self.widgetListObject[propertyName].name = propertyName;
                self.widgetListObject[propertyName].imageUrl = 'images/icons/widget/' + propertyName + '.png';
                widgets.push(self.widgetListObject[propertyName]);
            }
            return widgets;
        }
        //filter widgetList array based isFavorite boolean
        self.widgetFavorites = function () {
            var favs = [];
            $.each(self.widgetList(), function (i, item) {
                if (item.isFavorite === true) {
                    favs.push(item);
                    item.isLastColumn = false;
                    if (favs.length % 4 == 0) {
                        item.isLastColumn = true;
                    }
                }
            });
            return favs;
        };

        self.findWidgetByName = function (name) {
            var widget;
            $.each(self.widgetList(), function (i, item) {
                if (item.name === name) {
                    widget = item;
                }
            });
            return widget;
        };
        self.urlWidgetName = ko.observable("");
        self.currentWidget = ko.computed(function () {
            if (self.urlWidgetName() === "") {
                return;
            }
            else {
                return self.findWidgetByName(self.urlWidgetName());
            }
        });

        //widget selected from list
        self.selectWidget = function (widget) {
            var widgetName = widget.name,
                sampleName = widget.actions[0].name;
            // fixed an issue that the breeze js can't run in bellow IE9.
            if ($.browser.msie && $.browser.version < 9) {
                widget.actions = $.map(widget.actions, function (action) {
                    if (/breezejs/ig.test(action.name)) {
                        return null;
                    }
                    return action;
                })
            }
            History.pushState({ widgetName: widgetName, sampleName: sampleName, needAnimation: false }, widgetName + " " + sampleName, "?widget=" + widgetName + "&sample=" + sampleName);
        };

        self.urlSampleName = ko.observable("");
        self.findSampleByName = function (name) {
            var sample;
            $.each(self.currentWidget().actions, function (i, item) {
                if (item.name === name) {
                    sample = item;
                }
            });
            return sample;
        };
        self.currentSample = ko.computed(function () {
            if (self.urlSampleName() === "") {
                return;
            }
            else {
                return self.findSampleByName(self.urlSampleName());
            }
        });
        self.currentPage = ko.observable("");
        self.sample = ko.observable();
        self.sampleTitle = ko.observable("Overview");
        self.source = ko.observable("");
        //sample selected from list
        self.selectSample = function (sample) {
            var widgetName = self.currentWidget().name,
                sampleName = sample.name;
            History.pushState({ widgetName: widgetName, sampleName: sampleName, needAnimation: true }, widgetName + " " + sampleName, "?widget=" + widgetName + "&sample=" + sampleName);
        };

        //load sample using ajax
        self.loadSample = function (needAnimation) {
            var url, path, pathArray, realPath,
                mainContent = $(".sectionsample .main-content"),
                sampleList = $("#sampleList");
            path = self.currentSample().page;
            pathArray = window.location.href.substring(0, window.location.href.indexOf("explore.html"));
            url = pathArray + "samples/" + path;

            // fixed for the line chart simulate sample issue. it contains timer, but no chance to clear.  
            // use the global dispose for this case.
            if (window["dispose"]) {
                window["dispose"]();
                window["dispose"] = null;
            }

            $.ajax({
                url: url,
                dataType: "html",
                success: function (data) {
                    data = data.replace(/<script.*>.*<\/script>/ig, ""); // Remove script tags
                    data = data.replace(/<link.*>.*<\/link>/ig, ""); // Remove script tags
                    data = data.replace(/<\/?link.*>/ig, ""); //Remove link tags
                    data = data.replace(/<\/?html.*>/ig, ""); //Remove html tag
                    data = data.replace(/<\/?body.*>/ig, ""); //Remove body tag
                    data = data.replace(/<\/?head.*>/ig, ""); //Remove head tag
                    data = data.replace(/<\/?!doctype.*>/ig, ""); //Remove doctype
                    data = data.replace(/<title.*>.*<\/title>/ig, ""); // Remove title tags
                    data = data.replace(/<\/?meta.*>/ig, ""); //Remove link tags

                    var callback = function () {
                        self.sample("");
                        self.sampleTitle("");
                        if ($('#demo-source').length) {
                            $('#demo-source').empty();
                        }

                        mainContent.show();
                        self.currentPage(path);
                        self.sample(data);
                        self.sampleTitle(self.currentSample().name);
                        var source = $.trim(data);
                        var cleanedSource = source
                            .replace('themes/Wijmo/jquery.ui.all.css', 'theme/jquery.ui.all.css')
                            .replace(/\s*\x3Clink.*demos\x2Ecss.*\x3E\s*/, '\r\n\t')
                            .replace(/\x2E\x2E\x2F\x2E\x2E\x2F/g, '');

                        self.source(cleanedSource + "sourcetimestamp" + (+new Date()));


                        self.info($("#SampleContainer .demo-description").html());
                        $("#SampleContainer .container .header").remove();
                        $("#SampleContainer .branding").remove();
                        $("#SampleContainer .footer").remove();
                        $("#SampleContainer link").remove();

                        mainContent.hide().stop().show("fade", 600);
                    }
                    if (needAnimation) {
                        mainContent.stop().hide("fade", 400, callback);
                    }
                    else {
                        callback();
                    }

                },
                error: function (err) {
                    //console.log(err);
                }
            });
        };

    }

    expVM = new explorerVM(),
    isFirstLoad = true;

    //// fixed an issue that the breeze js can't work at bellow IE9
    //(function () {
    //	if ($.browser.msie && $.browser.version < 9) {
    //		return;
    //	}

    //	var loadSample = expVM.loadSample;

    //	expVM.loadSample = function (needAnimation) {
    //		var self = this;
    //		if (!window.breeze) {
    //			$.getScript("http://cdn.wijmo.com/external/breeze.debug.js", function () {
    //				loadSample.apply(self, arguments);
    //			});
    //		}
    //		else {
    //			loadSample.apply(self, arguments);
    //		}
    //	}

    //})()

    //add custom binding for animation.
    if (ko) {
        var prevVal = "";
        ko.bindingHandlers.hisShow = {
            init: function (element, valueAccessor) {
                var va = ko.toJS(ko.utils.unwrapObservable(valueAccessor())),
                    selector = va.selector || "",
                    val = va.value || "",
                    eles;

                if (selector.length) {
                    eles = $(element).find(selector);
                    eles.hide();
                    if (val.length) {
                        prevVal = val;
                        $(".section" + val).show();
                    }
                }

            },
            update: function (element, valueAccessor) {
                var va = ko.toJS(ko.utils.unwrapObservable(valueAccessor())),
                    val = va.value || "",
                    prevEle, ele,
                    doAnimation = function (ele, h, s) {
                        var duration = 200;
                        prevEle.hide('slide', { direction: 'left' }, 400, function () {
                            ele.css({ position: "", left: "", top: "" })
                                .hide();
                            $(".title-bar .padder .button").hide();
                            $("#themes").hide();
                            // workaround for editor can't load content:
                            // after sliding animation, the editor iframe's position changed in
                            // dom tree, then the content of iframe will miss.
                            if ($("#wijeditor").length) {
                                var editorContent = $("#wijeditor").val();
                            }
                            ele.show('slide', { direction: 'right' }, 400, function () {
                                //$(".title-bar").hide();

                                $(".title-bar").show("blind", 400, function () {
                                    $("#themes").show().wijdropdown("refresh")
                                    $(".title-bar .wijmo-wijdropdown").hide();
                                    $(".title-bar .padder .button").show("fade", duration, function () {
                                        if ($("#themes").length) {
                                            $(".title-bar .wijmo-wijdropdown").show("fade", duration, function () {
                                                $(".ribbon>h2").show("fade", duration);
                                            });
                                        }
                                        else {
                                            $(".ribbon>h2").show("fade", duration);
                                        }
                                    });
                                    //								$("#themes").show().wijdropdown("refresh")
                                    //								$(".title-bar .wijmo-wijdropdown").hide();
                                    //								$(".title-bar .padder .button").show("fade", duration);
                                    //								window.setTimeout(function () {
                                    //									$(".title-bar .wijmo-wijdropdown").show("fade", duration);
                                    //								}, 150);
                                    //								window.setTimeout(function () {
                                    //									$(".ribbon>h2").show("fade", duration);
                                    //								}, 300);
                                });

                                // workaround for editor can't load content:
                                // after sliding animation, the editor iframe's position changed in
                                // dom tree, then the content of iframe will miss;
                                // so reset the text of editor
                                setTimeout(function () {
                                    if ($(".wijmo-wijeditor").length && editorContent) {
                                        $("#wijeditor").wijeditor("setText", editorContent);
                                        $("#wijeditor").wijeditor("refresh");
                                    }
                                }, 100);

                            });
                        });
                    };

                if (val.length) {
                    if (prevVal === val) {
                        return;
                    }
                    prevEle = $(".section" + prevVal);
                    ele = $(".section" + val);
                    prevVal = val;
                    if (isFirstLoad) {
                        prevEle.hide();
                        ele.show();
                        $(".ribbon>h2").show();
                        $(".title-bar").show();
                        return;
                    }
                    ele.css({ position: "absolute", left: -1000, top: -1000 })
                        .show();
                    if (prevEle.index() < ele.index()) {
                        doAnimation(ele, "left", "right");
                    } else {
                        doAnimation(ele, "right", "left");
                    }
                }

            }
        };
    }

    //page initialization
    $(function () {
        ko.applyBindings(expVM);

        //fixed list partially cut by superpanel
        $(".sampleList:wijmo-wijsuperpanel").wijsuperpanel("refresh");

        expVM.theme.subscribe(function () {
            $(".wijmo-stylesheet-wijmo-theme").attr("href", expVM.theme());
        });
        expVM.currentWidget.subscribe(function () {
            setTimeout(function () {
                $(".samples:wijmo-wijsuperpanel").wijsuperpanel("refresh");
            }, 100);
        });

        expVM.title.subscribe(function () {
            $(".ribbon>h2").hide();
            if (!isFirstLoad) {
                $(".title-bar").hide();
            }
            //$(".wijmo-stylesheet-wijmo-theme").attr("href", expVM.theme());
        });

        expVM.source.subscribe(function () {
            if ($('#demo-source').length == 0) {
                $('<div id="demo-source"></div>').appendTo('#SourceContainer');
            }

            if ($("#btnFullSize").length == 0) {
                $('<button id="btnFullSize" style="position:absolute"><span class="ui-icon ui-icon-arrow-4-diag"></span></button>')
                .appendTo("#SourceContainer").click(function () {
                    $('#demo-source').clone().wijdialog({
                        title: "Source Code",
                        width: 900,
                        height: 440,
                        modal: true,
                        captionButtons: {
                            pin: { visible: false },
                            refresh: { visible: false },
                            toggle: { visible: false },
                            minimize: { visible: false },
                            maximize: { visible: false }
                        },
                        close: function () {
                            $(this).remove();
                        }
                    }).wijdialog("maximize");
                });
            }
            $('<div class="source-block">' +
                '<pre class="brush:js;gutter: false;toolbar:false;html-script:true">' +
                '</pre></div>').appendTo($('#demo-source'));
            $("#SourceContainer").css({ 'padding': '0', 'height': '440px', 'overflow': 'auto', 'position': "relative" });

            //		var source = expVM.source().replace(/\/\*[\s\S]*\*\//ig, "")
            //						.replace(/\/\/[^\n]*/ig, ""); //remove comment
            var source = expVM.source();
            $('#demo-source>div>pre').text(source.replace(/sourcetimestamp\d+/ig, ''));
            SyntaxHighlighter.highlight();

            $('#SourceContainer').scroll(function (event) {
                var scrollTop = $(this).scrollTop();
                $("#btnFullSize").css("top", scrollTop);
            }).bind("mouseleave", function () {
                $("#btnFullSize").fadeOut();
            }).bind("mouseenter", function () {
                $("#btnFullSize").fadeIn();
            });

            $("#btnFullSize").css({
                top: 0,
                left: 0
            }).hide();
        });

        expVM.sample.subscribe(function () {
            //$(":wijmo-wijdialog").wijdialog("destroy");
            $("#ctl00_WidgetTabs").wijtabs("select", 0);
        });

        var History = window.History;
        if (!History.enabled) {
            return true;
        }
        // Bind to StateChange Event
        History.Adapter.bind(window, 'statechange', function () { // Note: We are using statechange instead of popstate
            var State = History.getState(); // Note: We are using History.getState() instead of event.state
            //History.log(State.data, State.title, State.url);
            $(":wijmo-wijdialog").wijdialog("destroy");
            if (State.data.widgetName != null) {
                expVM.urlWidgetName(State.data.widgetName);
                expVM.title(expVM.currentWidget().name);
            }
            if (State.data.widgetName != null && State.data.sampleName != null) {
                expVM.urlSampleName(State.data.sampleName);
                expVM.title(expVM.currentWidget().name);
                expVM.loadSample(State.data.needAnimation);
                expVM.mode('sample');
                if (!State.data.needAnimation) {
                    $(".sectionsample .main-content").hide();
                }
            }
            if (State.data.showall != null && State.data.showall == true) {
                expVM.title('Widgets');
                expVM.mode('widgets');
            }
            else if (State.data == null ||
            $.isEmptyObject(State.data) ||
            State.data.showall == false) {
                expVM.title('Welcome');
                expVM.mode('home');
            }
        });

        //Check URL params on initial load to jump into widget samples
        //var vars = {};
        //var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        //    vars[key] = value;
        //});

        if (QueryString['widget'] != null) {
            expVM.urlWidgetName(decodeURIComponent(QueryString['widget']));
            if (QueryString['sample'] != null) {
                expVM.urlSampleName(decodeURIComponent(QueryString['sample']));
            }
            else {
                expVM.urlSampleName(expVM.currentWidget().actions[0].name);
            }
            expVM.title(expVM.currentWidget().name);
            expVM.loadSample(false);
            expVM.mode('sample');
        }
        else if (QueryString['showall'] != null && QueryString['showall'] == "true") {
            expVM.title('Widgets');
            expVM.mode('widgets');
        }
        else {
            expVM.title('Welcome');
            expVM.mode('home');
        }

        isFirstLoad = false;
    });
});

QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = "";
    // If open the explore in IE, the location will be added an additional '#'
    // This '#' will cause the query will be stored in the window.location.hash instead of window.location.search.
    if (window.location.search === "") {
        query = window.location.hash.substring(window.location.hash.indexOf("?") + 1);
    } else {
        query = window.location.search.substring(1);
    }
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], pair[1]];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
}();

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-208280-14']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

