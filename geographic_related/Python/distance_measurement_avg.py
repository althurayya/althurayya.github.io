"""
This script uses the outputs from distance_measurment.py to caclulates the average value of classic distances.
That mans, if we have different values in meter (or any other modern measurment units) for a distance value in classic word,
here we simple make an average to define a basic equivalent for classic values (like مرحلة).
This definitely cannot be the correct way of measurment and it needs more research to come to an end and map classic values with modern values.
Then, here we just use average values as quick replacements for our calculations.
"""
import re
import csv, json

def measureAvgDistance(fileName):
    with open(fileName, 'r') as meterFile:
      distReader = csv.reader(meterFile, delimiter=',', quotechar='|')
      unit_meter = dict()
      next(distReader, None)
      for dist in distReader:
          unit = dist[-2].strip('"')
          meter = dist[-1]
          if unit in unit_meter:
            unit_meter[unit].append(meter)	
          else:
            unit_meter[unit] = [meter]
      #print("unit_meter: ",unit_meter)
      unit_avgMeter = {}
      for u in unit_meter:  
        #print("unit ", unit)
        meters = list(map(int, unit_meter[u]))
        #print("UM: ", unit_meter[unit])
        avg = sum(meters)/len(meters) if len(meters) > 0 else float('nan')
        unit_avgMeter[u.strip()] = avg
      return unit_avgMeter
   
avgs = dict()
avgs = measureAvgDistance("../Data/Shamela_Triples_Dist_cornuMeter")
print(avgs)
with open("../Data/distanceUnits_avgMeter", "w", encoding="utf8") as distMeter:
      json.dump(avgs, distMeter, ensure_ascii=False)
print("Done!")
