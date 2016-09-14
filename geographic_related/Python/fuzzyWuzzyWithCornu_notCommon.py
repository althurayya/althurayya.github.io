"""
Finds the toponyms not included in Cornu, using fuzzywuzzy and changing the similarity ration less than a specific value (like 90!)
Might not be used, since notCommon_checkAgainstCommons.py has used!
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
        for d in data["data"]:
          # if not included in arTitle
          if fuzz.ratio(d['arTitle'],sttl) < 90:
            # and if not also included in arTitleOther
            for s in d['arTitleOther'].split(", "):#.split(' '+ u'xd8'):
              if fuzz.ratio(s,sttl) < 90:
                sttls.append(sttl) 

with io.open('../Data/fuzzyWuzzyWithCornu_notCommon.txt', 'w', encoding='utf-8') as f:
  f.write(unicode("\n".join(sttls))) 
print("done!") 
