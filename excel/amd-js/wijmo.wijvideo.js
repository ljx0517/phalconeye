var wijmo;define(["globalize","./wijmo.widget","./wijmo.wijtooltip"],function(){var e=this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);r.prototype=t.prototype,e.prototype=new r};(function(t){(function(n){"use strict";var r=jQuery,i={widgetName:"wijvideo",wijvideoClass:"wijmo-wijvideo",wijvideoWrapperClass:"wijmo-wijvideo-wrapper",wijvideoControlsClass:"wijmo-wijvideo-controls",wijvideoPlayClass:"wijmo-wijvideo-play",wijvideoIndexClass:"wijmo-wijvideo-index",wijvideoIndexSliderClass:"wijmo-wijvideo-index-slider",wijvideoTimerClass:"wijmo-wijvideo-timer",wijvideoVolumeClass:"wijmo-wijvideo-volume",wijvideoVolumeContainerClass:"wijmo-wijvideo-volume-container",wijvideoVolumeSliderClass:"wijmo-wijvideo-volumeslider",wijvideoFullScreenClass:"wijmo-wijvideo-fullscreen",wijvideoContainerFullScreenClass:"wijmo-wijvideo-container-fullscreen"},s=function(t){function n(){t.apply(this,arguments)}return e(n,t),n.prototype._createVideoDom=function(){var e=this.options.wijCSS,t=" ",n=[i.wijvideoClass,e.wijvideo,e.content,e.widget].join(t),s=[i.wijvideoWrapperClass,e.wijvideoWrapper].join(t),o=[i.wijvideoControlsClass,e.wijvideoControls,e.header,e.helperClearFix,e.helperReset].join(t),u=[i.wijvideoPlayClass,e.wijvideoPlay,e.stateDefault,e.cornerAll].join(t),a=[e.icon,e.iconPlay].join(t),f=[i.wijvideoIndexClass,e.wijvideoIndex].join(t),l=[i.wijvideoIndexSliderClass,e.wijvideoIndexSlider].join(t),c=[i.wijvideoTimerClass,e.wijvideoTimer,e.stateDefault].join(t),h=[i.wijvideoVolumeClass,e.wijvideoVolume,e.stateDefault,e.cornerAll].join(t),p=[i.wijvideoVolumeContainerClass,e.wijvideoVolumeContainer].join(t),d=[i.wijvideoVolumeSliderClass,e.wijvideoVolumeSlider,e.stateDefault,e.cornerTop].join(t),v=[e.icon,e.iconVolumeOn].join(t),m=[i.wijvideoFullScreenClass,e.wijvideoFullScreen,e.stateDefault,e.cornerAll].join(t),g=[e.icon,e.iconArrow4Diag].join(t),y,b;y=r("<div>").addClass(n),b=r("<div>").addClass(s).append(r("<ul>").addClass(o).append(r("<li>").addClass(u).append(r("<span>").addClass(a))).append(r("<li>").addClass(f).append(r("<div>").addClass(l))).append(r("<li>00:00</li>").addClass(c)).append(r("<li>").addClass(h).append(r("<div>").addClass(p).append(r("<div>").addClass(d))).append(r("<span>").addClass(v))).append(r("<li>").addClass(m).append(r("<span>").addClass(g)))),this.$video.wrap(y).after(b)},n.prototype._initialSlideControl=function(){var e=this,t,n,r=e.options.wijCSS,s=e.options;e.$seekSlider=e.$vidParent.find("."+i.wijvideoIndexSliderClass),n=window.setInterval(function(){e._getVideoAttribute("readyState")&&(window.clearInterval(n),e.$vidParent.width(e.$video.outerWidth()).height(e.$video.outerHeight()),e.$wijvideoControl.show(),t=e.$vidParent.find("."+i.wijvideoTimerClass).position().left,e.$seekSlider.width(t-e.$seekSlider.position().left-15),e.$seekSlider.slider({value:0,step:.01,max:e._getVideoAttribute("duration"),range:"min",stop:function(t,n){e._seeking=!1,e._setVideoAttribute("currentTime",n.value)},slide:function(){e._seeking=!0}}).slider("widget").addClass(s.wijCSS.stateDefault),e._updateTime(),e.$volumeSlider=e.$vidParent.find("."+i.wijvideoVolumeSliderClass),e.$volumeSlider.slider({min:0,max:1,value:e._getVideoAttribute("volume"),step:.1,orientation:"vertical",range:"min",slide:function(t,n){e._setVideoAttribute("volume",n.value),n.value===0?(e._volumnOn=!1,e.$volumeBtn.find("span").removeClass(r.iconVolumeOn).addClass(r.iconVolumeOff)):(e._volumnOn=!0,e.$volumeBtn.find("span").removeClass(r.iconVolumeOff).addClass(r.iconVolumeOn))}}).slider("widget").addClass(s.wijCSS.stateDefault),e.$wijvideoControl.hide(),e._initToolTip(),s.showControlsOnHover||(e.$wijvideoControl.show(),e.$vidParent.height(e.$video.outerHeight()+e.$wijvideoControl.height()))),e._isDisabled()&&(e.$disabledDiv&&(e.$disabledDiv.remove(),e.$disabledDiv=null),e._handleDisabledOption(!0,e.element))},200)},n.prototype._bindEvents=function(){var e=this,t,n=e.options.wijCSS,s=e.options;e.$video.bind("click."+e.widgetName,function(){e._togglePlay()}),s.showControlsOnHover&&e.$vidParent.hover(function(){e.$wijvideoControl.stop(!0,!0).fadeIn()},function(){e.$wijvideoControl.delay(300).fadeOut()}),t=e.$vidParent.find("."+i.wijvideoPlayClass+" > span"),t.click(function(){e._togglePlay()}).parent().hover(function(){r(this).addClass(n.stateHover)},function(){r(this).removeClass(n.stateHover)}),e.$vidParent.find("."+i.wijvideoVolumeClass).hover(function(){r("."+i.wijvideoVolumeContainerClass).stop(!0,!0).slideToggle()}),e.$fullScreenBtn=e.$vidParent.find("."+i.wijvideoFullScreenClass+" > span"),e.$fullScreenBtn.click(function(){e._toggleFullScreen()}).parent().hover(function(){r(this).addClass(n.stateHover)},function(){r(this).removeClass(n.stateHover)}),e.options.fullScreenButtonVisible||e.$vidParent.find("."+i.wijvideoFullScreenClass).hide(),e.$volumeBtn.hover(function(){r(this).addClass(n.stateHover)},function(){r(this).removeClass(n.stateHover)}).click(function(){e._getVideoAttribute("readyState")&&(e._volumnOn=!e._volumnOn,e._volumnOn?(e.$volumeSlider.slider("value",e._currentVolumn?e._currentVolumn:1),e._setVideoAttribute("volume",e._currentVolumn?e._currentVolumn:1),e.$volumeBtn.find("span").removeClass(n.iconVolumeOff).addClass(n.iconVolumeOn)):(e._currentVolumn=e.$volumeSlider.slider("value"),e.$volumeSlider.slider("value",0),e._setVideoAttribute("volume",0),e.$volumeBtn.find("span").removeClass(n.iconVolumeOn).addClass(n.iconVolumeOff)))}),e.$video.bind("play."+e.widgetName,function(){t.removeClass(n.icon+" "+n.iconPlay).addClass(n.icon+" "+n.iconPause)}),e.$video.bind("pause."+e.widgetName,function(){t.removeClass(n.icon+" "+n.iconPause).addClass(n.icon+" "+n.iconPlay)}),e.$video.bind("ended."+e.widgetName,function(){e.pause()}),e.$video.bind("timeupdate."+e.widgetName,function(){e._updateTime()})},n.prototype._layout=function(){var e=this,t=e.element;e._createVideoDom(),e.$vidParent=e.$video.parent("."+i.wijvideoClass),e.$vidParent.width(e.$video.outerWidth()).height(e.$video.outerHeight()),e.$wijvideoControl=e.$video.parent().find("."+i.wijvideoControlsClass),e._volumnOn=!0,e.$volumeBtn=e.$vidParent.find("."+i.wijvideoVolumeClass),e._initialSlideControl(),t.is(":hidden")&&t.wijAddVisibilityObserver&&t.wijAddVisibilityObserver(function(){e._refresh(),t.wijRemoveVisibilityObserver&&t.wijRemoveVisibilityObserver()},"wijvideo")},n.prototype._create=function(){var e=this,n=e.element;n.is("video")?e.$video=n:e.$video=n.find("video");if(!e.$video||e.$video.length===0||r.browser.msie&&parseInt(r.browser.version,10)<9)return;if(!e.$video[0].canPlayType)return;e._layout(),e._bindEvents(),e._videoIsControls=!1,e._getVideoAttribute("controls")&&(e._videoIsControls=!0),e.$video.removeAttr("controls"),t.prototype._create.call(this)},n.prototype._setOption=function(e,n){var r=this,s=r.options,o=r.$video.parent().find("."+i.wijvideoControlsClass),u=r.$video.parent().find("."+i.wijvideoFullScreenClass);t.prototype._setOption.call(this,e,n),e==="fullScreenButtonVisible"?(s.fullScreenButtonVisible=n,n?u.show():u.hide()):e==="showControlsOnHover"&&(n?(this.$vidParent.height(this.$video.outerHeight()),o.hide(),r.$vidParent.hover(function(){o.stop(!0,!0).fadeIn()},function(){o.delay(300).fadeOut()})):(r.$vidParent.unbind("mouseenter mouseleave"),o.show(),r.$vidParent.height(r.$video.outerHeight()+o.height())))},n.prototype._innerDisable=function(){t.prototype._innerDisable.call(this);if(!this._getVideoAttribute("readyState"))return;this._handleDisabledOption(!0,this.element)},n.prototype._innerEnable=function(){t.prototype._innerEnable.call(this),this._handleDisabledOption(!1,this.element)},n.prototype._handleDisabledOption=function(e,t){var n=this,r=n.$video.parent().find("."+i.wijvideoControlsClass);n.$vidParent.toggleClass(this.options.wijCSS.stateDisabled,e),e?(n.$disabledDiv||(n.$disabledDiv=n._createDisabledDiv(t)),n.$disabledDiv.appendTo("body"),n.pause()):n.$disabledDiv&&(n.$disabledDiv.remove(),n.$disabledDiv=null)},n.prototype._createDisabledDiv=function(e){var t=this.$vidParent,n=t.offset(),i=t.outerWidth(),s=t.outerHeight();return r("<div></div>").addClass(this.options.wijCSS.stateDisabled).css({"background-color":"lightgray","z-index":"99999",position:"absolute",width:i,height:s,left:n.left,top:n.top})},n.prototype._getVideoAttribute=function(e){return e===""?null:this.$video.prop(e)},n.prototype._setVideoAttribute=function(e,t){return e===""?null:this.$video.prop(e,t)},n.prototype._initToolTip=function(){var e=this,t=e.options.wijCSS,n=[i.wijvideoClass,t.wijvideo].join(" ");this.$seekSlider.wijtooltip({mouseTrailing:!0,showCallout:!1,position:{offset:"-60 -60"}}),this.$seekSlider.bind("mousemove",function(t){e._seekSliderSkimming(t)}),this.$volumeBtn.wijtooltip({content:e._localizeString("volumeToolTip","Volume"),showCallout:!1}),this.$fullScreenBtn.wijtooltip({content:e._localizeString("fullScreenToolTip","Full Screen"),showCallout:!1}),this.$seekSlider.wijtooltip("widget").addClass(n),this.$volumeBtn.wijtooltip("widget").addClass(n),this.$volumeBtn.wijtooltip("widget").addClass(n)},n.prototype._updateTime=function(){var e=this,t=e._getVideoAttribute("currentTime");e.$vidParent.find("."+i.wijvideoTimerClass).html(e._getTimeString(t)),!e._seeking&&e.$seekSlider.data("ui-slider")&&e.$seekSlider.slider("value",t)},n.prototype._togglePlay=function(){var e=this;if(!e._getVideoAttribute("readyState"))return;e._getVideoAttribute("paused")?e.play():e.pause()},n.prototype._toggleFullScreen=function(){var e=this,t=e.options.wijCSS,n=e._getVideoAttribute("paused"),s,o=r(window).width(),u=r(window).height();e._fullScreen=!e._fullScreen,e._fullScreen?(e._oriVidParentStyle=e.$vidParent.attr("style"),e._oriWidth=e.$video.outerWidth(),e._oriHeight=e.$video.outerHeight(),e._oriDocOverFlow=r(document.documentElement).css("overflow"),r(document.documentElement).css({overflow:"hidden"}),e.$replacedDiv||(e.$replacedDiv=r("<div />")),e.$vidParent.after(e.$replacedDiv),e.$vidParent.addClass(i.wijvideoContainerFullScreenClass).addClass(t.wijvideoContainerFullScreen).css({width:o,height:u}).appendTo(r("body")),e.$video.attr("width",o).attr("height",u),r(window).bind("resize.wijvideo",function(){e._adjustFullScreen()}),s=o-e._oriWidth):(r(document.documentElement).css({overflow:e._oriDocOverFlow}),s=e._oriWidth-e.$video.width(),e.$replacedDiv.after(e.$vidParent).remove(),e.$vidParent.removeClass(i.wijvideoContainerFullScreenClass).removeClass(t.wijvideoContainerFullScreen).attr("style",e._oriVidParentStyle),e.$video.attr("width",e._oriWidth).attr("height",e._oriHeight),r(window).unbind("resize.wijvideo")),e._positionControls(s),e._hideToolTips(),n?e.pause():e.play()},n.prototype._adjustFullScreen=function(){var e=this,t=r(window).width(),n=r(window).height(),i=t-e.$vidParent.width();e.$vidParent.css({width:t,height:n}),e.$video.attr("width",t).attr("height",n),e._positionControls(i)},n.prototype._positionControls=function(e){var t=this.$vidParent.find("."+i.wijvideoIndexSliderClass);t.width(t.width()+e)},n.prototype._seekSliderSkimming=function(e){var t=this,n=e.pageX,r=t.$seekSlider.offset().left,i=t.$seekSlider.width(),s=n-r,o=t._getVideoAttribute("duration"),u=o*(s/i);t.$seekSlider.wijtooltip("option","content",t._getTimeString(u))},n.prototype._hideToolTips=function(){this.$seekSlider.data("wijmo-wijtooltip")&&this.$seekSlider.wijtooltip("hide"),this.$volumeBtn.data("wijmo-wijtooltip")&&this.$volumeBtn.wijtooltip("hide"),this.$fullScreenBtn.data("wijmo-wijtooltip")&&this.$fullScreenBtn.wijtooltip("hide")},n.prototype._localizeString=function(e,t){var n=this.options;return n.localization&&n.localization[e]?n.localization[e]:t},n.prototype._getTimeString=function(e){var t="",n="",r=parseInt((e/60).toString(),10),i=parseInt((e-r*60).toString(),10);return r<10&&(t="0"),i<10&&(n="0"),t+r+":"+n+i},n.prototype._refresh=function(){var e,t=this.$video.parent().find("."+i.wijvideoControlsClass);t.show(),e=this.$vidParent.find("."+i.wijvideoTimerClass).position().left,this.$seekSlider.width(e-this.$seekSlider.position().left-15),t.hide(),this.options.showControlsOnHover||(t.show(),this.$vidParent.height(this.$video.outerHeight()+t.height()))},n.prototype.destroy=function(){var e=this;t.prototype.destroy.call(this),e.$vidParent.after(e.$video).remove(),e.$video.unbind("."+e.widgetName),e._videoIsControls&&e._setVideoAttribute("controls",!0),e.$disabledDiv&&(e.$disabledDiv.remove(),e.$disabledDiv=null)},n.prototype.play=function(){var e=this.$video[0];e.play()},n.prototype.pause=function(){var e=this.$video[0];e.pause()},n.prototype.getWidth=function(){return this.$video.outerWidth()},n.prototype.setWidth=function(e){var t=this.getWidth();e=e||600,this.$video.attr("width",e),this.$vidParent.width(this.$video.outerWidth()),this._positionControls(this.getWidth()-t)},n.prototype.getHeight=function(){return this.$video.outerHeight()},n.prototype.setHeight=function(e){e=e||400,this.$video.attr("height",e),this.options.showControlsOnHover?this.$vidParent.height(this.$video.outerHeight()):this.$vidParent.height(this.$video.outerHeight()+this.$video.parent().find("."+i.wijvideoControlsClass).height())},n}(t.wijmoWidget);n.wijvideo=s;var o=function(){function e(){this.initSelector=":jqmData(role='wijvideo')",this.wijCSS={iconVolumeOn:"ui-icon-volume-on",iconVolumeOff:"ui-icon-volume-off",wijvideo:"",wijvideoWrapper:"",wijvideoControls:"",wijvideoPlay:"",wijvideoIndex:"",wijvideoIndexSlider:"",wijvideoTimer:"",wijvideoVolume:"",wijvideoVolumeContainer:"",wijvideoVolumeSlider:"",wijvideoFullScreen:"",wijvideoContainerFullScreen:""},this.fullScreenButtonVisible=!0,this.showControlsOnHover=!0,this.localization=null}return e}();s.prototype.options=r.extend(!0,{},t.wijmoWidget.prototype.options,new o),r.wijmo.registerWidget("wijvideo",s.prototype)})(t.video||(t.video={}));var n=t.video})(wijmo||(wijmo={}))});