"""
Extracts all routes connected to ROUTEPOINTS in cornu. Not completed and used!!!
It seams we don't need it anymore!
"""
import io, json
import re
import sys, codecs
import csv
from json import load

def getRoutes(fileName):
    routePoints = dict()
    with open(fileName, "r", encoding="utf8") as routeFile:
        allData = json.load(routeFile)
          for d in allData["data"]:
            sTopo = d['properties']['sToponym'] 
            eTopo = d['properties']['eToponym']
              if sTopo.startswith('ROUTPOINT'):
                if routePoint['sToponym'] not in routePoints:  
                 routePoint['sToponym'] = []  
                routePoint['sToponym'].extend(d['properties']['eToponym'])
              elif eTopo.startswith('ROUTPOINT'):
                if routePoint['eToponym'] not in routePoints:  
                 routePoint['eToponym'] = []  
                routePoints['eToponym'].extend(d['properties']['sToponym'])
          return routePoints


def connectByRoutePoints(cornuRouteFile):
    routes = getRoutes(cornuRouteFile)
    newRoutes = []
    for route in routes:
      for i in len(routes[route]):
        routes[route][i] = 
      with open("../Data/Distances_withCoords_normalized", 'w', encoding="utf8") as csvCoord:
      fWriter = csv.writer(csvCoord, delimiter=',')
      fWriter.writerow(["From", "From_lat", "From_long", "From_Region", "From_RUI", "To", "To_lat", "To_long", "To_Region", "To_URI", "distance"])
      with open(distanceFile, "r", encoding="utf8") as csvfile:
        distances = csv.reader(csvfile, delimiter='\t', quotechar='|')
        for line in distances:
          start = line[0][5:].strip()
          end = line[1][5:].strip()
          distance = line[-1][5:].strip()
          fWriter.writerow([start, ",".join( str(e) for e in coords[start]) if start in coords else "null,null,null,null", 
                            end, ",".join( str(e) for e in coords[end]) if end in coords else "null,null,null,null", distance])
          if start not in coords:
             not_common.append(start)
          if end not in coords:
             not_common.append(end)
    with open("../Data/routes_routePoints", 'w', encoding="utf8") as f:
          writer = csv.writer(f, delimiter=',') 
          writer.writerow(["not_common"]) 
          for nc in not_common:
            writer.writerow([nc])

getCornuCoord_forDistances("../Data/Shamela_0023696_Triples_Dist", "../Data/all_routes_new.json", "../Data/cornu_all_new2.json")
print("Done!")  
    
