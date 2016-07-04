import shutil

print("Copying Gazetteer related files...")
shutil.copy("Cornu_All.json", "./gazetteer-map-master/Cornu_All.json")
shutil.copy("Cornu_All_Routes.json", "./gazetteer-map-master/Cornu_All_Routes.json")
shutil.copy("Cornu_All_Complete.csv", "Orbis_Cornu_All_Complete.csv")

print("Copying Orbis related files to DropBoxFolder...")

files = ["Orbis_Cornu_All_Complete.csv",
         "Orbis_rEdgesLengths_00R_AllEdited_Updated.csv",
         "Orbis_Routes_00R_AllEdited_Updated.geojson"]
DropBoxFolder = "D:/_My Documents/Dropbox (Perseus DL)/Dropbox (Perseus DL)/shared with Cameron Jackson/IslamicOrbisData/"

for file in files:
    shutil.copy(file, DropBoxFolder)

print("Done! Gazetteer related files have been copied...")
