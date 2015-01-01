var collapseAccordion = function (ele, idx) {
	var panel = ele.children("h3").eq(idx);
	if (panel.length &&
				panel.hasClass("ui-state-active")) {
		ele.wijaccordion("activate", idx);
	}
};

var captionBtnOption = {
	pin: { visible: false },
	refresh: { visible: false },
	toggle: { visible: false },
	minimize: { visible: false },
	maximize: { visible: false }
};

var expandAccordion = function (ele, idx) {
	var panel = ele.children("h3").eq(idx);
	if (panel.length &&
				!panel.hasClass("ui-state-active")) {
		ele.wijaccordion("activate", idx);
	}
};

var getChangedValue = function (oldValue, defaultValue) {
	var newValue = {};
	if ($.isPlainObject(oldValue)) {
		$.each(oldValue, function (key, value) {
			var def = defaultValue[key], arrChanged = false, val;
			if ($.isPlainObject(value)) {
				if (def) {
					val = getChangedValue(value, def);
					if (!$.isEmptyObject(value) &&
								$.isEmptyObject(def)) {
						newValue[key] = val;
					}
					else if (!$.isEmptyObject(val)) {
						newValue[key] = val;
					}
				}
				else {
					newValue[key] = value;
				}
			}
			else if ($.isArray(value)) {
				if (def && value.length === def.length) {
					$.each(value, function (i, n) {
						var item;
						if (def[i]) {
							if ($.isPlainObject(def[i]) &&
										$.isPlainObject(n)) {
								item = getChangedValue(n, def[i]);
								if (!$.isEmptyObject(item)) {
									arrChanged = true;
								}
							}
							else if (n !== def[i]) {
								arrChanged = true;
							}
						}
						else {
							arrChanged = true;
						}
					});
					if (arrChanged) {
						newValue[key] = value;
					}
				}
				else {
					newValue[key] = value;
				}
			}
			else if (def != value) {
				newValue[key] = value;
			}
		});
	}
	return newValue;
};


var getChart = function (t) {
	var type = {};
	switch (t) {
		case "Line":
			type.chart = "wijlinechart";
			type.subtype = "line"; //change options object after seriesStyle created
			break;
		case "Spline":
			type.chart = "wijlinechart";
			type.subtype = "spline";
			break;
		case "Stacked Column":
			type.chart = "wijbarchart";
			type.subtype = { stacked: true, horizontal: false };
			break;
		case "Stacked Bar":
			type.chart = "wijbarchart";
			type.subtype = { stacked: true, horizontal: true };
			break;
		case "Column":
			type.chart = "wijbarchart";
			type.subtype = { stacked: false, horizontal: false };
			break;
		case "Bar":
			type.chart = "wijbarchart";
			type.subtype = { stacked: false, horizontal: true };
			break;
		case "Pie":
			type.chart = "wijpiechart";
			type.subtype = { innerRadius: 0 };
			break;
		case "Donut":
			type.chart = "wijpiechart";
			type.subtype = { innerRadius: 40 };
			break;
		default:
			type.chart = "wijlinechart";
			type.subtype = "line";
			break;
	}
	return type;
};

var paintPreview = function ($preview, $code, chartType, options) {
	paintChart($preview, chartType, options);
	setCode($code, chartType, options);
}

var paintChart = function ($preview, chartType, options) {
	if ($preview.data(chartType)) {

		$preview[chartType]("beginUpdate");
		$preview[chartType](options);
		$preview[chartType]("endUpdate");
		return;
	}
	else {
		if ($preview.data("wijlinechart"))
			$preview.wijlinechart("destroy");
		if ($preview.data("wijbarchart"))
			$preview.wijbarchart("destroy");
		if ($preview.data("wijpiechart"))
			$preview.wijpiechart("destroy");

		$preview[chartType](options);
	}
}

var setCode = function ($code, chartType, options) {
	$code.text('$("#preview").' +
				chartType + '(' +
				JSON.stringify(getChangedValue(options, defaultValue[chartType]), function (key, value) {
					if (typeof value === 'function') {
						return String(value);
					}
					return value;
				}).replace(/\\u000a/g, "") +
			')');
}

var defaultValue =
		{
			wijlinechart: {
				header: {
					text: "Hardware Distribution"
				},
				seriesList: [{
					label: "West",
					legendEntry: true,
					data: { x: ['Desktops', 'Notebooks', 'AIO', 'Tablets', 'Phones'], y: [5, 3, 4, 7, 2] }
				}]
			},
			wijbarchart: {
				header: {
					text: "Hardware Distribution"
				},
				seriesList: [{
					label: "West",
					legendEntry: true,
					data: { x: ['Desktops', 'Notebooks', 'AIO', 'Tablets', 'Phones'], y: [5, 3, 4, 7, 2] }
				}, {
					label: "Central",
					legendEntry: true,
					data: { x: ['Desktops', 'Notebooks', 'AIO', 'Tablets', 'Phones'], y: [2, 2, 3, 2, 1] }
				}, {
					label: "East",
					legendEntry: true,
					data: { x: ['Desktops', 'Notebooks', 'AIO', 'Tablets', 'Phones'], y: [3, 4, 4, 2, 5] }
				}]
			},
			wijpiechart: {
				header: {
					text: "Steam - Mac Hardware"
				},
				seriesList: [{
					label: "MacBook Pro",
					legendEntry: true,
					data: 46.78,
					offset: 15
				}, {
					label: "iMac",
					legendEntry: true,
					data: 23.18,
					offset: 0
				}, {
					label: "MacBook",
					legendEntry: true,
					data: 20.25,
					offset: 0
				}, {
					label: "Mac Pro",
					legendEntry: true,
					data: 5.41,
					offset: 0
				}, {
					label: "Mac mini",
					legendEntry: true,
					data: 3.44,
					offset: 0
				}]
			}
		};


var defaultHint = {
	wijlinechart: {
		hint: {
			content: function () {
				return this.data.lineSeries.label + '\n' +
						this.x + '\n' + this.y + '';
			},
			contentStyle: {
				"font-size": "10pt"
			},
			offsetY: -10
		}
	},
	wijpiechart: {
		hint: {
			content: function () {
				return this.data.label + " : " + $.format(this.value / this.total, "p2");
			}
		}
	},
	wijbarchart: {
		hint: {
			content: function () {
				return this.data.label + '<br/> ' + this.y + '';
			}
		}
	}
};

//data item
var baseSeriesStyles = [{
	stroke: "#77b3af",
	opacity: 0.9,
	"stroke-width": 1
}, {
	stroke: "#67908e",
	opacity: 0.9,
	"stroke-width": 1
}, {
	stroke: "#465d6e",
	opacity: 0.9,
	"stroke-width": 1
}, {
	stroke: "#5d3f51",
	opacity: 0.9,
	"stroke-width": 1
}, {
	stroke: "#682e32",
	opacity: 0.9,
	"stroke-width": 1
}, {
	stroke: "#8c5151",
	opacity: 0.9,
	"stroke-width": 1
}, {
	stroke: "#ce9262",
	opacity: 0.9,
	"stroke-width": 1
}, {
	stroke: "#ceb664",
	opacity: 0.9,
	"stroke-width": 1
}, {
	stroke: "#7fb34f",
	opacity: 0.9,
	"stroke-width": 1
}, {
	stroke: "#2a7b5f",
	opacity: 0.9,
	"stroke-width": 1
}, {
	stroke: "#6079cb",
	opacity: 0.9,
	"stroke-width": 1
}, {
	stroke: "#60a0cb",
	opacity: 0.9,
	"stroke-width": 1
}];

var defFill = [
					"0-#8ac4c0-#77b3af",
					"0-#73a19e-#67908e",
					"0-#4f687b-#465d6e",
					"0-#69475b-#5d3f51",
					"0-#7a3b3f-#682e32",
					"0-#9d5b5b-#8c5151",
					"0-#e5a36d-#ce9262",
					"0-#e6cc70-#ceb664",
					"0-#8ec858-#7fb34f",
					"0-#3a9073-#2a7b5f",
					"0-#6c88e3-#6079cb",
					"0-#6cb4e3-#60a0cb"
				];

var defaultLineSeriesStyles = baseSeriesStyles
var defaultPieSeriesStyles = [];
$.each(baseSeriesStyles, function (i, n) {
	var obj = $.extend({}, n);
	if (!obj.fill) {
		obj.fill = defFill[i];
	}
	defaultPieSeriesStyles.push(obj);
})

var seriesStyles = {
	wijbarchart: defaultPieSeriesStyles,
	wijlinechart: defaultLineSeriesStyles,
	wijpiechart: defaultPieSeriesStyles
};

// parse Html table
var parseHTMLTable = {
	wijlineAndBarchart: {
		parseTable: function (table, o) {
			if (!table.is("table")) {
				return;
			}
			var self = this,
					ele = table,
			//header & footer
					captions = $("caption", ele),
					theaders = $("thead th", ele),
					seriesList = [],
					sList = $("tbody tr", ele);

			if (captions.length) {
				o.header = $.extend({
					visible: true,
					text: $.trim($(captions[0]).text())
				}, o.header);
				if (captions.length > 1) {
					o.footer = $.extend({
						visibel: true,
						text: $.trim($(captions[1]).text())
					}, o.footer);
				}
			}
			//legend
			o.legend = $.extend({
				visible: true
			}, o.legend);

			self.getSeriesFromTR(theaders, sList, seriesList);

			o.seriesList = seriesList;
		},
		getSeriesFromTR: function (theaders, sList, seriesList) {
			var valuesX = [],
				val = null,
				th = null,
				label = null,
				valuesY = null,
				tds = null,
				td = null,
				series = null;
			//seriesList
			if (theaders.length) {
				theaders.each(function () {
					val = $.trim($(this).text());
					valuesX.push(val);
				});
			}
			if (sList.length) {
				sList.each(function () {
					th = $("th", $(this));
					label = $.trim(th.text());
					valuesY = [];
					tds = $("td", $(this));
					if (tds.length) {
						tds.each(function () {
							td = $(this);
							valuesY.push(parseFloat($.trim(td.text())));
						});
					}
					series = {
						label: label,
						legendEntry: true,
						data: {
							x: valuesX,
							y: valuesY
						}
					};
					seriesList.push(series);
				});
			}
		}
	},
	wijpiechart: {
		parseTable: function (table, o) {
			if (!table.is("table")) {
				return;
			}
			var self = this,
					ele = table,
			//header & footer
					captions = $("caption", ele),
					theaders = $("thead th", ele),
					seriesList = [],
					sList = $("tbody tr", ele);

			if (captions.length) {
				o.header = $.extend({
					visible: true,
					text: $.trim($(captions[0]).text())
				}, o.header);
				if (captions.length > 1) {
					o.footer = $.extend({
						visibel: true,
						text: $.trim($(captions[1]).text())
					}, o.footer);
				}
			}
			//legend
			o.legend = $.extend({
				visible: true
			}, o.legend);

			self.getSeriesFromTR(theaders, sList, seriesList);

			o.seriesList = seriesList;
		},
		getSeriesFromTR: function (theaders, sList, seriesList) {
			var label = null, th = null, tds = null,
				data = null, series = null;
			if (sList.length) {
				sList.each(function () {
					th = $("th", $(this));
					label = $.trim(th.text());
					tds = $("td", $(this));
					if (tds.length) {
						data = parseFloat($.trim($(tds[0]).text()));
					}
					series = {
						label: label,
						legendEntry: true,
						data: data
					};
					seriesList.push(series);
				});
			}
		}
	}
};

// parse xml data

var parseXMLData = {
	parseData: function (data, o, type) {
		//var doc = $(data),
		var doc = $($.parseXML(data)).children(),
			self = this;

		o.seriesList = [];
		doc.children().each(function (i, n) {
			self.parseSeries(n, o, type);
		});
	},
	parseSeries: function (n, o, type) {
		var series;

		if (type === "wijpiechart") {
			$.each(n.children, function (j, node) {
				var dataNode = $(node);
				series = {
					label: dataNode.get(0).tagName,
					data: parseFloat(dataNode.text()),
					legendEntry: true
				}
				o.seriesList.push(series);
			});
		}
		else {
			series = {};
			series.label = $(n).find("label").text();
			series.legendEntry = true;
			series.data = {
				x: [], y: []
			};
			$.each($(n).find("x").children(), function (i, n) {
				var value = $(n).text();
				value = parseFloat(value);
				if (isNaN(value)) {
					value = $(n).text();
				}
				series.data.x.push(value);
			});
			$.each($(n).find("y").children(), function (i, n) {
				var value = $(n).text();
				value = parseFloat(value);
				if (isNaN(value)) {
					value = $(n).text();
				}
				series.data.y.push(value);
			});
			o.seriesList.push(series);
		}

	}
};

var parseCsv = {
	parseData: function (data, o, type) {
		var list = data.split("\n"),
			self = this;

		self.datax = [];
		o.seriesList = [];
		$.each(list, function (i, row) {
			self.parseSeries(i, row, o, type);
		})
	},

	parseSeries: function (index, row, o, type) {
		var items = row.split(","),
			self = this,
			series = {};

		items = $.map(items, function (n) {
			if (n === "") {
				return null;
			}
			return n.replace(/\"/g, "");
		});

		if (type === "wijpiechart") {
			if (items.length > 1) {
				series.label = items[0];
				series.legendEntry = true;
				series.data = parseFloat(items[1]);
				if (isNaN(series.data)) {
					series.data = items[1];
				}
				o.seriesList.push(series);
			}
		}
		else {
			series.data = {};
			series.data.y = [];
			if (index === 0) {
				$.each(items, function (i, n) {
					if (n === "") {
						return true;
					}
					self.datax.push(n);
				});
			}
			else {
				$.each(items, function (i, n) {
					if (i === 0) {
						series.label = n;
					}
					else {
						var val = parseFloat(n);
						if (isNaN(val)) {
							val = n;
						}
						series.data.y.push(val);
					}
				});
				series.data.x = self.datax;
				series.legendEntry = true;
				o.seriesList.push(series);
			}

		}
	}
};

$(document).ready(function () {
	/* accordion*/
	var accordion = $("#accordion")
			.wijaccordion({
				header: "h3",
				requireOpenedPane: false,
				selectedIndex: 3
			}), options = {}, txtWidth = $("#txtWidth"),
			txtHeight = $("#txtHeight"), i,
			length = accordion.children("h3").length,
			chartPanel = $(".finished .preview:eq(0)"),
			chartLinks = accordion.find(".chartSelector a"),
			chartName, $preview = $("#preview"), $code = $("#code"),
			chartType;

	for (i = 0; i < length; i++) {
		expandAccordion(accordion, i);
	}

	chartLinks.click(function () {
		var link = $(this), title;
		collapseAccordion(accordion, 0);
		title = link.attr("title"), options = {};

		chartName = accordion.find(".chartSelector")
				.prev().find("span.chartname");

		if (!link.hasClass("ui-state-active")) {
			chartLinks.removeClass("ui-state-active");
			link.addClass("ui-state-active");

			chartName.html(title);

			chartType = getChart(title);

			//for test
			options = $.extend({}, defaultValue[chartType.chart]);
			//end test

			if (chartType.chart !== "wijlinechart") {
				$.extend(options, chartType.subtype);
			}

			//set default UI values

			if (chartType.chart === "wijpiechart") {
				$("#axisContainer").hide();
				$("#linesContainer").hide();
			}
			else {
				$("#axisContainer").show();
				$("#linesContainer").show();
			}

			$("#cbLabels").attr("checked", true);
			$("#cbLabels").wijcheckbox("refresh");

			$("#cbLegend").attr("checked", true);
			$("#cbLegend").wijcheckbox("refresh");

			$("#cbLines").attr("checked", true);
			$("#cbLines").wijcheckbox("refresh");

			paintPreview($preview, $code, chartType.chart, options);
		}
	});

	//set size
	accordion.find("button:eq(0)").button()
			.click(function () {
				setSizeInput(320, 240);
			}).next().button().click(function () {
				setSizeInput(640, 480);
			}).next().button().click(function () {
				setSizeInput(800, 600);
			});

	var width, height;
	txtWidth.blur(function () {
		chartName = accordion.find(".sizeSelector")
						   .prev().find("span.chartname");

		width = parseInt(txtWidth.val());
		height = parseInt(txtHeight.val());
		chartName.html(width + "×" + height);
		applySize(width, height);
	});

	txtHeight.blur(function () {
		chartName = accordion.find(".sizeSelector")
						   .prev().find("span.chartname");

		width = parseInt(txtWidth.val());
		height = parseInt(txtHeight.val());
		chartName.html(width + "×" + height);
		applySize(width, height);
	});


	var setSizeInput = function (w, h) {
		chartName = accordion.find(".sizeSelector")
				.prev().find("span.chartname");
		txtWidth.val(w);
		txtHeight.val(h);
		collapseAccordion(accordion, 1);

		chartName.html(w + "×" + h);

		applySize(w, h);
	};

	var applySize = function (w, h) {
		$.extend(options, { width: w, height: h });

		if (chartType) {
			paintPreview($preview, $code, chartType.chart, options);
		}
	}

	var applyData = function (data) {
		$.extend(options, {
			seriesList: data
		});
		if (chartType) {
			paintPreview($preview, $code, chartType.chart, options);
		}
	}
	accordion.find("input").wijtextbox();

	accordion.find(".displayOption input").wijcheckbox();
	$("#cbLabels").change(function () {
		if ($(this).is(":checked")) {
			options.showChartLabels = true;
		}
		else {
			options.showChartLabels = false;
		}

		if (chartType) {
			paintPreview($preview, $code, chartType.chart, options);
		}

	});

	$("#cbLegend").change(function () {
		if (!$.isPlainObject(options.legend)) {
			options.legend = {};
		}
		if ($(this).is(":checked")) {
			$.extend(options.legend, {
				visible: true
			});
		}
		else {
			$.extend(options.legend, {
				visible: false
			});
		}

		if (chartType) {
			paintPreview($preview, $code, chartType.chart, options);
		}
	});

	$("#cbAxis").change(function () {
		if (!$.isPlainObject(options.axis)) {
			options.axis = {};
		}
		if (!$.isPlainObject(options.axis.x)) {
			options.axis.x = {};
		}
		if (!$.isPlainObject(options.axis.y)) {
			options.axis.y = {};
		}

		if ($(this).is(":checked")) {
			options.axis.x.visible = true;
			options.axis.y.visible = true;
		}
		else {
			options.axis.x.visible = false;
			options.axis.y.visible = false;
		}

		if (chartType) {
			paintPreview($preview, $code, chartType.chart, options);
		}
	});

	$("#cbTooltip").change(function () {
		if (chartType === undefined) {
			return;
		}
		if ($(this).is(":checked")) {
			options.hint = $.extend({}, defaultHint[chartType.chart].hint);
		}
		else {
			if (options.hint !== undefined && options.hint.content) {
				options.hint = null;
			}
		}

		paintPreview($preview, $code, chartType.chart, options);
	});

	$("#cbLines").change(function () {
		if (!$.isPlainObject(options.axis)) {
			options.axis = {};
		}
		if (!$.isPlainObject(options.axis.y)) {
			options.axis.y = {};
		}
		if (!$.isPlainObject(options.axis.y.gridMajor)) {
			options.axis.y.gridMajor = {};
		}

		if (!$.isPlainObject(options.axis.x)) {
			options.axis.x = {};
		}
		if (!$.isPlainObject(options.axis.x.gridMajor)) {
			options.axis.x.gridMajor = {};
		}

		if ($(this).is(":checked")) {
			if (chartType.chart === "wijlinechart") {
				options.axis.y.gridMajor.visible = true;
			}
			else if (chartType.chart === "wijbarchart") {
				options.axis.x.gridMajor.visible = true;
			}
		}
		else {
			options.axis.y.gridMajor.visible = false;
			options.axis.x.gridMajor.visible = false;
		}

		if (chartType) {
			paintPreview($preview, $code, chartType.chart, options);
		}
	});

	$("#clipboard").button().click(function () {
		var text = $preview.val();
		if ($.browser.msie) {
			window.clipboardData.setData('text', text);
		}
		else {
			alert("Your broswer not support this function.");
		}
	});


	//set seriesStyles
	var setSeriesStylesColor = function (index, color) {
		if (chartType.chart === "wijlinechart") {
			options.seriesStyles[index].stroke = color;
		}
		else {
			options.seriesStyles[index].fill = color;
		}
		paintPreview($preview, $code, chartType.chart, options);
	};

	var drawRecent = function (ele, width, height, color) {
		var paper = Raphael(ele.get(0), width, height);
		var c = paper.rect(0, 0, width, height);
		c.attr({ fill: color });
	}

	//data
	var btnOpts = {
		Ok: function () {
			var datetype, data, originalMarkup, isPieChart = false;

			//bar chart for example
			var getGridData = function (data) {
				var gridData = [], dataItem;
				if (data) {
					$.each(data, function (key, value) {
						dataItem = [];
						dataItem.push(value.label);
						$.merge(dataItem, value.data.y);
						gridData.push(dataItem);
					})
				};
				return gridData;
			};

			//get pie char data
			var getGridDataByPieChart = function (data) {
				var gridData = [], dataItem;
				if (data) {
					$.each(data, function (key, value) {
						dataItem = [];
						dataItem.push(value.label);
						dataItem.push(value.data);
						gridData.push(dataItem);
					})
				};
				return gridData;
			};

			//get seriesStyles
			var getSeriesStylesColor = function (seriesStyles, index) {
				if (index > -1) {
					if (chartType.chart === "wijlinechart") {
						return seriesStyles[index].stroke;
					}
					else {
						return seriesStyles[index].fill;
					}
				}
				return null;
			};



			//get header 
			var getGridHeader = function (data) {
				var gridHeader = [], headerItem;
				if (data) {
					headerItem = { headerText: "" }
					gridHeader.push(headerItem);
					$.each(data[0].data.x, function (i, x) {
						headerItem = {};
						headerItem.headerText = x.toString();
						gridHeader.push(headerItem);
					});
					return gridHeader;
				}
			};

			//add color to last column
			var formatLastColumn = function (arg, index) {
				var itemText, itemContainer;
				if (arg.state == 1 && arg.column.dataIndex == index) {
					itemText = arg.$cell.children(":first").text();
					//arg.$cell.text("");
					itemContainer = arg.$cell.children(":first");
					itemContainer.text("")
						.append("<span >" + itemText + "</span>");
					if (chartType.chart === "linechart") {
						itemContainer.append($("<span></span>").css({ "width": "20px", "height": "20px", display: "block", float: "right", "background-color": getSeriesStylesColor(seriesStyles[chartType.chart], arg.row.dataRowIndex) })
										.attr("name", "seriescolor_" + arg.row.dataItemIndex.toString())
										.bind("click", showColorDialog));
					}
					else {
						var rect = $("<div></div>").css({ "width": "20px", "height": "20px", float: "right" })
							.bind("click", showColorDialog)
							.attr("name", "seriescolor_" + arg.row.dataItemIndex.toString())
							.appendTo(itemContainer);
						drawRecent(rect, 20, 20, getSeriesStylesColor(seriesStyles[chartType.chart], arg.row.dataRowIndex));
					}
				}
			};



			//show color dialog
			var showColorDialog = function () {
				var span = $(this),
						coloript = span.next(), data = {
							span: span,
							input: coloript
						};
				$("#colorwheel").wijdialog("open").data("data", data);
			};

			//create grid  by data 
			var createGrid = function (data) {
				var gridHeaderData, gridData;
				if (isPieChart) {
					gridData = getGridDataByPieChart(data);
				} else {
					gridHeaderData = getGridHeader(data);
					gridData = getGridData(data);
				}

				if (data) {
					$("#gridcontainer").empty();
					$("<table />").appendTo($("#gridcontainer"))
									.wijgrid({
										//allowEditing: true,
										data: gridData,
										columns: gridHeaderData,
										cellStyleFormatter: function (arg) {
											if (gridHeaderData) {
												formatLastColumn(arg, gridHeaderData.length - 1);
											}
											else {
												formatLastColumn(arg, 1);
											}
										}
									});
				}
			};

			//create grid by table mark up
			var createGridByTable = function (tableMarkUp) {
				$("#gridcontainer").empty();
				tableMarkUp.appendTo($("#gridcontainer"));
				var colSize = $("#gridcontainer  tr").eq(1).find("td").length;
				wijgrid = tableMarkUp.wijgrid({
					cellStyleFormatter: function (arg) {
						formatLastColumn(arg, colSize);
					}
				});
			};

			//prepare data
			datetype = $(":radio[checked]").attr("id");
			switch (datetype) {
				case "csv":
					var csvString = $("#rawtext").val();
					parseCsv.parseData(csvString, options, chartType.chart);
					if (chartType.chart === "wijpiechart") {
						isPieChart = true;
					}
					createGrid(options.seriesList);
					applyData(options.seriesList);
					//					$.get($("#urltxt").val(), function (loaddata) {
					//						data = loaddata;
					//					});
					break;
				case "xml":
					var xmlString = $("#rawtext").val();
					parseXMLData.parseData(xmlString, options, chartType.chart);
					applyData(options.seriesList);
					if (chartType.chart === "wijpiechart") {
						isPieChart = true;
					}
					createGrid(options.seriesList);
					//					$.ajax({
					//						type: "POST",
					//						contentType: "application/json",
					//						url: "WebService1.asmx/GetClass",
					//						dataType: 'xml',
					//						success: function (result) {
					//							data = result.d;
					//							createGrid(data);
					//						}
					//					});
					break;
				case "json":

					eval("var data =" + $("#rawtext").val() + ";");
					//              				if (options) {
					//              					options.seriesList = data;
					//              				}
					createGrid(data);
					applyData(data);
					break;
				case "table":
					originalMarkup = $($("#rawtext").val());
					if (chartType.chart === "wijpiechart") {
						parseHTMLTable.wijpiechart.parseTable(originalMarkup, options);
					}
					else {
						parseHTMLTable.wijlineAndBarchart.parseTable(originalMarkup, options);
					}
					//Todo: get serieslist from table markup
					//data = getSeriesListFromMarkUp(originalMarkup);
					//options.seriesList = data;
					createGridByTable(originalMarkup);
					applyData(options.seriesList);
					break;
			};

			$(this).wijdialog("close");
		},
		Cancel: function () { $(this).wijdialog("close"); }
	};


	//color
	var colorPicker = $("#colorPicker"),
				colorval = $("#colorval"),
				colorinput = $("#tbColor"),
				pickercontainer = colorPicker.parent(),
				value;

	colorPicker.wijeditorcolorcanvas(function (val) {
		colorval.css("background-color", val);
		colorinput.val(val);
		var hsl = $.colorObj.unpack(val);
		valueChanged(hsl);
	});

	pickercontainer.hide();
	colorinput.wijtextbox();
	pickercontainer.css("top", colorinput.outerHeight());
	colorval.css("height", colorinput.outerHeight());
	colorval.css("width", colorinput.outerHeight());

	if (colorinput.val() === "") {
		colorinput.val("#000000");

	}
	value = colorinput.val();
	colorval.css("background-color", value);
	valueChanged($.colorObj.unpack(value));

	colorval.bind("click", function () {
		pickercontainer.show();
	});
	$(document).bind("click", function (e) {
		if ($.contains(pickercontainer.get(0), e.target) || colorval.get(0) === e.target) {
			return;
		}
		pickercontainer.hide();
	});

	$(".swatch").bind("click", function () {
		var div = $(this);
		color = div.text().substring(0, 7);
		colorinput.val(color);
		colorval.css("background-color", color);
		valueChanged($.colorObj.unpack(color));
	});

	colorinput.change(function () {
		var color = colorinput.val();
		colorval.css("background-color", color);
		valueChanged($.colorObj.unpack(color));
	})

	$("#colorwheel button").button();
	$("#colorwheel").wijdialog({
		width: "auto",
		autoOpen: false,
		title: "Color",
		captionButtons: captionBtnOption,
		buttons: {
			Ok: function () {
				var dialog = $(this), span, input, spanName, seriesIndex,
						data, color = colorinput.val();

				data = dialog.data("data");
				if (data) {
					input = data.input;
					span = data.span;
				}
				if (span.length > 0) {
					span.css("background-color", color);
					spanName = span.attr("name");
					//
					if (spanName) {
						seriesIndex = parseInt(spanName.replace(/seriescolor_/g, ""));
						if (!isNaN(seriesIndex)) {
							$.extend(options, { seriesStyles: seriesStyles[chartType.chart] });
							setSeriesStylesColor(seriesIndex, color);
						}

						if (chartType !== "wijlinechart") {
							span.empty();
							drawRecent(span, 20, 20, color);
						}
					}
				}

				if (input.length > 0) {
					input.val(color);
					if (input.attr("name") == "Labels") {

						if (!$.isPlainObject(options.chartLabelStyle)) {
							options.chartLabelStyle = {};
						}
						$.extend(options.chartLabelStyle, {
							stroke: color
						});

						if (chartType) {
							paintPreview($preview, $code, chartType.chart, options);
						}
					}
					else if (input.attr("name") == "Background") {
						
					}
				}

				dialog.wijdialog("close");
			},
			Cancel: function () {
				$(this).wijdialog("close");
			}
		}
	});


	$(".colorspan").bind("click", function () {
		var span = $(this),
				coloript = span.next(), data = {
					span: span,
					input: coloript
				};
		$("#colorwheel").wijdialog("open").data("data", data);
	});
	//end color

	//Data
	dialogOptions = {
		captionButtons: captionBtnOption,
		buttons: btnOpts,
		resizable: false,
		autoOpen: true,
		modal: false,
		width: 450
	};

	$(".data-header :button").button();
	$("#importdatadialog :text").wijtextbox();
	$("#importdatadialog textarea").wijtextbox();

	$("#import").bind("click", function () {
		$("#importdatadialog").wijdialog(dialogOptions);
	});
	//end data
});