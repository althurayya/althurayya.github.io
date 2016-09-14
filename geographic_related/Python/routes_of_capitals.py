"""
To biuld the routes (of geo text) starting and ending with capitals of a geogrpahic text (like Muqaddasi!)
Here we select the capitals, as specified in geographical text, and go through the route sections (of geo texts) to form routes startting from a capital and ending with other. To do this we make a graph by networkx python API. The graphs shortest path between each two capital is the result that we expect. There might be no shortest path between some capitals. For such cases we mention "No path" in the output file.
The output file can be used in manual searching and mapping the toponyms from geo text in Cornu.
This script should be generalized to check all vacabularies used in geo texts for ccapitals. here we just check "قصبة" that means capital in Al-Muqaddasi.
"""

import io, json
import re
import sys, codecs
import csv
import networkx as nx


# makes a list of capitals 
def getcapitals(fileName):
    capitals = list()
    with open(fileName, "r", encoding="utf8") as hierFile:
        hierFile = csv.reader(hierFile, delimiter=',')
        for hier in hierFile:
          if hier[-2][4:].strip() == "قصبة":
            capitals.append(hier[-1][4:].strip())
    print("count: ", len(capitals))
    return capitals


def createGraph(fileName):
   """
   Creat routes graph to be used in 
   """
   G = nx.read_edgelist(fileName, delimiter=",", data=[("Distance_Meter", float)], encoding="utf8")
   G.edges(data=True)
   edge_labels = dict( ((u, v), d["Distance_Meter"]) for u, v, d in G.edges(data=True) )
   return G

def findRoutes(routeFile, hierFile):
    """
    Find the routes 
    """"
    capitals = getcapitals(hierFile)
    print(capitals)
    G = createGraph(routeFile)
    paths = []
      #fWriter.writerow(["geoTitle", "cornuTitle", "cornuTitleOther", "lat", "lon", "cornuRegion", "geoProv", "geoFinalReg", "eiSearch", "translitTitle", "FW_ratio"])
    for capi in capitals:
      tmpArray = capitals[capitals.index(capi)+1:]
      for nxtCapi in tmpArray:
        if capi in G.nodes() and nxtCapi in G.nodes():
          try:
            for path in nx.all_shortest_paths(G,capi, nxtCapi):
            #print n
              paths.append(path)
          except nx.NetworkXNoPath:
            #print ('No path from ', capi, ' to ', nxtCapi)
            paths.append([capi, 'no Path', nxtCapi])
#          for path in nx.all_shortest_paths(G, source=capi, target=nxtCapi):  
      #tmp = nx.all_simple_paths(G, source=capitals[0], target=capitals[1]):
      #print(paths)
            
    with open("../Data/routes_of_capitals", 'w', encoding="utf8") as capiRoutes:
      fWriter = csv.writer(capiRoutes, delimiter=',', quoting=csv.QUOTE_MINIMAL)
      for path in paths:
        fWriter.writerow(path)

findRoutes("../Data/tripleRoutes_withMeter", "../Data/Shamela_0023696_Triples_H")
print("done!")
