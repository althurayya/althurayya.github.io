"""
Extracts distance units from distance triples of a geographic text.
The output is used in further analysis of route network.
"""
import re
import csv

def extractDistUnits(fileName):
    dists = []
    with open('../Data/Shamela_0023696_Triples_Dist', 'r') as triFile:
      triReader = csv.reader(triFile, delimiter='\t', quotechar='|')
      for tri in triReader:
          dist = tri[-1][4:].strip()
          unit = dist.split(' ')[-1]
          # To save just the distances
          if dist not in dists:
            dists.append(dist)
	  # To save the units. Needs to be refined
          #if unit not in dists:
          #  dists.append( "-".join([dist,unit]))

      with open("../Data/Distances", "w", encoding="utf8") as f9:
          f9.write("\n".join(dists))


extractDistUnits("../Data/Shamela_0023696_Triples_Dist")
print("Done!")
