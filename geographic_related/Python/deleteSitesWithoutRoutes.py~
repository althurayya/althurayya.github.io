import io, json, csv
import re
import sys  

def delSites(csvFile, jsonFile):
  rows = []
  with open(csvFile, 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='|')
    #next(reader, None)  # skip the headers
    with open (jsonFile) as cornu:
      data = json.load(cornu)
      for row in reader:
        uri = row[8]
        for d in data['features']:
          if uri == d['properties']['eToponym'] or  uri == d['properties']['sToponym']:
            rows.append(row)
  with io.open('../Data/cornuFilteredRoutes.csv', 'w', encoding='utf-8') as f:
      fWriter = csv.writer(f, delimiter=',')
      fWriter.writerow(["arBW","source","arTitle","lat", "eiSearch","lon","region", "translitTitleOther","topURI","searchNames", "topTypeAlt", "topType", "translitTitle", "arTitleOther", "UStranslitTitle"])   

      for r in rows:
        fWriter.writerow(r)

delSites('cornu.csv', '../Data/all_routes_new.json')
