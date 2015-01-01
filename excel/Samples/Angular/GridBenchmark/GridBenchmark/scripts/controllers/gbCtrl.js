"use strict";

// the waxCtrl controller is used by all views in this app.
function gbCtrl($scope, $routeParams, $filter) {

    // grid data
    $scope.itemCount = 500;
    $scope.data = getData($scope.itemCount);

    // set options for slick-grid
    $scope.slickGridOptions = {
        editable: true,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    }
    $scope.slickGridColumns = [
        { id: "id", name: "ID", field: "id", width: 50, cssClass: "text-right", sortable: true },
        { id: "date", name: "Date", field: "date", width: 100, formatter: sgFormatter, sortable: true },
        { id: "country", name: "Country", field: "country", width: 100, sortable: true },
        { id: "product", name: "Product", field: "product", width: 140, sortable: true },
        { id: "color", name: "Color", field: "color", width: 140, sortable: true },
        { id: "amount", name: "Amount", field: "amount", width: 100, formatter: sgFormatter, cssClass: "text-right", sortable: true }
    ];

    // use AngularJS filters to format slick-grid data
    function sgFormatter(row, cell, value, columnDef, dataContext) {
        if (angular.isDate(value)) {
            return $filter("date")(value);
        }
        if (angular.isNumber(value)) {
            return $filter("currency")(value, 2);
        }
        return value;
    }

    // set options for ng-grid
    $scope.gridOptions = {
        data: "data",
        enableColumnResize: true,       // Enable or disable resizing of columns
        enableColumnReordering: true,   // Enable or disable reordering of columns
        enableSorting: true,
        enableCellSelection: true,
        columnDefs: [
            { field: "id", displayName: "ID", width: 50, cellClass: "text-right", enableCellEdit: true },
            { field: "date", displayName: "Date", cellFilter: "date", width: 100, enableCellEdit: true },
            { field: "country", displayName: "Country", width: 100, enableCellEdit: true },
            { field: "product", displayName: "Product", width: 140, enableCellEdit: true },
            { field: "color", displayName: "Color", width: 140, enableCellEdit: true },
            { field: "amount", displayName: "Amount", cellFilter: "currency", width: 100, cellClass: "text-right", enableCellEdit: true }
        ]
    };

    // refresh the data to update the item count
    $scope.refreshData = function () {
        $scope.data = getData($scope.itemCount);
    }

    // create data
    function getData(count) {
        var data = [];
        var countries = ["US", "Germany", "UK", "Japan", "Italy"];
        var products = ["Widget", "Gadget", "Doohickey"];
        var colors = ["Black", "White", "Red", "Green", "Blue", "Yellow", "Orange", "Brown"];
        var dt = new Date();
        for (var i = 0; i < count; i++) {
            var item = {
                id: i,
                date: new Date(dt.getFullYear(), i % 12, 1),
                country: countries[Math.floor(Math.random() * countries.length)],
                product: products[Math.floor(Math.random() * products.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
                amount: 1000 + Math.random() * 10000
            };
            data.push(item);
        }
        return data;
    }

    // start benchmarking this view
    $scope.benchmark = {};
    var viewName = null;
    var startTime = null;
    var docChangedTimeout = null;
    $scope.benchmarkView = function (name) {
        startTime = new Date();
        viewName = name;
    }
    $(document).bind("DOMSubtreeModified", function () {
        if (viewName) {
            if (docChangedTimeout) clearTimeout(docChangedTimeout);
            docChangedTimeout = setTimeout(function () {

                // measure elapsed time when DOM stops changing for a while
                var endTime = new Date();
                var elapsed = (endTime.getTime() - startTime.getTime()) / 1000;
                //console.log("done loading " + viewName + ": " + elapsed.toFixed(2) + " seconds");

                // save/update elapsed time for this view
                $scope.benchmark[viewName] = elapsed.toFixed(2) + "s";
                if (!$scope.$$phase) {
                    $scope.$apply("benchmark");
                }
                viewName = null;
            }, 100);
        }
    });

  
}
