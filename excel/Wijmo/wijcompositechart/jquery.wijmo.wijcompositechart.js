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
/// <reference path="../wijbarchart/jquery.wijmo.wijbarchart.ts"/>
/// <reference path="../wijbubblechart/jquery.wijmo.wijbubblechart.ts"/>
/// <reference path="../wijpiechart/jquery.wijmo.wijpiechart.ts"/>
/// <reference path="../wijlinechart/jquery.wijmo.wijlinechart.ts"/>
/// <reference path="../wijscatterchart/jquery.wijmo.wijscatterchart.ts"/>
/// <reference path="../wijcandlestickchart/jquery.wijmo.wijcandlestickchart.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals jQuery, Globalize*/
    /*
    * Depends:
    *  raphael.js
    *  globalize.min.js
    *  jquery.ui.widget.js
    *  jquery.wijmo.wijchartcore.js
    *  jquery.wijmo.wijbarchart.js
    *  jquery.wijmo.wijlinechart.js
    *  jquery.wijmo.wijpiechart.js
    *  jquery.wijmo.wijscatterchart.js
    *
    */
    (function (_chart) {
        var wijcandlestickchartFn = $.wijmo.wijcandlestickchart;

        /**
        * @widget
        */
        var wijcompositechart = (function (_super) {
            __extends(wijcompositechart, _super);
            function wijcompositechart() {
                _super.apply(this, arguments);
            }
            wijcompositechart.prototype._create = function () {
                var self = this, o = self.options, defFill = self._getDefFill(), yAxis, yAxes, severOptions;

                $.each(o.seriesList, function (idx, series) {
                    if (series.type === "bar") {
                        if ($.isArray(o.axis.y)) {
                            $.each(o.axis.y, function (idx, yAxis) {
                                yAxis.compass = self._adjustCompassForBarChart(yAxis.compass, "y");
                            });
                        } else {
                            o.axis.y.compass = self._adjustCompassForBarChart(o.axis.y.compass, "y");
                        }
                        o.axis.x.compass = self._adjustCompassForBarChart(o.axis.x.compass, "x");
                        return true;
                    } else if (series.type === "pie" && series.pieSeriesList) {
                        series.data = series.pieSeriesList;
                    } else if (series.type === "sharedPie" && series.sharedPieChartSeries && series.sharedPieChartSeries.length > 0) {
                        $.each(series.sharedPieChartSeries, function (i, sPCSeries) {
                            if (sPCSeries.pieSeriesList) {
                                sPCSeries.data = sPCSeries.pieSeriesList;
                            }
                        });
                        series.data = series.sharedPieChartSeries;
                    } else if (series.candlestickSeries && series.candlestickSeries.data && $.inArray(series.type, ["hl", "ohlc", "candlestick"]) != -1) {
                        series.data = series.candlestickSeries.data;
                    } else if (series.type === _chart.ChartConsts.strTrendline) {
                        if (series.trendlineSeries) {
                            if (series.trendlineSeries.data) {
                                series.data = series.trendlineSeries.data;
                            }
                            series.fitType = series.trendlineSeries.fitType;
                            series.order = series.trendlineSeries.order;
                            series.sampleCount = series.trendlineSeries.sampleCount;
                        }
                    }
                });

                $.extend(true, {
                    compass: "east"
                }, o.hint);

                // set the is100percent to default value.
                if (o.is100Percent) {
                    o.is100Percent = false;
                }

                //add a new variable which type is set to any in order to access yAxes and the typescript builds successfully.
                severOptions = o;

                //handle the multiple y axis for extender, controls and AngularJS markup .
                if (severOptions.yAxes && $.isArray(severOptions.yAxes) && severOptions.yAxes.length > 0) {
                    // for composite chart, if user set the y axis option, here should get the settings from y axis.
                    yAxes = [];

                    //yAxis = $.extend(true, {}, o.axis.y);
                    //o.axis.y = o.yAxes;
                    $.each(severOptions.yAxes, function (i, axis) {
                        yAxes.push($.extend({}, severOptions.axis.y, axis));
                    });
                    o.axis.y = yAxes;
                }
                self._handleChartStyles();

                self._checkChartType();

                _super.prototype._create.call(this);
                self.chartElement.addClass(o.wijCSS.compositechart);
            };

            wijcompositechart.prototype._setOption = function (key, value) {
                // ignore the is100Percent option.
                if (key !== "is100Percent") {
                    if (key === "axis" && this.isContainsCandlestick) {
                        if (wijcandlestickchartFn) {
                            wijcandlestickchartFn.prototype._handleMaxMinInAxis.apply(this, [value]);
                        }
                    }
                    _super.prototype._setOption.call(this, key, value);
                }
            };

            wijcompositechart.prototype._seriesListSeted = function () {
                this._checkChartType();
                //if (this.isContainsCandlestick) {
                //    if (this.timeUtil) {
                //        this.timeUtil.dispose();
                //        this.timeUtil = null;
                //    }
                //	this._handleXDataForCandlestick();
                //}
            };

            wijcompositechart.prototype._supportStacked = function () {
                return true;
            };

            wijcompositechart.prototype._adjustCompassForBarChart = function (compass, axisType) {
                var adjustCompass;
                switch (compass) {
                    case "west":
                        if (axisType === "y") {
                            adjustCompass = "south";
                        } else {
                            adjustCompass = compass;
                        }
                        break;
                    case "east":
                        if (axisType === "y") {
                            adjustCompass = "north";
                        } else {
                            adjustCompass = compass;
                        }
                        break;
                    case "south":
                        if (axisType === "x") {
                            adjustCompass = "west";
                        } else {
                            adjustCompass = compass;
                        }
                        break;
                    case "north":
                        if (axisType === "x") {
                            adjustCompass = "east";
                        } else {
                            adjustCompass = compass;
                        }
                        break;
                    default:
                        if (axisType === "x") {
                            adjustCompass = "west";
                        } else {
                            adjustCompass = "south";
                        }
                        break;
                }
                return adjustCompass;
            };

            /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            wijcompositechart.prototype.destroy = function () {
                var self = this, element = self.chartElement, fields = element.data("fields"), aniBarsAttr = fields && fields.aniBarsAttr;

                element.removeClass(self.options.wijCSS.compositechart);
                if (this.timeUtil) {
                    this.timeUtil.dispose();
                }
                _super.prototype.destroy.call(this);
                self._destroyRaphaelArray(aniBarsAttr);
                self.aniPathsAttr = null;

                element.data("fields", null);
            };

            wijcompositechart.prototype._isBarChart = function () {
                return true;
            };

            wijcompositechart.prototype._clearChartElement = function () {
                var self = this, o = self.options, element = self.chartElement, fields = element.data("fields");

                if (fields && fields.allElements) {
                    $.each(fields.allElements, function (key, eles) {
                        if (key === "scatters") {
                            if (eles.length) {
                                $.each(eles, function (i, ele) {
                                    if (ele.length) {
                                        $.each(ele, function (j, n) {
                                            if (n && n.remove) {
                                                n.remove();
                                            }
                                            ele[j] = null;
                                        });
                                        eles[i] = null;
                                    }
                                });
                            }
                        }
                        self._destroyRaphaelArray(eles);
                    });
                    fields.allElements = null;
                }

                _super.prototype._clearChartElement.call(this);
                if (fields && fields.ctracers) {
                    fields.ctracers = null;
                }

                self.element.removeData("plotInfos");

                if (!o.seriesTransition.enabled) {
                    if (fields && fields.aniBarsAttr) {
                        fields.aniBarsAttr = null;
                    }
                }

                if (fields && fields.pieSeriesTitles) {
                    self._destroyRaphaelArray(fields.pieSeriesTitles);
                }
            };

            // handle data bind
            wijcompositechart.prototype._bindSeriesData = function (ds, series, sharedXList) {
                var _this = this;
                var self = this, data = series.data, type = series.type, dataLabel, dataValue, dataOffset, pieData = [], sharedPieData;
                if (type === "pie") {
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
                            pieData.push({
                                data: val,
                                label: label,
                                offset: offset,
                                legendEntry: true
                            });
                        });
                        series.data = pieData;
                    }
                } else if (type === "sharedPie") {
                    if ($.isArray(data)) {
                        series.sharedPieChartSeries = [];
                        $.each(data, function (pIndex, pData) {
                            var pieChartData = pData.data;
                            var pieDataSource = pData.datasource;
                            if (pieDataSource) {
                                dataLabel = pieChartData.label;
                                dataValue = pieChartData.value;
                                dataOffset = pieChartData.offset;
                                if (dataLabel && dataLabel.bind) {
                                    dataLabel = self._getBindData(pieDataSource, dataLabel.bind);
                                }
                                if (dataValue && dataValue.bind) {
                                    dataValue = self._getBindData(pieDataSource, dataValue.bind);
                                }
                                if (dataOffset && dataOffset.bind) {
                                    dataOffset = self._getBindData(pieDataSource, dataOffset.bind);
                                }
                                sharedPieData = {
                                    center: pData.center,
                                    label: pData.label,
                                    legendEntry: pData.legendEntry,
                                    radius: pData.radius,
                                    data: []
                                };
                                if (dataValue) {
                                    $.each(dataValue, function (idx, val) {
                                        var label, offset = 0;
                                        if (idx >= 0 && idx < dataLabel.length) {
                                            label = dataLabel[idx];
                                        }
                                        if (dataOffset && $.isArray(dataValue) && dataOffset.length && idx >= 0 && idx < dataOffset.length) {
                                            offset = typeof dataOffset[idx] === 'undefined' ? 0 : dataOffset[idx];
                                        }
                                        sharedPieData.data.push({
                                            data: val,
                                            label: label,
                                            offset: offset,
                                            legendEntry: true
                                        });
                                    });
                                }
                                series.sharedPieChartSeries.push(sharedPieData);
                            }
                        });

                        var sharedPieLegendInfors = [];
                        var pieSeries;

                        if (dataLabel && $.isArray(dataLabel)) {
                            $.each(dataLabel, function (dlIndex, label) {
                                pieSeries = {};
                                pieSeries.valueArray = [];
                                pieSeries.label = label;
                                pieSeries.legendEntry = (series.legendEntry !== false);

                                sharedPieLegendInfors.push(pieSeries);
                            });
                        }
                        series.sharedPieLegends = sharedPieLegendInfors;
                    }
                } else {
                    _super.prototype._bindSeriesData.call(this, ds, series, sharedXList);
                    if (data.x && $.isArray(data.x)) {
                        this.bindXData = true;
                    }
                    $.each(["high", "low", "open", "close", "y1"], function (i, name) {
                        var d = data[name];
                        if (d && d.bind) {
                            data[name] = _this._getBindData(ds, d.bind);
                        }
                    });
                }
            };

            wijcompositechart.prototype._preHandleSeriesData = function () {
                var self = this, o = self.options, tempPieSharedSeries, pieLegend;

                if (self.isContainsCandlestick) {
                    if (self.timeUtil) {
                        self.timeUtil.dispose();
                        self.timeUtil = null;
                    }
                    self._handleXDataForCandlestick();
                }

                _super.prototype._preHandleSeriesData.call(this);

                $.each(o.seriesList, function (i, series) {
                    if (series.type === "sharedPie") {
                        if (!series.sharedPieChartSeries || series.sharedPieChartSeries.length === 0) {
                            series.sharedPieChartSeries = [];
                            for (var j = 0; j < series.data.length; j++) {
                                if (series.data[j]) {
                                    series.sharedPieChartSeries.push(series.data[j]);
                                }
                            }
                        }
                        if (!series.sharedPieLegends || series.sharedPieLegends.length === 0) {
                            series.sharedPieLegends = [];
                            if (series.sharedPieChartSeries.length === 0) {
                                return;
                            }
                            tempPieSharedSeries = series.sharedPieChartSeries[0];
                            $.each(tempPieSharedSeries.data, function (tdIndex, tdata) {
                                pieLegend = {};
                                pieLegend.label = tdata.label;
                                pieLegend.legendEntry = tdata.legendEntry;
                                pieLegend.visible = (tdata.visible !== false);
                                series.sharedPieLegends.push(pieLegend);
                            });
                        }
                    }
                });
            };

            /**
            * Returns the raphael element with the given type and index.
            * @param {string} type The type of the chart element.
            * @param {number} index The index of the element.
            * @param {number} seriesIndex The index of the series.
            * @returns {Raphael Element} Returns the specified raphael object.
            */
            wijcompositechart.prototype.getElement = function (type, index, seriesIndex) {
                var element = this.chartElement, fields = element.data("fields"), chartElements = fields.chartElements;

                switch (type) {
                    case "bar":
                    case "column":
                        return chartElements.bars[index];
                    case "line":
                    case "area":
                        return chartElements.paths[index];
                    case "linemarkers":
                        return chartElements.markersSet[index];
                    case "pie":
                    case "sharedPie":
                        //return chartElements.sectors[index];
                        return this._getPie(chartElements, index, seriesIndex);
                    case _chart.ChartConsts.strTrendline:
                        return chartElements.trendLines[index];
                }

                return null;
            };

            wijcompositechart.prototype._getPie = function (chartElements, index, seriesIndex) {
                if (seriesIndex !== undefined) {
                    if (chartElements["sectors" + seriesIndex]) {
                        return chartElements["sectors" + seriesIndex][index];
                    }
                    return null;
                } else {
                    var sectors = [];
                    $.each(chartElements, function (key, val) {
                        if (/sectors/.test(key) && key !== "sectors") {
                            $.each(val, function (i, n) {
                                sectors.push(n);
                            });
                        }
                    });
                    if (sectors.length === 0) {
                        sectors = chartElements.sectors;
                    }
                    return sectors[index];
                }
            };

            wijcompositechart.prototype._getLegendSeriesInfoList = function () {
                var self = this, o = self.options, legendInfo, chartsSeries = o.seriesList, chartsSeriesStyles = o.seriesStyles, legendInfoList = [], seriesIdx = 0;
                $.each(chartsSeries, function (idx, series) {
                    var seriesType;
                    if (series.isTrendline) {
                        if (series.legendEntry !== false) {
                            legendInfo = self._getTrendLineLegendInfoFromSeries(seriesIdx, series, chartsSeriesStyles[seriesIdx]);
                            legendInfoList.push(legendInfo);
                        }
                        seriesIdx++;
                    } else {
                        seriesType = series.type;
                        if (!(seriesType === "pie" || seriesType === "sharedPie")) {
                            if (series.legendEntry !== false) {
                                legendInfo = self._getLegendInfoFromSeries(seriesIdx, series, chartsSeriesStyles[seriesIdx]);
                                legendInfoList.push(legendInfo);
                            }
                            seriesIdx++;
                        } else {
                            var pieSeries = seriesType === "pie" ? series.data : series.sharedPieLegends;
                            $.each(pieSeries, function (j, data) {
                                data = $.extend({ legendEntry: series.legendEntry }, data);
                                if (data.legendEntry !== false) {
                                    legendInfo = self._getLegendInfoFromSeries(seriesIdx, data, chartsSeriesStyles[seriesIdx]);
                                    legendInfoList.push(legendInfo);
                                }
                                seriesIdx++;
                            });
                        }
                    }
                });

                return legendInfoList;
            };

            wijcompositechart.prototype._getLegendInfoFromSeries = function (seriesIdx, series, seriesStyle) {
                if (series.LegendEntry === false) {
                    return undefined;
                }

                var o = this.options, type = series.type, legendSize, strokeWidth, iconStyle, markerStyle, legendInfo;

                legendInfo = _super.prototype._getLegendInfoFromSeries.call(this, seriesIdx, series, seriesStyle);
                iconStyle = legendInfo.iconStyle;

                if (type === "line" || type === "area" || type === "spline" || type === "bezier") {
                    legendInfo.icon = "line";
                    legendSize = $.extend(true, { width: 22, height: 3 }, this.options.legend.size);
                    if (iconStyle) {
                        strokeWidth = legendSize.height;
                        iconStyle = $.extend(true, {}, iconStyle, {
                            "stroke-width": strokeWidth
                        });
                        if (iconStyle["stroke-dasharray"]) {
                            iconStyle = $.extend(true, {}, iconStyle, {
                                "stroke-width": 1,
                                "stroke-dasharray": iconStyle["stroke-dasharray"]
                            });
                        }
                    }
                    legendInfo.iconSize = legendSize;
                    legendInfo.iconStyle = iconStyle;
                    legendInfo.markers = series.markers ? series.markers.type : undefined;
                    legendInfo.markerVisible = series.markers ? series.markers.visible : false;

                    markerStyle = $.extend({
                        fill: iconStyle.stroke,
                        stroke: iconStyle.stroke,
                        opacity: 1
                    }, series.markerStyle);

                    legendInfo.markerStyle = markerStyle;
                } else if (type === "scatter" || type === "bubble") {
                    legendSize = $.extend(true, { width: 20, height: 10 }, this.options.legend.size);

                    var iconRadius = type === "scatter" ? 6 : (legendSize.r ? legendSize.r : Math.min(legendSize.width, legendSize.height));
                    markerStyle = $.extend({
                        fill: iconStyle.fill,
                        stroke: iconStyle.stroke,
                        opacity: 1
                    }, series.markerStyle);

                    legendInfo.iconStyle = markerStyle;

                    if (series.markerType) {
                        legendInfo.icon = series.markerType;
                    } else {
                        legendInfo.icon = "circle";
                    }

                    legendInfo.markers = undefined;
                    legendInfo.markerVisible = false;
                    legendInfo.markerStyle = undefined;
                    legendInfo.iconSize = $.extend(true, {}, { r: iconRadius }, legendSize);
                }

                return legendInfo;
            };

            wijcompositechart.prototype._showHideCandlestickSeries = function (seriesEle, type) {
                if (wijcandlestickchartFn) {
                    wijcandlestickchartFn.prototype._showHideSeries.apply(this, arguments);
                }
            };

            wijcompositechart.prototype._showSerieEles = function (seriesEle) {
                var type = seriesEle.type, eles = seriesEle.eles, sharedPieEles = [], showLabels = this.options.showChartLabels, dataObj;

                switch (type) {
                    case "pie":
                        if (eles) {
                            sharedPieEles = [seriesEle];
                        } else {
                            sharedPieEles = seriesEle.sharedSeriesEles;
                        }
                        $.each(sharedPieEles, function (i, seriseE) {
                            eles = seriseE.eles;
                            if (eles.sector) {
                                eles.sector.show();
                                if (eles.sector.shadow) {
                                    eles.sector.shadow.show();
                                }
                                if (eles.sector.tracker) {
                                    eles.sector.tracker.show();
                                }
                            }
                            if (eles.label) {
                                eles.label.show();
                            }
                        });
                        break;
                    case "line":
                    case "spline":
                    case "bezier":
                    case "area":
                        if (eles.markers) {
                            $.each(eles.markers, function (i, marker) {
                                dataObj = $(marker.node).data("wijchartDataObj");
                                if (dataObj && dataObj.lineSeries && dataObj.lineSeries.markers) {
                                    if (!dataObj.lineSeries.markers.visible) {
                                        return true;
                                    }
                                }
                                marker.show();
                            });
                        }

                        if (eles.dcl) {
                            $.each(eles.dcl, function (i, dcl) {
                                if (showLabels) {
                                    dcl.show();
                                }
                            });
                        }

                        if (eles.path) {
                            dataObj = $(eles.path.node).data("wijchartDataObj");

                            // if markers are invisible and line path is invisible, when click the legend, show the line path.
                            if (dataObj.visible || !(!dataObj.visible && dataObj.markers && dataObj.markers.visible)) {
                                eles.path.show();
                                if (eles.path.shadow) {
                                    eles.path.shadow.show();
                                }
                                if (eles.path.area) {
                                    eles.path.area.show();
                                }
                                if (eles.path.tracker) {
                                    eles.path.tracker.show();
                                }
                                if ($(eles.path.node).data("wijchartDataObj") && $(eles.path.node).data("wijchartDataObj").virtualMarkers) {
                                    $.each($(eles.path.node).data("wijchartDataObj").virtualMarkers, function (i, markerObj) {
                                        markerObj.visible = true;
                                    });
                                }
                            }
                        }
                        break;
                    case "bar":
                    case "column":
                        $.each(eles, function (i, bar) {
                            if (bar.bar) {
                                bar.bar.show();
                                if (bar.bar.shadow) {
                                    bar.bar.shadow.show();
                                }
                                if (bar.bar.tracker) {
                                    bar.bar.tracker.show();
                                }
                                if ($(bar.bar.node).data("wijchartDataObj")) {
                                    $(bar.bar.node).data("wijchartDataObj").visible = true;
                                }
                            }
                            if (bar.dcl) {
                                bar.dcl.show();
                            }
                            if (bar.animatedBar && !bar.animatedBar.removed) {
                                bar.animatedBar.show();
                            }
                        });
                        break;
                    case "scatter":
                        $.each(eles, function (i, dot) {
                            dot.show();
                            if (dot.label) {
                                dot.label.show();
                            }
                            if ($(dot.element).data("wijchartDataObj")) {
                                $(dot.element).data("wijchartDataObj").visible = true;
                            }
                        });
                        break;
                    case "ohlc":
                    case "hl":
                    case "candlestick":
                        this._showHideCandlestickSeries(eles, "show");
                        break;
                    case "bubble":
                        $.each(eles, function (i, bubbleInfo) {
                            if (bubbleInfo.bubble) {
                                bubbleInfo.bubble.show();
                                if (bubbleInfo.bubble.shadow) {
                                    bubbleInfo.bubble.shadow.show();
                                }
                                if (bubbleInfo.bubble.tracker) {
                                    bubbleInfo.bubble.tracker.show();
                                }
                                if ($(bubbleInfo.bubble.node).data("wijchartDataObj")) {
                                    $(bubbleInfo.bubble.node).data("wijchartDataObj").visible = true;
                                }
                            }
                            if (bubbleInfo.dcl) {
                                bubbleInfo.dcl.show();
                            }
                            if (bubbleInfo.symbol) {
                                bubbleInfo.symbol.show();
                            }
                        });
                    case _chart.ChartConsts.strTrendline:
                        _chart.TrendlineRender.showSerieEles(eles);
                        break;
                }
            };

            wijcompositechart.prototype._hideSerieEles = function (seriesEle) {
                var type = seriesEle.type, eles = seriesEle.eles, sharedPieEles = [];

                switch (type) {
                    case "pie":
                        if (eles) {
                            sharedPieEles = [seriesEle];
                        } else {
                            sharedPieEles = seriesEle.sharedSeriesEles;
                        }
                        $.each(sharedPieEles, function (i, seriseE) {
                            eles = seriseE.eles;
                            if (eles.sector) {
                                eles.sector.hide();
                                if (eles.sector.shadow) {
                                    eles.sector.shadow.hide();
                                }
                                if (eles.sector.tracker) {
                                    eles.sector.tracker.hide();
                                }
                            }
                            if (eles.label) {
                                eles.label.hide();
                            }
                        });
                        break;
                    case "line":
                    case "spline":
                    case "bezier":
                    case "area":
                        if (eles.markers) {
                            $.each(eles.markers, function (i, marker) {
                                marker.hide();
                            });
                        }

                        if (eles.dcl) {
                            $.each(eles.dcl, function (i, dcl) {
                                dcl.hide();
                            });
                        }

                        if (eles.path) {
                            eles.path.hide();
                            if (eles.path.shadow) {
                                eles.path.shadow.hide();
                            }
                            if (eles.path.area) {
                                eles.path.area.hide();
                            }
                            if (eles.path.tracker) {
                                eles.path.tracker.hide();
                            }
                            if ($(eles.path.node).data("wijchartDataObj") && $(eles.path.node).data("wijchartDataObj").virtualMarkers) {
                                $.each($(eles.path.node).data("wijchartDataObj").virtualMarkers, function (i, markerObj) {
                                    markerObj.visible = false;
                                });
                            }
                        }
                        break;
                    case _chart.ChartConsts.strTrendline:
                        _chart.TrendlineRender.hideSerieEles(eles);
                        break;
                    case "bar":
                    case "column":
                        $.each(eles, function (i, bar) {
                            if (bar.bar) {
                                bar.bar.hide();
                                if (bar.bar.shadow) {
                                    bar.bar.shadow.hide();
                                }
                                if (bar.bar.tracker) {
                                    bar.bar.tracker.hide();
                                }
                                if ($(bar.bar.node).data("wijchartDataObj")) {
                                    $(bar.bar.node).data("wijchartDataObj").visible = false;
                                }
                            }
                            if (bar.dcl) {
                                bar.dcl.hide();
                            }
                            if (bar.animatedBar && !bar.animatedBar.removed) {
                                bar.animatedBar.hide();
                            }
                        });
                        break;
                    case "scatter":
                        $.each(eles, function (i, dot) {
                            dot.hide();
                            if (dot.label) {
                                dot.label.hide();
                            }
                            if ($(dot.element).data("wijchartDataObj")) {
                                $(dot.element).data("wijchartDataObj").visible = false;
                            }
                        });
                        break;
                    case "ohlc":
                    case "hl":
                    case "candlestick":
                        this._showHideCandlestickSeries(eles, "hide");
                        break;
                    case "bubble":
                        $.each(eles, function (i, bubbleInfo) {
                            if (bubbleInfo.bubble) {
                                bubbleInfo.bubble.hide();
                                if (bubbleInfo.bubble.shadow) {
                                    bubbleInfo.bubble.shadow.hide();
                                }
                                if (bubbleInfo.bubble.tracker) {
                                    bubbleInfo.bubble.tracker.hide();
                                }
                                if ($(bubbleInfo.bubble.node).data("wijchartDataObj")) {
                                    $(bubbleInfo.bubble.node).data("wijchartDataObj").visible = false;
                                }
                            }
                            if (bubbleInfo.dcl) {
                                bubbleInfo.dcl.hide();
                            }
                            if (bubbleInfo.symbol) {
                                bubbleInfo.symbol.hide();
                            }
                        });
                        break;
                }
            };

            wijcompositechart.prototype._indicatorLineShowing = function (objs) {
                var type;
                _super.prototype._indicatorLineShowing.call(this, objs);
                $.each(objs, function (i, obj) {
                    type = obj.type;
                    if (type === "column" || type === "bar") {
                        if (obj.bar) {
                            obj.bar.attr(obj.hoverStyle);
                        }
                    } else if (type === "marker") {
                        if (obj.marker) {
                            obj.marker.attr(obj.markerHoverStyle);
                        }
                    } else if (type === "scatter") {
                        if (obj.dot) {
                            obj.dot.attr(obj.hoverStyle);
                            obj.dot.scale(1.5, 1.5);
                        }
                    }
                });
            };

            wijcompositechart.prototype._removeIndicatorStyles = function (objs) {
                var type;
                $.each(objs, function (i, obj) {
                    type = obj.type;
                    if (type === "column" || type === "bar") {
                        if (obj.bar) {
                            obj.bar.attr(obj.style);
                        }
                    } else if (type === "marker") {
                        if (obj.marker) {
                            obj.marker.attr(obj.markerStyle);
                            obj.marker.transform("s1");
                        }
                    } else if (type === "scatter") {
                        if (obj.dot) {
                            obj.dot.attr(obj.style);
                            obj.dot.scale(1, 1);
                        }
                    }
                });
            };

            wijcompositechart.prototype._paintTooltip = function () {
                var self = this, element = self.chartElement, fields = element.data("fields") || {}, ctracers = fields.ctracers || [];

                _super.prototype._paintTooltip.call(this);

                if (self.tooltip) {
                    $.each(ctracers, function (idx, ctracer) {
                        if (ctracer.trackers && ctracer.trackers.length) {
                            if (idx === 0) {
                                self.tooltip.setOptions({ relatedElement: ctracer.trackers[0] });
                            }
                        }
                    });
                }
            };

            wijcompositechart.prototype._setDefaultTooltipText = function (data) {
                if (data.type === "candlestick" && wijcandlestickchartFn) {
                    return wijcandlestickchartFn.prototype._setDefaultTooltipText.apply(this, arguments);
                }
                return _super.prototype._setDefaultTooltipText.call(this, data);
            };

            wijcompositechart.prototype._checkChartType = function () {
                var _this = this;
                this.isContainsBubble = false;
                this.isContainsCandlestick = false;

                $.each(this.options.seriesList, function (i, series) {
                    var type = series.type;
                    if (!_this.isContainsCandlestick && (type === "ohlc" || type === "hl" || type === "candlestick")) {
                        _this.isContainsCandlestick = true;
                    } else if (!_this.isContainsBubble && type === "bubble") {
                        _this.isContainsBubble = true;
                    }
                });
            };

            wijcompositechart.prototype._handleXDataForCandlestick = function () {
                if (wijcandlestickchartFn) {
                    wijcandlestickchartFn.prototype._handleXData.apply(this, arguments);
                }
            };

            wijcompositechart.prototype._isCandlestickSeries = function (series) {
                var type = series.type;
                return type === "ohlc" || type === "hl" || type === "candlestick";
            };

            wijcompositechart.prototype._paintChartArea = function () {
                var self = this, seriesList = self.options.seriesList;

                if (self._isSeriesListDataEmpty()) {
                    return;
                }

                // add the hl to data.y
                $.each(seriesList, function (i, n) {
                    var data = n.data;
                    if (self._isCandlestickSeries(n)) {
                        data.y = [].concat(data.high).concat(data.low);
                    }
                });

                if (this.bubbleAxisAdjust) {
                    this.bubbleAxisAdjust.dispose();
                }
                this.bubbleAxisAdjust = new _chart.BubbleAxisAdjust(this);

                _super.prototype._paintChartArea.call(this);

                // delete data.y;
                // and recover data.x
                $.each(seriesList, function (i, n) {
                    if (self._isCandlestickSeries(n)) {
                        delete n.data.y;
                    }
                    if (n.data && n.data.originalXValue) {
                        n.data.x = n.data.originalXValue;
                        delete n.data.originalXValue;
                    }
                });
            };

            wijcompositechart.prototype._checkSeriesDataEmpty = function (series) {
                var type = series.type, data = series.data, result = false, checkEmptyData = this._checkEmptyData;

                if (this._isCandlestickSeries(series)) {
                    if (!data || checkEmptyData(data.x) || checkEmptyData(data.high) || checkEmptyData(data.low)) {
                        return true;
                    }
                    if (type === "ohlc" || type === "candlestick") {
                        if (checkEmptyData(data.open) || checkEmptyData(data.low)) {
                            return true;
                        }
                    }
                    return false;
                } else if (type === "pie") {
                    if (!data || !$.isArray(data)) {
                        return true;
                    }
                    return false;
                } else if (type === "sharedPie") {
                    data = series.sharedPieChartSeries;

                    if (!data || !$.isArray(data)) {
                        result = true;
                    } else {
                        $.each(series.sharedPieChartSeries, function (ssIndex, ssItem) {
                            if (ssItem.data && $.isArray(ssItem.data)) {
                                result = false;
                                return false;
                            }
                        });
                    }
                    return result;
                } else {
                    if (type === "bubble") {
                        if (!data || checkEmptyData(data.y1)) {
                            return true;
                        }
                    }
                    return _super.prototype._checkSeriesDataEmpty.call(this, series);
                }
            };

            wijcompositechart.prototype._getXAxisInfoValueLabels = function (xAxisInfo, xAxisOptions) {
                if (this.isContainsCandlestick && xAxisInfo.id === "x") {
                    wijcandlestickchartFn.prototype._getXAxisInfoValueLabels.apply(this, arguments);
                } else {
                    _super.prototype._getXAxisInfoValueLabels.call(this, xAxisInfo, xAxisOptions);
                }
            };

            wijcompositechart.prototype._calculateMajorMinor = function (axisOptions, axisInfo) {
                if (this.isContainsCandlestick && axisInfo.id === "x") {
                    wijcandlestickchartFn.prototype._calculateMajorMinor.apply(this, arguments);
                } else {
                    _super.prototype._calculateMajorMinor.call(this, axisOptions, axisInfo);
                }
            };

            wijcompositechart.prototype._adjustXValueLabelsByMajorUnit = function (unitMajor, axisInfo) {
                if (this.isContainsCandlestick && axisInfo.id === "x") {
                    wijcandlestickchartFn.prototype._adjustXValueLabelsByMajorUnit.apply(this, arguments);
                }
            };

            wijcompositechart.prototype._getXTickText = function (text) {
                //return text;
                var self = this, formatString = self.formatString;
                if (self.isContainsCandlestick && wijcandlestickchartFn) {
                    return wijcandlestickchartFn.prototype._getXTickText.apply(this, arguments);
                }
                return text;
            };

            wijcompositechart.prototype._adjustTickValuesForCandlestickChart = function (tickValues) {
                if (this.isContainsCandlestick && wijcandlestickchartFn) {
                    return wijcandlestickchartFn.prototype._adjustTickValuesForCandlestickChart.apply(this, arguments);
                } else {
                    return _super.prototype._adjustTickValuesForCandlestickChart.call(this, tickValues);
                }
            };

            wijcompositechart.prototype._getTickTextForCalculateUnit = function (value, axisInfo, prec) {
                if (axisInfo.id === "x" && this.isContainsCandlestick) {
                    return wijcandlestickchartFn.prototype._getTickTextForCalculateUnit.apply(this, arguments);
                }
                return _super.prototype._getTickTextForCalculateUnit.call(this, value, axisInfo, prec);
            };

            wijcompositechart.prototype._AdjustAxisBounds = function (axisInfo, axisOptions) {
                var self = this, o = self.options, mx, mn, sizeMax, sizeMin, maxData = axisInfo.max, minData = axisInfo.min, dx = maxData - minData, prec = _chart.ChartDataUtil.nicePrecision(dx), _prec = prec + 1, bounds = axisInfo.bounds, textStyle = $.extend(true, {}, o.textStyle, axisOptions.textStyle, axisOptions.labels.style);

                mx = self._text(-1000, -1000, $.round(maxData, _prec).toString()).attr(textStyle);
                mn = self._text(-1000, -1000, $.round(minData, _prec).toString()).attr(textStyle);

                sizeMax = mx.wijGetBBox();
                sizeMin = mn.wijGetBBox();

                if (!axisInfo.isStartAxis) {
                    bounds.startY += sizeMin.height;
                }

                if (!axisInfo.isLastAxis) {
                    bounds.endY -= (sizeMax.height);
                }
            };

            wijcompositechart.prototype._initYAxisHeight = function () {
                var self = this, o = self.options, axisOpt = o.axis, yaxisOpt = axisOpt.y, bounds = self.canvasBounds, width = bounds.endX - bounds.startX, height = bounds.endY - bounds.startY, axisInfo = self.axisInfo, yAxisInfo = axisInfo.y, othersHeight = 0, autoHeightIndex = -1, totalHeight = 0, lastBounds;

                if ($.isArray(yaxisOpt)) {
                    $.each(yaxisOpt, function (i, axisOpt) {
                        if (axisOpt.height && !isNaN(axisOpt.height)) {
                            othersHeight += axisOpt.height;
                        } else if (axisOpt.height === "auto") {
                            autoHeightIndex = i;
                        }

                        yAxisInfo[i].height = axisOpt.height;
                    });

                    if (autoHeightIndex > -1) {
                        yAxisInfo[autoHeightIndex].height = height - othersHeight;
                    }

                    $.each(yAxisInfo, function (i, axis) {
                        var yHeight = axis.height;

                        if (yHeight === undefined || yHeight === null) {
                            return true;
                        }

                        if (yHeight > 0) {
                            axis.isPartAxis = true;
                            axis.isLastAxis = (parseInt(i) === yaxisOpt.length - 1);
                            axis.isStartAxis = parseInt(i) === 0;
                        }

                        if (!lastBounds) {
                            axis.bounds = {
                                startY: bounds.startY,
                                endY: bounds.startY + yHeight
                            };
                        } else {
                            axis.bounds = {
                                startY: lastBounds.endY,
                                endY: lastBounds.endY + yHeight
                            };
                        }
                        axis.bounds.startX = bounds.startX;
                        axis.bounds.endX = bounds.endX;
                        self._AdjustAxisBounds(axis, yaxisOpt[i]);
                        if (axis.bounds) {
                            lastBounds = $.extend({}, axis.bounds);
                        }
                    });
                }
            };

            wijcompositechart.prototype._getDataExtreme = function (isMultiYAxis) {
                var self = this;
                self._initYAxisHeight();
                return _super.prototype._getDataExtreme.call(this, isMultiYAxis);
            };

            wijcompositechart.prototype._getPieRendererData = function (series, pieID, styles, hoverStyles, styleStartIndex) {
                var pie = {}, style = {}, hoverStyle = {}, seriesData = series.data;
                pie.sIndex = styleStartIndex;

                $.each(seriesData, function (j, data) {
                    data.pieID = pieID;
                    style = $.extend({}, styles[styleStartIndex]);
                    hoverStyle = $.extend({}, hoverStyles[styleStartIndex]);

                    if (!pie["seriesList"]) {
                        pie["seriesList"] = [];
                    }

                    if (!pie["seriesStyles"]) {
                        pie["seriesStyles"] = [];
                    }

                    if (!pie["seriesHoverStyles"]) {
                        pie["seriesHoverStyles"] = [];
                    }
                    pie["seriesList"].push(data);
                    pie["seriesStyles"].push(style);
                    pie["seriesHoverStyles"].push(hoverStyle);

                    styleStartIndex++;
                });
                pie.radius = series.radius;
                pie.center = series.center;
                pie.label = series.label;

                return pie;
            };

            wijcompositechart.prototype._paintPlotArea = function () {
                var self = this, o = self.options, seriesList = "seriesList", seriesStyles = "seriesStyles", seriesHoverStyles = "seriesHoverStyles", styles = o[seriesStyles], hoverStyles = o[seriesHoverStyles], bounds = self.canvasBounds, charts = {}, index = 0, pSIndex = -1, seriesIndexs = [], isMulityYAxis = $.isArray(o.axis.y), options = {
                    canvas: self.canvas,
                    tooltip: self.tooltip,
                    bounds: bounds,
                    widgetName: self.widgetName,
                    seriesTransition: o.seriesTransition,
                    showChartLabels: o.showChartLabels,
                    textStyle: o.textStyle,
                    chartLabelStyle: o.chartLabelStyle,
                    chartLabelFormatString: o.chartLabelFormatString,
                    chartLabelFormatter: o.chartLabelFormatter,
                    shadow: o.shadow,
                    hint: o.hint,
                    animation: o.animation,
                    disabled: self._isDisabled(),
                    culture: self._getCulture(),
                    widget: this,
                    wijCSS: o.wijCSS,
                    mouseDown: function (e, args) {
                        self._trigger("mouseDown", e, args);
                    },
                    mouseUp: function (e, args) {
                        self._trigger("mouseUp", e, args);
                    },
                    mouseOver: function (e, args) {
                        self._trigger("mouseOver", e, args);
                    },
                    mouseOut: function (e, args) {
                        self._trigger("mouseOut", e, args);
                    },
                    mouseMove: function (e, args) {
                        self._trigger("mouseMove", e, args);
                    },
                    click: function (e, args) {
                        self._trigger("click", e, args);
                    }
                }, fields = self.chartElement.data("fields"), pieID = -1, stepIndex, tempSerieses, sharedPies, tmpOptions, chartgroup, _chartRender;

                if (fields) {
                    fields.ctracers = [];
                }

                $.each(o[seriesList], function (i, series) {
                    var type = _chart.TrendlineRender.getSeriesChartType(series), chartItem = {}, chartType = type, pie = {}, style = $.extend({}, styles[index]), hoverStyle = $.extend({}, hoverStyles[index]), yAxis = series.yAxis;

                    if (!type || type.length === 0) {
                        return true;
                    }

                    if (chartType === "spline" || chartType === "bezier") {
                        chartType = "line";
                    }
                    if (chartType === "sharedPie") {
                        chartType = "pie";
                    }

                    chartItem = charts[chartType];

                    if (!chartItem) {
                        if (type === "pie" || type === "sharedPie") {
                            chartItem = [];
                        } else {
                            chartItem = {};
                        }

                        charts[chartType] = chartItem;

                        if (series.hint) {
                            chartItem.hint = series.hint;

                            if (!o.hint.content) {
                                o.hint.content = series.hint.content;
                            }

                            if (!o.hint.title) {
                                o.hint.title = series.hint.title;
                            }
                        }
                    }
                    if (type === "pie") {
                        if (pieID === -1) {
                            pieID = i + 1;
                        }
                        if (pSIndex === -1) {
                            pSIndex = index;
                        }

                        pie = self._getPieRendererData(series, pieID, styles, hoverStyles, index);

                        chartItem.push(pie);
                        pieID++;

                        index = pSIndex + (series.data.length ? series.data.length : 0);

                        pSIndex = -1;
                        return true;
                    } else if (type === "sharedPie") {
                        if (pieID === -1) {
                            pieID = i + 1;
                        }
                        tempSerieses = series.sharedPieChartSeries; // ? series.sharedPieChartSeries : [];
                        sharedPies = { type: "sharedPies", pies: [] };

                        if (pSIndex === -1) {
                            pSIndex = index;
                        }
                        $.each(tempSerieses, function (spindex, tSeries) {
                            pie = {};
                            tSeries.radius = tSeries.radius || series.radius;
                            tSeries.label = tSeries.label || series.label;
                            if (!tSeries.center && series.center) {
                                tSeries.center = { x: series.center.x, y: series.center.y };
                            }

                            index = pSIndex;
                            pie = self._getPieRendererData(tSeries, pieID, styles, hoverStyles, index);

                            sharedPies.pies.push(pie);
                            pieID++;
                            index = pSIndex + (tSeries.data.length ? tSeries.data.length : 0);
                        });
                        if (type === "sharedPie") {
                            chartItem.push(sharedPies);
                        }
                        pSIndex = -1;
                        return true;
                    } else if (type === "column") {
                        chartItem.horizontal = false;
                    } else if (type === "bar") {
                        chartItem.horizontal = true;
                    } else if (type === "spline") {
                        series.fitType = "spline";
                    } else if (type === "bezier") {
                        series.fitType = "bezier";
                    }

                    if (isMulityYAxis) {
                        chartItem.yAxis = yAxis || 0;
                    }

                    if (type === "line" || type === "spline" || type === "bezier" || type === _chart.ChartConsts.strTrendline) {
                        delete style.fill;
                        delete hoverStyle.fill;
                    }

                    if (!chartItem[seriesList]) {
                        chartItem[seriesList] = [];
                    }

                    if (!chartItem[seriesStyles]) {
                        chartItem[seriesStyles] = [];
                    }

                    if (!chartItem[seriesHoverStyles]) {
                        chartItem[seriesHoverStyles] = [];
                    }

                    if (type === "scatter") {
                        chartItem.showChartLabels = o.showChartLabels;
                        if (series.showChartLabels !== undefined) {
                            chartItem.showChartLabels = series.showChartLabels;
                        }
                    }

                    series.sIndex = index;
                    chartItem[seriesList].push(series);
                    chartItem[seriesStyles].push(style);
                    chartItem[seriesHoverStyles].push(hoverStyle);
                    index++;
                });

                $.each(charts, function (type, chartItem) {
                    var chartModule = wijmo.chart;
                    var yAxisIndex = chartItem.yAxis, chartLabel;

                    if (yAxisIndex !== undefined && self.axisInfo.y[yAxisIndex].bounds) {
                        options.bounds = self.axisInfo.y[yAxisIndex].bounds;
                    }

                    switch (type) {
                        case "pie":
                            var pSIndex;
                            $.each(chartItem, function (cidx, chartpie) {
                                var isSharedPie = (chartpie.type === "sharedPies"), pies = isSharedPie ? chartpie.pies : [chartpie];
                                $.each(pies, function (idx, pie) {
                                    var center = pie.center, r = pie.radius || 50, pieBounds, width = bounds.endX - bounds.startX, height = bounds.endY - bounds.startY, seriesTitleText = pie.label, seriesTitleStyle = $.extend(true, {}, o.textStyle, o.chartLabelStyle), seriesTitle, textBounds;
                                    if (width < 2 * r) {
                                        r = width / 2;
                                    }
                                    if (height < 2 * r) {
                                        r = height / 2;
                                    }
                                    pie.radius = r;

                                    center = center ? center : {
                                        x: bounds.startX + width / 2,
                                        y: bounds.startY + height / 2
                                    };

                                    pieBounds = {
                                        startX: center.x - r,
                                        startY: center.y - r,
                                        endX: center.x + r,
                                        endY: center.y + r
                                    };

                                    tmpOptions = $.extend(true, {}, options, {
                                        bounds: pieBounds,
                                        radius: r,
                                        isTouchBehaviorEnable: false
                                    }, pie);
                                    _chartRender = new chartModule.PieChartRender(self.chartElement, tmpOptions);
                                    _chartRender.render();

                                    if (isSharedPie && seriesTitleText && seriesTitleText.length) {
                                        seriesTitle = self._text(0, 0, seriesTitleText).attr(seriesTitleStyle);
                                        textBounds = seriesTitle.wijGetBBox();

                                        // Offset 6px : Avoid the title being too close to the pie chart.
                                        seriesTitle.transform(Raphael.format("...T{0},{1}", center.x, center.y - r - (textBounds.height / 2 + 6)));

                                        if (!self.chartElement.data("fields").pieSeriesTitles) {
                                            self.chartElement.data("fields").pieSeriesTitles = [];
                                        }
                                        self.chartElement.data("fields").pieSeriesTitles.push(seriesTitle);
                                    }

                                    self.chartElement.data("fields").aniSectorAttrs = null;
                                    self.chartElement.data("fields").aniLabelAttrs = null;
                                    self._savechartData(type, pie.sIndex);
                                });
                            });

                            break;
                        case "bar":
                        case "column":
                            tmpOptions = $.extend(true, {}, options, {
                                stacked: o.stacked,
                                axis: o.axis,
                                clusterOverlap: o.clusterOverlap,
                                clusterWidth: o.clusterWidth,
                                clusterSpacing: o.clusterSpacing,
                                is100Percent: o.is100Percent,
                                clusterRadius: o.clusterRadius,
                                isYTime: self.axisInfo.y[0].isTime,
                                isXTime: self.axisInfo.x.isTime,
                                yAxisInfo: self.axisInfo.y,
                                yAxisIndex: yAxisIndex
                            }, chartItem);

                            _chartRender = new chartModule.BarChartRender(self.chartElement, tmpOptions);
                            _chartRender.render();
                            seriesIndexs = [];
                            $.each(chartItem.seriesList, function (i, sl) {
                                seriesIndexs.push(sl.sIndex);
                            });
                            self._savechartData(type, seriesIndexs);
                            break;
                        case "line":
                        case "spline":
                        case "bezier":
                        case "area":
                            chartgroup = self._getyAxisGroup(chartItem);
                            if (!self.aniPathsAttr) {
                                self.aniPathsAttr = {};
                            }
                            $.each(chartgroup, function (ykey, subchart) {
                                if (!self.aniPathsAttr[type]) {
                                    self.aniPathsAttr[type] = [];
                                }
                                tmpOptions = $.extend(true, {}, options, {
                                    axis: o.axis,
                                    isXTime: self.axisInfo.x.isTime,
                                    isYTime: self.axisInfo.y[0].isTime,
                                    //aniPathsAttr: self.aniPathsAttr,
                                    //chartLabelEles: self.chartLabelEles,
                                    type: type === "area" ? "area" : "line",
                                    hole: o.hole
                                }, subchart);
                                tmpOptions.aniPathsAttr = self.aniPathsAttr[type];
                                tmpOptions.chartLabelEles = self.chartLabelEles;
                                if (isMulityYAxis) {
                                    tmpOptions.axis.y = o.axis.y[ykey];
                                }

                                tmpOptions.extremeValue = {
                                    txx: self.extremeValue.txx,
                                    txn: self.extremeValue.txn,
                                    tyx: self.extremeValue.y[ykey].tyx,
                                    tyn: self.extremeValue.y[ykey].tyn
                                };

                                _chartRender = new chartModule.LineChartRender(self.chartElement, tmpOptions);
                                _chartRender.render();
                                seriesIndexs = [];
                                $.each(subchart.seriesList, function (i, sl) {
                                    seriesIndexs.push(sl.sIndex);
                                });
                                self._savechartData(type, seriesIndexs);
                            });
                            break;
                        case _chart.ChartConsts.strTrendline:
                            chartgroup = self._getyAxisGroup(chartItem);
                            if (!self.aniPathsAttr) {
                                self.aniPathsAttr = {};
                            }
                            $.each(chartgroup, function (ykey, subchart) {
                                if (!self.aniPathsAttr[type]) {
                                    self.aniPathsAttr[type] = [];
                                }
                                tmpOptions = $.extend(true, {}, options, {
                                    axis: o.axis,
                                    hole: o.hole
                                }, subchart);
                                tmpOptions.aniPathsAttr = self.aniPathsAttr[type];
                                if (isMulityYAxis) {
                                    tmpOptions.axis.y = o.axis.y[ykey];
                                }

                                tmpOptions.extremeValue = {
                                    txx: self.extremeValue.txx,
                                    txn: self.extremeValue.txn,
                                    y: {}
                                };
                                tmpOptions.extremeValue.y[ykey] = self.extremeValue.y[ykey];

                                _chartRender = new chartModule.TrendlineRender(self.chartElement, tmpOptions);
                                _chartRender.render();
                                seriesIndexs = [];
                                $.each(subchart.seriesList, function (i, sl) {
                                    seriesIndexs.push(sl.sIndex);
                                });
                                self._savechartData(type, seriesIndexs);
                            });
                            break;
                        case "scatter":
                            chartgroup = self._getyAxisGroup(chartItem);
                            $.each(chartgroup, function (ykey, subchart) {
                                tmpOptions = $.extend(true, {}, options, {
                                    axis: o.axis,
                                    isXTime: self.axisInfo.x.isTime,
                                    isYTime: self.axisInfo.y[0].isTime,
                                    zoomOnHover: o.zoomOnHover
                                }, subchart);
                                if (isMulityYAxis) {
                                    tmpOptions.axis.y = o.axis.y[ykey];
                                }

                                _chartRender = new chartModule.ScatterChartRender(self.chartElement, tmpOptions);
                                _chartRender.render();
                                seriesIndexs = [];
                                $.each(subchart.seriesList, function (i, sl) {
                                    seriesIndexs.push(sl.sIndex);
                                });
                                self._savechartData(type, seriesIndexs);
                            });
                            break;
                        case "ohlc":
                        case "hl":
                        case "candlestick":
                            chartgroup = self._getyAxisGroup(chartItem);
                            $.each(chartgroup, function (ykey, subchart) {
                                tmpOptions = $.extend(true, {}, options, {
                                    axis: o.axis,
                                    timeUtil: self.timeUtil,
                                    type: type
                                }, subchart);
                                if (isMulityYAxis) {
                                    tmpOptions.axis.y = o.axis.y[ykey];
                                }

                                // extend the styles.
                                tmpOptions.seriesStyles = wijcandlestickchartFn.prototype._getStyles(type, tmpOptions.seriesStyles, "seriesStyles", true);
                                tmpOptions.seriesHoverStyles = wijcandlestickchartFn.prototype._getStyles(type, tmpOptions.seriesHoverStyles, "seriesHoverStyles", true);
                                _chartRender = new chartModule.CandlestickChartRender(self.chartElement, tmpOptions);
                                _chartRender.render();
                                seriesIndexs = [];
                                $.each(subchart.seriesList, function (i, sl) {
                                    seriesIndexs.push(sl.sIndex);
                                });
                                self._savechartData(type, seriesIndexs);
                            });
                            break;
                        case "bubble":
                            chartgroup = self._getyAxisGroup(chartItem);

                            if (!chartLabel) {
                                chartLabel = { visible: o.showChartLabels, style: o.chartLabelStyle };
                            }

                            $.each(chartgroup, function (ykey, subchart) {
                                tmpOptions = $.extend(true, {}, options, {
                                    axis: o.axis,
                                    isXTime: self.axisInfo.x.isTime,
                                    isYTime: self.axisInfo.y[0].isTime,
                                    xAxisInfo: self.axisInfo.x,
                                    yAxisInfo: self.axisInfo.y,
                                    chartLabel: chartLabel,
                                    minimumSize: o.minimumSize || 5,
                                    maximumSize: o.maximumSize || 20,
                                    sizingMethod: o.sizingMethod || "diameter",
                                    bubbleRadius: self.bubbleAxisAdjust.bubbleRadius
                                }, subchart);

                                if (isMulityYAxis) {
                                    tmpOptions.axis.y = o.axis.y[ykey];
                                }
                                tmpOptions.yAxisInfo = self.axisInfo.y[ykey] || self.axisInfo.y[0];
                                _chartRender = new chartModule.BubbleChartRender(self.chartElement, tmpOptions);
                                _chartRender.render();
                                seriesIndexs = [];
                                $.each(subchart.seriesList, function (i, sl) {
                                    seriesIndexs.push(sl.sIndex);
                                });
                                self._savechartData(type, seriesIndexs);
                            });
                            break;
                            break;
                    }
                });
                self.chartElement.data("fields").seriesEles = null;

                self._bindtooltip();
            };

            wijcompositechart.prototype._savechartData = function (type, sIndex) {
                var self = this, fields = self.chartElement.data("fields"), seriesEles = fields.seriesEles, allElements = fields.allElements || {}, ctracers, index = sIndex, sharedSeriesEles;

                if ($.isArray(index)) {
                    index = 0;
                }
                $.each(seriesEles, function (i, ele) {
                    // fixed the issue for legend click.
                    if ($.isArray(sIndex)) {
                        self.seriesEles[sIndex[index]] = { eles: ele, type: type };
                        index++;
                    } else {
                        if (type === "pie" && self.seriesEles[index]) {
                            if (!self.seriesEles[index].sharedSeriesEles) {
                                sharedSeriesEles = [self.seriesEles[index]];
                                self.seriesEles[index] = { type: "pie", sharedSeriesEles: sharedSeriesEles };
                            }

                            self.seriesEles[index].sharedSeriesEles.push({ eles: ele, type: type });
                        } else {
                            self.seriesEles[index] = { eles: ele, type: type };
                        }
                        index++;
                    }
                });

                ctracers = fields.ctracers || [];
                ctracers.push({
                    trackers: fields.trackers,
                    type: type
                });
                fields.ctracers = ctracers;

                if (fields && fields.chartElements) {
                    $.each(fields.chartElements, function (key, eles) {
                        self._copyElements(allElements, key, eles);
                    });
                }
                fields.allElements = allElements;
            };

            wijcompositechart.prototype._copyElements = function (target, key, source) {
                var tar;
                if (source && $.isArray(source)) {
                    tar = target[key] || [];
                    target[key] = tar.concat(source);
                } else if (source) {
                    tar = target[key] || [];
                    tar.concat([source]);
                }
            };

            wijcompositechart.prototype._getyAxisGroup = function (chart) {
                var group = {};
                $.each(chart.seriesList, function (idx, series) {
                    var yAxis = series.yAxis || 0;
                    if (!group[yAxis]) {
                        group[yAxis] = {
                            seriesList: [],
                            seriesStyles: [],
                            seriesHoverStyles: []
                        };
                    }
                    group[yAxis].seriesList.push(series);
                    group[yAxis].seriesStyles.push(chart.seriesStyles[idx]);
                    group[yAxis].seriesHoverStyles.push(chart.seriesHoverStyles[idx]);
                });
                return group;
            };

            wijcompositechart.prototype._bindtooltip = function () {
                var self = this, namespace = self.widgetName, fields = self.chartElement.data("fields");
                if (fields && fields.ctracers) {
                    $.each(fields.ctracers, function (index, ctracer) {
                        var type = ctracer.type;
                        if (ctracer.trackers) {
                            ctracer.trackers.toFront();
                        }
                    });
                }

                self.chartElement.delegate(".linetracker, .wijchart-canvas-marker, .bartracker, .pietracker, .wijscatterchart, .bubbletracker, .candlesticktracker, .trendlinetracker", "mouseover." + namespace, $.proxy(self._tooltipMouseOver, self));
                self.chartElement.delegate(".linetracker, .wijchart-canvas-marker, .bartracker, .pietracker, .wijscatterchart, .bubbletracker, .candlesticktracker, .trendlinetracker", "mouseout." + namespace, $.proxy(self._tooltipMouseOut, self));
                self.chartElement.delegate(".linetracker, .wijchart-canvas-marker, .bartracker, .pietracker, .wijscatterchart, .bubbletracker, .candlesticktracker, .trendlinetracker", "mousemove." + namespace, $.proxy(self._tooltipMouseMove, self));
            };

            wijcompositechart.prototype._tooltipMouseOver = function (e) {
                var target = e.target, self = this, tooltip = self.tooltip, hint = self.options.hint, op = null, title = hint.title, content = hint.content, hintStyle = hint.style, isTitleFunc = $.isFunction(title), isContentFunc = $.isFunction(content), data, bbox, position, raphaelObj;

                position = $(self.canvas.canvas.parentNode).offset();
                if (self.indicatorLine) {
                    return;
                }

                if ($(target).data("owner")) {
                    target = $(target).data("owner");
                }
                target = $(target);
                data = target.data("wijchartDataObj");
                if (self.tooltip) {
                    op = tooltip.getOptions();
                    if (isTitleFunc || isContentFunc) {
                        if (isTitleFunc) {
                            op.title = $.proxy(title, data);
                        }
                        if (isContentFunc) {
                            op.content = $.proxy(content, data);
                        }
                    }
                    if (data.type === "line" || data.type === "marker") {
                        if (data.type === "marker") {
                            data = data.lineSeries;
                        }
                        if (data.path.removed) {
                            return;
                        }
                        if (self.hoverLine !== data || self.hoverLine === null) {
                            self.isNewLine = true;
                            if (self.hoverLine) {
                                if (!self.hoverLine.path.removed) {
                                    self.hoverLine.path.wijAttr(self.hoverLine.lineStyle);
                                    if (self.hoverPoint && !self.hoverPoint.isSymbol) {
                                        self.hoverPoint.marker.wijAttr(self.hoverPoint.markerStyle);
                                        self.hoverPoint.marker.transform("s1");
                                    }
                                }
                            }
                            if (data.lineHoverStyle) {
                                data.path.wijAttr(data.lineHoverStyle);
                            }
                            self.hoverLine = data;
                            self.hoverPoint = null;
                            self.hoverVirtualPoint = null;
                        }
                    } else if (data.type === "scatter" || hint.relativeTo === "element") {
                        self._clearHoverState();
                        if (data.type === "scatter") {
                            bbox = data.dot.getBBox();
                        } else if (target[0] && target[0].raphael && target[0].raphaelid) {
                            raphaelObj = self.canvas.getById(target[0].raphaelid);
                            if (raphaelObj) {
                                bbox = raphaelObj.getBBox();
                            }
                        }
                        op.style.stroke = hintStyle.stroke || target.attr("stroke");
                        if (bbox) {
                            self.tooltip.showAt({
                                x: bbox.x + bbox.width / 2,
                                y: bbox.y
                            }, e);
                        }
                    } else {
                        self._clearHoverState();
                        if (data.type === _chart.ChartConsts.strTrendline) {
                            return;
                        }
                        op.style.stroke = hintStyle.stroke || target.attr("stroke");
                        self.tooltip.showAt({
                            x: e.pageX - position.left,
                            y: e.pageY - position.top
                        }, e);
                    }
                }
            };

            wijcompositechart.prototype._tooltipMouseMove = function (e) {
                var self = this, target = e.target, data, hint = self.options.hint, position = $(self.canvas.canvas.parentNode).offset();

                if ($(target).data("owner")) {
                    target = $(target).data("owner");
                }
                target = $(target);
                data = target.data("wijchartDataObj");

                if (self.tooltip && !this.indicatorLine) {
                    if (data.type !== "line" && data.type !== "marker" && data.type !== "scatter" && hint.relativeTo !== "element" && data.type !== _chart.ChartConsts.strTrendline) {
                        self.tooltip.showAt({
                            x: e.pageX - position.left,
                            y: e.pageY - position.top
                        }, e);
                    }
                }
            };

            wijcompositechart.prototype._tooltipMouseOut = function (e) {
                var self = this, target = e.target, data;

                if ($(target).data("owner")) {
                    target = $(target).data("owner");
                }
                target = $(target);
                data = target.data("wijchartDataObj");
                if (data.type !== "line" && data.type !== "marker" && !self.indicatorLine) {
                    if (self.tooltip) {
                        self.tooltip.hide();
                    }
                }
            };

            wijcompositechart.prototype._mouseMoveInsidePlotArea = function (e, mousePos) {
                var self = this, tooltip = self.tooltip, hint = self.options.hint, markers, virtualMarkers, idx = 0, p, point, valueX, valueY, s = null, dataObj = null, op = null, title = hint.title, content = hint.content, isTitleFunc = $.isFunction(title), isContentFunc = $.isFunction(content), distance = 0, hoverLine;

                if (tooltip) {
                    op = tooltip.getOptions();
                }

                if (self.hoverLine && !self.indicatorLine) {
                    hoverLine = self.hoverLine;
                    if (self.isNewLine) {
                        if (hint.enable && tooltip) {
                            tooltip.hide();
                        }
                        self.isNewLine = false;
                    }
                    markers = hoverLine.lineMarkers;
                    virtualMarkers = hoverLine.virtualMarkers;
                    idx = -1;
                    p = { x: 0, y: 0 };
                    if (markers && markers.length) {
                        $.each(markers, function (i, marker) {
                            if (marker.removed) {
                                return true;
                            }
                            var box = marker.wijGetBBox(), pos = box.x + box.width / 2, dis = Math.abs(pos - mousePos.left);
                            if (i === 0 || dis < distance) {
                                distance = dis;
                                idx = i;
                                p = {
                                    x: pos,
                                    y: box.y + box.height / 2
                                };
                            }
                        });
                        if (self.hoverPoint && self.hoverPoint.index === idx) {
                            return;
                        }
                        if (idx > -1) {
                            if (markers[idx].removed) {
                                return;
                            }
                            point = $(markers[idx].node).data("wijchartDataObj");

                            if (point) {
                                if (self.hoverPoint && !self.hoverPoint.isSymbol) {
                                    if (!self.hoverPoint.removed) {
                                        self.hoverPoint.marker.wijAttr(self.hoverPoint.markerStyle);
                                        self.hoverPoint.marker.transform("s1");
                                    }
                                }
                                if (!point.isSymbol) {
                                    if (!point.marker.removed) {
                                        point.marker.wijAttr(point.markerHoverStyle);
                                    }
                                }
                            }

                            self.hoverPoint = point;
                            self.hoverVirtualPoint = virtualMarkers[idx];
                        }
                    } else {
                        $.each(virtualMarkers, function (i, marker) {
                            var dis = Math.abs(marker.x - mousePos.left);
                            if (i === 0 || dis < distance) {
                                distance = dis;
                                idx = i;
                                p = {
                                    x: marker.x,
                                    y: marker.y
                                };
                            }
                        });
                        if (self.hoverVirtualPoint && self.hoverVirtualPoint.index === idx) {
                            return;
                        }
                        if (idx > -1) {
                            self.hoverPoint = null;
                            self.hoverVirtualPoint = virtualMarkers[idx];
                        }
                    }
                    if (tooltip) {
                        dataObj = self.hoverVirtualPoint;
                        valueX = dataObj.valX;
                        valueY = dataObj.valY;

                        //dataObj = self.hoverPoint;
                        //valueX = dataObj.valX;
                        //valueY = dataObj.valY;
                        if (isTitleFunc || isContentFunc) {
                            if (isTitleFunc) {
                                op.title = function () {
                                    var obj = {
                                        pointIndex: idx,
                                        //lineIndex: dataObj.lineSeries.index,
                                        lineIndex: hoverLine.index,
                                        x: valueX,
                                        y: valueY,
                                        //label: dataObj.lineSeries.label,
                                        label: hoverLine.label,
                                        data: dataObj,
                                        fmt: title
                                    }, fmt = $.proxy(obj.fmt, obj), tit = fmt();
                                    return tit;
                                };
                            }
                            if (isContentFunc) {
                                op.content = function () {
                                    var obj = {
                                        pointIndex: idx,
                                        //lineIndex: dataObj.lineSeries.index,
                                        lineIndex: hoverLine.index,
                                        x: valueX,
                                        y: valueY,
                                        //label: dataObj.lineSeries.label,
                                        label: hoverLine.label,
                                        data: dataObj,
                                        fmt: content
                                    }, fmt = $.proxy(obj.fmt, obj), con = fmt();
                                    return con;
                                };
                            }
                        }
                        s = $.extend({
                            stroke: hoverLine.path.attr("stroke")
                        }, hint.style);
                        op.style.stroke = s.stroke;
                        tooltip.showAt(p);
                    }
                }

                _super.prototype._mouseMoveInsidePlotArea.call(this, e, mousePos);
            };

            wijcompositechart.prototype._mouseDownInsidePlotArea = function (e, mousePos) {
                _super.prototype._mouseDownInsidePlotArea.call(this, e, mousePos);
                this._clearHoverState(true);
            };

            wijcompositechart.prototype._mouseMoveOutsidePlotArea = function (e, mousePos) {
                var self = this;
                self._clearHoverState();
                _super.prototype._mouseMoveOutsidePlotArea.call(this, e, mousePos);
            };

            wijcompositechart.prototype._clearHoverState = function (keepTooltip) {
                var self = this, tooltip = self.tooltip, hint = self.options.hint;

                if (self.hoverLine) {
                    if (hint.enable && tooltip && !keepTooltip) {
                        tooltip.hide();
                    }
                    if (!self.hoverLine.path.removed) {
                        self.hoverLine.path.wijAttr(self.hoverLine.lineStyle);
                        if (self.hoverPoint && !self.hoverPoint.isSymbol) {
                            self.hoverPoint.marker.wijAttr(self.hoverPoint.markerStyle);

                            //hoverPoint.marker.scale(1, 1);
                            self.hoverPoint.marker.transform("s1");
                        }
                    }
                }
                self.hoverLine = null;
                self.hoverPoint = null;
                self.hoverVirtualPoint = null;
            };

            wijcompositechart.prototype._getTooltipText = function (fmt, target) {
                return "";
            };

            wijcompositechart.prototype._calculateParameters = function (axisInfo, options) {
                var self = this, hasBarType = false, minor, maxAdj = 0, minAdj = 0, bubbleAdj, max, min, barAdj, candlestickAdj;

                _super.prototype._calculateParameters.call(this, axisInfo, options);

                max = axisInfo.max, min = axisInfo.min;

                $.each(self.options.seriesList, function (idx, series) {
                    if (series.type === "column" || series.type === "bar") {
                        hasBarType = true;
                        return false;
                    }
                });

                // check for bar chart and x axis expansion
                if (axisInfo.id === "x") {
                    minor = options.unitMinor;
                    if (hasBarType) {
                        barAdj = self._getBarAdjustment(axisInfo, minor);
                        maxAdj = Math.max(maxAdj, barAdj.maxAdj);
                        minAdj = Math.max(minAdj, barAdj.minAdj);
                    }

                    if (self.isContainsCandlestick && wijcandlestickchartFn) {
                        candlestickAdj = wijcandlestickchartFn.prototype._getCandlestickAdjustment.apply(this, [axisInfo, minor]);
                        maxAdj = Math.max(maxAdj, candlestickAdj);
                        minAdj = Math.max(minAdj, candlestickAdj);
                    }
                }

                if (self.isContainsBubble && $.wijmo.wijbubblechart) {
                    bubbleAdj = this.bubbleAxisAdjust.getAdjust(axisInfo, options);
                    maxAdj = Math.max(maxAdj, bubbleAdj.max - max);
                    minAdj = Math.max(minAdj, min - bubbleAdj.min);
                }

                if (minAdj) {
                    axisInfo.min = min - minAdj;
                }
                if (maxAdj) {
                    axisInfo.max = max + maxAdj;
                }

                if (maxAdj || minAdj) {
                    self._calculateMajorMinor(options, axisInfo);
                }
            };

            wijcompositechart.prototype._getBarAdjustment = function (axisInfo, minor) {
                var len = 0, o = this.options, max = axisInfo.max, min = axisInfo.min, xLen = 0, adj;

                $.each(o.seriesList, function (idx, series) {
                    if (series.type === "pie") {
                        return true;
                    }
                    if (series.data.x === undefined || series.data.y === undefined) {
                        return true;
                    }
                    xLen = series.data.x.length;

                    if (len < xLen) {
                        len = xLen;
                    }
                });

                if (len > 1) {
                    var clusterRelativeWidth = (max - min) / (len - 1) * (o.clusterWidth / 100);

                    // Make a "0.25" offset to avoid the column being too close to axis.
                    adj = (clusterRelativeWidth * 1.25) / 2;
                } else if (len === 1) {
                    if (min === 0.0 && max === 1.0) {
                        min = -1.0;
                    }

                    adj = (max - min) * 0.0125;
                } else {
                    adj = 0;
                }

                if (adj === 0) {
                    adj = minor;
                } else {
                    if (minor < adj && minor !== 0) {
                        adj = Math.floor(adj / minor) * minor;
                    }
                }
                return {
                    maxAdj: adj,
                    minAdj: axisInfo.min - min + adj
                };
            };
            return wijcompositechart;
        })(_chart.wijchartcore);
        _chart.wijcompositechart = wijcompositechart;

        wijcompositechart.prototype.widgetEventPrefix = "wijcompositechart";

        var wijcompositechart_css = (function (_super) {
            __extends(wijcompositechart_css, _super);
            function wijcompositechart_css() {
                _super.apply(this, arguments);
                this.compositechart = "wijmo-wijcompositechart";
                this.barLabel = "wijbarchart-label";
                this.barElement = "wijbarchart";
                this.barTracker = "bartracker";
                this.bubbleElement = "wijbubblechart-bubble";
                this.bubbleTracker = "bubbletracker";
                this.bubbleLabel = "wijbubblechart-label";
                this.bubbleSymbol = "wijbubblechart-symbol";
                this.scatterElement = "wijscatterchart";
                this.pieLabel = "wijpiechart-label";
                this.pieElement = "wijpiechart";
                this.pieTracker = "pietracker";
                this.lineLabel = "wijlinechart-label";
                this.lineElement = "wijlinechart";
                this.areaElement = "wijlinechart-area";
                this.lineTracker = "linetracker";
                this.canvasMarker = "wijchart-canvas-marker";
                this.wijCandlestickChart = "wijmo-wijcandlestickchart";
                this.candlestickChart = "wijcandlestickchart";
                this.candlestickChartTracker = "candlesticktracker";
            }
            return wijcompositechart_css;
        })(_chart.wijchartcore_css);
        _chart.wijcompositechart_css = wijcompositechart_css;

        var wijcompositechart_options = (function (_super) {
            __extends(wijcompositechart_options, _super);
            function wijcompositechart_options() {
                _super.apply(this, arguments);
                /**
                * Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijcompositechart')";
                /**
                * @ignore
                */
                this.wijCSS = new wijmo.chart.wijcompositechart_css();
                /**
                * A value that determines whether to show a stacked chart.
                */
                this.stacked = false;
                /**
                * A value that indicates the percentage of bar elements in the same cluster overlap.
                */
                this.clusterOverlap = 0;
                /**
                * A value that indicates the percentage of the plot area that each bar cluster occupies.
                */
                this.clusterWidth = 85;
                /**
                * A value that indicates the corner-radius for the bar.
                */
                this.clusterRadius = 0;
                /**
                * A value that indicates the spacing between the adjacent bars.
                */
                this.clusterSpacing = 0;
                /**
                * An array collection that contains the data that will be displayed by the chart."
                * @example
                *	$("#compositechart").wijcompositechart({
                *				seriesList: [{
                *					type: "bar",
                *					label: "Q1",
                *					legendEntry: true,
                *					data: {
                *						x: [1, 2, 3, 4, 5],
                *						y: [12, 21, 9, 29, 30]
                *					}}, {
                *					type: "bar",
                *					label: "Q2",
                *					legendEntry: true,
                *					data: {
                *						xy: [1, 21, 2, 10, 3, 19, 4, 31, 5, 20]
                *					}}, {
                *					type: "line",
                *					label: "Q3",
                *					legendEntry: true,
                *					data: {
                *						x: [1, 2, 3, 4, 5],
                *						y: [12, 21, 9, 29, 30]
                *					}}, {
                *					type: "pie",
                *					label: "title for pie chart",
                *					legendEntry: false,
                *					data: [{
                *						label: "Q4",
                *						data: 12,
                *						offset: 15
                *					}, {
                *						label: "Q5",
                *						data: 21,
                *						offset: 0
                *					}, {
                *						label: "Q5",
                *						data: 21,
                *						offset: 0
                *					}],
                *					center: {
                *						x: 150,
                *						y: 150
                *					},
                *					radius: 100
                *					}
                *				}]
                *				OR
                *				seriesList: [{
                *					type: "bar"
                *					label: "Q1",
                *					legendEntry: true,
                *					data: {
                *						x: ["A", "B", "C", "D", "E"],
                *						y: [12, 21, 9, 29, 30]
                *					}
                *				}, {
                *					type: "line"
                *					label: "Q1",
                *					legendEntry: true,
                *					data: {
                *						x: ["A", "B", "C", "D", "E"],
                *						y: [12, 21, 9, 29, 30]
                *					}
                *				}
                *				]
                *				OR
                *				seriesList: [{
                *					type: "bar",
                *					label: "Q1",
                *					legendEntry: true,
                *					data: {
                *						x: [new Date(1978, 0, 1), new Date(1980, 0, 1),
                *							new Date(1981, 0, 1), new Date(1982, 0, 1),
                *							new Date(1983, 0, 1)],
                *						y: [12, 21, 9, 29, 30]
                *					}
                *				}, {
                *					type: "bar",
                *					label: "Q2",
                *					legendEntry: true,
                *					data: {
                *						x: [new Date(1978, 0, 1), new Date(1980, 0, 1),
                *							new Date(1981, 0, 1), new Date(1982, 0, 1),
                *							new Date(1983, 0, 1)],
                *						y: [10, 25, 5, 25, 35]
                *					}
                *				}]
                *  });
                */
                this.seriesList = [];
                /**
                * The animation option defines the animation effect and controls other aspects of the widget's animation,
                * such as duration and easing.
                */
                this.animation = {
                    /**
                    * A value that determines whether to show animation.
                    */
                    enabled: true,
                    /**
                    * The duration option defines the length of the animation effect in milliseconds.
                    */
                    duration: 400,
                    /**
                    * Sets the type of animation easing effect that users experience when the wijcompositechart series is loaded to the page.
                    * @remarks
                    * The easing is defined in Raphael, the documentation is:http://raphaeljs.com/reference.html#Raphael.easing_formulas
                    */
                    easing: ">"
                };
                /**
                * The seriesTransition option is used to animate series in the chart when just their values change.
                * @remarks
                * This is helpful for visually showing changes in data for the same series.
                * Note: When programmatically updating the seriesList with a different number of series in the array make sure
                * to disable seriesTransition like the following:
                * seriesTransition: { enabled: false}
                */
                this.seriesTransition = {
                    /**
                    * A value that determines whether to show animation when reloading data.
                    */
                    enabled: true,
                    /**
                    * A value that indicates the duration for the series transition.
                    */
                    duration: 400,
                    /**
                    * Sets the type of animation easing effect that users experience when the wijcompositechart series is
                    * reloaded after they have changed the data for the seriesList option.
                    */
                    easing: ">"
                };
                /**
                * Occurs when the user clicks a mouse button.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICompositeChartEventArgs} data Information about an event
                */
                this.mouseDown = null;
                /**
                * Occurs when the user releases a mouse button while the pointer is over the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICompositeChartEventArgs} data Information about an event
                */
                this.mouseUp = null;
                /**
                * Occurs when the user first places the pointer over the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICompositeChartEventArgs} data Information about an event
                */
                this.mouseOver = null;
                /**
                * Occurs when the user moves the pointer off of the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICompositeChartEventArgs} data Information about an event
                */
                this.mouseOut = null;
                /**
                * Occurs when the user moves the mouse pointer while it is over a chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICompositeChartEventArgs} data Information about an event
                */
                this.mouseMove = null;
                /**
                * Occurs when the user clicks the chart element.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ICompositeChartEventArgs} data Information about an event
                */
                this.click = null;
                this.hole = {};
            }
            return wijcompositechart_options;
        })(_chart.wijchartcore_options);

        wijcompositechart.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijcompositechart_options());

        $.wijmo.registerWidget("wijcompositechart", wijcompositechart.prototype);
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));

