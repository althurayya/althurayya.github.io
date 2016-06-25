import re

def loadOld():
    oldDic = {}
    counter = 0
    with open("Cornu_All.txt", "r", encoding="utf8") as f:
        f = f.read().split("\n")
        for line in f:
            line = line.split("\t")
            try:
                key = line[3]+","+line[4]
                value = line[3]+"\t"+line[4]+"\t"+line[1]+"\t"+line[2]+"\t"+line[0]
                #input(value)
            except:
                input(line)
            
            #print(key)
            #print(value)
            #input()
            
            if key in oldDic:
                counter += 1
                #print(line)
                oldDic[key+":duplicate1"] = value
            else:
                oldDic[key] = value
            
    print(len(oldDic))
    print(counter)
    print("==============")
    return(oldDic)

#loadOld()

def mergeData():
    oldDic = loadOld()
    updatedData = []
    fileName = "Orbis_Cornu_All_Complete_Updated_inProgress.csv"
    with open(fileName, "r", encoding="utf8") as f:
        f = f.read().split("\n")
        for line in f:
            line = line.split("\t")
            key = line[3]+","+line[2]
            newValue = "\t".join([line[3],line[2],line[1],line[4],\
                                  line[8],line[10],line[0]])

            if key in oldDic:
                test = len(re.findall("\t", oldDic[key]))
                if test == 4:
                    oldDic[key] = oldDic[key]+"\t"+newValue
                    #input(oldDic[key])
                if test != 4:
                    keyUpdate = "\t".join(oldDic[key].split("\t")[:5])
                    oldDic[key+":dublicate2"] = keyUpdate+"\t"+newValue
                    #input(oldDic[key+":dublicate2"])

    for key, value in oldDic.items():
        updatedData.append(value)

    for i in range(len(updatedData)):
        test = len(re.findall("\t",updatedData[i]))
        if test == 4:
            updatedData[i] = updatedData[i]+"\tnoData"*8
            input(updatedData[i]+"\tnoData"*8)
        elif test == 11:
            pass
            #print(test)
            #input(updatedData[i])
        else:
            print(test)

    newList = []
    for line in updatedData:
        line = line.split("\t")
        #input(line)

        # coordinates
        newLine = [line[0],line[1],line[7]]

        # add categories
        if line[9] == 'noData' and line[3].startswith("Rout"):
            newLine.append("xroads")
        else:
            newLine.append(line[9])

        # add french keyword
        if line[10] == '':
            newLine.append(line[2])
        elif line[10] == 'noData' and line[3].startswith("Rout"):
            newLine.append("rPoint")
        else:
            newLine.append(line[10])

        newLine.append(line[10])

        # add translit name
        if line[8] == 'noData' and line[3].startswith("Rout"):
            newLine.append(line[3])
        else:
            newLine.append(line[8])

        newLine.append(line[3])

##        # add betaCode name
##        if line[8] == 'noData' and line[3].startswith("Rout"):
##            newLine.append(line[3])
##        else:
##            newLine.append(line[3])          

        # map
        if line[4].startswith("cornu"):
            newLine.append(line[4])
        else:
            newLine.append(line[11])
            
        newList.append("\t".join(newLine))
            
#00#'-8.48333',
#01#'38.36698',
#02#'cite',
#03#'Qa*sr Ban_u Ward_as',
#04#'cornu14'
#05#'-8.48333',
#06#'38.36698',
#07#'Andalus',
#08#'Qaṣr Banū Wardās',
#09#'towns',
#10#'', # new french keyword
#11#'cornu14'

    updatedData=newList

    print(len(updatedData))
    updatedData = list(set(updatedData))
    print(len(updatedData))

    updatedData = "\n".join(sorted(updatedData))
    with open("Orbis_Cornu_All_Complete_UpdatedMerged.txt", "w", encoding="utf8") as f:
        f.write(updatedData)
    print("Done!")
            
mergeData()
