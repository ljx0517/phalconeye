/*
 *
 * Wijmo Library 3.20143.59
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 * ----
 * Credits: Wijmo includes some MIT-licensed software, see copyright notices below.
 */
/// <reference path="../wijutil/jquery.wijmo.wijutil.ts"/>
/// <reference path="../Base/jquery.wijmo.widget.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (flipcard) {
        "use strict";

        var $ = jQuery, wijFlipCardClass = "wijmo-wijflipcard", wijFlipCardPanelsClass = "wijmo-wijflipcard-panels", wijFlipCardPanelClass = "wijmo-wijflipcard-panel", wijFlipCardFrontPanelClass = "wijmo-wijflipcard-frontpanel", wijFlipCardBackPanelClass = "wijmo-wijflipcard-backpanel";

        /** @widget */
        var wijflipcard = (function (_super) {
            __extends(wijflipcard, _super);
            function wijflipcard() {
                _super.apply(this, arguments);
            }
            wijflipcard.prototype._create = function () {
                var self = this;
                _super.prototype._create.call(this);
                var panels = this.element.children("div");
                this.nativeDivsLength = panels.length;
                this._storeNativePanelsStyles();
                if (panels.length === 2) {
                    this._getPanelsFromElements(panels);
                    this._storeFrontAndBackPanelsStyles();
                } else {
                    this._createPanels();
                }
                this.isCSS3Enabled = isCSS3AnimationEnabled();
                this.isHover = false;
                this._decorateFlipCard();
                this.frontEleOpacity = this.frontPanel.css("opacity");
                this.backEleOpacity = this.backPanel.css("opacity");
                this._createAnimation();
                this.bounds = this._getBounds(this.element);
                if (!this._isDisabled()) {
                    this._bindEvents();
                }
            };

            wijflipcard.prototype._storeNativePanelsStyles = function () {
                var elementClass = this.element.attr("class"), elemenStyle = this.element.attr("style");

                this.nativeOuterPanelClass = (elementClass && elementClass !== "") ? elementClass : undefined;

                this.nativeOuterPanelStyle = (elemenStyle && elemenStyle !== "") ? elemenStyle : undefined;
            };

            wijflipcard.prototype._reStoreNativePanelsStyles = function () {
                if (this.nativeOuterPanelClass) {
                    this.element.attr("class", this.nativeOuterPanelClass);
                } else {
                    this.element.removeAttr("class");
                }
                if (this.nativeOuterPanelStyle) {
                    this.element.attr("style", this.nativeOuterPanelStyle);
                } else {
                    this.element.removeAttr("style");
                }
            };

            wijflipcard.prototype._storeFrontAndBackPanelsStyles = function () {
                var frontClass = this.frontPanel.attr("class"), frontStyle = this.frontPanel.attr("style"), backClass = this.backPanel.attr("class"), backStyle = this.backPanel.attr("style");

                this.nativeFrontPanelClass = (frontClass && frontClass !== "") ? frontClass : undefined;
                this.nativeFrontPanelStyle = (frontStyle && frontStyle !== "") ? frontStyle : undefined;
                this.nativeBackPanelClass = (backClass && backClass !== "") ? backClass : undefined;
                this.nativeBackPanelStyle = (backStyle && backStyle !== "") ? backStyle : undefined;
            };

            wijflipcard.prototype._reStoreFrontAndBackPanelsStyles = function () {
                if (this.nativeFrontPanelClass) {
                    this.frontPanel.attr("class", this.nativeFrontPanelClass);
                } else {
                    this.frontPanel.removeAttr("class");
                }

                if (this.nativeFrontPanelStyle) {
                    this.frontPanel.attr("style", this.nativeFrontPanelStyle);
                } else {
                    this.frontPanel.removeAttr("style");
                }

                if (this.nativeBackPanelClass) {
                    this.backPanel.attr("class", this.nativeBackPanelClass);
                } else {
                    this.backPanel.removeAttr("class");
                }

                if (this.nativeBackPanelStyle) {
                    this.backPanel.attr("style", this.nativeBackPanelStyle);
                } else {
                    this.backPanel.removeAttr("style");
                }
            };

            wijflipcard.prototype._bindEvents = function () {
                var _this = this;
                var touchEventPre = "", event = this.options.triggerEvent;

                if ($.support.isTouchEnabled && $.support.isTouchEnabled() && $.mobile) {
                    this.element.on("touchend.wijflipcard", "." + wijFlipCardPanelClass, $.proxy(this._flipPanels, this));
                } else {
                    if (event === "click") {
                        this.element.on(touchEventPre + "click.wijflipcard", "." + wijFlipCardPanelClass, $.proxy(this._flipPanels, this));
                    } else {
                        if (this.isCSS3Enabled) {
                            this.element.on(touchEventPre + "mouseenter.wijflipcard", this.element, $.proxy(this._flipPanels, this)).on(touchEventPre + "mouseleave.wijflipcard", this.element, $.proxy(this._flipPanels, this));
                        } else {
                            $("body").on(touchEventPre + "mousemove.wijflipcard", function (e) {
                                _this.mousePostion = { x: e.pageX || e.clientX, y: e.pageY || e.clientY };
                            });
                            this.element.on(touchEventPre + "mouseenter.wijflipcard", this.element, $.proxy(this._flipPanelsByMouseEnter, this)).on(touchEventPre + "mouseleave.wijflipcard", this.element, $.proxy(this._flipPanelsByMouseLeave, this));
                        }
                    }
                }
            };

            wijflipcard.prototype._unbindEvents = function () {
                this.element.off(".wijflipcard");
                $("body").off(".wijflipcard");
            };

            wijflipcard.prototype._getBounds = function ($el) {
                var h = $el.height(), w = $el.width(), t = $el.offset().top, l = $el.offset().left;
                return { h: h, w: w, t: t, l: l };
            };

            wijflipcard.prototype._isMouseInsideRect = function (p, b) {
                if (p.x < b.l || p.x >= b.l + b.w) {
                    return false;
                }
                if (p.y <= b.t || p.y >= b.t + b.h) {
                    /*fix 1px on the mouse out the element
                    (e.g. 31<30.98 now 31<30.98+1 maybe
                    pageY/PageX are int but left/top are float)*/
                    return false;
                }
                return true;
            };

            wijflipcard.prototype._flipPanelsByMouseEnter = function (e, needNotCancelBubble) {
                if (!this.isHover && $(e.currentTarget).data('flipLock') !== 1) {
                    this.isHover = true;
                    this._flipPanels(e);
                }
                if (!needNotCancelBubble) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                return false;
            };

            wijflipcard.prototype._flipPanelsByMouseLeave = function (e, needNotCancelBubble) {
                if ($(e.currentTarget).data('flipLock') !== 1) {
                    this.isHover = false;
                    this._flipPanels(e);
                }
                if (!needNotCancelBubble) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                return false;
            };

            wijflipcard.prototype._flipPanels = function (e) {
                var _this = this;
                var o = this.options, animation = o.animation, type = animation.type, mouseisHoverElement, virtualEvent, animations = $.wijmo.wijflipcard.animations, isFrontPanelVisible = this.frontPanel.is(":visible"), isFlipped, hideEle = isFrontPanelVisible ? this.frontPanel : this.backPanel, showEle = isFrontPanelVisible ? this.backPanel : this.frontPanel;

                if (!animation.disabled) {
                    if (animations && type && animations[type] && animations[type]["animation"]) {
                        //custom animations.
                        animations[type]["animation"](animation, this.element, function () {
                            return _this._onFlipping();
                        }, function () {
                            if (_this.options.triggerEvent !== "click" && !_this.isCSS3Enabled) {
                                mouseisHoverElement = _this._isMouseInsideRect(_this.mousePostion, _this.bounds);
                                if (mouseisHoverElement !== _this.isHover) {
                                    virtualEvent = { currentTarget: _this.element };
                                    if (mouseisHoverElement) {
                                        _this._flipPanelsByMouseEnter(virtualEvent, true);
                                    } else {
                                        _this._flipPanelsByMouseLeave(virtualEvent, true);
                                    }
                                }
                            }
                            if (_this.isCSS3Enabled) {
                                isFlipped = _this.element.hasClass("wijflipshowback");
                            } else {
                                isFlipped = _this.frontPanel.css("visibility") === "hidden";
                            }
                            _this._onFlipped(isFlipped);
                        });
                    } else if ($.effects && ($.effects[type] || ($.effects.effect && $.effects.effect[type]))) {
                        //individual effects in jqueryui 1.9 are now defined on
                        // $.effects.effect rather than directly on $.effects.
                        this._flipWithJQueryAnimation(hideEle, showEle);
                    } else {
                        this._flipWithoutAnimation(hideEle, showEle);
                    }
                } else {
                    this._flipWithoutAnimation(hideEle, showEle);
                }
            };

            wijflipcard.prototype._flipWithJQueryAnimation = function (hideEle, showEle) {
                var _this = this;
                var o = this.options, animation = o.animation, duration = o.duration, type = animation.type, flippble;

                flippble = this._trigger("flipping", null, {
                    frontPanel: this.frontPanel,
                    backPanel: this.backPanel
                });
                if (flippble === false) {
                    return;
                }
                hideEle.hide(type, animation, duration);
                showEle.show(type, animation, duration, function () {
                    // need to set to "none" when using jquery effect
                    // when it is flip mode, may be remove the attribute
                    showEle.css("transform", "none");
                    _this._onFlipped();
                });
            };

            wijflipcard.prototype._flipWithoutAnimation = function (hideEle, showEle) {
                var flippble;

                flippble = this._trigger("flipping", null, {
                    frontPanel: this.frontPanel,
                    backPanel: this.backPanel
                });
                if (flippble === false) {
                    return;
                }
                hideEle.hide();
                showEle.show();
                this._onFlipped();
            };

            wijflipcard.prototype._onFlipping = function () {
                return this._trigger("flipping", null, {
                    frontPanel: this.frontPanel,
                    backPanel: this.backPanel
                });
            };

            wijflipcard.prototype._onFlipped = function (isFlipped) {
                if (isFlipped === undefined || isFlipped === null) {
                    isFlipped = this.frontPanel.css("display") === "none";
                }
                this._trigger("flipped", null, {
                    frontPanel: this.frontPanel,
                    backPanel: this.backPanel,
                    isFlipped: isFlipped
                });
            };

            wijflipcard.prototype._createAnimation = function () {
                var o = this.options, animation = o.animation, type = animation.type, animations = $.wijmo.wijflipcard.animations, createAnimation;

                if (!animation.disabled) {
                    if (animations && type && animations[type]) {
                        createAnimation = animations[type]["create"];
                        if (createAnimation && $.isFunction(createAnimation)) {
                            createAnimation(animation, this.element);
                        }
                    }
                }
            };

            wijflipcard.prototype._decorateFlipCard = function () {
                var o = this.options, wijCSS = o.wijCSS;

                this.element.addClass(wijFlipCardClass).addClass(wijCSS.widget);
                if (wijCSS.wijFlipCardClass.length) {
                    this.element.addClass(wijCSS.wijFlipCardClass);
                }
                this.frontPanel.addClass(wijFlipCardPanelClass).addClass(wijFlipCardFrontPanelClass).addClass(wijCSS.cornerAll).addClass(wijCSS.stateDefault).addClass(wijCSS.content);
                this.backPanel.addClass(wijFlipCardPanelClass).addClass(wijFlipCardBackPanelClass).addClass(wijCSS.cornerAll).addClass(wijCSS.stateDefault).addClass(wijCSS.content);
                if (wijCSS.wijFlipCardPanelClass.length) {
                    this.frontPanel.addClass(wijCSS.wijFlipCardPanelClass);
                    this.backPanel.addClass(wijCSS.wijFlipCardPanelClass);
                }
                if (wijCSS.wijFlipCardFrontPanelClass.length) {
                    this.frontPanel.addClass(wijCSS.wijFlipCardFrontPanelClass);
                }
                if (wijCSS.wijFlipCardBackPanelClass.length) {
                    this.backPanel.addClass(wijCSS.wijFlipCardBackPanelClass);
                }
                if (this._isDisabled()) {
                    this.element.addClass(wijCSS.stateDisabled);
                }

                this._setWidth(o.width);
                this._setHeight(o.height);
                this._setCSS3Options();
            };

            wijflipcard.prototype._removeDecoration = function () {
                var o = this.options, wijCSS = o.wijCSS;

                //remove panels div element
                if (this.nativeDivsLength === 2) {
                    this.frontPanel.appendTo(this.element);
                    this.backPanel.appendTo(this.element);
                    this._reStoreFrontAndBackPanelsStyles();
                } else {
                    this.frontPanel.remove();
                    this.backPanel.remove();
                }
                this.panels.remove();
                this._reStoreNativePanelsStyles();
            };

            wijflipcard.prototype._setWidth = function (value) {
                if (value !== undefined && value !== null) {
                    this.element.width(value);
                    this.frontPanel.width(value);
                    this.backPanel.width(value);
                }
            };

            wijflipcard.prototype._setHeight = function (value) {
                if (value !== undefined && value !== null) {
                    this.element.height(value);
                    this.element.find(".wijmo-wijflipcard-frontpanel").height(value);
                    this.element.find(".wijmo-wijflipcard-backpanel").height(value);
                }
            };

            wijflipcard.prototype._setCSS3Options = function () {
                if (!this.isCSS3Enabled) {
                    return;
                }
                var panelHeight = this.element.find(".wijmo-wijflipcard-panel").outerHeight(true) / 2, panelWidth = this.element.find(".wijmo-wijflipcard-panel").outerWidth(true) / 2;

                // the "transformOrigin" is set to "wijmo-wijflipcard-panels", so the center is decided by panel's size.
                setCSS3Style(this.element.find(".wijmo-wijflipcard-panels")[0], "transformOrigin", panelWidth + "px " + panelHeight + "px");
            };

            wijflipcard.prototype._getPanelsFromElements = function (panels) {
                this.frontPanel = $(panels[0]);
                this.backPanel = $(panels[1]);
                this.panels = $("<div></div>").appendTo(this.element).addClass(wijFlipCardPanelsClass);
                this.frontPanel.appendTo(this.panels);
                this.backPanel.appendTo(this.panels);
            };

            wijflipcard.prototype._createPanels = function () {
                this.element.empty();
                this.panels = $("<div></div>").appendTo(this.element).addClass(wijFlipCardPanelsClass);
                this.frontPanel = $("<div></div>").appendTo(this.panels);
                this.backPanel = $("<div></div>").appendTo(this.panels);
            };

            wijflipcard.prototype._setOption = function (key, value) {
                if (this.options[key] !== value) {
                    switch (key) {
                        case "triggerEvent":
                            this.options[key] = value;
                            if (!this._isDisabled()) {
                                this._unbindEvents();
                                this._bindEvents();
                            }
                            break;
                        case "width":
                            this._setWidth(value);
                            this._setCSS3Options();
                            break;
                        case "height":
                            this._setHeight(value);
                            this._setCSS3Options();
                            break;
                        case "animation":
                            this.options[key] = value;
                            this._resettingAnimation();
                            break;
                        default:
                            break;
                    }
                }
                _super.prototype._setOption.call(this, key, value);
            };

            wijflipcard.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._toggleDisableFlipCard(true);
            };

            wijflipcard.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._toggleDisableFlipCard(false);
            };

            wijflipcard.prototype._toggleDisableFlipCard = function (disabled) {
                if (disabled) {
                    this._unbindEvents();
                } else {
                    this._unbindEvents();
                    this._bindEvents();
                }
                this.element.toggleClass(this.options.wijCSS.stateDisabled, disabled);
            };

            wijflipcard.prototype._resettingAnimation = function () {
                this.element.removeClass("wijflip").removeClass("wijvflip").removeClass("wijflipshowback").removeClass("ie").removeClass("nonie");
                this.frontPanel.css("opacity", this.frontEleOpacity).show();
                this.backPanel.css("opacity", this.frontEleOpacity).show();
                if (!this.isCSS3Enabled) {
                    this.frontPanel.css("visibility", "visible");
                    this.backPanel.css("visibility", "visible");
                }
                this._unbindEvents();
                this._createAnimation();
                if (!this._isDisabled()) {
                    this._bindEvents();
                }
            };

            wijflipcard.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
                this._unbindEvents();
                this._removeDecoration();
            };
            return wijflipcard;
        })(wijmo.wijmoWidget);
        flipcard.wijflipcard = wijflipcard;

        var wijflipcard_options = (function () {
            function wijflipcard_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijflipcard')";
                /** @ignore*/
                this.wijCSS = {
                    wijFlipCardClass: "",
                    wijFlipCardPanelClass: "",
                    wijFlipCardFrontPanelClass: "",
                    wijFlipCardBackPanelClass: ""
                };
                /** @ignore*/
                this.wijMobileCSS = {};
                /** A value that determines whether or not to disable the wijflipcard widget. */
                this.disabled = false;
                /** A value that indicates the width of the wijflipcard widget. */
                this.width = null;
                /** A value that indicates the height of the wijflipcard widget. */
                this.height = null;
                /** A value that indicates the event used to flip between two panels.
                * @remarks The value can be 'click', 'mouseenter'
                */
                this.triggerEvent = "click";
                /** The flip animation options, define direction, duration etc.
                * @type {object}
                * @remark
                * disabled: if true, it would be no flip effect; otherwise, it has.
                * type: default value is "flip", user can set customize animation in jquery ui effect.
                * duration: the animation duration, default value is 500ms.
                * direction: the flip animation direction, default value is "horizontal", user can set "vertical".
                */
                this.animation = {
                    disabled: false,
                    type: "flip",
                    duration: 500,
                    direction: "horizontal"
                };
                /** This event is triggered when flip animation start.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IFlippingEventArgs} data The data with this event.
                */
                this.flipping = null;
                /** This event is triggered when flip animation end.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IFlippedEventArgs} data The data with this event.
                */
                this.flipped = null;
            }
            return wijflipcard_options;
        })();

        wijflipcard.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijflipcard_options());

        $.wijmo.registerWidget("wijflipcard", wijflipcard.prototype);

        

        

        // flip effect
        var int_prop = function (fx) {
            fx.elem.style[fx.prop] = parseInt(fx.now, 10) + fx.unit;
        };

        var isIE6orOlder = function () {
            return (/*@cc_on!@*/ false && (typeof document.body.style.maxHeight === "undefined"));
        };

        $.extend($.fx.step, {
            borderTopWidth: int_prop,
            borderBottomWidth: int_prop,
            borderLeftWidth: int_prop,
            borderRightWidth: int_prop
        });

        $.fn.wijRevertFlip = function () {
            return this.each(function () {
                var $this = $(this);
                $this.wijFlip($this.data('flipRevertedSettings'));
            });
        };

        $.fn.wijFlip = function (settings) {
            return this.each(function () {
                var $this = $(this), flipObj, $clone, dirOption, dirOptions, newContent, ie6 = isIE6orOlder();

                if ($this.data('flipLock') || !settings) {
                    return false;
                }

                //flipping start event
                if (settings && settings.animationStart && $.isFunction(settings.animationStart)) {
                    if (!settings.animationStart.call(this)) {
                        return false;
                    }
                }

                var revertedSettings = {
                    direction: (function (direction) {
                        switch (direction) {
                            case "tb":
                                return "bt";
                            case "bt":
                                return "tb";
                            case "lr":
                                return "rl";
                            case "rl":
                                return "lr";
                            default:
                                return "bt";
                        }
                    })(settings.direction),
                    bgColor: settings.color || "#999",
                    color: settings.bgColor || $this.css("background-color"),
                    //content: $this.html(),
                    speed: settings.speed || 500,
                    animationStart: settings.animationStart || function () {
                    },
                    onBefore: settings.onBefore || function () {
                    },
                    onEnd: settings.onEnd || function () {
                    },
                    onAnimation: settings.onAnimation || function () {
                    }
                };

                $this.data('flipRevertedSettings', revertedSettings).data('flipLock', 1).data('flipSettings', revertedSettings);

                flipObj = {
                    width: $this.width(),
                    height: $this.height(),
                    bgColor: settings.bgColor || $this.css("background-color"),
                    fontSize: $this.css("font-size") || "12px",
                    direction: settings.direction || "tb",
                    toColor: settings.color || "#999",
                    speed: settings.speed || 500,
                    top: $this.offset().top,
                    left: $this.offset().left,
                    target: settings.content || null,
                    transparent: "transparent",
                    dontChangeColor: settings.dontChangeColor || false,
                    onBefore: settings.onBefore || function () {
                    },
                    onEnd: settings.onEnd || function () {
                    },
                    onAnimation: settings.onAnimation || function () {
                    }
                };

                $this.data('flipObj', flipObj);

                // This is the first part of a trick to support
                // transparent borders using chroma filter for IE6
                // The color below is arbitrary, lets just hope it is not used in the animation
                ie6 && (flipObj.transparent = "#123456");

                $clone = $this.css("visibility", "hidden").clone(true).data('flipLock', 1).appendTo("body").html("").css({ visibility: "visible", position: "absolute", left: flipObj.left, top: flipObj.top, margin: 0, zIndex: 9999, "-webkit-box-shadow": "0px 0px 0px #000", "-moz-box-shadow": "0px 0px 0px #000" });

                $this.data("clone", $clone);
                var defaultStart = function () {
                    return {
                        backgroundColor: flipObj.transparent,
                        fontSize: 0,
                        lineHeight: 0,
                        borderTopWidth: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        borderBottomWidth: 0,
                        borderTopColor: flipObj.transparent,
                        borderBottomColor: flipObj.transparent,
                        borderLeftColor: flipObj.transparent,
                        borderRightColor: flipObj.transparent,
                        background: "none",
                        borderStyle: 'solid',
                        height: 0,
                        width: 0
                    };
                };
                var defaultHorizontal = function () {
                    var waist = (flipObj.height / 100) * 25;
                    var start = defaultStart();
                    start.width = flipObj.width;
                    return {
                        "start": start,
                        "first": {
                            borderTopWidth: 0,
                            borderLeftWidth: waist,
                            borderRightWidth: waist,
                            borderBottomWidth: 0,
                            borderTopColor: '#999',
                            borderBottomColor: '#999',
                            top: (flipObj.top + (flipObj.height / 2)),
                            left: (flipObj.left - waist)
                        },
                        "second": {
                            borderBottomWidth: 0,
                            borderTopWidth: 0,
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                            borderTopColor: flipObj.transparent,
                            borderBottomColor: flipObj.transparent,
                            top: flipObj.top,
                            left: flipObj.left
                        }
                    };
                };
                var defaultVertical = function () {
                    var waist = (flipObj.height / 100) * 25;
                    var start = defaultStart();
                    start.height = flipObj.height;
                    return {
                        "start": start,
                        "first": {
                            borderTopWidth: waist,
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                            borderBottomWidth: waist,
                            borderLeftColor: '#999',
                            borderRightColor: '#999',
                            top: flipObj.top - waist,
                            left: flipObj.left + (flipObj.width / 2)
                        },
                        "second": {
                            borderTopWidth: 0,
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                            borderBottomWidth: 0,
                            borderLeftColor: flipObj.transparent,
                            borderRightColor: flipObj.transparent,
                            top: flipObj.top,
                            left: flipObj.left
                        }
                    };
                };

                dirOptions = {
                    "tb": function () {
                        var d = defaultHorizontal();
                        d.start.borderTopWidth = flipObj.height;
                        d.start.borderTopColor = flipObj.bgColor;
                        d.second.borderBottomWidth = flipObj.height;
                        d.second.borderBottomColor = flipObj.toColor;
                        return d;
                    },
                    "bt": function () {
                        var d = defaultHorizontal();
                        d.start.borderBottomWidth = flipObj.height;
                        d.start.borderBottomColor = flipObj.bgColor;
                        d.second.borderTopWidth = flipObj.height;
                        d.second.borderTopColor = flipObj.toColor;
                        return d;
                    },
                    "lr": function () {
                        var d = defaultVertical();
                        d.start.borderLeftWidth = flipObj.width;
                        d.start.borderLeftColor = flipObj.bgColor;
                        d.second.borderRightWidth = flipObj.width;
                        d.second.borderRightColor = flipObj.toColor;
                        return d;
                    },
                    "rl": function () {
                        var d = defaultVertical();
                        d.start.borderRightWidth = flipObj.width;
                        d.start.borderRightColor = flipObj.bgColor;
                        d.second.borderLeftWidth = flipObj.width;
                        d.second.borderLeftColor = flipObj.toColor;
                        return d;
                    }
                };

                dirOption = dirOptions[flipObj.direction]();

                // Second part of IE6 transparency trick.
                ie6 && (dirOption.start.filter = "chroma(color=" + flipObj.transparent + ")");

                newContent = function () {
                    var target = flipObj.target;
                    return target && target.jquery ? target.html() : target;
                };

                $clone.queue(function () {
                    flipObj.onBefore($clone, $this);
                    $clone.html('').css(dirOption.start);
                    $clone.dequeue();
                });

                $clone.animate(dirOption.first, flipObj.speed);

                $clone.queue(function () {
                    flipObj.onAnimation($clone, $this);
                    $clone.dequeue();
                });
                $clone.animate(dirOption.second, flipObj.speed);

                $clone.queue(function () {
                    if (!flipObj.dontChangeColor) {
                        $this.css({ backgroundColor: flipObj.toColor });
                    }
                    $this.css({ visibility: "visible" });

                    var nC = newContent();
                    if (nC) {
                        $this.html(nC);
                    }
                    $clone.remove();
                    $this.removeData('flipLock');
                    flipObj.onEnd($clone, $this);

                    $clone.dequeue();
                });
            });
        };

        var isCSS3AnimationEnabled = function () {
            var animation = false;
            if ('WebkitTransform' in document.body.style || 'MozTransform' in document.body.style || 'OTransform' in document.body.style || 'transform' in document.body.style) {
                animation = true;
            }
            return animation;
        };

        var toCamelCase = function (str) {
            return str.toLowerCase().replace(/(\-[a-z])/g, function ($1) {
                return $1.toUpperCase().replace('-', '');
            });
        };

        var setCSS3Style = function (el, prop, val) {
            var vendors = ['-moz-', '-webkit-', '-o-', '-ms-', '-khtml-', ''];
            $.each(vendors, function (idx, v) {
                var style = $.camelCase(v + prop);
                if (style in el.style) {
                    el.style[style] = val;
                }
            });
        };

        $.extend($.wijmo.wijflipcard, {
            animations: {
                flip: {
                    create: function (options, flipEle) {
                        var direction = options.direction === "horizontal" ? "h" : "v", flipClass = "wij" + (direction === "h" ? "" : "v") + "flip";
                        flipEle.addClass(flipClass);
                        if ($.browser && $.browser.msie) {
                            flipEle.addClass("ie");
                        } else {
                            flipEle.addClass("nonie");
                        }
                    },
                    animation: function (options, flipEle, animationStart, animationComplete) {
                        var o = options, frontPane = flipEle.find("." + wijFlipCardFrontPanelClass), backPane = flipEle.find('.' + wijFlipCardBackPanelClass), aniCmp = animationComplete, duration = o.duration || 500, durationWithMs = duration + "ms", halfDur = duration / 2, direction = o.direction === "horizontal" ? "h" : "v", flipClass = "wij" + (direction === "h" ? "" : "v") + "flip";

                        if (isCSS3AnimationEnabled()) {
                            if (o.duration) {
                                if ($.browser.msie) {
                                    // duration need to parse
                                    flipEle.find(".wijmo-wijflipcard-panel").css("transition-duration", durationWithMs);
                                } else {
                                    flipEle.find(".wijmo-wijflipcard-panels").css("transition-duration", durationWithMs).css("-ms-transition-duration", durationWithMs);
                                }
                            }
                            if (animationStart && $.isFunction(animationStart)) {
                                if (animationStart.call(wijflipcard) === false) {
                                    return;
                                }
                            }

                            flipEle.on('transitionend.wij webkitTransitionEnd.wij oTransitionEnd.wij otransitionend.wij MSTransitionEnd.wij', function () {
                                if (animationComplete && $.isFunction(animationComplete)) {
                                    animationComplete.call(wijflipcard);
                                }
                                flipEle.off(".wij");
                            });
                            flipEle.toggleClass("wijflipshowback");
                        } else {
                            if (flipEle.data('flipped')) {
                                flipEle.wijRevertFlip();
                                flipEle.data('flipped', false);
                            } else {
                                flipEle.stop(true, true).wijFlip({
                                    direction: o.direction === "horizontal" ? "lr" : "tb",
                                    speed: duration,
                                    color: backPane.css("background-color"),
                                    bgColor: frontPane.css("background-color"),
                                    animationStart: animationStart,
                                    onBefore: function () {
                                        // or use display = none to hidden
                                        frontPane.css("visibility", "hidden");
                                        backPane.css("visibility", "hidden");
                                        //if (animationStart && $.isFunction(animationStart)) {
                                        //    if (animationStart.call(this) === false) {
                                        //        return;
                                        //    }
                                        //}
                                    },
                                    onEnd: function () {
                                        if (flipEle.data('flipped')) {
                                            backPane.css("visibility", "visible").css("transform", "none");
                                        } else {
                                            frontPane.css("visibility", "visible").css("transform", "none");
                                        }

                                        if (animationComplete && $.isFunction(animationComplete)) {
                                            animationComplete.call(this);
                                        }
                                    }
                                });
                                flipEle.data('flipped', true);
                            }
                        }
                    },
                    destroy: function (flipEle) {
                        flipEle.removeClass("wijflip").removeClass("wijvflip").removeClass("ie").removeClass("nonie");
                    }
                }
            }
        });
    })(wijmo.flipcard || (wijmo.flipcard = {}));
    var flipcard = wijmo.flipcard;
})(wijmo || (wijmo = {}));

