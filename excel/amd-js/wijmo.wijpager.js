var wijmo;define(["./wijmo.widget"],function(){var e=this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);r.prototype=t.prototype,e.prototype=new r};(function(t){(function(n){"use strict";var r=jQuery,i=function(t){function n(){t.apply(this,arguments)}return e(n,t),n.prototype._create=function(){var e=this.options;window.wijmoApplyWijTouchUtilEvents&&(r=window.wijmoApplyWijTouchUtilEvents(r)),this.element.addClass(this.options.wijCSS.widget+" wijmo-wijpager "+this.options.wijCSS.helperClearFix),this._refresh(),t.prototype._create.call(this)},n.prototype._destroy=function(){this.element.removeClass(this.options.wijCSS.widget+" wijmo-wijpager "+this.options.wijCSS.helperClearFix),this.$ul.remove()},n.prototype._setOption=function(e,t){this._super(e,t),this._refresh()},n.prototype._refresh=function(){this._validate(),this.$ul&&this.$ul.remove(),this.element.append(this.$ul=r('<ul class="ui-list '+this.options.wijCSS.cornerAll+" "+this.options.wijCSS.content+" "+this.options.wijCSS.helperClearFix+'" role="tablist"></ul>'));switch((this.options.mode||"").toLowerCase()){case"nextprevious":this._createNextPrev(!1);break;case"nextpreviousfirstlast":this._createNextPrev(!0);break;case"numeric":this._createNumeric(!1);break;case"numericfirstlast":this._createNumeric(!0)}},n.prototype._validate=function(){var e=this.options;if(isNaN(e.pageCount)||e.pageCount<1)e.pageCount=1;isNaN(e.pageIndex)||e.pageIndex<0?e.pageIndex=0:e.pageIndex>=e.pageCount&&(e.pageIndex=e.pageCount-1);if(isNaN(e.pageButtonCount)||e.pageButtonCount<1)e.pageButtonCount=1},n.prototype._createNextPrev=function(e){var t=this.options,n=t.firstPageClass?t.firstPageClass+" "+t.wijCSS.iconSeekFirst:"",r=t.previousPageClass?t.previousPageClass+" "+t.wijCSS.iconSeekPrev:"",i=t.nextPageClass?t.nextPageClass+" "+t.wijCSS.iconSeekNext:"",s=t.lastPageClass?t.lastPageClass+" "+t.wijCSS.iconSeekEnd:"";e&&t.pageIndex&&this.$ul.append(this._createPagerItem(!1,t.firstPageText,1,n)),t.pageIndex&&this.$ul.append(this._createPagerItem(!1,t.previousPageText,t.pageIndex,r)),t.pageIndex+1<t.pageCount&&this.$ul.append(this._createPagerItem(!1,t.nextPageText,t.pageIndex+2,i)),e&&t.pageIndex+1<t.pageCount&&this.$ul.append(this._createPagerItem(!1,t.lastPageText,t.pageCount,s))},n.prototype._createNumeric=function(e){var t=this.options,n=t.pageIndex+1,r=1,i=Math.min(t.pageCount,t.pageButtonCount),s,o=t.firstPageClass?t.firstPageClass+" "+t.wijCSS.iconSeekFirst:"",u=t.lastPageClass?t.lastPageClass+" "+t.wijCSS.iconSeekEnd:"";n>i&&(r=Math.floor(t.pageIndex/t.pageButtonCount)*t.pageButtonCount+1,i=r+t.pageButtonCount-1,i=Math.min(i,t.pageCount),i-r+1<t.pageButtonCount&&(r=Math.max(1,i-t.pageButtonCount+1))),r!==1&&(e&&this.$ul.append(this._createPagerItem(!1,t.firstPageText,1,o)),this.$ul.append(this._createPagerItem(!1,"...",r-1,"")));for(s=r;s<=i;s++)this.$ul.append(this._createPagerItem(s===n,s.toString(),s,""));t.pageCount>i&&(this.$ul.append(this._createPagerItem(!1,"...",i+1,"")),e&&this.$ul.append(this._createPagerItem(!1,t.lastPageText,t.pageCount,u)))},n.prototype._createPagerItem=function(e,t,n,i){var s,o=this.options.wijCSS,u=this,a=r("<li />").addClass(o.pagerButton+" "+o.cornerAll).attr({role:"tab","aria-label":t,title:t});return e?a.addClass(o.stateActive).attr("aria-selected","true"):a.addClass(o.stateDefault).hover(function(){u._isDisabled()||r(this).addClass(o.stateHover)},function(){u._isDisabled()||r(this).removeClass(o.stateHover)}).bind("click."+this.widgetName,{newPageIndex:n-1},r.proxy(this._onClick,this)),e?s=r("<span />"):s=i?r("<span />").addClass(o.icon+" "+i):r("<a/>").attr("href","#"),s.text(t),a.append(s),a},n.prototype._onClick=function(e){if(this._isDisabled())return!1;var t={newPageIndex:e.data.newPageIndex,handled:!1};if(this._trigger("pageIndexChanging",null,t)!==!1&&this.options.pageIndex!==t.newPageIndex){this.options.pageIndex=t.newPageIndex,t.handled||this._refresh();var n={newPageIndex:t.newPageIndex};this._trigger("pageIndexChanged",null,n)}return!1},n}(t.wijmoWidget);n.wijpager=i,i.prototype.widgetEventPrefix="wijpager";var s=function(){function e(){this.wijCSS={pagerButton:"wijmo-wijpager-button"},this.wijMobileCSS={header:"ui-header ui-bar-a",content:"ui-body-b",stateDefault:"ui-btn ui-btn-b",stateHover:"ui-btn-down-b",stateActive:"ui-btn-down-c"},this.firstPageClass=r.wijmo.widget.prototype.options.wijCSS.iconSeekFirst,this.firstPageText="First",this.lastPageClass=r.wijmo.widget.prototype.options.wijCSS.iconSeekEnd,this.lastPageText="Last",this.mode="numeric",this.nextPageClass=r.wijmo.widget.prototype.options.wijCSS.iconSeekNext,this.nextPageText="Next",this.pageButtonCount=10,this.previousPageClass=r.wijmo.widget.prototype.options.wijCSS.iconSeekPrev,this.previousPageText="Previous",this.pageCount=1,this.pageIndex=0,this.pageIndexChanging=null,this.pageIndexChanged=null}return e}();i.prototype.options=r.extend(!0,{},t.wijmoWidget.prototype.options,new s),r.wijmo.registerWidget("wijpager",i.prototype)})(t.pager||(t.pager={}));var n=t.pager})(wijmo||(wijmo={}))});