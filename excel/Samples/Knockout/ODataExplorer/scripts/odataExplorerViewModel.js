// the main view model
function ODataExplorerViewModel(serviceListViewModel) {
    var that = this;
    // query text
    this.query = ko.observable();
    // view models for the service list and the service dialog window
    this.serviceList = serviceListViewModel;
    this.serviceDialog = serviceListViewModel.serviceDialog;

    // table of OData collections
    this.collections = ko.observableArray();
    this.currentCollection = ko.observable();

    // fill the collections table when the service selection changes
    serviceListViewModel.currentService.subscribe(function (service) {
        if (service) {
            // create an OData adapter for DataSet with the specified service URL
            var tableNames = new wijmo.data.AjaxDataView(service.url(), {
                ajax: {
                    data: { $format: "json" },
                    dataType: "jsonp",
                    jsonp: "$callback"
                },
                serverSettings: { results: "value" }
            });
            // load the table list
            tableNames.refresh().then(function () {
                // replace the contents of the "collections" table
                that.collections($.map(tableNames.local, function (table) {
                    return { value: table.name, label: table.name };
                }));
            });
        }
    });

    // when collection selection changes, change the query text and execute the query
    this.currentCollection = ko.observable();
    this.currentCollection.subscribe(function (name) {
        if (!name) return;
        that.query(name);
        that.executeQuery();
    }, this);
    this.setCurrentCollection = function (e, data) {
        that.currentCollection(data.item.value);
    };

    // table for storing the query execution result
    this.queryResult = ko.observable();
    // limit query result to 20 items per page

    this.executeQuery = function () {
        var query = this.query(),
            service = serviceListViewModel.currentService();
        if (!query || !service) return;

        var url = service.url();
        if (!url.match(/\/$/)) {
            url += "/";
        }
        url += query;

        this.queryResult(new wijmo.data.ODataView(url, {
            ajax: { dataType: "jsonp" },
            pageSize: 10
        }));
    };
}