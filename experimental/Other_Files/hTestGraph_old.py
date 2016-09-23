import re
import networkx as nx
import matplotlib.pyplot as plt	
import sys  
import codecs

reload(sys)  
sys.setdefaultencoding('utf8')

def getSetOfName(fileName,name):
    roots = set()
    with codecs.open(fileName, "r","utf-8") as f1:
        f1 = f1.read().split("\n")
        for l in f1:
          lS = l.split("\t")
          if lS[0].startswith(name):
            roots.add(lS[0])
    return roots

cnt=2
def graphLevel(g,fileName, node_id):
  global cnt
  with codecs.open(fileName, "r","utf-8") as f1:
    f1 = f1.read().split("\n")
    for l in f1:
      lS = l.split("\t")
      if lS[0].startswith(g.node[node_id]['label']):
        ident=cnt
        g.add_node(ident,label=lS[-1])
        g.add_edge(node_id,ident, label = lS[1])
        cnt=cnt+1
        if 'STTL' not in g.node[ident]['label']:
          graphLevel(g,fileName,ident)
  
def buildHierarchiesGraph(fileName):
    data = []
    roots = getSetOfName(fileName,"PROV")

    graphs = []        
    for rs in roots:
      g = nx.DiGraph()
      g.add_node(1,label=rs) 
      graphs.append(g)

    for g in graphs:
      graphLevel(g,fileName,1)
      label = {}
      nx.write_dot(g,"graph" + g.node[1]['label']+".dot")
buildHierarchiesGraph("Shamela_0023696_Triples")
