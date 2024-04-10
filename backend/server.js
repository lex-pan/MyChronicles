const express = require('express');
const app = express();
const { Pool } = require('pg');
require('dotenv').config();
const connectionString = process.env.connectionString;

const web_extension_url_database = new Pool({
    connectionString
})

app.get('/', async (req, res) => {
  try {
    const result = await web_extension_url_database.query('SELECT * FROM url_selection');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});