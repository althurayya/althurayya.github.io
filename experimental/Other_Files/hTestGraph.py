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
def graphLevel(g,fileName, node_id,trav):
  global cnt
  
  with open(fileName, "r") as f1:
    f1 = f1.read().split("\n")
    for l in f1:
      lS = l.split("\t")
      if lS[0].startswith(g.node[node_id]['label']):
        ident=cnt
        g.add_node(ident,label=lS[-1])
        g.add_edge(node_id,ident, label = lS[1])
        cnt=cnt+1
        if 'STTL' not in g.node[ident]['label']:
          trav.append(lS[1])
          trav.append(''+ g.node[ident]['label']+',')
          #with open(fileName+"_H", "w") as f2:
           # f2.write(''.join(a))
          with open(fileName+"_H", "w") as f2:
            f2.write("\n".join(trav))
          graphLevel(g,fileName,ident,trav)
          
          trav.pop()
          trav.pop()
        else:
          trav.append(lS[1])
          trav.append(''+ g.node[ident]['label']+',')
          a = ''
          with open(fileName+"_H", "w") as f2:          
            #for num in trav:
             # if type(num) is int:
              #  a=a+ g.node[num]['label']+','
            f2.write("\n".join(trav))
          trav.pop()
          trav.pop()
def buildHierarchiesGraph(fileName):
    data = []
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
      graphLevel(g,fileName,1,trav)
      label = {}
      nx.write_dot(g,"graph" + g.node[1]['label']+".dot")
buildHierarchiesGraph("Shamela_0023696_Triples")
