/*globals $ window*/

var chartCoreOption = {};

chartCoreOption.defaultValues = {
	width: null,
	height: null,
	seriesList: [],
	seriesStyles: [{
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
	}],
	seriesHoverStyles: [{
		opacity: 1,
		"stroke-width": 1.5
	}, {
		opacity: 1,
		"stroke-width": 1.5
	}, {
		opacity: 1,
		"stroke-width": 1.5
	}, {
		opacity: 1,
		"stroke-width": 1.5
	}, {
		opacity: 1,
		"stroke-width": 1.5
	}, {
		opacity: 1,
		"stroke-width": 1.5
	}, {
		opacity: 1,
		"stroke-width": 1.5
	}, {
		opacity: 1,
		"stroke-width": 1.5
	}, {
		opacity: 1,
		"stroke-width": 1.5
	}, {
		opacity: 1,
		"stroke-width": 1.5
	}, {
		opacity: 1,
		"stroke-width": 1.5
	}, {
		opacity: 1,
		"stroke-width": 1.5
	}],
	marginTop: 25,
	marginBottom: 25,
	marginLeft: 25,
	marginRight: 25,
	textStyle: {
		fill: "#888",
		"font-size": "10pt",
		stroke: "none"
	},
	header: {
		text: "",
		style: {
			fill: "none",
			stroke: "none"
		},
		textStyle: {
			"font-size": "18pt",
			fill: "#666",
			stroke: "none"
		},
		compass: "north",
		orientation: "horizontal",
		visible: true
	},
	
	axis: {
		x: {
			alignment: "center",
			style: {
				stroke: "#999999",
				"stroke-width": 0.5
			},
			visible: true,
			textVisible: true,
			text: "",
			textStyle: {
				fill: "#888",
				"font-size": "15pt",
				"font-weight": "bold"
			},
			labels: {
				style: {
					fill: "#333",
					"font-size": "11pt"
				},
				textAlign: "near",
				width: null
			},
			compass: "south",
			autoMin: true,
			autoMax: true,
			min: null,
			max: null,
			autoMajor: true,
			autoMinor: true,
			unitMajor: null,
			unitMinor: null,
			gridMajor: {
				visible: false,
				style: {
					stroke: "#CACACA",
					"stroke-dasharray": "- "
				}
			},
			gridMinor: {
				visible: false,
				style: {
					stroke: "#CACACA",
					"stroke-dasharray": "- "
				}
			},
			tickMajor: {
				position: "none",
				style: {
					fill: "black"
				},
				factor: 1
			},
			tickMinor: {
				position: "none",
				style: {
					fill: "black"
				},
				factor: 1
			},
			annoMethod: "values",
			annoFormatString: "",
			valueLabels: []
		}
	
	},
	hint: {
		enable: true,
		content: null,
		contentStyle: {
			fill: "#d1d1d1",
			"font-size": "16pt"
		},
		title: null,
		titleStyle: {
			fill: "#d1d1d1",
			"font-size": "16pt"
		},
		style: {
			fill: "270-#333333-#000000",
			"stroke-width": "2"
		},
		animated: "fade",
		showAnimated: "fade",
		hideAnimated: "fade",
		duration: 120,
		showDuration: 120,
		hideDuration: 120,
		easing: "",
		showEasing: "",
		hideEasing: "",
		showDelay: 150,
		hideDelay: 150,
		compass: "north",
		offsetX: 0,
		offsetY: 0,
		showCallout: true,
		calloutFilled: false,
		calloutFilledStyle: {
			fill: "#000"
		}
	},
	showChartLabels: true,
	chartLabelStyle: {},
	chartLabelFormatString: "",
	disableDefaultTextStyle: false,
	shadow: true,
	beforeSeriesChange: null,
	seriesChanged: null,
	beforePaint: null,
	painted: null
};

$.extend(chartCoreOption.defaultValues, {
	footer: $.extend({}, chartCoreOption.defaultValues.header, {
		style: {
			fill: "#fff",
			stroke: "none"
		},
		textStyle: {
			fill: "#000",
			stroke: "none"
		},
		compass: "south",
		visible: false
	}, true),
	
	legend: $.extend({}, chartCoreOption.defaultValues.header, {
		textMargin: {
			left: 2,
			top: 2,
			right: 2,
			bottom: 2
		},
		textStyle: {
			fill: "#333",
			stroke: "none"
		},
		titleStyle: {
			"font-weight": "bold",
			fill: "#000",
			stroke: "none"
		},
		compass: "east",
		orientation: "vertical"
	}, true),
	
	axis: {
		x: chartCoreOption.defaultValues.axis.x,
		y: $.extend({}, chartCoreOption.defaultValues.axis.x, {
			visible: false,
			labels: $.extend({}, chartCoreOption.defaultValues.axis.x.labels, {
				textAlign: "center"
			}, true),
			compass: "west",
			gridMajor: $.extend({}, chartCoreOption.defaultValues.axis.x.gridMajor, {
				visible: true,
				style: {
					stroke: "#999999",
					"stroke-width": "0.5",
					"stroke-dasharray": "none"
				}
			}, true)
		}, true)
	}
}, true);



chartCoreOption.enums = {
	compass: ["north", "south", "east", "west"],
	orientation: ["horizontal", "vertical"],
	// todo animated enums
	animated: ["fade"],
	easing: [">", "<", "<>", "backIn", "backOut", "bounce", "elastic",
		"easeInCubic", "easeOutCubic", "easeInBack", "easeOutBack",
		 "easeOutElastic", "easeOutBounce"],
	alignment: ["center", "near", "far"],
	position: ["none", "inside", "outside", "cross"],
	annoMethod: ["values", "valueLabels"]
};


chartCoreOption.seriesOption = {};
chartCoreOption.seriesOption.data = {
	x: {
		type: "array[string/number/date]",
		defaultValue: null
	},
	y: {
		type: "array[string/number/date]",
		defaultValue: null
	}
};

chartCoreOption.series = {
	label: {
		type: "string",
		defaultValue: ""
	},
	legendEntry: {
		type: "bool",
		defaultValue: true
	},
	data: {
		type: chartCoreOption.seriesOption.data,
		defaultValue: null
	},
	offset: {
		type: "number",
		defaultValue: 0
	}
};


chartCoreOption.style = {
	"clip-rect": {
		type: "string",
		defaultValue: ""
	},
	cursor: {
		type: "string",
		defaultValue: ""
	},
	cx: {
		type: "number",
		defaultValue: null
	},
	cy: {
		type: "number",
		defaultValue: null
	},
	fill: {
		type: "string",
		defaultValue: null
	},
	"fill-opacity": {
		type: "number",
		defaultValue: null
	},
	font: {
		type: "string",
		defaultValue: ""
	},
	"font-family": {
		type: "string",
		defaultValue: ""
	},
	"font-size": {
		type: "string",
		defaultValue: ""
	},
	"font-weight": {
		type: "string",
		defaultValue: ""
	},
	height: {
		type: "number",
		defaultValue: null
	},
	href: {
		type: "string",
		defaultValue: ""
	},
	opacity: {
		type: "number",
		defaultValue: null
	},
	path: {
		type: "string",
		defaultValue: ""
	},
	r: {
		type: "number",
		defaultValue: null
	},
	rotation: {
		type: "number",
		defaultValue: null
	},
	rx: {
		type: "number",
		defaultValue: null
	},
	ry: {
		type: "number",
		defaultValue: null
	},
	scale: {
		type: "string",
		defaultValue: ""
	},
	src: {
		type: "string",
		defaultValue: ""
	},
	stroke: {
		type: "color",
		defaultValue: null
	},
	"stroke-dasharray": {
		type: "string",
		defaultValue: ""
	},
	"stroke-linecap": {
		type: "string",
		defaultValue: ""
	},
	"stroke-linejoin": {
		type: "string",
		defaultValue: ""
	},
	"stroke-miterlimit": {
		type: "number",
		defaultValue: null
	},
	"stroke-opacity": {
		type: "number",
		defaultValue: null
	},
	"stroke-width": {
		type: "number",
		defaultValue: null
	},
	target: {
		type: "string",
		defaultValue: ""
	},
	"text-anchor": {
		type: "string",
		defaultValue: ""
	},
	title: {
		type: "string",
		defaultValue: ""
	},
	translation: {
		type: "string",
		defaultValue: ""
	},
	width: {
		type: "number",
		defaultValue: null
	},
	x: {
		type: "number",
		defaultValue: null
	},
	y: {
		type: "number",
		defaultValue: null
	}
};

chartCoreOption.header = {
	text: {
		type: "string",
		defaultValue: chartCoreOption.defaultValues.header.text
	},
	style: {
		type: chartCoreOption.style,
		defaultValue: chartCoreOption.defaultValues.header.style,
		uieditor: "wijchartstyleeditor"
	},
	textStyle: {
		type: chartCoreOption.style,
		defaultValue: chartCoreOption.defaultValues.header.textStyle,
		uieditor: "wijchartstyleeditor"
	},
	compass: {
		type: "enum",
		enumOptions: chartCoreOption.enums.compass,
		defaultValue: chartCoreOption.defaultValues.header.compass
	},
	orientation: {
		type: "enum",
		enumOptions: chartCoreOption.enums.orientation,
		defaultValue: chartCoreOption.defaultValues.header.orientation
	},
	visible: {
		type: "bool",
		defaultValue: chartCoreOption.defaultValues.header.visible
	}
};

chartCoreOption.legendOption = {};
chartCoreOption.legendOption.margin = {
	left: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.legend.textMargin.left
	},
	top: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.legend.textMargin.top
	},
	right: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.legend.textMargin.right
	},
	bottom: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.legend.textMargin.bottom
	}
};

chartCoreOption.legend = $.extend({}, chartCoreOption.header, {
	textMargin: {
		type: chartCoreOption.legendOption.margin,
		defaultValue: chartCoreOption.defaultValues.legend.textMargin
	},
	titleStyle: {
		type: chartCoreOption.style,
		defaultValue: chartCoreOption.defaultValues.legend.titleStyle,
		uieditor: "wijchartstyleeditor"
	}
});

chartCoreOption.axisOption = {};
chartCoreOption.axisOption.xOption = {};
chartCoreOption.axisOption.xOption.labels = {
	style: {
		type: chartCoreOption.style,
		defaultValue: chartCoreOption.defaultValues.axis.x.labels.style,
		uieditor: "wijchartstyleeditor"
	},
	textAlign: {
		type: "enum",
		enumOptions: chartCoreOption.enums.alignment,
		defaultValue: chartCoreOption.defaultValues.axis.x.labels.textAlign
	},
	width: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.axis.x.labels.width
	}
};

chartCoreOption.axisOption.xOption.gridMajor = {
	visible: {
		type: "bool",
		defaultValue: chartCoreOption.defaultValues.axis.x.gridMajor.visible
	},
	style: {
		type: chartCoreOption.style,
		defaultValue: chartCoreOption.defaultValues.axis.x.gridMajor.style,
		uieditor: "wijchartstyleeditor"
	}
};

chartCoreOption.axisOption.xOption.tickMajor = {
	position: {
		type: "enum",
		enumOptions: chartCoreOption.enums.position,
		defaultValue: chartCoreOption.defaultValues.axis.x.tickMajor.position
	},
	style: {
		type: chartCoreOption.style,
		defaultValue: chartCoreOption.defaultValues.axis.x.tickMajor.style,
		uieditor: "wijchartstyleeditor"
	},
	factor: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.axis.x.tickMajor.factor
	}
};

chartCoreOption.axisOption.x = {
	alignment: {
		type: "enum",
		enumOptions: chartCoreOption.enums.alignment,
		defaultValue: chartCoreOption.defaultValues.axis.x.alignment
	},
	style: {
		type: chartCoreOption.style,
		defaultValue: chartCoreOption.defaultValues.axis.x.style,
		uieditor: "wijchartstyleeditor"
	},
	visible: {
		type: "bool",
		defaultValue: chartCoreOption.defaultValues.axis.x.visible
	},
	textVisible: {
		type: "bool",
		defaultValue: chartCoreOption.defaultValues.axis.x.textVisible
	},
	text: {
		type: "string",
		defaultValue: chartCoreOption.defaultValues.axis.x.text
	},
	textStyle: {
		type: chartCoreOption.style,
		defaultValue: chartCoreOption.defaultValues.axis.x.textStyle,
		uieditor: "wijchartstyleeditor"
	},
	labels: {
		type: chartCoreOption.axisOption.xOption.labels,
		defaultValue: chartCoreOption.defaultValues.axis.x.labels
	},
	compass: {
		type: "enum",
		enumOptions: chartCoreOption.enums.compass,
		defaultValue: chartCoreOption.defaultValues.axis.x.compass
	},
	autoMin: {
		type: "bool",
		defaultValue: chartCoreOption.defaultValues.axis.x.autoMin
	},
	autoMax: {
		type: "bool",
		defaultValue: chartCoreOption.defaultValues.axis.x.autoMax
	},
	min: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.axis.x.min
	},
	max: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.axis.x.max
	},
	autoMajor: {
		type: "bool",
		defaultValue: chartCoreOption.defaultValues.axis.x.autoMajor
	},
	autoMinor: {
		type: "bool",
		defaultValue: chartCoreOption.defaultValues.axis.x.autoMinor
	},
	unitMajor: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.axis.x.unitMajor
	},
	unitMinor: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.axis.x.unitMinor
	},
	gridMajor: {
		type: chartCoreOption.axisOption.xOption.gridMajor,
		defaultValue: chartCoreOption.defaultValues.axis.x.gridMajor
	},
	gridMinor: {
		type: chartCoreOption.axisOption.xOption.gridMajor,
		defaultValue: chartCoreOption.defaultValues.axis.x.gridMinor
	},
	tickMajor: {
		type: chartCoreOption.axisOption.xOption.tickMajor,
		defaultValue: chartCoreOption.defaultValues.axis.x.tickMajor
	},
	tickMinor: {
		type: chartCoreOption.axisOption.xOption.tickMajor,
		defaultValue: chartCoreOption.defaultValues.axis.x.tickMinor
	},
	annoMethod: {
		type: "enum",
		enumOptions: chartCoreOption.enums.annoMethod,
		defaultValue: chartCoreOption.defaultValues.axis.x.annoMethod
	},
	annoFormatString: {
		type: "string",
		defaultValue: chartCoreOption.defaultValues.axis.x.annoFormatString
	},
	valueLabels: {
		type: "array[string/date/number]",
		defaultValue: chartCoreOption.defaultValues.axis.x.valueLables
	}
};

chartCoreOption.axis = {
	x: {
		type: chartCoreOption.axisOption.x,
		defaultValue: chartCoreOption.defaultValues.axis.x
	},
	y: {
		type: chartCoreOption.axisOption.x,
		defaultValue: chartCoreOption.defaultValues.axis.y
	}
};

chartCoreOption.hint = {
	enable: {
		type: "bool",
		defaultValue: chartCoreOption.defaultValues.hint.enable
	},
	content: {
		type: "function",
		defaultValue: chartCoreOption.defaultValues.hint.content
	},
	contentStyle: {
		type: chartCoreOption.style,
		defaultValue: chartCoreOption.defaultValues.hint.contentStyle,
		uieditor: "wijchartstyleeditor"
	},
	title: {
		type: "function",
		defaultValue: chartCoreOption.defaultValues.hint.title
	},
	titleStyle: {
		type: chartCoreOption.style,
		defaultValue: chartCoreOption.defaultValues.hint.titleStyle,
		uieditor: "wijchartstyleeditor"
	},
	style: {
		type: chartCoreOption.style,
		defaultValue: chartCoreOption.defaultValues.hint.style,
		uieditor: "wijchartstyleeditor"
	},
	animated: {
		type: "enum",
		enumOptions: chartCoreOption.enums.animated,
		defaultValue: chartCoreOption.defaultValues.hint.animated
	},
	showAnimated: {
		type: "enum",
		enumOptions: chartCoreOption.enums.animated,
		defaultValue: chartCoreOption.defaultValues.hint.showAnimated
	},
	hideAnimated: {
		type: "enum",
		enumOptions: chartCoreOption.enums.animated,
		defaultValue: chartCoreOption.defaultValues.hint.hideAnimated
	},
	duration: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.hint.duration
	},
	showDuration: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.hint.showDuration
	},
	hideDuration: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.hint.hideDuration
	},
	easing: {
		type: "enum",
		enumOptions: chartCoreOption.enums.easing,
		defaultValue: chartCoreOption.defaultValues.hint.easing
	},
	showEasing: {
		type: "enum",
		enumOptions: chartCoreOption.enums.easing,
		defaultValue: chartCoreOption.defaultValues.hint.showEasing
	},
	hideEasing: {
		type: "enum",
		enumOptions: chartCoreOption.enums.easing,
		defaultValue: chartCoreOption.defaultValues.hint.hideEasing
	},
	showDelay: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.hint.showDelay
	},
	hideDelay: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.hint.hideDelay
	},
	compass: {
		type: "enum",
		enumOptions: chartCoreOption.enums.compass,
		defaultValue: chartCoreOption.defaultValues.hint.compass
	},
	offsetX: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.hint.offsetX
	},
	offsetY: {
		type: "number",
		defaultValue: chartCoreOption.defaultValues.hint.offsetY
	},
	showCallout: {
		type: "bool",
		defaultValue: chartCoreOption.defaultValues.hint.showCallout
	},
	calloutFilled: {
		type: "bool",
		defaultValue: chartCoreOption.defaultValues.hint.calloutFilled
	},
	calloutFilledStyle: {
		type: chartCoreOption.style,
		defaultValue: chartCoreOption.defaultValues.hint.calloutFilledStyle,
		uieditor: "wijchartstyleeditor"
	}
};

var chartCoreOptions = {
	width: {
		defaultValue: chartCoreOption.defaultValues.width,
		type: "number",
		category: "appearance"
	},
	height: {
		category: "appearance",
		defaultValue: chartCoreOption.defaultValues.height,
		type: "number"
	},
	seriesList: {
		category: "data",
		defaultValue: [],
		type: "collection",
		itemType:chartCoreOption.series
	},
	seriesStyles: {
		category: "Styles",
		defaultValue: chartCoreOption.defaultValues.seriesStyles,
		type: "collection",
		itemType: chartCoreOption.style
	},
	seriesHoverStyles: {
		category: "styles",
		defaultValue: chartCoreOption.defaultValues.seriesHoverStyles,
		type: "collection",
		itemType: chartCoreOption.style
		//itemuieditor: "wijchartstyleeditor"

	},
	marginTop: {
		type: "number",
		category: "appearance",
		defaultValue: chartCoreOption.defaultValues.marginTop
	},
	marginRight: {
		type: "number",
		category: "appearance",
		defaultValue: chartCoreOption.defaultValues.marginRight
	},
	marginBottom: {
		type: "number",
		category: "appearance",
		defaultValue: chartCoreOption.defaultValues.marginBottom
	},
	marginLeft: {
		type: "number",
		category: "appearance",
		defaultValue: chartCoreOption.defaultValues.marginLeft
	},
	textStyle: {
		type: chartCoreOption.style,
		category: "styles",
		defaultValue: chartCoreOption.defaultValues.textStyle,
		uieditor: "wijchartstyleeditor"
	},
	header: {
		type: chartCoreOption.header,
		defaultValue: chartCoreOption.defaultValues.header,
		category: "behavior"
	},
	footer: {
		type: chartCoreOption.header,
		defaultValue: chartCoreOption.defaultValues.footer,
		category: "behavior"
	},
	legend: {
		type: chartCoreOption.legend,
		defaultValue: chartCoreOption.defaultValues.legend,
		category: "behavior"
	},
	axis: {
		type: chartCoreOption.axis,
		defaultValue: chartCoreOption.defaultValues.axis,
		category: "appearance"
	},
	hint: {
		type: chartCoreOption.hint,
		category: "behavior",
		defaultValue: chartCoreOption.defaultValues.hint
	},
	showChartLabels: {
		type: "bool",
		category: "behavior",
		defaultValue: chartCoreOption.defaultValues.showChartLabels
	},
	chartLabelStyle: {
		type: chartCoreOption.style,
		category: "styles",
		defaultValue: chartCoreOption.defaultValues.chartLabelStyle,
		uieditor: "wijchartstyleeditor"
	},
	chartLabelFormatString: {
		type: "string",
		category: "behavior",
		defaultValue: chartCoreOption.defaultValues.chartLabelFormatString
	},
	disableDefaultTextStyle: {
		type: "bool",
		category: "styles",
		defaultValue: chartCoreOption.defaultValues.disableDefaultTextStyle
	},
	shadow: {
		type: "bool",
		category: "appearance",
		defaultValue: chartCoreOption.defaultValues.shadow
	},
	beforeSeriesChange: {
		type: "function",
		defaultValue: chartCoreOption.defaultValues.beforeSeriesChange,
		category: "events"
	},
	seriesChanged: {
		type: "function",
		defaultValue: chartCoreOption.defaultValues.seriesChanged,
		category: "events"
	},
	beforePaint: {
		type: "function",
		defaultValue: chartCoreOption.defaultValues.beforePaint,
		category: "events"
	},
	painted: {
		type: "function",
		defaultValue: chartCoreOption.defaultValues.painted,
		category: "events"
	}
};

window.chartCoreOption = chartCoreOption;
window.chartCoreOptions = chartCoreOptions;

chartCoreOption.animation = {
	enable: {
		type: "bool",
		defaultValue: true
	},
	duration: {
		type: "number",
		defaultValue: 400
	},
	easing: {
		type: "enum",
		enumOptions: chartCoreOption.enums.easing,
		defaultValue: ">"
	}
};

chartCoreOption.chartEvents = {
	mouseDown: {
		type: "function",
		defaultValue: null
	},
	mouseUp: {
		type: "function",
		defaultValue: null
	},
	mouseOver: {
		type: "function",
		defaultValue: null
	},
	mouseOut: {
		type: "function",
		defaultValue: null
	},
	mouseMove: {
		type: "function",
		defaultValue: null
	},
	click: {
		type: "function",
		defaultValue: null
	}
};

var piechartOption = {};
piechartOption.defaultValues = {
	animation: {
		enable: true,
		duration: 400,
		easing: ">",
		offset: 10
	},
	seriesTransition: {
		enable: true,
		duration: 1000,
		easing: "bounce"
	}

};



piechartOption.animation = $.extend({}, chartCoreOption.animation, {
	offset: {
		type: "number",
		defaultValue: 10
	}
});

piechartOption.series = {
	label: {
		type: "string",
		defaultValue: ""
	},
	legendEntry: {
		type: "bool",
		defaultValue: true
	},
	data: {
		type: "number/string/date",
		defaultValue: null
	},
	offset: {
		type: "number",
		defaultValue: 0
	}
};

var piechartOptions = $.extend({}, chartCoreOptions, chartCoreOption.chartEvents, {
	radius: {
		type: "number",
		defaultValue: null
	},
	innerRadius: {
		type: "number",
		defaultValue: 0
	},
	animation: {
		type: piechartOption.animation,
		defaultValue: piechartOption.defaultValues.animation
	},
	seriesTransition: {
		type: chartCoreOption.animation,
		defaultValue: piechartOption.defaultValues.seriesTransition
	},
	seriesList: {
		category: "data",
		defaultValue: [],
		type: "collection",
		itemType: piechartOption.series
	}
});

delete (piechartOptions.axis);

window.piechartOption = piechartOption;
window.piechartOptions = piechartOptions;

var barchartOption = {};
barchartOption.defaultValues = {
	animation: {
		enable: true,
		duration: 400,
		easing: ">"
	}
};

var barchartOptions = $.extend({}, chartCoreOptions, chartCoreOption.chartEvents, {
	horizontal: {
		type: "bool",
		defaultValue: true
	},
	stacked: {
		type: "bool",
		defaultValue: false
	},
	is100Percent: {
		type: "bool",
		defaultValue: false
	},
	clusterOverlap: {
		type: "number",
		defaultValue: 0
	},
	clusterWidth: {
		type: "number",
		defaultValue: 85
	},
	clusterRadius: {
		type: "number",
		defaultValue: 0
	},
	clusterSpacing: {
		type: "number",
		defaultValue: 0
	},
	animation: {
		type: chartCoreOption.animation,
		defaultValue: barchartOption.defaultValues.animation
	},
	seriesTransition: {
		type: chartCoreOption.animation,
		defaultValue: barchartOption.defaultValues.animation
	}
});

window.barchartOption = barchartOption;
window.barchartOptions = barchartOptions;

var linechartOption = {
	animation: $.extend({}, chartCoreOption.animation, {
		direction: {
			type: "enum",
			enumOptions: chartCoreOption.enums.orientation,
			defaultValue: "horizontal"
		}
	})
};
linechartOption.defaultValue = {
	animation: {
		enabled: true,
		direction: "horizontal",
		duration: 2000,
		easing: ">"
	},
	seriesHoverStyles: {
		enabled: true,
		duration: 2000,
		easing: ">"
	}
};

var linechartOptions = $.extend({}, chartCoreOptions, chartCoreOption.chartEvents, {
	animation: {
		type: linechartOption.animation,
		defaultValue: linechartOption.defaultValue.animation
	},
	seriesTransition: {
		type: chartCoreOption.animation,
		defaultValue: linechartOption.defaultValue.seriesHoverStyles
	},
	zoomOnHover: {
		type: "bool",
		defaultValue: true
	}
});


window.linechartOption = linechartOption;
window.linechartOptions = linechartOptions;



