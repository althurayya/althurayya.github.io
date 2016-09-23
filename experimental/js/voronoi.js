function drawVoronoiCells(map, points) {
	var filteredPoints;

	var voronoi = d3.geom.voronoi()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });

	var draw = function() {
		var bounds = map.getBounds(),
			existing = d3.set(),
			drawLimit = bounds.pad(0.4);

		filteredPoints = points.filter(function(d) {
			var latlng = new L.LatLng(d.lat, d.lon);
			if (!drawLimit.contains(latlng)) { return false };

			var point = map.latLngToLayerPoint(latlng);

			key = point.toString();
			if (existing.has(key)) { return false };
			existing.add(key);

			d.x = point.x;
			d.y = point.y;
			return true;
		});

		var buildPathFromPoint = function(point) {
			return "M" + point.join("L") + "Z";
		}

		var cells = voronoi(filteredPoints); 
		var path = svg.append("g").selectAll("path"); 

		path.data(cells, buildPathFromPoint)
			.enter()
			.append("path")
			.attr("class", "point-cell")
			.attr("d", buildPathFromPoint)
			.call(d3.helper.tooltip(
				function(d, i){
					return createPopup(d.point);
			}));


	}

	d3.select("body").selectAll("path").remove(); 
	draw();

	// something here weird going on with draw. 
	function removePoint(d) {
		console.log(d); 
		console.log(points);
		points = points.filter(function(p) {
			return d.point.topURI != p.topURI; 
		})
		// draw(); 
	}
}


