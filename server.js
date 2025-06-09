const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const apiRoutes = require('./api/api');


const db = new sqlite3.Database('./database/database.sqlite', (err) => {
  if (err) {
    console.error('Chyba při připojení k databázi:', err.message);
  } else {
    console.log('Připojeno k SQLite databázi'); 
    initDatabase(); 
  }
});

function initDatabase() {
  const fs = require('fs');
  
  const schemaSQL = fs.readFileSync('./database/schema.sql', 'utf8');
  db.exec(schemaSQL, (err) => {
    if (err) {
      console.error('Chyba při vytváření schématu:', err.message);
    } else {
      console.log('Databázové schéma vytvořeno');
      
      db.get('SELECT COUNT(*) as count FROM conferences', [], (err, row) => {
        if (err || row.count === 0) {
          try {
            const seedSQL = fs.readFileSync('./database/seed.sql', 'utf8');
            db.exec(seedSQL, (err) => {
              if (err) {
                console.error('Chyba při vkládání seed dat:', err.message);
              } else {
                console.log('Seed data vložena');
              }
            });
          } catch (e) {
            console.log('Seed soubor nenalezen nebo nelze načíst');
          }
        }
      });
    }
  });
}


module.exports.db = db;


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', apiRoutes);


app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});

