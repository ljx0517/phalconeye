angular.module("slick", [])

.directive("slickGrid", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            options: "=",
            data: "=",
            columns: "="
        },
        template: "<div></div>",
        link: function (scope, element, attrs) {

            // watch all variables
            scope.$watch("options", updateControl, true);
            scope.$watch("data", updateControl, true);
            scope.$watch("columns", updateControl, true);

            // create/refresh the control
            function updateControl() {

                if (scope.data && scope.columns && scope.options) {

                    // ensure element has an ID
                    var id = element.attr("id");
                    if (!id) {
                        id = "sg" + scope.$id;
                        element.attr("id", id);
                    }

                    // create grid
                    var grid = new Slick.Grid("#" + id, scope.data, scope.columns, scope.options);
                }
            }
        }
    }
});
