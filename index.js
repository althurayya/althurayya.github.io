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

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
    streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    }),
    googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
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

var regs = {};
var markers = {};
var markerLabels = {};
var type_size =
{
    "metropoles" : 6,
    "capitals" : 4,
    "villages" :0.7,
    "Waystations" :0.5,
    "towns" : 2
};
$.getJSON($('link[rel="points"]').attr("href"), function (data) {
    var geojson = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            if (regs[feature.properties.cornuData.region_spelled] == undefined)
                regs[feature.properties.cornuData.region_spelled] = [];
            regs[feature.properties.cornuData.region_spelled]
                .push(feature.properties.cornuData.cornu_URI);
            var cities = new L.LayerGroup();
            var marker = L.circleMarker(latlng, {
                cornu_URI : feature.properties.cornuData.cornu_URI,
                //radius: Math.sqrt(feature.properties.topType.length)/3,
                radius: type_size[feature.properties.cornuData.top_type_hom]*1.8,
                fillColor: colorLookup[feature.properties.cornuData.region_code],
                color: 'black',//colorLookup[feature.properties.cornuData.region_code],
                //color: "#fff",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
                type : feature.properties.cornuData.top_type_hom
                //riseOnHover:true,
                //riseOffset:1000000,
                //zIndexOffset:type_size[feature.properties.cornuData.top_type_hom]*10000
            });

            var tmp = marker.bindLabel(feature.properties.cornuData.toponym_arabic);
            tmp.options.className="myLeafletLabel";
            tmp.options.zoomAnimation = true;
            tmp.options.opacity = 0.0;
            tmp.options.direction = "auto";
            markerLabels[feature.properties.cornuData.cornu_URI] = tmp;

            markers[feature.properties.cornuData.cornu_URI] = marker;

            function OnMarkerClick(e) {
                $("#sidebar").removeClass('collapsed');
                $(".sidebar-pane").removeClass('active');
                $(".sidebar-tabs > li").removeClass('active');
                $("#initDesc").remove();
                $("#location").addClass('active');
                $("#locTab").addClass('active');
                $("#locTitle").text(feature.properties.cornuData.toponym_translit + " (" + feature.properties.cornuData.toponym_arabic + ")");
                $("#locDescAr").text(feature.properties.arTitle);
                $("#locDescTranslit").text(feature.properties.translitTitle);
                $("#region").text(colorLookup[feature.properties.regNum]);
                $("#regNum").text(colorLookup[feature.properties.regNum]);
                //$("#admin1").text(feature.properties.admin1_std_name);
                //$("#txtLink > a").text(feature.properties.SOURCE);
                //$("#txtLink > a").attr("href",feature.properties.SOURCE);
                //$("#txtLink > a").attr("target","_blank");
                //$("#geoLink > a").text(feature.properties.geo.geonameId);
                //$("#geoLink > a").attr("href",feature.properties.geo.geonameId);
                $("#geoLink > a").attr("target", "_blank");
            }

            marker.on('click', OnMarkerClick);
            function ResizeMarker(e) {
                var currentZoom = map.getZoom();
                marker.setradius(currentZoom * (Math.sqrt(feature.properties.translitTitle.length) / 3));
            }

            /**/
            return marker
        }
    });

    Object.keys(regs).forEach(function (key) {
        var func = "click_region(\""+ key+"\");";
        $("#regionDiv").append("<li class='region_ul' onclick=\'"+func + "\';>"
            + key + "</li>");
    });

    var map = L.map('map').setView([33.513807, 36.276528], 4);//.fitBounds(geojson.getBounds(), {paddingTopLeft: [500, 0]});
    tiles.addTo(map);
    geojson.addTo(map);
    //markers.addTo(map);
    var cities = new L.LayerGroup();
    Object.keys(markers).forEach(function(key) {
        markers[key].addTo(cities);
        if(markers[key].options.type == "metropoles") {
            markerLabels[key].setLabelNoHide(true);
            markers[key].bringToFront();
        }
    });
    //markers.addTo(cities);
    var baseLayers = {
        "Grayscale": grayscale,
        "Streets": streets,
        "Open Street Map": tiles,
        "Google Satellite":googleSat,
        "Google Terrain":googleTerrain
    };

    var overlays = {
        "cities": cities
    };

    L.control.layers(baseLayers, overlays).addTo(map);
    var sidebar = L.control.sidebar('sidebar').addTo(map);

    function OnMapClick(e) {
        $("#sidebar-pane").removeClass('active');
        $(".sidebar-tabs > li").removeClass('active');
        $("#sidebar").addClass('collapsed');
    }

    map.on('click', OnMapClick);
    map.on('zoomend', function() {
        var currentZoom = map.getZoom();
        if(currentZoom == 6) {
            Object.keys(markers).forEach(function (key) {
                if (markers[key].options.type == "capitals") {
                    markerLabels[key].setLabelNoHide(true);
                    markers[key].bringToFront();
                }
            });
        }

        if(currentZoom == 8) {
            Object.keys(markers).forEach(function (key) {
                if (markers[key].options.type == "towns") {
                    markerLabels[key].setLabelNoHide(true);
                    markers[key].bringToFront();
                }
            });
        }
    });
});

function click_region(reg) {
    var tmp = regs[reg];
    Object.keys(markers).forEach(function(key) {
       if(tmp.indexOf(key) == -1) {
           markers[key].setStyle({fillColor : "gray",
                                    color : "gray"});
           //markers[key].setZIndexOffset(-1);
           markers[key].options.zIndexOffset = -1000;
       } else {
           markers[key].setStyle({fillColor : "red"
                                    , color:"black"});
           //markers[key].setZIndexOffset(100);
           markers[key].bringToFront();

           markers[key].options.zIndexOffset = 1000;
       }
    });
}


