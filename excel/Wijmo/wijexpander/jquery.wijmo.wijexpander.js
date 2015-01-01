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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals jQuery,$*/
    /*jslint white: false */
    /*
    * Depends:
    *  jquery.ui.core.js
    *  jquery.ui.widget.js
    *  jquery.wijmo.wijutil.js
    *  jquery.wijmo.wijexpander.js
    *  Non-default animations requires UI Effects Core
    *
    */
    (function (expander) {
        "use strict";
        var $ = jQuery, widgetName = "wijexpander", contentClass = "ui-expander-content";

        /** @widget */
        var wijexpander = (function (_super) {
            __extends(wijexpander, _super);
            function wijexpander() {
                _super.apply(this, arguments);
            }
            // handle option changes:
            wijexpander.prototype._setOption = function (key, value) {
                var content = this.element.find("> ." + contentClass);
                switch (key) {
                    case "contentUrl":
                        if (value) {
                            content.wijContent(value);
                        } else {
                            content.html(this.storeContentHTML);
                        }
                        break;
                    case "expandDirection":
                        this._onDirectionChange(value, true, this.options.expandDirection);
                        break;
                    case "expanded":
                        if (value) {
                            this.expand();
                        } else {
                            this.collapse();
                        }

                        // option value already stored inside expand/collapse method
                        // if action is not cancelled, so we need return here.
                        return;
                    default:
                        break;
                }
                $.wijmo.widget.prototype._setOption.apply(this, arguments);
            };

            wijexpander.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._toggleDisableExpander(true);
            };

            wijexpander.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._toggleDisableExpander(false);
            };

            wijexpander.prototype._toggleDisableExpander = function (disabled) {
                var content = this.element.find("> ." + contentClass);
                this.element.toggleClass(this.options.wijCSS.stateDisabled, disabled).find("> .ui-expander-header").toggleClass(this.options.wijCSS.stateDisabled, disabled);
                content.toggleClass(this.options.wijCSS.stateDisabled, disabled);
            };

            wijexpander.prototype._create = function () {
                var o = this.options, elems = this.element.children(), header, content, wijCSS = o.wijCSS;

                // enable touch support:
                if (window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }

                // do not call base c1headercontentcontrol _create method here since we don't
                // want to place c1headercontentcontrol classes on the widget element
                this.element.addClass("wijmo-wijexpander ui-expander " + o.wijCSS.widget + " ui-expander-icons");
                this.header = header = $(elems[0]);
                this.content = content = $(elems[1]);
                if (o.expandDirection === "left" || o.expandDirection === "top") {
                    header.remove();
                    header.insertAfter(content);
                }
                header.addClass("ui-expander-header");

                // ARIA
                header.attr("role", "tab");
                content.attr("role", "tabpanel");

                if (header.find("> a").length === 0) {
                    // fix for 32089:
                    header.wrapInner('<a href="javascript:void(null)"></a>');
                    this.headerLink = header.children();
                    //header.wrapInner('<a href="#"></a>');
                }
                if (header.find("> ." + wijmo.getCSSSelector(wijCSS.icon)).length === 0) {
                    this.headerIcon = $('<span></span>').addClass(wijCSS.icon).insertBefore($("> a", header)[0]);
                }
                content.addClass(contentClass + " " + wijCSS.content);

                this.storeContentHTML = content.html();
                _super.prototype._create.call(this);
            };

            // widget initialization:
            wijexpander.prototype._init = function () {
                var o = this.options, content = this.element.find("> ." + contentClass);
                this._onDirectionChange(o.expandDirection, false);
                if (o.contentUrl) {
                    content.wijContent(this.options.contentUrl);
                }
                if (!o.expanded) {
                    content.hide();
                    this.element.find("> .ui-expander-header").addClass(o.wijCSS.stateDefault + " " + o.wijCSS.cornerAll).attr({
                        "aria-expanded": "false",
                        tabIndex: -1
                    }).find("> ." + wijmo.getCSSSelector(o.wijCSS.icon)).addClass(this._triangleIconClosed);
                } else {
                    this.element.find("> .ui-expander-header").addClass(o.wijCSS.stateDefault + " " + o.wijCSS.stateActive).attr({
                        "aria-expanded": "true",
                        tabIndex: 0
                    }).addClass(this._headerCornerOpened).find("> ." + wijmo.getCSSSelector(o.wijCSS.icon)).addClass(this._triangleIconOpened);
                    content.addClass("ui-expander-content-active").addClass(this._contentCornerOpened).wijTriggerVisibility();
                }
                if (this._isDisabled()) {
                    this.element.addClass(o.wijCSS.stateDisabled).find("> .ui-expander-header").addClass(o.wijCSS.stateDisabled);
                    content.addClass(o.wijCSS.stateDisabled);
                }
                this._bindLiveEvents();
            };

            /**
            * Removes the wijexpander functionality completely. This returns the element to its pre-init state.
            */
            wijexpander.prototype.destroy = function () {
                var o = this.options, elementCss = "wijmo-wijexpander ui-expander " + o.wijCSS.widget + " " + "ui-helper-reset ui-expander-icons " + "ui-expander-" + o.expandDirection + " " + o.wijCSS.stateFocus + " " + o.wijCSS.stateHover + " " + o.wijCSS.stateDisabled, headerCSS = "ui-expander-header " + o.wijCSS.stateDefault + " " + o.wijCSS.cornerAll + " " + o.wijCSS.stateActive + " " + this._headerCornerOpened, contentCSS = contentClass + " " + o.wijCSS.content + " " + "ui-expander-content-active " + o.wijCSS.stateDisabled + " " + this._contentCornerOpened;
                this._unbindLiveEvents();
                this.element.removeClass(elementCss);

                if (this.headerIcon) {
                    this.headerIcon.remove();
                    this.headerIcon = null;
                }

                if (this.headerLink) {
                    this.header.html(this.headerLink.html());
                    this.headerLink.remove();
                    this.headerLink = null;
                }

                this.header.removeClass(headerCSS);
                this.header.removeAttr("role").removeAttr("aria-expanded").removeAttr("tabIndex");

                this.content.removeClass(contentCSS);
                this.content.removeAttr("role");

                if (o.contentUrl) {
                    this.content.html(this.storeContentHTML);
                }

                this.header.insertBefore(this.content);

                $.wijmo.widget.prototype.destroy.apply(this, arguments);
            };

            wijexpander.prototype._bindLiveEvents = function () {
                var o = this.options, touchEventPre = "";

                this.element.off(".wijexpander");

                //"on" was introduced to JQuery in v1.7, Nov 2011. It is not yet in JQuery Mobile!.
                if ($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    touchEventPre = "wij";
                }

                this.element.on(touchEventPre + "click.wijexpander", ">.ui-expander-header", jQuery.proxy(this._onHeaderClick, this));
                this.element.on(touchEventPre + "mouseenter.wijexpander", ".ui-expander-header", function () {
                    $(this).addClass(o.wijCSS.stateHover);
                });
                this.element.on(touchEventPre + "mouseleave.wijexpander", ".ui-expander-header", function () {
                    $(this).removeClass(o.wijCSS.stateHover);
                });
                this.element.on(touchEventPre + "focus.wijexpander", ".ui-expander-header", function () {
                    $(this).addClass(o.wijCSS.stateFocus);
                });
                this.element.on(touchEventPre + "blur.wijexpander", ".ui-expander-header", function () {
                    $(this).removeClass(o.wijCSS.stateFocus);
                });
            };
            wijexpander.prototype._unbindLiveEvents = function () {
                this.element.off(".wijexpander", ".ui-expander-header");
            };

            wijexpander.prototype._onDirectionChange = function (newDirection, allowDOMChange, prevDirection) {
                if (typeof prevDirection === "undefined") { prevDirection = null; }
                var rightToLeft, openedHeaders, openedContents, openedTriangles, closedTriangles, prevIsRightToLeft, content, header, o = this.options;

                if (prevDirection && prevDirection !== newDirection) {
                    this.element.removeClass("ui-expander-" + prevDirection);
                }
                if (allowDOMChange) {
                    openedHeaders = this.element.find(".ui-expander-header." + this._headerCornerOpened);
                    openedHeaders.removeClass(this._headerCornerOpened);
                    openedContents = this.element.find("." + contentClass + "." + this._contentCornerOpened);
                    openedContents.removeClass(this._contentCornerOpened);
                    openedTriangles = this.element.find("." + this._triangleIconOpened);
                    closedTriangles = this.element.find("." + this._triangleIconClosed);
                    openedTriangles.removeClass(this._triangleIconOpened);
                    closedTriangles.removeClass(this._triangleIconClosed);
                }
                switch (newDirection) {
                    case "top":
                        this._headerCornerOpened = "ui-corner-bottom";
                        this._contentCornerOpened = "ui-corner-top";
                        this._triangleIconOpened = o.wijCSS.iconArrowUp;
                        this._triangleIconClosed = o.wijCSS.iconArrowRight;
                        rightToLeft = true;
                        this.element.removeClass("ui-helper-horizontal");
                        this.element.addClass("ui-expander-top");
                        break;
                    case "right":
                        this._headerCornerOpened = "ui-corner-left";
                        this._contentCornerOpened = "ui-corner-right";
                        this._triangleIconOpened = o.wijCSS.iconArrowRight;
                        this._triangleIconClosed = o.wijCSS.iconArrowDown;
                        rightToLeft = false;
                        this.element.addClass("ui-helper-horizontal");
                        this.element.addClass("ui-expander-right");
                        break;
                    case "left":
                        this._headerCornerOpened = "ui-corner-right";
                        this._contentCornerOpened = "ui-corner-left";
                        this._triangleIconOpened = o.wijCSS.iconArrowLeft;
                        this._triangleIconClosed = o.wijCSS.iconArrowDown;
                        rightToLeft = true;
                        this.element.addClass("ui-helper-horizontal");
                        this.element.addClass("ui-expander-left");
                        break;
                    default:
                        this._headerCornerOpened = "ui-corner-top";
                        this._contentCornerOpened = "ui-corner-bottom";
                        this._triangleIconOpened = o.wijCSS.iconArrowDown;
                        this._triangleIconClosed = o.wijCSS.iconArrowRight;
                        rightToLeft = false;
                        this.element.removeClass("ui-helper-horizontal");
                        this.element.addClass("ui-expander-bottom");
                        break;
                }
                prevIsRightToLeft = this.element.data("rightToLeft");
                this.element.data("rightToLeft", rightToLeft);

                if (allowDOMChange) {
                    openedTriangles.addClass(this._triangleIconOpened);
                    closedTriangles.addClass(this._triangleIconClosed);
                    openedHeaders.addClass(this._headerCornerOpened);
                    openedContents.addClass(this._contentCornerOpened);
                }

                if (allowDOMChange && rightToLeft !== prevIsRightToLeft) {
                    this.element.children(".ui-expander-header").each(function (index, element) {
                        header = $(this);
                        if (rightToLeft) {
                            content = header.next("." + contentClass);
                            header.remove();
                            header.insertAfter(content);
                        } else {
                            content = header.prev("." + contentClass);
                            header.remove();
                            header.insertBefore(content);
                        }
                    });
                }
            };

            // public methods
            /**
            * Collapses the content panel.
            */
            wijexpander.prototype.collapse = function () {
                var o = this.options, animOptions, animations, duration, easing, content = this.element.find("> ." + contentClass);
                if (!o.allowExpand) {
                    return;
                }
                if (this.element.hasAllClasses(o.wijCSS.stateDisabled)) {
                    return false;
                }

                if (!this._trigger("beforeCollapse")) {
                    return false;
                }

                /*
                newEv = jQuery.Event("beforecollapse");
                this.element.trigger(newEv);
                if (newEv.isDefaultPrevented()) {
                return false;
                }*/
                if (o.animated) {
                    animOptions = {
                        expand: false,
                        content: content,
                        complete: jQuery.proxy(function () {
                            content.removeClass("ui-expander-content-active");
                            this._trigger("afterCollapse");
                            content.css('display', '');
                        }, this),
                        horizontal: this.element.hasClass("ui-helper-horizontal")
                    };

                    animations = $.wijmo.wijexpander.animations;
                    duration = o.duration;
                    easing = o.animated;
                    if (easing && !animations[easing] && !$.easing[easing]) {
                        easing = 'slide';
                    }
                    if (!animations[easing]) {
                        animations[easing] = function (options) {
                            this.slide(options, {
                                easing: easing,
                                duration: duration || 700
                            });
                        };
                    }
                    animations[easing](animOptions);
                } else {
                    content.hide();
                    this._trigger("afterCollapse");
                }
                this.element.find("> .ui-expander-header").removeClass(o.wijCSS.stateActive).removeClass(this._headerCornerOpened).attr({
                    "aria-expanded": "false",
                    tabIndex: -1
                }).addClass(o.wijCSS.stateDefault + " " + o.wijCSS.cornerAll).find("> ." + wijmo.getCSSSelector(o.wijCSS.icon)).removeClass(this._triangleIconOpened).addClass(this._triangleIconClosed);
                this.options.expanded = false;
                return true;
            };

            /**
            * Expands the content panel.
            */
            wijexpander.prototype.expand = function () {
                var o = this.options, animOptions, animations, duration, easing, content = this.element.find("> ." + contentClass);
                if (!o.allowExpand) {
                    return;
                }

                if (this.element.hasAllClasses(o.wijCSS.stateDisabled)) {
                    return false;
                }
                if (!this._trigger("beforeExpand")) {
                    return false;
                }

                //this.element.addClass("ui-state-expanded");
                if (o.animated) {
                    //console.log("$.easing=" + $.easing + "," + $.effects[easing] + ",easing=" + easing);
                    animOptions = {
                        expand: true,
                        content: content,
                        complete: jQuery.proxy(function () {
                            content.addClass("ui-expander-content-active").addClass(this._contentCornerOpened).wijTriggerVisibility();
                            this._trigger("afterExpand");
                            content.css('display', '');
                        }, this),
                        horizontal: this.element.hasClass("ui-helper-horizontal")
                    };
                    animations = $.wijmo.wijexpander.animations;
                    duration = o.duration;
                    easing = o.animated;

                    if (easing && !animations[easing] && !$.easing[easing]) {
                        easing = 'slide';
                    }
                    if (!animations[easing]) {
                        animations[easing] = function (options) {
                            this.slide(options, {
                                easing: easing,
                                duration: duration || 700
                            });
                        };
                    }
                    animations[easing](animOptions);
                } else {
                    content.show();
                    this._trigger("afterExpand");
                }
                this.element.find("> .ui-expander-header").removeClass(o.wijCSS.cornerAll).addClass(o.wijCSS.stateActive).addClass(this._headerCornerOpened).attr({
                    "aria-expanded": "true",
                    tabIndex: 0
                }).find("> ." + wijmo.getCSSSelector(o.wijCSS.icon)).removeClass(this._triangleIconClosed).addClass(this._triangleIconOpened);
                this.options.expanded = true;
                return true;
            };

            /** Private methods */
            wijexpander.prototype._onHeaderClick = function (e) {
                this.option("expanded", !this.options.expanded);
                // commented in order to fix issue 32089:
                //return false;	// fix for 32089
            };
            return wijexpander;
        })(wijmo.wijmoWidget);
        expander.wijexpander = wijexpander;
        var wijexpander_options = (function () {
            function wijexpander_options() {
                /** wijMobileCSS.
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-content ui-body ui-body-b"
                };
                /** Selector option for auto self initialization.
                * This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijexpander')";
                /** Determines if the widget can be collapsed or expanded through user interaction.Set this option to false to disable collapsing and expanding in the widget.
                * @example $("#element").wijexpander({ allowExpand: false });
                */
                this.allowExpand = true;
                /** Determines the animation easing effect; set this option to false in order to disable animation.
                * Note that custom easing effects require the UI Effects Core. Additional options
                * that are available for the animation function include:
                * expand - value of true indicates that content element must be expanded.
                * horizontal - value of true indicates that expander is horizontally
                *	orientated (when expandDirection is left or right).
                * content - jQuery object that contains content element to be expanded or
                *				collapsed.
                * @example
                *        $("#expander2").wijexpander({
                *            animated: "custom1"
                *        });
                *        jQuery.wijmo.wijexpander.animations.custom1 = function (options) {
                *            this.slide(options, {
                *                easing: "easeInBounce",
                *                duration: 900
                *            });
                *        }
                */
                this.animated = 'slide';
                /** Determines the URL to the external content. For example,
                * http://componentone.com/ for the ComponentOne Web site.
                * @example
                *	$("#element").wijexpander({ contentUrl: "http://componentone.com/" });
                */
                this.contentUrl = "";
                /** Determines the visibility state of the content panel. If true, the
                * content element is visible.
                * @example $("#element").wijexpander({ expanded: false });
                */
                this.expanded = true;
                /** Determines the content expand direction. Available values are top, right, bottom, and left.
                * @example $("#element").wijexpander({ expandDirection: "right" });
                */
                this.expandDirection = "bottom";
                /** Occurs before the content area collapses.
                * Return false or call event.preventDefault() in order to cancel event and
                * prevent the content area from collapsing.
                * @event
                */
                this.beforeCollapse = null;
                /** Occurs before the content area expands.
                * Return false or call event.preventDefault() in order to cancel event and
                * prevent the content area from expanding.
                * @event
                */
                this.beforeExpand = null;
                /** Occurs after the content area collapses.
                * @event
                */
                this.afterCollapse = null;
                /** Occurs after the content area expands.
                * @event
                */
                this.afterExpand = null;
            }
            return wijexpander_options;
        })();

        wijexpander.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijexpander_options());

        $.wijmo.registerWidget(widgetName, wijexpander.prototype);

        $.extend($.wijmo.wijexpander, {
            animations: {
                slide: function (options, additions) {
                    var animOpts;
                    options = $.extend({
                        easing: "swing",
                        duration: 300
                    }, options, additions);
                    if (options.expand) {
                        if (options.horizontal) {
                            animOpts = { width: 'show', opacity: 'show' };
                        } else {
                            animOpts = { height: 'show', opacity: 'show' };
                        }
                        options.content.stop(true, true).animate(animOpts, options);
                    } else {
                        if (options.horizontal) {
                            animOpts = { width: 'hide', opacity: 'hide' };
                        } else {
                            animOpts = { height: 'hide', opacity: 'hide' };
                        }
                        options.content.stop(true, true).animate(animOpts, options);
                    }
                }
            }
        });
    })(wijmo.expander || (wijmo.expander = {}));
    var expander = wijmo.expander;
})(wijmo || (wijmo = {}));

