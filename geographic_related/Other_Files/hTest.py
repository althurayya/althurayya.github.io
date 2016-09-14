import re

#def findLines(fileName, lastElem)
    #lines = []
    #with open(fileName, "r", encoding="utf8") as f1:
        #f1 = f1.read().split("\n")
        #for l in f1:
            #if l[0] == lastElem
                

def buildHierarchies(fileName):
    data = []
    with open(fileName, "r", encoding="utf8") as f1:
        f1 = f1.read().split("\n")
        for currIndex, l in enumerate(f1):
          print("l: ",l)
          lS = l.split("\t")
          if lS[0].startswith("PROV"):
            print("ls: ", lS)
            #data.append(l)
            strToAppend = l
            print("append prov to data: ", data)
            if lS[-1].endswith("STTL"):
              print("l in STTL: " , data)
              continue
            else:
              #tmpLine = l
              #print(tmpLine[-1])
              llIndex = currIndex + 1
              for ll in f1[llIndex:]:
                print("ll")
                print(ll)
                if ll.split("\t")[0] == lS[-1]:
                  print("ll : ", ll)	
                  #tmpVal = ll.split("\t")[1:]
                  subIndex = ll.find("\t")
                  subStr = ll[subIndex:]
                  data.append(l + subStr)                  
                  print("data in startswith: ", data)

                  #print(tmpVal)
                  #tmpStr = ''.join(tmpLine) + ''.join(tmpVal)
                  #print("tmpLine")
                  #print(tmpLine)
                  #if tmpLine[-1].startswith("STTL"):
                   # data = data + tmpStr
                   # print("data") 
                   # print(data)
                   # break
                #  else:
                  
            #data.append(l)
        print("len f1" , len(f1))
        for d in data:
          last = d.split("\t")[-1]
          lineIndex = 0
          tmpData = []
          exist = False
          if not last.startswith("STTL"):
            while lineIndex < len(f1): 
              line = f1[lineIndex]         
              if line.startswith(last):
                print("line startswith last")
                exist = True
                i = line.find("\t")
                print("d+l[i:]: ", d + line[i:])
                data.append(d + line[i:])                  
                #lineIndex = f1.index(line)
              #else:
              lineIndex += 1 
            if exist == True:
              data.remove(d)
          print("data: " , data )
    with open(fileName+"_H", "w", encoding="utf8") as f10:
        f10.write("\n".join(data))

buildHierarchies("test_triples")
