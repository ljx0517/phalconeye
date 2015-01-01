/*
 *
 * Wijmo Library 3.20143.59
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 *
 */
/// <reference path="drawing.ts" />
/// <reference path="../../External/declarations/geojson.d.ts"/>
var wijmo;
(function (wijmo) {
    (function (maps) {
        "use strict";

        /** @ignore */
        var Utils = (function () {
            function Utils() {
            }
            Utils.getBounds = function (pts) {
                if (!pts || pts.length === 0)
                    return null;

                var minx = Number.MAX_VALUE, miny = minx, maxx = -Number.MAX_VALUE, maxy = maxx;

                $.each(pts, function (index, pt) {
                    if (pt.x < minx)
                        minx = pt.x;
                    if (pt.x > maxx)
                        maxx = pt.x;
                    if (pt.y < miny)
                        miny = pt.y;
                    if (pt.y > maxy)
                        maxy = pt.y;
                });

                return new maps.Rectangle(new maps.Point(minx, miny), new maps.Size(maxx - minx, maxy - miny));
            };

            Utils.getListBounds = function (ptsList) {
                var listBounds, bounds;

                $.each(ptsList, function (index, pts) {
                    bounds = Utils.getBounds(pts);
                    if (bounds) {
                        listBounds = bounds.union(listBounds);
                    }
                });

                return listBounds;
            };

            Utils.getPoints = function (coordinates) {
                if (!coordinates)
                    return null;

                var points = [], len = coordinates.length;

                len = len - len % 2;
                for (var i = 0; i < len; i++) {
                    var pt = new maps.Point(coordinates[i], coordinates[++i]);
                    points.push(pt);
                }

                return points;
            };

            Utils.sinh = function (value) {
                return (Math.exp(value) - Math.exp(-value)) / 2;
            };

            Utils.createListPath = function (pointsList, closed) {
                var paths = "", path;
                $.each(pointsList, function (index, points) {
                    path = Utils.createPath(points);
                    if (path) {
                        paths += path;
                    }
                });

                return paths;
            };

            Utils.createPath = function (points, closed) {
                if (!points)
                    return null;

                var len = points.length, point, path = null, start;

                if (len > 0) {
                    start = points[0];
                    path = "M" + start.x + " " + start.y;

                    for (var i = 1; i < len; i++) {
                        point = points[i];
                        path += "L" + point.x + " " + point.y;
                    }

                    if (closed) {
                        path += "Z";
                    }
                }

                return path;
            };

            Utils.getPointData = function (coords) {
                var point = null;
                if (coords && coords.length > 0) {
                    point = new maps.Point(coords[0], coords[1]);
                }

                return point;
            };

            Utils.getLineData = function (coords) {
                var points = null;
                if (coords && coords.length > 0) {
                    points = [];
                    $.each(coords, function (index, position) {
                        points.push(Utils.getPointData(position));
                    });
                }

                return points;
            };

            Utils.getPolygonData = function (coords) {
                var pointsList = null;
                if (coords && coords.length > 0) {
                    pointsList = [];
                    $.each(coords, function (index, positions) {
                        pointsList.push(Utils.getLineData(positions));
                    });
                }

                return pointsList;
            };
            return Utils;
        })();
        maps.Utils = Utils;
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="utils.ts" />
    /// <reference path="../../wijutil/jquery.wijmo.raphael.ts"/>
    (function (maps) {
        "use strict";

        

        /**
        * @ignore
        * Defines a point with horizontal and vertical coordinates.
        */
        var Point = (function () {
            function Point(pointOrX, y) {
                var self = this;
                if (typeof (pointOrX) === "number") {
                    self.x = pointOrX;
                    self.y = y;
                } else {
                    var point = pointOrX;
                    self.x = point.x;
                    self.y = point.y;
                }
            }
            /**
            * Gets a new Point which has a offset to the current Point.
            * @param {number} offsetX The offset in horizontal.
            * @param {number} offsetY The offset in vertical.
            * @returns {Point} The new Point after offset.
            */
            Point.prototype.offset = function (offsetX, offsetY) {
                return new Point(this.x + offsetX, this.y + offsetY);
            };

            /**
            * Gets a new Point which has a scale to the current Point.
            * @param {number} scaleX The scale in horizontal.
            * @param {number} scaleY The scale in vertical.
            * @returns {Point} The new point after scale.
            */
            Point.prototype.scale = function (scaleX, scaleY) {
                return new Point(this.x * scaleX, this.y * scaleY);
            };
            Point.empty = new Point(0, 0);
            return Point;
        })();
        maps.Point = Point;

        

        /**
        * @ignore
        * Defines an ordered pair  of number, which specify a width and height.
        */
        var Size = (function () {
            function Size(sizeOrWidth, height) {
                var self = this;
                if (typeof (sizeOrWidth) === "number") {
                    self.width = sizeOrWidth;
                    self.height = height;
                } else {
                    var size = sizeOrWidth;
                    self.width = size.width;
                    self.height = size.height;
                }
            }
            /**
            * Gets a new Size object which has a scale to the current Size.
            * @param {number} scaleX The scale of the width.
            * @param {number} scaleY The scale of the height.
            * @returns {Size} The new Size object after scale.
            */
            Size.prototype.scale = function (scaleX, scaleY) {
                return new Size(this.width * scaleX, this.height * scaleY);
            };
            Size.empty = new Size(0, 0);
            return Size;
        })();
        maps.Size = Size;

        

        /**
        * @ignore
        * Defines a rectangle with location and size.
        */
        var Rectangle = (function () {
            /**
            * @param {Point} location The upper-left point of the rectangle.
            * @param {Size} size The size of the rectangle.
            */
            function Rectangle(location, size) {
                this.location = location;
                this.size = size;
            }
            /**
            * Gets the rectangle which is the intersection of itself and the specified rectangle.
            * @param {Rectangle} rect The rectangle with which to intersect.
            * @returns {Rectangle} The intersection rectangle of itself and the specified rectangle.
            */
            Rectangle.prototype.intersect = function (rect) {
                var self = this, x = Math.max(self.location.x, rect.location.x), right = Math.min(self.location.x + self.size.width, rect.location.x + rect.size.width), y = Math.max(self.location.y, rect.location.y), bottom = Math.min(self.location.y + self.size.height, rect.location.y + rect.size.height);

                if (right >= x && bottom >= y) {
                    return new Rectangle(new Point(x, y), new Size(right - x, bottom - y));
                }

                return null;
            };

            /**
            * Tests whether the location and size are both empty.
            * @returns {boolean} true if the location and size are both empty; otherwise, false.
            */
            Rectangle.prototype.isEmpty = function () {
                var self = this;
                return self.size.width === 0 && self.size.height === 0 && self.location.x === 0 && self.location.y === 0;
            };

            /**
            * Gets the right of the rectangle.
            * @returns The right of the rectangle which is left + width.
            */
            Rectangle.prototype.getRight = function () {
                return this.location.x + this.size.width;
            };

            /**
            * Gets the bottom of the rectangle.
            * @returns The bottom of the rectangle which is top + height.
            */
            Rectangle.prototype.getBottom = function () {
                return this.location.y + this.size.height;
            };

            /**
            * Determines if this rectangle intersects with the specified rectangle.
            * @param {Rectangle} rect The rectangle with which to check.
            * @returns {boolean} true if this rectangle intersects with the specified rectangle; otherwise, false.
            */
            Rectangle.prototype.intersectsWith = function (rect) {
                if (!rect)
                    return false;
                var self = this;
                return ((((self.location.x <= (rect.location.x + rect.size.width)) && ((self.location.x + self.size.width) >= rect.location.x)) && (self.location.y <= (rect.location.y + rect.size.height))) && ((self.location.y + self.size.height) >= rect.location.y));
            };

            /**
            * Gets a new rectangle which is the union of itself and the specified rectangle.
            * @param {Rectangle} rect The rectangle with which to union.
            * @returns {Rectangle} The new rectangle which is the union of this rectangle and the specified rectangle.
            */
            Rectangle.prototype.union = function (rect) {
                var self = this;
                if (!rect)
                    return $.extend(true, {}, self);

                var left = Math.min(self.location.x, rect.location.x), top = Math.min(self.location.y, rect.location.y), right = Math.max(self.location.x + self.size.width, rect.location.x + rect.size.width), bottom = Math.max(self.location.y + self.size.height, rect.location.y + rect.size.height);

                return new Rectangle(new Point(left, top), new Size(right - left, bottom - top));
            };
            Rectangle.empty = new Rectangle(Point.empty, Size.empty);
            return Rectangle;
        })();
        maps.Rectangle = Rectangle;

        /**
        * @ignore
        * Represents the vector shape.
        */
        var Shape = (function () {
            function Shape() {
                this.fill = "transparent";
                this.fillOpacity = 1;
                this.stroke = "#000";
                this.strokeOpacity = 1;
                this.strokeWidth = 1.0;
                this.strokeDashArray = "";
                this.strokeLineCap = 0 /* butt */;
                this.strokeLineJoin = 0 /* bevel */;
                this.strokeMiterLimit = 1.0;
            }
            Shape.prototype.createElement = function (paper) {
                return null;
            };

            Shape.prototype._setElementAttributes = function (st) {
                var self = this;
                if (st) {
                    st.attr({
                        fill: self.fill,
                        "fill-opacity": self.fillOpacity,
                        stroke: self.stroke,
                        "stroke-opacity": self.strokeOpacity,
                        "stroke-width": self.strokeWidth,
                        "stroke-dasharray": self.strokeDashArray,
                        "stroke-linecap": PenLineCap[self.strokeLineCap] || PenLineCap[0 /* butt */],
                        "stroke-linejoin": PenLineJoin[self.strokeLineJoin] || PenLineJoin[0 /* bevel */],
                        "stroke-miterlimit": self.strokeMiterLimit
                    });

                    if (self.fill === "transparent") {
                        st.attr("fill", "white").attr("fill-opacity", "0");
                    }
                }
            };
            return Shape;
        })();
        maps.Shape = Shape;

        /** @ignore */
        var Polyline = (function (_super) {
            __extends(Polyline, _super);
            function Polyline() {
                _super.apply(this, arguments);
            }
            Polyline.prototype.createElement = function (paper) {
                paper.setStart();
                var self = this, path = maps.Utils.createPath(self.points, false), st;

                if (path) {
                    paper.path(path);
                }

                st = paper.setFinish();
                self._setElementAttributes(st);
                return st;
            };
            return Polyline;
        })(Shape);
        maps.Polyline = Polyline;

        /** @ignore */
        var MultiPolyline = (function (_super) {
            __extends(MultiPolyline, _super);
            function MultiPolyline() {
                _super.apply(this, arguments);
            }
            MultiPolyline.prototype.createElement = function (paper) {
                paper.setStart();
                var self = this, path, st;

                if (self.points) {
                    $.each(self.points, function (index, linePoints) {
                        path = maps.Utils.createPath(linePoints, false);
                        if (path) {
                            paper.path(path);
                        }
                    });
                }

                st = paper.setFinish();
                self._setElementAttributes(st);
                return st;
            };
            return MultiPolyline;
        })(Shape);
        maps.MultiPolyline = MultiPolyline;

        /** @ignore */
        var Polygon = (function (_super) {
            __extends(Polygon, _super);
            function Polygon() {
                _super.apply(this, arguments);
                this.fillRule = 0 /* evenOdd */;
                this.pointsList = [];
            }
            Polygon.prototype.createElement = function (paper) {
                paper.setStart();
                var self = this, path = maps.Utils.createListPath(self.pointsList, true), st;

                if (path) {
                    paper.path(path);
                }

                st = paper.setFinish();
                self._setElementAttributes(st);
                return st;
            };
            return Polygon;
        })(Shape);
        maps.Polygon = Polygon;

        /** @ignore */
        (function (FillRule) {
            FillRule[FillRule["evenOdd"] = 0] = "evenOdd";
            FillRule[FillRule["nonezero"] = 1] = "nonezero";
        })(maps.FillRule || (maps.FillRule = {}));
        var FillRule = maps.FillRule;

        /** @ignore */
        (function (PenLineCap) {
            PenLineCap[PenLineCap["butt"] = 0] = "butt";
            PenLineCap[PenLineCap["square"] = 1] = "square";
            PenLineCap[PenLineCap["round"] = 2] = "round";
        })(maps.PenLineCap || (maps.PenLineCap = {}));
        var PenLineCap = maps.PenLineCap;

        /** @ignore */
        (function (PenLineJoin) {
            PenLineJoin[PenLineJoin["bevel"] = 0] = "bevel";
            PenLineJoin[PenLineJoin["round"] = 1] = "round";
            PenLineJoin[PenLineJoin["miter"] = 2] = "miter";
        })(maps.PenLineJoin || (maps.PenLineJoin = {}));
        var PenLineJoin = maps.PenLineJoin;
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="drawing.ts" />
    (function (maps) {
        "use strict";

        /** @ignore */
        var ClippingEngine = (function () {
            function ClippingEngine() {
            }
            ClippingEngine.createClippedLines = function (pts, clipBounds) {
                var pointsList = [], len = pts.length;

                for (var i = 1; i < len; i++) {
                    var clippedLine = ClippingEngine._clipSegmentCS(clipBounds, [pts[i - 1], pts[i]]);
                    if (clippedLine) {
                        pointsList.push(clippedLine);
                    }
                }

                return pointsList;
            };

            ClippingEngine._clipSegmentCS = function (clipBounds, pts) {
                var visible = false, pt0 = pts[0], pt1 = pts[1], cn = ClippingEngine._csCode(clipBounds, pt0), ck = ClippingEngine._csCode(clipBounds, pt1), dx = pt1.x - pt0.x, dy = pt1.y - pt0.y, dxdy = 0, dydx = 0;

                if (dx !== 0)
                    dydx = dy / dx;
                else {
                    if (dy === 0) {
                        if (cn === 0 && ck === 0)
                            return [pt0, pt1];
                        else
                            return null;
                    }
                }

                if (dy !== 0)
                    dxdy = dx / dy;

                var ii = 4, s, r;

                do {
                    if ((cn & ck) > 0) {
                        break;
                    }

                    if (cn === 0 && ck === 0) {
                        visible = true;
                        break;
                    }

                    if (cn === 0) {
                        s = cn;
                        cn = ck;
                        ck = s;

                        r = pt0.x;
                        pt0.x = pt1.x;
                        pt1.x = r;

                        r = pt0.y;
                        pt0.y = pt1.y;
                        pt1.y = r;
                    }

                    if ((cn & 1) > 0) {
                        var left = clipBounds.location.x;
                        pt0.y += dydx * (left - pt0.x);
                        pt0.x = left;
                    } else if ((cn & 2) > 0) {
                        var right = clipBounds.location.x + clipBounds.size.width;
                        pt0.y += dydx * (right - pt0.x);
                        pt0.x = right;
                    } else if ((cn & 4) > 0) {
                        var bottom = clipBounds.location.y + clipBounds.size.height;
                        pt0.x += dxdy * (bottom - pt0.y);
                        pt0.y = bottom;
                    } else if ((cn & 8) > 0) {
                        var top = clipBounds.location.y;
                        pt0.x += dxdy * (top - pt0.y);
                        pt0.y = top;
                    }

                    cn = ClippingEngine._csCode(clipBounds, pt0);
                } while(--ii >= 0);

                if (visible)
                    return [pt0, pt1];

                return null;
            };

            ClippingEngine.clipPolygon = function (pts, clipBounds) {
                var len = pts.length;
                if (len < 2)
                    return null;

                var list = [];
                for (var i = 0; i < len; i++) {
                    list.push(pts[i]);
                }

                var left = clipBounds.location.x, top = clipBounds.location.y, right = left + clipBounds.size.width, bottom = top + clipBounds.size.height;
                list = ClippingEngine._clipPolygonByLine(list, new maps.Point(left, top), new maps.Point(right, top));
                list = ClippingEngine._clipPolygonByLine(list, new maps.Point(right, top), new maps.Point(right, bottom));
                list = ClippingEngine._clipPolygonByLine(list, new maps.Point(right, bottom), new maps.Point(left, bottom));
                list = ClippingEngine._clipPolygonByLine(list, new maps.Point(left, bottom), new maps.Point(left, top));

                return list;
            };

            ClippingEngine.clipPolygonList = function (ptsList, clipBounds) {
                var list = [];
                $.each(ptsList, function (index, pts) {
                    list.push(ClippingEngine.clipPolygon(pts, clipBounds));
                });
                return list;
            };

            ClippingEngine._clipPolygonByLine = function (pts, cp1, cp2) {
                var list = [], len = pts.length;

                if (len > 0) {
                    var p0 = pts[len - 1];
                    for (var i = 0; i < len; i++) {
                        var p = pts[i];
                        if (this._inside(p, cp1, cp2)) {
                            if (this._inside(p0, cp1, cp2))
                                list.push(p);
                            else {
                                list.push(this._intersect(p0, p, cp1, cp2));
                                list.push(p);
                            }
                        } else {
                            if (this._inside(p0, cp1, cp2)) {
                                list.push(this._intersect(p0, p, cp1, cp2));
                            }
                        }

                        p0 = p;
                    }
                }

                return list;
            };

            ClippingEngine._inside = function (p, cp0, cp1) {
                if (cp1.x > cp0.x)
                    if (p.y >= cp0.y)
                        return true;
                if (cp1.x < cp0.x)
                    if (p.y <= cp0.y)
                        return true;
                if (cp1.y > cp0.y)
                    if (p.x <= cp1.x)
                        return true;
                if (cp1.y < cp0.y)
                    if (p.x >= cp1.x)
                        return true;
                return false;
            };

            ClippingEngine._intersect = function (p0, p1, cp0, cp1) {
                var p = new maps.Point(0, 0);
                if (cp0.y === cp1.y) {
                    p.y = cp0.y;
                    p.x = p0.x + (cp0.y - p0.y) * (p1.x - p0.x) / (p1.y - p0.y);
                } else {
                    p.x = cp0.x;
                    p.y = p0.y + (cp0.x - p0.x) * (p1.y - p0.y) / (p1.x - p0.x);
                }

                return p;
            };

            ClippingEngine._csCode = function (rect, pt) {
                var i = 0, left = rect.location.x, top = rect.location.y, right = left + rect.size.width, bottom = top + rect.size.height;

                if (pt.x < left)
                    ++i;
                else if (pt.x > right)
                    i += 2;

                if (pt.y > bottom)
                    i += 4;
                else if (pt.y < top)
                    i += 8;

                return i;
            };
            return ClippingEngine;
        })();
        maps.ClippingEngine = ClippingEngine;
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="Drawing.ts" />
    (function (maps) {
        "use strict";

        

        /** @ignore */
        var MercatorProjection = (function () {
            function MercatorProjection() {
            }
            MercatorProjection.prototype.project = function (lonLat) {
                return new maps.Point((lonLat.x + 180) / 360, (1 - Math.log(Math.tan(lonLat.y * Math.PI / 180) + 1 / Math.cos(lonLat.y * Math.PI / 180)) / Math.PI) / 2);
            };

            MercatorProjection.prototype.unproject = function (p) {
                var n = Math.PI - 2 * Math.PI * p.y;
                return new maps.Point((p.x * 360 - 180), 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
            };
            return MercatorProjection;
        })();
        maps.MercatorProjection = MercatorProjection;
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    /// <reference path="MapProjection.ts" />
    /// <reference path="../../Base/jquery.wijmo.widget.ts" />
    (function (maps) {
        "use strict";

        

        /**
        * @ignore
        * The converter to convert the coordinates in geograhic unit (longitude and latitude), logic unit(percentage) and screen unit (pixel).
        */
        var CoordConverter = (function () {
            /**
            * @param {JQuery} element The jQuery object that represents the wijmaps element.
            * @param {Point} center The current center of the map, in geographic unit.
            * @param {number} zoom The current zoom of the map.
            * @param {number} tileWidth The width of the tile, in pixel.
            * @param {number} tileHeight The height of the tile, in pixel.
            */
            function CoordConverter(element, center, zoom, tileWidth, tileHeight) {
                this.element = element;
                this.center = center;
                this.zoom = zoom;
                this.tileWidth = tileWidth;
                this.tileHeight = tileHeight;
                var self = this, leftTopGeographicCoord, rightBottomGeographicCoord;
                self._updateSize();
                self._projection = new maps.MercatorProjection();
                leftTopGeographicCoord = self.logicToGeographic(new maps.Point(0, 0));
                rightBottomGeographicCoord = self.logicToGeographic(new maps.Point(1, 1));
                self.minLongitude = leftTopGeographicCoord.x;
                self.maxLongitude = rightBottomGeographicCoord.x;
                self.minLatitude = rightBottomGeographicCoord.y;
                self.maxLatitude = leftTopGeographicCoord.y;
            }
            /**
            * @ignore
            * Update the cached size when the size of the map changed.
            */
            CoordConverter.prototype._updateSize = function () {
                var self = this, e = self.element;
                self._size = new maps.Size(e.width(), e.height());
            };

            /**
            * Convert the point coordinates from screen unit (pixel) to geographic unit (longitude and latitude).
            * @param {IPoint} position The point to convert, in screen unit.
            * @returns {IPoint} The new point after converted, in geographic unit.
            */
            CoordConverter.prototype.viewToGeographic = function (position) {
                var self = this;
                return self.logicToGeographic(self.viewToLogic(position));
            };

            /**
            * Convert the point coordinates from geographic unit (longitude and latitude) to screen unit (pixel).
            * @param {IPoint} position The point to convert, in geographic unit.
            * @returns {IPoint} The new point after converted, in screen unit.
            */
            CoordConverter.prototype.geographicToView = function (position) {
                var self = this;
                return self.logicToView(self.geographicToLogic(position));
            };

            /**
            * Convert the point coordinates from screen unit (pixel) to logic unit (percentage).
            * @param {IPoint} position The point to convert, in screen unit.
            * @returns {IPoint} The new point after converted, in logic unit.
            */
            CoordConverter.prototype.viewToLogic = function (position) {
                var self = this, viewCenter = self.getViewCenter(), logicCenter = self.getLogicCenter(), fullMapSize = self.getFullMapSize(), offset = new maps.Size(position.x - viewCenter.x, position.y - viewCenter.y).scale(1 / fullMapSize.width, 1 / fullMapSize.height);
                return self._rangeLogicPoint(new maps.Point(logicCenter).offset(offset.width, offset.height));
            };

            /**
            * Convert the point coordinates from logic unit (percentage) to screen unit (pixel).
            * @param {IPoint} position The point to convert, in loogic unit.
            * @returns {IPoint} The new point after converted, in screen unit.
            */
            CoordConverter.prototype.logicToView = function (position) {
                var self = this, logicPosition = self._rangeLogicPoint(position), viewCenter = self.getViewCenter(), logicCenter = self.getLogicCenter(), fullMapSize = self.getFullMapSize(), offset = new maps.Size(logicPosition.x - logicCenter.x, logicPosition.y - logicCenter.y).scale(fullMapSize.width, fullMapSize.height);
                return new maps.Point(viewCenter).offset(offset.width, offset.height);
            };

            /**
            * Convert the point coordinates from geographic unit (longitude and latitude) to logic unit (percentage).
            * @param {IPoint} position The point to convert, in geographic unit.
            * @returns {IPoint} The new point after converted, in logic unit.
            */
            CoordConverter.prototype.geographicToLogic = function (lonLat) {
                var self = this;
                return self._rangeLogicPoint(self._projection.project(lonLat));
            };

            /**
            * Convert the point coordinates from logic unit (percentage) to geographic unit (longitude and latitude).
            * @param {IPoint} position The point to convert, in logic unit.
            * @returns {IPoint} The new point after converted, in geographic unit.
            */
            CoordConverter.prototype.logicToGeographic = function (position) {
                var self = this, logicPosition = self._rangeLogicPoint(position);
                return self._projection.unproject(logicPosition);
            };

            /**
            * Gets the size of the map viewport.
            @returns {ISize} The size of the map viewport, in screen unit (pixel).
            */
            CoordConverter.prototype.getViewSize = function () {
                return this._size;
            };

            /**
            * Gets the size of the map viewport.
            * returns {ISize} The size of the map viewport, in logic unit (percentage).
            */
            CoordConverter.prototype.getLogicSize = function () {
                var self = this, viewSize = self.getViewSize(), fullMapSize = self.getFullMapSize();
                return new maps.Size(viewSize).scale(1 / fullMapSize.width, 1 / fullMapSize.height);
            };

            /**
            * Gets the center of the map viewport.
            * returns {IPoint} The center of the map view port, in screen unit (pixel).
            */
            CoordConverter.prototype.getViewCenter = function () {
                var self = this, size = self._size;
                return new maps.Point(size.width, size.height).scale(0.5, 0.5);
            };

            /**
            * Gets the center of the map viewport.
            * returns {IPoint} The center of the map view port, in logic unit (percentage).
            */
            CoordConverter.prototype.getLogicCenter = function () {
                var self = this;
                return self.geographicToLogic(self.center);
            };

            /**
            * Gets the size of the full map in current zoom level.
            * @returns {ISize} The size of the full map, in screen unit (pixel).
            */
            CoordConverter.prototype.getFullMapSize = function () {
                var self = this;
                return new maps.Size(self.tileWidth, self.tileHeight).scale(Math.pow(2, self.zoom), Math.pow(2, self.zoom));
            };

            /**
            * Calculate the distance between two points.
            * @param {IPoint} lonLat1 The coordinate of first point, in geographic unit.
            * @param {IPoint} longLat2 The coordinate of second point, in geographic unit.
            * @returns {number} The distance between to points, in meters.
            */
            CoordConverter.prototype.distance = function (lonLat1, lonLat2) {
                // taken from http://www.movable-type.co.uk/scripts/latlong.html
                var r = 6371000.0, dLat = (lonLat2.y - lonLat1.y) * (Math.PI / 180), dLon = (lonLat2.x - lonLat1.x) * (Math.PI / 180), a = Math.sin(dLat * 0.5) * Math.sin(dLat * 0.5) + Math.cos(lonLat1.y * (Math.PI / 180)) * Math.cos(lonLat2.y * (Math.PI / 180)) * Math.sin(dLon * 0.5) * Math.sin(dLon * 0.5), c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return r * c;
            };

            CoordConverter.prototype._rangeLogicPoint = function (position) {
                var min = 0, max = 0.9999999999;
                if (position.x < min)
                    position.x = min;
                if (position.y < min)
                    position.y = min;
                if (position.x > max)
                    position.x = max;
                if (position.y > max)
                    position.y = max;
                return position;
            };
            return CoordConverter;
        })();
        maps.CoordConverter = CoordConverter;
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (maps) {
        "use strict";

        

        /**
        * @ignore
        * The built-in tile source which gets the tile from bing maps.
        */
        var BingMapsSourceBase = (function () {
            function BingMapsSourceBase() {
                /**
                * The width of the tile, in pixel. The value is 256.
                */
                this.tileWidth = 256;
                /**
                * The height of the tile, in pixel. The value is 256.
                */
                this.tileHeight = 256;
                /**
                * The minmum zoom level which can show the tile. The value is 1.
                */
                this.minZoom = 1;
                /**
                * The maximum zoom level which can show the tile. The value is 19.
                */
                this.maxZoom = 19;
                this._uriFormat = "";
                this._subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];
            }
            /**
            * The callback function to get the url of the specific tile.
            * @param {number} zoom The current zoom level.
            * @param {number} x The column index of the tile, in 0 base. The amount of columns is 2^zoom.
            * @param {number} y The row index of the tile, in 0 base. The amount of rows is 2^zoom.
            * @return {string} The url of the specific tile.
            */
            BingMapsSourceBase.prototype.getUrl = function (zoom, x, y) {
                var self = this, subdomain = self._subdomains[(y * Math.pow(2, zoom) + x) % self._subdomains.length];
                return self._uriFormat.replace("{subdomain}", subdomain).replace("{quadkey}", self._getQuadkey(zoom, x, y));
            };

            // see http://msdn.microsoft.com/en-us/library/bb545006.aspx or http://www.cadmaps.com/gisblog/?p=7
            // for an explanation of how the quad tree tiles are codified
            BingMapsSourceBase.prototype._getQuadkey = function (zoom, x, y) {
                var quadkey = "", quadCode = [0, 2, 1, 3];
                for (var i = zoom; i > 0; --i) {
                    quadkey += quadCode[((x >> (i - 1) << 1) & 2) | ((y >> (i - 1)) & 1)];
                }
                return quadkey;
            };
            return BingMapsSourceBase;
        })();

        /**
        * @ignore
        * The built-in tile source which gets the tile from bing maps with road style.
        */
        var BingMapsRoadSource = (function (_super) {
            __extends(BingMapsRoadSource, _super);
            function BingMapsRoadSource() {
                _super.apply(this, arguments);
                //"http://t{subdomain}.tiles.ditu.live.com/tiles/r{quadkey}.png?g=41";
                this._uriFormat = "http://ecn.t{subdomain}.tiles.virtualearth.net/tiles/r{quadkey}.jpeg?g=2889&mkt=en-US&shading=hill";
            }
            return BingMapsRoadSource;
        })(BingMapsSourceBase);

        /**
        * @ignore
        * The built-in tile source which gets the tile from bing maps with aerial style.
        */
        var BingMapsAerialSource = (function (_super) {
            __extends(BingMapsAerialSource, _super);
            function BingMapsAerialSource() {
                _super.apply(this, arguments);
                this._uriFormat = "http://ecn.t{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=2889&mkt=en-US&shading=hill";
            }
            return BingMapsAerialSource;
        })(BingMapsSourceBase);

        /**
        * @ignore
        * The built-in tile source which gets the tile from bing maps with hybrid style.
        */
        var BingMapsHybridSource = (function (_super) {
            __extends(BingMapsHybridSource, _super);
            function BingMapsHybridSource() {
                _super.apply(this, arguments);
                this._uriFormat = "http://ecn.t{subdomain}.tiles.virtualearth.net/tiles/h{quadkey}.jpeg?g=2889&mkt=en-US&shading=hill";
            }
            return BingMapsHybridSource;
        })(BingMapsSourceBase);

        /**
        * @ignore
        * Defines the built-in tile sources.
        */
        var MapSource = (function () {
            function MapSource() {
            }
            MapSource.bingMapsRoadSource = new BingMapsRoadSource();

            MapSource.bingMapsAerialSource = new BingMapsAerialSource();

            MapSource.bingMapsHybridSource = new BingMapsHybridSource();
            return MapSource;
        })();
        maps.MapSource = MapSource;
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));

///<reference path="CoordConverter.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (maps) {
        "use strict";

        var $ = jQuery;

        /** @ignore */
        (function (LayerType) {
            LayerType[LayerType["vector"] = 0] = "vector";
            LayerType[LayerType["items"] = 1] = "items";
            LayerType[LayerType["virtual"] = 2] = "virtual";
            LayerType[LayerType["custom"] = 3] = "custom";
        })(maps.LayerType || (maps.LayerType = {}));
        var LayerType = maps.LayerType;

        /**
        * @widget
        * The base widget of the wijmaps layer.
        */
        var wijlayer = (function (_super) {
            __extends(wijlayer, _super);
            function wijlayer() {
                _super.apply(this, arguments);
            }
            /** @ignore */
            wijlayer.prototype._create = function () {
                _super.prototype._create.call(this);

                var self = this;
                self._updating = false;
                self._needUpdate = false;
            };

            /**
            * Create the Raphael paper within the container and specific size.
            */
            wijlayer.prototype._createPaper = function (container, size) {
                var clip, paper = Raphael(container, 1, 1);
                $(paper.canvas).css("overflow", "visible");
                this._resizePaper(paper, size);
                return paper;
            };

            /**
            * Update the Raphael paper size based on the container size.
            */
            wijlayer.prototype._resizePaper = function (paper, size) {
                if (Raphael.svg) {
                    $(paper.canvas).css("width", size.width + "px").css("height", size.height + "px");
                } else {
                    $(paper.canvas).css("clip", "rect(0px," + size.width + "px," + size.height + "px,0px)");
                    // vml, keept 1px*1px;
                }
            };

            /** @ignore */
            wijlayer.prototype._setOption = function (key, value) {
                var self = this, o = this.options;
                if (o[key] !== value) {
                    switch (key) {
                        case 'center':
                            self._setCenter(value);
                            return;
                        case 'zoom':
                            self._setZoom(value);
                            return;
                    }
                }
                _super.prototype._setOption.call(this, key, value);
            };

            /**
            * Set the center of the layer.
            * @param {Point} center The current center of the layer, in geographic unit.
            */
            wijlayer.prototype._setCenter = function (center) {
                var self = this, o = self.options;
                if (o.center.x !== center.x || o.center.y !== center.y) {
                    o.center = center;
                    self.update();
                }
            };

            /**
            * Set the zoom of the layer.
            * @param {number} zoom The current zoom of the layer.
            */
            wijlayer.prototype._setZoom = function (zoom) {
                var self = this, o = self.options;
                if (o.zoom !== zoom) {
                    o.zoom = zoom;
                    self.update();
                }
            };

            /**
            * Draw the layer.
            */
            wijlayer.prototype._render = function () {
            };

            /**
            * Update the layer, redraw the layer if needed. It's called when the center and zoom changed.
            */
            wijlayer.prototype.update = function () {
                var self = this, o = self.options;
                if (self._updating) {
                    self._needUpdate = true;
                    return;
                }

                self._render();
            };

            /**
            * Called when the wijmaps begins to update the layer status.
            */
            wijlayer.prototype.beginUpdate = function () {
                this._updating = true;
            };

            /**
            * Called when the wijmaps ends update the layer status. The layer will be updated after this function called.
            */
            wijlayer.prototype.endUpdate = function () {
                var self = this;
                self._updating = false;
                if (self._needUpdate) {
                    self.update();
                }
            };

            /**
            * Refresh the layer. Usually used if want to apply the new data to the layer.
            */
            wijlayer.prototype.refresh = function () {
                this.update();
            };
            return wijlayer;
        })(wijmo.wijmoWidget);
        maps.wijlayer = wijlayer;

        

        

        

        /**
        * The options of the wijlayer.
        */
        var wijlayer_options = (function () {
            function wijlayer_options() {
            }
            return wijlayer_options;
        })();
        maps.wijlayer_options = wijlayer_options;

        wijlayer.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijlayer_options());

        $.wijmo.registerWidget("wijlayer", wijlayer.prototype);
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));

/// <reference path="Drawing.ts"/>
/// <reference path="Utils.ts"/>
/// <reference path="ClippingEngine.ts"/>
/// <reference path="wijlayer.ts" />
/// <reference path="../../Base/jquery.wijmo.widget.ts" />
/// <reference path="../../wijutil/jquery.wijmo.raphael.ts"/>
/// <reference path="../../External/declarations/geojson.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (maps) {
        "use strict";

        var $ = jQuery, vectorCanvasCss = "wijmo-wijmaps-vectorlayer-canvas", layerContainerCss = "wijmo-wijmaps-layercontainer", vectorShapeCss = "wijmo-wijmaps-vectorlayer-shape", vectorMarkCss = "wijmo-wijmaps-vectorlayer-mark", vectorMarkLabelCss = "wijmo-wijmaps-vectorlayer-marklabel", vectorData = "wijmoWijvectorlayerData";

        /** @ignore */
        var VectorType;
        (function (VectorType) {
            VectorType[VectorType["placemark"] = 0] = "placemark";
            VectorType[VectorType["polyline"] = 1] = "polyline";
            VectorType[VectorType["polygon"] = 2] = "polygon";
        })(VectorType || (VectorType = {}));

        /** @ignore */
        var LabelVisibility;
        (function (LabelVisibility) {
            LabelVisibility[LabelVisibility["hidden"] = 0] = "hidden";
            LabelVisibility[LabelVisibility["autoHide"] = 1] = "autoHide";
            LabelVisibility[LabelVisibility["visible"] = 2] = "visible";
        })(LabelVisibility || (LabelVisibility = {}));

        /** @ignore */
        var LabelPosition;
        (function (LabelPosition) {
            LabelPosition[LabelPosition["center"] = 0] = "center";
            LabelPosition[LabelPosition["left"] = 1] = "left";
            LabelPosition[LabelPosition["right"] = 2] = "right";
            LabelPosition[LabelPosition["top"] = 3] = "top";
            LabelPosition[LabelPosition["bottom"] = 4] = "bottom";
        })(LabelPosition || (LabelPosition = {}));

        /** @ignore */
        var LOD = (function () {
            function LOD(data) {
                this.minSize = 0;
                this.maxSize = 0;
                this.minZoom = 0;
                this.maxZoom = 0;
                if (!data) {
                    return;
                }

                var self = this;
                self.minSize = data.minSize || 0;
                self.maxSize = data.maxSize || 0;
                self.minZoom = data.minZoom || 0;
                self.maxZoom = data.maxZoom || 0;
            }
            LOD.prototype.isDefault = function () {
                return this.minSize === 0 && this.maxSize === 0 && this.minZoom === 0 && this.maxZoom === 0;
            };
            return LOD;
        })();
        maps.LOD = LOD;

        

        /** @ignore */
        var MapState = (function () {
            function MapState() {
            }
            return MapState;
        })();

        /** @ignore */
        var ProjectionFast = (function () {
            function ProjectionFast(scaleX, scaleY, offsetX, offsetY, extraX, extraY) {
                var self = this;
                self._scaleX = scaleX;
                self._scaleY = scaleY;
                self._offsetX = offsetX;
                self._offsetY = offsetY;
                self._extraX = extraX;
                self._extraY = extraY;
            }
            ProjectionFast.prototype.init = function (o) {
                var self = this, converter = o.converter, viewSize = converter.getViewSize(), logicSize = converter.getLogicSize(), geographicCenter = o.center, scale = viewSize.width / logicSize.width, logicCenter = converter.geographicToLogic(geographicCenter), offsetX = 0.5 * viewSize.width - logicCenter.x * scale, offsetY = 0.5 * viewSize.height - logicCenter.y * scale;

                self._ax = ProjectionFast.toRad * self._scaleX * scale;
                self._bx = self._offsetX * scale + offsetX + self._extraX;

                self._ay = 0.5 * self._scaleY * scale;
                self._by = self._offsetY * scale + offsetY + self._extraY;

                self._converter = converter;
            };

            ProjectionFast.prototype.project = function (longLat) {
                var self = this, converter = self._converter;

                if (converter) {
                    if (longLat.y > converter.maxLatitude)
                        longLat.y = converter.maxLatitude;
                    if (longLat.y < converter.minLatitude)
                        longLat.y = converter.minLatitude;
                }

                var sinLat = Math.sin(longLat.y * ProjectionFast.toRad), x = (longLat.x * self._ax + self._bx), y = (Math.log((1.0 + sinLat) / (1.0 - sinLat)) * self._ay + self._by);

                return new maps.Point(x, y);
            };

            ProjectionFast.prototype.unproject = function (point) {
                var self = this, x = ((point.x - self._offsetX) * ProjectionFast.toDeg / self._scaleX), y = (Math.atan(maps.Utils.sinh((point.y - self._offsetY) / self._scaleY)) * ProjectionFast.toDeg);

                return new maps.Point(x, y);
            };
            ProjectionFast.toRad = Math.PI / 180;
            ProjectionFast.toDeg = 180 / Math.PI;
            return ProjectionFast;
        })();

        /**
        * @widget
        * The vector layer for the wijmaps. Draw the shapes and placemarks.
        */
        var wijvectorlayer = (function (_super) {
            __extends(wijvectorlayer, _super);
            function wijvectorlayer() {
                _super.apply(this, arguments);
            }
            /** @ignore */
            wijvectorlayer.prototype._create = function () {
                var self = this, selector = "." + vectorShapeCss;

                self._proj = new ProjectionFast(1 / (Math.PI * 2), -1 / (Math.PI * 2), 0.5, 0.5, -wijvectorlayer._offsetX, -wijvectorlayer._offsetY);
                self._cache = null;
                self._needFullUpdateShape = false;
                self._needDrawMarkShape = false;

                self._container = $("<div class=\"" + vectorCanvasCss + "\"></div>").appendTo(self.element).on("click." + self.widgetName, selector, function (e) {
                    self._onItemMouseEvent("click", e, this);
                }).on("mousedown." + self.widgetName, selector, function (e) {
                    self._onItemMouseEvent("mouseDown", e, this);
                }).on("mouseup." + self.widgetName, selector, function (e) {
                    self._onItemMouseEvent("mouseUp", e, this);
                }).on("mousemove." + self.widgetName, selector, function (e) {
                    self._onItemMouseEvent("mouseMove", e, this);
                }).on("mouseenter." + self.widgetName, selector, function (e) {
                    self._onItemMouseEvent("mouseEnter", e, this);
                }).on("mouseleave." + self.widgetName, selector, function (e) {
                    self._onItemMouseEvent("mouseLeave", e, this);
                });

                _super.prototype._create.call(this);

                self._setData(self.options.data);
            };

            /** @ignore */
            wijvectorlayer.prototype._setOption = function (key, value) {
                var self = this, o = this.options;
                if (o[key] !== value) {
                    switch (key) {
                        case 'dataType':
                            self._setDataType(value);
                            return;
                        case 'data':
                            self._setData(value);
                            return;
                    }
                }
                _super.prototype._setOption.call(this, key, value);
            };

            wijvectorlayer.prototype._setDataType = function (dataType) {
                var self = this;
                self.options.dataType = dataType;
            };

            wijvectorlayer.prototype._setData = function (data) {
                var self = this, o = self.options;
                o.data = data;

                if (typeof (data) === "string") {
                    self._prepareDataFromUri(data);
                } else if ($.isFunction(data)) {
                    self._applyData(data());
                } else {
                    self._applyData(data);
                }
            };

            wijvectorlayer.prototype._prepareDataFromUri = function (dataUri) {
                var self = this;
                $.ajax({
                    url: dataUri,
                    data: null,
                    context: null,
                    success: function (result) {
                        self._uriLoaded(result);
                    },
                    error: null,
                    dataType: "json"
                });
            };

            wijvectorlayer.prototype._uriLoaded = function (result) {
                var self = this;
                self._applyData(result);
            };

            wijvectorlayer.prototype._applyData = function (data) {
                var self = this;

                if (self._data === data)
                    return;
                self._data = data;

                self._applyDataInternal(data);
            };

            wijvectorlayer.prototype._applyDataInternal = function (data) {
                var self = this, o = self.options;
                if (o.dataType === DataJsonType.wijJson) {
                    self._applyWijJsonData(data);
                } else if (o.dataType === DataJsonType.geoJson) {
                    self._applyGeoJsonData(data);
                }

                self._needFullUpdateShape = true;
                self.update();
            };

            wijvectorlayer.prototype._applyWijJsonData = function (data) {
                this._createVectors(data);
            };

            wijvectorlayer.prototype._applyGeoJsonData = function (data) {
                var self = this, obj = GeoObject.create(data);
                if (obj) {
                    obj.applyData(data, {});
                }
                self._vectorObj = obj;
            };

            wijvectorlayer.prototype._createVectors = function (data) {
                var _this = this;
                var self = this, list = new VectorItemCollection();
                if (data && data.vectors) {
                    $.each(data.vectors, function (index, vector) {
                        var item = _this._createVector(vector);
                        if (item) {
                            var wrapper = new VectorItemWrapper(item);
                            wrapper.applyData(vector);
                            list.addChild(wrapper);
                        }
                    });
                }

                self._vectorObj = list;
            };

            wijvectorlayer.prototype._createVector = function (vectorData) {
                switch (VectorType[vectorData.type]) {
                    case 2 /* polygon */:
                        return new VectorPolygon();
                    case 0 /* placemark */:
                        return new VectorPlacemark();
                    case 1 /* polyline */:
                        return new VectorPolyline();
                }

                return null;
            };

            /**
            * @ignore
            * override
            */
            wijvectorlayer.prototype._render = function () {
                var self = this;
                _super.prototype._render.call(this);
                self._updateShape();
            };

            wijvectorlayer.prototype._createContainer = function () {
                var self = this, clip = wijvectorlayer._clipRect;

                self._destroyContainer();

                self._shapeContainer = $("<div class=\"" + layerContainerCss + "\"></div>");
                self._paper = self._createPaper(self._shapeContainer[0], new maps.Size(clip.getRight(), clip.getBottom()));
                self._group = self._paper.group();
                self._placemarkContainer = $("<div class=\"" + layerContainerCss + "\" style='visibility:hidden;'></div>");
            };

            wijvectorlayer.prototype._destroyContainer = function () {
                var self = this;
                if (self._paper)
                    self._paper.remove();
                if (self._shapeContainer) {
                    self._shapeContainer.off("." + self.widgetName).remove();
                }
                if (self._placemarkContainer) {
                    self._placemarkContainer.off("." + self.widgetName).remove();
                }
            };

            wijvectorlayer.prototype._refreshPaper = function () {
                var self = this;
                self._container.css("left", wijvectorlayer._offsetX + "px").css("top", wijvectorlayer._offsetY + "px");
                self._createContainer();

                self._marks = [];
                if (self._vectorObj) {
                    self._drawVectorObj(self._vectorObj);
                }

                self._container.append(self._shapeContainer);
                self._container.append(self._placemarkContainer);
                self._arrangeMarks();
                self._arrangeLabels();
                self._placemarkContainer.css("visibility", "visible");
            };

            wijvectorlayer.prototype._drawVectorObj = function (vector) {
                var self = this;

                self._drawSingleVectorObj(vector);

                if (vector && vector.children && vector.children.length > 0) {
                    $.each(vector.children, function (index, child) {
                        self._drawVectorObj(child);
                    });
                }
            };

            wijvectorlayer.prototype._drawSingleVectorObj = function (vector) {
                var self = this, shape, els, el, data = { vector: vector, shape: null };
                if (vector.vectorItems) {
                    $.each(vector.vectorItems, function (index, item) {
                        if (item.visible) {
                            shape = item.getShape();
                            if (shape) {
                                el = shape.createElement(self._paper);
                                if (el) {
                                    self._group.push(el);
                                    if (els) {
                                        el.forEach(function (e) {
                                            els.push(e);
                                        });
                                    } else {
                                        els = el;
                                    }
                                }
                            }

                            if (item instanceof VectorPlacemark) {
                                self._drawPlacemark(item, data);
                            }
                        }
                    });

                    if (els) {
                        data.shape = els;
                        $.each(els, function (index, element) {
                            $.wijraphael.addClass($(element.node), vectorShapeCss);
                            $(element.node).data(vectorData, data);
                        });
                        self._onShapeCreated("shapeCreated", data);
                    }
                }
            };

            wijvectorlayer.prototype._drawPlacemark = function (placemark, data) {
                var self = this, cache = { location: placemark.point };
                if (!self._needDrawMarkShape) {
                    self._drawMark(placemark, data, cache);
                }
                self._drawLabel(placemark, cache);

                if (cache.mark || cache.label) {
                    self._marks.push(cache);
                }
            };

            wijvectorlayer.prototype._drawMark = function (placemark, data, cache) {
                var self = this, mo = self.options.placemark, point, mark, size, pin, top, left;

                if (mo === null)
                    return;

                if (mo.render) {
                    mark = mo.render(data);
                } else if (mo.image) {
                    mark = $("<img src='" + mo.image + "' />");
                }

                if (!mark || !mark.length)
                    return;

                cache.mark = mark;
                mark.addClass(vectorMarkCss).data(vectorData, data).appendTo(self._placemarkContainer);
            };

            wijvectorlayer.prototype._arrangeMarks = function () {
                var self = this, o = self.options, mo = o.placemark || {}, location, mark, size, pin, top, left;

                if (self._marks) {
                    $.each(self._marks, function (index, cache) {
                        if (cache.mark) {
                            mark = cache.mark;
                            location = o.converter.geographicToView(cache.location);
                            size = cache.markSize || mo.size || new maps.Size(mark.width(), mark.height());
                            pin = mo.pinPoint || new maps.Point(size.width / 2, size.height / 2);

                            location.x -= wijvectorlayer._offsetX;
                            location.y -= wijvectorlayer._offsetY;

                            left = location.x - pin.x;
                            top = location.y - pin.y;

                            cache.markSize = size;
                            mark.css("position", "absolute").css("left", left + "px").css("top", top + "px");
                        }
                    });
                }
            };

            wijvectorlayer.prototype._drawLabel = function (placemark, cache) {
                var self = this, mo = self.options.placemark || {}, visibility = LabelVisibility[mo.labelVisibility] || 0 /* hidden */, label = placemark.label || placemark.name;

                if (visibility === 0 /* hidden */ || !label) {
                    return;
                }

                var point = placemark.getViewBounds().location, text = $("<span style='position:absolute;' class='" + vectorMarkLabelCss + "'>" + label + "</span>").appendTo(self._placemarkContainer);

                cache.label = text;
            };

            wijvectorlayer.prototype._arrangeLabels = function (visibility) {
                var self = this, o = self.options, mo = o.placemark || {}, labelBounds = [];
                visibility = visibility || LabelVisibility[mo.labelVisibility] || 0 /* hidden */;

                $.each(self._marks, function (index, cache) {
                    if (cache.label) {
                        var location, rect, overlap = false, len = labelBounds.length, i;

                        location = o.converter.geographicToView(cache.location);
                        location.x -= wijvectorlayer._offsetX;
                        location.y -= wijvectorlayer._offsetY;
                        rect = self._calculateLabelBounds(location, cache.label, cache.labelSize);

                        if (visibility === 1 /* autoHide */) {
                            for (i = 0; i < len; i++) {
                                if (rect.intersectsWith(labelBounds[i])) {
                                    overlap = true;
                                    break;
                                }
                            }
                        }

                        if (overlap) {
                            cache.label.remove();
                        } else {
                            cache.label.css("left", rect.location.x + "px").css("top", rect.location.y + "px");
                            cache.labelSize = rect.size;
                            if (visibility === 1 /* autoHide */) {
                                labelBounds.push(rect);
                            }
                        }
                    }
                });
            };

            wijvectorlayer.prototype._calculateLabelBounds = function (point, text, size) {
                var self = this, mo = self.options.placemark || {}, position = LabelPosition[mo.labelPosition] || 0 /* center */, width = size ? size.width : text.outerWidth(), height = size ? size.height : text.outerHeight(), left, top;

                if (position === 1 /* left */) {
                    left = point.x - width;
                    top = point.y - height / 2;
                } else if (position === 2 /* right */) {
                    left = point.x;
                    top = point.y - height / 2;
                } else if (position === 3 /* top */) {
                    left = point.x - width / 2;
                    top = point.y - height;
                } else if (position === 4 /* bottom */) {
                    left = point.x - width / 2;
                    top = point.y;
                } else {
                    left = point.x - width / 2;
                    top = point.y - height / 2;
                }

                return new maps.Rectangle(new maps.Point(left, top), new maps.Size(width, height));
            };

            wijvectorlayer.prototype._translatePaper = function (dx, dy) {
                var self = this, left = wijvectorlayer._offsetX + dx, top = wijvectorlayer._offsetY + dy;
                self._container.css("left", left + "px").css("top", top + "px");
            };

            wijvectorlayer.prototype._scalePaper = function (sx, sy, dx, dy) {
                var self = this;
                if (Raphael.vml) {
                    self._container.empty();
                    return;
                }

                var viewSize = self.options.converter.getViewSize(), left = wijvectorlayer._offsetX, top = wijvectorlayer._offsetY, cx = viewSize.width / 2 - wijvectorlayer._offsetX, cy = viewSize.height / 2 - wijvectorlayer._offsetY, matrix = Raphael.matrix(1, 0, 0, 1, 0, 0);

                self._container.css("left", left + "px").css("top", top + "px");
                self._arrangeMarks();
                self._arrangeLabels(2 /* visible */);

                matrix.translate(dx, dy);
                matrix.scale(sx, sy, cx, cy);
                self._group.transform(matrix);
            };

            wijvectorlayer.prototype._updateShape = function () {
                var self = this;
                if (!self._cache || self._needFullUpdateShape) {
                    self._fullUpdateShape();
                    return;
                }

                var o = self.options, converter = o.converter, pt1 = converter.geographicToView(o.center), pt2 = converter.geographicToView(self._cache.center), dx = pt2.x - pt1.x, dy = pt2.y - pt1.y;

                if (o.zoom === o.targetZoom) {
                    var clip = wijvectorlayer._clipRect;
                    if (o.zoom !== self._cache.zoom || self._needFullUpdateShape || Math.abs(dx) > 0.4 * clip.size.width || Math.abs(dy) > 0.4 * clip.size.height) {
                        self._fullUpdateShape();
                        return;
                    } else {
                        self._translatePaper(dx, dy);
                    }
                } else {
                    var scale = Math.pow(2, o.zoom) / Math.pow(2, self._cache.zoom);
                    self._scalePaper(scale, scale, dx, dy);
                }

                return;
            };

            wijvectorlayer.prototype._updateVectorObj = function (vector, pc, gclip, minsz2, zoom) {
                var self = this;

                self._updateSingleVectorObj(vector, pc, gclip, minsz2, zoom);

                if (vector && vector.children && vector.children.length > 0) {
                    $.each(vector.children, function (index, child) {
                        self._updateVectorObj(child, pc, gclip, minsz2, zoom);
                    });
                }
            };

            wijvectorlayer.prototype._updateSingleVectorObj = function (vector, pc, gclip, minsz2, zoom) {
                var self = this;
                if (vector.vectorItems) {
                    $.each(vector.vectorItems, function (index, item) {
                        self._updateVectorItem(item, pc, gclip, minsz2, zoom);
                    });
                }
            };

            wijvectorlayer.prototype._updateVectorItem = function (item, pc, gclip, minsz2, zoom) {
                item.visible = false;
                if (!gclip.intersectsWith(item.getBounds()))
                    return;
                item.getViewBounds(pc);
                if (item.isVisible(minsz2, zoom)) {
                    item.visible = true;
                    item.updateShape(pc);
                }
            };

            wijvectorlayer.prototype._fullUpdateShape = function () {
                var self = this, o = self.options, mo = o.placemark || {}, minSize = (o.minSize == null) ? 3 : o.minSize, converter = o.converter, minsz2 = minSize * minSize;

                self._needDrawMarkShape = !(mo.image || mo.render);
                self._needFullUpdateShape = false;

                if (!self._vectorObj)
                    return;

                self._cache = { zoom: o.zoom, center: o.center };

                var pc = function (p) {
                    return self._proj.project(p);
                };

                self._proj.init(o);

                var clip = wijvectorlayer._clipRect, left = clip.location.x, top = clip.location.y, right = left + clip.size.width, bottom = top + clip.size.height, pt1 = converter.viewToGeographic(new maps.Point(left + wijvectorlayer._offsetX, top + wijvectorlayer._offsetY)), pt2 = converter.viewToGeographic(new maps.Point(right + wijvectorlayer._offsetX, bottom + wijvectorlayer._offsetY)), gclip = maps.Utils.getBounds([pt1, pt2]);

                self._updateVectorObj(self._vectorObj, pc, gclip, minsz2, o.zoom);

                self._refreshPaper();
            };

            wijvectorlayer.prototype._onShapeCreated = function (eventName, data) {
                this._trigger(eventName, null, data);
            };

            wijvectorlayer.prototype._onItemMouseEvent = function (eventName, e, target) {
                var self = this;
                if (self._isDisabled())
                    return;

                self._trigger(eventName, e, $(target).data(vectorData));
            };

            /**
            * Force to request the data to get the newest one.
            */
            wijvectorlayer.prototype.refresh = function () {
                var self = this;
                self._data = null;
                this._setData(self.options.data);
            };

            /**
            * Removes the wijvectorlayer functionality completely. This will return the element back to its pre-init state.
            */
            wijvectorlayer.prototype.destroy = function () {
                var self = this;
                if (self._paper)
                    self._paper.remove();
                self._container.off("." + self.widgetName).remove();

                _super.prototype.destroy.call(this);
            };
            wijvectorlayer._offsetX = -2000;

            wijvectorlayer._offsetY = -2000;

            wijvectorlayer._clipRect = new maps.Rectangle(new maps.Point(-wijvectorlayer._offsetX - 1000, -wijvectorlayer._offsetY - 1000), new maps.Size(3000, 3000));
            return wijvectorlayer;
        })(maps.wijlayer);
        maps.wijvectorlayer = wijvectorlayer;

        /** @ignore */
        var GeoObjectType;
        (function (GeoObjectType) {
            GeoObjectType[GeoObjectType["Point"] = 0] = "Point";
            GeoObjectType[GeoObjectType["MultiPoint"] = 1] = "MultiPoint";
            GeoObjectType[GeoObjectType["LineString"] = 2] = "LineString";
            GeoObjectType[GeoObjectType["MultiLineString"] = 3] = "MultiLineString";
            GeoObjectType[GeoObjectType["Polygon"] = 4] = "Polygon";
            GeoObjectType[GeoObjectType["MultiPolygon"] = 5] = "MultiPolygon";
            GeoObjectType[GeoObjectType["GeometryCollection"] = 6] = "GeometryCollection";
            GeoObjectType[GeoObjectType["Feature"] = 7] = "Feature";
            GeoObjectType[GeoObjectType["FeatureCollection"] = 8] = "FeatureCollection";
        })(GeoObjectType || (GeoObjectType = {}));

        

        /** @ignore */
        var VectorItemCollection = (function () {
            function VectorItemCollection() {
                this.type = "VectorCollection";
                this.parent = null;
                this.children = [];
                this.vectorItems = null;
            }
            VectorItemCollection.prototype.applyData = function (data) {
            };

            VectorItemCollection.prototype.addChild = function (child) {
                this.children.push(child);
                child.parent = this;
            };
            return VectorItemCollection;
        })();

        /** @ignore */
        var VectorItemWrapper = (function () {
            function VectorItemWrapper(item) {
                this.item = item;
                this.type = "Vector";
                this.vectorItems = [item];
            }
            VectorItemWrapper.prototype.applyData = function (data) {
                this.data = data;
                this.item.applyData(data);
            };
            return VectorItemWrapper;
        })();

        /** @ignore */
        var GeoObject = (function () {
            function GeoObject() {
                this.type = "Object";
            }
            GeoObject.prototype.applyData = function (data, properties) {
                this.data = data;
                this.properties = properties;
            };

            GeoObject.prototype._addChild = function (child) {
                var self = this;
                self.children = self.children || [];
                self.children.push(child);
                child.parent = self;
            };

            GeoObject.create = function (data) {
                switch (data.type) {
                    case GeoObjectType[0 /* Point */]:
                        return new GeoPoint();
                    case GeoObjectType[1 /* MultiPoint */]:
                        return new GeoMultiPoint();
                    case GeoObjectType[2 /* LineString */]:
                        return new GeoLineString();
                    case GeoObjectType[3 /* MultiLineString */]:
                        return new GeoMultiLineString();
                    case GeoObjectType[4 /* Polygon */]:
                        return new GeoPolygon();
                    case GeoObjectType[5 /* MultiPolygon */]:
                        return new GeoMultiPolygon();
                    case GeoObjectType[6 /* GeometryCollection */]:
                        return new GeoGeometryCollection();
                    case GeoObjectType[7 /* Feature */]:
                        return new GeoFeature();
                    case GeoObjectType[8 /* FeatureCollection */]:
                        return new GeoFeatureCollection();
                }
                return null;
            };
            return GeoObject;
        })();

        /** @ignore */
        var GeoGeometryObject = (function (_super) {
            __extends(GeoGeometryObject, _super);
            function GeoGeometryObject() {
                _super.apply(this, arguments);
                this.type = "Geometry";
            }
            GeoGeometryObject.prototype._createVectorItem = function (type) {
                switch (type) {
                    case 2 /* polygon */:
                        return new VectorPolygon();
                    case 0 /* placemark */:
                        return new VectorPlacemark();
                    case 1 /* polyline */:
                        return new VectorPolyline();
                }

                return null;
            };
            return GeoGeometryObject;
        })(GeoObject);

        /** @ignore */
        var GeoPoint = (function (_super) {
            __extends(GeoPoint, _super);
            function GeoPoint() {
                _super.apply(this, arguments);
                this.type = "Point";
            }
            GeoPoint.prototype.applyData = function (data, properties) {
                var self = this, vector;
                _super.prototype.applyData.call(this, data, properties);
                self.data = data;
                if (data.coordinates) {
                    vector = self._createVectorItem(0 /* placemark */);
                    vector.applyGeoData(data.coordinates, properties);
                    self.vectorItems = [vector];
                }
            };
            return GeoPoint;
        })(GeoGeometryObject);

        /** @ignore */
        var GeoMultiPoint = (function (_super) {
            __extends(GeoMultiPoint, _super);
            function GeoMultiPoint() {
                _super.apply(this, arguments);
                this.type = "MultiPoint";
            }
            GeoMultiPoint.prototype.applyData = function (data, properties) {
                var self = this, vector;
                _super.prototype.applyData.call(this, data, properties);
                self.data = data;
                if (data.coordinates) {
                    self.vectorItems = [];
                    $.each(data.coordinates, function (index, single) {
                        vector = self._createVectorItem(0 /* placemark */);
                        vector.applyGeoData(single, properties);
                        self.vectorItems.push(vector);
                    });
                }
            };
            return GeoMultiPoint;
        })(GeoGeometryObject);

        /** @ignore */
        var GeoLineString = (function (_super) {
            __extends(GeoLineString, _super);
            function GeoLineString() {
                _super.apply(this, arguments);
                this.type = "LineString";
            }
            GeoLineString.prototype.applyData = function (data, properties) {
                var self = this, vector;
                _super.prototype.applyData.call(this, data, properties);
                self.data = data;
                if (data.coordinates) {
                    vector = self._createVectorItem(1 /* polyline */);
                    vector.applyGeoData(data.coordinates, properties);
                    self.vectorItems = [vector];
                }
            };
            return GeoLineString;
        })(GeoGeometryObject);

        /** @ignore */
        var GeoMultiLineString = (function (_super) {
            __extends(GeoMultiLineString, _super);
            function GeoMultiLineString() {
                _super.apply(this, arguments);
                this.type = "MultiLineString";
            }
            GeoMultiLineString.prototype.applyData = function (data, properties) {
                var self = this, vector;
                _super.prototype.applyData.call(this, data, properties);
                self.data = data;
                if (data.coordinates) {
                    self.vectorItems = [];
                    $.each(data.coordinates, function (index, single) {
                        vector = self._createVectorItem(1 /* polyline */);
                        vector.applyGeoData(single, properties);
                        self.vectorItems.push(vector);
                    });
                }
            };
            return GeoMultiLineString;
        })(GeoGeometryObject);

        /** @ignore */
        var GeoPolygon = (function (_super) {
            __extends(GeoPolygon, _super);
            function GeoPolygon() {
                _super.apply(this, arguments);
                this.type = "Polygon";
            }
            GeoPolygon.prototype.applyData = function (data, properties) {
                var self = this, vector;
                _super.prototype.applyData.call(this, data, properties);
                self.data = data;
                if (data.coordinates) {
                    vector = self._createVectorItem(2 /* polygon */);
                    vector.applyGeoData(data.coordinates, properties);
                    self.vectorItems = [vector];
                }
            };
            return GeoPolygon;
        })(GeoGeometryObject);

        /** @ignore */
        var GeoMultiPolygon = (function (_super) {
            __extends(GeoMultiPolygon, _super);
            function GeoMultiPolygon() {
                _super.apply(this, arguments);
                this.type = "MultiPolygon";
            }
            GeoMultiPolygon.prototype.applyData = function (data, properties) {
                var self = this, vector;
                _super.prototype.applyData.call(this, data, properties);
                self.data = data;
                if (data.coordinates) {
                    self.vectorItems = [];
                    $.each(data.coordinates, function (index, single) {
                        vector = self._createVectorItem(2 /* polygon */);
                        vector.applyGeoData(single, properties);
                        self.vectorItems.push(vector);
                    });
                }
            };
            return GeoMultiPolygon;
        })(GeoGeometryObject);

        /** @ignore */
        var GeoGeometryCollection = (function (_super) {
            __extends(GeoGeometryCollection, _super);
            function GeoGeometryCollection() {
                _super.apply(this, arguments);
                this.type = "GeometryCollection";
            }
            GeoGeometryCollection.prototype.applyData = function (data, properties) {
                var self = this, child;
                _super.prototype.applyData.call(this, data, properties);
                if (data.geometries) {
                    $.each(data.geometries, function (index, geometry) {
                        child = GeoObject.create(geometry);
                        child.applyData(geometry, properties);
                        self._addChild(child);
                    });
                }
                self.geometries = self.children;
            };
            return GeoGeometryCollection;
        })(GeoGeometryObject);

        /** @ignore */
        var GeoFeature = (function (_super) {
            __extends(GeoFeature, _super);
            function GeoFeature() {
                _super.apply(this, arguments);
                this.type = "Feature";
            }
            GeoFeature.prototype.applyData = function (data) {
                var self = this, geometry;
                _super.prototype.applyData.call(this, data, data.properties);
                if (data.geometry) {
                    geometry = GeoObject.create(data.geometry);
                    geometry.applyData(data.geometry, data.properties);
                    self._addChild(geometry);
                    self.geometry = geometry;
                }
            };
            return GeoFeature;
        })(GeoObject);

        /** @ignore */
        var GeoFeatureCollection = (function (_super) {
            __extends(GeoFeatureCollection, _super);
            function GeoFeatureCollection() {
                _super.apply(this, arguments);
                this.type = "FeaturesCollectiton";
            }
            GeoFeatureCollection.prototype.applyData = function (data) {
                var self = this, child;
                _super.prototype.applyData.call(this, data, null);
                if (data.features) {
                    $.each(data.features, function (index, feature) {
                        child = GeoObject.create(feature);
                        child.applyData(feature, null);
                        self._addChild(child);
                    });
                }
                self.features = self.children;
            };
            return GeoFeatureCollection;
        })(GeoObject);

        /** @ignore */
        var VectorItem = (function () {
            function VectorItem() {
                /** @ignore */
                this._lod = new LOD();
                this.visible = true;
            }
            //virtual
            VectorItem.prototype.applyData = function (data) {
                this._applyProperties(data);
            };

            VectorItem.prototype.applyGeoData = function (coords, properties) {
                this._applyProperties(properties);
            };

            VectorItem.prototype._applyProperties = function (properties) {
                var self = this;
                if (properties) {
                    self.name = properties["name"];
                    self.fill = properties["fill"];
                    self.fillOpacity = properties["fillOpacity"];
                    self.stroke = properties["stroke"];
                    self.strokeOpacity = properties["strokeOpacity"];
                    self.strokeWidth = properties["strokeWidth"];
                    self.strokeDashArray = properties["strokeDashArray"];
                    self.strokeLineCap = maps.PenLineCap[properties["strokeLineCap"]];
                    self.strokeLineJoin = maps.PenLineJoin[properties["strokeLineJoin"]];
                    self.strokeMiterLimit = properties["strokeMiterLimit"];
                    self._lod = new LOD(properties.lod);
                }
            };

            //virtual
            VectorItem.prototype.getBounds = function () {
                return null;
            };

            //virtual
            VectorItem.prototype.getViewBounds = function (pc) {
                return null;
            };

            VectorItem.prototype.isVisible = function (minsz2, zoom) {
                var s2 = 0, bnds = this.getViewBounds();

                if (!bnds.isEmpty()) {
                    s2 = bnds.size.width * bnds.size.width + bnds.size.height * bnds.size.height;
                }

                var lod = this._lod;
                if (lod && lod.isDefault()) {
                    return s2 >= minsz2;
                } else {
                    var visible = (zoom >= lod.minZoom) && (zoom <= lod.maxZoom);
                    if (visible) {
                        if (lod.maxSize === 0)
                            return s2 >= lod.minSize * lod.minSize;
                        else if (this._lod.minSize === 0)
                            return s2 <= lod.maxSize * lod.maxSize;
                        else
                            return s2 >= lod.minSize * lod.minSize && s2 <= lod.maxSize * lod.maxSize;
                    } else {
                        return false;
                    }
                }
            };

            //virtual
            VectorItem.prototype.getShape = function () {
                return null;
            };

            VectorItem.prototype._initShape = function (shape) {
                var self = this;
                if (self.fill != null)
                    shape.fill = self.fill;
                if (self.fillOpacity != null)
                    shape.fillOpacity = self.fillOpacity;
                if (self.stroke != null)
                    shape.stroke = self.stroke;
                if (self.strokeOpacity != null)
                    shape.strokeOpacity = self.strokeOpacity;
                if (self.strokeWidth != null)
                    shape.strokeWidth = self.strokeWidth;
                if (self.strokeDashArray)
                    shape.strokeDashArray = self.strokeDashArray;
                if (self.strokeLineCap != null)
                    shape.strokeLineCap = self.strokeLineCap;
                if (self.strokeLineJoin)
                    shape.strokeLineJoin = self.strokeLineJoin;
                if (self.strokeMiterLimit)
                    shape.strokeMiterLimit = self.strokeMiterLimit;
            };

            //virtual
            VectorItem.prototype.updateShape = function (pc) {
            };

            VectorItem.convertPoints = function (pts, pc) {
                var filterPts = null;
                if (pts != null) {
                    var len = pts.length, prev = pc(pts[0]);

                    filterPts = [];
                    filterPts.push(prev);
                    for (var i = 1; i < len; i++) {
                        var pt = pc(pts[i]);
                        if (Math.abs(pt.x - prev.x) >= VectorItem.optRad || Math.abs(pt.y - prev.y) >= VectorItem.optRad) {
                            filterPts.push(pt);
                            prev = pt;
                        }
                    }
                }

                return filterPts;
            };

            VectorItem.convertPointsList = function (ptsList, pc) {
                var filterPtsList = null;
                if (ptsList != null && ptsList.length > 0) {
                    filterPtsList = [];
                    $.each(ptsList, function (index, pts) {
                        var filterPts = VectorItem.convertPoints(pts, pc);
                        if (filterPts) {
                            filterPtsList.push(filterPts);
                        }
                    });
                }

                return filterPtsList;
            };
            VectorItem.optRad = 1.5;
            return VectorItem;
        })();
        maps.VectorItem = VectorItem;

        /** @ignore */
        var VectorPlacemark = (function (_super) {
            __extends(VectorPlacemark, _super);
            function VectorPlacemark() {
                _super.apply(this, arguments);
            }
            VectorPlacemark.prototype.applyData = function (data) {
                _super.prototype.applyData.call(this, data);
                if (data.coordinates && data.coordinates.length > 1) {
                    this.point = new maps.Point(data.coordinates[0], data.coordinates[1]);
                }
            };

            VectorPlacemark.prototype.applyGeoData = function (coords, properties) {
                _super.prototype.applyGeoData.call(this, coords, properties);
                this.point = maps.Utils.getPointData(coords);
            };

            VectorPlacemark.prototype._applyProperties = function (properties) {
                var self = this;
                if (properties) {
                    _super.prototype._applyProperties.call(this, properties);
                    self.label = properties["label"];
                }
            };

            VectorPlacemark.prototype.getBounds = function () {
                var self = this;
                return new maps.Rectangle(new maps.Point(self.point.x, self.point.y), new maps.Size(0, 0));
            };

            VectorPlacemark.prototype.getViewBounds = function () {
                return this._bnds;
            };

            VectorPlacemark.prototype.isVisible = function (minsz2, zoom) {
                var lod = this._lod, visible = true;
                if (!lod.isDefault()) {
                    visible = (zoom >= lod.minZoom) && (zoom <= lod.maxZoom);
                }

                return visible;
            };

            VectorPlacemark.prototype.getShape = function () {
                return null;
            };

            VectorPlacemark.prototype.updateShape = function (pc) {
                var self = this, pt = pc(self.point), bnds = new maps.Rectangle(new maps.Point(pt.x, pt.y), new maps.Size(0, 0));
                self._bnds = bnds;
            };
            return VectorPlacemark;
        })(VectorItem);

        /** @ignore */
        var VectorPolyline = (function (_super) {
            __extends(VectorPolyline, _super);
            function VectorPolyline() {
                _super.apply(this, arguments);
            }
            VectorPolyline.prototype.applyData = function (data) {
                var self = this;
                _super.prototype.applyData.call(this, data);
                self.points = maps.Utils.getPoints(data.coordinates);
                self._gbnds = maps.Utils.getBounds(self.points);
            };

            VectorPolyline.prototype.applyGeoData = function (coords, properties) {
                _super.prototype.applyGeoData.call(this, coords, properties);
                var self = this;
                self.points = maps.Utils.getLineData(coords);
                self._gbnds = maps.Utils.getBounds(self.points);
            };

            VectorPolyline.prototype.getBounds = function () {
                return this._gbnds;
            };

            VectorPolyline.prototype.getViewBounds = function (pc) {
                var self = this;

                if (pc) {
                    var pt1 = new maps.Point(self._gbnds.location.x, self._gbnds.location.y);
                    var pt2 = new maps.Point(self._gbnds.getRight(), self._gbnds.getBottom());

                    pt1 = pc(pt1);
                    pt2 = pc(pt2);

                    self._bnds = maps.Utils.getBounds([pt1, pt2]);
                }

                return self._bnds;
            };

            VectorPolyline.prototype.getShape = function () {
                return this._plines;
            };

            VectorPolyline.prototype.updateShape = function (pc) {
                var self = this, clip = wijvectorlayer._clipRect, pts = VectorItem.convertPoints(self.points, pc);

                if (!self._plines) {
                    self._plines = new maps.MultiPolyline();
                    self._initShape(self._plines);
                }

                self._bnds = maps.Utils.getBounds(pts);

                if (self._bnds.size.width > clip.size.width || self._bnds.size.height > clip.size.height) {
                    self._plines.points = maps.ClippingEngine.createClippedLines(pts, clip);
                    self._bnds = self._bnds.intersect(clip);
                } else {
                    self._plines.points = [pts];
                }

                return this._bnds;
            };
            return VectorPolyline;
        })(VectorItem);

        /** @ignore */
        var VectorPolygon = (function (_super) {
            __extends(VectorPolygon, _super);
            function VectorPolygon() {
                _super.apply(this, arguments);
            }
            VectorPolygon.prototype.applyData = function (data) {
                var self = this, geoBounds, bounds;

                _super.prototype.applyData.call(this, data);
                self.pointsList = [maps.Utils.getPoints(data.coordinates)];
                self._gbnds = maps.Utils.getListBounds(self.pointsList);
            };

            VectorPolygon.prototype.applyGeoData = function (coords, properties) {
                var self = this;
                _super.prototype.applyGeoData.call(this, coords, properties);
                self.pointsList = maps.Utils.getPolygonData(coords);
                self._gbnds = maps.Utils.getListBounds(self.pointsList);
            };

            VectorPolygon.prototype.getBounds = function () {
                return this._gbnds;
            };

            VectorPolygon.prototype.getViewBounds = function (pc) {
                var self = this;

                if (pc) {
                    var pt1 = new maps.Point(self._gbnds.location.x, self._gbnds.location.y), pt2 = new maps.Point(this._gbnds.getRight(), this._gbnds.getBottom());

                    pt1 = pc(pt1);
                    pt2 = pc(pt2);

                    self._bnds = maps.Utils.getBounds([pt1, pt2]);
                }

                return self._bnds;
            };

            VectorPolygon.prototype.getShape = function () {
                return this._polygon;
            };

            VectorPolygon.prototype.updateShape = function (pc) {
                var self = this, clip = wijvectorlayer._clipRect, pts = VectorItem.convertPointsList(self.pointsList, pc);

                if (!self._polygon) {
                    self._polygon = new maps.Polygon();
                    self._initShape(self._polygon);
                }

                self._bnds = maps.Utils.getListBounds(pts);

                if (self._bnds.size.width > clip.size.width || self._bnds.size.height > clip.size.height) {
                    pts = maps.ClippingEngine.clipPolygonList(pts, clip);
                    self._bnds = maps.Utils.getListBounds(pts);
                }

                self._polygon.pointsList = pts;
            };
            return VectorPolygon;
        })(VectorItem);

        /**
        * The options of the wijvectorlayer.
        */
        var wijvectorlayer_options = (function (_super) {
            __extends(wijvectorlayer_options, _super);
            function wijvectorlayer_options() {
                _super.apply(this, arguments);
                /**
                * The type of the data object. The vector layer supports the following type:
                * <ul>
                * <li>wijJson: the json object with the C1 format. </li>
                * <li>geoJson: the json object with the GeoJson format.</li>
                * </ul>
                */
                this.dataType = DataJsonType.wijJson;
                /**
                * Specifies minimal size at which vectors become visible. The default value is 3.
                */
                this.minSize = 3;
                /**
                * Customize the rendering of placemark.
                */
                this.placemark = null;
                /**
                * This is a callback function called after the shape of the vector created for rendering.
                * @event
                * @param {jQuery.Event} event A jQuery Event object.
                * @param {IVectorEventData} data The data contains the vector and shape.
                * @dataKey {vector} The vector object which wraps the original data from data source.
                * @dataKey {shape} The set of Raphael elements which will be drawn.
                */
                this.shapeCreated = null;
                /**
                * This is a callback function called when the mouse enter the shape.
                * @event
                * @param {jQuery.Event} event A jQuery Event object.
                * @param {IVectorEventData} data The data contains the vector and shape.
                * @dataKey {vector} The vector object which wraps the original data from data source.
                * @dataKey {shape} The set of Raphael elements which will be drawn.
                */
                this.mouseEnter = null;
                /**
                * This is a callback function called when the mouse leave the shape.
                * @event
                * @param {jQuery.Event} event A jQuery Event object.
                * @param {IVectorEventData} data The data contains the vector and shape.
                * @dataKey {vector} The vector object which wraps the original data from data source.
                * @dataKey {shape} The set of Raphael elements which will be drawn.
                */
                this.mouseLeave = null;
                /**
                * This is a callback function called when click mouse down on the shape.
                * @event
                * @param {jQuery.Event} event A jQuery Event object.
                * @param {IVectorEventData} data The data contains the vector and shape.
                * @dataKey {vector} The vector object which wraps the original data from data source.
                * @dataKey {shape} The set of Raphael elements which will be drawn.
                */
                this.mouseDown = null;
                /**
                * This is a callback function called when click mouse up on the shape.
                * @event
                * @param {jQuery.Event} event A jQuery Event object.
                * @param {IVectorEventData} data The data contains the vector and shape.
                * @dataKey {vector} The vector object which wraps the original data from data source.
                * @dataKey {shape} The set of Raphael elements which will be drawn.
                */
                this.mouseUp = null;
                /**
                * This is a callback function called when move mouse on the shape.
                * @event
                * @param {jQuery.Event} event A jQuery Event object.
                * @param {IVectorEventData} data The data contains the vector and shape.
                * @dataKey {vector} The vector object which wraps the original data from data source.
                * @dataKey {shape} The set of Raphael elements which will be drawn.
                */
                this.mouseMove = null;
                /**
                * This is a callback function called when click mouse on the shape.
                * @event
                * @param {jQuery.Event} event A jQuery Event object.
                * @param {IVectorEventData} data The data contains the vector and shape.
                * @dataKey {vector} The vector object which wraps the original data from data source.
                * @dataKey {shape} The set of Raphael elements which will be drawn.
                */
                this.click = null;
            }
            return wijvectorlayer_options;
        })(maps.wijlayer_options);
        maps.wijvectorlayer_options = wijvectorlayer_options;

        /** @ignore */
        var DataJsonType = (function () {
            function DataJsonType() {
            }
            DataJsonType.wijJson = "wijJson";
            DataJsonType.geoJson = "geoJson";
            return DataJsonType;
        })();

        

        

        

        

        

        

        

        

        

        wijvectorlayer.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijvectorlayer_options());

        $.wijmo.registerWidget("wijvectorlayer", $.wijmo.wijlayer, wijvectorlayer.prototype);
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));


/// <reference path="Drawing.ts"/>
/// <reference path="Utils.ts"/>
/// <reference path="wijlayer.ts"/>
/// <reference path="wijitemslayer.ts" />
/// <reference path="../../Base/jquery.wijmo.widget.ts" />
/// <reference path="../../wijutil/jquery.wijmo.raphael.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (maps) {
        "use strict";

        var $ = jQuery, layerContainerCss = "wijmo-wijmaps-layercontainer";

        /**
        * @widget
        * The virtual layer for the wijmaps.
        * Display its items positioned geographically and only shows the items actually in view.
        */
        var wijvirtuallayer = (function (_super) {
            __extends(wijvirtuallayer, _super);
            function wijvirtuallayer() {
                _super.apply(this, arguments);
                this._maxZoom = 20;
            }
            /** @ignore */
            wijvirtuallayer.prototype._create = function () {
                var self = this;

                self._container = $("<div class=\"" + layerContainerCss + "\"></div>");
                self.element.append(self._container);
                self._paper = self._createPaper(self._container[0], self.options.converter.getViewSize());
                _super.prototype._create.call(this);

                self._setRequest(self.options.request);
            };

            /** @ignore */
            wijvirtuallayer.prototype._setOption = function (key, value) {
                var self = this, o = this.options;
                if (o[key] !== value) {
                    switch (key) {
                        case 'request':
                            self._setRequest(value);
                            return;
                        case 'slices':
                            self._setSlices(value);
                            return;
                    }
                }
                _super.prototype._setOption.call(this, key, value);
            };

            wijvirtuallayer.prototype._setRequest = function (request) {
                var self = this;
                self.options.request = request;
                self._refreshLayer();
            };

            wijvirtuallayer.prototype._setSlices = function (slices) {
                var self = this;
                self.options.slices = slices;
                self._refreshLayer();
            };

            wijvirtuallayer.prototype._refreshLayer = function () {
                var self = this, o = self.options;
                self._slices = self._sortSlices(o.slices);
                self._clear();
                self.update();
            };

            /**
            * @ignore
            * override
            */
            wijvirtuallayer.prototype._render = function () {
                var self = this, o = self.options, slice = self._getMatchedSlice();

                if (slice === null) {
                    self._clear();
                    return;
                }

                self._resizePaper(self._paper, o.converter.getViewSize());

                var index = $.inArray(slice, self._slices), maxZoom = index > 0 ? self._slices[index - 1].zoom : self._maxZoom, logicBounds = self._getLogicBounds(), topLeft = logicBounds.location, bottomRight = new maps.Point(logicBounds.getRight(), logicBounds.getBottom()), currentVisibleRegions = [];

                for (var i = Math.floor(topLeft.x * slice.longitudeSlices); i < bottomRight.x * slice.longitudeSlices; i++) {
                    for (var j = Math.floor(topLeft.y * slice.latitudeSlices); j < bottomRight.y * slice.latitudeSlices; j++) {
                        currentVisibleRegions.push(new maps.Region(slice, i, j));
                    }
                }

                var invisibleRegions = $.grep(self._visibleRegions, function (visibleRegion) {
                    for (var i = 0; i < currentVisibleRegions.length; i++) {
                        if (visibleRegion.equals(currentVisibleRegions[i])) {
                            return false;
                        }
                    }
                    return true;
                });
                $.each(invisibleRegions, function (regionIndex, region) {
                    self._removeRegion(region);
                });

                var newRegions = $.grep(currentVisibleRegions, function (currentVisibleRegion) {
                    for (var i = 0; i < self._visibleRegions.length; i++) {
                        if (currentVisibleRegion.equals(self._visibleRegions[i])) {
                            return false;
                        }
                    }
                    return true;
                });

                var remainVisibleRegions = $.grep(self._visibleRegions, function (region) {
                    return $.inArray(region, invisibleRegions) === -1;
                });

                self._visibleRegions = remainVisibleRegions.concat(newRegions);

                $.each(newRegions, function (regionIndex, region) {
                    var regionLowerLeft = o.converter.logicToGeographic(new maps.Point(region.longitude / slice.longitudeSlices, (region.latitude + 1) / slice.latitudeSlices)), regionUpperRight = o.converter.logicToGeographic(new maps.Point((region.longitude + 1) / slice.longitudeSlices, region.latitude / slice.latitudeSlices)), result = o.request(self._paper, self.options.zoom, maxZoom, regionLowerLeft, regionUpperRight);
                    if (result) {
                        region.items = result.items;
                        if (result.items) {
                            maps.wijitemslayer._setItemsData(result.items);
                        }
                    }
                });

                self._relayout();
            };

            wijvirtuallayer.prototype._relayout = function () {
                var self = this, o = self.options, converter = o.converter;
                maps.wijitemslayer._relayoutRegions(converter, self._visibleRegions);
            };

            wijvirtuallayer.prototype._removeRegion = function (region) {
                if (region.items) {
                    $.each(region.items, function (index, item) {
                        item.elements.remove();
                    });
                }
            };

            wijvirtuallayer.prototype._clear = function () {
                var self = this;
                self._visibleRegions = [];
                if (self._paper) {
                    self._paper.clear();
                }
            };

            wijvirtuallayer.prototype._getMatchedSlice = function () {
                var self = this;
                if (!self._slices)
                    return null;

                var len = self._slices.length, i, slice;
                for (i = 0; i < len; i++) {
                    slice = self._slices[i];
                    if (slice.zoom <= self.options.zoom) {
                        return slice;
                    }
                }

                return null;
            };

            wijvirtuallayer.prototype._sortSlices = function (slices) {
                if (!slices)
                    return [];

                return slices.sort(function (a, b) {
                    return -(a.zoom - b.zoom);
                });
            };

            wijvirtuallayer.prototype._getLogicBounds = function () {
                var self = this, converter = self.options.converter, location = converter.viewToLogic(new maps.Point(0, 0)), size = converter.getLogicSize();
                return new maps.Rectangle(location, size);
            };

            /**
            * Force to request the data to get the newest one.
            */
            wijvirtuallayer.prototype.refresh = function () {
                this._refreshLayer();
                _super.prototype.refresh.call(this);
            };

            /**
            * Removes the wijvirtuallayer functionality completely. This will return the element back to its pre-init state.
            */
            wijvirtuallayer.prototype.destroy = function () {
                var self = this;
                if (self._paper)
                    self._paper.remove();
                self._container.remove();

                _super.prototype.destroy.call(this);
            };
            return wijvirtuallayer;
        })(maps.wijlayer);
        maps.wijvirtuallayer = wijvirtuallayer;

        

        

        

        /**
        * Represents the options for the wijvirtuallayer.
        */
        var wijvirtuallayer_options = (function (_super) {
            __extends(wijvirtuallayer_options, _super);
            function wijvirtuallayer_options() {
                _super.apply(this, arguments);
                /**
                * Specifies how the map is partitioned for virtualization.
                * @remarks Each slice defines a set of regions this virtual layer will get items form when needed.
                * The minimum zoom of a slice is the value value of it's <b>zoom</b> property,
                * while the maximum zoom is the value from the <b>zoom</b> property of the next slice.
                * Each slice divides the map in a uniform grid of regions according to the current projection.
                */
                this.slices = [];
            }
            return wijvirtuallayer_options;
        })(maps.wijlayer_options);
        maps.wijvirtuallayer_options = wijvirtuallayer_options;

        wijvirtuallayer.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijvirtuallayer_options());

        $.wijmo.registerWidget("wijvirtuallayer", wijvirtuallayer.prototype);
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="wijvirtuallayer.ts" />
    ///<reference path="Drawing.ts"/>
    ///<reference path="Utils.ts"/>
    ///<reference path="wijlayer.ts"/>
    /// <reference path="../../Base/jquery.wijmo.widget.ts" />
    /// <reference path="../../wijutil/jquery.wijmo.raphael.ts"/>
    (function (maps) {
        "use strict";

        var $ = jQuery, layerContainerCss = "wijmo-wijmaps-layercontainer";

        

        /**
        * @ignore
        * Defines slice info on specific zoom. Used by virtual layer.
        */
        var MapSlice = (function () {
            /**
            * @param {number} latitudeSlices The number of latitude divisions for this slice.
            * @param {number} longitudeSlices The number of longitude divisions for this slice.
            * @param {number} zoom The minimum zoom of this slice.
            */
            function MapSlice(latitudeSlices, longitudeSlices, zoom) {
                this.latitudeSlices = latitudeSlices;
                this.longitudeSlices = longitudeSlices;
                this.zoom = zoom;
            }
            return MapSlice;
        })();
        maps.MapSlice = MapSlice;

        /** @ignore */
        var Region = (function () {
            function Region(slice, longitude, latitude) {
                this.slice = slice;
                this.longitude = longitude;
                this.latitude = latitude;
            }
            Region.prototype.equals = function (that) {
                var self = this;
                return self.slice === that.slice && self.longitude === that.longitude && self.latitude === that.latitude;
            };
            return Region;
        })();
        maps.Region = Region;

        /**
        * @widget
        * The items layer for the wijmaps. Display its items positioned geographically.
        */
        var wijitemslayer = (function (_super) {
            __extends(wijitemslayer, _super);
            function wijitemslayer() {
                _super.apply(this, arguments);
            }
            /** @ignore */
            wijitemslayer.prototype._create = function () {
                var self = this;

                self._container = $("<div class=\"" + layerContainerCss + "\"></div>");
                self.element.append(self._container);
                self._paper = self._createPaper(self._container[0], self.options.converter.getViewSize());
                _super.prototype._create.call(this);

                self._setRequest(self.options.request);
            };

            /** @ignore */
            wijitemslayer.prototype._setOption = function (key, value) {
                var self = this, o = this.options;
                if (o[key] !== value) {
                    switch (key) {
                        case 'request':
                            self._setRequest(value);
                            return;
                    }
                }
                _super.prototype._setOption.call(this, key, value);
            };

            wijitemslayer.prototype._setRequest = function (request) {
                var self = this;

                self.options.request = request;
                self._clear();
                if (request) {
                    var result = request(self._paper);
                    if (result) {
                        var region = new Region(new MapSlice(1, 1, 0), 0, 0);
                        region.items = result.items;
                        wijitemslayer._setItemsData(result.items);
                        self._visibleRegions = [region];
                    }
                }
                self.update();
            };

            /** @ignore */
            wijitemslayer.prototype._render = function () {
                var self = this, converter = self.options.converter;
                self._resizePaper(self._paper, converter.getViewSize());
                wijitemslayer._relayoutRegions(self.options.converter, self._visibleRegions);
            };

            wijitemslayer.prototype._clear = function () {
                var self = this;
                self._visibleRegions = null;
                if (self._paper) {
                    self._paper.clear();
                }
            };

            /** @ignore */
            wijitemslayer._relayoutRegions = function (converter, regions) {
                if (!regions)
                    return;

                var viewSize = converter.getViewSize(), scale = viewSize.width / converter.getLogicSize().width, center = converter.getLogicCenter(), offsetX = viewSize.width / 2 - center.x * scale, offsetY = viewSize.height / 2 - center.y * scale;

                $.each(regions, function (regionIndex, region) {
                    if (region.items) {
                        $.each(region.items, function (itemIndex, item) {
                            if (item.elements) {
                                var logicLocation = converter.geographicToLogic(item.location), itemLeft = logicLocation.x * scale + offsetX - ((!!item.pinpoint) ? item.pinpoint.x : 0), itemTop = logicLocation.y * scale + offsetY - ((!!item.pinpoint) ? item.pinpoint.y : 0), translate = "t" + itemLeft + "," + itemTop;
                                $.each(item.elements, function (elementIndex, element) {
                                    element.transform(element.data("wijmo-transform") + translate);
                                });
                            }
                        });
                    }
                });
            };

            /** @ignore */
            wijitemslayer._setItemsData = function (items) {
                if (items) {
                    $.each(items, function (itemIndex, item) {
                        if (item.elements) {
                            $.each(item.elements, function (elementIndex, element) {
                                element.data("wijmo-transform", element.transform());
                            });
                        }
                    });
                }
            };

            /**
            * Force to request the data to get the newest one.
            */
            wijitemslayer.prototype.refresh = function () {
                var self = this;
                self._setRequest(self.options.request);

                _super.prototype.refresh.call(this);
            };

            /**
            * Removes the wijitemslayer functionality completely. This will return the element back to its pre-init state.
            */
            wijitemslayer.prototype.destroy = function () {
                var self = this;
                if (self._paper)
                    self._paper.remove();
                self._container.remove();

                _super.prototype.destroy.call(this);
            };
            return wijitemslayer;
        })(maps.wijlayer);
        maps.wijitemslayer = wijitemslayer;

        

        

        

        /**
        * The options of the wijitemslayer.
        */
        var wijitemslayer_options = (function (_super) {
            __extends(wijitemslayer_options, _super);
            function wijitemslayer_options() {
                _super.apply(this, arguments);
            }
            return wijitemslayer_options;
        })(maps.wijlayer_options);
        maps.wijitemslayer_options = wijitemslayer_options;

        wijitemslayer.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijitemslayer_options());

        $.wijmo.registerWidget("wijitemslayer", wijitemslayer.prototype);
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));

/// <reference path="../../wijslider/jquery.wijmo.wijslider.ts" />
/// <reference path="CoordConverter.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (maps) {
        "use strict";
        var $ = jQuery, defSpeed = 0.5, defMinPixels = 20, defMaxPixels = 158, css = {
            layerContainerCss: "wijmo-wijmaps-layercontainer",
            toolsLayerCss: "wijmo-wijmaps-toolslayer",
            panCss: "wijmo-wijmaps-pan",
            panpointCss: "wijmo-wijmaps-panpoint",
            zoomCss: "wijmo-wijmaps-zoomer",
            scaleCss: "wijmo-wijmaps-scaler",
            scaleLableCss: "wijmo-wijmaps-content",
            scaleValueCss: "wijmo-wijmaps-scalervalue"
        };

        /**
        * @widget
        * @ignore
        * The tools layer for wijmaps.
        */
        var wijtoolslayer = (function (_super) {
            __extends(wijtoolslayer, _super);
            function wijtoolslayer() {
                _super.apply(this, arguments);
            }
            /** @ignore */
            wijtoolslayer.prototype._create = function () {
                var self = this;
                self.element.addClass(css.toolsLayerCss);

                self._on(self.element, {
                    "dblclick": function (event, data) {
                        event.stopPropagation();
                    }
                });

                self._speed = defSpeed;
                self._isPanning = false;
                self._createPanPanel();
                self._createZoomPanel();
                self._createScalePanel();
            };

            wijtoolslayer.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._handleDisabledOption(true);
            };

            wijtoolslayer.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._handleDisabledOption(false);
            };

            wijtoolslayer.prototype._handleDisabledOption = function (disabled) {
                var self = this, options = { disabled: disabled };

                if (self._zoomSlider) {
                    self._zoomSlider.wijslider(options);
                }
            };

            /** @ignore */
            wijtoolslayer.prototype._setOption = function (key, value) {
                var self = this, o = this.options;
                if (o[key] !== value) {
                    switch (key) {
                        case 'center':
                            self._setCenter(value);
                            return;
                        case 'zoom':
                            self._setZoom(value);
                            return;
                    }
                }
                _super.prototype._setOption.call(this, key, value);
            };

            wijtoolslayer.prototype._setCenter = function (center) {
                var self = this, o = self.options;
                o.center = center;
                self._updateScalePanel();
            };

            wijtoolslayer.prototype._setZoom = function (zoom) {
                var self = this, o = self.options;
                o.zoom = zoom;
                self._zoomSlider.wijslider({ orientation: "vertical", range: false, min: o.minZoom, max: o.maxZoom, step: 1, value: o.zoom, values: null });
                self._updateScalePanel();
            };

            wijtoolslayer.prototype._createPanPanel = function () {
                var self = this, o = self.options, e = self.element, offsetX, offsetY, leftArrow, rightArrow, upArrow, downArrow, hOffset, vOffset;

                self._panPanel = $("<div class=\"" + css.panCss + " " + o.wijCSS.stateDefault + "\"></div>").appendTo(e);
                self._on(self._panPanel, {
                    "mousedown": function (event, data) {
                        self._isPanning = true;
                        self._startPanning(self._panPanel, self._getPanPointOffset(self._panPanel, new maps.Point(event.pageX, event.pageY)));
                        $(document).disableSelection();
                        event.stopPropagation();
                    },
                    "dragstart": function (event, data) {
                        //prevent image being dragged in firefox.
                        event.preventDefault();
                    },
                    "selectstart": function (event, data) {
                        //prevent image is selected in ie.
                        event.preventDefault();
                    }
                });

                self._on($(document), {
                    "mouseup": function (event, data) {
                        self._isPanning = false;
                        self._stopPanning();
                        $(document).enableSelection();
                    },
                    "mousemove": function (event, data) {
                        if (self._isPanning) {
                            self._startPanning(self._panPanel, self._getPanPointOffset(self._panPanel, new maps.Point(event.pageX, event.pageY)));
                        }
                    }
                });

                self._panPoint = $("<div class=\"" + css.panpointCss + " " + o.wijCSS.content + " " + o.wijCSS.stateActive + "\"></div>").hide().appendTo(e);

                leftArrow = $("<div class=\"" + o.wijCSS.icon + " " + o.wijCSS.iconArrowLeft + "\"></div>");
                rightArrow = $("<div class=\"" + o.wijCSS.icon + " " + o.wijCSS.iconArrowRight + "\"></div>");
                upArrow = $("<div class=\"" + o.wijCSS.icon + " " + o.wijCSS.iconArrowUp + "\"></div>");
                downArrow = $("<div class=\"" + o.wijCSS.icon + " " + o.wijCSS.iconArrowDown + "\"></div>");

                self._panPanel.append(leftArrow, rightArrow, upArrow, downArrow);
            };

            wijtoolslayer.prototype._getPanPointOffset = function (panPanel, panPoint) {
                var panPanelOffset = panPanel.offset();
                return panPoint.offset(-panPanelOffset.left, -panPanelOffset.top);
            };

            wijtoolslayer.prototype._startPanning = function (target, position) {
                var self = this, o = self.options, viewCenter = o.converter.getViewCenter(), panPanelCenter = new maps.Point(target.outerWidth() / 2, target.outerHeight() / 2), panOffset = position.offset(-panPanelCenter.x, -panPanelCenter.y), length = Math.sqrt(Math.pow(panOffset.x, 2) + Math.pow(panOffset.y, 2)), panPointPosition = new maps.Point(position.x, position.y), newCenter;

                if (self._panningTimer) {
                    clearInterval(self._panningTimer);
                }
                self._panningTimer = setInterval(function () {
                    newCenter = o.converter.viewToGeographic(new maps.Point(panOffset.scale(self._speed, self._speed)).offset(viewCenter.x, viewCenter.y));
                    self._trigger("targetCenterChanged", null, { "targetCenter": newCenter });
                }, 20);

                if (length > panPanelCenter.x) {
                    panPointPosition = panPanelCenter.scale(panOffset.x / length, panOffset.y / length).offset(panPanelCenter.x, panPanelCenter.y);
                }
                panPointPosition = panPointPosition.offset(target.position().left, target.position().top);
                self._panPoint.css("left", panPointPosition.x - self._panPoint.width() / 2).css("top", panPointPosition.y - self._panPoint.height() / 2).show();
            };

            wijtoolslayer.prototype._stopPanning = function () {
                var self = this;
                if (self._panningTimer) {
                    clearInterval(self._panningTimer);
                }
                self._panPoint.hide();
            };

            wijtoolslayer.prototype._createZoomPanel = function () {
                var self = this, o = self.options, e = self.element;
                self._zoomSlider = $("<div></div>").css("height", "100%").css("font-size", "13px"); // need refactor. set it to 13px to make the sliding block align center.
                self._zoomPanel = $("<div class=\"" + css.zoomCss + "\"></div>").append(self._zoomSlider);
                e.append(self._zoomPanel);
                self._zoomSlider.wijslider({ orientation: "vertical", range: false, min: o.minZoom, max: o.maxZoom, step: 1, value: o.zoom, values: null });

                self._on(self._zoomPanel, {
                    "mousedown": function (event, data) {
                        event.stopPropagation();
                    }
                });
                self._on(true, self._zoomPanel, {
                    "wijsliderchange": function (event, data) {
                        self._trigger("targetZoomChanged", null, { "targetZoom": data.value });
                    }
                });
            };

            wijtoolslayer.prototype._createScalePanel = function () {
                var self = this, o = self.options, e = self.element;
                self._scalePanel = $("<div class=\"" + css.scaleCss + " " + o.wijCSS.content + "\"></div>").appendTo(e);
                self._on(self._scalePanel, {
                    "mousedown": function (event, data) {
                        event.stopPropagation();
                    },
                    "dblclick": function (event, data) {
                        event.stopPropagation();
                    }
                });

                self._metersLabel = $("<span class=\"" + css.scaleLableCss + "\"></span>");
                self._milesLabel = $("<span class=\"" + css.scaleLableCss + "\"></span>");
                self._metersValue = $("<span class=\"" + css.scaleValueCss + " " + o.wijCSS.stateDefault + "\"></span>");
                self._milesValue = $("<span class=\"" + css.scaleValueCss + " " + o.wijCSS.stateDefault + "\"></span>");

                self._scalePanel.append(self._metersLabel, self._metersValue, $("<br />"), self._milesLabel, self._milesValue);
                self._updateScalePanel();
            };

            wijtoolslayer.prototype._updateScalePanel = function () {
                var self = this;
                self._updateScale(self._metersValue, self._metersLabel, 1, 1000, "km", "m");
                self._updateScale(self._milesValue, self._milesLabel, 3.2808399, 5280, "mi", "ft");
            };

            wijtoolslayer.prototype._updateScale = function (scale, label, meterToUnit, largeToSmall, largeUnit, unit) {
                if (scale) {
                    var self = this, o = self.options, minPixels = defMinPixels, maxPixels = defMaxPixels, minDistance = self._getDistance(minPixels) * meterToUnit, maxDistance = self._getDistance(maxPixels) * meterToUnit;

                    var roundest = self._roundest(Math.floor(minDistance), Math.floor(maxDistance));
                    if (roundest.toString().length <= Math.ceil(Math.LOG10E * Math.log(largeToSmall))) {
                        if (label)
                            label.text(roundest + " " + unit);
                    } else {
                        minDistance /= largeToSmall;
                        maxDistance /= largeToSmall;
                        roundest = self._roundest(Math.floor(minDistance), Math.floor(maxDistance));
                        if (label)
                            label.text(roundest + " " + largeUnit);
                    }
                }

                var alpha = (roundest - minDistance) * 1.0 / (maxDistance - minDistance);
                scale.width(Math.max(minPixels * (1 - alpha) + maxPixels * alpha, 0));
            };

            // returns the distance in meters from the center of the map to a point 'pixels' pixels to the right
            wijtoolslayer.prototype._getDistance = function (pixels) {
                var self = this, o = self.options;
                return o.converter.distance(o.center, o.converter.viewToGeographic(new maps.Point(o.converter.getViewCenter()).offset(o.center.x < 0 ? pixels : -pixels, 0)));
            };

            // returns the largest number with more trailing zeros between min and max
            wijtoolslayer.prototype._roundest = function (min, max) {
                var self = this, maxs = max.toString(), mins = min.toString();

                for (var i = 0; i < maxs.length; ++i) {
                    if (maxs.length > mins.length || maxs[i] != mins[i]) {
                        return parseInt(self._padRight(maxs.substring(0, i + 1), maxs.length, '0'));
                    }
                }
                return max;
            };

            wijtoolslayer.prototype._padRight = function (str, totalWidth, paddingChar) {
                if (str.length < totalWidth) {
                    var i, paddingString = new String();
                    for (i = 1; i <= (totalWidth - str.length); i++) {
                        paddingString += paddingChar;
                    }
                    return (str + paddingString);
                } else {
                    return str;
                }
            };

            /**
            * Removes the wijtoolslayer functionality completely. This will return the element back to its pre-init state.
            */
            wijtoolslayer.prototype.destroy = function () {
                var self = this;
                $(document).off("." + self.widgetName);
                self._panPanel.remove();
                self._zoomSlider.wijslider("destroy").remove();
                self._panPanel.off("." + self.widgetName).remove();
                self._zoomPanel.off("." + self.widgetName).remove();
                self._scalePanel.off("." + self.widgetName).remove();
                self.element.removeClass(css.toolsLayerCss).off("." + self.widgetName);
                _super.prototype.destroy.call(this);
            };
            return wijtoolslayer;
        })(wijmo.wijmoWidget);
        maps.wijtoolslayer = wijtoolslayer;

        /**
        * @ignore
        * The options for wijtoolslayer.
        */
        var wijtoolslayer_options = (function () {
            function wijtoolslayer_options() {
            }
            return wijtoolslayer_options;
        })();
        maps.wijtoolslayer_options = wijtoolslayer_options;

        wijtoolslayer.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijtoolslayer_options());

        $.wijmo.registerWidget("wijtoolslayer", wijtoolslayer.prototype);
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /// <reference path="mapsources.ts" />
    /// <reference path="drawing.ts" />
    /// <reference path="../../Base/jquery.wijmo.widget.ts" />
    (function (maps) {
        "use strict";
        var $ = jQuery, tileCss = "wijmo-wijmaps-tile";

        /**
        * @widget
        * The tile layer for wijmaps. Draw the map tiles.
        */
        var wijmultiscaleimage = (function (_super) {
            __extends(wijmultiscaleimage, _super);
            function wijmultiscaleimage() {
                _super.apply(this, arguments);
            }
            /** @ignore */
            wijmultiscaleimage.prototype._create = function () {
                var self = this, o = self.options;
                self._tileItems = {};
                self._tileScale = self._getTileScale(Math.round(o.zoom), o.zoom);
                self._renderTiles();
            };

            /** @ignore */
            wijmultiscaleimage.prototype._setOption = function (key, value) {
                var self = this, o = self.options;
                if (o[key] !== value) {
                    switch (key) {
                        case 'center':
                            self._setCenter(value);
                            return;
                        case 'zoom':
                            self._setZoom(value);
                            return;
                        case 'source':
                            self._setSource(value);
                            return;
                    }
                }
                _super.prototype._setOption.call(this, key, value);
            };

            wijmultiscaleimage.prototype._setCenter = function (center) {
                var self = this, o = self.options, offset = new maps.Size(center.x - o.center.x, center.y - o.center.y);

                self._offsetTiles(offset);
                o.center = center;
                self._renderTiles();
            };

            wijmultiscaleimage.prototype._setZoom = function (zoom) {
                var self = this, o = self.options, oldZoom = o.zoom, curZoom, roundZoom;
                if (zoom >= o.source.minZoom && zoom <= o.source.maxZoom) {
                    self._tileScale = self._getTileScale(Math.round(zoom), zoom);

                    //scale old tiles to target zoom.
                    self._scaleTiles(self._getTileScale(oldZoom, zoom));

                    //render new tiles by target zoom.
                    o.zoom = zoom;
                    setTimeout(function () {
                        self._renderTiles();
                    }, 10); //make the zooming more smooth.
                }
            };

            wijmultiscaleimage.prototype._setSource = function (source) {
                var self = this, o = self.options;
                o.source = source;
                $.each(self._tileItems, function (key, val) {
                    val.img.remove();
                    delete self._tileItems[key];
                });
                self._renderTiles();
            };

            wijmultiscaleimage.prototype._offsetTiles = function (offset) {
                var self = this, fullSize = self._getViewFullSize();
                $.each(self._tileItems, function (key, val) {
                    val.bounds.location = new maps.Point(val.bounds.location).offset(-offset.width * fullSize.width, -offset.height * fullSize.height);
                    val.img.css("left", val.bounds.location.x).css("top", val.bounds.location.y);
                });
            };

            wijmultiscaleimage.prototype._getTileScale = function (baseZoom, targetZoom) {
                return Math.pow(2, targetZoom - baseZoom);
            };

            wijmultiscaleimage.prototype._scaleTiles = function (scale) {
                var self = this, viewSize = self._getViewSize(), viewRect = new maps.Rectangle(new maps.Point(0, 0), viewSize);
                $.each(self._tileItems, function (key, val) {
                    val.bounds.location.x = viewSize.width / 2 - (viewSize.width / 2 - val.bounds.location.x) * scale;
                    val.bounds.location.y = viewSize.height / 2 - (viewSize.height / 2 - val.bounds.location.y) * scale;
                    val.bounds.size = new maps.Size(val.bounds.size).scale(scale, scale);

                    if (viewRect.intersect(val.bounds)) {
                        val.img.css("left", val.bounds.location.x).css("top", val.bounds.location.y).css("width", val.bounds.size.width).css("height", val.bounds.size.height);
                    } else {
                        val.img.remove();
                        delete self._tileItems[key];
                    }
                });
            };

            wijmultiscaleimage.prototype._renderTiles = function () {
                var self = this, o = self.options, baseZoom = Math.round(o.zoom), leftTopTileItem = self._getLeftTopTileItem(), viewSize = self._getViewSize(), tileSize = self._getTileSize(), maxTileCount = self._getMaxTileCount(o.zoom), maxHorizontalTileCount = maxTileCount - leftTopTileItem.columnIndex, maxVerticalTileCount = maxTileCount - leftTopTileItem.rowIndex, horizontalTileCount = Math.min(maxHorizontalTileCount, Math.ceil((viewSize.width - leftTopTileItem.bounds.location.x) / tileSize.width)), verticalTileCount = Math.min(maxVerticalTileCount, Math.ceil((viewSize.height - leftTopTileItem.bounds.location.y) / tileSize.height)), left, top, rowIndex, columnIndex, tile, oldTiles = $.extend({}, self._tileItems), preLoadTiles = [];

                for (rowIndex = leftTopTileItem.rowIndex; rowIndex < leftTopTileItem.rowIndex + verticalTileCount; rowIndex++) {
                    for (columnIndex = leftTopTileItem.columnIndex; columnIndex < leftTopTileItem.columnIndex + horizontalTileCount; columnIndex++) {
                        left = leftTopTileItem.bounds.location.x + tileSize.width * (columnIndex - leftTopTileItem.columnIndex);
                        top = leftTopTileItem.bounds.location.y + tileSize.height * (rowIndex - leftTopTileItem.rowIndex);
                        tile = new TileItem(columnIndex, rowIndex, new maps.Rectangle(new maps.Point(left, top), new maps.Size(tileSize.width, tileSize.height)), baseZoom);
                        self._renderTile(tile, baseZoom, oldTiles, preLoadTiles);
                    }
                }
            };

            wijmultiscaleimage.prototype._renderTile = function (tile, baseZoom, oldTiles, preLoadTiles) {
                var self = this, o = self.options, location = tile.bounds.location, size = tile.bounds.size, style, tileUrl, oldTile, img, tileItemKey = "tile_" + tile.columnIndex + "_" + tile.rowIndex + "_" + tile.zoomLevel;

                if (!self._tileItems[tileItemKey]) {
                    self._tileItems[tileItemKey] = tile;
                    tileUrl = o.source.getUrl(tile.zoomLevel, tile.columnIndex, tile.rowIndex);
                    style = "left:" + location.x + "px; top:" + location.y + "px; width:" + size.width + "px; height:" + size.height + "px; display:none";
                    tile.img = $("<img class=\"" + tileCss + "\" style=\"" + style + "\" src=\"" + tileUrl + "\"></img>");
                    preLoadTiles.push(tileItemKey);
                    tile.img.one("load.wijmultiscaleimage", function (event, data) {
                        self._onTileLoad(tile.img, tileItemKey, baseZoom, oldTiles, preLoadTiles);
                    });
                    self.element.append(tile.img);
                } else {
                    oldTile = self._tileItems[tileItemKey];
                    oldTile.bounds = tile.bounds;
                    oldTile.img.css("left", location.x).css("top", location.y).css("width", size.width).css("height", size.height);
                    self.element.append(oldTile.img);
                }
            };

            wijmultiscaleimage.prototype._onTileLoad = function (tileImg, tileItemKey, baseZoom, oldTiles, preLoadTiles) {
                var self = this, o = self.options;
                tileImg.fadeIn(600, function () {
                    preLoadTiles.splice($.inArray(tileItemKey, preLoadTiles), 1);
                    if (preLoadTiles.length == 0) {
                        $.each(oldTiles, function (key, val) {
                            if (self._isUselessTile(val, baseZoom)) {
                                val.img.remove();

                                // need refactor. sometimes the remove method has no effect.
                                if ($("img[src='" + val.img.attr("src") + "']").length == 0) {
                                    delete oldTiles[key];
                                    delete self._tileItems[key];
                                }
                            }
                        });
                    }
                });
            };

            wijmultiscaleimage.prototype._isUselessTile = function (tile, baseZoom) {
                var self = this, o = self.options, curBaseZoom = Math.round(o.zoom), viewRect = new maps.Rectangle(maps.Point.empty, self._getViewSize()), intersectRect = viewRect.intersect(tile.bounds);

                if (tile.zoomLevel === baseZoom || tile.zoomLevel === curBaseZoom) {
                    return !intersectRect;
                }
                return true;
            };

            wijmultiscaleimage.prototype._isPointInRect = function (p, rect) {
                return p.x >= rect.location.x && p.x <= rect.location.x + rect.size.width && p.y >= rect.location.y && p.y <= rect.location.y + rect.size.height;
            };

            wijmultiscaleimage.prototype._getLeftTopTileItem = function () {
                var self = this, o = self.options, maxTileCount = self._getMaxTileCount(o.zoom), centerTileLocation = new maps.Point(o.center).scale(maxTileCount, maxTileCount), tileSize = self._getTileSize(), viewSize = self._getViewSize(), tileRowIndex = Math.floor(centerTileLocation.y), tileColumnIndex = Math.floor(centerTileLocation.x), tilePosition = self._getViewCenter().offset(-(centerTileLocation.x % 1) * tileSize.width, -(centerTileLocation.y % 1) * tileSize.height);

                while (tileColumnIndex > 0 && tilePosition.x > 0) {
                    tileColumnIndex -= 1;
                    tilePosition.x -= tileSize.width;
                }
                while (tileRowIndex > 0 && tilePosition.y > 0) {
                    tileRowIndex -= 1;
                    tilePosition.y -= tileSize.height;
                }

                return new TileItem(tileColumnIndex, tileRowIndex, new maps.Rectangle(tilePosition, tileSize), Math.round(o.zoom));
            };

            wijmultiscaleimage.prototype._getTileSize = function () {
                var self = this, o = self.options;
                return new maps.Size(o.source.tileWidth, o.source.tileHeight).scale(self._tileScale, self._tileScale);
            };

            wijmultiscaleimage.prototype._getMaxTileCount = function (zoom) {
                return Math.pow(2, Math.round(zoom));
            };

            wijmultiscaleimage.prototype._getViewSize = function () {
                var self = this;
                return new maps.Size(self.element.width(), self.element.height());
            };

            wijmultiscaleimage.prototype._getViewCenter = function () {
                var self = this, viewSize = self._getViewSize();
                return new maps.Point(viewSize.width / 2, viewSize.height / 2);
            };

            wijmultiscaleimage.prototype._getViewFullSize = function () {
                var self = this, o = self.options, scaledTileCount = Math.pow(2, o.zoom);
                return new maps.Size(o.source.tileWidth, o.source.tileHeight).scale(scaledTileCount, scaledTileCount);
            };

            /**
            * Removes the wijmultiscaleimage functionality completely. This will return the element back to its pre-init state.
            */
            wijmultiscaleimage.prototype.destroy = function () {
                this.element.children().remove();
                _super.prototype.destroy.call(this);
            };
            return wijmultiscaleimage;
        })(wijmo.wijmoWidget);
        maps.wijmultiscaleimage = wijmultiscaleimage;

        /** @ignore */
        var TileItem = (function () {
            function TileItem(columnIndex, rowIndex, bounds, zoomLevel, img) {
                this.columnIndex = columnIndex;
                this.rowIndex = rowIndex;
                this.bounds = bounds;
                this.zoomLevel = zoomLevel;
                this.img = img;
            }
            return TileItem;
        })();

        /**
        * The options of wijmultiscaleimage.
        */
        var wijmultiscaleimage_options = (function () {
            function wijmultiscaleimage_options() {
                /**
                * The current center of the layer, in geographic unit.
                */
                this.center = new maps.Point(0, 0);
                /**
                * The current zoom level of the layer.
                */
                this.zoom = 3;
            }
            return wijmultiscaleimage_options;
        })();
        maps.wijmultiscaleimage_options = wijmultiscaleimage_options;

        wijmultiscaleimage.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijmultiscaleimage_options());

        $.wijmo.registerWidget("wijmultiscaleimage", wijmultiscaleimage.prototype);
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));

/// <reference path="MapSources.ts" />
/// <reference path="wijlayer.ts" />
/// <reference path="CoordConverter.ts" />
/// <reference path="../../Base/jquery.wijmo.widget.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var wijmo;
(function (wijmo) {
    (function (maps) {
        "use strict";
        var $ = jQuery, defMinZoom = 1, defMaxZoom = 20, defTileWidth = 256, defTileHeight = 256, wijmapsCss = "wijmo-wijmaps", containerCss = "wijmo-wijmaps-container", tilesContainerCss = "wijmo-wijmaps-tileslayer", layerContainerCss = "wijmo-wijmaps-layercontainer";

        /** @widget */
        var wijmaps = (function (_super) {
            __extends(wijmaps, _super);
            function wijmaps() {
                _super.apply(this, arguments);
            }
            /** @ignore */
            wijmaps.prototype._create = function () {
                var self = this, o = self.options;
                self._setInnerSource(o.source, function () {
                    self._createMaps();
                });
                _super.prototype._create.call(this);
            };

            wijmaps.prototype._createMaps = function () {
                var self = this, e = self.element, o = self.options, offsetX, offsetY, targetZoom, targetCenter, leftTopGeographicCoord, rightBottomGeographicCoord;
                e.addClass(wijmapsCss);
                e.addClass(o.wijCSS.content);
                e.attr("tabindex", -1);

                self._isPanning = false;
                self._isZooming = false;
                self._isCenterChanging = false;
                self._keyCode = wijmo.getKeyCodeEnum();

                if (self._innerSource) {
                    self._minZoom = self._innerSource.minZoom;
                    self._maxZoom = self._innerSource.maxZoom;
                    self._coordConverter = new maps.CoordConverter(e, new maps.Point(o.center.x, o.center.y), o.zoom, self._innerSource.tileWidth, self._innerSource.tileHeight);
                } else {
                    self._minZoom = defMinZoom;
                    self._maxZoom = defMaxZoom;
                    self._coordConverter = new maps.CoordConverter(e, new maps.Point(o.center.x, o.center.y), o.zoom, defTileWidth, defTileHeight);
                }

                if (!o.targetCenter) {
                    o.targetCenter = $.extend({}, o.center);
                }

                if (o.targetZoom === undefined) {
                    o.targetZoom = o.zoom;
                }

                self._createLayers();

                if (o.targetZoom !== o.zoom) {
                    targetZoom = o.targetZoom;
                    o.targetZoom = o.zoom;
                    self._setTargetZoom(targetZoom);
                }

                if (o.targetCenter.x !== o.center.x || o.targetCenter.y !== o.center.y) {
                    targetCenter = o.targetCenter;
                    o.targetCenter = o.center;
                    self._setTargetCenter(targetCenter);
                }

                self._on(e, {
                    "dragstart": function (event, data) {
                        //prevent image being dragged in firefox.
                        event.preventDefault();
                    },
                    "selectstart": function (event, data) {
                        //prevent image is selected in ie.
                        event.preventDefault();
                    },
                    "mousewheel": function (event, data) {
                        var position = new maps.Point(event.pageX - e.offset().left, event.pageY - e.offset().top);
                        if (data > 0) {
                            self._zoomIn(position);
                        } else {
                            self._zoomOut(position);
                        }
                        event.preventDefault();
                    },
                    "dblclick": function (event, data) {
                        var position = new maps.Point(event.pageX - e.offset().left, event.pageY - e.offset().top);
                        self._zoomIn(position);
                    },
                    "mousedown": function (event, data) {
                        e.focus();
                        self._isPanning = true;
                        self._panningStartPosition = new maps.Point(event.pageX, event.pageY);
                        $(document).disableSelection();
                    },
                    "keydown": function (event, data) {
                        if (self._onKeyDown(event)) {
                            event.preventDefault();
                        }
                    },
                    "keypress": function (event, data) {
                        if (self._onKeyPress(event)) {
                            event.preventDefault();
                        }
                    }
                });

                self._on($(document), {
                    "mouseup": function (event, data) {
                        self._isPanning = false;
                        $(document).enableSelection();
                    },
                    "mousemove": function (event, data) {
                        if (self._isPanning) {
                            offsetX = self._panningStartPosition.x - event.pageX;
                            offsetY = self._panningStartPosition.y - event.pageY;
                            self._panningStartPosition = new maps.Point(event.pageX, event.pageY);
                            self._panning(offsetX, offsetY);
                        }
                    }
                });
            };

            wijmaps.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._handleDisabledOption(true);
            };

            wijmaps.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._handleDisabledOption(false);
            };

            wijmaps.prototype._handleDisabledOption = function (disabled) {
                var self = this, o = self.options, layers = self._layers, options = { disabled: disabled };

                if (layers) {
                    $.each(layers, function (key, item) {
                        item.element[item.wijname](options);
                    });
                }

                if (self._innerSource) {
                    self._multiScaleImageContainer.wijmultiscaleimage(options);
                }

                if (o.showTools) {
                    self._toolsLayerContainer.wijtoolslayer(options);
                }

                if (disabled) {
                    self._disabledCover.show();
                } else {
                    self._disabledCover.hide();
                }
            };

            /** @ignore */
            wijmaps.prototype._setOption = function (key, value) {
                var self = this, o = this.options;
                if (o[key] !== value) {
                    switch (key) {
                        case 'center':
                            self._setCenter(value);
                            return;
                        case 'targetCenter':
                            self._setTargetCenter(value);
                            return;
                        case 'zoom':
                            self._setZoom(value);
                            return;
                        case 'targetZoom':
                            self._setTargetZoom(value);
                            return;
                        case 'layers':
                            self._setLayers(value);
                            return;
                        case 'showTools':
                            self._setShowTools(value);
                            return;
                        case 'source':
                            self._setSource(value);
                            return;
                    }
                }
                _super.prototype._setOption.call(this, key, value);
            };

            wijmaps.prototype._setInnerSource = function (source, callback) {
                var self = this, o = self.options, isBingMapsSource;

                switch (source) {
                    case "bingMapsRoadSource":
                        self._innerSource = maps.MapSource.bingMapsRoadSource;
                        isBingMapsSource = true;
                        break;
                    case "bingMapsAerialSource":
                        self._innerSource = maps.MapSource.bingMapsAerialSource;
                        isBingMapsSource = true;
                        break;
                    case "bingMapsHybridSource":
                        self._innerSource = maps.MapSource.bingMapsHybridSource;
                        isBingMapsSource = true;
                        break;
                    default:
                        self._innerSource = source;
                        isBingMapsSource = false;
                        break;
                }

                if (isBingMapsSource && o.bingMapsKey && o.bingMapsKey !== "") {
                    $.ajax({
                        url: "http://dev.virtualearth.net/webservices/v1/LoggingService/LoggingService.svc/Log?entry=0&auth=" + o.bingMapsKey + "&fmt=1&type=3&group=wijmo&name=wijmaps&mkt=en-us&jsonp=?",
                        data: null,
                        context: null,
                        success: function (result) {
                            self._authenticationResult = result ? result["authenticationResultCode"] : "";
                            self._sessionId = result ? result["sessionId"] : "";
                            callback();
                        },
                        error: function (result) {
                            // authentication failed.
                            callback();
                        },
                        dataType: "json",
                        timeout: 5000
                    });
                } else {
                    callback();
                }
            };

            wijmaps.prototype._setShowTools = function (showTools) {
                var self = this, o = self.options;

                o.showTools = showTools;
                if (showTools) {
                    self._createToolsLayer();
                } else {
                    self._destroyToolsLayer();
                }
            };

            wijmaps.prototype._setSource = function (source) {
                var self = this, o = self.options;
                o.source = source;
                self._setInnerSource(source, function () {
                    self._refreshTileLayer();
                });
            };

            wijmaps.prototype._refreshTileLayer = function () {
                var self = this;
                self._destroyTileLayer();
                if (self._innerSource) {
                    self._minZoom = self._innerSource.minZoom;
                    self._maxZoom = self._innerSource.maxZoom;
                    self._coordConverter.tileWidth = self._innerSource.tileWidth;
                    self._coordConverter.tileHeight = self._innerSource.tileHeight;
                    self._createMultiScaleImageLayer();
                } else {
                    self._minZoom = defMinZoom;
                    self._maxZoom = defMaxZoom;
                    self._coordConverter.tileWidth = defTileWidth;
                    self._coordConverter.tileHeight = defTileHeight;
                }
            };

            wijmaps.prototype._setLayers = function (layers) {
                var self = this;
                self.options.layers = layers;
                self._destroyInnerLayers();
                self._createInnerLayers();
            };

            wijmaps.prototype._setCenter = function (center) {
                var self = this;
                self.options.targetCenter = center;
                self._trigger("targetCenterChanged", null, { "targetCenter": center });
                self._setCenterInternal(new maps.Point(center.x, center.y));
            };

            wijmaps.prototype._setCenterInternal = function (center) {
                var self = this, o = self.options;
                o.center = { "x": center.x, "y": center.y };
                self._coordConverter.center = center;
                self._updateLayers();
                self._trigger("centerChanged", null, { "center": o.center });
            };

            wijmaps.prototype._setZoom = function (zoom, position) {
                var self = this, o = self.options;
                if (zoom !== o.zoom && zoom >= self._minZoom && zoom <= self._maxZoom) {
                    self.options.targetZoom = zoom;
                    self._trigger("targetZoomChanged", null, { "targetZoom": zoom });
                    self._setZoomInternal(zoom, position);
                }
            };

            wijmaps.prototype._setZoomInternal = function (zoom, position) {
                var self = this, o = self.options, zoomPosition, viewCenter, offset;
                viewCenter = self._coordConverter.getViewCenter();
                zoomPosition = position ? position : viewCenter;
                offset = new maps.Size(zoomPosition.x - viewCenter.x, zoomPosition.y - viewCenter.y).scale(1 - Math.pow(2, o.zoom - zoom), 1 - Math.pow(2, o.zoom - zoom));
                self._offsetCenter(offset.width, offset.height);

                o.zoom = zoom;
                self._coordConverter.zoom = zoom;
                self._updateLayers();
                self._trigger("zoomChanged", null, { "zoom": o.zoom });
            };

            wijmaps.prototype._zoomIn = function (zoomPosition) {
                var self = this, o = self.options, newZoom = Math.min(Math.round(o.targetZoom + 1), self._maxZoom);

                if (o.zoom !== newZoom) {
                    self._setTargetZoom(newZoom, zoomPosition);
                }
            };

            wijmaps.prototype._zoomOut = function (zoomPosition) {
                var self = this, o = self.options, newZoom = Math.max(Math.round(o.targetZoom - 1), self._minZoom);

                if (o.zoom !== newZoom) {
                    self._setTargetZoom(newZoom, zoomPosition);
                }
            };

            wijmaps.prototype._setTargetZoom = function (targetZoom, position) {
                var self = this, o = self.options, intermediateZoom;

                if (targetZoom > self._maxZoom)
                    targetZoom = self._maxZoom;
                if (targetZoom < self._minZoom)
                    targetZoom = self._minZoom;

                if (targetZoom !== o.targetZoom) {
                    o.targetZoom = targetZoom;
                    self._trigger("targetZoomChanged", null, { "targetZoom": targetZoom });

                    if (self._isZooming)
                        return;

                    self._isZooming = true;
                    clearInterval(self._targetZoomTimer);
                    self._targetZoomTimer = setInterval(function () {
                        if (self._isZooming) {
                            if (Math.abs(o.zoom - o.targetZoom) < 0.001) {
                                intermediateZoom = o.targetZoom;
                                self._isZooming = false;
                                clearInterval(self._targetZoomTimer);
                            } else {
                                intermediateZoom = o.targetZoom * o.targetZoomSpeed + o.zoom * (1 - o.targetZoomSpeed);
                            }

                            self._setZoomInternal(intermediateZoom, position);
                        }
                    }, 20);
                }
            };

            wijmaps.prototype._setTargetCenter = function (targetCenter) {
                var self = this, o = self.options, intermediateCenter, converter = self._coordConverter;

                if (targetCenter.x < converter.minLongitude)
                    targetCenter.x = converter.minLongitude;
                if (targetCenter.x > converter.maxLongitude)
                    targetCenter.x = converter.maxLongitude;
                if (targetCenter.y < converter.minLatitude)
                    targetCenter.y = converter.minLatitude;
                if (targetCenter.y > converter.maxLatitude)
                    targetCenter.y = converter.maxLatitude;

                if (o.targetCenter.x !== targetCenter.x || o.targetCenter.y !== targetCenter.y) {
                    o.targetCenter = targetCenter;
                    self._trigger("targetCenterChanged", null, { "targetCenter": targetCenter });

                    if (self._isCenterChanging)
                        return;

                    self._isCenterChanging = true;
                    clearInterval(self._targetCenterTimer);
                    self._targetCenterTimer = setInterval(function () {
                        if (self._isCenterChanging) {
                            if (Math.abs(o.targetCenter.x - o.center.x) < 0.001 && Math.abs(o.targetCenter.y - o.center.y) < 0.001) {
                                intermediateCenter = new maps.Point(o.targetCenter.x, o.targetCenter.y);
                                self._isCenterChanging = false;
                                clearInterval(self._targetCenterTimer);
                            } else {
                                intermediateCenter = new maps.Point(o.targetCenter.x * o.targetCenterSpeed + o.center.x * (1 - o.targetCenterSpeed), o.targetCenter.y * o.targetCenterSpeed + o.center.y * (1 - o.targetCenterSpeed));
                            }

                            self._setCenterInternal(intermediateCenter);
                        }
                    }, 20);
                }
            };

            wijmaps.prototype._panning = function (offsetX, offsetY) {
                var self = this, o = self.options;
                if (offsetX !== 0 || offsetY !== 0) {
                    self._offsetCenter(offsetX, offsetY);
                }
            };

            wijmaps.prototype._offsetCenter = function (offsetX, offsetY) {
                if (offsetX === 0 && offsetY == 0) {
                    return;
                }

                var self = this, c = self._coordConverter, fullMapSize = c.getFullMapSize(), logicCenter = new maps.Point(c.getLogicCenter()).offset(offsetX / fullMapSize.width, offsetY / fullMapSize.height), newCenter = c.logicToGeographic(logicCenter);

                self._setCenter({ "x": newCenter.x, "y": newCenter.y });
            };

            wijmaps.prototype._onKeyDown = function (event) {
                var self = this, o = self.options, c = self._coordConverter, panSpeed = 5, center, keyCode = self._keyCode, viewSize = c.getViewSize(), offsetX = 0, offsetY = 0;
                switch (event.which) {
                    case keyCode.UP:
                        offsetY = -panSpeed;
                        break;
                    case keyCode.DOWN:
                        offsetY = panSpeed;
                        break;
                    case keyCode.LEFT:
                        offsetX = -panSpeed;
                        break;
                    case keyCode.RIGHT:
                        offsetX = panSpeed;
                        break;
                    case keyCode.HOME:
                        offsetX = -viewSize.width;
                        break;
                    case keyCode.END:
                        offsetX = viewSize.width;
                        break;
                    case keyCode.PAGE_UP:
                        offsetY = -viewSize.height;
                        break;
                    case keyCode.PAGE_DOWN:
                        offsetY = viewSize.height;
                        break;
                    default:
                        return false;
                }

                if (offsetX !== 0 || offsetY !== 0) {
                    center = c.geographicToView(o.targetCenter);
                    self._setTargetCenter(c.viewToGeographic({ "x": center.x + offsetX, "y": center.y + offsetY }));
                }

                return true;
            };

            wijmaps.prototype._onKeyPress = function (event) {
                var self = this, targetZoom = self.options.targetZoom, newTargetZoom = targetZoom;
                switch (String.fromCharCode(event.which)) {
                    case "+":
                        newTargetZoom++;
                        break;
                    case "-":
                        newTargetZoom--;
                        break;
                    default:
                        return false;
                }

                if (targetZoom !== newTargetZoom) {
                    self._setTargetZoom(newTargetZoom);
                }

                return true;
            };

            wijmaps.prototype._createLayers = function () {
                var self = this, o = self.options;

                self._container = $("<div class='" + containerCss + "'></div>").appendTo(self.element);

                self._multiScaleImageContainer = $("<div class=\"" + layerContainerCss + " " + tilesContainerCss + "\"></div>").appendTo(self._container);
                if (self._innerSource) {
                    self._createMultiScaleImageLayer();
                }

                self._layersContainer = $("<div class=\"" + layerContainerCss + "\"></div>").appendTo(self._container);
                self._createInnerLayers();

                self._toolsLayerContainer = $("<div class=\"" + layerContainerCss + "\"></div>").appendTo(self._container);
                if (o.showTools) {
                    self._createToolsLayer();
                }

                self._disabledCover = $("<div class='" + containerCss + "'></div>").hide().appendTo(self.element);
            };

            wijmaps.prototype._createMultiScaleImageLayer = function () {
                var self = this, o = self.options;
                self._multiScaleImageContainer.wijmultiscaleimage(self._createMultiscaleimageOptions());
            };

            wijmaps.prototype._createInnerLayers = function () {
                var self = this, o = self.options, e = self.element;
                if (o.layers) {
                    self._layers = [];
                    $.each(o.layers, function (key, options) {
                        var wijname = (options.type === maps.LayerType[3 /* custom */]) ? options.widgetName : "wij" + options.type + "layer", layer = self._createLayer(wijname, options);
                        if (layer) {
                            self._layers.push({ wijname: wijname, options: options, element: layer });
                        }
                    });
                }
            };

            wijmaps.prototype._createToolsLayer = function () {
                var self = this, o = self.options;
                self._toolsLayerContainer.wijtoolslayer({ "center": new maps.Point(o.center.x, o.center.y), "zoom": o.targetZoom, "minZoom": self._minZoom, "maxZoom": self._maxZoom, "converter": self._coordConverter });
                self._toolsLayerContainer.on("wijtoolslayertargetzoomchanged." + self.widgetName, function (e, d) {
                    if (o.targetZoom !== d["targetZoom"]) {
                        self._setTargetZoom(d["targetZoom"]);
                    }
                }).on("wijtoolslayertargetcenterchanged." + self.widgetName, function (e, d) {
                    if (d.targetCenter && (!o.targetCenter || o.targetCenter.x !== d.targetCenter.x || o.targetCenter.y !== d.targetCenter.y)) {
                        self._setTargetCenter({ "x": d.targetCenter.x, "y": d.targetCenter.y });
                    }
                });
            };

            wijmaps.prototype._createLayer = function (wijname, options) {
                var self = this, wo = self._createWijlayerOptions(options), element = $("<div class=\"" + layerContainerCss + "\"></div>");
                self._layersContainer.append(element);
                if (element[wijname]) {
                    return element[wijname](wo);
                }
                return null;
            };

            wijmaps.prototype._createWijlayerOptions = function (lo) {
                var self = this, o = self.options;

                return $.extend(new maps.wijlayer_options(), {
                    disabled: self._isDisabled(),
                    center: new maps.Point(o.center.x, o.center.y),
                    zoom: o.zoom,
                    targetCenter: new maps.Point(o.targetCenter.x, o.targetCenter.y),
                    targetZoom: o.targetZoom,
                    isZooming: self._isZooming,
                    converter: self._coordConverter
                }, lo);
            };

            wijmaps.prototype._updateLayers = function () {
                var self = this, o = self.options, layers = self._layers, options;

                self._coordConverter._updateSize();

                if (layers) {
                    $.each(layers, function (key, item) {
                        options = self._createWijlayerOptions(item.options);
                        item.element[item.wijname]("beginUpdate");
                        item.element[item.wijname](options);
                        item.element[item.wijname]("endUpdate");
                    });
                }

                if (self._innerSource) {
                    self._multiScaleImageContainer.wijmultiscaleimage(self._createMultiscaleimageOptions());
                }

                if (o.showTools) {
                    self._toolsLayerContainer.wijtoolslayer({ "center": new maps.Point(o.center.x, o.center.y), "zoom": o.targetZoom, "converter": self._coordConverter });
                }
            };

            wijmaps.prototype._createMultiscaleimageOptions = function () {
                var self = this, o = self.options;
                return { "source": self._innerSource, "zoom": o.zoom, "center": self._coordConverter.geographicToLogic(new maps.Point(o.center.x, o.center.y)) };
            };

            /**
            * Refresh the map layers. Usually used when the items of the layer data changed.
            */
            wijmaps.prototype.refreshLayers = function () {
                var self = this, o = self.options, layers = self._layers;
                if (layers) {
                    $.each(layers, function (key, item) {
                        item.element[item.wijname]("refresh");
                    });
                }
            };

            /**
            * Convert the point from screen unit (pixel) to  geographic unit (longitude and latitude).
            * @param {IPoint} position The point to convert.
            */
            wijmaps.prototype.viewToGeographic = function (position) {
                return this._coordConverter.viewToGeographic(position);
            };

            /**
            * Convert the point from geographic unit (longitude and latitude) to screen unit (pixel).
            * @param {IPoint} position The point to convert.
            */
            wijmaps.prototype.geographicToView = function (position) {
                return this._coordConverter.geographicToView(position);
            };

            /**
            * Convert the point from screen unit (pixel) to logic unit (percentage).
            * @param {IPoint} position The point to convert.
            */
            wijmaps.prototype.viewToLogic = function (position) {
                return this._coordConverter.viewToLogic(position);
            };

            /**
            * Convert the point from logic unit (percentage) to screen unit (pixel).
            * @param {IPoint} position The point to convert.
            */
            wijmaps.prototype.logicToView = function (position) {
                return this._coordConverter.logicToView(position);
            };

            /**
            * Calculate the distance between two points.
            * @param {Point} lonLat1 The coordinate of first point, in geographic unit.
            * @param {Point} longLat2 The coordinate of second point, in geographic unit.
            * @returns {number} The distance between to points, in meters.
            */
            wijmaps.prototype.distance = function (lonLat1, lonLat2) {
                return this._coordConverter.distance(lonLat1, lonLat2);
            };

            /**
            * Removes the wijmaps functionality completely. This will return the element back to its pre-init state.
            */
            wijmaps.prototype.destroy = function () {
                var self = this, o = self.options, e = self.element;

                e.removeClass(wijmapsCss);
                e.removeClass(o.wijCSS.content);
                e.removeAttr("tabindex");

                self.element.off("." + self.widgetName);
                $(document).off("." + self.widgetName);
                self._destroyLayers();
                _super.prototype.destroy.call(this);
            };

            wijmaps.prototype._destroyLayers = function () {
                var self = this, o = self.options;

                if (self._innerSource) {
                    self._destroyTileLayer();
                }

                self._destroyInnerLayers();

                if (o.showTools) {
                    self._destroyToolsLayer();
                }

                self._container.remove();
                self._disabledCover.remove();
            };

            wijmaps.prototype._destroyTileLayer = function () {
                var self = this;
                if (self._multiScaleImageContainer.data()["wijmoWijmultiscaleimage"]) {
                    self._multiScaleImageContainer.off("." + self.widgetName).wijmultiscaleimage("destroy");
                }
            };

            wijmaps.prototype._destroyToolsLayer = function () {
                var self = this;
                if (self._toolsLayerContainer.data()["wijmoWijtoolslayer"]) {
                    this._toolsLayerContainer.off("." + self.widgetName).wijtoolslayer("destroy");
                }
            };

            wijmaps.prototype._destroyInnerLayers = function () {
                var self = this;
                if (self._layers) {
                    $.each(self._layers, function (index, layer) {
                        layer.element[layer.wijname]("destroy").remove();
                    });
                    self._layers = null;
                }
            };
            return wijmaps;
        })(wijmo.wijmoWidget);
        maps.wijmaps = wijmaps;

        /**
        * The options of the wijmaps widget.
        */
        var wijmaps_options = (function () {
            function wijmaps_options() {
                /**
                * The source of the wijmaps tile layer. Wijmaps provides some built in sources:
                * <ul>
                * <li>bingMapsRoadSource</li>
                * <li>bingMapsAerialSource</li>
                * <li>bingMapsHybridSource</li>
                * </ul>
                * Set to null if want to hide the tile layer.<br>
                * Set to a IMultiScaleTileSource object if want to use another map tile server.
                */
                this.source = "bingMapsRoadSource";
                /**
                * The bing mpas key of the bing maps source.
                *
                */
                this.bingMapsKey = "";
                /**
                * The center of wijmaps view port, in geographic unit.
                */
                this.center = { "x": 0, "y": 0 };
                /**
                * The current zoom of the wijmaps.
                */
                this.zoom = 1;
                /**
                * Determine whether show the tools layer.
                */
                this.showTools = true;
                /**
                * The speed for scaling the wijmaps from current zoom to target zoom.
                */
                this.targetZoomSpeed = 0.3;
                /**
                * The speed for translate the wijmaps from current center to target center.
                */
                this.targetCenterSpeed = 0.3;
                /**
                * Defines the array of layers append to the wijmaps.
                */
                this.layers = [];
            }
            return wijmaps_options;
        })();
        maps.wijmaps_options = wijmaps_options;

        

        

        

        

        

        wijmaps.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijmaps_options());

        $.wijmo.registerWidget("wijmaps", wijmaps.prototype);
    })(wijmo.maps || (wijmo.maps = {}));
    var maps = wijmo.maps;
})(wijmo || (wijmo = {}));
