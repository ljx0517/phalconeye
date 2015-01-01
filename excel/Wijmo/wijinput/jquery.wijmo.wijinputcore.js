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
/// <reference path="../external/declarations/globalize.d.ts"/>
/// <reference path="../Base/jquery.wijmo.widget.ts"/>
/// <reference path="../wijpopup/jquery.wijmo.wijpopup.ts"/>
/// <reference path="../wijlist/jquery.wijmo.wijlist.ts"/>
/// <reference path="../wijsuperpanel/jquery.wijmo.wijsuperpanel.ts"/>
/// <reference path="jquery.wijmo.wijcharex.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals Globalize window jQuery wijInputResult document*/
    (function (input) {
        "use strict";

        var $ = jQuery, jqKeyCode = wijmo.getKeyCodeEnum();

        /** @widget */
        var wijinputcore = (function (_super) {
            __extends(wijinputcore, _super);
            function wijinputcore() {
                _super.apply(this, arguments);
                this._wasPopupShowing = false;
                this._imeCompostiing = false;
                this._boundMouseWheel = false;
                this._blockNextTriggerClickedEvent = false;
            }
            wijinputcore.prototype._elemWithClasses = function (elem, classes) {
                if (typeof classes === "undefined") { classes = []; }
                return $(elem).addClass(classes.join(" "));
            };
            wijinputcore.prototype._divWithClasses = function () {
                var classes = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    classes[_i] = arguments[_i + 0];
                }
                return this._elemWithClasses("<div/>", classes);
            };
            wijinputcore.prototype._spanWithClasses = function () {
                var classes = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    classes[_i] = arguments[_i + 0];
                }
                return this._elemWithClasses("<span/>", classes);
            };

            wijinputcore.prototype._horizontalBorderWidth = function (elem) {
                return elem.leftBorderWidth() + elem.rightBorderWidth();
            };
            wijinputcore.prototype._verticalBorderWidth = function (elem) {
                return elem.topBorderWidth() + elem.bottomBorderWidth();
            };
            wijinputcore.prototype._create = function () {
                var _this = this;
                try  {
                    var focused = document.activeElement == this.element[0];
                } catch (e) {
                }

                var hBorder = this._horizontalBorderWidth(this.element);
                var vBorder = this._verticalBorderWidth(this.element);
                if (this.element[0].tagName.toLowerCase() !== 'input' && this.element[0].tagName.toLowerCase() !== 'textarea') {
                    throw "Target element is not a INPUT";
                }

                this._creationDate = new Date();

                // enable touch support:
                if (window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }

                if (this.element.is(":hidden") && this.element.wijAddVisibilityObserver) {
                    this.element.wijAddVisibilityObserver(function () {
                        _this._destroy();
                        _this._create();
                        if (_this.element.wijRemoveVisibilityObserver) {
                            _this.element.wijRemoveVisibilityObserver();
                        }
                    }, "wijinput");
                }

                this.element.data("widgetName", this.widgetName);

                //$.effects.save(this.element, ['width', 'height']);
                if ($.effects && $.effects.save) {
                    $.effects.save(this.element, ['width', 'height']);
                } else if ($.save) {
                    $.save(this.element, ['width', 'height']);
                }

                var wijCSS = this.options.wijCSS;
                this.element.wrap("<div><span/></div");
                this.wrapper = this.element.parent();
                this.outerDiv = this.wrapper.parent();
                this.outerDiv.addClass([wijCSS.wijinput, wijCSS.widget, wijCSS.helperClearFix, wijCSS.stateDefault, wijCSS.cornerAll].join(" "));
                this.wrapper.addClass(wijCSS.wijinputWrapper);

                this.element.addClass(wijCSS.wijinputInput).addClass(wijCSS.cornerAll).attr('role', 'textbox');

                if (!(CoreUtility.IsIE() && parseFloat($.browser.version) <= 7)) {
                    try  {
                        this.element.attr('aria-multiline', false);
                    } catch (e) {
                        this.element[0].setAttribute('aria-multiline', "false");
                    }
                    //self.element.attr('aria-multiline', false);
                }

                if (this.options.showTrigger != undefined) {
                    this.options.showDropDownButton = this.options.showTrigger;
                }

                this._createDropDownAndSpin();
                this._initialize();

                if (focused) {
                    $(function () {
                        return _this.element.focus().wijtextselection(0, _this.element.val().length);
                    });
                }

                // We need to move width and height from the <input/> to the outer <div/> because the input must span the parent wrapper.
                // It must be done if A dimension is set in the style attribute, hence the "if" statements
                // The a dimension is in pixels, it must be adjusted according to the input's and div's border/margin/padding.
                // The input's total border size must be calcualted before changing the classes, hence variables hBorder and vBorder.
                var style = this.element[0].style;
                if (style.width) {
                    if (this._isInPercents(style.width)) {
                        this.outerDiv.width(style.width);
                    } else {
                        this.outerDiv.width(this.element.width() + hBorder - this._horizontalBorderWidth(this.outerDiv));
                    }
                    this.element.width("");
                }
                if (style.height) {
                    if (this._isInPercents(style.height)) {
                        this.outerDiv.height(style.height);
                    } else {
                        this.outerDiv.height(this.element.height() + vBorder - this._verticalBorderWidth(this.outerDiv));
                    }
                    this.element.height(this.outerDiv.height() - (parseInt(this.wrapper.css('padding-top')) + parseInt(this.wrapper.css('padding-bottom'))));
                    this.wrapper.height(style.height);
                }
                _super.prototype._create.call(this);
            };

            wijinputcore.prototype._createDropDownAndSpin = function () {
                this._createDropDownAndSpinElement();
                this._createDropDownAndSpinStyle();
                this._createDropDownAndSpinLayout();
            };

            wijinputcore.prototype._createDropDownAndSpinElement = function () {
                var wijCSS = this.options.wijCSS;
                var spinnerAlign = this.options.spinnerAlign;
                var leftSpinnerBtn = spinnerAlign === 'verticalLeft';
                var leftDropDownBtn = this.options.dropDownButtonAlign === 'left';
                var showSpinner = this.options.showSpinner;
                var showDropDownButton = this._isDropDownButtonShown();

                if (this.options.buttonAlign != null) {
                    leftSpinnerBtn = this.options.buttonAlign == 'left';
                    leftDropDownBtn = this.options.buttonAlign == 'left';
                    spinnerAlign = this.options.buttonAlign == 'left' ? "verticalLeft" : "verticalRight";
                }

                this.triggerBtn = null;
                this.spinUpElement = null;
                this.spinDownElement = null;

                this.outerDiv.css("overflow", "hidden");

                if (showDropDownButton) {
                    var cornerCSS = leftDropDownBtn ? wijCSS.cornerLeft : wijCSS.cornerRight;
                    this.triggerBtn = this._divWithClasses(wijCSS.wijinputTrigger, wijCSS.stateDefault, cornerCSS).append(this._spanWithClasses(wijCSS.icon, wijCSS.iconArrowDown)).attr('role', 'button');
                    this.element.attr({ 'role': 'combobox', 'aria-expanded': false });
                }

                if (showSpinner) {
                    this.spinnerLeft = this._divWithClasses(wijCSS.wijinputSpinnerLeft, wijCSS.wijinputButton);
                    this.spinnerRight = this._divWithClasses(wijCSS.wijinputSpinnerRight, wijCSS.wijinputButton);

                    if (spinnerAlign === "verticalLeft" || spinnerAlign === "verticalRight") {
                        this.spinUpElement = this._divWithClasses(wijCSS.stateDefault, wijCSS.wijinputSpinUp).append(this._spanWithClasses(wijCSS.icon, wijCSS.iconArrowUp)).css({ "padding": "0px" }).attr('role', 'upbutton');

                        this.spinDownElement = this._divWithClasses(wijCSS.stateDefault, wijCSS.wijinputSpinDown).append(this._spanWithClasses(wijCSS.icon, wijCSS.iconArrowDown)).css({ "padding": "0px" }).attr('role', 'downbutton');
                    } else {
                        this.spinUpElement = this._divWithClasses(wijCSS.stateDefault, wijCSS.wijinputSpin).append(this._spanWithClasses(wijCSS.icon, wijCSS.iconPlus, wijCSS.glyphIcon, wijCSS.glyphIconPlus)).css({ "padding": "0px" }).attr('role', 'upbutton');
                        this.spinDownElement = this._divWithClasses(wijCSS.stateDefault, wijCSS.wijinputSpin).append(this._spanWithClasses(wijCSS.icon, wijCSS.iconMinus, wijCSS.glyphIcon, wijCSS.glyphIconMinus)).css({ "padding": "0px" }).attr('role', 'downbutton');
                    }

                    this.element.attr('role', 'spinner');
                }
            };

            wijinputcore.prototype._createDropDownAndSpinStyle = function () {
                var wijCSS = this.options.wijCSS;
                var spinnerAlign = this.options.spinnerAlign;
                var leftSpinnerBtn = this.options.spinnerAlign === 'verticalLeft';
                var leftDropDownBtn = this.options.dropDownButtonAlign === 'left';
                var showSpinner = this.options.showSpinner;
                var showDropDownButton = this._isDropDownButtonShown();

                if (this.options.buttonAlign != null) {
                    leftSpinnerBtn = this.options.buttonAlign == 'left';
                    leftDropDownBtn = this.options.buttonAlign == 'left';
                    spinnerAlign = this.options.buttonAlign == 'left' ? "verticalLeft" : "verticalRight";
                }

                //Flag CSS
                if (showDropDownButton && showSpinner) {
                    if (leftDropDownBtn) {
                        switch (spinnerAlign) {
                            case "verticalLeft":
                                this.outerDiv.addClass(wijCSS.inputSpinnerTriggerLeft);
                                break;
                            case "verticalRight":
                                this.outerDiv.addClass(wijCSS.inputTriggerLeft);
                                this.outerDiv.addClass(wijCSS.inputSpinnerRight);
                                break;
                            case "horizontalDownLeft":
                            case "horizontalUpLeft":
                                this.outerDiv.addClass(wijCSS.inputSpinnerTriggerLeft);
                                this.outerDiv.addClass(wijCSS.inputSpinnerRight);
                                break;
                        }
                    } else {
                        switch (spinnerAlign) {
                            case "verticalLeft":
                                this.outerDiv.addClass(wijCSS.inputTriggerRight);
                                this.outerDiv.addClass(wijCSS.inputSpinnerLeft);
                                break;
                            case "verticalRight":
                                this.outerDiv.addClass(wijCSS.inputSpinnerTriggerRight);
                                break;
                            case "horizontalDownLeft":
                            case "horizontalUpLeft":
                                this.outerDiv.addClass(wijCSS.inputSpinnerTriggerRight);
                                this.outerDiv.addClass(wijCSS.inputSpinnerLeft);
                                break;
                        }
                    }
                } else if (showDropDownButton) {
                    if (leftDropDownBtn) {
                        this.outerDiv.addClass(wijCSS.inputTriggerLeft);
                    } else {
                        this.outerDiv.addClass(wijCSS.inputTriggerRight);
                    }
                } else if (showSpinner) {
                    switch (spinnerAlign) {
                        case "verticalLeft":
                            this.outerDiv.addClass(wijCSS.inputSpinnerLeft);
                            break;
                        case "verticalRight":
                            this.outerDiv.addClass(wijCSS.inputSpinnerRight);
                            break;
                        case "horizontalDownLeft":
                        case "horizontalUpLeft":
                            this.outerDiv.addClass(wijCSS.inputSpinnerLeft);
                            this.outerDiv.addClass(wijCSS.inputSpinnerRight);
                            break;
                    }
                }

                //Corner CSS
                if (showDropDownButton && showSpinner) {
                    if (leftDropDownBtn) {
                        switch (spinnerAlign) {
                            case "verticalRight":
                                this.spinUpElement.addClass(wijCSS.cornerTR);
                                this.spinDownElement.addClass(wijCSS.cornerBR);
                                break;
                            case "horizontalDownLeft":
                                this.spinUpElement.addClass(wijCSS.cornerRight);
                                break;
                            case "horizontalUpLeft":
                                this.spinDownElement.addClass(wijCSS.cornerRight);
                                break;
                        }
                    } else {
                        switch (spinnerAlign) {
                            case "verticalLeft":
                                this.spinUpElement.addClass(wijCSS.cornerTL);
                                this.spinDownElement.addClass(wijCSS.cornerBL);
                                break;
                            case "horizontalDownLeft":
                                this.spinDownElement.addClass(wijCSS.cornerLeft);
                                break;
                            case "horizontalUpLeft":
                                this.spinUpElement.addClass(wijCSS.cornerLeft);
                                break;
                        }
                    }
                } else if (showSpinner) {
                    switch (spinnerAlign) {
                        case "verticalLeft":
                            this.spinUpElement.addClass(wijCSS.cornerTL);
                            this.spinDownElement.addClass(wijCSS.cornerBL);
                            break;
                        case "verticalRight":
                            this.spinUpElement.addClass(wijCSS.cornerTR);
                            this.spinDownElement.addClass(wijCSS.cornerBR);
                            break;
                        case "horizontalDownLeft":
                            this.spinDownElement.addClass(wijCSS.cornerLeft);
                            this.spinUpElement.addClass(wijCSS.cornerRight);
                            break;
                        case "horizontalUpLeft":
                            this.spinUpElement.addClass(wijCSS.cornerLeft);
                            this.spinDownElement.addClass(wijCSS.cornerRight);
                            break;
                    }
                }
            };

            wijinputcore.prototype._createDropDownAndSpinLayout = function () {
                var spinnerAlign = this.options.spinnerAlign;
                var showSpinner = this.options.showSpinner;
                var showDropDownButton = this._isDropDownButtonShown();

                if (this.options.buttonAlign != null) {
                    spinnerAlign = this.options.buttonAlign == 'left' ? "verticalLeft" : "verticalRight";
                }

                if (showDropDownButton) {
                    this.triggerBtn.appendTo(this.outerDiv);
                }

                if (showSpinner) {
                    switch (spinnerAlign) {
                        case "verticalLeft":
                            this.spinnerLeft.append(this.spinUpElement).append(this.spinDownElement).appendTo(this.outerDiv);
                            break;
                        case "verticalRight":
                            this.spinnerRight.append(this.spinUpElement).append(this.spinDownElement).appendTo(this.outerDiv);
                            break;
                        case "horizontalDownLeft":
                            this.spinnerLeft.append(this.spinDownElement).appendTo(this.outerDiv);
                            this.spinnerRight.append(this.spinUpElement).appendTo(this.outerDiv);
                            break;
                        case "horizontalUpLeft":
                            this.spinnerLeft.append(this.spinUpElement).appendTo(this.outerDiv);
                            this.spinnerRight.append(this.spinDownElement).appendTo(this.outerDiv);
                            break;
                    }
                }
            };

            wijinputcore.prototype._isDropDownButtonShown = function () {
                var showTrigger = this.options.showTrigger;
                if (showTrigger === undefined) {
                    showTrigger = false;
                }
                return showTrigger || this.options.showDropDownButton;
            };

            wijinputcore.prototype._isInPercents = function (size) {
                return size.match(/%$/);
            };

            wijinputcore.prototype._createTextProvider = function () {
                return undefined;
            };

            wijinputcore.prototype._beginUpdate = function () {
            };

            wijinputcore.prototype._endUpdate = function () {
                var _this = this;
                if (this.element.mousewheel && !this._boundMouseWheel) {
                    this.element.mousewheel(function (e, delta) {
                        if (_this.isFocused() && _this._doSpin(delta > 0, false)) {
                            e.preventDefault();
                        }
                    });
                    this._boundMouseWheel = true;
                }
            };

            wijinputcore.prototype._isPopupShowing = function () {
                return !!this._comboDiv && this._comboDiv.wijpopup("isVisible");
            };

            wijinputcore.prototype._onTriggerMouseDown = function (evt) {
                if (this._wasPopupShowing) {
                    this._blockNextTriggerClickedEvent = true;
                }
            };

            wijinputcore.prototype._onTriggerMouseUp = function (evt) {
            };

            wijinputcore.prototype._onTriggerClicked = function () {
                if (this._blockNextTriggerClickedEvent) {
                    this._blockNextTriggerClickedEvent = false;
                    return;
                }
                if (this._popupVisible()) {
                    this._hidePopup();
                } else {
                    this._showPopup();
                }
            };
            wijinputcore.prototype._showPopup = function () {
                return this._popupComboList();
            };
            wijinputcore.prototype._hidePopup = function () {
                this._comboDiv.wijpopup('hide');
            };

            wijinputcore.prototype._initialize = function () {
                var _this = this;
                this.element.data('initializing', true);
                this._trigger('initializing');

                this.element.data('preText', this.element.val());
                this.element.data('elementValue', this.element.val());
                this.element.data('errorstate', false);
                this.element.data('breakSpinner', true);
                this.element.data('prevSelection', null);
                this.element.data('simulating', false);

                this._createTextProvider();
                this._beginUpdate();

                var options = this.options, isLeftButton = function (e) {
                    return (!e.which ? e.button : e.which) === 1;
                }, spinButtonDown = function (e) {
                    if (_this._isDisabled()) {
                        return;
                    }
                    if (!isLeftButton(e)) {
                        return;
                    }
                    if (_this.options.disableUserInput) {
                        return;
                    }
                    _this._trySetFocus();
                    if (CoreUtility.IsFireFox4OrLater()) {
                        _this._stopEvent(e);
                    }

                    _this.element.data('breakSpinner', false);
                    _this._addState('active', $(_this));
                    _this._doSpin($(e.currentTarget).attr("role") == "upbutton", true);
                }, spinButtonUp = function (e) {
                    if (_this._isDisabled()) {
                        return;
                    }
                    if (!isLeftButton(e)) {
                        return;
                    }
                    if (_this.options.disableUserInput) {
                        return;
                    }
                    _this._stopSpin();
                    _this._removeState('active', $(_this));
                };

                if (this.triggerBtn && !options.disabledState) {
                    this.triggerBtn.bind({
                        'mouseover': function () {
                            if (_this._isDisabled()) {
                                return;
                            }
                            _this._addState('hover', $(_this));
                        },
                        'mouseout': function () {
                            if (_this._isDisabled()) {
                                return;
                            }
                            _this._removeState('hover', $(_this));
                        },
                        'mousedown': function (e) {
                            if (_this._isDisabled()) {
                                return;
                            }
                            if (!isLeftButton(e)) {
                                return;
                            }
                            _this._stopEvent(e);
                            _this._addState('active', $(_this));
                            _this._trigger('triggerMouseDown');
                            _this._trigger('dropDownButtonMouseDown');
                            _this._onTriggerMouseDown(e);
                        },
                        'mouseup': function (e) {
                            _this._onTriggerMouseUp(e);
                        },
                        'click': function (e) {
                            if (_this._isDisabled()) {
                                return;
                            }
                            _this._stopEvent(e);
                            _this._stopSpin();
                            _this._removeState('active', $(_this));
                            _this._trigger('triggerMouseUp');
                            _this._trigger('dropDownButtonMouseUp');
                            _this._onTriggerClicked();
                            if (!CoreUtility.IPad) {
                                _this._trySetFocus();
                            }
                        }
                    });
                }

                if (this.spinUpElement && !options.disabledState) {
                    this.spinUpElement.bind({
                        'mouseover': function () {
                            if (_this._isDisabled()) {
                                return;
                            }
                            _this._addState('hover', $(_this));
                        },
                        'mouseout': function () {
                            if (_this._isDisabled()) {
                                return;
                            }
                            _this._removeState('hover', $(_this));
                            _this._removeState('active', $(_this));
                            _this._stopSpin();
                        },
                        'mousedown': spinButtonDown,
                        'mouseup': spinButtonUp
                    });
                }

                if (this.spinDownElement && !options.disabledState) {
                    this.spinDownElement.bind({
                        'mouseover': function () {
                            if (_this._isDisabled()) {
                                return;
                            }
                            _this._addState('hover', $(_this));
                        },
                        'mouseout': function () {
                            if (_this._isDisabled()) {
                                return;
                            }
                            _this._removeState('hover', $(_this));
                            _this._removeState('active', $(_this));
                            _this._stopSpin();
                        },
                        'mousedown': spinButtonDown,
                        'mouseup': spinButtonUp
                    });
                }

                this._attachInputEvent();
                this.element.data('initializing', false);

                this._resetData();
                this._endUpdate();
                this._updateText();

                if (this.options.imeMode) {
                    this.element.css("ime-mode", this.options.imeMode);
                }

                this.element.data('initialized', true);
                this._trigger('initialized');
            };

            wijinputcore.prototype._attachInputEvent = function () {
                this.element.bind({
                    'focus.wijinput': $.proxy(this._onFocus, this),
                    'beforedeactivate.wijinput': $.proxy(this._onBeforeDeactivate, this),
                    'blur.wijinput': $.proxy(this._onBlur, this),
                    'mousedown.wijinput': $.proxy(this._onMouseDown, this),
                    'mouseup.wijinput': $.proxy(this._onMouseUp, this),
                    'keypress.wijinput': $.proxy(this._onKeyPress, this),
                    'keydown.wijinput': $.proxy(this._onKeyDown, this),
                    'keyup.wijinput': $.proxy(this._onKeyUp, this),
                    'compositionstart.wijinput': $.proxy(this._onCompositionStart, this),
                    'compositionend.wijinput': $.proxy(this._onCompositionEnd, this),
                    'change.wijinput': $.proxy(this._onChange, this),
                    'paste.wijinput': $.proxy(this._onPaste, this),
                    'drop.wijinput': $.proxy(this._onDrop, this)
                });

                this.element.bind('propertychange.wijinput input.wijinput', $.proxy(this._onInput, this));
            };

            wijinputcore.prototype._detachInputEvent = function () {
                this.element.unbind('.wijinput');
            };

            wijinputcore.prototype._init = function () {
                if (this.element.attr("readOnly")) {
                    this.options.readonly = true;
                }
                if (this.options.readonly === true) {
                    this.options.disableUserInput = true;
                }
                if (this.options.readonly === true || this.options.disableUserInput === true) {
                    this.element.attr('readOnly', true);
                }

                if (this.options.placeholder != null) {
                    this.options.nullText = this.options.placeholder;
                }
            };

            wijinputcore.prototype._showNullText = function () {
                return !!this.options.nullText || this.options.nullText === "";
            };

            wijinputcore.prototype._setOption = function (key, value) {
                switch (key) {
                    case 'readonly':
                        this._super(key, value);
                        key = "disableUserInput";
                        break;
                    case 'placeholder':
                        this._super(key, value);
                        key = 'nullText';
                        break;
                    case 'showTrigger':
                        this.options.showTrigger = value;
                        this.options.showDropDownButton = value;
                        break;
                }

                this._super(key, value);

                switch (key) {
                    case 'spinnerAlign':
                    case 'dropDownButtonAlign':
                    case 'showDropDownButton':
                    case 'buttonAlign':
                    case 'showTrigger':
                    case 'showSpinner':
                        this._destroy();
                        this._create();
                        break;

                    case 'showNullText':
                    case 'nullText':
                        this._updateText();
                        break;

                    case 'imeMode':
                        this.element.css("ime-mode", this.options.imeMode);
                        break;

                    case 'disableUserInput':
                        this.element.attr('readOnly', value);
                        break;
                    case 'pickers':
                        this._deleteComboDiv();
                        break;
                }
            };

            wijinputcore.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._toggleDisableInput(true);
            };

            wijinputcore.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._toggleDisableInput(false);
            };

            wijinputcore.prototype._toggleDisableInput = function (disabled) {
                var stateDisabled = this.options.wijCSS.stateDisabled;
                this.element.attr('disabled', disabled);

                this.element.toggleClass(stateDisabled, disabled);
                if (this.triggerBtn) {
                    this.triggerBtn.toggleClass(stateDisabled, disabled);
                }

                if (this.spinUpElement) {
                    this.spinUpElement.toggleClass(stateDisabled, disabled);
                }

                if (this.spinDownElement) {
                    this.spinDownElement.toggleClass(stateDisabled, disabled);
                }
            };

            /** Destroy the widget.
            */
            wijinputcore.prototype.destroy = function () {
                this._super();
                if (this._comboDiv) {
                    this._comboDiv.remove();
                }

                if (this.outerDiv) {
                    this.outerDiv.remove();
                }

                if (this.spinnerLeft) {
                    this.spinnerLeft.remove();
                }
                if (this.spinnerRight) {
                    this.spinnerRight.remove();
                }
                if (this.spinDownElement) {
                    this.spinDownElement.remove();
                }
                if (this.spinUpElement) {
                    this.spinUpElement.remove();
                }
                this._destroy();
            };

            /** Open the dropdown list.
            */
            wijinputcore.prototype.drop = function () {
                this._onTriggerClicked();
            };

            /** Get a boolean value indicates that whether the widget has been destroyed.
            */
            wijinputcore.prototype.isDestroyed = function () {
                return !this.outerDiv;
            };

            wijinputcore.prototype._destroy = function () {
                if (this.isDestroyed())
                    return;
                this.wrapper = undefined;
                this.outerDiv = undefined;

                this._detachInputEvent();

                this.element.removeData('errorstate').removeData('breakSpinner').removeData('prevSelection').removeData('simulating').removeData('isPassword').removeClass(this.options.wijCSS.wijinputInput).removeAttr('role').removeAttr('aria-valuemin').removeAttr('aria-valuemax').removeAttr('aria-valuenow').removeAttr('aria-expanded');

                this.element.parent().replaceWith(this.element);
                this.element.parent().replaceWith(this.element);

                //$.effects.restore(this.element, ['width', 'height']);
                if ($.effects && $.effects.restore) {
                    $.effects.restore(this.element, ['width', 'height']);
                } else if ($.restore) {
                    $.restore(this.element, ['width', 'height']);
                }

                // DaryLuo 2014/03/05 fix bug 50664.
                this.triggerBtn = undefined;
                this.spinnerLeft = undefined;
                this.spinnerRight = undefined;
                this.spinDownElement = undefined;
                this.spinUpElement = undefined;
            };

            /** Gets element this widget is associated.
            */
            wijinputcore.prototype.widget = function () {
                return this.outerDiv || this._super();
            };

            wijinputcore.prototype._getCulture = function (name) {
                if (!Globalize) {
                    return null;
                }
                var cal = $.extend(true, {}, Globalize.findClosestCulture(name || this.options.culture) || Globalize.findClosestCulture("default"));
                if (this.options.cultureCalendar !== '' && this.options.cultureCalendar !== 'standard') {
                    $.extend(cal.calendar, cal.calendars[this.options.cultureCalendar || 'standard']);
                }
                return cal;
            };

            wijinputcore.prototype._addState = function (state, el) {
                if (el.is(':not(.ui-state-disabled)')) {
                    el.addClass(this.options.wijCSS.getState(state));
                }
            };

            wijinputcore.prototype._removeState = function (state, el) {
                el.removeClass(this.options.wijCSS.getState(state));
            };

            wijinputcore.prototype._isInitialized = function () {
                return !this.element.data('initializing');
            };

            wijinputcore.prototype._setData = function (val) {
                this.setText(val);
            };

            wijinputcore.prototype._resetData = function () {
            };

            wijinputcore.prototype._validateData = function () {
            };

            /** Gets the text displayed in the input box.
            */
            wijinputcore.prototype.getText = function () {
                if (!this._isInitialized()) {
                    return this.element.val();
                }
                return this._textProvider.toString(true, false, false);
            };

            /** Sets the text displayed in the input box.
            * @example
            * // This example sets text of a wijinputcore to "Hello"
            * $(".selector").wijinputcore("setText", "Hello");
            */
            wijinputcore.prototype.setText = function (value) {
                if (!this._isInitialized()) {
                    this.element.val(value);
                } else {
                    this._textProvider.setText(value);
                    if (value !== "" && this.element.val() !== this.options.nullText) {
                        this.element.data('isShowNullText', false);
                    }
                    this._updateText();
                }
            };

            /** Gets the text value when the container form is posted back to server.
            */
            wijinputcore.prototype.getPostValue = function () {
                if (!this._isInitialized()) {
                    return this.element.val();
                }
                return this._textProvider.toString(true, false, true);
            };

            /** Selects a range of text in the widget.
            * @param {Number} start Start of the range.
            * @param {Number} end End of the range.
            * @example
            * // Select first two symbols in a wijinputcore
            * $(".selector").wijinputdate("selectText", 0, 2);
            */
            wijinputcore.prototype.selectText = function (start, end) {
                var _this = this;
                if (typeof start === "undefined") { start = 0; }
                if (typeof end === "undefined") { end = this.getText().length; }
                if (isNaN(start)) {
                    start = 0;
                }
                if (isNaN(end)) {
                    end = 0;
                }
                if (CoreUtility.IsFireFox4OrLater()) {
                    this.focus();
                }
                if (this.element.is(':disabled')) {
                    return;
                }
                this.isSelectingFromAPI = true;
                this.element.wijtextselection(start, end);
                setTimeout(function () {
                    return _this.isSelectingFromAPI = false;
                }, 100);
            };

            /** Set the focus to the widget.
            */
            wijinputcore.prototype.focus = function () {
                if (this.element.is(':disabled')) {
                    return;
                }
                this.element.get(0).focus();
            };

            /** Determines whether the widget has the focus.
            */
            wijinputcore.prototype.isFocused = function () {
                if (!this.outerDiv) {
                    return false;
                }

                return this.outerDiv.hasClass(this.options.wijCSS.stateFocus);
            };

            /** Gets the selected text.
            */
            wijinputcore.prototype.getSelectedText = function () {
                if (this.isFocused()) {
                    return this.element.wijtextselection().text;
                } else {
                    if (this.element.data('prevSelection')) {
                        var start = this.element.data('prevSelection').start, end = this.element.data('prevSelection').end;
                        return this.element.val().substring(start, end);
                    } else {
                        return "";
                    }
                }
            };

            wijinputcore.prototype._raiseTextChanged = function () {
                var txt = this.element.val(), preText = this.element.data('preText');
                if (!!this.element.data('initialized') && preText !== txt) {
                    this._trigger('textChanged', null, { text: txt });
                    this.element.data('changed', true);
                }

                this.element.data('preText', txt);
            };

            wijinputcore.prototype._raiseDataChanged = function () {
            };

            wijinputcore.prototype._allowEdit = function () {
                return !this.element.is(':disabled');
            };

            wijinputcore.prototype._updateText = function (keepSelection) {
                if (typeof keepSelection === "undefined") { keepSelection = false; }
                if (!this._isInitialized()) {
                    return;
                }

                // default is false
                keepSelection = !!keepSelection;

                var range;
                if (this.element.data('selectionbeforeblur') !== undefined) {
                    range = this.element.data('selectionbeforeblur');
                    this.element.removeData('selectionbeforeblur');
                } else {
                    try  {
                        range = this.element.wijtextselection();
                    } catch (e) {
                    }
                }
                var opt = this.options;

                if (this.isDeleteAll && this._showNullText()) {
                    this.isDeleteAll = false;
                    opt.date = null;
                    this.element.val(opt.nullText);
                } else {
                    this.element.val(this._textProvider.toString());
                    this.options.text = this._textProvider.toString(true, false, false);
                }

                if (!this.element.is(':disabled')) {
                    if (keepSelection) {
                        this.selectText(range.start, range.end);
                    }
                    this.element.data('prevSelection', range);
                }

                this._raiseTextChanged();
                this._raiseDataChanged();
            };

            wijinputcore.prototype._trySetFocus = function () {
                if (document.activeElement !== this.element[0]) {
                    try  {
                        if (!this.options.disableUserInput) {
                            this.element.focus();
                        }
                    } catch (e) {
                    }
                }
            };

            wijinputcore.prototype._deleteSelText = function (backSpace) {
                if (typeof backSpace === "undefined") { backSpace = false; }
                if (!this._allowEdit()) {
                    return;
                }
                var selRange = this.element.wijtextselection();

                if (backSpace) {
                    if (selRange.end < 1)
                        return;
                    if (selRange.end === selRange.start) {
                        selRange.start--;
                    }
                }
                selRange.end--;
                if (selRange.end < selRange.start) {
                    selRange.end = selRange.start;
                }

                var rh = new input.wijInputResult();
                this._textProvider.removeAt(selRange.start, selRange.end, rh);
                this._updateText();
                this.selectText(rh.testPosition, rh.testPosition);
            };

            wijinputcore.prototype._fireIvalidInputEvent = function (chr) {
                var _this = this;
                var invalidInputResult = this._trigger('invalidInput', null, { widget: this, char: chr });
                if ($.isFunction(this.options.invalidInput) && invalidInputResult === true) {
                    return;
                }
                if (!this.element.data('errorstate')) {
                    var cls = this.options.invalidClass || this.options.wijCSS.stateError;
                    this.element.data('errorstate', true);

                    window.setTimeout(function () {
                        if (_this.outerDiv) {
                            _this.outerDiv.removeClass(cls);
                        }
                        _this.element.data('errorstate', false);
                    }, 200);
                    this.outerDiv.addClass(cls);
                }
            };

            wijinputcore.prototype._onInput = function (e) {
                var isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i);
                if (isIOS) {
                    if (this.element.data("hasInput") === true && !this._imeCompostiing) {
                        this.element.data("hasInput", false);
                        this._simulate();
                    }
                    return;
                }
                if (!this._isSimulating() || !this.element.data('ime') || this.element.data("isComposingIME")) {
                    if (this.element.data("isComposingIME")) {
                        this.element.data("simulationPending", true);
                    }
                    return;
                }
                this._simulate();
            };

            wijinputcore.prototype._keyDownPreview = function (e) {
                var key = e.keyCode || e.which;

                if (e.ctrlKey === true && key === 88) {
                    return true;
                }
                if (e.ctrlKey === true && key === 90) {
                    return true;
                }
                return false;
            };

            wijinputcore.prototype._onDoubleByteCharacter = function () {
                var prev = this.element.data("lastDbsState");
                var curSel = this.element.wijtextselection();
                var curText = this.element.val();

                if (this.element.data("isComposingIME") && prev && prev.selection.start === curSel.start && prev.Text === curText) {
                    // nothing changed. The input must be accepted
                    this.element.removeData("lastDbsState");
                    this._simulateOnCompositionEnd();
                } else {
                    this.element.data("lastDbsState", { selection: curSel, text: curText });
                    this._onCompositionStart();
                }
            };
            wijinputcore.prototype._onCompositionStart = function () {
                var isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i);
                if (isIOS) {
                    this._imeCompostiing = true;
                    this._beforeSimulate(true);
                    return;
                }
                if (this.element.data("isComposingIME"))
                    return;
                this.element.data("isComposingIME", true);
                this._beforeSimulate(true);
            };
            wijinputcore.prototype._onCompositionEnd = function () {
                var isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i);
                if (isIOS) {
                    this._imeCompostiing = false;
                    this.element.data("hasInput", true);
                    return;
                }
                this._simulateOnCompositionEnd();
            };
            wijinputcore.prototype._simulateOnCompositionEnd = function () {
                if (!this.element.data("isComposingIME"))
                    return;

                this.element.data("isComposingIME", false);
                if (this._isInitialized() && (!this._textProvider || !this._textProvider.noMask)) {
                    this._simulateIfPending();
                }
            };

            wijinputcore.prototype._simulateIfPending = function () {
                if (this.element.data("simulationPending") && this.element.data("lastSelection")) {
                    this._simulate();
                }
            };

            wijinputcore.prototype._beforeSimulate = function (ime) {
                if (typeof ime === "undefined") { ime = false; }
                if (!this.element.data('lastSelection')) {
                    this.element.data('lastSelection', this.element.wijtextselection());
                    this.element.data('lastValue', this.element.val());
                }

                this.element.data('ime', ime);
                this.element.data('simulating', true);
            };

            wijinputcore.prototype._isSimulating = function () {
                return this.element.data('simulating');
            };

            wijinputcore.prototype._simulate = function (text) {
                var self = this;
                var str = null;

                this.element.data("simulationPending", false);

                if (typeof text === "string") {
                    str = text;
                } else {
                    var range = this.element.wijtextselection();
                    var start = this.element.data('lastSelection').start;
                    var end = range.end;

                    if (end >= start) {
                        str = this.element.val().substring(start, end);
                    }
                }

                if (str) {
                    window.setTimeout(function () {
                        if (self._isLastValueNull()) {
                            return;
                        }
                        self.element.val(self.element.data('lastValue'));
                        var lastSel = self.element.data('lastSelection');
                        self.element.wijtextselection(lastSel);
                        self._batchKeyPress = true;
                        self.element.data('simulating', false);
                        var e = jQuery.Event('keypress');
                        e.ctrlKey = e.altKey = false;
                        for (var i = 0; i < str.length; i++) {
                            e.which = e.charCode = e.keyCode = str.charCodeAt(i);
                            self._nextChar = i === str.length - 1 ? "" : str.charAt(i + 1);
                            self._onKeyPress(e);
                            self._nextChar = "";

                            var appendChar = self._appendChar;
                            if (appendChar && appendChar.length > 0) {
                                self._appendChar = "";
                                e.which = e.charCode = e.keyCode = appendChar.charCodeAt(i);
                                self._onKeyPress(e);
                            }
                            if (self._skipNextChar) {
                                i++;
                                self._skipNextChar = false;
                            }
                        }

                        self._batchKeyPress = false;
                        self._endSimulate();
                    }, 1);
                }
            };

            wijinputcore.prototype._isLastValueNull = function () {
                return !this.element.data('lastValue');
            };

            wijinputcore.prototype._endSimulate = function () {
                this._simulateIfPending();
                this.element.removeData('ime');
                this.element.removeData('lastSelection');
                this.element.removeData('lastValue');
            };

            wijinputcore.prototype._processKeyForDropDownList = function (e) {
                var k = this._getKeyCode(e);
                if (e.altKey && (k === jqKeyCode.UP || k === jqKeyCode.DOWN)) {
                    this._onTriggerClicked();
                    this._stopEvent(e);
                    return true;
                }
                if (k === jqKeyCode.ESCAPE) {
                    if (this._wasPopupShowing) {
                        this._hidePopup();
                        this._stopEvent(e);
                        return true;
                    }
                }

                if (this._wasPopupShowing && this._comboDiv !== undefined) {
                    if (k === jqKeyCode.DOWN) {
                        try  {
                            this._comboDiv.wijlist('next');
                        } catch (ee) {
                        }
                        this._stopEvent(e);
                        return true;
                    } else if (k === jqKeyCode.UP) {
                        try  {
                            this._comboDiv.wijlist('previous');
                        } catch (ee) {
                        }
                        this._stopEvent(e);
                        return true;
                    } else if (k === jqKeyCode.ENTER) {
                        this._comboDiv.wijlist('select');

                        // DaryLuo 2014/07/07 fix bug 71663.
                        // Here we only prevent default behavior, but still left the event bubble up.
                        e.preventDefault();

                        //this._stopEvent(e);
                        return true;
                    } else if (k === jqKeyCode.PAGE_DOWN) {
                        try  {
                            this._comboDiv.wijlist('nextPage');
                        } catch (ee) {
                        }
                        this._stopEvent(e);
                        return true;
                    } else if (k === jqKeyCode.PAGE_UP) {
                        try  {
                            this._comboDiv.wijlist('previousPage');
                        } catch (ee) {
                        }
                        this._stopEvent(e);
                        return true;
                    }
                }
            };

            wijinputcore.prototype._processKeyOnNoMask = function (e) {
                var k = this._getKeyCode(e);
                if (k === jqKeyCode.ENTER) {
                    this._onEnterDown(e);
                }
                if (k === jqKeyCode.LEFT || k === jqKeyCode.RIGHT) {
                    if (this._processLeftRightKey(k === jqKeyCode.LEFT)) {
                        this._stopEvent(e);
                        return;
                    }
                }

                this._processKeyForDropDownList(e);
            };

            wijinputcore.prototype._onKeyDown = function (e) {
                var isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i);
                if (isIOS && this._imeCompostiing) {
                    return;
                }
                this.element.data('prevSelection', null);
                this._deleteKeyDown = false;

                if (!this._isInitialized()) {
                    return;
                }

                if (this._textProvider && !!this._textProvider.noMask) {
                    this._processKeyOnNoMask(e);
                    return;
                }
                var k = this._getKeyCode(e);

                if (k === 229) {
                    this._onDoubleByteCharacter();
                    return;
                }
                this._simulateOnCompositionEnd();

                if (this.options.disableUserInput) {
                    if (k === jqKeyCode.TAB) {
                        if (this._processTabKey(e)) {
                            this._stopEvent(e);
                        }
                    } else {
                        this._stopEvent(e);
                    }
                    return;
                }

                if (this._keyDownPreview(e)) {
                    this._stopEvent(e);
                    return;
                }
                if (this._processKeyForDropDownList(e)) {
                    return;
                }

                switch (k) {
                    case jqKeyCode.UP:
                        this._doSpin(true, false);
                        this._stopEvent(e);
                        return;
                    case jqKeyCode.DOWN:
                        this._doSpin(false, false);
                        this._stopEvent(e);
                        return;
                    case jqKeyCode.LEFT:
                    case jqKeyCode.RIGHT:
                        if (this._processLeftRightKey(k === jqKeyCode.LEFT)) {
                            this._trigger('keyExit');
                            this._stopEvent(e);
                        }
                        return;
                    case jqKeyCode.TAB:
                        if (this._processTabKey(e)) {
                            this._stopEvent(e);
                        }
                        return;
                }

                if (e.ctrlKey) {
                    switch (k) {
                        case jqKeyCode.INSERT:
                        case 67:
                            return;
                        default:
                            break;
                    }
                }
                if (e.ctrlKey || e.altKey) {
                    return;
                }

                switch (k) {
                    case 112:
                    case 113:
                    case 114:
                    case 115:
                    case 116:
                    case 117:
                    case jqKeyCode.TAB:
                    case jqKeyCode.CAPSLOCK:
                    case jqKeyCode.END:
                    case jqKeyCode.HOME:
                    case jqKeyCode.CTRL:
                    case jqKeyCode.SHIFT:
                        return;
                    case jqKeyCode.BACKSPACE:
                        this._deleteSelText(true);
                        this._stopEvent(e);
                        return;
                    case jqKeyCode.DELETE:
                        this._deleteSelText(false);
                        this._stopEvent(e);
                        this._deleteKeyDown = true;
                        return;
                    case jqKeyCode.ENTER:
                        this._onEnterDown(e);
                        break;
                    case jqKeyCode.ESCAPE:
                        this._stopEvent(e);
                        window.setTimeout($.proxy(this._resetData, this), 1);
                        return;
                    case jqKeyCode.PAGE_UP:
                    case jqKeyCode.PAGE_DOWN:
                    case jqKeyCode.ALT:
                        this._stopEvent(e);
                        return;
                }
            };

            wijinputcore.prototype._onEnterDown = function (e) {
                if (this.options.hideEnter) {
                    this._stopEvent(e);
                }
            };

            wijinputcore.prototype._onKeyUp = function (e) {
                var isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i);
                if (isIOS && this._imeCompostiing) {
                    return;
                }
                if (this._textProvider && !!this._textProvider.noMask) {
                    return;
                }

                var key = this._getKeyCode(e);

                if (this._isSimulating()) {
                    if (key === jqKeyCode.ENTER) {
                        this._simulateOnCompositionEnd();
                    }
                    return;
                }

                if (!this._isInitialized()) {
                    return;
                }
                if (key === jqKeyCode.ENTER || key === jqKeyCode.ESCAPE) {
                    return;
                }

                if (this.options.disableUserInput) {
                    this._raiseTextChanged();
                    this._raiseDataChanged();
                    return;
                }

                this._stopEvent(e);
            };

            wijinputcore.prototype._getKeyCode = function (e) {
                var userAgent = window.navigator.userAgent;
                if ((userAgent.indexOf('iPod') !== -1 || userAgent.indexOf('iPhone') !== -1) && e.which === 127) {
                    return 8;
                }
                return e.keyCode || e.which;
            };

            wijinputcore.prototype._keyPressPreview = function (e) {
                return false;
            };

            wijinputcore.prototype._onKeyPress = function (e) {
                if (this._isSimulating() || (this._textProvider && !!this._textProvider.noMask)) {
                    return;
                }
                var isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i);
                if (isIOS && this._imeCompostiing) {
                    return;
                }
                this.element.data('prevSelection', null);

                if (this.options.disableUserInput) {
                    return;
                }
                if (!this._allowEdit()) {
                    return;
                }

                if (e.ctrlKey && e.keyCode === 119) {
                    this._onPaste(e);
                    return;
                }

                var key = e.keyCode || e.which;

                if (CoreUtility.IsFireFox4OrLater()) {
                    switch (e.keyCode) {
                        case jqKeyCode.UP:
                        case jqKeyCode.DOWN:
                        case jqKeyCode.LEFT:
                        case jqKeyCode.RIGHT:
                        case jqKeyCode.HOME:
                        case jqKeyCode.END:
                            return;
                    }
                }

                switch (key) {
                    case 0:
                    case jqKeyCode.TAB:
                        //case jqKeyCode.UP:
                        //case jqKeyCode.DOWN:
                        //case jqKeyCode.LEFT:
                        //case jqKeyCode.RIGHT:
                        return;

                    case jqKeyCode.BACKSPACE:
                        this._stopEvent(e);
                        return;

                    case jqKeyCode.DELETE:
                        if (this._deleteKeyDown) {
                            this._stopEvent(e);
                            return;
                        }
                        break;

                    case jqKeyCode.ENTER:
                        if (this.options.hideEnter) {
                            this._stopEvent(e);
                        }
                        return;
                }

                if (e.ctrlKey || e.altKey) {
                    if (key !== jqKeyCode.SPACE) {
                        return;
                    }
                }

                if (this._keyPressPreview(e)) {
                    return;
                }
                var isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i);

                if (isIOS && !this._batchKeyPress) {
                    this.element.data("hasInput", true);
                    this._beforeSimulate(true);
                    return;
                }

                var ch = String.fromCharCode(key);

                var rh = this._textProvider.replaceWith(this.element.wijtextselection(), ch);
                if (rh) {
                    this._updateText();
                    this.selectText(rh.testPosition + 1, rh.testPosition + 1);
                    this.element.data('prevSelection', { start: rh.testPosition + 1, end: rh.testPosition + 1 });
                } else {
                    this._fireIvalidInputEvent(ch);
                }
                if (!this._batchKeyPress) {
                    this._stopEvent(e);
                }
            };

            wijinputcore.prototype._isNullText = function (val) {
                val = val || this.element.val();
                return this._showNullText() && val === this.options.nullText;
            };

            wijinputcore.prototype._doFocus = function () {
                var selRange = this.element.wijtextselection();
                var sta = selRange.start;
                this._updateText();
                var s = this.element.val();
                if (s.length === sta) {
                    sta = 0;
                }
                if (!$.browser.safari) {
                    this.selectText(sta, sta);
                }
            };

            wijinputcore.prototype._afterFocused = function () {
                if (this._isNullText()) {
                    this._doFocus();
                }
            };

            wijinputcore.prototype._onFocus = function (e) {
                if (this.options.disableUserInput) {
                    return;
                }

                this.outerDiv.addClass(this.options.wijCSS.getState('focus'));

                if (!this.element.data('breakSpinner')) {
                    return;
                }

                if (!this._isInitialized()) {
                    return;
                }
                if (!this._allowEdit()) {
                    return;
                }

                if (this.isSelectingFromAPI) {
                    return;
                }
                if (!this.element.data('focusNotCalledFirstTime')) {
                    this.element.data('focusNotCalledFirstTime', new Date().getTime());
                }
                this._afterFocused();
            };

            wijinputcore.prototype._onBeforeDeactivate = function (e) {
                if (this.options.disableUserInput) {
                    return;
                }
                if (!this.element.data('breakSpinner')) {
                    return;
                }
                if (!this._isInitialized()) {
                    return;
                }
                if (!this._allowEdit()) {
                    return;
                }

                this.element.data('selectionbeforeblur', this.element.wijtextselection());
            };

            wijinputcore.prototype._onBlur = function (e) {
                if (this.options.disableUserInput) {
                    return;
                }
                this._simulateOnCompositionEnd();
                if (this._isComboListVisible()) {
                    return;
                }

                var isFocused = this.isFocused();
                this._removeState('focus', this.outerDiv);

                if (!this.element.data('breakSpinner')) {
                    this.element.get(0).focus();
                    if (this.element.data('prevSelection')) {
                        var curPos = this.element.data('prevSelection').start;
                        if (curPos !== undefined && curPos !== null) {
                            this.selectText(curPos, curPos);
                        }
                    }
                    return;
                }
                if (!this._isInitialized() || !isFocused) {
                    return;
                }

                this.element.data('value', this.element.val());

                this._updateTextOnLostFocus();
            };

            wijinputcore.prototype._updateTextOnLostFocus = function () {
                var _this = this;
                window.setTimeout(function () {
                    _this._onChange();
                    _this._updateText();
                    _this._validateData();

                    if (_this.element.data('changed')) {
                        _this.element.data('changed', false);
                        if (!_this._popupVisible()) {
                            _this._trigger('change');
                            _this.element.change();
                        }
                    }
                }, 100);
            };

            wijinputcore.prototype._popupVisible = function () {
                return this._wasPopupShowing;
            };

            wijinputcore.prototype._onMouseDown = function (e) {
                if (!this._isInitialized()) {
                    return;
                }
                if (this.element.is(':disabled')) {
                    return;
                }

                if (CoreUtility.IsMouseDownOnClearButton(e)) {
                    var isFocused = false;
                    try  {
                        isFocused = document.activeElement === e.target;
                    } catch (ee) {
                    }
                    this.element.data("focusedWhenMouseDown", isFocused);
                    this.element.data('mouseDownOnClearButton', true);
                    return;
                }
            };

            wijinputcore.prototype._onMouseUp = function (e) {
                if (!this._isInitialized()) {
                    return;
                }
                if (this.element.is(':disabled')) {
                    return;
                }

                if (CoreUtility.IsMouseDownOnClearButton(e) && this.element.data('mouseDownOnClearButton') && this.element.data('focusedWhenMouseDown') === true) {
                    if (!this.options.disableUserInput) {
                        var self = this;
                        setTimeout(function () {
                            self._processClearButton();
                        }, 0);
                    }
                    this.element.data('mouseDownOnClearButton', false);
                    return;
                }
                this.element.data('mouseDownOnClearButton', false);
                this.element.data('focusedWhenMouseDown', false);

                var selRange = this.element.wijtextselection();
                this.element.data('prevSelection', selRange);

                // fixed an issue of IE10(browser mode IE9), when runs in this mode,
                // the input element will show clear button at the right side of the input element.
                // click the button, the widget's text value will not cleared.
                if (this.element.val() == '') {
                    return;
                }
                var self = this;

                // Wait for it....
                setTimeout(function () {
                    if (self.element.val() == '') {
                        self.setText("");
                    }
                }, 5);

                if (this.element.data('isFocusSelecting')) {
                    this.element.data('isFocusSelecting', false);
                    e.preventDefault();
                }
            };

            wijinputcore.prototype._onChange = function () {
                if (!this.element) {
                    return;
                }
                var val = this.element.val();
                var txt = this.getText();
                if (txt !== val) {
                    this.setText(val);
                }
            };

            wijinputcore.prototype._onPaste = function (e) {
                if (this._textProvider && !!this._textProvider.noMask) {
                    return;
                }
                this._beforeSimulate();
                var self = this;
                window.setTimeout(function () {
                    self._simulate();
                }, 1);
            };

            wijinputcore.prototype._onDrop = function (e) {
                this._beforeSimulate();
                if (e.originalEvent && e.originalEvent.dataTransfer) {
                    var text = e.originalEvent.dataTransfer.getData('Text');
                    if (text) {
                        this._simulate(text);
                    }
                }
            };

            wijinputcore.prototype._stopEvent = function (e) {
                e.stopPropagation();
                e.preventDefault();
            };

            wijinputcore.prototype._calcSpinInterval = function () {
                this._repeatingCount++;
                if (this._repeatingCount > 10) {
                    return 50;
                } else if (this._repeatingCount > 4) {
                    return 100;
                } else if (this._repeatingCount > 2) {
                    return 200;
                }
                return 400;
            };

            wijinputcore.prototype._doSpin = function (up, repeating) {
                return false;
            };

            wijinputcore.prototype._stopSpin = function () {
                this.element.data('breakSpinner', true);
                this._repeatingCount = 0;

                var spintimer = this.element.data("spintimer");
                if (spintimer) {
                    clearTimeout(spintimer);
                    this.element.data("spintimer", undefined);
                }
            };

            wijinputcore.prototype._hasComboItems = function () {
                return !!this._getcomboItems() && this._getcomboItems().length;
            };

            wijinputcore.prototype._getcomboItems = function () {
                if (!!this.options.comboItems && this.options.comboItems.length > 0) {
                    return this.options.comboItems;
                }

                return this.options.pickers.list;
            };

            wijinputcore.prototype._getcomboWidth = function () {
                return this.options.comboWidth || this.options.pickers.width;
            };

            wijinputcore.prototype._getcomboHeight = function () {
                return this.options.comboHeight || this.options.pickers.height;
            };

            wijinputcore.prototype._isComboListVisible = function () {
                if (!this._comboDiv) {
                    return false;
                }
                return this._comboDiv.wijpopup('isVisible');
            };

            wijinputcore.prototype._deleteComboDiv = function () {
                if (this._comboDiv == undefined) {
                    return;
                }

                this._comboDiv.wijlist("destroy");
                this._comboDiv.remove();
                delete this._comboDiv;
            };

            wijinputcore.prototype._createComboDiv = function () {
                var _this = this;
                if (this._comboDiv !== undefined) {
                    return;
                }

                this._comboDiv = $("<div></div>").appendTo(document.body).css('position', 'absolute');

                var content = this._normalize(this._getcomboItems());
                this._comboDiv.wijlist({
                    maxItemsCount: 5,
                    selected: function (event, ui) {
                        if (!_this.options.disableUserInput) {
                            _this._setData(ui.item.value);
                        }
                        _this._comboDiv.wijpopup('hide');
                        _this._trySetFocus();
                    }
                });

                this._comboDiv.wijlist('setItems', content);
                this._comboDiv.wijlist('renderList');
            };

            wijinputcore.prototype._popupComboList = function () {
                var _this = this;
                if (!this._hasComboItems()) {
                    return false;
                }
                if (!this._allowEdit()) {
                    return false;
                }

                var divWidth = this.outerDiv.width();
                var comboWidth = this._getcomboWidth();
                var comboHeight = this._getcomboHeight();

                if (this._comboDiv != undefined) {
                    if (comboWidth && parseInt(comboWidth) !== this._comboDiv.width()) {
                        this._deleteComboDiv();
                    }
                }

                this._createComboDiv();

                // dimensions
                this._comboDiv.width(divWidth);
                this._comboDiv.wijlist("option", "autoSize", !comboHeight);
                if (comboHeight) {
                    this._comboDiv.height(comboHeight);
                }
                if (comboWidth) {
                    this._comboDiv.width(comboWidth);
                }

                this._comboDiv.wijlist("refreshSuperPanel");

                this._comboDiv.wijpopup({
                    autoHide: true,
                    hidden: function () {
                        _this._trigger('dropDownClose');
                        _this._wasPopupShowing = false;
                        _this._comboDiv.wijlist("unselectItems");
                        _this._comboDiv.wijlist("deactivate");
                    },
                    shown: function () {
                        _this._trigger('dropDownOpen');
                        _this._wasPopupShowing = true;
                    }
                });

                this.outerDiv.attr('aria-expanded', true);
                this._comboDiv.wijpopup('show', {
                    of: this.outerDiv,
                    offset: '0 4',
                    hidden: function () {
                        _this.outerDiv.attr('aria-expanded', false);
                    }
                });

                return true;
            };

            wijinputcore.prototype._normalize = function (items) {
                // assume all items have the right format when the first item is complete
                if (items.length && items[0].label && items[0].value) {
                    return items;
                }
                return $.map(items, function (item) {
                    if (typeof item === "string") {
                        return {
                            label: item,
                            value: item
                        };
                    }
                    return $.extend({
                        label: item.label || item.value,
                        value: item.value || item.label
                    }, item);
                });
            };

            wijinputcore.prototype._processLeftRightKey = function (isLeft) {
                return false;
            };
            wijinputcore.prototype._processTabKey = function (e) {
                return false;
            };

            wijinputcore.prototype._moveControl = function (currentElement, isForward, isUseLeftRightKey) {
                var elements = CoreUtility.GetElements();
                var ret = null;
                var retInfo = {};
                if (elements.length < 2) {
                    return null;
                }

                var nextElement = CoreUtility.GetNextFocusableControl(currentElement, elements, isForward);
                var self = this;
                setTimeout(function () {
                    CoreUtility.SetElementFocus(nextElement);
                    self._trigger("keyExit");
                }, 0);
            };

            wijinputcore.prototype._processClearButton = function () {
            };
            return wijinputcore;
        })(wijmo.wijmoWidget);
        input.wijinputcore = wijinputcore;
        ;

        var wijinputClass = "wijmo-wijinput", classPrefix = wijinputClass + "-";

        var wijinputcore_options = (function () {
            function wijinputcore_options() {
                this.wijCSS = {
                    wijinput: wijinputClass,
                    wijinputInput: classPrefix + "input",
                    wijinputWrapper: classPrefix + "wrapper",
                    wijinputWrapperSpinnerLeft: classPrefix + "wrapper-spinner-left",
                    wijinputWrapperSpinnerRight: classPrefix + "wrapper-spinner-right",
                    wijinputTrigger: classPrefix + "trigger",
                    wijinputSpinnerLeft: classPrefix + "spinner-left",
                    wijinputSpinnerRight: classPrefix + "spinner-right",
                    wijinputButton: classPrefix + "button",
                    wijinputSpin: classPrefix + "spin",
                    wijinputSpinUp: classPrefix + "spinup",
                    wijinputSpinDown: classPrefix + "spindown",
                    glyphIcon: "glyphicon",
                    glyphIconPlus: "glyphicon-plus",
                    glyphIconMinus: "glyphicon-minus",
                    iconPlus: "ui-icon-plus",
                    iconMinus: "ui-icon-minus"
                };
                /** Determines the input method setting of widget.
                * Possible values are: 'auto', 'active', 'inactive', 'disabled'
                * @remarks
                * This property only take effect on IE and firefox browser.
                */
                this.imeMode = "";
                /** Determines the culture used to show values in the wijinput widget.
                */
                this.culture = '';
                /** Assigns the string value of the culture calendar that appears on the calendar.
                *   This option must work with culture option.
                */
                this.cultureCalendar = '';
                /** The CSS class applied to the widget when an invalid value is entered.
                * @remarks
                * For some property of the css, such as the color, because wijmo has set default style,
                * and it may be has a higher priority, so custom need to user a higher priority than the defualt.
                * @example
                * // This example sets the invalidClass option to "invalid".
                * .wijmo-wijinput.invalid {
                * color: red !important;
                * background-color: green !important;
                * font-size: xx-large;
                * }
                * $(".selector").wijinputcore("option", "invalidClass" "invalid");
                */
                this.invalidClass = $.wijmo.wijCSS.stateError;
                /** Determines the text displayed when the widget is blank and contains no initial text.
                * Obsoleted, use placeholder instead.
                * @ignore
                */
                this.nullText = undefined;
                /** Determines the text displayed when the widget is blank and contains no initial text.
                * @remarks
                * when the option's value is empty, the empty value will display, when the value is null, then the placeholder will not show.
                */
                this.placeholder = undefined;
                /** Shows the nullText value if the widget is blank and loses focus.
                * Obsoleted, when placeholder proerty has value, it will show the placeholder value, else not.
                * @ignore
                */
                this.showNullText = false;
                /** If true, then the browser response is disabled when the ENTER key is pressed.
                */
                this.hideEnter = false;
                /** Determines whether a user can enter a value in the wijinputdate widget.
                * Obsoleted, use readonly instead.
                * @ignore
                */
                this.disableUserInput = false;
                /** Determines whether a user can enter a value in the wijinput widget.
                * If readonly is true, user can't input value to the wijinput widget by ui operation, such as spin, pick value from pickers.
                */
                this.readonly = false;
                /** Determines the side, left or right, where the trigger or spinner buttons appear.
                * Possible values are: 'left', 'right'
                * Obsoleted, Use dropdownButtonAlign instead.
                * @ignore
                */
                this.buttonAlign = null;
                /** Determines the side, left or right, where the dropdown button appear.
                * Possible values are: 'left', 'right'
                */
                this.dropDownButtonAlign = 'right';
                /** Determines whether dropdown button is displayed.
                */
                this.showDropDownButton = false;
                /** Determines whether trigger button is displayed.
                * Obsoleted, use showDropDownButton instead.
                * @ignore
                */
                this.showTrigger = undefined;
                /** Determines whether spinner button is displayed.
                */
                this.showSpinner = false;
                /** Array of data items used to populate the drop-down list.
                * Obsoleted, use picker.list instead.
                * @ignore
                */
                this.comboItems = undefined;
                /** Determines the width of the drop-down list.
                * Obsoleted, use picker.width instead.
                * @ignore
                */
                this.comboWidth = undefined;
                /** Determines the height of the drop-down list.
                * Obsoleted, use picker.height instead.
                * @ignore
                */
                this.comboHeight = undefined;
                /** Determines whether the focus automatically moves to the next or previous
                * tab ordering control when pressing the left, right arrow keys.
                * Possible values are "none", "left", "right", "both".
                * The default value is "none".
                */
                this.blurOnLeftRightKey = "none";
                /** Determines the side, left or right, where the spinner button appear.
                * Possible values are: 'vertialLeft', 'verticalRight', 'horizontalDownLeft', 'horizontalUpLeft'.
                * The default value is 'verticalRight'.
                */
                this.spinnerAlign = "verticalRight";
                /** Determines whether the spin behavior can wrap when reaching a maximum or minimum limit.
                */
                this.allowSpinLoop = false;
                /** An object contains the settings for the dropdown list.
                * @example
                *  $(".selector").wijinputmask({
                *      pickers: {
                *          list: [
                *              { label: 'item1', value: 1 },
                *              { label: 'item2', value: 2 }
                *          ],
                *          width: 100,
                *          height: 130
                *      }
                *  });
                */
                this.pickers = {
                    list: undefined,
                    width: undefined,
                    height: undefined
                };
                /** The dropdownOpen event handler.
                * A function called before the widget's dropdown opened.
                * @event
                */
                this.dropDownOpen = null;
                /** The dropdownClose event handler.
                * A function called before the widget's dropdown closed.
                * @event
                */
                this.dropDownClose = null;
                /** The initializing event handler.
                * A function called before the widget is initialized.
                * @event
                */
                this.initializing = null;
                /** The initialized event handler.
                * A function called after the widget is initialized.
                * @event
                */
                this.initialized = null;
                /** The triggerMouseDown event handler. A function called
                * when the mouse is pressed down on the trigger button.
                * Obsoleted, use dropDownButtonMouseDown instead.
                * @ignore
                * @event
                */
                this.triggerMouseDown = null;
                /** The triggerMouseUp event handler. A function called
                * when the mouse is released on the trigger button.
                * Obsoleted, use dropDownButtonMouseUp instead.
                * @ignore
                * @event
                */
                this.triggerMouseUp = null;
                /** The dropdownButtonMouseDown event handler. A function called
                * when the mouse is pressed down on the dropdown button.
                * @event
                */
                this.dropDownButtonMouseDown = null;
                /** The dropdownButtonMouseUp event handler. A function called
                * when the mouse is released on the dropdown button.
                * @event
                */
                this.dropDownButtonMouseUp = null;
                /** Fired when the widget text is changed.
                * @event
                * @dataKey {String} text The new text.
                */
                this.textChanged = null;
                /** The invalidInput event handler. A function called
                * when invalid charactor is typed.
                * @event
                * @dataKey {String} char The newly input character.
                * @dataKey widget The widget object itself.
                */
                this.invalidInput = null;
                /** Fired when the widget lost focus and caused by the keyboard behavior.
                * @event
                */
                this.keyExit = null;
            }
            return wijinputcore_options;
        })();
        wijinputcore.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijinputcore_options());

        (function (MouseButton) {
            MouseButton[MouseButton["Default"] = -1] = "Default";
            MouseButton[MouseButton["Left"] = 0] = "Left";
            MouseButton[MouseButton["Middle"] = 1] = "Middle";
            MouseButton[MouseButton["Right"] = 2] = "Right";
        })(input.MouseButton || (input.MouseButton = {}));
        var MouseButton = input.MouseButton;
        ;

        /** @ignore */
        var CoreUtility = (function () {
            function CoreUtility() {
            }
            CoreUtility.GetBrowserType = function () {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("msie") != -1)
                    CoreUtility.ie = ua.match(/msie ([\d.]+)/)[1];
                else if (ua.indexOf("chrome") != -1) {
                    CoreUtility.chrome = ua.match(/chrome\/([\d.]+)/)[1];
                } else if (ua.indexOf("safari") != -1) {
                    var version = ua.match(/version\/([\d.]+)/);
                    if (version) {
                        CoreUtility.safari = version[1];
                    }
                } else if (ua.indexOf("firefox") != -1) {
                    CoreUtility.firefox = ua.match(/firefox\/([\d.]+)/)[1];
                } else if (ua.indexOf("opera") != -1) {
                    CoreUtility.opera = ua.match(/opera.([\d.]+)/)[1];
                }

                if (ua.indexOf("ipad") != -1) {
                    CoreUtility.IPad = true;
                }

                // add by Sean Huang at 2008.11.13, for bug 10445 -->
                CoreUtility.engine = null;
                if (window.navigator.appName == "Microsoft Internet Explorer") {
                    // This is an IE browser. What mode is the engine in?
                    if (document.documentMode)
                        CoreUtility.engine = document.documentMode;
                    else {
                        CoreUtility.engine = 5; // Assume quirks mode unless proven otherwise
                        if (document.compatMode) {
                            if (document.compatMode == "CSS1Compat")
                                CoreUtility.engine = 7; // standards mode
                        }
                        if (CoreUtility.ie && CoreUtility.ie.indexOf("6") == 0) {
                            CoreUtility.engine = 6;
                        }
                    }
                    // the engine variable now contains the document compatibility mode.
                }

                if (ua.indexOf("rv:") !== -1 && ua.indexOf("firefox") === -1) {
                    // Support IE 11.
                    CoreUtility.ie = CoreUtility.engine = ua.match(/rv:([\d.]+)/)[1];
                }
            };

            CoreUtility.IsMouseDownOnClearButton = function (evt) {
                if (!CoreUtility.IsIE10OrLater()) {
                    return false;
                }

                for (var i = 0; i < document.styleSheets.length; i++) {
                    var styleSheets = document.styleSheets[i];
                    for (var j = 0; j < styleSheets.cssRules.length; j++) {
                        if (styleSheets.cssRules[j].selectorText == "::-ms-clear") {
                            if (styleSheets.cssRules[j].style.display == "none") {
                                return false;
                            }
                        }
                    }
                }

                var x = evt.offsetX;
                var y = evt.offsetY;
                var textbox = evt.srcElement || evt.target;
                var width = textbox.clientWidth;
                var height = textbox.clientHeight;
                var paddingLeft = parseInt(textbox.currentStyle.paddingLeft);
                var paddingRight = parseInt(textbox.currentStyle.paddingRight);
                if (textbox.readOnly || evt.button != 0 /* Left */) {
                    return false;
                }

                // DaryLuo 2012/09/06 fix bug 576, include padding.
                if (width - height + paddingLeft + paddingRight < CoreUtility.GetClearButtonShowThreshold(textbox)) {
                    return false;
                }
                var xx = width - height;
                if (x > xx && x <= width && y >= 0 && y < height) {
                    return true;
                } else {
                    return false;
                }
            };

            CoreUtility.GetClearButtonShowThreshold = function (textinput) {
                // DaryLuo 2012/11/05 fix bug 861 in IM Web 7.0.
                // Previous I return this function to the harded value 66, in fact, it is incorrect.
                // After researched it, this value should be changed with the font.
                // The changed rule is linear.
                // When the font's unit is pixel, I got the following value.
                // The x indicated font's height, use meature method to get it.
                // The y indicated the clear button's show/hidden threshold value.
                // The I use matlab to get the changed rule. input the following script into matlabe, you will get the result.
                //x=[12 17 23  29 35  40 46 52 58 63 69 75 80],
                //y= [50 75 100 125 150 175 200 225 250 275 300 325 350],
                //p=polyfit(x,y,1),
                //xx=0:.1:100,
                //plot(x,y,'o',xx,polyval(p,xx)) ,poly2sym(p,'x')
                //r = poly2sym(p,'x')
                //vpa(r,8)
                // When the font's unit is Point, I got the following value.
                //x=[8 15 23 31 38 46 54 61 69 77 84],
                //y= [33 67 100 133 167 200 233 267 300 333 367],
                //p=polyfit(x,y,1),
                //xx=0:.1:100,
                //plot(x,y,'o',xx,polyval(p,xx)) ,poly2sym(p,'x')
                //r = poly2sym(p,'x')
                //vpa(r,8)
                var height = CoreUtility.MeasureText("ABCDQ", textinput).Height;
                var result = 4.3604432 * height - 0.76207324;
                result = Math.round(result);
                return result;
            };

            CoreUtility.GetClientOS = function () {
                // Add comments by Yang at 11:04 Sep. 6th 2007
                // For Get os information in firefox is different from IE.
                //var appVersion = navigator.appVersion;
                var appVersion;
                if (!CoreUtility.IsIE()) {
                    var osVersion = navigator.userAgent;
                    var start = osVersion.indexOf("(");
                    var end = osVersion.indexOf(")");
                    appVersion = osVersion.substring(start + 1, end);
                } else {
                    appVersion = navigator.appVersion;
                }

                // End by Yang
                if (appVersion.indexOf("NT 6.0") != -1) {
                    return "vista";
                } else if (appVersion.indexOf("NT 5.2") != -1) {
                    return "win2003";
                } else if (appVersion.indexOf("NT 5.1") != -1) {
                    return "winxp";
                } else if (appVersion.indexOf("NT 5.0") != -1) {
                    return "win2000";
                } else if (appVersion.indexOf("NT 6.1") != -1) {
                    return "Win7";
                } else if (appVersion.indexOf("NT 6.2") != -1) {
                    return "Win8";
                } else if (appVersion.indexOf("NT 6.3") != -1) {
                    // Windows 8.1
                    return "Win8";
                } else if (appVersion.indexOf("Android") != -1) {
                    return "Android";
                }
                return "unknow";
            };

            CoreUtility.MeasureText = function (text, domElement) {
                if (CoreUtility.MeasureElement === undefined) {
                    var div = document.createElement("div");
                    div.style.position = "absolute";
                    div.style.border = "solid 0px";
                    div.style.left = "-100000px";
                    div.style.top = "-100000px";
                    var textNode = window.document.createTextNode("");
                    div.appendChild(textNode);
                    document.body.appendChild(div);
                    CoreUtility.MeasureElement = div;
                    CoreUtility.MeasureTextElement = textNode;
                }
                var div = CoreUtility.MeasureElement;
                var textNode = CoreUtility.MeasureTextElement;

                if (document != null) {
                    var containsElement = document.body.contains(domElement);
                    if (!containsElement) {
                        document.body.appendChild(domElement);
                    }

                    var currentStyle = domElement.currentStyle || window.getComputedStyle(domElement, null);
                    div.style.fontFamily = currentStyle.fontFamily;
                    div.style.fontSize = currentStyle.fontSize;
                    div.style.fontStyle = currentStyle.fontStyle;
                    div.style.fontWeight = currentStyle.fontWeight;

                    if (!containsElement) {
                        document.body.removeChild(domElement);
                    }
                }

                var result = null;
                if (typeof (text) == "string") {
                    textNode.nodeValue = text;
                    result = { Width: div.clientWidth, Height: div.clientHeight };
                } else {
                    result = [];
                    for (var i = 0; i < text.length; i++) {
                        textNode.nodeValue = text[i];
                        result.push({ Width: div.clientWidth, Height: div.clientHeight });
                    }
                }

                return result;
            };

            CoreUtility.SetElementFocus = function (element) {
                element.focus();
            };

            CoreUtility.GetAllElements = function () {
                if (document.body.querySelectorAll) {
                    return document.body.querySelectorAll("button, input, object, select, textarea");
                }
                if (document.body.all) {
                    return document.body.all;
                }
                return document.body.getElementsByTagName("*");
            };

            CoreUtility.GetElements = function () {
                var elements = [];
                var obj = CoreUtility.GetAllElements();
                var index = 0;
                var rfocusable = /^(?:button|input|object|select|textarea)$/i;

                for (var i = 0; i < obj.length; i++) {
                    if ((!document.body.querySelectorAll || CoreUtility.IsIE()) && !rfocusable.test(obj[i].tagName.toLowerCase())) {
                        continue;
                    }

                    var c3 = !obj[i].disabled;
                    var c4 = obj[i].style.visibility !== "hidden";
                    var c5 = obj[i].type != "hidden" && obj[i].tabIndex != -1;
                    var c6 = obj[i].tagName.toLowerCase() == "textarea" && obj[i].tabIndex != -1;
                    var c7 = c5 || c6;

                    if (c3 && c4 && c7) {
                        elements[index++] = obj[i];
                    }
                }

                for (var i = 0; i < elements.length - 1; i++) {
                    for (var j = i + 1; j < elements.length; j++) {
                        if (elements[j].tabIndex < elements[i].tabIndex) {
                            var temp = elements[i];

                            elements[i] = elements[j];
                            elements[j] = temp;
                        }
                    }
                }
                return elements;
            };

            CoreUtility.GetNextFocusableControl = function (currentElement, elements, isForward) {
                if (typeof currentElement === "string") {
                    currentElement = document.getElementById(currentElement);
                }
                var index = 0;
                for (var i = 0; i < elements.length; i++) {
                    if (currentElement === elements[i]) {
                        if (isForward) {
                            index = (i + 1) % (elements.length);
                        } else {
                            index = (i - 1 + elements.length) % (elements.length);
                        }

                        break;
                    }
                }

                return elements[index];
            };

            CoreUtility.MoveFocus = function (curID, isForward) {
                var elements = CoreUtility.GetElements();
                var nextID = CoreUtility.GetNextFocusableControl(curID, elements, isForward);

                CoreUtility.SetElementFocus(nextID);
                return nextID;
            };

            CoreUtility.IsPad = function () {
                var result = CoreUtility.IPad || CoreUtility.GetClientOS().toLowerCase() == "android";
                return result;
            };

            CoreUtility.IsIE = function () {
                return CoreUtility.ie !== undefined;
            };

            CoreUtility.IsFireFox4OrLater = function () {
                return CoreUtility.firefox != null && parseFloat(CoreUtility.firefox) >= 4.0;
            };
            CoreUtility.IsIE11OrLater = function () {
                return CoreUtility.IsIE() && CoreUtility.engine >= 11;
            };
            CoreUtility.IsIE10OrLater = function () {
                return CoreUtility.IsIE() && CoreUtility.engine >= 10;
            };
            CoreUtility.IsIE9OrLater = function () {
                return CoreUtility.IsIE() && CoreUtility.engine >= 9;
            };
            CoreUtility.IsIE8OrLater = function () {
                return CoreUtility.IsIE() && CoreUtility.engine >= 8;
            };
            CoreUtility.IsIE8OrBelow = function () {
                return CoreUtility.IsIE() && CoreUtility.engine <= 8;
            };
            CoreUtility.IsIE8 = function () {
                return CoreUtility.IsIE() && CoreUtility.engine == 8;
            };
            CoreUtility.IsIE7 = function () {
                return CoreUtility.IsIE() && CoreUtility.engine == 7;
            };
            CoreUtility.IsIE7OrLater = function () {
                return CoreUtility.IsIE() && CoreUtility.engine >= 7;
            };

            CoreUtility.IsIE9 = function () {
                return CoreUtility.IsIE() && CoreUtility.engine == 9;
            };
            return CoreUtility;
        })();
        input.CoreUtility = CoreUtility;
        CoreUtility.GetBrowserType();
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
