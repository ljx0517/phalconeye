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
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/// <reference path="../wijutil/jquery.wijmo.wijutil.ts" />
/// <reference path="../wijutil/jquery.wijmo.raphael.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals $, Raphael, jQuery, document, window */
    /*
    * Depends:
    *  raphael.js
    *  globalize.js
    *
    */
    (function (_sparkline) {
        "use strict";
        var $ = jQuery, widgetName = "wijsparkline", defaultSeriesStyle = {
            line: {
                stroke: "#5b8f00",
                "stroke-width": 1,
                opacity: 0.9
            },
            area: {
                stroke: "#009999",
                "stroke-width": 1,
                fill: "#0099ff",
                "fill-opacity": 0.5
            },
            column: {
                stroke: "none",
                fill: "#0099ff",
                "fill-opacity": 0.9,
                negStyle: {
                    fill: "#ff0000"
                },
                zeroStyle: {
                    fill: "#808080"
                }
            }
        };

        /** @ignore */
        var SparklineTooltip = (function () {
            function SparklineTooltip(style) {
                this._hOffset = 15;
                this._vOffset = -15;
                this._tooltipEle = $("<div style='position:absolute' class='wijmo-wijsparkline-tooltip'></div>");
                this._tooltipEle.appendTo("body").hide();
            }
            SparklineTooltip.prototype.show = function (content, position) {
                this._tooltipEle.css({
                    "left": position.originalLeft + this._hOffset,
                    "top": position.originalTop + this._vOffset
                }).empty().append(content);

                if (this._tooltipEle.is(":hidden")) {
                    this._tooltipEle.show();
                }
            };

            SparklineTooltip.prototype.hide = function () {
                this._tooltipEle.hide();
            };

            SparklineTooltip.prototype.destroy = function () {
                this._tooltipEle.remove();
                this._tooltipEle = null;
            };
            return SparklineTooltip;
        })();
        _sparkline.SparklineTooltip = SparklineTooltip;

        /**
        * @widget
        */
        var wijsparkline = (function (_super) {
            __extends(wijsparkline, _super);
            function wijsparkline() {
                _super.apply(this, arguments);
            }
            wijsparkline.prototype._create = function () {
                var self = this, o = self.options, width = o.width || self.element.width(), height = o.height || self.element.height(), originalStyle = self.element.attr("style"), canvas, vals;

                self.wrapper = $("<div class='ui-widget " + o.wijCSS.sparkline + "'></div>").attr("style", originalStyle || "");
                if (width) {
                    self.wrapper.css("width", width);
                }

                if (height) {
                    self.wrapper.css("height", height);
                }

                self.canvasWrapper = $("<div class='" + o.wijCSS.canvasWrapper + "'></div>");

                self.element.wrap(self.wrapper).after(self.canvasWrapper).hide();

                if (self.canvasWrapper.is(":hidden") && self.canvasWrapper.wijAddVisibilityObserver) {
                    if (self.canvasWrapper.hasClass("wijmo-wijobserver-visibility")) {
                        return;
                    }

                    self.canvasWrapper.wijAddVisibilityObserver(function () {
                        self.redraw();
                        if (self.canvasWrapper.wijRemoveVisibilityObserver) {
                            self.canvasWrapper.wijRemoveVisibilityObserver();
                        }
                    }, "wijsparkline");
                }

                if (o.data) {
                    self.data = o.data;
                } else {
                    vals = self.element.html();
                    self.data = vals.replace(/(^\s*<!--)|(-->\s*$)|\s+/g, '').split(',');
                }

                canvas = Raphael(self.canvasWrapper[0], width, height);

                self.canvas = canvas;
                if (self.canvasWrapper.is(":visible")) {
                    self._render();
                }

                _super.prototype._create.call(this);
            };

            wijsparkline.prototype._setOption = function (key, value) {
                var o = this.options;
                if (key === "height" || key === "width") {
                    o[key] = value;
                    this.element[key](value);
                } else if (key === "data") {
                    this.data = o.data = value;
                } else {
                    _super.prototype._setOption.call(this, key, value);
                }

                this.redraw();
            };

            wijsparkline.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._toggleDisableSparkline(true);
            };

            wijsparkline.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._toggleDisableSparkline(false);
            };

            wijsparkline.prototype._toggleDisableSparkline = function (disabled) {
                this.element.parent().toggleClass(this.options.wijCSS.stateDisabled, disabled);
            };

            wijsparkline.prototype._render = function () {
                var self = this, o = self.options, type = o.type, seriesList = o.seriesList, seriesStylesLength = o.seriesStyles ? o.seriesStyles.length : 0, seriesStyle;

                self.seriesRegionInfos = [];

                self.canvas.clear();

                self.canvasBounds = {
                    startX: 0,
                    width: o.width || this.element.width() || this.canvasWrapper.width(),
                    startY: 0,
                    height: o.height || this.element.height() || this.canvasWrapper.height()
                };

                type = type && type !== "" ? type.toLowerCase() : "line";
                self.containsColumnType = type === "column" || $.grep(seriesList, function (s) {
                    return s.type && s.type.toLowerCase() === "column";
                }).length > 0;

                if (seriesList && seriesList.length > 0) {
                    $.each(seriesList, function (idx, series) {
                        var seriesType = series.type && series.type !== "" ? series.type.toLowerCase() : type;

                        seriesStyle = seriesStylesLength > 0 ? o.seriesStyles[idx % seriesStylesLength] : null;

                        self._internalRender(series, o, seriesType, seriesStyle);
                    });
                } else {
                    seriesStyle = seriesStylesLength > 0 ? o.seriesStyles[0] : null;
                    self._internalRender(null, o, type, seriesStyle);
                }

                self._bindCanvasEvents();
            };

            wijsparkline.prototype._internalRender = function (series, options, type, seriesStyle) {
                var render, seriesRegionInfo, data, columnWidth, defaultStyle = defaultSeriesStyle[type];

                seriesStyle = $.extend({}, defaultStyle, seriesStyle, series ? series.seriesStyle : null);
                data = series && series.data ? series.data : this.data;

                if (series && series.columnWidth !== undefined && series.columnWidth !== null && typeof series.columnWidth === "number") {
                    columnWidth = series.columnWidth;
                } else {
                    columnWidth = options.columnWidth;
                }
                render = new wijmo.sparkline[type + "Render"](this.element, this.canvas, type, {
                    data: data,
                    min: options.min,
                    max: options.max,
                    valueAxis: options.valueAxis,
                    origin: options.origin,
                    animation: options.animation,
                    bind: series ? series.bind || options.bind : options.bind,
                    seriesStyle: seriesStyle,
                    columnWidth: columnWidth,
                    canvasBounds: this.canvasBounds
                });

                if (!render.isValid()) {
                    return true;
                }

                render.render();

                seriesRegionInfo = {
                    type: type,
                    bind: series ? series.bind : null,
                    regionInfos: render.getRegionInfos()
                };

                if (type === "column") {
                    this.colunmWidth = render.getColumnWidth();
                }

                this.seriesRegionInfos.push(seriesRegionInfo);
            };

            /**
            * This method redraws the chart.
            */
            wijsparkline.prototype.redraw = function () {
                var o = this.options, width = 0, height = 0;

                width = o.width || this.element.width() || this.canvasWrapper.width();
                height = o.height || this.element.height() || this.canvasWrapper.height();

                if (width < 1 || height < 1) {
                    return;
                }

                this.canvas.setSize(width, height);
                this._render();
            };

            /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            wijsparkline.prototype.destroy = function () {
                this._unbindCanvasEvents();

                this.element.unwrap().show();

                this.canvas.clear();

                this.wrapper = null;
                this.canvasWrapper.remove();
                this.canvasWrapper = null;

                this.seriesRegionInfos = [];
                this.canvasBounds = null;

                if (this.tooltip) {
                    this.tooltip.destroy();
                    this.tooltip = null;
                }

                _super.prototype.destroy.call(this);
            };

            wijsparkline.prototype._bindCanvasEvents = function () {
                var self = this, o = self.options, $wrapper = self.canvasWrapper, touchEventPre = "", namespace = "." + widgetName;

                if (!$wrapper || !self.canvas) {
                    return;
                }

                if ($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    if (window.navigator["pointerEnabled"]) {
                        this.element.css("touch-action", "none");
                    } else if (window.navigator.msPointerEnabled) {
                        this.element.css("-ms-touch-action", "none");
                    }
                }

                if ($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    touchEventPre = "wij";
                }
                $wrapper.bind(touchEventPre + "mousemove" + namespace, function (e) {
                    var mousePos = self._getMousePosition($wrapper, e), disabled = self._isDisabled();

                    if (disabled) {
                        return;
                    }

                    self._mouseMoveInsideArea(mousePos);
                });

                $wrapper.bind(touchEventPre + "mouseout" + namespace, function (e) {
                    var tg = e.currentTarget, reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement, disabled = self._isDisabled();

                    if (disabled) {
                        return;
                    }

                    if (tg.nodeName.toLowerCase() !== 'div') {
                        return;
                    }

                    while (reltg && reltg !== tg && reltg.nodeName.toLowerCase() !== 'body') {
                        reltg = reltg.parentNode;
                    }

                    if (reltg === tg) {
                        return;
                    }

                    self._mouseOutInsideArea();
                });

                $wrapper.bind(touchEventPre + "click" + namespace, function (e) {
                    var mousePos = self._getMousePosition($wrapper, e), disabled = self._isDisabled(), currentRegionInfos = [];

                    if (disabled) {
                        return;
                    }

                    currentRegionInfos = self._getCurrentRegionInfos(mousePos);

                    self._trigger("click", null, {
                        currentRegion: currentRegionInfos
                    });
                });
            };

            wijsparkline.prototype._getMousePosition = function (element, e) {
                var elePos = element.offset(), isQuirksMode = document.compatMode === "CSS1Compat", originalLeft = isQuirksMode ? e.pageX : e.clientX, originalTop = isQuirksMode ? e.pageY : e.clientY, mousePos = {
                    left: originalLeft - elePos.left,
                    originalLeft: originalLeft,
                    top: originalTop - elePos.top,
                    originalTop: originalTop
                };

                return mousePos;
            };

            wijsparkline.prototype._mouseMoveInsideArea = function (mousePos) {
                var self = this, o = self.options, format = o.tooltipFormat, content = o.tooltipContent, tooltipContent = "", currentRegionInfos = [], currentLeftPosition = NaN;

                currentRegionInfos = self._getCurrentRegionInfos(mousePos);

                if (currentRegionInfos.length > 0) {
                    $.each(currentRegionInfos, function (idx, currentRegionInfo) {
                        var currentContent;
                        if (idx === 0) {
                            tooltipContent += "<span>";
                        }
                        if (content && $.isFunction(content)) {
                            currentContent = $.proxy(content, self.data[currentRegionInfo.index])();
                        } else {
                            if (currentRegionInfo.bind) {
                                tooltipContent += currentRegionInfo.bind + ": ";
                            }
                            if (format) {
                                currentContent = format.replace(/\{(\d+)\}/g, currentRegionInfo.value.toString());
                            } else {
                                currentContent = currentRegionInfo.value.toString();
                            }
                        }
                        tooltipContent += currentContent;
                        if (idx < currentRegionInfos.length - 1) {
                            tooltipContent += "<br />";
                        } else {
                            tooltipContent += "</span>";
                        }

                        if (isNaN(currentLeftPosition)) {
                            if (self.containsColumnType) {
                                if (currentRegionInfo.type === "column") {
                                    currentLeftPosition = currentRegionInfo.position.x + self.colunmWidth / 2;
                                }
                            } else {
                                if (currentRegionInfo.type === "line" || currentRegionInfo.type === "area") {
                                    currentLeftPosition = currentRegionInfo.position.x;
                                }
                            }
                        }
                    });

                    this._paintTooltip(tooltipContent, mousePos);

                    this._paintIndicatorLine(currentLeftPosition);
                }

                this._trigger("mouseMove", null, {
                    currentRegion: currentRegionInfos
                });
            };

            wijsparkline.prototype._mouseOutInsideArea = function () {
                if (this.tooltip) {
                    this.tooltip.hide();
                }

                if (this.indicatorLine) {
                    this.indicatorLine.wijRemove();
                    this.indicatorLine = null;
                }
            };

            wijsparkline.prototype._getCurrentRegionInfos = function (mousePos) {
                var self = this, currentRegionInfos = [];

                $.each(this.seriesRegionInfos, function (idx, regionInfo) {
                    var currentRegionInfo, methodName = "_" + regionInfo.type + "GetCurrentRegionInfo", method = self[methodName];

                    if (method) {
                        currentRegionInfo = method.call(self, regionInfo, mousePos);

                        if (currentRegionInfo) {
                            currentRegionInfo.type = regionInfo.type;
                            currentRegionInfo.bind = regionInfo.bind;
                            currentRegionInfos.push(currentRegionInfo);
                        }
                    }
                });

                return currentRegionInfos;
            };

            wijsparkline.prototype._lineGetCurrentRegionInfo = function (seriesInfo, mousePos) {
                var regionInfos = seriesInfo.regionInfos, length, currentRegion;

                if (!regionInfos) {
                    return;
                }

                length = regionInfos.length;

                $.each(regionInfos, function (idx, regionInfo) {
                    var currentPosition = regionInfo.position, nextRegionInfo, nextPostion;
                    if (idx < length - 1) {
                        nextRegionInfo = regionInfos[idx + 1];
                        nextPostion = nextRegionInfo.position;
                        if (mousePos.left >= currentPosition.x && mousePos.left < nextPostion.x) {
                            currentRegion = regionInfo;
                            currentRegion.index = idx;
                            return false;
                        }
                    } else {
                        if (mousePos.left >= currentPosition.x) {
                            currentRegion = regionInfo;
                            currentRegion.index = idx;
                            return false;
                        }
                    }
                });

                return currentRegion;
            };

            wijsparkline.prototype._areaGetCurrentRegionInfo = function (seriesInfo, mousePos) {
                return this._lineGetCurrentRegionInfo(seriesInfo, mousePos);
            };

            wijsparkline.prototype._columnGetCurrentRegionInfo = function (seriesInfo, mousePos) {
                return this._lineGetCurrentRegionInfo(seriesInfo, mousePos);
            };

            wijsparkline.prototype._pieGetCurrentRegionInfo = function (seriesInfo, mousePos) {
                /* Todo */
                return null;
            };

            wijsparkline.prototype._bulletGetCurrentRegionInfo = function (seriesInfo, mousePos) {
                /* Todo */
                return null;
            };

            wijsparkline.prototype._unbindCanvasEvents = function () {
                if ($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    if (window.navigator["pointerEnabled"]) {
                        this.element.css("touch-action", "");
                    } else if (window.navigator.msPointerEnabled) {
                        this.element.css("-ms-touch-action", "");
                    }
                }
                this.element.unbind("." + widgetName);
            };

            wijsparkline.prototype._paintTooltip = function (tooltipContent, mousePos) {
                if (!this.tooltip) {
                    this.tooltip = new SparklineTooltip(this.options.tooltipStyle);
                }

                this.tooltip.show(tooltipContent, mousePos);
            };

            wijsparkline.prototype._paintIndicatorLine = function (currentLeftPosition) {
                var height, left, top, pathArr;

                if (!this.indicatorLine) {
                    height = this.canvasBounds.height;
                    left = this.canvasBounds.startX;
                    top = this.canvasBounds.startY;
                    pathArr = ["M", left, top, "V", height];
                    this.indicatorLine = this.canvas.path(pathArr.join(" "));
                    this.indicatorLine.transform("T" + currentLeftPosition + " 0");
                } else {
                    this.indicatorLine.transform("T" + currentLeftPosition + " 0");
                }
            };
            return wijsparkline;
        })(wijmo.wijmoWidget);
        _sparkline.wijsparkline = wijsparkline;

        /** @ignore */
        var sparklineRenderBase = (function () {
            function sparklineRenderBase(element, canvas, type, options) {
                this.isValidData = true;
                this.values = [];
                this.type = type;
                this.options = options;
                this.element = element;
                this.canvas = canvas;
                this.animationSet = canvas.set();

                this.scanValues();
                if (this.options.min === null || this.options.min === undefined || typeof this.options.min !== "number") {
                    this.minValue = Math.min.apply(Math, this.values);
                } else {
                    this.minValue = this.options.min;
                }
                if (this.options.max === null || this.options.max === undefined || typeof this.options.max !== "number") {
                    this.maxValue = Math.max.apply(Math, this.values);
                } else {
                    this.maxValue = this.options.max;
                }
            }
            sparklineRenderBase.prototype.render = function () {
                if (!this.element || !this.canvas) {
                    return;
                }
            };

            sparklineRenderBase.prototype.playAnimation = function () {
                var o = this.options, canvasBounds = o.canvasBounds, animation = o.animation;

                if (this.animationSet.length > 0 && animation && animation.enabled) {
                    this.animationSet.wijAttr("clip-rect", Raphael.format("{0} {1} 0 {2}", canvasBounds.startX, canvasBounds.startY, canvasBounds.height));

                    this.animationSet.wijAnimate({ "clip-rect": Raphael.format("{0} {1} {2} {3}", canvasBounds.startX, canvasBounds.startY, canvasBounds.width, canvasBounds.height) }, animation.duration, animation.easing, null);
                }
            };

            sparklineRenderBase.prototype.scanValues = function () {
                var self = this, o = self.options, bind = o.bind, dataSource = o.data;

                if ($.isArray(dataSource)) {
                    $.each(dataSource, function (idx, val) {
                        var value;
                        if (bind && val && val[bind] !== undefined) {
                            value = val[bind];
                        } else {
                            value = val;
                        }

                        if (typeof value === "string") {
                            value = parseFloat(value);
                        }

                        if (isNaN(value)) {
                            self.isValidData = false;
                            return false;
                        }

                        self.values.push(value);
                    });
                }
            };

            sparklineRenderBase.prototype.setRegionInfos = function () {
                var self = this, valRange = 0, canvasHeight = self.options.canvasBounds.height, canvasWidth = self.options.canvasBounds.width, dataCnt;

                if (!self.values || self.values.length === 0) {
                    return;
                }

                if (!this.regionInfos) {
                    this.regionInfos = [];
                }

                dataCnt = self.values.length;

                valRange = self.maxValue - self.minValue;
                self.valRange = valRange = valRange === 0 ? 1 : valRange;

                $.each(self.values, function (idx, val) {
                    var xPosition, yPosition;

                    xPosition = idx * (canvasWidth / dataCnt);
                    yPosition = canvasHeight * (1 - (val - self.minValue) / valRange);
                    self.regionInfos.push({
                        value: val,
                        position: {
                            x: xPosition,
                            y: yPosition
                        }
                    });
                });
            };

            sparklineRenderBase.prototype.getRegionInfos = function () {
                if (!this.regionInfos || this.regionInfos.length === 0) {
                    this.setRegionInfos();
                }
                return this.regionInfos;
            };

            sparklineRenderBase.prototype.getColumnWidth = function () {
                return null;
            };

            sparklineRenderBase.prototype.isValid = function () {
                return this.isValidData;
            };
            return sparklineRenderBase;
        })();
        _sparkline.sparklineRenderBase = sparklineRenderBase;

        /** @ignore */
        var lineRender = (function (_super) {
            __extends(lineRender, _super);
            function lineRender(element, canvas, type, options) {
                _super.call(this, element, canvas, type, options);
                this.regionInfos = [];
            }
            lineRender.prototype.render = function () {
                var o = this.options, pathArr = [];

                _super.prototype.render.call(this);

                this.setRegionInfos();

                if (this.regionInfos && this.regionInfos.length > 0) {
                    $.each(this.regionInfos, function (idx, regionInfo) {
                        var position = regionInfo.position;
                        if (idx === 0) {
                            pathArr.push("M");
                        } else {
                            pathArr.push("L");
                        }
                        pathArr.push(position.x);
                        pathArr.push(position.y);
                    });

                    if (pathArr.length > 0) {
                        this.line = this.canvas.path(pathArr.join(" "));

                        this.line.wijAttr(o.seriesStyle);
                        this.line.wijAttr("fill", "none");

                        this.animationSet.push(this.line);

                        if (this.type === "line") {
                            this.playAnimation();
                        }
                    }
                }
            };
            return lineRender;
        })(sparklineRenderBase);
        _sparkline.lineRender = lineRender;

        /** @ignore */
        var areaRender = (function (_super) {
            __extends(areaRender, _super);
            function areaRender(element, canvas, type, options) {
                _super.call(this, element, canvas, type, options);
            }
            areaRender.prototype.render = function () {
                var canvasHeight = this.options.canvasBounds.height, maxValue = this.maxValue, minValue = this.minValue, origin = this.options.origin, startX, endY, currentPathArr, pathArr;

                _super.prototype.render.call(this);

                if (this.options.valueAxis) {
                    if (origin === null || origin === undefined || typeof origin !== "number") {
                        origin = (maxValue - minValue) / 2 + minValue;
                    }
                    endY = canvasHeight * (1 - (origin - this.minValue) / this.valRange);
                } else {
                    endY = canvasHeight;
                }

                currentPathArr = Raphael.parsePathString(this.line.attr("path"));

                if (currentPathArr && currentPathArr.length > 0) {
                    pathArr = [];
                    $.each(currentPathArr, function (i, currentPath) {
                        $.each(currentPath, function (j, val) {
                            pathArr.push(val);
                        });
                        if (currentPath[0] === "M") {
                            startX = currentPath[1];
                        }
                        if (i === currentPathArr.length - 1) {
                            pathArr.push("V");
                            pathArr.push(endY);
                            pathArr.push("H");
                            pathArr.push(startX);
                            pathArr.push("Z");
                        }
                    });
                }

                if (pathArr.length > 0) {
                    this.area = this.canvas.path(pathArr.join(" "));
                    this.area.wijAttr(this.options.seriesStyle);
                    this.area.wijAttr("stroke", "none");

                    this.animationSet.push(this.area);

                    this.playAnimation();
                }
            };
            return areaRender;
        })(lineRender);
        _sparkline.areaRender = areaRender;

        /** @ignore */
        var columnRender = (function (_super) {
            __extends(columnRender, _super);
            function columnRender(element, canvas, type, options) {
                _super.call(this, element, canvas, type, options);
                this.animateBars = [];
            }
            columnRender.prototype.render = function () {
                var _this = this;
                var self = this, maxValue = self.maxValue, minValue = self.minValue, canvas = self.canvas, o = self.options, origin = o.origin, animation = o.animation, canvasHeight = o.canvasBounds.height, normalStyle = o.seriesStyle, negStyle = o.seriesStyle.negStyle, zeroStyle = o.seriesStyle.zeroStyle, unitHeight, animationEnable, start;

                _super.prototype.render.call(this);

                self.setRegionInfos();

                delete normalStyle["zeroStyle"];
                delete normalStyle["negStyle"];
                negStyle = $.extend({}, normalStyle, negStyle);
                zeroStyle = $.extend({}, normalStyle, zeroStyle);

                this.columnWidth = self.adjustColumnWidth();
                unitHeight = canvasHeight / self.valRange;
                animationEnable = animation && animation.enabled;

                if (o.valueAxis) {
                    if (origin === null || origin === undefined || typeof origin !== "number") {
                        origin = (maxValue - minValue) / 2 + minValue;
                    }
                    start = (maxValue - origin) * unitHeight;
                } else {
                    start = canvasHeight;
                }

                if (self.regionInfos && self.regionInfos.length > 0) {
                    $.each(self.regionInfos, function (idx, regionInfo) {
                        var colunmnTop, columnHeight, seriesStyle, bar, actualTop, isZeroValue, columnLeft = regionInfo.position.x, val = regionInfo.value;

                        if (o.valueAxis) {
                            if (val >= origin) {
                                isZeroValue = val === origin;
                                actualTop = isZeroValue ? regionInfo.position.y - 2 * unitHeight : regionInfo.position.y;
                                ;
                                colunmnTop = animationEnable ? start : regionInfo.position.y;
                                columnHeight = isZeroValue ? 2 * unitHeight : (val - origin) * unitHeight;
                                seriesStyle = isZeroValue ? zeroStyle : normalStyle;
                            } else {
                                actualTop = colunmnTop = start;
                                columnHeight = (origin - val) * unitHeight;
                                seriesStyle = negStyle;
                            }
                        } else {
                            isZeroValue = val === minValue;
                            actualTop = isZeroValue ? regionInfo.position.y - 2 * unitHeight : regionInfo.position.y;
                            colunmnTop = start;
                            columnHeight = isZeroValue ? 2 * unitHeight : canvasHeight - regionInfo.position.y;
                            seriesStyle = isZeroValue ? zeroStyle : normalStyle;
                        }

                        bar = canvas.rect(columnLeft, colunmnTop, _this.columnWidth, columnHeight);
                        bar.wijAttr(seriesStyle);

                        bar["top"] = actualTop;
                        bar["height"] = columnHeight;
                        self.animateBars.push(bar);
                    });

                    self.playAnimation();
                }
            };

            columnRender.prototype.playAnimation = function () {
                var o = this.options, animation = o.animation;

                if (this.animateBars.length > 0 && animation && animation.enabled) {
                    $.each(this.animateBars, function (idx, bar) {
                        var params;

                        bar.wijAttr({ height: 0 });
                        params = { height: bar["height"], y: bar["top"] };
                        bar.stop().wijAnimate(params, animation.duration, animation.easing, null);
                    });
                }
            };

            columnRender.prototype.adjustColumnWidth = function () {
                var o = this.options, optionColumnWidth = o.columnWidth, canvasWidth = o.canvasBounds.width, columnSpacing = 2, calcColumnWidth;

                calcColumnWidth = canvasWidth / this.values.length - columnSpacing;

                return optionColumnWidth > calcColumnWidth ? calcColumnWidth : optionColumnWidth;
            };

            columnRender.prototype.getColumnWidth = function () {
                return this.columnWidth;
            };
            return columnRender;
        })(sparklineRenderBase);
        _sparkline.columnRender = columnRender;

        

        

        

        

        var wijsparkline_options = (function () {
            function wijsparkline_options() {
                /**
                * Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijsparkline')";
                /**
                * All CSS classes used in widgets.
                * @ignore
                */
                this.wijCSS = {
                    sparkline: "wijmo-wijsparkline",
                    canvasWrapper: "wijmo-sparkline-canvas-wrapper"
                };
                /**
                * Specifies the type of the sparkline widget.
                * @remarks
                * The value of the type can be 'line', 'area' and 'column'.
                * And the default value is 'line'.
                */
                this.type = "line";
                /**
                * Creates an array of series objects that contain data values and labels to display in the chart.
                * @remarks
                * The series object contains following options
                * 1) type: Specifies the type of the sparkline widget.  The value for this option can be 'line', 'area' and 'column'.  And the default value is 'Line'.
                * 2) bind: Indicates that which property value is get from the object in the array if the data is set as a object array.
                * 3) seriesStyle: The specific style applies for current series of the sparkline widget for
                */
                this.seriesList = [];
                /**
                * Sets the width of the sparkline widget in pixels.
                * @remarks
                * Note that this value overrides any value you may set in the <div> element that
                * you use in the body of the HTML page
                * If you specify a width in the <div> element that is different from this value,
                * the chart and its border go out of synch.
                * @type {?number}
                */
                this.width = null;
                /**
                * Sets the height of the sparkline widget in pixels.
                * @remarks
                * Note that this value overrides any value you may set in the <div> element that
                * you use in the body of the HTML page. If you specify a height in the <div> element that
                * is different from this value, the chart and its border go out of synch.
                * @type {?number}
                */
                this.height = null;
                /**
                * Sets the array to use as a source for data that you can bind to the sparkline widget.
                * @remarks
                * The array can be a simple number array.  The array can be a complex object array also.
                * If it is an object array, use the seriesList object's bind option to specify the data field to use.
                */
                this.data = null;
                /**
                * A value indicates that which property value is get from the object in the array if the data is set as a object array.
                */
                this.bind = null;
                /**
                * Sets an array of style objects to use in rendering sparklines for each series in the sparkline widget.
                * @remarks
                * Each style object in the array applies to one series in your seriesList,
                * so you need specify only as many style objects as you have series objects in your seriesList.
                */
                this.seriesStyles = [];
                /**
                * The animation option defines the animation effect and controls other aspects of the widget's animation,
                * such as duration and easing.
                */
                this.animation = {
                    /**
                    * A value that determines whether to show the animation.
                    * Set this option to false in order to disable easing.
                    */
                    enabled: true,
                    /**
                    * A value that indicates the duration for the animation.
                    */
                    duration: 2000,
                    /**
                    * Sets the type of animation easing effect that users experience
                    * when the wijlinechart series is loaded to the page.
                    * For example, a user can have the wijlinechart series bounce several times as it loads.
                    * @remarks Values available for the animation easing effect include the following:
                    * easeInCubic ¨C Cubic easing in. Begins at zero velocity and then accelerates.
                    * easeOutCubic ¨C Cubic easing in and out. Begins at full velocity and then decelerates to zero.
                    * easeInOutCubic ¨C Begins at zero velocity, accelerates until halfway, and then decelerates to zero velocity again.
                    * easeInBack ¨C Begins slowly and then accelerates.
                    * easeOutBack ¨C Begins quickly and then decelerates.
                    * easeOutElastic ¨C Begins at full velocity and then decelerates to zero.
                    * easeOutBounce ¨C Begins quickly and then decelerates. The number of bounces is related to the duration, longer durations produce more bounces.
                    */
                    easing: "easeInCubic"
                };
                /**
                * Axis line as option (off by default) used for identifying negative or positive values.
                * @remarks
                * This option just works with area type sparkline.
                * @type {bool}
                */
                this.valueAxis = false;
                /**
                * Centers the value axis at the origin option setting value.
                * @remarks
                * This option just works when valueAxis is set to true.
                * @type {number}
                */
                this.origin = null;
                /**
                * A value that indicates the minimum value of the sparkline.
                * @type {?number}
                */
                this.min = null;
                /**
                * A value that indicates the maximum value of the sparkline.
                * @type {?number}
                */
                this.max = null;
                /**
                * Set width for each column
                * @remarks
                * This option only works for column type sparkline.
                */
                this.columnWidth = 10;
                /**
                * A value which formats the value for tooltip shown.
                * @remarks
                * If the tooltipContent option is set, this option won't work.
                */
                this.tooltipFormat = null;
                /**
                * A function which is used to get a value for the tooltip shown.
                */
                this.tooltipContent = null;
                /**
                * This event fires when the user moves the mouse pointer while it is over a sparkline.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijSparklineEventArgs} args The data with this event.
                */
                this.mouseMove = null;
                /**
                * This event fires when the user clicks the sparkline.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IWijSparklineEventArgs} args The data with this event.
                */
                this.click = null;
                /**
                * Indicates whether the event handler of the sparkline widget is enable.
                */
                this.disabled = false;
            }
            return wijsparkline_options;
        })();

        wijsparkline.prototype.options = $.extend(true, {}, wijsparkline.prototype.options, new wijsparkline_options());

        wijsparkline.prototype.widgetEventPrefix = "wijsparkline";

        $.wijmo.registerWidget("wijsparkline", wijsparkline.prototype);

        

        

        

        

        
    })(wijmo.sparkline || (wijmo.sparkline = {}));
    var sparkline = wijmo.sparkline;
})(wijmo || (wijmo = {}));

