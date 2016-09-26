/**
 * Created by rostam on 25.09.16.
 */
function create_marker(feature,latlng) {
    var marker = L.circleMarker(latlng, {
        cornu_URI: feature.properties.cornuData.cornu_URI,
        //radius: Math.sqrt(feature.properties.topType.length)/3,
        radius: type_size[feature.properties.cornuData.top_type_hom] * 2,
        fillColor: setColor(feature.properties.cornuData.region_code, [13, 23]),
        color: colorLookup[feature.properties.cornuData.region_code],
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        type: feature.properties.cornuData.top_type_hom,
        region: feature.properties.cornuData.region_code,
        region_spelled: feature.properties.cornuData.region_spelled,
        searchTitle: feature.properties.cornuData.toponym_search,
        arabicTitle: feature.properties.cornuData.toponym_arabic,
        lat: feature.properties.cornuData.coord_lat,
        lng: feature.properties.cornuData.coord_lon
    });
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

var prevClickedMarker;

function OnMarkerClick(feature) {
    return function (e) {
        $("#sidebar").removeClass('collapsed');
        $(".sidebar-pane").removeClass('active');
        $(".sidebar-tabs > li").removeClass('active');
        $("#initDesc").remove();
        $("#initSourceDesc").remove();
        $("#location").addClass('active');
        $("#locTab").addClass('active');
        $("#locTitle").text("Location: " + feature.properties.cornuData.toponym_translit
            + " (" + feature.properties.cornuData.toponym_arabic + ")");
        $("#locDescAr").text(feature.properties.arTitle);
        $("#locDescTranslit").text(feature.properties.translitTitle);
        $("#region").text(colorLookup[feature.properties.regNum]);
        $("#regNum").text(colorLookup[feature.properties.regNum]);
        $("#cornuDetails").text("");
        $("#sourceTitle").text("Sources on: " + feature.properties.cornuData.toponym_arabic);
        //$("#admin1").text(feature.properties.admin1_std_name);
        //$("#txtLink > a").text(feature.properties.SOURCE);
        //$("#txtLink > a").attr("href",feature.properties.SOURCE);
        //$("#txtLink > a").attr("target","_blank");
        //$("#geoLink > a").text(feature.properties.geo.geonameId);
        //$("#geoLink > a").attr("href",feature.properties.geo.geonameId);
        $("#geoLink > a").attr("target", "_blank");
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
        // Create html content of cornu details (in location tab) for a location clicked
        Object.keys(feature.properties.cornuData).forEach(function (cData) {
            $("#cornuDetails").append("<p class = 'details_text'><b>" + cData + ": </b> " + feature.properties.cornuData[cData] + "</p>");
        });
        // sort the source objects by rate to show them in descending order on flap
        var srt_keys = Object.keys(feature.properties.sources_arabic).sort(function (a, b) {
            return feature.properties.sources_arabic[b].rate -
                feature.properties.sources_arabic[a].rate;
        });
        srt_keys.forEach(function (sources) {
            $('#sources').html("");
            fUri = "./sources/" + sources;
            var id = "A" + sources.replace(/\./g, "_");
            // Create html content of resources (in text tab) for a location clicked
            $.getJSON(fUri, function (data) {
                $("#sources").append(
                    "<li id=\'" + id + "\' " +
                    "onclick=click_on_list(\'" + id + "\')>"
                    + data['features'][0]['source'] + ": <span class=\"arabicInline\">" + data['features'][0]['title'] + "</span></li>" +
                    "<div id=\'" + id + "text\'>" + data['features'][0]['text'] + "</div><br>" +
                    "<div id=\'" + id + "ref\' " + "class='reference'>" + data['features'][0]['reference'] + +"</div><br>");
            })
        })
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
