"""
This script is duplicated in find_notCommon_inRoutes.py!
Finds the route sections (of a geo text) to which the toponym that are not found in Cornu are connected.
"""

import re
import csv, json
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

def extractRoutes(topoFile, routesFile, writer):
    """
    To find the related routes of toponyms which are not in cornu.
    """
    with open(topoFile, "r", encoding="utf8") as notCommonsFile:
        notCommonsFile = csv.reader(notCommonsFile, delimiter=',')
        for nc in notCommonsFile:
          with open(routesFile, 'r') as geoRoutesFile:
            geoRoutes = csv.reader(geoRoutesFile, delimiter='\t', quotechar='|')
            #print("nc" , nc)
            for row in geoRoutes:
              #print("row0: ", row[0][4:].strip())
              #print("row1: ", row[1][4:].strip())
              if fuzz.ratio(normalizeArabic(nc[-1][4:].strip()),normalizeArabic(row[0][4:].strip()))>= 90 or fuzz.ratio(normalizeArabic(nc[-1][4:].strip()),normalizeArabic(row[1][4:].strip()))>= 90:
                #print(row)
                writer.writerow(row)

with open("../Data/noCommon_Routes2", "w", encoding="utf8") as distURI:
      fWriter = csv.writer(distURI, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
      fWriter.writerow(["From", "To", "originalDist"])
      extractRoutes("../Data/notCommon_checkAgainstCommons.txt", "../Data/Shamela_0023696_Triples_Dist", fWriter)
print("Done!")
