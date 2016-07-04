from datetime import datetime
import glob, re, os, shutil, sys, math
from os.path import join, getsize
import csv
import gisHolder, gisDicts
sys.path.append("D:\\_Python\\Library")
import mgr, mgrGeneral, gisDicts, mgr_translit

#############################################################################################
# gisDataSuggester: 
# - Suggests URIs into tagged primary sources
# - tagging sources: create URIs for regions and provinces; pattern TERM_TOPONYM, for example:
# --- IQLIM_IRAQ
# --- KURA_BAGHDAD
# --- KURA_WASIT
#############################################################################################

def prepTopList():
    newList = []
    with open("Cornu_All_Complete.csv", "r", encoding="utf-8") as topTextFile:
        for line in topTextFile:
            tVar = line[:-1].split("\t")
            newLine = "#"+tVar[3]+"\t"+tVar[8]+"#"
            newList.append(newLine)
    newList = "\n".join(newList)
    #print(newList)
    return(newList)
            
def suggestURIs(taggedSourceFile):
    al = mgr.deNormalize("ال")
    uriList = prepTopList()
    with open(taggedSourceFile, "r", encoding="utf-8") as taggedSourceText:
        taggedSourceText = taggedSourceText.read()

    blanksRE = r"#URI##([\w ]+)"
    blankURIs = re.findall(blanksRE,taggedSourceText)
    print("Total number of hits: %d" %len(blankURIs))
    counter = 0
    for blank in blankURIs:
        blank = blank.strip()
        blankRE = mgr.deNormalize(blank)
        URIs = re.findall("#%s\t.*#" % blankRE, uriList)
        if len(URIs) == 1:
            counter += 1
            newURI = URIs[0].split("\t")[1][:-1]
            taggedSourceText = re.sub("#URI## %s" % blank, "#%s## %s" % (newURI, blank), taggedSourceText)
            #print(newURI)
            #input(URIs)

    print("Total number of suggested URIs: %d" % counter)
    with open(taggedSourceFile, "w", encoding="utf-8") as taggedSourceTextNew:
        taggedSourceTextNew.write(taggedSourceText)

suggestURIs("PrimarySources/Muqaddasi_AhsanTaqasim_reformatted")

##def coordURI(latRaw,lonRaw):
##    latRaw = str(latRaw)
##    lonRaw = str(lonRaw)
##    lat = re.search(r"(\d+?\.\d)", latRaw).group(1)
##    lon = re.search(r"(\d+?\.\d)", lonRaw).group(1)
##    if latRaw[0] == "-":
##        lat = lat+"w"
##    else:
##        lat = lat+"e"
##    if lonRaw[0] == "-":
##        lon = lon+"s"
##    else:
##        lon = lon+"n"
##    lat = re.sub('\.', "", lat)
##    lat = lat.zfill(4)
##    lon = re.sub('\.', "", lon)
##    lon = lon.zfill(4)
##    return(lat+lon)    
##
##def topDictForSearch(fileName):
##    with open(fileName, "r", encoding="utf-8") as topTextFile:
##        coordProducts = []
##        topDict = {}
##        for line in topTextFile:
##            tVars = line[:-1].split("\t")
##            coordProduct = float(tVars[1]) * float(tVars[2])
##            coordProducts.append(coordProduct)
##            #dicVal : name, lat, lon, uri
##            #dicVal = "%s\t%s\t%s\t%s" % (tVars[4],tVars[1],tVars[2],tVars[8])
##            dicVal = "%s" % (tVars[8])
##            topDict[coordProduct] = dicVal
##            #if coordProduct == 1507.4417376863998:
##            #    print(dicVal)
##        #print(len(coordProducts))
##        #import collections
##        #print ([x for x, y in collections.Counter(coordProducts).items() if y > 1])
##        #print(len(list(set(coordProducts))))
##        #print(len(topDict))
##        #print(topDict)
##        #print(coordProducts)
##        return(coordProducts, topDict)
##
##def findClosest(myList, myNumber):
##    result = min(myList, key=lambda x:abs(x-myNumber))
##    return(result)
##
##
##def closestCoord(lat, lon, incr):
##    import math
##    #print(lat,lon)
##    with open("Cornu_All_Complete.csv", "r", encoding="utf-8") as topTextFile:
##        topDict = {}
##        distList = []
##        for line in topTextFile:
##            tVars = line[:-1].split("\t")
##            lonTemp, latTemp, topURI = float(tVars[1]), float(tVars[2]), tVars[8]
##            #print(latTemp, lonTemp, topURI)
##            if lat-incr < latTemp < lat+incr:
##                if lon-incr < lonTemp < lon+incr:
##                    #print(latTemp, lonTemp, topURI)
##                    dist = math.sqrt((lat-latTemp)**2+(lon-lonTemp)**2)
##                    #print(dist)
##                    topDict[dist] = topURI
##                    distList.append(dist)
##        #print(distList)
##        #print(topDict)
##        if len(distList) != 0:
##            hit = topDict[min(distList)]
##            #print(hit)
##        else:
##            hit = "EMPTYNODE"
##            print(hit)
##        return(hit)
##            
##
##import json
##def updateGeoJson(fileName):
##    #coordProducts, topDict = topDictForSearch("Cornu_All_Complete.csv")
##    csvList = []
##    counter = 0
##    fileNameBare = fileName[:-8]
##    with open(fileNameBare+".geojson",  "r", encoding="utf-8") as dataI:
##        data = json.load(dataI)
##        for feature in data['features']:
##            counter += 1
##            sLat = float(feature['geometry']['coordinates'][0][0])
##            sLon = float(feature['geometry']['coordinates'][0][1])
##            #print(sLat,sLon)
##            eLat = float(feature['geometry']['coordinates'][-1][0])
##            eLon = float(feature['geometry']['coordinates'][-1][1])
##            sPoint = coordURI(sLat,sLon)
##            ePoint = coordURI(eLat,eLon)
##            sToponymKey = closestCoord(sLat,sLon,0.5)
##            eToponymKey = closestCoord(eLat,eLon,0.5)
##            feature['properties']['sToponym'] = sToponymKey
##            feature['properties']['eToponym'] = eToponymKey
##            newID = fileNameBare[4:] + "%03d_from%s_to%s" % (counter,sPoint,ePoint)
##            #print(newID)
##            length = feature['properties']['Meter']
##            #feature['properties']['endPoint'] = eCoord
##            #feature['properties']['startPoint'] = sCoord
##            feature['properties']['id'] = newID
##            csvList.append(newID+"\t"+sToponymKey+"\t"+eToponymKey+"\t"+str(length))
##     
##    with open("Orbis_Routes_"+fileNameBare+"_Updated.geojson", "w", encoding="utf-8") as dataO:
##        dataO.write(json.dumps(data, indent=4))
##
##    csvList = "\n".join(csvList)
##    with open("Orbis_rEdgesLengths_"+fileNameBare+"_Updated.csv", "w", encoding="utf-8") as dataO:
##        dataO.write(csvList)

#testFile = "03R_Iraq.geojson"
#updateGeoJson(testFile)

#topDictForSearch("Cornu_All_Complete.csv")

#Cornu03_III_Toponyms_Complete.csv
#Cornu_All_Complete.csv

print("Done!")
