numAdded = 0;
counter = 0;
function addInput(type, btnId, max) {
    console.log(max)
    if (numAdded <= max) {
        // Increment counter for number of inputs
        numAdded++;
        // increase the counter to prevent the duplicate input ids
        counter++;
        if (type == "pathfinding") {
            var newDivId= "stopDiv" + counter;
            var inputId = "stopInput" + counter;
            var addBtnId ="addStop" + counter;
            var delBtnId ="delStop" + counter;
            var placeHolder = "Via...";
            var typeId = 'pathfinding';
        }
        else if (type == "network") {
            var newDivId= "netDiv" + counter;
            var inputId = "netInput" + counter;
            var addBtnId ="addNet" + counter;
            var delBtnId ="delNet" + counter;
            var placeHolder = "And...";
            var typeId = 'network';
        }
        // Add new div for containing the new elements
        var newDiv = $(document.createElement('div'));
        newDiv.attr("id", newDivId);
        // Append the text input for a new site
        newDiv.append('<input type="text" id="' + inputId +
            '" placeholder="'+placeHolder+'" autocomplete="on" style="margin-left:15px">');
        // Append new add button to the new div
        newDiv.append('<input type="button" title="Add new place"' +
            ' id="' + addBtnId + '" onclick="addInput(\''+typeId+'\',this.id,'+ max +')" ' +
            'value="+" style="margin-left:15px;padding:5px;">');

        // Append new remove button for the current input
        newDiv.append('<input type="button" id="' + delBtnId + '" ' +
            'onclick="removeInput(this.id)"' +
            ' title="Remove this place" value= "-"' +
            'style="margin-left:15px;padding:5px;"/>');

        $("#" + btnId).parent('div').after(newDiv);

        //active_search("stopInputDestination");
        active_search('#' + inputId);
        if (type == "pathfinding")
            active_autocomp('#' + inputId, auto_list,"#pathFindingPane",
                keepLastStops);
        else if (type == "network")
            active_autocomp('#' + inputId, auto_list,"#networkPane",
                keepLastNetSite);
    }
    // After reaching the specified limit, disable the "Add Place!" button.
    // (10 is the limit we have set)
    else {
        //if (type == "pathfinding")
        $("input[id^='del']").last().after('<label id="limitLabel" style="display: block;">Reached the limit</label>');
        $("input[id^='add']").attr('disabled', true);
    }
};
//TODO: reset the style of the removed toponym
// Remove one element per click.
function removeInput(btnId) {
    $("#" + btnId).parent('div').remove();
    numAdded--;
    $("input[id^='add']").attr('disabled', false);

    if ($("#limitLabel").length)
        $("#limitLabel").remove();
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