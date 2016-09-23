"""
Replaces the classic distances with meter values. For example "عشرون مراحل" will be replaced by equivallent value in meters.
The calculations has been done before and here is available in a dictionary.
Tis script should be extended to check all the numerical values and units in original text. The values that we check here are just those mentioned in part of Al-Muqaddasi. 
Should eb generalized to include arbitrary units or numerical values.  
"""
import re
import csv, json



pluralUnits = {"أيام": "يوم","مراحل": "مرحلة", "اميال":"ميل", "فراسخ": "فرسخ"}
unit_distance = {"يوما": 28156.0,"يوم": 28156.0, "بريدا": 17060.5, "فرسخا": 2888.2, "مرحلتین": 70357.0, "میلا": 1941, "بريدين": 23504.153846153848,"مرحلة": 37987.00561797753, "يومين": 84568.0,  "فرسخ": 2888.2, "بريد": 17060.5, "مرحلتان": 70357.0, "ميل": 1941}
numbers = {"نصف": 0.5,"واحد": 1,"إثنان":2,"ثلاثة":3,"أربعة":4,"خمسة":5,"ستة":6,"سبعة":7,"ثمانية":8,"ثامن":8,"تسعة":9,"عشرة":10,"إحدى عشر":11,"إثنا عشر":12,"ثلاثة عشر":13,"أربعة عشر":14,"خمسة عشر":15,"ستة عشر":16,"سبعة عشر":17,"ثمانية عشر":18,"تسعة عشر":19,"عشرون":20,"واحد وعشرون":21,"إثنان وعشرون":22,"ثلاثة وعشرون":23,"أربعة وعشرون":34,"خمسة وعشرون":25,"ستة وعشرون":26,"سبعة وعشرون":27,"ثمانية وعشرون":28,"تسعة وعشرون":29,"ثلاثون":30,"واحدوثلاثون":31}

def replaceUnitsWithMeter(fileName, writer):
    """
    Checks the classic values with the given map (from classic to modern values) and replace them as distances in meter for route sections.
    """
    with open(fileName, 'r') as meterFile:
      distReader = csv.reader(meterFile, delimiter='\t', quotechar='|')
      #unit_meter = dict()
      next(distReader, None)
      for row in distReader:
          dist = row[-1][4:].strip()
          splitDist = dist.split(' ')
          if len(splitDist) == 1:
            if splitDist[0] in unit_distance:
              meter = unit_distance[splitDist[0]]
              writer.writerow([row[0][4:].strip(), row[1][4:].strip(), meter])
          elif len(splitDist) > 1:
            if re.search('[0-9]', splitDist[0]):
              if splitDist[1] in unit_distance:
                meter = float(splitDist[0]) * unit_distance[splitDist[1]]
                writer.writerow([row[0][4:].strip(), row[1][4:].strip(), meter]) 
              elif splitDist[1] in pluralUnits:
                single_unit = pluralUnits[splitDist[1]]
                meter = float(splitDist[0]) * unit_distance[single_unit]
                writer.writerow([row[0][4:].strip(), row[1][4:].strip(), meter]) 
            else:
              unit = next((y for y in splitDist if (y in unit_distance or y in pluralUnits)), None)
              if unit != None:
                unit_index = splitDist.index(unit)
                value = ' '.join(splitDist[:unit_index])
                if value in numbers: 
                  multiplyValue = numbers[value]
                  if splitDist[unit_index] in pluralUnits:
                    single_unit = pluralUnits[splitDist[unit_index]]
                    meter = numbers[value] * unit_distance[single_unit]
                  elif splitDist[unit_index] in unit_distance:
                    meter = numbers[value] * unit_distance[splitDist[unit_index]]
                  writer.writerow([row[0][4:].strip(), row[1][4:].strip(), meter])
                            


with open("../Data/tripleRoutes_withMeter", "w", encoding="utf8") as distMeter:
      fWriter = csv.writer(distMeter, delimiter=',',)
      #fWriter.writerow(["From", "To", "Distance_Meter"])
      replaceUnitsWithMeter("../Data/Shamela_0023696_Triples_Dist", fWriter)
print("Done!")
