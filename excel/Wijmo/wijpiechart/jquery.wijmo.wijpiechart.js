/*
 *
 * Wijmo Library 3.20143.59
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 *
 */
/// <reference path="../wijchart/jquery.wijmo.wijchartcore.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals Raphael,jQuery, window, Globalize*/
    /*
    * Depends:
    *	jquery.js
    *	raphael.js
    *	globalize.js
    *	jquery.ui.widget.js
    *	jquery.wijmo.raphael.js
    *	jquery.wijmo.wijchartcore.js
    *
    */
    (function (chart) {
        var PI = 180;
        var TwoPI = 360;

        /**
        * @widget
        */
        var wijpiechart = (function (_super) {
            __extends(wijpiechart, _super);
            function wijpiechart() {
                _super.apply(this, arguments);
            }
            wijpiechart.prototype._create = function () {
                this._handleChartStyles();
                _super.prototype._create.call(this);
                this.chartElement.addClass(this.options.wijCSS.pieChart);
            };

            /** Removes the functionality completely.
            * This will return the element back to its pre-init state.
            */
            wijpiechart.prototype.destroy = function () {
                var wijCSS = this.options.wijCSS, element = this.chartElement, fields = element.data("fields"), aniSectors = fields && fields.sectors, aniLabels = fields && fields.labels;

                element.removeClass(wijCSS.pieChart);
                _super.prototype.destroy.call(this);

                if (aniSectors && aniSectors.length) {
                    $.each(aniSectors, function (idx, sector) {
                        sector = null;
                    });
                }
                if (aniLabels && aniLabels.length) {
                    $.each(aniLabels, function (idx, label) {
                        label = null;
                    });
                }

                element.data("fields", null);
            };

            wijpiechart.prototype._isPieChart = function () {
                return true;
            };

            /** Returns the sector of the pie chart with the given index.
            * @param {number} index The index of the sector.
            * @returns {Raphael Element} Reference to raphael element object.
            */
            wijpiechart.prototype.getSector = function (index) {
                var fields = this.chartElement.data("fields");
                if (fields && fields.chartElements) {
                    return fields.chartElements.sectors[index];
                }
                return null;
            };

            //add binding for pie chart
            wijpiechart.prototype._bindData = function () {
                var o = this.options, ds = o.dataSource, data = o.data, seriesList = [], dataLabel, dataValue, dataOffset;

                if (ds && data) {
                    dataLabel = data.label;
                    dataValue = data.value;
                    dataOffset = data.offset;
                    if (dataLabel && dataLabel.bind) {
                        dataLabel = this._getBindData(ds, dataLabel.bind);
                    }
                    if (dataValue && dataValue.bind) {
                        dataValue = this._getBindData(ds, dataValue.bind);
                    }
                    if (dataOffset && dataOffset.bind) {
                        dataOffset = this._getBindData(ds, dataOffset.bind);
                    }
                    if (dataLabel && $.isArray(dataLabel) && dataLabel.length && dataValue && $.isArray(dataValue) && dataValue.length) {
                        $.each(dataValue, function (idx, val) {
                            var label, offset = 0;
                            if (idx >= 0 && idx < dataLabel.length) {
                                label = dataLabel[idx];
                            }
                            if (dataOffset && $.isArray(dataValue) && dataOffset.length && idx >= 0 && idx < dataOffset.length) {
                                offset = typeof dataOffset[idx] === 'undefined' ? 0 : dataOffset[idx];
                            }
                            seriesList.push({
                                data: val,
                                label: label,
                                offset: offset,
                                legendEntry: true
                            });
                        });
                        o.seriesList = seriesList;
                    }
                }
            };

            //Override chartcore's _hanldSharedXData, there's no x/y axis in piechart.
            wijpiechart.prototype._hanldSharedXData = function () {
            };

            wijpiechart.prototype._checkSeriesDataEmpty = function (series) {
                return isNaN(series.data);
            };

            wijpiechart.prototype._getSeriesFromTR = function (theaders, sList, seriesList) {
                var label = null, th = null, tds = null, data = null, series = null;
                if (sList.length) {
                    sList.each(function () {
                        th = $("th", $(this));
                        label = $.trim(th.text());
                        tds = $("td", $(this));
                        if (tds.length) {
                            data = parseFloat($.trim($(tds[0]).text()));
                        }
                        series = {
                            label: label,
                            legendEntry: true,
                            data: data
                        };
                        seriesList.push(series);
                    });
                }
            };

            wijpiechart.prototype._showSerieEles = function (seriesEle) {
                var showLabels = this.options.showChartLabels;
                if (seriesEle.sector) {
                    seriesEle.sector.show();
                    if (seriesEle.sector.shadow) {
                        seriesEle.sector.shadow.show();
                    }
                    if (seriesEle.sector.tracker) {
                        seriesEle.sector.tracker.show();
                    }
                }
                if (seriesEle.label && showLabels) {
                    seriesEle.label.show();
                    if (seriesEle.label.connector) {
                        seriesEle.label.connector.show();
                    }
                    $(seriesEle.label.node).data("legendHide", false);
                }
            };

            wijpiechart.prototype._hideSerieEles = function (seriesEle) {
                if (seriesEle.sector) {
                    seriesEle.sector.hide();
                    if (seriesEle.sector.shadow) {
                        seriesEle.sector.shadow.hide();
                    }
                    if (seriesEle.sector.tracker) {
                        seriesEle.sector.tracker.hide();
                    }
                }
                if (seriesEle.label) {
                    seriesEle.label.hide();
                    if (seriesEle.label.connector) {
                        seriesEle.label.connector.hide();
                    }
                    $(seriesEle.label.node).data("legendHide", true);
                }
            };

            wijpiechart.prototype._hasAxes = function () {
                return false;
            };

            wijpiechart.prototype._mouseMoveInsidePlotArea = function (e, mousePos) {
                _super.prototype._mouseMoveInsidePlotArea.call(this, e, mousePos);
                if (this.isTapAndHold) {
                    var previousAngle = this.previousAngle, rotation = 0, rotationStr = "", element = this.chartElement, dataObj = this.tapTarget ? this.tapTarget.data("wijchartDataObj") : {}, pieId = dataObj.pieID || "", sectors = element.data("fields").chartElements["sectors" + pieId], cb = this.canvasBounds, pieCX = (cb.startX + cb.endX) / 2, pieCY = (cb.startY + cb.endY) / 2, angle = Raphael.angle(mousePos.left, mousePos.top, pieCX, pieCY);
                    if (previousAngle) {
                        rotation = Math.round(angle - previousAngle);
                        if (Math.abs(angle - previousAngle) > PI) {
                            if (angle > previousAngle) {
                                rotation = rotation - TwoPI;
                            } else {
                                rotation = rotation + TwoPI;
                            }
                        }
                        if (rotation) {
                            rotationStr = Raphael.format("...r{0},{1},{2}", rotation, pieCX, pieCY);
                            $.each(sectors, function (idx, sector) {
                                sector.transform(rotationStr);
                            });
                            if (this.tooltip) {
                                this._setTouchTooltip(null);
                            }
                        }
                    }
                    this.previousAngle = angle;
                }
            };

            wijpiechart.prototype._mouseMoveOutsidePlotArea = function (e, mousePos) {
                _super.prototype._mouseMoveOutsidePlotArea.call(this, e, mousePos);
                if (this.isTapAndHold) {
                    this._rotateToSectorCenter(null);
                }
            };

            wijpiechart.prototype._rotateToSectorCenter = function (specifiedSector) {
                var _this = this;
                var animation = this.options.animation, element = this.chartElement, dataObj = this.tapTarget ? this.tapTarget.data("wijchartDataObj") : {}, pieId = dataObj.pieID || "", sectors = element.data("fields").chartElements["sectors" + pieId], labels = element.data("fields").chartElements["labels" + pieId], cb = this.canvasBounds, pieCX = (cb.startX + cb.endX) / 2, pieCY = (cb.startY + cb.endY) / 2, animate, touchSector, angle, self = this;

                this._hideSectorElements(sectors, labels);
                if (this.tooltip) {
                    touchSector = this._getTouchttSector(specifiedSector);
                }

                //add targetCenterAngle >=0.01 to prevent the precision issue.
                if (this.touchttSector && this.touchttSector === touchSector && Math.abs(this.targetCenterAngle) >= 0.01) {
                    if (this.targetCenterAngle > PI) {
                        angle = this.targetCenterAngle - TwoPI;
                    } else if (this.targetCenterAngle < -PI) {
                        angle = this.targetCenterAngle + TwoPI;
                    } else {
                        angle = this.targetCenterAngle;
                    }
                    animate = Raphael.animation({
                        transform: Raphael.format("...r{0},{1},{2}", angle, pieCX, pieCY)
                    }, animation.duration, animation.easing, function () {
                        self._rotateCallback(this, labels);
                    });

                    $.each(sectors, function (idx, sector) {
                        sector.animate(animate);
                    });
                } else {
                    $.each(sectors, function (idx, sector) {
                        _this._rotateCallback(sector, labels);
                    });
                }
                this.previousAngle = null;
                this.isTapAndHold = false;
                this.tapTarget = null;
            };

            wijpiechart.prototype._rotateCallback = function (sector, labels) {
                var cb = this.canvasBounds, pieCX = (cb.startX + cb.endX) / 2, pieCY = (cb.startY + cb.endY) / 2, idx = sector.index, rotation = 0, transforms = sector.attr("transform"), transformAttr, label;
                $.each(transforms, function (idx, transform) {
                    if (transform[0] !== "r") {
                        return true;
                    }
                    if (transform.length >= 4) {
                        rotation += transform[1];
                    }
                });

                transformAttr = Raphael.format("r{0},{1},{2}", rotation, pieCX, pieCY);
                if (pieCX > 0) {
                    rotation = rotation % TwoPI;
                    transformAttr = Raphael.format("r{0},{1},{2}", rotation, pieCX, pieCY);
                    sector.attr("transform", transformAttr);
                }
                if (sector.tracker) {
                    sector.tracker.attr("transform", transformAttr);
                    sector.tracker.show();
                }
                if (sector.shadow) {
                    sector.shadow.attr("transform", transformAttr);
                    sector.shadow.show();
                }
                if (labels && labels.length && labels.length > idx) {
                    label = labels[idx];
                    label.attr("transform", Raphael.format("r{0},{1},{2}r{3}", rotation, pieCX, pieCY, 0 - rotation));
                    if (label.connector) {
                        label.connector.attr("transform", transformAttr);
                    }

                    if ($(label.node).data("legendHide")) {
                        return;
                    }
                    label.show();
                    if (label.connector) {
                        label.connector.show();
                    }
                }
            };

            wijpiechart.prototype._getTouchttSector = function (specifiedSector) {
                var _this = this;
                var element = this.chartElement, dataObj = this.tapTarget ? this.tapTarget.data("wijchartDataObj") : {}, pieId = dataObj.pieID || "", sectors = element.data("fields").chartElements["sectors" + pieId], ttOpts = this.tooltip.getOptions(), ttCompass = ttOpts.compass, targetAngle = 90, targetSector;
                switch (ttCompass) {
                    case "east":
                        targetAngle = 0;
                        break;
                    case "south":
                        targetAngle = 270;
                        break;
                    case "west":
                        targetAngle = PI;
                        break;
                    case "north":
                    default:
                        targetAngle = 90;
                }

                $.each(sectors, function (idx, sector) {
                    var transforms = sector.attr("transform"), rotation = 0, angle = sector.angles;

                    $.each(transforms, function (idx, transform) {
                        if (transform[0] !== "r") {
                            return true;
                        }
                        if (transform.length >= 4) {
                            rotation += transform[1];
                        }
                    });
                    rotation = rotation % TwoPI;
                    if (rotation < 0) {
                        rotation = TwoPI + rotation;
                    }
                    rotation = (targetAngle + rotation) % TwoPI;
                    if (specifiedSector) {
                        if (sector === specifiedSector) {
                            _this.targetCenterAngle = (angle.start + angle.end) / 2 - rotation;
                            targetSector = specifiedSector;
                            return false;
                        }
                    } else {
                        if (angle.start <= rotation && angle.end >= rotation) {
                            _this.targetCenterAngle = (angle.start + angle.end) / 2 - rotation;
                            targetSector = sector;
                            return false;
                        }
                    }
                });
                return targetSector;
            };

            wijpiechart.prototype._setTouchTooltip = function (specifiedSector) {
                var ttOpts = this.tooltip.getOptions(), ttCompass = ttOpts.compass, sector = this._getTouchttSector(specifiedSector), hint = this.options.hint, title = hint.title, content = hint.content, isTitleFunc = $.isFunction(title), isContentFunc = $.isFunction(content), dataObj, obj;
                if (!sector || (this.touchttSector && this.touchttSector === sector)) {
                    return;
                }
                dataObj = $(sector.node).data("wijchartDataObj");
                obj = {
                    data: dataObj,
                    value: dataObj.value,
                    label: dataObj.label,
                    total: dataObj.total,
                    y: dataObj.value
                };
                if (isTitleFunc || isContentFunc) {
                    if (isTitleFunc) {
                        ttOpts.title = function () {
                            obj.fmt = title;
                            var fmt = $.proxy(obj.fmt, obj), tit = fmt();
                            return tit;
                        };
                    }
                    if (isContentFunc) {
                        ttOpts.content = function () {
                            obj.fmt = content;
                            var fmt = $.proxy(obj.fmt, obj), con = fmt();
                            return con;
                        };
                    }
                }
                this._showTouchTooltip(ttCompass);
                this.touchttSector = sector;
            };

            wijpiechart.prototype._showTouchTooltip = function (compass) {
                var element = this.chartElement, cb = this.canvasBounds, point = { x: 0, y: 0 };
                switch (compass) {
                    case "east":
                        point = {
                            x: element.width(),
                            y: (cb.startY + cb.endY) / 2
                        };
                        break;
                    case "south":
                        point = {
                            x: (cb.startX + cb.endX) / 2,
                            y: element.height()
                        };
                        break;
                    case "west":
                        point = {
                            x: 0,
                            y: (cb.startY + cb.endY) / 2
                        };
                        break;
                    case "north":
                    default:
                        point = {
                            x: (cb.startX + cb.endX) / 2,
                            y: 0
                        };
                }
                this.tooltip.showAt(point);
            };

            wijpiechart.prototype._isTouchBehaviorEnabled = function () {
                return this.options.enableTouchBehavior && this._isTouchEnabled();
            };

            wijpiechart.prototype._mouseDown = function (e, args) {
                var target = $(e.target), element = this.chartElement, pieId, sectors, labels;

                _super.prototype._mouseDown.call(this, e, args);
                if (this._isTouchBehaviorEnabled()) {
                    this.isTapAndHold = true;
                    if (target.data("owner")) {
                        target = target.data("owner");
                    }
                    this.tapTarget = target;
                    pieId = args.pieID || "";
                    sectors = element.data("fields").chartElements["sectors" + pieId];
                    labels = element.data("fields").chartElements["labels" + pieId];

                    this._hideSectorElements(sectors, labels);
                }
            };

            wijpiechart.prototype._hideSectorElements = function (sectors, labels) {
                $.each(sectors, function (idx, sector) {
                    sector.stop();
                    if (sector.tracker) {
                        sector.tracker.hide();
                    }
                    if (sector.shadow) {
                        sector.shadow.hide();
                    }
                    if (labels && labels.length) {
                        var label = labels[idx];
                        label.hide();
                        if (label.connector) {
                            label.connector.hide();
                        }
                    }
                });
            };

            wijpiechart.prototype._mouseUp = function (e, args) {
                _super.prototype._mouseUp.call(this, e, args);
                if (this._isTouchBehaviorEnabled() && this.isTapAndHold) {
                    this._rotateToSectorCenter(null);
                }
            };

            wijpiechart.prototype._mouseOver = function (e, args) {
                _super.prototype._mouseOver.call(this, e, args);
            };

            wijpiechart.prototype._mouseOut = function (e, args) {
                _super.prototype._mouseOut.call(this, e, args);
            };

            wijpiechart.prototype._mouseMove = function (e, args) {
                _super.prototype._mouseMove.call(this, e, args);
            };

            wijpiechart.prototype._click = function (e, args) {
                var element = this.chartElement, pieId, sectors, sector;

                _super.prototype._click.call(this, e, args);
                if (this._isTouchBehaviorEnabled() && this.tooltip) {
                    pieId = args.pieID || "";
                    sectors = element.data("fields").chartElements["sectors" + pieId];
                    if (sectors.length && sectors.length > args.index) {
                        sector = sectors[args.index];
                        this._setTouchTooltip(sector);
                        this._rotateToSectorCenter(sector);
                    }
                }
            };

            wijpiechart.prototype._paintTooltip = function () {
                var wijCSS = this.options.wijCSS, element = this.chartElement, fields = element.data("fields");

                _super.prototype._paintTooltip.call(this);

                if (this.tooltip && fields) {
                    if (this._isTouchBehaviorEnabled()) {
                        this.tooltip.setOptions({
                            closeBehavior: "none",
                            mouseTrailing: false,
                            animated: null,
                            showAnimated: null,
                            windowCollisionDetection: "fit"
                        });
                        this._setTouchTooltip(null);
                        this._rotateToSectorCenter(null);
                    } else {
                        if (fields.trackers && fields.trackers.length) {
                            this.tooltip.setSelector($("." + wijCSS.canvasObject, element[0]));
                            this.tooltip.setOptions({ relatedElement: fields.trackers[0] });
                        }
                    }
                }
            };

            wijpiechart.prototype._paintPlotArea = function () {
                var o = this.options, canvasBounds = this.canvasBounds, width = canvasBounds.endX - canvasBounds.startX, height = canvasBounds.endY - canvasBounds.startY, r = o.radius;

                if (!r) {
                    r = Math.min(width, height) / 2;
                } else {
                    if (width < 2 * r) {
                        r = width / 2;
                    }
                    if (height < 2 * r) {
                        r = height / 2;
                    }
                }

                //remove to fix a resize issue.
                //o.radius = r;
                canvasBounds.startX += width / 2 - r;
                canvasBounds.endX = canvasBounds.startX + 2 * r;
                canvasBounds.startY += height / 2 - r;
                canvasBounds.endY = canvasBounds.startY + 2 * r;
                if (this.chartElement.data("fields")) {
                    this.chartElement.data("fields").seriesEles = null;
                }
                this.piechartRender = new PieChartRender(this.chartElement, {
                    canvas: this.canvas,
                    tooltip: this.tooltip,
                    bounds: canvasBounds,
                    wijCSS: o.wijCSS,
                    radius: r,
                    startAngle: o.startAngle,
                    widgetName: this.widgetName,
                    innerRadius: o.innerRadius,
                    seriesList: o.seriesList,
                    seriesStyles: o.seriesStyles,
                    seriesHoverStyles: o.seriesHoverStyles,
                    seriesTransition: o.seriesTransition,
                    showChartLabels: o.showChartLabels,
                    disabled: this._isDisabled(),
                    textStyle: o.textStyle,
                    chartLabelStyle: o.chartLabelStyle,
                    chartLabelFormatString: o.chartLabelFormatString,
                    chartLabelFormatter: o.chartLabelFormatter,
                    labels: o.labels,
                    shadow: o.shadow,
                    animation: o.animation,
                    culture: this._getCulture(),
                    mouseDown: $.proxy(this._mouseDown, this),
                    mouseUp: $.proxy(this._mouseUp, this),
                    mouseOver: $.proxy(this._mouseOver, this),
                    mouseOut: $.proxy(this._mouseOut, this),
                    mouseMove: $.proxy(this._mouseMove, this),
                    click: $.proxy(this._click, this),
                    widget: this,
                    enableTouchBehavior: o.enableTouchBehavior,
                    availableWidth: width,
                    availableHeight: height,
                    direction: o.direction,
                    isTouchBehaviorEnable: this._isTouchBehaviorEnabled()
                });

                this.piechartRender.render(!o.radius);
            };

            wijpiechart.prototype._getTooltipText = function (fmt, target) {
                var tar = $(target.node), dataObj, obj;
                if (tar.data("owner")) {
                    tar = tar.data("owner");
                }
                dataObj = tar.data("wijchartDataObj");
                obj = {
                    data: dataObj,
                    value: dataObj.value,
                    label: dataObj.label,
                    total: dataObj.total,
                    target: target,
                    y: dataObj.value,
                    fmt: fmt
                };
                return $.proxy(fmt, obj)();
            };
            return wijpiechart;
        })(chart.wijchartcore);
        chart.wijpiechart = wijpiechart;

        /*
        * Piechart segments orientation
        */
        var pieChartDirection = (function () {
            function pieChartDirection() {
            }
            pieChartDirection.clockwise = "clockwise";
            pieChartDirection.counterClockwise = "counterClockwise";
            return pieChartDirection;
        })();

        var wijpiechart_css = (function (_super) {
            __extends(wijpiechart_css, _super);
            function wijpiechart_css() {
                _super.apply(this, arguments);
                this.pieChart = "wijmo-wijpiechart";
                this.pieLabel = "wijpiechart-label";
                this.pieElement = "wijpiechart";
                this.pieTracker = "pietracker";
            }
            return wijpiechart_css;
        })(chart.wijchartcore_css);
        chart.wijpiechart_css = wijpiechart_css;

        var wijpiechart_options = (function (_super) {
            __extends(wijpiechart_options, _super);
            function wijpiechart_options() {
                _super.apply(this, arguments);
                /**
                * Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijpiechart')";
                /**
                * All CSS classes used in widgets.
                * @ignore
                */
                this.wijCSS = new wijmo.chart.wijpiechart_css();
                /** Sets the number of degrees of angle from which to begin painting wedges in the pie.
                * To see an example of this property in action, check out the following link,
                * http://jsbin.com/ewofiv/1
                */
                this.startAngle = 0;
                /** A value that indicates the radius used for a pie chart.
                * @type {number}
                * @remarks If the value is null, then the radius will be calculated
                * by the width/height value of the pie chart.
                */
                this.radius = null;
                /** A value that indicates the inner radius used for doughnut charts.*/
                this.innerRadius = 0;
                /** A value that indicates the chart label elements of chart.*/
                this.labels = {
                    /** A value that indicates the style of the chart labels.*/
                    style: {},
                    /** A value that indicates the format string of the chart labels.*/
                    formatString: "",
                    /** A value that indicates the formatter of the chart labels.
                    * @type {function}
                    */
                    formatter: null,
                    /** A value that indicates the style of the chart labels' connector.*/
                    connectorStyle: {},
                    /** A value that indicates the style of the chart labels.
                    * @remarks Options are 'inside', 'outside'.
                    */
                    position: "inside",
                    /** A value that indicates the offset of the chart labels.*/
                    offset: 10
                };
                /** The animation option  defines the animation effect and controls other aspects of the widget's animation,
                * such as duration and easing.
                */
                this.animation = {
                    /** A value that determines whether to show animation.*/
                    enabled: true,
                    /** A value that indicates the duration for the animation. */
                    duration: 400,
                    /** Sets the type of animation easing effect that users experience when the wijpiechart series
                    * is reloaded after they have changed the data for the seriesList option.
                    * @remarks  Values available for the animation easing effect include the following:
                    * easeInCubic – Cubic easing in. Begins at zero velocity and then accelerates.
                    * easeOutCubic – Cubic easing in and out. Begins at full velocity and then decelerates to zero.
                    * easeInOutCubic – Begins at zero velocity, accelerates until halfway, and then decelerates to zero velocity again.
                    * easeInBack – Begins slowly and then accelerates.
                    * easeOutBack – Begins quickly and then decelerates.
                    * easeOutElastic – Begins at full velocity and then decelerates to zero.
                    * easeOutBounce – Begins quickly and then decelerates. The number of bounces is related to the duration, longer durations produce more bounces.
                    */
                    easing: "easeInCubic",
                    /** A value that indicates the offset for an explode animation.*/
                    offset: 10
                };
                /** A value that indicates whether to show animation
                * and the duration for the animation when reload data.
                */
                this.seriesTransition = {
                    /** A value that determines whether to show animation when reload.*/
                    enabled: true,
                    /** A value that indicates the duration for the series transition.*/
                    duration: 1000,
                    /** A value that indicates the easing for the series transition. */
                    easing: "bounce"
                };
                /** An array collection that contains the data to be charted.
                * @remarks The following is the sample data for seriesList option,
                * [{
                * 	label: "Q1",
                * 	legendEntry: true,
                * 	data: 12,
                * 	 offset: 0
                * }, {
                * 	label: "Q2",
                * 	legendEntry: true,
                * 	data: 21,
                * 	offset: 0
                * }, {
                * 	label: "Q3",
                * 	legendEntry: true,
                * 	data: 9,
                * 	offset: 0
                * }, {
                * 	 label: "Q4",
                * 	legendEntry: true,
                * 	data: 29,
                * 	offset: 10
                * }]
                */
                this.seriesList = [];
                /** A value that indicates whether the piechart can be rotated and tooltip is always shown
                * on touchable devices.
                */
                this.enableTouchBehavior = true;
                /** Fires when the user clicks a mouse button.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijPieChartEventArgs} args The data with this event.
                */
                this.mouseDown = null;
                /** Fires when the user releases a mouse button
                * while the pointer is over the chart element.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijPieChartEventArgs} args The data with this event.
                */
                this.mouseUp = null;
                /** Fires when the user first places the pointer over the chart element.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijPieChartEventArgs} args The data with this event.
                */
                this.mouseOver = null;
                /** Fires when the user moves the pointer off of the chart element.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijPieChartEventArgs} args The data with this event.
                */
                this.mouseOut = null;
                /** Fires when the user moves the mouse pointer
                * while it is over a chart element.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijPieChartEventArgs} args The data with this event.
                */
                this.mouseMove = null;
                /** Fires when the user clicks the chart element.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijPieChartEventArgs} args The data with this event.
                */
                this.click = null;
                /** Sets the direction in which pie segmets will be drawn - clocwise or counterClockwise.
                * @type {pieChartDirection}
                * @remarks default value is "counterClockwise"
                */
                this.direction = pieChartDirection.counterClockwise;
            }
            return wijpiechart_options;
        })(chart.wijchartcore_options);
        ;

        wijpiechart.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijpiechart_options());

        $.wijmo.registerWidget("wijpiechart", wijpiechart.prototype);

        ;

        //render pie chart.
        /** @ignore*/
        var PieChartRender = (function () {
            function PieChartRender(element, options) {
                this.options = options;
                this.element = element;
            }
            PieChartRender.prototype.render = function (radiusNotSet) {
                var ele = this.element, o = this.options, paintShadow = function (element, offset, stroke) {
                    if (o.shadow) {
                        chart.ChartUtil.paintShadow(element, offset, stroke);
                    }
                }, getDiffAttrs = chart.ChartUtil.getDiffAttrs, canvas = o.canvas, getPositionByAngle = $.wijraphael.getPositionByAngle, seriesList = o.seriesList, seriesStyles = o.seriesStyles, seriesHoverStyles = o.seriesHoverStyles, stylesLength = seriesStyles.length, textStyle = o.textStyle, labelsOpts = o.labels || {
                    style: {},
                    formatString: "",
                    formatter: null,
                    connectorStyle: {},
                    position: "inside",
                    offset: 10
                }, chartLabelStyle = $.extend(true, {}, textStyle, o.chartLabelStyle, labelsOpts.style), chartLabelFormatString = labelsOpts.formatString || o.chartLabelFormatString, chartLabelFormatter = labelsOpts.formatter || o.chartLabelFormatter, culture = o.culture, bounds = o.bounds, startX = bounds.startX, startY = bounds.startY, radius = o.radius, showChartLabels = o.showChartLabels, animation = o.animation, seriesTransition = o.seriesTransition, innerRadius = o.innerRadius, fields = ele.data("fields") || {}, chartElements = fields.chartElements || {}, aniSectorAttrs = fields.aniSectorAttrs, aniLabelAttrs = fields.aniLabelAttrs, total = 0, angle = o.startAngle || 0, wijCSS = o.wijCSS, pieID, path, attr, sectorAttrs = [], labelAttrs = [], sectors = [], labels = [], tooltipTars = [], seriesEles = [], trackers = canvas.set(), widget = this.options.widget, calAngle = angle, availableWidth = o.availableWidth, availableHeight = o.availableHeight, oldRadius = o.radius, direction = o.direction;

                canvas.customAttributes.segment = function (x, y, a1, a2, outerR, innerR) {
                    var path = null, offset = 0.01;

                    if (a2 - a1 > TwoPI - offset) {
                        a2 -= offset;
                    } else if (a2 - a1 < offset) {
                        a2 += offset;
                    }
                    if (innerR) {
                        path = chart.ChartUtil.donut(x, y, outerR, innerR, a1, a2);
                    } else {
                        path = chart.ChartUtil.sector(x, y, outerR, a1, a2);
                    }
                    return {
                        "path": path
                    };
                };

                $.each(seriesList, function (idx, series) {
                    if (series && typeof (series.data) === "number") {
                        total += Math.abs(series.data);
                    }
                });

                if (radiusNotSet && showChartLabels && (labelsOpts.position === "outside")) {
                    $.each(seriesList, function (idx, series) {
                        var actualSize, textStyle, chartLabel, formatter, label, labelBounds, tempRadius = radius, seriesWidth = 0, seriesHeight = 0, anglePlus = TwoPI * Math.abs(series.data) / total, seriesAngle = anglePlus / 2 + calAngle, processedChartLabel;
                        series = $.extend(true, { offset: 0 }, series);
                        textStyle = $.extend(true, {}, textStyle, chartLabelStyle);
                        if (series.textStyle) {
                            textStyle = $.extend(true, textStyle, series.textStyle);
                        }
                        chartLabel = series.label;
                        processedChartLabel = chart.ChartUtil.getChartLabel(chartLabelFormatString, chartLabel, culture, {
                            index: idx,
                            value: series.data,
                            y: series.data,
                            total: total,
                            chartLabelFormatter: chartLabelFormatter
                        });
                        chartLabel = processedChartLabel.text;
                        if (aniLabelAttrs && seriesTransition.enabled) {
                            if (idx < aniLabelAttrs.length) {
                                attr = aniLabelAttrs[idx];
                                attr.text = chartLabel;
                                label = widget._text.call(widget, 0, 0, "").attr(attr);
                            } else {
                                label = widget._text.call(widget, 0, 0, chartLabel).attr(textStyle);
                            }
                        } else {
                            label = widget._text.call(widget, 0, 0, chartLabel).attr(textStyle);
                        }
                        labelBounds = label.wijGetBBox();
                        actualSize = getPositionByAngle(0, 0, series.offset + labelsOpts.offset + radius, seriesAngle);
                        seriesWidth = labelBounds.width + Math.abs(actualSize.x);
                        seriesHeight = labelBounds.height / 2 + Math.abs(actualSize.y);

                        if (seriesWidth > availableWidth / 2) {
                            radius = tempRadius - (seriesWidth - availableWidth / 2) / Math.abs(Math.cos(Raphael.rad(seriesAngle)));
                        }

                        if (seriesHeight > availableHeight / 2) {
                            radius = Math.min(radius, tempRadius - (availableHeight / 2 - seriesHeight) / Math.abs(Math.sin(Raphael.rad(seriesAngle))));
                        }
                        calAngle += anglePlus;
                        label.remove();
                        if (radius < innerRadius) {
                            radius = innerRadius;
                            return false;
                        }
                    });

                    if (radius != oldRadius) {
                        o.bounds.startX = o.bounds.startX + oldRadius - radius;
                        o.bounds.endX = o.bounds.startX + 2 * radius;
                        o.bounds.startY = o.bounds.startY + oldRadius - radius;
                        o.bounds.endY = o.bounds.startY + 2 * radius;
                        startX = bounds.startX;
                        startY = bounds.startY;
                    }
                }

                $.each(seriesList, function (idx, series) {
                    var seriesStyle = $.extend({
                        opacity: 1,
                        stroke: "gray",
                        "stroke-width": 1
                    }, seriesStyles[idx % stylesLength]), anglePlus = TwoPI * Math.abs(series.data) / total, cx = startX + radius, cy = startY + radius, center, sector, label, pos, textStyle, borderPos, tracker, chartLabel, formatter, labelPosition = labelsOpts.position, labelConnectorStyle = labelsOpts.connectorStyle, labelOffset = labelsOpts.offset, calculatedAngle, labelBounds, labelConnector, animate = false, processedChartLabel;

                    pieID = series.pieID;

                    var angleEnd, angleMediana;
                    var isClockwise = direction == pieChartDirection.clockwise;
                    if (isClockwise) {
                        angleEnd = angle - anglePlus, angleMediana = angle - anglePlus / 2;
                    } else {
                        angleEnd = angle + anglePlus, angleMediana = angle + anglePlus / 2;
                    }

                    series = $.extend(true, { offset: 0 }, series);
                    if (series.offset) {
                        center = getPositionByAngle(cx, cy, series.offset, angleMediana);
                        cx = center.x;
                        cy = center.y;
                    }

                    path = [cx, cy, angle, angleEnd, radius, innerRadius];

                    if (aniSectorAttrs && seriesTransition.enabled) {
                        seriesStyle["segment"] = path;
                        if (idx < aniSectorAttrs.length) {
                            attr = aniSectorAttrs[idx];
                        } else {
                            attr = $.extend(true, {}, seriesStyle);
                            attr.segment = [cx, cy, 0, TwoPI, radius, innerRadius];
                        }
                        sector = canvas.path().attr(attr);
                        seriesStyle = getDiffAttrs(attr, seriesStyle);
                        if (!sector.removed) {
                            sector.wijAnimate(seriesStyle, seriesTransition.duration, seriesTransition.easing, function () {
                                paintShadow(sector, 1, "#cccccc");
                                if (tracker && !tracker.removed && !sector.removed) {
                                    tracker.attr({ "path": sector.attr("path") });
                                }
                                delete seriesStyle["segment"];
                            });
                        }
                    } else {
                        sector = canvas.path().attr({ segment: path });
                        paintShadow(sector, 1, "#ccccc");
                        sector.wijAttr(seriesStyle);
                    }

                    sector.angles = { start: angle, end: angleEnd };
                    sector.index = idx;
                    sector.getOffset = function (offset) {
                        var pos = getPositionByAngle(cx, cy, offset, (sector.angles.start + sector.angles.end) / 2);
                        return { x: pos.x - cx, y: pos.y - cy };
                    };

                    sector.center = { x: cx, y: cy };
                    sector.radius = radius;
                    if (innerRadius) {
                        sector.innerRadius = innerRadius;
                    }
                    tracker = sector.clone();

                    // in vml, if the tracker has a stroke, the boder is black.
                    if (Raphael.vml) {
                        tracker.attr({
                            opacity: 0.01,
                            fill: "white",
                            "stroke-width": 0,
                            "fill-opacity": 0.01
                        });
                    } else {
                        tracker.attr({
                            opacity: 0.01,
                            fill: "white",
                            "fill-opacity": 0.01
                        });
                    }
                    $.wijraphael.addClass($(tracker.node), Raphael.format("{0} {1} {2} wijchart-tracker" + idx, wijCSS.canvasObject, wijCSS.pieElement, wijCSS.pieTracker));
                    $(tracker.node).data("owner", $(sector.node));
                    sector.tracker = tracker;
                    trackers.push(tracker);

                    // add class "wijmo-wijpiechart-series-n" to fix bug 18590
                    $.wijraphael.addClass($(sector.node), Raphael.format("{0} {1} wijmo-wijpiechart-series-" + idx, wijCSS.canvasObject, wijCSS.pieElement));

                    //addClass($(sector.node), "wijchart-canvas-object wijpiechart");
                    //end comments
                    $(sector.node).data("wijchartDataObj", series);

                    if (showChartLabels) {
                        if (labelPosition === "outside") {
                            borderPos = getPositionByAngle(cx, cy, radius, angleMediana);
                            pos = getPositionByAngle(cx, cy, radius + labelOffset, angleMediana);
                        } else {
                            pos = getPositionByAngle(cx, cy, series.offset + radius * 2 / 3, angleMediana);
                        }
                        textStyle = $.extend(true, {}, textStyle, chartLabelStyle);
                        if (series.textStyle) {
                            textStyle = $.extend(true, textStyle, series.textStyle);
                        }

                        chartLabel = series.label;
                        processedChartLabel = chart.ChartUtil.getChartLabel(chartLabelFormatString, chartLabel, culture, {
                            index: idx,
                            value: series.data,
                            y: series.data,
                            total: total,
                            chartLabelFormatter: chartLabelFormatter
                        });
                        chartLabel = processedChartLabel.text;
                        if (aniLabelAttrs && seriesTransition.enabled) {
                            if (idx < aniLabelAttrs.length) {
                                animate = true;
                                attr = aniLabelAttrs[idx];
                                attr.text = chartLabel;
                                label = widget._text.call(widget, 0, 0, "").attr(attr);
                                textStyle = getDiffAttrs(attr, textStyle);
                                textStyle.x = pos.x;
                                textStyle.y = pos.y;
                                label.wijAnimate(textStyle, seriesTransition.duration, seriesTransition.easing, function () {
                                    if (labelConnector) {
                                        labelConnector.show();
                                    }
                                });
                            } else {
                                label = widget._text.call(widget, pos.x, pos.y, chartLabel).attr(textStyle);
                            }
                        } else {
                            label = widget._text.call(widget, pos.x, pos.y, chartLabel).attr(textStyle);
                        }
                        if (labelPosition === "outside") {
                            calculatedAngle = (angleMediana) % TwoPI;
                            labelBounds = label.wijGetBBox();
                            if (calculatedAngle >= 90 && calculatedAngle <= 270) {
                                label.transform(Raphael.format("T{0},{1}", -labelBounds.width / 2, 0));
                            } else {
                                label.transform(Raphael.format("T{0},{1}", labelBounds.width / 2, 0));
                            }

                            //connector
                            labelConnector = canvas.path(Raphael.format("M{0} {1}L{2} {3}", borderPos.x, borderPos.y, pos.x, pos.y)).attr(labelConnectorStyle);
                            if (animate) {
                                labelConnector.hide();
                            }
                            label.connector = labelConnector;
                        }
                        $.wijraphael.addClass($(label.node), Raphael.format("{0} {1} {2}", wijCSS.canvasObject, wijCSS.pieElement, wijCSS.pieLabel));
                        $(label.node).data("wijchartDataObj", series);
                        tooltipTars.push(label);
                        labels.push(label);
                        labelAttrs[idx] = label.attr();
                    }

                    seriesEles.push({ label: labels[idx], sector: sector });

                    if (series.visible === false) {
                        sector.hide();
                        if (labels[idx]) {
                            labels[idx].hide();
                        }
                        if (labelConnector) {
                            labelConnector.hide();
                        }
                        if (sector.shadow) {
                            sector.shadow.hide();
                        }
                        tracker.hide();
                    }

                    sectorAttrs[idx] = sector.attr();
                    sectors.push(sector);
                    tooltipTars.push(sector);
                    series.style = seriesStyle;
                    series.hoverStyle = seriesHoverStyles[idx];
                    series.index = idx;
                    series.value = series.data;
                    series.y = series.data;
                    series.total = total;
                    series.type = "pie";

                    //angle += anglePlus;
                    angle = angleEnd;
                });

                //ensuring labels are rendered on top of pie slices.
                if (labels && labels.length) {
                    $.each(labels, function (idx, label) {
                        label.toFront();
                    });
                }

                //end comments.
                chartElements.sectors = sectors;
                if (pieID) {
                    chartElements["sectors" + pieID] = sectors;
                    chartElements["labels" + pieID] = labels;
                }
                chartElements.labels = labels;

                if (!fields.chartElements) {
                    fields.chartElements = {};
                }

                trackers.toFront();

                $.extend(true, fields.chartElements, chartElements);
                fields.aniSectorAttrs = sectorAttrs;
                fields.aniLabelAttrs = labelAttrs;
                fields.seriesEles = seriesEles;
                fields.trackers = trackers;
                ele.data("fields", fields);

                this.unbindLiveEvents();
                this.bindLiveEvents();
            };

            PieChartRender.prototype.bindLiveEvents = function () {
                var o = this.options, touchEnabled = o.widget._isTouchEnabled(), enableTouchBehavior = o.isTouchBehaviorEnable, ele = this.element, tooltip = o.tooltip, offset = { x: 0, y: 0 }, touchEventPre = "", touchBehaviorEventPre = "", isFunction = $.isFunction, disabled = o.disabled, animation = o.animation;

                if (touchEnabled) {
                    touchEventPre = "wij";
                }

                if (enableTouchBehavior) {
                    touchBehaviorEventPre = "wij";
                }

                if (tooltip) {
                    tooltip.setTargets(this.tooltipTars);
                }

                ele.on(touchEventPre + "mousedown." + o.widgetName, "." + o.wijCSS.pieElement, function (e) {
                    if (disabled) {
                        return;
                    }
                    var mouseDown = o.mouseDown, target = $(e.target), dataObj;
                    if (target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    if (!dataObj) {
                        return;
                    }

                    if (isFunction(mouseDown)) {
                        mouseDown.call(ele, e, dataObj);
                    }
                }).on(touchEventPre + "mouseup." + o.widgetName, "." + o.wijCSS.pieElement, function (e) {
                    if (disabled) {
                        return;
                    }

                    var mouseUp = o.mouseUp, target = $(e.target), dataObj;
                    if (target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    if (!dataObj) {
                        return;
                    }
                    if (isFunction(mouseUp)) {
                        mouseUp.call(ele, e, dataObj);
                    }
                }).on(touchBehaviorEventPre + "mouseover." + o.widgetName, "." + o.wijCSS.pieElement, function (e) {
                    if (disabled) {
                        return;
                    }

                    var mouseOver = o.mouseOver, target = $(e.target), animated = animation && animation.enabled, dataObj, id, index, sector, showAnimationTimer, hideAnimationTimer, explodeAnimationShowing;
                    if (target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    if (!dataObj) {
                        return;
                    }
                    id = dataObj.pieID || "";
                    index = dataObj.index;
                    sector = ele.data("fields").chartElements["sectors" + id][index];
                    showAnimationTimer = sector.showAnimationTimer;
                    hideAnimationTimer = sector.hideAnimationTimer;
                    explodeAnimationShowing = sector.explodeAnimationShowing;

                    if (isFunction(mouseOver)) {
                        mouseOver.call(ele, e, dataObj);
                    }

                    if (enableTouchBehavior) {
                        return;
                    }
                    if (sector.removed) {
                        return;
                    }
                    sector.wijAttr(dataObj.hoverStyle);

                    if (animated) {
                        if (hideAnimationTimer) {
                            window.clearTimeout(hideAnimationTimer);
                            hideAnimationTimer = null;
                            sector.hideAnimationTimer = hideAnimationTimer;
                        }

                        if (showAnimationTimer) {
                            window.clearTimeout(showAnimationTimer);
                            showAnimationTimer = null;
                            sector.showAnimationTimer = null;
                        }

                        if (explodeAnimationShowing) {
                            return;
                        }

                        showAnimationTimer = window.setTimeout(function () {
                            var duration = animation.duration, easing = animation.easing;

                            if (sector.removed) {
                                return;
                            }
                            offset = sector.getOffset(animation.offset || 10);
                            sector.offset = offset;
                            if (sector.shadow && !sector.shadow.removed) {
                                sector.shadow.hide();
                            }

                            sector.wijAnimate({
                                transform: Raphael.format("t{0},{1}", offset.x, offset.y)
                            }, duration, easing);
                            if (sector.tracker && !sector.tracker.removed) {
                                sector.tracker.wijAnimate({
                                    transform: Raphael.format("t{0},{1}", offset.x, offset.y)
                                }, duration, easing);
                            }

                            explodeAnimationShowing = true;
                            sector.explodeAnimationShowing = explodeAnimationShowing;
                        }, 150);
                        sector.showAnimationTimer = showAnimationTimer;
                    }
                }).on(touchBehaviorEventPre + "mouseout." + o.widgetName, "." + o.wijCSS.pieElement, function (e) {
                    if (disabled) {
                        return;
                    }
                    var mouseOut = o.mouseOut, target = $(e.target), animated = animation && animation.enabled, dataObj, id, index, sector, showAnimationTimer, hideAnimationTimer, explodeAnimationShowing;
                    if (target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    if (!dataObj) {
                        return;
                    }

                    id = dataObj.pieID || "";
                    index = dataObj.index;
                    sector = ele.data("fields").chartElements["sectors" + id][index];
                    showAnimationTimer = sector.showAnimationTimer;
                    hideAnimationTimer = sector.hideAnimationTimer;
                    explodeAnimationShowing = sector.explodeAnimationShowing;

                    if (isFunction(mouseOut)) {
                        mouseOut.call(ele, e, dataObj);
                    }
                    if (enableTouchBehavior) {
                        return;
                    }
                    if (sector.removed) {
                        return;
                    }

                    if (dataObj.style.segment) {
                        delete dataObj.style.segment;
                    }

                    sector.wijAttr(dataObj.style);

                    if (animated) {
                        if (hideAnimationTimer) {
                            window.clearTimeout(hideAnimationTimer);
                            hideAnimationTimer = null;
                            sector.hideAnimationTimer = hideAnimationTimer;
                        }

                        if (showAnimationTimer) {
                            window.clearTimeout(showAnimationTimer);
                            showAnimationTimer = null;
                            sector.showAnimationTimer = showAnimationTimer;
                        }

                        if (!explodeAnimationShowing) {
                            return;
                        }

                        hideAnimationTimer = window.setTimeout(function () {
                            var duration = animation.duration, easing = animation.easing;

                            offset = sector.offset;
                            if (sector.shadow && !sector.shadow.removed) {
                                sector.shadow.show();
                            }
                            if (!sector.removed) {
                                sector.wijAnimate({
                                    transform: "t0,0"
                                }, duration, easing);
                            }
                            if (sector.tracker && !sector.tracker.removed) {
                                sector.tracker.wijAnimate({
                                    transform: "t0,0"
                                }, duration, easing);
                            }
                            if (sector.shadow && !sector.shadow.removed) {
                                sector.shadow.wijAnimate({
                                    transform: "t0,0"
                                }, duration, easing);
                            }

                            offset = { x: 0, y: 0 };
                            explodeAnimationShowing = false;
                            sector.explodeAnimationShowing = explodeAnimationShowing;
                        }, 150);
                        sector.hideAnimationTimer = hideAnimationTimer;
                    }
                }).on(touchEventPre + "mousemove." + o.widgetName, "." + o.wijCSS.pieElement, function (e) {
                    if (disabled) {
                        return;
                    }
                    var mouseMove = o.mouseMove, target = $(e.target), dataObj;
                    if (target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    if (!dataObj) {
                        return;
                    }

                    if (isFunction(mouseMove)) {
                        mouseMove.call(ele, e, dataObj);
                    }
                }).on(touchEventPre + "click." + o.widgetName, "." + o.wijCSS.pieElement, function (e) {
                    if (disabled) {
                        return;
                    }

                    // The sector rotates twice on ios decive.
                    // There is 300ms click delay on iOS devices, when rotate the sector,
                    // the wijclick event will be fired twice, one is caused by touch on tracker(tracker is hiding after touch end),
                    // then another wijclick is caused by click on sector.
                    // So when click on sector, return it.
                    if (window.navigator.userAgent.match(/iPhone|iPad|iPod/i) && enableTouchBehavior && !($.wijraphael.hasClass(e.target, o.wijCSS.pieTracker))) {
                        return;
                    }

                    var click = o.click, target = $(e.target), dataObj;
                    if (target.data("owner")) {
                        target = target.data("owner");
                    }
                    dataObj = target.data("wijchartDataObj");
                    if (!dataObj) {
                        return;
                    }
                    if (isFunction(click)) {
                        click.call(ele, e, dataObj);
                    }
                });
            };

            PieChartRender.prototype.unbindLiveEvents = function () {
                var ele = this.element, o = this.options;
                ele.off("." + o.widgetName, "." + o.wijCSS.pieElement);
            };
            return PieChartRender;
        })();
        chart.PieChartRender = PieChartRender;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
