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
/*
 * Depends:
 * jquery-1.11.1.js
 * jquery.ui.core.js
 * jquery.ui.widget.js
 * globalize.js
 * jquery.wijmo.widget.js
 * jquery.wijmo.wijutil.js
 * wijmo.data.js
 *
 * Optional dependencies for paging feature:
 * jquery.wijmo.wijpager.js
 *
 * Optional dependencies for scrolling feature:
 * jquery.wijmo.wijsuperpanel.js
 *
 * Optional dependencies for filtering feature:
 * jquery.ui.position.js
 * jquery.wijmo.wijinputdateformat.js
 * jquery.wijmo.wijinputdateroller.js
 * jquery.wijmo.wijinputdate.js
 * jquery.wijmo.wijinputtextformat.js
 * jquery.wijmo.wijinputtext.js
 * jquery.wijmo.wijinputnumberformat.js
 * jquery.wijmo.wijinputnumber.js
 * jquery.wijmo.wijlist.js
 *
 * Optional dependencies for column moving feature:
 * jquery.ui.draggable.js
 * jquery.ui.droppable.js
 * jquery.ui.position.js
 *
 */

/// <reference path="../../../Base/jquery.wijmo.widget.ts"/>
/// <reference path="../../../wijutil/jquery.wijmo.wijutil.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts" />
    /// <reference path="bands_traversing.ts" />
    /// <reference path="misc.ts"/>
    /// <reference path="cellInfo.ts"/>
    /// <reference path="selection.ts"/>
    /// <reference path="cellEditorHelper.ts"/>
    /// <reference path="cellFormatterHelper.ts"/>
    /// <reference path="cellStyleFormatterHelper.ts"/>
    /// <reference path="rowStyleFormatterHelper.ts"/>
    /// <reference path="fixedView.ts"/>
    /// <reference path="flatView.ts"/>
    /// <reference path="dataViewWrapper.ts"/>
    /// <reference path="filterOperators.ts"/>
    /// <reference path="columnsGenerator.ts"/>
    /// <reference path="rowAccessor.ts"/>
    /// <reference path="grouper.ts"/>
    /// <reference path="renderBoundsCollection.ts"/>
    /// <reference path="uiDragndrop.ts"/>
    /// <reference path="uiSelection.ts"/>
    /// <reference path="uiResizer.ts"/>
    /// <reference path="uiFrozener.ts"/>
    /// <reference path="c1field.ts"/>
    /// <reference path="c1band.ts"/>
    /// <reference path="c1buttonfield.ts"/>
    /// <reference path="sketchTable.ts"/>
    /// <reference path="../../../data/src/core.ts"/>
    /// <reference path="../../../data/src/dataView.ts"/>
    /// <reference path="../data/converters.ts"/>
    /// <reference path="../data/koDataView.ts"/> // add reference, otherwise it will be not added to the grunt output.
    /// <reference path="../../../wijpager/jquery.wijmo.wijpager.ts"/>
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        function extendWidgetOptions(baseOptions, newOptions) {
            var result = $.extend(true, {}, baseOptions, newOptions);

            delete result.constructor; // Remove the constructor because the widget.options object is a ts class now (widgetName_options).

            return result;
        }
        grid.extendWidgetOptions = extendWidgetOptions;

        /** @widget
        * Represents the wijgrid widget.
        */
        var wijgrid = (function (_super) {
            __extends(wijgrid, _super);
            function wijgrid() {
                _super.apply(this, arguments);
                this.mDataOffset = 0;
                this.mRowOuterHeight = -1;
                this._windowResizeTimer = 0;
                this.mEditSkechRowIndex = -1;
                this.mCurrentCellLocker = false;
            }
            // * override
            wijgrid.prototype._createWidget = function (options, element) {
                // Late binding, a fix for the case if options.data contains a complex object leading to stack overflow when $.extend is called in the widget factory.
                var data = options && wijmo.data.util.isClassInstance(options.data) && !((typeof wijdatasource === "function") && (options.data instanceof wijdatasource)) && options.data;

                if (data) {
                    options._lateBindingFlag = true;
                    delete options.data;
                }

                _super.prototype._createWidget.apply(this, arguments);

                if (data) {
                    delete options._lateBindingFlag;
                    options.data = data; // restore option value (fixes an issue when a single options object is passed to multiple instances of the wijgrid: $("table").wijgrid({...});
                    this.option("data", data);
                }
            };

            wijgrid.prototype._create = function () {
                var self = this;

                if (!this.element.is("table")) {
                    throw "invalid markup";
                }

                this.mAdjustHeaderText = true;
                this.mSplitDistanceX = 0;
                this.mSplitDistanceY = 0;
                this.mCurrentCellLocker = false;
                this._windowResizeTimer = 0;
                this.mDataOffset = 0;
                this.mScrollingState = { x: null, y: null, index: 0, scrollLeft: 0 };
                this.mRowOuterHeight = -1;
                this._initialized = false;
                this.mDestroyed = false;
                this._rendered = false;
                this._eventUID = undefined;
                ;
                this.mDataViewWrapper = undefined;
                this._originalHtml = undefined;
                this._originalAttr = undefined;
                this._originalCssText = undefined;
                this.mAutoHeight = undefined;
                this._autoWidth = undefined;
                this.mRenderCounter = 0;
                this.mSuperPanelHeader = undefined;
                this.mTopPagerDiv = undefined;
                this.mBottomPagerDiv = undefined;
                this.$groupArea = undefined;
                this.__uid = undefined;
                this.mWijDataView = undefined;
                this.mOuterDiv = undefined;
                this.mSketchTable = undefined;
                this.mCellFormatter = undefined;
                this.mRowStyleFormatter = undefined;
                this.mCellStyleFormatter = undefined;
                this._eventUID = wijmo.grid.getUID();
                this._spinnerActivated = false;
                this.mDeficientFilters = {};

                this.mRenderableColumns = new grid.renderableColumnsCollection();

                // ** jQuery UI 1.9.0 fix
                var hasData = ("data" in this.options), data = hasData && this.options.data;

                if (hasData) {
                    delete this.options.data;
                }

                this.options = $.extend(true, {}, this.options);

                // handle juice objectValue serialize
                if ($.isFunction(window["wijmoASPNetParseOptions"])) {
                    window["wijmoASPNetParseOptions"](this.options);
                }

                if (hasData) {
                    this.options.data = data;
                }

                // jQuery UI 1.9.0 fix **
                // enable touch support:
                if (window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }

                this._initialized = false;
                this.mDestroyed = false;

                // culture
                this.mClosestCulture = $.wijGetCulture(this.options.culture, this.options.cultureCalendar);

                // initialize data
                this.mDataViewWrapper = new wijmo.grid.dataViewWrapper(this);

                this._originalHtml = this.element.html(); // store original html. Will be restored in the destroy() method.
                this._originalAttr = {};
                this._originalCssText = this.element[0].style.cssText;

                this.element.addClass(wijmo.grid.wijgrid.CSS.root);
                this.element.wrap("<div class=\"" + this.options.wijCSS.widget + " " + wijmo.grid.wijgrid.CSS.wijgrid + " " + this.options.wijCSS.wijgrid + " " + this.options.wijCSS.content + " " + this.options.wijCSS.cornerAll + "\"></div>"); // outer div
                this.mOuterDiv = this.element.parent();

                var styleHeight = this.element[0].style.height, styleWidth = this.element[0].style.width;

                if (styleHeight) {
                    this.mOuterDiv.css("height", styleHeight);
                }

                this.mAutoHeight = (styleHeight == "" || styleHeight == "auto");

                if (styleWidth) {
                    this.mOuterDiv.css("width", this.element[0].style.width);
                }

                this._autoWidth = (styleWidth == "" || styleWidth == "auto");

                this.element.css({ "height": "", "width": "" });

                if (this.options.disabled) {
                    this.disable();
                }

                // formatters
                this.mCellFormatter = new wijmo.grid.cellFormatterHelper();
                this.mRowStyleFormatter = new wijmo.grid.rowStyleFormatterHelper(this);
                this.mCellStyleFormatter = new wijmo.grid.cellStyleFormatterHelper(this);

                // * set bounds
                this._viewPortBounds({ start: 0, end: 0, startX: 0, endX: 0 });

                if (this._allowVVirtualScrolling()) {
                    this._viewPortBounds().start = this.mScrollingState.index; // == 0 by default.

                    if (this._serverSideVirtualScrolling()) {
                        this.mDataOffset = this.mScrollingState.index;
                    }
                }

                // set bounds *
                // wijObservable
                if (this.element.wijAddVisibilityObserver) {
                    this.element.wijAddVisibilityObserver(function (e) {
                        if (self._initialized && !self.mDestroyed && (e.target !== self.mOuterDiv[0]) && self.element.is(":visible")) {
                            self.setSize();
                        }
                    }, "wijgrid");
                }

                this._winOrientation = wijmo.grid.getWindowOrientation();

                this.mRenderCounter = 0;
            };

            wijgrid.prototype._destroy = function () {
                var tmp, self = this;

                try  {
                    this._view().dispose();

                    this._detachEvents(true);

                    if (this._resizerui) {
                        this._resizerui.dispose();
                        this._resizerui = null;
                    }

                    if (this._frozenerui) {
                        this._frozenerui.dispose();
                        this._frozenerui = null;
                    }

                    if (this._selectionui) {
                        this._selectionui.dispose();
                        this._selectionui = null;
                    }

                    if (this._dragndropui) {
                        this._dragndropui.dispose();
                        this._dragndropui = null;
                    }

                    this.mDataViewWrapper.dispose();

                    if (this.mCellFormatter) {
                        this.mCellFormatter.dispose();
                        this.mCellFormatter = null;
                    }

                    // cleanup $data
                    wijmo.grid.remove$dataByPrefix(this.element, this.mDataPrefix);

                    if (this.element.wijRemoveVisibilityObserver) {
                        this.element.wijRemoveVisibilityObserver();
                    }

                    // ** restore original content
                    // restore content and destroy children widgets + data.
                    this.element.insertBefore(this.mOuterDiv);
                    this.mOuterDiv.remove();
                    this.element.html(this._originalHtml);

                    // restore attributes
                    $.each(this._originalAttr, function (key, value) {
                        if (value === undefined) {
                            self.element.removeAttr(key);
                        } else {
                            self.element.attr(key, value);
                        }
                    });

                    this.element.removeClass(wijmo.grid.wijgrid.CSS.root);
                    this.element[0].style.cssText = this._originalCssText; // restore style properties
                    // restore original content **
                } finally {
                    this.mDestroyed = true;
                }
            };

            wijgrid.prototype._init = function () {
                this.mSuperPanelHeader = null;
                this.mTopPagerDiv = null;
                this.mBottomPagerDiv = null;
                this.$groupArea = null;

                this._prevHoveredSketchRowIndex = -1;

                // culture
                this.mClosestCulture = $.wijGetCulture(this.options.culture, this.options.cultureCalendar);

                if (!this.options.data) {
                    if (!this.mTHead) {
                        this.mTHead = this._readTableSection(this.element, 1 /* head */);
                    }

                    if (!this.mTFoot) {
                        this.mTFoot = this._readTableSection(this.element, 3 /* foot */);
                    }
                }

                this._initialized = this._initialized || false; // to avoid reinitialization.

                this.ensureControl(true);
            };

            wijgrid.prototype._setOption = function (key, value) {
                var presetFunc = this["_preset_" + key], oldValue = this.options[key], optionChanged, postsetFunc;

                if (presetFunc !== undefined) {
                    value = presetFunc.apply(this, [value, oldValue]);
                }

                optionChanged = (value !== oldValue) || (key.toLowerCase() === "data") || (key.toLowerCase() === "columns"); // same reference, handle a situation when the option.columns array was modifed directly. (TFS issue #41296)

                //$.Widget.prototype._setOption.apply(this, arguments); note: there is no dynamic linkage between the arguments and the formal parameter values when strict mode is used
                _super.prototype._setOption.apply(this, [key, value]); // update this.options

                if (optionChanged) {
                    postsetFunc = this["_postset_" + key];
                    if (postsetFunc !== undefined) {
                        postsetFunc.apply(this, [value, oldValue]);
                    }
                }
            };

            // * override
            // * public
            /** Returns a one-dimensional array of widgets bound to visible column headers.
            * @example
            * var colWidgets = $("#element").wijgrid("columns");
            * @remarks
            * wijgrid columns are represented as widgets. This method returns a one-dimensional array of widgets that are bound to visible column headers.
            *
            * The column widget is initiated with values taken from the corresponding item in the wijgrid.options.columns array. However, the options of a column widget instance reference not the original object but a copy created by the widget factory. Due to that, changes to the wijgrid.options.columns options are not automatically propagated to the column widget options and vice versa.
            * To solve this issue, the wijgrid synchronized the column widget option values with the source items. This synchronization occurs inside the ensureControl() method which is automatically called at each action requiring the wijgrid to enter.
            *
            * Still, there is a drawback. For example, a user may want to filter wijgrid data from user code as in this sample:
            *
            *	$("#element").wijgrid("option", "columns")[0].filterValue = "newValue";
            *	$("#element").wijgrid("ensureControl", true); // make wijgrid re-shape data and re-render.
            *
            * In the sample above, nothing will happen since at synchronization user changes will be ignored.You need to change the filterValue of a column widget. This is what the columns() method is for:
            *
            *	$("#element").wijgrid("columns")[0].options.filterValue = "newValue";
            *	$("#element").wijgrid("ensureControl", true); // make wijgrid re-shape data and re-render.
            *
            * Here's the best way to change the filterValue:
            *
            *	$("#element").wijgrid("columns")[0].option("filterValue", "newValue"); // column widget handles all the needful.
            *
            * @returns {Object[]} A one-dimensional array of widgets bound to visible column headers.
            */
            wijgrid.prototype.columns = function () {
                return this.mVisibleLeaves || [];
            };

            wijgrid.prototype._setColumns = function (value) {
                this.mVisibleLeaves = value;
            };

            /** @ignore */
            wijgrid.prototype.currentCell = function (a, b, changeSelection) {
                var currentCell, view = this._view(), rows = this._rows();

                if (arguments.length === 0) {
                    currentCell = this._currentCell();
                    if (!currentCell) {
                        this._currentCell(currentCell = wijmo.grid.cellInfo.outsideValue);
                    }
                    return currentCell;
                } else {
                    //currentCell = (arguments.length === 1)
                    //	? (<wijmo.grid.cellInfo>a)._clone()
                    //	: new wijmo.grid.cellInfo(<number>a, <number>b);
                    currentCell = (typeof (a) !== "number") ? a._clone() : new wijmo.grid.cellInfo(a, b);

                    if (!currentCell.isEqual(wijmo.grid.cellInfo.outsideValue)) {
                        if (!currentCell._isValid()) {
                            throw "invalid arguments";
                        }

                        currentCell._clip(this._getDataCellsRange(0 /* sketch */));

                        if (currentCell.rowIndex() >= 0) {
                            var rowInfo = view._getRowInfoBySketchRowIndex(currentCell.rowIndex());
                            if (!rowInfo || !(rowInfo.type & 2 /* data */)) {
                                return;
                            }
                        }
                    }

                    currentCell._setGridView(this);

                    this._changeCurrentCell(null, currentCell, { changeSelection: changeSelection || false, setFocus: false });

                    return this._currentCell();
                }
            };

            /** Gets an array of underlying data.
            * @example
            * var data = $("#element").wijgrid("data");
            * @returns {object[]} An array of underlying data.
            */
            wijgrid.prototype.data = function () {
                //return this._dataViewWrapper.dataView()();
                return this.mDataViewWrapper.dataView().getSource();
            };

            /** Gets an underlying wijdataview instance.
            * @example
            * var dataView = $("#element").wijgrid("dataView");
            * @returns {wijmo.data.IDataView} An underlying wijdataview instance.
            */
            wijgrid.prototype.dataView = function () {
                return this.mDataViewWrapper.dataView();
            };

            /** Re-renders wijgrid.
            * @example
            * $("#element").wijgrid("doRefresh");
            * @param {Object} userData Infrastructure, not intended to be used by user.
            */
            wijgrid.prototype.doRefresh = function (userData) {
                var _this = this;
                if (!$.isPlainObject(userData)) {
                    userData = {};
                }

                var self = this, virtualRefresh = userData && userData.virtualScrollData;

                if (!this._initialized) {
                    try  {
                        this._prepareColumns(this.options.columns, this.options.columnsAutogenerationMode, this.mDataViewWrapper.getFieldsInfo(), true, true); // prepare static and dynamic columns
                    } catch (e) {
                        throw e;
                    } finally {
                        //ownerise the column for bug 16936, 17079
                        this._initialized = true;
                    }
                }

                if (!virtualRefresh) {
                    this._rebuildLeaves(); // build leaves, visible leaves, set dataIndex etc

                    var dataSlice = grid.lazy(this.mDataViewWrapper.data, this.mDataViewWrapper), dataView = this.mDataViewWrapper.dataView();

                    var totalsRequest = this._prepareTotalsRequest();
                    if (totalsRequest.length) {
                        $.each(this._leaves(), function (i, column) {
                            column.options._totalsValue = (dataSlice().totals) ? dataSlice().totals[column.options.dataKey] : undefined;
                        });
                    }

                    // this._setPageCount(dataSlice);
                    if (dataView.count()) {
                        var leaves = this._leaves();
                        var lazyTable = new wijmo.grid.LazySketchTable({
                            count: function () {
                                return dataView.count();
                            },
                            getRange: function (start, count, dest, offset) {
                                for (var i = 0; i < count; i++) {
                                    var index = start + i;
                                    var dataItem = dataView.item(index);
                                    dest[offset + i] = _this._buildSketchRow(_this.mDataViewWrapper._wrapDataItem(dataItem, index), leaves);
                                }
                            }
                        });
                        if (this._hasGrouping() || this._hasMerging()) {
                            lazyTable.ensureNotLazy();
                        }
                        this.mSketchTable = lazyTable;
                    } else {
                        this.mSketchTable = new wijmo.grid.SketchTable();
                        var emptyData = dataSlice().emptyData;
                        if (emptyData) {
                            $.each(emptyData, function (i, item) {
                                self.mSketchTable.add(self._buildSketchRowEmptyDataItem(item, _this._leaves(), i === emptyData.length - 1));
                            });
                        }
                    }
                }

                this._onRendering(userData);

                if (!virtualRefresh) {
                    this._refresh(userData);
                } else {
                    this._refreshVirtual(userData);
                }

                if (userData && $.isFunction(userData.beforeOnRendered)) {
                    userData.beforeOnRendered.apply(this, [userData]);
                }

                var view = this._view();
                if (this.mEditSkechRowIndex >= 0 && (view._isRowRendered(this.mEditSkechRowIndex) >= 0)) {
                    var rowInfo = view._getRowInfoBySketchRowIndex(this.mEditSkechRowIndex);
                    if (rowInfo && (rowInfo.state & 16 /* editing */)) {
                        view._makeRowEditable(rowInfo);
                    }
                }

                this._onRendered(userData);

                if (userData && $.isFunction(userData.afterRefresh)) {
                    userData.afterRefresh.apply(this, [userData]);
                }
            };

            /** Puts the current cell into edit mode, as long as the editingMode options is set to "cell".
            * @example
            * $("#element").wijgrid({}
            *		editingMode: "cell",
            *		currentCellChanged: function (e, args) {
            *			if ($(e.target).wijgrid("option", "isLoaded")) {
            *				window.setTimeout(function () {
            *					$(e.target).wijgrid("beginEdit");
            *				}, 100);
            *			}
            *		}
            * });
            * @returns {Boolean} True if the cell is successfully put into edit mode, otherwise false.
            */
            wijgrid.prototype.beginEdit = function () {
                if (!this._allowCellEditing()) {
                    throw "Can be used only if the editingMode option is set to \"cell\".";
                }

                return this._beginEditInternal(null);
            };

            /** Finishes editing the current cell.
            * @example
            * // endEdit is being called from within the saveChanges function
            * function saveChanges() {
            *		$("#element").wijgrid("endEdit");
            * }
            * functon cancelChanges() {
            *		$("#element").wijgrid("endEdit", true);
            * }
            * @param {Boolean} reject An optional parameter indicating whether changes will be rejected (true) or commited (false). The default value is false.
            * @returns {Boolean} True if the editing was finished successfully, othewise false.
            */
            wijgrid.prototype.endEdit = function (reject) {
                if (typeof reject === "undefined") { reject = false; }
                return this._endEditInternal(null, reject);
            };

            /** Starts editing of the specified row, can only be used when the editingMode option is set to "row".
            * @example
            * $("#element").wijgrid("editRow", 0);
            * @param {Number} dataItemIndex Determines the data item to edit.
            */
            wijgrid.prototype.editRow = function (dataItemIndex) {
                if (this.options.editingMode !== "row") {
                    throw "Can be used only if the editingMode option is set to \"row\".";
                }

                if (this.mEditSkechRowIndex >= 0) {
                    this.cancelRowEditing(); // only one row can be edited at a time.
                }

                if (dataItemIndex >= 0) {
                    var sketchRowIndex = -1, sketchRow;

                    for (var i = 0; i < this.mSketchTable.count() && sketchRowIndex < 0; i++) {
                        sketchRow = this.mSketchTable.row(i);

                        if (sketchRow.isDataRow() && ((sketchRow.dataItemIndex()) === dataItemIndex)) {
                            sketchRowIndex = i;
                        }
                    }

                    if (sketchRowIndex >= 0) {
                        var view = this._view();

                        this.mEditSkechRowIndex = sketchRowIndex;

                        sketchRow.renderState |= 16 /* editing */;

                        if (view._isRowRendered(this.mEditSkechRowIndex) >= 0) {
                            var rowInfo = view._getRowInfoBySketchRowIndex(this.mEditSkechRowIndex, false);

                            rowInfo.state |= 16 /* editing */; // ??

                            view._removeBodyRow(rowInfo.sectionRowIndex, false); // delete an exisiting row
                            rowInfo = view._insertBodyRow(sketchRow, rowInfo.sectionRowIndex, rowInfo.dataItemIndex, -1); //  create and render a new one
                            view._makeRowEditable(rowInfo);

                            this.selection()._ensureSelectionInRow(this.mEditSkechRowIndex);
                        }
                    }
                }
            };

            /**
            * Exports the grid to a specified format.
            * The export method only works when wijmo.exporter.gridExport's reference is on the page.
            * @remarks Possible exported types are: xls, xlsx, csv, pdf,
            * @param {string} fileName The name of the exported file.
            * @param {string} type The type of the exported file.
            * @param {object} settings The export setting.
            * @param {string} serviceUrl The export service url.
            * @example
            * $("#element").wijgrid("exportGrid", "grid", "csv");
            */
            wijgrid.prototype.exportGrid = function (fileName, type, settings, serviceUrl) {
            };

            /** Finishes editing and updates the datasource.
            * @example
            * $("#element").wijgrid("updateRow");
            */
            wijgrid.prototype.updateRow = function () {
                if (this.mEditSkechRowIndex >= 0) {
                    var dataView = wijmo.grid.asEditableDataView(this.mDataViewWrapper.dataView()), errorOccurs = false;

                    if (!dataView) {
                        throw "The provided DataView doesn't supports the editing operation.";
                    }

                    try  {
                        var sketchRow = this.mSketchTable.row(this.mEditSkechRowIndex), view = this._view();

                        if (!sketchRow || !sketchRow.isDataRow() || !(sketchRow.renderState & 16 /* editing */)) {
                            throw "Invalid row";
                        }

                        if (this._view()._isRowRendered(this.mEditSkechRowIndex) >= 0) {
                            var rowInfo = view._getRowInfoBySketchRowIndex(this.mEditSkechRowIndex, false);

                            // ** get the new values and update an underlying data source
                            var visibleLeaves = this._visibleLeaves(), cells = [], cellEditor = new wijmo.grid.cellEditorHelper();

                            for (var i = 0; i < visibleLeaves.length; i++) {
                                var column = visibleLeaves[i];

                                if ((column instanceof grid.c1field) && !column.options.readOnly) {
                                    var $cell = rowInfo.$rows.children("td, th").eq(i);

                                    if ($cell.length) {
                                        var state = view._changeCellRenderState($cell, 0 /* none */, true);

                                        if (state & 16 /* editing */) {
                                            var cellInfo = view.getAbsoluteCellInfo($cell[0], true), updateRes = cellEditor.updateCell(this, cellInfo, null, false);

                                            if (!(updateRes & 2 /* success */)) {
                                                errorOccurs = true;
                                                return;
                                            }

                                            if (!(updateRes & 8 /* notEdited */)) {
                                                cells.push(cellInfo);
                                            }
                                        }
                                    }
                                }
                            }

                            for (var i = 0; i < cells.length; i++) {
                                cellEditor.cellEditEnd(this, cells[i], null);
                            }

                            // collect new values and update underlying data source **
                            // ** no errors, update DOM **
                            sketchRow.renderState &= ~16 /* editing */;

                            rowInfo.state &= ~16 /* editing */; // ??
                            view._removeBodyRow(rowInfo.sectionRowIndex, false); // delete an exisiting row
                            rowInfo = view._insertBodyRow(sketchRow, rowInfo.sectionRowIndex, rowInfo.dataItemIndex, -1); //  create and render a new one

                            this.selection()._ensureSelectionInRow(this.mEditSkechRowIndex);
                        } else {
                            sketchRow.renderState &= ~16 /* editing */;
                        }
                    } finally {
                        if (!errorOccurs) {
                            this.mEditSkechRowIndex = -1;
                        }
                    }
                }
            };

            /** Discards changes and finishes editing of the edited row.
            * @example
            * $("#element").wijgrid("cancelRowEditing");
            */
            wijgrid.prototype.cancelRowEditing = function () {
                if (this.mEditSkechRowIndex >= 0) {
                    try  {
                        var sketchRow = this.mSketchTable.row(this.mEditSkechRowIndex), view = this._view();

                        if (!sketchRow || !sketchRow.isDataRow() || !(sketchRow.renderState & 16 /* editing */)) {
                            throw "Invalid row.";
                        }

                        sketchRow.renderState &= ~16 /* editing */;

                        if (this._view()._isRowRendered(this.mEditSkechRowIndex) >= 0) {
                            var rowInfo = view._getRowInfoBySketchRowIndex(this.mEditSkechRowIndex, false);

                            rowInfo.state &= ~16 /* editing */; // ??
                            view._removeBodyRow(rowInfo.sectionRowIndex, false); // delete an exisiting row
                            rowInfo = view._insertBodyRow(sketchRow, rowInfo.sectionRowIndex, rowInfo.dataItemIndex, -1); //  create and render a new one

                            this.selection()._ensureSelectionInRow(this.mEditSkechRowIndex);
                        }
                    } finally {
                        this.mEditSkechRowIndex = -1;
                    }
                }
            };

            /** Deletes the specified row.
            * @example
            * $("#element").wijgrid("cancelRowEditing");
            * @param {Number} dataItemIndex Determines the data item to edit.
            */
            wijgrid.prototype.deleteRow = function (dataItemIndex) {
                if (dataItemIndex >= 0) {
                    var dataView = wijmo.grid.asEditableDataView(this.mDataViewWrapper.dataView());

                    if (!dataView || !dataView.canRemove()) {
                        throw "The provided DataView doesn't supports the deleting operation.";
                    }

                    // dataView.remove(dataItemIndex); // the whole wijgrid will be re-rendered.
                    this.mDataViewWrapper.ignoreChangeEvent(true);
                    dataView.remove(dataItemIndex);
                    this.mDataViewWrapper.ignoreChangeEvent(false);

                    this.ensureControl(true, {
                        forceDataLoad: true
                    });
                }
            };

            /** Moves the column widget options to the wijgrid options and renders the wijgrid. Use this method when you need to re-render the wijgrid and reload remote data from the datasource.
            * @example
            * // Adds a new row to the viewModel and refreshes the wijgrid
            * var len = viewModel.data().length;
            * viewModel.data.push(new Person({ ID: len, Company: "New Company" + len, Name: "New Name" + len }));
            * $("#element").wijgrid("ensureControl", true);
            * @param {Boolean} loadData Determines if the wijgrid must load data from a linked data source before rendering.
            */
            wijgrid.prototype.ensureControl = function (loadData, userData) {
                this._loading();

                if (!$.isPlainObject(userData)) {
                    userData = {
                        data: null,
                        afterRefresh: null,
                        beforeRefresh: null
                    };
                }

                if (!this._initialized) {
                    // this._prepareColumnOptions(false); // prepare static columns only (to make a proper sorting or filtering request to remote service)
                    this._prepareColumns(this.options.columns, this.options.columnsAutogenerationMode, this.mDataViewWrapper.isDataLoaded() && this.mDataViewWrapper.getFieldsInfo(), this.mDataViewWrapper.isDataLoaded(), false);

                    if (!this.mDataViewWrapper.isOwnDataView()) {
                        // map sorting\ filtering\ paging settings from external dataView to the grid's options during initialization stage
                        (new wijmo.grid.settingsManager(this)).MapDVToWG();
                    }
                }

                if (this._initialized) {
                    if (userData && $.isFunction(userData.beforeRefresh)) {
                        userData.beforeRefresh.apply(this);
                    }
                }

                if (!userData || !userData.virtualScrollData) {
                    this.mAllowVVirtualScrolling = undefined;
                    this.mEditSkechRowIndex = -1;
                }

                if (loadData === true) {
                    this.mDataViewWrapper.load(userData);
                } else {
                    this.doRefresh(userData);
                    this._loaded();
                }
            };

            /** Gets an instance of the wijmo.grid.cellInfo class that represents the grid's specified cell.
            * @example
            * var cellInfo = $("#element").wijgrid("getCellInfo", domCell);
            * @param {Object} domCell A HTML DOM Table cell object
            * @returns {wijmo.grid.cellInfo} Object that represents a cell of the grid.
            */
            wijgrid.prototype.getCellInfo = function (domCell) {
                var cellInfo = null;

                if (domCell && (domCell = this._findUntilOuterDiv(domCell, { td: true, th: true }))) {
                    cellInfo = this._view().getAbsoluteCellInfo(domCell, false);
                }

                return cellInfo;
            };

            /** Returns a one-dimensional array of filter operators which are applicable to the specified data type.
            * @example
            * var operators = $("#element").wijgrid("getFilterOperatorsByDataType", "string");
            * @param {String} dataType Specifies the type of data to which you apply the filter operators. Possible values are: "string", "number", "datetime", "currency" and "boolean".
            * @returns {wijmo.grid.IFilterOperator[]} A one-dimensional array of filter operators.
            */
            wijgrid.prototype.getFilterOperatorsByDataType = function (dataType) {
                return (new wijmo.grid.filterOperatorsCache(this)).getByDataType(dataType || "string");
            };

            /** Gets the number of pages.
            * @example
            * var pageCount = $("#element").wijgrid("pageCount");
            * @returns {Number} The number of pages.
            */
            wijgrid.prototype.pageCount = function () {
                if (this._customPagingEnabled()) {
                    return Math.ceil(this.options.totalRows / this.options.pageSize) || 1;
                }

                return this.options.allowPaging ? this.mDataViewWrapper.dataView().pageCount() : 1;
            };

            wijgrid.prototype._closestCulture = function () {
                return this.mClosestCulture;
            };

            wijgrid.prototype._serverShaping = function () {
                // used to support asp.net C1GridView
                return false;
            };

            wijgrid.prototype._pageIndexForDataView = function () {
                /** Infrastructure */
                return this.options.pageIndex;
            };

            /** Sets the size of the grid using the width and height parameters.
            * @example
            * $("#element").wijgrid("setSize", 200, 200);
            * @param {String|Number} width Determines the width of the grid.
            * @param {String|Number} height Determines the height of the grid.
            */
            wijgrid.prototype.setSize = function (width, height) {
                var view = this._view(), scrollValue = null, outerDiv = this.mOuterDiv, visibleLeaves = this._visibleLeaves(), leavesWithFilter = [], ieLT9 = $.browser && $.browser.msie && ($.browser.version < 9);

                try  {
                    if (ieLT9) {
                        wijmo.grid.wijgrid.IGNORE_WIN_RESIZE = true; // #72351
                    }

                    if (view && view.getScrollValue) {
                        scrollValue = view.getScrollValue();
                    }

                    if (width || (width === 0)) {
                        this._autoWidth = false;
                        outerDiv.width(width);
                    }

                    if (height || (height === 0)) {
                        this.mAutoHeight = false;
                        outerDiv.height(height);
                    }

                    view._resetWidth();

                    this._hideAllFilterDropDownLists();

                    // recalculate sizes
                    this._setSizeInternal(scrollValue);

                    var frozener = this._UIFrozener();
                    if (frozener) {
                        frozener.refresh();
                    }
                } finally {
                    wijmo.grid.wijgrid.IGNORE_WIN_RESIZE = false;
                }
            };

            wijgrid.prototype._setSizeInternal = function (scrollValue) {
                this._view().updateSplits(scrollValue);
            };

            /** Gets an object that manages selection in the grid.
            * @example
            * // Use the row index to add the row to the selection object
            * var selection = $("#element").wijgrid("selection");
            * selection.addRows(2);
            * @remarks
            * See the description of the wijmo.grid.selection class for more details.
            * @returns {wijmo.grid.selection} Object that manages selection in the grid.
            */
            wijgrid.prototype.selection = function () {
                if (!this.mSelection) {
                    this.mSelection = new wijmo.grid.selection(this);
                }
                return this.mSelection;
            };

            // * public
            wijgrid.prototype._leaves = function () {
                if (!this.mLeaves) {
                    this.mLeaves = [];
                }

                return this.mLeaves;
            };

            wijgrid.prototype._visibleLeaves = function () {
                if (!this.mVisibleLeaves) {
                    this.mVisibleLeaves = [];
                }

                return this.mVisibleLeaves;
            };

            wijgrid.prototype._renderedLeaves = function () {
                if (!this.mRenderedLeaves) {
                    this.mRenderedLeaves = [];
                }

                return this.mRenderedLeaves;
            };

            wijgrid.prototype._virtualLeaves = function () {
                if (!this.mVirtualLeaves) {
                    this.mVirtualLeaves = [];
                }

                return this.mVirtualLeaves;
            };

            wijgrid.prototype._allColumns = function () {
                if (!this.mAllColumns) {
                    this.mAllColumns = [];
                }

                return this.mAllColumns;
            };

            wijgrid.prototype._findInstance = function (column) {
                if (column) {
                    return this._allColumns()[column.travIdx] || null;
                }

                return null;
            };

            wijgrid.prototype._currentCell = function (value) {
                if (!arguments.length) {
                    return this.mCurrentCell;
                }

                this.mCurrentCell = value;
            };

            wijgrid.prototype._groupAreaColumns = function () {
                if (!this.mGroupAreaColumns) {
                    this.mGroupAreaColumns = [];
                }

                return this.mGroupAreaColumns;
            };

            wijgrid.prototype._tHead = function () {
                return this.mTHead;
            };

            wijgrid.prototype._onDataViewCurrentPositionChanged = function (e, args) {
                var cellInfo = this._currentCellFromDataView(this.currentCell().cellIndex());

                // move currentCell to the new position
                cellInfo = this.currentCell(cellInfo, null, true);
            };

            wijgrid.prototype._resetColumns = function () {
                wijmo.grid.traverse(this.options.columns, function (column, columns) {
                    if (column.dynamic) {
                        // remove autogenerated columns
                        var idx = $.inArray(column, columns);
                        if (idx >= 0) {
                            columns.splice(idx, 1);
                        }
                    } else {
                        // restore original values
                        column.dataKey = column._originalDataKey;
                        column.headerText = column._originalHeaderText;
                    }
                });

                this._initialized = false; // to generate columns when doRefresh() or ensureControl() methods will be called
            };

            wijgrid.prototype._resetDataProperitesOnFilterChanging = function () {
                this._resetDataProperties();
                this._resetVerticalBounds();
            };

            wijgrid.prototype._resetDataProperties = function () {
                this.options.pageIndex = 0;
            };

            wijgrid.prototype._resetVerticalBounds = function () {
                var bounds = this._viewPortBounds();

                //bounds.start = bounds.end = 0;
                bounds.start = 0; // #52058: reset the .start property only. Let wijgrid to update the .end property when the underlying data will be refreshed actually.

                this.mScrollingState.index = 0;
                this.mScrollingState.y = 0;
            };

            wijgrid.prototype._onDataViewLoading = function () {
                this._activateSpinner(); // if data loading proccess was triggered outside the wijgrid.
                this._trigger("dataLoading");
            };

            wijgrid.prototype._onDataViewReset = function (userData, resetColumns) {
                if (!this.options._lateBindingFlag) {
                    this.mEditSkechRowIndex = -1; // #49039

                    if (this.mCurrentCellLocker) {
                        if (!(this._serverSideVirtualScrolling() && userData && userData.virtualScrollData)) {
                            this._resetVerticalBounds();
                        }
                        this.mCurrentCellLocker = false;
                    }

                    (new wijmo.grid.settingsManager(this)).MapDVToWG();

                    this._trigger("dataLoaded");

                    if (resetColumns) {
                        this._resetColumns();
                    }

                    this.doRefresh(userData);

                    this._loaded();
                } else {
                    delete this.options._lateBindingFlag;
                }
            };

            wijgrid.prototype._onDataViewLoaded = function () {
            };

            wijgrid.prototype._loading = function () {
                this._activateSpinner();
                this._trigger("loading");
            };

            wijgrid.prototype._loaded = function () {
                this._deactivateSpinner();
                this._trigger("loaded");
            };

            wijgrid.prototype._buildSketchRow = function (wrappedDataItem, leaves) {
                var cellAttr, value, tmp, meta = wijmo.grid.dataViewWrapper.getMetadata(wrappedDataItem.values), sketchRow = new grid.SketchDataRow(wrappedDataItem.originalRowIndex, 1 /* rendering */, meta && meta.rowAttributes), cellAttributes = meta && meta.cellsAttributes;

                for (var i = 0, len = leaves.length; i < len; i++) {
                    var leaf = leaves[i];

                    if (leaf instanceof grid.c1field) {
                        var boundField = leaf;

                        cellAttr = cellAttributes ? cellAttributes[boundField.options.dataKey] : null;

                        value = this.mDataViewWrapper.getValue(wrappedDataItem.values, boundField.options.dataKey);

                        sketchRow.add(new grid.ValueCell(this.parse(leaf.options, value), cellAttr));
                    } else {
                        sketchRow.add(new grid.ValueCell(null, {}));
                    }
                }

                return sketchRow;
            };

            wijgrid.prototype._buildSketchRowEmptyDataItem = function (dataItem, leaves, isLastRow) {
                var sketchRow = new grid.SketchRow(128 /* emptyDataRow */, 1 /* rendering */, null), leavesLen = leaves.length;

                for (var i = 0, len = dataItem.length; i < len; i++) {
                    sketchRow.add(new grid.HtmlCell(dataItem[i], {
                        colSpan: (leavesLen > 0 && isLastRow) ? this._visibleLeaves().length : 1
                    }));
                }

                return sketchRow;
            };

            wijgrid.prototype._prepareColumnsStage1 = function (columns, dataLoaded, finalStage) {
                new wijmo.grid.bandProcessor().getVisibleHeight(columns, true); // set .isLeaf
            };

            wijgrid.prototype._prepareColumnsStage2 = function (columns, generationMode, fieldsInfo, dataLoaded, finalState, generateInsances) {
                var _this = this;
                if (typeof generateInsances === "undefined") { generateInsances = true; }
                wijmo.grid.traverse(columns, function (column) {
                    column._originalDataKey = column.dataKey;
                    column._originalHeaderText = column.headerText;
                });

                if (dataLoaded) {
                    wijmo.grid.columnsGenerator.generate(generationMode, fieldsInfo, columns);
                }

                wijmo.grid.setTraverseIndex(columns); // build indices (linearIdx, travIdx, parentIdx)

                if (generateInsances) {
                    this._generateColumnInstancesFromOptions(columns);
                }

                // provide headerText and footerText if not specified
                if (dataLoaded && this.mDataViewWrapper && this.mAdjustHeaderText) {
                    $.each(this._leaves(), function (index, column) {
                        var boundedToDOM = _this.mDataViewWrapper.isBoundedToDOM(), opt = column.options, cellIndex = (typeof (opt.dataKey) === "number") ? opt.dataKey : opt.leavesIdx;

                        // assume headerText options of the static columns only when using "merge" mode.
                        if ((opt.headerText === undefined) && (_this.options.columnsAutogenerationMode === "merge" || opt.dynamic)) {
                            var headerRow = _this._originalHeaderRowData();

                            if (boundedToDOM && headerRow && (cellIndex < headerRow.length)) {
                                opt.headerText = $.trim(headerRow[cellIndex]);
                            } else {
                                if (column instanceof grid.c1field) {
                                    opt.headerText = opt.dataKey + "";
                                }
                            }
                        }

                        var footerRow = _this._originalFooterRowData();
                        if (boundedToDOM && footerRow && (cellIndex < footerRow.length)) {
                            opt._footerTextDOM = $.trim(footerRow[cellIndex]);
                        }
                    });
                }
            };

            wijgrid.prototype._prepareColumns = function (columns, generationMode, fieldsInfo, dataLoaded, finalStage, generateInstances) {
                if (typeof generateInstances === "undefined") { generateInstances = true; }
                this._prepareColumnsStage1(columns, dataLoaded, finalStage);
                this._prepareColumnsStage2(columns, generationMode, fieldsInfo, dataLoaded, finalStage, generateInstances);
            };

            wijgrid.prototype._rebuildLeaves = function () {
                var tmp = [];

                this._addVirtualColumns(tmp);

                $.each(this.options.columns, function (index, item) {
                    tmp.push(item); // append columns
                });

                wijmo.grid.setTraverseIndex(tmp); // build indices (linearIdx, travIdx, parentIdx)

                // generate span table and build leaves
                this._columnsHeadersTable(new wijmo.grid.bandProcessor().generateSpanTable(tmp));

                this._generateColumnInstancesFromOptions(tmp);

                this._onLeavesCreated();
            };

            wijgrid.prototype._addVirtualColumns = function (columns) {
                if (this._showRowHeader()) {
                    columns.push(grid.c1rowheaderfield.getInitOptions());
                }
            };

            wijgrid.prototype._generateColumnInstancesFromOptions = function (columns) {
                var _this = this;
                this.mAllColumns = [];
                this.mLeaves = [];
                this.mVirtualLeaves = [];
                this.mVisibleLeaves = [];
                this.mGroupedLeaves = null; // force recreating.
                this.mRenderedLeaves = [];

                var dataIndex = 0, leavesIdx = 0, visLeavesIdx = 0;

                wijmo.grid.traverse(columns, function (opt) {
                    opt.visLeavesIdx = undefined;
                    opt.leavesIdx = undefined;
                    opt.renderedIndex = undefined;

                    if (opt.isLeaf) {
                        opt.leavesIdx = leavesIdx++;

                        if (opt.parentVis) {
                            opt.visLeavesIdx = visLeavesIdx++;
                        }
                    }

                    opt.disabled = _this.options.disabled === true;

                    var instance = wijmo.grid.asColumnInstance(_this, opt);

                    _this.mAllColumns.push(instance);

                    if (instance instanceof grid.c1field) {
                        opt.dataIndex = dataIndex++;
                    }

                    if (opt.isLeaf) {
                        _this.mLeaves.push(instance);

                        if (opt.parentVis) {
                            _this.mVisibleLeaves.push(instance);

                            if (instance instanceof grid.c1rowheaderfield) {
                                _this.mVirtualLeaves.push(instance);
                            }
                        }
                    }
                });
            };

            wijgrid.prototype._onLeavesCreated = function () {
            };

            wijgrid.prototype._allowEditing = function () {
                return (this.options.allowEditing === true) || (this.options.editingMode === "cell") || (this.options.editingMode === "row");
            };

            wijgrid.prototype._allowCellEditing = function () {
                var editingMode = this.options.editingMode;

                if (editingMode === "row") {
                    return false;
                }

                return (this.options.allowEditing === true) || (editingMode === "cell");
            };

            wijgrid.prototype._allowVirtualScrolling = function () {
                return this._allowVVirtualScrolling() || this._allowHVirtualScrolling();
            };

            wijgrid.prototype._allowVVirtualScrolling = function () {
                if (this.mAllowVVirtualScrolling === undefined) {
                    var mode = this.options.scrollingSettings.virtualizationSettings.mode, allow = this.options.allowVirtualScrolling || mode === "rows" || mode === "both";

                    this.mAllowVVirtualScrolling = !this.options.allowPaging && allow && (this._lgGetStaticRowIndex() < 0) && (this._lgGetScrollMode() !== "none") && !this._hasMerging();
                }

                return this.mAllowVVirtualScrolling;
            };

            wijgrid.prototype._allowHVirtualScrolling = function () {
                if (this.mAllowHVirtualScrolling === undefined) {
                    var mode = this.options.scrollingSettings.virtualizationSettings.mode, allow = mode === "columns" || mode === "both";

                    this.mAllowHVirtualScrolling = allow && (this._lgGetScrollMode() !== "none") && !this._hasGrouping() && !this._hasBands();
                }

                return this.mAllowHVirtualScrolling;
            };

            wijgrid.prototype._headerRows = function () {
                return this._view().headerRows();
            };

            wijgrid.prototype._filterRow = function () {
                return this._view().filterRow();
            };

            wijgrid.prototype._rows = function () {
                return this._view().bodyRows();
            };

            wijgrid.prototype._localizeFilterOperators = function (locArray) {
                var self = this, helper = new wijmo.grid.filterOperatorsCache(this);

                $.each(locArray, function (i, o) {
                    if (o.name) {
                        var fop = helper.getByName(o.name);
                        if (fop) {
                            fop.displayName = o.displayName;
                        }
                    }
                });
            };

            wijgrid.prototype._KeyDownEventListener = function () {
                if (!this.mKeyDownEventListener) {
                    var view = this._view(), $fe = view && view.focusableElement();

                    if ($fe) {
                        this.mKeyDownEventListener = new grid.keyDownEventListener(this, $fe);
                    }
                }

                return this.mKeyDownEventListener;
            };

            wijgrid.prototype._UIDragndrop = function (force) {
                if (!this._dragndropui && force) {
                    this._dragndropui = new wijmo.grid.uiDragndrop(this);
                }

                return this._dragndropui;
            };

            wijgrid.prototype._UIFrozener = function (force) {
                if (!this._frozenerui && force) {
                    this._frozenerui = new wijmo.grid.uiFrozener(this);
                }

                return this._frozenerui;
            };

            wijgrid.prototype._UIResizer = function (force) {
                if (!this._resizerui && force) {
                    this._resizerui = new wijmo.grid.uiResizer(this);
                }

                return this._resizerui;
            };

            wijgrid.prototype._UISelection = function (force) {
                if (!this._selectionui && force) {
                    this._selectionui = new wijmo.grid.uiSelection(this);
                }

                return this._selectionui;
            };

            // * propeties (pre-\ post-)
            wijgrid.prototype._postset_allowColMoving = function (value, oldValue) {
                var self = this;

                $.each(this.columns(), function (idx, wijField) {
                    if (value) {
                        self._UIDragndrop(true).attach(wijField);
                    } else {
                        self._UIDragndrop(true).detach(wijField);
                    }
                });

                var groupedWidgets = this._groupAreaColumns();

                if (groupedWidgets) {
                    $.each(groupedWidgets, function (idx, wijField) {
                        if (value) {
                            self._UIDragndrop(true).attach(wijField);
                        } else {
                            self._UIDragndrop(true).detach(wijField);
                        }
                    });
                }
            };

            wijgrid.prototype._postset_allowEditing = function (value, oldValue) {
                this._postset_editingMode(this.options.editingMode, undefined);
            };

            wijgrid.prototype._postset_allowSorting = function (value, oldValue) {
                this.ensureControl(false);
            };

            wijgrid.prototype._postset_columns = function (value, oldValue) {
                this._initialized = false;
                this.ensureControl(true);
            };

            wijgrid.prototype._postset_allowPaging = function (value, oldValue) {
                this.ensureControl(true);
            };

            wijgrid.prototype._postset_freezingMode = function (value, oldValue) {
                if (this._frozenerui) {
                    this._frozenerui.refresh();
                }
            };

            wijgrid.prototype._postset_culture = function (value, oldValue) {
                this.mClosestCulture = $.wijGetCulture(this.options.culture, this.options.cultureCalendar);
                this.ensureControl(false);
            };

            wijgrid.prototype._postset_customFilterOperators = function (value, oldValue) {
                var dataView = this.mDataViewWrapper.dataView();
            };

            wijgrid.prototype._postset_data = function (value, oldValue) {
                this._resetColumns();

                // this._resetDataProperties();
                if (this.mDataViewWrapper) {
                    this.mDataViewWrapper.dispose();
                }

                this.mDataViewWrapper = new wijmo.grid.dataViewWrapper(this);

                this.ensureControl(true);
            };

            wijgrid.prototype._postset_disabled = function (value, oldValue) {
                // update children widgets
                var self = this, view = this._view();

                wijmo.grid.iterateChildrenWidgets(this.mOuterDiv, function (index, widget) {
                    if (widget !== self) {
                        widget.option("disabled", value);
                    }
                });

                // update editors (#69699)
                if ((this.mEditSkechRowIndex >= 0) && (view._isRowRendered(this.mEditSkechRowIndex) >= 0)) {
                    var row = view._getRowInfoBySketchRowIndex(this.mEditSkechRowIndex, false);
                    if (row) {
                        row.$rows.find("." + wijmo.grid.wijgrid.CSS.inputMarker).prop("disabled", value);
                    }
                }

                //
                if (view) {
                    view.ensureDisabledState();
                }
            };

            wijgrid.prototype._postset_editingMode = function (value, oldValue) {
                if (this.mKeyDownEventListener) {
                    this.mKeyDownEventListener.dispose();
                    this.mKeyDownEventListener = null;

                    this._KeyDownEventListener();
                }
            };

            wijgrid.prototype._postset_groupIndent = function (value, oldValue) {
                this.ensureControl(false);
            };

            wijgrid.prototype._postset_groupAreaCaption = function (value, oldValue) {
                var groupedColumns = this._groupedLeaves();

                if (this.$groupArea && (!groupedColumns || !groupedColumns.length)) {
                    this.$groupArea.html(value || "&nbsp;");
                }
            };

            wijgrid.prototype._postset_highlightCurrentCell = function (value, oldValue) {
                var currentCell = this.currentCell();

                if (currentCell && currentCell._isValid()) {
                    this._highlightCellPosition(currentCell, value);
                }
            };

            wijgrid.prototype._preset_pageIndex = function (value, oldValue) {
                if (grid.isNaN(value)) {
                    throw "out of range";
                }

                var pageCount = this.pageCount(), fn = function (val) {
                    if (val > pageCount - 1) {
                        val = pageCount - 1;
                    }

                    if (val < 0) {
                        val = 0;
                    }

                    return val;
                };

                value = fn(value);

                if (this.options.allowPaging && value !== oldValue) {
                    var args = { newPageIndex: value };

                    if (!this._onPageIndexChanging(args)) {
                        value = oldValue;

                        // revert wijpager's pageIndex option
                        $.each([this.mTopPagerDiv, this.mBottomPagerDiv], function (_, elem) {
                            if (elem && elem.length) {
                                var instance = elem.data("wijmo-wijpager");
                                if (instance) {
                                    instance.options.pageIndex = value;
                                }
                            }
                        });
                    } else {
                        value = fn(args.newPageIndex);
                    }
                }

                return value;
            };

            wijgrid.prototype._postset_pageIndex = function (value, oldValue) {
                if (this.options.allowPaging) {
                    var args = { newPageIndex: value };

                    if (this._customPagingEnabled()) {
                        this._onPageIndexChanged(args); // Allow user the ability to load a new data and refresh the grid.
                    } else {
                        this.ensureControl(true, {
                            afterRefresh: function () {
                                this._onPageIndexChanged(args);
                            }
                        });
                    }
                }
            };

            wijgrid.prototype._preset_pageSize = function (value, oldValue) {
                if (grid.isNaN(value)) {
                    throw "out of range";
                }

                if (value <= 0) {
                    value = 1;
                }

                return value;
            };

            wijgrid.prototype._postset_pageSize = function (value, oldValue) {
                this._resetDataProperties();

                if (this.options.allowPaging && !this._customPagingEnabled()) {
                    this.ensureControl(true);
                }
            };

            wijgrid.prototype._postset_pagerSettings = function (value, oldValue) {
                this.ensureControl(false);
            };

            wijgrid.prototype._postset_rowHeight = function (value, oldValue) {
                this.mRowOuterHeight = -1;
                this.ensureControl(false);
            };

            wijgrid.prototype._postset_scrollMode = function (value, oldValue) {
                this.ensureControl(false);
            };

            wijgrid.prototype._postset_selectionMode = function (value, oldValue) {
                var selection = this.selection(), currentCell = this.currentCell(), hasSelection = this.selection().selectedCells().length();

                selection.beginUpdate();

                selection.clear();

                if (currentCell && currentCell._isValid() && hasSelection) {
                    selection._selectRange(new wijmo.grid.cellInfoRange(currentCell, currentCell), false, false, 0 /* none */, null);
                }

                selection.endUpdate();

                this._view().toggleDOMSelection(value === "none"); // disable or enable DOM selection
            };

            wijgrid.prototype._postset_showFilter = function (value, oldValue) {
                this.ensureControl(false);
            };

            wijgrid.prototype._postset_showGroupArea = function (value, oldValue) {
                this.ensureControl(false);
            };

            wijgrid.prototype._postset_showRowHeader = function (value, oldValue) {
                this.ensureControl(false);
            };

            wijgrid.prototype._postset_staticRowIndex = function () {
                if (this._lgGetScrollMode() !== "none") {
                    this.ensureControl(false);
                }
            };

            wijgrid.prototype._postset_staticColumnIndex = function () {
                if (this._lgGetScrollMode() !== "none") {
                    this.ensureControl(false);
                }
            };

            wijgrid.prototype._postset_allowVirtualScrolling = function (value, oldValue) {
                this.ensureControl(false);
            };

            wijgrid.prototype._preset_allowVirtualScrolling = function (value, oldValue) {
                if (grid.isNaN(value) || value < 0) {
                    throw "out of range";
                }

                return value;
            };

            // * propeties (pre-\ post-)
            // * private
            wijgrid.prototype._activateSpinner = function () {
                if (!this._spinnerActivated) {
                    var defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this.options.wijCSS, loadingText = this.mOuterDiv.append("<div class=\"" + defCSS.loadingOverlay + " " + wijCSS.wijgridLoadingOverlay + " " + wijCSS.overlay + "\"></div>" + "<span class=\"" + defCSS.loadingText + " " + wijCSS.wijgridLoadingText + " " + wijCSS.content + " " + wijCSS.cornerAll + "\">" + "<span class=\"" + wijCSS.icon + " " + wijCSS.iconClock + "\"></span>" + this.options.loadingText + "</span>").find("> ." + defCSS.loadingText);

                    loadingText.position({
                        my: "center",
                        at: "center center",
                        of: this.mOuterDiv,
                        collision: "none"
                    });

                    this._spinnerActivated = true;
                }
            };

            wijgrid.prototype._customPagingEnabled = function () {
                return this.options.allowPaging && this.options.totalRows >= 0;
            };

            wijgrid.prototype._deactivateSpinner = function () {
                if (this._spinnerActivated) {
                    try  {
                        var defCSS = wijmo.grid.wijgrid.CSS;

                        this.mOuterDiv.find("> ." + defCSS.loadingOverlay + ", > ." + defCSS.loadingText).remove();
                    } finally {
                        this._spinnerActivated = false;
                    }
                }
            };

            wijgrid.prototype._prepareTotalsRequest = function () {
                var leaves = this._leaves(), result;

                if (!leaves || !this.options.showFooter) {
                    return [];
                }

                result = $.map(leaves, function (column, index) {
                    var opt = column.options;

                    if ((column instanceof grid.c1field) && opt.aggregate && opt.aggregate !== "none") {
                        return [column];
                    }

                    return null;
                });

                return result;
            };

            wijgrid.prototype._groupedLeaves = function (force) {
                var result;

                force = !(result = this.mGroupedLeaves) || force;

                if (force) {
                    result = [];

                    var leaves = this._leaves(), rebuildIndexes = false;

                    $.each(leaves, function (i, leaf) {
                        if (grid.c1field.isGroupedColumn(leaf)) {
                            rebuildIndexes = rebuildIndexes || (leaf.options.groupedIndex === undefined);

                            if (!rebuildIndexes) {
                                result.push(leaf);
                            }
                        } else {
                            delete leaf.options.groupedIndex;
                        }
                    });

                    if (rebuildIndexes) {
                        $.each(leaves, function (i, leaf) {
                            if (grid.c1field.isGroupedColumn(leaf)) {
                                leaf.options.groupedIndex = result.length;
                                result.push(leaf);
                            }
                        });
                    } else {
                        result.sort(function (a, b) {
                            return a.options.groupedIndex - b.options.groupedIndex;
                        });

                        $.each(result, function (i, column) {
                            column.options.groupedIndex = i;
                        });
                    }

                    this.mGroupedLeaves = result;
                }

                return result || [];
            };

            wijgrid.prototype._ensureRenderableBounds = function (bounds) {
                return wijmo.grid.ensureBounds(bounds, this._renderableRowsCount() - 1);
            };

            wijgrid.prototype._ensureTotalRowsBounds = function (bounds) {
                return wijmo.grid.ensureBounds(bounds, this._totalRowsCount() - 1);
            };

            wijgrid.prototype._ensureLowerBoundVisible = function (bounds) {
                var visibleQty = this._renderableRowsCount();

                if (bounds.end >= visibleQty) {
                    var view = this._view(), size = view.getVirtualPageSize(false);

                    bounds.end = visibleQty - 1;
                    bounds.start = bounds.end - size + 1;

                    bounds.start = Math.max(0, bounds.start);
                    bounds.end = Math.max(0, bounds.end);
                }

                return bounds;
            };

            wijgrid.prototype._renderableColumnsRange = function () {
                return this.mRenderableColumns;
            };

            wijgrid.prototype._renderableRowsRange = function () {
                return this.mRenderableRows;
            };

            wijgrid.prototype._rebuildRenderableRowsCollection = function () {
                var start = -1, end = -1, rangeFound = false, total = this._totalRowsCount();

                this.mRenderableRows = new wijmo.grid.renderableRowsCollection(total - 1);

                if (this._allowVVirtualScrolling() && this._serverSideVirtualScrolling()) {
                    this.mRenderableRows.add({ start: 0, end: total - 1 }); // all rows, groping is disabled
                } else {
                    if (!this._allowVVirtualScrolling() || !this._hasGrouping()) {
                        // assumption: if there is no grouping, then all sketch rows are visible
                        this.mRenderableRows.add({ start: 0, end: total - 1 }); // all rows
                    } else {
                        for (var i = 0; i < this.mSketchTable.count(); i++) {
                            var sketchItem = this.mSketchTable.row(i);

                            if (sketchItem.extInfo.state & 1 /* hidden */) {
                                if (start >= 0) {
                                    this.mRenderableRows.add({ start: start, end: end });
                                    rangeFound = false;
                                }

                                start = end = -1;
                            } else {
                                if (start < 0) {
                                    rangeFound = true;
                                    start = end = i;
                                } else {
                                    end++;
                                }
                            }
                        }

                        if (rangeFound) {
                            this.mRenderableRows.add({ start: start, end: end });
                        }
                    }
                }
            };

            wijgrid.prototype._refresh = function (userData) {
                // apply grouping
                new wijmo.grid.grouper().group(this, this.mSketchTable);

                // apply merging
                new wijmo.grid.merger().merge(this, this.mSketchTable);

                this._rebuildRenderableRowsCollection();

                //this._ensureViewPortBounds(this._viewPortBounds());
                // view
                if (this._lgGetScrollMode() !== "none") {
                    this.mView = new wijmo.grid.fixedView(this, this._viewPortBounds());
                } else {
                    this.mView = new wijmo.grid.flatView(this, this._viewPortBounds());
                }

                this._render();

                // pager
                if (this.options.allowPaging) {
                    // top pager
                    if (this.mTopPagerDiv) {
                        this.mTopPagerDiv.wijpager(this._pagerSettings2PagerWidgetSettings()).css("zIndex", 4);
                    }

                    // bottom pager
                    if (this.mBottomPagerDiv) {
                        this.mBottomPagerDiv.wijpager(this._pagerSettings2PagerWidgetSettings()).css("zIndex", 4);
                    }
                }
                // (re)create iternal widgets
            };

            wijgrid.prototype._refreshVirtual = function (userData) {
                var scrollData = userData.virtualScrollData, direction = userData.virtualScrollData.direction;

                if (direction === "h") {
                    this._view().render(true);
                } else {
                    var diffData = {
                        top: 0,
                        bottom: 0
                    };

                    if (scrollData.data) {
                        diffData = this._processVirtualData(scrollData);
                    }

                    this._updateRowInfos(scrollData, diffData);

                    this._renderVirtualIntoView(scrollData);
                }
                // debug
                /*var rows = this._view().bodyRows();
                for (var i = 0; i < rows.length(); i++) {
                var ri = this._view()._getRowInfo(rows.item(i));
                var innerDiv = ri.$rows.find("td:first ." + wijmo.grid.wijgrid.CSS.wijgridCellContainer);
                var html = innerDiv.html();
                
                html = "d:" + ri.dataItemIndex + " s:" + ri.sectionRowIndex + "  ||" + ri.data[0] + "|| " + html;
                innerDiv.html(html);
                }*/
                // debug
                /*if (scrollData.data && scrollData.mode === intersectionMode.reset) {
                this._view().vsUI.scrollToRow(scrollData.newBounds.start, true); // original scrollIndex could change due pageSize alignment, so we need to re-set position of the vertical scrollbar.
                }*/
            };

            wijgrid.prototype._updateRowInfos = function (scrollData, diffData) {
                var bounds = this._viewPortBounds(), view = this._view(), newBounds = scrollData.newBounds, rows = this._view().bodyRows(), relMatch, i, diff, rowInfo;

                switch (scrollData.mode) {
                    case 3 /* reset */:
                        break;

                    case 2 /* overlapBottom */:
                        relMatch = {
                            start: newBounds.start - bounds.start,
                            end: bounds.end - bounds.start
                        };

                        diff = newBounds.start - bounds.start;

                        for (i = relMatch.start; i <= relMatch.end; i++) {
                            rowInfo = view._getRowInfo(rows.item(i), false);

                            rowInfo.sectionRowIndex -= diff;

                            if (diffData.top !== 0) {
                                rowInfo.dataItemIndex += diffData.top;
                            }

                            view._setRowInfo(rowInfo.$rows, rowInfo);
                        }

                        break;

                    case 1 /* overlapTop */:
                        relMatch = {
                            start: bounds.start - bounds.start,
                            end: newBounds.end - bounds.start
                        };

                        diff = bounds.start - newBounds.start;

                        for (i = relMatch.start; i <= relMatch.end; i++) {
                            rowInfo = view._getRowInfo(rows.item(i), false);
                            rowInfo.sectionRowIndex += diff;

                            if (diffData.top !== 0) {
                                rowInfo.dataItemIndex += diffData.top;
                            }

                            view._setRowInfo(rowInfo.$rows, rowInfo);
                        }

                        break;
                }
            };

            wijgrid.prototype._renderVirtualIntoView = function (scrollData) {
                var bounds = this._viewPortBounds(), self = this, sketchRow, view = this._view(), match, i, sectionRowIndex;

                view._ensureRenderHBounds();

                switch (scrollData.mode) {
                    case 3 /* reset */:
                        // remove all rows
                        view._clearBody();

                        // add new rows
                        var count = scrollData.newBounds.end - scrollData.newBounds.start + 1;

                        this._renderableRowsRange().forEachIndex(scrollData.newBounds.start, count, function (sketchIndex) {
                            sketchRow = self.mSketchTable.row(sketchIndex - self.mDataOffset);
                            view._insertBodyRow(sketchRow, -1, sketchRow.dataItemIndex(), sketchIndex);
                        });

                        view._rebuildOffsets();

                        break;

                    case 2 /* overlapBottom */:
                        match = {
                            start: scrollData.newBounds.start,
                            end: bounds.end
                        };

                        for (i = 0; i < match.start - bounds.start; i++) {
                            view._removeBodyRow(0);
                        }

                        // add new rows to the bottom
                        var count = scrollData.newBounds.end - match.end;

                        this._renderableRowsRange().forEachIndex(match.end + 1, count, function (sketchIndex) {
                            sketchRow = self.mSketchTable.row(sketchIndex - self.mDataOffset);
                            view._insertBodyRow(sketchRow, -1, sketchRow.dataItemIndex(), sketchIndex);
                        });

                        break;

                    case 1 /* overlapTop */:
                        match = {
                            start: bounds.start,
                            end: scrollData.newBounds.end
                        };

                        for (i = 0; i < bounds.end - scrollData.newBounds.end; i++) {
                            view._removeBodyRow(match.end - match.start + 1); // relative index starting from zero.
                        }

                        // add new tows to the top
                        sectionRowIndex = 0;

                        var count = bounds.start - scrollData.newBounds.start;

                        this._renderableRowsRange().forEachIndex(scrollData.newBounds.start, count, function (sketchIndex) {
                            sketchRow = self.mSketchTable.row(sketchIndex - self.mDataOffset);
                            view._insertBodyRow(sketchRow, sectionRowIndex++, sketchRow.dataItemIndex(), sketchIndex);
                        });

                        break;

                    default:
                        break;
                }
            };

            wijgrid.prototype._processVirtualData = function (scrollData) {
                var dvw = this.mDataViewWrapper, source = dvw.dataView().getSource(), dataItem, leaves = this._leaves(), i, alignedViewBounds, cachedBounds, exceeded = 0, dataDiff = {
                    top: 0,
                    bottom: 0
                }, margin = this._serverSideVirtualScrollingMargin();

                switch (scrollData.mode) {
                    case 3 /* reset */:
                        this.mSketchTable.clear();
                        dvw._unsafeSplice(0, source.length);

                        this.mDataOffset = scrollData.request.index;

                        for (i = 0; i < scrollData.data.length; i++) {
                            dvw._unsafePush(dataItem = scrollData.data[i]); // append rows to a dataStore
                            this.mSketchTable.add(this._buildSketchRow(dvw._wrapDataItem(dataItem, i), leaves));
                        }

                        break;

                    case 2 /* overlapBottom */:
                        for (i = 0; i < scrollData.data.length; i++) {
                            dvw._unsafePush(dataItem = scrollData.data[i]); // append rows to a dataStore
                            this.mSketchTable.add(this._buildSketchRow(dvw._wrapDataItem(dataItem, source.length - 1), leaves));
                        }

                        dataDiff.bottom = scrollData.data.length;

                        break;

                    case 1 /* overlapTop */:
                        for (i = scrollData.data.length - 1; i >= 0; i--) {
                            dvw._unsafeSplice(0, 0, dataItem = scrollData.data[i]);
                            this.mSketchTable.insert(0, this._buildSketchRow(dvw._wrapDataItem(dataItem, i), leaves));
                        }

                        this.mDataOffset = scrollData.request.index;

                        dataDiff.top = scrollData.data.length;

                        break;
                }

                // extend underlying data *
                // * remove cached items exceeded cached bounds
                // [margin][pageSize = viewBounds][margin]
                alignedViewBounds = this._ensureTotalRowsBounds({
                    start: scrollData.newBounds.start,
                    end: scrollData.newBounds.end
                });

                cachedBounds = {
                    start: this.mDataOffset,
                    end: this.mDataOffset + source.length - 1
                };

                // remove items from the bottom
                exceeded = (cachedBounds.end - alignedViewBounds.end) - margin;
                if (exceeded > 0) {
                    dataDiff.bottom -= exceeded;
                    dvw._unsafeSplice(source.length - exceeded, exceeded);
                    this.mSketchTable.removeLast(exceeded);
                }

                // remove items from the top
                exceeded = (alignedViewBounds.start - cachedBounds.start) - margin;
                if (exceeded > 0) {
                    dataDiff.top -= exceeded;
                    dvw._unsafeSplice(0, exceeded);
                    this.mSketchTable.removeFirst(exceeded);
                    this.mDataOffset += exceeded;
                }

                // remove data exceeded cached bounds *
                // * update metadata
                this.mSketchTable.updateIndexes();

                // update metadata *
                dvw._refreshSilent();

                return dataDiff;
            };

            wijgrid.prototype._needToCreatePagerItem = function () {
                return this.options.allowPaging === true;
            };

            wijgrid.prototype._isMobileEnv = function () {
                return this._isMobile;
            };

            wijgrid.prototype._isTouchEnv = function () {
                return !!($.support.isTouchEnabled && $.support.isTouchEnabled());
            };

            wijgrid.prototype._render = function () {
                var view = this._view(), o = this.options, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this.options.wijCSS, content;

                view.render(false);

                // YK: for fixing pager is not align to top and bottom when header is fixed.
                content = this.mOuterDiv;
                if (this._lgGetScrollMode() !== "none") {
                    // fixed header content
                    content = this.mOuterDiv.find("div." + defCSS.scroller + ":first");
                }

                this.mSuperPanelHeader = null;

                // ** top pager (top div)
                if (this.mTopPagerDiv) {
                    if (this.mTopPagerDiv.data("wijmo-wijpager")) {
                        this.mTopPagerDiv.wijpager("destroy");
                    }

                    this.mTopPagerDiv.remove();
                }

                this.mTopPagerDiv = null;

                if (this._needToCreatePagerItem() && ((o.pagerSettings.position === "top") || (o.pagerSettings.position === "topAndBottom"))) {
                    if (!this.mTopPagerDiv) {
                        content.prepend(this.mSuperPanelHeader = $("<div class=\"wijmo-wijsuperpanel-header\"></div>"));
                        this.mSuperPanelHeader.prepend(this.mTopPagerDiv = $("<div class=\"" + defCSS.headerArea + " " + wijCSS.wijgridHeaderArea + " " + wijCSS.header + " " + wijCSS.cornerTop + "\"></div>"));
                    }
                }

                // top pager **
                if (o.showGroupArea) {
                    this._processGroupArea(content);
                } else {
                    this.$groupArea = null;
                }

                // ** bottom pager (bottom div)
                if (this.mBottomPagerDiv) {
                    if (this.mBottomPagerDiv.data("wijmo-wijpager")) {
                        this.mBottomPagerDiv.wijpager("destroy");
                    }

                    this.mBottomPagerDiv.remove();
                }

                this.mBottomPagerDiv = null;

                if (this._needToCreatePagerItem() && ((o.pagerSettings.position === "bottom") || (o.pagerSettings.position === "topAndBottom"))) {
                    if (!this.mBottomPagerDiv) {
                        content.append(this.mBottomPagerDiv = $("<div class=\"" + defCSS.footerArea + " " + wijCSS.wijgridFooterArea + " wijmo-wijsuperpanel-footer " + wijCSS.stateDefault + " " + wijCSS.cornerBottom + "\"></div>"));
                    }
                }
                // bottom pager **
            };

            wijgrid.prototype._processGroupArea = function (content) {
                var _this = this;
                var self = this, groupCollection = this._groupedLeaves(), defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this.options.wijCSS;

                this.mGroupAreaColumns = [];
                this.$groupArea = $("<div class=\"" + wijCSS.content + " " + wijCSS.helperClearFix + " " + defCSS.groupArea + " " + wijCSS.wijgridGroupArea + "\"></div>");

                if (groupCollection.length > 0) {
                    $.each(groupCollection, function (index, column) {
                        var groupElement = $("<a href=\"#\"></a>").appendTo(self.$groupArea);
                        _this.mGroupAreaColumns.push(_this._createGroupAreaColumnHeader(groupElement, column));
                    });
                } else {
                    this.$groupArea.addClass(defCSS.groupAreaEmpty).css("padding", 0).html(this.options.groupAreaCaption || "&nbsp;");
                }

                if (!this.mSuperPanelHeader) {
                    content.prepend(this.mSuperPanelHeader = $("<div class=\"wijmo-wijsuperpanel-header\"></div>"));
                }

                this.mSuperPanelHeader.prepend(this.$groupArea);

                this._UIDragndrop(true).attachGroupArea(this.$groupArea);
            };

            wijgrid.prototype._createGroupAreaColumnHeader = function (element, column) {
                return new grid.c1groupedfield(this, column.options, element);
            };

            wijgrid.prototype._pagerSettings2PagerWidgetSettings = function () {
                return $.extend({}, this.options.pagerSettings, {
                    disabled: this.options.disabled,
                    pageCount: this.pageCount(),
                    pageIndex: this.options.pageIndex,
                    pageIndexChanging: $.proxy(this._onPagerWidgetPageIndexChanging, this),
                    pageIndexChanged: $.proxy(this._onPagerWidgetPageIndexChanged, this)
                });
            };

            wijgrid.prototype._showRowHeader = function () {
                return (this.options.showRowHeader === true) && (this._lgGetStaticColumnsAlignment() !== "right");
            };

            wijgrid.prototype._attachEvents = function () {
                var view = this._view(), $fe = view.focusableElement(), self = this, k = function (eventName) {
                    return eventName + "." + self.widgetName;
                };

                $fe.unbind(k("keydown")).bind(k("keydown"), $.proxy(this._onKeyDown, this));
                $fe.unbind(k("focusin")).bind(k("focusin"), $.proxy(this._onFocusIn, this));

                this._KeyDownEventListener();

                $.each(view.subTables(), function (index, element) {
                    var domTable = element.element();
                    if (domTable) {
                        if (domTable.tHead) {
                            $(domTable.tHead).unbind(k("click")).bind(k("click"), $.proxy(self._onClick, self));
                        }

                        if (domTable.tBodies.length) {
                            $(domTable.tBodies[0]).unbind(k("click")).bind(k("click"), $.proxy(self._onClick, self)).bind(k("dblclick")).bind(k("dblclick"), $.proxy(self._onDblClick, self)).bind(k("mousemove")).bind(k("mousemove"), $.proxy(self._onMouseMove, self)).bind(k("mouseout")).bind(k("mouseout"), $.proxy(self._onMouseOut, self));
                        }
                    }
                });

                $(window).bind("resize." + this.widgetName + "." + this._eventUID, $.proxy(this._onWinResize, this));
            };

            wijgrid.prototype._detachEvents = function (destroy) {
                var view = this._view(), self = this, $fe;

                this._windowResizeTimer = 0;
                $(window).unbind("resize." + this.widgetName + "." + this._eventUID);

                if (view) {
                    $fe = view.focusableElement();

                    $fe.unbind("." + this.widgetName);

                    $.each(view.subTables(), function () {
                        var domTable = this.element();

                        if (domTable) {
                            if (domTable.tHead) {
                                $(domTable.tHead).unbind("." + self.widgetName);
                            }

                            if (domTable.tBodies.length) {
                                $(domTable.tBodies[0]).unbind("." + self.widgetName);
                            }
                        }
                    });
                }
            };

            wijgrid.prototype._handleSort = function (column, multiSort) {
                var colOpt = column.options, columns = this.options.columns;

                if (this.options.allowSorting) {
                    var newSortDirection = ((colOpt.sortDirection === "none") ? "ascending" : ((colOpt.sortDirection === "ascending") ? "descending" : "ascending"));

                    var sortingArgs = {
                        column: colOpt,
                        sortDirection: newSortDirection,
                        sortCommand: colOpt.dataKey + " " + (newSortDirection === "ascending" ? "asc" : "desc")
                    };

                    if (this._onColumnSorting(sortingArgs)) {
                        colOpt.sortDirection = sortingArgs.sortDirection;

                        if (multiSort) {
                            colOpt.sortOrder = this.mCustomSortOrder++;
                        } else {
                            this.mCustomSortOrder = 1000; // reset to default

                            // reset sortDirection for all columns except sorting one and grouped columns
                            $.each(this._allColumns(), function (i, item) {
                                item.options.sortOrder = 0;

                                if (item instanceof grid.c1field) {
                                    var itemOpt = item.options;

                                    if (item !== column && !(itemOpt.groupInfo && itemOpt.groupInfo.position !== "none")) {
                                        itemOpt.sortDirection = "none";
                                    }
                                }
                            });
                        }

                        var sortedArgs = {
                            column: colOpt,
                            sortDirection: colOpt.sortDirection,
                            sortCommand: colOpt.dataKey + " " + (colOpt.sortDirection === "ascending" ? "asc" : "desc")
                        };

                        if (this._customPagingEnabled()) {
                            this._onColumnSorted(sortedArgs); // Allow user the ability to load a new data and refresh the grid.
                        } else {
                            this.ensureControl(true, {
                                afterRefresh: function () {
                                    this._onColumnSorted(sortedArgs);
                                }
                            });
                        }
                    }
                }
            };

            wijgrid.prototype._handleDragnDrop = function (dragInst, dropInst, at, dragInGroup, dropInGroup) {
                var drag = dragInst.options, drop = ((dropInst && dropInst.options) || null), dragSource = dragInGroup ? "groupArea" : "columns", dropSource = dropInGroup ? "groupArea" : "columns";

                if (dropInGroup) {
                    if (this._onColumnGrouping({ drag: drag, drop: drop, dragSource: dragSource, dropSource: dropSource, at: at })) {
                        this.ensureControl(true, {
                            beforeRefresh: function () {
                                if (!drop) {
                                    drag.groupedIndex = 0;
                                } else {
                                    switch (at) {
                                        case "left":
                                            drag.groupedIndex = drop.groupedIndex - 0.5;
                                            break;

                                        case "right":
                                            drag.groupedIndex = drop.groupedIndex + 0.5;
                                            break;
                                    }
                                }

                                if (!dragInGroup) {
                                    $.extend(true, drag, {
                                        groupInfo: {
                                            position: "header"
                                        }
                                    });
                                }
                            },
                            afterRefresh: function () {
                                this._onColumnGrouped({ drag: drag, drop: drop, dragSource: dragSource, dropSource: dropSource, at: at });
                            }
                        });
                    }
                } else {
                    var traverseList = this._allColumns(), dragAt = drag.parentIdx >= 0 ? traverseList[drag.parentIdx].options.columns : this.options.columns, dropAt = drop.parentIdx >= 0 ? traverseList[drop.parentIdx].options.columns : this.options.columns, dragLinearOffset = (dragAt === this.options.columns) ? this._virtualLeaves().length : 0, dropLinearOffset = (dropAt === this.options.columns) ? this._virtualLeaves().length : 0;

                    if (this._onColumnDropping({ drag: drag, drop: drop, at: at })) {
                        this.ensureControl(false, {
                            beforeRefresh: function () {
                                /* modifying the wijgrid.options.columns option */
                                dragAt.splice(drag.linearIdx - dragLinearOffset, 1);

                                switch (at) {
                                    case "left":
                                        if (dragAt === dropAt && drag.linearIdx < drop.linearIdx) {
                                            dropAt.splice(drop.linearIdx - dropLinearOffset - 1, 0, drag);
                                        } else {
                                            dropAt.splice(drop.linearIdx - dropLinearOffset, 0, drag);
                                        }
                                        break;

                                    case "right":
                                        if (dragAt === dropAt && drag.linearIdx < drop.linearIdx) {
                                            dropAt.splice(drop.linearIdx - dropLinearOffset, 0, drag);
                                        } else {
                                            dropAt.splice(drop.linearIdx - dropLinearOffset + 1, 0, drag);
                                        }
                                        break;

                                    case "center":
                                        drop.columns.push(drag);
                                        break;
                                }
                            },
                            afterRefresh: function () {
                                this._onColumnDropped({ drag: drag, drop: drop, at: at });
                            }
                        });
                    }
                }
            };

            wijgrid.prototype._handleFilter = function (column, rawOperator, rawValue) {
                var operator = (new wijmo.grid.filterOperatorsCache(this)).getByName(rawOperator), value, ok;

                if (operator) {
                    var opt = column.options;

                    if (operator.arity > 1) {
                        // check value
                        value = this.parse(opt, rawValue);
                        ok = (value !== null && (wijmo.grid.getDataType(opt) === "string" || !grid.isNaN(value)));
                    } else {
                        ok = true;
                    }

                    if (ok) {
                        var args = { column: opt, operator: operator.name, value: value };

                        if (this._onColumnFiltering(args)) {
                            opt.filterValue = args.value;
                            opt.filterOperator = args.operator;

                            this._resetDataProperitesOnFilterChanging();

                            if (this._customPagingEnabled()) {
                                this._onColumnFiltered({ column: opt }); // Allow user the ability to load a new data and refresh the grid.
                            } else {
                                this.ensureControl(true, {
                                    afterRefresh: function () {
                                        this._onColumnFiltered({ column: opt });
                                    }
                                });
                            }
                        }
                    }
                }
            };

            wijgrid.prototype._handleUngroup = function (column) {
                var opt = column.options;

                if (this._onColumnUngrouping({ column: opt })) {
                    this.ensureControl(true, {
                        beforeRefresh: function () {
                            delete opt.groupedIndex;

                            $.extend(true, opt, {
                                groupInfo: {
                                    position: "none"
                                }
                            });
                        },
                        afterRefresh: function () {
                            this._onColumnUngrouped({ column: opt });
                        }
                    });
                }
            };

            wijgrid.prototype._onVirtualScrolling = function (newBounds, request, mode, scrollIndex, completeCallback, data /* opt*/ ) {
                var self = this;

                this.ensureControl(this._serverSideVirtualScrolling(), {
                    virtualScrollData: {
                        direction: "v",
                        newBounds: newBounds,
                        request: request,
                        mode: mode,
                        data: data
                    },
                    beforeOnRendered: function (userData) {
                        var bounds = self._viewPortBounds();
                        $.extend(bounds, userData.virtualScrollData.newBounds);
                    },
                    afterRefresh: function (userData) {
                        self._view()._adjustRowsHeights();

                        if (completeCallback) {
                            completeCallback(scrollIndex);
                        }
                    }
                });
            };

            wijgrid.prototype._handleVerticalVirtualScrolling = function (scrollIndex, forceIntersectionMode, completeCallback) {
                if (typeof forceIntersectionMode === "undefined") { forceIntersectionMode = null; }
                var view = this._view(), bounds = this._viewPortBounds(), newBounds = this._ensureRenderableBounds({
                    start: scrollIndex,
                    end: scrollIndex + view.getVirtualPageSize() - 1
                }), cachedDataBounds = this._ensureTotalRowsBounds({
                    start: this.mDataOffset,
                    end: this.mDataOffset + this.mDataViewWrapper.dataView().count() - 1
                }), request = null, mode, virtualPageSize = this._view().getVirtualPageSize();

                // check viewBounds
                if (forceIntersectionMode) {
                    mode = forceIntersectionMode;
                } else {
                    if (newBounds.start > bounds.end || newBounds.end < bounds.start) {
                        mode = 3 /* reset */;
                    } else {
                        if (newBounds.start > bounds.start) {
                            mode = 2 /* overlapBottom */;
                        } else {
                            if (newBounds.start < bounds.start) {
                                mode = 1 /* overlapTop */;
                            } else {
                                mode = newBounds.start !== bounds.start || newBounds.end !== bounds.end ? 3 /* reset */ : 0 /* none */; // same range, "none"
                            }
                        }
                    }
                }

                // quick fix
                //mode = intersectionMode.reset;
                //
                // check dataBounds
                if (this._serverSideVirtualScrolling()) {
                    switch (mode) {
                        case 3 /* reset */:
                            request = {
                                index: scrollIndex,
                                maxCount: virtualPageSize
                            };

                            break;

                        case 2 /* overlapBottom */:
                            if (newBounds.end > cachedDataBounds.end) {
                                request = {
                                    index: cachedDataBounds.end + 1,
                                    maxCount: virtualPageSize
                                };
                            }

                            break;

                        case 1 /* overlapTop */:
                            if (newBounds.start < cachedDataBounds.start) {
                                request = {
                                    index: Math.max(0, cachedDataBounds.start - virtualPageSize),
                                    maxCount: 0
                                };
                                request.maxCount = cachedDataBounds.start - request.index;
                            }

                            break;
                    }
                }

                if (mode !== 0 /* none */) {
                    this._onVirtualScrolling(newBounds, request, mode, scrollIndex, completeCallback); // note: scrollIndex could be changed
                }
            };

            wijgrid.prototype._handleHorizontalVirtualScrolling = function (range, completeCallback) {
                //var view = this._view();
                //view.render(true);
                //this._attachEvents();
                //(<wijmo.grid.fixedView>view)._adjustRowsHeights();
                //completeCallback();
                var self = this;

                this.mRenderableColumns = range;
                this.mRenderedLeaves = [];

                this.ensureControl(false, {
                    virtualScrollData: {
                        direction: "h"
                    },
                    afterRefresh: function (userData) {
                        self._attachEvents();

                        if (completeCallback) {
                            completeCallback();
                        }
                    }
                });
            };

            wijgrid.prototype._serverSideVirtualScrolling = function () {
                return false;
            };

            wijgrid.prototype._serverSideVirtualScrollingMargin = function () {
                var margin = this._view().getVirtualPageSize() * 2;

                if (margin < 20) {
                    margin = 20;
                }

                return margin;
            };

            // * event handlers
            wijgrid.prototype._onColumnDropping = function (args) {
                return this._trigger("columnDropping", null, args);
            };

            wijgrid.prototype._onColumnDropped = function (args) {
                this._trigger("columnDropped", null, args);
            };

            wijgrid.prototype._onColumnGrouping = function (args) {
                return this._trigger("columnGrouping", null, args);
            };

            wijgrid.prototype._onColumnGrouped = function (args) {
                this._trigger("columnGrouped", null, args);
            };

            wijgrid.prototype._onColumnUngrouping = function (args) {
                return this._trigger("columnUngrouping", null, args);
            };

            wijgrid.prototype._onColumnUngrouped = function (args) {
                this._trigger("columnUngrouped", null, args);
            };

            wijgrid.prototype._onColumnFiltering = function (args) {
                return this._trigger("filtering", null, args);
            };

            wijgrid.prototype._onColumnFiltered = function (args) {
                this._trigger("filtered", null, args);
            };

            wijgrid.prototype._onFilterOperatorsListShowing = function (args) {
                this._trigger("filterOperatorsListShowing", null, args);
            };

            wijgrid.prototype._onColumnSorting = function (args) {
                return this._trigger("sorting", null, args);
            };

            wijgrid.prototype._onColumnSorted = function (args) {
                this._trigger("sorted", null, args);
            };

            wijgrid.prototype._onCurrentCellChanged = function (e, info) {
                var _this = this;
                var o = this.options, currentCell = this.currentCell(), rowInfo = currentCell.row(), completed = function () {
                    var currentCell = _this.currentCell(), dataRange = _this._getDataCellsRange(0 /* sketch */);

                    if (_this.options.highlightCurrentCell) {
                        var oldCell = new wijmo.grid.cellInfo(info.changingEventArgs.oldCellIndex, info.changingEventArgs.oldRowIndex, _this);

                        if (oldCell._isValid && dataRange._containsCellInfo(oldCell)) {
                            _this._highlightCellPosition(oldCell, false); // remove the old one
                        }

                        _this._highlightCellPosition(currentCell, true); // highlight the current one
                    }

                    var domCell;
                    if (info.setFocus && (domCell = currentCell.tableCell())) {
                        _this._setFocusOnCell(info.hasFocusedChild ? $(e.target) : $(domCell), info.hasFocusedChild, currentCell.columnInst());
                    }

                    _this._trigger("currentCellChanged");

                    // ** set selection
                    if (info.changeSelection) {
                        _this._updateSelection(e, info.selectionExtendMode);
                    }

                    // set selection **
                    // cell editing
                    var eventType = (e && (e.type || "").toLowerCase()) || "";
                    if (eventType === "click" && _this._editBySingleClick()) {
                        _this._beginEditInternal(e);
                    }
                };

                this.mCurrentCellLocker = true;

                // notify dataView
                this.mDataViewWrapper.currentPosition((rowInfo && (rowInfo.type & 2 /* data */)) ? rowInfo.dataItemIndex : -1);

                if (this._lgGetScrollMode() !== "none" && currentCell && !currentCell.isEqual(wijmo.grid.cellInfo.outsideValue)) {
                    var scrollToCell = currentCell, rowInfo = scrollToCell.row();

                    if (rowInfo && !(rowInfo.type & 2 /* data */) && !scrollToCell.tableCell()) {
                        scrollToCell = currentCell._clone();
                        scrollToCell.cellIndex(0);
                    }

                    this._view().scrollTo(scrollToCell, function () {
                        try  {
                            completed();
                        } finally {
                            _this.mCurrentCellLocker = false;
                        }
                    }, info);
                } else {
                    try  {
                        completed();
                    } finally {
                        this.mCurrentCellLocker = false;
                    }
                }
            };

            wijgrid.prototype._onPageIndexChanging = function (args) {
                return this._trigger("pageIndexChanging", null, args);
            };

            wijgrid.prototype._onPageIndexChanged = function (args) {
                this._trigger("pageIndexChanged", null, args);
            };

            wijgrid.prototype._onPagerWidgetPageIndexChanging = function (sender, args) {
                args.handled = true; // prevent wijpager from re-drawing
            };

            wijgrid.prototype._onPagerWidgetPageIndexChanged = function (sender, args) {
                this._setOption("pageIndex", args.newPageIndex);
            };

            wijgrid.prototype._onRendering = function (userData) {
                var view = this._view();

                this._rendered = false;

                if (userData.virtualScrollData) {
                    //this.selection().clear(); // clear selection
                    //if (this.options.highlightCurrentCell) {
                    //	this._highlightCellPosition(this.currentCell(), false); // remove highlighning
                    //}
                } else {
                    var currentCell = this._currentCell();
                    this.mCurrentCellPrevCycle = currentCell ? { x: currentCell.cellIndex(), y: currentCell.rowIndex(), dataItemIndex: currentCell.row() ? currentCell.row().dataItemIndex : -1 } : { x: -1, y: -1, dataItemIndex: -1 };

                    this._currentCell(null);

                    if (view) {
                        view.dispose();
                    }

                    this._detachEvents(false);

                    if (this.mRenderCounter === 0) {
                        wijmo.grid.emptyTable(this.element[0]); // IE workaround: clean original table manually during first rendering to avoid memory leak (#56601).
                    }

                    if (!this.mOuterDiv[0].style.height) {
                        // #64328: If height is empty then fix it temporary to avoid jumps of the page's vertical scrollbar. Height will be restored in the _onRendered method.
                        this._isHeightTemporaryFixed = true;
                        this.mOuterDiv.height(this.mOuterDiv.height());
                    }

                    this.element.detach();

                    this.element.css({
                        "table-layout": "",
                        "width": ""
                    });

                    this.element.empty();

                    this.mOuterDiv.empty();
                    this.mOuterDiv.append(this.element);

                    if (this._selectionui) {
                        this._selectionui.dispose();
                        this._selectionui = null;
                    }

                    if (this._resizerui) {
                        this._resizerui.dispose();
                        this._resizerui = null;
                    }

                    if (this._frozenerui) {
                        this._frozenerui.dispose();
                        this._frozenerui = null;
                    }

                    if (this.mKeyDownEventListener) {
                        this.mKeyDownEventListener.dispose();
                        this.mKeyDownEventListener = null;
                    }
                }

                this._trigger("rendering");
            };

            wijgrid.prototype._onRendered = function (userData) {
                var view = this._view(), currentCell, hasSelection = this.selection().selectedCells().length() > 0;

                this._rendered = true;
                this.mRenderCounter++;

                if (!userData.virtualScrollData) {
                    if (this._isHeightTemporaryFixed) {
                        this._isHeightTemporaryFixed = false;
                        this.mOuterDiv[0].style.height = "";
                    }

                    this.mSelection = null; // always recreate selection object

                    // attach events
                    this._attachEvents();

                    // ** current cell
                    this._setAttr(view.focusableElement(), "tabIndex", 0); // to handle keyboard\ focus events

                    currentCell = this._currentCellFromDataView(this.mCurrentCellPrevCycle.x);

                    if (!currentCell._isValid() && this.options.showSelectionOnRender) {
                        currentCell = this._getFirstDataRowCell(0);
                    }

                    this.currentCell(currentCell, null, true);

                    // current cell *
                    // selection ui
                    this._UISelection(true);

                    this._setSizeInternal(this.mScrollingState); // set sizes, create wijsuperpanel, restore scrolling state.

                    //frozener
                    if (this._lgGetScrollMode() !== "none") {
                        this._frozenerui = new wijmo.grid.uiFrozener(this);
                    }
                } else {
                    var currentCell = this.currentCell();
                    this.currentCell(currentCell, null, false);

                    if (currentCell._isEdit() && !currentCell._isRendered()) {
                        currentCell._isEdit(false); // reset editing if sketchRow or column is not available (C1GridView virtual scrolling)
                    }

                    var selection = this.selection();
                    selection._ensureSelection();
                }

                // initialize resizer.
                if (!userData.virtualScrollData || this._allowHVirtualScrolling()) {
                    this._recreateResizerUI();
                }

                this._trigger("rendered");
            };

            wijgrid.prototype._recreateResizerUI = function () {
                var _this = this;
                if (this._resizerui) {
                    this._resizerui.dispose();
                }

                this._resizerui = new wijmo.grid.uiResizer(this);

                var leaves = this._allowHVirtualScrolling() ? this.columns() : this._renderedLeaves();

                $.each(leaves, function (idx, leaf) {
                    if (leaf._isRendered() && leaf.options.isLeaf) {
                        _this._resizerui.addElement(leaf);
                    }
                });
            };

            // note: can be called by the _onFocusIn method!
            wijgrid.prototype._onClick = function (e) {
                if (!this._canInteract() || !e.target) {
                    return;
                }

                var view = this._view(), clickedCell = this._findUntilOuterDiv(e.target, { td: true, th: true }), $row, clickedCellInfo, extendMode = 0 /* none */, currentCell, selection, clickedCellChanged = false, clickEvent = !!(e && (e.type === "click"));

                if (clickedCell) {
                    if (clickEvent && $(e.target).hasClass(wijmo.grid.wijgrid.CSS.groupToggleVisibilityButton)) {
                        this._onGroupBtnClick(e);

                        // #29676: stop event from bubbling up to the parent grid (if available)
                        e.stopPropagation();
                        return false;
                    }

                    $row = $(clickedCell).closest("tr");

                    if (!$row.length) {
                        return;
                    }

                    clickedCellInfo = view.getAbsoluteCellInfo(clickedCell, false);

                    if ($row.hasClass(wijmo.grid.wijgrid.CSS.dataRow) || $row.hasClass(wijmo.grid.wijgrid.CSS.headerRow)) {
                        if (clickedCellInfo.cellIndex() < 0 || clickedCellInfo.rowIndex() < 0) {
                            if (clickedCellInfo.rowIndex() >= 0) {
                                // move current cell to the first cell of the clicked row
                                clickedCellInfo = new wijmo.grid.cellInfo(0, clickedCellInfo.rowIndex());
                                extendMode = 2 /* row */;
                                clickedCellChanged = true;
                            } else {
                                if (clickedCellInfo.cellIndex() >= 0) {
                                    // move current cell to the first data cell of the clicked column
                                    clickedCellInfo = this._getFirstDataRowCell(clickedCellInfo.cellIndex());
                                    extendMode = 1 /* column */;
                                    clickedCellChanged = true;
                                }
                            }
                        }

                        if (!clickedCellChanged) {
                            clickedCellInfo = view.getAbsoluteCellInfo(clickedCell, true);
                        }

                        // change current cell and set focus to it (if the target element is not already focused)
                        this._changeCurrentCell(e, clickedCellInfo, {
                            changeSelection: true,
                            setFocus: clickEvent,
                            selectionExtendMode: extendMode
                        });
                    }

                    if (clickEvent) {
                        var cellClickedArgs = { cell: clickedCellInfo };
                        this._trigger("cellClicked", null, cellClickedArgs);
                    }
                }
            };

            wijgrid.prototype._onDblClick = function (e) {
                if (!this._editBySingleClick()) {
                    this._beginEditInternal(e);
                }
            };

            wijgrid.prototype._onGroupBtnClick = function (e) {
                if (!this._canInteract()) {
                    return;
                }

                var $row = $(e.target).closest("tr"), gh = wijmo.grid.groupHelper, groupInfo = gh.getGroupInfo($row[0]), self = this;

                if (groupInfo) {
                    var column = gh.getColumnByGroupLevel(this._leaves(), groupInfo.level);

                    if (column) {
                        var group = column.options.groupInfo.expandInfo[groupInfo.index];

                        if (group.isExpanded) {
                            group.collapse(this, column);
                        } else {
                            group.expand(this, column, e.shiftKey);
                        }

                        if (this._allowVVirtualScrolling()) {
                            this._rebuildRenderableRowsCollection();
                            this._view().vsUI._changeVisibleRowsCount(this._renderableRowsRange().capacity());

                            this._ensureLowerBoundVisible(this._viewPortBounds());

                            this._handleVerticalVirtualScrolling(this._viewPortBounds().start, 3 /* reset */);
                        }

                        //this._view().ensureHeight(); /*dma*/
                        this.setSize(); // recalculate sizes (#39295)
                    }
                }
            };

            wijgrid.prototype._onKeyDown = function (e) {
                var isKeyDownListenerElement = this._KeyDownEventListener().isHiddenInput($(e.target));

                if (!this._canInteract() || (isKeyDownListenerElement && this._KeyDownEventListener().canHandle(e))) {
                    return true;
                }

                var tag = e.target.tagName.toLowerCase(), $target = $(e.target), currentCell = this.currentCell(), keyCodeEnum = wijmo.getKeyCodeEnum();

                if (!isKeyDownListenerElement && (tag === "input" || tag === "option" || tag === "select" || tag === "textarea") && ($target.closest("tr.wijmo-wijgrid-datarow").length === 0)) {
                    return true;
                }

                if (this._allowCellEditing()) {
                    // ESC: cancel editing, F2: finish editing
                    if ((e.which === keyCodeEnum.ESCAPE || e.which === 113) && (currentCell._isValid() && currentCell._isEdit())) {
                        this._endEditInternal(e, e.which === keyCodeEnum.ESCAPE);
                        return false;
                    } else {
                        if (e.which === 113) {
                            this._beginEditInternal(e);
                            return false;
                        }
                    }
                }

                if (!this.options.allowKeyboardNavigation) {
                    return true;
                }

                var nextCell;

                switch (e.which) {
                    case keyCodeEnum.DOWN:
                    case keyCodeEnum.PAGE_DOWN:
                    case keyCodeEnum.UP:
                    case keyCodeEnum.PAGE_UP:
                    case keyCodeEnum.LEFT:
                    case keyCodeEnum.RIGHT:
                    case keyCodeEnum.HOME:
                    case keyCodeEnum.END:
                    case keyCodeEnum.TAB:
                        if (e.which === keyCodeEnum.TAB) {
                            var visibleLeaves = this._visibleLeaves();

                            // There is no data in the grid, will bubble the keydown event out of the grid.
                            if (!visibleLeaves || !visibleLeaves.length) {
                                return true;
                            }
                        }

                        if (isKeyDownListenerElement || this._canMoveToAnotherCell(e.target, e.which)) {
                            var dataRange = this._getDataCellsRange(2 /* renderable */);
                            nextCell = this._getNextCurrentCell(dataRange, currentCell, e.keyCode, e.shiftKey);
                        }

                        break;
                }

                if (nextCell) {
                    // change current cell and set focus to it (always set focus to change the IME mode).
                    this._changeCurrentCell(e, nextCell, { changeSelection: true, setFocus: true });
                    return false;
                }

                return true;
            };

            wijgrid.prototype._onFocusIn = function (e) {
                if (this.options.allowKeyboardNavigation && e && e.target && $(e.target).is(":input") && !this._KeyDownEventListener().isHiddenInput($(e.target))) {
                    this._onClick(e); // simulate a click
                }
            };

            wijgrid.prototype._onMouseMove = function (e) {
                if (!this.options.highlightOnHover || !this._canInteract() || (this._frozenerui && this._frozenerui.inProgress())) {
                    return;
                }

                var hovCell = this._findUntilOuterDiv(e.target, { td: true, th: true });

                if (hovCell) {
                    var hovRow = $(hovCell).closest("tr");

                    if (!hovRow.length || !(hovRow.hasClass(wijmo.grid.wijgrid.CSS.dataRow) || hovRow.hasClass(wijmo.grid.wijgrid.CSS.headerRow))) {
                        return;
                    }

                    var hovCellInfo = this._view().getAbsoluteCellInfo(hovCell, true), hovSketchIndex = hovCellInfo.rowIndex();

                    if (hovSketchIndex !== this._hover()) {
                        this._hover(-1); // clear previous row
                        this._hover(hovSketchIndex); // highlight current row
                    }
                }
            };

            wijgrid.prototype._onMouseOut = function (e) {
                if (!this._canInteract()) {
                    return;
                }

                if (this._hover() >= 0) {
                    var firstParentRow = this._findUntilOuterDiv(e.relatedTarget, { tr: true });

                    if (!firstParentRow || !$(firstParentRow).hasClass(wijmo.grid.wijgrid.CSS.dataRow)) {
                        this._hover(-1); // clear
                    }
                }
            };

            wijgrid.prototype._onWinResize = function (e) {
                var self = this;

                if (wijmo.grid.wijgrid.IGNORE_WIN_RESIZE) {
                    return;
                }

                // reset timer
                if (this._windowResizeTimer > 0) {
                    window.clearTimeout(this._windowResizeTimer);
                    this._windowResizeTimer = 0;
                }

                if (this._windowResizeTimer !== -1) {
                    this._windowResizeTimer = window.setTimeout(function () {
                        self._windowResizeTimer = -1; // lock

                        try  {
                            if (!self.mDestroyed && self._initialized && self.element.parent().length && self.element.is(":visible")) {
                                var orientation = wijmo.grid.getWindowOrientation();

                                // #64466: ignore Android (triggers "resize" event on virtual keyboard popup) except orientation changing.
                                var resize = !wijmo.grid.isAndroid() || (orientation !== self._winOrientation);

                                self._winOrientation = orientation;

                                if (resize) {
                                    self._onWindowResize();
                                    self.setSize();
                                }
                            }
                        } finally {
                            self._windowResizeTimer = 0; // unlock
                        }
                    }, wijmo.grid.wijgrid.WIN_RESIZE_TIMEOUT);
                }
            };

            wijgrid.prototype._onWindowResize = function () {
            };

            // * event handlers
            // * resizing
            wijgrid.prototype._fieldResized = function (column, oldWidth, newWidth) {
                if (oldWidth < 0) {
                    oldWidth = 0;
                }

                if (newWidth <= 0) {
                    newWidth = 1;
                }

                var resizingArgs = {
                    column: column.options,
                    oldWidth: oldWidth,
                    newWidth: newWidth
                };

                if (this._trigger("columnResizing", null, resizingArgs) !== false) {
                    if (grid.isNaN(resizingArgs.newWidth) || resizingArgs.newWidth < 0) {
                        resizingArgs.newWidth = 1;
                    }

                    column.option("width", resizingArgs.newWidth); // update widget option first (tfs issue 32108)

                    if (this._allowHVirtualScrolling()) {
                        this.doRefresh();
                    } else {
                        if (this._allowVVirtualScrolling() && !this._serverSideVirtualScrolling() && (this._lgGetScrollMode() === "auto")) {
                            var view = this._view();
                            if (view._isLastItemRendered() && view._canRenderMoreItems()) {
                                this.doRefresh(); // 82576 (virtual scrolling) - when any column is resized such that vscrollbar is visible and then the grid is scrolled down and any columm is resized again so that vscrollbar is removed then the first row is not displayed.
                            }
                        }
                    }

                    var resizedArgs = { column: column.options };
                    this._trigger("columnResized", null, resizedArgs);
                }
            };

            // * resizing
            wijgrid.prototype._setFocusOnCell = function (element, focusableChild, column) {
                if (focusableChild) {
                    //if (!element.is(":focus")) {
                    //	element.focus(); // ensure that element still has focus.
                    //}
                } else {
                    this._KeyDownEventListener().focus(element, column);
                }
            };

            wijgrid.prototype._findFocusedChild = function (parent) {
                var result = parent.find(":focus");
                return result.length ? result : null;
            };

            // * currentCell
            // returns false when currentCellChanging event was cancelled, otherwise true.
            wijgrid.prototype._changeCurrentCell = function (e, cellInfo, info) {
                if (this.mCurrentCellLocker) {
                    return;
                }

                var currentCell = this.currentCell(), dataRange = this._getDataCellsRange(0 /* sketch */);

                // if cellInfo has a valid value
                if ((dataRange._isValid() && dataRange._containsCellInfo(cellInfo)) || (cellInfo.isEqual(wijmo.grid.cellInfo.outsideValue))) {
                    var $target = e && e.target && $(e.target), domCell = cellInfo.tableCell(), $container = cellInfo.container(), $focusedChild = null;

                    info.hasFocusedChild = !!(domCell && $target && ($target[0] !== domCell) && ($target[0] !== $container[0]) && !this._KeyDownEventListener().isHiddenInput($target) && ($focusedChild = this._findFocusedChild($container))); // $focusedChild can differs from $target (#56472)

                    // other cell than current cell
                    if (currentCell.cellIndex() !== cellInfo.cellIndex() || currentCell.rowIndex() !== cellInfo.rowIndex()) {
                        var currentCellChangingArgs = {
                            cellIndex: cellInfo.cellIndex(),
                            rowIndex: cellInfo.rowIndex(),
                            oldCellIndex: currentCell.cellIndex(),
                            oldRowIndex: currentCell.rowIndex()
                        };

                        if (this._trigger("currentCellChanging", null, currentCellChangingArgs)) {
                            var cellEditCompleted = false;

                            if (!this._allowCellEditing() || !currentCell._isEdit() || (cellEditCompleted = this._endEditInternal(null))) {
                                info.changingEventArgs = currentCellChangingArgs;

                                currentCell = cellInfo._clone();
                                currentCell._setGridView(this);

                                this._currentCell(currentCell); // set currentCell

                                this._onCurrentCellChanged(e, info);
                            }
                        } else {
                            return false;
                        }
                    } else {
                        if (this.options.highlightCurrentCell) {
                            this._highlightCellPosition(currentCell, true); // ensure
                        }

                        if (info.changeSelection) {
                            this._updateSelection(e, info.selectionExtendMode); // ensure selection
                        }

                        if (domCell && !currentCell._isEdit()) {
                            if (e && this._editBySingleClick()) {
                                this.mCurrentCellLocker = true; // avoid focusin-click recursion if editingInitOption="click" and currentCell is clicked.
                                this._beginEditInternal(e);
                                this.mCurrentCellLocker = false;
                            } else {
                                if (info.setFocus) {
                                    this._setFocusOnCell(info.hasFocusedChild ? $focusedChild : $(domCell), info.hasFocusedChild, currentCell.columnInst());
                                }
                            }
                        }
                    }
                } else {
                    // do nothing
                    // this._highlightCellPosition(currentCell, false);
                    // this._field("currentCell", currentCell.outsideValue); // set currentCell
                }

                return true;
            };

            wijgrid.prototype._highlightCellPosition = function (cellInfo, add) {
                if (cellInfo && cellInfo._isValid()) {
                    var x = cellInfo.cellIndexAbs(), y = cellInfo.rowIndexAbs(), $rs = wijmo.grid.renderState, view = this._view(), rowInfo, obj, state;

                    // * column header cell * - change even if the cell is not rendered.
                    obj = view.getHeaderCell(x);
                    if (obj) {
                        rowInfo = view._getRowInfo(this._headerRows().item(cellInfo.column().thY));

                        obj = $(obj);
                        state = view._changeCellRenderState(obj, 2 /* current */, add);

                        // highlight column header cell
                        this.mCellStyleFormatter.format(obj, x, cellInfo.columnInst(), rowInfo, state);
                    }

                    if (cellInfo._isRendered()) {
                        // * row header cell *
                        obj = view.getJoinedRows(y, 0);
                        if (obj) {
                            // change row state
                            rowInfo = view._getRowInfo(obj);
                            view._changeRowRenderState(rowInfo, 2 /* current */, add);

                            // highlight row header cell
                            this.mRowStyleFormatter.format(rowInfo);
                        }

                        // * data cell *
                        obj = view.getCell(x, y);
                        if (obj) {
                            obj = $(obj);
                            state = view._changeCellRenderState(obj, 2 /* current */, add);

                            // highlight data cell
                            this.mCellStyleFormatter.format(obj, x, cellInfo.columnInst(), rowInfo, state); // rowInfo is taken from the previous step
                        }
                    }
                }
            };

            wijgrid.prototype._hover = function (sketchRowIndex) {
                if (arguments.length) {
                    if (sketchRowIndex >= 0) {
                        this._hoverRowCss(sketchRowIndex, true); // highlight
                        this._prevHoveredSketchRowIndex = sketchRowIndex;
                    } else {
                        this._hoverRowCss(this._prevHoveredSketchRowIndex, false); // clear
                        this._prevHoveredSketchRowIndex = -1;
                    }
                }

                return this._prevHoveredSketchRowIndex;
            };

            wijgrid.prototype._hoverRowCss = function (sketchRowIndex, add) {
                if (sketchRowIndex >= 0) {
                    var view = this._view(), row = view._getRowInfoBySketchRowIndex(sketchRowIndex);

                    if (row) {
                        view._changeRowRenderState(row, 4 /* hovered */, add);

                        if (row.$rows) {
                            this.mRowStyleFormatter.format(row);
                        }
                    }
                }
            };

            // * currentCell
            // * editing
            wijgrid.prototype._beginEditInternal = function (e) {
                if (this._canInteract() && this._allowCellEditing()) {
                    var cell = this.currentCell(), column = cell.column(), res;

                    if (column && !column.readOnly) {
                        res = new wijmo.grid.cellEditorHelper().cellEditStart(this, cell, e);

                        //if (res) {
                        //	this._view().ensureWidth(undefined, column.visLeavesIdx);
                        //}
                        return res;
                    }
                }

                return false;
            };

            wijgrid.prototype._endEditInternal = function (e, reject) {
                if (typeof reject === "undefined") { reject = false; }
                if (this._canInteract() && this._allowCellEditing()) {
                    var cell = this.currentCell(), cellEditor = new wijmo.grid.cellEditorHelper(), updateRes;

                    //Fix the TFS issue number (87950)
                    if (!cell.row().data) {
                        return false;
                    }

                    //Fix the TFS issue number (87950)
                    updateRes = cellEditor.updateCell(this, cell, e, reject);

                    if (updateRes & 2 /* success */) {
                        if (updateRes & 8 /* notEdited */) {
                            return true;
                        }

                        cellEditor.cellEditEnd(this, cell, e);

                        cell = this.currentCell();

                        // set focus to listen keypress\ keydown event.
                        var domCell = cell.tableCell();
                        if (domCell) {
                            this._KeyDownEventListener().focus($(domCell), cell.columnInst());
                        } else {
                            $(this._view().focusableElement()).focus();
                        }

                        if (!this._allowVVirtualScrolling() && !(cell.columnInst() instanceof grid.c1booleanfield)) {
                            this._view().ensureHeight(cell.rowIndex());
                        }

                        return true;
                    }
                }

                return false;
            };

            // * editing
            // * view handlers
            wijgrid.prototype._onViewInsertEmptyRow = function (rowType, renderState, sectionRowIndex, dataRowIndex, dataItemIndex, virtualDataItemIndex, groupByValue) {
                return null;
            };

            wijgrid.prototype._onViewCreateEmptyCell = function (rowInfo, dataCellIndex, column) {
                return null;
            };

            wijgrid.prototype._onViewCellRendered = function (cell, container, row, cellIndex, column) {
            };

            wijgrid.prototype._onViewRowRendered = function (rowInfo, rowAttr, rowStyle) {
            };

            wijgrid.prototype._readTableSection = function (table, scope, readAttributes) {
                var decodeHTML = (scope === 2 /* body */) && (this._serverShaping());
                return wijmo.grid.readTableSection(table, scope, decodeHTML, readAttributes);
            };

            wijgrid.prototype._getDataParser = function (column) {
                return column.dataParser || wijmo.data.defaultParsers[column.dataType] || wijmo.data.defaultParsers.string;
            };

            wijgrid.prototype._needParseColumnDOM = function (column) {
                return (wijmo.grid.getDataType(column) !== "string" && wijmo.grid.validDataKey(column.dataKey));
            };

            /** @ignore */
            wijgrid.prototype.parseCtx = function (column, value, dataItem, cell) {
                return this.parse(column, value);
            };

            /** @ignore */
            wijgrid.prototype.parseCtxFailed = function (column, value, dataItem, cell) {
                return value;
            };

            /** @ignore */
            wijgrid.prototype.parse = function (column, value) {
                //// old behaviour
                //var parser = this._getDataParser(column);
                //return parser.parse(value, this._field("closestCulture"), column.dataFormatString, this.options.nullString, true);
                var fromType = wijmo.grid.getDataType(column), toType = wijmo.grid.getDataType(column);

                if ($.isFunction(value)) {
                    value = value(); // observable
                }

                value = wijmo.data.convert(value, fromType, toType, {
                    culture: this.mClosestCulture,
                    format: column.dataFormatString,
                    nullString: this.options.nullString,
                    parser: column.dataParser
                });

                return value;
            };

            /** @ignore */
            wijgrid.prototype.toStr = function (column, value) {
                //// old behaviour
                //var parser = this._getDataParser(column);
                //return parser.toStr(value, this._field("closestCulture"), column.dataFormatString, this.options.nullString, true);
                var dataView = this.mDataViewWrapper.dataView(), fromType = wijmo.grid.getDataType(column), toType = "string";

                value = wijmo.data.convert(value, fromType, toType, {
                    culture: this.mClosestCulture,
                    format: column.dataFormatString,
                    nullString: this.options.nullString,
                    parser: column.dataParser
                });

                return value;
            };

            wijgrid.prototype._funcOptions = function () {
                return [
                    "cellStyleFormatter", "rowStyleFormatter", "afterCellEdit", "afterCellUpdate", "beforeCellEdit", "beforeCellUpdate",
                    "cellClicked",
                    "columnDragging", "columnDragged", "columnDropping", "columnDropped", "columnResizing", "columnResized",
                    "columnGrouping", "columnGrouped", "columnUngrouping", "columnUngrouped", "currentCellChanging", "currentCellChanged",
                    "filtering", "filtered",
                    "filterOperatorsListShowing", "groupAggregate", "groupText", "invalidCellValue", "pageIndexChanging", "pageIndexChanged",
                    "selectionChanged", "sorting", "sorted", "dataLoading", "dataLoaded", "loading", "loaded", "rendering", "rendered"];
            };

            wijgrid.prototype._canInteract = function () {
                return !this.options.disabled;
            };

            wijgrid.prototype._canMoveToAnotherCell = function (domElement, keyCode) {
                var tag = domElement.tagName.toLowerCase(), len, selectionRange, kc, res;

                switch (tag) {
                    case "input":
                        if ($(domElement).hasClass(wijmo.grid.wijgrid.CSS.inputMarker)) {
                            var input = domElement;

                            if (input.type === "text") {
                                len = input.value.length;
                                selectionRange = new wijmo.grid.domSelection(input).getSelection();

                                kc = wijmo.getKeyCodeEnum();

                                res = ((keyCode === kc.TAB) || (keyCode === kc.UP || keyCode === kc.DOWN || keyCode === kc.PAGE_DOWN || keyCode === kc.PAGE_UP) || (selectionRange.length === 0 && ((selectionRange.start === 0 && (keyCode === kc.LEFT || keyCode === kc.HOME)) || (selectionRange.end >= len && (keyCode === kc.RIGHT || keyCode === kc.END)))));

                                return res;
                            }

                            return true;
                        }

                        return false;

                    case "textarea":
                    case "select":
                        return false;
                }

                return true;
            };

            wijgrid.prototype._editBySingleClick = function () {
                var value = (this.options.editingInitOption || "").toLowerCase();

                switch (value) {
                    case "click":
                    case "doubleclick":
                        break;

                    case "auto":
                    default:
                        value = this._isMobileEnv() ? "click" : "doubleclick";
                        break;
                }

                return value === "click";
            };

            wijgrid.prototype._getDataToAbsOffset = function () {
                var x = 0, y = 0, headerRows = this._headerRows();

                x += this._virtualLeaves().length;

                if (headerRows) {
                    y += headerRows.length();
                }

                if (this._filterRow()) {
                    y++;
                }

                return {
                    x: x,
                    y: y
                };
            };

            wijgrid.prototype._currentCellFromDataView = function (cellIndex) {
                var dataViewRowIndex = this.mDataViewWrapper.currentPosition(), cellInfo = new wijmo.grid.cellInfo(cellIndex, this._dataViewDataRowIndexToGrid(dataViewRowIndex), null);

                // normalize
                if (cellInfo.rowIndex() < 0) {
                    cellInfo.cellIndex(-1);
                } else {
                    if (cellInfo.cellIndex() < 0) {
                        cellInfo.cellIndex(0);
                    }
                }

                return cellInfo;
            };

            wijgrid.prototype._dataViewDataRowIndexToGrid = function (rowIndex) {
                if ((rowIndex >= 0) && this.mSketchTable) {
                    for (var i = 0; i < this.mSketchTable.count(); i++) {
                        var sketchRow = this.mSketchTable.row(i);

                        if (sketchRow.isDataRow() && sketchRow.dataItemIndex() === rowIndex) {
                            return i;
                        }
                    }
                }

                return -1;
            };

            wijgrid.prototype._getDataCellsRange = function (mode, lastRowEntirelyVisible) {
                if (typeof lastRowEntirelyVisible === "undefined") { lastRowEntirelyVisible = false; }
                var minCol = 0, minRow = 0, maxCol = this._visibleLeaves().length - 1, maxRow;

                switch (mode) {
                    case 1 /* rendered */:
                        if (this._rendered) {
                            maxRow = this._rows().length() - 1;
                            break;
                        }

                    case 0 /* sketch */:
                        maxRow = this._totalRowsCount() - 1;
                        break;

                    case 2 /* renderable */:
                        maxRow = this._renderableRowsCount() - 1;
                        break;
                }

                maxCol -= this._virtualLeaves().length;

                if (lastRowEntirelyVisible && maxRow > 0) {
                    maxRow--;
                }

                if (maxCol < 0 || maxRow < 0) {
                    minCol = minRow = maxCol = maxRow = -1;
                }

                return new wijmo.grid.cellInfoRange(new wijmo.grid.cellInfo(minCol, minRow, null), new wijmo.grid.cellInfo(maxCol, maxRow, null));
            };

            wijgrid.prototype._getDataItem = function (dataItemIndex) {
                return this.dataView().item(dataItemIndex);
            };

            wijgrid.prototype._getFirstDataRowCell = function (absCellIndex) {
                var rowIndex, len, rowInfo, view = this._view(), rows = this._rows(), $rt = wijmo.grid.rowType;

                for (rowIndex = 0, len = rows.length(); rowIndex < len; rowIndex++) {
                    rowInfo = view._getRowInfo(rows.item(rowIndex));

                    if (rowInfo.type & 2 /* data */) {
                        return new wijmo.grid.cellInfo(absCellIndex, rowIndex);
                    }
                }

                return wijmo.grid.cellInfo.outsideValue;
            };

            wijgrid.prototype._getNextCurrentCell = function (dataRange, cellInfo, keyCode, shiftKeyPressed) {
                var cellIndex = cellInfo.cellIndex(), rowIndex = cellInfo.rowIndex(), keyCodeEnum = wijmo.getKeyCodeEnum(), sketchTable = this.mSketchTable, renderedRowIndex = this._renderableRowsRange().getRenderedIndex(rowIndex), rbc = this._renderableRowsRange(), tmp, dataRowsOnly = (keyCode === keyCodeEnum.TAB), self = this, sss = self._serverSideVirtualScrolling(), findNextVisibleRow = function (further, startFrom, maxRowsToTouch, dataRowsOnly) {
                    if (typeof dataRowsOnly === "undefined") { dataRowsOnly = false; }
                    var iterator = further ? rbc.forEachIndex : rbc.forEachIndexBackward, cnt = 0, result = null;

                    iterator.call(rbc, startFrom, -1, function (absIdx) {
                        var sketchIdx = absIdx - self.mDataOffset;

                        if (sss && (sketchIdx < 0 || sketchIdx >= sketchTable.count())) {
                            result = absIdx;
                            return false;
                        }

                        var sketchRow = sketchTable.row(sketchIdx), isDataRow = sketchRow.isDataRow();

                        // test dataType and visibility
                        if ((!dataRowsOnly || isDataRow) && (!(sketchRow.extInfo.state & 1 /* hidden */))) {
                            result = absIdx;

                            if (++cnt >= maxRowsToTouch) {
                                return false;
                            }
                        }
                    });

                    return result;
                };

                switch (keyCode) {
                    case keyCodeEnum.ENTER:
                    case keyCodeEnum.DOWN:
                        if ((tmp = findNextVisibleRow(true, renderedRowIndex + 1, 1)) != null) {
                            rowIndex = tmp;
                        }
                        break;

                    case keyCodeEnum.PAGE_DOWN:
                        if ((tmp = findNextVisibleRow(true, renderedRowIndex + 1, this.mPageSizeKey)) != null) {
                            rowIndex = tmp;
                        }
                        break;

                    case keyCodeEnum.UP:
                        if ((tmp = findNextVisibleRow(false, renderedRowIndex - 1, 1)) != null) {
                            rowIndex = tmp;
                        }
                        break;

                    case keyCodeEnum.PAGE_UP:
                        if ((tmp = findNextVisibleRow(false, renderedRowIndex - 1, this.mPageSizeKey)) != null) {
                            rowIndex = tmp;
                        }
                        break;

                    case keyCodeEnum.TAB:
                        // note: iterate through data rows only
                        if (shiftKeyPressed) {
                            cellIndex--;

                            if (cellIndex < dataRange.topLeft().cellIndex()) {
                                cellIndex = dataRange.bottomRight().cellIndex();

                                if ((tmp = findNextVisibleRow(false, renderedRowIndex - 1, 1, true)) != null) {
                                    rowIndex = tmp;
                                } else {
                                    if ((tmp = findNextVisibleRow(false, rbc.capacity() - 1, 1, true)) != null) {
                                        rowIndex = tmp;
                                    }
                                }
                            }
                        } else {
                            cellIndex++;

                            if (cellIndex > dataRange.bottomRight().cellIndex()) {
                                cellIndex = dataRange.topLeft().cellIndex();

                                if ((tmp = findNextVisibleRow(true, renderedRowIndex + 1, 1, true)) != null) {
                                    rowIndex = tmp;
                                } else {
                                    if ((tmp = findNextVisibleRow(true, 0, 1, true)) != null) {
                                        rowIndex = tmp;
                                    }
                                }
                            }
                        }

                        break;

                    case keyCodeEnum.END:
                        cellIndex = dataRange.bottomRight().cellIndex();
                        break;

                    case keyCodeEnum.HOME:
                        cellIndex = dataRange.topLeft().cellIndex();

                        break;

                    case keyCodeEnum.LEFT:
                        if (cellIndex > dataRange.topLeft().cellIndex()) {
                            cellIndex--;
                        }

                        break;

                    case keyCodeEnum.RIGHT:
                        if (cellIndex < dataRange.bottomRight().cellIndex()) {
                            cellIndex++;
                        }

                        break;
                }

                var nextCell = new wijmo.grid.cellInfo(cellIndex, rowIndex, this), column = nextCell.column();

                if (column && column.rowMerge && (column.rowMerge !== "none")) {
                    var lookDown = (keyCode == keyCodeEnum.ENTER || keyCode == keyCodeEnum.DOWN || keyCode == keyCodeEnum.PAGE_DOWN), test = nextCell._clone(), cell = null;

                    while (!(cell = test.tableCell()) && test._isRendered()) {
                        rowIndex = (lookDown) ? rowIndex + 1 : rowIndex - 1;
                        test = new wijmo.grid.cellInfo(cellIndex, rowIndex, this);
                    }

                    if (cell) {
                        nextCell = test;
                    }
                }

                return nextCell;
            };

            wijgrid.prototype._findUntilOuterDiv = function (start, tagsToFind) {
                var current = start, outerDiv = this.mOuterDiv[0], stopper, nodeName, item = null;

                for (; current; current = current.parentNode) {
                    nodeName = current.nodeName && current.nodeName.toLowerCase();

                    if (nodeName) {
                        if (current === outerDiv) {
                            stopper = current;
                            break;
                        }

                        if (tagsToFind[nodeName]) {
                            item = current;
                        }
                    }
                }

                return stopper ? item : null;
            };

            wijgrid.prototype._getStaticIndex = function (bRow) {
                var result, dataRange = this._getDataCellsRange(1 /* rendered */);

                if (this._hasSpannedCells()) {
                    return -1;
                }

                if (bRow) {
                    result = Math.min(this._lgGetStaticRowIndex(), dataRange.bottomRight().rowIndex());
                } else {
                    result = Math.min(this._lgGetStaticColumnIndex(), dataRange.bottomRight().cellIndex());
                }

                if (result < -1) {
                    result = -1;
                }

                return result;
            };

            wijgrid.prototype._getStaticOffsetIndex = function (isColumn) {
                var index = 0;

                if (isColumn) {
                    index += this._virtualLeaves().length; // row headers are always fixed
                } else {
                    index = this._columnsHeadersTable().length; //the whole header is fixed in case of staticRowIndex >= 0.

                    if (this.options.showFilter) {
                        index++; // filter row is placed inside the header, so it is fixed too.
                    }
                }

                return index;
            };

            // index of the fixed leaf inside the visibleLeaves collection.
            wijgrid.prototype._getRealStaticColumnIndex = function () {
                var offsetStaticIndex = this._getStaticOffsetIndex(true), staticColumnIndex = this._getStaticIndex(false), realIndex = staticColumnIndex + offsetStaticIndex;

                if (staticColumnIndex >= 0) {
                    var leaves = this._visibleLeaves(), allColumns = this._allColumns(), len = leaves.length;

                    if (offsetStaticIndex > 0) {
                        allColumns = allColumns.slice(offsetStaticIndex - 1, -1); // remove rowHeader
                    }

                    if (realIndex < len - 1) {
                        var parent = wijmo.grid.getTompostParent(leaves[realIndex], allColumns);

                        // If child column of some band is fixed then the top and right-most column of the root band contained current column will be fixed.
                        if (parent) {
                            for (realIndex++; realIndex < len; realIndex++) {
                                var nextParent = wijmo.grid.getTompostParent(leaves[realIndex], allColumns);
                                if (nextParent !== parent) {
                                    realIndex--;
                                    break;
                                }
                            }
                        }
                    }

                    if (realIndex >= len) {
                        realIndex = len - 1;
                    }
                }

                return realIndex;
            };

            wijgrid.prototype._getRealStaticRowIndex = function () {
                var offsetStaticIndex = this._getStaticOffsetIndex(false);

                return this._getStaticIndex(true) + offsetStaticIndex;
            };

            wijgrid.prototype._hasMerging = function () {
                var leaves = this._leaves(), result = false;

                for (var i = 0, len = leaves.length; (i < len) && !result; i++) {
                    var leafOpt = leaves[i].options;
                    result = result || (leafOpt.parentVis && (leafOpt.rowMerge && (leafOpt.rowMerge !== "none"))); // merged visible column?
                }

                return result;
            };

            wijgrid.prototype._hasBands = function () {
                var columns = this._allColumns();

                for (var i = 0; i < columns.length; i++) {
                    if (columns[i] instanceof wijmo.grid.c1bandfield) {
                        return true;
                    }
                }

                return false;
            };

            wijgrid.prototype._hasGrouping = function () {
                var leaves = this._leaves(), result = false;

                for (var i = 0, len = leaves.length; (i < len) && !result; i++) {
                    var leafOpt = leaves[i].options;
                    result = leafOpt.groupInfo && (leafOpt.groupInfo.position !== "none"); // grouped column?
                }

                return result;
            };

            wijgrid.prototype._hasSpannedCells = function () {
                return this._hasGrouping() || this._hasMerging();
            };

            wijgrid.prototype._columnsHeadersTable = function (value) {
                if (arguments.length) {
                    this.mColumnsHeadersTable = value;
                    ;
                }

                return this.mColumnsHeadersTable;
            };

            wijgrid.prototype._view = function () {
                return this.mView;
            };

            wijgrid.prototype._originalFooterRowData = function () {
                var footer = this.mTFoot;

                return (footer && footer.length) ? footer[0] : null;
            };

            wijgrid.prototype._originalHeaderRowData = function () {
                var header = this.mTHead;

                return (header && header.length) ? header[header.length - 1] : null;
            };

            // set one or more attribute and store original values in the this._originalAttr object if $element == this.element.
            // (key, value), (map)
            wijgrid.prototype._setAttr = function ($element, key, value) {
                var self = this;

                if ($element === this.element) {
                    if (arguments.length === 2) {
                        $.each(key, function (k, v) {
                            if (!(k in self._originalAttr)) {
                                self._originalAttr[k] = $element.attr(k);
                            }
                        });

                        return $element.attr(key);
                    } else {
                        if (!(key in this._originalAttr)) {
                            this._originalAttr[key] = $element.attr(key);
                        }

                        return $element.attr(key, value);
                    }
                } else {
                    return (arguments.length === 3) ? $element.attr(key, value) : $element.attr(key);
                }

                return this;
            };

            // used by virtual scrolling
            wijgrid.prototype._totalRowsCount = function () {
                /*if (this._dataStore.isDynamic()) {
                return this._dataStore.totalCount();
                }*/
                return this.mSketchTable.count();
            };

            wijgrid.prototype._renderableRowsCount = function () {
                return this._renderableRowsRange().capacity();
            };

            wijgrid.prototype._trackScrollingPosition = function (x, y, scrollLeft) {
                this.mScrollingState.x = x;
                this.mScrollingState.y = y;

                if (scrollLeft != null) {
                    this.mScrollingState.scrollLeft = scrollLeft;
                }
            };

            wijgrid.prototype._trackScrollingIndex = function (index) {
                this.mScrollingState.index = index;
            };

            wijgrid.prototype._uid = function () {
                if (this.__uid === undefined) {
                    this.__uid = wijmo.grid.getUID();
                }

                return "wijgrid" + this.__uid;
            };

            wijgrid.prototype._updateSelection = function (e, extendMode) {
                var eventType = (e && (e.type || "").toLowerCase()) || "", selection = this.selection(), currentCell = this.currentCell();

                extendMode = extendMode || 0 /* none */;

                selection.beginUpdate();

                if (eventType) {
                    if (currentCell._isValid()) {
                        switch (eventType) {
                            case "focusin":
                            case "click":
                                if (!e.shiftKey || !selection._multipleEntitiesAllowed()) {
                                    selection._startNewTransaction(currentCell);
                                }

                                if (e.shiftKey && e.ctrlKey) {
                                    selection._clearRange(new wijmo.grid.cellInfoRange(currentCell, currentCell), extendMode);
                                } else {
                                    selection._selectRange(new wijmo.grid.cellInfoRange(selection._anchorCell(), currentCell), e.ctrlKey, e.shiftKey, extendMode, null);
                                }

                                break;

                            case "keydown":
                                if (!e.shiftKey || !selection._multipleEntitiesAllowed()) {
                                    selection._startNewTransaction(currentCell);
                                }

                                selection._selectRange(new wijmo.grid.cellInfoRange(selection._anchorCell(), currentCell), false, e.shiftKey, 0 /* none */, null);

                                break;
                        }
                    }
                } else {
                    // * move selection to the current position *
                    selection.clear();

                    if (currentCell._isValid()) {
                        selection._startNewTransaction(currentCell); // attach selection to the current cell
                        selection._selectRange(new wijmo.grid.cellInfoRange(currentCell, currentCell), false, false, 0 /* none */, null);
                    }
                }

                selection.endUpdate();
            };

            wijgrid.prototype._viewPortBounds = function (value) {
                if (arguments.length) {
                    this.mViewPortBounds = value;
                }

                return this.mViewPortBounds;
            };

            //_viewPortBoundsOfEntirelyShownRows() {
            //	var bounds = this._viewPortBounds(),
            //		isLast = false,
            //		count = bounds.end - bounds.start + 1;
            //	if (this._allowVVirtualScrolling()) {
            //		var view = <fixedView> this._view();
            //		if (count < view.getVirtualPageSize()) {
            //			isLast = true;
            //		}
            //	}
            //	if (!isLast) {
            //		bounds = <IRenderBounds> $.extend({}, bounds);
            //		bounds.end--;
            //	}
            //	return bounds;
            //}
            //#region legacy
            // to support legacy scrolling properties.
            wijgrid.prototype._lgGetFreezingMode = function () {
                return this.options.freezingMode || this.options.scrollingSettings.freezingMode;
            };

            wijgrid.prototype._lgGetRowHeight = function () {
                if (this.options.rowHeight !== undefined) {
                    return this.options.rowHeight;
                }

                return this.options.scrollingSettings.virtualizationSettings.rowHeight;
            };

            wijgrid.prototype._lgGetStaticColumnsAlignment = function () {
                return this.options.staticColumnsAlignment || this.options.staticColumnsAlignment;
            };

            wijgrid.prototype._lgGetScrollMode = function () {
                return this.options.scrollMode || this.options.scrollingSettings.mode;
            };

            wijgrid.prototype._lgGetStaticColumnIndex = function () {
                if (this.options.staticColumnIndex !== undefined) {
                    return this.options.staticColumnIndex;
                }

                return this.options.scrollingSettings.staticColumnIndex;
            };

            wijgrid.prototype._lgGetStaticRowIndex = function () {
                if (this.options.staticRowIndex !== undefined) {
                    return this.options.staticRowIndex;
                }

                return this.options.scrollingSettings.staticRowIndex;
            };

            //#endregion legacy
            wijgrid.prototype._hideAllFilterDropDownLists = function () {
                $.each(this._visibleLeaves(), function (idx, leaf) {
                    if (leaf instanceof grid.c1field) {
                        leaf._hideDropDownList();
                    }
                });
            };
            wijgrid.WIN_RESIZE_TIMEOUT = 200;

            wijgrid.IGNORE_WIN_RESIZE = false;

            wijgrid.CSS = {
                wijgrid: "wijmo-wijgrid",
                root: "wijmo-wijgrid-root",
                editedCellMarker: "wijmo-wijgrid-cell-edit",
                inputMarker: "wijgridinput",
                table: "wijmo-wijgrid-table",
                TH: "wijgridth",
                TD: "wijgridtd",
                cellContainer: "wijmo-wijgrid-innercell",
                aggregateContainer: "wijmo-wijgrid-aggregate",
                rowHeader: "wijmo-wijgrid-rowheader",
                currentRowHeaderCell: "wijmo-wijgrid-current-rowheadercell",
                currentHeaderCell: "wijmo-wijgrid-current-headercell",
                currentCell: "wijmo-wijgrid-current-cell",
                cellAlignLeft: "wijalign-left",
                cellAlignRight: "wijalign-right",
                cellAlignCenter: "wijalign-center",
                filterList: "wijmo-wijgrid-filterlist",
                filter: "wijmo-wijgrid-filter",
                filterInput: "wijmo-wijgrid-filter-input",
                filterTrigger: "wijmo-wijgrid-filter-trigger",
                filterNativeHtmlEditorWrapper: "wijgrid-input-wrapper",
                headerArea: "wijmo-wijgrid-header",
                footerArea: "wijmo-wijgrid-footer",
                headerRow: "wijmo-wijgrid-headerrow",
                row: "wijmo-wijgrid-row",
                dataRow: "wijmo-wijgrid-datarow",
                altRow: "wijmo-wijgrid-alternatingrow",
                emptyDataRow: "wijmo-wijgrid-emptydatarow",
                filterRow: "wijmo-wijgrid-filterrow",
                groupHeaderRow: "wijmo-wijgrid-groupheaderrow",
                groupFooterRow: "wijmo-wijgrid-groupfooterrow",
                groupHeaderRowCollapsed: "wijmo-wijgrid-groupheaderrow-collapsed",
                groupHeaderRowExpanded: "wijmo-wijgrid-groupheaderrow-expanded",
                footerRow: "wijmo-wijgrid-footerrow",
                detailRow: "wijmo-wijgrid-detailrow",
                loadingOverlay: "wijmo-wijgrid-overlay",
                loadingText: "wijmo-wijgrid-loadingtext",
                groupArea: "wijmo-wijgrid-group-area",
                groupAreaEmpty: "wijmo-wijgrid-group-area-empty",
                groupAreaButton: "wijmo-wijgrid-group-button",
                groupAreaButtonSort: "wijmo-wijgrid-group-button-sort",
                groupAreaButtonClose: "wijmo-wijgrid-group-button-close",
                groupToggleVisibilityButton: "wijmo-wijgrid-grouptogglebtn",
                fixedView: "wijmo-wijgrid-fixedview",
                scroller: "wijmo-wijgrid-scroller",
                dndHelper: "wijmo-wijgrid-dnd-helper",
                dndArrowTopContainer: "wijmo-wijgrid-dnd-arrow-top",
                dndArrowBottomContainer: "wijmo-wijgrid-dnd-arrow-bottom",
                freezingHandleV: "wijmo-wijgrid-freezing-handle-v",
                freezingHandleH: "wijmo-wijgrid-freezing-handle-h",
                freezingHandleContent: "wijmo-wijgrid-freezing-handle-content",
                resizingHandle: "wijmo-wijgrid-resizehandle",
                headerCellSortIcon: "wijmo-wijgrid-sort-icon",
                headerCellText: "wijmo-wijgrid-headertext",
                c1basefield: "wijmo-c1basefield",
                c1band: "wijmo-c1band",
                c1field: "wijmo-c1field"
            };
            return wijgrid;
        })(wijmo.wijmoWidget);
        grid.wijgrid = wijgrid;

        wijgrid.prototype.widgetEventPrefix = "wijgrid";
        wijgrid.prototype.mDataPrefix = "wijgrid";
        wijgrid.prototype.mCustomSortOrder = 1000;
        wijgrid.prototype.mPageSizeKey = 10;

        var wijgrid_options = (function () {
            function wijgrid_options() {
                /** @ignore */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-b",
                    stateHover: "ui-btn-down-c",
                    stateActive: "ui-btn-down-c",
                    stateHighlight: "ui-btn-down-e"
                };
                this.wijCSS = {
                    wijgrid: "",
                    wijgridTable: "",
                    wijgridTH: "",
                    wijgridTD: "",
                    wijgridCellContainer: "",
                    wijgridRowHeader: "",
                    wijgridCurrentRowHeaderCell: "",
                    wijgridCurrentHeaderCell: "",
                    wijgridCurrentCell: "",
                    wijgridCellAlignLeft: "",
                    wijgridCellAlignRight: "",
                    wijgridCellAlignCenter: "",
                    wijgridFilterList: "",
                    wijgridFilter: "",
                    wijgridFilterInput: "",
                    wijgridFilterTrigger: "",
                    wijgridFilterNativeHtmlEditorWrapper: "",
                    wijgridHeaderArea: "",
                    wijgridFooterArea: "",
                    wijgridHeaderRow: "",
                    wijgridRow: "",
                    wijgridDataRow: "",
                    wijgridAltRow: "",
                    wijgridEmptyDataRow: "",
                    wijgridFilterRow: "",
                    wijgridGroupHeaderRow: "",
                    wijgridGroupFooterRow: "",
                    wijgridGroupHeaderRowCollapsed: "",
                    wijgridGroupHeaderRowExpanded: "",
                    wijgridFooterRow: "",
                    wijgridLoadingOverlay: "",
                    wijgridLoadingText: "",
                    wijgridGroupArea: "",
                    wijgridGroupAreaButton: "",
                    wijgridGroupAreaButtonSort: "",
                    wijgridGroupAreaButtonClose: "",
                    wijgridGroupToggleVisibilityButton: "",
                    wijgridFixedView: "",
                    wijgridScroller: "",
                    wijgridDndHelper: "",
                    wijgridDndArrowTopContainer: "",
                    wijgridDndArrowBottomContainer: "",
                    wijgridFreezingHandleV: "",
                    wijgridFreezingHandleH: "",
                    wijgridResizingHandle: "",
                    wijgridHeaderCellSortIcon: "",
                    wijgridHeaderCellText: ""
                };
                /** A value indicating whether columns can be moved.
                * @example
                * // Columns cannot be dragged and moved if this option is set to false
                * $("#element").wijgrid({ allowColMoving: false });
                * @remarks
                * This option must be set to true in order to drag column headers to the group area.
                */
                this.allowColMoving = false;
                /** Determines whether the column width can be increased and decreased by dragging the sizing handle, or the edge of the column header, with the mouse.
                * @example
                * // The sizing handle cannot be dragged and column width cannot be changed if this option is set to false
                * $("#element").wijgrid({ allowColSizing: false });
                */
                this.allowColSizing = false;
                /** Determines whether the user can make changes to cell contents in the grid.
                * This option is obsolete. Use the editingMode option instead.
                * @example
                * // Users cannot change cell contents in the grid if this option is set to false
                * $("#element").wijgrid({ allowEditing: false });
                */
                this.allowEditing = false;
                /** Determines whether the user can move the current cell using the arrow keys.
                * @example
                * // Users cannot move the selection using arrow keys if this option is set to false
                * $("#element").wijgrid({ allowKeyboardNavigation: false });
                */
                this.allowKeyboardNavigation = true;
                /** Determines whether the grid should display paging buttons. The number of rows on a page is determined by the pageSize option.
                * @example
                * // Grid displays paging buttons when allowPaging is true. The pageSize here sets 5 rows to a page.
                * $("#element").wijgrid({ allowPaging: false, pageSize: 5 });
                */
                this.allowPaging = false;
                /** Determines whether the widget can be sorted by clicking the column header.
                * @example
                * // Sort a column by clicking its header when allowSorting is set to true
                * $("#element").wijgrid({ allowSorting: false });
                */
                this.allowSorting = false;
                /** A value that indicates whether virtual scrolling is allowed. Set allowVirtualScrolling to true when using large amounts of data to improve efficiency.
                * Obsoleted, set the scrollingSettings.virtualization.mode property to "rows" instead.
                * @example
                * $("#element").wijgrid({ allowVirtualScrolling: false });
                * @remarks
                * This option is ignored if the grid uses paging, columns merging or fixed rows. This option cannot be enabled when using dynamic wijdatasource.
                */
                this.allowVirtualScrolling = false;
                /** A value that indicates calendar's options in grid. It works for calendar in inputdate.
                * @remarks Its value is wijcalendar's option, visit
                * http://wijmo.com/docs/wijmo/#Wijmo~jQuery.fn.-~wijcalendar.html for more details.
                * @type {object}
                * @example
                *      $("#eventscalendar").wijgrid(
                *      { calendar: { prevTooltip: "Previous", nextTooltip: "Next" } });
                */
                this.calendar = null;
                /** This function is called each time wijgrid needs to change cell appearence, for example, when the current cell position is changed or cell is selected.
                * Can be used for customization of cell style depending on its state.
                * @example
                * // Make the text of the current cell italic.
                * $("#element").wijgrid({
                *		highlightCurrentCell: true,
                *		cellStyleFormatter: function(args) {
                *			if ((args.row.type & wijmo.grid.rowType.data)) {
                *				if (args.state & wijmo.grid.renderState.current) {
                *					args.$cell.css("font-style", "italic");
                *				} else {
                *					args.$cell.css("font-style", "normal");
                *				}
                *			}
                *		}
                * });
                * @param {wijmo.grid.ICellStyleFormaterArgs} args The data with this function.
                * @remarks
                * The args.state parameters equal to wijmo.grid.renderState.rendering means that the cell is being created,
                * at this moment you can apply general formatting to it indepentant of any particular state, like "current" or "selected".
                */
                this.cellStyleFormatter = undefined;
                /** An array of column options.
                * @example
                * $("#element").wijgrid({ columns: [ { headerText: "column0", allowSort: false }, { headerText: "column1", dataType: "number" } ] });
                */
                this.columns = [];
                /** Determines behavior for column autogeneration. Possible values are: "none", "append", "merge".
                * @example
                * $("#element").wijgrid({ columnsAutogenerationMode: "merge" });
                * @remarks
                * Possible values are:
                * "none": Column auto-generation is turned off.
                * "append": A column will be generated for each data field and added to the end of the columns collection.
                * "merge": Each column having dataKey option not specified will be automatically bound to the first unreserved data field.For each data field not bound to any column a new column will be generated and added to the end of the columns collection.
                *
                * To prevent automatic binding of a column to a data field set its dataKey option to null.
                *
                * Note: columns autogeneration process affects the options of columns and the columns option itself.
                */
                this.columnsAutogenerationMode = "merge";
                /** Determines the culture ID.
                * @example
                * // This code sets the culture to English.
                * $("#element").wijgrid({ culture: "en" });
                * @remarks
                * Please see the https://github.com/jquery/globalize for more information.
                */
                this.culture = "";
                /** A value that indicators the culture calendar to format the text.
                * This option must work with culture option.
                * @example
                * // This code sets the culture and calendar to Japanese.
                * $("#element").wijgrid({ culture: "ja-jp", cultureCalendar: "Japanese" });
                */
                this.cultureCalendar = "";
                /** An array of custom user filters. Use this option if you want to extend the default set of filter operators with your own. Custom filters will be shown in the filter dropdown.
                * @example
                * var oddFilterOp = {
                *	name: "customOperator-Odd",
                *	arity: 1,
                *	applicableTo: ["number"],
                *	operator: function(dataVal) { return (dataVal % 2 !== 0); }
                * }
                *
                * $("#element").wijgrid({ customFilterOperators: [oddFilterOp] });
                */
                this.customFilterOperators = [];
                /** Determines the datasource.
                * Possible datasources include:
                *		1. A DOM table. This is the default datasource, used if the data option is null. Table must have no cells with rowSpan and colSpan attributes.
                *		2. A two-dimensional array, such as [[0, "a"], [1, "b"]].
                *		3. An array of objects, such as [{field0: 0, field1: "a"}, {field0: 1, field1: "b'}].
                *		4. A wijdatasource.
                *		5. A wijdataview.
                * @example
                * // DOM table
                * $("#element").wijgrid();
                * // two-dimensional array
                * $("#element").wijgrid({ data: [[0, "a"], [1, "b"]] });
                */
                this.data = null;
                /** Determines an action to bring a cell in the editing mode when the editingMode option is set to "cell". Possible values are: "click", "doubleClick", "auto".
                * @example
                * $("#element").wijgrid({ editingInitOption: "auto" });
                * @remarks
                * Possible values are:
                *	"click": cell is edited via a single click.
                *	"doubleClick": cell is edited via a double click.
                *	"auto": action is determined automatically depending upon user environment. If user has a mobile platform then "click" is used, "doubleClick" otherwise.
                */
                this.editingInitOption = "auto";
                /** Determines the editing mode. Possible values are: "none", "row", "cell",
                * @example
                * $("#element").wijgrid({
                *    editingMode: "row",
                *    columns: [{
                *       showEditButton: true
                *    }]
                * });
                * @remarks
                * Possible values are:
                * "none": the editing ability is disabled.
                *	"cell": a single cell can be edited via a double click.
                *	"row": a whole row can be edited via a command column.
                */
                this.editingMode = "none";
                /** Determines if the exact column width, in pixels, is used.
                * @example
                * $("#element").wijgrid({ ensureColumnsPxWidth: true });
                * @remarks
                * By default, wijgrid emulates the table element behavior when using a number as the width. This means wijgrid may not have the exact width specified. If exact width is needed, please set the ensureColumnsPxWidth option of wijgrid to true. If this option is set to true, wijgrid will not expand itself to fit the available space.Instead, it will use the width option of each column widget.
                */
                this.ensureColumnsPxWidth = false;
                /** Determines the order of items in the filter drop-down list.
                * Possible values are: "none", "alphabetical", "alphabeticalCustomFirst" and "alphabeticalEmbeddedFirst"
                * @example
                * $("#element").wijgrid({ filterOperatorsSortMode: "alphabeticalCustomFirst" });
                * @remarks
                * Possible values are:
                *	"none": Operators follow the order of addition; built-in operators appear before custom ones.
                *	"alphabetical": Operators are sorted alphabetically.
                *	"alphabeticalCustomFirst": Operators are sorted alphabetically with custom operators appearing before built-in ones.
                *	"alphabeticalEmbeddedFirst": Operators are sorted alphabetically with built-in operators appearing before custom operators.
                *
                * "NoFilter" operator is always first.
                */
                this.filterOperatorsSortMode = "alphabeticalCustomFirst";
                /** Determines whether the user can change position of the static column or row by dragging the vertical or horizontal freezing handle with the mouse. Possible values are: "none", "columns", "rows", "both".
                * Obsoleted, use the scrollingSettings.freezingMode property instead.
                * @example
                * $("#element").wijgrid({ freezingMode: "both" });
                * @remarks
                * Possible values are:
                * "none": The freezing handle cannot be dragged.
                * "columns": The user can drag the vertical freezing handle to change position of the static column.
                * "rows": The user can drag the horizontal freezing handle to change position of the static row.
                * "both": The user can drag both horizontal and vertical freezing handles.
                */
                this.freezingMode = undefined;
                /** Determines the caption of the group area.
                * @example
                * // Set the groupAreaCaption to a string and the text appears above the grid
                * $("#element").wijgrid({ groupAreaCaption: "Drag a column here to group by that column." });
                */
                this.groupAreaCaption = "Drag a column here to group by that column.";
                /** Determines the indentation of the groups, in pixels.
                * @example
                * // Set the groupIndent option to the number of pixels to indent data when grouping.
                * $("#element").wijgrid({ groupIndent: 15 });
                */
                this.groupIndent = 10;
                /** Determines whether the position of the current cell is highlighted or not.
                * @example
                * $("#element").wijgrid({ highlightCurrentCell: false });
                */
                this.highlightCurrentCell = false;
                /** Determines whether hovered row is highlighted or not.
                * @example
                * $("#element").wijgrid({ highlightCurrentCell: true });
                */
                this.highlightOnHover = true;
                /** Determines the text to be displayed when the grid is loading.
                * @example
                * $("#element").wijgrid({ loadingText: "Loading..."});
                */
                this.loadingText = "Loading...";
                /** Cell values equal to this property value are considered null values. Use this option if you want to change default representation of null values (empty strings) with something else.
                * @example
                * $("#element").wijgrid({ nullString: "" });
                * @remarks
                * Case-sensitive for built-in parsers.
                */
                this.nullString = "";
                /** Determines the zero-based index of the current page. You can use this to access a specific page, for example, when using the paging feature.
                * @example
                * $("#element").wijgrid({ pageIndex: 0 });
                */
                this.pageIndex = 0;
                /** Number of rows to place on a single page.
                * The default value is 10.
                * @example
                * // The pageSize here sets 10 rows to a page. The allowPaging option is set to true so paging buttons appear.
                * $("#element").wijgrid({ pageSize: 10 });
                */
                this.pageSize = 10;
                /** Determines the pager settings for the grid including the mode (page buttons or next/previous buttons), number of page buttons, and position where the buttons appear.
                * @example
                * // Display the pager at the top of the wijgrid.
                * $("#element").wijgrid({ pagerSettings: { position: "top" } });
                * @remarks
                * See the wijpager documentation for more information on pager settings.
                */
                this.pagerSettings = {
                    mode: "numeric",
                    pageButtonCount: 10,
                    position: "bottom"
                };
                /** A value indicating whether DOM cell attributes can be passed within a data value.
                * @example
                * // Render the style attribute passed within the data.
                * $("#element").wijgrid({
                *		readAttributesFromData: false });
                *		data: [
                *			[ [1, { "style": "color: red" } ], a ]
                *		]
                * });
                * @remarks
                * This option allows binding collection of values to data and automatically converting them as attributes of corresponded DOM table cells during rendering.
                * Values should be passed as an array of two items, where first item is a value of the data field, the second item is a list of values:
                * $("#element").wijgrid({
                *		data: [
                *			[ [1, { "style": "color: red", "class": "myclass" } ], a ]
                *		]
                * });
                *
                * or
                *
                * $("#element").wijgrid({
                *		data: [
                *			{ col0: [1, { "style": "color: red", "class": "myclass" }], col1: "a" }
                *		]
                * });
                *
                * Note: during conversion wijgrid extracts the first item value and makes it data field value, the second item (list of values) is removed:
                * [ { col0: 1, col1: "a" } ]
                *
                * If DOM table is used as a datasource then attributes belonging to the cells in tBody section of the original table will be read and applied to the new cells.
                *
                * rowSpan and colSpan attributes are not allowed.
                */
                this.readAttributesFromData = false;
                /** Determines the height of a rows when virtual scrolling is used.
                * Obsoleted, use the scrollingSettings.virtualization.rowHeight property instead.
                * @example
                * $("#element").wijgrid({ rowHeight: 20 });
                * @remarks
                * Can be set only during creation
                */
                this.rowHeight = undefined;
                /** Function used for styling rows in wijgrid.
                * @example
                * // Make text of the alternating rows italic.
                * $("#demo").wijgrid({
                *		data: [
                *			[0, "Nancy"], [1, "Susan"], [2, "Alice"], [3, "Kate"]
                *		],
                *		rowStyleFormatter: function (args) {
                *			if ((args.state & wijmo.grid.renderState.rendering) && (args.type & wijmo.grid.rowType.dataAlt)) {
                *				args.$rows.find("td").css("font-style", "italic");
                *			}
                *		}
                * });
                * @param {wijmo.grid.IRowInfo} args The data with this function.
                */
                this.rowStyleFormatter = undefined;
                /** Determines which scrollbars are active and if they appear automatically based on content size.
                * Possbile values are: "none", "auto", "horizontal", "vertical", "both".
                * Obsoleted, use the scrollingSettings.mode property instead.
                * @example
                * // The horizontal and vertical scrollbars are active when the scrollMode is set to both.
                * $("#element").wijgrid({ scrollMode: "both" });
                * @remarks
                * Possible values are:
                *	"none": Scrolling is not used; the staticRowIndex and staticColumnIndex values are ignored.
                *	"auto": Scrollbars appear automatically depending upon content size.
                *	"horizontal": The horizontal scrollbar is active.
                *	"vertical": The vertical scrollbar is active.
                *	"both": Both horizontal and vertical scrollbars are active.
                */
                this.scrollMode = undefined;
                /** Determines the scrolling settings.
                * @example
                * // The horizontal and vertical scrollbars are active when the scrollMode is set to both.
                * $("#element").wijgrid({ scrollingSettings: { mode: "both" } });
                */
                this.scrollingSettings = {
                    freezingMode: "none",
                    mode: "none",
                    staticColumnIndex: -1,
                    staticRowIndex: -1,
                    staticColumnsAlignment: "left",
                    virtualizationSettings: {
                        mode: "none",
                        rowHeight: 19,
                        columnWidth: 100
                    }
                };
                /** Determines which cells, range of cells, columns, or rows can be selected at one time.
                * Possible values are: "none", "singleCell", "singleColumn", "singleRow", "singleRange", "multiColumn", "multiRow" and "multiRange".
                * @example
                * // Set selectionMode to muliColumn and users can select more than one column using the CTRL or SHIFT keys.
                * $("#element").wijgrid({ selectionMode: "multiColumn" });
                * @remarks
                * Possible values are:
                * "none": Selection is turned off.
                * "singleCell": Only a single cell can be selected at a time.
                * "singleColumn": Only a single column can be selected at a time.
                * "singleRow": Only a single row can be selected at a time.
                * "singleRange": Only a single range of cells can be selected at a time.
                * "multiColumn": It is possible to select more than one row at the same time using the mouse and the CTRL or SHIFT keys.
                * "multiRow": It is possible to select more than one row at the same time using the mouse and the CTRL or SHIFT keys.
                * "multiRange": It is possible to select more than one cells range at the same time using the mouse and the CTRL or SHIFT keys.
                */
                this.selectionMode = "singleRow";
                /** A value indicating whether the filter row is visible.
                * Filter row is used to display column filtering interface.
                * @example
                * // Set showFilter to true to view the filter row.
                * $("#element").wijgrid({ showFilter: true });
                */
                this.showFilter = false;
                /** A value indicating whether the footer row is visible.
                * Footer row is used for displaying of tfoot section of original table, and to show totals.
                * @example
                * // Set showFooter to true to view the footer row.
                * $("#element").wijgrid({ showFooter: true });
                */
                this.showFooter = false;
                /** A value indicating whether group area is visible.
                * Group area is used to display headers of groupped columns. User can drag columns from/to group area by dragging column headers with mouse, if allowColMoving option is on.
                * @example
                * // Set showGroupArea to true to display the group area.
                * $("#element").wijgrid({ showGroupArea: true });
                */
                this.showGroupArea = false;
                /** A value indicating whether a selection will be automatically displayed at the current cell position when the wijgrid is rendered.
                * Set this option to false if you want to prevent wijgrid from selecting the currentCell automatically.
                * @example
                * $("#element").wijgrid({ showSelectionOnRender: true });
                */
                this.showSelectionOnRender = true;
                /** A value indicating whether the row header is visible.
                * @example
                * $("#element").wijgrid({ showRowHeader: true });
                */
                this.showRowHeader = false;
                /** Indicates the index of columns that will always be shown on the left when the grid view is scrolled horizontally.
                * Obsoleted, use the scrollingSettings.staticColumnIndex property instead.
                * @example
                * $("#element").wijgrid({ staticColumnIndex: -1 });
                * @remarks
                * Note that all columns before the static column will be automatically marked as static, too.
                * This can only take effect when the scrollMode option is not set to "none".
                * It will be considered "-1" when grouping or row merging is enabled. A "-1" means there is no data column but the row header is static. A zero (0) means one data column and row header are static.
                */
                this.staticColumnIndex = undefined;
                /** Gets or sets the alignment of the static columns area. Possible values are "left", "right".
                * Obsoleted, use the scrollingSettings.staticColumnsAlignment property instead.
                * @example
                * $("#element").wijgrid({ staticColumnsAlignment: "left" });
                * @remarks
                * The "right" mode has limited functionality:
                *  - The showRowHeader value is ignored.
                *  - Changing staticColumnIndex at run-time by dragging the vertical bar is disabled.
                */
                this.staticColumnsAlignment = undefined;
                /** Indicates the index of data rows that will always be shown on the top when the wijgrid is scrolled vertically.
                * Obsoleted, use the scrollingSettings.staticRowIndext property instead.
                * @example
                * $("#element").wijgrid({ staticRowIndex: -1 });
                * @remarks
                * Note, that all rows before the static row will be automatically marked as static, too.
                * This can only take effect when the scrollMode option is not set to "none". This will be considered "-1" when grouping or row merging is enabled.
                * A "-1" means there is no data row but the header row is static.A zero (0) means one data row and the row header are static.
                */
                this.staticRowIndex = undefined;
                /** Gets or sets the virtual number of items in the wijgrid and enables custom paging.
                * Setting option to a positive value activates custom paging, the number of displayed rows and the total number of pages will be determined by the totalRows and pageSize values.
                * @example
                * $("#element").wijgrid({ totalRows: -1 });
                * @remarks
                * In custom paging mode sorting, paging and filtering are not performed automatically.
                * This must be handled manually using the sorted, pageIndexChanged, and filtered events. Load the new portion of data there followed by the ensureControl(true) method call.
                */
                this.totalRows = -1;
                /* --- events */
                /** The afterCellEdit event handler is a function called after cell editing is completed.
                * This function can assist you in completing many tasks, such as in making changes once editing is completed; in tracking changes in cells, columns, or rows; or in integrating custom editing functions on the front end.
                * @event
                * @example
                * // Once cell editing is complete, the function calls the destroy method to destroy the wijcombobox widget and the wijinputnumber widget which are used as the custom editors.
                * $("#element").wijgrid({
                *		afterCellEdit: function(e, args) {
                *			switch (args.cell.column().dataKey) {
                *				case "Position":
                *					args.cell.container().find("input").wijcombobox("destroy");
                *					break;
                *				case "Acquired":
                *					args.cell.container().find("input").wijinputnumber("destroy");
                *					break;
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ afterCellEdit: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridaftercelledit", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IAfterCellEditEventArgs} args The data with this event.
                */
                this.afterCellEdit = null;
                /** The afterCellUpdate event handler is a function that is called after a cell has been updated. Among other functions, this event allows you to track and store the indices of changed rows or columns.
                * @event
                * @example
                * // Once the cell has been updated, the information from the underlying data is dumped into the "#log" element.
                * $("#element").wijgrid({
                *		afterCellUpdate: function(e, args) {
                *			$("#log").html(dump($("#demo").wijgrid("data")));
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ afterCellUpdate: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridaftercellupdate", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IAfterCellUpdateEventArgs} args The data with this event.
                */
                this.afterCellUpdate = null;
                /** The beforeCellEdit event handler is a function that is called before a cell enters edit mode.
                * The beforeCellEdit event handler assists you in appending a widget, data, or other item to a wijgrid's cells before the cells enter edit mode. This event is cancellable if the editigMode options is set to "cell".
                * @event
                * @example
                * // Allow the user to change the price only if the product hasn't been discontinued:
                * $("#element").wijgrid({
                *		beforeCellEdit: function(e, args) {
                *			return !((args.cell.column().dataKey === "Price") && args.cell.row().data.Discontinued);
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ beforeCellEdit: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridbeforecelledit", function (e, args) {
                *		// some code here
                * });
                *
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IBeforeCellEditEventArgs} args The data with this event.
                */
                this.beforeCellEdit = null;
                /** The beforeCellUpdate event handler is a function that is called before the cell is updated with new or user-entered data. This event is cancellable if the editingMode options is set to "cell".
                * There are many instances where this event is helpful, such as when you need to check a cell's value before the update occurs or when you need to apply an alert message based on the cell's value.
                * @event
                * @example
                * // In this sample, you use args.value to check the year that the user enters in the "Acquired" column.
                * // If it's less than 1990 or greater than the current year, then the event handler will return false to cancel updating and show the user an alert message.
                * $("#element").wijgrid({
                *		beforeCellUpdate: function(e, args) {
                *			switch (args.cell.column().dataKey) {
                *				case "Acquired":
                *					var $editor = args.cell.container().find("input"),
                *						value = $editor.wijinputnumber("getValue"),
                *						curYear = new Date().getFullYear();
                *
                *					if (value < 1990 || value > curYear) {
                *						$editor.addClass("ui-state-error");
                *						alert("value must be between 1990 and " + curYear);
                *						$editor.focus();
                *						return false;
                *					}
                *
                *					args.value = value;
                *					break;
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ beforeCellUpdate: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridbeforecellupdate", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IBeforeCellUpdateEventArgs} args The data with this event.
                */
                this.beforeCellUpdate = null;
                /** The cellClicked event handler is a function that is called when a cell is clicked. You can use this event to get the information of a clicked cell using the args parameter.
                * @event
                * @example
                * // The sample uses the cellClicked event to trigger an alert when the cell is clicked.
                * $("#element").wijgrid({
                *		cellClicked: function (e, args) {
                *			alert(args.cell.value());
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ cellClicked: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcellclicked", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.ICellClickedEventArgs} args The data with this event.
                */
                this.cellClicked = null;
                /** The columnDragging event handler is a function that is called when column dragging has been started, but before the wijgrid handles the operation. This event is cancellable.
                * @event
                * @example
                * // Preventing a user from dragging a specific column
                * $("#element").wijgrid({
                *		columnDragging: function (e, args) {
                *			return !(args.drag.dataKey == "ID");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnDragging: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumndragging", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnDraggingEventArgs} args The data with this event.
                */
                this.columnDragging = null;
                /** The columnDragged event handler is a function that is called when column dragging has been started. You can use this event to find the column being dragged or the dragged column's location.
                * @event
                * @example
                * // Supply a callback function to handle the columnDragged event:
                * $("#element").wijgrid({
                *		columnDragged: function (e, args) {
                *			alert("The '" + args.drag.headerText + "' column is being dragged from the '" + args.dragSource + "' location");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnDragged: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumndragged", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnDraggedEventArgs} args The data with this event.
                */
                this.columnDragged = null;
                /** The columnDropping event handler is a function that is called when a column is dropped into the columns area, but before wijgrid handles the operation. This event is cancellable.
                * @event
                * @example
                * // Preventing user from dropping any column before the "ID" column.
                * $("#element").wijgrid({
                *		columnDropping: function (e, args) {
                *			return !(args.drop.dataKey == "ID" && args.at == "left");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnDropping: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumndropping", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnDroppingEventArgs} args The data with this event.
                */
                this.columnDropping = null;
                /** The columnDropped event handler is a function that is called when a column has been dropped into the columns area.
                * @event
                * @example
                * // Supply a callback function to handle the columnDropped event:
                * $("#element").wijgrid({
                *		columnDropped: function (e, args) {
                *			"The '" + args.drag.headerText + "' column has been dropped onto the '" + args.drop.headerText + "' column at the '" + args.at + "' position"
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnDropped: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumndropped", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnDroppedEventArgs} args The data with this event.
                */
                this.columnDropped = null;
                /** The columnGrouping event handler is a function that is called when a column is dropped into the group area, but before the wijgrid handles the operation. This event is cancellable.
                * @event
                * @example
                * // Preventing user from grouping the "UnitPrice" column.
                * $("#element").wijgrid({
                *		columnGrouping: function (e, args) {
                *			return !(args.drag.headerText == "UnitPrice");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnGrouping: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumngrouping", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnGroupingEventArgs} args The data with this event.
                */
                this.columnGrouping = null;
                /** The columnGrouped event handler is a function that is called when a column has been dropped into the group area.
                * @event
                * @example
                * // Supply a callback function to handle the columnGrouped event:
                * $("#element").wijgrid({
                *		columnGrouped: function (e, args) {
                *			alert("The '" + args.drag.headerText "' column has been grouped");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnGrouped: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumngrouped", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnGroupedEventArgs} args The data with this event.
                */
                this.columnGrouped = null;
                /** The columnResizing event handler is called when a user resizes the column but before the wijgrid handles the operation. This event is cancellable.
                * @event
                * @example
                * // Prevent setting the width of "ID" column less than 100 pixels
                * $("#element").wijgrid({
                *		columnResizing: function (e, args) {
                *			if (args.column.dataKey == "ID" && args.newWidth < 100) {
                *				args.newWidth = 100;
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnResizing: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumnresizing", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnResizingEventArgs} args The data with this event.
                */
                this.columnResizing = null;
                /** The columnResized event handler is called when a user has changed a column's size.
                * @event
                * @example
                * // Supply a callback function to handle the columnGrouped event:
                * $("#element").wijgrid({
                *		columnResized: function (e, args) {
                *			alert("The '" + args.column.headerText + "' has been resized");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnResized: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumnresized", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnResizedEventArgs} args The data with this event.
                */
                this.columnResized = null;
                /** The columnUngrouping event handler is called when a column has been removed from the group area but before the wjgrid handles the operation. This event is cancellable.
                * @event
                * @example
                * // Preventing user from ungrouping the "UnitPrice" column.
                * $("#element").wijgrid({
                *		columnUngrouping: function (e, args) {
                *			return !(args.column.headerText == "UnitPrice");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnUngrouping: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumnungrouping", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnUngroupingEventArgs} args The data with this event.
                */
                this.columnUngrouping = null;
                /** The columnUngrouped event handler is called when a column has been removed from the group area.
                * @event
                * @example
                * // Supply a callback function to handle the columnGrouped event:
                * $("#element").wijgrid({
                *		columnUngrouped: function (e, args) {
                *			alert("The '" + args.column.headerText + "' has been ungrouped");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ columnUngrouped: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcolumnungrouped", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IColumnUngroupedEventArgs} args The data with this event.
                */
                this.columnUngrouped = null;
                /** The currentCellChanging event handler is called before the cell is changed. You can use this event to get a selected row or column or to get a data row bound to the current cell. This event is cancellable.
                * @event
                * @example
                * // Gets the data row bound to the current cell.
                * $("#element").wijgrid({
                *		currentCellChanging: function (e, args) {
                *			var rowObj = $(e.target).wijgrid("currentCell").row();
                *			if (rowObj) {
                *				var dataItem = rowObj.data; // current data item (before the cell is changed).
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ currentCellChanging: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcurrentcellchanging", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.ICurrentCellChangingEventArgs} args The data with this event.
                */
                this.currentCellChanging = null;
                /** The currentCellChanged event handler is called after the current cell is changed.
                * @event
                * @example
                * // Gets the data row bound to the current cell.
                * $("#element").wijgrid({
                *		currentCellChanged: function (e, args) {
                *			var rowObj = $(e.target).wijgrid("currentCell").row();
                *			if (rowObj) {
                *				var dataItem = rowObj.data; // current data item (after the cell is changed).
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ currentCellChanged: function (e) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridcurrentcellchanged", function (e) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.currentCellChanged = null;
                /** The filterOperatorsListShowing event handler is a function that is called before the filter drop-down list is shown. You can use this event to customize the list of filter operators for your users.
                * @event
                * @example
                * // Limit the filters that will be shown to the "Equals" filter operator
                * $("#element").wijgrid({
                *		filterOperatorsListShowing: function (e, args) {
                *			args.operators = $.grep(args.operators, function(op) {
                *				return op.name === "Equals" || op.name === "NoFilter";
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ filterOperatorsListShowing: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridfilteroperatorslistshowing", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IFilterOperatorsListShowingEventArgs} args The data with this event.
                */
                this.filterOperatorsListShowing = null;
                /** The filtering event handler is a function that is called before the filtering operation is started. For example, you can use this event to change a filtering condition before a filter will be applied to the data. This event is cancellable.
                * @event
                * @example
                * // Prevents filtering by negative values
                * $("#element").wijgrid({
                *		filtering: function (e, args) {
                *			if (args.column.dataKey == "Price" && args.value < 0) {
                *				args.value = 0;
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ filtering: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridfiltering", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IFilteringEventArgs} args The data with this event.
                */
                this.filtering = null;
                /** The filtered event handler is a function that is called after the wijgrid is filtered.
                * @event
                * @example
                * //
                * $("#element").wijgrid({
                *		filtered: function (e, args) {
                *			alert("The filtered data contains: " + $(this).wijgrid("dataView").count() + " rows");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ filtered: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridfiltered", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IFilteredEventArgs} args The data with this event.
                */
                this.filtered = null;
                /** The groupAggregate event handler is a function that is called when groups are being created and the column object's aggregate option has been set to "custom". This event is useful when you want to calculate custom aggregate values.
                * @event
                * @example
                * // This sample demonstrates using the groupAggregate event handler to calculate an average in a custom aggregate:
                * $("#element").wijgrid({
                *		groupAggregate: function (e, args) {
                *			if (args.column.dataKey == "Price") {
                *				var aggregate = 0;
                *
                *				for (var i = args.groupingStart; i <= args.groupingEnd; i++) {
                *					aggregate += args.data[i].valueCell(args.column.dataIndex).value;
                *				}
                *
                *				aggregate = aggregate/ (args.groupingEnd - args.groupingStart + 1);
                *				args.text = aggregate;
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ groupAggregate: function (e, args) {
                *		// some code here
                * }});
                * Bind to the event by type:
                *
                * $("#element").bind("wijgridgroupaggregate", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IGroupAggregateEventArgs} args The data with this event.
                */
                this.groupAggregate = null;
                /** The groupText event handler is a function that is called when groups are being created and the groupInfo option has the groupInfo.headerText or the groupInfo.footerText options set to "custom". This event can be used to customize group headers and group footers.
                * @event
                * @example
                * // The following sample sets the groupText event handler to avoid empty cells. The custom formatting applied to group headers left certain cells appearing as if they were empty. This code avoids that:
                * $("#element").wijgrid({
                *		groupText: function (e, args) {
                *			if (!args.groupText) {
                *				args.text = "null";
                *			}
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ groupText: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridgrouptext", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IGroupTextEventArgs} args The data with this event.
                */
                this.groupText = null;
                /** The invalidCellValue event handler is a function called when a cell needs to start updating but the cell value is invalid. So if the value in a wijgrid cell can't be converted to the column target type, the invalidCellValue event will fire.
                * @event
                * @example
                * // Adds a style to the cell if the value entered is invalid
                * $("#element").wijgrid({
                *		invalidCellValue: function (e, args) {
                *			$(args.cell.container()).addClass("ui-state-error");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ invalidCellValue: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridinvalidcellvalue", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IInvalidCellValueEventArgs} args The data with this event.
                */
                this.invalidCellValue = null;
                /** The pageIndexChanging event handler is a function that is called before the page index is changed. This event is cancellable.
                * @event
                * @example
                * // Cancel the event by returning false
                * $("#element").wijgrid({
                *		pageIndexChanging: function (e, args) {
                *			return false;
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ pageIndexChanging: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridpageindexchanging", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IPageIndexChangingEventArgs} args The data with this event.
                */
                this.pageIndexChanging = null;
                /** The pageIndexChanged event handler is a function that is called after the page index is changed, such as when you use the numeric buttons to swtich between pages or assign a new value to the pageIndex option.
                * @event
                * @example
                * // Supply a callback function to handle the pageIndexChanged event:
                * $("#element").wijgrid({
                *		pageIndexChanged: function (e, args) {
                *			alert("The new pageIndex is: " + args.newPageIndex);
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ pageIndexChanged: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridpageindexchanged", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.IPageIndexChangedEventArgs} args The data with this event.
                */
                this.pageIndexChanged = null;
                /** The selectionChanged event handler is a function that is called after the selection is changed.
                * @event
                * @example
                * // Get the value of the first cell of the selected row.
                * $("#element").wijgrid({
                *		selectionMode: "singleRow",
                *		selectionChanged: function (e, args) {
                *			alert(args.addedCells.item(0).value());
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ selectionChanged: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridselectionchanged", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.ISelectionChangedEventArgs} args The data with this event.
                */
                this.selectionChanged = null;
                /** The sorting event handler is a function that is called before the sorting operation is started. This event is cancellable.
                * The allowSorting option must be set to "true" for this event to fire.
                * @event
                * @example
                * // Preventing user from sorting the "ID" column.
                * $("#element").wijgrid({
                *		sorting: function (e, args) {
                *			return !(args.column.headerText === "ID");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ sorting: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridsorting", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.ISortingEventArgs} args The data with this event.
                */
                this.sorting = null;
                /** The sorted event handler is a function that is called after the widget is sorted. The allowSorting option must be set to "true" to allow this event to fire.
                * @event
                * @example
                * // The following code handles the sorted event and will give you access to the column and the sort direction
                * $("#element").wijgrid({
                *		sorted: function (e, args) {
                *			alert("Column " + args.column.headerText + " sorted in " + args.sortDirection + " order");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ sorted: function (e, args) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridsorted", function (e, args) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                * @param {wijmo.grid.ISortedEventArgs} args The data with this event.
                */
                this.sorted = null;
                /* events --- */
                /* --- life-cycle events */
                //			/// <summary>
                //			/// The ajaxError event handler. A function called when wijgrid is bound to remote data and
                //			/// the ajax request fails.
                //			/// Default: null.
                //			/// Type: Function.
                //			/// Code example:
                //			/// Supply a callback function to handle the ajaxError event:
                //			/// $("#element").wijgrid({ ajaxError: function (e, args) { } });
                //			/// Bind to the event by type:
                //			/// $("#element").bind("wijgridajaxerror", function (e, args) { });
                //			/// </summary>
                //			/// <param name="e" type="Object">The jQuery.Event object.</param>
                //			/// <param name="args" type="Object">
                //			/// The data corresponded with this event.
                //			/// args.XMLHttpRequest: the XMLHttpRequest object.
                //			/// args.textStatus: a string describing the error type.
                //			/// args.errorThrown: an exception object.
                //			///
                //			/// Refer to the jQuery.ajax.error event documentation for more details on this arguments.
                //			/// </param>
                //			ajaxError: null,
                /** The dataLoading event handler is a function that is called when the wijgrid loads a portion of data from the underlying datasource. This can be used for modification of data sent to server if using dynamic remote wijdatasource.
                * @event
                * @example
                * // This sample allows you to set the session ID when loading a portion of data from the remote wijdatasource:
                * $("#element").wijgrid({
                *		data: new wijdatasource({
                *			proxy: new wijhttpproxy({
                *				// some code here
                *			})
                *		}),
                *		dataLoading: function (e) {
                *			var dataSource = $(this).wijgrid("option", "data");
                *			dataSource.proxy.options.data.sessionID = getSessionID();
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ dataLoading: function (e) {
                * // some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgriddataloading", function (e) {
                * // some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.dataLoading = null;
                /** The dataLoaded event handler is a function that is called when data is loaded.
                * @event
                * @example
                * // Display the number of entries found
                * $("#element").wijgrid({
                *		dataLoaded: function (e) {
                *			alert($(this).wijgrid("dataView").count());
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ dataLoaded: function (e) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgriddataloaded", function (e) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.dataLoaded = null;
                /** The loading event handler is a function that is called at the beginning of the wijgrid's lifecycle. You can use this event to activate a custom load progress indicator.
                * @event
                * @example
                * // Creating an indeterminate progressbar during loading
                * $("#element").wijgrid({
                *		loading: function (e) {
                *			$("#progressBar").show().progressbar({ value: false });
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ loading: function (e) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridloading", function (e) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.loading = null;
                /** The loaded event handler is a function that is called at the end the wijgrid's lifecycle when wijgrid is filled with data and rendered. You can use this event to manipulate the grid html content or to finish a custom load indication.
                * @event
                * @example
                * // The loaded event in the sample below ensures that whatever is selected on load is cleared
                * $("#element").wijgrid({
                *		loaded: function (e) {
                *			$(e.target).wijgrid("selection").clear(); // clear selection
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ loaded: function (e) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridloaded", function (e) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.loaded = null;
                /** The rendering event handler is a function that is called when the wijgrid is about to render. Normally you do not need to use this event.
                * @event
                * @example
                * $("#element").wijgrid({
                *		rendering: function (e) {
                *			alert("rendering");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ rendering: function (e) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridrendering", function (e) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.rendering = null;
                /** The rendered event handler is a function that is called when the wijgrid is rendered. Normally you do not need to use this event.
                * @event
                * @example
                * $("#element").wijgrid({
                *		rendered: function (e) {
                *			alert("rendered");
                *		}
                * });
                * @remarks
                * You can bind to the event either by type or by name.
                * Bind to the event by name:
                * $("#element").wijgrid({ rendered: function (e) {
                *		// some code here
                * }});
                *
                * Bind to the event by type:
                * $("#element").bind("wijgridrendered", function (e) {
                *		// some code here
                * });
                * @param {Object} e The jQuery.Event object.
                */
                this.rendered = null;
            }
            return wijgrid_options;
        })();

        //wijgrid.prototype.options = $.extend(true, {}, wijmoWidget.prototype.options, new wijgrid_options());
        wijgrid.prototype.options = wijmo.grid.extendWidgetOptions(wijmo.wijmoWidget.prototype.options, new wijgrid_options());

        $.wijmo.registerWidget("wijgrid", wijgrid.prototype);
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));


/// <reference path="interfaces.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var SketchObject = (function () {
            function SketchObject(attr) {
                if (attr) {
                    this.__attr = attr;
                }
            }
            SketchObject.prototype.ensureAttr = function () {
                this.__attr = this.__attr || {};
                return this.__attr;
            };

            SketchObject.prototype.attr = function (name, value) {
                if (arguments.length == 0) {
                    return this.__attr;
                }

                if (arguments.length == 1) {
                    return this.__attr ? this.__attr[name] : null;
                } else {
                    this.ensureAttr()[name] = value;
                }
            };

            SketchObject.prototype.style = function (name, newValue) {
                if (arguments.length == 0) {
                    return this.__style;
                } else if (arguments.length == 1) {
                    return this.__style && this.__style[name];
                } else {
                    this.ensureStyle()[name] = newValue;
                }
            };
            SketchObject.prototype.deleteAttr = function (name) {
                if (this.__attr) {
                    delete this.__attr[name];
                }
            };
            SketchObject.prototype.deleteStyle = function (name) {
                if (this.__style) {
                    delete this.__style[name];
                }
            };

            /** Creates style object if it does not exist. Then returns it */
            SketchObject.prototype.ensureStyle = function () {
                this.__style = this.__style || {};
                return this.__style;
            };
            return SketchObject;
        })();
        grid.SketchObject = SketchObject;

        /** @ignore */
        var SketchCell = (function (_super) {
            __extends(SketchCell, _super);
            function SketchCell(attr) {
                _super.call(this, attr);
            }
            SketchCell.prototype.visible = function (newValue) {
                if (arguments.length == 0) {
                    return !(this._visible === false);
                } else {
                    this._visible = newValue;
                }
            };
            return SketchCell;
        })(SketchObject);
        grid.SketchCell = SketchCell;

        /** @ignore */
        /* A sketch cell with a value */
        var ValueCell = (function (_super) {
            __extends(ValueCell, _super);
            function ValueCell(value, attr) {
                _super.call(this, attr);
                this.value = value;
            }
            return ValueCell;
        })(SketchCell);
        grid.ValueCell = ValueCell;

        /** @ignore */
        /* A sketch cell with raw html */
        var HtmlCell = (function (_super) {
            __extends(HtmlCell, _super);
            function HtmlCell(html, attr) {
                _super.call(this, attr);

                this.html = html || "";
            }
            HtmlCell.nbsp = function () {
                return new HtmlCell("&nbsp;", null);
            };
            return HtmlCell;
        })(SketchCell);
        grid.HtmlCell = HtmlCell;

        /** @ignore */
        var SketchRow = (function (_super) {
            __extends(SketchRow, _super);
            function SketchRow(rowType, renderState, attrs) {
                _super.call(this, attrs);

                this.rowType = rowType;
                this.renderState = renderState;
                this.extInfo = { state: 0 /* none */ };
            }
            /** returns true if this is data row or data alternative row */
            SketchRow.prototype.isDataRow = function () {
                return (this.rowType & 2 /* data */) == 2 /* data */;
            };

            SketchRow.prototype.dataItemIndex = function (offset) {
                if (typeof offset === "undefined") { offset = 0; }
                return -1;
            };

            SketchRow.prototype.cellCount = function () {
                return this._cells ? this._cells.length : 0;
            };

            /** create the cell table if it does not exist yet */
            SketchRow.prototype._ensureCells = function () {
                this._cells = this._cells || [];
            };

            /** add a cell to the end */
            SketchRow.prototype.add = function (elem) {
                this._ensureCells();
                this._cells.push(elem);
            };

            /** insert a cell */
            SketchRow.prototype.insert = function (index, elem) {
                this._ensureCells();
                this._cells.splice(index, 0, elem);
            };

            SketchRow.prototype.cell = function (index) {
                return this._cells[index];
            };
            SketchRow.prototype.valueCell = function (index) {
                return this.cell(index);
            };

            /** remove a cell by index */
            SketchRow.prototype.removeAt = function (index) {
                if (!this._cells) {
                    throw "Wrong index";
                }
                this._cells.splice(index, 1);
            };

            /** remove all cells */
            SketchRow.prototype.clear = function () {
            };

            SketchRow.prototype.getRowInfo = function () {
                return {
                    type: this.rowType,
                    state: this.renderState,
                    sectionRowIndex: null,
                    dataRowIndex: null,
                    virtualDataItemIndex: null,
                    dataItemIndex: this.dataItemIndex(),
                    $rows: null,
                    _extInfo: this.extInfo
                };
            };
            return SketchRow;
        })(SketchObject);
        grid.SketchRow = SketchRow;

        /** @ignore */
        var SketchDataRow = (function (_super) {
            __extends(SketchDataRow, _super);
            function SketchDataRow(originalRowIndex, renderState, attrs) {
                _super.call(this, 2 /* data */ | ((originalRowIndex % 2) == 1 ? 4 /* dataAlt */ : 0), renderState, attrs);

                this.originalRowIndex = originalRowIndex;
            }
            SketchDataRow.prototype.dataItemIndex = function (offset) {
                if (typeof offset === "undefined") { offset = 0; }
                return offset + this.originalRowIndex;
            };

            SketchDataRow.prototype.isDataRow = function () {
                return true;
            };
            return SketchDataRow;
        })(SketchRow);
        grid.SketchDataRow = SketchDataRow;

        /** @ignore */
        var SketchGroupRow = (function (_super) {
            __extends(SketchGroupRow, _super);
            function SketchGroupRow(header, attrs) {
                var rowType = header ? 16 /* groupHeader */ : 32 /* groupFooter */;
                _super.call(this, rowType, 1 /* rendering */, attrs);
            }
            SketchGroupRow.prototype.getRowInfo = function () {
                var info = _super.prototype.getRowInfo.call(this);
                if (this.groupByValue !== undefined) {
                    info.groupByValue = this.groupByValue;
                }
                return info;
            };
            return SketchGroupRow;
        })(SketchRow);
        grid.SketchGroupRow = SketchGroupRow;

        /** @ignore */
        var SketchTable = (function () {
            function SketchTable() {
                this._table = [];
            }
            SketchTable.prototype.getRawTable = function () {
                return this._table;
            };

            SketchTable.prototype.row = function (index) {
                return this._table[index];
            };

            SketchTable.prototype.valueAt = function (rowIndex, colIndex) {
                return this.row(rowIndex).valueCell(colIndex).value;
            };

            SketchTable.prototype.wijgridDataAttrValueAt = function (rowIndex, colIndex) {
                return this.row(rowIndex).valueCell(colIndex).attr("wijgrid-data");
            };

            SketchTable.prototype.count = function (newValue) {
                if (typeof newValue === "number") {
                    this._table.length = newValue;
                }
                return this._table.length;
            };

            SketchTable.prototype.add = function (row) {
                this._table.push(row);
            };
            SketchTable.prototype.insert = function (index, row) {
                this._table.splice(index, 0, row);
            };
            SketchTable.prototype.clear = function () {
                this._table.length = 0;
            };
            SketchTable.prototype.indexOf = function (element) {
                return this._table.indexOf(element);
            };
            SketchTable.prototype.remove = function (index, count) {
                if (typeof count === "undefined") { count = 1; }
                this._table.splice(index, count);
            };
            SketchTable.prototype.removeFirst = function (count) {
                if (typeof count === "undefined") { count = 1; }
                this._table.splice(0, count);
            };
            SketchTable.prototype.removeLast = function (count) {
                if (typeof count === "undefined") { count = 1; }
                this._table.splice(this._table.length - count, count);
            };

            SketchTable.prototype.replace = function (index, row) {
                var oldRows = this._table.splice(index, 1, row);

                if (oldRows && oldRows.length && row) {
                    row.extInfo = oldRows[0].extInfo;
                }
            };

            SketchTable.prototype.updateIndexes = function () {
                for (var i = 0; i < this._table.length; i++) {
                    var sketchRow = this._table[i];

                    if (this._table[i].isDataRow()) {
                        sketchRow.originalRowIndex = i;
                    }
                }
            };

            SketchTable.prototype.isLazy = function () {
                return false;
            };
            SketchTable.prototype.ensureNotLazy = function () {
            };
            SketchTable.prototype.find = function (startFrom, callback) {
                var f = this.findEx(startFrom, callback);
                return f ? f.val : null;
            };

            SketchTable.prototype.findIndex = function (startFrom, callback) {
                var f = this.findEx(startFrom, callback);
                return f ? f.at : -1;
            };

            SketchTable.prototype.findEx = function (startFrom, callback) {
                var cnt = this.count();

                for (var i = startFrom; i < cnt; i++) {
                    var row = this.row(i);

                    if (callback(this.row(i)) === true) {
                        return {
                            at: i,
                            val: row
                        };
                    }
                }

                return null;
            };
            return SketchTable;
        })();
        grid.SketchTable = SketchTable;

        /** @ignore */
        var LazySketchTable = (function (_super) {
            __extends(LazySketchTable, _super);
            function LazySketchTable(source) {
                _super.call(this);
                this.mIsLazy = true;
                this.pageSize = 30;
                if (source == null) {
                    throw "Row source is null";
                }
                this.mSource = source;
                this._table.length = source.count();
            }
            LazySketchTable.prototype.isLazy = function () {
                return this.mIsLazy;
            };

            /** Convert to not lazy and create rows if they don't exist*/
            LazySketchTable.prototype.ensureNotLazy = function () {
                if (!this.isLazy())
                    return;
                this.ensureRange();
                this.mIsLazy = false;
            };

            LazySketchTable.prototype.invalidate = function () {
                this._table = new Array(this.mSource.count());
                if (!this.isLazy()) {
                    this.updateRange();
                }
            };

            LazySketchTable.prototype.row = function (index) {
                if (!_super.prototype.row.call(this, index)) {
                    this.ensureRange(Math.max(0, index - this.pageSize / 2), this.pageSize);
                }

                return _super.prototype.row.call(this, index);
            };

            /** Create sketch rows if the don't exist yet.
            * Cannot create anything other than data rows.
            * Requires source
            */
            LazySketchTable.prototype.ensureRange = function (start, length) {
                if (typeof start === "undefined") { start = 0; }
                if (typeof length === "undefined") { length = this._table.length - start; }
                if (!this.isLazy())
                    return;
                if (start < 0) {
                    throw "Wrong range start";
                }

                this._table.length = this.mSource.count();
                if (this._table.length == 0) {
                    if (length > 0) {
                        throw "Wrong range length";
                    }
                    return;
                }

                while (start < this._table.length && this._table[start]) {
                    start++;
                }

                // is there anything to create?
                if (start >= this._table.length)
                    return;

                var last = Math.min(start + length - 1, this._table.length - 1);

                while (last >= start && this._table[last]) {
                    last--;
                }

                length = last - start + 1;
                if (length > 0) {
                    this.updateRange(start, length);
                }
            };
            LazySketchTable.prototype.updateRange = function (start, length) {
                if (typeof start === "undefined") { start = 0; }
                if (typeof length === "undefined") { length = this._table.length - start; }
                if (this.mSource == null) {
                    throw "Cannot create sketch row because source is null";
                }
                this.mSource.getRange(start, length, this._table, start);
            };
            return LazySketchTable;
        })(SketchTable);
        grid.LazySketchTable = LazySketchTable;

        
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="../../../External/declarations/jquery.d.ts"/>
/// <reference path="interfaces.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        var widgetEmulator = (function () {
            function widgetEmulator(options, emulatedWidgetName) {
                var names = emulatedWidgetName.split(".");

                this.namespace = names[0];
                this.widgetName = names[1];
                this.widgetFullName = this.namespace + "-" + this.widgetName;

                $.fn[this.widgetName] = function (funcName) {
                    var result = undefined, args = Array.prototype.slice.call(arguments, 1);

                    if ((typeof (funcName) === "string") && this.length) {
                        this.each(function () {
                            var instance = $.data(this, widgetEmulator.DATA_INSTANCE_PROP);
                            if (instance) {
                                if (!$.isFunction(instance[funcName]) || funcName.charAt(0) === "_") {
                                    return false;
                                }

                                result = instance[funcName].apply(instance, args);

                                if (result !== undefined) {
                                    return false;
                                }
                            }
                        });
                    }

                    return result;
                };

                this.options = options || {};
                this._destroyed = false;

                this._provideDefaults();
            }
            widgetEmulator.prototype.option = function (key, value) {
                var options = key;

                if (!arguments.length) {
                    return this.options;
                }

                if (typeof (key) === "string") {
                    if (value === undefined) {
                        return this.options[key];
                    }

                    options = {};
                    options[key] = value;

                    this._setOptions(options);
                }

                return this;
            };

            widgetEmulator.prototype.enable = function () {
                this._setOption("disabled", false);
            };

            widgetEmulator.prototype.disable = function () {
                this._setOption("disabled", true);
            };

            widgetEmulator.prototype.destroy = function () {
                try  {
                    if (!this._destroyed) {
                        this._destroy();

                        this.element.unbind("." + this.widgetName);
                        this.element.removeData(this.widgetFullName);
                    }
                } finally {
                    this._destroyed = true;
                }
            };

            widgetEmulator.prototype.widget = function () {
                return this.element;
            };

            widgetEmulator.prototype._destroy = function () {
            };

            widgetEmulator.prototype._setOptions = function (options) {
                var self = this;

                $.each(options, function (key, value) {
                    self._setOption(key, value);
                });
            };

            widgetEmulator.prototype._attachToElement = function (element) {
                var _this = this;
                this.element = element;

                if (this.element) {
                    if (this.options.disabled) {
                        this.disable();
                    }

                    this.element.data(widgetEmulator.DATA_INSTANCE_PROP, this); // store class instance (used by uiDragndrop).

                    this.element.bind("remove." + this.widgetName, function () {
                        _this.destroy();
                    });
                }
            };

            widgetEmulator.prototype._provideDefaults = function () {
                this.options.disabled = this.options.disabled || false;
            };

            widgetEmulator.prototype._setOption = function (key, value) {
                var presetFunc = this["_preset_" + key], oldValue = this.options[key];

                if (presetFunc) {
                    value = presetFunc.apply(this, [value, oldValue]); // .apply(this, arguments);  note: there is no dynamic linkage between the arguments and the formal parameter values when strict mode is used
                }

                if (value !== oldValue) {
                    var postsetFunc = this["_postset_" + key];

                    this.options[key] = value; // set option

                    this._prepostsetOption(key, value);

                    if (postsetFunc) {
                        postsetFunc.apply(this, [value, oldValue]);
                    }
                }
            };

            widgetEmulator.prototype._prepostsetOption = function (key, value) {
            };

            widgetEmulator.prototype._postset_disabled = function (value, oldValue) {
                if (this.element) {
                    this.element[value ? "addClass" : "removeClass"](this.widgetFullName + "-disabled ui-state-disabled").attr("aria-disabled", value);
                }
            };

            widgetEmulator.prototype._eventKey = function (eventName) {
                return eventName + "." + this.widgetName;
            };
            widgetEmulator.DATA_INSTANCE_PROP = "wijemuinstance";
            return widgetEmulator;
        })();
        grid.widgetEmulator = widgetEmulator;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    (function (_grid) {
        "use strict";

        var fieldFactories = [];

        function registerColumnFactory(factory) {
            if (!$.isFunction(factory)) {
                throw "'factory' must be a function.";
            }

            fieldFactories.push(factory);
        }
        _grid.registerColumnFactory = registerColumnFactory;

        function asColumnInstance(grid, column) {
            for (var i = fieldFactories.length - 1; i >= 0; i--) {
                var instance = fieldFactories[i](grid, column);
                if (instance) {
                    return instance;
                }
            }

            throw "Unsupported column.";
        }
        _grid.asColumnInstance = asColumnInstance;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        var c1basefield = (function (_super) {
            __extends(c1basefield, _super);
            function c1basefield(wijgrid, options, widgetName) {
                _super.call(this, options, widgetName || c1basefield.WIDGET_NAME);
                this.mFirstVisible = undefined;

                this.mWijgrid = wijgrid;
            }
            c1basefield.test = function (column) {
                return true;
            };

            c1basefield.prototype._destroy = function () {
                var wijgrid = this._owner(), defCSS = this._defCSS(), wijCSS = this._wijCSS();

                if (this.element) {
                    this.element.find("*").unbind("." + this.widgetName);

                    this.element.removeClass(wijCSS.widget + " " + defCSS.c1basefield + " " + wijCSS.c1basefield + " " + wijCSS.stateDefault).html(this.element.find("." + defCSS.headerCellText).html()); // restore initial cell content
                }

                if (wijgrid && wijgrid._UIDragndrop()) {
                    wijgrid._UIDragndrop(false).detach(this);
                }

                _super.prototype._destroy.apply(this, arguments);
            };

            c1basefield.prototype._owner = function () {
                return this.mWijgrid;
            };

            c1basefield.prototype._attachToElement = function (element) {
                _super.prototype._attachToElement.apply(this, arguments);

                var grid = this._owner();

                if (grid.options.allowColMoving && this._draggable()) {
                    grid._UIDragndrop(true).attach(this);
                }
            };

            c1basefield.prototype._provideDefaults = function () {
                _super.prototype._provideDefaults.call(this);

                wijmo.grid.shallowMerge(this.options, c1basefield.prototype.options);
            };

            c1basefield.prototype._defCSS = function () {
                return wijmo.grid.wijgrid.CSS;
            };

            c1basefield.prototype._wijCSS = function () {
                if (this.mWijgrid) {
                    return this.mWijgrid.options.wijCSS;
                }

                return {};
            };

            //#region rendering
            c1basefield.prototype._initializeCell = function (cell, cellIndex, container, formattedValue, row) {
                var rt = wijmo.grid.rowType, useDefault = true, args = {
                    $cell: cell,
                    $container: container,
                    column: this.options,
                    formattedValue: formattedValue,
                    row: row,
                    afterDefaultCallback: null
                };

                // apply rowHeight option to all tbody rows if virtual scrolling is used.
                if (((row.type & 2 /* data */) || (row.type === 32 /* groupFooter */) || (row.type === 16 /* groupHeader */)) && this.mWijgrid._allowVVirtualScrolling()) {
                    var height = this.mWijgrid._view().getDefaultRowHeight();

                    container.css({
                        "overflow": "hidden",
                        "height": height
                    });
                }

                if ($.isFunction(this.options.cellFormatter)) {
                    useDefault = !this.options.cellFormatter(args);
                }

                if (useDefault) {
                    var rt = wijmo.grid.rowType;

                    switch (row.type & ~(4 /* dataAlt */ | 256 /* detail */)) {
                        case 2 /* data */:
                            this._initializeDataCell(cell, container, args.formattedValue, row);
                            break;

                        case 64 /* footer */:
                            this._initializeFooterCell(cell, container, row);
                            break;

                        case 1 /* header */:
                            this._initializeHeaderCell(cell, container);
                            break;

                        case 8 /* filter */:
                            this._initializeFilterCell(cell, container);
                            break;

                        case 16 /* groupHeader */:
                            this._initializeGroupHeaderCell(cell, cellIndex, container, args.formattedValue, row);
                            break;

                        default:
                            this._updateHTML(row, container, args.formattedValue);
                    }

                    if ($.isFunction(args.afterDefaultCallback)) {
                        args.afterDefaultCallback(args);
                    }
                }
            };

            c1basefield.prototype._initializeDataCell = function (cell, container, formattedValue, rowInfo) {
                this._setupDataCell(container, formattedValue, rowInfo);
            };

            c1basefield.prototype._initializeFooterCell = function (cell, container, row) {
                this._setupFooterCell(container, row);
            };

            c1basefield.prototype._initializeHeaderCell = function (cell, container) {
                this._attachToElement(cell);

                var defCSS = this._defCSS(), wijCSS = this._wijCSS();

                cell.addClass(wijCSS.widget + " " + defCSS.c1basefield + " " + wijCSS.stateDefault);

                this._setupHeaderCell();
            };

            c1basefield.prototype._initializeFilterCell = function (cell, container) {
                var defCSS = this._defCSS(), wijCSS = this._wijCSS();

                container.addClass(wijCSS.widget + " " + wijCSS.stateDefault);

                this._setupFilterCell(container);
            };

            c1basefield.prototype._initializeGroupHeaderCell = function (cell, cellIndex, container, value, row) {
                var grid = this.mWijgrid;

                // provide a toggle icon for the first cell of the groupHeader row
                if (cellIndex === this.mWijgrid._virtualLeaves().length) {
                    // if grouped column is hidden then groupedColumn != this.
                    var groupedColumn = this.mWijgrid._groupedLeaves()[row._extInfo.groupLevel - 1];

                    if (groupedColumn) {
                        var gi = groupedColumn.options.groupInfo;

                        if (gi && (gi.outlineMode !== "none")) {
                            var collapsed = (row._extInfo.state & 2 /* collapsed */) != 0;

                            value = this._getToggleButtonHtml(collapsed, collapsed ? gi.collapsedImageClass : gi.expandedImageClass) + value;
                        }
                    }
                }

                this._updateHTML(row, container, value);
            };

            c1basefield.prototype._getToggleButtonHtml = function (collapsed, priorityIconCss) {
                var defCSS = this._defCSS(), wijCSS = this._wijCSS(), icon = priorityIconCss || (collapsed ? wijCSS.iconArrowRight : wijCSS.iconArrowRightDown);

                return "<div class =\"" + wijCSS.icon + " " + icon + " " + defCSS.groupToggleVisibilityButton + " " + wijCSS.wijgridGroupToggleVisibilityButton + "\">&nbsp;</div>";
            };

            c1basefield.prototype._cellRendered = function (cell, container, row) {
            };

            c1basefield.prototype._needToEncodeValue = function (row) {
                return false;
            };

            c1basefield.prototype._updateHTML = function (row, container, value) {
                var encode = this._needToEncodeValue(row);
                this.mWijgrid.mCellFormatter.updateHTML(container, value, encode);
            };

            //#endregion rendering
            //#region header cell
            c1basefield.prototype._getHeaderContent = function () {
                return this.options.headerText || "&nbsp;";
            };

            c1basefield.prototype._createHeaderContent = function (container) {
                container.html(this._getHeaderContent()); // html(value) returns "" if value is undefined
            };

            c1basefield.prototype._decorateHeaderContent = function (container) {
                var defCSS = this._defCSS(), wijCSS = this._wijCSS();

                container.wrapInner("<span class=\"" + defCSS.headerCellText + " " + wijCSS.wijgridHeaderCellText + "\" />");
            };

            c1basefield.prototype._setupHeaderCell = function () {
                var $container = this.element.children("." + this._defCSS().cellContainer).empty();

                this._createHeaderContent($container);
                this._decorateHeaderContent($container);
            };

            //#endregion
            //#region filter cell
            c1basefield.prototype._setupFilterCell = function (container) {
            };

            //#endregion
            //#region data cell
            c1basefield.prototype._setupDataCell = function (container, formattedValue, rowInfo) {
                this._updateHTML(rowInfo, container, formattedValue);
            };

            //#endregion
            //#region footer cell
            c1basefield.prototype._setupFooterCell = function (container, row) {
                this._updateHTML(row, container, this.options.footerText || this.options._footerTextDOM);
            };

            //#endregion
            //#region properies handlers
            c1basefield.prototype._postset_headerText = function (value, oldValue) {
                this._setupHeaderCell();
            };

            c1basefield.prototype._postset_visible = function (value, oldValue) {
                this._owner().ensureControl(false);
            };

            c1basefield.prototype._postset_width = function (value, oldValue) {
                this.options.ensurePxWidth = true; // prevent auto expanding
                this.options._realWidth = value;
                this._owner().setSize(); /// recalculate sizes and auto expand other columns if possible.
            };

            //#endregion
            //#region UI actions
            c1basefield.prototype._draggable = function () {
                return true;
            };

            c1basefield.prototype._canSize = function () {
                return this.options.allowSizing && this._owner().options.allowColSizing;
            };

            // drag-n-drop
            c1basefield.prototype._canDrag = function () {
                return this.options.allowMoving === true;
            };

            c1basefield.prototype._canDropTo = function (column) {
                // parent can't be dropped into a child
                if (wijmo.grid.isChildOf(this._owner()._allColumns(), column, this)) {
                    return false;
                }

                return true;
            };

            c1basefield.prototype._canDropToGroupArea = function () {
                return false;
            };

            //#endregion
            //#region misc
            c1basefield.prototype._visible = function () {
                return this.options.visLeavesIdx >= 0;
                //return this.options.parentVis === true;
            };

            c1basefield.prototype._isFirstVisible = function () {
                if (this.mFirstVisible === undefined) {
                    this.mFirstVisible = this.options.visLeavesIdx === this.mWijgrid._virtualLeaves().length;
                }

                return this.mFirstVisible;
            };

            c1basefield.prototype._isRendered = function () {
                return this._visible() && this.mWijgrid._renderableColumnsRange().contains(this);
            };

            c1basefield.prototype._strictWidthMode = function () {
                return !!(this.options.ensurePxWidth || this.mWijgrid.options.ensureColumnsPxWidth || this.mWijgrid._allowHVirtualScrolling());
            };
            c1basefield.WIDGET_NAME = "wijmo.c1basefield";
            return c1basefield;
        })(_grid.widgetEmulator);
        _grid.c1basefield = c1basefield;

        var c1basefield_options = (function () {
            function c1basefield_options() {
                /** A value indicating whether the column can be moved.
                * @example
                * $("#element").wijgrid({ columns: [ { allowMoving: true } ] });
                */
                this.allowMoving = true;
                /** A value indicating whether the column can be sized.
                * @example
                * $("#element").wijgrid({ columns: [ { allowSizing: true } ] });
                */
                this.allowSizing = true;
                /** This function is called each time wijgrid needs to create cell content.
                * This occurs when rows are being rendered or cell editing is about to finish.
                * You can use it to customize cell content.
                * @example
                * // Add an image which URL is obtained from the "Url" data field to the column cells.
                * $("#demo").wijgrid({
                *		data: [
                *			{ ID: 0, Url: "/images/0.jpg" },
                *			{ ID: 1, Url: "/images/1.jpg" }
                *		],
                *		columns: [
                *			{},
                *			{
                *				cellFormatter: function (args) {
                *					if (args.row.type & wijmo.grid.rowType.data) {
                *						args.$container
                *							.empty()
                *							.append($("<img />")
                *								.attr("src", args.row.data.Url));
                *
                *						return true;
                *					}
                *				}
                *			}
                *		]
                * });
                * @type {Function}
                * @param {wijmo.grid.IC1BaseFieldCellFormatterArgs} args The data with this function.
                * @returns {Boolean} True if container content has been changed and wijgrid should not apply the default formatting to the cell.
                * @remarks
                * Important: cellFormatter should not alter content of header and filter row cells container.
                */
                this.cellFormatter = undefined;
                /** Determines whether to use number type column width as the real width of the column.
                * @example
                * $("#element").wijgrid({ columns: [{ ensurePxWidth: true }]});
                * @remarks
                * If this option is set to true, wijgrid will use the width option of the column widget.
                * If this option is undefined, wijgrid will refer to the ensureColumnsPxWidth option.
                */
                this.ensurePxWidth = undefined;
                /** Gets or sets the footer text.
                * The text may include a placeholder: "{0}" is replaced with the aggregate.
                * @example
                * $("#element").wijgrid({ columns: [{ footerText: "footer" }]});
                * @remarks
                * If the value is undefined the footer text will be determined automatically depending on the type of the datasource:
                * DOM table - text in the footer cell.
                */
                this.footerText = undefined;
                /** Gets or sets the header text.
                * @example
                * $("#element").wijgrid({ columns: [ { headerText: "column0" } ] });
                * @remarks
                * If the value is undefined the header text will be determined automatically depending on the type of the datasource:
                * DOM table - text in the header cell.
                * Array of objects - dataKey (name of the field associated with column).
                * Two-dimensional array - dataKey (index of the field associated with column).
                */
                this.headerText = undefined;
                /** Gets or sets the text alignment of data cells. Possible values are "left", "right", "center".
                * @example
                * $("#element").wijgrid({ columns: [{ textAligment: "right" }]});
                */
                this.textAlignment = undefined;
                /** A value indicating whether column is visible.
                * @example
                * $("#element").wijgrid({ columns: [{ visible: true }]});
                */
                this.visible = true;
                /** Determines the width of the column.
                * @type {String|Number}
                * @example
                * $("#element").wijgrid({ columns: [ { width: 150 } ] });
                * $("#element").wijgrid({ columns: [ { width: "10%" } ]});
                * @remarks
                * The option could either be a number of string.
                * Use number to specify width in pixel, use string to specify width in percentage.
                * By default, wijgrid emulates the table element behavior when using number as width. This means wijgrid may not have the exact width specified. If exact width is needed, please set ensureColumnsPxWidth option of wijgrid to true.
                */
                this.width = undefined;
            }
            return c1basefield_options;
        })();
        _grid.c1basefield_options = c1basefield_options;
        ;

        c1basefield.prototype.options = wijmo.grid.extendWidgetOptions({}, new c1basefield_options());

        wijmo.grid.registerColumnFactory(function (grid, column) {
            if (c1basefield.test(column)) {
                return new c1basefield(grid, column);
            }

            return null;
        });
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var c1rowheaderfield = (function (_super) {
            __extends(c1rowheaderfield, _super);
            function c1rowheaderfield(wijgrid, options, widgetName) {
                _super.call(this, wijgrid, options, widgetName || c1rowheaderfield.WIDGET_NAME);
            }
            c1rowheaderfield.getInitOptions = function () {
                return {
                    clientType: c1rowheaderfield.CLIENT_TYPE,
                    parentVis: true
                };
            };

            c1rowheaderfield.test = function (column) {
                return column.clientType === c1rowheaderfield.CLIENT_TYPE;
            };

            c1rowheaderfield.prototype._provideDefaults = function () {
                _super.prototype._provideDefaults.call(this);

                this.options.allowMoving = false;
                this.options.allowSizing = false;
                this.options.dataKey = null;
                this.options.width = c1rowheaderfield.COLUMN_WIDTH;
                this.options.ensurePxWidth = true;
            };

            c1rowheaderfield.prototype._initializeCell = function (cell, cellIndex, container, formattedValue, rowInfo) {
                var defCSS = this._defCSS(), wijCSS = this._wijCSS();

                _super.prototype._initializeCell.apply(this, arguments);

                cell.attr({ "role": "rowheader", "scope": "row" }).addClass(wijCSS.stateDefault + " " + wijCSS.content + " " + defCSS.rowHeader + " " + wijCSS.wijgridRowHeader);
            };

            c1rowheaderfield.prototype._draggable = function () {
                return false;
            };

            c1rowheaderfield.prototype._isFirstVisible = function () {
                return false;
            };
            c1rowheaderfield.CLIENT_TYPE = "c1rowheaderfield";

            c1rowheaderfield.WIDGET_NAME = "wijmo.c1rowheaderfield";

            c1rowheaderfield.COLUMN_WIDTH = 22;
            return c1rowheaderfield;
        })(_grid.c1basefield);
        _grid.c1rowheaderfield = c1rowheaderfield;

        c1rowheaderfield.prototype.options = wijmo.grid.extendWidgetOptions({}, new _grid.c1basefield_options());

        wijmo.grid.registerColumnFactory(function (grid, column) {
            if (c1rowheaderfield.test(column)) {
                return new c1rowheaderfield(grid, column);
            }

            return null;
        });
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="c1basefield.ts"/>
/// <reference path="c1groupedfield.ts"/>
/// <reference path="interfaces.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="../../../wijinput/jquery.wijmo.wijinputdate.ts"/>
    /// <reference path="../../../wijinput/jquery.wijmo.wijinputtext.ts"/>
    /// <reference path="../../../wijinput/jquery.wijmo.wijinputnumber.ts"/>
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        var c1field = (function (_super) {
            __extends(c1field, _super);
            function c1field(wijgrid, options, widgetName) {
                _super.call(this, wijgrid, options, widgetName || c1field.WIDGET_NAME);
                this.mFilterEditorInitialized = false;
            }
            c1field.test = function (column) {
                // return column.groupInfo || column.sortDirection || column.aggregate || column.dataKey === null;
                return wijmo.grid.validDataKey(column.dataKey);
            };

            c1field.isGroupedColumn = function (column) {
                var opt = column.options;
                return wijmo.grid.c1field.test(opt) && (opt.groupInfo && opt.groupInfo.position && (opt.groupInfo.position !== "none"));
            };

            c1field.prototype._destroy = function () {
                if (this.element) {
                    var defCSS = this._defCSS();
                    this.element.removeClass(defCSS.c1field);
                }

                try  {
                    if (this.mFilterEditor) {
                        this.mFilterEditor.closest("td").find("*").unbind("." + this.widgetName);

                        switch (this._getInputEditorType()) {
                            case "date":
                                if (this.mFilterEditor.data("wijmo-wijinputdate")) {
                                    this.mFilterEditor.wijinputdate("destroy");
                                }
                                break;

                            case "text":
                                if (this.mFilterEditor.data("wijmo-wijinputtext")) {
                                    this.mFilterEditor.wijinputtext("destroy");
                                }
                                break;

                            case "numberCurrency":
                            case "numberNumber":
                            case "numberPercent":
                                if (this.mFilterEditor.data("wijmo-wijinputnumber")) {
                                    this.mFilterEditor.wijinputnumber("destroy");
                                }
                                break;
                        }
                    }

                    this._hideDropDownList();
                } finally {
                    this.mFilterEditor = null;
                    this.mDropDownFilterList = null;
                }

                _super.prototype._destroy.apply(this, arguments);
            };

            c1field.prototype._provideDefaults = function () {
                _super.prototype._provideDefaults.call(this);

                wijmo.grid.shallowMerge(this.options, c1field.prototype.options);

                if ($.isFunction(this.options.dataParser)) {
                    this.options.dataParser = new this.options.dataParser(); // legacy, converts a function into an object intstance.
                }

                this.options.groupInfo = this.options.groupInfo || {};
                wijmo.grid.shallowMerge(this.options.groupInfo, c1field.prototype.options.groupInfo);
            };

            //#region rendering
            c1field.prototype._initializeHeaderCell = function (cell, container) {
                _super.prototype._initializeHeaderCell.apply(this, arguments);

                var defCSS = this._defCSS();

                cell.addClass(defCSS.c1field);
            };

            c1field.prototype._needToEncodeValue = function (row) {
                //  override and introduce the encodeHtml option.
                var rt = wijmo.grid.rowType, encode = ((row.type & 2 /* data */) && !(row.type & 256 /* detail */)) ? this.options.encodeHtml : _super.prototype._needToEncodeValue.apply(this, arguments);

                return encode;
            };

            //#endregion
            //#region UI actions
            c1field.prototype._isSortable = function () {
                return true;
            };

            c1field.prototype._isSortableUI = function () {
                var grid = this._owner();
                return grid.options.allowSorting && this.options.allowSort && this._isSortable();
            };

            c1field.prototype._canDropTo = function (column) {
                if (_super.prototype._canDropTo.apply(this, arguments)) {
                    //the grouped column can't be dropped into group area
                    if (this.options.groupedIndex !== undefined && (column instanceof _grid.c1groupedfield)) {
                        return false;
                    }

                    return true;
                }

                return false;
            };

            c1field.prototype._canDropToGroupArea = function () {
                return this.options.groupedIndex === undefined;
            };

            //#endregion
            //#region header cell
            c1field.prototype._decorateHeaderContent = function ($container) {
                var wijgrid = this._owner(), defCSS = wijmo.grid.wijgrid.CSS, wijCSS = wijgrid.options.wijCSS;

                if (!this._isSortable()) {
                    _super.prototype._decorateHeaderContent.apply(this, arguments); // plain text
                } else {
                    var isSortableUI = this._isSortableUI();

                    if (isSortableUI) {
                        $container.wrapInner("<a class=\"" + defCSS.headerCellText + " " + wijCSS.wijgridHeaderCellText + "\" href=\"#\" role=\"button\" />").children("a").bind("click." + this.widgetName, this, $.proxy(this._onSortableElementClick, this));
                    } else {
                        _super.prototype._decorateHeaderContent.apply(this, arguments); // plain text
                    }

                    // icons
                    var baseSortCSS = defCSS.headerCellSortIcon + " " + wijCSS.wijgridHeaderCellSortIcon + " " + wijCSS.icon, sortIcon = null;

                    switch (this.options.sortDirection) {
                        case "ascending":
                            $container.append(sortIcon = $("<span class=\"" + baseSortCSS + " " + wijCSS.iconArrowUp + "\"></span>"));
                            break;

                        case "descending":
                            $container.append(sortIcon = $("<span class=\"" + baseSortCSS + " " + wijCSS.iconArrowDown + "\"></span>"));
                            break;
                    }

                    if (sortIcon && isSortableUI) {
                        sortIcon.css("cursor", "pointer").bind("click." + this.widgetName, this, $.proxy(this._onSortableElementClick, this));
                    }
                }
            };

            c1field.prototype._onSortableElementClick = function (args) {
                var column = args.data;

                if (column.options.disabled) {
                    return false;
                }

                if (column.options.allowSort) {
                    column._owner()._handleSort(column, args.ctrlKey);
                }

                return false;
            };

            //#endregion
            //#region filter cell
            c1field.prototype._setupFilterCell = function (container) {
                if (this.options.showFilter) {
                    var defCSS = this._defCSS(), wijCSS = this._wijCSS();

                    container.html("<table cellPadding=\"0\" cellSpacing=\"0\" class=\"" + defCSS.filter + " " + wijCSS.wijgridFilter + " " + wijCSS.cornerAll + "\">" + "<tr>" + "<td style=\"width:100%\">" + "<input type=\"text\" class=\"" + defCSS.filterInput + " " + wijCSS.wijgridFilterInput + "\" style=\"width:100%\" />" + "</td>" + "<td class=\"" + defCSS.filterTrigger + " " + wijCSS.wijgridFilterTrigger + " " + wijCSS.cornerRight + " " + wijCSS.stateDefault + "\">" + "<span class=\"" + wijCSS.icon + " " + wijCSS.iconArrowDown + "\"></span>" + "</td>" + "</tr>" + "</table>");

                    this._createFilterCellEditor(container);
                }
            };

            c1field.prototype._createFilterCellEditor = function (container) {
                var _this = this;
                var wijgrid = this._owner(), inputType = wijmo.grid.HTML5InputSupport.getDefaultInputType(wijgrid._isMobileEnv(), this.options), defCSS = this._defCSS(), wijCSS = this._wijCSS(), self = this;

                //container
                //	.bind(((<any>$.support).selectstart ? "selectstart" : "mousedown"), function (event) { //?? the problem of inputing in the filter textbox
                //		event.stopPropagation();
                //	})
                // create filter buttons
                container.find("." + defCSS.filterTrigger).attr({ "role": "button", "aria-haspopup": "true" }).bind("mouseenter." + this.widgetName, function (e) {
                    if (!self.options.disabled) {
                        $(this).addClass(wijCSS.stateDefault + " " + wijCSS.stateHover);
                    }
                }).bind("mouseleave." + this.widgetName, function (e) {
                    if (!self.options.disabled) {
                        $(this).removeClass(wijCSS.stateDefault + " " + wijCSS.stateHover + " " + wijCSS.stateActive);
                    }
                }).bind("mouseup." + this.widgetName, this, function (e) {
                    if (!self.options.disabled) {
                        $(this).removeClass(wijCSS.stateDefault + " " + wijCSS.stateActive);
                    }
                }).bind("mousedown." + this.widgetName, $.proxy(this._onFilterBtnClick, this)).bind("click." + this.widgetName, function (e) {
                    e.preventDefault();
                }); // prevent # being added to url.

                var dataValue = wijgrid.parse(this.options, wijmo.grid.filterHelper.getSingleValue(this.options.filterValue));

                if (dataValue === null || dataValue === "undefined") {
                    switch (wijmo.grid.getDataType(this.options)) {
                        case "boolean":
                            dataValue = false;
                            break;

                        case "number":
                        case "currency":
                            dataValue = 0;
                            break;

                        case "datetime":
                            dataValue = new Date(); // current date
                            break;

                        default:
                            dataValue = "";
                    }
                }

                var editorOptions = {
                    culture: wijgrid.options.culture,
                    cultureCalendar: wijgrid.options.cultureCalendar,
                    disabled: wijgrid.options.disabled,
                    decimalPlaces: (function (pattern) {
                        var test = /^(n|p|c){1}(\d*)$/.exec(pattern);

                        if (test && test[2]) {
                            return parseInt(test[2], 10);
                        }

                        test = /^(d){1}(\d*)$/.exec(pattern);
                        if (test) {
                            return 0;
                        }

                        return 2;
                    })(this.options.dataFormatString),
                    imeMode: this.options.imeMode,
                    triggerMouseUp: function (e) {
                        _this._owner()._hideAllFilterDropDownLists();
                    }
                };

                this.mFilterEditor = container.find("input").bind("keypress." + this.widgetName, $.proxy(this._onFilterEditorKeyPress, this));

                var valListener = function (args) {
                    if (_this.mFilterEditorInitialized) {
                        _this._onFilterEditorValueChanged(args);
                    }
                };

                switch (this._getInputEditorType()) {
                    case "date":
                        if (inputType === "text") {
                            this.mFilterEditor.wijinputdate($.extend(editorOptions, {
                                date: dataValue,
                                dateFormat: this.options.dataFormatString || undefined,
                                showTrigger: true,
                                dateChanged: function (e, args) {
                                    valListener({ value: args.data });
                                },
                                calendar: wijgrid.options.calendar
                            }));
                        } else {
                            // html5 editor
                            this._createHtmlEditor(this.mFilterEditor, inputType, wijmo.grid.HTML5InputSupport.toStr(dataValue, inputType));
                        }
                        break;

                    case "text":
                        this.mFilterEditor.wijinputtext($.extend(editorOptions, {
                            text: dataValue + "",
                            textChanged: function (e, args) {
                                valListener({ value: args.text });
                            }
                        }));
                        break;

                    case "numberCurrency":
                        this.mFilterEditor.wijinputnumber($.extend(editorOptions, {
                            type: "currency",
                            value: dataValue,
                            valueChanged: function (e, args) {
                                valListener({ value: args.value });
                            }
                        }));
                        break;

                    case "numberNumber":
                        if (inputType === "text") {
                            this.mFilterEditor.wijinputnumber($.extend(editorOptions, {
                                value: dataValue,
                                valueChanged: function (e, args) {
                                    valListener({ value: args.value });
                                }
                            }));
                        } else {
                            // html5 editor
                            this._createHtmlEditor(this.mFilterEditor, inputType, wijmo.grid.HTML5InputSupport.toStr(dataValue, inputType));
                        }
                        break;

                    case "numberPercent":
                        this.mFilterEditor.wijinputnumber($.extend(editorOptions, {
                            type: "percent",
                            value: dataValue * 100,
                            valueChanged: function (e, args) {
                                valListener({ value: args.value / 100 });
                            }
                        }));
                        break;

                    default:
                        throw "Unsupported editor type";
                }

                this.mFilterEditorInitialized = true;
            };

            c1field.prototype._createHtmlEditor = function (input, inputType, value) {
                var defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._owner().options.wijCSS;

                input[0].type = inputType; // use it instead of .attr("type", inputType) to avoid the "'type' property/attribute cannot be changed." exception.

                return input.addClass(wijCSS.stateDefault).wrap("<span class=\"" + defCSS.filterNativeHtmlEditorWrapper + " " + wijCSS.wijgridFilterNativeHtmlEditorWrapper + "\"></span").val(value);
            };

            c1field.prototype._onFilterBtnClick = function (e) {
                var _this = this;
                var wijgrid = this._owner(), ddflVisible = !!this.mDropDownFilterList;

                wijgrid._hideAllFilterDropDownLists();

                if (this.options.disabled || ddflVisible) {
                    return false;
                }

                e.target.focus(); //TFS #24253: In IE9, wijgrid is distorted on opening filter drop-down in a scrollable grid

                var filterOpLowerCase = wijmo.grid.filterHelper.getSingleOperatorName(this.options.filterOperator).toLowerCase(), applicableFilters = wijgrid.getFilterOperatorsByDataType(wijmo.grid.getDataType(this.options)), args = {
                    operators: $.extend(true, [], applicableFilters),
                    column: this.options
                }, items = [];

                wijgrid._onFilterOperatorsListShowing(args);

                if (args.operators) {
                    $.each(args.operators, function (key, operator) {
                        items.push({
                            label: operator.displayName || operator.name,
                            value: operator.name,
                            selected: operator.name.toLowerCase() === filterOpLowerCase
                        });
                    });
                }

                this.mDropDownFilterList = $("<div />").addClass(wijmo.grid.wijgrid.CSS.filterList + " " + wijgrid.options.wijCSS.wijgridFilterList).appendTo(document.body).wijlist({
                    autoSize: true,
                    maxItemsCount: c1field.DROPDOWN_FILTERS_MAX,
                    selected: function (e, data) {
                        var filterValue = _this._getFilterValueFromEditor();
                        _this._hideDropDownList();
                        wijgrid._handleFilter(_this, data.item.value, filterValue);
                    }
                }).css("z-index", wijmo.grid.getZIndex(wijgrid.mOuterDiv, 9999)).wijlist("setItems", items).wijlist("renderList");

                var width = this.mDropDownFilterList.width() | 150;

                this.mDropDownFilterList.width(items.length > c1field.DROPDOWN_FILTERS_MAX ? width + 20 : width).wijlist("refreshSuperPanel").position({
                    of: $(e.currentTarget),
                    my: "left top",
                    at: "left bottom"
                });

                this.mDropDownFilterList.$button = $(e.currentTarget);

                var eventUID = this.mDropDownFilterList.eventUID = wijmo.grid.getUID();

                $(document).bind("mousedown." + this.widgetName + "." + eventUID, { column: this }, this._onDocMouseDown);
            };

            c1field.prototype._onFilterEditorKeyPress = function (e) {
                if (e && (e.which === 13)) {
                    var wijgrid = this._owner(), filterValue = this._getFilterValueFromEditor(), filterOperator = (this.options.filterOperator || "").toLowerCase();

                    if (!filterValue) {
                        filterValue = undefined;
                        filterOperator = "nofilter";
                    } else {
                        if (!filterOperator || (filterOperator === "nofilter")) {
                            filterOperator = (wijmo.grid.getDataType(this.options) === "string") ? "contains" : "equals";
                        }
                    }

                    this._hideDropDownList();
                    wijgrid._handleFilter(this, filterOperator, filterValue);
                }
            };

            c1field.prototype._onDocMouseDown = function (e) {
                var column = e.data.column, $target = $(e.target), defCSS = wijmo.grid.wijgrid.CSS, $filterList = $target.parents("." + defCSS.filterList + ":first"), $filterButton = $target.is("." + defCSS.filterTrigger) ? $target : $target.parents("." + defCSS.filterTrigger + ":first");

                if (($filterButton.length && ($filterButton[0] === column.mDropDownFilterList.$button[0])) || ($filterList.length && ($filterList[0] === column.mDropDownFilterList[0]))) {
                    // do nothing
                } else {
                    column._hideDropDownList();
                }
            };

            c1field.prototype._hideDropDownList = function () {
                if (this.mDropDownFilterList) {
                    var eventUID = this.mDropDownFilterList.eventUID;

                    this.mDropDownFilterList.remove();

                    this.mDropDownFilterList = null;

                    $(document).unbind("mousedown." + this.widgetName + "." + eventUID, this._onDocMouseDown);
                }

                if (this.mFilterEditor && (this._getInputEditorType() === "date")) {
                    var inputDate = this.mFilterEditor.data("wijmo-wijinputdate");
                    if (inputDate) {
                        if (inputDate._popupVisible()) {
                            inputDate._hidePopup();
                        }
                    }
                }
            };

            // "text", "date", "numberNumber", "numberPercent", "numberCurrency"
            c1field.prototype._getInputEditorType = function () {
                switch (wijmo.grid.getDataType(this.options)) {
                    case "number":
                        return (this.options.dataFormatString && this.options.dataFormatString.indexOf("p") === 0) ? "numberPercent" : "numberNumber";

                    case "currency":
                        return "numberCurrency";

                    case "datetime":
                        return "date";

                    default:
                        return "text";
                }
            };

            c1field.prototype._getFilterValueFromEditor = function () {
                var wijgrid = this._owner(), inputType = wijmo.grid.HTML5InputSupport.getDefaultInputType(wijgrid._isMobileEnv(), this.options), filterValue;

                switch (this._getInputEditorType()) {
                    case "date":
                        if (inputType === "text") {
                            filterValue = this.mFilterEditor.wijinputdate("option", "date") || new Date(); // current date
                        } else {
                            filterValue = wijmo.grid.HTML5InputSupport.parse(this.mFilterEditor.val(), inputType) || new Date();
                        }
                        break;

                    case "text":
                        filterValue = this.mFilterEditor.wijinputtext("option", "text");
                        break;

                    case "numberNumber":
                        if (inputType !== "text") {
                            filterValue = wijmo.grid.HTML5InputSupport.parse(this.mFilterEditor.val(), inputType) || 0;
                            break;
                        }

                    case "numberCurrency":
                        filterValue = this.mFilterEditor.wijinputnumber("option", "value");
                        break;

                    case "numberPercent":
                        filterValue = this.mFilterEditor.wijinputnumber("option", "value") / 100;
                        break;
                }

                return filterValue;
            };

            //#endregion filtering
            //#region footer cell
            c1field.prototype._setupFooterCell = function (container, row) {
                var opt = this.options;

                if (opt.aggregate && (opt.aggregate !== "none")) {
                    var totalValue = "";

                    if (opt._totalsValue !== undefined) {
                        totalValue = this._owner().toStr(this.options, opt._totalsValue);
                    }

                    this._updateHTML(row, container, wijmo.grid.stringFormat(opt.footerText || "{0}", totalValue || ""));
                } else {
                    _super.prototype._setupFooterCell.apply(this, arguments);
                }
            };

            //#endregion
            //#region properies handlers
            c1field.prototype._postset_aggregate = function (value, oldValue) {
                this._owner().ensureControl(false);
            };

            c1field.prototype._postset_allowSort = function (value, oldValue) {
                this._setupHeaderCell();
            };

            c1field.prototype._postset_dataType = function (value, oldValue) {
                throw "read-only";
            };

            c1field.prototype._postset_dataParser = function (value, oldValue) {
                this._owner().ensureControl(false);
            };

            c1field.prototype._postset_disabled = function (value, oldValue) {
                if (this.mFilterEditor) {
                    $.each(this.mFilterEditor.data(), function (key, widget) {
                        if (widget && widget.widgetName && widget.option) {
                            widget.option("disabled", value);
                        }
                    });
                }
            };

            c1field.prototype._postset_dataFormatString = function (value, oldValue) {
                this._owner().ensureControl(false);
            };

            c1field.prototype._postset_filterOperator = function (value, oldValue) {
                var wijgrid = this._owner();

                wijgrid._resetDataProperitesOnFilterChanging();

                wijgrid.ensureControl(true);
            };

            c1field.prototype._postset_filterValue = function (value, oldValue) {
                var wijgrid = this._owner();

                wijgrid._resetDataProperitesOnFilterChanging();

                wijgrid.ensureControl(true);
            };

            c1field.prototype._postset_groupInfo = function (value, oldValue) {
                this._owner().ensureControl(true);
            };

            c1field.prototype._postset_rowMerge = function (value, oldValue) {
                this._owner().ensureControl(false);
            };

            c1field.prototype._postset_showFilter = function (value, oldValue) {
                this._owner().ensureControl(false);
            };

            c1field.prototype._postset_sortDirection = function (value, oldValue) {
                this.options.sortOrder = 0;
                this._owner().ensureControl(true);
            };

            c1field.prototype._postset_width = function (value, oldValue) {
                this._hideDropDownList();
                _super.prototype._postset_width.apply(this, arguments);
            };

            //#endregion
            //#region wijinput event handlers
            c1field.prototype._onFilterEditorValueChanged = function (args) {
            };
            c1field.WIDGET_NAME = "wijmo.c1field";
            c1field.DROPDOWN_FILTERS_MAX = 8;
            return c1field;
        })(_grid.c1basefield);
        _grid.c1field = c1field;

        var c1field_options = (function (_super) {
            __extends(c1field_options, _super);
            function c1field_options() {
                _super.apply(this, arguments);
                /** Causes the grid to calculate aggregate values on the column and place them in the column footer cell or group header and footer rows.
                * Possible values are: "none", "count", "sum", "average", "min", "max", "std", "stdPop", "var", "varPop" and "custom".
                * @example
                * $("#element").wijgrid({ columns: [{ aggregate: "count" }]});
                * @remarks
                * Possible values are:
                * "none": no aggregate is calculated or displayed.
                * "count": count of non-empty values.
                * "sum": sum of numerical values.
                * "average": average of the numerical values.
                * "min": minimum value (numerical, string, or date).
                * "max": maximum value (numerical, string, or date).
                * "std": standard deviation (using formula for Sample, n-1).
                * "stdPop": standard deviation (using formula for Population, n).
                * "var": variance (using formula for Sample, n-1).
                * "varPop": variance (using formula for Population, n).
                * "custom": custom value (causing grid to throw groupAggregate event).
                *
                * If the showFooter option is off or grid does not contain any groups, setting the "aggregate" option has no effect.
                */
                this.aggregate = "none";
                /** A value indicating whether column can be sorted.
                * @example
                * $("#element").wijgrid({ columns: [{ allowSort: true }] });
                */
                this.allowSort = true;
                /** A value indicating the key of the data field associated with a column.
                * If an array of objects is used as a datasource for wijgrid, this should be string value,
                * otherwise this should be an integer determining an index of the field in the datasource.
                * @type {String|Number}
                * @example
                * $("#element").wijgrid({ columns: [{ dataKey: "ProductID" }]});
                */
                this.dataKey = undefined;
                /** Column data type. Used to determine the rules for sorting, grouping, aggregate calculation, and so on.
                * Possible values are: "string", "number", "datetime", "currency" and "boolean".
                * @example
                * $("#element").wijgrid({ columns: [{ dataType: "string" }]});
                * @remarks
                * Possible values are:
                * "string": if using built-in parser any values are acceptable; "&nbsp;" considered as an empty string, nullString as null.
                * "number": if using built-in parser only numeric values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
                * "datetime": if using built-in parser only date-time values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
                * "currency": if using built-in parser only numeric and currency values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
                * "boolean": if using built-in parser only "true" and "false" (case-insensitive) values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
                */
                this.dataType = undefined;
                /** Data converter that is able to translate values from a string representation to column data type and back.
                * @example
                * var myBoolParser = {
                *		parseDOM: function (value, culture, format, nullString) {
                *			return this.parse(value.innerHTML, culture, format, nullString);
                *		},
                *		parse: function (value, culture, format, nullString) {
                *			if (typeof (value) === "boolean")  return value;
                *
                *			if (!value || (value === "&nbsp;") || (value === nullString)) {
                *				return null;
                *			}
                *
                *			switch (value.toLowerCase()) {
                *				case "on": return true;
                *				case "off": return false;
                *			}
                *
                *			return NaN;
                *		},
                *		toStr: function (value, culture, format, nullString) {
                *			if (value === null)  return nullString;
                *				return (value) ? "on" : "off";
                *			}
                *		}
                * }
                *
                * $("#element").wijgrid({ columns: [ { dataType: "boolean", dataParser: myBoolParser } ] });
                * @remarks
                * If undefined, than the built-in parser for supported datatypes will be used.
                */
                this.dataParser = undefined;
                /** A pattern used for formatting and parsing column values.
                * @example
                * $("#element").wijgrid({
                *		columns: [
                *			{ dataType: "currency" },
                *			{ dataType: "number" },
                *			{ dataType: "number", dataFormatString: "p0" }
                *		]
                * });
                * @remarks
                * The default value is undefined ("n" pattern will be used for "number" dataType, "d" for "datetime", "c" for "currency").
                * Please see the https://github.com/jquery/globalize for a full explanation and additional values.
                */
                this.dataFormatString = undefined;
                /** A value indicating whether data values are HTML-encoded before they are displayed in a cell.
                * @example
                * $("#element").wijgrid({
                *		data: [
                *			[0, "<b>value</b>"],
                *			[1, "&amp;"],
                *		],
                *		columns: [
                *			{ headerText: "ID" },
                *			{ headerText: "Value", encodeHtml: true }
                *		]
                * });
                */
                this.encodeHtml = false;
                /** An operations set for filtering. Must be either one of the embedded operators or custom filter operator.
                * Operator names are case insensitive.
                *
                * @example
                * $("#element").wijgrid({ columns: [{ dataType: "number", filterOperator: "Equals", filterValue: 0 }]});
                * @remarks
                * Embedded filter operators include:
                * "NoFilter": no filter.
                * "Contains": applicable to "string" data type.
                * "NotContain": applicable to "string" data type.
                * "BeginsWith": applicable to "string" data type.
                * "EndsWith": applicable to "string" data type.
                * "Equals": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "NotEqual": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "Greater": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "Less": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "GreaterOrEqual": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "LessOrEqual": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "IsEmpty": applicable to "string".
                * "NotIsEmpty": applicable to "string".
                * "IsNull": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                * "NotIsNull": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
                *
                * Full option value is:
                *		[filterOperartor1, ..., filterOperatorN]
                * where each filter item is an object of the following kind:
                *		{ name: <operatorName>, condition: "or"|"and" }
                * where:
                *		name: filter operator name.
                *		condition: logical condition to other operators, "or" is by default.
                * Example:
                *		filterOperator: [ { name: "Equals" }, { name: "NotEqual", condition: "and" } ]
                * It is possible to use shorthand notation, the following statements are equivalent:
                *		filterOperator: [ { name: "Equals" }, { name: "BeginsWith" } ]
                *		filterOperator: [ "Equals", "BeginsWith" ]
                * In the case of a single operator option name may contain only filter operator name, the following statements are equivalent:
                *		filterOperator: [ { name: "Equals" } ]
                *		filterOperator: [ "Equals" ]
                *		filterOperator: "Equals"
                *
                * Note: wijgrid built-in filter editors do not support multiple filter operators.
                *
                */
                this.filterOperator = "nofilter";
                /** A value set for filtering.
                * @example
                * $("#element").wijgrid({ columns: [{ dataType: "number", filterOperator: "Equals", filterValue: 0 }]});
                * @remarks
                * Full option value is:
                *		[filterValue1, ..., filterValueN]
                * where each item is a filter value for the corresponding filter operator. Example:
                *		filterValue: [0, "a", "b"]
                *
                * Built-in filter operators support array of values as an argument. Example:
                *		filterOperator: ["Equals", "BeginsWith"]
                *		filterValue: [[0, 1, 2], "a"]
                * As a result of filtering all the records having 0, 1, 2, or starting with "a" will be fetched.
                *
                * Shorthand notation allows omitting square brackets, the following statements are equivalent:
                *		filterValue: ["a"]
                *		filterValue: [["a"]]
                *		filterValue: "a"
                *
                * Note: wijgrid built-in filter editors do not support multiple filter values.
                */
                this.filterValue = undefined;
                /** Used to customize the appearance and position of groups.
                * @example
                * $("#element").wijgrid({ columns: [{ groupInfo: { position: "header" }}]});
                */
                this.groupInfo = {
                    /** @ignore */
                    expandInfo: [],
                    /** @ignore */
                    level: undefined,
                    groupSingleRow: true,
                    collapsedImageClass: undefined,
                    expandedImageClass: undefined,
                    position: "none",
                    outlineMode: "startExpanded",
                    headerText: undefined,
                    footerText: undefined
                };
                /**
                * Controls the state of the input method editor for text fields.
                * Possible values are: "auto", "active", "inactive", "disabled".
                * Please refer to https://developer.mozilla.org/en-US/docs/Web/CSS/ime-mode for more info.
                * @example
                * $("#element").wijgrid({ columns: [{ imeMode: "auto" }]});
                */
                this.imeMode = "auto";
                /**
                * Determines the type of html editor for filter and cells.
                * Possible values are: "number", "date", "datetime", "datetime-local", "month", "time", "text".
                * @example
                * $("#element").wijgrid({ columns: [{ inputType: "text" }]});
                * @remarks
                * If the value is set then input type element is used with "type" attribute set to the value. If the value is not set then:
                *  - in desktop environment a "text" input element is used as the editor.
                *  - in mobile environment a "number" input element is used for columns having "number" and "currency" dataType; for columns where dataType = "datetime" a "datetime" input element is used, otherwise a "text" input element is shown.
                */
                this.inputType = undefined;
                /** A value indicating whether the cells in the column can be edited.
                * @example
                * $("#element").wijgrid({ columns: [ { readOnly: false } ] });
                */
                this.readOnly = false;
                /** Determines whether rows are merged. Possible values are: "none", "free" and "restricted".
                * @example
                * $("#element").wijgrid({ columns: [{ rowMerge: "none" }]});
                * @remarks
                * Possible values are:
                * "none": no row merging.
                * "free": allows row with identical text to merge.
                * "restricted": keeps rows with identical text from merging if rows in the previous column are merged.
                */
                this.rowMerge = "none";
                /** A value indicating whether filter editor will be shown in the filter row.
                * @example
                * $("#element").wijgrid({ columns: [{ showFilter: true }]});
                */
                this.showFilter = true;
                /** Determines the sort direction. Possible values are: "none", "ascending" and "descending".
                * @example
                * $("#element").wijgrid({ columns: [{ sortDirection: "none" }]});
                * @remarks
                * Possible values are:
                * "none": no sorting.
                * "ascending": sort from smallest to largest.
                * "descending": sort from largest to smallest.
                */
                this.sortDirection = "none";
                /** A value indicating whether null value is allowed during editing.
                * @example
                * $("#element").wijgrid({ columns: [{ valueRequired: false }]});
                */
                this.valueRequired = false;
            }
            return c1field_options;
        })(_grid.c1basefield_options);
        _grid.c1field_options = c1field_options;
        ;

        c1field.prototype.options = wijmo.grid.extendWidgetOptions(_grid.c1basefield.prototype.options, new c1field_options());

        wijmo.grid.registerColumnFactory(function (grid, column) {
            if (c1field.test(column)) {
                return new c1field(grid, column);
            }

            return null;
        });
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        var c1booleanfield = (function (_super) {
            __extends(c1booleanfield, _super);
            function c1booleanfield(wijgrid, options, widgetName) {
                _super.call(this, wijgrid, options, widgetName || c1booleanfield.WIDGET_NAME);
            }
            c1booleanfield.test = function (column) {
                return _grid.c1field.test(column) && (column.dataType === "boolean");
            };

            c1booleanfield.prototype._setupDataCell = function (container, formattedValue, row) {
                var grid = this._owner(), opt = this.options, defCSS = this._defCSS(), allowClickEditing = grid._allowCellEditing() && (opt.readOnly !== true), $input = $("<input class=\"" + defCSS.inputMarker + "\" type=\"checkbox\" />");

                if (!allowClickEditing) {
                    $input.prop("disabled", true);
                }

                if (grid.parse(opt, grid.mDataViewWrapper.getValue(row.data, opt.dataKey)) === true) {
                    $input.prop("checked", "checked");
                }

                container.empty().append($input);
            };

            c1booleanfield.prototype._cellRendered = function (cell, container, row) {
                var grid = this._owner(), allowClickEditing = grid._allowCellEditing() && (this.options.readOnly !== true);

                // similate single-click behaviour for checkboxes.
                // important: this code must support c1gridview.c1checkboxfield also!
                if (allowClickEditing) {
                    var keyCodeEnum = wijmo.getKeyCodeEnum();

                    container.children("input").bind("mousedown", function (e) {
                        var targetElement = container.parent()[0], currentCell = grid.currentCell();

                        if (currentCell.tableCell() !== targetElement) {
                            grid._onClick({ target: targetElement });
                        }
                        if (!currentCell._isEdit()) {
                            grid.beginEdit();
                        }
                    }).bind("keydown", function (e) {
                        if (e.which === keyCodeEnum.ENTER) {
                            grid._endEditInternal(e);
                            return false;
                        }
                    });
                }
            };
            c1booleanfield.WIDGET_NAME = "wijmo.c1booleanfield";
            return c1booleanfield;
        })(_grid.c1field);
        _grid.c1booleanfield = c1booleanfield;

        wijmo.grid.registerColumnFactory(function (grid, column) {
            if (c1booleanfield.test(column)) {
                return new c1booleanfield(grid, column);
            }

            return null;
        });
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="c1basefield.ts"/>
/// <reference path="interfaces.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        var c1bandfield = (function (_super) {
            __extends(c1bandfield, _super);
            function c1bandfield(wijgrid, options, emulatedWidgetName) {
                _super.call(this, wijgrid, options, emulatedWidgetName || c1bandfield.WIDGET_NAME);
            }
            /** @ignore */
            c1bandfield.test = function (column) {
                return !!(column && column.columns);
            };

            c1bandfield.prototype._provideDefaults = function () {
                _super.prototype._provideDefaults.call(this);

                wijmo.grid.shallowMerge(this.options, c1bandfield.prototype.options);

                this.options.dataKey = null;
            };
            c1bandfield.WIDGET_NAME = "wijmo.c1bandfield";
            return c1bandfield;
        })(_grid.c1basefield);
        _grid.c1bandfield = c1bandfield;

        var c1bandfield_options = (function (_super) {
            __extends(c1bandfield_options, _super);
            function c1bandfield_options() {
                _super.apply(this, arguments);
                /**
                * Gets a array of objects representing the band columns.
                * @example
                * $("#element").wijgrid({
                *   columns: [{
                *      headerText: "Band",
                *      columns: [
                *         { headerText: "ID" },
                *         { headerText: "Name" }
                *      ]
                *   }]
                * });
                */
                this.columns = [];
            }
            return c1bandfield_options;
        })(_grid.c1basefield_options);
        _grid.c1bandfield_options = c1bandfield_options;
        ;

        c1bandfield.prototype.options = wijmo.grid.extendWidgetOptions(_grid.c1basefield.prototype.options, new c1bandfield_options());

        wijmo.grid.registerColumnFactory(function (grid, column) {
            if (!!(column && column.columns)) {
                return new c1bandfield(grid, column);
            }

            return null;
        });
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="c1basefield.ts"/>
/// <reference path="interfaces.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var c1groupedfield = (function (_super) {
            __extends(c1groupedfield, _super);
            function c1groupedfield(wijgrid, options, element, widgetName) {
                _super.call(this, options, widgetName || c1groupedfield.WIDGET_NAME);
                this.mWijgrid = wijgrid;

                this._attachToElement(element);

                this._createContent();

                if (this.mWijgrid.options.allowColMoving) {
                    this.mWijgrid._UIDragndrop(true).attach(this);
                }
            }
            c1groupedfield.prototype._destroy = function () {
                if (this.mWijgrid._UIDragndrop()) {
                    this.mWijgrid._UIDragndrop(false).detach(this);
                }

                this.mWijgrid = null;

                _super.prototype._destroy.apply(this, arguments);
            };

            c1groupedfield.prototype._owner = function () {
                return this.mWijgrid;
            };

            c1groupedfield.prototype._createContent = function () {
                var defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this.mWijgrid.options.wijCSS, $closeButton = $("<span class=\"" + defCSS.groupAreaButtonClose + " " + wijCSS.wijgridGroupAreaButtonClose + " " + wijCSS.stateDefault + " " + wijCSS.cornerAll + "\"><span class=\"" + wijCSS.icon + " " + wijCSS.iconClose + "\"></span></span>").bind("click." + this.widgetName, this, this._onCloseClick);

                this.element.addClass(defCSS.groupAreaButton + " " + wijCSS.wijgridGroupAreaButton + " " + wijCSS.stateDefault + " " + wijCSS.cornerAll).html(this.options.headerText || "").prepend($closeButton);

                if (this._isSortableUI()) {
                    this.element.bind("click." + this.widgetName, this, $.proxy(this._onSortableElementClick, this));
                }

                if (this._isSortable()) {
                    // sorting icon
                    var generalSortClass = defCSS.groupAreaButtonSort + " " + wijCSS.wijgridGroupAreaButtonSort + " " + wijCSS.icon;

                    switch (this.options.sortDirection) {
                        case "ascending":
                            this.element.append($("<span class=\"" + generalSortClass + " " + wijCSS.iconArrowUp + "\"></span>"));
                            break;

                        case "descending":
                            this.element.append($("<span class=\"" + generalSortClass + " " + wijCSS.iconArrowDown + "\"></span>"));
                            break;
                    }
                }
            };

            c1groupedfield.prototype._onCloseClick = function (args) {
                var column = args.data;

                if (!column.options.disabled) {
                    column.mWijgrid._handleUngroup(column);
                }

                return false;
            };

            // taken from the wijgridfield
            c1groupedfield.prototype._onSortableElementClick = function (args) {
                var column = args.data;

                if (column.options.disabled) {
                    return false;
                }

                if (column.options.allowSort) {
                    column.mWijgrid._handleSort(column, args.ctrlKey); // dangerous casting
                }

                return false;
            };

            //#region UI actions
            c1groupedfield.prototype._canDrag = function () {
                return this.options.allowMoving === true;
            };

            c1groupedfield.prototype._canDropTo = function (column) {
                return (column instanceof c1groupedfield);
            };

            c1groupedfield.prototype._canDropToGroupArea = function () {
                // The rightmost column header in the the group area can't be dragged to the end of the group area again.
                return (this.options.groupedIndex !== this.mWijgrid._groupedLeaves().length - 1);
            };

            c1groupedfield.prototype._isSortable = function () {
                return wijmo.grid.c1field.test(this.options);
            };

            c1groupedfield.prototype._isSortableUI = function () {
                return this.mWijgrid.options.allowSorting && this.options.allowSort && this._isSortable();
            };
            c1groupedfield.WIDGET_NAME = "wijmo.c1groupedfield";
            return c1groupedfield;
        })(grid.widgetEmulator);
        grid.c1groupedfield = c1groupedfield;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="../../../Base/jquery.wijmo.widget.ts"/>
/// <reference path="interfaces.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        

        /** @ignore */
        var wijgridcommandbuttonbase = (function (_super) {
            __extends(wijgridcommandbuttonbase, _super);
            function wijgridcommandbuttonbase() {
                _super.apply(this, arguments);
            }
            wijgridcommandbuttonbase.prototype._create = function () {
                this.element.css("display", "inline").addClass(this.options.wijCSS.widget);
            };

            wijgridcommandbuttonbase.prototype._destroy = function () {
                this.mBtnElement = null;
            };

            wijgridcommandbuttonbase.prototype._init = function () {
                var _this = this;
                this.mBtnElement = this._createElement(this.options).addClass("wijmo-wijgrid-commandbutton").click(function (e) {
                    if (!_this.options.disabled && $.isFunction(_this.options.click)) {
                        _this.options.click.call(self, e);
                    }
                });

                this.element.append(this.mBtnElement);

                this._attachWidget(this.mBtnElement, this.options);
            };

            wijgridcommandbuttonbase.prototype._setOption = function (key, value) {
                var oldValue = this.options[key];

                _super.prototype._setOption.apply(this, [key, value]);

                if ((oldValue !== value) && (key === "disabled")) {
                    this._onDisabledChanged(value === true);
                }
            };

            wijgridcommandbuttonbase.prototype._createElement = function (settings) {
                throw "not implemented";
            };

            wijgridcommandbuttonbase.prototype._attachWidget = function (element, settings) {
                throw "not implemented";
            };

            wijgridcommandbuttonbase.prototype._btnElement = function () {
                return this.mBtnElement;
            };

            wijgridcommandbuttonbase.prototype._onDisabledChanged = function (value) {
            };
            return wijgridcommandbuttonbase;
        })(wijmo.wijmoWidget);
        grid.wijgridcommandbuttonbase = wijgridcommandbuttonbase;

        /** @ignore */
        var wijgridcommandbuttonbase_options = (function () {
            function wijgridcommandbuttonbase_options() {
                this.text = undefined;
                this.click = undefined;
                this.iconClass = undefined;
                this.disabled = false;
                this.textDataKey = undefined;
            }
            return wijgridcommandbuttonbase_options;
        })();
        grid.wijgridcommandbuttonbase_options = wijgridcommandbuttonbase_options;

        wijgridcommandbuttonbase.prototype.options = wijmo.grid.extendWidgetOptions(wijmo.wijmoWidget.prototype.options, new wijgridcommandbuttonbase_options());

        $.wijmo.registerWidget("wijgridcommandbuttonbase", wijgridcommandbuttonbase.prototype);

        /** @ignore */
        var wijgridcommandlink = (function (_super) {
            __extends(wijgridcommandlink, _super);
            function wijgridcommandlink() {
                _super.apply(this, arguments);
            }
            wijgridcommandlink.prototype._createElement = function (settings) {
                var anchor = $("<a href=\"#\" />").text(settings.text || "");

                if (settings.disabled) {
                    anchor.prop("disabled", "disabled");
                }

                return anchor;
            };

            wijgridcommandlink.prototype._attachWidget = function (element, settings) {
            };

            wijgridcommandlink.prototype._onDisabledChanged = function (value) {
                var btn = this._btnElement();

                if (btn) {
                    btn.prop("disabled", value);
                }
            };
            return wijgridcommandlink;
        })(wijgridcommandbuttonbase);
        grid.wijgridcommandlink = wijgridcommandlink;

        $.wijmo.registerWidget("wijgridcommandlink", $.wijmo.wijgridcommandbuttonbase, wijgridcommandlink.prototype);

        /** @ignore */
        var wijgridcommandbutton = (function (_super) {
            __extends(wijgridcommandbutton, _super);
            function wijgridcommandbutton() {
                _super.apply(this, arguments);
            }
            wijgridcommandbutton.prototype._createElement = function (settings) {
                return $("<input type=\"button\" />").val(settings.text);
            };

            wijgridcommandbutton.prototype._attachWidget = function (element, settings) {
                element.button({ disabled: settings.disabled });
            };

            wijgridcommandbutton.prototype._onDisabledChanged = function (value) {
                var btn = this._btnElement();

                if (btn) {
                    btn.button({ disabled: value });
                }
            };
            return wijgridcommandbutton;
        })(wijgridcommandbuttonbase);
        grid.wijgridcommandbutton = wijgridcommandbutton;

        $.wijmo.registerWidget("wijgridcommandbutton", $.wijmo.wijgridcommandbuttonbase, wijgridcommandbutton.prototype);

        /** @ignore */
        var wijgridcommandimagebutton = (function (_super) {
            __extends(wijgridcommandimagebutton, _super);
            function wijgridcommandimagebutton() {
                _super.apply(this, arguments);
            }
            wijgridcommandimagebutton.prototype._createElement = function (settings) {
                var button, hasText = !!settings.text;

                if (settings.mobile) {
                    button = $("<input type=\"button\" />");

                    if (hasText) {
                        button.val(settings.text);
                    }
                } else {
                    button = $("<button />");

                    if (hasText) {
                        button.text(settings.text);
                    } else {
                        button.html("&nbsp;");
                    }
                }

                return button;
            };

            wijgridcommandimagebutton.prototype._attachWidget = function (element, settings) {
                var hasText = !!settings.text, options = {
                    disabled: settings.disabled
                };

                if (settings.mobile) {
                    options.icon = settings.iconClass;

                    if (!hasText) {
                        options.iconpos = "notext";
                    }
                } else {
                    options.icons = {
                        primary: settings.iconClass
                    };

                    options.text = hasText;
                }

                element.button(options);
            };

            wijgridcommandimagebutton.prototype._onDisabledChanged = function (value) {
                var btn = this._btnElement();

                if (btn) {
                    btn.button({ disabled: value });
                }
            };
            return wijgridcommandimagebutton;
        })(wijgridcommandbuttonbase);
        grid.wijgridcommandimagebutton = wijgridcommandimagebutton;

        $.wijmo.registerWidget("wijgridcommandimagebutton", $.wijmo.wijgridcommandbuttonbase, wijgridcommandimagebutton.prototype);

        /** @ignore */
        var wijgridcommandimage = (function (_super) {
            __extends(wijgridcommandimage, _super);
            function wijgridcommandimage() {
                _super.apply(this, arguments);
            }
            wijgridcommandimage.prototype._createElement = function (settings) {
                var button;

                if (settings.mobile) {
                    button = $("<input type=\"button\" />");
                } else {
                    button = $("<button />").html("&nbsp;");
                }

                return button;
            };

            wijgridcommandimage.prototype._attachWidget = function (element, settings) {
                var options = {
                    disabled: settings.disabled
                };

                if (settings.mobile) {
                    options.icon = settings.iconClass;
                    options.iconpos = "notext";
                } else {
                    options.icons = {
                        primary: settings.iconClass
                    };
                    options.text = false;
                }

                element.button(options);
            };

            wijgridcommandimage.prototype._onDisabledChanged = function (value) {
                var btn = this._btnElement();

                if (btn) {
                    btn.button({ disabled: value });
                }
            };
            return wijgridcommandimage;
        })(wijgridcommandbuttonbase);
        grid.wijgridcommandimage = wijgridcommandimage;

        $.wijmo.registerWidget("wijgridcommandimage", $.wijmo.wijgridcommandbuttonbase, wijgridcommandimage.prototype);
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
/// <reference path="c1basefield.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        

        // An "abstract" class without a factory.
        var c1buttonbasefield = (function (_super) {
            __extends(c1buttonbasefield, _super);
            function c1buttonbasefield() {
                _super.apply(this, arguments);
            }
            c1buttonbasefield.test = function (options) {
                return !!(options && options.buttonType);
            };

            c1buttonbasefield.prototype._provideDefaults = function () {
                _super.prototype._provideDefaults.call(this);

                wijmo.grid.shallowMerge(this.options, c1buttonbasefield.prototype.options);

                this.options.dataKey = null;
            };

            c1buttonbasefield.prototype._createCommand = function (container, cmd, row, clickCallback) {
                var text = cmd.text;

                if (wijmo.grid.validDataKey(cmd.textDataKey) && row.data) {
                    var dataVal = row.data[cmd.textDataKey];
                    if ($.isFunction(dataVal)) {
                        dataVal = dataVal();
                    }

                    text = wijmo.grid.stringFormat(text, dataVal);
                }

                var btnOptions = $.extend({}, {
                    mobile: this._owner()._isMobileEnv(),
                    //text: cmd.text,
                    text: text,
                    iconClass: cmd.iconClass,
                    disabled: this._owner().options.disabled,
                    click: function (e) {
                        var processDefault = true;

                        if ($.isFunction(cmd.click)) {
                            var res = cmd.click.apply(this, [
                                e, {
                                    row: row,
                                    column: this.options
                                }]);

                            processDefault = (res !== false) && !e.isDefaultPrevented(); // let user to cancel the action
                        }

                        if (processDefault && clickCallback) {
                            clickCallback.apply(this, [e, { row: row }]);
                        }

                        e.preventDefault(); // prevent # beging added to url.
                    }
                });

                var btnContainer = $("<div />");
                container.append(btnContainer);

                switch (this.options.buttonType) {
                    case "link":
                        btnContainer.wijgridcommandlink(btnOptions);
                        break;

                    case "imageButton":
                        btnContainer.wijgridcommandimagebutton(btnOptions);
                        break;

                    case "button":
                        btnContainer.wijgridcommandbutton(btnOptions);
                        break;

                    case "image":
                        btnContainer.wijgridcommandimage(btnOptions);
                        break;

                    default:
                        throw "Unknown buttonType";
                }
            };
            return c1buttonbasefield;
        })(grid.c1basefield);
        grid.c1buttonbasefield = c1buttonbasefield;

        var c1buttonbasefield_options = (function (_super) {
            __extends(c1buttonbasefield_options, _super);
            function c1buttonbasefield_options() {
                _super.apply(this, arguments);
                /** Gets or sets the type of the button in the column. Possible values are "link", "button", "imageButton", "image".
                * @example
                * $("#element").wijgrid({ columns: [{ buttonType: "button" }]});
                */
                this.buttonType = "button";
            }
            return c1buttonbasefield_options;
        })(grid.c1basefield_options);
        grid.c1buttonbasefield_options = c1buttonbasefield_options;
        ;

        c1buttonbasefield.prototype.options = wijmo.grid.extendWidgetOptions(grid.c1basefield.prototype.options, new c1buttonbasefield_options());
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        var c1buttonfield = (function (_super) {
            __extends(c1buttonfield, _super);
            function c1buttonfield(wijgrid, options, widgetName) {
                _super.call(this, wijgrid, options, widgetName || c1buttonfield.WIDGET_NAME);
            }
            c1buttonfield.test = function (options) {
                return !!(_grid.c1buttonbasefield.test(options) || options.command);
            };

            c1buttonfield.prototype._provideDefaults = function () {
                _super.prototype._provideDefaults.call(this);

                wijmo.grid.shallowMerge(this.options, _grid.c1basefield.prototype.options);

                this.options.command = this.options.command || {};
                wijmo.grid.shallowMerge(this.options.command, c1buttonfield.prototype.options.command);
            };

            //#region rendering
            c1buttonfield.prototype._setupDataCell = function (container, formattedValue, row) {
                this._createCommand(container, this.options.command, row, null);
            };
            c1buttonfield.WIDGET_NAME = "wijmo.c1buttonfield";
            return c1buttonfield;
        })(_grid.c1buttonbasefield);
        _grid.c1buttonfield = c1buttonfield;

        var c1buttonfield_options = (function (_super) {
            __extends(c1buttonfield_options, _super);
            function c1buttonfield_options() {
                _super.apply(this, arguments);
                /** Represents options of a command button.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       buttonType: "link",
                *       command: {
                *          text: "myCommand",
                *          click: function (e, args) {
                *             alert("clicked!");
                *          }
                *       }
                *    }]
                * });
                */
                this.command = undefined;
            }
            return c1buttonfield_options;
        })(_grid.c1buttonbasefield_options);
        _grid.c1buttonfield_options = c1buttonfield_options;
        ;

        c1buttonfield.prototype.options = wijmo.grid.extendWidgetOptions(_grid.c1buttonbasefield.prototype.options, new c1buttonfield_options());

        wijmo.grid.registerColumnFactory(function (grid, column) {
            if (c1buttonfield.test(column)) {
                return new c1buttonfield(grid, column);
            }

            return null;
        });
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        var c1commandbuttonfield = (function (_super) {
            __extends(c1commandbuttonfield, _super);
            function c1commandbuttonfield(wijgrid, options, widgetName) {
                _super.call(this, wijgrid, options, widgetName || c1commandbuttonfield.WIDGET_NAME);
            }
            c1commandbuttonfield.test = function (options) {
                return !!((options.showDeleteButton && options.showDeleteButton !== false) || (options.showEditButton && options.showEditButton !== false) || options.cancelCommand || options.deleteCommand || options.editCommand || options.updateCommand);
            };

            c1commandbuttonfield.prototype._provideDefaults = function () {
                _super.prototype._provideDefaults.call(this);

                wijmo.grid.shallowMerge(this.options, c1commandbuttonfield.prototype.options);

                this.options.cancelCommand = this.options.cancelCommand || {};
                wijmo.grid.shallowMerge(this.options.cancelCommand, c1commandbuttonfield.prototype.options.cancelCommand);

                this.options.deleteCommand = this.options.deleteCommand || {};
                wijmo.grid.shallowMerge(this.options.deleteCommand, c1commandbuttonfield.prototype.options.deleteCommand);

                this.options.editCommand = this.options.editCommand || {};
                wijmo.grid.shallowMerge(this.options.editCommand, c1commandbuttonfield.prototype.options.editCommand);

                this.options.updateCommand = this.options.updateCommand || {};
                wijmo.grid.shallowMerge(this.options.updateCommand, c1commandbuttonfield.prototype.options.updateCommand);
            };

            //#region rendering
            c1commandbuttonfield.prototype._setupDataCell = function (container, formattedValue, row) {
                var opt = this.options, grid = this._owner();

                if (row.state & 16 /* editing */) {
                    if (opt.showEditButton) {
                        this._createCommand(container, opt.updateCommand, row, function (e, arg) {
                            grid.updateRow();
                        });

                        container.append(document.createTextNode("\u00A0"));

                        this._createCommand(container, opt.cancelCommand, row, function (e, arg) {
                            grid.cancelRowEditing();
                        });
                    }
                } else {
                    if (opt.showEditButton) {
                        this._createCommand(container, opt.editCommand, row, function (e, arg) {
                            grid.editRow(row.dataItemIndex);
                        });
                    }

                    if (opt.showDeleteButton) {
                        if (opt.showEditButton) {
                            container.append(document.createTextNode("\u00A0"));
                        }

                        this._createCommand(container, opt.deleteCommand, row, function (e, arg) {
                            grid.deleteRow(row.dataItemIndex);
                        });
                    }
                }

                container.addClass("wijmo-wijgrid-innercell-command");
            };
            c1commandbuttonfield.WIDGET_NAME = "wijmo.c1commandbuttonfield";
            return c1commandbuttonfield;
        })(_grid.c1buttonbasefield);
        _grid.c1commandbuttonfield = c1commandbuttonfield;

        var c1commandbuttonfield_options = (function (_super) {
            __extends(c1commandbuttonfield_options, _super);
            function c1commandbuttonfield_options() {
                _super.apply(this, arguments);
                /** Gets or sets a value indicating whether a Delete button is displayed in a command column.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       showDeleteButton: true
                *    }]
                * });
                */
                this.showDeleteButton = false;
                /** Gets or sets a value indicating whether an Edit button is displayed in a command column.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       showEditButton: true
                *    }]
                * });
                */
                this.showEditButton = false;
                /** Represents options of a Cancel command button.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       cancelCommand: {
                *          text: "Cancel!"
                *       }
                *    }]
                * });
                */
                this.cancelCommand = {
                    text: "Cancel",
                    iconClass: "ui-icon-close",
                    click: undefined,
                    textDataKey: undefined
                };
                /** Represents options of a Delete command button.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       deleteCommand: {
                *          text: "Delete!"
                *       }
                *    }]
                * });
                */
                this.deleteCommand = {
                    text: "Delete",
                    iconClass: "ui-icon-trash",
                    click: undefined,
                    textDataKey: undefined
                };
                /** Represents options of a Delete command button.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       deleteCommand: {
                *          text: "Edit!"
                *       }
                *    }]
                * });
                */
                this.editCommand = {
                    text: "Edit",
                    iconClass: "ui-icon-pencil",
                    click: undefined,
                    textDataKey: undefined
                };
                /** Represents options of a Delete command button.
                * @example
                * $("#element").wijgrid({
                *    columns: [{
                *       deleteCommand: {
                *          text: "Update!"
                *       }
                *    }]
                * });
                */
                this.updateCommand = {
                    text: "Update",
                    iconClass: "ui-icon-disk",
                    click: undefined,
                    textDataKey: undefined
                };
            }
            return c1commandbuttonfield_options;
        })(_grid.c1buttonbasefield_options);
        _grid.c1commandbuttonfield_options = c1commandbuttonfield_options;

        c1commandbuttonfield.prototype.options = wijmo.grid.extendWidgetOptions(_grid.c1buttonbasefield.prototype.options, new c1commandbuttonfield_options());

        wijmo.grid.registerColumnFactory(function (grid, column) {
            if (c1commandbuttonfield.test(column)) {
                return new c1commandbuttonfield(grid, column);
            }

            return null;
        });
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var bandProcessor = (function () {
            function bandProcessor() {
            }
            bandProcessor.prototype.generateSpanTable = function (root) {
                this._height = this._width = this._inc = this._shift = 0;
                this._table = [];
                this._traverseList = [];
                this._savedXPos = [];

                return this._generateSpanTable(root, true);
            };

            bandProcessor.prototype._generateSpanTable = function (root, parentVisibility) {
                this._height = this.getVisibleHeight(root, parentVisibility);

                this._traverseList = wijmo.grid.flatten(root);
                this._width = this._traverseList.length;

                for (var i = 0; i < this._height; i++) {
                    this._table[i] = [];

                    for (var j = 0; j < this._width; j++) {
                        this._table[i][j] = { column: null, colSpan: 0, rowSpan: 0 };
                    }
                }

                this._setTableValues(root, 0, 0);

                return this._table;
            };

            bandProcessor.prototype.getVisibleHeight = function (root, parentVisibility) {
                var i, len, colVis, tmp, result = 0;

                if ($.isArray(root)) {
                    for (i = 0, len = root.length; i < len; i++) {
                        tmp = this.getVisibleHeight(root[i], parentVisibility);
                        result = Math.max(result, tmp);
                    }
                } else {
                    colVis = (root.visible === undefined) ? true : root.visible;
                    root.parentVis = colVis && parentVisibility;

                    if ($.isArray(root.columns)) {
                        for (i = 0, len = root.columns.length; i < len; i++) {
                            tmp = this.getVisibleHeight(root.columns[i], root.parentVis);
                            result = Math.max(result, tmp);
                        }

                        if (!root.parentVis) {
                            return result;
                        }

                        root.isLeaf = (result === 0);
                        result++;
                    } else {
                        root.isLeaf = true;
                        if (root.parentVis) {
                            result = 1;
                        }
                    }
                }

                return result;
            };

            bandProcessor.prototype._getVisibleParent = function (column) {
                while (column) {
                    column = this._traverseList[column.parentIdx];
                    if (column && (column.parentVis || column.parentVis === undefined)) {
                        return column;
                    }
                }

                return null;
            };

            bandProcessor.prototype._setTableValues = function (root, y, x) {
                var i, len, tx, posX, parentIsLeaf, visibleParent;

                if ($.isArray(root)) {
                    for (i = 0, len = root.length; i < len; i++) {
                        this._setTableValues(root[i], y, x);
                    }
                } else {
                    if (root.travIdx === undefined) {
                        throw "undefined travIdx";
                    }

                    tx = x + this._shift;

                    if (root.parentVis) {
                        posX = tx + this._inc;
                        this._table[y][posX].column = root;
                        this._savedXPos[root.travIdx] = posX;
                    }

                    if ($.isArray(root.columns)) {
                        for (i = 0, len = root.columns.length; i < len; i++) {
                            this._setTableValues(root.columns[i], y + 1, x);
                        }
                    }

                    if (root.parentVis) {
                        if (this._shift - tx === 0) {
                            this._table[y][this._savedXPos[root.travIdx]].rowSpan = this._height - y;
                            this._shift++;
                        } else {
                            this._table[y][this._savedXPos[root.travIdx]].colSpan = this._shift - tx;
                        }
                    } else {
                        if (!($.isArray(root.columns)) && this._height > 0) {
                            visibleParent = this._getVisibleParent(root);

                            parentIsLeaf = (visibleParent) ? visibleParent.isLeaf : false;

                            if (parentIsLeaf) {
                                this._inc++;
                            }

                            if (y >= this._height) {
                                y = this._height - 1;
                            }

                            posX = x + this._shift + this._inc;

                            this._table[y][posX].column = root;

                            if (!parentIsLeaf) {
                                if (visibleParent && (this._savedXPos[visibleParent.travIdx] === posX)) {
                                    this._shiftTableElements(posX, y);
                                }

                                this._inc++;
                            }
                        }
                    }
                }
            };

            bandProcessor.prototype._shiftTableElements = function (x, untilY) {
                var i;

                for (i = 0; i < untilY; i++) {
                    this._table[i][x + 1] = this._table[i][x];
                    this._table[i][x] = { column: null, colSpan: 0, rowSpan: 0 };

                    if (this._table[i][x + 1].column) {
                        this._savedXPos[this._table[i][x + 1].column.travIdx]++;
                    }
                }
            };
            return bandProcessor;
        })();
        grid.bandProcessor = bandProcessor;

        /** @ignore */
        function flatten(columns) {
            var result = [];

            wijmo.grid.traverse(columns, function (column) {
                result.push(column);
            });

            return result;
        }
        grid.flatten = flatten;

        /** @ignore */
        function getTompostParent(column, allColumnsTraverseList) {
            if (!column || !allColumnsTraverseList || (column.options.parentIdx === -1)) {
                return null;
            }

            var parent = allColumnsTraverseList[column.options.parentIdx];

            if (parent.options.parentIdx === -1) {
                return parent;
            }

            return wijmo.grid.getTompostParent(parent, allColumnsTraverseList);
        }
        grid.getTompostParent = getTompostParent;

        /** @ignore */
        function isChildOf(allColumns, child, parent) {
            if ($.isArray(parent.options.columns) && child.options.parentIdx >= 0) {
                if (child.options.parentIdx === parent.options.travIdx) {
                    return true;
                }

                if (child.options.parentIdx > parent.options.travIdx) {
                    while (true) {
                        child = allColumns[child.options.parentIdx];

                        if (child.options.travIdx === parent.options.travIdx) {
                            return true;
                        }

                        if (child.options.parentIdx === -1) {
                            break;
                        }
                    }
                }
            }

            return false;
        }
        grid.isChildOf = isChildOf;

        /** @ignore */
        function setTraverseIndex(columns) {
            return _setTraverseIndex(columns, 0, -1);
        }
        grid.setTraverseIndex = setTraverseIndex;

        function _setTraverseIndex(columns, idx, parentIdx) {
            var i, len, column;

            if (columns) {
                for (i = 0, len = columns.length; i < len; i++) {
                    column = columns[i];

                    if (column.options) {
                        column = column.options;
                    }

                    column.linearIdx = i;
                    column.travIdx = idx++;
                    column.parentIdx = parentIdx;

                    if (column.columns) {
                        idx = _setTraverseIndex(column.columns, idx, idx - 1);
                    }
                }
            }

            return idx;
        }

        

        

        /** @ignore */
        function traverse(columns, callback) {
            var i, len, column;

            if (columns && ($.isFunction(callback))) {
                for (i = 0; i < columns.length; i++) {
                    column = columns[i];

                    if (column.options) {
                        column = column.options;
                    }

                    len = columns.length;

                    callback(column, columns);

                    if (columns.length !== len) {
                        i--;
                        continue;
                    }

                    if (column.columns) {
                        wijmo.grid.traverse(column.columns, callback);
                    }
                }
            }
        }
        grid.traverse = traverse;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
/// <reference path="filterOperators.ts"/>
/// <reference path="misc.ts"/>
var wijmo;
(function (wijmo) {
    /// <reference path="../../../data/src/dataView.ts"/>
    /// <reference path="../../../data/src/filtering.ts"/>
    (function (grid) {
        "use strict";

        var $ = jQuery;

        

        

        

        /** @ignore */
        var settingsManager = (function () {
            function settingsManager(wijgrid) {
                this._dvFilteringSettings = undefined;
                this._dvPagingSettings = undefined;
                this._dvSortingSettings = undefined;
                this._wgFilteringSettings = undefined;
                this._wgPagingSettings = undefined;
                this._wgSortingSettings = undefined;
                if (!wijgrid) {
                    throw "exception";
                }

                this._wijgrid = wijgrid;
                this._dataView = wijgrid.mDataViewWrapper.dataView();
                this._filterCache = new wijmo.grid.filterOperatorsCache(wijgrid);
            }
            settingsManager.prototype.compareSettings = function () {
                var result = true, a, b, i, len;

                // paging
                result = ((a = this.DVPagingSettings()) === (b = this.WGPagingSettings()));
                if (!result && a && b) {
                    result = (a.pageSize === b.pageSize && a.pageIndex === b.pageIndex);
                }

                // sorting
                if (result) {
                    result = ((a = this.DVSortingSettings()) === (b = this.WGSortingSettings()));
                    if (!result && a && b && ((len = a.length) === b.length)) {
                        result = true;
                        for (i = 0; i < len && result; i++) {
                            result = ((a[i].dataKey === b[i].dataKey) && (a[i].sortDirection === b[i].sortDirection));
                        }
                    }
                }

                // filtering
                if (result) {
                    a = this.DVFilteringSettings();
                    b = this.WGFilteringSettings();

                    result = wijmo.grid.compareObj(a, b);
                }

                return result;
            };

            settingsManager.prototype.DVFilteringSettings = function () {
                function traverse(filter, normalizedItem) {
                    var condition;

                    $.each(filter, function (i, item) {
                        if (typeof (item) === "string") {
                            condition = item;
                        } else {
                            if ($.isArray(item)) {
                                traverse(item, normalizedItem);
                            } else {
                                var filterDescr = item;

                                normalizedItem.filterValue.push(filterDescr.value);

                                normalizedItem.filterOperator.push({
                                    name: (filterDescr.customProps && filterDescr.customProps.originalOperator) || filterDescr.operator,
                                    condition: condition
                                });
                            }
                        }
                    });
                }

                if (this._dvFilteringSettings === undefined) {
                    var foo = [], filter = this._dataView.filter();

                    if (filter) {
                        $.each(filter, function (dataKey, item) {
                            var normalizedItem = {
                                dataKey: dataKey
                            };

                            if ($.isArray(item)) {
                                normalizedItem.filterValue = [];
                                normalizedItem.filterOperator = [];

                                traverse(item, normalizedItem);
                            } else if ($.isPlainObject(item)) {
                                var filterDescriptor = item;

                                normalizedItem.filterValue = filterDescriptor.value;
                                normalizedItem.filterOperator = (filterDescriptor.customProps && filterDescriptor.customProps.originalOperator) || item.operator || "Equals";

                                normalizedItem.customProps = filterDescriptor.customProps;
                            } else {
                                normalizedItem.filterValue = item;
                                normalizedItem.filterOperator = "Equals";
                            }

                            foo.push(normalizedItem);
                        });
                    }

                    this._dvFilteringSettings = (foo.length) ? foo : null;
                }

                return this._dvFilteringSettings;
            };

            settingsManager.prototype.DVPagingSettings = function () {
                if (this._dvPagingSettings === undefined) {
                    var pageableDataView = wijmo.grid.asPagedDataView(this._dataView);

                    if (pageableDataView) {
                        var pageSize = pageableDataView.pageSize();

                        this._dvPagingSettings = (pageSize > 0) ? {
                            pageSize: pageableDataView.pageSize(),
                            pageIndex: pageableDataView.pageIndex()
                        } : null;
                    }
                }

                return this._dvPagingSettings;
            };

            settingsManager.prototype.DVSortingSettings = function () {
                if (this._dvSortingSettings === undefined) {
                    var foo = [];

                    if (true) {
                        var sortDescription = wijmo.data.sorting.compile(this._dataView.sort()).normalized;

                        if (sortDescription) {
                            $.each(sortDescription, function (key, prop) {
                                if (prop !== null) {
                                    foo.push({
                                        dataKey: (typeof prop === "string") ? prop : prop.property,
                                        sortDirection: prop.asc || prop.asc === undefined ? "ascending" : "descending",
                                        sortOrder: undefined,
                                        customProps: prop.customProps
                                    });
                                }
                            });
                        }
                    }

                    this._dvSortingSettings = (foo.length) ? foo : null;
                }

                return this._dvSortingSettings;
            };

            settingsManager.prototype.WGFilteringSettings = function () {
                if (this._wgFilteringSettings === undefined) {
                    var foo = [], leaves = this._wijgrid._leaves(), self = this;

                    if (leaves) {
                        $.each(leaves, function (key, column) {
                            if (column instanceof grid.c1field) {
                                var opt = column.options;

                                var fvToVerify = wijmo.grid.deepExtend({}, { foo: opt.filterValue }).foo, fopToVerify = wijmo.grid.deepExtend({}, { foo: opt.filterOperator }).foo, verifiedFop = wijmo.grid.filterHelper.verify(fopToVerify, fvToVerify, opt.dataType, self._filterCache);

                                if (verifiedFop) {
                                    foo.push({
                                        owner: column,
                                        dataKey: opt.dataKey,
                                        filterValue: verifiedFop.filterValue,
                                        filterOperator: verifiedFop.filterOperator,
                                        customProps: {
                                            travIdx: opt.travIdx
                                        }
                                    });
                                }
                            }
                        });
                    }

                    this._wgFilteringSettings = (foo.length) ? foo : null;
                }

                return this._wgFilteringSettings;
            };

            settingsManager.prototype.WGPagingSettings = function () {
                if (this._wgPagingSettings === undefined) {
                    this._wgPagingSettings = this._wijgrid.options.allowPaging ? {
                        pageSize: this._wijgrid.options.pageSize,
                        pageIndex: this._wijgrid.options.pageIndex
                    } : null;
                }

                return this._wgPagingSettings;
            };

            settingsManager.prototype.WGSortingSettings = function () {
                if (this._wgSortingSettings === undefined) {
                    var sortDictionary = {}, sortArray = [], groupedColumns = this._wijgrid._groupedLeaves(true), leaves = this._wijgrid._leaves(), sortOrder = 0;

                    // fill the sortedDictionary with the grouped columns first
                    $.each(groupedColumns, function (i, column) {
                        if (column._isSortable()) {
                            var opt = column.options;

                            if (opt.sortDirection === "none") {
                                opt.sortDirection = "ascending"; // use "ascending" for grouped columns by default
                            }

                            sortDictionary[opt.dataKey] = {
                                dataKey: opt.dataKey,
                                sortDirection: opt.sortDirection,
                                sortOrder: sortOrder++,
                                customProps: {
                                    travIdx: opt.travIdx
                                }
                            };
                        }
                    });

                    sortOrder++;

                    // add other columns
                    $.each(leaves, function (i, column) {
                        if ((column instanceof grid.c1field) && column._isSortable()) {
                            var opt = column.options;

                            if (opt.sortDirection === "ascending" || opt.sortDirection === "descending") {
                                if (!sortDictionary[opt.dataKey]) {
                                    sortDictionary[opt.dataKey] = {
                                        dataKey: opt.dataKey,
                                        sortDirection: opt.sortDirection,
                                        sortOrder: (opt.sortOrder || 0) + sortOrder,
                                        customProps: {
                                            travIdx: opt.travIdx
                                        }
                                    };
                                }
                            }
                        }
                    });

                    // convert {} to []
                    $.each(sortDictionary, function (key, value) {
                        sortArray.push(value);
                    });

                    // sort by sortOrder
                    sortArray.sort(function (a, b) {
                        return a.sortOrder - b.sortOrder;
                    });

                    $.each(sortArray, function (i, item) {
                        delete item.sortOrder;
                    });

                    this._wgSortingSettings = (sortArray.length) ? sortArray : null;
                }

                return this._wgSortingSettings;
            };

            settingsManager.prototype.MapWGToDV = function () {
                var _this = this;
                var result = {}, foo, newDVFilterOption;

                // * paging *
                if (this._mapPagingParams() && (foo = this.WGPagingSettings())) {
                    result.pageIndex = foo.pageIndex;
                    result.pageSize = foo.pageSize;
                } else {
                    result.pageSize = -1; // cancel paging
                }

                // ** sorting
                if (this._mapSortingParams()) {
                    result.sort = []; // clear sorting

                    if (foo = this.WGSortingSettings()) {
                        result.sort = [];
                        $.each(foo, function (key, o) {
                            result.sort.push({
                                property: o.dataKey,
                                asc: o.sortDirection === "ascending",
                                customProps: o.customProps
                            });
                        });
                    }
                }

                // sorting **
                this._wijgrid.mDeficientFilters = {};

                // ** filtering
                if (this._mapFilteringParams()) {
                    // fill the deficientFilters
                    $.each(this._wijgrid._leaves(), function (key, column) {
                        if (column instanceof grid.c1field) {
                            var opt = column.options;

                            if ((opt.filterOperator === undefined) ^ (opt.filterValue === undefined)) {
                                _this._wijgrid.mDeficientFilters[opt.dataKey] = {
                                    filterOperator: opt.filterOperator,
                                    filterValue: opt.filterValue
                                };
                            }
                        }
                    });

                    result.filter = {};

                    // set filtering
                    if (foo = this.WGFilteringSettings()) {
                        result.filter = this._convertFilterToDV(foo);
                    }

                    if ($.isEmptyObject(result.filter)) {
                        result.filter = null; // must be null to clear filtering.
                    }
                }

                // filtering **
                return result;
            };

            settingsManager.prototype.MapDVToWG = function () {
                var foo, leavesByDataKey = {}, leavesByTravIdx = {}, mapSortingParams = this._mapSortingParams(), mapPagingParams = this._mapPagingParams(), mapFilteringParams = this._mapFilteringParams(), pagedDataView = wijmo.grid.asPagedDataView(this._dataView), self = this;

                $.each(this._wijgrid._leaves(), function (key, column) {
                    if (column instanceof grid.c1field) {
                        var opt = column.options;

                        // clear sorting
                        if (mapSortingParams) {
                            opt.sortOrder = 0;
                            opt.sortDirection = "none";
                        }

                        // clear filtering
                        if (mapFilteringParams) {
                            opt.filterOperator = "nofilter";
                            opt.filterValue = undefined;
                        }

                        leavesByDataKey[opt.dataKey] = column;

                        if (opt.travIdx >= 0) {
                            leavesByTravIdx[opt.travIdx] = column;
                        }
                    }
                });

                if (mapPagingParams && pagedDataView) {
                    this._wijgrid.options.pageSize = pagedDataView.pageSize();
                    this._wijgrid.options.pageIndex = pagedDataView.pageIndex();
                }

                if (mapSortingParams && (foo = this.DVSortingSettings())) {
                    $.each(foo, function (idx, o) {
                        var column;

                        if (o.customProps && (o.customProps.travIdx >= 0)) {
                            column = leavesByTravIdx[o.customProps.travIdx]; // to resolve issue when grid contains multiple columns with the same dataKey
                        }

                        if (!column || (column.options.dataKey !== o.dataKey)) {
                            column = leavesByDataKey[o.dataKey];
                        }

                        if (column) {
                            column.options.sortDirection = o.sortDirection;
                            column.options.sortOrder = idx; // restore sort order
                        }
                    });
                }

                if (mapFilteringParams) {
                    if (foo = this.DVFilteringSettings()) {
                        $.each(foo, function (key, o) {
                            var column;

                            if (o.customProps && (o.customProps.travIdx >= 0)) {
                                column = leavesByTravIdx[o.customProps.travIdx]; // to resolve issue when grid contains multiple columns with the same dataKey
                            }

                            if (!column || (column.options.dataKey !== o.dataKey)) {
                                column = leavesByDataKey[o.dataKey];
                            }

                            if (column) {
                                var opt = column.options;

                                opt.filterValue = o.filterValue;
                                opt.filterOperator = o.filterOperator;

                                if ($.isPlainObject(opt.filterOperator)) {
                                    opt.filterOperator = opt.filterOperator.name;
                                }

                                delete self._wijgrid.mDeficientFilters[opt.dataKey]; // unary operator?
                            }
                        });
                    }

                    $.each(this._wijgrid.mDeficientFilters, function (dataKey, defFilter) {
                        var field = leavesByDataKey[dataKey];
                        if (field) {
                            var opt = leavesByDataKey[dataKey].options;

                            opt.filterOperator = defFilter.filterOperator;
                            opt.filterValue = defFilter.filterValue;
                        }
                    });
                }
            };

            settingsManager.prototype._mapPagingParams = function () {
                return this._wijgrid.options.allowPaging && !this._wijgrid._customPagingEnabled() && !this._wijgrid._serverShaping();
            };

            settingsManager.prototype._mapSortingParams = function () {
                return !this._wijgrid._serverShaping();
            };

            settingsManager.prototype._mapFilteringParams = function () {
                return !this._wijgrid._serverShaping();
            };

            settingsManager.prototype._getDateValueRequirements = function (column) {
                var opt = column.options;

                return opt.inputType ? grid.TimeUnitConverter.convertInputType(opt.inputType) : grid.TimeUnitConverter.convertFormatString(opt.dataFormatString || "d");
            };

            settingsManager.prototype.makeProxyFilter = function (column, prop, name, value) {
                name = name.toLowerCase();

                var self = this, colOpt = column.options, isDateColumn = (colOpt.dataType === "datetime"), result = {
                    property: prop,
                    operator: name,
                    value: value,
                    customProps: {
                        travIdx: colOpt.travIdx
                    }
                };

                var internalOp = this._filterCache.getByNameInt(name);
                var builtinOp = wijmo.data.filtering.ops[name];

                if ((name !== "nofilter") && (internalOp.isCustom || isDateColumn)) {
                    result.customProps.originalOperator = result.operator;

                    if (internalOp.isCustom) {
                        result.operator = $.extend(true, {}, internalOp.op);
                        result.operator.apply = result.operator.operator;
                    } else {
                        result.operator = $.extend(true, {}, builtinOp);

                        var filterRequirements = this._getDateValueRequirements(column);

                        result.operator.apply = function (a, b) {
                            if (!(a instanceof Date)) {
                                a = self._wijgrid.parse(colOpt, a);
                            }

                            if (!(b instanceof Date)) {
                                b = self._wijgrid.parse(colOpt, b);
                            }

                            grid.TimeUnitConverter.cutDate(a, filterRequirements);
                            grid.TimeUnitConverter.cutDate(b, filterRequirements);

                            return builtinOp.apply(a, b);
                        };
                    }
                }

                return result;
            };

            // conversion from wijgrid format
            settingsManager.prototype._convertFilterToDV = function (normalizedFilter) {
                var result = {}, manager = this;

                $.each(normalizedFilter, function (i, group) {
                    var prop = group.dataKey, currConds = [], currConn = "and", conn, operators, values, conds;

                    if (!$.isPlainObject(group))
                        return;

                    operators = group.filterOperator;
                    values = group.filterValue;

                    if (operators == null)
                        return;

                    if (!$.isArray(operators)) {
                        operators = [operators];
                    }

                    if (!$.isArray(values)) {
                        values = [values];
                    }

                    if (operators.length != values.length)
                        throw "The number of filter operators must match the number of filter values";

                    if (operators.length == 0)
                        return;

                    $.each(operators, function (i, operator) {
                        var value;

                        if (typeof operator === "string") {
                            operator = {
                                name: operator
                            };
                        }

                        if (!$.isPlainObject(operator) || !operator.name)
                            throw "Invalid filter operator";
                        value = values[i];

                        if (!$.isArray(value)) {
                            value = [value];
                        }

                        conds = $.map(value, function (operand) {
                            if ((group.owner.options.dataType === "datetime") && (operand instanceof Date)) {
                                grid.TimeUnitConverter.cutDate(operand, manager._getDateValueRequirements(group.owner));
                            }

                            return manager.makeProxyFilter(group.owner, prop, operator.name, operand);
                        });

                        function adjustConds() {
                            if (conds.length > 1) {
                                conds.splice(0, 0, "or");
                            } else {
                                conds = conds[0];
                            }
                        }

                        function adjustCurrConds() {
                            if (currConn == null) {
                                currConn = conn;
                                currConds.splice(0, 0, conn);
                            }
                        }

                        currConn = null;
                        conn = operator.condition || "or";
                        if (currConds.length <= 1 || currConn == conn) {
                            if (conds.length == 1 || currConds.length <= 1 || currConn == "or") {
                                currConds = currConds.concat(conds);
                                adjustCurrConds();
                            } else {
                                adjustConds();
                                currConds.push(conds);
                                adjustCurrConds();
                            }
                        } else {
                            adjustConds();
                            currConds = [currConds, conds];
                            adjustCurrConds();
                        }
                    });

                    $.each(currConds, function (j, cond) {
                        if ($.isArray(cond) && cond.length == 2)
                            currConds[j] = cond[1];
                    });

                    if (currConds.length == 2 && typeof (currConds[0] === "string")) {
                        currConds.shift();
                    }

                    if (currConds.length == 1) {
                        currConds = currConds[0]; // unwrap single filter
                    }

                    result[prop] = currConds;
                }); // $.each(normalizedFilter)

                return result;
            };
            return settingsManager;
        })();
        grid.settingsManager = settingsManager;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="../../../data/src/dataView.ts"/>
/// <reference path="../data/dataViewAdapter.ts"/>
/// <reference path="../data/koDataView.ts"/>
var wijmo;
(function (wijmo) {
    /// <reference path="interfaces.ts"/>
    /// <reference path="misc.ts"/>
    /// <reference path="wijgrid.ts"/>
    /// <reference path="settingsManager.ts"/>
    /// <reference path="htmlTableAccessor.ts"/>
    /// <reference path="tally.ts"/>
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        

        /** @ignore */
        var dataViewWrapper = (function () {
            function dataViewWrapper(wijgrid) {
                this._domSource = null;
                this._ignoreAllEvents = false;
                this._ignoreChangeEvent = false;
                this._ignoreCurrentChangedEvent = false;
                this._userData = null;
                this._totals = null;
                //private _propChangeListener: propChangeListener;
                this._changeTimer = 0;
                this._toDispose = [];
                this._isOwnDataView = false;
                this._isWijdatasource = false;
                this._isKODataView = false;
                this._isDynamicWijdatasource = false;
                this._wijgrid = wijgrid;
                this._createDataViewWrapper(); // set _dataView
            }
            dataViewWrapper.getMetadata = function (dataItem) {
                var expando;

                if (dataItem && (expando = wijmo.data.Expando.getFrom(dataItem, false)) && (expando = expando[wijmo.grid.EXPANDO])) {
                    return expando || null;
                }

                return null;
            };

            dataViewWrapper.isDetailItem = function (dataItem, metaOut) {
                var meta = wijmo.grid.dataViewWrapper.getMetadata(dataItem), res = false;

                if (meta) {
                    var ra = meta.rowAttributes;
                    res = !!(ra && ra["class"] && (ra["class"].indexOf(_grid.wijgrid.CSS.detailRow) >= 0));
                }

                if (metaOut) {
                    metaOut.value = meta;
                }

                return res;
            };

            dataViewWrapper.prototype.data = function () {
                var dataView = this._getDataViewInst(), pagedDataView = wijmo.grid.asPagedDataView(dataView);

                return {
                    totalRows: pagedDataView != null ? pagedDataView.totalItemCount() : (dataView.getSource() || []).length,
                    totals: this._getTotals(),
                    emptyData: this.isBoundedToDOM() ? this._domSource.emptyData : null
                };
            };

            dataViewWrapper.prototype.dataView = function () {
                return this._getDataViewInst();
            };

            dataViewWrapper.prototype.dispose = function () {
                var dataView = this._getDataViewInst();

                //this._propChangeListener.dispose();
                $.each(this._toDispose, function (_, disposable) {
                    disposable.dispose();
                });

                if (dataView && this._isOwnDataView) {
                    dataView.dispose();
                }

                this._wijgrid.mWijDataView = null;
            };

            dataViewWrapper.prototype.ignoreChangeEvent = function (value) {
                if (arguments.length) {
                    this._ignoreChangeEvent = (value === true);
                } else {
                    return this._ignoreChangeEvent;
                }
            };

            dataViewWrapper.prototype.ignoreCurrentChangedEvent = function (value) {
                if (arguments.length) {
                    this._ignoreCurrentChangedEvent = (value === true);
                } else {
                    return this._ignoreCurrentChangedEvent;
                }
            };

            dataViewWrapper.prototype.isDataLoaded = function () {
                var dataView = this._getDataViewInst();
                return dataView.isLoaded();
            };

            dataViewWrapper.prototype.isOwnDataView = function () {
                return this._isOwnDataView;
            };

            dataViewWrapper.prototype.getFieldsInfo = function () {
                var dataView = this._getDataViewInst();

                return this._propDescriptorsToFieldsInfo(dataView.getProperties());
            };

            dataViewWrapper.prototype._propDescriptorsToFieldsInfo = function (propDescriptors) {
                var result = {};

                if (propDescriptors) {
                    $.each(propDescriptors, function (_, prop) {
                        if (prop.name === "$$hash" || prop.name === "$$hashKey") {
                            return;
                        }

                        result[prop.name] = {
                            name: prop.name,
                            type: prop.type || "string"
                        };
                    });
                }

                return result;
            };

            dataViewWrapper.prototype.isBoundedToDOM = function () {
                return this._domSource !== null;
            };

            dataViewWrapper.prototype.load = function (userData) {
                this._userData = userData;
                var dataView = this._getDataViewInst();

                if (!dataView) {
                    this._createDataViewWrapper();
                    dataView = this._getDataViewInst();
                }

                this._onDataViewLoading();

                var sm = new wijmo.grid.settingsManager(this._wijgrid);

                if ((userData && userData.forceDataLoad) || this._needToLoad(sm)) {
                    var loadParams = sm.MapWGToDV(), local = false;

                    if (this._isWijdatasource && !this._isDynamicWijdatasource && dataView.isLoaded()) {
                        local = true;
                    }

                    // ** ensure pageIndex
                    var pagedDataView = wijmo.grid.asPagedDataView(dataView), totalItems = -1;

                    // if paging is enabled and dataView provides totalItemCount then ensure that pageIndex is within[0; pageCount) range.
                    if (pagedDataView && (loadParams.pageSize >= 0) && ((totalItems = pagedDataView.totalItemCount()) >= 0)) {
                        // ** 47731: handle situation when underlying array was changed directly by user.
                        if (this._isOwnDataView && !this._isKODataView && !this._isDynamicWijdatasource && (pagedDataView.pageSize() > 0)) {
                            var source = pagedDataView.getSource();
                            if (source && (source.length < totalItems)) {
                                totalItems = source.length;
                            }
                        }

                        // 47731 **
                        var pageCount = Math.ceil(totalItems / loadParams.pageSize) || 1, pageIndex = loadParams.pageIndex;

                        if (pageIndex >= pageCount) {
                            pageIndex = Math.max(0, pageCount - 1);
                        }

                        loadParams.pageIndex = pageIndex;
                    }

                    // ensure pageIndex **
                    this.ignoreCurrentChangedEvent(true); // The currentPositionChanged event fires before the change event, stop listening. Listening will  be restored in the _onDataViewReset method.
                    dataView.refresh(loadParams, local);
                } else {
                    if (this.isDataLoaded()) {
                        this._onDataViewLoaded();
                        this._onDataViewReset(); // suppose that data is loaded, send notification to wijgrid.
                    }
                }
            };

            dataViewWrapper.prototype.currentPosition = function (rowIndex) {
                var dataView = this._getDataViewInst();

                if (!arguments.length) {
                    return dataView.currentPosition();
                }

                this.ignoreCurrentChangedEvent(true);

                try  {
                    dataView.currentPosition(rowIndex);
                } finally {
                    this.ignoreCurrentChangedEvent(false);
                }
            };

            dataViewWrapper.prototype.getValue = function (indexOrItem, key) {
                var dataView = this._getDataViewInst();

                if (typeof (key) === "number") {
                    key = key + "";
                }

                return dataView.getProperty(indexOrItem, key);
            };

            dataViewWrapper.prototype.setValue = function (indexOrItem, key, value) {
                var dataView = this._getDataViewInst();

                this.ignoreChangeEvent(true);

                try  {
                    if (typeof (key) === "number") {
                        key = key + "";
                    }

                    dataView.setProperty(indexOrItem, key, value);
                } finally {
                    this.ignoreChangeEvent(false);
                }
            };

            dataViewWrapper.prototype.makeDirty = function () {
                //this._propChangeListener.removeAll(); // remove old subscriptions
                this._totals = null;
            };

            dataViewWrapper.prototype._createDataViewWrapper = function () {
                var dataItemToGetProperties, data = this._wijgrid.options.data, dataView = this._getDataViewInst(), isWijdatasource = false;

                if (dataView) {
                    return;
                }

                if (!data) {
                    this._domSource = this._processDOM(this._wijgrid.element, this._wijgrid.options.readAttributesFromData);
                    data = this._domSource.items;
                }

                isWijdatasource = (typeof (wijdatasource) !== "undefined" && (data instanceof wijdatasource));
                this._isKODataView = data instanceof wijmo.grid.koDataView;
                this._isOwnDataView = ($.isArray(data) || isWijdatasource || this._isKODataView);
                this._isWijdatasource = !!(this._isOwnDataView && isWijdatasource);

                //this._isRemoteWijdatasource = !!(this._isOwnDataView && isWijdatasource && data.proxy);
                this._isDynamicWijdatasource = !!(this._isOwnDataView && isWijdatasource && data.dynamic);

                if (this._isOwnDataView && !this._isKODataView) {
                    if (!this._domSource && this._wijgrid.options.readAttributesFromData) {
                        this._moveAttributesToExpando(data);
                    }

                    var tBody = this.isBoundedToDOM() && wijmo.grid.getTableSection(this._wijgrid.element, 2 /* body */);

                    dataView = wijmo.grid.GridLocalDataDataView.create(wijmo.data.asDataView(this._parseOwnData(data, null, tBody)));
                } else {
                    // dataView = this._isKODataView ? data : wijmo.grid.GridDataView.create(data); // test for GridDataView instance (wijgridfilter)!
                    dataView = data;
                }

                this._wijgrid.mWijDataView = dataView;

                this._toDispose.push(dataView.isLoading.subscribe($.proxy(this._onDataViewLoadingInternal, this)));
                this._toDispose.push(dataView.isLoaded.subscribe($.proxy(this._onDataViewLoadedInternal, this)));
                this._toDispose.push(dataView.subscribe($.proxy(this._onDataViewChangeInternal, this)));
                this._toDispose.push(dataView.currentPosition.subscribe($.proxy(this._onDataViewCurrentChangedInternal, this)));
            };

            // if columns argument is null, then it will be autogenerated from the first data item
            dataViewWrapper.prototype._parseOwnData = function (data, columns, tbody) {
                if (data && data.length) {
                    var grid = this._wijgrid, dataLeaves = [];

                    if (!columns) {
                        columns = $.extend(true, [], this._wijgrid.options.columns);

                        var props = wijmo.data.ArrayDataViewBase._getProps(data[0]) || [], fieldsInfo = this._propDescriptorsToFieldsInfo(props);

                        grid._prepareColumns(columns, "merge", fieldsInfo, true, true, false);
                    }

                    wijmo.grid.traverse(columns, function (column) {
                        if (grid._needParseColumnDOM(column)) {
                            dataLeaves.push(column);
                        }
                    });

                    if (dataLeaves.length && tbody) {
                        $.each(data, function (i, dataItem) {
                            if (!wijmo.grid.dataViewWrapper.isDetailItem(dataItem)) {
                                wijmo.grid.dataViewWrapper._parseDataItem(grid, dataItem, (tbody && tbody.rows[i]), dataLeaves);
                            }
                        });
                    }
                }

                return data;
            };

            dataViewWrapper._parseDataItem = function (parseHandler, dataItem, domRow, leaves) {
                $.each(leaves, function (i, leaf) {
                    var value = dataItem[leaf.dataKey], newValue = parseHandler.parseCtx(leaf, value, dataItem, domRow.cells[leaf.dataKey]);

                    if (wijmo.grid.isNaN(newValue)) {
                        var domCell = null;

                        if (domRow) {
                            domCell = domRow.cells[leaf.dataKey];
                        }

                        newValue = parseHandler.parseCtxFailed(leaf, value, dataItem, domCell);
                    }

                    dataItem[leaf.dataKey] = newValue;
                });

                return dataItem;
            };

            dataViewWrapper.prototype._getDataViewInst = function () {
                return this._wijgrid.mWijDataView;
            };

            dataViewWrapper.prototype._needToLoad = function (settingsManager) {
                var dataView = this._getDataViewInst();

                if (this._isDynamicWijdatasource || (this._isWijdatasource && !dataView.isLoaded())) {
                    return true;
                }

                if (this._isOwnDataView && !this._isWijdatasource && this.isDataLoaded()) {
                    return true;
                }

                if (this.isDataLoaded() || dataView.isLoading()) {
                    return !settingsManager.compareSettings();
                }

                return true;
            };

            dataViewWrapper.prototype._validateSettings = function (settingsManager) {
                if (!this._isOwnDataView && this._wijgrid.options.allowPaging && ((settingsManager.DVPagingSettings() || {}).pageSize !== (settingsManager.WGPagingSettings() || {}).pageSize)) {
                    throw "The pageSize option of the external dataView can't be changed.";
                }
            };

            // ** dataView events handlers
            dataViewWrapper.prototype._onDataViewLoadingInternal = function (isLoading) {
                if (this._ignoreAllEvents) {
                    return;
                }

                if (isLoading) {
                    if (!this._userData) {
                        this._onDataViewLoading();
                    }
                }
            };

            dataViewWrapper.prototype._onDataViewLoadedInternal = function (isLoaded) {
                if (this._ignoreAllEvents) {
                    return;
                }

                if (isLoaded) {
                    this._onDataViewLoaded();
                }
            };

            dataViewWrapper.prototype._onDataViewChangeInternal = function (args) {
                var self = this;

                if (this._ignoreAllEvents || this._ignoreChangeEvent) {
                    return;
                }

                if (args.changes) {
                    if (args.length && args[0].entityState() === "detached") {
                        return;
                    }

                    $.each(args.changes, function (_, change) {
                        switch (change.changeType) {
                            case "remove":
                                break;

                            case "add":
                                break;
                        }
                    });
                }

                this._onDataViewChange.apply(this, arguments);
            };

            dataViewWrapper.prototype._onDataViewCurrentChangedInternal = function () {
                if (this._ignoreAllEvents || this._ignoreCurrentChangedEvent) {
                    return;
                }

                this._onDataViewCurrentChanged.apply(this, arguments);
            };

            // dataView events handlers **
            // ** event handlers
            dataViewWrapper.prototype._onDataViewReset = function () {
                try  {
                    this.ignoreCurrentChangedEvent(false); // restore listening (see the load() method).
                    this.makeDirty(); // force to recreate  the _totals and _sharedDataItems fields when the this.data() method will be called.
                    this._wijgrid._onDataViewReset(this._userData, this._isKODataView); // 47851: recreate columns each time if koDataView is used to handle situation when observable array value was changed completely: viewModel.property([]) -> viewModel.property([a, b, c]).
                } finally {
                    this._userData = null;
                }
            };

            dataViewWrapper.prototype._onPropertyChanged = function (newValue) {
                var self = this;

                if (this._changeTimer > 0) {
                    window.clearTimeout(this._changeTimer);
                    this._changeTimer = 0;
                }

                if (this._changeTimer != -1) {
                    this._changeTimer = window.setTimeout(function () {
                        self._changeTimer = -1;

                        if (!self._wijgrid.mDestroyed) {
                            self._onDataViewChange();
                        }

                        self._changeTimer = 0;
                    }, 100);
                }
            };

            // args can be empty
            dataViewWrapper.prototype._onDataViewChange = function (args) {
                this._onDataViewReset(); // force re-rendering. TODO: handle "add", "remove", "modify" etc.
            };

            dataViewWrapper.prototype._onDataViewCurrentChanged = function (e, args) {
                this._wijgrid._onDataViewCurrentPositionChanged(e, args);
            };

            dataViewWrapper.prototype._onDataViewLoading = function () {
                this._wijgrid._onDataViewLoading();
            };

            dataViewWrapper.prototype._onDataViewLoaded = function () {
                this._wijgrid._onDataViewLoaded();
            };

            // event handlers **
            dataViewWrapper.prototype._getTotals = function () {
                if (!this._totals) {
                    var dataView = this._getDataViewInst();
                    this._totals = this._prepareTotals(dataView, this._wijgrid._prepareTotalsRequest());
                }

                if (!this._totals) {
                    this._totals = {};
                }

                return this._totals;
            };

            dataViewWrapper.prototype._prepareTotals = function (dataView, request) {
                if (!request || request.length === 0) {
                    return {};
                }

                var tallies = [], result = {};

                for (var i = 0, len = request.length; i < len; i++) {
                    tallies.push(new wijmo.grid.tally(this._wijgrid));
                }

                for (var i = 0, len = dataView.count(); i < len; i++) {
                    for (var j = 0, len2 = tallies.length; j < len2; j++) {
                        var opt = request[j].options;

                        tallies[j].add(this._wijgrid.parse(opt, this.getValue(i, opt.dataKey)));
                    }
                }

                for (var i = 0, len = tallies.length; i < len; i++) {
                    var opt = request[i].options;
                    result[opt.dataKey] = tallies[i].getValue(request[i]);
                }

                return result;
            };

            // ** DOM
            dataViewWrapper.prototype._processDOM = function ($obj, readAttributes) {
                var result = {
                    items: [],
                    emptyData: [],
                    header: this._wijgrid._readTableSection($obj, 1 /* head */)
                };

                if (wijmo.grid.getTableSectionLength($obj, 2) === 1 && $(wijmo.grid.getTableSectionRow($obj, 2, 0)).hasClass(wijmo.grid.wijgrid.CSS.emptyDataRow)) {
                    result.emptyData = this._wijgrid._readTableSection($obj, 2 /* body */);
                } else {
                    result.items = this._wijgrid._readTableSection($obj, 2 /* body */, readAttributes);
                }

                return result;
            };

            // DOM **
            dataViewWrapper.prototype._moveAttributesToExpando = function (rawData) {
                $.each(rawData, function (i, item) {
                    var expando = wijmo.data.Expando.getFrom(item, true), rowMeta;

                    rowMeta = expando[wijmo.grid.EXPANDO] = { cellsAttributes: {}, rowAttributes: {} }; // store attributes within the original item using Expando

                    if (item.rowAttributes) {
                        rowMeta.rowAttributes = item.rowAttributes;
                        delete item.rowAttributes;
                    }
                    ;

                    $.each(item, function (dataKey, dataValue) {
                        if ($.isArray(dataValue)) {
                            rowMeta.cellsAttributes[dataKey] = dataValue[1];
                            item[dataKey] = dataValue[0];
                        }
                    });
                });
            };

            dataViewWrapper.prototype._wrapDataItem = function (dataItem, dataItemIndex) {
                return {
                    values: dataItem,
                    originalRowIndex: dataItemIndex
                };
            };

            // ** used by c1gridview to update underlying data during callbacks.
            dataViewWrapper.prototype._refreshSilent = function () {
                // used by c1gridview to refresh underlying data during callbacks.
                var dataView = this._getDataViewInst();

                if (dataView) {
                    try  {
                        this._ignoreAllEvents = true;
                        dataView.refresh();
                    } finally {
                        this._ignoreAllEvents = false;
                    }
                }
            };

            dataViewWrapper.prototype._unsafeReplace = function (index, newItem) {
                var dataView = this._getDataViewInst();

                if (!(dataView instanceof wijmo.grid.GridLocalDataDataView)) {
                    "operation is not supported";
                }

                dataView._unsafeReplace(index, newItem);
            };

            dataViewWrapper.prototype._unsafeSplice = function (index, count, item) {
                var dataView = this._getDataViewInst();

                if (!(dataView instanceof wijmo.grid.GridLocalDataDataView)) {
                    "operation is not supported";
                }

                if (arguments.length === 2) {
                    dataView._unsafeSplice(index, count);
                } else {
                    dataView._unsafeSplice(index, count, item);
                }
            };

            dataViewWrapper.prototype._unsafePush = function (item) {
                var dataView = this._getDataViewInst();

                if (!(dataView instanceof wijmo.grid.GridLocalDataDataView)) {
                    "operation is not supported";
                }

                dataView._unsafePush(item);
            };
            return dataViewWrapper;
        })();
        _grid.dataViewWrapper = dataViewWrapper;

        /** @ignore */
        function asPagedDataView(dataView) {
            return dataView && ("pageCount" in dataView) ? dataView : null;
        }
        _grid.asPagedDataView = asPagedDataView;

        /** @ignore */
        function asEditableDataView(dataView) {
            return dataView && ("commitEdit" in dataView) ? dataView : null;
        }
        _grid.asEditableDataView = asEditableDataView;

        /** @ignore */
        var propChangeListener = (function () {
            function propChangeListener(callback) {
                this._subscriptions = [];
                this._callback = callback;
            }
            propChangeListener.prototype.insert = function (index, dataViewItem) {
                var itemSubscrArray = null, self = this;

                $.each(dataViewItem, function (key, value) {
                    if (self._isValidPropName(key) && value && $.isFunction(value.subscribe)) {
                        itemSubscrArray = itemSubscrArray || [];
                        itemSubscrArray.push(value.subscribe(self._callback));
                    }
                });

                if (!itemSubscrArray) {
                    // we didn't subscribe in fact
                    return false;
                }

                if (this._subscriptions.length < index) {
                    // inflate the array before inserting
                    this._subscriptions.length = index;
                }
                this._subscriptions.splice(index, 0, itemSubscrArray);

                return true;
            };

            propChangeListener.prototype.remove = function (index) {
                var subscrArray = this._subscriptions[index];

                if (subscrArray) {
                    $.each(subscrArray, function (key, propSubscr) {
                        propSubscr.dispose();
                        subscrArray[key] = null;
                    });
                }

                this._subscriptions[index] = null;
                this._subscriptions.splice(index, 1);
            };

            propChangeListener.prototype.removeAll = function () {
                var len, subscr;

                while (len = this._subscriptions.length) {
                    this.remove(len - 1);
                }

                this._subscriptions = [];
            };

            propChangeListener.prototype.dispose = function () {
                this.removeAll();
            };

            propChangeListener.prototype._isValidPropName = function (name) {
                if (name && (typeof (name) === "string")) {
                    return name.match(/^entityState|jQuery/) === null;
                }

                return true;
            };
            return propChangeListener;
        })();
        _grid.propChangeListener = propChangeListener;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="../../../wijutil/jquery.wijmo.wijutil.ts" />
/// <reference path="interfaces.ts"/>
/// <reference path="merger.ts"/>
/// <reference path="wijgrid.ts"/>
/// <reference path="groupHelper.ts"/>
var wijmo;
(function (wijmo) {
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var groupRange = (function () {
            function groupRange(expanded, range, sum, position, hasHeaderOrFooter) {
                this.cr = new wijmo.grid.cellRange(-1, -1);
                this.isExpanded = false;
                this.position = "none";
                this._sum = -1;
                this._hasHeaderOrFooter = true;
                if (expanded !== undefined) {
                    this.isExpanded = expanded;
                }

                if (range !== undefined) {
                    this.cr = range;
                }

                if (sum !== undefined) {
                    this._sum = sum;
                }

                if (position !== undefined) {
                    this.position = position;
                }

                if (hasHeaderOrFooter !== undefined) {
                    this._hasHeaderOrFooter = hasHeaderOrFooter;
                }
            }
            groupRange.prototype.isSubRange = function (groupRange) {
                return ((this.cr.r1 >= groupRange.cr.r1) && (this.cr.r2 <= groupRange.cr.r2));
            };

            groupRange.prototype.toString = function () {
                return this.cr.r1 + "-" + this.cr.r2;
            };

            groupRange.prototype.collapse = function (grid, column) {
                var groupInfo = column.options.groupInfo, leaves = grid._leaves();

                if (wijmo.grid.groupHelper.isParentExpanded(leaves, this.cr, groupInfo.level)) {
                    if ((groupInfo.position !== "footer") && (groupInfo.outlineMode !== "none")) {
                        var groupedColumnsCnt = wijmo.grid.groupHelper.getGroupedColumnsCount(leaves);

                        this._collapse(grid, column, grid._rows(), leaves, this, groupedColumnsCnt, grid._allowVVirtualScrolling());
                    }
                }
            };

            groupRange.prototype.expand = function (grid, column, expandChildren) {
                var groupInfo = column.options.groupInfo, leaves = grid._leaves();

                if (wijmo.grid.groupHelper.isParentExpanded(leaves, this.cr, groupInfo.level)) {
                    var groupedColumnsCnt = wijmo.grid.groupHelper.getGroupedColumnsCount(leaves);

                    this._expand(grid, column, grid._rows(), leaves, this, groupedColumnsCnt, expandChildren, true, grid._allowVVirtualScrolling());
                }
            };

            // column - an owner of the groupRange
            groupRange.prototype._collapse = function (grid, column, rowAccessor, leaves, groupRange, groupedColumnsCnt, virtualScrollingEnabled) {
                var groupInfo = column.options.groupInfo, dataStart = groupRange.cr.r1, dataEnd = groupRange.cr.r2;

                switch (groupInfo.position) {
                    case "header":
                    case "headerAndFooter":
                        this._toggleSketchRowVisibility(grid.mSketchTable.row(groupRange.cr.r1), undefined, false);

                        if (!virtualScrollingEnabled) {
                            this._toggleRowVisibility(grid, rowAccessor.item(groupRange.cr.r1), undefined, false);
                        }

                        dataStart++;
                        break;
                }

                for (var i = dataStart; i <= dataEnd; i++) {
                    this._toggleSketchRowVisibility(grid.mSketchTable.row(i), false, undefined);

                    if (!virtualScrollingEnabled) {
                        this._toggleRowVisibility(grid, rowAccessor.item(i), false, undefined);
                    }
                }

                // update isExpanded property
                groupRange.isExpanded = false;

                for (var i = groupInfo.level + 1; i <= groupedColumnsCnt; i++) {
                    var childRangesInfo = wijmo.grid.groupHelper.getChildGroupRanges(leaves, groupRange.cr, i - 1);

                    if (childRangesInfo) {
                        var childRanges = childRangesInfo.ranges;

                        for (var j = 0, len = childRanges.length; j < len; j++) {
                            var childRange = childRanges[j];

                            childRange.isExpanded = false;

                            switch (childRangesInfo.column.options.groupInfo.position) {
                                case "header":
                                case "headerAndFooter":
                                    this._toggleSketchRowVisibility(grid.mSketchTable.row(childRange.cr.r1), false, false);

                                    if (!virtualScrollingEnabled) {
                                        this._toggleRowVisibility(grid, rowAccessor.item(childRange.cr.r1), false, false);
                                    }
                                    break;
                            }
                        }
                    }
                }
            };

            // column - an owner of the groupRange
            groupRange.prototype._expand = function (grid, column, rowAccessor, leaves, groupRange, groupedColumnsCnt, expandChildren, isRoot, virtualScrollingEnabled) {
                var groupInfo = column.options.groupInfo, dataStart = groupRange.cr.r1, dataEnd = groupRange.cr.r2;

                switch (groupInfo.position) {
                    case "header":
                        this._toggleSketchRowVisibility(grid.mSketchTable.row(dataStart), true, isRoot || expandChildren);

                        if (!virtualScrollingEnabled) {
                            this._toggleRowVisibility(grid, rowAccessor.item(dataStart), true, isRoot || expandChildren);
                        }

                        dataStart++;
                        break;

                    case "footer":
                        this._toggleSketchRowVisibility(grid.mSketchTable.row(dataEnd), true, undefined);

                        if (!virtualScrollingEnabled) {
                            this._toggleRowVisibility(grid, rowAccessor.item(dataEnd), true, undefined);
                        }

                        dataEnd--;
                        break;
                    case "headerAndFooter":
                        this._toggleSketchRowVisibility(grid.mSketchTable.row(dataStart), true, isRoot || expandChildren);

                        if (!virtualScrollingEnabled) {
                            this._toggleRowVisibility(grid, rowAccessor.item(dataStart), true, isRoot || expandChildren);
                        }

                        if (isRoot) {
                            this._toggleSketchRowVisibility(grid.mSketchTable.row(dataEnd), true, undefined);

                            if (!virtualScrollingEnabled) {
                                this._toggleRowVisibility(grid, rowAccessor.item(dataEnd), true, undefined);
                            }
                        }
                        dataStart++;
                        dataEnd--;
                        break;
                }

                if (isRoot) {
                    groupRange.isExpanded = true;
                } else {
                    return;
                }

                if (groupInfo.level === groupedColumnsCnt) {
                    for (var i = dataStart; i <= dataEnd; i++) {
                        this._toggleSketchRowVisibility(grid.mSketchTable.row(i), true, undefined);

                        if (!virtualScrollingEnabled) {
                            this._toggleRowVisibility(grid, rowAccessor.item(i), true, undefined);
                        }
                    }
                } else {
                    var childRangesInfo = wijmo.grid.groupHelper.getChildGroupRanges(leaves, groupRange.cr, groupInfo.level);

                    if (childRangesInfo) {
                        var childRanges = childRangesInfo.ranges, childColumn = childRangesInfo.column;

                        if (childRanges.length && (dataStart !== childRanges[0].cr.r1)) {
                            for (i = dataStart; i < childRanges[0].cr.r1; i++) {
                                this._toggleSketchRowVisibility(grid.mSketchTable.row(i), true, undefined);

                                if (!virtualScrollingEnabled) {
                                    this._toggleRowVisibility(grid, rowAccessor.item(i), true, undefined);
                                }
                            }
                        }

                        if (expandChildren) {
                            for (var i = 0, len = childRanges.length; i < len; i++) {
                                var childRange = childRanges[i];

                                this._expand(grid, childColumn, rowAccessor, leaves, childRange, groupedColumnsCnt, expandChildren, true, virtualScrollingEnabled);
                            }
                        } else {
                            for (var i = 0, len = childRanges.length; i < len; i++) {
                                var childRange = childRanges[i], childIsRoot = (childColumn.options.groupInfo.position === "footer" || childColumn.options.groupInfo.outlineMode === "none");

                                this._expand(grid, childColumn, rowAccessor, leaves, childRange, groupedColumnsCnt, false, childIsRoot, virtualScrollingEnabled);
                            }
                        }
                    }
                }
            };

            groupRange.prototype._toggleRowVisibility = function (grid, rowObj, visible, expanded) {
                if (rowObj) {
                    var rse = wijmo.grid.renderStateEx, view = grid._view(), rowInfo = view._getRowInfo(rowObj, false);

                    if (visible !== undefined) {
                        if (visible) {
                            rowInfo._extInfo.state &= ~1 /* hidden */;
                        } else {
                            rowInfo._extInfo.state |= 1 /* hidden */;
                        }
                    }

                    if (expanded !== undefined) {
                        if (expanded) {
                            rowInfo._extInfo.state &= ~2 /* collapsed */;
                        } else {
                            rowInfo._extInfo.state |= 2 /* collapsed */;
                        }
                    }

                    view._setRowInfo(rowInfo.$rows, rowInfo);

                    grid.mRowStyleFormatter._groupFormatter(rowInfo);
                }
            };

            groupRange.prototype._toggleSketchRowVisibility = function (sketchRow, visible, expanded) {
                if (sketchRow) {
                    var rse = wijmo.grid.renderStateEx;

                    if (visible !== undefined) {
                        if (visible) {
                            sketchRow.extInfo.state &= ~1 /* hidden */;
                        } else {
                            sketchRow.extInfo.state |= 1 /* hidden */;
                        }
                    }

                    if (expanded !== undefined) {
                        if (expanded) {
                            sketchRow.extInfo.state &= ~2 /* collapsed */;
                        } else {
                            sketchRow.extInfo.state |= 2 /* collapsed */;
                        }
                    }
                }
            };
            return groupRange;
        })();
        _grid.groupRange = groupRange;

        /** @ignore */
        var grouper = (function () {
            function grouper() {
                this.mGroupRowIdx = 0;
                this.mFirstVisbileLeafIndex = 0;
            }
            grouper.prototype.group = function (grid, data) {
                var _this = this;
                this.mGrid = grid;
                this.mLeaves = grid._leaves();
                this.mSketchTable = data;
                this.mGroupRowIdx = 0;

                var flag = false;

                $.each(this.mLeaves, function (i, column) {
                    var opt = column.options;

                    if (opt.groupInfo) {
                        delete opt.groupInfo.level;
                        delete opt.groupInfo.expandInfo;
                    }

                    // get index of the first visible leaf (excluding row header)
                    if (!flag && (flag = column._isFirstVisible())) {
                        _this.mFirstVisbileLeafIndex = i;
                    }
                });

                this._group();
            };

            grouper.prototype._group = function () {
                var _this = this;
                var groupedLeaves = this.mGrid._groupedLeaves(true), level = 1;

                if (groupedLeaves.length == 0) {
                    return;
                }

                // make sure all rows are created
                this.mSketchTable.ensureNotLazy();

                $.each(groupedLeaves, function (i, leaf) {
                    _this.mGroupRowIdx = 0;

                    if (_grid.c1field.isGroupedColumn(leaf)) {
                        var opt = leaf.options;

                        opt.groupInfo.level = level;
                        opt.groupInfo.expandInfo = [];

                        _this._processRowGroup(leaf, level++);
                    }
                });
            };

            grouper.prototype._processRowGroup = function (leaf, level) {
                var hasHeaderOrFooter = true, rse = wijmo.grid.renderStateEx;

                for (var rowIndex = 0; rowIndex < this.mSketchTable.count(); rowIndex++) {
                    var row = this.mSketchTable.row(rowIndex);

                    if (!row.isDataRow()) {
                        continue;
                    }

                    var cellRange = this._getGroupCellRange(rowIndex, leaf, level), isExpanded = true, startCollapsed = (leaf.options.groupInfo.outlineMode === "startCollapsed"), header, footer, groupRange, isParentCollapsed;

                    if (startCollapsed || wijmo.grid.groupHelper.isParentCollapsed(this.mLeaves, cellRange, level)) {
                        if ((leaf.options.groupInfo.groupSingleRow === false) && (cellRange.r1 === cellRange.r2)) {
                            continue;
                        }
                        isExpanded = false;
                    }

                    // indent
                    if (level && this.mGrid.options.groupIndent) {
                        for (var indentRow = cellRange.r1; indentRow <= cellRange.r2; indentRow++) {
                            this._addIndent(this.mSketchTable.row(indentRow).cell(this.mFirstVisbileLeafIndex), level);
                        }
                    }

                    hasHeaderOrFooter = !(leaf.options.groupInfo.groupSingleRow === false && (cellRange.r1 === cellRange.r2));

                    switch (leaf.options.groupInfo.position) {
                        case "header":
                            groupRange = this._addGroupRange(leaf.options.groupInfo, cellRange, isExpanded, hasHeaderOrFooter);

                            for (var i = cellRange.r1; i <= cellRange.r2; i++) {
                                row = this.mSketchTable.row(i);
                                row.extInfo.groupLevel = level + 1;
                                if (!isExpanded) {
                                    row.extInfo.state |= 1 /* hidden */;
                                }
                            }

                            if (!hasHeaderOrFooter) {
                                break;
                            }

                            this._updateByGroupRange(groupRange, level);

                            isParentCollapsed = wijmo.grid.groupHelper.isParentCollapsed(this.mLeaves, groupRange.cr, level);
                            header = this._buildGroupRow(leaf, groupRange, cellRange, true, isParentCollapsed);

                            this.mSketchTable.insert(cellRange.r1, header); // insert group header

                            header.extInfo.groupLevel = level;
                            if (!isExpanded) {
                                header.extInfo.state |= 2 /* collapsed */;
                            }
                            if (isParentCollapsed) {
                                header.extInfo.state |= 1 /* hidden */;
                            }

                            rowIndex = cellRange.r2 + 1;
                            break;

                        case "footer":
                            groupRange = this._addGroupRange(leaf.options.groupInfo, cellRange, true, hasHeaderOrFooter);

                            if (!hasHeaderOrFooter) {
                                break;
                            }

                            this._updateByGroupRange(groupRange, level);

                            footer = this._buildGroupRow(leaf, groupRange, cellRange, false, false);
                            footer.extInfo.groupLevel = level;

                            this.mSketchTable.insert(cellRange.r2 + 1, footer);
                            rowIndex = cellRange.r2 + 1;

                            isParentCollapsed = wijmo.grid.groupHelper.isParentCollapsed(this.mLeaves, groupRange.cr, level);
                            if (isParentCollapsed) {
                                footer.extInfo.state |= 1 /* hidden */;
                            }

                            break;

                        case "headerAndFooter":
                            groupRange = this._addGroupRange(leaf.options.groupInfo, cellRange, isExpanded, hasHeaderOrFooter);

                            for (i = cellRange.r1; i <= cellRange.r2; i++) {
                                row = this.mSketchTable.row(i);
                                row.extInfo.groupLevel = level + 1;
                                if (!isExpanded) {
                                    row.extInfo.state |= 1 /* hidden */;
                                }
                            }

                            if (!hasHeaderOrFooter) {
                                break;
                            }

                            this._updateByGroupRange(groupRange, level);

                            isParentCollapsed = wijmo.grid.groupHelper.isParentCollapsed(this.mLeaves, groupRange.cr, level);
                            header = this._buildGroupRow(leaf, groupRange, cellRange, true, isParentCollapsed);
                            footer = this._buildGroupRow(leaf, groupRange, cellRange, false, false);

                            this.mSketchTable.insert(cellRange.r2 + 1, footer);
                            footer.extInfo.groupLevel = level;
                            if (isParentCollapsed || !isExpanded) {
                                footer.extInfo.state |= 1 /* hidden */;
                            }

                            this.mSketchTable.insert(cellRange.r1, header);
                            header.extInfo.groupLevel = level;
                            if (!isExpanded) {
                                header.extInfo.state |= 2 /* collapsed */;
                            }
                            if (isParentCollapsed) {
                                header.extInfo.state |= 1 /* hidden */;
                            }

                            rowIndex = cellRange.r2 + 2;
                            break;

                        default:
                            throw wijmo.grid.stringFormat("Unknown Position value: \"{0}\"", leaf.options.groupInfo.position);
                    }

                    this.mGroupRowIdx++;
                }
            };

            grouper.prototype._buildGroupRow = function (column, groupRange, cellRange, isHeader, isParentCollapsed) {
                //when some column is hidden, the group row is not correct.
                var colOpt = column.options, groupInfo = colOpt.groupInfo, sketchRow = new _grid.SketchGroupRow(isHeader, null), groupByValue = undefined, groupByText = "", aggregate = "", defCSS = wijmo.grid.wijgrid.CSS;

                sketchRow.extInfo.groupIndex = this.mGroupRowIdx; // to make a row ID.

                if ((groupByValue = this.mSketchTable.valueAt(cellRange.r1, colOpt.leavesIdx)) !== null) {
                    if (this.mGrid.options.readAttributesFromData) {
                        // Avoid sutuation when grouped cell contains inplace editors (C1GridView, #64745)
                        var attrValue = this.mSketchTable.wijgridDataAttrValueAt(cellRange.r1, colOpt.leavesIdx);
                        if (attrValue) {
                            groupByValue = this.mGrid.parse(colOpt, attrValue);
                        }
                    }

                    groupByText = this.mGrid.toStr(colOpt, groupByValue);
                }

                sketchRow.groupByValue = groupByValue;

                if (this.mGrid._showRowHeader()) {
                    sketchRow.add(_grid.HtmlCell.nbsp());
                }

                // create the summary cell
                var cell = new _grid.HtmlCell("", null);

                sketchRow.add(cell);

                // add group header text
                if (colOpt.aggregate && (colOpt.aggregate !== "none")) {
                    aggregate = this._getAggregate(cellRange, column, column, isHeader, groupByText);
                }

                var caption = (isHeader) ? groupInfo.headerText : groupInfo.footerText;

                // format caption
                // The text may include up to three placeholders:
                // "{0}" is replaced with the value being grouped on and
                // "{1}" is replaced with the group's column header
                // "{2}" is replaced with the aggregate
                if (caption === "custom") {
                    var args = {
                        data: this.mSketchTable.getRawTable(),
                        column: colOpt,
                        groupByColumn: colOpt,
                        groupText: groupByText,
                        text: "",
                        groupingStart: cellRange.r1,
                        groupingEnd: cellRange.r2,
                        isGroupHeader: isHeader,
                        aggregate: aggregate
                    };

                    if (this.mGrid._trigger("groupText", null, args)) {
                        caption = args.text;
                    }
                } else {
                    if ((caption === undefined) || (caption === null)) {
                        if (isHeader) {
                            caption = "{1}: {0}";
                        }

                        if (aggregate || (aggregate === 0)) {
                            caption = caption ? caption + " {2}" : "{2}";
                        }
                    }

                    caption = wijmo.grid.stringFormat(caption, colOpt.encodeHtml ? wijmo.htmlEncode(groupByText) : groupByText, colOpt.headerText ? colOpt.headerText : "", this._wrapAggregateValue(aggregate));
                }

                if (!caption) {
                    caption = "&nbsp;";
                }

                cell.html += "<span>" + caption + "</span>";
                this._addIndent(cell, groupInfo.level - 1);

                // summary cells span until the end of the row or the first aggregate
                var span = 1, col = this.mGrid._virtualLeaves().length, bFirst = true;

                for (; col < this.mLeaves.length; col++) {
                    var tmp = this.mLeaves[col].options;

                    if (tmp.parentVis) {
                        if (bFirst) {
                            bFirst = false;
                            continue;
                        }
                        if ((tmp.dynamic !== true) && tmp.aggregate && (tmp.aggregate !== "none")) {
                            break;
                        }

                        span++;
                    }
                }

                for (; col < this.mLeaves.length; col++) {
                    var tmp2 = this.mLeaves[col], agg = "";

                    if (tmp2.options.parentVis) {
                        if (tmp2 instanceof _grid.c1field) {
                            agg = this._getAggregate(cellRange, tmp2, column, isHeader, groupByText);
                        }

                        agg = agg || "&nbsp;";

                        sketchRow.add(new _grid.HtmlCell(this._wrapAggregateValue(agg), {
                            groupInfo: {
                                leafIndex: tmp2.options.leavesIdx,
                                purpose: 1 /* aggregateCell */
                            }
                        }));
                    }
                }

                cell.ensureAttr().colSpan = span;
                cell.ensureAttr().groupInfo = { leafIndex: colOpt.leavesIdx, purpose: 0 /* groupCell */ }; // will be passed into the cellStyleFormatter

                return sketchRow;
            };

            grouper.prototype._getAggregate = function (cellRange, column, groupByColumn, isGroupHeader, groupByText) {
                var result = "";

                if (!column.options.aggregate || (column.options.aggregate === "none")) {
                    return result;
                }

                if (column.options.aggregate === "custom") {
                    var args = {
                        data: this.mSketchTable.getRawTable(),
                        column: column.options,
                        groupByColumn: groupByColumn.options,
                        groupText: groupByText,
                        text: "",
                        groupingStart: cellRange.r1,
                        groupingEnd: cellRange.r2,
                        isGroupHeader: isGroupHeader
                    };

                    var tmp = column.options.dataIndex;
                    try  {
                        column.options.dataIndex = column.options.leavesIdx; // workaround: change dataIndex since the sketchRow (args.data[i]) contains both bound and unbound cells.

                        if (this.mGrid._trigger("groupAggregate", null, args)) {
                            result = args.text;
                        }
                    } finally {
                        column.options.dataIndex = tmp; // restore
                    }
                } else {
                    var tally = new wijmo.grid.tally(this.mGrid);

                    for (var row = cellRange.r1; row <= cellRange.r2; row++) {
                        tally.add(this.mSketchTable.valueAt(row, column.options.leavesIdx));
                    }

                    result = tally.getValueString(column, this.mGrid);
                }

                return result;
            };

            grouper.prototype._getGroupCellRange = function (rowIndex, leaf, level) {
                var idx = leaf.options.leavesIdx, row, range = new wijmo.grid.cellRange(rowIndex, idx), parentRange = wijmo.grid.groupHelper.getParentGroupRange(this.mLeaves, range, level), value, nextValue, count;

                row = this.mSketchTable.row(rowIndex);
                if (row.isDataRow()) {
                    value = row.valueCell(leaf.options.leavesIdx).value;

                    if (value instanceof Date) {
                        value = value.getTime();
                    }

                    for (range.r2 = rowIndex, count = this.mSketchTable.count() - 1; range.r2 < count; range.r2++) {
                        if (!this.mSketchTable.row(range.r2 + 1).isDataRow() || (parentRange && (range.r2 + 1 > parentRange.cr.r2))) {
                            break;
                        }

                        nextValue = this.mSketchTable.valueAt(range.r2 + 1, leaf.options.leavesIdx);

                        if (nextValue instanceof Date) {
                            nextValue = nextValue.getTime();
                        }

                        if (value !== nextValue) {
                            break;
                        }
                    }
                }

                return range;
            };

            grouper.prototype._addGroupRange = function (groupInfo, cellRange, isExpanded, hasHeaderOrFooter) {
                var result = null, idx = wijmo.grid.groupHelper.getChildGroupIndex(cellRange, groupInfo.expandInfo), range, expandState, r1, r2;

                if (idx >= 0 && idx < groupInfo.expandInfo.length) {
                    result = groupInfo.expandInfo[idx];
                } else {
                    range = new wijmo.grid.cellRange(cellRange.r1, cellRange.r1, cellRange.r2, cellRange.r2); // clone
                    expandState = (groupInfo.position === "footer" || !hasHeaderOrFooter) ? true : isExpanded && (groupInfo.outlineMode !== "startCollapsed");

                    result = new wijmo.grid.groupRange(expandState, range, -1, groupInfo.position, hasHeaderOrFooter);

                    groupInfo.expandInfo.push(result);
                }

                if (result && hasHeaderOrFooter) {
                    r1 = cellRange.r1;
                    r2 = cellRange.r2;

                    if (groupInfo.position === "headerAndFooter") {
                        r2 += 2;
                    }

                    if (groupInfo.position !== "headerAndFooter") {
                        r2++;
                    }

                    result.cr.r2 = r2;
                }

                return result;
            };

            grouper.prototype._updateByGroupRange = function (groupRange, level) {
                for (var i = 0, len = this.mLeaves.length; i < len; i++) {
                    var groupInfo = this.mLeaves[i].options.groupInfo;

                    if (groupInfo && (groupInfo.level < level)) {
                        var len2 = (groupInfo.expandInfo) ? groupInfo.expandInfo.length : 0;

                        for (var j = 0; j < len2; j++) {
                            var cur = groupInfo.expandInfo[j];
                            var delta = (groupRange.position === "headerAndFooter") ? 2 : 1;

                            if (cur.cr.r1 >= groupRange.cr.r1 && !((cur.cr.r1 === groupRange.cr.r1) && (cur.position === "footer"))) {
                                cur.cr.r1 += delta;
                            }

                            if (cur.cr.r2 >= groupRange.cr.r1) {
                                cur.cr.r2 += delta;
                            }
                        }
                    }
                }
            };

            grouper.prototype._addIndent = function (cellObj, level) {
                var indent;

                if (level > 0 && (indent = this.mGrid.options.groupIndent)) {
                    cellObj.ensureStyle().paddingLeft = (indent * level) + "px";
                }
            };

            grouper.prototype._wrapAggregateValue = function (value) {
                return "<span class='" + wijmo.grid.wijgrid.CSS.aggregateContainer + "'>" + value.toString() + "</span>";
                //return value.toString();
            };
            return grouper;
        })();
        _grid.grouper = grouper;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
/// <reference path="merger.ts"/>
/// <reference path="grouper.ts"/>
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var groupHelper = (function () {
            function groupHelper() {
            }
            groupHelper.getGroupInfo = function (row) {
                if (row) {
                    var info = wijmo.grid.groupHelper._getGroupInfoRegExp.exec(row.id), level, index, isHeader;

                    if (info) {
                        level = parseInt(info[3], 10);
                        index = parseInt(info[2], 10);
                        isHeader = (info[1] === "H");

                        return {
                            level: level,
                            index: index,
                            isHeader: isHeader,
                            toString: function () {
                                return (isHeader ? "GH" : "GF") + index + "-" + level;
                            }
                        };
                    }
                }

                return null;
            };

            groupHelper.getColumnByGroupLevel = function (leaves, level) {
                for (var i = 0, len = leaves.length; i < len; i++) {
                    var leaf = leaves[i], opt = leaves[i].options;

                    if (opt.groupInfo && (opt.groupInfo.level === level)) {
                        return leaf;
                    }
                }

                return null;
            };

            groupHelper.getGroupedColumnsCount = function (leaves) {
                var result = 0;

                for (var i = 0, len = leaves.length; i < len; i++) {
                    var groupInfo = leaves[i].options.groupInfo;

                    if (groupInfo && (groupInfo.position === "header" || groupInfo.position === "headerAndFooter" || groupInfo.position === "footer")) {
                        result++;
                    }
                }

                return result;
            };

            // cellRange cellRange
            // groupRange[] childExpandInfo
            groupHelper.getChildGroupIndex = function (cellRange, childExpandInfo) {
                var left = 0, right = childExpandInfo.length - 1, median, cmp;

                while (left <= right) {
                    median = ((right - left) >> 1) + left;
                    cmp = childExpandInfo[median].cr.r1 - cellRange.r1;

                    if (cmp === 0) {
                        return median;
                    }

                    if (cmp < 0) {
                        left = median + 1;
                    } else {
                        right = median - 1;
                    }
                }

                return left;
                //return ~left;
            };

            groupHelper.getParentGroupIndex = function (cellRange, parentExpandInfo) {
                var idx = wijmo.grid.groupHelper.getChildGroupIndex(cellRange, parentExpandInfo);

                if (idx > 0) {
                    idx--;
                }

                //return (idx < parentExpandInfo.length)
                //	? idx
                //	: -1;
                if (idx < parentExpandInfo.length) {
                    var groupRange = parentExpandInfo[idx];
                    if ((cellRange.r1 >= groupRange.cr.r1) && (cellRange.r2 <= groupRange.cr.r2)) {
                        return idx;
                    }
                }

                return -1;
            };

            // level: 1-based level of the cellRange;
            groupHelper.getChildGroupRanges = function (leaves, cellRange, level) {
                var result = [], childGroupedColumn = wijmo.grid.groupHelper.getColumnByGroupLevel(leaves, level + 1);

                if (childGroupedColumn) {
                    var childRanges = childGroupedColumn.options.groupInfo.expandInfo, firstChildIdx = wijmo.grid.groupHelper.getChildGroupIndex(cellRange, childRanges);

                    for (var i = firstChildIdx, len = childRanges.length; i < len; i++) {
                        var childRange = childRanges[i];

                        if (childRange.cr.r2 <= cellRange.r2) {
                            result.push(childRange);
                        } else {
                            break;
                        }
                    }

                    return {
                        column: childGroupedColumn,
                        ranges: result
                    };
                }

                return null;
            };

            // level: 1-based level of the cellRange; optional.
            groupHelper.getParentGroupRange = function (leaves, cellRange, level) {
                if (level === undefined) {
                    level = 0xFFFF;
                }

                if (cellRange && (level - 2 >= 0)) {
                    for (var i = leaves.length - 1; i >= 0; i--) {
                        var groupInfo = leaves[i].options.groupInfo;

                        if (!groupInfo || !groupInfo.expandInfo || (groupInfo.level < 0) || (groupInfo.level !== level - 1)) {
                            continue;
                        }

                        var idx = wijmo.grid.groupHelper.getParentGroupIndex(cellRange, groupInfo.expandInfo);
                        if (idx >= 0) {
                            return groupInfo.expandInfo[idx];
                        }
                    }
                }

                return null;
            };

            // level: 1-based level of the cellRange.
            groupHelper.isParentCollapsed = function (leaves, cellRange, level) {
                if (level === 1) {
                    return false;
                }

                for (var i = level; i > 1; i--) {
                    var parentGroupRange = wijmo.grid.groupHelper.getParentGroupRange(leaves, cellRange, i);

                    if (!parentGroupRange) {
                        return false;
                    }

                    if (!parentGroupRange.isExpanded) {
                        return true;
                    }

                    cellRange = parentGroupRange.cr;
                }

                return false;
            };

            // level: 1-based level of the cellRange.
            groupHelper.isParentExpanded = function (leaves, cellRange, level) {
                if (level === 1) {
                    return true;
                }

                for (var i = level; i > 1; i--) {
                    var parentGroupRange = wijmo.grid.groupHelper.getParentGroupRange(leaves, cellRange, i);

                    if (!parentGroupRange || (parentGroupRange && parentGroupRange.isExpanded)) {
                        return true;
                    }

                    cellRange = parentGroupRange.cr;
                }

                return false;
            };
            groupHelper._getGroupInfoRegExp = new RegExp(".*G([HF]){1}(\\d+)-(\\d+)$");
            return groupHelper;
        })();
        grid.groupHelper = groupHelper;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
var wijmo;
(function (wijmo) {
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var cellRange = (function () {
            function cellRange(row1, col1, row2, col2) {
                switch (arguments.length) {
                    case 2:
                        this.r1 = this.r2 = row1;
                        this.c1 = this.c2 = col1;
                        break;
                    case 4:
                        this.r1 = row1;
                        this.r2 = row2;
                        this.c1 = col1;
                        this.c2 = col2;
                        break;
                    default:
                        this.r1 = 0;
                        this.r2 = 0;
                        this.c1 = 0;
                        this.c2 = 0;
                }
            }
            cellRange.prototype.isSingleCell = function () {
                return ((this.r1 === this.r2) && (this.c1 === this.c2));
            };
            return cellRange;
        })();
        _grid.cellRange = cellRange;

        /** @ignore */
        var merger = (function () {
            function merger() {
            }
            merger.prototype.merge = function (grid, data) {
                this._leaves = grid._visibleLeaves();
                this._data = data;

                this._merge();
            };

            merger.prototype._merge = function () {
                var firstLeaf = true;

                for (var i = 0, len = this._leaves.length; i < len; i++) {
                    if (this._leaves[i] instanceof _grid.c1field) {
                        var leaf = this._leaves[i];

                        if (leaf.options.rowMerge === "free" || leaf.options.rowMerge === "restricted") {
                            if (firstLeaf) {
                                this._data.ensureNotLazy();
                                firstLeaf = false;
                            }
                            this._mergeColumn(leaf);
                        }
                    }
                }
            };

            merger.prototype._mergeColumn = function (column) {
                var cellIdx = column.options.leavesIdx;

                for (var i = 0, len = this._data.count(); i < len; i++) {
                    var row = this._data.row(i);

                    if (!row.isDataRow()) {
                        continue;
                    }

                    var range = this._getCellRange(i, column);

                    if (range.r1 !== range.r2) {
                        var span = range.r2 - range.r1 + 1;
                        this._data.row(range.r1).cell(cellIdx).ensureAttr().rowSpan = span;

                        for (var spannedRow = range.r1 + 1; spannedRow <= range.r2; spannedRow++) {
                            this._data.row(spannedRow).cell(cellIdx).visible(false);
                        }
                    }

                    i = range.r2;
                }
            };

            merger.prototype._getCellRange = function (rowIdx, column) {
                var cellIdx = column.options.leavesIdx, range = new wijmo.grid.cellRange(rowIdx, cellIdx), str = (this._data.valueAt(rowIdx, cellIdx) || "").toString(), dataLen = this._data.count();

                for (range.r2 = rowIdx; range.r2 < dataLen - 1; range.r2++) {
                    var row = this._data.row(range.r2 + 1);

                    if (!row.isDataRow() || ((row.valueCell(cellIdx).value || "").toString() !== str)) {
                        break;
                    }
                }

                var leafIdx = column.options.leavesIdx;

                if (leafIdx > 0 && column.options.rowMerge === "restricted") {
                    var prevLeaf = this._leaves[leafIdx - 1];

                    if (prevLeaf instanceof wijmo.grid.c1field) {
                        var range2 = this._getCellRange(rowIdx, prevLeaf);

                        range.r1 = Math.max(range.r1, range2.r1);
                        range.r2 = Math.min(range.r2, range2.r2);
                    }
                }

                return range;
            };
            return merger;
        })();
        _grid.merger = merger;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
/// <reference path="../../../wijutil/jquery.wijmo.wijutil.ts" />
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        grid.EXPANDO = "__wijgrid";

        /**
        * Specifies the type of a row in the grid.
        */
        (function (rowType) {
            /** The header row. */
            rowType[rowType["header"] = 1] = "header";

            /** Data row. */
            rowType[rowType["data"] = 2] = "data";

            /** Alternating data row (used only as modifier of the rowType.data, not as an independent value). */
            rowType[rowType["dataAlt"] = 4] = "dataAlt";

            /** Filter row. */
            rowType[rowType["filter"] = 8] = "filter";

            /** Group header row. */
            rowType[rowType["groupHeader"] = 16] = "groupHeader";

            /** Group footer row. */
            rowType[rowType["groupFooter"] = 32] = "groupFooter";

            /** Footer row. */
            rowType[rowType["footer"] = 64] = "footer";

            /** @ignore
            * Infrastructure.
            */
            rowType[rowType["emptyDataRow"] = 128] = "emptyDataRow";

            /** @ignore
            * Infrastructure, modifer of the rowType.data
            */
            rowType[rowType["detail"] = 256] = "detail";
        })(grid.rowType || (grid.rowType = {}));
        var rowType = grid.rowType;

        /**
        * Determines an object render state. This enumeration can be used with the cellStyleFormatter and rowStyleFormatter options to get a formatted object state.
        */
        (function (renderState) {
            /** This is the normal state. The object is rendered and not hovered, selected, or one of the elements determining the current position of the wijgrid. */
            renderState[renderState["none"] = 0] = "none";

            /** The object is being rendered. In the cellStyleFormatter, the rendered object is a table cell. In the rowStyleFormatter, the object is a table row. */
            renderState[renderState["rendering"] = 1] = "rendering";

            /** The object is one of the elements determining the current position of the wijgrid. */
            renderState[renderState["current"] = 2] = "current";

            /** The object is hovered over. */
            renderState[renderState["hovered"] = 4] = "hovered";

            /** The object is selected. */
            renderState[renderState["selected"] = 8] = "selected";

            /** @ignore. */
            renderState[renderState["editing"] = 16] = "editing";
        })(grid.renderState || (grid.renderState = {}));
        var renderState = grid.renderState;

        /**
        * Infrastructure.
        * @ignore
        */
        (function (renderStateEx) {
            renderStateEx[renderStateEx["none"] = 0] = "none";
            renderStateEx[renderStateEx["hidden"] = 1] = "hidden";
            renderStateEx[renderStateEx["collapsed"] = 2] = "collapsed";
        })(grid.renderStateEx || (grid.renderStateEx = {}));
        var renderStateEx = grid.renderStateEx;

        /**
        * Infrastructure.
        * @ignore
        */
        (function (rowScope) {
            rowScope[rowScope["table"] = 0] = "table";
            rowScope[rowScope["head"] = 1] = "head";
            rowScope[rowScope["body"] = 2] = "body";
            rowScope[rowScope["foot"] = 3] = "foot";
        })(grid.rowScope || (grid.rowScope = {}));
        var rowScope = grid.rowScope;

        /**
        * Infrastructure.
        * @ignore
        */
        (function (cellRangeExtendMode) {
            cellRangeExtendMode[cellRangeExtendMode["none"] = 0] = "none";
            cellRangeExtendMode[cellRangeExtendMode["column"] = 1] = "column";
            cellRangeExtendMode[cellRangeExtendMode["row"] = 2] = "row";
        })(grid.cellRangeExtendMode || (grid.cellRangeExtendMode = {}));
        var cellRangeExtendMode = grid.cellRangeExtendMode;

        /**
        * Infrastructure.
        * @ignore
        */
        (function (objectMode) {
            objectMode[objectMode["createIfNull"] = 0] = "createIfNull";
            objectMode[objectMode["createAlways"] = 1] = "createAlways";
            objectMode[objectMode["dispose"] = 2] = "dispose";
        })(grid.objectMode || (grid.objectMode = {}));
        var objectMode = grid.objectMode;

        /**
        * Determines purpose of the group row cells.
        * @ignore
        */
        (function (groupRowCellPurpose) {
            groupRowCellPurpose[groupRowCellPurpose["groupCell"] = 0] = "groupCell";
            groupRowCellPurpose[groupRowCellPurpose["aggregateCell"] = 1] = "aggregateCell";
        })(grid.groupRowCellPurpose || (grid.groupRowCellPurpose = {}));
        var groupRowCellPurpose = grid.groupRowCellPurpose;

        /**
        * Infrastructure.
        * @ignore
        */
        (function (dataRowsRangeMode) {
            dataRowsRangeMode[dataRowsRangeMode["sketch"] = 0] = "sketch";
            dataRowsRangeMode[dataRowsRangeMode["rendered"] = 1] = "rendered";
            dataRowsRangeMode[dataRowsRangeMode["renderable"] = 2] = "renderable";
        })(grid.dataRowsRangeMode || (grid.dataRowsRangeMode = {}));
        var dataRowsRangeMode = grid.dataRowsRangeMode;

        /**
        * Infrastructure.
        * @ignore
        */
        (function (intersectionMode) {
            intersectionMode[intersectionMode["none"] = 0] = "none";
            intersectionMode[intersectionMode["overlapTop"] = 1] = "overlapTop";
            intersectionMode[intersectionMode["overlapBottom"] = 2] = "overlapBottom";
            intersectionMode[intersectionMode["reset"] = 3] = "reset";
        })(grid.intersectionMode || (grid.intersectionMode = {}));
        var intersectionMode = grid.intersectionMode;

        function emptyTable(table) {
            if (table) {
                while (table.rows.length) {
                    var row;

                    while ((row = table.rows[0]).cells.length) {
                        var cell = row.cells[0];

                        while (cell.firstChild) {
                            cell.removeChild(cell.firstChild);
                        }

                        row.deleteCell(0);

                        row = cell = null;
                    }

                    table.deleteRow(0);
                }

                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            table = null;
        }
        grid.emptyTable = emptyTable;

        /** @ignore */
        function compareObj(a, b) {
            var i, len, flag;

            if ($.isArray(a) && $.isArray(b)) {
                if (a.length === b.length) {
                    flag = true;

                    for (i = 0, len = a.length; i < len && flag; i++) {
                        flag = wijmo.grid.compareObj(a[i], b[i]);
                    }

                    return flag;
                }
            } else {
                if ($.isPlainObject(a) && $.isPlainObject(b)) {
                    for (i in a) {
                        if (a.hasOwnProperty(i)) {
                            if (!wijmo.grid.compareObj(a[i], b[i])) {
                                return false;
                            }
                        }
                    }

                    for (i in b) {
                        if (b.hasOwnProperty(i)) {
                            if (!wijmo.grid.compareObj(a[i], b[i])) {
                                return false;
                            }
                        }
                    }

                    return true;
                } else {
                    if (a instanceof Date) {
                        a = a.getTime();
                    }

                    if (b instanceof Date) {
                        b = b.getTime();
                    }
                }
            }

            return a === b;
        }
        grid.compareObj = compareObj;

        /** @ignore */
        function stringFormat(pattern) {
            var params = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                params[_i] = arguments[_i + 1];
            }
            var i, len;

            if (!pattern) {
                return "";
            }

            for (i = 0, len = params.length; i < len; i++) {
                pattern = pattern.replace(new RegExp("\\{" + i + "\\}", "gm"), params[i]);
            }

            return pattern;
        }
        grid.stringFormat = stringFormat;

        /** @ignore */
        function validDataKey(dataKey) {
            return (dataKey && !(dataKey < 0)) || (dataKey === 0);
        }
        grid.validDataKey = validDataKey;

        /** @ignore */
        function validDate(date) {
            if (date && (date instanceof Date)) {
                return !isNaN(date.getTime());
            }

            return false;
        }
        grid.validDate = validDate;

        /** @ignore */
        function getDataType(column) {
            return column.dataType || "string";
        }
        grid.getDataType = getDataType;

        /** @ignore */
        function iterateChildrenWidgets(item, callback) {
            if (item && callback) {
                item.find(".ui-widget").each(function (index, dom) {
                    $.each($(dom).data(), function (dataKey, dataValue) {
                        if (dataValue.widgetName) {
                            callback(index, dataValue);
                        }
                    });

                    return true;
                });
            }
        }
        grid.iterateChildrenWidgets = iterateChildrenWidgets;

        /** @ignore */
        function remove$dataByPrefix(element, prefix) {
            var data$keys = [];

            $.each(element.data(), function (key) {
                if (key.indexOf(prefix) === 0) {
                    data$keys.push(key);
                }
            });

            $.each(data$keys, function (idx, key) {
                element.removeData(key);
            });
        }
        grid.remove$dataByPrefix = remove$dataByPrefix;

        /** @ignore */
        var domSelection = (function () {
            function domSelection(dom) {
                this._dom = dom;
            }
            // The 'dom' must be an input element
            domSelection.prototype.getSelection = function () {
                var start = 0, end = 0, textRange;

                if (this._dom.selectionStart !== undefined) {
                    start = this._dom.selectionStart;
                    end = this._dom.selectionEnd;
                } else {
                    if (document.selection) {
                        textRange = document.selection.createRange().duplicate();
                        end = textRange.text.length; // selection length
                        start = Math.abs(textRange.moveStart("character", -this._dom.value.length)); // move selection to the beginning
                        end += start;
                    }
                }

                return { start: start, end: end, length: end - start };
            };

            // The 'dom' must be an input element
            domSelection.prototype.setSelection = function (range) {
                if (this._dom.selectionStart !== undefined) {
                    this._dom.setSelectionRange(range.start, range.end);
                } else {
                    var textRange = this._dom.createTextRange();

                    textRange.collapse(true);
                    textRange.moveStart("character", range.start);
                    textRange.moveEnd("character", range.end);
                    textRange.select();
                }
            };

            domSelection.prototype.toggleSelection = function (enable) {
                var $dom = $(this._dom), useSelectStart = "onselectstart" in this._dom;

                if (enable) {
                    if (useSelectStart) {
                        $dom.unbind(".wijgrid-disableSelection");
                    } else {
                        $dom.css({ "MozUserSelect": "", "WebkitUserSelect": "" });
                    }
                } else {
                    if (useSelectStart) {
                        $dom.bind("selectstart.wijgrid-disableSelection", function (e) {
                            e.preventDefault();
                        });
                    } else {
                        $dom.css({ "MozUserSelect": "-moz-none", "WebkitUserSelect": "none" });
                    }
                }
            };
            return domSelection;
        })();
        grid.domSelection = domSelection;

        /** @ignore */
        function createDynamicField(options) {
            return $.extend(true, {
                dynamic: true,
                isLeaf: true
            }, options);
        }
        grid.createDynamicField = createDynamicField;

        /** @ignore */
        function bounds(element, client) {
            if (element) {
                var $dom = element.nodeType ? $(element) : element, offset = $dom.offset();

                if (offset) {
                    if (client) {
                        return { top: offset.top, left: offset.left, width: $dom[0].clientWidth || 0, height: $dom[0].clientHeight || 0 };
                    }

                    return { top: offset.top, left: offset.left, width: $dom.outerWidth(), height: $dom.outerHeight() };
                }
            }

            return null;
        }
        grid.bounds = bounds;

        /** @ignore */
        function ensureBounds(bounds, max) {
            if (bounds) {
                if (bounds.start < 0) {
                    bounds.start = 0;
                }

                if (bounds.end < 0) {
                    bounds.end = 0;
                }

                bounds.start = Math.min(bounds.start, max);

                bounds.end = Math.min(bounds.end, max);
            }

            return bounds;
        }
        grid.ensureBounds = ensureBounds;

        // maxDepth = -1 --  iterate through all child elements
        // default value = 3
        /** @ignore */
        function _getDOMText(dom, maxDepth, ignoreTextNodes) {
            if (!ignoreTextNodes && dom.nodeType === 3) {
                var nodeValue = (dom.nodeValue || "").replace(/[\r\t\n]+/g, "");
                return nodeValue;
            }

            if (dom && maxDepth !== 0) {
                if (!ignoreTextNodes && dom.nodeType === 3) {
                    return dom.nodeValue;
                }

                if (dom.nodeType === 1) {
                    switch (dom.type) {
                        case "button":
                        case "text":
                        case "textarea":
                        case "select-one":
                            return dom.value;
                        case "checkbox":
                            return dom.checked.toString();
                    }

                    // go deeper
                    var result = "", i = 0, child;

                    while (child = dom.childNodes[i++]) {
                        result += wijmo.grid._getDOMText(child, maxDepth - 1, ignoreTextNodes);
                    }

                    return result;
                }
            }

            return "";
        }
        grid._getDOMText = _getDOMText;

        /** @ignore */
        function isNaN(value) {
            return value !== value;
        }
        grid.isNaN = isNaN;

        // obj, prefix, name (opt), value (opt)
        /** @ignore */
        function dataPrefix(obj, prefix, name, value) {
            var treatAsArray = (obj.jquery || $.isArray(obj)), i, len, tmp, internalName = prefix + name;

            if (arguments.length === 3) {
                if (treatAsArray) {
                    return $.data(obj[0], internalName);
                }

                return $.data(obj, internalName);
            } else {
                if (treatAsArray) {
                    for (i = 0, len = obj.length; i < len; i++) {
                        tmp = $.data(obj[i], internalName, value);
                    }

                    return tmp;
                }

                return $.data(obj, internalName, value);
            }
        }
        grid.dataPrefix = dataPrefix;

        /** @ignore */
        function shallowMerge(target, src) {
            if (src && target) {
                var name, value, typeOf;

                for (name in src) {
                    if (src.hasOwnProperty(name)) {
                        value = src[name];
                        typeOf = typeof (value);

                        if ((typeOf === "string" || typeOf === "boolean" || typeOf === "number") && (target[name] === undefined)) {
                            target[name] = value;
                        }
                    }
                }
            }
        }
        grid.shallowMerge = shallowMerge;

        /** @ignore */
        function getAttributes(dom, prevent) {
            if (dom) {
                var i, len, cnt = 0, result = {}, attrValue, attrName;

                for (i = 0, len = dom.attributes.length; i < len; i++) {
                    attrName = dom.attributes[i].name;
                    if (attrName && (!prevent || !prevent(attrName))) {
                        attrValue = dom.getAttribute(attrName);

                        if (attrName === "style") {
                            attrValue = (typeof (attrValue) === "object") ? attrValue.cssText : attrValue;
                        }

                        if (!attrValue && attrName === "class") {
                            attrValue = dom.getAttribute("className");
                        }

                        if (attrValue && (typeof (attrValue) !== "function")) {
                            result[attrName] = attrValue;
                            cnt++;
                        }
                    }
                }

                if (cnt) {
                    return result;
                }
            }

            return null;
        }
        grid.getAttributes = getAttributes;

        // unlike the jQuery.extend(true) function the deepExtend() function doesn't skips undefined values.
        /** @ignore */
        function deepExtend(source, target) {
            var key, src, dst, isArray, clone;

            if (source) {
                if (typeof (target) !== "object" && !$.isFunction(target)) {
                    target = {};
                }

                for (key in source) {
                    src = source[key];
                    dst = target[dst];

                    if (src === target) {
                        continue;
                    }

                    if (src && ($.isPlainObject(src) || (isArray = $.isArray(src)))) {
                        if (isArray) {
                            isArray = false;
                            clone = dst && $.isArray(dst) ? dst : [];
                        } else {
                            clone = dst && $.isPlainObject(dst) ? dst : {};
                        }

                        target[key] = wijmo.grid.deepExtend(src, clone);
                    } else {
                        target[key] = src;
                    }
                }
            }

            return target;
        }
        grid.deepExtend = deepExtend;

        

        

        /** @ignore */
        function widgetName(element, name) {
            if (element && element.jquery) {
                element = element[0];
            }

            if (element) {
                return (arguments.length === 1) ? $.data(element, "wijgridwidgetName") : $.data(element, "wijgridwidgetName", name);
            }

            return undefined;
        }
        grid.widgetName = widgetName;

        /** @ignore */
        var HTML5InputSupport = (function () {
            function HTML5InputSupport() {
            }
            HTML5InputSupport.isExtendSupportRequired = function (inputType) {
                inputType = (inputType || "").toLowerCase();

                return (inputType in wijmo.grid.HTML5InputSupport._requiresExtendedSupport);
            };

            HTML5InputSupport.getDefaultInputType = function (mobileEnvironment, column) {
                var inputType = (column.inputType || "").toLowerCase();

                if (!inputType && mobileEnvironment) {
                    switch (wijmo.grid.getDataType(column)) {
                        case "number":
                        case "currency":
                            inputType = "number";
                            break;

                        case "datetime":
                            inputType = "datetime";
                            break;
                    }
                }

                if (!inputType || ((inputType !== "text") && !HTML5InputSupport._isSupportedByBrowser(inputType))) {
                    inputType = "text"; // fallback to "text"
                }

                return inputType;
            };

            HTML5InputSupport.toStr = function (value, inputType) {
                var result = value;

                inputType = (inputType || "").toLowerCase();

                if (wijmo.grid.HTML5InputSupport.isExtendSupportRequired(inputType)) {
                    switch (inputType) {
                        case "datetime":
                            result = (value) ? result = Globalize.format(value, "yyyy-MM-ddTHH:mm:ssZ") : "";
                            break;

                        case "datetime-local":
                            result = (value) ? result = Globalize.format(value, "yyyy-MM-ddTHH:mm:ss") : "";
                            break;

                        case "date":
                            result = (value) ? result = Globalize.format(value, "yyyy-MM-dd") : "";
                            break;

                        case "month":
                            result = (value) ? result = Globalize.format(value, "yyyy-MM") : "";
                            break;

                        case "time":
                            result = (value) ? result = Globalize.format(value, "HH:mm:ss") : "";
                            break;
                    }
                } else {
                    result = value + "";
                }

                return result;
            };

            HTML5InputSupport.parse = function (value, inputType) {
                var result, fallback = function (date) {
                    date = new Date(date);
                    if (!wijmo.grid.validDate(date)) {
                        date = null;
                    }

                    return date;
                };

                inputType = (inputType || "").toLowerCase();

                if (wijmo.grid.HTML5InputSupport.isExtendSupportRequired(inputType)) {
                    switch (inputType) {
                        case "datetime":
                            result = Globalize.parseDate(value, "yyyy-MM-ddTHH:mm:ssZ") || Globalize.parseDate(value, "yyyy-MM-ddTHH:mmZ") || fallback(value);
                            break;
                        case "datetime-local":
                            result = Globalize.parseDate(value, "yyyy-MM-ddTHH:mm:ss") || Globalize.parseDate(value, "yyyy-MM-ddTHH:mm") || fallback(value);
                            break;

                        case "date":
                            result = Globalize.parseDate(value, "yyyy-MM-dd") || fallback(value);
                            break;

                        case "month":
                            result = Globalize.parseDate(value, "yyyy-MM");
                            break;

                        case "time":
                            result = Globalize.parseDate(value, "HH:mm:ss") || Globalize.parseDate(value, "HH:mm");
                            ;
                            break;

                        case "number":
                            result = parseFloat(value);
                    }
                } else {
                    result = value;
                }

                return result;
            };

            HTML5InputSupport.extend = function (value, extendWith, inputType) {
                if (!value) {
                    value = extendWith;
                } else {
                    inputType = (inputType || "").toLowerCase();

                    switch (inputType) {
                        case "date":
                            value.setFullYear(extendWith.getFullYear(), extendWith.getMonth(), extendWith.getDate());
                            break;

                        case "month":
                            value.setFullYear(extendWith.getFullYear(), extendWith.getMonth());
                            break;

                        case "time":
                            value.setHours(extendWith.getHours());
                            value.setMinutes(extendWith.getMinutes());
                            value.setSeconds(extendWith.getSeconds());
                            break;

                        default:
                            value = extendWith;
                    }
                }

                return value;
            };

            HTML5InputSupport._isSupportedByBrowser = function (inputType) {
                if (inputType) {
                    if (this._supportedInputTypesCache[inputType] === undefined) {
                        var success;

                        try  {
                            var $element = $("<input type='" + inputType + "' style='display:none' />");
                            success = true;
                        } catch (e) {
                            success = false;
                        }

                        this._supportedInputTypesCache[inputType] = success && ($element[0].type === inputType);
                    }

                    return this._supportedInputTypesCache[inputType];
                }

                return false;
            };
            HTML5InputSupport._requiresExtendedSupport = {
                "date": "",
                "datetime": "",
                "datetime-local": "",
                "month": "",
                "time": ""
            };

            HTML5InputSupport._supportedInputTypesCache = {};
            return HTML5InputSupport;
        })();
        grid.HTML5InputSupport = HTML5InputSupport;

        /** @ignore */
        function getZIndex(element, minValue) {
            if (typeof minValue === "undefined") { minValue = 99; }
            var zIndex = 0;

            if (element && $.ui && $.fn.zIndex) {
                zIndex = element.zIndex(); // try to get zIndex of the first z-indexed ancestor.

                if (zIndex) {
                    zIndex++; // get next value
                }
            }

            return Math.max(zIndex, minValue);
        }
        grid.getZIndex = getZIndex;

        // * taken from jQuery UI
        /** @ignore */
        function isOverAxis(x, reference, size) {
            // Determines when x coordinate is over "b" element axis
            return (x > reference) && (x < (reference + size));
        }
        grid.isOverAxis = isOverAxis;

        /** @ignore */
        function isOver(y, x, top, left, height, width) {
            // Determines when x, y coordinates is over "b" element
            return wijmo.grid.isOverAxis(y, top, height) && wijmo.grid.isOverAxis(x, left, width);
        }
        grid.isOver = isOver;

        // taken from jQuery UI *
        // ** uid
        var __uid = 0;

        /** @ignore */
        function getUID() {
            return "uid" + __uid++;
        }
        grid.getUID = getUID;

        // uid **
        /** @ignore */
        function isMobileSafari() {
            return !!(navigator && navigator.userAgent && (navigator.userAgent.match(/Mobile.*Safari/)) !== null);
        }
        grid.isMobileSafari = isMobileSafari;

        /** @ignore */
        function isAndroid() {
            return !!(navigator && ((navigator.userAgent || "").toLowerCase().indexOf("android") >= 0));
        }
        grid.isAndroid = isAndroid;

        /** @ignore */
        function getWindowOrientation() {
            return window.orientation || 0;
        }
        grid.getWindowOrientation = getWindowOrientation;

        /** @ignore */
        function isPercentage(value) {
            return !!(value && (typeof (value) === "string") && (value[value.length - 1] === "%"));
        }
        grid.isPercentage = isPercentage;

        var __scrollBarSize = 0;

        /** @ignore */
        function getSuperPanelScrollBarSize() {
            if (!(__scrollBarSize > 0)) {
                if (document && document.body && $.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    var $div;

                    try  {
                        $div = $("<div></div>").css({
                            overflow: "scroll",
                            width: 30,
                            height: 30,
                            position: "absolute",
                            visibility: "hidden"
                        }).append($("<div></div>").css({ width: 100, height: 100 })).appendTo(document.body);

                        __scrollBarSize = $div[0].offsetWidth - $div[0].clientWidth; // measure
                    } catch (ex) {
                    } finally {
                        if ($div) {
                            $div.remove();
                        }
                    }
                }

                if (!(__scrollBarSize > 0)) {
                    __scrollBarSize = 18; // use the default size of the wijsuperpanel' scrollbars
                }
            }

            return __scrollBarSize;
        }
        grid.getSuperPanelScrollBarSize = getSuperPanelScrollBarSize;

        /** @ignore */
        function getContent(element, decodeHTML) {
            var value = "";

            if (decodeHTML && element.childNodes.length === 1 && element.firstChild.nodeType === 3) {
                value = (element.textContent !== undefined) ? element.textContent : element.innerText; // IE <= 8
                value = $.trim(value);
            } else {
                value = $.trim(element.innerHTML);

                if (value === "&nbsp;") {
                    value = "";
                }
            }

            return value;
        }
        grid.getContent = getContent;

        /** @ignore */
        function setContent(element, encodeHTML, value) {
            if (encodeHTML) {
                if (element.textContent !== undefined) {
                    element.textContent = value || "";
                } else {
                    element.innerText = value || ""; // IE <= 8
                }
            } else {
                element.innerHTML = value || "&nbsp;";
            }
        }
        grid.setContent = setContent;

        // * compatibility: export members to the $.wijmo.wijgrid "namespace" *
        $.extend($.wijmo.wijgrid, {
            rowType: wijmo.grid.rowType,
            renderState: wijmo.grid.renderState,
            bounds: wijmo.grid.bounds
        });
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    (function (grid) {
        /** @ignore */
        (function (TimeUnit) {
            TimeUnit[TimeUnit["Millisecond"] = 1] = "Millisecond";
            TimeUnit[TimeUnit["Second"] = 2] = "Second";
            TimeUnit[TimeUnit["Minute"] = 4] = "Minute";
            TimeUnit[TimeUnit["Hour"] = 8] = "Hour";
            TimeUnit[TimeUnit["Day"] = 16] = "Day";
            TimeUnit[TimeUnit["Month"] = 32] = "Month";
            TimeUnit[TimeUnit["Year"] = 64] = "Year";

            TimeUnit[TimeUnit["DATE"] = 64 /* Year */ | 32 /* Month */ | 16 /* Day */] = "DATE";
            TimeUnit[TimeUnit["TIME"] = 8 /* Hour */ | 4 /* Minute */ | 2 /* Second */ | 1 /* Millisecond */] = "TIME";
            TimeUnit[TimeUnit["ALL"] = TimeUnit.DATE | TimeUnit.TIME] = "ALL";
        })(grid.TimeUnit || (grid.TimeUnit = {}));
        var TimeUnit = grid.TimeUnit;
        ;

        /** @ignore */
        var TimeUnitConverter = (function () {
            function TimeUnitConverter() {
            }
            /**
            * @param inputType One of the HTML input type values (date-time).
            */
            TimeUnitConverter.convertInputType = function (inputType) {
                var formatString = wijmo.grid.TimeUnitConverter.convertInputTypeToFormatString(inputType), result = wijmo.grid.TimeUnitConverter.convertFormatString(formatString);

                return result;
            };

            TimeUnitConverter.convertInputTypeToFormatString = function (inputType) {
                switch ((inputType || "").toLowerCase()) {
                    case "datetime":
                    case "datetime-local":
                        return "f";

                    case "date":
                        return "d";

                    case "month":
                        return "Y";

                    case "time":
                        return "t";
                }

                return "";
            };

            /**
            * @param dateFormatString
            */
            TimeUnitConverter.convertFormatString = function (dateFormatString) {
                var result = 0;

                if (dateFormatString) {
                    // ** check one-char standard formats **
                    if (dateFormatString.length === 1) {
                        switch (dateFormatString[0]) {
                            case "t":
                                return 8 /* Hour */ | 4 /* Minute */;

                            case "T":
                                return TimeUnit.TIME;

                            case "d":
                            case "D":
                                return TimeUnit.DATE;

                            case "Y":
                                return 32 /* Month */ | 64 /* Year */;

                            case "M":
                                return 32 /* Month */ | 16 /* Day */;

                            case "f", "F", "S":
                                return TimeUnit.ALL;
                        }
                    }

                    // ** check custom tokens **
                    var quoteFirst, quoteLast;

                    // remove quoted text
                    if (((quoteFirst = dateFormatString.indexOf("'")) >= 0) && ((quoteLast = dateFormatString.lastIndexOf("'")) >= 0) && (quoteFirst !== quoteLast)) {
                        dateFormatString = dateFormatString.substr(0, quoteFirst) + dateFormatString.substring(quoteLast + 1, dateFormatString.length - 1);
                    }

                    for (var i = 0, len = dateFormatString.length; i < len; i++) {
                        switch (dateFormatString[i]) {
                            case "d":
                                result |= 16 /* Day */;
                                break;

                            case "M":
                                result |= 32 /* Month */;
                                break;

                            case "y":
                                result |= 64 /* Year */;
                                break;

                            case "m":
                                result |= 4 /* Minute */;
                                break;

                            case "h":
                            case "H":
                                result |= 8 /* Hour */;
                                break;

                            case "s":
                                result |= 2 /* Second */;
                                break;

                            case "f":
                                result |= 1 /* Millisecond */;
                                break;
                        }
                    }
                }

                return result || TimeUnit.ALL;
            };

            TimeUnitConverter.cutDate = function (date, timeUnit) {
                if (date) {
                    timeUnit = ~timeUnit;

                    if (timeUnit & 1 /* Millisecond */) {
                        date.setMilliseconds(0);
                    }

                    if (timeUnit & 2 /* Second */) {
                        date.setSeconds(0);
                    }

                    if (timeUnit & 4 /* Minute */) {
                        date.setMinutes(0);
                    }

                    if (timeUnit & 8 /* Hour */) {
                        date.setHours(0);
                    }

                    if (timeUnit & 16 /* Day */) {
                        date.setDate(1);
                    }

                    if (timeUnit & 32 /* Month */) {
                        date.setMonth(0);
                    }

                    if (timeUnit & 64 /* Year */) {
                        date.setFullYear(0);
                    }
                }

                return date;
            };
            return TimeUnitConverter;
        })();
        grid.TimeUnitConverter = TimeUnitConverter;

        /** @ignore */
        function lazy(eval, context) {
            var hasValue = false, value;
            return function () {
                if (!hasValue) {
                    value = context ? eval.call(context) : eval();
                    hasValue = true;
                }
                return value;
            };
        }
        grid.lazy = lazy;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="wijgrid.ts"/>
/// <reference path="interfaces.ts"/>
var wijmo;
(function (wijmo) {
    /// <reference path="../../../data/src/dataView.ts"/>
    /// <reference path="../../../data/src/filtering.ts"/>
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var builtInFilterOperators = (function () {
            function builtInFilterOperators() {
            }
            builtInFilterOperators.NoFilterOp = {
                applicableTo: null,
                name: "NoFilter",
                displayName: "No filter",
                arity: 1,
                operator: function () {
                    return true;
                }
            };
            return builtInFilterOperators;
        })();

        /** @ignore */
        var filterOperatorsCache = (function () {
            function filterOperatorsCache(wijgrid) {
                this._cache = {};
                var self = this;

                this._wijgrid = wijgrid;

                this._addOperator(null, builtInFilterOperators.NoFilterOp);

                $.each(wijmo.data.filtering.ops, function (name, op) {
                    self._addOperator(name, op);
                });

                $.each(wijgrid.options.customFilterOperators, function (key, fop) {
                    self._addOperator(null, fop, true);
                });
            }
            filterOperatorsCache.prototype.getByName = function (name) {
                var fop = this.getByNameInt(name);

                return (fop) ? fop.op : null;
            };

            filterOperatorsCache.prototype.getByNameInt = function (name) {
                return this._cache[(name || "").toLowerCase()];
            };

            filterOperatorsCache.prototype.getByDataType = function (dataType) {
                var intResult = [], result;

                $.each(this._cache, function (key, val) {
                    var fop = val.op;

                    if (!fop.applicableTo || $.inArray(dataType, fop.applicableTo) >= 0) {
                        intResult.push(val);
                    }
                });

                switch (this._wijgrid.options.filterOperatorsSortMode.toLowerCase()) {
                    case "alphabetical":
                        intResult.sort(this._sortAlpha);
                        break;
                    case "alphabeticalcustomfirst":
                        intResult.sort(this._sortAlphaCustomFirst);
                        break;

                    case "alphabeticalembeddedFirst":
                        intResult.sort(this._sortAlphaEmbeddedFirst);
                        break;

                    case "none":
                        break;

                    default:
                        break;
                }

                result = $.map(intResult, function (val, key) {
                    return val.op;
                });

                return result;
            };

            filterOperatorsCache.prototype._addOperator = function (name, fop, isCustom) {
                if (typeof isCustom === "undefined") { isCustom = false; }
                if (name && !fop.name) {
                    fop.name = name;
                }

                name = (name || fop.name).toLowerCase();

                if (!this._cache[name]) {
                    this._cache[name] = {
                        op: fop,
                        isCustom: (isCustom === true)
                    };
                }
            };

            filterOperatorsCache.prototype._sortAlpha = function (a, b) {
                var n1 = a.op.name.toLowerCase(), n2 = b.op.name.toLowerCase();

                if (n1 !== n2) {
                    if (n1 === "nofilter") {
                        return -1;
                    }

                    if (n2 === "nofilter") {
                        return 1;
                    }
                }

                if (n1 === n2) {
                    return 0;
                }

                return (n1 < n2) ? -1 : 1;
            };

            filterOperatorsCache.prototype._sortAlphaEmbeddedFirst = function (a, b) {
                var n1 = a.op.name.toLowerCase(), n2 = b.op.name.toLowerCase();

                if (n1 !== n2) {
                    if (n1 === "nofilter") {
                        return -1;
                    }

                    if (n2 === "nofilter") {
                        return 1;
                    }
                }

                if (a.isCustom !== b.isCustom) {
                    if (a.isCustom) {
                        return 1;
                    }

                    if (b.isCustom) {
                        return -1;
                    }
                }

                if (n1 === n2) {
                    return 0;
                }

                return (n1 < n2) ? -1 : 1;
            };

            filterOperatorsCache.prototype._sortAlphaCustomFirst = function (a, b) {
                var n1 = a.op.name.toLowerCase(), n2 = b.op.name.toLowerCase();

                if (n1 !== n2) {
                    if (n1 === "nofilter") {
                        return -1;
                    }

                    if (n2 === "nofilter") {
                        return 1;
                    }
                }

                if (a.isCustom !== b.isCustom) {
                    if (a.isCustom) {
                        return -1;
                    }

                    if (b.isCustom) {
                        return 1;
                    }
                }

                if (n1 === n2) {
                    return 0;
                }

                return (n1 < n2) ? -1 : 1;
            };
            return filterOperatorsCache;
        })();
        grid.filterOperatorsCache = filterOperatorsCache;

        

        /** @ignore */
        var filterHelper = (function () {
            function filterHelper() {
            }
            // filterValue
            // [filterValue, ..., filterValue]
            // [[filterValue, ..., filterValue], ..., [filterValue, ..., filterValue]]
            filterHelper.getSingleValue = function (filterValue) {
                if ($.isArray(filterValue)) {
                    filterValue = filterValue[0];

                    if ($.isArray(filterValue)) {
                        filterValue = filterValue[0];
                    }
                }

                return filterValue;
            };

            // filterOperator -> name | { name, condition }
            // filterOperator -> filterOperator | [ filterOperator, ..., filterOperator]
            filterHelper.getSingleOperatorName = function (filterOperator) {
                if ($.isArray(filterOperator)) {
                    filterOperator = filterOperator[0];
                }

                return filterOperator.name || filterOperator || "";
            };

            // filterOperator: opName | [opName, ..., opName] | [ { name, condition }, ..., { name, condition } ]
            // filterValue: filterValue | [filterValue, ... , filterValue] | [[], ..., []]
            filterHelper.verify = function (filterOperator, filterValue, dataType, cache) {
                if (filterOperator) {
                    if ($.isArray(filterOperator)) {
                        var i, len, fop = [], fval = [];

                        if (!$.isArray(filterValue)) {
                            filterValue = [filterValue];
                        }

                        for (i = 0, len = filterOperator.length; i < len; i++) {
                            if (wijmo.grid.filterHelper._verifySingleOp(filterOperator[i], filterValue[i], dataType, cache)) {
                                fop.push({
                                    name: filterOperator[i].name || filterOperator[i],
                                    condition: filterOperator[i].condition || "or"
                                });

                                fval.push(filterValue ? filterValue[i] : undefined);
                            }
                        }

                        if (fop.length) {
                            return {
                                filterOperator: fop,
                                filterValue: fval
                            };
                        }
                    } else {
                        if (wijmo.grid.filterHelper._verifySingleOp(filterOperator, filterValue, dataType, cache)) {
                            return {
                                filterOperator: filterOperator,
                                filterValue: filterValue
                            };
                        }
                    }
                }

                return null;
            };

            // filterOpeator: name | { name, condition }
            filterHelper._verifySingleOp = function (filterOperator, filterValue, dataType, cache) {
                if (filterOperator && (filterOperator = (filterOperator.name || filterOperator))) {
                    var fop;

                    filterOperator = (filterOperator || "").toLowerCase();

                    if ((filterOperator !== "nofilter" || filterValue !== undefined) && (fop = cache.getByName(filterOperator))) {
                        if (fop.applicableTo === null || $.inArray(dataType || "string", fop.applicableTo) >= 0) {
                            if (fop.arity === 1 || (fop.arity > 1 && wijmo.grid.filterHelper.getSingleValue(filterValue) !== undefined)) {
                                return true;
                            }
                        }
                    }
                }

                return false;
            };
            filterHelper.marker = "_wijgrid";
            return filterHelper;
        })();
        grid.filterHelper = filterHelper;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
/// <reference path="misc.ts"/>
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        

        

        /** @ignore */
        function getTableSection(table, scope) {
            if (table && !table.nodeType) {
                table = table[0];
            }

            if (table) {
                switch (scope) {
                    case 1 /* head */:
                        return table.tHead;

                    case 2 /* body */:
                        if (table.tBodies) {
                            return table.tBodies[0] || null;
                        }
                        break;

                    case 3 /* foot */:
                        return table.tFoot;

                    default:
                        return table;
                }
            }

            return null;
        }
        grid.getTableSection = getTableSection;

        

        

        /** @ignore */
        function getTableSectionLength(table, scope) {
            var section;

            if (table && !table.nodeType) {
                table = table[0]; // jQuery
            }

            return (table && (section = this.getTableSection(table, scope))) ? section.rows.length : 0;
        }
        grid.getTableSectionLength = getTableSectionLength;

        

        

        /** @ignore */
        function getTableSectionRow(table, scope, rowIndex) {
            var section;

            if (table && !table.nodeType) {
                table = table[0]; // jQuery
            }

            return (table && (section = this.getTableSection(table, scope))) ? (section.rows[rowIndex] || null) : null;
        }
        grid.getTableSectionRow = getTableSectionRow;

        

        

        /** @ignore */
        function readTableSection(table, scope, decodeHTML, readAttributes) {
            var ri, rowLen, ci, celLen, domRow, row, expando, rowAttributes, result = [], prevent = function (attrName) {
                attrName = attrName.toLowerCase();
                return attrName === "rowspan" || attrName === "colspan";
            }, section;

            if (table && !table.nodeType) {
                table = table[0]; // jQuery
            }

            if (table && (section = this.getTableSection(table, scope))) {
                for (ri = 0, rowLen = section.rows.length; ri < rowLen; ri++) {
                    domRow = section.rows[ri];
                    row = [];

                    if (readAttributes) {
                        expando = wijmo.data.Expando.getFrom(row, true);
                        rowAttributes = expando[wijmo.grid.EXPANDO] = {
                            cellsAttributes: {},
                            rowAttributes: wijmo.grid.getAttributes(domRow) || {}
                        };
                    }

                    for (ci = 0, celLen = domRow.cells.length; ci < celLen; ci++) {
                        var value = wijmo.grid.getContent(domRow.cells[ci], decodeHTML);

                        row[ci] = value;

                        if (readAttributes) {
                            rowAttributes.cellsAttributes[ci] = wijmo.grid.getAttributes(domRow.cells[ci], prevent) || {};
                        }
                    }

                    result[ri] = row;
                }
            }

            return result;
        }
        grid.readTableSection = readTableSection;

        /** @ignore */
        function determineSection(cell) {
            var element = cell.parentNode.parentNode;

            switch (element.tagName.toLowerCase()) {
                case "thead":
                    return 1 /* head */;

                case "tbody":
                    return 2 /* body */;

                case "tfoot":
                    return 3 /* foot */;
            }

            return null;
        }
        grid.determineSection = determineSection;

        /** @ignore */
        var htmlTableAccessor = (function () {
            function htmlTableAccessor(domTable, skipOffsets, ensureTBody, ensureColgroup) {
                this._width = 0;
                this._table = domTable;
                this._offsets = [];

                if (ensureColgroup) {
                    this.ensureColGroup();
                }

                if (ensureTBody) {
                    this.ensureTBody();
                }

                if (!skipOffsets) {
                    this._buildOffsets();
                }
            }
            htmlTableAccessor.prototype.element = function () {
                return this._table;
            };

            htmlTableAccessor.prototype.width = function () {
                return this._width;
            };

            htmlTableAccessor.prototype.getCellIdx = function (colIdx, rowIdx) {
                return (colIdx < this._width && rowIdx >= 0 && rowIdx < this._offsets.length) ? this._offsets[rowIdx][colIdx].cellIdx : -1;
            };

            htmlTableAccessor.prototype.getColumnIdx = function (cellIdx, rowIdx) {
                if (typeof (cellIdx) !== "number") {
                    var domCell = cellIdx;

                    cellIdx = domCell.cellIndex;
                    rowIdx = domCell.parentNode.rowIndex;
                }

                return (cellIdx < this._width) ? this._offsets[rowIdx][cellIdx].colIdx : -1;
            };

            htmlTableAccessor.prototype.clearContent = function () {
                if (this._table) {
                    while (this._table.firstChild) {
                        this._table.removeChild(this._table.firstChild);
                    }

                    this.ensureColGroup();
                    this.ensureTBody();
                }
            };

            htmlTableAccessor.prototype.clearSection = function (scope) {
                var start, end, section = wijmo.grid.getTableSection(this._table, scope);

                switch (scope) {
                    case 2 /* body */:
                        start = this.getSectionLength(0 /* table */);
                        end = start + this.getSectionLength(scope) - 1;
                        break;

                    case 3 /* foot */:
                        start = this.getSectionLength(0 /* table */) + this.getSectionLength(1 /* head */);
                        end = start + this.getSectionLength(scope) - 1;
                        break;

                    default:
                        start = 0;
                        end = this.getSectionLength(scope) - 1;
                }

                while (section.rows.length) {
                    section.deleteRow(0);
                }

                // update offsets
                this._offsets.splice(start, end - start + 1);
            };

            htmlTableAccessor.prototype.getSectionLength = function (scope) {
                return wijmo.grid.getTableSectionLength(this._table, scope);
            };

            htmlTableAccessor.prototype.getSectionRow = function (rowIndex, scope) {
                return wijmo.grid.getTableSectionRow(this._table, scope, rowIndex);
            };

            // iterates through the table rows using natural cells order
            htmlTableAccessor.prototype.forEachColumnCellNatural = function (columnIdx, callback, param) {
                var i, rowLen, row, result;

                for (i = 0, rowLen = this._table.rows.length; i < rowLen; i++) {
                    row = this._table.rows[i];

                    if (columnIdx < row.cells.length) {
                        result = callback(row.cells[columnIdx], i, param);
                        if (result !== true) {
                            return result;
                        }
                    }
                }

                return true;
            };

            // iterates through the table rows using colSpan\rowSpan offsets
            htmlTableAccessor.prototype.forEachColumnCell = function (columnIdx, callback, param) {
                var i, rowLen, row, offsetCellIdx, result;

                for (i = 0, rowLen = this._offsets.length; i < rowLen; i++) {
                    row = this._table.rows[i];

                    offsetCellIdx = this.getCellIdx(columnIdx, i);
                    if (offsetCellIdx >= 0) {
                        result = callback(row.cells[offsetCellIdx], i, param);
                        if (result !== true) {
                            return result;
                        }
                    }
                }

                return true;
            };

            // iterates throw the cells of a table row
            htmlTableAccessor.prototype.forEachRowCell = function (rowIndex, callback, param) {
                var row = this._table.rows[rowIndex], i, celLen, result;

                for (i = 0, celLen = row.cells.length; i < celLen; i++) {
                    result = callback(row.cells[i], i, param);
                    if (result !== true) {
                        return result;
                    }
                }

                return true;
            };

            htmlTableAccessor.prototype.colGroupTag = function () {
                var cgs = this._table.getElementsByTagName("colgroup");
                return (cgs && cgs[0]) || null;
            };

            htmlTableAccessor.prototype.colTags = function () {
                var colGroup = this.colGroupTag();
                return ((colGroup && colGroup.getElementsByTagName("col")) || []);
            };

            htmlTableAccessor.prototype.ensureTBody = function () {
                return ((this._table.tBodies && this._table.tBodies[0]) || this._table.appendChild(document.createElement("tbody")));
            };

            htmlTableAccessor.prototype.ensureTHead = function () {
                return (this._table.tHead && this._table.tHead[0]) || this._table.createTHead();
            };

            htmlTableAccessor.prototype.ensureTFoot = function () {
                return (this._table.tFoot && this._table.tFoot[0]) || this._table.createTFoot();
            };

            htmlTableAccessor.prototype.ensureColGroup = function () {
                var colGroup = this._table.getElementsByTagName("colgroup");
                return ((colGroup && colGroup[0]) || this._table.appendChild(document.createElement("colgroup")));
            };

            htmlTableAccessor.prototype.appendCol = function (domCol /*opt*/ ) {
                var colGroup = this.ensureColGroup();
                return ((domCol && colGroup.appendChild(domCol)) || colGroup.appendChild(document.createElement("col")));
            };

            htmlTableAccessor.prototype.removeOffset = function (idx) {
                if (idx >= 0 && idx < this._offsets.length) {
                    if (idx < 0 || (!idx && idx !== 0)) {
                        idx = this._offsets.length - 1; // last row
                    }

                    this._offsets.splice(idx, 1);
                }
            };

            htmlTableAccessor.prototype.insertOffset = function (idx) {
                var row, i;

                if (this._width > 0) {
                    row = [];

                    for (i = 0; i < this._width; i++) {
                        row.push({ cellIdx: i, colIdx: i });
                    }

                    if (idx < 0 || (!idx && idx !== 0)) {
                        idx = this._offsets.length; // append row
                    }

                    this._offsets.splice(idx, 0, row);
                }
            };

            htmlTableAccessor.prototype.rebuildOffsets = function () {
                this._offsets = [];
                this._width = 0;
                this._buildOffsets();
            };

            htmlTableAccessor.prototype._buildOffsets = function () {
                var rowSpan = [], rowOffsets, i, rowLen, row, j, jOffset, celLen, cell, cs, rowSpanLen;

                for (i = 0, rowLen = this._table.rows.length; i < rowLen; i++) {
                    rowOffsets = [];
                    this._offsets[i] = rowOffsets;

                    row = this._table.rows[i];
                    for (j = 0, jOffset = 0, celLen = row.cells.length; j < celLen; j++, jOffset++) {
                        cell = row.cells[j];

                        for (; rowSpan[jOffset] > 1; jOffset++) {
                            rowSpan[jOffset]--;
                            rowOffsets[jOffset] = { cellIdx: -1, colIdx: -1 };
                        }

                        if (!(rowSpan[jOffset] > 1)) {
                            rowSpan[jOffset] = cell.rowSpan;
                        }

                        rowOffsets[jOffset] = { cellIdx: j, colIdx: -1 };
                        rowOffsets[j].colIdx = jOffset;

                        // process colspan
                        cs = cell.colSpan;
                        for (; cs > 1; cs--) {
                            rowOffsets[++jOffset] = { cellIdx: -1, colIdx: -1 };
                        }
                    }

                    rowSpanLen = rowSpan.length;
                    for (; jOffset < rowSpanLen; jOffset++) {
                        rowSpan[jOffset]--;
                        rowOffsets[jOffset] = { cellIdx: -1, colIdx: -1 };
                    }

                    this._width = Math.max(this._width, rowSpanLen);
                }
            };
            return htmlTableAccessor;
        })();
        grid.htmlTableAccessor = htmlTableAccessor;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts" />
/// <reference path="wijgrid.ts" />
/// <reference path="misc.ts" />
var wijmo;
(function (wijmo) {
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        /** An object that represents a single cell. */
        var cellInfo = (function () {
            /** Creates an object that represents a single cell. Normally you do not need to use this method.
            * @example
            * var cell = new wijmo.grid.cellInfo(0, 0, $("#demo").data("wijmo-wijgrid"));
            * @param {Number} cellIndex The zero-based index of the required cell inside the corresponding row.
            * @param {Number} rowIndex The zero-based index of the row that contains required cell.
            * @param {Object} wijgrid The wijgrid instance.
            * @returns {wijmo.grid.cellInfo} Object that represents a single cell.
            */
            function cellInfo(cellIndex, rowIndex, wijgrid, absolute, virtualize) {
                if (typeof wijgrid === "undefined") { wijgrid = null; }
                if (typeof absolute === "undefined") { absolute = false; }
                if (typeof virtualize === "undefined") { virtualize = true; }
                this.__isEdit = false;
                this._wijgrid = wijgrid;
                this._virtualize = virtualize;

                if (absolute) {
                    this._ci = cellIndex - this._wijgrid._getDataToAbsOffset().x;
                    this._ri = rowIndex - this._wijgrid._getDataToAbsOffset().y;

                    if (this._virtualize) {
                        if (this._ci >= 0) {
                            this._ci = this._wijgrid._renderedLeaves()[this._ci].options.visLeavesIdx;
                        }

                        if (this._ri >= 0) {
                            this._ri = this._wijgrid._renderableRowsRange().getAbsIndex(this._ri + this._wijgrid._viewPortBounds().start);
                        }
                    }
                } else {
                    this._ci = cellIndex;
                    this._ri = rowIndex;
                }
            }
            // public
            /** @ignore */
            cellInfo.prototype.cellIndexAbs = function () {
                var dataOffset = this._wijgrid._getDataToAbsOffset().x;

                var value = this._virtualize ? this._wijgrid._visibleLeaves()[this._ci + dataOffset].options.renderedIndex : this._ci + dataOffset;

                return value;
            };

            /** @ignore */
            cellInfo.prototype.rowIndexAbs = function () {
                var value = this._virtualize ? this._wijgrid._renderableRowsRange().getRenderedIndex(this._ri) - this._wijgrid._viewPortBounds().start : this._ri;

                value += this._wijgrid._getDataToAbsOffset().y;

                return value;
            };

            /** @ignore */
            cellInfo.prototype.cellIndex = function (value) {
                if (!arguments.length) {
                    return this._ci;
                }

                this._ci = value;
            };

            /** Gets the associated column object.
            * @example
            * var column = cellInfoObj.column();
            * @returns {wijmo.grid.IColumn} The associated column object.
            */
            cellInfo.prototype.column = function () {
                var instance = this.columnInst();

                return instance ? instance.options : null;
            };

            /** @ignore */
            cellInfo.prototype.columnInst = function () {
                if (this._wijgrid && this._isValid()) {
                    var dataOffset = this._wijgrid._getDataToAbsOffset();
                    return this._wijgrid._visibleLeaves()[this.cellIndex() + dataOffset.x];
                }

                return null;
            };

            /** Returns the jQuery object containing a cell content.
            * @example
            * var $container = cellInfoObj.container();
            * @returns {Object} The jQuery object containing a cell content.
            */
            cellInfo.prototype.container = function () {
                var tableCell = this.tableCell(), $innerDiv;

                if (tableCell) {
                    $innerDiv = $(tableCell).children("div." + wijmo.grid.wijgrid.CSS.cellContainer);
                    if ($innerDiv) {
                        return $innerDiv;
                    }
                }

                return null;
            };

            /** Compares the current object with an object you have specified and indicates whether they are identical
            * @example
            * var isEqual = cellInfoObj1.isEqual(cellInfoObj2);
            * @param {wijmo.grid.cellInfo} value The object to compare
            * @returns {Boolean} True if the objects are identical, otherwise false.
            */
            cellInfo.prototype.isEqual = function (value) {
                return (value && (value.rowIndex() === this.rowIndex()) && (value.cellIndex() === this.cellIndex()));
            };

            /** Gets the accociated row's information.
            * @example
            * var row = cellInfoObj.row();
            * @returns {wijmo.grid.IRowInfo} Information about associated row.
            */
            cellInfo.prototype.row = function () {
                var rowObj = null, result = null;

                if (this._wijgrid) {
                    if (this._virtualize) {
                        result = this._wijgrid._view()._getRowInfoBySketchRowIndex(this.rowIndex());
                    } else {
                        rowObj = this._wijgrid._view().rows().item(this.rowIndexAbs());

                        if (rowObj && rowObj.length) {
                            result = this._wijgrid._view()._getRowInfo(rowObj);
                        }
                    }
                }

                return result;
            };

            /** @ignore */
            cellInfo.prototype.rowIndex = function (value) {
                if (!arguments.length) {
                    return this._ri;
                }

                this._ri = value;
            };

            /** Returns the table cell element corresponding to this object.
            * @example
            * var domCell = cellInfoObj.tableCell();
            * @returns {HTMLTableCellElement} The table cell element corresponding to this object.
            */
            cellInfo.prototype.tableCell = function () {
                if (this._wijgrid && this._isValid()) {
                    if (!this._virtualize || this._isRendered()) {
                        return this._wijgrid._view().getCell(this.cellIndexAbs(), this.rowIndexAbs());
                    }
                }

                return null;
            };

            /** @ignore */
            cellInfo.prototype.value = function (value /*opt*/ ) {
                var column, rowInfo, colVal;

                if (this._wijgrid && this._isValid()) {
                    rowInfo = this.row();

                    if (rowInfo.type & 2 /* data */) {
                        column = this.column();

                        if (arguments.length === 0) {
                            colVal = this._wijgrid.mDataViewWrapper.getValue(rowInfo.data, column.dataKey);
                            return this._wijgrid.parse(column, colVal);
                        } else {
                            // validation
                            value = this._wijgrid.parse(column, value);

                            if ((value === null && column.valueRequired) || ((wijmo.grid.getDataType(column) !== "string") && _grid.isNaN(value))) {
                                throw "invalid value";
                            }

                            // update dataView
                            this._wijgrid.mDataViewWrapper.setValue(rowInfo.dataItemIndex, column.dataKey, value);

                            // keep sketchTable values in sync (to avoid issues during virtual scrolling)
                            var sketchRow = this._wijgrid.mSketchTable.row(this.rowIndex());
                            var sketchCell = sketchRow.cell(column.leavesIdx);
                            sketchCell.value = value;
                        }
                    }
                }
            };

            /** @ignore */
            cellInfo.prototype.toString = function () {
                return this.cellIndex() + ":" + this.rowIndex();
            };

            // internal
            cellInfo.prototype._clip = function (range, absolute) {
                if (typeof absolute === "undefined") { absolute = false; }
                var flag = false, val;

                if (absolute) {
                    if (this.cellIndexAbs() < (val = range.topLeft().cellIndexAbs())) {
                        flag = true;
                        this._ci = range.topLeft().cellIndex();
                    }

                    if (this.cellIndexAbs() > (val = range.bottomRight().cellIndexAbs())) {
                        flag = true;
                        this._ci = range.bottomRight().cellIndex();
                    }

                    if (this.rowIndexAbs() < (val = range.topLeft().rowIndexAbs())) {
                        flag = true;
                        this._ri = range.topLeft().rowIndex();
                    }

                    if (this.rowIndexAbs() > (val = range.bottomRight().rowIndexAbs())) {
                        flag = true;
                        this._ri = range.bottomRight().rowIndex();
                    }
                } else {
                    if (this.cellIndex() < (val = range.topLeft().cellIndex())) {
                        flag = true;
                        this._ci = val;
                    }

                    if (this.cellIndex() > (val = range.bottomRight().cellIndex())) {
                        flag = true;
                        this._ci = val;
                    }

                    if (this.rowIndex() < (val = range.topLeft().rowIndex())) {
                        flag = true;
                        this._ri = val;
                    }

                    if (this.rowIndex() > (val = range.bottomRight().rowIndex())) {
                        flag = true;
                        this._ri = val;
                    }
                }

                return flag;
            };

            cellInfo.prototype._clone = function () {
                return new wijmo.grid.cellInfo(this.cellIndex(), this.rowIndex(), this._wijgrid, false, this._virtualize);
            };

            cellInfo.prototype._isValid = function () {
                return this.cellIndex() >= 0 && this.rowIndex() >= 0;
            };

            cellInfo.prototype._isRowRendered = function () {
                var view;

                if (this._wijgrid && (view = this._wijgrid._view()) && this._isValid()) {
                    var bodyIndex = view._isRowRendered(this.rowIndex());
                    return (bodyIndex >= 0);
                }

                return false;
            };

            cellInfo.prototype._isRendered = function () {
                var view;

                if (this._wijgrid && (view = this._wijgrid._view()) && this._isValid()) {
                    if (this.columnInst()._isRendered()) {
                        var bodyIndex = view._isRowRendered(this.rowIndex());
                        return (bodyIndex >= 0);
                    }
                }

                return false;
            };

            cellInfo.prototype._isEdit = function (value) {
                var tableCell = null, marker = wijmo.grid.wijgrid.CSS.editedCellMarker;

                if (this._isValid()) {
                    try  {
                        tableCell = this.tableCell();
                    } catch (e) {
                    }
                }

                if (!arguments.length) {
                    if (tableCell) {
                        return $(tableCell).hasClass(marker);
                    }

                    return this.__isEdit;
                } else {
                    if (tableCell) {
                        $(tableCell)[value ? "addClass" : "removeClass"](marker);
                    }

                    var grid = this._wijgrid;

                    // add or remove the row header's icon
                    if (grid && this._wijgrid._showRowHeader() && this._isRowRendered()) {
                        var row = this.row(), container = $(row.$rows[0].cells[0]).children("div." + wijmo.grid.wijgrid.CSS.cellContainer);

                        if (value) {
                            container.empty().append($("<div>&nbsp;</div>").addClass(grid.options.wijCSS.icon + " " + grid.options.wijCSS.iconPencil));
                        } else {
                            container.html("&nbsp;"); // remove icon-pencil
                        }
                    }

                    this.__isEdit = value;
                }
            };

            cellInfo.prototype._setGridView = function (value) {
                this._wijgrid = value;
            };
            cellInfo.outsideValue = new cellInfo(-1, -1, null);
            return cellInfo;
        })();
        _grid.cellInfo = cellInfo;

        /** An object that specifies a range of cells determined by two cells. */
        var cellInfoRange = (function () {
            /** Creates an object that specifies a range of cells determined by two cells. Normally you do not need to use this method.
            * @example
            * var range = wijmo.grid.cellInfoRange(new wijmo.grid.cellInfo(0, 0), new wijmo.grid.cellInfo(0, 0));
            * @param {wijmo.grid.cellInfo} topLeft Object that represents the top left cell of the range.
            * @param {wijmo.grid.cellInfo} bottomRight Object that represents the bottom right cell of the range.
            * @returns {wijmo.grid.cellInfoRange} Object that specifies a range of cells determined by two cells.
            */
            function cellInfoRange(topLeft, bottomRight) {
                if (!topLeft || !bottomRight) {
                    throw "invalid arguments";
                }

                this._topLeft = topLeft._clone();
                this._bottomRight = bottomRight._clone();
            }
            /** Gets the object that represents the bottom right cell of the range.
            * @example
            * var cellInfoObj = range.bottomRight();
            * @returns {wijmo.grid.cellInfo} The object that represents the bottom right cell of the range.
            */
            cellInfoRange.prototype.bottomRight = function () {
                return this._bottomRight;
            };

            /** Compares the current range with a specified range and indicates whether they are identical.
            * @example
            * var isEqual = range1.isEqual(range2);
            * @param {wijmo.grid.cellInfoRange} range Range to compare.
            * @returns True if the ranges are identical, otherwise false.
            */
            cellInfoRange.prototype.isEqual = function (range) {
                return (range && this._topLeft.isEqual(range.topLeft()) && this._bottomRight.isEqual(range.bottomRight()));
            };

            /** Gets the object that represents the top left cell of the range.
            * @example
            * var cellInfoObj = range.topLeft();
            * @returns {wijmo.grid.cellInfo} The object that represents the top left cell of the range.
            */
            cellInfoRange.prototype.topLeft = function () {
                return this._topLeft;
            };

            /** @ignore */
            cellInfoRange.prototype.toString = function () {
                return this._topLeft.toString() + " - " + this._bottomRight.toString();
            };

            // public *
            // internal
            cellInfoRange.prototype._isIntersect = function (range) {
                var rangeH, thisH, rangeW, thisW;

                if (range) {
                    rangeH = range.bottomRight().rowIndex() - range.topLeft().rowIndex() + 1;
                    thisH = this._bottomRight.rowIndex() - this._topLeft.rowIndex() + 1;

                    if ((range.topLeft().rowIndex() + rangeH) - this._topLeft.rowIndex() < rangeH + thisH) {
                        rangeW = range.bottomRight().cellIndex() - range.topLeft().cellIndex() + 1;
                        thisW = this._bottomRight.cellIndex() - this._topLeft.cellIndex() + 1;

                        return ((range.topLeft().cellIndex() + rangeW) - this._topLeft.cellIndex() < rangeW + thisW);
                    }
                }

                return false;
            };

            cellInfoRange.prototype._isValid = function () {
                return this._topLeft._isValid() && this._bottomRight._isValid();
            };

            cellInfoRange.prototype._clip = function (clipBy, absolute) {
                if (typeof absolute === "undefined") { absolute = false; }
                var a = this._topLeft._clip(clipBy, absolute);
                var b = this._bottomRight._clip(clipBy, absolute);

                return a || b;
            };

            cellInfoRange.prototype._clone = function () {
                return new cellInfoRange(this._topLeft._clone(), this._bottomRight._clone());
            };

            cellInfoRange.prototype._containsCellInfo = function (info) {
                return (info && info.cellIndex() >= this._topLeft.cellIndex() && info.cellIndex() <= this._bottomRight.cellIndex() && info.rowIndex() >= this._topLeft.rowIndex() && info.rowIndex() <= this._bottomRight.rowIndex());
            };

            cellInfoRange.prototype._containsCellRange = function (range) {
                return (range && this._containsCellInfo(range.topLeft()) && this._containsCellInfo(range.bottomRight()));
            };

            cellInfoRange.prototype._extend = function (mode, borders) {
                if (mode === 1 /* column */) {
                    this._topLeft.rowIndex(borders.topLeft().rowIndex());
                    this._bottomRight.rowIndex(borders.bottomRight().rowIndex());
                } else {
                    if (mode === 2 /* row */) {
                        this._topLeft.cellIndex(borders.topLeft().cellIndex());
                        this._bottomRight.cellIndex(borders.bottomRight().cellIndex());
                    }
                }

                return this;
            };

            cellInfoRange.prototype._normalize = function () {
                var x0 = this._topLeft.cellIndex(), y0 = this._topLeft.rowIndex(), x1 = this._bottomRight.cellIndex(), y1 = this._bottomRight.rowIndex();

                this._topLeft.cellIndex(Math.min(x0, x1));
                this._topLeft.rowIndex(Math.min(y0, y1));

                this._bottomRight.cellIndex(Math.max(x0, x1));
                this._bottomRight.rowIndex(Math.max(y0, y1));
            };

            cellInfoRange.prototype._height = function () {
                return this._bottomRight.rowIndex() - this._topLeft.rowIndex();
            };

            cellInfoRange.prototype._width = function () {
                return this._bottomRight.cellIndex() - this._topLeft.cellIndex();
            };
            return cellInfoRange;
        })();
        _grid.cellInfoRange = cellInfoRange;

        // * compatibility: export members to the $.wijmo.wijgrid "namespace" *
        $.extend($.wijmo.wijgrid, {
            cellInfo: wijmo.grid.cellInfo,
            cellInfoRange: wijmo.grid.cellInfoRange
        });
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts" />
/// <reference path="wijgrid.ts" />
/// <reference path="misc.ts" />
/// <reference path="rowAccessor.ts" />
/// <reference path="filterOperators.ts" />
/// <reference path="htmlTableAccessor.ts" />
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var baseView = (function () {
            function baseView(wijgrid, renderBounds) {
                this.mIsRendered = false;
                this.mIsLiveUpdate = false;
                this._sizesAdjCache = {
                    th: 0,
                    col: 0,
                    subTable: 0
                };
                if (!wijgrid) {
                    throw "'wijgrid' must be specified";
                }

                this._wijgrid = wijgrid;
                this._bounds = renderBounds;

                this._wijgrid.element.addClass(wijmo.grid.wijgrid.CSS.table).addClass(this._wijgrid.options.wijCSS.wijgridTable);
            }
            baseView.prototype.dispose = function () {
                this.toggleDOMSelection(true);
                this._wijgrid.element.removeClass(wijmo.grid.wijgrid.CSS.table).removeClass(this._wijgrid.options.wijCSS.wijgridTable);
            };

            baseView.prototype.currentRenderableColumns = function (value) {
                if (arguments.length) {
                    this.mCurrentRenderableColumns = value;
                }

                return this.mCurrentRenderableColumns;
            };

            baseView.prototype.ensureDisabledState = function () {
                var disabledClass = "wijmo-wijgrid" + "-disabled " + this._wijgrid.options.wijCSS.stateDisabled, disabled = this._wijgrid.options.disabled, self = this;

                $.each(this.subTables(), function (key, table) {
                    if (table) {
                        var $table = $(table.element());

                        if (disabled) {
                            $table.addClass(disabledClass);
                            self._wijgrid._setAttr($table, "aria-disabled", true);
                        } else {
                            $table.removeClass(disabledClass);
                            self._wijgrid._setAttr($table, "aria-disabled", false);
                        }
                    }
                });
            };

            //ensureWidth(index: number, value, oldValue) {
            //	this._setColumnWidth(index, value);
            //}
            baseView.prototype.ensureHeight = function (rowIndex) {
            };

            baseView.prototype.getScrollValue = function () {
                return null;
            };

            baseView.prototype.getVisibleAreaBounds = function (client) {
                throw "not implemented";
            };

            baseView.prototype.getVisibleContentAreaBounds = function () {
                throw "not implemented";
            };

            baseView.prototype.getFixedAreaVisibleBounds = function () {
                throw "not implemented";
            };

            baseView.prototype.isLiveUpdate = function () {
                return this.mIsLiveUpdate;
            };

            baseView.prototype.isRendered = function () {
                return this.mIsRendered;
            };

            baseView.prototype.render = function (live) {
                this.mIsLiveUpdate = live;

                if (!live) {
                    this._provideRealColumnsWidth();
                }

                this._ensureRenderBounds();
                this._ensureRenderHBounds();

                this._preRender();

                this._renderContent();

                this._postRender();

                this.mIsLiveUpdate = false;
            };

            baseView.prototype.toggleDOMSelection = function (enable) {
                $.each(this.subTables(), function (index, table) {
                    (new wijmo.grid.domSelection(table.element())).toggleSelection(enable);
                });

                (new wijmo.grid.domSelection(this._wijgrid.mOuterDiv)).toggleSelection(enable);
            };

            baseView.prototype.updateSplits = function (scrollValue) {
                throw "not implemented";
            };

            baseView.prototype.updateSplitsLive = function () {
                throw "not implemented";
            };

            baseView.prototype.getInlineTotalWidth = function () {
                throw "not implemented";
            };

            // public **
            // ** DOMTable abstraction
            // ** rows accessors
            baseView.prototype.bodyRows = function () {
                if (!this._bodyRowsAccessor) {
                    if (!this.isRendered()) {
                        throw "not rendered yet";
                    }

                    this._bodyRowsAccessor = new wijmo.grid.rowAccessor(this, 2 /* body */, 0, 0);
                }

                return this._bodyRowsAccessor;
            };

            baseView.prototype.filterRow = function () {
                if (this._wijgrid.options.showFilter) {
                    if (!this.isRendered()) {
                        throw "not rendered yet";
                    }

                    var accessor = new wijmo.grid.rowAccessor(this, 1 /* head */, 0, 0);
                    return accessor.item(accessor.length() - 1);
                }

                return null;
            };

            baseView.prototype.footerRow = function () {
                if (this._wijgrid.options.showFooter) {
                    if (!this.isRendered()) {
                        throw "not rendered yet";
                    }

                    var accessor = new wijmo.grid.rowAccessor(this, 3 /* foot */, 0, 0);
                    return accessor.item(0);
                }
            };

            baseView.prototype.headerRows = function () {
                var bottomOffset;

                if (!this._headerRowsAccessor) {
                    if (!this.isRendered()) {
                        throw "not rendered yet";
                    }

                    bottomOffset = this._wijgrid.options.showFilter ? 1 : 0;
                    this._headerRowsAccessor = new wijmo.grid.rowAccessor(this, 1 /* head */, 0, bottomOffset);
                }

                return this._headerRowsAccessor;
            };

            baseView.prototype.rows = function () {
                if (!this._rowsAccessor) {
                    if (!this.isRendered()) {
                        throw "not rendered yet";
                    }

                    this._rowsAccessor = new wijmo.grid.rowAccessor(this, 0 /* table */, 0, 0);
                }

                return this._rowsAccessor;
            };

            // rows accessors **
            baseView.prototype.focusableElement = function () {
                return this._wijgrid.mOuterDiv;
            };

            baseView.prototype.forEachColumnCell = function (columnIndex, callback, param) {
                throw "not implemented";
            };

            baseView.prototype.forEachRowCell = function (rowIndex, callback, param) {
                throw "not implemented";
            };

            // important: only body cells can be virtualized
            baseView.prototype.getAbsoluteCellInfo = function (domCell, virtualize) {
                throw "not implemented";
            };

            baseView.prototype.getAbsoluteCellIndex = function (domCell) {
                throw "not implemented";
            };

            baseView.prototype.getAbsoluteRowIndex = function (domRow) {
                throw "not implemented";
            };

            baseView.prototype.getCell = function (absColIdx, absRowIdx) {
                throw "not implemented";
            };

            baseView.prototype.getColumnIndex = function (domCell) {
                throw "not implemented";
            };

            baseView.prototype.getHeaderCell = function (absColIdx) {
                throw "not implemented";
            };

            // [col, col]
            baseView.prototype.getJoinedCols = function (columnIndex) {
                throw "not implemented";
            };

            // [row, row]
            baseView.prototype.getJoinedRows = function (rowIndex, rowScope) {
                throw "not implemented";
            };

            // [table, table, offset:number]
            baseView.prototype.getJoinedTables = function (byColumn, index) {
                throw "not implemented";
            };

            baseView.prototype.subTables = function () {
                throw "not implemented";
            };

            // DOMTable abstraction **
            // ** private abstract
            baseView.prototype._getMappedScrollMode = function () {
                var scrollMode = this._wijgrid._lgGetScrollMode(), vScrollBarVisibility = "auto", hScrollBarVisibility = "auto";

                switch (scrollMode) {
                    case "horizontal":
                        vScrollBarVisibility = "hidden";
                        hScrollBarVisibility = "visible";
                        break;

                    case "vertical":
                        vScrollBarVisibility = "visible";
                        hScrollBarVisibility = "hidden";
                        break;

                    case "both":
                        vScrollBarVisibility = "visible";
                        hScrollBarVisibility = "visible";
                        break;
                }

                return { vScrollBarVisibility: vScrollBarVisibility, hScrollBarVisibility: hScrollBarVisibility };
            };

            // ** rendering
            baseView.prototype._postRender = function () {
                this.mIsRendered = true;

                if (this.isLiveUpdate()) {
                    this.updateSplitsLive();
                    return;
                }

                this.ensureDisabledState();

                // ** cache some values to speedup sizes manipulation (using IE especially) **
                // reset
                this._sizesAdjCache.col = 0;
                this._sizesAdjCache.th = 0;
                this._sizesAdjCache.subTable = 0;

                // set a new values
                var leaves = this._wijgrid._visibleLeaves();
                if (leaves.length > 0) {
                    // note: we assume that the margins, paddings and borders are common to all of the th\ col elements.
                    var th = this.getHeaderCell(0), cols = this.getJoinedCols(0);

                    if (th) {
                        this._sizesAdjCache.th = $(th).leftBorderWidth() + $(th).rightBorderWidth();
                    }

                    if (cols && cols.length) {
                        this._sizesAdjCache.col = $(cols[0]).leftBorderWidth() + $(cols[0]).rightBorderWidth();
                    }
                }

                var subTable = this.subTables()[0];
                this._sizesAdjCache.subTable = $(subTable.element()).leftBorderWidth() + $(subTable.element()).rightBorderWidth();
            };

            baseView.prototype._preRender = function () {
                this.mIsRendered = false;

                var renderedIndex = 0, leaves = this._wijgrid._renderedLeaves();

                // re-calculate rendered indicies
                $.each(this._wijgrid._leaves(), function (i, column) {
                    if (column._isRendered()) {
                        column.options.renderedIndex = renderedIndex++;
                        leaves.push(column);
                    } else {
                        column.options.renderedIndex = -1;
                    }
                });
            };

            baseView.prototype._ensureRenderBounds = function () {
                var dataRange = this._wijgrid._getDataCellsRange(0 /* sketch */);

                // render all items of the sketchTable
                this._bounds.start = 0;
                this._bounds.end = dataRange.bottomRight().rowIndex();
            };

            baseView.prototype._ensureRenderHBounds = function () {
                // render all columns
                var renderableColumns = this._wijgrid._renderableColumnsRange();

                renderableColumns.clear();
                renderableColumns.add(0, this._wijgrid._leaves().length - 1);

                this.currentRenderableColumns(renderableColumns);
            };

            baseView.prototype._provideRealColumnsWidth = function () {
                var _this = this;
                var leaves = this._wijgrid._visibleLeaves(), outerDiv = this._wijgrid.mOuterDiv, hvScrolling = this._wijgrid._allowHVirtualScrolling();

                $.each(leaves, function (index, column) {
                    var width = column.options.width;

                    if (!width && (width !== 0) && hvScrolling) {
                        width = _this._wijgrid.options.scrollingSettings.virtualizationSettings.columnWidth;
                    }

                    if (width || (width === 0)) {
                        width = wijmo.grid.isPercentage(width) ? outerDiv.width() * parseFloat(width) / 100 : parseFloat(width);

                        column.options._realWidth = width;
                    }
                });
            };

            baseView.prototype._renderContent = function () {
                this._renderCOLS();
                this._renderHeader();

                if (this._wijgrid.options.showFilter) {
                    this._renderFilter();
                }

                this._renderBody();

                if (this._wijgrid.options.showFooter) {
                    this._renderFooter();
                }
            };

            baseView.prototype._renderCOLS = function () {
                //var visibleLeaves = this._wijgrid._visibleLeaves();
                var _this = this;
                //for (var i = 0, len = visibleLeaves.length; i < len; i++) {
                //	var leaf = visibleLeaves[i],
                //		domCol = this._createCol(leaf, i);
                //	this._appendCol(domCol, leaf, i);
                //}
                var leaves = this._wijgrid._leaves();
                this.currentRenderableColumns().forEachIndex(function (i) {
                    var leaf = leaves[i];

                    if (leaf._visible()) {
                        var domCol = _this._createCol(leaf, i);
                        _this._appendCol(domCol, leaf, i);
                    }
                });
            };

            baseView.prototype._renderHeader = function () {
                var rt = wijmo.grid.rowType, rs = wijmo.grid.renderState, cht = this._wijgrid._columnsHeadersTable(), i, height, rowInfo;

                if (cht && (height = cht.length)) {
                    for (i = 0; i < height; i++) {
                        rowInfo = this._insertEmptyRow(1 /* header */, 1 /* rendering */, i, -1, -1, -1, undefined, {});
                        this._renderRow(rowInfo, null, cht[i]);
                    }
                }
            };

            baseView.prototype._renderFilter = function () {
                var rowInfo = this._insertEmptyRow(8 /* filter */, 1 /* rendering */, -1, -1, -1, -1, undefined, {});
                this._renderRow(rowInfo, this._wijgrid._leaves(), null);
            };

            baseView.prototype._renderBody = function () {
                var rs = wijmo.grid.renderState, leaves = this._wijgrid._leaves(), sketch = this._wijgrid.mSketchTable, dataRowIndex = -1, virtualDataItemIndexBase = 0, cnt = 0, dataOffset = this._wijgrid.mDataOffset;

                // render rows
                var self = this;

                if (this._bounds.start >= 0 && this._bounds.end >= 0) {
                    this._wijgrid._renderableRowsRange().forEachIndex(this._bounds.start, this._bounds.end - this._bounds.start + 1, function (idx) {
                        var sketchRow = sketch.row(idx - dataOffset), isDataRow = sketchRow.isDataRow(), groupKey = sketchRow.groupByValue, rowInfo = self._insertEmptyRow(sketchRow.rowType, 1 /* rendering */, cnt++, isDataRow ? ++dataRowIndex : -1, sketchRow.dataItemIndex(), sketchRow.dataItemIndex(virtualDataItemIndexBase), groupKey, sketchRow.extInfo);

                        self._renderRow(rowInfo, leaves, sketchRow);
                    });
                }
            };

            baseView.prototype._renderFooter = function () {
                var rowInfo = this._insertEmptyRow(64 /* footer */, 1 /* rendering */, -1, -1, -1, -1, undefined, {});
                this._renderRow(rowInfo, this._wijgrid._leaves(), null);
            };

            baseView.prototype._insertEmptyRow = function (rowType, renderState, sectionRowIndex, dataRowIndex, dataItemIndex, virtualDataItemIndex, groupByValue, extInfo) {
                var domRow = this._wijgrid._onViewInsertEmptyRow.apply(this._wijgrid, arguments), domRowArr = this._insertRow(rowType, sectionRowIndex, domRow);

                if (renderState === undefined) {
                    renderState = 1 /* rendering */;
                }

                return this._createRowInfo(domRowArr, rowType, renderState, sectionRowIndex, dataRowIndex, dataItemIndex, virtualDataItemIndex, groupByValue, extInfo);
            };

            baseView.prototype._createEmptyCell = function (rowInfo, dataCellIndex, column) {
                var rt = wijmo.grid.rowType, domCell = this._wijgrid._onViewCreateEmptyCell.apply(this._wijgrid, arguments);

                return this._createCell(rowInfo.type, domCell);
            };

            // override
            baseView.prototype._insertRow = function (rowType, sectionRowIndex, domRow /* optional, used by c1gridview to clone rows of the original table */ ) {
                throw "not implemented";
            };

            baseView.prototype._createCell = function (rowType, domCell /* optional, used by c1gridview to clone cells of the original table */ ) {
                var rt = wijmo.grid.rowType, innerContainer;

                if (!domCell) {
                    if (rowType === 1 /* header */) {
                        domCell = document.createElement("th");
                    } else {
                        domCell = document.createElement("td");
                    }
                }

                if (rowType !== 8 /* filter */) {
                    // * analogue of domCell.wrapInner("<div class=\"wijmo-wijgrid-innercell\"></div>")
                    innerContainer = document.createElement("div");
                    innerContainer.className = wijmo.grid.wijgrid.CSS.cellContainer + " " + this._wijgrid.options.wijCSS.wijgridCellContainer;

                    if (domCell.firstChild) {
                        while (domCell.firstChild) {
                            innerContainer.appendChild(domCell.firstChild);
                        }
                    }

                    domCell.appendChild(innerContainer);
                }

                return $(domCell);
            };

            baseView.prototype._appendCell = function (rowInfo, cellIndex, $cell) {
                throw "not implemented";
            };

            baseView.prototype._createCol = function (column, visibleIdx) {
                throw "not implemented";
            };

            baseView.prototype._appendCol = function (domCol, column, visibleIdx) {
                throw "not implemented";
            };

            // item is a sketchRow or IColumnHeaderInfo[] if row is the header row.
            baseView.prototype._renderRow = function (rowInfo, leaves, item) {
                var $rt = wijmo.grid.rowType, rowAttr, rowStyle;

                switch (rowInfo.type) {
                    case 8 /* filter */:
                        this._renderFilterRow(rowInfo, leaves);
                        break;

                    case 64 /* footer */:
                        this._renderFooterRow(rowInfo, leaves);
                        break;

                    case 1 /* header */:
                        this._renderHeaderRow(rowInfo, item);
                        break;

                    case 2 /* data */:
                    case 2 /* data */ | 4 /* dataAlt */:
                        this._renderDataRow(rowInfo, leaves, item);
                        rowAttr = item.attr();
                        rowStyle = item.style();
                        break;

                    case 2 /* data */ | 256 /* detail */:
                    case 128 /* emptyDataRow */:
                    case 16 /* groupHeader */:
                    case 32 /* groupFooter */:
                        this._renderSpannedRow(rowInfo, leaves, item);
                        rowAttr = item.attr();
                        rowStyle = item.style();
                        break;

                    default:
                        throw "unknown rowType";
                }

                this._rowRendered(rowInfo, rowAttr, rowStyle);
            };

            baseView.prototype._renderCell = function (rowInfo, cellIndex, value, useHtml, leaf, state, attr, style) {
                var $cell = this._createEmptyCell(rowInfo, leaf.options.dataIndex, leaf);
                var $container = (rowInfo.type === 8 /* filter */) ? $cell : $($cell[0].firstChild);

                this._appendCell(rowInfo, cellIndex, $cell);

                if (useHtml) {
                    $container.html(value !== undefined ? value : "&nbsp;");
                } else {
                    this._wijgrid.mCellFormatter.format($cell, cellIndex, $container, leaf, value, rowInfo);
                }

                this._cellRendered(rowInfo, $cell, $container, cellIndex, leaf, state, attr, style);
            };

            baseView.prototype._renderDataRow = function (rowInfo, leaves, sketchRow) {
                var _this = this;
                //for (var i = 0, len = leaves.length; i < len; i++) {
                this.currentRenderableColumns().forEachIndex(function (i) {
                    var leaf = leaves[i];

                    if (leaf._visible()) {
                        var cell = sketchRow.cell(i), attr = cell.attr(), style = cell.style(), value, state = rowInfo.state;

                        if (leaf instanceof grid.c1field) {
                            if (!cell || !cell.visible()) {
                                //continue;
                                return;
                            }

                            value = _this._wijgrid.toStr(leaf.options, cell.value);
                            attr = cell.attr();
                            style = cell.style();
                        } else {
                            // unbound column
                            value = null;
                        }

                        if (leaf.options.readOnly) {
                            state &= ~16 /* editing */;
                        }

                        _this._renderCell(rowInfo, i, value, false, leaf, state, attr, style);
                    }
                });
            };

            baseView.prototype._renderFilterRow = function (rowInfo, leaves) {
                var _this = this;
                //for (var i = 0, len = leaves.length; i < len; i++) {
                this.currentRenderableColumns().forEachIndex(function (i) {
                    var leaf = leaves[i];

                    if (leaf._visible()) {
                        _this._renderCell(rowInfo, i, wijmo.grid.filterHelper.getSingleValue(leaf.options.filterValue), false, leaf, rowInfo.state);
                    }
                });
            };

            baseView.prototype._renderFooterRow = function (rowInfo, leaves) {
                var _this = this;
                //for (var i = 0, len = leaves.length; i < len; i++) {
                this.currentRenderableColumns().forEachIndex(function (i) {
                    var leaf = leaves[i];

                    if (leaf._visible()) {
                        _this._renderCell(rowInfo, i, "", false, leaves[i], rowInfo.state);
                    }
                });
            };

            baseView.prototype._renderHeaderRow = function (rowInfo, item) {
                var _this = this;
                var thX = 0, thX2 = -this._wijgrid._virtualLeaves().length;

                //for (var i = 0, len = item.length; i < len; i++) {
                this.currentRenderableColumns().forEachIndex(function (i) {
                    var headerInfo = item[i];

                    if (headerInfo.column) {
                        headerInfo.column.thX2 = thX2++;

                        if (headerInfo.column.parentVis) {
                            headerInfo.column.thX = thX++;
                            headerInfo.column.thY = rowInfo.sectionRowIndex;

                            var instance = _this._wijgrid._findInstance(headerInfo.column);

                            _this._renderCell(rowInfo, i, headerInfo.column.headerText, false, instance, rowInfo.state, { colSpan: headerInfo.colSpan, rowSpan: headerInfo.rowSpan });
                        }
                    }
                });
            };

            baseView.prototype._renderSpannedRow = function (rowInfo, leaves, sketchRow) {
                var len = Math.min(leaves.length, sketchRow.cellCount());

                for (var i = 0; i < len; i++) {
                    var leaf = leaves[i];
                    var useHTML = rowInfo.type === 128 /* emptyDataRow */;
                    var cell = sketchRow.cell(i);

                    this._renderCell(rowInfo, i, cell.html, useHTML, leaf, rowInfo.state, cell.attr(), cell.style());
                }
            };

            baseView.prototype._cellRendered = function (row, cell, container, cellIndex, column, cellState, attr, style) {
                this._wijgrid.mCellStyleFormatter.format(cell, cellIndex, column, row, cellState, attr, style);

                this._changeCellRenderState(cell, cellState, false);

                this._wijgrid._onViewCellRendered(cell, container, row, cellIndex, column);

                column._cellRendered(cell, container, row);
            };

            baseView.prototype._rowRendered = function (rowInfo, rowAttr, rowStyle) {
                this._wijgrid.mRowStyleFormatter.format(rowInfo, rowAttr, rowStyle);

                // change renderState AND associate rowInfo object with DOMRow
                //this._changeRowRenderState(rowInfo, $.wijmo.wijgrid.renderState.rendering, false);
                rowInfo.state &= ~1 /* rendering */;
                this._setRowInfo(rowInfo.$rows, rowInfo);

                this._wijgrid._onViewRowRendered(rowInfo, rowAttr, rowStyle);
            };

            baseView.prototype._makeRowEditable = function (rowInfo) {
                var leaves = this._wijgrid._visibleLeaves(), cellEditor = new wijmo.grid.cellEditorHelper();

                if (leaves) {
                    for (var i = 0; i < leaves.length; i++) {
                        var column = leaves[i];

                        if ((column instanceof grid.c1field) && !column.options.readOnly) {
                            var $cell = rowInfo.$rows.children("td, th").eq(i);

                            if ($cell.length) {
                                var cellInfo = this.getAbsoluteCellInfo($cell[0], true);

                                this._changeCellRenderState($cell, 16 /* editing */, cellEditor.cellEditStart(this._wijgrid, cellInfo, null)); // add or remove editing state depends on cellEditStart result.
                            }
                        }
                    }
                }
            };

            baseView.prototype._isBodyRow = function (rowInfo) {
                var $rt = wijmo.grid.rowType, type = rowInfo.type;

                return ((type & 2 /* data */) || (type === 16 /* groupHeader */) || (type === 32 /* groupFooter */) || (type === 128 /* emptyDataRow */));
            };

            baseView.prototype._changeRowRenderState = function (rowInfo, state, combine) {
                if (combine) {
                    rowInfo.state |= state;
                } else {
                    rowInfo.state &= ~state;
                }

                this._setRowInfo(rowInfo.$rows, rowInfo);
            };

            baseView.prototype._changeCellRenderState = function ($obj, state, combine) {
                var $dp = wijmo.grid.dataPrefix, prefix = this._wijgrid.mDataPrefix, prevState = $dp($obj, prefix, "renderState");

                if (combine) {
                    state = prevState | state;
                    $dp($obj, prefix, "renderState", state);
                } else {
                    state = prevState & ~state;
                    $dp($obj, prefix, "renderState", state);
                }

                return state;
            };

            // rendering **
            // ** sizing
            baseView.prototype._resetWidth = function () {
                var _this = this;
                var leaves = this._wijgrid._visibleLeaves();

                $.each(leaves, function (index, column) {
                    _this._setColumnWidth(column, null);
                });

                $.each(this.subTables(), function (index, table) {
                    table.element().style.width = "100%";
                });
            };

            baseView.prototype._adjustWidthArray = function (maxWidthArray, minWidthArray, expectedWidth, ensureColumnsPxWidth) {
                var maxWidth = this._sumWidthArray(maxWidthArray), minWidth = this._sumWidthArray(minWidthArray), widthArray = [], adjustWidth, expandCount = 0, expandWidth, remainingWidth, bFirst = true;

                if (maxWidth <= expectedWidth) {
                    $.extend(true, widthArray, maxWidthArray);
                    if (maxWidth === expectedWidth || ensureColumnsPxWidth) {
                        return widthArray;
                    } else {
                        adjustWidth = expectedWidth - maxWidth;
                    }
                } else {
                    $.extend(true, widthArray, minWidthArray);
                    if (minWidth >= expectedWidth) {
                        return widthArray;
                    } else {
                        adjustWidth = expectedWidth - minWidth;
                    }
                }

                $.each(widthArray, function (index, colWidth) {
                    if (!colWidth.real) {
                        expandCount++;
                    }
                });

                if (expandCount !== 0) {
                    expandWidth = Math.floor(adjustWidth / expandCount);
                    remainingWidth = adjustWidth - expandWidth * expandCount;
                    $.each(widthArray, function (index, colWidth) {
                        if (!colWidth.real) {
                            colWidth.width += expandWidth;
                            if (bFirst) {
                                colWidth.width += remainingWidth;
                                bFirst = false;
                            }
                        }
                    });
                }

                return widthArray;
            };

            baseView.prototype._getColumnWidth = function (index) {
                var column = this._wijgrid._visibleLeaves()[index];

                if (column instanceof grid.c1rowheaderfield) {
                    return { width: grid.c1rowheaderfield.COLUMN_WIDTH, real: true };
                } else if (column.options._realWidth !== undefined && column._strictWidthMode()) {
                    return { width: column.options._realWidth, real: true, realPercent: wijmo.grid.isPercentage(column.options.width) };
                } else {
                    var maxW = 0, joinedTables = this.getJoinedTables(true, index), relIdx = joinedTables[2];

                    for (var i = 0; i < 2; i++) {
                        var table = joinedTables[i];

                        if (table !== null) {
                            var rows = table.element().rows, row = null, len = rows.length;

                            if (len > 0) {
                                for (var j = len - 1; j >= 0; j--) {
                                    if (rows[j].cells.length === table.width()) {
                                        row = rows[j];

                                        if (row.style.display !== "none") {
                                            break;
                                        }
                                    }
                                }

                                if (row) {
                                    var cell = row.cells[relIdx];
                                    maxW = Math.max(maxW, $(cell).outerWidth());
                                }
                            }
                        }
                    }

                    return { width: maxW, real: false };
                }
            };

            // px: null to reset.
            baseView.prototype._setColumnWidth = function (column, px) {
                var _this = this;
                if (!column || !column._isRendered()) {
                    return;
                }

                var visibleIndex = column.options.visLeavesIdx, th = this.getHeaderCell(visibleIndex), cols = this.getJoinedCols(visibleIndex), value;

                if (px || px === 0) {
                    if (th) {
                        value = px - this._sizesAdjCache.th;
                        if (value < 0) {
                            value = 0;
                        }

                        th.style.width = value + "px";
                    }

                    $.each(cols, function (i, col) {
                        if (col) {
                            value = px - _this._sizesAdjCache.col;
                            if (value < 0) {
                                value = 0;
                            }

                            col.style.width = value + "px";
                        }
                    });
                } else {
                    if (th) {
                        th.style.width = "";
                    }

                    $.each(cols, function (index, col) {
                        if (col) {
                            col.style.width = "";
                        }
                    });
                }
            };

            baseView.prototype._setTableWidth = function (subTables, expectedWidth, expandColumnWidth, expandColumn) {
                var after, diff, self = this;

                $.each(subTables, function (index, table) {
                    //table.css("table-layout", "fixed").setOutWidth(expectedWidth); // very slow in IE9
                    table[0].style.tableLayout = "fixed";
                    table[0].style.width = (expectedWidth - self._sizesAdjCache.subTable) + "px";
                });

                after = subTables[0].outerWidth();
                diff = after - expectedWidth;
                if (diff !== 0) {
                    this._setColumnWidth(expandColumn, expandColumnWidth - diff);
                }
            };

            baseView.prototype._sumWidthArray = function (widthArray, startIndex, endIndex) {
                var result = 0, leaves = this._wijgrid._visibleLeaves();

                $.each(widthArray, function (index, colWidth) {
                    if (startIndex !== undefined && endIndex !== undefined && (index < startIndex || index > endIndex || (startIndex >= 0 && !leaves[index]._isRendered()))) {
                        return true;
                    }
                    result += colWidth.width;
                });

                return result;
            };

            // sizing **
            // private abstract **
            baseView.prototype._clearBody = function () {
                $.each(this.subTables(), function (key, table) {
                    table.clearSection(2);
                });
            };

            baseView.prototype._rebuildOffsets = function () {
                $.each(this.subTables(), function (key, table) {
                    table.rebuildOffsets();
                });
            };

            baseView.prototype._removeBodyRow = function (sectionRowIndex, changeOffsets) {
                if (typeof changeOffsets === "undefined") { changeOffsets = true; }
                var $rt = wijmo.grid.rowType, rows = this._wijgrid._rows(), i, len, rowInfo, absRowIdx;

                if ((sectionRowIndex >= 0) && (sectionRowIndex < (len = rows.length()))) {
                    // remove DOMRows
                    rowInfo = this._getRowInfo(rows.item(sectionRowIndex), false);
                    absRowIdx = this.getAbsoluteRowIndex(rowInfo.$rows[0]);
                    rowInfo.$rows.remove();

                    // ** update offsets
                    if (changeOffsets) {
                        var joinedTables = this.getJoinedTables(false, absRowIdx), ta;

                        if (ta = joinedTables[0]) {
                            ta.removeOffset(joinedTables[2]);
                        }

                        if (ta = joinedTables[1]) {
                            ta.removeOffset(joinedTables[2]);
                        }
                    }
                    // update offsets **
                }
            };

            baseView.prototype._insertBodyRow = function (sketchRow, sectionRowIndex, dataItemIndex, virtualDataItemIndex) {
                var leaves = this._wijgrid._leaves(), $rt = wijmo.grid.rowType, view = this._wijgrid._view(), rows = this._wijgrid._rows(), len = rows.length(), isDataRow = sketchRow.isDataRow(), rowInfo, absRowIdx;

                if (sectionRowIndex < 0 || sectionRowIndex >= len || (!sectionRowIndex && sectionRowIndex !== 0)) {
                    sectionRowIndex = len; // append
                }

                rowInfo = this._insertEmptyRow(sketchRow.rowType, sketchRow.renderState, sectionRowIndex, -1, dataItemIndex, virtualDataItemIndex, sketchRow.groupByValue, sketchRow.extInfo);

                this._renderRow(rowInfo, leaves, sketchRow);

                // ** update offsets
                absRowIdx = this.getAbsoluteRowIndex(rowInfo.$rows[0]);

                var joinedTables = this.getJoinedTables(false, absRowIdx), ta;

                if (ta = joinedTables[0]) {
                    ta.insertOffset(absRowIdx);
                }

                if (ta = joinedTables[1]) {
                    ta.insertOffset(absRowIdx);
                }

                // update offsets **
                return rowInfo;
            };

            baseView.prototype._setRowInfo = function (obj, row) {
                if (!obj) {
                    return;
                }

                var tmpRows = row.$rows, tmpData = row.data;

                row.$rows = undefined;
                row.data = undefined;

                wijmo.grid.dataPrefix(obj, this._wijgrid.mDataPrefix, "rowInfo", row);

                row.$rows = tmpRows;
                row.data = tmpData;
            };

            baseView.prototype._getRowInfo = function (rowObj, retrieveDataItem) {
                if (typeof retrieveDataItem === "undefined") { retrieveDataItem = true; }
                var wijgrid = this._wijgrid, $rows = rowObj[1] ? $(rowObj) : $(rowObj[0]), rowInfo = wijmo.grid.dataPrefix($rows, wijgrid.mDataPrefix, "rowInfo"), tmp;

                // add $rows property
                rowInfo.$rows = $rows;

                // set data property
                if (retrieveDataItem && (rowInfo.dataItemIndex >= 0) && (rowInfo.type & 2 /* data */)) {
                    try  {
                        rowInfo.data = wijgrid._getDataItem(rowInfo.dataItemIndex);
                    } catch (ex) {
                        rowInfo.data = null; // underlying data item was removed?
                    }
                }

                return rowInfo;
            };

            baseView.prototype._getRowInfoBySketchRowIndex = function (sketchIndex, retrieveDataItem) {
                if (typeof retrieveDataItem === "undefined") { retrieveDataItem = true; }
                if (sketchIndex >= 0) {
                    var renderedRowIndex = this._isRowRendered(sketchIndex);

                    if (renderedRowIndex >= 0) {
                        var rowObj = this.bodyRows().item(renderedRowIndex);

                        if (rowObj) {
                            return this._getRowInfo(rowObj, retrieveDataItem);
                        }
                    } else {
                        // detached row
                        var sketchRow = this._wijgrid.mSketchTable.row(sketchIndex), rowInfo = null;

                        if (sketchRow) {
                            rowInfo = sketchRow.getRowInfo();

                            // set data property
                            if (retrieveDataItem && (rowInfo.dataItemIndex >= 0) && sketchRow.isDataRow()) {
                                try  {
                                    rowInfo.data = this._wijgrid._getDataItem(rowInfo.dataItemIndex);
                                } catch (ex) {
                                    rowInfo.data = null; // underlying data item was removed?
                                }
                            }
                        }

                        return rowInfo;
                    }
                }

                return null;
            };

            baseView.prototype._createRowInfo = function (row, type, state, sectionRowIndex, dataRowIndex, dataItemIndex, virtualDataItemIndex, groupByValue, extInfo) {
                var tmp, rowInfo = {
                    type: type,
                    state: state,
                    sectionRowIndex: sectionRowIndex,
                    dataRowIndex: dataRowIndex,
                    dataItemIndex: dataItemIndex,
                    virtualDataItemIndex: virtualDataItemIndex,
                    $rows: row ? $(row) : null,
                    _extInfo: extInfo
                };

                if (groupByValue !== undefined) {
                    rowInfo.groupByValue = groupByValue;
                }

                // set data property
                if ((dataItemIndex >= 0) && (type & 2 /* data */)) {
                    rowInfo.data = this._wijgrid._getDataItem(dataItemIndex);
                }

                return rowInfo;
            };

            // returns tbody row index or -1
            baseView.prototype._isRowRendered = function (sketchRowIndex) {
                var visibleIndex = this._wijgrid._renderableRowsRange().getRenderedIndex(sketchRowIndex);

                if (visibleIndex >= 0) {
                    if (visibleIndex >= this._bounds.start && visibleIndex <= this._bounds.end) {
                        return visibleIndex - this._bounds.start;
                    }
                }

                return -1;
            };
            return baseView;
        })();
        grid.baseView = baseView;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts" />
/// <reference path="wijgrid.ts" />
/// <reference path="misc.ts" />
/// <reference path="baseView.ts" />
/// <reference path="htmlTableAccessor.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var flatView = (function (_super) {
            __extends(flatView, _super);
            function flatView(wijgrid, renderBounds) {
                _super.call(this, wijgrid, renderBounds);
                this._dataTable = null;
                this._contentArea = null;
            }
            //ensureWidth(index: number, value, oldValue) {
            //	var $table = $(this._dataTable.element()),
            //		tableWidth = $table.width() + value - oldValue;
            //	super.ensureWidth(index, value, oldValue);
            //	this._setTableWidth([$table], tableWidth, value, index);
            //}
            flatView.prototype.getVisibleAreaBounds = function (client) {
                var bounds = wijmo.grid.bounds(this._dataTable.element(), client);

                return bounds;
            };

            flatView.prototype.getVisibleContentAreaBounds = function () {
                return this.getVisibleAreaBounds();
            };

            flatView.prototype.updateSplits = function (scrollValue) {
                var _this = this;
                var self = this, wijgrid = this._wijgrid, o = wijgrid.options, gridElement = wijgrid.element, maxWidthArray = [], minWidthArray = [], resultWidthArray = [], visibleLeaves = wijgrid._visibleLeaves(), outerDiv = wijgrid.mOuterDiv, outerWidth, expandIndex;

                gridElement.css({
                    "table-layout": "",
                    "width": "auto"
                });

                // read column widths.
                $.each(visibleLeaves, function (index, leaf) {
                    if (leaf.options._realWidth !== undefined) {
                        _this._setColumnWidth(leaf, leaf.options._realWidth);
                    }

                    maxWidthArray.push(_this._getColumnWidth(index));
                });

                gridElement.css("width", "1px");

                $.each(visibleLeaves, function (index, leaf) {
                    minWidthArray.push(self._getColumnWidth(index));
                });

                outerWidth = outerDiv.width(); // using width() instead of innerWidth() to exclude padding.
                resultWidthArray = this._adjustWidthArray(maxWidthArray, minWidthArray, outerWidth, o.ensureColumnsPxWidth);

                $.each(resultWidthArray, function (index, colWidth) {
                    var leaf = visibleLeaves[index];

                    if (leaf.options._realWidth !== undefined && leaf._strictWidthMode()) {
                        //delete leaf.options._realWidth;
                        return;
                    }

                    self._setColumnWidth(leaf, colWidth.width);
                });

                gridElement.css("table-layout", "fixed");

                expandIndex = resultWidthArray.length - 1;
                if (expandIndex !== -1) {
                    var delta = outerDiv.width() - outerWidth;
                    resultWidthArray[expandIndex].width += delta;

                    this._setTableWidth([gridElement], this._sumWidthArray(resultWidthArray, 0, expandIndex), resultWidthArray[expandIndex].width, visibleLeaves[expandIndex]);
                }
            };

            flatView.prototype.getInlineTotalWidth = function () {
                var table = this._dataTable.element(), width = table.style.width;

                if (width && (width !== "auto")) {
                    return width;
                }

                return "";
            };

            // public **
            // ** DOMTable abstraction
            flatView.prototype.forEachColumnCell = function (columnIndex, callback, param) {
                return this._dataTable.forEachColumnCell(columnIndex, callback, param);
            };

            flatView.prototype.forEachRowCell = function (rowIndex, callback, param) {
                return this._dataTable.forEachRowCell(rowIndex, callback, param);
            };

            flatView.prototype.getAbsoluteCellInfo = function (domCell, virtualize) {
                return new wijmo.grid.cellInfo(this.getColumnIndex(domCell), domCell.parentNode.rowIndex, this._wijgrid, true, virtualize);
            };

            flatView.prototype.getAbsoluteCellIndex = function (domCell) {
                return this.getColumnIndex(domCell);
            };

            flatView.prototype.getAbsoluteRowIndex = function (domRow) {
                return domRow.rowIndex;
            };

            flatView.prototype.getCell = function (absColIdx, absRowIdx) {
                var cellIdx = this._dataTable.getCellIdx(absColIdx, absRowIdx), rowObj;

                if (cellIdx >= 0) {
                    rowObj = this.getJoinedRows(absRowIdx, 0);
                    if (rowObj[0]) {
                        return rowObj[0].cells[cellIdx];
                    }
                }

                return null;
            };

            flatView.prototype.getColumnIndex = function (domCell) {
                return this._dataTable.getColumnIdx(domCell);
            };

            flatView.prototype.getHeaderCell = function (absColIdx) {
                var leaf = this._wijgrid._visibleLeaves()[absColIdx], headerRow;

                if (leaf && (headerRow = this._wijgrid._headerRows())) {
                    return wijmo.grid.rowAccessor.getCell(headerRow.item(leaf.options.thY), leaf.options.thX);
                }

                return null;
            };

            flatView.prototype.getJoinedCols = function (columnIndex) {
                var $colGroup = $(this._dataTable.element()).find("> colgroup");

                if ($colGroup.length) {
                    if (columnIndex < $colGroup[0].childNodes.length) {
                        return [$colGroup[0].childNodes[columnIndex], null];
                    }
                }

                return [null, null];
            };

            flatView.prototype.getJoinedRows = function (rowIndex, rowScope) {
                return [this._dataTable.getSectionRow(rowIndex, rowScope), null];
            };

            flatView.prototype.getJoinedTables = function (byColumn, index) {
                return [this._dataTable, null, index];
            };

            flatView.prototype.subTables = function () {
                return [this._dataTable];
            };

            // DOMTable abstraction **
            // ** private abstract
            //  ** render
            flatView.prototype._preRender = function () {
                _super.prototype._preRender.call(this);
                this._dataTable = new wijmo.grid.htmlTableAccessor(this._wijgrid.element[0], true, true, true); // skip offsets, ensure tbody + colgroup
            };

            flatView.prototype._postRender = function () {
                this._wijgrid.element.find("> tbody").addClass(this._wijgrid.options.wijCSS.content);

                this._dataTable = new wijmo.grid.htmlTableAccessor(this._wijgrid.element[0]); // create with offsets

                this._wijgrid._setAttr(this._wijgrid.element, {
                    role: "grid",
                    cellpadding: "0",
                    border: "0",
                    cellspacing: "0"
                });

                this._wijgrid.element.css("border-collapse", "separate");

                _super.prototype._postRender.call(this);
            };

            flatView.prototype._insertRow = function (rowType, sectionRowIndex, domRow /* optional, used by c1gridview to clone rows of the original table */ ) {
                var $rt = wijmo.grid.rowType, tableSection;

                switch (rowType) {
                    case 1 /* header */:
                    case 8 /* filter */:
                        tableSection = this._dataTable.ensureTHead();
                        break;

                    case 64 /* footer */:
                        tableSection = this._dataTable.ensureTFoot();
                        break;

                    default:
                        tableSection = this._dataTable.ensureTBody();
                }

                if (domRow) {
                    // append only
                    return [tableSection.appendChild(domRow)];
                } else {
                    if (sectionRowIndex > tableSection.rows.length) {
                        sectionRowIndex = -1;
                    }

                    return [tableSection.insertRow(sectionRowIndex)];
                }
            };

            flatView.prototype._rowRendered = function (rowInfo, rowAttr, rowStyle) {
                var domRow = rowInfo.$rows[0];

                if (!domRow.cells.length && this._isBodyRow(rowInfo)) {
                    domRow.parentNode.removeChild(domRow);
                } else {
                    _super.prototype._rowRendered.call(this, rowInfo, rowAttr, rowStyle);
                }
            };

            flatView.prototype._appendCell = function (rowInfo, cellIndex, $cell) {
                rowInfo.$rows[0].appendChild($cell[0]);
                //rowInfo.$rows.append($cell);
            };

            flatView.prototype._createCol = function (column, visibleIdx) {
                return [document.createElement("col")];
            };

            flatView.prototype._appendCol = function (domCol, column, visibleIdx) {
                this._dataTable.appendCol(domCol[0]);
            };
            return flatView;
        })(grid.baseView);
        grid.flatView = flatView;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="../../../wijsuperpanel/jquery.wijmo.wijsuperpanel.ts" />
/// <reference path="../../../wijlist/jquery.wijmo.wijlist.ts" />
/// <reference path="interfaces.ts" />
/// <reference path="wijgrid.ts" />
/// <reference path="misc.ts" />
/// <reference path="baseView.ts" />
/// <reference path="uiVirtualScroller.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var fixedView = (function (_super) {
            __extends(fixedView, _super);
            function fixedView(wijgrid, renderBounds) {
                _super.call(this, wijgrid, renderBounds);
                this._verScrollBarSize = wijmo.grid.getSuperPanelScrollBarSize();
                this._viewTables = {};
                this._splitAreas = {};
                this._superPanelElementsCache = {};
                this.mHVSOffset = 0;

                this.element = wijgrid.element; // table element

                this._staticDataRowIndex = wijgrid._getStaticIndex(true);
                this._staticRowIndex = wijgrid._getRealStaticRowIndex();
                this._staticColumnIndex = wijgrid._getRealStaticColumnIndex();
                this._staticAllColumnIndex = (this._staticColumnIndex === -1) ? -1 : wijgrid._visibleLeaves()[this._staticColumnIndex].options.leavesIdx;

                this._mouseWheelHandler = $.proxy(this._onMouseWheel, this);
            }
            fixedView.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                this._wijgrid.mOuterDiv.unbind("mousewheel", this._mouseWheelHandler);
            };

            //ensureWidth(index, value, oldValue) {
            //	var wijgrid = this._wijgrid,
            //		staticColumnIndex = this._staticColumnIndex,
            //		bWest = index <= staticColumnIndex,
            //		$tableNW = $(this._viewTables.nw.element()),
            //		$tableNE = $(this._viewTables.ne.element()),
            //		$tableSW = $(this._viewTables.sw.element()),
            //		$tableSE = $(this._viewTables.se.element()),
            //		tableArray = bWest ? [$tableNW, $tableSW] : [$tableNE, $tableSE],
            //		tableWidth = (bWest ? $tableNW.width() : $tableNE.width()) + value - oldValue,
            //		scrollValue = this.getScrollValue();
            //	this._destroySuperPanel();
            //	super.ensureWidth(index, value, oldValue);
            //	this._setTableWidth(tableArray, tableWidth, value, index);
            //	try {
            //		if (staticColumnIndex >= 0) {
            //			wijgrid.mSplitDistanceX = $tableNW[0].offsetWidth;
            //		} else {
            //			wijgrid.mSplitDistanceX = 0;
            //		}
            //	} catch (ex) { }
            //	this._updateSplitAreaBounds(0);
            //	this._adjustRowsHeights();
            //	try {
            //		if (this._staticRowIndex >= 0) {
            //			wijgrid.mSplitDistanceY = Math.max($tableNW[0].offsetHeight, $tableNE[0].offsetHeight);
            //		} else {
            //			wijgrid.mSplitDistanceY = 0;
            //		}
            //	} catch (ex) { }
            //	this._updateSplitAreaBounds(1);
            //	this.refreshPanel(scrollValue);
            //	var frozener = wijgrid._UIFrozener();
            //	if (frozener) {
            //		frozener.refresh();
            //	}
            //}
            fixedView.prototype._resetWidth = function () {
                this._getSuperPanelContentWrapper().width("");

                _super.prototype._resetWidth.apply(this, arguments);
            };

            fixedView.prototype.ensureHeight = function (rowIndex) {
                var wijgrid = this._wijgrid, $tableNW = $(this._viewTables.nw.element()), $tableNE = $(this._viewTables.ne.element()), $tableSW = $(this._viewTables.sw.element()), $tableSE = $(this._viewTables.se.element()), scrollValue = this.getScrollValue();

                this._destroySuperPanel();

                if (arguments.length > 0) {
                    var rowObjsArray = this.getJoinedRows(rowIndex, 2);
                    this._setRowHeight(rowObjsArray, this._getRowHeight(rowObjsArray));
                }

                $tableSE.css("height", "");
                $tableSW.css("height", "");

                var maxHeight = Math.max($tableSE.height(), $tableSW.height());

                $tableSE.height(maxHeight);
                $tableSW.height(maxHeight);

                try  {
                    if (this._staticRowIndex >= 0) {
                        wijgrid.mSplitDistanceY = Math.max($tableNW[0].offsetHeight, $tableNE[0].offsetHeight);
                    } else {
                        wijgrid.mSplitDistanceY = 0;
                    }
                } catch (ex) {
                }

                this._updateSplitAreaBounds(1);

                this.refreshPanel(scrollValue);

                var frozener = wijgrid._UIFrozener();
                if (frozener) {
                    frozener.refresh();
                }
            };

            fixedView.prototype.getScrollValue = function () {
                var superPanelObj = this._getSuperPanel();

                return superPanelObj ? { x: superPanelObj.options.hScroller.scrollValue, y: superPanelObj.options.vScroller.scrollValue } : null;
            };

            fixedView.prototype.getVisibleAreaBounds = function (client) {
                var bounds = this._isNativeSuperPanel() ? wijmo.grid.bounds(this._getSuperPanelStateContainer(), client) : wijmo.grid.bounds(this._getSuperPanelContentWrapper(), client);

                if (!bounds) {
                    bounds = wijmo.grid.bounds(this._wijgrid.mOuterDiv, client);
                }

                return bounds;
            };

            fixedView.prototype.getVisibleContentAreaBounds = function () {
                var visibleBounds = this.getVisibleAreaBounds(true), b00 = wijmo.grid.bounds(this._viewTables.nw.element()) || {}, b01 = wijmo.grid.bounds(this._viewTables.ne.element()) || {}, b10 = wijmo.grid.bounds(this._viewTables.sw.element()) || {}, b11 = wijmo.grid.bounds(this._viewTables.se.element()) || {}, contentBounds = {
                    top: visibleBounds.top,
                    left: visibleBounds.left,
                    width: Math.max(b00.width + b01.width, b10.width + b11.width),
                    height: Math.max(b00.height + b10.height, b01.height + b11.height)
                };

                // truncate
                contentBounds.width = Math.min(visibleBounds.width, contentBounds.width);
                contentBounds.height = Math.min(visibleBounds.height, contentBounds.height);

                return contentBounds;
            };

            fixedView.prototype.getRowAreaHeight = function () {
                var container = this._getSuperPanelContentWrapper();
                if (container.length == 0) {
                    container = this._wijgrid.mOuterDiv;
                }
                var height = container.height();

                // subtract top fixed area
                var topFixedAreaHeight = this._wijgrid.mSplitDistanceY;
                if (topFixedAreaHeight) {
                    height -= topFixedAreaHeight;
                }

                // subtract footer height
                if (this._wijgrid.options.showFooter) {
                    var footer, footerHeight = (this.isRendered() && (footer = this.footerRow())) ? $(footer).height() : this.getDefaultRowHeight();

                    height -= footerHeight;
                }

                return height;
            };

            fixedView.prototype.getVirtualPageSize = function (upper) {
                if (typeof upper === "undefined") { upper = true; }
                var rowHeight = this._wijgrid.mRowOuterHeight && (this._wijgrid.mRowOuterHeight > 0) ? this._wijgrid.mRowOuterHeight : this.getDefaultRowHeight();

                var vPageSize = this.getRowAreaHeight() / rowHeight;

                return upper ? Math.ceil(vPageSize) : Math.floor(vPageSize);
            };

            fixedView.prototype.getFixedAreaVisibleBounds = function () {
                var bounds = this.getVisibleAreaBounds(), neBounds = wijmo.grid.bounds(this._splitAreas.ne), nwBounds = wijmo.grid.bounds(this._splitAreas.nw), horBounds = null, verBounds = null;

                if (neBounds.height || nwBounds.height) {
                    horBounds = {
                        left: bounds.left,
                        top: bounds.top,
                        width: bounds.width,
                        height: Math.min(neBounds.height || nwBounds.height, bounds.height)
                    };
                }

                if (nwBounds.width) {
                    verBounds = {
                        //left: bounds.left,
                        left: nwBounds.left,
                        top: bounds.top,
                        width: Math.min(nwBounds.width, bounds.width),
                        height: bounds.height
                    };
                }

                return [horBounds, verBounds];
            };

            fixedView.prototype.getDefaultRowHeight = function () {
                return this._wijgrid._lgGetRowHeight();
            };

            fixedView.prototype.refreshPanel = function (scrollValue) {
                var self = this, wijgrid = this._wijgrid, options = wijgrid.options, panelModes = this._getMappedScrollMode(), firstRow = wijgrid._rows().item(0), recreateSuperPanel = false;

                wijgrid.mRowOuterHeight = firstRow && firstRow[0] ? $(firstRow[0]).outerHeight() : this.getDefaultRowHeight();

                if (!this._scroller.data("wijmo-wijsuperpanel")) {
                    recreateSuperPanel = true;

                    if (this._wijgrid._allowVirtualScrolling()) {
                        this.vsUI = new wijmo.grid.uiVirtualScroller(wijgrid, this._splitAreas.se, wijgrid.mSplitDistanceY, wijgrid.mRowOuterHeight);
                    }

                    if (scrollValue && (panelModes.hScrollBarVisibility === "hidden")) {
                        scrollValue.x = 0;
                    }

                    this._scroller.wijsuperpanel({
                        disabled: wijgrid.options.disabled,
                        scroll: $.proxy(this._onScroll, this),
                        bubbleScrollingEvent: true,
                        customScrolling: this._wijgrid._allowVVirtualScrolling(),
                        vScroller: { scrollBarVisibility: panelModes.vScrollBarVisibility, "scrollValue": scrollValue ? scrollValue.y : null },
                        hScroller: { scrollBarVisibility: panelModes.hScrollBarVisibility, "scrollValue": scrollValue ? scrollValue.x : null },
                        hScrollerActivating: $.proxy(this._onHScrollerActivating, this)
                    });

                    // wijsuperpanel.hScrollerActivating event is not raised if touch environment is used, simulate it.
                    if (this._isNativeSuperPanel()) {
                        var container = this._getSuperPanelStateContainer();
                        if (container.length && (container[0].offsetHeight !== container[0].clientHeight)) {
                            this._onHScrollerActivating(null, { contentLength: container[0].clientHeight });
                        }
                    }

                    if (!this._isNativeSuperPanel()) {
                        this._getSuperPanelContentWrapper().bind("scroll", function (e) {
                            // #50496: when a overflowing div contains focusable elements it will be scrolled automatically to fit the focused element into view.
                            // Prevent native scrolling to avoid disalignment of the fixed and unfixed areas in IE\ Chrome when partially visible cell gets focus.
                            e.target.scrollLeft = 0;
                            e.target.scrollTop = 0;

                            e.preventDefault();
                        });
                    }

                    if (this._wijgrid._allowVirtualScrolling()) {
                        this.vsUI.attach(this._scroller);
                    }
                } else {
                    this._scroller.wijsuperpanel("paintPanel");
                }

                var needVBar = this._testNeedVBar(wijgrid.mOuterDiv, wijgrid.element, $(this._viewTables.ne.element()), wijgrid._lgGetScrollMode(), wijgrid.mAutoHeight), excludeVBarWidth = needVBar && !this._testAutohiddenScrollbars();

                var contentWidth = this.getVisibleContentAreaBounds().width;
                this._splitAreas.ne.width(contentWidth - wijgrid.mSplitDistanceX);

                if (recreateSuperPanel && (scrollValue && scrollValue.x)) {
                    // synchronize unfixed areas: NE and SE (#47277)
                    var hPxValue = this._scroller.wijsuperpanel("scrollValueToPx", scrollValue.x, "h");
                    this._setFixedAreaPosition(this._splitAreas.ne, "h", hPxValue, null, true);
                }

                if (wijgrid._lgGetStaticColumnsAlignment() === "right") {
                    this._splitAreas.nw.css({
                        "left": "",
                        "right": excludeVBarWidth ? this._verScrollBarSize : 0
                    });

                    this._splitAreas.sw.css({
                        "left": "",
                        "right": excludeVBarWidth ? this._verScrollBarSize : 0
                    });
                }

                this._scroller.find(".wijmo-wijsuperpanel-hbarcontainer, .wijmo-wijsuperpanel-vbarcontainer").css("zIndex", 5);

                if (this._wijgrid._allowVVirtualScrolling()) {
                    // re-render
                    this._wijgrid._handleVerticalVirtualScrolling(this._bounds.start);
                }
            };

            fixedView.prototype.getLeftOffset = function (column) {
                var offset = 0, leaves = this._wijgrid._leaves();

                for (var i = 0; i < leaves.length; i++) {
                    var leaf = leaves[i];

                    if (column.options.leavesIdx <= leaf.options.visLeavesIdx) {
                        break;
                    }

                    if (leaf._visible()) {
                        offset += leaf.options._realWidth;
                    }
                }

                return offset;
            };

            fixedView.prototype.scrollTo = function (cell, callback, info) {
                var grid = this._wijgrid, virtualRow = null, virtualColumn = null;

                if (grid._allowVVirtualScrolling()) {
                    var rowIndex = grid._renderableRowsRange().getRenderedIndex(cell.rowIndex()), vab, rowsLen = grid._rows().length(), $rows, handleLastRow = (rowIndex - grid._viewPortBounds().start >= rowsLen - 1);

                    // determine whether virtual scrolling is needed or not
                    if (!cell._isRowRendered() || (handleLastRow && (vab = this.getVisibleAreaBounds(true)) && ($rows = cell.row().$rows) && ($rows.offset().top + $rows.outerHeight() > vab.top + vab.height))) {
                        virtualRow = rowIndex;

                        if (cell.rowIndex() > info.changingEventArgs.oldRowIndex) {
                            virtualRow -= rowsLen - 1;
                            virtualRow += 1;
                        }
                    }
                }

                if (grid._allowHVirtualScrolling() && !cell._isRendered()) {
                    virtualColumn = cell.columnInst();
                }

                var superPanelObj = this._getSuperPanel();

                if (virtualRow !== null || virtualColumn) {
                    info.setFocus = true; // to listen key events
                    info.hasFocusedChild = false;
                }

                if (virtualRow !== null) {
                    if (superPanelObj) {
                        this.vsUI.scrollToRow(virtualRow, function () {
                            callback();
                        });
                    } else {
                        callback();
                    }
                } else {
                    var $tableCell = virtualColumn ? null : $(cell.tableCell()), resultLeft = null, resultTop = null;

                    if (superPanelObj && (virtualColumn || $tableCell.is(":visible"))) {
                        var content = superPanelObj.getContentElement(), wrapper = content.parent(), el, area, staticRowIndex = grid._getStaticIndex(true), staticColIndex = grid._getStaticIndex(false), currentRowIndex = cell.rowIndex(), currentCellIndex = cell.cellIndex();

                        if (this._isNativeSuperPanel()) {
                            if (virtualColumn) {
                                el = {
                                    left: this.getLeftOffset(virtualColumn), top: 0, height: 0, width: virtualColumn.options._realWidth
                                };
                            } else {
                                el = {
                                    left: $tableCell[0].offsetLeft,
                                    top: $tableCell[0].offsetTop,
                                    height: $tableCell.outerHeight(),
                                    width: $tableCell.outerWidth()
                                };
                            }

                            area = {
                                left: wrapper[0].scrollLeft,
                                top: wrapper[0].scrollTop,
                                height: wrapper[0].clientHeight - grid.mSplitDistanceY,
                                width: wrapper[0].clientWidth - grid.mSplitDistanceX
                            };
                        } else {
                            if (virtualColumn) {
                                el = {
                                    left: this.getLeftOffset(virtualColumn), top: 0, height: 0, width: virtualColumn.options._realWidth
                                };
                            } else {
                                var elementPosition = $tableCell.position();

                                el = {
                                    left: grid._allowHVirtualScrolling() ? this.getLeftOffset(cell.columnInst()) : elementPosition.left,
                                    top: elementPosition.top,
                                    height: $tableCell.outerHeight(),
                                    width: $tableCell.outerWidth()
                                };
                            }

                            area = {
                                left: -(parseInt((content.css("left") + "").replace("px", ""), 10) || 0),
                                top: -(parseInt((content.css("top") + "").replace("px", ""), 10) || 0),
                                height: wrapper.outerHeight() - grid.mSplitDistanceY,
                                width: wrapper.outerWidth() - grid.mSplitDistanceX
                            };
                        }

                        if (currentRowIndex <= staticRowIndex) {
                            if (currentCellIndex <= staticColIndex) {
                                resultLeft = 0;
                                resultTop = 0;
                            } else {
                                el.left += area.left;
                                if (el.left + el.width > area.left + area.width) {
                                    area.left = resultLeft = el.left + el.width - area.width;
                                }
                                if (el.left < area.left) {
                                    resultLeft = el.left;
                                }
                                resultTop = 0;
                            }
                        } else {
                            if (currentCellIndex <= staticColIndex) {
                                // elementTop += visibleTop;
                                el.top += this._splitAreas.sw.scrollTop();

                                if (el.top + el.height > area.top + area.height) {
                                    area.top = resultTop = el.top + el.height - area.height;
                                }

                                if (el.top < area.top) {
                                    resultTop = el.top;
                                }

                                resultLeft = 0;
                            } else {
                                el.left -= grid.mSplitDistanceX;
                                if (el.top + el.height > area.top + area.height) {
                                    area.top = resultTop = el.top + el.height - area.height;
                                }

                                if (el.left + el.width > area.left + area.width) {
                                    area.left = resultLeft = el.left + el.width - area.width;
                                }

                                if (el.top < area.top) {
                                    resultTop = el.top;
                                }

                                if (el.left < area.left) {
                                    resultLeft = el.left;
                                }
                            }
                        }

                        if (resultLeft !== null) {
                            resultTop = null;

                            if (virtualColumn) {
                                this.vsUI.scrollToColumn(virtualColumn, resultLeft, function () {
                                    callback();
                                });
                                return;
                            } else {
                                superPanelObj.hScrollTo(resultLeft);
                            }
                        }

                        if (resultTop !== null) {
                            superPanelObj.vScrollTo(resultTop);
                        }
                    }

                    callback();
                }
            };

            fixedView.prototype.updateSplits = function (scrollValue) {
                var _this = this;
                var grid = this._wijgrid, minWidths = [], maxWidths = [], visibleLeaves = grid._visibleLeaves(), se = $(this._viewTables.se.element()), ne = $(this._viewTables.ne.element()), sw = $(this._viewTables.sw.element()), nw = $(this._viewTables.nw.element()), outerDiv = grid.mOuterDiv, hasDataRows = false, strictWidth = this._strictWidthMode(), live = this.isLiveUpdate();

                if (!live) {
                    this._destroySuperPanel();

                    outerDiv.unbind("mousewheel", this._mouseWheelHandler);

                    this._clearNorthTablesHeight();
                }

                // * if there is no data in a table, we must enlarge the table to prevent the width from being 0
                var tBody = (se[0].tBodies && se[0].tBodies[0]);
                if (tBody) {
                    for (var i = 0; i < tBody.rows.length; i++) {
                        if (!$(tBody.rows[i]).hasClass(wijmo.grid.wijgrid.CSS.groupHeaderRow)) {
                            hasDataRows = true;
                            break;
                        }
                    }

                    if (!hasDataRows) {
                        grid.element.css("width", "100%");
                    }
                }

                $.each([se, ne, sw, nw], function (index, table) {
                    table.css({ "table-layout": "", "width": "" });
                });

                $.each(visibleLeaves, function (index, leaf) {
                    if (leaf.options._realWidth !== undefined) {
                        _this._setColumnWidth(leaf, leaf.options._realWidth);
                    }

                    maxWidths.push(_this._getColumnWidth(index));
                });

                $.each([se, ne, sw, nw], function (index, table) {
                    table.css({ "width": "1px" });
                });

                $.each(visibleLeaves, function (index, leaf) {
                    minWidths.push(_this._getColumnWidth(index));
                });

                var viewAreaWidth = outerDiv.width();
                var resultWidths = this._adjustWidthArray(maxWidths, minWidths, viewAreaWidth, strictWidth);
                this.setResultWidth(resultWidths, viewAreaWidth);

                //adjust width if showing vertical scrollbar
                if (this._testNeedVBar(grid.mOuterDiv, se, ne, grid._lgGetScrollMode(), grid.mAutoHeight)) {
                    var recalculate = false;

                    viewAreaWidth -= this._verScrollBarSize;

                    if (strictWidth) {
                        $.each(visibleLeaves, function (index, leaf) {
                            var opt = leaf.options;

                            if (wijmo.grid.isPercentage(opt.width)) {
                                maxWidths[index].width = minWidths[index].width = viewAreaWidth * parseFloat(opt.width) / 100;
                                recalculate = true;
                            }
                        });
                    } else {
                        recalculate = true;
                    }

                    if (recalculate) {
                        resultWidths = this._adjustWidthArray(maxWidths, minWidths, viewAreaWidth, strictWidth);
                        this.setResultWidth(resultWidths, viewAreaWidth);
                    }
                }

                this._setNorthTablesHeight();

                if (this._wijgrid._allowHVirtualScrolling()) {
                    var totalScrollableWidth = this._sumWidthArray(resultWidths);
                    ne.closest(".wijmo-wijgrid-scrollable-content").width(totalScrollableWidth - grid.mSplitDistanceX);
                    se.closest(".wijmo-wijgrid-scrollable-content").width(totalScrollableWidth - grid.mSplitDistanceX);

                    // reset marinLeft otherwise template-wrapper offset will be calculated incorrectly
                    this._viewTables.ne.element().parentElement.style.marginLeft = "";
                    this._viewTables.se.element().parentElement.style.marginLeft = "";
                }

                if (!live) {
                    this.refreshPanel(scrollValue); // refresh super panel after width is set.

                    if (this._wijgrid._allowHVirtualScrolling()) {
                        this._viewTables.ne.element().parentElement.style.marginLeft = this.mHVSOffset + "px";
                        this._viewTables.se.element().parentElement.style.marginLeft = this.mHVSOffset + "px";
                    }

                    outerDiv.bind("mousewheel", $.proxy(this._mouseWheelHandler, this));
                }

                this.mResultWidths = resultWidths;
            };

            fixedView.prototype.updateSplitsLive = function () {
                var _this = this;
                var leaves = this._wijgrid._leaves(), visLeaves = this._wijgrid._visibleLeaves(), renderedColumnsWidth = 0;

                this.currentRenderableColumns().forEachIndex(function (i) {
                    var leaf = leaves[i];

                    if (leaf._isRendered()) {
                        var width = _this.mResultWidths[leaf.options.visLeavesIdx].width;

                        _this._setColumnWidth(leaf, width);

                        renderedColumnsWidth += width;
                    }
                });

                var ne = $(this._viewTables.ne.element()), se = $(this._viewTables.se.element()), last = this.mResultWidths.length - 1;

                this._setTableWidth([ne, se], renderedColumnsWidth, this.mResultWidths[last].width, visLeaves[last]);
                //var hPxValue = this._scroller.wijsuperpanel("scrollValueToPx", this._wijgrid.mScrollingState.x, "h");
                //this._setFixedAreaPosition(this._splitAreas.ne, "h", hPxValue, null, true);
            };

            fixedView.prototype.setResultWidth = function (resultWidths, viewAreaWidth) {
                var _this = this;
                var grid = this._wijgrid, visLeaves = grid._visibleLeaves(), staticColumnIndex = this._staticColumnIndex, strictWidth = this._strictWidthMode(), expandIndex, sum, se = $(this._viewTables.se.element()), ne = $(this._viewTables.ne.element()), sw = $(this._viewTables.sw.element()), nw = $(this._viewTables.nw.element()), live = this.isLiveUpdate();

                $.each(resultWidths, function (index, colWidth) {
                    if (!colWidth.real || colWidth.realPercent) {
                        _this._setColumnWidth(visLeaves[index], colWidth.width);
                    }
                });

                if ((expandIndex = staticColumnIndex) >= 0) {
                    sum = this._sumWidthArray(resultWidths, 0, expandIndex);
                    this._setTableWidth([nw, sw], sum, resultWidths[expandIndex].width, visLeaves[expandIndex]);
                }

                if (!live) {
                    try  {
                        grid.mSplitDistanceX = staticColumnIndex >= 0 ? nw[0].offsetWidth : 0;
                    } catch (ex) {
                    }

                    this._updateSplitAreaBounds(0); //width
                }

                if (!strictWidth) {
                    this._splitAreas.ne.width(viewAreaWidth - grid.mSplitDistanceX);
                }

                if ((expandIndex = resultWidths.length - 1) >= 0) {
                    sum = this._sumWidthArray(resultWidths, staticColumnIndex + 1, expandIndex);
                    this._setTableWidth([ne, se], sum, resultWidths[expandIndex].width, visLeaves[expandIndex]);
                }

                if (!live) {
                    this._adjustRowsHeights();

                    try  {
                        grid.mSplitDistanceY = this._staticRowIndex >= 0 ? Math.max(nw[0].offsetHeight, ne[0].offsetHeight) : 0;
                    } catch (ex) {
                    }

                    this._updateSplitAreaBounds(1); //height
                }
            };

            fixedView.prototype.getInlineTotalWidth = function () {
                if (this._scroller) {
                    var stateContainer = this._getSuperPanelStateContainer();

                    if (stateContainer.length) {
                        var width = stateContainer[0].style.width;

                        if (width && (width !== "auto")) {
                            return width;
                        }
                    }
                }

                return "";
            };

            // public **
            // ** DOMTable abstraction
            fixedView.prototype._clearBody = function () {
                _super.prototype._clearBody.call(this);
            };

            fixedView.prototype.bodyRows = function () {
                var accessor = _super.prototype.bodyRows.call(this);
                return accessor;
            };

            fixedView.prototype.forEachColumnCell = function (columnIndex, callback, param) {
                var joinedTables = this.getJoinedTables(true, columnIndex), relIdx, callbackRes;

                if (joinedTables[0] !== null) {
                    relIdx = joinedTables[2];
                    callbackRes = joinedTables[0].forEachColumnCell(relIdx, callback, param);
                    if (callbackRes !== true) {
                        return callbackRes;
                    }

                    if (joinedTables[1] !== null) {
                        callbackRes = joinedTables[1].forEachColumnCell(relIdx, callback, param);
                        if (callbackRes !== true) {
                            return callbackRes;
                        }
                    }
                }

                return true;
            };

            fixedView.prototype.forEachRowCell = function (rowIndex, callback, param) {
                var joinedTables = this.getJoinedTables(false, rowIndex), table0 = joinedTables[0], table1 = joinedTables[1], relIdx, callbackResult;

                if (table0 !== null) {
                    relIdx = joinedTables[2];
                    if (relIdx < table0.element().rows.length) {
                        callbackResult = table0.forEachRowCell(relIdx, callback, param);
                        if (callbackResult !== true) {
                            return callbackResult;
                        }
                    }

                    if ((table1 !== null) && (relIdx < table1.element().rows.length)) {
                        callbackResult = table1.forEachRowCell(relIdx, callback, param);
                        if (callbackResult !== true) {
                            return callbackResult;
                        }
                    }
                }

                return true;
            };

            fixedView.prototype.getAbsoluteCellInfo = function (domCell, virtualize) {
                return new wijmo.grid.cellInfo(this.getAbsoluteCellIndex(domCell), this.getAbsoluteRowIndex(domCell.parentNode), this._wijgrid, true, virtualize);
            };

            fixedView.prototype.getAbsoluteCellIndex = function (domCell) {
                var index = domCell.cellIndex, table = domCell.parentNode;

                while (table && table.tagName && table.tagName.toLowerCase() !== "table") {
                    table = table.parentNode;
                }

                return (table === this._viewTables.nw.element() || table === this._viewTables.sw.element()) ? index : index + this._staticColumnIndex + 1;
            };

            fixedView.prototype.getAbsoluteRowIndex = function (domRow) {
                var index = domRow.rowIndex, table = domRow.parentNode;

                while (table && table.tagName && table.tagName.toLowerCase() !== "table") {
                    table = table.parentNode;
                }

                return (table === this._viewTables.nw.element() || table === this._viewTables.ne.element()) ? index : index + this._staticRowIndex + 1;
            };

            fixedView.prototype.getCell = function (absColIdx, absRowIdx) {
                var joinedTablesRow = this.getJoinedTables(false, absRowIdx), joinedTablesCol, relRowIdx, relColIdx, table, cellIdx;

                if (joinedTablesRow[0] !== null) {
                    joinedTablesCol = this.getJoinedTables(true, absColIdx);
                    if (joinedTablesCol[0] !== null) {
                        relRowIdx = joinedTablesRow[2];
                        relColIdx = joinedTablesCol[2];

                        table = null;
                        if (joinedTablesRow[1] !== null) {
                            table = (absColIdx === relColIdx) ? joinedTablesRow[0] : joinedTablesRow[1];
                        } else {
                            table = joinedTablesRow[0];
                        }

                        cellIdx = table.getCellIdx(relColIdx, relRowIdx);
                        if (cellIdx >= 0) {
                            return table.element().rows[relRowIdx].cells[cellIdx];
                        }
                    }
                }

                return null;
            };

            fixedView.prototype.getColumnIndex = function (domCell) {
                var owner = null, htmlTable = null, flag = false, colIdx;

                for (owner = domCell.parentNode; owner.tagName.toLowerCase() !== "table"; owner = owner.parentNode) {
                }

                if (owner !== null) {
                    if (owner === this._viewTables.nw.element()) {
                        htmlTable = this._viewTables.nw;
                    } else {
                        if (owner === this._viewTables.ne.element()) {
                            htmlTable = this._viewTables.ne;
                            flag = true;
                        } else {
                            if (owner === this._viewTables.sw.element()) {
                                htmlTable = this._viewTables.sw;
                            } else {
                                if (owner === this._viewTables.se.element()) {
                                    htmlTable = this._viewTables.se;
                                    flag = true;
                                }
                            }
                        }
                    }

                    if (htmlTable !== null) {
                        colIdx = htmlTable.getColumnIdx(domCell);
                        if (flag) {
                            colIdx += this._staticColumnIndex + 1;
                        }

                        return this._wijgrid._renderedLeaves()[colIdx].options.visLeavesIdx;
                        //return colIdx;
                    }
                }

                return -1;
            };

            fixedView.prototype.getHeaderCell = function (absColIdx) {
                var leaf = this._wijgrid._visibleLeaves()[absColIdx], headerRow;

                if (leaf && (headerRow = this._wijgrid._headerRows())) {
                    return wijmo.grid.rowAccessor.getCell(headerRow.item(leaf.options.thY), leaf.options.thX);
                }

                return null;
            };

            fixedView.prototype.getJoinedCols = function (columnIndex) {
                var leaf = this._wijgrid._visibleLeaves()[columnIndex], result = [], joinedTables = this.getJoinedTables(true, leaf.options.renderedIndex), relIndex = joinedTables[2];

                joinedTables.splice(joinedTables.length - 1, 1);
                $.each(joinedTables, function (index, table) {
                    result.push(table ? $(table.element()).find("col")[relIndex] : null);
                });

                return result;
            };

            fixedView.prototype.getJoinedRows = function (rowIndex, rowScope) {
                var row0 = null, row1 = null, table0 = null, table1 = null, fixedRowIdx = this._staticRowIndex, fixedColIdx = this._staticColumnIndex, lastColIdx = this._wijgrid._visibleLeaves().length - 1, lastRowIdx = this._rowsCountRaw() - 1, allRowsFixed = (fixedRowIdx === lastRowIdx), allsRowUnfixed = (fixedRowIdx < 0), rowsFixedSlice = !allRowsFixed && !allsRowUnfixed, sectionLength = 0;

                if (allRowsFixed || rowsFixedSlice) {
                    if (fixedColIdx >= 0 && fixedColIdx < lastColIdx) {
                        table0 = this._viewTables.nw;
                        table1 = this._viewTables.ne;
                    } else {
                        table0 = (fixedColIdx < 0) ? this._viewTables.ne : this._viewTables.nw;
                    }
                    sectionLength = table0.getSectionLength(rowScope);
                    if (rowIndex < sectionLength) {
                        row0 = table0.getSectionRow(rowIndex, rowScope);
                        if (table1 !== null) {
                            row1 = table1.getSectionRow(rowIndex, rowScope);
                        }
                    }
                }

                if (allsRowUnfixed || (rowsFixedSlice && (row0 === null))) {
                    if (!allsRowUnfixed) {
                        rowIndex -= sectionLength;
                    }

                    if (fixedColIdx >= 0 && fixedColIdx < lastColIdx) {
                        table0 = this._viewTables.sw;
                        table1 = this._viewTables.se;
                    } else {
                        table0 = (fixedColIdx < 0) ? this._viewTables.se : this._viewTables.sw;
                    }

                    row0 = table0.getSectionRow(rowIndex, rowScope);

                    if (table1 !== null) {
                        row1 = table1.getSectionRow(rowIndex, rowScope);
                    }
                }

                return (row0 === null && row1 === null) ? null : [row0, row1];
            };

            fixedView.prototype.getJoinedTables = function (byColumn, index) {
                var t0 = null, t1 = null, idx = index, wijgrid = this._wijgrid, fixedRowIdx = this._staticRowIndex, fixedColIdx = this._staticColumnIndex;

                if (byColumn) {
                    if (index <= fixedColIdx) {
                        t0 = this._viewTables.nw;
                        t1 = this._viewTables.sw;
                    } else {
                        t0 = this._viewTables.ne;
                        t1 = this._viewTables.se;

                        idx = idx - (fixedColIdx + 1);
                    }

                    if (fixedRowIdx < 0) {
                        t0 = null;
                    }

                    if (fixedRowIdx === this._rowsCountRaw() - 1) {
                        t1 = null;
                    }
                } else {
                    if (index <= fixedRowIdx) {
                        t0 = this._viewTables.nw;
                        t1 = this._viewTables.ne;
                    } else {
                        t0 = this._viewTables.sw;
                        t1 = this._viewTables.se;

                        idx = idx - (fixedRowIdx + 1);
                    }

                    if (fixedColIdx < 0) {
                        t0 = null;
                    }
                    if (fixedColIdx === wijgrid._leaves().length - 1) {
                        t1 = null;
                    }
                }

                if (t0 === null) {
                    t0 = t1;
                    t1 = null;
                }
                return [t0, t1, idx];
            };

            fixedView.prototype.subTables = function () {
                return [this._viewTables.nw, this._viewTables.ne, this._viewTables.sw, this._viewTables.se];
            };

            // DOMTable abstraction **
            // ** private abstract
            fixedView.prototype._getSuperPanel = function () {
                return this._scroller ? this._scroller.data("wijmo-wijsuperpanel") : null;
            };

            // ** render
            fixedView.prototype._ensureRenderHBounds = function () {
                if (this._wijgrid._allowHVirtualScrolling()) {
                    var renderableColumns = this._wijgrid._renderableColumnsRange();

                    // update global range and calculate left offset
                    this.mHVSOffset = this._getRenderableColumnsBounds(renderableColumns, this._wijgrid.mScrollingState.scrollLeft);

                    // set current range
                    if (this.isLiveUpdate()) {
                        var currentRenderable = new _grid.renderableColumnsCollection();
                        currentRenderable.add(renderableColumns.item(1)); // scrollable (horizontal) area only, ne+se
                        this.currentRenderableColumns(currentRenderable);
                    } else {
                        this.currentRenderableColumns(renderableColumns);
                    }
                } else {
                    _super.prototype._ensureRenderHBounds.call(this); // render all columns
                }
            };

            fixedView.prototype._getRenderableColumnsBounds = function (range, offset) {
                var staticLeafIdx = this._staticAllColumnIndex, fix = { start: -1, end: -1 }, scroll = { start: -1, end: -1 };

                range.clear();
                range.add(fix);
                range.add(scroll);

                if (staticLeafIdx >= 0) {
                    fix.start = 0;
                    fix.end = staticLeafIdx;
                }

                var leaves = this._wijgrid._leaves(), startIdxFound = false, offsetLeft = 0, scrollableAreaWidth = this.getVisibleAreaBounds(true).width, colTotalWidth = 0;

                if (staticLeafIdx >= 0) {
                    for (var i = 0; i <= staticLeafIdx; i++) {
                        var leaf = leaves[i];

                        if (leaf._visible()) {
                            scrollableAreaWidth -= leaf.options._realWidth;
                        }
                    }
                }

                for (var i = staticLeafIdx + 1; i < leaves.length; i++) {
                    var leaf = leaves[i];

                    if (leaf._visible()) {
                        var width = leaves[i].options._realWidth;

                        colTotalWidth += width;

                        if (colTotalWidth <= offset) {
                            offsetLeft = colTotalWidth;
                        }

                        if (!startIdxFound) {
                            if (colTotalWidth - offset > 0) {
                                scroll.start = i;
                                startIdxFound = true;
                            }
                        } else {
                            //if (colTotalWidth - offset >= scrollableAreaWidth) { // overflow, stop
                            //	scroll.end = i;
                            //	break;
                            //}
                            scroll.end = i;
                            if (colTotalWidth - offset >= scrollableAreaWidth) {
                                break;
                            }
                        }
                    }
                }

                if (scroll.end < scroll.start) {
                    scroll.end = scroll.start;
                }

                return offsetLeft;
            };

            fixedView.prototype._ensureRenderBounds = function () {
                if (this._wijgrid._allowVVirtualScrolling()) {
                    var virtualPageSize = this.getVirtualPageSize();

                    this._wijgrid._ensureRenderableBounds(this._bounds);

                    this._bounds.end = this._bounds.start + virtualPageSize - 1;

                    if (this._wijgrid._serverSideVirtualScrolling()) {
                        var delta = (this._bounds.end - this._bounds.start + 1) - this._wijgrid.mSketchTable.count();

                        if (delta > 0) {
                            this._bounds.end -= delta;
                        }
                    } else {
                        if (this._wijgrid.mRenderCounter == 0) {
                            this._bounds.end = this._bounds.start; // render a single row, just to calculate a real height.
                        }
                    }

                    this._wijgrid._ensureRenderableBounds(this._bounds);

                    if (this._isLastItemRendered()) {
                        if (this._canRenderMoreItems()) {
                            virtualPageSize = this.getVirtualPageSize(false); // use floor, don't overlap a visible area
                            this._bounds.start = this._bounds.end - virtualPageSize + 1; // adjust the start position to stick the items to the bottom
                        }

                        this._wijgrid._ensureRenderableBounds(this._bounds);

                        if (this._bounds.start !== this._wijgrid.mScrollingState.index) {
                            this._wijgrid.mScrollingState.index = this._wijgrid.mScrollingState.y = this._bounds.start; //
                        }
                    }
                } else {
                    _super.prototype._ensureRenderBounds.call(this); // render all items
                }
            };

            fixedView.prototype._isLastItemRendered = function () {
                return (this._bounds.start > 0) && (this._bounds.end === this._wijgrid.mSketchTable.count() - 1);
            };

            fixedView.prototype._canRenderMoreItems = function () {
                var virtualPageSize = this.getVirtualPageSize(false), itemsToRender = this._bounds.end - this._bounds.start + 1;

                return itemsToRender < virtualPageSize;
            };

            fixedView.prototype._renderContent = function () {
                _super.prototype._renderContent.call(this);
            };

            fixedView.prototype._preRender = function () {
                _super.prototype._preRender.call(this);

                if (this.isLiveUpdate()) {
                    // clear scrollable (horizontal) sections
                    this._viewTables.ne.clearContent();
                    this._viewTables.se.clearContent();

                    // set offset to wijmo-wijgrid-scrollable-content elements.
                    this._viewTables.ne.element().parentElement.style.marginLeft = this.mHVSOffset + "px";
                    this._viewTables.se.element().parentElement.style.marginLeft = this.mHVSOffset + "px";
                } else {
                    var docFragment = document.createDocumentFragment(), HTA = wijmo.grid.htmlTableAccessor, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;

                    this._wijgrid.mOuterDiv.wrapInner("<div class=\"" + defCSS.fixedView + " " + wijCSS.wijgridFixedView + "\"><div class=\"" + defCSS.scroller + " " + wijCSS.wijgridScroller + "\"><div class=\"wijmo-wijgrid-split-area-se wijmo-wijgrid-content-area\"></div></div></div>");
                    this._scroller = this._wijgrid.mOuterDiv.find("." + defCSS.scroller);
                    this._scroller.css("padding", 0); // disable padding (inherited)

                    this._scroller.after(this._splitAreas.nw = $("<div class=\"wijmo-wijgrid-split-area wijmo-wijgrid-split-area-nw\" style=\"overflow:hidden;position:absolute;z-index:4;top:0px;left:0px;\"></div>"));
                    this._scroller.after(this._splitAreas.ne = $("<div class=\"wijmo-wijgrid-split-area wijmo-wijgrid-split-area-ne\" style=\"overflow:hidden;position:absolute;z-index:4;top:0px;left:0px;\"></div>"));
                    this._scroller.after(this._splitAreas.sw = $("<div class=\"wijmo-wijgrid-split-area wijmo-wijgrid-split-area-sw\" style=\"overflow:hidden;position:absolute;z-index:4;top:0px;left:0px;\"></div>"));
                    this._splitAreas.se = this._scroller.find(".wijmo-wijgrid-split-area-se:first");

                    this._viewTables = {
                        nw: new HTA(docFragment.appendChild(document.createElement("table")), true, true, true),
                        ne: new HTA(docFragment.appendChild(document.createElement("table")), true, true, true),
                        sw: new HTA(docFragment.appendChild(document.createElement("table")), true, true, true),
                        se: new HTA(docFragment.appendChild(this._wijgrid.element[0]), true, true, true)
                    };
                }
            };

            fixedView.prototype._postRender = function () {
                if (!this.isLiveUpdate()) {
                    var t00 = this._viewTables.nw.element(), t01 = this._viewTables.ne.element(), t10 = this._viewTables.sw.element(), t11 = this._viewTables.se.element(), HTA = wijmo.grid.htmlTableAccessor, self = this;

                    this._viewTables = {
                        nw: new HTA(t00),
                        ne: new HTA(t01),
                        sw: new HTA(t10),
                        se: new HTA(t11)
                    };

                    this._splitAreas.nw.empty().append(t00);
                    this._splitAreas.ne.empty().append($("<div class=\"wijmo-wijgrid-scrollable-content\"></div>").append(t01));
                    this._splitAreas.sw.empty().append(t10);
                    this._splitAreas.se.empty().append($("<div class=\"wijmo-wijgrid-scrollable-content\"></div>").append(t11));

                    $.each(this._viewTables, function (idx, hta) {
                        var $element = $(hta.element());

                        self._wijgrid._setAttr($element, {
                            role: "grid",
                            border: "0",
                            cellpadding: "0",
                            cellspacing: "0"
                        });

                        $element.addClass(wijmo.grid.wijgrid.CSS.table).addClass(self._wijgrid.options.wijCSS.wijgridTable).css("border-collapse", "separate").find("> tbody").addClass(self._wijgrid.options.wijCSS.content);
                    });

                    this._setNorthTablesHeight();
                } else {
                    this._rebuildOffsets();
                }

                _super.prototype._postRender.call(this);
            };

            fixedView.prototype._setNorthTablesHeight = function () {
                $(this._viewTables.ne.element()).height("100%");
                $(this._viewTables.nw.element()).height("100%");
            };

            fixedView.prototype._clearNorthTablesHeight = function () {
                $(this._viewTables.ne.element()).height("");
                $(this._viewTables.nw.element()).height("");
            };

            fixedView.prototype._rowsCountRaw = function () {
                var t00 = this._viewTables.nw.element(), t01 = this._viewTables.ne.element(), t10 = this._viewTables.sw.element(), t11 = this._viewTables.se.element(), res;

                res = Math.max(t00.rows.length, t01.rows.length) + Math.max(t10.rows.length, t11.rows.length);

                return res;
            };

            fixedView.prototype._createCol = function (column, visibleIdx) {
                return [
                    document.createElement("col"),
                    document.createElement("col")
                ];
            };

            fixedView.prototype._appendCol = function (domCol, column, visibleIdx) {
                if (visibleIdx <= this._staticColumnIndex) {
                    this._viewTables.nw.appendCol(domCol[0]);
                    this._viewTables.sw.appendCol(domCol[1]);
                } else {
                    this._viewTables.ne.appendCol(domCol[0]);
                    this._viewTables.se.appendCol(domCol[1]);
                }
            };

            fixedView.prototype._insertRow = function (rowType, sectionRowIndex, domRow /* optional, used by c1gridview to clone rows of the original table */ ) {
                var $rt = wijmo.grid.rowType, leftSection, rightSection, vt = this._viewTables;

                switch (rowType) {
                    case 1 /* header */:
                    case 8 /* filter */:
                        leftSection = vt.nw.ensureTHead();
                        rightSection = vt.ne.ensureTHead();
                        break;

                    case 64 /* footer */:
                        leftSection = vt.sw.ensureTFoot();
                        rightSection = vt.se.ensureTFoot();
                        break;

                    default:
                        if (sectionRowIndex <= this._staticDataRowIndex) {
                            leftSection = vt.nw.ensureTBody();
                            rightSection = vt.ne.ensureTBody();
                        } else {
                            sectionRowIndex -= this._staticDataRowIndex + 1; // subtracts fixed offset
                            leftSection = vt.sw.ensureTBody();
                            rightSection = vt.se.ensureTBody();
                        }
                }

                if (domRow) {
                    // append only
                    return [
                        leftSection.appendChild(domRow),
                        rightSection.appendChild(domRow.cloneNode(false))
                    ];
                } else {
                    return [
                        leftSection.insertRow(sectionRowIndex > leftSection.rows.length ? -1 : sectionRowIndex),
                        rightSection.insertRow(sectionRowIndex > rightSection.rows.length ? -1 : sectionRowIndex)
                    ];
                }
            };

            fixedView.prototype._rowRendered = function (rowInfo, rowAttr, rowStyle) {
                var leftRow = rowInfo.$rows[0], rightRow = rowInfo.$rows[1];

                // Do not remove empty rows from header. The number of header rows in the fixed and unfixed tables should be empty to handle unbanded columns headers correctly when the staticSolumnIndex option is used:
                //
                // row0 |   band  | |  col2  | (rowSpan = 2)
                //      |---------| |--------|
                // row1 |col0|col1| |        | <- empty row
                if (!leftRow.cells.length && (this._isBodyRow(rowInfo) || this.isLiveUpdate())) {
                    leftRow.parentNode.removeChild(leftRow);
                    leftRow = null;
                }

                if (!rightRow.cells.length && this._isBodyRow(rowInfo)) {
                    rightRow.parentNode.removeChild(rightRow);
                    rightRow = null;
                }

                if (leftRow || rightRow) {
                    if (!leftRow || !rightRow) {
                        rowInfo.$rows = leftRow ? $(leftRow) : $(rightRow);
                    }

                    _super.prototype._rowRendered.call(this, rowInfo, rowAttr, rowStyle);
                }
            };

            fixedView.prototype._appendCell = function (rowInfo, cellIndex, $cell) {
                if (cellIndex <= this._staticAllColumnIndex) {
                    rowInfo.$rows[0].appendChild($cell[0]);
                } else {
                    rowInfo.$rows[1].appendChild($cell[0]);
                }
            };

            // render **
            fixedView.prototype._getRowHeight = function (rowObj, ignoreSpannedCells) {
                if (rowObj[0] && rowObj[1]) {
                    var lRow = rowObj[0], rRow = rowObj[1], $lRow = $(lRow), $rRow = $(rRow), lRowH, rRowH, customHeight, getRowHeightUsingUnspannedCells = function ($row) {
                        var i, domRow = $row[0], domCell;

                        for (i = 0; i < domRow.cells.length; i++) {
                            domCell = domRow.cells[i];

                            if (!domCell.rowSpan || domCell.rowSpan === 1) {
                                return $(domCell).outerHeight();
                            }
                        }
                        ;

                        return $row.height();
                    };

                    if (customHeight = $.data(lRow, "customHeight")) {
                        lRowH = rRowH = parseInt(customHeight);
                    } else {
                        $lRow.css("height", "");
                        $rRow.css("height", "");

                        if (ignoreSpannedCells) {
                            lRowH = getRowHeightUsingUnspannedCells($lRow);
                            rRowH = getRowHeightUsingUnspannedCells($rRow);
                        } else {
                            lRowH = $lRow.height();
                            rRowH = $rRow.height();
                        }
                    }

                    return Math.max(lRowH, rRowH);
                }

                return null;
            };

            fixedView.prototype._setRowHeight = function (rowObj, maxHeight) {
                if (rowObj[0] && rowObj[1]) {
                    var $rowObj = [$(rowObj[0]), $(rowObj[1])], dif;

                    if (maxHeight === null) {
                        return;
                    }

                    maxHeight += 1;
                    $.each($rowObj, function (index, $el) {
                        $el.height(maxHeight);
                        dif = maxHeight - $el.height();
                        if (dif) {
                            $el.height(maxHeight + dif);
                        }
                    });
                }
            };

            fixedView.prototype._adjustRowHeight = function () {
                var wijgrid = this._wijgrid, fixedColIdx = this._staticColumnIndex, lastColIdx = wijgrid._visibleLeaves().length - 1, fixedRowIdx, lastRowIdx, tables, tableNE, tableNEParent, talbeNEParentScrollLeft, tableNW, tableNWParent, tableSE, tableSEParent, tableSW, tableSWParent, rowCount, i, j, leftRows, rightRows, heightArray = [];

                // setting row height only if grid is divided into leftern and rightern parts
                if (fixedColIdx > -1 && fixedColIdx < lastColIdx) {
                    fixedRowIdx = this._staticRowIndex;
                    lastRowIdx = this._rowsCountRaw() - 1;
                    tables = this._viewTables;

                    // getting the height of northern tables
                    if (fixedRowIdx > -1 && fixedRowIdx <= lastRowIdx) {
                        tableNE = tables.ne.element();
                        tableNEParent = tableNE.parentNode;
                        tableNW = tables.nw.element();
                        tableNWParent = tableNW.parentNode;
                        leftRows = tableNW.rows;
                        rightRows = tableNE.rows;
                        rowCount = leftRows.length;

                        for (i = 0; i < rowCount; i++) {
                            heightArray.push(this._getRowHeight([leftRows[i], rightRows[i]], true)); // row height will be calculated using unspanned cells (TFS issue #33399).
                        }
                    }

                    // getting the height of southern tables
                    if (fixedRowIdx >= -1 && fixedRowIdx < lastRowIdx) {
                        tableSE = tables.se.element();
                        tableSEParent = tableSE.parentNode;
                        tableSW = tables.sw.element();
                        tableSWParent = tableSW.parentNode;
                        leftRows = tableSW.rows;
                        rightRows = tableSE.rows;
                        rowCount = leftRows.length;

                        for (i = 0; i < rowCount; i++) {
                            heightArray.push(this._getRowHeight([leftRows[i], rightRows[i]]));
                        }
                    }

                    // removing elments from dom to improve performance
                    if (fixedRowIdx > -1 && fixedRowIdx <= lastRowIdx) {
                        tableNWParent.removeChild(tableNW);
                        talbeNEParentScrollLeft = tableNEParent.scrollLeft; // store value, because property will be reset on child collection changes
                        tableNEParent.style.visibility = "hidden"; // to avoid flickering in IE when scrollLeft property will be restored.
                        tableNEParent.removeChild(tableNE);
                    }
                    if (fixedRowIdx >= -1 && fixedRowIdx < lastRowIdx) {
                        tableSWParent.removeChild(tableSW);
                        tableSEParent.removeChild(tableSE);
                    }

                    // setting the height of northern tables
                    if (fixedRowIdx > -1 && fixedRowIdx <= lastRowIdx) {
                        leftRows = tableNW.rows;
                        rightRows = tableNE.rows;
                        rowCount = leftRows.length;
                        for (i = 0, j = 0; i < rowCount; i++) {
                            this._setRowHeight([leftRows[i], rightRows[i]], heightArray[j++]);
                        }
                    }

                    // setting the height of southern tables
                    if (fixedRowIdx >= -1 && fixedRowIdx < lastRowIdx) {
                        leftRows = tableSW.rows;
                        rightRows = tableSE.rows;
                        rowCount = leftRows.length;
                        for (i = 0; i < rowCount; i++) {
                            this._setRowHeight([leftRows[i], rightRows[i]], heightArray[j++]);
                        }
                    }

                    // adding elments back to dom to improve performance
                    if (fixedRowIdx > -1 && fixedRowIdx <= lastRowIdx) {
                        tableNWParent.appendChild(tableNW);
                        tableNEParent.appendChild(tableNE);

                        if (talbeNEParentScrollLeft) {
                            tableNEParent.scrollLeft = talbeNEParentScrollLeft;
                        }
                        tableNEParent.style.visibility = "visible";
                    }
                    if (fixedRowIdx >= -1 && fixedRowIdx < lastRowIdx) {
                        tableSWParent.appendChild(tableSW);
                        tableSEParent.appendChild(tableSE);
                    }
                }
            };

            // private abstract **
            // ** private specific
            fixedView.prototype._adjustRowsHeights = function () {
                var $tableSW = $(this._viewTables.sw.element()), $tableSE = $(this._viewTables.se.element()), height;

                $tableSE.css("height", "");
                $tableSW.css("height", "");

                this._adjustRowHeight();

                height = Math.max($tableSE.height(), $tableSW.height());

                $tableSW.height(height);
                $tableSE.height(height);
            };

            fixedView.prototype._destroySuperPanel = function () {
                if (this._scroller.data("wijmo-wijsuperpanel")) {
                    if (this.vsUI) {
                        this.vsUI.dispose();
                    }

                    this._superPanelElementsCache = {};
                    this._scroller.wijsuperpanel("destroy");
                }
            };

            fixedView.prototype._onScroll = function (e, data) {
                var spInstance = this._getSuperPanel();

                if (this._wijgrid._allowVVirtualScrolling()) {
                    if (data.dir === "h") {
                        // do horizontal scrolling
                        this._setFixedAreaPosition(spInstance.getContentElement(), data.dir, data.position, data.animationOptions, false);
                        this._setFixedAreaPosition(this._splitAreas.ne, data.dir, data.position, data.animationOptions, true);
                    }
                } else {
                    this._setFixedAreaPosition(data.dir === "h" ? this._splitAreas.ne : this._splitAreas.sw, data.dir, data.position, data.animationOptions, true);
                }

                this._wijgrid._trackScrollingPosition(spInstance.options.hScroller.scrollValue, spInstance.options.vScroller.scrollValue, data.dir === "h" ? data.position : null);
            };

            fixedView.prototype._onHScrollerActivating = function (e, args) {
                // auto adjusting height with hscrollbar shown
                if (this._wijgrid.mAutoHeight) {
                    var diff = this._wijgrid.element.height() + this._wijgrid.mSplitDistanceY - args.contentLength;
                    if (diff > 0) {
                        this._scroller.height(this._scroller.height() + diff);
                        this._scroller.wijsuperpanel("paintPanel");
                        return false;
                    }
                }

                this._splitAreas.sw.height(args.contentLength - this._wijgrid.mSplitDistanceY);
            };

            fixedView.prototype._onMouseWheel = function (e, delta) {
                // force superpanel to do scrolling when cursor is placed over then non-scrollable (fixed) areas of the wijgrid.
                var bounds, dir = (delta > 0) ? "top" : "bottom", isOverFixedArea = false, vPos;

                if (this._wijgrid._canInteract()) {
                    bounds = this.getFixedAreaVisibleBounds(); // an array (horizonta area, verticalw area)

                    $.each(bounds, function (i, o) {
                        if (o && wijmo.grid.isOver(e.pageY, e.pageX, o.top, o.left, o.height, o.width)) {
                            isOverFixedArea = true;
                            return false;
                        }
                    });

                    if (isOverFixedArea && this._scroller.data("wijmo-wijsuperpanel")) {
                        vPos = this._scroller.wijsuperpanel("option", "vScroller").scrollValue;

                        this._scroller.wijsuperpanel("doScrolling", dir);

                        // simulate wijsuperpanel behaviour: prevent window scrolling until superpanel is not scrolled to the end.
                        if (vPos !== this._scroller.wijsuperpanel("option", "vScroller").scrollValue) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    }
                }
            };

            fixedView.prototype._setFixedAreaPosition = function (element, direction, position, animation, useScrollProp) {
                var prop = {}, key;

                if (direction === "h") {
                    key = useScrollProp ? "scrollLeft" : "left";
                } else {
                    key = useScrollProp ? "scrollTop" : "top";
                }

                if (!useScrollProp) {
                    position = -position; // invert
                }

                if (animation) {
                    prop[key] = position;
                    element.animate(prop, animation);
                } else {
                    if (useScrollProp) {
                        element[0][key] = position;
                    } else {
                        element.css(key, position);
                    }
                }
            };

            fixedView.prototype._testNeedVBar = function (outerDiv, gridElement, tableNE, mode, autoHeight) {
                var excludeVBarWidth = false, wijgrid = this._wijgrid, gridWidth = tableNE.width() + wijgrid.mSplitDistanceX, gridHeight = gridElement.height() + wijgrid.mSplitDistanceY, outerWidth = outerDiv.width(), outerHeight = outerDiv.height(), contentHeight, topHeight = 0, bottomHeight = 0;

                if (wijgrid.mSuperPanelHeader !== null) {
                    topHeight = wijgrid.mSuperPanelHeader.outerHeight(true);
                }

                if (wijgrid.mBottomPagerDiv !== null) {
                    bottomHeight = wijgrid.mBottomPagerDiv.outerHeight(true);
                }

                contentHeight = outerHeight - topHeight - bottomHeight;

                switch (mode) {
                    case "both":
                    case "vertical":
                        excludeVBarWidth = true;
                        break;

                    case "auto":
                        // When the height needs to be auto adjusted, the vertical scrollbar should not be shown
                        excludeVBarWidth = (gridHeight > contentHeight) || (!autoHeight && gridWidth > outerWidth && gridHeight > contentHeight - this._verScrollBarSize);

                        if (!excludeVBarWidth && this._wijgrid._allowVVirtualScrolling()) {
                            var itemsToRender = wijgrid._view().getVirtualPageSize();

                            //itemsToRender = this._bounds.end - this._bounds.start;
                            excludeVBarWidth = (itemsToRender > 0 && itemsToRender < wijgrid._totalRowsCount());
                        }

                        break;
                }

                return excludeVBarWidth;
            };

            //bSet: 0-width, 1-height, 2-all
            fixedView.prototype._updateSplitAreaBounds = function (bSet) {
                var wijgrid = this._wijgrid, controlHeight, contentHeight, topHeight = 0, bottomHeight = 0;

                if (bSet === 0 || bSet === 2) {
                    this._splitAreas.nw.width(wijgrid.mSplitDistanceX);
                    this._splitAreas.sw.width(wijgrid.mSplitDistanceX);

                    if (wijgrid._lgGetStaticColumnsAlignment() === "right") {
                        this._splitAreas.se.css("marginRight", wijgrid.mSplitDistanceX);
                        this._splitAreas.ne.css("marginRight", wijgrid.mSplitDistanceX);
                    } else {
                        this._splitAreas.se.css("marginLeft", wijgrid.mSplitDistanceX);
                        this._splitAreas.ne.css("marginLeft", wijgrid.mSplitDistanceX);
                    }
                }

                if (bSet === 1 || bSet === 2) {
                    this._scroller.css("height", "");
                    this._splitAreas.se.css("marginTop", 0);

                    controlHeight = wijgrid.mOuterDiv.height();

                    if (!wijgrid.mAutoHeight) {
                        this._scroller.height(controlHeight);
                    } else {
                        // no height is set for outer div, we need to expand the grid.
                        this._scroller.height(controlHeight + wijgrid.mSplitDistanceY);
                        //this._noHeight = true;
                    }

                    this._splitAreas.nw.height(wijgrid.mSplitDistanceY);
                    this._splitAreas.ne.height(wijgrid.mSplitDistanceY);

                    if (wijgrid.mSuperPanelHeader !== null) {
                        topHeight = wijgrid.mSuperPanelHeader.outerHeight(true);
                    }
                    if (wijgrid.mBottomPagerDiv !== null) {
                        bottomHeight = wijgrid.mBottomPagerDiv.outerHeight(true);
                    }
                    contentHeight = controlHeight - topHeight - bottomHeight;

                    if (wijgrid.mSuperPanelHeader !== null) {
                        this._splitAreas.nw.css("top", topHeight + "px");
                        this._splitAreas.ne.css("top", topHeight + "px");
                    }

                    if (!wijgrid.mAutoHeight) {
                        this._splitAreas.sw.height(contentHeight - wijgrid.mSplitDistanceY);
                    } else {
                        this._splitAreas.sw.height(contentHeight);
                    }

                    this._splitAreas.sw.css("top", wijgrid.mSplitDistanceY + topHeight);
                    this._splitAreas.se.css("marginTop", wijgrid.mSplitDistanceY);
                }
            };

            fixedView.prototype._strictWidthMode = function () {
                return this._wijgrid.options.ensureColumnsPxWidth || this._wijgrid._allowHVirtualScrolling();
            };

            // private specific **
            // ** wijsuperpanel specific
            fixedView.prototype._getSuperPanelContentWrapper = function () {
                if (!this._superPanelElementsCache.contentWrapper || !this._superPanelElementsCache.contentWrapper.length) {
                    this._superPanelElementsCache.contentWrapper = this._wijgrid.mOuterDiv.find(".wijmo-wijsuperpanel-contentwrapper:first"); // not available in native mode?
                }

                return this._superPanelElementsCache.contentWrapper;
            };

            fixedView.prototype._getSuperPanelStateContainer = function () {
                if (!this._superPanelElementsCache.stateContainer || !this._superPanelElementsCache.stateContainer.length) {
                    this._superPanelElementsCache.stateContainer = this._wijgrid.mOuterDiv.find(".wijmo-wijsuperpanel-statecontainer:first");
                }

                return this._superPanelElementsCache.stateContainer;
            };

            fixedView.prototype._getSuperPanelTemplateWrapper = function () {
                if (!this._superPanelElementsCache.templateWrapper || !this._superPanelElementsCache.templateWrapper.length) {
                    this._superPanelElementsCache.templateWrapper = this._wijgrid.mOuterDiv.find(".wijmo-wijsuperpanel-templateouterwrapper:first"); // not available in native mode?
                }

                return this._superPanelElementsCache.templateWrapper;
            };

            fixedView.prototype._isNativeSuperPanel = function () {
                return this._wijgrid._isTouchEnv();
            };

            fixedView.prototype._testAutohiddenScrollbars = function () {
                if (this._isNativeSuperPanel()) {
                    var container = this._getSuperPanelStateContainer();
                    if (container.length) {
                        return container[0].offsetWidth === container[0].clientWidth;
                    }
                }

                return false;
            };
            return fixedView;
        })(_grid.baseView);
        _grid.fixedView = fixedView;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts" />
/// <reference path="wijgrid.ts" />
/// <reference path="misc.ts" />
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** An object that represents selection in the grid. You do not need to create instances of this class. */
        var selection = (function () {
            /** Creates an object that represents selection in the grid. Normally you do not need to use this method.
            * @example
            * var selection = new wijmo.grid.selection(wijgrid);
            * @param {wijmo.wijgrid} wijgrid wijgrid
            * @returns {wijmo.grid.selection} Object that represents selection in the grid
            */
            function selection(wijgrid) {
                this._updates = 0;
                this._selectedColumns = null;
                this._selectedRows = null;
                // n: none (0), c: extendToColumn (1), r: extendToRow (2)
                //
                //              extendMode
                // selectionMode| n | c | r
                // ------------------------
                // singlecell   | n | n | n
                // singlecolumn | c | c | c
                // singlerow    | r | r | r
                // singlerange  | n | c | r
                // multicolumn  | c | c | c
                // multirow     | r | r | r
                // multirange   | n | c | r
                this._extend_rules = {
                    "singlecell": [0, 0, 0],
                    "singlecolumn": [1, 1, 1],
                    "singlerow": [2, 2, 2],
                    "singlerange": [0, 1, 2],
                    "multicolumn": [1, 1, 1],
                    "multirow": [2, 2, 2],
                    "multirange": [0, 1, 2]
                };
                if (!wijgrid) {
                    throw "invalid arguments";
                }

                this._wijgrid = wijgrid;

                this._addedCells = new cellInfoOrderedCollection(wijgrid);
                this._removedCells = new cellInfoOrderedCollection(wijgrid);
                this._selectedCells = new cellInfoOrderedCollection(wijgrid);
                this._addedDuringCurTransactionCells = new cellInfoOrderedCollection(wijgrid);
            }
            /** Gets a read-only collection of the selected cells.
            * @example
            * var selectedCells = selectionObj.selectedCells();
            * for (var i = 0, len = selectedCells.length(); i < len; i++) {
            *	alert(selectedCells.item(i).value().toString());
            * }
            * @returns {wijmo.grid.cellInfoOrderedCollection} A read-only collection of the selected cells.
            */
            selection.prototype.selectedCells = function () {
                return this._selectedCells;
            };

            /** Gets a read-only collection of the selected rows.
            * @example
            * alert(selectionObj.selectedRows().length());
            * @returns {wijmo.grid.selectedRowsAccessor} A read-only collection of the selected rows.
            */
            selection.prototype.selectedRows = function () {
                if (!this._selectedRows) {
                    this._selectedRows = new selectedRowsAccessor(this._wijgrid);
                }

                return this._selectedRows;
            };

            /** Adds a column range to the current selection.
            * Usage:
            * 1. addColumns(0)
            * 2. addColumns(0, 2)
            * @example
            * // Add the first column to the current selection.
            * selectionObj.addColumns(0);
            * @remarks
            * The result depends upon the chosen selection mode in the grid. For example, if current selection mode does not allow multiple selection the previous selection will be removed.
            * @param {Number} start The index of the first column to select.
            * @param {Number} end The index of the last column to select.
            */
            selection.prototype.addColumns = function (start, end /* opt */ ) {
                if (!end && end !== 0) {
                    end = start;
                }

                this.addRange(start, 0, end, 0xFFFFFF);
            };

            /** @ignore */
            selection.prototype.addRange = function (cellRange /* x0 */ , y0 /* opt */ , x1 /* opt */ , y1 /* opt */ ) {
                if (!cellRange && (arguments.length === 1)) {
                    throw "invalid argument";
                }

                var range = (arguments.length === 4) ? new wijmo.grid.cellInfoRange(new wijmo.grid.cellInfo(cellRange, y0), new wijmo.grid.cellInfo(x1, y1)) : cellRange._clone();

                range._normalize();

                if (!range._isValid()) {
                    throw "invalid argument";
                }

                this.beginUpdate();

                this._startNewTransaction(this._wijgrid._currentCell());
                this._selectRange(range, false, true, 0 /* none */, null);

                this.endUpdate();
            };

            /** Adds a row range to the current selection.
            * Usage:
            * 1. addRows(0)
            * 2. addRows(0, 2)
            * @example
            * // Add the first row to the selection.
            * selectionObj.addRows(0);
            * @remarks
            * The result depends upon the chosen selection mode in the grid. For example, if current selection mode does not allow multiple selection the previous selection will be removed.
            * @param {Number} start The index of the first row to select.
            * @param {Number} end The index of the last row to select.
            */
            selection.prototype.addRows = function (start, end /* opt */ ) {
                if (!end && end !== 0) {
                    end = start;
                }

                this.addRange(0, start, 0xFFFFFF, end);
            };

            /** @ignore */
            selection.prototype.removeRange = function (cellRange /* x0 */ , y0 /* opt */ , x1 /* opt */ , y1 /* opt */ ) {
                if (!cellRange && (arguments.length === 1)) {
                    throw "invalid argument";
                }

                var range = (arguments.length === 4) ? new wijmo.grid.cellInfoRange(new wijmo.grid.cellInfo(cellRange, y0), new wijmo.grid.cellInfo(x1, y1)) : cellRange._clone();

                range._normalize();

                if (!range._isValid()) {
                    throw "invalid argument";
                }

                this.beginUpdate();

                this._startNewTransaction(this._wijgrid._currentCell());
                this._clearRange(range, 0 /* none */);

                this.endUpdate();
            };

            /**
            * Removes a range of columns from the current selection.
            * Usage:
            * 1. removeColumns(0)
            * 2. removeColumns(0, 2)
            * @example
            * // Remove the first columm from the selection.
            * selectionObj.removeColumns(0);
            * @remarks
            * The result depends upon the chosen selection mode in the grid.
            * @param {Number} start The index of the first column to remove.
            * @param {Number} end The index of the last column to remove.
            */
            selection.prototype.removeColumns = function (start, end /* opt */ ) {
                if (!end && end !== 0) {
                    end = start;
                }

                this.removeRange(start, 0, end, 0xFFFFFF);
            };

            /** Removes a range of rows from the current selection.
            * Usage:
            * 1. removeRows(0)
            * 2. removeRows(0, 2)
            * @example
            * // Remove the first row from the selection.
            * selectionObj.removeRows(0);
            * @remarks
            * The result depends upon the chosen selection mode in the grid.
            * @param {Number} start The index of the first row to remove.
            * @param {Number} end The index of the last row to remove.
            */
            selection.prototype.removeRows = function (start, end /* opt */ ) {
                if (!end && end !== 0) {
                    end = start;
                }

                this.removeRange(0, start, 0xFFFFFF, end);
            };

            /**
            * Clears the selection.
            * @example
            * // Clear the selection.
            * selectionObj.clear();
            */
            selection.prototype.clear = function () {
                this.beginUpdate();

                this._removedCells._clear();
                this._removedCells._addFrom(this._selectedCells);

                this.endUpdate();
            };

            /**
            * Selects all the cells in a grid.
            * @example
            * selectionObj.selectAll();
            * @remarks
            * The result depends upon the chosen selection mode in the grid. For example, if the selection mode is set to "singleCell", then only the top left cell will be selected.
            */
            selection.prototype.selectAll = function () {
                this.beginUpdate();

                this._selectRange(this._wijgrid._getDataCellsRange(0 /* sketch */), false, false, 0 /* none */, null);

                this.endUpdate();
            };

            /**
            * Begins the update. Any changes won't take effect until endUpdate() is called.
            * @example
            * selectionObj.beginUpdate();
            */
            selection.prototype.beginUpdate = function () {
                this._updates++;
            };

            /**
            * Ends the update. The pending changes are executed and the selectionChanged event is raised.
            * @example
            * selectionObj.endUpdate();
            */
            selection.prototype.endUpdate = function () {
                if (this._updates > 0) {
                    this._updates--;

                    if (this._updates === 0) {
                        this.doSelection(); // values must be clipped before this step

                        if (this._addedCells.length() || this._removedCells.length()) {
                            if (this._selectedColumns !== null) {
                                this._selectedColumns.UnderlyingDataChanged(); // notify
                            }

                            if (this._selectedRows !== null) {
                                this._selectedRows._setDirty(); // notify
                            }

                            this._wijgrid._trigger("selectionChanged", null, { addedCells: this._addedCells, removedCells: this._removedCells });
                        }

                        this._addedCells = new wijmo.grid.cellInfoOrderedCollection(this._wijgrid);
                        this._removedCells._clear();
                    }
                }
            };

            // * internal
            selection.prototype._multipleRangesAllowed = function () {
                var mode = this._wijgrid.options.selectionMode;
                return (mode && ((mode = mode.toLowerCase()) === "multicolumn" || mode === "multirow" || mode === "multirange"));
            };

            selection.prototype._multipleEntitiesAllowed = function () {
                var mode = this._wijgrid.options.selectionMode;
                return (mode && ((mode = mode.toLowerCase()) === "multicolumn" || mode === "multirow" || mode === "multirange" || mode === "singlerange"));
            };

            selection.prototype._anchorCell = function () {
                return this.__anchorCell;
            };

            selection.prototype._startNewTransaction = function (dataCellInfo) {
                if (dataCellInfo) {
                    this.__anchorCell = dataCellInfo._clone();
                    this._addedDuringCurTransactionCells = new wijmo.grid.cellInfoOrderedCollection(this._wijgrid);
                }
            };

            selection.prototype._clearRange = function (range, extendMode) {
                var selectionMode = this._wijgrid.options.selectionMode.toLowerCase(), rangeToClear, rowsLen, cellsLen, flag, row, cell, i, len, cellInfo, dataRange = this._wijgrid._getDataCellsRange(0 /* sketch */);

                if (range._isValid() && (selectionMode !== "none") && (this._selectedCells.length() > 0)) {
                    rangeToClear = range._clone();

                    rangeToClear._normalize();
                    rangeToClear._clip(dataRange);

                    if (!range._isValid()) {
                        return;
                    }

                    // extend
                    rangeToClear._extend(this._extend_rules[selectionMode][extendMode], dataRange);

                    this.beginUpdate();

                    for (i = 0, len = this._selectedCells.length(); i < len; i++) {
                        cellInfo = this._selectedCells.item(i);

                        if (rangeToClear._containsCellInfo(cellInfo)) {
                            this._removedCells._add(cellInfo);
                        }
                    }

                    this.endUpdate();
                }
            };

            selection.prototype._selectRange = function (range, ctrlKey, shiftKey, extendMode, endPoint) {
                var selectionMode = this._wijgrid.options.selectionMode.toLowerCase(), rangeToSelect, dataRange = this._wijgrid._getDataCellsRange(0 /* sketch */);

                if ((selectionMode !== "none") && range._isValid()) {
                    rangeToSelect = range._clone();
                    rangeToSelect._normalize();
                    rangeToSelect._clip(dataRange);

                    if (!rangeToSelect._isValid()) {
                        return;
                    }

                    this.beginUpdate();

                    if (!this._multipleRangesAllowed()) {
                        this.clear();
                    } else {
                        if (ctrlKey || shiftKey) {
                            if (shiftKey) {
                                this._removedCells._clear();
                                this._removedCells._addFrom(this._addedDuringCurTransactionCells);
                            }
                        } else {
                            this.clear();
                        }
                    }

                    switch (selectionMode) {
                        case "singlecell":
                        case "singlecolumn":
                        case "singlerow":
                            rangeToSelect = (endPoint === null) ? new wijmo.grid.cellInfoRange(rangeToSelect.topLeft(), rangeToSelect.topLeft()) : new wijmo.grid.cellInfoRange(endPoint, endPoint);
                            break;
                    }

                    // extend
                    rangeToSelect._extend(this._extend_rules[selectionMode][extendMode], dataRange);

                    // do selection
                    this.doRange(rangeToSelect, true);

                    this.endUpdate();
                }
            };

            selection.prototype._ensureSelection = function () {
                var view = this._wijgrid._view(), prevRowIndex = -2, rowInfo;

                for (var i = 0; i < this._selectedCells.length(); i++) {
                    var cellInfo = this._selectedCells.item(i);

                    if (cellInfo._isRendered()) {
                        if (prevRowIndex !== cellInfo.rowIndex()) {
                            rowInfo = cellInfo.row();
                            prevRowIndex = cellInfo.rowIndex();
                        }

                        this.selectCell(cellInfo, rowInfo, view, true);
                    }
                }
            };

            selection.prototype._ensureSelectionInRow = function (sketchRowIndex) {
                var _this = this;
                var view = this._wijgrid._view();

                if (view._isRowRendered(sketchRowIndex) >= 0) {
                    var rowInfo = view._getRowInfoBySketchRowIndex(sketchRowIndex, false), selectedCells = this.selectedCells();

                    if (rowInfo && selectedCells && (selectedCells.length() > 0)) {
                        rowInfo.$rows.children("td, th").each(function (i, cell) {
                            var idx = selectedCells.indexOf(i, sketchRowIndex);
                            if (idx >= 0) {
                                _this.selectCell(selectedCells.item(idx), rowInfo, view, true);
                            }
                        });
                    }
                }
            };

            // * internal
            // * private
            selection.prototype.doSelection = function () {
                var view = this._wijgrid._view(), i, len, cellInfo, cell, $cell, index, $rs = wijmo.grid.renderState, rowInfo, state, prevRowIndex = -1;

                for (i = 0, len = this._removedCells.length(); i < len; i++) {
                    cellInfo = this._removedCells.item(i);

                    if (this._addedCells.indexOf(cellInfo) < 0) {
                        if (prevRowIndex !== cellInfo.rowIndex()) {
                            rowInfo = cellInfo.row();
                            prevRowIndex = cellInfo.rowIndex();
                        }

                        this.selectCell(cellInfo, rowInfo, view, false);

                        this._selectedCells._remove(cellInfo);
                        this._addedDuringCurTransactionCells._remove(cellInfo);
                    } else {
                        this._removedCells._removeAt(i);
                        i--;
                        len--;
                    }
                }

                prevRowIndex = -1;

                for (i = 0, len = this._addedCells.length(); i < len; i++) {
                    cellInfo = this._addedCells.item(i);

                    index = this._selectedCells.indexOf(cellInfo);
                    if (index < 0) {
                        if (prevRowIndex !== cellInfo.rowIndex()) {
                            rowInfo = cellInfo.row();
                            prevRowIndex = cellInfo.rowIndex();
                        }

                        this.selectCell(cellInfo, rowInfo, view, true);

                        this._selectedCells._insertUnsafe(cellInfo, ~index);
                        this._addedDuringCurTransactionCells._add(cellInfo);
                    } else {
                        this._addedCells._removeAt(i);
                        i--;
                        len--;
                    }
                }
            };

            selection.prototype.selectCell = function (cellInfo, rowInfo, view, select) {
                if (cellInfo._isRendered()) {
                    var bounds = this._wijgrid._viewPortBounds();
                    var cell = view.getCell(cellInfo.cellIndexAbs(), cellInfo.rowIndexAbs());

                    if (cell) {
                        var $cell = $(cell), state = view._changeCellRenderState($cell, 8 /* selected */, select === true);

                        this._wijgrid.mCellStyleFormatter.format($cell, cellInfo.cellIndex(), cellInfo.columnInst(), rowInfo, state);
                    }
                }
            };

            selection.prototype.doRange = function (range, add) {
                var x0 = range.topLeft().cellIndex(), y0 = range.topLeft().rowIndex(), x1 = range.bottomRight().cellIndex(), y1 = range.bottomRight().rowIndex(), cnt, row, col, cell, view = this._wijgrid._view(), rowInfo, rows, renderBounds = this._wijgrid._viewPortBounds();

                if (add) {
                    cnt = this._addedCells.length();
                    rows = this._wijgrid._rows();

                    for (row = y0; row <= y1; row++) {
                        rowInfo = view._getRowInfoBySketchRowIndex(row);

                        if (rowInfo.type & 2 /* data */) {
                            for (col = x0; col <= x1; col++) {
                                cell = new wijmo.grid.cellInfo(col, row);

                                if (cnt === 0) {
                                    this._addedCells._appendUnsafe(cell);
                                } else {
                                    this._addedCells._add(cell);
                                }
                            }
                        }
                    }
                } else {
                    cnt = this._removedCells.length();
                    for (row = y0; row <= y1; row++) {
                        for (col = x0; col <= x1; col++) {
                            cell = new wijmo.grid.cellInfo(col, row);

                            if (cnt === 0) {
                                this._removedCells._appendUnsafe(cell);
                            } else {
                                this._removedCells._add(cell);
                            }
                        }
                    }
                }
            };
            return selection;
        })();
        grid.selection = selection;

        /** An ordered read-only collection of wijmo.grid.cellInfo objects */
        var cellInfoOrderedCollection = (function () {
            /**
            * Creates an ordered read-only collection of wijmo.grid.cellInfo objects. Normally you do not need to use this method.
            * @example
            * var collection = new wijmo.grid.cellInfoOrderedCollection(wijgrid);
            * @param {wijmo.wijgrid} wijgrid wijgrid
            * @returns {wijmo.grid.cellInfoOrderedCollection}  An ordered read-only collection of wijmo.grid.cellInfo objects
            */
            function cellInfoOrderedCollection(wijgrid) {
                if (!wijgrid) {
                    throw "invalid arguments";
                }

                this._wijgrid = wijgrid;
                this._list = [];
            }
            // public
            /** Gets an item at the specified index.
            * @example
            * var cellInfoObj = collection.item(0);
            * @param {Number} index The zero-based index of the item to get.
            * @returns {wijmo.grid.cellInfo} The wijmo.grid.cellInfo object at the specified index.
            */
            cellInfoOrderedCollection.prototype.item = function (index) {
                return this._list[index];
            };

            /** Gets the total number of the items in the collection.
            * @example
            * var len = collection.length();
            * @returns {Number} The total number of the items in the collection.
            */
            cellInfoOrderedCollection.prototype.length = function () {
                return this._list.length;
            };

            /** @ignore */
            cellInfoOrderedCollection.prototype.indexOf = function (cellIndex, rowIndex) {
                if (arguments.length === 1) {
                    rowIndex = cellIndex.rowIndex();
                    cellIndex = cellIndex.cellIndex();
                }

                var lo = 0, hi = this._list.length - 1, med, current, cmp;

                while (lo <= hi) {
                    med = lo + ((hi - lo) >> 1);
                    current = this._list[med];

                    cmp = current.rowIndex() - rowIndex;
                    if (cmp === 0) {
                        cmp = current.cellIndex() - cellIndex;
                    }

                    if (cmp < 0) {
                        lo = med + 1;
                    } else {
                        if (cmp > 0) {
                            hi = med - 1;
                        } else {
                            return med;
                        }
                    }
                }

                return ~lo;
            };

            /** @ignore */
            cellInfoOrderedCollection.prototype.toString = function () {
                var val = "", i, len;

                for (i = 0, len = this._list.length; i < len; i++) {
                    val += this._list[i].toString() + "\n";
                }

                return val;
            };

            // public *
            // internal
            cellInfoOrderedCollection.prototype._add = function (value) {
                var idx = this.indexOf(value);
                if (idx < 0) {
                    this._list.splice(~idx, 0, value);
                    value._setGridView(this._wijgrid);
                    return true;
                }

                return false;
            };

            cellInfoOrderedCollection.prototype._addFrom = function (addFrom) {
                if (addFrom) {
                    var fromLen = addFrom.length(), thisLen = this._list.length, i;

                    if (thisLen === 0) {
                        this._list.length = fromLen;

                        for (i = 0; i < fromLen; i++) {
                            this._list[i] = addFrom.item(i);
                            this._list[i]._setGridView(this._wijgrid);
                        }
                    } else {
                        for (i = 0; i < fromLen; i++) {
                            this._add(addFrom.item(i));
                        }
                    }
                }
            };

            cellInfoOrderedCollection.prototype._appendUnsafe = function (value) {
                this._list[this._list.length] = value;
                value._setGridView(this._wijgrid);
            };

            cellInfoOrderedCollection.prototype._insertUnsafe = function (value, index) {
                this._list.splice(index, 0, value);
            };

            cellInfoOrderedCollection.prototype._clear = function () {
                this._list.length = 0;
            };

            cellInfoOrderedCollection.prototype._remove = function (value) {
                var idx = this.indexOf(value);
                if (idx >= 0) {
                    this._list.splice(idx, 1);
                    return true;
                }

                return false;
            };

            cellInfoOrderedCollection.prototype._removeAt = function (index) {
                this._list.splice(index, 1);
            };

            cellInfoOrderedCollection.prototype._getColumnsIndicies = function () {
                var columns = [], len = this._list.length, tmpColumns, i, len2;

                if (len) {
                    tmpColumns = [];
                    for (i = 0; i < len; i++) {
                        tmpColumns[this._list[i].cellIndex()] = 1;
                    }

                    len = tmpColumns.length;
                    len2 = 0;
                    for (i = 0; i < len; i++) {
                        if (tmpColumns[i]) {
                            columns[len2++] = i;
                        }
                    }
                }

                return columns;
            };

            cellInfoOrderedCollection.prototype._getSelectedRowsIndicies = function () {
                var rows = [], len = this._list.length, tmpRows, i, len2;

                if (len) {
                    tmpRows = [];
                    for (i = 0; i < len; i++) {
                        tmpRows[this._list[i].rowIndex()] = 1;
                    }

                    len = tmpRows.length;
                    len2 = 0;
                    for (i = 0; i < len; i++) {
                        if (tmpRows[i]) {
                            rows[len2++] = i;
                        }
                    }
                }

                return rows;
            };

            cellInfoOrderedCollection.prototype._rectangulate = function () {
                var len = this._list.length, x0 = 0xFFFFFFFF, y0 = 0xFFFFFFFF, x1 = 0, y1 = 0, i, cellInfo;

                if (len) {
                    for (i = 0; i < len; i++) {
                        cellInfo = this._list[i];

                        x0 = Math.min(x0, cellInfo.cellIndex());
                        y0 = Math.min(y0, cellInfo.rowIndex());
                        x1 = Math.max(x1, cellInfo.cellIndex());
                        y1 = Math.max(y1, cellInfo.rowIndex());
                    }

                    return new wijmo.grid.cellInfoRange(new wijmo.grid.cellInfo(x0, y0), new wijmo.grid.cellInfo(x1, y1));
                }

                return null;
            };
            return cellInfoOrderedCollection;
        })();
        grid.cellInfoOrderedCollection = cellInfoOrderedCollection;

        /** Provides a read-only access to rows which cells are selected. */
        var selectedRowsAccessor = (function () {
            /**
            * Constructor. Normally you do not need to use this method.
            * @example
            * var collection = new wijmo.grid.selectedRowsAccessor(wijgrid);
            * @param {wijmo.wijgrid} wijgrid wijgrid
            * @returns {wijmo.grid.selectedRowsAccessor} A new instance of the selectedRowsAccessor class.
            */
            function selectedRowsAccessor(wijgrid) {
                this.mLength = 0;
                this.mDirty = true;
                this.mRowIndicies = [];
                this.mWijgrid = wijgrid;
            }
            /** Gets the total number of the items in the collection.
            * @example
            * var len = $("#demo").wijgrid("selection").selectedRows().length();
            * @returns {Number} The total number of the items in the collection.
            */
            selectedRowsAccessor.prototype.length = function () {
                this._ensure();
                return this.mLength;
            };

            /** Gets an object representing grid's row at the specified index.
            * @example
            * var row = $("#demo").wijgrid("selection").selectedRows().item(0);
            * @param {Number} index The zero-based index of the item to get.
            * @returns {wijmo.grid.IRowInfo} An object representing grid's row at the specified index.
            */
            selectedRowsAccessor.prototype.item = function (index) {
                this._ensure();

                var rowInfo = this.mWijgrid._view()._getRowInfoBySketchRowIndex(this.mRowIndicies[index]);

                return rowInfo;
            };

            selectedRowsAccessor.prototype._ensure = function () {
                if (this.mDirty) {
                    this.mRowIndicies = this.mWijgrid.selection().selectedCells()._getSelectedRowsIndicies();
                    this.mLength = this.mRowIndicies.length;
                    this.mDirty = false;
                }
            };

            /** @ignore */
            selectedRowsAccessor.prototype._setDirty = function () {
                this.mDirty = true;
            };
            return selectedRowsAccessor;
        })();
        grid.selectedRowsAccessor = selectedRowsAccessor;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
/// <reference path="wijgrid.ts"/>
/// <reference path="cellInfo.ts"/>
/// <reference path="rowAccessor.ts"/>
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var uiSelection = (function () {
            function uiSelection(wijgrid) {
                this._gap_to_start = 10;
                this._inProgress = false;
                this._additionalEventsAttached = false;
                this._wijgrid = wijgrid;

                this._evntFormat = "{0}." + this._wijgrid.widgetName + ".selectionui";
                this._addedCells = new wijmo.grid.cellInfoOrderedCollection(this._wijgrid);
                this._view = this._wijgrid._view();
                this._rootElement = this._view.focusableElement();

                this._rootElement.bind(this._eventKey("mousedown"), $.proxy(this._onGridMouseDown, this));
            }
            uiSelection.prototype.dispose = function () {
                this._rootElement.unbind(this._eventKey("mousedown"), this._onGridMouseDown);
                this._detachAdditionalEvents();
            };

            uiSelection.prototype._onGridMouseDown = function (args) {
                if (!this._wijgrid._canInteract() || this._wijgrid.options.selectionMode.toLowerCase() === "none") {
                    return;
                }

                var visibleBounds = this._view.getVisibleContentAreaBounds(), mouse = { x: args.pageX, y: args.pageY }, tag = ((args.target && args.target.tagName !== undefined) ? args.target.tagName.toLowerCase() : undefined), $target = $(args.target), defCSS = wijmo.grid.wijgrid.CSS;

                if ((!tag || $target.is("td." + defCSS.TD + ", th." + defCSS.TD + ", div." + defCSS.cellContainer)) && (mouse.x > visibleBounds.left && mouse.x < visibleBounds.left + visibleBounds.width) && (mouse.y > visibleBounds.top && mouse.y < visibleBounds.top + visibleBounds.height)) {
                    this._attachAdditionalEvents();
                    this._startPos = mouse;

                    this._startCellInfo = this._coordToDataCellInfo(this._startPos);
                }
            };

            uiSelection.prototype._onDocumentMouseMove = function (args) {
                if (!this._startCellInfo || !this._startCellInfo._isValid()) {
                    return;
                }

                var mouse = { x: args.pageX, y: args.pageY }, tmp, cellInfo, range, desiredCells, rowsLen, cellsLen, row, cell, i, len, $cell, rowInfo, prevRowIndex, state, view = this._wijgrid._view(), rows = this._wijgrid._rows(), $rs = wijmo.grid.renderState;

                if (!this._inProgress) {
                    this._inProgress = (Math.abs(this._startPos.x - mouse.x) > this._gap_to_start) || (Math.abs(this._startPos.y - mouse.y) > this._gap_to_start);
                }

                if (this._inProgress) {
                    tmp = this._coordToDataCellInfo(mouse);
                    if (!tmp._isValid()) {
                        return;
                    }

                    this._endCellInfo = tmp;

                    range = new wijmo.grid.cellInfoRange(this._startCellInfo, this._endCellInfo);
                    range._normalize();
                    range._clip(this._wijgrid._getDataCellsRange(0 /* sketch */));

                    if (range._isValid() && !range.isEqual(this._prevMouseMoveRange)) {
                        this._prevMouseMoveRange = range;

                        desiredCells = new wijmo.grid.cellInfoOrderedCollection(this._wijgrid);
                        rowsLen = range.bottomRight().rowIndex();
                        cellsLen = range.bottomRight().cellIndex();

                        for (row = range.topLeft().rowIndex(); row <= rowsLen; row++) {
                            rowInfo = view._getRowInfoBySketchRowIndex(row);

                            if (rowInfo.type & 2 /* data */) {
                                for (cell = range.topLeft().cellIndex(); cell <= cellsLen; cell++) {
                                    desiredCells._appendUnsafe(new wijmo.grid.cellInfo(cell, row));
                                }
                            }
                        }

                        prevRowIndex = -1;
                        for (i = 0, len = this._addedCells.length(); i < len; i++) {
                            cellInfo = this._addedCells.item(i);

                            if (desiredCells.indexOf(cellInfo) < 0) {
                                if (this._wijgrid.selection().selectedCells().indexOf(cellInfo) < 0) {
                                    cell = this._view.getCell(cellInfo.cellIndexAbs(), cellInfo.rowIndexAbs());

                                    if (cell) {
                                        if (prevRowIndex !== cellInfo.rowIndex()) {
                                            rowInfo = cellInfo.row();
                                            prevRowIndex = cellInfo.rowIndex();
                                        }

                                        $cell = $(cell);
                                        state = view._changeCellRenderState($cell, 8 /* selected */, false);
                                        this._wijgrid.mCellStyleFormatter.format($cell, cellInfo.cellIndex(), cellInfo.columnInst(), rowInfo, state);
                                    }
                                }

                                this._addedCells._removeAt(i);
                                i--;
                                len--;
                            }
                        }

                        prevRowIndex = -1;
                        for (i = 0, len = desiredCells.length(); i < len; i++) {
                            cellInfo = desiredCells.item(i);
                            if (this._addedCells.indexOf(cellInfo) < 0 && this._wijgrid.selection().selectedCells().indexOf(cellInfo) < 0) {
                                if (this._addedCells._add(cellInfo)) {
                                    cell = this._view.getCell(cellInfo.cellIndexAbs(), cellInfo.rowIndexAbs());

                                    if (cell) {
                                        if (prevRowIndex !== cellInfo.rowIndex()) {
                                            rowInfo = cellInfo.row();
                                            prevRowIndex = cellInfo.rowIndex();
                                        }

                                        $cell = $(cell);
                                        state = view._changeCellRenderState($cell, 8 /* selected */, true);
                                        this._wijgrid.mCellStyleFormatter.format($cell, cellInfo.cellIndex(), cellInfo.columnInst(), rowInfo, state);
                                    }
                                }
                            }
                        }
                    }
                }
            };

            uiSelection.prototype._onDocumentMouseUp = function (args) {
                this._detachAdditionalEvents();

                if (this._inProgress) {
                    this._inProgress = false;

                    if (this._prevMouseMoveRange && this._prevMouseMoveRange._isValid()) {
                        this._wijgrid._changeCurrentCell(args, this._endCellInfo, { changeSelection: false, setFocus: false });

                        if (!args.shiftKey || !this._wijgrid.selection()._multipleEntitiesAllowed()) {
                            this._wijgrid.selection()._startNewTransaction(this._startCellInfo);
                        }

                        this._wijgrid.selection().beginUpdate();
                        this._wijgrid.selection()._selectRange(this._prevMouseMoveRange, args.shiftKey, args.ctrlKey, 0 /* none */, this._endCellInfo);
                        this._wijgrid.selection().endUpdate();

                        var view = this._wijgrid._view(), prevRowIndex = -1, rowInfo, $rs = wijmo.grid.renderState;

                        for (var i = 0, len = this._addedCells.length(); i < len; i++) {
                            var cellInfo = this._addedCells.item(i);

                            if (this._wijgrid.selection().selectedCells().indexOf(cellInfo) < 0) {
                                var cell = view.getCell(cellInfo.cellIndexAbs(), cellInfo.rowIndexAbs());

                                if (cell !== null) {
                                    if (prevRowIndex !== cellInfo.rowIndex()) {
                                        rowInfo = cellInfo.row();
                                        prevRowIndex = cellInfo.rowIndex();
                                    }

                                    var $cell = $(cell), state = view._changeCellRenderState($cell, 8 /* selected */, false);

                                    this._wijgrid.mCellStyleFormatter.format($cell, cellInfo.cellIndex(), cellInfo.columnInst(), rowInfo, state);
                                }
                            }
                        }

                        this._addedCells._clear();
                        this._startCellInfo = this._endCellInfo = this._prevMouseMoveRange = null;

                        return false;
                    }
                }
            };

            uiSelection.prototype._attachAdditionalEvents = function () {
                if (!this._additionalEventsAttached) {
                    try  {
                        this._view.toggleDOMSelection(false); // disable selection

                        $(document).bind(this._eventKey("mousemove"), $.proxy(this._onDocumentMouseMove, this)).bind(this._eventKey("mouseup"), $.proxy(this._onDocumentMouseUp, this));
                    } finally {
                        this._additionalEventsAttached = true;
                    }
                }
            };

            uiSelection.prototype._detachAdditionalEvents = function () {
                if (this._additionalEventsAttached) {
                    try  {
                        this._view.toggleDOMSelection(true); // enable selection

                        $(document).unbind(this._eventKey("mousemove"), this._onDocumentMouseMove).unbind(this._eventKey("mouseup"), this._onDocumentMouseUp);
                    } finally {
                        this._additionalEventsAttached = false;
                    }
                }
            };

            uiSelection.prototype._eventKey = function (eventType) {
                return wijmo.grid.stringFormat(this._evntFormat, eventType);
            };

            uiSelection.prototype._coordToDataCellInfo = function (pnt) {
                var left = 0, right = this._wijgrid._renderedLeaves().length - 1, median = 0, cellIdx = -1, bounds, gridRowsAccessor = new wijmo.grid.rowAccessor(this._view, 2, 0, 0), rowIdx, rowObj, dataOffset, result;

                while (left <= right) {
                    median = ((right - left) >> 1) + left;

                    bounds = wijmo.grid.bounds(this._view.getHeaderCell(median)); // get header cell
                    if (!bounds) {
                        rowObj = gridRowsAccessor.item(0);
                        bounds = wijmo.grid.bounds(wijmo.grid.rowAccessor.getCell(rowObj, median)); // get data cell
                    }

                    if (!bounds) {
                        break;
                    }

                    if (pnt.x < bounds.left) {
                        right = median - 1;
                    } else if (pnt.x > bounds.left + bounds.width) {
                        left = median + 1;
                    } else {
                        cellIdx = median;
                        break;
                    }
                }

                if (cellIdx === -1) {
                    return wijmo.grid.cellInfo.outsideValue;
                }

                gridRowsAccessor = new wijmo.grid.rowAccessor(this._view, 0, 0, 0);

                rowIdx = -1;
                left = 0;
                right = gridRowsAccessor.length() - 1;
                median = 0;

                while (left <= right) {
                    median = ((right - left) >> 1) + left;
                    rowObj = gridRowsAccessor.item(median);
                    bounds = wijmo.grid.bounds(wijmo.grid.rowAccessor.getCell(rowObj, 0));

                    if (pnt.y < bounds.top) {
                        right = median - 1;
                    } else if (pnt.y > bounds.top + bounds.height) {
                        left = median + 1;
                    } else {
                        rowIdx = median;
                        break;
                    }
                }

                if (rowIdx === -1) {
                    return wijmo.grid.cellInfo.outsideValue;
                }

                result = new wijmo.grid.cellInfo(cellIdx, rowIdx, this._wijgrid, true);

                return result;
            };
            return uiSelection;
        })();
        grid.uiSelection = uiSelection;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
/// <reference path="baseView.ts"/>
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /**
        * Class for convenient access to rows of a wijgrid.
        * @ignore
        */
        var rowAccessor = (function () {
            function rowAccessor(view, scope, offsetTop, offsetBottom) {
                this._view = view;
                this._scope = scope;
                this._offsetBottom = offsetBottom;
                this._offsetTop = offsetTop;
            }
            /** Gets an array of the table row elements that represents a wijgrid widget row at the specified index.
            * size of returning array is always two.
            * @param {Number} index The zero-based index of the row to retrieve.
            * @returns {Object[]} The array of the table row elements at the specified index.
            * @remarks
            */
            rowAccessor.prototype.item = function (index) {
                var len = this.length();

                return (index >= 0 && index < len) ? this._view.getJoinedRows(index + this._offsetTop, this._scope) : null;
            };

            /**
            * Gets the total number of elements.
            * @returns {Number} The total number of elements.
            */
            rowAccessor.prototype.length = function () {
                var joinedTables = this._view.getJoinedTables(true, 0), len = 0, htmlAccessor;

                if (htmlAccessor = joinedTables[0]) {
                    len = htmlAccessor.getSectionLength(this._scope);
                }

                if (htmlAccessor = joinedTables[1]) {
                    len += htmlAccessor.getSectionLength(this._scope);
                }

                len -= this._offsetTop + this._offsetBottom;

                if (len < 0) {
                    len = 0;
                }

                return len;
            };

            /** @ignore */
            rowAccessor.prototype.find = function (startFrom, callback, retrieveDataItem) {
                if (typeof retrieveDataItem === "undefined") { retrieveDataItem = false; }
                var f = this.findEx(startFrom, callback, retrieveDataItem);
                return f ? f.val : null;
            };

            /** @ignore */
            rowAccessor.prototype.findIndex = function (startFrom, callback, retrieveDataItem) {
                if (typeof retrieveDataItem === "undefined") { retrieveDataItem = false; }
                var f = this.findEx(startFrom, callback, retrieveDataItem);
                return f ? f.at : -1;
            };

            /** @ignore */
            rowAccessor.prototype.findEx = function (startFrom, callback, retrieveDataItem) {
                if (typeof retrieveDataItem === "undefined") { retrieveDataItem = false; }
                var len = this.length();

                for (var i = 0; i < len; i++) {
                    var rowObj = this.item(i), rowInfo = this._view._getRowInfo(rowObj, retrieveDataItem);

                    if (callback(rowInfo) === true) {
                        return {
                            at: i,
                            val: rowInfo
                        };
                    }
                }

                return null;
            };

            /** Sequentially iterates the cells in a rowObj argument.
            * @param {Array} rowObj Array of rows to be iterated.
            * @param {Function} callback Function that will be called each time a new cell is reached.
            * @param {Object} param Parameter that can be handled within the callback function.
            */
            rowAccessor.iterateCells = function (rowObj, callback, param) {
                if (rowObj && callback) {
                    var globCellIdx = 0, i, len, domRow, j, cellLen, result;

                    for (i = 0, len = rowObj.length; i < len; i++) {
                        domRow = rowObj[i];

                        if (domRow) {
                            for (j = 0, cellLen = domRow.cells.length; j < cellLen; j++) {
                                result = callback(domRow.cells[j], globCellIdx++, param);
                                if (result !== true) {
                                    return;
                                }
                            }
                        }
                    }
                }
            };

            /** Gets a cell by its global index in a row's array passed in rowObj.
            * @example:
            * Suppose rows is an array containing the following data: [ ["a", "b"], ["c", "d", "e"] ]
            * "a" symbol has a global index 0.
            * "c" symbol has a global index 2.
            * @param {Array} rowObj Array of table row elements.
            * @param {Number} index Zero-based global index of a cell.
            * @returns {HTMLTableCellElement} A cell or null if a cell with provided index is not found.
            */
            rowAccessor.getCell = function (rowObj, globCellIndex) {
                var domRow, cellLen;

                if (rowObj && (domRow = rowObj[0])) {
                    cellLen = domRow.cells.length;
                    if (globCellIndex < cellLen) {
                        return domRow.cells[globCellIndex];
                    }

                    globCellIndex -= cellLen;

                    if (domRow = rowObj[1]) {
                        cellLen = domRow.cells.length;
                        if (globCellIndex < cellLen) {
                            return domRow.cells[globCellIndex];
                        }
                    }
                }

                return null;
            };

            /** @ignore */
            rowAccessor.getCell$ = function (row, globCellIndex) {
                var domCell = wijmo.grid.rowAccessor.getCell(row, globCellIndex);

                return (domCell) ? $(domCell) : $([]);
            };

            /** @ignore */
            rowAccessor.cellsCount = function (rowObj) {
                var res = 0, domRow;

                if (rowObj && (domRow = rowObj[0])) {
                    res = domRow.cells.length;

                    if (domRow = rowObj[1]) {
                        res += domRow.cells.length;
                    }
                }

                return res;
            };
            return rowAccessor;
        })();
        grid.rowAccessor = rowAccessor;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts" />
/// <reference path="wijgrid.ts" />
/// <reference path="misc.ts" />
var wijmo;
(function (wijmo) {
    (function (_grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        (function (updateCellResult) {
            updateCellResult[updateCellResult["error"] = 0] = "error";
            updateCellResult[updateCellResult["continueEditing"] = 1] = "continueEditing";
            updateCellResult[updateCellResult["success"] = 2] = "success";

            // ESC key is pressed or cell in not rendered.
            updateCellResult[updateCellResult["cancel"] = 4] = "cancel";
            updateCellResult[updateCellResult["notEdited"] = 8] = "notEdited";
        })(_grid.updateCellResult || (_grid.updateCellResult = {}));
        var updateCellResult = _grid.updateCellResult;
        ;

        /** @ignore */
        var cellEditorHelper = (function () {
            function cellEditorHelper() {
                this._timeout = 25;
            }
            cellEditorHelper.prototype.cellEditStart = function (grid, cell, e) {
                var result = false, view = grid._view();

                if (cell._isValid() && !cell._isEdit() && (cell.columnInst() instanceof wijmo.grid.c1field)) {
                    var rowInfo = cell.row();

                    if (rowInfo) {
                        var rowType = rowInfo.type;

                        if (rowType & 2 /* data */) {
                            var args = {
                                cell: cell,
                                event: e,
                                handled: false
                            };

                            if (result = (grid._trigger("beforeCellEdit", null, args) || (grid.options.editingMode === "row"))) {
                                if (!args.handled) {
                                    result = this._defaultBeforeCellEdit(grid, args);
                                }
                            }

                            if (result) {
                                cell._isEdit(true);
                            }
                        }
                    }
                }

                return result;
            };

            cellEditorHelper.prototype.updateCell = function (grid, cell, e, reject) {
                var row;

                if (cell && !cell._isEdit()) {
                    return 2 /* success */ | 8 /* notEdited */;
                }

                if (!cell || !cell._isValid() || !(row = cell.row()) || !(row.type & 2 /* data */)) {
                    return 0 /* error */;
                }

                if (reject || !cell._isRendered()) {
                    return 2 /* success */ | 4 /* cancel */;
                }

                var result = 2 /* success */, column = cell.column();

                var bcuArgs = {
                    cell: cell,
                    value: undefined
                };

                if (grid._trigger("beforeCellUpdate", null, bcuArgs) || (grid.options.editingMode === "row")) {
                    if (bcuArgs.value === undefined) {
                        bcuArgs.value = this._getCellValue(grid, cell); // get raw value from editor using  default implementation
                    }

                    var a = bcuArgs.value, b = cell.value();

                    try  {
                        var inputType = this._getHTMLInputElementType(cell);

                        if (wijmo.grid.HTML5InputSupport.isExtendSupportRequired(inputType)) {
                            bcuArgs.value = wijmo.grid.HTML5InputSupport.parse(bcuArgs.value, inputType);
                            bcuArgs.value = wijmo.grid.HTML5InputSupport.extend(b, bcuArgs.value, inputType);
                        } else {
                            bcuArgs.value = grid.parse(cell.column(), bcuArgs.value); // try to parse raw value
                        }

                        a = bcuArgs.value;
                    } catch (ex) {
                        bcuArgs.value = a; // restore raw value
                    }

                    if (wijmo.grid.getDataType(column) === "datetime") {
                        if (a instanceof Date) {
                            a = a.getTime();
                        }

                        if (b instanceof Date) {
                            b = b.getTime();
                        }
                    }

                    if (a !== b) {
                        try  {
                            cell.value(bcuArgs.value);
                        } catch (ex) {
                            var icvArgs = {
                                cell: cell,
                                value: bcuArgs.value
                            };

                            result = 0 /* error */;
                            grid._trigger("invalidCellValue", null, icvArgs);
                        }

                        if (result & 2 /* success */) {
                            var acuArgs = {
                                cell: cell
                            };

                            grid._trigger("afterCellUpdate", null, acuArgs);
                        }
                    }
                } else {
                    return 1 /* continueEditing */;
                }

                return result;
            };

            // must be called only after the updateCell().
            cellEditorHelper.prototype.cellEditEnd = function (grid, cell, e) {
                var rowInfo = cell.row(), aceArgs = {
                    cell: cell,
                    event: e,
                    handled: false
                };

                cell._isEdit(false);

                if (cell._isRendered()) {
                    grid._trigger("afterCellEdit", null, aceArgs);

                    if (!aceArgs.handled) {
                        this._defaultAfterCellEdit(grid, aceArgs);
                    }
                }
            };

            // private
            cellEditorHelper.prototype._defaultBeforeCellEdit = function (grid, args) {
                var column = args.cell.column(), result = false, $container, $input;

                if (column.dataIndex >= 0) {
                    var value = args.cell.value(), keyCodeEnum = wijmo.getKeyCodeEnum(), inputType = wijmo.grid.HTML5InputSupport.getDefaultInputType(grid._isMobileEnv(), column), allowCellEditing = grid._allowCellEditing(), serverSideCheckbox = false;

                    result = true;

                    try  {
                        $container = args.cell.container();

                        if (wijmo.grid.getDataType(column) === "boolean") {
                            var $span = $container.children("span");

                            if (serverSideCheckbox = !!($span.length && ($span.prop("disabled") || (grid.options._aspNetDisabledClass && $span.hasClass(grid.options._aspNetDisabledClass))))) {
                                $.data($span[0], "serverSideCheckbox", true);

                                $span.prop("disabled", false); // ASP.NET 3

                                if (grid.options._aspNetDisabledClass) {
                                    $span.removeClass(grid.options._aspNetDisabledClass); // ASP.NET 4
                                }
                            }

                            $input = $container.find(":checkbox");

                            if (serverSideCheckbox || !allowCellEditing) {
                                $input.prop("disabled", false);
                            }

                            if (args.event && args.event.type === "keypress") {
                                $input.one("keyup", function (e) {
                                    if (e.which === keyCodeEnum.SPACE) {
                                        e.preventDefault();
                                        $input[0].checked = !value;
                                    }
                                });
                            }
                        } else {
                            $input = $("<input type='" + inputType + "' />").css("ime-mode", column.imeMode || "auto").addClass(wijmo.grid.wijgrid.CSS.inputMarker).addClass("wijmo-wijinput " + grid.options.wijCSS.stateFocus).bind("keydown", grid, $.proxy(this._checkBoxOrInputKeyDown, this));

                            //the problem of inputing
                            $input.bind(($.support.selectstart ? "selectstart" : "mousedown"), function (event) {
                                event.stopPropagation();
                            });

                            if (args.event && (args.event.type === "keydown") && (args.event.which !== 113)) {
                                // "edit on keypress", leave the editor empty.
                            } else {
                                switch (wijmo.grid.getDataType(column)) {
                                    case "currency":
                                    case "number":
                                        if (value !== null) {
                                            $input.val(value); // ignore formatting
                                            break;
                                        }
                                    case "datetime":
                                        if (wijmo.grid.HTML5InputSupport.isExtendSupportRequired(inputType)) {
                                            $input.val(wijmo.grid.HTML5InputSupport.toStr(value, inputType));
                                            break;
                                        }

                                    default:
                                        $input.val(grid.toStr(column, value));
                                        break;
                                }
                            }

                            $container.empty().append($input);

                            if (allowCellEditing) {
                                var len = $input.val().length;
                                if (inputType === "text") {
                                    // move caret to the end of the text
                                    new wijmo.grid.domSelection($input[0]).setSelection({ start: len, end: len });
                                }
                            }
                        }

                        if (allowCellEditing) {
                            $input.focus();
                            setTimeout(function () {
                                $input.focus();
                            }, this._timeout * 2);
                        }
                    } catch (ex) {
                        alert(ex.message);
                        result = false;
                    }
                }

                return result;
            };

            cellEditorHelper.prototype._defaultAfterCellEdit = function (grid, args) {
                var leaf = args.cell.columnInst(), opt = leaf.options, result = false;

                if (opt.dataIndex >= 0) {
                    result = true;

                    var view = grid._view();

                    try  {
                        var $container = args.cell.container(), cellValue = grid.toStr(opt, args.cell.value()), rowInfo = view._getRowInfoBySketchRowIndex(args.cell.rowIndex());

                        if (wijmo.grid.getDataType(opt) === "boolean") {
                            var $span = $container.children("span"), disable = $span.length && $.data($span[0], "serverSideCheckbox"), $input = $container.find(":checkbox");

                            $input.prop("checked", cellValue === "true");

                            /*if (cellValue === "true") {
                            $input.attr("checked", "checked");
                            }
                            else {
                            $input.removeAttr("checked");
                            }*/
                            if (disable) {
                                $span.prop("disabled", true); // ASP.NET 3

                                if (grid.options._aspNetDisabledClass) {
                                    $span.addClass(grid.options._aspNetDisabledClass);
                                }

                                $input.prop("disabled", true);
                            }
                        } else {
                            grid.mCellFormatter.format($(args.cell.tableCell()), args.cell.cellIndex(), $container, leaf, cellValue, rowInfo);
                        }
                    } catch (ex) {
                        alert("defaultAfterCellEdit: " + ex.message);
                        result = false;
                    }
                }

                return result;
            };

            cellEditorHelper.prototype._checkBoxOrInputKeyDown = function (args) {
                var keyCodeEnum = wijmo.getKeyCodeEnum();

                if (args.which === keyCodeEnum.ENTER) {
                    var grid = args.data;

                    if (grid) {
                        grid._endEditInternal(args);
                        return false;
                    }
                }
            };

            cellEditorHelper.prototype._getCellValue = function (grid, currentCell) {
                var $input = currentCell.container().find(":input:first"), result = null;

                if ($input.length) {
                    result = ($input.attr("type") === "checkbox") ? $input[0].checked : $input.val();
                }

                return result;
            };

            cellEditorHelper.prototype._getHTMLInputElementType = function (currentCell) {
                return currentCell.container().find(":input:first").attr("type");
            };
            return cellEditorHelper;
        })();
        _grid.cellEditorHelper = cellEditorHelper;

        // IME support.
        /** @ignore */
        var keyDownEventListener = (function () {
            function keyDownEventListener(grid, container) {
                this.mGrid = grid;

                this.mWrapper = $("<div />");

                if (this.mGrid._allowCellEditing()) {
                    this.mHiddenElement = $("<input type=\"text\" />").keydown($.proxy(this._onKeyDown, this));
                } else {
                    this.mHiddenElement = $("<input type=\"button\" />"); // use any focusable element other than textbox (to avoid keyboard popup in mobile).
                }

                this.mHiddenElement.css({
                    position: "relative",
                    border: 0,
                    padding: 0,
                    margin: 0,
                    width: 1,
                    height: 1,
                    "font-size": wijmo.grid.isMobileSafari() ? "0em" : "1px"
                });

                this.mFakeFocusable = $("<input type=\"button\" />").css({
                    position: "relative",
                    width: 1,
                    height: 1,
                    border: 0,
                    padding: 0,
                    margin: 0
                });

                this.mWrapper.append(this.mHiddenElement).append(this.mFakeFocusable).css({
                    position: "absolute",
                    width: "0px",
                    height: "0px",
                    overflow: "hidden",
                    "z-index": 999999
                });

                container.append(this.mWrapper);
            }
            keyDownEventListener.prototype.dispose = function () {
                if (this.mWrapper) {
                    try  {
                        this.mWrapper.remove();
                    } catch (ex) {
                    } finally {
                        this.mWrapper = null;
                        this.mHiddenElement = null;
                        this.mGrid = null;
                    }
                }
            };

            keyDownEventListener.prototype.focus = function (coord, column) {
                if (coord && coord.length) {
                    var offset = coord.offset();

                    this.mWrapper.offset({
                        top: offset.top,
                        left: offset.left
                    });

                    this.mFakeFocusable.focus(); // move focus out of the mHiddenElement first to resolve an issue with changing the IME in IE11

                    this.mHiddenElement.css("ime-mode", (column && (column instanceof _grid.c1field) && column.options.imeMode) || "auto").focus();
                }
            };

            keyDownEventListener.prototype.isHiddenInput = function (element) {
                return element && ((element[0] === this.mHiddenElement[0]) || (element[0] === this.mFakeFocusable[0]));
            };

            keyDownEventListener.prototype.canHandle = function (e) {
                return (this.mGrid._allowCellEditing() && this.isPrintableKeyCode(e));
            };

            keyDownEventListener.prototype.isPrintableKeyCode = function (e) {
                var k = e.keyCode;

                /* ported from the SpeadJS */
                return !e.ctrlKey && !e.altKey && ((k >= 65 && k <= 90) || ((k >= 48 && k <= 57) || (k >= 96 && k <= 105)) || (k >= 186 && k <= 192) || (k >= 220 && k <= 222 || k === 219) || (k >= 106 && k <= 111) || (k === 32) || (k === 61) || (k === 173) || (k === 229 || e.keyCode === 0));
            };

            keyDownEventListener.prototype._onKeyDown = function (e) {
                if (this.canHandle(e)) {
                    //if (targetOuterDiv.length && (targetOuterDiv[0] === this.outerDiv[0])) {
                    this.mGrid._beginEditInternal(e); // pass input (onKeyUp event) to the editor.
                } else {
                    var keyCodeEnum = wijmo.getKeyCodeEnum();

                    switch (e.keyCode) {
                        case keyCodeEnum.ESCAPE:
                        case keyCodeEnum.ENTER:
                            e.preventDefault();
                            break;
                    }
                }
            };
            return keyDownEventListener;
        })();
        _grid.keyDownEventListener = keyDownEventListener;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts" />
/// <reference path="c1commandbutton.ts" />
/// <reference path="wijgrid.ts" />
/// <reference path="misc.ts" />
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var cellFormatterHelper = (function () {
            function cellFormatterHelper() {
                this._div = document.createElement("div");
                this._div.style.display = "none";

                if (document && document.body) {
                    document.body.appendChild(this._div);
                }
            }
            cellFormatterHelper.prototype.dispose = function () {
                try  {
                    if (this._div && this._div.parentNode) {
                        this._div.parentNode.removeChild(this._div);
                    }
                } catch (ex) {
                } finally {
                    this._div = null;
                }
            };

            cellFormatterHelper.prototype.format = function ($cell, cellIndex, $container, column, formattedValue, rowInfo) {
                column._initializeCell($cell, cellIndex, $container, formattedValue, rowInfo);
            };

            cellFormatterHelper.prototype.updateHTML = function (container, value, encodeHTML) {
                if (typeof encodeHTML === "undefined") { encodeHTML = false; }
                // container.html(value || "&nbsp;"); // -- very slow in IE when table content is recreated more than once (after paging, sorting etc, especially in flat mode).
                var domContainer = container[0];

                // reset content
                if (domContainer.firstChild) {
                    while (domContainer.firstChild) {
                        domContainer.removeChild(domContainer.firstChild);
                    }
                }

                wijmo.grid.setContent(this._div, encodeHTML, value);

                while (this._div.firstChild) {
                    domContainer.appendChild(this._div.firstChild);
                }
            };
            return cellFormatterHelper;
        })();
        grid.cellFormatterHelper = cellFormatterHelper;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
/// <reference path="wijgrid.ts"/>
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var uiResizer = (function () {
            function uiResizer(wijgrid) {
                this.MIN_WIDTH = 5;
                this._elements = [];
                this._gap = 10;
                this._step = 1;
                this._inProgress = false;
                this._hoveredColumn = null;
                this._startLocation = null;
                this._lastLocation = null;
                this._proxy = null;
                this._wijgrid = wijgrid;

                this._evntFormat = "{0}." + this._wijgrid.widgetName + ".resizer";
            }
            uiResizer.prototype.addElement = function (column) {
                if (column && column.element) {
                    column.element.bind(this._eventKey("mousemove"), $.proxy(this._onMouseMove, this)).bind(this._eventKey("mousedown"), $.proxy(this._onMouseDown, this)).bind(this._eventKey("mouseout"), $.proxy(this._onMouseOut, this));

                    this._elements.push(column);
                }
            };

            uiResizer.prototype.dispose = function () {
                var _this = this;
                $.each(this._elements, function (index, field) {
                    field.element.unbind(_this._eventKey("mousemove"), _this._onMouseMove).unbind(_this._eventKey("mousedown"), _this._onMouseDown).unbind(_this._eventKey("mouseout"), _this._onMouseOut);
                });

                this._detachDocEvents();
            };

            uiResizer.prototype.inProgress = function () {
                return this._inProgress;
            };

            uiResizer.prototype._onMouseMove = function (e) {
                if (!this._inProgress) {
                    var hoveredField = this._getFieldByPos({ x: e.pageX, y: e.pageY });
                    if (hoveredField && hoveredField._canSize() && this._wijgrid._canInteract()) {
                        hoveredField.element.css("cursor", "e-resize");

                        this._hoveredColumn = hoveredField;

                        e.stopPropagation(); // prevent frozener from taking effect
                    } else {
                        this._onMouseOut(e);
                    }
                }
            };

            uiResizer.prototype._onMouseOut = function (e) {
                if (!this._inProgress) {
                    if (this._hoveredColumn) {
                        this._hoveredColumn.element.css("cursor", "");
                        this._hoveredColumn = null;
                    }
                }
            };

            uiResizer.prototype._onMouseDown = function (e) {
                this._hoveredColumn = this._getFieldByPos({ x: e.pageX, y: e.pageY });

                if (this._hoveredColumn && this._hoveredColumn._canSize() && this._wijgrid._canInteract()) {
                    try  {
                        var wijCSS = this._wijgrid.options.wijCSS, defCSS = wijmo.grid.wijgrid.CSS;

                        this._hoveredColumn.element.css("cursor", "");

                        this._docCursor = document.body.style.cursor;
                        document.body.style.cursor = "e-resize";
                        this._startLocation = this._lastLocation = wijmo.grid.bounds(this._hoveredColumn.element);

                        this._proxy = $("<div class=\"" + defCSS.resizingHandle + " " + wijCSS.wijgridResizingHandle + " " + wijCSS.stateHighlight + "\">&nbsp;</div>");

                        var visibleAreaBounds = this._wijgrid._view().getVisibleAreaBounds(true);

                        this._proxy.css({
                            "left": e.pageX, "top": this._startLocation.top,
                            "height": visibleAreaBounds.height + visibleAreaBounds.top - this._startLocation.top
                        });

                        $(document.body).append(this._proxy);
                    } finally {
                        this._attachDocEvents();
                        this._inProgress = true;

                        e.stopPropagation(); // prevent frozener from taking effect
                    }
                }
            };

            uiResizer.prototype._onDocumentMouseMove = function (e) {
                var deltaX = this._step * Math.round((e.pageX - this._lastLocation.left) / this._step);

                this._lastLocation = { left: this._lastLocation.left + deltaX, top: e.pageY, width: undefined, height: undefined };
                this._proxy.css("left", this._lastLocation.left);
            };

            uiResizer.prototype._onDocumentMouseUp = function (e) {
                try  {
                    document.body.style.cursor = this._docCursor;

                    // destroy proxy object
                    this._proxy.remove();

                    if (this._startLocation !== this._lastLocation) {
                        this._wijgrid._fieldResized(this._hoveredColumn, this._startLocation.width, Math.max(this._lastLocation.left - this._startLocation.left, this.MIN_WIDTH));
                    }
                } finally {
                    this._hoveredColumn = null;
                    this._proxy = null;
                    this._detachDocEvents();
                    this._inProgress = false;
                }
            };

            uiResizer.prototype._onSelectStart = function (e) {
                e.preventDefault();
            };

            uiResizer.prototype._attachDocEvents = function () {
                if (!this._inProgress) {
                    $(document).bind(this._eventKey("mousemove"), $.proxy(this._onDocumentMouseMove, this)).bind(this._eventKey("mouseup"), $.proxy(this._onDocumentMouseUp, this));

                    if ($.fn.disableSelection) {
                        $(document.body).disableSelection();
                    }

                    if ("onselectstart" in document) {
                        $(document.body).bind("selectstart", this._onSelectStart);
                    }
                }
            };

            uiResizer.prototype._detachDocEvents = function () {
                if (this._inProgress) {
                    $(document).unbind(this._eventKey("mousemove"), this._onDocumentMouseMove).unbind(this._eventKey("mouseup"), this._onDocumentMouseUp);

                    if ($.fn.enableSelection) {
                        $(document.body).enableSelection();
                    }

                    if ("onselectstart" in document) {
                        $(document.body).unbind("selectstart", this._onSelectStart);
                    }
                }
            };

            uiResizer.prototype._getFieldByPos = function (mouse) {
                for (var i = 0, len = this._elements.length; i < len; i++) {
                    var field = this._elements[i], bounds = wijmo.grid.bounds(field.element), isOver = wijmo.grid.isOver(mouse.y, mouse.x, bounds.top, bounds.left + bounds.width - this._gap, bounds.height, this._gap);

                    if (isOver) {
                        return field;
                    }
                }

                return null;
            };

            uiResizer.prototype._eventKey = function (eventType) {
                var prefix = (this._wijgrid._isTouchEnv()) ? "wij" : "";

                return prefix + wijmo.grid.stringFormat(this._evntFormat, eventType);
            };
            return uiResizer;
        })();
        grid.uiResizer = uiResizer;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
/// <reference path="wijgrid.ts" />
/// <reference path="c1groupedfield.ts" />
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var uiDragndrop = (function () {
            function uiDragndrop(wijgrid) {
                this._scope_guid = "scope_" + wijmo.grid.getUID();
                this._dragEnd = false;
                this.mZIndex = 1000;
                var defCSS = wijmo.grid.wijgrid.CSS;

                this._wijgrid = wijgrid;
                this._wijCSS = this._wijgrid.options.wijCSS;
                this._wrapHtml = "<div class=\"" + this._wijCSS.widget + " " + defCSS.wijgrid + " " + this._wijCSS.wijgrid + " " + this._wijCSS.content + " " + this._wijCSS.cornerAll + "\">" + "<table class=\"" + defCSS.root + " " + defCSS.table + " " + this._wijCSS.wijgridTable + "\">" + "<tr class=\"" + defCSS.headerRow + " " + this._wijCSS.wijgridHeaderRow + "\">" + "</tr>" + "</table>" + "</div>";
            }
            uiDragndrop.prototype.attachGroupArea = function (element) {
                var draggedColumn, self = this;

                if (!$.ui || !$.ui.droppable || !$.ui.draggable) {
                    return;
                }

                element.droppable({
                    scope: this._scope_guid,
                    tolerance: "pointer",
                    greedy: true,
                    accept: function (draggable) {
                        if (self._wijgrid.options.allowColMoving) {
                            draggedColumn = self._getColumnInstance(draggable);

                            if (draggedColumn) {
                                return draggedColumn._canDropToGroupArea();
                            }
                        }
                        return false;
                    },
                    drop: function (e, ui) {
                        if (!self._isInElement(e, ui.draggable) && (draggedColumn = self._getColumnInstance(ui.draggable))) {
                            self._dragEnd = true;
                        }
                    },
                    over: function (e, ui) {
                        var cnt = self._wijgrid._groupAreaColumns().length;

                        self._dropTargetRedirected = (cnt > 0);
                        self._droppableColumn = (cnt > 0) ? self._wijgrid._groupAreaColumns()[cnt - 1] : element; // special case, the drop target is the group area itself

                        element.data("thisDroppableWijField", self._droppableColumn);
                    },
                    out: function (e, ui) {
                        if (self._droppableColumn === element.data("thisDroppableWijField")) {
                            self._droppableColumn = null;
                        }
                    }
                });
            };

            uiDragndrop.prototype.attach = function (column) {
                var element, draggedColumn, defCSS = wijmo.grid.wijgrid.CSS, self = this;

                if (!$.ui.droppable || !$.ui.draggable) {
                    return;
                }

                if (!column || !(element = column.element)) {
                    return;
                }

                element.draggable({
                    helper: function (e) {
                        var result;

                        if (column instanceof grid.c1groupedfield) {
                            result = element.clone();
                        } else {
                            result = element.clone().wrap(self._wrapHtml).width(element.width()).height(element.height()).closest("." + defCSS.wijgrid);
                        }

                        result.addClass(defCSS.dndHelper + " " + self._wijCSS.wijgridDndHelper).css("z-index", self.mZIndex = wijmo.grid.getZIndex(self._wijgrid.mOuterDiv, 1000)); // Update the z-index property. wijdialog increases its z-index property every time when the dialog position is changed.

                        return result;
                    },
                    appendTo: "body",
                    //cursor: "pointer",
                    scope: self._scope_guid,
                    drag: function (e, ui) {
                        self._hideArrows();

                        if (self._droppableColumn && !self._isInElement(e, element)) {
                            // indicate insertion position
                            var $arrowsTarget = self._droppableColumn.element;
                            if (!$arrowsTarget) {
                                $arrowsTarget = self._droppableColumn;
                            }

                            self._showArrows($arrowsTarget, self._getPosition(column, self._droppableColumn, e, ui));
                        }
                    },
                    start: function (e, ui) {
                        if (self._wijgrid._canInteract() && self._wijgrid.options.allowColMoving && (self._wijgrid._UIResizer() == null || !self._wijgrid._UIResizer().inProgress())) {
                            var dragColumn = column, dragInGroup = (column instanceof grid.c1groupedfield), dragSource = dragInGroup ? "groupArea" : "columns";

                            if (dragInGroup) {
                                dragColumn = self._wijgrid._findInstance(column.options);
                            }

                            var opt = dragColumn.options;

                            if (column._canDrag() && self._wijgrid._trigger("columnDragging", null, { drag: opt, dragSource: dragSource })) {
                                self._wijgrid._trigger("columnDragged", null, { drag: opt, dragSource: dragSource });
                                return true;
                            }
                        }

                        return false;
                    },
                    stop: function (e, ui) {
                        self._hideArrows();

                        try  {
                            if (self._dragEnd) {
                                if (!self._droppableColumn.element) {
                                    self._wijgrid._handleDragnDrop(column, null, "left", column instanceof grid.c1groupedfield, true);
                                } else {
                                    self._wijgrid._handleDragnDrop(column, self._droppableColumn, self._getPosition(column, self._droppableColumn, e, ui), column instanceof grid.c1groupedfield, self._droppableColumn instanceof grid.c1groupedfield);
                                }
                            }
                        } finally {
                            self._droppableColumn = null;
                            self._dragEnd = false;
                        }
                    }
                }).droppable({
                    hoverClass: self._wijCSS.stateHover,
                    scope: self._scope_guid,
                    tolerance: "pointer",
                    greedy: true,
                    accept: function (draggable) {
                        if (self._wijgrid.options.allowColMoving) {
                            if (element[0] !== draggable[0]) {
                                draggedColumn = self._getColumnInstance(draggable); // dragged column

                                if (draggedColumn) {
                                    return draggedColumn._canDropTo(column);
                                }
                            }
                        }
                        return false;
                    },
                    drop: function (e, ui) {
                        if (draggedColumn = self._getColumnInstance(ui.draggable)) {
                            // As droppable.drop fires before draggable.stop, let draggable to finish the action.
                            // Otherwise exception is thrown as during re-rendering element bound to draggable will be already deleted.
                            self._dragEnd = true;
                            // an alternative:
                            //window.setTimeout(function () {
                            //wijgrid._handleDragnDrop(draggedWijField, wijField, _getPosition(draggedWijField, wijField, e, ui));
                            //}, 100);
                        }
                    },
                    over: function (e, ui) {
                        self._dropTargetRedirected = false;
                        self._droppableColumn = column;

                        // to track when droppable.over event of other element fires before droppable.out of that element.
                        element.data("thisDroppableWijField", self._droppableColumn);
                    },
                    out: function (e, ui) {
                        if (self._droppableColumn === column.element.data("thisDroppableWijField")) {
                            self._droppableColumn = null;
                        }
                    }
                }); // ~droppable
            };

            uiDragndrop.prototype.detach = function (column) {
                var element;

                if (column && (element = column.element)) {
                    if (element.data("ui-draggable")) {
                        element.draggable("destroy");
                    }

                    if (element.data("ui-droppable")) {
                        element.droppable("destroy");
                    }
                }
            };

            uiDragndrop.prototype.dispose = function () {
                if (this._$topArrow) {
                    this._$topArrow.remove();
                    this._$topArrow = null;
                }

                if (this._$bottomArrow) {
                    this._$bottomArrow.remove();
                    this._$bottomArrow = null;
                }
            };

            // private
            uiDragndrop.prototype._getColumnInstance = function (draggable) {
                var instance = draggable.data(grid.widgetEmulator.DATA_INSTANCE_PROP);

                if (!instance) {
                    throw "Unable to get a column instance";
                }

                return instance;
            };

            // position: "left", "right", "center"
            uiDragndrop.prototype._showArrows = function (element, position) {
                this._topArrow().css("z-index", this.mZIndex).show().position({
                    my: "center",
                    at: position + " top",
                    of: element,
                    collision: "none"
                });

                this._bottomArrow().css("z-index", this.mZIndex).show().position({
                    my: "center",
                    at: position + " bottom",
                    of: element,
                    collision: "none"
                });
            };

            uiDragndrop.prototype._hideArrows = function () {
                this._topArrow().hide();
                this._bottomArrow().hide();
            };

            uiDragndrop.prototype._topArrow = function () {
                if (!this._$topArrow) {
                    this._$topArrow = $("<div />").addClass(wijmo.grid.wijgrid.CSS.dndArrowTopContainer + " " + this._wijCSS.wijgridDndArrowTopContainer).append($("<span />").addClass(this._wijCSS.icon + " " + this._wijCSS.iconArrowThickDown)).hide().appendTo(document.body);
                }

                return this._$topArrow;
            };

            uiDragndrop.prototype._bottomArrow = function () {
                if (!this._$bottomArrow) {
                    this._$bottomArrow = $("<div />").addClass(wijmo.grid.wijgrid.CSS.dndArrowBottomContainer + " " + this._wijCSS.wijgridDndArrowBottomContainer).append($("<span />").addClass(this._wijCSS.icon + " " + this._wijCSS.iconArrowThickUp)).hide().appendTo(document.body);
                }

                return this._$bottomArrow;
            };

            uiDragndrop.prototype._isInElement = function (e, element) {
                var bounds = wijmo.grid.bounds(element, false);
                return ((e.pageX > bounds.left && e.pageX < bounds.left + bounds.width) && (e.pageY > bounds.top && e.pageY < bounds.top + bounds.height));
            };

            uiDragndrop.prototype._getPosition = function (drag, drop, e, ui) {
                if (!drop.element) {
                    return "left";
                }

                if (this._dropTargetRedirected) {
                    return "right";
                }

                var bounds = wijmo.grid.bounds(drop.element, false), sixth = bounds.width / 6, centerX = bounds.left + (bounds.width / 2), result = "right", distance;

                if (e.pageX < centerX) {
                    result = "left";
                }

                if (drop instanceof grid.c1groupedfield) {
                    if (drag instanceof grid.c1groupedfield) {
                        distance = drop.options.groupedIndex - drag.options.groupedIndex;

                        if (Math.abs(distance) === 1) {
                            result = (distance < 0) ? "left" : "right";
                        }
                    }

                    return result;
                }

                // both drag and drop are non-grouped columns
                distance = drop.options.linearIdx - drag.options.linearIdx;

                if (grid.c1bandfield.test(drop.options) && (drag.options.parentIdx !== drop.options.travIdx) && (Math.abs(e.pageX - centerX) < sixth)) {
                    return "center";
                }

                // drag and drop are contiguous items of the same level
                if (drag.options.parentIdx === drop.options.parentIdx && Math.abs(distance) === 1) {
                    result = (distance < 0) ? "left" : "right";
                }

                return result;
            };
            return uiDragndrop;
        })();
        grid.uiDragndrop = uiDragndrop;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts" />
/// <reference path="wijgrid.ts" />
/// <reference path="misc.ts" />
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var cellStyleFormatterHelper = (function () {
            function cellStyleFormatterHelper(wijgrid) {
                if (!wijgrid) {
                    throw "invalid arguments";
                }

                this._wijgrid = wijgrid;
            }
            cellStyleFormatterHelper.prototype.format = function ($cell, cellIndex, column, rowInfo, state, cellAttr, cellStyle) {
                var $rs = wijmo.grid.renderState, $rt = wijmo.grid.rowType, rowType = rowInfo.type, groupRowCellInfo = null;

                if (cellIndex < this._wijgrid._virtualLeaves().length) {
                    column = null; //TODO: check
                }

                if (rowType === 16 /* groupHeader */ || rowType === 32 /* groupFooter */) {
                    column = null;

                    if (cellAttr && (groupRowCellInfo = cellAttr.groupInfo)) {
                        column = this._wijgrid._leaves()[groupRowCellInfo.leafIndex]; // replace "column" with the one associated with the $cell's content
                        //delete cellAttr.groupInfo;
                    }
                }

                var args = {
                    $cell: $cell,
                    state: state,
                    row: rowInfo,
                    column: column && column.options,
                    _cellIndex: cellIndex,
                    _purpose: groupRowCellInfo ? groupRowCellInfo.purpose : undefined
                };

                if (state & 1 /* rendering */) {
                    this._renderingStateFormatter(args, cellAttr, cellStyle);
                } else {
                    this._currentStateFormatter(args, state & 2 /* current */);

                    //hoveredStateFormatter(args, state & $rs.hovered);
                    this._selectedStateFormatter(args, state & 8 /* selected */);

                    if (rowType !== 1 /* header */) {
                        if ((state & 2 /* current */) || (state & 8 /* selected */)) {
                            args.$cell.addClass(this._wijgrid.options.wijCSS.stateDefault); // make bootstrap happy
                        } else {
                            args.$cell.removeClass(this._wijgrid.options.wijCSS.stateDefault);
                        }
                    }
                }

                if ($.isFunction(this._wijgrid.options.cellStyleFormatter)) {
                    this._wijgrid.options.cellStyleFormatter(args);
                }
            };

            // private ---
            cellStyleFormatterHelper.prototype._renderingStateFormatter = function (args, cellAttr, cellStyles) {
                var $rt = wijmo.grid.rowType, key, value, leaf = args.column, rowType = args.row.type, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;

                switch (rowType) {
                    case 1 /* header */:
                        args.$cell.addClass(defCSS.TH + " " + wijCSS.wijgridTH);
                        break;

                    default:
                        args.$cell.addClass(defCSS.TD + " " + wijCSS.wijgridTD);
                }

                if ((rowType & 2 /* data */) && leaf && leaf.textAlignment) {
                    switch (leaf.textAlignment.toLowerCase()) {
                        case "left":
                            args.$cell.addClass(defCSS.cellAlignLeft + " " + wijCSS.wijgridCellAlignLeft);
                            break;

                        case "right":
                            args.$cell.addClass(defCSS.cellAlignRight + " " + wijCSS.wijgridCellAlignRight);
                            break;

                        case "center":
                            args.$cell.addClass(defCSS.cellAlignCenter + " " + wijCSS.wijgridCellAlignCenter);
                            break;
                    }
                }

                // copy attributes
                if (cellAttr) {
                    for (key in cellAttr) {
                        if (cellAttr.hasOwnProperty(key)) {
                            value = cellAttr[key];

                            if ((key === "groupInfo" || key === "colSpan" || key === "rowSpan") && !(value > 1)) {
                                continue;
                            }

                            if (key === "class") {
                                args.$cell.addClass(value);
                            } else {
                                args.$cell.attr(key, value);
                            }
                        }
                    }
                }

                // copy inline css
                if (cellStyles) {
                    for (key in cellStyles) {
                        if (cellStyles.hasOwnProperty(key)) {
                            if (key === "paddingLeft") {
                                args.$cell.children("." + defCSS.cellContainer).css(key, cellStyles[key]);
                                continue;
                            }
                            args.$cell.css(key, cellStyles[key]);
                        }
                    }
                }

                if (args._cellIndex < this._wijgrid._virtualLeaves().length) {
                    args.$cell.attr({ "role": "rowheader", "scope": "row" }).addClass(wijCSS.stateDefault + " " + wijCSS.content + " " + defCSS.rowHeader + " " + wijCSS.wijgridRowHeader);
                } else {
                    switch (rowType) {
                        case (1 /* header */):
                            args.$cell.attr({ "role": "columnheader", "scope": "col" });
                            break;
                        case (64 /* footer */):
                            args.$cell.attr({ "role": "columnfooter", "scope": "col" });
                            break;
                        default:
                            args.$cell.attr("role", "gridcell");
                    }
                }

                if (rowType & 2 /* data */) {
                    if (args._cellIndex >= 0 && leaf) {
                        args.$cell.attr("headers", window.escape(leaf.headerText));

                        if (leaf.readOnly) {
                            args.$cell.attr("aria-readonly", true);
                        }

                        if (leaf.dataIndex >= 0) {
                            args.$cell.addClass("wijdata-type-" + wijmo.grid.getDataType(leaf));
                        }
                    }
                }

                if (rowType === 16 /* groupHeader */ || rowType === 32 /* groupFooter */) {
                    // append wijdata-type class only to the aggregate cells of the group row, not grouped cells.
                    if (leaf && args._purpose === 1 /* aggregateCell */) {
                        args.$cell.addClass("wijdata-type-" + wijmo.grid.getDataType(leaf));
                    }
                }
            };

            cellStyleFormatterHelper.prototype._currentStateFormatter = function (args, add) {
                var $rt = wijmo.grid.rowType, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;

                if (add) {
                    args.$cell.addClass(wijCSS.stateActive);

                    if (args.row.type === 1 /* header */) {
                        args.$cell.addClass(defCSS.currentHeaderCell + " " + wijCSS.wijgridCurrentHeaderCell);
                    } else {
                        args.$cell.addClass(defCSS.currentCell + " " + wijCSS.wijgridCurrentCell);
                    }
                } else {
                    args.$cell.removeClass(wijCSS.stateActive);

                    if (args.row.type === 1 /* header */) {
                        args.$cell.removeClass(defCSS.currentHeaderCell + " " + wijCSS.wijgridCurrentHeaderCell);
                    } else {
                        args.$cell.removeClass(defCSS.currentCell + " " + wijCSS.wijgridCurrentCell);
                    }
                }
            };

            cellStyleFormatterHelper.prototype._hoveredStateFormatter = function (args, add) {
                if (add) {
                } else {
                }
            };

            cellStyleFormatterHelper.prototype._selectedStateFormatter = function (args, add) {
                var wijCSS = this._wijgrid.options.wijCSS;

                if (add) {
                    args.$cell.addClass(wijCSS.stateHighlight).attr("aria-selected", "true");
                } else {
                    args.$cell.removeClass(wijCSS.stateHighlight).removeAttr("aria-selected");
                }
            };
            return cellStyleFormatterHelper;
        })();
        grid.cellStyleFormatterHelper = cellStyleFormatterHelper;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts" />
/// <reference path="wijgrid.ts" />
/// <reference path="misc.ts" />
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var rowStyleFormatterHelper = (function () {
            function rowStyleFormatterHelper(wijgrid) {
                if (!wijgrid) {
                    throw "invalid arguments";
                }

                this._wijgrid = wijgrid;
            }
            rowStyleFormatterHelper.prototype.format = function (rowInfo, rowAttr, rowStyle) {
                var $rs = wijmo.grid.renderState, $rt = wijmo.grid.rowType, state = rowInfo.state, args = rowInfo;

                if (state & 1 /* rendering */) {
                    this._renderingStateFormatter(args, rowAttr, rowStyle);
                } else {
                    this._currentStateFormatter(args, (state & 2 /* current */) !== 0);
                    this._hoveredStateFormatter(args, (state & 4 /* hovered */) !== 0);
                    this._selectedStateFormatter(args, (state & 8 /* selected */) !== 0);
                }

                if ($.isFunction(this._wijgrid.options.rowStyleFormatter)) {
                    this._wijgrid.options.rowStyleFormatter(args);
                }
            };

            rowStyleFormatterHelper.prototype._groupFormatter = function (rowInfo) {
                var rse = wijmo.grid.renderStateEx, extInfo = rowInfo._extInfo, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;

                if (extInfo.state & 1 /* hidden */) {
                    rowInfo.$rows.css("display", "none");
                    //rowInfo.$rows.attr("aria-hidden", true);
                } else {
                    rowInfo.$rows.css("display", "");
                    //rowInfo.$rows.removeAttr("aria-hidden");
                }

                if (rowInfo.type & 16 /* groupHeader */) {
                    var gi = this._wijgrid._groupedLeaves()[rowInfo._extInfo.groupLevel - 1].options.groupInfo, expandedIcon = gi.expandedImageClass || wijCSS.iconArrowRightDown, collapsedIcon = gi.collapsedImageClass || wijCSS.iconArrowRight, toggleBtn = wijmo.grid.rowAccessor.getCell$(rowInfo.$rows, this._wijgrid._showRowHeader() ? 1 : 0).find("." + defCSS.groupToggleVisibilityButton);

                    if (extInfo.state & 2 /* collapsed */) {
                        rowInfo.$rows.attr("aria-expanded", false);

                        rowInfo.$rows.removeClass(defCSS.groupHeaderRowExpanded + " " + wijCSS.wijgridGroupHeaderRowExpanded).addClass(defCSS.groupHeaderRowCollapsed + " " + wijCSS.wijgridGroupHeaderRowCollapsed);

                        toggleBtn.removeClass(expandedIcon).addClass(collapsedIcon);
                    } else {
                        rowInfo.$rows.attr("aria-expanded", true);

                        rowInfo.$rows.removeClass(defCSS.groupHeaderRowCollapsed + " " + wijCSS.wijgridGroupHeaderRowCollapsed).addClass(defCSS.groupHeaderRowExpanded + " " + wijCSS.wijgridGroupHeaderRowExpanded);

                        toggleBtn.removeClass(collapsedIcon).addClass(expandedIcon);
                    }
                }
            };

            // * private
            rowStyleFormatterHelper.prototype._renderingStateFormatter = function (args, rowAttr, rowStyle) {
                var defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS, className, contentClass = defCSS.row + " " + wijCSS.wijgridRow + " " + wijCSS.content, $rt = wijmo.grid.rowType, rse = wijmo.grid.renderStateEx, key;

                args.$rows.attr("role", "row");

                // copy attributes
                if (rowAttr) {
                    for (key in rowAttr) {
                        if (rowAttr.hasOwnProperty(key)) {
                            if (key === "class") {
                                args.$rows.addClass(rowAttr[key]);
                            } else {
                                args.$rows.attr(key, rowAttr[key]);

                                if (args.$rows[0].style.height) {
                                    args.$rows.each(function () {
                                        $.data(this, "customHeight", this.style.height);
                                        return true;
                                    });
                                }
                            }
                        }
                    }
                }

                // copy inline css
                if (rowStyle) {
                    for (key in rowStyle) {
                        if (rowStyle.hasOwnProperty(key)) {
                            args.$rows.css(key, rowStyle[key]);
                        }
                    }
                }

                if (args._extInfo.groupLevel) {
                    args.$rows.attr("aria-level", args._extInfo.groupLevel);
                }

                // hide collapsed row
                if (args._extInfo.state & 1 /* hidden */) {
                    args.$rows.css("display", "none");
                    // args.$rows.attr("aria-hidden", true);
                }

                switch (args.type & ~(4 /* dataAlt */ | 256 /* detail */)) {
                    case (1 /* header */):
                        className = defCSS.headerRow + " " + wijCSS.wijgridHeaderRow;
                        break;

                    case (2 /* data */):
                        className = contentClass + " " + defCSS.dataRow + " " + wijCSS.wijgridDataRow;

                        if (args.type & 4 /* dataAlt */) {
                            className += " " + defCSS.altRow + " " + wijCSS.wijgridAltRow;
                        }

                        break;

                    case (128 /* emptyDataRow */):
                        className = contentClass + " " + defCSS.emptyDataRow + " " + wijCSS.wijgridEmptyDataRow;
                        break;

                    case (8 /* filter */):
                        className = defCSS.filterRow + " " + wijCSS.wijgridFilterRow;
                        break;

                    case (16 /* groupHeader */):
                        args.$rows.attr({
                            "id": "GH" + args._extInfo.groupIndex + "-" + args._extInfo.groupLevel,
                            "aria-expanded": ((args._extInfo.state & 2 /* collapsed */) === 0)
                        });

                        className = contentClass + " " + defCSS.groupHeaderRow + " " + wijCSS.wijgridGroupHeaderRow + " ";

                        className += (args._extInfo.state & 2 /* collapsed */) ? defCSS.groupHeaderRowCollapsed + " " + wijCSS.wijgridGroupHeaderRowCollapsed : defCSS.groupHeaderRowExpanded + " " + wijCSS.wijgridGroupHeaderRowExpanded;

                        break;

                    case (32 /* groupFooter */):
                        args.$rows.attr("id", "GF" + args._extInfo.groupIndex + "-" + args._extInfo.groupLevel);

                        className = contentClass + " " + defCSS.groupFooterRow + " " + wijCSS.wijgridGroupFooterRow;
                        break;

                    case (64 /* footer */):
                        className = defCSS.footerRow + " " + wijCSS.wijgridFooterRow + " " + wijCSS.stateDefault + " " + wijCSS.stateHighlight;
                        break;

                    default:
                        throw wijmo.grid.stringFormat("unknown rowType: {0}", args.type);
                }

                args.$rows.addClass(className);
            };

            rowStyleFormatterHelper.prototype._currentStateFormatter = function (args, flag) {
                if (this._wijgrid._showRowHeader()) {
                    var wijCSS = this._wijgrid.options.wijCSS, defCSS = wijmo.grid.wijgrid.CSS;

                    // make deal with the row header cell
                    if (flag) {
                        $(args.$rows[0].cells[0]).addClass(wijCSS.stateActive + " " + defCSS.currentRowHeaderCell + " " + wijCSS.wijgridCurrentRowHeaderCell);
                    } else {
                        $(args.$rows[0].cells[0]).removeClass(wijCSS.stateActive + " " + defCSS.currentRowHeaderCell + " " + wijCSS.wijgridCurrentRowHeaderCell);
                    }
                }
            };

            rowStyleFormatterHelper.prototype._hoveredStateFormatter = function (args, flag) {
                var wijCSS = this._wijgrid.options.wijCSS;

                if (flag) {
                    args.$rows.addClass(wijCSS.stateDefault + " " + wijCSS.stateHover);
                } else {
                    args.$rows.removeClass(wijCSS.stateDefault + " " + wijCSS.stateHover);

                    if (args.type & 2 /* data */) {
                        args.$rows.addClass(wijCSS.wijgridDataRow); // bootsrap issue, both stateDefault and wijgridDataRow contains the same class "btn", restore it.
                    }
                }
            };

            rowStyleFormatterHelper.prototype._selectedStateFormatter = function (args, flag) {
                if (flag) {
                } else {
                }
            };
            return rowStyleFormatterHelper;
        })();
        grid.rowStyleFormatterHelper = rowStyleFormatterHelper;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var tally = (function () {
            function tally(parser) {
                this._sum = 0;
                this._sum2 = 0;
                this._cntNumbers = 0;
                this._cntStrings = 0;
                this._cntDates = 0;
                this._max = 0;
                this._min = 0;
                this._minDate = 0;
                this._maxDate = 0;
                this._parser = parser;
            }
            tally.prototype.add = function (value) {
                if (value === null) {
                    return;
                }

                var typeOf = (value instanceof Date) ? "datetime" : typeof (value);

                // * count strings *
                var foo = value.toString();

                if (this._cntStrings++ === 0) {
                    this._minString = this._maxString = foo;
                }

                if (foo < this._minString) {
                    this._minString = foo;
                }

                if (foo > this._maxString) {
                    this._maxString = foo;
                }

                // * count numbers *
                var numberValue = this._parseValue(value);
                if ((typeof (numberValue) === "number") && !wijmo.grid.isNaN(numberValue)) {
                    value = numberValue;

                    if (this._cntNumbers++ === 0) {
                        this._min = this._max = value;
                    }

                    this._sum += value;
                    this._sum2 += value * value;

                    if (value < this._min) {
                        this._min = value;
                    }

                    if (value > this._max) {
                        this._max = value;
                    }
                } else {
                    // * count dates *
                    if (typeOf === "datetime") {
                        foo = value.getTime();

                        if (this._cntDates++ === 0) {
                            this._minDate = this._maxDate = foo;
                        }

                        if (foo < this._minDate) {
                            this._minDate = foo;
                        }

                        if (foo > this._maxDate) {
                            this._maxDate = foo;
                        }
                    }
                }
            };

            tally.prototype.getValue = function (column) {
                var opt = column.options;

                if (this._cntNumbers && ((opt.dataType === "number" || opt.dataType === "currency") || (this._cntNumbers == this._cntStrings))) {
                    return this._getValue(opt.aggregate);
                }

                // we only support max/min and count for dates
                if (this._cntDates && (opt.dataType === "datetime")) {
                    switch (opt.aggregate) {
                        case "max":
                            return new Date(this._maxDate);

                        case "min":
                            return new Date(this._minDate);

                        case "count":
                            return this._cntStrings;
                    }
                }

                // we only support max/min and count for strings
                if (this._cntStrings) {
                    switch (opt.aggregate) {
                        case "max":
                            return this._maxString;

                        case "min":
                            return this._minString;

                        case "count":
                            return this._cntStrings;
                    }
                }

                return "";
            };

            tally.prototype.getValueString = function (column, strConverter) {
                var opt = column.options, value = this.getValue(column);

                if (typeof (value) !== "string") {
                    if ((opt.aggregate === "count") && (opt.dataType !== "number")) {
                        opt = {
                            dataType: "number",
                            dataFormatString: "n0"
                        };
                    }

                    value = strConverter.toStr(opt, value);
                }

                return value;
            };

            tally.prototype._parseValue = function (value) {
                var typeOf = typeof (value);

                if (typeOf === "number") {
                    return value;
                }

                if (typeOf === "string" && $.trim(value) === "") {
                    return 0;
                }

                if (this._parser) {
                    var testValue;

                    try  {
                        testValue = this._parser.parse({ dataType: "currency" }, value);
                    } catch (e) {
                        testValue = NaN;
                    }

                    if (grid.isNaN(testValue)) {
                        testValue = parseFloat(value);
                    }

                    if (!grid.isNaN(testValue)) {
                        return testValue;
                    }
                }

                return value;
            };

            tally.prototype._getValue = function (aggregate) {
                switch (aggregate) {
                    case "average":
                        return (this._cntNumbers === 0) ? 0 : this._sum / this._cntNumbers;

                    case "count":
                        return this._cntStrings;

                    case "max":
                        return this._max;

                    case "min":
                        return this._min;

                    case "sum":
                        return this._sum;

                    case "std":
                        if (this._cntNumbers <= 1) {
                            return 0;
                        }

                        return Math.sqrt(this._getValue("var"));

                    case "stdPop":
                        if (this._cntNumbers <= 1) {
                            return 0;
                        }

                        return Math.sqrt(this._getValue("varPop"));

                    case "var":
                        if (this._cntNumbers <= 1) {
                            return 0;
                        }

                        return this._getValue("varPop") * this._cntNumbers / (this._cntNumbers - 1);

                    case "vapPop":
                        if (this._cntNumbers <= 1) {
                            return 0;
                        }

                        var tmp = this._sum / this._cntNumbers;
                        return this._sum2 / this._cntNumbers - tmp * tmp;
                }

                return 0;
            };
            return tally;
        })();
        grid.tally = tally;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
/// <reference path="wijgrid.ts"/>
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var uiFrozener = (function () {
            function uiFrozener(wijgrid) {
                this._docEventsUID = "wijgridfrozener" + wijmo.grid.getUID();
                this._docEventsAttached = false;
                this._newStaticIndex = -1;
                this._staticColumnIndex = -1;
                this._staticRowIndex = -1;
                this._staticOffsetH = 0;
                this._staticOffsetV = 0;
                this._inProgress = false;
                this._wijgrid = wijgrid;

                this.refresh();
            }
            uiFrozener.prototype.inProgress = function () {
                return this._inProgress;
            };

            uiFrozener.prototype.refresh = function () {
                this.dispose();

                var freezingMode = this._wijgrid._lgGetFreezingMode();

                if (freezingMode !== "none") {
                    this._$outerDiv = this._wijgrid.mOuterDiv.find("." + wijmo.grid.wijgrid.CSS.fixedView);
                    this._superPanel = this._wijgrid._view()._getSuperPanel();
                    this._staticOffsetH = this._wijgrid._getStaticOffsetIndex(false);
                    this._staticOffsetV = this._wijgrid._getStaticOffsetIndex(true);
                    this._staticColumnIndex = this._wijgrid._getStaticIndex(false);
                    this._staticRowIndex = this._wijgrid._getStaticIndex(true);
                    this._visibleBounds = this._wijgrid._view().getVisibleContentAreaBounds(); //.getVisibleAreaBounds();

                    var allFixedAreaBounds = wijmo.grid.bounds(this._$outerDiv.find(".wijmo-wijgrid-split-area-nw")), containerBounds = wijmo.grid.bounds(this._$outerDiv);

                    // if staticColumnsAlignment is "right" then create vbar only when staticColumnIndex is set (vbar dragging ability is disabled in this case)
                    if ((freezingMode === "both" || freezingMode === "columns") && (this._wijgrid._lgGetStaticColumnsAlignment() !== "right" || this._staticColumnIndex >= 0)) {
                        this._createVBar(this._visibleBounds, allFixedAreaBounds, containerBounds);
                    }

                    if ((freezingMode === "both" || freezingMode === "rows") && !this._wijgrid._serverSideVirtualScrolling()) {
                        this._createHBar(this._visibleBounds, allFixedAreaBounds, containerBounds);
                    }
                }
            };

            uiFrozener.prototype.dispose = function () {
                if (this._$hBar) {
                    this._$hBar.remove();
                    this._$hBar = null;
                }

                if (this._$vBar) {
                    this._$vBar.remove();
                    this._$vBar = null;
                }

                if (this._$proxy) {
                    this._$proxy.remove();
                    this._$proxy = null;
                }

                this._$outerDiv = null;
                this._superPanel = null;

                this._detachDocEvents();
            };

            uiFrozener.prototype._createVBar = function (visibleBounds, allFixedAreaBounds, containerBounds) {
                var lAlign = (this._wijgrid._lgGetStaticColumnsAlignment() !== "right"), leftPos = lAlign ? allFixedAreaBounds.width + allFixedAreaBounds.left : allFixedAreaBounds.left - 2, self = this, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;

                if (leftPos <= visibleBounds.left + visibleBounds.width) {
                    this._$vBar = $("<div><div></div></div>").addClass(defCSS.freezingHandleV + " " + wijCSS.wijgridFreezingHandleV).addClass(lAlign ? "" : "not-allowed").css({
                        left: leftPos - containerBounds.left,
                        top: allFixedAreaBounds.top - containerBounds.top,
                        height: visibleBounds.height + visibleBounds.top - allFixedAreaBounds.top
                    }).bind("mousedown", function (e) {
                        e.data = true; // vertical bar
                        self._onBarMouseDown.apply(self, arguments);
                    }).appendTo(this._$outerDiv);

                    // content
                    this._$vBar.find("div").addClass(defCSS.freezingHandleContent + " " + wijCSS.header);
                }
            };

            uiFrozener.prototype._createHBar = function (visibleBounds, allFixedAreaBounds, containerBounds) {
                var topPos = allFixedAreaBounds.top + allFixedAreaBounds.height, lAlign = (this._wijgrid._lgGetStaticColumnsAlignment() !== "right"), self = this, defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;

                if (topPos <= visibleBounds.top + visibleBounds.height) {
                    this._$hBar = $("<div><div></div></div>").addClass(defCSS.freezingHandleH + " " + wijCSS.wijgridFreezingHandleH).css({
                        left: lAlign ? allFixedAreaBounds.left - containerBounds.left : 0,
                        top: topPos - containerBounds.top,
                        width: lAlign ? visibleBounds.width + visibleBounds.left - allFixedAreaBounds.left : visibleBounds.width
                    }).bind("mousedown", function (e) {
                        e.data = false; // horizontal bar
                        self._onBarMouseDown.apply(self, arguments);
                    }).appendTo(this._$outerDiv);

                    // content
                    this._$hBar.find("div").addClass(defCSS.freezingHandleContent + " " + wijCSS.header);
                }
            };

            // e.data: true = vertical, false = horizontal
            uiFrozener.prototype._onBarMouseDown = function (e) {
                if (this._wijgrid.options.disabled || (this._wijgrid._lgGetStaticColumnsAlignment() === "right" && e.data)) {
                    return false;
                }

                var defCSS = wijmo.grid.wijgrid.CSS, wijCSS = this._wijgrid.options.wijCSS;

                this._visibleBounds = this._wijgrid._view().getVisibleContentAreaBounds(); //.getVisibleAreaBounds();

                this._newStaticIndex = e.data ? this._staticColumnIndex : this._staticRowIndex;

                this._$proxy = $("<div class=\"" + defCSS.resizingHandle + " " + wijCSS.wijgridResizingHandle + " " + wijCSS.header + "\"></div>").appendTo(document.body);

                this._attachDocEvents(e.data);

                this._inProgress = true;

                // prevent selectionUI from taking effect
                e.stopPropagation();
            };

            uiFrozener.prototype._onDocumentMouseMove = function (e) {
                if (e.data && this._superPanel.options.hScroller.scrollValue) {
                    this._superPanel.hScrollTo(0);
                } else if (!e.data && this._superPanel.options.vScroller.scrollValue) {
                    this._superPanel.vScrollTo(0);
                }

                this._showPosition(e);
            };

            uiFrozener.prototype._onDocumentMouseUp = function (e) {
                try  {
                    if (this._$proxy) {
                        this._$proxy.remove();
                    }

                    this._detachDocEvents();

                    if (e.data) {
                        if (this._newStaticIndex !== this._staticColumnIndex) {
                            this._wijgrid.option("staticColumnIndex", this._newStaticIndex);
                        }
                    } else {
                        if (this._newStaticIndex !== this._staticRowIndex) {
                            this._wijgrid.option("staticRowIndex", this._newStaticIndex);
                        }
                    }
                } finally {
                    this._$proxy = null;
                    this._inProgress = false;
                }
            };

            uiFrozener.prototype._attachDocEvents = function (verticalBarTouched) {
                if (!this._docEventsAttached) {
                    try  {
                        if ($.fn.disableSelection) {
                            $(document.body).disableSelection();
                        }

                        this._wijgrid._view().toggleDOMSelection(false);

                        $(document).bind(this._docEventKey("mousemove"), verticalBarTouched, $.proxy(this._onDocumentMouseMove, this)).bind(this._docEventKey("mouseup"), verticalBarTouched, $.proxy(this._onDocumentMouseUp, this));
                    } finally {
                        this._docEventsAttached = true;
                    }
                }
            };

            uiFrozener.prototype._detachDocEvents = function () {
                if (this._docEventsAttached) {
                    try  {
                        if ($.fn.enableSelection) {
                            $(document.body).enableSelection();
                        }

                        this._wijgrid._view().toggleDOMSelection(true);

                        $(document).unbind("." + this._docEventsUID);
                    } finally {
                        this._docEventsAttached = false;
                    }
                }
            };

            uiFrozener.prototype._docEventKey = function (eventName) {
                return wijmo.grid.stringFormat("{0}.{1}", eventName, this._docEventsUID);
            };

            uiFrozener.prototype._showPosition = function (e) {
                var colPosInfo, elementBounds, centerXOrY, currentIdx, prevIdx, leftOrTop, position, barBounds, lAlign = (this._wijgrid._lgGetStaticColumnsAlignment() !== "right");

                if (e.data) {
                    barBounds = wijmo.grid.bounds(this._$vBar);

                    if (Math.abs(e.pageX - (barBounds.left + barBounds.width / 2)) < barBounds.width) {
                        this._$proxy.hide();
                        return;
                    }

                    if ((colPosInfo = this._getFieldByPos({ x: e.pageX, y: e.pageY }))) {
                        elementBounds = wijmo.grid.bounds(colPosInfo.element);
                        centerXOrY = elementBounds.left + elementBounds.width / 2;
                        currentIdx = colPosInfo.column.options.visLeavesIdx - this._staticOffsetV;
                        prevIdx = Math.max(currentIdx - 1, -1);
                        leftOrTop = e.pageX < centerXOrY ? (prevIdx !== this._staticColumnIndex) : (currentIdx === this._staticColumnIndex);
                        position = leftOrTop ? elementBounds.left : elementBounds.left + elementBounds.width;

                        if (!wijmo.grid.isOverAxis(position, this._visibleBounds.left - 1, this._visibleBounds.width + 2)) {
                            return;
                        }

                        this._newStaticIndex = leftOrTop ? prevIdx : currentIdx;

                        this._$proxy.show().css({
                            left: position,
                            top: elementBounds.top,
                            width: 3,
                            height: this._visibleBounds.height + this._visibleBounds.top - elementBounds.top
                        });
                    }
                } else {
                    barBounds = wijmo.grid.bounds(this._$hBar);

                    if (Math.abs(e.pageY - (barBounds.top + barBounds.height / 2)) < barBounds.height) {
                        this._$proxy.hide();
                        return;
                    }

                    var row;

                    if ((row = this._getRowByPos({ x: e.pageX, y: e.pageY }))) {
                        elementBounds = wijmo.grid.bounds(row);
                        centerXOrY = elementBounds.top + elementBounds.height / 2;
                        currentIdx = this._wijgrid._view().getAbsoluteRowIndex(row) - this._staticOffsetH;
                        prevIdx = Math.max(currentIdx - 1, -1);
                        leftOrTop = e.pageY < centerXOrY ? (prevIdx !== this._staticRowIndex) : (currentIdx === this._staticRowIndex);
                        position = leftOrTop ? elementBounds.top : elementBounds.top + elementBounds.height;

                        if (!wijmo.grid.isOverAxis(position, this._visibleBounds.top - 1, this._visibleBounds.height + 2)) {
                            return;
                        }

                        this._newStaticIndex = leftOrTop ? prevIdx : currentIdx;

                        this._$proxy.show().css({
                            left: lAlign ? elementBounds.left : this._visibleBounds.left,
                            top: position,
                            width: lAlign ? this._visibleBounds.width + this._visibleBounds.left - elementBounds.left : this._visibleBounds.width,
                            height: 3
                        });
                    }
                }
            };

            uiFrozener.prototype._getFieldByPos = function (pos) {
                var columns = this._wijgrid.columns(), dataRow = undefined;

                for (var i = 0, len = columns.length; i < len; i++) {
                    var instance = columns[i], opt = instance.options;

                    if (opt.isLeaf) {
                        var bounds = null, element;

                        if (instance.element) {
                            bounds = wijmo.grid.bounds(element = instance.element);
                        } else {
                            if (dataRow == undefined) {
                                dataRow = this._wijgrid._rows().find(0, function (row) {
                                    return (row.type & 2 /* data */) !== 0;
                                });
                            }

                            if (dataRow) {
                                var cell = grid.rowAccessor.getCell(dataRow.$rows, opt.visLeavesIdx);
                                if (cell) {
                                    bounds = wijmo.grid.bounds(element = $(cell));
                                }
                            }
                        }

                        if (bounds && wijmo.grid.isOverAxis(pos.x, bounds.left, bounds.width)) {
                            return {
                                column: instance,
                                element: element
                            };
                        }
                    }
                }

                return null;
            };

            uiFrozener.prototype._getRowByPos = function (pos) {
                var rows = this._wijgrid._rows(), i, len, row, bounds;

                for (i = 0, len = rows.length(); i < len; i++) {
                    row = rows.item(i)[0];
                    bounds = wijmo.grid.bounds($(row));

                    if (wijmo.grid.isOverAxis(pos.y, bounds.top, bounds.height)) {
                        return row;
                    }
                }

                return null;
            };
            return uiFrozener;
        })();
        grid.uiFrozener = uiFrozener;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
/// <reference path="bands_traversing.ts"/>
/// <reference path="misc.ts"/>
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var columnsGenerator = (function () {
            function columnsGenerator() {
            }
            columnsGenerator.generate = function (mode, fieldsInfo, columns) {
                mode = (mode || "").toLowerCase();

                switch (mode) {
                    case "append":
                        columnsGenerator._processAppendMode(fieldsInfo, columns);
                        break;

                    case "merge":
                        columnsGenerator._processMergeMode(fieldsInfo, columns);
                        break;

                    case "none":
                        break;

                    default:
                        throw wijmo.grid.stringFormat("Unsupported value: \"{0}\"", mode);
                }
            };

            columnsGenerator._processAppendMode = function (fieldsInfo, columns) {
                var autoColumns = {};

                wijmo.grid.traverse(columns, function (column) {
                    if (column.dynamic && wijmo.grid.validDataKey(column.dataKey)) {
                        autoColumns[column.dataKey] = true;
                    }
                });

                $.each(fieldsInfo, function (key, fieldInfo) {
                    if (("name" in fieldInfo) && !autoColumns[fieldInfo.name]) {
                        columns.push(columnsGenerator._createAutoField(fieldInfo));
                    }
                });
            };

            columnsGenerator._processMergeMode = function (fieldsInfo, columns) {
                var columnsHasNoDataKey = [];

                wijmo.grid.traverse(columns, function (column) {
                    if (column.isLeaf && columnsGenerator._isBindableColumn(column)) {
                        var dataKey = column.dataKey;

                        if (wijmo.grid.validDataKey(dataKey)) {
                            if (fieldsInfo[dataKey] !== undefined) {
                                delete fieldsInfo[dataKey];
                            }
                        } else {
                            if (dataKey !== null) {
                                columnsHasNoDataKey.push(column);
                            }
                        }
                    }
                });

                if (columnsHasNoDataKey.length) {
                    var i = 0;

                    $.each(fieldsInfo, function (key, info) {
                        var leaf = columnsHasNoDataKey[i++];
                        if (leaf) {
                            leaf.dataKey = info.name;
                            delete fieldsInfo[key];
                        }
                    });
                }

                $.each(fieldsInfo, function (key, info) {
                    columns.push(columnsGenerator._createAutoField(info));
                });
            };

            columnsGenerator._createAutoField = function (fieldInfo) {
                return wijmo.grid.createDynamicField({ dataKey: fieldInfo.name });
            };

            columnsGenerator._isBindableColumn = function (column) {
                return !grid.c1bandfield.test(column) && !grid.c1rowheaderfield.test(column) && !grid.c1buttonbasefield.test(column) && !grid.c1buttonfield.test(column) && !grid.c1commandbuttonfield.test(column);
            };
            return columnsGenerator;
        })();
        grid.columnsGenerator = columnsGenerator;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts"/>
var wijmo;
(function (wijmo) {
    (function (grid) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        var uiVirtualScroller = (function () {
            function uiVirtualScroller(wijgrid, $content, fixedAreaHeight, rowOuterHeight) {
                //private _fixedAreaHeight: number;
                this._timer = 0;
                this._timeout = 50;
                this._ignoreScrollEvents = false;
                this._debounceScrolledEvent = true;
                this.mScrollLeftPos = undefined;
                this.mScrollTopPos = undefined;
                this.mVertical = false;
                this.mHorizontal = false;
                this._wijgrid = wijgrid;

                this.mVertical = wijgrid._allowVVirtualScrolling();
                this.mHorizontal = wijgrid._allowHVirtualScrolling();

                //this._fixedAreaHeight = fixedAreaHeight;
                this._$content = $content;

                this._view = this._wijgrid._view();

                if (this.mVertical) {
                    this._N = this._wijgrid._renderableRowsCount();

                    this._rowOuterHeight = rowOuterHeight;

                    this._updateContentHeight();

                    var height = this._wijgrid.mOuterDiv.height() + this._N * this._rowOuterHeight;
                    this._view._splitAreas.sw.height(height);
                }
            }
            uiVirtualScroller.prototype.scrollToColumn = function (column, left, callback) {
                this._debounceScrolledEvent = false; // otherwise sequential method calls will be blocked by timer
                this._completeListener = callback;
                this._panelInst.hScrollTo(left, false);
            };

            uiVirtualScroller.prototype.scrollToRow = function (rowIndex, callback) {
                this._debounceScrolledEvent = false; // otherwise sequential method calls will be blocked by timer
                this._completeListener = callback;
                this._panelInst.vScrollTo(rowIndex * this._panelInst.options.vScroller.scrollSmallChange, true);
            };

            /** calculate content height from row number, row height and fixed area */
            uiVirtualScroller.prototype._updateContentHeight = function () {
                // subtract _fixedAreaHeight, otherwise dummy rows will be hanging "under" the grid
                this._$content.height(this._rowOuterHeight * this._N);
            };

            uiVirtualScroller.prototype.attach = function ($scroller) {
                this._$scroller = $scroller;
                this._panelInst = $scroller.data("wijmo-wijsuperpanel");

                if (this.mVertical) {
                    this._updateContentHeight();
                    this._updateVerticalScroller();
                }

                $scroller.bind("wijsuperpanelscrolled.wijgrid", $.proxy(this._onSuperpanelScrolled, this));
                $scroller.bind("wijsuperpanelscrolling.wijgrid", $.proxy(this._onSuperpanelScrolling, this));
                $scroller.bind("wijsuperpanelscrolled.wijgrid", $.proxy(this._onSuperpanelPostScrolled, this)); // manipulate with the _ignoreScrollEvents property.
            };

            uiVirtualScroller.prototype._updateVerticalScroller = function () {
                // if vScroll.scrollValue was an y-offset of the content, rather than a percentage of the offset,
                // smallChange and max would be in pixels
                var max = Math.max(0, this._N - (this._view.getVirtualPageSize() - 1));

                // scrollValue is the index of the first row to show
                this._setVerticalScrollerOptions(1, max);
            };

            uiVirtualScroller.prototype._setVerticalScrollerOptions = function (smallChange, max) {
                var vScroller = this._panelInst.options.vScroller;
                vScroller.scrollSmallChange = smallChange;
                vScroller.scrollLargeChange = smallChange * 4;

                // temporary workaround for superpanel bug
                max += vScroller.scrollLargeChange - 1;

                vScroller.scrollMax = max;

                this._panelInst.option("vScroller", vScroller);

                // TODO: rewrite!!
                if (!this._view._isNativeSuperPanel() && (this._panelInst._scrollDrag != undefined)) {
                    var f = this._panelInst._fields(), vbarContainer = f.vbarContainer, vbarDrag = f.vbarDrag;

                    this._panelInst._scrollDrag("v", vbarContainer, vbarDrag, false);
                }
            };

            uiVirtualScroller.prototype._changeVisibleRowsCount = function (visibleRowsCount) {
                this._N = visibleRowsCount;
                this._updateContentHeight();
                this._updateVerticalScroller();
            };

            uiVirtualScroller.prototype.dispose = function () {
                this._$scroller.unbind(".wijgrid");
                this._clearTimer();
            };

            uiVirtualScroller.prototype._clearTimer = function () {
                window.clearTimeout(this._timer);
                this._timer = 0;
            };

            uiVirtualScroller.prototype._onSuperpanelScrolling = function (e, args) {
                if (this._ignoreScrollEvents || (args.dir === "v" && !this.mVertical) || (args.dir === "h" && !this.mHorizontal)) {
                    //if (this._ignoreScrollEvents || (args.dir !== "v")) {
                    return;
                }

                if (this._timer === -1) {
                    return false;
                }
            };

            uiVirtualScroller.prototype._onSuperpanelScrolled = function (e, args) {
                var self = this;

                if (this._ignoreScrollEvents || (args.dir === "v" && !this.mVertical) || (args.dir === "h" && !this.mHorizontal)) {
                    //if (this._ignoreScrollEvents || (args.dir !== "v")) {
                    return;
                }

                if (this._timer > 0) {
                    this._clearTimer();
                }

                if (this._timer !== -1) {
                    this._timer = window.setTimeout(function () {
                        self._timer = -1; // lock

                        var doHScroll = false, leftPos = -args.afterPosition.left, newRange;

                        if (window.console) {
                            window.console.log(leftPos + " " + self._debounceScrolledEvent);
                        }

                        if (args.dir === "h") {
                            var newRange = new grid.renderableColumnsCollection();

                            self._view._getRenderableColumnsBounds(newRange, leftPos);
                            doHScroll = !self._wijgrid._renderableColumnsRange().equals(newRange);
                        } else {
                            var scrollToIndex = Math.floor(args.newValue / self._panelInst.options.vScroller.scrollSmallChange), oldScrollIndex = self._view._bounds.start;

                            if (scrollToIndex < 0) {
                                scrollToIndex = 0;
                            }

                            if (scrollToIndex >= self._N) {
                                scrollToIndex = self._N - 1;
                            }
                        }

                        if ((scrollToIndex !== oldScrollIndex) || doHScroll) {
                            self._debounceScrolledEvent = true;

                            if (args.dir === "v" && self.mVertical) {
                                self._wijgrid._handleVerticalVirtualScrolling(scrollToIndex, null, $.proxy(self._verticalScrollingCompleted, self));
                            } else {
                                self._wijgrid._handleHorizontalVirtualScrolling(newRange, $.proxy(self._horizontalScrollingCompleted, self));
                            }
                        } else {
                            self._debounceScrolledEvent = true;
                            self._log();
                            self._clearTimer(); // unlock
                        }
                    }, this._debounceScrolledEvent ? this._timeout : 0);
                }
            };

            uiVirtualScroller.prototype._verticalScrollingCompleted = function (scrollIndex) {
                this._wijgrid._trackScrollingIndex(scrollIndex);

                this._log();

                if (this._completeListener) {
                    this._completeListener();
                    this._completeListener = null;
                }

                this._clearTimer(); // unlock
            };

            uiVirtualScroller.prototype._horizontalScrollingCompleted = function () {
                this._log();

                if (this._completeListener) {
                    this._completeListener();
                    this._completeListener = null;
                }

                this._clearTimer(); // unlock
            };

            uiVirtualScroller.prototype._onSuperpanelPostScrolled = function () {
                if ($.isFunction(this._postScrolled)) {
                    this._postScrolled.apply(this, arguments);
                }
            };

            uiVirtualScroller.prototype._log = function () {
                //if (window.console) {
                //	var bounds = this._wijgrid._view()._bounds;
                //	window.console.log("bounds: [" + bounds.start + ", " + bounds.end + "], scrollTo: " + bounds.start);
                //}
            };
            return uiVirtualScroller;
        })();
        grid.uiVirtualScroller = uiVirtualScroller;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="interfaces.ts" />
var wijmo;
(function (wijmo) {
    (function (grid) {
        /** @ignore */
        var renderableColumnsCollection = (function () {
            function renderableColumnsCollection() {
                this.mItems = [];
            }
            renderableColumnsCollection.prototype.add = function (a, b) {
                var start, end;

                if (arguments.length === 1) {
                    this.mItems.push(a);
                } else {
                    this.mItems.push({
                        start: a,
                        end: b
                    });
                }
            };

            renderableColumnsCollection.prototype.item = function (index) {
                return this.mItems[index];
            };

            renderableColumnsCollection.prototype.clear = function () {
                this.mItems = [];
            };

            renderableColumnsCollection.prototype.contains = function (value) {
                if (value && value.options) {
                    value = value.options.leavesIdx;
                }

                if (value || (value === 0)) {
                    for (var i = 0; i < this.mItems.length; i++) {
                        var item = this.mItems[i];

                        if ((item.start >= 0) && (value >= item.start) && (value <= item.end)) {
                            return true;
                        }
                    }
                }

                return false;
            };

            renderableColumnsCollection.prototype.equals = function (value) {
                if (this === value) {
                    return true;
                }

                var len = this.length();
                if (!value || (len !== value.length())) {
                    return false;
                }

                var result = true;
                for (var i = 0; i < len && result; i++) {
                    var a = this.item(i), b = value.item(i);

                    result = (a.start === b.start) && (a.end === b.end);
                }

                return result;
            };

            renderableColumnsCollection.prototype.length = function () {
                return this.mItems.length;
            };

            renderableColumnsCollection.prototype.forEachIndex = function (callback) {
                for (var i = 0; i < this.mItems.length; i++) {
                    var item = this.mItems[i];

                    if (item && (item.start >= 0)) {
                        for (var j = item.start; j <= item.end; j++) {
                            if (callback(j) === false) {
                                return;
                            }
                        }
                    }
                }
            };
            return renderableColumnsCollection;
        })();
        grid.renderableColumnsCollection = renderableColumnsCollection;

        /** @ignore */
        //export class fixedRenderColumnsRange extends renderableColumnsRange {
        //	private mFix: IRenderBounds;
        //	private mScroll: IRenderBounds;
        //	constructor() {
        //		super();
        //		this.mFix = { start: -1, end: -1 };
        //		this.mScroll = { start: -1, end: -1 };
        //		this.add(this.mFix);
        //		this.add(this.mScroll);
        //	}
        //	public Fix(): IRenderBounds {
        //		return this.mFix;
        //	}
        //	public Scroll(): IRenderBounds {
        //		return this.mScroll;
        //	}
        //}
        /** @ignore */
        var renderableRowsCollection = (function () {
            function renderableRowsCollection(maxRowIndex) {
                this._items = [];
                this._capacity = null;
                this._maxRowIndex = maxRowIndex;
            }
            renderableRowsCollection.prototype.add = function (bounds) {
                this._capacity = null;

                var len = this._items.length, last;

                if (!len || (last = this._items[len - 1]).end < bounds.start) {
                    if (len && (bounds.start - last.end === 1)) {
                        last.end = bounds.end;
                    } else {
                        this._items.push(bounds);
                    }
                } else {
                    // todo: merge adjacent bounds
                    var idxS = this._binSearchByStartVal(bounds.start), idxE = this._binSearchByEndVal(bounds.end), idxSn = idxS < 0 ? ~idxS : idxS, idxEn = idxE < 0 ? ~idxE : idxE, pinL = (idxS >= 0) || (idxSn > 0 && bounds.start <= this._items[idxSn - 1].end), pinR = (idxE >= 0) || (idxEn < len && bounds.end <= this._items[idxEn].end && bounds.end >= this._items[idxEn].start), cnt;

                    if (pinL) {
                        if (pinR) {
                            // 1 1
                            if (idxS >= 0) {
                                this._items[idxEn].start = this._items[idxSn].start;

                                if (cnt = (idxEn - idxSn)) {
                                    this._items.splice(idxSn, cnt);
                                }
                            } else {
                                this._items[idxEn].start = this._items[idxSn - 1].start;

                                if (cnt = idxEn - idxSn + 1) {
                                    this._items.splice(idxSn - 1, cnt);
                                }
                            }
                        } else {
                            // 1 0
                            if (idxS >= 0) {
                                this._items[idxSn].end = bounds.end;

                                if (cnt = (idxEn - idxSn - 1)) {
                                    this._items.splice(idxSn, cnt);
                                }
                            } else {
                                this._items[idxSn - 1].end = bounds.end;

                                if (cnt = (idxEn - idxSn)) {
                                    this._items.splice(idxSn, cnt);
                                }
                            }
                        }
                    } else {
                        if (pinR) {
                            // 0 1
                            this._items[idxEn].start = bounds.start;

                            if (cnt = (idxEn - idxSn)) {
                                this._items.splice(idxSn, cnt);
                            }
                        } else {
                            // 0 0
                            this._items.splice(idxSn, idxEn - idxSn, bounds);
                        }
                    }
                }
            };

            //public remove(bounds: IRenderBounds) {
            //	this._capacity = null;
            //	var len = this._items.length;
            //	if (len) {
            //		var idxS = this._binSearchByStartVal(bounds.start),
            //			idxE = this._binSearchByEndVal(bounds.end),
            //			idxSn = idxS < 0 ? ~idxS : idxS,
            //			idxEn = idxE < 0 ? ~idxE : idxE,
            //			pinL = (idxS >= 0) || (idxSn > 0 && bounds.start <= this._items[idxSn - 1].end),
            //			pinR = (idxE >= 0) || (idxEn < len && bounds.end <= this._items[idxEn].end && bounds.end >= this._items[idxEn].start);
            //		if (pinL) {
            //			if (pinR) {
            //				var boundIdxL = (idxS >= 0) ? idxS : idxSn - 1,
            //					boundIdxR = (idxE >= 0) ? idxE : idxEn;
            //				if (idxS >= 0 && idxE >= 0) {
            //					this._items.splice(idxSn, idxEn - idxSn + 1);
            //				} else {
            //					if (idxS >= 0) {
            //						this._items[idxEn].start = bounds.end + 1;
            //						this._items.splice(idxSn, idxEn - idxSn);
            //					} else {
            //						if (idxE >= 0) {
            //							if (boundIdxL === boundIdxR) { // same bound
            //								this._items[idxSn - 1].end = bounds.start - 1;
            //							} else {
            //								this._items[idxSn].end = bounds.start - 1;
            //								this._items.splice(idxSn, idxEn - idxSn + 1);
            //							}
            //						}
            //						else {
            //							if (boundIdxL === boundIdxR) { // same bound, split single bound.
            //								var tEnd = this._items[idxSn - 1].end;
            //								this._items[idxSn - 1].end = bounds.start - 1;
            //								this._items.splice(idxSn, 0, { start: bounds.end + 1, end: tEnd });
            //							} else {
            //								this._items[idxSn - 1].end = bounds.start - 1;
            //								this._items[idxEn].start = bounds.end + 1;
            //								this._items.splice(idxSn, idxEn - idxSn);
            //							}
            //						}
            //					}
            //				}
            //			} else {
            //				if (idxS >= 0) {
            //					this._items.splice(idxSn, idxEn - idxSn);
            //				} else {
            //					this._items[idxSn].end = bounds.start - 1;
            //					this._items.splice(idxSn, idxEn - idxSn - 1);
            //				}
            //			}
            //		} else {
            //			if (pinR) {
            //				if (idxE >= 0) {
            //					this._items.splice(idxSn, idxEn - idxSn + 1);
            //				} else {
            //					// !!
            //					this._items[idxEn].start = bounds.end + 1;
            //					this._items.splice(idxSn, idxEn - idxSn);
            //				}
            //			} else {
            //				this._items.splice(idxSn, idxEn - idxSn);
            //			}
            //		}
            //	}
            //}
            //public clear() {
            //	this._capacity = 0;
            //	this._items = [];
            //}
            renderableRowsCollection.prototype.item = function (index) {
                return this._items[index];
            };

            //public forEachIndex(callback: (idx: number) => void ) {
            //	if (callback) {
            //		for (var i = 0, len = this._items.length; i < len; i++) {
            //			var bound = this._items[i];
            //			for (var start = bound.start, end = bound.end; start <= end; start++) {
            //				callback(start);
            //			}
            //		}
            //	}
            //}
            renderableRowsCollection.prototype.forEachIndex = function (start, count, callback) {
                if (start < 0) {
                    return;
                }

                var len = this._items.length, state = this._getIteratorStateFor(start), cnt = 0, flag = true, abort = false;

                if (state) {
                    var j = state.j;

                    for (var i = state.i; i < len && !abort; i++) {
                        var item = this._items[i];

                        if (!flag) {
                            j = item.start;
                        }

                        for (j; j <= item.end && !abort; j++) {
                            if ((++cnt > count) && (count !== -1)) {
                                return;
                            }

                            abort = (callback(j) === false);
                        }

                        flag = false;
                    }
                }
            };

            renderableRowsCollection.prototype.forEachIndexBackward = function (start, count, callback) {
                if (start < 0) {
                    return;
                }

                var len = this._items.length, state = this._getIteratorStateFor(start), cnt = 0, flag = true, abort = false;

                if (state) {
                    var j = state.j;

                    for (var i = state.i; i >= 0 && !abort; i--) {
                        var item = this._items[i];

                        if (!flag) {
                            j = item.end;
                        }

                        for (j; j >= item.start && !abort; j--) {
                            if ((++cnt > count) && (count !== -1)) {
                                return;
                            }

                            abort = (callback(j) === false);
                        }

                        flag = false;
                    }
                }
            };

            renderableRowsCollection.prototype._getIteratorStateFor = function (visIndex) {
                var len = this._items.length, cap = 0;

                for (var i = 0; i < len; i++) {
                    var item = this._items[i];

                    cap += item.end - item.start + 1;

                    var delta = cap - visIndex;

                    if (delta >= 0) {
                        return {
                            i: i,
                            j: item.end - delta + 1
                        };
                    }
                }

                return null;
            };

            // [0-5],[10-15]
            // f(6) -> 10
            // Maps visible row index to absolute row (sketch)  index
            renderableRowsCollection.prototype.getAbsIndex = function (renderedIndex) {
                for (var i = 0, len = this._items.length; i < len; i++) {
                    var bound = this._items[i], relEndIdx = bound.end - bound.start;

                    if (renderedIndex <= relEndIdx) {
                        return bound.start + renderedIndex;
                    } else {
                        renderedIndex -= relEndIdx + 1; // -= bound length
                    }
                }

                return -1;
            };

            // Maps absolute row (sketch) index to rendered row index
            renderableRowsCollection.prototype.getRenderedIndex = function (absIndex) {
                var boundIndex = this.hasAbsIndex(absIndex);

                if (boundIndex >= 0) {
                    var capacity = 0;

                    for (var i = 0; i < boundIndex; i++) {
                        var bound = this._items[i];
                        capacity += bound.end - bound.start + 1;
                    }

                    return capacity + (absIndex - this._items[boundIndex].start);
                }

                return -1;
            };

            // returns index of the IRenderBound item in the _items array or -1.
            renderableRowsCollection.prototype.hasAbsIndex = function (absIndex) {
                if (this._items.length) {
                    var idx = this._binSearchByStartVal(absIndex);

                    if (idx >= 0) {
                        return idx;
                    } else {
                        idx = ~idx;

                        if (idx > 0 && absIndex <= this._items[idx - 1].end) {
                            return idx - 1;
                        }
                    }
                }

                return -1;
            };

            renderableRowsCollection.prototype.length = function () {
                return this._items.length;
            };

            renderableRowsCollection.prototype.capacity = function () {
                if (this._capacity === null) {
                    var result = 0;

                    for (var i = 0, len = this._items.length; i < len; i++) {
                        var bound = this._items[i];

                        result += (bound.end - bound.start) + 1;
                    }

                    this._capacity = result;
                }

                return this._capacity;
            };

            //public truncate(start: number, end: number) {
            //	this.truncateByStart(start);
            //	this.truncateByStart(end);
            //}
            //public truncateByCount(value: number) {
            //	var count = 0;
            //	if (value === 0) {
            //		this._items = [];
            //	} else {
            //		for (var i = 0, len = this._items.length; i < len; i++) {
            //			var bound = this._items[i];
            //			count += (bound.end - bound.start) + 1;
            //			if (count >= value) {
            //				if (count > value) {
            //					bound.end -= count - value;
            //				}
            //				this._items.splice(i + 1, this._items.length - (i + 1));
            //				break;
            //			}
            //		}
            //	}
            //}
            renderableRowsCollection.prototype.truncateByStart = function (value, pinFirstRemainingBoundToValue) {
                var idx = this._binSearchByStartVal(value), len = this._items.length;

                if (idx < 0) {
                    idx = ~idx;

                    if (idx < len) {
                        if (idx > 0 && this._items[idx - 1].end >= value) {
                            this._items[idx - 1].start = value;
                            this._items.splice(0, idx - 1);
                        } else {
                            if (pinFirstRemainingBoundToValue) {
                                this._items[idx].start = value;
                            }

                            this._items.splice(0, idx);
                        }
                    } else {
                        this._items = [];
                    }
                } else {
                    this._items.splice(0, idx);
                }
            };

            //public truncateByEnd(value: number, pinLastRemainingBoundToValue?: boolean) {
            //	// todo
            //	var idx = this._binSearchByEndVal(value),
            //		len = this._items.length;
            //	if (idx < 0) {
            //		idx = ~idx;
            //		if (idx < len) {
            //			this._items[idx].end = value;
            //			this._items.splice(idx + 1, this._items.length - idx + 1);
            //		} else {
            //			this._items = [];
            //		}
            //	} else {
            //		this._items.splice(idx + 1, this._items.length - idx + 1);
            //	}
            //}
            //public deleteFromTop(count: number) {
            //	var i = 0,
            //		cap = 0;
            //	for (i = 0; i < this._items.length; i++) {
            //		var item = this._items[i];
            //		cap += item.end - item.start + 1;
            //		if (cap >= count) {
            //			break;
            //		}
            //	}
            //	if (cap >= count) {
            //		this._items[i].start = cap - count + 1;
            //	}
            //	this._items.splice(0, i);
            //}
            //public deleteFromBottom(count: number) {
            //	var i = 0,
            //		cap = 0;
            //	for (i = this._items.length - 1; i >= 0; i--) {
            //		var item = this._items[i];
            //		cap += item.end - item.start + 1;
            //		if (cap >= count) {
            //			break;
            //		}
            //	}
            //	if (cap >= count) {
            //		this._items[i].start = cap - count + 1;
            //	}
            //	this._items.splice(i, this._items.length - i);
            //}
            renderableRowsCollection.prototype._binSearchByStartVal = function (value) {
                var l = 0, u = this._items.length - 1;

                while (l <= u) {
                    var m = (u + l) >> 1, cmp = this._items[m].start - value;

                    if (cmp === 0) {
                        return m;
                    }

                    if (cmp < 0) {
                        l = m + 1;
                    } else {
                        u = m - 1;
                    }
                }

                return ~l;
            };

            renderableRowsCollection.prototype._binSearchByEndVal = function (value) {
                var l = 0, u = this._items.length - 1;

                while (l <= u) {
                    var m = (u + l) >> 1, cmp = this._items[m].end - value;

                    if (cmp < 0) {
                        l = m + 1;
                    } else {
                        if (cmp) {
                            u = m - 1;
                        } else {
                            return m;
                        }
                    }
                }

                return ~l;
            };
            return renderableRowsCollection;
        })();
        grid.renderableRowsCollection = renderableRowsCollection;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="../../../Data/src/core.ts"/>
/// <reference path="../../../Data/src/util.ts"/>
/// <reference path="../../../Data/src/errors.ts"/>
/// <reference path="../../../external/declarations/globalize.d.ts"/>
var wijmo;
(function (wijmo) {
    (function (data) {
        var $ = jQuery, glob = Globalize;

        

        

        /** @ignore */
        function convert(val, fromType, toType, options) {
            var origValue = val;
            options = $.extend({
                nullString: "",
                format: ""
            }, options);

            function getParser(type) {
                options.parser = options.parser || data.defaultParsers[type];
                if (!options.parser && val != null)
                    data.errors.noParser(type);
                return options.parser;
            }

            fromType = fromType || val != null && typeof val;
            toType = toType || fromType;
            if (!toType)
                return val;

            if (toType == "string") {
                getParser(fromType);
                if (!options.parser)
                    return val;
                return options.parser.toStr(val, options.culture, options.format, options.nullString, true);
            }
            getParser(toType);
            if (!options.parser)
                return val;

            val = options.parser.parse(val, options.culture, options.format, options.nullString, true);

            if (isNaN(val) && val != null && data.util.isNumeric(val)) {
                if (options.ignoreError)
                    return origValue;
                data.errors.cantConvert(toType, origValue);
            }
            return val;
        }
        data.convert = convert;

        /** @ignore */
        data.defaultParsers = {
            string: {
                // string -> string
                parse: function (value, culture, format, nullString, convertEmptyStringToNull) {
                    switch (value) {
                        case null:
                            return null;

                        case nullString:
                            if (convertEmptyStringToNull) {
                                return null;
                            }

                        case undefined:
                        case "&nbsp":
                            return "";

                        default:
                            return "" + value;
                    }
                },
                // string -> string
                toStr: function (value, culture, format, nullString, convertEmptyStringToNull) {
                    if (value === null && convertEmptyStringToNull) {
                        return nullString;
                    }
                    return "" + value;
                }
            },
            number: {
                // string/number -> number
                parse: function (value, culture, format, nullString, convertEmptyStringToNull) {
                    var type = typeof (value);

                    if (type === "number") {
                        return isNaN(value) ? NaN : value;
                    }

                    if ((!value && value !== 0) || (value === "&nbsp;") || (value === nullString && convertEmptyStringToNull)) {
                        return null;
                    }

                    return glob.parseFloat(value, 10, culture);
                },
                // number -> string
                toStr: function (value, culture, format, nullString, convertEmptyStringToNull) {
                    if (value === null && convertEmptyStringToNull) {
                        return nullString;
                    }

                    return glob.format(value, format || "n", culture);
                }
            },
            currency: {
                // string/number -> number
                parse: function (value, culture, format, nullString, convertEmptyStringToNull) {
                    var type = typeof (value);

                    if (type === "number") {
                        return isNaN(value) ? NaN : value;
                    }

                    if ((!value && value !== 0) || (value === "&nbsp;") || (value === nullString && convertEmptyStringToNull)) {
                        return null;
                    }

                    if (type === "string") {
                        value = value.replace(culture.numberFormat.currency.symbol, "");
                    }

                    return glob.parseFloat(value, 10, culture);
                },
                // number -> string (currency)
                toStr: function (value, culture, format, nullString, convertEmptyStringToNull) {
                    if (value === null && convertEmptyStringToNull) {
                        return nullString;
                    }

                    return glob.format(value, format || "c", culture);
                }
            },
            datetime: {
                // string/datetime -> datetime
                parse: function (value, culture, format, nullString, convertEmptyStringToNull) {
                    var match;

                    if (value instanceof Date) {
                        return value;
                    }

                    if (!value || (value === "&nbsp;") || (value === nullString && convertEmptyStringToNull)) {
                        return null;
                    }

                    match = /^\/Date\((\d+)\)\/$/.exec(value);
                    if (match) {
                        return new Date(parseInt(match[1], 10));
                    }

                    var date = glob.parseDate(value, format || "d", culture);

                    if (date == null || isNaN(date)) {
                        date = Date.parse(value);
                        date = isNaN(date) ? NaN : new Date(date);
                    }

                    return date;
                },
                // datetime -> string
                toStr: function (value, culture, format, nullString, convertEmptyStringToNull) {
                    if (value === null && convertEmptyStringToNull) {
                        return nullString;
                    }

                    return glob.format(value, format || "d", culture);
                }
            },
            boolean: {
                // string/boolean -> boolean
                parse: function (value, culture, format, nullString, convertEmptyStringToNull) {
                    var valType = typeof (value);

                    if (valType === "number") {
                        return value != 0;
                    }

                    if (valType === "boolean") {
                        return value;
                    }

                    if (valType === "string") {
                        value = $.trim(value);
                    }

                    if (!value || (value === "&nbsp;") || (value === nullString && convertEmptyStringToNull)) {
                        return null;
                    }

                    switch (value.toLowerCase()) {
                        case "true":
                            return true;

                        case "false":
                            return false;
                    }

                    return NaN;
                },
                // boolean -> string
                toStr: function (value, culture, format, nullString, convertEmptyStringToNull) {
                    if (value === null && convertEmptyStringToNull) {
                        return nullString;
                    }

                    return (value) ? "true" : "false";
                }
            }
        };

        function checkGlob(func) {
            return function () {
                if (!glob) {
                    data.util.logError(data.errors.noGlobalize.create().message);
                }
                return func.apply(this, arguments);
            };
        }

        $.each(data.defaultParsers, function (_, parser) {
            parser.parse = parser.parse && checkGlob(parser.parse);
            parser.toStr = parser.toStr && checkGlob(parser.toStr);
        });
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));

/// <reference path="../../../Data/src/arrayDataView.ts"/>
var wijmo;
(function (wijmo) {
    (function (data) {
        (function (filtering) {
            /** Provides compilation of the Extended Filtering Format
            *
            * @remarks
            * Some examples of extended filter format:
            *   [{ property: "name", value: "John" }, { property: "age", operator: "<", value: 10 }]
            *   ["or", { property: "name", value: "John" }, { property: "age", operator: "<", value: 10 }]
            *   ["and",
            *      ["or", { property: "name", value: "John" }, { property: "name", operator: "BeginsWith", value: "A" } ],
            *      { property: "age", operator: "<", value: 10 }]
            *   ]
            */
            /** @ignore */
            (function (extended) {
                /** @ignore */
                extended.Connective = {
                    AND: "and",
                    OR: "or"
                };

                function normalizeFilter(filter) {
                    function norm(filter) {
                        var result = [];
                        if (filter.length === 0)
                            return result;

                        var connective = extended.Connective.AND;
                        data.util.each(filter, function (i, cond) {
                            if (i == 0 && data.util.isString(cond)) {
                                var lowerConnective = cond.toLowerCase();
                                if (lowerConnective == extended.Connective.AND || lowerConnective == extended.Connective.OR) {
                                    connective = lowerConnective;
                                    return;
                                }
                            }

                            if ($.isArray(cond)) {
                                cond = norm(cond);
                                if (!cond)
                                    return;
                                if (cond[0] === connective || cond.length == 2) {
                                    cond.shift();
                                    result = result.concat(cond);
                                    return;
                                }
                            } else {
                                var predicate = filtering.normalizeCondition(cond);
                                if (!predicate)
                                    return;
                                predicate.property = cond.property;
                                cond = predicate;
                            }

                            result.push(cond);
                        });

                        if (result.length == 0) {
                            return null;
                        } else {
                            result.unshift(connective);
                            return result;
                        }
                    }
                    return norm(filter);
                }
                function compilAsExtended(extendedFilter) {
                    if (!$.isArray(extendedFilter)) {
                        return null;
                    }

                    var result = {
                        isEmpty: true,
                        original: extendedFilter,
                        normalized: normalizeFilter(extendedFilter),
                        func: null
                    };
                    if (result.normalized == null) {
                        result.func = function (x) {
                            return true;
                        };
                    } else {
                        result.isEmpty = false;
                        result.func = function (x) {
                            function check(filter) {
                                var isAnd = filter[0] === extended.Connective.AND, checker = isAnd ? data.util.every : data.util.some;
                                return checker(filter, function (cond, i) {
                                    if (i === 0)
                                        return isAnd;
                                    if ($.isArray(cond)) {
                                        return check(cond);
                                    } else {
                                        var value = data.util.getProperty(x, cond.property);
                                        return cond.op.apply(value, cond.value);
                                    }
                                });
                            }
                            return check(result.normalized);
                        };
                    }
                    return result;
                }

                /** @ignore */
                function compile(filter) {
                    return compilAsExtended(filter) || filtering.compile(filter);
                }
                extended.compile = compile;
            })(filtering.extended || (filtering.extended = {}));
            var extended = filtering.extended;
        })(data.filtering || (data.filtering = {}));
        var filtering = data.filtering;
    })(wijmo.data || (wijmo.data = {}));
    var data = wijmo.data;
})(wijmo || (wijmo = {}));

/// <reference path="../../../Data/src/arrayDataView.ts"/>
/// <reference path="wijmo.data.filtering.extended.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (grid) {
        var $ = jQuery;
        var wijdata = wijmo.data;
        var filterExt = wijmo.data.filtering.extended;

        // in fact implements IDataView in run-time, but not at compile-time
        /** @ignore */
        var GridDataView = (function () {
            function GridDataView(real) {
                this.real = real;
                this._updatingFilter = false;
                this._overrideFilter();
                this._makeMemberProxies();
            }
            GridDataView.prototype._overrideFilter = function () {
                var _this = this;
                this.filter = wijdata.observable(this.real.filter());

                this.filter.subscribe(function (newValue) {
                    if (_this.real.filter() !== newValue && !_this._updatingFilter) {
                        _this.refresh({ filter: newValue });
                    }
                });

                this.real.filter.subscribe(function (newValue) {
                    // Do not update this.filter if it is the same filter we've assigned to the underlying dataView.
                    // Otherwise we may end up replacing a property filter with a function
                    if (newValue !== _this._lastSetFilter) {
                        _this.filter(newValue);
                    }
                });
            };

            GridDataView.prototype.refresh = function (shape, local) {
                if (typeof local === "undefined") { local = false; }
                shape = $.extend({}, shape);
                var origFilter = shape.filter;
                shape.filter = this._coerceFilter(shape.filter);
                this._lastSetFilter = shape.filter;

                this._updatingFilter = true;
                try  {
                    if ($.isFunction(shape.filter) && !$.isFunction(origFilter)) {
                        // it became a function. It means that the filter was complex
                        this.filter(origFilter);
                    } else {
                        this.filter(shape.filter);
                    }
                } finally {
                    this._updatingFilter = false;
                }

                return this.real.refresh(shape, local);
            };

            GridDataView.prototype._makeMemberProxies = function () {
                var _this = this;
                // make proxy methods for those that are not defined manually
                wijdata.util.each(this.real, function (key, value) {
                    if (!$.isFunction(value) || _this[key] || key.charAt(0) === "_")
                        return;

                    _this[key] = $.isFunction(value.subscribe) ? value : function () {
                        return value.apply(_this.real, arguments);
                    };
                });
            };

            GridDataView.create = function (dataView) {
                return new GridDataView(dataView);
            };

            GridDataView.prototype._convertComplexPropertyFilterToExtendedFilterFormat = function (filter) {
                var result = [];
                $.each(filter, function (prop, condList) {
                    if (!$.isArray(condList)) {
                        condList = [condList];
                    } else {
                        var connective = wijdata.util.isString(condList[0]) && condList[0].toLowerCase();
                        if (connective === filterExt.Connective.AND || connective === filterExt.Connective.OR) {
                            result.push(condList);
                            return;
                        }
                    }

                    var normCondList = [];
                    $.each(condList, function (_, cond) {
                        var normCond = wijdata.filtering.normalizeCondition(cond);
                        if (normCond) {
                            normCond.property = prop;
                            normCondList.push(normCond);
                        }
                    });

                    if (normCondList.length > 0) {
                        result.push(normCondList);
                    }
                });

                return result.length > 0 ? result : null;
            };
            GridDataView.prototype._coerceFilter = function (filter) {
                if ($.isArray(filter)) {
                    // assume extended
                    return filterExt.compile(filter).func;
                } else if (!$.isPlainObject(filter)) {
                    return filter;
                }

                filter = $.extend(true, {}, filter);

                var simpleFilter = {};
                $.each(filter, function (prop, cond) {
                    if (!$.isArray(cond)) {
                        cond = [cond];
                    }

                    if (simpleFilter) {
                        var possibleConnective = wijdata.util.isString(cond[0]) && cond[0].toLowerCase();
                        if (cond.length == 1 || cond.length == 2 && (possibleConnective === "and" || possibleConnective === "or")) {
                            simpleFilter[prop] = cond[cond.length - 1];
                            return;
                        }
                    }

                    filter[prop] = cond;
                    simpleFilter = null;
                });

                if (simpleFilter) {
                    return simpleFilter;
                }

                var extendedFilter = this._convertComplexPropertyFilterToExtendedFilterFormat(filter);
                return filterExt.compile(extendedFilter).func;
            };
            return GridDataView;
        })();
        grid.GridDataView = GridDataView;

        /** @ignore */
        var GridLocalDataDataView = (function (_super) {
            __extends(GridLocalDataDataView, _super);
            function GridLocalDataDataView(real) {
                _super.call(this, real);
                this.real = real;
            }
            GridLocalDataDataView.create = function (dataView) {
                return new GridLocalDataDataView(dataView);
            };

            GridLocalDataDataView.prototype._unsafeReplace = function (index, newItem) {
                this.real.sourceArray[index] = newItem;
                this.real.local[index] = newItem;
            };

            GridLocalDataDataView.prototype._unsafeSplice = function (index, count, item) {
                if (arguments.length === 2) {
                    this.real.sourceArray.splice(index, count);
                    this.real.local.splice(index, count);
                } else {
                    this.real.sourceArray.splice(index, count, item);
                    this.real.local.splice(index, count, item);
                }
            };

            GridLocalDataDataView.prototype._unsafePush = function (item) {
                this.real.sourceArray.push(item);
                this.real.local.push(item);
            };
            return GridLocalDataDataView;
        })(GridDataView);
        grid.GridLocalDataDataView = GridLocalDataDataView;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

/// <reference path="../../../data/src/dataView.ts"/>
/// <reference path="../../../data/src/arrayDataView.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var wijmo;
(function (wijmo) {
    (function (grid) {
        /** @ignore */
        var koDataView = (function (_super) {
            __extends(koDataView, _super);
            function koDataView(observableArray) {
                this.mObservableArray = observableArray;

                var sourceArray = ko.utils.unwrapObservable(this.mObservableArray);

                _super.call(this, sourceArray, null);
            }
            koDataView.validSource = function (source) {
                return !!(ko && ko.isObservable(source) && $.isFunction(source.slice));
            };

            koDataView.prototype.refresh = function (shape, local) {
                if (typeof local === "undefined") { local = false; }
                this.sourceArray = ko.utils.unwrapObservable(this.mObservableArray);
                this.mPlainArray = ko.toJS(this.sourceArray);

                // ** #53562: ensure that pageIndex is within [0; pageCount) range
                var pageSize = shape && shape.pageSize !== undefined ? shape.pageSize : this.pageSize();

                var pageIndex = shape && shape.pageIndex !== undefined ? shape.pageIndex : this.pageIndex();

                if (pageSize > 0 && pageIndex > 0) {
                    var pageCount = wijmo.data.util.pageCount(this.sourceArray.length, pageSize);

                    if (pageIndex >= pageCount) {
                        pageIndex = Math.max(0, pageCount - 1);

                        if (!shape) {
                            shape = {};
                        }

                        shape.pageIndex = pageIndex;
                    }
                }

                // ** #53562: ensure that pageIndex is within[0; pageCount) range
                return _super.prototype.refresh.apply(this, [shape, local]);
            };

            koDataView.prototype.getPlainSource = function () {
                return this.mPlainArray;
            };

            koDataView.prototype.dispose = function () {
                this.mObservableArray = null;
                this.mPlainArray = null;

                _super.prototype.dispose.apply(this, arguments);
            };
            return koDataView;
        })(wijmo.data.ArrayDataView);
        grid.koDataView = koDataView;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
