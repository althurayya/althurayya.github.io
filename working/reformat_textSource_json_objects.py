import json, codecs

# 1. read CSV data
# 2. open JSON > write one big JSON, save individual records
# 3. save all data....

tsvIndex = "/Users/romanov/Documents/GitProjects/althurayya/working/0_TextSources/index.tsv"
tsvSourc = "/Users/romanov/Documents/GitProjects/althurayya/working/0_TextSources/sources.tsv"


places = "/Users/romanov/Documents/GitProjects/althurayya/places/"
routes = "/Users/romanov/Documents/GitProjects/althurayya/routes/"
master = "/Users/romanov/Documents/GitProjects/althurayya/master/"
texts  = "/Users/romanov/Documents/GitProjects/althurayya/texts/"

def readTSCintoJSON(file, fileName, saveSingles):
    geojson = {"type":"FeatureCollection","features":[]}
    with open(file, "r", encoding="utf8") as f1:
        data = f1.read().split("\n")

        n = data[0].split("\t")
        print(n)

        cat = n[0]

        # cornu data dic
        d = {}
        for l in data[1:]:
            dtemp = {}
            l = l.split("\t")
            for i in range(0,len(l)):
                #print(l[i])
                try:
                    dtemp[n[i]] = l[i]
                except:
                    input(l)
            d[l[0]] = dtemp

            #input(d)

        for k,v in d.items():
            #feature = {"type":"Feature","geometry":{"type":"Point","coordinates":[float(l[2]),float(l[3])]}}
            feature = {"type":"Feature", "item": k, "properties": v}
            geojson['features'].append(feature)

            uri = v[cat].replace(" ", "_").replace("|", "_")
            #input(v)

            if saveSingles == "y":
                geojsonSingle = {"type":"FeatureCollection","features":[]}
                geojsonSingle['features'].append(feature)

                with open(texts+"%s.json" % uri,"w",encoding='utf-8') as fp:
                    json.dump(geojsonSingle,fp,sort_keys=True, indent=4,ensure_ascii=False)

    with open(master+fileName+".json","w",encoding='utf-8') as fp:
        json.dump(geojson,fp,sort_keys=True, indent=4, ensure_ascii=False)

    return(d)


#readTSCintoJSON(tsvIndex, "index", "n")
readTSCintoJSON(tsvSourc, "sources", "y")

print("Tada!")
