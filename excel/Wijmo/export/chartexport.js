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
/// <reference path="exportUtil.ts" />
var wijmo;
(function (wijmo) {
    (function (exporter) {
        (function (ChartExportMethod) {
            ChartExportMethod[ChartExportMethod["Content"] = 0] = "Content";
            ChartExportMethod[ChartExportMethod["Options"] = 1] = "Options";
        })(exporter.ChartExportMethod || (exporter.ChartExportMethod = {}));
        var ChartExportMethod = exporter.ChartExportMethod;

        /**
        *  Export the chart as image or pdf.
        * @param {ChartExportSetting} The export settings.
        */
        function exportChart(setting) {
            var chartExporter = new chartExport(setting.serviceUrl, setting.method), options = {
                fileName: setting.fileName,
                height: setting.height,
                width: setting.width,
                widgetName: setting.widgetName,
                widgetOptions: setting.widgetOptions,
                HTMLContent: setting.HTMLContent,
                widget: setting.chart,
                type: setting.exportFileType,
                pdfSetting: setting.pdf
            }, data = chartExporter.getExportData(options);
            exporter.exportFile(setting, data);
        }
        exporter.exportChart = exportChart;

        /** @ignore */
        var chartExport = (function () {
            function chartExport(serviceUrl, method) {
                this.serviceUrl = serviceUrl;
                this.method = method;
            }
            chartExport.prototype.getExportData = function (options) {
                var result;
                this.options = options;
                this._handleExportOption();
                result = {
                    fileName: options.fileName,
                    width: options.width,
                    height: options.height,
                    type: options.type,
                    pdfSettings: options.pdfSetting
                };
                if (this.method === 0 /* Content */) {
                    result.content = options.HTMLContent;
                } else {
                    result.options = options.widgetOptions;
                    result.widgetName = options.widgetName;
                }
                return exporter.toJSON(result, function (key, val) {
                    if (key === "type") {
                        switch (val) {
                            case 6 /* Bmp */:
                                return "bmp";
                            case 7 /* Gif */:
                                return "gif";
                            case 5 /* Jpg */:
                                return "jpg";
                            case 3 /* Pdf */:
                                return "pdf";
                            case 8 /* Tiff */:
                                return "tiff";
                            default:
                                return "png";
                        }
                    }
                    return val;
                });
            };

            chartExport.prototype._handleExportOption = function () {
                var o = this.options;
                if (o.widget) {
                    if (this.method == 0 /* Content */) {
                        o.HTMLContent = o.widget.chartElement[0].outerHTML;
                    } else {
                        o.widgetName = this._getWidgetName();
                        o.widgetOptions = exporter.toJSON(this._handleChartOptions(o.widget, o.widgetName), function (k, v) {
                            if (v != null) {
                                return v;
                            }
                        });
                    }
                    o.width = o.widget.chartElement.width();
                    o.height = o.widget.chartElement.height();
                }
            };

            chartExport.prototype._getWidgetName = function () {
                return this.options.widget ? this.options.widget.widgetName : "";
            };

            chartExport.prototype._handleChartOptions = function (widget, widgetName) {
                var chartoptions = widget.options, options = $.extend(true, {}, chartoptions, {
                    animation: {
                        enabled: false
                    },
                    seriesTransition: {
                        enabled: false
                    },
                    hint: {
                        enable: false
                    }
                });

                delete options.wijCSS;
                delete options.seriesHoverStyles;

                if (widgetName === "wijbarchart") {
                    this._handleBarChartOptions(options);
                } else if (widgetName === "wijcandlestickchart") {
                    this._handleCandlestickChartOptions(options, widget);
                } else if (widgetName === "wijcompositechart") {
                    this._handleCompositeChartOptions(options, widget);
                }

                this._handleAxis(options);
                return options;
            };

            chartExport.prototype._handleAxis = function (options) {
                var _this = this;
                this._removeAuto(options.axis.x);
                if ($.isArray(options.axis.y)) {
                    $.each(options.axis.y, function (i, axis) {
                        _this._removeAuto(axis);
                    });
                } else {
                    this._removeAuto(options.axis.y);
                }
            };

            chartExport.prototype._handleBarChartOptions = function (options) {
                if (options.horizontal) {
                    var compass = options.axis.x.compass;
                    options.axis.x.compass = options.axis.y.compass;
                    options.axis.y.compass = compass;
                }
            };

            chartExport.prototype._handleCandlestickChartOptions = function (options, widget) {
                $.each(options.seriesList, function (i, series) {
                    if (series.data && series.data.x) {
                        $.each(series.data.x, function (j, val) {
                            if (typeof (val) === "number") {
                                series.data.x[j] = widget.timeUtil.getTime(val);
                            }
                        });
                    }
                });
            };

            chartExport.prototype._handleCompositeChartOptions = function (options, widget) {
                if (widget.isContainsCandlestick && widget.timeUtil) {
                    $.each(options.seriesList, function (i, series) {
                        if (series.data && series.data.x) {
                            $.each(series.data.x, function (j, val) {
                                if (typeof (val) === "number") {
                                    series.data.x[j] = widget.timeUtil.getTime(val);
                                }
                            });
                        }
                    });
                }
            };

            chartExport.prototype._removeAuto = function (axis) {
                if (axis.autoMax) {
                    delete axis.max;
                }
                if (axis.autoMin) {
                    delete axis.min;
                }
                if (axis.autoMajor) {
                    delete axis.unitMajor;
                }
                if (axis.autoMinor) {
                    delete axis.unitMinor;
                }
            };

            chartExport.prototype._exportByForm = function (data) {
                var form = $("<form>").appendTo("body"), iptData = $("<input type='text' name='data'>").appendTo(form);

                if (!window["exportFrame"]) {
                    window["exportFrame"] = $("<iframe name='my_iframe'>").appendTo("body");
                    window["exportFrame"].hide();
                }

                form.hide();
                iptData.val(data);
                form.attr({
                    method: "post",
                    action: this.serviceUrl,
                    target: "my_iframe"
                });

                form.submit();
                form.remove();
            };
            return chartExport;
        })();
        exporter.chartExport = chartExport;

        

        /** @ignore */
        function innerExportChart(fileName, type, settings, serviceUrl) {
            var fName, t, setting = {}, sUrl;
            fName = fileName === undefined ? "export" : fileName;
            t = type === undefined ? "png" : type;
            t = t.substr(0, 1).toUpperCase() + t.substr(1);
            if (typeof settings === "string" && arguments.length === 3) {
                sUrl = settings;
            } else {
                sUrl = serviceUrl === undefined ? "http://demos.componentone.com/ASPNET/ExportService/exportapi/chart" : serviceUrl;
                setting = settings;
            }

            wijmo.exporter.exportChart({
                fileName: fName,
                serviceUrl: sUrl,
                chart: this,
                exportFileType: wijmo.exporter.ExportFileType[t],
                pdf: setting
            });
        }
        exporter.innerExportChart = innerExportChart;

        if (wijmo.chart && wijmo.chart.wijchartcore) {
            wijmo.chart.wijchartcore.prototype.exportChart = innerExportChart;
        }

        //wijmo.chart
        var charts = ["wijbarchart", "wijbubblechart", "wijcandlestickchart", "wijcompositechart", "wijlinechart", "wijpiechart", "wijscatterchart"];
        $.each(charts, function (idx, chart) {
            if (!$.wijmo[chart]) {
                return;
            }
            $.wijmo[chart].prototype.exportChart = innerExportChart;
        });
    })(wijmo.exporter || (wijmo.exporter = {}));
    var exporter = wijmo.exporter;
})(wijmo || (wijmo = {}));
