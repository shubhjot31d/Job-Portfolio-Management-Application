const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

// // connect DATAbase
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://shubhjot:<password>@cluster0.jwpcdjy.mongodb.net/?retryWrites=true&w=majority";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);





// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// define routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/job', require('./routes/api/job'));
app.use('/api/aprofile', require('./routes/api/aprofile'));
app.use('/api/rprofile', require('./routes/api/rprofile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on Port ${PORT}`));