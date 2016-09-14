# Extract the region for each common sttl name with cornu,
# for each common string either in arTitle or (each of the) arTitleOther, the corresponding region will be extracted.
# The common sttl names are extraced (before) and written into a csv file as an input.
# The output file is json 
# This script can be replaced by extract_coord.py or better by extract_coordWithHierarchy.py

import io
import csv, json
import sys, re


def findRegions(sttlsFile, geoFile, cornuFile):
    commonTitles = {}
    titles = []
    with open(sttlsFile, 'r', encoding="utf8") as f:
      sttlLines = f.readlines()
      for l in sttlLines:
        geoTitle, cornuTitle = '', ''
        sttls = l.split("-")
        with open(geoFile, 'r', encoding="utf8") as csvfile:
          data = csv.reader(csvfile, delimiter=',', quotechar='|')
          region = ''
          for d in data:
            if sttls[0] in d[-1]:
              region = d[0][4:]
              break
          cornuTitles = []
          for s in sttls[1:]:
            with open(cornuFile, 'r', encoding="utf8") as cornu:    
              cornuData = json.load(cornu)
              for cData in cornuData['data']:
                if s.strip(' \n') in cData['arTitle'].strip(' \n') or s.strip(' \n') in cData['arTitleOther'].strip(' \n'):
                  cornuTitles.append({"title" : s, "region" : cData['region'] , "lon": cData['lon'], "lat": cData['lat']})

          titles.append({"geoTitle" : sttls[0], "geoRegion" : region, "cornuTitles" : cornuTitles})
      commonTitles['titles'] = titles   
      with open("../Data/commonWithcornu-Regions", 'w', encoding="utf8") as jsonRegions:
        json.dump(commonTitles, jsonRegions, ensure_ascii=False, indent = 4)

findRegions('../Data/fuzzyWuzzyWithCornu_OtherTitle-90.txt', '../Data/Shamela_0023696_Triples_H', '../Data/cornu_all_new2.json')
print("done!") 
