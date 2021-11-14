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
        const productCollection = database.collection('products');
        const orderCollection = database.collection("orders");
        const reviewCollection = database.collection("reviews")
        const usersCollection = database.collection("users")


        // GET PRODUCT API`
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({})
            const products = await cursor.toArray();
            res.send(products)
        })
        // Get post api
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.json(result)
        })
        //DELETE PRODUCT API
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result);
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
        //  REVIEWS POST API 
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })
        //GET REVIEWS API
        app.get("/reviews", async (req, res) => {
            const cursor = reviewCollection.find({})
            const reviews = await cursor.toArray()
            res.send(reviews)
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
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;

            }
            res.json({ admin: isAdmin });
        })
        //USERS POST API
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            console.log(result);
            res.json(result)
        })
        app.put("/users", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })
        app.put("/users/admin", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)
        })
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