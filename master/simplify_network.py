import json

def manhattan(li1, li2):
    distA = li1[0] - li2[0]
    distB = li1[1] - li2[1]
    dist = distA + distB
    return(dist)

with open("places_full.geojson", "r", encoding="utf8") as f2:
    places = json.loads(f2.read())

pCoord = {}
for i in places["features"]:
    uri = i["properties"]["cornuData"]["cornu_URI"]
    pCoord[uri] = i["geometry"]["coordinates"]
    

with open("routes_full.json", "r", encoding="utf8") as f1:
    routes = json.loads(f1.read())

    nodesWeight = {}
    nodesEdges = {}
    edgeDic = {}
    
for i in routes["features"]:
    i["geometry"]["coordinates"] = [i["geometry"]["coordinates"][0], i["geometry"]["coordinates"][-1]]
    edgeKey = "@".join(sorted([i["properties"]["sToponym"], i["properties"]["eToponym"]]))
    i["properties"]["id_old"] = i["properties"]["id"]
    i["properties"]["id"] = edgeKey
    i["properties"]["status"] = ""
    i["properties"]["pathLengths"] = []
    i["properties"]["pathNodes"] = []
    

    #print(i)
    #print("==")
    #input(i)

    # this also removes cases when there are two paths between two points (4 cases only)
    if edgeKey in edgeDic:
##        print("%s is already in the dictionary" % edgeKey)
##        print(edgeDic[edgeKey])
##        print("===ERROR===")
##        print(i)
##        print(len(edgeDic))
        print("===ERROR===")
        pass
    else:
        edgeDic[edgeKey] = i

    # count nodes' weights
    if i["properties"]["sToponym"] in nodesWeight:
        nodesWeight[i["properties"]["sToponym"]] += 1
    else:
        nodesWeight[i["properties"]["sToponym"]]  = 1

    if i["properties"]["eToponym"] in nodesWeight:
        nodesWeight[i["properties"]["eToponym"]] += 1
    else:
        nodesWeight[i["properties"]["eToponym"]]  = 1
        
    # add all edges
    if i["properties"]["sToponym"] in nodesEdges:
        nodesEdges[i["properties"]["sToponym"]].append(i["properties"]["id"])
    else:
        nodesEdges[i["properties"]["sToponym"]]  = []
        nodesEdges[i["properties"]["sToponym"]].append(i["properties"]["id"])
        
    if i["properties"]["eToponym"] in nodesEdges:
        nodesEdges[i["properties"]["eToponym"]].append(i["properties"]["id"])
    else:
        nodesEdges[i["properties"]["eToponym"]]  = []
        nodesEdges[i["properties"]["eToponym"]].append(i["properties"]["id"])

    #input(nodesEdges)

edgesToExclude = []

import itertools

# TRYING TO REMOVE ROUTPOINTS
##print(len(routes["features"]))
##for k,v in nodesWeight.items():
##    if k.startswith("ROUTPOINT"):
##        # - pull out edges
##        # - generate combinations of edges
##        #print(nodesEdges[k])
##        newEdges = list(itertools.combinations(nodesEdges[k], 2))
##        for ne in newEdges:
##            temp = {"geometry": {"type": "LineString", "coordinates": [[0, 0], [0, 0]]},
##                    "properties": {"id_old": "NA", "sToponym": "", "Meter": 0, "eToponym": "", "id": ""},
##                    "type": "Feature"}
##            data = list(ne)
##            edgesToExclude.extend(data)
##            #input(edgesToExclude)
##            #print(data)
##
##            # temp: add new [se]Toponym (replacing ROUTPOINT)
##            #print(temp)
##            sToponym = data[0].replace(k, "").replace("_|_", "")
##            eToponym = data[1].replace(k, "").replace("_|_", "")
##            temp["properties"]["sToponym"] = sToponym
##            temp["properties"]["eToponym"] = eToponym
##
##            idNew = "_|_".join(sorted([temp["properties"]["sToponym"], temp["properties"]["eToponym"]]))
##            #print(idNew)
##
##            # Meter = from data[0] + from data[1]
##            # id_old > "NA"
##            temp["properties"]["id"] = idNew
##            temp["properties"]["id_old"] = "NA"
##            d1 = edgeDic[data[0]]["properties"]["Meter"]
##            d2 = edgeDic[data[1]]["properties"]["Meter"]
##            temp["properties"]["Meter"] = d1 + d2
##            # ~find the pair of coordinates with the shortest distance, exclude them (?)
##            # instead: grab the coordinates of the sToponym and eToponym
##            temp["geometry"]["coordinates"] = [pCoord[sToponym], pCoord[eToponym]]
##
##            #input(temp)
##
##            # add a new one to routes
##        routes["features"].append(temp)
##        #input(edgesToExclude)
##print(len(routes["features"]))
##print(temp)

# TRYING TO REMOVE NODES of WEIGHT 2
##print(len(routes["features"]))
##for k,v in nodesWeight.items():
##    if v > 2:
##        #print(k)
##        # - pull out edges
##        #input(nodesEdges[k])
##        for ne in nodesEdges[k]:
##            temp = {"properties": {"status": "", "Meter": 0, "pathNodes": [], "sToponym": "", "id": "", "eToponym": "", "pathLengths": [], "id_old": "NA"},
##                    "type": "Feature",
##                    "geometry": {"coordinates": [], "type": "LineString"}}
##            other = ne.replace(k, "").replace("@", "")
##            #input(ne)
##            print(other)
##            edgeOther = "@".join(sorted([k, other]))
##            #input(nodesEdges[edgeOther])
##            if nodesWeight[other] <= 2:
##                #input(nodesWeight[other])
##
####                testVal = 2
####                while testVal <= 2:
####                    pass
####                    # get the two edges
####                    # check if edges are processed; if so, `pass`
####                    # make sure that sToponym is `k`
####                    # eToponym is the one that is not shared between the two edges
####                    # create new edge with new data
####                    # tag the processed edges as processed
####
####                    # update testVal
####                    #node = ""
####                    #testVal = nodesWeight[node]
##
##                # temp: add new [se]Toponym (replacing ROUTPOINT)
##                #print(temp)
##                sToponym = data[0].replace(k, "").replace("@", "")
##                eToponym = data[1].replace(k, "").replace("@", "")
##                temp["properties"]["sToponym"] = sToponym
##                temp["properties"]["eToponym"] = eToponym
##
##                idNew = "@".join(sorted([temp["properties"]["sToponym"], temp["properties"]["eToponym"]]))
##                #print(idNew)
##
##                # Meter = from data[0] + from data[1]
##                # id_old > "NA"
##                temp["properties"]["id"] = idNew
##                temp["properties"]["id_old"] = "NA"
##                d1 = edgeDic[data[0]]["properties"]["Meter"]
##                d2 = edgeDic[data[1]]["properties"]["Meter"]
##                temp["properties"]["Meter"] = d1 + d2
##                # ~find the pair of coordinates with the shortest distance, exclude them (?)
##                # instead: grab the coordinates of the sToponym and eToponym
##                temp["geometry"]["coordinates"] = [pCoord[sToponym], pCoord[eToponym]]
##
##                #input(temp)
##
##                # add a new one to routes
##                routes["features"].append(temp)
##            #input(edgesToExclude)
print(len(routes["features"]))
#print(temp)

newRoutes = []
count = 0
for r in routes["features"]:
    if r["properties"]["id"] in edgesToExclude:
        count += 1
        #print(r["properties"]["id"])
        #newRoutes.append(r)
    else:
        newRoutes.append(r)

print(count)

routes["features"] = newRoutes
print(len(newRoutes))
print(len(routes["features"]))


##for k,v in nodesWeight.items():
##    if v > 2:
##        pass
##        
##    print(k)
##    print(nodesEdges[k])
##    input(v)

with open("routes.json", "w", encoding="utf-8") as f9a:
    json.dump(routes, f9a, indent=4, sort_keys=True, ensure_ascii=False)

    
with open("places.geojson", "w", encoding="utf-8") as f9b:
    json.dump(places, f9b, indent=4, sort_keys=True, ensure_ascii=False)

import shutil
shutil.copyfile("routes_full.json", "routes.json")
shutil.copyfile("places_full.geojson", "places.json")

print("Done!")
