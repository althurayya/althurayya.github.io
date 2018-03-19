
function init_graph(routes) {
  var Graph = require('data-structures').Graph;
  graph = new Graph();
  var e, s, edge;

  for (var i = 0; i < routes.length; i++) {
    e = routes[i].properties.eToponym;
    s = routes[i].properties.sToponym;
    graph.addNode(e);
    graph.getNode(e)._id = e;

    graph.addNode(s);
    graph.getNode(s)._id = s;

    graph.addEdge(e, s);
    edge = graph.getEdge(e, s);
    edge._eid = e;
    edge._sid = s;

    edge._id = routes[i].properties.id;
    edge.weight = routes[i].properties.Meter;
  }
  resetNodes(graph);

}

/* consider doing the routepoint thing in the definition of the graph. 
 so if you run across a routepoint, all edges connecting to it equal 
 weight of routepoint + current edge. maybe that will work? */ 


function resetNodes(G) {
  graph.forEachNode( function(node) {
    node.visited = false; 
  })
}

/* DIJSKSTRA IMPLEMENTATION ADAPTED FROM: https://github.com/mburst/dijkstras-algorithm */

function PriorityQueue () {
  this._nodes = [];

  this.enqueue = function (priority, key) {
    this._nodes.push({key: key, priority: priority });
    this.sort();
  }
  this.dequeue = function () {
    return this._nodes.shift().key;
  }
  this.sort = function () {
    this._nodes.sort(function (a, b) {
      return a.priority - b.priority;
    });
  }
  this.isEmpty = function () {
    return !this._nodes.length;
  }
}

function findPaths(s, t, withinADay) {
  var shortest = shortestPath(s, t, withinADay);
  /* second: get rid of longest edge weight */ 
  var max = longestEdge(shortest); 
  max.weight = INFINITY; 
  //var secondShortest = shortestPath(s, t); 
  /* get rid of all edge weights over x weight*/
  return shortest; 
}

function secondShortest(s, t, path) {
  var max = longestEdge(path); 
  max.weight = 1/0; 
  var second = shortestPath(s, t, false); // not within a day.
  return second;
}

function longestEdge(path) {
  var max = 0; 
  var edge; 
  for(var i = 0; i < path.length - 1; i++) {
    edge = graph.getEdge(path[i], path[i+1]); 
    if (edge && edge.weight > max) {
      max = edge; 
    }
  }
  return max; 
}


/* THOUGHT for through center. What if instead of through 'centers' I say through 'X?' 
 * As in, I want to go TO fustat and pass through makka. What's the fastest way to do so? 
 * That's pretty easy to implement. Would it be worthwhile? 
 * And if I want to do "major centers", I could have to have a list of the major centers, 
 * then ask if it's a preference or a guarantee. Find the closest major center to the existing
 * shortest path, then do pass through "X" on that center. 
 */ 

//var distances = {}; // eek global 

function shortestPath(s, t, searchType) {
  var INFINITY = 1/0;
  var nodes = new PriorityQueue(),
          distances = {},
          previous = {},
          path = [],
          smallest, neighbor, alt;
  // init start to 0, all else to infinity  
  graph.forEachNode( function (node) {
    if (node._id == s._id) {
      distances[node._id] = 0
      nodes.enqueue(0, node._id);
    } else {
      distances[node._id] = INFINITY; 
     // nodes.enqueue(INFINITY, node._id);
    } 
    previous[node._id] = null; 
  });

  while(!nodes.isEmpty()) {
    smallest = nodes.dequeue();
    /* create return path */ 
    if (searchType != 'n') {
      if(smallest == t._id) {
        path;
        while(previous[smallest]) {
          path.push(smallest);     
          smallest = previous[smallest];
        }
        break;
      }
    }

    var edges = graph.getAllEdgesOf(smallest);
    for(var i = 0; i < edges.length; i++) {
      neighbor = edges[i];
      if (searchType == 'd' && neighbor.weight > WITHIN_A_DAY) {
        continue;  // within a day is tagged and the neighbor's weight is greater than a Day. 
      } else {
          alt = distances[smallest] + neighbor.weight; 
          if (neighbor._sid == smallest) {
            if (alt < distances[neighbor._eid]) {
              distances[neighbor._eid] = alt;
              previous[neighbor._eid] = smallest;
              nodes.enqueue(alt, neighbor._eid);
            }
          } else {
            if (alt < distances[neighbor._sid]) {
              distances[neighbor._sid] = alt;
              previous[neighbor._sid] = smallest;
              nodes.enqueue(alt, neighbor._sid)
            }
          } 
      }
    }
  }
  return searchType == 'n' ? distances : path.concat(s._id).reverse(); 
} 


function getNetwork(distances, multiplier) {
  var network = d3.map(); //d3.map()? 
  var zones = d3.map(); 

  //init 
  for (var i = 1; i < NUM_ZONES; i++) {
    zones.set(DAY * multiplier * i, 'Zone ' + i);
  }
  zones.set(Infinity, 'Zone ' + NUM_ZONES); 

  //init
  zones.values().forEach(function(z) {
    network.set(z, new Array());
  }); 

  jQuery.each(distances, function(id, meters) {
    zone = placeDistanceInZone(meters, zones); 
    network.get(zone).push(id); 
  })

  return network; 
}

// set adds in numerical order. then we get the index 
// of the added meter to determine which zone it belongs to. (i - 1)
function placeDistanceInZone(meters, zones) {
  var values = zones.keys().map(function(z) { return parseInt(z)}); // turn into ints
  values.pop() // Infinity doesn't parse to int. 
  if (meters == Infinity) {
    return 'Zone ' + NUM_ZONES;
  } else {
    values.push(meters);
    values.sort(function(a, b) {
      return a - b; 
    });

    var index = values.indexOf(meters); 
    index = (index == values.length - 1) ? index - 1 : (index + 1);   
    return zones.get(values[index]);
  }
}

function lengthInMeters(path) {
  var m = 0;
  path.forEach(function(p) {
    m += p.properties.Meter;
  })
  return m;
}
