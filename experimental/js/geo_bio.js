/**
 * Created by masoumeh on 10.02.16.
 */
var map,arcLayer,routeLayer, arcVisibility;
var voronoiLayer;
function makeSomeMaps() {
    pathSource = 0;
    var graph_dijks;
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
    routeLayer = d3.carto.layer.topojson();
    routeLayer
        .path("../Data/all_routes_new.topojson")
        .label("Postal Routes")
        .cssClass("roads")
        .renderMode("svg")
        .on("load", function () {
            routeData = routeLayer.features();
            init_graph(routeData);
            graph_dijks = createMatrix(routeData);
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
                        .attr("r", 5);
                    voronoiLayer=gen_voronoi_layer(voronoiLayer, []);
                    setup_city_list(voronoiLayer);
                });
            map.addCartoLayer(cityLayer);
        });
    map.addCartoLayer(wcLayer).addCartoLayer(routeLayer);

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
                updateRoutesCountries(uniqueCountires, graph_dijks, arcGroup);
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
        //arcLayer.visibility('false');

        //findCountries(csv, data, routeData);
        //var select = d3.select("#personSlider")
        //    .append('div')
        //    .append("select")
        //    .on("change", function (d) {
        //        var id = this.options[this.selectedIndex].value;
        //        updateRoutes(id);
        //    });

        //var options = select.selectAll("option").data(Object.keys(peopleMap));
        //options.enter()
        //    .append("option")
        //    .text(function (d) {
        //        return d;
        //    });
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