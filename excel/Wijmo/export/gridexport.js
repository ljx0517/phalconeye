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
/// <reference path="../wijgrid/Grid.ts/Grid/interfaces.ts" />
/// <reference path="../wijgrid/Grid.ts/Grid/wijgrid.ts" />
/// <reference path="exportUtil.ts" />

var wijmo;
(function (wijmo) {
    (function (exporter) {
        "use strict";

        var $ = jQuery;

        

        

        

        

        

        

        

        

        

        

        /** @ignore */
        (function (RowTemplateType) {
            RowTemplateType[RowTemplateType["None"] = 0] = "None";
            RowTemplateType[RowTemplateType["Template"] = 1] = "Template";
            RowTemplateType[RowTemplateType["AltTemplate"] = 2] = "AltTemplate";
            RowTemplateType[RowTemplateType["HeaderTemplate"] = 3] = "HeaderTemplate";
            RowTemplateType[RowTemplateType["FooterTemplate"] = 4] = "FooterTemplate";
            RowTemplateType[RowTemplateType["GroupHeaderTemplate"] = 5] = "GroupHeaderTemplate";
            RowTemplateType[RowTemplateType["GroupFooterTemplate"] = 6] = "GroupFooterTemplate";
        })(exporter.RowTemplateType || (exporter.RowTemplateType = {}));
        var RowTemplateType = exporter.RowTemplateType;

        /** @ignore */
        (function (SectionType) {
            SectionType[SectionType["Header"] = 0] = "Header";
            SectionType[SectionType["Body"] = 1] = "Body";
            SectionType[SectionType["Footer"] = 2] = "Footer";
        })(exporter.SectionType || (exporter.SectionType = {}));
        var SectionType = exporter.SectionType;

        /** @ignore */
        (function (RowType) {
            RowType[RowType["Data"] = 0] = "Data";
            RowType[RowType["Header"] = 1] = "Header";
            RowType[RowType["Footer"] = 2] = "Footer";
            RowType[RowType["GroupHeader"] = 3] = "GroupHeader";
            RowType[RowType["GroupFooter"] = 4] = "GroupFooter";
        })(exporter.RowType || (exporter.RowType = {}));
        var RowType = exporter.RowType;

        /** @ignore */
        (function (ColType) {
            ColType[ColType["Text"] = 1] = "Text";
            ColType[ColType["Image"] = 2] = "Image";
            ColType[ColType["Link"] = 3] = "Link";
            ColType[ColType["Checkbox"] = 4] = "Checkbox";
            ColType[ColType["Html"] = 5] = "Html";
        })(exporter.ColType || (exporter.ColType = {}));
        var ColType = exporter.ColType;
        ;

        

        

        

        

        /** @ignore */
        var exportContext = (function () {
            function exportContext(grid, environmentInfo) {
                this.createdGroupHeaderTemplates = [];
                this.createdGroupFooterTemplates = [];
                var self = this;
                self.environmentInfo = environmentInfo;
                self._init(grid);
            }
            exportContext.prototype._init = function (grid) {
                var self = this, dataView = grid.dataView(), $cols = $(grid.element).find(">colgroup>col");
                self.grid = grid;
                self.showRowHeader = grid.option("showRowHeader");
                self.dataView = dataView;
                self.dataCount = dataView.count();
                if (self.dataCount > 0) {
                    var first = dataView.item(0);
                    self.isArrayData = $.type(first) == "array";
                }

                self._initColInfos($cols);
            };

            exportContext.prototype._initColInfos = function ($cols) {
                var self = this;
                self.colLeaves = $.grep(self.grid.columns(), function (element) {
                    return element.option("isLeaf");
                });
                self.colWidths = [];
                self.colInfos = $cols.map(function (colIndex) {
                    if (colIndex < 0 || colIndex > self.colLeaves.length - 1)
                        return null;

                    var col = self.colLeaves[colIndex], type = 1 /* Text */, dataTypeQualifier = col.option("dataTypeQualifier");

                    if (self.isHtmlCol(col)) {
                        type = 5 /* Html */;
                    } else if (self.isLinkCol(col)) {
                        type = 3 /* Link */;
                    } else if (self.isImageCol(col)) {
                        type = 2 /* Image */;
                    } else if (self.isCheckBoxCol(col)) {
                        type = 4 /* Checkbox */;
                    }
                    self.colWidths.push(self.computedWidthToPt($(this).css("width")));
                    var colInfo = {
                        formatString: col.option("dataFormatString"),
                        dataType: col.option("dataType"),
                        type: type
                    };
                    if (dataTypeQualifier) {
                        colInfo.dataTypeQualifier = dataTypeQualifier;
                    }
                    return colInfo;
                }).get();
            };

            exportContext.prototype.computedWidthToPt = function (lengthStr) {
                return gridExporter.pxToPt(lengthStr, this.environmentInfo.dpiX);
            };

            exportContext.prototype.computedHeightToPt = function (lengthStr) {
                return gridExporter.pxToPt(lengthStr, this.environmentInfo.dpiY);
            };

            exportContext.prototype.getDataValue = function (rowIndex, colIndex) {
                var self = this;
                if (rowIndex >= self.dataCount || rowIndex < 0 || colIndex < 0)
                    return null;
                var data = self.grid.dataView().item(rowIndex);
                if (self.isArrayData) {
                    if (self.showRowHeader)
                        colIndex--;
                    if (colIndex < 0 || colIndex >= data.length)
                        return null;
                    return data[colIndex];
                }
                var cols = self.colLeaves;
                if (colIndex >= cols.length)
                    return null;
                var dataKey = cols[colIndex].option("dataKey");
                return data[dataKey];
            };

            exportContext.prototype.isCheckBoxCol = function (col) {
                return col instanceof wijmo.grid.c1booleanfield;
            };

            exportContext.prototype.isHtmlCol = function (col) {
                if (col.option("cellFormatter") != null) {
                    return true;
                }
                return false;
            };

            exportContext.prototype.isImageCol = function (col) {
                return false;
            };

            exportContext.prototype.isLinkCol = function (col) {
                if (col instanceof wijmo.grid.c1buttonfield && col.option("buttonType") == "link") {
                    return true;
                }

                return false;
            };
            return exportContext;
        })();
        exporter.exportContext = exportContext;

        /**
        Export the grid to pdf, xls or csv file.
        * @param {GridExportSetting} The export settings.
        */
        function exportGrid(setting) {
            gridExporter.exportFile(setting);
        }
        exporter.exportGrid = exportGrid;

        /** @ignore */
        var gridExporter = (function () {
            function gridExporter() {
            }
            gridExporter.exportFile = function (setting) {
                var exportAction = function (exportSetting) {
                    return exporter.exportFile(exportSetting, exporter.toJSON(gridExporter._exportSource(exportSetting)));
                }, needNewSingleTable = gridExporter._needNewSingleTable(setting), needRequestAllData = gridExporter._needRequestAllData(setting), newOptions;

                if (!needNewSingleTable && !needRequestAllData) {
                    exportAction(setting);
                    return;
                }

                newOptions = gridExporter.createGridOptionsForAllData(setting, needRequestAllData);
                gridExporter.createGridWithExport(setting, newOptions, exportAction);
            };

            gridExporter.createGridOptionsForAllData = function (setting, needRequestAllData) {
                var grid = setting.grid, oldOptions = grid.options, data, newOptions = $.extend(true, {}, oldOptions, {
                    scrollMode: "none",
                    allowPaging: oldOptions.allowPaging,
                    allowVirtualScrolling: false,
                    selectionMode: "none"
                });

                if (needRequestAllData) {
                    newOptions.pageSize = grid.pageCount() * oldOptions.pageSize;
                    newOptions.pageIndex = 0;
                    data = gridExporter._createAllData(setting);
                }

                wijmo.grid.traverse(newOptions.columns, function (column, columns) {
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

                newOptions.data = data || gridExporter._cloneData(setting.grid.dataView().getSource());
                return newOptions;
            };

            gridExporter.createGridWithExport = function (setting, options, exportAction) {
                options.rendered = gridExporter.createGridRendered(setting, exportAction);
                $("<table>").appendTo($(document.body)).wijgrid(options);
            };

            gridExporter.createGridRendered = function (setting, exportAction, container) {
                return function () {
                    var $e = $(this), newSetting = $.extend({}, setting);
                    newSetting.grid = $e.data(setting.grid.widgetFullName);
                    exportAction(newSetting);
                    setTimeout(function () {
                        newSetting.grid.destroy();
                        container = container || $e.closest(".wijmo-wijgrid");
                        $e.remove();
                        container.remove();
                    });
                };
            };

            gridExporter._createAllData = function (setting) {
                var grid = setting.grid, options = grid.options, oldData = options.data, newPageSize = grid.pageCount() * options.pageSize, newDataOptions;

                if (!oldData || !wijmo || !wijmo.data || !options.allowPaging || grid.pageCount() <= 1 || setting.onlyCurrentPage) {
                    return null;
                }

                newDataOptions = $.extend(true, {}, oldData.options || {}, { pageIndex: 0, pageSize: newPageSize });
                if (wijmo.data.ArrayDataView && oldData instanceof wijmo.data.ArrayDataView) {
                    return new wijmo.data.ArrayDataView($.extend(true, {}, oldData.getSource()), newDataOptions);
                }

                if (wijmo.data["AjaxDataView"] && oldData instanceof wijmo.data["AjaxDataView"]) {
                    return new wijmo.data["AjaxDataView"](oldData.url, newDataOptions);
                }

                if (wijmo.data["ODataView"] && oldData instanceof wijmo.data["ODataView"]) {
                    return new wijmo.data["ODataView"](oldData.url, newDataOptions);
                }

                if (wijmo.data["BreezeDataView"] && oldData instanceof wijmo.data["BreezeDataView"]) {
                    return new wijmo.data["BreezeDataView"](oldData.query, oldData.manager, newDataOptions);
                }

                return null;
            };

            gridExporter._cloneData = function (data) {
                var newData;
                if ($.isArray(data)) {
                    newData = [];
                    $.each(data, function (i, item) {
                        return newData.push($.extend(true, {}, item));
                    });
                } else {
                    newData = $.extend(true, {}, data);
                }

                return newData;
            };

            gridExporter._exportSource = function (setting) {
                var environmentInfo = wijmo.exporter.gridExporter._generateEnvironmentInfo();
                var exportSource = {
                    grid: wijmo.exporter.gridExporter._generateTemplate(new exportContext(setting.grid, environmentInfo)),
                    environmentInfo: environmentInfo,
                    exportFileType: setting.exportFileType
                };
                if (setting.fileName)
                    exportSource.fileName = setting.fileName;
                if (setting.pdf)
                    exportSource.pdf = setting.pdf;
                if (setting.excel)
                    exportSource.excel = setting.excel;
                return exportSource;
            };

            gridExporter._needRequestAllData = function (setting) {
                var grid = setting.grid, o = grid.options;
                return (o.allowVirtualScrolling && grid.options.totalRows > grid.dataView().getSource().length) || (o.allowPaging && grid.pageCount() > 1 && setting.onlyCurrentPage === false);
            };

            gridExporter._needNewSingleTable = function (setting) {
                return setting.grid.options.scrollMode !== "none";
            };

            // the length string's pattern should be like 0px
            gridExporter.pxToPt = function (lengthStr, dpi) {
                if (lengthStr == null)
                    return 0;
                lengthStr = lengthStr.trim().toLowerCase();
                var suffix = "px";
                if (lengthStr.indexOf(suffix, lengthStr.length - suffix.length) == -1) {
                    return 0;
                }
                var numberPart = parseFloat(lengthStr);
                if (isNaN(numberPart))
                    return 0;
                return numberPart / dpi * wijmo.exporter.gridExporter.pointPerInch;
            };

            gridExporter._generateEnvironmentInfo = function () {
                var location = window.location, baseUrl = location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + "/", dpiTestDiv = $("<div style='height:1in;left:-100%;position: absolute;top:-100%;width:1in;'></div>").appendTo($(document.body));
                return {
                    baseUrl: baseUrl,
                    dpiX: dpiTestDiv.outerWidth(),
                    dpiY: dpiTestDiv.outerHeight(),
                    culture: navigator.language ? navigator.language : navigator.browserLanguage
                };
            };

            gridExporter._generateTemplate = function (context) {
                var $element = $(context.grid.element), style = wijmo.exporter.gridExporter._readStyle(context, $element), header = wijmo.exporter.gridExporter._readSection(context, $element.find(">thead"), 0 /* Header */), body = wijmo.exporter.gridExporter._readSection(context, $element.find(">tbody"), 1 /* Body */), footer = wijmo.exporter.gridExporter._readSection(context, $element.find(">tfoot"), 2 /* Footer */), $parent = $element.parent();
                if ($parent.hasClass("wijmo-wijgrid")) {
                    var combinedStyle = {};
                    $.extend(combinedStyle, wijmo.exporter.gridExporter._readStyle(context, $parent), style);
                    style = combinedStyle;
                }
                return {
                    colWidths: context.colWidths,
                    style: style,
                    header: header,
                    footer: footer,
                    body: body,
                    width: context.computedWidthToPt($element.css('width'))
                };
            };

            gridExporter._readSection = function (context, $section, sectionType) {
                context.currentSectionType = sectionType;
                return {
                    colInfos: sectionType === 1 /* Body */ ? context.colInfos : null,
                    style: wijmo.exporter.gridExporter._readStyle(context, $section),
                    rows: wijmo.exporter.gridExporter._readRows(context, $section),
                    height: context.computedHeightToPt($section.css('height'))
                };
            };

            gridExporter._getGroupLevel = function ($row) {
                var levelStr = $row.attr("aria-level");
                if (!levelStr) {
                    return 0;
                }

                return parseInt(levelStr);
            };

            gridExporter._isGroupHeader = function ($row) {
                return $row.hasClass("wijmo-wijgrid-groupheaderrow");
            };

            gridExporter._isGroupFooter = function ($row) {
                return $row.hasClass("wijmo-wijgrid-groupfooterrow");
            };

            gridExporter._readRows = function (context, $section) {
                if (!$section || !$section.length)
                    return null;
                var dataRowIndex = -1;
                return $section.find(">tr").map(function () {
                    var $row = $(this), rowType, templateType, row = { height: context.computedHeightToPt($row.css("height")) };

                    if (context.currentSectionType === 0 /* Header */) {
                        rowType = 1 /* Header */;
                        templateType = 3 /* HeaderTemplate */;
                    } else if (context.currentSectionType === 2 /* Footer */) {
                        rowType = 2 /* Footer */;
                        templateType = 4 /* FooterTemplate */;
                    } else if (gridExporter._isGroupHeader($row)) {
                        rowType = 3 /* GroupHeader */;
                        row.groupLevel = gridExporter._getGroupLevel($row);
                        templateType = context.createdGroupHeaderTemplates[row.groupLevel] ? 0 /* None */ : 5 /* GroupHeaderTemplate */;
                        context.createdGroupHeaderTemplates[row.groupLevel] = true;
                    } else if (gridExporter._isGroupFooter($row)) {
                        rowType = 4 /* GroupFooter */;
                        row.groupLevel = gridExporter._getGroupLevel($row);
                        templateType = context.createdGroupFooterTemplates[row.groupLevel] ? 0 /* None */ : 6 /* GroupFooterTemplate */;
                        context.createdGroupFooterTemplates[row.groupLevel] = true;
                    } else {
                        ++dataRowIndex;
                        rowType = 0 /* Data */;
                        if (dataRowIndex === 0) {
                            templateType = 1 /* Template */;
                        } else if (dataRowIndex === 1) {
                            templateType = 2 /* AltTemplate */;
                        } else {
                            templateType = 0 /* None */;
                        }
                    }

                    context.currentRowType = rowType;
                    context.currentRowTemplateType = templateType;

                    if (rowType != 0 /* Data */) {
                        row.type = rowType;
                    }

                    if (templateType != 0 /* None */) {
                        row.style = wijmo.exporter.gridExporter._readStyle(context, $row);
                        row.templateType = templateType;
                    }

                    row.cells = gridExporter._readCells(context, $row, dataRowIndex);
                    return row;
                }).get();
            };

            gridExporter._readCells = function (context, $row, rowIndex) {
                return $row.find(">th,>td").map(function (index) {
                    var $cell = $(this), cell = {}, cspan = wijmo.exporter.gridExporter._getSpan($cell, "colspan"), rspan = wijmo.exporter.gridExporter._getSpan($cell, "rowspan"), colIndex = wijmo.exporter.gridExporter._cellPos($cell).left, colInfo = context.colInfos[colIndex], innerCell = $cell.find(">.wijmo-wijgrid-innercell");

                    if (innerCell.length == 0)
                        innerCell = $cell;

                    if (colIndex != index)
                        cell.colIndex = colIndex;

                    if (rspan != 1)
                        cell.rowSpan = rspan;

                    if (cspan != 1)
                        cell.colSpan = cspan;

                    if (context.currentRowType === 0 /* Data */ && rowIndex > -1) {
                        switch (colInfo.type) {
                            case 2 /* Image */:
                                var $img = $cell.find("img");
                                if ($img.length != 0) {
                                    var imageInfo = {
                                        src: $img.attr("src"),
                                        height: context.computedHeightToPt($img.css("height")),
                                        width: context.computedWidthToPt($img.css("width"))
                                    };
                                    cell.value = imageInfo;
                                }
                                break;
                            case 3 /* Link */:
                                var $link = $cell.find("a");
                                if ($link.length != 0) {
                                    var linkInfo = {
                                        href: $link.attr("href"),
                                        text: $link.text()
                                    };
                                    cell.value = linkInfo;
                                }
                                break;
                            case 5 /* Html */:
                                cell.value = $cell.html();
                                break;
                            case 1 /* Text */:
                            case 4 /* Checkbox */:
                                cell.value = context.getDataValue(rowIndex, colIndex);
                                cell.text = $cell.text();
                                break;
                            default:
                                throw "Wrong column type!";
                        }
                    } else {
                        cell.text = $cell.text();
                    }

                    if (context.currentRowTemplateType != 0 /* None */) {
                        cell.style = wijmo.exporter.gridExporter._readStyle(context, $cell);
                        $.extend(cell.style, wijmo.exporter.gridExporter._readFontStyle(context, innerCell));
                    }

                    return cell;
                }).get();
            };

            gridExporter._readStyle = function (context, $element) {
                var style = {
                    backgroundColor: $element.css("backgroundColor"),
                    verticalAlign: $element.css("verticalAlign")
                };
                $.extend(style, wijmo.exporter.gridExporter._readBorderStyle(context, "Top", $element), wijmo.exporter.gridExporter._readBorderStyle(context, "Right", $element), wijmo.exporter.gridExporter._readBorderStyle(context, "Bottom", $element), wijmo.exporter.gridExporter._readBorderStyle(context, "Left", $element));
                return style;
            };

            gridExporter._readBorderStyle = function (context, borderType, $element) {
                var style = {}, colorProp = "border" + borderType + "Color", styleProp = "border" + borderType + "Style", widthProp = "border" + borderType + "Width", borderStyle = $element.css(styleProp);
                if (borderStyle != "none") {
                    var borderWidth = context.computedWidthToPt($element.css(widthProp));
                    if (borderWidth != 0) {
                        style[colorProp] = $element.css(colorProp);
                        style[styleProp] = borderStyle;
                        style[widthProp] = borderWidth;
                    }
                }
                return style;
            };

            gridExporter._readFontStyle = function (context, $element) {
                return {
                    paddingLeft: context.computedHeightToPt($element.css("paddingLeft")),
                    textAlign: $element.css("textAlign"),
                    color: $element.css("color"),
                    fontFamily: $element.css("fontFamily"),
                    fontWeight: $element.css("fontWeight"),
                    fontStyle: $element.css("fontStyle"),
                    fontSize: context.computedHeightToPt($element.css("fontSize")),
                    textDecoration: $element.css("textDecoration")
                };
            };

            gridExporter._cellPos = function ($cell, rescan) {
                var pos = $cell.data("cellPos");
                if (!pos || rescan) {
                    var $table = $cell.closest("table, thead, tbody, tfoot");
                    wijmo.exporter.gridExporter._scanTable($table);
                }
                pos = $cell.data("cellPos");
                return pos;
            };

            gridExporter._getSpan = function ($cell, spanName) {
                var span = $cell.attr(spanName);
                if (span) {
                    var spanNumber = parseInt(span);
                    if (!isNaN(spanNumber)) {
                        return spanNumber;
                    }
                }
                return 1;
            };

            gridExporter._scanTable = function ($table) {
                var m = [];
                $table.children("tr").each(function (y, row) {
                    $(row).children("td, th").each(function (x, cell) {
                        var $cell = $(cell), cspan = wijmo.exporter.gridExporter._getSpan($cell, "colspan"), rspan = wijmo.exporter.gridExporter._getSpan($cell, "rowspan"), tx, ty;
                        cspan = cspan ? cspan : 1;
                        rspan = rspan ? rspan : 1;
                        for (; m[y] && m[y][x]; ++x)
                            ;
                        for (tx = x; tx < x + cspan; ++tx) {
                            for (ty = y; ty < y + rspan; ++ty) {
                                if (!m[ty]) {
                                    m[ty] = [];
                                }
                                m[ty][tx] = true;
                            }
                        }
                        var pos = { top: y, left: x };
                        $cell.data("cellPos", pos);
                    });
                });
            };
            gridExporter.pointPerInch = 72;
            return gridExporter;
        })();
        exporter.gridExporter = gridExporter;

        var innerExportGrid = function (fileName, type, settings, serviceUrl) {
            var s, fName, t, setting = {}, sUrl;
            fName = fileName === undefined ? "export" : fileName;
            t = type === undefined ? "csv" : type;
            t = t.substr(0, 1).toUpperCase() + t.substr(1);
            if (typeof settings === "string" && arguments.length === 3) {
                sUrl = settings;
            } else {
                sUrl = serviceUrl === undefined ? "http://demos.componentone.com/ASPNET/ExportService/exportapi/grid" : serviceUrl;
                setting = settings;
            }
            s = {
                fileName: fName,
                serviceUrl: sUrl,
                grid: this,
                exportFileType: wijmo.exporter.ExportFileType[t]
            };
            if (type === "pdf") {
                s["pdf"] = setting;
            }
            if (type === "xls" || type === "xlsx") {
                s["excel"] = setting;
            }
            wijmo.exporter.exportGrid(s);
        };

        if (wijmo.grid && wijmo.grid.wijgrid) {
            wijmo.grid.wijgrid.prototype.exportGrid = innerExportGrid;
        }

        if ($.wijmo.wijgrid) {
            $.wijmo.wijgrid.prototype.exportGrid = innerExportGrid;
        }
    })(wijmo.exporter || (wijmo.exporter = {}));
    var exporter = wijmo.exporter;
})(wijmo || (wijmo = {}));
