from datetime import datetime
import glob, re, os, shutil, sys, math
from os.path import join, getsize
import csv
import gisHolder, gisDicts
sys.path.append("D:\\_Python\\Library")
import mgr, mgrGeneral, gisDicts, mgr_translit

#############################################################################################
# gisDataTransformer: 
# Takes in a text file and returns csv, kml, ttl, and json files viewable in QGIS (csv),
# Google Earth (kml), Pelagios system (ttl), and Leaflet Map (json).
# Usage: python3 gisReformat [uniqueName_Toponyms.txt]
# Required: - filename must end with "*_Toponyms.txt";
#           - description of the source map should be stored in "*_Source.txt", where * is the
#             same as filename before "*_Toponyms.txt"
#############################################################################################

arVowel  = "[áāĀaAiIīĪuUūŪ]"
arVlong  = "[ãáāĀīĪūŪ]"
arVshort = "[aAiIuU]"
arCtrans = "[ʾʿbBčČdDḍḌḏḎġĠḥhHḤḫḪqQrRsSšŠṣṢtTṭṬṯṮŧwWzZẓẒKkLlMmNn]"
arHamza  = "ʾ"
arAyn    = "ʿ"

cornuVars = """
cornu1:Syria
cornu2:Jazira
cornu3:Iraq
cornu4:Khuzistan
cornu5:Jibal
cornu6:Faris
cornu7:Arabia
cornu8:Yemen
cornu9:Badiya
cornu10:Egypt
cornu10b:Egypt
cornu11:Sudan
cornu12:Maghrib
cornu13:Barqa
cornu14:Andalus
cornu15:Sicily
cornu16:Daylam
cornu17:Khurasan
cornu18:Khazar
cornu19:Sijistan
cornu20:Sind
"""

def generateCSV(fileName): 
  iFile = open(fileName, "r", encoding='utf-8').read()
  # remove unprocessed locations
  iFile = re.sub(".*\t(\n|$)", "", iFile)
  iFile = re.sub("\n$", "", iFile)
  # fix old convention "t > :t; "y, "o and "a > :a; "` > *` and "' > *'
  iFile = re.sub('"t', ':t', iFile)
  iFile = re.sub('"[yoa]', ":a", iFile)
  iFile = re.sub('"`', "*`", iFile)
  iFile = re.sub('"\'', "*'", iFile)
  # discard  excluded toponyms
  iFile = re.sub('.*\t.*?-\t.*\n', "", iFile)
  # remove ?s from topTypes
  iFile = re.sub('\?\t', "\t", iFile)
  # reformat toponymic categories
  iFile = re.sub('\t(metropole)\t', "\tmetropoles\t", iFile)
  iFile = re.sub('\t(capitale|cheflieu)\t', "\tcapitals\t", iFile)
  iFile = re.sub('\t(cite|ville)\t', "\ttowns\t", iFile)
  iFile = re.sub('\t(quartier)\t', "\tquarter\t", iFile)
  iFile = re.sub('\t(bourgade|localite|village)\t', "\tvillages\t", iFile)
  iFile = re.sub('\t(etape)\t', "\twaystations\t", iFile)

  iFile = re.sub('\t(fosse|lieu|passe|placeforte|placefrontiere|port|ribat|site|forteresse)\t', "\tsites\t", iFile)
  iFile = re.sub('\t(canton|circon|district|environ|mont|montagne|montagne/region|region|territoire)\t', "\tregions\t", iFile)
  iFile = re.sub('\t(wadi|canal|cours|coursdeau|fleuve|lac|riviere|source)\t', "\twaters\t", iFile)
  
  iFile = re.sub('"\'', "*'", iFile)
  
  # convert
  iFile = re.sub("\t", ",", iFile)
  iFileNEW = []
  iFileSplit = iFile.split("\n")

  for line in iFileSplit:
      #input(line)
      var = line.split(",")
      sector = var[0]
      #sectorVar = re.search(r"%s:(.*)" % sector, cornuVars).group(1)
      name = gisDicts.dictReplace(var[2], gisDicts.codeToTranslit)
      nameUri = name.lower()
      #print(nameUri)
      nameUri = gisDicts.dictReplaceRevRE(nameUri, gisDicts.translitToSimple)
      #input(nameUri)
      nameUri = re.sub("/.*?$", "", nameUri)
      nameUri = re.sub('al-| |"`|"\'|\d|/|\(|\)', "", nameUri)
      nameUri = re.sub('-|\?| |#|!', "", nameUri)
      lat = re.search(r"(\d+?\.\d)", var[3]).group(1)
      lon = re.search(r"(\d+?\.\d)", var[4]).group(1)
      line = gisDicts.dictReplace(line, gisDicts.codeToTranslit)
      if var[3][0] == "-":
          lat = lat+"W"
      else:
          lat = lat+"E"
      if var[4][0] == "-":
          lon = lon+"S"
      else:
          lon = lon+"N"
      lat = re.sub('\.', "", lat)
      lat = lat.zfill(4)
      lon = re.sub('\.', "", lon)
      lon = lon.zfill(4)
      #print(lat)
      #print(lon)
      URI = "%s_%s%s_%s" % (nameUri,lat,lon,sector)
      URI = URI.lower()
      #print(URI)
      URI = re.sub('\.', "", URI)
      line = line+","+URI
      iFileNEW.append(line)
      #input()
  iFileNEW = "\n".join(iFileNEW)
  #iFileNEW = gisDicts.dictReplace(iFileNEW, gisDicts.codeToTranslit)

  iFileUPD = open(fileName.replace(".txt", ".csv"), "w", encoding='utf-8')

  iFileUPD.write(iFileNEW)
  iFileUPD.close()

  iFile = open(fileName.replace(".txt", ".csv"), "r", encoding='utf-8')

##def routesFromKML(fileName):
##    filenameTest = fileName.replace("_Toponyms.txt", "_Routes.kml")
##    if os.path.isfile(filenameTest) == True:
##      #print("%s is being processed..." % filenameTest)
##      routeData = open(fileName.replace("_Toponyms.txt", "_Routes.kml"), "r", encoding='utf-8').read()
##      routeData = re.sub(r"(-?\d+\.\d+),(-?\d+\.\d+)", r"\2,\1", routeData)
##      # grab mapID (fileName?)
##      nameID = re.search(r"<Folder><name>(.*?)</name>", routeData).group(1)
##      nameID = re.sub(r"_.*?_", "_", nameID)
##      idNumber = 0
##      routesJSON = ""
##      for route in re.finditer(r"<coordinates>(.*?)</coordinates>", routeData):
##          idNumber = idNumber+1
##          routeID = nameID+"_"+str(idNumber)
##          singleRoute = route.group(1)
##          singleRoute = re.sub(" ", "], [", singleRoute)
##          singleRoute = ("[%s]" % singleRoute)
##          routeItem = gisHolder.jsonRouteItem % (routeID, singleRoute)
##          routesJSON = routesJSON + routeItem
##      routesJSON = gisHolder.jsonRouteHolder % routesJSON
##      print("%d route sections" % idNumber)
##
##      routeFile = open(fileName.replace("_Toponyms.txt", "_Routes.json"), "w", encoding='utf-8')
##      routeFile.write(routesJSON)
##      routeFile.close()
##    #else:
##    #  print("%s does not exist..." % filenameTest)
    

##def assembleKML(fileName, routes, sourceMap):
##    iFile = open(fileName.replace(".txt", ".csv"), "r", encoding='utf-8')
##    iGIS = csv.reader(iFile, delimiter=',', quotechar='"')
##    kmlData = ""
##    for row in iGIS:
##      name = re.sub("[Ŧŧ]$", "", row[2])
##      topType = row[1]
##      if topType == "province":
##          name = name.upper()
##      elif topType == "region":
##          name = name.upper()
##      style = topType
##      coordinates = row[3]+","+row[4]
##      sourceMapSector = row[0]
##      URI = row[7]
##
##      test = re.search("settl|capital|provcap|rPoint|castle", topType)
##      if test:
##          routes = re.sub("CO%s" % URI, "%s,0" % coordinates, routes)
##          routes = re.sub("NA%s" % URI, "%s" % name, routes)
##      
##      newPlace = holder.placemarkHolder % (name, URI, name, topType, coordinates, sourceMap, sourceMapSector, style, coordinates)
##      kmlData = kmlData+newPlace
##
##
##      final = holder.kmlHolder % (kmlData, routes)
##      
##      finalKML = open(sys.argv[1].replace(".txt", "_NEW.kml"), "w", encoding='utf-8')
##      finalKML.write(final)
##      finalKML.close()

def pelagios(fileName): # creating TTL (Turle RDF file) & JSON
  pelagiosTTL = gisHolder.pelagiosHead+"\n\n"

  jsonHeatMap = ""
  completeCSV = ""
  
  iFile = open(fileName.replace(".txt", ".csv"), "r", encoding='utf-8')
  iGIS = csv.reader(iFile, delimiter=',', quotechar='"')
  for row in iGIS:
      topSrc  = row[0]
      topType = row[1]
      topName = row[2]
      topLong = row[3]
      topLat  = row[4]
      topURI  = row[7]

      # choose only settlements
      if re.search(r"\b(.*)\b", topType):
        # process topName
        topName = re.sub("\(|\)", "", topName)
        topName, topTrUS, topTrSim, topAr = mgr_translit.processTranslitName(topName)

        # combine into TTL
        topNameTr = gisHolder.pleiadesName % (topName, " transliterated name")
        topNameTrS = gisHolder.pleiadesName % (topTrSim, " transliterated name simple")
        topNameAr = gisHolder.pleiadesName % (topAr, " Arabic name")
        topNames = topNameTr+"\n  "+topNameTrS+"\n  "+topNameAr
        newPlace = gisHolder.pelagiosPlace % (topURI, topName, topType, topNames, topLat, topLong)
        pelagiosTTL = pelagiosTTL+newPlace+"\n"

        # combine into JSON
        jsonHeatMap = jsonHeatMap + gisHolder.jsonPlaceItem % (topSrc, topLat, topLong, topAr, topName, topTrUS, topTrSim, topType) + "\n"

        # combine complete CSV
        topAr = re.sub("( )+[?!#]+", "", topAr)
        topAr = re.sub("/", "|", topAr)
        topAr = re.sub("-", "", topAr)
        topAr = re.sub("( )+\d+", "", topAr)
        topAr = re.sub("رoتPoنت\d+", "crossroads", topAr)
        completeCSV = completeCSV+topSrc+"\t"+topLat+"\t"+topLong+"\t"+topAr+"\t"+topName+"\t"+topTrUS+"\t"+topTrSim+"\t"+topType+"\t"+topURI+"\n"        
      
  finalTTL = open(fileName[:-3]+"ttl", "w", encoding='utf-8')
  finalTTL.write(pelagiosTTL)
  finalTTL.close()

  finalJSON = open(fileName[:-3]+"json", "w", encoding='utf-8')
  jsonHeatMap = gisHolder.jsonPlaceHolder % jsonHeatMap
  finalJSON.write(jsonHeatMap)
  finalJSON.close()

  finalCSV = open(fileName[:-4]+"_Complete.csv", "w", encoding='utf-8')
  finalCSV.write(completeCSV)
  finalCSV.close()

def dataTransformation(fileName):
    sourceMap = open(fileName.replace("_Toponyms.txt", "_SourceMap.txt"), "r", encoding='utf-8').read()
    iFile = mkCSV(fileName)    
    routes = getRoutes(fileName)
    assemble(fileName, routes, sourceMap)
    createTTL(fileName)
    iFile.close()
    print("%s is Done!" % fileName)

def combineCornu(path):
  cornuCombined = ""
  for file in os.listdir(path):
    if file.endswith("_Toponyms.txt"):
      print(file)
      currentFile = os.path.join(path, file)
      currentFile = re.sub(".*\t(\n|$)", "", currentFile)
      currentFile = re.sub("\n$", "", currentFile)
      #print(currentFile)
      generateCSV(currentFile)
      pelagios(currentFile)
      #routesFromKML(currentFile)
      tempFile = open(currentFile, "r", encoding="utf-8").read()
      cornuCombined = cornuCombined + tempFile + "\n"
  cornuCombined = re.sub("\n$", "", cornuCombined)
  cornuAll = open(os.path.join(path, "Cornu_All.txt"), "w", encoding="utf-8")
  cornuAll.write(cornuCombined)
  cornuAll.close()
  
  generateCSV("Cornu_All.txt")
  pelagios("Cornu_All.txt")
  
  print("All available Cornu Toponym Files are combined into one...")
  
      

####################################################################################################################
cornuFolder = "D:\\Working Documents\\Geography of the Classical Islamic World\\_Georeferencing\\Cornu Atlas JPGs\\"
combineCornu(cornuFolder)

#routesFromKML("Cornu_All_Toponyms.txt")

print("Done!")
