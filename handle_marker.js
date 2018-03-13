/**
 * Created by rostam on 25.09.16.
 */
var marker_properties = {};
function create_marker(feature,latlng) {
    var marker = L.circleMarker(latlng,{
        //fillColor: setColor(feature.properties.cornuData.region_code, [13, 23]),
        //color: colorLookup[feature.properties.cornuData.region_code],
        // new structure of places.geojson file
        fillColor: setColor(feature.properties.althurayyaData.region_URI, [13, 23]),
        //color: colorLookup[feature.properties.althurayyaData.region],
        color: regions[feature.properties.althurayyaData.region_URI]['color'],
        opacity: 1,
        fillOpacity: 1,
        weight: 1
    });
    //marker_properties[feature.properties.cornuData.cornu_URI]= {
    //    cornu_URI: feature.properties.cornuData.cornu_URI,
    //    //radius: Math.sqrt(feature.properties.topType.length)/3,
    //    //radius: type_size[feature.properties.cornuData.top_type_hom] * 2,
    //    type: feature.properties.cornuData.top_type_hom,
    //    center: feature.properties.althurayyaData.visual_center,
    //    region: feature.properties.cornuData.region_code,
    //    region_spelled: feature.properties.cornuData.region_spelled,
    //    searchTitle: feature.properties.cornuData.toponym_search,
    //    arabicTitle: feature.properties.cornuData.toponym_arabic,
    //    lat: feature.properties.cornuData.coord_lat,
    //    lng: feature.properties.cornuData.coord_lon

    // new structure of places.geojson file
    marker_properties[feature.properties.althurayyaData.URI]= {
        cornu_URI: feature.properties.althurayyaData.URI,
        //radius: Math.sqrt(feature.properties.topType.length)/3,
        //radius: type_size[feature.properties.cornuData.top_type_hom] * 2,
        type: feature.properties.althurayyaData.top_type,
        center: feature.properties.althurayyaData.visual_center,
        region: feature.properties.althurayyaData.region_URI,
        // TODO: should change the region_spelled to read from properties.althurayyaData
        //region_spelled: feature.archive.cornuData.region_spelled,
	region_spelled: regions[feature.properties.althurayyaData.region_URI]['region_code'],
        searchTitle: feature.properties.althurayyaData.names.eng.search,
        arabicTitle: feature.properties.althurayyaData.names.ara.common,
        // new structure of places.geojson file
        //lat: feature.properties.althurayyaData.coord_lat,
        //lng: feature.properties.althurayyaData.coord_lon
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
    };
    //var rad = type_size[feature.properties.cornuData.top_type_hom] * 2;
    // new structure of places.geojson file
    var rad = type_size[feature.properties.althurayyaData.top_type] * 2;
    if(!isNaN(rad)) {
        marker.setRadius(rad);
    }
    else marker.setRadius(0);
    //var marker = marker.bindLabel(feature.properties.cornuData.toponym_translit);
    // new structure of places.geojson file
    var marker = marker.bindLabel(feature.properties.althurayyaData.names.eng.translit);
    marker.options.className = "leaflet-label";
    marker.options.zoomAnimation = true;
    marker.options.opacity = 0.0;
    marker.options.direction = "auto";
    //marker.top_type = feature.properties.cornuData.top_type_hom;
    //markers[feature.properties.cornuData.cornu_URI] = marker;
    // new structure of places.geojson file
    marker.top_type = feature.properties.althurayyaData.top_type;
    //markerLabels[feature.properties.cornuData.cornu_URI] = tmp;
    markers[feature.properties.althurayyaData.URI] = marker;

    //marker.setLabelNoHide(true);
    //marker.setLabelNoHide(false);
    return marker;
}
// Variable holding the previous clicked marker
var prevClickedMarker;

// Show/Hide the cornu detail by clicking on "Technical Information"
$("#techInfo").click(
    function() {
        $("#cornuDetails").toggle();
    }
);
function OnMarkerClick(feature) {
    return function (e) {
        $("#cornuDetails").css("display","none");
        $("#sidebar").removeClass('collapsed');
        $(".sidebar-pane").removeClass('active');
        $(".sidebar-tabs > li").removeClass('active');
        $("#initDesc").remove();
        $("#initSourceDesc").remove();
        $("#location").addClass('active');
        $("#locTab").addClass('active');
        // new structure of places.geojson file
        //$("#locTitle").text("Location: " + feature.properties.cornuData.toponym_translit
        //    + " (" + feature.properties.cornuData.toponym_arabic + ")");
        $("#locTitle").text("Location: " + feature.properties.althurayyaData.names.eng.translit
            + " (" + feature.properties.althurayyaData.names.ara.common + ")");
        $("#techInfo").text("Technical Information");
        // new structure of places.geojson file
        //$("#sourceTitle").text("Sources on: " + feature.properties.cornuData.toponym_arabic);
        $("#sourceTitle").text("Sources on: " + feature.properties.althurayyaData.names.ara.common);
        // Remove the previous html of english sources to put the new content
        // new structure of places.geojson file
        //if ($.isEmptyObject(feature.properties.sources_english)){
        //if (feature.properties.references.secondary.length === 0){
        if (Object.getOwnPropertyNames(feature.properties.references.secondary).length <= 0 ) {
            $("#otherSources").hide();
            $("#goToPrimSource").hide();
            $('#engSourcesDiv').html("");
        }
        // Remove the previous html of cornu details and primary sources to put the new content
        $("#cornuDetails").html("");
        $('#sources').html("");
        //$("#txtLink > a").text(feature.properties.SOURCE);
        //$("#txtLink > a").attr("href",feature.properties.SOURCE);
        //$("#txtLink > a").attr("target","_blank");
        if(prevClickedMarker !== undefined) {
            customMarkerStyle(prevClickedMarker,
                prevClickedMarker.defaultOptions.color, 1);
            if (prevClickedMarker.top_type !== "metropoles")
                customLabelStyle(prevClickedMarker, "black", "20px", false);
            else
                customLabelStyle(prevClickedMarker, "black", "20px", true);
        }
        // new structure of places.geojson file
        //customLabelStyle(markers[feature.properties.cornuData.cornu_URI], "red", "24px", true);
        //customMarkerStyle(markers[feature.properties.cornuData.cornu_URI], "red", 1);
        //prevClickedMarker = markers[feature.properties.cornuData.cornu_URI];
        customLabelStyle(markers[feature.properties.althurayyaData.URI], "red", "24px", true);
        customMarkerStyle(markers[feature.properties.althurayyaData.URI], "red", 1);
        prevClickedMarker = markers[feature.properties.althurayyaData.URI];

        // Create html content of external sources (in location tab) for a location clicked
        // new structure of places.geojson file
        //Object.keys(feature.properties.sources_english).forEach(function(engSourceUri) {
        Object.keys(feature.properties.references.secondary).forEach(function(engSourceUri) {
            $('#engSourcesDiv').html("");
            //var refUri = "./ref/" + feature.properties.sources_english[engSourceUri]['uri'];
            var refUri = "./ref/" + engSourceUri;
            //TODO: remove it when we get ".json" out of the id strings
            //var id = "E" + engSourceUri.replace(/\./g, "_");
            var id = "E" + engSourceUri.replace(/\./g, "_");
            // Create html content of primary sources (in location tab) for a location clicked
            $.getJSON(refUri, function (data) {
                $("#engSourcesDiv").append(
                    "<span id=\'" + id + "\' class=\"englishInline\">"
                    //+ "onclick=click_on_list(\'" + id + "\')>"
                    //+ data['features'][0]['source'] + ": <span class=\"arabicInline\">" + data['features'][0]['title']
                    + "<div id=\'" + id + "text\'>" + data['features'][0]['text'] + "</div><br>"
                    + "<div id=\'" + id + "ref\' " + "class='reference'>" + data['features'][0]['reference']
                    +"</div><br></span>"
                    + "<p>More in the <a href=\'" + data['features'][0]['uri']
                    + "\'>Encyclopaedia of Islam, Second Edition (Online)</a></p>");
                $("#otherSources").show();
                $("#goToPrimSource").show();
                $("#encyIran").attr("href","http://www.iranicaonline.org/articles/search/keywords:" + data['features'][0]['title']);
                $("#wikipedia").attr("href","https://en.wikipedia.org/wiki/Special:Search/" + data['features'][0]['title'])
                $("#pleides").attr("href","")
            });
        });
        // Create html content of technical details (in location tab) for a location clicked
        // new structure of places.geojson file. The hardcoded values,
        // such as "language" and "names" should be defined in a constant values in
        // seperate js file for further changes in the data files.

        //Object.keys(feature.properties.cornuData).forEach(function (cData) {
        Object.keys(feature.properties.althurayyaData).forEach(function (cData) {
            var tmp = feature.properties.althurayyaData[cData];
            $("#cornuDetails").append("<p id='detail_" + cData + "' class = 'details_text'><b>"
                + cData.replace(/_/g," ") + ": </b> </p>")
            if (typeof(tmp) == 'string')
                $("#detail_" + cData).append(tmp);
            if (cData == "language") {
                var values = tmp.join(', ');
                $("#detail_" + cData).append(function() {
                    return values;
                })
            }

            if (cData == "names") {
                // TODO: in case that the names object's structure in data file is changed
                // (TODO:) instead of an object, langs variable must accordingly be changed
                var langs = d3.keys(tmp);
                var names = d3.select("#detail_names").append("ul");
                // create li element for each language item
                names.selectAll("li")
                    .data(langs).enter().append("li")
                    .attr("id", function (d) {
                        return "lang_" + d;
                    } )
                    .text(function (d) {
                        return d;
                    })
                // for each language item, add list of values to the corresponding
                // parent element
                langs.forEach(function(l) {
                    // select the corresponding parent element which holds the
                    // language value
                    d3.select("#lang_" + l).append("ul")
                        .selectAll("li")
                        .data(d3.entries(tmp[l])) // { key: "common", value: "قرح" }, etc.
                        .enter()
                        .append("li")
                        .attr("class", "li_names")
                        .text(function (d) {
                            if (d.value !== "")
                                return d.key.replace(/_/g," ") + ": " + d.value;
                            // for empty values, return NA
                            else return d.key.replace(/_/g," ") + ": NA";
                        })
                })
            }
        });

        // sort the primary source objects by rate to show them in descending order on flap
        // new structure of places.geojson file
        //var srt_keys = Object.keys(feature.properties.sources_arabic).sort(function (a, b) {
        //    return feature.properties.sources_arabic[b].rate -
        //        feature.properties.sources_arabic[a].rate;
        //});
        var srt_keys = Object.keys(feature.properties.references.primary).sort(function (a, b) {
            return feature.properties.references.primary[b].rate -
            feature.properties.references.primary[a].rate;
        });
        srt_keys.forEach(function (sources) {
            //$('#sources').html("");
            fUri = "./sources/" + sources;
            var id = "A" + sources.replace(/\./g, "_");
            // Create html content of primary sources (in location tab) for a location clicked
            $.getJSON(fUri, function (data) {
                $("#sources").append(
                    "<li id=\'" + id + "\' " +
                    "onclick=click_on_list(\'" + id + "\')>"
                    + data['features'][0]['source'] + ": <span class=\"arabicInline\">" + data['features'][0]['title']
                    + "&lrm;(" + feature.properties.references.primary[sources].match_rate + "% match)</span></li>" +
                    "<div id=\'" + id + "text\'>" + data['features'][0]['text'] + "</div><br>" +
                    "<div id=\'" + id + "ref\' " + "class='reference'>" + data['features'][0]['reference'] +"</div><br>");
            });
        });
    }
}

/*
 * Set the marker style
 */
function customMarkerStyle(marker, color, opacity) {
    marker.setStyle({
        fillColor: color,
        color: color,
        fillOpacity: opacity

    })
};

function customLabelStyle (marker, color, font, status) {
    if (marker.label._container !== undefined) {
        marker.label._container.style.color = color;
        marker.label._container.style.fontSize = font;
    }
    marker.setLabelNoHide(status)
}
