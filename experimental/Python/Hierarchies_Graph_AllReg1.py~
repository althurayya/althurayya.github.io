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
count = 0
def graphLevel(g, fileName, node_id, trav):
  global cnt
  global count
  
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
          count=count+1
          trav.append(lS[1])
          trav.append(''+ g.node[ident]['label'])
          a = ''
          with open(fileName+"_R", "a") as f2:          
            f2.write(','.join(trav))
            f2.write('\n')
          trav.pop()
          trav.pop()

def buildHierarchiesGraph(fileName):
    global cnt
    data = []
    roots = getSetOfName(fileName,"REG1")
    graphs = []        
    g = nx.DiGraph()
    g.add_node(1,label="root")

    for rs in roots:
      trav=[]
      #print(rs,cnt)
      g.add_edge(1,cnt, label = "child of root")
      g.add_node(cnt,label=rs) 
      trav.append(''+ g.node[cnt]['label'])
      #trav.append(lS[1])      
      cnt = cnt + 1
      graphLevel(g, fileName, cnt-1, trav)      	
      
      
    data = json_graph.tree_data(g,root=1)
    with io.open('tree'+g.node[1]['label']+'.json', 'w', encoding='utf-8') as f:
      f.write(unicode(json.dumps(data, ensure_ascii=False)))	

buildHierarchiesGraph("Shamela_0023696_Triples")
print(count)
