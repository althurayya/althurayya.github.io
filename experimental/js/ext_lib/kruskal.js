var Kruskal;

var MakeSet  = require("union-find");

(function() {
  "use strict";

  // vertices hold data that will be used in the distance 'metric' function
  // edges holds position in vertices list
  //
  Kruskal = {
    kruskal: function( vertices, edges, metric )
    {
      var set = {};

      var finalEdge = [];

      var forest = new MakeSet( vertices.length );

      var edgeDist = [];
      for (var ind in edges)
      {
        var u = edges[ind][0];
        var v = edges[ind][1];
        var e = { edge: edges[ind], weight: metric( vertices[u], vertices[v] ) };
        edgeDist.push(e);
      }

      edgeDist.sort( function(a, b) { return a.weight- b.weight; } );

      for (var i=0; i<edgeDist.length; i++)
      {
        var u = edgeDist[i].edge[0];
        var v = edgeDist[i].edge[1];

        if ( forest.find(u) != forest.find(v) )
        {
          finalEdge.push( [ u, v ] );
          forest.link( u, v );
        }
      }

      return finalEdge;

    }
  }

  if (typeof module !== 'undefined')
    module.exports = Kruskal;

})();



