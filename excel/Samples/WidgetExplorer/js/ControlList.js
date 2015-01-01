/* ===== WIDGET SAMPLES ORGANIZATION ===== */
/*
		DATASOURCE SAMPLES
		1. Simple data source (seriesList, shared data.x)
		2. Array as data source
		3. Shared array
		4. Multiple arrays data source
		5. DataView
		6. AJAX
		7. Data and datasource  manipulations


		METADATA SAMPLES
		1. Header
		2. Tooltip
		3. Indicator
		4. Legend
		5. Labels

		BEHAVIOR SAMPLES
		1. LineChart -> AreaChart
		2. PieChart -> DonutChart
		3. ...

		VISUALIZATION SAMPLES
		1. Size/Dementions
		2. Colors
		3. Stroke types, patterns, icons, images, backgrounds
		3. Position, Orientation, Direction
		4. Text display, font options
		
		ANIMATION
		1. Animations
		2. Transitions

		OTHER SAMPLES

*/

var ControlList = {
    "Knockout": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/using_Wijmo_with_Knockout",
        "actions": [{ "page": "knockout/overview.html", "name": "Overview" },
					{ "page": "knockout/ko_jquery_ui.html", "name": "jQuery UI Widgets" },
					{ "page": "knockout/ko_slider_progress_gauge.html", "name": "Multiple Widgets" },
					{ "page": "knockout/ko_wijaccordion.html", "name": "Accordion" },
					{ "page": "knockout/ko_wijbarchart.html", "name": "BarChart" },
					{ "page": "knockout/ko_wijbubblechart.html", "name": "BubbleChart" },
					{ "page": "knockout/ko_wijcalendar.html", "name": "Calendar" },
					{ "page": "knockout/ko_wijcarousel.html", "name": "Carousel" },
					{ "page": "knockout/ko_wijcombobox.html", "name": "ComboBox" },
					{ "page": "knockout/ko_wijcompositechart.html", "name": "CompositeChart" },
					{ "page": "knockout/ko_wijdialog.html", "name": "Dialog" },
					{ "page": "knockout/ko_wijeditor.html", "name": "Editor" },
					{ "page": "knockout/ko_wijexpander.html", "name": "Expander" },
					{ "page": "knockout/ko_wijfileexplorer.html", "name": "FileExplorer" },
					{ "page": "knockout/ko_wijformdecorator.html", "name": "FormDecorator" },
					{ "page": "knockout/ko_wijgallery.html", "name": "Gallery" },
					{ "page": "knockout/ko_wijgrid.html", "name": "Grid" },
					{ "page": "knockout/ko_wijgrid-remote.html", "name": "Grid and Remote Data" },
					{ "page": "knockout/ko_wijinputdate.html", "name": "InputDate" },
					{ "page": "knockout/ko_wijinputmask.html", "name": "InputMask" },
					{ "page": "knockout/ko_wijinputnumber.html", "name": "InputNumber" },
                    { "page": "knockout/ko_wijinputtext.html", "name": "InputText" },
					{ "page": "knockout/ko_wijlineargauge.html", "name": "LinearGauge" },
					{ "page": "knockout/ko_wijlinechart.html", "name": "LineChart" },
					{ "page": "knockout/ko_wijlist.html", "name": "List" },
					{ "page": "knockout/ko_wijmaps.html", "name": "Maps" },
					{ "page": "knockout/ko_wijmenu.html", "name": "Menu" },
					{ "page": "knockout/ko_wijpiehart.html", "name": "PieChart" },
					{ "page": "knockout/ko_wijprogressbar.html", "name": "ProgressBar" },
					{ "page": "knockout/ko_wijradialgauge.html", "name": "RadialGauge" },
					{ "page": "knockout/ko_wijrating.html", "name": "Rating" },
					{ "page": "knockout/ko_wijribbon.html", "name": "Ribbon" },
					{ "page": "knockout/ko_wijscatterchart.html", "name": "ScatterChart" },
					{ "page": "knockout/ko_wijslider.html", "name": "Slider" },
					{ "page": "knockout/ko_wijsplitter.html", "name": "Splitter" },
					{ "page": "knockout/ko_wijsuperpanel.html", "name": "SuperPanel" },
					{ "page": "knockout/ko_wijtabs.html", "name": "Tabs" },
					{ "page": "knockout/ko_wijtooltip.html", "name": "Tooltip" },
					{ "page": "knockout/ko_wijtree.html", "name": "Tree" },
					{ "page": "knockout/ko_wijtreemap.html", "name": "TreeMap" },
					{ "page": "knockout/ko_wijvideo.html", "name": "Video" }]
    },
    "Accordion": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/accordion",
        "actions": [{ "name": "Overview", "page": "accordion/overview.html" },
					{ "name": "Animation", "page": "accordion/animation.html" },
					{ "name": "Expand direction", "page": "accordion/expandDirection.html" },
					{ "name": "Open on hover event", "page": "accordion/hover.html" },
					{ "name": "Multiple open panes", "page": "accordion/requireOpenedPane.html" }]
    },
    "BarChart": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/barchart",
        "actions": [
					// basics overview samples
					{ "name": "Overview", "page": "barchart/overview.html" },
					// dataSource samples

					{ "name": "Array as datasource", "page": "barchart/dataSource.html" },
					{ "name": "Shared array datasource", "page": "barchart/dataSourceSereisShared.html" },
					{ "name": "Multiple array datasource", "page": "barchart/dataSourcemultiplesource.html" },

					{ "name": "Table as datasource", "page": "barchart/tableasdatasource.html" },
					{ "name": "External datasource", "page": "barchart/ajaxData.html" },
					{ "name": "Dataview", "page": "barchart/dataView.html" },

                    /* === METADATA === */
                    // legend
                    // tooltip
                    // indicator

					/* === BEHAVIOR SAMPLES === */
					{ "name": "Simple bar chart", "page": "barchart/simple.html" },
					{ "name": "Column bar chart", "page": "barchart/columnbar.html" },
					{ "name": "Legend", "page": "barchart/clusters.html" },

					// visualization samples
					{ "name": "Stacked bar chart", "page": "barchart/stackedbar.html" },
					{ "name": "Stacked percentage bar chart", "page": "barchart/stackedpercentagebar.html" },
					{ "name": "Origin", "page": "barchart/origin.html" },
					{ "name": "Fixed label width", "page": "barchart/fixedLabelWidth.html" },

					// visuzalization - styling
					// series visualization
					{ "name": "Series colors", "page": "barchart/seriesColors.html" },
					{ "name": "Series form", "page": "barchart/seriesForm.html" },

					//animation samples
					{ "name": "Series transition", "page": "barchart/seriestransition.html" },

					// behaviour samples / user interactions
		            { "name": "Extreme values", "page": "barchart/minMax.html" },
                    // In BarChart Indicator is useless
					//{ "name": "Indicator Line", "page": "barchart/indicatorLine.html" }, // rename to 'column indicator line'
					//{ "name": "Bar Indicator Line", "page": "barchart/barIndicatorLine.html" }, // or unite these two samples
					{ "name": "Drill Down", "page": "barchart/drillDown.html" },
                    //trendline
                    { "name": "Trendline", "page": "barchart/trendline.html" },
                    { "name": "Export", "page": "barchart/export.html" }]
    },
    "BubbleChart": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/bubblechart",
        "actions": [
            { "name": "Overview", "page": "bubblechart/overview.html" },

            // DATA SOURCE
                { "name": "Simple datasource", "page": "bubblechart/simpleDataSource.html" },
                { "name": "Array datasource", "page": "bubblechart/simpleDataBind.html" },
                { "name": "Shared array datasource", "page": "bubblechart/sharedArrayDatasource.html" },
				{ "name": "Multiple array datasource", "page": "bubblechart/multipleDataSource.html" },
                { "name": "Table as dataSource", "page": "bubblechart/withtable.html" },
                { "name": "Dataview", "page": "bubblechart/dataview.html" },

                // LEGEND AND MARKERS
                { "name": "Legend", "page": "bubblechart/overlap.html" },
				{ "name": "ChartMarker", "page": "bubblechart/chartMarker.html" },
                { "name": "Symbols", "page": "bubblechart/symbols.html" },
                { "name": "Formatting colors", "page": "bubblechart/seriesStyles.html" },

                // LABELS
                { "name": "Label position", "page": "bubblechart/outsideLabel.html" },
				{ "name": "Invisible Label", "page": "bubblechart/invisibleLabel.html" },

                // TOOLTIP AND INDICATOR
                { "name": "Indicator Line", "page": "bubblechart/indicatorLine.html" },

                // BEHAVIOR
				{ "name": "Negative", "page": "bubblechart/negative.html" },
                { "name": "Bubble size", "page": "bubblechart/minMax.html" },
                // size

				// TRANSITIONS
				{ "name": "SeriesTransition", "page": "bubblechart/seriesTransition.html" },

                //Trendline
                { "name": "Trendline", "page": "bubblechart/trendline.html" },
                { "name": "Export", "page": "bubblechart/Export.html" }
        ]
    },
    "Calendar": {
        "isFavorite": true,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/calendar",
        "actions": [{ "name": "Overview", "page": "calendar/overview.html" },
					{ "name": "Animation", "page": "calendar/animation.html" },
					{ "name": "Custom dates", "page": "calendar/customdates.html" },
					{ "name": "Localization", "page": "calendar/glob.html" },
					{ "name": "Selection modes", "page": "calendar/selection.html" },
					{ "name": "Popup mode", "page": "calendar/popup.html" },
					{ "name": "Multiple months", "page": "calendar/multi-views.html" },
					{ "name": "Hide other month days", "page": "calendar/othermonth.html" },
					{ "name": "Month preview", "page": "calendar/preview.html" },
					{ "name": "Quick navigation", "page": "calendar/quicknav.html" },
					{ "name": "Custom selection", "page": "calendar/customselection.html" },
					{ "name": "Min/Max date range", "page": "calendar/range.html" }]
    },
    "CandlestickChart": {
    	"isFavorite": true,
    	"branch": "complete",
    	"documentation": "http://wijmo.com/wiki/index.php/candlestickchart",
    	"actions": [{ "name": "Overview", "page": "candlestickchart/overview.html" },
		   { "name": "High Low", "page": "candlestickchart/highlow.html" },
		   { "name": "OHLC", "page": "candlestickchart/ohlc.html" },
		   //{ "name": "Multiple Series", "page": "candlestickchart/multipleSeries.html" },
		   { "name": "Candlestick Formatter", "page": "candlestickchart/candlestickFormatter.html" },
		   { "name": "Composite Candlestick", "page": "candlestickchart/compositeCandlestick.html" },
		   { "name": "OHLC Color", "page": "candlestickchart/ohlccolor.html" },
		   { "name": "Data Source", "page": "candlestickchart/datasource.html" },
		   //{ "name": "Remote Data", "page": "candlestickchart/remoteData.html" },
		   //{ "name": "DateView", "page": "candlestickchart/dataview.html" },
		   { "name": "Indicator Line", "page": "candlestickchart/indicatorLine.html" },
		   { "name": "Value Labels", "page": "candlestickchart/valueLabels.html" },
    	 //Trendline
           { "name": "Trendline", "page": "candlestickchart/trendline.html" },
    	   { "name": "Export", "page": "candlestickchart/export.html" }]
    },
    "Carousel": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/carousel",
        "actions": [{ "name": "Overview", "page": "carousel/overview.html" },
				{ "name": "Animation", "page": "carousel/animation.html" },
				//{ "name": "Custom Control", "page": "carousel/customcontrol.html" },
				{ "name": "Content", "page": "carousel/content.html" },
				{ "name": "Ajax", "page": "carousel/ajax.html" },
				{ "name": "Event", "page": "carousel/event.html" },
				{ "name": "Flickr", "page": "carousel/flickr.html" },
				{ "name": "LightBox", "page": "carousel/lightbox.html" },
				{ "name": "Orientation", "page": "carousel/orientation.html" },
				{ "name": "Paging", "page": "carousel/paging.html" },
				{ "name": "Preview", "page": "carousel/preview.html" },
				{ "name": "Thumbnails", "page": "carousel/thumbnails.html" },
				{ "name": "Videos", "page": "carousel/videos.html" }]
    },
    "ComboBox": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/combobox",
        "actions": [{ "name": "Overview", "page": "combobox/overview.html" },
				{ "name": "Animation", "page": "combobox/animation.html" },
				{ "name": "Position", "page": "combobox/position.html" },
				{ "name": "Multiple Columns", "page": "combobox/multiplecolumns.html" },
				{ "name": "Select", "page": "combobox/select.html" },
				{ "name": "Dynamic Data", "page": "combobox/dynamicdata.html" },
				{ "name": "Data view", "page": "combobox/dataView.html" },
				{ "name": "Field Mapping", "page": "combobox/fieldMapping.html" },
				//{ "name": "Odata", "page": "combobox/odata.html" },
				{ "name": "Remote data", "page": "combobox/remotedata.html" }]
    },
    "CompositeChart": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/compositechart",
        "actions": [{ "name": "Overview", "page": "compositechart/overview.html" },
                { "name": "Simple Datasource", "page": "compositechart/simpleDataSource.html" },
                { "name": "Shared Array Datasource", "page": "compositechart/sharedArrayDataSource.html" },
                { "name": "Multiple Arrays Datasource", "page": "compositechart/dataSource.html" },
                { "name": "Timeline", "page": "compositechart/timeline.html" },
				{ "name": "Odd Timeline", "page": "compositechart/oddtimeline.html" },
                { "name": "Pie series", "page": "compositechart/pieSeries.html" },
				{ "name": "Donut Pie", "page": "compositechart/donutpie.html" },
				{ "name": "Regression Line", "page": "compositechart/scatterwithregressionline.html" },
				{ "name": "Multiple Axes", "page": "compositechart/multipleaxes.html" },
				{ "name": "Dataview Datasource", "page": "compositechart/dataview.html" },
				{ "name": "Indicator Line", "page": "compositechart/indicatorLine.html" },
                { "name": "Trendline", "page": "compositechart/trendline.html" },
				{ "name": "SharedPie", "page": "compositechart/sharedPies.html" },
                { "name": "Export", "page": "compositechart/export.html" }]
    },
    "Data": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/Data",
        "actions": [
			{ "name": "Overview", "page": "data/overview.html" },
			{ "name": "Local array", "page": "data/array-data-view.html" },
			{ "name": "Rest service", "page": "data/ajax-data-view.html" },
			{ "name": "Rest service with custom paging", "page": "data/ajax-custom-request.html" },
			{ "name": "OData service", "page": "data/odata-data-view.html" },
			{ "name": "OData service with knockout", "page": "data/odata-knockout.html" },
			{ "name": "BreezeJs data view", "page": "data/breeze-data-view.html" },
			{ "name": "BreezeJs without a data view", "page": "data/breeze-native.html" }]
    },
    //"DataSource": {
    //    "isFavorite": false,
    //    "branch": "complete",
    //    "documentation": "http://wijmo.com/wiki/index.php/datasource",
    //    "actions": [{ "name": "Overview", "page": "datasource/overview.html" }]
    //},
    "DatePager": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/datePager",
        "actions": [{ "name": "Overview", "page": "datepager/overview.html" }]
    },
    "Dialog": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/dialog",
        "actions": [{ "name": "Overview", "page": "dialog/overview.html" },
					{ "name": "Animation", "page": "dialog/animation.html" },
					{ "name": "External Content", "page": "dialog/contenturl.html" },
					{ "name": "Modal Dialog", "page": "dialog/modalDialog.html" },
					{ "name": "Alert Dialog", "page": "dialog/modalAlert.html" },
					{ "name": "Confirm Dialog", "page": "dialog/modalConfirmation.html" }]
    },
    "Editor": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/editor",
        "actions": [{ "name": "Overview", "page": "editor/overview.html" },
				{ "name": "Simple", "page": "editor/simple.html" },
				{ "name": "EditMode", "page": "editor/editMode.html" },
				{ "name": "Customize Simple", "page": "editor/customizesimple.html" },
				{ "name": "Customize", "page": "editor/customize.html" },
				//{ "name": "Customize Context Menu", "page": "editor/customContextMenu.html" },
				{ "name": "Compact", "page": "editor/compact.html" },
				//{ "name": "Selection Change", "page": "editor/selectionChange.html" },
				//{ "name": "SetText", "page": "editor/setText.html" },
				{ "name": "BBCode", "page": "editor/bbcode.html" }]
    },
    "EventsCalendar": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/events_Calendar",
        "actions": [{ "name": "Overview", "page": "eventscalendar/overview.html" },
				{ "name": "Custom data storage", "page": "eventscalendar/customDataStorage.html" },
				{ "name": "Data model", "page": "eventscalendar/dataModel.html" },
				{ "name": "Day view time interval", "page": "eventscalendar/customTimeInterval.html" },
				{ "name": "Events calendar localization", "page": "eventscalendar/localization.html" },
				{ "name": "Custom edit event", "page": "eventscalendar/customEditEvent.html" },
				//{ "name": "Data view", "page": "eventscalendar/dataview.html" },
				//{ "name": "Remote data view", "page": "eventscalendar/remoteDataview.html" },
				{ "name": "UI customization", "page": "eventscalendar/uicustomization.html" }]
    },
    "Expander": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/expander",
        "actions": [{ "name": "Overview", "page": "expander/overview.html" },
					{ "name": "Animation", "page": "expander/animation.html" },
					{ "name": "External content", "page": "expander/contenturl.html" },
					{ "name": "Expand direction", "page": "expander/expanddirection.html" }]
    },
    "Export": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/export",
        "actions": [
            { "name": "Simply Chart Export", "page": "export/simplyexportchart.html" },
            { "name": "Chart Export", "page": "export/exportchart.html" },
            { "name": "Grid Export", "page": "export/exportgrid.html" }
        ]
    },
    "FormDecorator": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/checkbox",
        "actions": [{ "name": "Overview", "page": "formdecorator/overview.html" }]
    },
	"FileExplorer":{
		"isFavorite":false,
		"branch":"complete",
		"documentation":"http://wijmo.com/wiki/index.php/fileexplorer",	
		"actions":[{"name": "Overview", "page": "fileexplorer/overview.html" },
			{"name": "Events", "page": "fileexplorer/events.html" },
			{"name": "Filter", "page": "fileexplorer/filter.html" },
			{"name": "Functions", "page": "fileexplorer/functions.html" },
			{"name": "Keyboard Supports", "page": "fileexplorer/keyboardSupports.html" },
			{"name": "Path Settings", "page": "fileexplorer/pathSettings.html" },
			{"name": "Paging", "page": "fileexplorer/paging.html" },
			{"name": "View Mode", "page": "fileexplorer/viewMode.html" },
			{"name": "Visible Controls", "page": "fileexplorer/visibleControls.html" },
			{"name": "Upload File", "page": "fileexplorer/uploadFile.html" }
		]
	},
    "FlipCard": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/flipcard",
        "actions": [{ "name": "Overview", "page": "flipcard/overview.html" },
            { "name": "Animation Options", "page": "flipcard/animationOptions.html" },
            { "name": "Card Content Change", "page": "flipcard/flipContentChange.html" },
            { "name": "Customize animation", "page": "flipcard/customizeAnimation.html" },
            { "name": "Customize style", "page": "flipcard/styleSetting.html" }
        ]
    },
    "Gallery": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/gallery",
        "actions": [{ "name": "Overview", "page": "gallery/overview.html" },
				{ "name": "Orientation", "page": "gallery/orientation.html" },
				{ "name": "Animation", "page": "gallery/animation.html" },
				{ "name": "Flash", "page": "gallery/flash.html" },
				{ "name": "Iframe", "page": "gallery/iframe.html" },
				{ "name": "Paging", "page": "gallery/paging.html" },
				{ "name": "Video", "page": "gallery/video.html" },
				{ "name": "Ajax", "page": "gallery/ajax.html" }]
    },
    "Grid": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/grid",
        "actions": [{ "name": "Overview", "page": "grid/overview.html" },
				{ "name": "Filtering", "page": "grid/filtering.html" },
				{ "name": "Data Types", "page": "grid/datatypes.html" },
				{ "name": "Column Resizing", "page": "grid/column-resizing.html" },
				{ "name": "Column Moving", "page": "grid/column-moving.html" },
				{ "name": "Column Visibility", "page": "grid/column-visibility.html" },
				{ "name": "Paging", "page": "grid/paging.html" },
				{ "name": "Selection", "page": "grid/selection.html" },
				{ "name": "Grouping and Aggregates", "page": "grid/grouping-and-aggregates.html" },
				{ "name": "Group Area", "page": "grid/group-area.html" },
				{ "name": "Totals", "page": "grid/totals.html" },
				{ "name": "Editing", "page": "grid/editing.html" },
				{ "name": "Row Editing", "page": "grid/editing-row.html" },
				{ "name": "Custom Editors", "page": "grid/custom-editors.html" },
				{ "name": "Custom Paging", "page": "grid/custom-paging.html" },
				{ "name": "Scrolling", "page": "grid/scrolling.html" },
				{ "name": "Cell and Row Formatting", "page": "grid/cell-row-formatting.html" },
				{ "name": "Header Icons", "page": "grid/header-icons.html" },
				{ "name": "Persist State", "page": "grid/persist-state.html" },
				{ "name": "Sorting", "page": "grid/sorting.html" },
				{ "name": "Bands", "page": "grid/bands.html" },
				{ "name": "Command Columns", "page": "grid/command-columns.html" },
				{ "name": "Remote Data Using OData API", "page": "grid/remote-dataview-odata.html" },
				{ "name": "Remote custom paging", "page": "grid/remote-dataview-custompaging.html" },
				{ "name": "Virtual Scrolling", "page": "grid/virtual-scrolling.html" },
                { "name": "Export", "page": "grid/export.html" }]
    },
    "InputDate": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/inputDate",
        "actions": [{ "name": "Overview", "page": "inputdate/overview.html" },
				{ "name": "Date Picker", "page": "inputdate/datepicker.html" },
            { "name": "Time Picker", "page": "inputdate/timepicker.html" },
            { "name": "Drop Down List", "page": "inputdate/dropdown.html" },
            { "name": "Placeholder", "page": "inputdate/nulltext.html" },
            { "name": "Display Format", "page": "inputdate/displayformat.html" },
            { "name": "Spinner Align", "page": "inputdate/spinneralign.html" },
            { "name": "Blur On Left Right Key", "page": "inputdate/bluronleftrightkey.html" },
            { "name": "Blur On Last Char", "page": "inputdate/bluronlastchar.html" },
            { "name": "Custom Era", "page": "inputdate/customera.html" }]
    },
    "InputMask": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/inputMask",
        "actions": [{ "name": "Overview", "page": "inputmask/overview.html" },
				{ "name": "First name", "page": "inputmask/firstname.html" },
				{ "name": "Password", "page": "inputmask/password.html" },
				{ "name": "Drop Down", "page": "inputmask/dropdown.html" },
            { "name": "SSN", "page": "inputmask/ssn.html" },
            { "name": "DBCS", "page": "inputmask/dbcs.html" },
            { "name": "Hiragana", "page": "inputmask/hiragana.html" },
            { "name": "Blur On Left Right Key", "page": "inputmask/bluronleftrightkey.html" },
            { "name": "Blur On Last Char", "page": "inputmask/bluronlastchar.html" }]
    },
    "InputNumber": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/inputNumber",
        "actions": [{ "name": "Overview", "page": "inputnumber/overview.html" },
            { "name": "Currency", "page": "inputnumber/currency.html" },
            { "name": "Percent", "page": "inputnumber/percent.html" },
            { "name": "Drop Down", "page": "inputnumber/dropdown.html" },
            { "name": "Custom increment", "page": "inputnumber/increment.html" },
            { "name": "Negative class", "page": "inputnumber/negativeclass.html" }]
    },
    "InputText":
    {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/inputText",
        "actions": [
            { "name": "Overview", "page": "inputtext/overview.html" },
            { "name": "Format", "page": "inputtext/format.html" },
            { "name": "Drop Down", "page": "inputtext/dropdown.html" },
            { "name": "Max Length", "page": "inputtext/maxlength.html" },
            { "name": "MultiLine", "page": "inputtext/multiline.html" },
            { "name": "Reading Ime String", "page": "inputtext/readingstring.html" }]
    },
    "LightBox": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/lightBox",
        "actions": [{ "name": "Overview", "page": "lightbox/overview.html" },
				{ "name": "Auto Play", "page": "lightbox/autoplay.html" },
				{ "name": "Auto Size", "page": "lightbox/autosize.html" },
				{ "name": "Flash", "page": "lightbox/flash.html" },
				{ "name": "Flash Video", "page": "lightbox/flashvideo.html" },
				{ "name": "Full Size", "page": "lightbox/fullSize.html" },
				{ "name": "IFrame", "page": "lightbox/iframe-content.html" },
				{ "name": "Keyboard Navigation", "page": "lightbox/keynav.html" },
				{ "name": "Inline content", "page": "lightbox/inline-content.html" },
				{ "name": "Play Pause", "page": "lightbox/playpause.html" },
				{ "name": "QuickTime", "page": "lightbox/quicktime.html" },
				{ "name": "Sequence Counter", "page": "lightbox/seqcounter.html" },
				{ "name": "Text Position", "page": "lightbox/textposition.html" },
				{ "name": "Transition", "page": "lightbox/transition.html" },
				{ "name": "Vimeo", "page": "lightbox/vimeo.html" },
				{ "name": "Windows Media Player", "page": "lightbox/windowsmediaplayer.html" },
				{ "name": "YouTube", "page": "lightbox/youtube.html" }]
    },
    "LinearGauge": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/linearGauge",
        "actions": [{ "name": "Overview", "page": "lineargauge/overview.html" },
				{ "name": "Customize Labels", "page": "lineargauge/customLabels.html" },
				{ "name": "Interactive", "page": "lineargauge/interactive.html" },
				{ "name": "Level", "page": "lineargauge/level.html" },
				{ "name": "Logarithmic", "page": "lineargauge/logarithmic.html" },
				{ "name": "Orientation", "page": "lineargauge/orientation.html" },
				{ "name": "Temperature", "page": "lineargauge/temperature.html" },
				{ "name": "Volume Control", "page": "lineargauge/volume.html" }]
    },
    "LineChart": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/linechart",
        "actions": [
				// basics
				{ "name": "Overview", "page": "linechart/overview.html" },

                // dataSource samples
				// { "name": "Array Datasource", "page": "linechart/dataSource.html" },
                { "name": "Simple line chart", "page": "linechart/simple.html" },
                { "name": "Array DataSource", "page": "linechart/simpleDataSource.html" },
                { "name": "Shared array datasource", "page": "linechart/sharedDataSource.html" },
				{ "name": "Multiple arrays datasource", "page": "linechart/multipleArrayDataSource.html" },

				{ "name": "Table as dataSource", "page": "linechart/withtable.html" },
				{ "name": "Ajax Data", "page": "linechart/ajaxData.html" },
				{ "name": "Streaming data", "page": "linechart/simulateData.html" },
				{ "name": "Dataview", "page": "linechart/dataview.html" },
				
				// labels as wijmo word
				{ "name": "Legend", "page": "linechart/seriesList.html" },
				{ "name": "Tooltip and Indicator", "page": "linechart/indicatorLine.html" },

				// visualizations samples
				{ "name": "Area Chart", "page": "linechart/trends.html" },
				// { "name": "Area Chart", "page": "linechart/areachart.html" },
				{ "name": "Area Spline Chart", "page": "linechart/areaSpline.html" },
				// label styles
				// hint styles
				{ "name": "Stroke styles", "page": "linechart/seriesStyles.html" },
				{ "name": "Markers and Symbols", "page": "linechart/markers.html" },
				{ "name": "Extreme values", "page": "linechart/minMax.html" },
				{ "name": "Ticks and Origin", "page": "linechart/ticksAndOrigin.html" }, // add alignment to the sample
				{ "name": "Grid", "page": "linechart/grid.html" }, // add demo options

				// animation samples
				{ "name": "Animation", "page": "linechart/animation.html" },

				// behavior samples
				{ "name": "Draggable Marker", "page": "linechart/draggableMarker.html" },
				{ "name": "DateTime", "page": "linechart/datetime.html" },
                //Trendline
                { "name": "Trendline", "page": "linechart/trendline.html" },
				// { "name": "Trends", "page": "linechart/trends.html" },
                { "name": "Export", "page": "linechart/export.html" }

       ]

    },
    "List": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/list",
        "actions": [{ "name": "Overview", "page": "list/overview.html" },
					{ "name": "Data view", "page": "list/dataView.html" },
					{ "name": "Field mapping", "page": "list/fieldMapping.html" },
					{ "name": "Multiple Selection", "page": "list/multipleselection.html" }]
    },
	"Maps": {
		"isFavorite": false,
		"branch": "complete",
		"documentation": "http://wimoo.com/wiki/index.php/maps",
		"actions": [{ "name": "Overview", "page": "maps/overview.html" },
			{ "name": "Map Source", "page": "maps/mapSource.html" },
			{ "name": "Vector Layer", "page": "maps/vectorLayer.html" },
			{ "name": "Vector Layer( GeoJson)", "page": "maps/vectorLayerGeoJson.html" },
			{ "name": "Factories", "page": "maps/factories.html" },
			{ "name": "Flight Routes", "page": "maps/flightRoutes.html" },
			{ "name": "Grid", "page": "maps/grid.html" },
			{ "name": "Marks", "page": "maps/marks.html" },
			{ "name": "Cities", "page": "maps/cities.html" }]
	},
    "Menu": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/menu",
        "actions": [{ "name": "Overview", "page": "menu/overview.html" },
					{ "name": "Orientation", "page": "menu/orientation.html" },
					{ "name": "Icon", "page": "menu/icon.html" },
					{ "name": "Functions", "page": "menu/menufunctions.html" },
					{ "name": "Menu item triggers", "page": "menu/menuitemtrigger.html" },
					{ "name": "Positioning context menu", "page": "menu/position.html" },
					{ "name": "Shortcuts", "page": "menu/shortcut.html" },
					{ "name": "Templates", "page": "menu/template.html" },
					{ "name": "Displaying Context menus", "page": "menu/triggerEvent.html" }]
    },
    "Pager": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/pager",
        "actions": [{ "name": "Overview", "page": "pager/overview.html" },
				{ "name": "Paging Modes", "page": "pager/modes.html" },
				{ "name": "Paged Table", "page": "pager/paged-table.html" }]
    },
    "PieChart": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/piechart",
        "actions": [
                { "name": "Overview", "page": "piechart/overview.html" },

                /* === DATASOURCE SAMPLES */
				{ "name": "Simple dataSource", "page": "piechart/seriesList.html" },
				{ "name": "Array as dataSource", "page": "piechart/datasource.html" },
				{ "name": "Table as dataSource", "page": "piechart/tableasdatasource.html" },
				{ "name": "DataView as dataSource", "page": "piechart/dataview.html" },

				/* === METADATA SAMPLES */
				{ "name": "Chart Labels", "page": "piechart/chartlabels.html" },
				{ "name": "Tooltip", "page": "piechart/tooltip.html" },
				// { "name": "Indicator", "page": "piechart/indicator.html" }, // indicator in piechart
				{ "name": "Legend", "page": "piechart/legend.html" },


				/* === VISUALIZATION SAMPLES */
				{ "name": "Chart size", "page": "piechart/size.html" },
				{ "name": "Chart radius", "page": "piechart/radius.html" },
				{ "name": "Donut chart", "page": "piechart/donut.html" },
				{ "name": "Start angle", "page": "piechart/startAngle.html" },
				{ "name": "Colors Formatting", "page": "piechart/seriesStyles.html" },
				// offset

				{ "name": "Animation", "page": "piechart/animation.html" },
				{ "name": "Series transition", "page": "piechart/seriestransition.html" },
                { "name": "Export", "page": "piechart/export.html" }
        ]
    },
    "PopUp": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/popup",
        "actions": [{ "name": "Overview", "page": "popup/overview.html" },
					{ "name": "Animation", "page": "popup/animation.html" }]
    },
    "ProgressBar": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/progressbar",
        "actions": [{ "name": "Overview", "page": "progressbar/overview.html" },
					{ "name": "Direction", "page": "progressbar/direction.html" }]
    },
    "RadialGauge": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/radialGauge",
        "actions": [{ "name": "Overview", "page": "radialgauge/overview.html" },
				{ "name": "Half Circle", "page": "radialgauge/halfcircle.html" },
				{ "name": "Logarithmic", "page": "radialgauge/logarithmic.html" },
				{ "name": "Margin", "page": "radialgauge/margin.html" },
				{ "name": "Position", "page": "radialgauge/position.html" },
				{ "name": "RPM", "page": "radialgauge/RPM.html" },
				{ "name": "Speedometer", "page": "radialgauge/speedometer.html" },
				{ "name": "Template", "page": "radialgauge/templated.html" }]
    },
    "Rating": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/rating",
        "actions": [{ "name": "Overview", "page": "rating/overview.html" },
					{ "name": "Animation", "page": "rating/animation.html" },
					{ "name": "Options", "page": "rating/options.html" },
					{ "name": "Events", "page": "rating/events.html" },
					{ "name": "Custom Icons", "page": "rating/customizedicon.html" }]
    },
    "Ribbon": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/ribbon",
        "actions": [{ "name": "Overview", "page": "ribbon/overview.html" },
            { "name": "Compact Mode", "page": "ribbon/compactribbon.html" },
				{ "name": "Simple", "page": "ribbon/simple.html" },
				{ "name": "Customize Ribbon By Data", "page": "ribbon/customizeribbonbydata.html" },
				{ "name": "Customize Simple Ribbon By Data", "page": "ribbon/customizesimpleribbonbydata.html" }
        ]
    },
    "ScatterChart": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/scatterchart",
        "actions": [{ "name": "Overview", "page": "scatterchart/overview.html" },
				{ "name": "Array datasource", "page": "scatterchart/datasource.html" },
                { "name": "Shared array datasource", "page": "scatterchart/sharedArrayDataSource.html" },
                { "name": "Dataview", "page": "scatterchart/dataview.html" },
				{ "name": "Tooltip and Indicator Line", "page": "scatterchart/indicatorLine.html" },

                { "name": "Origin", "page": "scatterchart/origin.html" },
                //trendline
                { "name": "Trendline", "page": "scatterchart/trendline.html" },
                { "name": "Export", "page": "scatterchart/export.html" }
        ]
    },
    "Slider": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/slider",
        "actions": [{ "name": "Overview", "page": "slider/overview.html" },
					{ "name": "Thumbs", "page": "slider/thumbs.html" },
					{ "name": "Min range", "page": "slider/minrange.html" },
					{ "name": "Range", "page": "slider/range.html" },
					{ "name": "Dragfill", "page": "slider/dragfill.html" }]
    },
    "Sparkline": {
    	"isFavorite": false,
    	"branch": "complete",
    	"documentation": "http://wijmo.com/wiki/index.php/sparkline",
    	"actions": [{ "name": "Overview", "page": "sparkline/overview.html" },
    			{ "name": "Sparklines in Grid", "page": "sparkline/showInGrid.html" },
    			{ "name": "Stock Market Data", "page": "sparkline/stockMarket.html" },
				{ "name": "Inline Data", "page": "sparkline/inlineSparkline.html" },
				{ "name": "Negative Values", "page": "sparkline/negativePositiveValues.html" },
				{ "name": "Composite Sparkline", "page": "sparkline/compositeSparkline.html" },
				{ "name": "Object Array Data", "page": "sparkline/objectArrayData.html" },
    			{ "name": "Customize Tooltip Content", "page": "sparkline/customizeTooltipContent.html" }]
    },
    "Splitter": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/splitter",
        "actions": [{ "name": "Overview", "page": "splitter/overview.html" },
					{ "name": "FullSplit", "page": "splitter/fullSplit.html" },
					{ "name": "Nested", "page": "splitter/nested.html" }]
    },
    "SuperPanel": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/superpanel",
        "actions": [{ "name": "Overview", "page": "superpanel/overview.html" },
					{ "name": "Client API", "page": "superpanel/clientsideapi.html" },
					{ "name": "Scroll Mode", "page": "superpanel/scrollmode.html" }]
    },

    "Tabs": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/tabs",
        "actions": [{ "name": "Overview", "page": "tabs/overview.html" },
					{ "name": "Alignment", "page": "tabs/alignment.html" },
					{ "name": "Scrollable", "page": "tabs/scrollable.html" },
					{ "name": "Open on hover", "page": "tabs/hover.html" },
					{ "name": "Animations", "page": "tabs/animation.html" },
					{ "name": "Collapsible content", "page": "tabs/collapsible.html" },
					{ "name": "Add/Remove", "page": "tabs/addremove.html" }]
    },
    "Tooltip": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/tooltip",
        "actions": [{ "name": "Overview", "page": "tooltip/overview.html" },
					{ "name": "Callout Animation", "page": "tooltip/calloutanimation.html" },
					{ "name": "Callout Fill", "page": "tooltip/calloutfilled.html" },
					{ "name": "Close Behavior", "page": "tooltip/closebehavior.html" },
					{ "name": "Modal", "page": "tooltip/modal.html" },
					{ "name": "Position", "page": "tooltip/position.html" },
					{ "name": "Trigger", "page": "tooltip/trigger.html" },
					{ "name": "Ajax", "page": "tooltip/ajax.html" }]
    },
    "Tree": {
        "isFavorite": true,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/tree",
        "actions": [{ "name": "Overview", "page": "tree/overview.html" },
				{ "name": "Ajax", "page": "tree/ajaxLoaded.html" },
				{ "name": "Animation", "page": "tree/animation.html" },
				{ "name": "AutoCollapse", "page": "tree/autocollapse.html" },
				{ "name": "Expand On Hover", "page": "tree/expandonhover.html" },
				{ "name": "CheckBox", "page": "tree/checkbox.html" },
				{ "name": "Custom drag drop", "page": "tree/customdragdrop.html" },
				{ "name": "Drag & Drop", "page": "tree/dragdrop.html" },
				{ "name": "Node Icons", "page": "tree/icons.html" },
				{ "name": "Data", "page": "tree/data.html" },
				{ "name": "Object Model", "page": "tree/objectmodel.html" }]
    },
	"TreeMap": {
		"isFavorite": false,
		"branch": "complete",
		"documentation": "http://wijmo.com/wiki/index.php/treemap",
		"actions": [{ "name": "Overview", "page": "treemap/overview.html" },
				{ "name": "Data", "page": "treemap/data.html" }]
	},
    "Upload": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/uploader",
        "actions": [{ "name": "Overview", "page": "upload/overview.html" },
					{ "name": "File input", "page": "upload/fileinput.html" }]
    },

    "Video": {
        "isFavorite": false,
        "branch": "open",
        "documentation": "http://wijmo.com/wiki/index.php/video_Player",
        "actions": [{ "name": "Overview", "page": "video/overview.html" },
					 { "name": "Show Controls On Hover", "page": "video/hover.html" }]
    },

    "Wizard": {
        "isFavorite": false,
        "branch": "complete",
        "documentation": "http://wijmo.com/wiki/index.php/wizard",
        "actions": [{ "name": "Overview", "page": "wizard/overview.html" },
				{ "name": "Animation", "page": "wizard/animation.html" },
				{ "name": "Auto Play", "page": "wizard/autoplay.html" },
				{ "name": "No Headers", "page": "wizard/simple.html" },
				{ "name": "Ajax", "page": "wizard/ajax.html" },
				{ "name": "Pager Buttons", "page": "wizard/pager.html" }]

    }
};