"""
Removes waystations and RoutPoints (or any other type that is mentioned) from Cornu file.
It's been used in Geo-Bio (project) in: http://bl.ocks.org/masoumeh/4b6a27fd50ffdd81c34fb3c59963a401
"""

import io, json, csv
import re
import sys  

def delRows(fileName, rowList):
  rows = []
  data_dict= csv.DictReader(open(fileName))
  #next(reader, None)  # skip the headers
  for row in data_dict:
    if row['topType'] not in rowList:
      rows.append(row)
    with io.open('../Data/cornuFiltered.csv', 'w', encoding='utf-8') as f:
      fWriter = csv.writer(f, delimiter=',')
      fWriter.writerow(["arBW","source","arTitle","lat", "eiSearch","lon","region", "translitTitleOther","topURI","searchNames", "topTypeAlt", "topType", "translitTitle", "arTitleOther", "UStranslitTitle"])   

      for r in rows:
        fWriter.writerow([r["arBW"],r["source"],r["arTitle"],r["lat"], r["eiSearch"],r["lon"],r["region"], r["translitTitleOther"],r["topURI"],r["searchNames"], r["topTypeAlt"], r["topType"], r["translitTitle"], r["arTitleOther"], r["UStranslitTitle"]])
            
    

delRows('../Data/cornu.csv', '[waystations, xroads]')
