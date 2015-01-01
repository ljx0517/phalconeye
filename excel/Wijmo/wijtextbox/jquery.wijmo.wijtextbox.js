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
    /// <reference path="../Base/jquery.wijmo.widget.ts" />
    /*globals jQuery */
    /*
    * Depends:
    *  jquery.js
    *  jquery.ui.js
    *
    */
    (function (textbox) {
        "use strict";
        var $ = jQuery, widgetName = "wijtextbox";

        /** @widget */
        var wijtextbox = (function (_super) {
            __extends(wijtextbox, _super);
            function wijtextbox() {
                _super.apply(this, arguments);
            }
            wijtextbox.prototype._create = function () {
                var self = this, e = self.element, wijCSS = self.options.wijCSS, allowedNodes = {
                    'input': true,
                    'textarea': true
                }, allowedInputTypes = {
                    'text': true,
                    'password': true,
                    'email': true,
                    'url': true
                }, nodeName = e.get(0).nodeName.toLowerCase(), type = e.attr("type");

                // enable touch support:
                if (window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }

                if (!allowedNodes.hasOwnProperty(nodeName)) {
                    return;
                }
                if ((nodeName === 'input') && type && !allowedInputTypes.hasOwnProperty(type.toLowerCase())) {
                    return;
                }

                e.addClass(wijCSS.wijtextbox).addClass(wijCSS.widget).addClass(wijCSS.stateDefault).addClass(wijCSS.cornerAll);
                self.element.bind("mouseover." + self.widgetName, function () {
                    e.addClass(wijCSS.stateHover);
                }).bind("mouseout." + self.widgetName, function () {
                    e.removeClass(wijCSS.stateHover);
                }).bind("mousedown." + self.widgetName, function () {
                    e.addClass(wijCSS.stateActive);
                }).bind("mouseup." + self.widgetName, function () {
                    e.removeClass(wijCSS.stateActive);
                }).bind("focus." + self.widgetName, function () {
                    e.addClass(wijCSS.stateFocus);
                }).bind("blur." + self.widgetName, function () {
                    e.removeClass(wijCSS.stateFocus);
                });

                //for case 20899
                if (e.is(":disabled") || self._isDisabled()) {
                    self._setOption("disabled", true);
                }

                _super.prototype._create.call(this);
            };

            /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            wijtextbox.prototype.destroy = function () {
                var self = this, wijCSS = self.options.wijCSS;
                self.element.removeClass(wijCSS.widget).removeClass(wijCSS.stateDefault).removeClass(wijCSS.cornerAll).removeClass(wijCSS.stateHover).removeClass(wijCSS.stateActive).removeClass(wijCSS.stateFocus).removeClass(wijCSS.wijtextbox).unbind("." + self.widgetName);
                _super.prototype.destroy.call(this);
            };

            wijtextbox.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._toggleDisableInput(true);
            };

            wijtextbox.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._toggleDisableInput(false);
            };

            wijtextbox.prototype._toggleDisableInput = function (disabled) {
                this.element.attr('disabled', disabled);
            };
            return wijtextbox;
        })(wijmo.wijmoWidget);
        textbox.wijtextbox = wijtextbox;

        var wijtextbox_options = (function () {
            function wijtextbox_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijtextbox')";
                /** wijtextbox css, extend from $.wijmo.wijCSS
                * @ignore
                */
                this.wijCSS = {
                    wijtextbox: "wijmo-wijtextbox"
                };
                /** @ignore*/
                this.wijMobileCSS = {
                    stateDefault: "ui-input-text"
                };
            }
            return wijtextbox_options;
        })();
        ;

        wijtextbox.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijtextbox_options());

        $.wijmo.registerWidget(widgetName, wijtextbox.prototype);
    })(wijmo.textbox || (wijmo.textbox = {}));
    var textbox = wijmo.textbox;
})(wijmo || (wijmo = {}));

