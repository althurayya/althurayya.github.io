/**
 * Created by rostam on 25.09.16.
 * Search Toponym
 */
var prevSearchLabel;

function active_search(input) {
    $(input).on('keyup', function () {
        resetPaths();
        Object.keys(markers).forEach(function (key) {
            var searchTitle = marker_properties[key].searchTitle.toUpperCase();
            var cornuURI = marker_properties[key].cornu_URI;
            var arabicTitle = marker_properties[key].arabicTitle;
            var markerSearchTitle = [];
            markerSearchTitle.push(searchTitle, cornuURI, arabicTitle);
            var searchTerm = $(input).val().toUpperCase();
            //if(prevClickedMarker != undefined)
            //    customMarkerStyle(prevClickedMarker,
            //        prevClickedMarker.defaultOptions.color, 1);
            if (searchTerm !== "" && searchTerm.length > 1) {
                if (markerSearchTitle.join('').indexOf(searchTerm) != -1) {
                    customMarkerStyle(markers[key], "red", 0.8);
                    if(prevSearchLabel != undefined) {
                        customLabelStyle(prevSearchLabel, "black", "20px", false);
                        //customMarkerStyle(prevSearchLabel, colorLookup[marker_properties[key].region], 1);
                        customMarkerStyle(prevSearchLabel, prevSearchLabel.defaultOptions.color, 1);

                    }
                    markers[key].setLabelNoHide(true);
                    prevSearchLabel = markers[key];
                }
                else {
                    //customMarkerStyle(markers[key], colorLookup[marker_properties[key].region], 0.2)
                    customMarkerStyle(markers[key], markers[key].defaultOptions.color, 0.2)

                }
            }
            else if (searchTerm === "") {
                myzoom();
                //customMarkerStyle(markers[key], colorLookup[marker_properties[key].region], 1)
                customMarkerStyle(markers[key], markers[key].defaultOptions.color, 1)
            }
        })
    });
}

function active_autocomp(input, auto_list, which_input, postprocess) {
    /*
     * Autocomplete an input
     */
    $(input).autocomplete({
        appendTo: which_input,//"#searchPane",
        source: auto_list,
        minLength: 4,
        select: function (e, ui) {
            resetMarkers();
            var selected = ui.item.value.toUpperCase();
            // Select the second part of the selected item in the auto_list which is the topURI
            // the last part of the selected text should be URI in data structure //TODO
            var sel_splitted = selected.split(",");
            var key = (sel_splitted[sel_splitted.length-1]).trim();
            //Highlight the selected item by red color
            customMarkerStyle(markers[key], "red", 0.8);
            if (prevSearchLabel != undefined)
                customLabelStyle(prevSearchLabel, "black", "20px", false);
            //console.log(markers[key])
            customLabelStyle(markers[key], "red", "24px", true);
            prevSearchLabel = markers[key];
            // re-center the map if the selected item exists!
            map.panTo(markers[key].getLatLng());
            markers[key].bringToFront();
            postprocess();
        }
    });
}