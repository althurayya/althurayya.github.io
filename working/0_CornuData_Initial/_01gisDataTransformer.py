import glob, re, os, shutil, sys, math, time, datetime, csv
from os.path import join, getsize

sys.path.append("D:/_Python/Library")
sys.path.append("D:/_Python/ArabicBetacode")

sys.path.append("/Users/romanov/Documents/GitProjects/PythonFunctions")
sys.path.append("/Users/romanov/Documents/GitProjects/ArabicBetacode")


import gisHolder, gisDicts
import mgr, mgrGeneral, mgr_translit
import betaCode as bc

startTime = datetime.datetime.now()

##########################################################################
# URI Pattern
##########################################################################
# Name_LONXLATX_X_REGI
# - where:
# --- LON is 3 numbers (to tenths, prepend zero if necessary), X is E/W
# --- LAT is 3 numbers (to tenths, prepend zero if necessary), X is S/N
# --- X is either R (region), S (settlement), or O (other)
# --- REGI is Region according to Cornu (4 letters)
# LonLat --- X,Y

##########################################################################
# CATEGORIES
##########################################################################

metropoles  = "metropole"
capitals    = "capitale|cheflieu"
towns       = "cite|ville|port|canton" # canton = township
quarters    = "quartier|faubourg"
villages    = "bourgade|localite|village|oasis"
waystations = "etape|relais|---|aiguade|pointdeau|source|puits|mares|barrage|"+\
              "---|miqat|forteresse|ribat|citadelle|placeforte|chateau"+\
              "|placefrontiere"
regions     = "circon|circonscription|district|region|territoire|---|"+\
              "mikhlaf|kura|contree|ile|vallee|desert|tall|fosse"
sites       = "cataracte|site|defile|gue|lieu|tall|mines|montee|mont|montagne"
waters      = "canal|cours|coursdeau|fleuve|mer|lac|riviere|wadi"
xroads      = "rPoint"

##aiguade - a watering place
##gue - ford
##montee - something like a hill?
##pointdeau - a watering place

"""
S capitals
S metropoles
- noData
S quarters
R regions
O sites
S towns
S villages
W waters
S waystations
O xroads
"""

def categorizeTop(keyword):
    if re.search("^(%s)$" % metropoles, keyword):
        cat = "S_metropoles"
    elif re.search("^(%s)$" % capitals, keyword):
        cat = "S_capitals"
    elif re.search("^(%s)$" % towns, keyword):
        cat = "S_towns"
    elif re.search("^(%s)$" % quarters, keyword):
        cat = "S_quarters"
    elif re.search("^(%s)$" % villages, keyword):
        cat = "S_villages"
    elif re.search("^(%s)$" % waystations, keyword):
        cat = "S_waystations"
    elif re.search("^(%s)$" % regions, keyword):
        cat = "R_regions"
    elif re.search("^(%s)$" % sites, keyword):
        cat = "O_sites"
    elif re.search("^(%s)$" % waters, keyword):
        cat = "W_waters"
    elif re.search("^(%s)$" % xroads, keyword):
        cat = "O_xroads"
    else:
        input("classification unknown for: %s" % keyword)
    return(cat)

def generateUri(lon, lat, top, cat, region):
    nameUri = bc.betacodeToSearch(top.split("/")[0]).upper()
    nameUri = re.sub(r"\bAL-|(-I)?\s+|\?|#", "", nameUri)
    
    lonD = re.search(r"(\d+?\.\d)", lon).group(1)
    latD = re.search(r"(\d+?\.\d)", lat).group(1)

    if lon[0] == "-":
          lon = lonD+"W"
    else:
          lon = lonD+"E"
    if lat[0] == "-":
          lat = latD+"S"
    else:
          lat = latD+"N"
          
    lon = lon.replace('.', "").zfill(4)          
    lat = lat.replace('.', "").zfill(4)
    
    URI = "%s_%s%s_%s_%s" % (nameUri,lon,lat,cat,region[:4])
    URI = URI.upper()
    return(URI)


def generateNewCSV():
    rCount = 0
    
    print("Reformatting Cornu_All_Final.txt ...")
    newList = []
    with open("raw_Cornu_All_Final.txt", "r", encoding="utf8") as f:
        f = f.read().split("\n")
        for l in f[1:]:
            l = l.split("\t")
            if l[6] != 'noData':
                #input(l)
                nameRaw = l[6]
                lon = l[0]
                lat = l[1]
                kwRaw = l[4]
                catRaw = categorizeTop(kwRaw)
                region = l[2]

                # place URI
                placeURI = generateUri(lon, lat, nameRaw, catRaw[:1], region)
                #input(placeURI)

                # names
                nameRaw   = re.sub("[#\?]|-i", "", nameRaw).strip()
                names   = nameRaw.split("/")
                mName   = names[0]
                #input(mName)
                mNameAr = bc.betacodeToArabic(names[0])
                if len(names) > 0:
                    oNames  = ", ".join(names)
                    oNamesAr = bc.betacodeToArabic("، ".join(names))

                searchNames = bc.betacodeToSearch(oNames)
                #arBW = mgr.translitArabic(oNamesAr)
                arBW = bc.betacodeToSearch(oNames)

                if nameRaw.startswith("Rout"):
                    mName       = nameRaw
                    mNameAr     = nameRaw
                    oNames      = nameRaw
                    oNamesAr    = nameRaw
                    searchNames = nameRaw
                    arBW        = nameRaw

                    rCount += 1

                    #print(nameRaw)
                    print(placeURI)

                newVal = [region,lon,lat,catRaw[2:],l[5],mName,mNameAr,\
                          placeURI,oNames,oNamesAr,searchNames,arBW]
                #print(newVal)
                newList.append("\t".join(newVal))

    print("Total number: %d" % len(newList))
    print("Total number without duplicates: %d" % len(list(set(newList))))

    header = "\t".join(["region","lon","lat","topType","topTypeAlt","translitTitle","arTitle",\
                          "topURI","translitTitleOther","arTitleOther","searchNames","arBW"])
    newData = "\n".join(sorted(newList))
    newData = bc.deNoise(newData)

    print(rCount)
    with open("Cornu_All_Final_Reformatted.txt", "w", encoding="utf8") as f:
        f.write(header+"\n"+newData)

# Need to work on search fields for EI, Wikipedia, Pleiades, Iranica
# can it be done with javascript on the fly? [to save space?]
# searches for: baghdad OR madinat al-salam
# EIslam (consonant adjustment required):
# --- http://referenceworks.brillonline.com/search?s.q=baghdad+OR+madinat+al-salam
# Iranica (consonant and vowel adjustment required):
# --- http://www.iranicaonline.org/articles/search/keywords:baghdad%20OR%20madinat%20al-salam
# Pleiades (preference for transliterated?):
# --- http://pleiades.stoa.org/search?SearchableText=baghdad+OR+madinat+al-salam
# Wikipedia:
# --- http://en.wikipedia.org/wiki/Special:Search?search=baghdad+OR+madinat+al-salam

def main():
    generateNewCSV()

main()

print("Done!")
print("Processing time: " + str(datetime.datetime.now()-startTime))
print("Tada!")
