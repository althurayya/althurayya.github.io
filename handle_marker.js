/**
 * Created by rostam on 25.09.16.
 */
function create_marker(feature,latlng) {
    var marker= L.circleMarker(latlng, {
        cornu_URI : feature.properties.cornuData.cornu_URI,
        //radius: Math.sqrt(feature.properties.topType.length)/3,
        radius: type_size[feature.properties.cornuData.top_type_hom]*2,
        fillColor: setColor(feature.properties.cornuData.region_code, [13, 23]),
        color: colorLookup[feature.properties.cornuData.region_code],
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        type : feature.properties.cornuData.top_type_hom,
        region : feature.properties.cornuData.region_code,
        region_spelled : feature.properties.cornuData.region_spelled,
        searchTitle : feature.properties.cornuData.toponym_search,
        arabicTitle : feature.properties.cornuData.toponym_arabic,
        lat : feature.properties.cornuData.coord_lat,
        lng : feature.properties.cornuData.coord_lon
    });
    var tmp = marker.bindLabel(feature.properties.cornuData.toponym_translit);
    tmp.options.className="myLeafletLabel";
    tmp.options.zoomAnimation = true;
    tmp.options.opacity = 0.0;
    tmp.options.direction = "auto";
    markerLabels[feature.properties.cornuData.cornu_URI] = tmp;
    markers[feature.properties.cornuData.cornu_URI] = marker;
    return marker;
}