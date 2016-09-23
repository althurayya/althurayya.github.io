from networkx.readwrite import json_graph
import io, json
import re
import networkx as nx
import matplotlib.pyplot as plt	
import sys  
from sets import Set

reload(sys)  
sys.setdefaultencoding('utf8')

res = Set()
res2 = Set()
with open("Shamela_0023696_Triples_STTL", "r") as f1:
  f1 = f1.read().split("\n")
  for l in f1:
    res.add(l[l.find("STTL"):])

with open("Shamela_0023696_Triples_H", "r") as f1:
  f1 = f1.read().split("\n")
  for l in f1:
    res2.add(l[l.find("STTL"):])

print(len(res))
print(len(res2))
print(len(res-res2))
with open("test", "a") as f2:          
  f2.write(','.join(res-res2))
  
