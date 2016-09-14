from networkx.readwrite import json_graph
import io, json, csv
import re
import networkx as nx
import matplotlib.pyplot as plt	
import sys  
import math
from decimal import *
from geopy.distance import vincenty
from pyproj import *
from shapely.geometry import *

def createGraph(fileName):
   G = nx.Graph()
   getcontext().prec = 4
   with open(fileName, 'r') as meterFile:
      distReader = csv.reader(meterFile, delimiter=',')
      next(distReader, None)
      for row in distReader:
        G.add_node(row[0], lat=row[1], lng=row[2])
        G.add_node(row[3], lat=row[4], lng=row[5])
        G.add_edge(row[0],row[3], length= row[-1])
   neighbors = dict()
   # Write the graph nodes to csv file before finding null coordinates
   with open("../Data/newCoords_graph_before.csv", "w", encoding="utf8") as distMeter:
     fWriter = csv.writer(distMeter, delimiter=',',)
     fWriter.writerow(["name", "lat", "lng"])
     for node in G.nodes():
       fWriter.writerow([node, G.node[node]['lat'], G.node[node]['lng']])
   # find nodes without coordinate and more than one neighbors
   null_coord_nodes = []
   # holing the number of nodes with null coordinate and more than one neighbor
   found = len([n for n in G.nodes() if G.node[n]['lat'] == "null" and G.node[n]['lng'] == "null" and len(G.neighbors(n)) > 1])

   proj1 = Proj(init='epsg:26915')
   # check neighbors of nodes without coordinate, whether they have coordinate or not
   with open("../Data/newCoords_cartesian2.csv", "w", encoding="utf8") as distMeter:
     fWriter = csv.writer(distMeter, delimiter=',',)
     fWriter.writerow(["lat", "lng", "name"])
     prev_found = 0

     while (found != prev_found ):
       prev_found = found
       print(prev_found ,found)
       for node in G.nodes():
         if G.node[node]['lat'] == "null" and G.node[node]['lng'] == "null" and len(G.neighbors(node)) > 1: 

           neighbors[node] = []
           for n in G.neighbors(node):
             if G.node[n]['lat'] != "null" and G.node[n]['lng'] != "null": 
               neighbors[node].append(n) 
           # TODO: check nodes with one neighbour 
           # if a point has more than two neighbours in the network 
           neiLen = len(neighbors[node])
           if neiLen >= 2:
             x1,y1 = proj1(G.node[neighbors[node][0]]['lat'],G.node[neighbors[node][0]]['lng'])
             x2,y2 = proj1(G.node[neighbors[node][1]]['lat'],G.node[neighbors[node][1]]['lng'])
             #print("x,y : ", x1, "  " , y1, "x2,y2 : ", x2, "  " , y2)
             # r1 and r2, distances between node and the first two neighbours
             r1 = G[node][neighbors[node][0]]['length']
             r2 = G[node][neighbors[node][1]]['length']
             #print(Point(x1, y1).buffer(r1))
             circle1 = Point(x1, y1).buffer(Decimal(r1)).boundary
             circle2 = Point(x2, y2).buffer(Decimal(r2)).boundary
             #fWriter.writerow(["{0:4f}".format(newX), "{0:4f}".format(newY), "new"])
             #if not circle1.intersects(circle2):
             #  fWriter.writerow(["null","null",node, "new"])
             #for nei in neighbors[node]:
             #print("nei: ",nei)
             #  fWriter.writerow([G.node[nei]['lat'],G.node[nei]['lng'], nei, "old"])
             if circle1.intersects(circle2):
               newLat1,newLon1 = proj1(circle1.intersection(circle2).geoms[0].coords[0][0],circle1.intersection(circle2).geoms[0].coords[0][1],inverse=True)
               newLat2,newLon2 = proj1(circle1.intersection(circle2).geoms[1].coords[0][0],circle1.intersection(circle2).geoms[1].coords[0][1],inverse=True)
             #getcontext().prec = 4
               fWriter.writerow([float("{0:0.5f}".format(newLat1)),float("{0:0.5f}".format(newLon1)),node])
               fWriter.writerow([float("{0:0.5f}".format(newLat2)),float("{0:0.5f}".format(newLon2)),node])
               G.node[node]['lat'] = newLat1
               G.node[node]['lng'] = newLon1
               found = found - 1

         
   with open("../Data/newCoords_graph.csv", "w", encoding="utf8") as distMeter:
     fWriter = csv.writer(distMeter, delimiter=',',)
     fWriter.writerow(["name", "lat", "lng"])
     for node in G.nodes():
       fWriter.writerow([node, G.node[node]['lat'], G.node[node]['lng']])
	
createGraph("../Data/tripleRoutes_withMeter2")

