import json, codecs, pprint

srcFile = "/Users/romanov/Documents/c.GitProjects/althurayya.github.io/master/places.geojson"
trgFile = "/Users/romanov/Documents/c.GitProjects/althurayya.github.io/master/places_test.geojson"

def loadJSON(file):
    with open(srcFile) as json_data:
        d = json.load(json_data)
        
        for f in d["features"]:
            #for k,v in f["properties"].items():
            #print(f["properties"])
            del f["properties"]["textual_sources_uris"]
            #print(f["properties"])
            #input()

        with open(trgFile,"w",encoding='utf-8') as fp:
            json.dump(d,fp,sort_keys=True, indent=4,ensure_ascii=False)

loadJSON(srcFile)

print("Tada!")
