"""
This script uses the csv file of the hierarchical triples to creat a hierarchies from the top most levels (here PROV) to settlements.
Output file contains hierarchies, expressing a level from the highest division to a settelment in each line.
It creates different json file for each country (PROV).
"""
from networkx.readwrite import json_graph
import io, json
import re
import networkx as nx
import matplotlib.pyplot as plt	
import sys  


reload(sys)  
sys.setdefaultencoding('utf8')

def getSetOfName(fileName,name):
    roots = set()
    with open(fileName, "r") as f1:
        f1 = f1.read().split("\n")
        for l in f1:
          lS = l.split("\t")
          if lS[0].startswith(name):
            roots.add(lS[0])
    return roots

cnt = 2

def graphLevel(g, fileName, node_id, trav):
  """
  Traverses the grah recursively to find the individual paths from root to leaves.
  The out put is hierarchies from PROV to STTL, which is written to a file.
  """
  global cnt
  
  with open(fileName, "r") as f1:
    f1 = f1.read().split("\n")
    for l in f1:
      lS = l.split("\t")
      if lS[0].startswith(g.node[node_id]['label']):
        ident = cnt
        g.add_node(ident,label=lS[-1])
        g.add_edge(node_id,ident, label = lS[1])
        cnt = cnt + 1
        if 'STTL' not in g.node[ident]['label']:
          trav.append(lS[1])
          trav.append(''+ g.node[ident]['label'])
          graphLevel(g,fileName,ident,trav)
          trav.pop()
          trav.pop()
        else:
          trav.append(lS[1])
          trav.append(''+ g.node[ident]['label'])
          a = ''
          with open(fileName+"_H", "a") as f2:          
            f2.write(','.join(trav))
            f2.write('\n')
          trav.pop()
          trav.pop()

def buildHierarchiesGraph(fileName):
    """
    The main function which creats a graph for each country, 
    and then traverses the graphs for making a csv out of the graph information
    """
    data = []
    #Roots of each graph is the first division, here called "PROV"
    roots = getSetOfName(fileName,"PROV")
    
    graphs = []        
    for rs in roots:
      g = nx.DiGraph()
      g.add_node(1,label=rs) 
      graphs.append(g)
 
    for g in graphs:
      trav = list()
      trav.append(''+ g.node[1]['label']+',')
      cnt = 2
      # to travese the grah and form individual paths rom the top most divisions to settlements
      graphLevel(g,fileName,1,trav)
      # Creates the JSON representation of the graph
      data = json_graph.tree_data(g,root=1)
      with io.open('../Data/tree'+g.node[1]['label']+'.json', 'w', encoding='utf-8') as f:
        f.write(unicode(json.dumps(data, ensure_ascii=False)))
#      label = {}
#      nx.write_dot(g,"graph" + g.node[1]['label']+".dot")
buildHierarchiesGraph("Shamela_0023696_Triples")



