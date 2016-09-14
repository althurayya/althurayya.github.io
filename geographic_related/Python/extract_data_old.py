import re

def extractData(fileName):
    regionDic = {}
    
    settlements = []
    dist = []
    
    with open(fileName, "r", encoding="utf8") as f1:
        f1 = f1.read().split("\n")

        # PROCESS ADMINISTRATIVE DIVISIONS

        # COLLECT REGIONS into DIC
        for region in f1:
            if region.startswith("#PROVINCE#"):
                region = region.split("REGION")
                province = region[0]
                regions = region[1].split("#")

                for r in regions:
                    if r.strip() != "":
                        key = "#REGION# %s #" % r.strip()
                        input(key)
                        val = province + "REGION# %s #" % r.strip()
                        regionDic[key] = val
        
        # MERGE REGIONS WITH SETTLEMENTS
        for settl in f1:
            if settl.startswith("#REGION#"):
                regionKey = settl.split("#TYPE#")[0] + "#"
                input(regionKey)
                typeKey = "TYPE#" + settl.split("#TYPE#")[1].split("#SETTLEMENT#")[0]+\
                          "#SETTLEMENT#"
                #print(typeKey)
                
                settlList = settl.split("#SETTLEMENT#")[1].split("#")[:-1]
                if len(settlList) == 1:
                    newVal = regionDic[regionKey] + typeKey + settlList[0]
                    settlements.append(newVal)

                else:
                    for s in settlList:
                        newVal = regionDic[regionKey] + typeKey + s
                        settlements.append(newVal)

        # SETTLEMENTS DATA:
        sData = ["PROVINCE\trTYPE\tREGION\tsTYPE\tSETTLEMENT"]
        for i in settlements:
            #print(i)
            newVal = re.split(" ?#\w+# ", i)
            newVal = "\t".join(newVal[1:])
            sData.append(newVal.strip())

        with open(fileName+"_AdmDivisions", "w", encoding="utf8") as f9:
            f9.write("\n".join(sData))
        
        
        # PROCESS DISTANCES
        dData = ["FROM\tTO\tDISTANCE"]
        for l in f1:            
            if l.startswith("#FROM#"):
                l = re.sub(" ?#\w+# ?", "\t", l[7:])
                dData.append(l.strip())

        with open(fileName+"_Distances", "w", encoding="utf8") as f9:
            f9.write("\n".join(dData))




extractData("Shamela_0023696")
print("Done!")
