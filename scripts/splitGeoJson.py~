# Split a big json to single geoJson files for each feature 
# Change the file/folder names to apply on different file

import json
from json import load
import os

def splitJsonFile(openFile):
  with open(openFile, "r", encoding="utf8") as bigFile:    
    data = json.load(bigFile)
    for d in data["features"]:  
      features = {}
      features['type'] = "FeatureCollection"
      features['features'] = []
      features['features'].append(d)
      with open("routes/"+r['properties']['id']+".geojson", 'w') as f:
        f.write(json.dumps(features, indent=4,ensure_ascii=False))
    
if not os.path.exists("routes"):
    os.makedirs("routes") 
# Splits the old route file! Change it for splitting the places file
splitJsonFile("../working/0_CornuData_Working/all_routes_new.json")
print("done!")
