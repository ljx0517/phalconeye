/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version 3.0.1
 *
 * Requires jQuery >= 1.2.6
 */
(function(b){"function"===typeof define&&define.amd?define(["jquery"],b):"object"===typeof exports?module.exports=b:b(jQuery)})(function(b){function c(a){return a&&a.constructor===Number?a+"px":a}b.fn.bgiframe=function(a){a=b.extend({top:"auto",left:"auto",width:"auto",height:"auto",opacity:!0,src:"javascript:false;",conditional:/MSIE 6\.0/.test(navigator.userAgent)},a);if(!b.isFunction(a.conditional)){var g=a.conditional;a.conditional=function(){return g}}var h=b('<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+ a.src+'"style="display:block;position:absolute;z-index:-1;"/>');return this.each(function(){var d=b(this);if(!1!==a.conditional(this)){var e=d.children("iframe.bgiframe"),f=0===e.length?h.clone():e;f.css({top:"auto"==a.top?-1*(parseInt(d.css("borderTopWidth"),10)||0)+"px":c(a.top),left:"auto"==a.left?-1*(parseInt(d.css("borderLeftWidth"),10)||0)+"px":c(a.left),width:"auto"==a.width?this.offsetWidth+"px":c(a.width),height:"auto"==a.height?this.offsetHeight+"px":c(a.height),opacity:!0===a.opacity?0: void 0});0===e.length&&d.prepend(f)}})};b.fn.bgIframe=b.fn.bgiframe});