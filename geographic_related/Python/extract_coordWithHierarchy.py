"""
Makes a list of similar sttl names with cornu, usinf fuzzywuzzy with more that 100% similarity ration (or exact match that is commented out!).
the output is a csv file, containing sttl names, region from both Cornu and geographical text and other information as:
["Title in geo text", "Name in Cornu", "TitleOther from Cornu", "lat", "lon", "belonging region in cornu", "Prov in geo text", "direct region (parent) in geo text", "eiSearch from Cornu", "translitTitle from Cornu"]
"""

from fuzzywuzzy import fuzz
from fuzzywuzzy import process
from networkx.readwrite import json_graph
import io, json
import re
import sys, codecs
import csv
from json import load

# used for python 2.7
#reload(sys)  
#sys.setdefaultencoding('utf8')


def getSttlWithRegs(fileName):
    """
    Makes a list of sttl names with region and province
    """
    names = list()
    with open(fileName, "r", encoding="utf8") as f1:
        f1 = f1.read().split("\n")
        tmp = ""
        cnt = 0
        for l in f1:
          cnt = cnt + 1
          ls = l.split(",")
          if l:
            # join the sttl name with latest region and province to which it belongs
            tmp = "-".join((ls[-1][5:].strip(' '), ls[0][5:].strip(' '), ls[-3][5:].strip(' ')))
            names.append(tmp)
    print("name count: ", len(names))
    return names

def findCoord(fileName, sttlReg, fWriter):
  """
  Find the coordinates for the sttls from cornu file
  and write them all together in a csv file
  """
# extract sttl name of the sttlReg string which is "sttlName, last RegName, provName"
  sttlName = sttlReg.split('-')[0]
  with open(fileName, "r", encoding="utf8") as jsonFile:    
    allData = json.load(jsonFile)
    for d in allData["data"]:
      fName = d["arTitle"]
      sName = d["arTitleOther"].split(",")
#      if name == fName:
      # check if it finds similar words with arTitle, using fuzzywuzzy library
      if sttlReg and fuzz.ratio(sttlName, fName) >= 90:
        fWriter.writerow([sttlName, fName, "/".join(sName), d["lat"], d["lon"], d["region"], sttlReg.split('-')[1], sttlReg.split('-')[2], d["eiSearch"], d["translitTitle"]])
      else:
        for n in sName:
#          if name == n.strip():
          # check if it finds similar words with arTitleOther, using fuzzywuzzy library
          if sttlReg and fuzz.ratio(sttlName, n.strip()) >= 90:
            fWriter.writerow([sttlName, fName, n.strip(), d["lat"], d["lon"], d["region"], sttlReg.split('-')[1], sttlReg.split('-')[2], d["eiSearch"], d["translitTitle"]])
            break

def getCornuSttlWithCoord(hierarchyFile, coordsFile):
    global cnt
    data = []
    sttlNames = getSttlWithRegs(hierarchyFile)
    with open("../Data/SttlReg_CoordsCSV_fuzzyWuzzy", 'w', encoding="utf8") as csvCoord:
      fWriter = csv.writer(csvCoord, delimiter=',', quoting=csv.QUOTE_MINIMAL)
      fWriter.writerow(["geoTitle", "cornuName", "geoTitleOther", "lat", "lon", "cornuRegion", "geoProv", "geoFinalReg", "eiSearch", "translitTitle"])
    
      for st in sttlNames:
        findCoord(coordsFile, st, fWriter)
           
      
getCornuSttlWithCoord("../Data/Shamela_0023696_Triples_H", "../Data/cornu_all_new2.json")
print("Done!")  
    
