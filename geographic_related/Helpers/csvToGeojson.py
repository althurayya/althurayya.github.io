import csv
def csvToGeoJson(fileName):
  # Read in raw data from csv
  rawData = csv.reader(open(fileName, 'rt', encoding="utf8"))

  # the template. where data from the csv will be formatted to geojson
  template = '{ "type" : "Feature","geometry" : {"type" : "Point","coordinates" : ["%s","%s"]},"properties": {"name": "%s"}},'

  # the head of the geojson file
  output = '{ "type" : "FeatureCollection","features" : ['
  #print("template: "+ template)
  #print("output: "+ output)
  #iter = 0
  for row in rawData:
     name = row[0]
     lat = row[2]
     lon = row[1]
     output += template % (row[2], row[1], row[0])
        
  # the tail of the geojson file
  output = output[:-1]
  output += "]}"
# opens an geoJSON file to write the output to
#outFileHandle = open("output.geojson", "w")
#outFileHandle.write(output)
#outFileHandle.close()
  with open("STTLCoordsGeojson", "a") as f2:          
    f2.write(output)
  print("Done!")

csvToGeoJson("STTLCoordsCSV")
