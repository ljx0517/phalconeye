var wijmo;define(["./wijmo.widget"],function(){var e=this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);r.prototype=t.prototype,e.prototype=new r};(function(t){(function(n){"use strict";var r=jQuery,i="wijsplitter",s=function(t){function n(){t.apply(this,arguments)}return e(n,t),n.prototype._setFullSplit=function(e){var t=this,n=t._fields,r=e?"100%":n.width,i=e?"100%":n.height;t.element.css("width",r).css("height",i)},n.prototype._setOption=function(e,n){var i=this,s=i.options,o,u=r.extend({},s[e]);if(e==="fullSplit")i._setFullSplit(n);else if(r.isPlainObject(s[e])){e==="panel1"&&n.collapsed!==undefined?i._setPanel1Collapsed(n.collapsed):e==="panel2"&&n.collapsed!==undefined&&i._setPanel2Collapsed(n.collapsed),s[e]=r.extend(!0,s[e],n),e==="resizeSettings"&&i._initResizer();return}t.prototype._setOption.call(this,e,n),u!==n&&(e==="orientation"?i.refresh():e==="collapsingPanel"?i.refresh():e==="fullSplit"?i.refresh(!0,!1):e==="splitterDistance"?(i.refresh(!1,!1),i._trigger("sized")):e==="showExpander"&&(o=i._fields.expander,o&&o.length&&o.css("display",n?"":"none")))},n.prototype._innerDisable=function(){t.prototype._innerDisable.call(this),this._handleDisabledOption(!0,this.element)},n.prototype._innerEnable=function(){t.prototype._innerEnable.call(this),this._handleDisabledOption(!1,this.element)},n.prototype._create=function(){var e=this,n=e.element,i=e.options,s;window.wijmoApplyWijTouchUtilEvents&&(r=window.wijmoApplyWijTouchUtilEvents(r)),i.splitterDistance==100&&(s=this.element.width()-i.panel2.minSize,i.panel1.minSize>i.splitterDistance?i.splitterDistance=i.panel1.minSize:s<i.splitterDistance&&(i.splitterDistance=s)),e._fields={width:n.width(),height:n.height()},i.fullSplit&&e._setFullSplit(!0),e._splitterify(),e._updateElementsCss(),e._updateElements(),e._bindEvents(),e._initResizer(),e.element.wijAddVisibilityObserver&&e.element.wijAddVisibilityObserver(function(){if(e.element.is(":hidden"))return;e.refresh(),i.fullSplit&&(e._updateElements(),e._initResizer())},"wijsplitter"),e._trigger("load",null,e),t.prototype._create.call(this)},n.prototype._handleDisabledOption=function(e,t){var n=this;e?(n.disabledDiv||(n.disabledDiv=n._createDisabledDiv(t)),n.disabledDiv.appendTo("body")):n.disabledDiv&&(n.disabledDiv.remove(),n.disabledDiv=null)},n.prototype.destroy=function(){var e=this,n=e.options,i=e.element,s=e._fields,o=s.wrapper,u=s.expander,a=s.bar,f=s.panel1,l=s.panel2,c=s.originalStyle,h=e.widgetName,p=s.oriPnl1Content,d=s.oriPnl2Content,v=s.oriPnl1ContentStyle,m=s.oriPnl2ContentStyle,g=n.wijCSS,y=g.vSplitterCss,b=g.vSplitterCssPrefix,w=g.hSplitterCss,E=g.hSplitterCssPrefix,S=g.panelCss;r.fn.resizable&&f&&f.n.is(":ui-resizable")&&f.n.resizable("destroy"),p&&(p.removeClass(b+f.contentCss).removeClass(g.hSplitterCssPrefix+f.contentCss).removeClass(g.content),v===undefined?p.removeAttr("style"):p.attr("style",v),p.appendTo(i)),d&&(d.removeClass(b+l.contentCss).removeClass(g.hSplitterCssPrefix+l.contentCss).removeClass(g.content),m===undefined?d.removeAttr("style"):d.attr("style",m),d.appendTo(i)),f.n.unbind("."+h),u.unbind("."+h),a.unbind("."+h),r(window).unbind("."+h),o.remove(),i.removeClass(y).removeClass(w),c===undefined?i.removeAttr("style"):i.attr("style",c),e.disabledDiv&&(e.disabledDiv.remove(),e.disabledDiv=null),e._fields=null,t.prototype.destroy.call(this)},n.prototype.refresh=function(e,t){var n=this,i=n._fields,s=i.panel1;if(i._isResizing)return;(t||t===undefined)&&n._updateElementsCss(),n._updateElements();if(e||e===undefined){if(!r.fn.resizable)return;s&&s.n.is(":ui-resizable")&&s.n.resizable("destroy"),n._initResizer()}},n.prototype._createDisabledDiv=function(e){var t=this,n=e?e:t.element,i=n.offset(),s=n.outerWidth(),o=n.outerHeight(),u={"z-index":"99999",position:"absolute",width:s,height:o,left:i.left,top:i.top};return r.browser.msie&&r.extend(u,{"background-color":"#fff",opacity:.1}),r("<div></div>").addClass(t.options.wijCSS.stateDisabled).css(u)},n.prototype._splitterify=function(){var e=this,t=e.element,n=e.options,i=e._fields,s,o,u,a,f={n:undefined,content:t.find(">div:eq(0)")},l={n:undefined,content:t.find(">div:eq(1)")};i.originalStyle=t.attr("style"),s=r("<div></div>").appendTo(t),f.n=r("<div></div>").appendTo(s),f.content.length===0?f.content=r("<div></div>"):(i.oriPnl1Content=f.content,i.oriPnl1ContentStyle=f.content.attr("style")),f.content.appendTo(f.n),o=r("<div></div>").appendTo(s),n.barZIndex!==-1&&o.css("z-index",n.barZIndex),u=r("<div></div>").appendTo(o).attr("role","button"),a=r("<span></span>").appendTo(u),l.n=r("<div></div>").appendTo(s),l.content.length===0?l.content=r("<div></div>"):(i.oriPnl2Content=l.content,i.oriPnl2ContentStyle=l.content.attr("style")),l.content.appendTo(l.n),i.wrapper=s,i.panel1=f,i.panel2=l,i.bar=o,i.expander=u,i.icon=a},n.prototype._updateElementsCss=function(){var e=this,t=e.element,n=e.options,r=n.orientation==="vertical",i=e._fields,s=i.wrapper,o=n.collapsingPanel,u=n.collapsingPanel==="panel1"?"panel2":"panel1",a=i.bar,f=i.expander,l=i.icon,c=n.wijCSS,h=c.vSplitterCss,p=c.vSplitterCssPrefix,d=c.hSplitterCss,v=c.hSplitterCssPrefix,m=c.panelCss;t.removeClass(h).removeClass(d).addClass(r?h:d),s.attr("class",c.wrapperCss),i[o].n.removeClass(p+m[o].n).removeClass(v+m[o].n).addClass((r?p:v)+m[o].n),i[o].content.removeClass(p+m[o].content).removeClass(v+m[o].content).removeClass(c.content).addClass((r?p:v)+m[o].content).addClass(c.content),a.attr("class",(r?p:v)+c.barCss+" "+c.header).css("width","").css("height",""),f.attr("class",c.cornerCssPrefix+(r?"bl "+p:"tr "+v)+c.expanderCss+" "+c.stateDefault).css("left","").css("top",""),l.attr("class",c.icon+" "+(r?c.iconArrowLeft:c.iconArrowUp)),i[u].n.removeClass(p+m[u].n).removeClass(v+m[u].n).addClass((r?p:v)+m[u].n),i[u].content.removeClass(p+m[u].content).removeClass(v+m[u].content).removeClass(c.content).addClass((r?p:v)+m[u].content).addClass(c.content),e._updateExpanderCss()},n.prototype._updateExpanderCss=function(){var e=this,t=e.options,n=e._fields,r=n.expander,i=n.icon,s=t.wijCSS,o=s.cornerCssPrefix,u=t.orientation==="vertical",a=t.collapsingPanel!=="panel1",f=u?s.vSplitterCssPrefix:s.hSplitterCssPrefix,l=(u?1:0)*2+(a?1:0),c=["bl","tr","tr","bl"][l],h=["br","tl"][+a],p=[s.iconArrowDown,s.iconArrowUp,s.iconArrowRight,s.iconArrowLeft][l],d=["tr","bl","bl","tr"][l],v=["tl","br"][+a],m=[s.iconArrowUp,s.iconArrowDown,s.iconArrowLeft,s.iconArrowRight][l];r.removeClass(f+t.collapsingPanel+"-"+s.expandedCss).removeClass(f+t.collapsingPanel+"-"+s.collapsedCss).removeClass(o+c).removeClass(o+h).removeClass(o+d).removeClass(o+v),i.removeClass(p).removeClass(m),t.panel1.collapsed||t.panel2.collapsed?(r.addClass(o+c).addClass(o+h).addClass(f+t.collapsingPanel+"-"+s.collapsedCss),i.addClass(p)):(r.addClass(o+d).addClass(o+v).addClass(f+t.collapsingPanel+"-"+s.expandedCss),i.addClass(m))},n.prototype._AddVisiblity=function(e){e.wijTriggerVisibility&&e.wijTriggerVisibility()},n.prototype._updateElements=function(){var e=this,t=e.element,n=e.options,r=n.splitterDistance,i=n.collapsingPanel,s=n.collapsingPanel==="panel1"?"panel2":"panel1",o=e._fields,u=o.wrapper,a=o.panel1,f=o.panel2,l=o.bar,c=o.expander,h=t.width(),p=t.height(),d,v;u.height(p),e._setPanelsScrollMode(),n.orientation==="vertical"?(d=l.outerWidth(!0),r>h-d&&(r=h-d),u.width(h*2),n.panel1.collapsed?(i==="panel1"&&c.addClass(n.wijCSS.vSplitterCssPrefix+"panel1"+"-"+n.wijCSS.collapsedCss),o.panel1.n.css("display","none"),o.panel2.n.css("display",""),this._AddVisiblity(o.panel2.n),r=0):(i==="panel1"&&c.addClass(n.wijCSS.vSplitterCssPrefix+"panel1"+"-"+n.wijCSS.expandedCss),o.panel1.n.css("display",""),this._AddVisiblity(o.panel1.n),o.panel2.n.css("display",n.panel2.collapsed?"none":"")),n.panel2.collapsed?(i==="panel2"&&c.addClass(n.wijCSS.vSplitterCssPrefix+"panel2"+"-"+n.wijCSS.collapsedCss),o.panel2.n.css("display","none"),r=i==="panel1"?h-d:h):(i==="panel2"&&c.addClass(n.wijCSS.vSplitterCssPrefix+"panel2"+"-"+n.wijCSS.expandedCss),o.panel2.n.css("display",""),this._AddVisiblity(o.panel2.n)),!n.panel1.collapsed&&!n.panel2.collapsed&&c.addClass(n.wijCSS.vSplitterCssPrefix+n.collapsingPanel+"-"+n.wijCSS.expandedCss),i==="panel1"?(o.panel1.n.height(p).width(r),o.panel2.n.height(p).width(h-r-d)):(o.panel1.n.height(p).width(r-d),o.panel2.n.height(p).width(h-r)),o.panel1.content.outerHeight(p,!0),l.outerHeight(p,!0),o.panel2.content.outerHeight(p,!0),c.css("cursor","pointer").css("top",p/2-c.outerHeight(!0)/2)):(v=l.outerHeight(!0),r>p-v&&(r=p-v),n.panel1.collapsed?(i==="panel1"&&c.addClass(n.wijCSS.hSplitterCssPrefix+"panel1"+"-"+n.wijCSS.collapsedCss),o.panel1.n.css("display","none"),o.panel2.n.css("display",""),this._AddVisiblity(o.panel2.n),r=0):(i==="panel1"&&c.addClass(n.wijCSS.hSplitterCssPrefix+"panel1"+"-"+n.wijCSS.expandedCss),o.panel1.n.css("display",""),this._AddVisiblity(o.panel1.n),o.panel2.n.css("display",n.panel2.collapsed?"none":"")),n.panel2.collapsed?(i==="panel2"&&c.addClass(n.wijCSS.hSplitterCssPrefix+"panel2"+"-"+n.wijCSS.collapsedCss),o.panel2.n.css("display","none"),r=i==="panel1"?p-v:p):(i==="panel2"&&c.addClass(n.wijCSS.hSplitterCssPrefix+"panel2"+"-"+n.wijCSS.expandedCss),o.panel2.n.css("display",""),this._AddVisiblity(o.panel2.n)),i==="panel1"?(o.panel1.n.width(h).height(r),o.panel2.n.width(h).height(p-r-v),o.panel1.content.outerHeight(r,!0),o.panel2.content.outerHeight(p-r-v,!0)):(o.panel1.n.width(h).height(r-v),o.panel2.n.width(h).height(p-r),o.panel1.content.outerHeight(r-v,!0),o.panel2.content.outerHeight(p-r,!0)),c.css("cursor","pointer").css("left",h/2-c.outerWidth(!0)/2)),c.css("display",n.showExpander?"":"none")},n.prototype._bindEvents=function(){var e=this,t=e.options,n=e._fields,i=n.bar,s=n.expander,o=e.widgetName;s.bind("mouseover."+o,function(n){if(e._isDisabled())return;s.addClass(t.wijCSS.stateHover)}).bind("mouseout."+o,function(n){if(e._isDisabled())return;s.removeClass(t.wijCSS.stateHover).removeClass(t.wijCSS.stateActive)}).bind("mousedown."+o,function(n){if(e._isDisabled())return;s.addClass(t.wijCSS.stateActive)}).bind("mouseup."+o,function(n){if(e._isDisabled())return;s.removeClass(t.wijCSS.stateActive),t.collapsingPanel==="panel1"?e._setPanel1Collapsed(!t.panel1.collapsed,n):e._setPanel2Collapsed(!t.panel2.collapsed,n)}),i.bind("mouseover."+o,function(n){if(e._isDisabled())return;i.addClass(t.wijCSS.stateHover)}).bind("mouseout."+o,function(n){if(e._isDisabled())return;i.removeClass(t.wijCSS.stateHover)}),n.panel1.n.bind("animating."+o,function(t){if(e._isDisabled())return;e._adjustLayout(e),e._trigger("sizing",t,null)}).bind("animated."+o,function(t){if(e._isDisabled())return;e._adjustLayout(e),e._trigger("sized",t,null)}),e.element.on("mouseover."+o,".ui-resizable-handle",function(n){if(e._isDisabled())return;i.addClass(t.wijCSS.stateHover)}).on("mouseout."+o,".ui-resizable-handle",function(n){if(e._isDisabled())return;i.removeClass(t.wijCSS.stateHover)}),r(window).bind("resize."+o,function(n){if(e._isDisabled())return;t.fullSplit&&e.element.is(":visible")&&(e._updateElements(),e._initResizer())})},n.prototype._setPanel1Collapsed=function(e,t){var n=this,i=n.options,s=i.panel1.collapsed,o=r(".ui-resizable-handle",n.element);if(s===e)return;if(i.collapsingPanel==="panel1"&&!n._trigger(s?"expand":"collapse",t,null))return;i.panel1.collapsed=e,e?(i.panel2.collapsed=!1,i.collapsingPanel==="panel2"&&o.hide()):o.show(),n._updateElements(),n._updateExpanderCss(),i.collapsingPanel==="panel1"&&n._trigger(e?"collapsed":"expanded",t,null)},n.prototype._setPanel2Collapsed=function(e,t){var n=this,i=n.options,s=i.panel2.collapsed,o=r(".ui-resizable-handle",n.element);if(s===e)return;if(i.collapsingPanel==="panel2"&&!n._trigger(s?"expand":"collapse",t,null))return;i.panel2.collapsed=e,e?(i.panel1.collapsed=!1,i.collapsingPanel==="panel1"&&o.hide()):o.show(),n._updateElements(),n._updateExpanderCss(),i.collapsingPanel==="panel2"&&n._trigger(e?"collapsed":"expanded",t,null)},n.prototype._initResizer=function(){var e=this,t=e.element,n=e.options,i=e._fields,s=i.bar,o=n.collapsingPanel,u=n.collapsingPanel==="panel1"?"panel2":"panel1",a=n.resizeSettings,f=a.animationOptions,l=f.disabled?0:f.duration,c=t.width(),h=t.height(),p,d,v,m,g,y,b;if(!r.fn.resizable)return;n.orientation==="vertical"?(p=s.outerWidth(!0),d=c-p-n[u].minSize,v=n[o].minSize,v<2&&(v=2),i.panel1.n.resizable({zIndex:i.panel1.n.zIndex()+100,wijanimate:!0,minWidth:v,maxWidth:d,handles:"e",helper:n.wijCSS.vSplitterCssPrefix+n.wijCSS.resizeHelperCss,animateDuration:l,animateEasing:f.easing,disabledAnimate:f.disabled,ghost:a.ghost,start:function(){i._isResizing=!0},stop:function(){i._isResizing=!1}})):(m=s.outerHeight(!0),g=h-m-n[u].minSize,y=n[o].minSize,y<2&&(y=2),i.panel1.n.resizable({zIndex:i.panel1.n.zIndex()+100,wijanimate:!0,minHeight:y,maxHeight:g,handles:"s",helper:n.wijCSS.hSplitterCssPrefix+n.wijCSS.resizeHelperCss,animateDuration:l,animateEasing:f.easing,disabledAnimate:f.disabled,ghost:a.ghost,start:function(){i._isResizing=!0;var t=i.panel1.content.children("iframe")[0];t&&e._addTransparentDivForIframe(t,i.panel1);var n=i.panel2.content.children("iframe")[0];n&&e._addTransparentDivForIframe(n,i.panel2)},stop:function(){i._isResizing=!1;var e=i.panel1.content.children("iframe")[0];if(e){var t=r(e).parent().children()[0];r(t).remove()}var n=i.panel2.content.children("iframe")[0];if(n){var s=r(n).parent().children()[0];r(s).remove()}}})),b=r(".ui-resizable-handle",t),n[u].collapsed?b.hide():b.show(),r.browser.msie&&parseInt(r.browser.version)<7&&n.orientation==="vertical"&&b.height(t.height())},n.prototype._addTransparentDivForIframe=function(e,t){var n=t.content.width()-20,i=t.content.height(),s=r("<div style='width:"+n+"px; height:"+i+"px; background-color:gray; position:absolute; z-index:1000; filter:alpha(Opacity=0); opacity: 0'>");s.prependTo(t.content)},n.prototype._adjustLayout=function(e){var t=e.options,n=e._fields,r=n.panel1,i=t.orientation==="vertical"?r.n.width():r.n.height();if(t.splitterDistance===i)return;t.splitterDistance=i,e._updateElements()},n.prototype._setPanelsScrollMode=function(){var e=this,t=e._fields,n=e.options,i=[n.panel1.scrollBars,n.panel2.scrollBars];r.each([t.panel1,t.panel2],function(e,t){i[e]==="auto"?t.content.css("overflow","auto"):i[e]==="both"?t.content.css("overflow","scroll"):i[e]==="none"?t.content.css("overflow","hidden"):i[e]==="horizontal"?t.content.css("overflow-x","scroll").css("overflow-y","hidden"):i[e]==="vertical"&&t.content.css("overflow-x","hidden").css("overflow-y","scroll")})},n}(t.wijmoWidget);n.wijsplitter=s;var o=function(){function e(){this.initSelector=":jqmData(role='wijsplitter')",this.sizing=null,this.sized=null,this.expand=null,this.collapse=null,this.expanded=null,this.collapsed=null,this.barZIndex=-1,this.showExpander=!0,this.splitterDistance=100,this.orientation="vertical",this.fullSplit=!1,this.resizeSettings={animationOptions:{duration:100,easing:"swing",disabled:!1},ghost:!1},this.panel1={minSize:1,collapsed:!1,scrollBars:"auto"},this.panel2={minSize:1,collapsed:!1,scrollBars:"auto"},this.collapsingPanel="panel1",this.wijCSS={cornerCssPrefix:"ui-corner-",arrowCssPrefix:"ui-icon-triangle-1-",panelCss:{panel1:{n:"panel1",content:"panel1-content"},panel2:{n:"panel2",content:"panel2-content"}},wrapperCss:"wijmo-wijsplitter-wrapper",hSplitterCss:"wijmo-wijsplitter-horizontal",vSplitterCss:"wijmo-wijsplitter-vertical",hSplitterCssPrefix:"wijmo-wijsplitter-h-",vSplitterCssPrefix:"wijmo-wijsplitter-v-",collapsedCss:"collapsed",expandedCss:"expanded",resizeHelperCss:"resize-helper",barCss:"bar",expanderCss:"expander"},this.wijMobileCSS={header:"ui-header ui-bar-a",content:"ui-body ui-body-b",stateDefault:"ui-btn ui-btn-b"}}return e}();s.prototype.options=r.extend(!0,{},t.wijmoWidget.prototype.options,new o),r.wijmo.registerWidget("wijsplitter",s.prototype),!s.prototype._isMobile&&r.ui!=null&&r.ui.plugin!=null&&r.ui.plugin.add("resizable","wijanimate",{stop:function(e,t){var n=r(this).data("ui-resizable"),i=n.options,s=n.element,o=n._proportionallyResizeElements,u=o.length&&/textarea/i.test(o[0].nodeName),a=u&&r.ui.hasScroll(o[0],"left")?0:n.sizeDiff.height,f=u?0:n.sizeDiff.width,l,c,h;s.css("width",n.originalSize.width).css("height",n.originalSize.height),l={width:n.size.width-f,height:n.size.height-a},c=parseInt(s.css("left"),10)+(n.position.left-n.originalPosition.left)||null,h=parseInt(s.css("top"),10)+(n.position.top-n.originalPosition.top)||null,i.disabledAnimate?(s.css(r.extend(l,h&&c?{top:h,left:c}:{})),s.trigger("animated")):s.animate(r.extend(l,h&&c?{top:h,left:c}:{}),{duration:i.animateDuration,easing:i.animateEasing,step:function(){var t={width:parseInt(s.css("width"),10),height:parseInt(s.css("height"),10),top:parseInt(s.css("top"),10),left:parseInt(s.css("left"),10)};o&&o.length&&r(o[0]).css({width:t.width,height:t.height}),n._updateCache(t),n._propagate("resize",e),s.trigger("animating")},complete:function(){s.trigger("animated")}})}})})(t.splitter||(t.splitter={}));var n=t.splitter})(wijmo||(wijmo={}))});