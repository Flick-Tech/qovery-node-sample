const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || "0.0.0.0"
const { MongoClient } = require("mongodb");

// Create a new MongoClient
const client = new MongoClient(process.env.MONGODB_URI);

async function start() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } catch (error) {
    await client.close();
    throw error;
  }

  express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, HOST, () => console.log(`Listening on ${ PORT }`))
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
})
