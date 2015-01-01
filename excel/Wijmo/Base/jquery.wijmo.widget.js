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
/// <reference path="../wijutil/jquery.wijmo.wijtouchutil.ts"/>
/// <reference path="../External/declarations/jquery.d.ts"/>
/// <reference path="../External/declarations/jquery.ui.d.ts"/>
/// <reference path="../External/declarations/jquerymobile.d.ts"/>
/// <reference path="wijmo.d.ts"/>
/*
* Depends:
*  jquery.ui.widget.js
*
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    var $ = jQuery;
    var jQueryWijmo = (function () {
        function jQueryWijmo() {
        }
        jQueryWijmo.registerWidget = function (name, baseType, def, customizeInit) {
            var fullName = "wijmo." + name, init;
            if (typeof def === 'function') {
                init = def;
                def = null;
            }
            if (def === null || def === undefined) {
                def = $.extend(true, {}, baseType);
                baseType = $.wijmo.widget;
            }
            def.options = def.options || {};
            def.options.initSelector = def.options.initSelector || ":jqmData(role='" + name + "')";
            def.initSelector = def.initSelector == null ? def.options.initSelector : def.initSelector + def.options.initSelector;

            if ($.mobile && def.options && def.options.wijMobileCSS) {
                def.options.wijCSS = def.options.wijCSS || {};
                $.extend(def.options.wijCSS, def.options.wijMobileCSS);
            }

            $.widget(fullName, baseType, def);

            if (init) {
                init.call();
            }
        };

        jQueryWijmo.addThemeToMobileCSS = function (theme, classes) {
            $.each(classes, function (key, cl) {
                if (typeof cl === "string") {
                    $.each(jQueryWijmo.wijMobileThemePrefix, function (idx, css) {
                        var regExp = new RegExp("\\b" + css);
                        if (regExp.test(cl)) {
                            classes[key] = cl + " " + css + "-" + theme;
                        }
                    });
                } else {
                    jQueryWijmo.addThemeToMobileCSS(theme, cl);
                }
            });
        };
        jQueryWijmo.autoMobilize = true;

        jQueryWijmo.wijCSS = {
            widget: "ui-widget",
            overlay: "ui-widget-overlay",
            content: "ui-widget-content",
            header: "ui-widget-header",
            stateDisabled: "ui-state-disabled",
            stateFocus: "ui-state-focus",
            stateActive: "ui-state-active",
            stateDefault: "ui-state-default",
            stateHighlight: "ui-state-highlight",
            stateHover: "ui-state-hover",
            stateChecked: "ui-state-checked",
            stateError: "ui-state-error",
            getState: function (name) {
                name = name.charAt(0).toUpperCase() + name.substr(1);
                return $.wijmo.wijCSS["state" + name];
            },
            icon: "ui-icon",
            iconCheck: "ui-icon-check",
            iconRadioOn: "ui-icon-radio-on",
            iconRadioOff: "ui-icon-radio-off",
            iconClose: "ui-icon-close",
            iconArrow4Diag: "ui-icon-arrow-4-diag",
            iconNewWin: "ui-icon-newwin",
            iconVGripSolid: "ui-icon-grip-solid-vertical",
            iconHGripSolid: "ui-icon-grip-solid-horizontal",
            iconPlay: "ui-icon-play",
            iconPause: "ui-icon-pause",
            iconStop: "ui-icon-stop",
            iconArrowUp: "ui-icon-triangle-1-n",
            iconArrowRight: "ui-icon-triangle-1-e",
            iconArrowDown: "ui-icon-triangle-1-s",
            iconArrowLeft: "ui-icon-triangle-1-w",
            iconArrowRightDown: "ui-icon-triangle-1-se",
            iconArrowThickDown: "ui-icon-arrowthick-1-s",
            iconArrowThickUp: "ui-icon-arrowthick-1-n",
            iconCaratUp: "ui-icon-carat-1-n",
            iconCaratRight: "ui-icon-carat-1-e",
            iconCaratDown: "ui-icon-carat-1-s",
            iconCaratLeft: "ui-icon-carat-1-w",
            iconClock: "ui-icon-clock",
            iconPencil: "ui-icon-pencil",
            iconSeekFirst: "ui-icon-seek-first",
            iconSeekEnd: "ui-icon-seek-end",
            iconSeekNext: "ui-icon-seek-next",
            iconSeekPrev: "ui-icon-seek-prev",
            iconPrint: "ui-icon-print",
            iconDisk: "ui-icon-disk",
            iconSeekStart: "ui-icon-seek-start",
            iconFullScreen: "ui-icon-newwin",
            iconContinousView: "ui-icon-carat-2-n-s",
            iconZoomIn: "ui-icon-zoomin",
            iconZoomOut: "ui-icon-zoomout",
            iconBookmark: "ui-icon-bookmark",
            iconSearch: "ui-icon-search",
            iconImage: "ui-icon-image",
            iconArrowReturn: "ui-icon-arrowreturnthick-1-w",
            iconHome: "ui-icon-home",
            inputSpinnerLeft: "ui-input-spinner-left",
            inputSpinnerRight: "ui-input-spinner-right",
            inputTriggerLeft: "ui-input-trigger-left",
            inputTriggerRight: "ui-input-trigger-right",
            inputSpinnerTriggerLeft: "ui-input-spinner-trigger-left",
            inputSpinnerTriggerRight: "ui-input-spinner-trigger-right",
            cornerAll: "ui-corner-all",
            cornerLeft: "ui-corner-left",
            cornerRight: "ui-corner-right",
            cornerBottom: "ui-corner-bottom",
            cornerBL: "ui-corner-bl",
            cornerBR: "ui-corner-br",
            cornerTop: "ui-corner-top",
            cornerTL: "ui-corner-tl",
            cornerTR: "ui-corner-tr",
            helperClearFix: "ui-helper-clearfix",
            helperReset: "ui-helper-reset",
            helperHidden: "ui-helper-hidden",
            priorityPrimary: "ui-priority-primary",
            prioritySecondary: "ui-priority-secondary",
            button: "ui-button",
            buttonText: "ui-button-text",
            buttonTextOnly: "ui-button-text-only",
            tabs: "ui-tabs",
            tabsTop: "ui-tabs-top",
            tabsBottom: "ui-tabs-bottom",
            tabsLeft: "ui-tabs-left",
            tabsRight: "ui-tabs-right",
            tabsLoading: "ui-tabs-loading",
            tabsActive: "ui-tabs-active",
            tabsPanel: "ui-tabs-panel",
            tabsNav: "ui-tabs-nav",
            tabsHide: "ui-tabs-hide",
            tabsCollapsible: "ui-tabs-collapsible",
            activeMenuitem: "ui-active-menuitem"
        };

        jQueryWijmo.wijMobileCSS = {
            content: "ui-content",
            header: "ui-header",
            overlay: "ui-overlay",
            stateDisabled: "ui-state-disabled",
            stateFocus: "ui-focus",
            stateActive: "ui-btn-active",
            stateDefault: "ui-btn ui-btn-a",
            icon: "ui-icon ui-btn-icon-notext",
            iconArrowUp: "ui-icon-carat-u",
            iconArrowRight: "ui-icon-carat-r",
            iconArrowDown: "ui-icon-carat-d",
            iconArrowLeft: "ui-icon-carat-l",
            iconArrowRightDown: "ui-icon-carat-d",
            iconSeekFirst: "ui-icon-carat-l",
            iconSeekEnd: "ui-icon-carat-r",
            iconSeekNext: "ui-icon-carat-r",
            iconSeekPrev: "ui-icon-carat-l",
            iconClose: "ui-icon-delete",
            iconStop: "ui-icon-grid",
            iconCheck: "ui-icon-check",
            iconArrowReturn: "ui-icon-back"
        };

        jQueryWijmo.wijMobileThemePrefix = ["ui-bar", "ui-body", "ui-overlay", "ui-btn"];
        return jQueryWijmo;
    })();
    $.wijmo = jQueryWijmo;

    // Declarations to support TypeScript type system
    var JQueryUIWidget = (function () {
        function JQueryUIWidget() {
        }
        /** Removes the dialog functionality completely. This will return the element back to its pre-init state. */
        JQueryUIWidget.prototype.destroy = function () {
        };

        JQueryUIWidget.prototype._setOption = function (name, value) {
        };

        JQueryUIWidget.prototype._create = function () {
        };
        JQueryUIWidget.prototype._init = function () {
        };

        /** Returns a jQuery object containing the original element or other relevant generated element. */
        JQueryUIWidget.prototype.widget = function () {
            return this.element;
        };
        return JQueryUIWidget;
    })();
    wijmo.JQueryUIWidget = JQueryUIWidget;
    JQueryUIWidget.prototype.options = {
        wijCSS: $.wijmo.wijCSS
    };
    JQueryUIWidget.prototype.destroy = function () {
        $.Widget.prototype.destroy.apply(this, arguments);
    };
    JQueryUIWidget.prototype._setOption = function (name, value) {
        $.Widget.prototype._setOption.apply(this, arguments);
    };
    JQueryUIWidget.prototype._create = function () {
        $.Widget.prototype._create.apply(this, arguments);
    };
    JQueryUIWidget.prototype._init = function () {
        $.Widget.prototype._init.apply(this, arguments);
    };

    var JQueryMobileWidget = (function (_super) {
        __extends(JQueryMobileWidget, _super);
        function JQueryMobileWidget() {
            _super.apply(this, arguments);
        }
        return JQueryMobileWidget;
    })(JQueryUIWidget);
    wijmo.JQueryMobileWidget = JQueryMobileWidget;

    //Fires a wijmoinit event on the document object for users to override default settings.
    //Use $(document).bind("wijmoinit", function() {//apply overrides here});
    //The event handler must be binded before jquery.wijmo.widget is loaded.
    $(window.document).trigger("wijmoinit");

    var wijmoWidget = (function (_super) {
        __extends(wijmoWidget, _super);
        function wijmoWidget() {
            _super.apply(this, arguments);
            this._widgetCreated = false;
        }
        wijmoWidget.prototype._baseWidget = function () {
            return this._isMobile ? $.mobile.widget : $.Widget;
        };
        wijmoWidget.prototype._createWidget = function (options, element) {
            this._widgetCreated = true;

            //Set widgetName to widgetEventPrefix for binding events like following,
            //$(element).bind(widgetName + eventName, function() {});
            if (this._syncEventPrefix) {
                this.widgetEventPrefix = this.widgetName;
            }

            // enable touch support:
            if (window.wijmoApplyWijTouchUtilEvents) {
                $ = window.wijmoApplyWijTouchUtilEvents($);
            }
            this._baseWidget().prototype._createWidget.apply(this, arguments);
        };
        wijmoWidget.prototype._create = function () {
            this._baseWidget().prototype._create.apply(this, arguments);
            if (this._isDisabled()) {
                this._innerDisable();
            }
        };
        wijmoWidget.prototype._init = function () {
            this._baseWidget().prototype._init.apply(this, arguments);
        };
        wijmoWidget.prototype.destroy = function () {
            this.element.unbind(".ui-disableSelection");
            this._baseWidget().prototype.destroy.apply(this, arguments);
        };
        wijmoWidget.prototype._setOption = function (name, value) {
            var oldDisabled = this._isDisabled(), newDisabled;
            this._baseWidget().prototype._setOption.apply(this, arguments);

            // Modefy for the updating from jquery-ui.1.10 to jquery-ui.1.11
            if (name === "disabled") {
                newDisabled = this._isDisabled();
                if (oldDisabled === newDisabled)
                    return;

                if (newDisabled) {
                    this._innerDisable();
                } else {
                    this._innerEnable();
                }
            }

            //Fixed an issue for jQuery mobile. when set the disabled option, the jQuery mobile set
            // 'ui-state-disabled' css on the element.
            if (name === "disabled" && value && this._isMobile) {
                this.element.removeClass("ui-state-disabled").addClass(this.options.wijCSS.stateDisabled);
            }
        };

        wijmoWidget.prototype._innerDisable = function () {
            this._toggleDisable();
        };

        wijmoWidget.prototype._innerEnable = function () {
            this._toggleDisable();
        };

        wijmoWidget.prototype._toggleDisable = function () {
            this.element.toggleClass("ui-state-disabled", !!this._isDisabled()).toggleClass(this.widgetFullName + "-disabled", !!this._isDisabled()).attr("aria-disabled", this._isDisabled());
        };

        wijmoWidget.prototype._isDisabled = function () {
            var opts = this.options;
            return opts.disabledState === true || opts.disabled === true;
        };
        return wijmoWidget;
    })(JQueryMobileWidget);
    wijmo.wijmoWidget = wijmoWidget;
    wijmoWidget.prototype._syncEventPrefix = true;
    wijmoWidget.prototype._isMobile = false;

    var wijmo_css = (function () {
        function wijmo_css() {
            this.getState = function (name) {
                name = name.charAt(0).toUpperCase() + name.substr(1);
                return this["state" + name];
            };
            this.widget = "ui-widget";
            this.overlay = "ui-widget-overlay";
            this.content = "ui-widget-content";
            this.header = "ui-widget-header";
            this.stateDisabled = "ui-state-disabled";
            this.stateFocus = "ui-state-focus";
            this.stateActive = "ui-state-active";
            this.stateDefault = "ui-state-default";
            this.stateHighlight = "ui-state-highlight";
            this.stateHover = "ui-state-hover";
            this.stateChecked = "ui-state-checked";
            this.stateError = "ui-state-error";
            this.icon = "ui-icon";
            this.iconCheck = "ui-icon-check";
            this.iconRadioOn = "ui-icon-radio-on";
            this.iconRadioOff = "ui-icon-radio-off";
            this.iconClose = "ui-icon-close";
            this.iconArrow4Diag = "ui-icon-arrow-4-diag";
            this.iconNewWin = "ui-icon-newwin";
            this.iconVGripSolid = "ui-icon-grip-solid-vertical";
            this.iconHGripSolid = "ui-icon-grip-solid-horizontal";
            this.iconPlay = "ui-icon-play";
            this.iconPause = "ui-icon-pause";
            this.iconStop = "ui-icon-stop";
            this.iconArrowUp = "ui-icon-triangle-1-n";
            this.iconArrowRight = "ui-icon-triangle-1-e";
            this.iconArrowDown = "ui-icon-triangle-1-s";
            this.iconArrowLeft = "ui-icon-triangle-1-w";
            this.iconArrowRightDown = "ui-icon-triangle-1-se";
            this.iconArrowThickDown = "ui-icon-arrowthick-1-s glyphicon glyphicon-arrow-down";
            this.iconArrowThickUp = "ui-icon-arrowthick-1-n glyphicon glyphicon-arrow-up";
            this.iconCaratUp = "ui-icon-carat-1-n";
            this.iconCaratRight = "ui-icon-carat-1-e";
            this.iconCaratDown = "ui-icon-carat-1-s";
            this.iconCaratLeft = "ui-icon-carat-1-w";
            this.iconClock = "ui-icon-clock glyphicon glyphicon-time";
            this.iconPencil = "ui-icon-pencil glyphicon glyphicon-pencil";
            this.iconSeekFirst = "ui-icon-seek-first";
            this.iconSeekEnd = "ui-icon-seek-end";
            this.iconSeekNext = "ui-icon-seek-next";
            this.iconSeekPrev = "ui-icon-seek-prev";
            this.iconPrint = "ui-icon-print";
            this.iconDisk = "ui-icon-disk";
            this.iconSeekStart = "ui-icon-seek-start";
            this.iconFullScreen = "ui-icon-newwin";
            this.iconContinousView = "ui-icon-carat-2-n-s";
            this.iconZoomIn = "ui-icon-zoomin";
            this.iconZoomOut = "ui-icon-zoomout";
            this.iconBookmark = "ui-icon-bookmark";
            this.iconSearch = "ui-icon-search";
            this.iconImage = "ui-icon-image";
            this.inputSpinnerLeft = "ui-input-spinner-left";
            this.inputSpinnerRight = "ui-input-spinner-right";
            this.inputTriggerLeft = "ui-input-trigger-left";
            this.inputTriggerRight = "ui-input-trigger-right";
            this.inputSpinnerTriggerLeft = "ui-input-spinner-trigger-left";
            this.inputSpinnerTriggerRight = "ui-input-spinner-trigger-right";
            this.cornerAll = "ui-corner-all";
            this.cornerLeft = "ui-corner-left";
            this.cornerRight = "ui-corner-right";
            this.cornerBottom = "ui-corner-bottom";
            this.cornerBL = "ui-corner-bl";
            this.cornerBR = "ui-corner-br";
            this.cornerTop = "ui-corner-top";
            this.cornerTL = "ui-corner-tl";
            this.cornerTR = "ui-corner-tr";
            this.helperClearFix = "ui-helper-clearfix";
            this.helperReset = "ui-helper-reset";
            this.helperHidden = "ui-helper-hidden";
            this.priorityPrimary = "ui-priority-primary";
            this.prioritySecondary = "ui-priority-secondary";
            this.button = "ui-button";
            this.buttonText = "ui-button-text";
            this.buttonTextOnly = "ui-button-text-only";
            this.tabs = "ui-tabs";
            this.tabsTop = "ui-tabs-top";
            this.tabsBottom = "ui-tabs-bottom";
            this.tabsLeft = "ui-tabs-left";
            this.tabsRight = "ui-tabs-right";
            this.tabsLoading = "ui-tabs-loading";
            this.tabsActive = "ui-tabs-active";
            this.tabsPanel = "ui-tabs-panel";
            this.tabsNav = "ui-tabs-nav";
            this.tabsHide = "ui-tabs-hide";
            this.tabsCollapsible = "ui-tabs-collapsible";
            this.activeMenuitem = "ui-active-menuitem";
        }
        return wijmo_css;
    })();
    wijmo.wijmo_css = wijmo_css;

    //Check if jQuery Mobile is on the page and make sure autoMobilize is set to true (so that this default behavior can be turned off)
    if ($.mobile != null && $.wijmo.autoMobilize === true) {
        //Set mobile CSS classes to work with jQuery Mobile CSS Framework
        //wijmoWidget.options.wijCSS = $.wijmo.wijMobileCSS;
        $.extend(true, wijmoWidget.prototype.options.wijCSS, $.wijmo.wijMobileCSS);

        wijmoWidget.prototype._isMobile = true;
        wijmoWidget.prototype.options = $.extend(true, {}, wijmoWidget.prototype.options, wijmoWidget.prototype._baseWidget().prototype.options);

        wijmoWidget.prototype._getCreateOptions = function () {
            var ele = this.element, baseOptions, optionsParser = optionsParser = function (value) {
                // Add quotes to key pair.
                if (typeof value === 'undefined') {
                    return {};
                } else if (value === null) {
                    return {};
                }

                var reg = /(?:(?:\{[\n\r\t\s]*(.+?)\s*\:[\n\r\t\s]*)|(?:,[\n\r\t\s]*(.+?)\s*\:[\n\r\t\s]*))('(.*?[^\\])')?/gi, arrReg = /\[.*?(?=[\]\[])|[\]\[].*?(?=[\]])/gi, str = value.replace(reg, function (i, str1, str2, str3) {
                    var result, reg1 = /[\n\r\t\s]*['"]?([^\{,\s]+?)['"]?\s*:[\n\r\t\s]*/i, reg2 = /\:[\n\r\t\s]*(?:'(.*)')?/i;

                    result = i.replace(reg1, "\"$1\":");
                    if (str3) {
                        return result.replace(reg2, ":\"$1\"");
                    }
                    return result;
                }).replace(arrReg, function (i) {
                    var reg1 = /'(.*?[^\\])'/g;
                    return i.replace(reg1, "\"$1\"");
                });

                return $.parseJSON(str);
            }, options = optionsParser(ele.attr("data-" + $.mobile.nsNormalize("options"))), wijCSS;

            baseOptions = $.mobile.widget.prototype._getCreateOptions.apply(this, arguments);

            //add theme support in mobile mode
            wijCSS = $.extend(true, {}, this.options.wijCSS);
            this.theme = this.options.theme !== undefined ? this.options.theme : this.element.jqmData("theme");
            if (this.theme) {
                $.wijmo.addThemeToMobileCSS(this.theme, wijCSS);
            }

            return $.extend(baseOptions, { wijCSS: wijCSS }, options);
        };

        $.widget("wijmo.widget", $.mobile.widget, wijmoWidget.prototype);
        $(document).on("pageshow", function (event, ui) {
            if (event.target == null)
                return;
            var page = $(event.target);
            if (page.wijTriggerVisibility) {
                page.wijTriggerVisibility();
            }
        });
    } else {
        wijmoWidget.prototype.options = $.extend(true, {}, wijmoWidget.prototype.options, wijmoWidget.prototype._baseWidget().prototype.options);

        //jQuery Mobile either does not exist or the autoMobilize flag has been turned off.
        $.widget("wijmo.widget", wijmoWidget.prototype);
    }
})(wijmo || (wijmo = {}));
