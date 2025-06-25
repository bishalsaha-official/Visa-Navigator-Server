const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json());
require('dotenv').config()

app.get('/', (req, res) => {
  res.send('Visa Navigator Is Running Successfully')
})

// Mongo DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxyklbs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
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
    await client.connect();
    const visaCollection = client.db("VisaDb").collection("visas");
    const appliedVisaCollection = client.db("VisaDb").collection("appliedVisa");

    // Get All Visa
    app.get('/visas', async (req, res) => {
      const allVisa = await visaCollection.find().toArray()
      res.send(allVisa)
    })

    // Get Individual visa item using id
    app.get('/visas/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const newVisa = await visaCollection.find(query).toArray();
      res.send(newVisa)
    })

    // Get My Application Visa data
    app.get('/appliedvisa', async (req, res) => {
      const allApplication = await appliedVisaCollection.find().toArray()
      res.send(allApplication)
    })

    app.get('/appliedvisa/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const newApplication = await appliedVisaCollection.find(query).toArray();
      res.send(newApplication)
    })

    // Post Visa From Add visa Component
    app.post('/visas', async (req, res) => {
      const newVisa = req.body
      const result = await visaCollection.insertOne(newVisa);
      res.send(result)
    })

    // Post Applied Visa
    app.post('/appliedvisa', async (req, res) => {
      const newAppliedVisa = req.body
      const result = await appliedVisaCollection.insertOne(newAppliedVisa);
      res.send(result)
    })

    // Update Item
    app.put('/visas/:id', async (req, res) => {
      const id = req.params.id
      const updateData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          photoUrl: updateData.photoUrl,
          countryName: updateData.countryName,
          visaType: updateData.visaType,
          fee: updateData.fee,
          processingTime: updateData.processingTime,
          applicationMethod: updateData.applicationMethod,
          visaValidity: updateData.visaValidity,
        },
      };
      const result = await visaCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    // Delete my added visa
    app.delete('/visas/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.deleteOne(query);
      res.send(result)
    })

    app.delete('/appliedvisa/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await appliedVisaCollection.deleteOne(query);
      res.send(result)
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


app.listen(port, () => {
  console.log(`Visa Navigator Server Running on port ${port}`)
})
