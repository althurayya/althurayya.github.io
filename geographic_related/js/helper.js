/**
 * Created by masum on 11.02.16.
 */
// make a unique list of countries(names) for people in a specific year
// starting from a yearPeople map(year to people ids) to peopleMap (people to year + country (name))
function unify_year_people(minyear, maxyear, yearPeople, peopleMap) {
    var uniqueCountries = {};
    for (var i = minyear; i <= maxyear; i++) {
        if (yearPeople[i + ''] != undefined) {
            var arr = yearPeople[i + '']['id'].split(',');
            arr.forEach(function (d) {
                var city = peopleMap[d]['city'].split(',');
                city.forEach(function (d) {
                    if (uniqueCountries[d] == undefined)
                        uniqueCountries[d] = 0;
                    // counts the number of countries in a map
                    else uniqueCountries[d]++;
                });
            });
        }
    }
    return uniqueCountries;
}

function createMatrix(postdata) {
    edgeMap = {};
    nodeHash = {};
    for (x in postdata) {
        var line = postdata[x].geometry.coordinates;
        var sName = postdata[x].properties.sToponym;
        var eName = postdata[x].properties.eToponym;
        var lS = line[0];
        var lE = line[line.length - 1];
        var nA = [lS, lE];
        var cost = d3.geo.length(postdata[x]) * 6371;
        if (edgeMap[sName]) {
            edgeMap[sName][eName] = cost;
        }
        else {
            edgeMap[sName] = {};
            edgeMap[sName][eName] = cost;
        }
        if (edgeMap[eName]) {
            edgeMap[eName][sName] = cost;
        }
        else {
            edgeMap[eName] = {};
            edgeMap[eName][sName] = cost;
        }
    }

    return new DijksGraph(edgeMap);
}

function calcPathSize(d, uniquePaths) {
    //var pathscale = d3.scale.linear()
    //    .domain([d3.min(d3.values(uniquePaths)),d3.max(d3.values(uniquePaths))])
    //    .range([1,20]);
    if (arcLayer.visibility())
        var pathscale = d3.scale.linear().domain([1, 15]).range([1, 30]);
    else if (routeLayer.visibility())
        var pathscale = d3.scale.linear().domain([1, 15]).range([1, 15]);
    // To consider the paths from A to B and B to A as one path
    var tmp1 = uniquePaths[d.properties.sToponym
    + "," + d.properties.eToponym];
    var tmp2 = uniquePaths[d.properties.eToponym
    + "," + d.properties.sToponym];
    var size;
    if (tmp1 == undefined && tmp2 == undefined) {
        size = 0
    }
    else {
        if (tmp1 == undefined)
            size = pathscale(tmp2);
        else size = pathscale(tmp1);
    }
    return size;
}

function calcPathSizeForColors(d, uniquePaths) {
    //var pathscale = d3.scale.linear()
    //    .domain([d3.min(d3.values(uniquePaths)),d3.max(d3.values(uniquePaths))])
    //    .range([1,20]);
    var pathscale = d3.scale.linear().domain([1, 15]).range([1, 20]);
    // To consider the paths from A to B and B to A as one path
    var tmp1 = uniquePaths[d.properties.sToponym
    + "," + d.properties.eToponym];
    var tmp2 = uniquePaths[d.properties.eToponym
    + "," + d.properties.sToponym];
    var size;
    if (tmp1 == undefined && tmp2 == undefined) {
        size = 0
    }
    else {
        if (tmp1 == undefined)
            size = pathscale(tmp2);
        else size = pathscale(tmp1);
    }
    return size;
}

function displayPath(pathData, countries, uniquePaths) {
    //console.log("countries: " + JSON.stringify(d3.values(countries)));
    //console.log("uniqPaths: "+JSON.stringify(uniquePaths));
    var rscale = d3.scale.linear()
        .domain(d3.extent(d3.values(countries)))
        .range([5, 30]);

    var colorScale = d3.scale.linear()
        .domain(d3.extent(d3.values(uniquePaths)))
        .range(["darkseagreen", "darkgreen"])
        .interpolate(d3.interpolateHcl);

    //Initial fill of all circles
    d3.selectAll("circle").transition().duration(1000)
        .style("fill", "seagreen")
        .attr("r", 5);
    //
    d3.selectAll("path").filter(function (d) {
        return pathData.indexOf(d.properties.sToponym) === -1
            || pathData.indexOf(d.properties.eToponym) === -1;
    }).transition().duration(1000).style("stroke-width", 0); // or display property?

    if (pathData) {
        d3.selectAll("path").filter(function (d) {
            return pathData.indexOf(d.properties.sToponym) > -1
                && pathData.indexOf(d.properties.eToponym) > -1;
        }).transition().duration(2000).style("stroke", function (d) {
            var size = calcPathSizeForColors(d, uniquePaths);
            return colorScale(size);
        }).style("stroke-width", function (d) {
            return calcPathSize(d, uniquePaths);
        });

        d3.selectAll("circle").filter(function (d) {
            return pathData.indexOf(d.topURI) > -1
        }).transition().duration(2000)
            .style("fill", "orange")
            .style("stroke", "orange")
            .attr("r", function (d) {
                var size = (parseInt(countries[d['topURI']]));
                if (isNaN(size)) return 5;
                return rscale(size);
            });

        d3.selectAll("circle").filter(function (d) {
            return (pathData.indexOf(d.topURI) <= -1 // is this line needed to be checked? for 949 to 1300 it seems it's needed!
            || Object.keys(countries).indexOf(d.topURI) <= -1 )
        }).transition().duration(2000)
            .attr("r", "0");

        var pDataArray = d3.selectAll("path").filter(function (d) {
            return pathData.indexOf(d.properties.sToponym) > -1
                && pathData.indexOf(d.properties.eToponym) > -1
        }).data();
        // var totalLength = d3.sum(pDataArray, function(d) {return d.properties.cost});
        // d3.select("#pathdata").html("<span style='font-weight: 900'>Total Distance:</span> " + formatter(totalLength) + "km");
    }
    //else {
    //    d3.select("#personSlider").html("NO ROUTE");
    //}
}

function displayPathArc(pathData, countries, uniquePaths, svg) {
    //routeLayer.visibility(false);
    //arcLayer.visibility(true);

    //map.showHideLayer(routeLayer);
    //map.showHideLayer(arcLayer);
    displayPath(pathData,countries,uniquePaths);
    //var rscale = d3.scale.linear()
    //    .domain(d3.extent(d3.values(countries)))
    //    .range([5, 30]);
    //
    //var colorScale = d3.scale.linear()
    //    .domain(d3.extent(d3.values(uniquePaths)))
    //    .range(["darkseagreen", "darkgreen"])
    //    .interpolate(d3.interpolateHcl);
    //
    ////Initial fill of all circles
    //d3.selectAll("circle").transition().duration(1000)
    //    .style("fill", "seagreen")
    //    .attr("r", 5);
}
// Updates the routes between a list of countries, using dijkstra algorithm
function updateRoutesCountries(countries, dijks_graph, svg) {
    var country = Object.keys(countries);
    var pathData = [];
    var uniquePaths = {};

    for (var x = 0; x < country.length; x++) {
        for (var y = x + 1; y < country.length; y++) {
            var pData = dijks_graph.findShortestPath(country[x], country[y]);
            if (pData) {
                for (var i = 0; i < pData.length; i++) {
                    for (var j = i + 1; j < pData.length; j++) {
                        // Check both i to j and j to i paths
                        // to prevent counting a path two times
                        if (uniquePaths[pData[i] + "," + pData[j]] == undefined) {
                            if (uniquePaths[pData[j] + "," + pData[i]] != undefined) {
                                // adds counter to one of the ij/ji paths
                                uniquePaths[pData[j] + "," + pData[i]]++;
                            } else {
                                uniquePaths[pData[j] + "," + pData[i]] = 1;
                            }
                        } else {
                            uniquePaths[pData[i] + "," + pData[j]]++;
                        }
                    }
                }
                // concats new path to the array of pathData
                pathData = pathData.concat(pData);
            }
        }
    }
    if (d3.select('input[name="pathvis"]:checked')[0][0].value == 0) {
        //routeLayer.visibility(true);
        //arcLayer.visibility(false);
        if (arcLayer.visibility())
            map.showHideLayer(arcLayer);
        if (!routeLayer.visibility())
            map.showHideLayer(routeLayer);
        //map.showHideLayer(routeLayer);
        //map.showHideLayer(arcLayer);
        displayPath(pathData, countries, uniquePaths);
    } else {
        if (!arcLayer.visibility())
            map.showHideLayer(arcLayer);
        if (routeLayer.visibility())
            map.showHideLayer(routeLayer);
        displayPathArc(pathData, countries, uniquePaths, svg);
    }
}

function updateRoutes(id) {
    var trav = 0;
    d3.selectAll("path").transition().duration(1000).style("stroke", function (d, i) {
        return "black"
    }).style("stroke-width", "2px");

    var country = peopleMap[id]['city'].split(',');
    for (var x = 0; x < country.length; x++) {
        for (var y = x + 1; y < country.length; y++) {
            var pData = dijks_graph.findShortestPath(country[x], country[y]);
            trav++;
            if (pData) {
                //console.log("pathdata: ", JSON.stringify(pData));
                displayPath(pData);
            }
        }
    }
}

// Building initial map structures
function dataStructsBetweenPeopleYears(data) {
    var min_year = 2000, max_year = 0;
    // A map from people to assigned year and name (now just toponyms)
    var peopleMap = {};
    // A map from year to people assigned to that year
    var yearPeople = {};
    data.forEach(function (d) {
        // Group the years to decades
        var diedAtDecade = d.diedAt - (d.diedAt % 10);
        // populating the map. if a person exists in map, concat new place to older ones
        if (peopleMap[d.id] != undefined) {
            peopleMap[d.id] = {
                'diedAt': diedAtDecade,
                'city': peopleMap[d.id]['city'] + ',' + d.city
            };
        }
        // if a new person is going to be added, a new object is created and added to map
        else {
            peopleMap[d.id] = {'diedAt': diedAtDecade, 'city': d.city};
        }
        // populating the map. if a person exists in map, concat new years to older ones
        if (yearPeople[diedAtDecade] != undefined) {
            yearPeople[diedAtDecade] = {'id': yearPeople[diedAtDecade]['id'] + ',' + d.id};
        }
        // if a new person is going to be added, a new object is created and added to map
        else {
            yearPeople[diedAtDecade] = {'id': d.id};
        }
        // Finding the min and max years
        var year = parseInt(diedAtDecade);
        if (year < min_year) min_year = year;
        if (year > max_year) max_year = year;
    });
    var output = {};
    output['min_year'] = min_year;
    output['max_year'] = max_year;
    output['peopleMap'] = peopleMap;
    output['yearPeople'] = yearPeople;
    return output;
}

function findCountries(csv, data, routeData) {
    var arr = [];
    var cityNames = [];


    var g = new Graph_msp();

    data.forEach(function (d) {
        csv.forEach(function (c) {
            if (c.topURI == d.city) {
                if (cityNames.indexOf(d.city) == -1) {
                    cityNames.push(d.city);
                    arr.push({"lat": c.lat, "lon": c.lon, "city": d.city});
                    g.addNode(d.city);
                }
            }
        });
    });
    var geoJson = {
        "features": [],
        "type": "FeatureCollection"
    };

    for (i = 0; i < arr.length; i++) {
        for (j = i; j < arr.length; j++) {
            if (i != j) {
                g.addEdge(arr[i].city, arr[j].city, distance(arr[i].lat, arr[i].lon
                    , arr[j].lat, arr[j].lon, "K"));
            }
        }
    }

    var result = Prim(g);
    console.log("res " +result);

    var i,j;
    for (i = 0; i < arr.length; i++) {
        for (j = i; j < arr.length; j++) {
            if (i != j) {
                var arcs =
                {
                    "type": "Feature",
                    "geometry": {
                        type: "LineString",
                        coordinates: [
                            [parseFloat(arr[i].lon), parseFloat(arr[i].lat)],
                            [parseFloat(arr[j].lon), parseFloat(arr[j].lat)]
                        ]
                    },
                    "properties": {
                        "sToponym": arr[i].city,
                        "eToponym": arr[j].city,
                        "Meter": distance(arr[i].lat, arr[i].lon
                            , arr[j].lat, arr[j].lon, "K")
                    }
                };
                var isInTree = false;
                result.forEach(function(r) {
                   if(r.src==arr[i].city && r.dst == arr[j].city) {
                       isInTree=true;
                   }
                });
                //if(Math.abs(result.indexOf(arr[i].city) -
                //            result.indexOf(arr[j].city)) < 2)
                if(isInTree)
                    geoJson.features.push(arcs);
            }
        }
    }

    //alert(JSON.stringify(msp));
    var blob = new Blob([JSON.stringify(geoJson)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "arcs.json");

    return geoJson;
}

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") {
        dist = dist * 1.609344
    }
    if (unit == "N") {
        dist = dist * 0.8684
    }
    return dist;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}