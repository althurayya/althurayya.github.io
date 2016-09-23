"""
Initial function for searching STTLs of a tagged text in Cornu, by checking the STTL names with 'arTitle'. 
The result is a dictionary of STTL names found in cornu to lat and long values.
This function is expanded in  extract_coordWithHierarchy.py and extract_coordWithHierarchy_Normalized.py scripts.
"""
import csv
import sys 
import json
import io
import re
import collections


#reload(sys)  
#sys.setdefaultencoding('utf8')


point = {}
tmp = {}
with open('../Data/Shamela_0023696_Triples_H', 'r') as csvfile:
  reader = csv.reader(csvfile, delimiter=',', quotechar='|')
  with open ('cornu_all_new2.js') as cornu:
    data = json.load(cornu)
    for row in reader:
        sttl = row[-1][4:].strip()
        parent = row[-3][4:].strip()
        if(parent not in point):
          point[parent] = []
        for d in data["data"]:
          if d["arTitle"] == sttl:
            tmp={}
            tmp['arTitle'] = d['arTitle']
            tmp['lat'] = d['lat']
            tmp['lon'] = d['lon']
            point[parent].append(tmp)
#convert(point)
#convert_keys_to_string(point)
print(point.keys())
with io.open('../Data/commonWithCornu.json', 'w', encoding='utf-8') as f:
  f.write(json.dumps(point, indent=4,ensure_ascii=False))

