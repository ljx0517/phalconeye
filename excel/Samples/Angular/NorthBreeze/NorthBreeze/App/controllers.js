'use strict';

// RouteCtrl - expose app.routes and the current route for the navbar
app.controller('RouteCtrl', function ($scope, $route) {
        $scope.$route = $route;
        $scope.links = app.routes;
});

// HomeCtrl - expose the changed entities in the EntityManager
app.controller('HomeCtrl', ['$scope', function ($scope) {

    $scope.reset = function () {
        app.dataservice.rejectChanges();
    }

    $scope.update = function () {
        app.dataservice.saveChanges();
    }

    // expose all the changed entities from the entityManager
    $scope.changedEntities = app.dataservice.getChanges();
    app.dataservice.subscribeChanges(function (changeargs) {
        $scope.changedEntities = app.dataservice.getChanges();
    });

}]);

// CustomerCtrl - load the customers and configure the grid to display them
app.controller('CustomerCtrl', ['$scope', function ($scope) {

    $scope.mydataView = new wijmo.data.BreezeDataView(new breeze.EntityQuery("Customers"), app.dataservice.manager, {
        pageSize: 10,
        filter: null
    });
    $scope.currentItem = null;
    $scope.mydataView.currentItem.subscribe(function (data) {
        $scope.currentItem = data;
        $scope.$apply();
    });

    $scope.reset = function (currentItem) {
        currentItem.entityAspect.rejectChanges();
    }

    $scope.update = function (currentItem) {
        app.dataservice.saveChanges([currentItem]);
    }

}]);

app.controller('OrderCtrl', function ($scope) {

    $scope.orders = $scope.orders || [];
    
    app.dataservice.getOrders()
        .then(querySucceeded)
        .fail(queryFailed);

    //#region private functions
    function querySucceeded(data) {
        $scope.orders = data.results;
        $scope.$apply();
        app.logger.info("Fetched " + data.results.length + " Orders ");
    }

    function queryFailed(error) {
        logger.error(error.message, "Query failed");
    }


});
