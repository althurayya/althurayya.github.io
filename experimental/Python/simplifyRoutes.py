"""
 To simplify the coordinates of cornu routes by removing the coordinates except source and destination coordinates.
 The output is used in Geo-Bio (project) in http://bl.ocks.org/masoumeh/4b6a27fd50ffdd81c34fb3c59963a401.
 The idea was to simplify the routes on the map. 
"""

from networkx.readwrite import json_graph
import io, json
import re
import sys
import csv
from json import load

with open("../Data/all_routes_new.json") as jsonFile:
  allData = json.load(jsonFile)
  newData = {}
  newData['features'] = []
  for d in allData['features']:
    aFeature = {}
    aFeature['type'] = 'feature'
    aFeature['geometry'] = {}
    aFeature['geometry']['type'] = 'LineString'
    arr  = d['geometry']['coordinates']
    aFeature['geometry']['coordinates'] =[arr[0],arr[len(arr)-1]]
    newData['features'].append(aFeature)

  with open('../Data/all_routes_new-noCoordinates.json', 'w') as outfile:
      json.dump(newData, outfile)
