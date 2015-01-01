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
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/// <reference path="../wijutil/jquery.wijmo.wijutil.ts" />
/// <reference path="../wijlist/jquery.wijmo.wijlist.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals jQuery,window,document*/
    /*
    * Depends:
    *     jquery.ui.core.js
    *     jquery.ui.widget.js
    *     jquery.wijmo.wijtooltip.js
    */
    (function (combobox) {
        "use strict";
        var $ = jQuery, widgetName = "wijcombobox";

        /** @widget */
        var wijcombobox = (function (_super) {
            __extends(wijcombobox, _super);
            function wijcombobox() {
                _super.apply(this, arguments);
            }
            wijcombobox.prototype._create = function () {
                var t = this, focusElement;

                // inits selected items
                t.selectedItem = null;
                t.selectedItems = [];

                // enable touch support:
                if (window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }

                try  {
                    focusElement = document.activeElement;
                } catch (e) {
                }

                //update for visibility change
                if (t.element.is(":hidden") && t.element.wijAddVisibilityObserver) {
                    t.element.wijAddVisibilityObserver(function () {
                        t.repaint();
                        if (t.element.wijRemoveVisibilityObserver) {
                            t.element.wijRemoveVisibilityObserver();
                        }
                    }, "wijcombobox");
                }

                // inits wijcombobox
                t._initInnerData();
                t._createDOMElements();
                t._bindInputEvents();
                t._initDropDownList();
                t.repaint();
                t._checkSelectIndex();
                t.options.text = t._input.val();

                if (t._usingRemoteData() && t.options.data) {
                    t.originalDataSourceLoaded = t.options.data.loaded;
                }

                //If combo is in an invisible iframe, exception will throw.
                //add this in try block to prevent this exception.
                //focusElement = document.activeElement;
                if (focusElement === t._input[0] && t.options.isEditable) {
                    $(function () {
                        t._input.focus();
                    });
                }
                _super.prototype._create.call(this);
            };

            wijcombobox.prototype._initInnerData = function () {
                var self = this, o = self.options, isBind;
                if (o.dataSource !== null) {
                    isBind = self._isBind();
                    if (isBind) {
                        self.innerData = self._getMappingItems();
                    } else {
                        self.innerData = o.data;
                    }
                } else {
                    self.innerData = o.data;
                }

                self.listHasCreated = false;
            };

            wijcombobox.prototype._checkSelectIndex = function () {
                var self = this, index, o = self.options, data = self.innerData;

                if (o.selectedIndex === -1 && o.selectedValue != null) {
                    $.each(data, function (i, item) {
                        if (data[i].value === o.selectedValue) {
                            o.selectedIndex = i;
                            if (o.selectionMode === "multiple") {
                                o.selectedIndex = [o.selectedIndex];
                            }
                            return false;
                        }
                    });
                }
                index = o.selectedIndex;
                if (!self._usingRemoteData() && (index >= 0 || $.isArray(index))) {
                    self.search(null, "checkindex");
                }

                // if the selecteIndex is -1 and selectedValue is null, the text
                // option will give to combobox
                if (o.selectedIndex === -1 && o.text) {
                    if (!o.forceSelectionText || (o.forceSelectionText && self._checkTextInItems(o.text) !== -1)) {
                        self._input.val(o.text);
                        o.selectedIndex = self._checkTextInItems(o.text);
                        if (o.selectionMode === "multiple") {
                            o.selectedIndex = [o.selectedIndex];
                        }
                        if (o.selectedIndex > -1) {
                            self._checkSelectIndex();
                        }
                    }
                }
            };

            /** Repaints wijcombobox. Returns true if it succeeds;
            *   otherwise, returns false.
            * @returns {boolean} true if it succeeds; otherwise, returns false.
            */
            wijcombobox.prototype.repaint = function () {
                var o = this.options, self = this;
                if (self.element.is(":visible") || self._comboDiv || (self._select !== undefined && self._input.is(":visible"))) {
                    self._showTrigger();
                    self._handleAdjustWidthOptions();
                    if (self._isDisabled()) {
                        self._innerDisable();
                    }
                    return true;
                }
                return false;
            };

            wijcombobox.prototype._bindInputEvents = function () {
                var self = this, wijCSS = this.options.wijCSS, code, keyCode, inputText, input = self._input, o = self.options;

                // self.element is an html input element.
                input.bind("keydown.wijcombobox", function (event) {
                    if (self._isDisabled()) {
                        return;
                    }
                    code = event.keyCode;

                    //keyCode = $.ui.keyCode;
                    keyCode = wijmo.getKeyCodeEnum();
                    switch (code) {
                        case keyCode.UP:
                            self._move("previous", event);

                            // prevent moving cursor to beginning of
                            // text field in some browsers
                            event.preventDefault();
                            break;
                        case keyCode.DOWN:
                            self._move("next", event);

                            // prevent moving cursor to end of text field in some browsers
                            event.preventDefault();
                            break;
                        case keyCode.ENTER:
                            // when menu is open or has focus
                            if (self.menu.active) {
                                event.preventDefault();

                                //update for issue 24045
                                if (o.selectionMode === "multiple" && self.menu && self.menu.items && self.menu.items.length === 1) {
                                    $.each(self.selectedItems, function (index, i) {
                                        if (i !== self.menu.items[0]) {
                                            i.selected = false;
                                        }
                                    });
                                }

                                //end
                                self.menu.select(event);
                            }
                            event.preventDefault(); //update for issue 24134 at 2012/7/19
                            break;

                        case keyCode.TAB:
                            input.trigger("wijcomboblur");
                            if (!self.menu.active || (o.selectionMode === "multiple" && keyCode.TAB === code)) {
                                return;
                            }
                            self.menu.select(event);

                            // remove selection from input.
                            var end = input.val().length;
                            self._selectText(end, end, input);

                            break;
                        case keyCode.ESCAPE:
                            self.close(event, undefined);
                            break;
                        case keyCode.LEFT:
                        case keyCode.RIGHT:
                        case keyCode.SHIFT:
                        case 16:
                        case 17:
                        case keyCode.CTRL:
                        case keyCode.HOME:
                        case keyCode.END:
                        case keyCode.PAGE_UP:
                        case keyCode.PAGE_DOWN:
                            break;
                        case keyCode.DELETE:
                            if (!inputText) {
                                inputText = input.val();
                            }
                            break;
                        case 18:
                            input.trigger("wijcomboblur");
                            break;
                        default:
                            // keypress is triggered before the input value is changed
                            //IE and Chrome the keycode is 229 in IME mode
                            //In Firefox it says 'Characters entered through an IME do not register through keyCode or charCode.' in documetation.  So the keycode is 0 and key of event is 'Unidentified' in IME mode.
                            //Please refer https://developer.mozilla.org/en-US/docs/Web/API/event.keyCode
                            if (code === 229 || ($.browser.mozilla && event.key === "Unidentified" && code === 0)) {
                                return;
                            }

                            self._processingSearch(input, code, event);
                            break;
                    }
                }).bind("keyup.wijcombobox", function (event) {
                    if (self._isDisabled()) {
                        return;
                    }
                    code = event.keyCode;
                    keyCode = wijmo.getKeyCodeEnum();
                    switch (code) {
                        case keyCode.DELETE:
                            if (inputText !== input.val()) {
                                self._processingSearch(input, code, event);
                            }
                            inputText = undefined;
                            break;
                    }
                }).bind("wijcomboblur.wijcombobox", function (event) {
                    window.clearTimeout(self.searching);
                    self._addInputFocus(false, wijCSS.stateFocus);

                    // TODO try to implement this without a timeout,
                    // see clearTimeout in search()
                    self.closing = window.setTimeout(function () {
                        self.close(event, true);
                    }, 150);
                }).bind("focus.wijcombobox", function () {
                    self._addInputFocus(true, wijCSS.stateFocus);
                }).bind("blur.wijcombobox", function () {
                    if (!self.menu.element.is(":visible")) {
                        input.trigger("wijcomboblur");
                    }

                    // 1)if inputed char include in dropdown items,
                    // the dropdown will open
                    // if the inputed char don't include in dropdown items,
                    // the dropdown won't open, it's for issue 42012
                    // 2)Thinking of "forceSelectionText" option, so move the "textChange"
                    // event to _change method
                    // self._setInputText(input.val());
                    if (!self._inputBlurCausedByListItemClick) {
                        self._change();
                    }
                }).bind("compositionend.wijcombobox", function (event) {
                    self._processingSearch(input, code, event);
                });

                //fixed the issue 40441
                if ($.browser.msie && parseInt($.browser.version) > 9) {
                    input.bind("mouseup.wijcombobox", function (event) {
                        // fixed an issue of IE10(browser mode IE9), when runs in this mode,
                        // the input element will show clear button at the right side of the input element.
                        // click the button, the widget's text value will not cleared.
                        if (input.val() === '') {
                            return;
                        }

                        // Wait for it....
                        setTimeout(function () {
                            if (input.val() === '') {
                                self.menu.deactivate();
                            }
                        }, 5);
                    });
                }
            };

            wijcombobox.prototype._processingSearch = function (input, code, event) {
                var self = this, o = self.options;

                window.clearTimeout(self.searching);
                if (o.isEditable === false) {
                    if (self._cacheKey === undefined) {
                        self._cacheKey = "";
                    }
                    self._cacheKey += String.fromCharCode(code);
                }
                self.searching = window.setTimeout(function () {
                    var term;
                    if (o.isEditable === false) {
                        term = self._cacheKey;
                        self._cacheKey = undefined;
                    } else {
                        term = input.val();
                    }
                    self.search(term, event);
                }, o.delay);
            };

            wijcombobox.prototype._addInputFocus = function (add, css) {
                var self = this, wrap, key, arrow;

                wrap = self._input.parent();
                key = add ? "addClass" : "removeClass";
                arrow = self._triggerArrow;
                wrap[key](css);
                if (arrow !== undefined) {
                    arrow[key](css);
                }
            };

            wijcombobox.prototype._renderColumnsHeader = function (header) {
                var self = this, ul = $("<ul class='wijmo-wijcombobox-rowheader'></ul>");
                $.each(this.options.columns, function (index, column) {
                    var li = $("<li class='wijmo-wijcombobox-cell " + self.options.wijCSS.header + "'></li>");
                    li.html(column.name);
                    if (column.width !== undefined) {
                        li.width(column.width);
                    }
                    li.appendTo(ul);
                });
                header.append(ul);
            };

            wijcombobox.prototype._hasSameValueText = function (item1, item2) {
                return item1.label === item2.label && item1.value === item2.value;
            };

            wijcombobox.prototype._initDropDownList = function () {
                var self = this, doc, menuElement, o = self.options, header, listOptions, wijCSS = this.options.wijCSS, zIndex = parseInt(self._input.css("zIndex"), 10), dropDownContainer;

                doc = self.element[0].ownerDocument;
                if (isNaN(zIndex)) {
                    zIndex = 0;
                }
                if (!self._comboDiv) {
                    menuElement = $("<div class='" + wijCSS.comboboxListCss + "'></div>");
                } else {
                    menuElement = self._oriList;
                }
                if (o.columns.length > 0) {
                    menuElement.addClass("wijmo-wijcombobox-multicolumn");
                    header = $("<div class='wijmo-wijsuperpanel-header " + wijCSS.stateDefault + "'></div>");
                    self._renderColumnsHeader(header);
                    menuElement.append(header);
                }

                listOptions = {
                    keepHightlightOnMouseLeave: true,
                    selectionMode: o.selectionMode,
                    addHoverItemClass: o.columns.length === 0,
                    focus: function (e, item) {
                        var i = item;
                        if (o.selectOnItemFocus) {
                            self.menu.select(null, {
                                notCloseAfterSelected: true
                            });
                        }
                        if (o.columns.length > 0) {
                            if (i.element) {
                                i.element.prev().addClass("wijmo-wijcombobox-active-prev");
                                i.element.find(".wijmo-wijcombobox-row>.wijmo-wijcombobox-cell").addClass(wijCSS.stateHover);
                            }
                        }
                    },
                    selected: function (event, ui) {
                        window.clearTimeout(self.closing);
                        var mode = o.selectionMode, item, newIndex, cancelSelect = false, oldText, oldIndex, oldItem;

                        item = ui.item;

                        newIndex = $.inArray(item, self.items);
                        if (newIndex < 0) {
                            return;
                        }

                        if (self._trigger("select", event, item)) {
                            if (mode === "single") {
                                // local data select
                                if (!self._usingRemoteData()) {
                                    if (newIndex !== o.selectedIndex) {
                                        oldIndex = o.selectedIndex;
                                        oldItem = self.selectedItem;
                                        cancelSelect = self._triggerSelectedIndexChanging(oldItem, item, oldIndex, newIndex);
                                        if (cancelSelect) {
                                            return;
                                        }

                                        self._setInputText(item.label);

                                        if (oldItem) {
                                            oldItem.selected = false;
                                        }
                                        self.selectedItem = item;

                                        o.selectedIndex = newIndex;
                                        o.selectedValue = self.selectedItem.value;

                                        o.inputTextInDropDownList = true;

                                        //o.text = self._input.val();for #33666 issue
                                        // fixed the issue 41831
                                        if (oldItem && oldItem.element) {
                                            oldItem.element.removeClass("wijmo-wijcombobox-selecteditem");
                                        }

                                        self._triggerChangeEvents(oldItem, oldIndex);
                                    } else {
                                        // for fixing bug 24133 at 2012/8/6
                                        if (self.selectedItem && self._input.val() !== self.selectedItem.label && (ui.data === undefined || !ui.data.notCloseAfterSelected)) {
                                            self._input.val(item.label);
                                        }
                                    }
                                } else {
                                    // If items have the same text and value,
                                    // they are considered to be same in remote mode.
                                    if (self.selectedItem === null || !self._hasSameValueText(item, self.selectedItem)) {
                                        oldItem = self.selectedItem;
                                        oldIndex = o.selectedIndex;
                                        cancelSelect = self._triggerSelectedIndexChanging(oldItem, item, oldIndex, ui.selectedIndex);
                                        if (cancelSelect) {
                                            return;
                                        }

                                        //self._input.val(item.label);
                                        self._setInputText(item.label);

                                        //o.text = self._input.val();for #33666 issue
                                        self.selectedItem = item;

                                        //update for 29162 issue.
                                        if (newIndex !== o.selectedIndex) {
                                            o.selectedIndex = newIndex;
                                            o.selectedValue = self.selectedItem.value;
                                        }

                                        //end
                                        o.inputTextInDropDownList = true;

                                        self._triggerChangeEvents(oldItem, oldIndex);
                                    }
                                }
                            } else {
                                if (!self._usingRemoteData()) {
                                    cancelSelect = self._triggerSelectedIndexChanging(null, item, oldIndex, ui.selectedIndex);
                                    if (cancelSelect) {
                                        return;
                                    }

                                    self.selectedItems = ui.selectedItems;
                                    self._selectedItemsToInputVal(self.selectedItems);
                                    o.inputTextInDropDownList = true;
                                    o.selectedIndex = ui.selectedIndex;

                                    self._triggerChangeEvents(null, null);
                                    ///TODO: show helper list
                                }
                            }
                        }
                        if ((ui.data === undefined || !ui.data.notCloseAfterSelected) && mode === "single") {
                            self.close(event);
                            self._input.focus();
                        }
                        self._inputBlurCausedByListItemClick = false;
                    },
                    blur: function (e, item) {
                        var d = item.element;
                        if (o.columns.length > 0 && d) {
                            d.find(".wijmo-wijcombobox-row>.wijmo-wijcombobox-cell").removeClass(wijCSS.stateHover);
                            d.prev().removeClass("wijmo-wijcombobox-active-prev");
                        }
                    },
                    mouseDown: function (event) {
                        self._inputBlurCausedByListItemClick = true;
                    },
                    itemRendering: function (event, data) {
                        var item = data, css = "";
                        if (item.isSeparator) {
                            css += " wijmo-wijcombobox-separator";
                        }
                        if (item.selected) {
                            css += " wijmo-wijcombobox-selecteditem";
                        }
                        if (css.length > 0) {
                            item.element.addClass(css);
                        }
                    },
                    itemRendered: function (event, data) {
                        var item = data, li, u;
                        if (item.cells === undefined) {
                            return;
                        }
                        li = item.element;
                        li.empty();
                        u = $("<ul class='wijmo-wijcombobox-row'></ul>");
                        $.each(item.cells, function (index, cell) {
                            var l = $("<li class='wijmo-wijcombobox-cell " + wijCSS.stateDefault + "'></li>");

                            //Fix a bug that columns.width doesn't work.
                            if (o.columns && o.columns.length > index) {
                                if (typeof o.columns[index].width !== "undefined") {
                                    l.width(o.columns[index].width);
                                }
                            }

                            //end comments.
                            l.append(cell);
                            l.attr("title", cell);
                            u.append(l);
                        });
                        li.append(u);
                    },
                    listRendered: function (event, data) {
                        var selectedItem = self.menu.selectedItem, selectedItems = self.menu.selectedItems, selecedIndex, items;
                        if (o.selectionMode === "single" && selectedItem) {
                            selecedIndex = $.inArray(selectedItem, self.items);
                            if (selecedIndex < 0) {
                                return;
                            }
                            self.selectedItem = self.items[selecedIndex];
                            self._setInputText(self.selectedItem.label, true);
                            if (selecedIndex >= -1) {
                                o.selectedIndex = selecedIndex;
                            }
                        } else if (selectedItems && selectedItems.length > 0) {
                            selecedIndex = [];
                            items = [];
                            $.each(selectedItems, function (i, item) {
                                var index = $.inArray(item, self.items);
                                if (index < 0) {
                                    return true;
                                }
                                selecedIndex.push(index);
                                items.push(self.items[index]);
                            });
                            self._selectedItemsToInputVal(items);
                            if (selecedIndex.length >= 0) {
                                o.selectedIndex = selecedIndex;
                            }
                        }
                    },
                    superPanelOptions: {
                        resized: function (e) {
                            var m = self.menu, ele = m.element;
                            o.dropdownWidth = ele.outerWidth();
                            o.dropdownHeight = ele.outerHeight();
                            self._positionList();
                            self.menu.refreshSuperPanel();
                        }
                    }
                };
                listOptions = $.extend(true, listOptions, o.listOptions);

                dropDownContainer = o.ensureDropDownOnBody ? $("body") : self._comboElement;

                self.menu = menuElement.appendTo(dropDownContainer, doc).wijlist(listOptions).css({
                    zIndex: zIndex + 1,
                    top: 0,
                    left: 0
                }).hide().data("wijmo-wijlist");
                self._createDropDownList();
                self._menuUL = self.menu.ul;
            };

            wijcombobox.prototype._setInputText = function (text, notfiredTextChanged) {
                var self = this, oldText = self.options.text;

                self._input.val(text);
                self.options.text = text;
                if (oldText !== text && !notfiredTextChanged) {
                    self._trigger("textChanged", null, {
                        oldText: oldText,
                        newText: text
                    });
                }
            };

            wijcombobox.prototype._triggerChangeEvents = function (oldSelectedItem, oldSelectedIndex) {
                var o = this.options, mode = o.selectionMode, selectedItem = this.selectedItem, selectedIndex = this.options.selectedIndex, changedData;

                this._triggerSelectElementChange();

                changedData = {
                    oldItem: oldSelectedItem,
                    selectedItem: this.selectedItem,
                    newIndex: selectedIndex,
                    oldIndex: oldSelectedIndex
                };
                if (mode === "multiple") {
                    changedData = $.extend(changedData, { selectedItems: this.selectedItems });
                }

                this._trigger("changed", null, changedData);

                if (selectedIndex != oldSelectedIndex) {
                    this._triggerSelectedIndexChanged(oldSelectedItem, selectedItem, oldSelectedIndex, selectedIndex);
                }
            };

            wijcombobox.prototype._triggerSelectElementChange = function () {
                var o = this.options;

                // fire select change event
                if (this._select !== undefined) {
                    if ($.isArray(o.selectedIndex) && o.selectedIndex.length > 0) {
                        this._select[0].selectedIndex = o.selectedIndex[0];
                    } else {
                        this._select[0].selectedIndex = o.selectedIndex;
                    }
                    this._select.trigger("change");
                }
            };

            wijcombobox.prototype._triggerSelectedIndexChanged = function (oldItem, newItem, oldIndex, newIndex) {
                var o = this.options, curSelectedIdx;

                if (o.selectionMode === "single") {
                    this._trigger("selectedIndexChanged", null, {
                        oldItem: oldItem,
                        selectedItem: newItem,
                        newIndex: newIndex,
                        oldIndex: oldIndex
                    });
                } else {
                    curSelectedIdx = $.inArray(newItem, this.items);
                    this._trigger("selectedIndexChanged", null, {
                        selectedItem: newItem,
                        selectedIndex: curSelectedIdx,
                        selectedItems: this.selectedItems
                    });
                }
            };

            wijcombobox.prototype._triggerSelectedIndexChanging = function (oldItem, newItem, oldIndex, newIndex) {
                var o = this.options, curSelectedIdx, args, isSelect = true;

                if (o.selectionMode === "single") {
                    args = {
                        oldItem: oldItem,
                        selectedItem: newItem,
                        newIndex: newIndex,
                        oldIndex: oldIndex
                    };
                    isSelect = this._trigger("selectedIndexChanging", null, args);
                } else {
                    curSelectedIdx = $.inArray(newItem, this.items);
                    args = {
                        selectedItem: newItem,
                        selectedIndex: curSelectedIdx,
                        selectedItems: this.selectedItems
                    };
                    isSelect = this._trigger("selectedIndexChanging", null, args);
                }
                if (!isSelect) {
                    newItem.selected = false;
                    if (newItem.element) {
                        newItem.element.removeClass("wijmo-wijcombobox-selecteditem");
                    }
                }
                return !isSelect;
            };

            wijcombobox.prototype._createDropDownList = function (datasrc) {
                var self = this, items, o = self.options, datasource = datasrc;

                if (!datasource) {
                    datasource = self.innerData;
                }

                if (datasource === null) {
                    items = null;
                } else {
                    items = $.isArray(datasource) ? datasource : datasource.items;
                }
                if (self._comboDiv) {
                    //update for case 20689 at 2012/4/11
                    if (!self.listHasCreated && items && items.length > 0) {
                        self.menu.setTemplateItems(o.data);
                        if ($.isArray(self.innerData)) {
                            self.innerData = self.menu.items;
                        } else {
                            self.innerData.items = self.menu.items;
                        }
                        self.items = self.menu.items;
                        self.menu.renderList();
                        self.listHasCreated = true;
                    }
                } else {
                    if (!self.listHasCreated && items && items.length > 0) {
                        self.menu.setItems(items);
                        if ($.isArray(self.innerData)) {
                            self.innerData = self.menu.items;
                        } else {
                            self.innerData.items = self.menu.items;
                        }
                        self.items = self.menu.items;
                        self.menu.renderList();
                        self.listHasCreated = true;
                    }
                }
                self._handleAdjustWidthOptions();
            };

            wijcombobox.prototype._getSelectedItemsText = function (items) {
                var s = "", self = this, sep = self.options.multipleSelectionSeparator;
                self.selectedItems = items;

                $.each(items, function (index, item) {
                    //update for bug 24045
                    if (item) {
                        s += item.label + sep;
                    }
                });
                if (s.length > 0) {
                    s = s.substr(0, s.lastIndexOf(sep));
                }

                return s;
            };

            wijcombobox.prototype._selectedItemsToInputVal = function (items) {
                var self = this;

                //self._input.val(self._getSelectedItemsText(items));
                self._setInputText(self._getSelectedItemsText(items));
                //self.options.text = self._input.val();for #33666 issue
            };

            wijcombobox.prototype._createDOMElements = function () {
                var self = this, comboElement, wijCSS = this.options.wijCSS, ele, input, wrapperElement;

                wrapperElement = $("<div class='" + wijCSS.comboboxWrapperCss + " " + wijCSS.stateDefault + " " + wijCSS.cornerAll + "'></div>");

                // check if element is a select element
                ele = self.element;

                // create from a select element
                if (ele.is("select")) {
                    comboElement = $("<div role='combobox' class='" + wijCSS.comboboxCss + " " + wijCSS.widget + " " + wijCSS.helperClearFix + "'></div>");
                    comboElement.append(wrapperElement);
                    self._comboElement = comboElement;
                    self._select = ele;

                    // add class to set font size to get the correct width of select.
                    ele.addClass(wijCSS.widget);
                    input = self._input = $("<input role='textbox' " + "aria-autocomplete='list' aria-haspopup='true' />").insertAfter(ele);
                    if (!self.options.data) {
                        self.options.data = self._convertSelectOptions();
                        self._initInnerData();
                    }
                } else if (ele.is("div") && $(ele.children()[0]).is("input[type='text']") && $(ele.children()[1]).is("div")) {
                    //div tag
                    self._comboElement = self._comboDiv = comboElement = ele;
                    self._oriList = $(ele.children()[1]);
                    input = self._input = $(ele.children()[0]);

                    wrapperElement.prependTo(comboElement).append(input);
                    ele.addClass(wijCSS.comboboxCss + " " + wijCSS.widget + " " + wijCSS.helperClearFix);
                    ele.attr("role", "combobox");
                } else {
                    comboElement = $("<div role='combobox' class='" + wijCSS.comboboxCss + " " + wijCSS.widget + " " + wijCSS.helperClearFix + "'></div>");
                    comboElement.append(wrapperElement);
                    self._comboElement = comboElement;
                    input = self._input = ele;
                }
                if (!self._comboDiv) {
                    comboElement.insertBefore(input);

                    //update for fixing bug 17328 at 2011/10/18 by wuhao
                    //add visible judge for visibility change at 2012/7/24
                    if (self.element.is(":visible")) {
                        input.width(input.width());
                    }

                    //end for fixing bug 17328
                    comboElement.children("." + wijCSS.comboboxWrapperCss).append(input);
                }

                if (ele.attr("title")) {
                    self._comboElement.attr("title", ele.attr("title"));
                }
                input.attr({
                    autocomplete: "off",
                    role: "textbox",
                    "aria-wijcombobox": "list",
                    "aria-haspopup": "true"
                }).addClass(wijCSS.comoboboxInputCss);
                self._oldWidth = ele.css("width");
                if (self.options.isEditable === false) {
                    input.attr("readonly", "readonly");

                    //update for add issue: when iseditable is false
                    //click the all the combobox, the dropdown list will open
                    wrapperElement.bind("click", function () {
                        if (self._isDisabled()) {
                            return;
                        }
                        self._triggerClick();
                    });
                }
                if (self._isDisabled()) {
                    self._comboElement.addClass("wijmo-wijcombobox-disabled " + wijCSS.stateDisabled);
                    input.attr("disabled", "disabled");
                }
                comboElement.bind("mouseenter.wijcombobox", function () {
                    if (self._isDisabled()) {
                        return;
                    }
                    self._addInputFocus(true, wijCSS.stateHover);
                }).bind("mouseleave.wijcombobox", function () {
                    self._addInputFocus(false, wijCSS.stateHover);
                });
            };

            wijcombobox.prototype._convertSelectOptions = function () {
                var items = [], self = this, selectOptions;

                selectOptions = self._select.get(0).options;
                $.each(selectOptions, function (idx, opt) {
                    items.push({ label: opt.text, value: opt.value });
                });

                //update for case 28976
                if (self.options.selectedIndex === -1 && self.options.selectedValue === null && self.options.text === null) {
                    self.options.selectedIndex = self._select[0].selectedIndex;
                }
                return items;
            };

            /** @ignore */
            wijcombobox.prototype.getComboElement = function () {
                return this._comboElement;
            };

            wijcombobox.prototype._updateLabelTextElement = function () {
                var self = this, o = self.options, wijCSS = o.wijCSS, labelHTML = "<label class='wijmo-wijcombobox-label " + wijCSS.content + "'></label>", label = self._input.parent().children(".wijmo-wijcombobox-label");
                if (o.labelText !== null) {
                    if (label.length === 0) {
                        label = $(labelHTML);
                        self._input.parent().append(label);
                    }
                    self._label = label;
                    label.html(o.labelText);
                } else {
                    if (label) {
                        label.remove();
                        self._label = undefined;
                    }
                }
            };

            wijcombobox.prototype._showTrigger = function () {
                var self = this, o = self.options, input = self._input, inputWrapper = input.parent(), comboElement = self._comboElement, wijCSS = this.options.wijCSS, selectClone, selectWidth = 0, trigger = self._triggerArrow, label = self._label, sp, padding, labelPadding, triggerPadding, asideBorder, triggerHTML = "<div class='" + wijCSS.comboboxTriggerCss + " " + wijCSS.stateDefault + " " + wijCSS.cornerRight + "'>" + "<span class='" + wijCSS.icon + " " + wijCSS.iconArrowDown + "'></span>" + "</div>";

                // set size
                if (self._select !== undefined) {
                    // the hidden _select element indicated the
                    // combobox is repainting; so use the native width
                    // to draw combobox
                    if (!self._select.is(":visible")) {
                        selectWidth = self._nativeWidth;
                    } else {
                        if (!$.browser.msie) {
                            selectWidth = self._select.width();
                        } else {
                            selectClone = self._select.clone();
                            self._select.after(selectClone);
                            selectWidth = selectClone.width();
                            selectClone.remove();
                        }
                        self._nativeWidth = selectWidth;
                    }

                    //update for bind array
                    comboElement.css("width", "");
                    input.width(selectWidth + (o.dropdownHeight < self.menu.element.height() ? o.selectElementWidthFix : 0));
                    self._select.hide();
                }

                //update for fixing bug 15920 by wuhao
                input.css("margin-left", "");
                input.css("margin-right", "");

                //end for bug 15920.
                comboElement.width(inputWrapper[0].offsetWidth);

                //comboElement.height(inputWrapper[0].offsetHeight);
                // show label
                self._updateLabelTextElement();
                label = self._label;

                if (o.showTrigger) {
                    input.removeClass(wijCSS.cornerAll);
                    if (trigger === undefined) {
                        trigger = self._triggerArrow = $(triggerHTML);
                        comboElement.append(trigger);
                        trigger.bind("mouseover.triggerevent", self, function (e) {
                            if (self._isDisabled()) {
                                return;
                            }
                            var ct = $(e.currentTarget);
                            ct.addClass(wijCSS.stateHover);
                        }).bind("mousedown.triggerevent", self, function (e) {
                            if (self._isDisabled()) {
                                return;
                            }
                            var ct = $(e.currentTarget);
                            ct.addClass(wijCSS.stateActive);
                        }).bind("mouseup.triggerevent", self, function (e) {
                            var ct = $(e.currentTarget);
                            ct.removeClass(wijCSS.stateActive);
                        }).bind("click.triggerevent", self, function () {
                            if (self._isDisabled()) {
                                return;
                            }
                            self._triggerClick();
                        });
                    }
                    if (o.triggerPosition === "right") {
                        trigger.css({ left: "", right: "0px" });
                        trigger.removeClass(wijCSS.cornerLeft);
                        trigger.addClass(wijCSS.cornerRight);
                    } else {
                        trigger.css({ "right": "", "left": "0px" });
                        trigger.removeClass(wijCSS.cornerRight);
                        trigger.addClass(wijCSS.cornerLeft);
                    }
                    trigger.setOutHeight(comboElement.innerHeight());
                    sp = trigger.find("span");
                    sp.css("margin-left", (trigger.innerWidth() - sp[0].offsetWidth) / 2);
                    sp.css("margin-top", (trigger.innerHeight() - sp[0].offsetHeight) / 2);
                } else {
                    if (trigger !== undefined) {
                        trigger.unbind(".triggerevent");
                        trigger.remove();
                        trigger = undefined;
                        self._triggerArrow = undefined;
                    }
                    input.removeClass(wijCSS.cornerLeft);
                    input.removeClass(wijCSS.cornerRight);
                    input.addClass(wijCSS.cornerAll);
                }

                // padding
                padding = labelPadding = triggerPadding = 0;
                if (label !== undefined) {
                    labelPadding += label.outerWidth(true);
                }
                asideBorder = o.triggerPosition === "left" ? inputWrapper.leftBorderWidth() : inputWrapper.rightBorderWidth();
                if (trigger !== undefined) {
                    triggerPadding = trigger.outerWidth(true) - asideBorder;
                }
                padding = labelPadding + triggerPadding;
                input.setOutWidth(inputWrapper.width() - padding);

                padding = padding === 0 ? "" : padding;
                if (o.triggerPosition === "right") {
                    input.css("margin-left", "");
                    input.css("margin-right", padding);
                    if (label !== undefined) {
                        label.css("left", "");
                        label.css("right", triggerPadding);
                    }
                } else {
                    input.css("margin-right", "");
                    input.css("margin-left", padding);

                    if (label !== undefined) {
                        label.css("right", "");
                        label.css("left", triggerPadding);
                    }
                }
            };

            wijcombobox.prototype._triggerClick = function () {
                var self = this, term = "";
                window.clearTimeout(self.closing);
                if (self.menu.element.is(":visible")) {
                    self.close();
                } else {
                    // TODO: click open should not render again.
                    if (self._usingRemoteData()) {
                        term = self._input.val();
                    }
                    self.search(term, undefined, false);
                }
            };

            /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            wijcombobox.prototype.destroy = function () {
                var self = this, wijCSS = this.options.wijCSS, ele = self.element;
                if (self.options.isEditable === false) {
                    ele.removeAttr("readonly");
                }

                if (self._input) {
                    self._input.unbind(".wijcombobox");
                }

                if (self._comboElement) {
                    self._comboElement.unbind(".wijcombobox");
                }

                if (self._triggerArrow) {
                    self._triggerArrow.unbind(".triggerevent");
                }

                if (self._select !== undefined) {
                    self._select.removeClass(wijCSS.widget);
                    self._select.show();
                    self._input.remove();
                } else if (self._comboDiv) {
                    self._comboDiv.removeClass(wijCSS.comboboxCss + " " + wijCSS.widget + " " + wijCSS.helperClearFix);
                    self._comboDiv.removeAttr("role");
                    self._input.insertBefore(self._comboDiv);
                    self._comboDiv.children("." + wijCSS.comboboxWrapperCss).remove();
                } else {
                    ele.css("width", self._oldWidth);
                    ele.removeClass(wijCSS.comoboboxInputCss);
                    ele.removeAttr("autocomplete").removeAttr("role").removeAttr("aria-wijcombobox").removeAttr("aria-haspopup");
                    ele.insertBefore(self._comboElement);
                    ele.css("padding", "");
                }

                if (self.options.ensureDropDownOnBody) {
                    $(window).unbind("resize.wijcombobox");
                }

                self._comboElement.remove();
                self.menu.destroy();
                self.menu.element.remove();
                _super.prototype.destroy.call(this);
            };

            wijcombobox.prototype._setOption = function (key, value) {
                var self = this, o = self.options, ele = self._comboElement, input = self.element, items, inputWrapper = input.parent(), cancelSelect, wijCSS = this.options.wijCSS, label = self._label, triggerPadding, oldSelectedIndex = o.selectedIndex, newSelectedItem, oldDisabled = o.disabled, oldSelectedItem = null, triggerWidth = 0;

                if (self._triggerArrow) {
                    triggerWidth = self._triggerArrow.outerWidth();
                }

                _super.prototype._setOption.call(this, key, value);
                if (key === "labelText") {
                    self._updateLabelTextElement();
                    label = self._label;
                    if (label && label.length > 0) {
                        if (self._triggerArrow !== undefined) {
                            triggerPadding = self._triggerArrow[0].offsetWidth;
                        }
                        if (o.triggerPosition === "right") {
                            if (label !== undefined) {
                                label.css("left", "");
                                label.css("right", triggerPadding);
                            }
                        } else {
                            if (label !== undefined) {
                                label.css("right", "");
                                label.css("left", triggerPadding);
                            }
                        }
                        self.repaint();
                    }
                } else if (key === "showTrigger") {
                    self._showTrigger();
                    if (!o.showTrigger && self.element.is("select")) {
                        input.width(input.width() + triggerWidth);
                    }
                } else if (key === "triggerPosition") {
                    input.width(input.width() + triggerWidth);
                    self._showTrigger();
                } else if (key === "selectionMode") {
                    self.menu._setOption("selectionMode", value);
                } else if (key === "isEditable") {
                    if (value) {
                        //update for 27917
                        self._input.removeAttr("readonly");

                        //update for add issue: when iseditable is false
                        //click the all the combobox, the dropdown list will open
                        $("." + wijCSS.comboboxWrapperCss, self._comboElement[0]).bind("click", function () {
                            self._triggerClick();
                        });
                    } else {
                        //update for 27917
                        self._input.attr("readonly", "readonly");
                        $("." + wijCSS.comboboxWrapperCss, self._comboElement[0]).unbind("click");
                    }
                } else if (key === "data" || key === "dataSource") {
                    self._initInnerData();
                    self._setSelectedIndex(o.selectedIndex);
                    if ($.isArray(self.innerData)) {
                        self.listHasCreated = false;
                        self._createDropDownList();
                    } else {
                        try  {
                            self.innerData.loaded = function (e, data) {
                                if (e === null) {
                                    self.items = null;
                                } else {
                                    self.items = $.isArray(e) ? e : e.items;
                                }
                                self.listHasCreated = false;
                                self._createDropDownList();
                            };
                            self.innerData.load(null);
                        } catch (e) {
                        }
                    }

                    if (o.selectedIndex !== -1) {
                        oldSelectedItem = items ? items[oldSelectedIndex] : null;
                        items = self.innerData;

                        self._triggerChangeEvents(oldSelectedItem, oldSelectedIndex);
                    }
                    self._keypress = false;
                } else if (key === "selectedIndex") {
                    if (value === oldSelectedIndex) {
                        return;
                    }
                    if (value === null || value === undefined) {
                        value = -1;
                    }
                    if (self.innerData === null) {
                        items = null;
                    } else {
                        items = $.isArray(self.innerData) ? self.innerData : self.innerData.items;
                    }

                    if (o.selectionMode === "single") {
                        oldSelectedItem = items ? items[oldSelectedIndex] : null;
                        if (value > -1) {
                            if (items && items[value] !== null) {
                                newSelectedItem = items[value];
                            }
                            cancelSelect = self._triggerSelectedIndexChanging(oldSelectedItem, newSelectedItem, oldSelectedIndex, value);
                            if (cancelSelect) {
                                o.selectedIndex = oldSelectedIndex;
                                return;
                            }

                            // if the data option is reset and the self.selectedItem is underfined,
                            // need use oldSelectedIndex to clear selection
                            if (oldSelectedIndex !== null && oldSelectedIndex !== -1 && oldSelectedIndex !== undefined && oldSelectedItem) {
                                oldSelectedItem.selected = false;
                                this.menu.unselectItems(oldSelectedIndex);
                                if (oldSelectedItem.element) {
                                    oldSelectedItem.element.removeClass("wijmo-wijcombobox-selecteditem");
                                }
                            }

                            if (items && items[value] !== null) {
                                self.selectedItem = items[value];
                                if (self.selectedItem) {
                                    self.selectedItem.selected = true;
                                    self._setInputText(self.selectedItem.label);
                                    o.selectedValue = self.selectedItem.value;
                                    o.inputTextInDropDownList = true;
                                    //o.text = self._input.val();for #33666 issue
                                }
                            }
                        } else if (value <= -1 || !value) {
                            cancelSelect = self._triggerSelectedIndexChanging(oldSelectedItem, null, oldSelectedIndex, value);
                            if (cancelSelect) {
                                o.selectedIndex = oldSelectedIndex;
                                return;
                            }
                            o.inputTextInDropDownList = false;
                            self._clearSelection();
                        }

                        self._triggerChangeEvents(oldSelectedItem, oldSelectedIndex);
                    } else {
                        if (!$.isArray(oldSelectedIndex)) {
                            oldSelectedIndex = [oldSelectedIndex];
                        }

                        $.each(oldSelectedIndex, function (i, index) {
                            if (self.menu.items && self.menu.items[index]) {
                                self.menu.items[index].selected = false;
                            }
                        });
                        this.menu.unselectItems(oldSelectedIndex);
                        self.selectedItems = [];
                        self.selectedItem = null;
                        if (!$.isArray(value)) {
                            value = [value];
                            o[key] = value;
                        }
                        self._setSelectedIndex(value);
                        $.each(value, function (i, index) {
                            if (self.menu.items && self.menu.items[index]) {
                                self.menu.items[index].selected = true;
                            }
                        });

                        self._triggerChangeEvents(null, null);
                    }
                } else if (key === "selectedValue") {
                    items = self.items;
                    if (!items) {
                        items = self.innerData;
                    }
                    if (o.selectionMode === "single") {
                        oldSelectedItem = items ? items[oldSelectedIndex] : null;
                    } else {
                        oldSelectedIndex = null;
                    }

                    if (value != null) {
                        if (self.selectedItem && self.selectedItem.selected !== undefined) {
                            self.selectedItem.selected = false;
                        }

                        if (items) {
                            if (this.options.selectedIndex > -1 && items.length > this.options.selectedIndex && items[this.options.selectedIndex]) {
                                items[this.options.selectedIndex].selected = false;
                                this.menu.deactivate();
                                this.menu.unselectItems(this.options.selectedIndex);
                                self.menu.items[this.options.selectedIndex].selected = false;
                            }
                            $.each(items, function (index, item) {
                                if (items[index].value === value) {
                                    self.selectedItem = items[index];
                                    self.selectedItem.selected = true;
                                    self.menu.items[index].selected = true;

                                    //self._input.val(self.selectedItem.label);
                                    self._setInputText(self.selectedItem.label);
                                    if (o.selectionMode === "single") {
                                        o.selectedIndex = index;
                                    } else {
                                        o.selectedIndex = [index];
                                    }
                                    o.inputTextInDropDownList = true;

                                    //o.text = self._input.val();for #33666 issue
                                    return false;
                                }
                            });
                        }
                    } else if (o.selectionMode === "single") {
                        o.inputTextInDropDownList = false;
                        self._clearSelection();
                    }

                    self._triggerChangeEvents(oldSelectedItem, oldSelectedIndex);
                } else if (key === "text") {
                    if (o.forceSelectionText && self._checkTextInItems(value) === -1) {
                        return;
                    }

                    //self._input.val(value);
                    self._setInputText(value);
                } else if (key === "selectElementWidthFix") {
                    self._showTrigger();
                } else if (key === "adjustComboWidth" || key === "dropdownWidth") {
                    self._handleAdjustWidthOptions();
                }
            };

            wijcombobox.prototype._handleAdjustWidthOptions = function () {
                var self = this, o = self.options, width = 0, safeWidth = 25;
                if (o.adjustComboWidth === true) {
                    if (o.dropdownWidth === "auto" || o.dropdownWidth === "fit") {
                        width = self._getMaxListItemWidth() + safeWidth; // add a safe amount to avoid word wrap in case of v-scrollbar appears.
                    } else if (typeof o.dropdownWidth === "number") {
                        width = o.dropdownWidth;
                    }
                    self._setComboWidth(width);
                    self._setDropdownWidth(width);
                } else {
                    if (o.dropdownWidth === "auto") {
                        width = self._getComboWidth();
                    } else if (o.dropdownWidth === "fit") {
                        width = Math.max(self._getComboWidth(), self._getMaxListItemWidth() + safeWidth);
                    } else if (typeof o.dropdownWidth === "number") {
                        width = o.dropdownWidth;
                    }
                    self._setDropdownWidth(width);
                }
                return width;
            };

            wijcombobox.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._toggleDisableCombobox(true);
            };

            wijcombobox.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._toggleDisableCombobox(false);
            };

            wijcombobox.prototype._toggleDisableCombobox = function (disabled) {
                var wijCSS = this.options.wijCSS;
                this._input.prop("disabled", disabled);
                this._comboElement.toggleClass("wijmo-wijcombobox-disabled " + wijCSS.stateDisabled, disabled);
                if (this._comboDiv) {
                    this._input.toggleClass("wijmo-wijcombobox-disabled " + wijCSS.stateDisabled, disabled);
                }
                if (disabled) {
                    this.close();
                }
            };

            wijcombobox.prototype._setSelectedIndex = function (value) {
                var self = this, o = self.options, selectedItems = [], data = self.innerData;
                if (value === null || value === undefined) {
                    return;
                }

                if (value === -1) {
                    self.selectedItem = null;
                    o.selectedIndex = -1;
                    o.selectedValue = null;
                    if (o.text) {
                        self._input.val(o.text);
                    } else {
                        self._input.val("");
                    }
                } else {
                    if ($.isArray(value)) {
                        self.selectedItems = [];
                        $.each(value, function (i, val) {
                            if (data && data[val] !== null && data[val] !== undefined) {
                                data[val].selected = true;
                                selectedItems.push(data[val]);
                            }
                        });
                        self.selectedItems = selectedItems;
                        self._selectedItemsToInputVal(selectedItems);
                    } else {
                        if (data && data[value] !== null && data[value] !== undefined) {
                            data[value].selected = true;
                            self._input.val(data[value].label);
                            self.selectedItem = data[value];
                        } else if (data && $.isArray(data) && value > data.length - 1) {
                            o.selectedIndex = -1;
                            self._input.val("");
                        }
                    }
                }
                o.text = self._input.val();
            };

            /** Searches the wijcombobox drop-down list for the specified value.
            * @param {string} value Text to search in the drop-down list.
            * @param {object} eventObj The jquery event object.
            */
            wijcombobox.prototype.search = function (value, eventObj, filtering) {
                if (typeof filtering === "undefined") { filtering = true; }
                var self = this, o = self.options, datasource = self.innerData, d, isBind;

                window.clearTimeout(self.closing);
                d = {
                    value: value,
                    e: eventObj,
                    self: self
                };

                // load data when data is not loaded yet
                // or datasource is using a proxy to obtain data.
                if (datasource !== null || self._comboDiv) {
                    //update 2012/9/14
                    isBind = self._isBind();

                    // check index will skip search event
                    if (eventObj !== "checkindex") {
                        if (self._trigger("search", eventObj, { datasrc: datasource, term: d }) === false) {
                            return;
                        }
                        datasource = self.innerData;
                    }

                    if ($.isArray(datasource) || isBind || self._comboDiv || (!self._usingRemoteData() && datasource.items && $.isArray(datasource.items) && datasource.items.length > 0)) {
                        self._hideShowArrow(false);
                        self._onListLoaded(datasource, d, filtering);
                    } else if (!isBind && $.isArray(o.dataSource)) {
                        return;
                    } else {
                        if (self._usingRemoteData() && eventObj !== undefined && value.length < o.minLength) {
                            return;
                        }
                        self._hideShowArrow(false);

                        // update for: datasource loaded event don't fired
                        // in combobox
                        datasource.loaded = function (e, data) {
                            //need to re initialize the dropdown list
                            //datasource condition the data is get by proxy
                            self.listHasCreated = false;
                            self._createDropDownList(e);

                            //self._onListLoaded(self.items, data);
                            self._onListLoaded(e, data, filtering);
                            if (self.originalDataSourceLoaded) {
                                self.originalDataSourceLoaded(e, data);
                            }
                        };
                        datasource.load(d);
                    }
                }
            };

            /** Get the select item(s) in combobox.
            * @remarks
            *        when using multiple mode, it will return array object.
            *        If no item is selected, it will return null or empty array.
            * @returns {array} array object or empty array.
            */
            wijcombobox.prototype.getSelectedItems = function () {
                var o = this.options;
                if (o.selectionMode === "single") {
                    return this.selectedItem;
                } else {
                    return this.selectedItems;
                }
            };

            //for bind data
            wijcombobox.prototype._isBind = function () {
                var o = this.options, data = o.data;

                if (data !== null && data.label && data.label.bind) {
                    return true;
                }
                return false;
            };

            wijcombobox.prototype._getMappingItems = function () {
                var o = this.options, dataSource = o.dataSource, data = o.data, mappingItems, labelKey, valueKey;
                if (!dataSource || !data) {
                    return null;
                }

                if (!data.label || !data.label.bind || !data.value || !data.value.bind) {
                    return null;
                }

                labelKey = data.label.bind;
                valueKey = data.value.bind;

                //1.Array
                if (dataSource && dataSource.length !== 0) {
                    mappingItems = [];

                    $.each(dataSource, function (i, item) {
                        mappingItems.push({ label: item[labelKey], value: item[valueKey] });
                    });

                    return mappingItems;
                }
                return null;
            };

            //end for bind data
            wijcombobox.prototype._clearSelection = function (notfiredTextChanged) {
                var self = this, o = self.options;

                if (o.selectionMode === "single") {
                    if (self.selectedItem) {
                        self.selectedItem.selected = false;
                        self.selectedItem = null;
                    }
                } else {
                    if (self.selectedItems) {
                        $.each(self.selectedItems, function (index, item) {
                            if (item && item.selected) {
                                item.selected = false;
                            }
                        });
                        self.selectedItem = null;
                        self.selectedItems = [];
                    }
                }
                o.selectedValue = null;

                //self._input.val("");
                self._setInputText("", notfiredTextChanged);
                //o.text = self._input.val();for #33666 issue
            };

            wijcombobox.prototype._usingRemoteData = function () {
                var o = this.options.data, r = false;
                if (!$.isArray(o) && o !== null && o.proxy) {
                    r = true;
                }
                return r;
            };

            wijcombobox.prototype._hideShowArrow = function (show) {
                // hide arrow to show
                var self = this, input = self.element, arrow = self._triggerArrow;

                if (arrow !== undefined) {
                    arrow[show ? "show" : "hide"]();
                }
                input[show ? "removeClass" : "addClass"]("wijmo-wijcombobox-loading");
            };

            wijcombobox.prototype._onListLoaded = function (datasource, data, filtering) {
                var self = data.self, ele = self._input, o = self.options, wijCSS = this.options.wijCSS, searchTerm = data.value, items, idx, itemsToRender, olditem, oldIndex;

                if (!datasource) {
                    items = null;
                } else {
                    items = $.isArray(datasource) ? datasource : datasource.items;
                }

                self.items = items;
                if (data.e === "checkindex") {
                    idx = o.selectedIndex;

                    if (o.selectionMode === "multiple" && $.isArray(idx)) {
                        self.selectedItems = [];
                        $.each(idx, function (i, n) {
                            var itm = items[n];
                            itm.selected = true;
                            self.selectedItems.push(itm);
                        });
                        self._selectedItemsToInputVal(self.selectedItems);
                    } else {
                        items[idx].selected = true;
                        self.selectedItem = items[idx];
                        ele.val(self.selectedItem.label);
                    }
                    self._hideShowArrow(true);
                    return;
                }

                // fixed the issue 42893, if the selected item's label is empty, here should
                // not reset the selection.
                if (filtering && ele.val() === "") {
                    olditem = this.selectedItem;
                    oldIndex = o.selectedIndex;
                    self._clearSelection(true);
                    self._setSelectedIndex(-1);
                    self._triggerChangeEvents(olditem, oldIndex);
                    self.menu.deactivate();
                }

                // only fileter result when using local data.
                if (!self._usingRemoteData() && items) {
                    /*update for improving performance
                    self._filter(items, searchTerm);
                    itemsToRender = $.grep(items, function (item1) {
                    return !o.autoFilter || item1.match;
                    });*/
                    itemsToRender = items;
                } else {
                    self._topHit = null;
                    itemsToRender = items;
                }
                if ((itemsToRender && itemsToRender.length > 0) || self._comboDiv) {
                    // open dropdown list
                    if (self._openlist(itemsToRender, data, searchTerm)) {
                        // move the trigger dropdown open event to openlist.
                        //self._trigger("open");
                        self._addInputFocus(true, wijCSS.stateFocus);
                    }
                } else {
                    self.close(null, true);
                }
                self._hideShowArrow(true);
            };

            /** Closes drop-down list.
            * @param {?EventObj} event The jquery event object.
            * @param {?boolean} skipAnimation A value indicating whehter to skip animation.
            */
            wijcombobox.prototype.close = function (event, skipAnimation) {
                var self = this, menu, wijCSS = this.options.wijCSS, hidingAnimation, hidingStyle;
                menu = self.menu;

                self._dropDownHeight = menu.element.outerHeight();
                self._dropDownWidth = menu.element.outerWidth();

                window.clearTimeout(self.closing);

                // test parent element is need, hidingAnimation
                // because some effect will wrap the target element.
                if (menu.element.is(":visible") && !menu.element.is(":animated") && !menu.element.parent().is(":animated")) {
                    self._trigger("close", event);
                    menu.deactivate();
                    hidingAnimation = self.options.hidingAnimation;

                    //add for size animation by wuhao 2011/7/16
                    if (hidingAnimation && (hidingAnimation.effect === "size" || hidingAnimation.animated === "size")) {
                        hidingAnimation.options = $.extend({
                            to: {
                                width: 0,
                                height: 0
                            }
                        }, hidingAnimation.options);
                    }
                    hidingStyle = menu.element.attr("style");

                    //end for size animation
                    if (skipAnimation !== true && hidingAnimation) {
                        menu.element.hide(hidingAnimation.effect || hidingAnimation.animated, hidingAnimation.options, hidingAnimation.speed || hidingAnimation.duration, function () {
                            menu.element.removeAttr("style").attr("style", hidingStyle).hide();
                            if (hidingAnimation.callback) {
                                hidingAnimation.callback.apply(this, arguments);
                            }
                        });
                    } else {
                        menu.element.hide();
                    }

                    self._addInputFocus(false, wijCSS.stateFocus);

                    //$(document).unbind("click", self.closeOnClick);
                    $(document).unbind("mouseup", self.closeOnClick);
                    self._inputBlurCausedByListItemClick = false;
                }
            };

            wijcombobox.prototype._change = function () {
                // TODO: finish _change event.
                var self = this, o = self.options, f = o.forceSelectionText, m = o.selectionMode, ele = self._input, t = ele.val(), itm = self.selectedItem, items = self.selectedItems, oldIndex, innerData = self.innerData, inputIndex = -1;

                oldIndex = (o.selectedIndex || o.selectedIndex > -1) ? o.selectedIndex : -1;

                if (f) {
                    if (m === "single") {
                        if (itm !== null && itm !== undefined) {
                            if (itm.label !== t) {
                                //ele.val(itm.label);
                                self._setInputText(itm.label);
                            }
                        } else {
                            //ele.val("");
                            self._setInputText("");
                        }
                    }
                } else {
                    //update for inputed non-listed value,
                    //update selected index and selected value
                    if (m === "single") {
                        var labelNotEqualsT = false;
                        if (itm !== null && itm !== undefined) {
                            labelNotEqualsT = (itm.label) ? (itm.label.toString() !== t) : ("" !== t);
                        }

                        if ((!itm && t !== "") || labelNotEqualsT) {
                            if (self.selectedItem !== null && self.selectedItem !== undefined) {
                                self.selectedItem.selected = false;

                                self.menu.unselectItems(o.selectedIndex);
                            }
                            inputIndex = self._checkTextInItems(t);
                            if (inputIndex === -1) {
                                self.selectedItem = null;
                                o.selectedIndex = -1;
                                o.selectedValue = null;
                                o.inputTextInDropDownList = false;
                            } else {
                                if (innerData) {
                                    innerData = $.isArray(innerData) ? innerData : innerData.items;
                                    self.selectedItem = innerData[inputIndex];
                                    o.selectedIndex = inputIndex;
                                    o.selectedValue = self.selectedItem.value;
                                    o.inputTextInDropDownList = true;
                                }
                            }

                            //o.text = self._input.val();
                            self._setInputText(self._input.val());

                            self._triggerChangeEvents(itm, oldIndex);
                        } else {
                            self._setInputText(t);
                        }
                    }
                }

                //Todo: when input something to combobox,
                //the text will restore in multiple mode
                //Maybe it need to be adjusted.
                if (m === "multiple") {
                    //update for add issue: when iseditable is false
                    //click the all the combobox, the dropdown list will open
                    //self._selectedItemsToInputVal(self.selectedItems);
                    if (!self.selectedItems || self.selectedItems.length === 0) {
                        items = [itm];
                    }
                    self._selectedItemsToInputVal(items);
                }
            };

            wijcombobox.prototype._checkTextInItems = function (text) {
                var data = this.items, index = -1;

                if (text && !!data && !!data.length) {
                    $.each(data, function (i, item) {
                        if (item && item.label && item.label.toString() === text) {
                            index = i;
                            return false;
                        }
                    });
                }

                return index;
            };

            wijcombobox.prototype._openlist = function (items, data, searchTerm) {
                var self = data.self, o = self.options, eventObj = data.e, keypress, pressDELETEKey, textWidth, menuElement = self.menu.element, verticalBorder = 2, headerHeight = 0, dropDownHeight, origCloseOnClick, h, showingAnimation, showingStyle, showingSize, inputValueLength = $.trim(self._input.val()).length, keyCode = wijmo.getKeyCodeEnum(), zIndex, needHighlightMatching = false, innerData, updatePositionTimer, alreadyOpen = false;

                keypress = self._keypress = !!eventObj;
                pressDELETEKey = (eventObj !== undefined) && (eventObj.keyCode === keyCode.BACKSPACE || eventObj.keyCode === keyCode.DELETE);

                alreadyOpen = menuElement.is(":visible");

                if ($.ui) {
                    menuElement.zIndex(self.element.zIndex() + 100);
                } else {
                    zIndex = parseInt(self.element.css("zIndex"), 10);
                    if (isNaN(zIndex)) {
                        zIndex = 0;
                    }
                    menuElement.css("zIndex", zIndex + 100);
                }

                //update for 32309 issue
                if (!self.listHasCreated) {
                    self._createDropDownList();
                }

                if (self.innerData) {
                    if ($.isArray(self.innerData)) {
                        innerData = self.innerData;
                    } else {
                        innerData = self.innerData.items;
                    }
                }
                if (!innerData || innerData.length === 0) {
                    return false;
                }

                /* for improving performance
                if (self._comboDiv) {
                //update for case 20689 at 2012/4/11
                if (!self.listHasCreated) {
                //update for issue 24130 at 2012/7/20
                //self.menu.setTemplateItems(items);
                self.menu.setTemplateItems(o.data);
                self.menu.renderList();
                self.listHasCreated = true;
                }
                } else {
                if (!self.listHasCreated) {
                self.menu.setItems(items);
                self.menu.renderList();
                self.listHasCreated = true;
                }
                }*/
                //update for issue 24130 at 2012/7/20
                if (!self._usingRemoteData() && searchTerm !== null && searchTerm !== undefined) {
                    needHighlightMatching = self._keypress && o.isEditable && o.columns.length === 0 && o.highlightMatching && inputValueLength > 0;

                    //if down key press condition for 33017 issue at 2013/1/8
                    if (eventObj && eventObj.keyCode === keyCode.DOWN && searchTerm.length === 0 && inputValueLength > 0) {
                        self._topHit = self.menu.filterItems(self._input.val(), false, needHighlightMatching);
                    } else {
                        self._topHit = self.menu.filterItems(searchTerm, o.autoFilter, needHighlightMatching);
                    }

                    //can't find the matched items
                    if (self._topHit === null && self.innerData && $("li[wijhidden]", self.menu.element).length === self.innerData.length) {
                        self.close(null, true);
                        return false;
                    }
                }

                // show dropdown
                menuElement.show();
                textWidth = self._handleAdjustWidthOptions();

                dropDownHeight = o.dropdownHeight;

                if (menuElement.children(".wijmo-wijsuperpanel-header")) {
                    headerHeight = menuElement.children(".wijmo-wijsuperpanel-header").outerHeight() || 0;
                }

                //end for fixing bug 15778
                h = self._menuUL.outerHeight() + verticalBorder + headerHeight;

                if (h < dropDownHeight) {
                    // The exist scrollbar will be removed, width of ul element will increase, it means that the height of ul also will change.
                    // In this case, increase ul width firstly, and get a correct ul height for the wijlist element.
                    self._menuUL.setOutWidth(textWidth);
                    h = self._menuUL.outerHeight() + verticalBorder + headerHeight;
                } else {
                    h = dropDownHeight;
                }

                menuElement.setOutHeight(h);
                self.menu.refreshSuperPanel();
                self._positionList();
                if (!keypress && self.selectedItem !== undefined) {
                    self.menu.activate(null, self.selectedItem, true);
                }
                if (keypress && !pressDELETEKey) {
                    if (o.isEditable) {
                        self._runAutoComplete();
                    } else {
                        self.menu.activate(null, self._topHit, true);
                    }
                } else {
                    showingAnimation = self.options.showingAnimation;
                    if (o.showingAnimation !== null && !pressDELETEKey) {
                        self.menu.element.hide();
                        showingSize = {
                            from: { width: 0, height: 0 },
                            to: {
                                width: self._dropDownWidth || menuElement.outerWidth(),
                                height: self._dropDownHeight || menuElement.outerHeight()
                            }
                        };
                        if (showingAnimation && (showingAnimation.effect === "size" || showingAnimation.animated === "size")) {
                            showingAnimation.options = $.extend(showingSize, showingAnimation.options);
                        }
                        showingStyle = menuElement.attr("style");

                        //end for size animation
                        menuElement.show(showingAnimation.effect || showingAnimation.animated, showingAnimation.options, showingAnimation.speed || showingAnimation.duration, function () {
                            //add for size animation by wuhao 2011/7/16
                            menuElement.removeAttr("style").attr("style", showingStyle).show();

                            //end for size animation
                            if (showingAnimation.callback) {
                                showingAnimation.callback.apply(this, arguments);
                            }

                            if ($.browser.msie) {
                                menuElement.css("filter", "");
                            }
                        });
                    }
                }
                if (!self.hasOwnProperty("closeOnClick")) {
                    origCloseOnClick = self.closeOnClick;
                    self.closeOnClick = function (e) {
                        return origCloseOnClick(e);
                    };
                }

                if (!alreadyOpen) {
                    self._trigger("open");
                }

                //update for issue 2012/6/14: place combobox in expander
                //open the dropdown, then collapse the expander
                //the dropdown is still open
                //$(document).bind("click", self, self.closeOnClick);
                $(document).bind("mouseup", self, self.closeOnClick);

                if (o.ensureDropDownOnBody) {
                    $(window).bind("resize.wijcombobox", function () {
                        //maybe need to update the position of dropdown
                        //because combobox may change its position after window resize.
                        if (updatePositionTimer) {
                            clearTimeout(updatePositionTimer);
                        }
                        updatePositionTimer = setTimeout(function () {
                            self._positionList();
                        }, 100);
                    });
                }
                return true;
            };

            /** @ignore */
            wijcombobox.prototype.closeOnClick = function (e) {
                var self = e.data, wijCSS = self.options.wijCSS, offset, t = e.target;

                if (!$.contains(self._comboElement[0], t) && !$.contains(self.menu.element[0], t)) {
                    if ($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                        offset = self.menu.element.offset();
                        if (e.pageX < offset.left || e.pageX > offset.left + self.menu.element.width() || e.pageY < offset.top || e.pageY > offset.top + self.menu.element.height()) {
                            self.close();
                        }
                    } else {
                        self.close();
                    }
                    $("." + wijCSS.comboboxWrapperCss, self._comboElement[0]).removeClass(wijCSS.stateHover).removeClass(wijCSS.stateFocus);
                    $("." + wijCSS.comboboxTriggerCss, self._comboElement[0]).removeClass(wijCSS.stateHover).removeClass(wijCSS.stateFocus);
                }

                if (self.options.ensureDropDownOnBody) {
                    $(window).unbind("resize.wijcombobox");
                }
            };

            wijcombobox.prototype._positionList = function () {
                var self = this, defaultPosition, positionOptions = self.options.dropDownListPosition;
                defaultPosition = {
                    my: "left top",
                    at: "left bottom",
                    of: self._comboElement,
                    collision: "none"
                };
                defaultPosition = $.extend(defaultPosition, positionOptions);
                self.menu.element.position(defaultPosition);
            };

            wijcombobox.prototype._runAutoComplete = function () {
                var self = this, ele = self._input, topHit = self._topHit, oldText, fullText, start, end;
                if (!self.options.autoComplete || topHit === null || topHit === undefined) {
                    return;
                }
                self.menu.activate(null, topHit, true);
                oldText = ele.val();
                fullText = topHit.label;
                ele.val(fullText);
                start = oldText.length;
                end = fullText.length;
                self._selectText(start, end, ele);
            };

            wijcombobox.prototype._selectText = function (start, end, input) {
                var v = input.val(), inputElement = input.get(0), range;
                if (v.length > 0) {
                    if (inputElement.setSelectionRange !== undefined) {
                        inputElement.setSelectionRange(start, end);
                    } else if (inputElement.createTextRange !== undefined) {
                        range = inputElement.createTextRange();
                        range.moveStart("character", start);
                        range.moveEnd("character", end - v.length);
                        range.select();
                    }
                }
            };

            wijcombobox.prototype._move = function (direction, event) {
                if (!this.menu.element.is(":visible")) {
                    this.search("", event);
                    return;
                }
                if (this.menu.first() && /^previous/.test(direction) || this.menu.last() && /^next/.test(direction)) {
                    //update for fixing bug 15964 by wuhao
                    //this.menu.deactivate();
                    //end for bug 15964.
                    return;
                }
                this.menu[direction](event);
            };

            wijcombobox.prototype._escapeRegex = function (value) {
                if (value === undefined) {
                    return value;
                }
                return value.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1");
            };

            wijcombobox.prototype._filter = function (array, searchTerm) {
                var term1 = this._escapeRegex(searchTerm), matcher, topHit = null;

                /// TODO : start with or contains and case sensitive.
                if (!array) {
                    return null;
                }
                matcher = new RegExp(term1, "i");
                $.each(array, function (index, item) {
                    if (term1 === undefined || term1.length === 0) {
                        item.match = true;
                        return;
                    }
                    var matchResult = matcher.exec(item.label);
                    if (matchResult === null) {
                        item.match = false;
                    } else {
                        if (topHit === null && matchResult.index === 0) {
                            topHit = item;
                        }
                        item.match = matchResult.index >= 0;
                    }
                });
                this._topHit = topHit;
                return array;
            };

            wijcombobox.prototype._getMaxListItemWidth = function () {
                var $div = $("<div>").addClass("wijmo-wijcombobox-list ui-widget").appendTo(document.body), $ul = this.menu.element.find("ul").clone().css("width", "").appendTo($div), width = $ul.outerWidth();

                $div.remove();
                return width;
            };

            wijcombobox.prototype._setComboWidth = function (width) {
                this._comboElement.width(width);
                if (this._triggerArrow) {
                    width -= this._triggerArrow.outerWidth();
                }
                this._input.width(width);
            };

            wijcombobox.prototype._setDropdownWidth = function (width) {
                var $list = this.menu.element, padding = $list.css("padding");
                $list.css("padding", "0px");
                $list.setOutWidth(width);
                $list.css("padding", padding);
            };

            wijcombobox.prototype._getComboWidth = function () {
                return this._comboElement.outerWidth();
            };

            wijcombobox.prototype._getDropdownWidth = function () {
                return this.menu.element.outerWidth();
            };
            return wijcombobox;
        })(wijmo.wijmoWidget);
        combobox.wijcombobox = wijcombobox;

        var wijcombobox_options = (function () {
            function wijcombobox_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijcombobox')";
                /**
                * @ignore
                */
                this.wijCSS = {
                    comboboxCss: "wijmo-wijcombobox",
                    comboboxWrapperCss: "wijmo-wijcombobox-wrapper",
                    comoboboxInputCss: "wijmo-wijcombobox-input",
                    comboboxListCss: "wijmo-wijcombobox-list",
                    comboboxTriggerCss: "wijmo-wijcombobox-trigger"
                };
                /** wijdataview to which this wijcombobox is bound.
                * @type {wijdataview}
                * @remarks
                *   This option is used if this wijcombobox is bound to a wijdataview.
                *   In that case, you can also specify a mapping option to select the properties to bind to,
                *   and the data option returns an array of objects containing
                *   value and label property values determined by that mapping.
                */
                this.dataSource = null;
                /** A value that specifies the underlying data source provider of wijcombobox.
                * @type {wijdatasource|Array}
                * @remarks
                *   This option could either be a wijdatasource object
                *   or an Object Array containing an item such as
                *   {label: "label text", value: "value"}.
                * @example
                *        var testArray = [
                *            {label: 'c++',value: 'c++'},
                *            {label: 'java',value: 'java'},
                *            {label: 'php',value: 'php'}
                *        ];
                *        $("#tags").wijcombobox({
                *            data: testArray
                *        });
                */
                this.data = null;
                /** A value that specifies the text in the wijcombobox label.*/
                this.labelText = null;
                /** A value that determines the minimum length of text
                *   that can be entered in the wijcombobox text box to issue an AJAX request.
                */
                this.minLength = 4;
                /** A value that determines the duration (in milliseconds) of the time
                *   to delay before autocomplete begins after typing stops.
                */
                this.delay = 300;
                /** A value that specifies the animation options for a drop-down list
                *   when it is visible.
                * @example
                *       var animationOptions = {
                *           animated: "Drop",
                *           duration: 1000
                *       };
                *       $("#tags").wijcombobox("option", "showingAnimation", animationOptions)
                });
                */
                this.showingAnimation = null;
                /** A value that specifies the animation options such as the animation effect and
                *   duration for the drop-down list when it is hidden.
                * @example
                *       var animationOptions = {
                *           animated: "Drop",
                *           duration: 1000
                *       };
                *       $("#tags").wijcombobox("option", "hidingAnimation", animationOptions)
                */
                this.hidingAnimation = null;
                /** A value that determines whether to show the trigger of wijcombobox.*/
                this.showTrigger = true;
                /** A value that specifies the position of the drop-down list trigger.
                * @remarks
                *        possible value: right or left
                */
                this.triggerPosition = "right";
                /**  A value that specifies the height of the drop-down list.
                * @remarks
                *       If the total height of all items is less than the value of this option,
                *       it will use the total height of items as the height of the drop-down list.
                */
                this.dropdownHeight = 300;
                /** A value that specifies the width of the drop-down list.
                * @type {number|string}
                * @remarks
                *       When this option is set to "auto", the width of the drop-down
                *       list is equal to the width of wijcombobox.
                *       When this option is set to "fit", the width of the drop-down
                *       list will fit the widest item independently.
                */
                this.dropdownWidth = "auto";
                /** A value that determines whether to select the item when the item gains focus or is activated. */
                this.selectOnItemFocus = false;
                /** A value determines whether to shorten the drop-down list items
                *   by matching the text in the textbox after typing.
                */
                this.autoFilter = true;
                /** A value that determines whether to start the auto-complete
                *   function after typing in the text if a match exists.
                */
                this.autoComplete = true;
                /** A value that determines whether to highlight the keywords in an item.
                * @remarks
                *       If "abc" is typed in the textbox,
                *       all "abc" matches are highlighted in the drop-down list.
                */
                this.highlightMatching = true;
                /** A value that specifies the position options of the drop-down list.
                *   The default value of the "of" options is the input of wijcombobox.
                * @example
                *    var positionOptions = {my:"right", at:"top"};
                *   //specifies the position options of the drop-down list on "right, top" of combobox.
                *   $("#tags").wijcombobox("option", "dropDownListPosition", positionOptions)
                */
                this.dropDownListPosition = {};
                /** An array that specifies the column collections of wijcombobox.
                * @example
                *       $("#tags").wijcombobox("option", "columns", [
                *           {name: 'header1', width: 150},
                *           {name: 'header2', width: 150},
                *           {name: 'header3', width: 150}
                *       ]);
                */
                this.columns = [];
                /** A value that specifies the selection mode of wijcombobox.
                * @remarks
                *       Possible options are: "single" and "multiple".
                */
                this.selectionMode = "single";
                /** A value that specifies the separator for
                *   the multiple selected items text in the textbox.
                */
                this.multipleSelectionSeparator = ",";
                /** A value that determines whether to check the input text against
                *   the text of the selected item when the focus blurs.
                * @remarks
                *       If the text does not match any item, input text will restore
                *       to text the selected item or empty if no item is selected.
                */
                this.forceSelectionText = false;
                /** A function called when any item in list is selected.
                * @event
                * @dataKey {element} element LI element with this item.
                * @dataKey {object} list wijlist instance.
                * @dataKey {string} label Label of item.
                * @dataKey {object} value Value of item.
                * @dataKey {string} text Could be set in handler to override rendered label of item.
                */
                this.select = null;
                /** A value that determines whether input is editable.*/
                this.isEditable = true;
                /** A value that specifies the index of the item to select when using single mode.
                * @type {number|array}
                * @remarks
                *       If the selectionMode is "multiple", then this option could be set
                *       to an array of Number which contains the indices of the items to select.
                *       If no item is selected, it will return -1.
                * @example
                *  //To get the selected item using the selected index:
                *      var selectedIndex = $("# tags ").wijcombobox("option","selectedIndex");
                *      var selectedItem = $("# tags ").wijcombobox("option","data")[selectedIndex];
                *  // To set the selected item using the selected index:
                *      $("#tags").wijcombobox("option"," selectedIndex", 5);
                */
                this.selectedIndex = -1;
                /** A value that specifies the value of the item to select when using single mode.
                * @type {number|string|object}
                * @remarks
                *       If no item is selected, it will return null.
                */
                this.selectedValue = null;
                /** A value that specifies the input text of the combobox is in dropdown list or not.
                * @remarks
                *       It's readonly option, if user typed text is not in dropdown list, it returns false;
                *       if user selects a item form the dropdown list or typed text in dropdown list, it returns true.
                */
                this.inputTextInDropDownList = false;
                /** A value that specifies the input text of the combobox.
                * @type {string}
                * @remarks
                *       When set the text by code, it will not affect the selectedIndex and selectedValue.
                */
                this.text = null;
                /** A value indicating the dropdown element will be append to the body or combobox container.
                * @remarks
                *       If the value is true, the dropdown list will be appended to body element.
                *       else it will append to the combobox container.
                */
                this.ensureDropDownOnBody = true;
                /** This event is triggered when the drop-down list is opened.
                * @event
                */
                this.open = null;
                /** This event is triggered when the drop-down list is closed.
                * @event
                */
                this.close = null;
                /** A value added to the width of the original HTML select element to account
                *   for the scroll bar width of the drop-down list.
                * @remarks
                *       Unit for this value is pixel.
                *       Because the width of the scroll bar may be different between browsers
                *       if wijcombobox is initialized with the width of the HTML select element,
                *       the text may be hidden by the scroll bar of wijcombobox.
                */
                this.selectElementWidthFix = 6;
                /** This event is triggered when a user searches an item in the drop-down list either
                *  by typing in the textbox or by calling the search method of wijcombobox.
                * @event
                * @dataKey {datasource} datasrc The datasource of wijcombobox.
                * @dataKey {string} term The text to search.
                */
                this.search = null;
                /** The event is obsolete event.
                *  A function called when select item is changed.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IselectedEventArgs} data The data with this event.
                */
                this.changed = null;
                /** This event is triggered when the text of the combobox is changed.
                * @event
                * @dataKey {string} oldText The old text of combobox.
                * @dataKey {string} newText The new text of combobox.
                */
                this.textChanged = null;
                /** This event is triggered when the selected index of the combobox is changed.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IselectedEventArgs} data The data with this event.
                */
                this.selectedIndexChanged = null;
                /** A function called when the selected index of the comboBox is about to change.
                *  Cancellable. If return false, the select operation will be canceled.
                * @event
                * @param {Object} e The jQuery.Event object.
                * @param {IselectedEventArgs} data The data with this event.
                */
                this.selectedIndexChanging = null;
                /** A value that determines the object that contains the options of wijlist.*/
                this.listOptions = null;
                /** A value that determines whether to fit the width of combobox to that of the dropdown.
                * @type {boolean}
                */
                this.adjustComboWidth = false;
            }
            return wijcombobox_options;
        })();
        ;
        wijcombobox.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijcombobox_options());
        $.wijmo.registerWidget("wijcombobox", wijcombobox.prototype);

        //prevent jqm's default behavior for <input> markup.
        if ($.mobile) {
            $.mobile.textinput.initSelector = $.map($.mobile.textinput.initSelector.split(","), function (s) {
                return s + ":not(:jqmData(role='wijcombobox'))";
            }).join(",");
        }

        
    })(wijmo.combobox || (wijmo.combobox = {}));
    var combobox = wijmo.combobox;
})(wijmo || (wijmo = {}));

