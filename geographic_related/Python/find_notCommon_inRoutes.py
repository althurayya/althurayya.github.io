"""
To find the routes connected to toponym (from geo texts) that are not found in Cornu.
It searches for route sections (of geo text) to which those toponyms are connected.
By this way we are gathering more information about the toponyms without coordinates with might help us to spot them on the map!
"""

import io, json, csv
import re
import sys  
from fuzzywuzzy import fuzz
from fuzzywuzzy import process


def normalizeArabic(text):
    """
    Normalization function
    """
    text = re.sub("[إأٱآا]", "ا", text)
    text = re.sub("ى", "ي", text)
    text = re.sub("ؤ", "ء", text)
    text = re.sub("ئ", "ء", text)
    text = re.sub("ه", "ة", text)
    if text.startswith("ال"):
      text = text[2:] 
    return(text)


def getSttls(fileName):
    """
    Makes a list of sttl names out of the csv containing hierarchies in lines (from PROV to STTL)
    that are not found in Cornu.    
    """
    names = list()
    with open(fileName, "r", encoding="utf8") as f1:
        f1 = csv.reader(f1, delimiter=',')
        for l in f1:
          names.append(l[-1][4:].strip())
    return names

def findNotCommons(fileName, writer):
   """
   Main functions to 
   """
   notCommonInRoutes = []
   sttls = getSttls("../Data/notCommon_checkAgainstCommons.txt")
   for sttl in sttls:
     with open(fileName, "r", encoding="utf8") as triRoutes:
       triRoutes = csv.reader(triRoutes, delimiter='\t')
       for tri in triRoutes:
         #print("sttl:",sttl,"tri:",tri[0],"tri[1]:",tri[1],)
         if fuzz.ratio(normalizeArabic(sttl), normalizeArabic(tri[0][4:].strip())) >= 90 or fuzz.ratio(normalizeArabic(sttl), normalizeArabic(tri[1][4:].strip())) >= 90: 
           notCommonInRoutes.append(tri)
   print(len(notCommonInRoutes))
   for r in notCommonInRoutes:
     writer.writerow(r)
   return notCommonInRoutes
    

with open("../Data/noCommon_Routes", "w", encoding="utf8") as distURI:
      fWriter = csv.writer(distURI, delimiter=',')
      fWriter.writerow(["From", "To", "Dist_Meter"])
      nc = findNotCommons("../Data/Shamela_0023696_Triples_Dist", fWriter)
      
        
print("done!")
