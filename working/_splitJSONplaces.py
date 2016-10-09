import json, codecs, pprint, fuzzywuzzy, sys

from fuzzywuzzy import fuzz

sys.path.append("Z:/Documents/c.GitProjects/PythonFunctions")
sys.path.append("/Users/romanov/Documents/c.GitProjects/PythonFunctions")
import mgr

srcFile = "/Users/romanov/Documents/c.GitProjects/althurayya.github.io/master/places.geojson"

print("Starting processing...")

def splitJSON(file):
    count = 0
    added = 0
    with open(srcFile, encoding="utf8") as json_data:
        d = json.load(json_data) # .decode("utf-8")
        
        for f in d["features"]:
            count += 1
            if count % 100 == 0:
                print(count)
                
            if "sources_arabic" not in f["properties"]:
                f["properties"]["sources_arabic"] = {}
            if "sources_english" not in f["properties"]:
                f["properties"]["sources_english"] = {}

            fileName = f["properties"]["cornuData"]["cornu_URI"]

            with open("../places/%s.geojson" % fileName,"w",encoding='utf-8') as fp:
                json.dump(f,fp,indent=4,ensure_ascii=False)

            #input("Stopped...")



splitJSON(srcFile)

print("Tada!")
