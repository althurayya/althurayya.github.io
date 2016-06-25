from datetime import datetime
import glob, re, os, shutil, sys, math, json, csv
from os.path import join, getsize
import gisHolder, gisDicts
sys.path.append("D:\\_Python\\Library")
import mgr, mgrGeneral, gisDicts, mgr_translit

#############################################################################
# gisDataUpdater: 
# - updates geoJson files

#############################################################################

def coordURI(lonRaw,latRaw):
    latRaw = str(latRaw)
    lonRaw = str(lonRaw)
    lat = re.search(r"(\d+?\.\d)", latRaw).group(1)
    lon = re.search(r"(\d+?\.\d)", lonRaw).group(1)
    if latRaw[0] == "-":
        lat = lat+"s"
    else:
        lat = lat+"n"
    if lonRaw[0] == "-":
        lon = lon+"w"
    else:
        lon = lon+"e"
    lat = re.sub('\.', "", lat)
    lat = lat.zfill(4)
    lon = re.sub('\.', "", lon)
    lon = lon.zfill(4)
    return(lon+lat)    

def topDictForSearch(fileName):
    with open(fileName, "r", encoding="utf-8") as topTextFile:
        coordProducts = []
        topDict = {}
        for line in topTextFile:
            tVars = line[:-1].split("\t")
            coordProduct = float(tVars[1]) * float(tVars[2])
            coordProducts.append(coordProduct)
            #dicVal : name, lat, lon, uri
            #dicVal = "%s\t%s\t%s\t%s" % (tVars[4],tVars[1],tVars[2],tVars[8])
            dicVal = "%s" % (tVars[8])
            topDict[coordProduct] = dicVal
            #if coordProduct == 1507.4417376863998:
            #    print(dicVal)
        #print(len(coordProducts))
        #import collections
        #print ([x for x, y in collections.Counter(coordProducts).items() if y > 1])
        #print(len(list(set(coordProducts))))
        #print(len(topDict))
        #print(topDict)
        #print(coordProducts)
        return(coordProducts, topDict)

def findClosest(myList, myNumber):
    result = min(myList, key=lambda x:abs(x-myNumber))
    return(result)

def loadCornu():
    data = "Cornu_All_Final_Reformatted.txt"
    with open(data, "r", encoding="utf-8") as topTextFile:
        newData = topTextFile.read().split("\n")
        newList = []
        for i in newData:
            if "_R_" in i:
                pass
            else:
                newList.append(i)
    return(newList)

cornuData = loadCornu()

def closestCoord(lon, lat, incr):
    topDict = {}
    distList = []
    for line in cornuData:
        tVars = line[:-1].split("\t")
        lonTemp,latTemp,topURI = float(tVars[1]),float(tVars[2]),tVars[7]
        #print(lonTemp,latTemp,topURI)
        if lat-incr < latTemp < lat+incr:
            if lon-incr < lonTemp < lon+incr:
                #print(lonTemp, latTemp, topURI)
                dist = math.sqrt((lat-latTemp)**2+(lon-lonTemp)**2)
                #print(dist)
                topDict[dist] = topURI
                distList.append(dist)
    #print(distList)
    #print(topDict)
    if len(distList) != 0:
        hit = topDict[min(distList)]
        #print(hit)
    else:
        hit = "EMPTYNODE"
        print(hit)
    return(hit)

def updateGeoJson(fileName):
    #coordProducts, topDict = topDictForSearch("Cornu_All_Complete.csv")
    csvList = []
    counter = 0
    fileNameBare = fileName[:-8]
    with open(fileNameBare+".geojson",  "r", encoding="utf-8") as dataI:
        data = json.load(dataI)
        for feature in data['features']:
            counter += 1
            sLat = float(feature['geometry']['coordinates'][0][0])
            sLon = float(feature['geometry']['coordinates'][0][1])
            #print(sLat,sLon)
            eLat = float(feature['geometry']['coordinates'][-1][0])
            eLon = float(feature['geometry']['coordinates'][-1][1])
            sPoint = coordURI(sLat,sLon)
            ePoint = coordURI(eLat,eLon)
            sToponymKey = closestCoord(sLat,sLon,0.5)
            eToponymKey = closestCoord(eLat,eLon,0.5)
            feature['properties']['sToponym'] = sToponymKey
            feature['properties']['eToponym'] = eToponymKey
            #newID = fileNameBare[4:] + "%03d_from%s_to%s" % (counter,sPoint,ePoint)
            newID = ("CR%04d_from%s_to%s" % (counter,sPoint,ePoint)).upper() # CR = Cornu Route
            #print(newID)
            length = feature['properties']['Meter']
            #feature['properties']['endPoint'] = eCoord
            #feature['properties']['startPoint'] = sCoord
            feature['properties']['id'] = newID
            csvList.append(newID+"\t"+sToponymKey+"\t"+eToponymKey+"\t"+str(length))
     
    with open("CornuRoutes_Updated.geojson", "w", encoding="utf-8") as dataO:
        dataO.write(json.dumps(data, indent=4))

    csvList = "\n".join(csvList)
    with open("Cornu_EdgesLengths_Updated.txt", "w", encoding="utf-8") as dataO:
        dataO.write(csvList)

def removeEmptyEdges():
    with open("CornuRoutes_Updated.geojson",  "r", encoding="utf-8") as dataI:
        data = json.load(dataI)
        features = data['features']
        print(features)
        print(len(features))
        for i in list(features):
            if i['properties']['sToponym'] == "EMPTYNODE" or\
               i['properties']['eToponym'] == "EMPTYNODE":
                              
                #print(i['properties'])
                features.remove(i)

    print(len(features))           
    with open("CornuRoutes_Updated_EmptiesRemoved.geojson", "w", encoding="utf-8") as dataO:
        dataO.write(json.dumps(data, indent=4))

def convertGeojson():
    file = "CornuRoutes_Updated_EmptiesRemoved.geojson"
    path = "D:/_Python/imiw/data/"
    with open(file, "r", encoding="utf8") as f1:
        with open(path+"all_routes.js", "w", encoding="utf8") as f2:
            f2.write("var allRoutes = "+f1.read())
    with open(file, "r", encoding="utf8") as f1:
        with open(path+"all_routes.json", "w", encoding="utf8") as f2:
            f2.write(f1.read())

def reformatCornuToJSON_Old():
    data = {'data': []}
    path = "D:/_Python/imiw/data/"
    cornuFile = "Cornu_All_Final_Reformatted.txt"
    with open(cornuFile, "r", encoding="utf8") as cornuCSV:
        for top in csv.DictReader(cornuCSV, delimiter='\t'):
            if top['translitTitle'].startswith("Route"):
                pass
            else:
                top['source'] = top['region']
                top['eiSearch'] = top['searchNames']
                top['UStranslitTitle'] = top['translitTitle']
                top['lat'] = float(top['lat'])
                top['lon'] = float(top['lon'])
                del top['topTypeAlt']
                del top['region']
                del top['translitTitleOther']
                del top['arTitleOther']
                del top['searchNames']
                #input(top)
                data["data"].append(top)
                # more: http://stackoverflow.com/questions/17043229/create-nested-json-from-csv
    with open(path+"cornu_all.json", "w", encoding="utf-8") as dataO:
        dataO.write(json.dumps(data, indent=4, ensure_ascii=False))
    with open(path+"cornu_all.json", "r", encoding="utf-8") as dataI:
        dataI = dataI.read()
        # need to find a smarter way to deal with integers and floats
        #dataI = re.sub(r"\"(-?\d)", r"\1", dataI)
        #dataI = re.sub(r"(\d)\"", r"\1", dataI)
        with open(path+"cornu_all.js", "w", encoding="utf-8") as dataO:
            dataO.write("var places = "+dataI)
    
def reformatCornuToJSON_New():
    data = {'data': []}
    path = "D:/_Python/imiw/data/"
    cornuFile = "Cornu_All_Final_Reformatted.txt"
    with open(cornuFile, "r", encoding="utf8") as cornuCSV:
        for top in csv.DictReader(cornuCSV, delimiter='\t'):
            top['source'] = top['region']
            top['eiSearch'] = top['searchNames']
            top['UStranslitTitle'] = top['translitTitle']
            top['lat'] = float(top['lat'])
            top['lon'] = float(top['lon'])
            data["data"].append(top)
            # more: http://stackoverflow.com/questions/17043229/create-nested-json-from-csv
    with open(path+"cornu_all_new.json", "w", encoding="utf-8") as dataO:
        dataO.write(json.dumps(data, indent=4, ensure_ascii=False))
    with open(path+"cornu_all_new.json", "r", encoding="utf-8") as dataI:
        dataI = dataI.read()
        # need to find a smarter way to deal with integers and floats
        #dataI = re.sub(r"\"(-?\d)", r"\1", dataI)
        #dataI = re.sub(r"(\d)\"", r"\1", dataI)
        with open(path+"cornu_all_new.js", "w", encoding="utf-8") as dataO:
            dataO.write("var places = "+dataI)

## PROCESSING GEOJSON

#updateGeoJson("raw_00R_AllEdited.geojson")
#removeEmptyEdges()
#convertGeojson()

## REFORMATTING TOPDATA INTO JSON
reformatCornuToJSON_Old()
reformatCornuToJSON_New()

print("All done!")
