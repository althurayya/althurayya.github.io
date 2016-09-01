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
var colorLookup = {
    1: "#D5812E",
    2: "#A768E6",
    3: "#58E0C1",
    4: "#323449",
    5: "#6CD941",
    6: "#E23A80",
    7: "#ABB1DB",
    8: "#384E21",
    9: "#BDD977",
    10: "#B27E86",
    11: "#8F351D",
    12: "#D5AB7A",
    13: "#d3d3d3",//"#514285", has changed to light gray to set this region to background
    14: "#539675",
    15: "#4B281F",
    16: "#539236",
    17: "#DB4621",
    18: "#68DA85",
    19: "#6C7BD8",
    20: "#DBB540",
    21: "#8F3247",
    22: "#d3d3d3",//"#A8DBD5", has changed to light gray to set this region to background
    23: "#d3d3d3",//"#C9DB3F", has changed to light gray to set this region to background
    24: "#537195",
    25: "#7E5C31",
    26: "#D1785F",
    27: "#898837",
    28: "#DC4AD3",
    29: "#DD454F",
    30: "#C4D9A5",
    31: "#DDC1BF",
    32: "#D498D2",
    33: "#61B7D6",
    34: "#A357B1",
    35: "#522046",
    36: "#849389",
    37: "#3B524B",
    38: "#DD6F91",
    39: "#B4368A",
    41: "#8F547C"
};
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
// Types of the toponyms to be shown on map
var type_size =
{
    "metropoles" : 5.2,
    "capitals" : 4.3,
    "towns" : 2.3,
    "villages" : 1.3,
    "waystations" : 1,
    "xroads" : 0.7
};
var geojson;
var map = L.map('map',{maxZoom:max_zoom}).setView([33.513807, 36.276528], min_zoom);//.fitBounds(geojson.getBounds(), {paddingTopLeft: [500, 0]});
var auto_list = [];
var latlngs = [];
$.getJSON($('link[rel="points"]').attr("href"), function (data) {
    geojson = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            if (regs[feature.properties.cornuData.region_spelled] == undefined)
                regs[feature.properties.cornuData.region_spelled] = [];
            regs[feature.properties.cornuData.region_spelled]
                .push(feature.properties.cornuData.cornu_URI);

            var marker = L.circleMarker(latlng, {
                cornu_URI : feature.properties.cornuData.cornu_URI,
                //radius: Math.sqrt(feature.properties.topType.length)/3,
                radius: type_size[feature.properties.cornuData.top_type_hom]*2,
                fillColor: setColor(feature.properties.cornuData.region_code, [13, 23]),
                color: colorLookup[feature.properties.cornuData.region_code],
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
                type : feature.properties.cornuData.top_type_hom,
                region : feature.properties.cornuData.region_code,
                region_spelled : feature.properties.cornuData.region_spelled,
                searchTitle : feature.properties.cornuData.toponym_search,
                arabicTitle : feature.properties.cornuData.toponym_arabic,
                lat : feature.properties.cornuData.coord_lat,
                lng : feature.properties.cornuData.coord_lon
            });
            latlngs.push([latlng['lat'],latlng['lng']])
            var tmp = marker.bindLabel(feature.properties.cornuData.toponym_translit);
            // list of toponyms for autocomplete action of the search input
            auto_list.push.apply(auto_list,[feature.properties.cornuData.toponym_search,
                feature.properties.cornuData.cornu_URI, feature.properties.cornuData.toponym_arabic]);
            tmp.options.className="myLeafletLabel";
            tmp.options.zoomAnimation = true;
            tmp.options.opacity = 0.0;
            tmp.options.direction = "auto";
            markerLabels[feature.properties.cornuData.cornu_URI] = tmp;
            markers[feature.properties.cornuData.cornu_URI] = marker;
           /*
            * click on a marker
            */
            marker.on('click', OnMarkerClick);
            function OnMarkerClick(e) {
                $("#sidebar").removeClass('collapsed');
                $(".sidebar-pane").removeClass('active');
                $(".sidebar-tabs > li").removeClass('active');
                $("#initDesc").remove();
                $("#location").addClass('active');
                $("#locTab").addClass('active');
                $("#locTitle").text(feature.properties.cornuData.toponym_translit
                    + " (" + feature.properties.cornuData.toponym_arabic + ")");
                $("#locDescAr").text(feature.properties.arTitle);
                $("#locDescTranslit").text(feature.properties.translitTitle);
                $("#region").text(colorLookup[feature.properties.regNum]);
                $("#regNum").text(colorLookup[feature.properties.regNum]);
                $("#cornuDetails").text("MoreDetails:");
                //$("#admin1").text(feature.properties.admin1_std_name);
                //$("#txtLink > a").text(feature.properties.SOURCE);
                //$("#txtLink > a").attr("href",feature.properties.SOURCE);
                //$("#txtLink > a").attr("target","_blank");
                //$("#geoLink > a").text(feature.properties.geo.geonameId);
                //$("#geoLink > a").attr("href",feature.properties.geo.geonameId);
                $("#geoLink > a").attr("target", "_blank");

                // Create html content of cornu details ( in location tab) for a location clicked
                  Object.keys(feature.properties.cornuData).forEach(function (cData) {
                      $("#cornuDetails").append("<li class='details_li'>"+cData+"</li><p class = 'details_text'>"+feature.properties.cornuData[cData]+"</p>");
                  })

            }
            function ResizeMarker(e) {
                var currentZoom = map.getZoom();
                marker.setradius(currentZoom * (Math.sqrt(feature.properties.translitTitle.length) / 3));
            }
            return marker
        }
    });
    // Create html list of regions in region tab
    Object.keys(regs).forEach(function (key) {
        var func = "click_region(\"" + key + "\");";
        $("#regionDiv").append("<li id=\'" + key+  "\' class='region_ul' onclick=\'"+ func + "\';>"
            + key + "</li>");
    });
    // Add tile and markers to the map
    prevTile.addTo(map);
    geojson.addTo(map);

    var cities = new L.LayerGroup();
    Object.keys(markers).forEach(function(key) {
        markers[key].addTo(cities);
        // metropoles has the lable on load and brought to front
        if(markers[key].options.type == "metropoles") {
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
    $.getJSON($('link[rel="routes"]').attr("href"), function (data) {
        var routes = L.geoJson(data, {onEachFeature: onEachFeature});
        function onEachFeature(feature, layer) {
            var sRegion, eRegion;
            var sFound = false;
            var eFound = false;
            var keys = Object.keys(markers);
            for (var i = 0; i < keys.length; i++) {
                if (sFound == false &&
                    feature.properties.sToponym == markers[keys[i]].options.cornu_URI) {
                    sFound = true;
                    sRegion = markers[keys[i]].options.region;
                    // populate the route_points dictionary with neighbours of the route points
                    if (sRegion == 22) {
                        if (route_points[feature.properties.sToponym] == undefined)
                            route_points[feature.properties.sToponym] = [];
                        var tmp = {};
                        tmp["route"] = layer;
                        tmp["end"] = markers[feature.properties.eToponym].options.region;
                        route_points[feature.properties.sToponym].push(tmp);
                    }
                }
                if (eFound == false &&
                    feature.properties.eToponym == markers[keys[i]].options.cornu_URI) {
                    eFound = true;
                    eRegion = markers[keys[i]].options.region;
                    // populate the route_points dictionary with neighbours of the route points
                    if (eRegion == 22) {
                        if (route_points[feature.properties.eToponym] == undefined)
                            route_points[feature.properties.eToponym] = [];
                        var tmp = {};
                        tmp["route"] = layer;
                        tmp["end"] = markers[feature.properties.sToponym].options.region;
                        route_points[feature.properties.eToponym].push(tmp);
                    }
                }
                if (sFound == true && eFound == true)
                    break;
            }
            all_route_layers.push(layer);
            map_region_to_code[markers[keys[i]].options.region_spelled]
                = markers[keys[i]].options.region;
            /* Regions 13, 22, and 23 will be light gray.
             * There might be some coloring over routes which are subsections of other routes.
             * That means, some routes of region 22, might get the light blue color
             * (original color before setting that to gray)
             * even though in the code they get gray first (in else)!
            */
            if (sRegion == eRegion) {
                if (route_layers[markers[keys[i]].options.region_spelled] == undefined)
                    route_layers[markers[keys[i]].options.region_spelled] = [];
                route_layers[markers[keys[i]].options.region_spelled].push(layer);
                customLineStyle(layer, colorLookup[sRegion], 2, 1);
            }
            else
                customLineStyle(layer, "lightgray", 1, 1);
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
                    $("#routeDetails").append("<li class='details_li'>"+rData+"</li><p class = 'details_text'>"+layer.feature.properties[rData]+"</p>");
                })
            }
        }
        routeLayer.addLayer(routes).addTo(map);
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
    });
});
/*
 Set a color for an object, not in a list
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
map.on('zoomend', zoom);
var keySorted = Object.keys(type_size).sort(function (a, b) {
    return type_size[a] - type_size[b] > 0;
});
/*
 * Show/Hide the labels based on the zoom level.
 */
function zoom() {
    var currentZoom = map.getZoom();
    var step = max_zoom - min_zoom / type_size.length;

    if(currentZoom - prevZoom < 0) {
        Object.keys(markers).forEach(function (key) {
            if (markers[key].options.type ==
                keySorted[Math.floor((max_zoom - currentZoom - 2) / 2)]) {
                markerLabels[key].setLabelNoHide(false);
                markers[key].bringToFront();
            }
        });
    } else {
        Object.keys(markers).forEach(function (key) {
            if (markers[key].options.type ==
                keySorted[Math.floor((max_zoom - currentZoom - 1) / 2)]) {
                markerLabels[key].setLabelNoHide(true);
                markers[key].bringToFront();
            }
        });
    }
    prevZoom = currentZoom;
}
/*
 * Search Toponym
 */
$( '#searchInput' ).on( 'keyup', function() {
    Object.keys(markers).forEach(function(key) {
        var searchTitle = markers[key].options.searchTitle.toUpperCase();
        var cornuURI = markers[key].options.cornu_URI;
        var arabicTitle = markers[key].options.arabicTitle;
        var markerSearchTitle = [];
        markerSearchTitle.push(searchTitle, cornuURI, arabicTitle);
        var searchTerm = $( '#searchInput' ).val().toUpperCase();
        if (searchTerm !== "") {
            if ( markerSearchTitle.indexOf(searchTerm) != -1) {
                console.log("if: "+ markerSearchTitle);
                customMarkerStyle(markers[key], "red", 1)
            }
            else {
                console.log("else: "+markerSearchTitle);
                customMarkerStyle(markers[key], colorLookup[markers[key].options.region], 0.2)
            }
        }
        if (searchTerm === "") {
            zoom();
            customMarkerStyle(markers[key], colorLookup[markers[key].options.region], 1)
        }
    })
});


 /*
 * Autocomplete the search input
 */
$( "#searchInput" ).autocomplete({
    appendTo: "#searchPane",
    source: auto_list,
    minLength: 4,
    select: function (e, ui) {
        var selected = ui.item.value.toUpperCase();
        var selectedMarker;
        Object.keys(markers).forEach(function(key) {
            markerLabels[key].setLabelNoHide(false);
            var markerSearchTitle = markers[key].options.searchTitle.toUpperCase();
            var markerTopURI = markers[key].options.cornu_URI;
            var markerArabicTitle = markers[key].options.arabicTitle;
            // Change the circle marker color to red if it matches the selected search value
            if (markerSearchTitle == selected || markerArabicTitle == selected
                    || markerTopURI == selected) {
                selectedMarker = markers[key];
                customMarkerStyle(markers[key], "red", 1)
                if (selected.indexOf("ROUTPOINT")!== -1)
                    console.log("if: "+markers[key].options.searchTitle)
            }
            // else, make them pale
            else {
                customMarkerStyle(markers[key], colorLookup[markers[key].options.region], 0.2)
                if (selected.indexOf("ROUTPOINT")!== -1)
                    console.log("else: "+markers[key].options.searchTitle)
            }
        })
        // re-center the map if the selected item exist!
        if (selectedMarker !== undefined) {
            console.log(selectedMarker.options)
            var lat = selectedMarker.options.lat;
            var lng = selectedMarker.options.lng;
            map.panTo(new L.LatLng(lat, lng));
        }
    }
});
/*
 * Add the rotes to the map
 */
var routeLayer = L.featureGroup();
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
                color: "lightgray"
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
                    fillColor: "lightgray",
                    color: "lightgray"
                });
                //markers[key].setZIndexOffset(-1);
                markers[key].options.zIndexOffset = -1000;
            } else {
                markers[key].setStyle({
                    fillColor: "darkred"
                    , color: "black"
                });
                //markers[key].setZIndexOffset(100);
                markers[key].bringToFront();

                markers[key].options.zIndexOffset = 1000;
            }
        });

        all_route_layers.forEach(function(lay) {
            customLineStyle(lay, 'lightgray', 2, 0.8);
        });

        if(route_layers[reg] != undefined) {
            route_layers[reg].forEach(function (lay) {
                customLineStyle(lay, 'red', 3, 1);
            });
        }
    }
}

