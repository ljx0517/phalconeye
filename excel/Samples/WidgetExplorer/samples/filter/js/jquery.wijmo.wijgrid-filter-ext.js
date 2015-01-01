/// <reference path="../../../../../Wijmo/Base/jquery.wijmo.widget.ts"/>
/// <reference path="../../../../../Wijmo/wijfilter/jquery.wijmo.wijfilter.ts"/>
/// <reference path="../../../../../Wijmo/wijgrid/Grid.ts/Grid/wijgrid.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (_wijgridfilter) {
        "use strict";

        var $ = jQuery;

        var displayNames = {
            nofilter: "Choose One", contains: "Contains", notcontain: "Does Not Contain", beginswith: "Begins With",
            endswith: "Ends With", equals: "Equals", notequal: "Does Not Equal", greater: "Greater", less: "Less",
            greaterorequal: "Greater Or Equal", lessorequal: "Less Or Equal", isempty: "Is Empty", notisempty: "Does Not Empty",
            isnull: "Is Null", notisnull: "Does Not Null"
        };

        var wijgridfilter = (function (_super) {
            __extends(wijgridfilter, _super);
            function wijgridfilter() {
                _super.apply(this, arguments);
            }
            wijgridfilter.prototype._init = function () {
                this._wrapDataView();
                _super.prototype._init.apply(this, arguments);
            };

            wijgridfilter.prototype._create = function () {
                this._super.apply(this, arguments);

                this.element.bind("wijgridfilterloaded", $.proxy(this._onLoaded, this));
            };

            wijgridfilter.prototype._postset_data = function () {
                this._wrapDataView();
                _super.prototype._postset_data.apply(this, arguments);
            };

            wijgridfilter.prototype._wrapDataView = function () {
                if (this.options.data) {
                    if (wijmo.data.isDataView(this.options.data) && !(this.options.data instanceof wijmo.grid.GridDataView)) {
                        this.options.data = new wijmo.grid.GridDataView(this.options.data); // wrap original dataView to support complex filters.
                    }
                }
            };

            wijgridfilter.prototype._onLoaded = function (e, args) {
                var self = this;

                $.each(this.columns(), function (i, col) {
                    if (col instanceof wijmo.grid.c1field) {
                        var column = col;

                        column._hasFilter = self._hasFilter(column.options);

                        column._dialogButton = $("<a href=\"#\"/>").addClass("filterDialog-dialogButton").addClass(column._hasFilter ? "ui-state-active" : "").button({
                            icons: {
                                primary: "ui-icon-search"
                            }
                        }).click($.proxy(function (e) {
                            self._showDialog(column);
                            return false;
                        }, self)).mouseout(function () {
                            if (column._hasFilter) {
                                column._dialogButton.addClass("ui-state-active");
                            }
                        }).appendTo(this.element.find(".wijmo-wijgrid-headertext"));
                    }
                });
            };

            wijgridfilter.prototype._closeDialog = function (column, flag) {
                if (typeof flag === "undefined") { flag = false; }
                try  {
                    if (column._dialogButton) {
                        column._dialogButton.removeClass("ui-state-focus"); // fix focus state issue
                    }

                    if (!flag && this._dialog) {
                        this._dialog.dialog("close");
                    }

                    if (this._dialog) {
                        this._dialog.remove();
                    }
                } finally {
                    this._dialog = null;
                }
            };

            wijgridfilter.prototype._data = function (column) {
                var _this = this;
                var result = [], data = this.data();

                if (data) {
                    $.each(data, function (idx, dataItem) {
                        var obj = {}, value = dataItem[column.dataKey];

                        if ($.isFunction(value)) {
                            value = value();
                        }

                        value = (value === null || value === undefined) ? value : _this.toStr(column, value); // format

                        obj[column.dataKey] = value;

                        result.push(obj);
                    });
                }

                return result;
            };

            wijgridfilter.prototype._showDialog = function (column) {
                var self = this, col = column.options;

                if (this._dialog) {
                    this._closeDialog(column);
                }

                if (!this._dialog) {
                    var data = this._data(col), filterValue = this._convertFilterValue(col), filterOperator = this._convertFilterOperator(col), self = this;

                    this._dialog = $("<div></div").addClass("ui-helper-hidden-accessible filterDialog-dialogContainer ui-widget-content ui-corner-all ui-helper-clearfix").appendTo(document.body).wijfilter({
                        data: data,
                        dataKey: col.dataKey,
                        title: col.headerText || col.dataKey,
                        enableSortButtons: this.options.allowSorting && col.allowSort,
                        sortDirection: col.sortDirection || "none",
                        availableOperators: this._getAvailableFilterOperators(col.dataType || "string"),
                        filterValue: filterValue,
                        filterOperator: filterOperator,
                        showHeader: false,
                        close: function (e, args) {
                            var parse = function (column, value) {
                                return (value === undefined || value === null) ? value : self.parse(col, value);
                            };

                            self._closeDialog(column);

                            if (args && !$.isEmptyObject(args)) {
                                col.sortDirection = args.sortDirection;

                                // parse filter values
                                $.each(args.filterValue, function (i, val1) {
                                    if ($.isArray(val1)) {
                                        $.each(val1, function (j, val2) {
                                            val1[j] = parse(col, val2);
                                        });
                                    } else {
                                        args.filterValue[i] = parse(col, val1);
                                    }
                                });

                                col.filterValue = args.filterValue;
                                col.filterOperator = args.filterOperator;

                                self.options.pageIndex = 0;

                                self.ensureControl(true);
                            }
                        }
                    }).removeClass("ui-helper-hidden-accessible").dialog({
                        resizable: false,
                        modal: true,
                        closeText: "",
                        title: col.headerText || col.dataKey,
                        width: "auto",
                        height: "auto",
                        position: {
                            of: column._dialogButton,
                            my: "left top",
                            at: "left bottom",
                            collision: "flip none"
                        },
                        close: function () {
                            self._closeDialog(column, true);
                        }
                    });
                }
            };

            wijgridfilter.prototype._getAvailableFilterOperators = function (dataType) {
                var self = this, result = $.map(this.getFilterOperatorsByDataType(dataType), function (fop) {
                    return {
                        name: fop.name,
                        displayName: fop.displayName || displayNames[fop.name.toLowerCase()]
                    };
                });

                return result;
            };

            wijgridfilter.prototype._hasFilter = function (column) {
                var fv = column.filterOperator, i, len, foo, flag = false;

                if (!$.isArray(fv)) {
                    fv = [fv];
                }

                for (i = 0, len = fv.length; (i < len) && !flag; i++) {
                    foo = fv[i];
                    flag = (foo && (foo = (foo.name || foo)) && ((foo || "").toLowerCase() !== "nofilter"));
                }

                return flag;
            };

            wijgridfilter.prototype._convertFilterOperator = function (col) {
                var value = col.filterOperator;

                if (!$.isArray(value)) {
                    value = [value];
                }

                value = $.map(value, function (o, i) {
                    return (typeof (o) === "string") ? { name: o } : o;
                });

                return value;
            };

            wijgridfilter.prototype._convertFilterValue = function (column) {
                var value = column.filterValue, self = this, toStr = function (column, value) {
                    return (value === null || value === undefined) ? value : self.toStr(column, value);
                };

                if (!$.isArray(value)) {
                    value = [value];
                }

                $.each(value, function (i, v1) {
                    if ($.isArray(v1)) {
                        $.each(v1, function (j, v2) {
                            v1[j] = toStr(column, v2);
                        });
                    } else {
                        value[i] = toStr(column, v1);
                    }
                });

                return value;
            };
            return wijgridfilter;
        })(wijmo.grid.wijgrid);
        _wijgridfilter.wijgridfilter = wijgridfilter;

        var c1filterfield = (function (_super) {
            __extends(c1filterfield, _super);
            function c1filterfield() {
                _super.apply(this, arguments);
            }
            return c1filterfield;
        })(wijmo.grid.c1field);

        var wijgridfilter_options = (function () {
            function wijgridfilter_options() {
                this.filterOperatorsSortMode = "none";
            }
            return wijgridfilter_options;
        })();

        wijgridfilter.prototype.widgetEventPrefix = "wijgridfilter";

        wijgridfilter.prototype.options = wijmo.grid.extendWidgetOptions(wijmo.grid.wijgrid.prototype.options, new wijgridfilter_options());

        $.wijmo.registerWidget("wijgridfilter", $.wijmo.wijgrid, wijgridfilter.prototype);
    })(wijmo.wijgridfilter || (wijmo.wijgridfilter = {}));
    var wijgridfilter = wijmo.wijgridfilter;
})(wijmo || (wijmo = {}));
