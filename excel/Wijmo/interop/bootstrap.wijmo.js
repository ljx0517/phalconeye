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
/*
* Wijmo Bootstrap Integration library.
*
* Depends:
*  bootstrap.js
*
*/

(function (define) {
    define(["jquery"], function ($) {
        $(document).ready(function () {

            var bootCSS = {
                widget: "ui-widget",
                overlay: "ui-widget-overlay",
                content: "ui-widget-content panel panel-default",
                header: "ui-widget-header btn btn-primary",
                stateDisabled: "ui-state-disabled",
                stateFocus: "ui-state-focus",
                stateActive: "ui-state-active active",
                stateDefault: "ui-state-default btn btn-default",
                stateHighlight: "ui-state-highlight btn-success",
                stateHover: "ui-state-hover",
                stateChecked: "ui-state-checked",
                stateError: "ui-state-error",
                icon: "ui-icon",
                iconCheck: "ui-icon-check glyphicon glyphicon-ok",
                iconRadioOn: "ui-icon-radio-on",
                iconRadioOff: "ui-icon-radio-off glyphicon glyphicon-record",
                iconClose: "ui-icon-close glyphicon glyphicon-remove",
                iconArrow4Diag: "ui-icon-arrow-4-diag glyphicon glyphicon-fullscreen",
                iconNewWin: "ui-icon-newwin",
                iconVGripSolid: "ui-icon-grip-solid-vertical",
                iconHGripSolid: "ui-icon-grip-solid-horizontal",
                iconPlay: "ui-icon-play glyphicon glyphicon-play",
                iconPause: "ui-icon-pause glyphicon glyphicon-pause",
                iconStop: "ui-icon-stop glyphicon glyphicon-stop",
                iconVolumeOn: "ui-icon-volume-on glyphicon glyphicon-volume-up",
                iconVolumeOff: "ui-icon-volume-off glyphicon glyphicon-volume-down",
                iconArrowUp: "ui-icon-triangle-1-n glyphicon glyphicon-chevron-up",
                iconArrowRight: "ui-icon-triangle-1-e glyphicon glyphicon-chevron-right",
                iconArrowDown: "ui-icon-triangle-1-s glyphicon glyphicon-chevron-down",
                iconArrowLeft: "ui-icon-triangle-1-w glyphicon glyphicon-chevron-left",
                iconArrowRightDown: "ui-icon-triangle-1-se glyphicon glyphicon-chevron-down",
                iconArrowThickDown: "ui-icon-arrowthick-1-s glyphicon glyphicon-arrow-down",
                iconArrowThickUp: "ui-icon-arrowthick-1-n glyphicon glyphicon-arrow-up",
                iconCaratUp: "ui-icon-carat-1-n glyphicon glyphicon-chevron-up",
                iconCaratRight: "ui-icon-carat-1-e glyphicon glyphicon-chevron-right",
                iconCaratDown: "ui-icon-carat-1-s glyphicon glyphicon-chevron-down",
                iconCaratLeft: "ui-icon-carat-1-w glyphicon glyphicon-chevron-left",
                iconClock: "ui-icon-clock glyphicon glyphicon-time",
                iconPencil: "ui-icon-pencil glyphicon glyphicon-pencil",
                iconSeekFirst: "ui-icon-seek-first glyphicon glyphicon-step-backward",
                iconSeekEnd: "ui-icon-seek-end glyphicon glyphicon-step-forward",
                iconSeekNext: "ui-icon-seek-next glyphicon glyphicon-forward",
                iconSeekPrev: "ui-icon-seek-prev glyphicon glyphicon-backward",
                iconCircleArrowN: "ui-icon-circle-arrow-n glyphicon glyphicon-circle-arrow-up",
                iconCancel: "ui-icon-cancel glyphicon glyphicon-ban-circle",
                iconArrowReturn: "ui-icon-arrowreturnthick-1-w glyphicon glyphicon-arrow-left",
                iconHome: "ui-icon-home glyphicon glyphicon-home",
                inputSpinnerLeft: "ui-input-spinner-left",
                inputSpinnerRight: "ui-input-spinner-right",
                inputTriggerLeft: "ui-input-trigger-left",
                inputTriggerRight: "ui-input-trigger-right",
                inputSpinnerTriggerLeft: "ui-input-spinner-trigger-left",
                inputSpinnerTriggerRight: "ui-input-spinner-trigger-right",
                lightboxClose: "wijmo-wijlightbox-toolbox-button-close glyphicon glyphicon-remove",
                cornerAll: "ui-corner-all",
                cornerLeft: "ui-corner-left",
                cornerRight: "ui-corner-right",
                cornerBottom: "ui-corner-bottom",
                cornerBL: "ui-corner-bl",
                cornerBR: "ui-corner-br",
                cornerTop: "ui-corner-top",
                cornerTL: "ui-corner-tl",
                cornerTR: "ui-corner-tr",
                helperClearFix: "ui-helper-clearfix",
                helperReset: "ui-helper-reset",
                helperHidden: "ui-helper-hidden",
                priorityPrimary: "ui-priority-primary btn active",
                prioritySecondary: "ui-priority-secondary btn",
                button: "ui-button btn",
                buttonText: "ui-button-text",
                buttonTextOnly: "ui-button-text-only",
                tabs: "ui-tabs",
                tabsTop: "ui-tabs-top",
                tabsBottom: "ui-tabs-bottom",
                tabsLeft: "ui-tabs-left",
                tabsRight: "ui-tabs-right",
                tabsLoading: "ui-tabs-loading",
                tabsActive: "ui-tabs-active",
                tabsPanel: "ui-tabs-panel",
                tabsNav: "ui-tabs-nav",
                tabsHide: "ui-tabs-hide",
                tabsCollapsible: "ui-tabs-collapsible",
                //calendar
                datepickerPrev: "ui-datepicker-prev btn btn-primary",
                datepickerNext: "ui-datepicker-next btn btn-primary",
                datepickerHeader: "ui-datepicker-header btn-group",
                uiIconGripDottedVertical: "ui-icon-grip-dotted-vertical glyphicon glyphicon-calendar",
                //combobox
                //dialog
                wijdialogTitleBarClose: "btn btn-default glyphicon glyphicon-remove",
                wijdialogTitleBarMaximize: "btn btn-default glyphicon glyphicon-new-window",
                wijdialogTitleBarMinimize: "btn btn-default glyphicon glyphicon-minus",
                wijdialogTitleBarPin: "btn btn-default glyphicon glyphicon-pushpin",
                wijdialogTitleBarRefresh: "btn btn-default glyphicon glyphicon-refresh",
                wijdialogTitleBarRestore: "btn btn-default glyphicon glyphicon-chevron-up",
                wijdialogTitleBarToggle: "btn btn-default glyphicon glyphicon-chevron-up",
                //inputdate
                comboboxCss: "wijmo-wijcombobox input-group",
                //input
                wijinputWrapper: "wijmo-wijinput-wrapper form-control",
                //grid
                //slider
                uiSliderHandle: "ui-slider-handle btn btn-default",
                uiSliderRange: "ui-slider-range btn btn-primary",
                //video
                wijvideoIndexSlider: "wijmo-wijvideo-index-slider btn btn-default",
                //formdecorator
                wijtextbox: "wijmo-wijtextbox form-control"
            };

            //Merge Bootstrap CSS into Wijmo Widget Prototypes
            if ($.wijmo.widget) { $.extend($.wijmo.widget.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijaccordion) { $.extend($.wijmo.wijaccordion.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijcalendar) { $.extend($.wijmo.wijcalendar.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijcarousel) { $.extend($.wijmo.wijcarousel.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijcheckbox) { $.extend($.wijmo.wijcheckbox.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijcombobox) { $.extend($.wijmo.wijcombobox.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijdatepager) {
                $.extend($.wijmo.wijdatepager.prototype.options.wijCSS, bootCSS, {
                    wijdatepagerPageLabel: "btn btn-default"
                });
            }
            if ($.wijmo.wijdialog) { $.extend($.wijmo.wijdialog.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijdropdown) { $.extend($.wijmo.wijdropdown.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijeditor) { $.extend($.wijmo.wijeditor.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijexpander) { $.extend($.wijmo.wijexpander.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijevcal) { $.extend($.wijmo.wijevcal.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijgrid) {
                $.extend($.wijmo.wijgrid.prototype.options.wijCSS, bootCSS, {
                    wijgridTH: "btn btn-primary",
                    wijgridDataRow: "btn"
                });
            }
            if ($.wijmo.wijgallery) { $.extend($.wijmo.wijgallery.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijinputdate) { $.extend($.wijmo.wijinputdate.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijinputmask) { $.extend($.wijmo.wijinputmask.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijinputnumber) { $.extend($.wijmo.wijinputnumber.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijinputtext) { $.extend($.wijmo.wijinputtext.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijtextbox) { $.extend($.wijmo.wijtextbox.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijflipcard) { $.extend($.wijmo.wijflipcard.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijlightbox) { $.extend($.wijmo.wijlightbox.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijlist) {
                $.extend($.wijmo.wijlist.prototype.options.wijCSS, bootCSS, {
                    listItem: "wijmo-wijlist-item btn btn-default"
                });
            }
            if ($.wijmo.wijmenu) {
                $.extend($.wijmo.wijmenu.prototype.options.wijCSS, bootCSS);
            }
            if ($.wijmo.wijmenuitem) {
                $.extend($.wijmo.wijmenuitem.prototype.options.wijCSS, {
                    wijmenuCss: "wijmo-wijmenu nav navbar-default",
                    wijmenuChild: "wijmo-wijmenu-child panel panel-default",
                    wijmenuList: "wijmo-wijmenu-list nav navbar-nav"
                }, bootCSS);
            }
            if ($.wijmo.wijpager) {
                $.extend($.wijmo.wijpager.prototype.options.wijCSS, bootCSS, {
                    stateActive: "ui-state-active btn active"
                });
            }
            if ($.wijmo.wijpopup) { $.extend($.wijmo.wijpopup.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijprogressbar) { $.extend($.wijmo.wijprogressbar.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijradio) { $.extend($.wijmo.wijradio.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijrating) { $.extend($.wijmo.wijrating.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijribbon) { $.extend($.wijmo.wijribbon.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijslider) { $.extend($.wijmo.wijslider.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijsplitter) { $.extend($.wijmo.wijsplitter.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijsuperpanel) { $.extend($.wijmo.wijsuperpanel.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijtextbox) { $.extend($.wijmo.wijtextbox.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijtabs) { $.extend($.wijmo.wijtabs.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijtooltip) { $.extend($.wijmo.wijtooltip.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijtree) { $.extend($.wijmo.wijtree.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijtreenode) {
                $.extend($.wijmo.wijtreenode.prototype.options.wijCSS, bootCSS, {
                    wijtreeInner: "btn btn-default"
                });
            }
            if ($.wijmo.wijtreemap) { $.extend($.wijmo.wijtreemap.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijupload) { $.extend($.wijmo.wijupload.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijvideo) { $.extend($.wijmo.wijvideo.prototype.options.wijCSS, bootCSS); }
            if ($.wijmo.wijwizard) { $.extend($.wijmo.wijwizard.prototype.options.wijCSS, bootCSS); }

            if ($.wijmo.wijfileexplorer) {
            	$.extend($.wijmo.wijfileexplorer.prototype.options.wijCSS, bootCSS);
            }

            if ($.wijmo.wijtilelist) {
            	$.extend($.wijmo.wijtilelist.prototype.options.wijCSS, bootCSS, {
            		tilelistItemStateDefault: "btn btn-default"
            	});
            }

            if ($.wijmo.wijmaps) {
                $.extend($.wijmo.wijmaps.prototype.options.wijCSS, bootCSS);
            }

            if ($.wijmo.wijtoolslayer) {
                $.extend($.wijmo.wijtoolslayer.prototype.options.wijCSS, bootCSS);
            }
        });
    });
})(typeof define !== "undefined" ? define : function (deps, body) {
    body(jQuery);
});