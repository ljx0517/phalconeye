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
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/// <reference path="../wijtextbox/jquery.wijmo.wijtextbox.ts" />
/// <reference path="../wijutil/jquery.wijmo.wijutil.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals jQuery, window, XMLHttpRequest*/
    /*
    * Depends:
    *   jquery.ui.core.js
    *   jquery.ui.widget.js
    */
    (function (_tree) {
        "use strict";
        var $ = jQuery, widgetName = "wijtree", nodeWidgetName = "wijtreenode", localCSS = {
            wijtreeInner: "wijmo-wijtree-inner"
        }, formatString = function (format) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            return format.replace(/{(\d+)}/g, function (match, index) {
                return typeof args[index] !== 'undefined' ? args[index] : match;
            });
        }, generateTreeCheckMarkup = function (checked, checkState) {
            var css = wijtreenode.prototype.options.wijCSS, html = "<div class='wijmo-checkbox ui-widget' role='checkbox'><div class='wijmo-checkbox-box ui-widget ui-corner-all {0}' style='position: relative;'><span class='{1}'></span></div></div>", stateClasses = [css.stateDefault], iconClasses = ["wijmo-checkbox-icon"];

            if (checkState === "triState" || checkState === "indeterminate") {
                stateClasses.push(css.stateActive);
                iconClasses.push(css.icon);
                iconClasses.push(css.iconStop);
            } else if (checked) {
                stateClasses.push(css.stateActive);
                iconClasses.push(css.icon);
                iconClasses.push(css.iconCheck);
            }
            return formatString(html, stateClasses.join(" "), iconClasses.join(" "));
        }, generateItemsMarkup = function (items, showExpandCollapse, showCheckBoxes) {
            if (typeof showCheckBoxes === "undefined") { showCheckBoxes = false; }
            var lis = "", opts = $.wijmo.wijtreenode.prototype.options;

            $.each(items, function (i, item) {
                if (!$.isPlainObject(item)) {
                    return true;
                }
                var u = item.navigateUrl || "#", hasChildren = item.nodes && item.nodes.length > 0, expanded = (item.expanded === null || item.expanded === undefined) ? opts.expanded : item.expanded, wijCSS = (item.wijCSS === null || item.wijCSS === undefined) ? opts.wijCSS : item.wijCSS, li = "<li class='" + (hasChildren ? "wijmo-wijtree-parent" : "wijmo-wijtree-item") + "'><div class='wijmo-wijtree-node " + wijCSS.stateDefault + (hasChildren ? " wijmo-wijtree-header " : "") + (showExpandCollapse && hasChildren ? (expanded ? "wijmo-state-expanded" : "wijmo-state-collapsed") : "") + "' role='treeitem' aria-expanded='false' aria-checked='false' aria-selected='false'><span class='" + localCSS.wijtreeInner + " " + wijCSS.wijtreeInner + " " + wijCSS.helperClearFix + " " + wijCSS.cornerAll + "'>";

                if (hasChildren) {
                    li += "<span class='wijmo-wijtree-hitarea " + (showExpandCollapse ? (wijCSS.icon + " " + (expanded ? wijCSS.iconArrowRightDown : wijCSS.iconArrowRight)) : "") + "'></span>";
                }
                li += "<span class='wijmo-wijtree-nodeimage'></span>";
                if (showCheckBoxes) {
                    li += generateTreeCheckMarkup(item.checked, item.checkState);
                }
                li += $.browser.safari ? "<a href='" + u + "'>" : "<a class='wijmo-wijtree-link' href='" + u + "'>";
                if (typeof item.text === "string" && item.text) {
                    li += "<span>" + item.text + "</span>";
                }
                li += "</a></span></div>";
                if (hasChildren) {
                    li += "<ul class='wijmo-wijtree-list wijmo-wijtree-child " + wijCSS.helperReset + "'";
                    if (showExpandCollapse && !expanded) {
                        li += " style='display: none'";
                    }
                    li += ">";
                    li += generateItemsMarkup(item.nodes, showExpandCollapse, showCheckBoxes);
                    li += "</ul>";
                }
                li += "</li>";
                lis += li;
            });

            return lis;
        }, createNodeWidget = function ($li, options, owner, nodeWidgetName, treeWidgetFullName) {
            if ($.fn[nodeWidgetName]) {
                $li.data("owner", owner);
                if (!!options && $.isPlainObject(options)) {
                    $.extend(options, { treeClass: treeWidgetFullName });
                    $li[nodeWidgetName](options);
                } else {
                    $li[nodeWidgetName]({ treeClass: treeWidgetFullName });
                }
            }
            return $li;
        }, createTreeNodeWidget = function ($li, options, owner, nodeWidgetName, treeWidgetFullName) {
            if (!$.fn[nodeWidgetName]) {
                return null;
            }
            createNodeWidget($li, options, owner, nodeWidgetName, treeWidgetFullName);
            return $li.data($li.data("widgetName"));
        }, setHTML = function (target, content) {
            if (content == undefined) {
                return;
            }
            return target.each(function () {
                this.innerHTML = '';
                $(this).append(content);
            });
        }, getTreeNodeWidget = function ($ele) {
            var treeNode = $ele.data($ele.data("widgetName"));
            return $.isPlainObject(treeNode) ? null : treeNode;
        };

        /** @widget */
        var wijtree = (function (_super) {
            __extends(wijtree, _super);
            function wijtree() {
                _super.apply(this, arguments);
            }
            wijtree.prototype._create = function () {
                if (window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                this._initState();
                this._createTree();
                this._attachEvent();
                this._attachNodeEvent();
                _super.prototype._create.call(this);
            };

            wijtree.prototype._setOption = function (key, value) {
                var self = this, isResetHitArea = false, o = self.options, check;

                switch (key) {
                    case "allowDrag":
                        self._setAllowDrag(value);
                        break;
                    case "allowDrop":
                        self._setAllowDrop(value);
                        break;
                    case "showCheckBoxes":
                        self._setCheckBoxes(value);
                        break;
                    case "showExpandCollapse":
                        if (self.options.showExpandCollapse !== value) {
                            isResetHitArea = true;
                        }
                        break;
                    default:
                        break;
                }
                _super.prototype._setOption.call(this, key, value);

                if (key === "nodes") {
                    if (value && value.length) {
                        self._createChildNodes();
                    } else {
                        self._clearChildNodes();
                    }
                }

                if (isResetHitArea === true) {
                    self._setHitArea(value);
                }
            };

            wijtree.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._toggleDisableTree(true);
            };

            wijtree.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._toggleDisableTree(false);
            };

            wijtree.prototype._toggleDisableTree = function (disabled) {
                this._setAllowDrag(!disabled);
            };

            wijtree.prototype._initState = function () {
                var self = this, o = self.options;
                self._selectedNodes = [];
                self._checkedNodes = [];
                if (!o.nodes) {
                    o.nodes = [];
                }

                self._insertPosition = "unKnown"; //end,after,before
                self.nodeWidgetName = "wijtreenode";
            };

            wijtree.prototype._initVariable = function () {
                var self = this;
                self._creatingNode = false;
                self._allNodesCreated = false;
                self._initNodesCreated = false;
                self._initializingTree = false;
                self._nextNodeIndex = 0;
                self._nodesCntPerPage = 0;
                self._totalNodesCreated = 0;
            };

            wijtree.prototype._createTree = function () {
                var self = this, o = self.options, treeClass = [
                    "wijmo-wijtree", o.wijCSS.widget, o.wijCSS.content,
                    o.wijCSS.helperClearFix, o.wijCSS.cornerAll].join(' '), nodesClass = [
                    "wijmo-wijtree-list ", o.wijCSS.helperReset,
                    (o.showExpandCollapse ? "" : "wijmo-wijtree-allexpanded")].join(' '), ele = self.element;

                if (ele.is("ul")) {
                    self.$nodes = ele;
                    ele.wrap("<div></div>");
                    self.widgetDom = ele.parent();
                } else if (ele.is("div")) {
                    self.widgetDom = ele;
                    self.$nodes = self.widgetDom.children("ul").eq(0);
                }

                if (self.$nodes.length) {
                    self.widgetDom.addClass(treeClass).attr({
                        role: "tree",
                        "aria-multiselectable": true
                    });
                    self.$nodes.addClass(nodesClass);

                    self._createChildNodes();
                    self.widgetDom.append($("<div>").css("clear", "both"));
                }
            };

            wijtree.prototype._clearChildNodes = function () {
                this.$nodes.empty();
                this.nodes && this.nodes.length && (this.nodes.length = 0);
            };

            wijtree.prototype._getItemHeight = function () {
                return this.$nodes.children("li:first").children(".wijmo-wijtree-node").outerHeight(true);
            };

            wijtree.prototype._createNodesAtIdle = function () {
                if (!this._creatingNode) {
                    this._createNodesPartially(false);
                }
                return;
            };

            wijtree.prototype._createNodesPartially = function (createRest) {
                this._creatingNode = true;
                if (this._allNodesCreated || !this.options.nodes || !this.options.nodes.length) {
                    this._unbindCreateNodesEvent();
                    return;
                }
                var self = this, options = {
                    nIndex: undefined,
                    htmlGenerated: true
                }, nodes, lis = self.$nodes.children("li"), widget, currentNodesCnt = self._totalNodesCreated;

                nodes = self._getField("nodes");
                if (!nodes) {
                    return;
                }
                while (self._nextNodeIndex < lis.length) {
                    if (nodes[self._nextNodeIndex] != null) {
                        self._nextNodeIndex++;
                        continue;
                    }
                    options.nIndex = self._nextNodeIndex;
                    widget = createTreeNodeWidget($(lis[self._nextNodeIndex]), options, self, self.nodeWidgetName, self.widgetFullName);
                    nodes[self._nextNodeIndex] = widget;
                    self._nextNodeIndex++;
                    if (!createRest && currentNodesCnt + self._nodesCntPerPage < self._totalNodesCreated) {
                        break;
                    }
                }
                if (this._nextNodeIndex >= lis.length) {
                    this._unbindCreateNodesEvent();
                    this._allNodesCreated = true;
                }
                this._creatingNode = false;
            };

            wijtree.prototype._bindCreateNodesEvent = function () {
                var self = this;
                $(document).bind("scroll." + this.widgetName, $.proxy(self._createNodesAtIdle, self)).bind("mousemove." + this.widgetName, $.proxy(self._createNodesAtIdle, self)).bind("click." + this.widgetName, $.proxy(self._createNodesAtIdle, self)).bind("keydown." + this.widgetName, $.proxy(self._createNodesAtIdle, self));
            };

            wijtree.prototype._unbindCreateNodesEvent = function () {
                $(document).unbind('.' + this.widgetName);
            };

            wijtree.prototype._createChildNodes = function () {
                var self = this, o = self.options, options = {
                    nIndex: undefined,
                    htmlGenerated: false
                }, nodeWidgets = [], $ul = self.$nodes, lis, widget, $li;

                if (o.nodes && o.nodes.length) {
                    self._initVariable();
                    setHTML($ul, generateItemsMarkup(o.nodes, o.showExpandCollapse, o.showCheckBoxes));
                    self._nodesCntPerPage = document.documentElement.clientHeight / self._getItemHeight();
                    options.htmlGenerated = true;
                    self._initializingTree = true;
                    lis = $ul.children("li");
                    lis.each(function (idx, ele) {
                        $li = $(ele);

                        options.nIndex = idx;
                        if (!self._initNodesCreated) {
                            widget = createTreeNodeWidget($li, options, self, self.nodeWidgetName, self.widgetFullName);
                            self._nextNodeIndex++;
                        } else {
                            widget = null;
                            self._allNodesCreated = false;
                        }
                        nodeWidgets.push(widget);
                        if (self._totalNodesCreated >= self._nodesCntPerPage * 2) {
                            self._initNodesCreated = true;
                        }
                    });
                    self._initializingTree = false;
                    self._allNodesCreated = self._nextNodeIndex >= lis.length;
                    if (!self._allNodesCreated) {
                        self._bindCreateNodesEvent();
                    }
                } else {
                    lis = $ul.children("li");
                    lis.each(function (idx, ele) {
                        $li = $(ele);

                        widget = createTreeNodeWidget($li, options, self, self.nodeWidgetName, self.widgetFullName);
                        nodeWidgets.push(widget);
                        if (!$.browser.safari && widget.$navigateUrl && widget.$navigateUrl.length && widget.$navigateUrl.is("a")) {
                            widget.$navigateUrl.addClass("wijmo-wijtree-link");
                        }
                        o.nodes.push(widget.options);
                    });
                }

                self._hasChildren = nodeWidgets.length > 0;
                self._setField("nodes", nodeWidgets);
                self.nodes = nodeWidgets;
            };

            wijtree.prototype._createNodeWidget = function ($li, options) {
                return createNodeWidget($li, options, this, this.nodeWidgetName, this.widgetFullName);
            };

            /*tree event*/
            wijtree.prototype._attachEvent = function () {
                var self = this;

                if (self.options.allowDrop) {
                    self._attachDroppable();
                }
            };

            wijtree.prototype._attachDroppable = function () {
                var self = this, o = self.options, droppable = o.droppable, options = {
                    accept: "li",
                    scope: "tree"
                }, events = {
                    drop: function (event, ui) {
                        var d = ui.draggable, dragNode = self._getNodeWidget(d), dropNode, position, oldOwner, parent, brothers, idx, oldPosition, newPosition = -1, oldShowCheckBoxes = dragNode._tree.options.showCheckBoxes;

                        if (self._trigger("nodeBeforeDropped", event, ui) === false || !dragNode || self._isDisabled()) {
                            self._isDragging = false;
                            return;
                        }
                        dropNode = dragNode._dropTarget;
                        position = dragNode._insertPosition;
                        if (dropNode && position !== "unKnown") {
                            oldOwner = dragNode._getOwner();

                            if (oldOwner) {
                                oldPosition = d.index();
                            }

                            /*reset old tree*/
                            dragNode._tree._isDragging = false;

                            if (position === "end") {
                                newPosition = dropNode.getNodes().length;
                                parent = dropNode;
                            } else if (position === "before" || position === "after") {
                                parent = dropNode._getOwner();
                                brothers = parent.getNodes();
                                idx = $.inArray(dropNode, brothers);
                                if (idx !== -1) {
                                    newPosition = position === "before" ? idx : idx + 1;
                                }
                            }

                            if (droppable && $.isFunction(droppable.drop)) {
                                ui["oldParent"] = oldOwner.element;
                                ui["newParent"] = parent.element;
                                ui["oldIndex"] = oldPosition;
                                ui["newIndex"] = newPosition;
                                droppable.drop.call(self.element, event, ui);
                            } else {
                                if (oldOwner) {
                                    oldOwner.remove(d);
                                }
                                if (newPosition !== -1) {
                                    // re-calculate position (when old parent == new parent)
                                    if (position === "before" || position === "after") {
                                        if (idx !== $.inArray(dropNode, brothers)) {
                                            newPosition--;
                                        }
                                    }

                                    // Handling when the drop tree has no child-nodes
                                    if (self.$nodes.children("li").length) {
                                        parent.add(d, newPosition);
                                    } else {
                                        self.add(d, newPosition);
                                    }
                                }
                            }

                            if (oldShowCheckBoxes !== self.options.showCheckBoxes) {
                                dragNode._setCheckBoxes(self.options.showCheckBoxes);
                            }

                            /*reset old tree*/
                            $("a", d).eq(0).blur();
                            if (dragNode.options.selected) {
                                dragNode._setSelected(false);
                            }

                            /*set tree*/
                            setTriState(oldOwner);
                            setTriState(parent);

                            $.extend(ui, {
                                sourceParent: oldOwner ? oldOwner.element : null,
                                sIndex: oldPosition,
                                targetParent: parent.element,
                                tIndex: newPosition,
                                widget: dragNode
                            });
                            self._trigger("nodeDropped", event, ui);
                        }
                    }
                }, setTriState = function (node) {
                    if (!node.element.is(":" + self.widgetFullName) && node.getNodes().length > 0 && node._tree.options.showCheckBoxes && node._tree.options.allowTriState) {
                        node.getNodes()[0]._setParentCheckState();
                    }
                };

                $.extend(options, droppable, events); // mind the order: events must be at last.
                if ($.fn.droppable) {
                    self.widgetDom.droppable(options);
                }
            };

            wijtree.prototype._attachNodeEvent = function () {
                // Note: 1. focus/blur do not support bubbling. 2. focusin/focusout is always available using jQuery, but only in webkit can you get widget from "event.data".
                this.element.bind("focusin." + this.widgetName, $.proxy(this._onFocus, this)).bind("focusout." + this.widgetName, $.proxy(this._onBlur, this)).bind("click." + this.widgetName, $.proxy(this._onClick, this)).bind("mouseover." + this.widgetName, $.proxy(this._onMouseOver, this)).bind("mouseout." + this.widgetName, $.proxy(this._onMouseOut, this)).bind("keydown." + this.widgetName, $.proxy(this._onKeyDown, this));
            };

            wijtree.prototype._onClick = function (event) {
                this._callEvent(event, '_onClick');
                if ($.browser.webkit) {
                    this.widgetDom.focus();
                }
            };

            wijtree.prototype._onFocus = function (event) {
                var $nodeDom;
                if (!event.data) {
                    $nodeDom = this._getNodeByDom(event.target);
                    event.data = $nodeDom.data($nodeDom.data("widgetName"));
                }
                this._callEvent(event, '_onFocus');
            };

            wijtree.prototype._onBlur = function (event) {
                var $nodeDom;
                if (!event.data) {
                    $nodeDom = this._getNodeByDom(event.target);
                    event.data = $nodeDom.data($nodeDom.data("widgetName"));
                }
                this._callEvent(event, '_onBlur');
            };

            wijtree.prototype._onKeyDown = function (event) {
                this._callEvent(event, '_onKeyDown');
            };

            wijtree.prototype._onMouseOut = function (event) {
                this._callEvent(event, '_onMouseOut');
            };

            wijtree.prototype._onMouseOver = function (event) {
                this._callEvent(event, '_onMouseOver');
            };

            wijtree.prototype._callEvent = function (event, type) {
                if (!this._allNodesCreated && this.options.nodes && this.options.nodes.length) {
                    this._createNodesAtIdle();
                }
                var el = event.target, node;
                if (el) {
                    node = this._getNodeWidgetByDom(el);
                    if (node === null) {
                        return;
                    } else if (node._hasChildren && node._getField("nodes")) {
                        if (!node._allNodesCreated && node.options.nodes && node.options.nodes.length) {
                            node._createChildNodesAtIdle();
                        }
                    }
                    node[type](event);
                }
            };

            wijtree.prototype._nodeSelector = function () {
                return ":wijmo-wijtreenode";
            };

            /*public methods*/
            /**
            * The getSelectedNodes method gets the selected nodes.
            * @example $("selector").wijtree("getSelectedNodes");
            * @returns {array}
            */
            wijtree.prototype.getSelectedNodes = function () {
                return this._selectedNodes;
            };

            /**
            * The getCheckedNodes method gets the nodes which are checked.
            * @example $("selector").wijtree("getCheckedNodes");
            * @returns {array}
            */
            wijtree.prototype.getCheckedNodes = function () {
                var self = this, checkedNodes = [], treeNodeWidgetName = self.nodeWidgetName;

                $(self._nodeSelector(), self.element).each(function (idx, ele) {
                    if ($(ele)[treeNodeWidgetName]("option", "checked") && $(ele)[treeNodeWidgetName]("option", "checkState") !== "indeterminate") {
                        checkedNodes.push($(ele));
                    }
                });
                return checkedNodes;
            };

            /**
            * The destroy method will remove the rating functionality completely and will return the element to its pre-init state.
            * @example $("selector").wijtree("destroy");
            */
            wijtree.prototype.destroy = function () {
                var self = this, $nodes = self.$nodes, o = self.options, c = [
                    "wijmo-wijtree", o.wijCSS.widget,
                    o.wijCSS.content, o.wijCSS.helperClearFix, o.wijCSS.cornerAll].join(' ');
                self.widgetDom.removeClass(c).removeAttr("role").removeAttr("aria-multiselectable");

                if (self.widgetDom.data("ui-droppable")) {
                    self.widgetDom.droppable("destroy");
                }

                self._unbindCreateNodesEvent();
                self.element.unbind('.' + self.widgetName);
                self.widgetDom.children("div[style]:last").remove();
                $nodes.removeData("nodes").removeClass("wijmo-wijtree-list" + " " + o.wijCSS.helperReset);
                $nodes.children("li").each(function (idx, ele) {
                    var nodeWidget = self._getNodeWidget($(ele));
                    if (nodeWidget) {
                        nodeWidget.destroy();
                    }
                });
                $.wijmo.wijtree.prototype.options.nodes = null;

                _super.prototype.destroy.call(this);
            };

            /**
            * The add method adds a node to the tree widget.
            * @example $("#tree").wijtree("add", "node 1", 1);
            * @param {string|object} node
            * 1.markup html.such as "<li><a>node</a></li>" as a node.
            * 2.wijtreenode widget.
            * 3.object options according to the options of wijtreenode.
            * 4.node's text.
            * @param {number} position The position to insert at.
            */
            wijtree.prototype.add = function (node, position) {
                var nodeWidget = null, o = {}, $node, self = this, i, originalLength, itemDom, cnodes, $li;

                if ($.browser.safari) {
                    itemDom = "<li><a href='{0}'>{1}</a></li>";
                } else {
                    itemDom = "<li><a href='{0}' class='wijmo-wijtree-link'>{1}</a></li>";
                }
                if (typeof node === "string") {
                    $node = $(itemDom.replace(/\{0\}/, "#").replace(/\{1\}/, node));
                    self._createNodeWidget($node, o);
                    nodeWidget = $node.data($node.data("widgetName"));
                } else if (node.jquery) {
                    if (!node.data("widgetName")) {
                        self._createNodeWidget(node, o);
                    }
                    nodeWidget = node.data(node.data("widgetName"));
                    nodeWidget._setField("owner", self);
                } else if (node.nodeType) {
                    $node = $(node);
                    self._createNodeWidget($node, o);
                    nodeWidget = $node.data($node.data("widgetName"));
                } else if ($.isPlainObject(node)) {
                    $node = $(itemDom.replace(/\{0\}/, node.url ? node.url : "#").replace(/\{1\}/, node.text)); //node
                    node.isAddedNodeWithOptions = true;
                    self._createNodeWidget($node, node);
                    nodeWidget = $node.data($node.data("widgetName"));
                }

                if (nodeWidget === null) {
                    return;
                }
                originalLength = self.nodes.length;
                if (!position || position > originalLength) {
                    if (position !== 0) {
                        position = originalLength;
                    }
                }
                cnodes = nodeWidget.getNodes();
                nodeWidget._tree = self;
                for (i = 0; i < cnodes.length; i++) {
                    cnodes[i]._tree = self;
                }

                if (originalLength > 0 && originalLength !== position) {
                    $li = this.$nodes.find(">li:eq(" + position + ")");
                    if (nodeWidget.element.get(0) !== $li.get(0)) {
                        nodeWidget.element.insertBefore($li);
                    }
                } else {
                    self.$nodes.append(nodeWidget.element);
                }
                self._changeCollection(position, nodeWidget);
                nodeWidget._initNodeClass();
            };

            /**
            * The remove method removes the indicated node from the wijtree element.
            * @example $("#tree").wijtree("remove", 1);
            * @param {number|object} node
            * which node to be removed
            * 1.wijtreenode element.
            * 2.the zero-based index of which node you determined to remove.
            */
            wijtree.prototype.remove = function (node) {
                var idx = -1, nodeWidget, lis = this.$nodes.children("li");
                if (node && node.jquery) {
                    idx = node.index();
                } else if (typeof node === "number") {
                    idx = node;
                }
                if (idx < 0 || idx >= this.nodes.length) {
                    return;
                }
                nodeWidget = this.nodes[idx];
                if (nodeWidget) {
                    nodeWidget.element.detach();
                } else {
                    $(lis[idx]).detach();
                }
                this._changeCollection(idx);
            };

            wijtree.prototype._changeCollection = function (idx, nodeWidget) {
                var nodes = this.nodes, ons = this.options.nodes;
                if (nodeWidget) {
                    nodes.splice(idx, 0, nodeWidget);
                    ons.splice(idx, 0, nodeWidget.options);
                } else {
                    nodes.splice(idx, 1);
                    ons.splice(idx, 1);
                }
            };

            /**
            * The getNodes method gets an array that contains the root nodes of the current tree.
            * @example $("#tree").wijtree("getNodes");
            * @return {Array}
            */
            wijtree.prototype.getNodes = function () {
                if (this.options.nodes && this.options.nodes.length) {
                    this._createNodesPartially(true);
                }
                return this.nodes;
            };

            wijtree.prototype._createParentNodes = function ($li) {
                var self = this, options = { nIndex: undefined, htmlGenerated: true }, nodeWidget, $lis = [], $seachedNode = $li;

                if ($seachedNode.closest("ul").parent().hasClass("wijmo-wijtree")) {
                    options.nIndex = this.element.children("li").index($seachedNode);
                    createTreeNodeWidget($seachedNode, options, self, self.nodeWidgetName, self.widgetFullName);
                } else {
                    while (!$seachedNode.closest("ul").parent().hasClass("wijmo-wijtree")) {
                        $seachedNode = $seachedNode.closest("ul").closest("li");
                        $lis.push($seachedNode);
                        if (getTreeNodeWidget($seachedNode))
                            break;
                    }
                    $lis.reverse();
                    $.each($lis, function (index, $ele) {
                        nodeWidget = getTreeNodeWidget($ele);
                        if (!nodeWidget) {
                            options.nIndex = $ele.parent().children("li").index($ele);
                            nodeWidget = createTreeNodeWidget($ele, options, self, self.nodeWidgetName, self.widgetFullName);
                        }
                        nodeWidget._createChildNodeWidget();
                    });
                }
                return getTreeNodeWidget($li);
            };

            /**
            * The findNodeByText method finds a node by the specified node text.
            * @example $("#tree").wijtree("findNodeByText", "node 1");
            * @param {string} txt The text of which node you want to find.
            * @return {wijtreenode}
            */
            wijtree.prototype.findNodeByText = function (txt) {
                var self = this, nodes = $(".wijmo-wijtree-node a>span", this.$nodes).filter(function () {
                    return $(this).text() === txt;
                }), nodeWidget = null, node;
                if (nodes.length) {
                    node = nodes.eq(0).closest("li");
                    nodeWidget = getTreeNodeWidget(node);
                    if (!nodeWidget) {
                        nodeWidget = self._createParentNodes(node);
                    }
                }
                return nodeWidget;
            };

            wijtree.prototype._setAllowDrag = function (value) {
                var self = this, $allNodes, nodeSelector = self._nodeSelector(), nodeWName = "wijmo-" + self.nodeWidgetName;

                if (!$.fn.draggable) {
                    return;
                }

                if (value) {
                    $allNodes = self.element.find(nodeSelector);
                    $allNodes.each(function () {
                        var w = $(this).data(nodeWName);
                        if (!$(this).data("ui-draggable") && !w.$navigateUrl.data("events") || !w.$navigateUrl.data("events").mousedown) {
                            w.$navigateUrl.one("mousedown", w, w._onMouseDown);
                        }
                    });
                } else {
                    $allNodes = self.element.find(nodeSelector + ":ui-draggable");
                    $allNodes.draggable("destroy");
                }
            };

            wijtree.prototype._setAllowDrop = function (value) {
                if (!$.fn.droppable) {
                    return;
                }
                if (value) {
                    if (!this.widgetDom.data("ui-droppable")) {
                        this._attachDroppable();
                    }
                } else if (this.widgetDom.droppable) {
                    this.widgetDom.droppable("destroy");
                }
            };

            wijtree.prototype._setCheckBoxes = function (value) {
                var self = this;
                $.each(self.getNodes(), function (idx, node) {
                    node._setCheckBoxes(value);
                });
            };

            wijtree.prototype._setHitArea = function (value) {
                var self = this;

                self.$nodes[value ? "addClass" : "removeClass"]("wijmo-wijtree-allexpanded");
                self.$nodes.children("li").each(function (idx, ele) {
                    var nodeWidget = self._getNodeWidget($(ele));
                    if (nodeWidget !== null) {
                        nodeWidget._setHitArea(value);
                    }
                });
            };

            /*region methods(private)*/
            wijtree.prototype._getNodeWidget = function ($node) {
                if ($node.is(this._nodeSelector())) {
                    var widget = $node.data($node.data("widgetName"));
                    return widget;
                }
                return null;
            };

            wijtree.prototype._getNodeWidgetByDom = function (el) {
                var node = this._getNodeByDom(el);
                return this._getNodeWidget(node);
            };

            wijtree.prototype._getNodeByDom = function (el) {
                return $(el).closest(this._nodeSelector());
            };

            wijtree.prototype._refreshNodesClass = function () {
                var nodes = this.getNodes(), i;
                for (i = 0; i < nodes.length; i++) {
                    nodes[i]._initNodeClass();
                }
            };

            wijtree.prototype._getField = function (key) {
                return this.element.data(key);
            };

            wijtree.prototype._setField = function (key, value) {
                this.element.data(key, value);
            };
            return wijtree;
        })(wijmo.wijmoWidget);
        _tree.wijtree = wijtree;

        var wijtreenode = (function (_super) {
            __extends(wijtreenode, _super);
            function wijtreenode() {
                _super.apply(this, arguments);
            }
            wijtreenode.prototype._setOption = function (key, value) {
                var self = this, check;

                switch (key) {
                    case "accessKey":
                        if (self.$navigateUrl !== null) {
                            self.$navigateUrl.attr("accesskey", value);
                        }
                        break;
                    case "checked":
                        self._checkState = value ? "checked" : "unChecked";
                        self._setChecked(value);
                        break;
                    case "collapsedIconClass":
                    case "expandedIconClass":
                    case "itemIconClass":
                        self.options[key] = value;
                        self._initNodeImg();
                        break;
                    case "expanded":
                        self._setExpanded(value);
                        break;
                    case "selected":
                        self._setSelected(value);
                        break;
                    case "text":
                        self._setText(value);
                        break;
                    case "toolTip":
                        self._setToolTip(value);
                        break;
                    case "navigateUrl":
                        self._setNavigateUrlHref(value);
                        break;
                    default:
                        break;
                }

                if (key === "nodes") {
                    self.options.nodes.length = 0;
                    self._setField("nodes", null);
                    self._setNodes = true;
                    $.each(value, function (i, n) {
                        self.options.nodes.push(n);
                    });
                    self.options.nodes.concat();
                    if (value && value.length) {
                        self._hasChildren = self._hasSubNodes();
                        self._createChildNodes();
                        self._initNodeClass();
                    } else {
                        self._clearChildNodes();
                    }
                } else {
                    _super.prototype._setOption.call(this, key, value);
                }
            };

            wijtreenode.prototype._initVariable = function () {
                var self = this;
                self._allNodesCreated = false;
                self._initNodesCreated = false;
                self._nextNodeIndex = 0;
            };

            wijtreenode.prototype._initState = function () {
                var self = this;
                self._tree = null;
                self._dropTarget = null;
                self._checkState = "unChecked"; //Checked, UnChecked, Indeterminate
                self._insertPosition = "unKnown"; //end,after,before
                self.$nodeBody = null;
                self.$checkBox = null;
                self.$hitArea = null;
                self.$nodes = null;
                self.$subnodes = null;
            };

            wijtreenode.prototype._create = function () {
                var self = this, o = self.options;
                self._setNodes = o.isAddedNodeWithOptions;
                self._initState();
                self.element.data("widgetName", "wijmo-wijtreenode");
                self._createTreeNode();
                self._initNode();

                if (o.selected) {
                    self._tree._selectedNodes.push(self);
                }

                if (o.checked) {
                    self._checkState = "checked";
                }
                _super.prototype._create.call(this);
            };

            wijtreenode.prototype._createTreeNode = function () {
                var $li = this.element, childOpts, self = this, ownerOpts, o = self.options;

                if (self._tree === null) {
                    self._tree = self._getTree();
                }

                if (!isNaN(o.nIndex)) {
                    ownerOpts = self._getOwner().options, childOpts = ownerOpts.nodes[o.nIndex];
                    if (childOpts && !childOpts.nodes) {
                        childOpts.nodes = [];
                    }
                    $.extend(o, childOpts);
                    ownerOpts.nodes[o.nIndex] = o;
                } else if (!o.nodes) {
                    o.nodes = [];
                }

                if (self._isHtmlGenerated()) {
                    self._tree._totalNodesCreated++;
                    self.$nodeBody = $li.children(".wijmo-wijtree-node");
                    self.$inner = self.$nodeBody.children("." + localCSS.wijtreeInner);
                    self.$nodeImage = self.$inner.children(".wijmo-wijtree-nodeimage");

                    if (self._tree.options.showCheckBoxes) {
                        self.$checkBox = $li.find(">div>span>div.wijmo-checkbox");
                        self.$checkBoxBody = self.$checkBox.children("div");
                        self.$checkBoxIcon = self.$checkBoxBody.children("span");
                    }
                    self.$navigateUrl = self.$inner.children("a");
                    self.$text = self.$navigateUrl.children("span").eq(0);
                } else {
                    self.$nodeImage = $("<span>");
                    self.$nodeBody = $("<div>").attr({
                        role: "treeitem",
                        "aria-expanded": false,
                        "aria-checked": false,
                        "aria-selected": false
                    });

                    self.$navigateUrl = $li.children("a");

                    if (self.$navigateUrl.length === 0) {
                        self.$navigateUrl = $li.children("div");
                        self.$navigateUrl.addClass("wijmo-wijtree-template");
                        self._isTemplate = true;
                    }

                    if (self.$navigateUrl.length === 0) {
                        self.$navigateUrl = $("<a href='#'></a>");
                    }

                    if (!self._isTemplate) {
                        self.$text = self.$navigateUrl.children("span").eq(0);
                        if (self.$text.length === 0) {
                            self.$navigateUrl.wrapInner("<span></span>");
                            self.$text = self.$navigateUrl.children("span").eq(0);
                        }
                    }
                    self.$inner = $("<span></span>").addClass(o.wijCSS.helperClearFix + " " + localCSS.wijtreeInner + " " + o.wijCSS.wijtreeInner + " " + o.wijCSS.cornerAll);
                    self.$inner.append(self.$nodeImage);
                    if (self._tree.options.showCheckBoxes) {
                        self._createTreeCheck();
                    }
                    self.$inner.append(self.$navigateUrl);
                    self.$nodeBody.append(self.$inner);
                    $li.prepend(self.$nodeBody);
                }

                self._hasChildren = self._hasSubNodes();
                self._createChildNodes();
            };

            wijtreenode.prototype._clearChildNodes = function () {
                var nodes = this._getField("nodes");
                this.$nodes.empty();
                nodes && nodes.length && (nodes.length = 0);
                this.$subnodes && this.$subnodes.length && (this.$subnodes.length = 0);
            };

            wijtreenode.prototype._createChildNodes = function () {
                var self = this, o = self.options, $li = self.element;

                self._initVariable();
                if (self._hasChildren) {
                    if (self.$nodes === null) {
                        self.$nodes = $li.children("ul").eq(0);
                    }
                    if (self._isHtmlGenerated()) {
                        self.$hitArea = self.$inner.children(".wijmo-wijtree-hitarea");
                    } else {
                        $li.addClass("wijmo-wijtree-parent");
                        self.$nodeBody.addClass("wijmo-wijtree-node wijmo-wijtree-header " + o.wijCSS.stateDefault);
                        self.$hitArea = $("<span>");
                        self.$inner.prepend(self.$hitArea);
                        self.$nodes.addClass("wijmo-wijtree-list wijmo-wijtree-child " + o.wijCSS.helperReset);
                    }
                    if (o.expanded || !self._isHtmlGenerated()) {
                        self._createChildNodeWidget();
                    }
                } else {
                    if (!self._isHtmlGenerated()) {
                        $li.addClass("wijmo-wijtree-item");
                        self.$nodeBody.addClass("wijmo-wijtree-node " + o.wijCSS.stateDefault);
                    }
                    self._setField("nodes", []);
                }
            };

            wijtreenode.prototype._isHtmlGenerated = function () {
                return !!this.options.htmlGenerated;
            };

            wijtreenode.prototype._createInitNode = function ($li, index, nodesCount, opts, subNodes) {
                var self = this, nodeWidget;
                nodeWidget = getTreeNodeWidget($li);
                if (!nodeWidget) {
                    if (subNodes) {
                        subNodes.push($li);
                    }
                    opts.nIndex = index;
                    if (!self._initNodesCreated || !self._isHtmlGenerated()) {
                        nodeWidget = createTreeNodeWidget($li, opts, self, nodeWidgetName, self.options.treeClass);
                        if (!subNodes && !$.browser.safari) {
                            $li.children(".wijmo-wijtree-node").find("." + localCSS.wijtreeInner + " a").addClass("wijmo-wijtree-link");
                        }
                        nodeWidget._index = index;
                        self._nextNodeIndex++;
                    } else {
                        nodeWidget = null;
                        self._allNodesCreated = false;
                    }
                    if (self._tree._initializingTree) {
                        if (self._tree._totalNodesCreated >= self._tree._nodesCntPerPage * 2) {
                            self._initNodesCreated = true;
                        }
                    } else {
                        if (self._nextNodeIndex >= self._tree._nodesCntPerPage * 2) {
                            self._initNodesCreated = true;
                        }
                    }
                }
                self._allNodesCreated = self._nextNodeIndex >= nodesCount;
                return nodeWidget;
            };

            wijtreenode.prototype._bindCreateNodesEvent = function () {
                var self = this;
                $(document).bind("scroll." + this.widgetName, $.proxy(self._createChildNodesAtIdle, self)).bind("mousemove." + this.widgetName, $.proxy(self._createChildNodesAtIdle, self)).bind("click." + this.widgetName, $.proxy(self._createChildNodesAtIdle, self)).bind("keydown." + this.widgetName, $.proxy(self._createChildNodesAtIdle, self));
            };

            wijtreenode.prototype._unbindCreateNodesEvent = function () {
                $(document).unbind('.' + this.widgetName);
            };

            wijtreenode.prototype._createChildNodesAtIdle = function () {
                if (!this._tree._creatingNode) {
                    this._createChildNodesPartially(false);
                }
                return;
            };

            wijtreenode.prototype._createChildNodesPartially = function (createRest) {
                this._tree._creatingNode = true;
                var self = this, options = {
                    nIndex: undefined,
                    htmlGenerated: true
                }, nodes = [], lis = self.$nodes.children("li"), widget, currentNodesCnt = self._nextNodeIndex;

                if (!self._getField("nodes")) {
                    self._setField("nodes", nodes);
                } else {
                    nodes = self._getField("nodes");
                }
                if (this._allNodesCreated || !this.options.nodes || !this.options.nodes.length) {
                    this._unbindCreateNodesEvent();
                    return;
                }
                while (self._nextNodeIndex < lis.length) {
                    if (nodes[self._nextNodeIndex] != null) {
                        self._nextNodeIndex++;
                        continue;
                    }
                    options.nIndex = self._nextNodeIndex;
                    widget = createTreeNodeWidget($(lis[self._nextNodeIndex]), options, self, nodeWidgetName, self.options.treeClass);
                    nodes[self._nextNodeIndex] = widget;
                    self._nextNodeIndex++;
                    if (!createRest && currentNodesCnt + self._tree._nodesCntPerPage < self._nextNodeIndex) {
                        break;
                    }
                }
                if (this._nextNodeIndex >= lis.length) {
                    this._unbindCreateNodesEvent();
                    this._allNodesCreated = true;
                }
                this._tree._creatingNode = false;
            };

            wijtreenode.prototype._createChildNode = function () {
                var self = this, o = self.options, nodes = [], lis, opts = {
                    nIndex: undefined,
                    cfli: undefined,
                    treeClass: o.treeClass,
                    nodes: undefined,
                    htmlGenerated: self._isHtmlGenerated()
                };
                if (self._setNodes && o.nodes && o.nodes.length) {
                    if (!self.$nodes || !self.$nodes.length) {
                        self.$nodes = $("<ul>").appendTo(self.element);
                    }
                    setHTML(self.$nodes, generateItemsMarkup(o.nodes, self._tree.options.showExpandCollapse, self._tree.options.showCheckBoxes));
                    self.$subnodes = [];
                    opts.htmlGenerated = true;
                    lis = self.$nodes.children("li");
                    lis.each(function (idx, ele) {
                        var $li = $(ele);
                        nodes.push(self._createInitNode($li, idx, lis.length, opts, self.$subnodes));
                    });
                } else {
                    if (!o.nodes) {
                        o.nodes = [];
                    }
                    if (self.$subnodes === null) {
                        self._updateSubNodes();
                    }
                    $.each(self.$subnodes, function (idx, $li) {
                        if (!self._isHtmlGenerated()) {
                            opts.nodes = [];
                        }
                        nodes.push(self._createInitNode($li, idx, self.$subnodes.length, opts));
                    });
                }
                if (!self._allNodesCreated) {
                    self._bindCreateNodesEvent();
                }
                return nodes;
            };

            wijtreenode.prototype._initNode = function () {
                var self = this, o = self.options;
                if (!self._initialized) {
                    self._initialized = true;
                    self._initNavigateUrl();
                    if (!self._isTemplate && self.$text && self.$text.length) {
                        self._text = self.$text.html();
                        o.text = self._text;
                    }
                    self._hasChildren = self._hasSubNodes();
                    self._initNodesUL();
                    self._initNodeClass();
                    self._initNodeImg();
                    if (self._tree.options.allowDrag) {
                        self.$navigateUrl.one("mousedown", self, self._onMouseDown);
                    }
                }
            };

            wijtreenode.prototype._initNodeClass = function () {
                var self = this, o = self.options, style, nodeClass = "wijmo-wijtree-item", hitClass = o.wijCSS.icon + " " + (o.expanded ? o.wijCSS.iconArrowRightDown : o.wijCSS.iconArrowRight);

                if (self._tree.options.showExpandCollapse) {
                    if (self._hasChildren || !!o.hasChildren) {
                        if (!self._isHtmlGenerated()) {
                            self.$nodeBody.removeClass("wijmo-state-expanded wijmo-state-collapsed");
                            if (o.expanded) {
                                self.$nodeBody.addClass("wijmo-state-expanded");
                            } else {
                                self.$nodeBody.addClass("wijmo-state-collapsed");
                            }
                        }
                        if (self.$hitArea !== null) {
                            self.$hitArea.removeClass([o.wijCSS.icon, o.wijCSS.iconArrowRightDown, o.wijCSS.iconArrowRight].join(' '));
                            self.$hitArea.addClass(hitClass);
                        } else {
                            self.$hitArea = $("<span>").addClass(hitClass).prependTo(self.$inner);
                            self.element.removeClass(nodeClass).addClass("wijmo-wijtree-parent");
                        }

                        if (self._hasChildren && self.$nodes && self.$nodes.length) {
                            style = o.expanded ? "" : "none";
                            self.$nodes.css({ display: style });
                        }
                    } else if (self.$hitArea && self.$hitArea.length) {
                        self.$hitArea.remove();
                        self.$hitArea = null;
                        self.element.removeClass("wijmo-wijtree-parent").addClass(nodeClass);
                    }
                }

                if (!self._hasChildren && self.$nodes && self.$nodes.length) {
                    self.$nodes.css({ display: "none" });
                }

                if (o.selected && self.$inner) {
                    self.$inner.addClass(o.wijCSS.stateActive);
                }
            };

            wijtreenode.prototype._initNodesUL = function () {
                var self = this;

                if (!self._isHtmlGenerated() && self._tree.options.showExpandCollapse) {
                    if (self._hasChildren && self.$nodes && self.$nodes.length) {
                        self.$nodes[self._expanded ? 'show' : 'hide']();
                    }
                }
            };

            wijtreenode.prototype._initNavigateUrl = function () {
                var self = this, href;

                if (self._isHtmlGenerated()) {
                    return;
                }
                href = self.$navigateUrl.attr("href");
                if (!this._isTemplate) {
                    if (!href || href.length === 0) {
                        self._setNavigateUrlHref("#");
                    }
                }
            };

            wijtreenode.prototype._applyIconClass = function ($el, o) {
                var vAttr = $el.attr("expandediconclass");

                if (vAttr) {
                    o.expandedIconClass = vAttr;
                    $el.removeAttr("expandediconclass");
                }
                vAttr = $el.attr("collapsediconclass");
                if (vAttr) {
                    o.collapsedIconClass = vAttr;
                    $el.removeAttr("collapsediconclass");
                }
                vAttr = $el.attr("itemiconclass");
                if (vAttr) {
                    o.itemIconClass = vAttr;
                    $el.removeAttr("itemiconclass");
                }
            };

            wijtreenode.prototype._initNodeImg = function () {
                var self = this, o = self.options, $el = self.element;
                if (self.$nodeImage === null || !self.$nodeImage.length) {
                    self.$nodeImage = $("<span>");
                }

                /* initial html has icon attribute for asp.net mvc*/
                self._applyIconClass($el, o);

                /* end */
                if (o.collapsedIconClass !== "" && o.expandedIconClass !== "") {
                    self.$nodeImage.removeClass().addClass(o.wijCSS.icon).addClass(o.expanded ? o.expandedIconClass : o.collapsedIconClass);
                    if (!self._tree.options.showExpandCollapse) {
                        self.$nodeImage.addClass(o.expandedIconClass);
                    }
                    self.$nodeImage.insertBefore(self.$checkBox);
                } else if (o.itemIconClass !== "") {
                    self.$nodeImage.removeClass().addClass(o.wijCSS.icon);
                    self.$nodeImage.addClass(o.itemIconClass);
                    self.$nodeImage.insertBefore(self.$checkBox);
                }
            };

            wijtreenode.prototype._setNavigateUrlHref = function (href) {
                if (this.$navigateUrl) {
                    if (href === "" || typeof href === "undefined" || href === null) {
                        href = "#";
                    }
                    this.$navigateUrl.attr("href", href);
                }
            };

            wijtreenode.prototype._editNode = function () {
                this._tree._editMode = true;
                this.$navigateUrl.hide();
                if (!this.$editArea) {
                    this.$editArea = $("<input type=\"text\">").wijtextbox();
                }
                this.$editArea.val(this.$text.html());
                this.$editArea.insertBefore(this.$navigateUrl);
                this.$editArea.bind("blur", this, this._editionComplete);
                this.$editArea.focus();
            };

            wijtreenode.prototype._editionComplete = function (event) {
                var self = event.data, text;
                self._tree._editMode = false;
                if (self.$editArea) {
                    text = self.$editArea.val();
                    self.$editArea.remove();
                }
                self.$navigateUrl.show();
                self.$editArea = null;
                self._changeText(text);
            };

            wijtreenode.prototype._changeText = function (text) {
                var self = this, o = self.options;
                if (self.$text !== null && text !== "") {
                    self.$text.text(text);
                    o.text = text;
                    self._tree._trigger("nodeTextChanged", null, self);
                }
            };

            /*behavior Methods*/
            wijtreenode.prototype._toggleExpanded = function () {
                var self = this, o = self.options;
                if (!self._isClosestDisabled()) {
                    if (self._hasChildren || o.hasChildren) {
                        self._setExpanded(!o.expanded);
                    }
                }
            };

            wijtreenode.prototype._createChildNodeWidget = function () {
                var self = this, nodes = [];
                if (!self._getField("nodes")) {
                    if (self._hasChildren) {
                        nodes = self._createChildNode();
                    }
                    self._setField("nodes", nodes);
                }
            };

            wijtreenode.prototype._expandNode = function (expand) {
                var self = this, treeOption = self._tree.options, trigger = expand ? "nodeExpanding" : "nodeCollapsing";

                if (self._tree._trigger(trigger, null, {
                    node: this,
                    params: this.options.params
                }) === false) {
                    return;
                }

                self._createChildNodeWidget();
                self.$nodeBody.attr("aria-expanded", expand);
                self._expanded = expand;
                self.options.expanded = expand;

                if (!self._isClosestDisabled()) {
                    if (expand) {
                        if (treeOption.expandDelay > 0) {
                            window.clearTimeout(self._expandTimer);
                            self._expandTimer = window.setTimeout(function () {
                                self._expandNodeVisually();
                            }, treeOption.expandDelay);
                        } else {
                            self._expandNodeVisually();
                        }
                    } else {
                        if (treeOption.collapseDelay > 0) {
                            window.clearTimeout(self._collapseTimer);
                            self._collapseTimer = window.setTimeout(function () {
                                self._collapseNodeVisually();
                            }, treeOption.collapseDelay);
                        } else {
                            self._collapseNodeVisually();
                        }
                    }
                }
            };

            wijtreenode.prototype._expandNodeVisually = function () {
                var self = this, $nodes, o = self.options;
                if (self._tree.options.autoCollapse) {
                    $nodes = self.element.siblings(":" + this.widgetFullName);
                    $.each($nodes, function (i) {
                        var widget = self._getNodeWidget($nodes[i]);
                        if (widget.options.expanded) {
                            widget._setExpanded(false);
                        }
                    });
                }
                if (o.collapsedIconClass !== "" && o.expandedIconClass !== "") {
                    self.$nodeImage.removeClass(o.collapsedIconClass).addClass(o.expandedIconClass);
                }
                self._internalSetNodeClass(true);
                self._show();
            };

            wijtreenode.prototype._collapseNodeVisually = function () {
                var self = this;
                if (self.options.collapsedIconClass !== "" && self.options.expandedIconClass !== "") {
                    self.$nodeImage.removeClass(self.options.expandedIconClass).addClass(self.options.collapsedIconClass);
                }
                self._internalSetNodeClass(false);
                self._hide();
            };

            wijtreenode.prototype._internalSetNodeClass = function (expanded) {
                var css = this.options.wijCSS, iconCss = [css.icon, css.iconArrowRightDown, css.iconArrowRight].join(' ');
                if (!this.$hitArea) {
                    return;
                }
                this.$hitArea.removeClass(iconCss).addClass(css.icon).addClass(expanded ? css.iconArrowRightDown : css.iconArrowRight);
                this.$nodeBody.removeClass("wijmo-state-expanded").removeClass("wijmo-state-collapsed");
                if (expanded) {
                    this.$nodeBody.addClass("wijmo-state-expanded");
                } else {
                    this.$nodeBody.addClass("wijmo-state-collapsed");
                }
            };

            wijtreenode.prototype._show = function () {
                this._animation(true);
            };

            wijtreenode.prototype._hide = function () {
                this._animation(false);
            };

            wijtreenode.prototype._animation = function (show) {
                var self = this, $nodes = self.$nodes, animate = show ? "expandAnimation" : "collapseAnimation", event = show ? "nodeExpanded" : "nodeCollapsed", effect, animation = self._tree.options[animate], opacity, strOpacity;

                function restoreOpacity($ele) {
                    if ($ele.css(strOpacity) !== opacity) {
                        $ele.css(strOpacity, opacity);
                    }
                }

                if ($nodes && $nodes.length) {
                    if (animation) {
                        if ($.browser.msie && parseInt($.browser.version) < 9) {
                            strOpacity = "filter";
                        } else {
                            strOpacity = "opacity";
                        }
                        opacity = $nodes.css(strOpacity);
                        effect = animation.animated || animation.effect;
                        if ($.effects && !!effect) {
                            $nodes[show ? "show" : "hide"](effect, {
                                easing: animation.easing
                            }, animation.duration, function () {
                                restoreOpacity($nodes);
                                self._tree._trigger(event, null, self);
                            });
                        } else {
                            $nodes[show ? "show" : "hide"](animation.duration, function () {
                                restoreOpacity($nodes);
                                self._tree._trigger(event, null, self);
                            });
                        }
                    } else {
                        $nodes[show ? "show" : "hide"]();
                        self._tree._trigger(event, null, self);
                    }
                }
            };

            wijtreenode.prototype._getBounds = function ($el) {
                var h = $el.height(), w = $el.width(), t = $el.offset().top, l = $el.offset().left;
                return { h: h, w: w, t: t, l: l };
            };

            wijtreenode.prototype._isMouseInsideRect = function (p, b) {
                if (p.x < b.l || p.x >= b.l + b.w) {
                    return false;
                }
                if (p.y <= b.t + 1 || p.y >= b.t + b.h) {
                    /*fix 1px on the mouse out the element
                    (e.g. 31<30.98 now 31<30.98+1 maybe
                    pageY/PageX are int but left/top are float)*/
                    return false;
                }
                return true;
            };

            /**
            * not used
            */
            wijtreenode.prototype._getNodeByMouseOn = function (p) {
                var self = this;
                $("li").each(function () {
                    var b = self._getBounds($(this));

                    //$.ui.isOver is removed from jQuery UI 1.10, so remove this method.
                    //if ($.ui.isOver(p.y, p.x, b.t, b.l, b.h, b.w)) {
                    //    return $(this);
                    //}
                    if ((p.y > b.t) && (p.y < (b.t + b.h)) && (p.x > b.l) && (p.x < (b.l + b.w))) {
                        return $(this);
                    }
                });
                return null;
            };

            wijtreenode.prototype._drowTemplate = function (p, $tmpl, $target) {
                var position = "unKnown", body = $target.is(".wijmo-wijtree-node") ? $target : $target.children(".wijmo-wijtree-node"), n = this._getBounds(body);
                $tmpl.width(body.width());

                if (p.y > n.t && p.y < n.t + n.h / 2) {
                    $tmpl.offset({ left: n.l, top: n.t });
                    position = "before";
                } else if (p.y > n.t + n.h / 2 && p.y < n.t + n.h) {
                    $tmpl.offset({ left: n.l, top: n.t + n.h });
                    position = "after";
                }
                return position;
            };

            wijtreenode.prototype._beginDrag = function (e) {
                var self = this, $item = self.element, $drag, to = self._tree.options, draggable = to.draggable, $tmpl = $("<div>").addClass("wijmo-wijtree-insertion " + to.wijCSS.stateDefault), options = {
                    cursor: "point",
                    cursorAt: { top: 15, left: -25 },
                    helper: function () {
                        return $("<div>" + self.$navigateUrl.html() + "</div>").addClass(to.wijCSS.header).addClass(to.wijCSS.cornerAll);
                    },
                    distance: $.browser.msie ? 1 : 10,
                    handle: self.$navigateUrl,
                    scope: "tree"
                }, events = {
                    start: function (event, ui) {
                        self._tree._isDragging = true;
                        self._tree.widgetDom.prepend($tmpl);
                        self._tree._trigger("nodeDragStarted", event, self);
                        if (draggable && $.isFunction(draggable.start)) {
                            draggable.start.call(self.element, event, ui);
                        } else {
                            $item.hide();
                        }
                    },
                    drag: function (event, ui) {
                        var ev = event, t = (ev.srcElement || ev.originalEvent.target), $target = $(t), dropNode, p = { x: ev.pageX, y: ev.pageY };

                        if ($tmpl) {
                            $tmpl.hide();
                        }
                        if ($target) {
                            dropNode = self._getNodeWidget(t);
                            if (dropNode && !dropNode._tree._isDisabled()) {
                                if ($target.closest("." + localCSS.wijtreeInner, self.element).length) {
                                    self._insertPosition = "end"; //end,after,before
                                } else {
                                    $tmpl.show();
                                    self._insertPosition = self._drowTemplate(p, $tmpl, dropNode.element);
                                }
                                if (dropNode !== self) {
                                    self._dropTarget = dropNode;
                                }
                            } else if ($target.is(":" + self.options.treeClass)) {
                                self._dropTarget = $target.data(self.options.treeClass);
                                self._insertPosition = "end";
                            }
                        }
                        self._tree._trigger("nodeDragging", event, self);
                        if (draggable && $.isFunction(draggable.drag)) {
                            draggable.drag.call(self.element, event, ui);
                        }
                    },
                    stop: function (event, ui) {
                        $tmpl.remove();
                        self._dropTarget = null;
                        self._insertPosition = "unKnown";
                        self._tree._isDragging = false;
                        if (draggable && $.isFunction(draggable.stop)) {
                            draggable.stop.call(self.element, event, ui);
                        } else {
                            $item.show();
                            self._resetDrag();
                        }
                    }
                };

                if (typeof to.dropVisual === "string") {
                    $drag = $(to.dropVisual);
                    $tmpl = $drag.length ? $drag : $tmpl;
                } else if ($.isFunction(to.dropVisual)) {
                    $drag = $(to.dropVisual.call());
                    $tmpl = $drag.length ? $drag : $tmpl;
                }
                $tmpl.hide();

                $.extend(options, draggable, events); // mind the order: events must be at last.
                if ($.fn.draggable) {
                    $item.draggable(options).trigger(e);
                    if ($.browser.mozilla) {
                        self._setFocused(true);
                    }
                }
            };

            wijtreenode.prototype._resetDrag = function () {
                var self = this, nodes, i;
                if (!self._tree.options.allowDrag && self.element.data("ui-draggable")) {
                    self.element.draggable("destroy");
                }
                nodes = self.getNodes();
                for (i = 0; i < nodes.length; i++) {
                    nodes[i]._resetDrag();
                }
            };

            wijtreenode.prototype._createTreeCheck = function () {
                var self = this, o = self.options, html = generateTreeCheckMarkup(o.checked, o.checkState);

                self.$checkBox = $(html);
                self.$checkBox.insertAfter(self.$nodeImage);
                self.$checkBoxBody = self.$checkBox.children("div");
                self.$checkBoxIcon = self.$checkBoxBody.children("span");
            };

            wijtreenode.prototype._mouseOverTreeCheck = function (event) {
                var $el = $(event.target), self = this, o = self.options, css = o.wijCSS;
                if (self._isOverCheckbox($el)) {
                    self.$checkBoxBody.addClass(css.stateHover);
                }
            };

            wijtreenode.prototype._mouseOutTreeCheck = function (event) {
                var $el = $(event.target), self = this, o = self.options, css = o.wijCSS;
                if (self._isOverCheckbox($el)) {
                    self.$checkBoxBody.removeClass(css.stateHover);
                }
            };

            wijtreenode.prototype._setTreeCheckState = function (checkState) {
                var self = this, o = self.options, css = o.wijCSS, checkClass = css.icon + " " + css.iconCheck, triStateClass = css.icon + " " + css.iconStop;

                if (checkState === "unCheck") {
                    self.$checkBoxBody.removeClass(css.stateActive);
                    self.$checkBoxIcon.removeClass(checkClass + " " + triStateClass);
                } else if (checkState === "check") {
                    self.$checkBoxBody.addClass(css.stateActive);
                    self.$checkBoxIcon.removeClass(triStateClass).addClass(checkClass);
                } else if (checkState === "triState") {
                    self.$checkBoxBody.addClass(css.stateActive);
                    self.$checkBoxIcon.removeClass(checkClass).addClass(triStateClass);
                }
            };

            wijtreenode.prototype._checkClick = function () {
                var self = this, o = self.options;
                if (!self._isClosestDisabled()) {
                    if (self._tree._trigger("nodeCheckChanging", null, self) === false) {
                        return;
                    }
                    if (o.checked && self._checkState === "indeterminate") {
                        self._checkState = "checked";
                        self._checkItem();
                    } else {
                        self._checkState = o.checked ? "unChecked" : "checked";
                        self._setChecked(!o.checked);
                    }
                    self._tree._trigger("nodeCheckChanged", null, self);
                }
            };

            wijtreenode.prototype._checkItem = function () {
                var self = this, autoCheck = false, tree = self._tree;
                if (tree === null || !tree.options.showCheckBoxes) {
                    return;
                }
                if (tree.options.autoCheckNodes && self._checkState !== "indeterminate") {
                    autoCheck = true;
                    self._changeChecked(self.options.checked);
                }
                if (tree.options.allowTriState) {
                    self._setParentCheckState();
                }
                self.options.checked ? self._checkNode(autoCheck) : self._unCheckNode(autoCheck);
            };

            wijtreenode.prototype._checkNode = function (autoCheck) {
                // todo: add to tree._checkedNodes
                var self = this, o = self.options, nodes = this.getNodes(), i;
                if (self._checkState === "checked") {
                    self._setTreeCheckState("check");
                    o.checkState = "checked";
                } else if (self._checkState === "indeterminate") {
                    self._setTreeCheckState("triState");
                    o.checkState = "indeterminate";
                }

                if (autoCheck) {
                    for (i = 0; i < nodes.length; i++) {
                        nodes[i]._checkNode(true);
                    }
                }
            };

            wijtreenode.prototype._unCheckNode = function (autoCheck) {
                // todo: remove to tree._checkedNodes
                var nodes = this.getNodes(), o = this.options, i;
                this._setTreeCheckState("unCheck");
                o.checkState = "unChecked";
                if (autoCheck) {
                    for (i = 0; i < nodes.length; i++) {
                        nodes[i]._unCheckNode(true);
                    }
                }
            };

            wijtreenode.prototype._changeChecked = function (checked) {
                var nodes = this.getNodes();
                $.each(nodes, function (i, node) {
                    node.options.checked = checked;
                    node.$nodeBody.attr("aria-checked", checked);
                    node._checkState = checked ? "checked" : "unChecked";
                    node._changeChecked(checked);
                });
            };

            wijtreenode.prototype._setParentCheckState = function () {
                var owner = this._getOwner(), nodes, allChecked = true, hasChildrenChecked = false, triState = false, i, self = this;
                if (owner.element.is(":" + self.options.treeClass)) {
                    return;
                }
                nodes = owner.getNodes();
                for (i = 0; i < nodes.length; i++) {
                    if (nodes[i]._checkState === "indeterminate") {
                        triState = true;
                    }
                    if (nodes[i].options.checked) {
                        hasChildrenChecked = true;
                    } else {
                        allChecked = false;
                    }
                    if (!allChecked && hasChildrenChecked) {
                        break;
                    }
                }
                if (triState) {
                    owner._checkState = "indeterminate";
                    owner._setChecked(true);
                } else {
                    if (hasChildrenChecked) {
                        if (allChecked) {
                            owner._checkState = "checked";
                            owner._checkNode(false);
                        } else {
                            owner._checkState = "indeterminate";
                        }
                        owner._setChecked(true);
                    } else {
                        owner._checkState = "unChecked";
                        owner._setChecked(false);
                        owner._unCheckNode(false);
                    }
                }
                owner._setParentCheckState();
            };

            /*Events*/
            // todo: make self assignment consistent. (need to refactor other places.)
            wijtreenode.prototype._isOverCheckbox = function (el) {
                return el.closest(".wijmo-checkbox", this.element).length > 0;
            };

            wijtreenode.prototype._isWithinHitArea = function (el) {
                return this.$hitArea && this.$hitArea[0] === el[0];
            };

            wijtreenode.prototype._isOverInner = function (el) {
                return el.closest("." + localCSS.wijtreeInner, this.element).length > 0;
            };

            wijtreenode.prototype._onKeyDown = function (event) {
                var el = $(event.target), self = this;
                if (self._isOverInner(el)) {
                    self._keyAction(event);
                }
            };

            wijtreenode.prototype._onClick = function (event) {
                var el = $(event.target), self = this;
                if (self._isOverCheckbox(el)) {
                    self._checkClick();
                    event.preventDefault();
                    event.stopPropagation();
                } else if (self._isWithinHitArea(el)) {
                    self._toggleExpanded();
                    event.preventDefault();
                    event.stopPropagation();
                } else if (self._isOverInner(el)) {
                    self._click(event);
                }
            };

            wijtreenode.prototype._onMouseDown = function (event) {
                var el = $(event.target), node = event.data;
                if (!node._tree._isDisabled() && node._tree.options.allowDrag) {
                    if (el.closest(".wijmo-wijtree-node", node.element).length > 0) {
                        node._beginDrag(event);
                    }
                }
            };

            wijtreenode.prototype._onMouseOver = function (event) {
                var el = $(event.target), self = this, rel = $(event.relatedTarget);
                if (self._isOverInner(el) && (this._tree._overNode !== self || rel.is(':' + this.widgetFullName) || rel.is('.wijmo-wijtree-node'))) {
                    if (!self._isClosestDisabled()) {
                        self._mouseOver(event);
                    }
                    this._tree._overNode = self;
                }
                if (!self._isClosestDisabled()) {
                    self._mouseOverHitArea(event);
                    self._mouseOverTreeCheck(event);
                }
            };

            wijtreenode.prototype._onMouseOut = function (event) {
                var el = $(event.target), self = this, rel = $(event.relatedTarget), node = this._getNodeWidget(rel.get(0));
                if (self._isOverInner(el) && (this._tree._overNode !== node || rel.is(':' + this.widgetFullName) || rel.is('.wijmo-wijtree-list') || rel.is('.ui-effects-wrapper') || rel.is('.wijmo-wijtree-node'))) {
                    if (!self._isClosestDisabled()) {
                        self._mouseOut(event);
                    }
                    this._tree._overNode = null;
                }
                if (!self._isClosestDisabled()) {
                    self._mouseOutHitArea(event);
                    self._mouseOutTreeCheck(event);
                }
            };

            wijtreenode.prototype._onFocus = function (event) {
                var el = $(event.target), self = this, css = self.options.wijCSS;
                if (self._isOverInner(el) && !self._isClosestDisabled() && !(el.hasAllClasses(css.iconArrowRightDown) || el.hasAllClasses(css.iconArrowRight)) && !self._isOverCheckbox(el)) {
                    if (self._tree._focusNode) {
                        self._tree._focusNode.$navigateUrl.trigger("focusout");
                    }
                    self._focused = true;
                    self._tree._focusNode = this;
                    self.$inner.addClass(css.stateFocus);
                    self._tree._trigger("nodeFocus", event, self);
                }
            };

            wijtreenode.prototype._onBlur = function (event) {
                var el = $(event.target), node = event.data, css = node.options.wijCSS;
                if (!node._isClosestDisabled()) {
                    node._focused = false;
                    if (node._isOverInner(el)) {
                        node.$inner.removeClass(css.stateFocus);
                    }
                    node._tree._trigger("nodeBlur", event, node);
                }
            };

            wijtreenode.prototype._click = function (event) {
                var self = this, o = self.options, tree = self._tree, url = self.$navigateUrl.attr("href");
                if (!self._isClosestDisabled()) {
                    if (!/^[#,\s]*$/.test(url)) {
                        if ($.browser.msie && /^7\.[\d]*/.test($.browser.version)) {
                            if (url.indexOf(window.location.href) < 0) {
                                return;
                            }
                        } else {
                            return;
                        }
                    }
                    self._isClick = true;
                    tree._ctrlKey = event.ctrlKey;
                    if (o.selected && tree._ctrlKey) {
                        self._setSelected(false);
                    } else if (o.selected && !self._tree._editMode && tree.options.allowEdit && !self._isTemplate) {
                        self._editNode();
                    } else {
                        self._setSelected(!o.selected);
                    }
                    if (!self._isTemplate) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                } else {
                    self._setNavigateUrlHref("");
                }
            };

            wijtreenode.prototype._selectNode = function (select, event) {
                var self = this, o = self.options, ctrlKey, idx;
                if (!self._isClosestDisabled() && !self._tree._isDragging) {
                    ctrlKey = self._tree._ctrlKey;
                    if (ctrlKey) {
                        idx = $.inArray(self, self._tree._selectedNodes);
                        if (idx !== -1 && !select) {
                            self._tree._selectedNodes.splice(idx, 1);
                            self.$inner.removeClass(o.wijCSS.stateActive);
                        }
                    } else {
                        $.each(self._tree._selectedNodes, function (i, n) {
                            n.$inner.removeClass(o.wijCSS.stateActive);
                            n.options.selected = false;
                            n.$nodeBody.attr("aria-selected", false);
                        });
                        self._tree._selectedNodes = [];
                    }
                    if (select) {
                        idx = $.inArray(self, self._tree._selectedNodes);
                        if (idx === -1) {
                            this._tree._selectedNodes.push(self);
                        }
                        self.$inner.addClass(o.wijCSS.stateActive);
                    } else {
                        self.$inner.removeClass(o.wijCSS.stateActive);
                    }
                    if (self._isClick) {
                        self._tree._trigger("nodeClick", event, self);
                    }
                    self._isClick = false;
                    self._tree._ctrlKey = false;
                    self._tree._trigger("selectedNodeChanged", event, self);
                }
            };

            wijtreenode.prototype._keyAction = function (e) {
                var el = e.target, self = this, isEdit = false, keyCode = wijmo.getKeyCodeEnum();
                if (self._isClosestDisabled()) {
                    return;
                }
                if (el) {
                    if (self._tree._editMode && e.keyCode !== keyCode.ENTER) {
                        return;
                    }
                    switch (e.keyCode) {
                        case keyCode.UP:
                            self._moveUp();
                            break;
                        case keyCode.DOWN:
                            self._moveDown();
                            break;
                        case keyCode.RIGHT:
                            if (self._tree.options.showExpandCollapse) {
                                self._moveRight();
                            }
                            break;
                        case keyCode.LEFT:
                            if (self._tree.options.showExpandCollapse) {
                                self._moveLeft();
                            }
                            break;
                        case 83:
                            if (!self._tree._editMode && self._tree.options.allowSorting) {
                                self.sortNodes();
                            }
                            break;
                        case 113:
                            if (self._tree.options.allowEdit) {
                                self._editNode();
                            }
                            break;
                        case 109:
                            if (self._tree.options.showExpandCollapse && this._expanded) {
                                self._setExpanded(false);
                            }
                            break;
                        case 107:
                            if (self._tree.options.showExpandCollapse && !this._expanded) {
                                self._setExpanded(true);
                            }
                            break;
                        case keyCode.ENTER:
                            if (self._tree._editMode) {
                                e.data = self;
                                self._editionComplete(e);
                                self._setFocused(true);
                                isEdit = true;
                                e.preventDefault();
                            }
                            break;
                        case keyCode.SPACE:
                            if (self._tree.options.showCheckBoxes) {
                                self._checkState = self.options.checked ? "unChecked" : "checked";
                                self._setChecked(!self.options.checked);
                            }
                            break;
                    }
                    self._customKeyDown(e.keyCode, isEdit);
                    if (!self._isTemplate && e.keyCode !== keyCode.ENTER) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            };

            wijtreenode.prototype._customKeyDown = function (keyCode, isEdit) {
            };

            wijtreenode.prototype._prevNode = function (node) {
                var el = node.element;
                if (el.prev().length > 0) {
                    return el.prev().data(el.data("widgetName"));
                }
            };

            wijtreenode.prototype._nextNode = function (node) {
                var el = node.element;
                if (el.next().length > 0) {
                    return el.next().data(el.data("widgetName"));
                }
            };

            wijtreenode.prototype._getNextExpandedNode = function (node) {
                var nextNode = node, nextNodes = node.getNodes(), newNode;
                if (node._expanded && nextNodes.length > 0) {
                    newNode = nextNodes[nextNodes.length - 1];
                    if (newNode !== null) {
                        nextNode = this._getNextExpandedNode(newNode);
                    }
                }
                return nextNode;
            };

            wijtreenode.prototype._getNextNode = function (owner) {
                var nextNode = null, self = this;
                if (owner.element.is(":" + self.options.treeClass)) {
                    return null;
                }
                nextNode = self._nextNode(owner);
                if (nextNode) {
                    return nextNode;
                }
                return self._getNextNode(owner._getOwner());
            };

            wijtreenode.prototype._moveUp = function () {
                var level = this._getCurrentLevel(), prevNode = this._prevNode(this);
                if (!prevNode) {
                    if (level > 0) {
                        this._getOwner()._setFocused(true);
                    }
                } else {
                    this._getNextExpandedNode(prevNode)._setFocused(true);
                }
            };

            wijtreenode.prototype._moveDown = function () {
                var nodes = this.getNodes(), nextNode, owner, pNextNode;
                if (this._expanded && nodes.length > 0) {
                    nodes[0]._setFocused(true);
                } else {
                    nextNode = this._nextNode(this);
                    if (nextNode) {
                        nextNode._setFocused(true);
                    } else {
                        owner = this._getOwner();
                        pNextNode = this._getNextNode(owner);
                        if (pNextNode) {
                            pNextNode._setFocused(true);
                        }
                    }
                }
            };

            wijtreenode.prototype._moveLeft = function () {
                var nextNode = this._getOwner();
                if (this._expanded) {
                    this._setExpanded(false);
                } else if (nextNode !== null && !nextNode.element.is(":" + this.options.treeClass)) {
                    nextNode._setFocused(true);
                }
            };

            wijtreenode.prototype._moveRight = function () {
                if (this._hasChildren) {
                    if (!this._expanded) {
                        this._setExpanded(true);
                    } else {
                        var nextNode = this.getNodes()[0];
                        if (nextNode !== null) {
                            nextNode._setFocused(true);
                        }
                    }
                }
            };

            wijtreenode.prototype._mouseOver = function (event) {
                var self = this, tree = self._tree;
                if (!tree._editMode) {
                    self._mouseOverNode();
                    if (!tree._isDragging) {
                        tree._trigger("nodeMouseOver", event, self);
                    }
                }
            };

            wijtreenode.prototype._mouseOut = function (event) {
                var self = this, tree = self._tree;
                if (!tree._editMode) {
                    self._mouseOutNode();
                    if (!tree._isDragging) {
                        tree._trigger("nodeMouseOut", event, self);
                    }
                }
            };

            wijtreenode.prototype._mouseOverNode = function () {
                if (this.$inner !== null && !this._isOverNode) {
                    this.$inner.addClass(this.options.wijCSS.stateHover);
                    this._isOverNode = true;
                }
            };

            wijtreenode.prototype._mouseOutNode = function () {
                if (this.$inner !== null && this._isOverNode) {
                    this.$inner.removeClass(this.options.wijCSS.stateHover);
                    this._isOverNode = false;
                }
            };

            wijtreenode.prototype._mouseOverHitArea = function (event) {
                var bound, p, self = this, tree = self._tree;
                if (tree.options.expandCollapseHoverUsed) {
                    if (self._hasChildren && !self._isOverHitArea) {
                        bound = self._getBounds(self.element);
                        p = { x: event.pageX, y: event.pageY };
                        if (self._isMouseInsideRect(p, bound)) {
                            self._isOverHitArea = true;
                            self._setExpanded(true);
                        }
                    }
                }
            };

            wijtreenode.prototype._mouseOutHitArea = function (event) {
                var p = { x: event.pageX, y: event.pageY }, bound, self = this, tree = self._tree;
                if (tree.options.expandCollapseHoverUsed) {
                    if (self._hasChildren && !!self._isOverHitArea) {
                        bound = self._getBounds(self.element);
                        if (!self._isMouseInsideRect(p, bound)) {
                            self._isOverHitArea = false;
                            self._setExpanded(false);
                        }
                    } else if (self._getOwner().element.is(":" + self.widgetFullName)) {
                        bound = self._getBounds(self._getOwner().element);
                        if (!self._isMouseInsideRect(p, bound)) {
                            self._getOwner()._isOverHitArea = false;
                            self._getOwner()._setExpanded(false);
                        }
                    }
                }
            };

            /*public methods*/
            /**
            * Destroy the node widget.
            */
            wijtreenode.prototype.destroy = function () {
                var self = this, $nodes, o = self.options, $childnode;
                if (self.element.data("ui-draggable")) {
                    self.element.draggable("destroy");
                }
                if (self.$hitArea) {
                    self.$hitArea.remove();
                }
                if (self.$checkBox) {
                    self.$checkBox.remove();
                }
                if (self.$nodeImage) {
                    self.$nodeImage.remove();
                }
                self._unbindCreateNodesEvent();
                self.$navigateUrl.unwrap().unwrap().removeClass(o.wijCSS.stateDefault).removeClass(o.wijCSS.stateActive).unbind("mousedown");
                $nodes = self.element.find("ul:first").show();
                $nodes.removeClass();

                $nodes.children("li").each(function () {
                    $childnode = $(this);
                    var nodeWidget = getTreeNodeWidget($childnode);
                    if (nodeWidget) {
                        nodeWidget.destroy();
                    }
                });

                self.element.removeData("nodes").removeData("owner").removeData("widgetName").removeClass();

                _super.prototype.destroy.call(this);
            };

            /**
            * The add method adds a node to the node.
            * @example $("#treenode1").wijtreenode("add", "node 1", 1);
            * @param {string|object} node
            * 1.markup html.such as "<li><a>node</a></li>" as a node.
            * 2.wijtreenode element.
            * 3.object options according to the options of wijtreenode.
            * 4. node's text.
            * @param {number} position The position to insert at.
            */
            wijtreenode.prototype.add = function (node, position) {
                var nodeWidget = null, $node, nodes, self = this, cnodes, i, itemDom, originalLength, $link, $checkbox;

                if ($.browser.safari) {
                    itemDom = "<li><a href='{0}'>{1}</a></li>";
                } else {
                    itemDom = "<li><a href='{0}' class='wijmo-wijtree-link'>{1}</a></li>";
                }
                if (typeof node === "string") {
                    $node = $(itemDom.replace(/\{0\}/, "#").replace(/\{1\}/, node));
                    self._createNodeWidget($node);
                    nodeWidget = $node.data($node.data("widgetName"));
                } else if (node.jquery) {
                    if (!node.data("widgetName")) {
                        self._createNodeWidget(node);
                    }
                    nodeWidget = node.data(node.data("widgetName"));
                } else if (node.nodeType) {
                    $node = $(node);
                    self._createNodeWidget($node);
                    nodeWidget = $node.data($node.data("widgetName"));
                } else if ($.isPlainObject(node)) {
                    $node = $(itemDom.replace(/\{0\}/, node.url ? node.url : "#").replace(/\{1\}/, node.text)); //node
                    node.isAddedNodeWithOptions = true;
                    self._createNodeWidget($node, node);
                    nodeWidget = $node.data($node.data("widgetName"));
                }

                if (nodeWidget === null) {
                    return;
                }

                if (!$.browser.safari) {
                    $link = self.element.children(".wijmo-wijtree-node").find("." + localCSS.wijtreeInner + " .wijmo-wijtree-link");
                    if ($link && $link.length > 0) {
                        $link.removeClass("wijmo-wijtree-link");
                    }

                    $checkbox = self.element.children(".wijmo-wijtree-node").find("." + localCSS.wijtreeInner + " .wijmo-checkbox");
                    if ($checkbox && $checkbox.length > 0) {
                        $checkbox.removeClass("wijmo-checkbox");
                    }
                }

                nodes = self.getNodes();
                if (!position || position > nodes.length) {
                    if (position !== 0) {
                        position = nodes.length;
                    }
                }

                if ($.mobile) {
                    nodeWidget.element.find("a").addClass("ui-link");
                }

                cnodes = nodeWidget.getNodes();
                nodeWidget._tree = self._tree;
                for (i = 0; i < cnodes.length; i++) {
                    cnodes[i]._tree = self._tree;
                }
                nodeWidget._setField("owner", self);
                originalLength = nodes.length;
                if (!self.$nodes || !self.$nodes.length) {
                    self.$nodes = $("<ul></ul>").addClass("wijmo-wijtree-list").addClass(self.options.wijCSS.helperReset).addClass("wijmo-wijtree-child");
                    self.element.append(self.$nodes);
                }
                if (originalLength > 0 && originalLength !== position) {
                    if (nodeWidget.element.get(0) !== nodes[position].element.get(0)) {
                        nodeWidget.element.insertBefore(nodes[position].element);
                    }
                } else {
                    self.$nodes.append(nodeWidget.element);
                }
                self.$subnodes = null;
                self._changeCollection(position, nodeWidget);
                self._collectionChanged();
                nodeWidget._initNodeClass();

                if (!$.browser.safari) {
                    setTimeout(function () {
                        if ($link && $link.length > 0) {
                            $link.addClass("wijmo-wijtree-link");
                        }
                        if ($checkbox && $checkbox.length > 0) {
                            $checkbox.addClass("wijmo-checkbox");
                        }
                    }, 0);
                }
            };

            /**
            * The remove method removes the indicated node from this node.
            * @example $("#tree").wijtree("remove", 1);
            * @param {string|object} node
            * which node to be removed
            * 1.wijtreenode element.
            * 2.the zero-based index of which node you determined to remove.
            */
            wijtreenode.prototype.remove = function (node) {
                var idx = -1, nodeWidget, self = this, nodes = this.getNodes();
                if (node.jquery) {
                    idx = node.index();
                } else if (typeof node === "number") {
                    idx = node;
                }
                if (idx < 0 || idx >= nodes.length) {
                    return;
                }
                nodeWidget = nodes[idx];
                nodeWidget.element.detach();
                self.$subnodes = null;
                self._changeCollection(idx);
                self._collectionChanged();
            };

            /**
            * The getNodes method gets an array that contains the root nodes of the current tree node.
            * @example $("#tree").wijtree("getNodes");
            * @return {Array}
            */
            wijtreenode.prototype.getNodes = function () {
                if (this._hasChildren) {
                    this._createChildNodesPartially(true);
                } else {
                    this._setField("nodes", []);
                }
                return this._getField("nodes");
            };

            wijtreenode.prototype._changeCollection = function (idx, nodeWidget) {
                var nodes = this.getNodes(), ons = this.options.nodes;
                if (nodeWidget) {
                    nodes.splice(idx, 0, nodeWidget);
                    ons.splice(idx, 0, nodeWidget.options);
                } else {
                    nodes.splice(idx, 1);
                    ons.splice(idx, 1);
                }
            };

            /**
            * Sorts the child nodes of the node.
            */
            wijtreenode.prototype.sortNodes = function () {
                var nodes = this.getNodes();
                this._sort();
                $.each(nodes, function (i, childNode) {
                    childNode._index = i;
                    childNode._insertBefore(i);
                });
                this._refreshNodesClass();
            };

            /**
            * Checks or unchecks the node.
            * @param {boolean} value Check or uncheck the node.
            */
            wijtreenode.prototype.check = function (value) {
                this._setOption("checked", value);
            };

            /**
            * Selects or unselects the node.
            * @param {boolean} value select or unselect the node.
            */
            wijtreenode.prototype.select = function (value) {
                this._setOption("selected", value);
            };

            /**
            * Get owner which contains the node.
            */
            wijtreenode.prototype.getOwner = function () {
                var owner = this._getOwner();
                if (owner && owner.element.is("li")) {
                    return owner;
                }
                return null;
            };

            /**
            * Expands the node.
            */
            wijtreenode.prototype.expand = function () {
                this._setOption("expanded", true);
            };

            /**
            * Collapses the node.
            */
            wijtreenode.prototype.collapse = function () {
                this._setOption("expanded", false);
            };

            /*region prvite Methods*/
            wijtreenode.prototype._insertBefore = function (i) {
                var $lis = this.element.parent().children("li");
                if (this.element.index() !== i) {
                    this.element.insertBefore($lis.eq(i));
                }
            };

            wijtreenode.prototype._sort = function () {
                var nodes = this.getNodes();
                if (this._isSorted) {
                    if (!this._isDecsSort) {
                        nodes.sort(this._compare2NodeTextAsc);
                        this._isDecsSort = true;
                    } else {
                        nodes.sort(this._compare2NodeTextDesc);
                        this._isDecsSort = false;
                    }
                } else {
                    nodes.sort(this._compare2NodeTextAsc);
                    this._isSorted = true;
                    this._isDecsSort = true;
                }
            };

            wijtreenode.prototype._compare2NodeTextAsc = function (a, b) {
                if (a !== null && b !== null) {
                    return a._text.localeCompare(b._text);
                }
            };

            wijtreenode.prototype._compare2NodeTextDesc = function (a, b) {
                if (a !== null && b !== null) {
                    return -1 * a._text.localeCompare(b._text);
                }
            };

            wijtreenode.prototype._collectionChanged = function () {
                this._hasChildren = this._hasSubNodes();
                this._initNodeClass();
                //this._refreshNodesClass();
            };

            wijtreenode.prototype._refreshNodesClass = function () {
                var nodes = this.getNodes(), i;
                for (i = 0; i < nodes.length; i++) {
                    nodes[i]._initNodeClass();
                }
            };

            wijtreenode.prototype._setChecked = function (value) {
                var self = this;
                if (self.options.checked === value && self._checkState !== "indeterminate") {
                    return;
                }
                self.options.checked = value;
                self.$nodeBody.attr("aria-checked", value);
                this._checkItem();
            };

            wijtreenode.prototype._isClosestDisabled = function () {
                var self = this, disabledClass = "." + self._tree.widgetFullName + "-disabled,." + self.widgetFullName + "-disabled";
                if (self.element.closest(disabledClass, self._tree.element).length) {
                    return true;
                }
                return false;
            };

            wijtreenode.prototype._setExpanded = function (value) {
                var self = this, o = self.options;
                if (self._expanded === value) {
                    return;
                }
                if (self._hasChildren || o.hasChildren) {
                    self._expandNode(value);
                }
            };

            wijtreenode.prototype._setFocused = function (value) {
                if (value) {
                    this.$navigateUrl.focus();
                    this._setFocusNode();
                } else {
                    this.$navigateUrl.trigger("focusout");
                }
            };

            wijtreenode.prototype._setFocusNode = function () {
                if (this._tree._focusNode && $.browser.webkit) {
                    this._tree._focusNode.$navigateUrl.trigger("focusout");
                }
                this._focused = true;
                this._tree._focusNode = this;
                this.$inner.addClass(this.options.wijCSS.stateFocus);
            };

            wijtreenode.prototype._setToolTip = function (value) {
                if (value.length) {
                    this.element.attr("title", value);
                } else {
                    this.element.removeAttr("title");
                }
            };

            wijtreenode.prototype._setText = function (value) {
                if (this._text !== value && value.length) {
                    this._text = value;
                    this._changeText(value);
                }
            };

            wijtreenode.prototype._setSelected = function (value) {
                var self = this, o = self.options;
                if (o.selected !== value) {
                    o.selected = value;
                    self.$nodeBody.attr("aria-selected", value);
                    self._selectNode(value);
                    self._setFocused(value);
                }
            };

            wijtreenode.prototype._setCheckBoxes = function (value) {
                var self = this;
                if (self.$checkBox) {
                    self.$checkBox[value ? 'show' : 'hide']();
                } else if (value) {
                    self._createTreeCheck();
                }

                $.each(self.getNodes(), function (idx, node) {
                    node._setCheckBoxes(value);
                });
            };

            wijtreenode.prototype._setHitArea = function (value) {
                var self = this;
                if (self._hasChildren) {
                    if (value) {
                        self._initNodeClass();
                        if (self.$hitArea) {
                            self.$hitArea.show();
                        }
                    } else {
                        self._expanded = true;
                        self.options.expanded = true;
                        self.$nodeBody.attr("aria-expanded", true);
                        if (self.$nodes && self.$nodes.length) {
                            self.$nodes.show();
                        }
                        self._initNodeClass();
                        if (self.$hitArea) {
                            self.$hitArea.hide();
                        }
                    }
                }
                $.each(self.getNodes(), function (idx, node) {
                    node._setHitArea(value);
                });
            };

            wijtreenode.prototype._getOwner = function () {
                return this._getField("owner");
            };

            wijtreenode.prototype._getTree = function () {
                var owner = this._getOwner();
                if (owner) {
                    if (owner._tree) {
                        return owner._tree;
                    } else {
                        return owner;
                    }
                }
                return null;
            };

            wijtreenode.prototype._getInitElement = function () {
                var li = $("<li>"), self = this, ul = $("<ul>"), nodes = self.getNodes();
                li.append(self.$navigateUrl.clone());
                if (nodes.length) {
                    li.append(ul);
                    $.each(nodes, function (i, n) {
                        var c = n._getInitElement();
                        ul.append(c);
                    });
                }
                return li;
            };

            wijtreenode.prototype._updateSubNodes = function () {
                var lis, i;

                this.$subnodes = [];
                if (this.$nodes === null || !this.$nodes.length) {
                    return;
                }
                lis = this.$nodes.children("li");
                for (i = 0; i < lis.length; i++) {
                    this.$subnodes.push($(lis[i]));
                }
            };

            wijtreenode.prototype._hasSubNodes = function () {
                if (this.options.nodes && this.options.nodes.length > 0) {
                    return true;
                }
                if (this._isHtmlGenerated()) {
                    return false;
                }
                if (this.$nodes === null) {
                    this.$nodes = this.element.children("ul").eq(0);
                }
                if (this.$nodes.length === 0) {
                    return false;
                }
                if (this.$subnodes === null) {
                    this._updateSubNodes();
                }
                return this.$subnodes.length > 0;
            };

            wijtreenode.prototype._getNodeWidget = function (el) {
                var node = this._getNodeByDom(el), widget;
                if (node.length > 0) {
                    widget = node.data(node.data("widgetName"));
                    return widget;
                }
                return null;
            };

            wijtreenode.prototype._createNodeWidget = function ($li, options) {
                return createNodeWidget($li, options, this, nodeWidgetName, this.options.treeClass);
            };

            wijtreenode.prototype._getNodeByDom = function (el) {
                return $(el).closest(":" + this.widgetFullName);
            };

            wijtreenode.prototype._getCurrentLevel = function () {
                return this.element.parentsUntil(":" + this.options.treeClass).length - 1;
            };

            wijtreenode.prototype._getField = function (key) {
                return this.element.data(key);
            };

            wijtreenode.prototype._setField = function (key, value) {
                this.element.data(key, value);
            };
            return wijtreenode;
        })(wijmo.wijmoWidget);
        _tree.wijtreenode = wijtreenode;

        var wijtreenode_options = (function () {
            function wijtreenode_options() {
                /**
                * wijCSS
                * @ignore
                */
                this.wijCSS = {
                    wijtreeInner: ""
                };
                /** wijMobileCSS
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-b",
                    stateDefault: "ui-btn ui-btn-b",
                    stateHover: "ui-btn-down-c",
                    stateActive: "ui-btn-down-b"
                };
                /** @ignore */
                this.treeClass = "wijmo-wijtree";
                /** Selector option for auto self initialization.
                *   This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijtreenode')";
                /** @ignore */
                this.accessKey = "";
                /** The checked option checks the tree node checkbox when it is set to true. It will uncheck the tree node checkbox when set to false.
                */
                this.checked = false;
                /** The collapsedIconClass option sets the collapsed node icon (based on ui-icon) for the specified nodes.
                */
                this.collapsedIconClass = "";
                /** The expanded option will expand the tree node if set to "true." It will collapse the tree node if set to "false.".
                */
                this.expanded = false;
                /** The expandedIconClass option sets the expanded node icon (based on ui-icon) for the specified nodes.
                */
                this.expandedIconClass = "";
                /** The itemIconClass option sets the node icon (based on ui-icon). It will be displayed on both expanded and collapsed nodes when the expandedIconClass and collapsedIconClass options are not specified.
                */
                this.itemIconClass = "";
                /** The navigateUrl option sets the node's navigate url link.
                */
                this.navigateUrl = "";
                /** The selected option selects the specified node when set to true, otherwise it unselects the node.
                */
                this.selected = false;
                /** This option sets the node's text.
                */
                this.text = "";
                /** The toolTip option sets the node's tooltip.
                */
                this.toolTip = "";
                /** The hasChildren option determines whether the specified node has child nodes. It's always used when you're custom adding child nodes, such as in an async load.
                */
                this.hasChildren = false;
                /** The params option sets the parameter needed to pass when the user is custom loading child nodes.
                */
                this.params = {};
                /** Determines the child nodes of this nodes.
                */
                this.nodes = null;
            }
            return wijtreenode_options;
        })();

        var wijtree_options = (function () {
            function wijtree_options() {
                /**
                * wijMobileCSS
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body-b",
                    stateDefault: "ui-btn ui-btn-b",
                    stateHover: "ui-btn-down-b",
                    stateActive: "ui-btn-down-c"
                };
                /** When the allowDrag option is set to true, the tree nodes can be dragged.
                */
                this.allowDrag = false;
                /** When allowDrop is set to true, one tree node can be dropped within another tree node.
                */
                this.allowDrop = false;
                /** The allowEdit option allows a user to edit the tree nodes at run time.
                */
                this.allowEdit = false;
                /** The allowSorting option allows the tree nodes to be sorted at run time when the user presses the "s" key.
                */
                this.allowSorting = true;
                /** The allowTriState option allows the tree nodes to exhibit triState behavior. This lets the node checkboxes be checked, unchecked, or indeterminate. This option must be used with the showCheckBoxes option.
                */
                this.allowTriState = true;
                /** The autoCheckNodes option allows the sub-nodes to be checked when the parent nodes are checked. To use this option, showCheckboxes must be set to "true."
                */
                this.autoCheckNodes = true;
                /** If this option is set to true,
                * the expanded node will be collapsed if another node is expanded.
                */
                this.autoCollapse = false;
                /** If set to true, the select, click,
                * and check operations are disabled too.
                */
                this.disabled = false;
                /** The expandCollapseHoverUsed option allows the tree to expand or collapse when the mouse hovers over the expand/collapse button.
                */
                this.expandCollapseHoverUsed = false;
                /** The showCheckBoxes option allows the node Check Box to be shown on the tree nodes.
                */
                this.showCheckBoxes = false;
                /** The showExpandCollapse option determines if the tree is displayed in an expanded or collapsed state. If set to "false," then the wijtree widget will be displayed in the expanded state.
                */
                this.showExpandCollapse = true;
                /** The expandAnimation option determines the animation effect, easing, and duration for showing child nodes when the parent node is expanded.
                */
                this.expandAnimation = { effect: "blind", easing: "linear", duration: 200 };
                /** The expandDelay option controls the length of time in milliseconds to delay before the node is expanded.
                */
                this.expandDelay = 0;
                /** The collapseAnimation option determines the animation effect, easing, and duration for hiding child nodes when the parent node is collapsed.
                */
                this.collapseAnimation = { effect: "blind", easing: "linear", duration: 200 };
                /** This option controls the length of time in milliseconds to delay before the node collapses.
                */
                this.collapseDelay = 0;
                /** Customize the jquery-ui-draggable plugin of wijtree.
                */
                this.draggable = null;
                /** Customize the jquery-ui-droppable plugin of wijtree.
                */
                this.droppable = null;
                /*
                * Customizes the helper element to be used to display the position that
                * the node will be inserted to.
                * If a function is specified, it must return a DOMElement.
                * @type {String|Function}
                */
                this.dropVisual = null;
                /** Set the child nodes object array as the datasource of wijtree.
                * @type {Array}
                * @example
                * // Supply a function as an option.
                * $(".selector").wijtree("option","nodes",
                * [{ text:"node1", navigateUrl:"#" }]);
                */
                this.nodes = null;
                /** The nodeBlur event fired when the node loses focus.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeBlur = null;
                /** The nodeFocus event fired when the node is focused.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeFocus = null;
                /** The nodeClick event fires when a tree node is clicked.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeClick = null;
                /** The nodeCheckChanging event fires before a node is checked.
                * You can cancel this event by returning false.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeCheckChanging = null;
                /** The nodeCheckChanged event fires when a node is checked.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeCheckChanged = null;
                /** The nodeCollapsed event fires when a tree node is collapsed.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeCollapsed = null;
                /** The nodeExpanded event handler.
                * A function called when a node is expanded.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeExpanded = null;
                /** The nodeDragging event handler.A function called
                * when the node is moved during a drag-and-drop operation.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeDragging = null;
                /** The nodeDragStarted event fires when a user starts to drag a node.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeDragStarted = null;
                /** The nodeBeforeDropped event handler is called before a draggable node is dropped in another position. If the event handler returns false, the drop action will be prevented.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeBeforeDropped = null;
                /** The nodeDropped event is called when an acceptable draggable node is dropped over to another position.
                * @event
                * @dataKey {jQuery} sourceParent The source parent of current draggable node before it be dragged, a jQuery object.
                * @dataKey {number} sIndex The Index of dragged node in source parent.
                * @dataKey {jQuery} targetParent The target parent of current draggable node after it be dropped, a jQuery object.
                * @dataKey {number} tIndex The Index of dragged node in target parent.
                * @dataKey {jQuery} draggable The current draggable node.
                * @dataKey {object} offset The current absolute position of the draggable helper.
                * @dataKey {object} position The current position of the draggable helper.
                */
                this.nodeDropped = null;
                /** The nodeMouseOver event fires when a user places the mouse pointer over a node.
                * @event
                * @param {object} event jQuery.Event object.
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeMouseOver = null;
                /** The nodeMouseOut event fires when the user moves the mouse pointer off of a node.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeMouseOut = null;
                /** The nodeTextChanged event fires when the text of a node changes.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeTextChanged = null;
                /** The selectedNodeChanged event fires when the selected node changes.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.selectedNodeChanged = null;
                /** The nodeExpanding event fires before a tree node is expanded.
                * This event can be canceled, if return false
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeExpanding = null;
                /** The nodeCollapsing event fires before a node collapses.
                * This event can be canceled, if return false
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data The node widget that relates to this event.
                */
                this.nodeCollapsing = null;
            }
            return wijtree_options;
        })();

        wijtreenode.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijtreenode_options());
        wijtree.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijtree_options());

        $.wijmo.registerWidget("wijtree", wijtree.prototype);
        $.wijmo.registerWidget("wijtreenode", wijtreenode.prototype);
    })(wijmo.tree || (wijmo.tree = {}));
    var tree = wijmo.tree;
})(wijmo || (wijmo = {}));

