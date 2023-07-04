const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    app.get('/toys', async(req, res)=>{
        const cursor = toyCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // To read some data/get some data

    app.get('/myToys', async(req, res)=>{
      console.log(req.query.email)
      let query = {}
      if(req.query?.email){
        query ={email: req.query.email}
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/toy', async(req, res)=>{
      const toy = req.body;
      console.log(toy);
      const result = await toyCollection.insertOne(toy);
      res.send(result);
    })

    app.put('/singleToy/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options ={upsert: true};
      const updateToy = req.body;
      const toy = {
        $set:{
          price: updateToy.price,
          quantity: updateToy.quantity,
          details: updateToy.details,
        }
      }
      const result = await toyCollection.updateOne(filter, toy, options);
      res.send(result);
    })

    app.delete('/toys/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toyCollection.deleteOne(query);
      res.send(result);

    })

    app.delete('/myToys/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toyCollection.deleteOne(query);
      res.send(result);

    })

  app.get('/singleToy/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await toyCollection.findOne(query);
    res.send(result);
  })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('KIds toy market is running')
});


app.listen(port, ()=>{
    console.log(`Kids toy hut is running on port:${port}`)
});
