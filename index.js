const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middlewire

app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);


var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-dw7wxlj-shard-00-00.uyzlba8.mongodb.net:27017,ac-dw7wxlj-shard-00-01.uyzlba8.mongodb.net:27017,ac-dw7wxlj-shard-00-02.uyzlba8.mongodb.net:27017/?ssl=true&replicaSet=atlas-85xndo-shard-0&authSource=admin&retryWrites=true&w=majority`;



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uyzlba8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db('kidsToy').collection('toy');
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('KIds toy market is running')
});


app.listen(port, ()=>{
    console.log(`Kids toy hut is running on port:${port}`)
});
