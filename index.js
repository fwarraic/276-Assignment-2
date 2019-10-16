const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000
var app = express();
const { Pool } = require('pg');
var JSAlert = require("js-alert");

var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {res.render('pages/tokimon')}); // Renders Home Page
app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
app.get('/addTokimon', (req,res) => { res.render('pages/newTokimon')}); // Renders Add new Tokimon page
app.get('/searchResult', (req,res) => { res.render('pages/searchResult')});
app.get('/deleteTokimon', (req,res) => { res.render('pages/deleteTokimon')});
app.get('/tokidex', (req,res) => {
  var displayTable = `SELECT * FROM tokimon`;
  pool.query(displayTable, function(error, result){
  if (error) throw error;
  res.render('pages/tokidex', { tokiVin: result.rows})
 });
});
app.get('/typeChart', (req,res) => { res.render('pages/typeChart')});
app.post('/searchResult', (req,res) => {
  var tName = req.body.searchName;
  var findTokimon = `SELECT * FROM tokimon WHERE name = '${tName}';`;
  pool.query(findTokimon, function(error, result){
  if(error) throw error;
  res.render('pages/searchResult', {tokiDel: result.rows});
  });
});

app.post('/editTokimon', (req,res) => {
  var name = req.body.name;

  var findTokimon = `SELECT * FROM tokimon WHERE name = '${name}';`;
  pool.query(findTokimon, function(error, result){
  if(error) throw error;
  res.render('pages/editTokimon', {tokiEdit: result.rows});
  });
});

app.post('/editAndDelete', (req,res) => {
  var name = req.body.name;
  var deleteQuery = `DELETE FROM tokimon WHERE name = '${name}'`;
  pool.query(deleteQuery, function(err){
    if(err) throw err;
  })

  var query = "INSERT INTO tokimon (name, weight, height, fly, fight, fire, water, electric, ice, total, trainerName) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
  var weight = req.body.weight;
  var height = req.body.height;
  var fly = req.body.fly;
  var fight = req.body.fight;
  var fire = req.body.fire;
  var water = req.body.water;
  var electric = req.body.electric;
  var ice = req.body.ice;
  var trainerName = req.body.trainerName;
  var total = parseInt(fly) + parseInt(fight) + parseInt(fire) + parseInt(water) + parseInt(electric) + parseInt(ice);
  var tokimon = [name, weight, height, fly, fight, fire, water, electric, ice, total, trainerName];
  pool.query(query, tokimon, function(error){
      if(error)
        throw error;
      else {
        res.redirect('/tokidex');
        res.end();
      }
    });
});

app.post('/deleteTokimon', (req,res) => {
  var name = req.body.name;
  var deleteQuery = `DELETE FROM tokimon WHERE name = '${name}'`;
  pool.query(deleteQuery, function(error){
  if(error) throw error;
  else {

    /*    popup.alert({
          content: 'Tokimon deleted successfully!'
        });*/
        res.redirect('/deleteTokimon');
        res.end();
  }
    });
});

app.post('/addTokimon', (req, res) => {
  var query = "INSERT INTO tokimon (name, weight, height, fly, fight, fire, water, electric, ice, total, trainerName) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
  var name = req.body.name;
  var weight = req.body.weight;
  var height = req.body.height;
  var fly = req.body.fly;
  var fight = req.body.fight;
  var fire = req.body.fire;
  var water = req.body.water;
  var electric = req.body.electric;
  var ice = req.body.ice;
  var trainerName = req.body.trainerName;
  var total = parseInt(fly) + parseInt(fight) + parseInt(fire) + parseInt(water) + parseInt(electric) + parseInt(ice);
  var tokimon = [name, weight, height, fly, fight, fire, water, electric, ice, total, trainerName];
  pool.query(query, tokimon, function(error){
      if(error)
        throw error;
      else {
        JSAlert.alert("Tokimon added successfully!", "Add Tokimon", "Okay");
        res.redirect('/addTokimon');
        res.end();
      }
    });
  });

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));