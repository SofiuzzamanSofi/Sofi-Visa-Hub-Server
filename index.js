const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require("colors");
require('dotenv').config();

//middleware -------
app.use(cors());
app.use(express.json());


// mongodb -----
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.VISA_USER}:${process.env.VISA_SECRET}@cluster0.zwgt8km.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




app.get("/", (req, res) => {
    res.send("Bismillahir Rahmainr Rahim, from:- Sofi Visa Hub, SERVER-SIDE");
});

app.listen(port, () => {
    console.log(`Sofi Visa Hub Server Runnig on Port:${port}.`.bgCyan)
})