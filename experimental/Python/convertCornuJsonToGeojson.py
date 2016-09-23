"""
Converts a json file holding geographic data to geojson format.
"""
import json
import sys

def convert_json(fileName):
    """
    Main function
    """
    import json
    with open(fileName) as jsonFile:    
      allData = json.load(jsonFile)
      featureColl = {}
      featureColl['type'] = "FeatureCollection"
      featureColl['features'] = []
      for d in allData['data']:
        aFeature = {}
        aFeature['type'] = 'Feature'
        aFeature['geometry'] = {}
        aFeature['geometry']['type'] = 'Point'
        aFeature['geometry']['coordinates'] = [d['lon'],d['lat']]
        aFeature['properties'] = {}
        aFeature['properties']['topType'] = d['topType']
        featureColl['features'].append(aFeature)
      with open('../Data/cornuGeoJSON.json', 'w') as outfile:
        json.dump(featureColl, outfile)

    
convert_json('../Data/cornu_all_new.json')

