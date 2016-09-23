/**
 * Created by rostam on 16.05.16.
 */
function setup_city_list(voronoiLayer) {
    d3.csv("../Data/cornuFiltered.csv", function (csv) {
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
        // alphabetically sort the names (based on eiSearch)
        filteredData.sort(function (a, b) {
            var nameA = a.arTitle.toUpperCase(); // ignore upper and lowercase
            var nameB = b.arTitle.toUpperCase(); // ignore upper and lowercase
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
            var distances = shortestPath(s, s, 'n');
            var network = getNetwork(distances, 5); //multiplier
            var sitesByZone = network.values();
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
        })
            .selectAll("option").data(filteredData).enter()
            .append("option")
            .attr("value", function (d) {
                return d.topURI;
            })
            .text(function (d) {
                return d.eiSearch;
            });
    })
}