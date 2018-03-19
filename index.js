/**
 * Created by rostam on 10.07.16.
 */
/*mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
 wholink = '<a href="http://stamen.com">Stamen Design</a>';
 var tiles = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
 attribution: '&copy; '+mapLink+' Contributors & '+wholink,
 maxZoom: 18,
 });*/
/*var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 });*/

var tiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    maxZoom: 16
});
var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFzb3VtZWgiLCJhIjoiY2oxdnV0bDRiMDAxZTMzanN3eW02MzZhYyJ9.P6yBKy_GA4EmXkCqc7FEwQ';
//L.mapbox.accessToken = 'pk.eyJ1IjoiY2phY2tzMDQiLCJhIjoiVFNPTXNrOCJ9.k6TnctaSxIcFQJWZFg0CBA';
L.mapbox.accessToken = 'pk.eyJ1IjoibWFzb3VtZWgiLCJhIjoiY2oxdnV0bDRiMDAxZTMzanN3eW02MzZhYyJ9.P6yBKy_GA4EmXkCqc7FEwQ'

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
    streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    }),
    googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    }),
    prevTile = L.mapbox.tileLayer('cjacks04.jij42jel', {
    attribution: 'Tiles and Data &copy; 2013 <a href="http://www.awmc.unc.edu" target="_blank">AWMC</a> ' +
    '<a href="http://creativecommons.org/licenses/by-nc/3.0/deed.en_US" target="_blank">CC-BY-NC 3.0</a>' }),
    waterColor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg')//new L.StamenTileLayer("watercolor");

var min_zoom = 5, // 5
    max_zoom = 14;
var prevZoom = min_zoom;

var regs = {};
var markers = {};
// dictionary of routes belonging to region ("region": [routes list])
var route_layers = {};
// Array of all route layers, having geometry from geoJSON data file in "feature" property
// and some other options in "options" property (like color!)
var all_route_layers = [];
// Map {"startURI, endURI": route}
var index_routes_layers = {};
var map_region_to_code = {};
var route_points = {};
// Array of all individual routes as geoJson objects (lineString), as in data file. [{}, {}]
var route_features = [];
var geojson;
var auto_list = [];
var latlngs = [];
var graph_dijks;
var prevPath = [];
var init_lat = 30, init_lon = 42;
var clicked_lat, clicked_lng;
var regions;

var map = L.map('map',{maxZoom:max_zoom}).setView([init_lat,init_lon], min_zoom); //"[30, 40], min_zoom" //.fitBounds(geojson.getBounds(), {paddingTopLeft: [500, 0]});
// Add default tile to the map
prevTile.addTo(map);
$(function() {
    $('#homeTab').tooltip();
    $('#locTab').tooltip();
    $('#sourceTab').tooltip();
    $('#regions').tooltip();
    $('#search').tooltip();
    $('#routeSection').tooltip();
});

$.getJSON($('link[rel="regions"]').attr("href"), function( data ) {
    regions = data;
    $.getJSON($('link[rel="points"]').attr("href"), function (data) {
        geojson = L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                if (Object.keys(type_size).indexOf(
                        //feature.archive.cornuData.top_type_hom) != -1) {
                        feature.properties.althurayyaData.top_type) != -1) {
                    //return L.Marker(latlng);
                }

                if (regs[feature.properties.althurayyaData.region_URI] == undefined)
                    regs[feature.properties.althurayyaData.region_URI] = [];
                regs[feature.properties.althurayyaData.region_URI]
                    .push(feature.properties.althurayyaData.URI);

                var marker = create_marker(feature, latlng);
                latlngs.push([latlng['lat'], latlng['lng']])
                // list of toponyms for autocomplete action of the search input
                auto_list.push(
                    [feature.properties.althurayyaData.names.eng.search,
                        feature.properties.althurayyaData.names.ara.common,
                        feature.properties.althurayyaData.URI
                    ].join(", "));

                /*
                 * click on a marker
                 */
                marker.on('click', OnMarkerClick(feature));

                function ResizeMarker(e) {
                    var currentZoom = map.getZoom();
                    marker.setradius(currentZoom * (Math.sqrt(feature.properties.althurayyaData.names.eng.translit.length) / 3));
                }

                if (marker != null) {
                    return marker;
                }
            }
        });
        // Add the geojson layer of places to map
        geojson.addTo(map);

        // sort the region names alphabetically before putting them on the tab
        Object.keys(regs).sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        })
        // and then, create html list of regions in region tab (from sorted list of regions)
            .forEach(function (key) {
                if (key !== "NoRegion") {
                    var func = "click_region(\"" + key + "\");";
                    $("#regionDiv").append("<li id=\'" + key+  "\' class='region_ul' onclick=\'"+ func + "\';>"
                        + regions[key]['display'] + "</li>");
                }
            });

        var cities = new L.LayerGroup();
        Object.keys(markers).forEach(function(key) {
            markers[key].addTo(cities);
            // metropoles has the label on load and brought to front
            if(marker_properties[key].type == "metropoles") {
                markers[key].setLabelNoHide(true);
                markers[key].bringToFront();
            }
        });

        // Different layers of map
        var baseLayers = {
            "AMWC" : prevTile,
            "Grayscale": grayscale,
            "Streets": streets,
            "National Geographic": tiles,
            "Google Satellite":googleSat,
            "Google Terrain":googleTerrain,
            "Water Color": waterColor
        };
        var overlays = {
            "Places": cities
        };
        L.control.layers(baseLayers, overlays).addTo(map);
        var sidebar = L.control.sidebar('sidebar').addTo(map);
    }).done(function () {
        index_zoom(markers,type_size);
        $.getJSON($('link[rel="routes"]').attr("href"), function (data) {
            var routes = L.geoJson(data, {
                onEachFeature: handle_routes
            });
            init_graph(route_features);
            graph_dijks = createMatrix(route_features);
            var rl = routeLayer.addLayer(routes);
            rl.addTo(map);
            rl.bringToBack();
            Object.keys(route_points).forEach(function(rp) {
                for (var i = 0; i < route_points[rp].length - 1; i++) {
                    //var found = false;
                    for (var j = 1; j < route_points[rp].length; j++) {
                        if (route_points[rp][i]["end"] == route_points[rp][j]["end"]) {
                            // new structure of places.geojson file
                            //customLineStyle(route_points[rp][i]["route"], colorLookup[route_points[rp][i]["end"]], 2, 1);
                            //customLineStyle(route_points[rp][j]["route"], colorLookup[route_points[rp][i]["end"]], 2, 1);
                            customLineStyle(route_points[rp][i]["route"], regions[route_points[rp][i]["end"]]['color'], 2, 1);
                            customLineStyle(route_points[rp][j]["route"], regions[route_points[rp][i]["end"]]['color'], 2, 1);
                        }
                    }
                }
            });
        }).error(function(data) {
            console.log("Error!");
        });
    });
});

/*
 Set a color for an object excluded from a list
 */
function setColor (code, toExclude) {
    if (toExclude.indexOf(code) == -1)
        //colorLookup[code];
        return regions[code]['color']
    else return "lightgray";
}
/*
 * Click on map
 */
function OnMapClick(e) {
    $("#sidebar-pane").removeClass('active');
    $(".sidebar-tabs > li").removeClass('active');
    $("#sidebar").addClass('collapsed');
    clicked_lat = e.latlng.lat;
    clicked_lng = e.latlng.lng;
}

map.on('click', OnMapClick);

/*
 * Zoom on Map.
 */
map.on('zoomend', myzoom);

//
active_search("#netInput0");
active_search('#searchInput');
active_search("#stopInput0");
//active_search("#stopInput1");
active_search("#stopInputDestination");

active_autocomp('#netInput0',auto_list,"#networkPane",function(){});
active_autocomp('#searchInput',auto_list,"#searchPane",function(){});
active_autocomp('#stopInput0',auto_list,"#pathFindingPane",keepLastStops);
active_autocomp('#stopInputDestination',auto_list,"#pathFindingPane",keepLastStops);

/*
 * Add the rotes to the map
 */
var routeLayer = L.featureGroup();
/*
 * Highlights and change the color of markers and routes of a region by clicking on a
 * region name.
 */
var prev_select_reg = undefined;
function click_region(reg) {
    document.getElementById(reg).style.color = 'red';
    if(prev_select_reg != undefined)
        document.getElementById(prev_select_reg).style.color ='gray';
    prev_select_reg = reg;
    if(reg == "All") {
        map.panTo([30,42]);
        Object.keys(marker_properties).forEach(function(key){
            markers[key].setStyle({
                // new structure of places.geojson file
                //fillColor: colorLookup[marker_properties[key].region],
                fillColor: regions[marker_properties[key].region]['color'],
                fillOpacity: "1",
            });
        });

        Object.keys(route_layers).forEach(function(key) {
            route_layers[key].forEach(function (lay) {
                // new structure of places.geojson file
                //customLineStyle(lay,colorLookup[
                //    map_region_to_code[key]], 2, 1);
                customLineStyle(lay,regions[key]['color'], 2, 1);
            });

        });
    } else {
        var tmp = regs[reg];
        Object.keys(markers).forEach(function (key) {
            if (tmp.indexOf(key) == -1) {
                markers[key].setStyle({
                    fillColor: "gray", /* "lightgray" */
                    color: "gray" /* "lightgray" */
                });
                //markers[key].setZIndexOffset(-1);
                markers[key].options.zIndexOffset = -1000;
            } else {
                //if (marker_properties[key].center == "yes") {
                //    map.panTo(markers[key].getLatLng());

                    markers[key].setStyle({
                        fillColor: "red"
                        , color: "red"
                    });
                    //markers[key].setZIndexOffset(100);
                    markers[key].options.zIndexOffset = 1000;
                //}
            }
        });
        all_route_layers.forEach(function(lay) {
            customLineStyle(lay, "gray", 2, 0.8);  /* "lightgray" */
        });
        if(route_layers[reg] != undefined) {
            route_layers[reg].forEach(function (lay) {
                customLineStyle(lay, 'red', 3, 1);
            });
        }
        map.panTo(markers[regions[reg]['visual_center']].getLatLng());
    }
}

function click_on_list(id) {
    // collapse & expand the text and reference of each item in sources
    $('#'+id+"text").children().toggle();
    $('#'+id+"ref").toggle();
}
function findPathConsideringIntermediates(start, end, stopInputsId) {
    var sizeOfInputs = numStops;//d3.select("#pathInputs").selectAll("input").size();
    //var src = $('#stopInput0').val();
    //var tgt = $('#stopInputDestination').val();

    var selections = selectedTypes('itinerary-options');

    //Clear the previous distance information to be ready for the new path
    $("#dist_div").html("");
    $("#path_dist_header").css("display", "none");
    // Repaint markers and paths to be ready for the new query
    repaintMarkers();
    repaintPaths();

// make the itinerary by pushing start, end and all stops in between into an array
    var itinerary = makeItinerary (start, end, stopInputsId);

// Find shortest and within a day paths for itinerary and return the distance values for each path
    var distances = findItinerary(itinerary, selections);
    var short_distance = distances[0];
    var day_distance = distances[1];
    // Calculate direct distance from source to destination
    var int_direct_dist = calcDirectDistance(itinerary[0], itinerary[itinerary.length -1]);

    // Add direct distance information to the page
    $("#path_dist_header").css("display", "block");
    displayDistance ($("#dist_div"), int_direct_dist, int_direct_dist, "Direct");

    // Add shortest distance information to th page
    if (selections.indexOf(itin_opts[0]) != -1) {
        displayDistance ($("#dist_div"), short_distance, int_direct_dist, itin_opts[0]);
    }
    // Add within a day distance information to th page
    if (selections.indexOf(itin_opts[1]) != -1) {
        displayDistance ($("#dist_div"), day_distance, int_direct_dist, itin_opts[1]);
    }
}
function makeItinerary (source, target, stopInputsId){

    var stops = [];
    stops.push(source);
    //$('Input[id^="stopInput"]').each(function() {
    $('Input[id^=' + stopInputsId + ']').each(function() {
        var stopInputValue = $(this).val();
        if (stopInputValue.indexOf(",") != -1) {
            stops.push(stopInputValue);
        }
    });
    stops.push(target);
    return stops;
}
function findItinerary(stops, selections) {
    var short_distance = 0, day_distance = 0;
    var s, t;
    for (var i = 0; i < stops.length - 1; i++) {
        s = stops[i];
        t = stops[i + 1];
        if (selections.indexOf(itin_opts[0]) != -1) {
            var short_path = findPath(s, t, itin_opts[0]);
            short_distance += displayPathControl(short_path, "red");
        }
            //shortestPaths.push(findPath(s, t, "Shortest"));
        if (selections.indexOf(itin_opts[1]) != -1){
            var day_path = findPath(s, t, itin_opts[1]);
            day_distance += displayPathControl(day_path, "green");
        }
    }
    return [short_distance, day_distance]
}
function findPath (start, end, pathType) {
    var shortPath, dayPath;
    if (start == null || end == null) return;
    // Extract the cornu_URI from the search inputs for both source and destination
    //TODO: should be changed regarding the future changes in data
    var startUri = start.substring(start.lastIndexOf(",") + 1).trim();
    var endUri = end.substring(end.lastIndexOf(",") + 1).trim();
    if (pathType == itin_opts[0]) {
        shortPath = graph_dijks.findShortestPath(startUri, endUri);
        if (shortPath != null)
            return shortPath;
    }
    if (pathType == itin_opts[1]) {
        dayPath = shortestPath(graph.getNode(startUri), graph.getNode(endUri), 'd');
        if (dayPath != null)
            return dayPath;
    }
}

function displayDistance (container, dist, direct_dist, textValue) {
    var tmpTextValue = textValue.replace(/ /g,"_").toLowerCase();
    var avg_dist = (dist == 0) ? direct_dist : (dist + direct_dist) / 2;
    var elem_km = "<p id='" + tmpTextValue + "'>" + textValue + " distance: <a style='font-weight:bold;'>"
        + parseInt((dist/DAY).toFixed()).toLocaleString('en') +
        " </a> days of travel, <a style='font-weight:bold;'>" +
        parseInt((dist/1000).toFixed()).toLocaleString('en')+ "</a> km</p>";
    container.append(elem_km);
    if (textValue != "Direct") {
        var avg_elem = "<p style='padding-left:10px;' id='avg_" + tmpTextValue + "'>Average " +  textValue.toLowerCase()
            + " distance: <a style='font-weight:bold;'>" + parseInt((dist/DAY).toFixed()).toLocaleString('en') +
            " </a> days of travel, <a style='font-weight:bold;'>"
            + parseInt((avg_dist/1000).toFixed()).toLocaleString('en') + "</a> km</p>";
        container.append(avg_elem);
    }
}

function findNetwork() {
    //resetMap()
    repaintMap();
    var map_zone_all_sites = {};
    $('Input[id^="netInput"]').each(function() {
        var start = $(this).val().split(',');
        var sourceID = start[start.length - 1].trim();
        var s = graph.getNode(sourceID);
        var distances = shortestPath(s, s, 'n');
        var multiplier = $("#multiSelect").val();
        var network = getNetwork(distances, multiplier);
        Object.keys(network).forEach(function(zone) {
            // get only the digit of zone value
            zone_trim = zone.replace(/\D/g, '').trim();
            //zone_trim = function(zone){
            //    return zone.replace(/\D/g, '').trim();
            //}
            network[zone].forEach(function(uri){
                if (map_zone_all_sites[uri] == undefined)
                    map_zone_all_sites[uri] = zone_trim;
                else
                map_zone_all_sites[uri] = Math.min(map_zone_all_sites[uri], zone_trim);
            });
        });
    });

    var color = d3.scale.linear()
        .domain([1, 2, 3, 4, 5])
        .range(["#E84946", "#FF9500", "#FFD62E", "#6CA376", "gray"]);
    //networkToFlood = network;
    //flood(network, sourceID);
    //TODO: not all the markers need to be colored
    if ($('#unreachable_checkbox').is(':checked')) {
        Object.keys(markers).forEach(function (key) {
            customMarkerStyle(markers[key], "black", 1);
            //markers[key].setRadius(1);
        });
    }
    Object.keys(map_zone_all_sites).forEach(function (uri) {
        customMarkerStyle(markers[uri], color(map_zone_all_sites[uri]), 1);
    });
    Object.keys(index_routes_layers).forEach(function (r) {
        var s = r.split(",")[0];
        var e = r.split(",")[1];
        if (map_zone_all_sites[s] == 1 &&
            map_zone_all_sites[e] == 1)
            customLineStyle(index_routes_layers[r], "red", 3, 1);
    });
}

