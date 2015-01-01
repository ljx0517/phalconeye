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
/// <reference path="../External/declarations/globalize.d.ts"/>
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/// <reference path="../wijtooltip/jquery.wijmo.wijtooltip.ts"/>
/*globals jQuery,window,document*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*
    * Depends:
    *     jquery.ui.core.js
    *     jquery.ui.widget.js
    *     jquery.wijmo.wijtooltip.js
    */
    (function (_video) {
        "use strict";
        var $ = jQuery, localCss = {
            widgetName: "wijvideo",
            //Classes
            wijvideoClass: "wijmo-wijvideo",
            wijvideoWrapperClass: "wijmo-wijvideo-wrapper",
            wijvideoControlsClass: "wijmo-wijvideo-controls",
            wijvideoPlayClass: "wijmo-wijvideo-play",
            wijvideoIndexClass: "wijmo-wijvideo-index",
            wijvideoIndexSliderClass: "wijmo-wijvideo-index-slider",
            wijvideoTimerClass: "wijmo-wijvideo-timer",
            wijvideoVolumeClass: "wijmo-wijvideo-volume",
            wijvideoVolumeContainerClass: "wijmo-wijvideo-volume-container",
            wijvideoVolumeSliderClass: "wijmo-wijvideo-volumeslider",
            wijvideoFullScreenClass: "wijmo-wijvideo-fullscreen",
            wijvideoContainerFullScreenClass: "wijmo-wijvideo-container-fullscreen"
        };

        /** @widget */
        var wijvideo = (function (_super) {
            __extends(wijvideo, _super);
            function wijvideo() {
                _super.apply(this, arguments);
            }
            wijvideo.prototype._createVideoDom = function () {
                var wijCSS = this.options.wijCSS, space = " ", videoWidgetClass = [localCss.wijvideoClass, wijCSS.wijvideo, wijCSS.content, wijCSS.widget].join(space), wrapperClass = [localCss.wijvideoWrapperClass, wijCSS.wijvideoWrapper].join(space), controlClass = [
                    localCss.wijvideoControlsClass, wijCSS.wijvideoControls, wijCSS.header,
                    wijCSS.helperClearFix, wijCSS.helperReset].join(space), videoPlayClass = [localCss.wijvideoPlayClass, wijCSS.wijvideoPlay, wijCSS.stateDefault, wijCSS.cornerAll].join(space), iconClass = [wijCSS.icon, wijCSS.iconPlay].join(space), indexClass = [localCss.wijvideoIndexClass, wijCSS.wijvideoIndex].join(space), indexSliderClass = [localCss.wijvideoIndexSliderClass, wijCSS.wijvideoIndexSlider].join(space), timerClass = [localCss.wijvideoTimerClass, wijCSS.wijvideoTimer, wijCSS.stateDefault].join(space), volumeClass = [localCss.wijvideoVolumeClass, wijCSS.wijvideoVolume, wijCSS.stateDefault, wijCSS.cornerAll].join(space), volumeContainerClass = [localCss.wijvideoVolumeContainerClass, wijCSS.wijvideoVolumeContainer].join(space), volumeSliderClass = [localCss.wijvideoVolumeSliderClass, wijCSS.wijvideoVolumeSlider, wijCSS.stateDefault, wijCSS.cornerTop].join(space), volumeIconClass = [wijCSS.icon, wijCSS.iconVolumeOn].join(space), fullScreenClass = [localCss.wijvideoFullScreenClass, wijCSS.wijvideoFullScreen, wijCSS.stateDefault, wijCSS.cornerAll].join(space), diagIconClass = [wijCSS.icon, wijCSS.iconArrow4Diag].join(space), videoContainer, videoContent;

                videoContainer = $("<div>").addClass(videoWidgetClass);
                videoContent = $("<div>").addClass(wrapperClass).append($("<ul>").addClass(controlClass).append($("<li>").addClass(videoPlayClass).append($("<span>").addClass(iconClass))).append($("<li>").addClass(indexClass).append($("<div>").addClass(indexSliderClass))).append($("<li>00:00</li>").addClass(timerClass)).append($("<li>").addClass(volumeClass).append($("<div>").addClass(volumeContainerClass).append($("<div>").addClass(volumeSliderClass))).append($("<span>").addClass(volumeIconClass))).append($("<li>").addClass(fullScreenClass).append($("<span>").addClass(diagIconClass))));
                this.$video.wrap(videoContainer).after(videoContent);
            };

            wijvideo.prototype._initialSlideControl = function () {
                var self = this, pos, interval, wijCSS = self.options.wijCSS, o = self.options;
                self.$seekSlider = self.$vidParent.find('.' + localCss.wijvideoIndexSliderClass);

                // create the video this.seek slider
                interval = window.setInterval(function () {
                    //replace the attr to prop
                    if (self._getVideoAttribute("readyState")) {
                        window.clearInterval(interval);

                        //note: we need to adjust the size of the video in
                        //this time
                        self.$vidParent.width(self.$video.outerWidth()).height(self.$video.outerHeight());

                        //note: if the controls is invisible, it will not
                        //get the position
                        self.$wijvideoControl.show();

                        pos = self.$vidParent.find('.' + localCss.wijvideoTimerClass).position().left;
                        self.$seekSlider.width(pos - self.$seekSlider.position().left - 15);

                        self.$seekSlider.slider({
                            value: 0,
                            step: 0.01,
                            max: self._getVideoAttribute("duration"),
                            range: 'min',
                            stop: function (e, ui) {
                                self._seeking = false;
                                self._setVideoAttribute("currentTime", ui.value);
                            },
                            slide: function () {
                                self._seeking = true;
                            }
                        }).slider("widget").addClass(o.wijCSS.stateDefault);

                        self._updateTime();

                        // wire up the volume
                        self.$volumeSlider = self.$vidParent.find('.' + localCss.wijvideoVolumeSliderClass);
                        self.$volumeSlider.slider({
                            min: 0,
                            max: 1,
                            value: self._getVideoAttribute("volume"),
                            step: 0.1,
                            orientation: 'vertical',
                            range: 'min',
                            slide: function (e, ui) {
                                self._setVideoAttribute("volume", ui.value);
                                if (ui.value === 0) {
                                    self._volumnOn = false;
                                    self.$volumeBtn.find("span").removeClass(wijCSS.iconVolumeOn).addClass(wijCSS.iconVolumeOff);
                                } else {
                                    self._volumnOn = true;
                                    self.$volumeBtn.find("span").removeClass(wijCSS.iconVolumeOff).addClass(wijCSS.iconVolumeOn);
                                }
                            }
                        }).slider("widget").addClass(o.wijCSS.stateDefault);

                        self.$wijvideoControl.hide();

                        self._initToolTip();

                        if (!o.showControlsOnHover) {
                            self.$wijvideoControl.show();
                            self.$vidParent.height(self.$video.outerHeight() + self.$wijvideoControl.height());
                        }
                    }
                    if (self._isDisabled()) {
                        if (self.$disabledDiv) {
                            self.$disabledDiv.remove();
                            self.$disabledDiv = null;
                        }
                        self._handleDisabledOption(true, self.element);
                    }
                }, 200);
            };

            wijvideo.prototype._bindEvents = function () {
                var self = this, $playbtn, wijCSS = self.options.wijCSS, o = self.options;

                self.$video.bind("click." + self.widgetName, function () {
                    self._togglePlay();
                });

                // display the bar on hover
                if (o.showControlsOnHover) {
                    self.$vidParent.hover(function () {
                        self.$wijvideoControl.stop(true, true).fadeIn();
                    }, function () {
                        self.$wijvideoControl.delay(300).fadeOut();
                    });
                }
                $playbtn = self.$vidParent.find('.' + localCss.wijvideoPlayClass + ' > span');
                $playbtn.click(function () {
                    self._togglePlay();
                }).parent().hover(function () {
                    $(this).addClass(wijCSS.stateHover);
                }, function () {
                    $(this).removeClass(wijCSS.stateHover);
                });

                self.$vidParent.find('.' + localCss.wijvideoVolumeClass).hover(function () {
                    $('.' + localCss.wijvideoVolumeContainerClass).stop(true, true).slideToggle();
                });

                self.$fullScreenBtn = self.$vidParent.find('.' + localCss.wijvideoFullScreenClass + ' > span');
                self.$fullScreenBtn.click(function () {
                    self._toggleFullScreen();
                }).parent().hover(function () {
                    $(this).addClass(wijCSS.stateHover);
                }, function () {
                    $(this).removeClass(wijCSS.stateHover);
                });

                if (!self.options.fullScreenButtonVisible) {
                    self.$vidParent.find('.' + localCss.wijvideoFullScreenClass).hide();
                }

                self.$volumeBtn.hover(function () {
                    $(this).addClass(wijCSS.stateHover);
                }, function () {
                    $(this).removeClass(wijCSS.stateHover);
                }).click(function () {
                    if (self._getVideoAttribute("readyState")) {
                        self._volumnOn = !self._volumnOn;
                        if (!self._volumnOn) {
                            self._currentVolumn = self.$volumeSlider.slider('value');
                            self.$volumeSlider.slider('value', 0);
                            self._setVideoAttribute('volume', 0);
                            self.$volumeBtn.find("span").removeClass(wijCSS.iconVolumeOn).addClass(wijCSS.iconVolumeOff);
                        } else {
                            //self.currentVolumn = self.currentVolumn === 0 ? 100 : self.currentVolumn;
                            self.$volumeSlider.slider('value', self._currentVolumn ? self._currentVolumn : 1);
                            self._setVideoAttribute('volume', self._currentVolumn ? self._currentVolumn : 1);
                            self.$volumeBtn.find("span").removeClass(wijCSS.iconVolumeOff).addClass(wijCSS.iconVolumeOn);
                        }
                    }
                });

                //move the init tooltip to interval, when the video's state
                //is ready, then init the tooltip
                //self._initialToolTip();
                self.$video.bind('play.' + self.widgetName, function () {
                    $playbtn.removeClass(wijCSS.icon + " " + wijCSS.iconPlay).addClass(wijCSS.icon + " " + wijCSS.iconPause);
                });

                self.$video.bind('pause.' + self.widgetName, function () {
                    $playbtn.removeClass(wijCSS.icon + " " + wijCSS.iconPause).addClass(wijCSS.icon + " " + wijCSS.iconPlay);
                });

                self.$video.bind('ended.' + self.widgetName, function () {
                    self.pause();
                });

                self.$video.bind('timeupdate.' + self.widgetName, function () {
                    self._updateTime();
                });
            };

            wijvideo.prototype._layout = function () {
                var self = this, ele = self.element;
                self._createVideoDom();

                self.$vidParent = self.$video.parent('.' + localCss.wijvideoClass);

                // size the div wrapper to the height and width of the controls
                self.$vidParent.width(self.$video.outerWidth()).height(self.$video.outerHeight());
                self.$wijvideoControl = self.$video.parent().find('.' + localCss.wijvideoControlsClass);

                //Volumn
                self._volumnOn = true;
                self.$volumeBtn = self.$vidParent.find('.' + localCss.wijvideoVolumeClass);
                self._initialSlideControl();

                //update for visibility change
                if (ele.is(":hidden") && ele.wijAddVisibilityObserver) {
                    ele.wijAddVisibilityObserver(function () {
                        self._refresh();
                        if (ele.wijRemoveVisibilityObserver) {
                            ele.wijRemoveVisibilityObserver();
                        }
                    }, "wijvideo");
                }
            };

            wijvideo.prototype._create = function () {
                var self = this, ele = self.element;

                if (ele.is("video")) {
                    self.$video = ele;
                } else {
                    self.$video = ele.find("video");
                }

                //update for fixing bug 18129 by wh at 2011/11/2
                if (!self.$video || self.$video.length === 0 || ($.browser.msie && parseInt($.browser.version, 10) < 9)) {
                    return;
                }

                //end for fixing
                //Add for fixing bug 18204 by wh at 2011/11/7
                if (!self.$video[0]["canPlayType"]) {
                    return;
                }

                //end for fixing bug 18204
                self._layout();
                self._bindEvents();

                self._videoIsControls = false;
                if (self._getVideoAttribute("controls")) {
                    self._videoIsControls = true;
                }
                self.$video.removeAttr('controls');

                _super.prototype._create.call(this);
            };

            wijvideo.prototype._setOption = function (key, value) {
                var self = this, o = self.options, wijvideoControl = self.$video.parent().find('.' + localCss.wijvideoControlsClass), wijvideoFullScreen = self.$video.parent().find('.' + localCss.wijvideoFullScreenClass);

                _super.prototype._setOption.call(this, key, value);

                if (key === "fullScreenButtonVisible") {
                    o.fullScreenButtonVisible = value;
                    if (value) {
                        wijvideoFullScreen.show();
                    } else {
                        wijvideoFullScreen.hide();
                    }
                } else if (key === "showControlsOnHover") {
                    if (!value) {
                        self.$vidParent.unbind('mouseenter mouseleave');
                        wijvideoControl.show();
                        self.$vidParent.height(self.$video.outerHeight() + wijvideoControl.height());
                    } else {
                        this.$vidParent.height(this.$video.outerHeight());
                        wijvideoControl.hide();
                        self.$vidParent.hover(function () {
                            wijvideoControl.stop(true, true).fadeIn();
                        }, function () {
                            wijvideoControl.delay(300).fadeOut();
                        });
                    }
                }
                //end for disabled option
            };

            wijvideo.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                if (!this._getVideoAttribute("readyState"))
                    return;

                this._handleDisabledOption(true, this.element);
            };

            wijvideo.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._handleDisabledOption(false, this.element);
            };

            wijvideo.prototype._handleDisabledOption = function (disabled, ele) {
                var self = this, wijvideoControl = self.$video.parent().find('.' + localCss.wijvideoControlsClass);

                self.$vidParent.toggleClass(this.options.wijCSS.stateDisabled, disabled);
                if (disabled) {
                    if (!self.$disabledDiv) {
                        self.$disabledDiv = self._createDisabledDiv(ele);
                    }
                    self.$disabledDiv.appendTo("body");
                    self.pause();
                } else {
                    if (self.$disabledDiv) {
                        self.$disabledDiv.remove();
                        self.$disabledDiv = null;
                    }
                }
            };

            wijvideo.prototype._createDisabledDiv = function (outerEle) {
                var ele = this.$vidParent, eleOffset = ele.offset(), disabledWidth = ele.outerWidth(), disabledHeight = ele.outerHeight();

                return $("<div></div>").addClass(this.options.wijCSS.stateDisabled).css({
                    "background-color": "lightgray",
                    "z-index": "99999",
                    position: "absolute",
                    width: disabledWidth,
                    height: disabledHeight,
                    left: eleOffset.left,
                    top: eleOffset.top
                });
            };

            wijvideo.prototype._getVideoAttribute = function (name) {
                if (name === "") {
                    return null;
                }
                return this.$video.prop(name);
            };

            wijvideo.prototype._setVideoAttribute = function (name, value) {
                if (name === "") {
                    return null;
                }
                return this.$video.prop(name, value);
            };

            wijvideo.prototype._initToolTip = function () {
                var self = this, wijCSS = self.options.wijCSS, videoClass = [localCss.wijvideoClass, wijCSS.wijvideo].join(" ");

                //ToolTip-slider
                this.$seekSlider.wijtooltip({
                    mouseTrailing: true, showCallout: false,
                    position: { offset: '-60 -60' }
                });
                this.$seekSlider.bind("mousemove", function (e) {
                    self._seekSliderSkimming(e);
                });

                //ToolTip-button
                this.$volumeBtn.wijtooltip({
                    content: self._localizeString("volumeToolTip", "Volume"),
                    showCallout: false
                });
                this.$fullScreenBtn.wijtooltip({
                    content: self._localizeString("fullScreenToolTip", "Full Screen"),
                    showCallout: false
                });

                //add class to prevent from overriding the origin css of tooltip.
                this.$seekSlider.wijtooltip("widget").addClass(videoClass);
                this.$volumeBtn.wijtooltip("widget").addClass(videoClass);
                this.$volumeBtn.wijtooltip("widget").addClass(videoClass);
            };

            wijvideo.prototype._updateTime = function () {
                var self = this, currentTime = self._getVideoAttribute("currentTime");

                self.$vidParent.find('.' + localCss.wijvideoTimerClass).html(self._getTimeString(currentTime));
                if (!self._seeking && self.$seekSlider.data("ui-slider")) {
                    self.$seekSlider.slider('value', currentTime);
                }
            };

            wijvideo.prototype._togglePlay = function () {
                var self = this;

                if (!self._getVideoAttribute("readyState")) {
                    return;
                }

                if (self._getVideoAttribute("paused")) {
                    self.play();
                } else {
                    self.pause();
                }
            };

            wijvideo.prototype._toggleFullScreen = function () {
                var self = this, wijCSS = self.options.wijCSS, isPaused = self._getVideoAttribute("paused"), offsetWidth, fWidth = $(window).width(), fHeight = $(window).height();

                self._fullScreen = !self._fullScreen;

                if (self._fullScreen) {
                    self._oriVidParentStyle = self.$vidParent.attr("style");
                    self._oriWidth = self.$video.outerWidth();
                    self._oriHeight = self.$video.outerHeight();
                    self._oriDocOverFlow = $(document.documentElement).css("overflow");

                    $(document.documentElement).css({
                        overflow: "hidden"
                    });

                    if (!self.$replacedDiv) {
                        self.$replacedDiv = $("<div />");
                    }

                    self.$vidParent.after(self.$replacedDiv);
                    self.$vidParent.addClass(localCss.wijvideoContainerFullScreenClass).addClass(wijCSS.wijvideoContainerFullScreen).css({
                        width: fWidth,
                        height: fHeight
                    }).appendTo($("body"));

                    self.$video.attr("width", fWidth).attr("height", fHeight);

                    $(window).bind("resize.wijvideo", function () {
                        self._adjustFullScreen();
                    });

                    //for reposition the video control
                    offsetWidth = fWidth - self._oriWidth;
                } else {
                    $(document.documentElement).css({
                        overflow: self._oriDocOverFlow
                    });

                    //for reposition the video control
                    offsetWidth = self._oriWidth - self.$video.width();

                    self.$replacedDiv.after(self.$vidParent).remove();
                    self.$vidParent.removeClass(localCss.wijvideoContainerFullScreenClass).removeClass(wijCSS.wijvideoContainerFullScreen).attr("style", self._oriVidParentStyle);

                    self.$video.attr("width", self._oriWidth).attr("height", self._oriHeight);

                    $(window).unbind("resize.wijvideo");
                }

                self._positionControls(offsetWidth);
                self._hideToolTips();

                if (!isPaused) {
                    self.play();
                } else {
                    self.pause();
                }
            };

            wijvideo.prototype._adjustFullScreen = function () {
                var self = this, fWidth = $(window).width(), fHeight = $(window).height(), offsetWidth = fWidth - self.$vidParent.width();

                self.$vidParent.css({
                    width: fWidth,
                    height: fHeight
                });
                self.$video.attr("width", fWidth).attr("height", fHeight);

                self._positionControls(offsetWidth);
            };

            wijvideo.prototype._positionControls = function (offsetWidth) {
                var seekSlider = this.$vidParent.find('.' + localCss.wijvideoIndexSliderClass);

                seekSlider.width(seekSlider.width() + offsetWidth);
            };

            wijvideo.prototype._seekSliderSkimming = function (e) {
                var self = this, mousePositionX = e.pageX, sliderOffset = self.$seekSlider.offset().left, sliderWidth = self.$seekSlider.width(), curWidth = mousePositionX - sliderOffset, duration = self._getVideoAttribute("duration"), skimmingTime = duration * (curWidth / sliderWidth);

                self.$seekSlider.wijtooltip("option", "content", self._getTimeString(skimmingTime));
            };

            wijvideo.prototype._hideToolTips = function () {
                if (this.$seekSlider.data("wijmo-wijtooltip")) {
                    this.$seekSlider.wijtooltip("hide");
                }
                if (this.$volumeBtn.data("wijmo-wijtooltip")) {
                    this.$volumeBtn.wijtooltip("hide");
                }
                if (this.$fullScreenBtn.data("wijmo-wijtooltip")) {
                    this.$fullScreenBtn.wijtooltip("hide");
                }
            };

            wijvideo.prototype._localizeString = function (key, defaultValue) {
                var o = this.options;
                if (o.localization && o.localization[key]) {
                    return o.localization[key];
                }
                return defaultValue;
            };

            wijvideo.prototype._getTimeString = function (time) {
                var mfmt = '', sfmt = '', mm = parseInt((time / 60).toString(), 10), ss = parseInt((time - (mm * 60)).toString(), 10);
                if (mm < 10) {
                    mfmt = '0';
                }
                if (ss < 10) {
                    sfmt = '0';
                }
                return mfmt + mm + ':' + sfmt + ss;
            };

            wijvideo.prototype._refresh = function () {
                var pos, wijvideoControl = this.$video.parent().find('.' + localCss.wijvideoControlsClass);

                wijvideoControl.show();
                pos = this.$vidParent.find('.' + localCss.wijvideoTimerClass).position().left;

                this.$seekSlider.width(pos - this.$seekSlider.position().left - 15);
                wijvideoControl.hide();
                if (!this.options.showControlsOnHover) {
                    wijvideoControl.show();
                    this.$vidParent.height(this.$video.outerHeight() + wijvideoControl.height());
                }
            };

            /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            wijvideo.prototype.destroy = function () {
                var self = this;
                _super.prototype.destroy.call(this);

                //remove the controls
                self.$vidParent.after(self.$video).remove();
                self.$video.unbind('.' + self.widgetName);
                if (self._videoIsControls) {
                    self._setVideoAttribute("controls", true);
                }
                if (self.$disabledDiv) {
                    self.$disabledDiv.remove();
                    self.$disabledDiv = null;
                }
            };

            /** Play the video.
            */
            wijvideo.prototype.play = function () {
                var video = this.$video[0];
                video.play();
            };

            /** Pause the video.
            */
            wijvideo.prototype.pause = function () {
                var video = this.$video[0];
                video.pause();
            };

            /** Gets the video width in pixel.
            */
            wijvideo.prototype.getWidth = function () {
                return this.$video.outerWidth();
            };

            /** Sets the video width in pixel.
            * @param {number} width Width value in pixel.
            * @example
            * // Sets the video width to 600 pixel.
            * $("#element").wijvideo("setWidth", 600);
            */
            wijvideo.prototype.setWidth = function (width) {
                var origWidth = this.getWidth();
                width = width || 600;
                this.$video.attr('width', width);
                this.$vidParent.width(this.$video.outerWidth());
                this._positionControls(this.getWidth() - origWidth);
            };

            /** Gets the video height in pixel.
            */
            wijvideo.prototype.getHeight = function () {
                return this.$video.outerHeight();
            };

            /** Sets the video height in pixel.
            * @param {number} height Height value in pixel.
            * @example
            * // Sets the video height to 400 pixel.
            * $("#element").wijvideo("setHeight", 400);
            */
            wijvideo.prototype.setHeight = function (height) {
                height = height || 400;
                this.$video.attr('height', height);
                if (this.options.showControlsOnHover) {
                    this.$vidParent.height(this.$video.outerHeight());
                } else {
                    this.$vidParent.height(this.$video.outerHeight() + this.$video.parent().find('.' + localCss.wijvideoControlsClass).height());
                }
            };
            return wijvideo;
        })(wijmo.wijmoWidget);
        _video.wijvideo = wijvideo;

        var wijvideo_options = (function () {
            function wijvideo_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijvideo')";
                /** All CSS classes used in widgets that use jQuery UI CSS Framework.
                * @ignore
                */
                this.wijCSS = {
                    iconVolumeOn: "ui-icon-volume-on",
                    iconVolumeOff: "ui-icon-volume-off",
                    wijvideo: "",
                    wijvideoWrapper: "",
                    wijvideoControls: "",
                    wijvideoPlay: "",
                    wijvideoIndex: "",
                    wijvideoIndexSlider: "",
                    wijvideoTimer: "",
                    wijvideoVolume: "",
                    wijvideoVolumeContainer: "",
                    wijvideoVolumeSlider: "",
                    wijvideoFullScreen: "",
                    wijvideoContainerFullScreen: ""
                };
                /** A value that indicates whether to show the full screen button. */
                this.fullScreenButtonVisible = true;
                /** Determines whether to display the controls only when hovering the mouse to the video. */
                this.showControlsOnHover = true;
                /** Use the localization option in order to localize text which not depends on culture.
                * @remarks
                * The default localization: {
                *	    volumeToolTip: "Volume",
                *	    fullScreenToolTip: "Full Screen"
                *      }
                * @example
                * $("#video").wijvideo(
                *			{
                *				localization: {
                *				volumeToolTip: "newVolume",
                *				fullScreenToolTip: "newFullScreen"
                *			}
                *		});
                */
                this.localization = null;
            }
            return wijvideo_options;
        })();

        wijvideo.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijvideo_options());

        $.wijmo.registerWidget("wijvideo", wijvideo.prototype);
    })(wijmo.video || (wijmo.video = {}));
    var video = wijmo.video;
})(wijmo || (wijmo = {}));


