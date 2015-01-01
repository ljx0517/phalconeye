/*
 *
 * Wijmo Library 3.20143.59
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 * ----
 * Credits: Wijmo includes some MIT-licensed software, see copyright notices below.
 */
/// <reference path="../External/declarations/jquery.d.ts"/>
/// <reference path="../External/declarations/jquery.ui.d.ts"/>
/// <reference path="../External/declarations/globalize.d.ts"/>
/// <reference path="../Base/wijmo.d.ts"/>
/// <reference path="../Data/src/dataView.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var wijmo;
(function (wijmo) {
    (function (ng) {
        // declare the Node variable explicitly because IE8 and older versions do not expose it.
        var Node;
        (function (Node) {
            Node[Node["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
            Node[Node["ATTRIBUTE_NODE"] = 2] = "ATTRIBUTE_NODE";
            Node[Node["TEXT_NODE"] = 3] = "TEXT_NODE";
            Node[Node["CDATA_SECTION_NODE"] = 4] = "CDATA_SECTION_NODE";
            Node[Node["ENTITY_REFERENCE_NODE"] = 5] = "ENTITY_REFERENCE_NODE";
            Node[Node["ENTITY_NODE"] = 6] = "ENTITY_NODE";
            Node[Node["PROCESSING_INSTRUCTION_NODE"] = 7] = "PROCESSING_INSTRUCTION_NODE";
            Node[Node["COMMENT_NODE"] = 8] = "COMMENT_NODE";
            Node[Node["DOCUMENT_NODE"] = 9] = "DOCUMENT_NODE";
            Node[Node["DOCUMENT_TYPE_NODE"] = 10] = "DOCUMENT_TYPE_NODE";
            Node[Node["DOCUMENT_FRAGMENT_NODE"] = 11] = "DOCUMENT_FRAGMENT_NODE";
            Node[Node["NOTATION_NODE"] = 12] = "NOTATION_NODE";
        })(Node || (Node = {}));

        

        

        /** Reads type structure from a value */
        function getTypeDefFromExample(value) {
            var flagPropertyName = "__WIJMO_getTypeDefFromExample_EXECUTING__";

            /** Mark object is being processed */
            function markObject() {
                try  {
                    value[flagPropertyName] = true;
                } catch (ex) {
                }
            }

            /** Unmark object is being processed */
            function unmarkObject() {
                try  {
                    delete value[flagPropertyName];
                } catch (ex) {
                }
            }

            /** Read structure from the value */
            function getMetadata() {
                var meta = {
                    type: angular.isArray(value) ? "array" : typeof value
                };
                switch (meta.type) {
                    case "object":
                        meta.properties = {};

                        if (value) {
                            $.each(value, function (key, propValue) {
                                if (key !== flagPropertyName) {
                                    meta.properties[key] = getTypeDefFromExample(propValue);
                                }
                            });
                        }
                        break;
                    case "array":
                        meta.elementType = getTypeDefFromExample(value[0]);
                        break;
                }
                return meta;
            }

            // if null, marked, a window, a document or a function, skip it
            if (value == null || value[flagPropertyName] || value == window || value == document || $.isFunction(value)) {
                return {};
            }

            // mark before processing
            markObject();
            try  {
                return getMetadata();
            } finally {
                // unmark after processing
                unmarkObject();
            }
        }

        /** Property paths utilities.
        * A property path is a sequence of property names separated by dots,
        * for example, "firstName.length" is a length of firstName property value
        */
        var propPath;
        (function (propPath) {
            /** Split a property path to components */
            function partition(path) {
                if (typeof path !== "string")
                    return path;
                var parts = path.split(/[\.\[\]]/g);
                for (var i = parts.length - 1; i >= 0; i--) {
                    if (!parts[i]) {
                        parts.splice(i, 1);
                    }
                }
                return parts;
            }
            propPath.partition = partition;

            /** Read property path value.
            * @remarks
            * Throws an exception if an intermediate value is null or undefined
            */
            function get(obj, path) {
                var parts = partition(path);
                for (var i = 0; obj && i < parts.length; i++) {
                    obj = obj[parts[i]];
                }
                return obj;
            }
            propPath.get = get;

            /** Set property path value
            * @remarks
            * Throws an exception if an intermediate value is null or undefined
            */
            function set(obj, path, value) {
                var parts = partition(path);
                var last = parts.pop();
                obj = get(obj, parts);
                if (obj) {
                    obj[last] = value;
                }
            }
            propPath.set = set;
        })(propPath || (propPath = {}));

        /** AngularJs-specific utilities */
        var ngTools;
        (function (ngTools) {
            /** Call a function on the next digest broadcast message of a scope. */
            function onDigest(scope, fn) {
                var removeWatcher;
                var removeWatcher = scope.$watch("any", function () {
                    if (removeWatcher) {
                        removeWatcher();
                        removeWatcher = null;
                    }
                    fn();
                });
            }
            ngTools.onDigest = onDigest;
        })(ngTools || (ngTools = {}));

        

        

        /** Do scope.$apply if it won't cause an exception */
        function safeApply(scope, data) {
            var phase = scope.$root.$$phase;
            if (phase !== '$apply' && phase !== '$digest') {
                scope.$apply(data);
            }
        }

        /** Do scope.$digest if it won't cause an exception */
        function safeDigest(scope) {
            var phase = scope.$root.$$phase;
            if (phase !== '$apply' && phase !== '$digest') {
                scope.$digest();
            }
        }

        

        /** A pair of a scope expression and its latest value */
        var TextEvalEntry = (function () {
            function TextEvalEntry(expr) {
                this.expr = expr;
            }
            return TextEvalEntry;
        })();

        /** Evaluates an Angular interpolation string */
        var TextEval = (function () {
            /** @param text The interpolation string
            * @param scope The scope containing the source data
            * @param onChange The callback function to invoke when value changes
            */
            function TextEval(text, scope, onChange) {
                var _this = this;
                this.text = text;
                this.scope = scope;
                this.onChange = onChange;
                /** Latest expression values */
                this.entries = {};
                var match;

                while (match = TextEval.exprRegex.exec(text)) {
                    var expr = match[1];

                    // do not add multiple entries for the same expressions
                    if (this.entries[expr]) {
                        continue;
                    }

                    // add an entry for the expression
                    this.entries[expr] = new TextEvalEntry(expr);
                }

                // for each entry, set up a watch and call this.update on change
                angular.forEach(this.entries, function (e) {
                    var assigned = false;
                    scope.$watch(e.expr, function (value) {
                        assigned = true;

                        // skip if value didn't change
                        if (e.value == value)
                            return;
                        e.value = value;
                        _this.update();
                    });

                    // if the entry value wasn't assigned so far, do it now
                    if (!assigned) {
                        e.value = scope.$eval(expr);
                    }
                });

                // render the current value
                this.update();
            }
            TextEval.prototype.update = function () {
                var _this = this;
                // for each Angular expression, replace it with its value
                var result = this.text.replace(TextEval.exprRegex, function (m, name) {
                    var entry = _this.entries[name];
                    return entry && entry.value;
                });

                // skip if the result didn't change
                if (result == this.result)
                    return;

                // update the result and invoke the callback
                this.result = result;
                if (this.onChange) {
                    this.onChange(result);
                }
            };
            TextEval.exprRegex = /{{([^}]+)}}/g;
            return TextEval;
        })();

        /** Parse text to a specified type */
        function parsePrimitiveValue(text, type) {
            switch (type.toLowerCase()) {
                case "boolean":
                    return text.toLowerCase() === "true";
                case "number":
                    return parseFloat(text);
                case "date":
                case "datetime":
                    return Globalize.parseDate(text);

                default:
                    return null;
            }
        }

        

        /** Inner markup of widget declaration, not options, such as content of splitter panels */
        var Subelement = (function () {
            function Subelement(element, link) {
                this.element = element;
                this.link = link;
            }
            return Subelement;
        })();

        /** Parsed widget declaration. Includes widget option values, data-binding and inner markup  */
        var Markup = (function () {
            /** Parses options, data-binding and inner markup from a DOM node according to widget metadata
            * @param node The root of a DOM tree
            * @param meta Widget metadata, describing how to parse a DOM tree
            * @param innerMarkupSelector a CSS selector for non-option inner markup
            * @param services Angular services needed for parsing
            */
            function Markup(node, meta, innerMarkupSelector, services) {
                this.innerMarkupSelector = innerMarkupSelector;
                this.services = services;
                /** A hash of options to be used during a widget construction */
                this.options = {};
                /** Parsed data-binding information */
                this.bindings = [];
                /** Inner markup, not part of options */
                this.subElements = [];
                var $node = $(node);

                // read id, class and style first
                this.id = $node.attr("id");
                this.clazz = $node.attr("class");
                this.style = $node.attr("style");

                // extract inner markup using innerMarkupSelector
                this.parseInnerMarkup($node);

                // parse the rest
                var typeDef = { type: "object", properties: meta.properties };
                this.parseOptionsAttribute($node, typeDef, meta.events);
                this.parseOptions($node, typeDef, meta.events);
            }
            /** move elements and id/class/style attributes from one element to another */
            Markup.prototype.moveContents = function (from, to) {
                /** Move an attribute by name */
                function moveAttr(name) {
                    var value = from.attr(name);
                    if (value) {
                        to.attr(name, value);
                        from.removeAttr(name);
                    }
                }

                // move subelements
                from.children().each(function (_, child) {
                    return to.append(child);
                });
                if (!to.children().length) {
                    to.text(from.text());
                }

                // move id, style and class attributes
                moveAttr("id");
                moveAttr("style");
                moveAttr("class");
                return to;
            };

            /** If element matches the innerMarkupSelector, extract the contents and $compile */
            Markup.prototype.extractSubelements = function (element) {
                if (!this.innerMarkupSelector)
                    return;
                var e = $(element);
                if (e.is(this.innerMarkupSelector)) {
                    var clone = element.clone();
                    var converted = this.moveContents(element, $("<div/>"));
                    this.subElements.push(new Subelement(clone, this.services.$compile(converted)));
                    e.empty();
                }
            };

            /** Extract non-option inner markup from the element, prepare and put to this.subelements */
            Markup.prototype.parseInnerMarkup = function (element) {
                var _this = this;
                var addInnerNode = function ($node) {
                    var clone = $node.clone();
                    _this.subElements.push(new Subelement(clone, _this.services.$compile($node)));
                    $node.remove();
                };

                // find html elements, compile them and put to this.subelements
                element.children(Markup.allowedInnerHtmlSelector).each(function (_, e) {
                    return addInnerNode($(e));
                });

                // do the same with contents of <inner-markup> subelement, if found.
                var container = element.children("inner-markup");
                if (container.length > 0) {
                    container.children().each(function (_, e) {
                        return addInnerNode($(e));
                    });
                    container.remove();
                }
            };

            /** Render parsed subelements to the parentElement */
            Markup.prototype.apply = function (scope, parentElement) {
                angular.forEach(this.subElements, function (se) {
                    return se.link(scope.$parent, function (el) {
                        return parentElement.append(el);
                    });
                });
            };

            /** Create a (lowerCaseName => name) hash for the properties of an object */
            Markup.prototype.getNameMap = function (obj) {
                var map = {}, key;
                for (key in obj) {
                    map[key.toLowerCase()] = key;
                }
                return map;
            };
            Markup.prototype.isSpecialAttribute = function (name) {
                return name == "id" || name == "style" || name == "class";
            };

            /** Extract options and put to this.options */
            Markup.prototype.parseOptions = function ($node, typeDef, events) {
                $.extend(true, this.options, this.parse($node, typeDef, events, ""));
            };

            /** Parse options from a DOM tree according to widget metadata */
            Markup.prototype.parse = function ($node, typeDef, events, path) {
                var _this = this;
                // process a child node, that can be an attribute or an element
                var readNode = function (node) {
                    var $node = $(node), value;

                    switch (node.nodeType) {
                        case 2 /* ATTRIBUTE_NODE */:
                            value = node.value;
                            break;
                        case 1 /* ELEMENT_NODE */:
                            value = $node.text();
                            break;
                        default:
                            return;
                    }

                    var name = node.nodeName || node.name;

                    // HTML is case-insenstive, so node.name is often all capital case.
                    name = name.toLowerCase();

                    // Restore the original property name casing using name map
                    if (map[name]) {
                        name = map[name];
                    } else if (name.match(/-/)) {
                        // if name is written using dashes, such as border-width, then remove dashes and make next-to-dash characters capital,such as borderWidth
                        var parts = name.split("-");
                        name = parts.shift();
                        angular.forEach(parts, function (p) {
                            return name += p.charAt(0).toUpperCase() + p.substring(1);
                        });
                    }

                    // skip if name is special
                    if (_this.isSpecialAttribute(name) && node.nodeType === 2 /* ATTRIBUTE_NODE */) {
                        return;
                    }

                    var isArrayElement = node.nodeType === 1 /* ELEMENT_NODE */ && array;

                    // path for the node
                    var newPath = isArrayElement ? path + "[" + array.length + "]" : (path && path + ".") + name;

                    // try to find metadata for the property
                    var metadata = properties && properties[name];

                    // if value contains an interpolation string and there are no subelements, process as a data-bound option
                    if (!hasChildElements(node) && value && value.match(/{{/)) {
                        toRemove.push(node);
                        _this.bindings.push({
                            typeDef: metadata,
                            path: newPath,
                            interpolationString: value
                        });

                        // if the interpolation string will become an array element, put a null in the meantime
                        if (isArrayElement) {
                            array.push("");
                        }
                        return;
                    }

                    // if node is an element and an array is expected, parse as an array element
                    if (isArrayElement) {
                        // then push the sub-element
                        array.push(_this.parse($node, typeDef && typeDef.elementType, events, newPath));
                        return;
                    }

                    // if node is an attribute, check if the value contains a scope expression
                    // skip if starts with a digit
                    if (value.match(/^[^\d]/) && node.nodeType === 2 /* ATTRIBUTE_NODE */) {
                        // there are two cases where attribute value is an expression: a two-way bound option or an event handler option
                        var isTwoWayBindingOption = metadata && (metadata.changeEvent || metadata.twoWayBinding);
                        var isEvent = events && name in events;
                        if (isTwoWayBindingOption || isEvent) {
                            toRemove.push(node);
                            _this.bindings.push({ path: newPath, expression: value, isEvent: isEvent });
                            return;
                        }
                    }

                    // in all other cases, parse the contents of a node as a composite option
                    obj[name] = _this.parse($node, metadata, events, newPath);
                };

                var node = $node[0], text = node.nodeType === 3 /* TEXT_NODE */ ? node.wholeText : node.value, isArray = typeDef && typeDef.type === "array", properties = typeDef && typeDef.properties, map = properties && this.getNameMap(properties) || {}, toRemove = [], obj, array;

                // extract non-option inner markup before processing
                if (node.nodeType === 1 /* ELEMENT_NODE */) {
                    this.extractSubelements($node);
                }

                // try parse the node value as primitive
                var primitiveValue = typeDef && typeDef.type ? parsePrimitiveValue(text, typeDef && typeDef.type) : null;
                if (primitiveValue !== null) {
                    return primitiveValue;
                } else if (primitiveValue == null) {
                    var primitiveTypeRequested = typeDef && typeDef.type && typeDef.type !== "object" && typeDef.type !== "array";
                    if (primitiveTypeRequested || node.nodeType !== 1 /* ELEMENT_NODE */) {
                        return text;
                    }
                }

                // parse a DOM element to an object/array
                if (isArray) {
                    array = [];
                } else {
                    obj = {};
                }

                // read attributes
                angular.forEach(node.attributes, readNode);

                // read subelements
                angular.forEach(node.childNodes, readNode);

                // remove nodes marked for removal
                $.each(toRemove, function (_, node) {
                    if (node.nodeType === 2 /* ATTRIBUTE_NODE */) {
                        $(node.ownerElement).removeAttr(node.name);
                    } else {
                        $(node).remove();
                    }
                });

                return obj || array;
            };

            /** Given an options object and metadata, extract data-bindings and event handlers */
            Markup.prototype.extractBindingsAndEvents = function (root, typeDef, events, path) {
                var _this = this;
                if (!root)
                    return;

                var properties = typeDef && typeDef.properties;

                $.each(root, function (name, value) {
                    var newPath = (path && path + ".") + name;
                    var metadata = properties && properties[name];

                    if (typeof value === "object") {
                        // call recursively to process property values
                        _this.extractBindingsAndEvents(value, metadata, events, newPath);
                    } else if (typeof value == "string") {
                        var remove = false;
                        if (typeof value == "string" && value.match(/{{/)) {
                            _this.bindings.push({
                                typeDef: metadata,
                                path: newPath,
                                interpolationString: value
                            });
                            remove = true;
                        } else if (value.match(/^[^\d]/)) {
                            var isTwoWayBindingOption = metadata && (metadata.changeEvent || metadata.twoWayBinding);
                            var isEvent = events && name in events;
                            if (isTwoWayBindingOption || isEvent) {
                                remove = true;
                                _this.bindings.push({ path: newPath, expression: value, isEvent: isEvent });
                            }
                        }

                        if (remove) {
                            delete root[name];
                        }
                    }
                });
            };

            /** Read the 'options' attribute and parse its contents */
            Markup.prototype.parseOptionsAttribute = function ($node, typeDef, events) {
                var optionsString = $node.attr("options");
                $node.attr("options", "");
                if (!optionsString)
                    return;

                var paddedExpression = "(function() { return " + optionsString + "})()";
                var options;
                try  {
                    options = eval(paddedExpression);
                } catch (ex) {
                    throw new Error("JSON could not be parsed: " + optionsString + ".\nError: " + ex);
                }

                if (options) {
                    this.extractBindingsAndEvents(options, typeDef, events, "");
                }

                $.extend(true, this.options, options);
            };
            Markup.allowedInnerHtmlSelector = "div, span, table, ul, ol, p, li, h1, h2, h3, h4, a, img, label, input";
            return Markup;
        })();

        /** This module contains Angular directive classes for widgets. If a class for a widget is not found, the one for its base widget is used.
        * DirectiveBase is the base class for all widget directives. Only two classes derive from DirectiveBase: ElementDirective and AttributeDirective,
        * depending on whether a directive is an element or attribute
        */
        var definitions;
        (function (definitions) {
            /** Base class for all Wijmo directives */
            var DirectiveBase = (function () {
                function DirectiveBase(widgetName, namespace, clazz, services) {
                    this.widgetName = widgetName;
                    this.namespace = namespace;
                    this.services = services;
                    this.internalEventNamespace = "wijmo-angular";
                    this.delayInstanceCreation = false;
                    this.eventHandlerWrappers = {};
                    this.fullWidgetName = namespace + "-" + widgetName;
                    this.wijMetadata = DirectiveBase.mergeMetadata(widgetName, clazz.prototype.options);
                    this.eventPrefix = clazz.prototype.widgetEventPrefix || widgetName;
                }
                /** Merge metadata from different sources: the widget type, its base types and default values */
                DirectiveBase.mergeMetadata = function (widgetName, options) {
                    var fromOptions = { properties: getTypeDefFromExample(options).properties }, result = $.extend({}, fromOptions, widgetMetadata["base"]), inheritanceStack = [], parentName = widgetName;

                    do {
                        inheritanceStack.unshift(parentName);
                        parentName = widgetMetadata[parentName] && widgetMetadata[parentName].inherits;
                    } while(parentName);

                    angular.forEach(inheritanceStack, function (name) {
                        return $.extend(true, result, widgetMetadata[name]);
                    });
                    return result;
                };

                /** Creates a new object prototyped from the current one
                * @remarks
                * This method is used for transition from one state to another.
                * The possible states are: created -> compiled -> linked
                * More than one object may be prototyped from one object, for example, a directive may be linked many times
                * and it means that many linked directives must be created from a compiled one
                */
                DirectiveBase.prototype.transition = function () {
                    if (Object.create) {
                        try  {
                            return Object.create(this);
                        } catch (err) {
                        }
                    }

                    var Clazz = function () {
                    };
                    Clazz.prototype = this;
                    return new Clazz();
                };

                // ----- compiled state -----
                /** Compiles the directive according to the tElem and tAttrs params
                * @returns a new object in the compiled state, prototyped from this one
                */
                DirectiveBase.prototype.compile = function (tElem, tAttrs, $compile) {
                    return this.transition()._compile(tElem, tAttrs, $compile);
                };

                /** Perform compilation. Overridden in base classes */
                DirectiveBase.prototype._compile = function (tElem, tAttrs, $compile) {
                    return $.proxy(this.link, this);
                };

                /** Initialize the 'widget' field */
                DirectiveBase.prototype._initWidget = function () {
                    this.widget = this.element.data(this.widgetName) || this.element.data(this.fullWidgetName);
                };

                /** Transition to the linked state */
                DirectiveBase.prototype.link = function (scope, elem, attrs) {
                    // create a new object
                    var transitioned = this.transition();

                    // init the new object
                    transitioned.$scope = scope;
                    transitioned.element = elem;

                    // link the new object
                    transitioned._link(attrs);
                };

                /** Perform linkage. Overridden in base classes */
                DirectiveBase.prototype._link = function (attrs) {
                    var _this = this;
                    ngTools.onDigest(this.$scope.$parent, function () {
                        _this._createInstance(attrs);
                        _this._initWidget();
                    });
                };

                /** Create a widget. To be overridden in derived classes */
                DirectiveBase.prototype._createInstance = function (attrs) {
                };

                //#region Events
                DirectiveBase.prototype.getEventFullName = function (name) {
                    return this.eventPrefix + name.toLowerCase() + "." + this.internalEventNamespace;
                };

                DirectiveBase.prototype.unbindFromWidget = function (name, handler) {
                    name = this.getEventFullName(name);
                    this.element.unbind(name, this.eventHandlerWrappers[name] || handler);
                };
                DirectiveBase.prototype.bindToWidget = function (name, handler) {
                    name = this.getEventFullName(name);
                    var scope = this.$scope;
                    this.eventHandlerWrappers[name] = function () {
                        // Must return the result, e.g. "beforeXxx" event handler will return false to stop action.
                        var result = handler.apply(this, arguments);
                        safeDigest(scope.$parent);
                        return result;
                    };
                    this.element.bind(name, this.eventHandlerWrappers[name]);
                };

                //#endregion
                /** Listen to changes of the "data" option. */
                DirectiveBase.prototype.watchData = function (binding, handler) {
                    var scope = this.$scope.$parent;
                    var lastData;
                    var lastLength;

                    /** Returns true if data didn't change. Otherwise, false */
                    function sameData(data) {
                        // if length changed, return false
                        if (lastData && lastData.length != lastLength) {
                            return false;
                        }

                        // if value is the same object, nothing changed
                        if (lastData === data) {
                            return true;
                        }

                        // if lengths of the new and old arrays are differnt, return false
                        if (lastData == null || data == null || data.length != lastData.length) {
                            return false;
                        }

                        for (var i = 0; i < data.length; i++) {
                            if (data[i] !== lastData[i]) {
                                return false;
                            }
                        }

                        // in all other cases, nothing changed
                        return true;
                    }

                    // listen to data and invoke the callback when changed
                    scope.$watch(function () {
                        var data = scope.$eval(binding.expression);
                        if (!sameData(data)) {
                            lastData = data;
                            lastLength = data.length;
                            handler(lastData);
                        }
                    });
                };

                /** Listen to changes of an option */
                DirectiveBase.prototype.watchBinding = function (binding, handler) {
                    if (binding.path === "data") {
                        // listen to "data" in a special way
                        this.watchData(binding, handler);
                    } else {
                        this.$scope.$parent.$watch(binding.expression, handler, true);
                    }
                };

                /** Process data-bindings */
                DirectiveBase.prototype.wireData = function (creationOptions) {
                    var _this = this;
                    var dataScope = this.$scope.$parent, applyingOptions = {}, changeEvents = {}, bindEvents = {};

                    // for each data-binding, listen to changes in the view model and update options
                    $.each(this.markup.bindings, function (_, binding) {
                        if (binding.interpolationString) {
                            var textEval = new TextEval(binding.interpolationString, dataScope, function (text) {
                                var value = text;
                                if (binding.typeDef && binding.typeDef.type) {
                                    value = parsePrimitiveValue(value, binding.typeDef.type);
                                    if (value === null) {
                                        value = text;
                                    }
                                }

                                // set the option value
                                if (_this.widget) {
                                    // if widget is created, set the new value to the instance
                                    _this.setOption(binding.path, value);
                                } else {
                                    // otherwise, set it to the options object
                                    propPath.set(creationOptions, binding.path, value);
                                }
                            });
                            return;
                        }

                        //collect the event bindings
                        if (_this.delayInstanceCreation && binding.isEvent) {
                            bindEvents[binding.path] = dataScope.$eval(binding.expression);
                        }

                        // listen to changes in the view model
                        var checkPrev = false;
                        _this.watchBinding(binding, function (value) {
                            if (binding.isEvent) {
                                // if option is an event, then unbind/bind the old/new handler
                                if (prevValue) {
                                    // clear the option value before calling $.fn.bind. Otherwise, a handler is called two times
                                    // [86672] clear that option anyway in case that we wrap user's event handler
                                    _this.widget.option(binding.path, null);
                                    _this.unbindFromWidget(binding.path, prevValue);
                                }
                                if (value) {
                                    _this.bindToWidget(binding.path, value);
                                }
                            } else {
                                // skip if the option is being applied at the moment or value didn't change
                                if (applyingOptions[binding.path] && _this.widget.option(binding.path) === value) {
                                    return;
                                }

                                if (!checkPrev || value !== prevValue) {
                                    _this.setOption(binding.path, value);
                                }
                            }
                            checkPrev = false;
                            prevValue = value;
                        });
                        var prevValue = dataScope.$eval(binding.expression);
                        if (prevValue !== undefined || !binding.isEvent) {
                            checkPrev = true;
                            propPath.set(creationOptions, binding.path, prevValue);
                        }

                        // listen to changes in the widget options
                        if (binding.isEvent)
                            return;
                        var meta = propPath.get(_this.wijMetadata.properties, binding.path);

                        // get the change event list
                        var changeEventList = meta && meta.changeEvent;
                        if (!changeEventList) {
                            changeEventList = binding.path + "Changed";
                        }
                        if (typeof changeEventList === "string") {
                            changeEventList = [changeEventList];
                        }

                        // for each event, associate the binding to the event
                        $.each(changeEventList, function (_, changeEvent) {
                            changeEvents[changeEvent] = changeEvents[changeEvent] || [];
                            changeEvents[changeEvent].push(binding);
                        });
                    });

                    // for all events, listen to them and update associated bindings
                    $.each(changeEvents, function (changeEvent, bindings) {
                        // when the change event has binded in markup, bind the funtion to widget element
                        // before creating widget, for safe: can add condition "this.delayInstanceCreation"
                        if (_this.delayInstanceCreation && bindEvents[changeEvent]) {
                            _this.unbindFromWidget(changeEvent, bindEvents[changeEvent]);
                            _this.bindToWidget(changeEvent, bindEvents[changeEvent]);
                        }

                        creationOptions[changeEvent] = function () {
                            // for each binding, read an option value and update the scope
                            $.each(bindings, function (_, binding) {
                                if (!_this.widget) {
                                    // the event is raised during widget creation
                                    return;
                                }
                                applyingOptions[binding.path] = true;
                                try  {
                                    propPath.set(dataScope, binding.expression, _this.widget.option(binding.path));
                                    safeApply(dataScope, binding.expression);
                                } finally {
                                    applyingOptions[binding.path] = false;
                                }
                            });
                        };
                    });
                };

                /** Set option value
                * @param path an option name, or a path that starts with an option name
                */
                DirectiveBase.prototype.setOption = function (path, value) {
                    var parts = propPath.partition(path);
                    if (parts.length == 1) {
                        this.widget.option(path, value);
                    } else {
                        var optionName = parts.shift();
                        var optionValue = $.extend(true, {}, this.widget.option(optionName));
                        propPath.set(optionValue, parts, value);
                        this.widget.option(optionName, optionValue);
                    }
                };
                return DirectiveBase;
            })();
            definitions.DirectiveBase = DirectiveBase;

            /** A base class for attribute directives */
            var AttributeDirective = (function (_super) {
                __extends(AttributeDirective, _super);
                function AttributeDirective(widgetName, namespace, clazz, services) {
                    _super.call(this, widgetName, namespace, clazz, services);
                    this.scope = {};
                }
                // ----- linked state-----
                AttributeDirective.prototype._createInstance = function (attrs) {
                    var _this = this;
                    var create = function () {
                        var options = $.extend(true, {}, _this.markup.options);
                        _this.wireData(options);
                        _this.element[_this.widgetName](options);
                        _this._initWidget();
                    };

                    if (this.delayInstanceCreation) {
                        setTimeout(create, 0);
                    } else {
                        create();
                    }
                };

                /** Parse an element tree to options, data-binding entries and inner markup subelements */
                AttributeDirective.prototype.parseMarkup = function (elem) {
                    return new Markup(elem[0], this.wijMetadata, null, this.services);
                };

                // ---- compiled state-----
                AttributeDirective.prototype._compile = function (tElem, tAttrs, $compile) {
                    // parse markup during compilation
                    this.markup = this.parseMarkup(tElem);
                    return _super.prototype._compile.call(this, tElem, tAttrs, $compile);
                };
                return AttributeDirective;
            })(DirectiveBase);
            definitions.AttributeDirective = AttributeDirective;

            /** A base class for element directives */
            var ElementDirective = (function (_super) {
                __extends(ElementDirective, _super);
                function ElementDirective(widgetName, namespace, clazz, services) {
                    _super.call(this, widgetName, namespace, clazz, services);
                    /** A template for an element that will replace a custom element.
                    * A widget instance is created on top of the templated element.
                    * The majority of widgets can be created on top of a div.
                    */
                    this.expectedTemplate = "<div/>";
                    this.restrict = 'E';
                    this.scope = {};
                    this.innerMarkupSelector = null;
                }
                /** Creates Markup object. The method may be overridden in a derived class.*/
                ElementDirective.prototype.createMarkup = function (elem, meta) {
                    return new Markup(elem[0], meta, this.innerMarkupSelector, this.services);
                };

                /** Parse an element tree to options, data-binding entries and inner markup subelements */
                ElementDirective.prototype.parseMarkup = function (elem) {
                    var markup = this.createMarkup(elem, this.wijMetadata);
                    markup.options.dataSource = [];
                    return markup;
                };

                // ---- compiled state-----
                ElementDirective.prototype._compile = function (tElem, tAttrs, $compile) {
                    // parse markup during compilation
                    this.markup = this.parseMarkup(tElem);
                    return _super.prototype._compile.call(this, tElem, tAttrs, $compile);
                };

                // ----- linked state -----
                ElementDirective.prototype._link = function (attrs) {
                    // replace the given element with a new templated element
                    this.element = $(this.expectedTemplate).replaceAll(this.element);

                    // insert subelements found in the directive declaration
                    this.markup.apply(this.$scope, this.element);

                    // process with linkage
                    _super.prototype._link.call(this, attrs);
                };
                ElementDirective.prototype.createInstanceCore = function (options) {
                    this.element[this.widgetName](options);
                };
                ElementDirective.prototype._createInstance = function (attrs) {
                    var _this = this;
                    // clone options before creating a widget
                    var options = $.extend(true, {}, this.markup.options), create = function () {
                        // process data-bindings: update options and set up watchers
                        _this.wireData(options);

                        // create a widget instance
                        _this.createInstanceCore(options);

                        // update the 'widget' field
                        _this._initWidget();
                    };

                    // assign id, style and class to the new element
                    this.element.attr({
                        style: this.markup.style,
                        id: this.markup.id,
                        "class": this.markup.clazz
                    });

                    if (this.delayInstanceCreation) {
                        setTimeout(create, 0);
                    } else {
                        create();
                    }
                };
                return ElementDirective;
            })(DirectiveBase);
            definitions.ElementDirective = ElementDirective;

            /** Grid-specific Markup, contains cell templates */
            var GridMarkup = (function (_super) {
                __extends(GridMarkup, _super);
                function GridMarkup() {
                    _super.apply(this, arguments);
                }
                GridMarkup.prototype.extractCellTemplate = function ($col, name) {
                    var templateContainer = $col.children(name);
                    if (templateContainer.length === 0)
                        return null;
                    var template = templateContainer.children().clone();
                    if (template.length === 0)
                        return null;
                    templateContainer.remove();
                    return {
                        element: template,
                        link: this.services.$compile(template)
                    };
                };

                GridMarkup.prototype.extractCellTemplates = function (node) {
                    var _this = this;
                    this.cellTemplates = this.cellTemplates || [];

                    $(node).children("columns").children().each(function (index, col) {
                        var $col = $(col);
                        var cellTemplate = _this.extractCellTemplate($col, "cell-template");
                        var editorTemplate = _this.extractCellTemplate($col, "editor-template");
                        if (cellTemplate || editorTemplate) {
                            _this.cellTemplates[index] = {
                                view: cellTemplate,
                                edit: editorTemplate,
                                dataKey: $col.data("key")
                            };
                        }
                    });
                };

                // override parseOptions to extract cell templates
                GridMarkup.prototype.parseOptions = function ($node, typeDef, events) {
                    this.extractCellTemplates($node);
                    _super.prototype.parseOptions.call(this, $node, typeDef, events);
                    this.options.data = [];
                };
                return GridMarkup;
            })(Markup);

            /** wijgrid directive extends ElementDirective by adding cell templates */
            var wijgrid = (function (_super) {
                __extends(wijgrid, _super);
                function wijgrid() {
                    _super.apply(this, arguments);
                    this.expectedTemplate = "<table/>";
                }
                wijgrid.prototype.createMarkup = function (elem, typeDef) {
                    return new GridMarkup(elem[0], typeDef, this.innerMarkupSelector, this.services);
                };

                wijgrid.prototype.dataOptionExression = function () {
                    var expr = null;
                    $.each(this.markup.bindings, function (_, b) {
                        if (b.path === "data") {
                            expr = b.expression;
                            return false;
                        }
                    });
                    return expr;
                };

                wijgrid.prototype.applyCellTemplates = function (scope, options) {
                    var _this = this;
                    function applyCellTemplate(index, container, template) {
                        if (index < 0)
                            return false;

                        var items = scope.$parent.$eval(dataExpr);
                        if (!items)
                            return false;

                        var rowScope = scope.$new();

                        rowScope.rowData = (wijmo && wijmo.data && wijmo.data.isDataView(items)) ? items.item(index) : items[index]; // array

                        template.link(rowScope, function (el) {
                            container.empty().append(el);
                        });
                        container.children().data(ngKey, true);

                        safeDigest(rowScope);

                        return true;
                    }
                    var columns = options.columns, dataExpr = this.dataOptionExression(), ngKey = "wijmoNg";
                    if (!dataExpr)
                        return;

                    var hasEditTemplates = false;
                    $.each(this.markup.cellTemplates, function (index, template) {
                        if (!template)
                            return;
                        var column = (columns[index] = columns[index] || {});

                        if (template.view) {
                            var origFormatter = column.cellFormatter;
                            column.cellFormatter = function (args) {
                                var items = scope.$parent.$eval(dataExpr), originalIndex = args.row.dataItemIndex;

                                if (args.row.data && $.isArray(items)) {
                                    originalIndex = items.indexOf(args.row.data);
                                }

                                return $.isFunction(origFormatter) && origFormatter(args) || applyCellTemplate(originalIndex, args.$container, template.view);
                            };
                        }

                        if (template.edit) {
                            hasEditTemplates = true;
                        }
                    });

                    if (hasEditTemplates) {
                        var origBeforeCellEdit = options.beforeCellEdit;
                        var origAfterCellEdit = options.afterCellEdit;
                        var origBeforeCellUpdate = options.beforeCellUpdate;

                        options.beforeCellEdit = function (e, args) {
                            if ($.isFunction(origBeforeCellEdit)) {
                                origBeforeCellEdit(e, args);
                                if (args.handled)
                                    return;
                            }

                            var col = args.cell.column();
                            if (!col || col.dataIndex < 0 || col.dataIndex >= _this.markup.cellTemplates.length)
                                return;

                            var row = args.cell.row();
                            if (!row || row.dataItemIndex < 0)
                                return;

                            var container = args.cell.container();
                            if (!container || container.length == 0)
                                return;
                            var template;
                            $.each(_this.markup.cellTemplates, function (index, editorTemplate) {
                                if (editorTemplate && editorTemplate["dataKey"] === col["dataKey"]) {
                                    template = editorTemplate;
                                    return;
                                }
                            });
                            if (!template)
                                return;

                            if (applyCellTemplate(row.dataItemIndex, container, template.edit)) {
                                args.handled = true;
                            }
                        };
                        options.afterCellEdit = function (e, args) {
                            if ($.isFunction(origAfterCellEdit)) {
                                origAfterCellEdit(e, args);
                                if (args.handled)
                                    return;
                            }

                            var container = args.cell.container();
                            if (container && container.children().data(ngKey)) {
                                container.empty();
                            }
                        };
                        options.beforeCellUpdate = function (e, args) {
                            if ($.isFunction(origBeforeCellUpdate)) {
                                origBeforeCellUpdate(e, args);
                            } else {
                                var col = args.cell.column();

                                if (col && col.dataIndex && _this.markup.cellTemplates[col.dataIndex]) {
                                    // We assume that template control has already refreshed the model, and return current value.
                                    // Otherwise, wijgrid will return null if the extraction of new DOM value was unsuccessful.
                                    args.value = args.cell.value();
                                }
                            }
                        };
                    }
                };

                wijgrid.prototype.createInstanceCore = function (options) {
                    this.applyCellTemplates(this.$scope, options);
                    _super.prototype.createInstanceCore.call(this, options);
                };
                return wijgrid;
            })(ElementDirective);
            definitions.wijgrid = wijgrid;

            var wijgridfilter = (function (_super) {
                __extends(wijgridfilter, _super);
                function wijgridfilter() {
                    _super.apply(this, arguments);
                }
                return wijgridfilter;
            })(wijgrid);
            definitions.wijgridfilter = wijgridfilter;

            var wijcombobox = (function (_super) {
                __extends(wijcombobox, _super);
                function wijcombobox() {
                    _super.apply(this, arguments);
                    this.expectedTemplate = "<input/>";
                }
                return wijcombobox;
            })(ElementDirective);
            definitions.wijcombobox = wijcombobox;
            var wijupload = (function (_super) {
                __extends(wijupload, _super);
                function wijupload() {
                    _super.apply(this, arguments);
                    this.expectedTemplate = "<input type='file' />";
                }
                return wijupload;
            })(ElementDirective);
            definitions.wijupload = wijupload;
            var wijinputcore = (function (_super) {
                __extends(wijinputcore, _super);
                function wijinputcore() {
                    _super.apply(this, arguments);
                    this.expectedTemplate = "<input/>";
                }
                return wijinputcore;
            })(ElementDirective);
            definitions.wijinputcore = wijinputcore;
            var wijinputdate = (function (_super) {
                __extends(wijinputdate, _super);
                function wijinputdate() {
                    _super.apply(this, arguments);
                }
                return wijinputdate;
            })(wijinputcore);
            definitions.wijinputdate = wijinputdate;
            var wijinputmask = (function (_super) {
                __extends(wijinputmask, _super);
                function wijinputmask() {
                    _super.apply(this, arguments);
                }
                return wijinputmask;
            })(wijinputcore);
            definitions.wijinputmask = wijinputmask;
            var wijinputnumber = (function (_super) {
                __extends(wijinputnumber, _super);
                function wijinputnumber() {
                    _super.apply(this, arguments);
                }
                return wijinputnumber;
            })(wijinputcore);
            definitions.wijinputnumber = wijinputnumber;

            var wijcheckbox = (function (_super) {
                __extends(wijcheckbox, _super);
                function wijcheckbox() {
                    _super.apply(this, arguments);
                    this.expectedTemplate = "<input type='checkbox'/>";
                    this.delayInstanceCreation = true;
                }
                return wijcheckbox;
            })(AttributeDirective);
            definitions.wijcheckbox = wijcheckbox;
            var wijradio = (function (_super) {
                __extends(wijradio, _super);
                function wijradio() {
                    _super.apply(this, arguments);
                }
                return wijradio;
            })(wijcheckbox);
            definitions.wijradio = wijradio;

            var wijsplitter = (function (_super) {
                __extends(wijsplitter, _super);
                function wijsplitter() {
                    _super.apply(this, arguments);
                    this.innerMarkupSelector = "panel1, panel2";
                }
                return wijsplitter;
            })(ElementDirective);
            definitions.wijsplitter = wijsplitter;

            var wijexpander = (function (_super) {
                __extends(wijexpander, _super);
                function wijexpander() {
                    _super.apply(this, arguments);
                    this.innerMarkupSelector = "h1, div";
                }
                return wijexpander;
            })(ElementDirective);
            definitions.wijexpander = wijexpander;

            var wijmenu = (function (_super) {
                __extends(wijmenu, _super);
                function wijmenu() {
                    _super.apply(this, arguments);
                    this.expectedTemplate = "<ul/>";
                    this.delayInstanceCreation = true;
                }
                return wijmenu;
            })(ElementDirective);
            definitions.wijmenu = wijmenu;

            var wijtree = (function (_super) {
                __extends(wijtree, _super);
                function wijtree() {
                    _super.apply(this, arguments);
                    this.expectedTemplate = "<ul/>";
                    this.delayInstanceCreation = true;
                }
                return wijtree;
            })(ElementDirective);
            definitions.wijtree = wijtree;

            var wijeditor = (function (_super) {
                __extends(wijeditor, _super);
                function wijeditor() {
                    _super.apply(this, arguments);
                    this.expectedTemplate = "<textarea/>";
                }
                return wijeditor;
            })(ElementDirective);
            definitions.wijeditor = wijeditor;

            var TabsMarkup = (function (_super) {
                __extends(TabsMarkup, _super);
                function TabsMarkup(node, typeDef, services) {
                    _super.call(this, node, typeDef, "tab", services);
                    this.services = services;
                }
                TabsMarkup.prototype.apply = function (scope, parentElement) {
                    _super.prototype.apply.call(this, scope, parentElement);

                    var ul = parentElement.children("ul").first();
                    if (ul.length == 0) {
                        ul = $("<ul/>");
                        ul.prependTo(parentElement);
                    }

                    angular.forEach(this.subElements, function (se) {
                        if (!se.element.is("tab"))
                            return;
                        var id = se.element.attr("id"), anchor = $("<a/>").text(se.element.attr("title"));
                        if (id) {
                            anchor.attr("href", "#" + id);
                        }
                        $("<li/>").append(anchor).appendTo(ul);
                    });
                };
                return TabsMarkup;
            })(Markup);

            var wijtabs = (function (_super) {
                __extends(wijtabs, _super);
                function wijtabs() {
                    _super.apply(this, arguments);
                }
                wijtabs.prototype.createMarkup = function (element, typeDef) {
                    return new TabsMarkup(element, typeDef, this.services);
                };
                return wijtabs;
            })(ElementDirective);
            definitions.wijtabs = wijtabs;

            var wijspread = (function (_super) {
                __extends(wijspread, _super);
                function wijspread() {
                    _super.apply(this, arguments);
                }
                wijspread.prototype.setOption = function (path, value) {
                    var sheetMatch;
                    if (path === "dataSource") {
                        this.widget.spread().sheets[0].setDataSource(value);
                        return;
                    }

                    sheetMatch = path.match(/sheets\[(\d+)\]\.data/);
                    if (sheetMatch) {
                        var sheetIndex = parseInt(sheetMatch[1], 10);
                        this.widget.spread().sheets[sheetIndex].setDataSource(value);
                        return;
                    }

                    _super.prototype.setOption.call(this, path, value);
                };
                wijspread.prototype.watchBinding = function (binding, handler) {
                    if (binding.path.match(/sheets\[\d+\]\.data/)) {
                        this.watchData(binding, handler);
                    } else {
                        _super.prototype.watchBinding.call(this, binding, handler);
                    }
                };
                return wijspread;
            })(ElementDirective);
            definitions.wijspread = wijspread;

            /** Find a directive class in this module for a given widget name */
            function getDirectiveClass(widgetName) {
                var find = function (name) {
                    var metadata = widgetMetadata[name], parentMetadata;

                    // return a class with the same name as widget, or the one for the base widget
                    return definitions[name] || metadata && metadata.inherits && getDirectiveClass(metadata.inherits);
                };

                var result = find(widgetName);
                if (result) {
                    return result;
                }

                var meta = widgetMetadata[widgetName], isDecorator = meta && meta.isDecorator;
                return isDecorator ? AttributeDirective : ElementDirective;
            }
            definitions.getDirectiveClass = getDirectiveClass;
        })(definitions || (definitions = {}));

        // define the wijmo module
        var wijModule = angular["module"]('wijmo', []);

        /** Registers a widget directive */
        function registerDirective(widgetName, namespace, clazz, directiveName) {
            var meta = widgetMetadata[widgetName], directiveClass = definitions.getDirectiveClass(widgetName);

            directiveName = directiveName || widgetName.toLowerCase();

            // call document.createElement, so IE knows that the directive name with dashes is a valid name
            createElementsForSubelements(directiveName, meta);

            // register the directive
            wijModule.directive(directiveName, [
                "$compile", function ($compile) {
                    var services = { $compile: $compile };
                    return new directiveClass(widgetName, namespace, clazz, services);
                }]);
        }

        /** Call document.createElement for all possible custom elements/subelements for a directive.
        * @remarks
        * Angular custom elements need it to work in old IE
        */
        function createElementsForSubelements(name, meta) {
            function registerName(name) {
                document.createElement(name);
                var propNameWithDashes = insertDashes(name);
                if (propNameWithDashes != name) {
                    document.createElement(propNameWithDashes);
                }
            }

            // recursive into properties
            function create(properties) {
                if (!properties)
                    return;
                for (var propName in properties) {
                    registerName(propName);

                    var prop = properties[propName] && properties[propName];
                    if (prop) {
                        if (prop.singular) {
                            registerName(prop.singular);
                        }
                        create(prop.properties);

                        if (prop.elementType) {
                            create(prop.elementType.properties);
                        }
                    }
                }
            }

            registerName(name);
            if (meta) {
                create(meta.properties);
            }
        }

        /** Converts camelCase into with-dashes */
        function insertDashes(camelCase) {
            var result = "", i, c, isCapital;

            for (var i = 0; i < camelCase.length; i++) {
                c = camelCase.charAt(i);
                isCapital = c.match(/[A-Z]/);
                if (isCapital) {
                    result += "-" + c.toLowerCase();
                } else {
                    result += c;
                }
            }

            return result;
        }

        var chartAxisProperties = {
            type: "object",
            properties: {
                visible: { type: "boolean" },
                textVisible: { type: "boolean" },
                textStyle: {},
                labels: {
                    type: "object",
                    properties: {
                        width: { type: "number" },
                        textAlign: { type: "string" }
                    }
                },
                autoMin: { type: "boolean" },
                autoMax: { type: "boolean" },
                autoMajor: { type: "boolean" },
                autoMinor: { type: "boolean" },
                unitMajor: { type: "boolean" },
                unitMinor: { type: "boolean" },
                gridMajor: {
                    type: "object",
                    properties: {
                        visible: { type: "boolean" },
                        style: {}
                    }
                },
                gridMinor: {
                    type: "object",
                    properties: {
                        visible: { type: "boolean" },
                        style: {}
                    }
                },
                tickMajor: {},
                tickMinor: {},
                annoMethod: { type: "string" },
                annoFormatString: { type: "string" },
                valueLabels: { type: "array", twoWayBinding: true }
            }
        };

        var widgetMetadata = {
            "base": {
                events: {
                    "create": {},
                    "change": {}
                }
            },
            "wijtooltip": {
                isDecorator: true,
                "events": {
                    "showing": {},
                    "shown": {},
                    "hiding": {},
                    "hidden": {}
                },
                "properties": {
                    "group": {},
                    "ajaxCallback": {}
                }
            },
            "wijslider": {
                "events": {
                    "buttonMouseOver": {},
                    "buttonMouseOut": {},
                    "buttonMouseDown": {},
                    "buttonMouseUp": {},
                    "buttonClick": {},
                    "slide": {},
                    "start": {},
                    "stop": {}
                },
                "properties": {
                    "value": { changeEvent: "change" },
                    "values": { changeEvent: "change" }
                }
            },
            "wijsplitter": {
                "events": {
                    "sized": {},
                    "load": {},
                    "sizing": {},
                    "expand": {},
                    "collapse": {},
                    "expanded": {},
                    "collapsed": {}
                },
                "properties": {
                    splitterDistance: {
                        type: "number",
                        changeEvent: "sized"
                    }
                }
            },
            "wijflipcard": {
                "events": {
                    "flipping": {},
                    "flipped": {}
                },
                "properties": {
                    "disabled": {},
                    "width": {},
                    "height": {},
                    "triggerEvent": {}
                }
            },
            "wijprogressbar": {
                "events": {
                    "progressChanging": {},
                    "beforeProgressChanging": {},
                    "progressChanged": {}
                },
                "properties": {
                    value: {
                        type: "number",
                        changeEvent: "change"
                    }
                }
            },
            "wijdialog": {
                "events": {
                    "blur": {},
                    "buttonCreating": {},
                    "resize": {},
                    "stateChanged": {},
                    "focus": {},
                    "resizeStart": {},
                    "resizeStop": {},
                    "open": {},
                    "close": {},
                    "beforeClose": {},
                    "drag": {},
                    "dragStart": {},
                    "dragStop": {}
                },
                "properties": {
                    "hide": {},
                    "show": {},
                    buttons: {
                        type: "object",
                        twoWayBinding: true
                    },
                    "collapsingAnimation": {},
                    "expandingAnimation": {},
                    "captionButtons": {
                        properties: {
                            pin: { properties: { visible: { type: "boolean" } } },
                            refresh: { properties: { visible: { type: "boolean" } } },
                            toggle: { properties: { visible: { type: "boolean" } } },
                            minimize: { properties: { visible: { type: "boolean" } } },
                            maximize: { properties: { visible: { type: "boolean" } } },
                            close: { properties: { visible: { type: "boolean" } } }
                        }
                    }
                }
            },
            "wijaccordion": {
                "events": {
                    "beforeSelectedIndexChanged": {},
                    "selectedIndexChanged": {}
                },
                "properties": {
                    "duration": {},
                    selectedIndex: {
                        type: "number",
                        changeEvent: "selectedindexchanged"
                    }
                }
            },
            "wijpopup": {
                "events": {
                    "showing": {},
                    "shown": {},
                    "hiding": {},
                    "hidden": {},
                    "posChanged": {}
                }
            },
            "wijsuperpanel": {
                "events": {
                    "dragStop": {},
                    "painted": {},
                    "scroll": {},
                    "scrolling": {},
                    "scrolled": {},
                    "resized": {}
                },
                "properties": {
                    "hScrollerActivating": {},
                    "vScrollerActivating": {}
                }
            },
            "wijcheckbox": {
                isDecorator: true,
                "properties": {
                    "checked": {
                        type: "boolean",
                        changeEvent: "changed"
                    }
                }
            },
            "wijradio": {
                isDecorator: true,
                "properties": {
                    "checked": {
                        type: "boolean",
                        changeEvent: "changed"
                    }
                }
            },
            "wijlist": {
                "events": {
                    "focusing": {},
                    "focus": {},
                    "blur": {},
                    "selected": {},
                    "listRendered": {},
                    "itemRendering": {},
                    "itemRendered": {}
                },
                "properties": {
                    "superPanelOptions": {},
                    dataSource: {
                        type: "array",
                        twoWayBinding: true
                    },
                    listItems: {
                        type: "object",
                        twoWayBinding: true
                    }
                }
            },
            "wijcalendar": {
                "events": {
                    "beforeSlide": {},
                    "beforeSelect": {},
                    "selectedDatesChanged": {},
                    "afterSelect": {},
                    "afterSlide": {}
                },
                "properties": {
                    "customizeDate": {},
                    "title": {},
                    selectedDates: {
                        type: "array",
                        singular: "date",
                        elementType: "date",
                        changeEvent: "selecteddateschanged"
                    }
                }
            },
            wijdropdown: {
                isDecorator: true
            },
            "wijexpander": {
                "events": {
                    "beforeCollapse": {},
                    "afterCollapse": {},
                    "beforeExpand": {},
                    "afterExpand": {}
                },
                properties: {
                    expanded: {
                        type: "boolean",
                        attachEvents: ["aftercollapse", "afterexpand"]
                    }
                }
            },
            "wijmenu": {
                "events": {
                    "focus": {},
                    "blur": {},
                    "select": {},
                    "showing": {},
                    "shown": {},
                    "hidding": {},
                    "hidden": {}
                },
                "properties": {
                    "superPanelOptions": {}
                }
            },
            "wijmenuitem": {
                "events": {
                    "hidding": {},
                    "hidden": {},
                    "showing": {},
                    "shown": {}
                }
            },
            "wijtabs": {
                "events": {
                    "add": {},
                    "remove": {},
                    "select": {},
                    "beforeShow": {},
                    "show": {},
                    "load": {},
                    "disable": {},
                    "enable": {}
                },
                "properties": {
                    "ajaxOptions": {},
                    "cookie": {},
                    "hideOption": {},
                    "showOption": {}
                }
            },
            wijtextbox: {
                isDecorator: true
            },
            "wijpager": {
                "events": {
                    "pageIndexChanging": {},
                    "pageIndexChanged": {}
                },
                properties: {
                    pageIndex: {
                        type: "numeric",
                        changeEvent: "pageindexchanged"
                    }
                }
            },
            "wijcombobox": {
                "events": {
                    "select": {},
                    "search": {},
                    "open": {},
                    "close": {},
                    "changed": {},
                    "textChanged": {},
                    "selectedIndexChanged": {},
                    "selectedIndexChanging": {}
                },
                "properties": {
                    dataSource: {
                        type: "array",
                        twoWayBinding: true
                    },
                    data: {
                        type: "object",
                        twoWayBinding: true
                    },
                    value: {
                        changeEvent: "change"
                    },
                    "labelText": {},
                    "showingAnimation": {},
                    "hidingAnimation": {},
                    selectedIndex: {
                        type: "numeric",
                        changeEvent: "changed"
                    },
                    selectedValue: {
                        changeEvent: "changed"
                    },
                    text: {
                        changeEvent: "changed"
                    },
                    inputTextInDropDownList: {
                        changeEvent: "changed"
                    },
                    "listOptions": {}
                }
            },
            "wijinputcore": {
                "events": {
                    "initializing": {},
                    "initialized": {},
                    "triggerMouseDown": {},
                    "triggerMouseUp": {},
                    "dropDownButtonMouseDown": {},
                    "dropDownButtonMouseUp": {},
                    "dropDownOpen": {},
                    "dropDownClose": {},
                    "textChanged": {},
                    "invalidInput": {}
                },
                "properties": {
                    pickers: {
                        "properties": {
                            list: {
                                type: "Array",
                                twoWayBinding: true
                            }
                        }
                    }
                }
            },
            "wijinputdate": {
                inherits: "wijinputcore",
                "events": {
                    "dateChanged": {}
                },
                "properties": {
                    date: {
                        type: "datetime",
                        changeEvent: ["dateChanged", "textChanged"]
                    },
                    "minDate": {},
                    "maxDate": {}
                }
            },
            "wijinputmask": {
                inherits: "wijinputcore",
                "properties": {
                    "text": {
                        type: "string",
                        changeEvent: "textChanged"
                    },
                    maskFormat: {
                        type: "object",
                        twoWayBinding: true
                    }
                }
            },
            "wijinputnumber": {
                inherits: "wijinputcore",
                "events": {
                    "valueChanged": {},
                    "valueBoundsExceeded": {}
                },
                "properties": {
                    value: {
                        type: "number",
                        changeEvent: ["valueChanged", "textChanged"]
                    }
                }
            },
            "wijinputtext": {
                inherits: "wijinputcore",
                "properties": {
                    "text": {
                        type: "string",
                        changeEvent: "textChanged"
                    }
                }
            },
            "wijgrid": {
                "properties": {
                    data: { changeEvent: "afterCellEdit" },
                    dataSource: { twoWayBinding: true },
                    cellStyleFormatter: {
                        twoWayBinding: true
                    },
                    rowStyleFormatter: {
                        twoWayBinding: true
                    },
                    "columns": {
                        type: "array",
                        singular: "column",
                        elementType: {
                            type: "object",
                            properties: {
                                allowSort: {
                                    type: "boolean"
                                },
                                visible: {
                                    type: "boolean"
                                },
                                dataFormatString: { type: "string" },
                                readOnly: { type: "boolean" },
                                "dataKey": { type: "string" },
                                "dataType": { type: "string" },
                                "headerText": { type: "string" },
                                "cellFormatter": { twoWayBinding: true },
                                groupInfo: {
                                    type: "object",
                                    properties: {
                                        headerText: {},
                                        footerText: {},
                                        outlineMode: {}
                                    }
                                },
                                "showFilter": {
                                    type: "boolean"
                                },
                                command: {
                                    type: "object",
                                    properties: {
                                        text: { type: "string" },
                                        click: { twoWayBinding: true },
                                        iconClass: { type: "string" }
                                    }
                                },
                                cancelCommand: {
                                    type: "object",
                                    properties: {
                                        text: { type: "string" },
                                        click: { twoWayBinding: true },
                                        iconClass: { type: "string" }
                                    }
                                },
                                deleteCommand: {
                                    type: "object",
                                    properties: {
                                        text: { type: "string" },
                                        click: { twoWayBinding: true },
                                        iconClass: { type: "string" }
                                    }
                                },
                                editCommand: {
                                    type: "object",
                                    properties: {
                                        text: { type: "string" },
                                        click: { twoWayBinding: true },
                                        iconClass: { type: "string" }
                                    }
                                },
                                updateCommand: {
                                    type: "object",
                                    properties: {
                                        text: { type: "string" },
                                        click: { twoWayBinding: true },
                                        iconClass: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                },
                "events": {
                    "ajaxError": {},
                    "dataLoading": {},
                    "dataLoaded": {},
                    "loading": {},
                    "loaded": {},
                    "columnDropping": {},
                    "columnDropped": {},
                    "columnGrouping": {},
                    "columnGrouped": {},
                    "columnUngrouping": {},
                    "columnUngrouped": {},
                    "filtering": {},
                    "filtered": {},
                    "sorting": {},
                    "sorted": {},
                    "currentCellChanged": {},
                    "pageIndexChanging": {},
                    "pageIndexChanged": {},
                    "rendering": {},
                    "rendered": {},
                    "columnResizing": {},
                    "columnResized": {},
                    "currentCellChanging": {},
                    "afterCellEdit": {},
                    "afterCellUpdate": {},
                    "beforeCellEdit": {},
                    "beforeCellUpdate": {},
                    "columnDragging": {},
                    "columnDragged": {},
                    "filterOperatorsListShowing": {},
                    "groupAggregate": {},
                    "groupText": {},
                    "invalidCellValue": {},
                    "selectionChanged": {},
                    "cellClicked": {}
                }
            },
            "wijgridfilter": {
                inherits: "wijgrid"
            },
            "wijchartcore": {
                "events": {
                    "beforeSeriesChange": {},
                    "afterSeriesChange": {},
                    "seriesChanged": {},
                    "beforePaint": {},
                    "painted": {},
                    "mouseDown": {},
                    "mouseUp": {},
                    "mouseOver": {},
                    "mouseOut": {},
                    "mouseMove": {},
                    "click": {}
                },
                "properties": {
                    axis: {
                        type: "object",
                        properties: {
                            x: chartAxisProperties,
                            y: chartAxisProperties
                        }
                    },
                    data: { twoWayBinding: true },
                    dataSource: { twoWayBinding: true },
                    "width": { type: "number" },
                    "height": { type: "number" },
                    seriesList: {
                        changeEvent: "serieschanged",
                        singular: "series",
                        type: "array",
                        elementType: {
                            type: "object",
                            properties: {
                                dataSource: {
                                    type: "array",
                                    twoWayBinding: true
                                },
                                data: {}
                            }
                        }
                    }
                }
            },
            "wijcompositechart": {
                inherits: "wijchartcore",
                "properties": {
                    yAxes: {
                        singular: "y",
                        type: "array",
                        elementType: chartAxisProperties
                    },
                    seriesList: {
                        changeEvent: "serieschanged",
                        singular: "series",
                        type: "array",
                        elementType: {
                            type: "object",
                            properties: {
                                dataSource: {
                                    type: "array",
                                    twoWayBinding: true
                                },
                                data: {},
                                radius: {
                                    type: "number"
                                },
                                yAxis: {
                                    type: "number"
                                }
                            }
                        }
                    }
                }
            },
            "wijbarchart": {
                inherits: "wijchartcore"
            },
            "wijlinechart": {
                inherits: "wijchartcore",
                "properties": {
                    "hole": {},
                    seriesList: {
                        changeEvent: "serieschanged",
                        singular: "series",
                        type: "array",
                        elementType: {
                            type: "object",
                            properties: {
                                dataSource: {
                                    type: "array",
                                    twoWayBinding: true
                                },
                                data: {},
                                markers: {
                                    type: "object",
                                    properties: {
                                        visible: { type: "boolean" },
                                        symbol: {
                                            type: "array",
                                            singular: "symbol",
                                            elementType: {
                                                type: "object",
                                                properties: {
                                                    width: { type: "number" },
                                                    height: { type: "number" },
                                                    url: { type: "string" },
                                                    index: { type: "number" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "wijscatterchart": {
                inherits: "wijchartcore"
            },
            "wijbubblechart": {
                inherits: "wijchartcore",
                properties: {
                    seriesList: {
                        changeEvent: "serieschanged",
                        singular: "series",
                        type: "array",
                        elementType: {
                            type: "object",
                            properties: {
                                dataSource: {
                                    type: "array",
                                    twoWayBinding: true
                                },
                                data: {},
                                markers: {
                                    type: "object",
                                    properties: {
                                        symbol: {
                                            type: "array",
                                            singular: "symbol",
                                            elementType: {
                                                type: "object",
                                                properties: {
                                                    url: { type: "string" },
                                                    index: { type: "number" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "wijpiechart": {
                inherits: "wijchartcore",
                "properties": {
                    "radius": { type: "number" }
                }
            },
            "wijcandlestickchart": {
                inherits: "wijchartcore"
            },
            "wijtree": {
                "events": {
                    "nodeBeforeDropped": {},
                    "nodeDropped": {},
                    "nodeBlur": {},
                    "nodeFocus": {},
                    "nodeClick": {},
                    "nodeCheckChanging": {},
                    "nodeCheckChanged": {},
                    "nodeCollapsed": {},
                    "nodeExpanded": {},
                    "nodeDragging": {},
                    "nodeDragStarted": {},
                    "nodeMouseOver": {},
                    "nodeMouseOut": {},
                    "nodeTextChanged": {},
                    "selectedNodeChanged": {},
                    "nodeExpanding": {},
                    "nodeCollapsing": {}
                },
                properties: {
                    nodes: {
                        type: "array",
                        singular: "node",
                        changeEvent: [
                            "nodeCheckChanged", "nodeCollapsed", "nodeExpanded",
                            "nodeTextChanged", "selectedNodeChanged"]
                    }
                }
            },
            "wijtreenode": {
                "events": {
                    "nodeTextChanged": {},
                    "nodeDragStarted": {},
                    "nodeDragging": {},
                    "nodeCheckChanging": {},
                    "nodeCheckChanged": {},
                    "nodeFocus": {},
                    "nodeBlur": {},
                    "nodeClick": {},
                    "selectedNodeChanged": {},
                    "nodeMouseOver": {},
                    "nodeMouseOut": {}
                }
            },
            "wijupload": {
                "events": {
                    "cancel": {},
                    "totalComplete": {},
                    "progress": {},
                    "complete": {},
                    "totalProgress": {},
                    "upload": {},
                    "totalUpload": {}
                }
            },
            "wijwizard": {
                "events": {
                    "show": {},
                    "add": {},
                    "remove": {},
                    "activeIndexChanged": {},
                    "validating": {},
                    "load": {}
                },
                "properties": {
                    "ajaxOptions": {},
                    "cookie": {}
                }
            },
            "wijribbon": {
                "events": {
                    "click": {}
                }
            },
            "wijeditor": {
                "events": {
                    "commandButtonClick": {},
                    "textChanged": {}
                },
                "properties": {
                    "simpleModeCommands": {
                        type: "array",
                        twoWayBinding: true
                    },
                    "localization": {},
                    text: {
                        type: "string",
                        twoWayBinding: true,
                        changeEvent: "textChanged"
                    }
                }
            },
            "wijrating": {
                "events": {
                    "hover": {},
                    "rating": {},
                    "rated": {},
                    "reset": {}
                },
                "properties": {
                    "min": {},
                    "max": {},
                    "animation": {},
                    value: {
                        type: "number",
                        changeEvent: ["rated", "reset"]
                    },
                    hint: {
                        properties: {
                            disabled: { type: "boolean" },
                            content: {
                                type: "array",
                                twoWayBinding: true
                            }
                        }
                    }
                }
            },
            "wijcarousel": {
                "events": {
                    "loadCallback": {},
                    "itemClick": {},
                    "beforeScroll": {},
                    "afterScroll": {},
                    "create": {}
                }
            },
            "wijgallery": {
                "events": {
                    "loadCallback": {},
                    "beforeTransition": {},
                    "afterTransition": {},
                    "create": {}
                }
            },
            "wijgauge": {
                "properties": {
                    "ranges": {
                        type: "array",
                        singular: "range",
                        elementType: {
                            type: "object",
                            properties: {
                                "startValue": { type: "number" },
                                "endValue": { type: "number" },
                                "startDistance": { type: "number" },
                                "endDistance": { type: "number" },
                                "startWidth": { type: "number" },
                                "endWidth": { type: "number" }
                            }
                        }
                    },
                    value: {
                        type: "number",
                        twoWayBinding: true,
                        changeEvent: "valueChanged"
                    },
                    face: {
                        properties: {
                            template: { twoWayBinding: true }
                        }
                    }
                },
                "events": {
                    "beforeValueChanged": {},
                    "valueChanged": {},
                    "painted": {},
                    "click": {},
                    "create": {}
                }
            },
            "wijlineargauge": {
                inherits: "wijgauge"
            },
            "wijradialgauge": {
                inherits: "wijgauge"
            },
            "wijlightbox": {
                "events": {
                    "show": {},
                    "beforeShow": {},
                    "beforeClose": {},
                    "close": {},
                    "open": {}
                },
                "properties": {
                    "cookie": {}
                }
            },
            "wijdatepager": {
                "events": {
                    "selectedDateChanged": {}
                },
                "properties": {
                    "localization": {},
                    "selectedDate": {
                        type: "datetime",
                        changeEvent: "selectedDateChanged"
                    }
                }
            },
            "wijevcal": {
                "events": {
                    "viewTypeChanged": {},
                    "selectedDatesChanged": {},
                    "initialized": {},
                    "beforeDeleteCalendar": {},
                    "beforeAddCalendar": {},
                    "beforeUpdateCalendar": {},
                    "beforeAddEvent": {},
                    "beforeUpdateEvent": {},
                    "beforeDeleteEvent": {},
                    "beforeEditEventDialogShow": {},
                    "eventsDataChanged": {},
                    "calendarsChanged": {}
                },
                "properties": {
                    "localization": { twoWayBinding: true },
                    "datePagerLocalization": {},
                    "colors": {},
                    "selectedDate": {
                        type: "date",
                        changeEvent: "selectedDatesChanged"
                    },
                    "selectedDates": {
                        type: "date",
                        changeEvent: "selectedDatesChanged"
                    },
                    eventsData: {
                        type: "array",
                        changeEvent: "eventsdatachanged"
                    },
                    appointments: {
                        type: "array",
                        singular: "appointment",
                        changeEvent: "eventsdatachanged"
                    }
                }
            },
            "wijvideo": {
                isDecorator: true,
                "properties": {
                    "fullScreenButtonVisible": {
                        type: "boolean"
                    },
                    "showControlsOnHover": {
                        type: "boolean"
                    }
                }
            },
            "wijspread": {
                properties: {
                    dataSource: {
                        type: "array",
                        twoWayBinding: true
                    },
                    sheetCount: {
                        type: "number"
                    },
                    isProtected: {
                        type: "boolean"
                    },
                    sheets: {
                        type: "array",
                        singular: "sheet",
                        elementType: {
                            type: "object",
                            properties: {
                                data: {
                                    type: "array",
                                    twoWayBinding: true
                                },
                                isProtected: {
                                    type: "boolean"
                                },
                                rowCount: {
                                    type: "number"
                                },
                                colCount: {
                                    type: "number"
                                },
                                defaultRowCount: {
                                    type: "number"
                                },
                                defaultColCount: {
                                    type: "number"
                                },
                                autoGenerateColumns: {
                                    type: "boolean"
                                },
                                columns: {
                                    type: "array",
                                    singular: "column",
                                    elementType: {
                                        type: "object",
                                        properties: {
                                            displayName: {
                                                type: "string"
                                            },
                                            name: {
                                                type: "string"
                                            },
                                            width: {
                                                type: "number"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "wijsparkline": {
                "events": {
                    "mouseMove": {},
                    "click": {}
                },
                "properties": {
                    "disabled": {},
                    "type": {},
                    "width": {},
                    "height": {},
                    "valueAxis": {},
                    "origin": {},
                    "min": {},
                    "max": {},
                    "columnWidth": {},
                    "tooltipFormat": {},
                    "bind": {},
                    "data": {
                        type: "array",
                        twoWayBinding: true
                    },
                    "seriesList": {
                        type: "array",
                        singular: "series",
                        elementType: {
                            type: "object",
                            properties: {
                                type: {
                                    type: "string"
                                },
                                bind: {
                                    type: "string"
                                },
                                data: {
                                    type: "array"
                                },
                                seriesStyle: {
                                    type: "object"
                                }
                            }
                        }
                    },
                    "seriesStyles": {
                        type: "array",
                        singular: "seriesStyle",
                        elementType: {
                            type: "object"
                        }
                    }
                }
            },
            "wijtreemap": {
                "properties": {
                    "disabled": {
                        type: "boolean"
                    },
                    "type": {},
                    "width": {
                        type: "number"
                    },
                    "height": {
                        type: "number"
                    },
                    "data": {
                        type: "array",
                        twoWayBinding: true
                    },
                    "valueBinding": {},
                    "labelBinding": {},
                    "colorBinding": {},
                    "showLabel": {
                        type: "boolean"
                    },
                    "labelFormatter": {
                        type: "function",
                        twoWayBinding: true
                    },
                    "showTooltip": {
                        type: "boolean"
                    },
                    "tooltipOptions": {},
                    "showTitle": {
                        type: "boolean"
                    },
                    "titleHeight": {
                        type: "number"
                    },
                    "titleFormatter": {
                        type: "function",
                        twoWayBinding: true
                    },
                    "minColor": {},
                    "minColorValue": {
                        type: "number"
                    },
                    "midColor": {},
                    "midColorValue": {
                        type: "number"
                    },
                    "maxColor": {},
                    "maxColorValue": {
                        type: "number"
                    },
                    "showBackButtons": {
                        type: "boolean"
                    }
                },
                "events": {
                    "itemPainting": {},
                    "itemPainted": {},
                    "painting": {},
                    "painted": {},
                    "drillingDown": {},
                    "drilledDown": {},
                    "rollingUp": {},
                    "rolledUp": {}
                }
            },
            wijfileexplorer: {
                properties: {
                    mode: {},
                    searchPatterns: {},
                    initPath: {},
                    viewPaths: {
                        type: "array",
                        twoWayBinding: true
                    },
                    viewMode: {},
                    allowFileExtensionRename: {
                        type: "boolean"
                    },
                    allowMultipleSelection: {
                        type: "boolean"
                    },
                    allowPaging: {
                        type: "boolean"
                    },
                    pageSize: {
                        type: "number"
                    },
                    shortcuts: {
                        type: "object"
                    },
                    enableOpenFile: {
                        type: "boolean"
                    },
                    enableCreateNewFolder: {
                        type: "boolean"
                    },
                    enableCopy: {
                        type: "boolean"
                    },
                    enableFilteringOnEnterPressed: {
                        type: "boolean"
                    },
                    currentFolder: {
                        changeEvent: "folderChanged"
                    },
                    visibleControls: {},
                    treePanelWidth: {
                        type: "number"
                    },
                    hostUri: {},
                    actionUri: {},
                    disabled: {
                        type: "boolean"
                    }
                },
                events: {
                    itemSelected: {},
                    fileOpened: {},
                    fileOpening: {},
                    itemCopying: {},
                    itemCopied: {},
                    itemRenaming: {},
                    itemRenamed: {},
                    itemDeleting: {},
                    itemDeleted: {},
                    errorOccurred: {},
                    itemPasting: {},
                    itemPasted: {},
                    itemMoving: {},
                    itemMoved: {},
                    newFolderCreating: {},
                    newFolderCreated: {},
                    folderChanged: {},
                    folderLoaded: {},
                    filtering: {},
                    filtered: {}
                }
            },
            wijmaps: {
                properties: {
                    source: {
                        twoWayBinding: true
                    },
                    center: {
                        changeEvent: "centerChanged"
                    },
                    zoom: {
                        type: 'number',
                        changeEvent: "zoomChanged"
                    },
                    showTools: {
                        type: "boolean"
                    },
                    targetZoom: {
                        type: 'number',
                        changeEvent: "targetZoomChanged"
                    },
                    targetZoomSpeed: {
                        type: 'number'
                    },
                    targetCenter: {
                        changeEvent: "targetCenterChanged"
                    },
                    targetCenterSpeed: {
                        type: 'number'
                    },
                    layers: {
                        type: 'array',
                        twoWayBinding: true
                    },
                    disabled: {
                        type: "boolean"
                    }
                },
                events: {
                    zoomChanged: {},
                    targetZoomChanged: {},
                    centerChanged: {},
                    targetCenterChanged: {}
                }
            }
        };

        // register directives for all widgets
        $.each($.wijmo, function (name, clazz) {
            if (!name.match(/^wij/))
                return;
            var directiveName = "wij" + name.charAt(3).toUpperCase() + name.substring(4);
            registerDirective(name, "wijmo", clazz, directiveName);
        });
        $.each($.ui, function (name, clazz) {
            return registerDirective(name, "ui", clazz, "jqui" + name.charAt(0).toUpperCase() + name.substring(1));
        });

        function hasChildElements(node) {
            if (!node || !node.childNodes)
                return false;
            var len = node.childNodes.length;
            for (var i = 0; i < len; i++) {
                var child = node.childNodes[i];
                if (child.nodeType == 1 /* ELEMENT_NODE */) {
                    return true;
                }
            }

            return false;
        }
    })(wijmo.ng || (wijmo.ng = {}));
    var ng = wijmo.ng;
})(wijmo || (wijmo = {}));
