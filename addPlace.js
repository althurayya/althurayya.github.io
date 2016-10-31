/**
 * Created by rostam on 29.10.16.
 */
var iCnt = 0;
// CREATE A "DIV" ELEMENT AND DESIGN IT USING jQuery ".css()" CLASS.
var container = d3.select("#pathInputs");

function addPathInput() {
    if (iCnt <= 3) {

        iCnt = iCnt + 1;

        // Add text input.
        container.append("input").attr("type","text")
            .attr("id",'path' + iCnt).attr("placeholder","Via...")
                .attr("autocomplete","on");
        path_active('#' + 'path' + iCnt);
        path_autocomp('#' + 'path' + iCnt,auto_list);

        // Show remobe button if at least one input is created.
        if (iCnt == 1) {

            var divRemove = $(document.createElement('div'));
            $("#addPlace").after('<input type="button" onclick="removeInput()"' +
                'id="btRemove" title="Remove intermediate stop" value= "-"/>');

        }
    }
    // After reaching the specified limit, disable the "Add Place!" button.
    // (3 is the limit we have set)
    else {
        container.append("label").attr("id","limitLabel").html("Reached the limit");
        document.getElementById("addPlace").disabled = true
    }
};

// Remove one element per click.
function removeInput() {
    if (iCnt != 0) {
        $('#path' + iCnt).remove();
        $("#limitLabel").remove();
        iCnt = iCnt - 1;
        if (iCnt < 4)
            $('#addPlace').removeAttr('disabled')
    }

    if (iCnt == 0) {
        $(container)
            .empty()
            .remove();

        $('#btRemove').remove();
        //$('#addPlace')
        //    .removeAttr('disabled');
            //.attr('class', 'bt');
    }
};

// REMOVE ALL THE ELEMENTS IN THE CONTAINER.
//$('#btRemoveAll').click(function() {
//    $(container)
//        .empty()
//        .remove();
//
//    $('#btSubmit').remove();
//    iCnt = 0;
//
//    $('#btAdd')
//        .removeAttr('disabled')
//        .attr('class', 'bt');
//});


// PICK THE VALUES FROM EACH TEXTBOX WHEN "SUBMIT" BUTTON IS CLICKED.
//var divValue, values = '';
//
//function GetTextValue() {
//
//    $(divValue)
//        .empty()
//        .remove();
//
//    values = '';
//
//    $('.input').each(function() {
//        divValue = $(document.createElement('div')).css({
//            padding:'5px', width:'200px'
//        });
//        values += this.value + '<br />'
//    });
//
//    $(divValue).append('<p><b>Your selected values</b></p>' + values);
//    $('body').append(divValue);
//}