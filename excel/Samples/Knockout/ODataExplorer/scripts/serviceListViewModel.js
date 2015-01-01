// view model for the list of service endpoints
function ServiceListViewModel(serviceDialog) {
    var that = this;
    this.serviceDialog = serviceDialog;
    // initialize the table
    this.services = ko.observableArray([
        { name: ko.observable("Northwind"), url: ko.observable("http://services.odata.org/Northwind/Northwind.svc") },
        { name: ko.observable("OData website"), url: ko.observable("http://services.odata.org/Website/odata.svc") }
    ]);
    this.currentService = ko.observable();
    this.setCurrentService = function setCurrentService(e, data) {
        var service = $.grep(that.services(), function (s) {
            return s.url() === data.item.value;
        })[0];

        if (service) {
            that.currentService(service);
        }
    };


    // --- Functions to manipulate services ---

    // remove the current service
    this.removeService = function () {
        if (this.currentService()) {
            that.services.remove(this.currentService());
        }
    };

    // add a new service
    this.addService = function () {
        // create a new service
        var service = { name: "", url: "http://" };
        // show the editing window
        serviceDialog.show(service, function () {
            // add a new service
            that.services.push(service);
        });
    };

    // editing the current service
    this.editService = function () {
        if (this.currentService()) {
            serviceDialog.show(this.currentService());
        }
    };
}