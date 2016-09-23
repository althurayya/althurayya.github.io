/**
 * Created by rostam on 16.05.16.
 */
function gen_voronoi_layer(voronoiLayer, exclude) {
    alert("hi")
    voronoiLayer = map.createVoronoiLayer(cityLayer, 0.5, exclude);
    voronoiLayer
        .label("Voronoi")
        .cssClass("voronoi")
        .on("load", function () {
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
        });
    map.addCartoLayer(voronoiLayer);
    return voronoiLayer;
}