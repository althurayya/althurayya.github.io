import re
import csv, json
# To find the topURIs from cornu for the routes extracted from geographies
def extractTopURI(fileName, writer):
    with open(fileName, 'r') as triFile:
      triReader = csv.reader(triFile, delimiter='\t', quotechar='|')
      for tri in triReader:
          start = tri[0][4:].strip()
          to = tri[1][4:].strip()
          foundStart, foundTo = False, False
          with open('../Data/cornu_all_new2.json', 'r') as cornuFile:
            cornu = json.load(cornuFile)
            for cornuData in cornu['data']:
              if foundStart == False:
                if start == cornuData['arTitle'] or start in cornuData['arTitleOther'].split(', '):
                  startURI = cornuData['topURI']
                  foundStart = True
              if foundTo == False:
                if to == cornuData['arTitle'] or to in cornuData['arTitleOther'].split(', '):
                  toURI = cornuData['topURI']
                  foundTo = True
              if foundStart == True and foundTo == True:
                writer.writerow([start, startURI, to, toURI,  tri[-1][4:].strip()])
                break

with open("../Data/Shamela_0023696_Triples_Dist_TopURI", "w", encoding="utf8") as distURI:
      fWriter = csv.writer(distURI, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
      fWriter.writerow(["From", "FromUri", "To", "ToUri", "originalDist"])
      extractTopURI("../Data/Shamela_0023696_Triples_Dist", fWriter)
print("Done!")
