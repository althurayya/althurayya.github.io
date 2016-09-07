import json, codecs, re


sources = {
    "0900AbuCabdAllahHimyari.RawdMictar" : ["/Users/romanov/Documents/a.UCA_Centennial/corpus/0900AH/data/0900AbuCabdAllahHimyari/0900AbuCabdAllahHimyari.RawdMictar/0900AbuCabdAllahHimyari.RawdMictar.Shamela0001043-ara1.mARkdown",
                                            "al-Ḥimyarī’s <i>Rawḍ al-miʿṭār</i>",
                                            "Abū ʿAbd Allãh al-Ḥimyarī (d. 900 AH). <i>Rawḍ al-miʿṭār fī ḫabar al-aqṭār</i>. Ed. by Iḥsān ʿAbbās. 2nd edition. Bayrūt, 1980"],
    #"key" : ["list", "of", "values"]
    }

# - load file, split into units, generate uris, reformat units (function)
# - save json objects

folder  = "/Users/romanov/Documents/c.GitProjects/althurayya.github.io/sources/"

def toHTML(text):
    text = text.replace("\n~~", " ")
    text = text.replace("'", "`")
    text = text.replace('"', "`")
    
    text = re.sub(r"PageV(\d+)P(\d+)", r"[v.\1, p.\2]", text)
    text = re.sub(r"\d+-\d+# ", "", text)
    text = re.sub(r"\b0+", "", text)

    newText = []
    for t in text.split("\n"):
        #input(t)
        if t.startswith("$DIC_TOP$"):
            t = '<h1 class="arabic">%s</h1>' % t[9:].strip()
        elif t.startswith("#") and "%~%" in t:
            t = '<p class="arabic_poetry">%s</p>' % t[1:].strip()
            t = t.replace("%~%", "*")
        else:
            t = '<p class="arabic">%s</p>' % t[1:].strip()
        #input(t)
        newText.append(t)

    text = "\n".join(newText)
    text = re.sub(" +", " ", text)
    return(text)


def processSource(lov):
    counter = 0
    uriBase = ".".join(lov[0].split("/")[-1].split(".")[0:-1])
    print("Processing: %s" % uriBase)

    listData = []

    with open(lov[0], "r", encoding="utf8") as f1:
        text = f1.read().split("\n#$#")
        for t in text[1:]:
            counter += 1
            firstLine = t.split("\n")[0].split("#")
            ID = firstLine[0].strip()
            title = firstLine[1].strip()
            #input(firstLine)
            
            uri = uriBase + ".%s.json" % ID
            #input(uri)


            if title.startswith(("$DIC_TOP$", "$DIC_NIS$")):
                print(title)
                compLine = title

                if title.startswith("$DIC_TOP$"):
                    compLine = "top\t%s" % title[9:].strip()
                else:
                    compLine = "nis\t%s" % title[9:].strip()

                features = {
                    "uri"       : uri,
                    "title"     : title[9:].strip(),
                    "text"      : toHTML(t),
                    "source"    : lov[1],
                    "reference" : lov[2]
                    }

                listData.append("%s\t%s" % (uri, compLine))

                geojsonSingle = {"type":"FeatureCollection","features":[]}
                geojsonSingle['features'].append(features)

                with open(folder+uri,"w",encoding='utf-8') as fp:
                    json.dump(geojsonSingle,fp,sort_keys=True, indent=4,ensure_ascii=False)
                    
    with open("_comparisonData_"+uriBase, "w", encoding="utf8") as f9:
        f9.write("\n".join(listData))

processSource(sources["0900AbuCabdAllahHimyari.RawdMictar"])

#processAll()

print("Tada!")
