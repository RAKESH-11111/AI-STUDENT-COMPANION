const fs = require('fs');

const oldFile = "C:\\Users\\RAKESH KUMAR\\.gemini\\antigravity\\brain\\b0134c06-e127-4dd5-b5ed-a94d48781c77\\.system_generated\\steps\\335\\output.txt";
const newFile = "C:\\Users\\RAKESH KUMAR\\.gemini\\antigravity\\brain\\b0134c06-e127-4dd5-b5ed-a94d48781c77\\.system_generated\\steps\\451\\output.txt";

const oldData = JSON.parse(fs.readFileSync(oldFile, 'utf-8'));
const newData = JSON.parse(fs.readFileSync(newFile, 'utf-8'));

const oldProj = oldData.projects.find(p => p.name === "projects/18213868054198356289");
const newProj = newData.projects.find(p => p.name === "projects/18213868054198356289");

const oldScreens = {};
oldProj.screenInstances.forEach(s => { oldScreens[s.id] = s; });

const newScreens = {};
newProj.screenInstances.forEach(s => { newScreens[s.id] = s; });

const added = Object.keys(newScreens).filter(id => !oldScreens[id]);
const removed = Object.keys(oldScreens).filter(id => !newScreens[id]);
const common = Object.keys(newScreens).filter(id => oldScreens[id]);

console.log("Added Screens:");
added.forEach(id => {
  console.log(`  ID: ${id}, Dimensions: ${newScreens[id].width}x${newScreens[id].height}`);
});

console.log("\nRemoved Screens:");
removed.forEach(id => {
  console.log(`  ID: ${id}`);
});

console.log("\nModified Screen Positions or Dimensions:");
common.forEach(id => {
  const oldS = oldScreens[id];
  const newS = newScreens[id];
  const diff = [];
  if (oldS.width !== newS.width || oldS.height !== newS.height) {
    diff.push(`size ${oldS.width}x${oldS.height} -> ${newS.width}x${newS.height}`);
  }
  if (oldS.x !== newS.x || oldS.y !== newS.y) {
    diff.push(`pos (${oldS.x},${oldS.y}) -> (${newS.x},${newS.y})`);
  }
  if (oldS.hidden !== newS.hidden) {
    diff.push(`hidden ${oldS.hidden} -> ${newS.hidden}`);
  }
  if (diff.length > 0) {
    console.log(`  ID: ${id} - ${diff.join(', ')}`);
  }
});
