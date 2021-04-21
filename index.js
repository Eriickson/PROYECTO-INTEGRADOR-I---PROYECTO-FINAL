const sectors = require("./data/sectors.json");
const fs = require("fs");

async function main() {
  const newSectors = sectors.map(sector => ({ label: sector.label, municipality: sector.municipality }));
  console.log(newSectors);
  var json = JSON.stringify(newSectors);
  fs.writeFile("myjsonfile.json", json, "utf8", () => {});
}

main();
