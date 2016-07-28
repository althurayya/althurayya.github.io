$j = jQuery; 

function loadMatches()  {
	console.log("loading matches...");
	$j()
	$j("#context").load("./index.html #context-matches"); 
}
