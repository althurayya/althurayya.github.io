/**
 * Created by masoumeh on 10.02.16.
 */
var map, arcLayer, routeLayer, arcVisibility;
var typesToExclude = [];
var voronoiLayer, hullLayer, hullFeatures;

function makeSomeMaps() {
    pathSource = 0;

    //var dijks_graph;
    var svg = d3.select("body").append("svg")
        .attr("width", 1000)
        .attr("height", 600);

    var g = svg.append("g");
    var arcGroup = g.append('g');
    //var dijSource, dijTarget;
    map = d3.carto.map();
    d3.select("#geoMap").call(map);
    map.centerOn([44.361488, 33.312806], "latlong");
    map.setScale(4);
    map.refresh();

    var routeData;
    wcLayer = d3.carto.layer.tile();
    wcLayer
        .tileType("stamen")
        .path("watercolor")
        .label("Watercolor")
        .visibility(true);
    routeLayer = d3.carto.layer.geojson();
    routeLayer
        .path("../Data/all_routes_new.json")
        .label("Postal Routes")
        .cssClass("roads")
        .renderMode("svg")
        .on("load", function () {
            //console.log("route " + JSON.stringify(routeLayer.features()))
            routeData = routeLayer.features();
            //    .filter(function (f) {
            //    if (f.properties.sToponym.indexOf("ROUTPOINT") === -1
            //        && f.properties.eToponym.indexOf("ROUTPOINT") === -1)
            //        return f;
            //});
            init_graph(routeData);
            //console.log("grap " + JSON.stringify(graph));

            cityLayer = d3.carto.layer.csv();
            cityLayer.path("../Data/cornuFilteredRoutes.csv")
                .label("Cities")
                .cssClass("metro")
                .renderMode("svg")
                .x("lon")
                .y("lat")
                .clickableFeatures(true)
                .on("load", function () {
                    var uniqueTopType = {};
                    cityLayer.features().forEach(function (f) {
                        uniqueTopType[f['topType']] = 0;
                    });
                    var disOpts = d3.select("#displayOptionsContainer");
                    Object.keys(uniqueTopType).forEach(function (type) {
                        topTypeDiv(disOpts, type);
                    });
                    //the initial of circles
                    d3.selectAll("circle").transition().duration(1000)
                        .style("fill", "seagreen")
                        .attr("r", 1);
                    //TODO: to exclude topTypes from voronoi as a third argument in createVoronoiLayer function
                    var poly = {'data': []};
                    makeHull();
                    voronoiLayer = map.createVoronoiLayer(cityLayer, 0.5, typesToExclude );
                    voronoiLayer
                        //.label("Voronoi!")
                        //.cssClass("voronoi")
                        .on("load", function () {
                            var data = {};
                            //d3.json("../Python/commonWithCornu.json", function (error, json) {
                            // data = json;//console.log(JSON.stringify(Object.keys(json)));
                            var c20 = d3.scale.category20();
                            var ind = 1;
                            var region_color = {};
                            voronoiLayer.g().selectAll("path")
                                .style("fill", function (p) {
                                    //var areaLim = 5;
                                    var pol = d3.geom.polygon(p["geometry"]["coordinates"][0]);
                                    var poly = p["geometry"]["coordinates"][0];
                                    var center = pol.centroid();
                                    var region = p['properties']['node']['region'];
                                    if (region == "noData") return "rgba(0,0,0,0)";
                                    if (region_color[region] == undefined) {
                                        region_color[region] = c20(ind);
                                        ind++;
                                        if (ind == 20) ind = 1;
                                    }
                                    var max_area = 100;
                                    var sub = 8;

                                    if (region == "Sind") max_area = 50;
                                    if (region == "Barqa") max_area = 10;
                                    if (region == "Sicile") {
                                        max_area = 1;
                                        sub = 10;
                                    }
                                    if (region == "Khazar") max_area = 0;
                                    if (region == "Rihab") max_area = 10;
                                    if (region == "Daylam") max_area = 15;
                                    if (region == "Jazirat al-Arab") max_area = 40;
                                    if (region == "Yemen") max_area = 40;
                                    if (region == "Transoxiana") max_area = 2;
                                    //if (Math.abs(pol.area()) < max_area) {
                                        for (var i = 0; i < poly.length; i++) {
                                            var dist =
                                                Math.sqrt(Math.pow(Math.abs(center[0] - poly[i][0]), 2) +
                                                    Math.pow(Math.abs(center[1] - poly[i][1]), 2));
                                            if (dist > max_area / 4) {
                                                var v1 = poly[i][0] - center[0];
                                                v1 /= dist;
                                                var v2 = poly[i][1] - center[1];
                                                v2 /= dist;
                                                p["geometry"]["coordinates"][0][i] =
                                                    [center[0] + (dist / sub) * v1,
                                                        center[1] + (dist / sub) * v2];
                                            }
                                        }
                                        return region_color[region];
                                    //}
                                    //else return "rgba(0,0,0,0)";
                                }).style("stroke-width", "0.0");

                            voronoiLayer.g().selectAll("g.marker")
                                .filter(function (p) {
                                    var pol = d3.geom.polygon(p["geometry"]["coordinates"][0]);
                                    //if(Math.abs(pol.area()) < 1) return "red";
                                    if (p['properties']['node']['region'] == "Sham") {
                                        if (Math.abs(pol.area()) < 1)
                                            return p;
                                    }
                                })
                                .style("pointer-events", "all")
                                .style()
                                .on("click", function () {
                                    //alert(d3.mouse(this));
                                });
                            //});
                            //var clippedVoronoi = voronoiLayer.g().selectAll("g.marker")
                            //    .map(function (vor) {
                            //        return hullLayer.features().clip(vor);
                            //    })

                        });
                    //d3.geom.polygon(voronoiLayer.features()).clip(hullFeatures);

                    map.addCartoLayer(voronoiLayer);
                    //console.log("city "+ JSON.stringify(cityLayer.features()))

                });
            map.addCartoLayer(cityLayer);
            closeOpen('leftPanel');
            closeOpen('rightPanel');
        });
    map.addCartoLayer(wcLayer).addCartoLayer(routeLayer);
    //return;

    d3.csv("../Data/cornuFilteredRoutes.csv", function (csv) {
        var prev = '';
        // To filter the duplicate names and those containing "RoutPoint"
        var filteredData = csv.filter(function (d) {
            if (d.arTitle.indexOf('RoutPoint') === -1) {
                var test;
                if (prev !== d.arTitle) test = true;
                prev = d.arTitle;
                if (test) return d;
            }
        });
        filteredData.sort(function (a, b) {
            // ignore upper and lowercase
            var nameA = a.eiSearch.toUpperCase();
            var nameB = b.eiSearch.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });

        // drop down list for starting point of network flow,
        // containing arTitles from cornu.csv file
        d3.select("#networkStart").on("change", function (d) {
            var id = this.options[this.selectedIndex].value;
            d3.selectAll('circle').filter(function (d) {
                return d.topURI == id
            }).attr("r", 10);

            var s = graph.getNode(id);
            //console.log("graph "+JSON.stringify(graph));
            var distances = shortestPath(s, s, 'n');
            //console.log("dis "+JSON.stringify(distances))
            var network = getNetwork(distances, 5); //multiplier
            //console.log("net " +JSON.stringify(network));
            var sitesByZone = network.values();
            //console.log("sites "+sitesByZone);
            var topURI_zone = {};
            var c10 = d3.scale.category10();
            voronoiLayer.g().selectAll("path")
                .style("fill", function (p) {
                    var turi = p['properties']['node']['topURI'];
                    var ttype = p['properties']['node']['topType'];
                    var pol = d3.geom.polygon(p["geometry"]["coordinates"][0]);
                    if (pol.area() > 10) return "rgba(0,0,0,0)";
                    //if(ttype=="waystations") return "rgba(0,0,0,0)";
                    //if(ttype=="sites") return "rgba(0,0,0,0)";
                    //if(ttype=="waters") return "rgba(0,0,0,0)";
                    for (var i = 0; i < sitesByZone.length; i++) {
                        var zone = sitesByZone[i];
                        if (zone.indexOf(turi) != -1) {
                            //if(turi.indexOf("NAHRAWAN")!=-1) {
                            //    console.log("salam " + turi);
                            //    return "yellow";
                            //}
                            return c10(i + 1);
                        }
                    }
                    return "rgba(0,0,0,0)";
                });
        }).selectAll("option").data(filteredData).enter()
            .append("option")
            .attr("value", function (d) {
                return d.topURI;
            })
            .text(function (d) {
                return d.eiSearch;
            });

        //d3.select("#networkStart").sort();

        d3.csv("../Data/peopleRegion.csv", function (error, data) {
            if (error) throw error;
            // Creating the required data structures
            var output = dataStructsBetweenPeopleYears(data);
            // Min year
            var min_year = output['min_year'];
            // Max year
            var max_year = output['max_year'];
            // A map from people to places they have been related to
            var peopleMap = output['peopleMap'];
            // A map from years to people they have been related to
            var yearPeople = output['yearPeople'];

            var slider = d3.slider().value([0, 100])
                .on("slide", function (evt, value) {
                    d3.select('#minYear').text(''
                        + parseInt(value[0] + min_year) * parseInt((max_year - min_year) / 100));
                    d3.select('#maxYear').text('' +
                        +parseInt(value[1] + min_year) * parseInt((max_year - min_year) / 100));
                });
            //function update(value) {
            d3.select("#calcConnections")
                .on("click", function () {
                    var minyear = parseInt(d3.select('#minYear').html());
                    var maxyear = parseInt(d3.select('#maxYear').html());
                    var uniqueCountires =
                        unify_year_people(minyear, maxyear, yearPeople, peopleMap);
                    //updateRoutesCountries(uniqueCountires, dijks_graph, arcGroup);
                });
            d3.select("#yearSlider").call(slider);
            d3.select("#minYear").text(min_year + '');
            d3.select("#maxYear").text(max_year + '');

            arcLayer = d3.carto.layer.geojson();
            arcLayer.path("../Data/arcs.json")
                .label("Arcs")
                .visibility(false)
                .renderMode("svg")
                .cssClass("roads")
                .clickableFeatures(true);
            arcVisibility = false;
            map.addCartoLayer(arcLayer);
        });
    });
}

function closeOpen(container) {
    switch (container) {
        case "leftPanel":
            d3.select("#controlbar").style("left") == "15px" ? d3.select("#controlbar").transition().duration(500).style("left", "-350px") : d3.select("#controlbar").transition().duration(500).style("left", "15px");
            d3.select("#closeLeft").classed("rightarrow") ? d3.select("#closeLeft").classed("rightarrow", false).classed("leftarrow", true) : d3.select("#closeLeft").classed("rightarrow", true).classed("leftarrow", false);
            break;
        case "rightPanel":
            if (d3.select("#rightControls").style("right") == "15px") {
                d3.select("#rightControls").transition().duration(500).style("right", "-300px")
                d3.select("#mapControls").transition().duration(500).style("right", "60px")
            }
            else {
                d3.select("#rightControls").transition().duration(500).style("right", "15px")
                d3.select("#mapControls").transition().duration(500).style("right", "200px")
            }
            d3.select("#closeRight").classed("rightarrow") ? d3.select("#closeRight").classed("rightarrow", false).classed("leftarrow", true) : d3.select("#closeRight").classed("rightarrow", true).classed("leftarrow", false);
            break;
    }
}

function topTypeDiv(disOpts, type) {
    var div = disOpts.append("div")
        .style("width", "100%")
        .append("div")
        .attr("id", function () {
            return type;
        })
        .attr("class", "eyeButton");
    var input = div.append("input")
        .attr("id", type + "Button")
        .attr("class", "mode-checkbox")
        .attr("name", "display")
        .attr("checked", "checked")
        .attr("type", "checkbox")
        .attr("value", function () {
            return type;
        })
        .on("change", function () {
            if (!this.checked) {
                d3.selectAll("circle")
                    .filter(function (d) {
                        return d.topType == type;
                    }).attr("r", 0);
                //var updateLayer = cityLayer.features().filter(function (f) {
                //    return f.topType !== type;
                //})
                var val = this.value;
                typesToExclude.push(val);
                //map.deleteCartoLayer(voronoiLayer);
//                map.refresh()
//                voronoiLayer.g().selectAll("path").remove();

                cityLayer.features(cityLayer.features().filter(function(f){
                    return f.topType === "capitals";
                }));

                map.deleteCartoLayer(voronoiLayer);
                map.deleteCartoLayer(hullLayer);
                hullLayer = makeHull();
                voronoiLayer = map.createVoronoiLayer(cityLayer, 0.5, typesToExclude );
                voronoiLayer
                    //.label("Voronoi!")
                    //.cssClass("voronoi")
                    .on("load", function () {
                        var data = {};
                        //d3.json("../Python/commonWithCornu.json", function (error, json) {
                        // data = json;//console.log(JSON.stringify(Object.keys(json)));
                        var c20 = d3.scale.category20();
                        var ind = 1;
                        var region_color = {};
                        voronoiLayer.g().selectAll("path")
                            .style("fill", function (p) {
                                //var areaLim = 5;
                                var pol = d3.geom.polygon(p["geometry"]["coordinates"][0]);
                                var poly = p["geometry"]["coordinates"][0];
                                var center = pol.centroid();
                                var region = p['properties']['node']['region'];
                                if (region == "noData") return "rgba(0,0,0,0)";
                                if (region_color[region] == undefined) {
                                    region_color[region] = c20(ind);
                                    ind++;
                                    if (ind == 20) ind = 1;
                                }
                                var max_area = 100;
                                var sub = 8;

                                if (region == "Sind") max_area = 50;
                                if (region == "Barqa") max_area = 10;
                                if (region == "Sicile") {
                                    max_area = 1;
                                    sub = 10;
                                }
                                if (region == "Khazar") max_area = 0;
                                if (region == "Rihab") max_area = 10;
                                if (region == "Daylam") max_area = 15;
                                if (region == "Jazirat al-Arab") max_area = 40;
                                if (region == "Yemen") max_area = 40;
                                if (region == "Transoxiana") max_area = 2;
                                if (Math.abs(pol.area()) < max_area) {
                                    for (var i = 0; i < poly.length; i++) {
                                        var dist =
                                            Math.sqrt(Math.pow(Math.abs(center[0] - poly[i][0]), 2) +
                                                Math.pow(Math.abs(center[1] - poly[i][1]), 2));
                                        if (dist > max_area / 4) {
                                            var v1 = poly[i][0] - center[0];
                                            v1 /= dist;
                                            var v2 = poly[i][1] - center[1];
                                            v2 /= dist;
                                            p["geometry"]["coordinates"][0][i] =
                                                [center[0] + (dist / sub) * v1,
                                                    center[1] + (dist / sub) * v2];
                                        }
                                    }
                                    return region_color[region];
                                }
                                else return "rgba(0,0,0,0)";
                            }).style("stroke-width", "0.0");

                        voronoiLayer.g().selectAll("g.marker")
                            .filter(function (p) {
                                var pol = d3.geom.polygon(p["geometry"]["coordinates"][0]);
                                //if(Math.abs(pol.area()) < 1) return "red";
                                if (p['properties']['node']['region'] == "Sham") {
                                    if (Math.abs(pol.area()) < 1)
                                        return p;
                                }
                            })
                            .style("pointer-events", "all")
                            .style()
                            .on("click", function () {
                                //alert(d3.mouse(this));
                            });
                        //});
                    });

                map.addCartoLayer(voronoiLayer);
                map.addCartoLayer(hullLayer);

                map.refreshCartoLayer(voronoiLayer);
                map.refreshCartoLayer(hullLayer);

                map.refresh();

                //map.createVoronoiLayer(cityLayer, 0.5, typesToExclude);
            } else {
                d3.selectAll("circle")
                    .filter(function (d) {
                        return d.topType == type;
                    }).attr("r", 5);
            }
        });

    div.append("label")
        .attr("for", function () {
            return type + "button";
        })
        .attr("class", "mode-picker-label")
        .attr("name", "display")
        .html(function () {
            return type;
        });
}

function hideAllTab() {
    d3.select('#persontab').style('display', 'none');
    d3.select('#person').style('background', '#B1CA8D');
    d3.select('#networktab').style('display', 'none');
    d3.select('#network').style('background', '#B1CA8D');
    d3.select('#routetab').style('display', 'none');
    d3.select('#route').style('background', '#B1CA8D');
}

function showTab(tabname) {
    hideAllTab();
    d3.select('#' + tabname).style('display', 'block');
    d3.select('#' + tabname.substring(0, tabname.length - 3)).style('background', 'white');
}

function polygon(d) {
    return "M" + d.join("L") + "Z";
}

function makeHull() {
    hullLayer = map.createHullLayer(cityLayer)
    //    , function (d) {
    //    return d.region
    //});
    hullLayer.markerSize(1).cssClass("cityhull")
        .on("load", recolorHulls)
    map.addCartoLayer(hullLayer);
    console.log("hull layer f " +JSON.stringify(hullLayer.features()))

    function recolorHulls() {
        var hullColor = d3.scale.category20b();
        hullLayer.g()
            .selectAll("path")
            .style("fill", function (d, i) {
                return hullColor(i % 20)
            });
    }
}
