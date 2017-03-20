import json

with open("routes.json", "r", encoding="utf8") as f1:
    routes = json.loads(f1.read())

for i in routes["features"]:
    i["geometry"]["coordinates"] = [i["geometry"]["coordinates"][0], i["geometry"]["coordinates"][-1]]
    #input(i)
    # update the coordinates
    pass    

with open("places.geojson", "r", encoding="utf8") as f2:
    places = json.loads(f2.read())

for i in places["features"]:
    # update the coordinates
    pass

    

    




with open("routes.json", "w", encoding="utf-8") as f9a:
    json.dump(routes, f9a, indent=4, sort_keys=True, ensure_ascii=False)

    
with open("places.geojson", "w", encoding="utf-8") as f9b:
    json.dump(places, f9b, indent=4, sort_keys=True, ensure_ascii=False)

print("Done!")
