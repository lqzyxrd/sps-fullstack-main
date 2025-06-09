const db = require("./db");
const fs = require("fs");
const path = require("path");


const seedSQL = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8");


db.exec(seedSQL, (err) => {
  if (err) {
    console.error("Error seeding database:", err.message);
    process.exit(1);
  } else {
    console.log("Database seeded successfully.");
    process.exit(0);
  }
});
