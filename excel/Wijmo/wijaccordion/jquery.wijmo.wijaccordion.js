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
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/// <reference path="../wijutil/jquery.wijmo.wijutil.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals jQuery,$,window,alert,document,confirm,location,setTimeout,Globalize,amplify*/
    /*jslint white: false */
    /*jslint nomen: false*/
    /*jslint browser: true*/
    /*jslint continue: true*/
    /*jslint devel: true*/
    /*jslint forin: true*/
    /*jslint maxlen: 110*/
    /*
    * Depends:
    *  jquery.ui.core.js
    *  jquery.ui.widget.js
    *  jquery.wijmo.wijutil.js
    *  jquery.wijmo.wijaccordion.js
    *
    */
    (function (accordion) {
        "use strict";
        var $ = jQuery, widgetName = "wijaccordion", commonClass = {
            //Classes
            accordionClass: "wijmo-wijaccordion",
            accordionTopClass: "wijmo-wijaccordion-top",
            accordionBottomClass: "wijmo-wijaccordion-bottom",
            accordionLeftClass: "wijmo-wijaccordion-left",
            accordionRightClass: "wijmo-wijaccordion-right",
            headerClass: "wijmo-wijaccordion-header",
            contentClass: "wijmo-wijaccordion-content",
            contentActiveClass: "wijmo-wijaccordion-content-active",
            iconsClass: "wijmo-wijaccordion-icons",
            horizontalClass: "ui-helper-horizontal"
        };

        /** @widget */
        var wijaccordion = (function (_super) {
            __extends(wijaccordion, _super);
            function wijaccordion() {
                _super.apply(this, arguments);
            }
            wijaccordion.prototype._setOption = function (key, value) {
                var o = this.options;
                if (o[key] !== value) {
                    switch (key) {
                        case "selectedIndex":
                            this.activate(value);
                            break;
                        case "event":
                            this._unbindLiveEvents();
                            this.options.event = value;
                            this._bindLiveEvents();
                            break;
                        case "header":
                            this._handleHeaderChange(value, o.header);
                            break;
                        case "animated":
                            break;
                        case "expandDirection":
                            this._onDirectionChange(value, true, o.expandDirection);
                            break;
                        default:
                            break;
                    }
                }
                _super.prototype._setOption.call(this, key, value);
            };

            wijaccordion.prototype._handleHeaderChange = function (newHeaderSelector, prevHeaderSelector) {
                var wijCSS = this.options.wijCSS, prevHeaders = this.element.find(prevHeaderSelector), prevHeadersClass = [wijCSS.wijaccordionHeader, commonClass.headerClass, wijCSS.stateActive, this._triangleIconOpened].join(" "), prevHeadersContentClass = [wijCSS.wijaccordionContent, commonClass.contentClass, wijCSS.content, wijCSS.wijaccordionContentActive, commonClass.contentActiveClass].join(" ");

                prevHeaders.removeClass(prevHeadersClass);
                prevHeaders.siblings("." + commonClass.contentClass).removeClass(prevHeadersContentClass);

                this._initHeaders(newHeaderSelector);
            };

            wijaccordion.prototype._initHeaders = function (selector) {
                var o = this.options, headersSelector = selector ? selector : o.header, headers = this.element.find(headersSelector);

                headers.each(jQuery.proxy(this._initHeader, this));
            };

            wijaccordion.prototype._initHeader = function (index, elem) {
                var o = this.options, wijCSS = o.wijCSS, rightToLeft = this.element.data(this.wijRightToLeft), header = $(elem), content = $(header.next()[0]), headerClass = [commonClass.headerClass, wijCSS.wijaccordionHeader].join(" "), selectedHeaderClass = [wijCSS.stateDefault, wijCSS.stateActive, this._headerCornerOpened].join(" "), selectedContentClass = [commonClass.contentActiveClass, wijCSS.wijaccordionContentActive, this._contentCornerOpened].join(" "), unselectedHeaderClass = [wijCSS.stateDefault, wijCSS.cornerAll].join(" "), contentClass = [commonClass.contentClass, wijCSS.wijaccordionContent, wijCSS.content].join(" "), origStyle;

                if (rightToLeft) {
                    header.remove();
                    header.insertAfter(content);
                }
                header.addClass(headerClass).attr("role", "tab");
                content.attr("role", "tabpanel");

                // During the animation, styles of the content will be changed.
                // Store the value for each content, it can be used for recover content style when destroy wijaccordion.
                origStyle = content.attr("style");
                if (origStyle) {
                    content.data("origStyle", content.attr("style"));
                }

                if (header.find("> a").length === 0) {
                    header.wrapInner('<a href="#"></a>');
                }

                if (header.find("> ." + wijmo.getCSSSelector(wijCSS.icon)).length === 0) {
                    $('<span></span>').addClass(wijCSS.icon).insertBefore($("> a", header)[0]);
                }
                if (index === o.selectedIndex) {
                    header.addClass(selectedHeaderClass).attr({
                        "aria-expanded": "true",
                        tabIndex: 0
                    });
                    header.find("> ." + wijmo.getCSSSelector(wijCSS.icon)).addClass(this._triangleIconOpened);
                    content.addClass(selectedContentClass).wijTriggerVisibility();
                } else {
                    header.addClass(unselectedHeaderClass).attr({
                        "aria-expanded": "false",
                        tabIndex: -1
                    });
                    header.find("> .ui-icon").addClass(this._triangleIconClosed);
                    content.hide();
                }
                content.addClass(contentClass);

                while (true) {
                    if (header.parent().hasClass(commonClass.accordionClass)) {
                        break;
                    }
                    header.unwrap();
                }
            };

            wijaccordion.prototype._layout = function () {
                var self = this, o = self.options, accordionClass = [commonClass.accordionClass, o.wijCSS.wijaccordion, o.wijCSS.widget, commonClass.iconsClass, o.wijCSS.wijaccordionIcons, o.wijCSS.helperClearFix].join(" ");
                self.element.addClass(accordionClass);

                if (self._isDisabled()) {
                    self.element.addClass(o.wijCSS.stateDisabled);
                }
                self._onDirectionChange(o.expandDirection, false);
                self._initHeaders();
                self.element.attr("role", "tablist");

                //super._create(this, arguments);
                $(window).on("resize." + self.widgetEventPrefix, function (e) {
                    self._adjustAccordion();
                });
                if (o.expandDirection === 'left' || o.expandDirection === 'right') {
                    self._adjustAccordion();
                }
                self._getDefaultLayoutSetting(o.expandDirection);
            };

            wijaccordion.prototype._initState = function () {
                this.wijRightToLeft = "rightToLeft";
            };

            wijaccordion.prototype._create = function () {
                // enable touch support:
                if (window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                this._initState();
                this._layout();
                _super.prototype._create.call(this);
            };

            wijaccordion.prototype._init = function () {
                this._bindLiveEvents();
            };

            wijaccordion.prototype._adjustAccordion = function () {
                var o = this.options, headers, contentEle, fWidth, paddingAndBorderWidth, headerWidth, adjustContentWidth;

                if (o.expandDirection === 'top' || o.expandDirection === 'bottom') {
                    return;
                }
                headers = this._getHeaders();
                contentEle = $('.' + commonClass.contentClass, this.element);
                fWidth = contentEle.parent().width();
                paddingAndBorderWidth = parseInt(contentEle.css("paddingLeft"), 10) + parseInt(contentEle.css("paddingRight"), 10) + parseInt(contentEle.css("borderRightWidth"), 10) + parseInt(contentEle.css("borderLeftWidth"), 10), headerWidth = $('.' + commonClass.headerClass, this.element).outerWidth(true);
                adjustContentWidth = fWidth - headers.length * (headerWidth + 4) - paddingAndBorderWidth;

                // default width is 36em: 576px == 36em
                adjustContentWidth = adjustContentWidth < 576 ? adjustContentWidth : 576;

                contentEle.width(adjustContentWidth);
            };

            wijaccordion.prototype._getDefaultLayoutSetting = function (expandDirection) {
                var contentEle = $('.' + commonClass.contentClass, this.element);

                if (expandDirection === 'top' || expandDirection === 'bottom') {
                    this._defaultLayoutSetting = {
                        paddingTop: contentEle.css("paddingTop"),
                        paddingBottom: contentEle.css("paddingBottom")
                    };
                } else {
                    this._defaultLayoutSetting = {
                        paddingLeft: contentEle.css("paddingLeft"),
                        paddingRight: contentEle.css("paddingRight"),
                        width: contentEle.width()
                    };
                }
            };

            /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            wijaccordion.prototype.destroy = function () {
                var o = this.options, rightToLeft = this.element.data("rightToLeft"), elementCSS, headerCSS, contentCSS, headers, header, content, originalHeaderHTML, originalContentStyle = "";

                elementCSS = [o.wijCSS.wijaccordion, commonClass.accordionClass, o.wijCSS.widget, o.wijCSS.wijaccordionIcons, o.wijCSS.helperClearFix, commonClass.horizontalClass, this._alignmentClass, commonClass.iconsClass, o.wijCSS.stateDisabled].join(" ");

                headerCSS = [commonClass.headerClass, o.wijCSS.wijaccordionHeader, o.wijCSS.stateDefault, o.wijCSS.stateActive, o.wijCSS.cornerAll, this._headerCornerOpened].join(" ");

                contentCSS = [commonClass.contentActiveClass, o.wijCSS.wijaccordionContentActive, this._contentCornerOpened, commonClass.contentClass, o.wijCSS.wijaccordionContent, o.wijCSS.content].join(" ");

                this._unbindLiveEvents();

                headers = this._getHeaders();

                $.each(headers, function (index, ele) {
                    header = $(ele);
                    if (rightToLeft) {
                        content = header.prev();
                        content.insertAfter(header);
                    } else {
                        content = header.next();
                    }

                    header.removeClass(headerCSS).removeAttr("aria-expanded").removeAttr("tabIndex").removeAttr("role");
                    if (header.attr("class") === "") {
                        header.removeAttr("class");
                    }

                    originalHeaderHTML = header.find("> a").html();
                    header.html(originalHeaderHTML);

                    content.show();

                    originalContentStyle = content.data("origStyle");
                    if (originalContentStyle) {
                        content.attr("style", originalContentStyle);
                    } else {
                        content.removeAttr("style");
                    }
                    content.removeClass(contentCSS).removeAttr("role");
                    if (content.attr("class") === "") {
                        content.removeAttr("class");
                    }
                });

                this.element.removeClass(elementCSS).removeAttr("role");
                if (this.element.attr("class") === "") {
                    this.element.removeAttr("class");
                }

                $(window).off("resize.wijaccordion");

                _super.prototype.destroy.call(this);
            };

            wijaccordion.prototype._getHeaders = function () {
                var o = this.options, rightToLeft = this.element.data(this.wijRightToLeft), headersArr = [], i, hdr, headers = this.element.find(o.header);

                if (headers.length > 0 && !$(headers[0]).hasClass(commonClass.headerClass) && $(headers[0]).hasClass(commonClass.contentClass)) {
                    for (i = 0; i < headers.length; i += 1) {
                        // fix for 29695:
                        hdr = rightToLeft ? $(headers[i]).next("." + commonClass.headerClass) : $(headers[i]).prev("." + commonClass.headerClass);
                        if (hdr.length > 0) {
                            headersArr.push(hdr[0]);
                        }
                    }
                } else {
                    return headers;
                }
                return $(headersArr);
            };

            wijaccordion.prototype.activate = function (index) {
                var o = this.options, headers = this._getHeaders(), nextHeader, prevHeader = $(jQuery.grep(headers.get(), function (a) {
                    return $(a).hasAllClasses(o.wijCSS.stateActive);
                }));

                if (typeof index === "number") {
                    nextHeader = $(headers[index]);
                } else if (typeof index === "string") {
                    index = parseInt(index, 0);
                    nextHeader = $(headers[index]);
                } else {
                    nextHeader = $(index);
                    index = headers.index(index);
                }
                if (nextHeader.hasAllClasses(o.wijCSS.stateDisabled)) {
                    return false;
                }
                if (nextHeader.hasAllClasses(o.wijCSS.stateActive)) {
                    if (o.requireOpenedPane) {
                        // fix for
                        // [17869] Unable to select the desire panel
                        // after all the panels are open in certain scenarios
                        if (prevHeader.length === nextHeader.length && prevHeader.index() === nextHeader.index()) {
                            return false;
                        }
                    } else {
                        prevHeader = nextHeader;
                        nextHeader = $(null);
                    }
                } else if (!o.requireOpenedPane) {
                    prevHeader = $(null);
                }
                if (prevHeader.length === 0 && nextHeader.length === 0) {
                    return false;
                }

                return this._activateLayout(prevHeader, nextHeader);
            };
            wijaccordion.prototype._activateLayout = function (prevHeader, nextHeader) {
                var o = this.options, rightToLeft = this.element.data(this.wijRightToLeft), nextContent, prevContent, activeHeaderClass = [o.wijCSS.stateActive, this._headerCornerOpened].join(" "), headerClass = [o.wijCSS.stateDefault, o.wijCSS.cornerAll].join(" ");

                nextContent = rightToLeft ? nextHeader.prev("." + commonClass.contentClass) : nextHeader.next("." + commonClass.contentClass);
                prevContent = rightToLeft ? prevHeader.prev("." + commonClass.contentClass) : prevHeader.next("." + commonClass.contentClass);
                prevHeader.removeClass(activeHeaderClass).addClass(headerClass).attr({
                    "aria-expanded": "false",
                    tabIndex: -1
                }).find("> .ui-icon").removeClass(this._triangleIconOpened).addClass(this._triangleIconClosed);
                nextHeader.removeClass("ui-corner-all").addClass(activeHeaderClass).attr({
                    "aria-expanded": "true",
                    tabIndex: 0
                }).find("> .ui-icon").removeClass(this._triangleIconClosed).addClass(this._triangleIconOpened);

                return this._activateAnimate(nextContent, prevContent, prevHeader, nextHeader);
            };
            wijaccordion.prototype._activateAnimate = function (nextContent, prevContent, prevHeader, nextHeader) {
                var o = this.options, animOptions, headers = this._getHeaders(), animations = $.wijmo.wijaccordion.animations, activeContentClass = [o.wijCSS.wijaccordionContentActive, commonClass.contentActiveClass].join(" "), nextActiveContentClass = activeContentClass + " " + this._contentCornerOpened, adjustWidth, newIndex, prevIndex, proxied, proxiedDuration, duration, effect;

                newIndex = headers.index(nextHeader);
                prevIndex = headers.index(prevHeader);
                if (o.expandDirection === 'left' || o.expandDirection === 'right') {
                    adjustWidth = this._defaultLayoutSetting.width;
                } else {
                    adjustWidth = parseInt(nextContent.css("width"));
                }
                if (!this._trigger("beforeSelectedIndexChanged", null, { newIndex: newIndex, prevIndex: prevIndex })) {
                    return false;
                }
                if (o.animated) {
                    animOptions = {
                        toShow: nextContent,
                        toHide: prevContent,
                        complete: jQuery.proxy(function () {
                            prevContent.removeClass(activeContentClass);
                            nextContent.addClass(activeContentClass).wijTriggerVisibility();

                            prevContent.css('display', '');
                            nextContent.css('display', '');

                            //prevContent.wijTriggerVisibility();
                            //nextContent.wijTriggerVisibility();
                            this._adjustContentSize(nextContent, adjustWidth);
                            this._trigger("selectedIndexChanged", null, { newIndex: newIndex, prevIndex: prevIndex });
                        }, this),
                        horizontal: this.element.hasClass(commonClass.horizontalClass),
                        rightToLeft: this.element.data(this.wijRightToLeft),
                        down: (newIndex > prevIndex),
                        autoHeight: o.autoHeight || o.fillSpace,
                        defaultLayoutSetting: this._defaultLayoutSetting
                    };
                    proxied = o.animated;
                    proxiedDuration = o.duration;
                    if ($.isFunction(proxied)) {
                        o.animated = proxied(animOptions);
                    }
                    if ($.isFunction(proxiedDuration)) {
                        o.duration = proxiedDuration(animOptions);
                    }

                    duration = o.duration;
                    effect = o.animated;

                    if (effect && !animations[effect] && !$.easing[effect]) {
                        effect = 'slide';
                    }

                    if (!animations[effect]) {
                        animations[effect] = function (options) {
                            this.slide(options, {
                                easing: effect,
                                duration: duration || 700
                            });
                        };
                    }
                    animations[effect](animOptions);
                } else {
                    if (prevHeader.length > 0) {
                        prevContent.hide().removeClass(activeContentClass);
                    }
                    if (nextHeader.length > 0) {
                        nextContent.show().addClass(nextActiveContentClass).wijTriggerVisibility();
                    }

                    //prevContent.wijTriggerVisibility();
                    //nextContent.wijTriggerVisibility();
                    this._adjustContentSize(nextContent, adjustWidth);
                    this._trigger("selectedIndexChanged", null, { newIndex: newIndex, prevIndex: prevIndex });
                }
                this.options.selectedIndex = newIndex;
                return true;
            };

            wijaccordion.prototype._adjustContentSize = function (content, adjustWidth) {
                var o = this.options;
                if (o.expandDirection === "left" || o.expandDirection === "right") {
                    content.css("height", "");
                    if (adjustWidth) {
                        content.width(adjustWidth);
                    }
                } else {
                    content.css("width", "");
                }
            };

            /** Private methods */
            wijaccordion.prototype._bindLiveEvents = function () {
                var self = this, o = this.options, headerSelector = "." + commonClass.headerClass, eventPrefix = self.widgetEventPrefix;

                this.element.on(o.event + "." + eventPrefix, headerSelector, jQuery.proxy(this._onHeaderClick, this)).on("keydown." + eventPrefix, headerSelector, jQuery.proxy(this._onHeaderKeyDown, this)).on("mouseenter." + eventPrefix, headerSelector, function () {
                    $(this).addClass(o.wijCSS.stateHover);
                }).on("mouseleave." + eventPrefix, headerSelector, function () {
                    $(this).removeClass(o.wijCSS.stateHover);
                }).on("focus." + eventPrefix, headerSelector, function () {
                    $(this).addClass(o.wijCSS.stateFocus);
                }).on("blur." + eventPrefix, headerSelector, function () {
                    $(this).removeClass(o.wijCSS.stateFocus);
                });
            };

            wijaccordion.prototype._unbindLiveEvents = function () {
                this.element.off("." + this.widgetEventPrefix, "." + commonClass.headerClass);
            };

            wijaccordion.prototype._onHeaderClick = function (e) {
                if (!this._isDisabled()) {
                    this.activate(e.currentTarget);
                }
                return false;
            };

            wijaccordion.prototype._onHeaderKeyDown = function (e) {
                if (this._isDisabled() || e.altKey || e.ctrlKey) {
                    return false;
                }
                if (!$.ui) {
                    return false;
                }
                var keyCode, focusedHeader = this.element.find("." + commonClass.headerClass + "." + this.options.wijCSS.stateFocus), focusedInd, headers;
                if (focusedHeader.length < 0) {
                    return false;
                }
                keyCode = wijmo.getKeyCodeEnum();
                headers = this._getHeaders();
                focusedInd = $("." + commonClass.headerClass, this.element).index(focusedHeader);
                switch (e.keyCode) {
                    case keyCode.RIGHT:
                    case keyCode.DOWN:
                        if (headers[focusedInd + 1]) {
                            headers[focusedInd + 1].focus();
                            return false;
                        }
                        break;
                    case keyCode.LEFT:
                    case keyCode.UP:
                        if (headers[focusedInd - 1]) {
                            headers[focusedInd - 1].focus();
                            return false;
                        }
                        break;
                    case keyCode.SPACE:
                    case keyCode.ENTER:
                        this.activate(e.currentTarget);
                        e.preventDefault();
                        break;
                }
                return true;
            };

            wijaccordion.prototype._onDirectionChange = function (newDirection, allowDOMChange, prevDirection) {
                if (typeof prevDirection === "undefined") { prevDirection = null; }
                var rightToLeft, openedHeaders, openedContents, openedTriangles, closedTriangles, prevIsRightToLeft, o = this.options;

                if (allowDOMChange) {
                    openedHeaders = this.element.find("." + commonClass.headerClass + "." + this._headerCornerOpened);
                    openedHeaders.removeClass(this._headerCornerOpened);
                    openedContents = this.element.find("." + commonClass.contentClass + "." + this._contentCornerOpened);
                    openedContents.removeClass(this._contentCornerOpened);
                    openedTriangles = this.element.find("." + this._triangleIconOpened);
                    closedTriangles = this.element.find("." + this._triangleIconClosed);
                    openedTriangles.removeClass(this._triangleIconOpened);
                    closedTriangles.removeClass(this._triangleIconClosed);
                }
                if (prevDirection !== null) {
                    this.element.removeClass(commonClass.accordionClass + "-" + prevDirection);
                }
                switch (newDirection) {
                    case "top":
                        this._headerCornerOpened = o.wijCSS.cornerBottom;
                        this._contentCornerOpened = o.wijCSS.cornerTop;
                        this._triangleIconOpened = o.wijCSS.iconArrowUp;
                        this._triangleIconClosed = o.wijCSS.iconArrowRight;
                        rightToLeft = true;
                        this.element.removeClass(commonClass.horizontalClass);
                        this._alignmentClass = [commonClass.accordionTopClass, o.wijCSS.wijaccordionTop].join(" ");
                        break;
                    case "right":
                        this._headerCornerOpened = o.wijCSS.cornerLeft;
                        this._contentCornerOpened = o.wijCSS.cornerRight;
                        this._triangleIconOpened = o.wijCSS.iconArrowRight;
                        this._triangleIconClosed = o.wijCSS.iconArrowDown;
                        rightToLeft = false;
                        this.element.addClass(commonClass.horizontalClass);
                        this._alignmentClass = [commonClass.accordionRightClass, o.wijCSS.wijaccordionRight].join(" ");
                        break;
                    case "left":
                        this._headerCornerOpened = o.wijCSS.cornerRight;
                        this._contentCornerOpened = o.wijCSS.cornerLeft;
                        this._triangleIconOpened = o.wijCSS.iconArrowLeft;
                        this._triangleIconClosed = o.wijCSS.iconArrowDown;
                        rightToLeft = true;
                        this.element.addClass(commonClass.horizontalClass);
                        this._alignmentClass = [commonClass.accordionLeftClass, o.wijCSS.wijaccordionLeft].join(" ");
                        break;
                    default:
                        this._headerCornerOpened = o.wijCSS.cornerTop;
                        this._contentCornerOpened = o.wijCSS.cornerBottom;
                        this._triangleIconOpened = o.wijCSS.iconArrowDown;
                        this._triangleIconClosed = o.wijCSS.iconArrowRight;
                        rightToLeft = false;
                        this.element.removeClass(commonClass.horizontalClass);
                        this._alignmentClass = [commonClass.accordionBottomClass, o.wijCSS.wijaccordionBottom].join(" ");
                        break;
                }
                this.element.addClass(this._alignmentClass);

                prevIsRightToLeft = this.element.data(this.wijRightToLeft);
                this.element.data(this.wijRightToLeft, rightToLeft);

                if (allowDOMChange) {
                    openedTriangles.addClass(this._triangleIconOpened);
                    closedTriangles.addClass(this._triangleIconClosed);
                    openedHeaders.addClass(this._headerCornerOpened);
                    openedContents.addClass(this._contentCornerOpened);
                }

                if (allowDOMChange && rightToLeft !== prevIsRightToLeft) {
                    this.element.children("." + commonClass.headerClass).each(function () {
                        var header = $(this), content;
                        if (rightToLeft) {
                            content = header.next("." + commonClass.contentClass);
                            header.remove();
                            header.insertAfter(content);
                        } else {
                            content = header.prev("." + commonClass.contentClass);
                            header.remove();
                            header.insertBefore(content);
                        }
                    });
                }
            };
            return wijaccordion;
        })(wijmo.wijmoWidget);
        accordion.wijaccordion = wijaccordion;
        ;

        var wijaccordion_options = (function () {
            function wijaccordion_options() {
                /**  @ignore */
                this.wijCSS = {
                    wijaccordion: "",
                    wijaccordionTop: "",
                    wijaccordionBottom: "",
                    wijaccordionLeft: "",
                    wijaccordionRight: "",
                    wijaccordionHeader: "",
                    wijaccordionContent: "",
                    wijaccordionContentActive: "",
                    wijaccordionIcons: ""
                };
                /**
                * All CSS classes used in widgets that use Mobile theme framework
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body ui-body-b"
                };
                /**
                * Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijaccordion')";
                /**
                * Sets the animation easing effect that users experience when they switch
                * between panes.
                * @remarks
                * Set this option to false in order to disable easing. This results in a plain, abrupt shift
                * from one pane to the next. You can also create custom easing animations using jQuery UI Easings
                * Options available for the animation function include:
                * down - If true, indicates that the index of the pane should be expanded higher than the index
                *	of the pane that must be collapsed.
                * horizontal - If true, indicates that the accordion have a horizontal
                *	orientation (when the expandDirection is left or right).
                * rightToLeft - If true, indicates that the content element is located
                *	before the header element (top and left expand direction).
                * toShow - jQuery object that contains the content element(s) should be shown.
                * toHide - jQuery object that contains the content element(s) should be hidden.
                * @example
                * //Create your own animation:
                * jQuery.wijmo.wijaccordion.animations.custom1 = function (options) {
                *     this.slide(options, {
                *     easing: options.down ? "easeOutBounce" : "swing",
                *     duration: options.down ? 1000 : 200
                *   });
                * }
                *  $("#accordion3").wijaccordion({
                *      expandDirection: "right",
                *      animated: "custom1"
                *  });
                * @type {string|function}
                */
                this.animated = 'slide';
                /**
                * The animation duration in milliseconds.
                * @remarks
                * @type {number|function}
                * By default, the animation duration value depends on an animation effect specified
                * by the animation option.
                */
                this.duration = null;
                /**
                * Determines the event that triggers the accordion to change panes.
                * @remarks
                * To select multiple events, separate them by a space. Supported events include:
                *	focus -- The pane opens when you click its header.
                *	click (default) -- The pane opens when you click its header.
                *	dblclick -- The pane opens when you double-click its header.
                *	mousedown -- The pane opens when you press the mouse button over its header.
                *	mouseup -- The pane opens when you release the mouse button over its header.
                *	mousemove -- The pane opens when you move the mouse pointer into its header.
                *	mouseover -- The pane opens when you hover the mouse pointer over its header.
                *	mouseout -- The pane opens when the mouse pointer leaves its header.
                *	mouseenter -- The pane opens when the mouse pointer enters its header.
                *	mouseleave -- The pane opens when the mouse pointer leaves its header.
                *	select -- The pane opens when you select its header by clicking and then pressing Enter
                *	submit -- The pane opens when you select its header by clicking and then pressing Enter.
                *	keydown -- The pane opens when you select its header by clicking and then pressing any key.
                *	keypress -- The pane opens when you select its header by clicking and then pressing any key.
                *	keyup -- The pane opens when you select its header by clicking and then pressing and releasing any key.
                */
                this.event = "click";
                /**
                * Determines the direction in which the content area of the control expands.
                * @remarks
                * Available values include: top, right, bottom, and left.
                */
                this.expandDirection = "bottom";
                /**
                * Determines the selector for the header element.
                * @remarks
                * Set this option to put header and content elements inside the HTML tags of your choice.
                * By default, the header is the first child after an <LI> element, and the content is
                * the second child html markup.
                */
                this.header = "> li > :first-child,> :not(li):even";
                /**
                * Determines whether clicking a header closes the current pane before opening the new one.
                * @remarks
                * Setting this value to false causes the headers to act as toggles for opening and
                * closing the panes, leaving all previously clicked panes open until you click them again.
                */
                this.requireOpenedPane = true;
                /**
                * Gets or sets the zero-based index of the accordion pane to show expanded initially.
                * @remarks
                * By default, the first pane is expanded. A setting of -1 specifies that no pane
                * is expanded initially, if you also set the requireOpenedPane option to false.
                */
                this.selectedIndex = 0;
                /**
                * Occurs before an active accordion pane change.
                * @remarks
                * Return false or call event.preventDefault() in order to cancel event and
                * prevent the selectedIndex change.
                * @event
                * @dataKey {Number} newIndex Index of a pane that will be expanded.
                * @dataKey {Number} prevIndex Index of a pane that will be collapsed.
                */
                this.beforeSelectedIndexChanged = null;
                /**
                * Occurs when an active accordion pane changed.
                * @event
                * @dataKey {Number} newIndex Index of the activated pane.
                * @dataKey {Number} prevIndex Index of the collapsed pane.
                */
                this.selectedIndexChanged = null;
            }
            return wijaccordion_options;
        })();

        wijaccordion.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijaccordion_options());

        $.wijmo.registerWidget(widgetName, wijaccordion.prototype);

        var animations = (function () {
            function animations() {
            }
            animations.prototype._parseWidth = function (width) {
                var parts = ('' + width).match(/^([\d+-.]+)(.*)$/);
                return {
                    value: parts ? +parts[1] : 0,
                    unit: parts ? (parts[2] || "px") : "px"
                };
            };

            animations.prototype.slide = function (options, additions) {
                var simpleShowOpts, simpleHideOpts, animations = $.wijmo.wijaccordion.animations, overflow = options.toShow.css('overflow'), percentDone = 0, showProps = {}, hideProps = {}, toShowCssProps, fxAttrs = options.horizontal ? ["width", "paddingLeft", "paddingRight"] : ["height", "paddingTop", "paddingBottom"], originalWidth, s = options.toShow;

                options = $.extend({
                    easing: "swing",
                    duration: 300
                }, options, additions);
                if (options.horizontal) {
                    simpleShowOpts = { width: "show" };
                    simpleHideOpts = { width: "hide" };
                } else {
                    simpleShowOpts = { height: "show" };
                    simpleHideOpts = { height: "hide" };
                }
                if (!options.toHide.length) {
                    options.toShow.stop(true, true).animate(simpleShowOpts, options);
                    return;
                }
                if (!options.toShow.length) {
                    options.toHide.stop(true, true).animate(simpleHideOpts, options);
                    return;
                }

                // fix width/height before calculating height/width of hidden element
                if (options.horizontal) {
                    originalWidth = s[0].style.height;
                    s.height(parseInt(s.parent().height().toString(), 10) - parseInt(s.css("paddingTop"), 10) - parseInt(s.css("paddingBottom"), 10) - (parseInt(s.css("borderTopWidth"), 10) || 0) - (parseInt(s.css("borderBottomWidth"), 10) || 0));
                } else {
                    originalWidth = s[0].style.width;
                    s.width(parseInt(s.parent().width().toString(), 10) - parseInt(s.css("paddingLeft"), 10) - parseInt(s.css("paddingRight"), 10) - (parseInt(s.css("borderLeftWidth"), 10) || 0) - (parseInt(s.css("borderRightWidth"), 10) || 0));
                }

                $.each(fxAttrs, function (i, prop) {
                    hideProps[prop] = "hide";

                    if (!options.horizontal && prop === "height") {
                        showProps[prop] = animations._parseWidth(options.toShow.css(prop));
                    } else {
                        showProps[prop] = animations._parseWidth(options.defaultLayoutSetting[prop]);
                    }
                });
                if (options.horizontal) {
                    toShowCssProps = { width: 0, overflow: "hidden" };
                } else {
                    toShowCssProps = { height: 0, overflow: "hidden" };
                }
                options.toShow.css(toShowCssProps).stop(true, true).show();
                options.toHide.filter(":hidden").each(options.complete).end().filter(":visible").stop(true, true).animate(hideProps, {
                    step: function (now, settings) {
                        var val;
                        if ($.inArray(settings.prop, fxAttrs)) {
                            percentDone = (settings.end - settings.start === 0) ? 0 : (settings.now - settings.start) / (settings.end - settings.start);
                        }

                        val = (percentDone * showProps[settings.prop].value);
                        if (val < 0) {
                            //fix for 16943:
                            val = 0;
                        }
                        options.toShow[0].style[settings.prop] = val + showProps[settings.prop].unit;
                    },
                    duration: options.duration,
                    easing: options.easing,
                    complete: function () {
                        if (!options.autoHeight) {
                            options.toShow.css(options.horizontal ? "width" : "height", "");
                        }
                        options.toShow.css(options.horizontal ? "height" : "width", originalWidth);
                        $.each(["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], function (i, key) {
                            options.toShow.css(key, "");
                        });
                        options.toShow.css({ overflow: overflow });
                        options.complete();
                    }
                });
            };

            animations.prototype.bounceslide = function (options) {
                this.slide(options, {
                    easing: options.down ? "easeOutBounce" : "swing",
                    duration: options.down ? 1000 : 200
                });
            };
            return animations;
        })();

        $.extend($.wijmo.wijaccordion, {
            animations: animations.prototype
        });
    })(wijmo.accordion || (wijmo.accordion = {}));
    var accordion = wijmo.accordion;
})(wijmo || (wijmo = {}));

