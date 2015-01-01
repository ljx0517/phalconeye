// ** wij module
// AngularJS directives for Wijmo components (in addition to the ones provided in angular.wijmo.js and defined in the 'wijmo' module).
// ** requires Wijmo
// <link href="http://cdn.wijmo.com/themes/aristo/jquery-wijmo.css"
//       type="text/css" rel="stylesheet" />
// <link href="http://cdn.wijmo.com/jquery.wijmo-pro.all.3.20131.2.min.css"
//       type="text/css" rel="stylesheet" />
// <script src="http://cdn.wijmo.com/jquery.wijmo-open.all.3.20131.2.min.js" 
//       type="text/javascript"></script>
// <script src="http://cdn.wijmo.com/jquery.wijmo-pro.all.3.20131.2.js" 
//       type="text/javascript"></script>
angular.module("wij", [])

// wij utilities
.factory("wijUtil", function () {
    return {

        // watch for changes in scope variables, call update function when all have been initialized
        watchScope: function (scope, props, updateFn, updateOnTimer, updateOnResize) {

            // watch all variables in the props array, keep count of changes and start
            // calling the update function fn only after all variables have been initialized.
            var cnt = props.length;
            angular.forEach(props, function (prop) {
                scope.$watch(prop, function (value) {

                    // decrement count; when this reaches zero, all scope variables are initialized
                    cnt--;

                    // call update function when count reaches zero (all properties have been initialized)
                    // or when the count is negative and the value is non-null.
                    if (cnt == 0 || (cnt < 0 && value)) {
                        console.log(prop + " changing to " + value);
                        if (updateOnTimer) {
                            if (scope.updateTimeout) clearTimeout(scope.updateTimeout);
                            scope.updateTimeout = setTimeout(updateFn, 50);
                        } else {
                            updateFn();
                        }
                    }
                });
            });

            // call update function when user resizes the window 
            // so the control can resize itself if it wants to.
            if (updateOnResize) {
                $(window).resize(function () {
                    if (scope.resizeTimeout) clearTimeout(scope.resizeTimeout);
                    scope.resizeTimeout = setTimeout(updateFn, 100);
                })
            }
        },

        // set an undefined scope variable to a default value
        setDefVal: function (scope, prop, defaultValue) {
            if (!scope[prop] && scope[prop] != defaultValue) {
                scope[prop] = defaultValue;
                //if (!scope.$$phase) scope.$apply(prop);
            }
        },

        // set an undefined scope variable to a default value
        apply: function (scope, prop, value) {
            if (scope[prop] != value) {
                scope[prop] = value;
                if (!scope.$$phase) scope.$apply(prop);
            }
        }
    }
})

// ** wij-pluralize directive
// - Pluralize directive similar to ng-pluralize, but with simpler markup.
// - Spells out numbers less than or equal to 10 (one, two, three, ..., 11, 12, 13, ...).
// ** example
// <wij-pluralize count="trip.adults" singular="adult" zero="nobody"></wij-pluralize>
// ** see
// - ng-pluralize: http://docs.angularjs.org/api/ng.directive:ngPluralize
.directive("wijPluralize", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            count: "=",     // Quantity to pluralize.
            singular: "@",  // String to use when the count is one (e.g. one 'leaf').
            plural: "@",    // String to use when the count is greater than one (e.g. 42 'leaves').
            zero: "@"       // String to use when the count is zero (e.g. 'empty').
        },
        template: "<span></span>",
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["count", "singular", "plural", "zero"];
            wijUtil.watchScope(scope, arr, updateControl, true);

            function updateControl() {
                var count = parseInt(scope.count);
                if (angular.isNumber(count)) {
                    var text = count < 10
                        ? ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][count]
                        : scope.count;
                    if (count == 0 && scope.zero) {
                        text = scope.zero;
                    } else if (count == 1) {
                        if (scope.singular) text += " " + scope.singular;
                    } else {
                        if (scope.plural) {
                            text += " " + scope.plural;
                        } else if (scope.singular) {
                            text += " " + scope.singular + "s";
                        }
                    }
                    element.text(text);
                }
            }
        }
    }
} ])

// ** wij-progressbar directive
// - Provides visual feedback to indicate a process is active.
// ** example
// <wij-progressbar indeterminate="true" ng-show="isLoading"></wij-progressbar>
// ** see
// - Wijmo progress bar: http://wijmo.com/wiki/index.php/Progressbar#API
.directive("wijProgressbar", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {
            indeterminate: "@",     // Whether the progress bar is indeterminate (should show animation but no percentages).
            value: "@"              // Percentage complete (between zero and 100).
        },
        template: "<div></div>",
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["indeterminate", "value"];
            wijUtil.watchScope(scope, arr, updateControl, true, true);

            function updateControl() {

                // handle indeterminate progress
                var value = scope.value ? scope.value * 1 : 0;
                var indeterminate = scope.indeterminate && scope.$eval(scope.indeterminate) == true;
                if (indeterminate) {
                    scope.value = (value + 4) % 100;
                    setTimeout(updateControl, 200);
                }

                // create widget
                var options = {
                    value: scope.value ? scope.value * 1 : 0,
                    labelFormatString: indeterminate ? "" : "{1}%"
                };
                element.wijprogressbar(options);
            }
        }
    };
} ])

// ** wij-chart directive
// - Shows charts of different types.
// - Implemented using the wijmo chart widgets.
// - Uses a simple data format common to all chart types.
// ** example
// <wij-chart 
//   class="span10" height="600"
//   type="{{chartType}}"
//   data="chartData"
//   min="0" 
//   title-x="Airport"
//   title-y="Pax (millions)" >
// </wij-chart>
// ** see
// - Wijmo: http://wijmo.com
// - Wijmo line chart: http://wijmo.com/wiki/index.php/Linechart#API
// - Wijmo bar chart: http://wijmo.com/wiki/index.php/Barchart#API
// - Wijmo pie chart: http://wijmo.com/wiki/index.php/Piechart#API
.directive("wijChart", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        template: "<div></div>",
        replace: true,
        scope: {
            type: "@",          // Chart type: area, bar, bubble, column, line, pie, or scatter.
            titleX: "@",        // Title for the X (category) axis.
            titleY: "@",        // Title for the Y (value) axis.
            min: "@",           // Minimum value to show on the Y axis.
            max: "@",           // Maximum value to show on the Y axis.
            interval: "@",      // Interval between grid lines.
            legend: "@",        // Whether to show a legend (by default, a legend is shown if there are more than one series).
            width: "@",         // Width of the chart in pixels.
            height: "@",        // Height of the chart in pixels.
            data: "="           // Chart data: an array of arrays; the first column contains the x values and the remaining columns contain one series each (for most chart types).
        },
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["type", "titleX", "titleY", "min", "max", "interval", "legend", "data", "width", "height"];
            wijUtil.watchScope(scope, arr, updateControl, true, true);

            // keep track of chart widget
            var chart = null;

            // update the control
            function updateControl() {

                // remove the previous chart, if any
                // (because we may be attaching a new one of different type to the element)
                if (chart) {
                    chart.destroy();
                    chart = null;
                }

                // get the data
                var data = scope.data;
                if (typeof (data) == "string") data = scope.$eval(data);
                if (data == null) return;

                // get chart type
                var chartType = scope.type ? scope.type : "line";

                // figure out whether to show a legend
                var legendVisible =
                    scope.legend ? scope.legend :
                    chartType == "pie" ? true :
                    data[0].length > 2 ? true : false;

                // set chart options
                var fontSize = element.css("fontSize");
                var textStyle = { "font-size": fontSize, "font-weight": "normal", fill: "black" }; // REVIEW: can I add a margin to the axis titles/labels?
                var options = {
                    seriesStyles: getStyleList(),
                    textStyle: textStyle,
                    animation: { enabled: false },
                    seriesTransition: { enabled: false },
                    legend: { visible: legendVisible, textStyle: textStyle },
                    clusterWidth: 50,
                    hint: {
                        enable: true,
                        contentStyle: { fill: "black" }, // foreground
                        style: { fill: "white", "fill-opacity": .9} // background
                    },
                    axis: {
                        x: {
                            text: scope.titleX,
                            textStyle: textStyle,
                            labels: { style: textStyle },
                            gridMajor: { visible: false }
                        },
                        y: {
                            text: scope.titleY,
                            textStyle: textStyle,
                            labels: { style: textStyle },
                            gridMajor: { visible: true, style: { opacity: 0.3} }
                        }
                    }
                };

                // add options to adjust for chart type
                if (chartType == "area") options.type = "area";
                if (chartType == "column") options.horizontal = false;
                if (chartType == "pie") {
                    options.showChartLabels = true;
                    options.textStyle = { fill: "white", "font-size": fontSize }; // REVIEW: should use element font size by default. disableDefaultTextStyle doesn't seem to do anything? Camel casing doesn't work for font-size???
                    options.hint.content = function () { // REVIEW: should allow html (would not need Title, TitleStyle)
                        return this.label + ":\n  " + this.value + "\n  (" + Globalize.format(this.value / this.total, "p0") + ")"; // pie slice
                    };
                } else {
                    options.showChartLabels = false;
                    options.hint.content = function () {
                        return this.x + "\n" + this.label + ": " + Globalize.format(this.y, "n0");
                    };
                }

                // set y-axis properties
                options.axis.y.annoFormatString = "n0";
                options.axis.y.unitMajor = scope.interval ? scope.interval * 1 : getInterval(data); // REVIEW: default interval is too small
                options.axis.y.autoMajor = false; // REVIEW: should not be necessary
                if (scope.min) {
                    options.axis.y.min = scope.min * 1;
                    options.axis.y.autoMin = false; // REVIEW: should not be necessary (could eliminate all auto* properties!!!)
                }
                if (scope.max) {
                    options.axis.y.max = scope.max * 1;
                    options.axis.y.autoMax = false; // REVIEW: should not be necessary
                }

                // set chart size
                if (scope.width) options.width = scope.width;
                if (scope.height) options.height = scope.height;

                // set chart data
                options.seriesList = chartType != "pie"
                    ? getSeriesList(data, chartType == "bar")
                    : getPieSeriesList(data);

                // create the chart
                var el = $(element[0]);
                switch (chartType.toLowerCase()) {
                    case "line":
                    case "area":
                        el.wijlinechart(options);
                        chart = el.data().wijlinechart;
                        break;
                    case "bar":
                    case "column":
                        el.wijbarchart(options);
                        chart = el.data().wijbarchart;
                        break;
                    case "bubble":
                        el.wijbubblechart(options);
                        chart = el.data().wijbubblechart;
                        break;
                    case "pie":
                        el.wijpiechart(options);
                        chart = el.data().wijpiechart;
                        break;
                    case "scatter":
                        el.wijscatterchart(options);
                        chart = el.data().wijscatterchart;
                        break;
                    default:
                        throw "unknown chart type: " + chartType;
                }
            }
            function getInterval(data) {

                // get actual max/min values
                var mx = null, mn = null;
                for (var i = 0; i < data.length; i++) {
                    for (var j = 1; j < data[i].length; j++) {
                        var val = data[i][j];
                        if (typeof (val) == "number") {
                            if (!mx || val > mx) mx = val;
                            if (!mn || val < mn) mn = val;
                        }
                    }
                }

                // honor scope values
                if (scope.max) mx = scope.max * 1;
                if (scope.min) mn = scope.min * 1;

                // calculate interval based on delta
                var delta = (mx - mn).toFixed(0);
                return mx != null && mn != null && mx - mn > 1
                    ? delta[0] * Math.pow(10, delta.length - 1) / 4
                    : (mx - mn) / 4;
            }
            function getSeriesList(data, reverse) {

                // guess whether the first row contains data or series names:
                // if the first element in the second column is not a string, then
                // the first row probably contains data...
                var firstRowIsNames = typeof (data[0][1]) == "string";
                var firstIndex = firstRowIsNames ? 1 : 0;

                var list = [];
                for (var column = 1; column < data[0].length; column++) {
                    var series = {
                        data: { x: [], y: [] }
                    };
                    if (firstRowIsNames) {
                        series.label = data[0][column];
                        series.legendEntry = true;
                    }
                    if (reverse) {
                        for (var i = data.length - 1; i >= firstIndex; i--) {
                            series.data.x.push(data[i][0]);
                            series.data.y.push(data[i][column]);
                        }
                    } else {
                        for (var i = firstIndex; i < data.length; i++) {
                            series.data.x.push(data[i][0]);
                            series.data.y.push(data[i][column]);
                        }
                    }
                    list.push(series);
                }
                return list;
            }
            function getPieSeriesList(data) {

                // guess whether the first row contains data or series names:
                // if the first element in the second column is not a string, then
                // the first row probably contains data...
                var firstRowIsData = typeof (data[0][1]) != "string";
                var firstIndex = firstRowIsData ? 0 : 1;

                // build series list for pie chart (each slice is a different series)
                var list = [];
                for (var i = firstIndex; i < data.length; i++) {
                    list.push({
                        label: data[i][0],
                        data: data[i][1],
                        offset: 10,
                        legendEntry: true
                    });
                }
                return list;
            }
            function getStyleList() {
                var arr = [
                    "#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#0099C6", "#DD4477", "#66AA00",
                    "#B82E2E", "#316395", "#994499", "#22AA99", "#AAAA11", "#6633CC", "#E67300", "#8B0707",
                    "#40699C", "#9E413E", "#7F9A48", "#695185", "#3C8DA3", "#CC7B38", "#4F81BD", "#C0504D",
                    "#9BBB59", "#8064A2", "#4BACC6", "#F79646", "#AABAD7", "#D9AAA9", "#C6D6AC", "#BAB0C9"
                ];
                var list = [];
                for (var i = 0; i < arr.length; i++) {
                    list.push({
                        stroke: arr[i], "stroke-opacity": 1, "stroke-width": 3, // REVIEW: camel-case doesn't work?
                        fill: arr[i], "fill-opacity": 0.8,
                        opacity: .9 // overall opacity
                    });
                }
                return list;
            }
        }
    }
} ])

// ** wij-bullet directive
// - Implements a bullet graph as described in Stephen Few's "Information Dashboard Design" book.
// - The chart consists of bars that show different performance levels as well as target and actual values.
// - Implemented using the wijlineargauge widget.
// ** example
// <wij-bullet
//   actual="{{ap.vol2011/1000000}}"
//   poor="5" satisfactory="15" good="18" target="20" max="50" ></wij-bullet>
// ** see
// - Bullet graph design spec: http://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf
// - Stephen Few's book: http://www.amazon.com/Information-Dashboard-Design-Effective-Communication/dp/0596100167
// - Wijmo: http://wijmo.com
// - Wijmo linear gauge: http://wijmo.com/wiki/index.php/Lineargauge#API
.directive("wijBullet", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        scope: {
            good: "@",              // Level considered good.
            satisfactory: "@",      // Level considered satisfactory (less than good).
            poor: "@",              // Level considered poor (less than satisfgatory).
            actual: "@",            // Actual level.
            target: "@",            // Target level.
            max: "@"                // Maximum value to use for scaling the bullet graph.
        },
        template:
            "<div style='display:inline' ></div>",
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["good", "satisfactory", "poor", "actual", "target", "max"];
            wijUtil.watchScope(scope, arr, updateControl, true, false);

            // update the control
            function updateControl() {

                // build options
                var options = {
                    value: scope.target * 1,
                    min: 0,
                    max: scope.max * 1,
                    animation: { enabled: false },
                    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,
                    pointer: { length: 1, shape: "rect", style: { fill: "black", stroke: "none"} },
                    face: { style: { fill: "none", stroke: "none"} },
                    labels: { visible: false },
                    tickMajor: { visible: false },
                    tickMinor: { visible: false },
                    ranges: [
                        createRange(scope.good, 0.1),
                        createRange(scope.satisfactory, 0.2),
                        createRange(scope.poor, 0.4),
                        createRange(scope.actual, 0.95, true)
                    ]
                };

                // set default size
                options.width = element.width() > 0 ? element.width() : 300;
                options.height = element.height() > 0 ? element.height : 16;

                // build widget
                element.wijlineargauge(options);
            }
            function createRange(value, opacity, center) {
                var range = {
                    startValue: 0,
                    endValue: value * 1,
                    startWidth: 1, endWidth: 1,
                    startDistance: 1, endDistance: 1,
                    style: { fill: 'grey', stroke: 'none', opacity: opacity * 1 }
                };
                if (center) {
                    range.startWidth = 0.3;
                    range.endWidth = 0.3;
                    range.startDistance = 0.65;
                    range.endDistance = 0.65;
                }
                return range;
            }
        }
    };
} ])
// ** wij-bullet-legend directive
// - Shows a static legend describing the meaning of the bullet graph ranges
// ** example
// <wij-bullet-legend class="text-info text-right" style="float:right"></wij-bullet-legend>
.directive("wijBulletLegend", function () {
    return {
        restrict: "E",
        template:
            "<div>" +
            "<span style='background:rgba(0,0,0,1)'>&nbsp;</span> Target &nbsp;&nbsp;" +
            "<span style='background:rgba(0,0,0,0.95)'>&nbsp;&nbsp;</span> Actual &nbsp;&nbsp;" +
            "<span style='background:rgba(0,0,0,0.4)'>&nbsp;&nbsp;&nbsp;</span> Poor &nbsp;&nbsp;" +
            "<span style='background:rgba(0,0,0,0.2)'>&nbsp;&nbsp;&nbsp;</span> Satisfactory &nbsp;&nbsp;" +
            "<span style='background:rgba(0,0,0,0.1)'>&nbsp;&nbsp;&nbsp;</span> Good" +
            "</div>"
    }
})

// ** wij-gauge directive
// - Shows a streamlined radial gauge with min, max, and actual value.
// - Implemented using the wijradialgauge widget.
// ** example
// <wij-gauge 
//     value="{{product.sales.qThis}}"
//     max="{{product.sales.max}}"
//     fill="red" gauge="#e0e0e0"
//     target-value="{{product.levels.target}}" target-fill="green" >
//     </wij-gauge>
// ** see
// - Wijmo: http://wijmo.com
// - Wijmo radial gauge chart: http://wijmo.com/wiki/index.php/Radialgauge#API
.directive("wijGauge", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        scope: {
            value: "@",             // Value indicated by the gauge pointer.
            min: "@",               // Gauge minimum (start) value.
            max: "@",               // Gauge maximum (end) value.
            gauge: "@",             // Color of the gauge display.
            fill: "@",              // Color of the filled area (from 'start' to 'value').
            stroke: "@",            // Color of the gauge outline.
            targetValue: "@",       // Target value for the gauge.
            targetFill: "@",        // Color of the filled area if 'value' is equal to or greater than 'targetValue'.
            showLimits: "@",        // Whether to show the minimum and maximum values below the gauge.
            width: "@"              // Gauge width in pixels.
        },
        template: "<div></div>",
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["value", "min", "max", "gauge", "fill", "stroke", "targetValue", "targetFill", "showLimits", "width"];
            wijUtil.watchScope(scope, arr, updateControl, true, true);

            // update the control
            function updateControl() {

                // initialize scope variables
                wijUtil.setDefVal(scope, "min", 0);
                wijUtil.setDefVal(scope, "max", 100);
                wijUtil.setDefVal(scope, "value", 0);

                // use targetFill if value >= targetValue
                var rangeFill = scope.targetValue && scope.targetFill && scope.value * 1 >= scope.targetValue * 1
                    ? scope.targetFill
                    : scope.fill;

                // honor showLimits
                var showLimits = scope.showLimits == null || scope.$eval(scope.showLimits) == true;

                // set width
                var width = scope.width ? scope.width * 1 : element.width();
                if (width == 0) width = 200;

                // build options
                var options = {
                    min: scope.min * 1,
                    max: scope.max * 1,
                    value: scope.value * 1,
                    ranges: [
                        createRange(scope.min, scope.max, scope.gauge, scope.stroke, width / 4),
                        createRange(scope.min, scope.value, rangeFill, "none", width / 4)
                    ],
                    animation: { enabled: false },
                    pointer: { visible: false },
                    cap: { visible: false },
                    face: { style: { fill: "none", stroke: "none"} },
                    labels: { visible: false },
                    tickMajor: { visible: false },
                    tickMinor: { visible: false },
                    width: width, height: width,
                    marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0
                };

                // show target value marker 
                var foreColor = element.css("color");
                if (scope.targetValue) {
                    var val = scope.targetValue * 1;
                    var range = createRange(val * 1.01, val * .99, foreColor, foreColor, width / 10);
                    options.ranges.push(range);
                }

                // build widget
                element.wijradialgauge(options);

                // get canvas to add annotations (min/max/value)
                var canvas = element.wijradialgauge("getCanvas");
                var fs = width / 12;
                var ff = element.css("font-family");
                var y = canvas.height / 2 + fs / 2 + 3;

                // show current value
                canvas.text(width / 2, y - fs, Globalize.format(scope.value * 1, 'n0'))
                .attr({ "font-family": ff, "font-size": fs * 2, "fill": foreColor });

                // show limits
                var showLimits = scope.showLimits ? scope.$eval(scope.showLimits) : true;
                if (showLimits) {

                    canvas.text(width / 8, y, Globalize.format(scope.min * 1, 'n0'))
                    .attr({ "font-family": ff, "font-size": fs, "fill": foreColor });

                    canvas.text(width / 8 * 7, y, Globalize.format(scope.max * 1, 'n0'))
                    .attr({ "font-family": ff, "font-size": fs, "fill": foreColor });
                }
            }
            function createRange(start, end, fill, stroke, width) {
                var range = {
                    startValue: start * 1,
                    endValue: end * 1,
                    startWidth: width,
                    endWidth: width,
                    startDistance: 0,
                    endDistance: 0,
                    style: {
                        fill: fill,
                        stroke: stroke
                    }
                };
                return range;
            }
        }
    }
} ])

// ** wij-autocomplete directive
// - Input element with auto-complete (shows list as the user types)
// - Implemented using the jQuery autocomplete widget.
// ** example
// <wij-autocomplete
//   value="trip.from" 
//   min-length="2"
//   source-fn="taSource">
// </wij-autocomplete>
// ** see
// - jQuery autocomplete: http://api.jqueryui.com/autocomplete
.directive("wijAutocomplete", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        replace: true,
        template: "<input />",
        scope: {
            value: "=",         // Current value.
            source: "@",        // List of valid choices (array of <code>{ value, label }</code> objects).
            minLength: "@",     // Minimum length of input to start looking for matches.
            sourceFn: "&"       // Source function (takes two arguments, 'request' and 'response').
        },
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["value", "source", "minLength"];
            wijUtil.watchScope(scope, arr, updateControl);

            // update control
            function updateControl() {

                // initialize scope variables
                wijUtil.setDefVal(scope, "minLength", 2);
                element.val(scope.value);

                // build options object
                // a complete options available can be found here:
                // http://api.jqueryui.com/autocomplete/#method-search
                var options = {
                    source: getSource(),
                    minLength: scope.minLength,
                    select: function (e, args) {
                        wijUtil.apply(scope, "value", args.item.value);
                    }
                };

                // create auto-complete widget with given options
                element.autocomplete(options);

                // render items in drop-down as html
                // http://stackoverflow.com/questions/3488016/using-html-in-jquery-ui-autocomplete
                element.data("autocomplete")._renderItem = function (ul, item) {
                    return $("<li></li>")
                        .data("item.autocomplete", item)
                        .append("<a>" + item.label + "</a>")
                        .appendTo(ul);
                }
            }
            function getSource() {
                if (scope.sourceFn()) return scope.sourceFn();
                if (scope.source) return typeof (scope.source) == "string" ? scope.$eval(scope.source) : scope.source;
                return null;
            }
        }
    }
} ])

// ** wij-combobox directive
// - Input element with auto-complete (shows list as the user types)
// - Implemented using the Wijmo wijcombobox widget.
// ** example
// <wij-combobox 
//   value="trip.from" 
//   source="comboItems" >
// </wij-combobox>
// ** see
// - Wijmo wijcombobox: http://wijmo.com/wiki/index.php/Combobox#API
.directive("wijCombobox", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        replace: true,
        template: "<input/>",
        scope: {
            value: "=",     // Current value.
            source: "="     // List of valid choices (array of <code>{ value, label }</code> objects).
        },
        link: function (scope, element, attrs) {

            // update the control when scope parameters are updated
            scope.$watch("source", function () {
                updateControl();
            });

            // update element value when scope changes (no need to re-create widget)
            scope.$watch("value", function (newValue) {
                element.wijcombobox({ text: newValue });
                //element.val(newValue); // also works...
            });

            // update control
            function updateControl() {

                // build options object
                var options = {
                    text: scope.value,
                    data: scope.source,
                    changed: function (event, args) {
                        if (args.selectedItem) {
                            wijUtil.apply(scope, "value", args.selectedItem.label);
                        }
                    }
                };

                // create combobox widget with given options
                element.wijcombobox(options);
            }
        }
    }
} ])

// ** wij-inputnumber directive
// - Numeric input with range-checking and spinners.
// - Implemented using the Wijmo wijinputnumber widget.
// ** example
//  <wij-inputnumber value="trip.adults" max="5" >
// </wij-inputnumber>
// ** see
// - Wijmo wijinputnumber: http://wijmo.com/wiki/index.php/Inputnumber#API
.directive("wijInputnumber", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        replace: true,
        template: "<input>",
        scope: {
            value: "=",             // Numeric value editable by the user.
            min: "@",               // Minimum acceptable value (defaults to zero).
            max: "@",               // Maximum acceptable value (defaults to 1000000000).
            decimalPlaces: "@",     // Number of decimal places to show (defaults to zero).
            groupSeparators: "@",   // Whether to show thousand separators (defaults to true).
            spinner: "@",           // Whether to show spinner buttons (defaults to true).
            increment: "@"          // Increment applied by the spinner buttons (defaults to one).
        },
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["min", "max", "decimalPlaces", "groupSeparators", "spinner", "increment"];
            wijUtil.watchScope(scope, arr, updateControl);

            // update element value when scope changes (no need to re-create widget)
            scope.$watch("value", function (value) {
                element.wijinputnumber({ value: value });
                //element.val(value); // also works...
            });

            // update the control
            function updateControl() {

                // apply defaults
                wijUtil.setDefVal(scope, "min", 0);
                wijUtil.setDefVal(scope, "max", 1000000000);
                wijUtil.setDefVal(scope, "decimalPlaces", 0);
                wijUtil.setDefVal(scope, "groupSeparators", "true");
                wijUtil.setDefVal(scope, "spinner", "true");
                wijUtil.setDefVal(scope, "increment", 1);

                // create widget
                var options = {
                    value: scope.value,
                    decimalPlaces: scope.decimalPlaces * 1,
                    increment: scope.increment * 1,
                    minValue: scope.min * 1,
                    maxValue: scope.max * 1,
                    showGroup: scope.$eval(scope.groupSeparators),
                    showSpinner: scope.$eval(scope.spinner),
                    valueChanged: function (e, args) {
                        wijUtil.apply(scope, "value", args.value);
                    }
                };
                element.wijinputnumber(options);
            };
        }
    }
} ])

// ** wij-inputdate directive
// - Date input with a month calendar drop-down.
// - Implemented using the Wijmo wijinputdate widget.
// ** example
// <wij-inputdate value="trip.returnDate" minDate="{{trip.departDate}}">
// </wij-inputdate>
// ** see
// - Wijmo wijinputdate: http://wijmo.com/wiki/index.php/InputDate#API
.directive("wijInputdate", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        replace: true,
        template: "<input>",
        scope: {
            value: "=",     // Current value (selected date).
            minDate: "@",   // Minimum date that can be selected.
            maxDate: "@",   // Maximum date that can be selected.
            format: "@",    // Format used to display the date ("d" by default, short date). See the <a href="http://wijmo.com/wiki/index.php/InputDate#API">wijinputdate documentation for more options.</a>)
            dropDown: "@"   // Whether to show a drop-down calendar (true by default).
        },
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["minDate", "maxDate", "format", "dropDown"];
            wijUtil.watchScope(scope, arr, updateControl);

            // update element value when scope changes (no need to re-create widget)
            scope.$watch("value", function (value) {
                element.wijinputdate({ date: value });
                //element.val(value); // also works...
            });

            // update the control
            function updateControl() {

                // initialize scope variables
                wijUtil.setDefVal(scope, "format", "d");
                wijUtil.setDefVal(scope, "dropDown", "true");

                var options = {
                    date: scope.value,
                    dateFormat: scope.format,
                    showTrigger: scope.$eval(scope.dropDown),
                    dateChanged: function (e, args) {
                        wijUtil.apply(scope, "value", args.date);
                    }
                };
                if (scope.minDate) options.minDate = new Date(scope.$eval(scope.minDate));
                if (scope.maxDate) options.maxDate = new Date(scope.$eval(scope.maxDate));
                element.wijinputdate(options);
            }
        }
    }
} ])

// ** wij-checkbox directive
// - Check-box widget.
// - Implemented using the Wijmo wijcheckbox widget.
// ** example
// <label><wij-checkbox click="toggleTripExtra(1)" checked="{{getTripExtra(1)}}"></wij-checkbox> Hotel</label>
// <label><wij-checkbox click="toggleTripExtra(2)" checked="{{getTripExtra(2)}}"></wij-checkbox> Car</label>
// <label><wij-checkbox click="toggleTripExtra(4)" checked="{{getTripExtra(4)}}"></wij-checkbox> Insurance</label>
// ** see
// - Wijmo wijcheckbox: http://wijmo.com/wiki/index.php/CheckBox#API
.directive("wijCheckbox", function () {
    return {
        restrict: "E",
        replace: true,
        template: "<input type='checkbox'>",
        scope: {
            checked: "@",   // Gets a value that determines whether the checkbox is currently checked.
            click: "&"      // Function called when the user changes the value of the checkbox.
        },
        link: function (scope, element, attrs) {

            // update the control when scope parameters are updated
            scope.$watch("checked", updateControl);

            // fire click event
            element.click(function () {
                if (scope.click) scope.click();
            });

            // update the control
            function updateControl() {

                // destroy old widget if any
                if (element.data().wijcheckbox) {
                    element.data().wijcheckbox.destroy();
                }

                // create/re-create widget
                var options = { checked: scope.$eval(scope.checked) };
                element.wijcheckbox(options);
            }
        }
    }
})

// ** wij-radio directive
// - Radio button widget.
// - Implemented using the Wijmo wijradio widget.
// ** example
// <label><wij-radio name="tc" click="setTripClass('economy')" checked="{{trip.class=='economy'}}"></wij-radio> Economy</label>
// <label><wij-radio name="tc" click="setTripClass('business')" checked="{{trip.class=='business'}}"></wij-radio> Business</label>
// <label><wij-radio name="tc" click="setTripClass('first')" checked="{{trip.class=='first'}}"></wij-radio> First</label>
// ** see
// - Wijmo wijradio: http://wijmo.com/wiki/index.php/Radio#API
.directive("wijRadio", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        replace: true,
        template: "<input type='radio' name='{{name}}'>",
        scope: {
            checked: "@",   // Gets a value that determines whether the radio button is currently checked.
            click: "&",     // Function called when the user changes the value of the radio button.
            name: "@"       // Name of the group that this radio button belongs to.
        },
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["checked", "click", "name"];
            wijUtil.watchScope(scope, arr, updateControl);

            // update the control
            function updateControl() {

                // destroy old widget if any
                if (element.data().wijradio) {
                    element.data().wijradio.destroy();
                }

                // create/re-create widget
                var options = {
                    checked: scope.$eval(scope.checked),
                    changed: function (e, args) {
                        if (scope.click) scope.click(e, args);
                    }
                };
                element.wijradio(options);
            }
        }
    }
} ])

// ** wij-slider directive
// - Slider widget used to visually edit numeric values.
// - Implemented using the Wijmo wijslider widget.
// ** example
// <wij-slider 
//   value="trip.adults" 
//   min="0" max="5" >
// </wij-slider>
// ** see
// - Wijmo wijradio: http://wijmo.com/wiki/index.php/Slider
.directive("wijSlider", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        replace: true,
        template: "<div></div>",
        scope: {
            value: "=",     // Current value displayed on the slider.
            min: "@",       // Minimum value on the slider.
            max: "@"        // Maximum value on the slider.
        },
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["value", "min", "max"];
            wijUtil.watchScope(scope, arr, updateControl);

            // update the control
            function updateControl() {

                // set default values
                wijUtil.setDefVal(scope, "min", 0);
                wijUtil.setDefVal(scope, "max", 100);

                // create widget
                var options = {
                    min: scope.min * 1,
                    max: scope.max * 1,
                    value: scope.value * 1,
                    change: function (e, args) {
                        wijUtil.apply(scope, "value", args.value);
                    }
                };
                element.wijslider(options);
            }
        }
    }
} ])

// ** wij-grid directive
// - Simple data grid with sorting and grouping.
// - Implemented using the Wijmo wijgrid widget.
// ** example
// <wij-grid 
//   style="height:400px;overflow:scroll;"
//   data="airports"
//   frozen-columns="1">
//   <wij-grid-column binding="city"></wij-grid-column>
//   <wij-grid-column binding="state" width="80" aggregate="count" 
//     group="true" group-header="{0}: {2} airport(s)"></wij-grid-column>
//   <wij-grid-column binding="vol2011" header="Traffic" 
//     format="n0" width="100" aggregate="sum"></wij-grid-column>
// </wij-grid>
// ** see
// - Wijmo wijgrid: http://wijmo.com/wiki/index.php/Grid#API
//.directive("wijGrid", ["wijUtil", function (wijUtil) {
//    return {
//        restrict: "E",
//        replace: true,
//        transclude: true,
//        template: "<table ng-transclude/>",
//        scope: {
//            data: "=",          // List of items to bind to.
//            allowWrapping: "@", // Whether text in grid cells should be allowed to wrap within cells.
//            frozenRows: "@",    // Number of non-scrollable rows
//            frozenColumns: "@"  // Number of non-scrollable columns
//        },
//        controller: ["$scope", function ($scope) {
//            $scope.columns = [];
//            this.addColumn = function (column) {
//                $scope.columns.push(column);
//            }
//        } ],
//        link: function (scope, element, attrs) {

//            // listen to changes in attributes and update the control
//            var arr = ["allowWrapping", "frozenRows", "frozenColumns"];
//            wijUtil.watchScope(scope, arr, updateControl, true, false);

//            // update the control when column properties are updated
//            var arr = ["binding", "header", "format", "width", "aggregate", "group", "groupHeader"];
//            for (var i = 0; i < scope.columns.count; i++) {
//                wijUtil.watchScope(scope.columns[i], arr, updateControl, true, false);
//            }

//            // refresh the control on data changes
//            scope.$watch("data", function () {
//                var grid = element.data().wijgrid;
//                if (grid != null) {
//                    grid.ensureControl(false);
//                }
//            }, true);

//            // update the control
//            function updateControl() {

//                // destroy old widget if any
//                if (element.data().wijgrid) {
//                    element.data().wijgrid.destroy();
//                }

//                // get grid data
//                var data = scope.data;
//                if (typeof (data) == "string") data = scope.$eval(data);

//                // get grid columns
//                var columns = getColumns();

//                // create widget
//                var options = {

//                    // specify data source, columns
//                    data: data,
//                    columns: columns,

//                    // set frozen rows/columns
//                    staticColumnIndex: scope.frozenColumns ? scope.frozenColumns * 1 - 1 : -1,
//                    staticRowIndex: scope.frozenRows ? scope.frozenRows * 1 - 1 : -1,

//                    // customize cells
//                    cellStyleFormatter: function (args) {

//                        // add some left padding
//                        args.$cell.css("padding-left", "4px");

//                        // honor word-wrap attribute
//                        if (!scope.wordWrap || scope.$eval(scope.wordWrap) == false) {
//                            args.$cell.css("white-space", "nowrap");
//                        }

//                        // use bold in group headers and column headers
//                        if ((args.row.type & 17) != 0) { // 1: column header, 16: group row
//                            args.$cell.css("font-weight", "bold");
//                        }
//                    },

//                    // use header style for group headers
//                    rowStyleFormatter: function (args) {
//                        if ((args.type & 16) != 0) { // 16: group row
//                            args.$rows.addClass("ui-widget-header");
//                        }
//                    },

//                    // default settings for this directive
//                    columnsAutogenerationMode: columns && columns.length > 0 ? "none" : "append",
//                    allowSorting: true,
//                    allowColSizing: true,
//                    allowColMoving: true,
//                    allowVirtualScrolling: true,  // always virtualize (very important for performance!)
//                    scrollMode: "auto",           // note: doesn't work well with overflow:auto
//                    allowKeyboardNavigation: true,
//                    ensureColumnsPxWidth: true,
//                    highlightCurrentCell: true
//                };
//                element.wijgrid(options);
//            }

//            function getColumns() {
//                var cols = [];
//                if (scope.columns) {
//                    for (var i = 0; i < scope.columns.length; i++) {
//                        var col = {};
//                        var c = scope.columns[i];
//                        col.dataKey = c.binding,
//                        col.headerText = c.header
//                            ? c.header
//                            : c.binding.charAt(0).toUpperCase() + c.binding.slice(1);
//                        if (c.format) {
//                            col.dataFormatString = c.format;
//                            col.dataType = scope.data && scope.data.length > 0 && angular.isDate(scope.data[0][c.binding])
//                                ? "datetime"
//                                : "number";
//                        }
//                        if (c.width) col.width = c.width * 1;
//                        if (c.aggregate) col.aggregate = c.aggregate;
//                        if (c.group) {
//                            col.groupInfo = {
//                                position: "header",
//                                outlineMode: c.group.toLowerCase() == "startCollapsed" ? "startCollapsed" : "startExpanded",
//                                headerText: c.groupHeader ? c.groupHeader : "{1}: {0}"
//                            }
//                        }
//                        cols.push(col);
//                    }
//                }
//                return cols;
//            }
//        }
//    }
//} ])
// ** wij-grid-column directive
// - Represents a column in a wij-grid directive.
// ** example
// <wij-grid 
//   style="height:400px;overflow:scroll;"
//   data="airports"
//   frozen-columns="1">
//   <wij-grid-column binding="city"></wij-grid-column>
//   <wij-grid-column binding="state" width="80" aggregate="count" 
//     group="true" group-header="{0}: {2} airport(s)"></wij-grid-column>
//   <wij-grid-column binding="vol2011" header="Traffic" 
//     format="n0" width="100" aggregate="sum"></wij-grid-column>
// </wij-grid>
// ** see
// - Wijmo wijgrid: http://wijmo.com/wiki/index.php/Grid#API
//.directive("wijGridColumn", function () {
//    return {
//        require: "^wijGrid",
//        restrict: "E",
//        replace: true,
//        template: "<div/>",
//        scope: {
//            binding: "@",       // Property shown in this column.
//            header: "@",        // Column header content.
//            format: "@",        // Format used to display numeric values in this column.
//            width: "@",         // Column width in pixels.
//            aggregate: "@",     // Aggregate to display in group header rows for this column ("none", "count", "sum", "average", "min", "max", "std", "stdPop", "var", "varPop", or "custom").
//            group: "@",         // Whether items should be grouped by the values in this column.
//            groupHeader: "@"    // Text to display in the group header rows ("{0}", "{1}", and "{2}" are replaced with the value being grouped on, the column header, and the aggregate value).
//        },
//        link: function (scope, element, attrs, wijGrid) {
//            wijGrid.addColumn(scope);
//        }
//    }
//})

// ** wij-menu directive
// - Creates a menu composed of a hierarchical list of wij-menu-item elements.
// ** example
// <wij-menu>
//   <wij-menu-item header="Navigate" >
//     <wij-menu-item header="Home"  href="#/home"></wij-menu-item>
//     <wij-menu-item header="Input" href="#/wijmo/input"></wij-menu-item>
//     <wij-menu-separator></wij-menu-separator>
//     <wij-menu-item header="Commands">
//       <wij-menu-item header="Home"   command="say('home')"></wij-menu-item>
//       <wij-menu-item header="Input"  command="say('input')"></wij-menu-item>
//       <wij-menu-item header="Layout" command="say('layout')"></wij-menu-item>
//     </wij-menu-item>
//   </wij-menu-item>
// </wij-menu>
// ** see
// - Wijmo wijmenu: http://wijmo.com/wiki/index.php/Menu
.directive("wijMenu", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template: "<ul ng-transclude></ul>",
        scope: {
            animation: "@",  // Animation to use when showing menu items. Valid options are: null (the default), 'slide', 'puff', 'fold', 'fade', etc.
            trigger: "@"     // When to open the menus. Valid options are: 'mouseenter' (the default), 'click', 'dbclick', or 'rtclick'.
        },
        controller: function ($scope) { },
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["animation", "trigger"];
            wijUtil.watchScope(scope, arr, updateControl, true, false);

            function updateControl() {

                // destroy old widget if any
                if (element.data().wijmenu) {
                    element.data().wijmenu.destroy();
                }

                // create/re-create widget
                var options = {
                    trigger: ".wijmo-wijmenu-item",
                    triggerEvent: scope.trigger ? scope.trigger : "mouseenter",
                    animation: { animated: scope.animation, duration: 200 }
                };
                element.wijmenu(options);
            }
        }
    }
} ])
// ** wij-menu-item directive
// - Represents an item in a wij-menu directive.
// ** example
// <wij-menu>
//   <wij-menu-item header="Navigate" >
//     <wij-menu-item header="Home"  href="#/home"></wij-menu-item>
//     <wij-menu-item header="Input" href="#/wijmo/input"></wij-menu-item>
//     <wij-menu-separator></wij-menu-separator>
//     <wij-menu-item header="Commands">
//       <wij-menu-item header="Home"   command="say('home')"></wij-menu-item>
//       <wij-menu-item header="Input"  command="say('input')"></wij-menu-item>
//       <wij-menu-item header="Layout" command="say('layout')"></wij-menu-item>
//     </wij-menu-item>
//   </wij-menu-item>
// </wij-menu>
// ** see
// - Wijmo wijmenu: http://wijmo.com/wiki/index.php/Menu
.directive("wijMenuItem", function () {
    return {
        restrict: "E",
        require: "^wijMenu",
        replace: true,
        transclude: true,
        template:
            "<li>" +
            "  <a href='{{href}}' ng-bind-html-unsafe='header'></a>" + // html in header
        //"  <a href='{{href}}'>header</a>" + // plain text in header
            "  <ul ng-transclude></ul>" +
            "</li>",
        scope:
        {
            header: "@",    // Text for this menu item.
            command: "&",   // Command to execute when the item is clicked.
            href: "@"       // Address to navigate to when the item is clicked.
        },
        link: function (scope, element, attrs, wijMenu) {

            // handle clicks
            element.click(function () {
                if (scope.command) {
                    scope.command();
                }
            });
        }
    }
})
// ** wij-menu-separator directive
// - Represents a separator between groups of items a wij-menu directive.
// ** example
// <wij-menu>
//   <wij-menu-item header="Navigate" >
//     <wij-menu-item header="Home"  href="#/home"></wij-menu-item>
//     <wij-menu-item header="Input" href="#/wijmo/input"></wij-menu-item>
//     <wij-menu-separator></wij-menu-separator>
//     <wij-menu-item header="Commands">
//       <wij-menu-item header="Home"   command="say('home')"></wij-menu-item>
//       <wij-menu-item header="Input"  command="say('input')"></wij-menu-item>
//       <wij-menu-item header="Layout" command="say('layout')"></wij-menu-item>
//     </wij-menu-item>
//   </wij-menu-item>
// </wij-menu>
// ** see
// - Wijmo wijmenu: http://wijmo.com/wiki/index.php/Menu
.directive("wijMenuSeparator", function () {
    return {
        restrict: "E",
        require: "^wijMenu",
        replace: true,
        template: "<li></li>"
    }
})

// ** wij-splitter directive
// - Divides an element into two panels separated by a movable bar.
// - Supports horizontal and vertical orientations.
// - One of the elements can optionally be collapsed.
// ** example
// <wij-splitter splitter-distance="250" style="height:300px;border:2px solid grey" >
//   <div>Panel on the left.</div>
//   <div>Panel on the right.</div>
// </wij-splitter>
// ** see
// - Wijmo splitter: http://wijmo.com/wiki/index.php/Splitter#API
.directive("wijSplitter", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {
            orientation: "@",       // Orientation of the splitter bar. Possible values are 'vertical' (the default) or 'horizontal'.
            collapsingPanel: "@",   // Which panel should collapse when the user clicks the expander element. Possible values are 'panel1' (the default), 'panel2', or null.
            splitterDistance: "@"   // Distance in pixels between the edge of the widget and the splitter bar (default is 100).
        },
        template: "<div ng-transclude></div>",
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["orientation", "collapsingPanel", "splitterDistance"];
            wijUtil.watchScope(scope, arr, updateControl, true, false);

            // update the control immediately to get item sizes right
            updateControl();

            // create/update the control
            function updateControl() {

                // wait until the control is visible
                if (!element.is(":visible")) {
                    setTimeout(updateControl, 50);
                    return;
                }

                // create widget
                var cp = scope.collapsingPanel ? scope.collapsingPanel : "panel1";
                var options = {
                    orientation: scope.orientation ? scope.orientation : "vertical",
                    collapsingPanel: cp,
                    showExpander: cp == "panel1" || cp == "panel2",
                    splitterDistance: scope.splitterDistance ? scope.splitterDistance * 1 : 100
                };
                element.wijsplitter(options);

                // refresh child splitters after resizing
                element.bind("wijsplittercollapsed", refresh);
                element.bind("wijsplitterexpanded", refresh);
                element.bind("wijsplittersized", refresh);
            }

            // refresh child splitters after resizing
            var refreshing = false;
            function refresh() {
                if (!refreshing) {
                    refreshing = true;
                    refreshChildSplitters();
                    refreshing = false;
                }
            }
            function refreshChildSplitters(e) {
                if (!e) {
                    e = element;
                } else {
                    if (e.data && e.data().wijsplitter) {
                        e.data().wijsplitter.refresh(true, false);
                    }
                }
                var arr = e.children();
                for (var i = 0; i < arr.length; i++) {
                    refreshChildSplitters($(arr[i]));
                }
            }
        }
    };
} ])

// ** wij-tab directive
// - Creates a tabbed interface.
// - Contains <code>wij-tab-item</code> elements, each with a 'header' attribute and its own content.
// ** example
// <wij-tab>
//   <wij-tab-item header="First Tab">
//     <div>This is the content of the first tab.</div>
//   </wij-tab-item>
//   <wij-tab-item header="Second Tab">
//     <div>This is the content of the second tab.</div>
//   </wij-tab-item>
// </wij-tab>
// ** see
// - Wijmo tabs: http://wijmo.com/wiki/index.php/Tabs#API
.directive("wijTab", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {
            alignment: "@",     // Determines the position of the tabs (top, bottom, left, or right of the content).
            collapsible: "@",   // Determines whether users can collapse tabs by clicking them when they are selected.
            scrollable: "@"     // Determines whether tabs should wrap or scroll when they exceed the available width.
        },
        template:
            "<div>" +
                "<ul>" +
                    "<li ng-repeat='pane in panes'>" +
                        "<a href='#wti{{pane.$id}}' ng-bind-html-unsafe='pane.header'></a>" + // html in header
        // "<a href='#{{pane.id}}'>{{pane.header}}</a>" + // plain text in header
                    "</li>" +
                "</ul>" +
                "<div ng-transclude></div>" +
            "</div>",
        controller: ["$scope", function ($scope) {
            $scope.panes = [];
            this.addPane = function (pane) {
                $scope.panes.push(pane);
            }
        } ],
        link: function (scope, element, attrs) {

            // listen to changes in attributes and update the control
            var arr = ["alignment", "collapsible", "scrollable"];
            wijUtil.watchScope(scope, arr, updateControl, true, false);

            function updateControl() {

                // wait until the control is visible
                if (!element.is(":visible")) {
                    setTimeout(updateControl, 100);
                    return;
                }

                // create the tabs
                var options = {
                    alignment: scope.alignment ? scope.alignment : "top",
                    collapsible: scope.collapsible ? scope.$eval(scope.collapsible) : false,
                    scrollable: scope.scrollable ? scope.$eval(scope.scrollable) : false
                };
                element.wijtabs(options);
            }
        }
    };
} ])
// ** wij-tab-item directive
// - Provides content for <code>wij-tab</code> elements.
// - Adapted from http://angularjs.org/#components-js.
// ** example
// <wij-tab>
//   <wij-tab-item header="First Tab">
//     <div>This is the content of the first tab.</div>
//   </wij-tab-item>
//   <wij-tab-item header="Second Tab">
//     <div>This is the content of the second tab.</div>
//   </wij-tab-item>
// </wij-tab>
// ** see
// - Wijmo tabs: http://wijmo.com/wiki/index.php/Tabs#API
.directive("wijTabItem", function () {
    return {
        require: "^wijTab",
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {
            header: "@" // Html content that appears in the tab.
        },
        template: "<div ng-transclude></div>",
        link: function (scope, element, attrs, wijTab) {
            element.attr("id", "wti" + scope.$id);
            wijTab.addPane(scope);
        }
    };
})

// ** wij-accordion directive
// - Creates an interface with collapsible items where one item is expanded at any time.
// - Contains <code>wij-accordion-item</code> elements, each with a 'header' attribute and its own content.
// ** example
// <wij-accordion>
//   <wij-accordion-item header="<b>ATL</b> Atlanta, GA">
//     <div>accordion item content...</div>
//   </wij-accordion-item>
//   <wij-accordion-item header="<b>ORD</b> Chicago, IL">
//     <div>accordion item content...</div>
//   </wij-accordion-item>
// </wij-accordion>
// ** see
// - Wijmo accordion: http://wijmo.com/wiki/index.php/Accordion#API
.directive("wijAccordion", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {
        },
        template:
            "<ul style='list-style-type:none' ng-transclude></ul>",
        controller: ["$scope", function ($scope) {
            $scope.items = [];
            this.addItem = function (item) {
                $scope.items.push(item);
            }
        } ],
        link: function (scope, element, attrs) {

            // update the control immediately to get item sizes right
            updateControl();

            function updateControl() {

                // remove empty spans between the items
                element.children("span").remove();

                // create the accordion
                element.accordion();
            }
        }
    };
} ])
// ** wij-accordion-item directive
// - Provides content for <code>wij-accordion</code> elements.
// ** example
// <wij-accordion>
//   <wij-accordion-item header="<b>ATL</b> Atlanta, GA">
//     <div>accordion item content...</div>
//   </wij-accordion-item>
//   <wij-accordion-item header="<b>ORD</b> Chicago, IL">
//     <div>accordion item content...</div>
//   </wij-accordion-item>
// </wij-accordion>
// ** see
// - Wijmo accordion: http://wijmo.com/wiki/index.php/Accordion#API
.directive("wijAccordionItem", function () {
    return {
        require: "^wijAccordion",
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {
            header: "@" // Html content that appears in the header.
        },
        template:
            "<li>" +
            "  <div ng-bind-html-unsafe='header'></div>" +
            "  <div ng-transclude></div>" +
            "</li>",
        link: function (scope, element, attrs, wijAccordion) {
            wijAccordion.addItem(scope);
        }
    };
})

// ** wij-tooltip directive
// - Provides balloon tooltips with HTML content.
// ** example
// This paragraph contains a
// <i wij-tooltip="Tooltip content (<b>HTML</b> is allowed here).">
//  rich tooltip
// </i>.
// ** see
// - Wijmo tooltip: http://wijmo.com/wiki/index.php/Tooltip#API
.directive("wijTooltip", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {

            // set cursor to hand ("pointer")
            element.css("cursor", "pointer");

            // create tooltip
            var options = {
                content: getContent,
                mouseTrailing: true,
                shown: function () { mouseTrailing(false) },
                hidden: function () { mouseTrailing(true) }
            }
            element.wijtooltip(options);

            // turn mouse trailing on or off
            function mouseTrailing(onOff) {
                var opt = element.data().wijtooltip.options;
                opt.mouseTrailing = onOff;
                element.wijtooltip(opt);
            }

            // get tooltip content (literal or element content)
            function getContent() {

                // if content starts with '#', look it up in other elements
                var content = attrs["wijTooltip"];
                if (content != null && content[0] == "#") {
                    var el = $(content);
                    if (el != null && el.length > 0) {
                        return el.html();
                    }
                }

                // plain content
                return content;
            }
        }
    };
})

// ** wij-spread directive
// - Excel-compatible control.
// - Implemented using the Wijmo spreadJS widget.
// ** example
// <wij-spread style="width:600px;height:300px;border: 1px solid gray;font-size:10.5pt" >
//   <wij-spread-sheet title="Sales" data="data" frozen-columns="1">
//     <wij-spread-column binding="country" width="100" ></wij-spread-column>
//     <wij-spread-column binding="product" width="140" ></wij-spread-column>
//     <wij-spread-column binding="amount" width="100" format="#,##0.00" read-only="true" ></wij-spread-column>
//     <wij-spread-column binding="date" width="100" format="mm-dd-yyyy"></wij-spread-column>
//   </wij-spread-sheet>
// </wij-spread>
// ** see
// - Wijmo spreadJS: http://wijmo.com/widgets/wijmo-enterprise/spreadjs/
.directive("wijSpread", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template: "<div ng-transclude/>",
        scope: {
            showTabs: "@" // Whether to show the sheet selection tabs.
        },

        // add sheets to this spread
        controller: ["$scope", function ($scope) {
            $scope.sheets = [];
            this.addSheet = function (sheet) {
                $scope.sheets.push(sheet);
            };
        } ],

        link: function (scope, element, attrs) {

            // create spread component
            var sheetCount = scope.sheets ? scope.sheets.length : 1;
            element.wijspread({ sheetCount: sheetCount });
            var spread = element.wijspread("spread");

            // disable editing the tab titles and adding new sheets
            spread.newTabVisible(false);
            spread.tabEditable(false);

            // set tab visibility
            scope.$watch("showTabs", function () {
                var showTabs = scope.showTabs ? scope.$eval(scope.showTabs) : scope.sheets.length > 1;
                spread.tabStripVisible(showTabs);
            });

            // associate actual sheets with sheet scopes
            for (var i = 0; i < scope.sheets.length; i++) {
                var sheet = spread.getSheet(i);
                scope.sheets[i].setSheet(spread, sheet);
            }
        }
    }
} ])

// ** wij-spread-sheet directive
// - Sheet in a wij-spread control.
// - Implemented using the Wijmo spreadJS widget.
// ** requires SpreadJS
// <script src="http://cdn.wijmo.com/spreadjs/jquery.wijmo.wijspread.all.1.20131.2.min.js" 
//         type="text/javascript"></script>
// <link href="http://cdn.wijmo.com/spreadjs/jquery.wijmo.wijspread.1.20131.2.css" 
//         rel="stylesheet" type="text/css" />
// ** example
// <wij-spread style="width:600px;height:300px;border: 1px solid gray;font-size:10.5pt" >
//   <wij-spread-sheet title="Sales" data="data" frozen-columns="1">
//     <wij-spread-column binding="country" width="100" ></wij-spread-column>
//     <wij-spread-column binding="product" width="140" ></wij-spread-column>
//     <wij-spread-column binding="amount" width="100" format="#,##0.00" read-only="true" ></wij-spread-column>
//     <wij-spread-column binding="date" width="100" format="mm-dd-yyyy"></wij-spread-column>
//   </wij-spread-sheet>
// </wij-spread>
// ** see
// - Wijmo spreadJS: http://wijmo.com/widgets/wijmo-enterprise/spreadjs/
.directive("wijSpreadSheet", ["wijUtil", function (wijUtil) {
    return {
        require: "^wijSpread",
        restrict: "E",
        replace: true,
        transclude: true,
        template: "<div ng-transclude/>",
        scope: {
            data: "=",          // List of items to bind to.
            title: "@",         // Title for this sheet (value that appears in the tab).
            autoFit: "@",       // Whether to auto-fit the column width after binding the column.
            frozenColumns: "@"  // Number of non-scrollable columns.
        },

        // add columns to this sheet
        controller: ["$scope", function ($scope) {
            $scope.columns = [];
            this.addColumn = function (column) {
                $scope.columns.push(column);
            };
        } ],

        link: function (scope, element, attrs, wijSpread) {

            // create column validators
            var ns = $.wijmo.wijspread;
            var numericValidator = ns.DefaultDataValidator.createNumberValidator(ns.ComparisonOperator.NotEqualsTo, null, null, true);
            var dateValidator = ns.DefaultDataValidator.createDateValidator(ns.ComparisonOperator.GreaterThan, new Date(1900, 1, 1, 0, 0, 0, 0), 1, true);

            // add this sheet to the parent spread
            wijSpread.addSheet(scope);

            // get a reference to the actual sheet
            scope.setSheet = function (spread, sheet) {

                // apply changes when done editing cells on this sheet
                spread.bind(ns.Events.EditEnd, function (event, data) {
                    if (data.sheet == sheet) {
                        if (scope.data && !scope.$$phase) scope.$apply("data");
                    }
                });

                // cancel edits if the type is wrong
                spread.bind(ns.Events.ValidationError, function (event, data) {
                    data.validationResult = ns.DataValidationResult.Discard; //restore original value
                });


                // customize the style for cells, col headers, and row headers
                var font = getElementFont();
                angular.forEach(ns.SheetArea, function (item, index) {
                    //jQuery.each(ns.SheetArea, function(index, item){
                    var style = sheet.getDefaultStyle(item);
                    if (style) {
                        style.font = font;
                        style.vAlign = ns.VerticalAlign.center;
                    }
                });

                // update the sheet title and number of frozen columns
                scope.$watch("title", updateSheetTitle);
                scope.$watch("frozenColumns", updateFrozenColumns);

                // bind the sheet when the data source changes
                scope.$watch("data", bindSheet, true);

                // bind the sheet when column properties change 
                if (scope.columns && scope.columns.length > 0) {
                    var arr = ["binding", "header", "format", "width", "readOnly", "wordWrap", "autoFit"];
                    wijUtil.watchScope(scope, arr, bindSheet, true, false);
                }

                // bind the sheet
                function bindSheet() {
                    if (scope.data) {

                        // suspend painting while binding
                        sheet.isPaintSuspended(true);

                        // bind grid
                        var hasColumns = scope.columns && scope.columns.length > 0;
                        if (hasColumns) {
                            sheet.isProtected = true;
                            spread.isProtected = true;
                            sheet.autoGenerateColumns = false;
                            sheet.setDataSource(scope.data, false);
                            sheet.setColumnCount(scope.columns.length);
                            for (var col = 0; col < scope.columns.length; col++) {
                                bindColumn(col);
                            }
                        } else {
                            var colWidths = getColWidths();
                            sheet.isProtected = false;
                            spread.isProtected = false;
                            sheet.autoGenerateColumns = true;
                            sheet.setDataSource(scope.data, false);
                            for (var col = 0; col < sheet.getColumnCount(); col++) {
                                var header = sheet.getValue(0, col, ns.SheetArea.colHeader);
                                header = getHeader(header);
                                sheet.setValue(0, col, header, ns.SheetArea.colHeader);
                                if (header.indexOf("$$") == 0) { // remove columns bound to work variables
                                    sheet.deleteColumns(col, 1);
                                    col--;
                                }
                            }
                            setColWidths(colWidths);
                        }

                        // auto-fit
                        if (scope.autoFit && scope.$eval(scope.autoFit)) {
                            for (var col = 0; col < sheet.getColumnCount(); col++) {
                                sheet.autoFitColumn(col);
                            }
                        } else if (scope.columns && scope.columns.length > 0) {
                            for (var col = 0; col < sheet.getColumnCount(); col++) {
                                var autoFit = scope.columns[col].autoFit;
                                if (autoFit && scope.$eval(autoFit)) {
                                    sheet.autoFitColumn(col);
                                }
                            }
                        }

                        // input validation
                        if (sheet.getRowCount() > 0) {
                            for (var col = 0; col < sheet.getColumnCount(); col++) {
                                var cell = sheet.getCell(0, col);
                                if (cell) {
                                    if (angular.isNumber(cell.value())) {
                                        sheet.getColumn(col).dataValidator(numericValidator);
                                    } else if (angular.isDate(cell.value())) {
                                        sheet.getColumn(col).dataValidator(dateValidator);
                                    }
                                }
                            }
                        }

                        // update the sheet title and number of frozen columns
                        updateSheetTitle();
                        updateFrozenColumns();

                        // resume painting
                        sheet.isPaintSuspended(false);
                    }
                }

                // add a bound column to the sheet
                function bindColumn(index) {

                    // bind column
                    var scopeCol = scope.columns[index];
                    sheet.bindColumn(index, scopeCol.binding);
                    var column = sheet.getColumn(index);

                    // apply header
                    var header = scopeCol.header;
                    if (!header) {
                        header = getHeader(scopeCol.binding);
                    }
                    sheet.setValue(0, index, header, ns.SheetArea.colHeader);

                    // apply format
                    if (scopeCol.format) {
                        var fmt = new ns.GeneralFormatter(scopeCol.format);
                        column.formatter(fmt);
                    }

                    // apply width
                    if (scopeCol.width) {
                        sheet.setColumnWidth(index, scopeCol.width * 1);
                    }

                    // apply word wrap
                    var wordWrap = scopeCol.wordWrap ? scope.$eval(scopeCol.wordWrap) : false;
                    column.wordWrap(wordWrap);

                    // lock read-only columns to prevent editing
                    var locked = scopeCol.readOnly ? scope.$eval(scopeCol.readOnly) : false;
                    column.locked(locked);
                }

                // gets a font descriptor from the current element
                function getElementFont() {
                    var sz = parseInt(element.css("font-size"));
                    if (sz && sz > 0) {
                        sz = Math.round(parseInt(element.css("font-size")) * 72 / 96, 2);
                        return sz + "pt " + element.css("font-family");
                    }
                    return null;
                }

                // gets a header for a column based on the binding name
                function getHeader(name) {
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                    while (name.indexOf("_") > -1) name = name.replace("_", " ");
                    return name;
                }

                // save and restore column widths after re-binding
                function getColWidths() {
                    var arr = [];
                    for (var i = 0; i < sheet.getColumnCount(); i++) {
                        arr.push(sheet.getColumn(i).width());
                    }
                    return arr;
                }
                function setColWidths(colWidths) {
                    if (sheet.getColumnCount() == colWidths.length) {
                        for (var i = 0; i < sheet.getColumnCount(); i++) {
                            sheet.getColumn(i).width(colWidths[i]);
                        }
                    }
                }

                // update the sheet title
                function updateSheetTitle() {
                    if (scope.title) {
                        sheet.setName(scope.title);
                    }
                }

                // update the number of frozen columns
                function updateFrozenColumns() {
                    var fc = scope.frozenColumns ? scope.frozenColumns * 1 : 0;
                    sheet.setFrozenCount(0, fc);
                }
            }
        }
    }
} ])

// ** wij-spread-column directive
// - Column in a wij-spread-sheet sheet.
// - Implemented using the Wijmo spreadJS widget.
// ** example
// <wij-spread style="width:600px;height:300px;border: 1px solid gray;font-size:10.5pt" >
//   <wij-spread-sheet title="Sales" data="data" frozen-columns="1">
//     <wij-spread-column binding="country" width="100" ></wij-spread-column>
//     <wij-spread-column binding="product" width="140" ></wij-spread-column>
//     <wij-spread-column binding="amount" width="100" format="#,##0.00" read-only="true" ></wij-spread-column>
//     <wij-spread-column binding="date" width="100" format="mm-dd-yyyy"></wij-spread-column>
//   </wij-spread-sheet>
// </wij-spread>
// ** see
// - Wijmo spreadJS: http://wijmo.com/widgets/wijmo-enterprise/spreadjs/
.directive("wijSpreadColumn", function () {
    return {
        require: "^wijSpreadSheet",
        restrict: "E",
        replace: true,
        template: "<div/>",
        scope: {
            binding: "@",       // Property shown in this column.
            header: "@",        // Column header content.
            format: "@",        // Format used to display numeric values in this column.
            width: "@",         // Column width in pixels.
            readOnly: "@",      // Whether user can edit this column.
            wordWrap: "@",      // Whether text can wrap within cells in this column.
            autoFit: "@"        // Whether to auto-fit the column width after binding the column.
        },

        // add this column to the parent sheet
        link: function (scope, element, attrs, wijSheet) {
            wijSheet.addColumn(scope);
        }
    };
});
