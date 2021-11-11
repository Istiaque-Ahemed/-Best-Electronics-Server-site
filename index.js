const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://BestElectronics:PVMAcmrjiO2nBwh5@cluster0.cmhqh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('BestElectronics');
        productCollection = database.collection('products');
        const orderCollection = database.collection("orders");


        // GET SERVICES API`
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({})
            const products = await cursor.toArray();
            res.send(products)
        })
        // GET SINGLE DATA
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query);
            res.json(product)
        })
        // POST ORDER API
        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.json(result);
        })
        // GET ORDER API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const orders = await cursor.toArray();
            res.send(orders)
        })
        // GET MY ORDER API
        app.get("/orders/:email", async (req, res) => {
            const email = req.params.email;
            const result = await orderCollection.find({ email }).toArray();
            res.send(result);
        });
        // DELETE API MY ORDER
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello Istiaqie!')
})

app.listen(port, () => {
    console.log(' travle server Raning ', port)
})