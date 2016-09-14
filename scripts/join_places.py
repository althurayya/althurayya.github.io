# Split a big json (places) to single geoJson files for each feature
# Just change the file/folder names to run it on other files!

import json
from json import load
import os

def integrateJsonFiles(pathToFiles, writeFile):
  featureColl = {}
  featureColl['type'] = "FeatureCollection"
  featureColl['features'] = []
  for fileName in os.listdir(pathToFiles):
    with open(pathToFiles+fileName, "r", encoding="utf8") as singleFile:    
      data = json.load(singleFile)
      featureColl['features'].append(data["features"][0])
  return featureColl

with open("../master/places.geojson", 'w') as allFile:
     allData = integrateJsonFiles("../places/", allFile)
     allFile.write(json.dumps(allData, indent=4,ensure_ascii=False))
print("done!")
