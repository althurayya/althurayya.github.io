"""
To find common sttl names with Cornu, using fuzzywuzzy library.
Can be replced with extract_coordWithHierarchy_Normalized.py
"""
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
import io
import csv, json
import sys, re

reload(sys)  
sys.setdefaultencoding('utf8')


sttls =[]
with open('../Data/Shamela_0023696_Triples_H', 'r') as csvfile:
  reader = csv.reader(csvfile, delimiter=',', quotechar='|')
  for row in reader:
      sttl = row[-1][4:].strip()
      with open('../Data/cornu_all_new2.json') as cornu:    
        data = json.load(cornu)
        tmp = sttl
        for d in data["data"]:
          if fuzz.ratio(d['arTitle'],sttl) >= 90:
            tmp = "-".join((tmp, d['arTitle']))
          else:
            for s in d['arTitleOther'].split(", "):#.split(' '+ u'xd8'):
              if fuzz.ratio(s,sttl) >= 90:
                tmp = "-".join((tmp, s))
      if tmp != sttl:
        sttls.append(tmp) 

with io.open('../Data/fuzzyWuzzyWithCornu_OtherTitle-90.txt', 'w', encoding='utf-8') as f:
  f.write(unicode("\n".join(sttls))) 
print("done!") 
