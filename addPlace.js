/**
 * Created by rostam on 29.10.16.
 */
numStops = 0;
maxStops = 10;
idCounter = 0;
function addStop(btnId) {
    if (numStops < maxStops) {
        // Increment counter for number of stops
        numStops++;
        // increase the idCounter to prevent the duplicate input ids
        idCounter++;
        //var currentContainer = $("#" + btnId).parent('div');
        // Add new div for containing the new elements
        var newDiv = $(document.createElement('div'));
        newDiv.attr("id", 'stopDiv' + idCounter);
        // Append the text input for new stop
        newDiv.append('<input type="text" id="stopInput' + idCounter +
            '" placeholder="Via..."' +
            ' autocomplete="on" style="margin-left:15px">');
        // Append new add button to new div
        newDiv.append('<input type="button" title="Add new stop after"' +
            ' id="addStop' + idCounter + '" onclick="addStop(this.id)" ' +
            'value="+" style="margin-left:15px;padding:5px;">');

        //newDiv.append("<input id=''>");
            //.attr("type","text")
            //.attr("id",'stopInput' + numStops).attr("placeholder","Via...")
            //    .attr("autocomplete","on").style("margin-left", "10px");
        // Append new remove button for current stop
        newDiv.append('<input type="button" id="delBtn' + idCounter + '" ' +
            'onclick="removeStop(this.id)"' +
            ' title="Remove this stop" value= "-"' +
            'style="margin-left:15px;padding:5px;"/>');

        $("#" + btnId).parent('div').after(newDiv);

        //active_search("stopInputDestination");
        active_search('#' + 'stopInput' + idCounter)
        active_autocomp('#' + 'stopInput' + idCounter, auto_list,"#pathFindingPane",
            keepLastStops);
    }
    // After reaching the specified limit, disable the "Add Place!" button.
    // (10 is the limit we have set)
    else {
        $("#destination").before('<label id="limitLabel" style="display: block;">Reached the limit</label>');
        $("input[id^='addStop']").attr('disabled', true);
    }
};
//TODO: reset the style of the removed toponym
// Remove one element per click.
function removeStop(btnId) {
    $("#" + btnId).parent('div').remove();
    numStops--;
    $("input[id^='addStop']").attr('disabled', false);

    //if (numStops != 0) {
    //    $('#stop' + numStops).remove();
        $("#limitLabel").remove();
    //    numStops = numStops - 1;
    //    if (numStops < 4)
    //        $('#addStop').removeAttr('disabled')
    //}
    //
    //if (numStops == 0) {
    //    //$(container)
    //    //    //.empty()
    //    //    .remove();
    //
    //    $('#btnRemove').remove();
    //    //$('#addStop')
    //    //    .removeAttr('disabled');
    //        //.attr('class', 'bt');
    //}
};

// REMOVE ALL THE ELEMENTS IN THE CONTAINER.
//$('#btnRemoveAll').click(function() {
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
//TODO: duplications with autocomplete function (the current input value get colored twice!)
function keepLastStops(){
    $('Input[id^="stopInput"]').each(function() {
        var stopInputValue = $(this).val();
        if (stopInputValue.indexOf(",") != -1) {
            var sel_splitted = stopInputValue.split(",");
            // The last part of the selected text should be URI in data //TODO
            var key = (sel_splitted[sel_splitted.length-1]).trim();
            customMarkerStyle(markers[key], "red", 0.8);
            customLabelStyle(markers[key], "red", "24px", true);
            markers[key].bringToFront();

        }
    });
}