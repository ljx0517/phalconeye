angular.module("wijspread", [])

// wij utilities
.factory("wijUtil", function () {
    return {

        // watch for changes in scope variables, call update function when all have been initialized
        watchScope: function (scope, props, updateFn, updateOnTimer, updateOnResize) {

            // watch all variables in the props array, keep count of changes and start
            // calling the update function fn only after all variables have been initialized.
            var cnt = props.length;
            angular.forEach(props, function (prop) {
                scope.$watch(prop, function (value) {

                    // decrement count; when this reaches zero, all scope variables are initialized
                    cnt--;

                    // call update function when count reaches zero (all properties have been initialized)
                    // or when the count is negative and the value is non-null.
                    if (cnt == 0 || (cnt < 0 && value)) {
                        //console.log(prop + " changing to " + value);
                        if (updateOnTimer) {
                            if (scope.updateTimeout) clearTimeout(scope.updateTimeout);
                            scope.updateTimeout = setTimeout(updateFn, 50);
                        } else {
                            updateFn();
                        }
                    }
                });
            });

            // call update function when user resizes the window 
            // so the control can resize itself if it wants to.
            if (updateOnResize) {
                $(window).resize(function () {
                    if (scope.resizeTimeout) clearTimeout(scope.resizeTimeout);
                    scope.resizeTimeout = setTimeout(updateFn, 100);
                })
            }
        },

        // set an undefined scope variable to a default value
        setDefVal: function (scope, prop, defaultValue) {
            if (!scope[prop] && scope[prop] != defaultValue) {
                scope[prop] = defaultValue;
                //if (!scope.$$phase) scope.$apply(prop);
            }
        },

        // set an undefined scope variable to a default value
        apply: function (scope, prop, value) {
            if (scope[prop] != value) {
                scope[prop] = value;
                if (!scope.$$phase) scope.$apply(prop);
            }
        }
    }
})

// ** wij-spread directive
// - Excel-compatible control.
// - Implemented using the Wijmo spreadJS widget.
// ** example
// <wij-spread style="width:600px;height:300px;border: 1px solid gray;font-size:10.5pt" >
//   <wij-spread-sheet title="Sales" data="data" frozen-columns="1">
//     <wij-spread-column binding="country" width="100" ></wij-spread-column>
//     <wij-spread-column binding="product" width="140" ></wij-spread-column>
//     <wij-spread-column binding="amount" width="100" format="#,##0.00" read-only="true" ></wij-spread-column>
//     <wij-spread-column binding="date" width="100" format="mm-dd-yyyy"></wij-spread-column>
//   </wij-spread-sheet>
// </wij-spread>
// ** see
// - Wijmo spreadJS: http://wijmo.com/widgets/wijmo-enterprise/spreadjs/
.directive("wijSpread", ["wijUtil", function (wijUtil) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template: "<div ng-transclude/>",
        scope: {
            showTabs: "@" // Whether to show the sheet selection tabs.
        },

        // add sheets to this spread
        controller: ["$scope", function ($scope) {
            $scope.sheets = [];
            this.addSheet = function (sheet) {
                $scope.sheets.push(sheet);
            };
        } ],

        link: function (scope, element, attrs) {

            // create spread component
            var sheetCount = scope.sheets ? scope.sheets.length : 1;
            element.wijspread({ sheetCount: sheetCount, newTabVisible: false,  tabEditable: false});
            var spread = element.wijspread("spread");

            // set tab visibility
            scope.$watch("showTabs", function () {
                var showTabs = scope.showTabs ? scope.$eval(scope.showTabs) : scope.sheets.length > 1;
                spread.tabStripVisible(showTabs);
            });

            // associate actual sheets with sheet scopes
            for (var i = 0; i < scope.sheets.length; i++) {
                var sheet = spread.getSheet(i);
                scope.sheets[i].setSheet(spread, sheet);
            }
        }
    }
} ])

// ** wij-spread-sheet directive
// - Sheet in a wij-spread control.
// - Implemented using the Wijmo spreadJS widget.
// ** requires SpreadJS
// <script src="http://cdn.wijmo.com/spreadjs/jquery.wijmo.wijspread.all.3.20141.9.min.js" 
//         type="text/javascript"></script>
// <link href="http://cdn.wijmo.com/spreadjs/jquery.wijmo.wijspread.3.20141.9.css" 
//         rel="stylesheet" type="text/css" />
// ** example
// <wij-spread style="width:600px;height:300px;border: 1px solid gray;font-size:10.5pt" >
//   <wij-spread-sheet title="Sales" data="data" frozen-columns="1">
//     <wij-spread-column binding="country" width="100" ></wij-spread-column>
//     <wij-spread-column binding="product" width="140" ></wij-spread-column>
//     <wij-spread-column binding="amount" width="100" format="#,##0.00" read-only="true" ></wij-spread-column>
//     <wij-spread-column binding="date" width="100" format="mm-dd-yyyy"></wij-spread-column>
//   </wij-spread-sheet>
// </wij-spread>
// ** see
// - Wijmo spreadJS: http://wijmo.com/widgets/wijmo-enterprise/spreadjs/
.directive("wijSpreadSheet", ["wijUtil", function (wijUtil) {
    return {
        require: "^wijSpread",
        restrict: "E",
        replace: true,
        transclude: true,
        template: "<div ng-transclude/>",
        scope: {
            data: "=",          // List of items to bind to.
            title: "@",         // Title for this sheet (value that appears in the tab).
            autoFit: "@",       // Whether to auto-fit the column width after binding the column.
            frozenColumns: "@"  // Number of non-scrollable columns.
        },

        // add columns to this sheet
        controller: ["$scope", function ($scope) {
            $scope.columns = [];
            this.addColumn = function (column) {
                $scope.columns.push(column);
            };
        } ],

        link: function (scope, element, attrs, wijSpread) {

            // create column validators
            var ns = $.wijmo.wijspread;
            var numericValidator = ns.DefaultDataValidator.createNumberValidator(ns.ComparisonOperator.NotEqualsTo, null, null, true);
            var dateValidator = ns.DefaultDataValidator.createDateValidator(ns.ComparisonOperator.GreaterThan, new Date(1900, 1, 1, 0, 0, 0, 0), 1, true);

            // add this sheet to the parent spread
            wijSpread.addSheet(scope);

            // get a reference to the actual sheet
            scope.setSheet = function (spread, sheet) {

                // apply changes when done editing cells on this sheet
                spread.bind(ns.Events.EditEnd, function (event, data) {
                    if (data.sheet == sheet) {
                        if (scope.data && !scope.$$phase) scope.$apply("data");
                    }
                });

                // cancel edits if the type is wrong
                spread.bind(ns.Events.ValidationError, function (event, data) {
                    data.validationResult = ns.DataValidationResult.Discard; //restore original value
                });

                // customize the style for cells, col headers, and row headers
                var font = getElementFont();
                angular.forEach(ns.SheetArea, function (item, index) {
                    var style = sheet.getDefaultStyle(item);
                    if (style) {
                        style.font = font;
                        style.vAlign = ns.VerticalAlign.center;
                        style.textIndent = 0.3; // add a little indentation
                    }
                });

                // update the sheet title and number of frozen columns
                scope.$watch("title", updateSheetTitle);
                scope.$watch("frozenColumns", updateFrozenColumns);

                // bind the sheet when the data source changes
                //scope.$watch("data", bindSheet);

                // bind the sheet when column properties change 
                if (scope.columns && scope.columns.length > 0) {
                    var arr = ["data", "binding", "header", "format", "width", "readOnly", "wordWrap", "autoFit"];
                    wijUtil.watchScope(scope, arr, bindSheet, true, false);
                } else {
                    scope.$watch("data", bindSheet);
                }


                // bind the sheet
                function bindSheet() {
                    if (scope.data) {

                        // suspend painting while binding
                        sheet.isPaintSuspended(true);

                        // set default row height (function of font size)
                        sheet.defaults.rowHeight = parseInt(element.css("font-size")) + 12;

                        // bind grid
                        var hasColumns = scope.columns && scope.columns.length > 0;
                        if (hasColumns) {
                            sheet.isProtected = true;
                            spread.isProtected = true;
                            sheet.autoGenerateColumns = false;
                            sheet.setColumnCount(scope.columns.length);
                            sheet.setDataSource(scope.data, false);
                            for (var col = 0; col < scope.columns.length; col++) {
                                bindColumn(col);
                            }
                        } else {
                            var colWidths = getColWidths();
                            sheet.isProtected = false;
                            spread.isProtected = false;
                            sheet.autoGenerateColumns = true;
                            sheet.setDataSource(scope.data, false);
                            for (var col = 0; col < sheet.getColumnCount(); col++) {
                                var header = sheet.getValue(0, col, ns.SheetArea.colHeader);
                                header = getHeader(header);
                                sheet.setValue(0, col, header, ns.SheetArea.colHeader);
                                if (header.indexOf("$$") == 0) { // remove columns bound to work variables
                                    sheet.deleteColumns(col, 1);
                                    col--;
                                }
                            }
                            setColWidths(colWidths);
                        }

                        // auto-fit
                        if (scope.autoFit && scope.$eval(scope.autoFit)) {
                            for (var col = 0; col < sheet.getColumnCount(); col++) {
                                sheet.autoFitColumn(col);
                            }
                        } else if (scope.columns && scope.columns.length > 0) {
                            for (var col = 0; col < sheet.getColumnCount(); col++) {
                                var autoFit = scope.columns[col].autoFit;
                                if (autoFit && scope.$eval(autoFit)) {
                                    sheet.autoFitColumn(col);
                                }
                            }
                        }

                        // input validation
                        if (sheet.getRowCount() > 0) {
                            for (var col = 0; col < sheet.getColumnCount(); col++) {
                                var cell = sheet.getCell(0, col);
                                if (cell) {
                                    if (angular.isNumber(cell.value())) {
                                        sheet.getColumn(col).dataValidator(numericValidator);
                                    } else if (angular.isDate(cell.value())) {
                                        sheet.getColumn(col).dataValidator(dateValidator);
                                    }
                                }
                            }
                        }

                        // update the sheet title and number of frozen columns
                        updateSheetTitle();
                        updateFrozenColumns();

                        // resume painting
                        sheet.isPaintSuspended(false);
                    }
                }

                // add a bound column to the sheet
                function bindColumn(index) {

                    // bind column
                    var scopeCol = scope.columns[index];
                    sheet.bindColumn(index, scopeCol.binding);
                    var column = sheet.getColumn(index);

                    // apply header
                    var header = scopeCol.header;
                    if (!header) {
                        header = getHeader(scopeCol.binding);
                    }
                    sheet.setValue(0, index, header, ns.SheetArea.colHeader);

                    // apply format
                    if (scopeCol.format) {
                        var fmt = new ns.GeneralFormatter(scopeCol.format);
                        column.formatter(fmt);
                    }

                    // apply width
                    if (scopeCol.width) {
                        sheet.setColumnWidth(index, scopeCol.width * 1);
                    }

                    // apply word wrap
                    var wordWrap = scopeCol.wordWrap ? scope.$eval(scopeCol.wordWrap) : false;
                    column.wordWrap(wordWrap);

                    // lock read-only columns to prevent editing
                    var locked = scopeCol.readOnly ? scope.$eval(scopeCol.readOnly) : false;
                    column.locked(locked);
                }

                // gets a font descriptor from the current element
                function getElementFont() {
                    var sz = parseInt(element.css("font-size"));
                    if (sz && sz > 0) {
                        sz = Math.round(parseInt(element.css("font-size")) * 72 / 96, 2);
                        return sz + "pt " + element.css("font-family");
                    }
                    return null;
                }

                // gets a header for a column based on the binding name
                function getHeader(name) {
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                    while (name.indexOf("_") > -1) name = name.replace("_", " ");
                    return name;
                }

                // save and restore column widths after re-binding
                function getColWidths() {
                    var arr = [];
                    for (var i = 0; i < sheet.getColumnCount(); i++) {
                        arr.push(sheet.getColumn(i).width());
                    }
                    return arr;
                }
                function setColWidths(colWidths) {
                    if (sheet.getColumnCount() == colWidths.length) {
                        for (var i = 0; i < sheet.getColumnCount(); i++) {
                            sheet.getColumn(i).width(colWidths[i]);
                        }
                    }
                }

                // update the sheet title
                function updateSheetTitle() {
                    if (scope.title) {
                        sheet.setName(scope.title);
                    }
                }

                // update the number of frozen columns
                function updateFrozenColumns() {
                    var fc = scope.frozenColumns ? scope.frozenColumns * 1 : 0;
                    sheet.setFrozenCount(0, fc);
                }
            }
        }
    }
} ])

// ** wij-spread-column directive
// - Column in a wij-spread-sheet sheet.
// - Implemented using the Wijmo spreadJS widget.
// ** example
// <wij-spread style="width:600px;height:300px;border: 1px solid gray;font-size:10.5pt" >
//   <wij-spread-sheet title="Sales" data="data" frozen-columns="1">
//     <wij-spread-column binding="country" width="100" ></wij-spread-column>
//     <wij-spread-column binding="product" width="140" ></wij-spread-column>
//     <wij-spread-column binding="amount" width="100" format="#,##0.00" read-only="true" ></wij-spread-column>
//     <wij-spread-column binding="date" width="100" format="mm-dd-yyyy"></wij-spread-column>
//   </wij-spread-sheet>
// </wij-spread>
// ** see
// - Wijmo spreadJS: http://wijmo.com/widgets/wijmo-enterprise/spreadjs/
.directive("wijSpreadColumn", function () {
    return {
        require: "^wijSpreadSheet",
        restrict: "E",
        replace: true,
        template: "<div/>",
        scope: {
            binding: "@",       // Property shown in this column.
            header: "@",        // Column header content.
            format: "@",        // Format used to display numeric values in this column.
            width: "@",         // Column width in pixels.
            readOnly: "@",      // Whether user can edit this column.
            wordWrap: "@",      // Whether text can wrap within cells in this column.
            autoFit: "@"        // Whether to auto-fit the column width after binding the column.
        },

        // add this column to the parent sheet
        link: function (scope, element, attrs, wijSheet) {
            wijSheet.addColumn(scope);
        }
    };
});
