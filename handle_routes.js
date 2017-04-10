/**
 * Created by rostam on 25.09.16.
 */
var prev_route_clicked;
var prev_route_markers = [];
var prev_route_labels = [];
function handle_routes(feature,layer) {
    var sRegion, eRegion;
    var sFound = false;
    var eFound = false;
    var keys = Object.keys(markers);
    var i;
    for (i = 0; i < keys.length; i++) {
        if (sFound == false &&
            feature.properties.sToponym == marker_properties[keys[i]].cornu_URI) {
            sFound = true;
            sRegion = marker_properties[keys[i]].region;
            feature.properties.sTitle = marker_properties[keys[i]].searchTitle;
            feature.properties.sTitleAr = marker_properties[keys[i]].arabicTitle;
            feature.properties.sUri = marker_properties[keys[i]].cornu_URI;
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
            feature.properties.eTitle = marker_properties[keys[i]].searchTitle;
            feature.properties.eTitleAr = marker_properties[keys[i]].arabicTitle;
            feature.properties.eUri = marker_properties[keys[i]].cornu_URI;
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
    index_routes_layers
        [layer.feature.properties.sToponym+","+layer.feature.properties.eToponym]
            = layer;
    route_features.push(feature);

    map_region_to_code[marker_properties[keys[i]].region_spelled]
        = marker_properties[keys[i]].region;
    /* Regions 13, 22, and 23 will be light gray.
     * There might be some coloring over routes which are subsections of other routes.
     * That means, some routes of region 22, might get the light blue color
     * (original color before setting that to gray)
     * even though in the code they get gray first (in else)!
     */
    if (sRegion == eRegion) {
        if (route_layers[marker_properties[keys[i]].region] == undefined)
            route_layers[marker_properties[keys[i]].region] = [];
        route_layers[marker_properties[keys[i]].region].push(layer);
        //customLineStyle(layer, colorLookup[sRegion], 2, 1);
        //layer.options.default_color = colorLookup[sRegion];
        // new structure of places.geojson file
        customLineStyle(layer, regions[sRegion]['color'], 2, 1);
        //console.log(layer)
        layer.options.default_color = regions[sRegion]['color'];
    }
    else {
        customLineStyle(layer, "lightgray", 1, 1);
        layer.options.default_color = "lightgray";
    }


    //layer.bringToBack();
    /*
     * click on a route section
     */
    layer.on('click', OnRouteClick);
    function OnRouteClick(e) {
        if (prev_route_clicked !== undefined)
            customLineStyle(prev_route_clicked.layer, prev_route_clicked.color,
                prev_route_clicked.weight, prev_route_clicked.opacity);

        if (prev_route_markers.length > 0){
            //TODO: rewite with map function on the array "prev_route_markers"
            customMarkerStyle(prev_route_markers[0],
                prev_route_markers[0].defaultOptions.color, 1);
            customMarkerStyle(prev_route_markers[1],
                prev_route_markers[0].defaultOptions.color, 1);
            if (prev_route_markers[0].top_type !== "metropoles")
                customLabelStyle(prev_route_markers[0], "black", "20px", false);
            else
                customLabelStyle(prev_route_markers[0], "black", "20px", true);

            if (prev_route_markers[0].top_type !== "metropoles")
                customLabelStyle(prev_route_markers[1], "black", "20px", false);
            else
                customLabelStyle(prev_route_markers[1], "black", "20px", true);
        }

        prev_route_clicked={};
        prev_route_clicked.layer = layer;
        prev_route_clicked.color = layer.options.color;
        prev_route_clicked.weight = layer.options.weight;
        prev_route_clicked.opacity = layer.options.opacity;


        customLineStyle(layer, "red", 3, 1);
        customMarkerStyle(markers[feature.properties.sToponym], "red", 1);
        customMarkerStyle(markers[feature.properties.eToponym], "red", 1);
        prev_route_markers = [];
        prev_route_markers.push(markers[feature.properties.sToponym]);
        prev_route_markers.push(markers[feature.properties.eToponym]);
        customLabelStyle(markers[feature.properties.sToponym], "red", "24px", true);
        customLabelStyle(markers[feature.properties.eToponym], "red", "24px", true);
        prev_route_labels = [];
        prev_route_labels.push(markers[feature.properties.sToponym]);
        prev_route_markers.push(markers[feature.properties.eToponym]);

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
    //console.log(JSON.stringify(route_features))
    //init_graph(route_features);
    //graph_dijks = createMatrix(route_features);
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

function getRouteStyle (layer) {
    return layer.options;
}




