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
    13: "#514285",
    14: "#539675",
    15: "#4B281F",
    16: "#539236",
    17: "#DB4621",
    18: "#68DA85",
    19: "#6C7BD8",
    20: "#DBB540",
    21: "#8F3247",
    22: "#A8DBD5",
    23: "#C9DB3F",
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
// Types of the toponyms
var type_size =
{
    "metropoles" : 6,
    "capitals" : 4,
    "towns" : 2,
    "villages" : 1,
    "waystations" : 0.7
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
                radius: type_size[feature.properties.cornuData.top_type_hom]*1.8,
                fillColor: colorLookup[feature.properties.cornuData.region_code],
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
                feature.properties.cornuData.cornu_URI, feature.properties.cornuData.toponym_translit]);
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
    // Create html list of regions in regio tab
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
        "Open Street Map": tiles,
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
            //console.log(JSON.stringify(layer));
            var sRegion, eRegion;
            var sFound = false;
            var eFound = false;
            var keys = Object.keys(markers);
            for(var i = 0; i < keys.length;i++) {
                if (sFound == false &&
                    feature.properties.sToponym == markers[keys[i]].options.cornu_URI) {
                    sFound = true;
                    sRegion = markers[keys[i]].options.region;
                }
                if (eFound == false &&
                    feature.properties.eToponym == markers[keys[i]].options.cornu_URI) {
                    eFound = true;
                    eRegion = markers[keys[i]].options.region;
                }
                if (sFound == true && eFound == true)
                    break;
            }
            all_route_layers.push(layer);
            map_region_to_code[markers[keys[i]].options.region_spelled]
                =markers[keys[i]].options.region;
            if (sRegion == eRegion) {
                if(route_layers[markers[keys[i]].options.region_spelled] == undefined)
                    route_layers[markers[keys[i]].options.region_spelled] = [];
                route_layers[markers[keys[i]].options.region_spelled].push(layer);
                customLineStyle(layer, colorLookup[eRegion], 2, 1)
            }
            else {
                customLineStyle(layer, "gray", 1, 1)
            }

        }
        routeLayer.addLayer(routes).addTo(map);
    });
});
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
        //console.log(markers[key])
        var searchTitle = markers[key].options.searchTitle.toUpperCase();
        var cornuURI = markers[key].options.cornu_URI.toUpperCase();
        var arabicTitle = markers[key].options.arabicTitle.toUpperCase();
        var lat = markers[key].options.lat;
        var lng = markers[key].options.lng;
        var markerSearchTitle = searchTitle.concat(" ", cornuURI, " ", arabicTitle);
        //console.log("hi " +markerSearchTitle)
        var searchTerm = $( '#searchInput' ).val().toUpperCase();
        if ( markerSearchTitle.indexOf(searchTerm) != -1 ) {
            markers[key].setStyle({fillOpacity: 1,
                fillColor: "red"})
        }
        if (markerSearchTitle.indexOf(searchTerm) == -1
            && searchTerm !== "")
            markers[key].setStyle({fillOpacity: 0.2,
                fillColor: colorLookup[markers[key].options.region]})
        else if (searchTerm === "") {
            zoom();
            markers[key].setStyle({fillOpacity: 1,
                fillColor: colorLookup[markers[key].options.region]})
        }
    })
});
 /*
 * Autocomplete the search input
 */
$( "#searchInput" ).autocomplete({
    appendTo: "#searchPane",
    source: auto_list,
    minLength: 3,
    select: function (e, ui) {
        var selected = ui.item.value.toUpperCase();
        Object.keys(markers).forEach(function(key) {
            markerLabels[key].setLabelNoHide(false);
            var merkerSearchTitle = markers[key].options.searchTitle.toUpperCase();
            if (merkerSearchTitle.indexOf(selected) != -1) {
                markers[key].setStyle({
                    fillOpacity: 1,
                    fillColor: "red"
                });
                map.panTo(new L.LatLng(lat, lng));
            }
            else
                markers[key].setStyle({
                    fillOpacity: 0.2,
                    fillColor: colorLookup[markers[key].options.region]
                })
        })
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
                color: "gray"
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
                    fillColor: "gray",
                    color: "gray"
                });
                //markers[key].setZIndexOffset(-1);
                markers[key].options.zIndexOffset = -1000;
            } else {
                markers[key].setStyle({
                    fillColor: "red"
                    , color: "black"
                });
                //markers[key].setZIndexOffset(100);
                markers[key].bringToFront();

                markers[key].options.zIndexOffset = 1000;
            }
        });

        all_route_layers.forEach(function(lay) {
            customLineStyle(lay, 'gray', 2, 0.8);
        });

        if(route_layers[reg] != undefined) {
            route_layers[reg].forEach(function (lay) {
                customLineStyle(lay, 'red', 3, 1);
            });
        }
    }
}

