Grid Benchmark Application
---------------------------------------------------
An AngularJS application for benchmark testing our Grid performance against other grids

This sample has partials views for Wijmo Grid, NG-Grid, SlickGrid and Table. 
It uses time() to test grid initialization time for all grids. They can be 
tested with 5-50,000 rows. The Grids are virtualizaed to allow for that 
much data to be bound without problem.

To enable virtualization in the Wijmo Grid, set allowVirtualScrolling=true.
