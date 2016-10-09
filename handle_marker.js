/**
 * Created by rostam on 25.09.16.
 */
var marker_properties = {};
function create_marker(feature,latlng) {
    var marker = L.circleMarker(latlng,{
        fillColor: setColor(feature.properties.cornuData.region_code, [13, 23]),
        color: colorLookup[feature.properties.cornuData.region_code],
        opacity: 1,
        fillOpacity: 1,
        weight: 1
    });
    marker_properties[feature.properties.cornuData.cornu_URI]= {
        cornu_URI: feature.properties.cornuData.cornu_URI,
        //radius: Math.sqrt(feature.properties.topType.length)/3,
        //radius: type_size[feature.properties.cornuData.top_type_hom] * 2,
        type: feature.properties.cornuData.top_type_hom,
        center: feature.properties.althurayyaData.visual_center,
        region: feature.properties.cornuData.region_code,
        region_spelled: feature.properties.cornuData.region_spelled,
        searchTitle: feature.properties.cornuData.toponym_search,
        arabicTitle: feature.properties.cornuData.toponym_arabic,
        lat: feature.properties.cornuData.coord_lat,
        lng: feature.properties.cornuData.coord_lon
    };
    var rad = type_size[feature.properties.cornuData.top_type_hom] * 2;
    if(!isNaN(rad)) {
        marker.setRadius(rad);
    }
    else marker.setRadius(0);
    var tmp = marker.bindLabel(feature.properties.cornuData.toponym_translit);
    tmp.options.className = "leaflet-label";
    tmp.options.zoomAnimation = true;
    tmp.options.opacity = 0.0;
    tmp.options.direction = "auto";
    tmp.top_type = feature.properties.cornuData.top_type_hom;
    markerLabels[feature.properties.cornuData.cornu_URI] = tmp;
    markers[feature.properties.cornuData.cornu_URI] = marker;
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
        $("#locTitle").text("Location: " + feature.properties.cornuData.toponym_translit
            + " (" + feature.properties.cornuData.toponym_arabic + ")");
        $("#techInfo").text("Technical Information");
        $("#sourceTitle").text("Sources on: " + feature.properties.cornuData.toponym_arabic);
        // Remove the previous html of english sources to put the new content
        if ($.isEmptyObject(feature.properties.sources_english)){
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
          prevClickedMarker.label._container.style.color = "black";
          prevClickedMarker.label._container.style.fontSize = "20px";
            // for metropoles, always keep the label!
          if (prevClickedMarker.top_type !== "metropoles")
            prevClickedMarker.setLabelNoHide(false);
        }
        markerLabels[feature.properties.cornuData.cornu_URI].setLabelNoHide(true);
        markerLabels[feature.properties.cornuData.cornu_URI].label._container.style.color = "red";
        markerLabels[feature.properties.cornuData.cornu_URI].label._container.style.fontSize = "24px";
        prevClickedMarker = markerLabels[feature.properties.cornuData.cornu_URI];

        // Create html content of external sources (in location tab) for a location clicked
        Object.keys(feature.properties.sources_english).forEach(function(engSourceUri) {
            $('#engSourcesDiv').html("");
            var refUri = "./ref/" + feature.properties.sources_english[engSourceUri]['uri'];
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
        Object.keys(feature.properties.cornuData).forEach(function (cData) {
            $("#cornuDetails").append("<p class = 'details_text'><b>" + cData + ": </b> " + feature.properties.cornuData[cData] + "</p>");
        });

        // sort the primary source objects by rate to show them in descending order on flap
        var srt_keys = Object.keys(feature.properties.sources_arabic).sort(function (a, b) {
            return feature.properties.sources_arabic[b].rate -
                feature.properties.sources_arabic[a].rate;
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
                    + "&lrm;(" + feature.properties.sources_arabic[sources].rate + "% match)</span></li>" +
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
