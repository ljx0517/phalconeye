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
/// <reference path="jquery.wijmo.wijinputcore.ts"/>
/// <reference path="jquery.wijmo.wijinputdateformat.ts"/>
var wijmo;
(function (wijmo) {
    (function (input) {
        "use strict";

        /** @ignore */
        var wijinputdateroller = (function () {
            function wijinputdateroller(owner) {
                this._owner = owner;
            }
            //#endregion
            //#region DatePicker
            wijinputdateroller.prototype._initDatePicker = function () {
                var datePicker = this._owner.element.data('datePicker');
                if (datePicker != undefined) {
                    return;
                }

                var self = this;
                var minYear = this._owner.element.data('pickerMinYear');
                var maxYear = this._owner.element.data('pickerMaxYear');
                var height = this._owner.element.data('itemHeight') * 5;
                var pickerWidth = this._owner.element.data('pickerWidth');
                var itemHeight = this._owner.element.data('itemHeight') + "px";
                var indicatorHeight = this._owner.element.data('indicatorHeight') + "px";
                var indicatorTranslateTop = this._owner.element.data('indicatorTranslateTop');
                var indicatorTranslateDown = this._owner.element.data('indicatorTranslateDown');
                var indicatorTranslateSelector = this._owner.element.data('indicatorTranslateSelector');
                var indicatorTranslateContent = this._owner.element.data('indicatorTranslateContent');

                var div = this._createDivElement(document.body, pickerWidth + "px");
                var divIndicator = this._createDivIndicatiorElement(div, itemHeight, "", indicatorTranslateSelector);
                var table = this._createTableElement(div, height + "px", "-", indicatorTranslateContent);
                var trDate = $("<tr/>").appendTo(table);

                var tdYearWidth = "33%";
                var tdMonthWidth = "33%";
                var tdDayWidth = "33%";

                if (this._owner.element.data('pickerDateMonthFormat') == "MMMM") {
                    tdYearWidth = "30%";
                    tdMonthWidth = "45%";
                    tdDayWidth = "25%";
                }

                // Year
                var tdYear = $("<td/>").css({ "width": tdYearWidth });
                var divYear = this._createPickerDivElement(tdYear, height);
                var divYearMask = this._createMaskElement(divYear, height);
                var pickerYearArray = new Array();
                for (var i = minYear; i <= maxYear; i++) {
                    var text = this._getRollText(i, this._owner.element.data('pickerDateYearFormat'));
                    var itemDiv = this._createItemElement(i, divYearMask, itemHeight, text);
                    pickerYearArray[i - minYear] = itemDiv;
                }

                // Month
                var tdMonth = $("<td/>").css({ "width": tdMonthWidth });
                var divMonth = this._createPickerDivElement(tdMonth, height);
                var divMonthMask = this._createMaskElement(divMonth, height);
                var pickerMonthArray = {};
                var i;
                for (i = 1; i <= 12; i++) {
                    var text = this._getRollText(i, this._owner.element.data('pickerDateMonthFormat'));
                    var itemDiv = this._createItemElement(i - 1, divMonthMask, itemHeight, text);
                    pickerMonthArray[i - 1] = itemDiv;
                }

                //Day
                var tdDay = $("<td/>").css({ "width": tdDayWidth });
                var divDay = this._createPickerDivElement(tdDay, height);
                var divDayMask = this._createMaskElement(divDay, height);
                var pickerDayArray = {};
                for (i = 1; i <= 31; i++) {
                    var text = this._getRollText(i, this._owner.element.data('pickerDateDayFormat'));
                    var itemDiv = this._createItemElement(i, divDayMask, itemHeight, text);
                    pickerDayArray[i - 1] = itemDiv;
                }

                var pickerDateFormat = this._owner.element.data('pickerDateFormat');
                var yearAdded = false, monthAdded = false, dayAdded = false;
                for (i = 0; i < pickerDateFormat.length; i++) {
                    if ((pickerDateFormat[i] == "yyyy") && !yearAdded) {
                        tdYear.appendTo(trDate);
                        yearAdded = true;
                    }

                    if ((pickerDateFormat[i] == "M" || pickerDateFormat[i] == "MM" || pickerDateFormat[i] == "MMM" || pickerDateFormat[i] == "MMMM") && !monthAdded) {
                        tdMonth.appendTo(trDate);
                        monthAdded = true;
                    }

                    if ((pickerDateFormat[i] == "d" || pickerDateFormat[i] == "dd") && !dayAdded) {
                        tdDay.appendTo(trDate);
                        dayAdded = true;
                    }
                }

                this._owner.element.data('datePicker', div);

                this._owner.element.data('divYear', divYear);
                this._owner.element.data('divMonth', divMonth);
                this._owner.element.data('divDay', divDay);

                this._owner.element.data('divYearMask', divYearMask);
                this._owner.element.data('divMonthMask', divMonthMask);
                this._owner.element.data('divDayMask', divDayMask);

                this._owner.element.data('pickerYearArray', pickerYearArray);
                this._owner.element.data('pickerMonthArray', pickerMonthArray);
                this._owner.element.data('pickerDayArray', pickerDayArray);

                if (!input.CoreUtility.IsIE8OrBelow()) {
                    var divYearIndicatorTop = this._createIndicatiorElement(divYear, indicatorHeight, "-", indicatorTranslateTop);
                    var divYearIndicatorDown = this._createIndicatiorElement(divYear, indicatorHeight, "-", indicatorTranslateDown);
                    var divMonthIndicatorTop = this._createIndicatiorElement(divMonth, indicatorHeight, "-", indicatorTranslateTop);
                    var divMonthIndicatorDown = this._createIndicatiorElement(divMonth, indicatorHeight, "-", indicatorTranslateDown);
                    var divDayIndicatorTop = this._createIndicatiorElement(divDay, indicatorHeight, "-", indicatorTranslateTop);
                    var divDayIndicatorDown = this._createIndicatiorElement(divDay, indicatorHeight, "-", indicatorTranslateDown);
                    this._owner.element.data('divYearIndicatorTop', divYearIndicatorTop);
                    this._owner.element.data('divMonthIndicatorTop', divMonthIndicatorTop);
                    this._owner.element.data('divDayIndicatorTop', divDayIndicatorTop);
                    this._owner.element.data('divYearIndicatorDown', divYearIndicatorDown);
                    this._owner.element.data('divMonthIndicatorDown', divMonthIndicatorDown);
                    this._owner.element.data('divDayIndicatorDown', divDayIndicatorDown);
                }

                this._initDatePickerEvent();
                this._initTouchPickerEvent("Year");
                this._initTouchPickerEvent("Month");
                this._initTouchPickerEvent("Day");
            };

            wijinputdateroller.prototype._initDatePickerEvent = function () {
                var self = this;
                var divYear = this._owner.element.data('divYear');
                var divMonth = this._owner.element.data('divMonth');
                var divDay = this._owner.element.data('divDay');

                divYear.mousewheel(function (e, arg) {
                    self._yearMouseWheel(e, arg);
                });

                divMonth.mousewheel(function (e, arg) {
                    self._monthMouseWheel(e, arg);
                });

                divDay.mousewheel(function (e, arg) {
                    self._dayMouseWheel(e, arg);
                });
            };

            //#endregion
            //#region TimePicker
            wijinputdateroller.prototype._initTimePicker = function () {
                var timePicker = this._owner.element.data('timePicker');
                if (timePicker != undefined) {
                    return;
                }

                var self = this;
                var height = this._owner.element.data('itemHeight') * 5;
                var pickerWidth = this._owner.element.data('pickerWidth');
                var itemHeight = this._owner.element.data('itemHeight') + "px";
                var indicatorHeight = this._owner.element.data('indicatorHeight') + "px";
                var indicatorTranslateTop = this._owner.element.data('indicatorTranslateTop');
                var indicatorTranslateDown = this._owner.element.data('indicatorTranslateDown');
                var indicatorTranslateSelector = this._owner.element.data('indicatorTranslateSelector');
                var indicatorTranslateContent = this._owner.element.data('indicatorTranslateContent');

                var div = this._createDivElement(document.body, pickerWidth + "px");
                var divIndicator = this._createDivIndicatiorElement(div, itemHeight, "", indicatorTranslateSelector);
                var table = this._createTableElement(div, height + "px", "-", indicatorTranslateContent);
                var trTime = $("<tr/>").appendTo(table);

                // Hour
                var tdHour = $("<td/>").css({ "width": "33%" });
                var divHour = this._createPickerDivElement(tdHour, height);
                var divHourMask = this._createMaskElement(divHour, height);
                var pickerHourArray = {};
                for (var i = 1; i <= 12; i++) {
                    var text = this._getRollText(i, this._owner.element.data('pickerTimeHourFormat'));
                    var itemDiv = this._createItemElement(i, divHourMask, itemHeight, text);
                    pickerHourArray[i - 1] = itemDiv;
                }

                //Minute
                var tdMinute = $("<td/>").css({ "width": "33%" });
                var divMinute = this._createPickerDivElement(tdMinute, height);
                var divMinuteMask = this._createMaskElement(divMinute, height);
                var pickerMinuteArray = {};
                for (var i = 0; i < 60; i++) {
                    var text = this._getRollText(i, this._owner.element.data('pickerTimeMinuteFormat'));
                    var itemDiv = this._createItemElement(i, divMinuteMask, itemHeight, text);
                    pickerMinuteArray[i] = itemDiv;
                }

                //AM
                var tdAM = $("<td/>").css({ "width": "34%" });
                var divAM = this._createPickerDivElement(tdAM, height);
                var divAMMask = this._createMaskElement(divAM, height);
                var pickerAMArray = {};
                for (var i = 0; i < 2; i++) {
                    var text = this._getRollText(i, this._owner.element.data('pickerTimeAMFormat'));
                    var itemDiv = this._createItemElement(i, divAMMask, itemHeight, text);
                    pickerAMArray[i] = itemDiv;
                }

                var pickerTimeFormat = this._owner.element.data('pickerTimeFormat');
                var hourAdded = false, minuteAdded = false, amAdded = false;
                for (var i = 0; i < pickerTimeFormat.length; i++) {
                    if ((pickerTimeFormat[i] == "h" || pickerTimeFormat[i] == "hh") && !hourAdded) {
                        tdHour.appendTo(trTime);
                        hourAdded = true;
                    }

                    if ((pickerTimeFormat[i] == "m" || pickerTimeFormat[i] == "mm") && !minuteAdded) {
                        tdMinute.appendTo(trTime);
                        minuteAdded = true;
                    }

                    if ((pickerTimeFormat[i] == "t" || pickerTimeFormat[i] == "tt") && !amAdded) {
                        tdAM.appendTo(trTime);
                        amAdded = true;
                    }
                }

                this._owner.element.data('timePicker', div);

                this._owner.element.data('divHour', divHour);
                this._owner.element.data('divMinute', divMinute);
                this._owner.element.data('divAM', divAM);

                this._owner.element.data('divHourMask', divHourMask);
                this._owner.element.data('divMinuteMask', divMinuteMask);
                this._owner.element.data('divAMMask', divAMMask);

                this._owner.element.data('pickerHourArray', pickerHourArray);
                this._owner.element.data('pickerMinuteArray', pickerMinuteArray);
                this._owner.element.data('pickerAMArray', pickerAMArray);

                if (!input.CoreUtility.IsIE8OrBelow()) {
                    var divHourIndicatorTop = this._createIndicatiorElement(divHour, indicatorHeight, "-", indicatorTranslateTop);
                    var divHourIndicatorDown = this._createIndicatiorElement(divHour, indicatorHeight, "-", indicatorTranslateDown);
                    var divMinuteIndicatorTop = this._createIndicatiorElement(divMinute, indicatorHeight, "-", indicatorTranslateTop);
                    var divMinuteIndicatorDown = this._createIndicatiorElement(divMinute, indicatorHeight, "-", indicatorTranslateDown);
                    var divAMIndicatorTop = this._createIndicatiorElement(divAM, indicatorHeight, "-", indicatorTranslateTop);
                    var divAMIndicatorDown = this._createIndicatiorElement(divAM, indicatorHeight, "-", indicatorTranslateDown);
                    this._owner.element.data('divHourIndicatorTop', divHourIndicatorTop);
                    this._owner.element.data('divMinuteIndicatorTop', divMinuteIndicatorTop);
                    this._owner.element.data('divAMIndicatorTop', divAMIndicatorTop);
                    this._owner.element.data('divHourIndicatorDown', divHourIndicatorDown);
                    this._owner.element.data('divMinuteIndicatorDown', divMinuteIndicatorDown);
                    this._owner.element.data('divAMIndicatorDown', divAMIndicatorDown);
                }

                this._initTimePickerEvent();
                this._initTouchPickerEvent("Hour");
                this._initTouchPickerEvent("Minute");
                this._initTouchPickerEvent("AM");
            };

            wijinputdateroller.prototype._initTimePickerEvent = function () {
                var self = this;
                var divHour = this._owner.element.data('divHour');
                var divMinute = this._owner.element.data('divMinute');
                var divAM = this._owner.element.data('divAM');

                divHour.mousewheel(function (e, arg) {
                    self._hourMouseWheel(e, arg);
                });

                divMinute.mousewheel(function (e, arg) {
                    self._minuteMouseWheel(e, arg);
                });

                divAM.mousewheel(function (e, arg) {
                    self._amMouseWheel(e, arg);
                });
            };

            //#endregion
            //#region Method
            wijinputdateroller.prototype._isValidatePickerFormat = function (format) {
                switch (format) {
                    case "yyyy":
                    case "M":
                    case "MM":
                    case "MMM":
                    case "MMMM":
                    case "d":
                    case "dd":
                    case "h":
                    case "hh":
                    case "m":
                    case "mm":
                    case "t":
                    case "tt":
                        return true;
                }

                return false;
            };

            wijinputdateroller.prototype._getDatePickerMinYear = function () {
                var realMinDate = this._owner._isEraFormatExist() ? this._owner._getRealEraMinDate() : this._owner._getRealMinDate();
                var minYear = realMinDate.getFullYear();
                var pickerValue = this._owner._getPickerValue();
                var year = this._owner._max(pickerValue.getFullYear() - 50, minYear);
                return year;
            };

            wijinputdateroller.prototype._getDatePickerMaxYear = function () {
                var realMaxDate = this._owner._isEraFormatExist() ? this._owner._getRealEraMaxDate() : this._owner._getRealMaxDate();
                var maxYear = realMaxDate.getFullYear();
                var pickerValue = this._owner._getPickerValue();
                var year = this._owner._min(pickerValue.getFullYear() + 50, maxYear);
                return year;
            };

            wijinputdateroller.prototype._getCorrentPickerFormat = function (formats) {
                for (var i = 0; i < formats.length - 1; i++) {
                    for (var j = i + 1; j < formats.length; j++) {
                        if (formats[j].index < formats[i].index) {
                            var tmp = formats[i];
                            formats[i] = formats[j];
                            formats[j] = tmp;
                        }
                    }
                }

                var result = "";
                for (var i = 0; i < formats.length; i++) {
                    result += formats[i].value;
                    if (i < formats.length - 1) {
                        result += ",";
                    }
                }

                return result;
            };

            wijinputdateroller.prototype._getDefaultDatePickerFormat = function () {
                var culture = this._owner._getCulture();

                if (culture == null) {
                    return "yyyy,M,d";
                }

                var cf = culture.calendars.standard;
                var pattern = cf.patterns.d;
                var y = { "index": pattern.indexOf('y'), "value": "yyyy" };
                var M = { "index": pattern.indexOf('M'), "value": "MM" };
                var d = { "index": pattern.indexOf('d'), "value": "dd" };

                if (y.index == -1 || M.index == -1 || d.index == -1) {
                    return "yyyy,M,d";
                }

                var formats = new Array();
                formats[0] = y;
                formats[1] = M;
                formats[2] = d;

                return this._getCorrentPickerFormat(formats);
            };

            wijinputdateroller.prototype._getDefaultTimePickerFormat = function () {
                if (this._owner.options.culture.length >= 2) {
                    var subString = this._owner.options.culture.substr(0, 2);
                    if (subString == 'ja' || subString == 'zh') {
                        return "tt,hh,mm";
                    }
                }

                return "hh,mm,tt";
            };

            wijinputdateroller.prototype._updateTimePicker = function () {
                var hour = this._owner.element.data("pickerHour") - 1;
                var minute = this._owner.element.data("pickerMinute");
                var am = this._owner.element.data("pickerAM");

                var divHourMask = this._owner.element.data('divHourMask');
                var divMinuteMask = this._owner.element.data('divMinuteMask');
                var divAMMask = this._owner.element.data('divAMMask');

                this._updateItemTransform("Hour", hour);
                this._updateItemTransform("Minute", minute);
                this._updateItemTransform("AM", am);

                this._scrollTheView("Hour", hour, hour, true);
                this._scrollTheView("Minute", minute, minute, true);
                this._scrollTheView("AM", am, am, true);

                this._owner.element.data('pickerHourScrollDelay', 5);
                this._owner.element.data('pickerMinuteScrollDelay', 5);
                this._owner.element.data('pickerAMScrollDelay', 5);

                this._owner.element.data('pickerHourScrollRate', 1);
                this._owner.element.data('pickerMinuteScrollRate', 1);
                this._owner.element.data('pickerAMScrollRate', 1);
            };

            wijinputdateroller.prototype._updateDatePicker = function () {
                var minYear = this._owner.element.data('pickerMinYear');
                var year = this._owner.element.data("pickerYear");
                var month = this._owner.element.data("pickerMonth");
                var day = this._owner.element.data("pickerDay");

                var maxDayCount = input.DateTimeInfo.DaysInMonth(year, month);

                this._updateItemTransform("Year", year - minYear);
                this._updateItemTransform("Month", month - 1);
                this._updateItemTransform("Day", day - 1);

                this._scrollTheView("Year", year - minYear, year - minYear, true);
                this._scrollTheView("Month", month - 1, month - 1, true);
                this._scrollTheView("Day", day - 1, day - 1, true);

                this._owner.element.data('pickerYearScrollDelay', 5);
                this._owner.element.data('pickerMonthScrollDelay', 5);
                this._owner.element.data('pickerDayScrollDelay', 5);

                this._owner.element.data('pickerYearScrollRate', 1);
                this._owner.element.data('pickerMonthScrollRate', 1);
                this._owner.element.data('pickerDayScrollRate', 1);

                this._updateDayPickerMaxCount();
            };

            wijinputdateroller.prototype._getRollText = function (index, format) {
                var culture = this._owner._getCulture();
                var text = "";
                switch (format) {
                    case "M":
                    case "h":
                        text = (index).toString();
                        break;
                    case "MM":
                    case "hh":
                        text = index < 10 ? "0" + (index).toString() : (index).toString();
                        break;
                    case "m":
                    case "d":
                    case "yyyy":
                        text = index.toString();
                        break;
                    case "mm":
                    case "dd":
                        text = index < 10 ? "0" + index.toString() : index.toString();
                        break;
                    case "t":
                        text = index == 0 ? this._owner._getStandardAMPM("AM") : this._owner._getStandardAMPM("PM");
                        text = text.substr(0, 1);
                        break;
                    case "tt":
                        text = index == 0 ? this._owner._getStandardAMPM("AM") : this._owner._getStandardAMPM("PM");
                        break;
                    case "MMM":
                        text = culture.calendars.standard.months.namesAbbr[index - 1];
                        break;
                    case "MMMM":
                        text = culture.calendars.standard.months.names[index - 1];
                        break;
                    default:
                }

                return text;
            };

            wijinputdateroller.prototype._initTouchPickerEvent = function (pickerType) {
                var div = this._owner.element.data('div' + pickerType);
                var divMask = this._owner.element.data('div' + pickerType + 'Mask');
                this._addPickerTouchEvent(divMask, pickerType);

                if (!input.CoreUtility.IsIE8OrBelow()) {
                    var divIndicatorTop = this._owner.element.data('div' + pickerType + 'IndicatorTop');
                    var divIndicatorDown = this._owner.element.data('div' + pickerType + 'IndicatorDown');
                    this._addPickerTouchEvent(divIndicatorTop, pickerType);
                    this._addPickerTouchEvent(divIndicatorDown, pickerType);
                }
            };

            wijinputdateroller.prototype._addPickerTouchEvent = function (element, pickerType) {
                var self = this;
                element.bind("touchstart", function (evt) {
                    self._touchStart(evt, pickerType);
                    evt.preventDefault();
                }).bind("touchmove", function (evt) {
                    self._touchMove(evt, pickerType);
                    evt.preventDefault();
                }).bind("touchend", function (evt) {
                    self._touchEnd(evt, pickerType);
                    evt.preventDefault();
                });
            };

            wijinputdateroller.prototype._getRollFormat = function (pickerDateFormat, format) {
                for (var i = 0; i < pickerDateFormat.length; i++) {
                    if (pickerDateFormat[i].indexOf(format) != -1) {
                        return pickerDateFormat[i];
                    }
                }

                return "";
            };

            wijinputdateroller.prototype._adjustTouchPosition = function (pickerType, newY) {
                var touchPositionArray = this._getTouchPositionArray(pickerType);
                var index = this._getItemIndexByPosition(pickerType, newY);
                var value = this._itemIndexToValue(pickerType, index);
                this._owner.element.data("picker" + pickerType, value);
                this._scrollTheViewByTouch(pickerType, touchPositionArray[index]);
            };

            wijinputdateroller.prototype._itemIndexToValue = function (pickerType, index) {
                switch (pickerType) {
                    case "Minute":
                    case "AM":
                        return index;
                    case "Hour":
                    case "Month":
                    case "Day":
                        return index + 1;
                    case "Year":
                        var minYear = this._owner.element.data('pickerMinYear');
                        return minYear + index;
                }

                return -1;
            };

            wijinputdateroller.prototype._getItemLength = function (pickerType) {
                switch (pickerType) {
                    case "Hour":
                    case "Month":
                        return 12;
                    case "Year":
                        var minYear = this._owner.element.data('pickerMinYear');
                        var maxYear = this._owner.element.data('pickerMaxYear');
                        return maxYear - minYear + 1;
                    case "Day":
                        return 31;
                    case "Minute":
                        return 60;
                    case "AM":
                        return 2;
                }

                return -1;
            };

            wijinputdateroller.prototype._updateItemTransform = function (pickerType, itemIndex) {
                if (input.CoreUtility.IsIE8OrBelow()) {
                    return;
                }

                if (itemIndex < 0) {
                    return;
                }

                var itemArray = this._owner.element.data("picker" + pickerType + "Array");
                var length = this._getItemLength(pickerType);
                var transform = "skew(0deg) scale(1.2, 1.2) translate(0px, 0px)";
                var transform1 = "skew(-5deg) scale(0.9, 0.9) translate(0px, 0px)";
                var transform2 = "skew(-10deg) scale(0.7, 0.7) translate(0px, 0px)";
                var transform3 = "skew(-15deg) scale(0.5, 0.5) translate(0px, 0px)";

                for (var i = 0; i < length; i++) {
                    if (i == itemIndex - 3) {
                        this._setCssTransform(itemArray[i], "", transform3, true);
                    } else if (i == itemIndex - 2) {
                        this._setCssTransform(itemArray[i], "", transform2, true);
                    } else if (i == itemIndex - 1) {
                        this._setCssTransform(itemArray[i], "", transform1, true);
                    } else if (i == itemIndex) {
                        this._setCssTransform(itemArray[i], "", transform, true);
                    } else if (i == itemIndex + 1) {
                        this._setCssTransform(itemArray[i], "", transform1, true);
                    } else if (i == itemIndex + 2) {
                        this._setCssTransform(itemArray[i], "", transform2, true);
                    } else if (i == itemIndex + 3) {
                        this._setCssTransform(itemArray[i], "", transform3, true);
                    } else {
                        this._setCssTransform(itemArray[i], "", "", true);
                    }
                }
            };

            wijinputdateroller.prototype._updateDayPickerMaxCount = function () {
                var year = this._owner.element.data("pickerYear");
                var month = this._owner.element.data("pickerMonth");
                var day = this._owner.element.data("pickerDay");

                var maxDayCount = input.DateTimeInfo.DaysInMonth(year, month);
                this._owner.element.data('pickerDayMaxCount', maxDayCount);

                var pickerDayArray = this._owner.element.data('pickerDayArray');

                for (var i = 29; i <= 31; i++) {
                    var display = i > maxDayCount ? "none" : "";
                    pickerDayArray[i - 1].css("display", display);
                }

                if (day > maxDayCount) {
                    var divDayMask = this._owner.element.data('divDayMask');
                    day = maxDayCount;
                    this._updateItemTransform("Day", day - 1);
                    this._scrollTheView("Day", day - 1, null, false);
                    this._owner.element.data("pickerDay", day);
                }
            };

            wijinputdateroller.prototype._getTouchPositionArray = function (pickerType) {
                var positionArray = {};
                var itemHeight = this._owner.element.data('itemHeight');
                var length = this._getItemLength(pickerType);

                for (var i = 0; i < length; i++) {
                    positionArray[i] = (2 - i) * itemHeight;
                }

                return positionArray;
            };

            wijinputdateroller.prototype._getItemIndexByPosition = function (pickerType, newY) {
                var touchPositionArray = this._getTouchPositionArray(pickerType);
                var length = this._getItemLength(pickerType);

                if (pickerType == "Day") {
                    if (length > this._owner.element.data('pickerDayMaxCount')) {
                        length = this._owner.element.data('pickerDayMaxCount');
                    }
                }

                var index = -1;
                for (var i = 0; i < length; i++) {
                    if (i == 0) {
                        if (newY > touchPositionArray[i]) {
                            index = 0;
                            break;
                        }
                    } else {
                        if (newY <= touchPositionArray[i - 1] && newY >= touchPositionArray[i]) {
                            var offsetTop = touchPositionArray[i - 1] - newY;
                            var offsetBottom = newY - touchPositionArray[i];
                            index = offsetTop > offsetBottom ? i : i - 1;
                            break;
                        }
                    }

                    if (i == length - 1) {
                        if (newY < touchPositionArray[i]) {
                            index = i;
                            break;
                        }
                    }
                }

                return index;
            };

            wijinputdateroller.prototype._hideItemInIE7 = function (pickerType, pickerScrollCurrent) {
                if (!input.CoreUtility.IsIE7()) {
                    return;
                }

                var lastItemIndex = this._owner.element.data('picker' + pickerType + 'LastItemIndex');
                var itemIndex = this._getItemIndexByPosition(pickerType, pickerScrollCurrent);
                if (itemIndex == lastItemIndex) {
                    return;
                }

                var minItemIndex = itemIndex - 2;
                var maxItemIndex = itemIndex + 2;
                var itemArray = this._owner.element.data("picker" + pickerType + "Array");
                var length = this._getItemLength(pickerType);

                for (var i = 0; i < length; i++) {
                    if (i >= minItemIndex && i <= maxItemIndex) {
                        itemArray[i].css("visibility", "");
                    } else {
                        itemArray[i].css("visibility", "hidden");
                    }
                }

                this._owner.element.data('picker' + pickerType + 'LastItemIndex', itemIndex);
            };

            wijinputdateroller.prototype._scrollTheView = function (pickerType, newValue, oldValue, ignoreScroll) {
                var itemHeight = this._owner.element.data('itemHeight');
                var newOffset = (2 - newValue) * itemHeight;
                this._owner.element.data('picker' + pickerType + 'ScrollTo', newOffset);
                if (ignoreScroll == true) {
                    var divMask = this._owner.element.data('div' + pickerType + 'Mask');
                    var pickerScrollCurrent = newOffset;
                    this._setCssTransform(divMask, "", pickerScrollCurrent, false);
                    this._hideItemInIE7(pickerType, pickerScrollCurrent);
                    this._owner.element.data('picker' + pickerType + 'ScrollCurrent', pickerScrollCurrent);
                } else {
                    this._scrollPicker(pickerType);
                }
            };

            wijinputdateroller.prototype._scrollPicker = function (pickerType) {
                var divMask = this._owner.element.data('div' + pickerType + 'Mask');
                var pickerScrollTo = this._owner.element.data('picker' + pickerType + 'ScrollTo');
                var pickerScrollCurrent = this._owner.element.data('picker' + pickerType + 'ScrollCurrent');
                var pickerScrollDelay = this._owner.element.data('picker' + pickerType + 'ScrollDelay');

                if (pickerScrollCurrent == undefined) {
                    pickerScrollCurrent = pickerScrollTo;
                    this._setCssTransform(divMask, "", pickerScrollCurrent, false);
                    this._owner.element.data('picker' + pickerType + 'ScrollCurrent', pickerScrollCurrent);
                }

                if (pickerScrollTo == pickerScrollCurrent || pickerScrollCurrent == undefined) {
                    return false;
                }

                pickerScrollCurrent += pickerScrollTo > pickerScrollCurrent ? 1 : -1;
                var transform = "translate(0," + pickerScrollCurrent + "px) ";
                this._setCssTransform(divMask, "", pickerScrollCurrent, false);
                this._hideItemInIE7(pickerType, pickerScrollCurrent);
                this._owner.element.data('picker' + pickerType + 'ScrollCurrent', pickerScrollCurrent);

                var self = this;
                setTimeout(function () {
                    self._scrollPicker(pickerType);
                }, pickerScrollDelay);

                return true;
            };

            wijinputdateroller.prototype._scrollTheViewByTouch = function (pickerType, clientY) {
                var itemHeight = this._owner.element.data('itemHeight');
                var pickerScrollCurrent = this._owner.element.data('picker' + pickerType + 'ScrollCurrent');
                var pickerScrollTo = this._owner.element.data('picker' + pickerType + 'ScrollTo');
                this._owner.element.data('picker' + pickerType + 'ScrollTo', clientY);
                this._scrollPickerByTouch(pickerType);
            };

            wijinputdateroller.prototype._scrollPickerByTouch = function (pickerType) {
                var divMask = this._owner.element.data('div' + pickerType + 'Mask');
                var pickerScrollTo = this._owner.element.data('picker' + pickerType + 'ScrollTo');
                var pickerScrollCurrent = this._owner.element.data('picker' + pickerType + 'ScrollCurrent');

                if (pickerScrollCurrent == undefined) {
                    pickerScrollCurrent = pickerScrollTo;
                    this._setCssTransform(divMask, "", pickerScrollCurrent, false);
                    this._owner.element.data('picker' + pickerType + 'ScrollCurrent', pickerScrollCurrent);
                }

                if (pickerScrollTo == pickerScrollCurrent) {
                    this._owner.element.data('picker' + pickerType + 'ScrollRate', 1);
                    this._owner.element.data('picker' + pickerType + 'ScrollDelay', 5);
                    this._owner.element.data('touchQuickScroll', false);
                    if (pickerType == "Month" || pickerType == "Year") {
                        this._updateDayPickerMaxCount();
                    } else if (pickerType == "Hour") {
                        var itemIndex = this._getItemIndexByPosition(pickerType, pickerScrollCurrent);
                        var am = this._owner.element.data("pickerAM");

                        if (itemIndex == 11) {
                            if (am == 0) {
                                am = 1;
                                this._updateItemTransform("AM", am);
                                this._scrollTheView("AM", am, 0, false);
                                this._owner.element.data("pickerAM", am);
                            }
                        } else {
                            if (am == 1) {
                                am = 0;
                                this._updateItemTransform("AM", am);
                                this._scrollTheView("AM", am, 1, false);
                                this._owner.element.data("pickerAM", am);
                            }
                        }
                    }

                    return false;
                }

                var itemHeight = this._owner.element.data('itemHeight');
                var scrollDelay = this._owner.element.data('picker' + pickerType + 'ScrollDelay');
                var scrollRate = this._owner.element.data('picker' + pickerType + 'ScrollRate');
                var offset = Math.abs(pickerScrollTo - pickerScrollCurrent);
                var rate = offset > scrollRate ? scrollRate : offset;

                if (this._owner.element.data('touchQuickScroll') == true) {
                    if (offset < itemHeight) {
                        scrollDelay = 80;
                    } else if (offset < itemHeight * 2) {
                        scrollDelay = 50;
                    } else if (offset < itemHeight * 5) {
                        scrollDelay = 30;
                    } else if (offset < itemHeight * 8) {
                        scrollDelay = 20;
                    } else if (offset < itemHeight * 10) {
                        scrollDelay = 10;
                    }

                    this._owner.element.data('picker' + pickerType + 'ScrollDelay', scrollDelay);
                }

                pickerScrollCurrent += pickerScrollTo > pickerScrollCurrent ? rate : -1 * rate;
                this._setCssTransform(divMask, "", pickerScrollCurrent, false);
                this._owner.element.data('picker' + pickerType + 'ScrollCurrent', pickerScrollCurrent);

                var itemIndex = this._getItemIndexByPosition(pickerType, pickerScrollCurrent);
                var lastItemIndex = this._owner.element.data('picker' + pickerType + 'LastItemIndex');
                if (itemIndex != lastItemIndex) {
                    this._updateItemTransform(pickerType, itemIndex);
                }
                this._owner.element.data('picker' + pickerType + 'LastItemIndex', lastItemIndex);

                var self = this;
                setTimeout(function () {
                    self._scrollPickerByTouch(pickerType);
                }, scrollDelay);

                return true;
            };

            //#endregion
            //#region Event
            wijinputdateroller.prototype._touchStart = function (evt, pickerType) {
                var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
                var clientY = touch.clientY;

                this._owner.element.data("touch" + pickerType + "StartY", clientY);
                this._owner.element.data("touch" + pickerType + "BaseY", this._owner.element.data('picker' + pickerType + 'ScrollCurrent'));
                this._owner.element.data("touch" + pickerType + "Started", true);
                this._owner.element.data("touchStartTime", new Date());

                var pickerScrollCurrent = this._owner.element.data('picker' + pickerType + 'ScrollCurrent');
                this._owner.element.data('picker' + pickerType + 'ScrollTo', pickerScrollCurrent);
            };

            wijinputdateroller.prototype._touchMove = function (evt, pickerType) {
                if (!this._owner._allowEdit()) {
                    return;
                }

                if (this._owner.element.data("touch" + pickerType + "Started") != true) {
                    return;
                }

                var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
                var clientY = touch.clientY;

                var touchStartY = this._owner.element.data("touch" + pickerType + "StartY");
                var touchBaseY = this._owner.element.data("touch" + pickerType + "BaseY");
                var newY = touchBaseY + clientY - touchStartY;

                this._scrollTheViewByTouch(pickerType, newY);
            };

            wijinputdateroller.prototype._touchEnd = function (evt, pickerType) {
                var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
                var touchStartY = this._owner.element.data("touch" + pickerType + "StartY");
                var touchBaseY = this._owner.element.data("touch" + pickerType + "BaseY");
                var offset = touch.clientY - touchStartY;
                var newY = touchBaseY + offset;

                if (Math.abs(offset) < 10) {
                    var pickerScrollCurrent = this._owner.element.data('picker' + pickerType + 'ScrollCurrent');
                    this._owner.element.data('picker' + pickerType + 'ScrollTo', pickerScrollCurrent);
                    this._adjustTouchPosition(pickerType, pickerScrollCurrent);
                    return;
                }

                this._owner.element.data("touch" + pickerType + "StartY", -1);
                this._owner.element.data("touch" + pickerType + "BaseY", -1);
                this._owner.element.data("touch" + pickerType + "Started", false);

                var now = new Date();
                var offsetTime = now - this._owner.element.data("touchStartTime");
                if (offsetTime < 200) {
                    var itemHeight = this._owner.element.data("itemHeight") * 5;
                    var negative = offset < 0 ? -1 : 1;
                    offset = offset * 4;
                    offset = Math.abs(offset) < itemHeight ? negative * itemHeight : offset;
                    newY += offset;
                    this._owner.element.data("touchQuickScroll", true);
                    this._owner.element.data('picker' + pickerType + 'ScrollRate', 3);
                }

                this._adjustTouchPosition(pickerType, newY);
            };

            wijinputdateroller.prototype._yearMouseWheel = function (e, arg) {
                if (!this._owner._allowEdit()) {
                    return;
                }

                if (isNaN(arg)) {
                    return;
                }

                var minYear = this._owner.element.data("pickerMinYear");
                var maxYear = this._owner.element.data("pickerMaxYear");
                var year = this._owner.element.data("pickerYear");
                var oldYear = this._owner.element.data("pickerYear");

                year -= arg;
                year = year < minYear ? minYear : year;
                year = year > maxYear ? maxYear : year;

                this._updateItemTransform("Year", year - minYear);
                this._scrollTheView("Year", year - minYear, oldYear - minYear, false);
                this._owner.element.data("pickerYear", year);
                this._updateDayPickerMaxCount();
                if (e.preventDefault) {
                    e.preventDefault();
                }
            };

            wijinputdateroller.prototype._monthMouseWheel = function (e, arg) {
                if (!this._owner._allowEdit()) {
                    return;
                }

                if (isNaN(arg)) {
                    return;
                }

                var month = this._owner.element.data("pickerMonth");
                var oldMonth = this._owner.element.data("pickerMonth");

                month -= arg;
                month = month < 1 ? 1 : month;
                month = month > 12 ? 12 : month;

                this._updateItemTransform("Month", month - 1);
                this._scrollTheView("Month", month - 1, oldMonth, false);
                this._owner.element.data("pickerMonth", month);
                this._updateDayPickerMaxCount();
                if (e.preventDefault) {
                    e.preventDefault();
                }
            };

            wijinputdateroller.prototype._dayMouseWheel = function (e, arg) {
                if (!this._owner._allowEdit()) {
                    return;
                }

                if (isNaN(arg)) {
                    return;
                }

                var maxDayCount = this._owner.element.data('pickerDayMaxCount');
                var oldDay = this._owner.element.data("pickerDay");

                var day = this._owner.element.data("pickerDay");
                day -= arg;
                day = day < 1 ? 1 : day;
                day = day > maxDayCount ? maxDayCount : day;

                this._updateItemTransform("Day", day - 1);
                this._scrollTheView("Day", day - 1, oldDay - 1, false);
                this._owner.element.data("pickerDay", day);
                if (e.preventDefault) {
                    e.preventDefault();
                }
            };

            wijinputdateroller.prototype._hourMouseWheel = function (e, arg) {
                if (!this._owner._allowEdit()) {
                    return;
                }

                if (isNaN(arg)) {
                    return;
                }

                var oldHour = this._owner.element.data("pickerHour");
                var hour = this._owner.element.data("pickerHour");
                var lastHour = hour;

                hour -= arg;
                hour = hour < 1 ? 1 : hour;
                hour = hour > 12 ? 12 : hour;

                var am = this._owner.element.data("pickerAM");
                if (hour == 12) {
                    if (am == 0) {
                        am = 1;
                        this._updateItemTransform("AM", am);
                        this._scrollTheView("AM", am, 0, false);
                        this._owner.element.data("pickerAM", am);
                    }
                } else if (lastHour == 12) {
                    if (am == 1) {
                        am = 0;
                        this._updateItemTransform("AM", am);
                        this._scrollTheView("AM", am, 1, false);
                        this._owner.element.data("pickerAM", am);
                    }
                }

                this._updateItemTransform("Hour", hour - 1);
                this._scrollTheView("Hour", hour - 1, oldHour - 1, false);
                this._owner.element.data("pickerHour", hour);
                if (e.preventDefault) {
                    e.preventDefault();
                }
            };

            wijinputdateroller.prototype._minuteMouseWheel = function (e, arg) {
                if (!this._owner._allowEdit()) {
                    return;
                }

                if (isNaN(arg)) {
                    return;
                }

                var oldMinute = this._owner.element.data("pickerMinute");
                var minute = this._owner.element.data("pickerMinute");
                minute -= arg;
                minute = minute < 0 ? 0 : minute;
                minute = minute > 59 ? 59 : minute;

                this._updateItemTransform("Minute", minute);
                this._scrollTheView("Minute", minute, oldMinute, false);
                this._owner.element.data("pickerMinute", minute);
                if (e.preventDefault) {
                    e.preventDefault();
                }
            };

            wijinputdateroller.prototype._amMouseWheel = function (e, arg) {
                if (!this._owner._allowEdit()) {
                    return;
                }

                if (isNaN(arg)) {
                    return;
                }

                var oldAM = $(e.currentTarget).data('pickerAM');
                var am = this._owner.element.data("pickerAM");

                am -= arg;
                am = am < 0 ? 0 : am;
                am = am > 1 ? 1 : am;

                this._updateItemTransform("AM", am);
                this._scrollTheView("AM", am, oldAM, false);
                this._owner.element.data("pickerAM", am);
                if (e.preventDefault) {
                    e.preventDefault();
                }
            };

            //#endregion
            //#region CreateElement
            wijinputdateroller.prototype._createDivElement = function (container, width) {
                var div = $("<div/>").appendTo(container).css({ "width": width + "px", "display": "block", "left": "", "top": "", "position": "" }).bind("touchstart", function (evt) {
                    evt.preventDefault();
                }).bind("touchmove", function (evt) {
                    evt.preventDefault();
                });

                return div;
            };

            wijinputdateroller.prototype._createDivIndicatiorElement = function (div, height, prefix, transform) {
                var indicator = $("<div/>").appendTo(div).css({ "height": height, "opacity": "0.5", "lineHeight": height, "margin": "0px", "cursor": "default" }).attr("class", "ui-state-active");
                this._setCssTransform(indicator, prefix, transform, false);
                return indicator;
            };

            wijinputdateroller.prototype._createIndicatiorElement = function (div, height, prefix, transform) {
                var indicator = $("<div/>").appendTo(div).css({ "height": height, "opacity": "0.5", "lineHeight": height, "border-width": "0px", "cursor": "default" }).attr("class", "ui-widget-content");
                this._setCssTransform(indicator, prefix, transform, false);
                return indicator;
            };

            wijinputdateroller.prototype._setCssTransform = function (element, prefix, transform, setDirect) {
                var newTransform = transform;

                if (!setDirect) {
                    newTransform = "translate(0, " + prefix + transform + "px)";
                }

                element.css("position", "");
                element.css("top", "");

                if (input.CoreUtility.IsIE8OrBelow()) {
                    element.css("position", "relative");
                    element.css("top", prefix + transform + "px");
                } else if (input.CoreUtility.IsIE9()) {
                    element.css("-ms-transform", newTransform);
                } else {
                    element.css("transform", newTransform);
                }
            };

            wijinputdateroller.prototype._createTableElement = function (div, height, prefix, transform) {
                var table = $("<table/>").appendTo(div).css({ "width": "100%", "height": height + "px" }).attr({ "cellspacing": "0px", "cellpadding": "0px" });

                this._setCssTransform(table, prefix, transform, false);

                return table;
            };

            wijinputdateroller.prototype._createItemElement = function (index, div, height, text) {
                var item = $("<div/>").appendTo(div).css({ "height": height, "lineHeight": height, "cursor": "default" }).html(text).data("rollValue", index);

                return item;
            };

            wijinputdateroller.prototype._createPickerDivElement = function (div, height) {
                var pickerDiv = $("<div/>").appendTo(div).css({ "height": height, "border": "0px", "text-align": "center", "overflow": "hidden", "background": "transparent" });

                return pickerDiv;
            };

            wijinputdateroller.prototype._createMaskElement = function (div, height) {
                var mask = $("<div/>").appendTo(div).css({ "height": height });

                return mask;
            };
            return wijinputdateroller;
        })();
        input.wijinputdateroller = wijinputdateroller;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
