const express = require('express');
const app = express();
const { Pool } = require('pg');
require('dotenv').config();
const cors = require('cors');
const connectionString = process.env.connectionString;
app.use(cors());
const web_extension_url_database = new Pool({
    connectionString
})

app.get('/', async (req, res) => {
  try {
    const website_parse_info = await web_extension_url_database.query(`SELECT * FROM url_selection`);
    res.json(website_parse_info.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/url/:domain', async (req, res) => {
  const domain = req.params.domain;
  try {
    const website_parse_info = await web_extension_url_database.query(`SELECT * FROM url_selection WHERE domain = '${domain}'`);
    res.json(website_parse_info.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});