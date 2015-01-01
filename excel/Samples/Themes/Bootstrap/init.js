$(document).ready(function () {

    //wijmo accordian
    $("#accordion").wijaccordion();

    //wijmo calendar
    $("#calendar").wijcalendar();

    //wijmo carousel
    $("#wijcarousel").wijcarousel({
        display: 1,
        showTimer: true,
        showPager: true,
        loop: true,
        showContorlsOnHover: true
    });

    //wijmo combobox
    $("#tagsinput").wijcombobox(
    {
        showingAnimation: { effect: "blind" },
        hidingAnimation: { effect: "blind" },
        //isEditable: false, 
        data: [
                {
                    label: 'c++',
                    value: 'c++1'
                },
                {
                    label: 'java',
                    value: 'java'
                },
                {
                    label: 'php',
                    value: 'php'
                },
                {
                    label: 'coldfusion',
                    value: 'coldfusion'
                }, {
                    label: 'javascript',
                    value: 'javascript'
                },
                {
                    label: 'asp',
                    value: 'asp'
                },
                {
                    label: 'ruby',
                    value: 'ruby'
                },
                {
                    label: 'python',
                    value: 'python'
                },
                {
                    label: 'c',
                    value: 'c'
                },
                {
                    label: 'scala',
                    value: 'scala'
                },
                {
                    label: 'groovy',
                    value: 'groovy'
                },
                {
                    label: 'haskell',
                    value: 'haskell'
                },
                {
                    label: 'perl',
                    value: 'perl'
                }
        ]
    }
    );
    $("#tags").wijcombobox(
        {
            //selectOnItemFocus :true, 
            showingAnimation: { effect: "blind" },
            hidingAnimation: { effect: "blind" }
        }
    );
    $('#show').click(function () {
        $("#tags").show();
    })

    //wijmo datepager
    $("#datepager").wijdatepager();

    //wijmo dialog
    $('#dialog').wijdialog({
        autoOpen: false
    });

    //wijmo editor
    $("#wijeditor").wijeditor();

    //wijmo events calendar
    $("#eventscalendar").wijevcal();

    //wijmo expander
    $("#expander").wijexpander();

    // wijmo gallery
    $("#wijgallery").wijgallery({
        showControlsOnHover: false,
        thumbsDisplay: 4,
        thumbsLength: 150
    });

    //wijmo gridview
    $("#grid").wijgrid({
        data: [
        { ID: "ANATR", Company: "Ana Trujillo Emparedados y helados", Name: "Ana Trujillo" },
        { ID: "ANTON", Company: "Antonio Moreno Taqueria", Name: "Antonio Moreno" },
        { ID: "AROUT", Company: "Around the Horn", Name: "Thomas Hardy" },
        { ID: "BERGS", Company: "Berglunds snabbkop", Name: "Christina Berglund" },
        { ID: "ANTON", Company: "Antonio Moreno Taqueria", Name: "Antonio Moreno" },
        { ID: "AROUT", Company: "Around the Horn", Name: "Thomas Hardy" },
        { ID: "BERGS", Company: "Berglunds snabbkop", Name: "Christina Berglund" },
        { ID: "BERGS", Company: "Berglunds snabbkop", Name: "Christina Berglund" }
        ],
        allowSorting: true,
        allowEditing: true
    });

    //wijmo input date
    $("#textbox1").wijinputdate({ dateFormat: 'T' });
    $("#textbox2").wijinputdate({ dateFormat: 'd' });
    $("#textbox3").wijinputdate({ dateFormat: 'g' });
    $("#textbox4").wijinputdate({ dateFormat: 'U' });

    //wijmo input mask
    $("#textboxm").wijinputmask({
        mask: '(999) 000-0000',
        hidePromptOnLeave: true
    });

    //wijmo input number
    $("#textboxn").wijinputnumber({
        type: 'numeric',
        minValue: -100,
        maxValue: 1000,
        decimalPlaces: 3,
        showSpinner: true
    });

    //wijmo lightbox
    $("#lightbox").wijlightbox({ modal: true });

    //wijmo linear gauge
    $("#gauge").wijlineargauge({
        width: 400,
        height: 120,
        value: 70,
        max: 100,
        min: 0,
        labels: {
            style: {
                fill: "#1E395B",
                "font-size": 12,
                "font-weight": 800
            }
        },
        tickMajor: {
            position: "inside",
            offset: -11,
            interval: 20,
            factor: 12,
            style: {
                fill: "#1E395B",
                stroke: "none",
                width: 2
            }
        },
        tickMinor: {
            position: "inside",
            offset: -11,
            visible: true,
            interval: 4,
            factor: 10,
            style: {
                fill: "#1E395B",
                stroke: "none",
                width: 1
            }
        },
        pointer: {
            shape: "rect",
            length: 0.6,
            style: {
                fill: "#1E395B",
                stroke: "#7BA0CC",
                "stroke-width": 1,
                opacity: 1
            }
        },
        face: {
            style: {
                fill: "270-#FFFFFF-#D9E3F0",
                stroke: "#7BA0CC",
                "stroke-width": 2
            }
        },
        ranges: [{
            startValue: 20,
            endValue: 80,
            startDistance: 0.85, //A ratio value determine the location of the range at start value. 
            endDistance: 0.85, //A ratio value determine the location of the range at end value. 
            startWidth: 0.5,
            endWidth: 0.5,
            style: {
                fill: "90-#3DA1D8-#3A6CAC",
                opacity: "1",
                stroke: "none"
            }
        }]
    });

    //wijmo list
    var testArray = [{
        label: 'c++',
        value: 'c++'
    }, {
        label: 'java',
        value: 'java'
    }, {
        label: 'php',
        value: 'php'
    }, {
        label: 'coldfusion',
        value: 'coldfusion'
    }, {
        label: 'javascript',
        value: 'javascript'
    }, {
        label: 'asp',
        value: 'asp'
    }, {
        label: 'ruby',
        value: 'ruby'
    }, {
        label: 'python',
        value: 'python'
    }, {
        label: 'c',
        value: 'c'
    }, {
        label: 'scala',
        value: 'scala'
    }, {
        label: 'groovy',
        value: 'groovy'
    }, {
        label: 'haskell',
        value: 'haskell'
    }, {
        label: 'perl',
        value: 'perl'
    }];
    var list = $("#list");
    var input = $('#testinput');
    list.wijlist({
        selected: function (event, ui) {
            var selectedItem = ui.item;
            var str = selectedItem.label;
            input.val(str);

        }
    });
    //sets items to be rendered 
    list.wijlist('setItems', testArray);
    //use new data to render the wijlist  
    list.wijlist('renderList');
    list.wijlist('refreshSuperPanel');
    input.bind("keydown.wijcombobox", function (event) {
        var keyCode = $.ui.keyCode;
        switch (event.keyCode) {
            case keyCode.UP:
                // moves focus to the previous item. 
                list.wijlist('previous', event);
                // prevent moving cursor to beginning of text field in some browsers 
                event.preventDefault();
                break;
            case keyCode.DOWN:
                if (!list.is(':visible')) {
                    list.show();
                    return;
                }
                // moves focus to the next item. 
                list.wijlist('next', event);
                // prevent moving cursor to end of text field in some browsers 
                event.preventDefault();
                break;
            case keyCode.ENTER:
                event.preventDefault();
                // select the current active item 
                list.wijlist('select', event);
                break;
            case keyCode.PAGE_UP:
                // turns to the previous page of the wijlist. 
                list.wijlist('previousPage');
                break;
            case keyCode.PAGE_DOWN:
                // turns to the next page of the wijlist. 
                list.wijlist('nextPage');
                break;
            default:
                break;
        }
    });
    function selectButtonClick(select) {
        var list = $("#list").data('wijmoWijlist');
        var indices = $('#indices').val().split(',');
        var newArray = [];
        $.each(indices, function (index, value) {
            newArray[newArray.length] = parseInt(value);
        });
        if (select) {
            //use inner method to select items. 
            list.selectItems(newArray);
        }
        else {
            //use inner method to unselect items. 
            list.unselectItems(newArray);
        }
    }

    //wijmo menu
    $("#flyoutmenu").wijmenu();
    $("#flyoutmenu").removeClass("ui-helper-hidden-accessible");

    //wijmo pager
    $("#pager").wijpager({ pageCount: 150, pageIndex: 40, mode: "numericFirstLast" });


    $('#progressbar').wijprogressbar();

    $('#slider').wijslider();
    $('#tabs').wijtabs();
    $("#targetContainer [title]").wijtooltip();
    $('#tree').wijtree();
    $('#ratingSelect').wijrating();
    $("#vsplitter1").wijsplitter({ orientation: "vertical" });
    $('#upload').wijupload();
    $('#vid1').wijvideo();
    $("#pages").wijwizard({ showOption: { duration: 0 } });
    $('#superPanel').wijsuperpanel();

    $('.wijmo-wijlist-item').wrapInner('<a href="#"></a>');
    $('.ui-icon').empty();
});