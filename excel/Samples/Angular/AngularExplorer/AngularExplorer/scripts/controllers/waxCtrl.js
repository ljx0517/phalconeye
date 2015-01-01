"use strict";

// the waxCtrl controller is used by all views in this app.
function waxCtrl($scope, $routeParams, airportService) {

    // get airports from service
    $scope.airports = airportService.airports;

    // select airport
    if ($routeParams.apcode != null) {
        $scope.gotoAirport($routeParams.apcode);
        $scope.zoom = 12;
    } else {
        $scope.location = { lat: +40.4587, lon: -79.9250 };
        $scope.zoom = 4;
    }

    // chart data
    $scope.getChartData = function () {

        // column titles
        var data = [["Airport", "2011", "2010", "2009"]];

        // airport data
        for (var i = 0; i < $scope.airports.length && i < 10; i++) {
            var ap = $scope.airports[i];
            if (ap.vol2011 && ap.vol2010 && ap.vol2009) {
                data.push([ap.code, formatData(ap.vol2011), formatData(ap.vol2010), formatData(ap.vol2009)]);
            }
        }

        // return the data
        return data;

        // function used to format the data with up to three decimals
        function formatData(value) {
            return (value / 1e6).toFixed(3) * 1;
        }
    };

    // map markers
    $scope.getMapMarkers = function () {
        var data = [];
        for (var i = 0; i < $scope.airports.length; i++) {
            var ap = $scope.airports[i];
            data.push({
                lat: ap.lat, 
                lon: ap.lon, 
                title: ap.city + ", " + ap.state + " (" + ap.code + ")" 
            });
        }
        return data;
    };

    // map methods
    $scope.gotoLocation = function (lat, lon) {
        $scope.location = { lat: lat, lon: lon };
        $scope.safeApply("location");
        return true;
    }
    $scope.gotoAirport = function (apcode) {
        for (var i = 0; i < $scope.airports.length; i++) {
            var ap = $scope.airports[i];
            if (ap.code == apcode) {
                $scope.location = { lat: ap.lat, lon: ap.lon };
                $scope.safeApply("location");
                return true;
            }
        }
        return false;
    }
    $scope.gotoCurrentLocation = function () {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var c = position.coords;
                $scope.location = { lat: c.latitude, lon: c.longitude };
                $scope.safeApply("location");
            });
            return true;
        }
        return false;
    };

    // btst-typeahead functions (http://twitter.github.io/bootstrap/javascript.html#typeahead)
    $scope.taSource = function (query, process) {
        var matches = [];

        // this matcher breaks up the query into pieces and finds matches even if they
        // are not contiguous: for example, "john ken" will match "John Fitzgerald Kennedy".
        var terms = query.toLowerCase().split(" ");
        for (var i = 0; i < $scope.airports.length && matches.length < 8; i++) {
            var ap = $scope.airports[i];
            var item = (ap.code + " " + ap.name + " " + ap.state + " " + ap.city).toLowerCase();
            var match = true;
            for (var j = 0; j < terms.length && match; j++) {
                if (item.indexOf(terms[j]) < 0) {
                    match = false;
                }
            }

            // add this match to the list
            if (match) {
                matches.push(ap.code + " " + ap.city);
            }
        }

        // return list of matches found
        return matches;
    };
    $scope.taMatcher = function (item) {
        return true; // all our items match
    };
    $scope.taHighlighter = function (item) {
        // highlight the item by enclosing every instance of a match in <b></b>.
        // for example, if the query is "john ken" and the item is "John Fitzgerald Kennedy",
        // this highlighter will return "<b>John</b> Fitzgerald <b>Ken</b>nedy".
        var terms = this.query.toLowerCase().split(" ");
        for (var j = 0; j < terms.length; j++) {
            if (terms[j].length > 1) {
                // replace skipping html tags
                // http://stackoverflow.com/questions/4236712/complex-html-string-replace-function/4240683#4240683
                var rx = new RegExp("(?![^<>]*>)(" + terms[j] + ")", "gi");
                item = item.replace(rx, function (match) {
                    return "<b>" + match + "</b>";
                });
            }
        }
        return item;
    }

    // wij-autocomplete function: performs the tasks of source and highlighter
    $scope.acSource = function (request, response) {
        var matches = [];

        // this matcher breaks up the query into pieces and finds matches even if they
        // are not contiguous: for example, "john ken" will match "John Fitzgerald Kennedy".
        var terms = request.term.toLowerCase().split(" ");
        for (var i = 0; i < $scope.airports.length && matches.length < 8; i++) {
            var ap = $scope.airports[i];
            var item = (ap.code + " " + ap.name + " " + ap.state + " " + ap.city).toLowerCase();
            var match = true;
            for (var j = 0; j < terms.length && match; j++) {
                if (item.indexOf(terms[j]) < 0) {
                    match = false;
                }
            }

            // add this match to the list
            if (match) {
                var label = ap.code + " " + ap.city;
                for (var j = 0; j < terms.length; j++) {
                    if (terms[j].length > 1) {
                        // replace skipping html tags
                        // http://stackoverflow.com/questions/4236712/complex-html-string-replace-function/4240683#4240683
                        var rx = new RegExp("(?![^<>]*>)(" + terms[j] + ")", "gi");
                        label = label.replace(rx, function (match) {
                            return "<b>" + match + "</b>";
                        });
                    }
                }
                match = { value: ap.code + " " + ap.city, label: label };
                matches.push(match);
            }
        }

        // return list of matches found
        return response(matches);
    };

    // wij-combobox function
    $scope.getComboItems = function () {
        var items = [];
        for (var i = 0; i < $scope.airports.length; i++) {
            var ap = $scope.airports[i];
            var item = { label: ap.code + ": " + ap.city, value: ap.code };
            items.push(item);
        }
        return items;
    };

    // trip data
    $scope.trip = {
        from: "PIT",
        to: "LAX",
        minDate: $.datepicker.formatDate('yy-mm-dd', new Date()),
        departDate: $.datepicker.formatDate('yy-mm-dd', new Date()),
        returnDate: $.datepicker.formatDate('yy-mm-dd', new Date()),
        adults: 1,
        seniors: 0,
        children: 0,
        class: "economy",
        extras: 3, // flags field: 1=hotel, 2=car, 4=insurance,
    };
    $scope.setTripClass = function (cls) {
        if ($scope.trip.class != cls) {
            $scope.trip.class = cls;
            $scope.safeApply("trip.class");
        }
    };
    $scope.getTripExtra = function (extra) {
        return ($scope.trip.extras & extra) != 0;
    }
    $scope.setTripExtra = function (extra, onOff) {
        var extras = scope.$eval(onOff)
            ? $scope.trip.extras | extra
            : $scope.trip.extras & ~extra;
        if (extras != $scope.trip.extras) {
            $scope.trip.extras = extras;
            $scope.safeApply("trip.extras");
        }
    }
    $scope.toggleTripExtra = function (extra) {
        $scope.trip.extras = ($scope.trip.extras & extra) == 0
            ? $scope.trip.extras | extra
            : $scope.trip.extras & ~extra;
        $scope.safeApply("trip.extras");
    };

    // misc
    $scope.say = function (what) {
        alert("The controller says: ** " + what + " **");
    };
    $scope.safeApply = function (expression) {
        if (!$scope.$$phase) $scope.$apply(expression);
    };
}
