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
    mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
L.mapbox.accessToken = 'pk.eyJ1IjoiY2phY2tzMDQiLCJhIjoiVFNPTXNrOCJ9.k6TnctaSxIcFQJWZFg0CBA';

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
    '<a href="http://creativecommons.org/licenses/by-nc/3.0/deed.en_US" target="_blank">CC-BY-NC 3.0</a>' });;

var min_zoom = 5,
    max_zoom = 14;
var prevZoom = min_zoom;

var regs = {};
var markers = {};
var route_layers = {};
var all_route_layers = [];
var map_region_to_code = {};
var markerLabels = {};
var route_points = {};

var geojson;
var auto_list = [];
var latlngs = [];

var map = L.map('map',{maxZoom:max_zoom}).setView([30,40], min_zoom);//"[30, 40], min_zoom" //.fitBounds(geojson.getBounds(), {paddingTopLeft: [500, 0]});
// Add default tile to the map
prevTile.addTo(map);

$.getJSON($('link[rel="points"]').attr("href"), function (data) {
    geojson = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            if (regs[feature.properties.cornuData.region_spelled] == undefined)
                regs[feature.properties.cornuData.region_spelled] = [];
            regs[feature.properties.cornuData.region_spelled]
                .push(feature.properties.cornuData.cornu_URI);

            var marker = create_marker(feature,latlng);
            latlngs.push([latlng['lat'],latlng['lng']])
            // list of toponyms for autocomplete action of the search input
            auto_list.push.apply(auto_list,[feature.properties.cornuData.toponym_search,
                feature.properties.cornuData.cornu_URI, feature.properties.cornuData.toponym_arabic]);
           /*
            * click on a marker
            */
            marker.on('click', OnMarkerClick(feature));
            function ResizeMarker(e) {
                var currentZoom = map.getZoom();
                marker.setradius(currentZoom * (Math.sqrt(feature.properties.translitTitle.length) / 3));
            }
            return marker
        }
    });

    // Add the geojson layer of places to map
    geojson.addTo(map);

    // Create html list of regions in region tab
    Object.keys(regs).forEach(function (key) {
        var func = "click_region(\"" + key + "\");";
        $("#regionDiv").append("<li id=\'" + key+  "\' class='region_ul' onclick=\'"+ func + "\';>"
            + key + "</li>");
    });

    var cities = new L.LayerGroup();
    Object.keys(markers).forEach(function(key) {
        markers[key].addTo(cities);
        // metropoles has the lable on load and brought to front
        if(marker_properties[key].type == "metropoles") {
            markerLabels[key].setLabelNoHide(true);
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
        "Google Terrain":googleTerrain
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

        var rl = routeLayer.addLayer(routes);
        rl.addTo(map);
        rl.bringToBack();
        Object.keys(route_points).forEach(function(rp) {
            for (var i = 0; i < route_points[rp].length - 1; i++) {
                //var found = false;
                for (var j = 1; j < route_points[rp].length; j++) {
                    if (route_points[rp][i]["end"] == route_points[rp][j]["end"]) {
                        customLineStyle(route_points[rp][i]["route"], colorLookup[route_points[rp][i]["end"]], 2, 1);
                        customLineStyle(route_points[rp][j]["route"], colorLookup[route_points[rp][i]["end"]], 2, 1);
                    }
                }
            }
        });
    }).error(function(data) {
        console.log("Error!");
    });;
});

/*
 Set a color for an object excluded from a list
 */
function setColor (code, toExclude) {
    if (toExclude.indexOf(code) == -1)
        colorLookup[code];
    else return "lightgray";
}
/*
 * Click on map
 */
function OnMapClick(e) {
    $("#sidebar-pane").removeClass('active');
    $(".sidebar-tabs > li").removeClass('active');
    $("#sidebar").addClass('collapsed');
}

map.on('click', OnMapClick);

/*
 * Zoom on Map.
 */
map.on('zoomend', myzoom);

active_search();
active_autocomp(auto_list);

/*
 * Add the rotes to the map
 */
var routeLayer = L.featureGroup();
/*
 * Highlights and change the color of markers of a region by clicking on a
 * region name.
 */
var prev_select_reg = undefined;
function click_region(reg) {
    document.getElementById(reg).style.color = 'red';
    if(prev_select_reg != undefined)
        document.getElementById(prev_select_reg).style.color ='black';
    prev_select_reg = reg;
    if(reg == "All") {
        Object.keys(markers).forEach(function(key){
            markers[key].setStyle({
                fillColor: colorLookup[markers[key].options.region],
                fillOpacity: "1",
            });
        });

        Object.keys(route_layers).forEach(function(key) {
            route_layers[key].forEach(function (lay) {
                customLineStyle(lay,colorLookup[
                    map_region_to_code[key]], 2, 1);
            });

        });
    } else {
        var tmp = regs[reg];
        Object.keys(markers).forEach(function (key) {
            if (tmp.indexOf(key) == -1) {
                markers[key].setStyle({
                    fillColor: "black", /* "lightgray" */
                    color: "black" /* "lightgray" */
                });
                //markers[key].setZIndexOffset(-1);
                markers[key].options.zIndexOffset = -1000;
            } else {
                markers[key].setStyle({
                    fillColor: "darkred"
                    , color: "black"
                });
                //markers[key].setZIndexOffset(100);
                markers[key].options.zIndexOffset = 1000;
            }
        });

        all_route_layers.forEach(function(lay) {
            customLineStyle(lay, "black", 2, 0.8);  /* "lightgray" */
        });

        if(route_layers[reg] != undefined) {
            route_layers[reg].forEach(function (lay) {
                customLineStyle(lay, 'red', 3, 1);
            });
        }
    }
}

function click_on_list(id) {
    // collapse & expand the text and reference of each item in sources
    $('#'+id+"text").children().toggle();
    $('#'+id+"ref").toggle();
}

