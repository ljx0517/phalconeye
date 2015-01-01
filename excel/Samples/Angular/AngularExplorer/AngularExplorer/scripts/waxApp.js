"use strict";

// define app (depends on "wijmo", and also on the modules that contain our directives)
// IMPORTANT: if you forget to include a directive, there will be no error message!!!
angular.module("waxApp", [ "ngRoute", "wijmo" ]).
  config(["$routeProvider", function ($routeProvider) {
      $routeProvider.

      // show wijmo directives
      when("/wijmo/input", { templateUrl: "partials/wijmo/input.htm" }).
      when("/wijmo/commands", { templateUrl: "partials/wijmo/commands.htm" }).
      when("/wijmo/layout", { templateUrl: "partials/wijmo/layout.htm" }).
      when("/wijmo/charts", { templateUrl: "partials/wijmo/charts.htm" }).
      when("/wijmo/gauges", { templateUrl: "partials/wijmo/gauges.htm" }).
      when("/wijmo/grid", { templateUrl: "partials/wijmo/grid.htm" }).
      when("/wijmo/docs", { templateUrl: "partials/wijmo/docs.htm" }).

      // home
      when("/", { templateUrl: "partials/home.htm" }).
      otherwise({ redirectTo: "/" });
  } ]);

