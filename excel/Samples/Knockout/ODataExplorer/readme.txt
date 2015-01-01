ODataExplorer
--------------------------------------------------------------------------------------------
Allows browsing 3rd-party OData endpoints.

This sample shows how Wijmo Data can be used to retrieve data from arbitrary OData endpoints
that quilify certain requirements. Also this sample follows the MVVM pattern. 
The ViewModel contains ODataView that manages entities loading and data binding.
A Wijmo Grid is bound to the ODataView.

Given an endpoint URL, ODataExplorer retrieves the list of Entity sets
and displays entities.

NOTE: In order to be browsed, an OData endpoint must support JSON format. 
Two OData endpoints are available out of box. 

<product>Wijmo;HTML5</product>