const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require("colors");
require('dotenv').config();
const service = require('./services.json');
// console.log(service)
//middleware -------
app.use(cors());
app.use(express.json());


// mongodb -----
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.VISA_USER}:${process.env.VISA_SECRET}@cluster0.zwgt8km.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        app.get("/", (req, res) => {
            res.send("Bismillahir Rahmainr Rahim, from:- Sofi Visa Hub, SERVER-SIDE");
        });

        app.get("/services", (req, res) => {
            res.send({
                success: true,
                message: "Successfully got services data",
                data: service
            });
        });
    }
    catch (error) {
        console.log(`error from under function try> catch ${error}`);
        res.send({
            success: false,
            error: error?.message || "error from try> catch "
        })
    };




};

run().catch(error => console.log(`error from run function catch: ${error}`.bgYellow))



app.listen(port, () => {
    console.log(`Sofi Visa Hub Server Runnig on Port:${port}.`.bgCyan)
})