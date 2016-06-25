import shutil

##print("Copying Gazetteer related files...")
##shutil.copy("Cornu_All.json", "./gazetteer-map-master/Cornu_All.json")
##shutil.copy("Cornu_All_Routes.json", "./gazetteer-map-master/Cornu_All_Routes.json")
##shutil.copy("Cornu_All_Complete.csv", "Orbis_Cornu_All_Complete.csv")
##
##print("Copying Orbis related files to DropBoxFolder...")
##
##files = ["Orbis_Cornu_All_Complete.csv",
##         "Orbis_rEdgesLengths_00R_AllEdited_Updated.csv",
##         "Orbis_Routes_00R_AllEdited_Updated.geojson"]
##DropBoxFolder = "D:/_My Documents/Dropbox (Perseus DL)/Dropbox (Perseus DL)/shared with Cameron Jackson/IslamicOrbisData/"
##
##for file in files:
##    shutil.copy(file, DropBoxFolder)

def convertGeojson():
    file = "CornuRoutes_Updated_EmptiesRemoved.geojson"
    path = "D:/_Python/imiw/data/"
    with open(file, "r", encoding="utf8") as f1:
        with open(path+"all_routes.js", "w", encoding="utf8") as f2:
            f2.write("var allRoutes = "+f1.read())
    with open(file, "r", encoding="utf8") as f1:
        with open(path+"all_routes.json", "w", encoding="utf8") as f2:
            f2.write(f1.read())
convertGeojson()

print("Done! Gazetteer related files have been copied...")
