import json

old_file = r"C:\Users\RAKESH KUMAR\.gemini\antigravity\brain\b0134c06-e127-4dd5-b5ed-a94d48781c77\.system_generated\steps\335\output.txt"
new_file = r"C:\Users\RAKESH KUMAR\.gemini\antigravity\brain\b0134c06-e127-4dd5-b5ed-a94d48781c77\.system_generated\steps\451\output.txt"

with open(old_file, "r", encoding="utf-8") as f:
    old_data = json.load(f)

with open(new_file, "r", encoding="utf-8") as f:
    new_data = json.load(f)

old_proj = [p for p in old_data["projects"] if p["name"] == "projects/18213868054198356289"][0]
new_proj = [p for p in new_data["projects"] if p["name"] == "projects/18213868054198356289"][0]

old_screens = {s["id"]: s for s in old_proj.get("screenInstances", [])}
new_screens = {s["id"]: s for s in new_proj.get("screenInstances", [])}

added = set(new_screens.keys()) - set(old_screens.keys())
removed = set(old_screens.keys()) - set(new_screens.keys())
common = set(old_screens.keys()) & set(new_screens.keys())

print("Added Screens:")
for sid in added:
    print(f"  ID: {sid}, Dimensions: {new_screens[sid].get('width')}x{new_screens[sid].get('height')}")

print("\nRemoved Screens:")
for sid in removed:
    print(f"  ID: {sid}")

print("\nModified Screen Positions or Dimensions:")
for sid in common:
    old_s = old_screens[sid]
    new_s = new_screens[sid]
    diff = []
    if old_s.get("width") != new_s.get("width") or old_s.get("height") != new_s.get("height"):
        diff.append(f"size {old_s.get('width')}x{old_s.get('height')} -> {new_s.get('width')}x{new_s.get('height')}")
    if old_s.get("x") != new_s.get("x") or old_s.get("y") != new_s.get("y"):
        diff.append(f"pos ({old_s.get('x')},{old_s.get('y')}) -> ({new_s.get('x')},{new_s.get('y')})")
    if old_s.get("hidden") != new_s.get("hidden"):
        diff.append(f"hidden {old_s.get('hidden')} -> {new_s.get('hidden')}")
    if diff:
        print(f"  ID: {sid} - {', '.join(diff)}")
