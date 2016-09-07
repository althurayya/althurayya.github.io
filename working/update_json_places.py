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

# should not rerun texts that have been already added!
checkData = loadCSVdata("/Users/romanov/Documents/c.GitProjects/althurayya.github.io/working/_comparisonData")

def loadJSON(file):
    count = 0
    added = 0
    with open(srcFile) as json_data:
        d = json.load(json_data)
        
        for f in d["features"]:
            #for k,v in f["properties"].items():
            #print(f["properties"])
            if "textual_sources_uris" in f["properties"]:
                del f["properties"]["textual_sources_uris"]

            if "sources_arabic" not in f["properties"]:
                f["properties"]["sources_arabic"] = {}
            if "sources_english" not in f["properties"]:
                f["properties"]["sources_english"] = {}

            testline = f["properties"]["cornuData"]["toponym_arabic"]+"، "+ \
                       f["properties"]["cornuData"]["toponym_arabic_other"]

            testline = mgr.normalizeArabic(testline)
            testline = list(set(testline.replace("، ", "،").split("،")))

            ls = []
            for t in testline:
                for c in checkData:
                    count += 1
                    if count % 1000000 == 0:
                        print("{:,}".format(count))
                    c = c.split("\t")
                    ls.append([fuzz.ratio(t, c[2]), c[0], c[2]])
                    #input(ls)
            ls = sorted(ls, reverse=True)

            for i in ls:
                if i[1] not in f["properties"]["sources_arabic"]:
                    if i[0] >= 70:
                        added += 1
                        f["properties"]["sources_arabic"][i[1]] = [i[0], i[2], "na"]

        with open(trgFile,"w",encoding='utf-8') as fp:
            json.dump(d,fp,sort_keys=True, indent=4,ensure_ascii=False)

        print("Number of iterations: %s" % "{:,}".format(count))
        print("Total added: %s" % "{:,}".format(added))

loadJSON(srcFile)


##t1 = [50, "Test01", "bla"]
##t2 = [90, "Test02", "bla"]
##t3 = [1, "Test03", "bla"]
##t4 = [4, "Test04", "bla"]
##
##li = [t1, t4, t2, t3]
##
##print(li)
##
##print(sorted(li))
##print(sorted(li, reverse=True))

##t1 = "قلعة رباه"
##t2 = "قلعه كيانه"
##print(t1)
##print(t2)
##print(fuzz.ratio(t1, t2))


print("Tada!")
