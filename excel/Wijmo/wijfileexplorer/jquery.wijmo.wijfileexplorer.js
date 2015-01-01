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
/// <reference path="../Base/jquery.wijmo.widget.ts"/>
/// <reference path="../wijgrid/Grid.ts/Grid/wijgrid.ts"/>
/// <reference path="../wijmenu/jquery.wijmo.wijmenu.ts"/>
/// <reference path="../wijdialog/jquery.wijmo.wijdialog.ts"/>
/// <reference path="../wijsplitter/jquery.wijmo.wijsplitter.ts"/>
/// <reference path="../wijtree/jquery.wijmo.wijtree.ts"/>
/// <reference path="../wijpager/jquery.wijmo.wijpager.ts"/>
/// <reference path="../external/declarations/globalize.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /** @ignore */
    (function (_tilelist) {
        "use strict";

        var $ = jQuery, tilelistCssSuffix = "wijmo-wijtilelist", tilelistCss = $.extend(new wijmo.wijmo_css(), {
            tilelist: tilelistCssSuffix,
            tilelistList: tilelistCssSuffix + "-list",
            tilelistItem: tilelistCssSuffix + "-item",
            tilelistItemStateDefault: "",
            tilelistLink: tilelistCssSuffix + "-link",
            tilelistContent: tilelistCssSuffix + "-content",
            tilelistIconContainer: tilelistCssSuffix + "-iconcontainer"
        });

        

        

        

        /**
        * @ignore
        */
        var wijtilelist = (function (_super) {
            __extends(wijtilelist, _super);
            function wijtilelist() {
                _super.apply(this, arguments);
            }
            wijtilelist.prototype._create = function () {
                var self = this;

                _super.prototype._create.call(this);

                self._createTileList();
                self._attachEvents();
            };

            wijtilelist.prototype._setOption = function (key, value) {
                if (key === "data") {
                    this._setData(value);
                    return;
                }

                _super.prototype._setOption.call(this, key, value);
            };

            wijtilelist.prototype._createTile = function (tile) {
                var self = this, $tile = $("<li>"), $link = $("<a>"), $icon = $("<img>"), $iconcontainer = $("<div>"), realTile = $.extend(true, {}, tile), css = self.options.wijCSS, iconFormat, stateHover = css.stateHover;

                $tile.hover(function () {
                    $(this).addClass(stateHover);
                }, function () {
                    $(this).removeClass(stateHover);
                });

                //fire tileCreating event.
                if (self._onTileCreating({
                    tile: realTile,
                    element: $tile
                }) === false) {
                    return $tile;
                }

                $tile.addClass(css.tilelistItem + " " + css.tilelistItemStateDefault).attr("title", realTile.hint);
                $link.addClass(css.tilelistLink).attr("href", "javascript:void(0)").appendTo($tile);
                $iconcontainer.addClass(css.tilelistIconContainer).appendTo($link);

                if (iconFormat = realTile.iconFormat) {
                    $icon = iconFormat();
                } else {
                    $icon.attr("alt", realTile.text).attr("src", realTile.path).attr("align", "bottom");
                }

                $icon.appendTo($iconcontainer);

                $("<span>").addClass(css.tilelistContent).text(realTile.text).appendTo($link);

                //fire tileCreated event.
                self._onTileCreated({
                    tile: tile,
                    element: $tile
                });

                return $tile;
            };

            wijtilelist.prototype._createTiles = function (tiles) {
                var self = this, $tiles = $("<ul>");

                $tiles.addClass(self.options.wijCSS.tilelistList);

                if (tiles) {
                    $.each(tiles, function (idx, tile) {
                        $tiles.append(self._createTile(tile));
                    });
                }

                return $tiles;
            };

            wijtilelist.prototype._createTileList = function () {
                var self = this, o = self.options, css = o.wijCSS, ele = self.element;

                ele.addClass(css.widget + " " + css.tilelist);

                if (o.data && o.data.length) {
                    ele.append(self._createTiles(o.data));
                }
            };

            wijtilelist.prototype._disposeTiles = function ($tilelist) {
                $tilelist && $tilelist.remove();
            };

            wijtilelist.prototype._setData = function (data) {
                var self = this, $tilelist = self.element.find("ul:first");

                self.options.data = data;
                self._$focusTile = null;

                //dispose the old tile list("ul").
                if ($tilelist) {
                    self._disposeTiles($tilelist);
                }

                //generate tile list again("ul").
                $tilelist = self._createTiles(data);
                self.element.append($tilelist);
            };

            wijtilelist.prototype._setTileFocus = function ($tile) {
                var self = this, css = self.options.wijCSS, stateFocus = css.stateFocus;

                //remove focus state from the old focus tile.
                self.element.find("li." + stateFocus).removeClass(stateFocus);

                //set focus state to current tile and set focus to its link element
                //(only link element can get focus).
                $tile && $tile.addClass(stateFocus).find("." + css.tilelistLink).focus();

                self._$focusTile = $tile;
            };

            wijtilelist.prototype._attachEvents = function () {
                var self = this, widgetName = self.widgetName;

                //select tile
                self.element.on("click." + widgetName, $.proxy(self._handleClick, self)).on("keydown." + widgetName, $.proxy(self._handleKeyDown, self));
            };

            wijtilelist.prototype._handleClick = function (e) {
                var self = this;

                self.selectTile(self._getTileElement($(e.target)), e.ctrlKey);
            };

            wijtilelist.prototype._handleKeyDown = function (e) {
                var self = this, keyCode = $.ui.keyCode;

                switch (e.keyCode) {
                    case keyCode.LEFT:
                        self._movePrev();
                        break;
                    case keyCode.UP:
                        self._moveUp();
                        break;
                    case keyCode.RIGHT:
                        self._moveNext();
                        break;
                    case keyCode.DOWN:
                        self._moveDown();
                        break;
                    default:
                        return;
                }

                e.preventDefault();
            };

            wijtilelist.prototype._getTileElement = function (element) {
                return element.closest("li." + this.options.wijCSS.tilelistItem);
            };

            /**
            * @ignore
            */
            wijtilelist.prototype.selectTile = function ($tile, ctrlKey) {
                var self = this, ele = self.element, o = self.options, stateHighlight = o.wijCSS.stateHighlight, $oldSelection = ele.find("li").filter(function () {
                    return $(this).hasClass(stateHighlight);
                }), $newSelection;

                if (!$tile || !$tile.length) {
                    return;
                }

                if (!o.allowMultipleSelection || !ctrlKey) {
                    $oldSelection.removeClass(stateHighlight);
                    $tile.addClass(stateHighlight);
                } else {
                    $tile.toggleClass(stateHighlight);
                }

                $newSelection = ele.find("li").filter(function () {
                    return $(this).hasClass(stateHighlight);
                });

                if ($oldSelection !== $newSelection) {
                    self._onSelectionChanged({
                        oldSelection: self._createSelectionArgs($oldSelection),
                        newSelection: self._createSelectionArgs($newSelection)
                    });
                }

                self._setTileFocus($tile);
            };

            wijtilelist.prototype._createSelectionArgs = function ($selection) {
                var self = this, data = self.options.data, selectionArgs = [], $tiles = self.element.find("li." + self.options.wijCSS.tilelistItem);

                $.each($selection, function (idx, val) {
                    selectionArgs.push({
                        tile: data[$tiles.index(val)],
                        element: $(val)
                    });
                });

                return selectionArgs;
            };

            wijtilelist.prototype._getVSiblingTile = function ($curFocusTile, above) {
                var self = this, ele = self.element, css = self.options.wijCSS, $tiles = ele.find("li." + css.tilelistItem), width = ele.find("ul." + css.tilelistList).width(), oldTileIdx, tileWidth, rowCount, tileIdx;

                if (!$curFocusTile || !width) {
                    return null;
                }

                oldTileIdx = $tiles.index($curFocusTile);
                tileWidth = $curFocusTile.outerWidth(true);
                rowCount = Math.floor(width / tileWidth);

                tileIdx = oldTileIdx + (above ? -1 : 1) * rowCount;

                //current tile is on the top row or bottom row.
                if (tileIdx < 0 || tileIdx >= Math.ceil($tiles.length / rowCount) * rowCount) {
                    return $curFocusTile;
                } else if (tileIdx >= $tiles.length) {
                    tileIdx = $tiles.length - 1;
                }

                return $tiles.eq(tileIdx);
            };

            wijtilelist.prototype._movePrev = function () {
                var self = this, $oldFocusTile = self._$focusTile;

                self.selectTile($oldFocusTile && $oldFocusTile.prev());
            };

            wijtilelist.prototype._moveNext = function () {
                var self = this, $oldFocusTile = self._$focusTile;

                self.selectTile($oldFocusTile && $oldFocusTile.next());
            };

            wijtilelist.prototype._moveUp = function () {
                var self = this, $oldFocusTile = self._$focusTile, $tile = $oldFocusTile && self._getVSiblingTile($oldFocusTile, true);

                if ($tile == $oldFocusTile) {
                    return;
                }

                self.selectTile($tile);
            };

            wijtilelist.prototype._moveDown = function () {
                var self = this, $oldFocusTile = self._$focusTile, $tile = $oldFocusTile && self._getVSiblingTile($oldFocusTile, false);

                if ($tile == $oldFocusTile) {
                    return;
                }

                self.selectTile($tile);
            };

            wijtilelist.prototype._onTileCreating = function (args) {
                return this._trigger("tileCreating", null, args);
            };

            wijtilelist.prototype._onTileCreated = function (args) {
                return this._trigger("tileCreated", null, args);
            };

            wijtilelist.prototype._onSelectionChanged = function (args) {
                return this._trigger("selectionChanged", null, args);
            };

            /**
            * @ignore
            */
            wijtilelist.prototype.setFocus = function () {
                var self = this, $oldFocusTile = self._$focusTile;

                if ($oldFocusTile && $oldFocusTile.length > 0) {
                    self._setTileFocus($oldFocusTile);
                } else {
                    self.selectTile(self.element.find("li." + self.options.wijCSS.tilelistItem).first());
                }
            };
            return wijtilelist;
        })(wijmo.wijmoWidget);
        _tilelist.wijtilelist = wijtilelist;

        var wijtilelist_options = (function () {
            function wijtilelist_options() {
                this.data = null;
                this.allowMultipleSelection = false;
                this.tileCreating = undefined;
                this.tileCreated = undefined;
                this.selectionChanged = undefined;
                this.wijCSS = tilelistCss;
            }
            return wijtilelist_options;
        })();

        wijtilelist.prototype.widgetEventPrefix = "wijtilelist";
        wijtilelist.prototype.options = $.extend(true, wijmo.wijmoWidget.prototype.options, new wijtilelist_options());
        $.wijmo.registerWidget("wijtilelist", wijtilelist.prototype);
    })(wijmo.tilelist || (wijmo.tilelist = {}));
    var tilelist = wijmo.tilelist;
})(wijmo || (wijmo = {}));



var wijmo;
(function (wijmo) {
    (function (fileexplorer) {
        "use strict";

        var $ = jQuery, cssFileExplorer = "wijmo-wijfileexplorer", eventNameSpaceSuffix = ".wijfileexplorer", commandDataName = "wijfileexplorercommand", dragItemsDataName = "wijfileexplorerDragItems", css = $.extend(new wijmo.wijmo_css(), {
            fileExplorer: cssFileExplorer,
            loadingOverlay: cssFileExplorer + "-overlay",
            loadingText: cssFileExplorer + "-loadingtext",
            itemsViewContainer: cssFileExplorer + "-itemsviewcontainer",
            emptyFolderTip: cssFileExplorer + "-emptyfoldertip",
            //splitter
            splitterV: "wijmo-wijsplitter-vertical",
            splitterVPanel1: "wijmo-wijsplitter-v-panel1",
            splitterVPanel2: "wijmo-wijsplitter-v-panel2",
            splitterVPanel1Content: "wijmo-wijsplitter-v-panel1-content",
            splitterVPanel2Content: "wijmo-wijsplitter-v-panel2-content",
            //fileExplorer
            folderExpandedIcon: 'ui-icon-folder-open',
            folderCollapsedIcon: 'ui-icon-folder-collapsed',
            documentIcon: 'ui-icon-document',
            folderItem: cssFileExplorer + "-folder",
            fileItem: cssFileExplorer + "-file",
            //toolbar
            toolbar: cssFileExplorer + "-toolbar",
            toolbarBack: cssFileExplorer + "-back",
            toolbarForward: cssFileExplorer + "-forward",
            toolbarOpen: cssFileExplorer + "-open",
            toolbarRefresh: cssFileExplorer + "-refresh",
            toolbarNewFolder: cssFileExplorer + "-newfolder",
            toolbarDelete: cssFileExplorer + "-delete",
            toolbarSetDetailViewMode: cssFileExplorer + "-grid",
            toolbarSetThumbnailViewMode: cssFileExplorer + "-thumbnail",
            toolbarUploader: cssFileExplorer + "-uploader",
            //addressbar
            address: cssFileExplorer + "-address",
            addressPanel: cssFileExplorer + "-addresspanel",
            addressBar: cssFileExplorer + "-addressbar",
            filter: cssFileExplorer + "-filter",
            filterPanel: cssFileExplorer + "-filterpanel",
            addressBarFullWidth: cssFileExplorer + "-addressbar-fullwidth",
            //filetree
            fileTree: cssFileExplorer + "-filetree",
            tvLink: "wijmo-wijtree-link",
            //container
            gridContainer: cssFileExplorer + "-gvContainer",
            listViewContainer: cssFileExplorer + "-lvContainer",
            //gridview
            grid: cssFileExplorer + "-gridview",
            sizeContent: cssFileExplorer + "-sizecontent",
            gridRow: "wijmo-wijgrid-row",
            gridInnerCell: "wijmo-wijgrid-innercell",
            //thumbnail view
            thumbnailView: cssFileExplorer + "-listview",
            tileItem: "wijmo-wijtilelist-item",
            tileContent: "wijmo-wijtilelist-content",
            contentItem: cssFileExplorer + "-content",
            contentItemContainer: cssFileExplorer + "-contentcontainer",
            link: cssFileExplorer + "-link",
            dragContent: cssFileExplorer + "-dragcontent"
        }), viewMode = {
            detail: "detail",
            thumbnail: "thumbnail"
        }, explorerMode = {
            "default": "default",
            fileTree: "fileTree"
        }, hostRootOperator = "~", forwardSlash = "/", backwardSlash = "\\", backwardSlashRegExp = /\\/g, visibleControls = {
            toolbar: "toolbar",
            addressBox: "addressBox",
            filterBox: "filterTextBox",
            treeView: "treeView",
            detailView: "grid",
            thumbnailView: "listView",
            contextMenu: "contextMenu"
        }, ajaxCommands = {
            getHostUri: "GetHostUri",
            getItems: "GetItems",
            paste: "Paste",
            move: "Move",
            "delete": "Delete",
            newFolder: "CreateDirectory",
            rename: "Rename"
        }, columnNames = {
            name: "name",
            size: "size"
        }, nameColumnIndex = 0, sizeColumnIndex = 1, sortDirectionNames = {
            ascending: "ascending",
            descending: "descending"
        }, filterTimeout = 300, showLoadingTimout = 500, defaultFilterExpression = "", defaultSortDirection = sortDirectionNames.ascending, defaultPageIndex = 0, defaultPageCount = 1, defaultSortExpression = columnNames.name, defaultSearchPatterns = ["*.*"], defaultShortcuts = {
            focusFileExplorer: "Ctrl+F2",
            focusTreeView: "Shift+3",
            focusToolBar: "Shift+1",
            focusGrid: "Shift+4",
            focusAddressBar: "Shift+2",
            popupWindowClose: "Esc",
            focusPager: "Shift+5",
            contextMenu: "Shift+M",
            back: "Ctrl+K",
            forward: "Ctrl+L",
            open: "Enter",
            refresh: "Ctrl+F3",
            newFolder: "Shift+N",
            "delete": "Delete",
            uploadFile: "Ctrl+U"
        };

        function arraysEqual(a, b) {
            if (a === b) {
                return true;
            }

            if (a == null || b == null) {
                return false;
            }

            if (a.length != b.length) {
                return false;
            }

            for (var i = 0; i < a.length; ++i) {
                if ($.inArray(a[i], b) === -1) {
                    return false;
                }
            }

            return true;
        }

        function findItemByPath(items, path) {
            for (var index = 0, length = items.length; index < length; index++) {
                if (items[index].path === path) {
                    return items[index];
                }
            }

            return null;
        }

        function ensureFolderSeparator(path) {
            var folderSeparator = getFolderSeparator(path);

            return path[path.length - 1] === folderSeparator ? path : path + folderSeparator;
        }

        function removeLastFolderSeparator(path) {
            var folderSeparator = getFolderSeparator(path);

            return path[path.length - 1] === folderSeparator ? path.substring(0, path.length - 1) : path;
        }

        function getFolderSeparator(path) {
            return path && path.indexOf(forwardSlash) !== -1 ? forwardSlash : backwardSlash;
        }

        function combinePaths(items) {
            var resultItems = [], index = 0, length = items.length, item, existParentPath;
            items.sort(function (a, b) {
                return a.path > b.path ? 1 : (a.path > b.path ? -1 : 0);
            });
            for (; index < length; index++) {
                item = items[index];
                if (!item.isFolder) {
                    resultItems.push(item);
                    continue;
                }

                existParentPath = false;
                for (var resultIndex = 0, resultLength = resultItems.length; resultIndex < resultLength; resultIndex++) {
                    var resultItem = resultItems[resultIndex];
                    if (!resultItem.isFolder) {
                        continue;
                    }

                    if (resultItem.path.indexOf(item.path) > -1) {
                        existParentPath = true;
                        break;
                    }
                }

                if (!existParentPath) {
                    resultItems.push(item);
                }
            }

            return resultItems;
        }

        function isAncestorFolder(mayAncestorPath, mayDescendantPath) {
            return mayDescendantPath.indexOf(ensureFolderSeparator(mayAncestorPath)) === 0;
        }

        function isParentFolder(mayParentPath, mayChildPath) {
            var leftPath, folderSeparator = getFolderSeparator(mayParentPath);
            mayParentPath = ensureFolderSeparator(mayParentPath);
            if (!isAncestorFolder(mayParentPath, mayChildPath)) {
                return false;
            }

            leftPath = removeLastFolderSeparator(mayChildPath.substring(mayParentPath.length));
            return leftPath.indexOf(folderSeparator) === -1;
        }

        function isFolder(element) {
            return $(element).hasClass(css.folderItem);
        }

        function resolveUri(uri) {
            return !uri ? "" : uri.replace(backwardSlashRegExp, forwardSlash);
        }

        function getUriWithHostUri(hostUri, path) {
            var folderSeparator = getFolderSeparator(path);
            if (path[0] !== hostRootOperator || path[1] !== folderSeparator) {
                return resolveUri(path);
            }

            if (hostUri == null) {
                hostUri = "";
            }

            if (hostUri.length > 0) {
                hostUri = ensureFolderSeparator(hostUri);
            }

            // replace the first 2 chars "~/" with host uri
            return resolveUri(hostUri + path.substring(2));
        }

        function getItemName(path, withoutFileExtension) {
            var index, folderSeparator = getFolderSeparator(path), name = removeLastFolderSeparator(path).split(folderSeparator).pop();
            if (!withoutFileExtension) {
                return name;
            }

            index = getItemName(path).indexOf(".");
            return index === -1 ? name : name.substring(0, index);
        }

        function getFileExtension(path) {
            var name = getItemName(path), index = getItemName(path).indexOf(".");
            return index === -1 ? "" : name.substring(index + 1);
        }

        function getParentPath(path) {
            var folderSeparator = getFolderSeparator(path);

            return path.substring(0, removeLastFolderSeparator(path).lastIndexOf(folderSeparator));
        }

        /** Convert a string to camelCase */
        function toCamelCase(text) {
            return $.map(text.split("-"), function (item, index) {
                if (!item) {
                    return "";
                }
                return (index === 0 ? item.charAt(0).toLowerCase() : item.charAt(0).toUpperCase()) + item.substring(1);
            }).join("");
        }

        // get the width of element's padding, border and margin
        function getBoxOuterAreaWidth(elem) {
            if (!elem) {
                return 0;
            }

            var $elem = $(elem);
            if (!$elem.length) {
                return 0;
            }

            return $elem.outerWidth(true) - $elem.width();
        }

        /** @widget */
        var wijfileexplorer = (function (_super) {
            __extends(wijfileexplorer, _super);
            function wijfileexplorer() {
                _super.apply(this, arguments);
            }
            // Begin Init
            wijfileexplorer.prototype._create = function () {
                var self = this;
                _super.prototype._create.call(this);
                self._initDataOptions();
                self._initCommands();
                self._createInnerControls();
                self._optionsUpdated();
                self._initMembers();
                self._attachEvents();
            };

            wijfileexplorer.prototype._getGlobalEventNameSpaceSuffix = function () {
                var self = this;
                return self._globalEventNameSpaceSuffix || (self._globalEventNameSpaceSuffix = "." + self.element.uniqueId().attr("id"));
            };

            wijfileexplorer.prototype._attachEvents = function () {
                var self = this, globalEventNameSpaceSuffix = self._getGlobalEventNameSpaceSuffix();

                //listerning shortcuts events
                $(document).on("keydown" + globalEventNameSpaceSuffix, function (e) {
                    //Move focus
                    if (e.keyCode === $.ui.keyCode.TAB) {
                        if (self._moveFocus(!e.shiftKey)) {
                            e.preventDefault();
                        }
                        return;
                    } else if (e.keyCode === $.ui.keyCode.ENTER) {
                        if (self._handleEnterKeyDown()) {
                            return;
                        }
                    }

                    return self._processShortcut(e);
                }).on("mousedown" + globalEventNameSpaceSuffix, function (e) {
                    if (!self._isChildElement($(e.target))) {
                        self.element.find("." + self._focusCss).removeClass(self._focusCss);
                    }
                });
            };

            wijfileexplorer.prototype._isChildElement = function ($el) {
                return $el.closest("." + css.fileExplorer).length > 0;
            };

            wijfileexplorer.prototype._handleEnterKeyDown = function () {
                var self = this, $focusedEl;

                //context menu is opened.
                if (self._contextMenu.is(":visible")) {
                    self._contextMenu.find("a." + self._focusCss).click();
                    return true;
                }

                $focusedEl = self.element.find("li." + self._focusCss);
                if ($focusedEl.parents("." + css.toolbar).length || $focusedEl.parents("div.wijmo-wijpager").length > 0) {
                    $focusedEl.find("a").click();
                    return true;
                }

                return false;
            };

            wijfileexplorer.prototype._getCurrentFocusedItem = function () {
                var self = this, $focusedEl = self.element.find("li." + self._focusCss).first();

                if (!$focusedEl.length || (!$focusedEl.parentsUntil("." + css.toolbar).length && !$focusedEl.parentsUntil(".wijmo-wijpager").length)) {
                    return null;
                }

                return $focusedEl;
            };

            wijfileexplorer.prototype._getNextFocusableItem = function (forward) {
                var self = this, $focusedEl = self._getCurrentFocusedItem();

                if ($focusedEl && $focusedEl.length) {
                    return $focusedEl[forward ? "next" : "prev"]();
                }

                return null;
            };

            wijfileexplorer.prototype._moveFocus = function (forward) {
                var self = this, $sibling = self._getNextFocusableItem(forward);

                if ($sibling && $sibling.length) {
                    self._setFocus($sibling, $sibling, $sibling.parent());
                    return true;
                }

                return false;
            };

            wijfileexplorer.prototype._initMembers = function () {
                var self = this, wijCSS = self.options.wijCSS;

                self._focusCss = wijCSS.stateFocus;
                self._activeCss = wijCSS.stateActive;
            };

            wijfileexplorer.prototype._optionsUpdated = function () {
                var self = this;
                self._layoutOptionsUpdated();
                self._enableOpenFileUpdated();
                self._enableCreateNewFolderUpdated();
                self._enableCopyUpdated();
                self._allowMultipleSelectionUpdated();
                self._disabledUpdated();
                self._createRootNodes();
                self._executeWithHostUri();
                self._loadCurrentFolder();
            };

            wijfileexplorer.prototype._loadCurrentFolder = function () {
                var self = this, showItemsView = self._showingControls[visibleControls.detailView] || self._showingControls[visibleControls.thumbnailView];

                if (showItemsView && !self._data()) {
                    self._openFolder(self._createCurrentStateRequest(), function () {
                        return self._expand(self._getNodeByPath(self.options.currentFolder));
                    });
                    return;
                }

                self._currentFolderUpdated();
                self._expand(self._getNodeByPath(self.options.currentFolder));
            };

            wijfileexplorer.prototype._createRootNodes = function () {
                var self = this, rootItems = self._getTreeInitData();

                self._updateTreeViewData(null, rootItems);
            };

            /**
            * @ignore
            */
            wijfileexplorer.prototype._getTreeInitData = function () {
                var self = this;
                return self._enableAjax() ? $.map(self._getRootPaths(), function (path) {
                    return { path: path, isFolder: true, hasSubFolders: true, hasChildren: true };
                }) : self._data();
            };

            wijfileexplorer.prototype._selectCurrentFolderTreeNode = function () {
                this._selectTreeNode(this.options.currentFolder);
            };

            wijfileexplorer.prototype._selectTreeNode = function (path) {
                var self = this, node = self._getNodeByPath(path);
                if (!node) {
                    return;
                }

                self._setSelection({
                    path: node.options.value,
                    isFolder: isFolder(node.element),
                    hasChildren: node.options.hasChildren,
                    operatingArea: 0 /* TreeView */
                });

                if (!node.options.selected) {
                    node.select(true);
                }
            };

            wijfileexplorer.prototype.destroy = function () {
                var self = this, wijCSS = self.options.wijCSS, globalEventNameSpaceSuffix = self._getGlobalEventNameSpaceSuffix();

                if (self._filterTimer) {
                    clearTimeout(self._filterTimer);
                    self._filterTimer = null;
                }

                if (self._showLoadingLayerTimer) {
                    clearTimeout(self._showLoadingLayerTimer);
                    self._showLoadingLayerTimer = null;
                }

                self._contextMenu && self._contextMenu.data("wijmo-wijmenu") && self._contextMenu.wijmenu("destroy");
                self._dialog && self._dialog.data("wijmo-wijdialog") && self._dialog.wijdialog("destroy");
                self._treeView && self._treeView.data("wijmo-wijtree") && self._treeView.wijtree("destroy");
                self._pager && self._pager.data("wijmo-wijpager") && self._pager.wijpager("destroy");
                self._detailView && self._detailView.data("wijmo-wijgrid") && self._detailView.wijgrid("destroy");
                self._thumbnailView && self._thumbnailView.data("wijmo-wijtilelist") && self._thumbnailView.wijtilelist("destroy");
                self._splitter && self._splitter.data("wijmo-wijsplitter") && self._splitter.wijsplitter("destroy");

                $(document).off(globalEventNameSpaceSuffix);
                $(window).off(globalEventNameSpaceSuffix);

                self.element.removeClass(wijCSS.widget + " " + css.fileExplorer + " " + wijCSS.helperReset).attr("tabindex", "").off(eventNameSpaceSuffix).empty().removeUniqueId();

                _super.prototype.destroy.call(this);
            };

            wijfileexplorer.prototype._initCommands = function () {
                var self = this;
                self._commands = {
                    open: new fileExplorerCommand("open", function () {
                        return self._open();
                    }, self.localizeString("commandOpen", "Open")),
                    "delete": new fileExplorerCommand("delete", function () {
                        return self._delete();
                    }, self.localizeString("commandDelete", "Delete")),
                    refresh: new fileExplorerCommand("refresh", function () {
                        return self.refresh();
                    }, self.localizeString("commandRefresh", "Refresh")),
                    rename: new fileExplorerCommand("rename", function () {
                        return self._rename();
                    }, self.localizeString("commandRename", "Rename")),
                    newFolder: new fileExplorerCommand("newFolder", function () {
                        return self._newFolder();
                    }, self.localizeString("commandNewFolder", "New Folder")),
                    copy: new fileExplorerCommand("copy", function () {
                        return self._copy();
                    }, self.localizeString("commandCopy", "Copy")),
                    paste: new fileExplorerCommand("paste", function () {
                        return self._paste();
                    }, self.localizeString("commandPaste", "Paste")),
                    back: new fileExplorerCommand("back", function () {
                        return self._back();
                    }, self.localizeString("commandBack", "Back")),
                    forward: new fileExplorerCommand("forward", function () {
                        return self._forward();
                    }, self.localizeString("commandForward", "Forward")),
                    setDetailViewMode: new fileExplorerCommand("setDetailViewMode", function () {
                        return self._setOption("viewMode", viewMode.detail);
                    }, self.localizeString("commandSetDetailViewMode", "Detail View Mode")),
                    setThumbnailViewMode: new fileExplorerCommand("setThumbnailViewMode", function () {
                        return self._setOption("viewMode", viewMode.thumbnail);
                    }, self.localizeString("commandSetThumbnailViewMode", "Thumbnail View Mode")),
                    focusFileExplorer: new fileExplorerCommand("focusFileExplorer", function () {
                        return self._focusFileExplorer();
                    }),
                    focusToolBar: new fileExplorerCommand("focusToolBar", function () {
                        return self._focusToolBar();
                    }),
                    focusTreeView: new fileExplorerCommand("focusTreeView", function () {
                        return self._focusTreeView();
                    }),
                    focusGrid: new fileExplorerCommand("focusGrid", function () {
                        return self._focusGrid();
                    }),
                    focusPager: new fileExplorerCommand("focusPager", function () {
                        return self._focusPager();
                    }),
                    focusAddressBar: new fileExplorerCommand("focusAddressBar", function () {
                        return self._focusAddressBar();
                    }),
                    popupWindowClose: new fileExplorerCommand("popupWindowClose", function () {
                        return self._popupWindowClose();
                    }),
                    contextMenu: new fileExplorerCommand("contextMenu", function () {
                        return self._openContextMenu();
                    })
                };
            };

            wijfileexplorer.prototype._createInnerControls = function () {
                var self = this, wijCSS = self.options.wijCSS;

                self._showingControls = {};
                self.element.addClass(wijCSS.widget + " " + css.fileExplorer + " " + wijCSS.helperReset).attr("tabindex", "-1");

                self._createToolbar();
                self._createAddressBar();
                self._createSplitter();
                self._createDialog();
                self._createContextMenu();
            };

            wijfileexplorer.prototype._setDialogButtons = function (showButtons) {
                var self = this, buttons = null;
                if (showButtons) {
                    buttons = [
                        {
                            text: self.localizeString("dialogOK", "OK"), click: function () {
                                self._dialogOk && self._dialogOk(self._dialogInput.val());
                                $(this).wijdialog("close");
                            }
                        },
                        {
                            text: self.localizeString("dialogCancel", "Cancel"), click: function () {
                                $(this).wijdialog("close");
                            }
                        }
                    ];
                }
                self._dialog.wijdialog({ buttons: buttons });
            };

            wijfileexplorer.prototype._createDialog = function () {
                var self = this, ele = self.element;

                self._dialog = $('<div>').css('overflow', 'hidden').appendTo(ele);
                self._dialog.wijdialog({
                    autoOpen: false,
                    modal: true,
                    resizable: true,
                    buttons: {
                        Ok: function () {
                            self._dialogOk && self._dialogOk(self._dialogInput.val());
                            $(this).wijdialog("close");
                        },
                        Cancel: function () {
                            $(this).wijdialog("close");
                        }
                    },
                    captionButtons: {
                        pin: { visible: false },
                        refresh: { visible: false },
                        toggle: { visible: false },
                        minimize: { visible: false },
                        maximize: { visible: false }
                    }
                });

                self._dialogInput = $('<input>').css('width', '100%').hide().appendTo(self._dialog);
                self._dialog.on("keydown" + eventNameSpaceSuffix, function (e) {
                    if (e.keyCode === $.ui.keyCode.ENTER) {
                        self._dialogOk && self._dialogOk(self._dialogInput.val());
                        self._dialog.wijdialog("close");
                        e.stopPropagation();
                    }
                });
                self._dialogContent = $('<div>').css('width', '100%').css('height', '100%').css('overflow', 'hidden').appendTo(self._dialog);
            };

            wijfileexplorer.prototype._createContextMenu = function () {
                var self = this, o = self.options, ele = self.element, commands = self._commands, $menu = $('<ul>').attr("tabindex", "-1").appendTo(ele), menuCommands = [commands.open, commands.newFolder, commands.copy, commands.paste, commands["delete"], commands.rename], element, globalEventNameSpaceSuffix = self._getGlobalEventNameSpaceSuffix(), cmd;

                $.each(menuCommands, function (index, item) {
                    element = $('<li>').data(commandDataName, item).append($('<a>').attr('href', '#').text(item.text)).appendTo($menu);
                    item.addBindElement(element);
                });

                $menu.wijmenu({
                    orientation: 'vertical',
                    trigger: ele,
                    disabled: o.disabled,
                    triggerEvent: 'rtclick',
                    animation: {
                        easing: 'easeOutCubic'
                    },
                    showing: function (e, sublist) {
                        if (!self._isActived() || self._isLoading() || !self._showingControls[visibleControls.contextMenu]) {
                            self._setContextItem(null);
                            return false;
                        }

                        // clear previous menu's selection
                        self._contextMenu.wijmenu("deactivate");

                        // If right click, use the event object as the position.of option.
                        // If keyboard event, use originalEvent's target.
                        var positionOf = (e.which === 3 || !e.originalEvent) ? e : e.originalEvent.target;
                        sublist.options.position = {
                            my: 'left2 top2',
                            at: 'left center',
                            of: positionOf,
                            collision: 'fit'
                        };
                    },
                    shown: function () {
                        return self._focusContextMenu();
                    },
                    hidden: function () {
                        self._setContextItem(null);
                    },
                    select: function (e, d) {
                        cmd = d.item.element.data(commandDataName);

                        //this is a just a workaround for the wijmenu's issue.
                        $menu.find("." + css.stateFocus).removeClass(o.wijCSS.stateFocus).removeClass(o.wijCSS.stateHover);
                        if (cmd) {
                            cmd.execute();
                        }
                    }
                }).on("mousedown" + eventNameSpaceSuffix, function (e) {
                    // Menu is hidden dn document mousedown. So we need cancel mousedown event bubble here.
                    e.stopPropagation();
                }).on("keydown" + eventNameSpaceSuffix, function (e) {
                    if (e.keyCode === $.ui.keyCode.ESCAPE) {
                        self._hideContextItem();
                    }
                });

                self._contextMenu = $menu;

                // Hide menu in right click
                $(document).on("contextmenu" + globalEventNameSpaceSuffix, function (e) {
                    self._hideContextItem();
                    // Hide menu in left click. If also process right click here, menu
                    // cannot show correct layout when right click several times quickly.
                }).on("mousedown" + globalEventNameSpaceSuffix, function (e) {
                    if (e.which === 3) {
                        return;
                    }
                    self._hideContextItem();
                });

                self.element.on('contextmenu' + eventNameSpaceSuffix, function (e) {
                    if (!self._isActived()) {
                        return;
                    }

                    var target = e.target, contextItem = target && self._getItemFromElement(target);

                    self._setContextItem(null);

                    if (!target || contextItem == null) {
                        return;
                    }

                    if (contextItem.operatingArea === 0 /* TreeView */ || self._isSelected(contextItem)) {
                        self._setContextItem(contextItem);
                        return;
                    }

                    if (!e.ctrlKey) {
                        self._selectItemsViewItem($(target));
                        self._setContextItem(contextItem);
                    }
                });
            };

            wijfileexplorer.prototype._focusContextMenu = function () {
                var self = this, contextMenu = self._contextMenu;
                if (!contextMenu || !contextMenu.length) {
                    return;
                }

                contextMenu.focus();
            };

            wijfileexplorer.prototype._hideContextItem = function () {
                var self = this;
                if (self._contextMenu) {
                    self._contextMenu.wijmenu("hideAllMenus");
                    self._setContextItem(null);
                }
            };

            wijfileexplorer.prototype._selectItemsViewItem = function ($element) {
                var self = this;
                if (self._showingControls[visibleControls.detailView]) {
                    self._selectDetailViewItem($element);
                    return;
                }

                if (self._showingControls[visibleControls.thumbnailView]) {
                    self._selectThumbnailViewItem($element);
                }
            };

            wijfileexplorer.prototype._selectThumbnailViewItem = function ($cell) {
                this._thumbnailView.wijtilelist("selectTile", $cell.closest("li"));
            };

            wijfileexplorer.prototype._selectDetailViewItem = function ($cell) {
                if (!$cell || $cell.length === 0) {
                    return;
                }

                var self = this, dv = self._detailView, selection = dv.wijgrid("selection"), cellInfo = dv.wijgrid("getCellInfo", $cell[0]);

                if (!selection || !cellInfo) {
                    return;
                }

                self._selectionUpdating = true;
                selection.clear();
                self._selectionUpdating = false;
                selection.addRows(cellInfo.rowIndex());
            };

            wijfileexplorer.prototype._showDialog = function (title, content, resizable, width, height, showButtons) {
                if (typeof showButtons === "undefined") { showButtons = true; }
                var self = this, opts = { 'title': title, 'resizable': resizable, 'width': width, 'height': height };
                if (!showButtons) {
                    self._setDialogButtons(false);
                }
                self._dialogContent.empty().append(content).show();
                self._dialogInput.hide();
                self._dialog.wijdialog(opts).wijdialog("open");
                self._dialogOk = null;
            };

            wijfileexplorer.prototype._showInputDialog = function (title, value, ok) {
                var self = this;
                self._setDialogButtons(true);
                self._dialogContent.hide();
                self._dialogInput.val(value).show();
                self._dialog.wijdialog({ 'title': title, 'resizable': false, 'width': '300', 'height': '200' }).wijdialog("open");
                self._dialogOk = ok;
            };

            wijfileexplorer.prototype._showConfirmDialog = function (title, msg, ok) {
                var self = this;
                self._setDialogButtons(true);
                self._dialogContent.empty().append(msg).show();
                self._dialogInput.hide();
                self._dialog.wijdialog({ 'title': title, 'resizable': false, 'width': '300', 'height': '200' }).wijdialog("open");
                self._dialogOk = ok;
            };

            wijfileexplorer.prototype._hideDialog = function () {
                this._dialog.wijdialog("close");
            };

            wijfileexplorer.prototype._isVisibleControl = function (control) {
                var controls = this.options.visibleControls;
                return !controls || controls.indexOf(control) > -1;
            };

            wijfileexplorer.prototype._createToolbar = function () {
                var self = this, options = self.options, wijCSS = options.wijCSS, commands = self._commands, toolbarCommands = [
                    commands.back,
                    commands.forward,
                    commands.open,
                    commands.refresh,
                    commands.newFolder,
                    commands["delete"],
                    commands.setDetailViewMode,
                    commands.setThumbnailViewMode
                ], toolbarContainer = $("<div>").attr("tabindex", "-1").addClass(wijCSS.helperReset).appendTo(self.element), toolbar = $("<ul>").addClass(wijCSS.widget).addClass(wijCSS.helperReset).addClass(wijCSS.helperClearFix).addClass(wijCSS.stateDefault).addClass(css.toolbar).appendTo(toolbarContainer);

                self._toolbar = toolbar;

                $.each(toolbarCommands, function (index, item) {
                    var innerSpan = $("<span>").addClass(wijCSS.icon), innerLink = $("<a>").attr("herf", "#").addClass(css.link).append(innerSpan), element = $("<li>").data(commandDataName, item).attr("title", item.text).addClass(css[toCamelCase("toolbar-" + item.name)]).addClass(wijCSS.stateDefault).addClass(wijCSS.cornerAll).append(innerLink).appendTo(toolbar);
                    item.addBindElement(element);
                });

                toolbar.on("click" + eventNameSpaceSuffix, function (event) {
                    if (!self._isActived()) {
                        return;
                    }

                    var command = $(event.target).closest("li").data(commandDataName);
                    if (command) {
                        command.execute();
                    }
                }).on("mouseenter" + eventNameSpaceSuffix, "li", function () {
                    if (!options.disabled && !$(this).hasClass(wijCSS.stateDisabled)) {
                        $(this).addClass(wijCSS.stateHover);
                    }
                }).on("mouseleave" + eventNameSpaceSuffix, "li", function () {
                    $(this).removeClass(wijCSS.stateHover);
                });

                self._showingControls[visibleControls.toolbar] = true;
            };

            wijfileexplorer.prototype._createAddressBar = function () {
                var self = this, wijCSS = self.options.wijCSS, container = $("<div>").addClass(css.addressBar).addClass(wijCSS.helperClearFix).addClass(wijCSS.content).appendTo(self.element);
                self._createAddressBox(container);
                self._createFilterBox(container);
            };

            wijfileexplorer.prototype._createAddressBox = function (container) {
                var self = this, addressPanel = $("<div>").addClass(css.addressPanel).appendTo(container);
                self._addressBox = $("<div>").addClass(css.address).addClass(self.options.wijCSS.content).appendTo(addressPanel);
                self._showingControls[visibleControls.addressBox] = true;
            };

            wijfileexplorer.prototype._createFilterBox = function (container) {
                var self = this, o = self.options, filterPanel = $("<div>").addClass(css.filterPanel).appendTo(container), filterBox = $("<input type='text'/>"), resetTimer = function () {
                    if (self._filterTimer != undefined) {
                        clearTimeout(self._filterTimer);
                        self._filterTimer = null;
                    }
                }, textChangedEventName = "input" + eventNameSpaceSuffix + " propertychange" + eventNameSpaceSuffix + " keyup" + eventNameSpaceSuffix, filterExpression = self._filterExpression() || defaultFilterExpression;

                self._filterBox = filterBox.addClass(css.filter).addClass(o.wijCSS.content).appendTo(filterPanel).on("keydown" + eventNameSpaceSuffix, function (e) {
                    e.stopPropagation();

                    if (e.keyCode === $.ui.keyCode.ENTER) {
                        if (o.enableFilteringOnEnterPressed) {
                            self._filter(filterBox.val());
                        }

                        e.preventDefault();
                    }
                }).on(textChangedEventName, function (event) {
                    if (o.enableFilteringOnEnterPressed) {
                        return;
                    }

                    //IE < 9, only listen value's propertchange event
                    if (event.type === "propertychange" && event.originalEvent.propertyName !== "value") {
                        return;
                    }

                    resetTimer();
                    self._filterTimer = setTimeout(function () {
                        self._filter(filterBox.val());
                        resetTimer();
                    }, filterTimeout);
                }).on("focus" + eventNameSpaceSuffix, function () {
                    self._restoreFocus = function () {
                        filterBox && filterBox.focus();
                    };
                });

                self._showingControls[visibleControls.filterBox] = true;

                if (filterExpression !== filterBox.val()) {
                    filterBox.val(filterExpression);
                }
            };

            wijfileexplorer.prototype._createSplitter = function () {
                var self = this, leftPanel = $("<div>"), rightPanel = $("<div>"), splitter = $("<div style='height:100%;'>"), adjustItemsViewWidth = function () {
                    self._adjustDetailViewWidth();
                    self.options.treePanelWidth = splitter.wijsplitter("option", "splitterDistance");
                };

                self._splitter = splitter.append(leftPanel).append(rightPanel).appendTo(self.element).wijsplitter({
                    orientation: "vertical",
                    sized: adjustItemsViewWidth,
                    collapsed: adjustItemsViewWidth,
                    expanded: adjustItemsViewWidth,
                    fullSplit: true
                });

                self._createTreeView(leftPanel);
                self._createItemsView(rightPanel);
            };

            wijfileexplorer.prototype._createTreeView = function (container) {
                var self = this, item;
                self._treeView = $("<ul>").appendTo(container).wijtree({
                    selectedNodeChanged: function (e, data) {
                        item = self._getItemFromElement(data.element);
                        if (self._sameWithSelection(item)) {
                            return;
                        }

                        self._setSelection(item);
                        if (self.options.mode === explorerMode["default"]) {
                            self._open();
                            return;
                        }

                        if (item.isFolder) {
                            self._setCurrentFolder(item.path);
                        }
                    }
                });
                self._treeView.parent().addClass(css.fileTree);
                self._attachTreeViewEvents();
                self._showingControls[visibleControls.treeView] = true;
            };

            wijfileexplorer.prototype._attachTreeViewEvents = function () {
                var self = this, o = self.options, parentNodeSelector = ".wijmo-wijtree-parent";

                self._treeView.on("click" + eventNameSpaceSuffix, parentNodeSelector, function (e) {
                    if (!self._isActived()) {
                        return;
                    }

                    if ($(e.target).is("." + css.icon)) {
                        var treeNode = $(this).data("wijmo-wijtreenode");
                        if (treeNode && (!treeNode.$nodes || !treeNode.$nodes.length)) {
                            if (!treeNode.options.expanded) {
                                self._expandWithNewNodes(treeNode.options.value);
                            }
                        }
                    }
                }).on("dblclick" + eventNameSpaceSuffix, parentNodeSelector, function (e) {
                    if (!self._isActived()) {
                        return;
                    }

                    var treeNode = $(this).data("wijmo-wijtreenode");

                    //this nonde doesn't have child nodes.
                    if ($(e.target).parents(".wijmo-wijtree-item." + css.folderItem).length || !treeNode) {
                        return;
                    }

                    if (o.mode === explorerMode["default"]) {
                        if (treeNode.options.expanded) {
                            treeNode.collapse();
                        } else {
                            self._expand(treeNode);
                        }
                    } else {
                        self._open();
                    }

                    e.stopPropagation();
                }).on("keydown" + eventNameSpaceSuffix, function (e) {
                    if (o.disabled) {
                        return;
                    }

                    //When pressing Right key, expand focused tree node.
                    if (e.keyCode === $.ui.keyCode.RIGHT) {
                        self._onTreeViewRightKeyDown();
                        return;
                    }

                    //When pressing Enter key, change currentFolder to current focused node.
                    if (e.keyCode === $.ui.keyCode.ENTER) {
                        e.stopPropagation();
                        return;
                    }

                    //When pressing Tab key, move focus to the items view.
                    if (e.keyCode === $.ui.keyCode.TAB && !e.shiftKey) {
                        self._focusGrid();
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }

                    return self._processShortcut(e);
                });

                //bind mousedown event to file tree's parent(container).
                self._treeView.parents("." + css.fileTree).first().parent().on("mouseup" + eventNameSpaceSuffix, function () {
                    if (o.disabled) {
                        return;
                    }

                    self._focusTreeView();
                });
            };

            wijfileexplorer.prototype._initNodeHasChildren = function (node, hasChildren) {
                node._setOption("hasChildren", hasChildren);
                if (!hasChildren && node.options.expanded) {
                    node.collapse();
                }
            };

            wijfileexplorer.prototype._setTreeViewNodes = function (items, parentNode) {
                var self = this, o = self.options, isFileTreeMode = o.mode === explorerMode.fileTree, nodeCount = parentNode.options.nodes.length;

                if (!items) {
                    return;
                }

                self._initNodeHasChildren(parentNode, !!items.length);
                while (nodeCount > 0) {
                    parentNode.remove(nodeCount - 1);
                    nodeCount--;
                }

                $.each(items, function (i, item) {
                    if (!isFileTreeMode && !item.isFolder) {
                        return;
                    }

                    var nodeOption = {
                        text: getItemName(item.path),
                        value: item.path,
                        hasChildren: undefined,
                        expandedIconClass: undefined,
                        collapsedIconClass: undefined,
                        itemIconClass: undefined,
                        nodes: []
                    };

                    if (item.isFolder) {
                        nodeOption.hasChildren = (isFileTreeMode ? item.hasChildren : item.hasSubFolders) || false;
                        nodeOption.expandedIconClass = css.folderExpandedIcon;
                        nodeOption.collapsedIconClass = css.folderCollapsedIcon;
                    } else {
                        nodeOption.hasChildren = false;
                        nodeOption.itemIconClass = css.documentIcon;
                    }

                    parentNode.add(nodeOption);
                    parentNode.element.find("li:last").addClass(item.isFolder ? css.folderItem : css.fileItem);

                    if (nodeOption.hasChildren) {
                        var childNodes = parentNode.getNodes(), addedNodes = $(childNodes).filter(function () {
                            return this.options.value == nodeOption.value;
                        });
                        if (addedNodes.length > 0) {
                            self._setTreeViewNodes(item.children, addedNodes[0]);
                        }
                    }
                });
            };

            wijfileexplorer.prototype._createItemsView = function (container) {
                var self = this, innerContainer = $("<div>").addClass(css.itemsViewContainer).appendTo(container);
                self._itemsViewContainer = innerContainer;
                self._createDetailView(innerContainer);
                self._createThumbnailView(innerContainer);
                self._createEmptyFolderTip(innerContainer);
                self._createPager(container);
                self._attachItemsViewContainerEvents();
            };

            wijfileexplorer.prototype._attachItemsViewContainerEvents = function () {
                var self = this, o = self.options;

                self._itemsViewContainer.on("click" + eventNameSpaceSuffix, function () {
                    if (o.disabled) {
                        return;
                    }

                    self._focusGrid();
                }).on("keydown" + eventNameSpaceSuffix, function (e) {
                    if (o.disabled) {
                        return;
                    }

                    if (e.keyCode === $.ui.keyCode.TAB && e.shiftKey) {
                        self._focusTreeView();
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }
                });
            };

            wijfileexplorer.prototype._createEmptyFolderTip = function (container) {
                var self = this, emptyFolderTip = $("<div>").text(self.localizeString("emptyFolder", "This folder is empty.")).addClass(css.emptyFolderTip).appendTo(container).hide();
                self._emptyFolderTip = emptyFolderTip;
            };

            wijfileexplorer.prototype._createPager = function (container) {
                var self = this, wijCSS = self.options.wijCSS, pager = $("<div>").wijpager({
                    mode: "numeric",
                    pageIndexChanged: function (e, args) {
                        self._page(args.newPageIndex);
                    }
                }).addClass(wijCSS.stateDefault).addClass(wijCSS.widget).addClass("wijmo-wijpager ui-helper-clearfix").appendTo(container);

                self._pager = pager;
            };

            // For fix bug 92769: when grid's container width is auto and grid's table width is bigger than container,
            // grid will not display completely. This method is used to adjust grid's container to wider to
            // make scrollbar show. It is invoked when splitter resizing, grid column resizing and window resizing.
            wijfileexplorer.prototype._adjustDetailViewWidth = function () {
                var self = this, detailView = self._detailView, originalScrollLeft, tableMinWidth, outerContainer;

                if (!detailView || !detailView.length) {
                    return;
                }

                self._cancelDetailViewSelectionChange = !self._getDetailViewSelectedCells().length();

                tableMinWidth = self._getDetailViewMinWidth();
                originalScrollLeft = self._itemsViewContainer.scrollLeft();
                outerContainer = detailView.parent();
                outerContainer.css("width", "");
                if (tableMinWidth > outerContainer.width()) {
                    outerContainer.width(detailView.outerWidth(true));
                }

                self._detailView.wijgrid("doRefresh");
                self._itemsViewContainer.scrollLeft(originalScrollLeft);

                self._cancelDetailViewSelectionChange = false;
            };

            wijfileexplorer.prototype._getDetailViewMinWidth = function () {
                var self = this, nameColumnWidth = self._detailView.wijgrid("option", "columns")[0].width || self._getNameColumnMinWidth();
                return nameColumnWidth + self._getSizeColumnMinWidth() + self._getDetailViewOuterAreaWidth();
            };

            wijfileexplorer.prototype._getDetailViewOuterAreaWidth = function () {
                var self = this;

                if (self._detailViewOuterAreaWidth === undefined) {
                    self._detailViewOuterAreaWidth = getBoxOuterAreaWidth(self._detailView);
                }

                return self._detailViewOuterAreaWidth;
            };

            wijfileexplorer.prototype._getSizeColumnMinWidth = function () {
                var self = this;

                if (self._sizeColumnMinWidth === undefined) {
                    self._sizeColumnMinWidth = self._getColumnMinWidth(sizeColumnIndex, "." + css.sizeContent);
                }

                return self._sizeColumnMinWidth;
            };

            wijfileexplorer.prototype._getNameColumnMinWidth = function () {
                var self = this;

                if (self._nameColumnMinWidth === undefined) {
                    self._nameColumnMinWidth = self._getColumnMinWidth(nameColumnIndex, "tbody>tr>td ." + css.contentItem);
                }

                return self._nameColumnMinWidth;
            };

            wijfileexplorer.prototype._getColumnMinWidth = function (columnIndex, cellSelector) {
                var self = this, detailView = self._detailView, columnHeader = detailView.find("th>." + css.gridInnerCell).eq(columnIndex), orignalColumnHeaderDisplay = columnHeader.css("display"), $elem, cellOuterAreaWidth, columnMinWidth;

                columnHeader.css("display", "inline-block");
                columnMinWidth = columnHeader.outerWidth(true) + getBoxOuterAreaWidth(columnHeader.closest("th"));
                columnHeader.css("display", orignalColumnHeaderDisplay);

                detailView.find(cellSelector).each(function (index, elem) {
                    $elem = $(elem);
                    if (cellOuterAreaWidth === undefined) {
                        cellOuterAreaWidth = getBoxOuterAreaWidth($elem.closest("td")) + getBoxOuterAreaWidth($elem.closest("." + css.gridInnerCell));
                    }

                    columnMinWidth = Math.max(columnMinWidth, $elem.outerWidth(true) + cellOuterAreaWidth);
                });

                return columnMinWidth;
            };

            wijfileexplorer.prototype._createDetailView = function (container) {
                var self = this, o = self.options, wijCSS = o.wijCSS, toggleSortIcon = function ($container, name) {
                    var icon = $container.find(".wijmo-wijgrid-sort-icon");
                    if (self._sortExpression() === name) {
                        if (!icon || !icon.length) {
                            icon = $("<span>").addClass("wijmo-wijgrid-sort-icon  ui-icon").css("cursor", "pointer").appendTo($container);
                        }

                        if (self._sortDirection() === sortDirectionNames.descending) {
                            icon.removeClass(wijCSS.iconArrowUp);
                            icon.addClass(wijCSS.iconArrowDown);
                        } else {
                            icon.removeClass(wijCSS.iconArrowDown);
                            icon.addClass(wijCSS.iconArrowUp);
                        }
                    } else {
                        icon.remove();
                    }
                }, detailView = $("<table>").appendTo(container).wijgrid({
                    rendered: function () {
                        if (self._updatingDetailViewData) {
                            self._sizeColumnMinWidth = undefined;
                            self._nameColumnMinWidth = undefined;
                            self._detailViewOuterAreaWidth = undefined;
                        }

                        var headers = $(this).find("th .wijmo-wijgrid-innercell");
                        toggleSortIcon(headers.eq(0), columnNames.name);
                        toggleSortIcon(headers.eq(1), columnNames.size);
                    },
                    sorting: function (e, args) {
                        var sortExpression = args.column.dataKey === columnNames.size ? columnNames.size : columnNames.name, sortDirection = self._sortDirection() === sortDirectionNames.descending ? sortDirectionNames.ascending : sortDirectionNames.descending;
                        self._sort(sortExpression, sortDirection);
                        return false;
                    },
                    columnsAutogenerationMode: "none",
                    allowSorting: true,
                    allowColSizing: true,
                    columnResized: function () {
                        self._adjustDetailViewWidth();
                    },
                    columns: [
                        {
                            dataKey: "path",
                            dataType: "string",
                            headerText: self.localizeString("detailViewColumnNameTitle", "Name"),
                            cellFormatter: function (args) {
                                var rowData = args.row.data;
                                if ((rowData && rowData.path) && (args.row.type & $.wijmo.wijgrid.rowType.data)) {
                                    var iconCss = o.wijCSS.icon, text = $("<span>"), icon = $("<span>");
                                    text.addClass(css.contentItem).text(getItemName(rowData.path));
                                    if (rowData.isFolder) {
                                        icon.addClass(iconCss + " " + css.folderCollapsedIcon);
                                        $(args.row.$rows).addClass(css.folderItem);
                                    } else {
                                        icon.addClass(iconCss + " " + css.documentIcon);
                                        $(args.row.$rows).addClass(css.fileItem);
                                    }
                                    args.$container.empty().append(icon).append(text).addClass(css.contentItemContainer);
                                    return true;
                                }
                            }
                        },
                        {
                            allowSizing: false,
                            dataKey: "size",
                            dataType: "number",
                            headerText: self.localizeString("detailViewColumnSizeTitle", "Size"),
                            cellFormatter: function (args) {
                                if (args.row.type & $.wijmo.wijgrid.rowType.data) {
                                    var size = args.row.data.size, text = "", $container = args.$container;
                                    $container.empty();
                                    if (size != null) {
                                        var sizeInKb = size / 1000;
                                        text = Globalize.format(sizeInKb, "n") + " " + self.localizeString("detailViewColumnSizeUnit", "KB");
                                        $container.append($("<span>").addClass(css.contentItemContainer).addClass(css.sizeContent).text(text));
                                    }
                                    return true;
                                }
                            }
                        }
                    ]
                });

                self._detailView = detailView;
                self._attachDetailViewEvent();
                self._showingControls[visibleControls.detailView] = true;
            };

            wijfileexplorer.prototype._attachDetailViewEvent = function () {
                var self = this, rowSelector = "." + css.gridRow, eventPrefix = "wijgrid";

                //cancel grid auto select the first row
                self._detailView.on(eventPrefix + "currentcellchanging", function () {
                    return !(self._cancelDetailViewSelectionChange || self._updatingDetailViewData);
                });

                self.element.on('dblclick' + eventNameSpaceSuffix, rowSelector, function () {
                    self._open();
                }).on(eventPrefix + "selectionchanged" + eventNameSpaceSuffix, function () {
                    self._onDetailViewSelectionChanged();
                    self._setItemsViewDrag(self._detailView);
                });

                $(window).on("resize" + self._getGlobalEventNameSpaceSuffix(), function () {
                    self._adjustDetailViewWidth();
                });
            };

            wijfileexplorer.prototype._createThumbnailView = function (container) {
                var self = this, o = self.options, wijCSS = o.wijCSS;

                self._thumbnailView = $("<div>").addClass(css.thumbnailView).appendTo(container).wijtilelist({
                    allowMultipleSelection: o.allowMultipleSelection,
                    tileCreating: function (e, args) {
                        var tile = args.tile, ele = args.element;

                        tile.text = getItemName(tile.path);
                        tile.hint = tile.text;

                        //the item is folder and should use default folder image to display.
                        if (tile.isFolder) {
                            tile.iconFormat = function () {
                                return $("<span>").attr("alt", tile.text).addClass(wijCSS.icon).addClass(css.folderCollapsedIcon);
                            };
                            ele.addClass(css.folderItem);
                        } else {
                            tile.path = getUriWithHostUri(o.hostUri, tile.path);
                            ele.addClass(css.fileItem);
                        }
                    },
                    selectionChanged: function (e, args) {
                        var selection = [];

                        $.each(args && args.newSelection, function (idx, tileInfo) {
                            selection.push({
                                path: tileInfo.tile.path,
                                isFolder: tileInfo.tile.isFolder,
                                operatingArea: 1 /* ItemsView */
                            });
                        });

                        self._setSelection(selection);
                        self._setItemsViewDrag(self._thumbnailView);
                    }
                }).hide();

                self._attachThumbnailViewEvent();
                self._showingControls[visibleControls.thumbnailView] = false;
            };

            wijfileexplorer.prototype._attachThumbnailViewEvent = function () {
                var self = this;

                self.element.on('dblclick' + eventNameSpaceSuffix, "." + css.tileItem, function () {
                    self._open();
                });
            };

            //End Init
            //Begin Operation
            wijfileexplorer.prototype._back = function () {
                this._moveHistory(-1);
            };

            wijfileexplorer.prototype._moveHistory = function (step) {
                var self = this;
                if (!self._isActived() || !step || (!self._canBack() && step < 0) || (!self._canForward() && step > 0)) {
                    return;
                }

                self._updatingHistoryStep = step;
                self._openFolder(self._histories[self._currentHistoryIndex + step]);
            };

            wijfileexplorer.prototype._forward = function () {
                this._moveHistory(1);
            };

            wijfileexplorer.prototype._expand = function (treeNode, callback) {
                var self = this;
                if (!treeNode) {
                    if (callback) {
                        callback();
                    }
                    return;
                }

                if (treeNode.$nodes && treeNode.$nodes.length) {
                    self._expandWithExistedNodes(treeNode);
                    if (callback) {
                        callback();
                    }
                } else {
                    self._expandWithNewNodes(treeNode.options.value, callback);
                }
            };

            wijfileexplorer.prototype._open = function (openFolderCallback) {
                var self = this;
                if (!self._isActived()) {
                    return;
                }

                var item = self._getOperatingItem();
                if (item.isFolder) {
                    if (item.path === self.options.currentFolder) {
                        self._expand(self._getNodeByPath(item.path));
                        return;
                    }

                    self._openFolder(item.path, function () {
                        self._updateHistory();
                        if (openFolderCallback) {
                            openFolderCallback();
                        }
                    });
                    return;
                }

                self._openFile(item.path);
            };

            wijfileexplorer.prototype._openFile = function (path) {
                var self = this, fileName = getItemName(path), src, content;
                if (self.options.enableOpenFile) {
                    if (self._triggerFileOpening({ path: path }) === false) {
                        return;
                    }

                    self._executeWithHostUri(function () {
                        src = getUriWithHostUri(self.options.hostUri, path);
                        content = $("<iframe src='" + src + "' style='border:none; width:100%; height:100%' frameborder='no'></iframe>");
                        self._showDialog("view file:" + fileName, content, true, '480', '480', false);
                        self._triggerFileOpened({ path: path });
                    });
                }
            };

            wijfileexplorer.prototype._executeWithHostUri = function (callback) {
                var self = this;
                if (self.options.hostUri != null) {
                    if (callback) {
                        callback();
                    }
                    return;
                }

                self._getHostUriCall(callback);
            };

            wijfileexplorer.prototype._getHostUriCall = function (callback) {
                var self = this;
                self._tryAjax(ajaxCommands.getHostUri, null, null, function (result) {
                    self._setOption("hostUri", result.hostUri || "");

                    if (callback) {
                        callback();
                    }
                });
            };

            /** @ignore */
            wijfileexplorer.prototype._sortDirection = function (value) {
                if (value === undefined) {
                    return this._sortDirectionValue || defaultSortDirection;
                }

                this._sortDirectionValue = value;
            };

            /** @ignore */
            wijfileexplorer.prototype._sortExpression = function (value) {
                if (value === undefined) {
                    return this._sortExpressionValue || defaultSortExpression;
                }

                this._sortExpressionValue = value;
            };

            /** @ignore */
            wijfileexplorer.prototype._filterExpression = function (value) {
                if (value === undefined) {
                    return this._filterExpressionValue || defaultFilterExpression;
                }

                this._filterExpressionValue = value;
            };

            /** @ignore */
            wijfileexplorer.prototype._pageCount = function (value) {
                if (value === undefined) {
                    return this._pageCountValue || defaultPageCount;
                }

                this._pageCountValue = value;
            };

            /** @ignore */
            wijfileexplorer.prototype._pageIndex = function (value) {
                if (value === undefined) {
                    return this._pageIndexValue || defaultPageIndex;
                }

                this._pageIndexValue = value;
            };

            /** @ignore */
            wijfileexplorer.prototype._data = function (value) {
                var self = this;
                if (value === undefined) {
                    return self._dataValue;
                }

                self._dataValue = value;

                if (!self._enableAjax()) {
                    self._resolveData();
                    self._sortData();
                }
            };

            wijfileexplorer.prototype._removeDefaultInRequest = function (data) {
                var result = $.extend({}, data);
                if (!result.filterExpression || result.filterExpression === defaultFilterExpression) {
                    delete result.filterExpression;
                }

                if (!result.sortExpression || result.sortExpression === defaultSortExpression) {
                    delete result.sortExpression;
                }

                if (!result.sortDirection && result.sortDirection === defaultSortDirection) {
                    delete result.sortDirection;
                }

                if (!result.pageIndex && result.pageIndex === defaultPageIndex) {
                    delete result.pageIndex;
                }

                return result;
            };

            wijfileexplorer.prototype._createDefaultRequest = function (path) {
                var self = this, o = self.options, requestData = {
                    path: path || self.options.currentFolder,
                    filterExpression: defaultFilterExpression,
                    sortExpression: defaultSortExpression,
                    sortDirection: defaultSortDirection
                };

                if (o.allowPaging) {
                    requestData.pageIndex = defaultPageIndex;
                    requestData.pageSize = o.pageSize;
                }

                return requestData;
            };

            wijfileexplorer.prototype._createCurrentStateRequest = function (path) {
                var self = this, o = self.options, requestData = {
                    path: path || self.options.currentFolder,
                    filterExpression: self._filterExpression(),
                    sortExpression: self._sortExpression(),
                    sortDirection: self._sortDirection()
                };

                if (o.allowPaging) {
                    requestData.pageIndex = self._pageIndex();
                    requestData.pageSize = o.pageSize;
                }

                return requestData;
            };

            wijfileexplorer.prototype._applyRequestData = function (data, responseData) {
                var self = this, o = self.options;

                if (data.filterExpression != null) {
                    self._filterExpression(data.filterExpression);
                }

                if (o.allowPaging) {
                    if (responseData && responseData.pageIndex) {
                        self._pageIndex(responseData.pageIndex);
                    } else {
                        self._pageIndex(defaultPageIndex);
                    }

                    if (responseData && responseData.pageCount) {
                        self._pageCount(responseData.pageCount);
                    } else {
                        self._pageCount(defaultPageCount);
                    }
                }

                if (data.sortExpression != null) {
                    self._sortExpression(data.sortExpression);
                }

                if (data.sortDirection != null) {
                    self._sortDirection(data.sortDirection);
                }
            };

            wijfileexplorer.prototype._updateItemsViewCall = function (data, callback) {
                var self = this, requestData = $.extend(self._createCurrentStateRequest(), data);

                self._getItemsCall(requestData, function (result) {
                    self._data(result.itemOperationResults);
                    self._applyRequestData(requestData, result);
                    self._updateItemsView();
                    self._triggerFolderLoaded({ currentFolder: self.options.currentFolder });
                    self._selectCurrentFolderTreeNode();
                    if (callback) {
                        callback();
                    }
                });
            };

            wijfileexplorer.prototype._openFolder = function (data, success, error) {
                if (typeof data == "string") {
                    data = { path: data };
                }

                var self = this, requestData = $.extend({}, self._createDefaultRequest(), data);

                self._getItemsCall(requestData, function (result) {
                    self._data(result.itemOperationResults);
                    self._applyRequestData(requestData, result);
                    self._setCurrentFolder(requestData.path);

                    if (success) {
                        success();
                    }
                }, error);
            };

            wijfileexplorer.prototype._isDefaultSearchPattern = function () {
                return arraysEqual(this.options.searchPatterns, this._getDefaultSearchPattern());
            };

            /** @ignore */
            wijfileexplorer.prototype._getDefaultSearchPattern = function () {
                return defaultSearchPatterns;
            };

            wijfileexplorer.prototype._getItemsCall = function (data, success, error) {
                var self = this, o = self.options;
                data = $.isPlainObject(data) ? data : { path: data };

                if (data.path == null) {
                    return;
                }

                if (!data.onlyFolder && o.searchPatterns != null && !self._isDefaultSearchPattern()) {
                    data.searchPatterns = o.searchPatterns;
                }

                data = self._removeDefaultInRequest(data);
                self._tryAjax(ajaxCommands.getItems, data, null, function (result) {
                    if (success) {
                        success(result);
                    }
                }, function () {
                    if (error) {
                        error();
                    }

                    return false;
                }, function () {
                    if (success) {
                        success({ itemsOperationResults: self._data() });
                    }
                });
            };

            /**
            * The refresh method refreshes the content within the wijfileexplorer.
            * @param path - Optional. The path to refresh. The current folder is used if the path is not set.
            */
            wijfileexplorer.prototype.refresh = function (path) {
                var self = this;
                if (path && path !== self.options.currentFolder) {
                    if (self._getNodeByPath(path)) {
                        self._refreshTreeNode(path);
                    }
                    return;
                }

                self._openFolder(self._createCurrentStateRequest());
                self._refreshTreeNode(self.options.currentFolder, function () {
                    return self._selectCurrentFolderTreeNode();
                });
            };

            wijfileexplorer.prototype._newFolder = function () {
                var self = this, item = self._getOperatingItem(), newFolderTargetPath = item && item.operatingArea === 0 /* TreeView */ ? item.path : self.options.currentFolder;
                if (self.options.enableCreateNewFolder) {
                    self._showInputDialog(self.localizeString("newFolderDialogTitle", "Enter new folder name"), self.localizeString("defaultNewFolderName", "New Folder"), function (input) {
                        if (input) {
                            self._newFolderCall(input, newFolderTargetPath);
                        }
                    });
                }
            };

            wijfileexplorer.prototype._newFolderCall = function (newFolderName, targetPath) {
                var self = this, newFolderPath = ensureFolderSeparator(targetPath) + newFolderName;

                if (self._triggerNewFolderCreating({ path: newFolderPath }) === false) {
                    return;
                }

                self._tryAjax(ajaxCommands.newFolder, { path: newFolderPath }, null, function () {
                    self._triggerNewFolderCreated({ path: newFolderPath });
                    self._refreshAfterAdd(targetPath);
                }, null, function () {
                    self._addItemsInData({
                        path: newFolderPath,
                        isFolder: true,
                        hasChildren: false,
                        hasSubFolder: false,
                        children: []
                    }, self._getFolderData(targetPath));
                    self.refresh(targetPath);
                });
            };

            wijfileexplorer.prototype._refreshTreeNode = function (path, callback) {
                var self = this;
                self._getItemsCall({
                    path: path,
                    onlyFolder: self.options.mode === explorerMode["default"]
                }, function (result) {
                    self._updateTreeViewData(path, result.itemOperationResults);
                    if (callback) {
                        callback();
                    }
                });
            };

            wijfileexplorer.prototype._delete = function () {
                var self = this;
                if (!self._isActived()) {
                    return;
                }

                var items = combinePaths(self._getOperatingItems());
                if (self._hasRootPath(items)) {
                    return;
                }

                if (items && items.length) {
                    self._showConfirmDialog(self.localizeString("deleteDialogTitle", "Warning"), self.localizeString("deleteDialogAlertingText", "Are you sure to delete the selected item? This operation cannot be undone."), function () {
                        self._deleteCall(items);
                    });
                }
            };

            wijfileexplorer.prototype._deleteCall = function (items) {
                if (!items || !items.length) {
                    return;
                }

                var self = this, paths = [];
                $.each(items, function (i, item) {
                    if (self._triggerItemDeleting({ path: item.path }) === false) {
                        return;
                    }

                    paths.push(item.path);
                });

                self._tryAjax(ajaxCommands["delete"], { sourcePaths: paths }, null, function (result) {
                    if (!result.itemOperationResults || !result.itemOperationResults.length) {
                        return;
                    }

                    var successItems = [];
                    $.each(result.itemOperationResults, function (i, item) {
                        if (!item) {
                            return;
                        }

                        if (item.success) {
                            successItems.push(findItemByPath(items, item.path));
                            self._triggerItemDeleted({ path: item.path });
                            return;
                        }

                        self._processError(item.error);
                    });

                    self._refreshAfterDelete(successItems);
                }, function () {
                    self._refreshAfterDelete(items);
                }, function () {
                    self._removeItemsInData(items);
                    self.refresh();
                });
            };

            wijfileexplorer.prototype._rename = function () {
                var self = this, item = self._getOperatingItem(), showExtension = self.options.allowFileExtensionRename;
                if (item) {
                    if (self._isRootPath(item.path)) {
                        return;
                    }

                    var name = getItemName(item.path, !showExtension && !item.isFolder), fileSuffix = showExtension || item.isFolder ? "" : "." + getFileExtension(item.path);
                    self._showInputDialog(self.localizeString("renameDialogTitle", "Enter new name"), name, function (input) {
                        if (input && input !== name) {
                            if (self._triggerItemRenaming({ path: item.path, newName: input }) === false) {
                                return;
                            }
                            self._renameCall(item, input + fileSuffix);
                        }
                    });
                }
            };

            wijfileexplorer.prototype._renameCall = function (item, newName) {
                var self = this, parentPath = getParentPath(item.path), targetPath = ensureFolderSeparator(parentPath) + newName;

                self._tryAjax(ajaxCommands.rename, { path: targetPath, sourcePaths: [item.path] }, null, function () {
                    self._refreshAfterRename(item.path, ensureFolderSeparator(parentPath) + newName);
                    self._triggerItemRenamed({ path: item.path, newName: getItemName(newName, !self.options.allowFileExtensionRename) });
                }, null, function () {
                    self._removeItemsInData(item, true);
                    self._addItemsInData($.extend({}, item, { path: targetPath }), null, true);
                    self._data(self._data());
                    self.refresh();
                });
            };

            wijfileexplorer.prototype._refreshAfterRename = function (oldPath, newPath) {
                var self = this, parentPath = getParentPath(oldPath);
                if (parentPath === self.options.currentFolder) {
                    self.refresh();
                } else {
                    self._refreshTreeNode(parentPath);
                    if (oldPath === self.options.currentFolder) {
                        self._openFolder(newPath);
                    }
                }
            };

            wijfileexplorer.prototype._copy = function () {
                var self = this;
                if (!self._isActived() || !self.options.enableCopy) {
                    return;
                }
                var items = self._getOperatingItems(), copiedItems = [];
                $.each(items, function (i, item) {
                    if (self._triggerItemCopying({ path: item.path }) === false) {
                        return;
                    }

                    copiedItems.push(item);
                });

                self._copiedItems = copiedItems;
                self._commands.paste.disabled(false);

                $.each(copiedItems, function (i, item) {
                    self._triggerItemCopied({ path: item.path });
                });
            };

            wijfileexplorer.prototype._paste = function (items, targetPath) {
                var self = this, target = self._getOperatingItem(), pasteItems = [];
                targetPath = targetPath || (target.isFolder ? target.path : getParentPath(target.path));
                items = items || self._copiedItems;

                if (!targetPath) {
                    return;
                }

                $.each(items, function (i, item) {
                    if (self._triggerItemPasting({ sourcePath: item.path, targetFolder: targetPath }) === false) {
                        return;
                    }

                    pasteItems.push(item);
                });

                if (!pasteItems.length) {
                    return;
                }

                self._pasteCall(pasteItems, targetPath);
            };

            wijfileexplorer.prototype._expandWithNewNodes = function (path, callback) {
                var self = this;
                if (!path) {
                    return;
                }

                self._refreshTreeNode(path, function () {
                    self._expandWithExistedNodes(self._getNodeByPath(path));
                    if (callback) {
                        callback();
                    }
                });
            };

            wijfileexplorer.prototype._filter = function (filterExpression) {
                var self = this;
                if (!self._isActived() || filterExpression === self._filterExpression()) {
                    return;
                }

                if (self._triggerFiltering({ path: self.options.currentFolder, filterExpression: filterExpression }) === false) {
                    return;
                }

                self._updateItemsViewCall({ filterExpression: filterExpression }, function () {
                    self._triggerFiltered({ path: self.options.currentFolder, filterExpression: filterExpression });
                });
            };

            wijfileexplorer.prototype._sort = function (sortExpression, sortDirection) {
                var self = this;
                if (!self._isActived()) {
                    return;
                }

                self._updateItemsViewCall({ sortExpression: sortExpression, sortDirection: sortDirection });
            };

            wijfileexplorer.prototype._page = function (pageIndex) {
                var self = this;
                if (!self._isActived() || !self.options.allowPaging) {
                    return;
                }

                self._updateItemsViewCall({ pageIndex: pageIndex });
            };

            wijfileexplorer.prototype._getDetailViewSelectedCells = function () {
                return this._detailView.wijgrid("selection")["selectedCells"]();
            };

            wijfileexplorer.prototype._onDetailViewSelectionChanged = function () {
                if (!this._isActived()) {
                    return;
                }

                var self = this, selection = self._getDetailViewSelectedCells(), length = selection.length(), newSelection = [], i, item;
                for (i = 0; i < length; i++) {
                    item = selection.item(i);
                    if (item.cellIndex() === 0) {
                        newSelection.push({
                            path: item.value(),
                            isFolder: isFolder($(item.tableCell()).parent()),
                            operatingArea: 1 /* ItemsView */
                        });
                    }
                }

                self._setSelection(newSelection);
            };

            wijfileexplorer.prototype._getExtendedKeyCode = function () {
                var self = this;
                if (!self._extendedKeyCode) {
                    self._extendedKeyCode = $.extend({
                        BACK: 8,
                        ESC: 27,
                        PAGEUP: 33,
                        PAGEDOWN: 34,
                        F1: 112,
                        F2: 113,
                        F3: 114,
                        F4: 115,
                        F5: 116,
                        F6: 117,
                        F7: 118,
                        F8: 119,
                        F9: 120,
                        F10: 121,
                        F11: 122,
                        F12: 123
                    }, $.ui.keyCode);
                }

                return self._extendedKeyCode;
            };

            wijfileexplorer.prototype._getInnerShortcuts = function () {
                var self = this;
                if (!self._innerShortcuts) {
                    self._innerShortcuts = {};
                    $.each(self.options.shortcuts || {}, function (key, value) {
                        self._innerShortcuts[key] = value.split('+');
                    });
                }

                return self._innerShortcuts;
            };

            wijfileexplorer.prototype._matchShortcuts = function (e) {
                var self = this, shortcuts = self._getInnerShortcuts(), actionName, ctrlKey, key, ctrlKeyPressed, extendedKeyCode = self._getExtendedKeyCode(), char = String.fromCharCode(e.keyCode);

                //We only support two keys combination for shortcuts.
                //e.g.ctrl + A, shift + B etc. ctrl + A + B is invalid.
                $.each(shortcuts, function (name, keys) {
                    //Note, here ctrlKey includes ctrl, shift, alt key other than only ctrl key.
                    ctrlKey = (keys.length && keys[0]).toLowerCase() + "Key"; //"ctrlKey", "shiftKey", "altKey".
                    key = keys.length && (keys.length === 1 ? keys[0] : keys[1]).toUpperCase();
                    ctrlKeyPressed = e[ctrlKey];

                    //The key is among the extended keys(all keys except alphabet and numbers).
                    if (e.keyCode === extendedKeyCode[key]) {
                        if (keys.length === 1 || ctrlKeyPressed) {
                            actionName = name;
                            return false;
                        }

                        return true;
                    }

                    if (char && char === key) {
                        if (keys.length === 1 || ctrlKeyPressed) {
                            actionName = name;
                            return false;
                        }

                        return true;
                    }
                });

                return actionName || false;
            };

            wijfileexplorer.prototype._processShortcut = function (e) {
                var self = this, o = self.options, actionName, command;

                if (o.disabled) {
                    return;
                }

                actionName = self._matchShortcuts(e);

                //not a shortcut
                if (!actionName) {
                    return;
                }

                if (self._dialog.is(":visible")) {
                    //only popupWindowClose shortcut works when dialog is opened.
                    if (actionName !== "popupWindowClose") {
                        return;
                    }
                } else if (!self._isChildElement($(e.target)) && actionName !== "focusFileExplorer") {
                    //Only focusFileExplorer shortcut can be triggerred outside fileexplorer when dialog is closed,
                    //so for other shortcut we need judge whether the e.target is the child
                    //element of fileexplorer element.
                    return;
                }

                command = self._commands[actionName];

                if (command) {
                    command.execute();
                    e.stopPropagation();
                    e.preventDefault();
                }
            };

            wijfileexplorer.prototype._setFocus = function ($el, $focusedEl, $parentEl) {
                var self = this, focusCss = self._focusCss, $focusedElement = $focusedEl, $parent = $parentEl || self.element.parent();

                if (!$el || !$el.length) {
                    return;
                }

                if (!$focusedElement || !$focusedElement.length) {
                    $focusedElement = $el;
                }

                if ($focusedElement) {
                    $focusedElement.focus();
                }

                $parent.find("." + focusCss).removeClass(focusCss);
                $el.addClass(focusCss);
            };

            wijfileexplorer.prototype._focusFileExplorer = function () {
                var self = this;

                self._setFocus(self.element);
                self._restoreFocus = $.proxy(self._focusFileExplorer, self);
            };

            wijfileexplorer.prototype._focusToolBar = function () {
                var self = this, $toolBar = self.element.find("." + css.toolbar), $firstEl = $toolBar.find("li").first();

                if ($firstEl.length) {
                    self._setFocus($toolBar.parent());
                    $firstEl.addClass(self._focusCss);
                }
            };

            wijfileexplorer.prototype._focusTreeView = function () {
                var self = this, $tv = self._treeView, $focusedEl;

                if ($tv && $tv.length) {
                    //currently focus is already on treeview.
                    if ($tv.find(":focus").length) {
                        return;
                    }

                    $focusedEl = $tv.find("span." + self._activeCss).first();
                    if ($focusedEl && $focusedEl.length) {
                        $focusedEl = $focusedEl.find("a." + css.tvLink).first();
                    } else {
                        $focusedEl = $tv.find("li a." + css.tvLink).first();
                    }

                    //here $tv is "ul" and its parent is "div"(wijmo-wijtree).
                    //but we need add focus style to wijtree's container.
                    //So I need use the ugly code $tv.parent().parent().
                    self._setFocus($tv.parent().parent(), $focusedEl);
                }
                self._restoreFocus = $.proxy(self._focusTreeView, self);
            };

            wijfileexplorer.prototype._focusGrid = function () {
                var self = this, dv = self._detailView, tv = self._thumbnailView, showingDetialView = self._showingControls[visibleControls.detailView], showingThumbnailView = self._showingControls[visibleControls.thumbnailView], $tds, $focusedEl, $focusableContainer = self._itemsViewContainer.parent();

                //Currently focus is already on the detail/thumbnail view.
                if ($focusableContainer.hasClass(self._focusCss)) {
                    return;
                }

                if (showingDetialView) {
                    if (dv && dv.length) {
                        $tds = dv.find("tbody tr td");
                        $focusedEl = $tds.filter("." + css.stateHighlight).first();

                        self._setFocus($focusableContainer);

                        //Here we need use a trick(($first td).click()) to select the first row
                        //when no row is selected before this action.
                        if ($focusedEl.length === 0) {
                            $tds.first().click();
                        } else {
                            dv.parent().focus();
                        }
                    }
                } else if (showingThumbnailView) {
                    if (tv && tv.length) {
                        self._setFocus($focusableContainer);
                        tv.wijtilelist("setFocus");
                    }
                }

                self._restoreFocus = $.proxy(self._focusGrid, self);
            };

            wijfileexplorer.prototype._focusAddressBar = function () {
                var self = this, $addressBar = self.element.find("." + css.addressBar);

                if ($addressBar && $addressBar.length) {
                    self._setFocus($addressBar, $addressBar.find("input").first());
                }
            };

            wijfileexplorer.prototype._popupWindowClose = function () {
                var self = this;

                if (!self._dialog || !self._dialog.is(":visible")) {
                    return;
                }

                self._hideDialog();
                self._restoreFocus && self._restoreFocus();
            };

            wijfileexplorer.prototype._openContextMenu = function () {
                var self = this, activeItem = self._getOperatingItem(), $activeElement = activeItem && self._getElementByPath(activeItem.path, activeItem.operatingArea);

                if (!$activeElement || !$activeElement.length) {
                    $activeElement = self.element;
                }

                $activeElement.trigger("contextmenu");
            };

            wijfileexplorer.prototype._focusPager = function () {
                var self = this, o = self.options, $pager = self._pager, $firstPagerItem;

                if (!$pager || !$pager.length) {
                    return;
                }

                $firstPagerItem = $pager.find("a").first();

                if ($firstPagerItem && $firstPagerItem.length) {
                    self._setFocus($pager); //, $firstPagerItem);

                    //This is also a trick because current selected pager item has no anchor element.
                    $pager.find("li." + css.stateActive).addClass(self._focusCss).off(eventNameSpaceSuffix).on("keydown" + eventNameSpaceSuffix, function (e) {
                        if (o.disabled) {
                            return;
                        }
                        return self._processShortcut(e);
                    });
                }
            };

            wijfileexplorer.prototype._getElementByPath = function (path, operatingArea) {
                var self = this, node;

                if (operatingArea === 0 /* TreeView */) {
                    node = self._getNodeByPath(path);

                    if (node && node.element) {
                        return node.element;
                    }

                    return null;
                }

                return self._getViewItemByPath(path, self._showingControls[visibleControls.detailView]);
            };

            wijfileexplorer.prototype._getViewItemByPath = function (path, isDetailView) {
                var self = this;

                if (isDetailView) {
                    return self._getDetailViewItemByPath(path);
                }

                return self._getThumbnailViewItemByPath(path);
            };

            wijfileexplorer.prototype._getDetailViewItemByPath = function (path) {
                var self = this, $rows = self._detailView.find("tr"), $item = $rows.first();

                $rows.each(function (rowIdx, row) {
                    var $tds = $(row).find("td.wijgridtd"), matched = false;

                    $tds.each(function (cellIdx, cell) {
                        var $td = $(cell);

                        if ($td.text() === getItemName(path)) {
                            matched = true;
                            return false;
                        }
                    });

                    if (matched) {
                        $item = $(row);
                        return false;
                    }
                });

                return $item;
            };

            wijfileexplorer.prototype._getThumbnailViewItemByPath = function (path) {
                var self = this, $tiles = self._thumbnailView.find("li"), $item = $tiles.first();

                $tiles.each(function (tileIdx, tile) {
                    var $span = $(tile).find("span." + css.tileContent);

                    if ($span.text() === getItemName(path)) {
                        $item = $(tile);
                        return false;
                    }
                });

                return $item;
            };

            wijfileexplorer.prototype._onTreeViewRightKeyDown = function () {
                var self = this, focusedNode, $focusedEl, $tv = self._treeView;

                if ($tv) {
                    $focusedEl = $tv.find(":focus");

                    if (!$focusedEl || !$focusedEl.length) {
                        $focusedEl = $tv.find("." + self._focusCss);
                    }

                    focusedNode = $focusedEl.parents("li").first().data("wijmo-wijtreenode");
                    if (focusedNode && !focusedNode.options.expanded && (!focusedNode.$nodes || !focusedNode.$nodes.length)) {
                        self._expandWithNewNodes(focusedNode.options.value);
                    }
                }
            };

            wijfileexplorer.prototype._onTreeNodeClick = function (e, ui) {
                var self = this, o = self.options;

                if (!self._isActived())
                    return;

                // avoid dead loop;
                ui._isClick = false;
                if (!ui.options.selected) {
                    ui._selectNode(true);
                }

                self._setSelection({
                    path: ui.options.value,
                    isFolder: isFolder(ui.element),
                    operatingArea: 0 /* TreeView */
                }, e.ctrlKey);

                if (o.mode === explorerMode["default"]) {
                    self._openFolder(ui.options.value);
                }
            };

            wijfileexplorer.prototype._isActived = function () {
                var self = this, o = self.options, rootPaths = self._getRootPaths();
                return !!(!o.disabled && o.currentFolder && rootPaths && rootPaths.length);
            };

            wijfileexplorer.prototype._setDragDrop = function () {
                var self = this;
                self._setTreeViewDragDrop();
                self._setItemsViewDragDrop();
            };

            wijfileexplorer.prototype._setTreeViewDragDrop = function () {
                var self = this, $nodeDiv = self._treeView.find("div.wijmo-wijtree-node");
                self._setDraggable($nodeDiv);
                self._setDroppable($nodeDiv);
            };

            wijfileexplorer.prototype._setItemsViewDragDrop = function () {
                var self = this, itemsView;
                if (self._showingControls[visibleControls.detailView]) {
                    itemsView = self._detailView;
                } else if (self._showingControls[visibleControls.thumbnailView]) {
                    itemsView = self._thumbnailView;
                }

                if (itemsView == null) {
                    return;
                }

                self._setItemsViewDrag(itemsView);
                self._setDroppable(itemsView.find("." + css.folderItem));
            };

            wijfileexplorer.prototype._setItemsViewDrag = function (itemsView) {
                var self = this, options = self.options, wijCSS = options.wijCSS, $draggableItem = itemsView.find("." + css.fileItem + ",." + css.folderItem), isDetailView = $draggableItem.hasClass("wijmo-wijgrid-row"), $element, selected;

                if (!$draggableItem && !$draggableItem.length) {
                    return;
                }

                // first make all items be draggable
                self._setDraggable($draggableItem);

                if (!isDetailView) {
                    return;
                }

                // make the content in detailView's row be draggable
                self._setDraggable($draggableItem.find("td[headers='Name']").find(".wijmo-wijgrid-innercell").children());

                if (options.disabled) {
                    return;
                }

                // disable draggable of the unselected detailView row
                $draggableItem.each(function (index, element) {
                    $element = $(element);
                    selected = isDetailView ? $element.find("td").hasClass(wijCSS.stateHighlight) : $element.hasClass(wijCSS.stateActive);
                    $element.draggable("option", "disabled", !selected);
                });
            };

            wijfileexplorer.prototype._setDraggable = function ($element) {
                var self = this, $item;
                $element.each(function (index, item) {
                    $item = $(item);
                    if (!$item.data("ui-draggable")) {
                        $item.draggable(self._createDragOptions());
                    }
                });

                $element.draggable("option", "disabled", self.options.disabled);
            };

            wijfileexplorer.prototype._setDroppable = function ($element) {
                var self = this, $item;
                $element.each(function (index, item) {
                    $item = $(item);
                    if (!$item.data("ui-droppable")) {
                        $item.droppable({
                            drop: function (event, ui) {
                                self._onDrop(event, ui, this);
                            }
                        });
                    }
                });

                $element.droppable("option", "disabled", self.options.disabled);
            };

            wijfileexplorer.prototype._createDragOptions = function () {
                var self = this;
                return {
                    revert: "invalid",
                    helper: function (event) {
                        var dragItem = self._getItemFromElement(this), dragItems = [], helperElement = $("<ul>").addClass(self.options.wijCSS.helperReset), dragItemHeight = 20, wijgrid, fakeClickEvent, $element = $(this);

                        if (dragItem.operatingArea !== 0 /* TreeView */) {
                            // add the dragging item to selection
                            if (!self._isSelected(dragItem)) {
                                if ($element.hasClass(css.tileItem)) {
                                    self._thumbnailView.wijtilelist("selectTile", $element, event.ctrlKey);
                                } else {
                                    // wijgrid has no setting selection interface, here is a trick for setting selection
                                    fakeClickEvent = jQuery.Event("click");
                                    fakeClickEvent.ctrlKey = event.ctrlKey;
                                    fakeClickEvent.shiftKey = event.shiftKey;
                                    fakeClickEvent.target = event.target;
                                    wijgrid = self._detailView.data("wijmo-wijgrid");
                                    wijgrid._onClick(fakeClickEvent);
                                }
                            }

                            $.each(self._selection, function (i, item) {
                                dragItems.push(item);
                            });
                        } else {
                            dragItems.push(dragItem);
                        }

                        $.each(dragItems, function (i, item) {
                            var icon = $("<span>").addClass("ui-icon").addClass(item.isFolder ? css.folderCollapsedIcon : css.documentIcon), text = $("<span>").addClass(css.contentItem).addClass(css.dragContent).text(getItemName(item.path)), helperItem = $("<li>").append(icon).append(text).height(dragItemHeight);
                            helperElement.append(helperItem);
                            helperElement.data(dragItemsDataName, dragItems);
                        });

                        $element.draggable("option", "cursorAt", {
                            top: dragItemHeight * dragItems.length / 2,
                            left: 0
                        });

                        return helperElement;
                    }
                };
            };

            wijfileexplorer.prototype._onDrop = function (event, ui, target) {
                var self = this, items = ui.helper.data(dragItemsDataName), desPath = self._getItemFromElement(target).path, combinedItems, index = 0, count = items.length;

                if (!items || !items.length) {
                    return;
                }

                ui.helper.data(dragItemsDataName, null);

                for (; index < count; index++) {
                    if (items[index].path === desPath) {
                        return;
                    }
                }

                combinedItems = combinePaths(items);

                if (event.ctrlKey) {
                    self._paste(combinedItems, desPath);
                } else if (!self._hasRootPath(combinedItems)) {
                    self._move(combinedItems, desPath);
                }
            };

            wijfileexplorer.prototype._pasteCall = function (items, targetPath) {
                var self = this, addedPaths = $.map(items, function (item) {
                    return item.path;
                });
                self._tryAjax(ajaxCommands.paste, { sourcePaths: addedPaths, path: targetPath }, null, function (result) {
                    if (!result.itemOperationResults || !result.itemOperationResults.length) {
                        return;
                    }

                    $.each(result.itemOperationResults, function (i, item) {
                        if (!item) {
                            return;
                        }

                        if (item.success) {
                            self._triggerItemPasted({ path: item.path, targetFolder: targetPath });
                            return;
                        }

                        self._processError(item.error);
                    });

                    self._refreshAfterAdd(targetPath);
                }, function () {
                    self._refreshAfterAdd(targetPath);
                }, function () {
                    var newItems = $.map(items, function (item) {
                        return $.extend({}, item, { path: ensureFolderSeparator(targetPath) + getItemName(item.path) });
                    });
                    self._addItemsInData(newItems);
                    self._refreshAfterAdd(targetPath);
                });
            };

            wijfileexplorer.prototype._move = function (items, targetPath) {
                var self = this, movingItems = [];

                if (!items || !targetPath) {
                    return;
                }

                $.each(items, function (i, item) {
                    if (self._triggerItemMoving({ sourcePath: item.path, targetFolder: targetPath }) === false) {
                        return false;
                    }

                    movingItems.push(item);
                });

                if (!movingItems.length) {
                    return;
                }

                var paths = $.map(movingItems, function (item) {
                    return item.path;
                });
                self._tryAjax(ajaxCommands.move, { sourcePaths: paths, path: targetPath }, null, function (result) {
                    if (!result.itemOperationResults || !result.itemOperationResults.length) {
                        return;
                    }
                    var movedItems = [];
                    $.each(result.itemOperationResults, function (i, item) {
                        if (!item) {
                            return;
                        }

                        if (item.success) {
                            self._triggerItemMoved({ sourcePath: item.path, targetFolder: targetPath });
                            movedItems.push(findItemByPath(movingItems, item.path));
                            return;
                        }

                        self._processError(item.error);
                    });

                    self._refreshAfterMove(movedItems, targetPath);
                }, function () {
                    self._refreshAfterMove(items, targetPath);
                }, function () {
                    var newItems = $.map(items, function (item) {
                        return $.extend({}, item, { path: ensureFolderSeparator(targetPath) + getItemName(item.path) });
                    });
                    self._removeItemsInData(items, true);
                    self._addItemsInData(newItems);
                    self._refreshAfterMove(items, targetPath);
                });
            };

            wijfileexplorer.prototype._refreshAfterAdd = function (targetPath) {
                this.refresh(targetPath);
            };

            wijfileexplorer.prototype._refreshAfterMove = function (items, targetPath) {
                this._refreshAfterDelete(items);
                this.refresh(targetPath);
            };

            wijfileexplorer.prototype._refreshAfterDelete = function (items) {
                var self = this, parentPathMap = {}, currentFolder = self.options.currentFolder, refreshFolderTo, currentParentFolder = getParentPath(currentFolder);

                $.each(items, function (index, item) {
                    var path = item.path, parentPath = getParentPath(item.path);

                    parentPathMap[path] = parentPath;

                    if (!refreshFolderTo && parentPath === currentFolder) {
                        refreshFolderTo = currentFolder;
                    }

                    if (item.isFolder) {
                        if (!refreshFolderTo && (isAncestorFolder(item.path, currentFolder) || item.path === currentFolder)) {
                            refreshFolderTo = currentParentFolder;
                        } else if (refreshFolderTo && isAncestorFolder(item.path, refreshFolderTo)) {
                            refreshFolderTo = parentPath;
                        }
                    }
                });

                $.each(parentPathMap, function (key, value) {
                    self._deleteTreeNode(key, value);
                });

                if (refreshFolderTo === currentFolder) {
                    self.refresh();
                } else if (refreshFolderTo) {
                    self._openFolder(refreshFolderTo);
                }
            };

            wijfileexplorer.prototype._deleteTreeNode = function (path, parentPath) {
                var self = this, deletingNode = self._getNodeByPath(path), parentNode = self._getNodeByPath(parentPath), hasChildrenAfterDelete;

                if (parentNode && deletingNode) {
                    hasChildrenAfterDelete = !!(parentNode.options.nodes.length - 1);
                    self._initNodeHasChildren(parentNode, hasChildrenAfterDelete);
                    parentNode.remove(deletingNode.element);
                }
            };

            //End Operation
            //Begin Selection
            wijfileexplorer.prototype._getCurrentFolderItem = function () {
                var self = this, data = self._data() || [], index = 0, length = data.length, hasChildren = length > 0, hasSubFolders = false;
                for (; index < length; index++) {
                    if (data[index].isFolder) {
                        hasSubFolders = true;
                        break;
                    }
                }

                return {
                    path: self.options.currentFolder,
                    isFolder: true,
                    hasChildren: hasChildren,
                    hasSubFolders: hasSubFolders
                };
            };

            wijfileexplorer.prototype._operatingItemsChanged = function () {
                this._updateCommandsForOperatingItems();
            };

            wijfileexplorer.prototype._setOperatingItems = function (value) {
                var self = this;
                if (!$.isArray(value)) {
                    value = [value];
                }

                self._operatingItems = value;
                self._operatingItemsChanged();
            };

            wijfileexplorer.prototype._setContextItem = function (value) {
                var self = this;
                self._contextItem = value;
                self._setOperatingItems(value || self._selection);
            };

            wijfileexplorer.prototype._isSelected = function (item) {
                var selection = this._selection, found = false;
                if (selection) {
                    $.each(selection, function (index, value) {
                        if (value.path === item.path && value.operatingArea === item.operatingArea) {
                            found = true;
                            return false;
                        }
                    });
                }

                return found;
            };

            wijfileexplorer.prototype._sameWithSelection = function (items) {
                var selection = this._selection || [], isSame = false, item;
                if (!items) {
                    items = [];
                }

                if ($.isPlainObject(items)) {
                    items = [items];
                }

                if (items.length === selection.length) {
                    isSame = true;
                    $.each(selection, function (index, value) {
                        item = items[index];
                        if (value.path !== item.path || value.operatingArea !== item.operatingArea) {
                            isSame = false;
                            return false;
                        }
                    });
                }

                return isSame;
            };

            wijfileexplorer.prototype._setSelection = function (value, isAppend) {
                var self = this;
                if (self._selectionUpdating) {
                    return;
                }

                self._selection = self._selection || [];

                if (!isAppend) {
                    self._selection.length = 0;
                }

                if (!$.isArray(value)) {
                    value = [value];
                }

                if (!value) {
                    return;
                }

                $.each(value, function (i, e) {
                    if (e != null) {
                        self._selection.push(e);
                    }
                });
                self._setOperatingItems(self._contextItem || self._selection);
                self._triggerItemSelected({ path: (self._selection && self._selection.length) ? self._selection[0].path : null });
            };

            wijfileexplorer.prototype._getOperatingItems = function () {
                var self = this, contextItem = self._contextItem, items, selection = self._selection;

                if (!contextItem) {
                    return (selection && selection.length) ? selection : [self._getCurrentFolderItem()];
                }

                items = [contextItem];

                if (contextItem.operatingArea === 1 /* ItemsView */ && selection) {
                    $.each(selection, function (index, value) {
                        if (value.operatingArea === 1 /* ItemsView */ && value.path !== contextItem.path) {
                            items.push(value);
                        }
                    });
                }

                return items;
            };

            wijfileexplorer.prototype._getOperatingItem = function () {
                return this._getOperatingItems()[0];
            };

            wijfileexplorer.prototype._getFocusedItemElement = function () {
                var self = this, item = self._getOperatingItem(), cells;
                if (!item || !item.path) {
                    return null;
                }

                if (self._currentFocusArea === "detailGrid") {
                    cells = self._detailView.find("td.wijgridtd");
                } else if (self._currentFocusArea === "tileList") {
                    cells = self._thumbnailView.find("li.wijmo-wijtilelist-item");
                } else if (self._currentFocusArea === "treeView") {
                    cells = self._treeView.find("li");
                }

                if (!cells || !cells.length) {
                    return;
                }

                for (var index = 0, length = cells.length; index < length; index++) {
                    var cell = cells[index];
                    if (cell && cell.text() === item.path) {
                        return cell;
                    }
                }
            };

            wijfileexplorer.prototype._getItemFromElement = function (el) {
                var self = this, o = self.options, $item = self._getFileItem(el), path, operatingArea, pathSeparator = getFolderSeparator(o.currentFolder);

                if (!$item || $item.length === 0) {
                    return;
                }

                //item is treenode, then return node.value.
                if ($item.is(":wijmo-wijtreenode")) {
                    path = $item["wijtreenode"]("option", "value");
                    operatingArea = 0 /* TreeView */;
                } else {
                    path = o.currentFolder + pathSeparator + self._getItemText($item);
                    operatingArea = 1 /* ItemsView */;
                }

                return {
                    path: path,
                    isFolder: isFolder($item),
                    operatingArea: operatingArea
                };
            };

            wijfileexplorer.prototype._getFileItem = function (el) {
                return $(el).closest("." + css.folderItem + ",." + css.fileItem);
            };

            wijfileexplorer.prototype._isTreeviewNode = function (el) {
                return this._getFileItem(el).is(":wijmo-wijtreenode");
            };

            wijfileexplorer.prototype._getItemText = function ($item) {
                var $span = $item.find("span." + css.contentItem).filter(function (index, element) {
                    return !$(element).hasClass(css.dragContent);
                });

                if ($span.length > 0) {
                    return $span.text();
                }

                $span = $item.find("span.wijmo-wijtilelist-content");
                if ($span.length > 0) {
                    return $span.text();
                }
            };

            //End Selection
            //Begin Data
            wijfileexplorer.prototype._findItemInData = function (item, items) {
                if (!items) {
                    return -1;
                }

                item = $.isPlainObject(item) ? item.path : item;
                for (var index = 0, length = items.length; index < length; index++) {
                    if (item === items[index].path) {
                        return index;
                    }
                }

                return -1;
            };

            wijfileexplorer.prototype._addItemsInData = function (items, targetItem, preventRefreshData) {
                if (!$.isArray(items)) {
                    items = [items];
                }

                var self = this, data = targetItem ? ($.isArray(targetItem) ? targetItem : targetItem.children) : self._getFolderData(getParentPath(items[0].path));

                if (!data) {
                    return;
                }

                $.each(items, function (i, item) {
                    data.push(item);
                    if (!preventRefreshData) {
                        self._data(self._data());
                    }
                });
            };

            wijfileexplorer.prototype._removeItemsInData = function (items, preventRefreshData) {
                var self = this;

                if (!$.isArray(items)) {
                    items = [items];
                }

                $.each(items, function (i, item) {
                    var data = self._getFolderData(getParentPath(item.path));
                    if (data) {
                        var index = self._findItemInData(item, data);
                        if (index > -1) {
                            data.splice(index, 1);
                            if (!preventRefreshData) {
                                self._data(self._data());
                            }
                        }
                    }
                });
            };

            wijfileexplorer.prototype._getCurrentFolderData = function () {
                var self = this;
                return self._enableAjax() ? self._data() : self._getFolderData(self.options.currentFolder);
            };

            wijfileexplorer.prototype._getFolderData = function (path, data) {
                var self = this, result;

                if (arguments.length == 1) {
                    data = self._data();
                }

                data = data || [];
                if (!path) {
                    return data;
                }

                for (var index = 0, length = data.length; index < length; index++) {
                    var item = data[index], currentPath = item.path;

                    if (isParentFolder(path, currentPath)) {
                        result = data;
                        break;
                    }

                    if (!item.isFolder) {
                        continue;
                    }

                    if (currentPath === path) {
                        result = item.children;
                        break;
                    }

                    if (isParentFolder(currentPath, path)) {
                        result = self._getFolderData(path, item.children);
                        break;
                    }
                }

                return result || [];
            };

            wijfileexplorer.prototype._sortData = function (data, field, isDescending) {
                var self = this;
                if (!field) {
                    field = columnNames.name;
                }

                data = data || self._data();
                data.sort(function (a, b) {
                    return self._sortComparer(a, b, field, isDescending);
                });
                $.each(data, function (index, item) {
                    if (item.children) {
                        self._sortData(item.children);
                    }
                });
            };

            wijfileexplorer.prototype._sortComparer = function (a, b, field, isDescending) {
                return this._sortComparerInner(a, b, field) * (isDescending ? -1 : 1);
            };

            wijfileexplorer.prototype._sortComparerInner = function (a, b, field) {
                if (a.isFolder != b.isFolder) {
                    return a.isFolder ? -1 : 1;
                }

                var valueA = a[field], valueB = b[field];
                if (valueA === valueB) {
                    return 0;
                }

                return valueA > valueB ? 1 : -1;
            };

            wijfileexplorer.prototype._resolveData = function (data) {
                var self = this;

                if (arguments.length === 0) {
                    if (!self._data()) {
                        self._data([]);
                    }

                    data = self._data();
                }

                $.each(data, function (index, item) {
                    if (!item.hasChildren && !item.children) {
                        item.children = [];
                    }

                    if (item.children || item.children.length > 0) {
                        item.hasChildren = true;
                        var hasSubFolders = false;
                        for (var i = 0, length = item.children.length; i < length; i++) {
                            if (item.isFolder) {
                                hasSubFolders = true;
                                break;
                            }
                        }

                        item.hasSubFolders = hasSubFolders;
                        self._resolveData(item.children);
                    } else {
                        item.hasChildren = false;
                        item.hasSubFolders = false;
                    }
                });
            };

            //End Data
            // Begin Options
            wijfileexplorer.prototype._setCurrentFolder = function (value) {
                var self = this, oldCurrentFolder = self.options.currentFolder;

                self.options.currentFolder = value;
                self._currentFolderUpdated();
                if (oldCurrentFolder !== value) {
                    self._triggerFolderChanged({ newFolder: value, oldFolder: oldCurrentFolder });
                }
            };

            wijfileexplorer.prototype._setOption = function (key, value) {
                var self = this, o = self.options, modeChanged = false, needRefresh = false;

                if (key === "currentFolder") {
                    return;
                }

                if (key === "mode") {
                    modeChanged = value !== o.mode;
                } else if (key === "allowPaging" || (key === "pageSize" && o.allowPaging)) {
                    needRefresh = value !== o[key];
                }

                _super.prototype._setOption.call(this, key, value);

                if (key === "disabled") {
                    self._disabledUpdated();
                } else if (key === "viewMode" || key === "mode" || key === "visibleControls" || key === "allowPaging" || key === "treePanelWidth") {
                    self._layoutOptionsUpdated(modeChanged);
                } else if (key === "enableOpenFile") {
                    self._enableOpenFileUpdated();
                } else if (key === "enableCreateNewFolder") {
                    self._enableCreateNewFolderUpdated();
                } else if (key === "enableCopy") {
                    self._enableCopyUpdated();
                } else if (key === "allowMultipleSelection") {
                    self._allowMultipleSelectionUpdated();
                } else if (key === "actionUri") {
                    self._actionUriUpdated();
                } else if (key === "initPath" || key === "viewPaths") {
                    self._rootPathsUpdated();
                } else if (key === "shortcuts") {
                    self._innerShortcuts = null;
                }

                needRefresh && self.refresh();
            };

            wijfileexplorer.prototype._actionUriUpdated = function () {
                this.options.hostUri = null;
            };

            wijfileexplorer.prototype._disabledUpdated = function () {
                var self = this, disabled = self.options.disabled;

                self._contextMenu.wijmenu("option", "disabled", disabled);
                self._detailView.wijgrid("option", "disabled", disabled);
                self._thumbnailView.wijtilelist("option", "disabled", disabled);
                self._treeView.wijtree("option", "disabled", disabled);
                self._pager.wijpager("option", "disabled", disabled);
                self._splitter.wijsplitter("option", "disabled", disabled);
                self._filterBox.prop("disabled", disabled);
                self._setDragDrop();
            };

            wijfileexplorer.prototype._getRootPaths = function () {
                var options = this.options, initPath = options.initPath, viewPaths = options.viewPaths;
                if (viewPaths && viewPaths.length) {
                    return viewPaths;
                }

                return initPath ? [initPath] : [];
            };

            wijfileexplorer.prototype._enableOpenFileUpdated = function () {
                var self = this;
                self._commands.open.disabled(!self.options.enableOpenFile);
            };

            wijfileexplorer.prototype._enableCreateNewFolderUpdated = function () {
                var self = this;
                self._commands.newFolder.disabled(!self.options.enableCreateNewFolder);
            };

            wijfileexplorer.prototype._allowMultipleSelectionUpdated = function () {
                var self = this;
                self._detailView.wijgrid("option", "selectionMode", self.options.allowMultipleSelection ? "multiRow" : "singleRow");
                self._thumbnailView.wijtilelist("option", "allowMultipleSelection", self.options.allowMultipleSelection);
            };

            wijfileexplorer.prototype._enableCopyUpdated = function () {
                var self = this;
                if (!self.options.enableCopy) {
                    self._copiedItems = null;
                }

                self._commands.copy.disabled(!self.options.enableCopy);
                self._commands.paste.disabled(!self.options.enableCopy || self._copiedItems == null || self._copiedItems.length === 0);
            };

            wijfileexplorer.prototype._initDataOptions = function () {
                var self = this, data = self.options.data, rootPaths;

                delete self.options.data;

                if (data && data.length) {
                    rootPaths = self._getRootPaths();
                    if (!rootPaths || !rootPaths.length) {
                        self.options.viewPaths = $.map(data, function (item) {
                            return item.path;
                        });
                    }
                }

                if (!self.options.currentFolder) {
                    rootPaths = self._getRootPaths();
                    if (rootPaths && rootPaths.length) {
                        self.options.currentFolder = rootPaths[0];
                    }
                }

                if (data) {
                    self._data(data);
                }
            };

            wijfileexplorer.prototype._currentFolderUpdated = function () {
                var self = this, currentFolder = self.options.currentFolder;
                self._updateHistory();
                self._addressBox.text(currentFolder).attr("title", currentFolder);
                if (self._showingControls[visibleControls.detailView] || self._showingControls[visibleControls.thumbnailView]) {
                    self._updateItemsView();
                    self._triggerFolderLoaded({ currentFolder: currentFolder });
                }
                self._showCurrentFolderTreeNode();
            };

            wijfileexplorer.prototype._updateItemsView = function () {
                var self = this, showingDetialView = self._showingControls[visibleControls.detailView], showingThumbnailView = self._showingControls[visibleControls.thumbnailView], data = self._getCurrentFolderData();

                self._itemsViewContainer.height(Math.max(0, self._pager.parent().height() - (self.options.allowPaging ? self._pager.outerHeight() : 0) - parseInt(self._itemsViewContainer.css("borderTopWidth")) - parseInt(self._itemsViewContainer.css("borderBottomWidth"))));

                if (showingDetialView) {
                    self._updatingDetailViewData = true;
                    self._detailView.wijgrid("option", "data", data).wijgrid("ensureControl", true);
                    self._updatingDetailViewData = false;
                    self._adjustDetailViewWidth();
                } else if (showingThumbnailView) {
                    self._thumbnailView.wijtilelist("option", "data", data);
                }

                if (!data || !data.length) {
                    self._emptyFolderTip.show();
                } else {
                    self._emptyFolderTip.hide();
                }

                if (self.options.allowPaging) {
                    self._pager.wijpager("option", {
                        pageCount: self._pageCount(),
                        pageIndex: self._pageIndex()
                    });
                }

                self._setItemsViewDragDrop();
            };

            wijfileexplorer.prototype._updateHistory = function () {
                var self = this;
                if (!self._histories) {
                    self._histories = [];
                    self._currentHistoryIndex = -1;
                }

                var currentFolder = self.options.currentFolder, histories = self._histories, length = histories.length;

                if (self._updatingHistoryStep) {
                    var newIndex = self._currentHistoryIndex + self._updatingHistoryStep;
                    self._updatingHistoryStep = 0;
                    if (newIndex >= length || newIndex < 0) {
                        return;
                    }

                    self._currentHistoryIndex = newIndex;
                } else {
                    if (length && currentFolder === histories[length - 1]) {
                        return;
                    }

                    self._currentHistoryIndex++;
                    histories.splice(self._currentHistoryIndex, length - self._currentHistoryIndex, currentFolder);
                }

                self._commands.back.disabled(!self._canBack());
                self._commands.forward.disabled(!self._canForward());
            };

            wijfileexplorer.prototype._canBack = function () {
                var self = this;
                return self._histories && self._histories.length > 1 && self._currentHistoryIndex > 0;
            };

            wijfileexplorer.prototype._canForward = function () {
                var self = this;
                return self._histories && self._histories.length > 1 && self._currentHistoryIndex < self._histories.length - 1;
            };

            wijfileexplorer.prototype._showCurrentFolderTreeNode = function () {
                var self = this;
                self._expand(self._getParentNodeByPath(self.options.currentFolder), function () {
                    return self._selectCurrentFolderTreeNode();
                });
            };

            wijfileexplorer.prototype._expandWithExistedNodes = function (node) {
                while (node) {
                    if (!node.options.expanded) {
                        node.expand();
                    }

                    node = this._getParentNodeByPath(node.options.value);
                }
            };

            wijfileexplorer.prototype._updateTreeViewData = function (path, data) {
                var self = this, currentNode = self._getNodeByPath(path) || self._treeView.data("wijmoWijtree");

                data = data || [];
                self._setTreeViewNodes(self._getFolderData(path, data), currentNode);
                self._setTreeViewDragDrop();
            };

            wijfileexplorer.prototype._getParentNodeByPath = function (path) {
                return path ? this._getNodeByPath(getParentPath(path)) : null;
            };

            wijfileexplorer.prototype._getNodeByPath = function (path, nodes) {
                var self = this;
                if (!nodes) {
                    nodes = self._treeView.wijtree('getNodes');
                }
                for (var i = 0; i < nodes.length; i++) {
                    var item = nodes[i];
                    if (item.options.value == path)
                        return item;
                    var children = item.getNodes();
                    if (children.length > 0) {
                        var result = self._getNodeByPath(path, children);
                        if (null == result)
                            continue;
                        else
                            return result;
                    }
                }
                return null;
            };

            wijfileexplorer.prototype._updateCommandsForOperatingItems = function () {
                var self = this, operatingItems = self._getOperatingItems(), commands = self._commands;
                commands.rename.disabled(self._isRootPath(operatingItems[0].path));
                commands["delete"].disabled(self._hasRootPath(operatingItems));
            };

            wijfileexplorer.prototype._layoutOptionsUpdated = function (modeChanged) {
                var self = this, o = self.options, wijCSS = o.wijCSS, addressBar = self.element.find("." + css.addressBar), splitter = self.element.find("." + css.splitterV), splitterVPanel1 = self.element.find("." + css.splitterVPanel1), splitterVPanel2 = self.element.find("." + css.splitterVPanel2), splitterVPanel1Content = self.element.find("." + css.splitterVPanel1Content), splitterVPanel2Content = self.element.find("." + css.splitterVPanel2Content), shouldShowToolbar = self._isVisibleControl(visibleControls.toolbar), shouldShowAddressBox = self._isVisibleControl(visibleControls.addressBox), shouldShowDetailView = self._isVisibleControl(visibleControls.detailView) && o.mode === explorerMode["default"] && o.viewMode === viewMode.detail, shouldShowThumbnailView = self._isVisibleControl(visibleControls.thumbnailView) && o.mode === explorerMode["default"] && o.viewMode === viewMode.thumbnail, shouldShowViewModeBtns = self._isVisibleControl(visibleControls.detailView) && self._isVisibleControl(visibleControls.thumbnailView) && o.mode === explorerMode["default"], shouldShowTreeView = self._isVisibleControl(visibleControls.treeView), shouldShowContextMenu = self._isVisibleControl(visibleControls.contextMenu), shouldShowFilterBox = self._isVisibleControl(visibleControls.filterBox) && (shouldShowDetailView || shouldShowThumbnailView), setDetailViewBtn = self._toolbar.children("." + css.toolbarSetDetailViewMode), setThumbnailViewBtn = self._toolbar.children("." + css.toolbarSetThumbnailViewMode), oldShowingControls = self._showingControls, oldShowingSplitter = oldShowingControls[visibleControls.treeView] && (oldShowingControls[visibleControls.detailView] || oldShowingControls[visibleControls.thumbnailView]), showingSplitter = shouldShowTreeView && (shouldShowDetailView || shouldShowThumbnailView), bottomControlHeight;

                self._showingControls = {};
                self._showingControls[visibleControls.contextMenu] = shouldShowContextMenu;

                self._showingControls[visibleControls.toolbar] = shouldShowToolbar;
                if (shouldShowToolbar) {
                    self._toolbar.show();
                } else {
                    self._toolbar.hide();
                }

                self._showingControls[visibleControls.addressBox] = shouldShowAddressBox;
                if (shouldShowAddressBox) {
                    self._addressBox.show();
                    self._addressBox.parent().show();
                    if (!shouldShowFilterBox) {
                        self._addressBox.parent().addClass(css.addressBarFullWidth);
                    } else {
                        self._addressBox.parent().removeClass(css.addressBarFullWidth);
                    }
                } else {
                    self._addressBox.hide();
                    self._addressBox.parent().hide();
                }

                self._showingControls[visibleControls.filterBox] = shouldShowFilterBox;
                if (shouldShowFilterBox) {
                    self._filterBox.show();
                    self._filterBox.parent().show();
                    if (!shouldShowAddressBox) {
                        self._filterBox.parent().addClass(css.addressBarFullWidth);
                    } else {
                        self._filterBox.parent().removeClass(css.addressBarFullWidth);
                    }
                } else {
                    self._filterBox.hide();
                    self._filterBox.parent().hide();
                }

                if (shouldShowAddressBox || shouldShowFilterBox) {
                    addressBar.show();
                } else {
                    addressBar.hide();
                }

                bottomControlHeight = self.element.height() - (self._toolbar.is(":visible") ? self._toolbar.height() : 0) - (addressBar.is(":visible") ? addressBar.height() : 0);

                splitterVPanel1Content.height(bottomControlHeight);
                splitterVPanel2Content.height(bottomControlHeight);
                if (oldShowingSplitter !== showingSplitter) {
                    splitterVPanel1Content.detach();
                    splitterVPanel2Content.detach();
                    if (showingSplitter) {
                        splitterVPanel1Content.appendTo(splitterVPanel1);
                        splitterVPanel2Content.appendTo(splitterVPanel2);
                    } else {
                        splitterVPanel1Content.appendTo(self.element);
                        splitterVPanel2Content.appendTo(self.element);
                    }
                }

                if (showingSplitter) {
                    splitterVPanel1.height(bottomControlHeight);
                    splitterVPanel2.height(bottomControlHeight);
                    splitter.height(bottomControlHeight).wijsplitter("option", "splitterDistance", o.treePanelWidth).show();
                } else {
                    splitter.hide();
                }

                self._showingControls[visibleControls.treeView] = shouldShowTreeView;
                if (shouldShowTreeView) {
                    self._treeView.show();
                    splitterVPanel1Content.show();
                } else {
                    self._treeView.hide();
                    splitterVPanel1Content.hide();
                }

                self._showingControls[visibleControls.detailView] = shouldShowDetailView;
                if (shouldShowDetailView) {
                    self._detailView.show();
                    self._detailView.parent().show();
                } else {
                    self._detailView.hide();
                    self._detailView.parent().hide();
                }

                self._showingControls[visibleControls.thumbnailView] = shouldShowThumbnailView;
                if (shouldShowThumbnailView) {
                    self._thumbnailView.show();
                } else {
                    self._thumbnailView.hide();
                }

                if (shouldShowDetailView || shouldShowThumbnailView) {
                    splitterVPanel2Content.show();
                } else {
                    splitterVPanel2Content.hide();
                }

                if (shouldShowViewModeBtns) {
                    setDetailViewBtn.show();
                    setThumbnailViewBtn.show();
                } else {
                    setDetailViewBtn.hide();
                    setThumbnailViewBtn.hide();
                }

                if (o.viewMode === viewMode.thumbnail) {
                    setDetailViewBtn.removeClass(wijCSS.stateActive);
                    setThumbnailViewBtn.addClass(wijCSS.stateActive);
                } else {
                    setDetailViewBtn.toggleClass(wijCSS.stateActive);
                    setThumbnailViewBtn.removeClass(wijCSS.stateActive);
                }

                if (self.options.allowPaging) {
                    self._pager.show();
                } else {
                    self._pager.hide();
                }

                if (modeChanged) {
                    self._refreshRoot();
                } else if (shouldShowDetailView || shouldShowThumbnailView) {
                    self._updateItemsView();
                }
            };

            wijfileexplorer.prototype._rootPathsUpdated = function () {
                var self = this;

                // reset history list
                self._histories = [];
                self._currentHistoryIndex = -1;

                self._refreshRoot();
            };

            wijfileexplorer.prototype._refreshRoot = function () {
                var self = this;

                // reset data
                self._data(null);

                // reset currentFolder
                self.options.currentFolder = null;
                self._initDataOptions();

                // reset nodes in tree view
                self._updateTreeViewData(null, []);
                self._createRootNodes();

                // load current folder data
                self._loadCurrentFolder();
            };

            //End Options
            //Begin Events
            wijfileexplorer.prototype._triggerFiltering = function (data) {
                return this._trigger("filtering", null, data);
            };

            wijfileexplorer.prototype._triggerFiltered = function (data) {
                this._trigger("filtered", null, data);
            };

            wijfileexplorer.prototype._triggerItemDeleting = function (data) {
                return this._trigger("itemDeleting", null, data);
            };

            wijfileexplorer.prototype._triggerItemDeleted = function (data) {
                this._trigger("itemDeleted", null, data);
            };

            wijfileexplorer.prototype._triggerItemMoving = function (data) {
                return this._trigger("itemMoving", null, data);
            };

            wijfileexplorer.prototype._triggerItemMoved = function (data) {
                this._trigger("itemMoved", null, data);
            };

            wijfileexplorer.prototype._triggerItemPasting = function (data) {
                return this._trigger("itemPasting", null, data);
            };

            wijfileexplorer.prototype._triggerItemPasted = function (data) {
                this._trigger("itemPasted", null, data);
            };

            wijfileexplorer.prototype._triggerItemCopying = function (data) {
                return this._trigger("itemCopying", null, data);
            };

            wijfileexplorer.prototype._triggerItemCopied = function (data) {
                this._trigger("itemCopied", null, data);
            };

            wijfileexplorer.prototype._triggerItemRenaming = function (data) {
                return this._trigger("itemRenaming", null, data);
            };

            wijfileexplorer.prototype._triggerItemRenamed = function (data) {
                this._trigger("itemRenamed", null, data);
            };

            wijfileexplorer.prototype._triggerNewFolderCreating = function (data) {
                return this._trigger("newFolderCreating", null, data);
            };

            wijfileexplorer.prototype._triggerNewFolderCreated = function (data) {
                this._trigger("newFolderCreated", null, data);
            };

            wijfileexplorer.prototype._triggerErrorOccurred = function (data) {
                return this._trigger("errorOccurred", null, data);
            };

            wijfileexplorer.prototype._triggerItemSelected = function (data) {
                this._trigger("itemSelected", null, data);
            };

            wijfileexplorer.prototype._triggerFileOpening = function (data) {
                return this._trigger("fileOpening", null, data);
            };

            wijfileexplorer.prototype._triggerFileOpened = function (data) {
                this._trigger("fileOpened", null, data);
            };

            wijfileexplorer.prototype._triggerFolderChanged = function (data) {
                this._trigger("folderChanged", null, data);
            };

            wijfileexplorer.prototype._triggerFolderLoaded = function (data) {
                this._trigger("folderLoaded", null, data);
            };

            //End Events
            // Begin Ajax
            wijfileexplorer.prototype._createFakeResponse = function () {
                return {
                    success: true,
                    hostUri: "",
                    items: this._data()
                };
            };

            wijfileexplorer.prototype._tryAjax = function (commandName, data, context, onSuccess, onError, onWithoutAjax) {
                var self = this;

                if (!self._enableAjax()) {
                    if (onWithoutAjax) {
                        onWithoutAjax();
                    } else {
                        onSuccess(self._createFakeResponse());
                    }
                    return;
                }

                if (!self._ajaxActions) {
                    self._ajaxActions = [];
                }

                var endAction = function () {
                    self._ajaxActionEnded();
                    self._ajaxActions.shift();
                    self._nextAjaxAction();

                    if (self._ajaxActions && self._ajaxActions.length === 0) {
                        self._restoreFocus && self._restoreFocus();
                    }
                }, errorAction = function (result) {
                    if (!onError || !onError(result)) {
                        var msg = (typeof result === "string") ? result : result.error;
                        msg = msg || "Unknown error.";
                        self._processError(msg);
                    }
                }, success = function (result) {
                    if (result) {
                        if (result.success && onSuccess) {
                            onSuccess(result);
                        } else if (!result.success) {
                            errorAction(result);
                        }
                    }

                    endAction();
                }, error = function (result) {
                    errorAction(result);
                    endAction();
                };

                data = data || {};
                data.commandName = commandName;
                self._ajaxActions.push(self._createAjaxAction(data, context, success, error));
                if (self._ajaxActions.length === 1) {
                    self._nextAjaxAction();
                }
            };

            wijfileexplorer.prototype._processError = function (error) {
                if (this._triggerErrorOccurred({ error: error }) === false) {
                    return;
                }

                alert(error);
            };

            wijfileexplorer.prototype._nextAjaxAction = function () {
                var self = this;
                if (self._ajaxActions.length > 0) {
                    self._ajaxActions[0]();
                    self._ajaxActionStarted();
                }
            };

            wijfileexplorer.prototype._ajaxActionStarted = function () {
                var self = this;
                self._showLoadingLayer();
            };

            wijfileexplorer.prototype._ajaxActionEnded = function () {
                var self = this;
                self._hideLoadingLayer();
            };

            wijfileexplorer.prototype._isLoading = function () {
                var self = this;
                return self._showLoadingLayerTimer != null || self._isLoadingLayerShowing();
            };

            wijfileexplorer.prototype._isLoadingLayerShowing = function () {
                var self = this;
                return self._loadingLayer && self._loadingLayer.length && self._loadingLayer.is(":visible");
            };

            wijfileexplorer.prototype._hideLoadingLayer = function () {
                var self = this;
                if (self._showLoadingLayerTimer != null) {
                    clearTimeout(self._showLoadingLayerTimer);
                    self._showLoadingLayerTimer = null;
                }

                if (self._isLoadingLayerShowing()) {
                    self._loadingLayer.hide();
                }
            };

            wijfileexplorer.prototype._showLoadingLayer = function () {
                var self = this, wijCSS = this.options.wijCSS;

                if (self._showLoadingLayerTimer != null || (self._loadingLayer && self._loadingLayer.length && self._loadingLayer.is(":visible"))) {
                    return;
                }

                self._showLoadingLayerTimer = setTimeout(function () {
                    if (!self._loadingLayer || !self._loadingLayer.length) {
                        self._loadingLayer = $("<div>").append("<div class=\"" + css.loadingOverlay + " " + wijCSS.overlay + "\"></div>" + "<span class=\"" + css.loadingText + " " + wijCSS.content + " " + wijCSS.cornerAll + "\">" + "<span class=\"" + wijCSS.icon + " " + wijCSS.iconClock + "\"></span>" + self.localizeString("loadingText", "Loading...") + "</span>");
                        self._loadingLayer.hide();
                        self._loadingLayer.appendTo(self.element);
                    }

                    self._loadingLayer.show();
                    self._loadingLayer.find("> ." + css.loadingText).position({
                        my: "center",
                        at: "center center",
                        of: self.element,
                        collision: "none"
                    });

                    self._showLoadingLayerTimer = null;
                }, showLoadingTimout);
            };

            /** @ignore */
            wijfileexplorer.prototype._createAjaxAction = function (data, context, success, error) {
                var _this = this;
                return function () {
                    $.ajax({
                        url: _this.options.actionUri,
                        data: data,
                        context: context,
                        success: success,
                        error: error,
                        dataType: "json",
                        cache: false
                    });
                };
            };

            /** @ignore */
            wijfileexplorer.prototype._enableAjax = function () {
                return this.options.actionUri !== undefined;
            };

            //End Ajax
            wijfileexplorer.prototype._isRootPath = function (path) {
                return $.inArray(path, this._getRootPaths()) > -1;
            };

            wijfileexplorer.prototype._hasRootPath = function (items) {
                var self = this;
                for (var index = 0, length = items.length; index < length; index++) {
                    var item = items[index], path = $.isPlainObject(item) ? item.path : item;
                    if (self._isRootPath(path)) {
                        return true;
                    }
                }

                return false;
            };

            wijfileexplorer.prototype._getParentPath = function (path) {
                return this._isRootPath(path) ? null : getParentPath(path);
            };

            /** @ignore */
            wijfileexplorer.prototype.localizeString = function (key, defaultValue) {
                var localization = this._getLocalization();
                if (localization && localization[key]) {
                    return localization[key];
                }
                return defaultValue;
            };

            /** @ignore */
            wijfileexplorer.prototype._getLocalization = function () {
                return this.options.localization;
            };
            return wijfileexplorer;
        })(wijmo.wijmoWidget);
        fileexplorer.wijfileexplorer = wijfileexplorer;

        /** @ignore */
        (function (OperatingArea) {
            OperatingArea[OperatingArea["TreeView"] = 0] = "TreeView";
            OperatingArea[OperatingArea["ItemsView"] = 1] = "ItemsView";
        })(fileexplorer.OperatingArea || (fileexplorer.OperatingArea = {}));
        var OperatingArea = fileexplorer.OperatingArea;

        

        

        

        

        

        var fileExplorerCommand = (function () {
            function fileExplorerCommand(name, action, text) {
                this.name = name;
                this.action = action;
                this.text = text;
                this._bindElements = [];
            }
            fileExplorerCommand.prototype.disabled = function (value) {
                var self = this;
                if (value === undefined) {
                    return self._disabled;
                }

                if (self._disabled !== value) {
                    self._disabled = value;
                    self._onDisabledChanged();
                }
            };

            fileExplorerCommand.prototype._onDisabledChanged = function () {
                var self = this, disabledCss = $.wijmo.wijCSS.stateDisabled;
                $.each(self._bindElements, function (index, item) {
                    if (self.disabled()) {
                        item.addClass(disabledCss);
                    } else {
                        item.removeClass(disabledCss);
                    }
                });
            };

            fileExplorerCommand.prototype.addBindElement = function (element) {
                this._bindElements.push(element);
            };

            fileExplorerCommand.prototype.removeBindElement = function (element) {
                var elements = this._bindElements, index = $.inArray(element, elements);
                if (index > -1) {
                    elements.splice(index, 1);
                }
            };

            fileExplorerCommand.prototype.execute = function (args) {
                var self = this;
                if (!self._disabled) {
                    self.action(args);
                }
            };
            return fileExplorerCommand;
        })();

        

        var wijfileexplorer_options = (function () {
            function wijfileexplorer_options() {
                /** A value that determines the explorer mode of the wijfileexplorer widget.
                * Possible values are:
                * 'default' and 'fileTree'
                */
                this.mode = explorerMode["default"];
                /** A string array that determines the patterns of files that are shown, usually the file extensions.
                * @remark The default search pattern is "*.*".
                */
                this.searchPatterns = defaultSearchPatterns.slice();
                /** A string value that determines the ViewMode of the wijfileexplorer widget.
                * Possible values are:
                * 'detail' and 'thumbnail'
                */
                this.viewMode = viewMode.detail;
                /** A value that determines whether to allow changing the extension of the file while renaming. */
                this.allowFileExtensionRename = false;
                /** A value that determines whether to allow multiple items selection. */
                this.allowMultipleSelection = false;
                /** A value that determines whether to use paging. */
                this.allowPaging = false;
                /** A value that determines the number of items loaded per page when using paging. */
                this.pageSize = 10;
                /** A object that determines the shortcuts. */
                this.shortcuts = $.extend({}, defaultShortcuts);
                /** A value that determines whether to allow opening a new window with the file. */
                this.enableOpenFile = true;
                /** A value that determines whether to allow creating new folders. */
                this.enableCreateNewFolder = true;
                /** A value that determines whether to allow copying of files/folders. */
                this.enableCopy = true;
                /** A value that determines whether to perform the filtering after the 'Enter' key is pressed. */
                this.enableFilteringOnEnterPressed = false;
                /** A value that determines which components will be shown in wijfileexplorer. */
                this.visibleControls = [
                    visibleControls.addressBox,
                    visibleControls.contextMenu,
                    visibleControls.detailView,
                    visibleControls.filterBox,
                    visibleControls.thumbnailView,
                    visibleControls.toolbar,
                    visibleControls.treeView
                ].join(",");
                /** A value that determines the width of the TreeView. */
                this.treePanelWidth = 200;
                /** A value that determines whether or not to disable the wijfileexplorer widget. */
                this.disabled = false;
                /** The itemSelected event handler.
                * A function called after the item is selected.
                * @event
                * @data {object} data Contains the path of the item.
                */
                this.itemSelected = null;
                /** The fileOpened event handler.
                * A function called after the file is opened.
                * @event
                * @data {object} data Contains the path of the file.
                */
                this.fileOpened = null;
                /** The fileOpening event handler.
                * A function called before the file is opened.
                * @event
                * @data {object} data Contains the path of the file.
                */
                this.fileOpening = null;
                /** The itemCopying event handler.
                * A function called before the item is copied.
                * @event
                * @data {object} data Contains the path of the item.
                */
                this.itemCopying = null;
                /** The itemCopied event handler.
                * A function called after the item is copied.
                * @event
                * @data {object} data Contains the path of the item.
                */
                this.itemCopied = null;
                /** The itemRenaming event handler.
                * A function called before the item is renamed.
                * @event
                * @data {object} data Contains the path of the item and the new name.
                */
                this.itemRenaming = null;
                /** The itemRenamed event handler.
                * A function called after the item is renamed.
                * @event
                * @data {object} data Contains the path of the item and the new name.
                */
                this.itemRenamed = null;
                /** The itemDeleting event handler.
                * A function called before the item is deleted.
                * @event
                * @data {object} data Contains the path of the item.
                */
                this.itemDeleting = null;
                /** The itemDeleted event handler.
                * A function called after the item is deleted.
                * @event
                * @data {object} data Contains the path of the item.
                */
                this.itemDeleted = null;
                /** The errorOccurred event handler.
                * A function called when an error occurs.
                * @event
                * @data {object} data Contains the error message.
                */
                this.errorOccurred = null;
                /** The itemPasting event handler.
                * A function called before the item is pasted.
                * @event
                * @data {object} data Contains the path of the item and the target folder path.
                */
                this.itemPasting = null;
                /** The itemPasted event handler.
                * A function called after the item is pasted.
                * @event
                * @data {object} data Contains the path of the item and the target folder path.
                */
                this.itemPasted = null;
                /** The itemMoving event handler.
                * A function called before the item is moved.
                * @event
                * @data {object} data Contains the path of the item and the target folder path.
                */
                this.itemMoving = null;
                /** The itemMoved event handler.
                * A function called after the item is moved.
                * @event
                * @data {object} data Contains the path of the item and the target folder path.
                */
                this.itemMoved = null;
                /** The newFolderCreating event handler.
                * A function called before a new folder is created.
                * @event
                * @data {object} data Contains the path of the new folder.
                */
                this.newFolderCreating = null;
                /** The newFolderCreated event handler.
                * A function called after a new folder is created.
                * @event
                * @data {object} data Contains the path of the new folder.
                */
                this.newFolderCreated = null;
                /** The folderChanged event handler.
                * A function called after current folder is changed.
                * @event
                * @data {object} data Contains new and old path of the current folder.
                */
                this.folderChanged = null;
                /** The folderLoaded event handler.
                * A function called after the current folder is loaded.
                * @event
                * @data {object} data Contains the path of the current folder.
                */
                this.folderLoaded = null;
                /** The filtering event handler.
                * A function called before filtering.
                * @event
                * @data {object} data Contains filter expression and the path of current folder.
                */
                this.filtering = null;
                /** The filtered event handler.
                * A function called after filtering.
                * @event
                * @data {object} data Contains filter expression and the path of current folder.
                */
                this.filtered = null;
            }
            return wijfileexplorer_options;
        })();
        fileexplorer.wijfileexplorer_options = wijfileexplorer_options;
        ;

        wijfileexplorer.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijfileexplorer_options());
        wijfileexplorer.prototype.widgetEventPrefix = "wijfileexplorer";
        $.wijmo.registerWidget("wijfileexplorer", wijfileexplorer.prototype);
    })(wijmo.fileexplorer || (wijmo.fileexplorer = {}));
    var fileexplorer = wijmo.fileexplorer;
})(wijmo || (wijmo = {}));

