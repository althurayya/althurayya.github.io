import json, codecs, pprint, fuzzywuzzy, sys

from fuzzywuzzy import fuzz

sys.path.append("Z:/Documents/c.GitProjects/PythonFunctions")
sys.path.append("/Users/romanov/Documents/c.GitProjects/PythonFunctions")
import mgr

srcFile = "/Users/romanov/Documents/c.GitProjects/althurayya.github.io/master/places.geojson"
trgFile = "/Users/romanov/Documents/c.GitProjects/althurayya.github.io/master/places.geojson"

print("Starting processing...")


def updateJSON(srcFile):
    count = 0
    added = 0
    with open(srcFile, encoding="utf8") as json_data:
        d = json.load(json_data)
        
        for f in d["features"]:
            #print(f)

            for i in list(f["properties"]["sources_arabic"]):
                print("------------------")
                print(i)
                if f["properties"]["sources_arabic"][i]["status"] == "y":
                    pass
                elif f["properties"]["sources_arabic"][i]["status"] == "mb":
                    pass
                elif f["properties"]["sources_arabic"][i]["rate"] == 100:
                    f["properties"]["sources_arabic"][i]["status"] == "y"
                elif f["properties"]["sources_arabic"][i]["rate"] <= 80:
                    del f["properties"]["sources_arabic"][i]
##                else:
##                    pass
                else:
                    #print(i)
                    print("______________________")
                    # print entry toponym (+alternative spelling)
                    print(f["properties"]["cornuData"]["cornu_URI"])
                    print(f["properties"]["cornuData"]["toponym_arabic"]+" ("+f["properties"]["cornuData"]["toponym_arabic_other"]+")")
                    print("Does it match?")
                    # print the match
                    print(f["properties"]["sources_arabic"][i]["title"]+" (%d)" %f["properties"]["sources_arabic"][i]["rate"])
                    # collect input: y - match; n - not a match; mb - maybe, check manually later; stop - save file, exit
                    print("\tChoices:")
                    print("\t\t`y` - match; `n` - not a match;")
                    print("\t\t`mb` - maybe, check manually later; `stop` - save file, exit")
                    choice = input("Type your choice: ")
                    if choice == "y":
                        print("Your choice: " + choice)
                        print("\tupdating the record")
                        f["properties"]["sources_arabic"][i]["status"] = "y"
                        #input(f["properties"]["sources_arabic"][i])
                    elif choice == "n":
                        print("Your choice: " + choice)
                        print("\tremoving the record")
                        del f["properties"]["sources_arabic"][i]
                        #input(f)
                        #break
                        
                    elif choice == "mb":
                        print("Your choice: " + choice)
                        print("Your choice: " + choice)
                        print("\tupdating the record")
                        f["properties"]["sources_arabic"][i]["status"] = "mb"
                        #input(f)
                        #break
                        
                    elif choice == "stop":
                        print("Your choice: " + choice)
                        print("\tSaving and exiting...")
                        with open(trgFile,"w",encoding='utf-8') as fp:
                            json.dump(d,fp,sort_keys=True, indent=4,ensure_ascii=False)
                        exit()
                        
                        
                    else:
                        print("WRONG CHOICE")


        with open(trgFile,"w",encoding='utf-8') as fp:
            json.dump(d,fp,sort_keys=True, indent=4,ensure_ascii=False)


#addToJSON(srcFile, 50)

updateJSON(srcFile)

print("Tada!")
