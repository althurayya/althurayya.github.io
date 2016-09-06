import json, codecs, pprint, fuzzywuzzy, sys

from fuzzywuzzy import fuzz

sys.path.append("Z:/Documents/c.GitProjects/PythonFunctions")
sys.path.append("/Users/romanov/Documents/c.GitProjects/PythonFunctions")
import mgr

srcFile = "/Users/romanov/Documents/c.GitProjects/althurayya.github.io/master/places.geojson"
trgFile = "/Users/romanov/Documents/c.GitProjects/althurayya.github.io/master/places.geojson"

def loadCSVdata(file):
    with open(file, "r", encoding="utf8") as f:
        data = f.read()
        data = mgr.normalizeArabic(data)
        data = data.split("\n")
    return(data)

checkData = loadCSVdata("/Users/romanov/Documents/c.GitProjects/althurayya.github.io/working/_comparisonData")

def loadJSON(file):
    with open(srcFile) as json_data:
        d = json.load(json_data)
        
        for f in d["features"]:
            #for k,v in f["properties"].items():
            #print(f["properties"])
            del f["properties"]["textual_sources_uris"]

            if "sources_arabic" not in f["properties"]:
                f["properties"]["sources_arabic"] = {}
            if "sources_english" not in f["properties"]:
                f["properties"]["sources_english"] = {}

            testline = f["properties"]["cornuData"]["toponym_arabic"]+"، "+ \
                       f["properties"]["cornuData"]["toponym_arabic_other"]

            testline = mgr.normalizeArabic(testline)
            testline = list(set(testline.replace("، ", "،").split("،")))

            for t in testline:
                for c in checkData:
                    c = c.split("\t")
                    if t == c[2]:
                        if c[0] not in f["properties"]["sources_arabic"]:
                            f["properties"]["sources_arabic"][c[0]] = [c[0], 100, "na"]
                    else:
                        test = fuzz.ratio(t, c[2])
                        if test >= 90:
                            if c[0] not in f["properties"]["sources_arabic"]:
                                f["properties"]["sources_arabic"][c[0]] = [c[0], test, "na"]                            
                            #print("%s > %s (%d)" % (t, c[2], fuzz.ratio(t, c[2])))
                            #input()
                    #input()

            
            #print(f["properties"])
            #input()

        with open(trgFile,"w",encoding='utf-8') as fp:
            json.dump(d,fp,sort_keys=True, indent=4,ensure_ascii=False)

loadJSON(srcFile)

print("Tada!")
