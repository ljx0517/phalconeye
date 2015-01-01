"use strict";

// define app (depends on "wijmo", and also on the modules that contain our directives)
// IMPORTANT: if you forget to include a directive, there will be no error message!!!
angular.module("gbApp", ["wijmo", "ngGrid", "slick", "wijspread"]).
  config(["$routeProvider", function ($routeProvider) {
      $routeProvider.

      when("/home",         { templateUrl: "partials/home.htm" }).
      when("/wijgrid",      { templateUrl: "partials/wijgrid.htm" }).
      when("/spreadjs",     { templateUrl: "partials/spreadjs.htm" }).
      when("/html",         { templateUrl: "partials/htmltable.htm" }).
      when("/slickgrid",    { templateUrl: "partials/slickgrid.htm" }).
      when("/nggrid",       { templateUrl: "partials/nggrid.htm" }).
      when("/tcc",          { templateUrl: "partials/tcc.htm" }).

      when("/", { templateUrl: "partials/home.htm" }).
      otherwise({ redirectTo: "/" });
  } ]);

