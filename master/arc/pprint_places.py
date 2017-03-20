import json

with open("places.geojson", "r", encoding="utf8") as f1:
    obj = json.loads(f1.read())
    with open("places.geojson", "w", encoding="utf-8") as f9:
        json.dump(obj, f9, indent=4, sort_keys=True, ensure_ascii=False)

print("Done!")
