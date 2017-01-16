numNets = 0;
maxNets = 2;
netCounter = 0;
function addNet(btnId) {
    if (numNets <= maxNets) {
        // Increment counter for number of sites
        numNets++;
        // increase the netCounter to prevent the duplicate input ids
        netCounter++;
        // Add new div for containing the new elements
        var newDiv = $(document.createElement('div'));
        newDiv.attr("id", 'startNet' + netCounter);
        newDiv.append('<label id="netLabel' + netCounter +'" style="display:block;">And:</label>')
        // Append the text input for new site
        newDiv.append('<input type="text" id="netInput' + netCounter +
            '" placeholder="Start Network..."' +
            ' autocomplete="on" style="margin-left:5px">');
        // Append new add button
        newDiv.append('<input type="button" title="Add new site for network flood"' +
            ' id="addNet' + netCounter + '" onclick="addNet(this.id)" ' +
            'value="+" style="margin-left:15px;padding:5px;">');

        // Append new remove button for current site
        newDiv.append('<input type="button" id="delNet' + netCounter + '" ' +
            'onclick="removeNet(this.id)"' +
            ' title="Remove this site" value= "-"' +
            'style="margin-left:15px;padding:5px;"/>');

        $("#" + btnId).parent('div').after(newDiv);

        active_search('#' + 'netInput' + netCounter);
        active_autocomp('#' + 'netInput' + netCounter, auto_list,"#networkPane",
            keepLastNetSite);
    }
    // After reaching the specified limit, disable the "Add Site!" button.
    // (3 is the limit we have set)
    else {
        //$("#" + btnId).parent('div').after('<label id="limitNetLabel" style="display: block;">Reached the limit</label>');
        $("input[id^='addNet']").attr('disabled', true);
    }
};
//TODO: reset the style of the removed toponym
// Remove one element per click.
function removeNet(btnId) {
    $("#" + btnId).parent('div').remove();
    numNets--;
    $("input[id^='addNet']").attr('disabled', false);
    //$("#limitNetLabel").remove();
};

function keepLastNetSite(){
    $('Input[id^="netInput"]').each(function() {
        var netInputValue = $(this).val();
        if (netInputValue.indexOf(",") != -1) {
            var sel_splitted = netInputValue.split(",");
            // The last part of the selected text should be URI in data //TODO
            var key = (sel_splitted[sel_splitted.length-1]).trim();
            customMarkerStyle(markers[key], "red", 0.8);
            customLabelStyle(markers[key], "red", "24px", true);
            markers[key].bringToFront();

        }
    });
}