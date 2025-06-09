-- Vytvor tabulku "conferences"
CREATE TABLE IF NOT EXISTS conferences ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, 
  date TEXT NOT NULL
);

-- Vytvor tabulku "speakers"
CREATE TABLE IF NOT EXISTS speakers ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL
);

-- Vytvor tabulku "attendees"
CREATE TABLE IF NOT EXISTS attendees ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conference_id INTEGER NOT NULL,
  attendee_name TEXT NOT NULL,
  FOREIGN KEY (conference_id) REFERENCES conferences(id)
);


