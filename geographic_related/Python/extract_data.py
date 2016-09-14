"""
To extract hierarchical (and distance) data in triples from a tagged text. 
This is the first script to get the data out of a text.
The output is a csv file, each line holding triples (REG/PROV, TYPE, REG/STTL or FROM, TO, DIST)
"""

import re

def extractTriples(fileName):
    """
    The main function to extract data
    """
    data = []
    with open(fileName, "r", encoding="utf8") as f1:
        f1 = f1.read().split("\n")
        for l in f1:
            # to include distances in extraction, remove PROV and REG strings in the below line
            if l.startswith("#$#FROM"):#PROV") or l.startswith("#$#REG"):
                l = l.split("#$#")[1:]

                val = l[2]
                valTag = val[:4]
                vals = val[4:].split("#")

                for v in vals:
                    newValue = "\t".join([l[0], l[1], valTag+v])
                    data.append(newValue)

        with open("../Data/" + fileName + "_Triples_Dist", "w", encoding="utf8") as f9:
            f9.write("\n".join(data))


extractTriples("../Data/Shamela_0023696")
print("Done!")
