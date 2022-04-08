const express = require('express')
const path = require('path')
const { createClient } = require('redis');
const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || "0.0.0.0"
const { MongoClient } = require("mongodb");

// Create a new MongoClient
const client = new MongoClient(process.env.MONGODB_URI);

const connectToRedis = async () => {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  client.on('error', (err) => {
    console.log('Redis Client Error', err);
  });

  await client.connect();

  await client.ping()

  console.log('Successfully connected to Redis DB')
}

const connectToMongoDB = async () => {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to mongodb server");
  } catch (error) {
    await client.close();
    throw error;
  }
}

async function start() {
  await connectToMongoDB();
  await connectToRedis();

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
