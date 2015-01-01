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
    /*globals jQuery*/
    /*
    * Depends:
    *  jquery.js
    *  jquery-ui.js
    */
    (function (checkbox) {
        "use strict";
        var $ = jQuery, widgetName = "wijcheckbox", _csspre = "wijcheckbox", checkboxId = 0;

        /** @widget */
        var wijcheckbox = (function (_super) {
            __extends(wijcheckbox, _super);
            function wijcheckbox() {
                _super.apply(this, arguments);
            }
            wijcheckbox.prototype._init = function () {
                var self = this, ele = self.element;
                if (!ele.is(":checkbox")) {
                    return;
                }
                if (!ele.attr("id")) {
                    ele.attr("id", _csspre + checkboxId);
                    checkboxId += 1;
                }
                if (ele.is(":disabled")) {
                    self._setOption("disabled", true);
                }
                self._decorateCheckbox();

                self._initCheckState();
                self.refresh();

                self._bindEvents();
            };

            wijcheckbox.prototype._bindEvents = function () {
                var self = this, o = self.options, ele = self.element;

                ele.bind("click.wijcheckbox", function (e) {
                    if (self._isDisabled()) {
                        return;
                    }
                    self.refresh(e);
                    self._trigger("changed", null, {
                        checked: self.options.checked
                    });
                }).bind("focus.wijcheckbox", function () {
                    if (self._isDisabled()) {
                        return;
                    }
                    if (self.boxElement) {
                        self.boxElement.addClass(o.wijCSS.stateFocus);
                    }
                }).bind("blur.wijcheckbox", function () {
                    if (self._isDisabled()) {
                        return;
                    }
                    if (self.boxElement) {
                        self.boxElement.removeClass(o.wijCSS.stateFocus).not("." + o.wijCSS.stateHover);
                    }
                }).bind("keydown.wijcheckbox", function (e) {
                    if (e.keyCode === 32) {
                        if (self._isDisabled()) {
                            return;
                        }
                        self.refresh(null);
                    }
                });
                if (self.boxElement) {
                    self.boxElement.bind("mouseover.wijcheckbox", function () {
                        ele.mouseover();
                    }).bind("mouseout.wijcheckbox", function () {
                        ele.mouseout();
                    }).bind("click.wijcheckbox", function (e) {
                        if (self._isDisabled()) {
                            return;
                        }
                        ele.get(0).checked = !ele.get(0).checked;
                        ele.change();
                        ele.focus();
                        self.refresh(e);
                        self._trigger("changed", null, {
                            checked: self.options.checked
                        });
                    });
                }

                if (self.checkboxElement) {
                    self.checkboxElement.bind("mouseover.wijcheckbox", function (e) {
                        if (self._isDisabled()) {
                            return;
                        }
                        if (self.boxElement) {
                            self.boxElement.addClass(o.wijCSS.stateHover);
                        }
                    }).bind("mouseout.wijcheckbox", function (e) {
                        if (self._isDisabled()) {
                            return;
                        }
                        if (self.boxElement) {
                            self.boxElement.removeClass(o.wijCSS.stateHover).not("." + o.wijCSS.stateFocus);
                        }
                    });
                }
            };

            wijcheckbox.prototype._unbindEvents = function () {
                var self = this;
                self.element.unbind(".wijcheckbox");
                if (self.boxElement) {
                    self.boxElement.unbind(".wijcheckbox");
                }
                if (self.checkboxElement) {
                    self.checkboxElement.unbind(".wijcheckbox");
                }
            };

            wijcheckbox.prototype._decorateCheckbox = function () {
                var self = this, ele = self.element, o = self.options, checkboxElement, label, targetLabel, boxElement, iconElement;

                checkboxElement = self._getCheckboxElement();

                targetLabel = $("label[for='" + ele.attr("id") + "']");
                if (targetLabel.length > 0) {
                    checkboxElement.append(targetLabel);
                    targetLabel.attr("labelsign", "C1");
                }

                boxElement = self._getBoxElement();
                iconElement = boxElement.children("." + o.wijCSS.wijcheckboxIcon);
                checkboxElement.append(boxElement);

                boxElement.removeClass(o.wijCSS.wijcheckboxRelative).attr("role", "checkbox");
                if (targetLabel.length === 0 || targetLabel.html() === "") {
                    boxElement.addClass(o.wijCSS.wijcheckboxRelative);
                }

                this.iconElement = iconElement;
                this.boxElement = boxElement;
                this.checkboxElement = checkboxElement;
            };

            wijcheckbox.prototype._getBoxElement = function () {
                var o = this.options, boxElement = $("<div></div>").addClass(o.wijCSS.wijcheckboxBox).addClass(o.wijCSS.widget).addClass(o.wijCSS.stateDefault).addClass(o.wijCSS.cornerAll).append($("<span></span>").addClass(o.wijCSS.wijcheckboxIcon));
                if (this._isDisabled()) {
                    boxElement.addClass(o.wijCSS.stateDisabled);
                }
                return boxElement;
            };

            wijcheckbox.prototype._getCheckboxElement = function () {
                var self = this, ele = self.element, o = self.options, checkboxElement, label;
                if (ele.parent().is("label")) {
                    checkboxElement = ele.parent().wrap($("<div></div>").addClass(o.wijCSS.wijcheckboxInputwrapper)).parent().wrap("<div></div>").parent().addClass(o.wijCSS.wijcheckbox).addClass(o.wijCSS.widget);
                    label = ele.parent();
                    label.attr("for", ele.attr("id"));
                    checkboxElement.find("." + o.wijCSS.wijcheckboxInputwrapper).append(ele);
                    checkboxElement.append(label);
                } else {
                    checkboxElement = ele.wrap($("<div></div>").addClass(o.wijCSS.wijcheckboxInputwrapper)).parent().wrap("<div></div>").parent().addClass(o.wijCSS.wijcheckbox).addClass(o.wijCSS.widget);
                }

                //update for fixed tooltip can't take effect
                checkboxElement.attr("title", ele.attr("title"));
                return checkboxElement;
            };

            wijcheckbox.prototype._create = function () {
                // enable touch support:
                if (window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                _super.prototype._create.call(this);
            };

            wijcheckbox.prototype._setOption = function (key, value) {
                var self = this, o = self.options, boxElement, originalCheckedState = o.checked;

                if (o[key] === value) {
                    return;
                }
                _super.prototype._setOption.call(this, key, value);

                if (key === 'checked') {
                    self.element.get(0).checked = value;
                    self.refresh();
                    self._trigger("changed", null, {
                        checked: value
                    });
                }
            };

            wijcheckbox.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._toggleDisableCheckBox(true);
            };

            wijcheckbox.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._toggleDisableCheckBox(false);
            };

            wijcheckbox.prototype._toggleDisableCheckBox = function (disabled) {
                this.element.prop("disabled", disabled);
                if (this.boxElement) {
                    this.boxElement.toggleClass(this.options.wijCSS.stateDisabled, disabled);
                }
            };

            wijcheckbox.prototype._initCheckState = function () {
                var self = this, o = self.options;

                if (o.checked !== undefined && o.checked !== null) {
                    self.element.get(0).checked = o.checked;
                }
            };

            /** Use the refresh method to set the checkbox element's style.
            * @param {object} e The event that fires the refresh the checkbox.
            */
            wijcheckbox.prototype.refresh = function (e) {
                var self = this, o = self.options, checked = self.element.get(0).checked;

                o.checked = checked;
                if (self.iconElement) {
                    self.iconElement.toggleClass(o.wijCSS.icon + " " + o.wijCSS.iconCheck, checked);
                }
                if (self.boxElement) {
                    self.boxElement.toggleClass(o.wijCSS.stateActive, checked).attr("aria-checked", checked);
                }
                if (self.checkboxElement) {
                    self.checkboxElement.toggleClass(o.wijCSS.stateChecked, checked);
                }
                if (e) {
                    e.stopPropagation();
                }
            };

            /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            wijcheckbox.prototype.destroy = function () {
                var self = this, boxelement = self.element.parent().parent();
                boxelement.children("div." + self.options.wijCSS.wijcheckboxBox).remove();
                self.element.unwrap();
                self.element.unwrap();
                self._unbindEvents();
                _super.prototype.destroy.call(this);
            };
            return wijcheckbox;
        })(wijmo.wijmoWidget);
        checkbox.wijcheckbox = wijcheckbox;

        var wijcheckbox_options = (function () {
            function wijcheckbox_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijcheckbox')";
                /** wijcheckbox css, extend from $.wijmo.wijCSS
                * @ignore
                */
                this.wijCSS = {
                    wijcheckbox: "wijmo-checkbox",
                    wijcheckboxBox: "wijmo-checkbox-box",
                    wijcheckboxIcon: "wijmo-checkbox-icon",
                    wijcheckboxInputwrapper: "wijmo-checkbox-inputwrapper",
                    wijcheckboxRelative: "wijmo-checkbox-relative"
                };
                /** wijcheckbox css, extend from $.wijmo.wijCSS
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-b",
                    stateDefault: "ui-btn ui-btn-b",
                    stateHover: "ui-btn-down-c",
                    stateActive: "ui-btn-down-b"
                };
                /** Causes the checkbox to appear with a checkmark.
                * @type {boolean}
                */
                this.checked = null;
                /** A function that is called when the checked state changes.
                * @event
                * @dataKey {boolean} checked the state of checkbox.
                */
                this.changed = null;
            }
            return wijcheckbox_options;
        })();
        ;

        wijcheckbox.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijcheckbox_options());
        $.wijmo.registerWidget(widgetName, wijcheckbox.prototype);
    })(wijmo.checkbox || (wijmo.checkbox = {}));
    var checkbox = wijmo.checkbox;
})(wijmo || (wijmo = {}));

