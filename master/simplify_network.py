import json

with open("routes_full.json", "r", encoding="utf8") as f1:
    routes = json.loads(f1.read())

    nodesWeight = {}
    edgeDic = {}
    

for i in routes["features"]:
    edgeKey = i["properties"]["sToponym"]+"@"+i["properties"]["eToponym"]
    if edgeKey in edgeDic:
        print("%s is already in the dictionary" % edgeKey)
        print(edgeDic[edgeKey])
        print(len(edgeDic))
        print("===ERROR===")
    else:
        edgeDic[edgeKey] = i

        
    #input(edgeKey)
    #input(i)
    i["geometry"]["coordinates"] = [i["geometry"]["coordinates"][0], i["geometry"]["coordinates"][-1]]
    #input(i["properties"]["sToponym"])

    # count nodes' weights
    if i["properties"]["sToponym"] in nodesWeight:
        nodesWeight[i["properties"]["sToponym"]] += 1
    else:
        nodesWeight[i["properties"]["sToponym"]]  = 1

    if i["properties"]["eToponym"] in nodesWeight:
        nodesWeight[i["properties"]["eToponym"]] += 1
    else:
        nodesWeight[i["properties"]["eToponym"]]  = 1    
        
    # update the coordinates
    pass    

with open("places_full.geojson", "r", encoding="utf8") as f2:
    places = json.loads(f2.read())

for i in places["features"]:
    # update the coordinates
    pass

    

    




with open("routes.json", "w", encoding="utf-8") as f9a:
    json.dump(routes, f9a, indent=4, sort_keys=True, ensure_ascii=False)

    
with open("places.geojson", "w", encoding="utf-8") as f9b:
    json.dump(places, f9b, indent=4, sort_keys=True, ensure_ascii=False)

print("Done!")
