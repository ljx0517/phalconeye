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
/// <reference path="jquery.wijmo.wijstringinfo.ts"/>
/// <reference path="../Base/jquery.wijmo.widget.ts"/>
/// <reference path="jquery.wijmo.wijcharex.ts" />
/// <reference path="jquery.wijmo.wijinputcore.ts"/>
var wijmo;
(function (wijmo) {
    (function (input) {
        "use strict";

        

        /** @ignore */
        var Utility = (function () {
            function Utility() {
            }
            //static FireEvent(oControl, eventHandler, eArgs: any, eventName: string) {
            //    oControl.owner._trigger(eventName, null, eArgs);
            //}
            Utility.FireEvent = function (oControl, eventHandler, eArgs, eventName) {
                if (!eventHandler) {
                    return false;
                }
                try  {
                    // DaryLuo 2012/10/29 fix bug 837 in IM Web 7.0.
                    eventHandler.call(window, oControl, eArgs);
                } catch (ex) {
                    return false;
                }
                return true;
            };

            Utility.FindIMControl = function (id) {
            };

            Utility.ArrayIndexOf = function (array, obj) {
                if (array.indeOf) {
                    return array.indexOf(obj);
                } else {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i] === obj) {
                            return i;
                        }
                    }
                }
                return -1;
            };

            Utility.AttachEvent = function (element, type, handler, useCapture) {
                if (element !== null && element !== undefined) {
                    if (element.addEventListener) {
                        element.addEventListener(type, handler, useCapture);
                    } else if (element.attachEvent) {
                        element.attachEvent("on" + type, handler);
                    }
                }
            };

            Utility.AttachFocusEventOfDocument = function () {
                if (input.CoreUtility.IsIE8OrBelow()) {
                    Utility.AttachEvent(document, "beforeactivate", function (evt) {
                        Utility.FocusControlUpdate(evt);
                    }, true);
                } else {
                    Utility.AttachEvent(document, "focus", function (evt) {
                        Utility.FocusControlUpdate(evt);
                    }, true);
                }
            };

            Utility.FocusControlUpdate = function (evt) {
                Utility.PreviousFocusControl = Utility.FocusControl;
                Utility.FocusControl = evt.target || evt.srcElement;
            };

            Utility.ToString = function (value, length, ch, position) {
                var val = value + "";

                //It is same as String.PadLeft(int, char) in C#.
                if (ch != null) {
                    while (val.length < length) {
                        if (position) {
                            val = val + ch;
                        } else {
                            val = ch + val;
                        }
                    }

                    return val;
                }

                while (val.length < length) {
                    val += value + "";
                }

                return val;
            };

            //Added by Jeff Wu. For CursorPosition Test
            Utility.GetSelectionEndPosition = function (obj) {
                // Add comments by Yang
                // For test firefox
                if (!input.CoreUtility.IsIE() || input.CoreUtility.IsIE11OrLater()) {
                    //Commented by Kevin, Feb 17, 2009
                    //bug#1890
                    //return obj.selectionEnd;
                    var endS = 0;
                    endS = obj.selectionEnd;
                    if (obj.value) {
                        var text = obj.value.substring(0, endS);
                        endS = text.GetLength();
                    }

                    //Commented by Kevin, Feb 18, 2009
                    //bug#1894
                    var startS = 0;
                    startS = obj.selectionStart;
                    if (obj.value) {
                        var text = obj.value.substring(0, startS);
                        startS = text.GetLength();
                    }

                    if (startS > endS) {
                        endS = startS;
                    }

                    //end by Kevin
                    return endS;
                    //end by Kevin
                }

                // End by Yang
                return Utility.GetSelectionStartPosition(obj) + document.selection.createRange().text.GetLength();
            };

            Utility.GetSelectionStartPosition = function (obj) {
                if (obj.selectionStart != null) {
                    var startS = 0;
                    startS = obj.selectionStart;
                    if (obj.value) {
                        var text = obj.value.substring(0, startS);
                        startS = text.GetLength();
                    }

                    var endS = 0;
                    endS = obj.selectionEnd;
                    if (obj.value) {
                        var text = obj.value.substring(0, endS);
                        endS = text.GetLength();
                    }

                    if (endS < startS) {
                        startS = endS;
                    }

                    return startS;
                }
                try  {
                    var rng = obj.createTextRange();
                    var sng = document.selection.createRange();
                    var length = obj.value.GetLength();
                    var start = 0;
                    var end = length;
                    var i = 0;

                    while (start < end) {
                        i = Math.floor((start + end) / 2);
                        rng = obj.createTextRange();

                        var s = i;
                        var text = obj.value.Substring(0, i);
                        while (1) {
                            var index = text.IndexOf("\r\n");
                            if (index != -1) {
                                s--;
                                text = text.Substring(index + 2, text.GetLength());
                            } else {
                                break;
                            }
                        }

                        var gap = i - s;
                        s = i - gap;

                        rng.moveStart("character", s);

                        if (rng.offsetTop > sng.offsetTop) {
                            end = i;
                        } else if (rng.offsetTop < sng.offsetTop) {
                            if (start == i) {
                                return end;
                            }
                            start = i;
                        } else if (rng.offsetLeft > sng.offsetLeft) {
                            end = i;
                        } else if (rng.offsetLeft < sng.offsetLeft) {
                            if (start == i) {
                                return end;
                            }
                            start = i;
                        } else {
                            if (obj.value.Substring(i - 1, i) == "\r") {
                                i++;
                            }
                            return i;
                        }
                    }
                    return length;
                } catch (e) {
                    return 0;
                }
            };

            Utility.GetCursorPosition = function (obj, isPropertyChange) {
                if (obj == null) {
                    return -1;
                }

                // Add comments by Yang
                // For test firefox
                if (!input.CoreUtility.IsIE() || input.CoreUtility.IsIE11OrLater()) {
                    //Commented by Kevin, Feb 17, 2009
                    //bug#1890
                    //return obj.selectionStart;
                    var startS = 0;
                    startS = obj.selectionStart;
                    if (obj.value) {
                        var text = obj.value.substring(0, startS);
                        startS = text.GetLength();
                    }

                    return startS;
                    //end by Kevin
                }

                // End by Yang
                // Frank Liu fixed bug 629 at 2013/06/20.
                var caretPos = 0;
                if (document.selection) {
                    obj.focus();
                    var sel = document.selection.createRange();
                    sel.moveStart('character', -obj.value.length);
                    caretPos = sel.text.length;
                }
                return (caretPos);
            };

            Utility.GetPasteData = function (useClipboard) {
                // Add comments by Yang
                // For test firefox
                return Utility.GetDataFromClipboard(useClipboard);
            };

            Utility.GetDataFromClipboard = function (useClipboard) {
                if (useClipboard == false) {
                    return Utility.SavedText;
                }

                if (window.clipboardData) {
                    return (window.clipboardData.getData('Text'));
                } else if (Utility.CutCopyPasteEventObject !== null) {
                    if (Utility.CutCopyPasteEventObject.clipboardData !== undefined) {
                        return Utility.CutCopyPasteEventObject.clipboardData.getData("text");
                    }
                }

                //else if (window.netscape) {
                //    try {
                //        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                //        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                //        if (!clip) {
                //            return;
                //        }
                //        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                //        if (!trans) {
                //            return;
                //        }
                //        trans.addDataFlavor('text/unicode');
                //        clip.getData(trans, clip.kGlobalClipboard);
                //        var str = new Object();
                //        var len = new Object();
                //        try {
                //            trans.getTransferData('text/unicode', str, len);
                //        }
                //        catch (error) {
                //            return null;
                //        }
                //        if (str) {
                //            if (Components.interfaces.nsISupportsWString) {
                //                str = str.value.QueryInterface(Components.interfaces.nsISupportsWString);
                //            }
                //            else if (Components.interfaces.nsISupportsString) {
                //                str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
                //            }
                //            else {
                //                str = null;
                //            }
                //        }
                //        if (str) {
                //            return (str.data.substring(0, len.value / 2));
                //        }
                //    }
                //    catch (e) {
                //        window.status = "about:config signed.applets.codebase_principal_support true";
                //    }
                //}
                return null;
            };

            Utility.ClearSelection = function (inputElement) {
                if (input.CoreUtility.IsIE() && !input.CoreUtility.IsIE11OrLater()) {
                    if (document.selection.createRange().text != "") {
                        document.selection.empty();
                    }
                } else {
                    if (Utility.GetSelectionText(inputElement) != "") {
                        inputElement.selectionStart = inputElement.value.length;
                        inputElement.selectionEnd = inputElement.selectionStart;
                    }
                }
            };

            Utility.GetSelectionText = function (obj) {
                if (obj.selectionStart != null) {
                    return obj.value.substring(obj.selectionStart, obj.selectionEnd);
                } else if (document.selection != null) {
                    return document.selection.createRange().text;
                } else if (document.activeElement !== null) {
                    var obj = document.activeElement;

                    //var start = Math.Min(document.activeElement.selectionStart,document.activeElement.selectionEnd);
                    //var end = Math.Max(document.activeElement.selectionStart,document.activeElement.selectionEnd);
                    var start = obj.selectionStart;
                    var end = obj.selectionEnd;
                    return obj.value.substring(start, end);
                }

                return "";
            };

            Utility.FireSystemEvent = function (obj, eventName) {
                if (input.CoreUtility.IsIE()) {
                    obj.fireEvent(eventName);
                } else {
                    var evt = document.createEvent('HTMLEvents');

                    //We must remove the eventName's first two characters "on". For example,
                    //we should remove the "onchange" to "change".
                    evt.initEvent(eventName.substring(2, eventName.length), true, true);
                    obj.dispatchEvent(evt);
                }
            };

            Utility.GetTextBoxScrollWidth = function (inputElement, unuse) {
                return input.CoreUtility.MeasureText(inputElement.value, inputElement).Width;
            };

            Utility.CheckInt = function (value, min, max) {
                var intValue = parseInt(value);
                if (isNaN(intValue)) {
                    throw "value is invalid";
                }
                if (intValue < min || intValue > max) {
                    throw value + " is out of range, should between " + min + " and " + max;
                }
                return intValue;
            };

            Utility.CheckFloat = function (value, min, max) {
                var intValue = parseFloat(value);
                if (isNaN(intValue)) {
                    throw "value is invalid";
                }
                if (value < min || value > max) {
                    throw value + " is out of range, should between " + min + " and " + max;
                }
                return intValue;
            };

            Utility.CheckDate = function (value, min, max) {
                if (!(value instanceof Date)) {
                    throw "Type is invalid";
                }
                if (isNaN(value)) {
                    throw "Date is a invalid date";
                }

                if (max != undefined) {
                    if (value < min || value > max) {
                        throw value + " is out of range, should between " + min + " and " + max;
                    }
                }
            };

            Utility.CheckBool = function (boolValue) {
                if (typeof (boolValue) === "string") {
                    if (boolValue.toLowerCase() === "true") {
                        return true;
                    }
                }
                return boolValue == true;
            };

            Utility.CheckFunction = function (fun) {
                if (fun === undefined || fun === null) {
                    return null;
                }

                if (typeof fun == "string") {
                    fun = Utility.Trim(fun);
                    if (fun.length == 0) {
                        return null;
                    }
                    try  {
                        eval("fun =" + fun);
                    } catch (e) {
                    }
                }

                if (typeof fun == "function") {
                    return fun;
                } else {
                    throw "The value is not a valid function";
                }
            };

            Utility.GetCheckElement = function () {
                if (Utility.CheckElement == null) {
                    var div = document.createElement("div");
                    Utility.CheckElement = div;
                    div.style.display = "none";
                }
                return Utility.CheckElement;
            };

            Utility.CheckString = function (str) {
                if (str == null) {
                    str = "";
                }
                if (str === undefined || (typeof (str) != "string" && !(str instanceof String))) {
                    throw str + " type is not a string.";
                }

                return str.toString();
            };

            Utility.GetCSSLength = function (length) {
                var intValue = parseInt(length);
                if (isNaN(intValue)) {
                    return 0;
                }
                return intValue;
            };

            Utility.CheckCSSLength = function (length) {
                length = Utility.CheckInt(length, 0, Math.pow(2, 31));

                if (parseInt(length) == length) {
                    length += "px";
                }
                Utility.GetCheckElement().style.width = "";
                Utility.GetCheckElement().style.width = length;
                return Utility.GetCheckElement().style.width;
            };

            Utility.CheckFontSizeValue = function (length) {
                if (parseInt(length) == length) {
                    length += "px";
                }
                Utility.GetCheckElement().style.fontSize = "";
                Utility.GetCheckElement().style.fontSize = length;
                return Utility.GetCheckElement().style.fontSize;
            };

            Utility.CheckColor = function (color) {
                Utility.GetCheckElement().style.backgroundColor = "";
                Utility.GetCheckElement().style.backgroundColor = color;
                return Utility.GetCheckElement().style.backgroundColor;
            };

            Utility.CheckImageUrl = function (url) {
                return Utility.CheckString(url);
            };

            Utility.GetCssImageUrl = function (url) {
                if (url.startWith("url(\"")) {
                    url = url.substring(5, url.length - 2);
                } else if (url.startWith("url(")) {
                    url = url.substring(4, url.length - 1);
                }
                return url;
            };

            Utility.CheckCssImageUrl = function (url) {
                if (url.length > 0 && !url.startWith("url(")) {
                    url = "url(" + url + ")";
                }
                Utility.GetCheckElement().style.backgroundImage = "";
                Utility.GetCheckElement().style.backgroundImage = url;
                return Utility.GetCheckElement().style.backgroundImage;
            };

            Utility.CheckEnum = function (type, value) {
                for (var item in type) {
                    if (type[item] == value || type[item] == value.toLowerCase()) {
                        return type[item];
                    }
                }
                throw "Enum value is invalid";
            };

            Utility.CheckChar = function (value) {
                value = Utility.CheckString(value);

                // Frank Liu fixed bug 678 at 2013/06/14.
                if (value.length !== 1) {
                    throw "Invalid value";
                    //value = value.Substring(0, 1);
                }
                return value;
            };

            Utility.GetMultipleStringEnum = function (value) {
                var valueList = value.split(" ");
                valueList.sort();
                return valueList.join(",");
            };

            Utility.CheckMultipleStringEnum = function (type, value) {
                var valueList = value.split(",");
                var result = [];
                for (var i = 0; i < valueList.length; i++) {
                    result.push(Utility.CheckEnum(type, Utility.Trim(valueList[i])));
                }
                return result.join(" ");
            };

            Utility.EncodingToHTML = function (text) {
                if (text.IndexOf("&") != -1) {
                    var tempDispText = text;
                    var tempText = "";
                    while (tempDispText.IndexOf("&") != -1) {
                        var findPosition = tempDispText.IndexOf("&");
                        tempDispText = tempDispText.replace("&", "&amp;");
                        tempText += tempDispText.Substring(0, findPosition + 5);
                        tempDispText = tempDispText.Substring(findPosition + 5, tempDispText.GetLength());
                    }
                    if (tempDispText.IndexOf("&") == -1 && tempDispText != "") {
                        tempText += tempDispText;
                    }
                    text = tempText;
                }

                while (text.IndexOf(' ') != -1) {
                    text = text.replace(" ", "&nbsp;");
                }

                while (text.IndexOf("<") != -1) {
                    text = text.replace("<", "&lt;");
                }

                while (text.IndexOf(">") != -1) {
                    text = text.replace(">", "&gt;");
                }
                return text;
            };

            Utility.DecodingFromHTML = function (text) {
                while (text.IndexOf("&nbsp;") != -1) {
                    text = text.replace("&nbsp;", " ");
                }

                while (text.IndexOf("&lt;") != -1) {
                    text = text.replace("&lt;", "<");
                }

                while (text.IndexOf("&gt;") != -1) {
                    text = text.replace("&gt;", ">");
                }

                //Modified by shenyuan at 2006-02-10 for bug #5206.
                if (text.IndexOf("&amp;") != -1) {
                    var tmpText = text;
                    var tmpResult = "";
                    while (tmpText.IndexOf("&amp;") != -1) {
                        var temPos = tmpText.IndexOf("&amp;");
                        tmpText = tmpText.replace("&amp;", "&");
                        tmpResult += tmpText.Substring(0, temPos + 1);
                        tmpText = tmpText.Substring(temPos + 1, tmpText.GetLength());
                    }
                    if (tmpText.IndexOf("&amp;") == -1 && tmpText != "") {
                        tmpResult += tmpText;
                    }
                    text = tmpResult;
                }
                return text;
            };

            Utility.IsStandCompliantModeOn = function () {
                //Commented by Kevin, Nov 11, 2008
                //fix bug#10414
                //return document.compatMode == "CSS1Compat";
                if (!input.CoreUtility.IsIE()) {
                    return document.compatMode == "CSS1Compat" || document.compatMode == "BackCompat";
                }
                return document.compatMode == "CSS1Compat";
                //end by Kevin
            };

            Utility.GetPageZoomRate = function () {
                // add by Sean Huang at 2008.11.13, for bug 10129, 10368 -->
                if (input.CoreUtility.IsIE8()) {
                    return screen.deviceXDPI / screen.logicalXDPI;
                }

                // add by Sean Huang at 2008.11.13, for bug 10129, 10368 -->
                var normalPosition = document.getElementById("gcsh_standard_control_for_get_normal_position");
                if (typeof (normalPosition) != "undefined" && normalPosition != null) {
                    return document.getElementById("gcsh_standard_control_for_get_normal_position").offsetLeft / 100;
                } else {
                    var div = document.createElement("div");
                    document.body.appendChild(div);
                    div.id = "gcsh_standard_control_for_get_normal_position";
                    div.style.visibility = "hidden";
                    div.style.left = "100px";
                    div.style.top = "1px";
                    div.style.width = "1px";
                    div.style.height = "1px";
                    div.style.position = "absolute";

                    return document.getElementById("gcsh_standard_control_for_get_normal_position").offsetLeft / 100;
                    // return 1;
                }
            };

            Utility.GetElementPosition = function (id) {
                // Frank Liu fixed bug 612 at 2013/06/09.
                // HelenLiu 2013/07/02 fix bug 742 in IM HTML5.
                if (input.CoreUtility.IsIE() || input.CoreUtility.chrome || input.CoreUtility.safari) {
                    // change by Sean Huang at 2009.04.10, for bug 2125 -->
                    //return Utility.GetElementPositionForIE(id);
                    //modified by sj for bug 12220
                    //if (Utility.engine == 8)
                    if (input.CoreUtility.IsIE8OrLater()) {
                        var pos1 = Utility.GetElementPositionForIE8(id);

                        // DaryLuo 2012.09/10 fix bug 561 in IMWeb 7.0.
                        if (pos1.Left == 0 && pos1.Top == 0) {
                            var pos2 = Utility.GetElementPositionForFireFox(id);
                            return pos2;
                        } else {
                            return pos1;
                        }
                    } else {
                        var posIE7 = Utility.GetElementPositionForIE(id);

                        //  var posIE8 = Utility.GetElementPositionForIE8(id);
                        //  var posFF = Utility.GetElementPositionForFireFox(id);
                        // DaryLuo 2012.09/10 fix bug 561 in IMWeb 7.0.
                        //  var left = Utility.ChooseMiddle(posIE7.Left, posIE8.Left, posFF.Left);
                        //  var top = Utility.ChooseMiddle(posIE7.Top, posIE8.Top, posFF.Top);
                        return { Left: posIE7.Left, Top: posIE7.Top };
                    }
                    // end of Sean Huang <--
                }

                return Utility.GetElementPositionForFireFox(id);
            };

            Utility.GetElementPositionForIE8 = function (id) {
                var element = id;
                if (typeof id == "string") {
                    element = document.getElementById(id);
                }

                var top = 0;
                var left = 0;

                if (element == null || element.self || element.nodeType === 9) {
                    return { Left: left, Top: top };
                }

                var clientRect = element.getBoundingClientRect();
                if (!clientRect) {
                    return { Left: left, Top: top };
                }
                var documentElement = element.ownerDocument.documentElement;
                left = clientRect.left + documentElement.scrollLeft;
                top = clientRect.top + documentElement.scrollTop;

                try  {
                    var f = element.ownerDocument.parentWindow.frameElement || null;
                    if (f) {
                        var offset = (f.frameBorder === "0" || f.frameBorder === "no") ? 2 : 0;
                        left += offset;
                        top += offset;
                    }
                } catch (ex) {
                }

                return { Left: left, Top: top };
            };

            Utility.GetElementPositionForIE = function (id) {
                var oElement = id;
                if (typeof id == "string") {
                    oElement = document.getElementById(id);
                }

                // For bug 3696.
                var top = 0;
                var left = 0;

                if (oElement == null) {
                    return { Left: left, Top: top };
                }

                if (oElement.offsetParent) {
                    while (oElement.offsetParent != null) {
                        var parent = oElement.offsetParent;
                        var parentTagName = parent.tagName.toLowerCase();

                        if (parentTagName != "table" && parentTagName != "body" && parentTagName != "html" && parent.clientTop && parent.clientLeft) {
                            left += parent.clientLeft;
                            top += parent.clientTop;
                        }

                        // add by Sean Huang at 2008.11.12, for bug 10064
                        // change by Sean Huang at 2008.11.13, for bug 10445 -->
                        //if (Utility.IsIE7() && parent.style.position.toLowerCase() == "relative")
                        if (input.CoreUtility.IsIE7() && parent.style.position.toLowerCase() == "relative") {
                            left += oElement.offsetLeft - oElement.scrollLeft;
                            top += oElement.offsetTop;

                            // add by Sean Huang at 2009.01.07, for bug 856 -->
                            var zoom = Utility.GetPageZoomRate();
                            if (zoom == 1) {
                                var offset = oElement.offsetTop;
                                for (var i = 0; i < parent.children.length; i++) {
                                    var o = parent.children[i];
                                    if (o == oElement) {
                                        break;
                                    } else if (o.offsetTop) {
                                        offset = o.offsetTop;
                                        break;
                                    }
                                }
                                top -= offset;
                            }
                        } else if (Utility.IsStandCompliantModeOn() && input.CoreUtility.IsIE7() && (oElement.style.position.toLowerCase() == "absolute" || oElement.style.position.toLowerCase() == "relative")) {
                            // change by Sean Huang at 2009.01.07, for bug 856 -->
                            // [original] -->
                            //  // change by Sean Huang at 2008.12.18, for bug 896 -->
                            //  //top  += (oElement.offsetTop - oElement.scrollTop) / Utility.GetPageZoomRate();
                            //  //left += (oElement.offsetLeft - oElement.scrollLeft) / Utility.GetPageZoomRate();
                            //  top  += (oElement.offsetTop - oElement.scrollTop);
                            //  left += (oElement.offsetLeft - oElement.scrollLeft);
                            //  // end of Sean Huang <--
                            // <-- [original]
                            var zoom = Utility.GetPageZoomRate();
                            top += (oElement.offsetTop - oElement.scrollTop) / zoom;
                            left += (oElement.offsetLeft - oElement.scrollLeft) / zoom;
                            // end of Sean Huang, for bug 856 <--
                        } else {
                            //Add by Jiang at Dec. 10 2008
                            //For fixed bug773
                            if ((oElement.tagName.toLowerCase() == "input" && oElement.type.toLowerCase() == "text") || oElement.tagName.toLowerCase() == "textarea") {
                                top += oElement.offsetTop;
                                left += oElement.offsetLeft;
                            } else {
                                top += oElement.offsetTop - oElement.scrollTop;
                                left += oElement.offsetLeft - oElement.scrollLeft;
                            }
                            //End by Jiang Changcheng
                        }

                        oElement = parent;
                        //end by Ryan Wu.
                    }
                } else if (oElement.left && oElement.top) {
                    left += oElement.left;
                    top += oElement.top;
                } else {
                    if (oElement.x) {
                        left += oElement.x;
                    }
                    if (oElement.y) {
                        top += oElement.y;
                    }
                }

                //Add by Ryan Wu at 11:13, Nov 2 2005. For in VS2005, body has also an offset value.
                if (oElement.style.position.toLowerCase() != "relative" && oElement.style.position.toLowerCase() != "absolute" && oElement.tagName.toLowerCase() == "body" && Utility.IsStandCompliantModeOn()) {
                    //Add comments by Ryan Wu at 9:54 Nov. 15 2006.
                    //Fix bug#6695.
                    //	    top  += oElement.offsetTop;
                    //		left += oElement.offsetLeft;
                    // change by Sean Huang at 2008.11.13, for bug 10445 -->
                    //if (!Utility.IsIE7())
                    if (!input.CoreUtility.IsIE7()) {
                        top += oElement.offsetTop;
                        left += oElement.offsetLeft;
                    } else {
                        // Add comments by Yang at 13:23 July 16th 2008
                        // For fix the bug 9755
                        //            top  += parseInt(oElement.currentStyle.marginTop);
                        //		    left += parseInt(oElement.currentStyle.marginLeft);
                        var tempTop = parseInt(oElement.currentStyle.marginTop);
                        var tempLeft = parseInt(oElement.currentStyle.marginLeft);
                        if (isNaN(tempTop)) {
                            tempTop = 0;
                        }
                        if (isNaN(tempLeft)) {
                            tempLeft = 0;
                        }
                        top += tempTop;
                        left += tempLeft;
                        // End by Yang
                    }
                    //end by Ryan Wu.
                }

                return { Left: left, Top: top };
            };

            Utility.GetElementPositionForFireFox = function (id) {
                var oElement = id;
                if (typeof id == "string") {
                    oElement = document.getElementById(id);
                }

                // For bug 3696.
                var top = 0;
                var left = 0;
                var scrollLeft = 0;
                var scrollTop = 0;

                if (oElement == null) {
                    return { Left: left, Top: top };
                }

                //Gets the offsetTop and offsetLeft.
                if (oElement.offsetParent) {
                    while (oElement.offsetParent != null) {
                        var parentTagName = oElement.offsetParent.tagName.toLowerCase();

                        if (parentTagName != "table" && parentTagName != "body" && parentTagName != "html" && parentTagName != "div" && oElement.offsetParent.clientTop && oElement.offsetParent.clientLeft) {
                            left += oElement.offsetParent.clientLeft;
                            top += oElement.offsetParent.clientTop;
                        }

                        top += oElement.offsetTop;
                        left += oElement.offsetLeft;

                        oElement = oElement.offsetParent;
                    }
                } else if (oElement.left && oElement.top) {
                    left += oElement.left;
                    top += oElement.top;
                } else {
                    if (oElement.x) {
                        left += oElement.x;
                    }
                    if (oElement.y) {
                        top += oElement.y;
                    }
                }

                //Gets the scrollTop and scrollLeft.
                oElement = id;
                if (typeof id === "string") {
                    oElement = document.getElementById(id);
                }

                if (oElement.parentElement) {
                    while (oElement.parentElement != null && oElement.tagName.toLowerCase() != "html") {
                        scrollTop += oElement.scrollTop;
                        scrollLeft += oElement.scrollLeft;

                        oElement = oElement.parentElement;
                    }
                }

                top -= scrollTop;
                left -= scrollLeft;

                //Add by Ryan Wu at 11:13, Nov 2 2005. For in VS2005, body has also an offset value.
                if (oElement.style.position.toLowerCase() != "relative" && oElement.style.position.toLowerCase() != "absolute" && oElement.tagName.toLowerCase() == "body" && Utility.IsStandCompliantModeOn()) {
                    top += oElement.offsetTop;
                    left += oElement.offsetLeft;
                }

                return { Left: left, Top: top };
            };

            Utility.GetOSDefaultFontFamily = function () {
                switch (input.CoreUtility.GetClientOS().toLowerCase()) {
                    case "winxp":
                        return "MS UI Gothic";
                    case "vista":
                        return "�ᥤ�ꥪ";
                    case "win7":
                        return "�ᥤ�ꥪ";
                    case "win8":
                        return "Meiryo UI";
                    case "win2003":
                        return "MS UI Gothic";
                    case "win2000":
                        return "MS UI Gothic";
                }
                return "MS UI Gothic";
            };

            Utility.IsTouchSupport = function () {
                return window.navigator.userAgent.toLowerCase().indexOf("touch") != -1;
            };

            Utility.DisabledHoldVisual = function (element) {
                if (element !== null && element !== undefined && Utility.IsTouchSupport() && input.CoreUtility.IsIE10OrLater()) {
                    element.addEventListener("MSHoldVisual", function (e) {
                        e.preventDefault();
                    }, false);
                    element.addEventListener("MSGestureHold", function (e) {
                        e.preventDefault();
                    }, false);

                    // Disables visual
                    element.addEventListener("contextmenu", function (e) {
                        e.preventDefault();
                    }, false);
                }
            };

            Utility.IsFocusFromIMControl = function (id, evt) {
                try  {
                    //return event.fromElement.className.IndexOf(Utility.DefaultControlStyle) != -1;
                    var src = evt.fromElement;
                    while (src != null) {
                        // change by Sean Huang at 2008.08.14, for bug 614 and 644 (ttp)-->
                        //if (src.id.Substring(0, id.length) == id)
                        //modified by sj for bug 2149
                        //if (src.id == id ||  src.id == id + this.Hold + "_DropDownObj" || src.id == id + "DropDown_Container" || src.id == id+ "_ContextMenu")
                        if (src.id == id || src.id == id + this.Hold + "_DropDownObj" || src.id == id + "_DropDown_Container" || src.id == id + "_ContextMenu" || src.id == id + "_HistoryList" || src.id == id + "_EditField" || src.id == id + "_BorderContainer" || src.id == id + "_DropDown_EditField") {
                            return true;
                        }

                        //Add comments by Ryan Wu at 11:28 Mar. 15 2007.
                        //For test FireFox.
                        //src = src.parentElement;
                        src = src.parentNode;
                        //end by Ryan Wu.
                    }
                    return false;
                } catch (e) {
                    return false;
                }
            };

            Utility.IsFocusToIMControl = function (id, evt) {
                try  {
                    //	return event.toElement.className.IndexOf(Utility.DefaultControlStyle) != -1;
                    var src = evt.toElement;

                    while (src != null) {
                        //Add comments by Ryan Wu at 17:13 Aug. 22 2007.
                        //For fix the bug8990.
                        //if (src.id && src.id.substring(0, id.length) == id)
                        //add by chris for 12215 (bugzilla) 2010/12/17 16:30
                        //			// change by Sean Huang at 2008.08.14, for bug 614 and 644 (ttp)-->
                        //			//if (src.id && src.id == id)
                        //			//modified by sj for bug 2149
                        //			//if (src.id == id || src.id == id + this.Hold + "_DropDownObj" || src.id == id + "DropDown_Container" || src.id == id+ "_ContextMenu")
                        //			if (src.id == id || src.id == id + this.Hold + "_DropDownObj" || src.id == id + "DropDown_Container" || src.id == id + "_ContextMenu" || src.id == id + "_HistoryList")
                        //			//end by sj
                        //			// end of Sean Huang <--
                        if (src.id == id || src.id == id + this.Hold + "_DropDownObj" || src.id == id + "_DropDown_Container" || src.id == id + "_ContextMenu" || src.id == id + "_HistoryList" || src.id == id + this.Hold + "_DropDownObj_PopupMonth" || src.id == id + "_EditField" || src.id == id + "_BorderContainer" || src.id == id + "_DropDown_EditField") {
                            return true;
                        }

                        //end by Ryan Wu.
                        //Add comments by Ryan Wu at 11:28 Mar. 15 2007.
                        //For test FireFox.
                        //src = src.parentElement;
                        src = src.parentNode;
                        //end by Ryan Wu.
                    }
                    return false;
                } catch (e) {
                    return false;
                }
            };

            Utility.Trim = function (value) {
                if (value == "") {
                    return "";
                }

                var beginIndex = 0;
                var endIndex = 0;
                for (var i = 0; i < value.length; i++) {
                    if (value.CharAt(i) != " " && value.CharAt(i) != "��") {
                        beginIndex = i;
                        break;
                    }
                }

                for (var i = value.length - 1; i >= 0; i--) {
                    if (value.CharAt(i) != " " && value.CharAt(i) != "��") {
                        endIndex = i + 1;
                        break;
                    }
                }

                try  {
                    var s = value.Substring(beginIndex, endIndex);
                    return s;
                } catch (e) {
                    return value;
                }
            };

            Utility.GetTouchPath = function (beginY, endY) {
                if (beginY === -1 || endY === -1) {
                    return "Error";
                }

                if (beginY > endY) {
                    return beginY - endY > 20 ? "ToTop" : "NotMove";
                } else if (beginY < endY) {
                    return endY - beginY > 20 ? "ToBottom" : "NotMove";
                }

                return "NotMove";
            };

            Utility.IsJapan = function () {
                if (navigator.userLanguage) {
                    return navigator.userLanguage.indexOf('ja') != -1;
                } else if (navigator["language"]) {
                    return navigator["language"].indexOf('ja') != -1;
                }

                return false;
            };

            Utility.CreateStyleElement = function (id) {
                var style = document.createElement("style");
                style.id = id;

                //add commnets by Jason.Zhou at 14:23 November 26 2007
                //for style.type="text/css" is used in css file used by linking file type, this sytle is only in dom tree.
                style.type = "text/css";

                //end by Jason.Zhou
                return style;
            };

            Utility.CreateClassStyle = function (className) {
                return Utility.CreateSelectorStyle("." + className);
            };

            Utility.CreateSelectorStyle = function (selectorName) {
                var tableStyle = document.getElementById("tableStyle");
                if (tableStyle == null) {
                    //tableStyle = GrapeCity.IM.Utility.CreateStyleElement("tableStyle");
                    tableStyle = this.CreateStyleElement("tableStyle");
                    document.body.appendChild(tableStyle);
                }

                var sheet = tableStyle.sheet || tableStyle.styleSheet;
                var rules = sheet.cssRules || sheet.rules;
                if (sheet.insertRule) {
                    sheet.insertRule(selectorName + "{ }", rules.length);
                } else {
                    sheet.addRule(selectorName, "{ }", rules.length);
                }

                return rules.item(rules.length - 1);
            };

            Utility.SetSelection = function (element, start, end, multiLine) {
                $(element).wijtextselection(Math.min(start, end), Math.max(start, end));
            };

            Utility.PreventDefault = function (evt) {
                if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
            };

            Utility.CancelBubble = function (evt) {
                if (evt.cancelBubble !== undefined) {
                    evt.cancelBubble = true;
                } else {
                    evt.stopPropagation();
                }
            };

            Utility.DragDrop = function (obj) {
                try  {
                    obj.dragDrop(true);
                } catch (e) {
                }
            };

            Utility.GetMouseButton = function (evt) {
                var mouseButton = -1 /* Default */;
                var leftKey = input.CoreUtility.IsIE8OrBelow() ? 1 : 0;
                if (evt.button == leftKey) {
                    mouseButton = 0 /* Left */;
                } else if (evt.button == 1) {
                    mouseButton = 1 /* Middle */;
                } else if (evt.button == 2) {
                    mouseButton = 2 /* Right */;
                }
                return mouseButton;
            };

            /**
            * Gets the value after mouse wheel.
            * @param value - the initial value before mousewheel.
            * @returns Returns the value after mouse wheel.
            */
            Utility.GetMouseWheelValue = function (value, evt) {
                //Add comments by Ryan Wu at 9:50 Aug. 13 2007.
                //For Firefox doesn't support the event.wheelDelta to get the mouse wheel value.
                //I don't know why the event.detail is also 3 or -3, so we must divide 3.
                if (input.CoreUtility.IsFireFox4OrLater()) {
                    return -evt.detail / 3;
                }

                //end by Ryan Wu.
                if (evt.wheelDelta >= 120) {
                    value++;
                } else if (evt.wheelDelta <= -120) {
                    value--;
                }

                return value;
            };
            Utility.SetCopy = function (text, useClipboard) {
                // Add comments by Yang
                // For test firefox
                var selText;
                try  {
                    // add by Sean Huang at 2009.04.29, for bug 2209 -->
                    if (text == null || text == "") {
                        if (document.selection) {
                            selText = document.selection.createRange().text;
                        }
                        if (selText == "") {
                            return;
                        }
                    }
                } catch (e) {
                }
                ;

                if (text != null) {
                    selText = text;
                }

                Utility.CopyDataToClipBoard(selText, useClipboard);
            };

            Utility.CopyDataToClipBoard = function (copytext, useClipboard) {
                if (useClipboard == false) {
                    Utility.SavedText = copytext;
                    return;
                }

                if (window.clipboardData) {
                    // change by Sean Huang at 2009.01.13, for bug 1582 -->
                    //window.clipboardData.setData("Text", copytext);
                    // change by Sean Huang at 2009.02.19, for bug 1903 -->
                    //setTimeout('window.clipboardData.setData("Text", "' + copytext + '");', 0);
                    // change by Sean Huang at 2009.05.26, for sometimes throw exception in auto test ==-->
                    //setTimeout(function () {window.clipboardData.setData("Text", copytext);}, 0);
                    setTimeout(function () {
                        try  {
                            window.clipboardData.setData("Text", copytext);
                        } catch (ex) {
                        }
                    }, 0);
                    // end of Sean Huang, for auto test <--==
                    // end of Sean Huang <--
                    // end of Sean Huang <--
                } else if (Utility.CutCopyPasteEventObject !== null) {
                    if (Utility.CutCopyPasteEventObject.clipboardData !== undefined) {
                        Utility.CutCopyPasteEventObject.clipboardData.setData("text", copytext);
                    }
                }
                //else if (window.netscape) {
                //    try {
                //        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                //        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                //        if (!clip) {
                //            return;
                //        }
                //        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                //        if (!trans) {
                //            return;
                //        }
                //        trans.addDataFlavor('text/unicode');
                //        var str = new Object();
                //        var len = new Object();
                //        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
                //        str.data = copytext;
                //        trans.setTransferData("text/unicode", str, copytext.length * 2);
                //        var clipid = Components.interfaces.nsIClipboard;
                //        if (!clip) {
                //            return false;
                //        }
                //        clip.setData(trans, null, clipid.kGlobalClipboard);
                //    } catch (e) {
                //    }
                //}
            };

            Utility.SetZoomStyle = function (element, value, align) {
                if (element === undefined || element === null) {
                    return;
                }

                var zoomOrigin = "top left";
                if (align === 2 /* Right */) {
                    zoomOrigin = "top right";
                }
                if (input.CoreUtility.firefox) {
                    element.style.MozTransformOrigin = value === "" ? "" : zoomOrigin;
                    element.style.MozTransform = value === "" ? "" : "scale(" + value + ")";
                    element.setAttribute("ZoomValue", value);
                } else {
                    if (input.CoreUtility.chrome || input.CoreUtility.safari) {
                        if (value !== "") {
                            element.style.MozTransform = "scale(" + value + ")";
                            element.style.WebkitTransform = "scale(" + value + ")";
                            element.style.webkitTransformOrigin = zoomOrigin;
                        } else {
                            element.style.MozTransform = "";
                            element.style.WebkitTransform = "";
                            element.style.WebkitTransformOrigin = "";
                        }
                    } else if (input.CoreUtility.IsIE9OrLater()) {
                        if (value !== "") {
                            element.style.msTransform = "scale(" + value + ")";
                            element.style.msTransformOrigin = zoomOrigin;
                        } else {
                            element.style.msTransform = "";
                            element.style.msTransformOrigin = "";
                        }
                    } else {
                        element.style.zoom = value;
                    }
                }
            };

            Utility.FilterText = function (includeText, intext) {
                if (intext.GetLength() == 0)
                    return "";
                var filterText = "";
                var j = 0;
                var i = 0;
                for (j = 0; j < intext.GetLength(); j++) {
                    var valid = false;
                    for (i = 0; i < includeText.GetLength(); i++) {
                        if (intext.Substring(j, j + 1) == includeText.Substring(i, i + 1))
                            valid = true;
                    }
                    if (valid == true)
                        filterText += intext.Substring(j, j + 1);
                }
                return filterText;
            };

            Utility.IndexOfAny = function (str, anyOf, startIndex) {
                if (startIndex >= str.length) {
                    return -1;
                }
                for (var i = startIndex; i < str.length; i++) {
                    for (var j = 0; j < anyOf.length; j++) {
                        if (str.charAt(i) == anyOf[j]) {
                            return i;
                        }
                    }
                }
                return -1;
            };
            Utility.IdCounter = 0;
            Utility.EditFieldSuffix = "_EidtField";

            Utility.MaskValChar = "\ufeff";
            Utility.Hold = "g-C2";
            return Utility;
        })();
        input.Utility = Utility;

        (function (FocusType) {
            FocusType[FocusType["None"] = 0] = "None";
            FocusType[FocusType["Click"] = 1] = "Click";
            FocusType[FocusType["ContextMenu"] = 2] = "ContextMenu";
            FocusType[FocusType["ClientEvent"] = 3] = "ClientEvent";
            FocusType[FocusType["KeyExit"] = 4] = "KeyExit";
            FocusType[FocusType["Default"] = 5] = "Default";
            FocusType[FocusType["SpinButton"] = 6] = "SpinButton";
            FocusType[FocusType["DropDown"] = 7] = "DropDown";
            FocusType[FocusType["ImeInput"] = 8] = "ImeInput";
            FocusType[FocusType["Left"] = 9] = "Left";
            FocusType[FocusType["Right"] = 10] = "Right";
            FocusType[FocusType["DragDrop"] = 11] = "DragDrop";
        })(input.FocusType || (input.FocusType = {}));
        var FocusType = input.FocusType;
        ;

        /** @ignore */
        (function (DateCursorPosition) {
            DateCursorPosition[DateCursorPosition["Default"] = 0] = "Default";
            DateCursorPosition[DateCursorPosition["Era"] = 1] = "Era";
            DateCursorPosition[DateCursorPosition["Year"] = 2] = "Year";
            DateCursorPosition[DateCursorPosition["Month"] = 3] = "Month";
            DateCursorPosition[DateCursorPosition["Day"] = 4] = "Day";
            DateCursorPosition[DateCursorPosition["AMPM"] = 5] = "AMPM";
            DateCursorPosition[DateCursorPosition["Hour"] = 6] = "Hour";
            DateCursorPosition[DateCursorPosition["Minute"] = 7] = "Minute";
            DateCursorPosition[DateCursorPosition["Second"] = 8] = "Second";
        })(input.DateCursorPosition || (input.DateCursorPosition = {}));
        var DateCursorPosition = input.DateCursorPosition;
        ;

        /**
        * Defines the CrLf mode which describes how to process the CrLf char.
        * @type {{NoControl: string, Filter: string, Cut: string}}
        */
        (function (CrLfMode) {
            /**
            * Accepts all CrLf characters in copied, cut, or pasted strings.
            */
            CrLfMode[CrLfMode["NoControl"] = 0] = "NoControl";

            /**
            * Removes all CrLf characters in copied, cut, or pasted strings.
            */
            CrLfMode[CrLfMode["Filter"] = 1] = "Filter";

            /**
            * Cuts the following strings from the first CrLf character in copied, cut, and pasted strings.
            */
            CrLfMode[CrLfMode["Cut"] = 2] = "Cut";
        })(input.CrLfMode || (input.CrLfMode = {}));
        var CrLfMode = input.CrLfMode;
        ;

        /**
        * Specifies how the literal in content is held in the clipboard.
        * @type {{IncludeLiterals: string, ExcludeLiterals: string}}
        */
        (function (ClipContent) {
            /**
            * Literals are included.
            */
            ClipContent[ClipContent["IncludeLiterals"] = 0] = "IncludeLiterals";

            /**
            * Literals are excluded.
            */
            ClipContent[ClipContent["ExcludeLiterals"] = 1] = "ExcludeLiterals";
        })(input.ClipContent || (input.ClipContent = {}));
        var ClipContent = input.ClipContent;
        ;

        (function (EditMode) {
            EditMode[EditMode["Insert"] = 0] = "Insert";
            EditMode[EditMode["Overwrite"] = 1] = "Overwrite";
            EditMode[EditMode["FixedInsert"] = 2] = "FixedInsert";
            EditMode[EditMode["FixedOverwrite"] = 3] = "FixedOverwrite";
        })(input.EditMode || (input.EditMode = {}));
        var EditMode = input.EditMode;
        ;

        (function (ShowLiterals) {
            ShowLiterals[ShowLiterals["Always"] = 1] = "Always";
            ShowLiterals[ShowLiterals["PostDisplay"] = 2] = "PostDisplay";
            ShowLiterals[ShowLiterals["PreDisplay"] = 3] = "PreDisplay";
        })(input.ShowLiterals || (input.ShowLiterals = {}));
        var ShowLiterals = input.ShowLiterals;
        ;

        (function (ExitOnLeftRightKey) {
            ExitOnLeftRightKey[ExitOnLeftRightKey["None"] = 0] = "None";
            ExitOnLeftRightKey[ExitOnLeftRightKey["Left"] = 1] = "Left";
            ExitOnLeftRightKey[ExitOnLeftRightKey["Right"] = 2] = "Right";
            ExitOnLeftRightKey[ExitOnLeftRightKey["Both"] = 3] = "Both";
        })(input.ExitOnLeftRightKey || (input.ExitOnLeftRightKey = {}));
        var ExitOnLeftRightKey = input.ExitOnLeftRightKey;
        ;

        /**
        * Specifies the type of selection text in control.
        * @type {{None: string, Field: string, All: string}}
        */
        (function (HighlightText) {
            /**
            * No selection specified.
            */
            HighlightText[HighlightText["None"] = 0] = "None";

            /**
            * Select the specified field.
            */
            HighlightText[HighlightText["Field"] = 1] = "Field";

            /**
            * Select all the text.
            */
            HighlightText[HighlightText["All"] = 2] = "All";
        })(input.HighlightText || (input.HighlightText = {}));
        var HighlightText = input.HighlightText;
        ;

        (function (DropDownAlign) {
            DropDownAlign[DropDownAlign["Left"] = 1] = "Left";
            DropDownAlign[DropDownAlign["Right"] = 2] = "Right";
        })(input.DropDownAlign || (input.DropDownAlign = {}));
        var DropDownAlign = input.DropDownAlign;

        (function (ScrollBarMode) {
            ScrollBarMode[ScrollBarMode["Automatic"] = 0] = "Automatic";
            ScrollBarMode[ScrollBarMode["Fixed"] = 1] = "Fixed";
        })(input.ScrollBarMode || (input.ScrollBarMode = {}));
        var ScrollBarMode = input.ScrollBarMode;

        (function (ScrollBars) {
            ScrollBars[ScrollBars["None"] = 0] = "None";
            ScrollBars[ScrollBars["Horizontal"] = 1] = "Horizontal";
            ScrollBars[ScrollBars["Vertical"] = 2] = "Vertical";
            ScrollBars[ScrollBars["Both"] = 3] = "Both";
        })(input.ScrollBars || (input.ScrollBars = {}));
        var ScrollBars = input.ScrollBars;

        (function (ControlStatus) {
            ControlStatus[ControlStatus["Normal"] = 0] = "Normal";
            ControlStatus[ControlStatus["Hover"] = 1] = "Hover";
            ControlStatus[ControlStatus["Pressed"] = 2] = "Pressed";
            ControlStatus[ControlStatus["Focused"] = 4] = "Focused";
            ControlStatus[ControlStatus["Disabled"] = 8] = "Disabled";
        })(input.ControlStatus || (input.ControlStatus = {}));
        var ControlStatus = input.ControlStatus;

        (function (ExitKeys) {
            ExitKeys[ExitKeys["Tab"] = 1] = "Tab";
            ExitKeys[ExitKeys["ShiftTab"] = 2] = "ShiftTab";
            ExitKeys[ExitKeys["NextControl"] = 3] = "NextControl";
            ExitKeys[ExitKeys["PreviousControl"] = 4] = "PreviousControl";
            ExitKeys[ExitKeys["Right"] = 5] = "Right";
            ExitKeys[ExitKeys["Left"] = 6] = "Left";
            ExitKeys[ExitKeys["CtrlRight"] = 7] = "CtrlRight";
            ExitKeys[ExitKeys["CtrlLeft"] = 8] = "CtrlLeft";
            ExitKeys[ExitKeys["CharInput"] = 9] = "CharInput";
        })(input.ExitKeys || (input.ExitKeys = {}));
        var ExitKeys = input.ExitKeys;
        ;

        (function (TabAction) {
            TabAction[TabAction["Control"] = 0] = "Control";
            TabAction[TabAction["Field"] = 1] = "Field";
        })(input.TabAction || (input.TabAction = {}));
        var TabAction = input.TabAction;
        ;

        (function (Key) {
            Key[Key["BackSpace"] = 8] = "BackSpace";
            Key[Key["Tab"] = 9] = "Tab";
            Key[Key["Clear"] = 12] = "Clear";
            Key[Key["Enter"] = 13] = "Enter";
            Key[Key["Shift"] = 16] = "Shift";
            Key[Key["Control"] = 17] = "Control";
            Key[Key["Alt"] = 18] = "Alt";
            Key[Key["Pause"] = 19] = "Pause";
            Key[Key["Caps_Lock"] = 20] = "Caps_Lock";
            Key[Key["Escape"] = 27] = "Escape";
            Key[Key["Space"] = 32] = "Space";
            Key[Key["PageUp"] = 33] = "PageUp";
            Key[Key["PageDown"] = 34] = "PageDown";
            Key[Key["End"] = 35] = "End";
            Key[Key["Home"] = 36] = "Home";
            Key[Key["Left"] = 37] = "Left";
            Key[Key["Up"] = 38] = "Up";
            Key[Key["Right"] = 39] = "Right";
            Key[Key["Down"] = 40] = "Down";
            Key[Key["Select"] = 41] = "Select";
            Key[Key["Print"] = 42] = "Print";
            Key[Key["Execute"] = 43] = "Execute";
            Key[Key["Insert"] = 45] = "Insert";
            Key[Key["Delete"] = 46] = "Delete";
            Key[Key["Help"] = 47] = "Help";
            Key[Key["equalbraceright"] = 48] = "equalbraceright";
            Key[Key["exclamonesuperior"] = 49] = "exclamonesuperior";
            Key[Key["quotedbltwosuperior"] = 50] = "quotedbltwosuperior";
            Key[Key["sectionthreesuperior"] = 51] = "sectionthreesuperior";
            Key[Key["dollar"] = 52] = "dollar";
            Key[Key["percent"] = 53] = "percent";
            Key[Key["ampersand"] = 54] = "ampersand";
            Key[Key["slashbraceleft"] = 55] = "slashbraceleft";
            Key[Key["parenleftbracketleft"] = 56] = "parenleftbracketleft";
            Key[Key["parenrightbracketright"] = 57] = "parenrightbracketright";
            Key[Key["A"] = 65] = "A";
            Key[Key["B"] = 66] = "B";
            Key[Key["C"] = 67] = "C";
            Key[Key["D"] = 68] = "D";
            Key[Key["E"] = 69] = "E";
            Key[Key["F"] = 70] = "F";
            Key[Key["G"] = 71] = "G";
            Key[Key["H"] = 72] = "H";
            Key[Key["I"] = 73] = "I";
            Key[Key["J"] = 74] = "J";
            Key[Key["K"] = 75] = "K";
            Key[Key["L"] = 76] = "L";
            Key[Key["M"] = 77] = "M";
            Key[Key["N"] = 78] = "N";
            Key[Key["O"] = 79] = "O";
            Key[Key["P"] = 80] = "P";
            Key[Key["Q"] = 81] = "Q";
            Key[Key["R"] = 82] = "R";
            Key[Key["S"] = 83] = "S";
            Key[Key["T"] = 84] = "T";
            Key[Key["U"] = 85] = "U";
            Key[Key["V"] = 86] = "V";
            Key[Key["W"] = 87] = "W";
            Key[Key["X"] = 88] = "X";
            Key[Key["Y"] = 89] = "Y";
            Key[Key["Z"] = 90] = "Z";
            Key[Key["KP_0"] = 96] = "KP_0";
            Key[Key["KP_1"] = 97] = "KP_1";
            Key[Key["KP_2"] = 98] = "KP_2";
            Key[Key["KP_3"] = 99] = "KP_3";
            Key[Key["KP_4"] = 100] = "KP_4";
            Key[Key["KP_5"] = 101] = "KP_5";
            Key[Key["KP_6"] = 102] = "KP_6";
            Key[Key["KP_7"] = 103] = "KP_7";
            Key[Key["KP_8"] = 104] = "KP_8";
            Key[Key["KP_9"] = 105] = "KP_9";
            Key[Key["KP_Multiply"] = 106] = "KP_Multiply";
            Key[Key["KP_Add"] = 107] = "KP_Add";
            Key[Key["KP_Separator"] = 108] = "KP_Separator";
            Key[Key["KP_Subtract"] = 109] = "KP_Subtract";
            Key[Key["KP_Decimal"] = 110] = "KP_Decimal";
            Key[Key["KP_Divide"] = 111] = "KP_Divide";
            Key[Key["F1"] = 112] = "F1";
            Key[Key["F2"] = 113] = "F2";
            Key[Key["F3"] = 114] = "F3";
            Key[Key["F4"] = 115] = "F4";
            Key[Key["F5"] = 116] = "F5";
            Key[Key["F6"] = 117] = "F6";
            Key[Key["F7"] = 118] = "F7";
            Key[Key["F8"] = 119] = "F8";
            Key[Key["F9"] = 120] = "F9";
            Key[Key["F10"] = 121] = "F10";
            Key[Key["F11"] = 122] = "F11";
            Key[Key["F12"] = 123] = "F12";
            Key[Key["F13"] = 124] = "F13";
            Key[Key["F14"] = 125] = "F14";
            Key[Key["F15"] = 126] = "F15";
            Key[Key["F16"] = 127] = "F16";
            Key[Key["F17"] = 128] = "F17";
            Key[Key["F18"] = 129] = "F18";
            Key[Key["F19"] = 130] = "F19";
            Key[Key["F20"] = 131] = "F20";
            Key[Key["F21"] = 132] = "F21";
            Key[Key["F22"] = 133] = "F22";
            Key[Key["F23"] = 134] = "F23";
            Key[Key["F24"] = 135] = "F24";
            Key[Key["Num_Lock"] = 136] = "Num_Lock";
            Key[Key["Scroll_Lock"] = 137] = "Scroll_Lock";
        })(input.Key || (input.Key = {}));
        var Key = input.Key;
        ;

        

        

        

        /** @ignore */
        var BaseUIProcess = (function () {
            function BaseUIProcess() {
                this.isMulSelected = false;
                this.isDblClick = false;
                this.isTriClick = false;
                this.isOverWrite = false;
                this.moveFocusExitOnLastChar = false;
            }
            BaseUIProcess.prototype.GetInputElement = function () {
                return this.Owner.GetInputElement();
            };

            BaseUIProcess.prototype.GetElementId = function () {
                return this.Owner.GetInputElement().id;
            };

            BaseUIProcess.prototype.GetShowLiterals = function () {
                if (this.Owner.GetShowLiterals !== undefined) {
                    return this.Owner.GetShowLiterals();
                }
                return 1 /* Always */;
            };

            /**
            * Get cursor start and end position according to the specified highlighttext and current text.
            */
            BaseUIProcess.prototype.SetCursorPositionAndSelection = function (highlightText, text, cursorPos, startPos) {
                var retInfo = {};

                if (highlightText == true || highlightText == 2 /* All */) {
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = text.GetLength();
                }

                return retInfo;
            };

            /**
            * Clear the current value of the control.
            */
            BaseUIProcess.prototype.Clear = function () {
                return null;
            };

            /**
            * Handle the onfocus event.
            */
            BaseUIProcess.prototype.Focus = function (data) {
                var text = data.Text;
                var displayText = data.DisplayText;
                var focusType = data.FocusType;
                var oText = data.Element;
                var highlightText = data.HighlightText;
                var cursorPos = data.CursorPosition;
                var retInfo = {};

                //Add comments by Ryan Wu at 19:22 Dec 7, 2005.
                //Maybe this is a bug? for we press tab key to get focus. If the original state is
                //selection then the current state is also state, thus this.isMulSelected is true.????
                this.isMulSelected = false;

                //the focusType is used to distribute the get focus type by Left key
                // or Right key or something else.
                if (focusType == 1 /* Click */) {
                    retInfo.SelectionStart = Utility.GetCursorPosition(oText);
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                }

                //when get the focus, display the format.
                retInfo.Text = text;

                //Press tab key will set cursor start position to less than zero
                if (retInfo.SelectionStart == -1) {
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = 0;
                } else if (retInfo.SelectionStart > retInfo.Text.GetLength()) {
                    retInfo.SelectionStart = retInfo.Text.GetLength();
                    retInfo.SelectionEnd = retInfo.Text.GetLength();
                } else if (retInfo.SelectionStart == displayText.GetLength()) {
                    retInfo.SelectionStart = retInfo.Text.GetLength();
                    retInfo.SelectionEnd = retInfo.Text.GetLength();
                }

                //the focusType is FocusType.Left it means that the focus is set by press the left key.
                // change by Sean Huang at 2008.12.05, for bug 992 -->
                //if (focusType == FocusType.Left)
                if (focusType == 9 /* Left */ && cursorPos == 0 /* Default */) {
                    retInfo.SelectionStart = 0;
                    retInfo.SelectionEnd = 0;
                    //update by wuhao 2008-1-8 for fix bug 1362
                    //return retInfo;
                    //end by wuhao 2008-1-8 for fix bug 1362
                } else if (focusType == 10 /* Right */ && cursorPos == 0 /* Default */) {
                    retInfo.SelectionStart = retInfo.Text.GetLength();
                    retInfo.SelectionEnd = retInfo.Text.GetLength();
                    //update by wuhao 2008-1-8 for fix bug 1362
                    //return retInfo;
                    //end by wuhao 2008-1-8 for fix bug 1362
                }

                //The selection is not determined by the HighlightText and CursorPosition property.
                if (highlightText == 0 /* None */ && cursorPos == 0 /* Default */) {
                    return retInfo;
                }

                //Add comments by Ryan Wu at 9:23 Oct. 18 2007.
                //For fix the bug#9065.
                if (focusType == 2 /* ContextMenu */) {
                    return retInfo;
                }

                //end by Ryan Wu.
                //Add comments by Ryan Wu at 14:38 Oct. 11 2007.
                //For fix the bug#8998.
                //    //According to the HighlightText property and CursorPosition property to set the
                //	//selection.
                //	var ret = this.SetCursorPositionAndSelection(highlightText, retInfo.Text, cursorPos, retInfo.SelectionStart);
                var startPos = retInfo.SelectionStart == null ? data.SelectionStart : retInfo.SelectionStart;
                var ret = this.SetCursorPositionAndSelection(highlightText, retInfo.Text, cursorPos, startPos);

                //end by Ryan Wu.
                if (ret != null) {
                    retInfo.SelectionStart = ret.SelectionStart;
                    retInfo.SelectionEnd = ret.SelectionEnd;
                    retInfo.IsSelectionDeterminedByHighlightText = true;
                }

                //Add comments by Ryan Wu at 9:13 Oct. 18 2007.
                //For removing the useless code.
                //	//the focusType is FocusType.ClientEvent it means that the focus is set by ourself.
                //	if (focusType == FocusType.ClientEvent)
                //	{
                //		return retInfo;
                //	}
                //end by Ryan Wu.
                return retInfo;
            };

            /**
            * Handle the onblur event.
            */
            BaseUIProcess.prototype.LoseFocus = function (data) {
            };

            /**
            * Handle the onmousedown event.
            */
            BaseUIProcess.prototype.MouseDown = function (mouseButton) {
                var retInfo = {};

                this.isTriClick = false;

                //for triple click
                if (this.isDblClick && !Utility.GrapeCityTimeout && mouseButton == 0 /* Left */) {
                    this.isTriClick = true;
                    retInfo = this.SelectAll();
                }

                this.isDblClick = false;
                return retInfo;
            };

            /**
            * Handle the onmouseup event.
            */
            // Frank Liu added the parameter "ctrlPressed" at 2013/06/27 for bug 881.
            BaseUIProcess.prototype.MouseUp = function (obj, start, end, mouseButton, ctrlPressed) {
                var retInfo = {};

                if (this.isTriClick) {
                    Utility.SetSelection(obj, start, end);

                    return null;
                }

                //Add comments by Ryan Wu at 10:13 Sep. 13 2007.
                //For fix the bug "17. Ctrl+Click(select all text) will take no effects.".
                // Frank Liu fixed bug 881 at 2013/06/27.
                //if (!Utility.IsIE() && Utility.FuncKeysPressed.Ctrl) {
                if (ctrlPressed) {
                    retInfo = this.SelectAll();
                    Utility.SetSelection(obj, retInfo.SelectionStart, retInfo.SelectionEnd);

                    return retInfo;
                }

                //end by Ryan Wu.
                retInfo.SelectionStart = start;
                retInfo.SelectionEnd = end;

                if (mouseButton == 0 /* Left */) {
                    //bug#5675
                    //retInfo = GrapeCity_InputMan_GetCursorEndPos(obj, start);
                    retInfo.SelectionStart = Utility.GetSelectionStartPosition(obj);
                    retInfo.SelectionEnd = Utility.GetSelectionEndPosition(obj);
                }

                if (retInfo.SelectionStart != retInfo.SelectionEnd) {
                    this.isMulSelected = true;
                } else {
                    this.isMulSelected = false;
                }

                return retInfo;
            };

            /**
            * Handle the shortcut key event.
            */
            BaseUIProcess.prototype.ProcessShortcutKey = function (keyAction, readOnly, end, start) {
                var retInfo = {};

                switch (keyAction) {
                    case "Clear":
                        if (readOnly) {
                            retInfo.System = false;
                            return retInfo;
                        }

                        return this.Clear();
                    case "NextControl":
                        var ret = this.MoveControl(this.GetInputElement(), true, false, "NextControl");

                        if (ret != null) {
                            retInfo.EventInfo = ret.EventInfo;
                            retInfo.FocusType = ret.FocusType;
                            retInfo.FocusExit = true;
                        }

                        retInfo.System = false;
                        return retInfo;
                    case "PreviousControl":
                        var ret = this.MoveControl(this.GetInputElement(), false, false, "PreviousControl");
                        if (ret != null) {
                            retInfo.EventInfo = ret.EventInfo;
                            retInfo.FocusType = ret.FocusType;
                            retInfo.FocusExit = true;
                        }

                        retInfo.System = false;
                        return retInfo;
                    case "NextField":
                        retInfo = this.MoveField(end, true);
                        return retInfo;
                    case "PreviousField":
                        retInfo = this.MoveField(end, false);
                        return retInfo;
                    case "NextField/NextControl":
                        var retInfo = this.MoveFieldAndControl(end, true);
                        return retInfo;
                    case "PreviousField/PreviousControl":
                        var retInfo = this.MoveFieldAndControl(end, false);
                        return retInfo;
                }
            };

            /**
            * Process char key input.
            */
            BaseUIProcess.prototype.ProcessCharKeyInput = function (k, start, end, isExitOnLastChar, text) {
                return null;
            };

            /**
            * Prcess navigator key input.
            */
            BaseUIProcess.prototype.ProcessNavigatorKeyInput = function (k, editMode, clipContent, text, start, end, exitOnLeftRightKey, isExitOnLastChar) {
                var retInfo = {};

                switch (k) {
                    case 45:
                        if (editMode == 2 /* FixedInsert */) {
                            this.isOverWrite = false;
                        } else if (editMode == 3 /* FixedOverwrite */) {
                            this.isOverWrite = true;
                        } else {
                            this.isOverWrite = !this.isOverWrite;
                        }

                        retInfo.Overwrite = this.isOverWrite;
                        retInfo.System = false;

                        if (this.Format.Fields.fieldCount == 0) {
                            retInfo.System = true;
                        }

                        return retInfo;

                    case 8:
                        //Add comments by Ryan Wu at 14:23 Jul. 19 2006.
                        //Add text param only for number to judge whether the current text is zero.
                        //retInfo = this.ProcessBackSpace(start, end);
                        retInfo = this.ProcessBackSpace(start, end, text);

                        //end by Ryan Wu.
                        retInfo.System = false;
                        break;

                    case 46:
                        //Add comments by Ryan Wu at 14:23 Jul. 19 2006.
                        //Add text param only for number to judge whether the current text is zero.
                        //retInfo = this.ProcessDelete(start, end);
                        retInfo = this.ProcessDelete(start, end, text);

                        //end by Ryan Wu.
                        retInfo.System = false;
                        break;

                    case 196643:

                    case 196644:

                    case 196645:

                    case 196647:

                    case 65569:

                    case 196641:

                    case 65570:

                    case 196642:
                        if (k == 65569 || k == 196641) {
                            k = 196644;
                        } else if (k == 65570 || k == 196642) {
                            k = 196643;
                        }

                        //perform the Shift+Ctrl+Left,Shift+Ctrl+Right,Shift+Ctrl+Home,Shift+Ctrl+End action
                        retInfo.SelectionEnd = this.GetCaretPosition(end, k);
                        this.isMulSelected = true;
                        retInfo.System = false;
                        break;

                    case 65582:
                    case 65544:
                        if (this.isMulSelected) {
                            if (this.Owner._isSupportClipBoard()) {
                                retInfo = this.Cut(clipContent, start, end);
                            } else {
                                retInfo.System = true;
                                break;
                            }
                        } else {
                            retInfo = this.ProcessBackSpace(start, end);
                        }
                        retInfo.System = false;
                        break;

                    case 65581:

                    case 131158:
                        if (this.Owner._isSupportClipBoard()) {
                            var pasteData = Utility.GetPasteData(this.Owner ? this.Owner.GetUseClipboard() : true);
                            retInfo = this.Paste(start, end, pasteData, isExitOnLastChar);
                            retInfo.System = false;
                        } else {
                            retInfo.System = true;
                        }
                        break;

                    case 65571:

                    case 65572:

                    case 65573:

                    case 65575:

                    case 65574:

                    case 65576:
                        // end by Jiang Changcheng <--
                        this.isMulSelected = true;

                        //perform the Shift+Left,Shift+Right,Shift+Home,Shift+End action
                        retInfo.SelectionEnd = this.GetCaretPosition(end, k);
                        retInfo.System = false;
                        break;

                    case 131139:

                    case 131117:
                        if (this.Owner._isSupportClipBoard()) {
                            this.Copy(clipContent, start, end);
                            retInfo.System = false;
                        } else {
                            retInfo.System = true;
                        }

                        break;

                    case 131118:
                        if (!this.isMulSelected) {
                            end = this.GetCaretPosition(end, k);
                        }

                        retInfo = this.ProcessDelete(start, end);
                        retInfo.System = false;
                        break;

                    case 131080:
                    case 196616:
                        if (!this.isMulSelected) {
                            end = this.GetCaretPosition(end, k);
                        }

                        retInfo = this.ProcessBackSpace(start, end);
                        retInfo.System = false;
                        break;

                    case 131137:
                        retInfo = this.SelectAll();
                        retInfo.System = false;
                        break;

                    case 131160:
                        if (this.Owner._isSupportClipBoard()) {
                            retInfo = this.Cut(clipContent, start, end);
                            retInfo.System = false;
                        } else {
                            retInfo.System = true;
                        }

                        break;

                    case 131162:
                        //Need add undo methods by Ryan wu.
                        retInfo = this.Undo();
                        retInfo.System = false;
                        break;

                    case 131109:

                    case 37:
                        //Move to previous control
                        if (start == 0 && (exitOnLeftRightKey == 3 /* Both */ || exitOnLeftRightKey == 1 /* Left */)) {
                            var exitType = k == 37 ? "Left" : "CtrlLeft";
                            var ret = this.MoveControl(this.GetInputElement(), false, true, exitType);

                            if (ret != null) {
                                retInfo.EventInfo = ret.EventInfo;
                                retInfo.FocusType = ret.FocusType;
                                retInfo.FocusExit = true;
                            }

                            return retInfo;
                        }

                    case 131108:

                    case 131110:

                    case 36:

                    case 33:

                    case 131105:
                        if (k == 33 || k == 131105) {
                            k = 131108;
                        }

                        retInfo = this.ProcessLeftDirection(start, end, k);
                        retInfo.System = false;
                        break;

                    case 131111:

                    case 39:
                        //Move to next control
                        if (start == text.GetLength() && (exitOnLeftRightKey == 3 /* Both */ || exitOnLeftRightKey == 2 /* Right */)) {
                            var exitType = k == 39 ? "Right" : "CtrlRight";
                            var ret = this.MoveControl(this.GetInputElement(), true, true, exitType);
                            if (ret != null) {
                                retInfo.EventInfo = ret.EventInfo;
                                retInfo.FocusType = ret.FocusType;
                                retInfo.FocusExit = true;
                            }
                            return retInfo;
                        }

                    case 131107:

                    case 131112:

                    case 35:

                    case 34:

                    case 131106:
                        if (k == 34 || k == 131106) {
                            k = 131107;
                        }
                        retInfo = this.ProcessRightDirection(start, end, k);
                        retInfo.System = false;
                        break;
                    default:
                        retInfo = null;
                        break;
                }

                return retInfo;
            };
            BaseUIProcess.prototype.ProcessLeftDirection = function (start, end, k) {
            };
            BaseUIProcess.prototype.ProcessRightDirection = function (start, end, k) {
            };

            /**
            * Handle the onkeydown event.
            */
            BaseUIProcess.prototype.KeyDown = function (data) {
                var k = data.KeyCode;
                var start = data.SelectionStart;
                var end = data.SelectionEnd;
                var text = data.Text;
                var editMode = data.EditMode;
                var keyAction = data.KeyAction;
                var readOnly = data.ReadOnly;
                var clipContent = data.ClipContent;

                //var funcKeysPressed	   = data.FuncKeysPressed;
                var isExitOnLastChar = data.ExitOnLastChar;
                var exitOnLeftRightKey = data.ExitOnLeftRightKey;
                var tabAction = data.TabAction;
                var retInfo = {};

                switch (editMode) {
                    case 0 /* Insert */:
                        this.isOverWrite = false;
                        break;
                    case 1 /* Overwrite */:
                        this.isOverWrite = true;
                        break;
                    case 2 /* FixedInsert */:
                        this.isOverWrite = false;
                        break;
                    case 3 /* FixedOverwrite */:
                        this.isOverWrite = true;
                        break;
                }

                if (start != end) {
                    this.isMulSelected = true;
                } else {
                    this.isMulSelected = false;
                }

                switch (k) {
                    case 9:
                        retInfo = this.ProcessTabKey(end, true, tabAction);
                        return retInfo;
                    case 65545:
                        retInfo = this.ProcessTabKey(end, false, tabAction);
                        return retInfo;
                }

                //ShortCuts
                if (keyAction != null) {
                    return this.ProcessShortcutKey(keyAction, readOnly, end, start);
                }

                //The ReadOnly property is set to true
                if (readOnly) {
                    //When readonly is true, Escape, Alt + Up, Alt + Down, Up, Down can also take effect.
                    //If return null, then in BaseInputControl will handle the Escape, Alt + Up and Alt + Down action.
                    if (k == 27 || k == 262182 || k == 262184 || k == 38 || k == 40) {
                        return null;
                    }

                    //we only let the Ctrl+C and Ctrl+Insert and ShortCut to work when we set
                    //ReadOnly property to true.
                    // change by Sean Huang at 2008.08.13, for bug 28 (ttp)-->
                    //if (k != 131117 && k != 131139)
                    if (k != 131117 && k != 131139 && k != 9 && k != 65545 && k != 131081 && k != 196617 && k != 131137 && k != 37 && k != 39 && k != 38 && k != 40) {
                        return retInfo;
                    }
                }

                //the DateFormat has no Pattern property, we use the system's keydown action
                if (this.Format.Fields.fieldCount == 0) {
                    switch (k) {
                        case 45:
                            if (editMode == 2 /* FixedInsert */) {
                                this.isOverWrite = false;
                            } else if (editMode == 3 /* FixedOverwrite */) {
                                this.isOverWrite = true;
                            } else {
                                this.isOverWrite = !this.isOverWrite;
                            }

                            retInfo.Overwrite = this.isOverWrite;

                            if (this.Format.Fields.fieldCount == 0) {
                                retInfo.System = true;
                            }

                            return retInfo;

                        case 37:

                        case 131109:
                            //Move to previous control
                            if (start == 0 && (exitOnLeftRightKey == 3 /* Both */ || exitOnLeftRightKey == 1 /* Left */)) {
                                var exitType = k == 37 ? "Left" : "CtrlLeft";
                                var ret = this.MoveControl(this.GetInputElement(), false, true, exitType);
                                if (ret != null) {
                                    retInfo.EventInfo = ret.EventInfo;
                                    retInfo.FocusType = ret.FocusType;
                                    retInfo.FocusExit = true;
                                }
                                return retInfo;
                            }
                            break;

                        case 39:

                        case 131111:
                            //Move to next control
                            if (start == text.GetLength() && (exitOnLeftRightKey == 3 /* Both */ || exitOnLeftRightKey == 2 /* Right */)) {
                                var exitType = k == 39 ? "Right" : "CtrlRight";
                                var ret = this.MoveControl(this.GetInputElement(), true, true, exitType);
                                if (ret != null) {
                                    retInfo.EventInfo = ret.EventInfo;
                                    retInfo.FocusType = ret.FocusType;
                                    retInfo.FocusExit = true;
                                }
                                return retInfo;
                            }
                            break;
                    }

                    return null;
                }

                //Process char key input.
                var processInfo = this.ProcessCharKeyInput(k, start, end, isExitOnLastChar, text);

                if (processInfo != null) {
                    return processInfo;
                }

                retInfo = this.ProcessNavigatorKeyInput(k, editMode, clipContent, text, start, end, exitOnLeftRightKey, isExitOnLastChar);

                return retInfo;
            };

            /**
            * Handle the onkeypress event.
            */
            BaseUIProcess.prototype.KeyPress = function (e) {
            };

            /**
            * Handle the onkeyup event.
            */
            BaseUIProcess.prototype.KeyUp = function (e) {
            };

            /**
            * Handle the oncontextmenu event.
            */
            BaseUIProcess.prototype.ShowContextMenu = function (oText, selText) {
                var retInfo = {};

                //If there's no text selected
                if (selText == "") {
                    retInfo.SelectionStart = Utility.GetCursorPosition(oText);
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                }

                return retInfo;
            };

            /**
            * Handle the onselectstart event.
            */
            BaseUIProcess.prototype.SelectStart = function (obj, selText, mouseButton) {
                var retInfo = {};

                if (selText == "" && !this.isTriClick && !this.isDblClick && mouseButton != -1 /* Default */) {
                    retInfo.SelectionStart = Utility.GetCursorPosition(obj);
                    retInfo.SetFalse = true;
                }

                return retInfo;
            };

            /**
            * Handle the ondblclick event.
            */
            BaseUIProcess.prototype.DoubleClick = function (pos) {
                var retInfo = {};

                //Get current field range
                var fieldIndex = this.Format.Fields.GetFieldIndexByPos(pos);
                var fieldPos = this.Format.Fields.GetFieldRange(fieldIndex.index);
                retInfo.SelectionStart = fieldPos.start;
                retInfo.SelectionEnd = fieldPos.length + fieldPos.start;

                //set timer for tripple click
                Utility.GrapeCityTimeout = false;
                this.isDblClick = true;
                this.isMulSelect = true;

                setTimeout(function () {
                    Utility.GrapeCityTimeout = true;
                }, 300);

                return retInfo;
            };

            /**
            * Handle the undo actions.
            */
            BaseUIProcess.prototype.Undo = function () {
            };

            /**
            * Handle the cut actions.
            * @param clipContent - The copy mode.
            * @param start - The start cursor position.
            * @param end   - The end cursor position.
            * @returns Returns the cursor position.
            */
            BaseUIProcess.prototype.Cut = function (clipContent, start, end) {
                var retInfo = {};

                if (start == end) {
                    return retInfo;
                }

                this.FireClientEvent("OnBeforeCut");
                this.Copy(clipContent, start, end);
                retInfo = this.ProcessDelete(start, end);

                this.FireClientEvent("OnCut");
                return retInfo;
            };

            /**
            * Handle the oncopy event.
            * @param clipContent - The copy mode.
            * @param start - The start cursor position.
            * @param end   - The end cursor position.
            */
            BaseUIProcess.prototype.Copy = function (clipContent, start, end) {
                var text = null;
                var useClipboard = true;

                if (clipContent == 1 /* ExcludeLiterals */) {
                    var length = Math.abs(start - end);
                    var start = Math.min(start, end);
                    if (length == 0) {
                        return;
                    }

                    text = this.Format.Fields.GetNonLiteralsText(start, length);
                } else if (!input.CoreUtility.IsIE() || input.CoreUtility.IsIE11OrLater()) {
                    text = Utility.GetSelectionText(this.Owner.GetInputElement());
                } else {
                    text = document.selection.createRange().text;
                }

                // end of Sean Huang <--
                //end by Ryan Wu.
                if (this.Owner) {
                    text = BaseUIProcess.UpdateCrLfString(text, this.Owner.GetAcceptsCrlf());
                    useClipboard = this.Owner.GetUseClipboard();
                }

                // change by Sean Huang at 2009.04.29, for bug 2209 -->
                //Utility.SetCopy(text);
                if (input.CoreUtility.IsIE()) {
                    setTimeout(function () {
                        Utility.SetCopy(text, useClipboard);
                    });
                } else {
                    Utility.SetCopy(text, useClipboard);
                }
                // end of Sean Huang <--
            };

            /**
            * Handle the onpaste event.
            */
            BaseUIProcess.prototype.Paste = function (start, end, text, exitonlastChar) {
            };

            /**
            * Select all the content.
            * @returns Returns the cursor position.
            */
            BaseUIProcess.prototype.SelectAll = function () {
                var retInfo = { SelectionStart: 0, SelectionEnd: 0 };
                retInfo.SelectionStart = 0;

                //modified by sj 2008.8.13 for bug 243
                var ShowLiterals;

                if (this.ID) {
                    ShowLiterals = this.GetShowLiterals();
                }

                if (ShowLiterals == 'PostDisplay' || ShowLiterals == 'PreDisplay') {
                    retInfo.SelectionEnd = Utility.FindIMControl(this.ID).GetText().GetLength();
                } else {
                    retInfo.SelectionEnd = this.Format.Fields.GetLength();
                }

                //retInfo.SelectionEnd   = this.Format.Fields.GetLength();
                //end by sj
                this.isMulSelected = true;

                return retInfo;
            };

            //Add comments by Ryan Wu at 9:31 Apr. 5 2007.
            //For support Aspnet Ajax 1.0.
            ///*
            //* This Function should be called when an event needs to be fired.
            //* @param oControl - the javascript object representation of our control.
            //* @param eName    - the name of the function that should handle this event.
            //* @param eArgs    - the argument of the function that should handle this event.
            //*/
            //FireEvent (oControl, eName, eArgs)
            //{
            //	//Because when we fire client event we may be invoke the lose focus event,
            //	//so we must return the current focus type of getting focus.
            //	//No event will be fired
            //	if (eName == null || eName == "")
            //	{
            //		return null;
            //	}
            //
            //	if (Utility.FireEvent(oControl, eName, eArgs))
            //	{
            //		return FocusType.ClientEvent;
            //	}
            //};
            /*
            * This Function should be called when an event needs to be fired.
            * @param oControl - the javascript object representation of our control.
            * @param eName    - the name of the function that should handle this event.
            * @param eArgs    - the argument of the function that should handle this event.
            */
            BaseUIProcess.prototype.FireEvent = function (oControl, eName, eArgs, eType) {
                //Because when we fire client event we may be invoke the lose focus event,
                //so we must return the current focus type of getting focus.
                //No event will be fired
                //if (eName == null || eName == "") {
                //    return null;
                //}
                if (Utility.FireEvent(oControl, eName, eArgs, eType)) {
                    return 3 /* ClientEvent */;
                }
            };

            //end by Ryan Wu.
            /**
            * Process the input char key action.
            * @param start - The specified start cursor position.
            * @param end - The specified end cursor position.
            * @param charInput - The specified char will be input.
            * @returns Returns action result includes cursor position and if succeed after the process and whether we fire a client event.
            */
            BaseUIProcess.prototype.ProcessCharKey = function (start, end, charInput, isExitOnLastChar) {
                var processInfo = {};

                //get the selection information.
                var selectionStart = Math.min(start, end);
                var selectionLength = Math.abs(end - start);
                var retInfo = {};

                processInfo.start = selectionStart;
                processInfo.success = false;

                //none action.
                if (this.Format.Fields.GetFieldIndex(selectionStart).index == -1) {
                    //we input an invalid char, so invoke the InvalidInput Event
                    var eventInfo = {};
                    eventInfo.Name = this.Owner.InvalidInputEvent;
                    eventInfo.Args = null;

                    //Add comments by Ryan Wu at 10:27 Apr. 5 2007.
                    //For support Aspnet Ajax 1.0.
                    eventInfo.Type = "invalidInput";

                    //end by Ryan Wu.
                    processInfo.EventInfo = eventInfo;

                    return processInfo;
                }

                var text = charInput.toString();

                if (selectionLength == 0 && !this.isOverWrite) {
                    retInfo = this.Format.Fields.Insert(selectionStart, text, false);
                } else if (selectionLength == 0) {
                    if (selectionStart == this.Format.Fields.GetLength()) {
                        retInfo = this.Format.Fields.Insert(selectionStart, text, false);
                    } else {
                        var isReplace = false;
                        var posInfo = this.Format.Fields.GetFieldIndexByPos(selectionStart);
                        var fieldIndex = posInfo.index;
                        var fieldOffset = posInfo.offset;

                        //var fieldsLength = selectionStart - fieldOffset;
                        var fieldRange = this.Format.Fields.GetFieldRange(fieldIndex);

                        if (this.Format.Fields.GetFieldByIndex(fieldIndex).fieldLabel == "PromptField") {
                            if (selectionStart - fieldOffset + fieldRange.length == this.Format.Fields.GetLength()) {
                                isReplace = false;
                            } else {
                                isReplace = true;
                                selectionLength = fieldRange.length - fieldOffset + 1;
                            }
                        } else {
                            isReplace = true;

                            // DaryLuo 2013/07/15 fix bug 1014 in IM HTML 5.
                            selectionLength = charInput.GetLength();
                        }

                        //none action.
                        if (this.Format.Fields.GetFieldIndexByPos(selectionStart + selectionLength).index == -1) {
                            //we input an invalid char, so invoke the InvalidInput Event
                            var eventInfo = {};
                            eventInfo.Name = this.Owner.InvalidInputEvent;
                            eventInfo.Args = null;

                            //Add comments by Ryan Wu at 10:27 Apr. 5 2007.
                            //For support Aspnet Ajax 1.0.
                            eventInfo.Type = "invalidInput";

                            //end by Ryan Wu.
                            processInfo.EventInfo = eventInfo;

                            return processInfo;
                        }

                        if (isReplace) {
                            retInfo = this.Format.Fields.Replace(selectionStart, selectionLength, text, false);
                        } else {
                            retInfo = this.Format.Fields.Insert(selectionStart, text, false);
                        }
                    }
                } else {
                    retInfo = this.Format.Fields.Replace(selectionStart, selectionLength, text, false);
                }

                selectionStart = retInfo.cursorPos;

                //we input an invalid char, so invoke the InvalidInput Event
                if (retInfo.text != "") {
                    var eventInfo = {};
                    eventInfo.Name = this.Owner.InvalidInputEvent;
                    eventInfo.Args = null;

                    //Add comments by Ryan Wu at 10:27 Apr. 5 2007.
                    //For support Aspnet Ajax 1.0.
                    eventInfo.Type = "invalidInput";

                    //end by Ryan Wu.
                    processInfo.EventInfo = eventInfo;

                    processInfo.start = selectionStart;
                    processInfo.success = false;

                    return processInfo;
                }

                //judge if the focus should exit on last char.
                if (isExitOnLastChar == true) {
                    if (selectionStart == this.Format.Fields.GetLength()) {
                        this.moveFocusExitOnLastChar = true;
                    } else {
                        var posInfo = this.Format.Fields.GetFieldIndexByPos(selectionStart);
                        var fieldIndex = posInfo.index;
                        var fieldOffset = posInfo.offset;

                        if (fieldIndex == this.Format.Fields.fieldCount - 1 && fieldOffset == 0 && this.Format.Fields.GetFieldByIndex(fieldIndex).fieldLabel == "PromptField") {
                            this.moveFocusExitOnLastChar = true;
                        }
                    }
                }

                processInfo.start = selectionStart;
                processInfo.success = true;

                return processInfo;
            };

            /**
            * Process the Delete key down action.
            * @param start - The specified start cursor position.
            * @param end - The specified end cursor position.
            * @returns Returns the cursor position after the process.
            */
            BaseUIProcess.prototype.ProcessDeleteKey = function (start, end) {
                //get the selection information.
                var selectionStart = Math.min(start, end);
                var selectionLength = Math.abs(start - end);
                var retInfo = {};

                if (selectionStart == this.Format.Fields.GetLength() && selectionLength == 0) {
                    return retInfo;
                }

                //var startFieldOffset;
                var startFieldIndex;
                var fieldPosInfo = this.Format.Fields.GetFieldIndexByPos(selectionStart);
                startFieldIndex = fieldPosInfo.index;

                //startFieldOffset = fieldPosInfo.offset;
                //none action.
                if (startFieldIndex == -1) {
                    return retInfo;
                }

                //if the selectionlength = 0, do the delete action for one post char.
                if (selectionLength == 0) {
                    //none action.
                    if (this.Format.Fields.GetFieldByIndex(startFieldIndex).fieldLabel == "PromptField") {
                        return retInfo;
                    }

                    selectionStart = this.Format.Fields.Delete(selectionStart, 1).cursorPos;

                    retInfo.SelectionStart = selectionStart;
                    retInfo.SelectionEnd = retInfo.SelectionStart;
                } else {
                    var endFieldOffset;
                    var endFieldIndex;
                    fieldPosInfo = this.Format.Fields.GetFieldIndexByPos(selectionStart + selectionLength);
                    endFieldOffset = fieldPosInfo.offset;
                    endFieldIndex = fieldPosInfo.index;

                    //none action.
                    if (endFieldIndex == -1) {
                        return retInfo;
                    }

                    if (endFieldOffset == 0) {
                        endFieldIndex--;
                    }

                    //none action
                    if (startFieldIndex == endFieldIndex && this.Format.Fields.GetFieldByIndex(startFieldIndex).fieldLabel == "PromptField") {
                        return retInfo;
                    }

                    var info = this.Format.Fields.Delete(selectionStart, selectionLength);

                    //The same as BackSpace. ("20005[/)02/24" press delete)
                    if (!info.isSucceed) {
                        return retInfo;
                    }

                    retInfo.SelectionStart = info.cursorPos;

                    if (retInfo.SelectionStart == 0 && this.Format.Fields.GetFieldByIndex(0).fieldLabel == "PromptField") {
                        retInfo.SelectionStart = this.Format.Fields.GetFieldByIndex(0).GetLength();
                    }

                    retInfo.SelectionEnd = retInfo.SelectionStart;

                    //Accordingto the changed information, generate BehaviorInfo and invoke UpdateBehavior to finsihed the correlative action.
                    var currentFieldOffset;
                    var currentFieldIndex;
                    var currentFieldInfo = this.Format.Fields.GetFieldIndexByPos(retInfo.SelectionStart);
                    currentFieldIndex = currentFieldInfo.index;
                    currentFieldOffset = currentFieldInfo.offset;

                    if (currentFieldOffset != 0 && this.Format.Fields.GetFieldByIndex(currentFieldIndex).fieldLabel == "PromptField") {
                        retInfo.SelectionStart = retInfo.SelectionStart - currentFieldOffset + this.Format.Fields.GetFieldByIndex(currentFieldIndex).GetLength();
                        retInfo.SelectionEnd = retInfo.SelectionStart;
                    }
                }

                return retInfo;
            };

            /**
            * Perform the delete keydown event.
            * @param start - The start cursor position.
            * @param end   - The start end position.
            */
            BaseUIProcess.prototype.ProcessBackSpace = function (start, end, text) {
            };

            /**
            * Perform the delete keydown event.
            * @param start - The start cursor position.
            * @param end   - The start end position.
            */
            BaseUIProcess.prototype.ProcessDelete = function (start, end, text) {
            };

            /**
            * Get the next caret position according to the special cursor position and keycode(processType).
            * @param cursorPos - The current cursor position.
            * @param keyCode   - The keyCode indicate the key action.
            * @returns Return the cursor position after the key action.
            */
            BaseUIProcess.prototype.GetCaretPosition = function (cursorPos, keyCode, startPos, endPos, literalFieldLabel) {
                var fields = this.Format.Fields;
                var fieldPosInfo = fields.GetFieldIndexByPos(cursorPos);
                var fieldIndex = fieldPosInfo.index;
                var fieldOffset = fieldPosInfo.offset;
                var fieldRange;

                //var startPos;
                //var endPos;
                var i = 0;

                switch (keyCode) {
                    case 36:

                    case 65572:

                    case 65574:
                        // end by Jiang Changcheng <--
                        if (cursorPos <= startPos) {
                            return 0;
                        } else {
                            return startPos;
                        }

                    case 35:

                    case 65571:

                    case 65576:
                        // end by Jiang Changcheng <--
                        if (cursorPos >= endPos) {
                            return fields.GetLength();
                        } else {
                            return endPos;
                        }

                    case 37:
                        if (cursorPos == 0) {
                            return 0;
                        }

                        if (fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel) {
                            if (fieldOffset > 0) {
                                cursorPos -= fieldOffset;
                            } else {
                                cursorPos--;
                            }
                        } else {
                            //aaaggg|eebbbMMccddee
                            if (fieldOffset == 0 && fields.GetFieldByIndex(fieldIndex - 1).fieldLabel == literalFieldLabel) {
                                cursorPos -= fields.GetFieldRange(fieldIndex - 1).length;
                            } else {
                                cursorPos--;
                            }
                        }
                        break;

                    case 39:
                        if (cursorPos == fields.GetLength()) {
                            return cursorPos;
                        }

                        if (fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel) {
                            fieldRange = fields.GetFieldRange(fieldIndex);
                            startPos = fieldRange.start;
                            endPos = startPos + fieldRange.length;

                            if (cursorPos < endPos) {
                                return endPos;
                            }
                        } else {
                            cursorPos++;
                        }
                        break;

                    case 131109:
                        if (cursorPos == 0 || fieldIndex == 0) {
                            return 0;
                        }

                        if (fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel) {
                            fieldRange = fields.GetFieldRange(fieldIndex - 1);
                            cursorPos = fieldRange.start;
                        } else {
                            if (fieldOffset == 0) {
                                for (i = fieldIndex - 1; i >= 0; i--) {
                                    //find the edit field before the current field
                                    if (fields.GetFieldByIndex(i).fieldLabel != literalFieldLabel) {
                                        fieldRange = fields.GetFieldRange(i);

                                        return fieldRange.start;
                                    }
                                }

                                //if the former field is PromptField, then return 0
                                return 0;
                            } else {
                                cursorPos -= fieldOffset;
                            }
                        }
                        break;

                    case 196645:
                        if (cursorPos == 0 || fieldIndex == 0) {
                            return 0;
                        }

                        if (fieldOffset == 0) {
                            fieldRange = fields.GetFieldRange(fieldIndex - 1);
                            cursorPos = fieldRange.start;
                        } else {
                            cursorPos -= fieldOffset;
                        }
                        break;

                    case 131111:
                        if (cursorPos == fields.GetLength() || fieldIndex == fields.fieldCount - 1) {
                            return fields.GetLength();
                        }

                        if (fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel) {
                            fieldRange = fields.GetFieldRange(fieldIndex + 1);
                            cursorPos = fieldRange.start;
                        } else {
                            for (i = fieldIndex + 1; i < fields.fieldCount; i++) {
                                //find the edit field after the current field
                                if (fields.GetFieldByIndex(i).fieldLabel != literalFieldLabel) {
                                    fieldRange = fields.GetFieldRange(i);

                                    return fieldRange.start;
                                }
                            }

                            //if the latter field is PromptField, then return fieldcollection length
                            return fields.GetLength();
                        }
                        break;

                    case 196647:
                        if (cursorPos == fields.GetLength() || fieldIndex == fields.fieldCount - 1) {
                            return fields.GetLength();
                        }

                        //if the current caret is in the last field then return the fields' length
                        fieldRange = fields.GetFieldRange(fieldIndex + 1);
                        cursorPos = fieldRange.start;
                        break;

                    case 131118:
                        if (cursorPos == fields.GetLength() || fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel) {
                            return cursorPos;
                        } else {
                            fieldRange = fields.GetFieldRange(fieldIndex);

                            return fieldRange.start + fieldRange.length;
                        }

                    case 131080:
                    case 196616:
                        if (cursorPos == 0 || (fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel && fieldIndex == 0)) {
                            return cursorPos;
                        } else if (fields.GetFieldByIndex(fieldIndex).fieldLabel == literalFieldLabel) {
                            return fields.GetFieldRange(fieldIndex - 1).start;
                        } else {
                            if (fieldOffset == 0) {
                                for (i = fieldIndex - 1; i >= 0; i--) {
                                    //find the edit field before the current field
                                    if (fields.GetFieldByIndex(i).fieldLabel != literalFieldLabel) {
                                        fieldRange = fields.GetFieldRange(i);

                                        return fieldRange.start;
                                    }
                                }

                                //if there is no edit field before the current field
                                return cursorPos;
                            } else {
                                cursorPos -= fieldOffset;
                            }
                        }
                        break;

                    case 196643:

                    case 131107:

                    case 131112:
                        // end of Sean Huang <--
                        return fields.GetLength();

                    case 196644:

                    case 131108:

                    case 131110:
                        // end of Sean Huang <--
                        return 0;

                    case 65573:
                        if (cursorPos == 0) {
                            return 0;
                        } else {
                            return --cursorPos;
                        }

                    case 65575:
                        if (cursorPos == fields.GetLength()) {
                            return cursorPos;
                        } else {
                            return ++cursorPos;
                        }
                }

                return cursorPos;
            };

            /**
            * Compare the specified keycode with the shortcut array passed from server side.
            * @param keyCode - The keyCode indicate the key action.
            * @param shortcut - The shortcut text passed from server side.
            * @returns Return true if keycode in the shortcuts array otherwise return false.
            */
            BaseUIProcess.prototype.CompareShortcut = function (keyCode, shortcut) {
                if (shortcut.toString().IndexOf("|") == -1) {
                    if (shortcut == keyCode) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    var index = null;
                    while (index != -1) {
                        index = shortcut.toString().IndexOf("|");
                        var length = shortcut.toString().GetLength();
                        if (shortcut.Substring(0, index == -1 ? length : index) == keyCode) {
                            return true;
                        } else {
                            shortcut = shortcut.Substring(index + 1, length);
                        }
                    }
                    return false;
                }
            };

            /**
            * Move the focus from one control to another.
            * @param elementID - The current element id.
            * @param isForward - The boolean value indicate if we move focus to the next control according to the tabindex value.
            * @param isUseLeftRightKey - The boolean value indicate if we move focus to the next control by left or right key.
            * @param exitType - The exit type.
            */
            BaseUIProcess.prototype.MoveControl = function (currentElement, isForward, isUseLeftRightKey, exitType) {
                var elements = input.CoreUtility.GetElements();
                var ret = null;
                var retInfo = {};

                //Add by Ryan Wu at 10:24 Jan. 20 2006.
                //For fix bug#4965.
                if (elements.length < 2) {
                    return null;
                }

                //Add comments by Ryan Wu at 14:08 Aug. 28 2007.
                //For the sequence of the onfocus, onblur, onkeydown event in firefox is not same as IE
                //when we use the focus method in keydown.
                //in IE: onkeydown --> onblur --> onfocus.
                //in Firefox: onblur --> onfocus --> onkeydown.
                //So we must split the MoveFocus into two methods. Firstly, We must get the next control's id.
                //Then if we use the ExitOnLeftRightKey to move focus, we should set the next control's FocusType to FocusType.Left/FocusType.Right.
                //Lastly we can invoke the obj.focus method to set focus to the next control.
                //	var nextID = Utility.MoveFocus(elementID, elements, isForward);
                //
                //	if (isUseLeftRightKey == true)
                //	{
                //		try
                //		{
                //		    var index = nextID.LastIndexOf("_EditField");
                //
                //		    if (index != -1)
                //		    {
                //		        var conID = nextID.Substring(0, index);
                //		        var nextObj = FindIMControl(conID);
                //		        nextObj.FocusType = isForward ? FocusType.Left : FocusType.Right;
                //		    }
                //		}
                //		catch(e)
                //		{}
                //    }
                var nextElement = input.CoreUtility.GetNextFocusableControl(currentElement, elements, isForward);

                // TODO:
                //if (isUseLeftRightKey == true) {
                //    try {
                //        var index = nextID.LastIndexOf("_EditField");
                //        if (index != -1) {
                //            var conID = nextID.Substring(0, index);
                //            var nextObj = FindIMControl(conID);
                //            nextObj.FocusType = isForward ? FocusType.Left : FocusType.Right;
                //        }
                //        else {
                //            var nextObj = FindIMControl(nextID);
                //            if (nextObj) {
                //                if (nextObj.IsjQueryControl == true) {
                //                    nextObj.FocusType = isForward ? FocusType.Left : FocusType.Right;
                //                }
                //            }
                //        }
                //    }
                //    catch (e)
                //    { }
                //}
                // change by Sean Huang at 2008.12.16, for bug 1054 -->
                //Utility.SetElementFocus(nextID);
                // change by Sean Huang at 2009.01.04, for bug 1402 -->
                //if (exitType == "CharInput")
                // change by Sean Huang at 2009.02.16, for bug 1863, 1865 -->
                //if (exitType == "CharInput" || (!isIE && isUseLeftRightKey))
                if (exitType == "CharInput" || (!input.CoreUtility.IsIE())) {
                    Utility.NextID = nextElement;
                    setTimeout(function () {
                        input.CoreUtility.SetElementFocus(nextElement);
                    }, 0);
                } else {
                    input.CoreUtility.SetElementFocus(nextElement);
                }

                // end of Sean Huang <--
                // add by Sean Huang at 2008.12.09, for bug 1057, 1058 -->
                // set the cursor position of the standard text box while it is get focus
                // by using the left right key.
                if (isUseLeftRightKey) {
                    var obj = document.getElementById(nextElement);
                    if (obj != null && (obj.tagName.toLowerCase() == "textarea" || obj.type == "text")) {
                        if (input.CoreUtility.IsIE()) {
                            var range = obj.createTextRange();
                            if (exitType == "Left" || exitType == "CtrlLeft") {
                                // move the cursor position to the end
                                range.moveStart('character', obj.value.length);
                                range.select();
                            }
                            //else if (exitType == "Right" || exitType == "CtrlRight")
                            //{
                            //    // ie will move the cusor position to the begin by default
                            //}
                        }
                        // HelenLiu 2013/06/24 fix bug 743 in IM HTML5.
                        //else {
                        //    if (exitType == "Left" || exitType == "CtrlLeft") {
                        //        // move the cursor to the end
                        //        var len = obj.value.length;
                        //        obj.setSelectionRange(len, len);
                        //    }
                        //else if (exitType == "Right" || exitType == "CtrlRight") {
                        //     //move the cursor to the begin
                        //    obj.setSelectionRange(0, 0);
                        //}
                        //}
                    }
                }

                // end of Sean Huang, for bug 1057, 1058<--
                //end by Ryan Wu.
                //invoke the KeyExit Event if it exit
                var eArgs = { Key: 9 /* CharInput */ };

                switch (exitType) {
                    case "NextControl":
                        eArgs.Key = 3 /* NextControl */;
                        break;
                    case "PreviousControl":
                        eArgs.Key = 4 /* PreviousControl */;
                        break;
                    case "Right":
                        eArgs.Key = 5 /* Right */;
                        break;
                    case "Left":
                        eArgs.Key = 6 /* Left */;
                        break;
                    case "CtrlRight":
                        eArgs.Key = 7 /* CtrlRight */;
                        break;
                    case "CtrlLeft":
                        eArgs.Key = 8 /* CtrlLeft */;
                        break;
                    case "CharInput":
                        eArgs.Key = 9 /* CharInput */;
                        break;
                }

                ret = {};
                ret.Name = this.Owner.KeyExitEvent;
                ret.Args = eArgs;

                //Add comments by Ryan Wu at 10:27 Apr. 5 2007.
                //For support Aspnet Ajax 1.0.
                ret.Type = "KeyExit";

                //end by Ryan Wu.
                if (ret != null) {
                    retInfo.EventInfo = ret;
                }

                return retInfo;
            };

            /**
            * Move the caret from one field to another in the control.
            * @param pos - The current caret position.
            * @param isForward - The boolean value indicate if we move caret to the next field or previous field.
            */
            BaseUIProcess.prototype.MoveField = function (pos, isForward) {
                var nextPos = this.Format.Fields.MoveField(pos, isForward);
                var retInfo = {};

                if (nextPos == -1) {
                    retInfo.NextPos = nextPos;
                    return retInfo;
                }

                retInfo.SelectionStart = nextPos;
                retInfo.SelectionEnd = nextPos;
                return retInfo;
            };

            /**
            * Process Tab key press event.
            * @param isForward - The boolean value indicate if we move caret to the forward or backward.
            */
            BaseUIProcess.prototype.ProcessTabKey = function (pos, isForward, tabAction) {
                //invoke the KeyExit Event if it exit
                var eArgs = { Key: 1 /* Tab */ };
                var retInfo = {};
                if (isForward) {
                    eArgs.Key = 1 /* Tab */;
                } else {
                    eArgs.Key = 2 /* ShiftTab */;
                }

                var eventInfo = {};
                eventInfo.Name = this.Owner.KeyExitEvent;
                eventInfo.Args = eArgs;

                //Add comments by Ryan Wu at 10:27 Apr. 5 2007.
                //For support Aspnet Ajax 1.0.
                eventInfo.Type = "KeyExit";

                //end by Ryan Wu.
                retInfo.EventInfo = eventInfo;

                retInfo.FocusType = 4 /* KeyExit */;
                retInfo.System = true;

                return retInfo;
            };

            /**
            * Move caret between fields then move focus to the next control if caret is in the edge
            * of the control.
            * @param isForward - The boolean value indicate if we move caret to the forward or backward.
            */
            BaseUIProcess.prototype.MoveFieldAndControl = function (pos, isForward) {
                var retInfo = this.MoveField(pos, isForward);

                //retInfo.NextPos == -1 indicate that we have move the caret to the edge of the control.
                if (retInfo.NextPos != -1) {
                    return retInfo;
                }

                var exitType = isForward ? "NextControl" : "PreviousControl";
                var ret = this.MoveControl(this.GetInputElement(), isForward, false, exitType);

                if (ret != null) {
                    retInfo.EventInfo = ret.EventInfo;
                    retInfo.FocusType = ret.FocusType;
                    retInfo.FocusExit = true;
                }

                return retInfo;
            };

            /**
            * Handle the ondragstart event.
            */
            BaseUIProcess.prototype.DragStart = function () {
            };

            /**
            * Handle the ondragend event.
            */
            BaseUIProcess.prototype.DragEnd = function () {
            };

            /**
            * Handle the ondrop event.
            */
            BaseUIProcess.prototype.Drop = function () {
            };

            /**
            * Handle the ondragover event.
            */
            BaseUIProcess.prototype.DragOver = function () {
            };

            /**
            * Parse the shortcutsString and judge whether the key user pressed
            * is a shortcutkey defined by deveploper.
            * not replace indexOf, substring method, because autotest is slow
            * @param keyCode - The specified keyCode will be checked.
            * @param strShortcut - The shortcuts string passed from the server side.
            * @returns Returns the shortcut's keyAction Name if contains the specified
            *          keyCode action; else return null.
            */
            BaseUIProcess.prototype.GetKeyActionName = function (keyCode, strShortcut) {
                if (strShortcut == null) {
                    return null;
                }

                var s = strShortcut;
                var shortcuts = new Array();
                var index = s.IndexOf(",");
                var i = 0;

                if (strShortcut != "") {
                    while (index != -1) {
                        shortcuts[i++] = s.Substring(0, index);
                        s = s.Substring(index + 1, s.GetLength());
                        index = s.IndexOf(",");
                    }
                    shortcuts[i++] = s;

                    for (var j = 0; j < i; j = j + 2) {
                        if (this.IsKeyCodeContained(keyCode, shortcuts[j + 1])) {
                            return shortcuts[j];
                        }
                    }
                }
                return null;
            };

            /**
            * Judge whether the keyCode is contained in the shortcuts's item.
            * @param keyCode - The specified keyCode will be checked.
            * @param shortcut - The shortcuts's item.
            * @returns Returns true if contains the specified keyCode action; else return false.
            */
            BaseUIProcess.prototype.IsKeyCodeContained = function (keyCode, shortcut) {
                var s = shortcut;
                var index = s.IndexOf("|");

                while (index != -1) {
                    if (s.Substring(0, index) == keyCode) {
                        return true;
                    }
                    s = s.Substring(index + 1, s.GetLength());
                    index = s.IndexOf("|");
                }

                if (s == keyCode) {
                    return true;
                }

                return false;
            };

            /**
            *fire event
            */
            BaseUIProcess.prototype.FireClientEvent = function (evenType) {
                // TODO:
            };

            BaseUIProcess.prototype.PerformSpin = function (curpos, increment, wrap) {
            };

            /**
            * update crlf string for AcceptsCrLf property
            */
            BaseUIProcess.UpdateCrLfString = function (text, crlfMode) {
                var ret = text;

                if (text) {
                    if (crlfMode == 1 /* Filter */) {
                        ret = text.replace(new RegExp("[\r\n]", "g"), "");
                    } else if (crlfMode == 2 /* Cut */) {
                        var splits = text.split(new RegExp("[\r\n]", "g"));
                        if (splits.length > 0) {
                            ret = splits[0];
                        } else {
                            ret = "";
                        }
                    }
                }

                return ret;
            };

            BaseUIProcess.FilterReturnChar = function (text) {
                if (text != null) {
                    text = text.replace(new RegExp("[\r]", "g"), "");
                }
                return text;
            };
            return BaseUIProcess;
        })();
        input.BaseUIProcess = BaseUIProcess;

        

        /** @ignore */
        var InputUIUpdate = (function () {
            function InputUIUpdate(owner) {
                this.Owner = owner;
            }
            InputUIUpdate.prototype.SetLastClientValues = function (text) {
                //var obj = document.getElementById(this.ID + Utility.LastClientValuesID);
                //if (obj != null) {
                //    obj.value = text;
                //}
                //this.lastclientvalues = text;
            };

            InputUIUpdate.prototype.GetText = function () {
                if (this.Owner.GetInputElement() != null) {
                    return this.Owner.GetInputElement().value;
                }
            };

            InputUIUpdate.prototype.SetText = function (text) {
                if (this.GetText() == null) {
                    return;
                }

                if (this.GetText().replace(/\r\n/g, "\n") == text.replace(/\r\n/g, "\n")) {
                    return;
                }

                if (this.Owner.GetInputElement() != null) {
                    this.Owner.GetInputElement().value = text;
                }
            };

            InputUIUpdate.prototype.SetFocus = function () {
                try  {
                    if (this.Owner.GetInputElement() != null) {
                        this.Owner.GetInputElement().focus();
                    }
                } catch (e) {
                }
            };

            InputUIUpdate.prototype.GetTextHAlign = function () {
                if (this.Owner.GetInputElement() !== null) {
                    return this.Owner.GetInputElement().style.textAlign;
                }
                return "";
            };

            InputUIUpdate.prototype.SetTextHAlign = function (value) {
                if (this.Owner.GetInputElement() !== null) {
                    this.Owner.GetInputElement().style.textAlign = value;

                    if (input.CoreUtility.IsIE()) {
                        // Change the width to trigger the layout, to make this property take affect immediately.
                        var old = this.Owner.GetInputElement().style.width;
                        var length = parseInt(old);
                        if (isNaN(length)) {
                            length = 120;
                        }
                        this.Owner.GetInputElement().style.width = length + 1 + "px";
                        var self = this;
                        setTimeout(function () {
                            self.InputElement.style.width = old;
                        }, 0);
                    }
                }
            };

            InputUIUpdate.prototype.SetForeColor = function (foreColor) {
                if (this.Owner.GetInputElement() != null) {
                    this.Owner.GetInputElement().style.color = foreColor;
                }
            };

            InputUIUpdate.prototype.WriteCssStyle = function (style) {
                try  {
                    var styleContainer = document.getElementById('gcsh_InputManWeb_Style_Container');

                    if (input.CoreUtility.IsIE()) {
                        styleContainer.styleSheet.cssText = style;
                    } else {
                        var sheet = styleContainer.sheet;

                        for (var i = sheet.cssRules.length - 1; i >= 0; i--) {
                            sheet.deleteRule(i);
                        }

                        var ruleLines = style.split('}');

                        for (var j = 0; j < ruleLines.length; j++) {
                            var rule = ruleLines[j];
                            var index = rule.indexOf('{');

                            if (index == -1) {
                                continue;
                            }

                            var style = rule.substring(index + 1);

                            if (style.length != 0) {
                                var selector = rule.substring(0, index);
                                sheet.insertRule(selector + '{' + style + '}', sheet.cssRules.length);
                            }
                        }
                    }
                } catch (e) {
                }
            };

            InputUIUpdate.prototype.ClearCssStyle = function () {
            };
            return InputUIUpdate;
        })();
        input.InputUIUpdate = InputUIUpdate;

        /** @ignore */
        var GlobalEventHandler = (function () {
            function GlobalEventHandler() {
            }
            GlobalEventHandler.OnKeyDown = function (control, evt, forShortcutExtender) {
                if (control.ImeMode === true && !input.CoreUtility.IsIE8OrBelow()) {
                    return;
                }

                // debugger;
                var k = evt.keyCode;

                //Add comments by Jiang Changcheng at Sep. 9 2008
                //Add the fake key for Shortcut Extender
                if (forShortcutExtender) {
                    k |= 524288;
                }

                //End by Jiang Changcheng
                var funcKeysPressed = {};
                funcKeysPressed.Shift = false;
                funcKeysPressed.Ctrl = false;
                funcKeysPressed.Alt = false;
                if (evt.shiftKey) {
                    funcKeysPressed.Shift = true;
                }

                if (evt.ctrlKey) {
                    funcKeysPressed.Ctrl = true;
                }

                if (evt.altKey) {
                    funcKeysPressed.Alt = true;
                }
                var useSystem = null;

                //Add comments by Ryan Wu at 16:55 Sep. 11 2007.
                //For fix the bug "17. Ctrl+Click(select all text) will take no effects(firefox).".
                Utility.FuncKeysPressed = funcKeysPressed;

                try  {
                    useSystem = control.KeyDown(evt);
                } catch (e) {
                }

                //Added by Jeff for Edit
                if (useSystem != null && useSystem.KeyCode != null) {
                    // Add comments by Yang at 11:44 Sep. 5th 2007
                    // For event.keyCode is readonly in firefox.
                    // Firefox doesn't support some shortcuts.
                    //event.keyCode = useSystem.KeyCode;
                    if (input.CoreUtility.IsIE()) {
                        evt.keyCode = useSystem.KeyCode;
                    }

                    // End by Yang
                    //Add comments by Ryan Wu at 15:35 Aug. 13 2007.
                    //For in firefox, even if we set the event.returnValue = false in keydown event,
                    //the keypress event will also be invoked while in IE will not.
                    if (!input.CoreUtility.IsIE()) {
                        Utility.ShouldInvokeKeyPress = false;
                    }

                    //end by Ryan Wu.
                    return;
                }

                //Add comments by Ryan Wu at 15:35 Aug. 13 2007.
                //For in firefox, even if we set the event.returnValue = false in keydown event,
                //the keypress event will also be invoked while in IE will not.
                //	if (!useSystem)
                //	{
                //		event.returnValue = false;
                //	    //event.cancelBubble = true;
                //	}
                if (!useSystem) {
                    Utility.PreventDefault(evt);

                    //event.cancelBubble = true;
                    if (!input.CoreUtility.IsIE()) {
                        Utility.ShouldInvokeKeyPress = false;
                    }
                } else {
                    if (!input.CoreUtility.IsIE()) {
                        Utility.ShouldInvokeKeyPress = true;
                    } else if (evt != null) {
                        evt.returnValue = true;
                    }
                }
            };

            GlobalEventHandler.OnKeyPress = function (control, evt) {
                // Ctrl + X, Ctrl + V, Ctrl + C.
                if ((evt.charCode === 118 || evt.charCode === 120 || evt.charCode === 99) && evt.ctrlKey) {
                    // Fire fox 's paste behavior will run at here.
                    return;
                }

                if (input.CoreUtility.IPad && evt.charCode > 256) {
                    // DaryLuo 2013/05/22 fix bug 414, on the ipad, when the charCode is greater than 256, the compoistion event will fired, so here we don't process.
                    return;
                }

                if (evt.keyCode == 46 && evt.shiftKey) {
                    // FireFox Shift + Delete will run at here.  Cut operation.
                    return;
                }

                if (control.ImeMode === true) {
                    return;
                }
                var obj = control;

                if (!input.CoreUtility.IsIE() && (evt.charCode == 0 || !Utility.ShouldInvokeKeyPress)) {
                    if (!Utility.ShouldInvokeKeyPress || ((evt.keyCode == 38 || evt.keyCode == 40) && obj.Type != "Edit")) {
                        Utility.ShouldInvokeKeyPress = true;
                        Utility.PreventDefault(evt);

                        // Add comments by Yang at 20:15 October 15th 2007
                        // For fix the bug 9047
                        if (obj != null && obj.Type == "Edit" && obj.DropDownObj != null && obj.DropDownObj.IsKeyFromDropDown) {
                            obj.DropDownObj.IsKeyFromDropDown = false;
                        }

                        // End by Yang
                        return;
                    } else if (!(evt.keyCode == 13 && obj.Type == "Edit")) {
                        return;
                    }
                }

                var keyCode = evt.keyCode || evt.charCode;

                if (keyCode != 13 || obj.Type == "Edit") {
                    var str = String.fromCharCode(keyCode);

                    try  {
                        if (input.CharProcess.CharEx.IsSurrogate(str.charAt(0))) {
                            // DaryLuo 2012/09/17 fix bug 630 in IM Web 7.0, do it in keyup.
                            obj.IsSurrogateKeyPressing = true;
                            return;
                        }
                    } catch (e) {
                    }
                    if (str != null) {
                        var useSystem = null;

                        try  {
                            useSystem = GlobalEventHandler.CallKeyPress(control, str, evt);
                        } catch (e) {
                        }
                    }
                    if (!useSystem) {
                        Utility.PreventDefault(evt);

                        //event.cancelBubble = true;
                        return;
                    }
                }
            };

            GlobalEventHandler.CallKeyPress = function (control, str, evt) {
                if (input.CoreUtility.IsPad()) {
                    control.HasInput = true;
                    return true;
                } else {
                    var useSystem = control.KeyPress(str, evt);
                    return useSystem;
                }
            };

            GlobalEventHandler.OnKeyUp = function (control, evt) {
                if (control.ImeMode === true && !input.CoreUtility.IsIE8OrBelow()) {
                    return;
                }
                try  {
                    var imControl = control;
                    if (imControl.IsSurrogateKeyPressing) {
                        try  {
                            if (imControl.InputElement != null) {
                                var value = imControl.InputElement.value;
                                var selectionStart = imControl.InputElement.selectionStart;
                                var str = value.substr(selectionStart - 2, selectionStart);
                                imControl.KeyPress(str, evt);
                            }
                        } finally {
                            imControl.IsSurrogateKeyPressing = false;
                        }
                    }

                    //Add comments by Ryan Wu at 16:55 Sep. 11 2007.
                    //For fix the bug "17. Ctrl+Click(select all text) will take no effects(firefox).".
                    Utility.FuncKeysPressed = { Shift: evt.shiftKey, Ctrl: evt.ctrlKey, Alt: evt.altKey };

                    //end by Ryan Wu.
                    imControl.KeyUp(evt);
                    //event.cancelBubble = true;
                } catch (e) {
                }
            };

            GlobalEventHandler.OnCompositionStart = function (control, evt) {
                try  {
                    if (input.CoreUtility.IsPad()) {
                        control.ImeMode = true;
                        return;
                    }
                    control.CompositionStart(evt);
                } catch (e) {
                }
            };

            GlobalEventHandler.OnCompositionUpdate = function (control, evt) {
                try  {
                    if (input.CoreUtility.IsPad()) {
                        return;
                    }
                    control.CompositionUpdate(evt);
                } catch (e) {
                }
            };

            GlobalEventHandler.OnCompositionEnd = function (control, evt) {
                try  {
                    if (input.CoreUtility.IsPad()) {
                        control.HasInput = true;
                        control.ImeMode = false;
                        return;
                    }
                    control.CompositionEnd(evt);
                } catch (e) {
                }
            };

            GlobalEventHandler.OnInput = function (control, evt) {
                try  {
                    if (control.ImeMode === true || control.HasInput !== true) {
                        return;
                    }
                    control.ImeMode = true;
                    control.HasInput = false;
                    control.Input(evt);
                } catch (e) {
                }
            };

            GlobalEventHandler.OnMouseOver = function (control, evt) {
                try  {
                    if (control.MouseOver) {
                        control.MouseOver();
                    }
                } catch (e) {
                }
            };

            GlobalEventHandler.OnMouseOut = function (control, evt) {
                try  {
                    control.MouseOut();
                } catch (e) {
                }
            };

            GlobalEventHandler.OnMouseMove = function (control, evt) {
                try  {
                    if (control.MouseMove) {
                        control.MouseMove(evt);
                    }
                } catch (e) {
                }
            };

            GlobalEventHandler.OnMouseDown = function (control, evt) {
                if (control.ImeMode && control.ImeMode === true && !input.CoreUtility.IsIE8OrBelow()) {
                    return;
                }
                try  {
                    control.MouseDown(evt);

                    if (!input.CoreUtility.IsIE()) {
                        Utility.DragStartElementID = control;
                    }
                } catch (e) {
                }
            };

            GlobalEventHandler.OnMouseUp = function (imControl, evt) {
                if (imControl.ImeMode && imControl.ImeMode === true && !input.CoreUtility.IsIE8OrBelow()) {
                    return;
                }
                try  {
                    // DaryLuo 2013/07/12 fix bug 933, 934 in IM HTML 5.
                    if (imControl.MouseUpPointerType != null && imControl.MouseUpPointerType !== 4 && imControl.MouseUpPointerType !== "mouse") {
                        var evtClone = {};
                        for (var item in evt) {
                            evtClone[item] = evt[item];
                        }
                        setTimeout(function (parameters) {
                            imControl.MouseUp(evtClone);
                        }, 300);
                    } else {
                        imControl.MouseUp(evt);
                    }

                    if (!input.CoreUtility.IsIE()) {
                        Utility.DragStartElementID = "";
                    }
                } catch (e) {
                }
            };

            GlobalEventHandler.OnSelectStart = function (control, evt) {
                if (Utility.InnerSelect === true && Utility.ShouldFireOnSelectStart == false) {
                    Utility.CancelBubble(evt);
                }

                var selText = Utility.GetSelectionText(control.GetInputElement());

                if (typeof (selText) == "undefined" || selText == null) {
                    selText = "";
                }
                var useSystem = null;

                try  {
                    useSystem = control.SelectStart(selText);
                } catch (e) {
                }

                if (useSystem == false) {
                    Utility.PreventDefault(evt);
                }
            };

            GlobalEventHandler.OnDblClick = function (control, evt) {
                var useSystem = null;
                try  {
                    useSystem = control.DoubleClick();
                } catch (e) {
                }

                if (!useSystem) {
                    Utility.PreventDefault(evt);
                }
            };

            GlobalEventHandler.OnHTML5BeforeCopy = function (control, evt) {
                try  {
                    Utility.CutCopyPasteEventObject = evt ? evt.originalEvent : evt;
                    control.Copy(evt);
                } catch (e) {
                } finally {
                    Utility.CutCopyPasteEventObject = null;
                }
            };

            GlobalEventHandler.OnHTML5Cut = function (control, evt) {
                try  {
                    var inputElement = control.GetInputElement();
                    var text = inputElement.value;
                    var selStart = inputElement.selectionStart;
                    var selEnd = inputElement.selectionEnd;
                    setTimeout(function () {
                        inputElement.value = text;
                        inputElement.selectionStart = selStart;
                        inputElement.selectionEnd = selEnd;
                        control.Cut(evt);
                    }, 0);
                    // Let browser do it.
                } catch (e) {
                }
            };

            GlobalEventHandler.OnHTML5Paste = function (control, evt) {
                try  {
                    // DaryLuo 2013/05/21, the paste operation doesn't take effect on the android chrome.
                    if (input.CoreUtility.chrome && input.CoreUtility.GetClientOS().toLowerCase() !== "android") {
                        Utility.CutCopyPasteEventObject = evt ? evt.originalEvent : evt;

                        control.Paste(Utility.GetDataFromClipboard(true));
                        Utility.PreventDefault(evt);
                    } else {
                        var selStart = control.SelectionStart;
                        var selEnd = control.SelectionEnd;
                        setTimeout(function () {
                            if (input.CoreUtility.GetClientOS().toLowerCase() === "android") {
                                // DaryLuo 2013/05/27 fix bug 371 in IM HTML5.0.
                                control.SelectionStart = selStart;
                                control.SelectionEnd = selEnd;
                            }

                            control.isPasting = true;

                            // Firefox & android chrome will run at here.
                            control.ImeInput("DirectInput");
                        }, 0);
                    }
                } catch (e) {
                } finally {
                    Utility.CutCopyPasteEventObject = null;
                }
            };

            GlobalEventHandler.OnMouseWheel = function (control, evt) {
                try  {
                    control.MouseWheel(evt);
                    if (control.ShouldCancelMouseWheelDefaultBehavior()) {
                        Utility.PreventDefault(evt);
                    }
                } catch (e) {
                }
            };

            GlobalEventHandler.OnDragStart = function (control, evt) {
                try  {
                    control.DragStart();
                } catch (e) {
                }
            };

            GlobalEventHandler.OnDragEnd = function (control, evt) {
                try  {
                    control.DragEnd(evt);
                } catch (e) {
                }
            };

            GlobalEventHandler.OnDrop = function (control, evt) {
                try  {
                    var text = evt.originalEvent.dataTransfer.getData("Text");
                    control.DragDrop(text, evt);
                } catch (e) {
                }
            };

            GlobalEventHandler.OnTouchStart = function (control, evt) {
                Utility.TouchStartTime = new Date();
                Utility.TouchStartEvt = evt;
            };

            GlobalEventHandler.OnTouchEnd = function (control, evt) {
                if (Utility.TouchStartTime !== undefined) {
                    Utility.TouchEndTime = new Date();
                    var offset = Utility.TouchEndTime.valueOf() - Utility.TouchStartTime.valueOf();
                    if (offset > 1000) {
                        var text = "";
                        try  {
                            text = Utility.GetSelectionText(control.GetInputElement());
                        } catch (e) {
                        }
                        control.ShowContextMenu(text, Utility.TouchStartEvt);
                        if (control.GetEnabled()) {
                            Utility.PreventDefault(evt);
                        }
                    }
                    Utility.TouchStartTime = undefined;
                    Utility.TouchEndTime = undefined;
                }
            };

            GlobalEventHandler.OnDragEnter = function (control, evt) {
                try  {
                    control.DragEnter();
                } catch (e) {
                }
            };

            GlobalEventHandler.OnDragLeave = function (control, evt) {
                try  {
                    control.DragLeave();
                } catch (e) {
                }
            };

            GlobalEventHandler.OnSelect = function (control, evt) {
                try  {
                    if (input.CoreUtility.IsPad() && control.ImeMode) {
                        return;
                    }
                    if (control && control.Focused) {
                        control.Select();
                    }
                } catch (e) {
                }
            };

            GlobalEventHandler.OnPropertyChanged = function (control, evt) {
                try  {
                    control.PropertyChange(evt);
                } catch (e) {
                }
            };

            GlobalEventHandler.OnMSPointerUp = function (control, evt) {
                control.MSPointerUp(evt);
            };

            GlobalEventHandler.OnMSPointerDown = function (control, evt) {
                try  {
                    control.MSPointerDown(evt);
                } catch (e) {
                }
            };

            GlobalEventHandler.OnMSGestureTap = function (control, evt) {
                try  {
                    control.MSGestureTap(evt);
                } catch (e) {
                }
            };

            GlobalEventHandler.OnEditFieldFocus = function (control, evt) {
                if (Utility.IsFocusFromIMControl(control._id, evt)) {
                    if (input.CoreUtility.IsIE() || Utility.HasGetFocus) {
                        return;
                    }
                }

                //if (!Utility.firefox) {
                //    if (Utility.IsOnFocus) {
                //        if (GrapeCity.IM.Utility.IsIE() && Utility.IsOnActivate || Utility.HasGetFocus) {
                //            return;
                //        }
                //    }
                //}
                Utility.IsOnFocus = true;
                if (!input.CoreUtility.IsIE()) {
                    Utility.HasGetFocus = true;
                }
                this.OnFocus(control, evt);
                //onFocus(id);
                //Utility.FireEvent(document.getElementById(id), eventName, null);
                // end of Sean Huang <--
            };

            GlobalEventHandler.OnEditFieldLoseFocus = function (control, evt) {
                try  {
                    //function gcsh_InputManWeb_onLoseFocus(eventName, id) {
                    var obj = control;

                    if (obj != null && obj.Type == "Edit" && obj.IsFocusToDropDownEdit) {
                        obj.IsFocusToDropDownEdit = false;
                        return;
                    }

                    // Temporarily comment at 2013/08/13.
                    //if (!Utility.IsIE() && obj != null && obj.IMControlType == "Date" && obj.DropDownObj != null) {
                    //    if (Utility.IsFireFox4OrLater()) {
                    //        if (obj.DropDownObj.IsNavigateMouseDown) {
                    //            obj.DropDownObj.IsNavigateMouseDown = null;
                    //            return;
                    //        }
                    //        if (obj.DropDownObj.IsZoomButtonMouseDown) {
                    //            obj.DropDownObj.IsZoomButtonMouseDown = null;
                    //            return;
                    //        }
                    //    }
                    //    if (obj.DropDownObj.IsHeaderMouseDown) {
                    //        obj.DropDownObj.IsHeaderMouseDown = null;
                    //        return;
                    //    }
                    //}
                    if (Utility.IsFocusToIMControl(control._id, evt)) {
                        return;
                    }

                    if (input.CoreUtility.firefox) {
                        if (Utility.IsOnFocus && input.CoreUtility.IsIE() && Utility.IsOnActivate && Utility.IsOnActivateControlID == control._id) {
                            if (Utility.FocusToBorder != null && Utility.FocusToBorder == true) {
                                Utility.FocusToBorder = false;
                                obj.SetInnerFocus();
                            }

                            return;
                        }

                        Utility.FocusToBorder = false;

                        if (!input.CoreUtility.IsIE()) {
                            Utility.HasGetFocus = false;
                        } else {
                            Utility.IsOnFocus = false;
                        }
                    }

                    GlobalEventHandler.OnLostFocus(control, evt);

                    Utility.FuncKeysPressed = { Shift: false, Ctrl: false, Alt: false };
                    //Utility.FireEvent(control, "LoseFocus", null);
                } catch (e) {
                }
            };

            GlobalEventHandler.OnFocusOut = function (control, evt) {
                Utility.FocusToBorder = false;

                if (input.CoreUtility.IsIE()) {
                    if (evt.toElement) {
                        var toID = evt.toElement.id;
                        if (toID == control._id + "_Inside_Div_Container") {
                            Utility.FocusToBorder = true;
                        }
                    }
                }

                if (Utility.IsFocusToIMControl(control._id, evt)) {
                    if (input.CoreUtility.IsIE9OrLater()) {
                        Utility.IsOnActivate = true;
                        Utility.IsOnActivateControlID = control._id;
                        Utility.IsOnFocus = true;
                    }
                    return;
                }
                if (input.CoreUtility.IsIE() && Utility.IsOnActivate) {
                    Utility.IsOnActivate = false;
                    Utility.IsOnActivateControlID = "";
                }
                if (Utility.IsOnFocus) {
                    Utility.IsOnFocus = false;
                }
            };

            GlobalEventHandler.OnActivate = function (control, evt) {
                Utility.IsOnActivate = true;
                Utility.IsOnActivateControlID = control._id;

                if (Utility.IsFocusFromIMControl(control._id, evt)) {
                    return;
                }

                Utility.IsOnActivate = true;
                Utility.IsOnActivateControlID = control._id;
            };

            GlobalEventHandler.OnDeActivate = function (control, evt) {
                if (Utility.IsFocusToIMControl(control._id, evt)) {
                    return;
                }

                Utility.IsOnActivate = false;
                Utility.IsOnActivateControlID = "";

                Utility.IsOnFocus = false;
            };

            GlobalEventHandler.OnFocus = function (control, evt) {
                try  {
                    var handler = function () {
                        control.Focus();
                        control.Focused = true;

                        if (input.CoreUtility.IsPad()) {
                            // DaryLuo 2013/05/27 fix bug 412 in IM HTML 5.0.
                            control.IPadSelectionRefreshTimer = setInterval(function (evt) {
                                GlobalEventHandler.OnSelect(control, evt);
                            }, 400);
                        }
                    };
                    if (input.CoreUtility.IsIE()) {
                        handler.call(this);
                    } else {
                        setTimeout(handler, 0);
                    }
                } catch (e) {
                }
            };

            GlobalEventHandler.OnLostFocus = function (control, evt) {
                try  {
                    control.LoseFocus(evt);
                    control.Focused = false;

                    if (input.CoreUtility.IsPad()) {
                        clearInterval(control.IPadSelectionRefreshTimer);
                    }
                } catch (e) {
                }
            };
            return GlobalEventHandler;
        })();
        input.GlobalEventHandler = GlobalEventHandler;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));

