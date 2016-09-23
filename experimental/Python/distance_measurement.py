"""
To measure the distances for route sections of geographical text by checking them against Cornu routes.
For the common routes, the route sections of geographical text will have an extension of distances in meter specified in Cornu routes file.
As an example routes from A to B, existing in both Cornu and geographical text, will be extended as:
["From", "From_Uri", "To", "To_Uri", "original or classic Distance from text", "distance in Meter from Cornu"]
This structure will be written in a csv file.
This will be used in distance analysis, to see how we can replace classic values and units with modern ones! 
"""

import re
import csv, json

def measureDistance(fileName, writer):
    with open(fileName, 'r') as triFile:
      triReader = csv.reader(triFile, delimiter=',', quotechar='|')
      for tri in triReader:
      #print(tri)
          startURI = tri[1].strip()
          toURI = tri[3].strip()
          with open('../Data/all_routes_new.json', 'r') as cornuFile:
            cornu = json.load(cornuFile)
            for cornuData in cornu['features']:
              if (startURI == cornuData['properties']['sToponym'] and toURI == cornuData['properties']['eToponym'] or
                    startURI == cornuData['properties']['eToponym'] and toURI == cornuData['properties']['sToponym']):
                #print(startURI, " - ", toURI)
                cornuDistance = cornuData['properties']['Meter']
                tmp = ", ".join( str(e) for e in tri)
                writer.writerow([tmp, cornuDistance])
                break

with open("../Data/Shamela_Triples_Dist_cornuMeter", "w", encoding="utf8") as distMeter:
      fWriter = csv.writer(distMeter, delimiter=',', quoting=csv.QUOTE_MINIMAL)
      fWriter.writerow(["From", "FromUri", "To", "ToUri", "originalDist", "cornuMeter"])
      measureDistance("../Data/Shamela_0023696_Triples_Dist_TopURI", fWriter)
print("Done!")
