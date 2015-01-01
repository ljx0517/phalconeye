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
/// <reference path="../wijsplitter/jquery.wijmo.wijsplitter.ts" />
/// <reference path="../wijdialog/jquery.wijmo.wijdialog.ts" />
/// <reference path="../external/declarations/globalize.d.ts" />
/// <reference path="../wijribbon/jquery.wijmo.wijribbon.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /*globals jQuery,window,document*/
    /*
    * Depends:
    *     jquery.ui.core.js
    *     jquery.ui.widget.js
    *     jquery.wijmo.wijtooltip.js
    */
    (function (editor) {
        "use strict";
        var $ = jQuery, widgetName = "wijeditor";

        var wijAlert = alert, wijWindow = window, wijDoc = document, wijParseInt = parseInt, wijribbonDataRender = wijmo.ribbon.wijribbonDataRender, oriWidth, oriHeight, $oriParent, uniqueIds = [], isFontSizeCustomized = null, wordwrap = true, undoSteps = 0, undoBuffers = [], inspectElement = null, setButtonDisabled = "setButtonDisabled", setButtonsDisabled = "setButtonsDisabled", setButtonChecked = "setButtonChecked", setButtonsChecked = "setButtonsChecked", cmd_form = "form", cmd_imagebutton = "imagebutton", cmd_textarea = "textarea", cmd_button = "button", cmd_textbox = "textbox", cmd_listbox = "list", cmd_password = "passwordfield", cmd_dropdownlist = "dropdownlist", cmd_hiddenfield = "hiddenfield", cmd_radio = "radio", cmd_checkbox = "checkbox", cmd_insertcolumn = "insertcol", cmd_insertrow = "insertrow", cmd_insertcell = "insertcell", cmd_splitcell = "splitcell", cmd_mergecell = "mergecell", cmd_removecolumn = "deletecol", cmd_removerow = "deleterow", cmd_removecell = "deletecell", cmd_alignleft = "justifyleft", cmd_aligncenter = "justifycenter", cmd_alignright = "justifyright", cmd_alignfull = "justifyfull", cmd_borders = "borders", cmd_numberedlist = "insertorderedlist", cmd_bulletedlist = "insertunorderedlist", cmd_outdent = "outdent", cmd_indent = "indent", cmd_backcolor = "backcolor", cmd_fontcolor = "fontcolor", cmd_bold = "bold", cmd_italic = "italic", cmd_strike = "strikethrough", cmd_underline = "underline", cmd_subscript = "subscript", cmd_superscript = "superscript", cmd_template = "template", cmd_removeformat = "removeformat", cmd_insertbreak = "insertbreak", cmd_insertparagraph = "insertparagraph", cmd_insertprintbreak = "insertprintpagebreak", cmd_inserthr = "inserthorizontalrule", cmd_table = "tablebutton", cmd_inserttable = "inserttable", cmd_edittable = "edittable", cmd_designview = "wysiwyg", cmd_splitview = "split", cmd_sourceview = "code", cmd_wordwrap = "wordwrap", cmd_fullscreen = "fullscreen", cmd_undo = "undo", cmd_redo = "redo", cmd_preview = "preview", cmd_cleanup = "cleanup", cmd_cut = "cut", cmd_copy = "copy", cmd_paste = "paste", cmd_selectall = "selectall", cmd_media = "media", cmd_specialchar = "specialchar", cmd_date = "datetime", cmd_find = "find", cmd_inspect = "inspect", cmd_save = "save", cmd_spelling = "spelling", cmd_imagebrowser = "imagebrowser", cmd_link = "link", cmd_verysmall = "xx-small", cmd_smaller = "x-small", cmd_small = "small", cmd_medium = "medium", cmd_large = "large", cmd_larger = "x-large", cmd_verylarge = "xx-large", cmd_fontname = "fontname", cmd_fontsize = "fontsize", cmd_blockquote = "blockquote", cmd_insertcode = "insertcode", css_ribbon = "wijmo-wijribbon", css_ribbon_bigbutton = css_ribbon + "-bigbutton", css_ribbon_dropdownbutton = css_ribbon + "-dropdownbutton", css_ribbon_splitbutton = css_ribbon + "-splitbutton", css_ribbon_list = css_ribbon + "-list", css_ribbon_save = css_ribbon + "-save", css_ribbon_save16 = css_ribbon + "-save16", css_ribbon_undo = css_ribbon + "-undo", css_ribbon_redo = css_ribbon + "-redo", css_ribbon_preview = css_ribbon + "-preview", css_ribbon_cleanup = css_ribbon + "-cleanup", css_ribbon_cut = css_ribbon + "-cut", css_ribbon_copy = css_ribbon + "-copy", css_ribbon_paste = css_ribbon + "-paste", css_ribbon_selectall = css_ribbon + "-selectall", css_ribbon_bgcolor = css_ribbon + "-bgcolor", css_ribbon_color = css_ribbon + "-color", css_ribbon_bold = css_ribbon + "-bold", css_ribbon_italic = css_ribbon + "-italic", css_ribbon_underline = css_ribbon + "-underline", css_ribbon_strike = css_ribbon + "-strike", css_ribbon_sub = css_ribbon + "-sub", css_ribbon_sup = css_ribbon + "-sup", css_ribbon_template = css_ribbon + "-template", css_ribbon_removeformat = css_ribbon + "-removeformat", css_ribbon_justifyleft = css_ribbon + "-justifyleft", css_ribbon_justifycenter = css_ribbon + "-justifycenter", css_ribbon_justifyright = css_ribbon + "-justifyright", css_ribbon_justifyfull = css_ribbon + "-justifyfull", css_ribbon_borders = css_ribbon + "-borders", css_ribbon_orderlist = css_ribbon + "-orderlist", css_ribbon_unorderlist = css_ribbon + "-unorderlist", css_ribbon_outdent = css_ribbon + "-outdent", css_ribbon_indent = css_ribbon + "-indent", css_ribbon_inspect = css_ribbon + "-inspect", css_ribbon_find = css_ribbon + "-find", css_ribbon_table = css_ribbon + "-table", css_ribbon_inserttable = css_ribbon + "-inserttable", css_ribbon_edittable = css_ribbon + "-edittable", css_ribbon_insertcol = css_ribbon + "-insertcol", css_ribbon_insertrow = css_ribbon + "-insertrow", css_ribbon_insertcell = css_ribbon + "-insertcell", css_ribbon_splitcell = css_ribbon + "-splitcell", css_ribbon_mergecell = css_ribbon + "-mergecell", css_ribbon_deletecol = css_ribbon + "-deletecol", css_ribbon_deleterow = css_ribbon + "-deleterow", css_ribbon_deletecell = css_ribbon + "-deletecell", css_ribbon_insertbreak = css_ribbon + "-insertbreak", css_ribbon_insertparagraph = css_ribbon + "-insertparagraph", css_ribbon_insertprintpagebreak = css_ribbon + "-insertprintpagebreak", css_ribbon_inserthr = css_ribbon + "-inserthr", css_ribbon_form = css_ribbon + "-form", css_ribbon_textarea = css_ribbon + "-textarea", css_ribbon_textbox = css_ribbon + "-textbox", css_ribbon_password = css_ribbon + "-password", css_ribbon_hiddenfield = css_ribbon + "-hiddenfield", css_ribbon_imagebutton = css_ribbon + "-imagebutton", css_ribbon_button = css_ribbon + "-button", css_ribbon_listbox = css_ribbon + "-listbox", css_ribbon_dropdownlist = css_ribbon + "-dropdownlist", css_ribbon_radio = css_ribbon + "-radio", css_ribbon_checkbox = css_ribbon + "-checkbox", css_ribbon_link = css_ribbon + "-link", css_ribbon_link16 = css_ribbon + "-link16", css_ribbon_imagebrowser = css_ribbon + "-imagebrowser", css_ribbon_media = css_ribbon + "-media", css_ribbon_specialchar = css_ribbon + "-specialchar", css_ribbon_datetime = css_ribbon + "-datetime", css_ribbon_blockquote = css_ribbon + "-blockquote", css_ribbon_insertcode = css_ribbon + "-insertcode", css_ribbon_modes = css_ribbon + "-modes", css_ribbon_designview = css_ribbon + "-designview", css_ribbon_sourceview = css_ribbon + "-sourceview", css_ribbon_splitview = css_ribbon + "-splitview", css_ribbon_wordwrap = css_ribbon + "-wordwrap", css_ribbon_fullscreen = css_ribbon + "-fullscreen", css_editor = "wijmo-wijeditor", css_editor_container = css_editor + "-container", css_editor_header = css_editor + "-header", css_editor_content = css_editor + "-content", css_editor_footer = css_editor + "-footer", css_editor_pathselector = css_editor + "-pathselector", css_editor_fullscreen = css_editor + "-fullscreen", css_dlg = css_editor + "-dialog", css_dlg_hr = css_dlg + "-hr", css_dlg_buttons = css_dlg + "-buttons", css_dlg_button = css_dlg + "-button", css_dlg_text = css_dlg + "-text", css_imgdlg = css_editor + "-imagedlg", css_imgdlg_content = css_imgdlg + "-content", css_imgdlg_fields = css_imgdlg + "-fields", css_imgdlg_field = css_imgdlg + "-imagefield", css_imgdlg_list = css_imgdlg + "-imagelist", css_imgdlg_preview = css_imgdlg + "-preview", css_imgdlg_url = css_imgdlg + "-imagesrc", css_imgdlg_alt = css_imgdlg + "-imagealt", css_imgdlg_width = css_imgdlg + "-imagewidth", css_imgdlg_height = css_imgdlg + "-imageheight", css_imgdlg_css = css_imgdlg + "-css", css_imgdlg_hideimglist = css_imgdlg + "-hideimagelist", css_tpldlg = css_editor + "-templatedlg", css_tpl_labels = css_tpldlg + "-toplabels", css_tpl_tllabel = css_tpldlg + "-topleftlabel", css_tpl_trlabel = css_tpldlg + "-toprightlabel", css_tpl_content = css_tpldlg + "-content", css_tpl_list = css_tpldlg + "-templatelist", css_tpl_preview = css_tpldlg + "-preview", css_tpl_tplinfo = css_tpldlg + "-templateinfo", css_tpl_nameinfo = css_tpldlg + "-nameinfo", css_tpl_desinfo = css_tpldlg + "-descriptioninfo", css_tpl_fields = css_tpldlg + "-fields", css_tpl_namefield = css_tpldlg + "-name", css_tpl_desfield = css_tpldlg + "-description", css_tpl_buttons = css_tpldlg + "-buttons", css_tpl_delete = css_tpldlg + "-delete", css_tpl_save = css_tpldlg + "-save", css_linkdlg = css_editor + "-linkdlg", css_linkdlg_address = css_linkdlg + "-address", css_linkdlg_linktype = css_linkdlg + "-linktype", css_linkdlg_anchor = css_linkdlg + "-anchor", css_linkdlg_text = css_linkdlg + "-text", css_linkdlg_target = css_linkdlg + "-target", css_linkdlg_css = css_linkdlg + "-css", css_linkdlg_url = css_linkdlg + "-src", css_linkdlg_width = css_linkdlg + "-width", css_linkdlg_height = css_linkdlg + "-height", css_linkdlg_imagecontainer = css_linkdlg + "-imagecontainer", css_linkdlg_linkicontype = css_linkdlg + "-linkicontype", css_codedlg = css_editor + "-codedlg", css_codedlg_source = css_codedlg + "-source", css_codedlg_sourcelabel = css_codedlg + "-sourcelabel", css_taginsdlg = css_editor + "-taginsdlg", css_taginsdlg_caption = css_taginsdlg + "-caption", css_taginsdlg_taglabel = css_taginsdlg + "-taglabel", css_taginsdlg_tagtext = css_taginsdlg + "-tagtext", css_taginsdlg_filterempty = css_taginsdlg + "-filterempty", css_taginsdlg_attribs = css_taginsdlg + "-attribs", css_taginsdlg_attriblist = css_taginsdlg + "-attriblist", css_taginsdlg_innerhtml = css_taginsdlg + "-innerhtml", css_taginsdlg_css = css_taginsdlg + "-css", css_colordlg = css_editor + "-colordlg", css_colordlg_picker = css_colordlg + "-picker", css_colordlg_color = css_colordlg + "-color", css_tabledlg = css_editor + "-tabledlg", css_tabledlg_rows = css_tabledlg + "-rows", css_tabledlg_columns = css_tabledlg + "-columns", css_tabledlg_width = css_tabledlg + "-width", css_tabledlg_height = css_tabledlg + "-height", css_tabledlg_border = css_tabledlg + "-border", css_tabledlg_cellpadding = css_tabledlg + "-cellpadding", css_tabledlg_cellspacing = css_tabledlg + "-cellspacing", css_tabledlg_csstext = css_tabledlg + "-csstext", css_tabledlg_bgcolor = css_tabledlg + "-bgcolor", css_previewdlg = css_editor + "-previewdlg", css_previewdlg_caption = css_previewdlg + "-caption", css_previewdlg_navigator = css_previewdlg + "-navigator", css_previewdlg_prev = css_previewdlg + "-prev", css_previewdlg_next = css_previewdlg + "-next", css_previewdlg_printall = css_previewdlg + "-printall", css_previewdlg_printone = css_previewdlg + "-printone", css_previewdlg_ok = css_previewdlg + "-ok", css_previewdlg_printdocument = css_previewdlg + "-printdocument", css_previewdlg_previewiframe = css_previewdlg + "-previewiframe", css_cleanupdlg = css_editor + "-cleanupdlg", css_cleanupdlg_caption = css_cleanupdlg + "-caption", css_cleanupdlg_document = css_cleanupdlg + "-document", css_cleanupdlg_actions = css_cleanupdlg + "-actions", css_finddlg = css_editor + "-finddlg", css_finddlg_find = css_finddlg + "-find", css_finddlg_replace = css_finddlg + "-replace", css_mediadlg = css_editor + "-mediadlg", css_mediadlg_type = css_mediadlg + "-type", css_mediadlg_url = css_mediadlg + "-src", css_mediadlg_width = css_mediadlg + "-width", css_mediadlg_height = css_mediadlg + "-height", css_specialchardlg = css_editor + "-specialchardlg", css_specialchardlg_chars = css_specialchardlg + "-chars", css_specialchardlg_preview = css_specialchardlg + "-preview", css_specialchardlg_content = css_specialchardlg + "-content", css_specialchardlg_list = css_specialchardlg + "-list", css_specialchardlg_label = css_specialchardlg + "_label", css_specialchardlg_punctuation = css_specialchardlg + "-punctuation", css_specialchardlg_symbols = css_specialchardlg + "-symbols", css_specialchardlg_diacritics = css_specialchardlg + "-diacritics", css_formatspan = "wijmo-formatspan", selector_dlg_ok = "." + css_dlg_buttons + " input:first", selector_dlg_cancel = "." + css_dlg_buttons + " input:last", selector_input_ok = "." + css_dlg_buttons + " input[value='OK']", selector_input_cancel = "." + css_dlg_buttons + " input[engValue='Cancel']", imageTypeButton = [
            "Bold", "Italic", "UnderLine",
            "StrikeThrough", "SubScript", "SuperScript",
            "JustifyLeft", "JustifyCenter", "JustifyRight",
            "JustifyFull", "Border", "NumberedList",
            "BulletedList", "Outdent", "Indent"], defaultSimpleModeCommands = [
            "Bold", "Italic", "Link", "BlockQuote",
            "StrikeThrough", "InsertDate", "InsertImage",
            "NumberedList", "BulletedList", "InsertCode"], defaultBBCodeModeCommands = [
            "Bold", "Italic", "StrikeThrough",
            "UnderLine", "ForeColor", "FontSize",
            "Link", "InsertImage", "NumberedList",
            "BulletedList", "BlockQuote"], buttonInfoAsCommand = {
            Form: { name: "form", tip: 'Form', css: css_ribbon_form },
            Image: { name: "imagebutton", tip: 'Image Button', css: css_ribbon_imagebutton },
            TextArea: { name: "textarea", tip: 'TextArea', css: css_ribbon_textarea },
            Button: { name: "button", tip: 'Button', css: css_ribbon_button },
            TextBox: { name: "textbox", tip: 'TextBox', css: css_ribbon_textbox },
            List: { name: "list", tip: 'ListBox', css: css_ribbon_listbox },
            PasswordField: {
                name: "passwordfield", tip: 'Password Field',
                css: css_ribbon_password
            },
            DropDownList: {
                name: "dropdownlist", tip: 'DropDownList',
                css: css_ribbon_dropdownlist
            },
            HiddenField: {
                name: "hiddenfield", tip: 'Hidden Field',
                css: css_ribbon_hiddenfield
            },
            Radio: { name: "radio", tip: 'RadioButton', css: css_ribbon_radio },
            CheckBox: {
                name: "checkbox", tip: 'CheckBox',
                css: css_ribbon_checkbox
            },
            InsertColumn: {
                name: "insertcol", tip: 'Insert Column',
                css: css_ribbon_insertcol
            },
            InsertRow: {
                name: "insertrow", tip: 'Insert Row',
                css: css_ribbon_insertrow
            },
            InsertCell: {
                name: "insertcell", tip: 'Insert Cell',
                css: css_ribbon_insertcell
            },
            SplitCell: {
                name: "splitcell", tip: 'Split Cell',
                css: css_ribbon_splitcell
            },
            MergeCell: {
                name: "mergecell", tip: 'Merge Cell',
                css: css_ribbon_mergecell
            },
            DeleteColumn: {
                name: "deletecol", tip: 'Delete Column',
                css: css_ribbon_deletecol
            },
            DeleteRow: {
                name: "deleterow", tip: 'Delete Row',
                css: css_ribbon_deleterow
            },
            DeleteCell: {
                name: "deletecell", tip: 'Delete Cell',
                css: css_ribbon_deletecell
            },
            JustifyLeft: {
                name: "justifyleft", tip: 'Justify Left',
                css: css_ribbon_justifyleft, grpname: 'alignment'
            },
            JustifyCenter: {
                name: "justifycenter", tip: 'Justify Center',
                css: css_ribbon_justifycenter, grpname: 'alignment'
            },
            JustifyRight: {
                name: "justifyright", tip: 'Justify Right',
                css: css_ribbon_justifyright, grpname: 'alignment'
            },
            JustifyFull: {
                name: "justifyfull", tip: 'Justify Full',
                css: css_ribbon_justifyfull, grpname: 'alignment'
            },
            Border: { name: "borders", tip: 'Border', css: css_ribbon_borders },
            NumberedList: {
                name: "insertorderedlist", tip: 'Numbered List',
                css: css_ribbon_orderlist, grpname: 'list'
            },
            BulletedList: {
                name: "insertunorderedlist", tip: 'Bulleted List',
                css: css_ribbon_unorderlist, grpname: 'list'
            },
            Outdent: {
                name: "outdent", tip: 'Outdent',
                css: css_ribbon_outdent, grpname: 'block'
            },
            Indent: {
                name: "indent", tip: 'Indent',
                css: css_ribbon_indent, grpname: 'block'
            },
            BackColor: {
                name: "backcolor", tip: 'Background Color',
                css: css_ribbon_bgcolor
            },
            ForeColor: {
                name: "fontcolor", tip: 'Font Color',
                css: css_ribbon_color
            },
            Bold: {
                name: "bold", tip: 'Bold',
                css: css_ribbon_bold
            },
            Italic: { name: "italic", tip: 'Italic', css: css_ribbon_italic },
            StrikeThrough: {
                name: "strikethrough", tip: 'Strikethrough',
                css: css_ribbon_strike
            },
            UnderLine: {
                name: "underline", tip: 'Underline',
                css: css_ribbon_underline
            },
            SubScript: {
                name: "subscript", tip: 'Subscript',
                css: css_ribbon_sub
            },
            SuperScript: {
                name: "superscript", tip: 'Superscript',
                css: css_ribbon_sup
            },
            Template: {
                name: "template", tip: 'Template',
                css: css_ribbon_template
            },
            RemoveFormat: {
                name: "removeformat", tip: 'RemoveFormat',
                css: css_ribbon_removeformat
            },
            InsertBreak: {
                name: "insertbreak", tip: 'Insert Break',
                css: css_ribbon_insertbreak
            },
            InsertParagraph: {
                name: "insertparagraph", tip: 'Insert Paragraph',
                css: css_ribbon_insertparagraph
            },
            InsertPrint: {
                name: "insertprintpagebreak", tip: 'Insert Print Page Break',
                css: css_ribbon_insertprintpagebreak
            },
            InsertHR: {
                name: "inserthorizontalrule", tip: 'Insert Horizontal Line',
                css: css_ribbon_inserthr
            },
            Table: {
                name: "tablebutton", tip: 'Table',
                css: css_ribbon_table
            },
            InsertTable: {
                name: "inserttable", tip: 'Insert Table',
                css: css_ribbon_inserttable
            },
            EditTable: {
                name: "edittable", tip: 'Edit Table',
                css: css_ribbon_edittable
            },
            Wysiwyg: {
                name: "wysiwyg", tip: 'Design View',
                css: css_ribbon_designview, grpname: 'modes'
            },
            Split: {
                name: "split", tip: 'Split View',
                css: css_ribbon_splitview, grpname: 'modes'
            },
            Code: {
                name: "code", tip: 'Source View',
                css: css_ribbon_sourceview, grpname: 'modes'
            },
            Wordwrap: {
                name: "wordwrap", tip: 'Wordwrap',
                css: css_ribbon_wordwrap
            },
            FullScreen: {
                name: "fullscreen", tip: 'Fullscreen',
                css: css_ribbon_fullscreen
            },
            Undo: { name: "undo", tip: 'Undo', css: css_ribbon_undo },
            Redo: { name: "redo", tip: 'Redo', css: css_ribbon_redo },
            Preview: { name: "preview", tip: 'Preview', css: css_ribbon_preview },
            Cleanup: { name: "cleanup", tip: 'Clean up', css: css_ribbon_cleanup },
            Cut: { name: "cut", tip: 'Cut', css: css_ribbon_cut },
            Copy: { name: "copy", tip: 'Copy', css: css_ribbon_copy },
            Paste: { name: "paste", tip: 'Paste', css: css_ribbon_paste },
            SelectAll: {
                name: "selectall", tip: 'Select All',
                css: css_ribbon_selectall
            },
            Media: { name: "media", tip: 'Media', css: css_ribbon_media },
            InsertSpecialChar: {
                name: "specialchar", tip: 'Insert Special Character',
                css: css_ribbon_specialchar
            },
            InsertDate: {
                name: "datetime", tip: 'Insert Date Time',
                css: css_ribbon_datetime
            },
            Find: {
                name: "find", tip: 'Find And Replace',
                css: css_ribbon_find, text: 'Find'
            },
            Inspect: {
                name: "inspect", tip: 'Tag Inspect',
                css: css_ribbon_inspect, text: 'Inspect'
            },
            Save: { name: "save", tip: 'Save', css: css_ribbon_save, text: 'Save' },
            Spelling: { name: "spelling", tip: 'Form', css: '' },
            InsertImage: {
                name: "imagebrowser", tip: 'Image Browser',
                css: css_ribbon_imagebrowser
            },
            Link: { name: "link", tip: 'Link', css: css_ribbon_link, text: 'Link' },
            FontName: {
                name: "fontname", tip: 'Font Name', text: "Font Name",
                css: css_ribbon_dropdownbutton
            },
            FontSize: {
                name: "fontsize", tip: 'Font Size', text: "Font Size",
                css: css_ribbon_dropdownbutton
            },
            BlockQuote: {
                name: "blockquote", tip: 'Block Quote',
                css: css_ribbon_blockquote
            },
            InsertCode: {
                name: "insertcode", tip: 'Insert Code',
                css: css_ribbon_insertcode
            }
        }, formatGroupInfo = {
            "Actions": [
                "Save", "", "Undo", "Redo", "", "Preview",
                "Cleanup", "", "Cut", "Copy", "Paste", "SelectAll"],
            "Font": [
                "FontName", "FontSize", "", "BackColor", "ForeColor", "", "Bold",
                "Italic", "UnderLine", "StrikeThrough", "SubScript", "SuperScript", "",
                "Template", "", "RemoveFormat"],
            "Paragraph": [
                "", "JustifyLeft", "JustifyCenter", "JustifyRight",
                "JustifyFull", "", "Border", "", "NumberedList", "BulletedList", "", "Outdent", "Indent"],
            "Review": ["Inspect", "Find"]
        }, insertGroupInfo = {
            "Tables": [
                "Table", "", "InsertColumn", "InsertRow", "InsertCell",
                "", "SplitCell", "MergeCell", "", "DeleteColumn", "DeleteRow", "DeleteCell"],
            "Breaks": ["InsertBreak", "InsertParagraph", "InsertPrint", "InsertHR"],
            "Forms": [
                "", "Form", "", "TextArea", "TextBox", "PasswordField", "HiddenField",
                "", "Image", "Button", "", "List", "DropDownList", "Radio", "CheckBox"],
            "Special": ["Link", "InsertImage", "Media", "InsertSpecialChar", "InsertDate"]
        }, TextElement = function (text) {
            this.text = text;

            this.render = function () {
                return this.text;
            };
        };

        /** @widget */
        var wijeditor = (function (_super) {
            __extends(wijeditor, _super);
            function wijeditor() {
                _super.apply(this, arguments);
            }
            /**
            * @constructor
            * @ignore
            */
            wijeditor.prototype.wijeditor = function () {
                this._curPageIdx = 0;
                this.tRange = null;
                this.txtFoundInIE = false;
                this.txtFoundInNoneIE = false;
                this.rangeSelection = null;
            };

            wijeditor.prototype._create = function () {
                var self = this, uniqueid = self.element.attr("id");

                // enable touch support:
                if (window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                if (self.element.is("input")) {
                    return;
                }
                self.wijeditor();
                if (!uniqueid || uniqueid === "") {
                    self.element.uniqueId();
                    uniqueid = self.element.attr("id");
                }

                //if place two editors, it will be mess in ui and function
                self.id_prefix = "wijeditor-" + uniqueid + "-";
                self.$ribbon = undefined;
                self.$modes = undefined;
                self._isIE11 = $.browser.msie && $.browser.version && parseFloat($.browser.version) >= 11;

                self._editorify();
                self._initElements();

                wijWindow.setTimeout(function () {
                    if (self._isDisabled()) {
                        self._handleDisabledOption(true, self.editor);
                    }
                }, 40);

                self._continueSavingInputTextForUndo = false;

                if (self.element.is(":hidden") && self.editor.wijAddVisibilityObserver) {
                    self.editor.wijAddVisibilityObserver(function (e) {
                        if ($.contains(self.editor[0], e.target)) {
                            return;
                        }

                        self.refresh();
                        if (self.editor.wijRemoveVisibilityObserver) {
                            self.editor.wijRemoveVisibilityObserver();
                        }
                    }, "wijeditor");
                }
                _super.prototype._create.call(this);
            };

            wijeditor.prototype._contextMenuWidgetName = function () {
                return "wijmenu";
            };

            wijeditor.prototype._createDropdownButton = function (tip, name, text, items, idPrefix) {
                var self = this, divBtn = wijribbonDataRender.createElement("div", {
                    title: tip,
                    "class": css_ribbon_dropdownbutton
                }), ulDrpList = wijribbonDataRender.createElement("ul");

                divBtn.add(wijribbonDataRender.createTextButton(tip, name, text));
                divBtn.add(ulDrpList);

                $.each(items, function (idx, item) {
                    var liDrpBtn = wijribbonDataRender.createElement("li"), btns = wijribbonDataRender.createTextRadioButton(item.tip, idPrefix, item.name, name, item.text);

                    $.each(btns, function (i, btn) {
                        liDrpBtn.add(btn);
                    });

                    ulDrpList.add(liDrpBtn);
                });

                return divBtn;
            };

            wijeditor.prototype._createSplitButton = function (tip, css, name, text, items) {
                var self = this, divBtn = wijribbonDataRender.createElement("div", {
                    title: tip,
                    "class": css_ribbon_splitbutton
                }), ulDrpList = wijribbonDataRender.createElement("ul");

                divBtn.add(wijribbonDataRender.createBigButton(tip, css, name, text));
                divBtn.add(wijribbonDataRender.createElement("button", {
                    "class": css_ribbon_bigbutton
                }));
                divBtn.add(ulDrpList);

                $.each(items, function (idx, item) {
                    var liDrpBtn = wijribbonDataRender.createElement("li");

                    liDrpBtn.add(wijribbonDataRender.createButton(item.tip, item.css, item.name, item.text));

                    ulDrpList.add(liDrpBtn);
                });

                return divBtn;
            };

            //get special button
            wijeditor.prototype._createButtonByCommand = function (cmd) {
                var self = this, button, buttoninfo = buttonInfoAsCommand[cmd], buttonTipKey, buttonTextKey, buttonTip, buttonText, cmdName;

                if (!buttoninfo) {
                    return;
                }

                cmdName = buttoninfo.name;
                buttonTipKey = cmdName + "ButtonTip";
                buttonTextKey = cmdName + "ButtonText";
                buttonTip = this.localizeString(buttonTipKey, buttoninfo.tip);
                buttonText = this.localizeString(buttonTextKey, buttoninfo.text);
                switch (cmdName) {
                    case cmd_blockquote:
                    case cmd_form:
                    case cmd_imagebutton:
                    case cmd_textarea:
                    case cmd_button:
                    case cmd_textbox:
                    case cmd_listbox:
                    case cmd_password:
                    case cmd_dropdownlist:
                    case cmd_hiddenfield:
                    case cmd_radio:
                    case cmd_checkbox:
                    case cmd_insertcolumn:
                    case cmd_insertrow:
                    case cmd_insertcell:
                    case cmd_splitcell:
                    case cmd_mergecell:
                    case cmd_removecolumn:
                    case cmd_removerow:
                    case cmd_removecell:
                    case cmd_removeformat:
                    case cmd_insertbreak:
                    case cmd_insertparagraph:
                    case cmd_insertprintbreak:
                    case cmd_fullscreen:
                    case cmd_undo:
                    case cmd_redo:
                    case cmd_cut:
                    case cmd_copy:
                    case cmd_paste:
                    case cmd_date:
                    case cmd_wordwrap:
                    case cmd_backcolor:
                    case cmd_fontcolor:
                    case cmd_preview:
                    case cmd_cleanup:
                    case cmd_media:
                    case cmd_specialchar:
                    case cmd_template:
                    case cmd_imagebrowser:
                    case cmd_insertcode:
                    case cmd_inserthr:
                    case cmd_selectall:
                        button = wijribbonDataRender.createButton(buttonTip, buttoninfo.css, cmdName);
                        break;
                    case cmd_find:
                    case cmd_inspect:
                        button = wijribbonDataRender.createButton(buttonTip, buttoninfo.css, cmdName, buttonText);
                        break;
                    case cmd_borders:
                    case cmd_subscript:
                    case cmd_superscript:
                    case cmd_bold:
                    case cmd_italic:
                    case cmd_underline:
                    case cmd_strike:
                        button = wijribbonDataRender.createImageCheckButton(buttonTip, self.id_prefix, buttoninfo.css, cmdName);
                        break;
                    case cmd_designview:
                    case cmd_splitview:
                    case cmd_sourceview:
                    case cmd_alignleft:
                    case cmd_aligncenter:
                    case cmd_alignright:
                    case cmd_alignfull:
                    case cmd_outdent:
                    case cmd_indent:
                    case cmd_numberedlist:
                    case cmd_bulletedlist:
                        button = wijribbonDataRender.createImageRadioButton(buttonTip, self.id_prefix, buttoninfo.css, cmdName, buttoninfo.grpname);
                        break;
                    case cmd_table:
                        button = self._createSplitButton(this.localizeString("tableButtonTip", "Table"), css_ribbon_table, cmd_table, this.localizeString("tableButtonText", "Table"), [
                            {
                                tip: this.localizeString("insertTableButtonTip", "Insert Table"),
                                css: css_ribbon_inserttable,
                                name: cmd_inserttable,
                                text: this.localizeString("insertTableButtonText", "Insert")
                            }, {
                                tip: this.localizeString("editTableButtonTip", "Edit Table"),
                                css: css_ribbon_edittable,
                                name: cmd_edittable,
                                text: this.localizeString("editTableButtonText", "Edit")
                            }]);
                        break;

                    case cmd_save:
                        if (self.options.mode === "ribbon") {
                            button = wijribbonDataRender.createBigButton(buttonTip, buttoninfo.css, cmdName, buttonText);
                        } else {
                            button = wijribbonDataRender.createButton(buttonTip, css_ribbon_save16, cmdName);
                        }
                        break;
                    case cmd_link:
                        if (self.options.mode === "ribbon") {
                            button = wijribbonDataRender.createBigButton(buttonTip, buttoninfo.css, cmdName, buttonText);
                        } else {
                            button = wijribbonDataRender.createButton(buttonTip, css_ribbon_link16, cmdName);
                        }
                        break;
                    case cmd_fontname:
                        button = self._createDropdownButton(buttonTip, cmd_fontname, buttonText, self.options.fontNames || [], self.id_prefix);
                        break;
                    case cmd_fontsize:
                        button = self._createDropdownButton(buttonTip, cmd_fontsize, buttonText, self.options.fontSizes || [], self.id_prefix);
                        break;
                    case cmd_spelling:
                        break;
                }

                return button;
            };

            //end of special button
            wijeditor.prototype._createGroup = function (groupName, groupButtons) {
                var self = this, group = wijribbonDataRender.createElement("li"), groupString = self.localizeString(groupName.toLowerCase() + "Group", groupName);

                self._createGroupButtons(group, groupButtons);

                group.add(wijribbonDataRender.createElement("div", groupString, { displayname: groupName }));

                return group;
            };

            wijeditor.prototype._createGroupButtons = function (groupElement, buttons) {
                var self = this, rbList, container = groupElement, button;

                // create buttons
                $.each(buttons, function (index, name) {
                    if (name === "") {
                        container = groupElement;
                        rbList = wijribbonDataRender.createRibbonList();
                        container.add(rbList);
                        container = rbList;
                    } else {
                        button = self._createButtonByCommand(name);
                        if ($.isArray(button) && button.length > 0) {
                            $.each(button, function (idx, btn) {
                                container.add(btn);
                            });
                        } else {
                            container.add(self._createButtonByCommand(name));
                        }
                    }
                });
            };

            wijeditor.prototype._getDefaultRibbonMarkup = function () {
                var self = this, rb = wijribbonDataRender.createElement("div"), rbTabs = wijribbonDataRender.createElement("ul"), rbFmtTab = wijribbonDataRender.createElement("li"), rbIstTab = wijribbonDataRender.createElement("li"), rbFmtPnl = wijribbonDataRender.createElement("div", { id: self.id_prefix + "format" }), rbIstPnl = wijribbonDataRender.createElement("div", { id: self.id_prefix + "insert" }), rbFmtGrps = wijribbonDataRender.createElement("ul"), rbIstGrps = wijribbonDataRender.createElement("ul"), formatTabString = self.localizeString("formatTab", "Format"), insertTabString = self.localizeString("insertTab", "Insert");

                //ribbon tab.
                rb.add(rbTabs);
                rb.add(rbFmtPnl);
                rb.add(rbIstPnl);

                rbTabs.add(rbFmtTab);
                rbTabs.add(rbIstTab);

                rbFmtTab.add(wijribbonDataRender.createElement("a", formatTabString, {
                    href: "#" + self.id_prefix + "format"
                }));
                rbIstTab.add(wijribbonDataRender.createElement("a", insertTabString, {
                    href: "#" + self.id_prefix + "insert"
                }));

                //format groups
                rbFmtPnl.add(rbFmtGrps);
                $.each(formatGroupInfo, function (action, buttons) {
                    rbFmtGrps.add(self._createGroup(action, buttons));
                });

                //insert groups
                rbIstPnl.add(rbIstGrps);
                $.each(insertGroupInfo, function (action, buttons) {
                    rbIstGrps.add(self._createGroup(action, buttons));
                });

                return rb.render();
            };

            wijeditor.prototype._resetModesBtnTip = function (css, buttonInfo) {
                var editorFooter = this.element.find(".wijeditor-footer"), button = $(editorFooter.find("." + css));

                if (button.length > 0) {
                    buttonInfo.tip = button.attr("title") || buttonInfo.tip;
                }
            };

            wijeditor.prototype._getRibbonModesMarkup = function () {
                var self = this, rb = wijribbonDataRender.createDiv(css_ribbon_modes), rbList = wijribbonDataRender.createRibbonList(), editorFooter = self.element.find(".wijeditor-footer");

                //added for localization
                if (editorFooter.length > 0) {
                    self._resetModesBtnTip(css_ribbon_designview, buttonInfoAsCommand.Wysiwyg);
                    self._resetModesBtnTip(css_ribbon_splitview, buttonInfoAsCommand.Split);
                    self._resetModesBtnTip(css_ribbon_sourceview, buttonInfoAsCommand.Code);
                    self._resetModesBtnTip(css_ribbon_wordwrap, buttonInfoAsCommand.Wordwrap);
                    self._resetModesBtnTip(css_ribbon_fullscreen, buttonInfoAsCommand.FullScreen);
                    editorFooter.remove();
                }

                rb.add(rbList);

                self._createGroupButtons(rbList, ["Wysiwyg", "Code", "Split"]);
                self._createGroupButtons(rb, ["Wordwrap", "FullScreen"]);

                return rb.render();
            };

            wijeditor.prototype._getSimpleToolBar = function (simpleModeCommands) {
                var self = this, button, rb = wijribbonDataRender.createDiv("");

                $.each(simpleModeCommands, function (idx, cmd) {
                    button = self._createButtonByCommand(cmd);
                    if (button) {
                        if ($.inArray(cmd, imageTypeButton) !== -1) {
                            $.each(button, function (idx, btn) {
                                rb.add(btn);
                            });
                        } else {
                            rb.add(button);
                        }
                    }
                });

                return rb.render();
            };

            wijeditor.prototype._editorify = function () {
                var self = this, element = self.element, width = element.width(), height = element.height(), o = self.options, mode = o.mode, container, content, filterCustomSimpleModeCommands, ribbons, footer, $content, text;

                self._oriStyle = element.attr("style");
                self._oriContent = element.html();
                self._oriEleWidth = width;
                self._oriEleHeight = height;

                if (element.is("textarea")) {
                    if (mode === "ribbon") {
                        self.$ribbon = $(self._getDefaultRibbonMarkup());
                    } else if (mode === "bbcode") {
                        self.$ribbon = $(self._getSimpleToolBar(defaultBBCodeModeCommands));
                    } else {
                        if (o.simpleModeCommands && o.simpleModeCommands.length !== 0) {
                            //Note: filter table command
                            filterCustomSimpleModeCommands = $.grep(o.simpleModeCommands, function (n, i) {
                                return n !== "Table";
                            }, undefined);
                            self.$ribbon = $(self._getSimpleToolBar(filterCustomSimpleModeCommands));
                        } else {
                            self.$ribbon = $(self._getSimpleToolBar(defaultSimpleModeCommands));
                        }
                    }
                    if (o.text) {
                        element.val(o.text);
                    }
                    self.sourceView = element;
                    self.editor = element.wrap("<div></div>").parent();
                    self.editor.width(width).height(height);
                } else {
                    self.editor = element;
                    self.$ribbon = element.children(":eq(0)");
                    $content = element.children(":eq(1)");

                    if ($content.is("textarea")) {
                        if (o.text) {
                            $content.val(o.text);
                        }
                        self.sourceView = $content;
                    } else {
                        if (o.text) {
                            text = o.text;
                        } else {
                            text = $content.html();
                        }

                        $content.remove();
                        self.sourceView = $("<textarea></textarea>").val(text);
                    }
                }

                container = $("<div class='" + css_editor_container + "'></div>");
                self.dialog = $("<div class ='" + css_editor + "'></div>");
                self.subDialog = $("<div class ='" + css_editor + "'></div>");
                self.editor.addClass(css_editor).addClass(self.options.wijCSS.widget).append(container).append(self.dialog).append(self.subDialog);
                self._createMenuMarkUp(self, o);

                //head
                //ribbon
                self.$ribbon.wrap("<a href='javascript:void(null)'></a>").parent().appendTo("<div class='" + css_editor_header + " ui-widget-header ui-helper-clearfix ui-corner-top'></div>").parent().appendTo(container);

                //content
                content = $("<div class='" + css_editor_content + "'></div>").appendTo(container);

                self.designView = $("<iframe frameborder='0'></iframe>");

                self.designView.wrap("<div></div>").parent().appendTo(content);
                self.sourceView.wrap("<div></div>").parent().appendTo(content);

                ribbons = [self.$ribbon];
                self.$modes = $(self._getRibbonModesMarkup());

                //footer
                if (o.showFooter) {
                    footer = $("<div class='" + css_editor_footer + " " + "ui-widget ui-widget-content ui-state-default'></div>");
                    container.append(footer);
                    footer.append("<div class='" + css_editor_pathselector + "'></div>");

                    self.$modes.appendTo(footer);
                    ribbons.push(self.$modes);
                }

                $.each(ribbons, function (idx, ribbon) {
                    ribbon.wijribbon({
                        compactMode: self.options.compactRibbonMode,
                        click: function (e, data) {
                            self._ribbonCommand(data.commandName, data.name);
                            self._trigger('commandButtonClick', e, data);
                        }
                    });
                });
            };

            //fixed bug for customContextMenu
            wijeditor.prototype._createMenuMarkUp = function (self, o) {
                if (o.customContextMenu && !$.browser.webkit) {
                    self.contextMenu = $("<ul>" + "<li _c1buttoncmd='cut'><a>" + this.localizeString("contextMenuCut", "Cut") + "</a></li>" + "<li _c1buttoncmd='copy'><a>" + this.localizeString("contextMenuCopy", "Copy") + "</a></li>" + "<li _c1buttoncmd='paste'><a>" + this.localizeString("contextMenuPaste", "Paste") + "</a></li></ul>");

                    $("<a href='#'></a>").append(self.contextMenu).appendTo(self.editor);
                }
            };

            wijeditor.prototype._handleDisabledOption = function (disabled, ele) {
                var self = this;

                if (disabled) {
                    if (!self.disabledDiv) {
                        self.disabledDiv = self._createDisabledDiv(ele);
                    }
                    $("body").focus();
                    self.disabledDiv.appendTo(self.editor);
                } else {
                    if (self.disabledDiv) {
                        self.disabledDiv.remove();
                        self.disabledDiv = null;
                    }
                }
            };

            wijeditor.prototype._createDisabledDiv = function (outerEle) {
                var self = this, ele = outerEle ? outerEle : self.element, disabledWidth = ele.outerWidth(), disabledHeight = ele.outerHeight();

                return $("<div></div>").addClass("ui-state-disabled").css({
                    "z-index": "99999",
                    position: "relative",
                    "background-color": "lightgray",
                    width: disabledWidth,
                    height: disabledHeight,
                    left: 0,
                    top: -disabledHeight
                });
            };

            wijeditor.prototype._initElements = function () {
                var self = this, o = self.options, contentHeight = self.editor.height() - self._getHeader().outerHeight(true) - self._getFooter().outerHeight(true), buttonStates = {};

                self._getContent().height(contentHeight).wijsplitter({
                    showExpander: false,
                    orientation: "horizontal",
                    panel1: {
                        scrollBars: "none",
                        collapsed: false
                    },
                    panel2: {
                        scrollBars: "none",
                        collapsed: true
                    }
                });
                self.sourceView.css("width", "").css("height", "");
                self._addHandlerToDesignView();
                self._addDefaultFontStyleToDesignView();
                self._createWijMenu();

                if (!o.showPathSelector || self.options.mode === "bbcode") {
                    self._getPathSelector().hide();
                }
                self._ribbonCommand(o.editorMode, null, true);

                if (o.fullScreenMode) {
                    self._setFullScreen(o.fullScreenMode);
                }

                buttonStates[cmd_redo] = true;
                buttonStates[cmd_undo] = true;
                self.$ribbon.wijribbon(setButtonsDisabled, buttonStates);
                self._handleWinDocumentKeyDown();
            };

            wijeditor.prototype._handleWinDocumentKeyDown = function () {
                var self = this;
                $(document).bind('keydown.' + self.widgetName + "." + self.id_prefix.replace(/-/g, ""), function (e) {
                    if (self._isDisabled()) {
                        return;
                    }
                    switch (e.keyCode) {
                        case 27:
                            self._escActionAssociated();
                            break;
                    }
                });
            };

            wijeditor.prototype._setOption = function (key, value) {
                var self = this, o = self.options, oldMode = o.mode, oldEditorMode = o.editorMode, oldCompactRibbonMode = o.compactRibbonMode, ribbonParent = self.$ribbon.parent(), oldFullScreenMode = o.fullScreenMode, oldCustomContextMenu = o.customContextMenu;

                _super.prototype._setOption.call(this, key, value);

                if (key === "fullScreenMode") {
                    if (value !== oldFullScreenMode) {
                        self._setFullScreen(value);
                    }
                } else if (key === "showPathSelector") {
                    if (value) {
                        self._getPathSelector().show();
                        self._refreshPathSelector();
                    } else {
                        self._getPathSelector().hide();
                    }
                } else if (key === "editorMode" && oldEditorMode !== value) {
                    self._ribbonCommand(value);
                    if (self.$modes.data("wijmo-wijribbon")) {
                        self.$modes.wijribbon(setButtonChecked, oldEditorMode, false);
                    }
                } else if (key === "fullScreenContainerSelector") {
                    if (self.options.fullScreenMode) {
                        self._setFullScreen(true);
                    }
                } else if (key === "showFooter") {
                    if (value) {
                        if (!($("." + css_editor_footer).is(":visible"))) {
                            $("." + css_editor_footer).show();
                        }
                    } else {
                        if (($("." + css_editor_footer).is(":visible"))) {
                            $("." + css_editor_footer).hide();
                        }
                    }
                } else if (key === "commandButtonClick") {
                    o.commandButtonClick = value;
                } else if (key === "text") {
                    self.setText(value);
                } else if (key === "customContextMenu") {
                    if (oldCustomContextMenu === value) {
                        return;
                    }
                    if (value) {
                        if (!self.contextMenu) {
                            self._createMenuMarkUp(self, o);
                        }
                        self._createWijMenu();
                    } else {
                        self.contextMenu[self._contextMenuWidgetName()]("destroy").remove();
                        self.contextMenu = undefined;
                    }
                } else if ((key === "mode" && value !== oldMode) || (key === "compactRibbonMode" && value !== oldCompactRibbonMode)) {
                    self._recreateRibbon(o.mode);
                    self._ribbonCommand(o.editorMode);
                } else if (key === "fontNames" || key === "fontSizes") {
                    self._recreateRibbon(o.mode);
                }
                //Todo
                //set the option tableVirtualBorderShowing
            };

            wijeditor.prototype._innerDisable = function () {
                _super.prototype._innerDisable.call(this);
                this._handleDisabledOption(true, this.editor);
            };

            wijeditor.prototype._innerEnable = function () {
                _super.prototype._innerEnable.call(this);
                this._handleDisabledOption(false, this.editor);
            };

            wijeditor.prototype._recreateRibbon = function (mode) {
                var self = this, ribbonParent = self.$ribbon.parent();
                self.$ribbon.wijribbon("destroy");
                self.$ribbon.remove();
                if (mode === "ribbon") {
                    self.$ribbon = $(self._getDefaultRibbonMarkup());
                } else if (mode === "bbcode") {
                    self.$ribbon = $(self._getSimpleToolBar(defaultBBCodeModeCommands));
                } else {
                    self.$ribbon = $(self._getSimpleToolBar(defaultSimpleModeCommands));
                }

                ribbonParent.append(self.$ribbon);
                self.$ribbon.wijribbon({
                    compactMode: self.options.compactRibbonMode,
                    click: function (e, data) {
                        self._ribbonCommand(data.commandName, data.name);
                        self._trigger('commandButtonClick', e, data);
                    }
                });
            };

            wijeditor.prototype._getHeader = function () {
                return $("." + css_editor_header, this.editor);
            };

            wijeditor.prototype._getContent = function () {
                return $("." + css_editor_content, this.editor);
            };

            wijeditor.prototype._getFooter = function () {
                return $("." + css_editor_footer, this.editor);
            };

            wijeditor.prototype._getPathSelector = function () {
                return $("." + css_editor_pathselector, this.editor);
            };

            wijeditor.prototype._getModes = function () {
                return $("." + css_ribbon_modes, this.editor);
            };

            wijeditor.prototype._getDesignView = function () {
                return this.designView;
            };

            wijeditor.prototype._getDesignViewWindow = function () {
                var $designView = this.designView;

                if ($designView && $designView.length > 0) {
                    return $designView[0].contentWindow;
                }

                return null;
            };

            wijeditor.prototype._getDesignViewDocument = function () {
                var win = this._getDesignViewWindow();

                if (win) {
                    return win.document;
                }

                return null;
            };

            wijeditor.prototype._getDesignViewText = function () {
                var doc = this._getDesignViewDocument();

                if (doc && doc.body && doc.body.innerHTML) {
                    return doc.body.innerHTML;
                }

                return "";
            };

            wijeditor.prototype._setDesignViewText = function (text) {
                var self = this, doc = this._getDesignViewDocument();

                if (this.options.mode === "bbcode") {
                    //Note: maybe need to trim the text.
                    text = self._convertBBCodeToHtml(text);
                }
                if (doc && doc.body) {
                    doc.body.innerHTML = text;
                }

                self.options.text = text;
            };

            wijeditor.prototype._getDialog = function () {
                return this.dialog;
            };

            wijeditor.prototype._getSubDialog = function () {
                return this.subDialog;
            };

            wijeditor.prototype._initContentDocument = function () {
                var self = this, text = self.sourceView.val(), doc = self._getDesignViewDocument(), tableVirtualBorderShowing = self.options.tableVirtualBorderShowing, bindLoadEvent = function () {
                    self.designView.load(function () {
                        try  {
                            self._addHandlerToDesignView();
                            self._addDefaultFontStyleToDesignView();
                            self._createWijMenu();
                        } catch (e) {
                        }
                    });
                };

                // fixed an issue that when contains image element, toggling full screen mode will cause endless loop in IE9+
                if (text !== "" && text === self._getDesignViewText()) {
                    return;
                }

                if (self.options.mode === "bbcode") {
                    //Note: trim leading/trailing whitespace
                    //because when get the innerhtml from body, there
                    //are some whitespace on leading/trailing
                    text = self._convertBBCodeToHtml($.trim(text));
                }

                self.designView.unbind("load");
                doc.open();
                doc.write("<html style=\"width:100%;height:100%;" + (self.options.enabled ? "cursor:text;" : "") + "\"><head><title></title><style id=\"__wijStyle\" " + " type=\"text/css\" >table,td,tr{border: 1px #acacac dashed;}" + "</style></head><body style=\"word-wrap:break-word\">" + text + "</body></html>");
                doc.close();
                if (!tableVirtualBorderShowing) {
                    self._updateTableBorderShowing(tableVirtualBorderShowing);
                    self.$ribbon.wijribbon(setButtonChecked, cmd_borders, !tableVirtualBorderShowing);
                }
                if (self.element.attr("accesskey")) {
                    $(doc.body).attr("accesskey", self.element.attr("accesskey"));
                    self.element.removeAttr("accesskey");
                }
                undoBuffers = [];
                undoBuffers.push(text);
                undoSteps = 0;
                bindLoadEvent();
            };

            wijeditor.prototype._addHandlerToDesignView = function () {
                var self = this, win = self._getDesignViewWindow(), doc = win.document;

                self._initContentDocument();

                self._loadDesignView();

                //before lose focus, save the selection in ie.
                if ($.browser.msie) {
                    $(doc).unbind("beforedeactivate").bind("beforedeactivate", function () {
                        self._saveSelectionForIE();
                    });
                }
            };

            wijeditor.prototype._loadDesignView = function () {
                var self = this, win = self._getDesignViewWindow(), doc = win.document;

                if ($.browser.mozilla) {
                    setTimeout(self._setDesignModeForFF, 1000, self);
                } else {
                    self._setContentEditable(doc, true);
                }

                if ($.browser.msie) {
                    self._setContentSpellCheck(doc, false);
                }

                self.sourceView.unbind('blur.' + self.widgetName).bind('blur.' + self.widgetName, function (e) {
                    self._onSourceViewBlur();
                });

                //add for any change happens, the text would be saved
                self.sourceView.unbind('keyup.' + self.widgetName).bind('keyup.' + self.widgetName, function (e) {
                    self._onSourceViewBlur();
                });

                //note: in safari and chrome, the source view is show null
                if (!$.browser.mozilla) {
                    $(win).blur(function (e) {
                        self._onDesignViewBlur(e);
                    });
                } else {
                    $(doc).unbind('blur.' + self.widgetName).bind('blur.' + self.widgetName, function (e) {
                        self._onDesignViewBlur(e);
                    });
                }

                $(doc).unbind('mouseup.' + self.widgetName).bind('mouseup.' + self.widgetName, function (e) {
                    self._onDesignViewMouseUp(e);
                }).unbind('keydown.' + self.widgetName).bind('keydown.' + self.widgetName, function (e) {
                    self._onDesignViewKeyDown(e);
                }).unbind('keyup.' + self.widgetName).bind('keyup.' + self.widgetName, function (e) {
                    self._onDesignViewKeyUp(e);

                    //add for any change happens, the text would be saved
                    self._onDesignViewBlur(e);
                });
            };

            wijeditor.prototype._addDefaultFontStyleToDesignView = function () {
                var self = this, o = self.options, doc = self._getDesignViewDocument(), defaultFontName = o.defaultFontName, defaultFontSize = o.defaultFontSize, defaultFontStyleString = "<style type=\"text/css\"> body {";

                if ((defaultFontName === "" || defaultFontName === null) && (defaultFontSize === "" || defaultFontSize === null)) {
                    return;
                }

                if (defaultFontName !== "" && defaultFontName !== null) {
                    defaultFontStyleString += "font-family: " + defaultFontName + ";";
                }

                if (o.defaultFontSize !== "" && o.defaultFontSize !== null) {
                    defaultFontStyleString += " font-size: " + defaultFontSize + ";";
                }

                defaultFontStyleString += "}</style>";

                window.setTimeout(function () {
                    $(defaultFontStyleString).appendTo($("head", doc));
                }, 200);

                self._setFontStyleButtonState(defaultFontName, cmd_fontname);
                self._setFontStyleButtonState(defaultFontSize, cmd_fontsize);
            };

            wijeditor.prototype._setFontStyleButtonState = function (defaultValue, cmd) {
                var defaultKey = "";
                if (!defaultValue || defaultValue === null) {
                    return;
                }
                $.each(this.$ribbon.wijribbon("getDropdownList", cmd), function (key, value) {
                    if (value.toUpperCase() === defaultValue.toUpperCase()) {
                        defaultKey = key;
                        return false;
                    }
                });
                this.$ribbon.wijribbon(setButtonChecked, defaultKey, true, cmd);
            };

            wijeditor.prototype._setDesignModeForFF = function (self) {
                var dvDoc = self._getDesignViewDocument();
                if (dvDoc) {
                    dvDoc.designMode = "on";
                }
            };

            /**
            * Remove the functionality completely. This will return the element back to its pre-init state.
            */
            wijeditor.prototype.destroy = function () {
                var self = this;

                self.element.html(self._oriContent);
                self.element.removeAttr("tabindex");

                if (self._oriStyle === undefined) {
                    self.element.removeAttr("style");
                } else {
                    self.element.attr("style", self._oriStyle);
                }

                if (self.dialog) {
                    self.dialog.remove();
                }
                self.element.insertBefore(self.editor);
                self.element.unbind('.' + self.widgetName);
                $(document).unbind('.' + self.widgetName + "." + self.id_prefix.replace(/-/g, ""));
                self.element.removeUniqueId();
                self.editor.remove();

                if (self._oriDocOverFlow) {
                    $(document.documentElement).css({
                        overflow: self._oriDocOverFlow
                    });
                }

                $.Widget.prototype.destroy.call(self);
            };

            /** @ignore */
            wijeditor.prototype.showEditorDialog = function (dialogCmd) {
                switch (dialogCmd) {
                    case cmd_inserttable:
                    case cmd_template:
                    case cmd_imagebrowser:
                    case cmd_inspect:
                    case cmd_find:
                    case cmd_specialchar:
                    case cmd_media:
                    case cmd_cleanup:
                    case cmd_link:
                    case cmd_backcolor:
                    case cmd_fontcolor:
                    case cmd_insertcode:
                        this._ribbonCommand(dialogCmd);
                        break;
                    default:
                        wijAlert(this.localizeString("notFindCommandError", "Cannot find the dialog with command name '") + dialogCmd + "'!");
                        break;
                }
            };

            /** @ignore */
            wijeditor.prototype.executeEditorAction = function (command, parentCmd) {
                this._ribbonCommand(command, parentCmd);
            };

            wijeditor.prototype._isFontSizeCustomized = function () {
                if (isFontSizeCustomized !== null) {
                    return isFontSizeCustomized;
                }

                var fontSizes = this.$ribbon.wijribbon("getDropdownList", cmd_fontsize), fss = [
                    cmd_verysmall, cmd_smaller, cmd_small,
                    cmd_medium, cmd_large, cmd_larger, cmd_verylarge];

                isFontSizeCustomized = false;

                $.each(fontSizes, function (key, value) {
                    if ($.inArray(key, fss) === -1) {
                        isFontSizeCustomized = true;
                        return false;
                    }
                });

                return isFontSizeCustomized;
            };

            wijeditor.prototype._fontSizeCommand = function (cmd) {
                var self = this, doc = self._getDesignViewDocument(), docSelection, arg = 4, fontSize = "font-size", $spans = [];

                if (self._getDesignViewWindow().getSelection) {
                    docSelection = self._getDesignViewWindow().getSelection();
                }
                switch (cmd) {
                    case cmd_verysmall:
                        arg = 1;
                        break;
                    case cmd_smaller:
                        arg = 2;
                        break;
                    case cmd_small:
                        arg = 3;
                        break;
                    case cmd_medium:
                        arg = 4;
                        break;
                    case cmd_large:
                        arg = 5;
                        break;
                    case cmd_larger:
                        arg = 6;
                        break;
                    case cmd_verylarge:
                        arg = 7;
                        break;
                }

                self._setIEFocus();

                //Add comments by RyanWu@20110915.
                //For implementing the font-size
                //support px/pt etc other than only small/x-small/x-large/large...
                //doc.execCommand("FontSize", false, arg);
                if (!self._isFontSizeCustomized()) {
                    if ($.browser.msie && wijParseInt($.browser.version) >= 9) {
                        if (docSelection && docSelection.rangeCount > 0) {
                            doc.execCommand("FontSize", false, arg);
                        }
                    } else {
                        doc.execCommand("FontSize", false, arg);
                    }
                } else {
                    self._formatFontSpan(doc, fontSize, cmd);
                }

                //end by RyanwWu@20110915.
                if (self.options.mode === "bbcode" && !($.browser.msie)) {
                    self._convertFontStyleToStandTag();
                }

                self._addtoUndoBuffer();
            };

            wijeditor.prototype._fontNameCommand = function (cmd) {
                var self = this, doc = self._getDesignViewDocument(), docSelection, fontNames = self.$ribbon.wijribbon("getDropdownList", cmd_fontname), fontName;

                if (self._getDesignViewWindow().getSelection) {
                    docSelection = self._getDesignViewWindow().getSelection();
                }
                $.each(fontNames, function (key, value) {
                    if (cmd === key) {
                        fontName = value;
                        return false;
                    }
                });

                self._setIEFocus();

                //Add comments by RyanWu@20110915.
                //For implementing the font-size
                //support px/pt etc other than only small/smaller/larger/large...
                //doc.execCommand("FontName", false, fontName);
                if ($.browser.msie && wijParseInt($.browser.version) >= 9) {
                    if (docSelection && docSelection.rangeCount > 0) {
                        doc.execCommand("FontName", false, fontName);
                    }
                } else {
                    doc.execCommand("FontName", false, fontName);
                }

                if (self._isFontSizeCustomized() && $.browser.msie) {
                    self._formatFontSpan(doc, "font-family", fontName);
                }

                //end by RyanwWu@20110915.
                self._addtoUndoBuffer();
            };

            //Add comments by RyanWu@20110922.
            //For implementing the font-size
            //support px/pt etc other than only small/smaller/larger/large...
            wijeditor.prototype._formatFontSpan = function (doc, cssName, cssValue) {
                var self = this, tempValue = cssValue, styleAttrName = "fontFamily", $spans = [];

                if (cssName !== "font-family") {
                    tempValue = "c1-temp";
                    styleAttrName = "fontSize";
                }
                doc.execCommand("FontName", false, tempValue);

                $.each($("font[face='" + tempValue + "']", doc), function (i, fn) {
                    var $span = self._replaceFontWithSpan($(fn), "face", cssName, cssValue), $children, idx;

                    $spans.push($span);

                    //1. remove all font-family style of the child spans.
                    //<span style="font-family:B">blah<span style="font-family:A">
                    //</span></span>,
                    //need remove the span whose font-family is A
                    $children = $("span." + css_formatspan, $span);

                    for (idx = $children.length - 1; idx >= 0; idx--) {
                        self._removeSpecifiedStyleSpan($($children[idx]), styleAttrName, cssName);
                    }

                    //2. remove duplicated spans.
                    //<span style="font-family:A">
                    //<span style="font-family:B">blah</span></span>
                    $.each($span, function (idx, span) {
                        $.each($(span).parents("span." + css_formatspan), function (i, parent) {
                            var $parent = $(parent);

                            if ($parent.children().length > 1) {
                                return false;
                            }

                            if ($parent.text() === $(span).text()) {
                                self._removeSpecifiedStyleSpan($parent, styleAttrName, cssName);
                            }
                        });
                    });
                });

                self._setSelection($spans);
            };

            wijeditor.prototype._replaceFontWithSpan = function ($fn, attrName, cssName, cssValue) {
                $fn.wrap("<span class = '" + css_formatspan + "' style='" + cssName + ":" + cssValue + "'></span>");
                var $span = $fn.parent();

                $fn.removeAttr(attrName);

                if (/<font\s*>/ig.test($span.html())) {
                    $span.html($fn.html());
                    $fn.remove();
                }

                return $span;
            };

            wijeditor.prototype._removeSpecifiedStyleSpan = function ($span, styleAttrName, cssAttrName) {
                var style, shouldRemove = true;

                if ($span[0].style[styleAttrName] !== "") {
                    $span.css(cssAttrName, "");
                }
                style = $span.attr("style");

                if (style) {
                    $.each(style.split(';'), function (i, attr) {
                        var styleAttr = $.trim(attr).toLowerCase();
                        if (styleAttr !== "" && styleAttr.indexOf(cssAttrName) !== -1) {
                            shouldRemove = false;
                            return false;
                        }
                    });
                }

                if (shouldRemove) {
                    $span.replaceWith($span.html());
                }
            };

            wijeditor.prototype._removeFormat = function () {
                var self = this, doc = self._getDesignViewDocument(), buttonStates = {};

                doc.execCommand(cmd_removeformat, false, null);

                if (self._isFontSizeCustomized() && $.browser.msie) {
                    self._removeFormatForIE(doc);
                }

                self._addtoUndoBuffer();
                buttonStates[cmd_bold] = false;
                buttonStates[cmd_italic] = false;
                buttonStates[cmd_strike] = false;
                buttonStates[cmd_underline] = false;
                buttonStates[cmd_subscript] = false;
                buttonStates[cmd_superscript] = false;
                buttonStates[cmd_numberedlist] = false;
                buttonStates[cmd_bulletedlist] = false;
                buttonStates[cmd_alignleft] = false;
                buttonStates[cmd_aligncenter] = false;
                buttonStates[cmd_alignright] = false;
                buttonStates[cmd_alignfull] = false;

                self.$ribbon.wijribbon(setButtonsChecked, buttonStates);
            };

            wijeditor.prototype._removeFormatForIE = function (doc) {
                var range = doc.selection.createRange(), htmlText = range.htmlText, text = range.text, start = 0, $parent = $(range.parentElement()), $body = $(doc.body), preHtml = "", sufHtml = "", specialStr = "__c1temp", specialCss = "c1-temp", tempSpan = "<span class='" + specialCss + "'>" + specialStr + "</span>", $tempSpan, $tempSibling, $spans, $span, idx, items;

                //1. <span style="font-size:20pt">A[B</span>C]D
                //2. <span style="font-size:20pt">A[B</span>CD<span style="font-size:30pt">EF]G</span>
                //3. <span style="font-size:20pt">A[BC]D</span>
                //4. <span style="font-family:arial"><span style="font-size:20pt">A[B</span>CD<span style="font-size:30pt">EF]G</span></span>
                $parent.addClass("c1-app-parent");
                range.pasteHTML(tempSpan);

                start = $body.text().indexOf(specialStr);
                $tempSpan = $("span." + specialCss, doc);
                $tempSibling = $tempSpan;

                $tempSpan.parentsUntil("body").each(function (index) {
                    if ($(this).is(".c1-app-parent")) {
                        return false;
                    }

                    $tempSibling = $(this);
                });
                $tempSpan.html(htmlText);

                $spans = $("span." + css_formatspan, $tempSpan);

                for (idx = $spans.length - 1; idx >= 0; idx--) {
                    $span = $($spans[idx]);

                    $span.replaceWith($span.html());
                }

                if (!$tempSibling.is("." + specialCss)) {
                    $tempSibling.after($tempSpan);
                }

                $.each($tempSibling.parents("span." + css_formatspan), function (index, p) {
                    preHtml += "</span>";
                    sufHtml = "<span class='" + css_formatspan + "' style = '" + $(p).attr("style") + "'>" + sufHtml;
                });

                htmlText = $tempSpan.html();
                $tempSpan.replaceWith(specialStr);
                items = $body.html().split(specialStr);

                $body.html(items[0] + preHtml + htmlText + sufHtml + items[1]);

                $spans = $("span." + css_formatspan, doc);

                for (idx = $spans.length - 1; idx >= 0; idx--) {
                    $span = $($spans[idx]);

                    if ($span.text() === "") {
                        $span.replaceWith($span.html());
                    }
                }

                $(".c1-app-parent", doc).removeClass("c1-app-parent");

                this._setSelection(null, start, text.length);
            };

            //end by RyanwWu@20110922.
            wijeditor.prototype._toggleFullScreen = function () {
                var self = this, o = self.options;

                o.fullScreenMode = !o.fullScreenMode;

                self._setFullScreen(o.fullScreenMode);
                self.$modes.wijribbon(setButtonChecked, cmd_fullscreen, o.fullScreenMode);
                self.$modes.wijribbon("removeButtonHoverState", cmd_fullscreen);
            };

            wijeditor.prototype._setFullScreen = function (fullScreenMode) {
                var self = this, borderWidth = 1, header = self._getHeader(), footer = self._getFooter(), content = self._getContent(), cSelector = self.options.fullScreenContainerSelector, $container = $(cSelector), oriHtml = self._getDesignViewText(), width, height, contentHeight;

                if (fullScreenMode) {
                    if ($container.length === 0) {
                        $container = $(wijWindow);
                        cSelector = "body";

                        //note:add the block for preventing the scrollbar appear
                        self._oriDocOverFlow = $(document.documentElement).css("overflow");
                        $(document.documentElement).css({
                            overflow: "hidden"
                        });

                        //end for block
                        //note: if the content exclude the editor, the window still
                        //has the scroll, need to do some adjustment.
                        if (!$.browser.mozilla) {
                            window.scrollTo(0, 0);
                        }
                        $(wijWindow).bind("resize.wijeditor", function () {
                            self._fullscreenOnWindowResize();
                        });
                    }

                    width = $container.width();
                    height = $container.height() - 2 * borderWidth;
                    oriWidth = self.editor.width();
                    oriHeight = self.editor.height();

                    if (!$oriParent) {
                        $oriParent = self.editor.parent();
                    }

                    if (!self._replacedDiv) {
                        self._replacedDiv = $("<div />");
                    }

                    self.editor.after(self._replacedDiv);

                    $(cSelector).append(self.editor);

                    self.editor.css({
                        width: width,
                        height: height,
                        position: ""
                    }).addClass(css_editor_fullscreen);

                    self.$ribbon.wijribbon("updateRibbonSize");
                } else {
                    self._replacedDiv.after(self.editor).remove();

                    self.editor.css({
                        width: oriWidth,
                        height: oriHeight,
                        position: "static"
                    }).removeClass(css_editor_fullscreen);

                    if (!self.options.fullScreenContainerSelector) {
                        $(document.documentElement).css({
                            overflow: self._oriDocOverFlow
                        });
                    }
                    $(wijWindow).unbind("resize.wijeditor");
                    self.$ribbon.wijribbon("updateRibbonSize");
                }

                if (self.disabledDiv) {
                    if (fullScreenMode) {
                        self.disabledDiv.css({
                            position: "fixed",
                            width: "",
                            height: "",
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0
                        });
                    } else {
                        self.disabledDiv.css({
                            position: "relative",
                            width: self.editor.outerWidth(),
                            height: self.editor.outerHeight(),
                            left: 0,
                            top: -self.editor.outerHeight(),
                            right: "",
                            bottom: ""
                        });
                    }
                }

                contentHeight = self.editor.height() - header.outerHeight(true) - footer.outerHeight(true);

                content.height(contentHeight).wijsplitter("refresh");

                if (self.$modes.data("wijmo-wijribbon")) {
                    self.$modes.wijribbon(setButtonChecked, cmd_fullscreen, fullScreenMode);
                }
            };

            wijeditor.prototype._createWijMenu = function () {
                var self = this, doc = self._getDesignViewDocument();
                if (self.contextMenu) {
                    self.contextMenu[self._contextMenuWidgetName()]({
                        orientation: 'vertical',
                        trigger: self.designView,
                        triggerEvent: 'rtclick',
                        showing: function (e, sublist) {
                            if ($.browser.msie) {
                                self._saveSelectionForIE();
                            }
                            var offset = self.designView.offset(), contentWindowScrollLeft = $($(self.designView)[0].contentWindow).scrollLeft(), contentWindowScrollTop = $($(self.designView)[0].contentWindow).scrollTop(), menuOffsetLeft = offset.left + 2 - contentWindowScrollLeft, menuOffsetTop = offset.top - contentWindowScrollTop;
                            sublist.options.position = {
                                my: 'left+' + menuOffsetLeft + ' ' + 'top+' + menuOffsetTop,
                                at: 'right top',
                                of: e,
                                collision: 'none none'
                            };
                        },
                        animation: { animated: "fade" },
                        select: function (e, item) {
                            self._setIESelection();
                            self._contextMenuItemClick(e, item);
                            self.contextMenu[self._contextMenuWidgetName()]("deactivate");
                        }
                    });
                }
            };

            wijeditor.prototype._fullscreenOnWindowResize = function () {
                var self = this, header = self._getHeader(), footer = self._getFooter(), content = self._getContent(), contentHeight, fWidth = $(window).width(), fHeight = $(window).height();

                self.editor.css({
                    width: fWidth,
                    height: fHeight
                });

                contentHeight = self.editor.height() - header.height() - footer.height();
                content.height(contentHeight);
                if (content.data("wijmo-wijsplitter")) {
                    content.wijsplitter("refresh");
                }
                //TODO
                //$ribbon.wijribbon("updateRibbonSize");
            };

            wijeditor.prototype._saveText = function (arg) {
            };

            wijeditor.prototype._doSpellCheck = function () {
            };

            wijeditor.prototype._ribbonCommand = function (cmd, parentCmd, isInit) {
                var self = this, disabled = self._isDisabled(), doc = self._getDesignViewDocument(), content = self._getContent(), selection, distance = content.height() / 2, elementName, selectedHtml, range;

                if (parentCmd === cmd_fontname) {
                    self._fontNameCommand(cmd);
                    self._onDesignViewBlur(null);
                    return;
                }

                if (parentCmd === cmd_fontsize) {
                    self._fontSizeCommand(cmd);
                    self._onDesignViewBlur(null);
                    return;
                }

                if (!self.editor.hasClass("ui-helper-hidden-accessible") && !disabled) {
                    // when the editor is place another container widget, such as accordion, and the container is invisible after
                    // the container widget init. if firstly create the editor widget, and then create the container widget,
                    // the iframe will be focusd in ie9, and in the container widget, it looks like someting can edit.
                    if (isInit) {
                        setTimeout(function () {
                            self._setIEFocus();
                        }, 0);
                    } else {
                        // when the design view losefocus, the last selection will lost;
                        // so use focus method to set last selection.
                        if ($.browser.msie) {
                            self.focus();
                        }
                    }
                }

                switch (cmd) {
                    case cmd_blockquote:
                        if ($.browser.msie) {
                            // we first change the block into <ADDRESS> tags,
                            // using the FormatBlock functionality of the execCommand
                            doc.execCommand("FormatBlock", false, "<ADDRESS>");
                            if (self._isIE11 && doc.getSelection) {
                                selection = doc.getSelection();
                                if (selection && selection.anchorNode) {
                                    range = $(selection.anchorNode).closest("address");
                                }
                            } else {
                                range = doc.selection.createRange();
                                range = $(range.parentElement()).closest("address");
                            }

                            if (range.length) {
                                // then sneakily we use regex's to replace
                                // <ADDRESS> tags with <BLOCKQUOTE> tags
                                range.replaceWith("<blockquote>" + range.html() + "</blockquote>");

                                // then we tidy any extra <BLOCKQUOTES>
                                //that have been unhelpfully added.
                                doc.body.innerHTML = doc.body.innerHTML.replace(/<BLOCKQUOTE>\s*?<BLOCKQUOTE>/gi, "<BLOCKQUOTE>");
                                doc.body.innerHTML = doc.body.innerHTML.replace(/<\/BLOCKQUOTE>\s*?<\/BLOCKQUOTE>/gi, "<\/BLOCKQUOTE>");
                                doc.body.innerHTML = doc.body.innerHTML.replace(/<BLOCKQUOTE>\s*?<\/BLOCKQUOTE>/gi, "");
                            }
                        } else {
                            doc.execCommand("FormatBlock", false, "<BLOCKQUOTE>");
                        }
                        self._addtoUndoBuffer();
                        self._setFocusNotIE();
                        break;
                    case cmd_form:
                        elementName = self._generateUniqueName('form');
                        self.insertHTML('<form id="' + elementName + '" name="' + elementName + '" method="post">' + elementName + '</form>');
                        self._setFocusNotIE();
                        break;
                    case cmd_imagebutton:
                        elementName = self._generateUniqueName('image');
                        self.insertHTML('<input id="' + elementName + '" name="' + elementName + '" type="image"' + ' value="' + elementName + '"/>');
                        self._setFocusNotIE();
                        break;
                    case cmd_textarea:
                        elementName = self._generateUniqueName('textarea');
                        self.insertHTML('<textarea id="' + elementName + '" name="' + elementName + '" rows="4" cols="48"></textarea>');
                        self._setFocusNotIE();
                        break;
                    case cmd_button:
                        elementName = self._generateUniqueName('button');
                        self.insertHTML('<input id="' + elementName + '" name="' + elementName + '" type="button"' + ' value="' + elementName + '"/>');
                        self._setFocusNotIE();
                        break;
                    case cmd_textbox:
                        elementName = self._generateUniqueName('textbox');
                        self.insertHTML('<input id="' + elementName + '" name="' + elementName + '" type="text"' + ' value="' + elementName + '"/>');
                        self._setFocusNotIE();
                        break;
                    case cmd_listbox:
                        elementName = self._generateUniqueName('list');
                        self.insertHTML('<select id="' + elementName + '" name="' + elementName + '" style="width: 120px" size="8"></select>');
                        self._setFocusNotIE();
                        break;
                    case cmd_password:
                        elementName = self._generateUniqueName('password');
                        self.insertHTML('<input id="' + elementName + '" name="' + elementName + '" type="password" value="' + elementName + '"/>');
                        self._setFocusNotIE();
                        break;
                    case cmd_dropdownlist:
                        elementName = self._generateUniqueName('dropdown');
                        self.insertHTML('<select id="' + elementName + '" name="' + elementName + '"></select>');
                        self._setFocusNotIE();
                        break;
                    case cmd_hiddenfield:
                        elementName = self._generateUniqueName('hidden');
                        self.insertHTML('<input id="' + elementName + '" name="' + elementName + '" type="hidden" value="' + elementName + '" />');
                        self._setFocusNotIE();
                        break;
                    case cmd_radio:
                        elementName = self._generateUniqueName('radiobox');
                        self.insertHTML('<input id="' + elementName + '" name="' + elementName + '" type="radio"' + ' value="' + elementName + '">' + '<label for="' + elementName + '">' + elementName + '</label></input>');
                        self._setFocusNotIE();
                        break;
                    case cmd_checkbox:
                        elementName = self._generateUniqueName('checkbox');
                        self.insertHTML('<input id="' + elementName + '" name="' + elementName + '" type="checkbox"' + ' value="' + elementName + '">' + '<label for="' + elementName + '">' + elementName + '</label></input>');
                        self._setFocusNotIE();
                        break;
                    case cmd_insertcolumn:
                    case cmd_insertrow:
                    case cmd_insertcell:
                    case cmd_splitcell:
                    case cmd_mergecell:
                    case cmd_removecolumn:
                    case cmd_removerow:
                    case cmd_removecell:
                        self._tableAction(cmd);
                        break;
                    case cmd_borders:
                        self._toggleTableBorders();
                        break;
                    case cmd_subscript:
                        try  {
                            if (doc.queryCommandState(cmd_superscript)) {
                                doc.execCommand(cmd_superscript, false, null);
                                self.$ribbon.wijribbon(setButtonChecked, cmd_superscript, false);
                            }
                        } catch (e) {
                        }
                        doc.execCommand(cmd_subscript, false, null);
                        self._addtoUndoBuffer();
                        self._setFocusNotIE();
                        break;
                    case cmd_superscript:
                        try  {
                            if (doc.queryCommandState(cmd_subscript)) {
                                doc.execCommand(cmd_subscript, false, null);
                                self.$ribbon.wijribbon(setButtonChecked, cmd_subscript, false);
                            }
                        } catch (e1) {
                        }
                        doc.execCommand(cmd_superscript, false, null);
                        self._addtoUndoBuffer();
                        self._setFocusNotIE();
                        break;
                    case cmd_removeformat:
                        //doc.execCommand(cmd_removeformat, false, null);
                        self._removeFormat();
                        self._setFocusNotIE();
                        break;
                    case cmd_insertbreak:
                        self.insertHTML("<br/>");
                        self._setFocusNotIE();
                        break;
                    case cmd_insertparagraph:
                        selectedHtml = self._getSelectedContent();

                        if (!selectedHtml || selectedHtml === "") {
                            selectedHtml = "&nbsp;";
                        }

                        self.insertHTML('<p>' + selectedHtml + '</p>');
                        self._setFocusNotIE();
                        break;
                    case cmd_insertprintbreak:
                        self.insertHTML('<div title="Print Page Break" ' + 'style="font-size:1px;page-break-before:always;' + 'vertical-align:middle;height:1px;' + 'background-color:#c0c0c0">&nbsp;</div>');
                        self._setFocusNotIE();
                        break;
                    case cmd_fullscreen:
                        self._storeSelectionForIE();
                        self._toggleFullScreen();
                        break;
                    case cmd_undo:
                        self._undoAction();
                        self._setFocusNotIE();
                        break;
                    case cmd_redo:
                        self._redoAction();
                        self._setFocusNotIE();
                        break;
                    case cmd_cut:
                        self._execCut();
                        self._setFocusNotIE();
                        break;
                    case cmd_copy:
                        self._execCopy();
                        break;
                    case cmd_paste:
                        self._execPaste();
                        break;
                    case cmd_date:
                        self.insertDateAndTime();
                        self._setFocusNotIE();
                        break;
                    case cmd_designview:
                        if (self.$modes.data("wijmo-wijribbon")) {
                            self.$modes.wijribbon(setButtonDisabled, cmd_wordwrap, true).wijribbon(setButtonChecked, cmd_designview, true);
                        }
                        self.$ribbon.wijribbon("option", "disabled", false);

                        //TODO:maybe need to add the code block
                        //update for bbcode
                        //if (self.options.mode === "bbcode") {
                        //self._onSourceViewBlur();
                        //}
                        //end for update
                        content.wijsplitter("option", "panel2", {
                            collapsed: true
                        });
                        self._restoreSelectionForIE();
                        break;
                    case cmd_splitview:
                        if (self.$modes.data("wijmo-wijribbon")) {
                            self.$modes.wijribbon(setButtonDisabled, cmd_wordwrap, true).wijribbon(setButtonChecked, cmd_splitview, true);
                        }

                        self.$ribbon.wijribbon("option", "disabled", false);
                        content.wijsplitter("option", {
                            splitterDistance: distance,
                            panel1: { collapsed: false },
                            panel2: { collapsed: false }
                        });
                        self._restoreSelectionForIE();
                        break;
                    case cmd_sourceview:
                        if (self.$modes.data("wijmo-wijribbon")) {
                            self.$modes.wijribbon(setButtonDisabled, cmd_wordwrap, false).wijribbon(setButtonChecked, cmd_sourceview, true);
                        }
                        self._storeSelectionForIE();
                        self.$ribbon.wijribbon("option", "disabled", true);

                        //TODO:maybe need to add the code block
                        //update for bbcode
                        //if (self.options.mode === "bbcode") {
                        //self._onDesignViewBlur();
                        //}
                        //end for update
                        content.wijsplitter("option", "panel1", {
                            collapsed: true
                        });
                        if ($.browser.msie && !disabled) {
                            self.sourceView.focus();
                        }
                        break;
                    case cmd_wordwrap:
                        if (content.wijsplitter("option", "panel1").collapsed) {
                            self._toggleWordWrap();
                        }
                        break;
                    case cmd_backcolor:
                        self._saveSelectionForIE();
                        self._createDialog(this.localizeString("backColorDialogTitle", "Set BackColor"), self._getDialogRes_BackColor(), self.initBackColorDialog);
                        break;
                    case cmd_fontcolor:
                        self._saveSelectionForIE();
                        self._createDialog(this.localizeString("foreColorDialogTitle", "Set ForeColor"), self._getDialogRes_ForeColor(), self.initForeColorDialog);
                        break;
                    case cmd_inserttable:
                        self._saveSelectionForIE();
                        self._createDialog(this.localizeString("insertTableDialogTitle", "Insert Table"), self._getDialogRes_Table(), self.initInsertTableDialog);
                        break;
                    case cmd_edittable:
                        if (self._getEditableTable()) {
                            self._createDialog(this.localizeString("editTableDialogTitle", "Edit Table"), self._getDialogRes_Table(), self.initEditTableDialog);
                        }
                        break;
                    case cmd_preview:
                        self._createDialog(this.localizeString("previewDialogPreview", "Preview"), self._getDialogRes_Preview(), self.initPreviewDialog);
                        break;
                    case cmd_cleanup:
                        self._createDialog(this.localizeString("cleanUpDialogTitle", "Clean up source HTML document"), self._getDialogRes_CleanUp(), self.initCleanUpDialog);
                        break;
                    case cmd_media:
                        self._saveSelectionForIE();
                        self._createDialog(this.localizeString("mediaDialogTitle", "Insert media"), self._getDialogRes_Media(), self.initMediaDialog);
                        break;
                    case cmd_specialchar:
                        self._saveSelectionForIE();
                        self._createDialog(this.localizeString("specialCharacterDialogTitle", "Insert special character"), self._getDialogRes_SpecialCharacter(), self.initSpecialCharacterDialog);
                        break;
                    case cmd_find:
                        self._createDialog(this.localizeString("findAndReplaceDialogTitle", "Find and replace"), self._getDialogRes_FindAndReplace(), self.initFindDialog);
                        break;
                    case cmd_inspect:
                        inspectElement = self._getSelectedElement();

                        self._createDialog(this.localizeString("tagInspectorDialogTitle", "Tag Inspector"), self._getDialogRes_TagInspector(), self.initTagInspectorDialog);
                        break;
                    case cmd_template:
                        self._saveSelectionForIE();
                        self._createDialog(this.localizeString("templateDialogApplyTemplate", "Apply Template"), self._getDialogRes_Template(), self.initTemplateDialog);
                        break;
                    case cmd_imagebrowser:
                        self._saveSelectionForIE();
                        self._createDialog(this.localizeString("imageEditorDialogImageBrowser", "Image Browser"), self._getDialogRes_ImageBrowser(), self.initImageBrowserDialog);
                        break;
                    case cmd_link:
                        self._storeSelectionForIE();
                        self._createDialog(this.localizeString("hyperLinkDialogInserthyperLink", "Insert hyperLink"), self._getDialogRes_Link(), self.initHyperLinkDialog);
                        break;
                    case cmd_insertcode:
                        self._saveSelectionForIE();
                        self._createDialog(this.localizeString("insertCodeDialogInsertCode", "Insert Code"), self._getDialogRes_Code(), self.initInsertCodeDialog);
                        break;
                    case cmd_alignleft:
                    case cmd_aligncenter:
                    case cmd_alignright:
                    case cmd_alignfull:
                    case cmd_outdent:
                    case cmd_indent:
                    case cmd_bold:
                    case cmd_italic:
                    case cmd_underline:
                    case cmd_numberedlist:
                    case cmd_bulletedlist:
                    case cmd_strike:
                    case cmd_inserthr:
                    case cmd_selectall:
                        doc.execCommand(cmd, false, null);
                        if (self.options.mode === "bbcode" && !($.browser.msie)) {
                            //convert style="font-weight: bold;
                            //font-style: italic; text-decoration: underline;"
                            //same as ie
                            self._convertStyleToStandTag();
                        }
                        self._addtoUndoBuffer();
                        self._setFocusNotIE();
                        break;
                    case cmd_save:
                        self._saveText();
                        break;
                    case cmd_spelling:
                        self._doSpellCheck();
                        break;
                }

                // If document is not load complete, we can't get the design view codes.
                if (cmd !== cmd_fullscreen && doc && doc.readyState === "complete") {
                    self._onDesignViewBlur(null);
                }
            };

            //added by Ryanwu@20110512.
            wijeditor.prototype._createDialog = function (title, content, callback) {
                var self = this, dialogOpts, $dlg = self.dialog;

                $dlg.html("").undelegate(self.widgetName).undelegate("." + self.widgetName).append(content);
                if (self.subDialog) {
                    self.subDialog.html("").undelegate(self.widgetName).undelegate("." + self.widgetName);
                }

                dialogOpts = {
                    width: "auto",
                    height: "auto",
                    modal: true,
                    title: title,
                    position: { my: "center", at: "center", of: window },
                    resizable: false,
                    captionButtons: {
                        pin: { visible: false },
                        refresh: { visible: false },
                        toggle: { visible: false },
                        minimize: { visible: false },
                        maximize: { visible: false }
                    }
                };
                if (!$dlg.data("wijmo-wijdialog")) {
                    if ($.browser.msie && wijParseInt($.browser.version) === 6) {
                        window.setTimeout(function () {
                            $dlg.wijdialog(dialogOpts);
                        }, 0);
                    } else {
                        $dlg.wijdialog(dialogOpts);
                    }
                } else {
                    $dlg.wijdialog("reset");
                    $dlg.wijdialog("option", {
                        width: "auto",
                        height: "auto",
                        title: title
                    });
                }

                self._adjustDialogLayoutForIE7();

                if (callback) {
                    callback.call(self);
                }

                $dlg.wijdialog("open");
            };

            wijeditor.prototype._adjustDialogLayoutForIE7 = function () {
                var $dlg = this.dialog;

                if ($.browser.msie && (/^7\.[0-9]+/.test($.browser.version) || document.documentMode === 7)) {
                    $dlg.wijdialog('option', 'width', $dlg.parent().width());
                }
            };

            wijeditor.prototype._contextMenuItemClick = function (e, item, sender) {
                var self = this, cmd = item.item.element.attr("_c1buttoncmd");

                switch (cmd) {
                    case cmd_cut:
                        self._execCut();
                        break;
                    case cmd_copy:
                        self._execCopy();
                        break;
                    case cmd_paste:
                        self.focus();
                        self._execPaste();
                        break;
                }
            };

            wijeditor.prototype._execCut = function () {
                var self = this, doc = self._getDesignViewDocument();

                if ($.browser.safari) {
                    wijAlert(this.localizeString("errorMessageCutError", "This function is not supported in current browser.  Plesse use (Ctrl + X)."));
                } else if ($.browser.msie) {
                    doc.execCommand("Cut", false, null);
                    self._addtoUndoBuffer();
                } else {
                    self._execCopy();
                    self._deleteSelectionContent();
                    self._addtoUndoBuffer();
                }
            };

            wijeditor.prototype._execCopy = function () {
                var self = this, doc = self._getDesignViewDocument();

                if ($.browser.safari) {
                    wijAlert(this.localizeString("errorMessageCopyError", "This function is not supported in current browser. Plesse use (Ctrl + C)."));
                } else if ($.browser.msie) {
                    doc.execCommand("Copy", false, null);
                    self._addtoUndoBuffer();
                } else {
                    self._copyToClipboard(self._getSelectedContent());
                }
            };

            wijeditor.prototype._execPaste = function () {
                var self = this, copiedText, doc = self._getDesignViewDocument();

                if ($.browser.safari) {
                    wijAlert(this.localizeString("errorMessagePasteError", "This function is not supported in current browser. Plesse use (Ctrl + V)."));
                } else if ($.browser.msie) {
                    doc.execCommand("Paste", false, null);
                    self._addtoUndoBuffer();
                } else {
                    try  {
                        copiedText = self._copyFromClipboard();

                        if (copiedText && copiedText !== '') {
                            self.insertHTML(copiedText);
                        }
                    } catch (e1) {
                    }
                }
            };

            wijeditor.prototype._getFontSizeCollection = function () {
                return {
                    '10px': cmd_verysmall,
                    '13px': cmd_smaller,
                    '16px': cmd_small,
                    '18px': cmd_medium,
                    '24px': cmd_large,
                    '32px': cmd_larger,
                    '48px': cmd_verylarge,
                    1: cmd_verysmall,
                    2: cmd_smaller,
                    3: cmd_small,
                    4: cmd_medium,
                    5: cmd_large,
                    6: cmd_larger,
                    7: cmd_verylarge
                };
            };

            wijeditor.prototype._updateButtonStates = function (e) {
                var self = this, doc = self._getDesignViewDocument(), rawValue, cmd, buttonStates = {}, stateButtons = [
                    cmd_bold, cmd_italic, cmd_strike,
                    cmd_underline, cmd_subscript, cmd_superscript,
                    cmd_numberedlist, cmd_bulletedlist, cmd_alignleft,
                    cmd_aligncenter, cmd_alignright, cmd_alignfull], $fontSizeSpans, target = e.target, $target = $(target);

                $.each(stateButtons, function (idx, btnKey) {
                    buttonStates[btnKey] = doc.queryCommandState(btnKey);
                });

                self.$ribbon.wijribbon(setButtonsChecked, buttonStates);

                rawValue = self._queryCommandValue(cmd_fontname) || "";

                $.each(self.$ribbon.wijribbon("getDropdownList", cmd_fontname), function (key, value) {
                    if (value.toUpperCase() === rawValue.toUpperCase()) {
                        cmd = key;
                        return false;
                    }
                });

                self.$ribbon.wijribbon(setButtonChecked, cmd, true, cmd_fontname);

                //Add comments by RyanWu@20110923.
                //For implementing the font size customization.
                if (self._isFontSizeCustomized()) {
                    if ($target.is("span")) {
                        cmd = target.style.fontSize;
                    } else {
                        cmd = "";
                    }

                    if (cmd === "") {
                        $fontSizeSpans = $target.parents("span." + css_formatspan);

                        $.each($fontSizeSpans, function (idx, fontSizeSpan) {
                            cmd = fontSizeSpan.style.fontSize;

                            if (cmd && cmd !== "") {
                                return false;
                            }
                        });
                    }

                    if (cmd === "") {
                        cmd = $target.css("font-size");
                    }
                } else {
                    rawValue = self._queryCommandValue(cmd_fontsize) || "";

                    if (rawValue === "") {
                        rawValue = $target.css("font-size");
                    }

                    $.each(self._getFontSizeCollection(), function (key, value) {
                        if (key.toString() === rawValue.toString()) {
                            cmd = value;
                            return false;
                        }
                    });
                }

                //end by RyanWu@20110923.
                self.$ribbon.wijribbon(setButtonChecked, cmd, true, cmd_fontsize);
            };

            wijeditor.prototype._queryCommandValue = function (commandName) {
                var doc = this._getDesignViewDocument();

                try  {
                    if (!doc.queryCommandEnabled(commandName)) {
                        return null;
                    }
                } catch (e1) {
                    return null;
                }

                try  {
                    return doc.queryCommandValue(commandName);
                } catch (e2) {
                }

                return null;
            };

            wijeditor.prototype._escActionAssociated = function () {
                var self = this, win = self._getDesignViewWindow();

                if (win && win.document && win.document.selection !== undefined) {
                    win.document.selection.empty();
                }

                if (win && win.getSelection !== undefined) {
                    win.getSelection().removeAllRanges();
                }

                self._hideAllDropdownsMenus();
            };

            wijeditor.prototype._hideAllDropdownsMenus = function () {
                var self = this;
                if (self.contextMenu) {
                    self.contextMenu[self._contextMenuWidgetName()]("hideAllMenus");
                }

                self.$ribbon.wijribbon("hideDropdown", cmd_fontname).wijribbon("hideDropdown", cmd_fontsize).wijribbon("hideDropdown", cmd_table);
            };

            wijeditor.prototype._onDesignViewKeyDown = function (e) {
                var self = this, ch;

                self._setSaveBtnEnabled();

                try  {
                    if (e.ctrlKey) {
                        ch = String.fromCharCode(e.keyCode).toLowerCase();
                        //				switch (ch) {
                        //					case 'x':
                        //					case 'v':
                        //						self._addtoUndoBuffer();
                        //						break;
                        //				}
                    } else {
                        switch (e.keyCode) {
                            case 27:
                                self._escActionAssociated();
                                break;
                            case 13:
                            case 46:
                                self._addtoUndoBuffer();
                                self._continueSavingInputTextForUndo = false;
                                break;
                            default:
                                self._continueSavingInputTextForUndo = true;
                                break;
                        }
                    }
                } catch (e1) {
                }
            };

            wijeditor.prototype._onDesignViewKeyUp = function (e) {
                var self = this, ch;

                if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 33 || e.keyCode === 34 || e.keyCode === 35 || e.keyCode === 36) {
                    if ($.browser.msie && $.browser.version === "6.0") {
                        if (self._keyTimeoutHandlerIE6) {
                            clearTimeout(self._keyTimeoutHandlerIE6);
                            self._keyTimeoutHandlerIE6 = null;
                        }

                        self._keyTimeoutHandlerIE6 = window.setTimeout(function () {
                            self._updateButtonStates(e);
                        }, 300);
                    } else {
                        self._updateButtonStates(e);
                    }
                }

                if (e.ctrlKey) {
                    ch = String.fromCharCode(e.keyCode).toLowerCase();

                    switch (ch) {
                        case 'y':
                            self._redoAction();
                            e.preventDefault();
                            e.stopPropagation();
                            break;
                        case 'z':
                            self._undoAction();
                            e.preventDefault();
                            e.stopPropagation();
                            break;
                        case 'x':
                        case 'v':
                            self._addtoUndoBuffer();
                            self._continueSavingInputTextForUndo = false;
                            break;
                    }
                }
            };

            wijeditor.prototype._onDesignViewMouseUp = function (e) {
                var self = this, $link;

                if (e.button === 2) {
                    return;
                }

                self._updateButtonStates(e);
                if (self.options.showPathSelector) {
                    self._refreshPathSelector();
                }

                //Note: recover the code by wuhao at 2011/9/14, when dropdown is open
                //click the design view, the dropdown don't close
                self._hideAllDropdownsMenus();
                self.editor.mouseup();

                if ($.browser.msie) {
                    $link = $(e.target).closest("a");

                    if (e.ctrlKey && $link.length > 0) {
                        try  {
                            $link.focus();
                            wijWindow.open($link[0].href, '_blank');
                        } catch (e1) {
                        }
                    }
                }
            };

            wijeditor.prototype._onDesignViewBlur = function (e) {
                var self = this, o = self.options, sourceView;
                sourceView = self._getDesignViewText();

                if (o.mode === "bbcode") {
                    //Note: trim leading/trailing whitespace
                    //because when get the innerhtml from body, there
                    //are some whitespace on leading/trailing
                    sourceView = self._convertHtmlToBBCode($.trim(sourceView));
                }
                self.sourceView.val(sourceView);

                self._onTextChange(e);
                o.text = sourceView;
            };

            wijeditor.prototype._onTextChange = function (e) {
                var self = this;
                if (self._continueSavingInputTextForUndo) {
                    self._addtoUndoBuffer();
                    self._continueSavingInputTextForUndo = false;
                }
                self._trigger('textChanged', e, { text: self.options.text });
            };

            wijeditor.prototype._onSourceViewBlur = function () {
                var self = this, designViewText;

                designViewText = self.sourceView.val();

                self._setDesignViewText(designViewText);

                self.options.text = designViewText;
            };

            //bbcode implement
            wijeditor.prototype._convertBBCodeToHtml = function (data) {
                if (!data) {
                    return "";
                }

                // Convert < and > to their HTML entities.
                data = data.replace(/</g, '&lt;');
                data = data.replace(/>/g, '&gt;');

                //note: can't asure  there is no problem.
                //data = data.replace(/ /g, '&nbsp;');
                // In IE, recover "&lt;p&gt;""&lt;/p&gt;" to <p></p>.
                if ($.browser.msie) {
                    data = data.replace(/&lt;p&gt;/gim, '<p>');
                    data = data.replace(/&lt;\/p&gt;/gim, '</p>');
                }

                // Convert line breaks to <br>.
                data = data.replace(/(?:\r\n|\n|\r)/g, '<br>');

                //[email]
                data = data.replace(/\[EMAIL\]([\s\S]*?)\[\/EMAIL\]/gim, '<a href="mailto:$1">$1</a>');
                data = data.replace(/\[EMAIL\=([^\]]+)]([\s\S]*?)\[\/EMAIL\]/gim, '<a href="mailto:$1">$2</a>');

                // [url]
                data = data.replace(/\[URL\]([\s\S]*?)\[\/URL\]/gim, '<a href="$1">$1</a>');
                data = data.replace(/\[URL\=([^\]]+)]([\s\S]*?)\[\/URL\]/gim, '<a href="$1">$2</a>');

                // [b]
                data = data.replace(/\[B\]/gim, '<b>');
                data = data.replace(/\[\/B\]/gim, '</b>');

                // [i]
                data = data.replace(/\[I\]/gim, '<i>');
                data = data.replace(/\[\/I\]/gim, '</i>');

                // [s]
                data = data.replace(/\[S\]/gim, '<strike>');
                data = data.replace(/\[\/S\]/gim, '</strike>');

                // [u]
                data = data.replace(/\[U\]/gim, '<u>');
                data = data.replace(/\[\/U\]/gim, '</u>');

                // [IMG]  [^<>]*
                data = data.replace(/\[IMG height=(.*?) width=(.*?)](.+?)\[\/IMG\]/gim, '<img height="$1" width = "$2" src="$3"/>');

                //[BLOCK]
                data = data.replace(/\[BLOCK\]/gim, '<blockquote>');
                data = data.replace(/\[\/BLOCK\]/gim, '</blockquote>');

                // Ordered List [OL]
                data = data.replace(/\[LIST\=1\]\[\*\]([\s\S]*?)\[\/LIST\]/gim, '<ol><li>$1</li></ol>');

                // Unordered List [UL]
                data = data.replace(/\[LIST\]\[\*\]([\s\S]*?)\[\/LIST\]/gim, '<ul><li>$1</li></ul>');

                //LI
                data = data.replace(/\[\*\]/gim, '</li><li>');

                // [SIZE]
                //			data = data.replace(/\[size=([^\]]*?)\]/gi,
                //					"<span style=\"font-size: $1;\">");
                //			data = data.replace(/\[\/size\]/gim, '</span>');
                data = data.replace(/\[size=([^\]]*?)\]/gi, "<font size=\"$1\">");
                data = data.replace(/\[\/size\]/gim, '</font>');

                // [COLOR]
                data = data.replace(/\[color=([^\]]*?)\]/gi, "<font color=\"$1\">");
                data = data.replace(/\[\/color\]/gim, '</font>');

                return data;
            };

            wijeditor.prototype._replaceComplexHtml = function (data) {
                var imgs, fonts, replaceHtml, i, root = $("<div/>").html(data);

                //img
                imgs = $("img", root);
                $.each(imgs, function () {
                    replaceHtml = '[IMG height=' + $(this).height() + ' width=' + $(this).width() + ']' + $(this).attr("src").toString() + '[/IMG]';
                    $(this).replaceWith(replaceHtml);
                });

                //font
                fonts = $("font", root);

                for (i = fonts.length - 1; i >= 0; i--) {
                    if ($(fonts[i]).attr("color") && $($(fonts[i])).attr("size")) {
                        replaceHtml = '[Color=' + $($(fonts[i])).attr("color") + ']' + '[Size=' + $($(fonts[i])).attr("size") + ']' + $($(fonts[i])).html() + '[/Size][/Color]';
                    } else if ($($(fonts[i])).attr("color") && !$($(fonts[i])).attr("size")) {
                        replaceHtml = '[Color=' + $($(fonts[i])).attr("color") + '] ' + $($(fonts[i])).html() + '[/Color]';
                    } else if ($($(fonts[i])).attr("size") && !$($(fonts[i])).attr("color")) {
                        replaceHtml = '[Size=' + $($(fonts[i])).attr("size") + ']' + $($(fonts[i])).html() + '[/Size]';
                    }
                    $($(fonts[i])).replaceWith(replaceHtml);
                }

                return root.html();
            };

            wijeditor.prototype._convertHtmlToBBCode = function (data) {
                var self = this;

                if (data === "") {
                    return;
                }
                data = self._replaceComplexHtml(data);

                // Convert <br> to line breaks.
                data = data.replace(/<br(?=[ \/>]).*?>/gim, '\r\n');

                // In IE, convert <p></p> to "&lt;p&gt;""&lt;/p&gt;" to prevent from being deleted.
                if ($.browser.msie) {
                    data = data.replace(/<p>/gim, '&lt;p&gt;');
                    data = data.replace(/<\/p>/gim, '&lt;/p&gt;');
                }

                // [URL]
                data = data.replace(/<a .*?href=(["'])(.+?)\1.*?>(.+?)<\/a>/gi, '[URL=$2]$3[/URL]');

                // [Email]
                data = data.replace(/<a .*?href=(["'])mailto:(.+?)\1.*?>(.+?)<\/a>/gi, '[EMAIL=$2]$3[/EMAIL]');

                // [B]
                data = data.replace(/<(?:b|strong)>/gim, '[B]');
                data = data.replace(/<\/(?:b|strong)>/gim, '[/B]');

                // [I]
                data = data.replace(/<(?:i|em)>/gim, '[I]');
                data = data.replace(/<\/(?:i|em)>/gim, '[/I]');

                // [strike]
                data = data.replace(/<(?:strike|s)>/gim, '[S]');
                data = data.replace(/<\/(?:strike|s)>/gim, '[/S]');

                // [U]
                data = data.replace(/<u>/gim, '[U]');
                data = data.replace(/<\/u>/gim, '[/U]');

                // [IMG]
                //data = data.replace(/<img\s{1}.*?src\s{0,1}=\s{0,1}["'](.+?)["'].*/gim,
                //		'[IMG="$1"][/IMG]');
                //data = data.replace(/<img\s{1}([^>]*)src\s{0,1}=\s{0,1}["'](.+?)["']([^>]*)>/gim,
                //	'[IMG $1$3]$2[/IMG]');
                // [BLOCK]
                data = data.replace(/<blockquote.*?\>/gim, '[BLOCK]');
                data = data.replace(/\s{0,}<\/blockquote>/gim, '[/BLOCK]');

                // Ordered List [OL]
                data = data.replace(/(?:\r\n|\r|\n){0,1}<(?:ol)>[\s]*/gim, '[LIST=1]');
                data = data.replace(/<\/(?:ol)>/gim, '[/LIST]');

                // Unordered List [UL]
                //\r\n<ul> must convert to ul
                data = data.replace(/(?:\r\n|\r|\n){0,1}\<(?:ul)>[\s]*/gim, '[LIST]');
                data = data.replace(/<\/(?:ul)>/gim, '[/LIST]');

                // [LI]
                data = data.replace(/\s{0,}<li\s{0,1}.*?>([\s\S]*?)\n{0,}\s{0,}<\/li>/gim, '[*]$1');

                //space convert
                data = data.replace(/&nbsp;/gi, " ");

                // Remove remaining tags.
                data = data.replace(/(<[^>]+>)/gm, '');

                return data;
            };

            wijeditor.prototype._convertFontStyleToStandTag = function () {
                var self = this, doc = self._getDesignViewDocument(), $designviewBody = $(doc.body), currentNode, bbcodeMark, colorTag = $("[style*='color: ']", $designviewBody);

                if (colorTag.length !== 0) {
                    currentNode = colorTag;
                    bbcodeMark = "<font color='" + self._getWebColorFromRgb(colorTag.css("color")) + "'></font>";
                }

                if (currentNode) {
                    $.each(currentNode, function (i) {
                        //there is no attribute in span,
                        //like <span style="color:#123">xxx</b>
                        //must replace span with new tag
                        //like <b>XXX</b>
                        if ($(this).is("span")) {
                            $(this).replaceWith($(bbcodeMark).html($(this).html()));
                        } else if ($(this).is("font") && $(this).attr("size")) {
                            //note: there are other attribute in span
                            //like <span style="font-size:15px, color=#123">XXX</b>
                            // so insert new tag in span content
                            //like <span style="font-size:15px><b>XXX</b></span>
                            //maybe there is no need here
                            //$(this).css("color", undefined)
                            //$(this).removeAttr("style")
                            //    .html($(bbcodeMark).html($(this).html()));
                            $(this).removeAttr("style").html($(bbcodeMark).html());
                        }
                    });
                }
            };

            wijeditor.prototype._convertStyleToStandTag = function () {
                var self = this, doc = self._getDesignViewDocument(), $designviewBody = $(doc.body), currentNode, bbcodeMark, currentAttr, boldTag = $("[style*='font-weight: bold;']", $designviewBody), italicTag = $("[style*='font-style: italic;']", $designviewBody), strikeTag = $("[style*='text-decoration: line-through;']", $designviewBody), underlineTag = $("[style*='text-decoration: underline;']", $designviewBody);

                if (boldTag.length !== 0) {
                    currentNode = boldTag;
                    bbcodeMark = "<b></b>";
                    currentAttr = "font-weight";
                } else if (italicTag.length !== 0) {
                    currentNode = italicTag;
                    bbcodeMark = "<i></i>";
                    currentAttr = "font-style";
                } else if (strikeTag.length !== 0) {
                    currentNode = strikeTag;
                    bbcodeMark = "<strike></strikes>";
                    currentAttr = "text-decoration";
                } else if (underlineTag.length !== 0) {
                    currentNode = underlineTag;
                    bbcodeMark = "<u></u>";
                    currentAttr = "text-decoration";
                }

                if (currentNode) {
                    $.each(currentNode, function (i) {
                        //there is no attribute in span,
                        //like <span style="color:#123">xxx</b>
                        //must replace span with new tag
                        //like <b>XXX</b>
                        if ($(this).is("span") && this.style.fontSize === "") {
                            $(this).replaceWith($(bbcodeMark).html($(this).html()));
                        } else {
                            //note: there are other attribute in span
                            //like <span style="font-size:15px, color=#123">XXX</b>
                            // so insert new tag in span content
                            //like <span style="font-size:15px><b>XXX</b></span>
                            //maybe there is no need here
                            $(this).removeAttr("style").html($(bbcodeMark).html());
                        }
                    });
                }
            };

            wijeditor.prototype._getWebColorFromRgb = function (rgbColor) {
                var self = this, rgbColorItems;

                if (rgbColor.indexOf('rgb(') === 0) {
                    rgbColorItems = rgbColor.substring(4, rgbColor.length - 1).split(',');
                    rgbColor = self._convertToWebColor(wijParseInt(rgbColorItems[0]), wijParseInt(rgbColorItems[1]), wijParseInt(rgbColorItems[2]));
                }
                return rgbColor;
            };

            //end bbcode
            //common for dialogs.
            wijeditor.prototype._updateList = function (list, $select) {
                var name;

                $("option", $select).remove();

                for (name in list) {
                    if (list[name]) {
                        $select.append("<option>" + name + "</option>");
                    }
                }
            };

            wijeditor.prototype._triggerEvent = function (evName, arg) {
                var self = this, ev = self.options[evName];

                if (ev && typeof (ev) === "function") {
                    return ev.call(self, arg);
                }

                return ev;
            };

            wijeditor.prototype._closeDialog = function () {
                this.dialog.wijdialog("close");
                this.rangeSelection = null;
                this.focus();
            };

            //end of common dialogs.
            //begin to handle the template dialog.
            wijeditor.prototype._onTemplateList = function (arg) {
                return this._triggerEvent("templateList", arg);
            };

            /** @ignore */
            wijeditor.prototype.updateTemplateList = function (templateList, select) {
                var self = this, $select = select || $("select", self.dialog);

                self._updateList(templateList, $select);
                self._templateList = templateList;
            };

            /** @ignore */
            wijeditor.prototype.initTemplateDialog = function () {
                var self = this, $dlg = self.dialog, tplList = $("select", $dlg), templateList = self._onTemplateList();

                $dlg.delegate("select", "change." + self.widgetName, function () {
                    self.templateListOnChanged();
                }).delegate("." + css_tpl_delete, "click." + self.widgetName, function () {
                    self.deleteTemplate();
                }).delegate("." + css_tpl_save, "click." + self.widgetName, function () {
                    self.saveTemplate();
                }).delegate(selector_dlg_ok, "click." + self.widgetName, function () {
                    self.applyTemplate();
                }).delegate(selector_dlg_cancel, "click." + self.widgetName, function () {
                    self._closeDialog();
                });

                if (!templateList) {
                    templateList = self._templateList;

                    if (!templateList) {
                        return;
                    }
                }

                self.updateTemplateList(templateList, tplList);
            };

            /** @ignore */
            wijeditor.prototype.templateListOnChanged = function () {
                var self = this, $dlg = self.dialog, selectedTpl = $("select", $dlg).val(), preview = $('iframe', $dlg), templateList = self._templateList, template;

                if (!templateList) {
                    return;
                }

                template = templateList[selectedTpl];

                if (template.src) {
                    preview.attr("src", template.src + '?d=' + new Date().getMilliseconds().toString());
                }

                if (template.text && preview.length > 0) {
                    preview[0].contentWindow.document.write(template.text);
                }

                if (selectedTpl) {
                    $("." + css_tpl_nameinfo, $dlg).html(selectedTpl);
                    $("." + css_tpl_namefield, $dlg).val(selectedTpl);
                }

                if (template.desc) {
                    $("." + css_tpl_desinfo, $dlg).html(template.desc);
                    $("." + css_tpl_desfield, $dlg).val(template.desc);
                }
            };

            wijeditor.prototype._onSaveTemplate = function (arg) {
                this._triggerEvent("saveTemplate", arg);
            };

            /** @ignore */
            wijeditor.prototype.saveTemplate = function () {
                var self = this, $dlg = self.dialog, name = $("." + css_tpl_namefield, $dlg).val(), desc = $("." + css_tpl_desfield, $dlg).val(), templateList = self._templateList, text = this._getDesignViewText();

                if ($.trim(name) === '') {
                    wijAlert(this.localizeString("errorMessageTemplateNameError", "Please input a template name!"));
                    return;
                }

                if (!templateList) {
                    self._templateList = [];
                    templateList = self._templateList;
                }

                if (!templateList[name]) {
                    $("select", $dlg).append("<option>" + name + "</option>");
                }

                templateList[name] = { desc: desc, text: text };
                self._onSaveTemplate({ name: name, desc: desc, text: text });
            };

            wijeditor.prototype._onDeleteTemplate = function (arg) {
                this._triggerEvent("deleteTemplate", arg);
            };

            /** @ignore */
            wijeditor.prototype.deleteTemplate = function () {
                var self = this, $dlg = self.dialog, tplList = $("select", $dlg), selectedTpl = tplList.val(), templateList = self._templateList;

                if ($.trim(selectedTpl) === '') {
                    wijAlert(this.localizeString("errorMessageTemplateFileError", "Please select a template file."));
                    return;
                }

                $("option:selected", tplList).remove();
                $('iframe', $dlg).attr("src", "about:blank");
                $("." + css_tpl_nameinfo, $dlg).empty();
                $("." + css_tpl_namefield, $dlg).val("");
                $("." + css_tpl_desinfo, $dlg).empty();
                $("." + css_tpl_desfield, $dlg).val("");

                delete templateList[selectedTpl];
                self._onDeleteTemplate(selectedTpl);
            };

            /** @ignore */
            wijeditor.prototype.applyTemplate = function () {
                var self = this, $dlg = self.dialog, tplList = $("select", $dlg), selectedTpl = tplList.val(), preview = $('iframe', $dlg)[0], name = $("." + css_tpl_namefield, $dlg).val(), html = preview.contentWindow.document.body.innerHTML;

                if ($.trim(name) === '' || $.trim(selectedTpl) === '') {
                    wijAlert(this.localizeString("errorMessageValidTemplateFileError", "Please select a valid template file."));
                    return;
                }

                self._setDesignViewText(html);
                self._addtoUndoBuffer();
                self._setSaveBtnEnabled();

                self._closeDialog();
            };

            //begin to handle the image dialog.
            wijeditor.prototype._onImageList = function () {
                var self = this, imageList = self.options.imageList;

                if (imageList && typeof (imageList) === "function") {
                    return imageList.call(self);
                }

                return imageList;
            };

            /** @ignore */
            wijeditor.prototype.updateImageList = function (imgList, select) {
                var self = this, $dlg = self.dialog, $select = select || $("select", $dlg), $imgfields = $("." + css_imgdlg_field, $dlg);

                self._updateList(imgList, $select);
                self._imgList = imgList;

                if (!imgList) {
                    $imgfields.addClass(css_imgdlg_hideimglist);
                    return;
                }

                $imgfields.removeClass(css_imgdlg_hideimglist);
            };

            /** @ignore */
            wijeditor.prototype.initImageBrowserDialog = function () {
                var self = this, $dlg = self.dialog, imgList = self._onImageList();

                $("img", $dlg).hide();

                $dlg.delegate("select", "change." + self.widgetName, function () {
                    self.imageListOnChanged();
                }).delegate(selector_dlg_ok, "click." + self.widgetName, function (e) {
                    self.submitInsertImageDialog();
                    self._onDesignViewBlur(e);
                }).delegate(selector_dlg_cancel, "click." + self.widgetName, function () {
                    self._closeDialog();
                });

                $("." + css_imgdlg_url + " input", $dlg).bind("change." + self.widgetName, function () {
                    self.imageUrlChanged(this);
                });

                if (!imgList) {
                    imgList = self._imgList;

                    if (!imgList) {
                        $("." + css_imgdlg_field, $dlg).addClass(css_imgdlg_hideimglist);
                        return;
                    }
                }

                self.updateImageList(imgList, $("select", $dlg));
            };

            /** @ignore */
            wijeditor.prototype.imageUrlChanged = function (element) {
                var self = this, $dlg = self.dialog;

                $('img', this.dialog).attr("src", $(element).val() + "?" + new Date().getTime()).show().bind("load", function () {
                    $("." + css_imgdlg_width + " input", $dlg).val($('img', $dlg).width().toString());
                    $("." + css_imgdlg_height + " input", $dlg).val($('img', $dlg).height().toString());
                });
            };

            /** @ignore */
            wijeditor.prototype.imageListOnChanged = function () {
                var self = this, $dlg = self.dialog, selectedImg = $('select', $dlg).val(), imgList = self._imgList, img;

                if (!imgList) {
                    return;
                }

                img = imgList[selectedImg];

                $('img', $dlg).prop("src", img).show();
                $("." + css_imgdlg_url + " input", $dlg).prop("value", img);
                wijWindow.setTimeout(function () {
                    $("." + css_imgdlg_width + " input", $dlg).val($('img', $dlg).width().toString());
                    $("." + css_imgdlg_height + " input", $dlg).val($('img', $dlg).height().toString());
                }, 200);
            };

            /** @ignore */
            wijeditor.prototype.submitInsertImageDialog = function () {
                var self = this, imageHtml, $dlg = self.dialog, imgUrl = $("." + css_imgdlg_url + " input", $dlg).val(), alt = $("." + css_imgdlg_alt + " input", $dlg).val(), width = $("." + css_imgdlg_width + " input", $dlg).val(), height = $("." + css_imgdlg_height + " input", $dlg).val(), css = $("." + css_imgdlg_css + " input", $dlg).val();

                if ($.trim(imgUrl) === "") {
                    wijAlert(this.localizeString("errorMessageSelectImageError", "Please select a image."));
                    return;
                }

                if (!self._isNumeric(width)) {
                    wijAlert(this.localizeString("errorMessageImageWidthError", "Please input a number for 'Image width' textbox."));
                    return;
                }

                if (!self._isNumeric(height)) {
                    wijAlert(this.localizeString("errorMessageImageHeightError", "Please input a number for 'Image height' textbox."));
                    return;
                }

                self.focus();
                if ($.browser.msie) {
                    //for 35039 issue
                    imageHtml = '<img src="' + imgUrl + '" alt="' + alt + '" style="width:' + width + 'px;height:' + height + 'px';
                    if (self.options.mode !== "bbcode" && css !== null && css !== undefined && css.length > 0) {
                        imageHtml += ';' + css;
                    }
                } else {
                    imageHtml = '<img src="' + imgUrl + '" alt="' + alt + '" width="' + width + '" height="' + height;
                    if (self.options.mode !== "bbcode") {
                        imageHtml += '" style="' + css;
                    }
                }
                imageHtml += '"/>';
                self.insertHTML(imageHtml);
                self._closeDialog();
            };

            //begin to handle the link dialog.
            /** @ignore */
            wijeditor.prototype.initHyperLinkDialog = function () {
                var self = this, $dlg = self.dialog, address = self.getLinkHrefField(), $imageContainer = $("." + css_linkdlg_imagecontainer, $dlg), iconTypeIsImg, linkInnerHtml, $img, $iconTypeText = $("." + css_linkdlg_text + " input", $dlg), $address = $("." + css_linkdlg_address + " input", $dlg);

                $dlg.one("wijdialogclose", function () {
                    self._restoreSelectionForIE();
                });

                $dlg.delegate(selector_dlg_ok, "click." + self.widgetName, function (e) {
                    self.submitHyperLinkDialog();
                    self._onDesignViewBlur(e);
                }).delegate(selector_dlg_cancel, "click." + self.widgetName, function () {
                    self._closeDialog();
                }).delegate("." + css_linkdlg_anchor, "change." + self.widgetName, function () {
                    self.anchorListOnChanged(this);
                }).delegate("." + css_linkdlg_linktype + ">div", "click." + self.widgetName, function () {
                    self.radioListOnChanged();
                }).delegate("." + css_linkdlg_linkicontype + ">div", "click." + self.widgetName, function () {
                    self.linkIconTypeOnChanged();
                }).delegate("." + css_linkdlg_url + " input", "change." + self.widgetName, function () {
                    self.tempImg = $('<img src="' + $("." + css_linkdlg_url + " input", $dlg).val() + '">').appendTo("body");
                    wijWindow.setTimeout(function () {
                        $("." + css_linkdlg_width + " input", $dlg).val(self.tempImg.width().toString());
                        $("." + css_linkdlg_height + " input", $dlg).val(self.tempImg.height().toString());
                        self.tempImg.remove();
                        self.tempImg = undefined;
                    }, 200);
                });

                try  {
                    $address.val(address);
                    linkInnerHtml = self._getLinkInnerHTML();
                } catch (e) {
                }

                if (linkInnerHtml && linkInnerHtml.substring(0, 3) === '<img') {
                    iconTypeIsImg = true;
                    $img = $(linkInnerHtml);
                } else {
                    iconTypeIsImg = false;
                }

                if (!iconTypeIsImg) {
                    $iconTypeText.show();
                    $imageContainer.hide();
                    $iconTypeText.val(linkInnerHtml);
                } else {
                    $imageContainer.show();
                    $iconTypeText.hide();
                    $("." + css_linkdlg_url + " input", $dlg).val($img.attr("src"));
                    $("." + css_linkdlg_width + " input", $dlg).val($img.attr("width"));
                    $("." + css_linkdlg_height + " input", $dlg).val($img.attr("heigth"));
                }

                $("." + css_linkdlg_css + " input", $dlg).val(self._getLinkCssField());
                $("." + css_linkdlg_target + " select", $dlg).val(self._getLinkTarget());

                $("#radAnchor", $dlg).prop("checked", true);
                $("#radLinkTypeIsText", $dlg).prop("checked", true);
                if (address.length > 6) {
                    if (address.substring(0, 4) === 'http') {
                        $("#radUrl", $dlg).prop("checked", true);
                    } else if (address.substring(0, 6) === 'mailto') {
                        $("#radMail", $dlg).prop("checked", true);
                    } else {
                        if (address.substring(0, 1) === '#') {
                            $("#radAnchor", $dlg).prop("checked", true);
                        } else {
                            $("#radFile", $dlg).prop("checked", true);
                        }
                    }
                }
                $address.focus();
                $img = undefined;
            };

            wijeditor.prototype._getLinkInnerHTML = function () {
                var self = this, inspElem, tmpElem;

                self.focus();
                inspElem = self._getInspectElement();
                self._hyperlinkTextStyle = "";

                try  {
                    tmpElem = self._getHyperLinkElement(inspElem);
                    if (tmpElem && tmpElem.tagName === 'A') {
                        if (inspElem.innerHTML !== tmpElem.innerHTML) {
                            self._hyperlinkTextStyle = tmpElem.innerHTML.replace(inspElem.innerHTML, "{0}");
                        }
                        return $(inspElem).text();
                    }
                } catch (error) {
                }

                return '';
            };

            /** @ignore */
            wijeditor.prototype.getLinkHrefField = function () {
                var self = this, inspElem;

                self.focus();
                inspElem = self._getInspectElement();

                try  {
                    inspElem = self._getHyperLinkElement(inspElem);
                    if (inspElem && inspElem.tagName === 'A') {
                        return self.fixAbsoluteUrlsIfNeeded(inspElem.href || '');
                    }
                } catch (error) {
                }

                return '';
            };

            wijeditor.prototype._getLinkTarget = function () {
                var self = this, inspElem;

                self.focus();
                inspElem = self._getInspectElement();

                try  {
                    inspElem = self._getHyperLinkElement(inspElem);
                    if (inspElem && inspElem.tagName === 'A') {
                        return inspElem.target || '';
                    }
                } catch (error) {
                }

                return '';
            };

            wijeditor.prototype._getLinkCssField = function () {
                var self = this, inspElem;

                self.focus();
                inspElem = self._getInspectElement();

                try  {
                    inspElem = self._getHyperLinkElement(inspElem);
                    if (inspElem && inspElem.tagName === 'A') {
                        return inspElem.style.cssText || '';
                    }
                } catch (error) {
                }

                return '';
            };

            /** @ignore */
            wijeditor.prototype.submitHyperLinkDialog = function () {
                var self = this, $dlg = self.dialog, $radUrl = $("#radUrl", $dlg), $radAnchor = $("#radAnchor", $dlg), $radMail = $("#radMail", $dlg), $address = $("." + css_linkdlg_address + " input", $dlg), $text = $("." + css_linkdlg_text + " input", $dlg), $css = $("." + css_linkdlg_css + " input", $dlg), $target = $("." + css_linkdlg_target + " select", $dlg), address = $address.val(), text = $text.val(), target = $target.val(), $radImage = $("#radLinkTypeIsImage", $dlg), imageChecked = $radImage.prop("checked"), imageUrl = $("." + css_linkdlg_url + " input", $dlg).val(), imageWidth = $("." + css_linkdlg_width + " input", $dlg).val(), imageHeight = $("." + css_linkdlg_height + " input", $dlg).val(), css = $css.val();

                if (address === '') {
                    wijAlert(this.localizeString("errorMessageAddressError", "Please input address!"));
                    return;
                }

                if (text === '' && !imageChecked) {
                    wijAlert(this.localizeString("errorMessageDisplayTextError", "Please input display text!"));
                    return;
                }

                if (imageUrl === '' && imageChecked) {
                    wijAlert(this.localizeString("errorMessageHyperLinkImageUrlError", "Please input image url!"));
                    return;
                }

                if (!self._isNumeric(imageWidth) && imageChecked) {
                    wijAlert(this.localizeString("errorMessageHyperLinkImageWidthError", "Please input correct image width!"));
                    return;
                }

                if (!self._isNumeric(imageHeight) && imageChecked) {
                    wijAlert(this.localizeString("errorMessageHyperLinkImageHeightError", "Please input correct image height!"));
                    return;
                }

                if ($radUrl.prop("checked") && !self._isUrl(address)) {
                    wijAlert(this.localizeString("errorMessageHyperLinkUrl", "Please input correct url!"));
                    return;
                }

                if ($radAnchor.prop("checked") && !self._isAnchor(address)) {
                    wijAlert(this.localizeString("errorMessageHyperLinkAnchor", "Please input correct anchor!"));
                    return;
                }

                if ($radMail.prop("checked") && !self._isEmail(address)) {
                    wijAlert(this.localizeString("errorMessageHyperLinkEmail", "Please input correct email!"));
                    return;
                }

                if (imageChecked) {
                    text = '<img src="' + imageUrl + '" width="' + imageWidth + '" height="' + imageHeight;
                    text += '"/>';
                }

                self._closeDialog();
                self._editLink(text, address, css, target);
            };

            wijeditor.prototype._editLink = function (text, href, css, target) {
                var self = this, html = '', inspElem;
                self.focus();
                inspElem = self._getInspectElement();

                try  {
                    inspElem = self._getHyperLinkElement(inspElem);
                    if (inspElem && inspElem.tagName === 'A') {
                        inspElem.innerHTML = self._hyperlinkTextStyle && self._hyperlinkTextStyle !== "" ? self._hyperlinkTextStyle.replace("{0}", text) : text;
                        inspElem.href = href;
                        inspElem.target = target;

                        if (css !== inspElem.style.cssText) {
                            inspElem.style.cssText = css;
                        }

                        self._addtoUndoBuffer();
                        self._setSaveBtnEnabled();

                        return;
                    }
                } catch (error) {
                }

                html = '<a href="' + href + '" target="' + target + '"';

                if (css !== '') {
                    html += ' style="' + css + '"';
                }

                html += '>' + text + '</a>';
                self.insertHTML(html);
            };

            /** @ignore */
            wijeditor.prototype.anchorListOnChanged = function (list) {
                var self = this, $dlg = self.dialog, val = $(list).val();

                if (val !== '') {
                    $("." + css_linkdlg_address + " input", $dlg).val(val);
                    $("#radAnchor", $dlg).attr("checked", "checked");
                }
            };

            /** @ignore */
            wijeditor.prototype.radioListOnChanged = function () {
                var self = this, $dlg = self.dialog, $anchor = $("." + css_linkdlg_anchor, $dlg), $address = $("." + css_linkdlg_address + " input", $dlg);

                $address.val("");

                if ($("#radUrl", $dlg).is(":checked")) {
                    $anchor.hide();
                } else if ($("#radAnchor", $dlg).is(":checked")) {
                    $anchor.show();
                } else if ($("#radMail", $dlg).is(":checked")) {
                    $anchor.hide();
                    $address.val(this.localizeString("insertHyperLinkMailTo", "mailto:"));
                } else if ($("#radFile", $dlg).is(":checked")) {
                    $anchor.hide();
                }
            };

            /** @ignore */
            wijeditor.prototype.linkIconTypeOnChanged = function () {
                var self = this, $dlg = self.dialog, $imageContainer = $("." + css_linkdlg_imagecontainer, $dlg), $text = $("." + css_linkdlg_text, $dlg);

                if ($("#radLinkTypeIsText", $dlg).is(":checked")) {
                    $text.show();
                    $imageContainer.hide();
                } else if ($("#radLinkTypeIsImage", $dlg).is(":checked")) {
                    $text.hide();
                    $imageContainer.show();
                }
            };

            //end of link dialog.
            //beging to handle the insert code dialog
            wijeditor.prototype._getDialogRes_Code = function () {
                var self = this, dialog = wijribbonDataRender.createDiv(css_linkdlg);

                dialog.add(wijribbonDataRender.createElement("div", this.localizeString("insertCodeDialogEnterSourceCode", "Enter source code:"), {
                    "class": css_codedlg_sourcelabel
                }));
                dialog.add(wijribbonDataRender.createElement("textarea", "", {
                    "class": css_codedlg_source
                }));

                dialog.add(self._createSeparator());
                dialog.add(self._createOKCancelButtons());

                return dialog.render();
            };

            /** @ignore */
            wijeditor.prototype.initInsertCodeDialog = function () {
                var self = this, $dlg = self.dialog;
                $dlg.delegate(selector_dlg_ok, "click." + self.widgetName, function (e) {
                    self.submitCodeDialog();
                    self._onDesignViewBlur(e);
                }).delegate(selector_dlg_cancel, "click." + self.widgetName, function () {
                    self._closeDialog();
                });
            };

            /** @ignore */
            wijeditor.prototype.submitCodeDialog = function () {
                var self = this, $dlg = self.dialog, $source = $("." + css_codedlg_source, $dlg), html = $source.val();

                if (html === '') {
                    return;
                }
                html = html.replace(/</g, '&lt;');
                html = html.replace(/>/g, '&gt;');
                html = '<pre>' + html + '</pre>';
                self._setIESelection();
                self.insertHTML(html);
                self._closeDialog();
            };

            //end of insert code dialog
            //begin to handle the tagInspector dialog.
            /** @ignore */
            wijeditor.prototype.initTagInspectorDialog = function () {
                var self = this, $dlg = self.dialog, $innerHTML = $("." + css_taginsdlg_innerhtml);

                $dlg.delegate(selector_dlg_ok, "click." + self.widgetName, function (e) {
                    self.submitTagInspectorDialog();
                    self._onDesignViewBlur(e);
                }).delegate(selector_dlg_cancel, "click." + self.widgetName, function () {
                    self._closeDialog();
                }).delegate("#displayNoEmpty", "click." + self.widgetName, function () {
                    self.tagInspectorDialogSwitchAttList(this);
                });

                self._laySelectedElementAttributes($("." + css_taginsdlg_attriblist, $dlg), $("." + css_taginsdlg_tagtext, $dlg));

                $("." + css_taginsdlg_css + " input", $dlg).val(self._getSelectedElementStyle());

                if (self._selectedElementCanHaveChildren()) {
                    $innerHTML.show();
                    $("textarea", $innerHTML).val(self._getSelectedElementInnerHTML());
                } else {
                    $innerHTML.hide();
                }
            };

            /** @ignore */
            wijeditor.prototype.submitTagInspectorDialog = function () {
                var self = this, $dlg = self.dialog, el = self._getInspectElement(), $attriblist = $("." + css_taginsdlg_attriblist, $dlg), cssText = $("." + css_taginsdlg_css + " input").val(), innerHTML = $("." + css_taginsdlg_innerhtml + " textarea").val();

                try  {
                    $.each($("input:checkbox", $attriblist), function (idx, chk) {
                        var attrName, attrValue, $chk = $(chk);

                        if ($chk.is(":checked")) {
                            attrName = $chk.siblings("span").text();
                            attrName = attrName.substring(0, attrName.length - 1);
                            attrValue = $chk.siblings("input:text").val();
                            $(el).attr(attrName, attrValue);
                        }
                    });

                    if ($.trim(cssText) !== '') {
                        el.style.cssText = cssText;
                    }

                    if (self._selectedElementCanHaveChildren()) {
                        $(el).html(innerHTML);
                    }
                } catch (error) {
                }

                self._closeDialog();
                self._addtoUndoBuffer();
                self._setSaveBtnEnabled();
            };

            /** @ignore */
            wijeditor.prototype.tagInspectorDialogSwitchAttList = function (element) {
                var $attriblis = $("." + css_taginsdlg_attriblist, this.dialog), showAll = !element.checked;

                $.each($("input:text", $attriblis), function (idx, text) {
                    if ($(text).val() === "") {
                        $(text).parent("li")[showAll ? "show" : "hide"]();
                    }
                });
            };

            wijeditor.prototype._laySelectedElementAttributes = function ($attriblist, $tag) {
                var self = this, el = self._getInspectElement(), dic, tag, attrs, localSaveString = this.localizeString("tagInspectorDialogSave", "Save"), html = "";

                if (!el) {
                    return;
                }

                $tag.html(el.tagName);

                dic = self._getDictionaryDeclare();
                tag = el.tagName.toLowerCase();
                attrs = dic[tag];

                switch (tag) {
                    case 'ul':
                    case 'u':
                    case 'textarea':
                    case 'tbody':
                    case 'tr':
                    case 'th':
                    case 'td':
                    case 'table':
                    case 'select':
                    case 'strong':
                    case 'span':
                    case 'p':
                    case 'option':
                    case 'ol':
                    case 'li':
                    case 'label':
                    case 'input':
                    case 'img':
                    case 'i':
                    case 'hr':
                    case 'form':
                    case 'font':
                    case 'em':
                    case 'div':
                    case 'code':
                    case 'button':
                    case 'body':
                    case 'b':
                    case 'a':
                        html += "<ul class='ui-helper-reset'>";

                        $.each(attrs, function (idx, attr) {
                            var val = el.getAttribute(attr) || "";

                            html += "<li><span class='" + css_dlg_text + "'>";
                            html += attr + ":</span>";
                            html += "<input type='text' value='" + val + "'/>";
                            html += "<input type='checkbox' id='save" + idx + "'/>";
                            html += "<label for='save" + idx + "'>" + localSaveString + "</label></li>";
                        });
                        break;
                }

                $attriblist.html(html);
            };

            wijeditor.prototype._getSelectedElementStyle = function () {
                var inspElem = this._getInspectElement();

                if (inspElem && inspElem.style) {
                    return inspElem.style.cssText || '';
                } else {
                    return '';
                }
            };

            wijeditor.prototype._getSelectedElementInnerHTML = function () {
                var inspElem = this._getInspectElement();

                if (inspElem) {
                    return inspElem.innerHTML;
                } else {
                    return '';
                }
            };

            wijeditor.prototype._selectedElementCanHaveChildren = function () {
                return !$(this._getInspectElement()).is("input,hr,br,img");
            };

            //end of tag inspector dialog.
            //begin to handle the color dialog.
            /** @ignore */
            wijeditor.prototype.initBackColorDialog = function () {
                this._initColorDialog("BackColor");
            };

            /** @ignore */
            wijeditor.prototype.initForeColorDialog = function () {
                this._initColorDialog("ForeColor");
            };

            wijeditor.prototype._initColorDialog = function (colorCommand) {
                var self = this, $dlg = self.dialog, doc = self._getDesignViewDocument(), color = doc.queryCommandValue(colorCommand), iColor, items, sColor;

                $dlg.delegate(selector_dlg_ok, "click." + self.widgetName, function (e) {
                    self.submitColorDialog(colorCommand);
                    self._onDesignViewBlur(e);
                }).delegate(selector_dlg_cancel, "click." + self.widgetName, function () {
                    self._closeDialog();
                });

                if (color) {
                    sColor = color.toString();
                    if ($.browser.mozilla && sColor === "transparent") {
                        sColor = "#ffffff";
                    }

                    if ($.browser.msie) {
                        iColor = wijParseInt(sColor);

                        sColor = 'rgb(' + (iColor & 255) + ', ' + ((iColor & 65280) >> 8) + ', ' + ((iColor & 16711680) >> 16) + ')';
                    }

                    if (sColor.indexOf('rgb(') === 0) {
                        items = sColor.substring(4, sColor.length - 1).split(',');
                        sColor = self._convertToWebColor(wijParseInt(items[0]), wijParseInt(items[1]), wijParseInt(items[2]));
                    } else if (sColor.indexOf('rgba(') === 0) {
                        items = sColor.substring(5, sColor.length - 1).split(',');
                        sColor = self._convertToWebColor(wijParseInt(items[0]), wijParseInt(items[1]), wijParseInt(items[2]));
                    }

                    $("." + css_colordlg_color + " input", $dlg).attr("value", sColor);
                }

                $("." + css_colordlg_picker, $dlg).wijeditorcolorcanvas("." + css_colordlg_color + " input", sColor);
            };

            /** @ignore */
            wijeditor.prototype.submitColorDialog = function (colorCommand) {
                var self = this, $color = $("." + css_colordlg_color + " input", self.dialog);

                self.setColor(colorCommand, $color.val());
                self._closeDialog();
            };

            /** @ignore */
            wijeditor.prototype.setColor = function (cmdID, color) {
                var self = this, htmlText, doc = self._getDesignViewDocument(), win = self._getDesignViewWindow(), selection;

                self._setIESelection();

                if ($.browser.mozilla && cmdID === 'BackColor') {
                    selection = win.getSelection();
                    self.insertHTML('<span style="background-color:' + color + ';">' + selection + '</span>');
                } else {
                    doc.execCommand(cmdID, false, color);

                    // For case 41717. Make <U> and <STRIKE> tag wrapped in <FONT>. Just in IE.
                    if ($.browser.msie) {
                        htmlText = self._getHtmlTextInIE(doc);

                        if (htmlText.indexOf("<U>") >= 0 && htmlText.indexOf("</U>") >= 0) {
                            doc.execCommand("Underline", false, false);
                            doc.execCommand("Underline");
                        }
                        if (htmlText.indexOf("<STRIKE>") >= 0 && htmlText.indexOf("</STRIKE>") >= 0) {
                            doc.execCommand("StrikeThrough", false, false);
                            doc.execCommand("StrikeThrough");
                        }
                    }

                    if (self.options.mode === "bbcode" && !($.browser.msie)) {
                        self._convertFontStyleToStandTag();
                    }
                }

                self._addtoUndoBuffer();
                self._setSaveBtnEnabled();
            };

            //end of color dialog.
            //begin to handle the table dialog.
            /** @ignore */
            wijeditor.prototype.initInsertTableDialog = function () {
                var self = this, $dlg = self.dialog;

                $dlg.delegate(selector_dlg_ok, "click." + self.widgetName, function (e) {
                    self.submitInsertTableDialog();
                    self._onDesignViewBlur(e);
                }).delegate(selector_input_cancel, "click." + self.widgetName, function () {
                    self._closeDialog();
                }).delegate("." + css_tabledlg_bgcolor + " input:button", "click." + self.widgetName, function () {
                    self.showTableColorDialog(this, $dlg);
                });
            };

            /** @ignore */
            wijeditor.prototype.submitInsertTableDialog = function () {
                var self = this, attribs = self._getValuesFromTableDialog();

                if (!attribs) {
                    return;
                }

                self._insertTable(attribs);
                self._closeDialog();
            };

            wijeditor.prototype._insertTable = function (attribs) {
                var self = this, html = '', i, j;

                if (!attribs) {
                    return false;
                }

                self.focus();

                html += '<table width="' + attribs.width + '" height="' + attribs.height + '" cellspacing="' + attribs.cspacing + '" cellpadding="' + attribs.cpadding + '" border="' + attribs.border + '" bgcolor="' + attribs.bgcolor + '" style="' + attribs.css + '">';

                for (i = 0; i < attribs.rows; i++) {
                    html += '<tr>';
                    for (j = 0; j < attribs.cols; j++) {
                        html += '<td>Cell ' + (i + 1) + '-' + (j + 1) + '</td>';
                    }
                    html += '</tr>';
                }
                html += '</table>';

                if ($.browser.mozilla || ($.browser.msie && wijParseInt($.browser.version) >= 9)) {
                    html += '<br />';
                }

                self.insertHTML(html);
            };

            ////end of the insert table dialog.
            ////begin to handle the edit table dialog.
            /** @ignore */
            wijeditor.prototype.initEditTableDialog = function () {
                var self = this, $dlg = self.dialog, el = self._getInspectElement(), rows, columns;

                $dlg.delegate(selector_dlg_ok, "click." + self.widgetName, function (e) {
                    self.submitEditTableDialog();
                    self._onDesignViewBlur(e);
                }).delegate(selector_input_cancel, "click." + self.widgetName, function () {
                    self._closeDialog();
                }).delegate("." + css_tabledlg_bgcolor + " input:button", "click." + self.widgetName, function () {
                    self.showTableColorDialog(this, $dlg);
                });

                if (!el) {
                    return;
                }

                try  {
                    rows = el.rows;

                    if (rows.length > 0) {
                        columns = rows[0].cells.length;
                    } else {
                        columns = 0;
                    }

                    rows = rows.length;
                } catch (e) {
                }

                $("." + css_tabledlg_rows + " input", $dlg).val(rows);
                $("." + css_tabledlg_columns + " input", $dlg).val(columns);
                $("." + css_tabledlg_width + " input", $dlg).val(el.getAttribute("width"));
                $("." + css_tabledlg_height + " input", $dlg).val(el.getAttribute("height"));
                $("." + css_tabledlg_border + " input", $dlg).val(el.getAttribute("border"));
                $("." + css_tabledlg_cellpadding + " input", $dlg).val(el.getAttribute("cellPadding"));
                $("." + css_tabledlg_cellspacing + " input", $dlg).val(el.getAttribute("cellSpacing"));
                $("." + css_tabledlg_bgcolor + " input", $dlg).val(el.getAttribute("bgcolor") || "#ffffff");
                $("." + css_tabledlg_csstext + " input", $dlg).val(el.style.cssText);
            };

            /** @ignore */
            wijeditor.prototype.submitEditTableDialog = function () {
                var self = this, el = self._getInspectElement(), $el = $(el), attribs = self._getValuesFromTableDialog(), rows = attribs && wijParseInt(attribs.rows), cols = attribs && wijParseInt(attribs.cols), newRow, newCell;

                if (!attribs) {
                    return;
                }

                if (el) {
                    $el.attr("width", attribs.width);
                    $el.attr("height", attribs.height);
                    $el.attr("bgcolor", attribs.bgcolor);
                    $el.attr("border", attribs.border);
                    $el.attr("cellSpacing", attribs.cspacing);
                    $el.attr("cellPadding", attribs.cpadding);

                    el.style.cssText = attribs.css;

                    if (!rows || isNaN(rows)) {
                        return;
                    }

                    if (!cols || isNaN(cols)) {
                        return;
                    }

                    while (el.rows.length > rows) {
                        el.deleteRow(0);
                    }

                    while (el.rows.length < rows) {
                        newRow = el.insertRow(0);
                        while (newRow.cells.length < cols) {
                            newCell = newRow.insertCell(0);
                            newCell.innerHTML = '&nbsp;';
                        }
                    }

                    $.each(el.rows, function (idx, row) {
                        while (row.cells.length > cols) {
                            row.deleteCell(0);
                        }

                        while (row.cells.length < cols) {
                            newCell = row.insertCell(0);
                            newCell.innerHTML = '&nbsp;';
                        }
                    });
                }

                self._closeDialog();
            };

            ////end of the edit table dialog.
            wijeditor.prototype._getValuesFromTableDialog = function () {
                var self = this, $dlg = self.dialog, rows = $("." + css_tabledlg_rows + " input", $dlg).val(), cols = $("." + css_tabledlg_columns + " input", $dlg).val(), width = $("." + css_tabledlg_width + " input", $dlg).val(), height = $("." + css_tabledlg_height + " input", $dlg).val(), border = $("." + css_tabledlg_border + " input", $dlg).val(), cpadding = $("." + css_tabledlg_cellpadding + " input", $dlg).val(), cspacing = $("." + css_tabledlg_cellspacing + " input", $dlg).val(), css = $("." + css_tabledlg_csstext + " input", $dlg).val(), bgcolor = $("." + css_tabledlg_bgcolor + " input", $dlg).val();

                if (!self._isNumeric(rows)) {
                    wijAlert(this.localizeString("errorMessageRowsError", "Please input a number for 'Rows' textbox."));
                    return false;
                }

                if (!self._isNumeric(cols)) {
                    wijAlert(this.localizeString("errorMessageColumnsError", "Please input a number for 'Columns' textbox."));
                    return false;
                }

                if (!self._isNumeric(width)) {
                    wijAlert(this.localizeString("errorMessageTableWidthError", "Please input a number for 'Table Width ' textbox."));
                    return false;
                }

                if (!self._isNumeric(height)) {
                    wijAlert(this.localizeString("errorMessageTableHeightError", "Please input a number for 'Table Height' textbox."));
                    return false;
                }

                if (!self._isNumeric(border)) {
                    wijAlert(this.localizeString("tableDialogBorderError", "Please input a number for 'Border thickness' textbox."));
                    return false;
                }

                if (!self._isNumeric(cpadding)) {
                    wijAlert(this.localizeString("tableDialogCellPaddingError", "Please input a number for 'Cell Padding' textbox."));
                    return false;
                }

                if (!self._isNumeric(cspacing)) {
                    wijAlert(this.localizeString("tableDialogCellSpacingError", "Please input a number for 'Cell Spacing' textbox."));
                    return false;
                }

                return {
                    rows: rows,
                    cols: cols,
                    width: wijParseInt(width),
                    height: wijParseInt(height),
                    border: border,
                    cpadding: cpadding,
                    cspacing: cspacing,
                    css: css,
                    bgcolor: bgcolor
                };
            };

            /** @ignore */
            wijeditor.prototype.showTableColorDialog = function (el, parentDlg) {
                var self = this, dialogOpts, $subDlg = self.subDialog, bgcolor = $(el).prev().val(), content = self._getDialogRes_Color();

                dialogOpts = {
                    width: "auto",
                    height: "auto",
                    modal: true,
                    title: self.localizeString("backColorDialogTitle", "Set BackColor"),
                    position: { my: "center", at: "center", of: window },
                    resizable: false,
                    captionButtons: {
                        pin: { visible: false },
                        refresh: { visible: false },
                        toggle: { visible: false },
                        minimize: { visible: false },
                        maximize: { visible: false }
                    },
                    close: function () {
                        parentDlg.focus();
                    }
                };

                $subDlg.empty().append(content);
                if ($.browser.msie && wijParseInt($.browser.version) === 6) {
                    window.setTimeout(function () {
                        $subDlg.wijdialog(dialogOpts);
                    }, 0);
                } else {
                    $subDlg.wijdialog(dialogOpts);
                }

                $subDlg.delegate(selector_input_ok, "click." + self.widgetName, function () {
                    self.submitTableColorDialog();
                }).delegate(selector_input_cancel, "click." + self.widgetName, function () {
                    self.closeSubDialog();
                });

                if (bgcolor !== "") {
                    $("." + css_colordlg_color + " input", $subDlg).val(bgcolor);
                }

                $("." + css_colordlg_picker, $subDlg).wijeditorcolorcanvas("." + css_colordlg_color + " input", bgcolor);

                $subDlg.wijdialog("open");
            };

            /** @ignore */
            wijeditor.prototype.submitTableColorDialog = function () {
                var self = this, $subDlg = self.subDialog, $dlg = self.dialog, color = $("." + css_colordlg_color + " input", $subDlg).val();

                $("." + css_tabledlg_bgcolor + " input:text", $dlg).val(color);
                self.closeSubDialog();
            };

            /** @ignore */
            wijeditor.prototype.closeSubDialog = function () {
                this.subDialog.wijdialog("close");
            };

            wijeditor.prototype._getEditableTable = function () {
                var self = this, table, editableTable, $editableTable;

                editableTable = self._getSelectedElement();

                if (!editableTable) {
                    wijAlert(this.localizeString("errorMessageSelectTableError", "Please select a table!"));
                    return false;
                }

                $editableTable = $(editableTable);

                if ($editableTable.is("td,tr,tbody,th")) {
                    editableTable = $editableTable.parents("table:first")[0];
                } else if (!$editableTable.is("table")) {
                    table = $editableTable.find("table:only-child");
                    if ($.browser.msie && table.length) {
                        editableTable = table[0];
                    } else {
                        wijAlert(this.localizeString("errorMessageSelectTableError", "Please select a table!"));
                        return false;
                    }
                }

                inspectElement = editableTable;
                return true;
            };

            //end of table dialog.
            //begin to handle the preview dialog.
            /** @ignore */
            wijeditor.prototype.initPreviewDialog = function () {
                var self = this, $dlg = self.dialog;

                self._setPreviewContent(0);

                $dlg.one("wijdialogclose", function () {
                    self._curPageIdx = 0;
                });

                $dlg.delegate("#rad640_480", "click." + self.widgetName, function () {
                    self._setPreviewDialogSize(640, 480);
                }).delegate("#rad800_600", "click." + self.widgetName, function () {
                    self._setPreviewDialogSize(800, 600);
                }).delegate("#rad1024_768", "click." + self.widgetName, function () {
                    self._setPreviewDialogSize(1024, 768);
                }).delegate("#chkSplit", "click." + self.widgetName, function () {
                    self._splitPreviewPages(this.checked);
                }).delegate("." + css_previewdlg_printall, "click." + self.widgetName, function () {
                    self._printPreviewPage(true);
                }).delegate("." + css_previewdlg_printone, "click." + self.widgetName, function () {
                    self._printPreviewPage(false);
                }).delegate("." + css_previewdlg_ok, "click." + self.widgetName, function () {
                    self._closeDialog();
                }).delegate("." + css_previewdlg_prev, "click." + self.widgetName, function () {
                    self._navigatePreviewPage(false);
                }).delegate("." + css_previewdlg_next, "click." + self.widgetName, function () {
                    self._navigatePreviewPage(true);
                });
            };

            wijeditor.prototype._setPreviewContent = function (pageIndex) {
                var self = this, $dlg = self.dialog, $iframe = $("iframe", $dlg), $pager = $("." + css_previewdlg_navigator + " span", $dlg), doc = $iframe[0].contentWindow.document;

                doc.open();

                if (pageIndex === -1) {
                    doc.write(self._getPreviewAllPageContent());
                    $pager.html('1 / 1');
                } else {
                    doc.write(self._getPreviewPageContent(pageIndex));
                    $pager.html((pageIndex + 1) + ' / ' + self._getPreviewPageCount());
                }

                doc.close();
            };

            wijeditor.prototype._setPreviewDialogSize = function (width, height) {
                var self = this, $dlg = self.dialog, $iframe = $("iframe", $dlg), offsetW = $dlg.wijdialog("option", "width"), offsetH = $dlg.wijdialog("option", "height");

                if (offsetW === "auto") {
                    offsetW = $dlg.parent(".wijmo-wijdialog").width() - $iframe.width();
                } else {
                    offsetW = offsetW - $iframe.width();
                }

                if (offsetH === "auto") {
                    offsetH = $dlg.parent(".wijmo-wijdialog").height() - $iframe.height();
                } else {
                    offsetH = offsetH - $iframe.height();
                }

                $iframe.css("width", width).css("height", height);
                $dlg.wijdialog("option", {
                    width: width + offsetW,
                    height: height + offsetH
                });
            };

            wijeditor.prototype._getPreviewPageCount = function () {
                return this._getPreviewPages().length;
            };

            wijeditor.prototype._getPreviewPageContent = function (pageIndex) {
                var contents = this._getPreviewPages();

                if (contents.length > pageIndex) {
                    return contents[pageIndex];
                }

                return null;
            };

            wijeditor.prototype._getPreviewAllPageContent = function () {
                return this._getDesignViewText();
            };

            wijeditor.prototype._getPreviewPages = function () {
                var contents = this._getPreviewAllPageContent(), regexp = new RegExp('<(DIV|div)[^>]*(page-break-before|' + 'PAGE-BREAK-BEFORE)[ ]*:[ ]*always[^>]*>(.*?)<\\/(DIV|div)>', 'g'), tempContents = contents.replace(regexp, '!-~U^n#i@q,P|.a=g~e+br!');

                return tempContents.split('!-~U^n#i@q,P|.a=g~e+br!');
            };

            //_curPageIdx: 0,
            wijeditor.prototype._splitPreviewPages = function (isSplit) {
                var self = this, $dlg = self.dialog, $pdoc = $("." + css_previewdlg_printdocument, $dlg), $pnav = $("." + css_previewdlg_navigator, $dlg);

                if (isSplit) {
                    self._setPreviewContent(0);
                    $pnav.show();
                    $pdoc.hide();
                } else {
                    self._setPreviewContent(-1);
                    $pnav.hide();
                    $pdoc.show();
                }

                self._curPageIdx = 0;
            };

            wijeditor.prototype._navigatePreviewPage = function (isNext) {
                var self = this, $chkSplit = $("#chkSplit", self.dialog), curIdx = self._curPageIdx, pageCount = self._getPreviewPageCount();

                if ($chkSplit.is(":checked")) {
                    if (isNext) {
                        curIdx++;
                        if (curIdx < pageCount) {
                            self._setPreviewContent(curIdx);
                        } else {
                            curIdx = pageCount - 1;
                        }
                    } else {
                        curIdx--;
                        if (curIdx >= 0) {
                            self._setPreviewContent(curIdx);
                        } else {
                            curIdx = 0;
                        }
                    }

                    self._curPageIdx = curIdx;
                }
            };

            wijeditor.prototype._printPreviewPage = function (isAll) {
                var self = this, $dlg = self.dialog, $chkSplit = $("#chkSplit", $dlg), win = $("iframe", $dlg)[0].contentWindow;

                if (isAll) {
                    $chkSplit.removeAttr("checked");
                    self._setPreviewContent(-1);
                }

                win.focus();
                win.print();
            };

            //end of preview dialog.
            //begin to handle the cleanup dialog.
            /** @ignore */
            wijeditor.prototype.initCleanUpDialog = function () {
                var self = this, $dlg = self.dialog;

                $("textarea", $dlg).val(self.sourceView.val());

                $dlg.delegate(selector_dlg_ok, "click." + self.widgetName, function (e) {
                    self.submitCleanUpDialog();
                    self._onDesignViewBlur(e);
                }).delegate(selector_dlg_cancel, "click." + self.widgetName, function () {
                    self._closeDialog();
                });
            };

            /** @ignore */
            wijeditor.prototype.submitCleanUpDialog = function () {
                var self = this, $dlg = self.dialog, $sourceView = self.sourceView, source = $sourceView.val(), reg;

                if ($("#replaceSpans", $dlg).is(":checked")) {
                    reg = new RegExp('<\\/?SPAN[^>]*>', 'g');
                    source = source.replace(reg, '');
                }

                if ($("#replaceClass", $dlg).is(":checked")) {
                    reg = new RegExp('<(\\w[^>]*) class=([^ |>]*)([^>]*)', 'g');
                    source = source.replace(reg, '<$1$3');
                }

                if ($("#replaceStyle", $dlg).is(":checked")) {
                    reg = new RegExp('<(\\w[^>]*) style=\"([^\"]*)\"([^>]*)', 'g');
                    source = source.replace(reg, '<$1$3');
                    reg = new RegExp('<(\\w[^>]*) lang=([^ |>]*)([^>]*)', 'g');
                    source = source.replace(reg, '<$1$3');
                    reg = new RegExp('<\\\\?\\?xml[^>]*>', 'g');
                    source = source.replace(reg, '');
                    reg = new RegExp('<\\/?\\w+:[^>]*>', 'g');
                    source = source.replace(reg, '');
                }

                if ($("#replaceNbsp", $dlg).is(":checked")) {
                    reg = new RegExp('&nbsp;', 'g');
                    source = source.replace(reg, ' ');
                }

                if ($("#transformPtoDiv", $dlg).is(":checked")) {
                    reg = new RegExp('(<P)([^>]*>.*?)(<\\/P>)', 'g');
                    source = source.replace(reg, '<div$2</div>');
                }

                $sourceView.val(source);
                self._setDesignViewText(source);
                self._addtoUndoBuffer();
                self._closeDialog();
            };

            //end of cleanup dialog.
            //begin to handle the find/replace dialog.
            /** @ignore */
            wijeditor.prototype.initFindDialog = function () {
                var self = this, $dlg = self.dialog;

                if (self.tRange) {
                    self.tRange = null;
                }

                $dlg.delegate(selector_dlg_ok, "click." + self.widgetName, function () {
                    self.submitFindAction();
                }).delegate(selector_dlg_cancel, "click." + self.widgetName, function (e) {
                    self.submitReplaceAction();
                    self._onDesignViewBlur(e);
                });
            };

            /** @ignore */
            wijeditor.prototype.submitFindAction = function () {
                var self = this, text = $("textarea:first", self.dialog).val();

                if ($.trim(text) === '') {
                    return;
                }

                self._findAndReplaceString(text);
            };

            /** @ignore */
            wijeditor.prototype.submitReplaceAction = function () {
                var self = this, $dlg = self.dialog, fText = $("textarea:first", $dlg).val(), rText = $("textarea:last", $dlg).val();

                if ($.trim(fText) === '') {
                    return;
                }

                if ($.trim(rText) === '') {
                    wijAlert(this.localizeString("errorMessageReplaceStringError", "please input replace string!"));
                    return;
                }

                self._findAndReplaceString(fText, rText);
            };

            wijeditor.prototype._findAndReplaceString = function (fText, rText) {
                var self = this, contentWindow = self._getDesignViewWindow(), strFound = 0, strReplaced = false, noIESel, needReplace = rText && rText !== fText;

                if (!rText) {
                    rText = fText;
                }

                if ($.browser.msie) {
                    if (self.tRange) {
                        if (self.txtFoundInIE && needReplace) {
                            strFound = self.tRange.findText(fText);
                            if (strFound) {
                                self.tRange.pasteHTML(rText);
                                self.tRange.collapse(false);
                                strReplaced = true;
                                self.txtFoundInIE = false;
                            }
                        } else {
                            self.tRange.collapse(false);
                            strFound = self.tRange.findText(fText);
                            if (strFound) {
                                self.tRange.select();
                            }
                        }
                    }
                    if (!strReplaced && (!self.tRange || !strFound)) {
                        self.tRange = contentWindow.document.body.createTextRange();
                        strFound = self.tRange.findText(fText);
                        if (strFound) {
                            self.tRange.select();
                            if (needReplace) {
                                self.tRange.pasteHTML(rText);
                                strReplaced = true;
                            }
                        }
                    }
                } else {
                    if (self.txtFoundInNoneIE && needReplace) {
                        self._replaceSelectionForNoneIE(rText);
                        strReplaced = true;
                        self.txtFoundInNoneIE = false;
                    } else {
                        noIESel = contentWindow.getSelection();
                        if (noIESel.rangeCount > 0) {
                            noIESel.collapseToEnd();
                        }
                        strFound = contentWindow.find(fText);
                        if (!strFound) {
                            strFound = contentWindow.find(fText, 0, 1);
                            while (contentWindow.find(fText, 0, 1)) {
                                continue;
                            }
                        }
                    }
                    self.txtFoundInNoneIE = self.txtFoundInNoneIE || (strFound > 0);
                    if (self.txtFoundInNoneIE && needReplace) {
                        self._replaceSelectionForNoneIE(rText);
                        strReplaced = true;
                        self.txtFoundInNoneIE = false;
                    }
                }

                if (!strFound && !strReplaced) {
                    wijAlert('"' + fText + '"' + this.localizeString("errorMessageFindTextError", " String Not Found!"));
                    self.tRange = null;
                    self.txtFoundInNoneIE = false;
                    self.txtFoundInIE = false;
                } else {
                    self.txtFoundInIE = true;
                }
            };

            wijeditor.prototype._replaceSelectionForNoneIE = function (html) {
                var doc = this._getDesignViewDocument();

                //randomStr = 'insert_html_' + Math.round(Math.random() * 100000000);
                //regex = new RegExp('<[^<]*' + randomStr + '[^>]*>');
                /** update for case 30008
                doc.execCommand('insertimage', false, randomStr);
                doc.body.innerHTML = doc.body.innerHTML.replace(regex, html);
                */
                doc.execCommand('inserttext', false, html);
            };

            //end of find/replace dialog.
            //begin to handle the media dialog.
            /** @ignore */
            wijeditor.prototype.initMediaDialog = function () {
                var self = this, $dlg = self.dialog;

                $dlg.delegate(selector_dlg_ok, "click." + self.widgetName, function (e) {
                    self.submitMediaDialog();
                    self._onDesignViewBlur(e);
                }).delegate(selector_dlg_cancel, "click." + self.widgetName, function () {
                    self._closeDialog();
                });
            };

            /** @ignore */
            wijeditor.prototype.submitMediaDialog = function () {
                var self = this, $dlg = self.dialog, type = $("select", $dlg).val(), url = $("." + css_mediadlg_url + " input", $dlg).val(), width = $("." + css_mediadlg_width + " input", $dlg).val(), height = $("." + css_mediadlg_height + " input", $dlg).val();

                if (url === '') {
                    wijAlert(this.localizeString("errorMessageUrlEmptyError", "URL is empty!"));
                    return;
                }

                if (!self._isUrl(url)) {
                    wijAlert(this.localizeString("errorMessageUrlCorrectError", "please input correct URL!"));
                    return;
                }

                if (!self._isNumeric(width)) {
                    wijAlert(this.localizeString("errorMessageMediaWidthError", "please input width of the media!"));
                    return;
                }

                if (!self._isNumeric(height)) {
                    wijAlert(this.localizeString("errorMessageMediaHeightError", "please input height of the media!"));
                    return;
                }

                self._insertMedia(type, url, width, height);
                self._closeDialog();
            };

            wijeditor.prototype._insertMedia = function (type, url, width, height) {
                var self = this, html = '';

                self._setIESelection();

                switch (type) {
                    case 'video':
                        html += '<embed src="' + url + '" width="' + width + '" ' + 'height="' + height + '" ' + 'type=audio/x-pn-realaudio-plugin console="Clip1" ' + 'controls="IMAGEWINDOW,ControlPanel,StatusBar" ' + 'autostart="true"></embed>';
                        break;
                    case 'flash':
                        html += '<object classid="' + 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' + 'codebase="http://download.macromedia.com/pub/' + 'shockwave/cabs/flash/swflash.cab#version=6,0,29,0" ' + 'width="' + width + '" height="' + height + '">';
                        html += '<param name="movie" value="' + url + '">';
                        html += '<param name="wmode" value="opaque">';
                        html += '<param name="quality" value="high">';
                        html += '<embed src="' + url + '" quality="high" ' + 'pluginspage="http://www.macromedia.com/go/getflashplayer" ' + 'type="application/x-shockwave-flash" ' + 'width="' + width + '" height="' + height + '"></embed>';
                        html += '</object>';
                        break;
                    case 'applet':
                        html += '<applet code="' + url + '" width="' + width + '" ' + 'height="' + height + '"></applet>';
                        break;
                    case 'other':
                        html += '<embed src="' + url + '" width="' + width + '" ' + 'height="' + height + '"></embed>';
                        break;
                }

                self.insertHTML(html);
            };

            //end of media dialog.
            //begin to handle the special char dialog.
            /** @ignore */
            wijeditor.prototype.initSpecialCharacterDialog = function () {
                var self = this, $dlg = self.dialog, $preview = $("." + css_specialchardlg_content + " span", $dlg);

                $dlg.delegate("label", "click." + self.widgetName, function (e) {
                    self.submitSpecialCharacterDialog(this);
                    self._onDesignViewBlur(e);
                }).delegate(selector_dlg_ok, "click." + self.widgetName, function () {
                    self._closeDialog();
                }).delegate("label", "mouseover." + self.widgetName, function () {
                    $preview.html($(this).html());
                }).delegate("label", "mouseout." + self.widgetName, function () {
                    $preview.empty();
                });
            };

            /** @ignore */
            wijeditor.prototype.submitSpecialCharacterDialog = function (element) {
                var self = this;

                self._setIESelection();
                self.insertHTML($(element).html());
                self._closeDialog();
            };

            //end of special dialog.
            //begin to handle the ribbon commands.
            wijeditor.prototype._setSaveBtnEnabled = function () {
                this.$ribbon.wijribbon(setButtonDisabled, cmd_save, false);
            };

            //undo/redo action.
            wijeditor.prototype._undoAction = function () {
                var body = this._getDesignViewDocument().body, buttonStates = {};

                undoSteps--;
                if (undoSteps <= 0) {
                    undoSteps = 0;
                }

                body.innerHTML = undoBuffers[undoSteps];

                if (!undoSteps) {
                    buttonStates[cmd_undo] = true;
                    buttonStates[cmd_redo] = false;
                    this.$ribbon.wijribbon(setButtonsDisabled, buttonStates);
                } else {
                    this.$ribbon.wijribbon(setButtonDisabled, cmd_redo, false);
                }
            };

            wijeditor.prototype._redoAction = function () {
                var body = this._getDesignViewDocument().body, len = undoBuffers.length, buttonStates = {};

                undoSteps++;
                if (undoSteps >= len - 1) {
                    undoSteps = len - 1;
                }

                body.innerHTML = undoBuffers[undoSteps];

                if (undoSteps === len - 1) {
                    buttonStates[cmd_undo] = false;
                    buttonStates[cmd_redo] = true;
                    this.$ribbon.wijribbon(setButtonsDisabled, buttonStates);
                } else {
                    this.$ribbon.wijribbon(setButtonDisabled, cmd_undo, false);
                }
            };

            wijeditor.prototype._addtoUndoBuffer = function () {
                var len = undoBuffers.length - 1 - undoSteps, idx;

                for (idx = 0; idx < len; idx++) {
                    undoBuffers.pop();
                }
                undoSteps++;
                undoBuffers.push(this._getDesignViewText());
                this.$ribbon.wijribbon(setButtonDisabled, cmd_undo, false);
            };

            //end of undo/redo action.
            //delete action for cut.
            wijeditor.prototype._deleteSelectionContent = function () {
                var cWin = this._getDesignViewWindow(), selection, i, range, rangeCount = "rangeCount";

                if ($.browser.msie) {
                    selection = cWin.document.selection;
                    if (selection.type.toLowerCase() !== 'none') {
                        selection.clear();
                    }
                } else {
                    selection = cWin.getSelection();
                    for (i = 0; i < selection[rangeCount]; i++) {
                        range = selection.getRangeAt(i);
                        range.deleteContents();
                    }
                }
            };

            //end of delete action for cut.
            //path selector action.
            wijeditor.prototype._refreshPathSelector = function () {
                var self = this, inspEl = self._getParentElement(self._getDesignViewWindow()), inspElName, $pathSelector = self._getPathSelector(), $parents = $(inspEl).parents(), len = $parents.length, css = "wijmo-wijeditor-label ui-state-default ui-corner-all", idx, labelSize, halfLabelSize, footerWidth = $(".wijmo-wijeditor-footer", self.editor).outerWidth(true), modesWidth = $(".wijmo-wijribbon-modes", self.editor).outerWidth(true), labelWidth, labelsString = "";

                if (!inspEl) {
                    return;
                }
                inspElName = inspEl.tagName ? inspEl.tagName.toLowerCase() : "";
                $pathSelector.empty();

                //get first label to calculate the width
                $pathSelector.append("<label class='" + css + "'>&lt;" + $parents[len - 1].tagName.toLowerCase() + "&gt;</label>");
                labelWidth = $(".wijmo-wijeditor-pathselector>.wijmo-wijeditor-label", self.editor).outerWidth(true);

                //get show maximum label size
                labelSize = Math.floor((footerWidth - modesWidth) / labelWidth);
                halfLabelSize = Math.floor((footerWidth - modesWidth) / (labelWidth * 2));

                if (len <= labelSize) {
                    for (idx = len - 2; idx >= 0; idx--) {
                        if ($parents[idx]) {
                            labelsString += "<label class='" + css + "'> &lt;" + $parents[idx].tagName.toLowerCase() + "&gt;</label>";
                        }
                    }
                } else {
                    for (idx = len - 2; idx >= len - halfLabelSize + 1; idx--) {
                        if ($parents[idx]) {
                            labelsString += "<label class='" + css + "'> &lt;" + $parents[idx].tagName.toLowerCase() + "&gt;</label>";
                        }
                    }
                    labelsString += "<label class='" + css + "'>&lt;.......&gt;</label>";

                    for (idx = halfLabelSize - 2; idx >= 0; idx--) {
                        if ($parents[idx]) {
                            labelsString += "<label class='" + css + "'> &lt;" + $parents[idx].tagName.toLowerCase() + "&gt;</label>";
                        }
                    }
                }

                labelsString += "<label class='" + css + " wijmo-wijeditor-selectlabel ui-state-highlight ui-corner-all'>&lt;" + inspElName + "&gt;</label>";
                $pathSelector.append(labelsString);
            };

            //end of path selector action.
            //table borders action.
            wijeditor.prototype._toggleTableBorders = function () {
                var tableVirtualBorderShowing = this.options.tableVirtualBorderShowing;

                this._updateTableBorderShowing(!tableVirtualBorderShowing);
                this.options.tableVirtualBorderShowing = !tableVirtualBorderShowing;
            };

            //end of table borders action.
            wijeditor.prototype._updateTableBorderShowing = function (tableVirtualBorderShowing) {
                var doc = this._getDesignViewDocument(), $bStyle = $('#__wijStyle', doc);

                if ($.browser.safari) {
                    if (tableVirtualBorderShowing) {
                        $bStyle.html('table,td,tr{border: 1px #acacac dashed;}');
                    } else {
                        $bStyle.empty();
                    }
                } else {
                    $bStyle.prop("disabled", !tableVirtualBorderShowing);
                }
            };

            //table action.
            wijeditor.prototype._tableAction = function (type) {
                var self = this, inspEl = self._getParentElement(self._getDesignViewWindow()), $td = $(inspEl).closest("td"), $tr, $table, td, tr, table, rowIdx, cellIdx, cellCount, rowCount, newRow, idx = 0;

                self._setSaveBtnEnabled();
                if ($td.length === 0 && type !== cmd_mergecell) {
                    return false;
                } else if (type !== cmd_mergecell) {
                    $tr = $td.parent();
                    $table = $tr.closest("table");
                    td = $td[0];
                    tr = $tr[0];
                    table = $table[0];
                    rowIdx = tr.rowIndex;
                    cellIdx = td.cellIndex;
                }
                try  {
                    switch (type) {
                        case cmd_insertrow:
                            cellCount = tr.cells.length;
                            newRow = table.insertRow(rowIdx);

                            for (idx = 0; idx < cellCount; idx++) {
                                self._insertCell(newRow, idx);
                            }
                            break;
                        case cmd_removerow:
                            table.deleteRow(rowIdx);
                            break;
                        case cmd_insertcolumn:
                            rowCount = table.rows.length;

                            for (idx = 0; idx < rowCount; idx++) {
                                self._insertCell(table.rows[idx], cellIdx);
                            }
                            break;
                        case cmd_removecolumn:
                            self._removeColumn(table, cellIdx);
                            break;
                        case cmd_insertcell:
                            self._insertCell(tr, cellIdx + 1);
                            break;
                        case cmd_removecell:
                            cellCount = tr.cells.length;

                            if (cellCount === 1) {
                                table.deleteRow(rowIdx);
                            } else {
                                tr.deleteCell(cellIdx);
                            }
                            break;
                        case cmd_splitcell:
                            self._splitCell(table, tr, rowIdx, cellIdx);
                            break;
                        case cmd_mergecell:
                            self._mergeCell(self._getSelectedCells(inspEl));
                            break;
                    }
                    this._addtoUndoBuffer();
                } catch (e) {
                    wijAlert(e.message);
                    return false;
                }
                return true;
            };

            wijeditor.prototype._removeColumn = function (table, curCellIndex) {
                var rowCount = table.rows.length, idx = 0, tr, cells, cellCount, cellIdx, colSpan;

                while (idx < rowCount) {
                    tr = table.rows[idx];
                    cells = tr.cells;
                    cellCount = cells.length;
                    cellIdx = (curCellIndex > cellCount - 1) ? cellCount - 1 : curCellIndex;
                    colSpan = cells[cellIdx].colSpan;

                    if (colSpan > 1 && cellCount > 1) {
                        if (cellIdx + 1 < cellCount) {
                            (cells[cellIdx + 1]).colSpan += colSpan - 1;
                        } else {
                            (cells[cellIdx - 1]).colSpan += colSpan + 1;
                        }
                    }

                    if (cellCount === 1) {
                        table.deleteRow(idx);
                        rowCount = table.rows.length;
                    } else {
                        tr.deleteCell(cellIdx);
                        idx++;
                    }
                }
            };

            wijeditor.prototype._splitCell = function (table, tr, rowIndex, cellIndex) {
                var rowCount = table.rows.length, idx = 0, colSpan = 0, tempRow, tempColSpan, i, maxCellIdx, tempRowCount;

                while (idx <= cellIndex) {
                    if (tr.cells[idx].colSpan > 1) {
                        colSpan += tr.cells[idx].colSpan - 1;
                    }
                    idx++;
                }

                this._insertCell(tr, cellIndex + 1);

                if (tr.cells[cellIndex].colSpan > 1) {
                    tr.cells[cellIndex].colSpan--;
                } else {
                    for (i = 0; i < rowCount; i++) {
                        tempRow = table.rows[i];
                        if (i !== rowIndex) {
                            maxCellIdx = cellIndex;
                            idx = 0;
                            tempColSpan = 0;
                            while (idx <= maxCellIdx) {
                                if (tempRow.cells[idx].colSpan > 1) {
                                    tempColSpan += tempRow.cells[idx].colSpan - 1;
                                    maxCellIdx -= tempColSpan;
                                }
                                idx++;
                            }
                            tempRowCount = cellIndex + colSpan - tempColSpan;
                            if (tempRowCount < 0) {
                                tempRowCount = 0;
                            }
                            tempRow.cells[tempRowCount].colSpan++;
                        }
                    }
                }
            };

            wijeditor.prototype._mergeCell = function (cells) {
                var _this = this;
                var len = cells.length, tr = cells[0].parentNode, sIdx, eIdx, idx, trLast = cells[len - 1].parentNode, columnSize = tr.cells.length, sameRowCells = {}, rowIndex, isCellsInSameRow = true, newtrCells = [];

                if (len < 2) {
                    return;
                }

                // merge cells that the table only one column
                if (columnSize === 1 && tr !== trLast) {
                    for (var i = 1; i < cells.length; i++) {
                        cells[0].innerHTML += cells[i].innerHTML;
                        $(cells[i].parentNode).remove();
                    }
                } else if (columnSize > 1 && tr === trLast) {
                    //merge cells in same row
                    sIdx = cells[0].cellIndex;
                    eIdx = sIdx + len;

                    for (idx = sIdx + 1; idx < eIdx; idx++) {
                        tr.cells[sIdx].innerHTML += tr.cells[sIdx + 1].innerHTML;
                        tr.cells[sIdx].colSpan++;
                        tr.deleteCell(sIdx + 1);
                    }
                } else if (columnSize > 1 && tr !== trLast) {
                    //collect the selected cells with row index order
                    $.each(cells, function (index, cell) {
                        rowIndex = cells[index].parentNode.rowIndex;
                        if (!sameRowCells[rowIndex]) {
                            sameRowCells[rowIndex] = [];
                        }
                        sameRowCells[rowIndex].push(cell);
                    });

                    //check the whole tr cell is selected
                    $.each(sameRowCells, function (key, cells) {
                        if (cells.length !== columnSize) {
                            isCellsInSameRow = false;
                            return false;
                        }
                    });

                    if (isCellsInSameRow) {
                        $.each(sameRowCells, function (key, cells) {
                            newtrCells.push(cells[0]);
                            _this._mergeCell(cells);
                        });
                        this._mergeCell(newtrCells);
                    }
                }
            };

            wijeditor.prototype._getSelectedCells = function (inspEl) {
                var self = this, win = this._getDesignViewWindow(), doc = win.document, cells = [], tempCells, range, parent, selection, idx, rangeCount, sContainer, nodeName, offset;

                if ($.browser.msie) {
                    parent = $(inspEl).closest("tr")[0];
                    range = self._getIESelectionRange();
                    tempCells = parent ? parent.cells : self._getPrepareTableCells(inspEl);
                    $.each(tempCells, function (idx, cell) {
                        if (self._isIE11) {
                            if (self._checkSelectionIncludeNodeForIE11AndChrome(win, range, cell)) {
                                cells.push(cell);
                            }
                        } else {
                            if (self._checkSelectionIncludeNodeExceptIE11(win, range, cell)) {
                                cells.push(cell);
                            }
                        }
                    });
                } else if ($.browser.mozilla) {
                    selection = win.getSelection();
                    rangeCount = selection.rangeCount;

                    for (idx = 0; idx < rangeCount; idx++) {
                        range = selection.getRangeAt(idx);
                        sContainer = range.startContainer;
                        nodeName = sContainer.nodeName.toLowerCase();

                        if (nodeName === 'td' || nodeName === 'th') {
                            cells.push(sContainer);
                        } else if (nodeName === 'tr') {
                            offset = range.startOffset;
                            cells.push(sContainer.cells[offset]);
                        }
                    }
                } else {
                    parent = $(inspEl).closest("tr")[0];

                    //merge cells only one column in table
                    selection = win.getSelection();
                    if (selection && selection.rangeCount > 0) {
                        range = selection.getRangeAt(0);
                    }
                    tempCells = parent ? parent.cells : self._getPrepareTableCells(inspEl);
                    $.each(tempCells, function (index, cell) {
                        if (self._checkSelectionIncludeNodeForIE11AndChrome(win, range, cell)) {
                            cells.push(cell);
                        }
                    });
                }

                return cells;
            };

            wijeditor.prototype._getPrepareTableCells = function (ele) {
                var parent = $(ele.parentElement), templeCells;
                templeCells = parent ? parent.children().children("tr").children("td") : [];
                return templeCells;
            };

            //end of table action.
            //insert date time.
            /** @ignore */
            wijeditor.prototype.insertDateAndTime = function () {
                var curDate = new Date();
                if (this.options.culture && this.options.culture !== "") {
                    this.insertHTML(Globalize.format(curDate, "dddd ", Globalize.findClosestCulture(this.options.culture)) + Globalize.format(curDate, "F", Globalize.findClosestCulture(this.options.culture)));
                } else {
                    this.insertHTML(curDate.toDateString() + ' ' + curDate.toTimeString());
                }
            };

            //end of insert date time.
            //wordwrap action.
            wijeditor.prototype._toggleWordWrap = function () {
                var self = this, $sourceView = self.sourceView, wrap = "wrap", value;

                wordwrap = !wordwrap;
                value = wordwrap ? 'soft' : 'off';

                $sourceView.attr(wrap, value);
                $sourceView[0].focus();

                if ($.browser.mozilla) {
                    $sourceView.hide();

                    wijWindow.setTimeout(function () {
                        $sourceView.show();
                    }, 40);
                }
            };

            //end of wordwrap action.
            //insert html text to the document.
            /** @ignore */
            wijeditor.prototype.insertHTML = function (htmlText) {
                var self = this, doc = self._getDesignViewDocument(), range;

                try  {
                    if ($.browser.msie) {
                        if (self._isIE11 && doc.getSelection) {
                            range = self._getRangeForInsertHTML(doc, htmlText);
                        } else {
                            if (doc.selection.type === "Control") {
                                // If the selection type is "Control",
                                // clear the content of the selection firstly
                                // and then the result of "createRange" will be a TextRange located in the position of original control.
                                doc.selection.clear();
                            }
                            range = doc.selection.createRange();
                            range.pasteHTML(htmlText);
                            range.collapse(false);
                            self.rangeSelection = null;
                        }
                        self._setIESelection(range, true);
                    } else {
                        doc.execCommand('insertHTML', false, htmlText);
                    }
                } catch (e) {
                    //Condition: insert element after inserting hidden input element
                    //Result: IE8 and IE11 are ok; but IE9 and IE10 exception throws
                    if ($.browser.msie && $.browser.version && parseFloat($.browser.version) >= 9 && parseFloat($.browser.version) <= 10 && self.rangeSelection) {
                        range = self.rangeSelection;
                        range.pasteHTML(htmlText);
                        range.collapse(false);
                        self._setIESelection(range, true);
                    }
                }

                self._addtoUndoBuffer();
                self._setSaveBtnEnabled();
            };

            //end of insert html text to the document.
            wijeditor.prototype._getRangeForInsertHTML = function (doc, htmlText) {
                var sel, range, frag;
                if (doc.getSelection) {
                    sel = doc.getSelection();
                    if (this.rangeSelection) {
                        range = this.rangeSelection;
                        this.rangeSelection = null;
                    } else if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                    }
                    if (range) {
                        range.deleteContents();
                        frag = range.createContextualFragment(htmlText);
                        range.insertNode(frag);
                        range.collapse(false);
                    }
                }
                return range;
            };
            wijeditor.prototype._setIEFocus = function () {
                var doc = this._getDesignViewDocument();

                if ($.browser.msie) {
                    try  {
                        doc.body.focus();
                    } catch (ee) {
                    }
                }
            };

            /** @ignore */
            wijeditor.prototype.focus = function () {
                var win = this._getDesignViewWindow(), doc = win.document;

                if ($.browser.msie) {
                    if (!this.rangeSelection) {
                        //In IE10 Compatibility view, when call the focus too quickly, the iframe document is not loaded,
                        // the body will be null. So use the onreadystatechange to delay the focus.
                        if (doc.body) {
                            doc.body.focus();
                        } else {
                            doc.onreadystatechange = function () {
                                if (doc.readyState === "complete") {
                                    doc.body.focus();
                                }
                            };
                        }
                    } else {
                        this._setIESelection();
                    }
                } else {
                    win.focus();
                }
            };

            //end of focus related methods in ie.
            wijeditor.prototype._setFocusNotIE = function () {
                var win = this._getDesignViewWindow(), doc = win.document;
                if ($.browser.msie) {
                    return;
                }
                if (!$.browser.mozilla) {
                    //for chrome version has updated, the unittest failed
                    if (doc.body) {
                        doc.body.focus();
                    }
                } else {
                    win.focus();
                }
            };

            wijeditor.prototype._createInputButton = function (className, text) {
                var attrs = { "class": className, "type": "button", "value": undefined };

                if (text) {
                    attrs.value = text;
                }

                return wijribbonDataRender.createElement("input", attrs);
            };

            wijeditor.prototype._createTextField = function (label, className, text, defaultValue) {
                var self = this, ele = wijribbonDataRender.createDiv(className), attrs = { type: "text", value: "" };

                if (defaultValue) {
                    attrs.value = defaultValue;
                }

                ele.add(wijribbonDataRender.createSpan(css_dlg_text, label));
                ele.add(wijribbonDataRender.createElement("input", attrs));

                if (text) {
                    ele.add(new TextElement(text));
                }

                return ele;
            };

            wijeditor.prototype._createTextAreaField = function (label, className, defaultValue, text) {
                var ele = wijribbonDataRender.createDiv(className);

                ele.add(wijribbonDataRender.createSpan(css_dlg_text, label));
                ele.add(wijribbonDataRender.createElement("textarea", defaultValue));
                if (text) {
                    ele.add(new TextElement(text));
                }
                return ele;
            };

            wijeditor.prototype._createSeparator = function () {
                var self = this, hrdiv = wijribbonDataRender.createDiv(css_dlg_hr);

                hrdiv.add(wijribbonDataRender.createElement("hr"));

                return hrdiv;
            };

            wijeditor.prototype._createOKCancelButtons = function () {
                var self = this, buttons = wijribbonDataRender.createDiv(css_dlg_buttons);

                buttons.add(wijribbonDataRender.createElement("input", {
                    type: "button",
                    "class": css_dlg_button,
                    value: this.localizeString("dialogOK", "OK")
                }));
                buttons.add(wijribbonDataRender.createElement("input", {
                    type: "button",
                    "class": css_dlg_button,
                    engValue: "Cancel",
                    value: this.localizeString("dialogCancel", "Cancel")
                }));

                return buttons;
            };

            wijeditor.prototype._getDialogRes_Template = function () {
                var self = this, dialog = wijribbonDataRender.createDiv(css_tpldlg), topLabels = wijribbonDataRender.createDiv(css_tpl_labels), content = wijribbonDataRender.createDiv(css_tpl_content), tpllist = wijribbonDataRender.createDiv(css_tpl_list), preview = wijribbonDataRender.createDiv(css_tpl_preview), tplinfo = wijribbonDataRender.createDiv(css_tpl_tplinfo), namefield = wijribbonDataRender.createElement("div", this.localizeString("templateDialogName", "Name :")), desfield = wijribbonDataRender.createElement("div", this.localizeString("templateDialogDescription", "Description :")), fields = wijribbonDataRender.createDiv(css_tpl_fields), tplButtons = wijribbonDataRender.createDiv(css_tpl_buttons);

                topLabels.add(wijribbonDataRender.createElement("div", this.localizeString("templateDialogSelectTemplate", "Select Template:"), {
                    "class": css_tpl_tllabel
                }));
                topLabels.add(wijribbonDataRender.createElement("div", this.localizeString("templateDialogTemplatePreview", "Template Preview:"), {
                    "class": css_tpl_trlabel
                }));
                dialog.add(topLabels);

                tpllist.add(wijribbonDataRender.createElement("select", { size: 8 }));
                preview.add(wijribbonDataRender.createElement("iframe", { frameborder: 0 }));
                content.add(tpllist);
                content.add(preview);
                dialog.add(content);

                namefield.add(wijribbonDataRender.createSpan(css_tpl_nameinfo));
                desfield.add(wijribbonDataRender.createSpan(css_tpl_desinfo));
                tplinfo.add(namefield);
                tplinfo.add(desfield);
                dialog.add(tplinfo);

                fields.add(wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("templateDialogName", "Name :")));
                fields.add(wijribbonDataRender.createTextBox(css_tpl_namefield));
                fields.add(wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("templateDialogDescription", "Description :")));
                fields.add(wijribbonDataRender.createTextBox(css_tpl_desfield));
                dialog.add(fields);

                tplButtons.add(self._createInputButton(css_dlg_button + " " + css_tpl_delete, this.localizeString("templateDialogDeleteSelected", "Delete selected")));
                tplButtons.add(self._createInputButton(css_dlg_button + " " + css_tpl_save, this.localizeString("templateDialogSaveCurrentPage", "Save current page as template")));
                dialog.add(tplButtons);

                dialog.add(self._createSeparator());
                dialog.add(self._createOKCancelButtons());

                return dialog.render();
            };

            wijeditor.prototype._getDialogRes_ImageBrowser = function () {
                var self = this, dialog = wijribbonDataRender.createDiv(css_imgdlg), content = wijribbonDataRender.createDiv(css_imgdlg_content), fields = wijribbonDataRender.createDiv(css_imgdlg_fields), imgField = wijribbonDataRender.createDiv(css_imgdlg_field), imglist = wijribbonDataRender.createDiv(css_imgdlg_list), imgpreview = wijribbonDataRender.createDiv(css_imgdlg_preview);

                fields.add(self._createTextField(this.localizeString("imageEditorDialogImageSrc", "Image Src:"), css_imgdlg_url));
                fields.add(self._createTextField(this.localizeString("imageEditorDialogImageAltText", "Image alt text:"), css_imgdlg_alt));
                fields.add(self._createTextField(this.localizeString("imageEditorDialogImageWidth", "Image width:"), css_imgdlg_width, this.localizeString("dialogPixel", "px")));
                fields.add(self._createTextField(this.localizeString("imageEditorDialogImageHeight", "Image height:"), css_imgdlg_height, this.localizeString("dialogPixel", "px")));
                fields.add(self._createTextField(this.localizeString("imageEditorDialogCssText", "Css text:"), css_imgdlg_css));
                content.add(fields);

                imgField.add(imglist);
                imglist.add(wijribbonDataRender.createElement("select", { size: 8 }));
                imgField.add(imgpreview);
                imgpreview.add(wijribbonDataRender.createElement("img", { src: "", alt: "" }));
                content.add(imgField);

                content.add(self._createSeparator());
                content.add(self._createOKCancelButtons());

                dialog.add(content);

                return dialog.render();
            };

            wijeditor.prototype._getDialogRes_link_address = function () {
                return this._createTextField(this.localizeString("hyperLinkDialogAddress", "Address :"), css_linkdlg_address);
            };

            wijeditor.prototype._getDialogRes_link_linkType_options = function () {
                return [
                    {
                        id: "radUrl", value: "url",
                        text: this.localizeString("hyperLinkDialogUrl", "url")
                    }, {
                        id: "radAnchor", value: "anchor", checked: true,
                        text: this.localizeString("hyperLinkDialogAnchor", "anchor")
                    }, {
                        id: "radMail", value: "email",
                        text: this.localizeString("hyperLinkDialogEmail", "email")
                    }];
            };

            wijeditor.prototype._getDialogRes_link_linkType = function () {
                var linkType = wijribbonDataRender.createDiv(css_linkdlg_linktype + " ui-helper-clearfix"), linktypecontainer = wijribbonDataRender.createElement("div"), linkTypeOptions = [], idx;
                linkType.add(linktypecontainer);
                $.each(this._getDialogRes_link_linkType_options(), function (idx, radio) {
                    linktypecontainer.add(wijribbonDataRender.createRadio(radio.id, "radioList", radio.value));
                    linktypecontainer.add(wijribbonDataRender.createLabel(radio.text, radio.id));
                });

                for (idx = 1; idx < 8; idx++) {
                    linkTypeOptions.push("#anchor" + idx.toString());
                }
                linkType.add(wijribbonDataRender.createSelect(css_linkdlg_anchor, linkTypeOptions));

                return linkType;
            };

            wijeditor.prototype._getDialogRes_Link_linkIconType = function () {
                var linkIconTypeOuterContainer = wijribbonDataRender.createDiv(css_linkdlg_linkicontype), linkIconTypeContainer = wijribbonDataRender.createElement("div"), inconTypeSpan = wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("hyperLinkDialogIconType", "Icon Type :")), linkIconType = [
                    {
                        id: "radLinkTypeIsText", value: "text",
                        checked: true, text: this.localizeString("hyperLinkDialogText", "text")
                    }, {
                        id: "radLinkTypeIsImage", value: "image",
                        text: this.localizeString("hyperLinkDialogImage", "image")
                    }];

                $.each(linkIconType, function (idx, radio) {
                    linkIconTypeContainer.add(wijribbonDataRender.createRadio(radio.id, "linkIconRadioList", radio.value));
                    linkIconTypeContainer.add(wijribbonDataRender.createLabel(radio.text, radio.id));
                });
                linkIconTypeOuterContainer.add(linkIconTypeContainer);
                linkIconTypeContainer.add(inconTypeSpan);
                return linkIconTypeOuterContainer;
            };

            wijeditor.prototype._getDialogRes_Link_text = function () {
                return this._createTextField(this.localizeString("hyperLinkDialogTextToDisplay", "Text to display :"), css_linkdlg_text);
            };

            wijeditor.prototype._getDialogRes_Link_image = function () {
                var imageContainer = wijribbonDataRender.createDiv(css_linkdlg_imagecontainer);
                imageContainer.add(this._createTextField(this.localizeString("imageEditorDialogImageSrc", "Image Src:"), css_linkdlg_url));
                imageContainer.add(this._createTextField(this.localizeString("imageEditorDialogImageWidth", "Image width:"), css_linkdlg_width, this.localizeString("dialogPixel", "px")));
                imageContainer.add(this._createTextField(this.localizeString("imageEditorDialogImageHeight", "Image height:"), css_linkdlg_height, this.localizeString("dialogPixel", "px")));
                return imageContainer;
            };

            wijeditor.prototype._getDialogRes_link_target = function () {
                var target = wijribbonDataRender.createDiv(css_linkdlg_target), targetSpan = wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("hyperLinkDialogTarget", "Target :")), targetOption = [
                    { text: "_blank", selected: true },
                    "_parent", "_self", "_top"], targetSelect = wijribbonDataRender.createSelect(css_linkdlg_target, targetOption);
                target.add(targetSpan);
                target.add(targetSelect);
                return target;
            };

            wijeditor.prototype._getDialogRes_Link_Css = function () {
                return this._createTextField(this.localizeString("hyperLinkDialogCss", "Css :"), css_linkdlg_css);
            };

            wijeditor.prototype._getDialogRes_Link = function () {
                var self = this, dialog = wijribbonDataRender.createDiv(css_linkdlg);
                dialog.add(self._getDialogRes_link_address());
                dialog.add(self._getDialogRes_link_linkType());

                dialog.add(self._createSeparator());
                dialog.add(self._getDialogRes_Link_linkIconType());
                dialog.add(self._getDialogRes_Link_text());
                dialog.add(self._getDialogRes_Link_image());
                dialog.add(self._getDialogRes_link_target());

                dialog.add(self._getDialogRes_Link_Css());
                dialog.add(self._createSeparator());
                dialog.add(self._createOKCancelButtons());

                return dialog.render();
            };

            wijeditor.prototype._getDialogRes_TagInspector = function () {
                var self = this, taginsdlg = wijribbonDataRender.createDiv(css_taginsdlg), caption = wijribbonDataRender.createDiv(css_taginsdlg_caption), filterempty = wijribbonDataRender.createDiv(css_taginsdlg_filterempty), attribs = wijribbonDataRender.createDiv(css_taginsdlg_attribs), innerhtml = wijribbonDataRender.createDiv(css_taginsdlg_innerhtml);

                taginsdlg.add(caption);

                caption.add(wijribbonDataRender.createSpan(css_taginsdlg_taglabel, this.localizeString("tagInspectorDialogSelectedTag", "Selected tag :")));
                caption.add(wijribbonDataRender.createSpan(css_taginsdlg_tagtext, ""));

                taginsdlg.add(filterempty);
                filterempty.add(wijribbonDataRender.createCheckbox("displayNoEmpty"));
                filterempty.add(wijribbonDataRender.createLabel(this.localizeString("tagInspectorDialogDisplayNotEmptyAttributes", "Display not empty attributes only"), "displayNoEmpty"));

                taginsdlg.add(attribs);
                attribs.add(wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("tagInspectorDialogAttributes", "Attributes:")));
                attribs.add(wijribbonDataRender.createDiv(css_taginsdlg_attriblist));

                taginsdlg.add(innerhtml);
                innerhtml.add(wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("tagInspectorDialogInnerHTML", "Inner HTML:")));
                innerhtml.add(wijribbonDataRender.createElement("textarea"));

                taginsdlg.add(self._createTextField(this.localizeString("tagInspectorDialogCSSText", "Css Text:"), css_taginsdlg_css));
                taginsdlg.add(self._createSeparator());
                taginsdlg.add(self._createOKCancelButtons());

                return taginsdlg.render();
            };

            wijeditor.prototype._getDialogRes_Color = function () {
                return this._getDialogRes_CommonColor("#FFFFFF");
            };

            wijeditor.prototype._getDialogRes_ForeColor = function () {
                return this._getDialogRes_CommonColor("#000000");
            };

            wijeditor.prototype._getDialogRes_BackColor = function () {
                return this._getDialogRes_CommonColor("#FFFFFF");
            };

            wijeditor.prototype._getDialogRes_CommonColor = function (initColor) {
                var self = this, colordlg = wijribbonDataRender.createDiv(css_colordlg), color = wijribbonDataRender.createDiv(css_colordlg_color);

                colordlg.add(wijribbonDataRender.createDiv(css_colordlg_picker));
                colordlg.add(color);
                color.add(wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("backColorDialogSelectedColor", "Selected Color:")));
                color.add(wijribbonDataRender.createElement("input", { type: "text", value: initColor }));

                colordlg.add(self._createSeparator());
                colordlg.add(self._createOKCancelButtons());

                return colordlg.render();
            };

            wijeditor.prototype._getDialogRes_Table = function () {
                var self = this, tbldlg = wijribbonDataRender.createDiv(css_tabledlg), bgcolor = wijribbonDataRender.createDiv(css_tabledlg_bgcolor);

                tbldlg.add(self._createTextField(this.localizeString("tableDialogRows", "Rows :"), css_tabledlg_rows, "", 3));
                tbldlg.add(self._createTextField(this.localizeString("tableDialogColumns", "Columns :"), css_tabledlg_columns, "", 3));
                tbldlg.add(self._createTextField(this.localizeString("tableDialogTableWidth", "Table Width :"), css_tabledlg_width, this.localizeString("tableDialogPixels", "pixels"), 200));
                tbldlg.add(self._createTextField(this.localizeString("tableDialogTableHeight", "Table Height :"), css_tabledlg_height, this.localizeString("tableDialogPixels", "pixels"), 200));
                tbldlg.add(self._createTextField(this.localizeString("tableDialogBorder", "Border thickness:"), css_tabledlg_border));
                tbldlg.add(self._createTextField(this.localizeString("tableDialogCellPadding", "Cell Padding :"), css_tabledlg_cellpadding));
                tbldlg.add(self._createTextField(this.localizeString("tableDialogCellSpacing", "Cell Spacing :"), css_tabledlg_cellspacing));
                tbldlg.add(self._createTextField(this.localizeString("tableDialogCssText", "Css Text :"), css_tabledlg_csstext));
                tbldlg.add(bgcolor);

                bgcolor.add(wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("tableDialogBackgroundColor", "Background Color:")));
                bgcolor.add(wijribbonDataRender.createElement("input", { type: "text" }));
                bgcolor.add(wijribbonDataRender.createElement("input", { type: "button", value: "..." }));

                tbldlg.add(self._createSeparator());
                tbldlg.add(self._createOKCancelButtons());

                return tbldlg.render();
            };

            wijeditor.prototype._getDialogRes_Preview = function () {
                var self = this, previewdlg = wijribbonDataRender.createDiv(css_previewdlg), caption = wijribbonDataRender.createDiv(css_previewdlg_caption), buttons = wijribbonDataRender.createDiv(css_dlg_buttons), navigate = wijribbonDataRender.createDiv(css_previewdlg_navigator), previewFrame = wijribbonDataRender.createDiv(css_previewdlg_previewiframe);

                previewdlg.add(caption);
                caption.add(wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("previewDialogPreviewSize", "Preview Size:")));
                caption.add(wijribbonDataRender.createElement("input", {
                    id: "rad640_480",
                    name: "preview",
                    type: "radio",
                    checked: "checked"
                }));
                caption.add(wijribbonDataRender.createLabel("640x480", "rad640_480"));
                caption.add(wijribbonDataRender.createElement("input", {
                    id: "rad800_600",
                    name: "preview",
                    type: "radio"
                }));
                caption.add(wijribbonDataRender.createLabel("800x600", "rad800_600"));
                caption.add(wijribbonDataRender.createElement("input", {
                    id: "rad1024_768",
                    name: "preview",
                    type: "radio"
                }));
                caption.add(wijribbonDataRender.createLabel("1024x768", "rad1024_768"));
                caption.add(wijribbonDataRender.createElement("input", {
                    id: "chkSplit",
                    type: "checkbox",
                    checked: "checked"
                }));
                caption.add(wijribbonDataRender.createLabel(this.localizeString("previewDialogSplit", "Split pages"), "chkSplit"));
                previewdlg.add(self._createSeparator());
                previewdlg.add(buttons);

                buttons.add(self._createInputButton(css_dlg_button + " " + css_previewdlg_printall, this.localizeString("previewDialogPrintAll", "Print All")));
                buttons.add(self._createInputButton(css_dlg_button + " " + css_previewdlg_printone, this.localizeString("previewDialogPrintPage", "Print Page")));
                buttons.add(self._createInputButton(css_dlg_button + " " + css_previewdlg_ok, this.localizeString("dialogOK", "OK")));

                previewdlg.add(self._createSeparator());
                previewdlg.add(navigate);
                navigate.add(wijribbonDataRender.createElement("a", this.localizeString("previewDialogPrevPage", "Prev page"), {
                    "class": css_previewdlg_prev,
                    href: "#"
                }));
                navigate.add(wijribbonDataRender.createElement("span", "1 / 1"));
                navigate.add(wijribbonDataRender.createElement("a", this.localizeString("previewDialogNextPage", "Next page"), {
                    "class": css_previewdlg_next,
                    href: "#"
                }));

                previewdlg.add(wijribbonDataRender.createDiv(css_previewdlg_printdocument));
                previewdlg.add(previewFrame);
                previewFrame.add(wijribbonDataRender.createElement("iframe", { src: "about:blank" }));

                return previewdlg.render();
            };

            wijeditor.prototype._getDialogRes_CleanUp = function () {
                var self = this, cleanupdlg = wijribbonDataRender.createDiv(css_cleanupdlg), caption = wijribbonDataRender.createDiv(css_cleanupdlg_caption), doc = wijribbonDataRender.createDiv(css_cleanupdlg_document), actions = wijribbonDataRender.createDiv(css_cleanupdlg_actions), actionsArr = [
                    {
                        id: "replaceSpans",
                        label: this.localizeString("cleanUpDialogStripSpanTag", "Strip SPAN tag")
                    },
                    {
                        id: "replaceClass",
                        label: this.localizeString("cleanUpDialogStripClass", "Strip CLASS tag")
                    },
                    {
                        id: "replaceStyle",
                        label: this.localizeString("cleanUpDialogStripStyle", "Strip STYLE attribute")
                    },
                    {
                        id: "replaceNbsp",
                        label: this.localizeString("cleanUpDialogReplaceSymbol", "Replace &amp;nbsp; symbol")
                    },
                    {
                        id: "transformPtoDiv",
                        label: this.localizeString("cleanUpDialogTransformParagraphToDIV", "Transform Paragraph to DIV")
                    }];

                cleanupdlg.add(caption);
                caption.add(wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("cleanUpDialogDocumentSource", "Document source :")));

                cleanupdlg.add(doc);
                doc.add(wijribbonDataRender.createElement("textarea", { readonly: "readonly" }));

                cleanupdlg.add(actions);
                $.each(actionsArr, function (i, act) {
                    actions.add(wijribbonDataRender.createCheckbox(act.id));
                    actions.add(wijribbonDataRender.createLabel(act.label, act.id));
                });

                cleanupdlg.add(self._createSeparator());
                cleanupdlg.add(self._createOKCancelButtons());

                return cleanupdlg.render();
            };

            wijeditor.prototype._getDialogRes_FindAndReplace = function () {
                var self = this, finddlg = wijribbonDataRender.createDiv(css_finddlg), find = wijribbonDataRender.createDiv(css_finddlg_find), replace = wijribbonDataRender.createDiv(css_finddlg_replace), buttons = wijribbonDataRender.createDiv(css_dlg_buttons);

                finddlg.add(find);
                find.add(wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("findAndReplaceDialogFind", "Find:")));
                find.add(wijribbonDataRender.createElement("textarea", "text"));

                finddlg.add(replace);
                replace.add(wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("findAndReplaceDialogReplace", "Replace:")));
                replace.add(wijribbonDataRender.createElement("textarea"));

                finddlg.add(self._createSeparator());
                finddlg.add(buttons);
                buttons.add(self._createInputButton(css_dlg_button, this.localizeString("findAndReplaceDialogFindButton", "Find")));
                buttons.add(self._createInputButton(css_dlg_button, this.localizeString("findAndReplaceDialogReplaceButton", "Replace")));

                return finddlg.render();
            };

            wijeditor.prototype._getDialogRes_Media = function () {
                var self = this, meddlg = wijribbonDataRender.createDiv(css_mediadlg), type = wijribbonDataRender.createDiv(css_mediadlg_type);

                meddlg.add(type);
                type.add(wijribbonDataRender.createSpan(css_dlg_text, this.localizeString("mediaDialogMediaType", "Media Type :")));
                type.add(wijribbonDataRender.createSelect("", ["flash", "video", "applet", "other"]));

                meddlg.add(self._createTextField(this.localizeString("mediaDialogMediaUrl", "Media Url :"), css_mediadlg_url));
                meddlg.add(self._createTextField(this.localizeString("mediaDialogWidth", "Width :"), css_mediadlg_width, this.localizeString("dialogPixel", "px"), 200));
                meddlg.add(self._createTextField(this.localizeString("mediaDialogHeight", "Height :"), css_mediadlg_height, this.localizeString("dialogPixel", "px"), 200));
                meddlg.add(self._createSeparator());
                meddlg.add(self._createOKCancelButtons());

                return meddlg.render();
            };

            wijeditor.prototype._getDialogRes_SpecialCharacter = function () {
                var self = this, chardlg = wijribbonDataRender.createDiv(css_specialchardlg), chars = wijribbonDataRender.createDiv(css_specialchardlg_chars), preview = wijribbonDataRender.createDiv(css_specialchardlg_preview), content = wijribbonDataRender.createDiv(css_specialchardlg_content), list = wijribbonDataRender.createDiv(css_specialchardlg_list), punctuationLabel = wijribbonDataRender.createDiv(css_specialchardlg_label, "Punctuation"), punctuation = wijribbonDataRender.createDiv(css_specialchardlg_punctuation), punctuationArr = [
                    "&#8211;", "&#8212;", "&iexcl;", "&iquest;",
                    "&quot;", "&laquo;", "&raquo;", "&nbsp;"], symbolsLabel = wijribbonDataRender.createDiv(css_specialchardlg_label, "Symbols"), symbols = wijribbonDataRender.createDiv(css_specialchardlg_symbols), symbolsArr = [
                    "&amp;", "&cent;", "&copy;", "&divide;", "&gt;", "&lt;",
                    "&micro;", "&#8226;", "&para;", "&plusmn;",
                    "&#8364;", "&pound;", "&reg;", "&sect;", "&yen;"], diacriticsLabel = wijribbonDataRender.createDiv(css_specialchardlg_label, "Diacritics"), diacritics = wijribbonDataRender.createDiv(css_specialchardlg_diacritics), diacriticsArr = [
                    "&aacute;", "&Aacute;", "&agrave;", "&Agrave;",
                    "&acirc;", "&Acirc;", "&aring;", "&Aring;",
                    "&atilde;", "&Atilde;", "&auml;", "&Auml;",
                    "&aelig;", "&AElig;", "&ccedil;", "&Ccedil;",
                    "&eacute;", "&Eacute;", "&egrave;", "&Egrave;",
                    "&ecirc;", "&Ecirc;", "&euml;", "&Euml;",
                    "&iacute;", "&Iacute;", "&igrave;", "&Igrave;",
                    "&icirc;", "&Icirc;", "&iuml;", "&Iuml;",
                    "&ntilde;", "&Ntilde;", "&oacute;", "&Oacute;",
                    "&ograve;", "&Ograve;", "&ocirc;", "&Ocirc;",
                    "&oslash;", "&Oslash;", "&otilde;", "&Otilde;",
                    "&ouml;", "&Ouml;", "&uacute;", "&Uacute;",
                    "&ugrave;", "&Ugrave;", "&ucirc;", "&Ucirc;",
                    "&uuml;", "&Uuml;", "&szlig;", "&yuml;",
                    "&#8216;", "&#8217;"], buttons = wijribbonDataRender.createDiv(css_dlg_buttons);

                chardlg.add(chars);

                chars.add(preview);
                preview.add(content);
                content.add(wijribbonDataRender.createElement("span"));

                chars.add(list);
                list.add(punctuationLabel);
                punctuationLabel.add(punctuation);

                $.each(punctuationArr, function (i, n) {
                    punctuation.add(wijribbonDataRender.createLabel(n));
                });

                list.add(symbolsLabel);
                symbolsLabel.add(symbols);
                $.each(symbolsArr, function (i, n) {
                    symbols.add(wijribbonDataRender.createLabel(n));
                });

                list.add(diacriticsLabel);
                diacriticsLabel.add(diacritics);
                $.each(diacriticsArr, function (i, n) {
                    diacritics.add(wijribbonDataRender.createLabel(n));
                });

                chardlg.add(self._createSeparator());

                buttons.add(self._createInputButton(css_dlg_button, self.localizeString("dialogCancel", "Cancel")));
                chardlg.add(buttons);

                return chardlg.render();
            };

            wijeditor.prototype._copyFromClipboard = function () {
                var clip, trans, str, strLength;

                if (wijWindow.clipboardData) {
                    return wijWindow.clipboardData.getData('Text');
                } else if ($.browser.mozilla) {
                    try  {
                        if (netscape.security.PrivilegeManager.enablePrivilege) {
                            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                        }
                    } catch (ex) {
                    }

                    clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);

                    if (!clip) {
                        return false;
                    }

                    trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
                    if (!trans) {
                        return false;
                    }

                    trans.addDataFlavor("text/unicode");
                    clip.getData(trans, clip.kGlobalClipboard);
                    trans.getTransferData("text/unicode", str, strLength);

                    if (str) {
                        str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
                    }

                    if (str) {
                        return str.data.substring(0, strLength.value / 2);
                    }

                    return "";
                }
            };

            wijeditor.prototype._copyToClipboard = function (copyText) {
                var clip, trans, clipid, str = {}, len = {};

                if (wijWindow.clipboardData && copyText) {
                    wijWindow.clipboardData.setData("Text", copyText);
                } else if ($.browser.mozilla) {
                    try  {
                        if (netscape.security.PrivilegeManager.enablePrivilege) {
                            netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                        }

                        clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);

                        if (!clip) {
                            return;
                        }

                        trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);

                        if (!trans) {
                            return;
                        }

                        trans.addDataFlavor('text/unicode');

                        len = {};

                        str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);

                        str.data = copyText;

                        trans.setTransferData("text/unicode", str, copyText.length * 2);
                        clipid = Components.interfaces.nsIClipboard;

                        if (!clip) {
                            return false;
                        }

                        clip.setData(trans, null, clipid.kGlobalClipboard);
                    } catch (e) {
                        str = "Copy text to Clipboard \n";
                        str += "If you are using firefox please do the following :\n ";
                        str += "1. Write in your url box : 'about:config'\n";
                        str += "2. Change signed.applets.codebase_principal_support = true\n";
                        wijAlert(this.localizeString("errorMessageCopyToClipboardError", str));
                    }
                }
            };

            /** @ignore */
            wijeditor.prototype.fixAbsoluteUrlsIfNeeded = function (html) {
                var self = this, sBaseDocUrl = wijDoc.URL, sBaseUrl = wijDoc.URL, sRootBaseUrl = wijDoc.URL, baseUrlFound = false, len = sBaseUrl.length, ret = html, ch, ch2, s1, r, s2, s3, i, pos;

                for (i = len - 1; i > 0; i--) {
                    ch = sBaseUrl.charAt(i);
                    ch2 = sBaseUrl.charAt(i - 1);

                    if (ch === '/' || ch === '\\') {
                        if (ch === ch2) {
                            break;
                        }

                        sRootBaseUrl = sBaseUrl.substring(0, i) + ch;

                        if (!baseUrlFound) {
                            sBaseUrl = sRootBaseUrl;
                            baseUrlFound = true;
                        }
                    }
                }

                s1 = self._prepareLiteralRegexText(sBaseDocUrl + '?');
                r = new RegExp(s1, 'g');
                ret = ret.replace(r, '?');

                s2 = self._prepareLiteralRegexText(sBaseUrl);
                r = new RegExp(s2, 'g');
                ret = ret.replace(r, '');

                s3 = self._prepareLiteralRegexText(sRootBaseUrl);
                r = new RegExp(s3, 'g');
                ret = ret.replace(r, '/');

                pos = ret.indexOf('#');

                if (pos > -1) {
                    ret = ret.substr(pos);
                }

                return ret;
            };

            wijeditor.prototype._insertCell = function (row, idx) {
                var newCell = row.insertCell(idx);

                newCell.innerHTML = '&nbsp;';

                return newCell;
            };

            wijeditor.prototype._getDictionaryDeclare = function () {
                var attrs = {};

                attrs.a = [
                    'accesskey', 'charset', 'class', 'coords', 'dir',
                    'href', 'hreflang', 'id', 'lang', 'name', 'rel',
                    'rev', 'shape', 'tabindex', 'target', 'title'];

                attrs.b = ['class', 'dir', 'id', 'lang', 'title'];

                attrs.body = [
                    'alink', 'background', 'bgColor', 'bgproperties',
                    'bottommargin', 'class', 'dir', 'id', 'lang',
                    'leftmargin', 'link', 'marginheight', 'marginwidth',
                    'rightmargin', 'text', 'title', 'topmargin', 'vlink'];

                attrs.button = [
                    'accesskey', 'class', 'dir', 'disabled', 'id',
                    'lang', 'name', 'tabindex', 'title', 'type', 'value'];

                attrs.code = ['class', 'dir', 'id', 'lang', 'title'];

                attrs.div = ['align', 'class', 'dir', 'id', 'lang', 'title'];

                attrs.em = ['class', 'dir', 'id', 'lang', 'title'];

                attrs.font = [
                    'class', 'color', 'dir', 'face', 'id',
                    'lang', 'pointsize', 'size', 'title'];

                attrs.form = [
                    'action', 'class', 'dir', 'enctype', 'id', 'lang',
                    'method', 'name', 'runat', 'target', 'title'];

                attrs.hr = [
                    'align', 'class', 'color', 'id', 'noshade',
                    'size', 'title', 'width'];

                attrs.i = ['class', 'dir', 'id', 'lang', 'title'];

                attrs.img = [
                    'align', 'alt', 'border', 'class', 'controls',
                    'dir', 'dynsrc', 'height', 'hspace', 'id', 'ismap',
                    'lang', 'longdesc', 'loop', 'lowsrc', 'name', 'src',
                    'start', 'title', 'usemap', 'vspace', 'width'];

                attrs.input = [
                    'accept', 'accesskey', 'align', 'alt', 'border',
                    'checked', 'class', 'dir', 'disabled', 'height',
                    'hspace', 'id', 'lang', 'maxlength', 'name',
                    'readonly', 'size', 'src', 'tabindex', 'title',
                    'type', 'usemap', 'value', 'vspace', 'width'];

                attrs.label = [
                    'accesskey', 'class', 'dir', 'for', 'id',
                    'lang', 'title'];

                attrs.li = ['class', 'dir', 'id', 'lang', 'title', 'type', 'value'];

                attrs.ol = [
                    'class', 'compact', 'dir', 'id', 'lang',
                    'start', 'title', 'type'];

                attrs.option = [
                    'class', 'dir', 'disabled', 'id', 'label',
                    'lang', 'selected', 'title', 'value'];

                attrs.p = ['align', 'class', 'dir', 'id', 'lang', 'title'];

                attrs.span = ['class', 'dir', 'id', 'lang', 'title'];

                attrs.strong = ['class', 'dir', 'id', 'lang', 'title'];

                attrs.select = [
                    'accesskey', 'class', 'dir', 'disabled', 'id', 'lang',
                    'multiple', 'name', 'size', 'tabindex', 'title'];

                attrs.table = [
                    'align', 'background', 'bgColor', 'border',
                    'bordercolor', 'bordercolordark', 'bordercolorlight',
                    'cellpadding', 'cellspacing', 'class', 'cols',
                    'datapagesize', 'dir', 'frame', 'height', 'hspace',
                    'id', 'lang', 'rules', 'summary', 'title', 'vspace', 'width'];

                attrs.td = [
                    'abbr', 'align', 'axis', 'background', 'bgColor',
                    'bordercolor', 'bordercolordark', 'bordercolorlight',
                    'class', 'colspan', 'dir', 'headers', 'height', 'id',
                    'lang', 'nowrap', 'rowspan', 'scope', 'title', 'valign', 'width'];

                attrs.th = [
                    'abbr', 'align', 'axis', 'background', 'bgColor', 'bordercolor',
                    'bordercolordark', 'bordercolorlight', 'class', 'colspan',
                    'dir', 'headers', 'height', 'id', 'lang', 'nowrap', 'rowspan',
                    'scope', 'title', 'valign', 'width'];

                attrs.tr = [
                    'align', 'bgColor', 'bordercolor', 'bordercolordark',
                    'bordercolorlight', 'class', 'dir', 'height', 'id',
                    'lang', 'nowrap', 'title', 'valign'];

                attrs.tbody = [
                    'align', 'bgColor', 'class', 'dir', 'id', 'lang',
                    'title', 'valign'];

                attrs.textarea = [
                    'accesskey', 'class', 'cols', 'dir', 'disabled',
                    'id', 'label', 'lang', 'name', 'readonly', 'rows',
                    'tabindex', 'title', 'wrap'];

                attrs.u = ['class', 'id', 'xml:lang'];

                attrs.ul = ['class', 'compact', 'dir', 'id', 'lang', 'title', 'type'];

                return attrs;
            };

            wijeditor.prototype._generateUniqueName = function (prefix) {
                var idx = uniqueIds[prefix];

                if (!idx) {
                    idx = 0;
                }

                uniqueIds[prefix] = ++idx;

                return prefix + idx;
            };

            wijeditor.prototype._setContentEditable = function (doc, isEditable) {
                var designMode = "designMode", contentEditable = "contentEditable";

                try  {
                    if (doc.body[contentEditable]) {
                        doc.body[contentEditable] = isEditable.toString();
                    }

                    if (doc[designMode]) {
                        if (!isEditable && doc[designMode] !== 'off') {
                            doc[designMode] = 'off';
                        } else if (isEditable && doc[designMode] !== 'on') {
                            //update for ie9 can't select the content after scroll.
                            //fix the original content will be clear if setting designmode to on in ie10.
                            if (!($.browser.msie && wijParseInt($.browser.version) >= 9 && wijParseInt($.browser.version) < 11)) {
                                doc[designMode] = 'on';
                            }
                        }
                    }

                    if (isEditable && !$.browser.msie) {
                        doc.execCommand('useCSS', false, true);
                    }
                } catch (e) {
                }
            };

            wijeditor.prototype._setContentSpellCheck = function (doc, isSpellCheck) {
                var spellcheck = "spellcheck";
                try  {
                    if (doc.body[spellcheck] !== undefined) {
                        doc.body[spellcheck] = isSpellCheck;
                    }
                } catch (e) {
                }
            };

            wijeditor.prototype._formatString = function (str, len) {
                var strLen = str.length, i;

                for (i = 0; i < len - strLen; i++) {
                    str = '0' + str;
                }

                return str;
            };

            wijeditor.prototype._convertToWebColor = function (r, g, b) {
                var self = this, hr, hg, hb, result;

                if (isNaN(r) || 255 - r < 0) {
                    r = 0;
                }

                if (isNaN(g) || 255 - g < 0) {
                    g = 0;
                }

                if (isNaN(b) || 255 - b < 0) {
                    b = 0;
                }

                hr = self._formatString(wijParseInt(r).toString(16), 2);
                hg = self._formatString(wijParseInt(g).toString(16), 2);
                hb = self._formatString(wijParseInt(b).toString(16), 2);
                result = '#' + hr + hg + hb;

                return result;
            };

            wijeditor.prototype._prepareLiteralRegexText = function (s1) {
                var ret = s1;

                ret = ret.replace(/\\/g, '\\\\');
                ret = ret.replace(/\./g, '\\.');
                ret = ret.replace(/\?/g, '\\?');

                return ret;
            };

            wijeditor.prototype._isNumeric = function (str) {
                return new RegExp('^\\d+$').test(str);
            };

            wijeditor.prototype._isEmail = function (str) {
                return new RegExp('mailto:(\\S)+[@]{1}(\\S)+[.]{1}(\\w)+').test(str);
            };

            wijeditor.prototype._isUrl = function (str) {
                return new RegExp('[a-zA-z]+://[^s]+').test(str);
            };

            wijeditor.prototype._isAnchor = function (str) {
                if (new RegExp('#[^s]+').test(str)) {
                    return true;
                } else if (new RegExp('[a-zA-z]+://[^s]+#[^s]+').test(str)) {
                    return true;
                } else {
                    return false;
                }
            };

            /** Adjust the editor layout.*/
            wijeditor.prototype.refresh = function () {
                var self = this, doc = self._getDesignViewDocument(), element = self.element, header = self._getHeader(), footer = self._getFooter(), headerHeight = header.outerHeight(true), footerHeight = footer.outerHeight(true), width = self._oriEleWidth, height = self._oriEleHeight, content = self._getContent(), contentHeight;

                self.editor.width(width).height(height);

                this.$ribbon.wijribbon("updateRibbonSize");

                // the ribbon has not resized completed, so can't get
                // the correct header width, get the updated height when the element is visible.
                window.setTimeout(function () {
                    if (self.editor.is(":visible")) {
                        headerHeight = header.outerHeight(true);
                        footerHeight = footer.outerHeight(true);
                    }
                    contentHeight = self.editor.height() - headerHeight - footerHeight;
                    content.height(contentHeight);
                    if (content.data("wijmo-wijsplitter")) {
                        if (self.options.editorMode === "split") {
                            content.wijsplitter("option", "splitterDistance", contentHeight / 2);
                        } else {
                            content.wijsplitter("refresh");
                        }
                    }
                }, 0);

                if ($.browser.mozilla) {
                    setTimeout(self._setDesignModeForFF, 1000, self);
                } else {
                    self._setContentEditable(doc, true);
                }
            };

            /** Gets the text displayed in the editor.*/
            wijeditor.prototype.getText = function () {
                var self = this;

                return self._getDesignViewText();
            };

            /** Sets the text to display in the editor.
            * @remarks
            *   You can use the example code in a click function linked to a button,
            *   and replace any existing text in the editor with your text.
            * @param {string} text The text to show in the editor.
            */
            wijeditor.prototype.setText = function (text) {
                var self = this;

                if (text) {
                    self._setDesignViewText(text);
                    self.sourceView.val(text);
                }
            };

            /** @ignore */
            wijeditor.prototype.localizeString = function (key, defaultValue) {
                var o = this.options;
                if (o.localization && o.localization[key]) {
                    return o.localization[key];
                }
                return defaultValue;
            };

            //end of public method
            /** dom operation*/
            wijeditor.prototype._getParentElement = function (contentWin) {
                var self = this, range = self._getRange(contentWin), selection, startContainer, endContainer, startOffset, endOffset;

                if (!range) {
                    return null;
                }

                if (range.commonAncestorContainer) {
                    selection = contentWin.getSelection();
                    startContainer = range.startContainer || selection.baseNode;
                    endContainer = range.endContainer || selection.extentNode;
                    startOffset = range.startOffset;

                    if (startOffset === null) {
                        startOffset = selection.baseOffset;
                    }

                    endOffset = range.endOffset;

                    if (endOffset === null) {
                        endOffset = selection.extentOffset;
                    }

                    if (startContainer === endContainer && (endOffset - startOffset) === 1) {
                        return selection.anchorNode.childNodes[selection.anchorOffset];
                    }

                    if (!range.commonAncestorContainer.tagName) {
                        if (contentWin.document === range.commonAncestorContainer && selection.baseNode) {
                            return selection.baseNode.parentNode;
                        }

                        return range.commonAncestorContainer.parentNode;
                    }

                    return range.commonAncestorContainer;
                }

                if (range.length) {
                    return range.item(0);
                }

                if (range.parentElement) {
                    return range.parentElement();
                }

                return null;
            };

            wijeditor.prototype._getRange = function (contentWin) {
                var selection, range;

                if (contentWin.document.selection && !wijWindow.opera) {
                    return contentWin.document.selection.createRange();
                }

                if (contentWin.getSelection) {
                    selection = contentWin.getSelection();
                    if (!selection || selection.rangeCount < 1) {
                        return null;
                    }

                    if (selection.getRangeAt) {
                        range = selection.getRangeAt(0);
                    } else {
                        range = contentWin.document.createRange();
                    }

                    return range;
                }
            };

            //gets inspect element.
            wijeditor.prototype._getInspectElement = function () {
                return inspectElement || this._getSelectedElement();
            };

            wijeditor.prototype._getSelectedElement = function () {
                return this._getParentElement(this._getDesignViewWindow());
            };

            //end of gets inspect element.
            wijeditor.prototype._checkSelectionIncludeNodeForIE11AndChrome = function (win, range, nodeEle) {
                var doc = win.document, newRange;
                if (range) {
                    newRange = doc.createRange();
                    newRange.selectNode(nodeEle);
                    if (range.compareBoundaryPoints(Range.START_TO_END, newRange) <= 0 || range.compareBoundaryPoints(Range.END_TO_START, newRange) >= 0) {
                        return false;
                    }
                }
                return true;
            };

            wijeditor.prototype._checkSelectionIncludeNodeExceptIE11 = function (win, range, nodeEle) {
                var doc = win.document, newRange = doc.selection.createRange(), cep = "compareEndPoints";

                if (range) {
                    newRange.moveToElementText(nodeEle);

                    if (range.inRange(newRange) || (range[cep]('StartToStart', newRange) >= 0 && range[cep]('StartToEnd', newRange) <= 0) || (range[cep]('EndToStart', newRange) >= 0 && range[cep]('EndToEnd', newRange) <= 0)) {
                        return true;
                    }
                }

                return false;
            };

            wijeditor.prototype._getIESelectionRange = function () {
                var self = this, win = this._getDesignViewWindow(), doc = win.document, selection, range;

                if (self._isIE11) {
                    selection = win.getSelection();
                    if (selection && selection.rangeCount > 0) {
                        range = selection.getRangeAt(0);
                    }
                } else {
                    range = doc.selection.createRange();
                }
                return range;
            };

            //focus related methods in ie.
            wijeditor.prototype._setIESelection = function (range, notUseDefaultValue) {
                var doc;

                if (!$.browser.msie) {
                    return;
                }

                if (!range && !notUseDefaultValue) {
                    range = this.rangeSelection;
                }

                if (range) {
                    try  {
                        doc = this._getDesignViewDocument();
                        if (this._isIE11 && doc.getSelection) {
                            doc.getSelection().addRange(range);
                        } else {
                            range.select();
                        }
                    } catch (e) {
                        doc.body.focus();
                    }
                }
            };

            //get selected content.
            wijeditor.prototype._getSelectedContent = function () {
                var win = this._getDesignViewWindow(), doc = win.document, selectedContent = "", cloneContents = "cloneContents", range, contents, helperDiv;

                if (!doc.selection) {
                    range = win.getSelection().getRangeAt(0);

                    if (range) {
                        if (range[cloneContents]) {
                            contents = range[cloneContents]();
                            helperDiv = document.createElement('div');
                            helperDiv.appendChild(contents);
                            selectedContent = helperDiv.innerHTML;
                            helperDiv = null;
                        }
                    }
                } else {
                    range = doc.selection.createRange();
                    return range.htmlText;
                }

                return selectedContent || "";
            };

            //end of get selected content.
            wijeditor.prototype._getHtmlTextInIE = function (doc) {
                if (!$.browser.msie || !doc) {
                    return "";
                }
                var htmlText = "", selection;

                if (this._isIE11 && doc.getSelection) {
                    selection = doc.getSelection();
                    htmlText = selection.getRangeAt && selection.rangeCount ? selection.getRangeAt(0).toString() : "";
                } else {
                    htmlText = doc.selection.createRange().htmlText;
                }
                return htmlText;
            };

            wijeditor.prototype._saveSelectionForIE = function () {
                var doc = this._getDesignViewWindow().document, selection, selectionElement, range;
                if (!$.browser.msie)
                    return;
                if (this._isIE11 && doc.getSelection) {
                    selection = doc.getSelection();
                    this.rangeSelection = selection.getRangeAt && selection.rangeCount ? selection.getRangeAt(0) : null;
                    return;
                }
                selection = doc.selection;
                range = selection.createRange();
                if ($.browser.version && parseFloat($.browser.version) >= 9 && parseFloat($.browser.version) <= 10 && range.parentElement) {
                    selectionElement = range.parentElement();
                    if (selectionElement && selectionElement.tagName == "INPUT" && selectionElement.type == "hidden") {
                        return;
                    }
                }
                this.rangeSelection = range;
            };

            wijeditor.prototype._storeSelectionForIE = function () {
                var doc = this._getDesignViewWindow().document, range, preSelectionRange, start, startContainerText;

                if (!$.browser.msie) {
                    return;
                }

                if (doc.selection) {
                    range = doc.selection.createRange();
                    if (range.getBookmark) {
                        this.bookmark = range.getBookmark();
                    }
                } else if (doc.getSelection) {
                    if (doc.getSelection().rangeCount) {
                        range = doc.getSelection().getRangeAt(0);
                        preSelectionRange = range.cloneRange();
                        preSelectionRange.selectNode(doc.body);
                        preSelectionRange.setEnd(range.startContainer, range.startOffset);
                        start = preSelectionRange.toString().length;

                        // If the startContainer is text node, store the text value,  else, store the innerHTML.
                        if (range.startContainer.nodeType === 3) {
                            startContainerText = range.startContainer.nodeValue;
                        } else {
                            startContainerText = range.startContainer.innerHTML;
                        }
                        this.bookmark = {
                            startContainerText: startContainerText,
                            start: start,
                            end: start + range.toString().length
                        };
                    }
                }
            };

            wijeditor.prototype._restoreSelectionForIE = function (checkMoveToBookmark) {
                var _this = this;
                var win = this._getDesignViewWindow(), doc = win.document, foundStartContainer = false, moveToBookmarkInterval, moveToBookmarkCounter = 0, moveToBookmarkSuccess, range, start, startContainerText, nodeStack, isStop, node, charIndex, nextCharIndex, foundStart, end, sel, i;
                if (!this.bookmark || !$.browser.msie) {
                    return;
                }

                if (doc.selection) {
                    if (checkMoveToBookmark) {
                        moveToBookmarkInterval = setInterval(function () {
                            moveToBookmarkCounter++;
                            if (moveToBookmarkCounter > 5 || moveToBookmarkSuccess) {
                                range.select();
                                _this.bookmark = null;
                                clearInterval(moveToBookmarkInterval);
                            } else {
                                range = doc.body.createTextRange();
                                moveToBookmarkSuccess = range.moveToBookmark(_this.bookmark);
                            }
                        }, 50);
                    } else {
                        range = doc.body.createTextRange();
                        if (range.moveToBookmark(this.bookmark)) {
                            range.select();
                        }
                        this.bookmark = null;
                    }
                } else if (doc.getSelection) {
                    start = this.bookmark.start;
                    end = this.bookmark.end;
                    startContainerText = this.bookmark.startContainerText;
                    range = doc.createRange();
                    range.setStart(doc.body, 0);
                    nodeStack = [doc.body];
                    charIndex = 0;
                    while (!isStop && (node = nodeStack.pop())) {
                        if (node.nodeType == 3) {
                            nextCharIndex = charIndex + node.length;
                            if (!foundStart && (foundStartContainer || node.nodeValue === startContainerText) && start >= charIndex && start <= nextCharIndex) {
                                range.setStart(node, start - charIndex);
                                foundStart = true;
                            }
                            if (foundStart && end >= charIndex && end <= nextCharIndex) {
                                range.setEnd(node, end - charIndex);
                                isStop = true;
                            }
                            charIndex = nextCharIndex;
                        } else {
                            // if the stored startContainer is not textNode, here to find the startContainer.
                            if (node.innerHTML === startContainerText) {
                                foundStartContainer = true;
                            }
                            i = node.childNodes.length;
                            while (i--) {
                                nodeStack.push(node.childNodes[i]);
                            }
                        }
                    }

                    sel = win.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    this.rangeSelection = null;
                    this.bookmark = null;
                }
            };

            wijeditor.prototype._setSelection = function ($nodes, start, length) {
                var win = this._getDesignViewWindow(), doc = win.document, range, startNode, endNode, selection, len = 0;

                try  {
                    if (window.getSelection) {
                        selection = win.getSelection();
                        range = doc.createRange();
                        startNode = $nodes[0][0];
                        endNode = $nodes[$nodes.length - 1][0];
                        range.setStart(startNode, 0);
                        range.setEnd(endNode, endNode.childNodes.length);

                        selection.removeAllRanges();
                        selection.addRange(range);
                    } else {
                        range = doc.selection.createRange();

                        if ($nodes) {
                            $.each($nodes, function (idx, $node) {
                                len += $node.text().length;
                            });

                            range.moveToElementText($nodes[0][0]);
                            range.collapse(true);
                            range.moveEnd("character", len);
                        } else {
                            range.moveStart("textedit", -1);
                            range.collapse(true);
                            range.moveStart("character", start);
                            range.moveEnd("character", length);
                        }

                        range.select();
                    }
                } catch (e) {
                }
            };

            wijeditor.prototype._getHyperLinkElement = function (inspElem) {
                while (inspElem && inspElem.tagName !== 'A') {
                    if (inspElem.tagName === 'BODY' || inspElem.tagName === 'HTML') {
                        break;
                    }
                    inspElem = inspElem.parentElement;
                }
                return inspElem;
            };
            return wijeditor;
        })(wijmo.wijmoWidget);
        editor.wijeditor = wijeditor;

        var wijeditor_options = (function () {
            function wijeditor_options() {
                /** Selector option for auto self initialization. This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijeditor')";
                /** Set to the selector that returns the container to fill when the user
                *   selects full screen mode.By default, it fills the client's area on the web page.
                * @remarks
                *       Once set , you can refer to this string in the ID attribute of the container,
                *       for example < div id = "container" > < / div >.
                */
                this.fullScreenContainerSelector = "";
                /**  If the compactMode option is true and ribbon is not simple,it will show
                *   compact ribbon although the editor is full width.
                */
                this.compactRibbonMode = false;
                /** Set the type of editor to show initially.
                * @remarks
                *       It has three options: wysiwyg/code/split.
                *         wysiwyg -- A visual designer with toolbar buttons that allow you to format text.
                *         code -- A code view of the text that allows you to edit the HTML formatting.
                *         split -- A horizontally split editor with the visual designer in the top pane
                *                   and the code view in the bottom.In this mode, the user can resize the panes by
                *                   dragging the horizontal bar separating them up or down.
                */
                this.editorMode = "wysiwyg";
                /** Set this option to true to show the editor in full screen mode when the page is first opened.
                * @remarks
                *       The editor fills the client area of the page(or the container specified in the fullScreenContainerSelector option).
                *       Note that this only sets the initial mode.The user can still toggle fullScreenMode off
                *       using the button at the bottom right of the editor.
                */
                this.fullScreenMode = false;
                /**
                * The fontSizes option specifies the list of font size
                * which will be shown in the font size drop down list.
                * Use the option to customize font sizes.
                * @remarks
                * Each item includes:
                * tip: the dropdown item’s tip.
                * name: the really fontsize's value that apply.
                * text: the font size text that show on dropdown item.
                *   the default value is:
                *         [{
                *                tip: "VerySmall",
                *                name: "xx-small",
                *                text: "VerySmall"
                *            }, {
                *                tip: "Smaller",
                *                name: "x-small",
                *                text: "Smaller"
                *            }, {
                *                tip: "Small",
                *                name: "small",
                *                text: "Small"
                *            }, {
                *                tip: "Medium",
                *                name: "medium",
                *                text: "Medium"
                *            }, {
                *                tip: "Large",
                *                name: "large",
                *                text: "Large"
                *            }, {
                *                tip: "Larger",
                *                name: "x-large",
                *                text: "Larger"
                *            }, {
                *                tip: "VeryLarge",
                *                name: "xx-large",
                *                text: "VeryLarge"
                *            }]
                *
                * Note: The following Font size’ value is built-in font size, and
                * please refer https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html#the-fontsize-command
                *     1: x-small
                *     2: small
                *     3: medium
                *     4: large
                *     5: x-large
                *     6: xx-large
                *     7: xxx-large
                * Except these values, user can set the "pt" and "px" value to "name".
                */
                this.fontSizes = [
                    {
                        tip: "VerySmall",
                        name: "xx-small",
                        text: "VerySmall"
                    }, {
                        tip: "Smaller",
                        name: "x-small",
                        text: "Smaller"
                    }, {
                        tip: "Small",
                        name: "small",
                        text: "Small"
                    }, {
                        tip: "Medium",
                        name: "medium",
                        text: "Medium"
                    }, {
                        tip: "Large",
                        name: "large",
                        text: "Large"
                    }, {
                        tip: "Larger",
                        name: "x-large",
                        text: "Larger"
                    }, {
                        tip: "VeryLarge",
                        name: "xx-large",
                        text: "VeryLarge"
                    }];
                /**
                * The fontNames option specifies the list of font name
                * which will be shown in the font name drop down list.
                * Use the option to customize font names.
                * @remarks
                * Each item includes:
                * tip: the dropdown item’s tip.
                * name: the really fontname's value that apply.
                * text: the font name text that show on dropdown item.
                *   the default value is:
                *           [{
                *                tip: "Arial",
                *                 name: "fn1",
                *             text: "Arial"
                *           }, {
                *              tip: "Courier New",
                *                name: "fn2",
                *                text: "Courier New"
                *            }, {
                *                tip: "Garamond",
                *                name: "fn3",
                *                text: "Garamond"
                *            }, {
                *                tip: "Tahoma",
                *                name: "fn4",
                *                text: "Tahoma"
                *            }, {
                *                tip: "Times New Roman",
                *                name: "fn5",
                *                text: "Times New Roman"
                *            }, {
                *                tip: "Verdana",
                *                name: "fn6",
                *                text: "Verdana"
                *            }, {
                *                tip: "Wingdings",
                *                name: "fn7",
                *                text: "Wingdings"
                *            }]
                * Note: The "fn1, fn2,..., fn7" are wijmo built-in font size, indicate the safe web font family,
                * user can set others font family like css.
                */
                this.fontNames = [
                    {
                        tip: "Arial",
                        name: "fn1",
                        text: "Arial"
                    }, {
                        tip: "Courier New",
                        name: "fn2",
                        text: "Courier New"
                    }, {
                        tip: "Garamond",
                        name: "fn3",
                        text: "Garamond"
                    }, {
                        tip: "Tahoma",
                        name: "fn4",
                        text: "Tahoma"
                    }, {
                        tip: "Times New Roman",
                        name: "fn5",
                        text: "Times New Roman"
                    }, {
                        tip: "Verdana",
                        name: "fn6",
                        text: "Verdana"
                    }, {
                        tip: "Wingdings",
                        name: "fn7",
                        text: "Wingdings"
                    }];
                /** Select whether to show the path selector in the left side of the footer.
                * @remarks
                *       When you click in the content of the design view, the path selector shows HTML tags
                *       indicating where you are in the source view.If you set showFooter to false, this option is ignored.
                */
                this.showPathSelector = true;
                /** Specify which toolbar to render. Ribbon and simple modes allow you to customize the toolbar.
                * @remarks
                *       For more information on customizing the toolbar,
                *       see editor samples "Customize" and "Customize Simple."
                *       ribbon -- Includes the most commonly used tool buttons.
                *       simple -- Includes fewer buttons, is much smaller, and takes up less space.
                *        bbcode -- Includes buttons used with Bulletin Board Code,
                *                   a markup language used to format posts in message boards.
                */
                this.mode = "ribbon";
                /** Occurs when the command button is clicked.
                * @event
                * @dataKey {string} commandName The command name of the button.
                * @dataKey {string} name The parent name of the button which means
                *                      if the drop down item is clicked, then the name specifies the command name of the drop down button.
                */
                this.commandButtonClick = null;
                /** Specify an array of commands to display in customizing the simple toolbar.
                * @remarks
                *       Note that you must specify every command that you want to display,
                *       as these commands are used in place of the default commands.Therefore,
                *       the sample code shown below would only render two commands in the toolbar.
                *       The simple mode commands displayed by default are:
                *       "BlockQuote", "Bold", "BulletedList", "InsertCode", "InsertDate", "InsertImage",
                *       "Italic", "Link", "NumberedList", "NumberedList"
                *       Note: The buildin simple commands support the following commands:
                *       "Form","Image","TextArea","Button","TextBox","List","DropDownList",
                *       "HiddenField","Radio","CheckBox","JustifyLeft,"JustifyCenter",
                *       "JustifyRight","JustifyFull","Border","NumberedList","BulletedList",
                *       "Outdent","Indent","BackColor","ForeColor","Bold","Italic","UnderLine",
                *       "SubScript","SuperScript","Template","RemoveFormat","InsertBreak",
                *       "InsertParagraph","InsertPrint","InsertHR","Undo","Redo","Preview","Cleanup",
                *       "Cut","Copy","Paste","SelectAll","Media","InsertSpecialChar","InsertDate","Find",
                *       "Inspect","InsertImage","Link","FontName","FontSize","BlockQuote","InsertCode"
                *       The default simple mode commands are:
                *       ["Bold", "Italic", "Link", "BlockQuote",
                *       "StrikeThrough", "InsertDate", "InsertImage",
                *       "NumberedList", "BulletedList", "InsertCode"]
                * @example
                *        $("#wijeditor").wijeditor({
                *            mode: "simple",
                *            simpleModeCommands: ["Bold","Undo"]
                *         });
                */
                this.simpleModeCommands = null;
                /** Specify whether to show the footer at the bottom of the editor,
                *   where users can toggle full screen mode, word wrap, and view mode.
                * @remarks
                *       When you are in design view, the footer also displays the path selector,
                *       HTML tags showing your location in source view.
                */
                this.showFooter = true;
                /** Determines whether the custom context menu is shown.
                * @remarks
                *       Instead of the standard context menu items shown by the browser,
                *       the custom context menu has only three commands:
                *        Cut, Copy, and Paste.Note that the context menu is invalid in Safari.
                */
                this.customContextMenu = true;
                /** Set the text that appears in the editor.
                * @type {string}
                * @remarks
                *       Note that this overrides any text that you add in tags
                *       inside the textarea object that displays the widget.
                *       You can use HTML(or BBCode markup if you set the mode to bbcode) inside the string.
                */
                this.text = null;
                /** Occurs when the text changed.
                * @event
                * @dataKey {String} text The text of the editor.
                */
                this.textChanged = null;
                /** Use the localization option in order to localize text which not depends on culture.
                * @default {
                *       // tab names
                *       insertTab:               "Insert",
                *       formatTab:               "Format",
                *
                *       // group Names
                *       specialGroup:            "Special",
                *       formsGroup:              "Forms",
                *       breaksGroup:             "Breaks",
                *       tablesGroup:             "Tables",
                *       reviewGroup:             "Review",
                *       paragraphGroup:          "Paragraph",
                *       fontGroup:               "Font",
                *       actionsGroup:            "Actions",
                *
                *       // context Menu
                *       contextMenuCut:          "Cut",
                *       contextMenuCopy:         "Copy",
                *       contextMenuPaste:        "Paste",
                *
                *       // buttons
                *       formButtonTip:              "Form",
                *       imagebuttonButtonTip:       "Image Button",
                *       textareaButtonTip:          "TextArea",
                *       fontnameButtonTip:          "Font Name",
                *       fontnameButtonText:         "Font Name",
                *       fontsizeButtonTip:          "Font Size",
                *       fontsizeButtonText:         "Font Size",
                *       buttonButtonTip:            "Button",
                *       textboxButtonTip:           "TextBox",
                *       listButtonTip:              "ListBox",
                *       passwordfieldButtonTip:     "Password Field",
                *       dropdownlistButtonTip:      "DropDownList",
                *       hiddenfieldButtonTip:       "Hidden Field",
                *       radioButtonTip:             "RadioButton",
                *       checkboxButtonTip:          "CheckBox",
                *       insertcolButtonTip:         "Insert Column",
                *       insertrowButtonTip:         "Insert Row",
                *       insertcellButtonTip:        "Insert Cell",
                *       splitcellButtonTip:         "Split Cell",
                *       mergecellButtonTip:         "Merge Cell",
                *       deletecolButtonTip:         "Delete Column",
                *       deleterowButtonTip:         "Delete Row",
                *       deletecellButtonTip:        "Delete Cell",
                *       justifyleftButtonTip:       "Justify Left",
                *       justifycenterButtonTip:     "Justify Center",
                *       justifyrightButtonTip:      "Justify Right",
                *       justifyfullButtonTip:       "Justify Full",
                *       bordersButtonTip:           "Border",
                *       insertorderedlistButtonTip: "Numbered List",
                *       insertunorderedlistButtonTip:"Bulleted List",
                *       outdentButtonTip:            "Outdent",
                *       indentButtonTip:             "Indent",
                *       backcolorButtonTip:          "Background Color",
                *       fontcolorButtonTip:          "Font Color",
                *       boldButtonTip:               "Bold",
                *       italicButtonTip:             "Italic",
                *       strikethroughButtonTip:      "Strikethrough",
                *       underlineButtonTip:          "Underline",
                *       subscriptButtonTip:          "Subscript",
                *       superscriptButtonTip:        "Superscript",
                *       templateButtonTip:           "Template",
                *       removeformatButtonTip:       "RemoveFormat",
                *       insertbreakButtonTip:        "Insert Break",
                *       insertparagraphButtonTip:     "Insert Paragraph",
                *       insertprintpagebreakButtonTip: "Insert Print Page Break",
                *       inserthorizontalruleButtonTip: "Insert Horizontal Line",
                *       wysiwygButtonTip:              "Design View",
                *       splitButtonTip:                 "Split View",
                *       codeButtonTip:                  "Source View",
                *       wordwrapButtonTip:              "Wordwrap",
                *       fullscreenButtonTip:            "Fullscreen",
                *       undoButtonTip:                  "Undo",
                *       redoButtonTip:                  "Redo",
                *       previewButtonTip:               "Preview",
                *       cleanupButtonTip:               "Clean up",
                *       cutButtonTip:                   "Cut",
                *       copyButtonTip:                  "Copy",
                *       pasteButtonTip:                 "Paste",
                *       selectallButtonTip:             "Select All",
                *       mediaButtonTip:                  "Media",
                *       specialcharButtonTip:            "Insert Special Character",
                *       datetimeButtonTip:               "Insert Date Time",
                *       findButtonTip:                   "Find And Replace",
                *       findButtonText:                  "Find",
                *       inspectButtonTip:                "Tag Inspect",
                *       inspectButtonText:               "Inspect",
                *       saveButtonText:                  "Save",
                *       saveButtonTip:                   "Save",
                *       imagebrowserButtonTip:           "Image Browser",
                *       linkButtonTip:                   "Link",
                *       linkButtonText:                  "Link",
                *       blockquoteButtonTip:             "Block Quote",
                *       insertcodeButtonTip:             "Insert Code",
                *
                *       // table button
                *       tableButtonTip: "Table",
                *       tableButtonText: "Table",
                *       insertTableButtonTip:       "Insert Table",
                *       insertTableButtonText:      "Insert",
                *       editTableButtonTip:         "Edit Table",
                *       editTableButtonText:        "Edit",
                *
                *       // error message
                *       errorMessageCutError:		            "This function is not supported in current browser.  Plesse use (Ctrl + X).",
                *       errorMessageCopyError:  	            "This function is not supported in current browser. Plesse use (Ctrl + C).",
                *       errorMessagePasteError:	                "This function is not supported in current browser. Plesse use (Ctrl + V).",
                *       errorMessageTemplateNameError:	        "Please input a template name!",
                *       errorMessageTemplateFileError:	        "Please select a template file.",
                *       errorMessageValidTemplateFileError:		"Please select a valid template file.",
                *       errorMessageSelectImageError:		    "Please select a image.",
                *       errorMessageImageWidthError: 		    "Please input a number for 'Image width' textbox.",
                *       errorMessageImageHeightError:		    "Please input a number for 'Image height' textbox.",
                *       errorMessageAddressError:		        "Please input address!",
                *       errorMessageDisplayTextError:	        "Please input display text!",
                *       errorMessageHyperLinkImageUrlError:	    "Please input image url!,
                *       errorMessageHyperLinkImageWidthError	Please input correct image width!",
                *       errorMessageHyperLinkImageHeightError:	"Please input correct image height!",
                *       errorMessageHyperLinkUrl:		        "Please input correct url!",
                *       errorMessageHyperLinkAnchor:	        "Please input correct anchor!",
                *       errorMessageHyperLinkEmail:		        "Please input correct email!",
                *       errorMessageCopyToClipboardError:       "Copy text to Clipboard \n If you are using firefox please do the following :\n  1. Write in your url box : 'about:config'\n 2. Change signed.applets.codebase_principal_support = true\n",
                *       errorMessageRowsError: 	                "Please input a number for 'Rows' textbox.",
                *       errorMessageColumnsError:		        "Please input a number for 'Columns' textbox.",
                *       errorMessageTableWidthError: 	        "Please input a number for 'Table Width ' textbox.",
                *       errorMessageTableHeightError:	        "Please input a number for 'Table Height' textbox.",
                *       errorMessageSelectTableError:	        "Please select a table!",
                *       errorMessageReplaceStringError:         "please input replace string!",
                *       errorMessageFindTextError:		        "String Not Found!",
                *       errorMessageUrlEmptyError:		        "URL is empty!",
                *       errorMessageUrlCorrectError:	        "please input correct URL!",
                *       errorMessageMediaWidthError:	        "please input width of the media!",
                *       errorMessageMediaHeightError:	        "please input height of the media!",
                *       tableDialogBorderError:	                "Please input a number for 'Border thickness' textbox.",
                *       tableDialogCellPaddingError:	        "Please input a number for 'Cell Padding' textbox.",
                *       tableDialogCellSpacingError:	        "Please input a number for 'Cell Spacing' textbox.",
                *       notFindCommandError:                    "Cannot find the dialog with command name '",
                *
                *       // dialog common
                *       dialogOK:	    "OK",
                *       dialogCancel:  "Cancel",
                *       dialogPixel:	"px",
                
                *       // back color dialog
                *       backColorDialogTitle:		        "Set BackColor",
                *       backColorDialogSelectedColor:		"Selected Color:",
                *
                *       // specialCharacter Dialog
                *       specialCharacterDialogTitle:		"Insert special character",
                *
                *       // fore Color Dialog
                *       foreColorDialogTitle:		        "Set ForeColor",
                
                *       // insertCode Dialog
                *       insertCodeDialogInsertCode:		    "Insert Code",
                *       insertCodeDialogEnterSourceCode: 	"Enter source code:",
                *
                *       // template dialog
                *       templateDialogName:             	"Name :",
                *       templateDialogDescription:	        "Description :",
                *       templateDialogSelectTemplate:	    "Select Template:",
                *       templateDialogTemplatePreview:	    "Template Preview:",
                *       templateDialogDeleteSelected: 	    "Delete selected",
                *       templateDialogSaveCurrentPage:	    "Save current page as template",
                *       templateDialogApplyTemplate:		"Apply Template",
                *
                *       // image editor dialog
                *       imageEditorDialogImageSrc:		 "Image Src:",
                *       imageEditorDialogImageAltText:	 "Image alt text:",
                *       imageEditorDialogImageWidth:	 "Image width:",
                *       imageEditorDialogImageHeight:	 "Image height:",
                *       imageEditorDialogCssText:		 "Css text:",
                *       imageEditorDialogImageSrc:		 "Image Src:",
                *       imageEditorDialogImageBrowser: 	 "Image Browser",
                *
                *       // hyper link dialog
                *       hyperLinkDialogTarget:		    "Target :",
                *       hyperLinkDialogCss:			    "Css :",
                *       hyperLinkDialogAddress:		    "Address :",
                *       hyperLinkDialogUrl:			    "url",
                *       hyperLinkDialogAnchor:		    "anchor",
                *       hyperLinkDialogEmail:			"email",
                *       hyperLinkDialogIconType:		"Icon Type :",
                *       hyperLinkDialogText:			"text",
                *       hyperLinkDialogImage:			"image",
                *       hyperLinkDialogTextToDisplay:	"Text to display :",
                *       hyperLinkDialogInserthyperLink: "Insert hyperLink",
                *       insertHyperLinkMailTo:		     "mailto:",
                *
                *       // tab inspector dialog
                *       tagInspectorDialogSelectedTag:	                 "Selected tag :",
                *       tagInspectorDialogDisplayNotEmptyAttributes:	 "Display not empty attributes only",
                *       tagInspectorDialogAttributes:		             "Attributes:",
                *       tagInspectorDialogInnerHTML:		             "Inner HTML:",
                *       tagInspectorDialogCSSText:			             "Css Text:",
                *       tagInspectorDialogSave:		                     "Save",
                *       tagInspectorDialogTitle:	                     "Tag Inspector",
                *
                *       // table dialog
                *       tableDialogRows:				"Rows :",
                *       tableDialogColumns:				"Columns :",
                *       tableDialogTableWidth:			"Table Width :",
                *       tableDialogPixels:				"pixels",
                *       tableDialogBorder:				"Border thickness:",
                *       tableDialogCellPadding:			"Cell Padding :",
                *       tableDialogCellSpacing:			"Cell Spacing :",
                *       tableDialogCssText:				"Css Text :",
                *       tableDialogBackgroundColor:		"Background Color:",
                *       insertTableDialogTitle:	        "Insert Table",
                *       editTableDialogTitle:		    "Edit Table",
                *
                *       // preview dialog
                *       previewDialogPreviewSize:		"Preview Size:",
                *       previewDialogSplit:				"Split pages",
                *       previewDialogPrintAll:			"Print All",
                *       previewDialogPrintPage:			"Print Page",
                *       previewDialogPrevPage:			"Prev page",
                *       previewDialogNextPage:			"Next page",
                *       previewDialogPreview:		    "Preview",
                *
                *       // find and replace dialog
                *       findAndReplaceDialogFind:				"Find",
                *       findAndReplaceDialogReplace:			"Replace",
                *       findAndReplaceDialogFindButton:		    "Find",
                *       findAndReplaceDialogReplaceButton:	    "Replace",
                *       findAndReplaceDialogTitle: 		        "Find and replace",
                *
                *       // media dialog
                *       mediaDialogMediaType:			"Media Type :",
                *       mediaDialogMediaUrl:			"Media Url :",
                *       mediaDialogWidth:				"Width :",
                *       mediaDialogHeight:				"Height :",
                *       mediaDialogTitle:		        "Insert media",
                *
                *       // clean up dialog
                *       cleanUpDialogStripSpanTag:		        "Strip SPAN tag",
                *       cleanUpDialogStripClass:		        "Strip CLASS tag",
                *       cleanUpDialogStripStyle:		        "Strip STYLE attribute",
                *       cleanUpDialogReplaceSymbol:		        "Replace &amp;nbsp; symbol",
                *       cleanUpDialogTransformParagraphToDIV:	"Transform Paragraph to DIV",
                *       cleanUpDialogTitle:		                "Clean up source HTML document",
                *       cleanUpDialogDocumentSource:            "Document source"
                *}
                * @type {object}
                * @example $("#editor").wijeditor(
                *					{
                *						localization: {
                *							formButtonTip: "Add Form",
                *							insertTab: "Insert to Editor"
                *						}
                *					});
                */
                this.localization = null;
            }
            return wijeditor_options;
        })();
        ;
        wijeditor.prototype.options = $.extend(true, {}, wijmo.wijmoWidget.prototype.options, new wijeditor_options());

        //A value indicates whether to show the virtual border for table in the edit.
        //It only works when the border style is not set in table.
        wijeditor.prototype.options.tableVirtualBorderShowing = true;
        $.wijmo.registerWidget("wijeditor", wijeditor.prototype);

        //wijDoc = document,
        //wijParseInt = parseInt,
        //css_editor = "wijmo-wijeditor",
        var css_editor_colorcanvas = css_editor + "-colorcanvas", css_editor_color = css_editor + "-color", css_editor_wheel = css_editor + "-wheel", css_editor_overlay = css_editor + "-overlay", css_editor_marker = css_editor + "-marker";

        /** @ignore */
        $.fn.wijeditorcolorcanvas = function (callback, initColor) {
            //$.wijeditorcolorcanvas(this, callback, initColor);
            var container = this.get(0);
            return container.wijeditorcolorcanvas || (container.wijeditorcolorcanvas = new _wijeditorcolorcanvas(container, callback, initColor));
            return this;
        };

        /** @ignore */
        var _wijeditorcolorcanvas = (function () {
            function _wijeditorcolorcanvas(container, callback, initColor) {
                // Store editorcolorcanvas object
                var fb = this, markup = "", e, alphaImageLoader;

                alphaImageLoader = "progid:DXImageTransform.Microsoft.AlphaImageLoader" + "(enabled=true, sizingMethod=crop, ";

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
                if ($.browser.msie && parseInt($.browser.version, 10) < 7) {
                    $('*', e).each(function () {
                        var imgEl = this, bgImg = imgEl.currentStyle.backgroundImage;

                        if (bgImg !== 'none') {
                            bgImg = bgImg.substring(5, bgImg.length - 2);

                            $(imgEl).css({
                                'backgroundImage': 'none',
                                'filter': alphaImageLoader + "src='" + bgImg + "')"
                            });
                        }
                        return this;
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
                    $(wijDoc).unbind('mousemove', fb.mousemove).unbind('mouseup', fb.mouseup);

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
                    $("." + css_editor_color, e).css('backgroundColor', fb.pack(fb.HSLToRGB([fb.hsl[0], 1, 0.5])));

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
                            return this;
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
                    return '#' + (r < 16 ? '0' : '') + r.toString(16) + (g < 16 ? '0' : '') + g.toString(16) + (b < 16 ? '0' : '') + b.toString(16);
                };

                fb.unpack = function (color) {
                    if (color.length === 7) {
                        return [
                            wijParseInt('0x' + color.substring(1, 3)) / 255,
                            wijParseInt('0x' + color.substring(3, 5)) / 255,
                            wijParseInt('0x' + color.substring(5, 7)) / 255];
                    } else if (color.length === 4) {
                        return [
                            wijParseInt('0x' + color.substring(1, 2)) / 15,
                            wijParseInt('0x' + color.substring(2, 3)) / 15,
                            wijParseInt('0x' + color.substring(3, 4)) / 15];
                    }
                };

                fb.HSLToRGB = function (hsl) {
                    var m1, m2, h, s, l, self = this;
                    h = hsl[0];
                    s = hsl[1];
                    l = hsl[2];
                    m2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
                    m1 = l * 2 - m2;
                    return [
                        self.hueToRGB(m1, m2, h + 0.33333),
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
            }
            return _wijeditorcolorcanvas;
        })();
        editor._wijeditorcolorcanvas = _wijeditorcolorcanvas;
    })(wijmo.editor || (wijmo.editor = {}));
    var editor = wijmo.editor;
})(wijmo || (wijmo = {}));



