import re

def buildHierarchies(fileName):
    data = []
    with open(fileName, "r", encoding="utf8") as f1:
        f1 = f1.read().split("\n")
        for currIndex, l in enumerate(f1):
            l = l.split("\t")
            if l[0].startswith("PROV"):
                if l[-1].endswith("STTL"):
                    data = data + l
                    continue
                else:
                    print("else1")
                    tmpLine = l
                    llIndex = currIndex + 1
                    for ll in f1[llIndex:]:
			    #llIndex = f1.index(ll)
			    #ll = ll.split("\t")
                        if ll.startswith(tmpLine[-1]):
                            tmpVal = ["\t"]+ll.split("\t")[1:]
                            tmpLine = tmpLine + tmpVal
                            if tmpLine[-1].startswith("STTL"):
                                data = data + tmpLine
                                break
			        #else: 
				 #   llIndex = f1.index
				    
				
				    
    with open(fileName+"_Hierarchies", "w", encoding="utf8") as f9:
        f9.write("\n".join(data))
                
                #input(vals)

#extractData("Shamela_0023696")
buildHierarchies("Shamela_0023696_Triples")
print("Done!")
