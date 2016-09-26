/**
 * Created by rostam on 25.09.16.
 */
function handle_routes(feature,layer) {
    var sRegion, eRegion;
    var sFound = false;
    var eFound = false;
    var keys = Object.keys(markers);
    for (var i = 0; i < keys.length; i++) {
        if (sFound == false &&
            feature.properties.sToponym == marker_properties[keys[i]].cornu_URI) {
            sFound = true;
            sRegion =marker_properties[keys[i]].region;
            // populate the route_points dictionary with neighbours of the route points
            if (sRegion == 22) {
                if (route_points[feature.properties.sToponym] == undefined)
                    route_points[feature.properties.sToponym] = [];
                var tmp = {};
                tmp["route"] = layer;
                tmp["end"] = marker_properties[feature.properties.eToponym].region;
                route_points[feature.properties.sToponym].push(tmp);
            }
        }
        if (eFound == false &&
            feature.properties.eToponym == marker_properties[keys[i]].cornu_URI) {
            eFound = true;
            eRegion = marker_properties[keys[i]].region;
            // populate the route_points dictionary with neighbours of the route points
            if (eRegion == 22) {
                if (route_points[feature.properties.eToponym] == undefined)
                    route_points[feature.properties.eToponym] = [];
                var tmp = {};
                tmp["route"] = layer;
                tmp["end"] = marker_properties[feature.properties.sToponym].region;
                route_points[feature.properties.eToponym].push(tmp);
            }
        }
        if (sFound == true && eFound == true)
            break;
    }
    all_route_layers.push(layer);
    map_region_to_code[marker_properties[keys[i]].region_spelled]
        = marker_properties[keys[i]].region;
    /* Regions 13, 22, and 23 will be light gray.
     * There might be some coloring over routes which are subsections of other routes.
     * That means, some routes of region 22, might get the light blue color
     * (original color before setting that to gray)
     * even though in the code they get gray first (in else)!
     */
    if (sRegion == eRegion) {
        if (route_layers[marker_properties[keys[i]].region_spelled] == undefined)
            route_layers[marker_properties[keys[i]].region_spelled] = [];
        route_layers[marker_properties[keys[i]].region_spelled].push(layer);
        customLineStyle(layer, colorLookup[sRegion], 2, 1);
    }
    else
        customLineStyle(layer, "lightgray", 1, 1);
    //layer.bringToBack();
    /*
     * click on a route section
     */
    layer.on('click', OnRouteClick);
    function OnRouteClick(e) {
        $("#sidebar").removeClass('collapsed');
        $(".sidebar-pane").removeClass('active');
        $(".sidebar-tabs > li").removeClass('active');
        $("#initRouteDesc").remove();
        $("#routeSectionPane").addClass('active');
        $("#routeSection").addClass('active');
        $("#routeDetails").text("MoreDetails:");

        // Create html content of route details (in routeSection tab) for a route section clicked
        Object.keys(layer.feature.properties).forEach(function (rData) {
            $("#routeDetails").append("<p class = 'details_text'><b>" + rData + ": </b> " + layer.feature.properties[rData] + "</p>");
        })
    }
}

/*
 * Set the routes style
 */
function customLineStyle(layer, color, width, opacity) {
    layer.setStyle({
        color: color,
        weight: width,
        opacity: opacity,
        smoothFactor : 2
    })
};
