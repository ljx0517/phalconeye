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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="../Base/jquery.wijmo.widget.ts"/>
    /// <reference path="../wijutil/jquery.wijmo.wijutil.ts" />
    /// <reference path="../External/declarations/jquery.bgiframe.d.ts" />
    /*globals window,document,jQuery*/
    /*
    * Depends:
    *	jquery.ui.core.js
    *	jquery.ui.widget.js
    *	jquery.ui.resizable.js
    *	jquery.ui.mouse.js
    *	jquery.wijmo.wijutil.js
    *
    */
    (function (_dialog) {
        "use strict";
        var $ = jQuery, widgetName = "wijdialog";

        /** @widget */
        var JQueryUIDialog = (function (_super) {
            __extends(JQueryUIDialog, _super);
            function JQueryUIDialog() {
                _super.apply(this, arguments);
            }
            JQueryUIDialog.prototype._create = function () {
                return $.ui.dialog.prototype._create.apply(this, arguments);
            };
            JQueryUIDialog.prototype._init = function () {
                return $.ui.dialog.prototype._init.apply(this, arguments);
            };
            JQueryUIDialog.prototype._destroy = function () {
                return $.ui.dialog.prototype._destroy.apply(this, arguments);
            };
            JQueryUIDialog.prototype._appendTo = function () {
                return $.ui.dialog.prototype._appendTo.apply(this, arguments);
            };
            JQueryUIDialog.prototype._setOptions = function () {
                return $.ui.dialog.prototype._setOptions.apply(this, arguments);
            };
            JQueryUIDialog.prototype._setOption = function (key, value) {
                return $.ui.dialog.prototype._setOption.apply(this, arguments);
            };

            /** Returns a jQuery object containing the generated wrapper. */
            JQueryUIDialog.prototype.widget = function () {
                return $.ui.dialog.prototype.widget.apply(this, arguments);
            };

            /** Closes the dialog. */
            JQueryUIDialog.prototype.close = function () {
                return $.ui.dialog.prototype.close.apply(this, arguments);
            };

            /** Whether the dialog is currently open. */
            JQueryUIDialog.prototype.isOpen = function () {
                return $.ui.dialog.prototype.isOpen.apply(this, arguments);
            };

            /** Moves the dialog to the top of the dialog stack. */
            JQueryUIDialog.prototype.moveToTop = function () {
                return $.ui.dialog.prototype.moveToTop.apply(this, arguments);
            };
            JQueryUIDialog.prototype._moveToTop = function () {
                return $.ui.dialog.prototype._moveToTop.apply(this, arguments);
            };

            /** Opens the dialog. */
            JQueryUIDialog.prototype.open = function () {
                return $.ui.dialog.prototype.open.apply(this, arguments);
            };

            JQueryUIDialog.prototype._focusTabbable = function () {
                return $.ui.dialog.prototype._focusTabbable.apply(this, arguments);
            };
            JQueryUIDialog.prototype._keepFocus = function () {
                return $.ui.dialog.prototype._keepFocus.apply(this, arguments);
            };
            JQueryUIDialog.prototype._createWrapper = function () {
                return $.ui.dialog.prototype._createWrapper.apply(this, arguments);
            };

            JQueryUIDialog.prototype._createTitlebar = function () {
                return $.ui.dialog.prototype._createTitlebar.apply(this, arguments);
            };
            JQueryUIDialog.prototype._title = function () {
                return $.ui.dialog.prototype._title.apply(this, arguments);
            };
            JQueryUIDialog.prototype._createButtonPane = function () {
                return $.ui.dialog.prototype._createButtonPane.apply(this, arguments);
            };
            JQueryUIDialog.prototype._createButtons = function () {
                return $.ui.dialog.prototype._createButtons.apply(this, arguments);
            };
            JQueryUIDialog.prototype._makeDraggable = function () {
                return $.ui.dialog.prototype._makeDraggable.apply(this, arguments);
            };

            JQueryUIDialog.prototype._makeResizable = function () {
                return $.ui.dialog.prototype._makeResizable.apply(this, arguments);
            };
            JQueryUIDialog.prototype._minHeight = function () {
                return $.ui.dialog.prototype._minHeight.apply(this, arguments);
            };

            JQueryUIDialog.prototype._position = function () {
                return $.ui.dialog.prototype._position.apply(this, arguments);
            };

            JQueryUIDialog.prototype._size = function () {
                return $.ui.dialog.prototype._size.apply(this, arguments);
            };

            JQueryUIDialog.prototype._blockFrames = function () {
                return $.ui.dialog.prototype._blockFrames.apply(this, arguments);
            };
            JQueryUIDialog.prototype._unblockFrames = function () {
                return $.ui.dialog.prototype._unblockFrames.apply(this, arguments);
            };

            JQueryUIDialog.prototype._createOverlay = function () {
                return $.ui.dialog.prototype._createOverlay.apply(this, arguments);
            };

            JQueryUIDialog.prototype._destroyOverlay = function () {
                return $.ui.dialog.prototype._destroyOverlay.apply(this, arguments);
            };

            JQueryUIDialog.prototype._trackFocus = function () {
                var eleParent;
                this._on(this.widget(), {
                    "focusin": function (event) {
                        this._untrackInstance();
                        this._trackingInstances().unshift(this);
                        eleParent = $(event.target).parents(".ui-dialog-content");

                        // only save the element in dialog content: jquery ui dialog has only one close
                        // button; wijdialog has six buttons on dialog
                        if (eleParent && eleParent.length > 0) {
                            this._focusedElement = $(event.target);
                        }
                    }
                });
            };
            return JQueryUIDialog;
        })(wijmo.JQueryUIWidget);
        _dialog.JQueryUIDialog = JQueryUIDialog;

        var wijdialog_options = (function () {
            function wijdialog_options() {
                /** wijcheckbox css, extend from $.wijmo.wijCSS
                * @ignore
                */
                this.wijCSS = {
                    wijdialog: "wijmo-wijdialog",
                    wijdialogZone: "wijmo-wijdialog-defaultdockingzone",
                    uiFront: "ui-front",
                    uiDialog: "ui-dialog",
                    wijdialogOverlay: "ui-dialog-overlay",
                    uiDialogContent: "ui-dialog-content",
                    wijdialogCaptionButton: "wijmo-wijdialog-captionbutton",
                    wijdialogHasFrame: "wijmo-wijdialog-hasframe",
                    iconPinW: "ui-icon-pin-w",
                    iconPinS: "ui-icon-pin-s",
                    iconRefresh: "ui-icon-refresh",
                    iconCarat1N: "ui-icon-carat-1-n",
                    iconCarat1S: "ui-icon-carat-1-s",
                    iconMinus: "ui-icon-minus",
                    iconExtlink: "ui-icon-extlink",
                    iconNewWin: "ui-icon-newwin",
                    uiDialogClose: "ui-dialog-titlebar-close",
                    uiDialogTitleBar: "ui-dialog-titlebar",
                    uiDialogButtonPanel: "ui-dialog-buttonpane",
                    uiDialogButtons: "ui-dialog-buttons",
                    wijdialogTitleBarClose: "",
                    wijdialogTitleBarPin: "",
                    wijdialogTitleBarRefresh: "",
                    wijdialogTitleBarToggle: "",
                    wijdialogTitleBarMinimize: "",
                    wijdialogTitleBarMaximize: "",
                    wijdialogTitleBarRestore: ""
                };
                /**
                * Which element the dialog (and overlay, if modal) should be appended to.
                */
                this.appendTo = "body";
                /**
                * If set to true, the dialog will automatically open upon initialization. If false, the dialog will stay hidden until the open() method is called.
                */
                this.autoOpen = true;
                /**
                * Specifies which buttons should be displayed on the dialog. The context of the callback is the dialog element; if you need access to the button, it is available as the target of the event object.
                * @type {obejct|array}
                */
                this.buttons = [];
                /**
                * Specifies whether the dialog should close when it has focus and the user presses the esacpe (ESC) key.
                */
                this.closeOnEscape = true;
                /**
                * Specifies the text for the close button. Note that the close text is visibly hidden when using a standard theme.
                */
                this.closeText = "Close";
                /**
                * The specified class name(s) will be added to the dialog, for additional theming.
                */
                this.dialogClass = "";
                /**
                * If set to true, the dialog will be draggable by the title bar. Requires the jQuery UI Draggable widget to be included.
                */
                this.draggable = true;
                /**
                * The height of the dialog.
                * @type {number|string}
                */
                this.height = "auto";
                /**
                * If and how to animate the hiding of the dialog.
                * @type {number|string|object}
                * @remarks
                * Multiple types supported:
                * Number: The dialog will fade out while animating the height and width for the specified duration.
                * String: The dialog will be hidden using the specified jQuery UI effect. See the list of effects for possible values.
                * Object: If the value is an object, then effect, delay, duration, and easing properties may be provided. The effect property must be the name of a jQuery UI effect. When using a jQuery UI effect that supports additional settings, you may include those settings in the object and they will be passed to the effect. If duration or easing is omitted, then the default values will be used. If delay is omitted, then no delay is used.
                */
                this.hide = null;
                /**
                * The maximum height to which the dialog can be resized, in pixels.
                * @type {number}
                */
                this.maxHeight = null;
                /**
                * The maximum width to which the dialog can be resized, in pixels.
                * @type {number}
                */
                this.maxWidth = null;
                /**
                * The minimum height to which the dialog can be resized, in pixels.
                */
                this.minHeight = 150;
                /**
                * The minimum width to which the dialog can be resized, in pixels.
                */
                this.minWidth = 150;
                /**
                * If set to true, the dialog will have modal behavior; other items on the page will be disabled, i.e., cannot be interacted with. Modal dialogs create an overlay below the dialog but above other page elements.
                */
                this.modal = false;
                /**
                * Specifies where the dialog should be displayed. The dialog will handle collisions such that as much of the dialog is visible as possible.
                * @type {string|array|object}
                * @remarks
                * Multiple types supported:
                * Object: Identifies the position of the dialog when opened. The of option defaults to the window, but you can specify another element to position against. You can refer to the jQuery UI Position utility for more details about the various options.
                * String: A string representing the position within the viewport. Possible values: "center", "left", "right", "top", "bottom".
                * Array: An array containing an x, y coordinate pair in pixel offset from the top left corner of the viewport or the name of a possible string value.
                */
                this.position = { my: "center", at: "center", of: window };
                /**
                * If set to true, the dialog will be resizable. Requires the jQuery UI Resizable widget to be included.
                */
                this.resizable = true;
                /**
                * If and how to animate the showing of the dialog.
                * @type {number|string|object}
                * @remarks
                * Number: The dialog will fade in while animating the height and width for the specified duration.
                * String: The dialog will be shown using the specified jQuery UI effect. See the list of effects for possible values.
                * Object: If the value is an object, then effect, delay, duration, and easing properties may be provided. The effect property must be the name of a jQuery UI effect. When using a jQuery UI effect that supports additional settings, you may include those settings in the object and they will be passed to the effect. If duration or easing is omitted, then the default values will be used. If delay is omitted, then no delay is used.
                */
                this.show = null;
                /**
                * Specifies the title of the dialog. If the value is null, the title attribute on the dialog source element will be used.
                * @type {string}
                */
                this.title = null;
                /**
                * The width of the dialog, in pixels.
                */
                this.width = 300;
                /*
                * Specifies whether the dialog will stack on top of other dialogs.
                * This will cause the dialog to move to the front of other dialogs when it gains focus.
                */
                this.stack = true;
                /**
                * Triggered when a dialog is about to close. If canceled, the dialog will not close.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                */
                this.beforeClose = null;
                /**
                * Triggered when the dialog is closed.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                */
                this.close = null;
                /**
                * Triggered when the dialog is created.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                */
                this.create = null;
                /**
                * Triggered while the dialog is being dragged.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                */
                this.drag = null;
                /**
                * Triggered when the user starts dragging the dialog.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                */
                this.dragStart = null;
                /**
                * Triggered after the dialog has been dragged.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                */
                this.dragStop = null;
                /**
                * Triggered when the dialog gains focus.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                */
                this.focus = null;
                /**
                * Triggered when the dialog is opened.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                */
                this.open = null;
                /**
                * Triggered while the dialog is being resized.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ResizeEventArgs} ui Information about an event.
                */
                this.resize = null;
                /**
                * Triggered when the user starts resizing the dialog.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ResizeEventArgs} ui Information about an event.
                */
                this.resizeStart = null;
                /**
                * Triggered after the dialog has been resized.
                * @event
                * @param {jQuery.Event} e Standard jQuery event object
                * @param {ResizeEventArgs} ui Information about an event.
                */
                this.resizeStop = null;
                /** This option specifies the starting z-index for the dialog.
                * @example
                * $("selector").wijdialog({zIndex: 2000});
                */
                this.zIndex = 1000;
                /** Selector option for auto self initialization.
                *	This option is internal.
                * @ignore
                */
                this.initSelector = "";
                /** The captionButtons option determines the caption buttons to show on the wijdialog title bar.
                * @type {object}
                * @remarks
                * The default value for this option is:
                * {
                * pin: {visible: true, click: self.pin, title: "Pin",
                * iconClassOn: "ui-icon-pin-w", iconClassOff:"ui-icon-pin-s"},
                * refresh: {visible: true, click: self.refresh, title: "Refresh",
                * iconClassOn: "ui-icon-refresh"},
                * toggle: {visible: true, click: self.toggle, title: "Toggle"},
                * minimize: {visible: true, click: self.minimize, title: "Minimize",
                * iconClassOn: "ui-icon-minus"},
                * maximize: {visible: true, click: self.maximize, title: "Maximize",
                * iconClassOn: "ui-icon-extlink"},
                * close: {visible: true, click: self.close,  title: "Close",
                * iconClassOn: "ui-icon-close"}
                * };
                * Each button is represented by an object in this object.
                * property name: The name of the button.
                * visible: A value specifies whether this button is visible.
                * click: The event handler to handle the click event of this button.
                * iconClassOn: Icon for normal state.
                * iconClassOff: Icon after clicking.
                * @example
                * $("selector").wijdialog({captionButtons: {
                * pin: { visible: false },
                * refresh: { visible: false },
                * toggle: { visible: false },
                * minimize: { visible: false },
                * maximize: { visible: false }
                * }
                * });
                */
                this.captionButtons = {};
                /** The collapsingAnimation option determines the animation effect that is used when the wijdialog is collapsed.
                * @type {object}
                * @example
                * $("selector").wijdialog({collapsingAnimation:
                * { effect: "puff", duration: 300, easing: "easeOutExpo" }
                * });
                */
                this.collapsingAnimation = null;
                /** The expandingAnimation option determines the animation effect that is used when the wijdialog is expanded.
                * @type {object}
                * @example
                * $("selector").wijdialog({expandingAnimation:
                * { effect: "puff", duration: 300, easing: "easeOutExpo" }
                * });
                */
                this.expandingAnimation = null;
                /** This option specifies the URL for the iframe element inside wijdialog.
                * @example
                * $("selector").wijdialog({contentUrl: 'http://www.google.com'});
                */
                this.contentUrl = "";
                /** The minimizeZoneElementId option specifies the ID of the DOM element to dock to when wijdialog is minimized.
                * @example
                * $("selector").wijdialog({minimizeZoneElementId: "zoomId"});
                */
                this.minimizeZoneElementId = "";
                /** The buttonCreating event is called before the caption buttons are created.
                * It can be used to change the array of the buttons or to change, add, or remove buttons from the title bar.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data Buttons array that will be created.
                */
                this.buttonCreating = null;
                /** The stateChanged event is called when the dialog state ("maximized", "minimized", "normal") is changed.
                * @event
                * @dataKey {string} originalState The original state of the dialog box.
                * @dataKey {string} state The current state of the dialog box.
                */
                this.stateChanged = null;
                /** The blur event is called when the dialog widget loses focus.
                * @event
                * @dataKey {DOMElement} el The DOM element of this dialog.
                */
                this.blur = null;
            }
            return wijdialog_options;
        })();

        var titlebarButtonClassPrefix = "wijmo-wijdialog-titlebar-", effects = ["blind", "bounce", "clip", "drop", "explode", "fold", "size", "shake", "slide", "transfer"];

        /** @widget
        * @extends jQuery.ui.dialog
        */
        var wijdialog = (function (_super) {
            __extends(wijdialog, _super);
            function wijdialog() {
                _super.apply(this, arguments);
            }
            wijdialog.prototype._create = function () {
                var self = this, o = self.options, wijCSS = o.wijCSS, ele = self.element, toolTip = ele.attr("title");

                self.buttonKeys = {};
                $.ui.dialog.maxZ = $.ui.dialog.maxZ || 100;

                //Add id for bind/unbind window events.
                ele.uniqueId();

                //Add support for jUICE!
                if ($.isArray(o.buttons)) {
                    $.each(o.buttons, function (idx, value) {
                        var c = value.click;
                        if (c && (typeof c === "string") && window[c]) {
                            value.click = window[c];
                        }
                    });
                }

                //end
                self.form = ele.closest("form[id]"); // for asp.net

                _super.prototype._create.call(this);
                self._replaceClasses(ele, ["ui-dialog-content", "ui-widget-content"], [wijCSS.uiDialogContent, wijCSS.content]);

                //remove the base class's CSS class.  added it using wijCSS.
                self._replaceClasses(self.uiDialog, ["ui-dialog", "ui-widget", "ui-widget-content", "ui-corner-all", "ui-front"], [wijCSS.uiDialog, wijCSS.widget, wijCSS.content, wijCSS.cornerAll, wijCSS.uiFront, wijCSS.wijdialog, self.options.dialogClass]);

                if (toolTip) {
                    self.uiDialog.attr("title", toolTip);
                }

                self._replaceClasses(self.uiDialogTitlebar, ["ui-dialog-titlebar", "ui-widget-header", "ui-corner-all", "ui-helper-clearfix"], [wijCSS.uiDialogTitleBar, wijCSS.header, wijCSS.cornerAll, wijCSS.helperClearFix]);

                self._initWijWindow();
                self._bindWindowResize();
                self._attachDraggableResizableEvent();
                self._originalPosition = o.position;

                self.uiDialog.css({
                    zIndex: o.zIndex
                });
                self.isPin = false;

                self._initialCloseOption();

                self._bindFormOnSubimt();
            };

            wijdialog.prototype._bindFormOnSubimt = function () {
                var self = this;

                if (self.options.appendTo !== "body" || self.form.length === 0) {
                    return;
                }

                //move the dialog to the form so that the data of form elements can be submit.
                self.formOnSubmit = (self.form)[0].onsubmit;
                (self.form)[0].onsubmit = function () {
                    if (self.minimized) {
                        // If the dialog is minimized, the "uiDialog" will be wrappered by an container
                        // which will insure the dialog being placed at the left-bottom corner.
                        self.uiDialog.parent().appendTo(self.form);
                    } else {
                        self.uiDialog.appendTo(self.form);
                    }
                    return (!self.formOnSubmit) ? true : self.formOnSubmit();
                };

                //bind click event to the submit button to submit the form
                self.uiDialog.find("input[type='submit'], button[type='submit']").on('click.wijdialog', function () {
                    self.form.submit();
                });
            };

            wijdialog.prototype._unbindFormOnSubmit = function () {
                var self = this;

                if (self.options.appendTo !== "body" || self.form.length === 0) {
                    return;
                }

                self.uiDialog.find("input[type='submit'], button[type='submit']").off('click.wijdialog');
                (self.form)[0].onsubmit = null;
                if (self.formOnSubmit) {
                    (self.form)[0].onsubmit = self.formOnSubmit;
                }
            };

            wijdialog.prototype._replaceClasses = function (ele, originClasses, wijClasses) {
                ele.removeClass(originClasses.join(" ")).addClass(wijClasses.join(" "));
            };

            wijdialog.prototype._createButtonPane = function () {
                var self = this, wijCSS = self.options.wijCSS;
                _super.prototype._createButtonPane.call(this);
                self._replaceClasses(self.uiDialogButtonPane, ["ui-dialog-buttonpane", "ui-widget-content", "ui-helper-clearfix"], [wijCSS.uiDialogButtonPanel, wijCSS.content, wijCSS.helperClearFix]);
            };

            wijdialog.prototype._createButtons = function () {
                _super.prototype._createButtons.call(this);
                if (this.uiDialog.hasClass("ui-dialog-buttons")) {
                    this._replaceClasses(this.uiDialog, ["ui-dialog-buttons"], [this.options.wijCSS.uiDialogButtons]);
                }
            };

            wijdialog.prototype._makeDraggable = function () {
                _super.prototype._makeDraggable.call(this);

                var cancelResult = this.uiDialog.draggable("option", "cancel");
                if (!cancelResult) {
                    cancelResult = "";
                }
                cancelResult += ((cancelResult === "" ? "." : ", .") + this.options.wijCSS.wijdialogCaptionButton + ", " + "input");
                this.uiDialog.draggable("option", "cancel", cancelResult);
            };

            wijdialog.prototype._createOverlay = function () {
                var self = this, wijCSS = this.options.wijCSS;
                _super.prototype._createOverlay.call(this);
                if (self.overlay) {
                    self._replaceClasses(self.overlay, ["ui-widget-overlay", "ui-front", "ui-dialog-overlay"], [wijCSS.overlay, wijCSS.uiFront, wijCSS.wijdialogOverlay]);
                }
            };

            wijdialog.prototype._handleDisabledOption = function (disabled) {
                var self = this;

                self.uiDialog.removeClass(self.options.wijCSS.stateDisabled);
                if (disabled) {
                    if (!self.disabledDiv) {
                        self.disabledDiv = self._createDisabledDiv();
                    }
                    self.disabledDiv.appendTo(self.options.appendTo);
                    if ($.browser.msie && self.uiDialog.data("ui-draggable")) {
                        self.uiDialog.draggable("disable");
                    }
                    this.uiDialog.addClass(this.options.wijCSS.stateDisabled);
                } else {
                    self._destroyDisabledDiv();
                    if ($.browser.msie && self.uiDialog.data("ui-draggable")) {
                        self.uiDialog.draggable("enable");
                    }
                }
            };

            wijdialog.prototype._createDisabledDiv = function () {
                var self = this, div, ele = self.uiDialog, eleOffset = ele.offset(), disabledWidth = ele.outerWidth(), disabledHeight = ele.outerHeight();

                div = $("<div></div>").addClass(self.options.wijCSS.stateDisabled).css({
                    "z-index": "99999",
                    position: "absolute",
                    width: disabledWidth,
                    height: disabledHeight,
                    left: eleOffset.left,
                    top: eleOffset.top
                });

                if ($.browser.msie) {
                    div.css("background-color", "white");
                    if ($.browser.version === "9.0") {
                        div.css("opacity", "0.1");
                    }
                }
                return div;
            };

            wijdialog.prototype._destroyDisabledDiv = function () {
                var self = this;
                if (self.disabledDiv) {
                    self.disabledDiv.remove();
                    self.disabledDiv = null;
                }
            };

            wijdialog.prototype._sizeDisabledDiv = function () {
                var self = this, dialog = self.uiDialog;
                if (self.disabledDiv) {
                    self.disabledDiv.css({
                        width: dialog.outerWidth(true),
                        height: dialog.outerHeight(true)
                    });
                }
            };

            wijdialog.prototype._positionDisabledDiv = function () {
                var self = this, offset = self.uiDialog.offset();
                if (self.disabledDiv) {
                    self.disabledDiv.css({
                        left: offset.left,
                        top: offset.top
                    });
                }
            };

            wijdialog.prototype._size = function () {
                _super.prototype._size.call(this);
                this._sizeDisabledDiv();
            };

            wijdialog.prototype._destroyResizable = function () {
                if (this.options.resizable && $.fn.resizable) {
                    this.uiDialog.resizable("destroy");
                }
            };

            wijdialog.prototype._destroyDraggable = function () {
                if (this.options.draggable && $.fn.draggable) {
                    this.uiDialog.draggable("destroy");
                }
            };

            wijdialog.prototype._unbindCaptionButtons = function () {
                var self = this, wijCSS = self.options.wijCSS, captionButtons = $("." + wijCSS.wijdialogCaptionButton, self.uiDialog);

                if (captionButtons && captionButtons.length > 0) {
                    captionButtons.off().remove();
                }
            };

            wijdialog.prototype._clearVariables = function () {
                var self = this;

                self._originalPosition = undefined;
                self.uiDialog = undefined;
                self.isPin = undefined;
                self.disabledDiv = undefined;
                self.innerFrame = undefined;
                self.uiDialogButtonPane = undefined;
                self.contentWrapper = undefined;
                self.form = undefined;
                self.toggleHeight = undefined;
                self.minimized = undefined;
                self.collapsed = undefined;
                self.maximized = undefined;
                self._toggleHeight = undefined;
                self.normalState = undefined;
                self.initWidth = undefined;
                self.initHeight = undefined;
                self.copy = undefined;
                self._isOpen = undefined;
                self.formOnSubmit = undefined;
                self.opener = undefined;
                self.document = undefined;
                if (self.buttonKeys) {
                    $.each(self.buttonKeys, function (key) {
                        if (self[key]) {
                            self[key] = undefined;
                        }
                    });
                    self.buttonKeys = undefined;
                }
                self.uiDialogTitlebar = undefined;
            };

            /**
            * Removes the wijdialog functionality completely. This returns the element to its pre-init state.
            */
            wijdialog.prototype.destroy = function () {
                var self = this, wijCSS = self.options.wijCSS;

                //Add for support disabled option at 2011/7/8
                self._destroyDisabledDiv();

                //end for disabled option
                self._unbindFormOnSubmit();
                self.uiDialog.unbind(".wijdialog");
                self._unbindWindowResize();
                self._destoryIframeMask();

                //remove id added uniqueId()
                self.element.removeUniqueId();

                //remove saved scroll attribute.
                self.element.removeAttr("scrollTop").removeAttr("scrollLeft");
                self._destroyResizable();
                self._destroyDraggable();
                self._unbindCaptionButtons();

                _super.prototype.destroy.call(this);
                self.element.removeClass(wijCSS.uiDialogContent).removeClass(wijCSS.content);
                self.element.unbind(".wijdialog").removeData('wijdialog').removeData(this.widgetFullName);
                self._clearVariables();
            };

            wijdialog.prototype._attachDraggableResizableEvent = function () {
                var self = this, uiDialog = self.uiDialog, o = self.options;
                if (o.draggable && uiDialog.draggable) {
                    uiDialog.bind("dragstop.wijdialog", function (event) {
                        self._saveNormalState();
                        self._destoryIframeMask();
                    }).bind("dragstart.wijdialog", function (event) {
                        self._createIframeMask();
                    });
                }
                if (o.resizable && uiDialog.resizable) {
                    uiDialog.bind("resizestop.wijdialog", function (event) {
                        self._saveNormalState();
                        self._destoryIframeMask();
                    }).bind("resizestart.wijdialog", function (event) {
                        self._createIframeMask();

                        // when first resize the element, save the init width and height.
                        if (self.initWidth === undefined && self.initHeight === undefined) {
                            self.initWidth = self.uiDialog.width();
                            self.initHeight = self.uiDialog.height();
                        }
                    });
                }
            };

            //fixed iframe bug.
            wijdialog.prototype._createIframeMask = function () {
                var self = this;
                if (self.innerFrame) {
                    self.mask = $("<div style='width:100%;height:100%;position:absolute;" + "top:0px;left:0px;z-index:" + ($.ui.dialog.maxZ + 1) + "'></div>").appendTo(self.uiDialog);
                }
            };

            wijdialog.prototype._destoryIframeMask = function () {
                var self = this;
                if (self.innerFrame && self.mask) {
                    self.mask.remove();
                    self.mask = undefined;
                }
            };

            wijdialog.prototype._initWijWindow = function () {
                var self = this, isIn = true;
                self._createCaptionButtons();
                self._checkUrl();

                self.uiDialog.bind("mousedown.wijdialog", function (event) {
                    var el = event.target;
                    if (!$.contains(self.element[0], el) && !($(el).closest("." + self.options.wijCSS.wijdialogCaptionButton).length > 0)) {
                        self.uiDialog.focus();
                    }
                }).bind("mouseenter.wijdialog", function (event) {
                    isIn = true;
                }).bind("mouseleave.wijdialog", function (event) {
                    isIn = false;
                }).bind("focusout.wijdialog", function (event) {
                    if (!isIn) {
                        self._trigger("blur", event, {
                            el: self.element
                        });
                    }
                });
            };

            wijdialog.prototype._moveToTop = function (event, force) {
                var self = this, options = self.options, saveScroll;

                if ((options.modal && !force) || (!options.stack && !options.modal)) {
                    self._trigger('focus', event);

                    //Fixed an issue that in latest jQuery UI dialog, this method will return boolean value.
                    // if the dialog has changed in DOM tree, this method will return true.
                    // and when mouse down inside of the dialog, it will according the return value to auto focus
                    // the first focusable element in dialog. If I click a dropdown(the dropdown element is not
                    // the first focusable element in dialog), it will set the first focusable element to focus.
                    // In this case, I can't select the dropdown value.
                    return false;
                }

                if (options.zIndex > $.ui.dialog.maxZ) {
                    $.ui.dialog.maxZ = options.zIndex;
                }
                if (self.overlay) {
                    $.ui.dialog.maxZ += 1;
                    self.overlay.css('z-index', $.ui.dialog.maxZ);
                }

                //Save and then restore scroll since Opera 9.5+ resets when parent z-Index is changed.
                //  http://ui.jquery.com/bugs/ticket/3193
                saveScroll = {
                    scrollTop: self.element.scrollTop(),
                    scrollLeft: self.element.scrollLeft()
                };
                $.ui.dialog.maxZ += 1;
                self.uiDialog.css('z-index', $.ui.dialog.maxZ);
                self.element.attr(saveScroll);
                self._trigger('focus', event);

                //Fixed an issue that in latest jQuery UI dialog, this method will return boolean value.
                // if the dialog has changed in DOM tree, this method will return true.
                // and when mouse down inside of the dialog, it will according the return value to auto focus
                // the first focusable element in dialog. If I click a dropdown(the dropdown element is not
                // the first focusable element in dialog), it will set the first focusable element to focus.
                // In this case, I can't select the dropdown value.
                return false;
            };

            wijdialog.prototype._checkUrl = function () {
                var self = this, o = self.options, url = o.contentUrl, innerFrame = $('<iframe style="width:100%;height:99%;" frameborder="0"></iframe>');

                if (typeof url === "string" && url.length > 0) {
                    self.element.addClass(o.wijCSS.wijdialogHasFrame);
                    self.element.append(innerFrame);
                    self.innerFrame = innerFrame;
                }
                self.contentWrapper = self.element;
            };

            wijdialog.prototype._setOption = function (key, value) {
                var self = this, oldDisabled = self._isDisabled(), newDisabled;

                _super.prototype._setOption.call(this, key, value);

                if (key === "disabled") {
                    self.options.disabled = value;
                    newDisabled = self._isDisabled();
                    if (oldDisabled === newDisabled) {
                        return;
                    }

                    self._handleDisabledOption(newDisabled);
                } else if (key === "contentUrl") {
                    if (self.getState() === "minimized") {
                        return;
                    }
                    if (self.innerFrame) {
                        self.innerFrame.attr("src", value);
                    } else {
                        self._checkUrl();
                        self.innerFrame.attr("src", value);
                    }
                } else if (key === "captionButtons") {
                    self._createCaptionButtons();
                } else if (key === "minimizeZoneElementId") {
                    if (self.getState() === "minimized" && $("#" + value).length > 0) {
                        $("#" + value).append(self.uiDialog);
                    }
                } else if (key === "stack") {
                    if (!value) {
                        self.uiDialog.css('z-index', self.options.zIndex);
                    }
                } else if (key === "close") {
                    self._initialCloseOption();
                }
            };

            wijdialog.prototype._createCaptionButtons = function () {
                var captionButtons = [], self = this, o = self.options, i, wijCSS = o.wijCSS, buttons = {
                    pin: {
                        visible: true,
                        click: self.pin,
                        title: "Pin",
                        iconClassOn: wijCSS.iconPinW,
                        iconClassOff: wijCSS.iconPinS
                    },
                    refresh: {
                        visible: true,
                        click: self.refresh,
                        title: "Refresh",
                        iconClassOn: wijCSS.iconRefresh
                    },
                    toggle: {
                        visible: true,
                        click: self.toggle,
                        title: "Toggle",
                        iconClassOn: wijCSS.iconCarat1N,
                        iconClassOff: wijCSS.iconCarat1S
                    },
                    minimize: {
                        visible: true,
                        click: self.minimize,
                        title: "Minimize",
                        iconClassOn: wijCSS.iconMinus
                    },
                    maximize: {
                        visible: true,
                        click: self.maximize,
                        title: "Maximize",
                        iconClassOn: wijCSS.iconExtlink
                    },
                    close: {
                        visible: true,
                        text: o.closeText,
                        click: self.close,
                        title: "Close",
                        iconClassOn: wijCSS.iconClose
                    }
                }, oCaptionButtons = o.captionButtons, uiDialogTitlebar = self.uiDialogTitlebar, btns = uiDialogTitlebar.children("." + o.wijCSS.uiDialogClose + ", ." + o.wijCSS.wijdialogCaptionButton);

                if (self._off) {
                    self._off(btns, "click");
                }
                btns.remove();

                $.each(buttons, function (name, value) {
                    if (oCaptionButtons && oCaptionButtons[name]) {
                        $.extend(value, oCaptionButtons[name]);
                    }
                    captionButtons.push({ button: name, info: value });
                });
                self._trigger("buttonCreating", null, captionButtons);
                for (i = 0; i < captionButtons.length; i++) {
                    self._createCaptionButton(captionButtons[i], uiDialogTitlebar);
                }
            };

            wijdialog.prototype._createCaptionButton = function (buttonHash, uiDialogTitlebar, notAppendToHeader) {
                var self = this, wijCSS = self.options.wijCSS, buttonObject, button = uiDialogTitlebar.children("." + titlebarButtonClassPrefix + buttonHash.button), info = buttonHash.info, buttonIcon = $("<span></span>"), buttonName = buttonHash.button + "Button";

                if (info.visible) {
                    if (button.size() === 0) {
                        buttonIcon.addClass([wijCSS.icon, info.iconClassOn].join(" ")).text(info.text || buttonHash.button);
                        buttonObject = $('<a href="#"></a>').append(buttonIcon).addClass([
                            titlebarButtonClassPrefix + buttonHash.button, wijCSS["wijdialogTitleBar" + buttonHash.button.charAt(0).toUpperCase() + buttonHash.button.substring(1)],
                            wijCSS.cornerAll, wijCSS.wijdialogCaptionButton].join(" ")).attr("role", "button").attr("title", info.title ? info.title : "").hover(function () {
                            buttonObject.addClass(wijCSS.stateHover);
                        }, function () {
                            buttonObject.removeClass(wijCSS.stateHover);
                        }).click(function (event) {
                            if (buttonIcon.hasAllClasses(info.iconClassOff)) {
                                buttonIcon.removeClass(info.iconClassOff);
                            } else {
                                buttonIcon.addClass(info.iconClassOff);
                            }
                            if ($.isFunction(info.click)) {
                                info.click.apply(self, arguments);
                            }
                            return false;
                        });
                        if (notAppendToHeader) {
                            return buttonObject;
                        } else {
                            buttonObject.appendTo(uiDialogTitlebar);
                        }
                    }
                    self[buttonName] = buttonObject;
                    self.buttonKeys[buttonName] = true;
                } else {
                    button.remove();
                }
            };

            /**
            * The pin method prevents the wijdialog from being moved.
            */
            wijdialog.prototype.pin = function () {
                var self = this, drag = self.isPin, buttonIcon = self.pinButton.children("span"), wijCSS = self.options.wijCSS;

                if (!drag) {
                    if (buttonIcon.length) {
                        if (!buttonIcon.hasAllClasses(wijCSS.iconPinS)) {
                            buttonIcon.addClass(wijCSS.iconPinS);
                        }
                    }
                } else {
                    buttonIcon.removeClass(wijCSS.iconPinS);
                }
                self._enableDisableDragger(!drag);
                self.isPin = !drag;
            };

            /**
            * The refresh method refreshes the iframe content within the wijdialog.
            */
            wijdialog.prototype.refresh = function () {
                var fr = this.innerFrame;
                if (fr !== undefined) {
                    fr.attr("src", fr.attr("src"));
                }
            };

            /**
            * The toggle method expands or collapses the content of the wijdialog.
            */
            wijdialog.prototype.toggle = function () {
                var self = this, buttonIcon = self.toggleButton.children("span"), wijCSS = self.options.wijCSS;

                // TODO : toggle animation and event invoking.
                if (self.minimized) {
                    return;
                }

                if (!self.collapsed) {
                    self.collapsed = true;
                    if (!buttonIcon.hasAllClasses(wijCSS.iconCarat1S)) {
                        buttonIcon.addClass(wijCSS.iconCarat1S);
                    }
                    self._collapseDialogContent(true);
                } else {
                    self.collapsed = false;
                    if (buttonIcon.hasAllClasses(wijCSS.iconCarat1S)) {
                        buttonIcon.removeClass(wijCSS.iconCarat1S);
                    }
                    self._expandDialogContent(true);
                }
            };

            wijdialog.prototype._expandDialogContent = function (fireEvent) {
                var self = this, o = self.options, animationSetting = o.expandingAnimation;

                self.uiDialog.height("auto");
                if (fireEvent && animationSetting !== null) {
                    self.contentWrapper.show(animationSetting.animated, animationSetting.options, animationSetting.duration, function (e) {
                        self.uiDialog.css("height", self._toggleHeight);
                        if ($.isFunction(animationSetting.callback)) {
                            animationSetting.callback(e);
                        }
                        if (o.resizable) {
                            self._enableDisableResizer(false);
                        }
                    });
                } else {
                    self.contentWrapper.show();
                    if (o.resizable) {
                        self._enableDisableResizer(false);
                    }
                    self.uiDialog.css("height", self.toggleHeight);
                }
            };

            wijdialog.prototype._collapseDialogContent = function (fireEvent, isOpening) {
                var self = this, o = self.options, animationSetting = o.collapsingAnimation;

                if (o.resizable) {
                    self._enableDisableResizer(true);
                }
                if (!isOpening) {
                    self._toggleHeight = self.uiDialog[0].style.height;
                }
                self.uiDialog.height("auto");
                if (fireEvent && animationSetting !== null) {
                    self.contentWrapper.hide(animationSetting.animated, animationSetting.options, animationSetting.duration);
                } else {
                    self.contentWrapper.hide();
                }

                self._enableDisableDragger(self.isPin);
            };

            wijdialog.prototype._enableDisableResizer = function (disabled) {
                var dlg = this.uiDialog;
                if (!this.options.resizable) {
                    return;
                }
                dlg.resizable({ disabled: disabled });
                if (disabled) {
                    dlg.removeClass(this.options.wijCSS.stateDisabled);
                }
            };

            wijdialog.prototype._enableDisableDragger = function (disabled) {
                var dlg = this.uiDialog;
                if (!this.options.draggable) {
                    return;
                }
                dlg.draggable({ disabled: disabled });
                if (disabled) {
                    dlg.removeClass(this.options.wijCSS.stateDisabled);
                }
            };

            wijdialog.prototype._position = function () {
                var position = this.options.position, myAt = [], offset = [0, 0], isVisible;

                if (position) {
                    if (typeof position === "string" || (typeof position === "object" && "0" in position)) {
                        myAt = position.split ? position.split(" ") : [position[0], position[1]];
                        if (myAt.length === 1) {
                            myAt[1] = myAt[0];
                        }

                        $.each(["left", "top"], function (i, offsetPosition) {
                            if (+myAt[i] === myAt[i]) {
                                offset[i] = myAt[i];
                                myAt[i] = offsetPosition;
                            }
                        });

                        position = {
                            my: myAt[0] + (offset[0] < 0 ? offset[0] : "+" + offset[0]) + " " + myAt[1] + (offset[1] < 0 ? offset[1] : "+" + offset[1]),
                            at: myAt.join(" ")
                        };
                    }

                    position = $.extend({}, $.ui.dialog.prototype.options.position, position);
                } else {
                    position = $.ui.dialog.prototype.options.position;
                }

                // need to show the dialog to get the actual offset in the position plugin
                isVisible = this.uiDialog.is(":visible");
                if (!isVisible) {
                    this.uiDialog.show();
                }
                this.uiDialog.position(position);

                this._positionDisabledDiv();
                if (!isVisible) {
                    this.uiDialog.hide();
                }
            };

            /**
            * The minimize method minimizes the wijdialog.
            */
            wijdialog.prototype.minimize = function () {
                var self = this, dlg = self.uiDialog, o = self.options, wijCSS = o.wijCSS, miniZone = null, $from = $("<div></div>"), $to = $("<div></div>"), defaultZone, scrollTop, top, originalPosition, position, originalState, originalSize = {}, size = {}, content = "uiDialog";

                //content has 2 value 'uiDialog' for normal content,'copy' for iframe
                //to resolve the issue that iframe reload when minimize.
                //Only minimize from normal,maximized state
                if (self.minimized) {
                    return;
                }

                originalPosition = dlg.position();
                originalSize = {
                    width: dlg.width(),
                    height: dlg.height()
                };
                originalState = self.getState();
                if (self.maximized) {
                    self.maximized = false;
                    self.restoreButton.remove();

                    //fixed bug can't minimize window when it's maximized
                    $(window).unbind(".onWinResize");
                } else {
                    if (self.collapsed) {
                        self._expandDialogContent(false);
                    }
                    self._saveNormalState();
                }

                // disable resizer
                self._enableDisableResizer(true);

                //hide content
                if (self.collapsed) {
                    self._collapseDialogContent(false);
                }

                $from.appendTo(self.options.appendTo).css({
                    top: dlg.offset().top,
                    left: dlg.offset().left,
                    height: dlg.innerHeight(),
                    width: dlg.innerWidth(),
                    position: "absolute"
                });

                self.contentWrapper.hide();
                if (self.uiDialogButtonPane.length) {
                    self.uiDialogButtonPane.hide();
                }

                // remove size restriction
                dlg.height("auto");
                dlg.width("auto");

                self._doButtonAction(self.minimizeButton, "hide");
                self._restoreButton(true, self.minimizeButton, "After");
                self._doButtonAction(self.pinButton, "hide");
                self._doButtonAction(self.refreshButton, "hide");
                self._doButtonAction(self.toggleButton, "hide");
                self._doButtonAction(self.maximizeButton, "show");

                if ($.browser.webkit) {
                    $("." + wijCSS.wijdialogCaptionButton, dlg).css("float", "left");
                }

                if (self.innerFrame) {
                    content = "copy";
                    self[content] = dlg.clone();
                    self[content].empty();
                    self.uiDialogTitlebar.appendTo(self[content]);
                }

                if (o.minimizeZoneElementId.length > 0) {
                    miniZone = $("#" + o.minimizeZoneElementId);
                }
                if (miniZone !== null && miniZone.size() > 0) {
                    miniZone.append(self[content]);
                } else {
                    defaultZone = $("." + wijCSS.wijdialogZone);
                    if (defaultZone.size() === 0) {
                        defaultZone = $('<div class="' + wijCSS.wijdialogZone + '"></div>');
                        $(document.body).append(defaultZone);
                    }
                    defaultZone.append(self[content]).css("z-index", dlg.css("z-index"));
                }
                self[content].css("position", "static");
                self[content].css("float", "left");

                if ($.browser.msie && $.browser.version === '6.0') {
                    scrollTop = $(document).scrollTop();
                    top = document.documentElement.clientHeight - defaultZone.height() + scrollTop;
                    defaultZone.css({
                        position: 'absolute',
                        left: "0px", top: top
                    });
                }

                $to.appendTo("body").css({
                    top: self[content].offset().top,
                    left: self[content].offset().left,
                    height: self[content].innerHeight(),
                    width: self[content].innerWidth(),
                    position: "absolute"
                });
                dlg.hide();
                if (self.innerFrame) {
                    self[content].hide();
                }
                $from.effect("transfer", {
                    to: $to,
                    className: wijCSS.content
                }, 100, function () {
                    $from.remove();
                    $to.remove();
                    self[content].show();
                    self.minimized = true;
                    position = dlg.position();
                    size = {
                        width: dlg.width(),
                        height: dlg.height()
                    };
                    self._enableDisableDragger(true);
                    self._trigger('resize', null, {
                        originalPosition: originalPosition,
                        originalSize: originalSize,
                        position: position,
                        size: size
                    });
                    self._trigger("stateChanged", null, {
                        originalState: originalState,
                        state: "minimized"
                    });
                });
            };

            wijdialog.prototype._doButtonAction = function (button, action) {
                if (button !== undefined) {
                    button.removeClass(this.options.wijCSS.stateHover);
                    button[action]();
                }
            };

            /**
            * The maximize method maximizes the wijdialog.
            */
            wijdialog.prototype.maximize = function () {
                var self = this, w = $(window), dlg = self.uiDialog, originalSize = {}, size = {}, state, position, originalPosition;

                if (self.maximized) {
                    return;
                }

                self._enableDisableDragger(false);
                originalPosition = dlg.position();
                originalSize = {
                    width: dlg.width(),
                    height: dlg.height()
                };

                // maximized from minimized state
                if (self.minimized) {
                    self.restore(); //bug in IE when minimize -> maximize -> restore
                } else {
                    if (self.collapsed) {
                        self._expandDialogContent(false);
                    }
                    self._saveNormalState();
                    state = "normal";
                }
                self.maximized = true;
                if (self.maximizeButton !== undefined) {
                    self.maximizeButton.hide();
                    self._restoreButton(true, self.maximizeButton, "Before");
                }

                if ($.browser.webkit) {
                    $("." + this.options.wijCSS.wijdialogCaptionButton).css("float", "");
                }

                self._onWinResize(self, w);
                if (self.collapsed) {
                    self._collapseDialogContent(false);
                }

                /// TODO : bind resize event.
                if (!self.collapsed) {
                    self._enableDisableDragger(true);
                }
                self._enableDisableResizer(true);

                position = dlg.position();
                size = {
                    width: dlg.width(),
                    height: dlg.height()
                };
                self._trigger('resize', null, {
                    originalPosition: originalPosition,
                    originalSize: originalSize,
                    position: position,
                    size: size
                });

                if (state === "normal") {
                    self._trigger("stateChanged", null, {
                        originalState: "normal",
                        state: "maximized"
                    });
                }
            };

            wijdialog.prototype._bindWindowResize = function () {
                var self = this, w = $(window), id = self.element.attr("id").replace(/-/g, ""), resizeEvent = "resize." + id, scrollEvent = "scroll." + id;

                w.bind(resizeEvent, function () {
                    if (self.maximized) {
                        self._onWinResize(self, w);
                    }
                });

                //fixed ie 6 position:fixed
                if ($.browser.msie && $.browser.version === '6.0') {
                    w.bind(scrollEvent + " " + resizeEvent, function () {
                        var top, scrollTop, defaultZone;
                        if (self.minimized) {
                            scrollTop = $(document).scrollTop();
                            defaultZone = self.uiDialog.parent();
                            top = document.documentElement.clientHeight - defaultZone.height() + scrollTop;
                            defaultZone.css("top", top);
                        }
                    });
                }
            };

            wijdialog.prototype._unbindWindowResize = function () {
                var id = this.element.attr("id").replace(/-/g, "");
                $(window).unbind("." + id);
            };

            wijdialog.prototype._saveNormalState = function () {
                var self = this, dialog = self.uiDialog, ele = self.element;

                if (self.maximized) {
                    return;
                }

                self.normalState = {
                    width: parseFloat(dialog.css("width")),
                    left: parseFloat(dialog.css("left")),
                    top: parseFloat(dialog.css("top")),
                    height: parseFloat(dialog.css("height")),
                    innerHeight: parseFloat(ele.css("height")),
                    innerWidth: parseFloat(ele.css("width")),
                    innerMinWidth: parseFloat(ele.css("min-width")),
                    innerMinHeight: parseFloat(ele.css("min-height"))
                };
            };

            wijdialog.prototype._onWinResize = function (self, w) {
                var dialog = self.uiDialog;

                dialog.css({
                    top: w.scrollTop(),
                    left: w.scrollLeft()
                });
                dialog.setOutWidth(w.width());
                dialog.setOutHeight(w.height());
                self.options.width = dialog.width();
                self.options.height = dialog.height();
                self._size();
                if (self.collapsed) {
                    dialog.height("auto");
                    self.contentWrapper.hide();
                }
            };

            wijdialog.prototype._restoreButton = function (show, button, position) {
                var self = this, buttonHash = {
                    button: "restore", info: {
                        visible: show,
                        click: self.restore,
                        iconClassOn: this.options.wijCSS.iconNewWin
                    }
                }, restore = self._createCaptionButton(buttonHash, self.uiDialogTitlebar, true);

                if (show) {
                    restore["insert" + position](button);
                    self.restoreButton = restore;
                }
            };

            wijdialog.prototype._appendToBody = function (dlg) {
                if (!this.innerFrame) {
                    dlg.appendTo(this.options.appendTo);
                } else {
                    this.uiDialogTitlebar.prependTo(dlg);
                    dlg.show();
                }
            };

            /**
            * The restore method restores the wijdialog to its normal size from either the minimized or the maximized state.
            */
            wijdialog.prototype.restore = function () {
                var self = this, dlg = self.uiDialog, contentUrl = self.options.contentUrl, originalSize = {}, size = {}, position, state, originalPosition, $from = $("<div></div>"), $to = $("<div></div>"), content = "uiDialog";

                //content has 2 value 'uiDialog' for normal content,'copy' for iframe
                //to resolve the issue that iframe reload when minimize on ff & webkit.
                // restore form minimized state.
                if (self.minimized) {
                    self.minimized = false;
                    if (self.innerFrame) {
                        content = "copy";
                        if (!self[content]) {
                            content = "uiDialog";
                        }
                    }

                    originalPosition = self[content].position();
                    originalSize = {
                        width: self[content].width(),
                        height: self[content].height()
                    };
                    $from.appendTo(self.options.appendTo).css({
                        top: self[content].offset().top,
                        left: self[content].offset().left,
                        height: self[content].innerHeight(),
                        width: self[content].innerWidth(),
                        position: "absolute"
                    });

                    dlg.css("position", "absolute");
                    dlg.css("float", "");

                    self._appendToBody(dlg);

                    self._enableDisableResizer(false);
                    if (!self.isPin) {
                        self._enableDisableDragger(false);
                    }
                    self._restoreToNormal();
                    self.contentWrapper.show();
                    if (self.uiDialogButtonPane.length) {
                        self.uiDialogButtonPane.show();
                    }
                    $to.appendTo(self.options.appendTo).css({
                        top: dlg.offset().top,
                        left: dlg.offset().left,
                        height: dlg.innerHeight(),
                        width: dlg.innerWidth(),
                        position: "absolute"
                    });

                    dlg.hide();
                    $from.effect("transfer", {
                        to: $to,
                        className: this.options.wijCSS.content
                    }, 150, function () {
                        dlg.show();
                        position = dlg.position();
                        size.width = dlg.width();
                        size.height = dlg.height();
                        $from.remove();
                        $to.remove();
                        if (self.copy) {
                            self.copy.remove();
                        }
                        self._trigger('resize', null, {
                            originalPosition: originalPosition,
                            originalSize: originalSize,
                            position: position,
                            size: size
                        });

                        state = self.getState();

                        self._trigger("stateChanged", null, {
                            originalState: "minimized",
                            state: state
                        });
                    });

                    if (self.collapsed) {
                        self._collapseDialogContent();
                    }
                    self._doButtonAction(self.minimizeButton, "show");
                    self._doButtonAction(self.restoreButton, "remove");
                    self._doButtonAction(self.pinButton, "show");
                    self._doButtonAction(self.refreshButton, "show");
                    self._doButtonAction(self.toggleButton, "show");

                    if ($.browser.webkit) {
                        $("." + this.options.wijCSS.wijdialogCaptionButton).css("float", "");
                    }

                    //reset the contenturl
                    if (typeof contentUrl === "string" && contentUrl.length > 0) {
                        if (!self.innerFrame) {
                            self._checkUrl();
                        }
                        if (self.innerFrame.attr("src") !== contentUrl) {
                            self.innerFrame.attr("src", contentUrl);
                        }

                        // the padding has removed by hasframe class, need to adjust the size of dialog
                        self.element.css("width", self.normalState.width);
                    }
                } else if (self.maximized) {
                    self.maximized = false;
                    originalPosition = dlg.position();
                    originalSize = {
                        width: dlg.width(),
                        height: dlg.height()
                    };
                    $(window).unbind(".onWinResize");
                    if (self.collapsed) {
                        self._expandDialogContent();
                    }
                    self._enableDisableResizer(false);
                    if (!self.isPin) {
                        self._enableDisableDragger(false);
                    }
                    self._restoreToNormal();
                    self.contentWrapper.show();
                    if (self.collapsed) {
                        self._collapseDialogContent();
                    }
                    if (self.maximizeButton !== undefined) {
                        self.maximizeButton.show();
                        self._restoreButton(false, self.maximizeButton, "before");
                    }
                    position = dlg.position();
                    size = {
                        width: dlg.width(),
                        height: dlg.height()
                    };
                    self._trigger('resize', null, {
                        originalPosition: originalPosition,
                        originalSize: originalSize,
                        position: position,
                        size: size
                    });
                    state = self.getState();

                    self._trigger("stateChanged", null, {
                        originalState: "maximized",
                        state: state
                    });
                }
            };

            /**
            * The getState method gets the state of the dialog widget.
            * @returns {string} Possible values are: minimized, maximized, and normal.
            */
            wijdialog.prototype.getState = function () {
                var self = this;
                return self.minimized ? "minimized" : (self.maximized ? "maximized" : "normal");
            };

            /**
            * The reset method resets dialog properties such as width and height to their default values.
            */
            wijdialog.prototype.reset = function () {
                var self = this;

                if (self.getState() === "normal") {
                    self._reset();
                } else {
                    self.element.one(this.widgetEventPrefix + "statechanged", function () {
                        self._reset();
                    });
                    self.restore();
                }
            };

            wijdialog.prototype._reset = function () {
                var self = this;

                self.normalState = {};
                if (self.initHeight && self.initWidth) {
                    self.options.width = self.initWidth;
                    self.options.height = self.initHeight;
                    self._size();
                }
                self._setOption("position", self._originalPosition);
            };

            /**
            * The open method opens an instance of the wijdialog.
            */
            wijdialog.prototype.open = function () {
                var self = this, o = self.options;

                if ((o.hide === "drop" || o.hide === "bounce") && $.browser.msie) {
                    //fixed bug when effect "drop" on IE
                    self.uiDialog.css("filter", "auto");
                }

                if (!self.innerFrame) {
                    if (!self.minimized) {
                        _super.prototype.open.call(this);
                        self.uiDialog.wijTriggerVisibility();
                    } else {
                        self._setOpener();
                        self.uiDialog.show();
                        self._isOpen = true;
                    }
                } else {
                    // for 38166 issue:
                    // http://stackoverflow.com/questions/14965912/jquery-dialog-iframe-gives-this-error-in-ie9-script5009-array-is-undefined
                    if (self._isIE9()) {
                        if (o.show && effects.indexOf(o.show) > -1) {
                            o.show = null;
                        }

                        window.setTimeout(function () {
                            self.innerFrame.attr("src", o.contentUrl);
                        }, 200);
                    } else {
                        self.innerFrame.attr("src", o.contentUrl);
                    }

                    if (!self.minimized) {
                        _super.prototype.open.call(this);
                    } else {
                        self._setOpener();
                        self.uiDialogTitlebar.show();
                        self._isOpen = true;
                    }
                }
                if (self.collapsed) {
                    self._collapseDialogContent(false, true);
                }

                if (self._isDisabled()) {
                    if (self.disabledDiv) {
                        self.disabledDiv.show();
                    } else {
                        self._handleDisabledOption(true);
                    }
                }
            };

            wijdialog.prototype._isDisabled = function () {
                var opts = this.options;
                return opts.disabledState === true || opts.disabled === true;
            };

            wijdialog.prototype._setOpener = function () {
                var self = this;
                if (!self.opener && self.document && self.document[0]) {
                    self.opener = $(self.document[0].activeElement);
                }
            };

            wijdialog.prototype._isIE9 = function () {
                return $.browser.msie && parseInt($.browser.version) === 9;
            };

            /**
            * The close method closes the dialog widget.
            */
            wijdialog.prototype.close = function () {
                var self = this, o = self.options;

                if (self.innerFrame && self._isIE9()) {
                    if (o.hide && effects.indexOf(o.hide) > -1) {
                        o.hide = null;
                    }
                }
                _super.prototype.close.call(this);
            };

            wijdialog.prototype._initialCloseOption = function () {
                var self = this, optClose = self.options.close;

                self.options.close = function (event) {
                    self._closeDialogHelper();
                    if (optClose && typeof optClose === "function") {
                        optClose(event);
                    }
                };
            };

            wijdialog.prototype._closeDialogHelper = function () {
                var self = this;

                if (self.innerFrame) {
                    self.innerFrame.attr("src", "");
                    if (self.minimized) {
                        self.uiDialogTitlebar.hide();
                    }
                }
                if (self.disabledDiv && self._isDisabled()) {
                    self.disabledDiv.hide();
                }
            };

            wijdialog.prototype._restoreToNormal = function () {
                var self = this, dialog = self.uiDialog, ele = self.element, normalState = self.normalState;

                dialog.css({
                    width: normalState.width,
                    left: normalState.left,
                    top: normalState.top,
                    height: normalState.height
                });
                ele.css({
                    height: normalState.innerHeight,
                    width: normalState.innerWidth,
                    "min-width": normalState.innerMinWidth,
                    "min-height": normalState.innerMinHeight
                });

                self.options.width = dialog.width();
                self.options.height = dialog.height();
            };
            return wijdialog;
        })(JQueryUIDialog);
        _dialog.wijdialog = wijdialog;

        if ($.ui && $.ui.dialog) {
            $.extend($.ui.dialog.overlay, {
                create: function (dialog) {
                    if (this.instances.length === 0) {
                        // prevent use of anchors and inputs
                        // we use a setTimeout in case the overlay is created from an
                        // event that we're going to be cancelling (see #2804)
                        setTimeout(function () {
                            // handle $(el).dialog().dialog('close') (see #4065)
                            if ($.ui.dialog.overlay.instances.length) {
                                $(document).bind($.ui.dialog.overlay.events, function (event) {
                                    // stop events if the z-index of the target is < the z-index of the overlay
                                    // we cannot return true when we don't want to cancel the event (#3523)
                                    if ($(event.target).zIndex() < $.ui.dialog.overlay.maxZ && !$.contains(dialog.element[0], event.target)) {
                                        return false;
                                    }
                                });
                            }
                        }, 1);

                        // allow closing by pressing the escape key
                        $(document).bind('keydown.dialog-overlay', function (event) {
                            var keyCode = wijmo.getKeyCodeEnum();
                            if (dialog.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode && event.keyCode === keyCode.ESCAPE) {
                                dialog.close(event);
                                event.preventDefault();
                            }
                        });

                        // handle window resize
                        $(window).bind('resize.dialog-overlay', $.ui.dialog.overlay.resize);
                    }

                    var $el = (this.oldInstances.pop() || $('<div></div>').addClass(dialog.options.wijCSS.overlay)).appendTo(document.body).css({
                        width: this.width(),
                        height: this.height()
                    });

                    if ($.fn.bgiframe) {
                        $el.bgiframe();
                    }

                    this.instances.push($el);
                    return $el;
                },
                height: function () {
                    var scrollHeight, offsetHeight;

                    // handle IE 6
                    if ($.browser.msie) {
                        scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
                        offsetHeight = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight);

                        if (scrollHeight < offsetHeight) {
                            return $(window).height() + 'px';
                        } else {
                            return scrollHeight + 'px';
                        }
                        // handle "good" browsers
                    } else {
                        return $(document).height() + 'px';
                    }
                },
                width: function () {
                    var scrollWidth, offsetWidth;

                    // handle IE 6
                    if ($.browser.msie) {
                        scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
                        offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);

                        if (scrollWidth < offsetWidth) {
                            return $(window).width() + 'px';
                        } else {
                            return scrollWidth + 'px';
                        }
                        // handle "good" browsers
                    } else {
                        return $(document).width() + 'px';
                    }
                }
            });

            wijdialog.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, $.ui.dialog.prototype.options, new wijdialog_options());

            // for some reason, the jQuery UI dialog override these two methods to $.noonp, I orderride it as base widget.
            wijdialog.prototype.disable = function () {
                return this._setOption("disabled", true);
            };
            wijdialog.prototype.enable = function () {
                return this._setOption("disabled", false);
            };

            $.wijmo.registerWidget(widgetName, $.ui.dialog, wijdialog.prototype);
        }

        

        
    })(wijmo.dialog || (wijmo.dialog = {}));
    var dialog = wijmo.dialog;
})(wijmo || (wijmo = {}));


