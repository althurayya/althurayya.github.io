"""
Converts json to csv (here Cornu route file is converted)
"""
import json
import csv
from json import load

def cornuJsonToCsv(openFile, writeFile):
  with open(openFile) as jsonFile:    
      allData = json.load(jsonFile)
      with open(writeFile, 'w') as csvCornu:
        fWriter = csv.writer(csvCornu, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
        #fWriter.writerow(["From","To","Meter"])
      #print(allData["data"][0])  
        for d in allData["features"]:
          fWriter.writerow([d["properties"]["sToponym"], d["properties"]["eToponym"], d["properties"]["Meter"]])
  
cornuJsonToCsv("../Data/all_routes_new.json", "../Data/all_routes_new.csv")
print("All done!")

