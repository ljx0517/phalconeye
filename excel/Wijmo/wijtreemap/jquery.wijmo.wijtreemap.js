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
/// <reference path="../wijtooltip/jquery.wijmo.wijtooltip.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals jQuery*/
    /*
    * Depends:
    *  jquery.js
    *  jquery-ui.js
    */
    (function (treemap) {
        "use strict";
        var $ = jQuery, widgetName = "wijtreemap", cls = {
            wijtreemap: "wijmo-wijtreemap",
            container: "wijmo-wijtreemap-container",
            item: "wijmo-wijtreemap-item",
            itemContainer: "wijmo-wijtreemap-itemcontainer",
            title: "wijmo-wijtreemap-title",
            label: "wijmo-wijtreemap-label",
            stateDefault: "wijstate-default",
            stateHover: "wijstate-hover",
            buttons: "wijmo-wijtreemap-buttons",
            backButton: "wijmo-wijtreemap-back",
            homeButton: "wijmo-wijtreemap-home"
        }, defaultColors = [
            {
                max: "#00277d", mid: "#5f7ec1", min: "#a8bbe6"
            }, {
                max: "#7d1f00", mid: "#c1785f", min: "#e6b7a8"
            }, {
                max: "#007d27", mid: "#5fc17e", min: "#a8e6bc"
            }, {
                max: "#7d003c", mid: "#c15f8f", min: "#e6a8c6"
            }, {
                max: "#7d4300", mid: "#c1945f", min: "#e6c9a8"
            }, {
                max: "#51007d", mid: "#9f5fc2", min: "#d1aae6"
            }, {
                max: "#7d7400", mid: "#c2bb5f", min: "#e6e2a8"
            }, {
                max: "#970000", mid: "#c25f5f", min: "#e6a9a9"
            }];

        /** @widget */
        var wijtreemap = (function (_super) {
            __extends(wijtreemap, _super);
            function wijtreemap() {
                _super.apply(this, arguments);
            }
            wijtreemap.prototype._setOption = function (key, value) {
                var self = this, o = self.options;
                if (value === o[key]) {
                    return;
                }
                _super.prototype._setOption.call(this, key, value);

                switch (key) {
                    case "width":
                        self._setWidth(value);
                        self._repaintBox();
                        break;
                    case "height":
                        self._setHeight(value);
                        self._repaintBox();
                        break;
                    case "type":
                        self._repaintBox();
                        break;
                    case "showDepth":
                        break;
                    case "data":
                        self._refresh();
                        break;
                    case "valueBinding":
                        self._resetBinding("value");
                        self._repaint();
                        break;
                    case "labelBinding":
                        self._resetBinding("label");
                        self._resetLabels();
                        break;
                    case "colorBinding":
                        self._resetBinding("color");
                        self._repaintColor();
                        break;
                    case "animation":
                        break;
                    case "showLabel":
                        self._showLabels();
                        break;
                    case "labelFormatter":
                        self._resetLabels();
                        break;
                    case "showTooltip":
                        break;
                    case "tooltipOptions":
                        self._destroyTooltip();
                        self._createTooltip();
                        break;
                    case "showTitle":
                    case "titleHeight":
                        self._repaintBox();
                        break;
                    case "titleFormatter":
                        self._resetTitles();
                        break;
                    case "minColor":
                    case "minColorValue":
                    case "midColor":
                    case "midColorValue":
                    case "maxColor":
                    case "maxColorValue":
                        self._resetColor(key, value);
                        break;
                    case "itemPainting":
                    case "itemPainted":
                    case "painting":
                    case "painted":
                        //if the previous 4 events are reset, need to recreate items to trigger them.
                        self._refresh();
                        break;
                    default:
                        break;
                }
            };

            /**
            * This method refreshes the treemap.
            */
            wijtreemap.prototype.refresh = function () {
                this._refresh();
            };

            wijtreemap.prototype._refresh = function () {
                var self = this;
                self._calcBounds();
                self._recreateItems();
                self._createColor();
                self._destroyTooltip();
                self._createTooltip();
                self._recreateBackButtons();
            };

            wijtreemap.prototype._create = function () {
                var self = this;
                _super.prototype._create.call(this);

                self._decorate(true);
                self._calcBounds();
                self._createItems();
                self._createColor();
                self._bindEvents();
                self._createBackButtons();
                self._createTooltip();
            };

            wijtreemap.prototype._createBackButtons = function () {
                var self = this, wijCSS = self.options.wijCSS, backBtnCls = [cls.backButton, wijCSS.tmbackButton, wijCSS.icon, wijCSS.iconArrowReturn], homeBtnCls = [cls.homeButton, wijCSS.tmhomeButton, wijCSS.icon, wijCSS.iconHome], buttonContainer = $("<span><span").addClass(cls.buttons).addClass(wijCSS.tmbuttons), backBtn = $("<span title='back'></span>").addClass(backBtnCls.join(" ")), homeBtn = $("<span title='home'></span>").addClass(homeBtnCls.join(" "));

                buttonContainer.append(backBtn).append(homeBtn);
                self.tmItemContainer.ele.append(buttonContainer);
                self.buttons = buttonContainer;
                self._showBackButtons();
                self.buttons.bind("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var target = $(e.target);
                    if (target.hasClass(cls.backButton)) {
                        self._play(self.currentContainer, self.currentContainer.parent);
                    } else if (target.hasClass(cls.homeButton)) {
                        self._play(self.currentContainer, self.tmItemContainer);
                    }
                });
            };

            wijtreemap.prototype._destroyBackButtons = function () {
                var btns = this.buttons;
                if (btns) {
                    btns.unbind("click");
                    btns.remove();
                    this.buttons = null;
                }
            };

            wijtreemap.prototype._recreateBackButtons = function () {
                this._destroyBackButtons();
                this._createBackButtons();
            };

            wijtreemap.prototype._showBackButtons = function () {
                var self = this, o = self.options;
                if (!self.buttons) {
                    return;
                }

                if (!o.showBackButtons || self.currentContainer === self.tmItemContainer) {
                    self.buttons.hide();
                } else {
                    self.buttons.show();
                }
            };

            wijtreemap.prototype._createTooltip = function () {
                if (!$.wijmo.wijtooltip) {
                    return;
                }
                var self = this, o = self.options, tooltipOptions = o.tooltipOptions, content = tooltipOptions && tooltipOptions.content, showing = tooltipOptions && tooltipOptions.showing;

                $("." + cls.item + "." + cls.stateDefault, self.element).wijtooltip($.extend(true, {
                    position: {
                        at: "right-30 top+30"
                    }
                }, tooltipOptions, {
                    content: function () {
                        var tmItem = self._getItemByEle(this);
                        if (tmItem) {
                            if (content) {
                                return content.call(this, tmItem.data);
                            } else {
                                return tmItem.label() + ": " + tmItem.value();
                            }
                        }
                    },
                    showing: function () {
                        if (!o.showTooltip || self._isDisabled()) {
                            return false;
                        }
                        if (showing) {
                            return showing.apply(this, arguments);
                        }
                    }
                }));
            };

            wijtreemap.prototype._destroyTooltip = function () {
                if ($.wijmo.wijtooltip) {
                    var tooltipEle = $("." + cls.item + "." + cls.stateDefault, this.element);
                    if (tooltipEle.data("wijmo-wijtooltip")) {
                        tooltipEle.wijtooltip("destroy");
                    }
                }
            };

            wijtreemap.prototype._bindEvents = function () {
                var self = this;
                self.element.on("click.wijtreemap", $.proxy(self._onClick, self)).on("contextmenu.wijtreemap", $.proxy(self._onRightClick, self)).on("mouseover.wijtreemap", $.proxy(self._onMouseOver, self)).on("mouseout.wijtreemap", $.proxy(self._onMouseOut, self));
            };

            wijtreemap.prototype._onClick = function (e) {
                if (this._isDisabled()) {
                    return;
                }
                var item = this._getItemByEle($(e.target));
                if (item) {
                    //this._play(item, (<TMItem>item).parent);
                    //change behavior accordiong to the customer's request.
                    this._play(item, item);
                }
            };

            wijtreemap.prototype._play = function (item, container) {
                var self = this, tmC = self.tmItemContainer, c = container, isDrillDown;
                if (c === self.currentContainer) {
                    return;
                }

                isDrillDown = self._isDrillDown(self.currentContainer.ele, c.ele);
                if (self._triggerPlaying(item, self.currentContainer, c, isDrillDown) === false) {
                    return;
                }

                if (c !== tmC) {
                    tmC.box.width = 0;
                    tmC.box.height = 0;
                    tmC.applyBox();
                }

                self.currentContainer = c;
                self._resetContainerBox(c);
                c.applyBox();

                self._triggerPlayed(c, isDrillDown);
                self._showBackButtons();
            };

            wijtreemap.prototype._resetContainerBox = function (c) {
                c.box.width = this.width;
                c.box.height = this.height;
                c.box.top = 0;
                c.box.left = 0;
            };

            wijtreemap.prototype._isDrillDown = function (currentEle, targetEle) {
                if ($.contains(currentEle.get(0), targetEle.get(0))) {
                    return true;
                } else {
                    return false;
                }
            };

            wijtreemap.prototype._triggerPlaying = function (item, currentContainer, targetContainer, isDrillDown) {
                var it = item, cc = currentContainer, tc = targetContainer, data;

                data = {
                    currentData: cc.data,
                    targetData: tc.data,
                    clickItemData: it == null ? null : it.data
                };

                if (isDrillDown) {
                    return this._triggerDrillingDown(data);
                } else {
                    return this._triggerRollingUp(data);
                }
                return true;
            };

            wijtreemap.prototype._triggerDrillingDown = function (args) {
                return this._trigger("drillingDown", null, args);
            };

            wijtreemap.prototype._triggerRollingUp = function (args) {
                return this._trigger("rollingUp", null, args);
            };

            wijtreemap.prototype._triggerPlayed = function (currentContainer, isDrillDown) {
                var data = currentContainer.data;
                if (isDrillDown) {
                    this._triggerDrilledDown(data);
                } else {
                    this._triggerRolledUp(data);
                }
            };

            wijtreemap.prototype._triggerDrilledDown = function (args) {
                this._trigger("drilledDown", null, args);
            };

            wijtreemap.prototype._triggerRolledUp = function (args) {
                this._trigger("rolledUp", null, args);
            };

            wijtreemap.prototype._onRightClick = function (e) {
                if (this._isDisabled()) {
                    return false;
                }
                var self = this, item = self._getItemByEle($(e.target));
                ;
                if (self.currentContainer === self.tmItemContainer) {
                    return false;
                }
                self._play(item, self.currentContainer.parent);
                return false;
            };

            wijtreemap.prototype._onMouseOver = function (e) {
                if (this._isDisabled()) {
                    return;
                }
                var item = this._getItemByEle($(e.target));
                if (item) {
                    item.mouseOver();
                }
            };

            wijtreemap.prototype._onMouseOut = function (e) {
                if (this._isDisabled()) {
                    return;
                }
                var item = this._getItemByEle($(e.target));
                if (item) {
                    item.mouseOut();
                }
            };

            wijtreemap.prototype._getItemByEle = function (ele) {
                var self = this, itemEle, index, items = self.tmItemContainer.items, item;
                itemEle = ele.closest("." + cls.item);
                if (itemEle && itemEle.length) {
                    index = itemEle.data("index");
                    if (index == null) {
                        return null;
                    }
                    $.each(index, function (idx, val) {
                        item = items[val];
                        if (item && item.items) {
                            items = item.items;
                        } else {
                            return false;
                        }
                    });
                    return item;
                }
                return null;
            };

            /**
            * The destroy method will remove the treemap functionality completely and will return the element to its pre-init state.
            * @example $("selector").wijtreemap("destroy");
            */
            wijtreemap.prototype.destroy = function () {
                var self = this;
                self._unbindEvents();
                self._destroyItems();
                self._destroyBackButtons();
                self._getContainer().remove();
                self._decorate(false);
                self.colorConverter = null;
                self._destroyTooltip();
                _super.prototype.destroy.call(this);
            };

            wijtreemap.prototype._unbindEvents = function () {
                this.element.off(".wijtreemap");
            };

            wijtreemap.prototype._destroyItems = function () {
                this.tmItemContainer.destroy();
                this._getContainer().empty();
            };

            wijtreemap.prototype._createItems = function () {
                var self = this, o = self.options, container = self._getContainer();
                self._triggerPainting();
                self.tmItemContainer = new TMItemContainer(container, o.data, self);
                self._resetContainerBox(self.tmItemContainer);
                self.tmItemContainer.render();
                self.currentContainer = self.tmItemContainer;
                container.appendTo(self.element);
                self._triggerPainted();
            };

            wijtreemap.prototype._triggerPainting = function () {
                this._trigger("painting", null, this.element);
            };

            wijtreemap.prototype._triggerPainted = function () {
                this._trigger("painted");
            };

            wijtreemap.prototype._recreateItems = function () {
                this._destroyItems();
                this._createItems();
            };

            wijtreemap.prototype._createColor = function () {
                var self = this, o = self.options, minValue = o.minColorValue, maxValue = o.maxColorValue, minMaxValue;
                if (minValue == null || maxValue == null) {
                    minMaxValue = self._getMinMaxItemValue(self.tmItemContainer);
                    if (minValue == null) {
                        minValue = minMaxValue.min;
                    }
                    if (maxValue == null) {
                        maxValue = minMaxValue.max;
                    }
                }
                if (self.colorConverter) {
                    self.colorConverter = null;
                }

                //default color setting of level 1 items is added, so "#000000" and "#ffffff" is only for compling errors and doesn't work here.
                self.colorConverter = new ColorConverter(o.minColor || "#000000", minValue, o.maxColor || "#ffffff", maxValue, o.midColor, o.midColorValue);
                self.tmItemContainer.colorConverter = self.colorConverter;
                self._repaintColor();
            };

            wijtreemap.prototype._resetColor = function (key, value) {
                this.colorConverter["_reset" + key](value);
                this._repaintColor();
            };

            wijtreemap.prototype._getColor = function (val) {
                return this.colorConverter.getColor(val);
            };

            wijtreemap.prototype._getMinMaxItemValue = function (container) {
                var self = this, itemConatiner = container, value = {
                    min: Number.MAX_VALUE,
                    max: Number.MIN_VALUE
                }, val;

                $.each(itemConatiner.items, function (idx, item) {
                    var v = self._getMinMaxItemValue(item);
                    if (v.max > value.max) {
                        value.max = v.max;
                    }
                    if (v.min < value.min) {
                        value.min = v.min;
                    }
                });

                //only compare tail item's value.
                //if (container.value) {
                if (container.value && itemConatiner.items.length === 0) {
                    val = container.value();
                    if (val > value.max) {
                        value.max = val;
                    }
                    if (val < value.min) {
                        value.min = val;
                    }
                }
                return value;
            };

            wijtreemap.prototype._decorate = function (decorate) {
                var self = this, ele = self.element, o = self.options, classNames = [cls.wijtreemap, o.wijCSS.widget, o.wijCSS.wijtreemap].join(" ");
                ele.toggleClass(classNames, decorate);
            };

            wijtreemap.prototype._getContainer = function () {
                var self = this, o = self.options, conCls = [cls.container, o.wijCSS.tmcontainer, cls.itemContainer, o.wijCSS.tmitemContainer].join(" ");
                if (!self.container) {
                    self.container = $("<div></div>").addClass(conCls);
                }
                return self.container;
            };

            wijtreemap.prototype._calcBounds = function () {
                var self = this, ele = self.element, o = self.options, width = o.width ? o.width : ele.width(), height = o.height ? o.height : ele.height();
                self._setWidth(width);
                self._setHeight(height);
            };
            wijtreemap.prototype._setWidth = function (width) {
                this.width = width;
                this._getContainer().css("width", width.toString());
                if (this.tmItemContainer) {
                    this.tmItemContainer.box.width = width;
                }
            };
            wijtreemap.prototype._setHeight = function (height) {
                this.height = height;
                this._getContainer().css("height", height.toString());
                if (this.tmItemContainer) {
                    this.tmItemContainer.box.height = height;
                }
            };

            wijtreemap.prototype._showLabels = function () {
                this.tmItemContainer.toggleLabelVisibility();
            };

            wijtreemap.prototype._resetBinding = function (key) {
                this.tmItemContainer.setBinding(key);
            };

            wijtreemap.prototype._resetLabels = function () {
                this.tmItemContainer.setLabels(false);
            };

            wijtreemap.prototype._resetTitles = function () {
                this.tmItemContainer.setLabels(true);
            };

            wijtreemap.prototype._repaintBox = function () {
                this.currentContainer.applyBox();
            };

            wijtreemap.prototype._repaintColor = function () {
                this.tmItemContainer.applyColor();
            };

            wijtreemap.prototype._repaint = function () {
                this._repaintBox();
                this._repaintColor();
            };
            return wijtreemap;
        })(wijmo.wijmoWidget);
        treemap.wijtreemap = wijtreemap;

        /** @ignore */
        var ColorConverter = (function () {
            function ColorConverter(minColor, minColorValue, maxColor, maxColorValue, midColor, midColorValue) {
                var self = this;
                self.minColor = self._convertColorToRGB(minColor);
                self.minColorValue = minColorValue;
                self.maxColor = self._convertColorToRGB(maxColor);
                self.maxColorValue = maxColorValue;
                self.midColorValue = self.originalMidColorValue = midColorValue;
                self._calculateMidColorValue();
                self.midColor = self.originalMidColor = self._convertColorToRGB(midColor);
                self._calculateMidColor();
            }
            ColorConverter.prototype._resetminColor = function (val) {
                var self = this;
                self.minColor = self._convertColorToRGB(val);
                self._calculateMidColor();
            };
            ColorConverter.prototype._resetmidColor = function (val) {
                var self = this;
                self.midColor = self.originalMidColor = self._convertColorToRGB(val);
                self._calculateMidColor();
            };
            ColorConverter.prototype._resetmaxColor = function (val) {
                var self = this;
                self.maxColor = self._convertColorToRGB(val);
                self._calculateMidColor();
            };
            ColorConverter.prototype._resetminColorValue = function (val) {
                var self = this;
                self.minColorValue = val;
                self._calculateMidColorValue();
            };
            ColorConverter.prototype._resetmidColorValue = function (val) {
                var self = this;
                self.midColorValue = self.originalMidColorValue = val;
                self._calculateMidColorValue();
            };
            ColorConverter.prototype._resetmaxColorValue = function (val) {
                var self = this;
                self.maxColorValue = val;
                self._calculateMidColorValue();
            };

            ColorConverter.prototype._convertColorToRGB = function (color) {
                if (color == null) {
                    return null;
                }
                var rgbStr, rex;
                rgbStr = $("<div></div>").css("background-color", color).css("background-color");
                rex = rgbStr.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                if (rex.length <= 3) {
                    return;
                }
                return {
                    R: parseInt(rex[1]),
                    G: parseInt(rex[2]),
                    B: parseInt(rex[3])
                };
            };

            ColorConverter.prototype._calculateMidColorValue = function () {
                var self = this;
                if (self.originalMidColorValue == null) {
                    self.midColorValue = (self.maxColorValue + self.minColorValue) / 2;
                }
            };

            ColorConverter.prototype._calculateMidColor = function () {
                var self = this;
                if (self.originalMidColor == null) {
                    self.midColor = self._calculateColorByVal(self.midColorValue, true);
                }
            };

            ColorConverter.prototype._calculateColorByVal = function (val, skipMidCheck) {
                if (typeof skipMidCheck === "undefined") { skipMidCheck = false; }
                var self = this, r, g, b, maxColor = self.maxColor, minColor = self.minColor, maxVal = self.maxColorValue, minVal = self.minColorValue;
                if (val > self.maxColorValue) {
                    return $.extend({}, self.maxColor);
                }
                if (val < self.minColorValue) {
                    return $.extend({}, self.minColor);
                }
                if (!skipMidCheck) {
                    if (val === self.midColorValue) {
                        return $.extend({}, self.midColor);
                    }
                    if (val < self.midColorValue) {
                        maxColor = self.midColor;
                        maxVal = self.midColorValue;
                    } else {
                        minColor = self.midColor;
                        minVal = self.midColorValue;
                    }
                }
                return self._getColor(val, maxColor, maxVal, minColor, minVal);
            };

            ColorConverter.prototype._getColor = function (val, max, maxVal, min, minVal) {
                var self = this;
                return {
                    R: self._getValueByRatio(val, max.R, maxVal, min.R, minVal),
                    G: self._getValueByRatio(val, max.G, maxVal, min.G, minVal),
                    B: self._getValueByRatio(val, max.B, maxVal, min.B, minVal)
                };
            };

            ColorConverter.prototype._getValueByRatio = function (val, max, maxVal, min, minVal) {
                var self = this;
                return Math.abs(min + Math.round((val - minVal) * (max - min) / (maxVal - minVal)));
            };

            ColorConverter.prototype.getColor = function (val) {
                var self = this, color = self._calculateColorByVal(val);
                return "#" + self._hex(color.R) + self._hex(color.G) + self._hex(color.B);
            };

            ColorConverter.prototype._hex = function (val) {
                return ("0" + val.toString(16)).slice(-2);
            };
            return ColorConverter;
        })();

        

        /** @ignore */
        var TMUtils = (function () {
            function TMUtils() {
            }
            //"Squarified Treemap" http://www.win.tue.nl/~vanwijk/stm.pdf,
            //by Mark Bruls, Kees Huizing and Jarke J. van Wijk
            TMUtils.squarified = function (container) {
                var b = container.box, bounds = $.extend(true, {}, b), items = container.items.slice(), ratio, titleBox = container.titleBox, titleLength = titleBox.width || titleBox.height;

                titleLength = (bounds.width === 0 || bounds.height === 0) ? 0 : titleLength;
                bounds.top += titleLength;
                bounds.height -= titleLength;
                ratio = bounds.width * bounds.height / container.total;
                titleBox.width = bounds.width;
                titleBox.height = titleLength;
                do {
                    var rowedItems = TMUtils.getRowedItems(items, bounds, ratio);
                    TMUtils.layoutRowedItems(b, rowedItems, bounds, bounds.width > bounds.height);
                } while(items.length);
            };

            TMUtils.horizontal = function (container) {
                var b = container.box, bounds = $.extend(true, {}, b), items = container.items, titleBox = container.titleBox, titleLength = titleBox.width || titleBox.height;

                titleLength = (bounds.width === 0 || bounds.height === 0) ? 0 : titleLength;
                bounds.left += titleLength;
                bounds.width -= titleLength;
                titleBox.width = titleLength;
                titleBox.height = bounds.height;
                $.each(items, function (idx, item) {
                    var rowedItems = [{
                            item: item,
                            val: item.value() * (b.width - titleLength) * b.height / container.total
                        }];
                    TMUtils.layoutRowedItems(b, rowedItems, bounds, false);
                });
            };

            TMUtils.vertical = function (container) {
                var b = container.box, bounds = $.extend(true, {}, b), items = container.items, titleBox = container.titleBox, titleLength = titleBox.width || titleBox.height;

                titleLength = (bounds.width === 0 || bounds.height === 0) ? 0 : titleLength;
                bounds.top += titleLength;
                bounds.height -= titleLength;
                titleBox.width = bounds.width;
                titleBox.height = titleLength;
                $.each(items, function (idx, item) {
                    var rowedItems = [{
                            item: item,
                            val: item.value() * b.width * (b.height - titleLength) / container.total
                        }];
                    TMUtils.layoutRowedItems(b, rowedItems, bounds, true);
                });
            };

            TMUtils.getNarrowLen = function (bounds) {
                return Math.min(bounds.width, bounds.height);
            };

            TMUtils.getRowedItem = function (item, bounds, ratio) {
                var itemSquare = ratio * item.value();
                return {
                    item: item,
                    val: itemSquare
                };
            };

            TMUtils.getRowedItems = function (items, bounds, ratio) {
                var item = items.shift(), row = [], newRow = [], len = TMUtils.getNarrowLen(bounds), rowedItem = TMUtils.getRowedItem(item, bounds, ratio);
                row.push(rowedItem);
                newRow.push(rowedItem);
                if (items.length > 0) {
                    do {
                        newRow.push(TMUtils.getRowedItem(items[0], bounds, ratio));
                        if (TMUtils.worst(row, len) > TMUtils.worst(newRow, len)) {
                            row = newRow.slice();
                            items.shift();
                        } else {
                            break;
                        }
                    } while(items.length);
                }
                return row;
            };

            TMUtils.layoutRowedItems = function (containerBox, rowedItems, b, isVertical) {
                var left = b.left, top = b.top, maxX = left + b.width, maxY = top + b.height, rowHeight, sum = TMUtils.sumRowedArray(rowedItems);
                if (isVertical) {
                    //if (b.width > b.height) {
                    rowHeight = b.height === 0 ? 0 : sum / b.height;
                    if (left + rowHeight >= maxX) {
                        rowHeight = maxX - left;
                    }
                    $.each(rowedItems, function (idx, item) {
                        var len = rowHeight === 0 ? 0 : item.val / rowHeight;
                        if ((top + len) > maxY || idx === rowedItems.length - 1) {
                            len = maxY - top;
                        }
                        $.extend(item.item.box, {
                            left: left - containerBox.left,
                            top: top - containerBox.top,
                            //left: left,
                            //top: top,
                            width: rowHeight,
                            height: len
                        });
                        top += len;
                    });
                    b.left += rowHeight;
                    b.width -= rowHeight;
                } else {
                    rowHeight = b.width === 0 ? 0 : sum / b.width;
                    if (top + rowHeight >= maxY) {
                        rowHeight = maxY - top;
                    }
                    $.each(rowedItems, function (idx, item) {
                        var len = rowHeight === 0 ? 0 : item.val / rowHeight;
                        if ((left + len) > maxX || idx === rowedItems.length - 1) {
                            len = maxX - left;
                        }
                        $.extend(item.item.box, {
                            left: left - containerBox.left,
                            top: top - containerBox.top,
                            width: len,
                            height: rowHeight
                        });
                        left += len;
                    });
                    b.top += rowHeight;
                    b.height -= rowHeight;
                }
            };

            TMUtils.sumRowedArray = function (array) {
                //http://jsperf.com/summing-array-elements-underscore-reduce-vs-for/2
                //http://jsperf.com/eval-join-vs-reduce
                //for loop is faster.
                var sum = 0, len = array.length;
                for (var i = 0; i < len; i++) {
                    sum += array[i].val;
                }
                return sum;
            };

            TMUtils.worst = function (arr, w) {
                var max, min, tmp, sum = TMUtils.sumRowedArray(arr), sumSquare = sum * sum, wSquare = w * w;
                max = min = arr[0].val;

                //Can't use Math.min/max directly, for loop is the fastest way.
                $.each(arr, function (idx, item) {
                    if (item.val > max) {
                        max = item.val;
                    } else if (item.val < min) {
                        min = item.val;
                    }
                });
                return Math.max((wSquare * max) / sumSquare, sumSquare / (wSquare * min));
            };
            return TMUtils;
        })();

        /** @ignore */
        var TMItemContainer = (function () {
            function TMItemContainer(element, data, tm, parent) {
                if (typeof parent === "undefined") { parent = null; }
                var self = this;
                self.level = (parent && !isNaN(parent.level)) ? parent.level + 1 : 0;
                self.box = self._initBox();
                self.titleBox = self._initBox();
                self.tm = tm;
                self.ele = element;
                self.data = data;
                self.parent = parent;
                self.depth = self.parent === null ? 0 : (self.parent.depth + 1);
                self.total = 0;
                self.items = [];
                self._init();
            }
            TMItemContainer.prototype._initBox = function () {
                return {
                    width: 0,
                    height: 0,
                    left: 0,
                    top: 0
                };
            };

            TMItemContainer.prototype._init = function () {
                var self = this, tmItem;
                if (!self.data || self.data.length === 0) {
                    return;
                }
                $.each(self.data, function (idx, val) {
                    tmItem = self._createTMItem(val, idx);
                    self.items.push(tmItem);
                    self.total += tmItem.value();
                });
            };

            TMItemContainer.prototype._createTMItem = function (data, index) {
                var self = this, tmItemEle = $("<div></div>"), tmOptions = self.tm.options, itemClass = [cls.item, tmOptions.wijCSS.tmitem], tmItem;
                tmItem = new TMItem(tmItemEle, data, self.tm, self, index);
                if (tmItem.items.length > 0) {
                    itemClass.push(cls.itemContainer, tmOptions.wijCSS.tmitemContainer);
                } else {
                    itemClass.push(tmOptions.wijCSS.stateDefault, cls.stateDefault);
                }
                tmItemEle.addClass(itemClass.join(" "));
                return tmItem;
            };

            TMItemContainer.prototype.getColorConverter = function () {
                if (this.colorConverter) {
                    return this.colorConverter;
                }
                if (this.parent) {
                    return this.parent.getColorConverter();
                }
                return null;
            };

            TMItemContainer.prototype.toggleLabelVisibility = function () {
                var self = this;
                if (self.items && self.items.length) {
                    $.each(self.items, function (idx, item) {
                        item.toggleLabelVisibility();
                    });
                }
            };

            TMItemContainer.prototype.setLabels = function (isTitle) {
                var self = this;
                if (self.items && self.items.length) {
                    $.each(self.items, function (idx, item) {
                        item.setLabels(isTitle);
                    });
                }
            };

            TMItemContainer.prototype.setBinding = function (key) {
                var self = this;
                if (self.items && self.items.length) {
                    $.each(self.items, function (idx, item) {
                        item.setBinding(key);
                    });
                }
            };

            TMItemContainer.prototype.applyBox = function () {
                var self = this, renderOptions = {
                    applyBox: true,
                    applyColor: false,
                    applyHtml: false
                };
                self.titleBox = self._initBox();
                self._render(renderOptions);
                self._resetParentTitle();
            };

            TMItemContainer.prototype._resetParentTitle = function () {
                var self = this, tmOptions = self.tm.options, parent = self.parent, ele;
                if (tmOptions.showTitle && parent != null && parent instanceof TMItem) {
                    ele = parent.ele;
                    ele.css({
                        left: 0,
                        top: 0
                    });
                    parent._resetParentTitle();
                }
            };

            TMItemContainer.prototype.applyColor = function () {
                var self = this, renderOptions = {
                    applyBox: false,
                    applyColor: true,
                    applyHtml: false
                };
                self._render(renderOptions);
            };

            TMItemContainer.prototype.render = function () {
                var renderOptions = {
                    applyBox: true,
                    applyColor: false,
                    applyHtml: true
                };
                this._render(renderOptions);
            };

            TMItemContainer.prototype._render = function (options) {
                var self = this;
                if (self.items && self.items.length) {
                    self._renderChildren(options);
                } else {
                    self._renderContent(options);
                }
            };

            TMItemContainer.prototype._renderChildren = function (options) {
                var self = this, tmOptions = self.tm.options, type = tmOptions.type || "squarified";
                if (options.applyBox) {
                    TMUtils[type](self);
                }
                $.each(self.items, function (idx, item) {
                    item._render(options);
                });
            };

            TMItemContainer.prototype._renderContent = function (options) {
            };

            TMItemContainer.prototype._renderColor = function () {
            };

            TMItemContainer.prototype.destroy = function () {
                $.each(this.items, function (idx, item) {
                    item.destroy();
                });
                this.items = null;
            };
            return TMItemContainer;
        })();

        /** @ignore */
        var TMItem = (function (_super) {
            __extends(TMItem, _super);
            function TMItem(element, data, tm, parent, index) {
                var self = this;
                self._label = "label";
                self._value = 0;
                self._color = null;
                self.titleEle = $("<div></div>");
                self.labelEle = $("<span></span>");
                self._isContent = false;
                self._isCustomizeHtml = false;
                if (parent instanceof TMItem) {
                    self.index = parent.index.concat([index]);
                } else {
                    self.index = [index];
                }
                element.data("index", self.index);
                _super.call(this, element, data, tm, parent);
            }
            TMItem.prototype._init = function () {
                var self = this, d = self.data, tmOpts = self.tm.options, defColor = defaultColors[self.index[self.index.length - 1] % defaultColors.length], tmItem;
                self._reset("label")._reset("value")._reset("color");
                if (!d.items || d.items.length === 0) {
                    return;
                }
                $.each(d.items, function (idx, val) {
                    tmItem = self._createTMItem(val, idx);
                    self.items.push(tmItem);
                    //self.total += tmItem.value();
                });

                //If value of an item is not total value of its child items, remove this line.
                self.total = self.value();

                if (d.minColor && d.maxColor) {
                    self._createColorConverter(d.maxColor, d.midColor, d.minColor);
                } else if (self.level === 1 && (tmOpts.maxColor == null || tmOpts.minColor == null)) {
                    //set default color settings to first level items if minColor/maxColor is not set.
                    self._createColorConverter(defColor.max, defColor.mid, defColor.min);
                }
            };

            TMItem.prototype._createColorConverter = function (maxColor, midColor, minColor) {
                var self = this, d = self.data, minValue = d.minColorValue, maxValue = d.maxColorValue, minMaxValue;
                if (minValue == null || maxValue == null) {
                    minMaxValue = self.tm._getMinMaxItemValue(self);
                    if (minValue == null) {
                        minValue = minMaxValue.min;
                    }
                    if (maxValue == null) {
                        maxValue = minMaxValue.max;
                    }
                }
                if (self.colorConverter) {
                    self.colorConverter = null;
                }
                self.colorConverter = new ColorConverter(minColor, minValue, maxColor, maxValue, midColor, d.midColorValue);
            };

            TMItem.prototype._applyBox = function () {
                var self = this, box = self.box;
                self.ele.css({
                    //self.ele.animate({
                    width: box.width,
                    height: box.height,
                    left: box.left,
                    top: box.top
                });
            };

            TMItem.prototype._applyTitleBox = function () {
                var self = this, tmOptions = self.tm.options, box = self.titleBox;
                self.titleEle.css({
                    //self.titleEle.animate({
                    top: 0,
                    left: 0,
                    width: box.width,
                    height: box.height
                });
                if (tmOptions.showTitle) {
                    self.titleEle.show();
                } else {
                    self.titleEle.hide();
                }
            };

            TMItem.prototype._createTitle = function () {
                var self = this, css = self.tm.options.wijCSS;

                self.titleEle.addClass([cls.title, css.header, css.tmtitle].join(" "));
                self.titleEle.prependTo(self.ele);
            };

            TMItem.prototype._setTitle = function () {
                var self = this, tmOptions = self.tm.options, title = self.label(), titleFormatter = tmOptions.titleFormatter;

                if (titleFormatter && $.isFunction(titleFormatter)) {
                    title = $.proxy(titleFormatter, self.data)();
                }
                this.titleEle.html(title);
            };

            TMItem.prototype._createLabel = function () {
                var self = this, tmOptions = self.tm.options;

                self.labelEle.addClass([cls.label, tmOptions.wijCSS.tmlabel].join(" "));
                self.labelEle.prependTo(self.ele);
            };

            TMItem.prototype._setLabel = function () {
                var self = this, tmOptions = self.tm.options, label = self.label(), labelFormatter = tmOptions.labelFormatter;

                if (labelFormatter && $.isFunction(labelFormatter)) {
                    label = $.proxy(labelFormatter, self.data)();
                }
                self.labelEle.html(label);
            };

            TMItem.prototype._render = function (options) {
                var self = this;
                _super.prototype._render.call(this, options);
                if (options.applyBox) {
                    self._applyBox();
                    self._applyTitleBox();
                }
                if (options.applyHtml) {
                    self.ele.appendTo(self.parent.ele);
                }
            };

            TMItem.prototype._renderChildren = function (options) {
                var self = this, tmOptions = self.tm.options;

                //Add title to container.
                self._isContent = false;
                if (options.applyHtml) {
                    self._createTitle();
                    self._setTitle();
                }
                if (options.applyBox) {
                    self.titleBox.height = 0;
                    if (tmOptions.showTitle) {
                        self.titleBox.width = parseInt(tmOptions.titleHeight);
                    } else {
                        self.titleBox.width = 0;
                    }
                }
                _super.prototype._renderChildren.call(this, options);
            };

            TMItem.prototype._renderContent = function (options) {
                var self = this, applyHtml = options.applyHtml, template, tm = self.tm;
                self._isContent = true;
                _super.prototype._renderContent.call(this, options);

                if (applyHtml) {
                    template = self._triggerItemPainting($.extend(true, { htmlTemplate: "" }, self.data));
                    if (typeof template === "string" && template.length > 0) {
                        self._isCustomizeHtml = true;
                        self.ele.empty();
                        self.ele.html(template);
                        self._triggerItemPainted();
                    } else {
                        self._isCustomizeHtml = false;
                    }
                }
                if (!self._isCustomizeHtml) {
                    if (applyHtml) {
                        self._renderHtml();
                        self._triggerItemPainted();
                    }
                    if (options.applyColor) {
                        self._renderColor();
                    }
                }
            };

            TMItem.prototype._triggerItemPainting = function (args) {
                this.tm._trigger("itemPainting", null, args);
                return args.htmlTemplate;
            };

            TMItem.prototype._triggerItemPainted = function () {
                this.tm._trigger("itemPainted");
            };

            TMItem.prototype._renderHtml = function () {
                var self = this;
                self.ele.empty();
                self._createLabel();
                self._setLabel();
                self.toggleLabelVisibility();
            };

            TMItem.prototype._renderColor = function () {
                var self = this, tm = self.tm, color = self.color();
                if (color == null) {
                    //color = tm._getColor(self.value());
                    color = self.parent.getColorConverter().getColor(self.value());
                }
                self.ele.css("background-color", color);
            };

            TMItem.prototype.toggleLabelVisibility = function () {
                var self = this, tmOptions = self.tm.options;
                if (self._isContent) {
                    if (tmOptions.showLabel) {
                        self.labelEle.show();
                    } else {
                        self.labelEle.hide();
                    }
                } else {
                    _super.prototype.toggleLabelVisibility.call(this);
                }
            };

            TMItem.prototype.setLabels = function (isTitle) {
                var self = this;
                if (self._isContent) {
                    if (!isTitle) {
                        self._setLabel();
                    }
                } else {
                    if (isTitle) {
                        self._setTitle();
                    }
                    _super.prototype.setLabels.call(this, isTitle);
                }
            };

            TMItem.prototype.setBinding = function (key) {
                this._reset(key);
                if (!this._isContent) {
                    _super.prototype.setBinding.call(this, key);
                }
            };

            TMItem.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
                if (this.colorConverter) {
                    this.colorConverter = null;
                }
            };

            TMItem.prototype._reset = function (key) {
                var self = this, tmOptions = self.tm.options, keyVal = tmOptions[key + "Binding"] || key;
                if (keyVal in self.data) {
                    self["_" + key] = self.data[keyVal];
                }
                return self;
            };

            TMItem.prototype.label = function (value) {
                var self = this;
                if (value === undefined) {
                    return self._label;
                } else {
                    self._label = value;
                    return self;
                }
            };
            TMItem.prototype.value = function (value) {
                var self = this;
                if (value === undefined) {
                    return self._value;
                } else {
                    self._value = value;
                    return self;
                }
            };
            TMItem.prototype.color = function (value) {
                var self = this;
                if (value === undefined) {
                    return self._color;
                } else {
                    self._color = value;
                    return self;
                }
            };

            TMItem.prototype.click = function (e) {
            };

            TMItem.prototype.mouseOver = function () {
                if (this._isContent) {
                    var tmOptions = this.tm.options;
                    this.ele.addClass(tmOptions.wijCSS.stateHover).addClass(cls.stateHover);
                }
            };
            TMItem.prototype.mouseOut = function () {
                if (this._isContent) {
                    var tmOptions = this.tm.options;
                    this.ele.removeClass(tmOptions.wijCSS.stateHover).removeClass(cls.stateHover);
                }
            };
            return TMItem;
        })(TMItemContainer);

        

        

        

        

        

        

        
        var wijtreemap_options = (function () {
            function wijtreemap_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijtreemap')";
                /** wijtreemap css, extend from $.wijmo.wijCSS
                * @ignore
                */
                this.wijCSS = {
                    wijtreemap: "",
                    tmcontainer: "",
                    tmitem: "",
                    tmitemContainer: "",
                    tmtitle: "",
                    tmlabel: "",
                    tmbuttons: "",
                    tmbackButton: "",
                    tmhomeButton: ""
                };
                /** wijtreemap css, extend from $.wijmo.wijCSS
                * @ignore
                */
                this.wijMobileCSS = {};
                /**
                * A value that indicates the width of the treemap in pixels.
                * @remarks
                * Note that this value overrides any value you may set in the <div> element that
                * you use in the body of the HTML page.
                * @type {number}
                */
                this.width = null;
                /**
                * A value that indicates the height of the treemap in pixels.
                * @remarks
                * Note that this value overrides any value you may set in the <div> element that
                * you use in the body of the HTML page.
                * @type {number}
                */
                this.height = null;
                /** A value that indicates the type of treemap to be displayed.
                * @remarks Options are 'squarified', 'horizontal' and 'vertical'.
                */
                this.type = "squarified";
                /***/
                /*
                showDepth: number = 0;*/
                /**
                * A value that indicates the array to use as a source that you can bind to treemap.
                * @remarks
                * Use the valueBinding, labelBinding, colorBinding option, and bind values to treemap.
                */
                this.data = null;
                /** A value that indicates the field to each item's value. Default value field is 'value' if valueBinding is not set. */
                this.valueBinding = null;
                /** A value that indicates the field to each item's label  Default label field is 'label' if labelBinding is not set.*/
                this.labelBinding = null;
                /** A value that indicates the field to each item's color  Default color field is 'color' if colorBinding is not set.*/
                this.colorBinding = null;
                /***/
                /*
                animation: any = null;*/
                /** A value that indicates whether to show the label. */
                this.showLabel = true;
                /**
                * A value that indicates a function which is used to format the label of treemap item.
                * @type {Function}
                */
                this.labelFormatter = null;
                /** A value that indicates whether to show the tooltip. */
                this.showTooltip = false;
                /** A value that indicates options of tooltip.
                * @remarks Its value is wijtooltip's option, visit
                * http://wijmo.com/docs/wijmo/#Wijmo~jQuery.fn.-~wijtooltip.html for more details.*/
                this.tooltipOptions = null;
                /** A value that indicates whether to show the title. */
                this.showTitle = true;
                /** A value that indicates the height of the title. */
                this.titleHeight = 20;
                /**
                * A value that indicates a function which is used to format the title of treemap item.
                * @type {Function}
                */
                this.titleFormatter = null;
                /**
                * A value that indicates the color of min value.
                */
                this.minColor = null;
                /**
                * A value that indicates min value.
                * If this option is not set, treemap will calculate min value automatically.
                */
                this.minColorValue = null;
                /**
                * A value that indicates the color of mid value.
                */
                this.midColor = null;
                /**
                * A value that indicates mid value.
                * If this option is not set, treemap will calculate mid value automatically.
                */
                this.midColorValue = null;
                /**
                * A value that indicates the color of max value.
                */
                this.maxColor = null;
                /**
                * A value that indicates max value.
                * If this option is not set, treemap will calculate max value automatically.
                */
                this.maxColorValue = null;
                /**
                * A value that indicates whether to show back button after treemap drilled down.
                */
                this.showBackButtons = false;
                //Events
                /**
                * This event fires before item is painting. User can create customize item in this event.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {Object} data Data of item to be painted, set value to data.htmlTemplate to customize treemap item.
                */
                this.itemPainting = null;
                /**
                * This event fires after item is painted.
                * @event
                */
                this.itemPainted = null;
                /**
                * This event fires before treemap is painting.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {JQuery} args The element of wijtreemap.
                */
                this.painting = null;
                /**
                * This event fires after treemap is painted.
                * @event
                */
                this.painted = null;
                /**
                * This event fires before drill down. This event can be cancelled, use "return false;" to cancel the event.
                * @event
                * @dataKey clickItemData The data of clicked item.
                * @dataKey currentData The data of current item.
                * @dataKey targetData The data of target item to be drilled down.
                */
                this.drillingDown = null;
                /**
                * This event fires after drill down.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {Object} data The data of item that is drilled down.
                */
                this.drilledDown = null;
                /**
                * This event fires before roll up. This event can be cancelled, use "return false;" to cancel the event.
                * @event
                * @dataKey clickItemData The data of clicked item.
                * @dataKey currentData The data of current item.
                * @dataKey targetData The data of target item to be rolled up.
                */
                this.rollingUp = null;
                /**
                * This event fires after roll up.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {Object} data The data of item that is rolled up.
                */
                this.rolledUp = null;
            }
            return wijtreemap_options;
        })();
        ;

        wijtreemap.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijtreemap_options());
        $.wijmo.registerWidget(widgetName, wijtreemap.prototype);
    })(wijmo.treemap || (wijmo.treemap = {}));
    var treemap = wijmo.treemap;
})(wijmo || (wijmo = {}));

