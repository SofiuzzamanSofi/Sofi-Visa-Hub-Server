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
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.VISA_USER}:${process.env.VISA_SECRET}@cluster0.zwgt8km.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    const database = client.db("sofi-visa-hub-server");
    const servicesCollection = database.collection("services");
    // console.log(servicesCollection);

    try {

        app.get("/", (req, res) => {
            res.send("Bismillahir Rahmainr Rahim, from:- Sofi Visa Hub, SERVER-SIDE");
        });

        app.get("/services", async (req, res) => {
            const pageNo = parseInt(req?.query?.pageNo);
            const perPageContentSize = parseInt(req?.query?.perPageContentSize);
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.skip(pageNo * perPageContentSize).limit(perPageContentSize).toArray();
            const count = await servicesCollection.countDocuments();
            res.send({
                success: true,
                message: "Successfully got services data",
                count: count,
                data: services
            });
        });

        app.get("/service/:id", async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) }
            // const { id } = req.params;
            // const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send({
                success: true,
                message: "Successfully got the service by id",
                data: service
            })
        })

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