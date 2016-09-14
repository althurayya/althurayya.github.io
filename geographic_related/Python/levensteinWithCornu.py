"""
Finding the similar sttl name with Cornu, using levenstein approach.

"""

import io
import csv, json
import sys

reload(sys)  
sys.setdefaultencoding('utf8')

def levenshtein_distance(first, second):
    if len(first) > len(second):
        first, second = second, first
    if len(second) == 0:
        return len(first)
    first_length = len(first) + 1
    second_length = len(second) + 1
    distance_matrix = [[0] * second_length for x in range(first_length)]
    for i in range(first_length):
       distance_matrix[i][0] = i
    for j in range(second_length):
       distance_matrix[0][j]=j
    for i in range(1, first_length):
        for j in range(1, second_length):
            deletion = distance_matrix[i-1][j] + 1
            insertion = distance_matrix[i][j-1] + 1
            substitution = distance_matrix[i-1][j-1]
            if first[i-1] != second[j-1]:
                substitution += 1
            distance_matrix[i][j] = min(insertion, deletion, substitution)
    return distance_matrix[first_length-1][second_length-1]

sttls =[]
with open('../Data/Shamela_0023696_Triples_H', 'r') as csvfile:
  reader = csv.reader(csvfile, delimiter=',', quotechar='|')
  #with open ('cornu.csv') as cornu:
    #data = csv.reader(cornu, delimiter=',', quotechar='|')
    #next(data, None)
  for row in reader:
      sttl = row[-1][4:].strip()
      #print("sttl in row" , cnt)
      with open ('cornu.csv') as cornu:
        data = csv.reader(cornu, delimiter=',', quotechar='|')
        next(data, None)
        for d in data:
          #print("d2 ",cnt1)
          if levenshtein_distance(d[2],sttl) <= 2:
            sttl = "-".join((sttl, d[2]))
            #print("sttl ", sttl)
            sttls.append(sttl) 
with io.open('../Data/levensteinWithCornu.txt', 'w', encoding='utf-8') as f:
  f.write(unicode("\n".join(sttls))) 
print("done!")    

