
var estimateDay = function(base, comparison) {

var proportion = new Array(); 

comparison.forEach(function(route) {
	proportion.push(matchingRoute(route.toID, route.fromID, route.distance));
	proportion.push(matchingRoute(route.fromID, route.toID, route.distance)); 
})

function matchingRoute(toID, fromID, distance) {
	var end = base[toID]; 
	if ((end != undefined) && (end[0].properties.sToponym == fromID)) {
		return ( end[0].properties.Meter / distance ); 
	} else {
		return 0; 
	} 
 
}

proportion = proportion.filter(function(el, index, array) { return el != 0; })
var length = proportion.length; 
var sum = proportion.reduce(function(previousValue, currentValue, index, array) {
	return previousValue + currentValue; 
}); 
return sum / length;  // average

}

var day = estimateDay(routesByEID, muq_all); 
