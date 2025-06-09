const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Vytvoření připojení k databázi
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Chyba při připojení k databázi:', err.message);
  } else {
    console.log('Připojeno k SQLite databázi');
  }
});

module.exports = db;

