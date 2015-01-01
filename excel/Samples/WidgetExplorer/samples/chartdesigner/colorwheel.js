function SetColors(r, g, b, a) {	
	var grade1=PutInRange(parseFloat(savegrade1),0.0,1.0),
		grade2=PutInRange(parseFloat(savegrade2),0.0,1.0),
		grade3=PutInRange(parseFloat(savegrade3),0.0,1.0),
		grade4=PutInRange(parseFloat(savegrade4),0.0,1.0);

	ra = Math.round(r + (255 - r) * grade1);
	ga = Math.round(g + (255 - g) * grade1);
	ba = Math.round(b + (255 - b) * grade1);

	rb = Math.round(r + (255 - r) * grade2);
	gb = Math.round(g + (255 - g) * grade2);
	bb = Math.round(b + (255 - b) * grade2);

	rc = Math.round(r * grade3);
	gc = Math.round(g * grade3);
	bc = Math.round(b * grade3);

	rd = Math.round(r * grade4);
	gd = Math.round(g * grade4);
	bd = Math.round(b * grade4);

	colora = "(" + ra + "," + ga + "," + ba + ")";
	colorb = "(" + rb + "," + gb + "," + bb + ")";
	colorc = "(" + r + "," + g + "," + b + ")";
	colord = "(" + rc + "," + gc + "," + bc + ")";
	colore = "(" + rd + "," + gd + "," + bd + ")";

	for (i = 0; i < a.length; i += 2) {
		document.getElementById(a[i] + 'c' + a[i + 1] + 'a').style.backgroundColor = 'rgb' + colora;
		document.getElementById(a[i] + 'c' + a[i + 1] + 'b').style.backgroundColor = 'rgb' + colorb;
		document.getElementById(a[i] + 'c' + a[i + 1] + 'c').style.backgroundColor = 'rgb' + colorc;
		document.getElementById(a[i] + 'c' + a[i + 1] + 'd').style.backgroundColor = 'rgb' + colord;
		document.getElementById(a[i] + 'c' + a[i + 1] + 'e').style.backgroundColor = 'rgb' + colore;

		document.getElementById(a[i] + 'c' + a[i + 1] + 'a').innerHTML = '#' + RGB2Hex(ra, ga, ba) + '<br>' + colora;
		document.getElementById(a[i] + 'c' + a[i + 1] + 'b').innerHTML = '#' + RGB2Hex(rb, gb, bb) + '<br>' + colorb;
		document.getElementById(a[i] + 'c' + a[i + 1] + 'c').innerHTML = '#' + RGB2Hex(r, g, b) + '<br>' + colorc;
		document.getElementById(a[i] + 'c' + a[i + 1] + 'd').innerHTML = '#' + RGB2Hex(rc, gc, bc) + '<br>' + colord;
		document.getElementById(a[i] + 'c' + a[i + 1] + 'e').innerHTML = '#' + RGB2Hex(rd, gd, bd) + '<br>' + colore;
	}
}

function HueShift(h, s) {
	h += s;
	while (h >= 360.0) h -= 360.0;
	while (h < 0.0) h += 360.0;
	return h;
}

function PutInRange(n, l, h) { return (n < l) ? l : ((n > h) ? h : n); }

function SetHex(objid, val) {
	var thisval = Dec2Hex(val);
	eval('save' + objid + '="' + thisval + '"');
	document.getElementById(objid).value = thisval;
}

function SetDec(objid, val) {
	var thisval = Hex2Dec(val);
	eval('save' + objid + '="' + thisval + '"');
	document.getElementById(objid).value = thisval;
}

function valueChanged(hsl){
	var r = hsl[0],
		g = hsl[1],
		b = hsl[2],
		thisrgb = {
			r:r,
			g:g,
			b:b
		},
		temprgb, temphsv,
		angle = 30;

	SetColors(r,g,b, ['m', '1', 'c', '1', 'a', '2', 's', '2', 't', '1']);
	SetColors(g, b, r, Array('t', '2'));
	SetColors(b, r, g, Array('t', '3'));

	temprgb = $.extend({}, thisrgb);
	temphsv = RGB2HSV(temprgb);
	temphsv.hue = HueShift(temphsv.hue, 180.0);
	temprgb = HSV2RGB(temphsv);
	SetColors(temprgb.r, temprgb.g, temprgb.b, Array('c', '2'));

	temprgb = $.extend({}, thisrgb);
	temphsv = RGB2HSV(temprgb);
	temphsv.hue = HueShift(temphsv.hue, angle);
	temprgb = HSV2RGB(temphsv);
	SetColors(temprgb.r, temprgb.g, temprgb.b, Array('a', '1'));

	temprgb = $.extend({}, thisrgb);
	temphsv = RGB2HSV(temprgb);
	temphsv.hue = HueShift(temphsv.hue, 0.0 - angle);
	temprgb = HSV2RGB(temphsv);
	SetColors(temprgb.r, temprgb.g, temprgb.b, Array('a', '3'));

	temprgb = $.extend({}, thisrgb);
	temphsv = RGB2HSV(temprgb);
	temphsv.hue = HueShift(temphsv.hue, 180.0 - angle);
	temprgb = HSV2RGB(temphsv);
	SetColors(temprgb.r, temprgb.g, temprgb.b, Array('s', '1'));

	temprgb = $.extend({}, thisrgb);;
	temphsv = RGB2HSV(temprgb);
	temphsv.hue = HueShift(temphsv.hue, 180.0 + angle);
	temprgb = HSV2RGB(temphsv);
	SetColors(temprgb.r, temprgb.g, temprgb.b, Array('s', '3'));
}


hexdig = '0123456789ABCDEF';
function Dec2Hex(d) {
	return hexdig.charAt((d - (d % 16)) / 16) + hexdig.charAt(d % 16);
}
function Hex2Dec(h) {
	h = h.toUpperCase();
	d = 0;
	for (i = 0; i < h.length; i++) {
		d = d * 16;
		d += hexdig.indexOf(h.charAt(i));
	}
	return d;
}

function RGB2Hex(r, g, b) {
	return Dec2Hex(r) + Dec2Hex(g) + Dec2Hex(b);
}

// RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
// which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
function HSV2RGB(hsv) {
	var rgb = new Object();
	if (hsv.saturation == 0) {
		rgb.r = rgb.g = rgb.b = Math.round(hsv.value * 2.55);
	} else {
		hsv.hue /= 60;
		hsv.saturation /= 100;
		hsv.value /= 100;
		i = Math.floor(hsv.hue);
		f = hsv.hue - i;
		p = hsv.value * (1 - hsv.saturation);
		q = hsv.value * (1 - hsv.saturation * f);
		t = hsv.value * (1 - hsv.saturation * (1 - f));
		switch (i) {
			case 0: rgb.r = hsv.value; rgb.g = t; rgb.b = p; break;
			case 1: rgb.r = q; rgb.g = hsv.value; rgb.b = p; break;
			case 2: rgb.r = p; rgb.g = hsv.value; rgb.b = t; break;
			case 3: rgb.r = p; rgb.g = q; rgb.b = hsv.value; break;
			case 4: rgb.r = t; rgb.g = p; rgb.b = hsv.value; break;
			default: rgb.r = hsv.value; rgb.g = p; rgb.b = q;
		}
		rgb.r = Math.round(rgb.r * 255);
		rgb.g = Math.round(rgb.g * 255);
		rgb.b = Math.round(rgb.b * 255);
	}
	return rgb;
}

function min3(a, b, c) { return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c); }
function max3(a, b, c) { return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c); }

function RGB2HSV(rgb) {
	hsv = new Object();
	max = max3(rgb.r, rgb.g, rgb.b);
	dif = max - min3(rgb.r, rgb.g, rgb.b);
	hsv.saturation = (max == 0.0) ? 0 : (100 * dif / max);
	if (hsv.saturation == 0) hsv.hue = 0;
	else if (rgb.r == max) hsv.hue = 60.0 * (rgb.g - rgb.b) / dif;
	else if (rgb.g == max) hsv.hue = 120.0 + 60.0 * (rgb.b - rgb.r) / dif;
	else if (rgb.b == max) hsv.hue = 240.0 + 60.0 * (rgb.r - rgb.g) / dif;
	if (hsv.hue < 0.0) hsv.hue += 360.0;
	hsv.value = Math.round(max * 100 / 255);
	hsv.hue = Math.round(hsv.hue);
	hsv.saturation = Math.round(hsv.saturation);
	return hsv;
}

saveri = "0";
savegi = "0";
savebi = "0";
saverih = "00";
savegih = "00";
savebih = "00";
saveangle = "30.0";
savegrade1 = "0.6";
savegrade2 = "0.25";
savegrade3 = "0.667";
savegrade4 = "0.333";
running = 0;


(function () {
	"use strict";

	var wijDoc = document,
	wijParseInt = parseInt,

	css_editor = "wijmo-wijcoloreditor",
	css_editor_colorcanvas = css_editor + "-colorcanvas",
	css_editor_color = css_editor + "-color",
	css_editor_wheel = css_editor + "-wheel",
	css_editor_overlay = css_editor + "-overlay",
	css_editor_marker = css_editor + "-marker";

	$.fn.wijeditorcolorcanvas = function (callback, initColor) {
		$.wijeditorcolorcanvas(this, callback, initColor);
		return this;
	};

	$.wijeditorcolorcanvas = function (containerj, callback, initColor) {
		var container = $(containerj).get(0);
		return container.wijeditorcolorcanvas ||
	(container.wijeditorcolorcanvas =
	new $._wijeditorcolorcanvas(container, callback, initColor));
	};

	$._wijeditorcolorcanvas = function (container, callback, initColor) {
		// Store editorcolorcanvas object
		var fb = this,
		markup = "", e, alphaImageLoader;

		alphaImageLoader = "progid:DXImageTransform.Microsoft.AlphaImageLoader" +
						"(enabled=true, sizingMethod=crop, ";

		markup += "<div class='" + css_editor_colorcanvas + "'>";
		markup += "<div class='" + css_editor_color + "'></div>";
		markup += "<div class='" + css_editor_wheel + "'></div>";
		markup += "<div class='" + css_editor_overlay + "'></div>";
		markup += "<div class='h-marker " + css_editor_marker + "'></div>";
		markup += "<div class='sl-marker " + css_editor_marker + "'></div></div>";

		$(container).html(markup);

		e = $("." + css_editor_colorcanvas, container);
		fb.wheel = $("." + css_editor_wheel, container).get(0);

		// Dimensions
		fb.radius = 84;
		fb.square = 100;
		fb.width = 194;

		// Fix background PNGs in IE6
		if ($.browser.msie && $.browser.version < 7) {
			$('*', e).each(function () {
				var imgEl = this,
				bgImg = imgEl.currentStyle.backgroundImage;

				if (bgImg !== 'none') {
					bgImg = bgImg.substring(5, bgImg.length - 2);

					$(imgEl).css({
						'backgroundImage': 'none',
						'filter': alphaImageLoader + "src='" + bgImg + "')"
					});
				}
			});
		}

		/**
		* Link to the given element(s) or callback.
		*/
		fb.linkTo = function (callback) {
			// Unbind previous nodes
			if (typeof fb.callback === 'object') {
				$(fb.callback).unbind('keyup', fb.updateValue);
			}

			// Reset color
			fb.color = null;

			// Bind callback or elements
			if (typeof callback === 'function') {
				fb.callback = callback;
			} else if (typeof callback === 'object' || typeof callback === 'string') {
				fb.callback = $(callback);
				fb.callback.bind('keyup', fb.updateValue);
				if (fb.callback.get(0).value) {
					fb.setColor(fb.callback.get(0).value);
				}
			}
			return this;
		};

		fb.updateValue = function (event) {
			var self = this;
			if (self.value && self.value !== fb.color) {
				fb.setColor(self.value);
			}
		};

		/**
		* Change color with HTML syntax #123456
		*/
		fb.setColor = function (color) {
			var unpack = fb.unpack(color);
			if (fb.color !== color && unpack) {
				fb.color = color;
				fb.rgb = unpack;
				fb.hsl = fb.RGBToHSL(fb.rgb);
				fb.updateDisplay();
			}
			return this;
		};

		/**
		* Change color with HSL triplet [0..1, 0..1, 0..1]
		*/
		fb.setHSL = function (hsl) {
			fb.hsl = hsl;
			fb.rgb = fb.HSLToRGB(hsl);
			fb.color = fb.pack(fb.rgb);
			fb.updateDisplay();
			return this;
		};

		/**
		* Retrieve the coordinates of the given event relative to the center
		* of the widget.
		*/
		fb.widgetCoords = function (event) {
			var x, y, el, reference, pos;
			el = event.target || event.srcElement;
			reference = fb.wheel;

			// Use absolute coordinates
			pos = fb.absolutePosition(reference);
			x = (event.pageX || 0 * (event.clientX + $('html').get(0).scrollLeft)) - pos.x;
			y = (event.pageY || 0 * (event.clientY + $('html').get(0).scrollTop)) - pos.y;

			// Subtract distance to middle
			return { x: x - fb.width / 2, y: y - fb.width / 2 };
		};

		/**
		* Mousedown handler
		*/
		fb.mousedown = function (event) {
			// Capture mouse
			if (!wijDoc.dragging) {
				$(wijDoc).bind('mousemove', fb.mousemove).bind('mouseup', fb.mouseup);
				wijDoc.dragging = true;
			}

			// Check which area is being dragged
			var pos = fb.widgetCoords(event);
			//document.title = pos.x + "|" + pos.y;
			fb.circleDrag = Math.max(Math.abs(pos.x), Math.abs(pos.y)) * 2 > fb.square;

			// Process
			fb.mousemove(event);
			return false;
		};

		/**
		* Mousemove handler
		*/
		fb.mousemove = function (event) {
			// Get coordinates relative to color picker center
			var pos = fb.widgetCoords(event), hue, sat, lum;

			// Set new HSL parameters
			if (fb.circleDrag) {
				hue = Math.atan2(pos.x, -pos.y) / 6.28;
				if (hue < 0) {
					hue += 1;
				}
				fb.setHSL([hue, fb.hsl[1], fb.hsl[2]]);
			} else {
				sat = Math.max(0, Math.min(1, -(pos.x / fb.square) + 0.5));
				lum = Math.max(0, Math.min(1, -(pos.y / fb.square) + 0.5));
				fb.setHSL([fb.hsl[0], sat, lum]);
			}
			return false;
		};

		/**
		* Mouseup handler
		*/
		fb.mouseup = function () {
			// Uncapture mouse
			$(wijDoc).unbind('mousemove', fb.mousemove)
		.unbind('mouseup', fb.mouseup);

			wijDoc.dragging = false;
		};

		/**
		* Update the markers and styles
		*/
		fb.updateDisplay = function () {
			// Markers
			var angle = fb.hsl[0] * 6.28, inputEl;
			$('.h-marker', e).css({
				left: Math.round(Math.sin(angle) * fb.radius + fb.width / 2) + 'px',
				top: Math.round(-Math.cos(angle) * fb.radius + fb.width / 2) + 'px'
			});

			$('.sl-marker', e).css({
				left: Math.round(fb.square * (0.5 - fb.hsl[1]) + fb.width / 2) + 'px',
				top: Math.round(fb.square * (0.5 - fb.hsl[2]) + fb.width / 2) + 'px'
			});

			// Saturation/Luminance gradient
			$("." + css_editor_color, e).css('backgroundColor',
			fb.pack(fb.HSLToRGB([fb.hsl[0], 1, 0.5])));

			// Linked elements or callback
			if (typeof fb.callback === 'object') {
				// Set background/foreground color
				$(fb.callback).css({
					backgroundColor: fb.color,
					color: fb.hsl[2] > 0.5 ? '#000' : '#fff'
				});

				// Change linked value
				$(fb.callback).each(function () {
					inputEl = this;
					if (inputEl.value && inputEl.value !== fb.color) {
						inputEl.value = fb.color;
					}
				});
			} else if (typeof fb.callback === 'function') {
				fb.callback.call(fb, fb.color);
			}
		};

		/**
		* Get absolute position of element
		*/
		fb.absolutePosition = function (el) {
			var r = { x: el.offsetLeft, y: el.offsetTop }, tmp;
			// Resolve relative to offsetParent
			if (el.offsetParent) {
				tmp = fb.absolutePosition(el.offsetParent);
				r.x += tmp.x;
				r.y += tmp.y;
			}
			return r;
		};

		/* Various color utility functions */
		fb.pack = function (rgb) {
			var r = Math.round(rgb[0] * 255), g, b;
			g = Math.round(rgb[1] * 255);
			b = Math.round(rgb[2] * 255);
			return '#' + (r < 16 ? '0' : '') + r.toString(16) +
		   (g < 16 ? '0' : '') + g.toString(16) +
		   (b < 16 ? '0' : '') + b.toString(16);
		};

		fb.unpack = function (color) {
			if (color.length === 7) {
				return [wijParseInt('0x' + color.substring(1, 3)) / 255,
				wijParseInt('0x' + color.substring(3, 5)) / 255,
				wijParseInt('0x' + color.substring(5, 7)) / 255];
			} else if (color.length === 4) {
				return [wijParseInt('0x' + color.substring(1, 2)) / 15,
				wijParseInt('0x' + color.substring(2, 3)) / 15,
				wijParseInt('0x' + color.substring(3, 4)) / 15];
			}
		};

		fb.HSLToRGB = function (hsl) {
			var m1, m2, h, s, l, self = this; //r, g, b, 
			h = hsl[0];
			s = hsl[1];
			l = hsl[2];
			m2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
			m1 = l * 2 - m2;
			return [self.hueToRGB(m1, m2, h + 0.33333),
		self.hueToRGB(m1, m2, h),
		self.hueToRGB(m1, m2, h - 0.33333)];
		};

		fb.hueToRGB = function (m1, m2, h) {
			h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
			if (h * 6 < 1) {
				return m1 + (m2 - m1) * h * 6;
			}
			if (h * 2 < 1) {
				return m2;
			}
			if (h * 3 < 2) {
				return m1 + (m2 - m1) * (0.66666 - h) * 6;
			}
			return m1;
		};

		fb.RGBToHSL = function (rgb) {
			var min, max, delta, h, s, l, r, g, b;
			r = rgb[0];
			g = rgb[1];
			b = rgb[2];
			min = Math.min(r, Math.min(g, b));
			max = Math.max(r, Math.max(g, b));
			delta = max - min;
			l = (min + max) / 2;
			s = 0;
			if (l > 0 && l < 1) {
				s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
			}
			h = 0;
			if (delta > 0) {
				if (max === r && max !== g) {
					h += (g - b) / delta;
				}
				if (max === g && max !== b) {
					h += (2 + (b - r) / delta);
				}
				if (max === b && max !== r) {
					h += (4 + (r - g) / delta);
				}
				h /= 6;
			}
			return [h, s, l];
		};

		// Install mousedown handler (the others are set on the document on-demand)
		$('*', e).mousedown(fb.mousedown);

		// Init color
		fb.setColor(initColor || '#000000');

		// Set linked elements/callback
		if (callback) {
			fb.linkTo(callback);
		}
	};

	if (!$.colorObj) {
		$.colorObj = {
			pack: function (rgb) {
				var r = Math.round(rgb[0] * 255), g, b;
				g = Math.round(rgb[1] * 255);
				b = Math.round(rgb[2] * 255);
				return '#' + (r < 16 ? '0' : '') + r.toString(16) +
		   (g < 16 ? '0' : '') + g.toString(16) +
		   (b < 16 ? '0' : '') + b.toString(16);
			},
			unpack: function (color) {
				if (color.length === 7) {
					return [wijParseInt('0x' + color.substring(1, 3)),
				wijParseInt('0x' + color.substring(3, 5)),
				wijParseInt('0x' + color.substring(5, 7))];
				} else if (color.length === 4) {
					return [wijParseInt('0x' + color.substring(1, 2)) / 15*255,
				wijParseInt('0x' + color.substring(2, 3)) / 15*255,
				wijParseInt('0x' + color.substring(3, 4)) / 15*255];
				}
			},	
		};
	}

} (jQuery));

