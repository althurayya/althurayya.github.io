import re

def loadOld():
    oldDic = {}
    counter = 0
    with open("Cornu_All.txt", "r", encoding="utf8") as f:
        f = f.read().split("\n")
        for line in f:
            line = line.replace(",", "\t").split("\t")
            try:
                key = line[3]+","+line[4]
                value = line[1]+"\t"+line[2]
            except:
                input(line)
            
            #print(key)
            #print(value)
            
            if key in oldDic:
                counter += 1
                print(line)
            else:
                oldDic[key] = value
            
    print(len(oldDic))
    print(counter)
    return(oldDic)

def mergeData():
    oldDic = loadOld()
    updatedData = []
    with open("Orbis_Cornu_All_Complete_Updated_inProgress.csv", "r", encoding="utf8") as f:
        f = f.read().split("\n")
        for line in f:
            line = line.split("\t")
            #input(line)
            key = line[3]+","+line[2]
            try:
                merger = oldDic[key].split("\t")
                categ = merger[0]
                topBetaCode = merger[1]
                if line[10] == "":
                    categUpd = merger[0]
                else:
                    categUpd = line[10]
            except:
                categUpd = "nodata"
                topBetaCode = "nodata"
            

            newLine = [line[1],line[4],line[8],line[10],categUpd,topBetaCode,line[0],line[2],line[3]]


            newLine = "\t".join(newLine)
            updatedData.append(newLine)

    updatedData = "\n".join(sorted(updatedData))
    with open("Orbis_Cornu_All_Complete_UpdatedMerged.txt", "w", encoding="utf8") as f:
        f.write(updatedData)
            
mergeData()

#['cornu1', 'montagne', '^Gabal Bahra:t', '36.20321', '35.20588', '4030123.425', '4191895.271']
#['cornu1', 'region', '^Gabal San_ir', '35.81024', '33.45826', '3986377.943', '3956289.501']
['cornu4', 'cite-', 'Qurq_ub (?)', '47.70188', '32.17254', '5310148.771', '3785980.319']
['cornu7', 'temp-', '*`Unayza:t (#?)', '43.91699', '26.07604', '4888817.468', '3008502.245']
#['cornu8', 'mikhlaf', 'al-_Tu^g^ga:t', '44.17683', '13.97911', '4917742.609', '1571819.933']
#['cornu8', 'region', 'Dam_t', '44.74355', '14.16433', '4980829.108', '1593076.810']
['cornu13', 'cite', '_D_at al-*Hum_am', '29.30208', '30.86496', '3261893.115', '3615223.469']
