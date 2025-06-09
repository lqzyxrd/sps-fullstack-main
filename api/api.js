const express = require('express');
const db = require('../database/db');

const router = express.Router();

router.get('/conferences', (req, res) => {
  db.all('SELECT * FROM conferences', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/conferences/:id', (req, res) => {
  db.get('SELECT * FROM conferences WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Conference not found' });
    res.json(row);
  });
});

router.post('/conferences', (req, res) => {
  const { name, date } = req.body;
  db.run(
    'INSERT INTO conferences (name, date) VALUES (?, ?)',
    [name, date],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, date });
    }
  );
});

router.put('/conferences/:id', (req, res) => {
  const { name, date } = req.body;
  db.run(
    'UPDATE conferences SET name = ?, date = ? WHERE id = ?',
    [name, date, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Conference not found' });
      res.json({ id: req.params.id, name, date });
    }
  );
});

router.delete('/conferences/:id', (req, res) => {
  db.run('DELETE FROM conferences WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Conference not found' });
    res.json({ message: 'Conference deleted' });
  });
});

router.get('/speakers', (req, res) => {
  db.all('SELECT * FROM speakers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/speakers/:id', (req, res) => {
  db.get('SELECT * FROM speakers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Speaker not found' });
    res.json(row);
  });
});

router.post('/speakers', (req, res) => {
  const { firstname, lastname } = req.body;
  db.run(
    'INSERT INTO speakers (firstname, lastname) VALUES (?, ?)',
    [firstname, lastname],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, firstname, lastname });
    }
  );
});

router.put('/speakers/:id', (req, res) => {
  const { firstname, lastname } = req.body;
  db.run(
    'UPDATE speakers SET firstname = ?, lastname = ? WHERE id = ?',
    [firstname, lastname, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Speaker not found' });
      res.json({ id: req.params.id, firstname, lastname });
    }
  );
});

router.delete('/speakers/:id', (req, res) => {
  db.run('DELETE FROM speakers WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Speaker not found' });
    res.json({ message: 'Speaker deleted' });
  });
});

router.get('/attendees', (req, res) => {
  db.all('SELECT a.*, c.name as conference_name FROM attendees a JOIN conferences c ON a.conference_id = c.id', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/attendees', (req, res) => {
  const { attendee_name, conference_id } = req.body;
  
  if (!attendee_name || !conference_id) {
    return res.status(400).json({ error: 'Jméno účastníka a ID konference jsou povinné' });
  }
  
  // Nejprve ověříme, zda konference existuje
  db.get('SELECT id FROM conferences WHERE id = ?', [conference_id], (err, conference) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!conference) return res.status(404).json({ error: 'Konference nebyla nalezena' });
    
    // Pokud konference existuje, přidáme účastníka
    db.run(
      'INSERT INTO attendees (conference_id, attendee_name) VALUES (?, ?)',
      [conference_id, attendee_name],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // Vrátíme nově vytvořeného účastníka včetně názvu konference
        db.get(
          'SELECT a.*, c.name as conference_name FROM attendees a JOIN conferences c ON a.conference_id = c.id WHERE a.id = ?',
          [this.lastID],
          (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json(row);
          }
        );
      }
    );
  });
});

router.put('/attendees/:id', (req, res) => {
  const { attendee_name, conference_id } = req.body;
  
  if (!attendee_name || !conference_id) {
    return res.status(400).json({ error: 'Jméno účastníka a ID konference jsou povinné' });
  }
  
  db.run(
    'UPDATE attendees SET conference_id = ?, attendee_name = ? WHERE id = ?',
    [conference_id, attendee_name, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Účastník nebyl nalezen' });
      
      // Vrátíme aktualizovaného účastníka včetně názvu konference
      db.get(
        'SELECT a.*, c.name as conference_name FROM attendees a JOIN conferences c ON a.conference_id = c.id WHERE a.id = ?',
        [req.params.id],
        (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(row);
        }
      );
    }
  );
});

router.delete('/attendees/:id', (req, res) => {
  db.run('DELETE FROM attendees WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Attendee not found' });
    res.json({ message: 'Attendee deleted' });
  });
});

module.exports = router;



