/*----------------------------------------
 * BASIC MAP SETUP 
 *----------------------------------------*/ 
$j = jQuery; 

var startZoom = 5; 

L.mapbox.accessToken = 'pk.eyJ1IjoiY2phY2tzMDQiLCJhIjoiVFNPTXNrOCJ9.k6TnctaSxIcFQJWZFg0CBA';
var baseLayer = L.mapbox.tileLayer('cjacks04.jij42jel', { 
		attribution: 'Tiles and Data &copy; 2013 <a href="http://www.awmc.unc.edu" target="_blank">AWMC</a> ' +
				     '<a href="http://creativecommons.org/licenses/by-nc/3.0/deed.en_US" target="_blank">CC-BY-NC 3.0</a>' });
var map = new L.Map('map', {
	            center: new L.LatLng( 28, 41 ),
				zoom: startZoom,
				layers: [baseLayer],
				minZoom: 3,
				zoomControl: true,
				maxZoom: 11
});

var markers = []; 
/*----------------------------------------
 * ROUTES AND SITES LAYERS
 *----------------------------------------*/ 
var routeLayer = L.featureGroup(); 
var routeStyle = {
    "color": "red",
    "weight": 1.5,
    "opacity": 1, 
    "smoothFactor" : 2
};
routeLayer.addLayer(L.geoJson(allRoutes, { 
								style: routeStyle})).addTo(map);

/*
	HEATMAP
*/
var cfg = L.TileLayer.heatMap({
				radius: 12,
				opacity: 0.8,
				gradient: {
					0.45: "rgb(0,0,255)",
					0.55: "rgb(0,255,255)",
					0.65: "rgb(0,255,0)",
					0.95: "yellow",
					1.0: "rgb(255,0,0)"
				}
			});
//heatmapLayer.addData( places.data )
/*-----------------------------------------
 * FREQUENCY LIST/DICTIONARY FOR TOPTYPES
 *-----------------------------------------*/

var sites = {}; 

$j.each( places.data, function(_id, _site) {
	if (sites[_site.topType] == undefined) {
		sites[_site.topType] = [];
		sites[_site.topType].push(_site); 
	} else {
		sites[_site.topType].push(_site); 
	}
}); 

/*-----------------------------------------------------
 * DIFFERENTIATE BETWEEN TOPTYPES
 * layerStyles: handles the formatting of the different
 * 	            circleMarkers. 
 * sitesLayer : currently, all sites are added to the siteLayer
 * 	 			but any layer can be passed in. 
 * addLayerForTopType( topTypes // some set of types, accessed
 *							       using sites[TOPTYPE]
 *					   layer // layer to add to map
 *					   styles // styling for circle marker)
 *					   noHide // true if label should always
 *								be present on the map
 *				  	   labelClass // styling for the label 
 
 *-----------------------------------------------------*/ 

var layerStyles = {
	"villages" : { color: '#6F9690', fillColor: '#6F9690', radius: 4, opacity: 0, fillOpacity: 1 }, 
	"towns" : {color: '#6F9690', fillColor: '#6F9690', radius: 4, opacity: 0, fillOpacity: 1}, 
	"capitals" : { color: '#6F9690', fillColor: '#6F9690', radius: 10, opacity: 0, fillOpacity: 1 }, 
	"metropoles" : { color: '#6F9690', fillColor: '#6F9690', radius: 15, opacity: 0, fillOpacity: 1 },
	"waystations" : { color: '#6F9690', fillColor: '#6F9690', radius: 2, opacity: 0, fillOpacity: 1 }, 
	"noCircle" : { color: '#fff', fillColor: '#fff', radius: 0, opacity: 0, fillOpacity: 0},
	"allDefault" : { color: '#96190E', fillColor: '#fff', radius: 2, opacity: 1, fillOpacity: 1 },
	"allDefaultMatch" : { color: '#96190E', fillColor: '#fff', radius: 5, opacity: 1, fillOpacity: 1 },
}

var allSites = L.featureGroup(); 

$j.each( places.data, function( _idx, _place ) {
	markers[ _idx ] = L.circleMarker( [ _place.lat, _place.lon ], layerStyles["allDefault"])
		               .bindPopup(createPopup(_place, this)) 
					   .on('click', function() {
					   		this.openPopup(); 
					   })
					   .on('mouseleave', function() {
					   		this.closePopup(); 
					   })
	addMarker( _idx, markers, allSites);
});

allSites.addTo(map);

/*-------------------------------------------------
 * THURAYYA LOOKUP 
 *------------------------------------------------*/ 

function createPopup(place, marker) {
	var container = $j('<div />'); 
	container.on("click", function(e) {
		generateContent(place)
		$j("#index-lookup-content").show(); 
		// marker.closePopup(); undefined for now ... 
	}); 
	container.append('<center><div class="arabic-popup">' + place.arTitle + '</div><div class="english-popup">' + place.translitTitle + '</div><div id="index-lookup" class="basic"><i>Check in:</i><br><a href="#">Arabic Sources</a><br><a href="http://referenceworks.brillonline.com/search?s.q='+place.eiSearch+'&s.f.s2_parent=s.f.cluster.Encyclopaedia+of+Islam&search-go=Search" target="_blank">Encylopaedia of Islam</a><br><a href="http://pleiades.stoa.org/search?SearchableText='+place.translitSimpleTitle+'" target="_blank">Pleiades</a><br><a href="https://en.wikipedia.org/wiki/Special:Search/'+place.translitSimpleTitle+'" target="_blank">Wikipedia</a><br><i>Coordinates (Lat,Lon):*</i><br>'+ place.lat +', '+  place.lon  +'</div></center>');
	return container[0]; 
}

/* POPUP NAVIGATION LOGIC */ 
$j("#close-index").click(function(e){
	$j("#index-lookup-content").hide();
});
$j("#close-match").click(function(e) {
	$j("#index-lookup-match").hide(); 
});


function generateContent(place) {
	var id = place.arBW;
	var lookup = matchIndex[id];
	/* remove content already in div*/
	$j("#exact").empty(); 
	$j("#fuzzy").empty(); 
	$j("#match").empty();
	/* hack to turn string array into array of strings */ 
	var exact_matches = lookup.exact.join().split(","); 
	var fuzzy_matches = lookup.fuzzy.join().split(","); 
	/* found vs not found */ 
	$j.each(exact_matches, function(_id, exact) {
		var has_exact_matches = gazetteers[exact] != undefined;
		if (has_exact_matches) {
			var link = $j('<a/>', {
				href  : '#' + exact,  
				class : 'arabic-link', 
				html : "<li class=match-list>" + gazetteers[exact].title + " (" + gazetteers[exact].source + ")</li>",
				click : function() { 
					$j("#index-lookup-match").show();  
					var id = $j(this).attr('href'); 
					$j(".match-display-reference").hide(); 
					$j(id).show();
				}
			}).appendTo("#exact"); 
			var content = $j('<div/>', {
				id : exact, 
				/*  CHANGE CLASS FOR REFERENCE HERE! */
				html : "<div class='english'>" + gazetteers[exact].reference + "</div>" + gazetteers[exact].text, 
				class : 'match-display-reference'
			}).appendTo("#match"); 
		} else {
			$j("#exact").append("لم يُعثر على أية نتائج");
		}
	}); 
	$j.each(fuzzy_matches, function(_id, fuzzy) {
		var has_fuzzy_matches = gazetteers[fuzzy] != undefined;  
		if (has_fuzzy_matches) {
			var link = $j('<a/>', {
				href  : '#' + fuzzy,  
				class : 'arabic-link', 
				html : "<li class=match-list>" + gazetteers[fuzzy].title + " (" + gazetteers[fuzzy].source + ")</li>",
				click : function() { 
					displayMatch(); 
					var id = $j(this).attr('href'); 
					$j(".match-display").hide(); 
					$j(id).show();
				}
			}).appendTo("#fuzzy"); 
			var content = $j('<div/>', {
				id : fuzzy, 
				html : gazetteers[fuzzy].reference + gazetteers[fuzzy].text, 
				class : 'match-display-reference'
			}).appendTo("#match"); 
		} else {
			$j("#fuzzy").append("...");
		}

	}); 

}



/*--------------------------------------------------------
 * SEARCH 
 *-------------------------------------------------------*/
function addMarker( _idx, _markers, _layer ) {
	_layer.addLayer( _markers[_idx] );
	return _markers[ _idx ]
}

$j( '#search input' ).on( 'keyup', function() {
	var matches = filterPlaces( $j( this ).val(), places.data, ['translitTitle','translitSimpleTitle','arTitle','topURI','topType'] );
	allSites.clearLayers();
	for ( var i=0, ii=matches.length; i<ii; i++ ) {
		addMarker( matches[i], markers, allSites );
	}
});

function filterPlaces( _needle, _obj, _keys ) {
	var matches = [];
	var needle = _needle.toUpperCase();
	for ( var i=0, ii=_obj.length; i<ii; i++ ) {
		for ( var j=0, jj=_keys.length; j<jj; j++ ) {
			var stack = _obj[i][_keys[j]].toUpperCase();
			if ( stack.indexOf( needle ) != -1 ) {
				matches.push( i );
			}
		}
	}
	return matches;
}



/*------------------------------------------------------
 * BASEMAP 
 *-----------------------------------------------------*/
var baseMaps = {
			"AWMC": baseLayer,
			};
			var overlayMaps = {
				"Routes": routeLayer,
				"Sites" : allSites,
			};

L.control.layers( baseMaps, overlayMaps ).addTo( map );




