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
      #print("features: ", features)
      with open("Routes/"+r['properties']['id']+".geojson", 'w') as f:
        #json.dumps(features, f, indent=4,ensure_ascii=False)  
        f.write(json.dumps(features, indent=4,ensure_ascii=False))
    
if not os.path.exists("Routes"):
    os.makedirs("Routes") 
# Splits the old route file!
splitJsonFile("../Data/all_routes_new.json")
print("done!")
